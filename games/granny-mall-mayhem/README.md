# Granny Gone Wild: Mall Mayhem!

A separate Sunshine’s Mini-Games arcade platformer. Original games and their Devvit app configurations are preserved.

## Play

Serve the repository with a local web server, then open `games/granny-mall-mayhem/index.html`. It uses ES modules; opening with `file://` is not supported. No remote fonts, artwork, accounts, purchases or audio files are required. Sound effects are optional and off by default.

Move: arrows or A/D. Jump: Space, Up or W. Duck: Down or S. Boost: Shift. Pause: P, Escape or the pause button. On phones, hold the large controls; movement and jump/boost can be held together. The game pauses when the tab loses focus.

## Campaign

1. Parking Lot Escape — cones, barriers, coupon routes.
2. Food Court Frenzy — spill hazards and table routes.
3. Toy Store Trouble — patrolling robots; boost destroys robots and crates.
4. Fashion Floor Fiasco — moving clothing racks and sale signs.
5. Mega Mall Showdown — approach course plus a five-hit manager boss. Dodge alternating high/low receipts; boost into the boss during the green OPEN phase. Boss attacks stop while paused.

One star for finishing, one for 55% of coupons, one for finishing under the displayed par with at most one hit. Completion unlocks the next floor. Retries use checkpoints and restore hearts, but retain elapsed time and total hits for ratings. Coupons are banked only on completion, once per run; replaying earns more. Battery and cardigan upgrades each have three tiers. Four outfits unlock at 0, 5, 10 and 15 campaign stars.

Daily dash uses the UTC date to choose a course and obstacle offsets. It is replayable, uses stock equipment, and saves a personal best. No shared leaderboard or anti-cheat claims are made.

## Persistence

The web version uses a dedicated versioned localStorage key, with an in-memory fallback and visible status when storage is blocked. Clearing browser storage clears local progress. In the Devvit version, authenticated user IDs come from server context; personal saves sync to per-user Redis keys within the subreddit installation. Server data takes precedence when reopening the Reddit app. Guest players can play with local progress. Save values are bounded and validated; these are casual client-reported personal achievements, not trusted competitive scores. Simultaneous sessions use the last completed save request.

## Build and test

From the repository root after `npm ci`:

```
node --test games/granny-mall-mayhem/game.test.js games/granny-mall-mayhem/reddit/server.test.js
node games/granny-mall-mayhem/reddit/build.mjs
node games/granny-mall-mayhem/browser.test.mjs
```

Browser tests require Playwright and installed Microsoft Edge; set PLAYWRIGHT_MODULE to an absolute Playwright module path if it is outside node_modules. They exercise desktop keyboard and actual multi-touch browser events at 1280px and 390px, save/reload, upgrades, outfits, daily launch, pause and layout overflow. Screenshots go to the workspace outputs folder.

## Separate Reddit app — unpublished

The independent app is in `reddit/`, proposed app name `granny-mall-33610`. Name availability is not verified. It follows this repository’s pinned Devvit 0.14.4 conventions and uses the existing expanded-mode launcher. The root Chicken Crossing app is unchanged.

Before launch: verify the proposed app name, run a private Devvit playtest from this game’s `reddit/` folder, verify expanded-mode launch on Reddit desktop and a real mobile Reddit app, check signed-in Redis save/reopen and guest behavior, finish all five floors and daily mode in Reddit. Local browser checks do not establish Reddit runtime readiness. The web game is published at https://sunshine7933.github.io/reddit-mini-games/games/granny-mall-mayhem/. The separate Reddit app is not yet published: its first upload is waiting for initial app creation in the Reddit Developer Portal, followed by private runtime verification.
