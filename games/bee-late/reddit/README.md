# Bee Late!

This meeting could have been a bee-mail.

Bee Late! is a free, family-friendly 30-second game for Sunshine's Mini-Games. Intended public community: [r/SunshinesMiniGames](https://www.reddit.com/r/SunshinesMiniGames/).

## How to play

Launch the game and choose **Let's buzz**. Tap or click one of three labeled choices, or use keyboard keys 1, 2 and 3. Flowers earn 5 points; every fifth consecutive flower earns 15. Meetings use one of three excuses. Clouds are safe but reset the streak. Missing a row also resets the streak. Three meetings or 30 seconds ends the round. Rows get faster as flowers are collected, with a minimum 0.9-second choice window. Replay immediately to chase a higher score and a funny rank.

Pause with P or the Pause button. Leaving the page pauses automatically. No dragging or audio. Reduced-motion preferences hide the changing row meter; there are no decorative motion effects. All choices use visible text and icons; controls support keyboard, touch, focus indicators and status announcements.

## Personal best and privacy

Only a personal-best number is stored locally in the current browser/device when storage is available. It is not tied to a Reddit account or synchronized across devices. Clearing browser data clears it. Play works when storage is blocked. No analytics, advertising, payments or external network requests are added. Reddit may process its normal platform data. Copy my score challenge only copies text on request; it does not publish or send messages. If clipboard access fails, selectable text appears.

## Moderators

Install the separate Bee Late! app in your community. After checking that the game has not already been posted, select **Create Bee Late! post** in the community menu. This action creates one playable post. It does not edit or remove existing posts or other games. If creation fails, a retry toast is shown; check the feed before retrying an uncertain response. Regular players do not need moderator permissions. No app settings are required.

## Support and source

Report problems to the moderators of r/SunshinesMiniGames with your device/browser and what happened. Do not send passwords or private information.

Source: `games/bee-late` in `sunshine7933/reddit-mini-games`, branch `main`. Build with `npm run build:bee` from the repository root. Unit/server tests run with `npm test`; the optional browser suite is `node games/bee-late/browser.test.mjs`. Game files are copied into `dist/client`, the existing shared launch handler is bundled, and the server is bundled into `dist/server`. This app is independent of the collection's other Devvit apps.
