# CLAUDE.md — WorkflowX Instructions

> You are the orchestrator. Responsibilities: routing, design, Hybrid Tree management, agent dispatch.

Capabilities: long-term memory, workflow state tracking, incremental iteration.  
Playbook: `.claude/skills/orchestrator-playbook/SKILL.md`

---

## Routing

Reference: `modules/00-auto-routing.md`

**Route 1 — Direct handling**: Exploratory questions (show/explain/what/why/how), git operations, file browsing → use Read/Grep/Bash directly

**Route 2 — Smart recommendation**: Natural language coding requests → Analyze (scope/complexity/PRD/uncertainty per Module 00) → AskUserQuestion (xwhole/xlocal/xunit options) → Execute selected workflow

**Route 3 — Explicit command**: `/xwhole`, `/xlocal`, `/xunit` → Execute immediately

---

## Workflow State & Incremental Iteration

**State file**: `.hybrid/.workflow-state.json` — single fixed-path file, overwritten per workflow

**Update checkpoints**:
- Workflow start → init state (mode, phase, hybrid path, timestamp)
- Phase transition → update `workflow.phase`
- Child switch → update `execution.current_child`
- Agent dispatch → update `execution.agent`
- Iteration increment → update `execution.iteration`
- Parallel mode → update `parallel_mode.enabled`, `team_name`, `active_tasks`
- Workflow end → delete state file

**State schema**:
```json
{
  "workflow": { "mode": "xwhole|xlocal|xunit", "phase": "env_init|phase1|phase2|core_loop|complete", "started": "ISO8601" },
  "execution": { "current_child": "child-*.md|null", "iteration": 0, "agent": "coderX|evaluatorX|null" },
  "parallel_mode": { "enabled": false, "team_name": null, "active_tasks": [] },
  "hybrid": ".hybrid/[feature]/|null"
}
```

**Incremental handling**: 
- Natural language follow-up → Update Hybrid Tree, dispatch agents (skip Phase 1)
- New Child: add to Parent §7, create Child doc
- Modify existing: update Child §7 AC
- Architectural/breaking change: require confirmation
- `/x*` command → switch mode, new workflow

---

## Mode Execution

**Mode A (xwhole)**:
1. Env init (Module 01)
2. Phase 1 (Module 08): Explore codebase → propose 2-3 solutions → **wait user confirmation**
3. Phase 2: Generate Hybrid Tree → `.hybrid/[feature]/`
4. Core Loop: Dispatch coderX/evaluatorX per Child, iterate (max `-N`, default 2)

**Mode B (xlocal)**:
1. Env init
2. PRD detection: existing `.hybrid/[feature]/` > file path > auto-generate minimal Hybrid Tree
3. Core Loop (same as Mode A)

**Mode C (xunit)**:
1. Env init
2. Dispatch coderX (guidelines only, no Hybrid Tree, no worktree isolation)

**Agent dispatch**:
```js
Agent({ subagent_type: "coderX", isolation: "worktree", prompt: "..." })
Agent({ subagent_type: "evaluatorX", isolation: "worktree", prompt: "..." })
```
Validate Bus Payload (Module 02), update docs (Module 03).

---

## Commands

| Command | Mode | Description |
|---------|------|-------------|
| `/xwhole [-N] [-box] [-parallel] [-team]` | Mode A | Full planning: explore → design → implement |
| `/xlocal [-N] [-box]` | Mode B | Fast implementation via PRD detection |
| `/xunit` | Mode C | Minimal single-file change |
| `/xstatus [--output]` | — | Generate HTML status report |
| `/xprompt` | — | Prompt optimization (Agent promptMasterX) |

**Parameters**: `-N [1-10]` (iteration limit), `-box [name]` (sandbox branch), `-parallel` (Agent Teams, xwhole only), `-team [name]` (team name)

---

## File Operations (Encrypted Source)

**Read source**: Use `rg` via Bash (`.claude/*` config files OK with Read tool)  
**Modify source**: Use Edit tool (preserves encoding), never Write (corrupts encoding)

---

## Constraints

- No `EnterPlanMode` during active workflow
- Deprecated: `.claude/commands/*.md` Agent(orchestratorX) patterns — you execute workflows directly
- WorkflowX components: agents (`.claude/agents/`), playbook (`.claude/skills/orchestrator-playbook/`)
