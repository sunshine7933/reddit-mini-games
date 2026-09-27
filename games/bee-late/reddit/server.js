import { createServer, getServerPort, reddit } from '@devvit/web/server';
import { createApp } from './app.js';
createServer(createApp(reddit)).listen(getServerPort());
