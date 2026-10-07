import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame, choose, tick, makeBoard, rank} from './engine.js';
test('baskets always contain four solvable pairs and two decoys',()=>{for(let r=0;r<12;r++){const b=makeBoard(r);assert.equal(new Set(b.map(c=>c.id)).size,10);for(let p=0;p<4;p++)assert.equal(b.filter(c=>c.pair===p).length,2);assert.equal(b.filter(c=>c.golden).length,r%3===2?2:0);}});
test('matches score, cannot be double counted, and completing a basket refreshes it',()=>{const s=newGame();choose(s,'0-0');choose(s,'0-1');assert.equal(s.score,100);assert.equal(choose(s,'0-1'),'ignored');for(let p=1;p<4;p++){choose(s,p+'-0');choose(s,p+'-1');}assert.equal(s.score,1000);assert.equal(s.round,1);assert.equal(s.matched.length,0);});
test('wrong pairs and decoys reset combo and deduct exactly two seconds',()=>{const s=newGame();choose(s,'0-0');choose(s,'1-0');assert.equal(s.remaining,28000);choose(s,'banana');assert.equal(s.remaining,26000);assert.equal(s.combo,0);});
test('golden pair awards 500 and combo has a scoring cap',()=>{const s=newGame();s.round=2;s.board=makeBoard(2);s.combo=9;choose(s,'0-0');choose(s,'0-1');assert.equal(s.score,500);choose(s,'1-0');choose(s,'1-1');assert.equal(s.score,1000);});
test('timeout locks input, clamps time and supports a clean restart',()=>{const s=newGame();tick(s,31000);assert.equal(s.remaining,0);assert.equal(choose(s,'0-0'),'ignored');assert.equal(s.score,0);assert.equal(newGame().done,false);assert.equal(rank(5000),'Supreme Sock Wizard');});
