import test from 'node:test';
import assert from 'node:assert/strict';
import { appConfigs, domainExperiences, opportunityScores, riskRoutes, vettedResources } from '../packages/shared-data/src/index.js';

const appIds = ['safe-search', 'media-time', 'help-bridge', 'ai-literacy'];

test('every app has a complete interactive config and demand score', () => {
  for (const id of appIds) {
    assert.ok(appConfigs[id], `${id} config exists`);
    assert.ok(appConfigs[id].cards.length >= 3, `${id} has cards`);
    assert.ok(appConfigs[id].flowSteps.length >= 3, `${id} has flow steps`);
    assert.ok(appConfigs[id].demoItems.length >= 2, `${id} has demo items`);
    assert.ok(opportunityScores.some(score => score.id === id), `${id} has demand score`);
    assert.ok(domainExperiences[id].items.length >= 3, `${id} has domain experience items`);
  }
});

test('demo items map to known risk routes', () => {
  const risks = new Set(riskRoutes.map(route => route.risk));
  for (const config of Object.values(appConfigs)) {
    for (const item of config.demoItems) {
      assert.ok(risks.has(item.value), `${item.value} has a matching route`);
    }
  }
});

test('trusted resources include child-safe search and help paths', () => {
  assert.ok(vettedResources.some(resource => resource.name === 'fragFINN'));
  assert.ok(vettedResources.some(resource => resource.name === 'jugend.support'));
});
