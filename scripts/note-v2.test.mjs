import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { validateNote, parseNote, taskContractHash, inputDigest, markdownLinks, checkCorpus, sha256 } from './lib/note-v2.mjs';
const read=kind=>readFileSync(`standards/harness-note/2/fixtures/valid-${kind}.md`,'utf8');
const encode=(meta,body)=>'---\n'+JSON.stringify(meta,null,2)+'\n---\n\n'+body;
test('handoff and maintenance preserve contract; scope and review changes do not',()=>{
  const raw=read('task'), note=parseNote(raw), hash=taskContractHash(note);
  for(const variant of [raw.replace('2026-10-07T00:00:00Z','2026-10-08T01:02:03Z'),raw.replace('## Progress\n','## Progress\n\nVerified first check; second is pending.\n'),raw.replace('## Handoff\n','## Handoff\n\nNext agent inspects the unresolved parser case.\n')])assert.equal(taskContractHash(parseNote(variant)),hash);
  for(const variant of [raw.replace('"independent"','"self"'),raw.replace('"src/"','"other/"'),raw.replace('bounded deliverable','expanded deliverable')])assert.notEqual(taskContractHash(parseNote(variant)),hash);
});
test('input digest separates raw freshness from time and checkbox changes',()=>{
 const raw=read('requirement'), next=raw.replace('2026-10-07T00:00:00Z','2026-10-08T01:02:03Z').replace('- [ ] AC-1','- [x] AC-1');
 assert.notEqual(sha256(raw),sha256(next));assert.equal(inputDigest(parseNote(raw)),inputDigest(parseNote(next)));
 assert.notEqual(inputDigest(parseNote(raw)),inputDigest(parseNote(raw.replace('verifiable outcome','different outcome'))));
});
test('malformed shape, impossible time, wrong kind fields and duplicate clauses fail',()=>{
 const module=read('module');
 for(const raw of [module.replace('2026-10-07T00:00:00Z','2026-02-30T00:00:00Z'),module.replace('"planned"','"invented"'),module.replace('"moduleState"','"unknown"'),read('task').replace('"review": "independent"','"review": "skip"'),read('requirement')+'\n- [ ] AC-1: Duplicate\n'])assert.ok(validateNote(raw).errors.length,raw);
});
test('Idea can convert identity to Requirement with a valid new body',()=>{
 const idea=parseNote(read('idea')), req=parseNote(read('requirement'));
 const next=encode({...idea.meta,kind:'requirement',updated:'2026-10-08T00:00:00Z'},req.body);
 const result=validateNote(next);assert.deepEqual(result.errors,[]);assert.equal(result.note.meta.id,idea.meta.id);
});
test('invalid nested data and duplicate JSON keys are diagnostics, not crashes or last-wins',()=>{
 const raw=read('module');
 for(const variant of [raw.replace('"moduleState": "planned"','"moduleState": "planned", "interfaces": null'),raw.replace('"kind": "module"','"kind": "idea", "kind": "module"'),read('task').replace('"work": {','"work": { "scope": null,')])assert.ok(validateNote(variant).errors.length);
});
test('wiki links include references and autolinks, exclude examples and bare URIs',()=>{
 const body='[a](a.md) [b][target] [target]\n[target]: b.md\n<note://a/b>\nnote://bare/id\n`[code](bad.md)`\n~~~md\n[example](bad2.md)\n~~~\n    [indented](bad3.md)';
 assert.deepEqual(new Set(markdownLinks(body)),new Set(['a.md','b.md','note://a/b']));
});
test('fresh checkout resolves module hierarchy, task acceptance and handoff without local logs',()=>{
 const root=mkdtempSync(join(tmpdir(),'wfx-v2-'));
 try{
  mkdirSync(join(root,'.agents/notes'),{recursive:true});writeFileSync(join(root,'.agents/harness.json'),JSON.stringify({repoId:'11111111-1111-4111-8111-111111111111'}));
  for(const kind of ['module','requirement','task'])writeFileSync(join(root,'.agents/notes',kind+'.md'),read(kind));
  let result=checkCorpus(root);assert.deepEqual(result.errors,[]);assert.equal(result.entries.length,3);
  const task=result.entries.find(e=>e.meta.kind==='task');assert.ok(task.sections.Handoff);assert.ok(task.sections.Evidence);
  const reqPath=join(root,'.agents/notes/requirement.md');
  writeFileSync(reqPath,read('requirement').replace('AC-1:','AC-2:'));
  assert.ok(checkCorpus(root).errors.some(e=>e.includes('missing AC-1')));
  writeFileSync(reqPath,read('requirement'));
  mkdirSync(join(root,'.agents/notes/child'));writeFileSync(join(root,'.agents/notes/child/module.md'),read('module'));
  result=checkCorpus(root);assert.ok(result.errors.some(e=>e.includes('duplicate UUID')));assert.ok(result.errors.some(e=>e.includes('parent disagrees')));
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('explicit protected legacy source is excluded, changed bytes cannot bypass checks',()=>{
 const root=mkdtempSync(join(tmpdir(),'wfx-v2-'));
 try{
  mkdirSync(join(root,'.agents/notes'),{recursive:true});writeFileSync(join(root,'.agents/harness.json'),JSON.stringify({repoId:'11111111-1111-4111-8111-111111111111'}));
  writeFileSync(join(root,'.agents/notes/module.md'),read('module'));
  const file='.agents/notes/user-draft.md';writeFileSync(join(root,file),'unrelated original');
  const deferred=new Map([[file,sha256('unrelated original')]]);
  assert.deepEqual(checkCorpus(root,{deferred}).errors,[]);
  writeFileSync(join(root,file),'changed');assert.ok(checkCorpus(root,{deferred}).errors.some(e=>e.includes('deferred source changed')));
  rmSync(join(root,file));assert.deepEqual(checkCorpus(root,{deferred}).errors,[]);
 }finally{rmSync(root,{recursive:true,force:true});}
});
