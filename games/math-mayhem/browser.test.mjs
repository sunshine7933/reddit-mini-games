import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root=resolve('.');
const server=createServer(async(req,res)=>{try{const path=resolve(root,'.'+new URL(req.url,'http://localhost').pathname);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[extname(path)]||'text/plain');res.end(await readFile(path));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try {
  browser=await chromium.launch({channel:'msedge',headless:true});
  for(const width of [320,390,1280]) {
    const page=await browser.newPage({viewport:{width,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.clock.install();await page.goto(`http://127.0.0.1:${server.address().port}/games/math-mayhem/index.html`);
    await page.selectOption('#difficulty','hard');await page.click('#start');
    assert.equal(await page.locator('#answer').getAttribute('inputmode'),'numeric');
    for(let i=0;i<5;i++) {
      const text=await page.locator('#problem').textContent(); const [a,op,b]=text.split(' ');const n=op==='+'?+a + +b:op==='−'?+a - +b:op==='×'?+a * +b:+a / +b;
      await page.fill('#answer',String(n));await page.press('#answer','Enter');
    }
    assert.equal(await page.locator('#score').textContent(),'750');
    await page.fill('#answer','999999');await page.click('button[type="submit"]');assert.equal(await page.locator('#streak').textContent(),'0');
    await page.fill('#answer','1.2');await page.press('#answer','Enter');assert.match(await page.locator('#feedback').textContent(),/whole number/);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.clock.runFor(60000);assert.equal(await page.locator('#results').isVisible(),true);assert.match(await page.locator('#final-score').textContent(),/750/);
    await page.click('#replay');assert.equal(await page.locator('#score').textContent(),'0');assert.equal(await page.locator('#time').textContent(),'60s');
    await page.clock.runFor(60000);await page.click('#change');assert.equal(await page.locator('#setup').isVisible(),true);
    assert.deepEqual(errors,[]);await page.close();console.log(`Browser passed at ${width}px`);
  }
} finally {await browser?.close();server.close();}
