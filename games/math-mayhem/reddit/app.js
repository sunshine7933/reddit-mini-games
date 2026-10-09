import express from 'express';
export function createApp(redditClient) {
  const app = express();
  app.use(express.json());
  // Devvit protects /internal; only the moderator menu exposes this endpoint.
  app.post('/internal/menu/create-post', async (_req, res) => {
    try {
      const post = await redditClient.submitCustomPost({
        title: 'Math Mayhem ✦ — Big brain. Small timer. Beautiful chaos.',
        entry: 'default',
        textFallback: { text: 'Solve math problems in 60 seconds. Choose easy, medium or hard and type whole-number answers. Earn 100 points per correct answer and 250 extra every five in a row. Play again and challenge a friend to beat your score! Play Math Mayhem on reddit.com or in the Reddit app.' }
      });
      res.json({ navigateTo: post.url });
    } catch (error) {
      console.error('Could not create Math Mayhem post', error);
      res.status(500).json({ showToast: 'Could not create the game post. Please try again.' });
    }
  });
  return app;
}
