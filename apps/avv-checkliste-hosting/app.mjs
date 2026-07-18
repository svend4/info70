// AVV-Checkliste Hosting (für Betreiber, docs/09 Nr. 174). Checkliste zur
// Prüfung eines Hosting-Anbieters und AV-Vertrags (Art. 28 DSGVO) mit
// kinderspezifischen Verschärfungen. Ergebnis: Lücken-Bericht als
// Entscheidungshilfe. Content-Pack auf der Kriterien-Check-Engine.
// Politik docs/02: keine externen Anfragen; Haken + Bericht bleiben lokal.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const STATUS_SCHLUESSEL = 'avv.status';
const app = document.getElementById('app');
const daten = await fetch('daten/kriterien.json').then((r) => r.json());
const ALLE = daten.bereiche.flatMap((b) => b.kriterien);

const ladeStatus = () => JSON.parse(localStorage.getItem(STATUS_SCHLUESSEL) ?? '{}');
const speichereStatus = (s) => localStorage.setItem(STATUS_SCHLUESSEL, JSON.stringify(s));

function lueckenBericht(status) {
  const erfuellt = ALLE.filter((k) => status[k.id]).length;
  const zeilen = [
    'AVV-Checkliste Hosting – Lücken-Bericht',
    `Grundlage: ${daten.quelle}`,
    `Stand: ${new Date().toLocaleDateString('de-DE')}`,
    `Erfüllt: ${erfuellt} von ${ALLE.length}`,
    '',
  ];
  const offen = daten.bereiche
    .map((b) => ({ b, liste: b.kriterien.filter((k) => !status[k.id]) }))
    .filter((x) => x.liste.length);
  if (offen.length) {
    zeilen.push('## Lücken – vor Vertragsschluss klären');
    for (const { b, liste } of offen) {
      zeilen.push(`### ${b.name}`);
      for (const k of liste) zeilen.push(`- [ ] ${k.text} (${k.bezug})`);
      zeilen.push('');
    }
  } else {
    zeilen.push('Keine Lücken. Der Anbieter erfüllt die geprüften Anforderungen.', '');
  }
  zeilen.push('## Bereits bestätigt');
  for (const b of daten.bereiche) for (const k of b.kriterien) if (status[k.id]) zeilen.push(`[x] ${k.text} (${b.name})`);
  zeilen.push('', 'Hinweis: Entscheidungshilfe, keine Rechtsberatung. Vor Vertragsschluss ggf. Datenschutzbeauftragte einbinden.');
  return zeilen.join('\n');
}

function berichtHerunterladen(text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = el('a', { href: url, download: 'avv-checkliste-luecken.txt' });
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
        const eingabe = el('input', { type: 'checkbox', id: `avv-${k.id}`, style: 'width:1.5rem;height:1.5rem;flex-shrink:0;margin-top:0.15rem' });
        eingabe.checked = Boolean(status[k.id]);
        eingabe.addEventListener('change', () => { const s = ladeStatus(); s[k.id] = eingabe.checked; speichereStatus(s); render(); });
        return el('div', { style: 'padding:0.4rem 0' },
          el('div', { style: 'display:flex;gap:0.6rem;align-items:flex-start' },
            eingabe,
            el('label', { for: `avv-${k.id}` },
              el('span', {}, k.text),
              el('small', { style: 'display:block;color:#4b5563' }, k.bezug))),
          el('details', { style: 'margin:0.25rem 0 0 2.1rem' },
            el('summary', { style: 'cursor:pointer;font-size:0.85rem;color:var(--k-blau-dunkel)' }, '💡 Worauf achten'),
            el('p', { style: 'font-size:0.85rem;margin:0.3rem 0 0;color:#374151' }, k.hilfe)));
      }));
  });

  const berichtsFeld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:12rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': 'Lücken-Bericht',
  });
  berichtsFeld.value = lueckenBericht(status);

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🗄️ AVV-Checkliste Hosting'),
    el('p', { class: 'k-untertitel' }, 'Hosting-Anbieter & AV-Vertrag nach Art. 28 DSGVO prüfen – Lücken-Bericht als Entscheidungshilfe (für Betreiber)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `Erfüllt: ${erfuellt} von ${ALLE.length} (${anteil} %)`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': ALLE.length, 'aria-valuenow': erfuellt },
        el('div', { style: `width:${anteil}%` })),
      el('p', { style: 'font-size:0.9rem;margin-bottom:0' }, daten.hinweis)),
    ...bereichsKarten,
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, 'Lücken-Bericht'),
      berichtsFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => berichtHerunterladen(berichtsFeld.value) }, '💾 Als Datei speichern'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { berichtsFeld.select(); navigator.clipboard?.writeText(berichtsFeld.value); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 Kopieren'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(STATUS_SCHLUESSEL); render(); } }, '🧹 Zurücksetzen'))),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · Daten bleiben auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
