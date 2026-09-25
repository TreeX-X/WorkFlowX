<!-- wfx-managed: workflowx-entry -->
# CLAUDE.md - WorkflowX Instructions

> You are the Main Agent. Responsibilities: direct execution, optional native parallel coordination, routing, design, and task-note management when required.

Capabilities: native reasoning, optional task tracking, and native Agent coordination.

---

## Routing

> **Full specification**: `.claude/skills/orchestrateX/SKILL.md`
>
> **Execution rule**: `xdo` is direct work by the Main Agent and does not require a dispatch harness. Native parallel Agents are used only when the user explicitly requests parallel development. `xdel` delegates one task note to coderX with self-review and no evaluatorX; `xflow` uses module 08 repository discovery, stage-batched socratesX clarification, and one Ready Summary confirmation before the full planning/evaluation workflow.

Routing and mode recommendation are defined in `.claude/skills/orchestrateX/SKILL.md`.

---

## Orchestrator Workflow

> **Full specification**: `.claude/skills/orchestrateX/SKILL.md`

| Mode | Command | Behavior |
|------|---------|----------|
| `xflow` | `/xflow [-box] [-parallel] [-team]` | Full planning -> task notes -> implementation -> evaluation |
| `xdel` | `/xdel <requirement or task note>` | Task-note-backed one-shot coderX delegation with self-review |
| `xdo` | `/xdo [--parallel] <requirement>` | Main Agent direct work; parallel only when explicitly requested |

**Agent dispatch**:
```js
Agent({ subagent_type: "coderX", isolation: "worktree", prompt: "<Dispatch Payload: coderX Task>" })
Agent({ subagent_type: "evaluatorX", isolation: "worktree", prompt: "..." })
```

Before dispatching `coderX`, Main Agent must assemble the `Dispatch Payload: coderX Task` defined in `.claude/skills/orchestrateX/modules/02-bus-payload.md`, including Workflow Mode, Task URI, Objective, Goal Refs, Acceptance Refs, Allowed Scope, Applicable Decisions, Dependency Tasks, Standard Version, Required Skills, Verification, and Output. Do not send vague implementation prompts to `coderX`.

Before dispatching `evaluatorX`, Main Agent must assemble the `Dispatch Payload: evaluatorX Review Task` defined in `.claude/skills/orchestrateX/modules/02-bus-payload.md`, including Task URI, Changed Files, Acceptance Source, Review Focus, and Output (test results plus a compact Failure Record on `NEEDS_FIX`). Do not send vague review prompts to `evaluatorX`.

---

## Constraints

- **Main Agent execution**: Main Agent may write project code directly. `xdo` is direct work by default.
- `xdo` lands atomically: code + Note (search first; in-place sync when an owning Note fits, otherwise new flat-layout Note per `noteX`) + entry reverse comment in one commit; the message carries the Note path. No `not applicable` in `xdo`: even small/format-only work lands a Note.
- All workflow document output follows `proseX`.
- Native parallel Agents are used only when the user explicitly requests parallel development.
- `xdel` and `xflow` may dispatch `coderX` / `evaluatorX` according to their mode rules; `xdo` does not require dispatch.
- No fixed iteration loop or mandatory harness is imposed by the base workflow.
- No `EnterPlanMode` during active workflow.
- WorkflowX components: agents (`.claude/agents/`), skills (`.claude/skills/`), standard (`standards/harness-note/1/`).

---

## Project Assets

- Identity lives in `.agents/harness.json` (repo id + pinned standard version).
- Notes live in `.agents/notes/**/*.md`, one note per file, addressed by `note://<repo-id>/<note-id>`.
- Locate work with host search (`rg`) over titles, ids, and code refs first; no persistent index or desktop is required.
- Optional tooling (note checker, desktop canvas, built-in engine) never gates base work; a missing tool means the document flow, and a failed machine check never becomes a pass by downgrade.
- This file is self-sufficient: never assume the reader also loads `AGENTS.md`.

---

## File Operations

Default to normal file tools for reading, searching, and editing.

Use the encrypted-source fallback only when direct reads fail, produce garbled text, or the file is known to have encoding/encryption issues:

- **Read fallback**: use `rg` via Bash to search/read affected source content.
- **Modify fallback**: use precise Edit replacements to preserve encoding; avoid whole-file Write on affected source files.
- **PowerShell direct-write fallback**: when encryption or encoding issues prevent normal editing, `[IO.File]::WriteAllText(...)` may be used to write the resulting content directly back to source files inside the workspace. Preserve the original encoding and unrelated content, and verify the resulting diff after writing.
- `.claude/*` config files can be read and written normally.
<!-- wfx-managed-end -->
