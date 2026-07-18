import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('CI workflow runs the repository check script on pull requests', async () => {
  const workflow = await readFile('.github/workflows/ci.yml', 'utf8');
  assert.match(workflow, /pull_request:/);
  assert.match(workflow, /node-version: \[18\.x, 20\.x, 22\.x\]/);
  assert.match(workflow, /npm run check/);
});

test('package check script runs tests and validation', async () => {
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  assert.equal(pkg.scripts.check, 'npm test && npm run validate');
});
