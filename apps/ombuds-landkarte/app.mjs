// Ombuds-Landkarte: Wegweiser zu Beschwerde-/Ombudsstellen (fuer ELTERN).
// Gefilterte Karten auf foerder-navigator-Muster: welche Stelle ist fuer
// welches Problem zustaendig und wie erreicht man sie? Daten statisch
// gepflegt (docs/09 Nr. 38). Keine externen Anfragen; Filter nur im Speicher.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { filtereStellen, themaHinweis } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/stellen.json').then((r) => r.json());
let thema = null;

function render() {
  const treffer = filtereStellen(daten.stellen, thema);
  const hinweis = thema ? themaHinweis(thema) : '';
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧭 Ombuds-Landkarte'),
    el('p', { class: 'k-untertitel' }, 'Wer hilft bei welchem Problem? Ein Wegweiser für Eltern.'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0;font-size:0.9rem' }, daten.hinweis),
      el('p', { style: 'font-weight:600;margin-bottom:0.4rem' }, 'Worum geht es?'),
      el('div', { style: 'display:flex;gap:0.4rem;flex-wrap:wrap' },
        el('button', { class: `k-knopf k-knopf--klein ${thema === null ? '' : 'k-knopf--neutral'}`, 'aria-pressed': String(thema === null), onclick: () => { thema = null; render(); } }, 'Alles zeigen'),
        ...daten.themen.map((t) =>
          el('button', { class: `k-knopf k-knopf--klein ${thema === t.code ? '' : 'k-knopf--neutral'}`, 'aria-pressed': String(thema === t.code), onclick: () => { thema = t.code; render(); } }, t.label))),
      hinweis ? el('p', { class: 'k-hinweis', style: 'margin:0.6rem 0 0' }, `👉 ${hinweis}`) : ''),
    el('p', { style: 'font-size:0.9rem;color:#4b5563;margin:0 0.2rem' }, `${treffer.length} ${treffer.length === 1 ? 'Stelle' : 'Stellen'}`),
    ...treffer.map(stelleKarte),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · keine Anfragen an fremde Server · Stand: ' + daten.stand + ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

function stelleKarte(s) {
  return el('section', { class: 'k-karte' },
    el('div', { style: 'display:flex;justify-content:space-between;align-items:baseline;gap:0.5rem' },
      el('h2', { style: 'margin:0;font-size:1.1rem' }, s.name),
      el('span', { style: 'font-size:0.75rem;background:var(--k-hell,#eef6ff);border-radius:0.5rem;padding:0.1rem 0.5rem;white-space:nowrap' }, s.ebene)),
    el('p', { style: 'margin:0.4rem 0' }, el('strong', {}, 'Wofür: '), s.wofuer),
    el('p', { style: 'margin:0.4rem 0' }, el('strong', {}, 'So erreichen Sie die Stelle: '), s.soFindenSie),
    el('p', { style: 'margin:0.4rem 0 0;font-size:0.85rem;color:#4b5563' }, `⚖️ Grundlage: ${s.grundlage}`));
}

render();
