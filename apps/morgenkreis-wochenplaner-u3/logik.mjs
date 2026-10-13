// Morgenkreis- und Wochenplaner U3 – reine Logik, ohne DOM.
// Praleska docs/10, Kita-Abschnitt, Nr. 79. Quellen: Richtwerte „Примерный перечень
// занятий“ S. 8–9; Bausteine S. 70–71 (Bewegung), S. 81–86 (Musik), S. 90–94 (Malen,
// Formen, Konstruieren).
//
// TRAGENDE ENTSCHEIDUNG 1: DER PLAN HAT NUR ZÄHLWERTE, KEINE NAMEN, KEIN FREITEXT.
// Eine Einheit ist eine Bereichs-Kennung und optional ein Baustein aus der Quelle.
// Der Plan ist eine Datei ohne Angaben über Kinder, damit er nie zu einem Protokoll
// wird. Die Prüfung lehnt jedes weitere Feld ab.
//
// TRAGENDE ENTSCHEIDUNG 2: DIE RICHTWERTE SIND RICHTWERTE.
// Die Quelle nennt je Bereich eine Zahl Einheiten pro Woche (S. 8–9). Die App
// zählt die Planung dagegen und meldet Abweichungen; sie blockiert nicht. Eine
// Abweichung ist keine Fehler der Fachkraft.
//
// TRAGENDE ENTSCHEIDUNG 3: WOCHENTAGE UND HÖCHSTZAHL PRO TAG SIND EIGEN.
// Die Quelle nennt keine Wochentage. Fünf Tage und höchstens vier Einheiten pro Tag
// sind Eigenentwurf und stehen so in den Daten.
//
// Politik docs/02: keine externen Anfragen, KEIN localStorage. Der Plan lebt im
// Speicher der Seite und in der Datei, die die Fachkraft selbst speichert.

export const PLAN_ART = 'morgenkreis-wochenplan';
export const PLAN_VERSION = 1;
/** Erlaubte Felder einer Einheit: Bereich und optionaler Baustein. Nichts anderes. */
export const EINHEIT_SCHLUESSEL = Object.freeze(['bereich', 'baustein']);
/** Erlaubte Felder des Plans. */
export const PLAN_SCHLUESSEL = Object.freeze(['art', 'version', 'woche']);
/** Erlaubte Felder eines Bausteins in den Daten. */
export const BAUSTEIN_SCHLUESSEL = Object.freeze(['id', 'titel', 'seite', 'art']);
/** Angaben, die weder Plan noch Daten tragen dürfen: sie beträfen Kinder. */
const KINDER_FELDER = Object.freeze(['name', 'kind', 'vorname', 'nachname', 'geburtstag', 'alter', 'notiz', 'text', 'bemerkung', 'beobachtung']);
/** Autoren- und Notenangaben aus den Listen der Quelle. */
const AUTOREN = /(^|[\s,(«])(муз|сл|обр)\./u;

const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;
const seiteOk = (s) => typeof s === 'string' && /^S\. \d+(–\d+)?(, S\. \d+(–\d+)?)*$/.test(s);

/** Ein leerer Plan: jeder Tag ohne Einheiten. */
export function neuerPlan(daten) {
  return { art: PLAN_ART, version: PLAN_VERSION, woche: daten.tage.map((tag) => ({ tag, einheiten: [] })) };
}

/** Der Baustein zu einer Kennung innerhalb eines Bereichs, oder null. */
export function bausteinVon(daten, bereich, id) {
  const b = daten.bereiche.find((x) => x.id === bereich);
  return b?.bausteine.find((x) => x.id === id) ?? null;
}

/** Eine Einheit anhängen. Liefert einen neuen Plan; ist der Tag voll, bleibt der Plan gleich. */
export function einheitHinzufuegen(daten, plan, tag, bereich) {
  const zeile = plan.woche.find((z) => z.tag === tag);
  if (!zeile || zeile.einheiten.length >= daten.hoechstensProTag) return plan;
  return {
    ...plan,
    woche: plan.woche.map((z) => (z.tag === tag ? { ...z, einheiten: [...z.einheiten, { bereich, baustein: null }] } : z)),
  };
}

/** Den Bereich oder den Baustein einer Einheit ändern. Der Baustein wird gelöscht, wenn der Bereich wechselt. */
export function einheitAendern(plan, tag, index, feld, wert) {
  return {
    ...plan,
    woche: plan.woche.map((z) => {
      if (z.tag !== tag) return z;
      const einheiten = z.einheiten.map((e, i) => {
        if (i !== index) return e;
        if (feld === 'bereich') return { bereich: wert, baustein: null };
        return { ...e, baustein: wert };
      });
      return { ...z, einheiten };
    }),
  };
}

/** Eine Einheit entfernen. */
export function einheitEntfernen(plan, tag, index) {
  return {
    ...plan,
    woche: plan.woche.map((z) => (z.tag === tag ? { ...z, einheiten: z.einheiten.filter((_, i) => i !== index) } : z)),
  };
}

/** Zahl der geplanten Einheiten je Bereich. */
export function zaehleBereiche(plan) {
  const zaehl = {};
  for (const z of plan.woche) for (const e of z.einheiten) zaehl[e.bereich] = (zaehl[e.bereich] ?? 0) + 1;
  return zaehl;
}

/**
 * Die Abweichungen vom Richtwert, als Sätze. Leer heißt: alle Richtwerte getroffen
 * und zusammen zehn Einheiten. Diese Liste ist eine Rückmeldung, kein Fehler.
 */
export function abweichungen(daten, plan) {
  const zaehl = zaehleBereiche(plan);
  const meldungen = [];
  for (const r of daten.richtwerte) {
    const ist = zaehl[r.bereich] ?? 0;
    if (ist !== r.anzahl) {
      const bereich = daten.bereiche.find((b) => b.id === r.bereich)?.name ?? r.bereich;
      meldungen.push(`${bereich}: ${ist} geplant, Richtwert ${r.anzahl} (${r.quelle})`);
    }
  }
  const summe = Object.values(zaehl).reduce((a, b) => a + b, 0);
  const soll = daten.richtwerte.reduce((a, r) => a + r.anzahl, 0);
  if (summe !== soll) meldungen.push(`insgesamt ${summe} Einheiten, Richtwert ${soll} pro Woche (S. 8–9)`);
  return meldungen;
}

/**
 * Prüft eine eingelesene Plan-Datei. Liefert Fehler; leer heißt gültig.
 * Keine Abweichung vom Richtwert ist hier ein Fehler – nur Form und Kennungen.
 */
export function pruefePlan(inhalt, daten) {
  const fehler = [];
  if (!inhalt || typeof inhalt !== 'object' || Array.isArray(inhalt)) return ['keine Plan-Datei'];
  for (const s of Object.keys(inhalt)) {
    if (!PLAN_SCHLUESSEL.includes(s)) {
      fehler.push(`unbekanntes Feld „${s}“${KINDER_FELDER.includes(s) ? ' – die Datei enthält keine Angaben über Kinder' : ''}`);
    }
  }
  if (inhalt.art !== PLAN_ART) fehler.push('das ist keine Wochenplan-Datei');
  if (inhalt.version !== PLAN_VERSION) fehler.push(`Version ${inhalt.version} wird nicht gelesen`);
  if (!Array.isArray(inhalt.woche) || inhalt.woche.length !== daten.tage.length) {
    fehler.push(`die Woche hat nicht ${daten.tage.length} Tage`);
    return fehler;
  }
  const bekannteBereiche = new Set(daten.bereiche.map((b) => b.id));
  inhalt.woche.forEach((z, i) => {
    if (!z || typeof z !== 'object') { fehler.push(`Tag ${i + 1} ist keine Angabe`); return; }
    if (z.tag !== daten.tage[i]) fehler.push(`Tag ${i + 1} heißt „${z.tag}“, erwartet „${daten.tage[i]}“`);
    if (!Array.isArray(z.einheiten)) { fehler.push(`${z.tag}: einheiten fehlt`); return; }
    if (z.einheiten.length > daten.hoechstensProTag) fehler.push(`${z.tag}: mehr als ${daten.hoechstensProTag} Einheiten`);
    for (const e of z.einheiten) {
      if (!e || typeof e !== 'object') { fehler.push(`${z.tag}: eine Einheit ist keine Angabe`); continue; }
      for (const s of Object.keys(e)) {
        if (!EINHEIT_SCHLUESSEL.includes(s)) fehler.push(`${z.tag}: unbekanntes Feld „${s}“`);
      }
      if (!bekannteBereiche.has(e.bereich)) fehler.push(`${z.tag}: unbekannter Bereich „${e.bereich}“`);
      if (e.baustein !== null && e.baustein !== undefined) {
        if (!bausteinVon(daten, e.bereich, e.baustein)) fehler.push(`${z.tag}: der Baustein „${e.baustein}“ gehört nicht zu „${e.bereich}“`);
      }
    }
  });
  return fehler;
}

/** Die Datei als Text. Nur Form, Tage, Bereiche und Bausteine – nichts sonst. */
export function packePlan(plan) {
  return JSON.stringify({
    art: PLAN_ART,
    version: PLAN_VERSION,
    woche: plan.woche.map((z) => ({
      tag: z.tag,
      einheiten: z.einheiten.map((e) => ({ bereich: e.bereich, baustein: e.baustein ?? null })),
    })),
  }, null, 2);
}

/**
 * Prüft den Datensatz. Liefert Fehler; leer heißt gültig.
 */
export function pruefeDaten(daten) {
  const fehler = [];
  if (!/Eigen|eigen/.test(daten?.hinweis ?? '')) fehler.push('der Hinweis muss sagen, dass Wochentage und Ablauf eigen sind');
  if (!Array.isArray(daten?.tage) || daten.tage.length !== 5) fehler.push('die Woche hat nicht fünf Tage – das ist Eigenentwurf und steht so in den Daten');
  if (!Number.isInteger(daten?.hoechstensProTag) || daten.hoechstensProTag < 1) fehler.push('hoechstensProTag fehlt');
  const summe = (daten?.richtwerte ?? []).reduce((a, r) => a + r.anzahl, 0);
  if (summe !== 10) fehler.push(`die Richtwerte ergeben ${summe} Einheiten – die Quelle nennt zehn (S. 8–9)`);
  const bereichIds = (daten?.bereiche ?? []).map((b) => b.id);
  const richtIds = (daten?.richtwerte ?? []).map((r) => r.bereich);
  if (bereichIds.join() !== richtIds.join()) fehler.push('Bereiche und Richtwerte passen nicht zusammen');
  for (const r of daten?.richtwerte ?? []) {
    if (!seiteOk(r.quelle)) fehler.push(`${r.bereich}: Seitenangabe „${r.quelle}“ fehlt oder ist falsch`);
  }
  const alleIds = [];
  for (const b of daten?.bereiche ?? []) {
    for (const s of Object.keys(b)) {
      if (!['id', 'name', 'bausteine', 'quelle'].includes(s)) fehler.push(`${b.id}: unbekanntes Feld „${s}“`);
    }
    for (const x of b.bausteine) {
      for (const s of Object.keys(x)) {
        if (!BAUSTEIN_SCHLUESSEL.includes(s)) fehler.push(`${b.id}: Baustein mit fremdem Feld „${s}“`);
      }
      alleIds.push(`${b.id}/${x.id}`);
      if (!nichtLeer(x.titel)) fehler.push(`${b.id}: Baustein ohne Titel`);
      if (AUTOREN.test(x.titel ?? '')) fehler.push(`${b.id}: „${x.titel}“ enthält eine Autoren- oder Notenangabe`);
      if (!/^S\. \d+(–\d+)?(, S\. \d+(–\d+)?)*$/.test(x.seite ?? '')) fehler.push(`${b.id}: Baustein „${x.titel}“ ohne Seite`);
    }
  }
  if (new Set(alleIds).size !== alleIds.length) fehler.push('doppelte Baustein-Kennungen innerhalb eines Bereichs');
  if (daten?.quelle?.geprueft !== true) fehler.push('quelle.geprueft ist nicht true');
  if (!/Querschnitt/.test(daten?.quelle?.abweichung ?? '')) fehler.push('quelle.abweichung nennt den Querschnitt-Irrtum des Katalogs nicht');
  return fehler;
}
