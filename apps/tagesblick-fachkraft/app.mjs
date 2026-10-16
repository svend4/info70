// Tagesblick Fachkraft: die Fachkraft hält am Tag ihre EIGENEN Handlungen fest
// (Häkchen). Kinder kommen in dieser App nicht vor: keine Namen, keine Kürzel,
// keine Bewertung, keine Summe über Kinder.
//
// Gespeichert wird nichts. Der Zustand dieser Seite (Tag und erledigte
// Handlungen) liegt in einer Variablen im Speicher und ist nach dem Neuladen
// weg. Beim Start wird nur der Altbestand der früheren Fassung entfernt; es
// wird nie etwas geschrieben.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { ALTER_SCHLUESSEL, BEREICHE, tagesSchluessel, tagesLabel, bilanzText } from './logik.mjs';

installiereNetzwerkWaechter();

// Altbestand entfernen: nur löschen, nie schreiben.
try {
  localStorage.removeItem(ALTER_SCHLUESSEL);
} catch {
  // Kein Speicher verfügbar: dann gibt es auch nichts zu entfernen.
}

const app = document.getElementById('app');

function neuerTag() {
  return { tag: tagesSchluessel(), erledigt: new Set() };
}

/** Der gesamte Zustand dieser Seite. Nur im Speicher. */
let zustand = neuerTag();

/** Ist der Tag gewechselt (Seite lange offen), beginnt ein leerer Tag. */
function tagGewechselt() {
  if (zustand.tag === tagesSchluessel()) return false;
  zustand = neuerTag();
  return true;
}

function knopfKlasse(an) {
  return an ? 'k-knopf' : 'k-knopf k-knopf--neutral';
}

function knopfText(handlung, an) {
  return `${an ? '☑' : '☐'} ${handlung.name}`;
}

/** Nur die Bilanz des betroffenen Bereichs neu schreiben. */
function aktualisiereBilanz(bereich) {
  const anzeige = app.querySelector(`[data-bilanz="${bereich.id}"]`);
  if (anzeige) anzeige.textContent = bilanzText(bereich, zustand.erledigt);
}

/** Antwort auf eine Frage: nur deren Knopf und die Bilanz des Bereichs ändern sich. */
function umschalten(bereich, handlung, knopf) {
  if (tagGewechselt()) return render();
  if (zustand.erledigt.has(handlung.id)) zustand.erledigt.delete(handlung.id);
  else zustand.erledigt.add(handlung.id);
  const an = zustand.erledigt.has(handlung.id);
  knopf.setAttribute('aria-pressed', String(an));
  knopf.className = knopfKlasse(an);
  knopf.textContent = knopfText(handlung, an);
  aktualisiereBilanz(bereich);
}

function handlungKarte(bereich, handlung) {
  const an = zustand.erledigt.has(handlung.id);
  return el('div', {},
    el('button', {
      class: knopfKlasse(an),
      'aria-pressed': String(an),
      'aria-label': handlung.frage,
      onclick: (e) => umschalten(bereich, handlung, e.currentTarget),
    }, knopfText(handlung, an)),
    el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0.3rem 0 0.9rem' }, handlung.hilfe));
}

function bereichKarte(bereich) {
  return el('section', { class: 'k-karte', 'aria-labelledby': `bereich-${bereich.id}` },
    el('h2', { id: `bereich-${bereich.id}`, style: 'margin:0 0 0.3rem;font-size:1.1rem' }, bereich.name),
    el('p', {
      'data-bilanz': bereich.id,
      style: 'font-size:0.9rem;font-weight:600;margin:0 0 0.8rem',
    }, bilanzText(bereich, zustand.erledigt)),
    ...bereich.handlungen.map((h) => handlungKarte(bereich, h)));
}

/**
 * Tagesbogen zum Ausdrucken. Bewusst leer: Datum und Häkchen werden von Hand
 * eingetragen, auf dem Papier steht keine Anzeige vom Bildschirm (docs/02).
 */
function druckBogen() {
  return el('section', { class: 'k-druck', 'aria-label': 'Tagesbogen zum Ausdrucken' },
    el('h1', {}, 'Tagesbogen Fachkraft'),
    el('p', {}, 'Eigene Handlungen der Fachkraft. Keine Angaben zu Kindern.'),
    el('p', { style: 'margin-top:6mm' }, 'Datum: ________________________'),
    ...BEREICHE.map((b) => el('section', {},
      el('h2', {}, b.name),
      el('ul', {}, ...b.handlungen.map((h) => el('li', {}, `☐ ${h.name}`))))),
    el('p', { style: 'margin-top:6mm' }, 'Häkchen von Hand setzen. Dieser Bogen enthält keine Namen und keine Bewertung.'));
}

function render() {
  app.replaceChildren(
    el('div', { class: 'k-bildschirm' },
      el('h1', { class: 'k-titel' }, 'Tagesblick Fachkraft'),
      el('p', { class: 'k-untertitel' }, 'Eigene Handlungen für heute, ohne Angaben zu Kindern'),

      el('section', { class: 'k-karte' },
        el('p', { style: 'margin:0;font-size:0.95rem' },
          el('strong', {}, 'Heute: '), tagesLabel(zustand.tag)),
        el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem' },
          'Du hältst fest, was du heute selbst getan hast. Kinder werden hier weder benannt noch bewertet, und es wird nichts gespeichert. Die Häkchen gelten nur, solange diese Seite offen ist.')),

      ...BEREICHE.map(bereichKarte),

      el('section', { class: 'k-karte' },
        el('p', { style: 'margin:0 0 0.6rem;font-size:0.9rem' },
          'Der Tagesbogen zum Ausdrucken ist leer. Datum und Häkchen werden von Hand eingetragen.'),
        el('button', {
          class: 'k-knopf k-knopf--neutral',
          onclick: () => window.print(),
        }, '🖨️ Tagesbogen drucken')),

      el('footer', { class: 'k-fuss' },
        el('span', {}, 'Werkzeug für Fachkräfte · werbefrei · ohne Konto · nichts wird gespeichert · Handlungsvorschläge: Eigenentwurf · '),
        el('a', { href: 'eltern.html' }, 'ℹ️ Info für Träger & Leitung'), el('span', {}, ' · '),
        el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz'))),

    druckBogen());
}

render();
