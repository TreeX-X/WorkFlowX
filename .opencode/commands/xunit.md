---
description: Minimal unit task: promptX -> coderX, no evaluation
agent: build
subtask: true
---

Execute WorkflowX unit mode (Mode C: unit) in the current OpenCode main agent session. The main agent dispatches coderX only for implementation; evaluatorX is skipped unless explicitly requested.

User input: $ARGUMENTS

**Execution flow:**
1. Load runtime environment (Module 01)
2. Invoke promptX to extract intent and output structured prompt (Module 04)
3. Invoke coderX to perform a minimal change (lightweight mode: only loads guideX + razorX, does not load specX)
4. Report completion to user; evaluatorX is only invoked if the user explicitly requests it
