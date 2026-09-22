import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame, startGame, advance, tap, togglePause, ROUND_MS } from './engine.js';
const target = kind => ({ kind, remaining: 100, lifetime: 100 });
test('ready and paused games cannot lose time, slices, or gain points', () => {
  const ready = newGame();
  advance(ready, 5000); tap(ready, 0);
  assert.equal(ready.elapsed, 0);
  const state = startGame(); state.cells[0] = target('pigeon');
  togglePause(state); advance(state, 5000); tap(state, 0);
  assert.equal(state.slices, 5); assert.equal(state.score, 0); assert.equal(state.elapsed, 0);
  togglePause(state); tap(state, 0); assert.equal(state.score, 10);
});
test('pigeons score only once, with capped streak bonus', () => {
  const state = startGame();
  for (let i = 0; i < 30; i++) { state.cells[0] = target('pigeon'); tap(state, 0); }
  assert.equal(state.shooed, 30); assert.equal(state.combo, 30);
  const before = state.score;
  state.cells[0] = target('pigeon'); tap(state, 0);
  assert.equal(state.score - before, 35);
  tap(state, 0); assert.equal(state.score, before + 35); assert.equal(state.combo, 0);
});
test('cats cost a slice and bonus pizza restores at most five', () => {
  const state = startGame(); state.cells[2] = target('cat'); tap(state, 2);
  assert.equal(state.slices, 4);
  for (let i = 0; i < 2; i++) { state.cells[2] = target('pizza'); tap(state, 2); }
  assert.equal(state.slices, 5); assert.equal(state.score, 50);
});
test('only expired pigeons steal slices; losing ends the round and disables taps', () => {
  const state = startGame(); state.cells[0] = target('cat'); state.cells[1] = target('pizza');
  advance(state, 101, () => 0); assert.equal(state.slices, 5);
  state.cells = Array.from({ length: 9 }, () => target('pigeon'));
  advance(state, 101); assert.equal(state.slices, 0); assert.equal(state.phase, 'over');
  assert.ok(state.cells.every(x => x === null));
  assert.equal(tap(state, 0), null);
});
test('surviving the clock finishes and restarting resets everything', () => {
  const state = startGame(); advance(state, ROUND_MS + 100);
  assert.equal(state.elapsed, ROUND_MS); assert.equal(state.phase, 'over'); assert.equal(state.slices, 5);
  const restart = startGame(); assert.equal(restart.elapsed, 0); assert.equal(restart.score, 0);
  assert.equal(restart.phase, 'playing'); assert.ok(restart.cells.every(x => x === null));
});
test('spawns fill free cells only, with increasing difficulty', () => {
  const state = startGame(); advance(state, 1, () => 0);
  assert.equal(state.cells[0].kind, 'pigeon');
  const early = state.cells[0].lifetime; state.elapsed = 30000; state.nextSpawn = 0;
  advance(state, 1, () => 0); assert.equal(state.cells[1].kind, 'pigeon');
  assert.ok(state.cells[1].lifetime < early);
  assert.equal(tap(state, -1), null); assert.equal(tap(state, 9), null);
});
