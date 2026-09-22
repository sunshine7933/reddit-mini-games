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
  browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
  for (const mobile of [false, true]) {
    const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 }, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.addInitScript(() => { Math.random = () => 0; });
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-01-01T00:00:00Z'));
    await page.goto(`${base}/games/pigeon-pizza-panic/`);
    assert.equal(await page.title(), 'Pigeon Pizza Panic · Game 002');
    const click = async locator => mobile ? locator.tap() : locator.click();
    assert.equal(await page.locator('#start').textContent(), 'Let’s save lunch!');
    assert.equal(await page.locator('audio,video').count(), 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (process.env.SCREENSHOT_DIR) {
      await mkdir(process.env.SCREENSHOT_DIR, { recursive: true });
      await page.screenshot({ path: resolve(process.env.SCREENSHOT_DIR, mobile ? 'pigeon-mobile.png' : 'pigeon-desktop.png'), fullPage: true });
    }
    await click(page.locator('#start'));
    await page.clock.runFor(200);
    if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: resolve(process.env.SCREENSHOT_DIR, mobile ? 'pigeon-mobile-playing.png' : 'pigeon-desktop-playing.png'), fullPage: true });
    await click(page.locator('[data-kind="pigeon"]').first());
    assert.equal(await page.locator('#score').textContent(), '10');
    await click(page.locator('#pause'));
    const time = await page.locator('#time').textContent();
    await page.clock.runFor(3000);
    assert.equal(await page.locator('#time').textContent(), time);
    assert.equal(await page.locator('#card-title').textContent(), 'Hold that coo.');
    await click(page.locator('#start'));
    for (let frame = 0; frame < 100 && await page.locator('#overlay').isHidden(); frame++) {
      await page.clock.runFor(500);
      for (const target of await page.locator('[data-kind="pigeon"]').all()) await click(target);
    }
    assert.equal(await page.locator('#card-title').textContent(), 'Crust we can trust.');
    assert.equal(await page.locator('#time').textContent(), '0s');
    assert.equal(await page.locator('#slices').textContent(), '5 / 5');
    const best = await page.locator('#combo').textContent();
    await click(page.locator('#start'));
    assert.equal(await page.locator('#score').textContent(), '0');
    assert.equal(await page.locator('#time').textContent(), '45s');
    for (let frame = 0; frame < 60 && await page.locator('#overlay').isHidden(); frame++) await page.clock.runFor(500);
    assert.equal(await page.locator('#card-title').textContent(), 'Coo. There it went.');
    assert.equal(await page.locator('#slices').textContent(), '0 / 5');
    await page.reload();
    assert.equal(await page.locator('#combo').textContent(), best);
    await click(page.locator('#start')); await page.clock.runFor(200);
    await page.keyboard.press('1'); assert.equal(await page.locator('#score').textContent(), '10');
    await page.keyboard.press('p'); assert.equal(await page.locator('#card-title').textContent(), 'Hold that coo.');
    await page.keyboard.press('p'); assert.ok(await page.locator('#overlay').isHidden());
    await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    assert.ok(await page.locator('#overlay').isVisible());
    for (const size of [{ width: 320, height: 568 }, { width: 844, height: 390 }]) {
      await page.setViewportSize(size);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.ok(await page.locator('#start').isVisible());
    }
    console.log(`PASS ${mobile ? 'mobile touch' : 'desktop mouse'}: scoring, pause, victory, defeat, replay, storage, keyboard, blur, responsive layout`);
    await context.close();
  }
  // Exercise cat and pizza via real buttons, with deterministic random spawns.
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => { let i = 0; const sequence = [0, .8, 0, .95]; Math.random = () => sequence[i++ % sequence.length]; });
  await page.clock.install(); await page.clock.pauseAt(new Date());
  await page.goto(`${base}/games/pigeon-pizza-panic/reddit/dist/client/`);
  await page.locator('#start').click(); await page.clock.runFor(200);
  await page.locator('[data-kind="cat"]').click(); assert.equal(await page.locator('#slices').textContent(), '4 / 5');
  await page.clock.runFor(1000); await page.locator('[data-kind="pizza"]').click();
  assert.equal(await page.locator('#slices').textContent(), '5 / 5'); assert.equal(await page.locator('#score').textContent(), '25');
  await context.close();
  assert.deepEqual(errors, []);
  console.log('PASS built Reddit game assets, cat penalty, pizza bonus, and zero browser errors');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
