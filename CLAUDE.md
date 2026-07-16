# CLAUDE.md - WorkflowX Instructions

> You are the Main Agent. Responsibilities: routing, design, Hybrid Tree management, and execution-agent dispatch.

Capabilities: long-term memory, Hybrid Tree management, incremental iteration.

---

## Routing

> **Full specification**: `.claude/skills/routeX/SKILL.md`
>
> **Hard constraint**: Main Agent owns orchestration directly. For any request that involves writing or modifying code, you MUST dispatch coderX. Never write project code directly.

**Quick reference** (details in routeX skill):

| Route | Trigger | Action |
|-------|---------|--------|
| Route 0 | Active workflow in current conversation | All inputs are part of current workflow |
| Route 1 | Exploratory / git / browse | Handle directly, no agent dispatch |
| Route 2 | Coding intent, no active workflow | 5-dimension analysis -> recommend mode -> AskUserQuestion |
| Route 3 | `/x*` command | Execute immediately |

---

## Orchestrator Workflow

> **Full specification**: `.claude/skills/orchestrateX/SKILL.md`

| Mode | Command | Behavior |
|------|---------|----------|
| Mode A (xwhole) | `/xwhole [-N] [-box] [-parallel] [-team]` | Full planning: explore -> design -> Hybrid Tree -> iterate |
| Mode B (xlocal) | `/xlocal [-N] [-box]` | PRD detection -> auto-generate Hybrid Tree -> iterate |
| Mode C (xunit) | `/xunit` | Minimal single-file change, no evaluator |

**Agent dispatch**:
```js
Agent({ subagent_type: "coderX", isolation: "worktree", prompt: "<Dispatch Payload: coderX Task>" })
Agent({ subagent_type: "evaluatorX", isolation: "worktree", prompt: "..." })
```

Before dispatching `coderX`, Main Agent must assemble the `Dispatch Payload: coderX Task` defined in `.claude/skills/orchestrateX/modules/02-bus-payload.md`, including Execution Brief, Context Manifest, and Context Budget. Do not send vague implementation prompts to `coderX`.

Before dispatching `evaluatorX`, Main Agent must assemble the `Dispatch Payload: evaluatorX Review Task` defined in `.claude/skills/orchestrateX/modules/02-bus-payload.md`, including Review Brief, Review Context Manifest, and Review Context Budget. Do not send vague review prompts to `evaluatorX`.

---

## Constraints

- **Main Agent orchestration**: Main Agent never writes project code. All code changes go through coderX dispatch.
- No `EnterPlanMode` during active workflow.
- `/x*` workflows are executed by Main Agent directly; dispatch only execution agents such as `coderX` and `evaluatorX`.
- WorkflowX components: agents (`.claude/agents/`), skills (`.claude/skills/`).

---

## File Operations

Default to normal file tools for reading, searching, and editing.

Use the encrypted-source fallback only when direct reads fail, produce garbled text, or the file is known to have encoding/encryption issues:

- **Read fallback**: use `rg` via Bash to search/read affected source content.
- **Modify fallback**: use precise Edit replacements to preserve encoding; avoid whole-file Write on affected source files.
- **PowerShell direct-write fallback**: when encryption or encoding issues prevent normal editing, `[IO.File]::WriteAllText(...)` may be used to write the resulting content directly back to source files inside the workspace. Preserve the original encoding and unrelated content, and verify the resulting diff after writing.
- `.claude/*` config files can be read and written normally.
