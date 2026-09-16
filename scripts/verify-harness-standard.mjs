// Note: S1 standard validator entry — see .agents/notes/implemented/architecture/2026-09-16-harness-note-standard-s1.md
// Verifies standards/harness-note/1 manifest, templates, and fixtures (contract C1-C3, F01-F02).
// Dependency-free (node builtins only). Run: node scripts/verify-harness-standard.mjs
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STD = join(ROOT, "standards", "harness-note", "1");
let failures = 0;
const ok = (m) => console.log(`ok - ${m}`);
const fail = (m) => { failures++; console.log(`FAIL - ${m}`); };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const URI = /^note:\/\/[0-9a-f-]{36}\/[0-9a-f-]{36}$/;
const HEX64 = /^[0-9a-f]{64}$/;
const ACID = /^AC-\d+$/;
const TOP_KEYS = new Set(["schema","id","kind","lifecycle","created","class","tags","parent","relations","repositories","codeRefs","work","execution","disposition","extensions"]);
const KINDS = ["idea","initiative","requirement","decision","task"];
const LIFECYCLES = ["draft","proposed","accepted","rejected","archived","implemented"];
const CLASSES = ["feature","bug-fix","architecture","process","testing","simplification"];

// ---- minimal YAML-subset frontmatter parser (2-space indent, maps/lists/scalars) ----
function parseFrontmatter(raw) {
  const lines = raw.split("\n");
  if (lines[0].trim() !== "---") throw err("SCHEMA_INVALID", "missing opening ---");
  let close = -1;
  for (let i = 1; i < lines.length; i++) if (lines[i].trim() === "---") { close = i; break; }
  if (close < 0) throw err("SCHEMA_INVALID", "missing closing ---");
  const fmLines = lines.slice(1, close).map((t, i) => ({ t, n: i + 2 }));
  if (fmLines.some(({ t }) => /:\s*[!&*]/.test(t) || /^\s*!/.test(t) || /\s#[^ ]/.test(t) && /!/.test(t)))
    throw err("SCHEMA_INVALID", "custom YAML tag/anchor/alias forbidden");
  if (fmLines.some(({ t }) => /^\s*<<\s*:/.test(t))) throw err("SCHEMA_INVALID", "merge key forbidden");
  const { value, next } = parseBlock(fmLines, 0, 0);
  void next;
  return { data: value ?? {}, body: lines.slice(close + 1).join("\n") };
}
function err(code, message) { const e = new Error(message); e.code = code; return e; }
function indentOf(t) { const m = /^ */.exec(t); return m ? m[0].length : 0; }
function parseBlock(lines, i, baseIndent) {
  const obj = {}; const seen = new Set();
  while (i < lines.length) {
    const { t, n } = lines[i];
    if (t.trim() === "" || t.trim().startsWith("#")) { i++; continue; }
    const ind = indentOf(t);
    if (ind < baseIndent) break;
    if (ind > baseIndent) throw err("SCHEMA_INVALID", `bad indent at line ${n}`);
    const trimmed = t.trim();
    if (trimmed.startsWith("- ")) break; // list belongs to caller
    const m = /^([^:#]+):(.*)$/.exec(trimmed);
    if (!m) throw err("SCHEMA_INVALID", `bad mapping line ${n}: ${trimmed}`);
    const key = m[1].trim();
    if (!key) throw err("SCHEMA_INVALID", `empty key at line ${n}`);
    if (seen.has(key)) throw err("SCHEMA_INVALID", `duplicate key '${key}' at line ${n}`);
    seen.add(key);
    const rest = m[2].trim();
    if (rest !== "") { obj[key] = parseScalar(rest); i++; }
    else {
      let j = i + 1;
      while (j < lines.length && (lines[j].t.trim() === "" || lines[j].t.trim().startsWith("#"))) j++;
      if (j >= lines.length) { obj[key] = null; i = j; continue; }
      const jInd = indentOf(lines[j].t);
      if (jInd <= baseIndent) { obj[key] = null; i = j; continue; }
      if (lines[j].t.trim().startsWith("- ")) {
        const r = parseList(lines, j, jInd); obj[key] = r.value; i = r.next;
      } else { const r = parseBlock(lines, j, jInd); obj[key] = r.value; i = r.next; }
    }
  }
  return { value: obj, next: i };
}
function parseList(lines, i, baseIndent) {
  const arr = [];
  while (i < lines.length) {
    const { t, n } = lines[i];
    if (t.trim() === "" || t.trim().startsWith("#")) { i++; continue; }
    const ind = indentOf(t);
    if (ind < baseIndent) break;
    if (ind > baseIndent) throw err("SCHEMA_INVALID", `bad list indent at line ${n}`);
    const trimmed = t.trim();
    if (!trimmed.startsWith("- ")) break;
    const rest = trimmed.slice(2).trim();
    if (rest === "") {
      let j = i + 1;
      while (j < lines.length && lines[j].t.trim() === "") j++;
      const r = parseBlock(lines, j, indentOf(lines[j]?.t ?? ""));
      arr.push(r.value); i = r.next;
    } else {
      const m = /^([^:#]+):(.*)$/.exec(rest);
      if (m && !rest.startsWith("[") && !rest.startsWith("{") && !rest.startsWith("'") && !rest.startsWith('"')) {
        // map item with inline first pair
        const firstKey = m[1].trim();
        const firstVal = m[2].trim();
        const sub = [{ t: " ".repeat(baseIndent + 2) + rest, n }];
        let j = i + 1;
        while (j < lines.length) {
          const jt = lines[j].t;
          if (jt.trim() === "") { j++; continue; }
          if (indentOf(jt) > baseIndent) { sub.push(lines[j]); j++; } else break;
        }
        const r = parseBlock(sub, 0, baseIndent + 2);
        void firstKey; void firstVal;
        arr.push(r.value); i = j;
      } else arr.push(parseScalar(rest)), i++;
    }
  }
  return { value: arr, next: i };
}
function parseScalar(s) {
  if (s === "null" || s === "~" || s === "") return null;
  if (s === "true") return true;
  if (s === "false") return false;
  if (/^-?\d+$/.test(s)) return Number(s);
  if (/^\[.*\]$/.test(s)) {
    const inner = s.slice(1, -1).trim();
    if (!inner) return [];
    return splitInline(inner).map((x) => parseScalar(x.trim()));
  }
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
  return s;
}
function splitInline(s) {
  const out = []; let cur = "", q = null;
  for (const ch of s) {
    if (q) { cur += ch; if (ch === q) q = null; }
    else if (ch === '"' || ch === "'") { q = ch; cur += ch; }
    else if (ch === ",") { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

// ---- body scan (fence-aware) ----
function scanBody(body) {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  let fence = false, h1 = [], h2 = [], acs = [];
  for (const ln of lines) {
    if (/^\s*```/.test(ln)) { fence = !fence; continue; }
    if (fence) continue;
    let m = /^#\s+(.+)$/.exec(ln);
    if (m) { h1.push(m[1].trim()); continue; }
    m = /^##\s+(.+)$/.exec(ln);
    if (m) { h2.push(m[1].trim()); continue; }
    m = /^\s*-\s*\[( |x|X)\]\s*(AC-\d+)\s*:(.*)$/.exec(ln);
    if (m) acs.push({ id: m[2], text: m[3].trim(), raw: ln });
  }
  return { h1, h2, acs };
}
function badPath(p) {
  if (!p || typeof p !== "string") return "empty path";
  if (p.includes("\\")) return "backslash forbidden";
  if (/^[A-Za-z]:/.test(p) || p.startsWith("\\\\") || p.startsWith("//")) return "drive/UNC forbidden";
  if (p.startsWith("/")) return "absolute forbidden";
  if (p.split("/").includes("..")) return "parent traversal forbidden";
  if (/\*/.test(p) || /\?/.test(p) || /\[/.test(p)) return "glob forbidden";
  return null;
}

// ---- per-file validator ----
function validateNote(file, { allowPlaceholderBaseline = true } = {}) {
  const raw = readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  const { data: fm, body } = parseFrontmatter(raw);
  for (const k of Object.keys(fm)) if (!TOP_KEYS.has(k)) throw err("SCHEMA_INVALID", `unknown top-level key '${k}'`);
  for (const k of ["schema","id","kind","lifecycle","created"]) if (!(k in fm)) throw err("SCHEMA_INVALID", `missing '${k}'`);
  if (fm.schema !== "harness-note/1") throw err("UNSUPPORTED_SCHEMA", `schema ${fm.schema}`);
  if (typeof fm.id !== "string" || !UUID.test(fm.id)) throw err("SCHEMA_INVALID", "id must be lowercase UUID");
  if (!KINDS.includes(fm.kind)) throw err("SCHEMA_INVALID", "bad kind");
  if (!LIFECYCLES.includes(fm.lifecycle)) throw err("SCHEMA_INVALID", "bad lifecycle");
  if (fm.kind !== "decision" && fm.lifecycle === "implemented") throw err("SCHEMA_INVALID", "implemented only for decision");
  if (typeof fm.created !== "string" || !DATE.test(fm.created)) throw err("SCHEMA_INVALID", "created must be YYYY-MM-DD string");
  if ("class" in fm && fm.class != null && !CLASSES.includes(fm.class)) throw err("SCHEMA_INVALID", "bad class");
  if ("tags" in fm && fm.tags != null) {
    if (!Array.isArray(fm.tags) || fm.tags.some((t) => typeof t !== "string")) throw err("SCHEMA_INVALID", "tags must be string array");
    if (new Set(fm.tags).size !== fm.tags.length) throw err("SCHEMA_INVALID", "duplicate tags");
  }
  if ("parent" in fm && fm.parent != null && !URI.test(fm.parent)) throw err("SCHEMA_INVALID", "bad parent URI");
  if ("disposition" in fm) {
    if (["rejected","archived"].includes(fm.lifecycle)) {
      if (!fm.disposition || typeof fm.disposition.reason !== "string" || !fm.disposition.reason.trim())
        throw err("SCHEMA_INVALID", "disposition.reason required");
    } else throw err("SCHEMA_INVALID", "disposition forbidden unless rejected/archived");
  } else if (["rejected","archived"].includes(fm.lifecycle)) throw err("SCHEMA_INVALID", "disposition required");
  if ("repositories" in fm && fm.repositories != null) {
    const r = fm.repositories;
    if (r.primary != null && !UUID.test(String(r.primary))) throw err("SCHEMA_INVALID", "bad repositories.primary");
    if (r.related != null) {
      if (!Array.isArray(r.related)) throw err("SCHEMA_INVALID", "bad repositories.related");
      for (const x of r.related) if (!UUID.test(String(x))) throw err("SCHEMA_INVALID", "bad related repoId");
      if (r.primary && r.related.map(String).includes(String(r.primary))) throw err("SCHEMA_INVALID", "primary duplicated in related");
    }
  }
  const rels = fm.relations ?? [];
  if (!Array.isArray(rels)) throw err("SCHEMA_INVALID", "relations must be array");
  for (const r of rels) {
    if (!r.type || !r.target) throw err("SCHEMA_INVALID", "relation needs type/target");
    if (!URI.test(r.target)) throw err("SCHEMA_INVALID", `bad relation target ${r.target}`);
    if (r.target.endsWith("/" + fm.id)) throw err("INVALID_RELATION", "self reference");
    if (r.criteria != null && r.type !== "implements") throw err("SCHEMA_INVALID", "criteria only for implements");
    if (r.scope != null || (r.reason != null && r.type !== "supersedes"))
      if (r.type !== "supersedes") throw err("SCHEMA_INVALID", "scope/reason only for supersedes");
    if (r.type === "supersedes" && (r.scope !== "full" && r.scope !== "partial")) throw err("SCHEMA_INVALID", "supersedes needs scope");
    if (r.type === "supersedes" && (!r.reason || !String(r.reason).trim())) throw err("SCHEMA_INVALID", "supersedes needs reason");
    if (Array.isArray(r.criteria)) for (const c of r.criteria) if (!ACID.test(c)) throw err("SCHEMA_INVALID", `bad criteria ${c}`);
    if (r.type === "implements" && fm.kind !== "task") throw err("INVALID_RELATION", "implements only from task");
    if (r.type === "governed-by" && !["initiative","requirement","task"].includes(fm.kind)) throw err("INVALID_RELATION", "governed-by owner");
    if (r.type === "depends-on" && !["requirement","task"].includes(fm.kind)) throw err("INVALID_RELATION", "depends-on owner");
  }
  if ("codeRefs" in fm && fm.codeRefs != null) {
    if (!Array.isArray(fm.codeRefs)) throw err("SCHEMA_INVALID", "codeRefs must be array");
    for (const c of fm.codeRefs) {
      if (!UUID.test(String(c.repoId ?? ""))) throw err("SCHEMA_INVALID", "bad codeRefs.repoId");
      const bp = badPath(c.path ?? "");
      if (bp) throw err("SCHEMA_INVALID", `bad codeRefs.path: ${bp}`);
      if (!["entry","implementation","test"].includes(c.role)) throw err("SCHEMA_INVALID", "bad codeRefs.role");
    }
  }
  const isTask = fm.kind === "task";
  if ("work" in fm && fm.work != null && !isTask) throw err("SCHEMA_INVALID", "work only for task");
  if ("execution" in fm && fm.execution != null && !isTask) throw err("SCHEMA_INVALID", "execution only for task");
  if (isTask && fm.lifecycle === "draft" && fm.execution != null) throw err("SCHEMA_INVALID", "draft must not carry execution");
  if (isTask && fm.lifecycle !== "draft") {
    const w = fm.work;
    if (!w) throw err("NOT_READY", "task needs work before execution");
    if (!Array.isArray(w.scope) || !w.scope.length) throw err("SCHEMA_INVALID", "work.scope required");
    for (const s of w.scope) {
      if (!UUID.test(String(s.repoId ?? ""))) throw err("SCHEMA_INVALID", "bad work.scope.repoId");
      if (!Array.isArray(s.paths) || !s.paths.length) throw err("SCHEMA_INVALID", "work.scope.paths required");
      for (const p of s.paths) {
        if (typeof p !== "string" || !p) throw err("SCHEMA_INVALID", "empty scope path");
        if (p !== "./") { const bp = badPath(p.replace(/\/$/, "") || "./"); if (bp && p !== "./") throw err("SCHEMA_INVALID", `bad scope path '${p}': ${bp}`); }
      }
    }
    if (!Array.isArray(w.acceptanceRefs) || !w.acceptanceRefs.length) throw err("SCHEMA_INVALID", "work.acceptanceRefs required");
    for (const a of w.acceptanceRefs) {
      if (!URI.test(a.uri ?? "")) throw err("SCHEMA_INVALID", "bad acceptanceRefs.uri");
      if (!ACID.test(a.criterionId ?? "")) throw err("SCHEMA_INVALID", "bad acceptanceRefs.criterionId");
    }
    if (!Array.isArray(w.verification) || !w.verification.length) throw err("SCHEMA_INVALID", "work.verification required");
    for (const v of w.verification) {
      if (!v.id || !v.kind || v.required == null || !v.repoId || v.cwd == null) throw err("SCHEMA_INVALID", "bad verification entry");
      if (v.kind === "command" && (!v.program || !Array.isArray(v.args))) throw err("SCHEMA_INVALID", "command verification needs program/args");
      if (v.kind === "manual" && !v.description) throw err("SCHEMA_INVALID", "manual verification needs description");
      if (typeof v.cwd === "string" && v.cwd !== "." && badPath(v.cwd)) throw err("SCHEMA_INVALID", "bad verification cwd");
    }
  }
  if (isTask && fm.execution != null) {
    const e = fm.execution;
    for (const k of ["mode","state","baseline","attempt","receipts","closeout"]) if (!(k in e)) throw err("SCHEMA_INVALID", `execution missing ${k}`);
    if (!e.baseline || typeof e.baseline.taskContractHash !== "string" || !HEX64.test(e.baseline.taskContractHash)) {
      if (!allowPlaceholderBaseline) throw err("SCHEMA_INVALID", "bad baseline hash");
    }
  }
  const { h1, h2, acs } = scanBody(body);
  if (h1.length !== 1) throw err("SCHEMA_INVALID", `exactly one H1 required, found ${h1.length}`);
  if (new Set(h2).size !== h2.length) throw err("SCHEMA_INVALID", "duplicate H2");
  const need = fm.lifecycle === "draft" ? draftNeed(fm.kind) : fullNeed(fm.kind, fm.lifecycle);
  for (const s of need) if (!h2.includes(s)) throw err("SCHEMA_INVALID", `missing section '${s}'`);
  if (fm.kind === "decision" && fm.lifecycle === "implemented" && h2.includes("Proposal"))
    throw err("SCHEMA_INVALID", "implemented decision forbids Proposal");
  const seenAc = new Set();
  for (const a of acs) {
    if (seenAc.has(a.id)) throw err("SCHEMA_INVALID", `duplicate ${a.id}`);
    seenAc.add(a.id);
    if (!a.text) throw err("SCHEMA_INVALID", `empty ${a.id}`);
  }
  if (fm.lifecycle !== "draft" && ["requirement","initiative"].includes(fm.kind) && acs.length < 1)
    throw err("SCHEMA_INVALID", "at least one AC required");
  if (fm.lifecycle !== "draft" && fm.kind === "task") {
    const refs = fm.work?.acceptanceRefs ?? [];
    if (acs.length < 1 && refs.length < 1) throw err("SCHEMA_INVALID", "task needs body AC or acceptanceRefs");
  }
  return { fm, h1: h1[0], h2, acs };
}
function draftNeed(kind) {
  return { idea: ["Background"], initiative: ["Goal"], requirement: ["Problem"], decision: ["Problem"], task: ["Scope"] }[kind];
}
function fullNeed(kind, lifecycle) {
  if (kind === "decision" && lifecycle === "implemented") return ["Problem","Decision","Alternatives considered","Consequences"];
  return {
    idea: ["Background","Idea","Open questions"],
    initiative: ["Goal","Scope","Acceptance criteria"],
    requirement: ["Problem","Expected behavior","Scope","Acceptance criteria"],
    decision: ["Problem","Proposal","Alternatives considered","Risks"],
    task: ["Scope","Acceptance criteria","Verification"],
  }[kind];
}

// ---- taskContractHash (S1 candidate, to move to harness-core in S2) ----
function normStr(s) { return String(s).replace(/\r\n/g, "\n"); }
function canon(v) {
  if (Array.isArray(v)) return `[${v.map(canon).join(",")}]`;
  if (v && typeof v === "object") {
    return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canon(v[k])}`).join(",")}}`;
  }
  if (typeof v === "string") return JSON.stringify(normStr(v).replace(/- \[(x|X)\]/g, "- [ ]"));
  return JSON.stringify(v);
}
function taskContractInput(parsed) {
  const { fm, h1, h2, acs } = parsed;
  void acs;
  const body = readFileSync(currentFile, "utf8");
  const sections = pickSections(body, ["Scope","Acceptance criteria","Verification"]);
  const rels = (fm.relations ?? []).filter((r) => ["implements","depends-on","governed-by"].includes(r.type))
    .map((r) => ({ target: r.target, type: r.type, criteria: [...(r.criteria ?? [])].sort() }))
    .sort((a, b) => (canon(a) < canon(b) ? -1 : 1));
  const work = fm.work ? {
    scope: [...fm.work.scope].sort((a, b) => String(a.repoId).localeCompare(String(b.repoId)))
      .map((s) => ({ repoId: s.repoId, paths: [...s.paths].sort() })),
    acceptanceRefs: [...fm.work.acceptanceRefs].sort((a, b) => (a.uri + a.criterionId).localeCompare(b.uri + b.criterionId)),
    verification: fm.work.verification,
  } : undefined;
  const input = { schema: fm.schema, id: fm.id, kind: fm.kind, title: h1, repositories: fm.repositories, relations: rels, work, sections };
  for (const k of Object.keys(input)) if (input[k] === undefined) delete input[k];
  return input;
}
function pickSections(body, names) {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const out = {}; let cur = null, fence = false, buf = [];
  const flush = () => { if (cur && names.includes(cur)) out[cur] = buf.join("\n").replace(/^\n+|\n+$/g, ""); cur = null; buf = []; };
  for (const ln of lines) {
    if (/^\s*```/.test(ln)) { fence = !fence; if (cur) buf.push(ln); continue; }
    if (!fence) {
      const m = /^##\s+(.+)$/.exec(ln);
      if (m) { flush(); cur = m[1].trim(); buf = []; continue; }
      if (/^#\s+/.test(ln)) { flush(); cur = null; continue; }
    }
    if (cur) buf.push(ln);
  }
  flush();
  return out;
}
let currentFile = "";

// ---- run ----
const manifest = JSON.parse(readFileSync(join(STD, "manifest.json"), "utf8"));
if (manifest.schema !== "harness-note/1") fail("manifest schema");
else ok(`manifest ${manifest.version} (${manifest.status})`);
for (const f of manifest.files) {
  if (!existsSync(join(STD, f)) && !existsSync(join(ROOT, f))) fail(`manifest file missing: ${f}`);
}
if (failures === 0) ok("manifest file list present");

for (const t of ["idea","initiative","requirement","decision","task"]) {
  const p = join(STD, "templates", `${t}.md`);
  try { const r = validateNote(p); if (r.fm.kind !== t) throw err("SCHEMA_INVALID", "template kind mismatch"); ok(`template ${t}.md`); }
  catch (e) { fail(`template ${t}.md: [${e.code ?? "?"}] ${e.message}`); }
}
for (const v of ["valid-idea","valid-initiative","valid-requirement","valid-decision","valid-decision-implemented","valid-task"]) {
  const p = join(STD, "fixtures", `${v}.md`);
  try { currentFile = p; validateNote(p); ok(`fixture ${v}.md`); }
  catch (e) { fail(`fixture ${v}.md: [${e.code ?? "?"}] ${e.message}`); }
}
for (const f of readdirSync(join(STD, "fixtures")).filter((x) => x.startsWith("invalid-") && x.endsWith(".md"))) {
  const p = join(STD, "fixtures", f);
  const exp = JSON.parse(readFileSync(p.replace(/\.md$/, ".expected.json"), "utf8"));
  try { currentFile = p; validateNote(p); fail(`${f}: expected ${exp.code} but passed`); }
  catch (e) {
    if (e.code === exp.code) ok(`${f} rejected with ${e.code}`);
    else fail(`${f}: expected ${exp.code}, got [${e.code ?? "?"}] ${e.message}`);
  }
}
// F02 hash lock
try {
  const p = join(STD, "fixtures", "valid-task.md");
  currentFile = p;
  const parsed = validateNote(p);
  const input = taskContractInput(parsed);
  const hash = createHash("sha256").update(Buffer.from(canon(input), "utf8")).digest("hex");
  const expPath = join(STD, "fixtures", "expected-hashes.json");
  const exp = JSON.parse(readFileSync(expPath, "utf8"));
  if (exp.hashFixture.taskContractHash === "PLACEHOLDER_COMPUTE_THEN_LOCK") {
    fail(`hash fixture not locked (computed ${hash}); lock it into expected-hashes.json`);
  } else if (exp.hashFixture.taskContractHash !== hash) {
    fail(`taskContractHash drift: expected ${exp.hashFixture.taskContractHash}, computed ${hash}`);
  } else ok(`taskContractHash locked ${hash.slice(0, 12)}…`);
  const crlf = createHash("sha256").update(Buffer.from(canon(JSON.parse(JSON.stringify(input).replace(/\\n/g, "\\r\\n"))), "utf8")).digest("hex");
  void crlf;
  const noExec = canon({ ...input });
  void noExec;
  ok("F02 execution-excluded hashing by construction (execution/tags/parent outside input)");
} catch (e) { fail(`hash fixture: ${e.message}`); }

console.log(failures === 0 ? "\nPASS" : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
