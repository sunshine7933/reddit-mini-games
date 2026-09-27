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

    await page.clock.install({time: new Date("2030-01-01T00:00:00Z")}); await page.clock.pauseAt(new Date("2030-01-01T00:01:00Z"));
    await page.goto(base+'/games/bee-late/');
    const click=async selector=>mobile?page.locator(selector).tap():page.locator(selector).click();
    assert.equal(await page.title(),'Bee Late! · Game 005');
    assert.equal(await page.locator('audio,video').count(),0);
    await click('#start');
    const flower=await page.locator('[data-kind="flower"]').getAttribute('id');
    if(mobile) await click('#'+flower); else await page.keyboard.press(String(Number(flower.at(-1))+1));
    assert.equal(await page.locator('#score').textContent(),'5');
    await page.clock.runFor(320);
    if(process.env.SCREENSHOT_DIR){await mkdir(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:resolve(process.env.SCREENSHOT_DIR,'bee-'+(mobile?'mobile':'desktop')+'.png'),fullPage:true});}
    assert.equal(await page.locator('.meter').evaluate(el=>getComputedStyle(el).visibility),'hidden');
    await click('#pause'); const time=await page.locator('#time').textContent(); await page.clock.runFor(3000);assert.equal(await page.locator('#time').textContent(),time);
    await click('#start');await page.clock.runFor(30100);assert.equal(await page.locator('#time').textContent(),'0s');
    assert.equal(await page.locator('#record').textContent(),'Personal best: 5');
    await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('Denied')}}}));
    await click('#share');assert.match(await page.locator('#share-copy').inputValue(),/5.*Bee Late/);
    await click('#start');assert.equal(await page.locator('#score').textContent(),'0');assert.equal(await page.locator('#hearts').textContent(),'3');
    for(let i=0;i<3;i++){await click('[data-kind="meeting"]');await page.clock.runFor(320);}
    assert.ok(await page.locator('#overlay').isVisible());assert.match(await page.locator('#card-copy').textContent(),/Three meetings/);
    await page.reload();assert.equal(await page.locator('#record').textContent(),'Personal best: 5');
    await click('#start');await page.keyboard.press('p');assert.ok(await page.locator('#overlay').isVisible());await page.keyboard.press('p');assert.ok(await page.locator('#overlay').isHidden());
    await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.ok(await page.locator('#overlay').isVisible());
    for(const size of [{width:320,height:568},{width:844,height:390}]){await page.setViewportSize(size);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.ok(await page.locator('#start').isVisible());}
    await context.close();console.log('PASS '+(mobile?'touch':'desktop')+' scoring, timer, replay, storage, keyboard, pause, blur, reduced motion, responsive layout, share fallback');
  }
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw Error('Storage blocked');}});});
  await page.clock.install({time: new Date("2030-01-01T00:00:00Z")});await page.clock.pauseAt(new Date("2030-01-01T00:01:00Z"));
  await page.goto(base+'/games/bee-late/reddit/dist/client/');await page.locator('#start').click();await page.locator('[data-kind="flower"]').click();
  assert.equal(await page.locator('#score').textContent(),'5');await page.clock.runFor(30100);assert.ok(await page.locator('#overlay').isVisible());await page.locator('#start').click();
  assert.deepEqual(errors,[]);console.log('PASS built Reddit assets, unavailable storage, zero browser errors');
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
