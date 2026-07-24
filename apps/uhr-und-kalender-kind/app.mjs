// Uhr- und Kalender-Kind (5-7): erlebbare Analoguhr (volle, halbe,
// Viertelstunde) und Kalender-Wissen (Woche, Tagesphasen, Jahreszeiten).
// Die Uhr wird rein mit HTML/CSS gezeichnet (keine Bilder, keine Requests).
// Praleska docs/10 (Top-30 Nr. 24). Politik docs/02: nur Rekord lokal.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { pruefeFragen, uhrText, uhrOptionen, zeigerWinkel, rangFuer } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const REKORD = 'uhr.rekord';
const RUNDE = 8;
const app = document.getElementById('app');
const daten = await fetch('daten/fragen.json').then((r) => r.json());

let fragen = [];
let index = 0;
let punkte = 0;
let beantwortet = false;

function uhrBild(stunde, minute) {
  const w = zeigerWinkel(stunde, minute);
  const ziffer = (n, top, left) => el('span', {
    'aria-hidden': 'true',
    style: `position:absolute;top:${top};left:${left};transform:translate(-50%,-50%);font-weight:700;font-size:1.1rem;color:#1f2937`,
  }, String(n));
  const zeiger = (hoehe, breite, farbe, grad) => el('div', {
    'aria-hidden': 'true',
    style: `position:absolute;bottom:50%;left:50%;width:${breite}px;height:${hoehe}px;margin-left:-${breite / 2}px;background:${farbe};border-radius:${breite}px;transform-origin:50% 100%;transform:rotate(${grad}deg)`,
  });
  return el('div', {
    role: 'img', 'aria-label': `Eine Uhr. Der kleine Zeiger und der große Zeiger zeigen: ${uhrText(stunde, minute)}`,
    style: 'position:relative;width:180px;height:180px;margin:0.5rem auto;border:6px solid #1e40af;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,0.15)',
  },
    ziffer(12, '13%', '50%'), ziffer(3, '50%', '87%'), ziffer(6, '87%', '50%'), ziffer(9, '50%', '13%'),
    zeiger(46, 9, '#1f2937', w.stunde),
    zeiger(66, 5, '#dc2626', w.minute),
    el('div', { 'aria-hidden': 'true', style: 'position:absolute;left:50%;top:50%;width:14px;height:14px;background:#1f2937;border-radius:50%;transform:translate(-50%,-50%)' }));
}

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '⏰ Uhr- und Kalender-Kind'),
    el('p', { class: 'k-untertitel' }, 'Uhrzeit lesen und den Kalender verstehen'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
  app.querySelector('button')?.focus();
}

function start() {
  const rekord = Number(localStorage.getItem(REKORD) ?? 0);
  zeige(
    el('section', { class: 'k-karte' },
      uhrBild(3, 0),
      el('p', {}, `Der kleine Zeiger zeigt die Stunde, der große die Minuten. In ${RUNDE} Rätseln liest du die Uhr und knackst Kalender-Fragen.`),
      rekord > 0 ? el('p', {}, `Dein Rekord: ${rekord} von ${RUNDE} ⏰`) : null,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => { fragen = mischen(daten.fragen).slice(0, RUNDE); index = 0; punkte = 0; frage(); } }, '▶️ Los geht’s'))));
}

function frage() {
  beantwortet = false;
  const q = fragen[index];
  if (q.typ === 'uhr') {
    const optionen = mischen(uhrOptionen(q).map((text, i) => ({ text, richtig: i === 0 })));
    zeige(
      el('section', { class: 'k-karte' },
        el('p', { class: 'k-untertitel' }, `Rätsel ${index + 1} von ${fragen.length}`),
        uhrBild(q.zeit.stunde, q.zeit.minute),
        el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, 'Wie spät ist es?'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Wie spät ist es? Die Möglichkeiten sind: ${optionen.map((o) => o.text).join('. Oder: ')}`) }, '🔊 Vorlesen'),
        el('div', { class: 'k-antworten' },
          ...optionen.map((o) => el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => antworte(q, o.richtig) }, `🕐 ${o.text}`)))));
  } else {
    zeige(
      el('section', { class: 'k-karte' },
        el('p', { class: 'k-untertitel' }, `Rätsel ${index + 1} von ${fragen.length}`),
        el('p', { class: 'k-gross' }, '📅'),
        el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, q.frage),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${q.frage} ${q.antworten.join('. Oder: ')}`) }, '🔊 Vorlesen'),
        el('div', { class: 'k-antworten' },
          ...q.antworten.map((a, i) => el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => antworte(q, i === q.korrekt) }, a)))));
  }
}

function antworte(q, richtig) {
  if (beantwortet) return;
  beantwortet = true;
  if (richtig) punkte++;
  const letzte = index + 1 >= fragen.length;
  const richtigText = q.typ === 'uhr' ? `Es ist ${uhrText(q.zeit.stunde, q.zeit.minute)}.` : `Richtig ist: ${q.antworten[q.korrekt]}.`;
  zeige(
    el('section', { class: 'k-karte' },
      q.typ === 'uhr' ? uhrBild(q.zeit.stunde, q.zeit.minute) : el('p', { class: 'k-gross' }, richtig ? '🌟' : '💭'),
      el('div', { class: `k-hinweis${richtig ? ' k-hinweis--richtig' : ''}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, richtig ? 'Richtig!' : `Fast! ${richtigText}`),
        el('p', { style: 'margin-bottom:0' }, q.erklaerung)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${richtigText} ${q.erklaerung}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => { index++; if (index < fragen.length) frage(); else ende(); } }, letzte ? 'Fertig 🏁' : 'Weiter ➡️'))));
}

function ende() {
  const rekordAlt = Number(localStorage.getItem(REKORD) ?? 0);
  if (punkte > rekordAlt) localStorage.setItem(REKORD, String(punkte));
  const rang = rangFuer(daten.raenge, punkte);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, rang.emoji),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, rang.titel),
      el('p', { style: 'text-align:center' }, `${punkte} von ${fragen.length} richtig`),
      el('p', { style: 'text-align:center;font-size:0.9rem;color:#4b5563' }, '👉 Schau heute mal auf eine echte Uhr: Wie spät ist es jetzt?'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => { fragen = mischen(daten.fragen).slice(0, RUNDE); index = 0; punkte = 0; frage(); } }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, '🏠 Start'))));
}

const fehler = pruefeFragen(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  start();
}
