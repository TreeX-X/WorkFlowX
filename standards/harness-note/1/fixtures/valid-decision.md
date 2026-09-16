---
schema: harness-note/1
id: 44444444-4444-4444-8444-444444444444
kind: decision
lifecycle: proposed
created: 2026-09-16
class: architecture
tags: [harness]
---

# One markdown node with singly-owned out-edges

## Problem

Two editable copies and two progress definitions survive when the canvas only displays notes.

## Proposal

A typed markdown node carries identity; each relation is stored once at its owner; indexes rebuild by scan.

## Alternatives considered

- Central graph.json holds all relations: simple prose but a multi-writer hotspot.
- Do nothing / reuse: keeps dual sources and blocks a shared harness.

## Risks

- Concurrent bare writes need a managed-write boundary and recovery log.
