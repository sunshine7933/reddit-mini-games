import { mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
const path = relative => fileURLToPath(new URL(relative, import.meta.url));
await mkdir(path('dist/client'), { recursive: true });
await mkdir(path('dist/server'), { recursive: true });
for (const file of ['index.html', 'style.css', 'game.js', 'engine.js']) {
  await copyFile(path(`../${file}`), path(`dist/client/${file}`));
}
await copyFile(path('splash.html'), path('dist/client/splash.html'));
// Reuse the existing proven launch handler without modifying Chicken Crossing.
await build({ entryPoints: [path('../../../reddit/splash.js')], outfile: path('dist/client/splash.js'), bundle: true, format: 'iife', platform: 'browser', minify: true });
await build({ entryPoints: [path('server.js')], outfile: path('dist/server/index.cjs'), bundle: true, format: 'cjs', platform: 'node', target: 'node22' });
console.log('Built Snack Stack Attack in its separate Reddit app directory.');
