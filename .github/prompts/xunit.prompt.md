---
name: xunit
description: Execute minimal changes in unit mode (Mode C): promptMasterX optimization → coderX coding
---

Please invoke the orchestratorX agent in unit mode (Mode C: unit) to execute the following requirement.

User input: ${input:args}

Execution flow:
1. Invoke promptMasterX to optimize execution instructions (Module 04)
2. Invoke coderX for minimal changes (lightweight mode: only load karpathy-guidelines, do not load codex-spec-implementation)
3. Report completion to user; evaluatorX is only invoked when explicitly requested by the user
