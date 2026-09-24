# Snack Stack Attack · Game 004

A family-friendly 30-second stacking game. Tap/click **Drop snack**, or press **Space / Enter**. **P** or **Pause** pauses/resumes; leaving the page pauses automatically. No dragging or audio.

Keep each food's center inside the marked support zone. Supported snacks score 1; centered drops earn 2 extra. Pancakes, cookies, cheese, donuts and a guaranteed pickle every fifth food. Speed rises with each successful drop and foods narrow every five. An unsupported drop ends the round; surviving 30 seconds also ends it. The last eight snacks remain visible as the tower grows.

Instant replay, funny ranks, optional device-local personal best and a copyable score challenge reuse the existing games' conventions. No shared leaderboard or tracking is claimed. Reduced motion removes landing animation while essential horizontal gameplay movement remains. Keyboard focus, semantic controls, status announcements, optional storage and clipboard fallback are included.

## Verify

From the repository root: `npm test` and `npm run build:snack`.

Browser suite: `node games/snack-stack-attack/browser.test.mjs`. Use the existing Playwright installation through `PLAYWRIGHT_MODULE`; `BROWSER_CHANNEL=msedge` uses Edge. `SCREENSHOT_DIR` optionally saves desktop/mobile images.

## Reddit

Separate app: `snack-attack-33610`. Existing configured community: `r/aded33610_dev`. From this game's `reddit` directory, use `devvit upload` and `devvit install aded33610_dev`, then the community moderator menu **Create Snack Stack Attack post**. Root upload commands belong to Chicken Crossing.

See `reddit-post.md` for the prepared post. Upload/install alone does not create a playable post.
