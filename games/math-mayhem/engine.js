export const levels = { easy: [10, 5], medium: [30, 12], hard: [100, 20] };
export function problem(level = 'easy', random = Math.random) {
  if (!levels[level]) throw new Error('Unknown difficulty');
  const [limit, factor] = levels[level];
  const int = max => Math.floor(random() * max) + 1;
  const op = ['+', '−', '×', '÷'][Math.floor(random() * 4)];
  let a = int(op === '×' || op === '÷' ? factor : limit);
  let b = int(op === '×' || op === '÷' ? factor : limit);
  if (op === '−' && a < b) [a, b] = [b, a];
  if (op === '÷') a *= b;
  const answer = op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : a / b;
  return { a, b, op, answer, text: `${a} ${op} ${b}` };
}
export function rank(score) {
  return score >= 5000 ? 'Mayhem Master' : score >= 3000 ? 'Number Ninja' : score >= 1500 ? 'Equation Expert' : score >= 500 ? 'Quick Thinker' : 'Math Rookie';
}
export function start(level, now, random = Math.random) {
  return { level, deadline: now + 60000, score: 0, streak: 0, bestStreak: 0, correct: 0, attempts: 0, ended: false, problem: problem(level, random) };
}
export function remaining(state, now) { return Math.max(0, Math.ceil((state.deadline - now) / 1000)); }
export function submit(state, raw, now, random = Math.random) {
  if (state.ended || now >= state.deadline) { state.ended = true; return { expired: true }; }
  if (!/^\d+$/.test(raw.trim()) || !Number.isSafeInteger(Number(raw))) return { invalid: true };
  const correct = Number(raw) === state.problem.answer;
  state.attempts++;
  state.streak = correct ? state.streak + 1 : 0;
  const bonus = correct && state.streak % 5 === 0 ? 250 : 0;
  if (correct) { state.correct++; state.score += 100 + bonus; }
  state.bestStreak = Math.max(state.bestStreak, state.streak);
  const answer = state.problem.answer;
  state.problem = problem(state.level, random);
  return { correct, bonus, answer };
}
