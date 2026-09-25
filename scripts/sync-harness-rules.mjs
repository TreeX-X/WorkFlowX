// Note: managed rule sync lives here — see .agents/notes/2026-09-16-harness-s7-workflowx-rules--7d3f9a21.md
// Checks dual-surface rule parity (.codex vs .claude) without fixing.
// Usage: node scripts/sync-harness-rules.mjs --check --repos scripts/sync-repos.list
import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OWN_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const apply = args.includes('--apply');
if (!args.includes('--check') && !apply) {
  console.error('usage: node scripts/sync-harness-rules.mjs --check|--apply --repos <file>');
  process.exit(2);
}
const reposIdx = args.indexOf('--repos');
const reposFile = reposIdx >= 0 ? args[reposIdx + 1] : undefined;
if (!reposFile) {
  console.error('missing --repos <file>');
  process.exit(2);
}

const managed = JSON.parse(readFileSync(join(OWN_ROOT, 'scripts', 'sync-managed.json'), 'utf8'));
// R1: note://972afef3-2fc7-49de-a3ee-7e041225d28c/81fc137e-9c56-4d3a-88e4-10f175852c97
// Only named WorkflowX skills/commands and marked entry/agent blocks are managed.
// User model, approval, plugin, settings and unrelated skill files are untouched.
const managedFiles = new Map();
function includeTree(rel) {
  for (const item of readdirSync(join(OWN_ROOT, rel), { withFileTypes: true })) {
    if (item.name === '__pycache__' || item.name.endsWith('.pyc')) continue;
    const child = rel + '/' + item.name;
    if (item.isDirectory()) includeTree(child);
    else if (item.isFile()) managedFiles.set(child, 'whole');
  }
}
for (const pair of managed.pairs) for (const rel of [pair.a, pair.b]) {
  if (rel.endsWith('/SKILL.md')) includeTree(rel.slice(0, -9));
  else managedFiles.set(rel, pair.mode);
}
for (const name of ['xdo', 'xdel', 'xflow', 'xarch', 'xstatus']) {
  const rel = '.claude/commands/' + name + '.md';
  if (existsSync(join(OWN_ROOT, rel))) managedFiles.set(rel, 'whole');
}
for (const rel of managed.entries ?? []) managedFiles.set(rel, 'blocks');
function blockPattern(rel) {
  return rel.endsWith('.toml')
    ? /^# wfx-managed: (\S+)[^\n]*\n[\s\S]*?^# wfx-managed-end[^\n]*/gm
    : /^<!-- wfx-managed: (\S+) -->[^\n]*\n[\s\S]*?^<!-- wfx-managed-end -->[^\n]*/gm;
}
function managedBlocks(text, rel) {
  return new Map([...text.replace(/\r\n/g, '\n').matchAll(blockPattern(rel))].map(m => [m[1], m[0]]));
}
const TOKENS = managed.tokens ?? ['.codex/', '.claude/'];

const normalize = (text) => {
  let out = text.replace(/\r\n/g, '\n');
  for (const t of TOKENS) out = out.split(t).join('~SURFACE~');
  return out.replace(/[ \t]+$/gm, '').replace(/\n+$/, '\n');
};

const extractBlocks = (text, comment) => {
  const blocks = new Map();
  const open = comment === '#' ? /^#\s*wfx-managed:\s*(\S+)\s*$/ : /^<!--\s*wfx-managed:\s*(\S+)\s*-->$/;
  const close = comment === '#' ? /^#\s*wfx-managed-end\s*$/ : /^<!--\s*wfx-managed-end\s*-->$/;
  let id = null;
  let buf = [];
  for (const line of text.replace(/\r\n/g, '\n').split('\n')) {
    const mOpen = open.exec(line.trim());
    const mClose = close.exec(line.trim());
    if (mOpen) {
      if (id !== null) return { error: `nested block ${mOpen[1]}` };
      id = mOpen[1];
      buf = [];
    } else if (mClose) {
      if (id === null) return { error: 'end without block' };
      blocks.set(id, buf.join('\n'));
      id = null;
    } else if (id !== null) {
      buf.push(line);
    }
  }
  if (id !== null) return { error: `unclosed block ${id}` };
  return { blocks };
};

let failures = 0;
const fail = (m) => {
  failures += 1;
  console.log(`DRIFT - ${m}`);
};
const ok = (m) => console.log(`ok - ${m}`);

// Standard pin: every repo must record the same harness-note version.
const manifest = JSON.parse(readFileSync(join(OWN_ROOT, managed.standard.manifest), 'utf8'));
if (manifest.version !== managed.standard.version) {
  fail(`own standard ${manifest.version} != recorded ${managed.standard.version}`);
} else {
  ok(`standard ${manifest.version}`);
}

// Forbidden leftovers die in the owning repo only; adopters follow at cutover.
for (const rel of managed.forbidden ?? []) {
  if (existsSync(join(OWN_ROOT, rel))) fail(`forbidden file still present: ${rel}`);
}
if ((managed.forbidden ?? []).length > 0) ok('forbidden scan (own root)');

const repos = readFileSync(resolve(OWN_ROOT, reposFile), 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l !== '' && !l.startsWith('#'));
let checkedRepos = 0;
for (const rel of repos) {
  const root = resolve(OWN_ROOT, rel);
  if (!existsSync(join(root, '.codex')) && !existsSync(join(root, '.claude'))) {
    console.log(`skip - repo absent: ${rel}`);
    continue;
  }
  checkedRepos += 1;
  if (root !== OWN_ROOT) for (const [file, mode] of managedFiles) {
    const source = readFileSync(join(OWN_ROOT, file), 'utf8');
    const path = join(root, file);
    const current = existsSync(path) ? readFileSync(path, 'utf8') : null;
    let next = source;
    if (mode === 'blocks' && current !== null) {
      const expected = managedBlocks(source, file);
      const actual = managedBlocks(current, file);
      if ([...expected.keys()].some(id => !actual.has(id))) {
        fail('[' + rel + '] missing managed block in ' + file + '; manual merge required');
        continue;
      }
      next = current.replace(/\r\n/g, '\n').replace(blockPattern(file), (block, id) => expected.get(id) ?? block);
      if (current.includes('\r\n')) next = next.replace(/\n/g, '\r\n');
    }
    if (current?.replace(/\r\n/g, '\n') !== next.replace(/\r\n/g, '\n')) {
      if (apply) { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, next); ok('synced [' + rel + '] ' + file); }
      else fail('[' + rel + '] source drift: ' + file);
    }
  }
  const identityFile = join(root, '.agents/harness.json');
  const profile = existsSync(identityFile) ? JSON.parse(readFileSync(identityFile, 'utf8')).profile : undefined;
  const digest = createHash('sha256').update(readFileSync(join(OWN_ROOT, managed.standard.manifest), 'utf8').replace(/\r\n/g, '\n')).digest('hex');
  if (profile?.id !== 'workflowx' || profile?.version !== manifest.version || profile?.digest !== digest) {
    fail('[' + rel + '] harness profile does not match source manifest');
  }
  for (const pair of managed.pairs) {
    const fa = join(root, pair.a);
    const fb = join(root, pair.b);
    const hasA = existsSync(fa);
    const hasB = existsSync(fb);
    if (!hasA || !hasB) {
      fail(`[${rel}] ${pair.id}: missing side (${!hasA ? pair.a : pair.b})`);
      continue;
    }
    const ta = readFileSync(fa, 'utf8');
    const tb = readFileSync(fb, 'utf8');
    if (pair.mode === 'whole') {
      if (normalize(ta) !== normalize(tb)) fail(`[${rel}] ${pair.id}: whole-file drift`);
      else ok(`[${rel}] ${pair.id}`);
    } else {
      const ca = ta.includes('# wfx-managed:') ? '#' : '<!--';
      const cb = tb.includes('# wfx-managed:') ? '#' : '<!--';
      const ea = extractBlocks(ta, ca);
      const eb = extractBlocks(tb, cb);
      if (ea.error) {
        fail(`[${rel}] ${pair.id}: ${ea.error} in ${pair.a}`);
        continue;
      }
      if (eb.error) {
        fail(`[${rel}] ${pair.id}: ${eb.error} in ${pair.b}`);
        continue;
      }
      const ids = new Set([...ea.blocks.keys(), ...eb.blocks.keys()]);
      let clean = true;
      for (const id of ids) {
        if (!ea.blocks.has(id) || !eb.blocks.has(id)) {
          fail(`[${rel}] ${pair.id}: block ${id} one-sided`);
          clean = false;
        } else if (normalize(ea.blocks.get(id)) !== normalize(eb.blocks.get(id))) {
          fail(`[${rel}] ${pair.id}: block ${id} drift`);
          clean = false;
        }
      }
      if (clean) ok(`[${rel}] ${pair.id}`);
    }
  }
}
if (checkedRepos === 0) {
  console.log('DRIFT - no repos present to check');
  process.exit(1);
}
console.log(failures === 0 ? 'PASS' : `${failures} DRIFTS`);
process.exit(failures === 0 ? 0 : 1);
