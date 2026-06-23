# Module 06: Task Coordination (Optimized: Graph-Based Scheduling)

> **Trigger**: After Module 05 completes, runs continuously until all tasks complete or user interrupts

## Team Lead Responsibilities

Main Agent as Team Lead:

1. **Task scheduling**: Based on dependency graph's ready queue scheduling
2. **File conflict check**: Before assignment, check file overlap
3. **Requirement change handling**: Receive user input, update Hybrid Tree
4. **Progress monitoring**: Report progress, handle exceptions

**Rule**: Teammates only claim tasks, complete tasks, and report results. All scheduling logic is managed by Team Lead.

## Core Coordination Loop (Optimized: Graph-Based)

The coordination loop is **event-driven**. Teammates send messages to the Team Lead when they complete work. Main Agent processes each message and dispatches the next action.

### Step 1: Wait for Teammate Messages

After initial dispatch (Module 05), Main Agent waits for teammate messages. Messages arrive automatically as conversation turns — no polling needed.

When a message arrives from a teammate, proceed to Step 2.

### Step 2: Process Completion (Optimized: Dependency Graph Update)

When a coder-teammate reports task completion:

1. **Verify completion**: Read the teammate's message for Change Summary
2. **Load Module 02**: Validate the Bus Payload format (fast-path for known-good)
3. **Dispatch evaluator**: Send evaluation request to evaluator-teammate

```
SendMessage(
  to="evaluator-1",
  summary="Evaluate task {task-id}",
  message="Please evaluate the implementation for task {task-id}. Read Parent and Child hybrid docs, check git diff, and output Evaluation Result Payload."
)
```

When an evaluator-teammate reports evaluation result:

1. **Load Module 03**: Post-evaluation document update (incremental, with real timestamps, AC checkbox, status update)
2. **Check result**:
   - **PASS**: Mark task as completed, update dependency graph, unlock dependents
   - **Needs Fix**: Send fix instructions back to coder (if iteration limit not reached)

```
# On PASS:
TaskUpdate(taskId="{task-id}", status="completed")

# Update dependency graph
for (dependent in adj[completed_task]) {
  in_degree[dependent]--;
  if (in_degree[dependent] == 0) {
    // Enqueue to ready queue
    ready_queue.push(dependent);
  }
}

# On Needs Fix (within iteration limit):
child_iterations[task_id].used++;
child_iterations[task_id].remaining--;
SendMessage(
  to="coder-{N}",
  summary="Fix instructions for task {task-id}",
  message="Evaluation found issues. Fix instructions:\n{fix-instructions}\nPlease fix and re-submit."
)

# On Needs Fix (iteration limit reached):
TaskUpdate(taskId="{task-id}", status="failed")
Report to user: "Task {task-id} failed after {N} iterations"
```

### Step 3: Unlock Dependencies (Optimized: O(1) Lookup)

After marking a task as completed:

```
// Instead of scanning all tasks, use adjacency list
for (dependent of adj[completed_task_id]) {
  in_degree[dependent]--;
  if (in_degree[dependent] == 0) {
    TaskUpdate(taskId="{dependent-id}", status="pending")
    ready_queue.push(dependent);
  }
}
```

### Step 4: File Conflict Check

Before assigning a newly ready task:

```
1. Read the task's Child Section 8.1 (file index)
2. Read TaskList to find all in_progress tasks
3. For each in_progress task, read its Child Section 8.1
4. If file overlap detected: skip assignment, leave task as pending
5. If no overlap: proceed to assignment
```

**Conflict rule**: Exact file path match = conflict. Same directory, different files = no conflict.

### Step 5: Assign Ready Tasks (Priority-Based)

Find all pending (unblocked, no file conflict) tasks and assign to idle coders:

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
  SendMessage(
    to="coder-{N}",
    summary="New task {task-id}",
    message="Task assigned: {task-id}\nParent: {parent-path}\nChild: {child-path}\nRead docs and implement. Mark completed via TaskUpdate when done."
  )
```

**Assignment priority**: Tasks with higher impact score first (more dependents + closer to critical path).

### Step 6: Evaluator Dispatch After All Coders Done

When all currently assigned coder tasks are completed/evaluated:

```
1. Check if any tasks remain (status != "completed" and status != "failed")
2. If yes: unlock newly ready tasks, loop to Step 5
3. If no: proceed to completion
```

### Step 7: Report Progress

After each evaluation cycle, output progress:

```
📊 Progress: {completed}/{total} done | {inProgress} in progress | {readyQueue} ready | {blocked} blocked
```

## Requirement Change Handling

Follow main SKILL.md Requirement Change Handling.

**Agent Teams specifics**:
- Changes update Hybrid Tree directly
- Teammates see latest docs on next task claim
- If change affects in_progress task:
  - Non-urgent: update docs, handle after current completion
  - Urgent: send message to teammate to abort, then reassign
- **Dependency graph update**: If change affects dependencies, rebuild affected subgraph

## Iteration Control (Optimized: Per-Child Counter)

- Each task has an independent iteration counter (inherited from Module 05)
- `child_iterations[task_id] = { used: 0, remaining: sessionParams.iteration_limit }`
- On `needs_fix`: `used++`, `remaining--`
- `remaining <= 0`: task marked `failed`
- **PASS**: Immediately mark complete, no iteration limit check needed

## Completion

**Condition**: All tasks status = `completed` or `failed`

**Actions**:

1. Use `TaskList` to get final status of all tasks
2. Output final summary:

```
✅ Parallel workflow complete

📊 Final stats
   Total: {total}
   Passed: {success}
   Failed: {failure}
   Dependency edges: {edge-count}
   Avg iterations: {avg-iterations}

📁 Hybrid Tree updated
   Location: .hybrid/{feature-name}/
```

3. Clean up team (optional):
```
TeamDelete()
```
