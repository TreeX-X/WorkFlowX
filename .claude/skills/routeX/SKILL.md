---
name: routeX
description: "Intelligent request classification and routing. Status gate, 4 routes (active workflow, direct handling, workflow selection, explicit command), 5-dimension analysis, mode recommendation, status management. Used by Main Agent before executing workflow."
---

# Auto-Routing — Intelligent Request Classification

> **Purpose**: Classify every user request and route to the correct handler. This is the main Claude agent's entry point.

**Status file**: `.hybrid/status.json` — persistent, never deleted, only Main Agent writes.

---

## 1. Status Gate (Always First)

Read `.hybrid/status.json` → check `status` field → route accordingly:

```
User input arrives
  │
  ▼
Read .hybrid/status.json
  │
  ├─ status = xwhole / xlocal → Route 0 (Active Workflow)
  ├─ status = xunit           → Route 0 (Active Workflow, ephemeral)
  ├─ status = normal          → Route 1 only (no workflow trigger)
  ├─ status = wait            → Route 1 / Route 2 (Route 2 enabled)
  ├─ file not found           → create status.json (wait), then Route 1/2/3
  └─ /x* command              → Route 3 (always, overrides any status)
```

---

## 2. Prompt Reading Rule (Always Before Routing)

**Read the COMPLETE user input before making any routing decision.** Never short-circuit on the first keyword or sentence.

- Mixed intent (exploratory + coding) → coding intent wins → Route 2
- Pure exploratory (no coding keywords anywhere) → Route 1
- When in doubt, treat as Route 2

---

## 3. Route 0 — Active Workflow (status = xwhole | xlocal | xunit)

**Trigger**: status is a workflow mode, and user input is NOT an exit signal or `/x*` command.

**Behavior**: All user inputs are part of the current workflow. Do NOT re-trigger Route 2.

### Requirement Change Handling

```
User input in active workflow
  │
  ▼
Step 1: Change Detection — analyze input against current Hybrid Tree
  │
  ├─ Adjustment / Optimization → update current Child AC
  ├─ Scope Expansion → update current Child AC (confirm if > 50%)
  ├─ Scope Reduction → remove AC (confirm required)
  └─ New Branch Feature → create new Child (confirm required)
  │
  ▼
Step 2: Document Update — update Hybrid Tree (Parent §7, Child §7, §8.3)
  │
  ▼
Step 3: Dispatch — re-enter Core Loop
  │
  ├─ Core Loop still running (ready_queue not empty)?
  │   → new/modified Child joins queue naturally
  │
  └─ Core Loop finished (ready_queue empty)?
      → re-enter Core Loop with updated dependency graph
      → dispatch coderX/evaluatorX for new/modified Children
```

### Session Waiting State

When iteration finishes all Children (PASS or limit reached), phase updates to `waiting`. Session persists. Any new input enters this Route 0 flow — load new Child, reset iteration to 0, clear agent, phase → `iterating`.

### Exit Signals (update status to `wait`, clear workflow fields)

- "完成" / "结束" / "done" / "complete" / "结束工作流"
- `/x*` command (switches to new workflow)

**xunit exception**: xunit auto-completes after execution → status returns to `wait`.

---

## 4. Route 1 — Direct Handling (status = normal | wait)

**Trigger**: Entire input is exploratory (show/explain/what/why/how), git operations, file browsing, configuration edits. No coding keywords present anywhere in the input.

**Keywords**: 查看, 分析, 解释, 什么, 为什么, 怎么, git, commit, push, pull, branch, status, diff, log, 搜索, 找, show, explain, what, why, how, search, find

**Action**: Use Read/Grep/Bash directly. No agent dispatch. No code modification.

**Status flow**: `normal` → task completes → `wait`

**Status Write Checkpoint (MANDATORY)**:
```
Route 1 task starts
  │
  ▼
Write status.json: { status: "normal", task: { type: "{analysis|git|browse}", subject: "{description}" } }
  │
  ▼
Execute task (Read/Grep/Bash)
  │
  ▼
Task completes
  │
  ▼
Write status.json: { status: "wait", task: { type: null, subject: null } }
```

**Template — Route 1 task starts**:
```json
{
  "status": "normal",
  "workflow": { "mode": null, "phase": null, "started": null },
  "execution": { "current_child": null, "iteration": 0, "agent": null },
  "task": { "type": "{analysis|git|browse}", "subject": "{task_description}" }
}
```

**Template — Route 1 task ends**:
```json
{
  "status": "wait",
  "workflow": { "mode": null, "phase": null, "started": null },
  "execution": { "current_child": null, "iteration": 0, "agent": null },
  "task": { "type": null, "subject": null }
}
```

---

## 5. Route 2 — Workflow Selection (status = wait ONLY)

**Trigger**: status is `wait` AND user message contains ANY coding intent (not `/x*` command). Takes priority over Route 1 when coding keywords are present anywhere in the input.

**Keywords**: 重构, 添加, 实现, 修复, 优化, 改进, 更新, 写, 改, 完成, 进行, 开发, 设计(功能), 模块化, 分离, refactor, add, implement, fix, optimize, improve, update, write, modify, change, complete, build, develop, modularize

**Gateway rule**: Route 2 ONLY fires when `status = wait`. This prevents re-triggering during active workflows or Route 1 tasks.

### Step 1 — Analyze (5 Dimensions)

| Dimension | Whole | Local | Unit |
|-----------|-------|-------|------|
| **Scope** | 3+ modules/directories (全局, 整个, entire, whole) | 1-2 modules (模块, 部分, module, part) | Single file (单个, 一个, single, file) |
| **Complexity** | High: needs design (设计, 架构, 不确定, design, uncertain) | Medium | Low: known/simple (简单, 已知, simple, known) |
| **PRD exists** | Related Hybrid Tree found in `.hybrid/` by Parent/Child scope, AC, or file-index match | — | — |
| **Change type** | New feature / refactor (if multi-module) | Refactor (local) / optimize | Bug fix (single file) |
| **Uncertainty** | High (帮我想想, 不确定, how should) | — | Low (按照, 参考, according to) |

**Dimension details**:

**Scope** — keyword-based classification:
- Global: 全局, 整个, 全部, entire, whole, global
- Unit: 单个, 一个, 文件, 函数, single, file, function
- Local: everything else (模块, 部分, module, part)

**Complexity** — signal patterns:
- High: 设计, 架构, 多个, 不确定, design, architecture, multiple, uncertain
- Low: 简单, 已知, 明确, simple, known, clear
- Medium: everything else

**PRD existence** — related Hybrid Tree check:
```bash
# Scan .hybrid/*/ for Parent hybrid docs, then match request terms
# against Parent title/scope, Section 7 Child scopes, Child AC, and Section 8.1 file indexes.
# Set PRD_EXISTS=true only when a related Hybrid Tree is found.
```

**Change type** — keyword mapping:
- 重构, refactor → Refactor (xwhole if multi-module, xlocal if local)
- 添加, 实现, add, implement → New Feature (xwhole if uncertain, xlocal if clear)
- 修复, fix → Bug Fix (xunit if single file, xlocal if module)
- 优化, optimize → Optimization (xlocal)

**Uncertainty** — signal patterns:
- High: 帮我, 不确定, 怎么, 比较好, help me, uncertain, how should
- Low: 按照, 参考, 文档, according to, refer to, documented

### Step 2 — Recommend Mode (Decision Tree)

```
IF scope == Whole AND (complexity == High OR uncertainty == High) → xwhole
ELSE IF scope == Unit AND complexity == Low → xunit
ELSE IF PRD exists → xlocal
ELSE IF change_type == "New Feature" AND uncertainty == High → xwhole
ELSE → xlocal (default)
```

### Step 3 — AskUserQuestion (MANDATORY, never skip)

```javascript
AskUserQuestion({
  questions: [{
    question: "检测到编程任务：{task_summary}。基于需求分析，推荐 {recommended_mode} 模式。请选择执行方式：",
    header: "工作流模式",
    multiSelect: false,
    options: [
      { label: "{recommended} (推荐)", description: "{推荐理由}" },
      { label: "xwhole — 完整规划", description: "大型需求、多模块改动、需要深度探索和方案设计" },
      { label: "xlocal — 快速实现", description: "局部模块、需求明确、有现成 PRD" },
      { label: "xunit — 最小改动", description: "单文件修复、bug 修复、最小改动" }
    ]
  }]
})
```

After user selects → **immediately** update status.json (see template below) → execute Mode Execution flow.

**Status Write Checkpoint (MANDATORY — before Mode Execution)**:

```
User selects mode in AskUserQuestion
  │
  ▼
Write status.json IMMEDIATELY (before any Mode Execution step)
  │
  ├─ Selected xwhole → write: { status: "xwhole", workflow: { mode: "xwhole", phase: "env_init", ... }, ... }
  ├─ Selected xlocal  → write: { status: "xlocal", workflow: { mode: "xlocal", phase: "env_init", ... }, ... }
  └─ Selected xunit   → write: { status: "xunit", workflow: { mode: "xunit", phase: "env_init", ... }, ... }
  │
  ▼
THEN proceed to Mode Execution (env_init)
```

**Template — Route 2 mode selected**:
```json
{
  "status": "{xwhole|xlocal|xunit}",
  "workflow": { "mode": "{selected_mode}", "phase": "env_init", "started": "{ISO8601}" },
  "execution": { "current_child": null, "iteration": 0, "agent": null },
  "task": { "type": "coding", "subject": "{task_summary}" }
}
```

**Why this order matters**: Writing status.json BEFORE env_init ensures that if the session interrupts during env_init, the status correctly reflects an active workflow on restart. Without this, a crash during env_init leaves status=wait, and the workflow is lost.

**Fallback**: If request is too ambiguous to analyze (e.g. "改一下登录"), ask a clarifying question first — do NOT guess or proceed directly.

### Edge Cases

**Ambiguous Request** (e.g. "改一下登录"):
- Too vague for auto-recommendation → ask clarifying question first
- "请问是修复 bug、添加功能、还是重构登录模块？"
- After clarification, re-analyze and recommend

**Mixed Request** (e.g. "先看看代码，然后重构数据库"):
- Split into two phases
- Phase 1: Route 1 (explore code) — handle directly
- Phase 2: After exploration, recommend mode for coding part

**User Rejects Recommendation**:
- Respect user's choice, execute selected mode without further questions

---

## 6. Route 3 — Explicit Command (always available)

**Trigger**: `/xwhole`, `/xlocal`, `/xunit`, `/xprompt`, `/xstatus`

**Action**: Execute immediately. No AskUserQuestion needed. If a workflow is active, it is replaced by the new workflow.

**Status Write Checkpoint (MANDATORY)**:
```
/x* command received
  │
  ▼
If active workflow exists → write exit status first:
  { status: "wait", workflow: { mode: null, phase: null, started: null }, ... }
  │
  ▼
Write new workflow status immediately:
  { status: "{target_mode}", workflow: { mode: "{target_mode}", phase: "env_init", started: "{ISO}" }, ... }
  │
  ▼
THEN execute Mode Execution
```

**Template — Route 3 command**:
```json
{
  "status": "{xwhole|xlocal|xunit}",
  "workflow": { "mode": "{target_mode}", "phase": "env_init", "started": "{ISO8601}" },
  "execution": { "current_child": null, "iteration": 0, "agent": null },
  "task": { "type": "coding", "subject": "{requirement_from_arguments}" }
}
```

---

## 7. Status Management

### Status Schema

```json
{
  "status": "normal|wait|xwhole|xlocal|xunit",
  "workflow": {
    "mode": "xwhole|xlocal|xunit|null",
    "phase": "env_init|phase1|phase2|core_loop|waiting|null",
    "started": "ISO8601|null"
  },
  "execution": {
    "current_child": "child-*.md|null",
    "iteration": 0,
    "agent": "coderX|evaluatorX|null"
  },
  "hybrid": ".hybrid/[feature]/|null",
  "task": {
    "type": "analysis|coding|git|browse",
    "subject": "描述性摘要"
  }
}
```

### Status Values

| Status | Meaning | Route | Transition |
|--------|---------|-------|------------|
| `normal` | Route 1 work in progress | Route 1 only | task done → `wait` |
| `wait` | Idle, between tasks | Route 1 / Route 2 | coding request → workflow mode |
| `xwhole` | xwhole workflow active | Route 0 | exit signal → `wait` |
| `xlocal` | xlocal workflow active | Route 0 | exit signal → `wait` |
| `xunit` | xunit workflow active (ephemeral) | Route 0 | auto-complete → `wait` |

### Phase Values

| Phase | When |
|-------|------|
| `null` | No active workflow (status = normal / wait) |
| `env_init` | Module 01 environment initialization |
| `phase1` | xwhole only: Discovery & Solution Design |
| `phase2` | xwhole only: Hybrid Tree generation |
| `core_loop` | Active iteration (coderX/evaluatorX dispatch) |
| `waiting` | xwhole/xlocal: Core Loop finished, waiting for new requirements |

### Update Checkpoints (Main Agent only)

| Event | Update |
|-------|--------|
| First conversation | `status: "wait"` |
| Route 1 task starts | `status: "normal"`, `task.*` |
| Route 1 task ends | `status: "wait"`, clear task |
| Route 2 select xwhole | `status: "xwhole"`, `workflow.phase: "env_init"` |
| Route 2 select xlocal | `status: "xlocal"`, `workflow.phase: "env_init"` |
| Route 2 select xunit | `status: "xunit"`, `workflow.phase: "env_init"` |
| Route 3 /x* command | clear previous workflow, then same as Route 2 select for target mode |
| xwhole planning → iteration | `workflow.phase: "core_loop"` |
| Child switch | `current_child: "child-*.md"`, `iteration: 0`, `agent: null` |
| Agent dispatch coderX | `agent: "coderX"` |
| Agent dispatch evaluatorX | `agent: "evaluatorX"` |
| Iteration increment | `iteration: +1` |
| Core Loop finished | `workflow.phase: "waiting"` |
| waiting + new requirement | `current_child`, `iteration: 0`, `agent: null`, `phase: "core_loop"` |
| Exit signal | `status: "wait"`, clear workflow |
| xunit auto-complete | `status: "wait"`, clear workflow |

### Incremental Handling (xwhole/xlocal only)

- Status is `xwhole`/`xlocal` → all inputs enter Route 0
- New requirements → Requirement Change Handling → update Hybrid Tree → **load new Child, reset iteration, clear agent** → re-enter iterating
- Architectural/breaking change → require confirmation
- Exit signal → update status to `wait`, clear workflow fields
- `/x*` command → switch to new workflow

---

## 8. Mode Execution Summaries

> Full execution details: `.claude/skills/orchestrateX/SKILL.md`

### Mode A (xwhole) — Persistent

1. Env init → **status: xwhole, phase: env_init**
2. Explore codebase → propose 2-3 solutions → wait user confirmation (phase: phase1)
3. Generate Hybrid Tree → phase: phase2
4. Enter iteration → **phase: core_loop**
   - Dispatch coderX/evaluatorX per Child, iterate (max `-N`, default 2)
   - All Children PASS or limit reached → **phase: waiting** (session persists)
   - New requirement → Route 0 → load new Child, reset iteration → **phase: core_loop**
5. **Exit**: User sends exit signal → **status: wait, workflow cleared**

### Mode B (xlocal) — Persistent

1. Env init → **status: xlocal, phase: env_init**
2. PRD detection → reuse related Hybrid Tree from `.hybrid/`, wrap PRD file, or auto-generate minimal Hybrid Tree
3. Dispatch coderX/evaluatorX, iterate → **phase: core_loop**
   - All Children processed → **phase: waiting** (session persists)
   - New requirement → Route 0 → load new Child, reset iteration → **phase: core_loop**
4. **Exit**: User sends exit signal → **status: wait, workflow cleared**

### Mode C (xunit) — Ephemeral

1. Env init → **status: xunit, phase: env_init**
2. Dispatch coderX (no Hybrid Tree, no worktree isolation) → **phase: core_loop**
3. Auto-complete → **status: wait, workflow cleared**

---

## 9. Commands

| Command | Mode | Description |
|---------|------|-------------|
| `/xwhole [-N] [-box] [-parallel] [-team]` | Mode A | Full planning: explore → design → implement |
| `/xlocal [-N] [-box]` | Mode B | Fast implementation via PRD detection |
| `/xunit` | Mode C | Minimal single-file change |
| `/xstatus [--output]` | — | Generate HTML status report |
| `/xprompt` | — | Prompt optimization (Agent promptMasterX) |

**Parameters**: `-N [1-10]` (iteration limit), `-box [name]` (sandbox branch), `-parallel` (Agent Teams, xwhole only), `-team [name]` (team name)
