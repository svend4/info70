import { renderPrototype } from '/shell/render.js';
import { appConfigs, opportunityScores, vettedResources, riskRoutes, domainExperiences } from '/shared/index.js';

renderPrototype(document, 'help-bridge', { appConfigs, opportunityScores, vettedResources, riskRoutes, domainExperiences });
