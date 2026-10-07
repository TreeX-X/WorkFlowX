// Note: v2 conformance and corpus coverage — see .agents/notes/harness/maintained-documents.md
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateNote, parseNote, taskContractHash, inputDigest, sha256, checkCorpus } from './lib/note-v2.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const std=join(root,'standards/harness-note/2');
const manifest=JSON.parse(readFileSync(join(std,'manifest.json'),'utf8'));
const errors=[];
if(manifest.schema!=='harness-note/2'||manifest.version!=='2.0.0') errors.push('unexpected standard identity');
for(const file of manifest.files){
  const path=join(std,file);
  if(!existsSync(path)){errors.push('missing bundle file '+file);continue;}
  if((file.startsWith('templates/')||file.startsWith('fixtures/'))&&file.endsWith('.md')){
    const result=validateNote(readFileSync(path,'utf8'));
    if(file.includes('/invalid-')){if(!result.errors.length)errors.push(file+': invalid fixture accepted');}
    else errors.push(...result.errors.map(e=>file+': '+e));
  }
}
const expected=JSON.parse(readFileSync(join(std,'fixtures/expected-hashes.json'),'utf8'));
for(const row of expected){
  const note=parseNote(readFileSync(join(std,row.path),'utf8'));
  const hash=row.kind==='task'?taskContractHash(note):inputDigest(note);
  if(hash!==row.sha256)errors.push(row.path+': hash lock mismatch');
}
const profile=JSON.parse(readFileSync(join(root,'.agents/harness.json'),'utf8')).profile;
if(profile?.version!==manifest.version||profile?.digest!==sha256(readFileSync(join(std,'manifest.json'),'utf8').replace(/\r\n/g,'\n'))) errors.push('own profile mismatch');
const repoIndex=process.argv.indexOf('--repo');
if(repoIndex>=0){
  if(!process.argv[repoIndex+1])throw new Error('--repo requires a path');
  const repo=resolve(process.argv[repoIndex+1]);
  const inventoryPath=join(repo,'docs/migrations/note-v2.json');
  const inventory=existsSync(inventoryPath)?JSON.parse(readFileSync(inventoryPath,'utf8')):null;
  const deferred=new Map((inventory?.deferred??[]).map(r=>[r.path,r.sha256]));
  const result=checkCorpus(repo,{deferred});
  errors.push(...result.errors);
  console.log(`Corpus: ${result.entries.length} v2 documents checked; ${result.excluded.length} protected sources excluded (not validated).`);
  for(const p of result.excluded)console.log('DEFERRED '+p);
  for(const w of result.warnings)console.log('UNRESOLVED '+w);
  if(inventory){
    const current=new Set(result.entries.map(e=>e.path));
    for(const row of inventory.sources){
      if(row.target&&!current.has(row.target))errors.push('migration target missing: '+row.target);
      if(row.source!==row.target&&existsSync(join(repo,row.source)))errors.push('old migrated path remains: '+row.source);
    }
  }
}
for(const error of errors)console.error('FAIL '+error);
console.log(errors.length?`${errors.length} failures`:'PASS v2 format/hash/profile checks (runtime adoption is separate)');
process.exitCode=errors.length?1:0;
