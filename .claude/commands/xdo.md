---
description: xdo WorkflowX workflow
---

# /xdo

Main Agent performs direct work. No Task is created; explicitly selected existing Tasks retain acceptance and review obligations. Maintain Notes only when relevant facts change.

Land atomically: code + Note (in-place sync per `noteX`, new topic file only when none fits) + entry reverse comment in one commit; the message carries the Note path. Mechanical or local edits are `not applicable`, code only. Writing follows `proseX`.

Use .claude/skills/orchestrateX/SKILL.md and only its applicable references.
