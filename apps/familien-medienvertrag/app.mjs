// Familien-Medienvertrag: Eltern UND Kind stellen aus Regel-Bausteinen
// gemeinsam einen Vertrag zusammen und unterschreiben beide. Zielgruppe:
// Eltern + Kind (6-12) zusammen am Tisch. Konzept aus docs/09 (Idee Nr. 25);
// absorbiert die Mediennutzungsvertrag-Variante rund um takt-pause.
// Politik docs/02: keine externen Anfragen (CSP + NetzwerkWaechter); nur der
// Regel-Entwurf liegt in localStorage ('fmv.entwurf'), löschbar per Knopf.
// Bewusst NICHT gespeichert werden die Vornamen der Parteien - sie leben nur
// in der laufenden Sitzung für den Ausdruck (Datensparsamkeit, keine
// personenbezogenen Daten auf dem Gerät).
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { sammleVertrag } from './vertrag.mjs';

installiereNetzwerkWaechter();

const ENTWURF_SCHLUESSEL = 'fmv.entwurf';
const app = document.getElementById('app');
const daten = await fetch('daten/regeln.json').then((r) => r.json());

const INTRO = 'Ein Vertrag über Handy, Tablet und Computer - nicht von oben bestimmt, sondern gemeinsam gemacht. Sucht zusammen Regeln aus. Wichtig: Es gibt Regeln fürs Kind, aber auch Regeln für die Eltern. Am Ende unterschreiben alle. Selbst ausgesuchte Regeln hält man viel lieber ein.';

// --- Zustand -----------------------------------------------------------------
// Persistiert wird nur die Regel-Auswahl + eigene Regeln, keine Namen.
const ladeEntwurf = () => {
  const roh = JSON.parse(localStorage.getItem(ENTWURF_SCHLUESSEL) ?? 'null');
  return roh && typeof roh === 'object'
    ? { ausgewaehlt: roh.ausgewaehlt ?? {}, eigene: Array.isArray(roh.eigene) ? roh.eigene : [] }
    : { ausgewaehlt: {}, eigene: [] };
};
const speichereEntwurf = () => localStorage.setItem(ENTWURF_SCHLUESSEL, JSON.stringify(entwurf));

let entwurf = ladeEntwurf();
let kindName = ''; // nur im Speicher der Seite, nie in localStorage
let elternName = '';
let neueRegel = ''; // Puffer des Freitextfeldes über Re-Renders hinweg

const eingabeStil = 'width:100%;font:inherit;padding:0.6rem;border-radius:0.5rem;border:2px solid var(--k-rand);background:#fff;margin-top:0.25rem';
const feldStil = 'display:block;font-weight:600;margin-top:0.75rem';

// Die Vertrags-Vorschau wird bei Namens-Eingaben allein aktualisiert (ohne
// vollen Re-Render), damit der Fokus im Textfeld nicht verloren geht.
let vorschauKnoten = null;
const aktualisiereVorschau = () => vorschauKnoten?.replaceChildren(...vertragInhalt());

// --- Bausteine ---------------------------------------------------------------
function kategorieKarte(kat) {
  return el('section', { class: 'k-karte fmv-nur-bildschirm' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `${kat.emoji ?? ''} ${kat.name}`),
    ...kat.regeln.map((r) => {
      const box = el('input', {
        type: 'checkbox',
        id: `fmv-${r.id}`,
        style: 'width:3rem;height:3rem;flex-shrink:0',
      });
      box.checked = Boolean(entwurf.ausgewaehlt[r.id]);
      box.addEventListener('change', () => {
        entwurf.ausgewaehlt[r.id] = box.checked;
        speichereEntwurf();
        render();
      });
      return el('div', { style: 'display:flex;gap:0.6rem;align-items:center;padding:0.4rem 0' },
        box,
        el('label', { for: `fmv-${r.id}` }, r.text));
    }),
    el('button', {
      class: 'k-knopf k-knopf--neutral k-knopf--klein',
      onclick: () => vorlesen(`${kat.name}. ${kat.regeln.map((r) => r.text).join(' ')}`),
    }, '🔊 Vorlesen'));
}

function eigeneRegelKarte() {
  const feld = el('input', {
    type: 'text',
    maxlength: '160',
    placeholder: 'z. B. Am Wochenende darf ich 30 Minuten länger',
    style: eingabeStil,
    'aria-label': 'Eigene Regel eingeben',
  });
  feld.value = neueRegel;
  feld.addEventListener('input', () => { neueRegel = feld.value; });
  const hinzu = () => {
    const text = feld.value.trim();
    if (!text) return;
    entwurf.eigene.push(text);
    neueRegel = '';
    speichereEntwurf();
    render();
  };
  feld.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); hinzu(); } });

  return el('section', { class: 'k-karte fmv-nur-bildschirm' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '✏️ Eigene Regel'),
    el('p', { style: 'margin:0 0 0.25rem;font-size:0.9rem' }, 'Fällt euch noch etwas ein? Schreibt eure eigene Regel dazu.'),
    el('div', { class: 'k-hinweis', style: 'margin-bottom:0.75rem' },
      el('p', { style: 'margin:0;font-size:0.9rem' }, '⚠️ Bitte nur Vornamen benutzen - keine Nachnamen, Adressen oder Telefonnummern.')),
    feld,
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--klein', onclick: hinzu }, '➕ Regel hinzufügen')),
    entwurf.eigene.length
      ? el('ul', { style: 'margin:1rem 0 0;padding-left:1.2rem' },
          ...entwurf.eigene.map((text, i) =>
            el('li', { style: 'margin:0.35rem 0' },
              el('span', {}, text), ' ',
              el('button', {
                class: 'k-knopf k-knopf--neutral k-knopf--klein',
                style: 'min-height:2rem;padding:0.2rem 0.6rem',
                'aria-label': `Eigene Regel entfernen: ${text}`,
                onclick: () => { entwurf.eigene.splice(i, 1); speichereEntwurf(); render(); },
              }, '✕'))))
      : '');
}

function nameFeld(beschriftung, wert, setzeWert) {
  const feld = el('input', {
    type: 'text',
    maxlength: '40',
    placeholder: 'optional',
    style: eingabeStil,
    'aria-label': beschriftung,
  });
  feld.value = wert;
  feld.addEventListener('input', () => { setzeWert(feld.value); aktualisiereVorschau(); });
  return el('label', { style: feldStil }, beschriftung, feld);
}

function parteienKarte() {
  return el('section', { class: 'k-karte fmv-nur-bildschirm' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '✍️ Wer unterschreibt?'),
    el('div', { class: 'k-hinweis', style: 'margin-bottom:0.5rem' },
      el('p', { style: 'margin:0;font-size:0.9rem' }, '⚠️ Nur Vornamen! Die Namen werden nicht gespeichert - sie erscheinen nur auf dem Ausdruck.')),
    nameFeld('Vorname Kind', kindName, (v) => { kindName = v; }),
    nameFeld('Vorname Eltern', elternName, (v) => { elternName = v; }));
}

// --- Vertrags-Vorschau (druckbar) -------------------------------------------
function unterschriftBlock(rolle, name) {
  return el('div', { style: 'margin-top:1.5rem' },
    el('div', { class: 'fmv-linie' }),
    el('p', { style: 'margin:0.3rem 0 0;font-size:0.85rem' },
      `Unterschrift ${rolle}${name ? ` (${name})` : ''}`),
    el('div', { class: 'fmv-linie', style: 'max-width:14rem;margin-top:1rem' }),
    el('p', { style: 'margin:0.3rem 0 0;font-size:0.85rem' }, 'Ort, Datum'));
}

function vertragInhalt() {
  const { abschnitte, eigene, anzahl } = sammleVertrag(daten, entwurf.ausgewaehlt, entwurf.eigene);
  const knoten = [
    el('h2', { style: 'margin-top:0;text-align:center' }, '📜 Unser Familien-Medienvertrag'),
    el('p', { style: 'text-align:center;margin:0 0 1rem' },
      `Zwischen ${kindName || '________'} (Kind) und ${elternName || '________'} (Eltern).`),
  ];

  if (anzahl === 0) {
    knoten.push(el('div', { class: 'k-hinweis fmv-nur-bildschirm' },
      el('p', { style: 'margin:0' }, 'Noch keine Regel ausgewählt. Hakt oben eure Regeln an - denkt an Regeln fürs Kind UND für die Eltern.')));
    return knoten;
  }

  for (const abschnitt of abschnitte) {
    if (!abschnitt.regeln.length) continue;
    knoten.push(
      el('h3', { style: 'margin:1rem 0 0.25rem;font-size:1.05rem' }, `${abschnitt.emoji ?? ''} ${abschnitt.name}`),
      el('ul', { style: 'margin:0;padding-left:1.3rem' },
        ...abschnitt.regeln.map((t) => el('li', { style: 'margin:0.3rem 0' }, t))));
  }
  if (eigene.length) {
    knoten.push(
      el('h3', { style: 'margin:1rem 0 0.25rem;font-size:1.05rem' }, '✏️ Unsere eigenen Regeln'),
      el('ul', { style: 'margin:0;padding-left:1.3rem' },
        ...eigene.map((t) => el('li', { style: 'margin:0.3rem 0' }, t))));
  }

  knoten.push(
    el('p', { style: 'margin:1.25rem 0 0;font-weight:600' }, 'Wir haben diese Regeln gemeinsam ausgesucht und wollen uns daran halten. Wenn etwas nicht passt, reden wir darüber und ändern es zusammen.'),
    el('div', { style: 'display:flex;gap:1.5rem;flex-wrap:wrap' },
      el('div', { style: 'flex:1;min-width:12rem' }, unterschriftBlock('Kind', kindName)),
      el('div', { style: 'flex:1;min-width:12rem' }, unterschriftBlock('Eltern', elternName))));
  return knoten;
}

// --- Render ------------------------------------------------------------------
function render() {
  vorschauKnoten = el('section', { class: 'k-karte fmv-vertrag' }, ...vertragInhalt());

  app.replaceChildren(
    el('h1', { class: 'k-titel fmv-nur-bildschirm' }, '📜 Familien-Medienvertrag'),
    el('p', { class: 'k-untertitel fmv-nur-bildschirm' }, 'Regeln gemeinsam machen - und alle unterschreiben.'),
    el('section', { class: 'k-karte fmv-nur-bildschirm' },
      el('p', { style: 'margin-top:0' }, INTRO),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(INTRO) }, '🔊 Vorlesen')),
    ...daten.kategorien.map(kategorieKarte),
    eigeneRegelKarte(),
    parteienKarte(),
    el('h2', { class: 'k-untertitel fmv-nur-bildschirm', style: 'font-weight:700;margin-top:0.5rem' }, '👀 So sieht euer Vertrag aus'),
    vorschauKnoten,
    el('section', { class: 'k-karte fmv-nur-bildschirm' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Vertrag drucken / als PDF speichern'),
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein',
          onclick: () => {
            if (!confirm('Auswahl und eigene Regeln wirklich löschen?')) return;
            localStorage.removeItem(ENTWURF_SCHLUESSEL);
            entwurf = { ausgewaehlt: {}, eigene: [] };
            kindName = '';
            elternName = '';
            neueRegel = '';
            render();
          },
        }, '🧹 Alle Daten löschen')),
      el('p', { style: 'margin:0.75rem 0 0;font-size:0.85rem;color:#4b5563' }, 'Beim Drucken erscheint nur der Vertrag. Gespeichert wird nur eure Regel-Auswahl auf diesem Gerät - keine Namen.')),
    el('footer', { class: 'k-fuss fmv-nur-bildschirm' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
