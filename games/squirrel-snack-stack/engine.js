export const ROUND = 45;
export const SNACKS = [
  { name: 'cookie', icon: '🍪', points: 10, speed: 24 },
  { name: 'strawberry', icon: '🍓', points: 20, speed: 30 },
  { name: 'acorn', icon: '🌰', points: 30, speed: 37 },
  { name: 'duck', icon: '🦆', points: 0, speed: 26 }
];
export const rank = score => score >= 900 ? 'Certified Squirrel Menace' : score >= 550 ? 'Acorn Overlord' : score >= 250 ? 'Snack Architect' : 'Casual Nibbler';
export function createGame() {
  return { time: ROUND, lane: 2, score: 0, combo: 0, bestCombo: 0, misses: 0, items: [], stack: [], spawn: 0.5, nextId: 0, quack: 0, over: false };
}
export function move(game, direction) {
  if (!game.over) game.lane = Math.max(0, Math.min(4, game.lane + Math.sign(direction)));
}
export function step(game, dt, random = Math.random) {
  if (game.over || !Number.isFinite(dt) || dt <= 0) return [];
  dt = Math.min(dt, 0.1, game.time);
  game.time = Math.max(0, game.time - dt);
  game.quack = Math.max(0, game.quack - dt);
  const events = [];
  game.spawn -= dt;
  if (game.spawn <= 0) {
    const roll = random();
    const kind = roll < 0.48 ? 0 : roll < 0.76 ? 1 : roll < 0.92 ? 2 : 3;
    game.items.push({ id: game.nextId++, lane: Math.min(4, Math.floor(random() * 5)), y: -5, kind });
    game.spawn += Math.max(0.65, 1.05 - (ROUND - game.time) * 0.008);
  }
  for (const item of game.items) {
    item.y += SNACKS[item.kind].speed * dt;
    if (item.y < 78) continue;
    item.done = true;
    const snack = SNACKS[item.kind];
    if (item.lane === game.lane) {
      if (item.kind === 3) {
        game.quack = 2;
        events.push('Quack Attack! Your snack inspector has arrived.');
      } else {
        game.combo++;
        game.bestCombo = Math.max(game.bestCombo, game.combo);
        const points = snack.points * Math.min(4, 1 + Math.floor((game.combo - 1) / 5));
        game.score += points;
        game.stack.push(snack.icon);
        game.stack = game.stack.slice(-8);
        events.push(`+${points} · ${game.combo} in a row!`);
      }
    } else if (item.kind !== 3) {
      game.misses++;
      game.combo = 0;
      events.push('Forest floor donation. Keep going!');
      if (game.misses >= 5) { game.over = true; break; }
    }
  }
  game.items = game.items.filter(item => !item.done);
  if (game.time <= 0) game.over = true;
  return events;
}
