// Mini-Oper-Baukasten (offline, ohne KI): der Kern. Ohne DOM. Zufall nur über die
// übergebene Funktion rng, damit die Tests deterministisch laufen.
//
// Aus der Quelle (Praleska, Musikteil, Gruppe «ФАНТАЗЕРЫ», Katalog docs/10 Nr. 91) stammen nur:
//   S. 262  Ziel: zu gemeinsamen Liedimprovisationen und zum Komponieren von Mikroopern
//           nach Märchen anregen; Figurenbeispiele (als Vorschlag).
//   S. 269  Überschrift und 18 Titel (nur Titel, ohne Text und Musik).
//   S. 270  Klangfarbe passend zum Charakter der Musik oder zum Teil eines Stücks wählen.
// Alles andere ist Eigenentwurf: Anzahlen, Szenenfolge, Requisitenliste, Instrumentenbeispiele,
// der Druckbogen und die deutschen Entsprechungen der Figurennamen.
// Die App speichert nichts und ordnet keiner Figur ein Instrument zu.

/** Name der App, wie er in Titel und Überschrift steht. */
export const APP_NAME = 'Mini-Oper-Baukasten (offline, ohne KI)';

export const SZENEN = Object.freeze({ min: 3, max: 5, standard: 3 });
export const ROLLEN = Object.freeze({ min: 2, max: 6, standard: 2 });
export const REQUISITEN_ANZAHL = 4;

/** Gedruckte Seitenzahlen der Quelle (Praleska, Musikteil). */
export const SEITE = Object.freeze({ figuren: 262, anregung: 262, titel: 269, klang: 270 });

/** Die 18 Titel aus S. 269, in der Schreibweise der Quelle. Nur Titel, ohne Text und Musik. */
export const TITEL = Object.freeze([
  'Рэдзька',
  'Муха-цокотуха',
  'Аленушка и лиса',
  'Колосок',
  'Кот, Петух и Лиса',
  'Снегурочка',
  'Про волшебника Оха и Дуню-ленивицу',
  'Приключения двух глупых лягушат',
  'Гадкий утенок',
  'Принцесса на горошине',
  'Соловей',
  'Пятеро из одного стручка',
  'Лягушка-путешественница',
  'Щелкунчик',
  'Спящая красавица',
  'Петя и волк',
  'Красная Шапочка',
  'Золушка',
]);

/**
 * Figurenbeispiele aus S. 262 (dort mit „и др.“, also und andere). Das Original steht
 * wörtlich in `quelle`; `deutsch` ist eine Eigenübersetzung.
 */
export const FIGUREN = Object.freeze([
  Object.freeze({ quelle: 'стрекоза', deutsch: 'Libelle' }),
  Object.freeze({ quelle: 'муравей', deutsch: 'Ameise' }),
  Object.freeze({ quelle: 'бегемот', deutsch: 'Nilpferd' }),
  Object.freeze({ quelle: 'журавль', deutsch: 'Kranich' }),
  Object.freeze({ quelle: 'солдат', deutsch: 'Soldat' }),
  Object.freeze({ quelle: 'матрос', deutsch: 'Matrose' }),
  Object.freeze({ quelle: 'физкультурник', deutsch: 'Sportler' }),
  Object.freeze({ quelle: 'снеговик', deutsch: 'Schneemann' }),
]);

/** Allgemeine Dinge für die Requisitenliste (Eigenentwurf, nicht aus der Quelle). */
export const REQUISITEN = Object.freeze([
  'Tuch', 'Hut', 'Korb', 'Stab', 'Schal', 'Stein', 'Blatt', 'Schachtel',
  'Decke', 'Kissen', 'Band', 'Becher', 'Ball', 'Stuhl', 'Tasche', 'Schirm',
]);

/** Beispiele für Instrumente aus der Kita (Eigenentwurf, ohne Quellenbezug). Keine Zuordnung zu Figuren. */
export const INSTRUMENTE = Object.freeze([
  'Triangel', 'Rassel', 'Handtrommel', 'Glockenspiel', 'Klanghölzer', 'Schellenkranz', 'Xylophon', 'Metallophon',
]);

/** Klang-Hinweis, sinngemäß nach S. 270. */
export const KLANG_HINWEIS = 'Beim Orchestrieren die Klangfarbe passend zum Charakter der Musik oder zum Teil eines Stücks wählen (S. 270, sinngemäß).';

/** Ziel der Gruppe, sinngemäß nach S. 262. */
export const ANREGUNG_QUELLE = 'Ziel nach S. 262 (sinngemäß): zu gemeinsamen Liedimprovisationen und zum Komponieren von Mikroopern nach Märchen anregen.';

/** Eigenentwurf: das Gerüst ist ein Impuls. */
export const IMPULS_HINWEIS = 'Eigenentwurf: Das Gerüst ist ein Impuls, kein fertiges Skript. Die Kinder komponieren mit.';

/**
 * Begrenzt eine Zahl auf [min, max]. Alles, was keine endliche Zahl ist, ergibt den Standardwert.
 * @param {unknown} wert
 * @param {number} min @param {number} max @param {number} standard
 * @returns {number}
 */
export function begrenze(wert, min, max, standard) {
  if (typeof wert !== 'number' && typeof wert !== 'string') return standard;
  const zahl = Number(wert);
  if (!Number.isFinite(zahl)) return standard;
  return Math.min(max, Math.max(min, Math.round(zahl)));
}

/** Anzahl der Szenen, 3 bis 5 (Eigenentwurf). */
export const szenenAnzahl = (wert) => begrenze(wert, SZENEN.min, SZENEN.max, SZENEN.standard);

/** Anzahl der Rollenplätze, 2 bis 6 (Eigenentwurf). */
export const rollenAnzahl = (wert) => begrenze(wert, ROLLEN.min, ROLLEN.max, ROLLEN.standard);

/**
 * Leere Szenen mit Platzhaltern. Ohne Stichwort: das Feld füllt die Fachkraft am Bildschirm.
 * @returns {ReadonlyArray<{nummer: number, bezeichnung: string}>}
 */
export function erzeugeSzenen(anzahl) {
  return Array.from({ length: szenenAnzahl(anzahl) }, (_, i) => Object.freeze({
    nummer: i + 1,
    bezeichnung: `Szene ${i + 1}`,
  }));
}

/** Rollenplätze als reine Platzhalter („Rolle 1“, „Rolle 2“ …). Keine Namen. */
export function erzeugeRollen(anzahl) {
  return Array.from({ length: rollenAnzahl(anzahl) }, (_, i) => `Rolle ${i + 1}`);
}

/**
 * Prüft, dass eine Zufallsquelle übergeben wurde. Der Kern wählt sie nie selbst.
 * @returns {() => number} dieselbe Funktion
 */
export function pruefeZufall(rng) {
  if (typeof rng !== 'function') throw new TypeError('Zufallsquelle fehlt: rng muss eine Funktion sein.');
  return rng;
}

/**
 * Zieht `anzahl` verschiedene Einträge aus `liste` (Fisher-Yates bis zur Anzahl). Die Liste
 * selbst bleibt unverändert. `rng` liefert Zahlen von 0 (inklusive) bis 1 (exklusive).
 * @template T
 * @param {readonly T[]} liste @param {number} anzahl @param {() => number} rng
 * @returns {T[]}
 */
export function ziehe(liste, anzahl, rng) {
  pruefeZufall(rng);
  const kopie = [...liste];
  const wunsch = Number.isFinite(anzahl) ? Math.max(0, Math.floor(anzahl)) : 0;
  const n = Math.min(wunsch, kopie.length);
  for (let i = 0; i < n; i += 1) {
    const r = rng();
    if (typeof r !== 'number' || !(r >= 0 && r < 1)) {
      throw new RangeError('rng muss eine Zahl von 0 (inklusive) bis 1 (exklusive) liefern.');
    }
    const j = i + Math.floor(r * (kopie.length - i));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie.slice(0, n);
}

/** Vier Dinge aus der festen Liste der allgemeinen Dinge (Eigenentwurf). */
export function erzeugeRequisiten(rng, anzahl = REQUISITEN_ANZAHL) {
  return ziehe(REQUISITEN, anzahl, rng);
}

/** Gibt den Titel zurück, wenn er in der Auswahl aus S. 269 steht, sonst null. */
export function titelGueltig(titel) {
  return typeof titel === 'string' && TITEL.includes(titel) ? titel : null;
}

/**
 * Das Gerüst für den Bildschirm und den Druckbogen. Sind die Requisiten übergeben, wird der
 * Zufall nicht gefragt; nur unbekannte Dinge fallen dann weg.
 * @param {{szenen?: number, rollen?: number, titel?: string|null, requisiten?: string[]}} [optionen]
 * @param {() => number} [rng] nur nötig, wenn keine Requisiten übergeben werden
 */
export function erzeugeGeruest({ szenen = SZENEN.standard, rollen = ROLLEN.standard, titel = null, requisiten } = {}, rng) {
  let auswahl;
  if (requisiten === undefined) {
    auswahl = erzeugeRequisiten(rng);
  } else if (Array.isArray(requisiten)) {
    auswahl = requisiten.filter((r) => REQUISITEN.includes(r));
  } else {
    throw new TypeError('requisiten muss eine Liste sein.');
  }
  return Object.freeze({
    szenen: erzeugeSzenen(szenen),
    rollen: erzeugeRollen(rollen),
    titel: titelGueltig(titel),
    requisiten: Object.freeze(auswahl),
    klang: KLANG_HINWEIS,
    anregung: ANREGUNG_QUELLE,
    impuls: IMPULS_HINWEIS,
  });
}
