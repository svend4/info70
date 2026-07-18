// Seiten-Scanner: Kinder-Checkliste fuer beliebige Webseiten (8-12).
// Kind geht die Fragen neben einer offenen Seite durch (ja/nein) und bekommt
// am Ende eine Ampel + Tipps zu den Warnzeichen. Vereinfachte Kinder-Version
// des kriterien-check (docs/09 Nr. 135). Reine Logik in logik.mjs.
// Politik docs/02: keine externen Anfragen; Fortschritt nur lokal.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { hilfeInsel } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { FRAGEN, MAX, sicherePunkte, warnungen, ampel } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'ss.scan';
const app = document.getElementById('app');

const lade = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}');
const speichere = (a) => localStorage.setItem(SCHLUESSEL, JSON.stringify(a));

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🔦 Seiten-Scanner'),
    el('p', { class: 'k-untertitel' }, 'Ist diese Seite sicher für dich? Check sie Schritt für Schritt.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function render() {
  const antworten = lade();
  const beantwortet = FRAGEN.filter((f) => antworten[f.code]).length;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Öffne die Seite, die du prüfen willst, in einem anderen Fenster. Beantworte hier jede Frage mit Ja oder Nein – am Ende bekommst du eine Ampel.'),
      el('p', { style: 'margin:0;font-size:0.9rem;color:#4b5563' }, `${beantwortet} von ${MAX} beantwortet`)),
    ...FRAGEN.map((f) => frageKarte(f, antworten[f.code])),
    beantwortet === MAX ? ergebnisKarte(antworten) : el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0;color:#4b5563' }, 'Beantworte alle Fragen, dann siehst du die Ampel.')),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => zeige(hilfeInsel({ zurueck: render })) }, '🆘 Ich brauche Hilfe'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); render(); } }, '🧹 Neue Seite prüfen'))));
}

function frageKarte(f, antwort) {
  const setze = (wert) => { const a = lade(); a[f.code] = wert; speichere(a); render(); };
  return el('section', { class: 'k-karte' },
    el('p', { style: 'font-weight:600;margin-top:0' }, f.frage),
    el('div', { class: 'k-antworten', style: 'flex-direction:row' },
      el('button', { class: `k-knopf k-knopf--klein ${antwort === 'ja' ? '' : 'k-knopf--neutral'}`, 'aria-pressed': String(antwort === 'ja'), onclick: () => setze('ja') }, '👍 Ja'),
      el('button', { class: `k-knopf k-knopf--klein ${antwort === 'nein' ? '' : 'k-knopf--neutral'}`, 'aria-pressed': String(antwort === 'nein'), onclick: () => setze('nein') }, '👎 Nein'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(f.frage) }, '🔊')));
}

function ergebnisKarte(antworten) {
  const punkte = sicherePunkte(antworten);
  const a = ampel(punkte);
  const warn = warnungen(antworten);
  return el('section', { class: `k-karte ${a.stufe === 'gruen' ? 'k-hinweis--richtig' : a.stufe === 'rot' ? 'k-hinweis--falsch' : ''}` },
    el('p', { style: 'font-size:2.5rem;text-align:center;margin:0' }, a.emoji),
    el('p', { style: 'font-weight:700;text-align:center;margin:0.25rem 0' }, `${punkte} von ${MAX} sicher`),
    el('p', { style: 'margin:0.25rem 0' }, a.text),
    warn.length ? el('div', {},
      el('p', { style: 'font-weight:600;margin:0.5rem 0 0.25rem' }, '⚠️ Schau dir das an:'),
      ...warn.map((f) => el('p', { style: 'margin:0.25rem 0;font-size:0.9rem' }, `• ${f.tipp}`))) : el('p', { style: 'margin:0.25rem 0' }, '👍 Alle Checks sicher – gut geprüft!'),
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.5rem', onclick: () => vorlesen(`${a.text} ${warn.map((f) => f.tipp).join(' ')}`) }, '🔊 Vorlesen'));
}

render();
