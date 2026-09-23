// Optional browser suite: install Playwright separately, or set PLAYWRIGHT_MODULE.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = resolve(fileURLToPath(new URL('../../', import.meta.url)));
const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const file = resolve(root, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
  if (!file.startsWith(root + sep) && file !== root) { response.writeHead(403).end(); return; }
  try {
    const data = await readFile(file);
    response.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' })[extname(file)] || 'application/octet-stream');
    response.end(data);
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
const errors = [];
try {
  browser = await chromium.launch({headless:true, ...(process.env.BROWSER_CHANNEL ? {channel:process.env.BROWSER_CHANNEL}: {})});
  for (const mobile of [false,true]) {
    const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:900},isMobile:mobile,hasTouch:mobile,reducedMotion:'reduce'});
    const page=await context.newPage();
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    await page.addInitScript(()=>{Math.random=()=>0;});
    await page.clock.install(); await page.clock.pauseAt(new Date());
    await page.goto(`${base}/games/squirrel-snack-stack/`);
    const click=async id=>mobile?page.locator(id).tap():page.locator(id).click();
    assert.equal(await page.title(),'Squirrel Snack Stack · Game 003');
    assert.equal(await page.locator('audio,video').count(),0);
    if(process.env.SCREENSHOT_DIR){await mkdir(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:resolve(process.env.SCREENSHOT_DIR,`squirrel-${mobile?'mobile':'desktop'}.png`),fullPage:true});}
    await click('#start');await click('#left');await click('#left');
    await page.clock.runFor(4500);assert.ok(Number(await page.locator('#score').textContent())>0);
    assert.equal(await page.locator('#stack').evaluate(el=>getComputedStyle(el).animationName),'none');
    if(process.env.SCREENSHOT_DIR)await page.screenshot({path:resolve(process.env.SCREENSHOT_DIR,`squirrel-${mobile?'mobile':'desktop'}-playing.png`),fullPage:true});
    await click('#pause');const time=await page.locator('#time').textContent();await page.clock.runFor(3000);assert.equal(await page.locator('#time').textContent(),time);
    await click('#start');await page.clock.runFor(42000);
    assert.equal(await page.locator('#time').textContent(),'0s');assert.match(await page.locator('#card-copy').textContent(),/Highest combo/);
    const record=await page.locator('#record').textContent();assert.notEqual(record,'Personal best: 0');
    await click('#start');assert.equal(await page.locator('#score').textContent(),'0');await page.clock.runFor(10000);
    assert.equal(await page.locator('#misses').textContent(),'5 / 5');assert.ok(await page.locator('#overlay').isVisible());
    await page.reload();assert.equal(await page.locator('#record').textContent(),record);
    await click('#start');await page.keyboard.press('ArrowLeft');await page.keyboard.press('a');assert.match(await page.locator('#position').textContent(),/lane 1/);
    await page.keyboard.press('d');assert.match(await page.locator('#position').textContent(),/lane 2/);
    await page.keyboard.press('p');assert.ok(await page.locator('#overlay').isVisible());await page.keyboard.press('p');assert.ok(await page.locator('#overlay').isHidden());
    await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.ok(await page.locator('#overlay').isVisible());
    for(const size of [{width:320,height:568},{width:844,height:390}]){await page.setViewportSize(size);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.ok(await page.locator('#start').isVisible());}
    await context.close();console.log(`PASS ${mobile?'touch':'desktop'} scoring, combo, timer, misses, replay, storage, keyboard, pause, blur, reduced motion, responsive layout`);
  }
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{let i=0;Math.random=()=>[.99,.5][i++%2];Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage blocked');}});});
  await page.clock.install();await page.clock.pauseAt(new Date());
  await page.goto(`${base}/games/squirrel-snack-stack/reddit/dist/client/`);await page.locator('#start').click();await page.clock.runFor(4200);
  assert.ok(await page.locator('#quack').isVisible());assert.equal(await page.locator('#score').textContent(),'0');assert.equal(await page.locator('#misses').textContent(),'0 / 5');
  assert.deepEqual(errors,[]);console.log('PASS built Reddit assets, Quack Attack, unavailable storage, zero browser errors');
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
