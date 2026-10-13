// Kita-Mitmach-Börse (Praleska docs/10, Kita-Abschnitt, Nr. 75). Die Angebote
// stammen aus dem Familienkapitel der Quelle (S. 24–25). Die Abstimmung ist
// eine Eigenentwicklung auf Grundlage der Stimm-Datei aus mitmach-arena, hier
// aber ohne Namen und ohne Freitext: Eine Datei enthält einen Code und die
// Markierungen. Die App erzeugt den Code zufällig; die Prüfung kann das nicht erkennen.
//
// TRAGENDE ENTSCHEIDUNG 1: KEINE NAMEN, KEIN FREITEXT.
// Der Katalogeintrag wollte, dass Eltern „eigene Talente eintragen“. Das wäre
// ein Verzeichnis von Eltern mit Angaben zu ihnen. Stattdessen gibt es zu jedem
// Angebot zwei Häkchen: interessiert und kann mithelfen.
//
// TRAGENDE ENTSCHEIDUNG 2: DIE DATEI IST GEPRÜFT, NICHT NUR GELESEN.
// Eine Datei mit fremden Schlüsseln (etwa „name“) wird abgewiesen. Im Code-Feld
// sind aber Buchstaben erlaubt: eine von Hand gebaute Datei kann dort einen Namen
// tragen, und die Prüfung erkennt das nicht. Die App selbst erzeugt nur Zufallscodes.
//
// TRAGENDE ENTSCHEIDUNG 3: DIE ZAHL 20 IST NICHT DIE ZAHL DER QUELLE.
// Der Text nennt 13 Formen auf S. 24 und sechs Clubs auf S. 25, die Liste ist
// offen („und др.“). Die Anzahl wird aus den Daten gezählt, nicht behauptet.

export const KOFFER_ART = 'kita-mitmach-boerse-stimmen';
export const KOFFER_VERSION = 1;
/** Zeichen für den Code: ohne 0, O, 1, I, damit man ihn vorlesen kann. */
export const CODE_ZEICHEN = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const CODE_LAENGE = 6;

const ERLAUBTE_SCHLUESSEL_OBEN = Object.freeze(['art', 'version', 'code', 'stimmen']);
const ERLAUBTE_SCHLUESSEL_STIMME = Object.freeze(['id', 'interessiert', 'mithilfe']);

const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;

/** Alle Angebots-Kennungen: Formate und Clubs. */
export function alleIds(daten) {
  return [...(daten?.formate ?? []), ...(daten?.clubs ?? [])].map((a) => a.id);
}

/** Ein Code aus Zufallsbytes. Die Bytes kommen von außen, damit die Funktion
 *  testbar bleibt. */
export function neuerCode(bytes) {
  if (!Array.isArray(bytes) || bytes.length < CODE_LAENGE) throw new Error('zu wenige Zufallsbytes');
  return Array.from({ length: CODE_LAENGE }, (_, i) => CODE_ZEICHEN[bytes[i] % CODE_ZEICHEN.length]).join('');
}

export function packeKoffer({ code, stimmen }) {
  return JSON.stringify({
    art: KOFFER_ART,
    version: KOFFER_VERSION,
    code,
    stimmen: stimmen.map((s) => ({ id: s.id, interessiert: !!s.interessiert, mithilfe: !!s.mithilfe })),
  }, null, 2);
}

/** Prüft eine eingelesene Datei. Liefert Fehler; leer heißt gültig. */
export function pruefeKoffer(inhalt, daten) {
  const fehler = [];
  if (!inhalt || typeof inhalt !== 'object' || Array.isArray(inhalt)) return ['keine Stimmen-Datei'];
  for (const k of Object.keys(inhalt)) {
    if (!ERLAUBTE_SCHLUESSEL_OBEN.includes(k)) fehler.push(`unbekanntes Feld „${k}“ – die Datei enthält keine Angaben über Personen`);
  }
  if (inhalt.art !== KOFFER_ART) fehler.push('das ist keine Mitmach-Börse-Datei');
  if (inhalt.version !== KOFFER_VERSION) fehler.push(`Version ${inhalt.version} wird nicht gelesen`);
  if (typeof inhalt.code !== 'string' || inhalt.code.length !== CODE_LAENGE
      || ![...inhalt.code].every((c) => CODE_ZEICHEN.includes(c))) {
    fehler.push('der Code ist ungültig');
  }
  if (!Array.isArray(inhalt.stimmen)) fehler.push('stimmen fehlt');
  else {
    const bekannt = new Set(alleIds(daten));
    const kennungen = inhalt.stimmen.map((s) => s?.id);
    if (new Set(kennungen).size !== kennungen.length) fehler.push('ein Angebot steht mehrfach in der Datei – es würde doppelt gezählt');
    for (const s of inhalt.stimmen) {
      if (!s || typeof s !== 'object') { fehler.push('eine Stimme ist keine Angabe'); continue; }
      for (const k of Object.keys(s)) {
        if (!ERLAUBTE_SCHLUESSEL_STIMME.includes(k)) fehler.push(`unbekanntes Feld „${k}“ in einer Stimme`);
      }
      if (!bekannt.has(s.id)) fehler.push(`unbekanntes Angebot „${s.id}“`);
      if (typeof s.interessiert !== 'boolean' || typeof s.mithilfe !== 'boolean') fehler.push(`Stimme „${s.id}“: nur ja/nein erlaubt`);
    }
  }
  return fehler;
}

/** Stimmen je Code; eine spätere Datei mit demselben Code ersetzt die frühere. */
export function vereinige(eintraege) {
  const karte = new Map();
  for (const e of eintraege) karte.set(e.code, e.stimmen);
  return karte;
}

/** Die Summen je Angebot und die Zahl der Familien. Keine Namen, keine Liste der Codes. */
export function zaehle(karte, daten) {
  const summen = Object.fromEntries(alleIds(daten).map((id) => [id, { interessiert: 0, mithilfe: 0 }]));
  for (const stimmen of karte.values()) {
    for (const s of stimmen) {
      if (!summen[s.id]) continue;
      if (s.interessiert) summen[s.id].interessiert += 1;
      if (s.mithilfe) summen[s.id].mithilfe += 1;
    }
  }
  return { familien: karte.size, summen };
}

export function pruefeDaten(daten) {
  const fehler = [];
  if ((daten?.formate ?? []).length !== 13) fehler.push(`${(daten?.formate ?? []).length} Formate – auf S. 24 stehen dreizehn`);
  if ((daten?.clubs ?? []).length !== 6) fehler.push(`${(daten?.clubs ?? []).length} Clubs – auf S. 25 stehen sechs`);
  const ids = alleIds(daten);
  if (new Set(ids).size !== ids.length) fehler.push('doppelte Kennungen');
  for (const a of [...(daten?.formate ?? []), ...(daten?.clubs ?? [])]) {
    if (!nichtLeer(a.deutsch)) fehler.push(`${a.id}: deutsch fehlt`);
    if (!nichtLeer(a.russisch)) fehler.push(`${a.id}: russisch fehlt – die Quelle gehört in das Quellfeld`);
    if (!/^S\. 2[45]$/.test(a.quelle ?? '')) fehler.push(`${a.id}: Seitenangabe fehlt oder falsch`);
  }
  if (/Näh-?werkstatt/i.test(JSON.stringify(daten?.formate ?? []))) {
    fehler.push('„Näh-Werkstatt“ steht als Format – es kommt im Text nicht vor');
  }
  for (const r of daten?.rechtlich ?? []) {
    if (!nichtLeer(r.quelle)) fehler.push(`${r.titel ?? '?'}: quelle fehlt`);
  }
  if ((daten?.rechtlich ?? []).length < 3) fehler.push('zu wenige Rechtsangaben');
  if (!/keine?\s+Pflicht|nicht im Text/i.test(daten?.praxis ?? '')) fehler.push('praxis sagt nicht, was keine Pflicht ist');
  if (!/keinen Namen|keine Namen/i.test(daten?.datenschutz ?? '')) fehler.push('datenschutz sagt nicht, dass keine Namen gespeichert werden');
  if (daten?.quelle?.geprueft !== true) fehler.push('quelle.geprueft ist nicht true');
  if (!/Katalogeintrag nennt 20\b/.test(daten?.quelle?.abweichung ?? '')) fehler.push('quelle.abweichung nennt die Zahl 20 aus dem Katalogeintrag nicht');
  return fehler;
}
