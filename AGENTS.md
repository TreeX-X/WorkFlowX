# AGENTS.md - WorkflowX Codex Instructions

> This file is the Codex entry instruction for WorkflowX.

Codex runtime truth lives in `AGENTS.md`, `.codex/config.toml`, `.codex/skills/`, and `.codex/agents/`.

Do not write `.claude/*` from Codex tasks. Claude-side files are for the Claude runtime only.

---

## Routing

> **Full specification**: `.codex/skills/orchestrateX/SKILL.md`

Codex does not register project subagents. The main Codex agent owns orchestration directly and uses `.codex/agents/` prompt references when a `coderX`, `evaluatorX`, `promptMasterX`, or `abstracterX` handoff needs to be expressed.

For code development, feature implementation, refactoring, or bug fixes:

- Follow the relevant `.codex/skills/` workflow.
- Keep changes scoped to project code and Codex/OpenCode config.
- Do not modify `.claude/*`.

Direct handling is allowed for read-only exploration, Codex/OpenCode config edits, git operations, and cases where the user explicitly asks to skip workflow handling.

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
- Codex/OpenCode config files such as `AGENTS.md`, `.codex/*`, and `.opencode/*` can be read and written normally.

---

## Runtime Files

- Codex config: `.codex/config.toml`
- Codex prompt references: `.codex/agents/`
- Codex skills: `.codex/skills/`
- OpenCode prompt references: `.opencode/agents/`
- OpenCode skills/commands: `.opencode/skills/`, `.opencode/commands/`
