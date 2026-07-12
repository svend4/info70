// Gruppenklima-Check: Beobachtungs-Checkliste fuer Fachkraefte (Kinder 3-7).
// Bewusst auf GRUPPEN-Ebene: bewertet wird das Klima der Gruppe, NIE einzelne
// Kinder - keine Soziogramme, keine kindbezogenen Daten (Datenschutz-Clou,
// abgeleitet aus dem Praleska-Kapitel zur Kindergesellschaft, docs/10).
// Politik docs/02: keine externen Anfragen, Haken-Stand nur lokal + loeschbar.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const STATUS_SCHLUESSEL = 'gk.status';
const app = document.getElementById('app');
const daten = await fetch('daten/kriterien.json').then((r) => r.json());
const alleAussagen = daten.bereiche.flatMap((b) => b.aussagen);

const ladeStatus = () => JSON.parse(localStorage.getItem(STATUS_SCHLUESSEL) ?? '{}');
const speichere = (s) => localStorage.setItem(STATUS_SCHLUESSEL, JSON.stringify(s));

function bericht(status) {
  const erfuellt = alleAussagen.filter((a) => status[a.id]);
  const offen = alleAussagen.filter((a) => !status[a.id]);
  const zeilen = [
    'Gruppenklima-Check',
    `Stand: ${new Date().toLocaleDateString('de-DE')}`,
    `Erfüllt: ${erfuellt.length} von ${alleAussagen.length}`,
    '',
    'Das läuft schon gut:',
    ...erfuellt.map((a) => `+ ${a.text}`),
    '',
    'Daran arbeiten wir weiter (mit Impuls):',
    ...offen.slice(0, 5).map((a) => `- ${a.text}\n  -> ${a.impuls}`),
    '',
    'Hinweis: Beobachtung des Gruppenklimas, keine Bewertung einzelner Kinder.',
  ];
  return zeilen.join('\n');
}

function render() {
  const status = ladeStatus();
  const erfuellt = alleAussagen.filter((a) => status[a.id]).length;
  const anteil = Math.round((erfuellt / alleAussagen.length) * 100);

  const bereichsKarten = daten.bereiche.map((b) =>
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, b.name),
      ...b.aussagen.map((a) => {
        const eingabe = el('input', { type: 'checkbox', id: `gk-${a.id}`, style: 'width:1.5rem;height:1.5rem;flex-shrink:0;margin-top:0.15rem' });
        eingabe.checked = Boolean(status[a.id]);
        eingabe.addEventListener('change', () => {
          const s = ladeStatus();
          s[a.id] = eingabe.checked;
          speichere(s);
          render();
        });
        return el('div', { style: 'padding:0.4rem 0' },
          el('div', { style: 'display:flex;gap:0.6rem;align-items:flex-start' },
            eingabe,
            el('label', { for: `gk-${a.id}` }, a.text)),
          el('details', { style: 'margin:0.25rem 0 0 2.1rem' },
            el('summary', { style: 'cursor:pointer;font-size:0.85rem;color:var(--k-blau-dunkel)' }, '💡 So stärkst du das'),
            el('p', { style: 'font-size:0.85rem;margin:0.3rem 0 0;color:#374151' }, a.impuls)));
      })));

  const berichtsFeld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:12rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': 'Klima-Bericht als Text',
  });
  berichtsFeld.value = bericht(status);

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🌱 Gruppenklima-Check'),
    el('p', { class: 'k-untertitel' }, 'Wie fühlt sich die Gruppe? Eine Beobachtungshilfe für Fachkräfte'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `Erfüllt: ${erfuellt} von ${alleAussagen.length} (${anteil} %)`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': alleAussagen.length, 'aria-valuenow': erfuellt },
        el('div', { style: `width:${anteil}%` })),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'margin:0;font-size:0.9rem' }, '🔒 Wichtig: Hier werden keine Kinder bewertet und keine Namen gespeichert. Beobachtet wird das Klima der GRUPPE - nicht einzelne Kinder, keine Soziogramme.'))),
    ...bereichsKarten,
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, 'Klima-Bericht (zum Kopieren, z. B. fürs Team)'),
      berichtsFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { berichtsFeld.select(); navigator.clipboard?.writeText(berichtsFeld.value); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 Bericht kopieren'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(STATUS_SCHLUESSEL); render(); } }, '🧹 Zurücksetzen'))),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Fachkräfte · keine kindbezogenen Daten · '),
      el('a', { href: 'eltern.html' }, 'ℹ️ Für Träger & Leitung'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
