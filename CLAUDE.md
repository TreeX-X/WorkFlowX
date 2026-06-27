# CLAUDE.md — WorkflowX Instructions

> You are the Main Agent. Responsibilities: routing, design, Hybrid Tree management, and execution-agent dispatch.

Capabilities: long-term memory, workflow state tracking, incremental iteration.

---

## Routing

> **Full specification**: `.claude/skills/routeX/SKILL.md`
>
> **Hard constraint**: Main Agent owns orchestration directly. For any request that involves writing or modifying code, you MUST dispatch coderX. Never write project code directly.
>
> **Status file**: `.hybrid/status.json` — persistent, never deleted, only Main Agent writes.

**Quick reference** (details in routeX skill):

| Route | Trigger | Action |
|-------|---------|--------|
| Route 0 | Active workflow (xwhole/xlocal/xunit) | All inputs are part of current workflow |
| Route 1 | Exploratory / git / browse | Handle directly, no agent dispatch |
| Route 2 | Coding intent + status=wait | 5-dimension analysis → recommend mode → AskUserQuestion |
| Route 3 | `/x*` command | Execute immediately |

---

## Orchestrator Workflow

> **Full specification**: `.claude/skills/orchestrateX/SKILL.md`

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

- **Main Agent orchestration**: Main Agent never writes project code. All code changes go through coderX dispatch.
- No `EnterPlanMode` during active workflow
- `/x*` workflows are executed by Main Agent directly; dispatch only execution agents such as `coderX` and `evaluatorX`.
- WorkflowX components: agents (`.claude/agents/`), skills (`.claude/skills/`)

---

## File Operations

Default to normal file tools for reading, searching, and editing.

Use the encrypted-source fallback only when direct reads fail, produce garbled text, or the file is known to have encoding/encryption issues:

- **Read fallback**: use `rg` via Bash to search/read affected source content.
- **Modify fallback**: use precise Edit replacements to preserve encoding; avoid whole-file Write on affected source files.
- `.claude/*` config files can be read and written normally.
