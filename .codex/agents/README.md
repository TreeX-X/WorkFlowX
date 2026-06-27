# WorkflowX Codex Agent Prompts

OpenAI Codex does not register project subagents from `.codex/agents/*.toml`.
These files are prompt references for WorkflowX handoffs only.

Runtime behavior lives in:

- `AGENTS.md` for durable repo instructions and natural-language `xwhole` / `xlocal` / `xunit` prefixes.
- `.codex/config.toml` for Codex-native project settings such as sandbox policy and MCP servers.
- `.codex/skills/` for reusable Codex skills.

The active Codex main agent performs orchestration directly and may use the `coderX`, `evaluatorX`, `promptMasterX`, and `abstracterX` prompt references when a WorkflowX handoff needs to be expressed.
