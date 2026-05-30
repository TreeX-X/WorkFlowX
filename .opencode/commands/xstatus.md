---
description: View current workflow status and hybrid document progress
agent: orchestratorX
subtask: true
---

Invoke the orchestratorX agent in status mode to report the current workflow state.

User input: $ARGUMENTS

Execution flow:
1. Scan `.hybrid/` directory for existing Hybrid Tree documents
2. Check git status for uncommitted changes related to active features
3. Summarize current workflow progress:
   - Active features and their phases (planning, coding, evaluation)
   - Pending evaluation results
   - Iteration counts and limits
4. Output a structured status report
