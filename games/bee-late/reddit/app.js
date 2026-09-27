import express from 'express';
export function createApp(redditClient) {
  const app = express();
  app.use(express.json());
  // Devvit protects /internal; only the moderator menu exposes this endpoint.
  app.post('/internal/menu/create-post', async (_req, res) => {
    try {
      const post = await redditClient.submitCustomPost({
        title: 'Bee Late! 🐝 — Your boss is buzzing. Your commute is blooming chaos.',
        entry: 'default',
        textFallback: { text: 'Collect flowers in 30 seconds. Tap or click a choice, or press 1, 2 or 3. Five-flower streaks earn bonuses; three meetings end the round. Play again and challenge a friend to beat your score! Play Bee Late! on reddit.com or in the Reddit app.' }
      });
      res.json({ navigateTo: post.url });
    } catch (error) {
      console.error('Could not create Bee Late! post', error);
      res.status(500).json({ showToast: 'Could not create the game post. Please try again.' });
    }
  });
  return app;
}
