import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { localizedSummaries, supportedLocales } from '../packages/shared-data/src/index.js';

const apps = ['safe-search', 'media-time', 'help-bridge', 'ai-literacy'];

test('every app page contains the locale switcher placeholders', async () => {
  for (const app of apps) {
    const html = await readFile(`apps/${app}/public/index.html`, 'utf8');
    assert.match(html, /id="locale-switcher"/, `${app} has locale switcher`);
    assert.match(html, /id="localized-summary" aria-live="polite"/, `${app} has live localized summary`);
  }
});

test('localized summaries cover all supported locales', () => {
  for (const app of apps) {
    for (const locale of supportedLocales) {
      assert.ok(localizedSummaries[app][locale.code], `${app} has ${locale.code} summary`);
    }
  }
});
