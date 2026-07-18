// Foto-Ampel (Familie, Eltern+Kind 6-12, docs/09 Nr. 220). Vor dem Teilen
// eines Fotos geht die Familie eine Ampel-Entscheidungsstrecke durch und
// erhält Grün/Gelb/Rot mit kindgerechter Begründung. Dünne DOM-Schicht über
// logik.mjs. Politik docs/02: keine externen Anfragen, werbefrei, Vorlesen.
// Es werden KEINE Fotos hochgeladen oder gespeichert – nur Ja/Nein-Fragen.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { FRAGEN, relevanteFragen, fertig, bewerte } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const AMPEL = {
  gruen: { emoji: '🟢', farbe: '#16a34a', wort: 'Grün' },
  gelb: { emoji: '🟡', farbe: '#ca8a04', wort: 'Gelb' },
  rot: { emoji: '🔴', farbe: '#dc2626', wort: 'Rot' },
};

let antworten = {}; // nur im Speicher der Seite – nichts wird gespeichert

function naechsteOffene() {
  return relevanteFragen(antworten).find((f) => typeof antworten[f.id] !== 'boolean');
}

function render() {
  if (!fertig(antworten)) {
    const frage = naechsteOffene();
    const nummer = relevanteFragen(antworten).indexOf(frage) + 1;
    const gesamt = relevanteFragen(antworten).length;
    app.replaceChildren(
      el('h1', { class: 'k-titel' }, '📸 Foto-Ampel'),
      el('p', { class: 'k-untertitel' }, 'Bevor ein Foto geteilt wird: geht gemeinsam die Ampel durch'),
      el('section', { class: 'k-karte' },
        el('p', { style: 'margin-top:0;color:#4b5563' }, `Frage ${nummer} von ${gesamt}`),
        el('p', { style: 'font-size:1.15rem;font-weight:600' }, frage.text),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: () => { antworten[frage.id] = true; render(); } }, '👍 Ja'),
          el('button', { class: 'k-knopf', onclick: () => { antworten[frage.id] = false; render(); } }, '👎 Nein'),
          el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(frage.text) }, '🔊 Vorlesen')),
        nummer > 1 ? el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.5rem', onclick: () => { antworten = {}; render(); } }, '↩️ Von vorne') : ''),
      el('footer', { class: 'k-fuss' },
        el('a', { href: 'eltern.html' }, '👪 Für Eltern'),
        el('span', {}, ' · es werden keine Fotos hochgeladen · '),
        el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
    return;
  }

  const { ampel, gruende, tipp } = bewerte(antworten);
  const a = AMPEL[ampel];
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '📸 Foto-Ampel'),
    el('section', { class: 'k-karte', style: `border:3px solid ${a.farbe}` },
      el('p', { style: `font-size:3rem;text-align:center;margin:0` }, a.emoji),
      el('h2', { style: `text-align:center;color:${a.farbe};margin:0.2rem 0` }, `${a.wort}!`),
      el('ul', { style: 'margin:0.5rem 0' }, ...gruende.map((g) => el('li', { style: 'margin:0.3rem 0' }, g))),
      el('p', { style: 'font-weight:600;margin-bottom:0' }, tipp),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.5rem', onclick: () => vorlesen(`${a.wort}. ${gruende.join(' ')} ${tipp}`) }, '🔊 Vorlesen')),
    el('section', { class: 'k-karte' },
      el('button', { class: 'k-knopf', onclick: () => { antworten = {}; render(); } }, '🔁 Nächstes Foto prüfen'),
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin-bottom:0' }, 'Merke: Einmal im Netz, sind Kopien möglich. Und du darfst auch bei Fotos, die andere von dir posten, „Rot“ sagen – das ist dein Recht am eigenen Bild.')),
    el('footer', { class: 'k-fuss' },
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'),
      el('span', {}, ' · werbefrei · läuft offline · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
