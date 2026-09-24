---
schema: harness-note/1
id: 77777777-7777-4777-8777-777777777777
kind: initiative
lifecycle: proposed
created: 2026-09-25
class: architecture
tags: [harness]
interfaces:
  - name: IBusinessEngine
    direction: needs
  - name: ILoader
    direction: needs
    provider: note://aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb
  - name: IUiShell
    direction: provides
---

# Module with interface declarations

## Goal

A module declares what it provides and what it needs; the assembler matches them.

## Scope

Top-level modules only, about ten declarations.

## Acceptance criteria

- [ ] AC-1: A needs entry without provider renders as dangling demand.
