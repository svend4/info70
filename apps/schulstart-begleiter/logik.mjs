// Schulstart-Begleiter: reine Logik (ohne DOM), damit sie testbar ist.
// Gegenstand sind die ANGEBOTE des Erwachsenen für den Schulstart (Raum,
// Material, Spiele, eigenes Handeln der Fachkraft). Erfasst wird nur, ob ein
// Angebot angeboten, noch offen oder nicht zutreffend ist. Kein Kind wird
// erfasst, bewertet oder verglichen (docs/02, Z. 141-146). Es gibt bewusst
// keine Summe über alle Bereiche und keine Prozentwerte; gezählt wird je Bereich.

/** Speicherschlüssel der Vorgängerfassung (Angaben zu Kindern). Nur entfernen, nie schreiben. */
export const ALTER_SCHLUESSEL = 'ssb.daten';

/** Ein Angebots-Text muss ein ausformulierter Satz sein. */
export const MIN_TEXTLAENGE = 20;

/** Die drei Auswahlmöglichkeiten je Angebot (keine Rangfolge). Ohne Wahl gilt „offen“. */
export const AUSWAHL = Object.freeze({
  angeboten: 'angeboten',
  offen: 'offen',
  nichtZu: 'nicht-zutreffend',
});

const BEREICH_ANZAHL = 5;
const ANGEBOTE_JE_BEREICH = 6;
const AUSWAHL_ANZAHL = 3;
const AUSWAHL_WERTE = new Set(Object.values(AUSWAHL));

/** Alle Angebots-Kennungen des Katalogs (flach). @param {{bereiche: Array}} katalog */
export function alleAngebotIds(katalog) {
  return katalog.bereiche.flatMap((b) => b.angebote.map((p) => p.id));
}

/**
 * Prüft den Katalog (daten/indikatoren.json). Erwartet drei Auswahlmöglichkeiten
 * und fünf Bereiche mit je sechs Angeboten. Jede Angebots-Kennung trägt den
 * Bereichs-Präfix, jedes Angebot nennt genau ein Merkmal aus dem eigenen
 * Bereich (`sprache-1` … `sprache-6`), und jedes Merkmal wird nur einmal
 * verwendet. Liefert eine Fehlerliste (leer = gültig).
 * @param {unknown} katalog geparstes JSON
 * @returns {string[]}
 */
export function pruefeKatalog(katalog) {
  const k = /** @type {{bereiche?: unknown, auswahl?: unknown}} */ (katalog);
  if (typeof katalog !== 'object' || katalog === null
    || !Array.isArray(k.bereiche) || !Array.isArray(k.auswahl)) {
    return ['Kein gültiger Katalog (bereiche und auswahl fehlen)'];
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
  for (const id of AUSWAHL_WERTE) {
    if (!auswahlIds.has(id)) fehler.push(`Auswahlmöglichkeit fehlt: ${id}`);
  }

  // Bereiche und Angebote
  if (k.bereiche.length !== BEREICH_ANZAHL) {
    fehler.push(`Es müssen genau ${BEREICH_ANZAHL} Bereiche sein (gefunden: ${k.bereiche.length})`);
  }
  const bereichIds = new Set();
  const angebotIds = new Set();
  const merkmale = new Set();
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
    if (!Array.isArray(bereich.angebote) || bereich.angebote.length !== ANGEBOTE_JE_BEREICH) {
      fehler.push(`${bereich.id}: es müssen genau ${ANGEBOTE_JE_BEREICH} Angebote sein`);
      continue;
    }
    for (const p of bereich.angebote) {
      if (!p || typeof p.id !== 'string' || p.id.length === 0 || typeof p.text !== 'string') {
        fehler.push(`${bereich.id}: Angebot ohne id/text`);
        continue;
      }
      if (angebotIds.has(p.id)) fehler.push(`Angebots-Id doppelt: ${p.id}`);
      angebotIds.add(p.id);
      if (!p.id.startsWith(`${bereich.id}-`)) fehler.push(`${p.id}: Kennung muss zum Bereich ${bereich.id} gehören`);
      if (p.text.trim().length < MIN_TEXTLAENGE) fehler.push(`${p.id}: Text ist kürzer als ${MIN_TEXTLAENGE} Zeichen`);
      if (typeof p.quelleMerkmal !== 'string' || !new RegExp(`^${bereich.id}-[1-6]$`).test(p.quelleMerkmal)) {
        fehler.push(`${p.id}: quelleMerkmal „${p.quelleMerkmal}“ muss ein Merkmal dieses Bereichs sein (${bereich.id}-1 bis ${bereich.id}-6)`);
      } else if (merkmale.has(p.quelleMerkmal)) {
        fehler.push(`${p.id}: Merkmal „${p.quelleMerkmal}“ wird doppelt verwendet`);
      } else {
        merkmale.add(p.quelleMerkmal);
      }
    }
  }
  return fehler;
}

/**
 * Auswahl EINES Angebots. Ohne gültige Angabe gilt „offen“. Unbekannte Werte
 * zählen nicht als angeboten.
 * @param {Record<string, string>|null|undefined} auswahl angebotId -> auswahlWert
 * @param {string} angebotId
 * @returns {string}
 */
export function stand(auswahl, angebotId) {
  const roh = auswahl && Object.hasOwn(auswahl, angebotId) ? auswahl[angebotId] : undefined;
  return AUSWAHL_WERTE.has(roh) ? roh : AUSWAHL.offen;
}

/**
 * Setzt die Auswahl eines Angebots und liefert ein NEUES Objekt. Ein unbekannter
 * Wert wird verworfen, die Auswahl bleibt dann unverändert.
 * @param {Record<string, string>} auswahl
 * @param {string} angebotId
 * @param {string} wert
 * @returns {Record<string, string>}
 */
export function setzeAuswahl(auswahl, angebotId, wert) {
  const neu = { ...(auswahl ?? {}) };
  if (AUSWAHL_WERTE.has(wert)) neu[angebotId] = wert;
  return neu;
}

/**
 * Zählt die Auswahl EINES Bereichs. Gezählt werden nur die Angebote des Bereichs;
 * fremde Schlüssel zählen nicht. Der Nenner ist immer die Zahl der Angebote dieses
 * Bereichs. Es gibt keine Summe über Bereiche.
 * @param {{angebote: Array<{id: string}>}} bereich
 * @param {Record<string, string>} [auswahl]
 * @returns {{angeboten: number, offen: number, nichtZu: number, gesamt: number}}
 */
export function bilanzBereich(bereich, auswahl = {}) {
  const staende = bereich.angebote.map((p) => stand(auswahl, p.id));
  const zaehle = (wert) => staende.filter((s) => s === wert).length;
  const angeboten = zaehle(AUSWAHL.angeboten);
  const nichtZu = zaehle(AUSWAHL.nichtZu);
  const gesamt = bereich.angebote.length;
  return { angeboten, offen: gesamt - angeboten - nichtZu, nichtZu, gesamt };
}

/** Zählung eines Bereichs als Satz, ohne Prozentwert. @param {ReturnType<typeof bilanzBereich>} b */
export function bilanzText(b) {
  return `angeboten: ${b.angeboten} von ${b.gesamt} · noch offen: ${b.offen} · trifft nicht zu: ${b.nichtZu}`;
}

/**
 * Kästchen für den Druckbogen: genau ein gefülltes Kästchen, die gewählte Auswahl.
 * @param {Array<{id: string, text: string}>} optionen
 * @param {string} gewaehlt
 * @returns {string[]}
 */
export function druckMarken(optionen, gewaehlt) {
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
