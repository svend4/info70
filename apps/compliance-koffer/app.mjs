// Compliance-Koffer (für Betreiber, docs/09 Ось D Nr. 232).
// Export/Import nach dem Klassen-Koffer-Muster: Berichte der Prüfwerkzeuge
// einfügen oder per Datei importieren, in EINE Audit-Datei bündeln und als
// Gesamtbericht drucken. Politik docs/02: keine externen Anfragen; lokal.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { WERKZEUGE, packeKoffer, pruefeKoffer, fortschritt, gesamtbericht } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'compliance.koffer';
const app = document.getElementById('app');

const lade = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{"angebot":"","texte":{}}');
const speichere = (s) => localStorage.setItem(SCHLUESSEL, JSON.stringify(s));
const stand = () => { try { return new Date().toLocaleDateString('de-DE'); } catch { return ''; } };

function aktuellerKoffer() {
  const s = lade();
  const eintraege = WERKZEUGE.map((w) => ({ werkzeug: w.id, text: s.texte[w.id] ?? '' }));
  return packeKoffer(s.angebot, eintraege, stand());
}

function download(name, text, typ) {
  const url = URL.createObjectURL(new Blob([text], { type: `${typ};charset=utf-8` }));
  const a = el('a', { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url);
}

function importiereDatei(datei) {
  const leser = new FileReader();
  leser.onload = () => {
    let inhalt;
    try { inhalt = JSON.parse(String(leser.result)); } catch { alert('Datei ist kein gültiges JSON.'); return; }
    const fehler = pruefeKoffer(inhalt);
    if (fehler.length) { alert('Import nicht möglich:\n' + fehler.join('\n')); return; }
    const s = lade();
    s.angebot = inhalt.angebot ?? s.angebot;
    for (const b of inhalt.berichte) s.texte[b.werkzeug] = b.text;
    speichere(s);
    render();
  };
  leser.readAsText(datei);
}

function render() {
  const s = lade();
  const koffer = aktuellerKoffer();
  const f = fortschritt(koffer);

  // Eingabehinweis am Feld (Freitext): sichtbar, als eigenes Element direkt vor dem Feld; das Feld
  // verweist per aria-describedby darauf. Im Druck ausgeblendet (druck.css, Klasse cok-hinweis).
  const KINDER_HINWEIS = 'Keine Namen von Kindern eingeben.';
  const hinweisStil = 'display:block;font-size:0.85rem;color:#4b5563;margin:0.2rem 0';

  const angebotFeld = el('input', {
    type: 'text', value: s.angebot ?? '', placeholder: 'Name des Angebots',
    'aria-label': 'Name des Angebots',
    'aria-describedby': 'cok-hinweis-angebot',
    style: 'width:100%;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem',
    oninput: (ev) => { const cur = lade(); cur.angebot = ev.target.value; speichere(cur); },
  });

  const werkzeugKarten = WERKZEUGE.map((w) => {
    const feld = el('textarea', {
      placeholder: `Bericht aus „${w.name}“ hier einfügen …`,
      style: 'width:100%;min-height:5rem;font-family:monospace;font-size:0.78rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.4rem',
      'aria-label': `Bericht ${w.name}`,
      'aria-describedby': `cok-hinweis-${w.id}`,
      oninput: (ev) => { const cur = lade(); cur.texte[w.id] = ev.target.value; speichere(cur); aktualisiereGesamt(); zaehlerNeu(); },
    });
    feld.value = s.texte[w.id] ?? '';
    const dateiInput = el('input', {
      type: 'file', accept: '.txt,text/plain', style: 'display:none',
      onchange: (ev) => {
        const d = ev.target.files?.[0]; if (!d) return;
        const leser = new FileReader();
        leser.onload = () => { const cur = lade(); cur.texte[w.id] = String(leser.result); speichere(cur); render(); };
        leser.readAsText(d);
      },
    });
    const gefuellt = (s.texte[w.id] ?? '').trim().length > 0;
    return el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1rem' }, `${gefuellt ? '✔️' : '◻️'} ${w.name}`),
      el('small', { style: 'color:#6b7280' }, w.bezug),
      el('span', { id: `cok-hinweis-${w.id}`, class: 'cok-hinweis', style: hinweisStil }, KINDER_HINWEIS),
      feld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => dateiInput.click() }, '📂 .txt importieren'),
        dateiInput));
  });

  const gesamtFeld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:14rem;font-family:monospace;font-size:0.78rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': 'Gesamtbericht',
  });
  function aktualisiereGesamt() { gesamtFeld.value = gesamtbericht(aktuellerKoffer()); }
  aktualisiereGesamt();

  const zaehler = el('p', { style: 'margin-top:0' }, `Enthaltene Prüfwerkzeuge: ${f.vorhanden}/${f.gesamt}`);
  function zaehlerNeu() { const ff = fortschritt(aktuellerKoffer()); zaehler.textContent = `Enthaltene Prüfwerkzeuge: ${ff.vorhanden}/${ff.gesamt}`; }

  const kofferImport = el('input', {
    type: 'file', accept: '.json,application/json', style: 'display:none',
    onchange: (ev) => { const d = ev.target.files?.[0]; if (d) importiereDatei(d); },
  });

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧳 Compliance-Koffer'),
    el('p', { class: 'k-untertitel' }, 'Alle Prüfberichte in eine Audit-Mappe bündeln – für Fördergeber und Aufsicht (für Betreiber)'),
    el('section', { class: 'k-karte' },
      zaehler,
      el('p', { style: 'font-size:0.9rem;margin:0.3rem 0' }, 'Füge die Berichte deiner Prüfwerkzeuge ein (oder importiere sie als .txt). Speichere den Koffer als .json und lade ihn später wieder – ganz ohne Server.'),
      el('label', { style: 'font-weight:600;font-size:0.9rem' }, 'Angebot:'),
      el('span', { id: 'cok-hinweis-angebot', class: 'cok-hinweis', style: hinweisStil }, KINDER_HINWEIS),
      angebotFeld),
    ...werkzeugKarten,
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, 'Koffer & Gesamtbericht'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => download('compliance-koffer.json', JSON.stringify(aktuellerKoffer(), null, 2), 'application/json') }, '💾 Koffer speichern (.json)'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => kofferImport.click() }, '📂 Koffer laden (.json)'),
        kofferImport),
      gesamtFeld,
      // Ein <textarea> druckt nur seinen sichtbaren Ausschnitt - der
      // Gesamtbericht steht darum zusaetzlich in einem <pre> fuer den Druck.
      el('pre', { class: 'cok-nur-druck' }, gesamtFeld.value),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => download('compliance-gesamtbericht.txt', gesamtFeld.value, 'text/plain') }, '💾 Gesamtbericht (.txt)'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, '🖨️ Drucken'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { if (confirm('Ganzen Koffer leeren?')) { localStorage.removeItem(SCHLUESSEL); render(); } } }, '🧹 Leeren'))),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · kein Rechtsrat · Daten bleiben auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
