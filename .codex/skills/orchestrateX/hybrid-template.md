# Hybrid Docs Templates

> This file contains two templates for the Hybrid Tree structure:
> - **Parent Hybrid Template**: Routing center + shared specification + knowledge graph for a feature
> - **Child Hybrid Template**: Branch-specific content for a sub-module (no knowledge graph)
>
> **All planning outputs must use the Hybrid Tree structure** (Parent + at least one Child).

---

# PARENT HYBRID TEMPLATE

# Hybrid Docs - [Feature Module]

**File Name**: [Feature Module]-hybrid.md
**Document Type**: Parent (Routing Center)

**Document Status**: Draft
**Update Date**: [Current Date]
**Author**: [Tree]
**Version**: v1.0

---

> **Static Context (Static Section)**
> The following configuration rarely changes after initial establishment. Placing it at the top of the file maximizes the utilization of the LLM underlying Prompt Caching (Token caching) mechanism, saving substantial re-read costs.

## 0. Runtime Environment Status (System)
> Auto-managed by Main Agent. Do not manually edit.

- **MCP Status**: [Active | Degraded | Unknown]
- **MCP Servers**: [server-memory, server-sequential-thinking]
- **Last Checked**: [ISO timestamp]
- **Degraded Since**: [ISO timestamp or N/A]
- **Fallback Impact**: [None | Knowledge graph retrieval skipped; relying on 8.1/8.3 file index only]

## 1. Project Overview (Overview)
- **Project Goal**: [Fill in the goal determined through discussion]
- **Core Value**: [e.g., improve efficiency, reduce costs, provide a unique experience]

## 2. Target Audience (Target Audience)
- **Persona 1**: [e.g., Tech Blogger - needs minimal configuration, one-click generation.]
- **Persona 2**: [If applicable, fill in other user personas]

## 3. Boundaries & Scope (Scope & Non-Goals)
### 3.1 Clearly In-Scope
- Develop according to the project's data structures and mechanisms; ensure code is correctly added to the project
- Generated content conforms to mechanism logic
- [Fill in other core scopes confirmed during discussion]

### 3.2 Clearly Out-of-Scope / Non-Goals
- **Non-Goal**: Avoid excessive intrusion into existing project files unless necessary
- [Fill in items confirmed as out-of-scope during discussion]

## 4. Non-Functional Requirements (Non-Functional Requirements)
- **Comments**: Generated code needs Chinese comments added in reasonable places, formatted as "/*-- comment content --*/"
- **Code Quality**: Generated code must be concise and highly readable
- **Other Requirements**: [e.g., performance, compatibility requirements]

## 5. Success Metrics (Success Metrics)
- Evaluated by internal personnel on whether functionality is usable
- [Other success metrics confirmed during discussion]

## 6. Definition of Done (DoD)
- [ ] All code must pass Linter static checks with no warnings or errors.
- [ ] No `TODO` or `FIXME` remains in core logic code.
- [ ] If `mcp/server-memory` is enabled, corresponding session memory has been serialized and written back to `8.2 Memory Pointers`.
  - Memory observations have been reconciled against committed file truth.
  - Stale, contradictory, or diagnostic-only entities/relations have been updated or removed.
- [ ] The `9. Evaluation Report` section in each Child has been reserved for the evaluation agent to overwrite.
- [ ] [Other engineering or business-level completion criteria]

---

> **Incremental Section (Slow-Changing Incremental Section)**
> Contains core feature acceptance criteria and engineering index. May be slightly modified during iterative development.

## 7. Feature Map & Child Registry (Routing Table)
> **Purpose**: This section serves as the routing center for the tree structure. Each row maps to a Child hybrid document.

| # | Child File | Scope | AC Count | Status | Last Eval |
|---|-----------|-------|----------|--------|-----------|
| 1 | [feature]-[subA]-hybrid.md | [Sub-module A scope summary] | [n] | [Draft/In Progress/PASS/Needs Fix/Needs Re-evaluation] | [ISO timestamp or N/A] |
| 2 | [feature]-[subB]-hybrid.md | [Sub-module B scope summary] | [n] | [Draft/In Progress/PASS/Needs Fix/Needs Re-evaluation] | [ISO timestamp or N/A] |

> **Maintenance Rules**:
> - When planner creates a new Child, add a row here.
> - When evaluatorX completes evaluation of a Child, update Status and Last Eval.

### 7.1 Feature Map History (Archived Children)
> Completed Children archived here when development is finished. Rows moved here from 7 main table.

| # | Child File | Scope | AC Count | Final Status | Archived At |
|---|-----------|-------|----------|-------------|-------------|
| *(archived rows appear here)* | | | | | |

## 8. Engineering & Knowledge Index Appendix (Context Appendix)
### 8.1 Global Shared File Index
> **Scope**: Only files shared across multiple Children or project-level infrastructure files.
- **File Path**: [] | **File Purpose**: [] | **Shared By**: [Child names or "global"]

### 8.2 Memory Pointers (Root-Level Knowledge Graph)
> **Scope**: Project-level knowledge graph. This is the **sole location** for the knowledge graph — Child documents do not contain their own knowledge graph.
> **Note**: Markdown only retains the "trunk" (high-level skeleton/outline) of knowledge nodes. Leaf nodes are stored in `mcp/server-memory`. On each access, use the exact entity names from this trunk in `mcp__server-memory__open_nodes`; do not rely on broad `search_nodes` patterns unless an exact name is missing.
>
> Diagnostic, test, sandbox or throw-away entities should be prefixed with `TEST_` or `DIAG_` and should be deleted once validation is complete to avoid polluting the long-term project knowledge graph.
- **Root Nodes**: [Project-level entity names/IDs]
- **Root Relations**: [Top-level architectural relationships]

### 8.3 Cross-Branch Dependencies
> **Scope**: Dependencies between Children or shared resource constraints.
- [Child A] depends on [Child B] for [reason]
- [Shared resource] used by [Child list]

---

> **Dynamic Section (High-Frequency Volatile Section)**
> Overwritten by sub-agents every iteration round. Placed at the very end of the file to prevent its frequent changes from invalidating the cached Tokens of the large static text above.

## 9. Evaluation Summary (Aggregated)
> **Purpose**: Lightweight aggregation of Child evaluation results. Detailed reports live in each Child's Section 9.

| # | Child File | Eval Result | P0 Count | P1 Count | Last Eval |
|---|-----------|-------------|----------|----------|-----------|
| 1 | [feature]-[subA]-hybrid.md | [PASS/Needs Fix] | [n] | [n] | [ISO timestamp] |

### 9.1 Aggregated Metrics
- **Total Children**: [n]
- **Passed**: [n]
- **In Progress**: [n]
- **Not Started**: [n]

<!-- End of Parent Hybrid Template -->

---

---

# CHILD HYBRID TEMPLATE

# Hybrid Docs - [Feature Module] / [Sub-Module]

**File Name**: [Feature]-[sub]-hybrid.md
**Document Type**: Child (Branch-Specific)
**Parent**: [Feature]-hybrid.md

**Document Status**: Draft
**Update Date**: [Current Date]
**Author**: [Tree]
**Version**: v1.0

---

> **Inheritance Declaration**
> Sections 0-6 are inherited from parent `[Feature]-hybrid.md`. This document only contains branch-specific overrides and additions.
> **Knowledge Graph**: The knowledge graph lives exclusively in the Parent document (Section 8.2). This Child document does not contain its own knowledge graph. When needing cross-branch context, read the Parent's Section 8.2.
> If no overrides are listed for a section, the parent's definition applies in full.

### Branch-Specific Overrides
> List any overrides to Sections 0-6 below. If none, write "No overrides."
- **4.x Branch Non-Functional Requirements**: [Any branch-specific NFR, or "None"]
- **5.x Branch Success Metrics**: [Any branch-specific metrics, or "None"]
- **6.x Branch DoD Additions**: [Any branch-specific DoD items, or "None"]

---

> **Incremental Section (Slow-Changing Incremental Section)**
> Contains branch-specific acceptance criteria and engineering index.

## 7. Branch Features & Acceptance Criteria (Branch-Specific AC)
> **Scope**: Detailed AC for this sub-module only. Parent Section 7 routing table references this document.

### Feature: [Sub-Module Name]
- **Description**: [Detailed business logic description for this branch]
- **Implementation Requirements**: [Technical requirements, module boundary constraints]
- **Acceptance Criteria (AC)**:
  - [ ] [Criterion 1]
  - [ ] [Criterion 2]
  - [ ] [Criterion N]

## 8. Engineering & Knowledge Index Appendix (Branch Context)
### 8.1 Branch Private File Index
> **Scope**: Files private to this branch only. Shared files are in Parent 8.1.
- **File Path**: [] | **File Purpose**: [] | **Association Reason**: []

### 8.2 Branch Incremental Index References
- [Incremental differences specific to this branch]

---

> **Dynamic Section (High-Frequency Volatile Section)**
> Overwritten by sub-agents every iteration round.

## 9. Evaluation Report (Branch-Specific)
### 9.1 Most Recent Evaluation Metadata
- **Evaluator/Agent**: [evaluatorX]
- **evaluation_mode**: [full | partial | fix | final | prompt-based]
### 9.2 Acceptance Criteria (AC) Compliance
*(Table)*
### 9.3 Code Issue List + Fix Instructions
*(Table)*
### 9.4 Comprehensive Evaluation Conclusion
[]

<!-- End of Child Hybrid Template -->
