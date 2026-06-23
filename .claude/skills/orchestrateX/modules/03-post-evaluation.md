# 3. Post-Evaluation Document Update (Optimized: Incremental Updates)

> Main Agent loads this module after evaluatorX outputs the Evaluation Result Payload to perform document updates.

## Timestamp Generation

**Mandatory**: All timestamps must be real, generated at execution time. Use Bash to get current UTC time:

```bash
date -u +%Y-%m-%dT%H:%M:%SZ
```

Store the result in a variable and reuse across all update steps. **Never use placeholder or hardcoded timestamps.**

## Execution Flow (Incremental)

After evaluatorX outputs the Evaluation Result Payload, Main Agent reads and executes:

### Step 0: Generate Real Timestamp

Run `date -u +%Y-%m-%dT%H:%M:%SZ` to get current UTC ISO timestamp. Use this value for ALL timestamp fields in Steps 2-5.

### Step 1: Write to Child Section 9 (Incremental)

**Only update changed subsections** in Child Section 9:
- AC Status Table → Section 9.2 (only if AC status changed)
- Issue List → Section 9.3 (append new issues, don't overwrite existing)
- Fix Instructions → Section 9.3 appended
- Conclusion → Section 9.4 (always update)
- evaluation_mode → Section 9.1 (always update)

**Optimization**: Use Edit tool for targeted updates instead of full file rewrite.

### Step 2: Update Child Section 7 AC Checkboxes

Read Child Section 7 AC list. For each AC that passed (Status = Pass in Evaluation Result 9.2):
- Replace `- [ ] AC-N:` with `- [x] AC-N:`

This ensures the AC checklist reflects actual evaluation results.

### Step 3: Update Child Document Status

Read the evaluation conclusion from Step 1:
- If **PASS**: Update Child header from `**Document Status**: Draft` to `**Document Status**: Completed`
- If **Needs Fix**: Update Child header to `**Document Status**: In Progress`

### Step 4: Update Parent Section 7 Routing Table (Incremental)

**Only update current Child's row** in Parent Section 7:
- Locate row by Child identifier
- Update only changed columns:
  - `Status` column: PASS / Needs Fix / In Progress
  - `Last Eval` column: the real timestamp from Step 0
  - `AC Count` column: update only if AC count changed

**Optimization**: Use Edit tool to replace only the target row, not the entire table.

### Step 5: Update Parent Section 9 Aggregation Table (Incremental)

**Only update current Child's row** in Parent Section 9:
- `Eval Result`: PASS / Needs Fix
- `P0 Count`: number of P0 issues in Issue List
- `P1 Count`: number of P1 issues in Issue List
- `Last Eval`: the real timestamp from Step 0

**Recalculate aggregated metrics** (Section 9.1) only after all Children processed or on explicit request.

### Step 6: Update Parent Document Status

After updating Section 9.1, check aggregated metrics:
- If **all Children are PASS**: Update Parent header from `**Document Status**: Draft` to `**Document Status**: Completed`
- If **any Children are In Progress or Needs Fix**: Update Parent header to `**Document Status**: In Progress`
- If **no Children started**: Leave as `**Document Status**: Draft`

### Step 7: Scope of Non-Modification

**Never modify** Parent Sections 0-6, 8.1, 8.2, 8.3. These areas are managed by other processes (planning, requirement change).

---

## Iteration Decision (Optimized: AC-Level Granular Tracking)

After reading the Evaluation Result Payload, decide next steps based on the `Evaluation Result` field:

| Result | Condition | Action |
|--------|-----------|--------|
| **PASS** | All ACs pass | Mark complete, enqueue dependents, move to next in ready queue |
| **Partial Pass** | Some ACs pass, P0 issues exist | Increment counter, fix P0 only, re-enqueue |
| **Partial Pass** | Some ACs pass, no P0 | Increment counter, fix P1, re-enqueue |
| **Needs Fix** | child_iterations[current].remaining > 0 | Increment counter, extract Fix Instructions, re-enqueue |
| **Needs Fix** | child_iterations[current].remaining <= 0 | Stop iteration, report to human |
| **Blocking Dependencies** | Present | Update in_degree map, enqueue if resolved |

### AC-Level Tracking (Optimized)

Instead of treating Child as monolithic, track AC status individually:

```javascript
// Per-AC status tracking
ac_status = {
  "child-1": {
    "AC-1": { status: "pass", eval_round: 2 },
    "AC-2": { status: "partial", eval_round: 2, issues: ["P0: missing validation"] },
    "AC-3": { status: "fail", eval_round: 1 }
  }
}

// Decision logic with AC granularity
function shouldIterate(child_id) {
  const acs = ac_status[child_id];
  const hasP0 = Object.values(acs).some(ac => 
    ac.issues?.some(i => i.startsWith('P0'))
  );
  const allPass = Object.values(acs).every(ac => ac.status === 'pass');
  
  if (allPass) return 'PASS';
  if (hasP0) return 'FIX_P0_ONLY'; // Focus iteration
  return 'FIX_ALL';
}
```

**Benefits**:
- More precise iteration targeting (fix only failing ACs)
- Better progress reporting (AC completion percentage)
- Early termination when all ACs pass (even if Child had issues in past)

### Fix Instructions Assembly (Optimized: AC-Focused)

Extract from the Evaluation Result Payload's `Fix Instructions` section, assemble into a coderX fix prompt:

```
AC Status Summary:
- ✓ AC-1: PASS (round 2)
- ⚠ AC-2: Partial Pass - P0: [issue description]
- ✗ AC-3: Fail - P1: [issue description]

Focus on AC-2 P0 issue first:
1. [file:line] — [fix action] (Priority: P0)

After P0 fix, address AC-3:
2. [file:line] — [fix action] (Priority: P1)

Please load the specX skill and fix the above issues. After fixing, output the Change Summary Payload.
```

---

## Dependency Blocking Reorder (Optimized: Graph-Based)

When the Evaluation Result contains Blocking Dependencies:

1. Read the Blocking Dependencies list
2. Update in_degree map for blocked Child
3. If in_degree becomes 0 after dependency resolution → enqueue to ready_queue
4. If circular dependency detected → report to human, terminate
5. **No manual queue reordering needed** — graph handles automatically
