---
description: Use this instruction for all coding tasks to follow the user's X_x coding standards across projects, especially C++/Qt feature work, bug fixes, refactors, tests, and documentation updates.
---

# X_x General Coding Standards (Cross-Project Universal Version)

## 1. Scope
- Applies to all programming tasks: new features, bug fixes, refactoring, testing, documentation, and code reviews.
- This standard can be reused across projects; when a repository has its own existing standards, prioritize and follow the repository standards for consistency.
- For C++/Qt projects, follow the C++/Qt supplementary provisions of this standard.

## 2. Core Principles
- Prefer minimally invasive changes; only modify code directly related to the current requirement.
- By default, keep existing behavior and public interfaces unchanged unless the requirement explicitly calls for behavioral changes.
- Prefer reusing existing modules and utility functions; avoid duplicate implementations.
- Avoid introducing new dependency libraries; if necessary, provide justification, impact scope, and alternative approaches first.

## 3. Naming Conventions
- Variables and functions use lower camelCase, e.g., `userModel`, `initTableShow`.
- Classes, structs, and enum type names use PascalCase, e.g., `ResourceMaintainer`.
- Class members prefer the `x_` prefix (e.g., `x_log`, `x_cleaned`).
- Global objects use the `g_` prefix (e.g., `g_busi`).
- Qt signals use `sigXxx` naming (e.g., `sigShowPlanPath`).
- Macros and compile switches use ALL_CAPS with underscores (e.g., `TEST_MODE`).

## 4. Comment Conventions
- Use the comment format: `/*-- comment content --*/`.
- Only write comments where necessary: explain intent, boundary conditions, constraints, or non-obvious implementations.
- Avoid useless comments that merely repeat the literal meaning of the code.
- Section descriptions may use the `/*===== module description =====*/` style, but keep them concise.

## 5. Code Style and Structure
- Maintain indentation, braces, and blank line styles consistent with the original file; avoid unrelated formatting changes.
- Group include/import statements by "system/framework -> project module"; add brief grouping comments when needed.
- Favor defensive programming: perform null and boundary checks before executing business logic.
- Favor early returns (guard clauses) to reduce nesting levels.
- Keep each function focused on a single responsibility; split complex logic into reusable smaller functions.

## 6. C++/Qt Supplementary Conventions
- Pointer/object lifetimes must be explicit: prefer RAII, Qt parent-child relationships, or smart pointer management.
- Logic involving UI must respect thread boundaries; avoid directly operating QWidget from non-UI threads.
- When connecting signals and slots, prefer the type-safe new-style connect syntax.
- When modifying UI interactions, ensure signal blocking and state synchronization logic remain intact (e.g., paired handling of blockSignals).

## 7. Change Boundaries and Risk Control
- Do not modify third-party code directories (e.g., `3rd/`) or auto-generated files unless necessary.
- Do not fix issues unrelated to the current requirement along the way; potential issues can be noted in the results.
- Understand the context before making changes; after changes, perform at least one compilation or critical path verification.

## 8. Task Output Requirements (Default)
- Every programming task must provide a result summary, including at least:
  - What was modified (files and key points).
  - Why it was changed (design or fix rationale).
  - Validation results (checks/tests performed, or reasons if not performed).

## 9. Result Reporting Template
- Modified: List modified files and core changes.
- Result: Describe functional outcomes or bug fix results.
- Validation: Describe compilation/test/manual verification status.
