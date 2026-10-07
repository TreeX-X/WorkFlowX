// WorkflowX's existing public skill names intentionally retain their X suffix.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from './lib/frontmatter.mjs';
import { markdownLinks } from './lib/note-v2.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const managed=JSON.parse(readFileSync(join(root,'scripts/sync-managed.json'),'utf8'));
const errors=[], checked=new Set();
for(const pair of managed.pairs)for(const rel of [pair.a,pair.b]){
 if(!rel.endsWith('/SKILL.md'))continue;
 const folder=dirname(join(root,rel)),expected=basename(folder);
 const parsed=parseFrontmatter(readFileSync(join(root,rel),'utf8'));
 if(parsed.data.name!==expected||typeof parsed.data.description!=='string'||!parsed.data.description.trim())errors.push(rel+': invalid discovery metadata');
 const walk=dir=>{for(const e of readdirSync(dir,{withFileTypes:true})){
  const p=join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.md')&&!checked.has(p)){
   checked.add(p);const text=readFileSync(p,'utf8');
   for(const dest of markdownLinks(text))if(!dest.startsWith('#')&&!/^[a-z][a-z0-9+.-]*:/i.test(dest)&&!existsSync(resolve(dirname(p),dest.split('#')[0])))errors.push(p+': missing resource '+dest);
  }
 }};walk(folder);
}
for(const error of errors)console.error('FAIL '+error);
console.log(errors.length?`${errors.length} skill errors`:`PASS ${checked.size} WorkflowX skill resources and existing-name metadata`);
process.exitCode=errors.length?1:0;
