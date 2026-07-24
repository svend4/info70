// Bewegungspausen-Generator (Fiskultminutki) für Kita & „Bewegte Schule“
// (docs/10 Praleska Top-30 Nr. 16). Würfelt aus der Baustein-Kartei ein
// 7–10-Minuten-Skript (Aufwachen → Power → Koordination → Ruhe) mit eigenen
// Versen; Druckansicht und Text-Export. Das Gerät ist nur Impulsgeber – die
// Pause selbst ist bildschirmfrei. Politik docs/02: keine externen Anfragen,
// nichts wird gespeichert.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { pruefeBausteine, erzeugePause, gesamtMinuten, skriptText } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/bausteine.json').then((r) => r.json());
const phasenName = new Map(daten.phasen.map((p) => [p.id, `${p.emoji} ${p.name}`]));

let skript = [];

function download(text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = el('a', { href: url, download: 'bewegungspause.txt' });
  a.click();
  URL.revokeObjectURL(url);
}

function bausteinKarte(b, i) {
  return el('section', { class: 'k-karte bpg-karte' },
    el('div', { style: 'display:flex;justify-content:space-between;gap:0.5rem;align-items:baseline' },
      el('h2', { style: 'margin:0;font-size:1.05rem' }, `${i + 1}. ${b.titel}`),
      el('small', { style: 'color:#4b5563;white-space:nowrap' }, `${b.minuten} Min · ${phasenName.get(b.phase) ?? b.phase}`)),
    el('ol', { style: 'margin:0.4rem 0;padding-inline-start:1.3rem' },
      ...b.anleitung.map((s) => el('li', { style: 'margin:0.15rem 0' }, s))),
    el('p', { style: 'margin:0;font-style:italic' }, `🎵 „${b.vers}“`),
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein bpg-nur-bildschirm', style: 'margin-top:0.3rem', onclick: () => vorlesen(`${b.titel}. ${b.anleitung.join(' ')} ${b.vers}`) }, '🔊 Vorlesen'));
}

function render() {
  const dauer = gesamtMinuten(skript);
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '⚡ Bewegungspausen-Generator'),
    el('p', { class: 'k-untertitel bpg-nur-bildschirm' }, '7–10 Minuten Bewegung für Kita & Bewegte Schule – ohne Material, am Platz'),
    el('section', { class: 'k-karte bpg-nur-bildschirm' },
      el('p', { style: 'margin-top:0;font-size:0.92rem' }, daten.hinweis),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => { skript = erzeugePause(daten); render(); } }, '🎲 Neue Pause würfeln'),
        skript.length ? el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => window.print() }, '🖨️ Drucken') : null,
        skript.length ? el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => download(skriptText(daten, skript)) }, '💾 Als Text speichern') : null,
        skript.length ? el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: (ev) => { navigator.clipboard?.writeText(skriptText(daten, skript)); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 Kopieren') : null)),
    skript.length
      ? el('section', { class: 'k-karte', style: 'background:#eff6ff' },
          el('p', { style: 'margin:0;font-weight:700' }, `⏱️ Gesamt: ${dauer} Minuten – Ablauf: Aufwachen → Power → Koordination → Ruhe`))
      : el('section', { class: 'k-karte bpg-nur-bildschirm' },
          el('p', { style: 'margin:0' }, '👉 Tippe auf „Neue Pause würfeln“ – du bekommst einen fertigen Ablauf zum Vormachen. Das Gerät bleibt danach aus: Die Pause selbst ist bildschirmfrei.')),
    ...skript.map((b, i) => bausteinKarte(b, i)),
    el('footer', { class: 'k-fuss bpg-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Fachkräfte & Familien · werbefrei · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

const fehler = pruefeBausteine(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
