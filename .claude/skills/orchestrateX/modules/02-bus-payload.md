# Module 02: xdel/xflow Handoff Contract

`xdo` does not use a Bus Payload. `xdel` and `xflow` use a concise handoff so coderX receives an explicit scope.

## coderX Task

- **Workflow Mode**: `xdel` or `xflow`
- **Objective**: [Child scope]
- **Parent Path**: [path]
- **Child Path**: [path]
- **Acceptance Source**: Child `Acceptance Criteria`
- **Allowed Scope**: [files or modules]
- **Required Skills**: `engineeringX`, `specX`
- **Verification**: [checks expected]
- **Output**: implementation summary with a Change Summary; `xdel` and `xflow` always attach a Note draft (new `implemented/` or in-place sync of the owning Note)

## evaluatorX Review (xflow only)

- **Child Path**: [path]
- **Changed Files**: [list]
- **Acceptance Source**: Child `Acceptance Criteria`
- **Review Focus**: [targeted risks]
- **Output**: test results, failed cases, causes, and blocker status; if `NEEDS_FIX`, include a compact Failure Record

Main Agent validates scope, forwards findings, and owns document updates.

## Repair Packet (local defect only)

Use this instead of the full implementation payload when the Main Agent classifies a finding as a local defect in the same Child:

- **Type**: `repair`
- **Child Path**: [path]
- **Failure Case**: [test/check and command]
- **Observed Result**: [actual] vs [expected]
- **Likely Cause**: [file/function or evidence]
- **Repair Scope**: [files/modules allowed]
- **Acceptance Criterion**: [Child AC]
- **Regression Risk**: [known risk]
- **Blocker**: [None or dependency]
- **Do Not**: [unrelated changes]

Repair dispatch is a new coderX invocation with minimal context, not a resumed agent instance. By default, Main Agent sends at most one automatic repair packet per Child.

## Integration Note (cross-Child issue)

When a failure depends on another Child, do not resend the complete prior context. Record only:

- **Previous Child**: [id/path]
- **Changed Contract**: [API, type, file, or behavior]
- **Relevant Files**: [list]
- **Observed Issue**: [failure symptom]
- **Required Action**: [what a later Child must verify or adapt]
- **Risk**: [compatibility or regression concern]

The Main Agent attaches the note to the affected later Child and decides whether a direct architecture fix is required.
