import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './app.js';
test('moderator endpoint creates correct game and returns navigation; handles errors', async () => {
  let fail=false;
  const app=createApp({submitCustomPost:async options=>{
    assert.match(options.title,/Snack Stack Attack/);assert.equal(options.entry,'default');
    if(fail)throw new Error('Test unavailable');return {url:'https://www.reddit.com/r/test/comments/example'};
  }});
  const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));
  const url=`http://127.0.0.1:${server.address().port}/internal/menu/create-post`;
  try {
    let response=await fetch(url,{method:'POST'});assert.equal(response.status,200);assert.match((await response.json()).navigateTo,/example/);
    fail=true;response=await fetch(url,{method:'POST'});assert.equal(response.status,500);assert.match((await response.json()).showToast,/try again/);
  } finally {await new Promise(resolve=>server.close(resolve));}
});
