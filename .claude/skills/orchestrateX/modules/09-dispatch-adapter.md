# 09. Claude Dispatch Adapter

> **Purpose**: Convert WorkflowX routing decisions into Claude subagent dispatch actions.

WorkflowX decides which agent should do the work. This adapter decides how that handoff is executed on the Claude surface.

## Dispatch

Claude exposes a native Agent/subagent dispatch tool. Use it for every `xdel`/`xflow` handoff:

```js
Agent({ subagent_type: "coderX", prompt: "<Dispatch Payload: coderX Task>" })
Agent({ subagent_type: "evaluatorX", prompt: "<Dispatch Payload: evaluatorX Review Task>" })
```

- Pass the full Dispatch Payload from module 02 as the prompt. Do not summarize or reinterpret it.
- Request worktree isolation when the host supports it; otherwise run shared and record the fact.

## Degraded Handling

If no Agent dispatch tool is observable in the current surface:

1. Report: `subagent dispatch degraded: no native Agent tool in this surface`.
2. Do not silently execute implementation or evaluation as Main Agent roleplay.
3. Continue only for direct-handling tasks allowed by `CLAUDE.md`, or when the user explicitly approves a direct-execution fallback.

## Output Validation

1. Validate returned content against the expected output contract in module 02 (implementation summary + Change Summary + Note draft; or Evaluation Result).
2. If a payload is malformed, Main Agent corrects the dispatch fields and retries once with minimal context, then hands to the user on repeated failure.

## Dispatch Result Record

After every dispatch attempt, Main Agent keeps a session-local record:

```markdown
### Dispatch Result
- **Target Agent**: [agent]
- **Status**: [success | failed | degraded]
- **Output Contract**: [expected contract]
- **Validation Result**: [pass | fail | not_applicable]
- **Thread/Run ID**: [id or N/A]
- **Notes**: [short reason for fallback or failure]
```

This record is session state unless a workflow document explicitly requires writing dispatch history.
