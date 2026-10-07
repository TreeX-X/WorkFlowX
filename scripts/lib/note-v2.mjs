// Note: maintained modules and fixed execution grounds — see .agents/notes/harness/maintained-documents.md
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join, dirname, relative, basename, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from './frontmatter.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const schema = JSON.parse(readFileSync(join(ROOT, 'standards/harness-note/2/note.schema.json'), 'utf8'));
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const codePointOrder = (a, b) => {
  const left = Array.from(a, c => c.codePointAt(0)), right = Array.from(b, c => c.codePointAt(0));
  for (let i = 0; i < Math.min(left.length, right.length); i++) if (left[i] !== right[i]) return left[i] - right[i];
  return left.length - right.length;
};
export function canonical(value) {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort(codePointOrder).map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}';
  return JSON.stringify(value);
}

// Only the JSON Schema vocabulary used by the owned bundle is implemented.
export function validateSchema(value, rule, at = '$') {
  const errors = [];
  const add = text => errors.push(`${at}: ${text}`);
  if (rule.allOf) for (const r of rule.allOf) errors.push(...validateSchema(value, r, at));
  if (rule.anyOf && !rule.anyOf.some(r => validateSchema(value, r, at).length === 0)) add('no allowed shape');
  if (rule.not && validateSchema(value, rule.not, at).length === 0) add('forbidden shape');
  if (rule.if) errors.push(...validateSchema(value, validateSchema(value, rule.if, at).length === 0 ? rule.then ?? {} : rule.else ?? {}, at));
  if ('const' in rule && canonical(value) !== canonical(rule.const)) add('constant mismatch');
  if (rule.enum && !rule.enum.some(v => canonical(v) === canonical(value))) add('unknown value');
  const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
  if (rule.type && !(rule.type === 'integer' ? Number.isInteger(value) : type === rule.type)) { add('expected ' + rule.type); return errors; }
  if (typeof value === 'string') {
    if (rule.pattern && !new RegExp(rule.pattern).test(value)) add('invalid format');
    if (rule.minLength !== undefined && value.length < rule.minLength) add('too short');
  }
  if (typeof value === 'number' && rule.minimum !== undefined && value < rule.minimum) add('below minimum');
  if (Array.isArray(value)) {
    if (rule.minItems !== undefined && value.length < rule.minItems) add('too few items');
    if (rule.uniqueItems && new Set(value.map(canonical)).size !== value.length) add('duplicate items');
    if (rule.items) value.forEach((item, i) => errors.push(...validateSchema(item, rule.items, `${at}[${i}]`)));
  } else if (value && typeof value === 'object') {
    for (const key of rule.required ?? []) if (!(key in value)) add('missing ' + key);
    for (const [key, item] of Object.entries(value)) {
      if (rule.properties?.[key]) errors.push(...validateSchema(item, rule.properties[key], at + '.' + key));
      else if (rule.additionalProperties === false) add('unknown field ' + key);
    }
  }
  return errors;
}

export function withoutCode(body, { keepInline = false } = {}) {
  let fence = null;
  return body.replace(/\r\n/g, '\n').split('\n').map(line => {
    const m = /^ {0,3}(`{3,}|~{3,})/.exec(line);
    if (fence) {
      if (m && m[1][0] === fence[0] && m[1].length >= fence.length && /^ {0,3}(?:`+|~+)\s*$/.test(line)) fence = null;
      return '';
    }
    if (m) { fence = m[1]; return ''; }
    if (/^(?: {4}|\t)/.test(line)) return '';
    return keepInline ? line : line.replace(/(`+)([\s\S]*?)\1/g, '');
  }).join('\n').replace(/<!--[\s\S]*?-->/g, comment => comment.replace(/[^\n]/g, ' '));
}
export function sections(body) {
  const result = {};
  let name, fence = null;
  for (const line of body.replace(/\r\n/g, '\n').split('\n')) {
    const f = /^ {0,3}(`{3,}|~{3,})/.exec(line);
    if (f && !fence) fence = f[1];
    else if (f && fence && f[1][0] === fence[0] && f[1].length >= fence.length && /^ {0,3}(?:`+|~+)\s*$/.test(line)) fence = null;
    else if (!fence) {
      const heading = /^## (.+)$/.exec(line);
      if (heading) { name = heading[1].trim(); result[name] ??= []; continue; }
      if (/^# /.test(line)) { name = undefined; continue; }
    }
    if (name) result[name].push(line);
  }
  return Object.fromEntries(Object.entries(result).map(([k, v]) => [k, v.join('\n').trim()]));
}
export function parseNote(raw) {
  const parsed = parseFrontmatter(raw);
  const visible = withoutCode(parsed.body, { keepInline: true });
  return { meta: parsed.data, body: parsed.body, title: [...visible.matchAll(/^# (.+)$/gm)].map(m => m[1]), sections: sections(parsed.body), acs: [...visible.matchAll(/^\s*- \[[ xX]\] (AC-\d+):\s*(.*)$/gm)].map(m => ({ id: m[1], text: m[2] })) };
}
const requiredSections = { idea: ['Intent'], requirement: ['Expected behavior', 'Acceptance criteria'], decision: ['Problem', 'Decision', 'Alternatives considered', 'Consequences'], task: ['Scope', 'Acceptance criteria', 'Verification', 'Progress', 'Evidence', 'Handoff'] };
export function validateNote(raw) {
  let note;
  try { note = parseNote(raw); } catch (e) { return { errors: ['frontmatter: ' + e.message] }; }
  const m = note.meta, errors = validateSchema(m, schema);
  if (errors.length) return { note, errors };
  if (note.title.length !== 1) errors.push('exactly one H1 required');
  for (const s of requiredSections[m.kind] ?? []) if (!note.sections[s]?.trim()) errors.push('missing or empty section ' + s);
  if (new Set(note.acs.map(a => a.id)).size !== note.acs.length) errors.push('duplicate AC identifier');
  if (m.kind === 'requirement' && !note.acs.length) errors.push('requirement needs AC clauses');
  for (const key of ['created', 'updated']) {
    const value = m[key];
    const day = typeof value === 'string' ? value.slice(0, 10) : '';
    const date = new Date(key === 'created' ? value + 'T00:00:00Z' : value);
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== day) errors.push('invalid calendar ' + key);
  }
  if (m.updated?.slice(0, 10) < m.created) errors.push('updated precedes created');
  if (m.interfaces) {
    const seen = new Set();
    for (const i of m.interfaces) {
      const key = `${i?.direction}:${i?.name}`;
      if (seen.has(key)) errors.push('duplicate interface');
      seen.add(key);
      if (i?.provider && i.direction !== 'needs') errors.push('only needs interface has provider');
    }
  }
  if (m.kind === 'task' && m.work && Array.isArray(m.work.scope) && Array.isArray(m.work.verification)) {
    const checkPath = p => typeof p === 'string' && !p.includes('\\') && !p.startsWith('/') && !/[:*?\[\]\x00]/.test(p) && !p.split('/').includes('..');
    for (const s of m.work.scope) for (const p of s.paths ?? []) if (!checkPath(p)) errors.push('unsafe task scope path');
    const ids = new Set();
    for (const v of m.work.verification) {
      if (ids.has(v.id)) errors.push('duplicate verification id'); ids.add(v.id);
      if (!checkPath(v.cwd)) errors.push('unsafe verification cwd');
      if (v.kind === 'command' && (!v.program || !Array.isArray(v.args))) errors.push('command needs program and args');
      if (v.kind === 'manual' && !v.description) errors.push('manual check needs description');
    }
  }
  return { note, errors };
}

const normalized = value => typeof value === 'string' ? value.replace(/\r\n/g, '\n') : Array.isArray(value) ? value.map(normalized) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalized(v)])) : value;
// Only visible AC list markers are observations. Code and executable metadata are content.
function normalizeAC(body) {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const visible = withoutCode(body, { keepInline: true }).split('\n');
  return lines.map((line, i) => /^ {0,3}- \[[xX]\] AC-\d+:/.test(visible[i] ?? '')
    ? line.replace(/^( {0,3}- )\[[xX]\]/, '$1[ ]') : line).join('\n');
}
const sorted = rows => [...rows].sort((a,b) => codePointOrder(canonical(a), canonical(b)));
export function taskContractHash(note) {
  const m = note.meta;
  if (m.kind !== 'task' || !m.work) throw new Error('not a task contract');
  const work = { ...m.work, scope: sorted(m.work.scope.map(s => ({ ...s, paths: [...s.paths].sort(codePointOrder) }))), acceptanceRefs: sorted(m.work.acceptanceRefs) };
  const relations = sorted((m.relations ?? []).filter(r => ['implements', 'depends-on', 'governed-by'].includes(r.type)).map(r => ({ ...r, ...(r.criteria ? { criteria: [...r.criteria].sort(codePointOrder) } : {}) })));
  return sha256(canonical(normalized({ schema: m.schema, id: m.id, kind: m.kind, title: note.title[0], ...(m.repositories ? { repositories: m.repositories } : {}), relations, work, sections: Object.fromEntries(['Scope','Acceptance criteria','Verification'].map(k => [k, normalizeAC(note.sections[k] ?? '')])) })));
}
export function inputDigest(note) {
  const { created, updated, ...meta } = note.meta;
  return sha256(canonical(normalized({ meta, body: normalizeAC(note.body) })));
}

export function markdownLinks(body) {
  const text = withoutCode(body), definitions = new Map();
  for (const m of text.matchAll(/^ {0,3}\[([^\]]+)\]:\s*(?:<([^>]+)>|(\S+))/gm)) definitions.set(m[1].toLowerCase(), m[2] ?? m[3]);
  const links = [];
  const spans = [];
  for (const m of text.matchAll(/\[[^\]\n]*\]\(\s*/g)) {
    let i = m.index + m[0].length, depth = 0, target = '';
    const angle = text[i] === '<';
    if (angle) i++;
    for (; i < text.length; i++) {
      const c = text[i];
      if (c === '\\' && /[!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~]/.test(text[i + 1] ?? '')) { target += text[++i]; continue; }
      if (angle) { if (c === '>' || c === '\n' || c === '<') break; }
      else {
        if (/\s/.test(c) || (c === ')' && depth === 0)) break;
        if (c === '(') depth++;
        if (c === ')') depth--;
      }
      target += c;
    }
    if (angle && text[i++] !== '>') continue;
    if (depth !== 0) continue;
    const tail = /^(?:\s+(?:"[^"\n]*"|'[^'\n]*'|\([^()\n]*\)))?\s*\)/.exec(text.slice(i));
    if (!tail) continue;
    links.push(target);
    spans.push([m.index, i + tail[0].length]);
  }
  for (const m of text.matchAll(/\[([^\]\n]+)\]\[([^\]\n]*)\]/g)) { const target = definitions.get((m[2] || m[1]).toLowerCase()); if (target) links.push(target); }
  for (const m of text.matchAll(/<(note:\/\/[^>]+)>/g)) links.push(m[1]);
  // Shortcut references, excluding definitions and links already handled.
  let remaining = text;
  for (const [start, end] of spans.reverse()) remaining = remaining.slice(0, start) + ' '.repeat(end - start) + remaining.slice(end);
  for (const m of remaining.replace(/^ {0,3}\[[^\]]+\]:.*$/gm, '').matchAll(/\[([^\]\n]+)\](?![([])/g)) { const target=definitions.get(m[1].toLowerCase()); if(target) links.push(target); }
  return [...new Set(links)];
}

export function scanNotes(root) {
  const files = [];
  const walk = dir => { if (!existsSync(dir)) return; for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isSymbolicLink()) throw new Error('symlink in Note tree: ' + p);
    if (e.isDirectory()) walk(p); else if (e.isFile() && e.name.endsWith('.md')) files.push(p);
  }};
  walk(join(root, '.agents/notes'));
  return files.sort();
}
export function checkCorpus(root, { deferred = new Map() } = {}) {
  root = resolve(root);
  const identity=JSON.parse(readFileSync(join(root,'.agents/harness.json'),'utf8'));
  const entries=[], errors=[], warnings=[], excluded=[], byUri=new Map(), byPath=new Map(), cases=new Set();
  const base=join(root,'.agents/notes');
  for(const file of scanNotes(root)) {
    const rel=relative(root,file).split(sep).join('/'), raw=readFileSync(file), hash=sha256(raw);
    if(deferred.has(rel)) {
      if(deferred.get(rel)!==hash) errors.push(rel+': deferred source changed');
      excluded.push(rel); continue;
    }
    if(cases.has(rel.toLowerCase())) errors.push(rel+': case-colliding path'); cases.add(rel.toLowerCase());
    const result=validateNote(raw.toString('utf8'));
    errors.push(...result.errors.map(e=>rel+': '+e));
    if(result.errors.length) continue;
    const note=result.note, uri=`note://${identity.repoId}/${note.meta.id}`;
    if(byUri.has(uri)) errors.push(rel+': duplicate UUID');
    const entry={...note,uri,path:rel,absolute:file,sha256:hash};
    entries.push(entry); byUri.set(uri,entry); byPath.set(file,entry);
    if(/^\d{4}-\d{2}-\d{2}-/.test(basename(file))) errors.push(rel+': date-prefixed filename');
  }
  const target=(uri,source)=>{
    if(!uri.startsWith(`note://${identity.repoId}/`)) {warnings.push(source+': external target not checked: '+uri);return null;}
    const e=byUri.get(uri); if(!e) errors.push(source+': missing local target '+uri); return e;
  };
  const nearest=dir=>{ let cur=dir; while(cur===base||cur.startsWith(base+sep)){const e=byPath.get(join(cur,'module.md'));if(e?.meta.kind==='module') return e;cur=dirname(cur);}return null; };
  for(const e of entries) {
    const m=e.meta;
    if(m.kind==='module'){
      if(basename(e.absolute)!=='module.md') errors.push(e.path+': module must use module.md');
      const owner=nearest(dirname(dirname(e.absolute)));
      if(dirname(e.absolute)===base){if(m.role!=='project'||m.parent) errors.push(e.path+': project root needs role and no parent');}
      else if(!owner||m.parent!==owner.uri) errors.push(e.path+': module parent disagrees with directory');
    }else{
      const owner=nearest(dirname(e.absolute));
      if(!owner||m.module!==owner.uri) errors.push(e.path+': module ownership disagrees with directory');
    }
    for(const uri of [m.parent,m.module,...(m.relations??[]).map(r=>r.target),...(m.interfaces??[]).map(i=>i.provider)].filter(Boolean)) target(uri,e.path);
    for(const i of m.interfaces??[]){
      if(!i.provider)continue;
      const provider=byUri.get(i.provider);
      if(provider&&(provider.meta.kind!=='module'||!(provider.meta.interfaces??[]).some(p=>p.direction==='provides'&&p.name===i.name)))errors.push(e.path+': incompatible interface provider '+i.name);
    }
    for(const ref of m.work?.acceptanceRefs??[]){ const dest=target(ref.uri,e.path);if(dest&&!dest.acs.some(a=>a.id===ref.criterionId)) errors.push(e.path+': missing '+ref.criterionId); }
    for(const link of markdownLinks(e.body)){
      const [dest,fragment]=link.split('#'); let destEntry;
      if(dest.startsWith('note://'))destEntry=target(dest,e.path);
      else if(!dest)destEntry=e;
      else if(!/^[a-z][a-z0-9+.-]*:/i.test(dest)){
        let p;try{p=resolve(dirname(e.absolute),decodeURIComponent(dest));}catch{errors.push(e.path+': malformed link');continue;}
        if(!p.startsWith(root+sep)&&p!==root) {warnings.push(e.path+': external file not checked: '+dest);continue;}
        if(!existsSync(p))errors.push(e.path+': broken link '+dest); else destEntry=byPath.get(p);
      }
      if(fragment&&destEntry){
        const headings=[...withoutCode(destEntry.body).matchAll(/^#{1,6} (.+)$/gm)].map(m=>m[1].toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu,'').replace(/\s/g,'-'));
        if(!headings.includes(fragment.toLowerCase())&&!destEntry.acs.some(a=>a.id.toLowerCase()===fragment.toLowerCase()))errors.push(e.path+': missing anchor '+fragment);
      }
    }
    const visited=new Set();let cur=e;
    while(cur?.meta.parent){if(visited.has(cur.uri)){errors.push(e.path+': parent cycle');break;}visited.add(cur.uri);cur=byUri.get(cur.meta.parent);}
  }
  if(!byPath.has(join(base,'module.md')))errors.push('missing project module.md');
  // Deferred untracked sources are local exclusions, not dependencies of a fresh checkout.
  return { entries, errors:[...new Set(errors)], warnings:[...new Set(warnings)], excluded };
}
