export const patterns = ['Cherry stripes', 'Ocean dots', 'Lemon stars', 'Mint zigzags'];
export function makeBoard(round = 0, random = Math.random) {
  const cards = patterns.flatMap((label, pair) => [0, 1].map(copy => ({ id: `${pair}-${copy}`, pair, label, golden: round % 3 === 2 && pair === 0 })));
  cards.push({ id: 'banana', pair: null, label: 'Banana impostor' }, { id: 'boot', pair: null, label: 'Cowboy boot impostor' });
  for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
  return cards;
}
export function newGame(random = Math.random) { return { remaining: 30000, score: 0, combo: 0, pairs: 0, round: 0, selected: null, matched: [], board: makeBoard(0, random), done: false }; }
export function tick(state, elapsed) { if (!state.done) { state.remaining = Math.max(0, state.remaining - Math.max(0, elapsed)); state.done = state.remaining === 0; } return state; }
export function choose(state, id, random = Math.random) {
  if (state.done || state.matched.includes(id)) return 'ignored';
  const card = state.board.find(c => c.id === id); if (!card) return 'ignored';
  if (card.pair === null) { state.selected = null; state.combo = 0; tick(state, 2000); return 'wrong'; }
  if (state.selected === id) { state.selected = null; return 'ignored'; }
  if (!state.selected) { state.selected = id; return 'selected'; }
  const first = state.board.find(c => c.id === state.selected);
  if (first.pair !== card.pair) { state.selected = null; state.combo = 0; tick(state, 2000); return 'wrong'; }
  state.matched.push(state.selected, id); state.selected = null; state.combo++; state.pairs++;
  state.score += card.golden ? 500 : 100 * Math.min(5, state.combo);
  if (state.matched.length === 8) { state.round++; state.board = makeBoard(state.round, random); state.matched = []; }
  return card.golden ? 'golden' : 'match';
}
export function rank(score) { return score >= 5000 ? 'Supreme Sock Wizard' : score >= 2500 ? 'Hamper Hero' : score >= 1000 ? 'Sock Detective' : 'Laundry Rookie'; }
