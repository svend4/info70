// Wahlkabinen-Modus „Geheime Wahl“ (Schule/Beteiligung 8-12, docs/09 Nr. 205).
// Ein Gerät wird herumgereicht: Jede Stimme wird sofort versiegelt (nur ein
// Zähler, keine Zuordnung zur Person), das Ergebnis erscheint erst nach der
// letzten Stimme. Kinder erleben die Wahlgrundsätze am eigenen Votum.
// Politik docs/02: keine externen Anfragen; nur die laufende Wahl bleibt lokal.
import { el, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { hilfeInsel } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { neueWahl, stimmeAb, fertig, offen, ergebnis, ergebnisZeile } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'wk.wahl';
const app = document.getElementById('app');

const lade = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? 'null');
const speichere = (w) => localStorage.setItem(SCHLUESSEL, JSON.stringify(w));
const loesche = () => localStorage.removeItem(SCHLUESSEL);

function startBildschirm() {
  const frageFeld = el('input', { style: 'width:100%;padding:0.6rem;border:2px solid var(--k-rand);border-radius:0.5rem', placeholder: 'z. B. Wohin geht der Klassenausflug?', maxlength: 100, 'aria-label': 'Frage' });
  const optFeld = el('textarea', { style: 'width:100%;min-height:5rem;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem', placeholder: 'Zoo\nMuseum\nWald', 'aria-label': 'Antwortmöglichkeiten, eine pro Zeile' });
  const anzahlFeld = el('input', { type: 'number', min: 1, max: 40, value: 20, style: 'width:6rem;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem', 'aria-label': 'Anzahl Wähler' });

  const laufend = lade();
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🗳️ Geheime Wahl'),
    el('p', { class: 'k-untertitel' }, 'Ein Gerät, viele Stimmen – jede geheim. Das Ergebnis kommt erst am Ende.'),
    laufend ? el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `Es läuft schon eine Wahl: „${laufend.frage}“ (${laufend.abgegeben}/${laufend.erwartet} Stimmen).`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => (fertig(laufend) ? ergebnisBildschirm() : wahlgang()) }, fertig(laufend) ? '📊 Ergebnis ansehen' : '▶️ Weiter wählen'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { loesche(); startBildschirm(); } }, '🧹 Wahl löschen'))) : '',
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Neue Wahl vorbereiten'),
      el('label', { style: 'font-weight:600' }, 'Worüber wird abgestimmt?'), frageFeld,
      el('label', { style: 'font-weight:600;display:block;margin-top:0.5rem' }, 'Antwortmöglichkeiten (eine pro Zeile)'), optFeld,
      el('label', { style: 'font-weight:600;display:block;margin-top:0.5rem' }, 'Wie viele Kinder wählen?'), anzahlFeld,
      el('button', { class: 'k-knopf', style: 'margin-top:0.6rem', onclick: () => {
        const frage = frageFeld.value.trim();
        const optionen = optFeld.value.split('\n').map((s) => s.trim()).filter(Boolean);
        if (!frage || optionen.length < 2) { alert('Bitte eine Frage und mindestens zwei Antworten eingeben.'); return; }
        const w = neueWahl(frage, optionen, Number(anzahlFeld.value));
        speichere(w); wahlgang();
      } }, '🗳️ Wahl starten')),
    hilfeInsel(),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'für die Schule · werbefrei · läuft offline · keine Zuordnung Stimme→Person · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

function wahlgang() {
  const w = lade();
  if (!w) return startBildschirm();
  if (fertig(w)) return ergebnisBildschirm();
  const nummer = w.abgegeben + 1;
  // Reihenfolge der Optionen je Wähler mischen, damit die Position nicht verrät
  const reihen = mischen(w.optionen.map((text, i) => ({ text, i })));
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🗳️ Deine Stimme'),
    el('section', { class: 'k-karte', style: 'text-align:center' },
      el('p', { style: 'color:#4b5563;margin-top:0' }, `Wähler ${nummer} von ${w.erwartet} · geheim`),
      el('p', { style: 'font-size:1.2rem;font-weight:700' }, w.frage),
      el('p', { style: 'font-size:0.9rem;color:#4b5563' }, 'Niemand sieht, was du wählst. Tippe deine Antwort an:')),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-antworten' },
        ...reihen.map(({ text, i }) => el('button', { class: 'k-knopf', onclick: () => {
          const neu = stimmeAb(lade(), i);
          speichere(neu);
          versiegelt(neu);
        } }, text)))));
}

function versiegelt(w) {
  const weiter = !fertig(w);
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🔒 Stimme versiegelt'),
    el('section', { class: 'k-karte', style: 'text-align:center' },
      el('p', { class: 'k-gross' }, '🔒✅'),
      el('p', { style: 'font-weight:700' }, 'Danke! Deine Stimme ist geheim gespeichert.'),
      el('p', {}, weiter ? `Gib das Gerät weiter – es fehlen noch ${offen(w)} Stimme(n).` : 'Das war die letzte Stimme!'),
      el('button', { class: 'k-knopf', onclick: () => (weiter ? wahlgang() : ergebnisBildschirm()) }, weiter ? '➡️ Nächster Wähler' : '📊 Ergebnis zeigen')));
}

function ergebnisBildschirm() {
  const w = lade();
  if (!w) return startBildschirm();
  const e = ergebnis(w);
  const max = e.zeilen[0]?.stimmen || 1;
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '📊 Ergebnis'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:700;margin-top:0' }, w.frage),
      ...e.zeilen.map((z) => el('div', { style: 'margin:0.4rem 0' },
        el('div', { style: 'display:flex;justify-content:space-between' }, el('span', {}, z.text), el('span', { style: 'font-weight:700' }, `${z.stimmen}`)),
        el('div', { style: 'background:#e5e7eb;border-radius:0.4rem;overflow:hidden;height:1.1rem' },
          el('div', { style: `width:${Math.round((z.stimmen / max) * 100)}%;background:var(--k-blau-dunkel);height:100%` })))),
      el('p', { style: 'margin-bottom:0;font-weight:600' }, ergebnisZeile(e)),
      el('p', { style: 'font-size:0.9rem;color:#4b5563' }, `${e.gesamt} Stimmen · geheim abgegeben, kein Kind ist einer Stimme zuzuordnen.`)),
    el('section', { class: 'k-karte' },
      el('button', { class: 'k-knopf', onclick: () => { loesche(); startBildschirm(); } }, '🔁 Neue Wahl')));
}

startBildschirm();
