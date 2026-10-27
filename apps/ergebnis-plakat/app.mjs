// Ergebnis-Plakat (docs/09 Ось G, zu mitmach-arena). Aus einer Abstimmung
// (Klassen-Koffer-Datei oder der laufenden mitmach-arena-Umfrage auf diesem
// Gerät) wird ein großformatiges Balkendiagramm fürs Klassenzimmer – rein
// clientseitig, druckbar. Politik docs/02: keine externen Anfragen; das Plakat
// selbst speichert nichts.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { pruefeKoffer } from '../mitmach-arena/koffer.mjs';
import { baueBalken, fussText } from './plakat.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const FARBEN = ['#2563eb', '#16a34a', '#d97706', '#7c3aed', '#db2777', '#0891b2'];
const BEISPIEL = { frage: 'Wohin geht der Klassenausflug?', optionen: ['Zoo', 'Naturkundemuseum', 'Kletterwald', 'Schwimmbad'], stimmen: [11, 5, 8, 3] };

let umfrage = null;

async function importiere(datei) {
  if (!datei) return;
  try {
    const inhalt = JSON.parse(await datei.text());
    const fehler = pruefeKoffer(inhalt);
    if (fehler.length) { alert('Datei nicht lesbar:\n' + fehler.join('\n')); return; }
    umfrage = inhalt;
    render();
  } catch (e) { alert('Das war keine gültige Klassen-Koffer-Datei.'); }
}

function ladeLaufende() {
  try {
    const u = JSON.parse(localStorage.getItem('ma.umfrage') ?? 'null');
    if (!u || pruefeKoffer({ art: 'mitmach-arena-umfrage', version: 1, ...u }).length) {
      alert('Auf diesem Gerät läuft gerade keine mitmach-arena-Abstimmung.');
      return;
    }
    umfrage = u; render();
  } catch (e) { alert('Keine laufende Abstimmung gefunden.'); }
}

function plakat() {
  const p = baueBalken(umfrage);
  return el('section', { class: 'k-karte ep-plakat' },
    el('p', { class: 'ep-frage' }, p.frage),
    ...p.balken.map((b, i) => el('div', { style: 'margin:0.6rem 0' },
      el('div', { style: 'display:flex;justify-content:space-between;font-weight:700;font-size:1.2rem' },
        el('span', {}, b.text),
        el('span', {}, `${b.prozent} % (${b.stimmen})`)),
      el('div', { style: 'background:#e5e7eb;border-radius:0.5rem;overflow:hidden;height:2rem;margin-top:0.2rem' },
        el('div', { class: 'ep-balken', style: `width:${Math.max(2, b.prozent)}%;background:${FARBEN[i % FARBEN.length]};height:100%` })))),
    el('p', { class: 'ep-fuss' }, fussText(p)));
}

function render() {
  const importFeld = el('input', { type: 'file', accept: '.json,application/json', style: 'display:block;margin:0.4rem 0', 'aria-label': 'Klassen-Koffer importieren', onchange: (e) => importiere(e.target.files[0]) });
  app.replaceChildren(
    el('h1', { class: 'k-titel ep-nur-bildschirm' }, '📊 Ergebnis-Plakat'),
    el('p', { class: 'k-untertitel ep-nur-bildschirm' }, 'Aus einer Abstimmung ein großes Plakat fürs Klassenzimmer machen – zum Ausdrucken.'),
    el('section', { class: 'k-karte ep-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Ergebnis laden'),
      importFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: ladeLaufende }, '📥 Laufende mitmach-arena-Abstimmung'),
        el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => { umfrage = BEISPIEL; render(); } }, '🎬 Beispiel')),
      el('p', { style: 'font-size:0.85rem;color:#4b5563' }, 'Die Klassen-Koffer-Datei exportierst du in der mitmach-arena. Es wird nichts gesendet oder gespeichert.')),
    umfrage ? plakat() : el('section', { class: 'k-karte ep-nur-bildschirm' }, el('p', { style: 'margin:0;color:#4b5563' }, 'Noch kein Ergebnis geladen. Importiere eine Datei oder lade das Beispiel.')),
    umfrage ? el('section', { class: 'k-karte ep-nur-bildschirm' },
      el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Plakat drucken')) : '',
    el('footer', { class: 'k-fuss ep-nur-bildschirm' },
      el('span', {}, 'für die Klasse · werbefrei · läuft offline · es wird nichts gespeichert · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
