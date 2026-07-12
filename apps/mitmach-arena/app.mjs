// Mitmach-Arena (Prototyp): Abstimmung nach dem "Handy-herumgeben"-Prinzip.
// Ein Erwachsener/die Klasse legt eine Frage an, das Gerät geht reihum,
// jede*r tippt einmal. Keine Konten, kein Server - alles bleibt lokal.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'ma.umfrage';
const app = document.getElementById('app');

const lade = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? 'null');
const speichere = (u) => localStorage.setItem(SCHLUESSEL, JSON.stringify(u));

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🗳️ Mitmach-Arena'),
    el('p', { class: 'k-untertitel' }, 'Deine Stimme zählt!'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Prototyp · werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

function startBildschirm() {
  const umfrage = lade();
  zeige(
    el('section', { class: 'k-karte' },
      el('p', {}, 'So geht es: Frage anlegen, Gerät herumgeben, jede*r stimmt einmal ab, Ergebnis gemeinsam anschauen.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: anlegenBildschirm }, '📝 Neue Abstimmung'),
        umfrage ? el('button', { class: 'k-knopf k-knopf--neutral', onclick: abstimmenBildschirm }, `▶️ Weiter abstimmen: „${umfrage.frage}“`) : '',
        umfrage ? el('button', { class: 'k-knopf k-knopf--neutral', onclick: ergebnisBildschirm }, '📊 Ergebnis ansehen') : '',
        umfrage ? el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); startBildschirm(); } }, '🧹 Abstimmung löschen') : '')));
}

function anlegenBildschirm() {
  const frageFeld = el('input', { id: 'frage', style: 'width:100%;font:inherit;padding:0.6rem;border-radius:0.5rem;border:2px solid var(--k-rand)', placeholder: 'z. B. Wohin geht der Klassenausflug?', maxlength: 100 });
  const optionsFelder = [0, 1, 2, 3].map((i) =>
    el('input', { style: 'width:100%;font:inherit;padding:0.6rem;border-radius:0.5rem;border:2px solid var(--k-rand);margin-top:0.5rem', placeholder: `Möglichkeit ${i + 1}${i > 1 ? ' (optional)' : ''}`, maxlength: 60 }));
  zeige(
    el('section', { class: 'k-karte' },
      el('label', { for: 'frage', style: 'font-weight:600' }, 'Worüber wird abgestimmt?'),
      frageFeld,
      el('p', { style: 'font-weight:600;margin-bottom:0' }, 'Möglichkeiten:'),
      ...optionsFelder,
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf',
          onclick: () => {
            const frage = frageFeld.value.trim();
            const optionen = optionsFelder.map((f) => f.value.trim()).filter(Boolean);
            if (!frage || optionen.length < 2) {
              vorlesen('Bitte eine Frage und mindestens zwei Möglichkeiten eingeben.');
              return;
            }
            speichere({ frage, optionen, stimmen: optionen.map(() => 0) });
            abstimmenBildschirm();
          },
        }, '✅ Abstimmung starten'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, 'Zurück'))));
}

function abstimmenBildschirm() {
  const u = lade();
  if (!u) return startBildschirm();
  const abgegeben = u.stimmen.reduce((a, b) => a + b, 0);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Bisher ${abgegeben} Stimme${abgegeben === 1 ? '' : 'n'} · Gerät weitergeben!`),
      el('p', { style: 'font-weight:600' }, u.frage),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${u.frage}. Die Möglichkeiten sind: ${u.optionen.join('. Oder: ')}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        ...u.optionen.map((o, i) =>
          el('button', {
            class: 'k-knopf',
            onclick: () => {
              u.stimmen[i]++;
              speichere(u);
              dankeBildschirm();
            },
          }, o)),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: ergebnisBildschirm }, '📊 Fertig – Ergebnis zeigen'))));
}

function dankeBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🙌'),
      el('p', { style: 'text-align:center;font-weight:600' }, 'Danke für deine Stimme! Gib das Gerät weiter.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: abstimmenBildschirm }, 'Nächste Person ➡️'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: ergebnisBildschirm }, '📊 Ergebnis zeigen'))));
}

function ergebnisBildschirm() {
  const u = lade();
  if (!u) return startBildschirm();
  const gesamt = Math.max(1, u.stimmen.reduce((a, b) => a + b, 0));
  const maxStimmen = Math.max(...u.stimmen);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600' }, u.frage),
      ...u.optionen.map((o, i) => {
        const anteil = Math.round((u.stimmen[i] / gesamt) * 100);
        const gewinner = u.stimmen[i] === maxStimmen && maxStimmen > 0;
        return el('div', { style: 'margin:0.75rem 0' },
          el('p', { style: 'margin:0 0 0.25rem' }, `${gewinner ? '🏆 ' : ''}${o} – ${u.stimmen[i]} (${anteil}%)`),
          el('div', { class: 'k-fortschritt' }, el('div', { style: `width:${anteil}%` })));
      }),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: abstimmenBildschirm }, '▶️ Weiter abstimmen'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'))));
}

startBildschirm();
