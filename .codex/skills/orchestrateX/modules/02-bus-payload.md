# Module 02: xdel/xflow Handoff Contract

`xdo` does not use a Bus Payload. `xdel` and `xflow` use a concise handoff so coderX receives an explicit scope.

## coderX Task

- **Workflow Mode**: `xdel` or `xflow`
- **Task URI**: [note:// URI, required for `xdel`/`xflow`]
- **Objective**: [task scope]
- **Goal Refs**: [requirement/initiative URIs]
- **Acceptance Refs**: [note URI + AC ids, fixed revision]
- **Allowed Scope**: [files or modules]
- **Applicable Decisions**: [decision URIs with fixed revisions]
- **Dependency Tasks**: [task URIs and their states]
- **Standard Version**: [harness-note version + digest]
- **Required Skills**: `engineeringX`, `specX`
- **Verification**: [checks expected]
- **Output**: implementation summary with a Change Summary; `xdel` and `xflow` always attach a Note draft (new `implemented/` or in-place sync of the owning Note)

## evaluatorX Review (xflow only)

- **Task URI**: [note:// URI at a fixed revision]
- **Changed Files**: [list]
- **Acceptance Source**: fixed Acceptance Refs from the task note
- **Review Focus**: [targeted risks]
- **Output**: test results, failed cases, causes, and blocker status; if `NEEDS_FIX`, include a compact Failure Record

Main Agent validates scope, forwards findings, and owns document updates.

## Repair Packet (local defect only)

Use this instead of the full implementation payload when the Main Agent classifies a finding as a local defect in the same task:

- **Type**: `repair`
- **Task URI**: [note:// URI]
- **Attempt**: [new attempt number on the same task]
- **Failure Case**: [test/check and command]
- **Observed Result**: [actual] vs [expected]
- **Likely Cause**: [file/function or evidence]
- **Repair Scope**: [files/modules allowed]
- **Acceptance Criterion**: [fixed task AC ref]
- **Regression Risk**: [known risk]
- **Blocker**: [None or dependency]
- **Do Not**: [unrelated changes]

Repair dispatch is a new coderX invocation with minimal context, not a resumed agent instance. By default, Main Agent sends at most one automatic repair packet per task.

## Integration Note (cross-task issue)

When a failure depends on another task, do not resend the complete prior context. Record only:

- **Previous Task**: [URI]
- **Changed Contract**: [API, type, file, or behavior]
- **Relevant Files**: [list]
- **Observed Issue**: [failure symptom]
- **Required Action**: [what a later task must verify or adapt]
- **Risk**: [compatibility or regression concern]

The Main Agent attaches the note to the affected later task and decides whether a direct architecture fix is required.
