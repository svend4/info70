// Unser Konzert – Zählhilfe für die Fachkraft. Ein Erwachsenen-Werkzeug: Die
// Fachkraft sammelt Vorschläge für Lieder, Tänze und Festprogramme und zählt je
// Vorschlag die Handzeichen. Kinder kommen hier nicht vor: keine Namen, keine
// Zuordnung einer Stimme zu einem Kind, keine Rangliste von Kindern.
//
// Die Seite wird einmal aufgebaut. Danach ändert eine Antwort nur die
// betroffenen Teile: den Knopf und die Zählung eines Vorschlags, die
// Programmliste oder die Meldungen im Formular. Der Zustand liegt nur im
// Speicher dieser Seite und ist nach dem Neuladen weg.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  ANREGUNGEN, ARTEN, BOGEN_TEXTE, DATEI_NAME, FEHLER_TEXTE, MAX_TITEL_ZEICHEN,
  MAX_VORSCHLAEGE, STANDARD_ART, TEXTE, artName, neuerVorschlag, programmTextdatei,
  programmTitel, zaehleHandzeichen, zaehlText, zaehlbogenZeilen,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');

/** Der gesamte Zustand dieser Seite. Nur im Speicher. */
const zustand = {
  vorschlaege: [],
  naechsteKennung: 1,
  art: STANDARD_ART,
  zuruecksetzenOffen: false,
};

const LISTE = 'list-style:none;margin:0;padding:0';
const KLEIN_REIHE = 'display:flex;flex-wrap:wrap;gap:0.5rem';
const EINGABE = 'width:100%;min-height:3rem;font:inherit;font-size:1.05rem;padding:0.6rem 0.8rem;border:2px solid var(--k-rand);border-radius:var(--k-radius);background:#fff;color:var(--k-tinte)';

const knopfKlasse = (an) => (an ? 'k-knopf' : 'k-knopf k-knopf--neutral');

// --- Hinweis, Formular -------------------------------------------------------

function hinweisBlock() {
  return el('section', { class: 'k-hinweis', 'aria-labelledby': 'hinweis-titel' },
    el('p', { id: 'hinweis-titel', style: 'margin:0 0 0.4rem;font-weight:700' }, TEXTE.hinweisTitel),
    el('p', { style: 'margin:0' }, TEXTE.hinweis),
    el('p', { style: 'margin:0.5rem 0 0;font-size:0.85rem;color:#4b5563' }, TEXTE.eigenentwurf));
}

function artKnopf(art) {
  return el('button', {
    type: 'button',
    class: knopfKlasse(false),
    style: 'flex:1 1 8rem;width:auto',
    'data-art': art.id,
    'aria-pressed': 'false',
    'aria-label': `${art.name} (Art des Vorschlags)`,
    onclick: () => {
      zustand.art = art.id;
      aktualisiereArtKnoepfe();
    },
  }, art.name);
}

/** Nur die Art-Knöpfe ändern sich: Zustand über aria-pressed und Klasse. */
function aktualisiereArtKnoepfe() {
  for (const knopf of app.querySelectorAll('[data-art]')) {
    const an = knopf.dataset.art === zustand.art;
    knopf.setAttribute('aria-pressed', String(an));
    knopf.className = knopfKlasse(an);
  }
}

function formularBlock() {
  return el('section', { class: 'k-karte', 'aria-labelledby': 'formular-titel' },
    el('h2', { id: 'formular-titel', style: 'margin:0 0 0.8rem;font-size:1.15rem' }, 'Vorschlag hinzufügen'),
    el('form', {
      onsubmit: (e) => {
        e.preventDefault();
        hinzufuegen();
      },
    },
      el('label', { for: 'titel', style: 'display:block;font-weight:600;margin-bottom:0.3rem' }, TEXTE.titelFeld),
      el('input', {
        id: 'titel',
        type: 'text',
        maxlength: String(MAX_TITEL_ZEICHEN),
        autocomplete: 'off',
        'aria-describedby': 'titel-hinweis',
        style: EINGABE,
      }),
      el('p', { id: 'titel-hinweis', style: 'font-size:0.9rem;margin:0.3rem 0 0.9rem' }, TEXTE.titelHinweis),
      el('p', { id: 'art-titel', style: 'font-weight:600;margin:0 0 0.4rem' }, TEXTE.artFeld),
      el('div', { role: 'group', 'aria-labelledby': 'art-titel', style: `${KLEIN_REIHE};margin-bottom:0.9rem` }, ...ARTEN.map(artKnopf)),
      el('p', { 'data-bereich': 'fehler', role: 'alert', style: 'color:var(--k-rot);font-weight:600;margin:0 0 0.6rem' }),
      el('p', { 'data-bereich': 'voll', style: 'font-weight:600;margin:0 0 0.6rem' }),
      el('button', { type: 'submit', class: 'k-knopf' }, 'Vorschlag hinzufügen')));
}

function meldeFehler(text) {
  app.querySelector('[data-bereich="fehler"]').textContent = text;
}

function hinzufuegen() {
  const feld = app.querySelector('#titel');
  const ergebnis = neuerVorschlag(feld.value, zustand.art, zustand.vorschlaege);
  if (!ergebnis.ok) {
    // Bei voller Liste steht die Meldung schon im Formular.
    meldeFehler(ergebnis.grund === 'voll' ? '' : FEHLER_TEXTE[ergebnis.grund]);
    return;
  }
  const vorschlag = { id: zustand.naechsteKennung, ...ergebnis.eintrag };
  zustand.naechsteKennung += 1;
  zustand.vorschlaege.push(vorschlag);
  feld.value = '';
  meldeFehler('');
  zeileHinzufuegen(vorschlag);
  aktualisiereFormular();
  aktualisiereAusgabe();
  feld.focus();
}

function aktualisiereFormular() {
  const voll = zustand.vorschlaege.length >= MAX_VORSCHLAEGE;
  const hinweis = app.querySelector('[data-bereich="voll"]');
  hinweis.textContent = voll ? FEHLER_TEXTE.voll : '';
  hinweis.hidden = !voll;
}

// --- Zählliste ----------------------------------------------------------------

function zaehllisteBlock() {
  return el('section', { class: 'k-karte', 'aria-labelledby': 'zaehl-titel' },
    el('h2', { id: 'zaehl-titel', style: 'margin:0 0 0.4rem;font-size:1.15rem' }, TEXTE.zaehlTitel),
    el('p', { style: 'margin:0 0 0.6rem;font-size:0.95rem' }, TEXTE.zaehlHilfe),
    el('ul', { 'data-bereich': 'zaehlliste', style: LISTE }),
    el('p', { 'data-bereich': 'zaehl-leer', style: 'margin:0' }, TEXTE.zaehlLeer));
}

function vorschlagZeile(v) {
  return el('li', { 'data-zeile': String(v.id), style: 'padding:0.75rem 0;border-bottom:1px solid var(--k-rand)' },
    el('p', { style: 'margin:0;font-weight:600;overflow-wrap:anywhere' }, v.titel),
    el('p', { style: 'margin:0.1rem 0 0.5rem;font-size:0.9rem' },
      `${artName(v.art)} · `,
      el('span', { 'data-zaehlung': String(v.id) }, zaehlText(v.handzeichen))),
    el('div', { style: KLEIN_REIHE },
      el('button', {
        type: 'button',
        class: 'k-knopf k-knopf--klein',
        'data-minus': String(v.id),
        'aria-label': `− Handzeichen für „${v.titel}“ abziehen`,
        onclick: () => zaehle(v.id, -1),
      }, '−'),
      el('button', {
        type: 'button',
        class: 'k-knopf k-knopf--klein',
        'data-plus': String(v.id),
        'aria-label': `+ Handzeichen für „${v.titel}“ hinzufügen`,
        onclick: () => zaehle(v.id, 1),
      }, '+'),
      el('button', {
        type: 'button',
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        'data-entfernen': String(v.id),
        'aria-label': `Entfernen: „${v.titel}“`,
        onclick: () => entferne(v.id),
      }, 'Entfernen')));
}

function zeileHinzufuegen(v) {
  app.querySelector('[data-bereich="zaehlliste"]').append(vorschlagZeile(v));
  aktualisiereZaehlung(v);
}

/** Nur Zählung und Zustand des „−“-Knopfes der einen Zeile ändern sich. */
function aktualisiereZaehlung(v) {
  const zeile = app.querySelector(`[data-zeile="${v.id}"]`);
  if (!zeile) return;
  zeile.querySelector('[data-zaehlung]').textContent = zaehlText(v.handzeichen);
  // „−“ bleibt antippbar, damit der Fokus nicht verloren geht. Bei null tut er nichts.
  const minus = zeile.querySelector('[data-minus]');
  const nichtsMehr = v.handzeichen === 0;
  minus.setAttribute('aria-disabled', String(nichtsMehr));
  minus.style.opacity = nichtsMehr ? '0.5' : '1';
}

function zaehle(id, richtung) {
  const v = zustand.vorschlaege.find((x) => x.id === id);
  if (!v) return;
  const neu = zaehleHandzeichen(v.handzeichen, richtung);
  if (neu === v.handzeichen) return;
  v.handzeichen = neu;
  aktualisiereZaehlung(v);
  aktualisiereAusgabe();
}

function entferne(id) {
  const zeile = app.querySelector(`[data-zeile="${id}"]`);
  const naechste = zeile?.nextElementSibling ?? zeile?.previousElementSibling ?? null;
  zustand.vorschlaege = zustand.vorschlaege.filter((v) => v.id !== id);
  zeile?.remove();
  aktualisiereFormular();
  aktualisiereAusgabe();
  (naechste?.querySelector('[data-plus]') ?? app.querySelector('#titel')).focus();
}

// --- Ausgabe: Programmliste, Dateien, Druck, Zurücksetzen -----------------

function ausgabeBlock() {
  return el('section', { class: 'k-karte', 'aria-labelledby': 'programm-titel' },
    el('h2', { id: 'programm-titel', style: 'margin:0 0 0.4rem;font-size:1.15rem' }, TEXTE.programmTitel),
    el('p', { style: 'margin:0 0 0.6rem;font-size:0.95rem' }, TEXTE.programmHilfe),
    el('ul', { 'data-bereich': 'programm', style: `${LISTE};font-size:1.1rem` }),
    el('p', { 'data-bereich': 'programm-leer', style: 'margin:0' }, TEXTE.programmLeer),
    el('div', { style: 'display:flex;flex-direction:column;gap:0.6rem;margin-top:1rem' },
      el('button', { type: 'button', class: 'k-knopf', onclick: () => drucken('programm') }, 'Programmliste drucken'),
      el('button', { type: 'button', class: 'k-knopf k-knopf--neutral', onclick: programmAlsDatei }, 'Programmliste als Textdatei herunterladen'),
      el('button', { type: 'button', class: 'k-knopf k-knopf--neutral', onclick: () => drucken('zaehlbogen') }, 'Zählbogen drucken (leeres Blatt)')),
    el('div', { style: 'margin-top:1.2rem;border-top:1px solid var(--k-rand);padding-top:0.9rem' },
      el('button', {
        type: 'button',
        class: 'k-knopf k-knopf--neutral',
        'data-aktion': 'zuruecksetzen',
        onclick: oeffneBestaetigung,
      }, 'Zählung zurücksetzen'),
      el('div', { 'data-bereich': 'bestaetigung', style: 'margin-top:0.8rem' })));
}

/** Nur die Programmliste (Bildschirm und Druck) wird neu geschrieben. */
function aktualisiereAusgabe() {
  const titel = programmTitel(zustand.vorschlaege);
  for (const bereich of ['programm', 'druck-programm']) {
    app.querySelector(`[data-bereich="${bereich}"]`).replaceChildren(
      ...titel.map((t) => el('li', { style: 'overflow-wrap:anywhere' }, t)));
  }
  aktualisiereLeer();
}

function aktualisiereLeer() {
  const leer = zustand.vorschlaege.length === 0;
  app.querySelector('[data-bereich="zaehl-leer"]').hidden = !leer;
  app.querySelector('[data-bereich="programm-leer"]').hidden = !leer;
}

function programmAlsDatei() {
  const blob = new Blob([programmTextdatei(zustand.vorschlaege)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  el('a', { href: url, download: DATEI_NAME }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Der Knopf sagt der Seite, welcher Bogen gedruckt wird. */
function drucken(bogen) {
  app.dataset.druck = bogen;
  window.print();
}

window.addEventListener('afterprint', () => {
  delete app.dataset.druck;
});

function oeffneBestaetigung() {
  zustand.zuruecksetzenOffen = true;
  zeichneBestaetigung();
  app.querySelector('[data-aktion="abbrechen"]').focus();
}

function schliesseBestaetigung() {
  zustand.zuruecksetzenOffen = false;
  zeichneBestaetigung();
  app.querySelector('[data-aktion="zuruecksetzen"]').focus();
}

function zeichneBestaetigung() {
  const box = app.querySelector('[data-bereich="bestaetigung"]');
  if (!zustand.zuruecksetzenOffen) {
    box.replaceChildren();
    return;
  }
  box.replaceChildren(
    el('p', { style: 'margin:0 0 0.6rem' }, TEXTE.zuruecksetzenFrage),
    el('div', { style: 'display:flex;flex-direction:column;gap:0.6rem' },
      el('button', { type: 'button', class: 'k-knopf', 'data-aktion': 'bestaetigen', onclick: zuruecksetzen }, TEXTE.zuruecksetzenJa),
      el('button', { type: 'button', class: 'k-knopf k-knopf--neutral', 'data-aktion': 'abbrechen', onclick: schliesseBestaetigung }, TEXTE.abbrechen)));
}

function zuruecksetzen() {
  for (const v of zustand.vorschlaege) {
    v.handzeichen = 0;
    aktualisiereZaehlung(v);
  }
  schliesseBestaetigung();
  aktualisiereAusgabe();
}

// --- Anregungen und Druckbögen --------------------------------------------

function anregungenBlock() {
  return el('section', { class: 'k-karte', 'aria-labelledby': 'anregungen-titel' },
    el('h2', { id: 'anregungen-titel', style: 'margin:0 0 0.4rem;font-size:1.05rem' }, TEXTE.anregungenTitel),
    el('p', { style: 'margin:0 0 0.6rem;font-size:0.9rem' }, TEXTE.anregungenHilfe),
    el('ul', { style: `${LISTE};font-size:0.95rem` },
      ...ANREGUNGEN.map((a) => el('li', { style: 'margin:0 0 0.6rem' }, `Anregung aus Praleska S. ${a.seite}: ${a.text}`))));
}

/** Programmliste zum Ausdrucken. Titel, keine Zahlen. */
function druckProgramm() {
  const b = BOGEN_TEXTE.programm;
  return el('section', { class: 'k-druck k-druck-programm', 'aria-label': 'Programmliste zum Ausdrucken' },
    el('h1', {}, b.titel),
    el('p', {}, b.hinweis),
    el('ul', { class: 'k-druck-punkte', 'data-bereich': 'druck-programm' }),
    el('p', { class: 'k-druck-abstand' }, b.fuss));
}

/** Leerer Zählbogen: Zeilen mit Linien, ohne Kästchen, ohne Zahlen, ohne Zeile für einen Namen. */
function druckZaehlbogen() {
  const b = BOGEN_TEXTE.zaehlbogen;
  return el('section', { class: 'k-druck k-druck-zaehl', 'aria-label': 'Zählbogen zum Ausdrucken' },
    el('h1', {}, b.titel),
    ...b.hinweise.map((text) => el('p', {}, text)),
    el('ul', { class: 'k-druck-liste k-druck-abstand' },
      ...zaehlbogenZeilen().map(() => el('li', { class: 'k-druck-zeile' },
        el('span', { class: 'k-druck-titelfeld' }),
        el('span', { class: 'k-druck-strichfeld' })))));
}

// --- Aufbau ---------------------------------------------------------------

function render() {
  app.replaceChildren(
    el('div', { class: 'k-bildschirm', style: 'display:flex;flex-direction:column;gap:1rem' },
      el('h1', { class: 'k-titel' }, TEXTE.titel),
      el('p', { class: 'k-untertitel' }, TEXTE.untertitel),
      hinweisBlock(),
      formularBlock(),
      zaehllisteBlock(),
      ausgabeBlock(),
      anregungenBlock(),
      el('footer', { class: 'k-fuss' },
        el('span', {}, `${TEXTE.fussText} · `),
        el('a', { href: '../../impressum.html' }, TEXTE.impressum))),
    druckProgramm(),
    druckZaehlbogen());
  aktualisiereArtKnoepfe();
  aktualisiereFormular();
  aktualisiereAusgabe();
  zeichneBestaetigung();
}

render();
