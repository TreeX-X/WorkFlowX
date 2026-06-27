---
description: Execute Mode C workflow (unit task, minimal change)
---

# /xunit - Minimal Change Flow

**Executed by Main Agent directly.**

When user inputs `/xunit [requirement]`:

1. Execute Mode C flow:
   - Environment init (Module 01)
   - Dispatch Agent(coderX) lightweight mode
     - Load guidelines skill only
     - No Hybrid Tree, no Bus Payload
     - No worktree isolation
   - Report to user

Detailed flow reference: `CLAUDE.md` §Mode Execution
