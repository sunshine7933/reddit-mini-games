export const ROUND = 30;
export const FOODS = [
  { name: 'pancake mattress', icon: '🥞', color: '#efb44d' },
  { name: 'emotional support cookie', icon: '🍪', color: '#c9905d' },
  { name: 'structural cheese', icon: '🧀', color: '#ffd65c' },
  { name: 'load-bearing donut', icon: '🍩', color: '#eea5bd' },
  { name: 'the pickle', icon: '🥒', color: '#92c65c' }
];
export const rank = score => score >= 45 ? 'Certified Snack Architect' : score >= 25 ? 'Lunchbox Legend' : score >= 10 ? 'Pickle Professional' : 'Snack Apprentice';
function next(game) {
  const kind = game.stack.length % FOODS.length;
  const width = Math.max(15, 38 - Math.floor(game.stack.length / 5) * 4 - (kind === 4 ? 7 : 0));
  return { x: width / 2, width, kind, direction: 1 };
}
export function createGame() {
  const game = { time: ROUND, score: 0, perfects: 0, stack: [], over: false, reason: '', cooldown: 0 };
  game.food = next(game);
  return game;
}
export function step(game, dt) {
  if (game.over || !Number.isFinite(dt) || dt <= 0) return;
  const elapsed = Math.min(dt, game.time);
  game.time = Math.max(0, game.time - elapsed);
  game.cooldown = Math.max(0, game.cooldown - elapsed);
  const food = game.food, lo = food.width / 2, span = 100 - food.width;
  // Reflect at the walls even after a slow frame, without changing elapsed round time.
  const speed = 38 + Math.min(65, game.stack.length * 3);
  const phase = (food.direction === 1 ? food.x - lo : 2 * span - (food.x - lo)) + speed * elapsed;
  const folded = phase % (2 * span);
  food.x = lo + (folded <= span ? folded : 2 * span - folded);
  food.direction = folded < span ? 1 : -1;
  if (game.time <= 0) { game.over = true; game.reason = 'Lunch break! Your tower survived.'; }
}
export function drop(game) {
  if (game.over || game.cooldown > 0) return null;
  const food = game.food;
  const support = game.stack.at(-1) || { x: 50, width: 48 };
  const offset = Math.abs(food.x - support.x);
  // A food's center must rest inside the supporting food, with a small safety margin.
  if (offset > support.width / 2 - 3) {
    game.over = true;
    game.reason = food.kind === 4 ? 'Somebody dropped the pickle. It was you.' : `${FOODS[food.kind].name} has left the building.`;
    return 'splat';
  }
  const perfect = offset <= 3;
  game.score += perfect ? 3 : 1;
  if (perfect) game.perfects++;
  game.stack.push({ ...food });
  game.food = next(game);
  game.cooldown = 0.18;
  return perfect ? 'perfect' : 'stack';
}
