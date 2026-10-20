// Tonleiter-Treppe (5-7 kurze Einheiten, Vertiefung 8-12): Notenlernen nach
// dem „Lesenka“-Prinzip – Töne auf einer visuellen Treppe hören, nachbauen,
// benennen. Erst der erste Tetrachord (Do-Re-Mi-Fa), dann der zweite.
// Alle Töne werden lokal per WebAudio erzeugt (keine Audiodateien, keine
// externen Requests). Relative Solmisation + deutsche Tonnamen parallel.
// Praleska docs/10 (Kinder-Apps Nr. 6). Politik docs/02: keine externen
// Anfragen, speichert nichts.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { TONLEITER, tonFuer, richtungVon, folgeRichtig, baueAufgabe, pruefeTonleiter } from './logik.mjs';
import { TETRACHORDE } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const app = document.getElementById('app');
const TON_DAUER = 0.5;
const zufall = (liste) => liste[Math.floor(Math.random() * liste.length)];

let audio = null; // AudioContext erst bei der ersten Nutzer-Geste
let modus = 'erkunden';   // erkunden | hoeren | nachbau
let aufgabe = null;       // aktuelle Höraufgabe {art, stufen, richtig}
let eingabe = [];         // getippte Stufen im Nachbau-Modus
let feedback = null;      // {gut, text}
const spieltGerade = new Set(); // Stufen, die gerade leuchten
let treppenKnoepfe = new Map(); // Stufe → Knopf der aktuell gezeigten Treppe
let lauf = 0;             // Generation der Wiedergabe (bricht ältere ab)
let laufendeTimer = [];   // Timer der laufenden Wiedergabe
let laufendeToene = [];   // Oszillatoren der laufenden Wiedergabe

function ctx() {
  if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
  if (audio.state === 'suspended') audio.resume();
  return audio;
}

function ton(hz, startAt, dauer, gain = 0.2) {
  const a = ctx();
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = 'triangle';
  osc.frequency.value = hz;
  g.gain.setValueAtTime(0, startAt);
  g.gain.linearRampToValueAtTime(gain, startAt + 0.02);
  g.gain.setValueAtTime(gain, startAt + dauer - 0.06);
  g.gain.linearRampToValueAtTime(0, startAt + dauer);
  osc.connect(g).connect(a.destination);
  osc.start(startAt);
  osc.stop(startAt + dauer + 0.02);
  return osc;
}

/**
 * Bricht eine laufende Wiedergabe ab: Töne stoppen, Timer verwerfen, Leuchten
 * löschen. Ohne das würden zwei Folgen übereinander klingen und die Timer der
 * älteren Folge das Leuchten der neueren wieder ausschalten.
 */
function stoppeWiedergabe() {
  lauf += 1;
  laufendeTimer.forEach(clearTimeout);
  laufendeTimer = [];
  for (const osc of laufendeToene) {
    try { osc.stop(); } catch { /* war schon zu Ende */ }
  }
  laufendeToene = [];
  if (spieltGerade.size) {
    spieltGerade.clear();
    aktualisiereTreppe();
  }
}

/** Spielt eine Stufenfolge und lässt die Stufen dabei aufleuchten. */
function spieleFolge(stufen) {
  stoppeWiedergabe();
  const dieserLauf = lauf;
  const start = ctx().currentTime + 0.05;
  stufen.forEach((s, i) => {
    laufendeToene.push(ton(tonFuer(s).hz, start + i * (TON_DAUER + 0.1), TON_DAUER));
    const an = (0.05 + i * (TON_DAUER + 0.1)) * 1000;
    laufendeTimer.push(setTimeout(() => {
      if (dieserLauf !== lauf) return;
      spieltGerade.add(s);
      aktualisiereTreppe();
    }, an));
    laufendeTimer.push(setTimeout(() => {
      if (dieserLauf !== lauf) return;
      spieltGerade.delete(s);
      aktualisiereTreppe();
    }, an + TON_DAUER * 1000));
  });
}

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🎵 Tonleiter-Treppe'),
    el('p', { class: 'k-untertitel' }, 'Töne steigen die Treppe rauf und runter – hör genau hin!'),
    el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Modus' },
      ...[['erkunden', '🪜 Treppe erkunden'], ['hoeren', '👂 Hör-Quiz'], ['nachbau', '🔁 Nachbauen']].map(([id, name]) =>
        el('button', {
          class: `k-knopf k-knopf--klein ${modus === id ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(modus === id),
          onclick: () => { stoppeWiedergabe(); modus = id; aufgabe = null; eingabe = []; feedback = null; render(); },
        }, name))),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Töne entstehen im Gerät · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

/** Nur die Leucht-Klassen der Treppe nachziehen – ohne Neuaufbau der Seite,
 *  damit die Tastatur-Fokussierung beim Abspielen erhalten bleibt. */
function aktualisiereTreppe() {
  for (const [stufe, knopf] of treppenKnoepfe) {
    knopf.className = 'k-knopf' + (spieltGerade.has(stufe) ? '' : ' k-knopf--neutral');
  }
}

/** Die Treppe: 8 Stufen, aufsteigend gezeichnet; onTritt(stufe) beim Tippen. */
// Zwei Reihen zu je einem Tetrachord (unten Do-Re-Mi-Fa, oben Sol-La-Si-Do): bei 360 px
// passen acht Knöpfe mit je 48 px nicht in eine Reihe, vier pro Reihe schon.
function treppe(onTritt) {
  return el('div', { role: 'group', 'aria-label': 'Tonleiter-Treppe von c bis c-Strich', style: 'display:grid;grid-template-columns:repeat(4,minmax(0,2.7rem));align-items:end;justify-content:center;gap:0.25rem;padding:0.3rem 0' },
    ...TONLEITER.map((t) => {
      const knopf = el('button', {
        class: 'k-knopf' + (spieltGerade.has(t.stufe) ? '' : ' k-knopf--neutral'),
        style: `grid-row:${TETRACHORDE.erster.includes(t.stufe) ? 2 : 1};padding:0.4rem 0.2rem;display:flex;flex-direction:column;align-items:center;gap:0.1rem;height:${2.8 + t.stufe * 0.55}rem;justify-content:flex-end`,
        'aria-label': `Stufe ${t.stufe}: ${t.solmisation}, Ton ${t.deutsch}`,
        onclick: () => onTritt(t.stufe),
      }, el('span', { style: 'font-weight:700' }, t.solmisation), el('span', { style: 'font-size:0.75rem;opacity:0.8' }, t.deutsch));
      treppenKnoepfe.set(t.stufe, knopf);
      return knopf;
    }));
}

// ---------- Erkunden ----------
function erkundenKarte() {
  return [
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Tippe die Stufen an und hör, wie die Töne die Treppe raufsteigen. Unten die ersten vier (Do-Re-Mi-Fa), oben die zweiten vier (Sol-La-Si-Do). Jeder Ton hat auch einen deutschen Namen: c, d, e, f, g, a, h, c′.'),
      treppe((stufe) => spieleFolge([stufe])),
      el('div', { class: 'k-antworten', style: 'margin-top:0.4rem' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => spieleFolge([1, 2, 3, 4]) }, '▶️ Erster Tetrachord (Do-Re-Mi-Fa)'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => spieleFolge([5, 6, 7, 8]) }, '▶️ Zweiter Tetrachord (Sol-La-Si-Do)'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => spieleFolge([1, 2, 3, 4, 5, 6, 7, 8]) }, '▶️ Ganze Treppe rauf'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => spieleFolge([8, 7, 6, 5, 4, 3, 2, 1]) }, '▶️ Ganze Treppe runter'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '💡 Sing mit! Erst nur die unteren vier Stufen, dann die oberen. Wer mag, singt die Treppe mit den Tonnamen rauf und runter – das ist echtes Solfeggio-Training.')),
  ];
}

// ---------- Hör-Quiz ----------
function neueHoerAufgabe() {
  const art = zufall(['hoeher', 'richtung']);
  aufgabe = baueAufgabe(art, zufall);
  feedback = null;
  render();
  spieleFolge(aufgabe.stufen);
}

function hoerenKarte() {
  if (!aufgabe) {
    return [el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Die App spielt dir Töne vor – hör genau hin und antworte. Es gibt zwei Fragen-Arten: „Welcher Ton ist höher?“ und „Geht die Treppe rauf oder runter?“'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: neueHoerAufgabe }, '▶️ Erste Aufgabe')))];
  }
  const istHoeher = aufgabe.art === 'hoeher';
  const frage = istHoeher ? 'Welcher Ton ist höher – der erste oder der zweite?' : 'Geht die Ton-Treppe rauf oder runter?';
  return [el('section', { class: 'k-karte' },
    el('p', { class: 'k-gross' }, '👂'),
    el('p', { style: 'font-weight:700;font-size:1.15em;text-align:center' }, frage),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => spieleFolge(aufgabe.stufen) }, '🔁 Nochmal anhören'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(frage) }, '🔊 Frage vorlesen')),
    feedback ? el('div', { class: `k-hinweis${feedback.gut ? ' k-hinweis--richtig' : ''}` },
      el('p', { style: 'margin:0' }, feedback.text)) : null,
    el('div', { class: 'k-antworten' },
      ...(feedback
        ? [el('button', { class: 'k-knopf', onclick: neueHoerAufgabe }, 'Nächste Aufgabe ➡️')]
        : istHoeher
          ? [el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => hoerAntwort(aufgabe.stufen[0]) }, '1️⃣ Der erste'),
             el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => hoerAntwort(aufgabe.stufen[1]) }, '2️⃣ Der zweite')]
          : [el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => hoerAntwort('rauf') }, '⬆️ Rauf'),
             el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => hoerAntwort('runter') }, '⬇️ Runter')])))];
}

function hoerAntwort(wahl) {
  const gut = wahl === aufgabe.richtig;
  const loesung = aufgabe.art === 'hoeher'
    ? `Der höhere Ton war ${tonFuer(aufgabe.richtig).solmisation} (${tonFuer(aufgabe.richtig).deutsch}).`
    : `Die Treppe ging ${aufgabe.richtig === 'rauf' ? 'rauf ⬆️' : 'runter ⬇️'}: ${aufgabe.stufen.map((s) => tonFuer(s).solmisation).join(' – ')}.`;
  feedback = { gut, text: `${gut ? '🌟 Genau richtig! ' : '💭 Hör noch einmal hin: '}${loesung}` };
  render();
}

// ---------- Nachbauen ----------
function neueNachbauAufgabe() {
  aufgabe = baueAufgabe('nachbau', zufall, zufall([2, 3, 3, 4]));
  eingabe = [];
  feedback = null;
  render();
  spieleFolge(aufgabe.stufen);
}

function nachbauKarte() {
  if (!aufgabe) {
    return [el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Die App spielt eine kleine Ton-Folge (2 bis 4 Töne aus einem Tetrachord). Bau sie auf der Treppe nach – tippe die Stufen in derselben Reihenfolge!'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: neueNachbauAufgabe }, '▶️ Erste Folge')))];
  }
  return [el('section', { class: 'k-karte' },
    el('p', { style: 'font-weight:700;text-align:center;margin-top:0' }, `Baue die Folge nach (${aufgabe.stufen.length} Töne):`),
    treppe((stufe) => {
      if (feedback) return;
      spieleFolge([stufe]);
      eingabe = [...eingabe, stufe];
      if (eingabe.length >= aufgabe.stufen.length) {
        const gut = folgeRichtig(aufgabe.richtig, eingabe);
        const loesung = aufgabe.stufen.map((s) => tonFuer(s).solmisation).join(' – ');
        feedback = { gut, text: gut ? `🌟 Perfekt nachgebaut: ${loesung}!` : `💭 Fast! Die Folge war: ${loesung}. Hör sie dir nochmal an.` };
      }
      render();
    }),
    el('p', { style: 'text-align:center;margin:0.3rem 0' }, `Deine Eingabe: ${eingabe.length ? eingabe.map((s) => tonFuer(s).solmisation).join(' – ') : '–'}`),
    feedback ? el('div', { class: `k-hinweis${feedback.gut ? ' k-hinweis--richtig' : ''}` },
      el('p', { style: 'margin:0' }, feedback.text)) : null,
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => spieleFolge(aufgabe.stufen) }, '🔁 Folge nochmal anhören'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { eingabe = []; feedback = null; render(); } }, '↩️ Eingabe löschen'),
      feedback ? el('button', { class: 'k-knopf', onclick: neueNachbauAufgabe }, 'Nächste Folge ➡️') : null))];
}

function render() {
  treppenKnoepfe = new Map(); // die Knöpfe werden gleich neu gebaut
  if (modus === 'erkunden') return zeige(...erkundenKarte());
  if (modus === 'hoeren') return zeige(...hoerenKarte());
  if (modus === 'nachbau') return zeige(...nachbauKarte());
}

const fehler = pruefeTonleiter();
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
