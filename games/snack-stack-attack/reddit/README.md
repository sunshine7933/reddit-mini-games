# Snack Stack Attack

It looks ridiculously easy… until somebody drops the pickle.

Snack Stack Attack is a free, family-friendly, 30-second food-stacking game for Reddit users. Its public community is [r/SunshinesMiniGames](https://www.reddit.com/r/SunshinesMiniGames/). This app is independent of the other games in Sunshine's collection.

## Play

Open a game post and choose **Play Snack Stack Attack**, then **Let's stack**. Tap/click **Drop snack**, or press Space or Enter, to drop the moving food. Its center must land inside the marked support zone above the previous snack. A successful drop earns 1 point; a perfectly centered drop earns 2 additional points. Pancakes, cookies, cheese and donuts appear in sequence, with a pickle every fifth snack. Movement becomes faster, and food narrows every five successful drops. A missed drop ends the round; surviving 30 seconds also ends it.

Results show the score, number of snacks, perfect drops and a funny rank. **Play again** immediately starts a fresh round. **Copy my score challenge** copies a result only when requested; if clipboard access is unavailable, selectable text is offered. The game does not automatically publish scores, comments or messages.

Use **Pause** or P to pause/resume. Leaving the page pauses the game. There is no dragging or audio. Reduced-motion settings remove decorative landing animation; essential horizontal movement remains. Controls support keyboard focus, touch and mouse, and important results use status announcements.

## Personal best and data

The personal best is stored only in the current browser/device using local storage when available. Clearing browser site data clears it. Play still works when storage is blocked. Scores are not tied to Reddit accounts, sent to a leaderboard, or shared across devices. The app adds no third-party analytics, advertising, payments or external network requests. Reddit's platform may process its usual operational data. The server creates a game post only when a moderator selects the app's menu action. Redis is enabled in the existing configuration but unused by this version.

## Moderator setup

Install this app in the community you moderate. No additional settings are required. Open the community menu and select **Create Snack Stack Attack post**. This creates a playable post with the pickle hook in its title. Players do not need moderator permissions. The app does not modify or remove other posts, comments or games. If post creation fails, the menu shows a retry message. Each invocation creates a new post, so check the feed before retrying after an uncertain response.

## Support

Report a problem by messaging the moderators of [r/SunshinesMiniGames](https://www.reddit.com/message/compose?to=r/SunshinesMiniGames). Include the device, browser or Reddit app, and what happened. Do not send passwords or personal information.

## Review and release notes

Initial review submission: game logic is the same as tested version 0.0.1; this submission adds this app-root documentation. The private test post is https://www.reddit.com/r/aded33610_dev/comments/1wp2ao6/snack_stack_attack_it_looks_ridiculously_easy/ . Reviewers require access to that private community; the intended public home is r/SunshinesMiniGames.

Validation completed: 25 game/server tests across the repository; automated desktop and mobile-touch browser checks for scoring, timer, replay, storage, keyboard, pause, reduced motion, narrow layouts and clipboard fallback; and an actual launch/start/pause inside Reddit using the developer/moderator account. Separate regular-account and physical mobile-app testing has not been performed.

## Source layout

This app lives in `games/snack-stack-attack/reddit` within `sunshine7933/reddit-mini-games` on `main`. Build from the repository root using `npm run build:snack`; run `npm test` for the test suite. The shared launch handler is `reddit/splash.js` at repository root. The build copies the game's HTML, CSS, game.js and engine.js into `dist/client` without minifying those game source files, and bundles the server into `dist/server`. The review source archive includes these built client files and the server source. No credentials are included.
