---
description: Execute Mode C workflow (unit task, minimal change)
---

# /xunit - Minimal Change Flow

**Executed by Main Agent directly.**

When user inputs `/xunit [-prompt] [requirement]`:

1. Execute Mode C flow:
   - Skip MCP health check and all knowledge graph retrieval
   - If `-prompt` is present: invoke promptX before dispatch
   - If `-prompt` is absent: pass the raw requirement directly to coderX
   - Dispatch Agent(coderX) lightweight mode
     - Load guideX + razorX only
     - No Hybrid Tree, no Bus Payload
     - No worktree isolation
   - Report to user

Detailed flow reference: `CLAUDE.md` §Mode Execution
