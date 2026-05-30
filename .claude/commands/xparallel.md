Invoke the orchestratorX agent in parallel mode (Mode D: parallel / Agent Teams) to execute the following requirement.

User input: $ARGUMENTS

Execution flow:
1. Parse parameters from $ARGUMENTS (see orchestrator-playbook Parameter Parsing section)
2. Load runtime environment (Module 01)
3. Parallel setup (Module 05):
   a. Check Agent Teams availability (env CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1, Claude Code v2.1.32+)
   b. If unavailable, fall back to Mode A/B subagent mode and notify user
   c. Generate or load Hybrid Tree (Parent + Children)
   d. Create Agent Team with coder-teammate and evaluator-teammate
   e. Initialize task pool: read Parent Section 7 for Children, Section 8.3 for dependencies
   f. Mark independent tasks as `ready`, dependent tasks as `blocked`
4. Task coordination (Module 06):
   a. Dispatch `ready` tasks to idle coder-teammates in parallel
   b. When coder completes, dispatch evaluator-teammate for review
   c. On dependency completion, unlock blocked tasks (check all dependencies satisfied)
   d. File conflict check before assignment (read Child Section 8.1, compare with in_progress tasks)
   e. If evaluation returns Needs Fix, loop coder→evaluator (max iterations determined by -N parameter)
   f. Monitor progress, report status to user
5. After all tasks complete, output final summary

Supported parameters (parsed from $ARGUMENTS):
- `-N [number]`: Set the maximum number of evaluation iteration rounds per task (default: 2, range: 1-10)
- `-team [name]`: Set the Agent Team name (default: "workflow-{timestamp}")

Do NOT invoke abstracterX or any summarization agent unless explicitly requested.
