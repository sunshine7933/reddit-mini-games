export const ROUND = 30;
export const rank = score => score >= 90 ? 'Employee of the Flower' : score >= 50 ? 'Pollen Professional' : score >= 20 ? 'Assistant to the Regional Bee' : 'Probationary Bumble';
export function next(game, random = Math.random) {
  game.lanes = ['flower', 'meeting', 'cloud'];
  for (let i = 2; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [game.lanes[i], game.lanes[j]] = [game.lanes[j], game.lanes[i]]; }
  game.window = Math.max(0.9, 1.8 - game.flowers * 0.025);
  game.remaining = game.window; game.chosen = false; game.row++;
}
export function createGame(random = Math.random) {
  const game = { time: ROUND, score: 0, flowers: 0, combo: 0, hearts: 3, over: false, chosen: false, row: 0, message: 'Find the flower. Your boss is already buzzing.' };
  next(game, random); return game;
}
export function step(game, dt, random = Math.random) {
  if (game.over || !Number.isFinite(dt) || dt <= 0) return;
  let elapsed = Math.min(dt, game.time);
  game.time = Math.max(0, game.time - elapsed);
  while (elapsed >= game.remaining && !game.over) {
    elapsed -= game.remaining;
    if (!game.chosen) { game.combo = 0; game.message = 'Missed a flower. It will mention this in your review.'; }
    next(game, random);
  }
  game.remaining -= elapsed;
  if (game.time === 0) { game.over = true; game.message = 'Clocked in! The meeting could have been a bee-mail.'; }
}
export function choose(game, lane) {
  if (game.over || game.chosen || !Number.isInteger(lane) || lane < 0 || lane > 2) return null;
  game.chosen = true; game.remaining = 0.3;
  const kind = game.lanes[lane];
  if (kind === 'flower') {
    game.flowers++; game.combo++;
    const bonus = game.combo % 5 === 0;
    game.score += bonus ? 15 : 5;
    game.message = bonus ? '+15! Five-flower streak. Unbeelievable productivity.' : '+5 pollen! Please invoice the flower.';
  } else {
    game.combo = 0;
    if (kind === 'meeting') { game.hearts--; game.message = 'Mandatory buzzword meeting. One excuse used.'; }
    else game.message = 'Cloud break. Zero pollen, excellent vibes.';
  }
  if (game.hearts === 0) { game.over = true; game.message = 'Three meetings. Nothing accomplished. Very corporate.'; }
  return kind;
}
