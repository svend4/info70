// Spiel-Recht-Balance: der Tag als Balance dreier Rechte (8-12).
// Statt Bildschirmzeit-Ampel schaetzt das Kind selbst ein, wie viel es heute
// von Spiel/Medien, Ruhe und Draussen/Freunde hatte - und plant selbst, wo ein
// Recht zu kurz kam. Erholung ist ein eigenes Recht (Art. 31 UN-KRK). Nutzt den
// Hilfe-Insel-Baustein aus kinder-ui. Politik docs/02: keine externen Anfragen.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { hilfeInsel } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { RECHTE, STUFEN, auswertung, vorschlag, LEKTIONEN } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'srb.heute';
const app = document.getElementById('app');

const lade = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}');
const speichere = (w) => localStorage.setItem(SCHLUESSEL, JSON.stringify(w));

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '⚖️ Spiel-Recht-Balance'),
    el('p', { class: 'k-untertitel' }, 'Dein Tag hat drei Rechte – wie war heute die Mischung?'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function render() {
  const werte = lade();
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Tippe für jedes Recht an, wie viel du heute davon hattest. Es gibt kein „richtig“ – es geht um deine Mischung.'),
      ...RECHTE.map((r) => rechtWahl(r, werte[r.code]))),
    Object.keys(werte).length === RECHTE.length ? ergebnis(werte) : el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0;color:#4b5563' }, 'Schätze alle drei ein, dann siehst du deine Balance.')),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: lektionBildschirm }, '🎓 Warum drei Rechte?'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => zeige(hilfeInsel({ zurueck: render })) }, '🆘 Ich brauche Hilfe'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); render(); } }, '🧹 Neuer Tag'))));
}

function rechtWahl(r, wert) {
  return el('div', { style: 'padding:0.5rem 0;border-bottom:1px solid var(--k-rand)' },
    el('p', { style: 'font-weight:600;margin:0 0 0.35rem' }, `${r.emoji} ${r.name} `, el('small', { style: 'color:#4b5563;font-weight:400' }, `· ${r.artikel}`)),
    el('div', { class: 'k-antworten', style: 'flex-direction:row;flex-wrap:wrap' },
      ...STUFEN.map((s) =>
        el('button', {
          class: `k-knopf k-knopf--klein ${wert === s.wert ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(wert === s.wert),
          onclick: () => { const w = lade(); w[r.code] = s.wert; speichere(w); render(); },
        }, s.label))));
}

function ergebnis(werte) {
  const a = auswertung(werte);
  const maxWert = 3;
  return el('section', { class: `k-karte ${a.imGleichgewicht ? 'k-hinweis--richtig' : ''}` },
    el('p', { style: 'font-weight:700;margin-top:0' }, '🔎 Deine Balance heute:'),
    ...RECHTE.map((r) => {
      const anteil = Math.round(((werte[r.code] ?? 0) / maxWert) * 100);
      return el('div', { style: 'display:flex;align-items:center;gap:0.5rem;margin:0.3rem 0' },
        el('span', { style: 'width:2rem', 'aria-hidden': 'true' }, r.emoji),
        el('div', { class: 'k-fortschritt', style: 'flex:1' }, el('div', { style: `width:${anteil}%;background:${r.farbe}` })),
        el('span', { style: 'width:5rem;font-size:0.85rem' }, STUFEN[werte[r.code] ?? 0].label));
    }),
    el('p', { style: 'margin:0.75rem 0 0' }, a.satz),
    ...a.zuKurz.map((code) => el('p', { style: 'margin:0.25rem 0;font-size:0.9rem;color:#374151' }, `💡 ${vorschlag(code)}`)),
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.5rem', onclick: () => vorlesen(`${a.satz} ${a.zuKurz.map(vorschlag).join(' ')}`) }, '🔊 Vorlesen'));
}

function lektionBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:700;margin-top:0' }, '🎓 Warum drei Rechte statt Bildschirmzeit?'),
      ...LEKTIONEN.map((l) => el('p', { style: 'margin:0.5rem 0' }, l)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(LEKTIONEN.join(' ')) }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: render }, '↩️ Zurück'))));
}

render();
