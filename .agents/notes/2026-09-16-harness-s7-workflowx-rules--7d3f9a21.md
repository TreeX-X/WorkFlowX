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

Task notes carry scope, acceptance refs, verification, dependencies, and execution state; no separate plan files, plan directories, or plan URIs exist. The old tree template and the four legacy note skeletons are deleted; the harness idea template covers drafts. Twelve dual-surface pairs stay byte-identical after surface-token normalization, enforced by `node scripts/sync-harness-rules.mjs --check --repos scripts/sync-repos.list`. The normative schema, templates, and fixtures live in `standards/harness-note/1/`, checked by `node scripts/verify-harness-standard.mjs`. WorkFlowX currently pins the `1.0.0-s1.2` candidate; adopter runtimes remain on their recorded profile until the joint cutover. Every harness change lands in WorkFlowX first and propagates only through a recorded version and digest. Pre-S7 folder-layout notes remain historical assets and receive no new siblings; the corpus migration is tracked separately.

## Alternatives considered

- Keep parallel plan files beside decision notes — strongest case is zero migration and familiar dispatch vocabulary, but every scope then lives twice and drifts twice, which already blocks unified acceptance.
- Promote one surface and generate the other — strongest case is a single source of truth with zero drift by construction, but host-specific sections still need a home, and generation hides the diff reviewers must see.
- Do nothing / reuse — keep the old skeletons and tree template; rejected because unmaintained templates keep producing uncheckable dispatches.

## Consequences

- **Gains**: `sync-harness-rules.mjs --check` reports PASS across 12 pairs plus the standard pin with zero forbidden leftovers; `verify-harness-standard.mjs` reports PASS for the S1.2 candidate; base work remains possible with host search alone.
- **Costs and limits**: S1.2 is not a joint runtime cutover; adopter checkouts still need profile synchronization and cross-host acceptance. Legacy documents are readable to humans but are not part of the structured graph until the corpus migration completes.
