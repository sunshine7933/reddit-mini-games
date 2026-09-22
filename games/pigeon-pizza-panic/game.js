import { ROUND_MS, newGame, startGame, togglePause, advance, tap } from './engine.js';
const $ = id => document.getElementById(id);
const pigeon = `<svg viewBox="0 0 90 70" aria-hidden="true"><path d="M27 53L8 46l14-9" fill="#65758b"/><ellipse cx="43" cy="44" rx="26" ry="20" fill="#abb6c6"/><path d="M31 36q32-8 30 17Q31 67 31 36" fill="#77849c"/><path d="M47 32q-5-18 9-23 22-5 21 17l-4 15" fill="#b8c2d0"/><path d="M48 32q14 9 26 0v9q-12 11-25 0" fill="#69a39b"/><path d="M75 23l14 6-14 5" fill="#f4b447"/><circle cx="66" cy="21" r="7" fill="white"/><circle cx="68" cy="21" r="3" fill="#233f39"/><path d="M60 12l12 3" stroke="#233f39" stroke-width="3"/><path d="M35 61v7m-5 0h12m12-7v7m-5 0h12" stroke="#ec9d6b" stroke-width="3" stroke-linecap="round"/></svg>`;
const labels = { pigeon: 'SHOO!', cat: 'LET SLEEP', pizza: '+1 SLICE' };
const art = { pigeon, cat: '🐱', pizza: '🍕' };
let state = newGame();
let best = 0;
try { best = Math.max(0, Number(localStorage.getItem('pigeon-pizza-panic-best')) || 0); } catch { /* Storage is optional in embedded browsers. */ }
const spots = Array.from({ length: 9 }, (_, index) => {
  const button = document.createElement('button');
  button.className = 'spot';
  button.innerHTML = `<span class="key" aria-hidden="true">${index + 1}</span><span class="visitor" aria-hidden="true"></span><span class="label" aria-hidden="true"></span><span class="fuse" aria-hidden="true"></span>`;
  button.addEventListener('click', () => hit(index));
  $('board').append(button);
  return button;
});
function announce(event) { if (event) { $('message').textContent = event.text; $('message').dataset.kind = event.kind; } }
function hit(index) { announce(tap(state, index)); render(); }
function render() {
  $('score').textContent = state.score;
  $('time').textContent = `${Math.ceil((ROUND_MS - state.elapsed) / 1000)}s`;
  $('slices').textContent = `${state.slices} / 5`;
  $('combo').textContent = state.combo >= 3 ? `${state.combo} IN A ROW!` : `Best: ${best}`;
  $('pause').disabled = state.phase !== 'playing';
  spots.forEach((button, i) => {
    const target = state.cells[i];
    const kind = target?.kind || '';
    if (button.dataset.kind !== kind) {
      button.dataset.kind = kind;
      button.querySelector('.visitor').innerHTML = art[kind] || '';
      button.querySelector('.label').textContent = labels[kind] || '';
      button.setAttribute('aria-label', `Spot ${i + 1}: ${kind === 'pigeon' ? 'shoo pigeon' : kind === 'cat' ? 'sleeping cat, do not tap' : kind === 'pizza' ? 'collect bonus pizza' : 'empty'}`);
    }
    button.disabled = state.phase !== 'playing';
    button.querySelector('.fuse').style.transform = `scaleX(${target ? Math.max(0, target.remaining / target.lifetime) : 0})`;
  });
  const show = state.phase !== 'playing';
  const opening = $('overlay').hidden && show;
  $('overlay').hidden = !show;
  $('rules').hidden = state.phase !== 'ready';
  if (state.phase === 'paused') {
    $('card-eyebrow').textContent = 'LUNCH BREAK';
    $('card-title').textContent = 'Hold that coo.';
    $('card-copy').textContent = 'Your pizza is safe while paused. Ready for the next peck?';
    $('start').textContent = 'Back to lunch';
  } else if (state.phase === 'over') {
    if (state.score > best) {
      best = state.score;
      try { localStorage.setItem('pigeon-pizza-panic-best', String(best)); } catch { /* Keep the best score for this visit. */ }
    }
    $('combo').textContent = `Best: ${best}`;
    $('card-eyebrow').textContent = state.slices ? 'LUNCH: SUCCESSFULLY DEFENDED' : 'THE BIRDS HAVE WON THIS ROUND';
    $('card-title').textContent = state.slices ? 'Crust we can trust.' : 'Coo. There it went.';
    $('card-copy').textContent = `${state.score} points · ${state.shooed} pigeons shooed · ${state.slices} slices saved. Best: ${best}. ${state.slices ? 'Employee of the munch!' : 'Apparently you run a bird buffet.'}`;
    $('start').textContent = 'Another slice? Play again';
  }
  if (opening) $('start').focus({ preventScroll: true });
}
let previous = performance.now();
$('start').addEventListener('click', () => {
  if (state.phase === 'paused') togglePause(state);
  else state = startGame();
  previous = performance.now();
  announce({ text: 'Lunch is served. Pigeons are not invited.', kind: 'good' });
  render();
  spots[0].focus({ preventScroll: true });
});
function pause() { if (state.phase === 'playing') { togglePause(state); render(); } }
$('pause').addEventListener('click', pause);
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
window.addEventListener('blur', pause);
document.addEventListener('keydown', event => {
  if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
  if (/^[1-9]$/.test(event.key) && state.phase === 'playing') { event.preventDefault(); hit(Number(event.key) - 1); }
  if (event.key.toLowerCase() === 'p' && ['playing', 'paused'].includes(state.phase)) {
    event.preventDefault();
    togglePause(state);
    previous = performance.now();
    render();
    if (state.phase === 'playing') spots[0].focus({ preventScroll: true });
  }
});
function frame(now) {
  // Treat long stalls as a pause rather than charging players for a frozen browser.
  if (state.phase === 'playing' && now - previous > 1000) pause();
  const events = advance(state, now - previous);
  previous = now;
  if (events.length) announce(events.at(-1));
  if (state.phase === 'playing' || $('overlay').hidden) render();
  requestAnimationFrame(frame);
}
render();
requestAnimationFrame(frame);
