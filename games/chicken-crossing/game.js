'use strict';
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const message = document.getElementById('message');
const restart = document.getElementById('restart');
const pause = document.getElementById('pause');
const W = 392, H = 504, CELL = 56;
const jokes = ['A shopping cart has right of way. Apparently.', 'The chicken would like to speak to management.', 'A tiny detour. A very dramatic chicken.', 'Road: 1. Chicken dignity: temporarily missing.'];
let chicken, lanes, score, best = 0, round, furthest, state = 'ready', last = null;

function setup() {
  chicken = {c: 3, row: 8}; score = 0; round = 0; furthest = 8;
  lanes = [1,2,3,5,6,7].map((row, i) => ({row, dir: i % 2 ? 1 : -1, speed: 42 + i * 9,
    icon: i === 2 ? '🛒' : i === 4 ? '🛴' : '🚗', items: [30 + (i * 53) % 180, 226 + (i * 53) % 180]}));
  updateScore();
}
function updateScore() {
  best = Math.max(best, score); scoreEl.textContent = score; bestEl.textContent = best;
}
function start() {
  setup(); state = 'running'; last = null;
  message.textContent = 'Destination: snacks. Please keep your feathers inside the chicken.';
  restart.textContent = 'Restart'; pause.textContent = 'Pause'; pause.disabled = false; draw();
}
function collision() {
  const x = chicken.c * CELL + CELL / 2;
  return lanes.some(l => l.row === chicken.row && l.items.some(ix => {
    const dx = Math.abs(x - ix);
    return Math.min(dx, W - dx) < 32;
  }));
}
function lose() {
  state = 'over'; pause.disabled = true; restart.textContent = 'Try again';
  message.textContent = jokes[Math.floor(Math.random() * jokes.length)] + ' Score: ' + score + '. Try again!';
}
function move(direction) {
  if (state === 'ready') start();
  if (state !== 'running') return;
  if (direction === 'left') chicken.c = Math.max(0, chicken.c - 1);
  if (direction === 'right') chicken.c = Math.min(6, chicken.c + 1);
  if (direction === 'up') chicken.row = Math.max(0, chicken.row - 1);
  if (direction === 'down') chicken.row = Math.min(8, chicken.row + 1);
  // Check each hop immediately: rapid inputs must not skip collisions between frames.
  if (collision()) { lose(); draw(); return; }
  if (chicken.row < furthest) { score += (furthest - chicken.row) * 10; furthest = chicken.row; }
  if (chicken.row === 0) {
    score += 100; round++; chicken.row = 8; furthest = 8;
    message.textContent = 'Snack secured! +100. The chicken has ordered seconds.';
  }
  updateScore(); draw();
}
function togglePause() {
  if (state !== 'running' && state !== 'paused') return;
  state = state === 'running' ? 'paused' : 'running'; last = null;
  pause.textContent = state === 'paused' ? 'Resume' : 'Pause';
  message.textContent = state === 'paused' ? 'Snack break. Resume when you are ready.' : 'Back to the important business of crossing.';
  draw();
}
function step(dt) {
  if (state !== 'running') return;
  // Small substeps avoid tunneling when a frame is delayed.
  let remaining = Math.min(Math.max(dt, 0), .1);
  while (remaining > 0 && state === 'running') {
    const slice = Math.min(remaining, .01); remaining -= slice;
    lanes.forEach(l => { l.items = l.items.map(x => (x + l.dir * l.speed * (1 + Math.min(round, 6) * .1) * slice + W) % W); });
    if (collision()) lose();
  }
}
function draw() {
  ctx.fillStyle = '#a6cd78'; ctx.fillRect(0,0,W,H);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = 'bold 12px system-ui'; ctx.fillStyle = '#315739';
  ctx.fillText('THE SNACK LAWN  ·  +100', W/2, 27);
  ctx.fillText('TAKE A BREATHER', W/2, 252);
  lanes.forEach(l => {
    const y = l.row * CELL;
    ctx.fillStyle = '#505e61'; ctx.fillRect(0,y,W,CELL);
    ctx.fillStyle = '#b5b9a9'; for (let x=12; x<W; x+=56) ctx.fillRect(x,y+27,26,2);
    ctx.font = '34px system-ui';
    l.items.forEach(x => { for (const offset of [-W,0,W]) ctx.fillText(l.icon,x+offset,y+28); });
  });
  ctx.fillStyle = '#173c3233'; ctx.beginPath(); ctx.ellipse(chicken.c*CELL+28,chicken.row*CELL+40,17,6,0,0,Math.PI*2); ctx.fill();
  ctx.font = '37px system-ui'; ctx.fillText('🐔',chicken.c*CELL+28,chicken.row*CELL+27);
  if (state !== 'running') {
    ctx.fillStyle = '#173c32b8'; ctx.fillRect(0,175,W,148);
    ctx.fillStyle = '#fffdf5'; ctx.font = 'bold 27px system-ui';
    ctx.fillText(state === 'ready' ? 'Why did the chicken…?' : state === 'paused' ? 'Snack break!' : 'Oh, cluck.', W/2,226);
    ctx.font = '14px system-ui'; ctx.fillText(state === 'ready' ? 'Tap Let’s cross! or an arrow to begin' : state === 'paused' ? 'Tap Resume or press P' : 'Tap Try again or press R',W/2,271);
  }
}
document.querySelectorAll('[data-move]').forEach(button => button.addEventListener('click', () => move(button.dataset.move)));
restart.addEventListener('click', start); pause.addEventListener('click', togglePause);
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
  const key = event.key.toLowerCase();
  const direction = {arrowup:'up',w:'up',arrowdown:'down',s:'down',arrowleft:'left',a:'left',arrowright:'right',d:'right'}[key];
  if (direction) { event.preventDefault(); if (!event.repeat) move(direction); }
  if (key === 'p' && !event.repeat) { event.preventDefault(); togglePause(); }
  if (key === 'r' && !event.repeat) { event.preventDefault(); start(); }
});
document.addEventListener('visibilitychange', () => { if (document.hidden && state === 'running') togglePause(); });
window.addEventListener('blur', () => { if (state === 'running') togglePause(); });
function loop(time) {
  const dt = last === null ? 0 : (time-last)/1000; last = time;
  step(dt); draw(); requestAnimationFrame(loop);
}
setup(); draw(); requestAnimationFrame(loop);
