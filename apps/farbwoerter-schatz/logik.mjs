// Farbwörter-Schatz: reine Logik ohne DOM, testbar.
// Die Farbwörter stehen in daten/farbwoerter.json. Hier werden sie geladen, geprüft, nach Gruppe
// gewählt, zu einer Farbkarte und zu Druckblättern gemacht. Kein Zufall, keine Uhr, keine
// Speicherung, keine Bewertung von Kindern: die Reihenfolge ist die der Datei, und die App
// zählt nur, was angesehen oder zum Drucken vorgemerkt ist.

/** Die vier Gruppen (Bauauftrag CON-9, Abschnitt 4). */
export const GRUPPEN = Object.freeze(['warm', 'kalt', 'kontrast', 'neutral']);
/** Sprachen der Farbkarte. uk bleibt leer, bis eine Übersetzung geprüft ist. */
export const SPRACHEN = Object.freeze(['de', 'ru', 'uk']);
/** Die einzige Seite der Quelle, die diese Einheit nutzt. */
export const QUELLSEITE = 'S. 178';
/** Höchstens so viele verschiedene Farbwörter zeigt eine Runde, dann ist Bildschirm aus (Eigenentwurf, Zahl offen). */
export const PRO_SITZUNG = 6;

/** Der Hinweis auf der Karte: warm oder kalt, bei Kontrast und neutral der Gruppenname (Eigenentwurf). */
export const HINWEIS = Object.freeze({ warm: 'warm', kalt: 'kalt', kontrast: 'Kontrast', neutral: 'neutral' });
/** Der Hinweis als Satz zum Vorlesen. */
export const HINWEIS_SATZ = Object.freeze({
  warm: 'Das ist eine warme Farbe.',
  kalt: 'Das ist eine kalte Farbe.',
  kontrast: 'Diese Farben sind ein Kontrast.',
  neutral: 'Das ist eine neutrale Farbe.',
});
/** Kopf und Kennzeichnung auf dem Blatt. Das Blatt trägt keine Seitenzahl und nennt die Quelle nicht. */
export const BLATT_KOPF = 'Farbwörter-Schatz';
export const BLATT_EIGEN = 'Farbwort, Farbfläche und Hinweis: Eigenentwurf.';

// Zeichen, die im Druck nicht stehen dürfen: Kästchen, Häkchen, Sternchen-Symbole, Aufzählungszeichen,
// Pfeile und Emojis. Als Unicode-Escapes geschrieben, damit die Datei selbst keine solchen Zeichen trägt.
export const VERBOTENE_ZEICHEN = /[\u2610\u2611\u2612\u2713\u2714\u2717\u2718\u2605\u2606\u2022\u25CF\u25CB\u25E6\u00B7\u2219\u2027\u25AA\u25AB\u25FD\u25FE\u25A0\u25A1\u30FB]|[\u2190-\u2BFF]|\p{Extended_Pictographic}/u;
// Eine Seitenangabe der Quelle („S. 178“, „Seite 178“). Auf dem Blatt steht keine (Standard für neue Apps).
const SEITENANGABE = /(?<![\p{L}\p{N}])(?:S\.\s?\d+|Seiten?\s+\d+)/u;
const HEX = /^#[0-9A-Fa-f]{6}$/;

const istText = (wert) => typeof wert === 'string' && wert.trim() !== '';

/**
 * Lädt die Farbwörter aus den Daten, in der Reihenfolge der Datei. Bricht ab, wenn ein Pflichtfeld
 * (id, de, gruppe) fehlt oder die Gruppe keine der vier ist.
 * @param {{ farbwoerter: object[] }} daten
 * @returns {object[]}
 */
export function ladeFarbwoerter(daten) {
  const liste = daten?.farbwoerter;
  if (!Array.isArray(liste)) throw new Error('Feld fehlt: farbwoerter');
  for (const eintrag of liste) {
    for (const feld of ['id', 'de', 'gruppe']) {
      if (!istText(eintrag?.[feld])) throw new Error(`Pflichtfeld fehlt: ${feld} bei ${eintrag?.id ?? '?'}`);
    }
    if (!GRUPPEN.includes(eintrag.gruppe)) throw new Error(`Gruppe unbekannt: ${eintrag.gruppe} bei ${eintrag.id}`);
  }
  return [...liste];
}

/**
 * Prüft die Daten und liefert die Fehler als Text; leer heißt in Ordnung. Ein Eintrag braucht
 * quelle.seite oder eigenentwurf: true (beides ist erlaubt). Steht quelle.seite da, ist es „S. 178“.
 * Ein ru-Wert (der Begriff der Quelle) braucht quelle.seite. Die Farbe ist ein Hex-Wert; ein Paar
 * (Kontrast) hat zwei Farben und zwei Teile, deren Namen den Namen des Eintrags bilden.
 * @param {{ farbwoerter: object[] }} daten
 * @returns {string[]}
 */
export function pruefeFarbwoerter(daten) {
  const liste = daten?.farbwoerter;
  if (!Array.isArray(liste) || liste.length === 0) return ['farbwoerter fehlt oder ist leer'];
  const fehler = [];
  const gesehen = new Set();
  for (const e of liste) {
    const id = e?.id ?? '?';
    if (gesehen.has(id)) fehler.push(`${id}: doppelte Kennung`);
    gesehen.add(id);
    if (!GRUPPEN.includes(e?.gruppe)) fehler.push(`${id}: Gruppe „${e?.gruppe}“ ist keine der vier Gruppen`);
    const seite = e?.quelle?.seite;
    if (seite === undefined && e?.eigenentwurf !== true) fehler.push(`${id}: weder quelle.seite noch eigenentwurf: true`);
    if (seite !== undefined && seite !== QUELLSEITE) fehler.push(`${id}: quelle.seite „${seite}“ ist nicht „${QUELLSEITE}“`);
    if (istText(e?.ru) && seite === undefined) fehler.push(`${id}: ru-Wert ohne quelle.seite`);
    if (!istText(e?.satz)) fehler.push(`${id}: satz fehlt`);
    if (Array.isArray(e?.farbe)) {
      const teile = e.teile;
      if (e.farbe.length !== 2 || !e.farbe.every((f) => HEX.test(f))) fehler.push(`${id}: farbe braucht zwei Hex-Werte`);
      else if (!Array.isArray(teile) || teile.length !== 2 || !teile.every(istText)) fehler.push(`${id}: teile braucht zwei Namen`);
      else if (teile.join(' und ') !== e.de) fehler.push(`${id}: de ist nicht „${teile.join(' und ')}“`);
    } else if (!HEX.test(e?.farbe ?? '')) {
      fehler.push(`${id}: farbe ist kein Hex-Wert`);
    }
  }
  return fehler;
}

/**
 * Alle Farbwörter einer Gruppe in der Reihenfolge der Datei. Eine unbekannte Gruppe liefert eine leere Liste.
 * @param {object[]} farbwoerter
 * @param {string} gruppe
 * @returns {object[]}
 */
export function gruppeFuer(farbwoerter, gruppe) {
  return farbwoerter.filter((f) => f.gruppe === gruppe);
}

/**
 * Die Farbkarte eines Farbworts. name ist der Name in der gewählten Sprache oder null, wenn er fehlt
 * (uk ist leer, solange keine geprüfte Übersetzung da ist). flaeche sind die Farben der Fläche:
 * eine Farbe, bei einem Kontrast-Paar zwei. teile sind bei einem Paar die beiden Namen.
 * @param {object} farbwort
 * @param {'de'|'ru'|'uk'} [sprache]
 * @returns {{ id: string, gruppe: string, sprache: string, name: string | null, flaeche: string[], teile: string[], hinweis: string, hinweisSatz: string, satz: string, grenzfall: string | null }}
 */
export function farbkarte(farbwort, sprache = 'de') {
  if (!SPRACHEN.includes(sprache)) throw new RangeError(`Sprache unbekannt: ${sprache}`);
  if (!GRUPPEN.includes(farbwort?.gruppe)) throw new RangeError(`Gruppe unbekannt: ${farbwort?.gruppe}`);
  const roh = farbwort[sprache];
  return {
    id: farbwort.id,
    gruppe: farbwort.gruppe,
    sprache,
    name: istText(roh) ? roh : null,
    flaeche: Array.isArray(farbwort.farbe) ? [...farbwort.farbe] : [farbwort.farbe],
    teile: Array.isArray(farbwort.teile) ? [...farbwort.teile] : [],
    hinweis: HINWEIS[farbwort.gruppe],
    hinweisSatz: HINWEIS_SATZ[farbwort.gruppe],
    satz: farbwort.satz ?? '',
    grenzfall: istText(farbwort.grenzfall) ? farbwort.grenzfall : null,
  };
}

/**
 * Der Text zum Vorlesen: Name, Hinweis, Satz und, wenn nötig, der Hinweis auf den Grenzfall.
 * Eine Karte ohne Namen in dieser Sprache hat nichts vorzulesen.
 * @param {ReturnType<typeof farbkarte>} karte
 * @returns {string}
 */
export function vorlesetext(karte) {
  if (karte.name == null) return '';
  return [`${karte.name}.`, karte.hinweisSatz, karte.satz, karte.grenzfall].filter(Boolean).join(' ');
}

/**
 * Alle Angaben eines Druckblatts als Zeilen, so wie sie auf dem Blatt stehen.
 * @param {ReturnType<typeof farbkarte>} karte
 * @returns {{ kopf: string, name: string, teile: string[], hinweis: string, satz: string, grenzfall: string | null, eigen: string }}
 */
export function blattZeilen(karte) {
  return {
    kopf: BLATT_KOPF,
    name: karte.name,
    teile: karte.teile,
    hinweis: karte.hinweis,
    satz: karte.satz,
    grenzfall: karte.grenzfall,
    eigen: BLATT_EIGEN,
  };
}

/**
 * Gesamttext eines Druckblatts, so wie es gedruckt wird (die Farbfläche selbst ist kein Text).
 * @param {{ zeilen: ReturnType<typeof blattZeilen> }} blatt
 * @returns {string}
 */
export function kartenText(blatt) {
  const z = blatt.zeilen;
  return [z.kopf, ...z.teile, z.name, z.hinweis, z.satz, z.grenzfall, z.eigen].filter(Boolean).join('\n');
}

/**
 * Ein Druckblatt je Karte, ein Blatt A4 hoch. Karten ohne Namen werden nicht gedruckt. Wirft einen
 * Fehler, wenn ein verbotenes Zeichen oder eine Seitenzahl im Blatt steht. Das Blatt hat keine
 * Namenszeile und keine Pflichtmarkierung: es trägt keine Seitenangabe (Standard für neue Apps).
 * @param {ReturnType<typeof farbkarte>[]} karten
 * @returns {Array<{ id: string, name: string, flaeche: string[], zeilen: ReturnType<typeof blattZeilen> }>}
 */
export function druckBlaetter(karten) {
  return karten.filter((k) => k.name != null).map((k) => {
    const blatt = { id: k.id, name: k.name, flaeche: k.flaeche, zeilen: blattZeilen(k) };
    const text = kartenText(blatt);
    if (VERBOTENE_ZEICHEN.test(text)) throw new Error(`Druckzeichen im Blatt ${k.id}`);
    if (SEITENANGABE.test(text)) throw new Error(`Seitenzahl im Blatt ${k.id}`);
    return blatt;
  });
}

/**
 * Schaltet ein Farbwort in der Auswahl zum Drucken um. Liefert eine neue Liste ohne Dubletten;
 * die Liste, die hereinkam, bleibt unverändert.
 * @param {string[]} auswahl
 * @param {string} id
 * @returns {string[]}
 */
export function umschalten(auswahl, id) {
  return auswahl.includes(id) ? auswahl.filter((x) => x !== id) : [...new Set([...auswahl, id])];
}

/**
 * Die gewählten Farbwörter in der Reihenfolge der Datei. Unbekannte Kennungen werden ignoriert.
 * @param {object[]} farbwoerter
 * @param {Iterable<string>} auswahl
 * @returns {object[]}
 */
export function gewaehlteFarbwoerter(farbwoerter, auswahl) {
  const gewaehlt = new Set(auswahl);
  return farbwoerter.filter((f) => gewaehlt.has(f.id));
}

/** Die Kennungen aller Farbwörter, in der Reihenfolge der Datei. */
export function alleKennungen(farbwoerter) {
  return farbwoerter.map((f) => f.id);
}

/**
 * Merkt ein angesehenes Farbwort für die Runde. Liefert eine neue Liste ohne Dubletten.
 * @param {string[]} angesehen
 * @param {string} id
 * @returns {string[]}
 */
export function merkeAngesehen(angesehen, id) {
  return angesehen.includes(id) ? [...angesehen] : [...angesehen, id];
}

/** Ist die Runde voll? Dann zeigt die App kein neues Farbwort mehr, sondern Bildschirm aus. */
export function rundeVoll(angesehen) {
  return angesehen.length >= PRO_SITZUNG;
}

/** Darf dieses Farbwort in der Runde geöffnet werden? Ein schon gesehenes immer, ein neues nur, solange die Runde nicht voll ist. */
export function darfOeffnen(angesehen, id) {
  return angesehen.includes(id) || !rundeVoll(angesehen);
}
