// Mini-Oper-Baukasten (offline, ohne KI). Werkzeug für Erwachsene: Die Fachkraft legt ein
// Gerüst für eine kleine Musikszene an (Szenen, Rollen, Titelauswahl, Requisiten, Klang-Hinweis).
// Das Gerüst ist ein Impuls, die Kinder komponieren mit. Gespeichert wird nichts (docs/02).
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  APP_NAME, SZENEN, ROLLEN, REQUISITEN_ANZAHL, SEITE, TITEL, FIGUREN, INSTRUMENTE,
  KLANG_HINWEIS, ANREGUNG_QUELLE, IMPULS_HINWEIS,
  erzeugeSzenen, erzeugeRollen, erzeugeRequisiten, erzeugeGeruest, titelGueltig,
} from './logik.mjs';

installiereNetzwerkWaechter();

// Die Seitenangaben der Quelle sind nicht von einem Menschen geprüft (docs/02, Entscheidung Max 22а). Die Marke steht dort,
// wo Seitenangaben erscheinen: auf dem Bildschirm unter dem Text der Karten „Rollen“ (S. 262), „Titel“ (S. 269), „Klang“
// (S. 270) und „Anregung“ (S. 262) und im Druck unter der Zeile „Quellen“ des Gerüstbogens. Im Druck gehört sie zum
// Druckinhalt (Klasse mop-nur-druck) und nicht zu einem Bildschirmteil.
const MARKE_QUELLE = 'Seitenangaben der Quelle: nicht von einem Menschen geprüft.';
const marke = () => el('p', { style: 'margin:0.4rem 0 0.8rem;font-size:0.9rem;color:#4b5563' }, MARKE_QUELLE);

const app = document.getElementById('app');
const zufall = () => Math.random();
const FELD_STIL = 'width:100%;min-height:3rem;font-size:1rem;padding:0.4rem 0.6rem;box-sizing:border-box;'
  + 'border:2px solid var(--k-blau);border-radius:0.5rem;background:#fff;color:inherit';
const LABEL_STIL = 'display:block;font-weight:700;margin-top:0.8rem';
const GRUPPE_STIL = 'display:flex;flex-wrap:wrap;gap:0.4rem';
const LISTE_STIL = 'padding-left:1.2rem';

// Der Stand lebt nur im Speicher dieser Seite: nichts wird gespeichert, nach dem Neuladen
// ist alles weg. Die Stichworte bleiben erhalten, wenn sich die Szenenzahl ändert.
const stand = {
  szenen: SZENEN.standard,
  rollen: ROLLEN.standard,
  titel: null,
  requisiten: erzeugeRequisiten(zufall),
  stichworte: [],
  instrumente: false,
};

const zahlen = (von, bis) => Array.from({ length: bis - von + 1 }, (_, i) => von + i);

function fokus(id) {
  document.getElementById(id)?.focus();
}

function wahlKnopf(id, text, aktiv, onclick) {
  return el('button', {
    id,
    type: 'button',
    class: aktiv ? 'k-knopf k-knopf--klein' : 'k-knopf k-knopf--neutral k-knopf--klein',
    'aria-pressed': String(aktiv),
    onclick,
  }, text);
}

// ---- Feste Teile: einmal gebaut, danach werden nur ihre Inhalte neu gesetzt ----------

const kopf = el('header', {},
  el('h1', { class: 'k-titel' }, APP_NAME),
  el('p', { class: 'k-untertitel' },
    'Gerüst für eine kleine Musikszene in der Kita: Szenen, Rollen, Requisiten und ein Klang-Hinweis.'),
  el('p', { class: 'k-hinweis', style: 'margin:0.6rem 0 0' },
    'Dieses Werkzeug schreibt keine Geschichte und keinen Text. Es legt nur Platzhalter, leere Zeilen und Listen an. '
    + 'Es speichert nichts. Bitte keine Namen von Kindern eintragen.'));

// Szenen
const szenenWahl = el('div', { role: 'group', 'aria-label': 'Anzahl der Szenen', style: GRUPPE_STIL });
const szenenListe = el('ol', { style: LISTE_STIL });

const szenenKarte = el('section', { class: 'k-karte' },
  el('h2', {}, 'Szenen'),
  el('p', { class: 'k-hinweis', style: 'margin-top:0' },
    `Eigenentwurf: ${SZENEN.min} bis ${SZENEN.max} Szenen. Die Szenenfolge ist eine Liste leerer Zeilen mit Stichwort-Feld.`),
  el('p', { style: 'margin:0.4rem 0 0' }, 'Anzahl der Szenen:'),
  szenenWahl,
  el('h3', {}, 'Szenenfolge'),
  szenenListe);

function setzeSzenen(n) {
  stand.szenen = n;
  zeichneSzenenWahl();
  zeichneSzenenListe();
  zeichneDruck();
  fokus(`gm-szenen-${n}`);
}

function zeichneSzenenWahl() {
  szenenWahl.replaceChildren(...zahlen(SZENEN.min, SZENEN.max).map((n) => wahlKnopf(
    `gm-szenen-${n}`, `${n} Szenen`, n === stand.szenen, () => setzeSzenen(n),
  )));
}

function zeichneSzenenListe() {
  szenenListe.replaceChildren(...erzeugeSzenen(stand.szenen).map((s, i) => {
    const id = `gm-stichwort-${s.nummer}`;
    return el('li', { style: 'margin-bottom:0.8rem' },
      el('label', { for: id, style: LABEL_STIL }, `${s.bezeichnung}: Stichwort (optional)`),
      el('input', {
        id,
        type: 'text',
        maxlength: '80',
        autocomplete: 'off',
        value: stand.stichworte[i] ?? '',
        style: FELD_STIL,
        oninput: (e) => { stand.stichworte[i] = e.target.value; },
      }));
  }));
}

// Rollen
const rollenWahl = el('div', { role: 'group', 'aria-label': 'Anzahl der Rollenplätze', style: GRUPPE_STIL });
const rollenListe = el('ol', { style: LISTE_STIL });
const figurenListe = el('ul', { style: LISTE_STIL },
  ...FIGUREN.map((f) => el('li', {}, `${f.quelle} (${f.deutsch})`)));

const rollenKarte = el('section', { class: 'k-karte' },
  el('h2', {}, 'Rollen'),
  el('p', { class: 'k-hinweis', style: 'margin-top:0' },
    `Eigenentwurf: ${ROLLEN.min} bis ${ROLLEN.max} Rollenplätze. Sie heißen nur „Rolle 1“, „Rolle 2“ und so weiter. Hier werden keine Namen von Kindern eingetragen.`),
  el('p', { style: 'margin:0.4rem 0 0' }, 'Anzahl der Rollenplätze:'),
  rollenWahl,
  rollenListe,
  el('h3', {}, `Figuren als Vorschlag (S. ${SEITE.figuren})`),
  el('p', { style: 'margin-top:0' },
    `Beispiele aus der Quelle (S. ${SEITE.figuren}, dort „и др.“, also und andere). Die deutschen Namen in Klammern sind Eigenentwurf. Die Vorschläge sind nicht verpflichtend.`),
  marke(),
  figurenListe);

function setzeRollen(n) {
  stand.rollen = n;
  zeichneRollen();
  zeichneDruck();
  fokus(`gm-rollen-${n}`);
}

function zeichneRollen() {
  rollenWahl.replaceChildren(...zahlen(ROLLEN.min, ROLLEN.max).map((n) => wahlKnopf(
    `gm-rollen-${n}`, `${n} Rollen`, n === stand.rollen, () => setzeRollen(n),
  )));
  rollenListe.replaceChildren(...erzeugeRollen(stand.rollen).map((r) => el('li', {}, r)));
}

// Titel
const titelFeld = el('select', {
  id: 'gm-titel',
  style: FELD_STIL,
  onchange: (e) => {
    stand.titel = titelGueltig(e.target.value);
    zeichneDruck();
  },
},
el('option', { value: '' }, 'Kein Titel gewählt'),
...TITEL.map((t) => el('option', { value: t }, t)));

const titelKarte = el('section', { class: 'k-karte' },
  el('h2', {}, 'Titel (Auswahl)'),
  el('p', { class: 'k-hinweis', style: 'margin-top:0' },
    `Titel, ohne Text und Musik. Die Quelle nennt auf S. ${SEITE.titel} 18 Titel unter der Überschrift „Музыкальные инсценировки, сказки-драматизации“. Nicht alle sind Märchen.`),
  marke(),
  el('label', { for: 'gm-titel', style: LABEL_STIL }, `Titel wählen (S. ${SEITE.titel})`),
  titelFeld);

// Requisiten
const requisitenListe = el('ul', { style: LISTE_STIL });
const freieZeile = el('input', {
  id: 'gm-frei',
  type: 'text',
  maxlength: '80',
  autocomplete: 'off',
  style: FELD_STIL,
});

const requisitenKarte = el('section', { class: 'k-karte' },
  el('h2', {}, 'Requisiten'),
  el('p', { class: 'k-hinweis', style: 'margin-top:0' },
    `Eigenentwurf: ${REQUISITEN_ANZAHL} Dinge aus einer festen Liste allgemeiner Dinge, zufällig gezogen. Dazu kommt eine freie Zeile.`),
  requisitenListe,
  el('button', {
    id: 'gm-neu',
    type: 'button',
    class: 'k-knopf k-knopf--neutral',
    style: 'margin-top:0.6rem',
    onclick: () => {
      stand.requisiten = erzeugeRequisiten(zufall);
      zeichneRequisiten();
      zeichneDruck();
      fokus('gm-neu');
    },
  }, 'Neue Auswahl ziehen'),
  el('label', { for: 'gm-frei', style: LABEL_STIL }, 'Freie Zeile (Eigenentwurf)'),
  freieZeile);

function zeichneRequisiten() {
  requisitenListe.replaceChildren(...stand.requisiten.map((r) => el('li', {}, r)));
}

// Klang
const instrumentKnopf = el('button', {
  id: 'gm-instrumente',
  type: 'button',
  class: 'k-knopf k-knopf--neutral',
  'aria-pressed': 'false',
  onclick: () => {
    stand.instrumente = !stand.instrumente;
    zeichneKlang();
    fokus('gm-instrumente');
  },
}, 'Beispiele für Instrumente anzeigen');
const instrumentTeil = el('div', { style: 'margin-top:0.8rem' });

const klangKarte = el('section', { class: 'k-karte' },
  el('h2', {}, `Klang (S. ${SEITE.klang})`),
  el('p', { style: 'margin-top:0' }, KLANG_HINWEIS),
  marke(),
  instrumentKnopf,
  instrumentTeil);

function zeichneKlang() {
  instrumentKnopf.setAttribute('aria-pressed', String(stand.instrumente));
  instrumentTeil.replaceChildren(...(stand.instrumente ? [
    el('p', { class: 'k-hinweis', style: 'margin-top:0' },
      'Eigenentwurf, ohne Quellenbezug. Diese Beispiele ordnen keine Figur einem Instrument zu. '
      + 'Die Wahl richtet sich nach dem Charakter der Musik.'),
    el('ul', { style: LISTE_STIL }, ...INSTRUMENTE.map((i) => el('li', {}, i))),
  ] : []));
}

// Anregung
const anregungKarte = el('section', { class: 'k-karte' },
  el('h2', {}, `Anregung (S. ${SEITE.anregung})`),
  el('p', { style: 'margin-top:0' }, ANREGUNG_QUELLE),
  marke(),
  el('p', { class: 'k-hinweis' }, IMPULS_HINWEIS));

// Druck
const druckKarte = el('section', { class: 'k-karte' },
  el('h2', {}, 'Gerüstbogen drucken'),
  el('p', { style: 'margin-top:0' },
    'Der Bogen zeigt Szenen, Rollen und Requisiten als leere Linien zum Ausfüllen von Hand. '
    + 'Keine Kästchen, keine Häkchen und keine Zeile für einen Namen.'),
  el('button', { type: 'button', class: 'k-knopf', onclick: () => window.print() }, 'Gerüstbogen drucken'));

// Der Gerüstbogen steht nur auf dem Papier (druck.css): leere Linien, keine Eingaben, keine Schaltfläche.
const druckTeil = el('section', { class: 'mop-nur-druck' });

function druckBlock(text) {
  return el('div', { class: 'mop-druckblock' },
    el('p', {}, text),
    el('div', { class: 'mop-linie' }));
}

function zeichneDruck() {
  const g = erzeugeGeruest({
    szenen: stand.szenen,
    rollen: stand.rollen,
    titel: stand.titel,
    requisiten: stand.requisiten,
  }, zufall);
  druckTeil.replaceChildren(
    el('h1', { class: 'mop-druckkopf-titel' }, g.titel ? `Mini-Oper: ${g.titel}` : 'Mini-Oper: Gerüstbogen'),
    el('p', { class: 'mop-druckhinweis' },
      `${g.impuls} Quellen: S. ${SEITE.figuren}, S. ${SEITE.titel}, S. ${SEITE.klang}.`),
    el('p', { class: 'mop-druckhinweis' }, MARKE_QUELLE),
    el('h2', {}, 'Szenen'),
    ...g.szenen.map((s) => druckBlock(s.bezeichnung)),
    el('h2', {}, 'Rollen'),
    ...g.rollen.map((r) => druckBlock(r)),
    el('h2', {}, 'Requisiten'),
    ...g.requisiten.map((r) => druckBlock(r)),
    druckBlock('Freie Zeile'),
    el('p', { class: 'mop-druckhinweis' }, g.klang));
}

// ---- Aufbau ---------------------------------------------------------------------------

const bildschirm = el('div', { class: 'mop-nur-bildschirm' },
  kopf,
  szenenKarte,
  rollenKarte,
  titelKarte,
  requisitenKarte,
  klangKarte,
  anregungKarte,
  druckKarte,
  el('footer', { class: 'k-fuss' },
    el('span', {}, 'Werkzeug für Erwachsene · offline · nichts wird gespeichert · '),
    el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));

app.replaceChildren(bildschirm, druckTeil);

zeichneSzenenWahl();
zeichneSzenenListe();
zeichneRollen();
zeichneRequisiten();
zeichneKlang();
zeichneDruck();
