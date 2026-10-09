// Selbststaendigkeits-Leiter (Praleska docs/10, Eltern-Werkzeuge Nr. 58,
// Quelle S. 94-96 «ПРИОБЩАЕМСЯ К ТРУДУ», Hinfuehrung zur Arbeit).
//
// TRAGENDE ENTSCHEIDUNGEN
//
// 1. KEINE GESAMTSTUFE. Keine summierende Funktion, kein Stand, keine Note,
//    keine Ampel und keine Farbe. Die Zeilen messen nichts Gemeinsames: dass
//    ein Kind den Teller tragen kann, sagt nichts darueber, ob es die Jacke
//    auszieht. Eine Ampel ueber die Selbststaendigkeit eines Kindes waere
//    eine Einstufung des Kindes - nach docs/02 und nach der KI-Verordnung
//    ausgeschlossen.
//
// 2. DREI STUFEN, IN BEIDE RICHTUNGEN. `noch-nicht` heisst „noch nicht
//    gesehen", nicht „zu spaet". Und jede Stufe laesst sich jederzeit
//    zuruecknehmen: ein Kind, das etwas konnte, will es nach einem Umzug oder
//    einer Krankheit oft wieder nicht. Es gibt deshalb keinen Code, der eine
//    einmal erreichte Stufe festhaelt.
//
// 3. DAS KIND IST IN JEDER ZEILE DER HANDELNDE, DER ERWACHSENE IN JEDER
//    GELEGENHEIT. `was` beschreibt, was das Kind tut; `gelegenheit`
//    beschreibt, was der Erwachsene bereitstellt - nie eine Uebung, die er
//    mit dem Kind macht. Der Validator prueft beides am Satz.
//
// 4. NUR DREI ZEILEN TRAGEN EIN ALTER, UND ZWAR EIN AMTLICHES. „Kann mit dem
//    Loeffel selber essen." (U7), „Oeffnet grosse Knoepfe selbst." und
//    „Beteiligt sich an haeuslichen Taetigkeiten, will mithelfen." (U7a)
//    stehen woertlich in der Kinder-Richtlinie, mit Zeitraum UND
//    Toleranzgrenze. Jede andere Zeile traegt bewusst keine Zahl: fuer die
//    meisten dieser Handgriffe gibt es keine belastbare Altersangabe, und
//    eine erfundene waere schlimmer als keine.
//
// 5. DIE REIHENFOLGE IST KEINE ALTERSFOLGE. `vorher` verweist auf die Zeile,
//    die leichter ist - ausziehen vor anziehen. Der Validator prueft, dass
//    jede Kette innerhalb ihres Bereichs bleibt und keinen Kreis bildet.

/** Die drei Stufen. Geschlossene Liste, ohne Farbe und ohne Zahl. */
export const STUFEN = Object.freeze(['noch-nicht', 'manchmal', 'sicher']);

/** Die Bereiche - geschlossene Liste. */
export const BEREICHE = Object.freeze(['anziehen', 'essen', 'haushalt', 'natur']);

/** Die Quelle traegt 23 Ziele. Die Zahl steht hier, damit die Fehllesung
 *  „23 Fertigkeiten" ueberhaupt benennbar ist - und nirgends sonst. */
export const ZIELE_QUELLE = 23;

/**
 * Von diesen 23 benennen NEUN eine konkrete, beobachtbare Handlung des Kindes
 * (Selbstbedienung 1-4, Haushalt 1, 2, 3 und 5, Natur 3). Die uebrigen
 * vierzehn beschreiben Haltungen oder Aufgaben des Erwachsenen - das ist der
 * Grund, warum die Katalogzahl „23 Fertigkeiten" eine Fehllesung ist.
 *
 * KORRIGIERT im Review der Welle 80: hier stand 4, und das war die Zahl
 * meiner eigenen GRUPPEN, nicht der Ziele. Nachgezaehlt sind es neun; die
 * Liste steht in `quelle.kindHandlungen`, und jede davon muss in einer Zeile
 * oder im Ausschluss auftauchen.
 */
export const ZIELE_MIT_KIND_HANDLUNG = 9;

/** Was eine gespeicherte Stufe tragen darf: die Zeile und die Stufe. Kein
 *  Datum, kein Name, keine Notiz. */
export const STAND_WERTE = STUFEN;

/**
 * Bewertung des Kindes. Laeuft ueber Zeilen und Gelegenheiten, NICHT ueber
 * die Absagefelder: `keinRueckstand` muss „Rueckstand" nennen, um das Wort
 * auszuschliessen. Falle A, dreizehntes Mal in diesem Projekt.
 */
export const BEWERTUNG = /\bAmpel\b|🔴|\brote Stufe\b|\bRückstand\b|\bDefizit\b|\bzu spät\b|\bverzögert\b|\bauffällig\b|\bScore\b|\bNote\b|\bPunkte\b|\bProzent\b|\d+\s*von\s*\d+|\bStufe \d|\bnormal für\b/i;

/**
 * Die Freude des Erwachsenen als GRUND. Das Motiv der Quelle, das nicht
 * uebertragbar ist: damit wird das Gefallen des Erwachsenen zum Zweck der
 * Hygiene. Gezielt auf die Konstruktion (Finalsatz + Gefuehl des
 * Erwachsenen), damit der Ausschluss sie nennen darf.
 */
export const LOB_ALS_GRUND = /(damit|weil)\s+(du|Sie|Mama|Papa|wir|die Erwachsenen|ich)\s+[^.!?]{0,30}(freu|stolz|zufrieden|lob)/i;

/**
 * Eine Altersangabe. Ausser in den drei amtlichen Zeilen verboten.
 *
 * NACHGEBESSERT im Review der Welle 80: die erste Fassung liess genau die
 * Notation der Kinder-Richtlinie durch („34. bis 36. Lebensmonat"), weil nach
 * der Zahl ein Punkt steht, dazu „nach 30 Monaten", „im 3. Lebensjahr" und
 * jedes ausgeschriebene Zahlwort - und an einem ausgeschriebenen „unter zehn
 * Jahren" in einer Pflanzen-Zeile ist die Zusage „kein Alter" auch wirklich
 * gebrochen gewesen.
 */
export const ALTERSANGABE = new RegExp([
  '\\d+\\.?\\s*(?:bis\\s*\\d+\\.?\\s*)?(?:Monat|Monate|Monaten|Lebensmonat|Lebensjahr|Jahr|Jahre|Jahren|J\\.)\\b',
  '\\b(?:ein|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|achtzehn|zwanzig|dreißig|sechsunddreißig)\\s*'
    + '(?:Monate|Monaten|Jahre|Jahren|Lebensmonat|Lebensjahr)\\b',
  '\\bab\\s*\\d',
  '\\bim\\s*\\d+\\.\\s*Lebensjahr',
].join('|'), 'i');

/** Die Fehllesung des Katalogeintrags. Darf nur im Ausschluss stehen. */
export const DREIUNDZWANZIG = /23\s*(lebenspraktische\s*)?(Fertigkeiten|Fähigkeiten|Handgriffe|Schritte)/i;

const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;

export function zeileVon(daten, id) {
  return (daten?.zeilen ?? []).find((z) => z.id === id) ?? null;
}

/**
 * Die Zeilen eines Bereichs, in der Reihenfolge der Voraussetzungen.
 *
 * Ein Bereich darf MEHRERE Ketten haben. Die erste Fassung erzwang genau eine
 * je Bereich, und das hat eine Behauptung erzeugt, die nicht stimmte: dass
 * Händewaschen eine Voraussetzung des Aufräumens sei. Eine Voraussetzung ist
 * eine Tatsache über zwei Handgriffe, kein Ordnungstrick (Review Welle 80).
 */
export function zeilenIm(daten, bereich) {
  const drin = (daten?.zeilen ?? []).filter((z) => z.bereich === bereich);
  const kinder = new Map();
  for (const z of drin) {
    if (!z.vorher) continue;
    kinder.set(z.vorher, [...(kinder.get(z.vorher) ?? []), z]);
  }
  const raus = [];
  const gesehen = new Set();
  const lauf = (z) => {
    if (gesehen.has(z.id)) return;
    gesehen.add(z.id);
    raus.push(z);
    for (const k of kinder.get(z.id) ?? []) lauf(k);
  };
  for (const z of drin) if (!z.vorher) lauf(z);
  // Was von keiner Wurzel erreichbar ist - ein Kreis oder ein Verweis ins
  // Leere -, kommt hinten dran, damit nichts verschwindet; der Validator
  // meldet es.
  for (const z of drin) if (!gesehen.has(z.id)) raus.push(z);
  return raus;
}

/** Die Bereiche in der Reihenfolge der Daten, `zuerst` zuerst. */
export function bereicheInReihenfolge(daten) {
  const b = [...(daten?.bereiche ?? [])];
  return [...b.filter((x) => x.zuerst), ...b.filter((x) => !x.zuerst)];
}

/** Prueft einen gespeicherten Eintrag. Mehr als Zeile und Stufe gibt es nicht. */
export function pruefeStand(stand, daten) {
  if (!stand || typeof stand !== 'object' || Array.isArray(stand)) return false;
  const ids = new Set((daten?.zeilen ?? []).map((z) => z.id));
  return Object.entries(stand).every(([k, v]) => ids.has(k) && STUFEN.includes(v));
}

/** Wirft weg, was nicht hineingehoert - beim Laden und beim Speichern. */
export function beschneide(stand, daten) {
  const ids = new Set((daten?.zeilen ?? []).map((z) => z.id));
  const raus = {};
  for (const [k, v] of Object.entries(stand ?? {})) {
    if (ids.has(k) && STUFEN.includes(v)) raus[k] = v;
  }
  return raus;
}

/** Die Stufe einer Zeile. Ohne Eintrag: `noch-nicht` - und das ist kein Befund. */
export function stufeVon(stand, id) {
  return STUFEN.includes(stand?.[id]) ? stand[id] : 'noch-nicht';
}

/**
 * Die AUSDRUECKLICH gesetzte Stufe, sonst `null`. Fuer die Anzeige ist der
 * Unterschied wichtig: „noch nicht angetippt" ist nicht dasselbe wie „ich
 * habe hingesehen und es noch nicht gesehen". Die erste Fassung meldete beim
 * ersten Oeffnen alle sechzehn Zeilen als „noch nicht, gedrueckt" (Review
 * Welle 80).
 */
export function gesetzteStufe(stand, id) {
  return STUFEN.includes(stand?.[id]) ? stand[id] : null;
}

/**
 * Wo gerade Bewegung ist: alles, was `manchmal` steht. Das ist der Nutzen
 * dieser App - was manchmal geht, braucht eine Gelegenheit, keine Uebung.
 */
export function inBewegung(daten, stand = {}) {
  return (daten?.zeilen ?? []).filter((z) => stufeVon(stand, z.id) === 'manchmal');
}

/**
 * Was als Naechstes eine Gelegenheit braucht: eine Zeile, die noch nicht
 * gesehen ist, deren Voraussetzung aber schon sicher ist. KEINE Prognose und
 * kein Soll - abgeleitet aus der Reihenfolge der Voraussetzungen, nicht aus
 * einem Alter.
 */
export function naechsteGelegenheiten(daten, stand = {}) {
  return (daten?.zeilen ?? []).filter((z) => {
    if (stufeVon(stand, z.id) !== 'noch-nicht') return false;
    if (!z.vorher) return false;
    return stufeVon(stand, z.vorher) === 'sicher';
  });
}

/**
 * Ein Zettel zum Mitnehmen. Ohne Gesamtstufe, ohne Zahl ueber die Liste -
 * und mit den Absagen, damit das Papier nicht wie ein Befund aussieht.
 */
export function bericht(daten, stand = {}) {
  const bewegung = inBewegung(daten, stand);
  const naechste = naechsteGelegenheiten(daten, stand);
  const zeilen = ['Selbstständigkeit – was ich gerade sehe', daten?.keinRueckstand ?? '', ''];
  if (bewegung.length) {
    zeilen.push('Geht manchmal:');
    for (const z of bewegung) zeilen.push(`- ${z.was}`, `  Gelegenheit: ${z.gelegenheit}`);
    zeilen.push('');
  }
  if (naechste.length) {
    zeilen.push('Könnte eine Gelegenheit brauchen:');
    for (const z of naechste) zeilen.push(`- ${z.was}`, `  Gelegenheit: ${z.gelegenheit}`);
    zeilen.push('');
  }
  if (!bewegung.length && !naechste.length) {
    zeilen.push('Hier steht gerade nichts – das ist kein Befund.', '');
  }
  zeilen.push(daten?.keinScreening ?? '');
  return zeilen.join('\n');
}

/** Validiert die Daten. Alles Tragende steht hier, nicht in der Redaktion. */
export function pruefeDaten(daten) {
  const fehler = [];
  const zeilen = daten?.zeilen ?? [];
  const aus = daten?.ausgeschlossen ?? [];

  if (zeilen.length < 12) fehler.push('zu wenige Zeilen');
  if (!aus.length) fehler.push('keine Ausschlussliste – was nicht übernommen ist, muss benannt sein');

  const ids = new Set();
  for (const z of zeilen) {
    const wo = `Zeile ${z.id ?? '?'}`;
    if (!z.id) fehler.push(`${wo}: id fehlt`);
    if (ids.has(z.id)) fehler.push(`${wo}: id doppelt`);
    ids.add(z.id);
    if (!BEREICHE.includes(z.bereich)) fehler.push(`${wo}: unbekannter bereich „${z.bereich}“`);
    if (!nichtLeer(z.was)) fehler.push(`${wo}: was fehlt`);
    if (!nichtLeer(z.gelegenheit)) fehler.push(`${wo}: gelegenheit fehlt – ohne sie ist die Zeile eine Anforderung`);
    // Das Kind handelt. Steht „Sie“ im Satz, beschreibt die Zeile den
    // Erwachsenen - und aus der Leiter würde eine Übungsanleitung.
    if (/\bSie\b|\bdu\b/.test(z.was ?? '')) fehler.push(`${wo}: was nennt den Erwachsenen – handelnd ist das Kind`);
    // Und in der Gelegenheit handelt der Erwachsene.
    if (!/\bSie\b/.test(z.gelegenheit ?? '')) fehler.push(`${wo}: gelegenheit nennt nicht SIE – eine Gelegenheit schafft der Erwachsene`);
    // Keine Übung am Kind: die Gelegenheit ist ein Angebot, keine Lektion.
    if (/üben|trainier|Übung|beibringen|lehren/i.test(z.gelegenheit ?? '')) {
      fehler.push(`${wo}: die Gelegenheit ist ein Angebot, keine Übung`);
    }
    // `quellZiel` ist der Index in die NEUN Quellziele, die eine konkrete
    // Handlung des Kindes benennen - nicht in die 23 Ziele des Abschnitts.
    // `null` ist erlaubt, aber dann MUSS die Zeile sagen, woher sie kommt:
    // eine Zeile ohne Quelle und ohne Erklaerung waere eine erfundene Quelle.
    if (z.quellZiel === null || z.quellZiel === undefined) {
      if (!nichtLeer(z.eigen)) {
        fehler.push(`${wo}: ohne quellZiel – dann muss „eigen“ sagen, woher die Zeile kommt`);
      }
    } else if (!Number.isInteger(z.quellZiel) || z.quellZiel < 1 || z.quellZiel > ZIELE_MIT_KIND_HANDLUNG) {
      fehler.push(`${wo}: quellZiel liegt außerhalb der neun Ziele mit einer Handlung des Kindes`);
    }
  }

  // --- Die Leiter: jede Kette bleibt im Bereich und bildet keinen Kreis
  for (const b of BEREICHE) {
    const drin = zeilen.filter((z) => z.bereich === b);
    if (!drin.length) { fehler.push(`Bereich ${b}: keine Zeile`); continue; }
    const wurzeln = drin.filter((z) => !z.vorher);
    if (!wurzeln.length) fehler.push(`Bereich ${b}: keine Zeile ohne Voraussetzung – dann hängt alles im Kreis`);
    for (const z of drin) {
      if (!z.vorher) continue;
      const v = zeileVon(daten, z.vorher);
      if (!v) { fehler.push(`Zeile ${z.id}: vorher „${z.vorher}“ gibt es nicht`); continue; }
      if (v.bereich !== z.bereich) fehler.push(`Zeile ${z.id}: vorher liegt in einem anderen Bereich`);
    }
    // Jede Zeile muss von einer Wurzel aus erreichbar sein. Das faengt den
    // Kreis und den Verweis ins Leere in einem.
    const erreichbar = new Set();
    const lauf = (z) => {
      if (erreichbar.has(z.id)) return;
      erreichbar.add(z.id);
      for (const k of drin.filter((x) => x.vorher === z.id)) lauf(k);
    };
    for (const z of wurzeln) lauf(z);
    for (const z of drin) {
      if (!erreichbar.has(z.id)) {
        fehler.push(`Zeile ${z.id}: von keiner Wurzel aus erreichbar – ein Kreis oder ein Verweis ins Leere`);
      }
    }
  }
  for (const b of daten?.bereiche ?? []) {
    if (!BEREICHE.includes(b.id)) fehler.push(`Bereich ${b.id}: nicht in der geschlossenen Liste`);
  }
  if (!(daten?.bereiche ?? []).some((b) => b.zuerst)) fehler.push('kein Bereich steht zuerst');

  // --- Alter nur in den drei amtlichen Zeilen, und dort vollständig
  const amtliche = zeilen.filter((z) => z.amtlich);
  if (amtliche.length !== 3) fehler.push(`genau drei Zeilen stehen amtlich in der Kinder-Richtlinie, hier sind ${amtliche.length}`);
  for (const z of amtliche) {
    const a = z.amtlich;
    const wo = `Zeile ${z.id}`;
    if (!/^U7a?$/.test(String(a.untersuchung ?? ''))) fehler.push(`${wo}: amtlich.untersuchung muss U7 oder U7a sein`);
    if (!nichtLeer(a.zeitraum)) fehler.push(`${wo}: amtlich.zeitraum fehlt`);
    // Ohne Toleranzgrenze wird aus dem Fenster ein Punktalter.
    if (!nichtLeer(a.toleranz)) fehler.push(`${wo}: amtlich.toleranz fehlt – ohne sie liest sich das Fenster als Punktalter`);
    if (!nichtLeer(a.rubrik)) fehler.push(`${wo}: amtlich.rubrik fehlt – die Rubrik ist der Punkt: „Selbstständigkeit“ ist keine`);
    if (a.wortlaut !== z.was) fehler.push(`${wo}: der amtliche Wortlaut muss mit der Zeile übereinstimmen`);
  }
  for (const z of zeilen) {
    const text = `${z.was} ${z.gelegenheit} ${z.grenze ?? ''}`;
    if (!z.amtlich && ALTERSANGABE.test(text)) {
      fehler.push(`Zeile ${z.id}: eine Altersangabe ohne amtliche Fundstelle`);
    }
  }

  // --- Textnetze über Zeilen (die Absagefelder sind ausgenommen)
  for (const z of zeilen) {
    const felder = [['was', z.was], ['gelegenheit', z.gelegenheit], ['grenze', z.grenze ?? '']];
    for (const [feld, t] of felder) {
      if (!t) continue;
      if (BEWERTUNG.test(t)) fehler.push(`Bewertung in Zeile ${z.id}.${feld}: „${t.slice(0, 60)}“`);
      if (LOB_ALS_GRUND.test(t)) fehler.push(`das Gefallen des Erwachsenen als Grund in Zeile ${z.id}.${feld}`);
      if (DREIUNDZWANZIG.test(t)) fehler.push(`die Fehllesung „23 Fertigkeiten“ in Zeile ${z.id}.${feld}`);
    }
  }

  // --- Die Zusagen stehen in den Daten
  const pflicht = [
    ['hinweis', /Gerät ist in Ihrer Hand/, 'das Gerät gehört dem Erwachsenen'],
    ['wasEsIst', /keine Gesamtstufe/, 'die fehlende Gesamtstufe muss ausgesprochen sein'],
    ['wasEsIst', /nicht zusammengerechnet|nichts Gemeinsames/, 'und begründet'],
    ['wozuDasGut', /manchmal/, 'der Nutzen steckt in „manchmal“'],
    ['keinRueckstand', /noch nicht gesehen/, '„noch nicht“ muss erklärt sein'],
    ['keinRueckstand', /beide Richtungen/, 'und die Umkehrbarkeit'],
    ['keinScreening', /kein Entwicklungstest/, 'der fehlende Test muss ausgesprochen sein'],
    ['keinScreening', /Vorsorgeuntersuchungen/, 'und die zuständige Stelle benannt'],
    ['keineZahlen', /kein Alter/, 'die fehlenden Altersangaben müssen ausgesprochen sein'],
    ['keineZahlen', /Reihenfolge der Voraussetzungen/, 'und die Reihenfolge erklärt'],
    ['amtlichErklaert', /SPÄTE Grenzen/, 'dass ein solches Fenster eine späte Grenze ist, ist der entscheidende Punkt'],
    ['amtlichErklaert', /Toleranz/, 'und die Toleranzgrenze gehört dazu'],
    ['keinLohn', /keine Belohnungstafel/, 'die fehlende Tafel muss ausgesprochen sein'],
    ['keineErsteHilfe', /keine Erste-Hilfe-Anleitung/, 'die fehlende Anleitung muss ausgesprochen sein'],
    ['keineErsteHilfe', /bundesweite Nummer dafür gibt es nicht/, 'und die regionale Lage der Giftinformationszentren'],
    ['elterntelefon', /0800 111 0 550/, 'das Elterntelefon gehört in ein Eltern-Werkzeug'],
  ];
  for (const [feld, muster, warum] of pflicht) {
    if (!muster.test(String(daten?.[feld] ?? ''))) fehler.push(`${feld}: ${warum}`);
  }
  for (const s of STUFEN) {
    if (!nichtLeer(daten?.stufenTexte?.[s])) fehler.push(`stufenTexte.${s} fehlt`);
  }

  // --- Die Ausschlüsse, die diese App tragen
  for (const [muster, name] of [[/Ampel/i, 'die Ampel'], [/23/, 'die Lesart „23 Fertigkeiten“'],
    [/Hilf mir/i, 'das unbelegte Montessori-Zitat'], [/Tischdienst|Dienst am Esstisch/i, 'der Tischdienst'],
    [/freuen/i, 'die Freude des Erwachsenen als Grund'], [/Status/i, 'der Status in der Gruppe'],
    [/Belohnungstafel/i, 'die Belohnungstafel'], [/Altersangaben/i, 'die Altersangaben'],
    [/Wassertemperatur/i, 'die Wassertemperatur'], [/Erste-Hilfe/i, 'die Erste-Hilfe-Anleitung'],
    [/Fest/i, 'das Schmücken zum Fest'], [/Liste giftiger Pflanzen/i, 'die Pflanzenliste']]) {
    if (!aus.some((a) => muster.test(a.was ?? ''))) fehler.push(`ausgeschlossen: ${name} muss zurückgewiesen werden`);
  }
  for (const a of aus) {
    if (!nichtLeer(a.was)) fehler.push('ausgeschlossen: was fehlt');
    if (!nichtLeer(a.warum)) fehler.push(`ausgeschlossen ${a.quellNr}: warum fehlt – ein Ausschluss ohne Grund ist Redaktion`);
  }

  // --- Quellbilanz
  const z = daten?.quelle?.zahlen ?? {};
  if (z.zieleQuelle !== ZIELE_QUELLE) fehler.push(`quelle.zahlen: der Abschnitt trägt ${ZIELE_QUELLE} Ziele`);
  if (z.abschnitte !== 5) fehler.push('quelle.zahlen: der Abschnitt hat fünf Teile');
  if (z.zieleMitKindHandlung !== ZIELE_MIT_KIND_HANDLUNG) {
    fehler.push(`quelle.zahlen: ${ZIELE_MIT_KIND_HANDLUNG} Ziele benennen eine Handlung des Kindes`);
  }
  // Die neun Ziele stehen einzeln da, nicht nur als Zahl - sonst liesse sich
  // die Zahl behaupten, ohne sie zu belegen.
  const handlungen = daten?.quelle?.kindHandlungen ?? [];
  if (handlungen.length !== ZIELE_MIT_KIND_HANDLUNG) {
    fehler.push(`quelle.kindHandlungen: ${ZIELE_MIT_KIND_HANDLUNG} Ziele müssen einzeln benannt sein, es sind ${handlungen.length}`);
  }
  for (const [i, h] of handlungen.entries()) {
    if (!nichtLeer(h)) fehler.push(`quelle.kindHandlungen[${i}] ist leer`);
  }
  // Jedes der neun Ziele muss in einer Zeile stehen ODER im Ausschluss
  // begruendet sein (Bauart aus Nr. 49 und Nr. 57).
  const benutzt = new Set(zeilen.map((x) => x.quellZiel).filter(Number.isInteger));
  const abgelehnt = new Set((daten?.ausgeschlossen ?? []).map((a) => a.quellZiel).filter(Number.isInteger));
  for (let n = 1; n <= ZIELE_MIT_KIND_HANDLUNG; n++) {
    if (!benutzt.has(n) && !abgelehnt.has(n)) {
      fehler.push(`Quellziel ${n} mit Kind-Handlung: weder in einer Zeile noch im Ausschluss begründet`);
    }
    if (benutzt.has(n) && abgelehnt.has(n)) {
      fehler.push(`Quellziel ${n}: steht in einer Zeile UND im Ausschluss`);
    }
  }
  if (!/benennen davon neun/.test(daten?.quelle?.nachgezaehlt ?? '')) {
    fehler.push('quelle.nachgezaehlt muss sagen, wie viele Ziele eine Handlung des Kindes benennen');
  }
  if (!/ein einziges Ziel/.test(daten?.quelle?.nachgezaehlt ?? '')) {
    fehler.push('quelle.nachgezaehlt muss sagen, dass ein Ziel allein acht Handgriffe trägt – daran hängt die Fehllesung');
  }
  if (!/Grenzstein/.test(daten?.quelle?.amtlich ?? '')) {
    fehler.push('quelle.amtlich muss sagen, dass das Wort „Grenzstein“ in der Richtlinie nicht vorkommt');
  }
  if (!/nicht die letzte sein/.test(daten?.quelle?.amtlich ?? '')) {
    fehler.push('quelle.amtlich muss sagen, dass die Richtlinie weiter geändert wird');
  }
  if (!/Eigenproduktion/.test(daten?.quelle?.rechte ?? '')) fehler.push('quelle.rechte muss „Eigenproduktion“ aussprechen');
  if (!daten?.quelle?.geprueft) fehler.push('quelle.geprueft fehlt');

  // --- Kyrillisch nur in der Quellenangabe
  const erlaubt = new Set([daten?.quelle?.werk, daten?.quelle?.rechte, daten?.quelle?.nachgezaehlt,
    daten?.quelle?.abweichung, daten?.quelle?.amtlich].filter(Boolean));
  const suchen = (wert, pfad) => {
    if (typeof wert === 'string') {
      if (/[Ѐ-ӿ]/.test(wert) && !erlaubt.has(wert)) fehler.push(`${pfad}: kyrillische Schrift außerhalb der Quellenangabe`);
      return;
    }
    if (Array.isArray(wert)) { wert.forEach((x, i) => suchen(x, `${pfad}[${i}]`)); return; }
    if (wert && typeof wert === 'object') for (const [k, v] of Object.entries(wert)) suchen(v, `${pfad}.${k}`);
  };
  suchen(daten, 'daten');
  return fehler;
}
