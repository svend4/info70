// Schwungblatt-Generator (Vorschule, für Fachkräfte & Eltern): Progression
// wählen, Muster ankreuzen, Schwungblatt drucken – geübt wird mit Stift auf
// PAPIER, bewusst nicht am Bildschirm. Die SVG-Zeilen werden lokal erzeugt.
// Praleska docs/10 (Top-30 Nr. 28). Politik docs/02: keine externen Anfragen,
// speichert nichts.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { MUSTER, musterFuerStufe, zeilenSVG, pruefeMuster } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const STUFEN_INFO = {
  1: 'Stufe 1 – große, weite Bögen (aus dem ganzen Arm)',
  2: 'Stufe 2 – mittlere Muster (aus dem Handgelenk)',
  3: 'Stufe 3 – feine Formen (aus den Fingern, Vorform der Schrift)',
};

let stufe = 1;
let gewaehlt = musterFuerStufe(1).map((m) => m.id);
const EINHEITEN = 8;   // Wiederholungen je Zeile
const ZEILEN_JE_MUSTER = 2;

function svgZeile(musterId) {
  const wrapper = el('div', { style: 'border-bottom:1px solid #e5e7eb;padding:0.2rem 0' });
  wrapper.innerHTML = zeilenSVG(musterId, EINHEITEN);
  return wrapper;
}

function blattKarte() {
  const muster = MUSTER.filter((m) => gewaehlt.includes(m.id));
  if (!muster.length) {
    return el('section', { class: 'k-karte sbg-nur-bildschirm' },
      el('p', { style: 'margin:0' }, 'Bitte oben mindestens ein Muster ankreuzen.'));
  }
  const zeilen = [];
  for (const m of muster) {
    zeilen.push(el('p', { style: 'margin:0.5rem 0 0.1rem;font-weight:600;font-size:0.95rem' }, `${m.emoji} ${m.name} – am grünen Punkt starten, dem gepunkteten Weg folgen`));
    for (let i = 0; i < ZEILEN_JE_MUSTER; i++) zeilen.push(svgZeile(m.id));
  }
  return el('section', { class: 'k-karte sbg-blatt' },
    el('div', { style: 'display:flex;justify-content:space-between;gap:1rem;align-items:baseline' },
      el('p', { style: 'margin:0;font-weight:700' }, '✏️ Mein Schwungblatt'),
      el('p', { style: 'margin:0;color:#6b7280' }, 'Name: ______________')),
    ...zeilen,
    el('p', { style: 'margin:0.6rem 0 0;font-size:0.8rem;color:#6b7280' }, 'info70-Schwungblatt · frei nutzbar (OER) · Stift locker halten, Richtung von links nach rechts'));
}

function render() {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel sbg-nur-bildschirm' }, '✏️ Schwungblatt-Generator'),
    el('p', { class: 'k-untertitel sbg-nur-bildschirm' }, 'Schwungübungen zum Drucken – geübt wird auf Papier'),
    el('section', { class: 'k-karte sbg-nur-bildschirm' },
      el('p', { style: 'margin-top:0;font-size:0.92rem' }, 'Wähle die Progressions-Stufe und die Muster – dann drucken. Das Kind übt mit Stift auf Papier: am grünen Punkt starten und den gepunkteten Weg nachfahren. Der Bildschirm ist nur die Druckerei.'),
      el('h2', { style: 'margin:0.4rem 0 0.2rem;font-size:1rem' }, 'Progression'),
      el('div', { class: 'k-antworten', role: 'radiogroup', 'aria-label': 'Stufe' },
        ...[1, 2, 3].map((s) => el('button', {
          class: `k-knopf k-knopf--klein ${s === stufe ? '' : 'k-knopf--neutral'}`,
          role: 'radio', 'aria-checked': String(s === stufe),
          onclick: () => { stufe = s; gewaehlt = musterFuerStufe(s).map((m) => m.id); render(); },
        }, `Stufe ${s}`))),
      el('p', { style: 'margin:0.2rem 0 0.4rem;font-size:0.85rem;color:#4b5563' }, STUFEN_INFO[stufe]),
      el('h2', { style: 'margin:0.4rem 0 0.2rem;font-size:1rem' }, 'Muster'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Muster' },
        ...MUSTER.map((m) => {
          const an = gewaehlt.includes(m.id);
          return el('button', {
            class: `k-knopf k-knopf--klein ${an ? '' : 'k-knopf--neutral'}`,
            role: 'checkbox', 'aria-checked': String(an),
            onclick: () => { gewaehlt = an ? gewaehlt.filter((x) => x !== m.id) : [...gewaehlt, m.id]; render(); },
          }, `${an ? '☑' : '☐'} ${m.emoji} ${m.name} (St. ${m.stufe})`);
        })),
      el('div', { class: 'k-antworten', style: 'margin-top:0.4rem' },
        el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Schwungblatt drucken'))),
    blattKarte(),
    el('footer', { class: 'k-fuss sbg-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Fachkräfte & Familien · geübt wird auf Papier · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

const fehler = pruefeMuster();
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
