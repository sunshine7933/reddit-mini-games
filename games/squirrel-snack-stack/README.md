# Squirrel Snack Stack · Game 003

A 45-second, family-friendly snack-catching game. Five lanes, five allowed food misses, and an entirely unqualified squirrel.

Tap/click **Left** or **Right**, or use **← / →** or **A / D**. Each press moves one lane; keyboard repeat works. **P** or **Pause** pauses/resumes. Switching tabs pauses automatically. Replay starts a fresh round.

Cookies score 10, berries 20, and smaller, faster acorns 30. Consecutive food catches increase the multiplier every five catches, capped at ×4. Missing food resets the current combo. Ducks cause two seconds of decorative Quack Attack wobble, without reducing points, combos, or lives. The stack is decorative and displays the last eight catches; catch position stays at the marked line for predictable controls.

Results show score, highest combo, and a playful rank. Personal best score is stored only on this device when browser storage is available. No audio, dragging, tracking, or remote assets. Semantic buttons, visible focus, status announcements, and reduced-motion support are included. Falling objects remain animated for gameplay; decorative wobble is removed with reduced motion.

## Verify

From the repository root: `npm ci`, `npm test`, `npm run build`, `npm run build:pigeon`, and `npm run build:squirrel`.

Optional browser suite: `node games/squirrel-snack-stack/browser.test.mjs`. Install Playwright separately or set `PLAYWRIGHT_MODULE` to its installed package path. Set `BROWSER_CHANNEL=msedge` to use installed Edge. `SCREENSHOT_DIR` optionally saves screenshots.

## Separate Reddit app

This game has its own `reddit/devvit.json` and build output. It does not replace Chicken Crossing or Pigeon Pizza Panic. Registered app slug: `snack-stack-33610`, version 0.0.1. Installed in `r/aded33610_dev`. The community follows the existing repository configuration: `aded33610_dev`.

From **this game's reddit directory**, after authenticating the owning Reddit account:

```sh
npx devvit whoami
npx devvit upload
npx devvit install aded33610_dev
```

Then visit `r/aded33610_dev` as a moderator, open the community menu, and choose **Create Squirrel Snack Stack post**. That creates the playable custom post. Upload/install alone does not create a post. Do not run the root upload/install commands for this game: those belong to Chicken Crossing.

See `reddit-post.md` for ready-to-use post copy. No public-community rollout is implied by these test-community instructions.

## Live Reddit post

[Play Squirrel Snack Stack inside Reddit](https://www.reddit.com/r/aded33610_dev/comments/1wodm14/squirrel_snack_stack_tiny_paws_tall_snacks/). Upload, installation, and custom-post creation completed on September 23, 2026.
