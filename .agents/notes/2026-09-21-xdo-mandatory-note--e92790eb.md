---
schema: harness-note/1
id: e92790eb-30e0-4eb6-8296-5162d3fd1f03
kind: decision
lifecycle: implemented
created: 2026-09-21
class: process
tags: [xdo, noteX, orchestrateX]
codeRefs:
  - repoId: d2499d5b-4ceb-4d46-aa3b-18e5c9b86034
    path: .codex/skills/orchestrateX/SKILL.md
    role: entry
  - repoId: d2499d5b-4ceb-4d46-aa3b-18e5c9b86034
    path: .claude/skills/orchestrateX/SKILL.md
    role: implementation
---

# xdo mandatory archiving

## Problem

`xdo` said task notes are optional at the top and atomic code-plus-Note at landing, with format-only and small work exempt as `not applicable`. Small tasks therefore landed without a trace, and the next agent could not tell whether a missing Note meant exempt or forgotten.

## Decision

Every `xdo` lands a Note: search existing Notes first with host search over titles, ids, and code refs; update the owning Note in place when one fits, otherwise create a new `implemented/` Note. The `not applicable` exemption now applies outside `xdo` only. Code, Note, and entry reverse comment land in one commit whose message carries the Note path.

## Alternatives considered

- Keep `xdo` optional with a four-type exemption — strongest case is less writing on trivial edits, but trivial edits are exactly where history goes missing, so search-first discipline costs little and recovers traceability.
- Require a task note URI upfront for `xdo` like `xdel`/`xflow` — strongest case is uniform planning, but it taxes direct work with planning overhead the user did not ask for; landing-time archiving keeps `xdo` fast.
- Do nothing / reuse — keep the optional-plus-exempt wording; rejected because the contradiction already forces the Main Agent to guess.

## Consequences

- **Gains**: every `xdo` is traceable; in-place sync stays preferred so small work updates rather than spawns files.
- **Costs and limits**: more small Notes and sync edits; `noteX` exempt scope narrows to non-`xdo` paths. Revisit when Note volume proves noisy.
