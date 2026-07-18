// Vorsorge-Check § 24a JuSchG (für Betreiber, docs/09 Nr. 175). Selbstaudit
// entlang der Vorsorgemaßnahmen mit Ampel je Kriterium (🟢 erfüllt / 🔴 offen /
// ⚪ nicht anwendbar). Ergebnis: Ampel-Bericht als Datei für BzKJ-Aufsicht/
// Förderanträge. Politik docs/02: keine externen Anfragen; alles lokal.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { ampelBericht, zaehle, STANDARD } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'vcj.status';
const app = document.getElementById('app');
const daten = await fetch('daten/kriterien.json').then((r) => r.json());
const ALLE = daten.bereiche.flatMap((b) => b.kriterien);
const ZUSTAENDE = [['gruen', '🟢 erfüllt'], ['rot', '🔴 offen'], ['grau', '⚪ n/a']];

const ladeStatus = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}');
const speichereStatus = (s) => localStorage.setItem(SCHLUESSEL, JSON.stringify(s));

function berichtHerunterladen(text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = el('a', { href: url, download: 'vorsorge-check-juschg-ampel.txt' });
  a.click();
  URL.revokeObjectURL(url);
}

function render() {
  const status = ladeStatus();
  const z = zaehle(ALLE, status);

  const bereichsKarten = daten.bereiche.map((b) =>
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `${b.emoji} ${b.name}`),
      ...b.kriterien.map((k) => {
        const aktuell = status[k.id] ?? STANDARD;
        const wahl = el('div', { class: 'k-antworten', role: 'radiogroup', 'aria-label': k.text, style: 'margin:0.3rem 0 0 0' },
          ...ZUSTAENDE.map(([code, label]) => el('button', {
            class: `k-knopf k-knopf--klein${code === aktuell ? '' : ' k-knopf--neutral'}`,
            role: 'radio', 'aria-checked': String(code === aktuell),
            onclick: () => { const s = ladeStatus(); s[k.id] = code; speichereStatus(s); render(); },
          }, label)));
        return el('div', { style: 'padding:0.5rem 0;border-top:1px solid var(--k-rand)' },
          el('p', { style: 'margin:0 0 0.2rem;font-weight:600' }, k.text),
          el('small', { style: 'color:#4b5563' }, k.bezug),
          el('details', { style: 'margin:0.25rem 0' },
            el('summary', { style: 'cursor:pointer;font-size:0.85rem;color:var(--k-blau-dunkel)' }, '💡 Was § 24a hier verlangt'),
            el('p', { style: 'font-size:0.85rem;margin:0.3rem 0 0;color:#374151' }, k.hilfe)),
          wahl);
      })));

  const berichtsFeld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:12rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': 'Ampel-Bericht',
  });
  berichtsFeld.value = ampelBericht(daten, status);

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🛡️ Vorsorge-Check § 24a'),
    el('p', { class: 'k-untertitel' }, 'Vorsorgemaßnahmen nach § 24a JuSchG per Ampel bewerten (für Betreiber)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `🟢 erfüllt: ${z.gruen}   🔴 offen: ${z.rot}   ⚪ n/a: ${z.grau}   (von ${ALLE.length})`),
      el('p', { style: 'font-size:0.9rem;margin-bottom:0' }, daten.hinweis)),
    ...bereichsKarten,
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, 'Ampel-Bericht (offene Punkte zuerst)'),
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
