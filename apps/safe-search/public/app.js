import { renderPrototype } from '/shell/render.js';
import { appConfigs, opportunityScores, vettedResources, riskRoutes, domainExperiences } from '/shared/index.js';

renderPrototype(document, 'safe-search', { appConfigs, opportunityScores, vettedResources, riskRoutes, domainExperiences });
