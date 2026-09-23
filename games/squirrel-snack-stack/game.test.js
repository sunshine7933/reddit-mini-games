import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, move, step, rank } from './engine.js';
const item = (game, kind, lane = game.lane) => { game.items.push({ id: game.nextId++, kind, lane, y: 77.9 }); };
test('movement respects both edges', () => {
  const game = createGame(); for (let i=0;i<10;i++) move(game, -1); assert.equal(game.lane,0);
  for (let i=0;i<10;i++) move(game,1); assert.equal(game.lane,4);
});
test('food values, combo tiers, cap, and bounded visible stack', () => {
  const game = createGame(); game.spawn=100;
  for (let i=0;i<21;i++) { item(game,0); step(game,.01); }
  assert.equal(game.score,540); assert.equal(game.bestCombo,21); assert.equal(game.stack.length,8);
  item(game,1); step(game,.01); assert.equal(game.score,620);
  item(game,2); step(game,.01); assert.equal(game.score,740);
});
test('miss resets combo, retains best, fifth miss stops scoring', () => {
  const game=createGame(); game.spawn=100;
  item(game,0); step(game,.01);
  for(let i=0;i<5;i++){item(game,0,0);step(game,.01);}
  assert.equal(game.combo,0); assert.equal(game.bestCombo,1); assert.equal(game.over,true);
  item(game,2); step(game,.1); assert.equal(game.score,10);
});
test('duck wobbles briefly without points or combo penalty; missed ducks are free', () => {
  const game=createGame();game.spawn=100;game.combo=6;
  item(game,3);step(game,.01);assert.equal(game.quack,2);assert.equal(game.combo,6);assert.equal(game.score,0);
  item(game,3,0);step(game,.01);assert.equal(game.misses,0);
  for(let i=0;i<21;i++)step(game,.1);assert.equal(game.quack,0);
});
test('round expires, large deltas are bounded, replay state is fresh', () => {
  const game=createGame();game.spawn=100;step(game,100);assert.equal(game.time,44.9);
  game.time=.01;step(game,.1);assert.equal(game.time,0);assert.equal(game.over,true);
  assert.equal(createGame().time,45);assert.equal(createGame().score,0);
});
test('snack spawns use five lanes and each rank is reachable', () => {
  const game=createGame();game.spawn=0;step(game,.01,()=>.99);assert.equal(game.items[0].lane,4);assert.equal(game.items[0].kind,3);
  assert.deepEqual([0,250,550,900].map(rank),['Casual Nibbler','Snack Architect','Acorn Overlord','Certified Squirrel Menace']);
});
