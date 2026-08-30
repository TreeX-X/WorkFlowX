# AGENTS.md - WorkflowX Codex Instructions

> This file is the Codex entry instruction for WorkflowX.

Codex runtime truth lives in this file, `.codex/config.toml`, `.codex/skills/`, and `.codex/agents/`.

---

## Routing

> **Full specification**: `.codex/skills/orchestrateX/SKILL.md`

Codex uses project subagent definitions from `.codex/agents/`. The Main Agent owns direct execution and may use native parallel Agents when the user explicitly requests parallel work. `xdel`/`xflow` may use the corresponding workflow agents when their mode requires it.

Subagent dispatch follows `.codex/skills/orchestrateX/modules/09-dispatch-adapter.md`: use a native Agent/subagent tool when one is exposed; otherwise use Codex prompt-spawn when the current surface supports prompt-triggered subagents; otherwise report dispatch as degraded. Do not silently pretend to be `coderX` / `evaluatorX` in the main-agent context.

When using prompt-spawn dispatch, Main Agent must emit the `WorkflowX Subagent Spawn Request` envelope from module 09 and require the returned `WorkflowX Subagent Receipt` before accepting the output as a verified subagent result.

Before automatically dispatching `coderX`, Main Agent must assemble a `Dispatch Payload: coderX Task` as defined in `.codex/skills/orchestrateX/modules/02-bus-payload.md`. The payload must state mode, dispatch type, objective, requirement source, Execution Brief, Context Manifest, Context Budget, scope, forbidden files, required skills, output contract, verification requirements, and stop conditions. Do not send vague implementation prompts to `coderX`.

Before automatically dispatching `evaluatorX`, Main Agent must assemble a `Dispatch Payload: evaluatorX Review Task` as defined in `.codex/skills/orchestrateX/modules/02-bus-payload.md`. The payload must state evaluation type, Review Brief, Review Context Manifest, Review Context Budget, changed files, affected ACs, review focus, output contract, and expansion rules. Do not send vague review prompts to `evaluatorX`.

For code development, feature implementation, refactoring, or bug fixes:

- Follow the relevant `.codex/skills/` workflow.
- Keep changes scoped to project code and Codex config.
- `xdo` is the direct-execution mode: the Main Agent reads the requested engineering skill, decomposes the requirement, and works directly by default. Parallel Agents are used only when the user explicitly requests parallel development; their work follows the same engineering skill.

Direct handling is allowed for read-only exploration, Codex config edits, git operations, and cases where the user explicitly asks to skip workflow handling.

---

## Workflow Commands

Treat these natural-language prefixes as workflow commands:

| Prefix | Meaning |
|--------|---------|
| `xflow` | Full-repo workflow: discovery -> implementation -> evaluation |
| `xdel` | Hybrid Tree-backed delegated implementation; coderX self-reviews, no evaluatorX |
| `xdo` | Main Agent direct execution; optional native parallelism only when explicitly requested |
| `xstatus` | Generate workflow status report |

---

## File Operations

Default to normal file tools for reading, searching, and editing.

Automatically use the encrypted-source fallback when a file cannot be edited directly, direct reads fail or produce garbled text, or the file is known to be encrypted or have encoding issues:

- **Read fallback**: use `rg` via Bash to search/read affected source content.
- **Modify fallback**: use precise Edit replacements to preserve encoding; avoid whole-file Write on affected source files.
- **PowerShell direct-write fallback**: when encryption or encoding issues prevent normal editing, `[IO.File]::WriteAllText(...)` may be used to write the resulting content directly back to source files inside the workspace. Preserve the original encoding and unrelated content, and verify the resulting diff after writing.
- Codex config files such as `AGENTS.md` and `.codex/*` can be read and written normally.

---

## Runtime Files

- Codex config: `.codex/config.toml`
- Codex subagent definitions: `.codex/agents/`
- Codex skills: `.codex/skills/`
