# Hybrid Docs - Split Infographics / README Update

**File Name**: split-infographics-readme-hybrid.md
**Document Type**: Child (Branch-Specific)
**Parent**: split-infographics-hybrid.md

**Document Status**: Draft
**Update Date**: 2026-06-04
**Author**: Tree
**Version**: v1.0

---

> **Inheritance Declaration**
> Sections 0-6 are inherited from parent `split-infographics-hybrid.md`. This document only contains branch-specific content.

### Branch-Specific Overrides
- No overrides.

---

## 7. Branch Features & Acceptance Criteria (Branch-Specific AC)

### Feature: Update README.md and README.en.md with Split Image References

- **Description**: Replace the 3 single-image references in both README files with the 6 split image references. Use `<p align="center">` wrapping with brief descriptive text between image pairs.
- **Implementation Requirements**: Maintain existing README structure. Each image pair should have a brief context line between them. Alt text must be descriptive and accessible.

- **Acceptance Criteria (AC)**:

  **README.md (Chinese):**
  - [ ] AC-1: Architecture section: replaced single `01-architecture-zh.png` with `01a-architecture-zh.png` + `01b-architecture-zh.png`, each in `<p align="center">`
  - [ ] AC-2: Token optimization section: replaced single `03-token-optimization-zh.png` with `03a-token-optimization-zh.png` + `03b-token-optimization-zh.png`
  - [ ] AC-3: Capabilities section: replaced single `05-capabilities-zh.png` with `05a-capabilities-zh.png` + `05b-capabilities-zh.png`
  - [ ] AC-4: Each image pair has a brief `<sub>` or descriptive line between them providing context for the split

  **README.en.md (English):**
  - [ ] AC-5: Architecture section: replaced single `01-architecture.png` with `01a-architecture.png` + `01b-architecture.png`
  - [ ] AC-6: Token optimization section: replaced single `03-token-optimization.png` with `03a-token-optimization.png` + `03b-token-optimization.png`
  - [ ] AC-7: Capabilities section: replaced single `05-capabilities.png` with `05a-capabilities.png` + `05b-capabilities.png`
  - [ ] AC-8: Each image pair has a brief `<sub>` or descriptive line between them providing context for the split

## 8. Engineering & Knowledge Index Appendix (Branch Context)
### 8.1 Branch Private File Index
- **File Path**: `README.md` | **File Purpose**: Chinese README | **Association Reason**: Must update image references
- **File Path**: `README.en.md` | **File Purpose**: English README | **Association Reason**: Must update image references

### 8.2 Branch Incremental Index References
- README.md image references at lines: 84 (architecture), 113 (token-opt), 269 (capabilities)
- README.en.md image references at lines: 84 (architecture), 113 (token-opt), 269 (capabilities)

---

## 9. Evaluation Report (Branch-Specific)
### 9.1 Most Recent Evaluation Metadata
- **Evaluator/Agent**: evaluatorX
- **evaluation_mode**: full
### 9.2 Acceptance Criteria (AC) Compliance
*(To be filled by evaluatorX)*
### 9.3 Code Issue List + Fix Instructions
*(To be filled by evaluatorX)*
### 9.4 Comprehensive Evaluation Conclusion
[]

<!-- End of Child Hybrid Template -->
