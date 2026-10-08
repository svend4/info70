// FOMO-Kompass: Szenario-Trainer gegen die Angst, etwas zu verpassen (8-12).
// FOMO = "Fear of missing out". Jedes Szenario zeigt eine typische Sog-/
// Verpass-Mechanik (Streak, Autoplay, Countdown, Lesebestaetigung, Likes)
// und trainiert die selbstbestimmte Reaktion: Grenze setzen statt reagieren.
// 2/1/0-Muster wie rechte-kompass/stark-im-chat (docs/05).
// Politik: keine externen Anfragen, nur Rekord in localStorage.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { loescheDaten } from '../../packages/kinder-ui/js/daten-karte.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';

installiereNetzwerkWaechter();

const REKORD_SCHLUESSEL = 'fomo.rekord';
const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

let szenarien = [];
let index = 0;
let punkte = 0;

const maxPunkte = () => szenarien.length * 2;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧭 FOMO-Kompass'),
    el('p', { class: 'k-untertitel' }, 'Die Angst, etwas zu verpassen – durchschauen und ruhig bleiben.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function startBildschirm() {
  const rekord = Number(localStorage.getItem(REKORD_SCHLUESSEL) ?? 0);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', {}, `„Jetzt oder nie!“, „Deine Streak reißt gleich!“, „Alle sind dabei!“ – in ${daten.szenarien.length} Situationen entscheidest du, wie du reagierst. FOMO heißt: die Angst, etwas zu verpassen. Apps benutzen sie mit Absicht. Du kannst sie durchschauen.`),
      rekord > 0 ? el('p', {}, `Dein Rekord: ${rekord} von ${daten.szenarien.length * 2} 🧭`) : '',
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Los geht’s'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('FOMO heißt: die Angst, etwas zu verpassen. Apps benutzen sie mit Absicht. Du kannst sie durchschauen.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, '💛 Wenn dich das Handy oft unruhig oder traurig macht: Das liegt nicht an dir – das ist eingebaut. Reden hilft: mit Eltern, Freund*innen – oder kostenlos und anonym bei der Nummer gegen Kummer 116 111.'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { loescheDaten(REKORD_SCHLUESSEL); startBildschirm(); } }, 'Meine Daten löschen')),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: startBildschirm })))));
}

function starteRunde() {
  szenarien = mischen(daten.szenarien);
  index = 0;
  punkte = 0;
  szenarioBildschirm();
}

function szenarioBildschirm() {
  const s = szenarien[index];
  const optionen = mischen(s.optionen);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Situation ${index + 1} von ${szenarien.length}`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': szenarien.length, 'aria-valuenow': index },
        el('div', { style: `width:${(index / szenarien.length) * 100}%` })),
      el('p', { style: 'font-weight:600' }, s.situation),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${s.situation} Was machst du? ${optionen.map((o) => o.text).join('. Oder: ')}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        ...optionen.map((o) =>
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => antworte(s, o) }, o.text)))));
}

function antworte(s, option) {
  punkte += option.wert;
  const titel = option.wert === 2 ? 'Ruhig und stark! 🧭✨' : option.wert === 1 ? 'Okay – aber der Sog hat dich noch.' : 'Genau das will die App …';
  const klasse = option.wert === 2 ? 'k-hinweis--richtig' : option.wert === 1 ? '' : 'k-hinweis--falsch';
  const beste = s.optionen.find((o) => o.wert === 2);
  zeige(
    el('section', { class: 'k-karte' },
      el('div', { class: `k-hinweis ${klasse}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, titel),
        el('p', { style: 'margin:0' }, `🔎 Der Trick: ${s.mechanik}`),
        option.wert < 2 ? el('p', { style: 'margin:0.5rem 0 0' }, `Stärkster Zug: ${beste.text}`) : ''),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.5rem' },
        el('p', { style: 'margin:0' }, `💡 ${s.tipp}`)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${titel} Der Trick: ${s.mechanik} ${s.tipp}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, index + 1 < szenarien.length ? 'Nächste Situation ➡️' : 'Zum Ergebnis 🏁'))));
}

function weiter() {
  index++;
  if (index < szenarien.length) szenarioBildschirm();
  else endBildschirm();
}

function endBildschirm() {
  const rekord = Math.max(punkte, Number(localStorage.getItem(REKORD_SCHLUESSEL) ?? 0));
  localStorage.setItem(REKORD_SCHLUESSEL, String(rekord));
  const rang = [...daten.raenge].reverse().find((r) => punkte >= r.ab) ?? daten.raenge[0];
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, rang.emoji),
      el('p', { class: 'k-untertitel', style: 'font-weight:700' }, rang.titel),
      el('p', { style: 'text-align:center' }, `${punkte} von ${maxPunkte()} Kompass-Punkten · Rekord: ${rekord}`),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Du hast ${punkte} von ${maxPunkte()} Kompass-Punkten. Dein Rang: ${rang.titel}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '📌 Deine drei Anker gegen den Sog: 1) Fast nichts ist „jetzt oder nie“. 2) Streaks, Likes und Countdowns sind Zahlen, kein Zeugnis über dich. 3) Handy außer Reichweite + Töne aus = du bestimmst, wann.')));
}

startBildschirm();
