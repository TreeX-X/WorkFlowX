# AGENTS.md - WorkflowX Codex Instructions

> This file is the Codex entry instruction for WorkflowX.

Codex runtime truth lives in `AGENTS.md`, `.codex/config.toml`, `.codex/skills/`, and `.codex/agents/`.

---

## Routing

> **Full specification**: `.codex/skills/orchestrateX/SKILL.md`

Codex uses project subagent definitions from `.codex/agents/`. The main Codex agent owns orchestration, but implementation, evaluation, prompt preprocessing, and abstraction handoffs must be dispatched to the corresponding subagent (`coderX`, `evaluatorX`, `promptMasterX`, `abstracterX`) instead of being simulated by main-agent roleplay.

Subagent dispatch follows `.codex/skills/orchestrateX/modules/09-dispatch-adapter.md`: use a native Agent/subagent tool when one is exposed; otherwise use Codex prompt-spawn when the current surface supports prompt-triggered subagents; otherwise report dispatch as degraded. Do not silently pretend to be `coderX` / `evaluatorX` / `promptMasterX` in the main-agent context.

When using prompt-spawn dispatch, Main Agent must emit the `WorkflowX Subagent Spawn Request` envelope from module 09 and require the returned `WorkflowX Subagent Receipt` before accepting the output as a verified subagent result.

Before automatically dispatching `coderX`, Main Agent must assemble a `Dispatch Payload: coderX Task` as defined in `.codex/skills/orchestrateX/modules/02-bus-payload.md`. The payload must state mode, dispatch type, objective, requirement source, Execution Brief, Context Manifest, Context Budget, scope, forbidden files, required skills, MCP policy, output contract, verification requirements, and stop conditions. Do not send vague implementation prompts to `coderX`.

Before automatically dispatching `evaluatorX`, Main Agent must assemble a `Dispatch Payload: evaluatorX Review Task` as defined in `.codex/skills/orchestrateX/modules/02-bus-payload.md`. The payload must state evaluation type, Review Brief, Review Context Manifest, Review Context Budget, changed files, affected ACs, review focus, MCP policy, output contract, and expansion rules. Do not send vague review prompts to `evaluatorX`.

For code development, feature implementation, refactoring, or bug fixes:

- Follow the relevant `.codex/skills/` workflow.
- Keep changes scoped to project code and Codex config.

Direct handling is allowed for read-only exploration, Codex config edits, git operations, and cases where the user explicitly asks to skip workflow handling.

---

## Codex Aliases

Treat these natural-language prefixes as workflow commands:

| Prefix | Meaning |
|--------|---------|
| `xwhole` | Full-repo workflow: discovery -> implementation -> evaluation |
| `xlocal` | Local/module workflow |
| `xunit` | Minimal unit task |
| `xstatus` | Generate workflow status report |
| `xprompt` | Prompt optimization only |

---

## File Operations

Default to normal file tools for reading, searching, and editing.

Use the encrypted-source fallback only when direct reads fail, produce garbled text, or the file is known to have encoding/encryption issues:

- **Read fallback**: use `rg` via Bash to search/read affected source content.
- **Modify fallback**: use precise Edit replacements to preserve encoding; avoid whole-file Write on affected source files.
- Codex config files such as `AGENTS.md` and `.codex/*` can be read and written normally.

---

## Runtime Files

- Codex config: `.codex/config.toml`
- Codex subagent definitions: `.codex/agents/`
- Codex skills: `.codex/skills/`
