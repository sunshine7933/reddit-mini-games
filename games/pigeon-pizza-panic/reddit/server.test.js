import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './app.js';

test('moderator action creates the correct game post and returns its URL', async t => {
  let options;
  const app = createApp({ submitCustomPost: async value => { options = value; return { url: 'https://www.reddit.com/test-post' }; } });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}`;
  const response = await fetch(`${url}/internal/menu/create-post`, { method: 'POST' });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { navigateTo: 'https://www.reddit.com/test-post' });
  assert.equal(options.entry, 'default');
  assert.match(options.title, /Pigeon Pizza Panic/);
  assert.equal((await fetch(`${url}/api/create-post`, { method: 'POST' })).status, 404);
});

test('failed Reddit post creation gives a recoverable error', async t => {
  t.mock.method(console, 'error', () => {});
  const server = createApp({ submitCustomPost: async () => { throw new Error('Simulated Reddit failure'); } }).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const response = await fetch(`http://127.0.0.1:${server.address().port}/internal/menu/create-post`, { method: 'POST' });
  assert.equal(response.status, 500);
  assert.match((await response.json()).showToast, /try again/);
});
