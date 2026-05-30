Invoke the orchestratorX agent to execute the following requirement in unit mode (Mode C: unit).

User input: $ARGUMENTS

Execution flow:
1. Invoke promptMasterX to optimize the execution instructions (Module 04)
2. Invoke coderX to perform minimal modifications (lightweight mode: load only karpathy-guidelines, do not load codex-spec-implementation)
3. Report completion to the user; evaluatorX is only invoked when explicitly requested by the user
