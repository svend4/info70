// Familienrat (für ELTERN+KIND 6-15, docs/09 Ось F). Die Familie stimmt
// gemeinsam über Vorlagen ab (offen), bekommt einen druckbaren Familien-
// beschluss und kann das Ergebnis als „Familien-Koffer“ als Datei
// exportieren/zusammenführen – ganz ohne Server. Politik docs/02: keine
// externen Anfragen; lokal bleibt nur die laufende Abstimmung (Zähler).
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { VORLAGEN, neueAbstimmung, stimme, ergebnis, baueBeschluss, packeFamilienKoffer, pruefeFamilienKoffer, vereinigeFamilienKoffer } from './rat.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'fr.abstimmung';
const app = document.getElementById('app');

const lade = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? 'null');
const speichere = (a) => localStorage.setItem(SCHLUESSEL, JSON.stringify(a));
const loesche = () => localStorage.removeItem(SCHLUESSEL);

function kopiere(text) {
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => fallback(text));
  else fallback(text);
}
function fallback(text) {
  const ta = el('textarea', { style: 'position:fixed;left:-9999px' }); ta.value = text;
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch (e) { /* ignore */ }
  ta.remove();
}
function ladeDatei(text) {
  const dyn = document.createElement('a');
  dyn.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  dyn.download = 'familien-koffer.json';
  dyn.click();
  URL.revokeObjectURL(dyn.href);
}

function startBildschirm() {
  const frageFeld = el('input', { style: feldStil(), placeholder: 'Worüber stimmen wir ab?', maxlength: 120, 'aria-label': 'Frage' });
  const optFeld = el('textarea', { style: 'width:100%;min-height:4.5rem;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem', placeholder: 'Eine Antwort pro Zeile\nJa\nNein', 'aria-label': 'Antwortmöglichkeiten' });
  const importFeld = el('input', { type: 'file', accept: '.json,application/json', style: 'display:block;margin-top:0.3rem', 'aria-label': 'Familien-Koffer importieren', onchange: (e) => importiere(e.target.files[0]) });

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🏡 Familienrat'),
    el('p', { class: 'k-untertitel' }, 'Gemeinsam abstimmen und einen Familienbeschluss drucken. Was ihr beschließt, gilt für alle – auch für die Eltern.'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Vorlage wählen'),
      el('div', { class: 'k-antworten' }, ...VORLAGEN.map((v) =>
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { const a = neueAbstimmung(v.frage, v.optionen); speichere(a); abstimmung(); } }, v.titel)))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Oder eigene Abstimmung'),
      el('label', { style: 'font-weight:600' }, 'Frage'), frageFeld,
      el('label', { style: 'font-weight:600;display:block;margin-top:0.4rem' }, 'Antworten (eine pro Zeile)'), optFeld,
      el('button', { class: 'k-knopf', style: 'margin-top:0.5rem', onclick: () => {
        const frage = frageFeld.value.trim();
        const optionen = optFeld.value.split('\n').map((s) => s.trim()).filter(Boolean);
        if (!frage || optionen.length < 2) { alert('Bitte eine Frage und mindestens zwei Antworten eingeben.'); return; }
        const a = neueAbstimmung(frage, optionen); speichere(a); abstimmung();
      } }, '🗳️ Abstimmung starten')),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Familien-Koffer öffnen (von einem anderen Gerät)'),
      importFeld,
      el('p', { style: 'font-size:0.85rem;color:#4b5563' }, 'Stimmen aus der Datei werden zur laufenden Abstimmung addiert – kein Server nötig.')),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'für die Familie · werbefrei · läuft offline · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

async function importiere(datei) {
  if (!datei) return;
  try {
    const inhalt = JSON.parse(await datei.text());
    const fehler = pruefeFamilienKoffer(inhalt);
    if (fehler.length) { alert('Import nicht möglich:\n' + fehler.join('\n')); return; }
    const zusammen = vereinigeFamilienKoffer(lade(), inhalt);
    if (!zusammen) { alert('Die Datei passt nicht zur laufenden Abstimmung (andere Frage/Optionen).'); return; }
    speichere(zusammen); abstimmung();
  } catch (e) { alert('Das war keine gültige Familien-Koffer-Datei.'); }
}

function abstimmung() {
  const a = lade();
  if (!a) return startBildschirm();
  const e = ergebnis(a);
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🗳️ Familienrat'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:700;font-size:1.15rem;margin-top:0' }, a.frage),
      el('p', { style: 'font-size:0.9rem;color:#4b5563' }, 'Reihum tippen: jede Person eine Stimme. Alle sehen mit (offene Abstimmung).'),
      el('div', { class: 'k-antworten' }, ...a.optionen.map((opt, i) =>
        el('button', { class: 'k-knopf', onclick: () => { speichere(stimme(lade(), i)); abstimmung(); } }, `${opt} — ${a.stimmen[i]}`)))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `Insgesamt ${e.gesamt} Stimme(n) abgegeben.`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: beschlussBildschirm }, '📜 Beschluss ansehen'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { if (confirm('Abstimmung verwerfen?')) { loesche(); startBildschirm(); } } }, '🧹 Neu'))));
}

function beschlussBildschirm() {
  const a = lade();
  if (!a) return startBildschirm();
  const themaFeld = el('input', { style: feldStil(), placeholder: 'z. B. Mediennutzung', maxlength: 60, 'aria-label': 'Thema' });
  const datumFeld = el('input', { style: feldStil(), placeholder: 'TT.MM.JJJJ', maxlength: 12, 'aria-label': 'Datum' });
  const pre = el('pre', { id: 'fr-beschluss', style: 'white-space:pre-wrap;font-family:inherit;margin:0;font-size:0.98rem;line-height:1.4' }, baueBeschluss(a));
  const auffrischen = () => { pre.textContent = baueBeschluss(a, { thema: themaFeld.value.trim(), datum: datumFeld.value.trim() }); };
  themaFeld.oninput = auffrischen; datumFeld.oninput = auffrischen;

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '📜 Familienbeschluss'),
    el('section', { class: 'k-karte fr-nur-bildschirm' },
      el('label', { style: 'font-weight:600' }, 'Thema (optional)'), themaFeld,
      el('label', { style: 'font-weight:600;display:block;margin-top:0.3rem' }, 'Datum (optional)'), datumFeld),
    el('section', { class: 'k-karte' }, pre),
    el('section', { class: 'k-karte fr-nur-bildschirm' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Beschluss drucken'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => kopiere(pre.textContent) }, '📋 Kopieren'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => ladeDatei(packeFamilienKoffer(a)) }, '💾 Familien-Koffer speichern'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: abstimmung }, '↩️ Zurück zur Abstimmung'))));
}

function feldStil() { return 'width:100%;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem'; }

const laufend = lade();
if (laufend) abstimmung(); else startBildschirm();
