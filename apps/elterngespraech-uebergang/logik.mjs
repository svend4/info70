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

/** Wie viele Merkmale die Quelle traegt (nachgezaehlt S. 300-311). */
export const MERKMALE_INSGESAMT = 141;

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
export const BEWERTUNG = /\bAmpel\w*|\bankreuzen\b|\babhaken\b|\bHaken\b|\b\d+\s*(?:von|\/)\s*\d+\s*(?:Punkt|Merkmal)|\bProzent\b|\d\s*%|\bPunkte?\s+(?:zu\s+)?(?:sammeln|geben|vergeben|zählen)|\bStufe\s+\d|\bVergleich\s+(?:zu|mit)\s+(?:anderen\s+Kindern|Gleichaltrigen)/i;

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
export const VORHERSAGE = /\bdaran\s+erkennen\s+Sie,\s+ob\b|\bwird\s+(?:später|in\s+der\s+Schule)\b[^.!?]{0,30}\b(?:Schwierigkeiten|Probleme)\b|\bRisiko\s+für\s+(?:Lese|Rechen|Schul)\w*|\b(?:sagt|sagen)\s+(?:wir\s+)?voraus\b|\bvorhersagen\b|\bvoraussagen\b/i;

/** „Ihr Kind ist schulfaehig" als Urteil. Der Rechtsteil muss den Begriff
 *  erklaeren duerfen - getroffen wird die Zuschreibung an dieses Kind. */
export const SCHULFAEHIG_ALS_URTEIL = /\b(?:Ihr|dein|das)\s+Kind\s+(?:ist|wäre|scheint|wirkt)\s+(?:noch\s+)?(?:nicht\s+)?schul(?:fähig|reif|bereit)\b/i;

/** Eine Altersangabe, ab der ein Kind etwas koennen soll. Ausgeschriebene
 *  Zahlen gehoeren ins Netz: in Welle 80 ging „Kinder unter zehn Jahren"
 *  durch ein Netz, das nur Ziffern kannte. */
export const KOENNENSALTER = /\b(?:mit|ab)\s+(?:\d+|drei|vier|fünf|sechs|sieben|acht)\s+Jahren\s+(?:sollte|müsste|muss|kann\s+ein\s+Kind|können\s+Kinder)\b/i;

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
export const NICHT_GEPRUEFT = Object.freeze({
  wasEsIst: 'zitiert die umgedrehte Frage und das Ankreuzen, um beides abzulehnen',
  warumKeineCheckliste: 'zitiert die klinische Frage der Quelle, um sie abzulehnen',
  keinBericht: 'muss Punkte, Ampel, Stufen und Vergleich nennen, um sie auszuschließen',
  ausgeschlossen: 'die Ausschlussliste benennt, was sie ausschließt',
  quelle: 'Werk, Rechte und Zählung – russisch, mit Jahr und Seitenzahlen',
  elterntelefon: 'enthält die Telefonnummer',
  art: 'die Kennung der App, kein Text für Eltern',
  version: 'eine Zahl, kein Text',
});

/**
 * Einzelne Feldnamen, ueberall ausgenommen - und zwar nur, solange sie die
 * Konstruktion wirklich enthalten, fuer die sie ausgenommen sind.
 */
export const NICHT_GEPRUEFT_FELDER = Object.freeze({
  nichtUebernommen: 'zitiert die abgelehnte Frage an die Eltern über das Kind',
});

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
  keinBericht: ['BEWERTUNG'],
  ausgeschlossen: ['BEWERTUNG'],
  quelle: ['KYRILLISCH'],
  nichtUebernommen: ['KINDFRAGE'],
});

export function angebotsTexte(daten) {
  const t = [];
  const sammle = (wert, wo, feld) => {
    if (typeof wert === 'string') {
      if (nichtLeer(wert) && !(feld in NICHT_GEPRUEFT_FELDER)) t.push([wo, wert]);
      return;
    }
    if (Array.isArray(wert)) { wert.forEach((x, n) => sammle(x, `${wo}[${n}]`, feld)); return; }
    if (wert && typeof wert === 'object') { for (const [k, v] of Object.entries(wert)) sammle(v, `${wo}.${k}`, k); }
  };
  for (const [feld, wert] of Object.entries(daten ?? {})) {
    if (feld in NICHT_GEPRUEFT) continue;
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
    if (SCHULSTOFF.test(v.kurz ?? '') && !nichtLeer(v.quelle)) {
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
  for (const r of recht) {
    const wo = `Recht ${r.id ?? '?'}`;
    if (!ZEICHEN.test(r.zeichen ?? '')) fehler.push(`${wo}: zeichen fehlt`);
    for (const feld of ['frage', 'antwort', 'quelle']) {
      if (!nichtLeer(r[feld])) fehler.push(`${wo}: ${feld} fehlt – eine Rechtsauskunft ohne Quelle ist keine`);
    }
    if (nichtLeer(r.frage) && !r.frage.trim().endsWith('?')) fehler.push(`${wo}: frage ist keine Frage`);
  }
  // Landesrecht darf nicht wie Bundesrecht klingen: mindestens zwei Antworten
  // muessen je zwei Bundeslaender nennen.
  const mitZweiLaendern = recht.filter((r) => BUNDESLAENDER.filter((l) => (r.antwort ?? '').includes(l)).length >= 2);
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
  if (!new RegExp(String(MERKMALE_INSGESAMT)).test(daten?.quelle?.nachgezaehlt ?? '')) {
    fehler.push('quelle.nachgezaehlt nennt die Zahl der Merkmale nicht');
  }

  // --- Die Textnetze -------------------------------------------------------
  for (const [wo, text] of angebotsTexte(daten)) {
    if (KINDFRAGE.test(text)) fehler.push(`${wo}: eine Frage an die Eltern über das Kind`);
    if (BEWERTUNG.test(text)) fehler.push(`${wo}: eine Bewertung`);
    if (DIAGNOSE_ZUGESCHRIEBEN.test(text)) fehler.push(`${wo}: eine Diagnose, dem Kind zugeschrieben`);
    if (VORHERSAGE.test(text)) fehler.push(`${wo}: eine Vorhersage über dieses Kind`);
    if (SCHULFAEHIG_ALS_URTEIL.test(text)) fehler.push(`${wo}: „schulfähig" als Urteil über dieses Kind`);
    if (KOENNENSALTER.test(text)) fehler.push(`${wo}: eine Altersangabe, ab der ein Kind etwas können soll`);
    if (LESEN_ERWARTET.test(text)) fehler.push(`${wo}: die Erwartung, ein Kind solle vor der Schule lesen oder rechnen`);
    if (KYRILLISCH.test(text)) fehler.push(`${wo}: kyrillisch – die Quelle gehört in das Quellfeld`);
  }
  // Die Fragen der Eltern duerfen die Checklistenfrage auch nicht als Zitat
  // tragen: sie werden laut gesagt.
  for (const [wo, text] of elternfragen(daten)) {
    if (KINDFRAGE.test(text)) fehler.push(`${wo}: die Frage selbst fragt über das Kind`);
  }
  return fehler;
}
