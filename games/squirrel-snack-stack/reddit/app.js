import express from 'express';
export function createApp(redditClient) {
  const app = express();
  app.use(express.json());
  // Devvit protects /internal; only the moderator menu exposes this endpoint.
  app.post('/internal/menu/create-post', async (_req, res) => {
    try {
      const post = await redditClient.submitCustomPost({
        title: 'Squirrel Snack Stack 🐿️ — tiny paws, tall snacks, absolutely no plan',
        entry: 'default',
        textFallback: { text: 'Move left and right to catch falling snacks, build combos, and survive a harmless Quack Attack! A 45-second forest break. Play Squirrel Snack Stack on reddit.com or in the Reddit app.' }
      });
      res.json({ navigateTo: post.url });
    } catch (error) {
      console.error('Could not create Squirrel Snack Stack post', error);
      res.status(500).json({ showToast: 'Could not create the game post. Please try again.' });
    }
  });
  return app;
}
