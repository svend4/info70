// Klassen-Koffer-Auswertung (für LEHRKRÄFTE, docs/09 Ось E). Die Lehrkraft
// importiert anonyme Ergebnis-Dateien (Tiernamen statt Klarnamen) von mehreren
// Geräten und sieht eine Heatmap: Welche Frage/welches Szenario fiel schwer?
// Kein Server, keine Konten. Alles im Arbeitsspeicher, nichts wird gespeichert.
// Politik docs/02: keine externen Anfragen (NetzwerkWaechter).
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { pruefeKoffer, aggregiere, baueBericht, KOFFER_ART, KOFFER_VERSION } from './auswertung.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const STUFE_FARBE = { leicht: '#dcfce7', mittel: '#fef9c3', schwer: '#fee2e2' };
const STUFE_TEXT = { leicht: '🟢 leicht', mittel: '🟡 mittel', schwer: '🔴 schwer' };

let kofferListe = []; // nur im Arbeitsspeicher, keine Persistenz

const BEISPIEL = [
  { art: KOFFER_ART, version: KOFFER_VERSION, quelle: 'nachrichten-detektive', tier: 'Fuchs', antworten: [
    { id: 'nd1', text: 'Werbung als Werbung erkennen', richtig: false },
    { id: 'nd2', text: 'Quelle prüfen: Wer sagt das?', richtig: true },
    { id: 'nd3', text: 'KI-Bild erkennen', richtig: false } ] },
  { art: KOFFER_ART, version: KOFFER_VERSION, quelle: 'nachrichten-detektive', tier: 'Igel', antworten: [
    { id: 'nd1', text: 'Werbung als Werbung erkennen', richtig: false },
    { id: 'nd2', text: 'Quelle prüfen: Wer sagt das?', richtig: true },
    { id: 'nd3', text: 'KI-Bild erkennen', richtig: true } ] },
  { art: KOFFER_ART, version: KOFFER_VERSION, quelle: 'nachrichten-detektive', tier: 'Dachs', antworten: [
    { id: 'nd1', text: 'Werbung als Werbung erkennen', richtig: true },
    { id: 'nd2', text: 'Quelle prüfen: Wer sagt das?', richtig: true },
    { id: 'nd3', text: 'KI-Bild erkennen', richtig: false } ] },
];

async function importiere(dateien) {
  const meldungen = [];
  for (const datei of dateien) {
    try {
      const text = await datei.text();
      const inhalt = JSON.parse(text);
      const fehler = pruefeKoffer(inhalt);
      if (fehler.length) { meldungen.push(`❌ ${datei.name}: ${fehler.join(', ')}`); continue; }
      kofferListe.push(inhalt);
      meldungen.push(`✅ ${datei.name}: ${inhalt.tier} übernommen`);
    } catch (e) {
      meldungen.push(`❌ ${datei.name}: keine gültige JSON-Datei`);
    }
  }
  render(meldungen);
}

function heatmapKarte() {
  if (!kofferListe.length) return '';
  const agg = aggregiere(kofferListe);
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🔥 Heatmap – was fiel schwer?'),
    el('p', { style: 'color:#4b5563;margin-top:0' }, `App: ${agg.quelle ?? '–'} · ${agg.geraete} Gerät(e) · Tiere: ${agg.tiere.join(', ')}`),
    el('div', { style: 'overflow-x:auto' },
      el('table', { style: 'width:100%;border-collapse:collapse;font-size:0.95rem' },
        el('thead', {}, el('tr', {},
          el('th', { style: 'text-align:left;padding:0.3rem;border-bottom:2px solid var(--k-rand)' }, 'Frage / Szenario'),
          el('th', { style: 'padding:0.3rem;border-bottom:2px solid var(--k-rand)' }, 'falsch'),
          el('th', { style: 'padding:0.3rem;border-bottom:2px solid var(--k-rand)' }, 'Stufe'))),
        el('tbody', {}, ...agg.fragen.map((f) => el('tr', { style: `background:${STUFE_FARBE[f.stufe]}` },
          el('td', { style: 'padding:0.35rem;border-bottom:1px solid var(--k-rand)' }, f.text),
          el('td', { style: 'padding:0.35rem;text-align:center;border-bottom:1px solid var(--k-rand);font-weight:700' }, `${Math.round(f.quoteFalsch * 100)}% (${f.falsch}/${f.gesamt})`),
          el('td', { style: 'padding:0.35rem;text-align:center;border-bottom:1px solid var(--k-rand)' }, STUFE_TEXT[f.stufe])))))),
    el('div', { class: 'kk-nur-bildschirm', style: 'margin-top:0.6rem;display:flex;gap:0.4rem;flex-wrap:wrap' },
      el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, '🖨️ Auswertung drucken'),
      el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => kopiere(baueBericht(agg)) }, '📋 Bericht kopieren'),
      el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => { kofferListe = []; render(['Alle importierten Ergebnisse entfernt.']); } }, '🧹 Zurücksetzen')));
}

function kopiere(text) {
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => fallbackKopie(text));
  else fallbackKopie(text);
}
function fallbackKopie(text) {
  const ta = el('textarea', { style: 'position:fixed;left:-9999px' }); ta.value = text;
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch (e) { /* ignore */ }
  ta.remove();
}

function render(meldungen = []) {
  const dateiFeld = el('input', { type: 'file', accept: '.json,application/json', multiple: true, style: 'display:block;margin:0.4rem 0', 'aria-label': 'Ergebnis-Dateien importieren', onchange: (e) => importiere([...e.target.files]) });
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧳 Klassen-Koffer-Auswertung'),
    el('p', { class: 'k-untertitel' }, 'Anonyme Ergebnis-Dateien einsammeln und sehen, was der Klasse schwerfiel – ohne Server, ohne Namen.'),
    el('section', { class: 'k-karte kk-nur-bildschirm' },
      el('p', { style: 'margin-top:0;font-weight:600' }, 'Ergebnis-Dateien importieren (mehrere möglich)'),
      dateiFeld,
      el('p', { style: 'font-size:0.9rem;color:#4b5563' }, 'Die Dateien enthalten nur Antwortmuster und frei gewählte Tiernamen – keine Klarnamen. Es wird nichts gespeichert oder gesendet.'),
      el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => { kofferListe = BEISPIEL.map((k) => ({ ...k })); render(['Beispiel-Daten geladen (3 Tiere).']); } }, '🎬 Beispiel laden')),
    meldungen.length ? el('section', { class: 'k-karte kk-nur-bildschirm', style: 'font-size:0.9rem' }, ...meldungen.map((m) => el('p', { style: 'margin:0.2rem 0' }, m))) : '',
    heatmapKarte(),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'für Lehrkräfte · werbefrei · läuft offline · keine personenbezogenen Daten · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
