import express from 'express';

export function createApp(redditClient) {
  const app = express();
  app.use(express.json());
  // Devvit protects /internal; creation is available only through the moderator menu.
  app.post('/internal/menu/create-post', async (_req, res) => {
    try {
      const post = await redditClient.submitCustomPost({
        title: 'Pigeon Pizza Panic 🍕 — your lunch, their entire personality',
        entry: 'default',
        textFallback: { text: 'Tap hungry pigeons, let cats sleep, and protect your pizza for 45 seconds. Play Pigeon Pizza Panic on reddit.com or in the Reddit app.' }
      });
      res.json({ navigateTo: post.url });
    } catch (error) {
      console.error('Could not create Pigeon Pizza Panic post', error);
      res.status(500).json({ showToast: 'Could not create the game post. Please try again.' });
    }
  });
  return app;
}
