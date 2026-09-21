# Chicken Crossing on Reddit

App: `cluck-cross-33610` · development community: `r/aded33610_dev`.

**[Open the playable Reddit post](https://www.reddit.com/r/aded33610_dev/comments/1wmfeiz/chicken_crossing_tiny_wings_big_snack_ambitions/)**

This package reuses the exact game files in `games/chicken-crossing/`. It adds a lightweight, non-scrolling launch card inside Reddit and opens the game in expanded mode only when a player presses Play.

## Build and test

With Node.js 22+ installed, run from the repository root:

```sh
npm ci
npm test
npm run build
```

The build copies only the three browser game assets into `dist/client/`, bundles the Reddit launch button, and creates the server bundle. Generated output and dependencies are not committed.

## Upload and install

Sign in as the app owner using `npx devvit login`, then run:

```sh
npm run upload
npm run install:reddit
```

In `r/aded33610_dev`, open the community's three-dot menu and choose **Create Chicken Crossing post**. This moderator-only action creates a playable post. Installation itself does not automatically create posts.

For ongoing development, `npm run dev` targets this same test community.

## Scope and privacy

Only this app is uploaded or installed. Existing apps and posts are not updated. The game uses no external network requests, payments, saved player profiles, or score database. Best score is kept in memory for the current visit. Redis is enabled because Reddit requires it for moderator menu actions; the game does not store scores there.

Uploading a test version does not mean Reddit has approved it for a wider launch. Public distribution requires Reddit's publishing/review process. See https://developers.reddit.com/docs/guides/launch/launch-guide.
