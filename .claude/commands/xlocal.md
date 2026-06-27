---
description: Execute Mode B workflow (local module, PRD detection)
---

# /xlocal - Fast Implementation Flow

**Executed by Main Agent directly.**

When user inputs `/xlocal [requirement]`:

1. Parse parameters (-N, -box)
2. Execute Mode B flow:
   - Environment init (Module 01)
   - PRD detection (priority: existing Hybrid Tree > file path > auto-generate)
   - Core Iteration Loop (dispatch coderX/evaluatorX)

Detailed flow reference: `CLAUDE.md` §Mode Execution
