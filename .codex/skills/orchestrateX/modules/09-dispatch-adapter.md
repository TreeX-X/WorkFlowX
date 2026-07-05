# 9. Codex Dispatch Adapter

> **Purpose**: Convert WorkflowX routing decisions into Codex subagent dispatch actions.

WorkflowX decides which agent should do the work. The dispatch adapter decides how that handoff is executed in the current Codex surface.

## Dispatch Modes

Use the first available mode in this order:

| Mode | When to use | Behavior |
|---|---|---|
| `native_tool` | The current host exposes an explicit Agent/subagent dispatch tool | Call the native tool with the selected agent name and the full Dispatch Payload. |
| `prompt_spawn` | The host supports Codex prompt-triggered subagents but no explicit Agent tool is exposed | Ask Codex to spawn the named custom agent and give it the full Dispatch Payload as its only task. |
| `degraded` | No reliable native tool or prompt-spawn behavior is available or observable | Report degraded dispatch and stop before code-writing handoff unless the user explicitly approves direct fallback. |

## Capability Probe

Before the first automatic handoff in a workflow, Main Agent records a session-local dispatch capability:

```text
subagent_dispatch = native_tool | prompt_spawn | degraded
dispatch_surface = current host/surface when known
dispatch_evidence = tool availability, Codex subagent support, or user-provided host capability
```

Detection rules:

1. If an explicit Agent/subagent tool is listed in the current callable tools, set `native_tool`.
2. Else if the active Codex surface is known to support prompt-triggered subagents, or the user explicitly confirms this surface supports them, set `prompt_spawn`.
3. Else set `degraded`.

Do not infer `native_tool` from the existence of `.codex/agents/*.toml`. Agent files define selectable agents; they do not prove a callable dispatch mechanism exists.

## Prompt-Spawn Envelope

When using `prompt_spawn`, Main Agent emits a subagent request in this exact shape:

````markdown
### WorkflowX Subagent Spawn Request
- **Target Agent**: [coderX | evaluatorX | promptMasterX | abstracterX | worker | explorer | default]
- **Dispatch Mode**: prompt_spawn
- **Isolation Request**: [worktree | shared | readonly | N/A]
- **Return Contract**: [concise summary | Bus Payload Type 1 | Bus Payload Type 2 | structured prompt]

Spawn a Codex subagent using the custom agent named above. Give the spawned agent only the Dispatch Payload below as its task. The spawned agent must not reinterpret this parent conversation.

The spawned agent must begin its response with:

```text
### WorkflowX Subagent Receipt
- **Agent Identity**: [same as Target Agent]
- **Dispatch Mode Observed**: prompt_spawn
- **Payload Type Received**: [coderX Task | evaluatorX Review Task | prompt preprocessing | abstraction task]
```

[Full Dispatch Payload follows]
````

The receipt is a prompt-level handshake, not cryptographic proof of isolation. Main Agent still validates the returned output against the required Bus Payload or summary contract before using it.

## Native Tool Envelope

When using `native_tool`, Main Agent calls the host-provided Agent/subagent tool with:

```text
subagent_type = Target Agent
prompt = Full Dispatch Payload
isolation = requested isolation when supported
```

If the native tool returns metadata, Main Agent records agent name, thread id, status, and output. If it returns only text, Main Agent validates the text output against the expected contract.

## Degraded Handling

When `degraded`:

1. Report: `subagent dispatch degraded: no native Agent tool and no verified prompt-spawn support in this surface`.
2. Do not silently execute implementation, evaluation, prompt preprocessing, or abstraction as Main Agent roleplay.
3. Continue only for direct-handling tasks allowed by `AGENTS.md`, or when the user explicitly approves a direct-execution fallback.

## Output Validation

For all dispatch modes:

1. Validate the returned content against the expected output contract.
2. For `prompt_spawn`, require the `WorkflowX Subagent Receipt` before accepting the output as a subagent result.
3. If the receipt is missing, mark the dispatch result as `unverified` and do not forward it downstream without user approval.
4. If a Bus Payload is malformed, follow module 02 correction/retry rules.

## Dispatch Result Record

After every dispatch attempt, Main Agent keeps a session-local record:

```markdown
### Dispatch Result
- **Target Agent**: [agent]
- **Dispatch Mode**: [native_tool | prompt_spawn | degraded]
- **Status**: [success | failed | unverified | degraded]
- **Output Contract**: [expected contract]
- **Validation Result**: [pass | fail | not_applicable]
- **Thread/Run ID**: [id or N/A]
- **Notes**: [short reason for fallback, failure, or expansion]
```

This record is session state unless a workflow document explicitly requires writing dispatch history.
