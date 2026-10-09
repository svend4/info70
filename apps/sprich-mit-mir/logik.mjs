// Sprich mit mir – Sprachanbahnung im ersten Jahr. Reine Logik, testbar.
// Werkzeug für ERWACHSENE. Praleska docs/10 (Eltern-Werkzeuge Nr. 48),
// Quelle «Общение и речь», S. 37-39 (10 Kommunikationsziele, 3 Perioden).
//
// Tragende Entscheidung: der Katalog ist nach dem SIGNAL DES KINDES
// geordnet, das der Erwachsene gerade sieht – nie nach Lebenswoche und nie
// nach Geburtsdatum. Daraus folgt alles andere: kein Datumsrechnen, kein
// Wochenindex, nichts Gespeichertes über das Kind, und eine Merkliste
// eigener Vorhaben statt einer Checkliste über das Kind.
//
// Politik docs/02: keine externen Anfragen; ein localStorage-Schlüssel für
// die Merkliste des Erwachsenen, löschbar.

/** Die drei Perioden der Quelle – hier als überlappende Fenster. */
export const PERIODEN_ANZAHL = 3;
/** Die Quelle nennt zehn Kommunikationsziele. Alle müssen vorkommen. */
export const QUELLZIELE = 10;
/** Eine Idee pro Sitzung. „Wochen-Impuls“ ist eine Dosierung, kein Datum. */
export const PRO_SITZUNG = 1;

/** Status eines Merklisten-Satzes. Es gibt keinen Status für ein Kind. */
export const MERK_STATUS = Object.freeze(['moechte-ich', 'schon-probiert']);

/** Ein Datum oder ein Wochenraster – der Katalogbegriff darf kein Plan werden. */
// Ausgeschriebene Zahlwörter entgingen beiden Netzen: „mit sechs Monaten"
// und „im dritten Lebensmonat" sind dieselbe Behauptung wie „mit 6 Monaten"
// (Review der Welle 78).
const ZAHLWORT = '(?:\\d+|ein|eine|einem|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|dritte[nrm]?|vierte[nrm]?|fünfte[nrm]?|sechste[nrm]?)';
const KALENDER = new RegExp(`(^|[^a-zäöüß])(Geburtsdatum|Lebenswoche|Lebensmonat|Woche ${ZAHLWORT}|Monat ${ZAHLWORT}|${ZAHLWORT}\\.? (Woche|Monat|Lebenswoche|Lebensmonat))`, 'i');
/** Alter im Impulstext – die App ist nach Signal geordnet, nicht nach Alter. */
const ALTER_IM_TEXT = new RegExp(`(^|[^a-zäöüß])(mit ${ZAHLWORT}|ab ${ZAHLWORT}|${ZAHLWORT} Monat|${ZAHLWORT} Woche|Monaten alt|im ${ZAHLWORT} (Monat|Lebensmonat))`, 'i');

/**
 * Die eine Formulierung, die diese App nirgends enthalten darf – auch nicht
 * zitiert, auch nicht zum Widerlegen. Leser überfliegen; der Rat überlebt,
 * die Einordnung nicht.
 */
export const RAT_GEGEN_DIE_FAMILIENSPRACHE =
  // Die erste Fassung hing an der Wortstellung: „sprechen Sie mit Ihrem Kind
  // Deutsch, damit …" und „zu Hause besser Deutsch" entgingen ihr. Gefasst
  // wird jetzt die Nähe von „Deutsch" zu einer Empfehlung oder zu „zu Hause"
  // (Review der Welle 78).
  /zu Hause[^.!?]{0,20}Deutsch|Deutsch[^.!?]{0,15}zu Hause|nur Deutsch|lieber Deutsch|besser Deutsch|(sprech|red)\w*[^.!?]{0,25}Deutsch[^.!?]{0,10}(damit|um zu|weil)|Deutsch (sprech|red)\w*,? (damit|um)/i;

/**
 * Beruhigung an der falschen Stelle. Zu den Warnzeichen darf kein „das ist
 * meistens harmlos“ stehen: genau so ein Satz ist der Grund, warum Eltern
 * zu lange warten.
 */
export const BERUHIGUNG =
  /meistens harmlos|kein Grund zur Sorge|keine Sorge|jedes Kind hat sein (eigenes )?Tempo|wächst sich (schon )?raus/i;

/** Kyrillisch ist nur in der Quellenangabe erlaubt – nie als Wortliste. */
const KYRILLISCH = /[Ѐ-ӿ]/;

/** Eine Periode holen. */
export function periodeVon(daten, id) {
  return (daten?.perioden ?? []).find((p) => p.id === id) ?? null;
}

/** Ein Impuls holen. */
export function impulsVon(daten, id) {
  return (daten?.impulse ?? []).find((i) => i.id === id) ?? null;
}

/** Die Impulse einer Periode, gefiltert nach Signal (oder alle). */
export function impulseFuer(daten, periodeId, signalId = null) {
  return (daten?.impulse ?? []).filter((i) => i.periode === periodeId
    && (signalId === null || i.signal === signalId));
}

/** Welche Signale gibt es in dieser Periode überhaupt? */
export function signaleIn(daten, periodeId) {
  const vorhanden = new Set(impulseFuer(daten, periodeId).map((i) => i.signal));
  return (daten?.signale ?? []).filter((s) => vorhanden.has(s.id));
}

/**
 * Der nächste Impuls im Kreis. „Noch eine Idee“ ist eine Rotation, kein
 * Kalender – nichts wird dabei gespeichert und nichts nachgeholt.
 */
export function naechsterImpuls(liste, aktuellId) {
  if (!liste.length) return null;
  const i = liste.findIndex((x) => x.id === aktuellId);
  return liste[(i + 1) % liste.length];
}

/** Vorlesetext eines Impulses – ausschließlich Erwachsenentext. */
export function impulsText(daten, impuls) {
  if (!impuls) return '';
  const anker = (daten?.anker ?? []).find((a) => a.id === impuls.anker);
  return `${impuls.titel}. ${anker ? `${anker.name}. ` : ''}${impuls.erwachsenenText}`;
}

/** Validiert die Daten. Alle tragenden Regeln stehen hier. */
export function pruefeDaten(daten) {
  const fehler = [];

  // Überlappende Fenster statt scharfer Abschnitte: allein das kanonische
  // Lallen streut über Monate, und eine scharfe Grenze erzeugt die Frage
  // „mein Kind ist 7 Monate und macht das noch“ – eine Frage, die die App
  // gar nicht aufwerfen soll.
  const per = daten?.perioden;
  if (!Array.isArray(per) || per.length !== PERIODEN_ANZAHL) {
    fehler.push(`perioden: genau ${PERIODEN_ANZAHL} erwartet`);
  }
  for (const [i, p] of (per ?? []).entries()) {
    if (!p.id || !p.name) fehler.push(`periode ${i}: id/name fehlt`);
    if (!(p.vonMonat >= 0) || !(p.bisMonat <= 12)) fehler.push(`periode ${p.id}: Fenster muss in 0..12 liegen`);
    if (p.bisMonat - p.vonMonat < 3) {
      fehler.push(`periode ${p.id}: ein Fenster unter drei Monaten behauptet eine Präzision, die die Daten nicht haben`);
    }
    if (!p.passtWenn) fehler.push(`periode ${p.id}: passtWenn fehlt – die Zuordnung läuft über Verhalten, nicht über Alter`);
    if (!/überlapp/i.test(p.ueberlappung ?? '')) fehler.push(`periode ${p.id}: die Überlappung muss ausgesprochen sein`);
    const naechste = (per ?? [])[i + 1];
    if (naechste && !(p.bisMonat > naechste.vonMonat)) {
      fehler.push(`periode ${p.id}: überlappt die nächste nicht`);
    }
  }

  const signalIds = new Set((daten?.signale ?? []).map((s) => s.id));
  const ankerIds = new Set((daten?.anker ?? []).map((a) => a.id));
  if (signalIds.size < 5) fehler.push('signale: mindestens 5 beobachtbare Signale erwartet');
  if (ankerIds.size < 5) fehler.push('anker: mindestens 5 Alltagsmomente erwartet');

  const perIds = new Set((per ?? []).map((p) => p.id));
  const ids = new Set();
  const belegt = new Set();
  for (const imp of daten?.impulse ?? []) {
    const wo = `Impuls ${imp.id || '?'}`;
    if (!imp.id || ids.has(imp.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
    ids.add(imp.id);
    if (!perIds.has(imp.periode)) fehler.push(`${wo}: periode ${imp.periode} unbekannt`);
    if (!signalIds.has(imp.signal)) fehler.push(`${wo}: signal ${imp.signal} unbekannt`);
    if (!ankerIds.has(imp.anker)) fehler.push(`${wo}: anker ${imp.anker} fehlt – ohne Alltagsmoment wäre es ein Übungstermin`);
    if (!imp.titel || !imp.erwachsenenText || imp.erwachsenenText.length < 80) {
      fehler.push(`${wo}: titel/erwachsenenText fehlt oder ist zu kurz`);
    }
    if (!Array.isArray(imp.quellZiel) || !imp.quellZiel.length) fehler.push(`${wo}: quellZiel fehlt`);
    for (const z of imp.quellZiel ?? []) {
      if (!Number.isInteger(z) || z < 1 || z > QUELLZIELE) fehler.push(`${wo}: quellZiel ${z} liegt außerhalb der zehn Ziele der Quelle`);
      else belegt.add(z);
    }
    const text = `${imp.titel} ${imp.erwachsenenText}`;
    if (ALTER_IM_TEXT.test(text)) fehler.push(`${wo}: nennt ein Alter – der Katalog ist nach Signal geordnet`);
    if (KALENDER.test(text)) fehler.push(`${wo}: nennt ein Datum oder eine Lebenswoche`);
    // Die Lücke für das eigene Wort ist eine Datenbedingung, kein Vorsatz.
    if (imp.eigeneWorte && !text.includes('______')) {
      fehler.push(`${wo}: eigeneWorte ohne Lücke – das eigene Wort braucht einen Platz`);
    }
    if (!imp.eigeneWorte && text.includes('______')) fehler.push(`${wo}: Lücke ohne eigeneWorte`);
  }
  if (belegt.size !== QUELLZIELE) {
    fehler.push(`quellZiel: die Quelle nennt ${QUELLZIELE} Ziele, belegt sind ${belegt.size} – fehlend: ${
      [...Array(QUELLZIELE).keys()].map((i) => i + 1).filter((n) => !belegt.has(n)).join(', ')}`);
  }

  // Die Merkliste gehört dem Erwachsenen. Jeder Satz hat ihn als Subjekt –
  // sonst wäre es eine zweite Sprachscreening-Liste über ein Baby, und die
  // gehört apps/meilenstein-begleiter (und auch dort nur mit U-Mapping).
  const merk = daten?.merkliste;
  if (!Array.isArray(merk) || merk.length < 5) fehler.push('merkliste: mindestens 5 Sätze erwartet');
  for (const m of merk ?? []) {
    if (!m.id || !m.satz) fehler.push(`merkliste ${m.id || '?'}: id/satz fehlt`);
    else if (!/^Ich /.test(m.satz)) {
      fehler.push(`merkliste ${m.id}: muss mit „Ich “ beginnen – angekreuzt wird ein eigenes Vorhaben, nie ein Zustand des Kindes`);
    }
  }

  // Die beiden Sätze zur Mehrsprachigkeit stehen immer zusammen.
  const mehr = daten?.bloecke?.mehrsprachig;
  if (!mehr?.text) fehler.push('bloecke.mehrsprachig fehlt');
  if (!mehr?.sicherung) {
    fehler.push('bloecke.mehrsprachig.sicherung fehlt – ohne sie wäre die Botschaft eine pauschale Beruhigung');
  } else {
    if (!/kein Grund, die Familiensprache aufzugeben/.test(mehr.sicherung)) {
      fehler.push('mehrsprachig.sicherung: der Satz zur Familiensprache muss wörtlich dastehen');
    }
    if (!/in allen Sprachen/.test(mehr.sicherung)) {
      fehler.push('mehrsprachig.sicherung: es muss dastehen, dass sich eine Störung in allen Sprachen zeigt');
    }
  }
  if (!/Mercator/.test(mehr?.quelle ?? '')) fehler.push('mehrsprachig.quelle fehlt');

  // Der Bildschirm-Block muss die Behörde aktuell benennen.
  const bild = daten?.bloecke?.bildschirm;
  if (!/BIÖG/.test(bild?.quelle ?? '')) {
    fehler.push('bildschirm.quelle: die Behörde heißt seit Februar 2025 BIÖG – „BZgA“ allein ist veraltet');
  }
  if (!/BZgA/.test(bild?.quelle ?? '')) {
    fehler.push('bildschirm.quelle: der frühere Name gehört dazu, sonst findet niemand die Empfehlung');
  }

  // Der Hörblock trägt alles, was hier dauerhaft gilt – und keine
  // Verfahrensdetails, die sich ändern (der Ablauf wurde 2026 geändert).
  const hoer = daten?.bloecke?.hoeren;
  // Die zweite Alternative verschluckte die erste: „nicht aus" allein trifft
  // auch „das reicht nicht aus" und liess die Gegenaussage durch. Jetzt die
  // Konstruktion (Review der Welle 78).
  if (!/schließt\s[^.!?]{0,60}nicht aus|kein[^.!?]{0,40}Garantie|auch danach[^.!?]{0,40}entstehen/.test(hoer?.text ?? '')) {
    fehler.push('hoeren: es muss dastehen, dass ein unauffälliges Screening eine späte Hörstörung nicht ausschließt');
  }
  if (!/nicht für mehr Üben|nicht fürs Üben/.test(hoer?.text ?? '')) {
    fehler.push('hoeren: der Weg muss die Praxis sein, nicht mehr Üben');
  }
  for (const begriff of ['Kontroll-AABR', 'TEOAE', 'AABR', 'Konfirmationsdiagnostik']) {
    if (JSON.stringify(daten).includes(begriff)) {
      fehler.push(`hoeren: „${begriff}“ ist ein Verfahrensdetail – es ändert sich und gehört nicht in eine Eltern-App`);
    }
  }

  // Warnzeichen: ein fester Block, nie mit Streuungssprache gemischt.
  const warn = daten?.warnzeichen;
  if (!Array.isArray(warn?.punkte) || warn.punkte.length < 3) fehler.push('warnzeichen: mindestens 3 Punkte erwartet');
  if (!warn?.wasTun) fehler.push('warnzeichen.wasTun fehlt');
  if (!warn?.nichtBeruhigen) fehler.push('warnzeichen.nichtBeruhigen fehlt');
  // Die Beruhigungs-Prüfung läuft auf Vorspann, Punkten und wasTun – NICHT
  // auf `nichtBeruhigen`: dieses Feld MUSS die Formulierung nennen, um sie
  // auszuschließen („hier steht absichtlich kein ‚meistens harmlos‘“). Ein
  // Netz über das ganze Objekt träfe die Ausschlussklausel selbst. Dieselbe
  // Lage wie bei den Ölen in apps/bewegungs-kartei-erstes-jahr.
  // Der TITEL des Blocks fehlte - also genau die Zeile, die man zuerst liest
  // (Review der Welle 78).
  const warnText = [warn?.titel, warn?.vorspann, ...(warn?.punkte ?? []), warn?.wasTun].filter(Boolean).join(' ');
  if (BERUHIGUNG.test(warnText)) {
    fehler.push('warnzeichen: enthält eine Beruhigung – genau so ein Satz lässt Eltern zu lange warten');
  }
  if (!BERUHIGUNG.test(warn?.nichtBeruhigen ?? '')) {
    fehler.push('warnzeichen.nichtBeruhigen muss die Formulierung nennen, die hier nicht stehen darf – sonst schließt der Satz nichts aus');
  }
  if (!(warn?.punkte ?? []).some((p) => /reagiert nicht auf Stimmen|nicht auf Stimmen/.test(p))) {
    fehler.push('warnzeichen: das Nicht-Reagieren auf Stimmen muss dastehen – die ganze Mechanik setzt Hören voraus');
  }
  if (!(warn?.punkte ?? []).some((p) => /verliert/.test(p))) {
    fehler.push('warnzeichen: der Verlust einer erworbenen Fähigkeit muss dastehen');
  }

  // Nirgends ein Rat gegen die Familiensprache – auch nicht zitiert.
  if (RAT_GEGEN_DIE_FAMILIENSPRACHE.test(JSON.stringify(daten))) {
    fehler.push('irgendwo steht ein Rat, zu Hause Deutsch zu sprechen – der darf hier in keiner Form vorkommen, auch nicht zum Widerlegen');
  }

  // Kyrillisch nur in der Quellenangabe: erfundene uk/ru-Wortlisten sind
  // ausgeschlossen, und die App gibt bewusst keine.
  for (const [schluessel, wert] of Object.entries(daten ?? {})) {
    if (schluessel === 'quelle') continue;
    if (KYRILLISCH.test(JSON.stringify(wert))) {
      fehler.push(`${schluessel}: kyrillische Schrift außerhalb der Quellenangabe – diese App liefert keine Wortlisten in anderen Sprachen`);
    }
  }
  if (!/keine Wortlisten/.test(daten?.bloecke?.eigeneWorte?.text ?? '')) {
    fehler.push('bloecke.eigeneWorte: es muss dastehen, dass die App absichtlich keine Wortlisten gibt');
  }

  // Kein Kalender in den INHALTEN. Der Rahmentext muss das Geburtsdatum
  // und die Lebenswoche dagegen nennen dürfen, weil er sie ausschließt –
  // darum beide Richtungen getrennt geprüft.
  const inhalte = JSON.stringify({
    impulse: daten?.impulse, merkliste: daten?.merkliste,
    // `name` und `ueberlappung` fehlten - der Periodenname steht auf dem
    // Knopf und ist das Erste, was ein Elternteil liest (Review der Welle 78).
    passtWenn: (daten?.perioden ?? []).map((p) => p.passtWenn),
    name: (daten?.perioden ?? []).map((p) => p.name),
    ueberlappung: daten?.ueberlappung,
  });
  if (KALENDER.test(inhalte)) {
    fehler.push('ein Impuls, ein Merksatz oder ein passtWenn nennt ein Geburtsdatum oder eine Lebenswoche');
  }
  if (!/kein Geburtsdatum/.test(daten?.hinweis ?? '')) {
    fehler.push('hinweis: es muss dastehen, dass es kein Geburtsdatum einzugeben gibt');
  }

  // Pflichtsätze.
  for (const [feld, muster, was] of [
    ['hinweis', /kein Entwicklungsplan/, 'der Kernsatz muss dastehen'],
    ['hinweis', /nicht nach Lebenswoche/, 'die Ordnung nach Signal muss ausgesprochen sein'],
    ['geraet', /in deiner Hand|in Ihrer Hand/, 'das Gerät gehört dem Erwachsenen'],
    ['geraet', /sieht keinen Bildschirm/, 'der Kind-Screen muss ausgeschlossen sein'],
    ['einImpuls', /eine Idee/, 'die Dosierung muss dastehen'],
    ['abbruch', /jederzeit aufhören/, 'das Aufhören muss ausdrücklich erlaubt sein'],
    ['erwachsener', /0800 111 0 550/, 'das Elterntelefon muss dastehen'],
    ['erwachsener', /geschüttelt/, 'der Schüttel-Hinweis muss dastehen'],
  ]) {
    if (!muster.test(daten?.[feld] ?? '')) fehler.push(`${feld}: ${was}`);
  }
  if (!/Eigenproduktion/.test(daten?.quelle?.eigenproduktion ?? '')) {
    fehler.push('quelle.eigenproduktion muss „Eigenproduktion“ aussprechen');
  }
  if (!/NICHT aus der Quelle|nicht aus der Quelle/.test(daten?.quelle?.nichtVonHier ?? '')) {
    fehler.push('quelle.nichtVonHier: die Mehrsprachigkeits-Botschaft stammt nicht aus der Quelle und das muss dastehen');
  }
  return fehler;
}
