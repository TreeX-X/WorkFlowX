# Module 05: Parallel Setup (Optimized: Graph-Based Task Pool)

> **Trigger**: `/xwhole -parallel` triggered, execute after environment init (Module 01)

## Prerequisites Check (HARD REQUIREMENT — NO FALLBACK)

1. **Check Agent Teams environment**
   - Claude Code v2.1.32+
   - Environment variable `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
   - `teammateMode: "in-process"` in settings.json

2. **If prerequisites NOT met → ABORT immediately**
   - Do NOT fall back to Mode A/B
   - Do NOT proceed without Agent Teams
   - Output error: `❌ Agent Teams not available. -parallel requires CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 and teammateMode="in-process". Aborting.`
   - Delete workflow lock and terminate

## Team Creation Flow

### Step 1: Parse Parameters (Using Precompiled Regex)

```
/xwhole -parallel [-N] [-box sandbox-name] [-team team-name] [requirement]

Parsed (stored in sessionParams object):
- mode: xwhole (with -parallel flag)
- N: max iteration rounds (default 2)
- box: sandbox branch name (optional, enables dual-layer isolation)
- team: team name (default: "workflow-{timestamp}")
- requirement: requirement description
```

### Step 2: Generate Hybrid Tree

- If Hybrid Tree already exists → use directly
- If not → follow Mode B minimal Hybrid Tree auto-generation flow

### Step 3: Create Agent Team

Use the `TeamCreate` tool to create the team:

```
TeamCreate(
  team_name="{team-name}",
  description="Parallel workflow for {requirement}"
)
```

This creates:
- Team config at `~/.claude/teams/{team-name}/config.json`
- Task list directory at `~/.claude/tasks/{team-name}/`

### Step 4: Create Tasks in Task Pool (Optimized: Dependency Graph)

Read Parent Section 7 to get all Children, then use `TaskCreate` for each:

```
For each Child in Parent Section 7:
  TaskCreate(
    subject="Implement {child-scope}",
    description="Parent: {parent-path}\nChild: {child-path}\nAC: {ac-list}"
  )
```

Store the returned task IDs for dependency setup and assignment.

**Build Dependency Graph**:
```javascript
// Adjacency list: parent → [dependents]
adj = {};
// In-degree map: child → dependency count
in_degree = {};
// Per-child iteration counters
child_iterations = {};

// Initialize
for (child of children) {
  in_degree[child] = 0;
  adj[child] = [];
  child_iterations[child] = { used: 0, remaining: sessionParams.iteration_limit };
}

// Build edges from Section 8.3
for (edge of dependencies) {
  adj[edge.parent].push(edge.child);
  in_degree[edge.child]++;
}
```

### Step 5: Set Up Dependencies

Read Parent Section 8.3 for cross-branch dependencies. For each dependency:

```
TaskUpdate(
  taskId="{dependent-task-id}",
  addBlockedBy=["{dependency-task-id}"]
)
```

### Step 6: Spawn Teammates

**Teammate count rules**:
- Minimum 2 (1 coder + 1 evaluator)
- Maximum 6 (3 coder + 3 evaluator)
- 1 coder+evaluator pair per 2-3 Children

**In-process mode**: Teammates run within the same session. They go idle between turns automatically. Use `SendMessage` to wake them.

Use the `Agent` tool with `team_name` and `name` parameters:

```
# Spawn coder teammates (in-process)
Agent(
  subagent_type="coder-teammate",
  name="coder-1",
  team_name="{team-name}",
  description="Coder teammate for parallel implementation",
  prompt="You are coder-1 in team '{team-name}'. Your workflow:
1. Read TaskList to find ready tasks (status='pending', no owner)
2. Claim a task: TaskUpdate(taskId=X, owner='coder-1', status='in_progress')
3. Read Parent + Child hybrid docs from the task description
4. Implement code following codex-spec-implementation skill
5. When done: TaskUpdate(taskId=X, status='completed') then SendMessage to orchestratorX with completion summary
6. Check TaskList for next available task
If no ready tasks, wait for new messages."
)

# Spawn evaluator teammates (in-process)
Agent(
  subagent_type="evaluator-teammate",
  name="evaluator-1",
  team_name="{team-name}",
  description="Evaluator teammate for parallel review",
  prompt="You are evaluator-1 in team '{team-name}'. Your workflow:
1. Wait for evaluation requests from orchestratorX via SendMessage
2. When received: read Parent + Child hybrid docs, check git diff
3. Evaluate against acceptance criteria
4. Output Evaluation Result Payload
5. SendMessage result back to orchestratorX
6. Go idle until next request"
)
```

For larger teams, spawn additional pairs:
```
Agent(subagent_type="coder-teammate", name="coder-2", team_name="{team-name}", ...)
Agent(subagent_type="evaluator-teammate", name="evaluator-2", team_name="{team-name}", ...)
```

### Step 7: Initial Task Assignment (Optimized: Critical Path Priority)

Assign `ready` tasks (no blockers) to coder teammates using `TaskUpdate`:

```
// Sort by critical path priority
ready_tasks.sort((a, b) => {
  const scoreA = dependents_count[a] + (1 / chain_position[a]);
  const scoreB = dependents_count[b] + (1 / chain_position[b]);
  return scoreB - scoreA; // Higher priority first
});

For each ready task (in priority order):
  TaskUpdate(
    taskId="{task-id}",
    owner="coder-{N}",
    status="in_progress"
  )
```

Notify coders via `SendMessage`:

```
SendMessage(
  to="coder-{N}",
  summary="Assign task {task-id}",
  message="Task {task-id} assigned. Read the Parent and Child hybrid docs, then implement. Mark task completed via TaskUpdate when done."
)
```

### Step 8: Output Status

After setup completes, output:

```
✅ Agent Team created
   Team: {team-name}
   Teammates: {count}

📊 Task pool initialized (dependency graph mode)
   Total: {total}
   Ready: {ready-count} (in_degree == 0)
   Blocked: {blocked-count} (in_degree > 0)
   Dependency edges: {edge-count}

🚀 Dispatching ready tasks to coders (priority order)...
```

Then enter **Module 06: Task Coordination** for dynamic scheduling.
