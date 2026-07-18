// Seitenstark-Qualitäts-Check: Selbst-Check für Betreiber entlang der
// Seitenstark-Qualitätsmerkmale (docs/09 Nr. 156). Zweites Content-Pack auf
// der Kriterien-Check-/fragFINN-Selbsttest-Engine. Besonderheit: das Ergebnis
// ist ein exportierbarer MASSNAHMENPLAN (offene Punkte → konkrete Schritte).
// Politik docs/02: keine externen Anfragen; Haken + Plan bleiben lokal.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const STATUS_SCHLUESSEL = 'ssqc.status';
const app = document.getElementById('app');
const daten = await fetch('daten/kriterien.json').then((r) => r.json());
const ALLE = daten.bereiche.flatMap((b) => b.kriterien);

const ladeStatus = () => JSON.parse(localStorage.getItem(STATUS_SCHLUESSEL) ?? '{}');
const speichereStatus = (s) => localStorage.setItem(STATUS_SCHLUESSEL, JSON.stringify(s));

function massnahmenplan(status) {
  const erfuellt = ALLE.filter((k) => status[k.id]).length;
  const zeilen = [
    'Seitenstark-Qualitäts-Check – Maßnahmenplan',
    `Grundlage: ${daten.quelle}`,
    `Stand: ${new Date().toLocaleDateString('de-DE')}`,
    `Erfüllt: ${erfuellt} von ${ALLE.length}`,
    '',
  ];
  const offen = daten.bereiche
    .map((b) => ({ b, liste: b.kriterien.filter((k) => !status[k.id]) }))
    .filter((x) => x.liste.length);
  if (offen.length) {
    zeilen.push('## Offene Punkte – als Nächstes umsetzen');
    for (const { b, liste } of offen) {
      zeilen.push(`### ${b.name}`);
      for (const k of liste) {
        zeilen.push(`- [ ] ${k.text}`);
        zeilen.push(`      → ${k.hilfe} (${k.bezug})`);
      }
      zeilen.push('');
    }
  } else {
    zeilen.push('Alle Qualitätsmerkmale erfüllt. Regelmäßig überprüfen.', '');
  }
  zeilen.push('## Bereits erfüllt');
  for (const b of daten.bereiche) {
    for (const k of b.kriterien) if (status[k.id]) zeilen.push(`[x] ${k.text} (${b.name})`);
  }
  zeilen.push('', 'Hinweis: Selbst-Check, kein offizielles Seitenstark-Ergebnis.');
  return zeilen.join('\n');
}

function planHerunterladen(text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = el('a', { href: url, download: 'seitenstark-massnahmenplan.txt' });
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
        const eingabe = el('input', { type: 'checkbox', id: `ss-${k.id}`, style: 'width:1.5rem;height:1.5rem;flex-shrink:0;margin-top:0.15rem' });
        eingabe.checked = Boolean(status[k.id]);
        eingabe.addEventListener('change', () => { const s = ladeStatus(); s[k.id] = eingabe.checked; speichereStatus(s); render(); });
        return el('div', { style: 'padding:0.4rem 0' },
          el('div', { style: 'display:flex;gap:0.6rem;align-items:flex-start' },
            eingabe,
            el('label', { for: `ss-${k.id}` },
              el('span', {}, k.text),
              el('small', { style: 'display:block;color:#4b5563' }, k.bezug))),
          el('details', { style: 'margin:0.25rem 0 0 2.1rem' },
            el('summary', { style: 'cursor:pointer;font-size:0.85rem;color:var(--k-blau-dunkel)' }, '💡 Was Seitenstark hier erwartet'),
            el('p', { style: 'font-size:0.85rem;margin:0.3rem 0 0;color:#374151' }, k.hilfe)));
      }));
  });

  const planFeld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:13rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': 'Maßnahmenplan',
  });
  planFeld.value = massnahmenplan(status);

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '⭐ Seitenstark-Qualitäts-Check'),
    el('p', { class: 'k-untertitel' }, 'Die Seitenstark-Qualitätsmerkmale prüfen – mit Maßnahmenplan für offene Punkte (für Betreiber)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `Erfüllt: ${erfuellt} von ${ALLE.length} Merkmalen (${anteil} %)`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': ALLE.length, 'aria-valuenow': erfuellt },
        el('div', { style: `width:${anteil}%` })),
      el('p', { style: 'font-size:0.9rem;margin-bottom:0' }, daten.hinweis)),
    ...bereichsKarten,
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📋 Maßnahmenplan (offene Punkte zuerst)'),
      planFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => planHerunterladen(planFeld.value) }, '💾 Als Datei speichern'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { planFeld.select(); navigator.clipboard?.writeText(planFeld.value); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 Kopieren'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(STATUS_SCHLUESSEL); render(); } }, '🧹 Zurücksetzen'))),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · Daten bleiben auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
