import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
test('replay resets the visible cart to its logical middle lane',()=>{
 const elements={};
 const context=vm.createContext({
  document:{getElementById:id=>elements[id]??={style:{},classList:{add(){},remove(){}}},addEventListener(){}},
  performance:{now:()=>0},requestAnimationFrame(){},Math
 });
 vm.runInContext(readFileSync(new URL('./game.js',import.meta.url),'utf8'),context);
 vm.runInContext('start();move(-1);',context);
 assert.equal(elements.cart.style.left,'17%');
 vm.runInContext('finish();start();',context);
 assert.equal(elements.cart.style.left,'50%');
});
