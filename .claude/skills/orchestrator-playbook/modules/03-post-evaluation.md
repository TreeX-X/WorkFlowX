# 3. Post-Evaluation Document Update

> orchestratorX loads this module after evaluatorX outputs the Evaluation Result Payload to perform document updates.

## Timestamp Generation

**Mandatory**: All timestamps must be real, generated at execution time. Use Bash to get current UTC time:

```bash
date -u +%Y-%m-%dT%H:%M:%SZ
```

Store the result in a variable and reuse across all update steps. **Never use placeholder or hardcoded timestamps.**

## Execution Flow

After evaluatorX outputs the Evaluation Result Payload, orchestratorX reads and executes:

### Step 0: Generate Real Timestamp

Run `date -u +%Y-%m-%dT%H:%M:%SZ` to get current UTC ISO timestamp. Use this value for ALL timestamp fields in Steps 2-5.

### Step 1: Write to Child Section 9

Overwrite the complete Evaluation Result Payload content into Child Section 9:
- AC Status Table -> Section 9.2
- Issue List -> Section 9.3
- Fix Instructions -> Section 9.3 appended
- Conclusion -> Section 9.4
- evaluation_mode -> Section 9.1

### Step 2: Update Child Section 7 AC Checkboxes

Read Child Section 7 AC list. For each AC that passed (Status = Pass in Evaluation Result 9.2):
- Replace `- [ ] AC-N:` with `- [x] AC-N:`

This ensures the AC checklist reflects actual evaluation results.

### Step 3: Update Child Document Status

Read the evaluation conclusion from Step 1:
- If **PASS**: Update Child header from `**Document Status**: Draft` to `**Document Status**: Completed`
- If **Needs Fix**: Update Child header to `**Document Status**: In Progress`

### Step 4: Update Parent Section 7 Routing Table

Read Parent Section 7, locate the current Child's row, update:
- `Status` column: PASS / Needs Fix / In Progress
- `Last Eval` column: the real timestamp from Step 0
- `AC Count` column: update if AC count changed

### Step 5: Update Parent Section 9 Aggregation Table

Update the current Child's row in Parent Section 9:
- `Eval Result`: PASS / Needs Fix
- `P0 Count`: number of P0 issues in Issue List
- `P1 Count`: number of P1 issues in Issue List
- `Last Eval`: the real timestamp from Step 0

Recalculate Section 9.1 Aggregated Metrics:
- Total Children / Passed / In Progress / Not Started

### Step 6: Update Parent Document Status

After updating Section 9.1, check aggregated metrics:
- If **all Children are PASS**: Update Parent header from `**Document Status**: Draft` to `**Document Status**: Completed`
- If **any Children are In Progress or Needs Fix**: Update Parent header to `**Document Status**: In Progress`
- If **no Children started**: Leave as `**Document Status**: Draft`

### Step 7: Scope of Non-Modification

**Never modify** Parent Sections 0-6, 8.1, 8.2, 8.3. These areas are managed by other processes (planning, requirement change).

---

## Iteration Decision

After reading the Evaluation Result Payload, decide next steps based on the `Evaluation Result` field:

| Result | Condition | Action |
|--------|-----------|--------|
| **PASS** | — | Move to next Child |
| **Needs Fix** | Iteration limit not reached | Extract Fix Instructions -> assemble fix prompt -> dispatch coderX |
| **Needs Fix** | Iteration limit reached | Stop iteration, report to human |
| **Blocking Dependencies** | Present | Reorder remaining Children queue (see below) |

### Fix Instructions Assembly

Extract from the Evaluation Result Payload's `Fix Instructions` section, assemble into a coderX fix prompt:

```
The following P0/P1 issues need to be fixed:
1. [file:line] — [fix action]
2. [file:line] — [fix action]

Please load the codex-spec-implementation skill and fix the above issues. After fixing, output the Change Summary Payload.
```

---

## Dependency Blocking Reorder

When the Evaluation Result contains Blocking Dependencies:

1. Read the Blocking Dependencies list
2. Move the blocked Child to the end of the execution queue
3. Execute the depended-on Child first
4. After the depended-on Child passes, return to execute the blocked Child
5. If circular dependency cannot be resolved, report to human
