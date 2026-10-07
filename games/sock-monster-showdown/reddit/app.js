import express from 'express';
export function createApp(redditClient) {
  const app = express();
  app.use(express.json());
  // Devvit protects /internal; only the moderator menu exposes this endpoint.
  app.post('/internal/menu/create-post', async (_req, res) => {
    try {
      const post = await redditClient.submitCustomPost({
        title: 'Sock Monster Showdown 🧦 — How many pairs can YOU save?',
        entry: 'default',
        textFallback: { text: 'Match sock patterns in 30 seconds. Pairs build a combo up to x5; impostors and wrong pairs cost 2 seconds. Every third basket has a golden pair worth 500. Touch, mouse or keyboard. Share your score in the comments! Play inside Reddit.' }
      });
      res.json({ navigateTo: post.url });
    } catch (error) {
      console.error('Could not create Sock Monster Showdown post', error);
      res.status(500).json({ showToast: 'Could not create the game post. Please try again.' });
    }
  });
  return app;
}
