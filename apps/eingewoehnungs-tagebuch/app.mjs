// Eingewöhnungs-Tagebuch: lokaler Ampel-Verlaufslog zur Eingewöhnung
// (Berliner/Münchener Modell) für Fachkräfte. Praleska docs/10 (Top-30 Nr. 3).
// Kinder nur als Kürzel; je Tag nur strukturierte Felder (Phase/Ampel/
// Trennung) – keine Namen, keine Freitexte, kein Score (EU AI Act).
// Politik docs/02: keine externen Anfragen; localStorage nur 'et.daten'.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  normalisiereKuerzel, kuerzelOk, MAX_KUERZEL, pruefeConfig,
  verlaufZeilen, trend, empfehlung, bericht,
} from './logik.mjs';
import { packeKoffer, pruefeKoffer, vereinigeKoffer } from './koffer.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'et.daten';
const app = document.getElementById('app');
const config = await fetch('daten/config.json').then((r) => r.json());

let aktivKuerzel = null;
let meldung = null;
// Formularzustand des nächsten Tages (nicht gespeichert, bis „Tag speichern“)
let formPhase = config.phasen[0].id;
let formAmpel = config.ampeln[0].id;
let formTrennung = config.trennungen[0].id;

const leer = () => ({ kinder: [], eintraege: {} });

function lade() {
  const roh = JSON.parse(localStorage.getItem(SCHLUESSEL) ?? 'null');
  if (!roh || typeof roh !== 'object' || Array.isArray(roh)) return leer();
  return {
    kinder: Array.isArray(roh.kinder) ? roh.kinder.filter(kuerzelOk) : [],
    eintraege: (roh.eintraege && typeof roh.eintraege === 'object' && !Array.isArray(roh.eintraege)) ? roh.eintraege : {},
  };
}
const speichere = (d) => localStorage.setItem(SCHLUESSEL, JSON.stringify(d));

function fuegeKind(roh) {
  const kuerzel = normalisiereKuerzel(roh);
  if (!kuerzelOk(kuerzel)) { meldung = { ok: false, text: `Bitte ein Kürzel mit 1 bis ${MAX_KUERZEL} Zeichen (keine Namen).` }; return render(); }
  const d = lade();
  if (d.kinder.includes(kuerzel)) { meldung = { ok: false, text: `Kürzel „${kuerzel}“ gibt es schon.` }; aktivKuerzel = kuerzel; return render(); }
  d.kinder.push(kuerzel); d.eintraege[kuerzel] = d.eintraege[kuerzel] ?? [];
  speichere(d); aktivKuerzel = kuerzel;
  meldung = { ok: true, text: `Kürzel „${kuerzel}“ angelegt. Bitte keine Namen notieren.` };
  render();
}

function entferneKind(kuerzel) {
  const d = lade();
  d.kinder = d.kinder.filter((k) => k !== kuerzel);
  delete d.eintraege[kuerzel];
  speichere(d);
  if (aktivKuerzel === kuerzel) aktivKuerzel = d.kinder[0] ?? null;
  meldung = { ok: true, text: `Kürzel „${kuerzel}“ mit allem Verlauf gelöscht.` };
  render();
}

function speichereTag() {
  const d = lade();
  const liste = d.eintraege[aktivKuerzel] ?? [];
  const tag = (liste.reduce((m, e) => Math.max(m, e.tag), 0) || 0) + 1;
  liste.push({ tag, phase: formPhase, ampel: formAmpel, trennung: formTrennung });
  d.eintraege[aktivKuerzel] = liste;
  speichere(d);
  meldung = { ok: true, text: `Tag ${tag} gespeichert.` };
  render();
}

function entferneLetztenTag() {
  const d = lade();
  const liste = d.eintraege[aktivKuerzel] ?? [];
  liste.pop();
  d.eintraege[aktivKuerzel] = liste;
  speichere(d);
  render();
}

function kopfKarte() {
  return el('section', { class: 'k-karte' },
    el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, 'Beobachtung, keine Diagnose. Strukturierter Ampel-Verlauf zur Eingewöhnung (Berliner/Münchener Modell).')),
    el('p', { style: 'font-size:0.9rem;margin-bottom:0' }, el('strong', {}, 'Keine Namen! '), `Kinder nur als Kürzel (max ${MAX_KUERZEL} Zeichen). Je Tag werden nur Ampel, Phase und Trennung festgehalten – kein Score, kein Vergleich zwischen Kindern.`));
}

function kinderKarte(d) {
  const eingabe = el('input', { type: 'text', maxlength: String(MAX_KUERZEL), placeholder: `Kürzel (max ${MAX_KUERZEL})`, 'aria-label': 'Kürzel des Kindes, keine Namen', style: 'flex:1 1 8rem;min-width:0;font:inherit;padding:0.6rem;border-radius:0.5rem;border:2px solid var(--k-rand)' });
  const form = el('form', { style: 'display:flex;gap:0.5rem;flex-wrap:wrap;margin:0 0 0.6rem' }, eingabe, el('button', { type: 'submit', class: 'k-knopf k-knopf--klein' }, '➕ Kürzel anlegen'));
  form.addEventListener('submit', (ev) => { ev.preventDefault(); const w = eingabe.value; eingabe.value = ''; fuegeKind(w); });
  const liste = d.kinder.length === 0
    ? el('p', { style: 'font-size:0.9rem;color:#4b5563;margin:0' }, 'Noch kein Kürzel angelegt.')
    : el('div', { style: 'display:flex;gap:0.4rem;flex-wrap:wrap' }, ...d.kinder.map((kuerzel) => {
        const aktiv = kuerzel === aktivKuerzel;
        const n = (d.eintraege[kuerzel] ?? []).length;
        return el('div', { style: 'display:flex;gap:0.2rem' },
          el('button', { class: `k-knopf k-knopf--klein ${aktiv ? '' : 'k-knopf--neutral'}`, 'aria-pressed': String(aktiv), onclick: () => { aktivKuerzel = kuerzel; meldung = null; render(); } }, `${kuerzel} (${n} Tag${n === 1 ? '' : 'e'})`),
          el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-label': `Kürzel ${kuerzel} löschen`, onclick: () => { if (globalThis.confirm?.(`Kürzel „${kuerzel}“ und Verlauf löschen?`)) entferneKind(kuerzel); } }, '🗑️'));
      }));
  return el('section', { class: 'k-karte' }, el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '👶 Kürzel verwalten'), form, liste);
}

function auswahl(label, liste, aktuell, onWahl, infoVon) {
  return el('div', { style: 'margin:0.5rem 0' },
    el('p', { style: 'margin:0 0 0.25rem;font-weight:600;font-size:0.95rem' }, label),
    el('div', { class: 'k-antworten', role: 'radiogroup', 'aria-label': label },
      ...liste.map((x) => el('button', { class: `k-knopf k-knopf--klein ${x.id === aktuell ? '' : 'k-knopf--neutral'}`, role: 'radio', 'aria-checked': String(x.id === aktuell), onclick: () => onWahl(x.id) }, x.text ?? x.name))),
    infoVon ? el('small', { style: 'color:#4b5563' }, infoVon) : null);
}

function neuerTagKarte(d) {
  const liste = d.eintraege[aktivKuerzel] ?? [];
  const naechster = (liste.reduce((m, e) => Math.max(m, e.tag), 0) || 0) + 1;
  const phaseInfo = config.phasen.find((p) => p.id === formPhase)?.info;
  const ampelInfo = config.ampeln.find((a) => a.id === formAmpel)?.info;
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `➕ Tag ${naechster} erfassen`),
    auswahl('Phase (Berliner/Münchener Modell)', config.phasen, formPhase, (id) => { formPhase = id; render(); }, phaseInfo),
    auswahl('Wie ging es dem Kind heute?', config.ampeln, formAmpel, (id) => { formAmpel = id; render(); }, ampelInfo),
    auswahl('Trennung', config.trennungen, formTrennung, (id) => { formTrennung = id; render(); }),
    el('div', { class: 'k-antworten' }, el('button', { class: 'k-knopf', onclick: speichereTag }, `✅ Tag ${naechster} speichern`)));
}

function verlaufKarte(d) {
  const liste = d.eintraege[aktivKuerzel] ?? [];
  const zeilen = verlaufZeilen(config, liste);
  return el('section', { class: 'k-karte' },
    el('div', { style: 'display:flex;justify-content:space-between;align-items:center;gap:0.5rem' },
      el('h2', { style: 'margin:0;font-size:1.1rem' }, `📈 Verlauf „${aktivKuerzel}“`),
      liste.length ? el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: entferneLetztenTag }, '↩️ letzten Tag') : null),
    zeilen.length === 0
      ? el('p', { style: 'font-size:0.9rem;color:#4b5563' }, 'Noch keine Tage erfasst.')
      : el('ul', { style: 'margin:0.3rem 0 0;padding-inline-start:1.2rem' }, ...zeilen.map((z) => el('li', { style: 'margin:0.15rem 0' }, z))));
}

function berichtKarte(d) {
  const liste = d.eintraege[aktivKuerzel] ?? [];
  const feld = el('textarea', { readonly: true, style: 'width:100%;min-height:12rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem', 'aria-label': `Verlaufsbericht für ${aktivKuerzel}` });
  feld.value = bericht(config, aktivKuerzel, liste);
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📝 Bericht fürs Elterngespräch'),
    feld,
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { feld.select(); navigator.clipboard?.writeText(feld.value); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 Bericht kopieren'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(bericht(config, aktivKuerzel, liste)) }, '🔊 Vorlesen')));
}

function kofferKarte() {
  const fileInput = el('input', { type: 'file', accept: '.json,application/json', style: 'display:none' });
  fileInput.addEventListener('change', async () => {
    const datei = fileInput.files?.[0]; fileInput.remove();
    if (!datei) return;
    let inhalt;
    try { inhalt = JSON.parse(await datei.text()); } catch { meldung = { ok: false, text: 'Die Datei ließ sich nicht lesen.' }; return render(); }
    const fehler = pruefeKoffer(inhalt, { config });
    if (fehler.length) { meldung = { ok: false, text: `Einlesen nicht möglich: ${fehler[0]}.` }; return render(); }
    const vorher = lade();
    const v = vereinigeKoffer(vorher, inhalt);
    speichere(v);
    if (!aktivKuerzel) aktivKuerzel = v.kinder[0] ?? null;
    meldung = { ok: true, text: `Datei eingelesen – ${v.kinder.length - vorher.kinder.length} neue Kürzel; vorhandene Verläufe blieben erhalten.` };
    render();
  });
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '📦 Sichern & Übertragen (Datei)'),
    el('p', { style: 'font-size:0.9rem' }, 'Verlauf als lokale Datei sichern oder auf ein anderes Gerät übertragen. Beim Einlesen behalten vorhandene Verläufe Vorrang. Es reist nur das Kürzel, nie ein Name.'),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { const blob = new Blob([packeKoffer(lade())], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = el('a', { href: url, download: 'eingewoehnungs-tagebuch-daten.json' }); document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url); } }, '📤 Als Datei sichern'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { document.body.append(fileInput); fileInput.click(); } }, '📥 Datei einlesen')));
}

function datenKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '🧹 Ihre Daten'),
    el('p', { style: 'font-size:0.9rem' }, 'Gespeichert wird nur der Verlauf („et.daten“: Kürzel und Tages-Ampeln), ausschließlich auf diesem Gerät. Kein Konto, keine Cloud. Bitte nirgendwo Namen notieren.'),
    el('button', { class: 'k-knopf k-knopf--falsch k-knopf--klein', onclick: () => { if (!globalThis.confirm?.('Wirklich ALLE Kürzel und Verläufe löschen?')) return; localStorage.removeItem(SCHLUESSEL); aktivKuerzel = null; meldung = { ok: true, text: 'Alle Daten gelöscht.' }; render(); } }, '🧹 Alle Daten löschen'));
}

function render() {
  const d = lade();
  if (aktivKuerzel && !d.kinder.includes(aktivKuerzel)) aktivKuerzel = null;
  if (!aktivKuerzel && d.kinder.length > 0) aktivKuerzel = d.kinder[0];
  const kinder = [
    el('h1', { class: 'k-titel' }, '🌱 Eingewöhnungs-Tagebuch'),
    el('p', { class: 'k-untertitel' }, 'Ampel-Verlauf zur Eingewöhnung – für pädagogische Fachkräfte'),
    meldung ? el('div', { class: `k-hinweis ${meldung.ok ? 'k-hinweis--richtig' : 'k-hinweis--falsch'}`, role: 'status' }, el('p', { style: 'margin:0' }, meldung.text)) : null,
    kopfKarte(),
    kinderKarte(d),
  ];
  if (aktivKuerzel) kinder.push(neuerTagKarte(d), verlaufKarte(d), berichtKarte(d));
  kinder.push(kofferKarte(), datenKarte(),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Fachkräfte · werbefrei · keine Cloud – alle Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '🏛️ Info für Eltern, Träger & Leitung'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  // replaceChildren filtert (anders als el()) keine falsy Kinder – daher hier filtern
  app.replaceChildren(...kinder.filter(Boolean));
  meldung = null;
}

const configFehler = pruefeConfig(config);
if (configFehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Konfigurationsfehler: ${configFehler[0]}`)));
} else {
  render();
}
