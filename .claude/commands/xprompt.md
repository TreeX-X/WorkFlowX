---
description: Optimize prompt without triggering workflow
---

Agent(
  subagent_type="promptMasterX",
  description="Prompt optimization only",
  prompt="Original prompt: $ARGUMENTS

Task: Optimize this prompt into production-grade format.

Output requirements:
- Optimized prompt text
- Target tool annotation
- Optimization rationale
- Copy-paste ready format

Do NOT trigger any development workflow (xwhole/xlocal/xunit)."
)
