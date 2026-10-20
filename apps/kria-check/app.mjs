// KRIA-Check: Kinderrechte-Folgenabschätzung (Child Rights Impact Assessment)
// nach UN-KRK General Comment No. 25 - fuer ERWACHSENE (Anbieter, Schulen,
// Traeger, Beschaffungsstellen). Ein solches Werkzeug fehlt in Deutschland;
// GC25 Rn. 23 fordert die Folgenabschaetzung ausdruecklich auch von Unternehmen.
// Gleiche Engine wie kriterien-check: Haken lokal, Bericht als Text + Datei.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const STATUS_SCHLUESSEL = 'kria.status';
const NOTIZ_SCHLUESSEL = 'kria.notizen';
const app = document.getElementById('app');
const daten = await fetch('daten/kriterien.json').then((r) => r.json());
const ALLE = daten.bereiche.flatMap((b) => b.kriterien);

const ladeStatus = () => JSON.parse(localStorage.getItem(STATUS_SCHLUESSEL) ?? '{}');
const speichereStatus = (s) => localStorage.setItem(STATUS_SCHLUESSEL, JSON.stringify(s));
const ladeNotizen = () => localStorage.getItem(NOTIZ_SCHLUESSEL) ?? '';

// Eingabehinweis am Notizfeld (Freitext): sichtbar, als eigenes Element direkt vor dem Feld; das Feld
// verweist per aria-describedby darauf. Die App hat keine Druckfassung, der Hinweis bleibt also überall stehen.
const KINDER_HINWEIS = 'Keine Namen von Kindern eingeben.';
const HINWEIS_STIL = 'display:block;font-size:0.85rem;color:#4b5563;margin:0.2rem 0';

function bericht(status, notizen) {
  const erfuellt = ALLE.filter((k) => status[k.id]).length;
  const zeilen = [
    'KRIA-Check - Kinderrechte-Folgenabschätzung (GC25)',
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
    zeilen.push('## Offene Punkte (vor Start/Beschaffung/Antrag schließen)');
    for (const k of offen) zeilen.push(`- ${k.text}`);
    zeilen.push('');
  }
  if (notizen.trim()) zeilen.push('## Notizen & Abwägungen', notizen.trim(), '');
  return zeilen.join('\n');
}

function berichtHerunterladen(text) {
  // Lokaler Datei-Export ohne Server: Blob -> Objekt-URL -> Klick.
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = el('a', { href: url, download: 'kria-bericht.txt' });
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
        const eingabe = el('input', {
          type: 'checkbox',
          id: `kria-${k.id}`,
          style: 'width:3rem;height:3rem;flex-shrink:0;margin:0',
        });
        eingabe.checked = Boolean(status[k.id]);
        eingabe.addEventListener('change', () => {
          const s = ladeStatus();
          s[k.id] = eingabe.checked;
          speichereStatus(s);
          render();
        });
        return el('div', { style: 'padding:0.4rem 0' },
          el('div', { style: 'display:flex;gap:0.6rem;align-items:center' },
            eingabe,
            el('label', { for: `kria-${k.id}`, style: 'min-width:0;overflow-wrap:anywhere' },
              el('span', {}, k.text),
              el('small', { style: 'display:block;color:#4b5563' }, k.bezug))),
          el('details', { style: 'margin:0.25rem 0 0 3.6rem' },
            el('summary', { style: 'cursor:pointer;font-size:0.85rem;color:var(--k-blau-dunkel)' }, '💡 So prüfst du das'),
            el('p', { style: 'font-size:0.85rem;margin:0.3rem 0 0;color:#374151' }, k.hilfe)));
      }));
  });

  const notizFeld = el('textarea', {
    style: 'width:100%;min-height:6rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem;font-size:0.9rem',
    'aria-label': 'Notizen und Abwägungen',
    'aria-describedby': 'kria-hinweis-notizen',
    placeholder: 'Abwägungen, Ausnahmen, geplante Maßnahmen mit Termin … (bleibt nur auf diesem Gerät)',
  });
  notizFeld.value = ladeNotizen();
  notizFeld.addEventListener('input', () => localStorage.setItem(NOTIZ_SCHLUESSEL, notizFeld.value));

  const berichtsFeld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:12rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': 'KRIA-Bericht als Text',
  });
  berichtsFeld.value = bericht(status, notizFeld.value);

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '⚖️ KRIA-Check'),
    el('p', { class: 'k-untertitel' }, 'Kinderrechte-Folgenabschätzung für digitale Angebote (für Erwachsene)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `Erfüllt: ${erfuellt} von ${ALLE.length} Prüfpunkten (${anteil} %)`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': ALLE.length, 'aria-valuenow': erfuellt },
        el('div', { style: `width:${anteil}%` })),
      el('p', { style: 'font-size:0.9rem' }, daten.hinweis),
      el('p', { style: 'margin-bottom:0;font-size:0.9rem' }, `Grundlage: ${daten.quelle}. Haken und Notizen bleiben auf diesem Gerät; der Bericht eignet sich als Anlage für Förderanträge (BzKJ), Beschaffungen und Gütesiegel-Verfahren.`)),
    ...bereichsKarten,
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📝 Notizen & Abwägungen'),
      el('span', { id: 'kria-hinweis-notizen', style: HINWEIS_STIL }, KINDER_HINWEIS),
      notizFeld),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, 'Bericht (Anlage für Antrag, Beschaffung oder Träger-Beschluss)'),
      berichtsFeld,
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--klein',
          onclick: () => berichtHerunterladen(berichtsFeld.value),
        }, '💾 Als Datei speichern'),
        el('button', {
          class: 'k-knopf k-knopf--klein',
          onclick: (ev) => {
            berichtsFeld.select();
            navigator.clipboard?.writeText(berichtsFeld.value);
            ev.target.textContent = '✔️ Kopiert!';
          },
        }, '📋 Bericht kopieren'),
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein',
          onclick: () => {
            localStorage.removeItem(STATUS_SCHLUESSEL);
            localStorage.removeItem(NOTIZ_SCHLUESSEL);
            render();
          },
        }, '🧹 Alles zurücksetzen (Daten löschen)'))),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · Daten bleiben auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
