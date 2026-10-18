// Tischdienst-Trainer (4-7, NUR gemeinsam mit einem Erwachsenen).
// Praleska docs/10 (Ko-Nutzung Nr. 17).
//
// Der Sitzplatz liegt immer UNTEN am Bildschirm – Bildschirm-links ist
// Figur-links ist Kind-links. Es wird nichts abgelehnt: die später
// gelegte Decke wird untergeschoben, eine Abmachung wird gesagt und das
// Umlegen angeboten, Geschmack bleibt unkommentiert. Siehe logik.mjs.
// Politik docs/02: keine externen Anfragen.
// Zufall nur hier: `mischen` wird an die Logik übergeben.
import daten from './daten/tischdienst.json' with { type: 'json' };
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  varianteVon, schrittVon, unterlageVon, zonenVon, unterlageFehlt,
  istAmPlatz, waehleLage, restVorrat, austeilenFertig,
  angeboteneSchritte, pruefeDaten, platzsetText, REIHENFOLGE_MITTE,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');

let variante = null;
let lage = null;
let verteiltAn = [];     // Indizes der Figuren, die schon eins haben
let gelegt = new Map();  // schrittId → zoneId
let angebot = [];        // Reihenfolge der Sachen-Knöpfe, EINMAL gemischt
let inDerHand = null;
let meldung = null;      // {text, art, umlegen?} – nie ein Tadel

// Der Fokus bleibt auf derselben Kennung, wenn derselbe Knopf nach dem
// Neuaufbau wieder da ist. Gibt es ihn nicht mehr, beginnt der neue
// Bildschirm vorne.
function zeige(...knoten) {
  const merke = document.activeElement?.dataset?.kennung;
  app.replaceChildren(...[
    el('div', { class: 'tdt-nur-bildschirm' },
      el('h1', { class: 'k-titel' }, '🍽️ Tischdienst'),
      el('p', { class: 'k-untertitel' }, 'Was kommt wohin – und hat jeder eins?')),
    ...knoten,
    el('footer', { class: 'k-fuss tdt-nur-bildschirm' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · keine Namen · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
  const gleicher = merke
    ? app.querySelector(`button[data-kennung="${merke}"]:not([disabled])`)
    : null;
  if (gleicher) {
    gleicher.focus();
    return;
  }
  // Neuer Bildschirm: der Fokus geht auf die Überschrift, nicht auf den Seitenkörper.
  const ueberschrift = app.querySelector('h1, h2');
  if (ueberschrift) {
    ueberschrift.setAttribute('tabindex', '-1');
    ueberschrift.focus();
    return;
  }
  app.querySelector('button:not([disabled])')?.focus();
}

const vorlesenKnopf = (text) =>
  el('button', {
    class: 'k-knopf k-knopf--neutral', 'data-kennung': 'vorlesen',
    onclick: () => vorlesen(text),
  }, '🔊 Vorlesen');

const erwachsenenKarte = (text) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, '👪 Für Erwachsene – redet zusammen:'),
  el('p', { style: 'margin-bottom:0' }, text));

const figur = () => el('div', { style: 'margin-top:0.4rem;text-align:center' },
  el('p', {
    role: 'img', 'aria-label': 'Hier sitzt das Kind, für das du deckst',
    style: 'margin:0;font-size:2rem;line-height:1',
  }, '🧒'),
  el('p', { style: 'margin:0;font-size:0.85em' }, 'Hier sitzt das Kind, für das du deckst.'));

function gate() {
  const intro = `${daten.fuerAndere} ${daten.ehrlichkeit} Es gibt keine Punkte und keine Sterne.`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🧑‍🍼🧒'),
      el('p', { style: 'font-weight:700;text-align:center;font-size:1.2em' }, 'Nur zusammen.'),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '🤝 Worum es geht:'),
        el('p', { style: 'margin-bottom:0' }, daten.fuerAndere)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '💡 Was die App über sich selbst sagt:'),
        el('p', { style: 'margin:0' }, daten.ehrlichkeit),
        el('p', { style: 'margin:0.4rem 0 0' }, daten.nurGemeinsam)),
      vorlesenKnopf(intro),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', 'data-kennung': 'los', onclick: typBildschirm }, '👪 Wir sind zusammen – los!'))));
}

// --------------------------------------------- Sitzungstyp (Erwachsene)
// Zwei Aufgaben mit getrennten Budgets, nie in derselben Sitzung: sonst
// wären es 15-30 Handlungen.
function typBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🤔'),
      el('p', { style: 'font-weight:700;font-size:1.25em;text-align:center' }, 'Was macht ihr heute?'),
      el('p', { style: 'text-align:center;margin-top:0' }, 'Eines von beiden – zusammen wäre es zu viel für eine Sitzung.'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Aufgabe wählen' },
        el('button', {
          class: 'k-knopf', style: 'min-height:4.5rem', 'data-kennung': 'typ-austeilen',
          onclick: starteAusteilen,
        }, `${daten.austeilen.gegenstand.emoji} ${daten.austeilen.titel} (ab 4)`),
        el('button', {
          class: 'k-knopf k-knopf--neutral', style: 'min-height:4.5rem', 'data-kennung': 'typ-decken',
          onclick: variantenBildschirm,
        }, '🍽️ Einen Platz decken')),
      vorlesenKnopf(`Was macht ihr heute? ${daten.austeilen.titel}. Oder einen Platz decken.`)));
}

// ------------------------------------------------------------ Austeilen
// Eins-zu-eins-Zuordnung OHNE Zahlen: „heute fehlt eines, also brauchst
// du eins weniger“ wäre Subtraktion und mit 4-5 nicht verfügbar.
function starteAusteilen() {
  lage = waehleLage(daten, mischen);
  verteiltAn = [];
  austeilBildschirm();
}

function austeilBildschirm() {
  const a = daten.austeilen;
  const fertig = austeilenFertig(lage, verteiltAn);
  const rest = restVorrat(lage, verteiltAn);
  const plaetze = [
    ...Array.from({ length: lage.figuren }, (_, i) => ({ kind: true, i })),
    ...Array.from({ length: lage.leer }, () => ({ kind: false })),
  ];
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:700;font-size:1.25em;text-align:center' }, a.titel),
      el('p', { style: 'text-align:center;margin-top:0' }, fertig ? a.fertigText : a.aufgabe),
      el('div', {
        role: 'group', 'aria-label': 'Kinder am Tisch',
        style: 'display:flex;gap:0.6rem;flex-wrap:wrap;justify-content:center;margin:1rem 0',
      }, ...plaetze.map((p) => (p.kind
        ? el('button', {
          class: `k-knopf ${verteiltAn.includes(p.i) ? '' : 'k-knopf--neutral'}`,
          style: 'min-height:4.6rem;min-width:4.6rem;display:flex;flex-direction:column;gap:0.1rem',
          disabled: (!verteiltAn.includes(p.i) && rest === 0) ? '' : null,
          'aria-label': verteiltAn.includes(p.i)
            ? `Dieses Kind hat ${a.gegenstand.name}`
            : (rest === 0
              ? 'Dieses Kind hat noch nichts, aber der Stapel ist leer'
              : `Dieses Kind hat noch nichts – antippen, um ${a.gegenstand.name} zu geben`),
          'data-kennung': `kind-${p.i}`,
          onclick: () => {
            if (!verteiltAn.includes(p.i) && rest > 0) {
              verteiltAn = [...verteiltAn, p.i];
              vorlesen(`Dieses Kind hat jetzt ${a.gegenstand.name}.`);
            }
            austeilBildschirm();
          },
        },
          el('span', { style: 'font-size:1.7rem;line-height:1' }, '🧒'),
          el('span', { style: 'font-size:1.3rem;line-height:1' }, verteiltAn.includes(p.i) ? a.gegenstand.emoji : '·'))
        : el('div', {
          role: 'img', 'aria-label': 'Dieser Platz ist heute leer',
          style: 'min-height:4.6rem;min-width:4.6rem;display:flex;align-items:center;justify-content:center;'
            + 'font-size:1.7rem;opacity:0.35;border:3px dashed var(--k-rand);border-radius:var(--k-radius)',
        }, '🪑')))),
      el('p', { style: 'text-align:center;margin:0;font-size:0.95em' },
        '🧒 = ein Kind ist da · 🪑 = dieser Platz ist heute leer'),
      // Der Stapel. Ohne ihn koennte „es bleibt etwas uebrig“ nie
      // eintreten, und genau das Uebrigbleiben ist der Kern: heute sind
      // nicht alle da. Gezaehlt wird nichts – man SIEHT es.
      el('div', { style: 'margin-top:1rem;padding-top:0.6rem;border-top:1px solid var(--k-rand)' },
        el('p', { style: 'margin:0 0 0.3rem;font-weight:700' },
          fertig ? `${a.gegenstand.emoji} Übrig:` : `${a.gegenstand.emoji} Dein Stapel:`),
        el('div', {
          role: 'img',
          'aria-label': rest
            ? `Auf dem Stapel liegen noch ${rest === 1 ? 'eins' : 'mehrere'}`
            : 'Der Stapel ist leer',
          style: 'display:flex;gap:0.3rem;flex-wrap:wrap;font-size:1.6rem;line-height:1;min-height:1.8rem',
        }, ...Array.from({ length: rest }, () => el('span', {}, a.gegenstand.emoji)),
          ...(rest ? [] : [el('span', { style: 'font-size:1em;opacity:0.6' }, '– leer –')])),
        el('p', { style: 'margin:0.3rem 0 0;font-size:0.95em' },
          fertig ? a.uebrigText : a.vorratText)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.8rem' },
        el('p', { style: 'margin:0' }, a.erklaerung)),
      fertig
        // Kein Belohnungszeichen: diese App sagt im Gate „keine Sterne“ zu,
        // und die Buchvorlage arbeitet an genau dieser Stelle mit einem
        // Sternchen-Ziel. 🤝 markiert das Fertigsein, ohne zu belohnen.
        ? el('div', { class: 'k-hinweis k-hinweis--richtig', style: 'margin-top:0.6rem' },
          el('p', { style: 'margin:0' }, `🤝 ${a.fertigText} ${a.hinweis}`))
        : null,
      fertig ? erwachsenenKarte(a.gespraech) : null,
      vorlesenKnopf(fertig
        ? `${a.fertigText} ${a.uebrigText} ${a.hinweis}`
        : `${a.titel} ${a.aufgabe} ${a.vorratText} ${a.erklaerung}`),
      fertig
        ? el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', 'data-kennung': 'austeil-weiter', onclick: ohneRichtigBildschirm }, 'Weiter ➡️'),
          el('button', { class: 'k-knopf k-knopf--neutral', 'data-kennung': 'austeil-noch', onclick: starteAusteilen }, '🔁 Noch einmal austeilen'))
        : null));
}

// ------------------------------------------------------- Variante wählen
function variantenBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🍽️'),
      el('p', { style: 'font-weight:700;font-size:1.25em;text-align:center' }, 'Welchen Tisch deckst du?'),
      el('p', { style: 'text-align:center;margin-top:0' }, 'Beides ist richtig gedeckt – nur anders.'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Tisch wählen' },
        ...daten.varianten.map((v) => el('button', {
          class: 'k-knopf k-knopf--neutral', style: 'min-height:4.5rem', 'data-kennung': `variante-${v.id}`,
          onclick: () => { variante = varianteVon(daten, v.id); rahmenBildschirm(); },
        }, `${v.emoji} ${v.name} (ab ${v.ab.split('-')[0]})`))),
      ...daten.varianten.map((v) => el('p', { style: 'margin:0.4rem 0;font-size:0.95em' }, `${v.emoji} ${v.hinweis}`)),
      vorlesenKnopf(`Welchen Tisch deckst du? ${daten.varianten.map((v) => `${v.name}. ${v.hinweis}`).join(' ')}`)));
}

// Der Geltungssatz steht EINMAL pro Sitzung – nicht als Floskel in jedem
// Schritt, und nicht nur auf der Elternseite: ein Kind dieses Alters hat
// einen Gegenbeleg, nämlich den eigenen Tisch zu Hause.
function rahmenBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🤝'),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, 'Bevor es losgeht:'),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'margin:0' }, daten.rahmenSatz)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'margin:0' }, '👉 Die Reihenfolge darfst du selbst wählen. Nur das Tischset oder die Decke gehört unter das Gedeck – aber auch das darf später kommen.')),
      vorlesenKnopf(daten.rahmenSatz),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', 'data-kennung': 'rahmen-los', onclick: starteDecken }, 'Los ➡️'))));
}

// --------------------------------------------------------------- Decken
function starteDecken() {
  gelegt = new Map();
  // Einmal pro Sitzung mischen. Vorher wurde bei jedem Tipp neu gemischt,
  // und die Knöpfe sprangen unter dem Finger eines Vierjährigen hin und
  // her.
  angebot = angeboteneSchritte(variante, [], mischen);
  inDerHand = null;
  meldung = null;
  deckBildschirm();
}

/** Ein Platz, Sitzplatz immer unten. Zonen sind immer echte Knöpfe. */
function gedeckFlaeche() {
  const u = unterlageVon(variante);
  const liegt = gelegt.has(u.id);
  // Die Unterlage hat keine eigene Zelle (sie liegt unter allem) – das
  // wird aus ihrem Schritt abgeleitet, nicht per Zeichenkette.
  const zonen = zonenVon(daten, variante).filter((z) => z.id !== u.zone);
  const inhalt = (zoneId) => [...gelegt.entries()]
    .filter(([, z]) => z === zoneId)
    .map(([id]) => schrittVon(variante, id));

  const zelle = (z) => {
    const dinge = inhalt(z.id);
    return el('button', {
      class: 'k-knopf k-knopf--neutral',
      'aria-label': `${z.frage}${dinge.length ? ` Hier liegt: ${dinge.map((d) => d.name).join(', ')}.` : ' Noch leer.'}`,
      'data-kennung': `zone-${z.id}`,
      style: 'min-height:4.4rem;display:flex;flex-direction:column;align-items:center;'
        + 'justify-content:center;gap:0.2rem;padding:0.4rem',
      // Mit Teil in der Hand legt der Tipp ab. Die Frage der Zone bleibt
      // trotzdem hoerbar: der Vorlese-Knopf unten zaehlt dann alle Zonen
      // auf – fuer ein Kind, das nicht liest, ist genau das die Information.
      onclick: () => (inDerHand ? legeAb(z.id) : vorlesen(z.frage)),
    },
      el('span', { style: 'font-size:1.8rem;line-height:1' }, dinge.length ? dinge.map((d) => d.emoji).join(' ') : '·'),
      el('span', { style: 'font-size:0.78em;font-weight:700;text-align:center' }, z.name));
  };

  const weit = zonen.find((z) => z.id === 'weiterWeg');

  const reihen = [];
  if (weit) reihen.push(el('div', { style: 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.4rem' },
    el('div', {}), zelle(weit), el('div', {})));
  // Dieselbe Anordnung wie auf dem gedruckten Platzset (REIHENFOLGE_MITTE).
  const mittelreihe = REIHENFOLGE_MITTE.map((id) => zonen.find((z) => z.id === id)).filter(Boolean);
  reihen.push(el('div', {
    style: `display:grid;grid-template-columns:repeat(${mittelreihe.length}, 1fr);gap:0.4rem`,
  }, ...mittelreihe.map(zelle)));

  return el('div', {
    style: 'border:4px solid var(--k-blau-dunkel);border-radius:var(--k-radius);padding:0.6rem;'
      + `background:${liegt ? 'var(--k-gelb)' : 'var(--k-papier)'}`,
  },
    el('p', { style: 'margin:0 0 0.4rem;text-align:center;font-weight:700;font-size:0.9em' },
      liegt ? `${u.emoji} ${u.name} liegt unter dem Gedeck` : `Noch nichts liegt unter dem Gedeck`),
    ...reihen,
    figur());
}

function deckBildschirm() {
  const offen = angebot.filter((x) => !gelegt.has(x.id));
  const fertig = offen.length === 0;
  const hand = inDerHand ? schrittVon(variante, inDerHand) : null;
  const u = unterlageVon(variante);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `${variante.emoji} ${variante.name} · ${gelegt.size} von ${variante.schritte.length}`),
      gedeckFlaeche(),
      meldung
        ? el('div', { class: `k-hinweis${meldung.art === 'gut' ? ' k-hinweis--richtig' : ''}`, style: 'margin-top:0.6rem' },
          el('p', { style: 'margin:0' }, meldung.text),
          // Die Einschraenkung der Abmachung gehoert zu den Erwachsenen –
          // sie war Pflichtfeld in den Daten und wurde nie angezeigt.
          meldung.fuerErwachsene
            ? el('p', { style: 'margin:0.4rem 0 0;font-size:0.9em' }, `👪 ${meldung.fuerErwachsene}`)
            : null,
          meldung.umlegen
            ? el('div', { class: 'k-antworten', style: 'margin-top:0.5rem' },
              el('button', {
                class: 'k-knopf', 'data-kennung': 'umlegen',
                onclick: () => {
                  const s = schrittVon(variante, meldung.umlegen);
                  gelegt.set(s.id, s.zone);
                  meldung = { art: 'gut', text: `${s.emoji} ${s.kindText}` };
                  vorlesen(s.kindText);
                  deckBildschirm();
                },
              }, '🔄 Umlegen'),
              el('button', {
                class: 'k-knopf k-knopf--neutral', 'data-kennung': 'so-lassen',
                onclick: () => { meldung = null; deckBildschirm(); },
              }, '👍 So lassen'))
            : null)
        : null,
      unterlageFehlt(variante, [...gelegt.keys()])
        ? el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
          el('p', { style: 'margin:0' }, `${u.emoji} ${u.grund}`))
        : null,
      fertig ? null : el('p', { style: 'margin:0.8rem 0 0.2rem;font-weight:700;text-align:center' },
        hand ? `Du hast: ${hand.emoji} ${hand.name}. Tipp jetzt auf ein Feld.` : 'Was nimmst du als Nächstes?'),
      fertig ? null : el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Sache nehmen' },
        ...offen.map((s) => el('button', {
          class: `k-knopf ${inDerHand === s.id ? '' : 'k-knopf--neutral'}`,
          style: 'min-height:3.4rem', 'data-kennung': `sache-${s.id}`,
          onclick: () => { inDerHand = s.id; meldung = null; deckBildschirm(); },
        }, `${s.emoji} ${s.name}`))),
      hand ? el('button', {
        class: 'k-knopf k-knopf--neutral', 'data-kennung': 'hand-zurueck',
        onclick: () => { inDerHand = null; meldung = null; deckBildschirm(); },
      }, '↩️ Doch etwas anderes') : null,
      vorlesenKnopf(fertig
        ? 'Der Platz ist gedeckt.'
        : (hand
          // Mit Teil in der Hand werden die Felder aufgezaehlt: ohne das
          // waere die einzige Unterscheidung von links und rechts die
          // Schrift, und in diesem Alter liest niemand.
          ? `Du hast ${hand.name}. Diese Felder gibt es: ${zonenVon(daten, variante)
            .filter((z) => z.id !== unterlageVon(variante).zone)
            .map((z) => z.name).join('. ')}. Tipp auf ein Feld.`
          : `Was nimmst du als Nächstes? ${offen.map((x) => x.name).join(', ')}.`)),
      fertig
        ? el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', 'data-kennung': 'decken-fertig', onclick: ohneRichtigBildschirm }, 'Fertig – weiter ➡️'),
          el('button', { class: 'k-knopf k-knopf--neutral', 'data-kennung': 'decken-noch', onclick: starteDecken }, '🔁 Noch einmal decken'))
        : null));
}

/**
 * Ablegen. Hier wird NICHTS abgelehnt (siehe logik.mjs, Entscheidung 1):
 *  - pruefbar später gelegt → wird untergeschoben und erklärt
 *  - ausgemacht am anderen Platz → bleibt liegen, die Abmachung wird
 *    gesagt, das Umlegen angeboten; das Kind entscheidet
 *  - geschmack → keine Reaktion, kein Hinweis
 */
function legeAb(zoneId) {
  const s = schrittVon(variante, inDerHand);
  if (!s) return;
  gelegt.set(s.id, s.geltung === 'pruefbar' ? s.zone : zoneId);
  inDerHand = null;

  if (s.geltung === 'pruefbar') {
    const drunter = (s.liegtUnter ?? []).some((id) => gelegt.has(id));
    const text = drunter ? s.spaeterText : s.kindText;
    meldung = { art: 'gut', text: `${s.emoji} ${text}` };
    vorlesen(text);
  } else if (s.geltung === 'geschmack') {
    meldung = { art: 'gut', text: `💛 ${s.kindText}`, fuerErwachsene: s.geltungsbereich };
    vorlesen(s.kindText);
  } else if (istAmPlatz(s, zoneId)) {
    meldung = { art: 'gut', text: `${s.emoji} ${s.kindText}`, fuerErwachsene: s.geltungsbereich };
    vorlesen(s.kindText);
  } else {
    // Die Sache bleibt liegen. Die Figur sagt, was ausgemacht ist, und
    // bietet das Umlegen an – entscheiden darf das Kind.
    meldung = { art: 'hinweis', text: `🧒 ${s.kindText} Willst du es umlegen?`, umlegen: s.id, fuerErwachsene: s.geltungsbereich };
    vorlesen(`${s.kindText} Willst du es umlegen?`);
  }
  deckBildschirm();
}

// -------------------------------------------- was gar kein Richtig hat
function ohneRichtigBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🤷'),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, 'Und das hier hat gar kein Richtig:'),
      el('ul', {}, ...daten.ohneRichtig.map((o) => el('li', { style: 'margin-bottom:0.4rem' }, o))),
      el('div', { style: 'margin-top:0.8rem' },
        el('p', { style: 'font-weight:700;margin:0 0 0.3rem' }, '🗣️ So heißt das auf drei Sprachen:'),
        ...daten.woerter.map((w) => el('p', { style: 'margin:0.15rem 0;font-size:0.95em' },
          `${w.de} · ${w.uk} (uk) · ${w.ru} (ru)`)),
        el('p', { style: 'margin:0.4rem 0 0;font-size:0.9em' },
          '👪 Die fremden Wörter liest am besten jemand vor, der sie kennt – die Gerätestimme kann sie nicht immer.')),
      vorlesenKnopf(`Das hier hat gar kein Richtig. ${daten.ohneRichtig.join(' ')}`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', 'data-kennung': 'ohne-weiter', onclick: schluss }, 'Weiter ➡️'))));
}

// ------------------------------------------------------------- Schluss
function schluss() {
  const text = `Bildschirm aus – jetzt deckt ihr richtig! ${daten.schlussIdeen.join(' ')}`;
  zeige(
    el('section', { class: 'k-karte tdt-nur-bildschirm' },
      el('p', { class: 'k-gross' }, '🍽️'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-bottom:0' }, 'Bildschirm aus –'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-top:0' }, 'jetzt deckt ihr richtig!'),
      el('ul', {}, ...daten.schlussIdeen.map((i) => el('li', { style: 'margin-bottom:0.5rem' }, i))),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'margin:0' }, `💡 ${daten.ehrlichkeit}`)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '👪 Erwachsene, vorher einmal lesen:'),
        el('ul', { style: 'margin:0;padding-left:1.2rem' },
          ...daten.sicherheit.map((s) => el('li', { style: 'margin-bottom:0.3rem' }, s)))),
      vorlesenKnopf(text),
      el('div', { class: 'k-antworten' },
        variante ? el('button', { class: 'k-knopf', 'data-kennung': 'schluss-drucken', onclick: () => window.print() }, '🖨️ Platzset drucken') : null,
        el('button', { class: 'k-knopf k-knopf--neutral', 'data-kennung': 'schluss-typ', onclick: typBildschirm }, '🔁 Noch etwas machen'),
        el('button', { class: 'k-knopf k-knopf--neutral', 'data-kennung': 'schluss-start', onclick: gate }, '🏡 Zum Start'))),
    variante ? platzset() : null);
}

/**
 * Das druckbare Platzset. Der gedruckte Teil kommt aus platzsetText
 * (logik.mjs) und ist reiner Text: keine Emojis, keine Häkchen, keine Namenszeile.
 * Auch keine Punkte. Die Bildschirm-Hinweise darüber stehen in
 * .tdt-nur-bildschirm und fallen beim Drucken weg.
 */
function platzset() {
  const t = platzsetText(daten, variante);
  const feld = (f) => el('div', {
    class: 'tdt-feld',
    style: 'border:3px dashed #000;border-radius:0.6rem;padding:0.4rem;display:flex;'
      + 'flex-direction:column;align-items:center;justify-content:center;min-height:3.4rem',
  },
    el('span', { style: 'font-size:0.8em;font-weight:700;text-align:center' }, f.name),
    el('span', { style: 'font-size:0.8em;text-align:center' }, f.inhalt));
  return el('section', { class: 'tdt-platzset-block' },
    el('div', { class: 'tdt-nur-bildschirm' },
      el('h2', { style: 'margin-top:1rem;font-size:1.1em' }, `🖨️ ${t.titel}`),
      el('p', { style: 'margin:0 0 0.6rem;font-size:0.95em' }, daten.platzset.hinweis)),
    el('div', { class: 'k-karte tdt-platzset' },
      el('p', { style: 'margin:0 0 0.4rem;font-size:0.85em' }, t.kopf),
      t.unter ? el('p', { style: 'margin:0 0 0.6rem;font-weight:700' }, `Unter dem Gedeck: ${t.unter}`) : null,
      t.weiterWeg
        ? el('div', { style: 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;margin-bottom:0.5rem' },
          el('div', {}), feld(t.weiterWeg), el('div', {}))
        : null,
      el('div', { style: `display:grid;grid-template-columns:repeat(${t.reihe.length}, 1fr);gap:0.5rem` },
        ...t.reihe.map(feld)),
      el('p', { style: 'margin:0.6rem 0 0;text-align:center' }, t.figur),
      t.ohneFestenPlatz.length
        ? el('p', { style: 'margin:0.4rem 0 0;font-size:0.9em' }, `Ohne festen Platz: ${t.ohneFestenPlatz.join(' / ')}`)
        : null,
      el('p', { style: 'margin:0.4rem 0 0;font-size:0.85em' }, `${t.blickrichtung}.`),
      el('p', { class: 'tdt-pflicht', style: 'margin:0.6rem 0 0;font-size:0.8em' }, t.pflicht)));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  gate();
}
