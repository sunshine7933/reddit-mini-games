import express from 'express';
import {createServer, getServerPort, reddit} from '@devvit/web/server';
const app = express();
app.use(express.json());
// /internal and the moderator-only menu are enforced by Devvit.
// No public browser endpoint can create posts.
app.post('/internal/menu/create-post', async (_req, res) => {
  try {
    const post = await reddit.submitCustomPost({
      title: 'Chicken Crossing 🐔 — tiny wings, big snack ambitions',
      entry: 'default',
      textFallback: {text: 'Play Chicken Crossing in the Reddit app or on reddit.com. Dodge the traffic and reach the snacks!'}
    });
    res.json({navigateTo: post.url});
  } catch (error) {
    console.error('Could not create Chicken Crossing post', error);
    res.status(500).json({showToast:'Could not create the game post. Please try again.'});
  }
});
createServer(app).listen(getServerPort());
