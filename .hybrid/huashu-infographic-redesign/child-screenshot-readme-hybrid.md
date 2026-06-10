# Hybrid Tree: child-screenshot-readme

**Document Type**: Child
**Parent**: `huashu-infographic-redesign-hybrid.md`
**Created**: 2026-06-04
**Status**: Pending
**Blocked By**: Child-2 (zh HTML), Child-3 (en HTML)

---

## 7. Acceptance Criteria

| # | AC | Priority | Status |
|---|-----|----------|--------|
| AC-1 | Run `scripts/screenshot.cjs` to regenerate all 12 PNG files in `docs/design/images/` | P0 | Pending |
| AC-2 | Verify all 12 PNG files exist and are non-empty | P0 | Pending |
| AC-3 | Verify `README.md` and `README.en.md` image references point to correct files (no changes needed if file names unchanged) | P1 | Pending |

---

## 8.1 Private File Index

| Path | Purpose |
|------|---------|
| `scripts/screenshot.cjs` | Screenshot generation script (Playwright) |
| `docs/design/images/` | Output directory for PNG screenshots |
| `README.md` | Chinese README |
| `README.en.md` | English README |

---

## 8.2 Incremental References

- Screenshot script uses Playwright with msedge channel
- Viewport: 720x800, captures `.container` element
- All 12 pages in the `pages` array (already correct file names)
