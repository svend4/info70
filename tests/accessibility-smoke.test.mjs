import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const apps = ['safe-search', 'media-time', 'help-bridge', 'ai-literacy'];

test('app HTML includes baseline accessibility landmarks and live demo output', async () => {
  for (const app of apps) {
    const html = await readFile(`apps/${app}/public/index.html`, 'utf8');
    assert.match(html, /<html lang="de">/, `${app} declares German language`);
    assert.match(html, /<a class="skip-link" href="#main-content">/, `${app} has skip link`);
    assert.match(html, /<main class="shell" id="main-content">/, `${app} has targetable main landmark`);
    assert.match(html, /<h1 id="title">/, `${app} has page h1`);
    assert.match(html, /aria-live="polite"/, `${app} announces demo output politely`);
    assert.match(html, /<button id="primary-action" type="button">/, `${app} primary action has explicit type`);
    assert.match(html, /id="privacy-commitments"/, `${app} has privacy commitments section`);
    assert.match(html, /id="age-guidance"/, `${app} has age guidance section`);
    assert.match(html, /id="impact-metrics"/, `${app} has impact metrics section`);
  }
});

test('app CSS includes keyboard focus and reduced-motion affordances', async () => {
  for (const app of apps) {
    const css = await readFile(`apps/${app}/public/styles.css`, 'utf8');
    assert.match(css, /@import url\('\/shell\/styles.css'\)/, `${app} imports shared shell styles`);
  }
});


test('shared shell CSS includes keyboard focus and reduced-motion affordances', async () => {
  const css = await readFile('packages/app-shell/src/styles.css', 'utf8');
  assert.match(css, /:focus-visible/, 'shared CSS has visible keyboard focus styles');
  assert.match(css, /prefers-reduced-motion/, 'shared CSS respects reduced motion');
});
