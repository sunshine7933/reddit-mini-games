import {createServer,getServerPort,reddit,redis,context} from '@devvit/web/server';
import {createApp} from './app.js';
createServer(createApp({reddit,redis,getUserId:()=>context.userId})).listen(getServerPort());
