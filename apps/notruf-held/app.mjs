// Notruf-Held: simulierter Wähltastatur-Trainer für 112 und 110 (5-7).
// Das Kind erkennt die richtige Nummer, "wählt" sie auf einer Tastatur und
// übt, was man am Telefon sagt. KEIN echter Anruf, keine Datenerfassung.
// Praleska docs/10 (Top-30 Nr. 8). Politik docs/02: keine externen Anfragen.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { datenKarte } from '../../packages/kinder-ui/js/daten-karte.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { nurZiffern, pruefeAnruf, rueckmeldung, bewerteRunde } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const REKORD = 'notruf.rekord';
const RUNDE = 6;
const app = document.getElementById('app');
const daten = await fetch('daten/situationen.json').then((r) => r.json());

let runde = [];
let index = 0;
let eingabe = '';
const eingaben = {};

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '📞 Notruf-Held'),
    el('p', { class: 'k-untertitel' }, '112 und 110 üben – für den Notfall'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · kein echter Anruf · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function start() {
  const rekord = Number(localStorage.getItem(REKORD) ?? 0);
  const intro = 'Übe den Notruf. 112 ist für Feuerwehr und Rettung. 110 ist für die Polizei. Das ist nur zum Üben – es wird niemand echt angerufen.';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🚑🚒👮'),
      el('p', {}, el('strong', {}, '112'), ' – Feuerwehr und Rettung.'),
      el('p', {}, el('strong', {}, '110'), ' – Polizei.'),
      el('p', { style: 'font-size:0.9rem;color:#4b5563' }, 'Das ist nur zum Üben. Es wird niemand echt angerufen.'),
      rekord > 0 ? el('p', {}, `Dein Rekord: ${rekord} von ${RUNDE} 🏅`) : '',
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(intro) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Los geht’s'))),
    datenKarte({ schluessel: REKORD, was: 'dein Rekord', nachLoeschen: start }),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: start })))));
}

function starteRunde() {
  runde = mischen(daten.situationen).slice(0, Math.min(RUNDE, daten.situationen.length));
  index = 0;
  eingabe = '';
  for (const k of Object.keys(eingaben)) delete eingaben[k];
  frage();
}

function ziffer(z) {
  if (eingabe.length < 3) eingabe += z;
  aktualisiereAnzeige();
}

function loeschen() {
  eingabe = eingabe.slice(0, -1);
  aktualisiereAnzeige();
}

let anzeigeEl = null;
function aktualisiereAnzeige() {
  if (anzeigeEl) anzeigeEl.textContent = eingabe || '___';
}

function frage() {
  const s = runde[index];
  eingabe = '';
  const vorleseText = `${s.situation} Welche Nummer wählst du?`;
  anzeigeEl = el('div', { style: 'font-family:monospace;font-size:2rem;text-align:center;letter-spacing:0.3rem;padding:0.4rem;border:2px solid var(--k-rand);border-radius:0.5rem;min-height:2.6rem' }, '___');

  const tasten = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', ''].map((z) =>
    z === '' ? el('span', {}) : el('button', { class: 'k-knopf k-knopf--neutral', style: 'font-size:1.4rem', onclick: () => ziffer(z) }, z));

  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Notfall ${index + 1} von ${runde.length}`),
      el('p', { class: 'k-gross' }, s.emoji),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, s.situation),
      el('p', { style: 'text-align:center' }, 'Welche Nummer wählst du?'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(vorleseText) }, '🔊 Vorlesen'),
      anzeigeEl,
      el('div', { style: 'display:grid;grid-template-columns:repeat(3,1fr);gap:0.4rem;margin:0.5rem 0' }, ...tasten),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: loeschen }, '⌫ Löschen'),
        el('button', { class: 'k-knopf', onclick: () => anrufen(s) }, '📞 Anrufen'))));
}

function anrufen(s) {
  const zahl = nurZiffern(eingabe);
  if (zahl.length < 3) { aktualisiereAnzeige(); return; }
  eingaben[s.id] = zahl;
  const p = pruefeAnruf(zahl, s.nummer);
  const text = rueckmeldung(zahl, s.nummer, daten.nummern);
  const letzte = index + 1 >= runde.length;
  const schritte = el('ol', { style: 'text-align:start;margin:0.3rem 0 0;padding-inline-start:1.3rem' },
    ...daten.notrufSchritte.map((z) => el('li', { style: 'margin:0.15rem 0' }, z)));
  const vorleseText = `${text} Am Telefon sagst du: ${daten.notrufSchritte.join(' ')}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, p.ok ? '🌟' : '💭'),
      el('div', { class: `k-hinweis${p.ok ? ' k-hinweis--richtig' : ''}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, p.ok ? 'Richtig gewählt!' : 'Schau nochmal:'),
        el('p', {}, text),
        el('p', { style: 'margin-bottom:0' }, `💡 ${s.warum}`)),
      el('div', { class: 'k-karte', style: 'background:#eff6ff' },
        el('p', { style: 'font-weight:600;margin:0 0 0.2rem' }, '☎️ Das sagst du am Telefon:'),
        schritte),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(vorleseText) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, letzte ? 'Fertig 🏁' : 'Weiter ➡️'))));
}

function weiter() {
  index++;
  if (index < runde.length) frage();
  else ende();
}

function ende() {
  const { richtig, gesamt } = bewerteRunde(runde, eingaben);
  const rekordAlt = Number(localStorage.getItem(REKORD) ?? 0);
  if (richtig > rekordAlt) localStorage.setItem(REKORD, String(richtig));
  const schluss = `Du hast ${richtig} von ${gesamt} Notrufen richtig gewählt. Übe den Notruf auch mit einem Erwachsenen: deinen Namen und deine Adresse laut sagen.`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, richtig === gesamt ? '🏅' : '💪'),
      el('p', { style: 'font-weight:700;text-align:center;font-size:1.2em' }, `${richtig} von ${gesamt} richtig gewählt`),
      el('p', { style: 'text-align:center' }, '👉 Übe mit einem Erwachsenen: Name und Adresse laut sagen.'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(schluss) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, '🏠 Zum Start'))));
}

start();
