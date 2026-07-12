import { renderPrototype } from '/shell/render.js';
import { appConfigs, opportunityScores, vettedResources, riskRoutes, domainExperiences } from '/shared/index.js';

renderPrototype(document, 'media-time', { appConfigs, opportunityScores, vettedResources, riskRoutes, domainExperiences });
