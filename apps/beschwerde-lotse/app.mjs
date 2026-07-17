// Beschwerde-Lotse: "Was ist passiert -> wohin kannst du dich wenden" (8-12).
// Uebersetzt Beschwerderechte (DSA-Meldewege, Recht am eigenen Bild, DSGVO,
// Beschwerdestellen, Nummer gegen Kummer) in einen kindgerechten Wegweiser
// mit 2-3 Fragen und einem konkreten Schritte-Plan.
// Politik docs/02: keine externen Anfragen, speichert NICHTS.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/baum.json').then((r) => r.json());

let pfad = [];

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧭 Beschwerde-Lotse'),
    el('p', { class: 'k-untertitel' }, 'Etwas ist passiert? Ich zeig dir deinen Weg.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function notfallLeiste() {
  return el('div', { class: 'k-hinweis', style: 'margin-top:0.75rem' },
    el('p', { style: 'margin:0;font-size:0.9rem' }, '🚨 Ist gerade etwas RICHTIG Schlimmes los? Hol sofort eine erwachsene Person dazu. Zum Reden: Nummer gegen Kummer 116 111 (kostenlos, anonym).'));
}

function knotenBildschirm(id) {
  const k = daten.knoten[id];
  zeige(
    el('section', { class: 'k-karte' },
      pfad.length > 0
        ? el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: zurueck }, '⬅️ Zurück')
        : '',
      el('p', { style: `font-weight:700;font-size:1.15rem;margin-top:${pfad.length > 0 ? '0.75rem' : '0'}` }, k.frage),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${k.frage} ${k.optionen.map((o) => o.text).join('. Oder: ')}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        ...k.optionen.map((o) =>
          el('button', {
            class: 'k-knopf',
            onclick: () => {
              pfad.push(id);
              if (daten.blaetter[o.ziel]) blattBildschirm(o.ziel);
              else knotenBildschirm(o.ziel);
            },
          }, o.text))),
      notfallLeiste()));
}

function blattBildschirm(id) {
  const b = daten.blaetter[id];
  zeige(
    el('section', { class: 'k-karte' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: zurueck }, '⬅️ Zurück'),
      el('p', { style: 'font-weight:700;font-size:1.15rem;margin-top:0.75rem' }, `🧭 ${b.titel}`),
      ...b.schritte.map((s, i) =>
        el('div', { class: 'k-hinweis k-hinweis--richtig', style: 'margin:0.5rem 0' },
          el('p', { style: 'margin:0' }, `${i + 1}. ${s}`))),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${b.titel}. ${b.schritte.join(' Dann: ')}`) }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: () => { pfad = []; knotenBildschirm(daten.start); } }, '🏠 Von vorn (anderes Thema)'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '💡 Merksatz: Melden ist kein Petzen – Melden holt Hilfe. Und du bekommst niemals Ärger dafür, dass du etwas erzählst.')));
}

function zurueck() {
  const vorher = pfad.pop() ?? daten.start;
  knotenBildschirm(vorher);
}

knotenBildschirm(daten.start);
