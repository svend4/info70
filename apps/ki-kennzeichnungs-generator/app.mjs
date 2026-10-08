// KI-Kennzeichnungs-Generator (für Betreiber, docs/09 Nr. 172). Typ + Alter +
// Sprache wählen → fertiger kindgerechter Kennzeichnungstext und ein
// einbindbares HTML/CSS-Badge zum Kopieren (Art. 50 AI Act). Formular-zu-Text-
// Engine auf kinder-ui + mini-i18n. Politik docs/02: keine externen Anfragen.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { datenKarte } from '../../packages/kinder-ui/js/daten-karte.mjs';
import { baueKennzeichnung } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'kkg.wahl';
const app = document.getElementById('app');
const daten = await fetch('daten/texte.json').then((r) => r.json());
const SPRACHEN = [['de', 'Deutsch'], ['uk', 'Українська'], ['ru', 'Русский']];

const lade = () => ({ typ: 'chatbot', stufe: 'mittel', sprache: 'de', ...JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}') });
const speichere = (w) => localStorage.setItem(SCHLUESSEL, JSON.stringify(w));

function wahlKnopf(aktiv, label, onclick) {
  return el('button', { class: `k-knopf k-knopf--klein${aktiv ? '' : ' k-knopf--neutral'}`, 'aria-pressed': String(aktiv), onclick }, label);
}

function render() {
  const wahl = lade();
  const { text, html } = baueKennzeichnung(daten, wahl);
  const typInfo = daten.typen.find((t) => t.id === wahl.typ);

  const vorschau = el('div', { style: 'padding:0.8rem;border:2px dashed var(--k-rand);border-radius:0.6rem;background:#fff;overflow-x:auto' });
  vorschau.innerHTML = html; // eigenes, script-freies Snippet aus logik.mjs

  const textFeld = el('textarea', { readonly: true, style: 'width:100%;min-height:4rem;font-size:0.95rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem', 'aria-label': 'Kennzeichnungstext' });
  textFeld.value = text;
  const htmlFeld = el('textarea', { readonly: true, style: 'width:100%;min-height:7rem;font-family:monospace;font-size:0.78rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem', 'aria-label': 'HTML-Badge zum Einbinden' });
  htmlFeld.value = html;

  const kopiere = (feld, ev) => { feld.select(); navigator.clipboard?.writeText(feld.value); ev.target.textContent = '✔️ Kopiert!'; };
  const herunterladen = (inhalt, name, typ) => { const url = URL.createObjectURL(new Blob([inhalt], { type: typ })); const a = el('a', { href: url, download: name }); a.click(); URL.revokeObjectURL(url); };

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🏷️ KI-Kennzeichnungs-Generator'),
    el('p', { class: 'k-untertitel' }, 'Fertige, kindgerechte KI-Hinweise + einbindbares Badge (Art. 50 AI Act) – für Betreiber'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '1) Was wird gekennzeichnet?'),
      el('div', { class: 'k-antworten' }, ...daten.typen.map((t) => wahlKnopf(t.id === wahl.typ, `${t.emoji} ${t.name}`, () => { speichere({ ...wahl, typ: t.id }); render(); }))),
      el('p', { style: 'font-size:0.88rem;color:#4b5563;margin-bottom:0' }, typInfo.hinweis)),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '2) Für welches Alter?'),
      el('div', { class: 'k-antworten' }, ...daten.stufen.map((s) => wahlKnopf(s.id === wahl.stufe, `${s.emoji} ${s.name}`, () => { speichere({ ...wahl, stufe: s.id }); render(); })))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '3) Sprache · Мова · Язык'),
      el('div', { class: 'k-antworten' }, ...SPRACHEN.map(([code, name]) => wahlKnopf(code === wahl.sprache, name, () => { speichere({ ...wahl, sprache: code }); render(); })))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '👁️ Vorschau'),
      vorschau),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📝 Nur der Text'),
      textFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => kopiere(textFeld, ev) }, '📋 Text kopieren'))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧩 HTML-Badge zum Einbinden'),
      el('p', { style: 'font-size:0.88rem;color:#4b5563;margin-top:0' }, 'Selbsttragendes Snippet mit Inline-Styles – kopieren und direkt ins Angebot einfügen. Kein Script, keine externen Dateien.'),
      htmlFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => kopiere(htmlFeld, ev) }, '📋 HTML kopieren'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => herunterladen(html, `ki-hinweis-${wahl.typ}-${wahl.sprache}.html`, 'text/html;charset=utf-8') }, '💾 Als .html speichern'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0' }, 'Die Kennzeichnung ersetzt nicht die inhaltliche Prüfung nach dem AI Act – siehe KI-Transparenz-Check. Hilfe zur Selbsthilfe, keine Rechtsberatung.')),
    datenKarte({ schluessel: SCHLUESSEL, was: 'eure Auswahl in diesem Formular', nachLoeschen: render }),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · läuft offline · Auswahl bleibt auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
