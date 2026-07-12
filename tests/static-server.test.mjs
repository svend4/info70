import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { startStaticPrototypeServer } from '../packages/static-server/src/server.js';

const fetchText = async (port, path) => {
  const response = await fetch(`http://127.0.0.1:${port}${path}`);
  return { status: response.status, text: await response.text() };
};

test('static server serves app files and shared modules', async () => {
  const server = startStaticPrototypeServer({ appUrl: new URL('../apps/help-bridge/server.mjs', import.meta.url).href, port: 0 });
  await once(server, 'listening');
  const { port } = server.address();

  try {
    const home = await fetchText(port, '/');
    assert.equal(home.status, 200);
    assert.match(home.text, /Youth Help Bridge/);

    const shared = await fetchText(port, '/shared/index.js');
    assert.equal(shared.status, 200);
    assert.match(shared.text, /appConfigs/);

    const shell = await fetchText(port, '/shell/render.js');
    assert.equal(shell.status, 200);
    assert.match(shell.text, /renderPrototype/);
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
