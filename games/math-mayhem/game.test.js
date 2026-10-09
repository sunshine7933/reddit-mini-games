import test from 'node:test';
import assert from 'node:assert/strict';
import { problem, start, submit, remaining, rank } from './engine.js';
test('all levels generate all operations with correct nonnegative whole-number answers', () => {
  for (const level of ['easy', 'medium', 'hard']) {
    const ops = new Set();
    for (let i = 0; i < 4000; i++) {
      const p = problem(level); ops.add(p.op);
      assert.ok(Number.isInteger(p.answer) && p.answer >= 0);
      const actual = p.op === '+' ? p.a+p.b : p.op === '−' ? p.a-p.b : p.op === '×' ? p.a*p.b : p.a/p.b;
      assert.equal(p.answer, actual); assert.ok(p.b > 0);
    }
    assert.equal(ops.size, 4);
  }
});
test('scoring, streak milestones and wrong answer reset', () => {
  const s = start('easy', 0);
  for(let i=0;i<10;i++) submit(s, String(s.problem.answer), i);
  assert.equal(s.score, 1500); assert.equal(s.bestStreak, 10);
  submit(s, String(s.problem.answer+1), 100); assert.equal(s.streak, 0); assert.equal(s.score, 1500);
});
test('strict numeric input, exact deadline, background elapsed time and clean replay', () => {
  const s = start('hard', 100);
  for(const raw of ['', ' ', '1.5', '-1', '1e2', '0x10', 'Infinity']) assert.ok(submit(s,raw,200).invalid);
  assert.equal(s.attempts,0); assert.equal(remaining(s,100),60);
  assert.ok(submit(s,String(s.problem.answer),60100).expired); assert.equal(s.score,0);
  assert.equal(remaining(s,90000),0);
  const fresh = start('hard',90000); assert.equal(fresh.streak,0); assert.equal(fresh.ended,false); assert.equal(remaining(fresh,90000),60);
});
test('rank boundaries', () => { assert.equal(rank(0),'Math Rookie'); assert.equal(rank(500),'Quick Thinker'); assert.equal(rank(1500),'Equation Expert'); assert.equal(rank(3000),'Number Ninja'); assert.equal(rank(5000),'Mayhem Master'); });
