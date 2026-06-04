# Hybrid Docs - xstatus-density / Visual Polish

**File Name**: xstatus-density-child-2-hybrid.md
**Document Type**: Child (Branch-Specific)
**Parent**: xstatus-density-parent-hybrid.md

**Document Status**: Draft
**Update Date**: 2026-06-03
**Author**: [Tree]
**Version**: v1.0

---

> **Inheritance Declaration**
> Sections 0-6 are inherited from parent `xstatus-density-parent-hybrid.md`.

### Branch-Specific Overrides
- No overrides.

---

> **Incremental Section**

## 7. Branch Features & Acceptance Criteria (Branch-Specific AC)

### Feature: Empty State Handling + Mode Badge Semantic Optimization
- **Description**: Replace empty-string section rendering with minimal placeholder blocks that maintain layout rhythm and provide usage hints. Compact mode badges to semantic symbols (A, A-parellel, B, C) with tooltip explanations.
- **Implementation Requirements**: Changes primarily in HTML template CSS and module 07 rendering logic. Must not affect sections that DO have active workflows.
- **Acceptance Criteria (AC)**:
  - [ ] AC-1: HTML template adds CSS classes `.empty-state`, `.empty` (enhanced), `.hint` for placeholder styling
  - [ ] AC-2: Module 07 empty section rule changed: instead of empty string, render `<section class="workflow empty-state">` with mode-specific hint text and command example
  - [ ] AC-3: Mode A empty shows hint "Use /xwhole [-N <num>] [-box <name>] <requirement> to start"
  - [ ] AC-4: Mode badge text changed: "Mode A" to "A", "Mode A . parallel" to "A-parellel", "Mode B" to "B", "Mode C" to "C"; each badge gets `title` attribute with full explanation
  - [ ] AC-5: `.mode-badge` CSS adjusted for compact width (padding remains sufficient for single/double character labels)

## 8. Engineering & Knowledge Index Appendix (Branch Context)
### 8.1 Branch Private File Index
- **File Path**: `.claude/skills/orchestrator-playbook/modules/07-status-report.md` | **File Purpose**: Rendering logic for empty states | **Association Reason**: Modify empty section rule
- **File Path**: `.claude/skills/orchestrator-playbook/templates/status-report.html` | **File Purpose**: CSS for empty-state and mode-badge | **Association Reason**: Add new CSS classes

### 8.2 Branch Incremental Index References
- Optimization 4 spec: `xstatus_optimization_suggestions.md` Section 2.4
- Optimization 5 spec: `xstatus_optimization_suggestions.md` Section 2.5

---

> **Dynamic Section**

## 9. Evaluation Report (Branch-Specific)
### 9.1 Most Recent Evaluation Metadata
- **Evaluator/Agent**: N/A
- **evaluation_mode**: N/A
### 9.2 Acceptance Criteria (AC) Compliance
*(Not yet evaluated)*
### 9.3 Code Issue List + Fix Instructions
*(Not yet evaluated)*
### 9.4 Comprehensive Evaluation Conclusion
*(Not yet evaluated)*

<!-- End of Child 2 -->
