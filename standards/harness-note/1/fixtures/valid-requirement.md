---
schema: harness-note/1
id: 33333333-3333-4333-8333-333333333333
kind: requirement
lifecycle: proposed
created: 2026-09-16
class: feature
tags: [blueprint]
repositories:
  primary: 8fa19f17-c717-43a8-93a7-810a5e0cbc91
---

# Maintain the same note in terminal and canvas

## Problem

Requirement edits in the terminal do not appear on the canvas as the same asset.

## Expected behavior

The canvas reads project notes directly and writes back to the same files.

## Scope

Project-local edit, external-change refresh, and conflict prompt.

## Acceptance criteria

- [ ] AC-1: Valid terminal save appears in the open canvas within the agreed refresh window.
- [ ] AC-2: Canvas save preserves unknown extension fields.
