// Rechte-Kompass: Szenario-Trainer "Rechte aussprechen" (8-12 Jahre).
// Kern-Idee (docs/09 Nr. 14): Kinder KENNEN Rechte oft - aber koennen sie
// nicht EINFORDERN. Jede Aufloesung nennt den KRK-Artikel und schenkt einen
// "Mut-Satz": die hoefliche Formulierung, mit der man das Recht ausspricht.
// 2/1/0-Muster wie stark-im-chat/daten-schatz (docs/05, Methode 0).
// Politik: keine externen Anfragen, nur Rekord in localStorage.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const REKORD_SCHLUESSEL = 'rk.rekord';
const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

let szenarien = [];
let index = 0;
let punkte = 0;
let mutSaetze = [];

const maxPunkte = () => szenarien.length * 2;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧭 Rechte-Kompass'),
    el('p', { class: 'k-untertitel' }, 'Deine Rechte kennen ist gut. Sie aussprechen ist stark.'),
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
      el('p', {}, `Das peinliche Foto, der volle Terminplan, die Abstimmung mit Handzeichen: In ${daten.szenarien.length} Situationen entscheidest du, wie du dein Recht vertrittst. Für jede starke Antwort sammelst du einen Mut-Satz zum Mitnehmen.`),
      rekord > 0 ? el('p', {}, `Dein Rekord: ${rekord} von ${daten.szenarien.length * 2} 🧭`) : '',
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Los geht’s'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('In zwölf Situationen entscheidest du, wie du dein Recht vertrittst. Für jede starke Antwort sammelst du einen Mut-Satz zum Mitnehmen.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, '📜 Deine Rechte stehen in der UN-Kinderrechtskonvention – sie gilt für ALLE Kinder. Mehr entdecken? Spiel den ', el('a', { href: '../kinderrechte-entdecker/' }, '🕊️ Kinderrechte-Entdecker'), '. Wird ein Recht bei dir ernsthaft verletzt: Nummer gegen Kummer 116 111 (kostenlos, anonym).'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.clear(); startBildschirm(); } }, 'Meine Daten löschen')));
}

function starteRunde() {
  szenarien = mischen(daten.szenarien);
  index = 0;
  punkte = 0;
  mutSaetze = [];
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
  if (option.wert === 2) mutSaetze.push(s.satz);
  const titel = option.wert === 2 ? 'Klar gesprochen! 🧭✨' : option.wert === 1 ? 'Okay – aber dein Recht bleibt ungesagt.' : 'So verliert dein Recht …';
  const klasse = option.wert === 2 ? 'k-hinweis--richtig' : option.wert === 1 ? '' : 'k-hinweis--falsch';
  zeige(
    el('section', { class: 'k-karte' },
      el('div', { class: `k-hinweis ${klasse}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, titel),
        el('p', {}, s.erklaerung)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.5rem' },
        el('p', { style: 'margin:0 0 0.25rem;font-size:0.85rem' }, `📜 Dein Recht: Artikel ${s.artikel} KRK – ${s.artikelName}`),
        el('p', { style: 'margin:0;font-weight:700' }, `💬 Mut-Satz: „${s.satz}“`)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${titel} ${s.erklaerung} Dein Mut-Satz: ${s.satz}`) }, '🔊 Vorlesen'),
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
    mutSaetze.length > 0
      ? el('section', { class: 'k-karte' },
          el('p', { style: 'font-weight:700;margin-top:0' }, `💬 Deine gesammelten Mut-Sätze (${mutSaetze.length}):`),
          ...mutSaetze.map((satz) => el('p', { style: 'margin:0.4rem 0' }, `„${satz}“`)),
          el('p', { style: 'margin-bottom:0;font-size:0.9rem' }, 'Sprich sie einmal laut – dann sind sie da, wenn du sie brauchst.'))
      : el('section', { class: 'k-karte' },
          el('p', { style: 'margin:0' }, '💬 Diesmal kein Mut-Satz gesammelt. Probier es noch einmal – die stärkste Antwort spricht das Recht immer AUS.')));
}

startBildschirm();
