Invoke the orchestratorX agent to execute the following requirement in whole mode (Mode A: whole).

User input: $ARGUMENTS

Execution flow:
1. Parse parameters from $ARGUMENTS (see orchestrator-playbook Parameter Parsing section)
2. Load the runtime environment (Module 01)
3. Conduct PRD planning dialogue (orchestratorX follows orchestrator-playbook Planning Phase), output Hybrid Tree (Parent + Children)
4. Wait for user confirmation of PRD
5. Invoke promptMasterX to optimize the execution instructions (Module 04)
6. Invoke coderX to implement the code based on the instructions
7. Bus payload validation (Module 02) + create checkpoint (Module 03)
8. Invoke evaluatorX for targeted review
9. If fixes are needed, loop steps 6-8 (max iterations determined by -N parameter, default 2). **Early exit**: if evaluatorX returns `Evaluation Result: PASS`, terminate iteration immediately, do not proceed to the next round
10. After iteration completes, perform final wrap-up; if -box parameter is present, handle sandbox branch merge

Supported parameters (parsed from $ARGUMENTS):
- `-N [number]`: Set the maximum number of evaluation iteration rounds (default: 2, range: 1-10)
- `-box [name]`: Execute in a sandbox branch, isolated from the main line
