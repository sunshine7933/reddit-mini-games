import { start, submit, remaining, rank } from './engine.js';
const $ = id => document.getElementById(id);
let state, interval;
function screen(name) { for (const id of ['setup', 'round', 'results']) $(id).hidden = id !== name; }
function render() {
  $('time').textContent = `${remaining(state, performance.now())}s`;
  $('time').classList.toggle('urgent', remaining(state, performance.now()) <= 10);
  $('score').textContent = state.score;
  $('streak').textContent = state.streak;
  $('problem').textContent = `${state.problem.text} = ?`;
}
function finish() {
  state.ended = true; clearInterval(interval); screen('results');
  $('rank').textContent = rank(state.score);
  $('final-score').textContent = `${state.score.toLocaleString()} pts`;
  $('summary').textContent = `${state.level.toUpperCase()} · ${state.correct}/${state.attempts} correct · Best streak: ${state.bestStreak}`;
  $('results').focus();
}
function begin() {
  clearInterval(interval); state = start($('difficulty').value, performance.now());
  screen('round'); $('level').textContent = `${state.level} difficulty`;
  $('answer').value = ''; $('feedback').textContent = 'You’ve got this. Make those numbers nervous.';
  render(); $('answer').focus();
  interval = setInterval(() => { if (!remaining(state, performance.now())) finish(); else render(); }, 100);
}
$('answer-form').addEventListener('submit', event => {
  event.preventDefault(); if (!state || state.ended) return;
  const result = submit(state, $('answer').value, performance.now());
  if (result.expired) return finish();
  if (result.invalid) { $('feedback').textContent = 'Type a whole number, then check your answer.'; $('answer').focus(); return; }
  $('feedback').textContent = result.correct ? `Correct! +100${result.bonus ? ' · Streak bonus +250! 🔥' : ' ✦'}` : `Oops! The answer was ${result.answer}. Fresh problem, fresh start.`;
  $('answer').value = ''; render(); $('answer').focus();
});
$('start').addEventListener('click', begin); $('replay').addEventListener('click', begin);
$('change').addEventListener('click', () => { screen('setup'); $('difficulty').focus(); });
document.addEventListener('visibilitychange', () => { if (state && !state.ended && !remaining(state, performance.now())) finish(); });
