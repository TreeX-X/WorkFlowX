---
{
  "schema": "harness-note/2",
  "id": "e92790eb-30e0-4eb6-8296-5162d3fd1f03",
  "kind": "decision",
  "lifecycle": "archived",
  "created": "2026-09-21",
  "class": "process",
  "tags": [
    "xdo",
    "noteX",
    "orchestrateX"
  ],
  "codeRefs": [
    {
      "repoId": "d2499d5b-4ceb-4d46-aa3b-18e5c9b86034",
      "path": ".codex/skills/orchestrateX/SKILL.md",
      "role": "entry"
    },
    {
      "repoId": "d2499d5b-4ceb-4d46-aa3b-18e5c9b86034",
      "path": ".claude/skills/orchestrateX/SKILL.md",
      "role": "implementation"
    }
  ],
  "updated": "2026-10-07T16:12:56.085Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/4d4ff96e-89a1-4efc-839e-c9333eba0bc5",
  "extensions": {
    "migration": {
      "from": "harness-note/1",
      "revision": "abffe283d8de7f7772f8e66b31cb7c37a3b7f4e7",
      "path": ".agents/notes/2026-09-21-xdo-mandatory-note--e92790eb.md",
      "sourceHash": "94bd95cde4cbdfc400ca00784d5d37c0afda03c989c6d3410b910c44074a3f21",
      "gitBlobHash": "94bd95cde4cbdfc400ca00784d5d37c0afda03c989c6d3410b910c44074a3f21"
    }
  },
  "disposition": {
    "reason": "Historical v1 delivery/decision. The v2 maintained-document standard supersedes its authoring rules; original evidence remains at the recorded Git source."
  }
}
---

# xdo mandatory archiving

## Problem

`xdo` said task notes are optional at the top and atomic code-plus-Note at landing, with format-only and small work exempt as `not applicable`. Small tasks therefore landed without a trace, and the next agent could not tell whether a missing Note meant exempt or forgotten.

## Decision

Every `xdo` lands a Note: search existing Notes first with host search over titles, ids, and code refs; update the owning Note in place when one fits, otherwise create a new Note directly in `.agents/notes/` with frontmatter lifecycle. The `not applicable` exemption now applies outside `xdo` only. Code, Note, and entry reverse comment land in one commit whose message carries the Note path.

Flat paths keep lifecycle transitions from changing Note locations. The frontmatter carries lifecycle; a historical file move preserves its UUID and updates relative links and code reverse references. New lifecycle directories would reintroduce a second status representation, so creation rules across entry files, skills and coder instructions use the same flat layout.

## Alternatives considered

- Keep `xdo` optional with a four-type exemption — strongest case is less writing on trivial edits, but trivial edits are exactly where history goes missing, so search-first discipline costs little and recovers traceability.
- Require a task note URI upfront for `xdo` like `xdel`/`xflow` — strongest case is uniform planning, but it taxes direct work with planning overhead the user did not ask for; landing-time archiving keeps `xdo` fast.
- Do nothing / reuse — keep the optional-plus-exempt wording; rejected because the contradiction already forces the Main Agent to guess.

## Consequences

- **Gains**: every `xdo` is traceable; in-place sync stays preferred so small work updates rather than spawns files.
- **Costs and limits**: more small Notes and sync edits; `noteX` exempt scope narrows to non-`xdo` paths. Revisit when Note volume proves noisy.
