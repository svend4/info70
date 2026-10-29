// Ornament-Werkstatt (5-7 kurz, Vertiefung 8-12): Muster nach einer Regel
// fortsetzen (Wiederholung, Wechsel, Rhythmus, Spiegel) und danach selbst
// Ornamente auf Bordüre, Teppich, Teller, Hemd und Osterei legen – mit
// Spiegel-Schalter und Symmetrie-Probe. Ornament ist gebaute Mathematik:
// Periode und Spiegelachse werden hier zum Spielzeug.
// Praleska docs/10 (Kinder-Apps Nr. 8). Politik docs/02: keine externen
// Anfragen, speichert nichts.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import {
  FORMEN, FARBEN, REGELN, formVon, farbeVon, regelVon, kachelGleich, kachelName,
  baueAufgabe, aktiveFelder, spiegelIndex, istSymmetrisch, pruefeVorlagen,
} from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const app = document.getElementById('app');
const daten = await fetch('daten/vorlagen.json').then((r) => r.json());
const zufall = (liste) => liste[Math.floor(Math.random() * liste.length)];

let modus = 'fortsetzen';        // fortsetzen | frei
let aufgabe = null;
let optionen = [];
let feedback = null;
let geschafft = 0;

let vorlageId = daten.vorlagen[0].id;
let formId = FORMEN[0].id;
let farbeId = FARBEN[0].id;
let spiegelAn = true;
let radierer = false;
const zellenProVorlage = new Map();
let zellKnoepfe = new Map();     // Rasterindex → Knopf der aktuellen Ansicht
let statusAnzeige = null;

function vorlageVon() {
  return daten.vorlagen.find((v) => v.id === vorlageId) ?? daten.vorlagen[0];
}

function zellenVon() {
  const vorlage = vorlageVon();
  if (!zellenProVorlage.has(vorlage.id)) {
    zellenProVorlage.set(vorlage.id, new Array(vorlage.spalten * vorlage.raster.length).fill(null));
  }
  return zellenProVorlage.get(vorlage.id);
}

// ---------- Bausteine der Ansicht ----------
/** Eine Kachel als farbiges Zeichen; leer = blasser Punkt. */
function kachelZeichen(kachel, groesse = '1.8rem') {
  if (!kachel) return el('span', { style: `font-size:${groesse};opacity:0.25` }, '·');
  return el('span', {
    style: `font-size:${groesse};line-height:1;color:${farbeVon(kachel.farbe).wert}`,
  }, formVon(kachel.form).zeichen);
}

function kachelFeld(kachel, beschriftung) {
  return el('div', {
    style: 'min-width:2.6rem;flex:0 0 auto;border:2px solid var(--k-rand);border-radius:0.6rem;'
      + 'padding:0.3rem 0.2rem;text-align:center;background:var(--k-karte)',
  }, beschriftung ? el('span', { style: 'font-size:1.8rem;line-height:1' }, beschriftung) : kachelZeichen(kachel));
}

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🧵 Ornament-Werkstatt'),
    el('p', { class: 'k-untertitel' }, 'Muster haben Regeln: Wiederholung, Wechsel, Rhythmus – und den Spiegel in der Mitte.'),
    el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Modus' },
      ...[['fortsetzen', '🧩 Muster fortsetzen'], ['frei', '🎨 Frei legen']].map(([id, name]) =>
        el('button', {
          class: `k-knopf k-knopf--klein ${modus === id ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(modus === id),
          // aufgabe/optionen mit zurücksetzen: sonst bliebe ein gelöstes
          // Muster nach dem Moduswechsel erneut anklickbar und zählbar.
          onclick: () => { modus = id; aufgabe = null; optionen = []; feedback = null; render(); },
        }, name))),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · offline · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

// ---------- Modus 1: Muster fortsetzen ----------
function neueAufgabe() {
  aufgabe = baueAufgabe(zufall);
  optionen = mischen(aufgabe.optionen);
  feedback = null;
  render();
}

function antworte(kachel) {
  const regel = regelVon(aufgabe.regel);
  const gut = kachelGleich(kachel, aufgabe.loesung);
  if (gut) geschafft += 1;
  feedback = {
    gut,
    text: gut
      ? `🌟 Richtig! Diese Regel heißt „${regel.name}“: ${regel.erklaerung}`
      : `💭 Schau nochmal: Die Regel heißt „${regel.name}“. ${regel.erklaerung} Weiter ginge es mit: ${kachelName(aufgabe.loesung)}.`,
  };
  render();
}

function fortsetzenKarten() {
  if (!aufgabe) {
    return [
      el('section', { class: 'k-karte' },
        el('p', { style: 'margin-top:0' }, 'Ein Ornament ist nie zufällig: Ein kleines Stück wiederholt sich immer wieder. Finde die Regel und leg die nächste Kachel richtig.'),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: neueAufgabe }, '▶️ Erstes Muster'))),
      regelKarte(),
    ];
  }
  return [
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0;font-weight:700;text-align:center' }, 'Wie geht das Muster weiter?'),
      el('div', { style: 'display:flex;gap:0.3rem;justify-content:center;overflow-x:auto;padding:0.2rem 0' },
        ...aufgabe.gezeigt.map((k) => kachelFeld(k)),
        kachelFeld(null, '❓')),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein',
          onclick: () => vorlesen(`Wie geht das Muster weiter? ${aufgabe.gezeigt.map((k) => kachelName(k)).join(', ')} – und dann?`),
        }, '🔊 Muster vorlesen')),
      feedback ? el('div', { class: `k-hinweis${feedback.gut ? ' k-hinweis--richtig' : ''}` },
        el('p', { style: 'margin:0' }, feedback.text)) : null,
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Nächste Kachel wählen' },
        ...(feedback
          ? [el('button', { class: 'k-knopf', onclick: neueAufgabe }, 'Nächstes Muster ➡️')]
          : optionen.map((k) => el('button', {
            class: 'k-knopf k-knopf--neutral',
            'aria-label': kachelName(k),
            onclick: () => antworte(k),
          }, kachelZeichen(k, '1.5rem'), el('span', { style: 'margin-left:0.4rem' }, kachelName(k)))))),
      el('p', { style: 'text-align:center;margin:0.4rem 0 0' }, `Fortgesetzte Muster: ${geschafft}`)),
    regelKarte(),
  ];
}

function regelKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '📖 Die vier Regeln'),
    el('ul', { style: 'margin:0;padding-left:1.2rem' },
      ...REGELN.map((r) => el('li', {}, el('strong', {}, r.name), el('span', {}, `: ${r.erklaerung}`)))));
}

// ---------- Modus 2: Frei legen ----------
function aktualisiereStatus(text) {
  if (!statusAnzeige) return;
  const gelegt = zellenVon().filter(Boolean).length;
  statusAnzeige.textContent = text ?? `Gelegte Kacheln: ${gelegt}`;
}

function zeichneZelle(index) {
  const knopf = zellKnoepfe.get(index);
  if (!knopf) return;
  const vorlage = vorlageVon();
  const kachel = zellenVon()[index];
  knopf.replaceChildren(kachelZeichen(kachel, '1.4rem'));
  knopf.setAttribute('aria-label',
    `Zeile ${Math.floor(index / vorlage.spalten) + 1}, Spalte ${index % vorlage.spalten + 1}: ${kachelName(kachel)}`);
}

function setzeZelle(index) {
  const vorlage = vorlageVon();
  const felder = aktiveFelder(vorlage);
  if (!felder[index]) return;
  const zellen = zellenVon();
  const kachel = radierer ? null : { form: formId, farbe: farbeId };
  zellen[index] = kachel;
  zeichneZelle(index);
  if (spiegelAn) {
    const gegen = spiegelIndex(index, vorlage.spalten);
    if (gegen !== index && felder[gegen]) {
      zellen[gegen] = kachel;
      zeichneZelle(gegen);
    }
  }
  aktualisiereStatus();
}

function raster() {
  const vorlage = vorlageVon();
  const felder = aktiveFelder(vorlage);
  // Korrektur 29.10.2026 (Befund B-13, Browser-Prüfung): war 1fr; die Mindestbreite der Knöpfe ließ das Raster bei 360 px
  // über den Rand laufen (471 px bei 12 Spalten). minmax(0, 1fr) gibt den Spalten die Breite, die der Platz hergibt.
  return el('div', {
    role: 'group',
    'aria-label': `Raster der Vorlage ${vorlage.name}`,
    style: `display:grid;grid-template-columns:repeat(${vorlage.spalten}, minmax(0, 1fr));gap:0.2rem;max-width:${vorlage.spalten * 3}rem;margin:0.4rem auto`,
  }, ...felder.map((aktiv, i) => {
    if (!aktiv) return el('div', { 'aria-hidden': 'true', style: 'aspect-ratio:1' });
    const knopf = el('button', {
      style: 'aspect-ratio:1;min-width:2.2rem;padding:0;border:2px solid var(--k-rand);border-radius:0.4rem;'
        + 'background:var(--k-karte);cursor:pointer;display:flex;align-items:center;justify-content:center',
      onclick: () => setzeZelle(i),
    });
    zellKnoepfe.set(i, knopf);
    zeichneZelle(i); // füllt Zeichen und aria-Beschriftung
    return knopf;
  }));
}

function freiKarten() {
  const vorlage = vorlageVon();
  statusAnzeige = el('p', { style: 'text-align:center;font-weight:700;margin:0.3rem 0', 'aria-live': 'polite' }, ' ');
  const knoten = [
    el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Vorlage wählen' },
      ...daten.vorlagen.map((v) => el('button', {
        class: `k-knopf k-knopf--klein ${vorlageId === v.id ? '' : 'k-knopf--neutral'}`,
        'aria-pressed': String(vorlageId === v.id),
        onclick: () => { vorlageId = v.id; render(); },
      }, `${v.emoji} ${v.name}`))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.15rem' }, `${vorlage.emoji} ${vorlage.name}`),
      el('p', { style: 'margin:0.2rem 0' }, vorlage.idee),
      raster(),
      statusAnzeige,
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein',
          onclick: () => aktualisiereStatus(zellenVon().some(Boolean)
            ? (istSymmetrisch(zellenVon(), vorlage.spalten)
              ? '✅ Links und rechts sind gleich – dein Ornament ist gespiegelt!'
              : '↔️ Noch nicht spiegelgleich. Vergleiche die linke und die rechte Seite Feld für Feld.')
            : 'Leg erst ein paar Kacheln, dann prüfen wir den Spiegel.'),
        }, '↔️ Spiegel prüfen'),
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein',
          onclick: () => { zellenProVorlage.set(vorlage.id, new Array(vorlage.spalten * vorlage.raster.length).fill(null)); render(); },
        }, '🧽 Alles leeren'))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '🎨 Deine Kachel'),
      el('p', { style: 'margin:0.2rem 0' }, 'Erst Form und Farbe wählen, dann ins Raster tippen.'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Form wählen' },
        ...FORMEN.map((f) => el('button', {
          class: `k-knopf k-knopf--klein ${formId === f.id && !radierer ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(formId === f.id && !radierer),
          'aria-label': f.name,
          onclick: () => { formId = f.id; radierer = false; render(); },
        }, `${f.zeichen} ${f.name}`))),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Farbe wählen' },
        ...FARBEN.map((f) => el('button', {
          class: `k-knopf k-knopf--klein ${farbeId === f.id && !radierer ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(farbeId === f.id && !radierer),
          onclick: () => { farbeId = f.id; radierer = false; render(); },
        }, el('span', { style: `color:${f.wert};font-size:1.2rem` }, '●'), el('span', { style: 'margin-left:0.3rem' }, f.name)))),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: `k-knopf k-knopf--klein ${spiegelAn ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(spiegelAn),
          onclick: () => { spiegelAn = !spiegelAn; render(); },
        }, spiegelAn ? '🪞 Spiegel an' : '🪞 Spiegel aus'),
        el('button', {
          class: `k-knopf k-knopf--klein ${radierer ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(radierer),
          onclick: () => { radierer = !radierer; render(); },
        }, radierer ? '🧼 Radiergummi an' : '🧼 Radiergummi'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '💡 Mit dem Spiegel legst du automatisch links und rechts dasselbe – so entsteht ein echtes Ornament. Schalte ihn aus, wenn du bewusst etwas Unsymmetrisches ausprobieren willst.')),
  ];
  aktualisiereStatus();
  return knoten;
}

// ---------- Start ----------
function render() {
  zellKnoepfe = new Map();
  statusAnzeige = null;
  if (modus === 'fortsetzen') return zeige(...fortsetzenKarten());
  return zeige(...freiKarten());
}

const fehler = pruefeVorlagen(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
