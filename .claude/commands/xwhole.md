Invoke the orchestratorX agent in whole mode (Mode A: whole) to execute the following requirement.

User input: $ARGUMENTS

**Execution flow (sequential mode, default):**
1. Parse parameters from $ARGUMENTS (see orchestrator-playbook Parameter Parsing section)
2. Load runtime environment (Module 01)
3. Conduct PRD planning dialogue in the current session (orchestratorX follows orchestrator-playbook Planning Phase), outputting a Hybrid Tree (Parent + Children)
4. Wait for user to confirm the PRD (triggered by user entering Summary)
5. Invoke promptMasterX to optimize the execution instruction (Module 04)
6. Invoke coderX (isolation="worktree") to implement based on the instruction
7. Bus payload validation (Module 02) + Create checkpoint (Module 03)
8. Invoke evaluatorX (isolation="worktree") for targeted review
9. If fixes are needed, loop steps 6-8 (max iterations determined by -N parameter, default 2). **Early exit**: if evaluatorX returns `Evaluation Result: PASS`, terminate iteration immediately without entering the next round
10. Merge worktree branches back to working branch (or sandbox branch if -box specified)
11. If -box: merge sandbox branch into original branch, restore stash

**Execution flow (parallel mode, `-parallel` flag):**
1. Parse parameters from $ARGUMENTS
2. Load runtime environment (Module 01)
3. Same Planning Phase as sequential mode (steps 3-4)
4. Parallel setup (Module 05): Create Agent Team, spawn teammates with isolation="worktree"
5. Task coordination (Module 06): Dynamic scheduling, dependency unlock, file conflict check
6. After all tasks complete: merge worktree branches (→ sandbox if -box → original branch)

Supported parameters (parsed from $ARGUMENTS):
- `-N [number]`: Set the maximum number of evaluation iteration rounds (default: 2, range: 1-10)
- `-box [name]`: Create a sandbox branch for dual-layer isolation (worktree + sandbox branch)
- `-parallel`: Enable Agent Teams parallel execution within Mode A
- `-team [name]`: Set the Agent Team name (default: "workflow-{timestamp}", only with `-parallel`)
