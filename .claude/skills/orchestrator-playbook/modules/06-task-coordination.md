# Module 06: Task Coordination

> **Trigger**: After Module 05 completes, runs continuously until all tasks complete or user interrupts

## Team Lead Responsibilities

orchestratorX as Team Lead:

1. **Task scheduling**: Monitor task status, trigger dependency unlock
2. **File conflict check**: Before assignment, check file overlap
3. **Requirement change handling**: Receive user input, update Hybrid Tree
4. **Progress monitoring**: Report progress, handle exceptions

**Rule**: Teammates only claim tasks, complete tasks, and report results. All scheduling logic is managed by Team Lead.

## Core Coordination Loop

The coordination loop is **event-driven**. Teammates send messages to the Team Lead when they complete work. orchestratorX processes each message and dispatches the next action.

### Step 1: Wait for Teammate Messages

After initial dispatch (Module 07), orchestratorX waits for teammate messages. Messages arrive automatically as conversation turns — no polling needed.

When a message arrives from a teammate, proceed to Step 2.

### Step 2: Process Completion

When a coder-teammate reports task completion:

1. **Verify completion**: Read the teammate's message for Change Summary
2. **Load Module 02**: Validate the Bus Payload format
3. **Dispatch evaluator**: Send evaluation request to evaluator-teammate

```
SendMessage(
  to="evaluator-1",
  summary="Evaluate task {task-id}",
  message="Please evaluate the implementation for task {task-id}. Read Parent and Child hybrid docs, check git diff, and output Evaluation Result Payload."
)
```

When an evaluator-teammate reports evaluation result:

1. **Load Module 03**: Post-evaluation document update (with real timestamps, AC checkbox, status update)
2. **Check result**:
   - **PASS**: Mark task as completed, proceed to unlock dependents
   - **Needs Fix**: Send fix instructions back to coder (if iteration limit not reached)

```
# On PASS:
TaskUpdate(taskId="{task-id}", status="completed")

# On Needs Fix (within iteration limit):
SendMessage(
  to="coder-{N}",
  summary="Fix instructions for task {task-id}",
  message="Evaluation found issues. Fix instructions:\n{fix-instructions}\nPlease fix and re-submit."
)

# On Needs Fix (iteration limit reached):
TaskUpdate(taskId="{task-id}", status="failed")
Report to user: "Task {task-id} failed after {N} iterations"
```

### Step 3: Unlock Dependencies

After marking a task as completed:

```
1. Read TaskList to find all tasks
2. For each task with status "blocked":
   a. Read its blockedBy list (from TaskGet)
   b. Check if all blocking tasks are completed
   c. If yes: TaskUpdate(taskId="{id}", status="pending")  # unblocked, ready for assignment
```

### Step 4: File Conflict Check

Before assigning a newly ready task:

```
1. Read the task's Child Section 8.1 (file index)
2. Read TaskList to find all in_progress tasks
3. For each in_progress task, read its Child Section 8.1
4. If file overlap detected: skip assignment, leave task as pending
5. If no overlap: proceed to assignment
```

**Conflict rule**: Exact file path match = conflict. Same directory, different files = no conflict.

### Step 5: Assign Ready Tasks

Find all pending (unblocked, no file conflict) tasks and assign to idle coders:

```
1. TaskList → filter status="pending" and owner is empty
2. For each ready task:
   TaskUpdate(
     taskId="{task-id}",
     owner="coder-{N}",
     status="in_progress"
   )
   SendMessage(
     to="coder-{N}",
     summary="New task {task-id}",
     message="Task assigned: {task-id}\nParent: {parent-path}\nChild: {child-path}\nRead docs and implement. Mark completed via TaskUpdate when done."
   )
```

**Assignment priority**: Tasks with fewer blockers first. Equal blocker count → earlier task ID first.

### Step 6: Evaluator Dispatch After All Coders Done

When all currently assigned coder tasks are completed/evaluated:

```
1. Check if any tasks remain (status != "completed" and status != "failed")
2. If yes: unlock newly ready tasks, loop to Step 5
3. If no: proceed to completion
```

### Step 7: Report Progress

After each evaluation cycle, output progress:

```
📊 Progress: {completed}/{total} done | {inProgress} in progress | {pending} pending | {blocked} blocked
```

## Requirement Change Handling

Follow main SKILL.md Requirement Change Handling.

**Agent Teams specifics**:
- Changes update Hybrid Tree directly
- Teammates see latest docs on next task claim
- If change affects in_progress task:
  - Non-urgent: update docs, handle after current completion
  - Urgent: send message to teammate to abort, then reassign

## Iteration Control

- Each task has an iteration counter
- On `needs_fix`: counter +1
- Counter reaches limit (`-N` param): task marked `failed`
- Report to user, wait for instructions

## Completion

**Condition**: All tasks status = `completed` or `failed`

**Actions**:

1. Use `TaskList` to get final status of all tasks
2. Output final summary:

```
✅ Parallel workflow complete

📊 Final stats
   Total: {total}
   Passed: {success}
   Failed: {failure}

📁 Hybrid Tree updated
   Location: .hybrid/{feature-name}/
```

3. Clean up team (optional):
```
TeamDelete()
```
