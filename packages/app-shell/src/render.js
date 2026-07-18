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

const setHtml = (document, selector, html) => {
  const element = document.querySelector(selector);
  if (element) element.innerHTML = html;
  return element;
};

const renderList = (document, selector, items, tag = 'li') => setHtml(
  document,
  selector,
  items.map(item => `<${tag}>${escapeHtml(item)}</${tag}>`).join('')
);

export const renderPrototype = (document, slug, data) => {
  const { ageGuidance, appConfigs, domainExperiences, impactMetrics, localizedSummaries, opportunityScores, privacyCommitments, riskRoutes, supportedLocales, vettedResources } = data;
  const config = appConfigs[slug];
  if (!config) throw new Error(`Unknown prototype slug: ${slug}`);
  const score = opportunityScores.find(item => item.id === slug);
  if (!score) throw new Error(`Missing opportunity score for ${slug}`);

  setText(document, '#audience', config.audience);
  setText(document, '#promise', config.promise);
  setText(document, '#primary-action', config.primaryAction);
  setText(document, '#app-rationale', `${score.title} erreicht ${score.demandScore}/100 im Demand Ranking. ${score.rationale}`);

  setHtml(
    document,
    '#feature-cards',
    config.cards
      .map(card => `<article class="card"><h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(card.body)}</p></article>`)
      .join('')
  );

  renderList(document, '#checklist', config.checklist);
  renderList(document, '#next-sprint', config.nextSprint, 'li');
  renderList(document, '#flow-steps', config.flowSteps, 'li');

  const demoPanel = setHtml(
    document,
    '#demo-panel',
    config.demoItems
      .map(item => `<button class="demo-chip" type="button" data-demo="${escapeHtml(item.value)}">${escapeHtml(item.label)}</button>`)
      .join('')
  );

  const domain = domainExperiences?.[slug];
  if (domain) {
    setText(document, '#domain-title', domain.title);
    setHtml(
      document,
      '#domain-items',
      domain.items
        .map(item => `<article class="domain-item"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.detail)}</span></article>`)
        .join('')
    );
  }

  const metrics = impactMetrics?.[slug];
  if (metrics?.length) {
    setHtml(
      document,
      '#impact-metrics',
      metrics
        .map(item => `<article class="metric-item"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.target)}</span></article>`)
        .join('')
    );
  }

  const guidance = ageGuidance?.[slug];
  if (guidance?.length) {
    setHtml(
      document,
      '#age-guidance',
      guidance
        .map(item => `<article class="age-item"><strong>${escapeHtml(item.band)}</strong><span>${escapeHtml(item.guidance)}</span></article>`)
        .join('')
    );
  }

  const summaries = localizedSummaries?.[slug];
  if (summaries && supportedLocales?.length) {
    const summaryOutput = document.querySelector('#localized-summary');
    const localeSwitcher = document.querySelector('#locale-switcher');
    const setLocale = (locale) => {
      if (summaryOutput) summaryOutput.textContent = summaries[locale] || summaries.de;
      localeSwitcher?.querySelectorAll('button').forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.locale === locale));
      });
    };
    setHtml(
      document,
      '#locale-switcher',
      supportedLocales
        .map(locale => `<button type="button" data-locale="${escapeHtml(locale.code)}" aria-pressed="false">${escapeHtml(locale.label)}</button>`)
        .join('')
    );
    localeSwitcher?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-locale]');
      if (button) setLocale(button.dataset.locale);
    });
    setLocale('de');
  }

  if (privacyCommitments?.length) {
    renderList(document, '#privacy-commitments', privacyCommitments);
  }

  setHtml(
    document,
    '#resources',
    vettedResources
      .map(resource => `<a href="${escapeHtml(resource.url)}" target="_blank" rel="noreferrer"><strong>${escapeHtml(resource.name)}</strong><span>${escapeHtml(resource.type)}</span></a>`)
      .join('')
  );

  const output = document.querySelector('#demo-output');
  demoPanel?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-demo]');
    if (!button) return;
    const route = riskRoutes.find(item => item.risk === button.dataset.demo) || riskRoutes[0];
    if (output) output.textContent = `${route.risk}: ${route.immediateStep} → ${route.support}`;
  });

  document.querySelector('#primary-action')?.addEventListener('click', () => {
    const first = config.demoItems[0];
    const route = riskRoutes.find(item => item.risk === first.value) || riskRoutes[0];
    if (output) output.textContent = `${first.label}: ${route.immediateStep} → ${route.support}`;
  });
};
