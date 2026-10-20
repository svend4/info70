// BFSG-Check fuer Kinderseiten (fuer ERWACHSENE/Betreiber).
// kriterien-check-Pack (BFSG/WCAG) + eingebauter Offline-Kontrast-Rechner
// (docs/09 Nr. 61). Export als Pruefprotokoll fuer die Barrierefreiheits-
// erklaerung. Politik docs/02: keine externen Anfragen; alles lokal.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { kontrast, wcagStufe } from './logik.mjs';

installiereNetzwerkWaechter();

const STATUS_SCHLUESSEL = 'bfsg.status';
const app = document.getElementById('app');
const daten = await fetch('daten/kriterien.json').then((r) => r.json());
const ALLE = daten.bereiche.flatMap((b) => b.kriterien);

// Kontrast-Rechner-Zustand (nur im Speicher).
let vg = '#222222';
let hg = '#ffffff';
let gross = false;

const ladeStatus = () => JSON.parse(localStorage.getItem(STATUS_SCHLUESSEL) ?? '{}');
const speichereStatus = (s) => localStorage.setItem(STATUS_SCHLUESSEL, JSON.stringify(s));

function protokoll(status) {
  const erfuellt = ALLE.filter((k) => status[k.id]).length;
  const zeilen = ['BFSG-Check – Prüfprotokoll (für die Barrierefreiheitserklärung)', `Grundlage: ${daten.quelle}`, `Stand: ${new Date().toLocaleDateString('de-DE')}`, `Erfüllt: ${erfuellt} von ${ALLE.length}`, ''];
  for (const b of daten.bereiche) {
    zeilen.push(`## ${b.name}`);
    for (const k of b.kriterien) zeilen.push(`${status[k.id] ? '[x]' : '[ ]'} ${k.text} (${k.bezug})`);
    zeilen.push('');
  }
  zeilen.push('Hinweis: Selbstprüfung, kein offizielles Testat.');
  return zeilen.join('\n');
}

function render() {
  const status = ladeStatus();
  const erfuellt = ALLE.filter((k) => status[k.id]).length;
  const anteil = Math.round((erfuellt / ALLE.length) * 100);
  const verh = kontrast(vg, hg);
  const bewertung = wcagStufe(verh, gross);

  const farbfeld = (wert, setzen, label) => {
    const text = el('input', { type: 'text', value: wert, maxlength: '7', 'aria-label': `${label} als Hex`, style: 'width:6rem;min-height:44px;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0 0.5rem;font-family:monospace' });
    const farbe = el('input', { type: 'color', value: /^#[0-9a-fA-F]{6}$/.test(wert) ? wert : '#000000', 'aria-label': `${label} auswählen`, style: 'width:44px;height:44px;border:none;background:none;padding:0' });
    text.addEventListener('input', () => { setzen(text.value); render(); });
    farbe.addEventListener('input', () => { setzen(farbe.value); render(); });
    return el('div', { style: 'display:flex;gap:0.4rem;align-items:center' }, el('span', { style: 'width:5.5rem' }, label), text, farbe);
  };

  const rechner = el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🎨 Kontrast-Rechner (offline)'),
    farbfeld(vg, (v) => { vg = v; }, 'Text:'),
    el('div', { style: 'height:0.4rem' }),
    farbfeld(hg, (v) => { hg = v; }, 'Hintergrund:'),
    el('div', { style: 'display:flex;gap:0.5rem;align-items:center;margin:0.5rem 0' },
      (() => { const b = el('input', { type: 'checkbox', id: 'bfsg-gross', style: 'width:3rem;height:3rem;flex-shrink:0' }); b.checked = gross; b.addEventListener('change', () => { gross = b.checked; render(); }); return b; })(),
      el('label', { for: 'bfsg-gross' }, 'große Schrift (ab ~18pt / 14pt fett)')),
    el('div', { style: `border-radius:0.5rem;padding:0.8rem;text-align:center;color:${/^#[0-9a-fA-F]{6}$/.test(vg) ? vg : '#000'};background:${/^#[0-9a-fA-F]{6}$/.test(hg) ? hg : '#fff'};border:1px solid var(--k-rand)` }, 'Beispiel-Text: Können alle das gut lesen?'),
    el('p', { class: `k-hinweis ${bewertung.stufe === 'ungenuegend' || bewertung.stufe === 'ungueltig' ? 'k-hinweis--falsch' : 'k-hinweis--richtig'}`, style: 'margin:0.5rem 0 0' }, bewertung.text));

  const bereichsKarten = daten.bereiche.map((b) => {
    const ok = b.kriterien.filter((k) => status[k.id]).length;
    return el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `${b.emoji} ${b.name} (${ok}/${b.kriterien.length})`),
      ...b.kriterien.map((k) => {
        const eingabe = el('input', { type: 'checkbox', id: `bfsg-${k.id}`, style: 'width:3rem;height:3rem;flex-shrink:0' });
        eingabe.checked = Boolean(status[k.id]);
        eingabe.addEventListener('change', () => { const s = ladeStatus(); s[k.id] = eingabe.checked; speichereStatus(s); render(); });
        return el('div', { style: 'padding:0.4rem 0' },
          el('div', { style: 'display:flex;gap:0.6rem;align-items:center' },
            eingabe,
            el('label', { for: `bfsg-${k.id}` }, el('span', {}, k.text), el('small', { style: 'display:block;color:#4b5563' }, k.bezug))),
          el('details', { style: 'margin:0.25rem 0 0 3.6rem' },
            el('summary', { style: 'cursor:pointer;font-size:0.85rem;color:var(--k-blau-dunkel)' }, '💡 So prüfst du das'),
            el('p', { style: 'font-size:0.85rem;margin:0.3rem 0 0;color:#374151' }, k.hilfe)));
      }));
  });

  const protoFeld = el('textarea', { readonly: true, style: 'width:100%;min-height:10rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem', 'aria-label': 'Prüfprotokoll' });
  protoFeld.value = protokoll(status);

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '♿ BFSG-Check'),
    el('p', { class: 'k-untertitel' }, 'Barrierefreiheit für Kinderseiten prüfen – mit Kontrast-Rechner (für Betreiber)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `Erfüllt: ${erfuellt} von ${ALLE.length} (${anteil} %)`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': ALLE.length, 'aria-valuenow': erfuellt }, el('div', { style: `width:${anteil}%` })),
      el('p', { style: 'font-size:0.9rem;margin-bottom:0' }, daten.hinweis)),
    rechner,
    ...bereichsKarten,
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, 'Prüfprotokoll (für die Barrierefreiheitserklärung)'),
      protoFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => { const url = URL.createObjectURL(new Blob([protoFeld.value], { type: 'text/plain;charset=utf-8' })); const a = el('a', { href: url, download: 'bfsg-pruefprotokoll.txt' }); a.click(); URL.revokeObjectURL(url); } }, '💾 Protokoll speichern'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(STATUS_SCHLUESSEL); render(); } }, '🧹 Zurücksetzen'))),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · läuft offline · Daten bleiben auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
