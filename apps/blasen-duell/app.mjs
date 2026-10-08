// Blasen-Duell (für 8-12, docs/09 Ось G, zu feed-forscher). Split-Screen auf
// einem Gerät: zwei Kinder tippen unterschiedliche Interessen an und sehen
// live, wie derselbe Algorithmus zwei völlig verschiedene Feeds erzeugt.
// Lernziel: Empfehlungssysteme personalisieren und trennen Sichtweisen.
// Speichert nichts, keine externen Anfragen (NetzwerkWaechter).
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { hilfeInsel } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { THEMEN, neueBlase, tippe, dominant, ziehe, verschieden } from './blase.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const FEED = 3;
const themaVon = (id) => THEMEN.find((t) => t.id === id);

let blaseA = neueBlase();
let blaseB = neueBlase();
let tippsA = 0;
let tippsB = 0;

function spalte(seite) {
  const istA = seite === 'A';
  const blase = istA ? blaseA : blaseB;
  const feed = ziehe(blase, FEED);
  const d = dominant(blase);
  const th = themaVon(d.id);
  return el('section', { class: 'k-karte', style: 'flex:1;min-width:9rem' },
    el('p', { style: 'font-weight:700;margin-top:0;text-align:center' }, istA ? '🧒 Kind A' : '🧑 Kind B'),
    el('div', { style: 'display:flex;flex-direction:column;gap:0.4rem' },
      ...feed.map((id) => {
        const t = themaVon(id);
        return el('button', { class: 'k-knopf k-knopf--neutral', style: 'text-align:left', onclick: () => {
          if (istA) { blaseA = tippe(blaseA, id); tippsA++; } else { blaseB = tippe(blaseB, id); tippsB++; }
          render();
        } }, `${t.emoji} ${t.name}-Video ansehen`);
      })),
    el('div', { style: 'margin-top:0.5rem;background:#f1f5f9;border-radius:0.5rem;padding:0.4rem;text-align:center' },
      el('p', { style: 'margin:0;font-size:0.85rem;color:#4b5563' }, 'Deine Blase:'),
      el('p', { style: 'margin:0.1rem 0;font-size:1.4rem' }, `${th.emoji} ${Math.round(d.anteil * 100)} %`),
      el('p', { style: 'margin:0;font-size:0.8rem;color:#4b5563' }, th.name)));
}

function vergleich() {
  if (tippsA === 0 || tippsB === 0) {
    return el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0;color:#4b5563' }, 'Tippt beide ein paar Videos an – jedes Kind auf seiner Seite. Beobachtet dann, wie eure Feeds auseinanderlaufen.'));
  }
  const da = dominant(blaseA); const db = dominant(blaseB);
  const ta = themaVon(da.id); const tb = themaVon(db.id);
  const anders = verschieden(blaseA, blaseB);
  const lektion = anders
    ? `Kind A sieht jetzt meist ${ta.emoji} ${ta.name}, Kind B meist ${tb.emoji} ${tb.name} – derselbe Algorithmus, zwei ganz verschiedene Welten!`
    : `Ihr habt Ähnliches getippt, darum ähneln sich eure Feeds (beide ${ta.emoji} ${ta.name}). Tippt Verschiedenes – dann trennen sich die Blasen.`;
  return el('section', { class: 'k-karte' },
    el('p', { style: 'font-weight:700;margin-top:0' }, anders ? '🫧 Zwei verschiedene Blasen!' : '🫧 Noch fast gleich'),
    el('p', { style: 'margin:0.3rem 0' }, lektion),
    el('p', { style: 'margin:0.3rem 0;font-size:0.9rem;color:#4b5563' }, 'So funktioniert Personalisierung: Jede*r sieht einen anderen Ausschnitt der Welt. Darum lohnt es sich, auch mal die Blase der anderen anzuschauen.'),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(lektion + ' So funktioniert Personalisierung: Jeder sieht einen anderen Ausschnitt der Welt.') }, '🔊 Vorlesen'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { blaseA = neueBlase(); blaseB = neueBlase(); tippsA = 0; tippsB = 0; render(); } }, '🔁 Neu starten')));
}

function render() {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🫧 Blasen-Duell'),
    el('p', { class: 'k-untertitel' }, 'Zwei Kinder, ein Gerät, ein Algorithmus – zwei ganz verschiedene Feeds.'),
    el('div', { style: 'display:flex;gap:0.6rem;flex-wrap:wrap' }, spalte('A'), spalte('B')),
    vergleich(),
    hilfeInsel(),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'werbefrei · läuft offline · es wird nichts gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
