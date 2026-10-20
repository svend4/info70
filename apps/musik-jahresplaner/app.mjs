// Musik-Jahresplaner für Fachkräfte (Praleska, Musikteil, S. 160–174; Katalog docs/10, Nr. 87).
//
// Werkzeug für Erwachsene: Stückliste, Monatsübersicht und Jahresbogen gehören der
// Fachkraft. Kein Bildschirm für Kinder, darum keine eltern.html. Politik docs/02: keine
// externen Anfragen; gespeichert werden nur die Häkchen, und
// der Löschknopf der Daten-Karte entfernt sie.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { datenKarte } from '../../packages/kinder-ui/js/daten-karte.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  SCHLUESSEL, TITEL_MAX, MONATE, BEREICHE, HERKUNFT, FESTE_QUELLE, FEST_SEITE, FESTE_VORSCHLAEGE,
  KENNZEICHNUNG_VORSCHLAG, KENNZEICHNUNG_UEBERSETZUNG,
  leererStand, ladeStand, normalisiereStand, fuegeStueckHinzu, entferneStueck, umschalteHaken,
  istHaken, zaehleProMonat, zaehlWort, sortiereStuecke, druckGliederung, istLeer, bereichName, herkunftText,
  gespeicherterStand,
} from './logik.mjs';

installiereNetzwerkWaechter();

const FELD_STIL = 'width:100%;min-height:3rem;font-size:1rem;padding:0.4rem 0.6rem;box-sizing:border-box;'
  + 'border:2px solid var(--k-blau);border-radius:0.5rem;background:#fff;color:inherit';
const LABEL_STIL = 'display:block;font-weight:700;margin-top:0.8rem';
const GRUPPE_STIL = 'display:flex;flex-wrap:wrap;gap:0.4rem';

const app = document.getElementById('app');

// Vor dem ersten Laden deklariert: lade() kann dieses Flag setzen.
let speicherFehler = false;
let meldung = '';
let monat = new Date().getMonth() + 1;

function lade() {
  try {
    // Titel gehen nie in den Speicher; nur die Häkchen werden zurückgelesen.
    return { ...leererStand(), haken: ladeStand(localStorage.getItem(SCHLUESSEL)).haken };
  } catch {
    // Gesperrter Speicher (privates Fenster, blockierte Website-Daten): der Plan gilt
    // dann nur bis zum Neuladen, die Seite funktioniert trotzdem.
    speicherFehler = true;
    return leererStand();
  }
}

let stand = lade();

function speichere() {
  try {
    const nurHaken = gespeicherterStand(stand);
    if (istLeer(nurHaken)) localStorage.removeItem(SCHLUESSEL);
    else localStorage.setItem(SCHLUESSEL, JSON.stringify(normalisiereStand(nurHaken)));
    speicherFehler = false;
  } catch {
    speicherFehler = true;
  }
}

function fokus(id) {
  document.getElementById(id)?.focus();
}

function meldungsText() {
  const teile = [meldung];
  if (speicherFehler) {
    teile.push('Auf diesem Gerät kann nichts gespeichert werden. Deine Stückliste gilt nur bis zum Neuladen.');
  }
  return teile.filter(Boolean).join(' ');
}

// ---- Feste Teile: einmal gebaut ----------------------------------------------------

const meldungTeil = el('p', { class: 'k-hinweis', style: 'font-weight:700;margin:0 0 0.6rem' });
const monatTeil = el('section', { class: 'k-karte' });
const listeTeil = el('section', { class: 'k-karte' });
const kartenTeil = el('div');

const titelFeld = el('input', {
  id: 'mjp-titel',
  type: 'text',
  maxlength: String(TITEL_MAX),
  autocomplete: 'off',
  required: true,
  'aria-describedby': 'mjp-titel-hilfe',
  style: FELD_STIL,
});
const bereichFeld = el('select', { id: 'mjp-bereich', style: FELD_STIL },
  el('option', { value: '' }, '— bitte wählen —'),
  ...BEREICHE.map((b) => el('option', { value: b.id }, `${b.name} (S. ${b.seiten})`)));
const monatFeld = el('select', { id: 'mjp-monat-feld', style: FELD_STIL },
  ...MONATE.map((n, i) => el('option', { value: String(i + 1), selected: i + 1 === monat }, n)));
const herkunftFeld = el('select', { id: 'mjp-herkunft', style: FELD_STIL },
  el('option', { value: '' }, '— bitte wählen —'),
  ...HERKUNFT.map((h) => el('option', { value: h.id }, h.text)));

function stueckAufnehmen() {
  const eingabe = {
    titel: titelFeld.value,
    bereich: bereichFeld.value,
    monat: Number(monatFeld.value),
    herkunft: herkunftFeld.value,
  };
  const ergebnis = fuegeStueckHinzu(stand, eingabe);
  if (ergebnis.fehler.length) {
    meldung = ergebnis.fehler.join(' ');
    zeichneMeldung();
    titelFeld.focus();
    return;
  }
  stand = ergebnis.stand;
  speichere();
  meldung = `Aufgenommen: „${eingabe.titel.trim()}“, ${MONATE[eingabe.monat - 1]}, ${bereichName(eingabe.bereich)}.`;
  titelFeld.value = '';
  zeichneMeldung();
  zeichneMonat();
  zeichneListe();
  titelFeld.focus();
}

const formular = el('form', {
  id: 'mjp-formular',
  onsubmit: (e) => {
    e.preventDefault();
    stueckAufnehmen();
  },
},
el('h2', {}, 'Eigenes Stück eintragen'),
el('p', { class: 'k-hinweis', style: 'margin-top:0' },
  'Eigenentwurf dieser App. Bitte keine Namen von Kindern und keine Beobachtungen über einzelne Kinder eintragen. '
  + 'Die Herkunft wählst du aus vier festen Optionen; die App prüft nicht, ob etwas gemeinfrei ist.'),
el('label', { for: 'mjp-titel', style: LABEL_STIL }, 'Titel des Stücks'),
titelFeld,
el('p', { id: 'mjp-titel-hilfe', class: 'k-hinweis', style: 'margin:0.3rem 0 0' },
  `Höchstens ${TITEL_MAX} Zeichen.`),
el('label', { for: 'mjp-bereich', style: LABEL_STIL }, 'Bereich'),
bereichFeld,
el('label', { for: 'mjp-monat-feld', style: LABEL_STIL }, 'Monat'),
monatFeld,
el('label', { for: 'mjp-herkunft', style: LABEL_STIL }, 'Herkunft'),
herkunftFeld,
el('button', { type: 'submit', class: 'k-knopf', style: 'margin-top:1rem' }, 'Stück in die Liste aufnehmen'));

const formularTeil = el('section', { class: 'k-karte' }, formular);

const kopf = el('header', {},
  el('h1', { class: 'k-titel' }, 'Musik-Jahresplaner'),
  el('p', { class: 'k-untertitel' },
    'Für Fachkräfte: die fünf Bereiche der Quelle, eine eigene Stückliste und eine Monatsübersicht zum Abhaken von Hand.'),
  el('p', {},
    'Das Werkzeug bewertet weder Kinder noch Gruppen. Es gibt keine Ampel, keine Rangliste und kein Soll. '
    + 'Gespeichert werden nur die Häkchen der Monatsübersicht, und nur auf diesem Gerät. Deine Stückliste bleibt bis zum Neuladen der Seite.'));

const bereicheTeil = el('section', { class: 'k-karte' },
  el('h2', {}, 'Die fünf Bereiche'),
  el('p', { class: 'k-hinweis', style: 'margin-top:0' },
    'Überschriften und Seiten stammen aus der Quelle (Praleska, Musikteil, Gruppe «ПОЧЕМУЧКИ»). '
    + 'Die deutschen Bezeichnungen sind Eigenbenennungen.'),
  el('ol', { style: 'padding-left:1.2rem' },
    ...BEREICHE.map((b) => el('li', { style: 'margin-bottom:0.4rem' },
      el('strong', {}, b.name),
      ` – „${b.quelle}“, S. ${b.seiten}`))));

const festeTeil = el('section', { class: 'k-karte' },
  el('h2', {}, 'Feste als Anregung'),
  el('p', {},
    `Die Quelle nennt Feste als Aufgabe der Musik im Alltag (S. ${FEST_SEITE}): 1–2 Mal im Monat, im Sommer wöchentlich. `
    + 'Die Beispiele dort sind:'),
  el('ul', { style: 'padding-left:1.2rem' },
    ...FESTE_QUELLE.map((f) => el('li', { style: 'margin-bottom:0.3rem' },
      `${f.name} – ${f.deutsch} (S. ${FEST_SEITE}; ${KENNZEICHNUNG_UEBERSETZUNG})`))),
  el('p', { style: 'margin-top:0.8rem' }, 'Eigene Vorschläge:'),
  el('ul', { style: 'padding-left:1.2rem' },
    ...FESTE_VORSCHLAEGE.map((f) => el('li', { style: 'margin-bottom:0.3rem' },
      `${f} (${KENNZEICHNUNG_VORSCHLAG})`))));

const drucken = el('section', { class: 'k-karte' },
  el('h2', {}, 'Jahresbogen drucken'),
  el('p', { style: 'margin-top:0' },
    'Der Bogen zeigt jeden Monat mit den fünf Bereichen und leeren Linien zum Ausfüllen von Hand. '
    + 'Ohne Zählung, ohne Namen, ohne Häkchen.'),
  el('button', { type: 'button', class: 'k-knopf', onclick: () => window.print() }, 'Jahresbogen drucken'));

// Der Jahresbogen steht nur auf dem Papier (druck.css): keine Zählung, kein Name, keine Schaltfläche.
const druckBogen = el('section', { class: 'mjp-nur-druck' },
  el('h1', { class: 'mjp-druckkopf-titel' }, 'Musik-Jahresplaner: Jahresbogen'),
  el('p', { class: 'mjp-druckhinweis' },
    'Bereiche nach Praleska, Musikteil, S. 160–174. Leere Linien zum Ausfüllen von Hand.'),
  ...druckGliederung().map((m) => el('section', { class: 'mjp-druckmonat' },
    el('h2', {}, m.name),
    ...m.bereiche.map((b) => el('div', { class: 'mjp-druckbereich' },
      el('p', {}, `${b.name} (S. ${b.seiten})`),
      el('div', { class: 'mjp-linie' }),
      el('div', { class: 'mjp-linie' }))))));

// ---- Zeichnen: jeder Teil wird nur neu gebaut, wenn er sich ändert ------------------

function zeichneMeldung() {
  meldungTeil.textContent = meldungsText();
}

function zeichneMonat() {
  const name = MONATE[monat - 1];
  const zaehl = zaehleProMonat(stand);
  monatTeil.replaceChildren(
    el('h2', {}, 'Monatsübersicht'),
    el('p', { class: 'k-hinweis', style: 'margin-top:0' },
      'Eigenentwurf dieser App, nicht aus der Quelle. Du hakst von Hand an, welche Bereiche du im Monat angesprochen hast. '
      + 'Das ist deine Erinnerung, keine Bewertung und kein Soll.'),
    el('div', { role: 'group', 'aria-label': 'Monat wählen', style: GRUPPE_STIL },
      ...MONATE.map((n, i) => {
        const aktiv = i + 1 === monat;
        return el('button', {
          id: `mjp-m-${i + 1}`,
          type: 'button',
          class: aktiv ? 'k-knopf k-knopf--klein' : 'k-knopf k-knopf--neutral k-knopf--klein',
          'aria-pressed': String(aktiv),
          onclick: () => {
            monat = i + 1;
            zeichneMonat();
            fokus(`mjp-m-${i + 1}`);
          },
        }, n);
      })),
    el('h3', {}, `${name}: Bereiche`),
    el('p', { style: 'margin-top:0' }, `In der Stückliste: ${zaehlWort(zaehl[monat - 1])}.`),
    el('div', {
      role: 'group',
      'aria-label': `Bereiche im ${name}`,
      style: 'display:flex;flex-direction:column;gap:0.5rem',
    },
    ...BEREICHE.map((b) => {
      const an = istHaken(stand, monat, b.id);
      return el('button', {
        id: `mjp-h-${monat}-${b.id}`,
        type: 'button',
        class: an ? 'k-knopf' : 'k-knopf k-knopf--neutral',
        'aria-pressed': String(an),
        'aria-label': `${b.name} (S. ${b.seiten}), ${name}`,
        onclick: () => {
          stand = umschalteHaken(stand, monat, b.id);
          speichere();
          zeichneMonat();
          fokus(`mjp-h-${monat}-${b.id}`);
        },
      }, `${an ? '✓ ' : ''}${b.name} (S. ${b.seiten})`);
    })));
}

function zeichneListe() {
  const zaehl = zaehleProMonat(stand);
  const liste = sortiereStuecke(stand.stuecke);
  listeTeil.replaceChildren(
    el('h2', { id: 'mjp-liste-titel', tabindex: '-1' }, 'Deine Stückliste'),
    liste.length
      ? el('ul', { style: 'padding-left:1.2rem' },
        ...liste.map((s) => el('li', { style: 'margin-bottom:0.8rem' },
          el('p', { style: 'margin:0;font-weight:700' }, s.titel),
          el('p', { style: 'margin:0.2rem 0' },
            `${MONATE[s.monat - 1]} · ${bereichName(s.bereich)} · ${herkunftText(s.herkunft)}`),
          el('button', {
            type: 'button',
            class: 'k-knopf k-knopf--neutral k-knopf--klein',
            'aria-label': `Stück „${s.titel}“ entfernen`,
            onclick: () => {
              stand = entferneStueck(stand, s.id);
              speichere();
              meldung = `Entfernt: „${s.titel}“.`;
              zeichneMeldung();
              zeichneMonat();
              zeichneListe();
              fokus('mjp-liste-titel');
            },
          }, 'Entfernen'))))
      : el('p', {}, 'Noch keine Stücke. Eintragen kannst du sie im Formular oben.'),
    el('h3', {}, 'Stücke je Monat'),
    el('p', { class: 'k-hinweis', style: 'margin-top:0' }, 'Gezählt werden nur deine eigenen Einträge.'),
    el('ul', { style: 'padding-left:1.2rem' },
      ...MONATE.map((name, i) => el('li', {}, `${name}: ${zaehlWort(zaehl[i])}`))));
}

function zeichneKarte() {
  kartenTeil.replaceChildren(datenKarte({
    schluessel: SCHLUESSEL,
    was: 'deine Häkchen zur Monatsübersicht (deine Stückliste mit Titeln wird nie gespeichert)',
    nachLoeschen: () => {
      stand = leererStand();
      meldung = '';
      zeichneAlles();
    },
  }));
}

function zeichneAlles() {
  zeichneMeldung();
  zeichneMonat();
  zeichneListe();
  zeichneKarte();
}

const bildschirm = el('div', { class: 'mjp-nur-bildschirm' },
  kopf,
  bereicheTeil,
  meldungTeil,
  monatTeil,
  formularTeil,
  listeTeil,
  festeTeil,
  drucken,
  kartenTeil,
  el('footer', { class: 'k-fuss' },
    el('span', {}, 'Werkzeug für Fachkräfte · keine Verbindung nach außen · nur die Häkchen werden gespeichert · '),
    el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));

app.replaceChildren(bildschirm, druckBogen);
zeichneAlles();
