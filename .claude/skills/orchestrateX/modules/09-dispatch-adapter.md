# Host dispatch

For task handoff, use the host's native Agent/subagent tool when available. Otherwise use prompt-spawn only when the surface supports it; without either, report degraded dispatch and do not pretend Main Agent is an independent subagent. User-authorized direct fallback remains possible.

## Native

Select coderX/evaluatorX as required, with the current payload from module 02 and supported isolation. Record returned identity/status and validate output against the requested contract. Agent definitions alone do not establish a callable dispatch capability.

## Prompt-spawn

Emit this envelope, followed by the module 02 payload:

```text
WorkflowX Subagent Spawn Request
Target Agent: <role>
Dispatch Mode: prompt_spawn
Isolation Request: <supported isolation>
Return Contract: <required result>
```

Require a returned `WorkflowX Subagent Receipt` with Agent Identity, Dispatch Mode Observed and Payload Type Received. A missing receipt is unverified, not a successful handoff. This handshake is not proof of isolation.

## Result

Check scope, required output and actual evidence. Malformed handoff data is Main Agent's responsibility; correct it once rather than replaying the whole conversation. Preserve independent evaluator identity and read-only behavior.

Keep host thread/run IDs and dispatch traces in local runtime records, not duplicated Note prose. Main Agent integrates useful results into the same Task before the next handoff.
