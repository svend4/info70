// Angebots-Kompass Kita: reine Logik (ohne DOM), damit sie testbar ist.
// Gegenstand sind die ANGEBOTE des Erwachsenen (Raum, Material, Handlung der
// Fachkraft). Erfasst wird nur, ob ein Angebot umgesetzt, noch offen oder
// nicht zutreffend ist. Kein Kind wird erfasst, bewertet oder verglichen
// (docs/02, Z. 141-146). Es gibt bewusst keine Summe über alle Bereiche und
// keine Prozentwerte; gezählt wird je Bereich.

/** Speicherschlüssel der Vorgängerfassung (Angaben zu Kindern). Nur entfernen, nie schreiben. */
export const ALTER_SCHLUESSEL = 'ek.daten';

/** Ein Prüfpunkt-Text muss ein ausformulierter Satz sein. */
export const MIN_TEXTLAENGE = 20;

/** Die drei Auswahlmöglichkeiten je Prüfpunkt (keine Rangfolge). */
export const AUSWAHL = Object.freeze({
  umgesetzt: 'umgesetzt',
  offen: 'offen',
  nichtZu: 'nicht-zutreffend',
});

const BEREICH_ANZAHL = 5;
const PRUEFPUNKTE_JE_BEREICH = 6;
const AUSWAHL_ANZAHL = 3;
const KENNUNG = /^S(\d{2})\.(\d{1,2})$/;

/** Alle Prüfpunkt-Kennungen des Katalogs (flach). @param {{bereiche: Array}} katalog */
export function allePruefpunktIds(katalog) {
  return katalog.bereiche.flatMap((b) => b.angebote.map((p) => p.id));
}

/**
 * Prüft den Katalog (daten/indikatoren.json). Erwartet 3 Auswahlmöglichkeiten,
 * 5 Bereiche mit je 6 Prüfpunkten (Kennung mit Bereichs-Präfix, ausformuliert)
 * und ein Merkmal-Register, in dem jede Kennung eine Seite und einen
 * Wortlaut hat und jedes Merkmal genutzt wird. Liefert Fehlerliste (leer = gültig).
 * @param {unknown} katalog geparstes JSON
 * @returns {string[]}
 */
export function pruefeKatalog(katalog) {
  const k = /** @type {{bereiche?: unknown, auswahl?: unknown, merkmale?: unknown}} */ (katalog);
  if (typeof katalog !== 'object' || katalog === null
    || !Array.isArray(k.bereiche) || !Array.isArray(k.auswahl)
    || typeof k.merkmale !== 'object' || k.merkmale === null) {
    return ['Kein gültiger Katalog (bereiche, auswahl und merkmale fehlen)'];
  }
  const fehler = [];

  // Auswahlmöglichkeiten
  if (k.auswahl.length !== AUSWAHL_ANZAHL) {
    fehler.push(`Es müssen genau ${AUSWAHL_ANZAHL} Auswahlmöglichkeiten sein (gefunden: ${k.auswahl.length})`);
  }
  const auswahlIds = new Set();
  for (const a of k.auswahl) {
    if (!a || typeof a.id !== 'string' || typeof a.text !== 'string' || a.text.length === 0) {
      fehler.push('Auswahlmöglichkeit ohne id/text');
    } else if (auswahlIds.has(a.id)) {
      fehler.push(`Auswahl-Id doppelt: ${a.id}`);
    } else {
      auswahlIds.add(a.id);
    }
  }
  for (const id of Object.values(AUSWAHL)) {
    if (!auswahlIds.has(id)) fehler.push(`Auswahlmöglichkeit fehlt: ${id}`);
  }

  // Merkmal-Register: Kennung = S + Seite (2 Stellen) + Nummer auf der Seite
  for (const [kennung, m] of Object.entries(k.merkmale)) {
    const treffer = KENNUNG.exec(kennung);
    if (!treffer) {
      fehler.push(`Merkmal-Kennung ungültig: ${kennung}`);
      continue;
    }
    if (!m || m.seite !== Number(treffer[1])) fehler.push(`${kennung}: Seite passt nicht zur Kennung`);
    if (!m || typeof m.wortlaut !== 'string' || m.wortlaut.length === 0) fehler.push(`${kennung}: Wortlaut fehlt`);
  }

  // Bereiche und Prüfpunkte
  if (k.bereiche.length !== BEREICH_ANZAHL) {
    fehler.push(`Es müssen genau ${BEREICH_ANZAHL} Bereiche sein (gefunden: ${k.bereiche.length})`);
  }
  const bereichIds = new Set();
  const punktIds = new Set();
  const genutzt = new Set();
  for (const bereich of k.bereiche) {
    if (!bereich || typeof bereich.id !== 'string' || bereich.id.length === 0) {
      fehler.push('Bereich ohne id');
      continue;
    }
    if (bereichIds.has(bereich.id)) fehler.push(`Bereich-Id doppelt: ${bereich.id}`);
    bereichIds.add(bereich.id);
    for (const feld of ['name', 'emoji', 'fokus']) {
      if (typeof bereich[feld] !== 'string' || bereich[feld].length === 0) fehler.push(`${bereich.id}: ${feld} fehlt`);
    }
    if (!Array.isArray(bereich.angebote) || bereich.angebote.length !== PRUEFPUNKTE_JE_BEREICH) {
      fehler.push(`${bereich.id}: es müssen genau ${PRUEFPUNKTE_JE_BEREICH} Prüfpunkte sein`);
      continue;
    }
    for (const p of bereich.angebote) {
      if (!p || typeof p.id !== 'string' || p.id.length === 0 || typeof p.text !== 'string') {
        fehler.push(`${bereich.id}: Prüfpunkt ohne id/text`);
        continue;
      }
      if (punktIds.has(p.id)) fehler.push(`Prüfpunkt-Id doppelt: ${p.id}`);
      punktIds.add(p.id);
      if (!p.id.startsWith(`${bereich.id}-`)) fehler.push(`${p.id}: Kennung muss zum Bereich ${bereich.id} gehören`);
      if (p.text.trim().length < MIN_TEXTLAENGE) fehler.push(`${p.id}: Text ist kürzer als ${MIN_TEXTLAENGE} Zeichen`);
      if (!Object.hasOwn(k.merkmale, p.quelleMerkmal)) {
        fehler.push(`${p.id}: quelleMerkmal „${p.quelleMerkmal}“ steht nicht im Merkmal-Register`);
      } else {
        genutzt.add(p.quelleMerkmal);
      }
    }
  }
  for (const kennung of Object.keys(k.merkmale)) {
    if (!genutzt.has(kennung)) fehler.push(`${kennung}: Merkmal steht im Register, wird aber von keinem Prüfpunkt genutzt`);
  }
  return fehler;
}

/**
 * Zählt die Auswahl EINES Bereichs. Gezählt werden nur bekannte Prüfpunkte des
 * Bereichs; fremde oder kaputte Schlüssel zählen nicht. Der Nenner ist immer
 * die Zahl der Prüfpunkte dieses Bereichs. Keine Summe über Bereiche.
 * @param {{angebote: Array<{id: string}>}} bereich
 * @param {Record<string, string>} [auswahl] prüfpunktId -> auswahlId
 * @returns {{erfuellt: number, offen: number, nichtZu: number, gesamt: number}}
 */
export function bilanzBereich(bereich, auswahl = {}) {
  const angaben = bereich.angebote.map((p) => (Object.hasOwn(auswahl ?? {}, p.id) ? auswahl[p.id] : null));
  const zaehle = (id) => angaben.filter((a) => a === id).length;
  return {
    erfuellt: zaehle(AUSWAHL.umgesetzt),
    offen: zaehle(AUSWAHL.offen),
    nichtZu: zaehle(AUSWAHL.nichtZu),
    gesamt: bereich.angebote.length,
  };
}

/** Zählung eines Bereichs als Satz, ohne Prozentwert. @param {ReturnType<typeof bilanzBereich>} b */
export function bilanzText(b) {
  return `erfüllt: ${b.erfuellt} von ${b.gesamt} · noch offen: ${b.offen} · trifft nicht zu: ${b.nichtZu}`;
}

/**
 * Nächster Stand nach einem Klick: dieselbe Wahl nochmals nimmt sie zurück
 * (null), eine andere Wahl ersetzt sie.
 * @param {string|null|undefined} aktuell
 * @param {string} gewaehlt
 * @returns {string|null}
 */
export function naechsterStand(aktuell, gewaehlt) {
  return aktuell === gewaehlt ? null : gewaehlt;
}

/**
 * Kästchen für den Druckbogen: genau ein gefülltes Kästchen, wenn gewählt.
 * @param {Array<{id: string, text: string}>} optionen
 * @param {string|null} [gewaehlt]
 * @returns {string[]}
 */
export function druckMarken(optionen, gewaehlt = null) {
  return optionen.map((o) => `${o.id === gewaehlt ? '☒' : '☐'} ${o.text}`);
}

/** Kennzeichnung jeder Formulierung als Eigenentwurf mit Merkmal-Kennung. */
export function eigenentwurfsHinweis(kennung) {
  return `Eigenentwurf nach Merkmal ${kennung}`;
}

/**
 * Entfernt beim Start den Altbestand (ALTER_SCHLUESSEL). Es wird nur entfernt,
 * nie geschrieben. Ein gesperrter oder fehlender Speicher bricht nichts ab.
 * @param {{removeItem: (k: string) => void} | null} [speicher] Standard: localStorage
 * @returns {boolean} true, wenn der Aufruf ohne Fehler durchlief
 */
export function bereinigeAltbestand(speicher = null) {
  try {
    (speicher ?? globalThis.localStorage).removeItem(ALTER_SCHLUESSEL);
    return true;
  } catch {
    return false;
  }
}
