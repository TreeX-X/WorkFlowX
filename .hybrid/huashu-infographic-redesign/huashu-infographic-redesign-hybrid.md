# Hybrid Tree: huashu-infographic-redesign

**Document Type**: Parent (Routing Center)
**Created**: 2026-06-04
**Status**: In Progress

---

## 0. MCP Status

- MCP server-memory: Not used (no cross-session knowledge needed)
- MCP context7: Not used

---

## 1. Project Overview

Redesign all 12 README infographic HTML files (6 Chinese + 6 English) using the huashu-design visual language extracted from `docs/design/06-workflow-animation.html`. The goal is to achieve visual consistency between the animated workflow demo and the static infographics.

**Key Constraint**: Directly reuse CSS component patterns from the animation HTML -- do not design from scratch.

---

## 2. Boundaries

**In Scope**:
- 12 HTML files in `docs/design/` (6 zh + 6 en)
- CSS adaptation from animation (1200x800) to infographic (720px) width
- Screenshot regeneration via existing `scripts/screenshot.cjs`
- README image references (already correct -- no changes needed since file names unchanged)

**Out of Scope**:
- Animation logic (opacity, keyframes) -- removed for static infographics
- New component creation -- only adapt existing animation components
- README content changes -- only image references (already correct)

---

## 3. Technical Constraints

- Width: 720px native
- Height: 400-600px per infographic
- Minimum font size: 14px
- Self-contained HTML (no external CSS/JS)
- Each file has independent header (phase-label + section-title)
- Pure HTML+CSS for screenshot capture

---

## 4. Non-Functional Requirements

- Visual consistency with 06-workflow-animation.html
- Each infographic independently readable
- Screenshot-ready (no animations, all elements visible)
- Responsive to 720px container width

---

## 5. Definition of Done

- All 12 HTML files use huashu-design visual language (phase-label, section-title, doc-view, editor, ac-table, badge components)
- All 12 PNG screenshots regenerated in `docs/design/images/`
- README.md and README.en.md image references verified correct

---

## 6. Scope

| Item | Description |
|------|-------------|
| CSS Foundation | Extract and adapt animation CSS for 720px static infographics |
| 01a-architecture | Orchestration layer (orchestratorX + 4 sub-agents) |
| 01b-architecture | Data & Communication (Hybrid Tree + MCP + Payload + Parallel) |
| 03a-token-optimization | L1 Section-Level Caching (zones visualization) |
| 03b-token-optimization | L2 Trunk-Leaf + L3 Memory Graph |
| 05a-capabilities | Data & Quality (HT tracking, AC validation, Prompt engine) |
| 05b-capabilities | Safety & Discovery (cross-branch, Socratic, aesthetics + quote) |

---

## 7. Routing Table

| # | Child File | Scope | AC Count | Status | Last Eval |
|---|-----------|-------|----------|--------|-----------|
| 1 | `child-css-foundation-hybrid.md` | CSS component extraction + adaptation from animation to 720px static | 5 | Pending | — |
| 2 | `child-html-zh-hybrid.md` | 6 Chinese HTML files redesign with huashu components | 6 | Pending | — |
| 3 | `child-html-en-hybrid.md` | 6 English HTML files redesign with huashu components | 6 | Pending | — |
| 4 | `child-screenshot-readme-hybrid.md` | Screenshot generation + README verification | 3 | Pending | — |

---

## 8.1 Shared File Index

| Path | Purpose | Association |
|------|---------|-------------|
| `docs/design/06-workflow-animation.html` | Visual language reference (CSS source) | All Children |
| `scripts/screenshot.cjs` | Screenshot generation script | Child-4 |
| `README.md` | Chinese README with image references | Child-4 |
| `README.en.md` | English README with image references | Child-4 |

---

## 8.2 Knowledge Graph

- **workflowX-project**: Main project entity
  - **infographic-system**: 12 HTML files + PNG screenshots + README references
  - **animation-reference**: 06-workflow-animation.html as CSS source of truth
  - **huashu-design**: Visual language system (phase-label, doc-view, editor, ac-table, badge, etc.)

---

## 8.3 Cross-Branch Dependencies

| From | To | Dependency Type | Description |
|------|----|----------------|-------------|
| Child-1 | Child-2 | hard | CSS foundation must be defined before zh HTML can use it |
| Child-1 | Child-3 | hard | CSS foundation must be defined before en HTML can use it |
| Child-2 | Child-4 | hard | zh HTML must be complete before screenshots |
| Child-3 | Child-4 | hard | en HTML must be complete before screenshots |

---

## 9. Aggregation Table

| Child | Status | Iterations | Result |
|-------|--------|------------|--------|
| 1 | Pending | 0/2 | — |
| 2 | Pending | 0/2 | — |
| 3 | Pending | 0/2 | — |
| 4 | Pending | 0/2 | — |
