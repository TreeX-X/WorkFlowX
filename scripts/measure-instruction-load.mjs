// Compare declared reading paths, not model telemetry or exact tokenizer counts.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const inventory=JSON.parse(readFileSync(join(root,'docs/migrations/note-v2.json'),'utf8'));
const base=['AGENTS.md','.codex/skills/orchestrateX/SKILL.md','.codex/skills/engineeringX/SKILL.md'];
const doc=['.codex/skills/noteX/SKILL.md','.codex/skills/proseX/SKILL.md'];
const delegated=['.codex/agents/coderX.toml','.codex/skills/specX/SKILL.md','.codex/skills/orchestrateX/modules/02-bus-payload.md','.codex/skills/orchestrateX/modules/09-dispatch-adapter.md'];
const paths={
 'xdo-with-document-maintenance':[...base,...doc],
 'xdo-existing-task':[...base,...doc,'.codex/skills/orchestrateX/modules/02-bus-payload.md'],
 'xdel-dispatch':[...base,...doc,...delegated],
 'xflow-discovery-dispatch-review':[...base,...doc,...delegated,'.codex/skills/orchestrateX/modules/08-requirements-discovery.md','.codex/skills/socratesX/SKILL.md','.codex/agents/evaluatorX.toml','.codex/skills/auditX/SKILL.md'],
 'repair-payload-reference':['.codex/skills/orchestrateX/modules/02-bus-payload.md']
};
const normalize=text=>text.replace(/\r\n/g,'\n');
const rows=Object.entries(paths).map(([scenario,files])=>{
 let before=0,after=0;
 for(const p of new Set(files)){
  before+=Buffer.byteLength(normalize(execFileSync('git',['show',inventory.revision+':'+p],{cwd:root,encoding:'utf8'})));
  after+=Buffer.byteLength(normalize(readFileSync(join(root,p),'utf8')));
 }
 return {scenario,files:[...new Set(files)],beforeUtf8Bytes:before,afterUtf8Bytes:after,reductionPercent:Number(((1-after/before)*100).toFixed(1))};
});
const report={baseline:inventory.revision,measurement:'LF-normalized UTF-8 bytes of unique declared instruction files; excludes task/project content, platform system prompts and repeat imports across agents. Not measured runtime telemetry or exact token counts.',rows};
console.log(JSON.stringify(report,null,2));
const flag=process.argv.indexOf('--write');
if(flag>=0){
 const dest=resolve(root,process.argv[flag+1]??'docs/migrations/instruction-load.json');
 if(!dest.startsWith(join(root,'docs','migrations')+sep))throw new Error('report must stay in docs/migrations');
 mkdirSync(dirname(dest),{recursive:true});writeFileSync(dest,JSON.stringify(report,null,2)+'\n');
}
if(rows.some(r=>r.afterUtf8Bytes>=r.beforeUtf8Bytes))process.exitCode=1;
