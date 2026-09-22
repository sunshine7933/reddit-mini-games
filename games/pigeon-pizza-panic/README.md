# 002 · Pigeon Pizza Panic

A lightweight, sound-free, 45-second picnic defense game. Tap/click pigeons before their red patience bars empty. Let sleeping cats be. Bonus pizza restores one slice (up to five) and awards 25 points. Save at least one slice until the clock runs out!

**[Play on the web](https://sunshine7933.github.io/reddit-mini-games/games/pigeon-pizza-panic/)** · **[Play inside Reddit](https://www.reddit.com/r/aded33610_dev/comments/1wnhs0j/pigeon_pizza_panic_your_lunch_their_entire/)**

Pigeons start at 10 points; every third consecutive pigeon increases the reward by 5, capped at 35. Tapping an empty spot, waking a cat, or losing a slice to a pigeon resets the streak. Best score is saved locally when storage is available, otherwise for the current visit. No accounts, network calls, audio, drag controls, or runtime dependencies.

## Controls and accessibility

- Tap or click the nine large targets, or use keys **1–9**, left to right and top to bottom.
- **P** or the Pause button pauses. Resume from the pause card.
- Leaving the tab/window or a long browser stall pauses automatically.
- Targets are native buttons with descriptive labels and visible focus; feedback uses a polite status region. Reduced-motion preferences are respected.
- Narrow screens and landscape layouts scroll naturally when needed.

## Local verification

From the repository root, use Node.js 22+:

```sh
npm ci
npm test
npm run build:pigeon
npm run build
```

Serve the repository with any static HTTP server and open `/games/pigeon-pizza-panic/`. ES modules require HTTP, not a `file://` URL.

Optional repeatable end-to-end checks use Playwright, without adding it to the game or changing the lockfile:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
node games/pigeon-pizza-panic/browser.test.mjs
```

`BROWSER_CHANNEL=chrome` uses an installed Chrome instead. `PLAYWRIGHT_MODULE` can point to an existing Playwright installation. `SCREENSHOT_DIR` optionally saves desktop/mobile screenshots. The suite starts and stops its own local server; it covers mouse/touch play, win/loss, replay, pause, keyboard, best-score persistence, responsive sizing, and built Reddit game assets.

## Separate Reddit app

The existing root `devvit.json`, `reddit/` build, and Chicken Crossing files are unchanged. This game has its **own** app configuration at `games/pigeon-pizza-panic/reddit/devvit.json` and its own generated `reddit/dist/`. The build reuses the existing expanded-mode launch handler. It never overwrites the existing root build.

The registered app is [`pizza-king-pigeon`](https://developers.reddit.com/apps/pizza-king-pigeon), version `0.0.1`, installed in `r/aded33610_dev`. The nested `package.json` lets the Reddit CLI operate on this app independently; install dependencies from the repository root using the existing lockfile. To playtest it as the app owner, run from the repository root:

```sh
cd games/pigeon-pizza-panic/reddit
npx devvit login
npx devvit playtest aded33610_dev
```

For deployment, run `npx devvit upload` then `npx devvit install aded33610_dev` **from that same nested directory**. Never use `cluck-cross-33610` for this game. After installation, moderators can choose **Create Pigeon Pizza Panic post** in the community menu; the existing playable post is linked above.

No Reddit app upload, installation, or post creation is performed by the build or automated browser tests. The first upload, test-community installation, and moderator post creation were completed separately on September 22, 2026. This is a development-community release, not an approved public App Directory listing. [Reddit entry-point documentation](https://developers.reddit.com/docs/capabilities/server/launch_screen_and_entry_points/view_modes_entry_points).
