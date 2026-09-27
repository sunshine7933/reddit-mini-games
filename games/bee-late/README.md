# Bee Late! · Game 005

Your boss is buzzing. Your commute is blooming chaos.

A family-friendly 30-second pollen commute. Tap/click a choice or press **1 / 2 / 3**. Flowers earn 5 points; each fifth consecutive flower earns 15 instead. Meetings use one of three excuses. Clouds and missed flowers reset the streak; clouds cost no excuse. Three meetings or the timer ends the round. Rows shorten from 1.8 seconds to a minimum of 0.9 seconds as flowers are collected; a choice gives 0.3 seconds of feedback before the next row.

**P / Pause** pauses; leaving the page pauses automatically. Instant replay, funny ranks, optional device-local personal best, and a copyable score challenge follow the existing collection conventions. No dragging, audio, analytics or shared leaderboard. Reduced motion hides the changing row meter; the game itself has no travel animations. Choices have visible words as well as icons, keyboard focus, and status announcements. Storage and clipboard failures have safe fallbacks.

[Play on the web](https://sunshine7933.github.io/reddit-mini-games/games/bee-late/).

## Validation

From the repository root: `npm test`, `npm run build:bee`, and `node games/bee-late/browser.test.mjs`. For the optional browser suite set `PLAYWRIGHT_MODULE` to an existing Playwright installation and `BROWSER_CHANNEL=msedge` when using Edge. `SCREENSHOT_DIR` optionally records desktop/mobile screenshots.

## Reddit

Separate app configuration: `bee-late-33610`. Reuses the shared `reddit/splash.js` launch handler and existing moderator-menu post creation convention. Build from the repository root with `npm run build:bee`; run Devvit commands from this game's `reddit` directory. The root Devvit app remains Chicken Crossing. Prepared copy is in `reddit-post.md`. Uploading or installing an app does not create a post. Check the community feed before invoking **Create Bee Late! post** to avoid duplicates.

## Release status · September 27, 2026

31 repository game/server tests passed. The separate Reddit build passed. Automated desktop and mobile-touch browser tests passed for score, timer, meetings, instant replay, persistent personal best, keyboard, pause/blur, reduced motion, 320px and landscape layouts, clipboard fallback and blocked storage. Built Reddit client assets also passed with no browser errors. A mobile screenshot was visually inspected. Physical Reddit mobile-app testing has not been performed.

The existing Devvit login was confirmed, but uploading this new game requires registering `bee-late-33610`. Automatic approval review blocked submitting that new registration because it is outside the existing app setup. No Bee Late Reddit app, installation, review submission or post has been confirmed. Next user action: approve registration of the separate Bee Late app; then resume upload/review and post creation. Do not reuse or overwrite another game's app.
