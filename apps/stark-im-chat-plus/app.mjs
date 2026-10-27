// Stark im Chat 13+: Jugendversion des Bystander-Trainings (docs/09 Nr. 9).
// Realistische Gruppenchat-Optik (Sprechblasen, Weiterleitungen, Emojis) zu
// Hassrede, Blossstellung, Ausschluss, Fake-Accounts und Doxxing. Jede
// Aufloesung zeigt zusaetzlich den konkreten Melde-/Hilfeweg nach DSA.
// KEIN echter Chat: alle Verlaeufe sind geskriptete Szenarien (Politik!).
// Das Kind wird nicht bewertet: keine Punkte, kein Rekord, keine Ränge; jede Antwort
// bekommt eine Rückmeldung mit Erklärung.
// Politik: keine externen Anfragen, speichert NICHTS.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';

installiereNetzwerkWaechter();

// Alter Schlüssel aus früheren Versionen: einmal beim Start entfernen.
try { localStorage.removeItem('sicp.rekord'); } catch {}

const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

let szenarien = [];
let index = 0;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🛡️ Stark im Chat 13+'),
    el('p', { class: 'k-untertitel' }, 'Gruppendynamik durchschauen. Rückgrat zeigen. Wege kennen.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · kein echter Chat · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

// Gruppenchat-Optik: geskriptete Sprechblasen. Bewusst KEIN Eingabefeld -
// hier wird nicht gechattet, sondern eine Situation gelesen wie ein Beweisfoto.
function chatAnsicht(s) {
  return el('div', { style: 'background:#e7e3dc;border-radius:0.75rem;padding:0.75rem' },
    el('p', { style: 'margin:0 0 0.5rem;text-align:center;font-size:0.8rem;color:#4b5563;font-weight:600' }, s.gruppe),
    ...s.chat.map((n) =>
      el('div', { style: 'background:#fff;border-radius:0.6rem;padding:0.35rem 0.6rem;margin:0.3rem 0;max-width:85%;box-shadow:0 1px 1px rgba(0,0,0,0.1)' },
        el('p', { style: 'margin:0;font-size:0.75rem;font-weight:700;color:var(--k-blau-dunkel)' }, n.von),
        el('p', { style: 'margin:0;font-size:0.9rem' }, n.text))));
}

function startBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', {}, `Das weitergeleitete Video, das „Satire“-Meme, die Gruppe ohne Emma, die Adresse im Squad-Chat: ${daten.szenarien.length} Chat-Verläufe, wie sie wirklich passieren. Du bist nie das Opfer und nie der Täter – du bist die Person, auf die es ankommt: die dritte.`),
      el('p', { style: 'font-size:0.9rem' }, '🔞 Ab 13. Alle Chats sind ausgedacht und nachgestellt – ähnliche Situationen kennst du trotzdem.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Training starten'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Acht Chat-Verläufe, wie sie wirklich passieren. Du bist nie Opfer und nie Täter. Du bist die Person, auf die es ankommt: die dritte.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, '💛 Trifft es dich selbst? Das ist NIE deine Schuld. Hilfe, die sich auskennt: Nummer gegen Kummer 116 111 (kostenlos, anonym) · JUUUPORT.de (junge Scouts beraten online) · bei Bedrohungen: Polizei-Online-Wache.')),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: startBildschirm })))));
}

function starteRunde() {
  szenarien = mischen(daten.szenarien);
  index = 0;
  szenarioBildschirm();
}

function szenarioBildschirm() {
  const s = szenarien[index];
  const optionen = mischen(s.optionen);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Verlauf ${index + 1} von ${szenarien.length}`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': szenarien.length, 'aria-valuenow': index },
        el('div', { style: `width:${(index / szenarien.length) * 100}%` })),
      chatAnsicht(s),
      el('p', { style: 'font-weight:600' }, s.frage),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${s.chat.map((n) => `${n.von} schreibt: ${n.text}`).join('. ')}. ${s.frage} ${optionen.map((o) => o.text).join('. Oder: ')}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        ...optionen.map((o) =>
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => antworte(s, o) }, o.text)))));
}

function antworte(s, option) {
  const titel = option.wert === 2 ? 'Rückgrat gezeigt! 🛡️' : option.wert === 1 ? 'Verständlich – aber die Dynamik läuft weiter.' : 'Damit wirst du Teil der Dynamik …';
  const klasse = option.wert === 2 ? 'k-hinweis--richtig' : option.wert === 1 ? '' : 'k-hinweis--falsch';
  const beste = s.optionen.find((o) => o.wert === 2);
  zeige(
    el('section', { class: 'k-karte' },
      el('div', { class: `k-hinweis ${klasse}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, titel),
        el('p', {}, s.aufloesung),
        option.wert < 2 ? el('p', { style: 'margin-bottom:0' }, `Stärkster Zug: ${beste.text}`) : ''),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.5rem' },
        el('p', { style: 'margin:0;font-size:0.9rem' }, `⚖️ Dein Weg: ${s.dsaWeg}`)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${titel} ${s.aufloesung} Dein Weg: ${s.dsaWeg}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, index + 1 < szenarien.length ? 'Nächster Verlauf ➡️' : 'Zum Schluss 🏁'))));
}

function weiter() {
  index++;
  if (index < szenarien.length) szenarioBildschirm();
  else endBildschirm();
}

function endBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🛡️'),
      el('p', { class: 'k-untertitel', style: 'font-weight:700' }, 'Ende der Runde'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Ende der Runde. Dein Werkzeugkasten: Beweise sichern, melden, blockieren, Menschen einbeziehen. Und der stärkste Satz bleibt: Ich mach da nicht mit.') }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '📌 Dein Werkzeugkasten: Beweise sichern (Screenshot mit Datum) → Melden (die Plattform MUSS reagieren, DSA) → Blockieren → Menschen einbeziehen (Vertrauenslehrkraft, 116 111, JUUUPORT). Und der stärkste Satz bleibt: „Ich mach da nicht mit.“')));
}

startBildschirm();
