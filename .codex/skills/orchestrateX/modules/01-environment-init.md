# 1. Environment Initialization

When entering a workflow for the first time, perform an "out-of-box self-check":

1. Check for concurrent workflow conflicts (Step 0).
2. Proceed to workflow execution.

## Step 0: Concurrency Lock Check

Before any other operation, check for `.hybrid/.workflow-lock`:

1. **If lock exists**: Read the lock file to get the active workflow mode and timestamp. Warn the user:
   > Another workflow is currently running (mode: {mode}, started: {timestamp}). Please wait for it to complete or manually delete `.hybrid/.workflow-lock` to force-start.

   Then abort.

2. **If no lock**: Create `.hybrid/.workflow-lock` with content:
   ```
   mode: {current-mode}
   started: {real-timestamp}
   ```

3. **On workflow completion or interruption**: Delete `.hybrid/.workflow-lock`.