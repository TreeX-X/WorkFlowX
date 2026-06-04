# Hybrid Docs - Split Infographics / HTML Creation + Screenshot

**File Name**: split-infographics-html-hybrid.md
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

### Feature: Create 12 Split HTML Files + Update Screenshot Script

- **Description**: Split 3 existing long infographic HTML files into 6 shorter ones (each with Chinese and English versions), then update the screenshot script to capture all new files and delete old PNGs.
- **Implementation Requirements**: Maintain existing design language (terracotta #C04A1A, serif titles, sans-serif body, 720px width). Each split file must have independent header. Target 400-550px height per image.

- **Acceptance Criteria (AC)**:

  **01-architecture split (orchestratorX + agents / data layer + parallel):**
  - [ ] AC-1: Created `01a-architecture-zh.html` with header "系统架构 · 编排层" containing orchestratorX box + connector + 2x2 agent grid (promptMasterX, coderX, evaluatorX, abstracterX)
  - [ ] AC-2: Created `01b-architecture-zh.html` with header "系统架构 · 数据与通信" containing data layer (Hybrid Tree + MCP Memory Graph) + payload badges + parallel mode section
  - [ ] AC-3: Created `01a-architecture.html` (English version of 01a) with header "Architecture · Orchestration Layer"
  - [ ] AC-4: Created `01b-architecture.html` (English version of 01b) with header "Architecture · Data & Communication"

  **03-token-optimization split (L1 caching / L2+L3):**
  - [ ] AC-5: Created `03a-token-optimization-zh.html` with header "Token 优化 · L1 Section-Level Caching" containing L1 layer with zone visualization
  - [ ] AC-6: Created `03b-token-optimization-zh.html` with header "Token 优化 · 干叶分离与记忆图谱" containing L2 trunk-leaf separation + L3 memory graph snapshot
  - [ ] AC-7: Created `03a-token-optimization.html` (English) with header "Token Optimization · L1 Section-Level Caching"
  - [ ] AC-8: Created `03b-token-optimization.html` (English) with header "Token Optimization · Trunk-Leaf & Memory Graph"

  **05-capabilities split (first 3 cards / last 3 cards + quote):**
  - [ ] AC-9: Created `05a-capabilities-zh.html` with header "独有能力 · 数据与质量" containing HT (Hybrid Tree), AC (Cross-Validation), PM (Prompt Engine) cards
  - [ ] AC-10: Created `05b-capabilities-zh.html` with header "独有能力 · 安全与发现" containing CB (Cross-Branch), SD (Socratic), RX (Code Aesthetics) cards + insight quote
  - [ ] AC-11: Created `05a-capabilities.html` (English) with header "Unique Capabilities · Data & Quality"
  - [ ] AC-12: Created `05b-capabilities.html` (English) with header "Unique Capabilities · Safety & Discovery"

  **Screenshot script + cleanup:**
  - [ ] AC-13: Updated `scripts/screenshot.cjs` pages array to reference all 12 new HTML files (01a/01b, 03a/03b, 05a/05b for both zh and en)
  - [ ] AC-14: Screenshot script deletes old PNGs (01-architecture-zh.png, 01-architecture.png, 03-token-optimization-zh.png, 03-token-optimization.png, 05-capabilities-zh.png, 05-capabilities.png) before capturing new ones, OR old PNGs are deleted manually after new ones are confirmed

## 8. Engineering & Knowledge Index Appendix (Branch Context)
### 8.1 Branch Private File Index
- **File Path**: `docs/design/01a-architecture-zh.html` | **File Purpose**: Architecture orchestration layer (zh) | **Association Reason**: Split from 01-architecture-zh.html
- **File Path**: `docs/design/01b-architecture-zh.html` | **File Purpose**: Architecture data layer (zh) | **Association Reason**: Split from 01-architecture-zh.html
- **File Path**: `docs/design/01a-architecture.html` | **File Purpose**: Architecture orchestration layer (en) | **Association Reason**: Split from 01-architecture.html
- **File Path**: `docs/design/01b-architecture.html` | **File Purpose**: Architecture data layer (en) | **Association Reason**: Split from 01-architecture.html
- **File Path**: `docs/design/03a-token-optimization-zh.html` | **File Purpose**: L1 caching detail (zh) | **Association Reason**: Split from 03-token-optimization-zh.html
- **File Path**: `docs/design/03b-token-optimization-zh.html` | **File Purpose**: L2+L3 optimization (zh) | **Association Reason**: Split from 03-token-optimization-zh.html
- **File Path**: `docs/design/03a-token-optimization.html` | **File Purpose**: L1 caching detail (en) | **Association Reason**: Split from 03-token-optimization.html
- **File Path**: `docs/design/03b-token-optimization.html` | **File Purpose**: L2+L3 optimization (en) | **Association Reason**: Split from 03-token-optimization.html
- **File Path**: `docs/design/05a-capabilities-zh.html` | **File Purpose**: First 3 capability cards (zh) | **Association Reason**: Split from 05-capabilities-zh.html
- **File Path**: `docs/design/05b-capabilities-zh.html` | **File Purpose**: Last 3 cards + quote (zh) | **Association Reason**: Split from 05-capabilities-zh.html
- **File Path**: `docs/design/05a-capabilities.html` | **File Purpose**: First 3 capability cards (en) | **Association Reason**: Split from 05-capabilities.html
- **File Path**: `docs/design/05b-capabilities.html` | **File Purpose**: Last 3 cards + quote (en) | **Association Reason**: Split from 05-capabilities.html
- **File Path**: `scripts/screenshot.cjs` | **File Purpose**: Playwright screenshot automation | **Association Reason**: Must update pages array

### 8.2 Branch Incremental Index References
- Source HTML files use identical CSS structure, only content/text differs between zh/en
- Screenshot script uses Playwright + Edge (msedge channel), captures `.container` element

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
