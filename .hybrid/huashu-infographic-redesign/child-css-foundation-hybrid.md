# Hybrid Tree: child-css-foundation

**Document Type**: Child
**Parent**: `huashu-infographic-redesign-hybrid.md`
**Created**: 2026-06-04
**Status**: Pending

---

## 7. Acceptance Criteria

| # | AC | Priority | Status |
|---|-----|----------|--------|
| AC-1 | Extract all CSS component patterns from `docs/design/06-workflow-animation.html` (phase-label, section-title, chat-bubble, code-editor, doc-view, ac-table, loop-diagram, result-badge, badge, insight) | P0 | Pending |
| AC-2 | Adapt component CSS for 720px width: scale padding/gap proportionally (animation 1200px -> infographic 720px, ~0.6x factor) | P0 | Pending |
| AC-3 | Remove all animation-specific CSS (opacity:0, keyframes, animation properties) -- all elements must be visible by default | P0 | Pending |
| AC-4 | Document the CSS component library as a reference comment block that can be included in each HTML file | P1 | Pending |
| AC-5 | Verify all color values match the design system: bg #FAFAF8, primary #C04A1A, text #1A1A1A/#6B6B6B/#9B9B9B, border #E8E6E1, card #FFFFFF, code #1E1E1E, user-blue #3B82F6, pass-green #10B981/#059669, fail-red #EF4444/#DC2626 | P0 | Pending |

---

## 8.1 Private File Index

| Path | Purpose |
|------|---------|
| `docs/design/06-workflow-animation.html` | Source CSS to extract from |

---

## 8.2 Incremental References

- Animation CSS lines 7-466 contain all component definitions
- Key scaling: animation `.phase-inner` max-width 880px, infographic content area ~648px (720 - 72 padding)
- Font system: Georgia serif for titles, system sans-serif for body, Menlo/Consolas for code
