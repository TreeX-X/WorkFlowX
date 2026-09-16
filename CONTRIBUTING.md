# Contributing to WorkflowX

## One PR, one concern

Split independent changes. A PR carries one `kind/*` label and every material `area/*` it touches.

## Atomic landing

Non-trivial changes land with their Agent Note in the same PR: code + Note (new `implemented/` or in-place sync per `noteX`) + entry reverse comment. Only mechanical or local edits are exempt (`not applicable`).

## Writing standard

All workflow document output follows `proseX` (see `.claude/skills/proseX/SKILL.md` / `.codex/skills/proseX/SKILL.md`). No numeric length budgets; structural gates only.

## Dual-side sync

`.claude/` and `.codex/` carry the same workflow in different trigger syntax. Skill changes land on both sides in the same PR unless the change is genuinely host-specific. Verify with `node scripts/sync-harness-rules.mjs --check --repos scripts/sync-repos.list`; a non-zero exit means drift, never auto-fix by hand-editing one side.

## WorkFlowX-first harness changes

WorkFlowX owns the harness standard. Every harness change lands here first — standard text, templates, fixtures, verify script — and only then propagates to adopter repos pinned to the recorded digest. Never invent a second Note format, plan store, or dispatch field in an adopter; bring the proposal back here.

## Regression before rhetoric

`WORKFLOW-EVOLUTION-PLAN.md` §8 holds the three-mode dry-run baseline. Change the flow only after the baseline passes; update the baseline in the same PR when the flow intentionally changes.
