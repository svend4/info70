// Elterngespraech zum Uebergang Kita-Grundschule (Praleska docs/10,
// Eltern-Werkzeuge Nr. 66, Quelle S. 300-311: «ОСНОВНЫЕ ПОКАЗАТЕЛИ РАЗВИТИЯ
// ДЕТЕЙ (к концу седьмого года жизни)»).
//
// TRAGENDE ENTSCHEIDUNG 1: DIE CHECKLISTE IST NICHT UEBERNOMMEN - DIE RICHTUNG
// DER FRAGE IST UMGEDREHT.
//
// Der Katalogeintrag wollte eine „Checkliste in Elternsprache zu den 12
// Indikator-Bereichen plus 8 Lernvoraussetzungen" samt Bericht. Nachgezaehlt
// traegt die Quelle 141 Merkmale in 13 Feldern - zwoelf Felder plus die
// Vorbedingungen, genau wie der Eintrag sagt. Kein einziges dieser 141
// Merkmale ist hier als Punkt zum Ankreuzen uebernommen, und der Grund steht
// im ersten Feld der Quelle selbst: es fragt unter anderem, ob „Anzeichen von
// hoher Aengstlichkeit, Depressivitaet, Ungeschuetztheit" fehlen. Das ist eine
// klinische Frage. Eltern sollen sie nicht ankreuzen, sondern jemandem sagen,
// wenn sie sie haben. Das zweite Feld verlangt Groesse, Gewicht und
// Brustumfang „nicht unter dem Altersdurchschnitt", das dritte fragt nach den
// Staatssymbolen eines anderen Landes.
//
// Uebernommen ist die GLIEDERUNG in Felder. Umgedreht ist die Richtung: aus
// „Kann Ihr Kind das?" wird „Was haben Sie beobachtet?" - gefragt werden die
// Fachkraefte, nicht das Kind. Dieselbe Umkehrung traegt Nr. 62.
//
// TRAGENDE ENTSCHEIDUNG 2: EINE AUSNAHME MUSS SICH VERDIENEN.
//
// Jedes Feld traegt ein `nichtUebernommen`, das die abgelehnte Frage ZITIERT.
// Dieses Feld ist vom Netz `KINDFRAGE` ausgenommen - sonst koennte es die
// Frage nicht nennen (Falle A). Neu ist die Gegenrichtung: `pruefeDaten`
// verlangt, dass jedes ausgenommene Feld die Konstruktion, fuer die es
// ausgenommen ist, WIRKLICH ENTHAELT. Eine Ausnahme, die nichts zu verbergen
// hat, ist eine Luecke.
//
// TRAGENDE ENTSCHEIDUNG 3: DIE ACHT VORBEDINGUNGEN SIND KEINE AUFGABENLISTE.
//
// Die achte Gruppe der Quelle verlangt am Ende des siebten Lebensjahres die
// Lautanalyse von Woertern „praktisch jeder Schwierigkeit", die Kenntnis aller
// Vokalbuchstaben und das silbenweise Lesen. In Deutschland beginnen Lesen und
// Schreiben in der Schule. Die acht stehen darum vollstaendig da - als
// Wortlaut der Quelle, jeder mit dem Satz, was hier gilt, und wer Lesen,
// Buchstaben, Lautanalyse oder Mathematik nennt, braucht dafuer eine Quelle.
// Uebungen dazu gibt es in dieser App nicht: ein Werkzeug, das Eltern das
// Gegenteil nahelegt, macht aus dem letzten Kita-Jahr eine Vorschule.
//
// TRAGENDE ENTSCHEIDUNG 4: EINSPRACHIG, UND DER GRUND IST KEIN ZEITMANGEL.
//
// Der Eintrag wollte de/uk/ru. Hier stehen Rechtsbegriffe - Einwilligung,
// Zurueckstellung, Schuleingangsuntersuchung. Eine ungepruefte Uebersetzung
// davon waere schlimmer als keine: sie klingt verbindlich und ist es nicht.

/** Die Einordnung einer Quellangabe im Rechtsteil. */
export const BUNDESLAENDER = Object.freeze(['Nordrhein-Westfalen', 'Bayern', 'Baden-Württemberg',
  'Niedersachsen', 'Hessen', 'Sachsen-Anhalt', 'Sachsen', 'Thüringen', 'Brandenburg', 'Berlin',
  'Hamburg', 'Bremen', 'Mecklenburg-Vorpommern', 'Schleswig-Holstein', 'Rheinland-Pfalz', 'Saarland']);

/**
 * Wie viele Merkmale die Quelle traegt (nachgezaehlt S. 300-311).
 *
 * KORREKTUR DER ERSTEN FASSUNG: hier stand 141. Die erste Zaehlung lief ueber
 * die Textzeilen des umkodierten PDF und hat zwei Felder um je eins zu hoch
 * gezaehlt, weil eine Fortsetzungszeile am Spaltenanfang wie ein Listenpunkt
 * aussah. Nachgezaehlt ueber das GLYPH des Listenpunkts (0xF6) an seiner
 * festen Spalte, zugeordnet ueber die senkrechte Koordinate: 139.
 *
 * Die Lehre daraus steht in `pruefeDaten`: die Bilanz allein war eine Probe
 * auf sich selbst. Jetzt muessen drei Dinge uebereinstimmen - diese Konstante,
 * die Zahl an jedem Feld und die Aufzaehlung im Quellfeld `nachgezaehlt`.
 */
export const MERKMALE_INSGESAMT = 139;

/** Wie viele Felder die Quelle traegt: zwoelf plus die Vorbedingungen. */
export const FELDER_DER_QUELLE = 13;

/** Wie viele Vorbedingungen die achte Gruppe nennt. */
export const VORBEDINGUNGEN = 8;

/** Woerter, die in einer Vorbedingung eine Quelle erzwingen. */
export const SCHULSTOFF = /Lesen|liest|Buchstab|Lautanalyse|Silbe|Mathematik|Konsonant|Vokal|Rechnen/i;

/**
 * Die Frage, die dieses Werkzeug nicht stellt: eine Frage an die Eltern UEBER
 * das Kind. Getroffen wird die Anrede in der zweiten Person - „Kann Ihr Kind",
 * „Liegt Ihr Kind", „Ihr Kind sollte". NICHT getroffen ist „mein Kind": so
 * reden Eltern von ihrem Kind, wenn sie selbst fragen, und genau das soll die
 * App ermoeglichen. „Kann mein Kind schon ..." ist dagegen dieselbe Checkliste
 * in der Ichform und steht mit im Netz.
 */
export const KINDFRAGE = /\b(?:Kann|Weiß|Beherrscht|Spricht|Liest|Schreibt|Rechnet|Zeigt|Stellt|Plant|Kennt|Hat|Macht|Versteht|Liegt|Erkennt|Benennt)\s+(?:Ihr|dein|das)\s+Kind\b|\bIhr\s+Kind\s+(?:sollte|müsste|muss|kann\s+schon|soll\s+schon|beherrscht)\b|\bkann\s+(?:mein|Ihr|dein)\s+Kind\s+(?:schon|bereits)\b|\bkann\s+es\s+schon\b/i;

/** Eine Bewertung: Haken, Punkte, Stufen, Ampel, Vergleich. */
export const BEWERTUNG = /\bAmpel\w*|\b(?:an)?(?:zu)?kreuz\w*|\bangekreuzt\b|\b(?:ab)?(?:zu)?hak\w*|\bHäkchen\b|\b\d+\s*(?:von|\/)\s*\d+\s*(?:Punkt|Merkmal)|\bProzent\b|\d\s*%|\bPunkte?\s+(?:zu\s+)?(?:sammeln|geben|vergeben|zählen)|\bStufe\s+\d|\bVergleich\s+(?:zu|mit)\s+(?:anderen\s+Kindern|Gleichaltrigen)/i;

/**
 * Eine Diagnose, die dem Kind ZUGESCHRIEBEN wird. Getroffen wird die
 * Zuschreibung, nicht das Wort: der Rechtsteil muss ueber Befunde, Stoerungen
 * und Foerderbedarf sprechen koennen, weil das die Begriffe der Verfahren sind.
 */
export const DIAGNOSE_ZUGESCHRIEBEN = /\bIhr\s+Kind\s+(?:hat|zeigt|leidet\s+an|entwickelt)\b[^.!?]{0,30}\b(?:Störung|Defizit|Auffälligkeit|Verzögerung)|\bdeutet\b[^.!?]{0,25}\b(?:auf|hin)\b[^.!?]{0,30}\b(?:Störung|Defizit|Problem)|\bAnzeichen\s+für\s+(?:eine|ein)\b|\bVerdacht\s+auf\b/i;

/**
 * Eine Vorhersage ueber dieses Kind. Der Wortstamm „prognos" steht NICHT im
 * Netz: eine Quellenangabe darf die prognostische Guete einer Studie nennen,
 * ohne selbst eine Vorhersage zu sein. Getroffen wird die Konstruktion.
 */
export const VORHERSAGE = /\bdaran\s+(?:erkennen\s+Sie|sehen\s+Sie|merken\s+Sie),\s+ob\b|\bSie\s+erkennen\s+daran,\s+ob\b|\bwird\s+(?:später|in\s+der\s+Schule)\b[^.!?]{0,30}\b(?:Schwierigkeiten|Probleme)\b|\bRisiko\s+für\s+(?:Lese|Rechen|Schul)\w*|\b(?:sagt|sagen)\s+(?:wir\s+)?voraus\b|\bvorhersagen\b|\bvoraussagen\b/i;

/** „Ihr Kind ist schulfaehig" als Urteil. Der Rechtsteil muss den Begriff
 *  erklaeren duerfen - getroffen wird die Zuschreibung an dieses Kind. */
export const SCHULFAEHIG_ALS_URTEIL = /\b(?:Ihr|dein|das)\s+Kind\s+(?:ist|wäre|scheint|wirkt)\s+(?:noch\s+)?(?:nicht\s+)?schul(?:fähig|reif|bereit)\b|\bschul(?:fähig|reif|bereit)\s+(?:ist|wäre|wirkt)\s+(?:Ihr|dein|das)\s+Kind\b|\b(?:ist|wäre)\s+(?:Ihr|dein)\s+Kind\s+(?:schon\s+)?schul(?:fähig|reif|bereit)\b|\bschul(?:fähig|reif|bereit)e[rsn]?\s+Kind\b/i;

/** Eine Altersangabe, ab der ein Kind etwas koennen soll. Ausgeschriebene
 *  Zahlen gehoeren ins Netz: in Welle 80 ging „Kinder unter zehn Jahren"
 *  durch ein Netz, das nur Ziffern kannte. */
export const KOENNENSALTER = /\b(?:mit|ab)\s+(?:\d+|drei|vier|fünf|sechs|sieben|acht)\s+Jahren\s+(?:sollte|müsste|muss|kann\s+ein\s+Kind|können\s+Kinder)\b|\b(?:sollte|müsste|muss)\s+(?:ein\s+Kind|es|Ihr\s+Kind)\s+(?:mit|ab)\s+(?:\d+|drei|vier|fünf|sechs|sieben|acht)\s+Jahren\b/i;

/** Die Erwartung, ein Kind solle vor der Schule lesen oder rechnen koennen. */
export const LESEN_ERWARTET = /\b(?:Ihr|dein)\s+Kind\s+(?:sollte|muss|müsste)\b[^.!?]{0,40}\b(?:lesen|schreiben|rechnen)\s+können\b|\bvor\s+der\s+(?:Einschulung|Schule)\s+(?:sollte|muss)\s+(?:ein\s+Kind|es|Ihr\s+Kind)\b|\bbis\s+zur\s+Einschulung\s+(?:sollte|muss)\b/i;

const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;
const ZEICHEN = /\p{Extended_Pictographic}/u;
const KYRILLISCH = /[Ѐ-ӿ]/;

export const feldVon = (daten, id) => (daten?.gespraechsfelder ?? []).find((f) => f.id === id) ?? null;
export const rechtVon = (daten, id) => (daten?.rechtliches ?? []).find((r) => r.id === id) ?? null;

/** Die Summe der Merkmale: zwoelf Felder plus die Vorbedingungen. */
export function merkmaleGezaehlt(daten) {
  const felder = (daten?.gespraechsfelder ?? []).reduce((s, f) => s + (Number.isInteger(f.quellPunkte) ? f.quellPunkte : 0), 0);
  return felder + (daten?.lernvoraussetzungen ?? []).length;
}

/** Ausnahmen von den Textnetzen, jede mit Grund. Geprueft wird der REST. */
/**
 * Drei der acht Ausnahmen waren unverdient (Review Welle 83): kein Netz haette
 * sie getroffen. Eine unverdiente Ausnahme ist keine Ausnahme, sondern eine
 * Luecke - `elterntelefon` und `art` werden jetzt mitgeprueft, und `version`
 * ist eine Zahl, die der Sammler nie angefasst hat. Geblieben sind fuenf, und
 * jede muss sich verdienen (siehe `AUSNAHME_MUSS_ENTHALTEN`).
 */
export const NICHT_GEPRUEFT = Object.freeze({
  wasEsIst: 'zitiert die umgedrehte Frage und das Ankreuzen, um beides abzulehnen',
  warumKeineCheckliste: 'zitiert die klinische Frage der Quelle und das Ankreuzen, um beides abzulehnen',
  keinBericht: 'muss Punkte, Ampel, Stufen und Vergleich nennen, um sie auszuschließen',
  ausgeschlossen: 'die Ausschlussliste benennt, was sie ausschließt',
  quelle: 'Werk, Rechte und Zählung – russisch, mit Jahr und Seitenzahlen',
});

/**
 * Einzelne Feldnamen, ueberall ausgenommen - und zwar nur, solange sie die
 * Konstruktion wirklich enthalten, fuer die sie ausgenommen sind.
 */
export const NICHT_GEPRUEFT_FELDER = Object.freeze({
  nichtUebernommen: 'zitiert die abgelehnte Frage an die Eltern über das Kind',
});

/**
 * AUSNAHMEN JE FELD UND JE NETZ. Die erste Fassung nahm `nichtUebernommen` von
 * ALLEN acht Netzen aus, obwohl nur EINES begruendet war - das Feld hatte
 * damit freie Fahrt fuer Vorhersagen, Bewertungen und Leseerwartungen. Jetzt
 * laeuft jedes andere Netz weiter darueber.
 */
export const NETZ_AUSNAHMEN = Object.freeze({
  nichtUebernommen: Object.freeze({
    KINDFRAGE: 'zitiert die abgelehnte Frage an die Eltern über das Kind',
    BEWERTUNG: 'muss den Haken benennen, den es ablehnt',
  }),
});

/**
 * Felder ohne Netzgrund - benannt, damit die Luecke nicht still bleibt. Wer
 * hier steht, ist aus einem STRUKTURELLEN Grund ausgenommen, nicht wegen einer
 * Konstruktion, die er enthalten muesste.
 */
/** Felder ohne Netzgrund - benannt, damit die Luecke nicht still bleibt.
 *  Nach dem Review ist die Liste leer: jede Ausnahme hat ihren Grund. */
export const OHNE_NETZGRUND = Object.freeze({});

/** Die Netze unter ihrem Namen - fuer die Gegenrichtung der Ausnahmen. */
export const NETZE = Object.freeze({
  KINDFRAGE, BEWERTUNG, DIAGNOSE_ZUGESCHRIEBEN, VORHERSAGE,
  SCHULFAEHIG_ALS_URTEIL, KOENNENSALTER, LESEN_ERWARTET, KYRILLISCH,
});

/**
 * DIE GEGENRICHTUNG DER AUSNAHMEN. Bisher hielten die Apps fest, welches Feld
 * von welchem Netz ausgenommen ist (Falle A). Hier steht zusaetzlich, was ein
 * ausgenommenes Feld ENTHALTEN MUSS, um die Ausnahme zu verdienen. Eine
 * Ausnahme, die nichts zu verbergen hat, ist keine Ausnahme, sondern eine
 * Luecke - und faellt beim naechsten Umschreiben des Textes still auf.
 *
 * `warumKeineCheckliste` steht nicht in dieser Tabelle, weil es seine Ausnahme
 * anders verdient: `pruefeDaten` verlangt, dass es die klinische Frage der
 * Quelle namentlich nennt.
 */
export const AUSNAHME_MUSS_ENTHALTEN = Object.freeze({
  wasEsIst: ['KINDFRAGE', 'BEWERTUNG'],
  warumKeineCheckliste: ['BEWERTUNG'],
  keinBericht: ['BEWERTUNG'],
  ausgeschlossen: ['BEWERTUNG'],
  quelle: ['KYRILLISCH'],
  nichtUebernommen: ['KINDFRAGE', 'BEWERTUNG'],
});

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

/** Die Fragen, die Eltern mitnehmen. */
export function elternfragen(daten) {
  return [
    ...(daten?.gespraechsfelder ?? []).filter((f) => nichtLeer(f.ihreFrage)).map((f) => [`Feld ${f.id}`, f.ihreFrage]),
    ...(daten?.rechtliches ?? []).filter((r) => nichtLeer(r.frage)).map((r) => [`Recht ${r.id}`, r.frage]),
  ];
}

export function pruefeDaten(daten) {
  const fehler = [];
  const felder = daten?.gespraechsfelder ?? [];
  const vor = daten?.lernvoraussetzungen ?? [];
  const recht = daten?.rechtliches ?? [];
  const aus = daten?.ausgeschlossen ?? [];

  // --- Die zwoelf Gespraechsfelder ----------------------------------------
  if (felder.length !== FELDER_DER_QUELLE - 1) {
    fehler.push(`${felder.length} Gesprächsfelder – die Quelle hat ${FELDER_DER_QUELLE - 1} plus die Vorbedingungen`);
  }
  const ids = new Set();
  for (const f of felder) {
    const wo = `Feld ${f.id ?? '?'}`;
    if (!nichtLeer(f.id)) fehler.push(`${wo}: id fehlt`);
    else { if (ids.has(f.id)) fehler.push(`${wo}: doppelt`); ids.add(f.id); }
    if (!ZEICHEN.test(f.zeichen ?? '')) fehler.push(`${wo}: zeichen fehlt`);
    for (const feld of ['name', 'quellFrage', 'nichtUebernommen', 'ihreFrage', 'wasSieErzaehlen', 'wohinEsGehoert']) {
      if (!nichtLeer(f[feld])) fehler.push(`${wo}: ${feld} fehlt`);
    }
    if (!Number.isInteger(f.quellPunkte) || f.quellPunkte < 1) fehler.push(`${wo}: quellPunkte fehlt oder ist keine Zahl`);
    if (nichtLeer(f.ihreFrage) && !f.ihreFrage.trim().endsWith('?')) fehler.push(`${wo}: ihreFrage ist keine Frage`);
    // Die Ausnahme muss sich verdienen: das Feld, das die abgelehnte Frage
    // zitieren darf, muss sie wirklich zitieren.
    if (nichtLeer(f.nichtUebernommen) && !KINDFRAGE.test(f.nichtUebernommen)) {
      fehler.push(`${wo}: nichtUebernommen ist vom Netz ausgenommen, zitiert aber keine Frage über das Kind – eine Ausnahme ohne Grund ist eine Lücke`);
    }
  }
  // Die Bilanz muss aufgehen: die Zaehlung der Quelle gegen die Summe der Felder.
  const gezaehlt = merkmaleGezaehlt(daten);
  if (gezaehlt !== MERKMALE_INSGESAMT) {
    fehler.push(`die Felder nennen ${gezaehlt} Merkmale, nachgezählt sind ${MERKMALE_INSGESAMT}`);
  }
  // Die Bilanz allein war eine Probe auf SICH SELBST: die Summe stimmte, weil
  // die Konstante zur Summe passte, und beide waren falsch (Review Welle 83:
  // nachgezaehlt sind 139, nicht 141). Jetzt muss auch die AUFZAEHLUNG im
  // Quellfeld mit den Zahlen an den Feldern uebereinstimmen - drei Stellen,
  // die unabhaengig voneinander geschrieben werden.
  const prosa = daten?.quelle?.nachgezaehlt ?? '';
  // Geprueft wird die FOLGE, nicht die Menge der Zahlen: eine Menge laesst sich
  // durch Verschieben zwischen zwei Feldern austricksen, und eine einzelne Zahl
  // findet sich im Text auch zufaellig (im Glyphnamen 0xF6 steckt eine 6).
  const folge = felder.map((f) => f.quellPunkte).join(', ');
  if (!prosa.includes(folge)) {
    fehler.push(`quelle.nachgezaehlt enthält die Folge „${folge}" nicht – die Aufzählung und die Zahlen an den Feldern laufen auseinander`);
  }
  for (const [was, zahl] of [['die Summe der zwölf Felder', gezaehlt - vor.length], ['die Zahl der Vorbedingungen', vor.length]]) {
    if (!new RegExp(`(?<!\\d)${zahl}(?!\\d)`).test(prosa)) {
      fehler.push(`quelle.nachgezaehlt nennt ${was} (${zahl}) nicht`);
    }
  }

  // --- Die acht Vorbedingungen --------------------------------------------
  if (vor.length !== VORBEDINGUNGEN) fehler.push(`${vor.length} Vorbedingungen, die Quelle nennt ${VORBEDINGUNGEN}`);
  const nummern = new Set();
  for (const v of vor) {
    const wo = `Vorbedingung ${v.nr ?? '?'}`;
    if (!Number.isInteger(v.nr) || v.nr < 1 || v.nr > VORBEDINGUNGEN) fehler.push(`${wo}: nr fehlt oder liegt außerhalb`);
    else { if (nummern.has(v.nr)) fehler.push(`${wo}: doppelt`); nummern.add(v.nr); }
    if (!nichtLeer(v.kurz)) fehler.push(`${wo}: kurz fehlt`);
    if (!nichtLeer(v.wasHierGilt)) fehler.push(`${wo}: wasHierGilt fehlt – ohne das steht die Erwartung der Quelle unwidersprochen da`);
    // Wer Schulstoff verlangt, braucht eine Quelle fuer die Gegenrede.
    if ((SCHULSTOFF.test(v.kurz ?? '') || SCHULSTOFF.test(v.wasHierGilt ?? '')) && !nichtLeer(v.quelle)) {
      fehler.push(`${wo}: nennt Schulstoff, aber die Gegenrede hat keine Quelle`);
    }
  }
  for (let n = 1; n <= VORBEDINGUNGEN; n += 1) if (!nummern.has(n)) fehler.push(`Vorbedingung ${n} fehlt`);
  const vorHinweis = daten?.lernvoraussetzungenHinweis ?? '';
  if (!nichtLeer(vorHinweis)) fehler.push('lernvoraussetzungenHinweis fehlt');
  else if (!/\b(?:kein\w*|nicht)\b[^.!?]{0,60}\b(?:Voraussetzung|verlangt|erwartet|Bedingung)/i.test(vorHinweis)) {
    fehler.push('lernvoraussetzungenHinweis sagt nicht, dass nichts davon hier verlangt wird');
  }

  // --- Der Rechtsteil ------------------------------------------------------
  if (recht.length < 5) fehler.push(`${recht.length} Rechtsfragen – zu wenige`);
  const rIds = new Set();
  for (const r of recht) {
    const wo = `Recht ${r.id ?? '?'}`;
    if (!nichtLeer(r.id)) fehler.push(`${wo}: id fehlt`);
    else {
      if (rIds.has(r.id)) fehler.push(`${wo}: doppelt`);
      rIds.add(r.id);
      // Feld- und Rechtskennungen landen in derselben Auswahlliste im
      // Speicher; eine Kollision waehlte zwei Dinge auf einmal.
      if (ids.has(r.id)) fehler.push(`${wo}: dieselbe id gibt es schon als Gesprächsfeld – beide landen in derselben Auswahl`);
    }
    if (!ZEICHEN.test(r.zeichen ?? '')) fehler.push(`${wo}: zeichen fehlt`);
    for (const feld of ['frage', 'antwort', 'quelle']) {
      if (!nichtLeer(r[feld])) fehler.push(`${wo}: ${feld} fehlt – eine Rechtsauskunft ohne Quelle ist keine`);
    }
    if (nichtLeer(r.frage) && !r.frage.trim().endsWith('?')) fehler.push(`${wo}: frage ist keine Frage`);
  }
  // Landesrecht darf nicht wie Bundesrecht klingen: mindestens zwei Antworten
  // muessen je zwei Bundeslaender nennen.
  const laenderIn = (text) => {
    // Laengste zuerst und Treffer ausblenden: „Sachsen" steckt in
    // „Sachsen-Anhalt", und sonst zaehlt ein Land doppelt (Review Welle 83).
    let rest = text ?? '';
    const gefunden = [];
    for (const l of [...BUNDESLAENDER].sort((a, b) => b.length - a.length)) {
      if (rest.includes(l)) { gefunden.push(l); rest = rest.split(l).join(' '); }
    }
    return gefunden;
  };
  const mitZweiLaendern = recht.filter((r) => laenderIn(r.antwort).length >= 2);
  if (mitZweiLaendern.length < 2) {
    fehler.push(`nur ${mitZweiLaendern.length} Antwort(en) nennen zwei oder mehr Bundesländer – bei Landesrecht klingt ein Beispiel sonst wie eine Regel`);
  }
  // Wer entscheidet, muss dastehen - und es ist die Schulleitung.
  const werEntscheidet = recht.find((r) => /entscheidet/i.test(r.frage ?? ''));
  if (!werEntscheidet) fehler.push('die Frage, wer über die Einschulung entscheidet, fehlt');
  else if (!/Schulleit/i.test(werEntscheidet.antwort ?? '')) {
    fehler.push('die Antwort zur Entscheidung nennt die Schulleitung nicht');
  }
  // Und die Untersuchung gibt kein Urteil.
  const urteil = recht.find((r) => /schulfähig/i.test(r.frage ?? ''));
  if (!urteil) fehler.push('die Frage nach dem Urteil „schulfähig" fehlt');
  else if (!/kein|nicht\s+als\s+Urteil|Empfehlung/i.test(urteil.antwort ?? '')) {
    fehler.push('die Antwort zum Urteil sagt nicht, dass die Untersuchung keines ausspricht');
  }

  // --- Die Absaetze --------------------------------------------------------
  for (const feld of ['hinweis', 'wasEsIst', 'warumKeineCheckliste', 'staerkenblick', 'keinBericht',
    'dreiSprachen', 'vorbereitung', 'wohinMitFragen', 'elterntelefon']) {
    if (!nichtLeer(daten?.[feld])) fehler.push(`${feld} fehlt`);
  }
  // Die Begruendung muss die klinische Frage benennen, an der sie haengt.
  if (!/Depressiv|Ängstlich/i.test(daten?.warumKeineCheckliste ?? '')) {
    fehler.push('warumKeineCheckliste benennt die klinische Frage der Quelle nicht, an der die Ablehnung hängt');
  }
  if (!BEWERTUNG.test(daten?.keinBericht ?? '')) fehler.push('keinBericht benennt nicht, was es ausschließt');
  // Die drei Sprachen muessen genannt werden, die es nicht gibt.
  for (const sprache of ['deutsch', 'ukrainisch', 'russisch']) {
    if (!new RegExp(sprache, 'i').test(daten?.dreiSprachen ?? '')) {
      fehler.push(`dreiSprachen nennt ${sprache} nicht – der Eintrag wollte alle drei`);
    }
  }
  for (const feld of Object.keys(NICHT_GEPRUEFT)) {
    if (!(feld in (daten ?? {}))) fehler.push(`NICHT_GEPRUEFT nennt ${feld}, das es in den Daten nicht gibt`);
  }
  // Jedes ausgenommene Feld braucht entweder einen Netzgrund oder steht
  // benannt in OHNE_NETZGRUND - eine stille Ausnahme gibt es nicht mehr.
  for (const feld of [...Object.keys(NICHT_GEPRUEFT), ...Object.keys(NICHT_GEPRUEFT_FELDER)]) {
    if (Object.hasOwn(AUSNAHME_MUSS_ENTHALTEN, feld)) continue;
    if (Object.hasOwn(OHNE_NETZGRUND, feld)) continue;
    fehler.push(`${feld} ist ausgenommen, steht aber weder in AUSNAHME_MUSS_ENTHALTEN noch in OHNE_NETZGRUND`);
  }
  // Und umgekehrt: wer in einer Ausnahmetabelle steht, muss wirklich
  // ausgenommen sein - sonst beschreibt die Tabelle etwas, das es nicht gibt.
  for (const feld of [...Object.keys(AUSNAHME_MUSS_ENTHALTEN), ...Object.keys(OHNE_NETZGRUND)]) {
    if (!Object.hasOwn(NICHT_GEPRUEFT, feld) && !Object.hasOwn(NICHT_GEPRUEFT_FELDER, feld)) {
      fehler.push(`${feld} steht in einer Ausnahmetabelle, ist aber nicht ausgenommen`);
    }
  }
  // Jede Ausnahme muss sich verdienen (siehe AUSNAHME_MUSS_ENTHALTEN).
  const textVon = (wert) => {
    if (typeof wert === 'string') return wert;
    if (Array.isArray(wert)) return wert.map(textVon).join(' ');
    if (wert && typeof wert === 'object') return Object.values(wert).map(textVon).join(' ');
    return '';
  };
  for (const [feld, netze] of Object.entries(AUSNAHME_MUSS_ENTHALTEN)) {
    if (feld === 'nichtUebernommen') continue; // je Feld oben geprüft
    const text = textVon(daten?.[feld]);
    for (const name of netze) {
      if (!NETZE[name].test(text)) {
        fehler.push(`${feld} ist von ${name} ausgenommen, enthält es aber nicht – eine Ausnahme ohne Grund ist eine Lücke`);
      }
    }
  }
  if (aus.length < 5) fehler.push('die Ausschlussliste ist zu kurz');
  for (const x of aus) {
    if (!nichtLeer(x.was) || !nichtLeer(x.warum)) fehler.push(`Ausschluss „${x.was ?? '?'}": unvollständig`);
  }
  if (daten?.quelle?.geprueft !== true) fehler.push('quelle.geprueft ist nicht true');
  for (const feld of ['werk', 'rechte', 'nachgezaehlt', 'abweichung']) {
    if (!nichtLeer(daten?.quelle?.[feld])) fehler.push(`quelle.${feld} fehlt`);
  }
  if (!new RegExp(`(?<!\\d)${MERKMALE_INSGESAMT}(?!\\d)`).test(daten?.quelle?.nachgezaehlt ?? '')) {
    fehler.push('quelle.nachgezaehlt nennt die Zahl der Merkmale nicht');
  }

  // --- Die Textnetze -------------------------------------------------------
  // Die Netze laufen ueber den REST - und ueber ein ausgenommenes Feld laeuft
  // jedes Netz weiter, fuer das es NICHT ausgenommen ist (Review Welle 83:
  // `nichtUebernommen` war pauschal von allen acht ausgenommen).
  const BENANNT = Object.freeze({
    KINDFRAGE: ['eine Frage an die Eltern über das Kind', KINDFRAGE],
    BEWERTUNG: ['eine Bewertung', BEWERTUNG],
    DIAGNOSE_ZUGESCHRIEBEN: ['eine Diagnose, dem Kind zugeschrieben', DIAGNOSE_ZUGESCHRIEBEN],
    VORHERSAGE: ['eine Vorhersage über dieses Kind', VORHERSAGE],
    SCHULFAEHIG_ALS_URTEIL: ['„schulfähig" als Urteil über dieses Kind', SCHULFAEHIG_ALS_URTEIL],
    KOENNENSALTER: ['eine Altersangabe, ab der ein Kind etwas können soll', KOENNENSALTER],
    LESEN_ERWARTET: ['die Erwartung, ein Kind solle vor der Schule lesen oder rechnen', LESEN_ERWARTET],
    KYRILLISCH: ['kyrillisch – die Quelle gehört in das Quellfeld', KYRILLISCH],
  });
  const alleTexte = [...angebotsTexte(daten)];
  // Dazu die ausgenommenen Felder, aber nur gegen die Netze, von denen sie
  // NICHT ausgenommen sind.
  for (const f of felder) {
    if (nichtLeer(f.nichtUebernommen)) alleTexte.push([`Feld ${f.id}.nichtUebernommen`, f.nichtUebernommen]);
  }
  for (const [wo, text] of alleTexte) {
    const feld = wo.split('.').at(-1);
    const frei = NETZ_AUSNAHMEN[feld] ?? {};
    for (const [name, [satz, netz]] of Object.entries(BENANNT)) {
      if (Object.hasOwn(frei, name)) continue;
      if (netz.test(text)) fehler.push(`${wo}: ${satz}`);
    }
  }
  // Die Fragen der Eltern duerfen die Checklistenfrage auch nicht als Zitat
  // tragen: sie werden laut gesagt.
  for (const [wo, text] of elternfragen(daten)) {
    if (KINDFRAGE.test(text)) fehler.push(`${wo}: die Frage selbst fragt über das Kind`);
  }
  return fehler;
}
