// Familienschatz: Reime, Kniereiter, Fingerspiele & Wiegenlieder (für Eltern).
// Methode + eigene Beispieltexte (Vorlesen) + lokaler „Familien-Liederschatz“
// zum Selbstsammeln. Bildschirmfrei fürs Kind gedacht (Anregung für Erwachsene).
// Praleska docs/10 (Top-30 Nr. 13). Politik docs/02: keine externen Anfragen.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { datenKarte } from '../../packages/kinder-ui/js/daten-karte.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { pruefeSchatz, artName, naechsterIndex, normalisiereEintrag, eintragOk } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'schatz.eigene';
const app = document.getElementById('app');
const daten = await fetch('daten/schatz.json').then((r) => r.json());

let beispielIndex = 0;

const ladeEigene = () => { try { const a = JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '[]'); return Array.isArray(a) ? a : []; } catch { return []; } };
const speichereEigene = (a) => localStorage.setItem(SCHLUESSEL, JSON.stringify(a));

function artenKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🎵 Vier Schätze'),
    ...daten.arten.map((a) => el('details', { style: 'margin:0.3rem 0' },
      el('summary', { style: 'cursor:pointer;font-weight:600' }, `${a.emoji} ${a.name}`),
      el('p', { style: 'margin:0.3rem 0 0;font-size:0.9rem' }, el('strong', {}, 'Warum: '), a.warum),
      el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, el('strong', {}, 'Wie: '), a.wie))));
}

function beispielKarte() {
  const b = daten.beispiele[beispielIndex];
  return el('section', { class: 'k-karte' },
    el('div', { style: 'display:flex;justify-content:space-between;align-items:center;gap:0.5rem' },
      el('h2', { style: 'margin:0;font-size:1.1rem' }, '📖 Zum Ausprobieren'),
      el('small', { style: 'color:#4b5563' }, artName(daten, b.artId))),
    el('p', { style: 'font-weight:600;margin:0.3rem 0 0.2rem' }, b.titel),
    el('p', { style: 'white-space:pre-line;font-size:1.05rem;line-height:1.6' }, b.text.replaceAll(' / ', '\n')),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(b.text.replaceAll(' / ', ', ')) }, '🔊 Vorlesen'),
      el('button', { class: 'k-knopf k-knopf--klein', onclick: () => { beispielIndex = naechsterIndex(beispielIndex, daten.beispiele.length); render(); } }, '🔀 Noch eins')));
}

function eigeneKarte() {
  const eigene = ladeEigene();
  const titelFeld = el('input', { type: 'text', maxlength: '80', placeholder: 'Titel (z. B. „Omas Wiegenlied“)', 'aria-label': 'Titel', style: 'width:100%;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem;margin-bottom:0.3rem' });
  const textFeld = el('textarea', { maxlength: '800', placeholder: 'Text des Verses/Liedes – gern in eurer Familiensprache (Deutsch, Ukrainisch, Russisch …)', 'aria-label': 'Text', style: 'width:100%;min-height:5rem;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem' });
  const form = el('form', {}, titelFeld, textFeld,
    el('div', { class: 'k-antworten' }, el('button', { type: 'submit', class: 'k-knopf k-knopf--klein' }, '➕ Zum Schatz hinzufügen')));
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const e = normalisiereEintrag({ titel: titelFeld.value, text: textFeld.value });
    if (!eintragOk(e)) { titelFeld.focus(); return; }
    const cur = ladeEigene(); cur.push(e); speichereEigene(cur); render();
  });

  const liste = eigene.length === 0
    ? el('p', { style: 'font-size:0.9rem;color:#4b5563;margin:0.5rem 0 0' }, 'Noch nichts gesammelt. Der schönste Schatz sind eure eigenen Verse und Lieder.')
    : el('div', {}, ...eigene.map((e, i) => el('div', { class: 'k-karte', style: 'margin:0.4rem 0;background:#f8fafc' },
        el('div', { style: 'display:flex;justify-content:space-between;gap:0.5rem;align-items:flex-start' },
          el('p', { style: 'font-weight:600;margin:0' }, e.titel),
          el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-label': `„${e.titel}“ löschen`, onclick: () => { const cur = ladeEigene(); cur.splice(i, 1); speichereEigene(cur); render(); } }, '🗑️')),
        e.text ? el('p', { style: 'white-space:pre-line;margin:0.2rem 0 0;font-size:0.95rem' }, e.text) : null,
        e.text ? el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(e.text) }, '🔊 Vorlesen') : null)));

  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '💎 Euer Familien-Liederschatz'),
    el('p', { style: 'font-size:0.9rem' }, 'Sammelt hier eure eigenen Reime und Lieder – in jeder Familiensprache. Bleibt nur auf diesem Gerät und lässt sich unten mit „Meine Daten löschen“ ganz entfernen.'),
    form,
    liste);
}

function render() {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '💛 Familienschatz'),
    el('p', { class: 'k-untertitel' }, 'Reime, Kniereiter & Wiegenlieder – Nähe und Sprache ohne Bildschirm'),
    el('section', { class: 'k-karte' }, el('p', { style: 'margin:0;font-size:0.95rem' }, daten.hinweis)),
    artenKarte(),
    beispielKarte(),
    eigeneKarte(),
    datenKarte({ schluessel: SCHLUESSEL, was: 'euer Familien-Liederschatz', nachLoeschen: render, klasse: 'fsr-nur-bildschirm' }),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Eltern · werbefrei · Daten bleiben auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

const fehler = pruefeSchatz(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
