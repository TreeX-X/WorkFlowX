---
description: Minimal unit task: promptX -> coderX, no evaluation
agent: orchestratorX
subtask: true
---

Invoke the orchestratorX agent in unit mode (Mode C: unit) to execute the following requirement.

User input: $ARGUMENTS

**Execution flow:**
1. Load runtime environment (Module 01)
2. Invoke promptX to extract intent and output structured prompt (Module 04)
3. Invoke coderX to perform a minimal change (lightweight mode: only loads guideX + razorX, does not load specX)
4. Report completion to user; evaluatorX is only invoked if the user explicitly requests it
