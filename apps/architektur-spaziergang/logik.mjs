// Architektur-Spaziergang (Praleska docs/10, Eltern-Werkzeuge Nr. 65, Quelle
// S. 274-276: раздел «Восприятие искусства», группа «ФАНТАЗЕРЫ»; Liste
// «Архитектура» S. 278).
//
// TRAGENDE ENTSCHEIDUNG 1: DIE VORBILDLISTE IST NICHT ERSETZT, SONDERN WEG.
//
// Die Quelle nennt vierzehn Baudenkmaeler als Vorbildliste - zehn einzelne
// plus die Rathaeuser in vier Staedten. Alle vierzehn stehen in Belarus. Der
// Katalog will deutsche Baukultur an ihrer Stelle; vierzehn deutsche Bauwerke
// wuerden aber genau dasselbe Problem haben, nur andersherum: wer nicht in
// ihrer Naehe wohnt, hat nichts davon. Die Quelle sagt am Ende derselben
// Aufzaehlung selbst, womit gearbeitet werden soll - mit den Gebaeuden «своей
// местности», der eigenen Gegend. Diese App kennt Ihre Gegend nicht und
// behauptet es auch nicht: sie hat Suchauftraege statt einer Liste.
//
// TRAGENDE ENTSCHEIDUNG 2: DAS ZIEL „AUSSEHEN HAENGT VON DER BESTIMMUNG AB"
// GILT NUR MANCHMAL - UND DIE GEGENBEISPIELE SIND KARTEN.
//
// Scheune, Wasserturm und Halle verraten ihre Bestimmung. Ein Rathaus hat
// keine Form, an der man es erkennt; Wohnung und Buero sehen gleich aus; was
// in einem Haus drin ist, sieht man gar nicht. Deshalb hat jede Karte eine
// `art`, und drei Karten sind ausdruecklich `nichtErkennbar`. `pruefeDaten`
// verlangt mindestens drei davon und dass der Absatz `nurManchmal` eine von
// ihnen namentlich nennt - sonst stuende die Einschraenkung nur als Floskel
// da. Dieselbe Unterscheidung traegt schon „Design-Entdecker": Nutzungsart
// gegen Bauweise. Hier ist sie um die dritte Gruppe erweitert.
//
// TRAGENDE ENTSCHEIDUNG 3: KEINE ERKLAERUNG OHNE IHREN SICHERHEITSGRAD.
//
// „Der Wasserturm ist hoch, weil die Hoehe den Druck macht" ist eine gute
// Erklaerung. „Der Schlauchturm diente dem Trocknen der Schlaeuche" ist eine
// verbreitete Erklaerung, die beim Bau dieser App nicht zu belegen war - und
// steht deshalb NICHT auf der Karte, sondern als Luecke. Jedes `fuerErwachsene`
// traegt darum ein `sicherheit`: `belegt` (dann ist eine `quelle` Pflicht),
// `vereinfachung` oder `offen`. Keine Erklaerung kann sich als belegt
// ausgeben, ohne ihre Quelle mitzubringen.
//
// TRAGENDE ENTSCHEIDUNG 4: DREI QUELLZIELE SIND ZURUECKGEWIESEN.
//
// Nr. 16 will Kinder mit Verpackungsdesign, Grossplakaten und AUSSENWERBUNG
// bekannt machen, Nr. 17 mit „Kriterien zur Bewertung von Massenproduktion".
// Das erste ist Werbung, das zweite Kaufberatung. Nr. 11 will elf Fachwoerter
// einueben - „Stilisierung", „Faktur", „Modul" -, von denen keines hilft,
// wenn man vor einem Haus steht. Acht weitere Ziele gehoeren zu Apps, die es
// schon gibt (Design-Entdecker, Kunst gucken, Erste Kuenstler,
// Kita-Kartograph, Dinge des Alltags).

/** Die Arten der Karten. Die dritte ist der Grund, warum es die ersten gibt. */
export const ARTEN = Object.freeze(['bauform', 'ausstattung', 'nichtErkennbar', 'kleineForm', 'gruen']);

/** Wie sicher eine Erklaerung ist. `belegt` verlangt eine Quelle. */
export const SICHERHEITEN = Object.freeze(['belegt', 'vereinfachung', 'offen']);

/** Die Einordnungen der siebzehn Quellziele. */
export const EINORDNUNGEN = Object.freeze(['gebaut', 'nurEingeschraenkt', 'anderesThema', 'nichtUebernommen']);

/** Die Apps, auf die ein Ziel verwiesen werden kann. */
export const GENANNTE_APPS = Object.freeze(['Kunst gucken', 'Kunst-Entdecker', 'Erste Künstler',
  'Design-Entdecker', 'Kita-Kartograph', 'Dinge des Alltags', 'Werbekennzeichnung']);

/** Wie viele Ziele der Abschnitt traegt (nachgezaehlt S. 274-276). */
export const ZIELE = 17;

/** Wie viele Baudenkmaeler die Liste S. 278 nennt (zehn einzelne + vier Rathaeuser). */
export const DENKMAELER_DER_QUELLE = 14;

/** Die drei kleinen Architekturformen, die die Quelle namentlich nennt. */
export const KLEINE_FORMEN_DER_QUELLE = Object.freeze(['Laterne', 'Brunnen', 'Zaun']);

/** Was auf das Blatt fuer den Spaziergang gedruckt wird. Die Sicherheitsregel
 *  MUSS dabei sein: ein Zettel, den man mitnimmt, ist genau der Ort, an dem
 *  sie gebraucht wird (Review Welle 81: `sicherheitImmer` stand einmal nur
 *  auf dem Bildschirm). */
export const DRUCK_ABSAETZE = Object.freeze(['sicherheitImmer', 'impulseSindOffen', 'nurManchmal']);

/**
 * Eine Erwartung an das Kind: eine Antwort, die richtig sein soll, etwas, das
 * es erkennen muss, ein Haken. Getroffen wird die Konstruktion - der Absatz,
 * der die Offenheit erklaert, muss das Gegenteil benennen duerfen (Falle A).
 */
export const ERWARTUNG = /\bdie\s+(?:richtige|falsche)\s+Antwort\b|\b(?:richtig|falsch)\s+(?:beantwortet|geantwortet|benannt)\b|\b(?:soll|sollte|muss|müsste)\s+(?:es\s+|das\s+|dein\s+Kind\s+|Ihr\s+Kind\s+)?(?:erkennen|wissen|benennen|nennen\s+können|sagen\s+können|erraten)\b|\babfragen\b|\babhaken\b|\bLösungsblatt\b|\brichtig\s+gemacht\b/i;

/**
 * Eine Bewertung: Punkte, Stufen, Haken, Vergleich mit anderen Kindern.
 *
 * Die Haken-Konstruktion steht mit im Netz, weil die Ausschlussliste genau
 * sie verspricht („Ein Haken, was das Kind erkannt hat" - es gibt keinen).
 * Getroffen wird die KONSTRUKTION, nicht das Wort: der Stamm `kreuz` mit
 * Vorsilbe, zu-Infinitiv und Partizip (ankreuzen, anzukreuzen, angekreuzt,
 * „kreuzt ... an") und `Haken` samt setzen/machen. Ein blosses `\bHaken\b`
 * waere die Wortform und traefe den Haken an der Jacke mit (Falle A).
 * `keinUrteil` und `ausgeschlossen` muessen die Konstruktion benennen
 * duerfen - sie stehen dafuer in `NICHT_GEPRUEFT`.
 */
export const BEWERTUNG = /\bAmpel\w*|\b(?:an)?(?:zu)?kreuz\w*|\bangekreuzt\b|\b(?:ab)?(?:zu)?hak\w*|\bHäkchen\b|\b(?:an|ange)kreuz\w*|\banzukreuzen\b|\bkreuz\w*\b[^.!?]{0,25}\ban\b|\bHaken\b[^.!?]{0,15}\b(?:setzen|setze|setzt|machen|macht|gesetzt|gemacht)\b|\b(?:setzen|setze|setzt|machen|macht)\b[^.!?]{0,15}\bHaken\b|\bein(?:en)?\s+Haken\b|\b\d+\s*(?:von|\/)\s*\d+\s*(?:Punkt|Karte|Haus)|\bProzent\b|\d\s*%|\bVergleich\s+(?:zu|mit)\s+(?:anderen\s+Kindern|Gleichaltrigen)|\bPunkte?\s+(?:zu\s+)?(?:sammeln|geben|vergeben|zählen)|\bStufen?\b[^.!?]{0,12}\b(?:erreicht|aufsteigen)|\bStufe\s+\d/i;

/** Eine Einstufung des Kindes - Begabung, Niveau, Auffaelligkeit. */
export const EINSTUFUNG = /(?:un)?begabt\w*|talentiert\w*|\b(?:Begabung|Talent|Niveau|förderbedürftig\w*|normal\s+für\s+(?:sein|das)\s+Alter|weit\s+voraus|zurückgeblieben\w*|aufgeweckter\s+als)|(?:entwicklungs|verhaltens|sprach)auffällig\w*/i;

/** Ein Wirkversprechen: der Spaziergang foerdert, trainiert, verbessert. */
export const WIRKVERSPRECHEN = /\b(?:fördert|verbessert|steigert|trainiert|stärkt|schult)\b[^.!?]{0,40}\b(?:Wahrnehmung|Konzentration|Intelligenz|Sprache|Wortschatz|Entwicklung|Kreativität|Fantasie)\b|\bmacht\b[^.!?]{0,20}\b(?:klüger|aufmerksamer)\b/i;

/**
 * Eine Jahreszahl. Diese App hat keine geprueften Daten zu einem Gebaeude -
 * jede Jahreszahl auf einer Karte waere geraten. Das Quellfeld darf sie
 * tragen (Erscheinungsjahr, Seitenzahlen).
 */
export const JAHRESZAHL = /\b(?:1[0-9]{3}|20[0-9]{2})\b/;

/**
 * Ein Epochenname. Verboten nur auf der KINDSEITE einer Karte - in der Frage
 * und in dem, worauf man zeigt. Der Grund der Regel ist, dass „Gotik" oder
 * „Gruenderzeit" einem Kind vor einem Haus nichts erklaeren; er verlangt
 * nicht, dass eine Quellenangabe die Epoche ihrer Fachliteratur verschweigt.
 * Die Rathaus-Karte muss sagen duerfen, dass die Fachliteratur fuer die
 * MITTELALTERLICHEN Rathaeuser drei Typen unterscheidet - sonst koennte sie
 * den Mythos der typischen Form nicht widerlegen (Falle A, siebenundzwanzig-
 * stes Mal). Dieselbe Grenze zieht schon „Design-Entdecker" fuer seinen
 * Kindertext.
 */
export const EPOCHE = /\b(?:Gotik|gotisch\w*|Barock|barock\w*|Romanik|romanisch\w*|Renaissance|Gründerzeit|Bauhaus|Jugendstil|Klassizismus|klassizistisch\w*|Mittelalter|mittelalterlich\w*|Ritter\w*)\b/i;

/**
 * Ein Ortsname. Die App kennt Ihren Ort nicht; ein Beispiel aus einer
 * bestimmten Stadt wuerde fuer alle anderen falsch klingen. Die Liste der
 * nicht uebernommenen Werke darf Orte nennen (Falle A, Ausnahme benannt).
 *
 * Halle, Essen, Hof, Kiel und Muenster sind Staedte UND gewoehnliche Woerter:
 * „eine weite Halle", „zum Essen", „der Pausenhof", „der Kiel eines Schiffs",
 * „das Muenster" - und ein Muenster ist fuer eine Architektur-App besonders
 * naheliegend. Sie stehen deshalb nur mit Praeposition im Netz, und die
 * Praeposition steht in beiden Schreibungen da, weil sie am Satzanfang gross
 * beginnt und der Zweig sonst nie greift (Review Welle 83). Getroffen wird die
 * Konstruktion, nicht das Wort - Falle A, sechsundzwanzigstes Mal.
 */
export const ORTSNAME = /\b(?:Berlin|Hamburg|München|Köln|Frankfurt|Stuttgart|Düsseldorf|Leipzig|Dortmund|Bremen|Dresden|Hannover|Nürnberg|Duisburg|Bochum|Wuppertal|Bielefeld|Bonn|Karlsruhe|Mannheim|Augsburg|Wiesbaden|Mönchengladbach|Braunschweig|Chemnitz|Aachen|Magdeburg|Freiburg|Krefeld|Mainz|Lübeck|Erfurt|Rostock|Kassel|Potsdam|Saarbrücken|Nordrhein-Westfalen|Bayern|Baden-Württemberg|Niedersachsen|Hessen|Sachsen-Anhalt|Sachsen|Thüringen|Brandenburg|Mecklenburg-Vorpommern|Schleswig-Holstein|Rheinland-Pfalz|Saarland)\b|\b(?:[Ii]n|[Aa]us|[Bb]ei|[Nn]ach|[Vv]on)\s+(?:Halle|Essen|Hof|Kiel|Münster)\b/;

const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;
const ZEICHEN = /\p{Extended_Pictographic}/u;
const KYRILLISCH = /[Ѐ-ӿ]/;

export const karteVon = (daten, id) => (daten?.karten ?? []).find((k) => k.id === id) ?? null;
export const kartenNachArt = (daten, art) => (daten?.karten ?? []).filter((k) => k.art === art);

/**
 * Ausnahmen von den Textnetzen, jede mit Grund. Wie in Nr. 60 bis Nr. 64 ist
 * die Pruefung umgedreht: geprueft wird der REST. `pruefeDaten` verlangt,
 * dass jedes hier genannte Feld in den Daten existiert.
 */
/**
 * Von acht Ausnahmen waren FUENF unverdient (Review Welle 83): sie nahmen ein
 * Feld aus, das kein Netz getroffen haette. Eine unverdiente Ausnahme ist
 * keine Ausnahme, sondern eine Luecke - `keineVorbildliste`, `elterntelefon`,
 * `art` und `version` werden jetzt mitgeprueft, und `version` ist ohnehin eine
 * Zahl, die der Sammler nie angefasst hat. Geblieben sind vier, und jede muss
 * sich verdienen (siehe `AUSNAHME_MUSS_ENTHALTEN`).
 */
export const NICHT_GEPRUEFT = Object.freeze({
  impulseSindOffen: 'erklärt, dass nichts geprüft wird – und muss die Prüfung dafür benennen',
  keinUrteil: 'muss Haken, Punkte und Vergleich nennen, um sie auszuschließen',
  ausgeschlossen: 'die Ausschlussliste benennt, was sie ausschließt',
  quelle: 'Werk, Rechte und Zählung – russisch, mit Jahr und Seitenzahlen',
});

/** Einzelne Feldnamen, die ueberall ausgenommen sind (Lehre aus Nr. 63). */
export const NICHT_GEPRUEFT_FELDER = Object.freeze({});

/**
 * Was ein ausgenommenes Feld ENTHALTEN MUSS, um die Ausnahme zu verdienen
 * (uebernommen aus Nr. 66). Fuenf der acht Ausnahmen waren unverdient, vier
 * davon an angezeigten Feldern (Review Welle 83).
 */
export const AUSNAHME_MUSS_ENTHALTEN = Object.freeze({
  impulseSindOffen: ['ERWARTUNG'],
  keinUrteil: ['BEWERTUNG'],
  ausgeschlossen: ['BEWERTUNG'],
  quelle: ['KYRILLISCH'],
});

/** Felder ohne Netzgrund - benannt, damit die Luecke nicht still bleibt.
 *  Nach dem Review ist die Liste leer: jede Ausnahme hat ihren Grund. */
export const OHNE_NETZGRUND = Object.freeze({});

/**
 * AUSNAHMEN JE NETZ UND JE FELD - nicht pauschal fuer ein Feld.
 *
 * Eine Quellenangabe traegt das Jahr ihrer Norm oder Ausgabe; das ist keine
 * Behauptung ueber ein Gebaeude, und genau die verbietet `JAHRESZAHL`. Und sie
 * nennt, wer sie herausgegeben hat - ein Institut, eine Stadt, ein Amt. Das
 * ist eine Urheberangabe, keine Behauptung ueber den Ort des Lesers, und genau
 * die verbietet `ORTSNAME`. Die Einschraenkung, dass eine Fundstelle nur fuer
 * EIN Land gilt, muss der Kartentext selbst tragen - dort laufen beide Netze
 * weiter, wie alle anderen auch.
 *
 * Nach dem Vorbild von Nr. 66: eine Ausnahme muss sich verdienen.
 * `pruefeDaten` verlangt, dass mindestens eine Quellenangabe die Konstruktion,
 * fuer die sie ausgenommen ist, wirklich enthaelt - sonst ist die Ausnahme
 * keine Ausnahme, sondern eine Luecke.
 */
export const NETZ_AUSNAHMEN = Object.freeze({
  quelle: Object.freeze({
    JAHRESZAHL: 'eine Quellenangabe nennt das Jahr ihrer Norm oder Ausgabe – das ist keine Angabe über ein Gebäude',
    ORTSNAME: 'eine Quellenangabe nennt ihren Urheber – Institut, Stadt, Amt – und nicht den Ort des Lesers',
  }),
});

/** Rueckwaertskompatibel: welche Felder von JAHRESZAHL ausgenommen sind. */
export const JAHRESZAHL_ERLAUBT_IN = Object.freeze(
  Object.fromEntries(Object.entries(NETZ_AUSNAHMEN)
    .filter(([, netze]) => 'JAHRESZAHL' in netze)
    .map(([feld, netze]) => [feld, netze.JAHRESZAHL])),
);

/** Alle Texte der Daten ausser den benannten Ausnahmen. */
export function angebotsTexte(daten) {
  const t = [];
  const sammle = (wert, wo, feld) => {
    if (typeof wert === 'string') {
      if (nichtLeer(wert) && !Object.hasOwn(NICHT_GEPRUEFT_FELDER, feld)) t.push([wo, wert]);
      return;
    }
    if (Array.isArray(wert)) { wert.forEach((x, n) => sammle(x, `${wo}[${n}]`, feld)); return; }
    if (wert && typeof wert === 'object') { for (const [k, v] of Object.entries(wert)) sammle(v, `${wo}.${k}`, k); }
  };
  for (const [feld, wert] of Object.entries(daten ?? {})) {
    if (Object.hasOwn(NICHT_GEPRUEFT, feld)) continue;
    sammle(wert, feld, feld);
  }
  return t;
}

/** Die Kindseite einer Karte: die Frage und das, worauf man zeigt. */
export const KINDSEITE_FELDER = Object.freeze(['impuls', 'woranMan']);

export function kindseiteTexte(daten) {
  const t = [];
  for (const k of daten?.karten ?? []) {
    for (const feld of KINDSEITE_FELDER) {
      if (nichtLeer(k[feld])) t.push([`Karte ${k.id}.${feld}`, k[feld]]);
    }
  }
  return t;
}

/** Nur die Fragen, die draussen laut gesagt werden. */
export function kinderfragen(daten) {
  return (daten?.karten ?? []).filter((k) => nichtLeer(k.impuls)).map((k) => [`Karte ${k.id}.impuls`, k.impuls]);
}

export function pruefeDaten(daten) {
  const fehler = [];
  const karten = daten?.karten ?? [];
  const ziele = daten?.ziele ?? [];
  const aus = daten?.ausgeschlossen ?? [];

  // --- Die Karten ----------------------------------------------------------
  if (karten.length < 15) fehler.push(`${karten.length} Karten – zu wenige für einen Spaziergang`);
  const ids = new Set();
  for (const k of karten) {
    const wo = `Karte ${k.id ?? '?'}`;
    if (!nichtLeer(k.id)) fehler.push(`${wo}: id fehlt`);
    else { if (ids.has(k.id)) fehler.push(`${wo}: doppelt`); ids.add(k.id); }
    if (!ZEICHEN.test(k.zeichen ?? '')) fehler.push(`${wo}: zeichen fehlt`);
    for (const feld of ['name', 'woranMan', 'impuls']) {
      if (!nichtLeer(k[feld])) fehler.push(`${wo}: ${feld} fehlt`);
    }
    if (nichtLeer(k.impuls) && !k.impuls.trim().endsWith('?')) fehler.push(`${wo}: impuls ist keine Frage`);
    if (!ARTEN.includes(k.art)) { fehler.push(`${wo}: art „${k.art}" ist keine der fünf`); continue; }

    // Jede Erklaerung traegt ihren Sicherheitsgrad; „belegt" braucht eine Quelle.
    if (nichtLeer(k.fuerErwachsene)) {
      if (!SICHERHEITEN.includes(k.sicherheit)) fehler.push(`${wo}: sicherheit „${k.sicherheit}" ist keine der drei`);
      else if (!nichtLeer(k.sicherheitText)) fehler.push(`${wo}: sicherheitText fehlt – ein Sicherheitsgrad ohne Satz sagt nichts`);
      if (k.sicherheit === 'belegt' && !nichtLeer(k.quelle)) {
        fehler.push(`${wo}: als „belegt" eingeordnet, aber ohne Quelle – dann ist es nicht belegt`);
      }
    } else if (nichtLeer(k.quelle)) {
      // Eine Quellenangabe ist eine Behauptung, auch ohne `fuerErwachsene`:
      // die Rathaus-Karte belegt, dass es die typische Form NICHT gibt
      // (Review Welle 83).
      if (!SICHERHEITEN.includes(k.sicherheit)) fehler.push(`${wo}: trägt eine Quelle, aber keinen Sicherheitsgrad`);
      else if (!nichtLeer(k.sicherheitText)) fehler.push(`${wo}: sicherheitText fehlt`);
    } else if (k.sicherheit !== undefined) {
      fehler.push(`${wo}: sicherheit ohne Erklärung`);
    }

    if (k.art === 'bauform') {
      // Keine Erkennungsregel ohne ihr Gegenbeispiel (Vorbild: Design-Entdecker).
      if (!nichtLeer(k.gegenbeispiel)) fehler.push(`${wo}: gegenbeispiel fehlt – eine Erkennungsregel ohne Ausnahme wird zum Gesetz`);
      if (!nichtLeer(k.fuerErwachsene)) fehler.push(`${wo}: fuerErwachsene fehlt`);
    }
    if (k.art === 'ausstattung') {
      if (!nichtLeer(k.nichtAmHaus)) fehler.push(`${wo}: nichtAmHaus fehlt – die Karte muss sagen, was das Gebäude selbst NICHT verrät`);
    }
    if (k.art === 'nichtErkennbar') {
      for (const feld of ['warumNicht', 'woranDoch']) {
        if (!nichtLeer(k[feld])) fehler.push(`${wo}: ${feld} fehlt`);
      }
      if (nichtLeer(k.fuerErwachsene)) fehler.push(`${wo}: fuerErwachsene bei einer Karte, die nichts erklärt – dann ist sie erkennbar`);
    }
    if (k.art === 'kleineForm' || k.art === 'gruen') {
      if (!['genannt', 'ergaenzt'].includes(k.quellBezug)) fehler.push(`${wo}: quellBezug „${k.quellBezug}" ist weder genannt noch ergaenzt`);
    }
  }

  // Ohne die dritte Gruppe lehrt die App, dass man alles ablesen kann.
  const nichtErkennbar = kartenNachArt(daten, 'nichtErkennbar');
  if (nichtErkennbar.length < 3) {
    fehler.push(`nur ${nichtErkennbar.length} Karte(n) „nicht erkennbar" – ohne sie behauptet die App, man könne alles ablesen`);
  }
  if (kartenNachArt(daten, 'bauform').length < 5) fehler.push('zu wenige Karten, die man am Bau erkennt');
  if (kartenNachArt(daten, 'ausstattung').length < 2) fehler.push('zu wenige Karten, die nur die Ausstattung verrät');

  // Die drei namentlich genannten kleinen Formen muessen da sein.
  const kleine = kartenNachArt(daten, 'kleineForm');
  for (const form of KLEINE_FORMEN_DER_QUELLE) {
    const k = kleine.find((x) => (x.name ?? '').includes(form));
    if (!k) fehler.push(`die Quelle nennt „${form}" ausdrücklich – die Karte fehlt`);
    else if (k.quellBezug !== 'genannt') fehler.push(`Karte ${k.id}: „${form}" steht in der Quelle, ist hier aber als Ergänzung ausgegeben`);
  }
  // Und was von uns ist, muss als unser gekennzeichnet sein.
  if (![...kleine, ...kartenNachArt(daten, 'gruen')].some((k) => k.quellBezug === 'ergaenzt')) {
    fehler.push('keine Karte als Ergänzung gekennzeichnet – dann müsste alles in der Quelle stehen');
  }

  // --- Die Absaetze --------------------------------------------------------
  for (const feld of ['hinweis', 'wasEsIst', 'keineVorbildliste', 'nurManchmal', 'dreiArten',
    'impulseSindOffen', 'keinUrteil', 'sicherheitImmer', 'eigeneListe', 'wohinMitFragen', 'elterntelefon']) {
    if (!nichtLeer(daten?.[feld])) fehler.push(`${feld} fehlt`);
  }
  // Die vierzehn muessen als Zahl dastehen, und wo sie stehen.
  const vorbild = daten?.keineVorbildliste ?? '';
  if (!/\bvierzehn\b|\b14\b/i.test(vorbild)) fehler.push('keineVorbildliste nennt die Zahl der Denkmäler nicht');
  if (!/Belarus|Weißrussland/i.test(vorbild)) fehler.push('keineVorbildliste sagt nicht, wo die vierzehn stehen');
  if (!/eigenen\s+Gegend|своей|местности|der\s+Gegend/i.test(vorbild)) {
    fehler.push('keineVorbildliste nennt die Begründung der Quelle selbst nicht (die eigene Gegend)');
  }
  // Die Einschraenkung muss eine der Gegenkarten namentlich nennen.
  const genannt = nichtErkennbar.filter((k) => nichtLeer(k.name) && (daten?.nurManchmal ?? '').includes(k.name));
  if (!genannt.length) {
    fehler.push('nurManchmal nennt keine der Karten, bei denen das Ziel nicht gilt – dann ist die Einschränkung eine Floskel');
  }
  if (!BEWERTUNG.test(daten?.keinUrteil ?? '')) fehler.push('keinUrteil benennt nicht, was es ausschließt');
  // Die Sicherheitsregel gehoert auf den Zettel, nicht nur auf den Bildschirm.
  // (Die Konstante gegen sich selbst zu pruefen war tautologisch - das steht
  // jetzt im Test, wo eine Konstantenzusicherung hingehoert.)
  for (const feld of DRUCK_ABSAETZE) {
    if (!nichtLeer(daten?.[feld])) fehler.push(`DRUCK_ABSAETZE nennt ${feld}, das es in den Daten nicht gibt`);
  }
  // Die Sicherheitsregel muss die drei Dinge nennen, die draussen gelten.
  const sich = daten?.sicherheitImmer ?? '';
  for (const [was, muster] of [['Gehweg oder Straße', /Gehweg|Fahrbahn|Straße/], ['kein Grundstück', /Grundstück|klingel/i], ['keine Menschen fotografieren', /fotografier/i]]) {
    if (!muster.test(sich)) fehler.push(`sicherheitImmer sagt nichts zu: ${was}`);
  }

  // --- Die siebzehn Quellziele --------------------------------------------
  if (ziele.length !== ZIELE) fehler.push(`${ziele.length} Ziele, nachgezählt sind ${ZIELE}`);
  const nummern = new Set();
  let eingeschraenkt = 0;
  let abgelehnt = 0;
  for (const z of ziele) {
    const wo = `Ziel ${z.nr ?? '?'}`;
    if (!Number.isInteger(z.nr) || z.nr < 1 || z.nr > ZIELE) fehler.push(`${wo}: nr fehlt oder liegt außerhalb`);
    else { if (nummern.has(z.nr)) fehler.push(`${wo}: doppelt`); nummern.add(z.nr); }
    if (!nichtLeer(z.kurz)) fehler.push(`${wo}: kurz fehlt`);
    if (!EINORDNUNGEN.includes(z.einordnung)) { fehler.push(`${wo}: einordnung „${z.einordnung}" ist keine der vier`); continue; }
    if (!nichtLeer(z.warum)) fehler.push(`${wo}: warum fehlt`);
    if (z.einordnung === 'nurEingeschraenkt') {
      eingeschraenkt += 1;
      if (!/Aussehen|Bestimmung/i.test(z.kurz ?? '')) fehler.push(`${wo}: als eingeschränkt eingeordnet, aber nicht das Ziel über Aussehen und Bestimmung`);
    }
    if (z.einordnung === 'nichtUebernommen') abgelehnt += 1;
    // Ein Grossbuchstabe war kein Nachweis: jedes deutsche Substantiv hat
    // einen. Geprueft wird jetzt, dass eine der gebauten Apps namentlich
    // dasteht (Review Welle 83).
    if (z.einordnung === 'anderesThema' && !GENANNTE_APPS.some((a) => (z.warum ?? '').includes(a))) {
      fehler.push(`${wo}: nennt keine der Apps, in die es gehört`);
    }
  }
  for (let n = 1; n <= ZIELE; n += 1) if (!nummern.has(n)) fehler.push(`Quellziel ${n} fehlt`);
  if (eingeschraenkt !== 1) fehler.push(`${eingeschraenkt} eingeschränkte Ziele – genau eines ist es (das über Aussehen und Bestimmung)`);
  if (abgelehnt < 3) fehler.push(`${abgelehnt} zurückgewiesene Ziele – es sind drei (Fachwortliste, Werbung, Bewertung von Massenproduktion)`);
  // Die Zurueckweisung muss benennen, was sie zurueckweist.
  const werbung = ziele.filter((z) => z.einordnung === 'nichtUebernommen' && /Werbung/i.test(z.warum ?? ''));
  if (!werbung.length) fehler.push('kein zurückgewiesenes Ziel benennt die Werbung, um die es geht');
  // Die Abweichungsnotiz muss jede zurueckgewiesene Nummer NENNEN. In der
  // ersten Fassung stand dort „zwei zurueckgewiesen", waehrend die Daten drei
  // sagten, und die Rechnung ging nicht auf - niemand hat es gemerkt, weil
  // nichts die Prosa gegen die Daten hielt (Review Welle 83).
  const notiz = daten?.quelle?.abweichung ?? '';
  for (const z of ziele.filter((x) => x.einordnung === 'nichtUebernommen')) {
    if (!new RegExp(`№\\s*${z.nr}(?!\\d)`).test(notiz)) {
      fehler.push(`quelle.abweichung nennt das zurückgewiesene Ziel ${z.nr} nicht`);
    }
  }

  // --- Ausschlussliste und Quelle -----------------------------------------
  if (aus.length < 5) fehler.push('die Ausschlussliste ist zu kurz');
  for (const x of aus) {
    if (!nichtLeer(x.was) || !nichtLeer(x.warum)) fehler.push(`Ausschluss „${x.was ?? '?'}": unvollständig`);
  }
  if (daten?.quelle?.geprueft !== true) fehler.push('quelle.geprueft ist nicht true');
  for (const feld of ['werk', 'rechte', 'nachgezaehlt', 'abweichung']) {
    if (!nichtLeer(daten?.quelle?.[feld])) fehler.push(`quelle.${feld} fehlt`);
  }
  if (!new RegExp(`(?<!\\d)${DENKMAELER_DER_QUELLE}(?!\\d)|четырнадцать`).test(daten?.quelle?.nachgezaehlt ?? '')) {
    fehler.push('quelle.nachgezaehlt nennt die Zahl der Denkmäler nicht');
  }
  for (const feld of Object.keys(NICHT_GEPRUEFT)) {
    if (!(feld in (daten ?? {}))) fehler.push(`NICHT_GEPRUEFT nennt ${feld}, das es in den Daten nicht gibt`);
  }
  // Jedes ausgenommene Feld braucht einen Netzgrund oder steht benannt ohne.
  for (const feld of [...Object.keys(NICHT_GEPRUEFT), ...Object.keys(NICHT_GEPRUEFT_FELDER)]) {
    if (Object.hasOwn(AUSNAHME_MUSS_ENTHALTEN, feld)) continue;
    if (Object.hasOwn(OHNE_NETZGRUND, feld)) continue;
    fehler.push(`${feld} ist ausgenommen, steht aber weder in AUSNAHME_MUSS_ENTHALTEN noch in OHNE_NETZGRUND`);
  }
  // Und umgekehrt: wer in einer der beiden Tabellen steht, muss wirklich
  // ausgenommen sein - sonst beschreibt die Tabelle etwas, das es nicht gibt.
  for (const feld of [...Object.keys(AUSNAHME_MUSS_ENTHALTEN), ...Object.keys(OHNE_NETZGRUND)]) {
    if (feld === 'quelle' && Object.hasOwn(NETZ_AUSNAHMEN, feld)) continue;
    if (!Object.hasOwn(NICHT_GEPRUEFT, feld) && !Object.hasOwn(NICHT_GEPRUEFT_FELDER, feld)) {
      fehler.push(`${feld} steht in einer Ausnahmetabelle, ist aber nicht ausgenommen`);
    }
  }
  const textVon = (wert) => {
    if (typeof wert === 'string') return wert;
    if (Array.isArray(wert)) return wert.map(textVon).join(' ');
    if (wert && typeof wert === 'object') return Object.values(wert).map(textVon).join(' ');
    return '';
  };
  for (const [feld, namen] of Object.entries(AUSNAHME_MUSS_ENTHALTEN)) {
    const text = textVon(daten?.[feld]);
    for (const name of namen) {
      const netz = { ERWARTUNG, BEWERTUNG, ORTSNAME, JAHRESZAHL, EPOCHE, KYRILLISCH }[name];
      if (netz && !netz.test(text)) {
        fehler.push(`${feld} ist von ${name} ausgenommen, enthält es aber nicht – eine Ausnahme ohne Grund ist eine Lücke`);
      }
    }
  }
  // Jede Netzausnahme muss sich verdienen: irgendeine Quellenangabe muss die
  // Konstruktion wirklich enthalten, fuer die das Feld ausgenommen ist.
  const NETZE = { JAHRESZAHL, ORTSNAME, EPOCHE, ERWARTUNG, BEWERTUNG, EINSTUFUNG, WIRKVERSPRECHEN, KYRILLISCH };
  for (const [feld, netze] of Object.entries(NETZ_AUSNAHMEN)) {
    const texte = karten.map((k) => k[feld]).filter((t) => typeof t === 'string');
    for (const name of Object.keys(netze)) {
      if (!texte.some((t) => NETZE[name].test(t))) {
        fehler.push(`${feld} ist von ${name} ausgenommen, aber keine ${feld}-Angabe enthält es – eine Ausnahme ohne Grund ist eine Lücke`);
      }
    }
  }

  // --- Die Textnetze -------------------------------------------------------
  for (const [wo, text] of angebotsTexte(daten)) {
    if (ERWARTUNG.test(text)) fehler.push(`${wo}: eine Erwartung an das Kind`);
    if (BEWERTUNG.test(text)) fehler.push(`${wo}: eine Bewertung`);
    if (EINSTUFUNG.test(text)) fehler.push(`${wo}: eine Einstufung des Kindes`);
    if (WIRKVERSPRECHEN.test(text)) fehler.push(`${wo}: Wirkversprechen`);
    const feld = wo.split('.').at(-1);
    const frei = NETZ_AUSNAHMEN[feld] ?? {};
    if (JAHRESZAHL.test(text) && !Object.hasOwn(frei, 'JAHRESZAHL')) {
      fehler.push(`${wo}: eine Jahreszahl – diese App hat keine geprüften Daten zu einem Gebäude`);
    }
    if (ORTSNAME.test(text) && !Object.hasOwn(frei, 'ORTSNAME')) {
      fehler.push(`${wo}: ein Ortsname – die App kennt Ihren Ort nicht`);
    }
    if (KYRILLISCH.test(text)) fehler.push(`${wo}: kyrillisch – die Quelle gehört in das Quellfeld`);
  }
  for (const [wo, text] of kindseiteTexte(daten)) {
    if (EPOCHE.test(text)) fehler.push(`${wo}: ein Epochenname auf der Kindseite`);
  }
  return fehler;
}
