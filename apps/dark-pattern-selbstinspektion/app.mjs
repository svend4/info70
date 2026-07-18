// Dark-Pattern-Selbstinspektion (für Betreiber/Designer, docs/09 Ось D Nr. 228).
// UI-Prüfliste: jedes Muster als ungeprüft/gefunden/frei/behoben markieren;
// Bericht dokumentiert Befunde und Abstellmaßnahmen (faire Alternative).
// Politik docs/02: keine externen Anfragen; alles lokal, nur localStorage.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { ZUSTAENDE, STANDARD, alleMuster, zaehle, bericht } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'darkpattern.status';
const app = document.getElementById('app');
const daten = await fetch('daten/muster.json').then((r) => r.json());
const ALLE = alleMuster(daten);
const WAHL = ['ungeprueft', 'gefunden', 'frei', 'behoben'];

const ladeStatus = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}');
const speichereStatus = (s) => localStorage.setItem(SCHLUESSEL, JSON.stringify(s));

function berichtHerunterladen(text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = el('a', { href: url, download: 'dark-pattern-selbstinspektion.txt' });
  a.click();
  URL.revokeObjectURL(url);
}

function render() {
  const status = ladeStatus();
  const z = zaehle(ALLE, status);

  const katKarten = daten.kategorien.map((k) =>
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `${k.emoji} ${k.name}`),
      ...k.muster.map((m) => {
        const aktuell = status[m.id] ?? STANDARD;
        const wahl = el('div', { class: 'k-antworten', role: 'radiogroup', 'aria-label': m.name, style: 'margin:0.3rem 0 0' },
          ...WAHL.map((code) => el('button', {
            class: `k-knopf k-knopf--klein${code === aktuell ? '' : ' k-knopf--neutral'}`,
            role: 'radio', 'aria-checked': String(code === aktuell),
            onclick: () => { const s = ladeStatus(); s[m.id] = code; speichereStatus(s); render(); },
          }, `${ZUSTAENDE[code].symbol} ${ZUSTAENDE[code].label}`)));
        return el('div', { style: 'padding:0.5rem 0;border-top:1px solid var(--k-rand)' },
          el('p', { style: 'margin:0 0 0.2rem;font-weight:600' }, m.name),
          el('p', { style: 'margin:0 0 0.2rem;font-size:0.85rem;color:#374151' }, `Beispiel: ${m.beispiel}`),
          el('details', { style: 'margin:0.15rem 0' },
            el('summary', { style: 'cursor:pointer;font-size:0.85rem;color:var(--k-blau-dunkel)' }, '💡 Wirkung auf Kinder & faire Alternative'),
            el('p', { style: 'font-size:0.85rem;margin:0.3rem 0 0;color:#374151' }, `Wirkung: ${m.kindWirkung}`),
            el('p', { style: 'font-size:0.85rem;margin:0.2rem 0 0;color:#065f46' }, `Fair: ${m.faireAlternative}`),
            el('small', { style: 'color:#6b7280' }, m.bezug)),
          wahl);
      })));

  const berichtsFeld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:12rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': 'Inspektions-Bericht',
  });
  berichtsFeld.value = bericht(daten, status);

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🎭 Dark-Pattern-Selbstinspektion'),
    el('p', { class: 'k-untertitel' }, 'Das eigene Angebot Screen für Screen auf manipulative Muster prüfen (für Betreiber & Designer)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `🔴 gefunden: ${z.gefunden}   🔵 behoben: ${z.behoben}   🟢 frei: ${z.frei}   ⚪ ungeprüft: ${z.ungeprueft}   (von ${ALLE.length})`),
      el('p', { style: 'font-size:0.9rem;margin-bottom:0' }, daten.hinweis)),
    ...katKarten,
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, 'Bericht (Befunde & Abstellmaßnahmen)'),
      berichtsFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => berichtHerunterladen(berichtsFeld.value) }, '💾 Als Datei speichern'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { berichtsFeld.select(); navigator.clipboard?.writeText(berichtsFeld.value); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 Kopieren'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); render(); } }, '🧹 Zurücksetzen'))),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · Daten bleiben auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
