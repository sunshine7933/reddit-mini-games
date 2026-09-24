import express from 'express';
export function createApp(redditClient) {
  const app = express();
  app.use(express.json());
  // Devvit protects /internal; only the moderator menu exposes this endpoint.
  app.post('/internal/menu/create-post', async (_req, res) => {
    try {
      const post = await redditClient.submitCustomPost({
        title: 'Snack Stack Attack 🥒 — It looks ridiculously easy… until somebody drops the pickle.',
        entry: 'default',
        textFallback: { text: 'Stack ridiculous snacks in 30 seconds. Tap or click Drop, or press Space / Enter. Centered drops earn bonuses. Play again and challenge a friend to beat your score! Play Snack Stack Attack on reddit.com or in the Reddit app.' }
      });
      res.json({ navigateTo: post.url });
    } catch (error) {
      console.error('Could not create Snack Stack Attack post', error);
      res.status(500).json({ showToast: 'Could not create the game post. Please try again.' });
    }
  });
  return app;
}
