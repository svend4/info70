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
// Das gilt auch für die Himmelsrichtung: ihre Knöpfe werden nur umgefärbt.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import daten from './daten/symbole.json' with { type: 'json' };
import {
  GROESSE, KANTEN, felderAnzahl, feldName,
  setzeSymbol, setzeNorden, ladeZustand, leerePlan, anzahlGelegt, legende, planText, pruefeDaten, druckInhalt,
} from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const SPEICHER = 'kartograph.plan';
const LOESCH_KNOPF = 'alles-loeschen';
const app = document.getElementById('app');
const symbolVon = (id) => daten.symbole.find((s) => s.id === id) ?? null;

function liesSpeicher() {
  try {
    return localStorage.getItem(SPEICHER);
  } catch {
    return null;
  }
}

const gespeichert = ladeZustand(liesSpeicher(), daten.symbole);
let plan = gespeichert.plan;
let norden = gespeichert.norden;
let gewaehlt = daten.symbole[0].id;
let felder = new Map();
let symbolKnoepfe = new Map();
let nordenKnoepfe = new Map();
let nordAnzeige = null;
let planGruppe = null;
let legendeBox = null;
let statusZeile = null;
// Das Druckblatt liegt außerhalb von #app: Ändert es sich, soll nichts vorgelesen werden.
const druckBox = el('div', { class: 'nur-druck', id: 'druckbereich' });
app.after(druckBox);

function sichere() {
  try {
    localStorage.setItem(SPEICHER, JSON.stringify({ plan, norden }));
  } catch {
    // Ohne Speicher (privates Fenster, gesperrt) bleibt der Plan bis zum Neuladen sichtbar.
  }
}

function knopfKlasse(an) {
  return `k-knopf k-knopf--klein ${an ? '' : 'k-knopf--neutral'}`;
}

function tippeFeld(index) {
  plan = setzeSymbol(plan, index, gewaehlt, daten.symbole);
  sichere();
  schreibeFeld(index);
  aktualisiereNebenteile();
}

function waehleSymbol(id) {
  gewaehlt = id;
  for (const [sid, knopf] of symbolKnoepfe) {
    const an = sid === id;
    knopf.className = knopfKlasse(an);
    knopf.setAttribute('aria-pressed', String(an));
  }
  if (statusZeile) statusZeile.textContent = statusText();
}

function waehleNorden(id) {
  const neu = setzeNorden({ plan, norden }, id);
  plan = neu.plan;
  norden = neu.norden;
  sichere();
  markiereNorden();
  aktualisiereDruck();
}

function markiereNorden() {
  for (const [id, knopf] of nordenKnoepfe) {
    const an = id === norden;
    knopf.className = knopfKlasse(an);
    knopf.setAttribute('aria-pressed', String(an));
  }
  if (nordAnzeige) nordAnzeige.textContent = `🧭 Norden ist ${kantenName()}`;
  if (planGruppe) planGruppe.setAttribute('aria-label', `Plan des Raumes, ${GROESSE} mal ${GROESSE} Felder. Norden ist ${kantenName()}.`);
}

function kantenName() {
  return KANTEN.find((k) => k.id === norden).name;
}

function statusText() {
  const s = symbolVon(gewaehlt);
  const gelegt = anzahlGelegt(plan);
  return `Ausgewählt: ${s.emoji} ${s.name}. Auf dem Plan liegen ${gelegt} Zeichen.`;
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
  aktualisiereDruck();
}

// Das Druckblatt: nur Text und Nummern, ohne Emoji. Die Zeichen stehen in der
// Zeichenerklärung unter derselben Nummer. Seitenzahlen stehen nicht auf dem Blatt.
function aktualisiereDruck() {
  druckBox.replaceChildren(...druckKinder());
}

function druckKinder() {
  const d = druckInhalt(plan, daten.symbole, norden);
  return [
    el('p', { class: 'druck-kopf' }, d.kopf),
    el('h1', { class: 'druck-titel' }, d.titel),
    el('p', { class: 'druck-zeile' }, d.norden),
    el('div', { class: 'druck-raster' },
      ...d.felder.map((n) => el('div', { class: 'druck-feld' }, String(n)))),
    el('h2', { class: 'druck-ueberschrift' }, 'Zeichenerklärung'),
    d.legende.length
      ? el('ul', { class: 'druck-liste' },
        ...d.legende.map((s) => el('li', {}, `${s.nummer} = ${s.name}${s.anzahl > 1 ? ` (${s.anzahl}×)` : ''}`)))
      : el('p', { class: 'druck-zeile' }, 'Noch nichts gelegt.'),
    el('p', { class: 'druck-pflicht' }, d.pflicht),
  ];
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
      'data-kennung': 'vorlesen-legende',
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
      'data-kennung': `feld-${i}`,
      class: 'k-knopf k-knopf--neutral',
      style: 'padding:0;display:flex;align-items:center;justify-content:center',
      onclick: () => tippeFeld(i),
    });
    felder.set(i, knopf);
    schreibeFeld(i);
    knoepfe.push(knopf);
  }
  nordAnzeige = el('p', { style: 'text-align:center;font-weight:700;margin:0.2rem 0' });
  planGruppe = el('div', {
    role: 'group',
    style: `display:grid;grid-template-columns:repeat(${GROESSE},1fr);gap:0.3rem;max-width:22rem;margin:0.5rem auto`,
  }, ...knoepfe);
  const nordKnoepfe = KANTEN.map((k) => {
    const knopf = el('button', {
      'data-kennung': `norden-${k.id}`,
      onclick: () => waehleNorden(k.id),
    }, `🧭 Norden ${k.name}`);
    nordenKnoepfe.set(k.id, knopf);
    return knopf;
  });
  markiereNorden();
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0' }, '🗺️ Euer Raum'),
    nordAnzeige,
    planGruppe,
    el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Wo ist Norden?' }, ...nordKnoepfe));
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
          'data-kennung': `zeichen-${s.id}`,
          class: knopfKlasse(an),
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
    legendeBox,
    el('button', {
      'data-kennung': 'drucken',
      class: 'k-knopf k-knopf--neutral k-knopf--klein',
      style: 'margin-top:0.5rem',
      onclick: () => window.print(),
    }, '🖨️ Plan drucken'));
}

function begleitKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0' }, '👪 So geht ihr vor'),
    el('ol', { style: 'margin:0;padding-left:1.2rem' }, ...daten.schritte.map((s) => el('li', { style: 'margin-bottom:0.3rem' }, s))),
    el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
      el('p', { style: 'font-weight:700;margin-top:0' }, 'Fragen zum Weiterreden:'),
      el('ul', { style: 'margin:0;padding-left:1.2rem' }, ...daten.fragen.map((f) => el('li', {}, f)))),
    el('button', {
      'data-kennung': 'vorlesen-begleit',
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
        'data-kennung': 'loeschen',
        class: 'k-knopf k-knopf--neutral',
        onclick: () => {
          try {
            localStorage.removeItem(SPEICHER);
          } catch {
            // Ohne Speicher gibt es nichts zu löschen.
          }
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
  nordenKnoepfe = new Map();
  app.replaceChildren(el('div', { class: 'nur-bildschirm' }, ...[
    el('h1', { class: 'k-titel' }, '🗺️ Kita-Kartograph'),
    el('p', { class: 'k-untertitel' }, 'Wir zeichnen unseren Raum von oben'),
    symbolKarte(),
    planKarte(),
    legendeKarte(),
    begleitKarte(),
    datenKarte(),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · keine Namen · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html', style: FUSS_LINK }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html', style: FUSS_LINK }, 'Impressum & Datenschutz')),
  ].filter(Boolean)));
  aktualisiereDruck();
}

// Fußlinks mindestens 48 px hoch (docs/02, Berührung).
const FUSS_LINK = 'display:inline-block;min-height:48px;line-height:48px;padding:0 0.2rem';

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
