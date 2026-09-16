---
schema: harness-note/1
id: 55555555-5555-4555-8555-555555555555
kind: task
lifecycle: accepted
created: 2026-09-16
class: feature
tags: [harness, s1]
repositories:
  primary: 8fa19f17-c717-43a8-93a7-810a5e0cbc91
relations:
  - type: implements
    target: note://8fa19f17-c717-43a8-93a7-810a5e0cbc91/33333333-3333-4333-8333-333333333333
    criteria: [AC-1]
  - type: governed-by
    target: note://8fa19f17-c717-43a8-93a7-810a5e0cbc91/44444444-4444-4444-8444-444444444444
work:
  scope:
    - repoId: 8fa19f17-c717-43a8-93a7-810a5e0cbc91
      paths: ["standards/harness-note/1/"]
  acceptanceRefs:
    - uri: note://8fa19f17-c717-43a8-93a7-810a5e0cbc91/33333333-3333-4333-8333-333333333333
      criterionId: AC-1
  verification:
    - id: V-1
      kind: command
      required: true
      repoId: 8fa19f17-c717-43a8-93a7-810a5e0cbc91
      cwd: .
      program: node
      args: ["scripts/verify-harness-standard.mjs"]
execution:
  mode: xdo
  state: queued
  baseline:
    taskContractHash: 0000000000000000000000000000000000000000000000000000000000000000
    inputs:
      - uri: note://8fa19f17-c717-43a8-93a7-810a5e0cbc91/33333333-3333-4333-8333-333333333333
        contentHash: 0000000000000000000000000000000000000000000000000000000000000000
        criteria: [AC-1]
  attempt: 0
  receipts: []
  closeout: commit-required
---

# Candidate standard S1 task

## Scope

Deliver the versioned standard, templates, and fixtures for harness-note/1.

## Acceptance criteria

Inherited clauses live in metadata; this task owns no extra AC.

## Verification

- V-1: Run `node scripts/verify-harness-standard.mjs`; required checks pass.
