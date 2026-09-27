import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, choose, step, rank } from './engine.js';
const pick = (g, kind) => choose(g, g.lanes.indexOf(kind));
test('each commute offers exactly one of each choice', () => {
  for (let i=0;i<100;i++) assert.deepEqual([...createGame().lanes].sort(), ['cloud','flower','meeting']);
});
test('flowers score, fifth streak bonuses and duplicate inputs are ignored', () => {
  const g=createGame();
  for(let i=0;i<5;i++) { pick(g,'flower'); assert.equal(pick(g,'flower'),null); step(g,0.31); }
  assert.equal(g.score,35); assert.equal(g.flowers,5); assert.equal(g.combo,5);
});
test('clouds break streak without using excuses; meetings end the round', () => {
  const g=createGame(); pick(g,'flower'); step(g,.31); pick(g,'cloud'); assert.equal(g.combo,0); assert.equal(g.hearts,3); step(g,.31);
  for(let i=0;i<3;i++) { pick(g,'meeting'); step(g,.31); }
  assert.equal(g.over,true); assert.equal(g.hearts,0); const score=g.score; assert.equal(pick(g,'flower'),null); assert.equal(g.score,score);
});
test('missed flower clears combo and long frames respect full round time', () => {
  const g=createGame(); pick(g,'flower'); step(g,2.2); assert.equal(g.combo,0); step(g,100); assert.equal(g.time,0); assert.equal(g.over,true);
});
test('invalid inputs do not mutate the round; rows remain playable', () => {
  const g=createGame(); const before=JSON.stringify(g);
  for(const lane of [-1,3,NaN,0.5]) assert.equal(choose(g,lane),null);
  for(const dt of [-1,0,NaN,Infinity]) step(g,dt);
  assert.equal(JSON.stringify(g),before);
  for(let i=0;i<20;i++){pick(g,'flower');step(g,.31);assert.ok(g.remaining>0);assert.ok(g.window>=.9);}
  assert.equal(rank(100),'Employee of the Flower');
});
