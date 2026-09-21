import {mkdir, copyFile, readFile, writeFile} from 'node:fs/promises';
import {build} from 'esbuild';
await mkdir('dist/client', {recursive:true});
await mkdir('dist/server', {recursive:true});
for (const file of ['index.html','style.css','game.js']) {
  await copyFile(`games/chicken-crossing/${file}`, `dist/client/${file}`);
}
await copyFile('reddit/splash.html','dist/client/splash.html');
await copyFile('reddit/game.css','dist/client/reddit.css');
const gameHTML = await readFile('dist/client/index.html','utf8');
await writeFile('dist/client/index.html', gameHTML.replace('</head>', '<link rel="stylesheet" href="reddit.css">\n</head>'));
await build({entryPoints:['reddit/splash.js'],outfile:'dist/client/splash.js',bundle:true,format:'iife',platform:'browser',minify:true});
await build({entryPoints:['reddit/server.js'],outfile:'dist/server/index.cjs',bundle:true,format:'cjs',platform:'node',target:'node22'});
console.log('Built Reddit launch card, game and moderator post action.');
