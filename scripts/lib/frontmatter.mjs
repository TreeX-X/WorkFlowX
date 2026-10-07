// WorkflowX offline format reader: a strict YAML subset, or JSON between --- delimiters.

export function parseFrontmatter(raw) {
  raw = raw.replace(/\r\n/g, "\n");
  const match = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(raw);
  if (match?.[1].trim().startsWith("{")) {
    const data = JSON.parse(match[1]);
    const tokens = match[1].match(/"(?:\\.|[^"\\])*"|[{}\[\]:,]|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null/g);
    const stack = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token === '{' || token === '[') stack.push({ kind: token, keys: new Set() });
      else if (token === '}' || token === ']') stack.pop();
      else if (token.startsWith('"') && tokens[i + 1] === ':' && stack.at(-1)?.kind === '{') {
        const key = JSON.parse(token), owner = stack.at(-1);
        if (owner.keys.has(key)) throw err('SCHEMA_INVALID', 'duplicate JSON key ' + key);
        owner.keys.add(key);
      }
    }
    return { data, body: raw.slice(match[0].length) };
  }
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
  if (fmLines.slice(next).some(line => line.t.trim() && !line.t.trim().startsWith('#'))) throw err('SCHEMA_INVALID', 'unparsed frontmatter');
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
  if (s.startsWith('"')) return JSON.parse(s);
  if (s.startsWith("'")) {
    if (!s.endsWith("'")) throw err('SCHEMA_INVALID', 'unclosed scalar');
    return s.slice(1, -1).replace(/''/g, "'");
  }
  if (/^[|>{[!&*]/.test(s)) throw err('SCHEMA_INVALID', 'unsupported YAML scalar; use JSON frontmatter');
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
