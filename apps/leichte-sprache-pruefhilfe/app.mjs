// Leichte-Sprache-Prüfhilfe (für Betreiber/Redaktion, docs/09 Ось D Nr. 222).
// Regelbasierte lokale Textanalyse: Text einfügen, messbare Regeln prüfen
// (Satzlänge, Wortlänge, Passiv-Signale, Nominalstil, Fremdwörter) mit
// Umformulierungs-Hinweisen. Keine KI, keine externen Anfragen (docs/02).
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { analysiere, bericht } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'lspruef.text';
// Eingabehinweis am Textfeld (Freitext): sichtbar, als eigenes Element direkt vor dem Feld; das Feld
// verweist per aria-describedby darauf. Die App hat keine Druckfassung, der Hinweis bleibt also überall stehen.
const KINDER_HINWEIS = 'Keine Namen von Kindern eingeben.';
const HINWEIS_STIL = 'display:block;font-size:0.85rem;color:#4b5563;margin:0.2rem 0';
const app = document.getElementById('app');
const regeln = await fetch('daten/regeln.json').then((r) => r.json());

const AMPEL = {
  gruen: ['🟢', 'gut lesbar', '#dcfce7'],
  gelb: ['🟡', 'einige Hinweise', '#fef3c7'],
  rot: ['🔴', 'schwer lesbar', '#fee2e2'],
  grau: ['⚪', 'kein Text', '#f3f4f6'],
};

function berichtHerunterladen(text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = el('a', { href: url, download: 'leichte-sprache-bericht.txt' });
  a.click();
  URL.revokeObjectURL(url);
}

function trefferKarte(titel, emoji, eintraege, formatiere) {
  if (!eintraege.length) return null;
  return el('details', { class: 'k-karte', style: 'margin:0.5rem 0' },
    el('summary', { style: 'cursor:pointer;font-weight:600' }, `${emoji} ${titel} (${eintraege.length})`),
    el('ul', { style: 'margin:0.5rem 0 0;padding-inline-start:1.2rem;font-size:0.9rem' },
      ...eintraege.map((e) => el('li', { style: 'margin:0.2rem 0' }, formatiere(e)))));
}

function render() {
  const gespeichert = localStorage.getItem(SCHLUESSEL) ?? '';

  const feld = el('textarea', {
    placeholder: 'Text hier einfügen …',
    style: 'width:100%;min-height:9rem;font-size:1rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.6rem',
    'aria-label': 'Zu prüfender Text',
    'aria-describedby': 'lsp-hinweis-text',
    oninput: (ev) => { localStorage.setItem(SCHLUESSEL, ev.target.value); zeigeErgebnis(ev.target.value); },
  });
  feld.value = gespeichert;

  const ergebnis = el('div', { id: 'ergebnis' });

  function zeigeErgebnis(text) {
    const a = analysiere(text, regeln);
    const [sym, label, farbe] = AMPEL[a.ampel];
    const k = a.kennzahlen;

    const kopf = el('section', { class: 'k-karte', style: `background:${farbe}` },
      el('p', { style: 'margin:0;font-weight:700;font-size:1.1rem' }, `${sym} ${label}`),
      a.leer ? el('p', { style: 'margin:0.3rem 0 0;font-size:0.9rem' }, 'Bitte oben einen Text einfügen.')
        : el('p', { style: 'margin:0.3rem 0 0;font-size:0.9rem' },
            `Sätze: ${k.saetze} · Wörter: ${k.woerter} · Ø Satzlänge: ${k.schnittSatzlaenge} Wörter · lange Sätze: ${k.langeSaetze} · lange Wörter: ${k.langeWoerter} · Passiv: ${k.passiv} · Nominalstil: ${k.nominalstil} · Fremdwörter: ${k.fremdwoerter}`));

    const hinweise = a.hinweise.length
      ? el('section', { class: 'k-karte' },
          el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '💡 Umformulierungs-Hinweise'),
          el('ul', { style: 'margin:0;padding-inline-start:1.2rem;font-size:0.92rem' },
            ...a.hinweise.map((h) => el('li', { style: 'margin:0.25rem 0' }, `(${h.anzahl}×) ${h.text}`))))
      : (a.leer ? null : el('section', { class: 'k-karte' }, el('p', { style: 'margin:0' }, '✅ Keine Regel-Treffer. Der Text wirkt gut lesbar.')));

    const bloecke = [
      trefferKarte('Zu lange Sätze', '📏', a.langeSaetze, (s) => `(${s.anzahl} Wörter) ${s.satz}`),
      trefferKarte('Zu lange Wörter', '🔤', a.langeWoerter, (w) => `${w.wort} (${w.laenge} Zeichen)`),
      trefferKarte('Passiv-Signale', '🌀', a.passiv, (p) => `„${p.signal}“ – ${p.satz}`),
      trefferKarte('Nominalstil-Kandidaten', '🧱', a.nominalstil, (w) => w),
      trefferKarte('Fremdwörter', '🌍', a.fremdwoerter, (f) => `${f.wort} → ${f.einfach}`),
    ].filter(Boolean);

    const aktionen = a.leer ? null : el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--klein', onclick: () => berichtHerunterladen(bericht(text, regeln)) }, '💾 Bericht speichern'),
      el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { navigator.clipboard?.writeText(bericht(text, regeln)); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 Bericht kopieren'));

    ergebnis.replaceChildren(kopf, ...(hinweise ? [hinweise] : []), ...bloecke, ...(aktionen ? [aktionen] : []));
  }

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧩 Leichte-Sprache-Prüfhilfe'),
    el('p', { class: 'k-untertitel' }, 'Text regelbasiert auf Leichte/Einfache Sprache prüfen (lokal, ohne KI)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0;font-size:0.92rem' }, regeln.hinweis),
      el('span', { id: 'lsp-hinweis-text', style: HINWEIS_STIL }, KINDER_HINWEIS),
      feld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); render(); } }, '🧹 Text löschen'))),
    ergebnis,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · regelbasiert, keine KI · Text bleibt auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));

  zeigeErgebnis(gespeichert);
}

render();
