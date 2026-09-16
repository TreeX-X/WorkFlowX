# Agent Note: Harness note standard S1 candidate

Status: implemented

## Problem
No versioned bundle pins the shared note, receipt, change-set, and bundle shapes. Each future host fills gaps on its own, so formats drift across terminal, desktop, and built-in execution.

## Decision
The versioned bundle lives at [manifest](../../../../standards/harness-note/1/manifest.json) with schemas, five kind templates, valid plus invalid fixtures, and a locked contract-hash sample. The offline checker lives at [verify script](../../../../scripts/verify-harness-standard.mjs) and gates the bundle: manifest list, template shapes, valid fixtures pass, invalid fixtures fail with fixed codes, hash sample matches. The historical design doc stays as background reading and carries an explicit non-normative banner; runtime behavior still follows the checked-in skills until the later cutover segment.

## Alternatives considered
- Let each later host define shapes as needed — strongest case is zero upfront schema work, but three hosts then lock three dialects and every later fix pays cross-host rework.
- Hand-write prose rules with no fixtures or checker — strongest case is fast drafting, but prose alone cannot pin hashes, error codes, or required sections, so reviews stay opinion-based.
- Do nothing / reuse — keep the current skill prose as the only rule; rejected because nothing machine-checkable exists for identity, relations, acceptance refs, or evidence.

## Consequences
- **Gains**: one bundle gives later segments a fixed target; `node scripts/verify-harness-standard.mjs` reports PASS with five templates, six valid fixtures, six invalid fixtures, and one locked hash.
- **Costs and limits**: the bundle is a candidate only; skills, desktop, and execution still run old rules, and the hash lock covers the S1 sample rather than live cross-host agreement. Revisit when the shared library segment reuses the same fixtures.
