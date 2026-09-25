import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

test('adopter sync preserves local settings and agent text, detects source drift and is idempotent', () => {
  const root = mkdtempSync(join(tmpdir(), 'wfx-sync-'));
  try {
    for (const dir of ['.codex/agents', '.claude', '.agents']) mkdirSync(join(root, dir), { recursive: true });
    const config = '# local model/settings must survive\nmodel_reasoning_effort = "high"\n';
    writeFileSync(join(root, '.codex/config.toml'), config);
    writeFileSync(join(root, '.agents/harness.json'), readFileSync('.agents/harness.json'));
    const agent = readFileSync('.codex/agents/coderX.toml', 'utf8').replace('Stay within Allowed Scope.', 'OLD RULE.');
    writeFileSync(join(root, '.codex/agents/coderX.toml'), agent + '\n# LOCAL_SENTINEL\n');
    const list = join(root, 'repos.list');
    writeFileSync(list, root);
    const run = (mode) => spawnSync(process.execPath, ['scripts/sync-harness-rules.mjs', mode, '--repos', list], { encoding: 'utf8' });
    const applied = run('--apply');
    assert.equal(applied.status, 0, applied.stdout + applied.stderr);
    assert.equal(readFileSync(join(root, '.codex/config.toml'), 'utf8'), config);
    const result = readFileSync(join(root, '.codex/agents/coderX.toml'), 'utf8');
    assert.ok(result.includes('# LOCAL_SENTINEL'));
    assert.ok(!result.includes('OLD RULE'));
    assert.equal(run('--check').status, 0);
    for (const entry of ['AGENTS.md', 'CLAUDE.md']) {
      const path = join(root, entry);
      const source = readFileSync(entry, 'utf8').replace(/\r\n/g, '\n');
      assert.equal(readFileSync(path, 'utf8').replace(/\r\n/g, '\n'), source);
      writeFileSync(path, source.replace('Main Agent', 'STALE ROUTING') + '\n# LOCAL_ENTRY_SENTINEL\n');
    }
    assert.equal(run('--check').status, 1);
    assert.equal(run('--apply').status, 0);
    for (const entry of ['AGENTS.md', 'CLAUDE.md']) {
      const text = readFileSync(join(root, entry), 'utf8');
      assert.ok(text.includes('# LOCAL_ENTRY_SENTINEL'));
      assert.ok(!text.includes('STALE ROUTING'));
    }
    const again = run('--apply');
    assert.equal(again.status, 0, again.stdout + again.stderr);
    assert.ok(!again.stdout.includes('synced ['));
    // Equal-but-stale Codex/Claude copies must not pass a parity-only check.
    for (const surface of ['.codex', '.claude']) writeFileSync(join(root, surface, 'skills/noteX/SKILL.md'), '# stale\n');
    const drift = run('--check');
    assert.equal(drift.status, 1);
    assert.ok(drift.stdout.includes('source drift:'));
    // A missing marker is a manual merge, never a whole-file overwrite.
    writeFileSync(join(root, '.codex/agents/coderX.toml'), '# local only\n');
    assert.equal(run('--apply').status, 1);
    assert.equal(readFileSync(join(root, '.codex/agents/coderX.toml'), 'utf8'), '# local only\n');
    for (const entry of ['AGENTS.md', 'CLAUDE.md']) writeFileSync(join(root, entry), '# existing unmarked entry\n');
    assert.equal(run('--apply').status, 1);
    for (const entry of ['AGENTS.md', 'CLAUDE.md']) assert.equal(readFileSync(join(root, entry), 'utf8'), '# existing unmarked entry\n');
  } finally { rmSync(root, { recursive: true, force: true }); }
});
