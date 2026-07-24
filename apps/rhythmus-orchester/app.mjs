// Rhythmus-Orchester (5-7 kurze Einheiten, Vertiefung 8-12): Sprechverse in
// Rhythmus-Silben (ta / ti-ti / Pause) klatschen, stampfen und schnipsen –
// und am Ende zu dritt als kleines Körper-Percussion-Orchester nacheinander
// einsetzen. Alle Klänge entstehen lokal per WebAudio (kein Mikrofon, keine
// Audiodateien, keine externen Anfragen). Das visuelle Metronom leuchtet auf
// jedem Schlag mit – so kann man auch ohne Hören mitmachen (BFSG).
// Praleska docs/10 (Kinder-Apps Nr. 7). Politik docs/02: speichert nichts.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import {
  BAUSTEINE, TEMPI, SCHLAEGE_PRO_TAKT, bausteinVon, anschlaege, musterRichtig,
  baueMuster, silbenGruppen, silbenText, sprechText, stimmenFuerPhrase, pruefeDaten,
} from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const app = document.getElementById('app');
const daten = await fetch('daten/rhythmen.json').then((r) => r.json());
const zufall = (liste) => liste[Math.floor(Math.random() * liste.length)];
const PHRASEN = 4; // so viele Takte dauert das „Nacheinander einsetzen“

const FELD_BASIS = 'min-width:3.4rem;flex:1 1 3.4rem;border:2px solid var(--k-rand);border-radius:0.6rem;'
  + 'padding:0.35rem 0.15rem;text-align:center;background:var(--k-karte)';

let modus = 'mitmachen';      // mitmachen | nachbau | orchester
let versId = daten.verse[0].id;
let tempoId = 'mittel';
let aufgabe = null;           // Nachbau: vorgegebenes Muster
let eingabe = [];             // Nachbau: getippte Bausteine
let feedback = null;          // {gut, text}
const gewaehlteStimmen = new Set(daten.stimmen.map((s) => s.id));

let aktiverTakt = -1;         // welcher Takt leuchtet gerade
let aktiverSchlag = -1;       // welcher Schlag darin
let aktivePhrase = -1;        // Orchester: Phrase 1..4
let metronomFelder = new Map(); // "takt:schlag" → Element der aktuellen Ansicht
let phrasenAnzeige = null;    // Textzeile „Phrase 2 von 4“

// ---------- Klang (alles lokal erzeugt) ----------
let audio = null;
let rauschPuffer = null;
let lauf = 0;                 // Generation der Wiedergabe (bricht ältere ab)
let laufendeTimer = [];
let laufendeToene = [];

function ctx() {
  if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
  if (audio.state === 'suspended') audio.resume();
  return audio;
}

/** Weißes Rauschen als Grundlage für Klatschen und Schnipsen. */
function rauschQuelle(a) {
  if (!rauschPuffer || rauschPuffer.sampleRate !== a.sampleRate) {
    const laenge = Math.floor(a.sampleRate * 0.4);
    rauschPuffer = a.createBuffer(1, laenge, a.sampleRate);
    const werte = rauschPuffer.getChannelData(0);
    for (let i = 0; i < laenge; i++) werte[i] = Math.random() * 2 - 1;
  }
  const quelle = a.createBufferSource();
  quelle.buffer = rauschPuffer;
  return quelle;
}

function rauschKlang(startAt, hz, dauer, gain) {
  const a = ctx();
  const quelle = rauschQuelle(a);
  const filter = a.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = hz;
  const g = a.createGain();
  g.gain.setValueAtTime(gain, startAt);
  g.gain.exponentialRampToValueAtTime(0.0005, startAt + dauer);
  quelle.connect(filter).connect(g).connect(a.destination);
  quelle.start(startAt);
  quelle.stop(startAt + dauer + 0.02);
  return quelle;
}

/** Stampfen: tiefer, schnell fallender Sinus – der „Fuß auf dem Boden“. */
function stampfKlang(startAt) {
  const a = ctx();
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(95, startAt);
  osc.frequency.exponentialRampToValueAtTime(45, startAt + 0.16);
  g.gain.setValueAtTime(0.0005, startAt);
  g.gain.exponentialRampToValueAtTime(0.3, startAt + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0005, startAt + 0.18);
  osc.connect(g).connect(a.destination);
  osc.start(startAt);
  osc.stop(startAt + 0.2);
  return osc;
}

function spielKlang(art, startAt) {
  if (art === 'stampfen') return stampfKlang(startAt);
  if (art === 'schnipsen') return rauschKlang(startAt, 2600, 0.05, 0.22);
  return rauschKlang(startAt, 900, 0.09, 0.28);
}

/** Metronom-Klick: der erste Schlag im Takt klingt heller. */
function klick(startAt, betont) {
  const a = ctx();
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = 'triangle';
  osc.frequency.value = betont ? 1600 : 1150;
  g.gain.setValueAtTime(0.0005, startAt);
  g.gain.exponentialRampToValueAtTime(betont ? 0.1 : 0.06, startAt + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0005, startAt + 0.05);
  osc.connect(g).connect(a.destination);
  osc.start(startAt);
  osc.stop(startAt + 0.07);
  return osc;
}

/**
 * Bricht eine laufende Wiedergabe ab: Klänge stoppen, Timer verwerfen,
 * Metronom löschen. Ohne das liefen zwei Stücke übereinander und die Timer der
 * älteren Wiedergabe würden das Leuchten der neueren wieder ausschalten.
 */
function stoppeWiedergabe() {
  lauf += 1;
  laufendeTimer.forEach(clearTimeout);
  laufendeTimer = [];
  for (const quelle of laufendeToene) {
    try { quelle.stop(); } catch { /* war schon zu Ende */ }
  }
  laufendeToene = [];
  if (aktiverTakt !== -1 || aktivePhrase !== -1) {
    aktiverTakt = -1;
    aktiverSchlag = -1;
    aktivePhrase = -1;
    aktualisiereMetronom();
  }
}

/**
 * Spielt eine Folge von Takten ab.
 * @param {Array<{takt:number, phrase?:number, stimmen:Array<{muster:string[], klang:string}>}>} bloecke
 */
function spielePlan(bloecke) {
  stoppeWiedergabe();
  const dieserLauf = lauf;
  const bpm = tempoVon().bpm;
  const schlagDauer = 60 / bpm;
  const vorlauf = 0.15;
  const start = ctx().currentTime + vorlauf;
  bloecke.forEach((block, bi) => {
    const versatz = bi * SCHLAEGE_PRO_TAKT * schlagDauer;
    const ab = start + versatz;
    for (let i = 0; i < SCHLAEGE_PRO_TAKT; i++) {
      laufendeToene.push(klick(ab + i * schlagDauer, i === 0));
      laufendeTimer.push(setTimeout(() => {
        if (dieserLauf !== lauf) return;
        aktiverTakt = block.takt;
        aktiverSchlag = i;
        aktivePhrase = block.phrase ?? -1;
        aktualisiereMetronom();
      }, (vorlauf + versatz + i * schlagDauer) * 1000));
    }
    for (const stimme of block.stimmen) {
      for (const treffer of anschlaege(stimme.muster, bpm, ab)) {
        laufendeToene.push(spielKlang(stimme.klang, treffer.zeit));
      }
    }
  });
  laufendeTimer.push(setTimeout(() => {
    if (dieserLauf !== lauf) return;
    aktiverTakt = -1;
    aktiverSchlag = -1;
    aktivePhrase = -1;
    aktualisiereMetronom();
  }, (vorlauf + bloecke.length * SCHLAEGE_PRO_TAKT * schlagDauer) * 1000));
}

/** Ein einzelner Klang sofort – zum Mitmachen mit den Händen. */
function sofortKlang(art) {
  spielKlang(art, ctx().currentTime + 0.01);
}

// ---------- Ansicht ----------
function tempoVon() {
  return TEMPI.find((t) => t.id === tempoId) ?? TEMPI[1];
}

function versVon() {
  return daten.verse.find((v) => v.id === versId) ?? daten.verse[0];
}

/** Nur die Leucht-Zustände nachziehen – ohne Neuaufbau, damit der Fokus bleibt. */
function aktualisiereMetronom() {
  const schluessel = `${aktiverTakt}:${aktiverSchlag}`;
  for (const [id, knoten] of metronomFelder) {
    const an = id === schluessel;
    knoten.style.background = an ? 'var(--k-gelb)' : 'var(--k-karte)';
    knoten.style.borderColor = an ? 'var(--k-blau)' : 'var(--k-rand)';
  }
  if (phrasenAnzeige) {
    phrasenAnzeige.textContent = aktivePhrase > 0
      ? `Phrase ${aktivePhrase} von ${PHRASEN} – es spielen: ${stimmenFuerPhrase(daten.stimmen, aktivePhrase).map((s) => s.name).join(', ')}`
      : 'Noch spielt niemand.';
  }
}

/** Ein Metronom-Feld (= ein Schlag). `inhalt` steht unter dem Notenzeichen. */
function feld(taktIndex, schlag, zeichen, inhalt) {
  const knoten = el('div', { style: FELD_BASIS },
    el('div', { style: 'font-size:1.5rem;line-height:1.2' }, zeichen),
    el('div', { style: 'font-size:0.75rem;opacity:0.85;word-break:break-word' }, inhalt));
  metronomFelder.set(`${taktIndex}:${schlag}`, knoten);
  return knoten;
}

function feldZeile(...felder) {
  return el('div', { style: 'display:flex;gap:0.3rem;align-items:stretch;margin:0.3rem 0', 'aria-hidden': 'true' }, ...felder);
}

/** Zeigt einen Takt des Verses als vier Felder mit Zeichen und Silben. */
function taktZeile(takt, taktIndex) {
  const gruppen = silbenGruppen(takt);
  return feldZeile(...takt.bausteine.map((id, i) => feld(
    taktIndex, i,
    bausteinVon(id).zeichen,
    gruppen[i].silben.length ? gruppen[i].silben.join('-') : 'still',
  )));
}

function tempoZeile() {
  return el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Tempo' },
    ...TEMPI.map((t) => el('button', {
      class: `k-knopf k-knopf--klein ${tempoId === t.id ? '' : 'k-knopf--neutral'}`,
      'aria-pressed': String(tempoId === t.id),
      onclick: () => { stoppeWiedergabe(); tempoId = t.id; render(); },
    }, `${t.name} (${t.bpm})`)));
}

function mitmachZeile() {
  return el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Mitmachen' },
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => sofortKlang('klatschen') }, '👏 Klatschen'),
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => sofortKlang('stampfen') }, '🦶 Stampfen'),
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => sofortKlang('schnipsen') }, '🤏 Schnipsen'));
}

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🥁 Rhythmus-Orchester'),
    el('p', { class: 'k-untertitel' }, 'ta – ti-ti – Pause: Verse sprechen, klatschen, stampfen und zusammen spielen.'),
    el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Modus' },
      ...[['mitmachen', '🗣️ Vers mitmachen'], ['nachbau', '🔁 Rhythmus nachbauen'], ['orchester', '🎼 Orchester']].map(([id, name]) =>
        el('button', {
          class: `k-knopf k-knopf--klein ${modus === id ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(modus === id),
          onclick: () => { stoppeWiedergabe(); modus = id; aufgabe = null; eingabe = []; feedback = null; render(); },
        }, name))),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Klänge entstehen im Gerät · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

// ---------- Modus 1: Vers mitmachen ----------
function mitmachenKarten() {
  const vers = versVon();
  const zeilen = vers.takte.map((t) => silbenText(t));
  return [
    el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Vers wählen' },
      ...daten.verse.map((v) => el('button', {
        class: `k-knopf k-knopf--klein ${versId === v.id ? '' : 'k-knopf--neutral'}`,
        'aria-pressed': String(versId === v.id),
        onclick: () => { stoppeWiedergabe(); versId = v.id; render(); },
      }, `${v.emoji} ${v.titel}`))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.15rem' }, `${vers.emoji} ${vers.titel}`),
      el('p', { style: 'font-size:1.1rem;font-weight:700;margin:0.2rem 0' }, zeilen[0]),
      taktZeile(vers.takte[0], 0),
      el('p', { style: 'font-size:1.1rem;font-weight:700;margin:0.2rem 0' }, zeilen[1]),
      taktZeile(vers.takte[1], 1),
      el('p', { class: 'k-hinweis' }, '♩ ta = ein Schlag · ♫ ti-ti = zwei schnelle Silben auf einem Schlag · ⏸ Pause = ein Schlag Stille. Die gelben Felder zeigen den Schlag mit – auch ohne Ton.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => spieleVers(vers) }, '▶️ Rhythmus vorspielen'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(vers.takte.map((t) => sprechText(t)).join(' ')) }, '🔊 Vers vorlesen'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: stoppeWiedergabe }, '⏹️ Stopp')),
      tempoZeile()),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '🤸 Dazu bewegen'),
      el('p', { style: 'margin:0.2rem 0' }, vers.bewegung),
      el('p', { style: 'margin:0.2rem 0' }, 'Sprich den Vers laut mit und klatsche jede Silbe. Dann probier es andersherum: sprechen und dabei stampfen.'),
      mitmachZeile()),
  ];
}

function spieleVers(vers) {
  spielePlan(vers.takte.map((takt, i) => ({
    takt: i,
    stimmen: [{ muster: takt.bausteine, klang: 'klatschen' }],
  })));
}

// ---------- Modus 2: Rhythmus nachbauen ----------
function neueAufgabe() {
  aufgabe = baueMuster(zufall);
  eingabe = [];
  feedback = null;
  render();
  spielePlan([{ takt: 0, stimmen: [{ muster: aufgabe, klang: 'klatschen' }] }]);
}

function nachbauKarten() {
  if (!aufgabe) {
    return [el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Die App klatscht einen Rhythmus aus vier Schlägen. Bau ihn nach: Lege ♩ ta, ♫ ti-ti und ⏸ Pause in der richtigen Reihenfolge hin.'),
      el('p', {}, 'Tipp: Sprich beim Hören leise mit – „ta ti-ti ta Pause“. Das Silbensprechen macht den Rhythmus sichtbar.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: neueAufgabe }, '▶️ Ersten Rhythmus hören')))];
  }
  return [
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0;font-weight:700;text-align:center' }, 'Welcher Rhythmus war das? Vier Schläge:'),
      feldZeile(...Array.from({ length: SCHLAEGE_PRO_TAKT }, (unbenutzt, i) =>
        feld(0, i, feedback ? bausteinVon(aufgabe[i]).zeichen : '?', `Schlag ${i + 1}`))),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => spielePlan([{ takt: 0, stimmen: [{ muster: aufgabe, klang: 'klatschen' }] }]) }, '🔁 Nochmal anhören'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: stoppeWiedergabe }, '⏹️ Stopp')),
      tempoZeile()),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0;font-weight:700' }, `Deine Lösung (${eingabe.length}/${SCHLAEGE_PRO_TAKT}):`),
      el('p', { style: 'font-size:1.6rem;text-align:center;margin:0.2rem 0;letter-spacing:0.3rem' },
        eingabe.length ? eingabe.map((id) => bausteinVon(id).zeichen).join(' ') : '· · · ·'),
      el('p', { style: 'text-align:center;margin:0' }, eingabe.length ? eingabe.map((id) => bausteinVon(id).name).join(' – ') : 'Noch nichts gelegt.'),
      feedback ? null : el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Bausteine legen' },
        ...BAUSTEINE.map((b) => el('button', {
          class: 'k-knopf k-knopf--neutral',
          onclick: () => legeBaustein(b.id),
        }, `${b.zeichen} ${b.name}`))),
      feedback ? el('div', { class: `k-hinweis${feedback.gut ? ' k-hinweis--richtig' : ''}` },
        el('p', { style: 'margin:0' }, feedback.text)) : null,
      el('div', { class: 'k-antworten' },
        feedback ? null : el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { eingabe = []; render(); } }, '↩️ Nochmal legen'),
        feedback ? el('button', { class: 'k-knopf', onclick: neueAufgabe }, 'Nächster Rhythmus ➡️') : null)),
  ];
}

function legeBaustein(id) {
  if (feedback || eingabe.length >= SCHLAEGE_PRO_TAKT) return;
  eingabe = [...eingabe, id];
  sofortKlang('klatschen');
  if (eingabe.length === SCHLAEGE_PRO_TAKT) {
    const gut = musterRichtig(aufgabe, eingabe);
    const loesung = aufgabe.map((b) => bausteinVon(b).name).join(' – ');
    feedback = {
      gut,
      text: gut
        ? `🌟 Genau so war es: ${loesung}!`
        : `💭 Fast! Der Rhythmus war: ${loesung}. Hör ihn dir noch einmal an und klatsche mit.`,
    };
  }
  render();
}

// ---------- Modus 3: Orchester ----------
function orchesterKarten() {
  const aktive = daten.stimmen.filter((s) => gewaehlteStimmen.has(s.id));
  phrasenAnzeige = el('p', { style: 'text-align:center;font-weight:700;margin:0.3rem 0', 'aria-live': 'polite' }, 'Noch spielt niemand.');
  return [
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Drei Stimmen, ein Takt: Jede Stimme wiederholt ihr eigenes kleines Muster (ein Ostinato). Beim Einsetzen wartet jede Stimme, bis sie dran ist – genau wie in einem echten Orchester.'),
      feldZeile(...Array.from({ length: SCHLAEGE_PRO_TAKT }, (unbenutzt, i) => feld(0, i, `${i + 1}`, i === 0 ? 'betont' : 'Schlag'))),
      phrasenAnzeige,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: spieleEinsaetze }, '🎬 Nacheinander einsetzen'),
        el('button', {
          class: 'k-knopf k-knopf--neutral',
          disabled: aktive.length ? undefined : '',
          onclick: () => spielePlan([0, 1].map(() => ({ takt: 0, stimmen: aktive.map((s) => ({ muster: s.muster, klang: s.klang })) }))),
        }, '▶️ Ausgewählte zusammen spielen'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: stoppeWiedergabe }, '⏹️ Stopp'))),
    ...daten.stimmen.map((s) => el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, `${s.emoji} ${s.name} – setzt in Phrase ${s.einsatz} ein`),
      el('p', { style: 'font-size:1.5rem;margin:0.2rem 0;letter-spacing:0.4rem' }, s.muster.map((id) => bausteinVon(id).zeichen).join(' ')),
      el('p', { style: 'margin:0 0 0.4rem' }, s.muster.map((id) => bausteinVon(id).name).join(' – ')),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: `k-knopf k-knopf--klein ${gewaehlteStimmen.has(s.id) ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(gewaehlteStimmen.has(s.id)),
          onclick: () => {
            if (gewaehlteStimmen.has(s.id)) gewaehlteStimmen.delete(s.id); else gewaehlteStimmen.add(s.id);
            render();
          },
        }, gewaehlteStimmen.has(s.id) ? '✅ Spielt mit' : '➕ Dazunehmen'),
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein',
          onclick: () => spielePlan([{ takt: 0, stimmen: [{ muster: s.muster, klang: s.klang }] }]),
        }, '▶️ Nur diese Stimme')))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '🤸 Zu dritt ohne Gerät'),
      el('p', { style: 'margin:0.2rem 0' }, 'Am schönsten ist das Orchester mit echten Menschen: Eine Person zählt ein, dann kommt Stimme für Stimme dazu. Wer aussetzt, zählt leise weiter mit.'),
      mitmachZeile(),
      tempoZeile()),
  ];
}

function spieleEinsaetze() {
  spielePlan(Array.from({ length: PHRASEN }, (unbenutzt, i) => ({
    takt: 0,
    phrase: i + 1,
    stimmen: stimmenFuerPhrase(daten.stimmen, i + 1).map((s) => ({ muster: s.muster, klang: s.klang })),
  })));
}

// ---------- Start ----------
function render() {
  metronomFelder = new Map();
  phrasenAnzeige = null;
  if (modus === 'mitmachen') return zeige(...mitmachenKarten());
  if (modus === 'nachbau') return zeige(...nachbauKarten());
  return zeige(...orchesterKarten());
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
