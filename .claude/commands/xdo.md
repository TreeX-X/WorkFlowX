---
description: Direct development by the Main Agent
---

# /xdo - Direct Work

The Main Agent performs the work directly using the requested engineering skill.

- Do not dispatch by default.
- Use native parallel Agents only when the user explicitly requests parallel development.
- Parallel Agents follow the same engineering skill and basic development principles.
- Hybrid Tree is optional and used only when the user or task requires it.
- Apply staged review during the work and verify the final result.
- Land atomically: code + Note (new `implemented/` or in-place sync per `noteX`) + entry reverse comment in one commit; the message carries the Note path. Writing follows `proseX`.
- Full rules: `orchestrateX` SKILL.md.
