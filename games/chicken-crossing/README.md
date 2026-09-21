# 🐔 Chicken Crossing — Game #001

A fast, funny, family-friendly crossing game. Zero actual chickens harmed.

## Play

**[Play Chicken Crossing](https://sunshine7933.github.io/reddit-mini-games/games/chicken-crossing/)**

- Click **Let's cross!** or a movement arrow to start.
- Tap the arrows, or use arrow keys / WASD, to move one square at a time.
- Dodge cars, shopping carts and scooters. Green lawns are safe rest areas.
- Each new forward row earns 10 points. Reaching the snack lawn adds 100 (180 per full crossing).
- The chicken returns to the bottom after each crossing. Traffic gradually speeds up, with a cap.
- Pause / Resume or P takes a break. Leaving the tab automatically pauses.
- Try again / Restart or R starts a fresh run. The best score lasts until the page reloads.

## Local testing

Download the repository ZIP, extract it, and open `games/chicken-crossing/index.html` in a modern browser. All assets are local; no server, package installation, account, tracking or storage is required.

Optional automated gameplay checks, with Node.js installed:

```sh
node --test games/chicken-crossing/game.test.cjs
```

Manual checks: start; move with buttons and keyboard; hit traffic and restart; pause/resume; switch tabs; cross to earn the bonus; test at phone width. Check that repeated backtracking does not increase score and that rapid input cannot bypass collision checks.

## Publishing

GitHub Pages publishes this public repository from **main / (root)**, with `.nojekyll` for plain static files. The root landing page links to the game. Changes to main redeploy automatically; check the repository Actions tab for deployment status.

Pages settings: https://github.com/sunshine7933/reddit-mini-games/settings/pages

## Reddit / Devvit version

The same game assets are packaged for Reddit as `cluck-cross-33610`. See [Reddit build and installation instructions](../../reddit/README.md). Daily leaderboards and optional bonus items (golden egg, taco, crown) can be added later.
