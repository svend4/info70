import { access, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ageGuidance, appConfigs, domainExperiences, impactMetrics, localizedSummaries, opportunityScores, privacyCommitments, riskRoutes, supportedLocales, vettedResources } from '../packages/shared-data/src/index.js';

const requiredApps = ['safe-search', 'media-time', 'help-bridge', 'ai-literacy'];
const requiredRootFiles = ['package.json', 'docs/opportunity-analysis.md', 'packages/shared-data/src/index.js', 'packages/app-shell/src/render.js', 'packages/app-shell/src/styles.css', 'packages/static-server/src/server.js'];

for (const file of requiredRootFiles) {
  await access(file);
}

for (const app of requiredApps) {
  const dir = join('apps', app);
  await access(join(dir, 'package.json'));
  await access(join(dir, 'server.mjs'));
  await access(join(dir, 'public', 'index.html'));
  await access(join(dir, 'public', 'styles.css'));
  await access(join(dir, 'public', 'app.js'));

  if (!appConfigs[app]) {
    throw new Error(`Missing appConfigs entry for ${app}`);
  }
  if (!appConfigs[app].flowSteps?.length || !appConfigs[app].demoItems?.length) {
    throw new Error(`Missing flow steps or demo items for ${app}`);
  }
  if (!domainExperiences[app]?.items?.length) {
    throw new Error(`Missing domain experience items for ${app}`);
  }
  if (!ageGuidance[app]?.length || ageGuidance[app].length < 3) {
    throw new Error(`Missing age guidance for ${app}`);
  }
  if (!impactMetrics[app]?.length || impactMetrics[app].length < 3) {
    throw new Error(`Missing impact metrics for ${app}`);
  }
  if (!supportedLocales.every(locale => localizedSummaries[app]?.[locale.code])) {
    throw new Error(`Missing localized summaries for ${app}`);
  }
  if (!opportunityScores.some(score => score.id === app)) {
    throw new Error(`Missing opportunity score for ${app}`);
  }
}

if (privacyCommitments.length < 4) {
  throw new Error('Expected at least four privacy commitments.');
}
if (riskRoutes.length < 4) {
  throw new Error('Expected at least four risk routes for help flows.');
}
if (vettedResources.length < 5) {
  throw new Error('Expected at least five vetted resources.');
}

const analysis = await readFile('docs/opportunity-analysis.md', 'utf8');
for (const app of requiredApps) {
  if (!analysis.includes(app)) {
    throw new Error(`Opportunity analysis does not mention ${app}`);
  }
}

const apps = await readdir('apps');
console.log(`Validated ${apps.length} app prototypes, shared shell/server packages, ${vettedResources.length} vetted resources, and ${riskRoutes.length} risk routes.`);
