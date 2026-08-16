---
description: Execute Mode D with the Main Agent as the default implementation owner
---

# /xmain - Direct Main Agent Flow

When user inputs `/xmain [requirement]`:

1. Keep Mode D active for the conversation.
2. Decompose each new requirement against unfinished work before editing.
3. Load only the relevant skills and implement directly in the Main Agent.
4. Use Claude Agent Teams only when the decomposition has at least two independent, non-overlapping work packages.
5. Verify the changes and report checks and residual risks.

Detailed flow reference: `.claude/skills/routeX/SKILL.md` Mode D.
