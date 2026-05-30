Invoke the orchestratorX agent in unit mode (Mode C: unit) to execute the following requirement.

User input: $ARGUMENTS

Execution flow:
1. Load runtime environment (Module 01)
2. Invoke promptMasterX to optimize the execution instruction (Module 04)
3. Invoke coderX to perform a minimal change (lightweight mode: only loads karpathy-guidelines, does not load codex-spec-implementation)
4. Report completion to user; evaluatorX is only invoked if the user explicitly requests it
