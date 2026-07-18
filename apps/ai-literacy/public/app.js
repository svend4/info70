import { renderPrototype } from '/shell/render.js';
import { appConfigs, domainExperiences, localizedSummaries, opportunityScores, privacyCommitments, riskRoutes, supportedLocales, vettedResources } from '/shared/index.js';

renderPrototype(document, 'ai-literacy', { appConfigs, domainExperiences, localizedSummaries, opportunityScores, privacyCommitments, riskRoutes, supportedLocales, vettedResources });
