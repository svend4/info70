// Spielzeug-Check U3 (Praleska docs/10, Eltern-Werkzeuge Nr. 56,
// Quelle S. 69-70 «Дидактические игры»).
//
// Der Gegenstand ist EIN SPIELZEUG - ein Objekt, nicht ein Raum und nicht
// ein Kind. Die Raum-Checkliste ist `apps/sicherer-krabbelraum-check`.
//
// TRAGENDE ENTSCHEIDUNGEN
//
// 1. KEINE GESAMTWERTUNG. Keine summierende Funktion, kein „n von m", kein
//    Prozentwert, keine Ampel, kein „bestanden" (docs/02). Die Gefahren sind
//    nicht gegeneinander aufrechenbar, und eine gemischte Liste aus
//    Sicherheit und Eignung wird als Gesamtnote gelesen - genau an dieser
//    Stelle kippt ein Check zur Kaufberatung. Gleiche Bauart wie Nr. 50.
//
// 2. JEDE ZEILE SAGT, WIE MAN SIE ZU HAUSE PRUEFT - UND WO DAS ENDET. Das
//    ist der eigentliche Wert dieser App und gleichzeitig ihre Ehrlichkeit:
//    `wieZuPruefen` und `prueferGrenze` sind Pflichtfelder. Eine Zeile ohne
//    Hausprüfung ist keine Prüfung, und eine Hausprüfung ohne benannte
//    Grenze beruhigt, ohne zu prüfen.
//
// 3. KEINE MARKE, KEIN PREIS, KEINE BEZUGSQUELLE. Beschrieben werden
//    Spielzeug-ARTEN und Eigenschaften. Vorbild `apps/musikmomente-1-3`
//    (Werk und Komponist, kein Label) und `apps/vorlese-kompass`
//    (Buchtypen, keine Titel). Der „Ergebnisbericht fuer den naechsten
//    Spielzeugkauf" des Katalogeintrags ist darum kein Einkaufszettel,
//    sondern eine Liste offener EIGENSCHAFTEN. Der HERSTELLER dagegen darf
//    und muss vorkommen - er ist der, der nach dem Recht erklaert und haftet
//    (siehe HERSTELLER_GENANNT).
//
// 4. KEIN WIRKVERSPRECHEN. Dass selbstkorrigierendes Material die
//    Entwicklung von Kindern unter drei Jahren voranbringt, ist NICHT
//    belegt - es gibt dazu keine Wirksamkeitsstudie, und die Uebersichten
//    zur Montessori-Paedagogik betreffen Kinder ab etwa drei Jahren.
//    Uebernommen ist nur, was beschreibend belegt ist: was Kinder dieses
//    Alters mit solchem Material TUN.
//
// 5. DIE ZAHLEN SIND DIE ZAHLEN DER NORM, NICHT DIE DIESER APP. Der Text von
//    EN 71-1 (Fassung 2011 mit Aenderung A3) lag beim Bau vor und ist
//    nachgelesen: Pruefzylinder 31,7 mm mit schraegem Boden 25,4 bis
//    57,1 mm, Schablone E fuer Baelle 44,5 mm in einer 6,4 mm dicken Platte,
//    Schnurlaengen 220/300/380/800 mm, Verpackungsfolie 0,038 mm,
//    becherfoermige Teile 64 bis 102 mm bei unter 177 ml und mehr als 13 mm
//    Tiefe. Jede dieser Zahlen steht nur in einem Feld, das auch sagt, wessen
//    Zahl sie ist (MASSZAHL/HERKUNFT), und keine Zeile nennt ein Mass, deren
//    Quelle nicht als geprueft markiert ist. Wo der Normtext NICHT vorlag -
//    Batteriefaecher, Schadstoffuebergang -, nennt die Zeile das selbst und
//    gibt keine Stelle an.
//

/** Die Bereiche, in denen geprüft wird - geschlossene Liste. */
export const BEREICHE = Object.freeze(['kennzeichen', 'kleinteile', 'strangulieren', 'batterien', 'material', 'passt']);

/** Bereiche, in denen es um Leben und Gesundheit geht. Dort MUSS es eine
 *  kritische Zeile geben, sonst fehlt der Liste ihr Grund. */
export const LEBENSGEFAHR = Object.freeze(['kleinteile', 'strangulieren', 'batterien']);

/** `einmal` = ein Handgriff an diesem Spielzeug, abhakbar.
 *  `immer`  = eine Regel für jedes Spielen, NICHT abhakbar - ein Haken
 *             würde eine Dauerregel als erledigt ausgeben (docs/02). */
export const ARTEN = Object.freeze(['einmal', 'immer']);

/**
 * Marke, Preis, Bezugsquelle. Läuft über ALLE Textfelder - anders als in
 * `apps/musikmomente-1-3`, wo nur die Anweisungsfelder gemeint waren. Hier
 * ist jede Nennung ein Problem, weil der Gegenstand ein Kaufobjekt ist.
 */
export const MARKE_ODER_PREIS = /(€|EUR\b|\bEuro\b|\bPreis\b|\bkostet\b|\bgünstig\b|\bteuer\b|\bMarke\b|\bModell\b|\bShop\b|\bbestellen\b|\bAmazon\b|\bOnlinehandel\b|\bAngebot\s+(?:von|bei)\b|\bempfehlenswerte[rs]?\s+Produkt\b)/i;

/**
 * „Hersteller" stand zuerst in MARKE_ODER_PREIS und hat genau das Feld
 * erschlagen, das die Aufklärung trägt: dass CE die Erklärung des
 * HERSTELLERS ist und dass ein Aufkleber den HERSTELLER nicht aus der
 * Verantwortung nimmt. Verboten ist nicht das Wort, sondern das NENNEN eines
 * bestimmten Herstellers. Gezielt wird darum auf die Konstruktion: dem Wort
 * folgt ein Eigenname. Zehnter Fall dieser Art in diesem Projekt - ein Netz,
 * das ein Wort verbietet, verbietet auch seine Zurückweisung.
 *
 * OHNE `i`: mit dem Flag würde die Großschreibung nicht mehr zählen.
 *
 * NACHGEBESSERT (Review Welle 80): die erste Fassung war
 * `/\bHerstellers?\s+[A-ZÄÖÜ]/` und damit in BEIDE Richtungen falsch. Im
 * Deutschen ist JEDES Substantiv großgeschrieben - „Hat der Hersteller Normen
 * vollständig angewendet" löste das Netz aus, und weil `pruefeDaten` dann
 * einen Fehler meldet, hätte die App statt des Inhalts nur noch
 * „Datenfehler" gezeigt. Umgekehrt blieb der Eigenname in Anführungszeichen
 * unentdeckt. Getroffen wird jetzt, was ein Eigenname WIRKLICH mitbringt:
 * Anführungszeichen, die Konstruktion „vom Hersteller X" oder eine
 * Rechtsform. Falle A, fünfzehntes Mal - und der Grund ist diesmal nicht ein
 * zu weites Wort, sondern eine Eigenschaft der deutschen Orthografie.
 *
 * Was dieses Netz NICHT kann: „vom Hersteller Musterwerk" von „vom Hersteller
 * Angaben" unterscheiden. Ein Eigenname ist im Deutschen lexikalisch nicht
 * erkennbar, und ein Netz, das es behauptet, wäre eine Zusage, die es nicht
 * hält. Getroffen wird, was ein Markenname typischerweise MITBRINGT -
 * Anführungszeichen, Rechtsform, Schutzzeichen; den Rest halten die
 * ausgesprochene Zusage in `keineMarken` und das Review.
 */
export const HERSTELLER_GENANNT = /\bHerstellers?\s+(?:namens\s+)?[„"'»]|[A-ZÄÖÜ]\w*\s*(?:GmbH|AG|KGaA|KG|SE|Ltd|Inc|&\s*Co\b)|[®™]/;

/**
 * Eine Maßzahl. Nachgebessert im Review der Welle 80: die erste Fassung kannte
 * nur `mm|cm|ml`, und „0,5 Zentimeter" oder „0,22 m" gingen durch - also
 * genau die Schreibweisen, mit denen sich die Zusage „keine Zahl ohne
 * geprüfte Quelle" umgehen ließ.
 */
const MASSZAHL = /\d+(?:,\d+)?\s*(?:mm|cm|dm|ml|l|m|Millimeter|Zentimeter|Dezimeter|Meter|Milliliter|Liter)\b/;

/**
 * Woher eine Maßzahl kommt. Jede Zahl in dieser App ist die Zahl der Norm
 * oder des Rechts, keine Vorgabe dieser App an die Lesenden - darum muss im
 * GLEICHEN Feld stehen, wessen Zahl es ist. Eine Zahl ohne Herkunft liest
 * sich als Anweisung („nehmen Sie 44,5 mm") statt als Tatsache.
 */
const HERKUNFT = /Norm|Richtlinie|Schablone|Prüfzylinder|vorgeschrieben|verlangt|Anforderung/i;

/**
 * Wirkversprechen zur Entwicklung. Gezielt auf die KONSTRUKTION (Wirkung +
 * Gegenstand), damit das Feld, das das Versprechen ZURÜCKWEIST, es nennen
 * darf. Das ist in diesem Projekt neunmal schiefgegangen.
 */
export const WIRKVERSPRECHEN = /(fördert|trainiert|verbessert|steigert|entwickelt|schult|stärkt)\s[^.!?]{0,30}(Intelligenz|Entwicklung|Konzentration|Feinmotorik|Denken|Sprache|Gehirn)|macht\s[^.!?]{0,20}(klüger|schlauer|intelligenter)|(fördert|unterstützt)\s+die\s+Entwicklung/i;

/** Gesamtwertung. Darf nirgends stehen außer in dem Feld, das sie ausschließt. */
export const GESAMTWERTUNG = /\d+\s*(von|aus)\s*\d+|\d+\s*%|\bProzent\b|\bAmpel\b|\bbestanden\b|\bNote\b|\bPunktzahl\b|\bgeeignet:\s*(ja|nein)\b/i;

const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;

export function pruefungVon(daten, id) {
  return (daten?.pruefungen ?? []).find((p) => p.id === id) ?? null;
}

export function artVon(daten, id) {
  return (daten?.arten ?? []).find((a) => a.id === id) ?? null;
}

/** Nur `einmal`-Zeilen sind abhakbar. */
export function istAbhakbar(pruefung) {
  return pruefung?.art === 'einmal';
}

/** Die Bereiche in der Reihenfolge der Daten, `zuerst` zuerst. */
export function bereicheInReihenfolge(daten) {
  const b = [...(daten?.bereiche ?? [])];
  return [...b.filter((x) => x.zuerst), ...b.filter((x) => !x.zuerst)];
}

/** Die Prüfungen eines Bereichs, kritische zuerst. */
export function pruefungenIm(daten, bereich) {
  return (daten?.pruefungen ?? [])
    .filter((p) => p.bereich === bereich)
    .sort((a, b) => Number(Boolean(b.kritisch)) - Number(Boolean(a.kritisch)));
}

/**
 * Was noch offen ist - kritische Zeilen zuerst. KEINE Zahl, kein Anteil:
 * die Liste ist die Ausgabe, nicht ihre Länge.
 */
export function offenePunkte(daten, erledigt = {}) {
  return (daten?.pruefungen ?? [])
    .filter((p) => istAbhakbar(p) && !erledigt[p.id])
    .sort((a, b) => Number(Boolean(b.kritisch)) - Number(Boolean(a.kritisch)));
}

/** Die Dauerregeln - nie abhakbar, nie in der Offen-Liste. */
export function dauerregeln(daten) {
  return (daten?.pruefungen ?? []).filter((p) => !istAbhakbar(p));
}

/**
 * Der Bericht: offene Eigenschaften, Dauerregeln, und der Satz, dass eine
 * leere Liste nichts freigibt. Kein Gesamtwert, keine Quote, keine Note -
 * und kein Einkaufszettel.
 */
export function bericht(daten, erledigt = {}, stand = '') {
  const offen = offenePunkte(daten, erledigt);
  const kritisch = offen.filter((p) => p.kritisch);
  const rest = offen.filter((p) => !p.kritisch);
  const zeilen = [
    'Spielzeug-Check U3 – Beobachtungen eines Erwachsenen an EINEM Spielzeug',
    daten?.keinErgebnis ?? '',
    stand ? `Liste erstellt am ${stand}` : '',
    '',
  ];
  if (kritisch.length) {
    zeilen.push('Das zuerst:');
    for (const p of kritisch) zeilen.push(`- ${p.was}`);
    zeilen.push('');
  }
  if (rest.length) {
    zeilen.push('Noch offen:');
    for (const p of rest) zeilen.push(`- ${p.was}`);
    zeilen.push('');
  }
  if (!offen.length) zeilen.push('Aus dieser Liste ist gerade nichts offen.', '');
  zeilen.push('Regeln für jedes Spielen (nicht abhakbar):');
  for (const p of dauerregeln(daten)) zeilen.push(`- ${p.was}`);
  zeilen.push('', daten?.nichtFertig ?? '', daten?.keinEinkaufszettel ?? '');
  return zeilen.filter((z) => z !== undefined).join('\n');
}

/**
 * Validiert die Daten. Alles Tragende steht hier und nicht in der
 * Redaktion. Die Ausschlussliste und die Zusagefelder sind von den
 * Textnetzen ausgenommen: sie MÜSSEN das Verbotene nennen, um es
 * auszuschließen.
 */
export function pruefeDaten(daten) {
  const fehler = [];
  const pruefungen = daten?.pruefungen ?? [];
  const arten = daten?.arten ?? [];
  const aus = daten?.ausgeschlossen ?? [];

  if (pruefungen.length < 10) fehler.push('zu wenige Prüfungen');
  if (!aus.length) fehler.push('keine Ausschlussliste – was nicht übernommen ist, muss benannt sein');

  const ids = new Set();
  for (const p of pruefungen) {
    const wo = `Prüfung ${p.id ?? '?'}`;
    if (!p.id) fehler.push(`${wo}: id fehlt`);
    if (ids.has(p.id)) fehler.push(`${wo}: id doppelt`);
    ids.add(p.id);
    if (!BEREICHE.includes(p.bereich)) fehler.push(`${wo}: unbekannter bereich „${p.bereich}“`);
    if (!ARTEN.includes(p.art)) fehler.push(`${wo}: unbekannte art „${p.art}“`);
    if (!nichtLeer(p.was)) fehler.push(`${wo}: was fehlt`);
    if (!nichtLeer(p.warum)) fehler.push(`${wo}: warum fehlt`);
    // Die zwei Pflichtfelder, die diese App ausmachen.
    if (!nichtLeer(p.wieZuPruefen)) {
      fehler.push(`${wo}: wieZuPruefen fehlt – eine Zeile, die man zu Hause nicht prüfen kann, ist keine Prüfung`);
    }
    if (!nichtLeer(p.prueferGrenze)) {
      fehler.push(`${wo}: prueferGrenze fehlt – eine Hausprüfung ohne benannte Grenze beruhigt, ohne zu prüfen`);
    }
    if (!p.quelle?.gremium) fehler.push(`${wo}: quelle.gremium fehlt`);
    // Eine Fundstelle nur mit Prüfvermerk (docs/02).
    const stelle = /Artikel \d|Anhang [IVX]|Paragraf \d|Abschnitt \d|Nummer \d|Teil [IVX]/;
    if (stelle.test(JSON.stringify(p.quelle ?? {})) && p.quelle?.geprueft !== true) {
      fehler.push(`${wo}: nennt eine Fundstelle, ohne dass die Quelle als geprüft markiert ist`);
    }
  }

  // Jeder Bereich ist belegt, und in jedem Lebensgefahr-Bereich gibt es
  // eine kritische Zeile.
  for (const b of BEREICHE) {
    if (!pruefungenIm(daten, b).length) fehler.push(`Bereich ${b}: keine Prüfung`);
  }
  for (const b of LEBENSGEFAHR) {
    if (!pruefungenIm(daten, b).some((p) => p.kritisch)) {
      fehler.push(`Bereich ${b}: keine kritische Zeile – dann fehlt der Liste ihr Grund`);
    }
  }
  for (const b of daten?.bereiche ?? []) {
    if (!BEREICHE.includes(b.id)) fehler.push(`Bereich ${b.id}: nicht in der geschlossenen Liste`);
  }
  if (!(daten?.bereiche ?? []).some((b) => b.zuerst)) fehler.push('kein Bereich steht zuerst');

  // --- Die drei Kennzeichen-Zeilen tragen die Aufklärung, um die es geht
  const ce = pruefungen.find((p) => /CE/.test(p.was ?? ''));
  if (!ce) fehler.push('keine Zeile zur CE-Kennzeichnung');
  else {
    // Verankert auf das NEGIERTE, nicht auf eine Wortfolge: die erste Fassung
    // ließ „CE ist KEINE Prüfung durch den Händler. … die eine unabhängige
    // Prüfstelle vorher bestätigt hat" durchgehen, also genau die Fehllesart,
    // die der Ausschluss x01 zurückweist (Review Welle 80).
    if (!/[Kk]eine Prüfung durch eine unabhängige Stelle|KEINE Prüfung durch eine unabhängige Stelle/.test(ce.prueferGrenze ?? '')) {
      fehler.push('CE-Zeile: dass CE keine Prüfung durch eine unabhängige Stelle ist, muss wörtlich dastehen');
    }
    if (/\bCE heißt geprüft“ ist also richtig|unabhängige (Prüf)?[Ss]telle \w* ?(vorher )?bestätigt/.test(ce.prueferGrenze ?? '')) {
      fehler.push('CE-Zeile: behauptet die Beteiligung einer unabhängigen Stelle – das ist die Fehllesart aus x01');
    }
    if (!/Erklärung des Herstellers|erklärt.{0,20}selbst/i.test(ce.prueferGrenze ?? '')) {
      fehler.push('CE-Zeile: dass es die Erklärung des Herstellers ist, muss dastehen');
    }
    if (ce.kritisch) fehler.push('CE-Zeile: nicht kritisch – ein fehlendes CE ist ein Ausschluss, kein Lebensrisiko');
  }
  // Die GS-Zeile hatte bis zum Review der Welle 80 zwei Fehler: sie verlangte
  // den NAMEN der Prüfstelle, und sie nannte als Fundstelle Paragraf 21. Im
  // Gesetz nachgelesen: Paragraf 20 ist die Zuerkennung, Paragraf 21 die
  // Befugnis der GS-Stelle, Paragraf 22 ihre Pflichten - und die Gestaltung
  // steht in der ANLAGE, die nicht den Namen, sondern das SYMBOL der GS-Stelle
  // verlangt (linke obere Ecke, eindeutiger Rückschluss auf die Stelle).
  const gs = pruefungen.find((p) => /GS-Zeichen/.test(p.was ?? ''));
  if (!gs) fehler.push('keine Zeile zum GS-Zeichen');
  else {
    if (!/Symbol der (GS-Stelle|Prüfstelle)/i.test(`${gs.was} ${gs.wieZuPruefen}`)) {
      fehler.push('GS-Zeile: verlangt wird das Symbol der GS-Stelle, nicht ihr Name – das ist das Prüfbare daran');
    }
    if (!/fünf Jahre/.test(gs.prueferGrenze ?? '')) {
      fehler.push('GS-Zeile: die Befristung auf höchstens fünf Jahre gehört zur Grenze');
    }
    if (!/Liste aller/.test(gs.prueferGrenze ?? '')) {
      fehler.push('GS-Zeile: dass die GS-Stelle ihre Bescheinigungen veröffentlichen muss, ist der einzige echte Nachweisweg');
    }
    if (/Paragraf 21(?![0-9])/.test(gs.quelle?.gremium ?? '')) {
      fehler.push('GS-Zeile: Paragraf 21 ist die Befugnis der GS-Stelle, nicht die Zuerkennung des Zeichens');
    }
  }
  const u3 = pruefungen.find((p) => /unter 3 Jahren|unter drei Jahren/.test(p.was ?? ''));
  if (!u3) fehler.push('keine Zeile zum Altershinweis');
  else {
    // Nicht nur das Wort „warum": die Zeile muss VERLANGEN, dass die Gefahr
    // dabeisteht. „heißt Kleinteile – egal warum" enthielt das Wort und
    // behauptete das Gegenteil (Review Welle 80).
    if (!/steht auch dabei, WARUM|WARUM/.test(u3.was ?? '')) {
      fehler.push('U3-Zeile: die Gefahrenangabe ist der Punkt – sie muss in „was“ stehen');
    }
    if (/heißt Kleinteile|bedeutet Kleinteile/.test(u3.was ?? '')) {
      fehler.push('U3-Zeile: behauptet, das Symbol heiße Kleinteile – genau das ist die Fehllesart');
    }
    if (!/nicht automatisch|heißt nicht/i.test(u3.warum ?? '')) {
      fehler.push('U3-Zeile: dass das Symbol nicht automatisch „Kleinteile“ heißt, muss dastehen');
    }
  }

  // --- Die Kugel-Zeile: eigene Schablone, eigene Schwelle, eigene Ausnahme.
  //     Bis Welle 80 stand hier „keine Hausprüfung trägt". Das war richtig,
  //     solange die Maße nicht vorlagen; nachdem der Normtext nachgelesen war,
  //     wurde es falsch: 44,5 mm kleinster Durchmesser ist zu Hause messbar.
  //     Geblieben ist die Pflicht, die GRENZE der Messung zu nennen - und die
  //     Ausnahme für weiche Bälle, ohne die die Zahl zu viel verspricht.
  const kugel = pruefungen.find((p) => /Ball|kugelig/i.test(p.was ?? ''));
  if (!kugel) fehler.push('keine Zeile zu Bällen und kugeligen Teilen');
  else {
    const kugelText = `${kugel.warum} ${kugel.wieZuPruefen} ${kugel.prueferGrenze}`;
    if (!/44,5/.test(kugelText)) fehler.push('Kugel-Zeile: die Schwelle der Norm muss dastehen, sonst ist die Zeile nicht prüfbar');
    if (!/kleinsten Durchmesser|kleinster Durchmesser/.test(kugelText)) {
      fehler.push('Kugel-Zeile: dass der KLEINSTE Durchmesser zählt, ist das Prüfbare daran');
    }
    if (!/weiche[rn]?,? gefüllte|gefüllte Bälle/.test(kugel.prueferGrenze ?? '')) {
      fehler.push('Kugel-Zeile: die Ausnahme der Norm für weiche, gefüllte Bälle muss dastehen – sonst verspricht die Zahl zu viel');
    }
    if (!/jeder Lage|JEDER Lage/.test(kugel.prueferGrenze ?? '')) {
      fehler.push('Kugel-Zeile: dass die Norm in jeder Lage prüft, gehört zur Grenze der Messung');
    }
    // Das GDD kündigt „drei Grenzen" an; die dritte war nur Prosa.
    if (!/ohne zu drücken|nicht zusammen|nicht gedrückt/.test(kugel.prueferGrenze ?? '')) {
      fehler.push('Kugel-Zeile: dass die Norm das Teil nicht drückt, ist die dritte der drei Grenzen');
    }
    if (!kugel.kritisch) fehler.push('Kugel-Zeile: muss kritisch sein');
  }

  // --- Die Zeile, an der die ganze App haengt: ein Gegenstand, der im Koerper
  //     waechst, ist durch keine Groessenpruefung zu fassen. Fehlt dieser Satz,
  //     wird aus der Zeile eine gewoehnliche Kleinteil-Zeile.
  const quellend = pruefungen.find((p) => /Wasserperlen|Quellkugeln|Superabsorber/i.test(p.was ?? ''));
  if (!quellend) fehler.push('keine Zeile zu quellenden Materialien');
  else {
    if (!/versagt jede Größenprüfung/.test(quellend.prueferGrenze ?? '')) {
      fehler.push('Quell-Zeile: dass hier jede Größenprüfung versagt, ist der Grund für die Zeile');
    }
    if (!quellend.kritisch) fehler.push('Quell-Zeile: muss kritisch sein');
    if (!/Sechzigfachen|60-fach/.test(quellend.warum ?? '')) {
      fehler.push('Quell-Zeile: das Ausmaß des Quellens muss dastehen, sonst klingt es harmlos');
    }
  }

  // --- Wer eine Normzahl nennt, nennt die Fassung. Eine Zahl aus einer Norm
  //     ohne Fassungsangabe sieht geprüft aus und ist es nicht (docs/02).
  const norm = String(daten?.quelle?.norm ?? '');
  if (!/EN 71-1/.test(norm)) fehler.push('quelle.norm: die Norm, aus der die Maße stammen, muss benannt sein');
  if (!/Fassung/.test(norm)) fehler.push('quelle.norm: ohne Fassungsangabe ist eine Normzahl nicht nachprüfbar');
  if (!/neuere Fassungen/.test(norm)) fehler.push('quelle.norm: dass es neuere Fassungen gibt, muss dastehen');
  if (!/[Nn]icht nachgelesen|nicht vorlag/.test(norm)) {
    fehler.push('quelle.norm: wo nichts nachgelesen wurde, muss das benannt sein');
  }
  if (!/EN 71-1:2014\+A1:2018/.test(norm)) {
    fehler.push('quelle.norm: die heute harmonisierte Ausgabe muss benannt sein – die nachgelesene ist es nicht');
  }
  // Das Recht hat ein Ablaufdatum, und das steht in den Daten.
  const rechtsstand = String(daten?.quelle?.rechtsstand ?? '');
  if (!/2009\/48\/EG/.test(rechtsstand)) fehler.push('quelle.rechtsstand: die heute geltende Grundlage muss benannt sein');
  if (!/2025\/2509/.test(rechtsstand)) fehler.push('quelle.rechtsstand: die Nachfolgeverordnung muss benannt sein');
  if (!/1\. August 2030/.test(rechtsstand)) fehler.push('quelle.rechtsstand: ohne das Datum ist die Angabe nicht nachprüfbar');
  // Die Abschnittsnummern von EN 71-1 wandern zwischen den Ausgaben, und
  // harmonisiert ist heute eine andere als die hier nachgelesene. Eine
  // Abschnittsnummer ohne Fassungsangabe ist darum keine pruefbare Fundstelle.
  for (const p of pruefungen) {
    const g = p.quelle?.gremium ?? '';
    if (/EN 71-1/.test(g) && !/Fassung 2011\+A3/.test(g)) {
      fehler.push(`Prüfung ${p.id}: nennt EN 71-1 ohne die Fassung, in der nachgelesen wurde`);
    }
  }

  // Eine Zeile, die ein Maß nennt, braucht eine geprüfte Quelle. Ohne
  // Ausnahme: ein Satz wie „die Norm lag nicht vor" entschuldigt keine Zahl,
  // sondern verbietet sie. Wo nichts nachgelesen ist, steht keine Zahl.
  for (const p of pruefungen) {
    if (!MASSZAHL.test(JSON.stringify(p))) continue;
    if (p.quelle?.geprueft !== true) {
      fehler.push(`Prüfung ${p.id}: nennt ein Maß, obwohl die Quelle nicht als geprüft markiert ist`);
    }
  }
  // Und nirgends sonst. `arten` und `bereiche` tragen gar kein `quelle`-Feld;
  // eine Maßzahl dort wäre also eine Zahl, deren Herkunft sich nicht
  // markieren LÄSST - die Zusage „ohne Ausnahme" war dort bisher strukturell
  // unerfüllbar (Review Welle 80). Ausgenommen ist das Feld `quelle.norm`,
  // das die nachgelesenen Maße aufzählt, und `ausgeschlossen`, das die
  // Fehlprüfungen widerlegen muss.
  for (const [wo, o] of [...arten.map((a) => [`Art ${a.id}`, a]),
    ...(daten?.bereiche ?? []).map((b) => [`Bereich ${b.id}`, b])]) {
    if (MASSZAHL.test(JSON.stringify(o))) {
      fehler.push(`${wo}: nennt ein Maß – Maße gehören in eine Prüfung mit geprüfter Quelle`);
    }
  }
  for (const feld of ['hinweis', 'keinErgebnis', 'nichtFertig', 'keinEinkaufszettel', 'keineMarken',
    'keinWirkversprechen', 'wasImHausNichtGeht', 'elterntelefon', 'notfall', 'zielgruppe']) {
    if (MASSZAHL.test(String(daten?.[feld] ?? ''))) {
      fehler.push(`${feld}: nennt ein Maß – Maße gehören in eine Prüfung mit geprüfter Quelle`);
    }
  }

  // --- Die Klopapierrolle steht NUR in der Ausschlussliste, und dort mit
  //     BEIDEN Irrtumsrichtungen. Eine halbe Entwarnung ist schlimmer als keine.
  const rolle = aus.find((a) => /Klopapierrolle/i.test(a.was ?? ''));
  if (!rolle) fehler.push('ausgeschlossen: die Klopapierrolle als Prüfung muss ausdrücklich zurückgewiesen werden');
  else {
    if (!/[Zz]u streng/.test(rolle.warum ?? '')) fehler.push('Klopapierrolle: die Richtung „zu streng“ fehlt');
    if (!/[Zz]u lax|zu lax, und das ist das Gefährliche/.test(rolle.warum ?? '')) {
      fehler.push('Klopapierrolle: die Richtung „zu lax“ fehlt – und das ist die gefährliche');
    }
    if (!/Schablone/.test(rolle.warum ?? '')) fehler.push('Klopapierrolle: die eigene Schablone für Kugeln muss genannt sein');
  }
  for (const p of pruefungen) {
    if (/Klopapierrolle/i.test(JSON.stringify(p))) {
      fehler.push(`${p.id}: die Klopapierrolle gehört nur in die Ausschlussliste, nicht in eine Prüfung`);
    }
  }

  // --- Arten: beschreibend, mit Spanne als Spanne
  if (arten.length !== (daten?.quelle?.zahlen?.artenUebernommen ?? -1)) {
    fehler.push(`arten: ${arten.length} aufgeführt, quelle.zahlen nennt ${daten?.quelle?.zahlen?.artenUebernommen}`);
  }
  for (const a of arten) {
    const wo = `Art ${a.id ?? '?'}`;
    if (!nichtLeer(a.name)) fehler.push(`${wo}: name fehlt`);
    if (!nichtLeer(a.wasKinderTun)) fehler.push(`${wo}: wasKinderTun fehlt – das ist das Belegbare`);
    if (!nichtLeer(a.sicherheit)) fehler.push(`${wo}: sicherheit fehlt`);
    if (!nichtLeer(a.spanne)) fehler.push(`${wo}: spanne fehlt`);
    // Die Spanne ist eine Spanne, kein Ziel.
    if (!/etwa|ungefähr|in Stufen/.test(a.spanne ?? '')) {
      fehler.push(`${wo}: die Spanne liest wie ein Ziel – „etwa“ fehlt`);
    }
    if (/sollte|muss (können|beherrschen)|spätestens/.test(`${a.wasKinderTun} ${a.spanne}`)) {
      fehler.push(`${wo}: eine Sollvorgabe an das Kind`);
    }
  }

  // --- Textnetze. Der Feldpfad wird mitgeführt, weil die Maszahl-Regel pro
  //     FELD gilt: die Herkunft muss im gleichen Feld stehen wie die Zahl.
  const alleTexte = [];
  const sammle = (o, pfad) => { for (const [k, v] of Object.entries(o ?? {})) {
    if (typeof v === 'string') alleTexte.push([`${pfad}.${k}`, v]);
    else if (v && typeof v === 'object') sammle(v, `${pfad}.${k}`);
  } };
  for (const p of pruefungen) sammle(p, `Prüfung ${p.id}`);
  for (const a of arten) sammle(a, `Art ${a.id}`);
  // Und über die Bereiche. Die fehlten in der ersten Fassung, obwohl `name`
  // und `vorspann` als Überschrift und Vorspann jedes Blocks am Bildschirm
  // UND auf dem Papier stehen: ein Markenname, ein Preis, ein
  // Wirkversprechen und eine Ampel passten dort gleichzeitig hinein, und der
  // Validator blieb grün (Review Welle 80).
  for (const b of daten?.bereiche ?? []) sammle(b, `Bereich ${b.id}`);
  for (const [wo, t] of alleTexte) {
    if (MARKE_ODER_PREIS.test(t)) fehler.push(`Marke, Preis oder Bezugsquelle in ${wo}: „${t.slice(0, 60)}“`);
    if (HERSTELLER_GENANNT.test(t)) fehler.push(`ein benannter Hersteller in ${wo}: „${t.slice(0, 60)}“`);
    if (WIRKVERSPRECHEN.test(t)) fehler.push(`Wirkversprechen in ${wo}: „${t.slice(0, 60)}“`);
    if (GESAMTWERTUNG.test(t)) fehler.push(`Gesamtwertung in ${wo}: „${t.slice(0, 60)}“`);
    if (MASSZAHL.test(t) && !HERKUNFT.test(t)) {
      fehler.push(`Maßzahl ohne Herkunft in ${wo}: „${t.slice(0, 60)}“ – im gleichen Feld muss stehen, wessen Zahl das ist`);
    }
  }

  // --- Keine summierende Funktion, und das steht in den Daten
  const pflicht = [
    ['hinweis', /EIN SPIELZEUG/, 'der Gegenstand muss das eine Spielzeug sein'],
    ['hinweis', /wie Sie das zu Hause tatsächlich prüfen|wo diese Prüfung endet/, 'die zwei Pflichtfelder müssen angekündigt sein'],
    ['keinErgebnis', /keine Ampel/, 'die fehlende Ampel muss ausgesprochen sein'],
    ['keinErgebnis', /nicht gegeneinander aufrechenbar/, 'und begründet'],
    ['nichtFertig', /heißt nicht, dass es ein gutes Spielzeug ist/, 'eine leere Liste gibt nichts frei'],
    ['keinEinkaufszettel', /kein Einkaufszettel/, 'der Bericht darf keine Kaufberatung werden'],
    ['keineMarken', /kein Markenname/, 'die Markenfreiheit muss ausgesprochen sein'],
    ['keinWirkversprechen', /nicht belegt/, 'das fehlende Wirkversprechen muss ausgesprochen sein'],
    ['keinWirkversprechen', /keine Wirksamkeitsstudie/, 'und zwar beim Namen'],
    ['wasImHausNichtGeht', /statt eine Ersatzprüfung zu erfinden/, 'die Grenze der Hausprüfung muss ausgesprochen sein'],
    ['elterntelefon', /0800 111 0 550/, 'das Elterntelefon gehört in ein Eltern-Werkzeug'],
    ['notfall', /112/, 'der Notruf muss dastehen'],
    ['notfall', /Knopfzelle/, 'und der Fall, in dem es ohne Beschwerden gilt'],
    ['notfall', /zwei Stunden/, 'die Dringlichkeit bei der Knopfzelle muss eine Zahl haben'],
    ['notfall', /Hausmittel/, 'und Hausmittel müssen ausdrücklich abgelehnt sein'],
    ['notfall', /Botulismus/, 'samt dem Grund, warum Honig bei Säuglingen nichts ist'],
  ];
  for (const [feld, muster, warum] of pflicht) {
    if (!muster.test(String(daten?.[feld] ?? ''))) fehler.push(`${feld}: ${warum}`);
  }

  // --- Quellbilanz
  const z = daten?.quelle?.zahlen ?? {};
  if (z.zieleQuelle !== 7) fehler.push('quelle.zahlen: der Abschnitt trägt 7 Ziele');
  if (z.artenQuelle !== 6) fehler.push('quelle.zahlen: die Quelle nennt 6 Spielzeugarten');
  if (!daten?.quelle?.geprueft) fehler.push('quelle.geprueft fehlt');
  if (!/Eigenproduktion/.test(daten?.quelle?.rechte ?? '')) fehler.push('quelle.rechte muss „Eigenproduktion“ aussprechen');
  if (!/Wirkversprechen/.test(daten?.quelle?.abweichung ?? '')) {
    fehler.push('quelle.abweichung muss sagen, dass das Wirkversprechen nicht übernommen ist');
  }
  for (const a of aus) {
    if (!nichtLeer(a.was)) fehler.push('ausgeschlossen: was fehlt');
    if (!nichtLeer(a.warum)) fehler.push(`ausgeschlossen ${a.quellNr}: warum fehlt – ein Ausschluss ohne Grund ist Redaktion`);
  }
  // Die vier Ausschlüsse, die diese App tragen.
  for (const [muster, name] of [[/CE/, 'die CE-Fehllesart'], [/Klopapierrolle/i, 'die Klopapierrolle'],
    [/Entwicklungswirkung/i, 'die Entwicklungswirkung'], [/Gesamtnote|Ampel/i, 'die Gesamtnote'],
    [/Normzahlen/i, 'die Normzahl ohne Fassungsangabe'], [/Hausmittel/i, 'das Hausmittel bei der Knopfzelle']]) {
    if (!aus.some((a) => muster.test(a.was ?? ''))) fehler.push(`ausgeschlossen: ${name} muss zurückgewiesen werden`);
  }

  // --- Kyrillisch nur in der Quellenangabe
  const erlaubt = new Set([daten?.quelle?.werk, daten?.quelle?.rechte,
    daten?.quelle?.nachgezaehlt, daten?.quelle?.abweichung].filter(Boolean));
  const suchen = (wert, pfad) => {
    if (typeof wert === 'string') {
      if (/[Ѐ-ӿ]/.test(wert) && !erlaubt.has(wert)) {
        fehler.push(`${pfad}: kyrillische Schrift außerhalb der Quellenangabe`);
      }
      return;
    }
    if (Array.isArray(wert)) { wert.forEach((x, i) => suchen(x, `${pfad}[${i}]`)); return; }
    if (wert && typeof wert === 'object') for (const [k, v] of Object.entries(wert)) suchen(v, `${pfad}.${k}`);
  };
  suchen(daten, 'daten');
  return fehler;
}
