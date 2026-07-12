const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const setText = (document, selector, value) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
};

const renderList = (document, selector, items, tag = 'li') => {
  const element = document.querySelector(selector);
  if (!element) return;
  element.innerHTML = items.map(item => `<${tag}>${escapeHtml(item)}</${tag}>`).join('');
};

export const renderPrototype = (document, slug, data) => {
  const { appConfigs, opportunityScores, vettedResources, riskRoutes, domainExperiences } = data;
  const config = appConfigs[slug];
  if (!config) throw new Error(`Unknown prototype slug: ${slug}`);
  const score = opportunityScores.find(item => item.id === slug);
  if (!score) throw new Error(`Missing opportunity score for ${slug}`);

  setText(document, '#audience', config.audience);
  setText(document, '#promise', config.promise);
  setText(document, '#primary-action', config.primaryAction);
  setText(document, '#app-rationale', `${score.title} erreicht ${score.demandScore}/100 im Demand Ranking. ${score.rationale}`);

  document.querySelector('#feature-cards').innerHTML = config.cards
    .map(card => `<article class="card"><h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(card.body)}</p></article>`)
    .join('');

  renderList(document, '#checklist', config.checklist);
  renderList(document, '#next-sprint', config.nextSprint, 'li');
  renderList(document, '#flow-steps', config.flowSteps, 'li');

  document.querySelector('#demo-panel').innerHTML = config.demoItems
    .map(item => `<button class="demo-chip" type="button" data-demo="${escapeHtml(item.value)}">${escapeHtml(item.label)}</button>`)
    .join('');

  const domain = domainExperiences?.[slug];
  if (domain) {
    setText(document, '#domain-title', domain.title);
    document.querySelector('#domain-items').innerHTML = domain.items
      .map(item => `<article class="domain-item"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.detail)}</span></article>`)
      .join('');
  }

  document.querySelector('#resources').innerHTML = vettedResources
    .map(resource => `<a href="${escapeHtml(resource.url)}" target="_blank" rel="noreferrer"><strong>${escapeHtml(resource.name)}</strong><span>${escapeHtml(resource.type)}</span></a>`)
    .join('');

  const output = document.querySelector('#demo-output');
  document.querySelector('#demo-panel').addEventListener('click', (event) => {
    const button = event.target.closest('[data-demo]');
    if (!button) return;
    const route = riskRoutes.find(item => item.risk === button.dataset.demo) || riskRoutes[0];
    output.textContent = `${route.risk}: ${route.immediateStep} → ${route.support}`;
  });

  document.querySelector('#primary-action').addEventListener('click', () => {
    const first = config.demoItems[0];
    const route = riskRoutes.find(item => item.risk === first.value) || riskRoutes[0];
    output.textContent = `${first.label}: ${route.immediateStep} → ${route.support}`;
  });
};
