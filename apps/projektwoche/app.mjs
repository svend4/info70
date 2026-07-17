// Projektwoche "Sicher im Netz": schulfertiges Fuenf-Tage-Format fuer
// LEHRKRAEFTE (3.-6. Klasse). Buendelt vorhandene Apps des Monorepos zu
// Tagesplaenen a 90 Minuten - ohne Neuentwicklung, ohne Geraete-Pflicht
// (Klassen-Modus!), komplett druckbar als Handreichung.
// Speichert NICHTS: reines Nachschlage- und Druckwerkzeug.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const woche = await fetch('daten/woche.json').then((r) => r.json());

const APP_NAMEN = {
  'nachrichten-detektive': '🕵️ Nachrichten-Detektive',
  'lootbox-labor': '🎁 Lootbox-Labor',
  'dark-pattern-labyrinth': '🪤 Dark-Pattern-Labyrinth',
  'feed-forscher': '🔬 Feed-Forscher',
  'sog-maschine': '🌀 Sog-Maschine',
  'stark-im-chat': '💪 Stark im Chat',
  'spiral-stopper': '🧯 Spiral-Stopper',
  'mitmach-arena': '🗳️ Mitmach-Arena',
  'daten-schatz': '🗝️ Daten-Schatz',
  'daten-radiergummi': '🧽 Daten-Radiergummi',
  'beschwerde-lotse': '🧭 Beschwerde-Lotse',
};

function appLink(ordner) {
  return el('a', {
    class: 'k-knopf k-knopf--klein',
    style: 'text-decoration:none;text-align:center',
    href: `../${ordner}/`,
  }, APP_NAMEN[ordner] ?? ordner);
}

function tagKarte(tag) {
  const gesamt = tag.ablauf.reduce((s, a) => s + a.minuten, 0);
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.15rem' }, `${tag.emoji} Tag ${tag.nr}: ${tag.titel}`),
    el('p', { style: 'margin:0 0 0.5rem' }, el('strong', {}, 'Lernziel: '), tag.lernziel),
    el('table', { style: 'width:100%;border-collapse:collapse;font-size:0.92rem' },
      el('thead', {},
        el('tr', {},
          el('th', { style: 'text-align:left;border-bottom:2px solid var(--k-rand);padding:0.3rem;width:4.5rem' }, 'Min.'),
          el('th', { style: 'text-align:left;border-bottom:2px solid var(--k-rand);padding:0.3rem;width:7rem' }, 'Phase'),
          el('th', { style: 'text-align:left;border-bottom:2px solid var(--k-rand);padding:0.3rem' }, 'So läuft es'))),
      el('tbody', {},
        ...tag.ablauf.map((a) =>
          el('tr', {},
            el('td', { style: 'border-bottom:1px solid var(--k-rand);padding:0.3rem;vertical-align:top' }, String(a.minuten)),
            el('td', { style: 'border-bottom:1px solid var(--k-rand);padding:0.3rem;vertical-align:top;font-weight:600' }, a.phase),
            el('td', { style: 'border-bottom:1px solid var(--k-rand);padding:0.3rem;vertical-align:top' }, a.text))))),
    el('p', { style: 'margin:0.4rem 0;font-size:0.85rem;color:#4b5563' }, `Gesamt: ${gesamt} Minuten (Doppelstunde + Puffer)`),
    el('p', { style: 'margin:0.4rem 0' }, el('strong', {}, '📦 Material: '), tag.material.join(' · ')),
    el('div', { class: 'k-antworten pw-nur-bildschirm', style: 'margin:0.5rem 0' }, ...tag.apps.map(appLink)),
    el('p', { class: 'pw-nur-druck', style: 'margin:0.4rem 0' }, el('strong', {}, '💻 Apps: '), tag.apps.map((a) => APP_NAMEN[a] ?? a).join(' · ')),
    el('p', { style: 'margin:0.4rem 0 0;background:var(--k-hell, #eef6ff);border-radius:0.5rem;padding:0.5rem' },
      el('strong', {}, '🎒 Transfer: '), tag.transfer));
}

app.replaceChildren(
  el('h1', { class: 'k-titel' }, `📅 ${woche.titel}`),
  el('p', { class: 'k-untertitel' }, `Fertiges Fünf-Tage-Format für Lehrkräfte · ${woche.zielgruppe}`),
  el('section', { class: 'k-karte' },
    el('p', { style: 'margin-top:0' }, el('strong', {}, 'Rahmen: '), woche.rahmen),
    el('p', {}, el('strong', {}, '🖥️ Technik: '), woche.technik),
    el('p', { style: 'margin-bottom:0' }, 'Jeder Tag ist eine 90-Minuten-Einheit: Einstieg → Erarbeitung mit App → Vertiefung ohne Bildschirm → Abschluss. Der rote Faden: von „Was stimmt?“ (Tag 1) über „Was lenkt mich?“ (Tag 2–3) und „Wie bleiben wir fair?“ (Tag 4) zur eigenen Klassen-Netz-Charta (Tag 5).'),
    el('div', { class: 'k-antworten pw-nur-bildschirm', style: 'margin-top:0.5rem' },
      el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, '🖨️ Handreichung drucken'))),
  ...woche.tage.map(tagKarte),
  el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '👪 Eltern & Hilfe'),
    el('p', { style: 'margin:0 0 0.5rem' }, woche.elternHinweis),
    el('p', { style: 'margin:0' }, woche.hilfe)),
  el('footer', { class: 'k-fuss' },
    el('span', {}, 'Material für Lehrkräfte · diese Seite speichert nichts · '),
    el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
