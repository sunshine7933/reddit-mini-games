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
try{browser=await chromium.launch({channel:'msedge',headless:true});for(const width of [390,1280]){
const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.clock.install();await page.goto('http://127.0.0.1:'+server.address().port+'/games/sock-monster-showdown/index.html');
await page.locator('#start').click();assert.equal(await page.locator('.card').count(),10);
await page.locator('[data-id="0-0"]').click();await page.locator('[data-id="0-1"]').click();assert.equal(await page.locator('#score').textContent(),'100');
await page.locator('#pause').click();const time=await page.locator('#time').textContent();await page.clock.runFor(3000);assert.equal(await page.locator('#time').textContent(),time);
await page.locator('#pause').click();await page.clock.runFor(31000);assert.equal(await page.locator('#start').isVisible(),true);assert.match(await page.locator('#message').textContent(),/pairs rescued/);
await page.locator('#start').click();assert.equal(await page.locator('#score').textContent(),'0');
assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);await page.close();console.log('Browser passed at width '+width);}
}finally{await browser?.close();server.close();}
