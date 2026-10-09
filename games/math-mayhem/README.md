# Math Mayhem

A standalone game in Sunshine’s mini-game collection. Open `index.html` through a local web server. Choose easy, medium or hard; type a whole-number answer and press Enter or Check. Each round lasts 60 seconds, including time spent in another tab. Wrong answers reveal the answer and move to the next problem.

Correct: +100 points. Every five consecutive correct answers: +250 bonus. Wrong answers reset the streak without deducting points. All four operations appear at every difficulty. Subtraction stays nonnegative; division is generated from an integer quotient and a nonzero divisor.

Easy: addition/subtraction operands 1–10; multiplication factors and division quotients/divisors 1–5. Medium: 1–30 and 1–12. Hard: 1–100 and 1–20.

Ranks: 0–499 Math Rookie; 500–1499 Quick Thinker; 1500–2999 Equation Expert; 3000–4999 Number Ninja; 5000+ Mayhem Master. These are local score titles, not shared leaderboard positions. Replay starts a fresh randomized round at the same difficulty; Change difficulty returns to setup.

From the repository root: `npm ci`, `npm run test:math`, `npm run build:math`. Browser check: `node games/math-mayhem/browser.test.mjs` with Playwright installed or PLAYWRIGHT_MODULE pointing to its package.

## Independent Reddit app

The `reddit/` folder contains a separate app named `math-mayhem-33610`. It reuses only the collection’s launch helper. It does not change Chicken Crossing or any other game/app. From this game's `reddit/` directory, after building, use `npx devvit playtest aded33610_dev` to test in Reddit. Upload/install and creating a Reddit post are separate release steps. App-name availability and Reddit behavior require authenticated Devvit validation.

No score collection, shared leaderboard, audio, external service or presentation workflow is included.
