import { renderPrototype } from '/shell/render.js';
import { appConfigs, domainExperiences, localizedSummaries, opportunityScores, privacyCommitments, riskRoutes, supportedLocales, vettedResources } from '/shared/index.js';

renderPrototype(document, 'safe-search', { appConfigs, domainExperiences, localizedSummaries, opportunityScores, privacyCommitments, riskRoutes, supportedLocales, vettedResources });
