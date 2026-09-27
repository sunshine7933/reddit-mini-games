import { createGame, step, choose, rank } from './engine.js';
const $ = id => document.getElementById(id);
const buttons = [0, 1, 2].map(i => $(`lane-${i}`));
const labels = { flower: '🌼 Flower', meeting: '📋 Meeting', cloud: '☁️ Cloud' };
let game = createGame(), mode = 'ready', last = 0, best = 0, row = -1;
try { const n = Number(localStorage.getItem('bee-late-best')); if (Number.isSafeInteger(n) && n > 0) best = n; } catch { /* Optional storage. */ }
$('record').textContent = `Personal best: ${best}`;
function render() {
  $('score').textContent = game.score; $('time').textContent = `${Math.ceil(game.time)}s`; $('hearts').textContent = game.hearts;
  $('streak').textContent = `Flower streak: ${game.combo}`;
  $('meter').style.width = `${Math.max(0, game.remaining / game.window * 100)}%`;
  buttons.forEach((button, i) => { button.disabled = mode !== 'playing' || game.chosen; });
  if (row !== game.row) {
    row = game.row;
    buttons.forEach((button, i) => { button.textContent = `${i + 1} · ${labels[game.lanes[i]]}`; button.dataset.kind = game.lanes[i]; });
    $('status').textContent = `${game.message} Choices: ${game.lanes.map((kind, i) => `${i + 1} ${kind}`).join(', ')}.`;
  }
}
function card(title, copy, button) { $('card-title').textContent = title; $('card-copy').textContent = copy; $('start').textContent = button; $('overlay').hidden = false; $('lanes').inert = true; $('start').focus(); }
function finish() {
  mode = 'over'; $('pause').disabled = true; best = Math.max(best, game.score);
  try { localStorage.setItem('bee-late-best', String(best)); } catch { /* Optional storage. */ }
  $('record').textContent = `Personal best: ${best}`; $('share').hidden = false; $('card-label').textContent = 'YOUR PERFORMANCE RE-BEE-VIEW';
  const result = `${game.score} points · ${game.flowers} flowers. ${game.message}`;
  card(rank(game.score), result, 'Play again →'); $('status').textContent = result; render();
}
function start() {
  if (mode !== 'paused') { game = createGame(); row = -1; }
  mode = 'playing'; last = performance.now(); $('overlay').hidden = true; $('lanes').inert = false; $('share').hidden = true; $('share-copy').hidden = true;
  $('pause').disabled = false; $('pause').textContent = 'Pause'; render(); buttons[0].focus();
}
function pause() { if (mode !== 'playing') return; advance(performance.now()); if (mode !== 'playing') return; mode = 'paused'; $('pause').textContent = 'Resume'; $('card-label').textContent = 'APPROVED BEE BREAK'; card('Hold that buzz.', 'Paused. Your pollen and timer are safe.', 'Keep buzzing →'); render(); }
function advance(now) { step(game, Math.max(0, now - last) / 1000); last = now; if (game.over) finish(); else render(); }
function pick(lane) { if (mode !== 'playing') return; advance(performance.now()); if (mode !== 'playing') return; const result = choose(game, lane); if (result) $('status').textContent = game.message; if (game.over) finish(); else render(); }
buttons.forEach((button, i) => button.addEventListener('click', () => pick(i)));
$('start').addEventListener('click', start); $('pause').addEventListener('click', () => mode === 'paused' ? start() : pause());
$('share').addEventListener('click', async () => { const copy = `I scored ${game.score} in Bee Late! — ${rank(game.score)}! 🐝 Can you beat my pollen commute? https://sunshine7933.github.io/reddit-mini-games/games/bee-late/`; try { await navigator.clipboard.writeText(copy); $('status').textContent = 'Score challenge copied!'; } catch { $('share-copy').hidden = false; $('share-copy').value = copy; $('share-copy').focus(); $('share-copy').select(); $('status').textContent = 'Select and copy your challenge below the replay button.'; } });
document.addEventListener('keydown', event => { if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.repeat) return; if (event.key.toLowerCase() === 'p') { event.preventDefault(); if (mode === 'paused') start(); else pause(); } if (/^[123]$/.test(event.key) && mode === 'playing') { event.preventDefault(); pick(Number(event.key) - 1); } });
window.addEventListener('blur', pause); document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
function frame(now) { if (mode === 'playing') advance(now); requestAnimationFrame(frame); }
render(); requestAnimationFrame(frame);
