// Musikmomente 1-3 (Praleska docs/10, Eltern-Werkzeuge Nr. 55, Quelle S. 78-80).
//
// Tragende Entscheidungen, alle vom Validator erzwungen und nicht von der
// Redaktion:
//
// 1. GEMEINFREIHEIT WIRD GERECHNET, NICHT BEHAUPTET. Kein Werk trägt ein Feld
//    „gemeinfrei“. Die App rechnet die Schutzdauer aus dem Todesjahr gegen
//    `stand.jahr` und lehnt jedes Werk ab, das sie nicht als frei ausrechnen
//    kann. Eine behauptete Gemeinfreiheit sieht genauso aus wie eine
//    geprüfte - das ist die Lehre aus `apps/kunst-entdecker`, wo dieselbe
//    Regel über die Lizenz läuft.
// 2. KEIN QUIZ. Das Genre-Erkennen abzufragen ist `apps/musik-detektive`
//    (4-6, Ko-Nutzung), hoch/tief und laut/leise ist `apps/klang-detektive`
//    (ab 3). Hier wird vorgestellt und bewegt, nie geprüft - ein Kind, das
//    ein Genre nicht erkennt, hat nichts verfehlt.
// 3. KEINE AUFNAHME WIRD FREIGEGEBEN. Werk und Einspielung fallen bei Musik
//    auseinander: an einer Aufnahme haben Tonstudio und Mitwirkende eigene
//    Rechte. Die App liefert kein Audio, und sie sagt das, damit die
//    Werkliste nicht wie eine Freigabe liest.
// 4. KEINE EMPFEHLUNG. Werk und Komponist, sonst nichts: kein Label, kein
//    Interpret, kein Shop, kein Streaming-Dienst (werbefrei, docs/02).
// 5. DAS Ё DER QUELLE IST NICHT ÜBERNOMMEN. Dort bezeichnet es „Aufgaben für
//    Kinder mit relativ hohem Niveau der Musikalität“ - eine Einteilung von
//    Kindern nach Fähigkeit. Daraus ist eine Vertiefung geworden, die an
//    einer beobachteten HANDLUNG hängt und an keiner Eigenschaft des Kindes.
// 6. KEIN TAKT, KEIN ABZÄHLEN, KEIN MINUTENPLAN. Synchronisation mit einem
//    äußeren Puls ist vor der Schule nicht verlässlich; eine App, die sie
//    verlangt, misst einen Entwicklungsstand.

/** Gattungen der Quelle plus die beiden Bildformen, die sie nennt. */
export const GATTUNGEN = Object.freeze(['marsch', 'tanz', 'lied', 'wiegenlied', 'tierstueck', 'spieluhr']);

/** Wie ein Werk rechtlich zustande kommt - geschlossene Liste. */
export const WERKARTEN = Object.freeze(['komposition', 'volksweise', 'unbekannter-urheber']);

/** Gattungen, die notwendig einen Text haben. Ein Lied ohne Text gibt es nicht. */
export const GATTUNGEN_MIT_TEXT = Object.freeze(['lied', 'wiegenlied']);

/**
 * Altersbänder als Feld, nicht als Satz (docs/02).
 *
 * ZWEI VERSCHIEDENE LISTEN, und die Verwechslung war ein echter Fehler
 * beim Bau: `BAENDER` sind die Werte, die ein Moment in den DATEN tragen
 * kann - „1-3" heißt dort „gilt über die ganze Spanne". `FILTER` sind die
 * Knöpfe auf dem Bildschirm, und dort ist `alle` keine Spanne, sondern
 * „zeig mir alles". Solange beides dieselbe Liste war, gab der Knopf
 * „Alles zeigen" vier Momente heraus, während „2-3 Jahre" sechs zeigte -
 * genau der kumulative Fehler aus Welle 78, eine App später.
 */
export const BAENDER = Object.freeze(['1-2', '2-3', '1-3']);
export const FILTER = Object.freeze(['1-2', '2-3', 'alle']);

/** Nur für Rückwärtskompatibilität des Namens in Tests und Doku. */
export const ALTERSBAENDER = BAENDER;

/**
 * Die Achsen, auf denen ein Kontrastpaar auseinanderliegen MUSS. Ein Paar,
 * das seinen Kontrast nur behauptet, ist in Welle 77 schon einmal
 * aufgefallen (drei Karten klangen gleich) - darum steht hier, woran man
 * ihn nachrechnet.
 */
export const ACHSEN = Object.freeze({
  'hoch und tief': ['hoch', 'tief'],
  'laut und leise': ['laut', 'leise'],
  'lang und kurz': ['lang', 'kurz'],
  'schnell und langsam': ['schnell', 'langsam'],
  'Marsch und Tanz': null, // über die Gattung, nicht über die Eigenschaft
});

/**
 * ZWEI REGISTER, und das ist tragend (die Lehre aus Welle 77).
 *
 * ANWEISUNG: was der Erwachsene TUN soll. Hier ist eine Zahl eine
 * Wiederholungs- oder Zeitvorgabe, und hier ist ein Taktwort eine
 * Forderung. Darum gehen nur diese Felder durch die scharfen Netze.
 *
 * BESCHREIBUNG: was man HÖRT oder was das Kind vielleicht TUT. Hier ist
 * eine Zahl eine Tatsache („drei Töne abwärts" beschreibt die Melodie) und
 * ein Taktwort eine Verneinung („es wird nicht im Takt sein, und das muss
 * es auch nicht"). Ein Netz auf das nackte Wort trifft hier die eigene
 * Ausnahmeklausel - in Welle 78 sechsmal passiert, und beim Bau dieser
 * App wieder.
 *
 * Die Rahmenfelder (`keinQuiz`, `keineAufnahme`, `keineEmpfehlung`,
 * `quelleAnmerkung`) stehen in keinem der beiden Register: sie MÜSSEN das
 * Verbotene beim Namen nennen, um es auszuschließen.
 */
const ANWEISUNGS_FELDER = Object.freeze(['wasDuTust', 'ohneWorte', 'dannProbiere']);
const BESCHREIBENDE_FELDER = Object.freeze(['wasDeinKindVielleichtTut', 'woran', 'wasDuBemerkst']);

/** Prüf- und Punktevokabular. Nur in den Anweisungsfeldern verboten. */
export const PRUEFUNG = /(^|[^a-zäöüß])(richtig|falsch|Punkte?|Rätsel|errate|erraten|Quiz|gewonnen|verloren|Lösung|Aufgabe|prüf|teste?t?|Note)/i;

/** Takt und Abzählen in einer ANWEISUNG - wie `apps/tier-tanz-impulse`. */
export const TAKT = /(^|[^a-zäöüß])(takt|mitzähl|abzähl|zähl mit|auf den schlag|im rhythmus mitgehen|synchron)/i;

/**
 * Takt als FORDERUNG - gilt in beiden Registern. Eine Beschreibung darf
 * sagen, dass das Kind nicht im Takt sein wird; sie darf es nicht
 * verlangen. Das Verbot zielt darum auf die Konstruktion mit Modalverb,
 * nicht auf das Wort.
 */
export const TAKT_FORDERUNG = /(soll|sollte|muss|müsste|möglichst|am besten)\s[^.!?]{0,40}(im Takt|mitzähl|synchron|auf den Schlag)/i;

/**
 * Zahl als Wiederholungs- oder Zeitvorgabe in einer ANWEISUNG. Gezielt auf
 * die KONSTRUKTION, nicht auf das nackte Zahlwort: eine Ziffer, eine
 * `-mal`-Form oder eine Zeiteinheit sind Vorgaben, „zwei Stücke" und
 * „zwei Märsche" sind Mengen von Material und müssen erlaubt bleiben.
 * Ein Netz auf jedes Zahlwort hätte „Zwei Stücke hintereinander anstellen"
 * verboten - also genau die Anweisung, die den Kontrast überhaupt hörbar
 * macht.
 */
export const ABZAEHLEN = /(^|[^a-zäöüß])(\d|(?:ein|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn)mal|Minute|Sekunde|Durchgang|Wiederholung)/i;

/**
 * Eine Dezibelzahl als VORGABE. Gezielt auf die Konstruktion, nicht auf die
 * Zahl: das Feld, das die umlaufenden Zahlen (85 dB, 75 dB) als
 * unzutreffend zurückweist, MUSS sie nennen können - sonst trifft die
 * Regel ihre eigene Ausnahmeklausel. Das ist in diesem Projekt der achte
 * Fall derselben Falle.
 */
export const DB_ALS_VORGABE = /(nicht (über|mehr als)|maximal|höchstens|max\.|bis zu?|stell\w* .{0,20}auf)\s*\d+\s*(dB|Dezibel)/i;

/** Werbung, Produkt, Bezugsquelle. Nur in den Anweisungsfeldern verboten. */
export const BEZUGSQUELLE = /(Label|Interpret|Einspielung von|Spotify|Apple Music|YouTube|Amazon|Deezer|Tidal|CD kaufen|bestellen|Shop|Abo)/i;

/** Wirkversprechen - nirgends außer im Feld, das sie zurückweist. */
export const WIRKVERSPRECHEN = /(macht .{0,20}(klüger|intelligenter|schlauer)|fördert die (Intelligenz|Sprachentwicklung|kognitive)|Mozart-Effekt|steigert den IQ|hilft beim Sprechenlernen)/i;

const KYRILLISCH = /[Ѐ-ӿ]/;

const stand = (daten) => daten?.stand ?? {};

/**
 * Rechnet die Schutzdauer nach. Drei Wege, jeder mit eigener Arithmetik:
 *
 * - `komposition`: 70 Jahre nach dem Tod des Komponisten, gerechnet ab dem
 *   Ende des Todesjahres (§ 64 UrhG). Ein 1956 Gestorbener ist am
 *   9.10.2026 also NOCH NICHT frei - erst ab 1.1.2027.
 * - `unbekannter-urheber`: 70 Jahre nach dem Erscheinen (§ 66 UrhG), für
 *   Werke, deren Urheber nicht feststeht.
 * - `volksweise`: Volksgut hat keinen Urheber mehr, den man schützen
 *   könnte. ABER: ein namentlich genannter Satz oder eine Bearbeitung ist
 *   ein eigenes Werk. Darum darf eine Volksweise hier keinen Bearbeiter
 *   tragen - dann wäre die Rechnung eine andere.
 */
export function istGemeinfrei(werk, daten) {
  const jahr = stand(daten).jahr;
  const dauer = stand(daten).schutzdauerJahre;
  if (!Number.isInteger(jahr) || !Number.isInteger(dauer)) return false;
  if (!werk) return false;
  // Eine ungeklärte Textlage ist keine Freigabe: bei einem Lied hängt die
  // Frist auch am Textdichter (§ 65 Abs. 3 UrhG).
  if (!textlageGeklaert(werk)) return false;
  const jahre = massgeblicheTodesjahre(werk);
  const nachTod = jahre.length ? Math.max(...jahre) + dauer < jahr : null;
  if (werk.art === 'komposition') {
    return Number.isInteger(werk.todesjahr) && nachTod === true;
  }
  if (werk.art === 'unbekannter-urheber') {
    if (!Number.isInteger(werk.erscheinungsjahr)) return false;
    if (werk.erscheinungsjahr + dauer >= jahr) return false;
    // Der Komponist ist ungesichert, der Textdichter kann bekannt sein -
    // dann muss auch dessen Frist abgelaufen sein.
    return nachTod === null ? true : nachTod;
  }
  if (werk.art === 'volksweise') {
    if (werk.komponist != null || werk.bearbeiter != null) return false;
    return nachTod === null ? true : nachTod;
  }
  return false;
}

/**
 * ALLE Todesjahre, die die Frist bestimmen. § 65 Abs. 1 UrhG: bei
 * Miturhebern läuft sie ab dem Tod des LÄNGSTLEBENDEN. § 65 Abs. 3 UrhG:
 * bei einer Musikkomposition mit Text ab dem Tod des Längstlebenden von
 * Textdichter und Komponist, sofern beide Beiträge eigens für dieses Werk
 * geschaffen wurden - unabhängig davon, ob sie als Miturheber ausgewiesen
 * sind.
 *
 * Folge, und das war beim ersten Bau dieser App übersehen: die MELODIE
 * kann rechnerisch frei sein und das LIED als Ganzes trotzdem nicht. Eine
 * App, die Wiegenlieder auflistet, listet Musikkompositionen mit Text.
 */
export function massgeblicheTodesjahre(werk) {
  const jahre = [];
  if (Number.isInteger(werk?.todesjahr)) jahre.push(werk.todesjahr);
  for (const j of werk?.weitereUrheberTodesjahre ?? []) if (Number.isInteger(j)) jahre.push(j);
  const t = werk?.textlage;
  if (t && typeof t === 'object' && Number.isInteger(t.todesjahr)) jahre.push(t.todesjahr);
  return jahre;
}

/**
 * Die Textlage muss dastehen: `'ohne'` für Instrumentalmusik, `'volksgut'`
 * für einen Text ohne benannten Urheber, oder `{ dichter, todesjahr }`.
 * Ein Lied darf nicht `'ohne'` tragen, und ein Instrumentalstück nicht
 * stillschweigend offenlassen, ob ein Text dazugehört.
 */
export function textlageGeklaert(werk) {
  const t = werk?.textlage;
  if (t === 'ohne') return !GATTUNGEN_MIT_TEXT.includes(werk?.gattung);
  if (t === 'volksgut') return true;
  if (t && typeof t === 'object') return Boolean(t.dichter) && Number.isInteger(t.todesjahr);
  return false;
}

/**
 * Das Jahr, ab dem ein Todesjahr frei ist - als Satz, damit die Rechnung
 * auf dem Bildschirm steht und nicht nur im Code.
 */
export function freiAbSatz(daten) {
  const { jahr, schutzdauerJahre: dauer } = stand(daten);
  if (!Number.isInteger(jahr) || !Number.isInteger(dauer)) return '';
  return `Stand ${jahr}: frei ist, wer ${jahr - dauer - 1} oder früher gestorben ist.`;
}

export function werkVon(daten, id) {
  return (daten?.werke ?? []).find((w) => w.id === id) ?? null;
}

export function momentVon(daten, id) {
  return (daten?.momente ?? []).find((m) => m.id === id) ?? null;
}

/** Die Werke eines Moments, in der Reihenfolge der Daten. */
export function werkeZumMoment(daten, id) {
  return (momentVon(daten, id)?.werke ?? []).map((w) => werkVon(daten, w)).filter(Boolean);
}

/**
 * Momente für einen Filter. `alle` zeigt ALLES - sonst wäre der Knopf eine
 * Lüge. Ein konkretes Band zeigt die Momente dieses Bandes plus die, die
 * über die ganze Spanne gelten („1-3").
 */
export function momenteFuer(daten, filter) {
  const momente = daten?.momente ?? [];
  if (filter === 'alle') return [...momente];
  if (!FILTER.includes(filter)) return [];
  return momente.filter((m) => m.altersband === filter || m.altersband === '1-3');
}

/** Wie ein Werk benannt wird: Komponist nur, wenn es einen gibt. */
export function werkZeile(werk) {
  if (!werk) return '';
  if (werk.komponist) return `${werk.komponist}: „${werk.titel}“`;
  if (werk.herkunft) return `„${werk.titel}“ (${werk.herkunft})`;
  if (werk.art === 'unbekannter-urheber') return `„${werk.titel}“ (${werk.erscheinungsjahr}, Urheber nicht gesichert)`;
  return `„${werk.titel}“ (Volksweise)`;
}

/**
 * Der Text, der vorgelesen wird. Kyrillisches bleibt DRAUSSEN: `vorlesen()`
 * setzt nur `utterance.lang`, und ohne uk/ru-Stimme liest eine deutsche
 * Stimme kyrillische Schrift vor. Der Originaltitel wird darum angezeigt,
 * nie gesprochen (dieselbe Lösung wie in `apps/sprachbruecken-impulskarten`).
 */
export function vorleseText(daten, momentId) {
  const m = momentVon(daten, momentId);
  if (!m) return '';
  const teile = [
    m.titel,
    ...(m.wasDuTust ?? []),
    m.wasDeinKindVielleichtTut,
    ...werkeZumMoment(daten, momentId).map((w) => (w.komponist ? `${w.komponist}: ${w.titel}` : w.titel)),
    m.sicherheit,
    `Aufhören: ${m.abbruchzeichen}`,
  ].filter(Boolean);
  return teile.join(' ').replace(new RegExp(KYRILLISCH.source, 'gu'), '');
}

function texteAus(objekt, felder) {
  const flach = [];
  for (const feld of felder) {
    const wert = objekt?.[feld];
    if (Array.isArray(wert)) flach.push(...wert.map(String));
    else if (wert) flach.push(String(wert));
  }
  return flach;
}

/**
 * Validiert die Daten. Alles Tragende steht hier und nicht in der Redaktion.
 */
export function pruefeDaten(daten) {
  const fehler = [];
  const werke = daten?.werke ?? [];
  const momente = daten?.momente ?? [];
  const kontraste = daten?.kontraste ?? [];
  const vertiefungen = daten?.vertiefungen ?? [];

  if (!Number.isInteger(stand(daten).jahr)) fehler.push('stand.jahr fehlt – ohne Jahr ist keine Schutzdauer zu rechnen');
  if (stand(daten).schutzdauerJahre !== 70) fehler.push('stand.schutzdauerJahre muss 70 sein (§ 64 UrhG)');
  if (!werke.length) fehler.push('keine Werke');
  if (!momente.length) fehler.push('keine Hörmomente');

  // --- Werke: Gemeinfreiheit wird gerechnet, und jedes Werk muss sie bestehen
  const ids = new Set();
  for (const w of werke) {
    const wo = `Werk ${w.id ?? '?'}`;
    if (!w.id) fehler.push(`${wo}: id fehlt`);
    if (ids.has(w.id)) fehler.push(`${wo}: id doppelt`);
    ids.add(w.id);
    if (!w.titel) fehler.push(`${wo}: titel fehlt`);
    if (!WERKARTEN.includes(w.art)) fehler.push(`${wo}: unbekannte art „${w.art}“`);
    if (!GATTUNGEN.includes(w.gattung)) fehler.push(`${wo}: unbekannte gattung „${w.gattung}“`);
    if ('gemeinfrei' in w) fehler.push(`${wo}: das Feld „gemeinfrei“ darf es nicht geben – die App rechnet es aus`);
    if (w.art === 'komposition' && !w.komponist) fehler.push(`${wo}: eine Komposition braucht einen Komponisten`);
    if (w.art === 'komposition' && !Number.isInteger(w.todesjahr)) fehler.push(`${wo}: ohne Todesjahr ist die Schutzdauer nicht zu rechnen`);
    if (w.art === 'volksweise' && w.komponist) fehler.push(`${wo}: eine Volksweise hat keinen Komponisten`);
    if (w.art === 'unbekannter-urheber' && !Number.isInteger(w.erscheinungsjahr)) fehler.push(`${wo}: ohne Erscheinungsjahr ist die Schutzdauer nicht zu rechnen`);
    if (w.bearbeiter) fehler.push(`${wo}: ein namentlich genannter Satz ist ein eigenes Werk – diese App nennt keine Bearbeitungen`);
    if (!textlageGeklaert(w)) {
      fehler.push(`${wo}: die Textlage ist nicht geklärt – bei einer Musikkomposition mit Text läuft die Frist auch ab dem Tod des Textdichters (§ 65 Abs. 3 UrhG)`);
    }
    if (GATTUNGEN_MIT_TEXT.includes(w.gattung) && w.textlage === 'ohne') {
      fehler.push(`${wo}: Gattung „${w.gattung}“ hat notwendig einen Text – „ohne“ ist dort falsch`);
    }
    if ('liedtext' in w || 'text' in w || 'strophe' in w) fehler.push(`${wo}: kein Liedtext in dieser App`);
    if (!istGemeinfrei(w, daten)) fehler.push(`${wo}: nicht als gemeinfrei ausrechenbar – nicht verwendbar`);
    if (!w.woran) fehler.push(`${wo}: woran fehlt – ohne Hinhörhilfe ist ein Titel nur ein Titel`);
    if (!Array.isArray(w.eigenschaft) || !w.eigenschaft.length) fehler.push(`${wo}: eigenschaft fehlt`);
  }

  // --- Momente
  for (const m of momente) {
    const wo = `Moment ${m.id ?? '?'}`;
    if (!BAENDER.includes(m.altersband)) fehler.push(`${wo}: altersband „${m.altersband}“ ist kein gültiges Band`);
    if (!Array.isArray(m.wasDuTust) || m.wasDuTust.length < 2) fehler.push(`${wo}: wasDuTust braucht mindestens zwei Schritte`);
    if (!m.wasDeinKindVielleichtTut) fehler.push(`${wo}: wasDeinKindVielleichtTut fehlt`);
    if (!/vielleicht|oder|kann|manche|alles davon|nicht|muss es auch nicht|erlaubt|Glück/i.test(m.wasDeinKindVielleichtTut ?? '')) {
      fehler.push(`${wo}: wasDeinKindVielleichtTut liest wie eine Erwartung – es muss offen bleiben`);
    }
    if (!m.abbruchzeichen) fehler.push(`${wo}: abbruchzeichen fehlt`);
    if (!GATTUNGEN.includes(m.gattung)) fehler.push(`${wo}: unbekannte gattung „${m.gattung}“`);
    for (const w of m.werke ?? []) {
      if (!werkVon(daten, w)) fehler.push(`${wo}: verweist auf unbekanntes Werk „${w}“`);
    }
  }

  // --- Kontraste: der behauptete Kontrast muss in den Daten liegen
  for (const k of kontraste) {
    const wo = `Kontrast ${k.id ?? '?'}`;
    if (!Array.isArray(k.paar) || k.paar.length !== 2) { fehler.push(`${wo}: paar braucht genau zwei Werke`); continue; }
    const [a, b] = k.paar.map((id) => werkVon(daten, id));
    if (!a || !b) { fehler.push(`${wo}: paar verweist auf ein unbekanntes Werk`); continue; }
    if (a.id === b.id) fehler.push(`${wo}: ein Werk gegen sich selbst ist kein Kontrast`);
    if (!(k.eigenschaft in ACHSEN)) { fehler.push(`${wo}: unbekannte Achse „${k.eigenschaft}“`); continue; }
    const achse = ACHSEN[k.eigenschaft];
    if (achse === null) {
      if (a.gattung === b.gattung) fehler.push(`${wo}: „${k.eigenschaft}“ verlangt zwei verschiedene Gattungen, beide sind „${a.gattung}“`);
    } else {
      const [x, y] = achse;
      const traegt = (w, wert) => (w.eigenschaft ?? []).includes(wert);
      const auseinander = (traegt(a, x) && traegt(b, y)) || (traegt(a, y) && traegt(b, x));
      if (!auseinander) fehler.push(`${wo}: die Achse „${k.eigenschaft}“ steht nicht in den Werken – ${a.id} hat [${a.eigenschaft}], ${b.id} hat [${b.eigenschaft}]`);
    }
    if (!k.ohneWorte) fehler.push(`${wo}: ohneWorte fehlt – ein Einjähriger hat die Wörter noch nicht`);
    if (!k.wasDuBemerkst) fehler.push(`${wo}: wasDuBemerkst fehlt`);
  }

  // --- Vertiefungen: an einer HANDLUNG, nie an einer Eigenschaft des Kindes
  for (const v of vertiefungen) {
    const wo = `Vertiefung ${v.id ?? '?'}`;
    if (!v.wennDuSiehst) fehler.push(`${wo}: wennDuSiehst fehlt`);
    if (!v.dannProbiere) fehler.push(`${wo}: dannProbiere fehlt`);
    if (!v.nichtAls) fehler.push(`${wo}: nichtAls fehlt – die Vertiefung muss sagen, was sie nicht ist`);
    if (/musikalisch(e|es|er)? (Kind|Begabung|Veranlagung)|begabt|talentiert|Niveau|hohes? Niveau|weiter als|fortgeschritten/i.test(v.wennDuSiehst ?? '')) {
      fehler.push(`${wo}: wennDuSiehst ordnet das Kind ein statt eine Handlung zu beschreiben`);
    }
    if (!/^(Ihr Kind|Das Kind)\s+\w+/.test(v.wennDuSiehst ?? '')) {
      fehler.push(`${wo}: wennDuSiehst muss eine beobachtbare Handlung benennen („Ihr Kind …“)`);
    }
  }

  // --- Verbotsnetze, nur auf den Anweisungsfeldern
  const traeger = [...werke, ...momente, ...kontraste, ...vertiefungen];
  for (const o of traeger) {
    const wo = `${o.id ?? '?'}`;
    // Scharf, nur auf Anweisungen.
    for (const text of texteAus(o, ANWEISUNGS_FELDER)) {
      if (TAKT.test(text)) fehler.push(`${wo}: Takt oder Synchronisation in einer Anweisung: „${text.slice(0, 60)}“`);
      if (ABZAEHLEN.test(text)) fehler.push(`${wo}: Zahl als Vorgabe in einer Anweisung – kein Abzählen, kein Minutenplan: „${text.slice(0, 60)}“`);
    }
    // In BEIDEN Registern: hier wird nichts abgefragt, nichts beworben,
    // nichts versprochen, und der Takt wird nirgends verlangt.
    for (const text of texteAus(o, [...ANWEISUNGS_FELDER, ...BESCHREIBENDE_FELDER])) {
      if (PRUEFUNG.test(text)) fehler.push(`${wo}: Prüfvokabular – hier wird nichts abgefragt: „${text.slice(0, 60)}“`);
      if (BEZUGSQUELLE.test(text)) fehler.push(`${wo}: Bezugsquelle oder Produkt: „${text.slice(0, 60)}“`);
      if (WIRKVERSPRECHEN.test(text)) fehler.push(`${wo}: Wirkversprechen: „${text.slice(0, 60)}“`);
      if (TAKT_FORDERUNG.test(text)) fehler.push(`${wo}: der Takt wird verlangt: „${text.slice(0, 60)}“`);
    }
  }

  // --- Kyrillisch nur im Originaltitel und in der Quellenangabe
  const erlaubtKyrillisch = new Set([
    ...werke.map((w) => w.original).filter(Boolean),
    ...werke.map((w) => w.zuschreibung).filter(Boolean),
    daten?.quelle?.werk, daten?.quelle?.rechte, daten?.quelle?.nachgezaehlt,
    daten?.quelleAnmerkung,
  ].filter(Boolean));
  const suchen = (wert, pfad) => {
    if (typeof wert === 'string') {
      if (KYRILLISCH.test(wert) && !erlaubtKyrillisch.has(wert)) {
        fehler.push(`${pfad}: kyrillische Schrift außerhalb von Originaltitel und Quellenangabe`);
      }
      return;
    }
    if (Array.isArray(wert)) { wert.forEach((x, i) => suchen(x, `${pfad}[${i}]`)); return; }
    if (wert && typeof wert === 'object') {
      for (const [k, v] of Object.entries(wert)) suchen(v, `${pfad}.${k}`);
    }
  };
  suchen(daten, 'daten');

  // --- Pflichtsätze: was die App über sich selbst sagen MUSS
  const pflicht = [
    ['hinweis', /in Ihrer Hand/, 'das Gerät gehört dem Erwachsenen'],
    ['hinweis', /sieht keinen Bildschirm/, 'der Kind-Screen muss ausgeschlossen sein'],
    ['keinVersprechen', /nicht belegt/, 'das fehlende Wirkversprechen muss ausgesprochen sein'],
    ['keinVersprechen', /Mozart-Effekt/, 'die bekannteste Behauptung muss beim Namen genannt und zurückgewiesen werden'],
    ['keinQuiz', /kein richtig, kein falsch|Kein richtig, kein falsch/, 'das fehlende Richtig-Falsch muss dastehen'],
    ['keineAufnahme', /Werke – nicht Aufnahmen|Werke, nicht Aufnahmen/, 'der Unterschied Werk/Aufnahme muss dastehen'],
    ['keineAufnahme', /eigene Rechte/, 'der Leistungsschutz der Aufnahme muss benannt sein'],
    ['keineEmpfehlung', /kein Label/, 'die Werbefreiheit muss ausgesprochen sein'],
    ['abbruch', /Aufhören ist die Regel/, 'das Aufhören muss ausdrücklich erlaubt sein'],
    ['lautstaerke', /[Kk]eine Kopfhörer/, 'Kopfhörer müssen ausgeschlossen sein'],
    ['lautstaerke', /Zimmerstimme/, 'die Lautstärke braucht eine Regel ohne Messgerät'],
    ['lautstaerke', /ansprechbar/, 'der belegbare Grund für offene Lautsprecher muss dastehen'],
    ['lautstaerke', /keine Zahl|keinen Grenzwert|kein Grenzwert/, 'dass es keinen belegten Kinder-Grenzwert gibt, muss ausgesprochen sein'],
    ['keineAufnahme', /Textdichter|Text/, 'der Text als eigenes Werk muss benannt sein'],
    ['quelleAnmerkung', /Ё/, 'die Differenzierung der Quelle muss beim Zeichen genannt werden'],
    ['quelleAnmerkung', /nicht übernommen/, 'und ausdrücklich als nicht übernommen'],
  ];
  for (const [feld, muster, warum] of pflicht) {
    if (!muster.test(String(daten?.[feld] ?? ''))) fehler.push(`${feld}: ${warum}`);
  }
  // Eine Dezibelzahl darf genannt und zurückgewiesen, aber nirgends als
  // Vorgabe gesetzt werden - es gibt keinen belegten Kinder-Grenzwert.
  for (const feld of ['lautstaerke', 'hinweis', 'abbruch', 'keinVersprechen']) {
    if (DB_ALS_VORGABE.test(String(daten?.[feld] ?? ''))) {
      fehler.push(`${feld}: eine Dezibelzahl als Vorgabe – für Kleinkinder ist keine belegt`);
    }
  }

  // --- Quellbilanz: das Dokument darf nicht mehr behaupten als die Daten tragen
  const z = daten?.quelle?.zahlen ?? {};
  if (z.zieleQuelle !== 14) fehler.push('quelle.zahlen: die Quelle nennt auf S. 78–80 vierzehn Ziele');
  if (z.repertoireQuelle !== 70) fehler.push('quelle.zahlen: die Quelle nennt 70 Hör-Stücke');
  const ziele = daten?.ziele ?? [];
  if (ziele.length !== 14) fehler.push(`ziele: ${ziele.length} aufgeführt, die Quelle hat 14`);
  const uebernommen = ziele.filter((x) => x.uebernommen).length;
  if (uebernommen !== z.zieleUebernommen) fehler.push(`quelle.zahlen: ${z.zieleUebernommen} übernommene Ziele behauptet, die Liste trägt ${uebernommen}`);
  if (z.zieleUebernommen + z.zieleNichtUebernommen !== 14) fehler.push('quelle.zahlen: übernommen plus nicht übernommen muss 14 ergeben');
  for (const x of ziele) {
    if (!x.uebernommen && !x.warum) fehler.push(`Ziel ${x.nr}: nicht übernommen, aber ohne Begründung`);
  }
  const ausListe = werke.filter((w) => w.ausQuellListe).length;
  if (ausListe !== z.repertoireUebernommen) fehler.push(`quelle.zahlen: ${z.repertoireUebernommen} übernommene Stücke behauptet, die Werkliste trägt ${ausListe}`);
  if (z.repertoireUebernommen + z.repertoireNichtUebernommen !== 70) fehler.push('quelle.zahlen: übernommen plus nicht übernommen muss 70 ergeben');
  if (!/Eigenproduktion/.test(daten?.quelle?.rechte ?? '')) fehler.push('quelle.rechte muss „Eigenproduktion“ aussprechen');

  // --- Kein totes Angebot: jedes Werk wird irgendwo gebraucht
  const benutzt = new Set([...momente.flatMap((m) => m.werke ?? []), ...kontraste.flatMap((k) => k.paar ?? [])]);
  for (const w of werke) {
    if (!benutzt.has(w.id)) fehler.push(`Werk ${w.id}: steht in keinem Moment und in keinem Kontrast – ein Werk, zu dem niemand kommt`);
  }
  // --- Und jede Gattung, die ein Moment behauptet, hat auch ein Werk dazu
  for (const m of momente) {
    const dazu = werkeZumMoment(daten, m.id);
    if (dazu.length && !dazu.some((w) => w.gattung === m.gattung)) {
      fehler.push(`Moment ${m.id}: gattung „${m.gattung}“, aber kein Werk dieser Gattung dabei`);
    }
  }
  // --- Die Filter: jeder zeigt etwas, „alle" zeigt wirklich alles, und
  //     kein konkretes Band zeigt mehr als „alle". Die drei Invarianten
  //     aus docs/02 (Welle 78), hier auf den Altersfilter angewandt.
  for (const f of FILTER) {
    if (!momenteFuer(daten, f).length) fehler.push(`Filter ${f}: kein Moment – ein Filter ohne Wirkung`);
  }
  const alle = momenteFuer(daten, 'alle').length;
  if (alle !== momente.length) fehler.push(`Filter alle: zeigt ${alle} von ${momente.length} Momenten – „Alles zeigen" muss alles zeigen`);
  for (const f of FILTER) {
    if (momenteFuer(daten, f).length > alle) fehler.push(`Filter ${f}: zeigt mehr als „alle"`);
  }
  // Und jedes Band muss mindestens einen EIGENEN Moment haben, sonst ist
  // der Knopf nur eine Kopie von „alle".
  for (const b of BAENDER) {
    if (!momente.some((m) => m.altersband === b)) fehler.push(`Band ${b}: kein Moment trägt es – ein Band ohne eigenen Inhalt`);
  }
  // --- Die drei Gattungen der Quelle (Marsch, Tanz, Lied) müssen vorkommen
  for (const g of ['marsch', 'tanz', 'lied']) {
    if (!werke.some((w) => w.gattung === g)) fehler.push(`Gattung ${g}: die Quelle nennt sie als primäre Gattung, es gibt kein Werk dazu`);
  }

  return fehler;
}
