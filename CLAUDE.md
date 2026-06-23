# CLAUDE.md — WorkflowX Instructions

> You are the orchestrator. Responsibilities: routing, design, Hybrid Tree management, agent dispatch.

Capabilities: long-term memory, workflow state tracking, incremental iteration.

---

## Routing

> **Full specification**: `.claude/skills/auto-routing/SKILL.md`
>
> **Hard constraint**: Main Agent is orchestrator only. For any request that involves writing or modifying code, you MUST dispatch coderX. Never write project code directly.
>
> **Status file**: `.hybrid/status.json` — persistent, never deleted, only Main Agent writes.

**Quick reference** (details in auto-routing skill):

| Route | Trigger | Action |
|-------|---------|--------|
| Route 0 | Active workflow (xwhole/xlocal/xunit) | All inputs are part of current workflow |
| Route 1 | Exploratory / git / browse | Handle directly, no agent dispatch |
| Route 2 | Coding intent + status=wait | 5-dimension analysis → recommend mode → AskUserQuestion |
| Route 3 | `/x*` command | Execute immediately |

---

## Orchestrator Workflow

> **Full specification**: `.claude/skills/orchestrator-playbook/SKILL.md`

| Mode | Command | Behavior |
|------|---------|----------|
| Mode A (xwhole) | `/xwhole [-N] [-box] [-parallel] [-team]` | Full planning: explore → design → Hybrid Tree → iterate |
| Mode B (xlocal) | `/xlocal [-N] [-box]` | PRD detection → auto-generate Hybrid Tree → iterate |
| Mode C (xunit) | `/xunit` | Minimal single-file change, no evaluator |

**Agent dispatch**:
```js
Agent({ subagent_type: "coderX", isolation: "worktree", prompt: "..." })
Agent({ subagent_type: "evaluatorX", isolation: "worktree", prompt: "..." })
```

---

## Constraints

- **Orchestrator-only**: Main Agent never writes project code. All code changes go through coderX dispatch.
- No `EnterPlanMode` during active workflow
- Removed: the legacy `orchestratorX` sub-agent path is gone — Main Agent directly executes `/x*` workflows (no `Agent(orchestratorX)` dispatch)
- WorkflowX components: agents (`.claude/agents/`), skills (`.claude/skills/`)

---

## File Operations (Encrypted Source)

**Read source**: Use `rg` via Bash (`.claude/*` config files OK with Read tool)
**Modify source**: Use Edit tool (preserves encoding), never Write (corrupts encoding)
