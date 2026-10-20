// fragFINN-Selbsttest: Aufnahmekriterien der Kinder-Whitelist durchgehen.
// Zielgruppe: ERWACHSENE (Betreiber von Kinderseiten). Content-Pack auf der
// kriterien-check-Engine (docs/09 Nr. 55): Punkt fuer Punkt mit Hilfe-Texten,
// am Ende ein lokal erzeugter Pruefbericht (Datei-Export) als Vorbereitung fuer
// den fragFINN-Antrag. Kein offizielles Ergebnis. Politik: keine externen
// Anfragen; Haken + Bericht bleiben lokal.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const STATUS_SCHLUESSEL = 'ffst.status';
const NOTIZ_SCHLUESSEL = 'ffst.notiz';
const app = document.getElementById('app');
const daten = await fetch('daten/kriterien.json').then((r) => r.json());
const ALLE = daten.bereiche.flatMap((b) => b.kriterien);

const ladeStatus = () => JSON.parse(localStorage.getItem(STATUS_SCHLUESSEL) ?? '{}');
const speichereStatus = (s) => localStorage.setItem(STATUS_SCHLUESSEL, JSON.stringify(s));
const ladeNotiz = () => localStorage.getItem(NOTIZ_SCHLUESSEL) ?? '';

// Eingabehinweis am Notizfeld: keine Kindernamen eintragen. Sichtbar, als eigenes Element
// direkt vor dem Feld; das Feld verweist per aria-describedby darauf. Der Feldname bleibt gleich.
const KINDER_HINWEIS = 'Keine Namen von Kindern eingeben.';
const kinderHinweis = (id) => el('span', { id, style: 'display:block;font-size:0.85rem;color:#4b5563;margin:0 0 0.3rem' }, KINDER_HINWEIS);

function bericht(status, notiz) {
  const erfuellt = ALLE.filter((k) => status[k.id]).length;
  const zeilen = [
    'fragFINN-Selbsttest – Vorbereitung Whitelist-Antrag',
    `Grundlage: ${daten.quelle}`,
    `Stand: ${new Date().toLocaleDateString('de-DE')}`,
    `Erfüllt: ${erfuellt} von ${ALLE.length}`,
    '',
  ];
  for (const b of daten.bereiche) {
    zeilen.push(`## ${b.name}`);
    for (const k of b.kriterien) zeilen.push(`${status[k.id] ? '[x]' : '[ ]'} ${k.text} (${k.bezug})`);
    zeilen.push('');
  }
  const offen = ALLE.filter((k) => !status[k.id]);
  if (offen.length) {
    zeilen.push('## Offen – vor dem Antrag schließen');
    for (const k of offen) zeilen.push(`- ${k.text}`);
    zeilen.push('');
  }
  if (notiz.trim()) zeilen.push('## Notizen', notiz.trim(), '');
  zeilen.push('Hinweis: Selbsttest, kein offizielles Ergebnis. Verbindliche Prüfung: fragFINN.');
  return zeilen.join('\n');
}

function berichtHerunterladen(text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = el('a', { href: url, download: 'fragfinn-selbsttest.txt' });
  a.click();
  URL.revokeObjectURL(url);
}

function render() {
  const status = ladeStatus();
  const erfuellt = ALLE.filter((k) => status[k.id]).length;
  const anteil = Math.round((erfuellt / ALLE.length) * 100);

  const bereichsKarten = daten.bereiche.map((b) => {
    const ok = b.kriterien.filter((k) => status[k.id]).length;
    return el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `${b.emoji} ${b.name} (${ok}/${b.kriterien.length})`),
      ...b.kriterien.map((k) => {
        const eingabe = el('input', { type: 'checkbox', id: `ff-${k.id}`, style: 'width:3rem;height:3rem;flex-shrink:0' });
        eingabe.checked = Boolean(status[k.id]);
        eingabe.addEventListener('change', () => { const s = ladeStatus(); s[k.id] = eingabe.checked; speichereStatus(s); render(); });
        return el('div', { style: 'padding:0.4rem 0' },
          el('div', { style: 'display:flex;gap:0.6rem;align-items:center' },
            eingabe,
            el('label', { for: `ff-${k.id}` },
              el('span', {}, k.text),
              el('small', { style: 'display:block;color:#4b5563' }, k.bezug))),
          el('details', { style: 'margin:0.25rem 0 0 3.6rem' },
            el('summary', { style: 'cursor:pointer;font-size:0.85rem;color:var(--k-blau-dunkel)' }, '💡 Was fragFINN hier erwartet'),
            el('p', { style: 'font-size:0.85rem;margin:0.3rem 0 0;color:#374151' }, k.hilfe)));
      }));
  });

  const notizFeld = el('textarea', {
    style: 'width:100%;min-height:5rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem;font-size:0.9rem',
    'aria-label': 'Notizen', 'aria-describedby': 'ffst-hinweis-notiz', placeholder: 'Notizen, offene Punkte, geplante Maßnahmen …',
  });
  notizFeld.value = ladeNotiz();
  notizFeld.addEventListener('input', () => localStorage.setItem(NOTIZ_SCHLUESSEL, notizFeld.value));

  const berichtsFeld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:12rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': 'Prüfbericht',
  });
  berichtsFeld.value = bericht(status, notizFeld.value);

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '✅ fragFINN-Selbsttest'),
    el('p', { class: 'k-untertitel' }, 'Bereit für die Kinder-Whitelist? Prüfe die Aufnahmekriterien (für Betreiber)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `Erfüllt: ${erfuellt} von ${ALLE.length} Kriterien (${anteil} %)`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': ALLE.length, 'aria-valuenow': erfuellt },
        el('div', { style: `width:${anteil}%` })),
      el('p', { style: 'font-size:0.9rem;margin-bottom:0' }, daten.hinweis)),
    ...bereichsKarten,
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📝 Notizen'),
      kinderHinweis('ffst-hinweis-notiz'),
      notizFeld),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, 'Prüfbericht (zur Vorbereitung des fragFINN-Antrags)'),
      berichtsFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => berichtHerunterladen(berichtsFeld.value) }, '💾 Als Datei speichern'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { berichtsFeld.select(); navigator.clipboard?.writeText(berichtsFeld.value); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 Kopieren'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(STATUS_SCHLUESSEL); localStorage.removeItem(NOTIZ_SCHLUESSEL); render(); } }, '🧹 Zurücksetzen'))),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · Daten bleiben auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
