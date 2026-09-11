# 1. Environment Initialization

When entering a workflow for the first time, perform a light self-check. There is no global workflow lock; parallel work is allowed under the mode rules.

1. If a legacy `.hybrid/.workflow-lock` file exists (pre-lightweight versions), delete it and continue. It no longer blocks execution.
2. Before dispatching, check for same-target conflicts only: do not dispatch two agents to write the same Child path or the same files concurrently. Independent Children may run in parallel when dependencies allow and the user requested parallel work.
3. Proceed to workflow execution.