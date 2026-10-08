---
{
  "schema": "harness-note/2",
  "id": "7d3f9a21-4b6e-4c8a-9f1d-2e5a6b7c8d9e",
  "kind": "decision",
  "class": "process",
  "lifecycle": "implemented",
  "created": "2026-09-16",
  "tags": [
    "harness",
    "s7"
  ],
  "updated": "2026-10-08T17:40:35.413Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/7d9d87b8-8153-4b01-8c0b-fa52f50127cf",
  "extensions": {
    "migration": {
      "from": "harness-note/1",
      "revision": "abffe283d8de7f7772f8e66b31cb7c37a3b7f4e7",
      "path": ".agents/notes/2026-09-16-harness-s7-workflowx-rules--7d3f9a21.md",
      "sourceHash": "ac64e75f686f397ebf5885cd6c84eff5e7e4c3f70feff6880fe76c1ea82ecc6f",
      "gitBlobHash": "ac64e75f686f397ebf5885cd6c84eff5e7e4c3f70feff6880fe76c1ea82ecc6f"
    }
  }
}
---

# Managed rule synchronization

## Problem

Duplicated instructions and unguarded adopter updates can make hosts write incompatible Notes.

## Decision

The source repository owns managed skill trees and entry/agent blocks, including both Claude teammate wrappers. Existing wrappers without the expected marker require explicit merging; synchronization reports failure and preserves them. Marked wrappers preserve local frontmatter and unmarked text. Synchronization preserves local settings and unmarked content, checks normalized host parity, and refuses writes when the adopter profile does not match the source standard. WorkflowX upgrades first, then agentX and JanusX separately.

Repository deployment includes root AGENTS.md and CLAUDE.md as well as both runtime directories. User-global deployment is separate: Codex loads ~/.codex/AGENTS.md and Claude uses ~/.claude/CLAUDE.md, with skills and agents under their respective runtime roots. Global entry and command references resolve to the global installation; repository instructions and the selected repository profile take precedence. Bundled standards under each global runtime are reference material, not a user-home repository identity or permission to upgrade a project profile. Do not copy config.toml, settings.json, hooks, credentials or unrelated skills from the source repository.

Legacy unmarked global agent bodies require an explicit reviewed migration. Back up original bytes before replacing obsolete WorkflowX instructions, preserve local configuration fields/frontmatter, and remove obsolete Hybrid Tree templates from active skill paths. The repository synchronizer does not support user-home deployment or bypass its profile guard for it.

## Alternatives considered

Copying all host configuration is simpler but overwrites local choices. Keeping manual copies avoids tooling but permits equal-yet-stale files. Reusing the managed synchronizer with a pre-write profile guard preserves the existing boundary.

## Consequences

Source/profile drift is visible and idempotent synchronization is testable. Adopter upgrades require an explicit supported profile; source rule delivery alone does not establish runtime support.

## Verification

On 2026-10-09, all three repositories passed `node scripts/sync-harness-rules.mjs --check --repos scripts/sync-repos.list`, including six root entries. The module-structure rule was corrected to match implemented JanusX navigation: single-click previews the module document; double-click enters module browsing while retaining the current module as its parent. Both surfaces were applied to agentX and JanusX; repeated apply changed zero files. `node scripts/check-workflow-skills.mjs` passed 48 resources.

The separately authorized global deployment installed 182 files across both runtimes, including seven skills per surface, six agent definitions/wrappers, five Claude commands, two root entries and the referenced standard bundles. Three obsolete templates were removed after backup. A local deployment check reported zero drift and repeated apply changed zero files. The resource/legacy-rule audit passed 48 Markdown skill resources and six agents; five personal configuration hashes and all 32 pre-existing backed-up files matched. Original files and a hash manifest are retained under `~/.workflowx-backups/2026-10-08T17-39-47-137Z/`. These checks establish file deployment and resource consistency, not execution of a new Codex or Claude model session.

Codex global entry and agent locations were checked against the official [AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md/) and [subagent configuration](https://developers.openai.com/codex/subagents/).
