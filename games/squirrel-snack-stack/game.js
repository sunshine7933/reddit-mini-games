import { createGame, move, step, rank, SNACKS } from './engine.js';
const $ = id => document.getElementById(id);
let game = createGame(), mode = 'ready', last = 0, best = 0;
try { const saved = Number(localStorage.getItem('squirrel-snack-stack-best')); if (Number.isFinite(saved) && saved > 0) best = saved; } catch { /* Storage is optional in embedded browsers. */ }
$('record').textContent = `Personal best: ${best}`;
function render() {
  for (const [id, value] of Object.entries({ score: game.score, combo: game.combo, time: `${Math.ceil(game.time)}s`, misses: `${game.misses} / 5` })) $(id).textContent = value;
  $('squirrel').style.left = `${14 + game.lane * 18}%`;
  $('position').textContent = `Squirrel in lane ${game.lane + 1} of 5.`;
  const existing = new Map([...$('items').children].map(el => [Number(el.dataset.id), el]));
  for (const item of game.items) {
    let el = existing.get(item.id);
    if (!el) { el = document.createElement('span'); el.className = 'snack'; el.dataset.id = item.id; el.dataset.kind = item.kind; el.textContent = SNACKS[item.kind].icon; $('items').append(el); }
    existing.delete(item.id);
    el.style.left = `${14 + item.lane * 18}%`; el.style.top = `${item.y}%`;
  }
  existing.forEach(el => el.remove());
  if ($('stack').dataset.stack !== game.stack.join('')) {
    $('stack').dataset.stack = game.stack.join('');
    $('stack').replaceChildren(...game.stack.map(icon => { const el = document.createElement('span'); el.textContent = icon; return el; }));
  }
  $('forest').classList.toggle('quacking', game.quack > 0);
  $('quack').hidden = game.quack <= 0;
}
function card(title, copy, button, label) {
  $('card-title').textContent = title; $('card-copy').textContent = copy;
  $('start').textContent = button; $('card-label').textContent = label;
  $('overlay').hidden = false; $('start').focus();
}
function finish() {
  mode = 'over'; $('pause').disabled = true;
  best = Math.max(best, game.score);
  try { localStorage.setItem('squirrel-snack-stack-best', String(best)); } catch { /* Play works without storage. */ }
  $('record').textContent = `Personal best: ${best}`;
  const result = `${game.score} points · Highest combo: ${game.bestCombo}. ${game.misses >= 5 ? 'The forest floor thanks you for the snacks.' : 'Snack shift complete!'} Every squirrel starts somewhere.`;
  card(rank(game.score), result, 'One more handful! →', 'OFFICIAL SNACK ASSESSMENT');
  $('status').textContent = `${rank(game.score)}! ${game.score} points. Highest combo ${game.bestCombo}.`;
}
function pause() {
  if (mode !== 'playing') return;
  mode = 'paused'; $('pause').textContent = 'Resume';
  card('Hold that handful.', 'Your snacks can wait. Take a breath, stretch your paws.', 'Keep stacking →', 'A WELL-EARNED PAWS');
  $('status').textContent = 'Paused. Your round is safe.';
}
function start() {
  if (mode !== 'paused') game = createGame();
  mode = 'playing'; last = performance.now();
  $('overlay').hidden = true; $('pause').disabled = false; $('pause').textContent = 'Pause';
  $('status').textContent = 'Catch at the dotted line. You’ve got this!';
  $('left').focus(); render();
}
function shift(direction) { if (mode === 'playing') { move(game, direction); render(); } }
$('start').addEventListener('click', start);
$('left').addEventListener('click', () => shift(-1));
$('right').addEventListener('click', () => shift(1));
$('pause').addEventListener('click', () => mode === 'paused' ? start() : pause());
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
  const key = event.key.toLowerCase();
  if (['arrowleft', 'arrowright', 'a', 'd'].includes(key) && mode === 'playing') { event.preventDefault(); shift(['arrowleft', 'a'].includes(key) ? -1 : 1); }
  if (key === 'p' && !event.repeat) { if (mode === 'paused') start(); else pause(); }
});
window.addEventListener('blur', pause);
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
function frame(now) {
  if (mode === 'playing') {
    const messages = step(game, Math.min((now - last) / 1000, 0.1));
    if (messages.length) $('status').textContent = messages.at(-1);
    render(); if (game.over) finish();
  }
  last = now; requestAnimationFrame(frame);
}
render(); requestAnimationFrame(frame);
