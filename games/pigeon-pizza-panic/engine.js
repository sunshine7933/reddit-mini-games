export const ROUND_MS = 45000;
export const newGame = () => ({ phase: 'ready', elapsed: 0, score: 0, slices: 5, combo: 0, shooed: 0, nextSpawn: 0, cells: Array(9).fill(null) });

export function startGame() { return { ...newGame(), phase: 'playing' }; }
export function togglePause(state) {
  if (state.phase === 'playing') state.phase = 'paused';
  else if (state.phase === 'paused') state.phase = 'playing';
}
function finish(state) {
  if (state.slices <= 0 || state.elapsed >= ROUND_MS) {
    state.slices = Math.max(0, state.slices);
    state.phase = 'over';
    state.cells.fill(null);
  }
}
export function tap(state, index) {
  if (state.phase !== 'playing' || !Number.isInteger(index) || index < 0 || index > 8) return null;
  const target = state.cells[index];
  if (!target) { state.combo = 0; return { text: 'Only tap a visitor!', kind: 'miss' }; }
  state.cells[index] = null;
  let result;
  if (target.kind === 'pigeon') {
    state.combo++;
    state.shooed++;
    const points = 10 + Math.min(5, Math.floor(state.combo / 3)) * 5;
    state.score += points;
    result = { text: `+${points} · ${['Coo denied!', 'Not your crust!', 'Table for NO.', 'Sir, this is a pizza.'][state.shooed % 4]}`, kind: 'good' };
  } else if (target.kind === 'pizza') {
    state.score += 25;
    state.slices = Math.min(5, state.slices + 1);
    result = { text: '+25 · Emergency cheese delivery!', kind: 'good' };
  } else {
    state.slices--;
    state.combo = 0;
    result = { text: 'You woke the cat. It ate a slice.', kind: 'bad' };
  }
  finish(state);
  return result;
}
export function advance(state, delta, random = Math.random) {
  if (state.phase !== 'playing' || !Number.isFinite(delta) || delta <= 0) return [];
  const events = [];
  const step = Math.min(delta, ROUND_MS - state.elapsed);
  state.elapsed += step;
  state.cells.forEach((target, i) => {
    if (!target) return;
    target.remaining -= step;
    if (target.remaining <= 0) {
      state.cells[i] = null;
      if (target.kind === 'pigeon') {
        state.slices--;
        state.combo = 0;
        events.push({ text: 'A pigeon stole a slice. The audacity.', kind: 'bad' });
      }
    }
  });
  finish(state);
  if (state.phase !== 'playing') return events;
  state.nextSpawn -= step;
  if (state.nextSpawn <= 0) {
    const free = state.cells.map((value, i) => value ? -1 : i).filter(i => i >= 0);
    if (free.length) {
      const index = free[Math.min(free.length - 1, Math.floor(random() * free.length))];
      const roll = random();
      const kind = roll < 0.74 ? 'pigeon' : roll < 0.91 ? 'cat' : 'pizza';
      const lifetime = kind === 'pigeon' ? 2600 - state.elapsed / ROUND_MS * 1100 : 2100;
      state.cells[index] = { kind, remaining: lifetime, lifetime };
    }
    state.nextSpawn = 1050 - state.elapsed / ROUND_MS * 530;
  }
  return events;
}
