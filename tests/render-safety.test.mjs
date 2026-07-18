import test from 'node:test';
import assert from 'node:assert/strict';
import { renderPrototype } from '../packages/app-shell/src/render.js';
import * as sharedData from '../packages/shared-data/src/index.js';

const createElement = () => ({
  dataset: {},
  innerHTML: '',
  textContent: '',
  addEventListener() {},
  querySelectorAll() { return []; },
  setAttribute() {}
});

const createSparseDocument = (selectors = []) => {
  const elements = new Map(selectors.map(selector => [selector, createElement()]));
  return {
    querySelector(selector) {
      return elements.get(selector) || null;
    },
    getElement(selector) {
      return elements.get(selector);
    }
  };
};

test('renderer tolerates missing optional prototype placeholders', () => {
  const document = createSparseDocument(['#audience', '#promise', '#app-rationale']);

  assert.doesNotThrow(() => renderPrototype(document, 'safe-search', sharedData));
  assert.equal(document.getElement('#audience').textContent, sharedData.appConfigs['safe-search'].audience);
  assert.match(document.getElement('#app-rationale').textContent, /Demand Ranking/);
});

test('renderer still fills rich sections when placeholders exist', () => {
  const document = createSparseDocument(['#feature-cards', '#impact-metrics', '#age-guidance', '#resources']);

  renderPrototype(document, 'ai-literacy', sharedData);

  assert.match(document.getElement('#feature-cards').innerHTML, /Quellenampel/);
  assert.match(document.getElement('#impact-metrics').innerHTML, /Source-check habit/);
  assert.match(document.getElement('#age-guidance').innerHTML, /12–14/);
  assert.match(document.getElement('#resources').innerHTML, /Internet-ABC/);
});
