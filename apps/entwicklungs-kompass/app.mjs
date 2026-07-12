// Entwicklungs-Kompass Kita: lokaler digitaler Beobachtungsbogen für
// pädagogische FACHKRÄFTE. Konzept aus Katalog Nr. 2 (docs/10, Praleska-
// Ableitung, Top-30 Nr. 1 "Entwicklungs-Kompass Kita / digitaler
// Beobachtungsbogen") - alle Indikatoren und Texte sind Neuformulierungen.
// Muster: kriterien-check + foerder-navigator (dünner DOM-Layer über reiner
// Logik + JSON-Bank) und mitmach-arena/koffer (Datei-Export/Import).
//
// Politik docs/02: KEINE externen Anfragen (CSP self + Netzwerk-Wächter);
// Kinder NUR als Kürzel (max 3 Zeichen), keine Namen; localStorage nur
// 'ek.daten' + "Alle Daten löschen"; Sicherung nur als private Datei.
// EU AI Act: reine Dokumentation je Kind - KEIN Score, KEINE Rangfolge,
// KEIN Vergleich zwischen Kindern. "Beobachtung, keine Diagnose."
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  pruefeKatalog, kuerzelOk, normalisiereKuerzel, MAX_KUERZEL,
  alleIndikatorIds, alleStufenIds, zaehleDokumentiert, berichtFuerKind,
} from './logik.mjs';
import { packeKoffer, pruefeKoffer, vereinigeKoffer } from './kompass.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'ek.daten';
const app = document.getElementById('app');
const katalog = await fetch('daten/indikatoren.json').then((r) => r.json());
const INDIKATOR_IDS = alleIndikatorIds(katalog);
const STUFEN_IDS = alleStufenIds(katalog);
const GESAMT = INDIKATOR_IDS.length;

let aktivKuerzel = null;
let meldung = null;

const leereDaten = () => ({ kinder: [], beobachtungen: {} });

function ladeDaten() {
  const roh = JSON.parse(localStorage.getItem(SCHLUESSEL) ?? 'null');
  if (!roh || typeof roh !== 'object' || Array.isArray(roh)) return leereDaten();
  return {
    kinder: Array.isArray(roh.kinder) ? roh.kinder.filter(kuerzelOk) : [],
    beobachtungen: (roh.beobachtungen && typeof roh.beobachtungen === 'object' && !Array.isArray(roh.beobachtungen))
      ? roh.beobachtungen : {},
  };
}

const speichereDaten = (daten) => localStorage.setItem(SCHLUESSEL, JSON.stringify(daten));

function fuegeKindHinzu(rohKuerzel) {
  const kuerzel = normalisiereKuerzel(rohKuerzel);
  if (!kuerzelOk(kuerzel)) {
    meldung = { ok: false, text: `Bitte ein Kürzel mit 1 bis ${MAX_KUERZEL} Zeichen eingeben (keine Namen).` };
    return render();
  }
  const daten = ladeDaten();
  if (daten.kinder.includes(kuerzel)) {
    meldung = { ok: false, text: `Das Kürzel „${kuerzel}“ gibt es schon. Bitte ein anderes wählen.` };
    aktivKuerzel = kuerzel;
    return render();
  }
  daten.kinder.push(kuerzel);
  speichereDaten(daten);
  aktivKuerzel = kuerzel;
  meldung = { ok: true, text: `Kürzel „${kuerzel}“ angelegt. Bitte keine Namen notieren.` };
  render();
}

function entferneKind(kuerzel) {
  const daten = ladeDaten();
  daten.kinder = daten.kinder.filter((k) => k !== kuerzel);
  delete daten.beobachtungen[kuerzel];
  speichereDaten(daten);
  if (aktivKuerzel === kuerzel) aktivKuerzel = daten.kinder[0] ?? null;
  meldung = { ok: true, text: `Kürzel „${kuerzel}“ mit allen Beobachtungen gelöscht.` };
  render();
}

function setzeStufe(kuerzel, indId, stufeId) {
  const daten = ladeDaten();
  const beob = { ...(daten.beobachtungen[kuerzel] ?? {}) };
  if (beob[indId] === stufeId) delete beob[indId]; // erneuter Klick nimmt die Beobachtung zurück
  else beob[indId] = stufeId;
  daten.beobachtungen[kuerzel] = beob;
  speichereDaten(daten);
  render();
}

// --- Bausteine -------------------------------------------------------------

function kopfKarte() {
  return el('section', { class: 'k-karte' },
    el('div', { class: 'k-hinweis' },
      el('p', { style: 'margin:0;font-weight:600' },
        'Beobachtung, keine Diagnose - bei Fragen an Frühförderstellen oder die Kinderärztin bzw. den Kinderarzt.')),
    el('p', { style: 'font-size:0.9rem' },
      'Ein lokaler Beobachtungsbogen für Fachkräfte: fünf Entwicklungsbereiche mit je sechs beobachtbaren Indikatoren, je Kind in drei Stufen dokumentiert (noch nicht / manchmal / sicher). ',
      el('strong', {}, 'Kein Punktestand, keine Rangfolge, kein Vergleich zwischen Kindern'),
      ' - jedes Kind wird nur für sich dokumentiert und hat sein eigenes Tempo.'),
    el('p', { style: 'font-size:0.9rem;margin-bottom:0' },
      el('strong', {}, 'Keine Namen! '),
      `Kinder werden ausschließlich als Kürzel geführt (max ${MAX_KUERZEL} Zeichen, z. B. „AB“). So entstehen keine personenbezogenen Daten auf diesem Gerät.`));
}

function kinderKarte(daten) {
  const eingabe = el('input', {
    type: 'text', maxlength: String(MAX_KUERZEL), inputmode: 'text',
    placeholder: `Kürzel (max ${MAX_KUERZEL} Zeichen)`, 'aria-label': 'Kürzel des Kindes, keine Namen',
    style: 'flex:1 1 8rem;min-width:0;font:inherit;padding:0.6rem;border-radius:0.5rem;border:2px solid var(--k-rand)',
  });
  const formular = el('form', { style: 'display:flex;gap:0.5rem;flex-wrap:wrap;align-items:stretch;margin:0 0 0.6rem' },
    eingabe,
    el('button', { type: 'submit', class: 'k-knopf k-knopf--klein' }, '➕ Kürzel anlegen'));
  formular.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const wert = eingabe.value;
    eingabe.value = '';
    fuegeKindHinzu(wert);
  });

  const liste = daten.kinder.length === 0
    ? el('p', { style: 'font-size:0.9rem;color:#4b5563;margin:0' },
        'Noch kein Kürzel angelegt. Lege oben ein Kürzel an, um mit der Dokumentation zu beginnen.')
    : el('div', { style: 'display:flex;gap:0.4rem;flex-wrap:wrap' },
        ...daten.kinder.map((kuerzel) => {
          const aktiv = kuerzel === aktivKuerzel;
          const n = zaehleDokumentiert(katalog, daten.beobachtungen[kuerzel]);
          return el('div', { style: 'display:flex;align-items:stretch;gap:0.2rem' },
            el('button', {
              class: `k-knopf k-knopf--klein ${aktiv ? '' : 'k-knopf--neutral'}`,
              'aria-pressed': String(aktiv),
              onclick: () => { aktivKuerzel = kuerzel; meldung = null; render(); },
            }, `${kuerzel} (${n}/${GESAMT})`),
            el('button', {
              class: 'k-knopf k-knopf--neutral k-knopf--klein',
              'aria-label': `Kürzel ${kuerzel} löschen`,
              style: 'padding:0.75rem 0.7rem',
              onclick: () => {
                if (globalThis.confirm?.(`Kürzel „${kuerzel}“ und alle seine Beobachtungen wirklich löschen?`)) entferneKind(kuerzel);
              },
            }, '🗑️'));
        }));

  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '👶 Kürzel verwalten'),
    el('p', { style: 'margin:0 0 0.5rem;font-size:0.85rem;color:#4b5563' },
      'Keine Namen - nur ein kurzes Kürzel je Kind. Tippe auf ein Kürzel, um es zu dokumentieren. Die Zahl zeigt, wie viele der Indikatoren schon festgehalten sind (Stand der Doku, keine Bewertung).'),
    formular,
    liste);
}

function indikatorZeile(ind, beobKind) {
  return el('div', { role: 'group', 'aria-label': ind.text, style: 'padding:0.55rem 0;border-top:1px solid var(--k-rand)' },
    el('p', { style: 'margin:0 0 0.4rem;font-size:0.95rem' }, ind.text),
    el('div', { style: 'display:flex;gap:0.4rem;flex-wrap:wrap' },
      ...katalog.stufen.map((stufe) => {
        const gewaehlt = beobKind[ind.id] === stufe.id;
        return el('button', {
          class: `k-knopf k-knopf--klein ${gewaehlt ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(gewaehlt),
          onclick: () => setzeStufe(aktivKuerzel, ind.id, stufe.id),
        }, stufe.text);
      })));
}

function bereichKarte(bereich, beobKind) {
  return el('section', { class: 'k-karte' },
    el('div', { style: 'display:flex;justify-content:space-between;align-items:flex-start;gap:0.5rem' },
      el('h2', { style: 'margin:0;font-size:1.1rem' }, `${bereich.emoji} ${bereich.name}`),
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        'aria-label': `Indikatoren im Bereich ${bereich.name} vorlesen`,
        onclick: () => vorlesen(`${bereich.name}. ${bereich.indikatoren.map((i) => i.text).join(' ')}`),
      }, '🔊 Vorlesen')),
    el('p', { style: 'margin:0.25rem 0 0;font-size:0.85rem;color:#4b5563' }, bereich.fokus),
    ...bereich.indikatoren.map((ind) => indikatorZeile(ind, beobKind)));
}

function fortschrittKarte(kuerzel, beobKind) {
  const n = zaehleDokumentiert(katalog, beobKind);
  return el('section', { class: 'k-karte' },
    el('p', { style: 'margin:0 0 0.4rem;font-size:0.95rem' },
      `Dokumentation für Kürzel „${kuerzel}“: ${n} von ${GESAMT} Indikatoren festgehalten.`),
    el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': GESAMT, 'aria-valuenow': n, 'aria-label': 'Vollständigkeit der Dokumentation' },
      el('div', { style: `width:${Math.round((n / GESAMT) * 100)}%` })),
    el('p', { style: 'margin:0.4rem 0 0;font-size:0.85rem;color:#4b5563' },
      'Das ist der Stand der Dokumentation - nicht eine Bewertung des Kindes. Ein erneuter Klick auf eine gewählte Stufe nimmt die Beobachtung zurück.'));
}

function berichtKarte(kuerzel, beobKind) {
  const berichtsFeld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:16rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': `Beobachtungs-Dokumentation für Kürzel ${kuerzel} als Text`,
  });
  berichtsFeld.value = berichtFuerKind(katalog, kuerzel, beobKind);
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `📝 Bericht für Kürzel „${kuerzel}“`),
    el('p', { style: 'font-size:0.9rem' },
      'Reiner Text zum Kopieren in Ihre Bildungsdokumentation oder als Grundlage fürs Elterngespräch. Der Bericht enthält den Hinweis „Beobachtung, keine Diagnose - bei Fragen an Frühförderstellen“ und keinerlei Punkte, Prozente oder Vergleich.'),
    berichtsFeld,
    el('div', { class: 'k-antworten' },
      el('button', {
        class: 'k-knopf k-knopf--klein',
        onclick: (ev) => {
          berichtsFeld.select();
          navigator.clipboard?.writeText(berichtsFeld.value);
          ev.target.textContent = '✔️ Kopiert!';
        },
      }, '📋 Bericht kopieren')));
}

function kofferKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '📦 Sichern & Übertragen (Datei)'),
    el('p', { style: 'font-size:0.9rem' },
      'Den gesamten Stand als lokale Datei sichern - etwa fürs Backup, einen Gerätewechsel oder um zwei Tablets zusammenzuführen. Beim Einlesen behalten vorhandene Beobachtungen Vorrang, der Import füllt nur Lücken. Es reist nur das Kürzel, nie ein Name; Kürzel über 3 Zeichen werden abgelehnt.'),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: exportiere }, '📤 Als Datei sichern'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: importiere }, '📥 Datei einlesen')));
}

function datenKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '🧹 Ihre Daten'),
    el('p', { style: 'font-size:0.9rem' },
      'Gespeichert wird nur der Beobachtungs-Stand („ek.daten“: Kürzel und dokumentierte Stufen), ausschließlich auf diesem Gerät. Kein Konto, keine Cloud, keine Übertragung. Bitte nirgendwo Namen notieren - das Kürzel genügt.'),
    el('button', {
      class: 'k-knopf k-knopf--falsch k-knopf--klein',
      onclick: () => {
        if (!globalThis.confirm?.('Wirklich ALLE Kürzel und Beobachtungen auf diesem Gerät löschen?')) return;
        localStorage.removeItem(SCHLUESSEL);
        aktivKuerzel = null;
        meldung = { ok: true, text: 'Alle Daten wurden von diesem Gerät gelöscht.' };
        render();
      },
    }, '🧹 Alle Daten löschen'));
}

// --- Datei-Export/Import ---------------------------------------------------

function exportiere() {
  const blob = new Blob([packeKoffer(ladeDaten())], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anker = el('a', { href: url, download: 'entwicklungs-kompass-daten.json' });
  document.body.append(anker);
  anker.click();
  anker.remove();
  URL.revokeObjectURL(url);
}

function importiere() {
  const eingabe = el('input', { type: 'file', accept: '.json,application/json', style: 'display:none' });
  eingabe.addEventListener('change', async () => {
    const datei = eingabe.files?.[0];
    eingabe.remove();
    if (!datei) return;
    let inhalt;
    try {
      inhalt = JSON.parse(await datei.text());
    } catch {
      meldung = { ok: false, text: 'Die Datei ließ sich nicht lesen.' };
      return render();
    }
    const fehler = pruefeKoffer(inhalt, { indikatorIds: INDIKATOR_IDS, stufenIds: STUFEN_IDS });
    if (fehler.length > 0) {
      meldung = { ok: false, text: `Einlesen nicht möglich: ${fehler[0]}.` };
      return render();
    }
    const vorher = ladeDaten();
    const vereinigt = vereinigeKoffer(vorher, inhalt);
    speichereDaten(vereinigt);
    const neu = vereinigt.kinder.length - vorher.kinder.length;
    if (!aktivKuerzel) aktivKuerzel = vereinigt.kinder[0] ?? null;
    meldung = { ok: true, text: `Datei eingelesen - ${neu} neue${neu === 1 ? 's' : ''} Kürzel ergänzt, vorhandene Beobachtungen blieben erhalten.` };
    render();
  });
  document.body.append(eingabe);
  eingabe.click();
}

// --- Render ----------------------------------------------------------------

function render() {
  const daten = ladeDaten();
  if (aktivKuerzel && !daten.kinder.includes(aktivKuerzel)) aktivKuerzel = null;
  if (!aktivKuerzel && daten.kinder.length > 0) aktivKuerzel = daten.kinder[0];
  const beobKind = aktivKuerzel ? (daten.beobachtungen[aktivKuerzel] ?? {}) : {};

  const kinder = [
    el('h1', { class: 'k-titel' }, '🧭 Entwicklungs-Kompass Kita'),
    el('p', { class: 'k-untertitel' }, 'Lokaler Beobachtungsbogen für pädagogische Fachkräfte'),
    meldung
      ? el('div', { class: `k-hinweis ${meldung.ok ? 'k-hinweis--richtig' : 'k-hinweis--falsch'}`, role: 'status' },
          el('p', { style: 'margin:0' }, meldung.text))
      : '',
    kopfKarte(),
    kinderKarte(daten),
  ];

  if (aktivKuerzel) {
    kinder.push(
      fortschrittKarte(aktivKuerzel, beobKind),
      ...katalog.bereiche.map((b) => bereichKarte(b, beobKind)),
      berichtKarte(aktivKuerzel, beobKind),
    );
  }

  kinder.push(
    kofferKarte(),
    datenKarte(),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Fachkräfte · werbefrei · keine Cloud - alle Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '🏛️ Info für Träger & Leitung'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  );

  app.replaceChildren(...kinder);
  meldung = null;
}

const katalogFehler = pruefeKatalog(katalog);
if (katalogFehler.length > 0) {
  app.replaceChildren(
    el('div', { class: 'k-hinweis k-hinweis--falsch' },
      el('p', { style: 'margin:0' }, `Datenfehler im Indikatoren-Katalog: ${katalogFehler[0]}`)));
} else {
  render();
}
