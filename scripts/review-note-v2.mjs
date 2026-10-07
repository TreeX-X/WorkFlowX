// Review regressions: expected behavior, not the implementation's current output.
// See docs/reviews/workflowx-v2.md. This command fails until the findings are fixed.
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, sep, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { parseNote, taskContractHash, canonical, markdownLinks } from './lib/note-v2.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const raw=readFileSync(join(root,'standards/harness-note/2/fixtures/valid-task.md'),'utf8');
let failures=0;
function check(name,pass,detail){console.log(`${pass?'PASS':'FAIL'} ${name}: ${detail}`);if(!pass)failures++;}
const a=parseNote(raw),b=parseNote(raw);
a.meta.work.verification[0].args=['- [x] expected literal'];
b.meta.work.verification[0].args=['- [ ] expected literal'];
check('verification arguments remain exact',taskContractHash(a)!==taskContractHash(b),'different command arguments must change taskContractHash');
const titleA=parseNote(raw.replace('# Delivery task','# Handle `alpha`'));
const titleB=parseNote(raw.replace('# Delivery task','# Handle `beta`'));
check('inline-code title participates in contract',taskContractHash(titleA)!==taskContractHash(titleB),'alpha and beta titles must remain different');
check('canonical keys use specified Unicode code-point order',canonical({'\u{10000}':1,'\uE000':2})==='{"\uE000":2,"\u{10000}":1}','U+E000 precedes U+10000');
check('balanced Markdown destination is preserved',JSON.stringify(markdownLinks('[guide](guide(v2).md)'))===JSON.stringify(['guide(v2).md']),'guide(v2).md must resolve without truncation');
const dir=mkdtempSync(join(tmpdir(),'wfx-review-sync-'));
try{
 mkdirSync(join(dir,'.codex/agents'),{recursive:true});mkdirSync(join(dir,'.agents'));
 mkdirSync(join(dir,'.claude/agents'),{recursive:true});
 writeFileSync(join(dir,'.agents/harness.json'),readFileSync(join(root,'.agents/harness.json')));
 writeFileSync(join(dir,'.claude/agents/coder-teammate.md'),'OLD TEAM RULE: subagent writes Task completion');
 const list=join(dir,'repos.list');writeFileSync(list,dir);
 const result=spawnSync(process.execPath,['scripts/sync-harness-rules.mjs','--apply','--repos',list],{cwd:root,encoding:'utf8'});
 const actual=readFileSync(join(dir,'.claude/agents/coder-teammate.md'),'utf8').replace(/\r\n/g,'\n');
 const expected=readFileSync(join(root,'.claude/agents/coder-teammate.md'),'utf8').replace(/\r\n/g,'\n');
 check('teammate rule joins managed distribution',result.status===0&&actual===expected,`sync exit ${result.status}; stale teammate rules must not survive successful sync`);
}finally{
 const target=resolve(dir),base=resolve(tmpdir());
 if(!target.startsWith(base+sep)||!basename(target).startsWith('wfx-review-sync-'))throw new Error('unsafe temporary cleanup');
 rmSync(target,{recursive:true,force:true});
}
console.log(`${failures} review regression failures`);
process.exitCode=failures?1:0;
