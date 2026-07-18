// Elternabend-Kit: dreisprachiges Handout (de/uk/ru) ueber mini-i18n.
// Erreicht auch Familien mit geringen Deutschkenntnissen (Katalog Nr. 24;
// Mehrsprachigkeit ist Monorepo-Ziel, docs/04 Etappe 3).
// Politik: keine externen Anfragen; Sprachwahl nur im Speicher der Seite
// (bewusst KEIN localStorage - das Handout wird meist am Schul-PC gedruckt).
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { erstelleSprache } from '../../packages/kinder-ui/js/sprache.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const kataloge = await fetch('daten/sprachen.json').then((r) => r.json());
const sprache = erstelleSprache({ kataloge, standard: 'de' });
const t = (k) => sprache.t(k);

const MODULE = ['kettenbriefe', 'kostenfallen', 'sharenting', 'voreinstellungen'];

function render() {
  app.replaceChildren(
    el('div', { class: 'eak-nur-bildschirm' },
      el('section', { class: 'k-karte' },
        el('p', { style: 'font-weight:600;margin-top:0' }, 'Sprache · Мова · Язык:'),
        el('div', { style: 'display:flex;gap:0.5rem;flex-wrap:wrap' },
          ...[['de', 'Deutsch'], ['en', 'English'], ['uk', 'Українська'], ['ru', 'Русский']].map(([code, name]) =>
            el('button', {
              class: `k-knopf k-knopf--klein ${sprache.aktuelle() === code ? '' : 'k-knopf--neutral'}`,
              'aria-pressed': String(sprache.aktuelle() === code),
              onclick: () => { sprache.setze(code); render(); },
            }, name))),
        el('div', { class: 'k-antworten', style: 'margin-top:0.5rem' },
          el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, '🖨️ Drucken'),
          el('a', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'text-decoration:none;text-align:center', href: './' }, '↩️ Zurück zum Kit')))),
    el('section', { class: 'k-karte' },
      el('h1', { style: 'font-size:1.4rem;margin:0' }, t('titel')),
      el('p', { style: 'margin:0.25rem 0 0.5rem;color:#4b5563;font-size:0.9rem' }, t('untertitel')),
      el('p', { style: 'margin:0' }, t('intro'))),
    ...MODULE.map((m) =>
      el('section', { class: 'k-karte' },
        el('h2', { style: 'margin-top:0;font-size:1.1rem' }, t(`m_${m}_titel`)),
        el('p', { style: 'margin:0 0 0.5rem' }, t(`m_${m}_text`)),
        el('ol', { style: 'margin:0;padding-left:1.2rem' },
          ...t(`m_${m}_tipps`).map((tipp) => el('li', { style: 'margin:0.25rem 0' }, tipp))))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, t('probier_titel')),
      el('p', { style: 'margin:0' }, t('probier_text'))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, t('hilfe_titel')),
      el('ul', { style: 'margin:0;padding-left:1.2rem' },
        ...t('hilfe_liste').map((h) => el('li', { style: 'margin:0.25rem 0' }, h)))),
    el('footer', { class: 'k-fuss' },
      el('span', {}, t('fussnote')), el('span', {}, ' · '),
      el('a', { class: 'eak-nur-bildschirm', href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
