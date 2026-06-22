---
name: orchestrator-playbook
description: "orchestratorX complete workflow handbook. Contains planning dialogue, Mode A/B/C workflows, core iteration loop, Hybrid Tree routing, requirement change handling, Auto-Routing, Start Rule."
---

# orchestrator Playbook

> **Positioning**: orchestratorX's complete workflow handbook. Contains main workflow logic and on-demand trigger modules.

## Module Index

| # | Module | Trigger | File Path |
|---|--------|---------|-----------|
| 1 | Environment Init + MCP Degradation | First entry to xwhole/xlocal/xunit | `modules/01-environment-init.md` |
| 2 | Bus Payload Validation | Cross-agent handoff (coderX <-> evaluatorX) | `modules/02-bus-payload.md` |
| 3 | Post-Evaluation Document Update | After evaluatorX returns | `modules/03-post-evaluation.md` |
| 5 | Parallel Setup | `/xwhole -parallel` triggered | `modules/05-parallel-setup.md` |
| 6 | Task Coordination | Module 05 completed, continuous runtime | `modules/06-task-coordination.md` |
| 8 | Discovery & Solution Design | xwhole only: Phase 1 (exploration and design consensus) | `modules/08-requirements-discovery.md` |
| 9 | Workflow State Tracking | All checkpoints during workflow execution | `modules/09-workflow-state.md` |
| 10 | Memory Hygiene | End of planning, before each evaluation, before PASS/FAIL | `modules/10-memory-hygiene.md` |

**Note**: Module 00 (Auto-Routing) has been superseded by `.claude/skills/auto-routing/SKILL.md` — the consolidated routing specification for the main Claude agent. orchestratorX always receives an explicit mode parameter (`Mode: xwhole/xlocal/xunit`) and does NOT perform mode selection itself.

**Loading rule (Optimized)**: 
- **Session Memory Cache**: After first Read, cache module content in session memory (`module_cache`). Subsequent accesses read from cache instead of disk.
- **Cache Key**: Use module file path as cache key.
- **Invalidation**: Cache persists for entire session. Clear only on new session start.
- **Never load all modules at once** — still applies, but cached modules are instant access.

---

## Parameter Parsing

> **orchestratorX responsibility**: Parse parameters from `$ARGUMENTS` before workflow execution.

### Supported Parameters

| Parameter | Format | Scope | Default | Description |
|-----------|--------|-------|---------|-------------|
| `-N` | `-N [number]` | xwhole, xlocal | `2` | Maximum evaluation iteration rounds per Child |
| `-box` | `-box [name]` | xwhole | N/A | Sandbox branch name for isolated execution |
| `-parallel` | `-parallel` | xwhole | off | Enable Agent Teams parallel execution within Mode A |
| `-team` | `-team [name]` | xwhole (with `-parallel`) | `workflow-{timestamp}` | Agent Team name for parallel workflow |

### Parsing Rules

**Step 1: Extract parameters from $ARGUMENTS**

Extract sequentially from `$ARGUMENTS`: command name → optional flags → requirement text.

| Param | Match Rule | Default | Description |
|-------|-----------|---------|-------------|
| mode | Starts with `/xwhole`, `/xlocal`, `/xunit`, `/xprompt` | — | Command determines mode |
| `-N` | Positive integer (1-10) after `-N` | `2` | Max evaluation iterations per Child |
| `-box` | Branch name (alphanumeric, hyphens, underscores) after `-box` | skip | Sandbox branch name |
| `-parallel` | Presence flag | off | Agent Teams parallel mode |
| `-team` | Name after `-team` | `workflow-{timestamp}` | Team name for parallel mode |
| requirement | Remaining text after removing above params | — | User requirement |

**Examples**:

```
/xwhole -N 5 -box feature-test Add user authentication
  → mode=xwhole, N=5, box="feature-test", parallel=false, requirement="Add user authentication"

/xwhole -parallel -team my-team Implement auth module
  → mode=xwhole, N=2, parallel=true, team="my-team", requirement="Implement auth module"
```

**Step 2: Validate parameters**

- `-N`: Must be positive integer (1-10). If invalid or missing, use default `2`.
- `-box`: Must be valid branch name (alphanumeric, hyphens, underscores). If empty, skip sandbox.
- `-parallel`: No value needed. Presence flag enables Agent Teams mode within xwhole.

**Step 3: Remember parsed parameters**

Store extracted results as session working memory (mode, iteration_limit, sandbox_branch, team_name, is_parallel, requirement). Reference directly in subsequent steps, no re-parsing.

### Usage in Workflow

**Iteration Limit (`-N`)**:
- Applied in Core Iteration Loop (Step 6 of xwhole, Step 5 of xlocal)
- Each Child gets max N rounds of coderX ↔ evaluatorX iteration
- If limit reached and still Needs Fix: stop iteration, report to human

**Sandbox Branch (`-box`)**:
- **Conditional Creation**: Only execute sandbox operations when `-box` is explicitly provided
  - Without `-box`: Work directly on current branch, no stash/checkout needed
  - With `-box`: Execute full sandbox lifecycle (below)
- **Sandbox Lifecycle**:
  - Before workflow: `git stash` → record original branch → `git checkout -b {sandbox-branch}` from main
  - After workflow: switch back → attempt fast merge (see below) → restore stash
- **Fast Merge Strategy** (Optimized):
  1. Try `git merge --ff-only {sandbox-branch}` (fastest, no extra commit)
  2. If ff-only fails (diverged), try `git merge --squash {sandbox-branch}` (single commit)
  3. If squash fails, fallback to `git merge --no-commit --no-ff {sandbox-branch}`
  4. If merge conflicts: pause, notify user, wait for manual resolution
- **Incremental Stash** (Optimized):
  - Only stash files actually modified: `git stash push -m "workflowX" -- file1 file2 ...`
  - On restore: `git stash pop` (auto-resolves if no conflicts)

---

## Workflow Modes

### Phase Transition Status Templates (MANDATORY)

> **Rule**: Every phase transition MUST write status.json using the exact template below. Do not construct JSON from memory — copy the template and fill in values.

#### Template: env_init → phase1 (xwhole only)
```json
{
  "status": "xwhole",
  "workflow": { "mode": "xwhole", "phase": "phase1", "started": "{ISO8601}" },
  "execution": { "current_child": null, "iteration": 0, "agent": null },
  "task": { "type": "coding", "subject": "{requirement_summary}" }
}
```

#### Template: phase1 → phase2 (xwhole only, after user confirms design)
```json
{
  "status": "xwhole",
  "workflow": { "mode": "xwhole", "phase": "phase2", "started": "{ISO8601}" },
  "execution": { "current_child": null, "iteration": 0, "agent": null },
  "task": { "type": "coding", "subject": "Generate Hybrid Tree: {requirement_summary}" }
}
```

#### Template: phase2 → core_loop (xwhole, after Hybrid Tree created)
```json
{
  "status": "xwhole",
  "workflow": { "mode": "xwhole", "phase": "core_loop", "started": "{ISO8601}" },
  "execution": { "current_child": "{first_child}.md", "iteration": 0, "agent": null },
  "task": { "type": "coding", "subject": "{requirement_summary}" }
}
```

#### Template: env_init → core_loop (xlocal, after Hybrid Tree generated)
```json
{
  "status": "xlocal",
  "workflow": { "mode": "xlocal", "phase": "core_loop", "started": "{ISO8601}" },
  "execution": { "current_child": "{first_child}.md", "iteration": 0, "agent": null },
  "task": { "type": "coding", "subject": "{requirement_summary}" }
}
```

#### Template: env_init → core_loop (xunit)
```json
{
  "status": "xunit",
  "workflow": { "mode": "xunit", "phase": "core_loop", "started": "{ISO8601}" },
  "execution": { "current_child": null, "iteration": 0, "agent": "coderX" },
  "task": { "type": "coding", "subject": "{requirement_summary}" }
}
```

#### Template: core_loop → waiting (xwhole/xlocal, all Children done)
```json
{
  "status": "{xwhole|xlocal}",
  "workflow": { "mode": "{mode}", "phase": "waiting", "started": "{ISO8601}" },
  "execution": { "current_child": null, "iteration": 0, "agent": null },
  "task": { "type": "coding", "subject": "All Children completed" }
}
```

#### Template: exit signal → wait (any workflow ends)
```json
{
  "status": "wait",
  "workflow": { "mode": null, "phase": null, "started": null },
  "execution": { "current_child": null, "iteration": 0, "agent": null },
  "task": { "type": null, "subject": null }
}
```

#### Template: Route 1 task starts (normal)
```json
{
  "status": "normal",
  "workflow": { "mode": null, "phase": null, "started": null },
  "execution": { "current_child": null, "iteration": 0, "agent": null },
  "task": { "type": "{analysis|git|browse}", "subject": "{task_description}" }
}
```

#### Template: Route 1 task ends (back to wait)
```json
{
  "status": "wait",
  "workflow": { "mode": null, "phase": null, "started": null },
  "execution": { "current_child": null, "iteration": 0, "agent": null },
  "task": { "type": null, "subject": null }
}
```

---

### Mode A: whole workflow
- Scope: Large-scale, high-impact, requiring full planning-evaluation cycle.
- **Worktree isolation (auto)**: coderX and evaluatorX are spawned with `isolation="worktree"`. Each agent works in an independent directory; branches merge back after completion.
- **Sandbox (`-box`)**: When specified, creates a physically isolated sandbox branch. Before: stash, record original branch, create sandbox branch. After: merge worktree branches into sandbox, switch back, `--no-commit --no-ff` merge sandbox into original, restore stash.
- **Entry**: Environment init (module 01) -> **Phase 1: Discovery & Solution Design** (module 08: explore, challenge, propose solutions) -> user confirms -> **Phase 2: Document Generation** (Hybrid Tree creation) -> **Core Iteration Loop**
- Iteration limit: Each Child defaults to max 2 rounds (`-N` overrides). If limit reached and still failing, stop and report to human.
- abstracterX is only invoked when user explicitly requests summarization.
- **Status transitions (use templates above)**:
  1. env_init → write `env_init → phase1` template
  2. Phase 1 starts → write `phase1` template (phase already set above)
  3. User confirms design → write `phase1 → phase2` template
  4. Hybrid Tree created → write `phase2 → core_loop` template
  5. Each dispatch → use Dispatch Self-Check Protocol (pre/post)
  6. All Children done → write `core_loop → waiting` template
  7. Exit signal → write `exit signal → wait` template

#### Mode A-parallel (`-parallel`)
When `-parallel` is specified, Mode A uses Agent Teams for parallel execution instead of sequential sub-agent dispatch:

- **Prerequisites**: Agent Teams enabled (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`), Claude Code v2.1.32+
- **Entry**: Same Planning Phase as Mode A -> Parallel setup (module 05) -> Task coordination (module 06)
- **Core features**:
  - Uses Agent Teams instead of sequential sub-agent mode
  - Multiple coder-teammate + evaluator-teammate working in parallel
  - Each teammate isolated in own worktree (zero file conflicts)
  - Dynamic task scheduling based on dependency graph
  - Real-time requirement change handling
- **Fallback**: If Agent Teams unavailable, fall back to sequential Mode A sub-agent mode
- **Teammate role definitions**:
  - `.claude/agents/coder-teammate.md`: Code implementation teammate
  - `.claude/agents/evaluator-teammate.md`: Code evaluation teammate
- **Detailed flow**: See Module 05 and Module 06

### Mode B: local workflow
- Scope: Requirements relatively clear, limited to a local part of the project.
- **Entry**: Environment init (module 01, **MCP probe must precede everything**) -> **PRD detection** -> Core Iteration Loop.
- **PRD detection (priority order)**:
  1. Explicit Hybrid Tree path in `$ARGUMENTS` → validate Parent + Child, use directly
  2. No explicit path → scan `.hybrid/` for existing Hybrid Trees and match the current requirement against Parent title/overview/scope, Parent §7 Child scopes, Child §7 AC, and §8.1 file indexes
  3. If exactly one related Hybrid Tree matches → reuse and maintain that tree; route to the matching Child, or create a new Child through Requirement Change Handling when no Child scope matches
  4. If multiple plausible Hybrid Trees match → present candidates with match reasons and ask the user to choose; do not auto-generate a duplicate tree
  5. If `$ARGUMENTS` contains a valid non-Hybrid PRD file path → read PRD, wrap into Hybrid Tree
  6. No related Hybrid Tree or PRD → auto-generate minimal Hybrid Tree (scan code → build index → decompose AC → write Parent + Child)
- **evaluatorX evaluation criteria**: Always PRD-based (evaluate against Child Section 7 AC). After reading Evaluation Result, orchestratorX assembles Fix Instructions into a fix prompt for coderX.
- **Status transitions (use templates above)**:
  1. env_init → write `env_init → core_loop (xlocal)` template (skip phase1/phase2)
  2. Each dispatch → use Dispatch Self-Check Protocol (pre/post)
  3. All Children done → write `core_loop → waiting` template
  4. Exit signal → write `exit signal → wait` template

### Mode C: unit workflow
- Scope: Minimal tasks: single fix, single file, minimal change.
- **Entry**: coderX executes minimal change -> report to user. evaluatorX only invoked when explicitly requested.
- **coderX lightweight mode**: Only loads `karpathy-guidelines`, does not load `codex-spec-implementation`, no Bus Payload needed.
- **Status transitions (use templates above)**:
  1. env_init → write `env_init → core_loop (xunit)` template
  2. Dispatch coderX → use Dispatch Self-Check Protocol (pre/post)
  3. Auto-complete → write `exit signal → wait` template

---

## Discovery & Solution Design (Mode A)

> Mode A entry: Environment init (module 01) -> **Phase 1: Discovery & Solution Design** (module 08) -> user confirms -> **Phase 2: Document Generation** (Hybrid Tree creation) -> Core Iteration Loop

### Two-Phase Workflow

**Phase 1: Discovery & Solution Design** (module 08) — thinking and design stage:
- Autonomous exploration, gap identification, risk surfacing
- Propose 2-3 solutions with trade-offs
- Multi-turn refinement with user
- **Output**: Design consensus (no Hybrid Tree yet)
- **Exit signal**: "等待你确认方案后，我会生成 Hybrid Tree 并启动开发流程。"

**Phase 2: Document Generation** — triggered by user confirmation:
- **Trigger keywords**: "确认" / "开始实现" / "生成文档" / "开始开发" / "start implementation"
- Generate Hybrid Tree (Parent + Children) based on Phase 1 consensus
- Write to `.hybrid/[feature]/` directory
- Enter Core Iteration Loop

**Core behaviors (Phase 1)**:
- Ask pointed questions, then **autonomously search** the codebase for answers
- Present findings as "here's what I found" rather than "can you tell me"
- Challenge assumptions based on **actual code evidence**
- Propose 2-3 solutions with trade-offs derived from exploration
- Iterate with user to refine approach

### Discovery Turn Structure

Each turn follows this flow:

1. **Confirm Understanding**: Restate user's latest input (1-2 sentences)
2. **Identify Critical Gaps**: Analyze across 6 dimensions (Target User, Functional Scope, Technical Constraints, Boundary Conditions, Acceptance Criteria, NFRs) — prioritize gaps that impact design decisions
3. **Autonomous Exploration**: 
   - Search codebase (Glob, Grep, rg) for related files, patterns, constraints
   - Build File Index in session memory (accumulates → written to Hybrid Tree §8.1)
   - Extract insights: existing patterns, constraints, edge cases, conflicts
4. **Present Findings & Challenge**: Surface discoveries and challenge the requirement across 6 categories (Contradictions, Edge Cases, Technical Risks, Hidden Assumptions, Cross-Module Conflicts, Missing NFRs)
5. **Propose Solutions**: When ready, present 2-3 concrete approaches with trade-offs based on codebase context

### Dialogue Rules

- **One topic per turn** — address the most critical gap/risk first
- **Explore before asking** — always search code before presenting questions
- **Build on previous turns** — reference earlier findings, accumulate context
- **Evidence over speculation** — cite file paths, line ranges, specific patterns
- **Propose solutions, not just problems** — every challenge includes suggested approach
- **Respect user decisions** — record acknowledged risks and move on

Full specification: `modules/08-requirements-discovery.md`

### Phase Transition

**Phase 1 exit criteria:**
- User signals confirmation with keywords: "确认" / "开始实现" / "生成文档" / "开始开发" / "start implementation"
- Output design consensus summary, then **wait for explicit confirmation before Phase 2**

**Phase 1 exit signal template:**
```
方案设计完成。以下是推荐方案：

[Brief design consensus summary]

等待你确认方案后，我会生成 Hybrid Tree 并启动开发流程。
```

**Phase 2 entry:**
- After user confirms, generate Hybrid Tree with all discoveries written to appropriate sections
- Proceed to Core Iteration Loop

### Knowledge Graph Writeback

When the user triggers Summary:

1. Read confirmed facts from `mcp/server-memory` for the current session, generate a structured knowledge graph
2. Clean up: retain only user-confirmed facts, delete speculation and pending items
3. Serialize and write to Parent Section 8.4
4. If old snapshot exists, overwrite with timestamp preserved, do not add duplicates

### Findings → Hybrid Tree Mapping

Write confirmed findings into appropriate sections during Hybrid Tree creation:

| Finding Type | Target Section |
|-------------|---------------|
| Confirmed scope | Parent §1 Project Overview |
| Technical constraints | Parent §3 Technical Constraints |
| Edge cases | Child §7 AC |
| NFRs (security, perf) | Parent §4 NFR |
| Risk mitigations | Child §7 AC |
| Accepted risks | Parent §4 NFR |
| Cross-module dependencies | Parent §8.3 Dependencies |
| File index | Parent §8.1 (shared), Child §8.1 (private) |
| Knowledge insights | Parent §8.2 Knowledge Graph |

### Hybrid Tree Creation

**All planning outputs must use the Hybrid Tree structure.** Regardless of requirement size, generate one Parent + at least one Child.

**Design principles**:
1. **Parent-Child separation of responsibility**: Parent is the routing layer (global spec, routing table, global index, knowledge graph). Child is the requirement layer (branch AC, branch index).
2. **MECE**: Children scopes are mutually exclusive and collectively exhaustive, no gaps or overlaps.
3. **High cohesion, low coupling**: Each Child contains tightly related requirements. Cross-Child dependencies minimized and recorded in Parent 8.3.
4. **Prevent over-splitting**: Each Child must have independent scope justifying its existence.
5. **Temporal and causal continuity**: Sequential dependencies reflected in Child ordering and dependency annotations.

**Creation flow**:
1. Create directory `.hybrid/[feature-name]/`
2. Create Parent hybrid: fill Sections 0-6, Section 7 routing table, 8.1 shared files, 8.2 knowledge graph, 8.3 cross-branch dependencies
3. Create Child hybrids: one per sub-module, fill Section 7 AC, 8.1 private files
4. Pass Parent path to orchestratorX, orchestratorX routes to each Child for development

**Template**: Strictly follow `hybrid-template.md`. Section numbers and physical order must not change (adapted for Token caching: static sections first, incremental middle, dynamic last).

### Quality Gates

- Must not lock specific business rules without user confirmation
- Do not output low-level code snippets or overly detailed API designs during discovery
- Maintain exploratory dialogue mode outside Summary stage
- Focus on product context, high-level boundaries, and executable acceptance criteria
- Always ground findings in actual code evidence (file paths, patterns, constraints)

---

## Hybrid Tree Section Map (Optimized: Section-Level Caching)

coderX and evaluatorX receive (Parent, Child) paths, then read according to the following scope:

| Document | Section | Content | Readers | Cache Strategy |
|----------|---------|---------|---------|----------------|
| Parent | 0-6 | Global spec (NFR, DoD, Scope) | coderX, evaluatorX | **Session Cache**: Read once, cache entire block. Invalidate only on requirement change. |
| Parent | 7 | Routing table (not AC source) | coderX | **Session Cache**: Read once per iteration round. |
| Parent | 8.1 | Shared file index | coderX, evaluatorX | **Session Cache**: Read once, invalidate on file structure change. |
| Parent | 8.2 | Knowledge graph outlines (details via MCP) | coderX, evaluatorX | **Session Cache**: Read once per session. |
| Parent | 8.3 | Cross-branch dependencies | coderX, evaluatorX | **Session Cache + Invalidation**: Read once, invalidate on requirement change only. |
| Child | 7 | Branch AC (evaluation target) | coderX, evaluatorX | **No Cache**: Changes frequently during iteration. |
| Child | 8.1 | Private file index | coderX, evaluatorX | **Session Cache**: Read once, invalidate on file change. |
| Child | 8.2 | Incremental references | coderX | **No Cache**: Iteration-specific. |
| Child | 9 | Prior evaluation results | evaluatorX (for inheritance) | **No Cache**: Changes every iteration. |

> **Context hand-off rule (Optimized)**: In the **first round**, pass full Parent + Child documents to coderX/evaluatorX. In subsequent rounds, prefer a lightweight trunk: pass only Parent §8.2 (Memory Pointers entity/relation summaries) plus the current Child §7 (AC) and §9 (prior evaluation / fix instructions). Tell the subagent to call `mcp__server-memory__open_nodes` with the exact entity names from §8.2 to pull node details on demand; only fall back to `mcp__server-memory__search_nodes` when an exact name is missing. This mirrors the savings measured in TEST-MEMORY-001 (~13,506 chars / ~3,377 tokens for full context vs ~1,369 chars / ~342 tokens for trunk + on-demand retrieval).

---

## Core Iteration Loop (Optimized: Dependency Graph + Ready Queue)

> Shared by Mode A and Mode B (with Hybrid Tree).

### Dispatch Self-Check Protocol (MANDATORY — NEVER SKIP)

> **Purpose**: Guarantee status.json is always synchronized with actual workflow state.
>
> **Enforcement**: This protocol runs before AND after every agent dispatch. Skipping any step is forbidden.

#### Pre-Dispatch Checklist (Before EVERY coderX / evaluatorX dispatch)

```
□ Step 1: Read .hybrid/status.json
□ Step 2: Verify status matches current workflow (xwhole/xlocal/xunit)
□ Step 3: Update execution fields:
           - execution.current_child = target Child filename
           - execution.agent = "coderX" or "evaluatorX"
           - execution.iteration = current round number
□ Step 4: Write .hybrid/status.json (full overwrite)
□ Step 5: THEN dispatch agent
```

**Template — Pre-dispatch for coderX**:
```json
{
  "status": "{xwhole|xlocal}",
  "workflow": { "mode": "{mode}", "phase": "core_loop", "started": "{ISO}" },
  "execution": { "current_child": "{child-name}", "iteration": {N}, "agent": "coderX" },
  "task": { "type": "coding", "subject": "{brief description}" }
}
```

**Template — Pre-dispatch for evaluatorX**:
```json
{
  "status": "{xwhole|xlocal}",
  "workflow": { "mode": "{mode}", "phase": "core_loop", "started": "{ISO}" },
  "execution": { "current_child": "{child-name}", "iteration": {N}, "agent": "evaluatorX" },
  "task": { "type": "analysis", "subject": "Evaluate {child-name} round {N}" }
}
```

#### Post-Dispatch Checklist (After EVERY coderX / evaluatorX returns)

```
□ Step 1: Read .hybrid/status.json
□ Step 2: Update execution fields:
           - execution.agent = null
           - (keep current_child and iteration unchanged until next dispatch)
□ Step 3: Write .hybrid/status.json (full overwrite)
```

**Template — Post-dispatch cleanup**:
```json
{
  "status": "{xwhole|xlocal}",
  "workflow": { "mode": "{mode}", "phase": "core_loop", "started": "{ISO}" },
  "execution": { "current_child": "{child-name}", "iteration": {N}, "agent": null },
  "task": { "type": "coding", "subject": "{brief description}" }
}
```

#### Child Switch Checklist (When moving to next Child)

```
□ Step 1: Read .hybrid/status.json
□ Step 2: Update execution fields:
           - execution.current_child = NEW child filename
           - execution.iteration = 0 (reset)
           - execution.agent = null
□ Step 3: Write .hybrid/status.json
□ Step 4: THEN dispatch coderX for new Child
```

---

### Pre-Loop Setup: Build Dependency Graph

```
1. Read Parent Section 7 → extract all Children
2. Read Parent Section 8.3 → extract dependency edges (CACHE THIS)
3. Build adjacency list + in-degree map:
   - in_degree[child] = number of dependencies
   - adj[parent_dep] = [children that depend on it]
4. Initialize per-child iteration counters:
   - child_iterations[child] = { used: 0, remaining: sessionParams.iteration_limit }
5. Initialize ready_queue (FIFO):
   - For each child where in_degree[child] == 0 → push to ready_queue
6. Critical Path Analysis (Optimized):
   - Identify critical path: longest dependency chain
   - Identify high-impact nodes: children with most dependents
   - Priority score: impact_score = number_of_dependents + (1 / chain_position)
   - Sort ready_queue by priority (highest first)
```

### Phase 1 — Ready Queue Processing (replaces sequential scan)

```
While ready_queue is not empty:
  current = ready_queue.dequeue()
  
  0. ITERATION CHECK:
     - If child_iterations[current].remaining <= 0:
       mark as "Limit Reached", report to human, continue to next
  
  1. [STATUS CHECK] Execute Pre-Dispatch Checklist (coderX):
     - Read status.json → update current_child, iteration, agent="coderX" → write status.json
  2. Dispatch coderX: (Parent, current) + [prior Fix Instructions, if any]
  3. coderX implements, outputs Change Summary Payload
  4. [STATUS CHECK] Execute Post-Dispatch Checklist:
     - Read status.json → set agent=null → write status.json
  5. [STATUS CHECK] Execute Pre-Dispatch Checklist (evaluatorX):
     - Read status.json → update agent="evaluatorX" → write status.json
  6. Validate Payload (module 02), forward to evaluatorX: (Parent, current, Change Summary)
  7. evaluatorX evaluates, outputs Evaluation Result Payload
  8. [STATUS CHECK] Execute Post-Dispatch Checklist:
     - Read status.json → set agent=null → write status.json
  9. Load module 03 for Post-Evaluation document update (incremental, see §6)
  
  10. Result handling:
     - PASS:
       a. Mark current as PASS
       b. For each dependent in adj[current]:
            in_degree[dependent]--
            if in_degree[dependent] == 0 → enqueue to ready_queue
     - Needs Fix + child_iterations[current].remaining > 0:
       a. child_iterations[current].used++
       b. child_iterations[current].remaining--
       c. Extract Fix Instructions -> re-enqueue current to ready_queue
     - Needs Fix + child_iterations[current].remaining <= 0:
       a. Mark as "Limit Reached", report to human
       b. Do NOT enqueue dependents (they remain blocked)

  11. [STATUS CHECK] After Child completes (PASS or Limit Reached):
     - If next Child in ready_queue:
       → Execute Child Switch Checklist (current_child = next child, iteration = 0)
     - If ready_queue empty (all done):
       → Update status.json: workflow.phase = "waiting", execution.agent = null
```

**Final status update (Core Loop exits)**:
```json
{
  "status": "{xwhole|xlocal}",
  "workflow": { "mode": "{mode}", "phase": "waiting", "started": "{ISO}" },
  "execution": { "current_child": null, "iteration": 0, "agent": null },
  "task": { "type": "coding", "subject": "All Children completed" }
}
```
```

### Phase 2 — Blocked Queue Resolution

```
If ready_queue is empty but some children not completed:
  - Check for circular dependencies in remaining in_degree > 0 nodes
  - If circular: report circular dependency to human, terminate
  - If not circular (waiting on external): report blocking dependency to human
```

**Early Exit (Optimized)**: 
- PASS → immediately mark complete, enqueue dependents, move to next in queue
- No need to check iteration limit for PASS'd children

**Per-Child Counter State**:
```javascript
child_iterations = {
  "child-1": { used: 0, remaining: 2 },
  "child-2": { used: 1, remaining: 1 },
  // ...
}
```

**Dispatch Format**:
- Pass `Parent: [path]` + `Child: [path]` (all modes use Hybrid Tree)

## Minimal Hybrid Tree Auto-Generation (Mode B, No Related PRD)

> When Mode B has no explicit PRD and no related existing Hybrid Tree in `.hybrid/`, orchestratorX auto-generates a minimal Hybrid Tree before entering the Core Iteration Loop. This replaces the former Simple Iteration Loop path.

**orchestratorX executes** (sole document writer):

1. **Code Scan**: Use Glob/Grep/rg to search project for files related to the requirement
2. **Generate Parent** (`hybrid-template.md`):
   - Section 0: MCP status from Module 01
   - Sections 1-6: Minimal fill from requirement (project goal, boundaries, NFR, DoD)
   - Section 7: Routing table with single Child row
   - Section 8.1: Shared file index from scan results
   - Section 8.2: Knowledge graph skeleton (outlines only)
   - Section 8.3: Empty (single Child, no cross-branch dependencies)
   - Section 9: Empty aggregation table
3. **Generate Child** (`hybrid-template.md`):
   - Section 7: Acceptance criteria decomposed from requirement
   - Section 8.1: Private file index for relevant files
   - Section 9: Empty evaluation report
4. **Write** both documents to `.hybrid/[feature-name]/`
5. **Enter Core Iteration Loop** with generated Parent + Child

**PRD file path input**: When user passes a file path (e.g. `/xlocal ./docs/prd.md`), read the PRD file and use its content to populate Sections 1-6 and derive AC for Section 7, instead of inferring from the raw requirement.

**Requirement Change**: Follow the standard Requirement Change Handling (shared by Mode A and Mode B with Hybrid Tree).

---

## Hybrid Tree Routing

### Tree Detection

Hybrid Tree exists when:
- `.hybrid/[feature]/` directory contains multiple `*-hybrid.md` files
- File marked `Document Type: Parent` contains Section 7 routing table

For xlocal without an explicit Hybrid Tree path, discovery is repository-wide:
1. Enumerate `.hybrid/*/` directories, ignoring `.hybrid/status.json`, locks, and non-directory files
2. Identify Parent candidates by `Document Type: Parent` plus a Section 7 routing table
3. Score relevance against the current requirement using:
   - directory name and Parent title
   - Parent §1 overview, §3 boundaries/scope, and §6 scope
   - Parent §7 Child scope rows
   - Child §7 acceptance criteria
   - Parent/Child §8.1 file indexes
4. Treat a candidate as reusable only when the requirement clearly overlaps an existing Parent scope or file index
5. If one candidate matches, reuse and maintain it; if several match, ask the user to choose; if none match, continue to PRD file detection or minimal auto-generation

### Routing Logic

1. Read Parent Section 7 routing table
2. Compare current task/requirement against each Child's Scope column
3. Match found -> dispatch coderX and evaluatorX, pass (Parent, Child)
4. No match -> execute Requirement Change Handling (Change Type = new_branch)

### Child Creation Flow

When Requirement Change Handling determines Change Type = new_branch:
1. Analysis results contain: feature description, suggested AC list, suggested file scope
2. orchestratorX executes:
   - Create new Child document using Child template, fill feature description -> Section 7 Description, suggested ACs -> Section 7 AC
   - Add new row to Parent Section 7 (append end; dependency order is resolved at runtime by the Core Loop's deferred queue)
   - Update Parent Section 8.3 (if new dependencies)
3. Dispatch coderX: (Parent, new Child)


---

## Requirement Change Handling

> Shared by Mode A and Mode B (all paths use Hybrid Tree).

### Step 1: Change Detection

orchestratorX determines whether user input changed the current Child's requirement scope. Analyze user input, determine change type:

| Change Type | Detection Criteria | Action |
|-------------|-------------------|--------|
| **Adjustment** | Modifying existing AC of current Child | Update current Child |
| **Optimization** | Refining existing functionality of current Child | Update current Child |
| **Scope Expansion** | Adding to current Child's scope | Update current Child |
| **Scope Reduction** | Removing AC from current Child | Update current Child |
| **New Branch Feature** | Feature does not belong to any existing Child | Create new Child |

### Step 2: Major Change Confirmation

| Change Type | Confirmation Required |
|-------------|---------------------|
| New Branch Feature | Yes — describe new feature, ask "Confirm creating new sub-module?" |
| Scope Expansion > 50% | Yes — describe expansion, ask "Confirm scope expansion?" |
| Scope Reduction (removing AC) | Yes — list deleted ACs, ask "Confirm deleting these acceptance criteria?" |
| Adjustment / Optimization | No — proceed directly |

If user rejects, discard the change and resume original flow.

### Step 3: Document Update

Read change analysis results, execute:
- Update Child Section 7 (AC add/modify/delete)
- Update Parent Section 7 (routing table)
- Update Parent Section 8.3 (dependencies)
- Reset affected Children Status to "Needs Re-evaluation"

**Identify affected Children**:
1. Read Parent Section 8.3 (cross-branch dependencies)
2. If updated Child is depended on by other Children: list all dependent Children, mark as "Needs Re-evaluation"
3. If updated Child depends on other Children: verify dependency satisfied (Status = PASS), record warning if not

**Constraints**: traceability (all changes traceable to user description), Parent Sections 0-6 not modified, MECE principle.

### Step 4: Resume Workflow

- Modified Child is **currently iterating**: reset iteration counter, restart from that Child
- Modified Child is **already PASS'd**: Status reset to "Needs Re-evaluation", re-execute in next loop cycle
- Modified Child is **not yet executed**: documents updated, loop handles naturally
- Change Type = `new_branch`: follow Child Creation Flow

---

## Auto-Routing

> **Delegated**: Full routing logic is in `.claude/skills/auto-routing/SKILL.md`. orchestratorX receives an explicit mode parameter and does NOT perform routing itself.

---

## Start Rule

1. **Routing priority**: Explicit command > natural language intent > Auto-Routing. When uncertain, require user to specify `/xwhole`, `/xlocal`, `/xunit`. Parallel execution via `/xwhole -parallel`.
2. **State isolation**: Stay in current workflow mode until completion. No cross-mode calls.
3. **Hybrid Tree**: whole and local must generate Hybrid Tree (even if skipping planning, create minimal version from `orchestrator-playbook/hybrid-template.md`). unit exempt.
4. **Concurrency protection**: Before starting any workflow, check for `.hybrid/.workflow-lock`. If lock exists, warn user and abort. Otherwise, create lock file with timestamp and mode. Remove lock on workflow completion or interruption.

