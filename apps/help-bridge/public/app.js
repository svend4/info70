import { renderPrototype } from '/shell/render.js';
import { appConfigs, domainExperiences, localizedSummaries, opportunityScores, privacyCommitments, riskRoutes, supportedLocales, vettedResources } from '/shared/index.js';

renderPrototype(document, 'help-bridge', { appConfigs, domainExperiences, localizedSummaries, opportunityScores, privacyCommitments, riskRoutes, supportedLocales, vettedResources });
