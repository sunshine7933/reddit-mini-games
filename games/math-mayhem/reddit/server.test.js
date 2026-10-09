import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './app.js';
test('moderator endpoint creates only a Math Mayhem post and handles failure', async () => {
  for(const fail of [false,true]) {
    let data;
    const server=createApp({submitCustomPost:async p=>{data=p;if(fail)throw Error('test');return {url:'https://reddit.com/test'};}}).listen(0,'127.0.0.1');
    await new Promise(r=>server.once('listening',r));
    try { const res=await fetch(`http://127.0.0.1:${server.address().port}/internal/menu/create-post`,{method:'POST'});assert.equal(res.status,fail?500:200);assert.match(data.title,/Math Mayhem/);assert.equal(data.entry,'default');assert.match(data.textFallback.text,/60 seconds/); }
    finally {await new Promise(r=>server.close(r));}
  }
});
