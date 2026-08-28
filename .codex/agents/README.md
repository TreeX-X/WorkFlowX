# WorkflowX Codex Subagents

Codex registers project subagents from `.codex/agents/*.toml` when the host supports project subagent dispatch. These files define the WorkflowX handoff agents:

- `coderX`: implementation
- `evaluatorX`: evaluation

Runtime behavior lives in:

- `AGENTS.md` for durable repo instructions and natural-language `xwhole` / `xlocal` / `xunit` prefixes.
- `.codex/config.toml` for Codex-native project settings such as sandbox policy and agent threads.
- `.codex/skills/` for reusable Codex skills.

The active Codex main agent performs orchestration only for `xwhole`, `xlocal`, and `xunit`. In `xmain`, the Main Agent is the direct implementation owner, reads the relevant skills, and does not dispatch subagents or enable parallel execution.

Before dispatching `coderX`, Main Agent must create the `Dispatch Payload: coderX Task` defined in `.codex/skills/orchestrateX/modules/02-bus-payload.md`. This payload is the handoff contract and must be specific enough for coderX to execute without inferring user intent, mode, scope, output format, verification obligations, or context-reading strategy from conversation context. Include Execution Brief, Context Manifest, and Context Budget.

Before dispatching `evaluatorX`, Main Agent must create the `Dispatch Payload: evaluatorX Review Task` defined in `.codex/skills/orchestrateX/modules/02-bus-payload.md`. This payload must be specific enough for evaluatorX to audit without inferring audit target, acceptance scope, review focus, or context-reading strategy from conversation context. Include Review Brief, Review Context Manifest, and Review Context Budget.

If the current Codex host cannot dispatch project subagents, report subagent dispatch as degraded and ask whether to continue in a direct-execution fallback. Do not silently simulate a subagent.
