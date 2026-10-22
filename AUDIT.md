# Game and storage audit — October 22, 2026

Audited repository main commit `7a076698eb72f95d787d21278ec8ce0f0baccfc5`. Nine game directories and nine independent Devvit configurations were found. Source and publication notes are evidence of intent/history, not proof of current Reddit availability.

| Game / web link | Live web response | Reddit status | Web source assets |
| --- | --- | --- | --- |
| [Bee Late!](https://sunshine7933.github.io/reddit-mini-games/games/bee-late/) | HTTP 200, expected title | Release notes record upload/install; no post URL confirmed | 12.5 KiB |
| [Chicken Crossing](https://sunshine7933.github.io/reddit-mini-games/games/chicken-crossing/) | HTTP 200, expected title | [Private test post](https://www.reddit.com/r/aded33610_dev/comments/1wmfeiz/) | 9.6 KiB |
| [Grandma’s Grocery Cart Grand Prix](https://sunshine7933.github.io/reddit-mini-games/games/grandmas-grocery-grand-prix/) | HTTP 200, expected title | Separate Devvit source present; no confirmed post or publication | 4.4 KiB |
| [Granny Gone Wild: Mall Mayhem!](https://sunshine7933.github.io/reddit-mini-games/games/granny-mall-mayhem/) | HTTP 200, expected title | Explicitly unpublished; initial app creation/upload pending in release notes | 32.5 KiB |
| [Laundry Launch!](https://sunshine7933.github.io/reddit-mini-games/games/laundry-launch/) | HTTP 200, expected title | Separate Devvit source present; no confirmed post or publication | 3.5 KiB |
| [Pigeon Pizza Panic](https://sunshine7933.github.io/reddit-mini-games/games/pigeon-pizza-panic/) | HTTP 200, expected title | [Private test post](https://www.reddit.com/r/aded33610_dev/comments/1wnhs0j/) | 15.1 KiB |
| [Snack Stack Attack](https://sunshine7933.github.io/reddit-mini-games/games/snack-stack-attack/) | HTTP 200, expected title | [Private test post](https://www.reddit.com/r/aded33610_dev/comments/1wp2ao6/); public review pending in release notes | 12.4 KiB |
| [Sock Monster Showdown](https://sunshine7933.github.io/reddit-mini-games/games/sock-monster-showdown/) | HTTP 200, expected title | Separate Devvit source present; no confirmed post or publication | 8.5 KiB |
| [Squirrel Snack Stack](https://sunshine7933.github.io/reddit-mini-games/games/squirrel-snack-stack/) | HTTP 200, expected title | [Private test post](https://www.reddit.com/r/aded33610_dev/comments/1wodm14/) | 14.3 KiB |

Web sizes are uncompressed HTML/CSS/JavaScript bytes from the audited source, excluding tests, documentation, build dependencies and Devvit server bundles. Total: 115,521 bytes (112.8 KiB). No remote artwork, font, audio or video assets are needed by these games.

## Link findings

All nine web game pages and the collection homepage returned HTTP 200 with expected game titles. The previous collection menu omitted Laundry Launch and Grocery Grand Prix; this change adds both. The README also omitted direct discovery links for those games and Snack Stack Attack.

Four Reddit post URLs were found in repository documentation. Direct requests returned HTTP 200 containing a JavaScript shell with only “Reddit” as readable text, so neither post existence nor expanded-mode gameplay can be established from those responses. The documented destination community, r/aded33610_dev, is private. The public-community feed request was blocked by Reddit network security. Browser-control access also timed out. Do not label these links broken, publicly playable, deleted, or verified from an HTTP status alone.

No additional public game-post URL is confirmed. Bee Late notes record installation in r/SunshinesMiniGames but explicitly say no post was confirmed. Mall Mayhem notes explicitly say unpublished. Laundry, Grocery and Socks have separate app sources but no confirmed Reddit release/post URL in this repository. Snack Stack Attack notes record a review submission; current approval is unverified.

## Fixes

- Add the two missing collection menu links and missing README discovery links; label private Reddit links accurately.
- Prevent Mall Mayhem on the GitHub Pages subpath from requesting the Reddit-only progress API. Reddit packaged entrypoints keep their existing sync behavior.
- Clean each app’s own generated dist directory before rebuilding, preventing obsolete assets from shipping. All build cleanup targets are fixed paths within that app; game sources and other apps are preserved.
- Minify each server bundle. Client source files remain readable and retain the same game logic.
- Add root build shortcuts for Laundry and Grocery.

## Persistent data

Chicken Crossing, Laundry and Grocery use session memory only. Pigeon, Squirrel, Snack Attack, Bee and Socks each keep one optional local best-score value with blocked-storage fallback. Mall Mayhem uses one versioned local save and one per-user Redis key, with five level ratings, capped upgrades and up to 30 daily entries on validation. No cache, analytics, media download, leaderboard or additional persistence is introduced. Existing player progress is preserved; no remote data is deleted.

Redis permissions are retained: existing Chicken documentation records that moderator menu actions need them, while Mall Mayhem actually uses Redis for progress. Unused permissions do not by themselves allocate player data.

## Remaining Reddit verification

An authenticated app owner/member must open the four existing private posts and exercise Play, gameplay, pause and replay on desktop and the Reddit mobile app. For games without confirmed posts, inspect the community feed and Developer Portal before creating anything, to avoid duplicate posts or replacing an existing app. Public release status must be checked in the Developer Portal. No upload, installation, publication or post creation was performed by this audit.
