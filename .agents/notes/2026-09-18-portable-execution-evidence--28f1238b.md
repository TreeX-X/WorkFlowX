---
schema: harness-note/1
id: 28f1238b-2678-45d0-889a-6982e5b3ad2f
kind: decision
lifecycle: implemented
created: 2026-09-18
class: architecture
codeRefs:
  - repoId: d2499d5b-4ceb-4d46-aa3b-18e5c9b86034
    path: standards/harness-note/1/execution-persistence.md
    role: implementation
  - repoId: d2499d5b-4ceb-4d46-aa3b-18e5c9b86034
    path: scripts/verify-harness-standard.mjs
    role: test
---

# Portable Execution Evidence

## Problem

Receipts stored only with local runs cannot establish shared task results. Raw JSON file hashes also change when Git converts line endings, causing identical evidence to lose its identity on another checkout.

## Decision

The candidate standard defines task execution and formal evidence as portable assets, with local records reserved for coordination. Its persistence specification requires recoverable writes, explicit ownership and HEAD-reachable closeout with the task, receipt and tested files in one tree. Receipt content identity uses recursively sorted JSON objects while preserving arrays and scalar values. Code evidence remains byte-exact. The fixed receipt fixture is checked by both the dependency-free standard validator and harness-core.

## Alternatives considered

- Reuse the existing candidate without a persistence specification: avoids changing the pinned version, but hosts can diverge on formal writes, recovery and evidence identity.
- Hash receipt file bytes: easy and strict, but JSON formatting and checkout line endings invalidate equivalent evidence.
- Export local run records: preserves operational details, but leaks ownership and gives portable assets a competing state source.

## Consequences

The standard version is `1.0.0-s1.1` with candidate status. The owning repository profile and synchronization gate pin that version; adopter runtime rules remain on their existing policy until full cutover acceptance. `node scripts/verify-harness-standard.mjs` checks the new receipt fixture, and `node scripts/sync-harness-rules.mjs --check --repos scripts/sync-repos.list` verifies dual-surface parity. Runtime crash, Git and GUI behavior still require the implementation repositories' tests.
