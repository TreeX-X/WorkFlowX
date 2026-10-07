// Note: versioned conformance — see .agents/notes/harness/maintained-documents.md
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const dir=dirname(fileURLToPath(import.meta.url));
for(const [script,args] of [['verify-harness-v1.mjs',[]],['verify-note-v2.mjs',process.argv.slice(2)]]){
 const result=spawnSync(process.execPath,[join(dir,script),...args],{stdio:'inherit'});
 if(result.error)throw result.error;
 if(result.status!==0)process.exit(result.status??1);
}
