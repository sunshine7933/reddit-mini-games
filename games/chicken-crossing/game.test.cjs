const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function game() {
  const elements = {};
  const context = new Proxy({}, {get: () => () => {}, set: () => true});
  const listeners = {};
  const document = {hidden:false, getElementById(id) {return elements[id] ||= {textContent:'',addEventListener(){},getContext:()=>context};},querySelectorAll:()=>[],addEventListener(name,fn){listeners[name]=fn;}};
  const scope = vm.createContext({document,window:{addEventListener(){}},requestAnimationFrame(){},Math});
  vm.runInContext(fs.readFileSync(__dirname+'/game.js','utf8'),scope);
  return {run:code=>vm.runInContext(code,scope),elements,document,listeners};
}
test('ready, start, boundaries, pause and restart retain best',()=>{
  const g=game(); assert.equal(g.run('state'),'ready');
  g.run("start(); lanes=[]; for(let i=0;i<20;i++)move('left')"); assert.equal(g.run('chicken.c'),0);
  g.run("for(let i=0;i<20;i++)move('right')"); assert.equal(g.run('chicken.c'),6);
  g.run("move('up'); togglePause(); move('up'); step(1)"); assert.equal(g.run('chicken.row'),7);
  assert.equal(g.run('state'),'paused');
  g.run('start()'); assert.equal(g.run('score'),0); assert.equal(g.run('best'),10);
});
test('collision is immediate, blocks subsequent input, gives no point for fatal hop',()=>{
  const g=game(); g.run("start(); lanes=[{row:7,items:[196],dir:1,speed:50}]; move('up'); move('up')");
  assert.equal(g.run('state'),'over'); assert.equal(g.run('chicken.row'),7); assert.equal(g.run('score'),0);
});
test('moving hazard collides and wrapping collision matches drawing',()=>{
  const g=game(); g.run('start(); chicken.row=7; lanes=[{row:7,items:[160],dir:1,speed:100}]; step(.1)');
  assert.equal(g.run('state'),'over');
  assert.equal(g.run('chicken.c=0; lanes[0].items=[391]; collision()'),true);
});
test('crossing awards 180, resets safely, backtracking cannot farm points',()=>{
  const g=game(); g.run("start(); lanes=[]; move('up'); move('down'); move('up')"); assert.equal(g.run('score'),10);
  g.run("for(let i=0;i<7;i++)move('up')"); assert.equal(g.run('score'),180); assert.equal(g.run('chicken.row'),8); assert.equal(g.run('round'),1);
});
test('keyboard ignores repeat and tab hiding pauses',()=>{
  const g=game(); g.run('start(); lanes=[]');
  const event={key:'ArrowUp',target:{tagName:'CANVAS'},preventDefault(){},repeat:true};
  g.listeners.keydown(event); assert.equal(g.run('chicken.row'),8);
  event.repeat=false; g.listeners.keydown(event); assert.equal(g.run('chicken.row'),7);
  g.document.hidden=true; g.listeners.visibilitychange(); assert.equal(g.run('state'),'paused');
});
