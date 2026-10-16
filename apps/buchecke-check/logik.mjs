// Buchecke-Check – reine Logik, ohne DOM.
// Praleska docs/10, Kita-Abschnitt, Nr. 85. Quellen: S. 155 und S. 186 (Gruppe „Почемучки“, 3–5),
// S. 251 (Gruppe „Фантазеры“, 5–7). Die übrigen Fragen sind Eigenentwurf und so markiert.
//
// TRAGENDE ENTSCHEIDUNG 1: DAS WERKZEUG FRAGT NACH DEM RAUM, NICHT NACH KINDERN.
// Der Katalog nannte eine Kriterienliste zum Einrichten und Pflegen der Buchecke. Sie fragt hier
// nach Ort, Bestand, Zeit und Pflege der Gruppe. Ein Feld für einzelne Kinder gibt es nicht, und
// die Prüfung lehnt Felder und Texte ab, die danach aussehen.
//
// TRAGENDE ENTSCHEIDUNG 2: NICHTS WIRD GESPEICHERT.
// Die Antworten liegen im Speicher der Seite. Der Bericht ist eine Datei, die das Team selbst
// speichert oder druckt. Kein localStorage, keine Anfragen (docs/02).
//
// TRAGENDE ENTSCHEIDUNG 3: JEDE FRAGE TRÄGT IHRE HERKUNFT.
// Eine Frage hat entweder eine Seite mit russischem Wortlaut oder das Wort „Eigenentwurf“.
// Eine Frage ohne eines von beidem wird abgelehnt.

const WURZEL = Object.freeze(['version', 'titel', 'zielgruppe', 'hinweis', 'quelle', 'bereiche']);
const QUELLE = Object.freeze(['werk', 'abweichung']);
const BEREICH = Object.freeze(['id', 'titel', 'fragen']);
const FRAGE = Object.freeze(['id', 'text', 'quelle', 'zitat']);

export const EIGEN = 'Eigenentwurf';
export const ZUSTAENDE = Object.freeze(['erfuellt', 'offen', 'nicht']);
export const BESCHRIFTUNG = Object.freeze({ erfuellt: 'erfüllt', offen: 'noch offen', nicht: 'trifft nicht zu' });

/**
 * Felder, die nach Angaben über ein Kind aussehen. Exakte Namen und Wortteile, wie in den
 * anderen Werkzeugen der Reihe. „alter“ nur exakt.
 */
const KINDER_EXAKT = Object.freeze(['name', 'vorname', 'kind', 'kinder', 'alter', 'protokoll', 'verlauf', 'beobachtung', 'notiz', 'notizen', 'geburtstag', 'geschlecht', 'diagnose', 'bewertung', 'ergebnis']);
const KINDER_TEIL = Object.freeze(['kindername', 'kinder', 'notiz', 'beobacht', 'geburt', 'geschlecht', 'protokoll', 'verlauf', 'diagnos', 'bewert']);
/** Ein Muster im Wert, das wie ein Eintrag über ein Kind aussieht („Name: Mia“). */
const KINDER_WERT = /\b(Name|Vorname|Kindername|Geburtsdatum|Notiz|Beobachtung)\s*:/i;

const istKinderFeld = (s) => { const k = s.toLowerCase(); return KINDER_EXAKT.includes(k) || KINDER_TEIL.some((t) => k.includes(t)); };
const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;
const fremde = (o, erlaubt) => Object.keys(o).filter((k) => !erlaubt.includes(k));

function alleTexte(o, acc = []) {
  if (Array.isArray(o)) o.forEach((x) => alleTexte(x, acc));
  else if (typeof o === 'string') acc.push(o);
  else if (o && typeof o === 'object') Object.values(o).forEach((v) => alleTexte(v, acc));
  return acc;
}

/** Alle Schlüssel eines Objekts, rekursiv. */
function schluesselIn(o, acc = []) {
  if (Array.isArray(o)) o.forEach((x) => schluesselIn(x, acc));
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { acc.push(k); schluesselIn(v, acc); }
  return acc;
}

/** Alle Fragen in Reihenfolge der Datei. */
export function alleFragen(daten) {
  return daten.bereiche.flatMap((b) => b.fragen);
}

/** Liefert die Liste der Fehler in den Daten. Leer heißt: in Ordnung. */
export function pruefeDaten(daten) {
  if (!daten || typeof daten !== 'object') return ['Die Daten fehlen.'];
  const fehler = [];
  for (const k of fremde(daten, WURZEL)) fehler.push(`Unbekanntes Feld „${k}“.`);
  if (!nichtLeer(daten.titel)) fehler.push('Der Titel fehlt.');
  if (!daten.quelle || typeof daten.quelle !== 'object' || fremde(daten.quelle, QUELLE).length
    || !nichtLeer(daten.quelle.werk) || !nichtLeer(daten.quelle.abweichung)) {
    fehler.push('Die Quellenangabe ist unvollständig.');
  }
  if (!Array.isArray(daten.bereiche) || daten.bereiche.length === 0) {
    return [...fehler, 'Es gibt keine Bereiche.'];
  }
  const bereichIds = new Set();
  const frageIds = new Set();
  for (const b of daten.bereiche) {
    for (const k of fremde(b, BEREICH)) fehler.push(`Bereich ${b.id}: unbekanntes Feld „${k}“.`);
    if (!nichtLeer(b.id) || bereichIds.has(b.id)) fehler.push(`Bereich-Kennung „${b.id}“ fehlt oder ist doppelt.`);
    bereichIds.add(b.id);
    if (!nichtLeer(b.titel)) fehler.push(`Bereich ${b.id} hat keinen Titel.`);
    if (!Array.isArray(b.fragen) || b.fragen.length === 0) {
      fehler.push(`Bereich ${b.id} hat keine Fragen.`);
      continue;
    }
    for (const f of b.fragen) {
      for (const k of fremde(f, FRAGE)) fehler.push(`Frage ${f.id}: unbekanntes Feld „${k}“.`);
      if (!nichtLeer(f.id) || frageIds.has(f.id)) fehler.push(`Frage-Kennung „${f.id}“ fehlt oder ist doppelt.`);
      frageIds.add(f.id);
      if (!nichtLeer(f.text) || !/[.?!]$/.test(f.text.trim())) {
        fehler.push(`Frage ${f.id}: Text fehlt oder endet ohne Satzzeichen.`);
      }
      if (f.quelle === EIGEN) {
        if ('zitat' in f) fehler.push(`Frage ${f.id}: Eigenentwurf hat kein Zitat.`);
      } else if (typeof f.quelle !== 'string' || !/^S\. \d+/.test(f.quelle)) {
        fehler.push(`Frage ${f.id}: Herkunft fehlt (Seite oder „Eigenentwurf“).`);
      } else if (!nichtLeer(f.zitat) || !/[Ѐ-ӿ]/.test(f.zitat)) {
        fehler.push(`Frage ${f.id}: Quelle ohne russischen Wortlaut.`);
      }
    }
  }
  const kinder = schluesselIn(daten).filter(istKinderFeld);
  if (kinder.length) fehler.push(`Felder über einzelne Kinder: ${[...new Set(kinder)].join(', ')}.`);
  const wert = alleTexte(daten).find((s) => KINDER_WERT.test(s));
  if (wert) fehler.push(`Ein Text sieht nach einem Eintrag über ein Kind aus: „${wert.slice(0, 40)}…“.`);
  return fehler;
}

/**
 * Setzt den Zustand einer Frage. Dieselbe Taste ein zweites Mal hebt die Antwort auf.
 * Eine unbekannte Frage oder ein unbekannter Wert ändert nichts. Gibt eine neue Kopie zurück.
 */
export function zustandSetzen(daten, zustand, frageId, wert) {
  const neu = { ...zustand };
  const bekannt = alleFragen(daten).some((f) => f.id === frageId);
  if (!bekannt || !ZUSTAENDE.includes(wert)) return neu;
  if (neu[frageId] === wert) delete neu[frageId];
  else neu[frageId] = wert;
  return neu;
}

/** Zählt je Bereich und insgesamt. Unbeantwortete Fragen zählen als „ungeprüft“. */
export function zaehle(daten, zustand = {}) {
  const zeile = (fragen) => {
    const werte = fragen.map((f) => zustand[f.id] ?? null);
    return {
      gesamt: fragen.length,
      erfuellt: werte.filter((w) => w === 'erfuellt').length,
      offen: werte.filter((w) => w === 'offen').length,
      nicht: werte.filter((w) => w === 'nicht').length,
      ungeprueft: werte.filter((w) => w === null).length,
    };
  };
  return {
    bereiche: daten.bereiche.map((b) => ({ id: b.id, titel: b.titel, ...zeile(b.fragen) })),
    gesamt: zeile(alleFragen(daten)),
  };
}

/** Der Team-Bericht als Zeilen: Kopf, Bilanz je Bereich, jede Frage mit Stand und Herkunft. */
export function berichtZeilen(daten, zustand = {}) {
  const z = zaehle(daten, zustand);
  const g = z.gesamt;
  const zeilen = [
    `${daten.titel} – Team-Bericht`,
    'Für das Kita-Team. Keine Angaben über einzelne Kinder, keine Namen, keine Bewertung von Kindern.',
    'Stand: ______________ (von Hand eintragen)',
    `Insgesamt: ${g.erfuellt} von ${g.gesamt} erfüllt, ${g.offen} noch offen, ${g.nicht} trifft nicht zu, ${g.ungeprueft} nicht geprüft.`,
    '',
  ];
  daten.bereiche.forEach((b, i) => {
    const bz = z.bereiche[i];
    zeilen.push(`${i + 1}. ${b.titel} – erfüllt ${bz.erfuellt}, noch offen ${bz.offen}, trifft nicht zu ${bz.nicht}, nicht geprüft ${bz.ungeprueft}`);
    for (const f of b.fragen) {
      const status = zustand[f.id] ? BESCHRIFTUNG[zustand[f.id]] : 'nicht geprüft';
      const herkunft = f.quelle === EIGEN ? 'Eigenentwurf' : `Quelle ${f.quelle}`;
      zeilen.push(`   - ${status}: ${f.text} (${herkunft})`);
    }
    zeilen.push('');
  });
  return zeilen;
}
