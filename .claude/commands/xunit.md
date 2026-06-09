---
description: Execute Mode C workflow (unit task, minimal change)
---

Agent(
  subagent_type="orchestratorX",
  description="Execute Mode C workflow",
  prompt="Mode: xunit

Requirement: $ARGUMENTS

Execute Mode C workflow following orchestrator-playbook:

1. Environment Init (Module 01): MCP probe, concurrency lock
2. promptMasterX optimization (Module 04, optional if input contains file path)
3. coderX lightweight mode: single minimal change
   - Only loads karpathy-guidelines
   - Skip codex-spec-implementation
   - No Bus Payload output
   - No worktree isolation (direct on current branch)
4. Report to user

Key behaviors:
- Minimal overhead, fast execution
- evaluatorX only if user explicitly requests
- No Hybrid Tree generation"
)
