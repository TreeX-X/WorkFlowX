---
name: xwhole
description: Execute full workflow in whole mode (Mode A): planning dialogue → coderX coding → evaluatorX review
---

Please invoke the orchestratorX agent in whole mode (Mode A: whole) to execute the following requirement.

User input: ${input:args}

Execution flow:
1. Parse parameters from ${input:args} (see orchestrator-playbook Parameter Parsing section)
2. Load runtime environment (Module 01)
3. Conduct PRD planning dialogue (orchestratorX follows orchestrator-playbook Planning Phase), output Hybrid Tree (Parent + Children)
4. Wait for user confirmation of PRD
5. Invoke promptMasterX to optimize execution instructions (Module 04)
6. Invoke coderX to implement code based on instructions
7. Bus payload validation (Module 02) + create checkpoint (Module 03)
8. Invoke evaluatorX for targeted review
9. If fixes are needed, loop steps 6-8 (max iterations determined by -N parameter, default 2). **Early exit**: if evaluatorX returns `Evaluation Result: PASS`, terminate iteration immediately and skip the next round
10. After iteration completes, perform closing; if -box parameter is provided, handle sandbox branch merge

Supported parameters (parsed from ${input:args}):
- `-N [number]`: Set maximum evaluation iteration rounds (default: 2, range: 1-10)
- `-box [name]`: Execute in a sandbox branch, isolated from mainline
