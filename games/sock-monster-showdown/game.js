import { newGame, choose, tick, rank } from './engine.js';
const $ = id => document.getElementById(id);
let state = newGame(), running = false, paused = false, last = 0, best = 0;
try { best = Number(localStorage.getItem('sunshine-sock-monster-best')) || 0; } catch {}
$('best').textContent = best;
function draw() {
  $('time').textContent = (state.remaining / 1000).toFixed(1); $('score').textContent = state.score; $('combo').textContent = `×${Math.min(5, state.combo)}`;
  const focused = document.activeElement?.dataset?.id;
  $('board').replaceChildren(...state.board.map(card => {
    const button = document.createElement('button'); button.className = `card${card.golden ? ' golden' : ''}${state.selected === card.id ? ' selected' : ''}${state.matched.includes(card.id) ? ' matched' : ''}`;
    button.dataset.id = card.id; button.dataset.pair = card.pair; button.disabled = !running || paused || state.done || state.matched.includes(card.id);
    button.setAttribute('aria-label', `${card.golden ? 'Golden ' : ''}${card.label}`); button.setAttribute('aria-pressed', String(state.selected === card.id));
    const icon = document.createElement('b'); icon.textContent = card.pair === null ? (card.id === 'banana' ? '🍌' : '👢') : (card.golden ? '✨🧦' : '🧦'); icon.setAttribute('aria-hidden', 'true');
    const label = document.createElement('small'); label.textContent = card.golden ? 'Golden stripes' : card.label; button.append(icon, label);
    button.onclick = () => { advance(performance.now()); if (!running || paused) return; const result = choose(state, card.id); $('message').textContent = ({selected:'Find its matching partner!',wrong:'Oops! −2 seconds. Fresh start!',match:'Pair rescued! Keep that combo going!',golden:'Golden pair! +500 points!'})[result] || $('message').textContent; if (state.done) finish(); draw(); }; return button;
  }));
  if (focused) [...$('board').children].find(b => b.dataset.id === focused && !b.disabled)?.focus();
}
function finish() { running = false; best = Math.max(best, state.score); try { localStorage.setItem('sunshine-sock-monster-best', String(best)); } catch {} $('best').textContent = best; $('message').textContent = `${rank(state.score)}! ${state.pairs} pairs rescued · ${state.score} points.`; $('start').textContent = 'One more basket!'; $('start').hidden = false; $('pause').hidden = true; }
function advance(now) { if (running && !paused) { tick(state, now - last); if (state.done) { finish(); draw(); } } last = now; }
function frame(now) { advance(now); $('time').textContent = (state.remaining / 1000).toFixed(1); requestAnimationFrame(frame); }
$('start').onclick = () => { state = newGame(); running = true; paused = false; last = performance.now(); $('start').hidden = true; $('pause').hidden = false; $('pause').textContent = 'Pause'; $('intro').hidden = true; $('message').textContent = 'Match patterns. Save the socks!'; draw(); };
function pause() { if (!running) return; advance(performance.now()); if (!running) return; paused = !paused; $('pause').textContent = paused ? 'Resume' : 'Pause'; $('message').textContent = paused ? 'Basket on hold. Resume when ready.' : 'Match patterns. Save the socks!'; draw(); }
$('pause').onclick = pause;
document.addEventListener('visibilitychange', () => { if (document.hidden && running && !paused) pause(); });
draw(); requestAnimationFrame(frame);
