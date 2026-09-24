import { createGame, step, drop, rank, FOODS } from './engine.js';
const $ = id => document.getElementById(id);
let game = createGame(), mode = 'ready', last = 0, best = 0;
try { const saved = Number(localStorage.getItem('snack-stack-attack-best')); if (Number.isSafeInteger(saved) && saved > 0) best = saved; } catch { /* Optional storage. */ }
$('record').textContent = `Personal best: ${best}`;
function styleFood(el, food) {
  el.style.left = `${food.x}%`; el.style.width = `${food.width}%`;
  el.style.background = FOODS[food.kind].color; el.textContent = FOODS[food.kind].icon;
}
function render() {
  $('score').textContent = game.score; $('time').textContent = `${Math.ceil(game.time)}s`; $('height').textContent = game.stack.length;
  styleFood($('food'), game.food);
  const support = game.stack.at(-1) || { x: 50, width: 48 };
  $('target').style.left = `${support.x}%`; $('target').style.width = `${support.width - 6}%`;
  if ($('tower').dataset.count !== String(game.stack.length)) {
    $('tower').dataset.count = game.stack.length;
    $('tower').replaceChildren(...game.stack.slice(-8).map((food, i, list) => {
      const el = document.createElement('div'); el.className = `food${i === list.length - 1 ? ' new' : ''}`;
      styleFood(el, food); el.style.bottom = `${58 + i * 23}px`; return el;
    }));
  }
}
function card(title, copy, button) {
  $('card-title').textContent = title; $('card-copy').textContent = copy; $('start').textContent = button;
  $('overlay').hidden = false; $('start').focus();
}
function finish() {
  mode = 'over'; $('pause').disabled = true; $('drop').disabled = true;
  best = Math.max(best, game.score);
  try { localStorage.setItem('snack-stack-attack-best', String(best)); } catch { /* Play works without storage. */ }
  $('record').textContent = `Personal best: ${best}`; $('share').hidden = false;
  $('card-label').textContent = 'OFFICIAL LUNCH INSPECTION';
  const result = `${game.score} points · ${game.stack.length} snacks · ${game.perfects} perfect. ${game.reason}`;
  card(rank(game.score), result, 'Play again →'); $('status').textContent = `${rank(game.score)}! ${result}`;
}
function start() {
  if (mode !== 'paused') game = createGame();
  mode = 'playing'; last = performance.now(); $('overlay').hidden = true; $('share').hidden = true; $('share-copy').hidden = true;
  $('pause').disabled = false; $('pause').textContent = 'Pause'; $('drop').disabled = false; $('drop').focus();
  $('status').textContent = `Next: ${FOODS[game.food.kind].name}. Center it over the support zone!`; render();
}
function pause() {
  if (mode !== 'playing') return;
  mode = 'paused'; $('pause').textContent = 'Resume'; $('drop').disabled = true;
  $('card-label').textContent = 'LUNCH CAN WAIT'; card('Hold the pickle.', 'Paused. Your tower and timer are safe.', 'Keep stacking →');
}
function place() {
  if (mode !== 'playing') return;
  // Account for time since the last paint before accepting an input.
  const now = performance.now(); step(game, (now - last) / 1000); last = now;
  const result = drop(game); render();
  if (game.over) { finish(); return; }
  if (result) $('status').textContent = `${result === 'perfect' ? 'Perfect! +3. Building code approved.' : '+1. Somehow, that counts as lunch.'} Next: ${FOODS[game.food.kind].name}.`;
}
$('start').addEventListener('click', start); $('drop').addEventListener('click', place);
$('pause').addEventListener('click', () => mode === 'paused' ? start() : pause());
$('share').addEventListener('click', async () => {
  const copy = `I scored ${game.score} in Snack Stack Attack — ${rank(game.score)}! 🥒 Can you beat my score? It looks ridiculously easy… until somebody drops the pickle.`;
  try { await navigator.clipboard.writeText(copy); $('status').textContent = 'Score challenge copied. Paste it wherever you want to challenge a friend!'; }
  catch { $('share-copy').hidden = false; $('share-copy').value = copy; $('share-copy').focus(); $('share-copy').select(); $('status').textContent = 'Select and copy your score challenge below the replay button.'; }
});
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
  if (event.key.toLowerCase() === 'p' && !event.repeat) { if (mode === 'paused') start(); else pause(); }
  if (mode === 'playing' && [' ', 'Enter'].includes(event.key) && (event.target === $('drop') || event.target.tagName !== 'BUTTON')) { event.preventDefault(); if (!event.repeat) place(); }
});
window.addEventListener('blur', pause); document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
function frame(now) {
  if (mode === 'playing') { step(game, (now - last) / 1000); render(); if (game.over) finish(); }
  last = now; requestAnimationFrame(frame);
}
render(); requestAnimationFrame(frame);
