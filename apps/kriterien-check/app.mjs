// Kriterien-Check: Selbst-Audit für Betreiber*innen von Kinderangeboten.
// Zielgruppe: ERWACHSENE (Betreiber, Redaktionen, Antragstellende).
// Nutzt den maschinenlesbaren Kriterienkatalog aus @info70/kinderschutz -
// dieselbe Quelle, gegen die auch Tests und Doku (docs/02) laufen.
// Der Haken-Stand bleibt lokal; der Bericht dient als Vorbereitung für
// fragFINN-Whitelist-Antrag oder Förder-Nachweis (BzKJ).
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter, KRITERIEN } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const STATUS_SCHLUESSEL = 'kc.status';
const app = document.getElementById('app');

const ladeStatus = () => JSON.parse(localStorage.getItem(STATUS_SCHLUESSEL) ?? '{}');
const speichereStatus = (s) => localStorage.setItem(STATUS_SCHLUESSEL, JSON.stringify(s));

function gruppiert() {
  const gruppen = new Map();
  for (const k of KRITERIEN) {
    const quelle = k.quelle.split(':')[0].trim();
    if (!gruppen.has(quelle)) gruppen.set(quelle, []);
    gruppen.get(quelle).push(k);
  }
  return gruppen;
}

function bericht(status) {
  const zeilen = [
    'Kriterien-Check - Selbst-Audit Kinderangebot',
    `Stand: ${new Date().toLocaleDateString('de-DE')}`,
    `Erfüllt: ${KRITERIEN.filter((k) => status[k.id]).length} von ${KRITERIEN.length}`,
    '',
  ];
  for (const [quelle, liste] of gruppiert()) {
    zeilen.push(`## ${quelle}`);
    for (const k of liste) zeilen.push(`${status[k.id] ? '[x]' : '[ ]'} ${k.text} (${k.quelle})`);
    zeilen.push('');
  }
  return zeilen.join('\n');
}

function render() {
  const status = ladeStatus();
  const erfuellt = KRITERIEN.filter((k) => status[k.id]).length;
  const anteil = Math.round((erfuellt / KRITERIEN.length) * 100);

  const gruppenKarten = [...gruppiert()].map(([quelle, liste]) =>
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, quelle),
      ...liste.map((k) => {
        const eingabe = el('input', {
          type: 'checkbox',
          id: `kc-${k.id}`,
          style: 'width:1.5rem;height:1.5rem;flex-shrink:0;margin-top:0.15rem',
        });
        eingabe.checked = Boolean(status[k.id]);
        eingabe.addEventListener('change', () => {
          const s = ladeStatus();
          s[k.id] = eingabe.checked;
          speichereStatus(s);
          render();
        });
        return el('div', { style: 'padding:0.4rem 0' },
          el('div', { style: 'display:flex;gap:0.6rem;align-items:flex-start' },
            eingabe,
            el('label', { for: `kc-${k.id}` },
              el('span', {}, k.text),
              el('small', { style: 'display:block;color:#4b5563' }, k.quelle))),
          k.hilfe
            ? el('details', { style: 'margin:0.25rem 0 0 2.1rem' },
                el('summary', { style: 'cursor:pointer;font-size:0.85rem;color:var(--k-blau-dunkel)' }, '💡 So prüfst du das'),
                el('p', { style: 'font-size:0.85rem;margin:0.3rem 0 0;color:#374151' }, k.hilfe))
            : '');
      })));

  const berichtsFeld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:12rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': 'Audit-Bericht als Text',
  });
  berichtsFeld.value = bericht(status);

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '✅ Kriterien-Check'),
    el('p', { class: 'k-untertitel' }, 'Selbst-Audit für Betreiber*innen von Kinderangeboten (für Erwachsene)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `Erfüllt: ${erfuellt} von ${KRITERIEN.length} Kriterien (${anteil} %)`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': KRITERIEN.length, 'aria-valuenow': erfuellt },
        el('div', { style: `width:${anteil}%` })),
      el('p', { style: 'margin-bottom:0;font-size:0.9rem' }, 'Grundlage: fragFINN-Kriterienkatalog, BzKJ-Förderkriterien, DSGVO Art. 8 - siehe docs/02-anforderungen.md im Repository. Der Haken-Stand wird nur auf diesem Gerät gespeichert.')),
    ...gruppenKarten,
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, 'Bericht (zum Kopieren, z. B. für fragFINN-Antrag oder Förder-Nachweis)'),
      berichtsFeld,
      el('div', { class: 'k-antworten' },
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
          onclick: () => { localStorage.removeItem(STATUS_SCHLUESSEL); render(); },
        }, '🧹 Zurücksetzen'))),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · Daten bleiben auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
