---
name: routeX
description: "Intelligent request classification and routing. Classifies direct handling, workflow selection, and explicit commands from input plus active context. Used by Main Agent before executing workflow."
---

# Auto-Routing - Intelligent Request Classification

> **Purpose**: Classify each user request and route it to the correct handler. This is the main Claude agent's entry point.

Routing is decided from the complete user input plus the active conversation/workflow context.

---

## 1. Prompt Reading Rule

**Read the COMPLETE user input before making any routing decision.** Never short-circuit on the first keyword or sentence.

- Explicit `/x*` commands always win.
- If a workflow is already active in the current conversation, treat non-command user input as part of that workflow.
- Mixed intent (exploratory + coding) -> handle exploration first when needed, then recommend a workflow mode for the coding part.
- Pure exploratory input -> direct handling.
- When coding intent is present and no workflow is active -> recommend a workflow mode.

---

## 2. Route 0 - Active Workflow Context

**Trigger**: A workflow is already active in the current conversation and user input is not a new `/x*` command.

**Behavior**: Treat the input as part of the current workflow. Do not restart mode selection.

### Requirement Change Handling

```
User input in active workflow
  -> Step 1: Change Detection - analyze input against current Hybrid Tree
     -> Adjustment / Optimization -> update current Child AC
     -> Scope Expansion -> update current Child AC (confirm if > 50%)
     -> Scope Reduction -> remove AC (confirm required)
     -> New Branch Feature -> create new Child (confirm required)
  -> Step 2: Document Update - update Hybrid Tree (Parent §7, Child §7, §8.3)
  -> Step 3: Dispatch - re-enter Core Loop
     -> Core Loop still running? new/modified Child joins queue naturally
     -> Core Loop finished? rebuild dependency graph and dispatch coderX/evaluatorX for new/modified Children
```

### Exit Signals

Exit signals end the current workflow context in the conversation:

- "完成" / "结束" / "done" / "complete" / "结束工作流"
- A new `/x*` command, which starts the requested workflow.

**xunit exception**: xunit auto-completes after execution.

---

## 3. Route 1 - Direct Handling

**Trigger**: The input is exploratory, a git operation, file browsing, or configuration editing, and does not require project code modification.

**Keywords**: 查看, 分析, 解释, 什么, 为什么, 怎么, git, commit, push, pull, branch, status, diff, log, 搜索, 找, show, explain, what, why, how, search, find

**Action**: Use Read/Grep/Bash directly. No coderX dispatch. No project code modification.

---

## 4. Route 2 - Workflow Selection

**Trigger**: User input contains coding intent and no workflow is active in the current conversation.

**Keywords**: 重构, 添加, 实现, 修复, 优化, 改进, 更新, 写, 改, 完成, 进行, 开发, 设计(功能), 模块化, 分离, refactor, add, implement, fix, optimize, improve, update, write, modify, change, complete, build, develop, modularize

### Step 1 - Analyze (5 Dimensions)

| Dimension | Whole | Local | Unit |
|-----------|-------|-------|------|
| **Scope** | 3+ modules/directories (全局, 整个, entire, whole) | 1-2 modules (模块, 部分, module, part) | Single file (单个, 一个, single, file) |
| **Complexity** | High: needs design (设计, 架构, 不确定, design, uncertain) | Medium | Low: known/simple (简单, 已知, simple, known) |
| **PRD exists** | Related Hybrid Tree found in `.hybrid/` by Parent/Child scope, AC, or file-index match | - | - |
| **Change type** | New feature / refactor (if multi-module) | Refactor (local) / optimize | Bug fix (single file) |
| **Uncertainty** | High (帮我想想, 不确定, how should) | - | Low (按照, 参考, according to) |

### Step 2 - Recommend Mode

```
IF scope == Whole AND (complexity == High OR uncertainty == High) -> xwhole
ELSE IF scope == Unit AND complexity == Low -> xunit
ELSE IF PRD exists -> xlocal
ELSE IF change_type == "New Feature" AND uncertainty == High -> xwhole
ELSE -> xlocal
```

### Step 3 - AskUserQuestion

Ask the user to confirm the execution mode before starting workflow execution. If the request is too ambiguous to analyze, ask a clarifying question first.

After user selection, execute the selected Mode Execution flow directly.

### Edge Cases

**Ambiguous Request**:
- Ask a clarifying question first. Do not guess or proceed directly.

**Mixed Request**:
- Split into phases.
- Phase 1: direct exploration.
- Phase 2: after exploration, recommend mode for the coding part.

**User Rejects Recommendation**:
- Respect the user's choice and execute the selected mode.

---

## 5. Route 3 - Explicit Command

**Trigger**: `/xwhole`, `/xlocal`, `/xunit`, `/xprompt`, `/xstatus`

**Action**: Execute immediately. No mode-selection question is needed. If another workflow is active in the current conversation, the explicit command starts the new requested workflow.

---

## 6. Mode Execution Summaries

> Full execution details: `.claude/skills/orchestrateX/SKILL.md`

### Mode A (xwhole) - Persistent Conversation Workflow

1. Env init.
2. Explore codebase -> propose 2-3 solutions -> wait for user confirmation.
3. noiseX summary -> generate Hybrid Tree.
4. Enter iteration:
   - Dispatch coderX/evaluatorX per Child, iterate up to `-N` times.
   - All Children PASS or hit the iteration limit -> report completion or blockers.
   - New requirement -> Route 0 -> update/create Child -> re-enter Core Loop.
5. Exit: user sends an exit signal.

### Mode B (xlocal) - Persistent Conversation Workflow

1. Env init.
2. PRD detection -> reuse related Hybrid Tree, wrap PRD file, or auto-generate minimal Hybrid Tree.
3. Dispatch coderX/evaluatorX, iterate up to `-N` times.
4. New requirement -> Route 0 -> update/create Child -> re-enter Core Loop.
5. Exit: user sends an exit signal.

### Mode C (xunit) - Ephemeral Workflow

1. Build Type 0 Dispatch Payload.
2. Optionally invoke promptX when `-prompt` is present.
3. Dispatch coderX with lightweight scope.
4. Report result and complete.

---

## 7. Commands

| Command | Mode | Description |
|---------|------|-------------|
| `/xwhole [-N] [-box] [-parallel] [-team]` | Mode A | Full planning: explore -> design -> implement |
| `/xlocal [-N] [-box]` | Mode B | Fast implementation via PRD detection |
| `/xunit` | Mode C | Minimal single-file change |
| `/xstatus [--output]` | - | Generate HTML status report |
| `/xprompt` | - | Intent extraction (promptX skill) |
| `/noiseX [focus|summary]` | - | Context denoising |

**Parameters**: `-N [1-10]` (iteration limit), `-box [name]` (sandbox branch), `-parallel` (Agent Teams, xwhole only), `-team [name]` (team name)
