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

    await page.clock.install(); await page.clock.pauseAt(new Date());
    await page.goto(base+'/games/snack-stack-attack/');
    const click=async id=>mobile?page.locator(id).tap():page.locator(id).click();
    assert.equal(await page.title(),'Snack Stack Attack · Game 004');
    assert.equal(await page.locator('audio,video').count(),0);
    await click('#start');
    await page.clock.runFor(816); // First food travels from x=19 to approximately center.
    if(mobile)await click('#drop');else await page.keyboard.press('Space');
    assert.equal(await page.locator('#score').textContent(),'3');
    assert.equal(await page.locator('#height').textContent(),'1');
    assert.equal(await page.locator('.food.new').evaluate(el=>getComputedStyle(el).animationName),'none');
    if(process.env.SCREENSHOT_DIR){await mkdir(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:resolve(process.env.SCREENSHOT_DIR,'snack-'+(mobile?'mobile':'desktop')+'.png'),fullPage:true});}
    await click('#pause');const time=await page.locator('#time').textContent();await page.clock.runFor(3000);assert.equal(await page.locator('#time').textContent(),time);
    await click('#start');await page.clock.runFor(30000);
    assert.equal(await page.locator('#time').textContent(),'0s');assert.match(await page.locator('#card-copy').textContent(),/3 points/);
    const record=await page.locator('#record').textContent();assert.equal(record,'Personal best: 3');
    await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('Denied')}}}));
    await click('#share');assert.match(await page.locator('#share-copy').inputValue(),/3.*Snack Stack Attack/);
    await click('#start');assert.equal(await page.locator('#score').textContent(),'0');
    await page.clock.runFor(10);await click('#drop');assert.ok(await page.locator('#overlay').isVisible());assert.match(await page.locator('#card-copy').textContent(),/left the building/);
    await page.reload();assert.equal(await page.locator('#record').textContent(),record);
    await click('#start');await page.keyboard.press('p');assert.ok(await page.locator('#overlay').isVisible());await page.keyboard.press('p');assert.ok(await page.locator('#overlay').isHidden());
    await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.ok(await page.locator('#overlay').isVisible());
    for(const size of [{width:320,height:568},{width:844,height:390}]){await page.setViewportSize(size);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.ok(await page.locator('#start').isVisible());}
    await context.close();console.log('PASS '+(mobile?'touch':'desktop')+' score, timer, replay, storage, keyboard, pause, blur, reduced motion, responsive layout, share fallback');
  }
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));

  await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw Error('Storage blocked');}});});
  await page.clock.install();await page.clock.pauseAt(new Date());
  await page.goto(base+'/games/snack-stack-attack/reddit/dist/client/');await page.locator('#start').click();await page.clock.runFor(816);await page.keyboard.press('Enter');
  assert.equal(await page.locator('#score').textContent(),'3');await page.clock.runFor(30000);assert.ok(await page.locator('#overlay').isVisible());await page.locator('#start').click();
  assert.deepEqual(errors,[]);console.log('PASS built Reddit assets, unavailable storage, Enter control, zero browser errors');
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
