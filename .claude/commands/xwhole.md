Invoke the orchestratorX agent in whole mode (Mode A: whole) to execute the following requirement.

User input: $ARGUMENTS

Execution flow:
1. Parse parameters from $ARGUMENTS (see orchestrator-playbook Parameter Parsing section)
2. Load runtime environment (Module 01)
3. Conduct PRD planning dialogue in the current session (orchestratorX follows orchestrator-playbook Planning Phase), outputting a Hybrid Tree (Parent + Children)
4. Wait for user to confirm the PRD (triggered by user entering Summary)
5. Invoke promptMasterX to optimize the execution instruction (Module 04)
6. Invoke coderX to implement based on the instruction
7. Bus payload validation (Module 02) + Create checkpoint (Module 03)
8. Invoke evaluatorX for targeted review
9. If fixes are needed, loop steps 6-8 (max iterations determined by -N parameter, default 2). **Early exit**: if evaluatorX returns `Evaluation Result: PASS`, terminate iteration immediately without entering the next round
10. After iteration completes, wrap up; if -box parameter is present, handle sandbox branch merge

Supported parameters (parsed from $ARGUMENTS):
- `-N [number]`: Set the maximum number of evaluation iteration rounds (default: 2, range: 1-10)
- `-box [name]`: Execute in a sandbox branch, isolated from mainline
