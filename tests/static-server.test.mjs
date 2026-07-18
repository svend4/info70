import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { startStaticPrototypeServer } from '../packages/static-server/src/server.js';

const fetchText = async (port, path) => {
  const response = await fetch(`http://127.0.0.1:${port}${path}`);
  return { status: response.status, text: await response.text(), headers: response.headers };
};

test('static server serves app files and shared modules', async () => {
  const server = startStaticPrototypeServer({ appUrl: new URL('../apps/help-bridge/server.mjs', import.meta.url).href, port: 0 });
  await once(server, 'listening');
  const { port } = server.address();

  try {
    const home = await fetchText(port, '/');
    assert.equal(home.status, 200);
    assert.match(home.text, /Youth Help Bridge/);
    assert.match(home.headers.get('content-type'), /text\/html; charset=utf-8/);
    assert.equal(home.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(home.headers.get('referrer-policy'), 'no-referrer');
    assert.equal(home.headers.get('cache-control'), 'no-store');
    assert.match(home.headers.get('permissions-policy'), /camera=\(\)/);
    assert.match(home.headers.get('content-security-policy'), /default-src 'self'/);

    const shared = await fetchText(port, '/shared/index.js');
    assert.equal(shared.status, 200);
    assert.match(shared.headers.get('content-type'), /application\/javascript; charset=utf-8/);
    assert.match(shared.text, /appConfigs/);

    const shell = await fetchText(port, '/shell/render.js');
    assert.equal(shell.status, 200);
    assert.match(shell.text, /renderPrototype/);

    const shellStyles = await fetchText(port, '/shell/styles.css');
    assert.equal(shellStyles.status, 200);
    assert.match(shellStyles.headers.get('content-type'), /text\/css; charset=utf-8/);
    assert.match(shellStyles.text, /focus-visible/);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

test('static server blocks path traversal outside public root', async () => {
  const server = startStaticPrototypeServer({ appUrl: new URL('../apps/safe-search/server.mjs', import.meta.url).href, port: 0 });
  await once(server, 'listening');
  const { port } = server.address();

  try {
    const traversal = await fetchText(port, '/..%2F..%2Fpackage.json');
    assert.equal(traversal.status, 403);
    assert.equal(traversal.text, 'Forbidden');
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});


test('static server handles malformed encoded URLs with 400', async () => {
  const server = startStaticPrototypeServer({ appUrl: new URL('../apps/media-time/server.mjs', import.meta.url).href, port: 0 });
  await once(server, 'listening');
  const { port } = server.address();

  try {
    const malformed = await fetchText(port, '/%E0%A4%A');
    assert.equal(malformed.status, 400);
    assert.equal(malformed.text, 'Bad request');
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});


test('static server supports HEAD and rejects unsupported methods', async () => {
  const server = startStaticPrototypeServer({ appUrl: new URL('../apps/ai-literacy/server.mjs', import.meta.url).href, port: 0 });
  await once(server, 'listening');
  const { port } = server.address();

  try {
    const head = await fetch(`http://127.0.0.1:${port}/`, { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');

    const missingHead = await fetch(`http://127.0.0.1:${port}/missing.html`, { method: 'HEAD' });
    assert.equal(missingHead.status, 404);
    assert.equal(await missingHead.text(), '');

    const post = await fetch(`http://127.0.0.1:${port}/`, { method: 'POST' });
    assert.equal(post.status, 405);
    assert.equal(post.headers.get('allow'), 'GET, HEAD');
    assert.equal(await post.text(), 'Method not allowed');
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
