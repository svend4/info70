// Kita-Kartograph: Wir zeichnen unseren Raum (5-7, Kita und zu Hause).
// Kinder legen mit Symbolen einen Plan ihres Raumes, die Zeichenerklärung
// baut sich dabei von allein auf. Praleska docs/10 (Ko-Nutzung Nr. 10).
//
// Abgrenzung zu deutschland-kompass: dort wird ein fertiger Plan gelesen,
// hier wird einer gebaut. Politik docs/02: keine externen Anfragen; der
// zuletzt gelegte Plan liegt löschbar auf dem Gerät.
//
// Ein Klick baut die Seite NICHT neu auf: #app ist eine aria-live-Region,
// ein Komplettaustausch würde bei jedem gelegten Zeichen alles vorlesen.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import {
  GROESSE, KANTEN, felderAnzahl, feldName,
  setzeSymbol, leerePlan, anzahlGelegt, legende, planText, pruefeDaten,
} from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const SPEICHER = 'kartograph.plan';
const LOESCH_KNOPF = 'alles-loeschen';
const app = document.getElementById('app');
const daten = await fetch('daten/symbole.json').then((r) => r.json());
const symbolVon = (id) => daten.symbole.find((s) => s.id === id) ?? null;

// Reihenfolge beachten: lade() liefert BEIDE Werte zurück, statt `norden`
// von innen zu setzen. Täte es das, liefe es in die temporale Todeszone
// der noch nicht initialisierten Variable – und der catch-Zweig würde den
// ReferenceError verschlucken und den Plan stillschweigend leeren.
const gespeichert = lade();
let plan = gespeichert.plan;
let norden = gespeichert.norden;
let gewaehlt = daten.symbole[0].id;
let felder = new Map();
let symbolKnoepfe = new Map();
let legendeBox = null;
let statusZeile = null;

function lade() {
  try {
    const roh = JSON.parse(localStorage.getItem(SPEICHER) || '{}');
    const sauber = {};
    // Nur bekannte Symbole auf gültigen Feldern übernehmen: Ein alter oder
    // verfälschter Eintrag soll den Plan nicht unsichtbar verfälschen.
    for (const [index, id] of Object.entries(roh.plan || {})) {
      const n = Number(index);
      if (Number.isInteger(n) && n >= 0 && n < felderAnzahl() && symbolVon(id)) sauber[n] = id;
    }
    const kante = KANTEN.some((k) => k.id === roh.norden) ? roh.norden : 'oben';
    return { plan: sauber, norden: kante };
  } catch {
    return { plan: leerePlan(), norden: 'oben' };
  }
}

function sichere() {
  localStorage.setItem(SPEICHER, JSON.stringify({ plan, norden }));
}

function tippeFeld(index) {
  plan = setzeSymbol(plan, index, gewaehlt);
  sichere();
  schreibeFeld(index);
  aktualisiereNebenteile();
}

function waehleSymbol(id) {
  gewaehlt = id;
  for (const [sid, knopf] of symbolKnoepfe) {
    const an = sid === id;
    knopf.className = `k-knopf k-knopf--klein ${an ? '' : 'k-knopf--neutral'}`;
    knopf.setAttribute('aria-pressed', String(an));
  }
  if (statusZeile) statusZeile.textContent = statusText();
}

function statusText() {
  const s = symbolVon(gewaehlt);
  const gelegt = anzahlGelegt(plan);
  return `Ausgewählt: ${s.emoji} ${s.name}. Auf dem Plan liegen ${gelegt} ${gelegt === 1 ? 'Zeichen' : 'Zeichen'}.`;
}

function schreibeFeld(index) {
  const knopf = felder.get(index);
  if (!knopf) return;
  const s = symbolVon(plan[index]);
  knopf.replaceChildren(el('span', { style: 'font-size:1.6rem;line-height:1' }, s ? s.emoji : '·'));
  knopf.setAttribute('aria-label', `${feldName(index)}: ${s ? s.name : 'leer'}`);
  knopf.setAttribute('aria-pressed', String(Boolean(s)));
}

function aktualisiereNebenteile() {
  if (statusZeile) statusZeile.textContent = statusText();
  if (legendeBox) legendeBox.replaceChildren(...legendeInhalt().filter(Boolean));
}

function legendeInhalt() {
  const eintraege = legende(plan, daten.symbole);
  if (!eintraege.length) {
    return [el('p', { style: 'margin:0' }, 'Noch nichts gelegt. Sucht ein Zeichen aus und tippt auf ein Feld.')];
  }
  return [
    el('ul', { style: 'margin:0;padding-left:1.2rem' },
      ...eintraege.map((s) => el('li', {}, `${s.emoji} = ${s.name}${s.anzahl > 1 ? ` (${s.anzahl}×)` : ''}`))),
    el('button', {
      class: 'k-knopf k-knopf--neutral k-knopf--klein',
      style: 'margin-top:0.5rem',
      onclick: () => vorlesen(planText(plan, daten.symbole)),
    }, '🔊 Plan vorlesen'),
  ];
}

function planKarte() {
  const knoepfe = [];
  for (let i = 0; i < felderAnzahl(); i++) {
    const knopf = el('button', {
      class: 'k-knopf k-knopf--neutral',
      style: 'aspect-ratio:1;padding:0;min-height:0;display:flex;align-items:center;justify-content:center',
      onclick: () => tippeFeld(i),
    });
    felder.set(i, knopf);
    schreibeFeld(i);
    knoepfe.push(knopf);
  }
  const kante = KANTEN.find((k) => k.id === norden);
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0' }, '🗺️ Euer Raum'),
    el('p', { style: 'text-align:center;font-weight:700;margin:0.2rem 0' }, `🧭 Norden ist ${kante.name}`),
    el('div', {
      role: 'group',
      'aria-label': `Plan des Raumes, ${GROESSE} mal ${GROESSE} Felder. Norden ist ${kante.name}.`,
      style: `display:grid;grid-template-columns:repeat(${GROESSE},1fr);gap:0.3rem;max-width:22rem;margin:0.5rem auto`,
    }, ...knoepfe),
    el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Wo ist Norden?' },
      ...KANTEN.map((k) => el('button', {
        class: `k-knopf k-knopf--klein ${norden === k.id ? '' : 'k-knopf--neutral'}`,
        'aria-pressed': String(norden === k.id),
        onclick: () => { norden = k.id; sichere(); render(); },
      }, `🧭 Norden ${k.name}`))));
}

function symbolKarte() {
  statusZeile = el('p', { 'aria-live': 'polite', style: 'text-align:center;font-weight:700;margin:0.5rem 0 0' }, statusText());
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0' }, '🎨 Zeichen aussuchen'),
    el('p', { style: 'margin-top:0' }, 'Erst ein Zeichen antippen, dann das Feld. Noch einmal auf dasselbe Feld tippen nimmt es wieder weg.'),
    el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Zeichen wählen' },
      ...daten.symbole.map((s) => {
        const an = gewaehlt === s.id;
        const knopf = el('button', {
          class: `k-knopf k-knopf--klein ${an ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(an),
          'aria-label': s.name,
          onclick: () => waehleSymbol(s.id),
        }, `${s.emoji} ${s.name}`);
        symbolKnoepfe.set(s.id, knopf);
        return knopf;
      })),
    statusZeile);
}

function legendeKarte() {
  legendeBox = el('div', {}, ...legendeInhalt().filter(Boolean));
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0' }, '📋 Zeichenerklärung'),
    el('p', { style: 'margin-top:0' }, 'Ein Plan braucht eine Erklärung – sonst weiß niemand, wofür die Zeichen stehen. Sie baut sich hier von allein auf.'),
    legendeBox);
}

function begleitKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0' }, '👪 So geht ihr vor'),
    el('ol', { style: 'margin:0;padding-left:1.2rem' }, ...daten.schritte.map((s) => el('li', { style: 'margin-bottom:0.3rem' }, s))),
    el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
      el('p', { style: 'font-weight:700;margin-top:0' }, 'Fragen zum Weiterreden:'),
      el('ul', { style: 'margin:0;padding-left:1.2rem' }, ...daten.fragen.map((f) => el('li', {}, f)))),
    el('button', {
      class: 'k-knopf k-knopf--neutral k-knopf--klein',
      style: 'margin-top:0.5rem',
      onclick: () => vorlesen(`${daten.schritte.join(' ')} ${daten.fragen.join(' ')}`),
    }, '🔊 Vorlesen'));
}

function datenKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0' }, '🔒 Euer Plan'),
    el('p', { style: 'margin-top:0' }, 'Gespeichert wird nur euer letzter Plan, und zwar nur hier auf diesem Gerät. Keine Namen, keine Fotos, nichts über einzelne Kinder.'),
    el('div', { class: 'k-antworten' },
      el('button', {
        id: LOESCH_KNOPF,
        class: 'k-knopf k-knopf--neutral',
        onclick: () => {
          localStorage.removeItem(SPEICHER);
          plan = leerePlan();
          norden = 'oben';
          render();
          document.getElementById(LOESCH_KNOPF)?.focus();
        },
      }, '🗑️ Plan löschen')));
}

function render() {
  felder = new Map();
  symbolKnoepfe = new Map();
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🗺️ Kita-Kartograph'),
    el('p', { class: 'k-untertitel' }, 'Wir zeichnen unseren Raum von oben'),
    symbolKarte(),
    planKarte(),
    legendeKarte(),
    begleitKarte(),
    datenKarte(),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · keine Namen · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
