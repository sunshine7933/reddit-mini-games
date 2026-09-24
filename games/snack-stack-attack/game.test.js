import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, step, drop, rank } from './engine.js';
test('centered drops, bonuses, guaranteed pickle, increasing difficulty and input cooldown',()=>{
 const g=createGame(); const initial=g.food.width;
 for(let i=0;i<11;i++){g.food.x=50;const result=drop(g);assert.equal(result,'perfect');assert.equal(drop(g),null);if(i===3)assert.equal(g.food.kind,4);step(g,.2);}
 assert.equal(g.score,33);assert.equal(g.perfects,11);assert.ok(g.food.width<initial);assert.equal(g.stack.length,11);
});
test('off-center supported drop scores one; unsupported pickle ends round without points',()=>{
 const g=createGame();g.food.x=60;assert.equal(drop(g),'stack');assert.equal(g.score,1);step(g,.2);g.food.kind=4;g.food.x=0;assert.equal(drop(g),'splat');assert.match(g.reason,/pickle/);assert.equal(g.score,1);assert.equal(drop(g),null);
});
test('round expires in real elapsed time, including slow frames; no post-timeout scoring',()=>{
 const g=createGame();step(g,29);assert.equal(g.time,1);step(g,3);assert.equal(g.time,0);assert.ok(g.over);assert.equal(drop(g),null);assert.equal(g.score,0);
});
test('bounce stays within walls, invalid deltas ignored, fresh replay resets',()=>{
 const g=createGame();step(g,NaN);step(g,-1);assert.equal(g.time,30);
 for(let i=0;i<290;i++){step(g,.1);assert.ok(g.food.x>=g.food.width/2 && g.food.x<=100-g.food.width/2);}
 assert.deepEqual(createGame(),createGame());assert.equal(rank(50),'Certified Snack Architect');
});
