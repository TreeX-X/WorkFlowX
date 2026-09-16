---
schema: harness-note/1
id: 7d3f9a21-4b6e-4c8a-9f1d-2e5a6b7c8d9e
kind: decision
class: process
lifecycle: implemented
created: 2026-09-16
tags: [harness, s7]
---

# WorkFlowX rules move to task notes with a sync gate

## Problem
Parallel plan files duplicate goals, acceptance, and lifecycle next to decision notes. Two description dialects grow between the Codex and Claude surfaces, and harness changes lack an agreed entry point, so adopter repos invent diverging fields.

## Decision
Task notes carry scope, acceptance refs, verification, dependencies, and execution state; no separate plan files, plan directories, or plan URIs exist. The old tree template and the four legacy note skeletons are deleted; the harness idea template covers drafts. Twelve dual-surface pairs stay byte-identical after surface-token normalization, enforced by `node scripts/sync-harness-rules.mjs --check --repos scripts/sync-repos.list`. The normative schema, templates, and fixtures live in `standards/harness-note/1/`, checked by `node scripts/verify-harness-standard.mjs`. Every harness change lands in WorkFlowX first and propagates pinned to the recorded digest; adopter-local inventions return here as proposals. Pre-S7 folder-layout notes stay readable legacy and gain no new siblings.

## Alternatives considered
- Keep parallel plan files beside decision notes — strongest case is zero migration and familiar dispatch vocabulary, but every scope then lives twice and drifts twice, which already blocks unified acceptance.
- Promote one surface and generate the other — strongest case is a single source of truth with zero drift by construction, but host-specific sections still need a home, and generation hides the diff reviewers must see.
- Do nothing / reuse — keep the old skeletons and tree template; rejected because unmaintained templates keep producing uncheckable dispatches.

## Consequences
- **Gains**: `sync-harness-rules.mjs --check` reports PASS across 12 pairs plus the standard pin with zero forbidden leftovers; `verify-harness-standard.mjs` still reports PASS; base work runs with host search alone, and a missing checker means the document flow without install prompts.
- **Costs and limits**: adopter checkouts join the sync list at cutover, not now; the section 8 dry-run baseline predates the task vocabulary and gets re-recorded there. No repo identity file exists yet, so cross-repo URIs stay unresolved until that step.
