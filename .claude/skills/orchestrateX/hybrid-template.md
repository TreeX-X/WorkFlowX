# Hybrid Tree Templates

Use a Parent and one or more Children for `xdel` and `xflow`. `xdo` may use these documents only when the task calls for them.

## Parent

# [Feature]

**Type**: Parent
**Status**: Draft | Active | Complete

## 1. Goal and Scope
- **Goal**: [what is being changed]
- **In scope**: [included work]
- **Out of scope**: [excluded work]

## 2. Constraints and Done Criteria
- [technical or product constraints]
- [verifiable completion criteria]

## 3. Child Registry
| # | Child | Scope | Depends On | Status |
|---|---|---|---|---|
| 1 | [child-file] | [scope] | [child or N/A] | Draft |

## 4. File Index
- `[path]` — [purpose] — [owner/shared]

## 5. Knowledge Notes
- [short project facts needed by Children, or N/A]
- [`.agents/notes/...` relative link + one-line summary per governing decision, never inlined prose]

## 6. Change Notes
- [decisions and important updates; lasting trade-offs live in Notes, linked here, not copied]

## 7. Completion Summary
- [overall status and verification summary]

## Child

# [Feature] / [Child]

**Type**: Child
**Parent**: [parent-file]
**Status**: Draft | Active | Complete

## 1. Scope
- **Description**: [branch scope]
- **Files**: [allowed files]
- **Dependencies**: [required prior Children or N/A]

## 2. Acceptance Criteria
- [ ] [criterion]
- [ ] [criterion]

## 3. Implementation Notes
- [constraints or decisions specific to this Child; lasting ones link `.agents/notes/...`, derivation history belongs in the Proposal Pool]

## 4. Verification
- [checks run and results]
- [unresolved concerns, or None]

## 5. Change Summary
- [what changed]
