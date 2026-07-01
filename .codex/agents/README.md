# WorkflowX Codex Subagents

Codex registers project subagents from `.codex/agents/*.toml` when the host supports project subagent dispatch. These files define the WorkflowX handoff agents:

- `coderX`: implementation
- `evaluatorX`: evaluation
- `promptMasterX`: prompt preprocessing
- `abstracterX`: code and architecture summarization

Runtime behavior lives in:

- `AGENTS.md` for durable repo instructions and natural-language `xwhole` / `xlocal` / `xunit` prefixes.
- `.codex/config.toml` for Codex-native project settings such as sandbox policy and MCP servers.
- `.codex/skills/` for reusable Codex skills.

The active Codex main agent performs orchestration only. When a WorkflowX handoff is required, dispatch the matching subagent definition instead of role-playing that agent inside the main context.

If the current Codex host cannot dispatch project subagents, report subagent dispatch as degraded and ask whether to continue in a direct-execution fallback. Do not silently simulate a subagent.
