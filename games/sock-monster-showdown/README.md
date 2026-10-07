# Sock Monster Showdown

Next game after Grandma's Grocery Cart Grand Prix. A standalone family-friendly sock matching game. No connection to Steven or The Meltdown Room.

Tap/click matching named patterns, or use Tab and Enter. Each correct pair scores 100 × combo (maximum ×5); golden pairs score 500. Wrong pairs and decoys cost two seconds and reset the combo. Every third basket has one golden pair. Thirty seconds, pause, instant replay, reduced-motion support, local personal best. Scores are just for fun, not a verified leaderboard.

From repository root: `npm ci`, `npm run test:socks`, `npm run build:socks`. Existing apps and game files are preserved.

## Reddit installation

The independent app is `sock-monster-33610`. Run from `games/sock-monster-showdown/reddit`:

```
npx devvit login
npx devvit upload
npx devvit playtest aded33610_dev
```

In the playtest subreddit, open the community three-dot menu and choose **Create Sock Monster Showdown post**. The manifest points to `/internal/menu/create-post`, which creates the custom post and navigates to it. The inline splash opens the `game` entrypoint through Devvit's expanded-mode API.

Use this game directory for upload; uploading from the repository root targets Chicken Crossing. After playtesting, use Devvit publish/review and install in the intended community as required by Reddit. Never claim the post is live until the URL is verified.
