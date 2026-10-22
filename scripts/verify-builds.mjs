import {readdir,writeFile,mkdir,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
for(const game of await readdir(resolve(root,'games'))){
 const dir=game==='chicken-crossing'?root:resolve(root,'games',game,'reddit');
 const script=game==='chicken-crossing'?'reddit/build.mjs':`games/${game}/reddit/build.mjs`;
 const marker=resolve(dir,'dist/client/stale-audit-marker.txt');
 await mkdir(dirname(marker),{recursive:true});await writeFile(marker,'stale');
 const run=spawnSync(process.execPath,[script],{cwd:root,encoding:'utf8',windowsHide:true});
 if(run.status!==0)throw Error(game+': '+run.stderr+run.stdout);
 if(await stat(marker).then(()=>true,()=>false))throw Error(game+': stale output survived');
 let bytes=0;
 for(const f of await readdir(resolve(dir,'dist/client')))bytes+=(await stat(resolve(dir,'dist/client',f))).size;
 console.log(`${game}: client ${bytes} bytes; server ${(await stat(resolve(dir,'dist/server/index.cjs'))).size} bytes; stale output removed`);
}
