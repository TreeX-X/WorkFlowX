---
description: Execute Mode C workflow (unit task, minimal change)
---

# /xunit - Minimal Change Flow

**Executed by Main Agent directly.**

When user inputs `/xunit [-prompt] [requirement]`:

1. Execute Mode C flow:
   - Skip MCP health check and all knowledge graph retrieval
   - If `-prompt` is present: invoke promptX before dispatch and include its output in the Type 0 Dispatch Payload
   - If `-prompt` is absent: place the raw requirement in the Type 0 Dispatch Payload
   - Build and validate Type 0 Dispatch Payload before dispatch
   - Dispatch Agent(coderX) lightweight mode
     - Load guideX + razorX only
     - No Hybrid Tree, no Bus Payload
     - No worktree isolation
   - Report to user

Detailed flow reference: `CLAUDE.md` §Mode Execution
