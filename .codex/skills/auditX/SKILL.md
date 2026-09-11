---
name: auditX
description: Test-driven implementation review for evaluatorX in xflow.
---

# auditX

Use only when `xflow` requests an independent evaluatorX review.

## Review

1. Read the review task, Child acceptance criteria, changed files, and relevant diff.
2. Convert each applicable acceptance criterion into a focused executable test or check.
3. Run the smallest useful test set.
4. Record passed tests, failed cases, failure causes, and blocking dependencies.
5. Inspect code manually only to explain a failed test or a named integration risk; do not perform a full static review by default.
6. Match verification to change size: for small reversible changes, do not write tests that merely restate the implementation. Run the tests that fit the change; once they pass, expand or re-run scope only on new changes, failures, or unresolved issues.

If the project has no runnable test path, report `UNEVALUABLE` with the reason and the checks attempted. Never claim a test passed unless it was run. The Main Agent then decides: narrow the scope, add the missing checks, or accept with an explicit recorded risk.

## Result Contract

Return a concise Evaluation Result:

- **Status**: PASS | NEEDS_FIX | UNEVALUABLE
- **Tests Run**: [commands or checks]
- **Passed**: [cases]
- **Failed**: [case, observed result, likely cause, repair scope, regression risk]
- **Blockers**: [dependency or environment issue, or None]

For `NEEDS_FIX`, keep each failure compact enough for the Main Agent to turn directly into a Repair Packet. Distinguish local defects from cross-Child integration findings when evidence supports it.

evaluatorX is read-only. The Main Agent owns document updates and any follow-up implementation.
