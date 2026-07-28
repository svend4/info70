// Grammatik-Zwerge – reine Logik (ohne DOM), testbar mit node --test.
// Ko-Nutzungs-App für 4-6: Präpositionen, Mehrzahl, zusammengesetzte Wörter.
// Praleska docs/10 (Ko-Nutzung Nr. 14).
//
// Wie die anderen Apps dieses Abschnitts bewusst NICHT auf quiz-kern:
// kein Rekord, keine Punkte, keine Ränge.
//
// Die drei tragenden Ehrlichkeiten stehen im Validator, nicht im Text:
//  1. „vor“ und „hinter“ sind gesperrt. Beide hängen davon ab, wo der
//     Betrachter steht und ob das Bezugsding eine eigene Vorderseite hat;
//     mit einer flachen Bildszene ohne Verdeckung gibt es zwei richtige
//     Antworten. Eine Aufgabe, die dann eine davon als falsch meldet,
//     wäre schlicht unfair.
//  2. Die Mehrzahl darf nie aus einer einzigen Klasse bestehen – sonst
//     lernt das Kind „viele heißt -e“ statt der Unterscheidung.
//  3. Zusammengesetzte Wörter müssen mindestens ein Fugen-Beispiel
//     enthalten. „Wort + Wort“ stimmt bei Zuckerdose, aber nicht bei
//     Sonnenblume – eine Regel ohne ihr Gegenbeispiel wäre zu groß.
import { mischen } from '../../packages/kinder-ui/js/komponenten.mjs';

/** Höchstens so viele Aufgaben pro Sitzung. */
export const PRO_SESSION = 6;

/** Die drei Sprachspiele des Katalogs. */
export const TYPEN = ['praeposition', 'plural', 'kompositum'];

/**
 * Nur diese fünf Ortswörter. „vor“ und „hinter“ fehlen mit Absicht:
 * siehe Kopfkommentar und eltern.html.
 */
export const PRAEPOSITIONEN = ['auf', 'unter', 'in', 'neben', 'zwischen'];

/** Ausdrücklich gesperrt, damit sie nicht versehentlich zurückkommen. */
export const GESPERRTE_PRAEPOSITIONEN = ['vor', 'hinter', 'über', 'an'];

/**
 * Wörter, die im Mehrzahl-Spiel nichts zu suchen haben: gleiche Form in
 * Ein- und Mehrzahl (das Kind hört keinen Unterschied), zwei gültige
 * Mehrzahlen, regionale Doppelformen oder gar keine gebräuchliche
 * Mehrzahl.
 */
export const PLURAL_SPERRLISTE = [
  'Löffel', 'Messer', 'Fenster', 'Teller', 'Kuchen', 'Mädchen', 'Wagen', 'Sessel',
  'Wort', 'Bank', 'Stock', 'Mutter', 'Bogen', 'Kragen',
  'Pizza', 'Kaktus', 'Konto', 'Thema', 'Museum', 'Radio', 'Junge',
  'Milch', 'Wasser', 'Zucker', 'Sand', 'Butter', 'Musik',
];

/**
 * Zusammensetzungen, deren Bedeutung sich NICHT aus den Teilen ergibt.
 * Wer „Löwe + Zahn“ richtig zerlegt, landet trotzdem beim falschen Ding.
 */
export const KOMPOSITUM_SPERRLISTE = [
  'Löwenzahn', 'Fingerhut', 'Maulwurf', 'Meerschweinchen', 'Nasenbär',
  'Feuerwehr', 'Milchglas', 'Schneemann', 'Kindergarten', 'Badewanne',
  'Handschuh', 'Wasserhahn',
];

/** Der bestimmte Artikel im Dativ – das braucht die Ortsangabe. */
export function dativArtikel(genus, mehrzahl = false) {
  if (mehrzahl) return 'den';
  if (genus === 'f') return 'der';
  if (genus === 'm' || genus === 'n') return 'dem';
  return null;
}

/**
 * Die Ortsangabe wird BERECHNET, nicht in den Daten hinterlegt: sonst
 * könnten Angabe und Szene auseinanderlaufen, ohne dass es auffällt.
 */
export function ortsangabe(aufgabe) {
  const { praeposition, relatum } = aufgabe;
  const artikel = dativArtikel(relatum.genus, Boolean(relatum.mehrzahl));
  const nomen = relatum.mehrzahl ? relatum.plural : relatum.nomen;
  return artikel ? `${praeposition} ${artikel} ${nomen}` : null;
}

/** Der ganze Satz zum Vorlesen: „Der Ball ist unter dem Korb.“ */
export function ortsSatz(aufgabe) {
  return `${aufgabe.ding.artikel} ${aufgabe.ding.nomen} ist ${ortsangabe(aufgabe)}.`;
}

/** Bis zu `limit` Aufgaben je Sitzung, gemischt und ohne Dubletten. */
export function waehleAufgaben(bank, limit = PRO_SESSION) {
  return mischen(bank).slice(0, limit);
}

/** Stimmt die Antwort? */
export function istRichtig(aufgabe, antwort) {
  if (aufgabe.typ === 'praeposition') return aufgabe.praeposition === antwort;
  return Boolean(antwort?.richtig);
}

/**
 * War die Antwort zwar nicht die gesuchte, aber gut gedacht? „die Balls“
 * statt „die Bälle“ zeigt, dass ein Kind eine Regel gebildet hat – das
 * ist ein Fortschritt und darf kein Fehlersignal auslösen. Genauso bei
 * den Ortswörtern: Wer bei zwei Kisten „neben“ sagt, hat hingeschaut,
 * nur nicht genau genug.
 */
export function istFastRichtig(aufgabe, antwort) {
  if (!antwort || istRichtig(aufgabe, antwort)) return false;
  if (aufgabe.typ === 'plural') return antwort.text === aufgabe.fastRichtig;
  if (aufgabe.typ === 'praeposition') return antwort === aufgabe.nachvollziehbar;
  return false;
}

/** Alle Mehrzahl-Klassen, die im Datensatz vorkommen. */
export function pluralKlassen(aufgaben) {
  return [...new Set(aufgaben.filter((a) => a.typ === 'plural').map((a) => a.klasse))];
}

/** Validiert die Aufgaben. */
export function pruefeDaten(daten) {
  const fehler = [];
  const aufgaben = daten?.aufgaben;

  if (!Array.isArray(aufgaben) || aufgaben.length < 15) fehler.push('aufgaben: mindestens 15 erwartet');
  if (Array.isArray(aufgaben)) {
    const ids = new Set();
    for (const a of aufgaben) {
      const wo = `Aufgabe ${a.id || '?'}`;
      if (!a.id || ids.has(a.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
      ids.add(a.id);
      if (!TYPEN.includes(a.typ)) fehler.push(`${wo}: typ ${a.typ} unbekannt`);
      if (!a.erklaerung || !a.gespraech) fehler.push(`${wo}: erklaerung/gespraech fehlt`);
      else if (!a.gespraech.trim().endsWith('?')) fehler.push(`${wo}: Gesprächsimpuls soll eine Frage sein`);

      if (a.typ === 'praeposition') pruefePraeposition(a, wo, fehler);
      if (a.typ === 'plural') pruefePlural(a, wo, fehler);
      if (a.typ === 'kompositum') pruefeKompositum(a, wo, fehler);
    }

    for (const typ of TYPEN) {
      const davon = aufgaben.filter((x) => x.typ === typ);
      if (davon.length < 4) fehler.push(`typ ${typ}: nur ${davon.length} Aufgaben – zu wenig`);
    }

    // Jedes erlaubte Ortswort muss auch wirklich vorkommen, sonst stehen
    // Knöpfe da, die nie eine Lösung sind.
    const benutzt = new Set(aufgaben.filter((a) => a.typ === 'praeposition').map((a) => a.praeposition));
    for (const p of PRAEPOSITIONEN) {
      if (!benutzt.has(p)) fehler.push(`Ortswort „${p}“ steht zur Auswahl, ist aber nie die Lösung`);
    }

    // Rückfallsicherung: Stünde die Lösung in JEDER Aufgabe an derselben
    // Stelle, würde jede Stelle, die die Daten einmal ungemischt ausgibt,
    // sofort zum Spickzettel. Die App mischt zwar – aber die Daten sollen
    // den Fehler auch dann nicht ermöglichen.
    const stellen = new Set(
      aufgaben.filter((a) => Array.isArray(a.optionen))
        .map((a) => a.optionen.findIndex((o) => o.richtig)),
    );
    if (stellen.size === 1) {
      fehler.push('optionen: die richtige Antwort steht überall an derselben Stelle');
    }

    // Mehrzahl: nie nur eine Klasse.
    const klassen = pluralKlassen(aufgaben);
    if (klassen.length < 4) {
      fehler.push(`plural: nur ${klassen.length} Mehrzahl-Arten – das Kind lernt sonst eine Regel, die es nicht gibt`);
    }

    // Zusammensetzungen: mindestens ein Fugen-Gegenbeispiel.
    const komposita = aufgaben.filter((a) => a.typ === 'kompositum');
    if (komposita.length && !komposita.some((a) => a.fuge)) {
      fehler.push('kompositum: kein einziges Wort mit Fugenlaut – „Wort + Wort“ wirkt sonst größer, als es ist');
    }

    // Die Genus-Balance: eine einseitige Wortliste lehrt eine falsche
    // Regel, auch wenn die App sie nie ausspricht. Deshalb müssen in
    // BEIDEN Bereichen, in denen Artikel sichtbar werden, alle drei
    // vorkommen – bei den Dingen der Ortsaufgaben und bei den Artikeln
    // der zusammengesetzten Wörter.
    const dingGenera = new Set(aufgaben.map((a) => a.ding?.genus).filter(Boolean));
    for (const g of ['m', 'f', 'n']) {
      if (!dingGenera.has(g)) fehler.push(`genus ${g}: kommt bei den Ortsaufgaben nicht vor – die Wortliste ist einseitig`);
    }
    const wortArtikel = new Set(aufgaben.filter((a) => a.typ === 'kompositum').map((a) => a.genus));
    for (const art of ['der', 'die', 'das']) {
      if (!wortArtikel.has(art)) fehler.push(`Artikel ${art}: kommt bei den zusammengesetzten Wörtern nicht vor`);
    }
  }

  for (const r of daten?.regeln ?? []) {
    // Jede Regel muss ihre Grenze mitbringen. „Bei vielen heißt es die“
    // stimmt nur im Nominativ – wer das nicht mitliefert, behauptet zu viel.
    if (!r.text || !r.gilt) fehler.push(`Regel ${r.id || '?'}: text/gilt fehlt`);
    else if (r.gilt.length < 25) fehler.push(`Regel ${r.id}: die Grenze der Regel ist zu knapp beschrieben`);
  }
  if (!Array.isArray(daten?.regeln) || daten.regeln.length < 3) fehler.push('regeln: mindestens 3 erwartet');

  if (!Array.isArray(daten?.schlussIdeen) || daten.schlussIdeen.length < 3) {
    fehler.push('schlussIdeen: mindestens 3 erwartet (die Sitzung endet offline)');
  }
  return fehler;
}

function pruefePraeposition(a, wo, fehler) {
  if (GESPERRTE_PRAEPOSITIONEN.includes(a.praeposition)) {
    fehler.push(`${wo}: „${a.praeposition}“ ist gesperrt – in einer flachen Szene gäbe es zwei richtige Antworten`);
    return;
  }
  if (!PRAEPOSITIONEN.includes(a.praeposition)) {
    fehler.push(`${wo}: Ortswort ${a.praeposition} ist nicht vorgesehen`);
    return;
  }
  if (!a.ding?.nomen || !a.ding?.artikel || !a.ding?.emoji || !a.ding?.genus) fehler.push(`${wo}: ding unvollständig`);
  if (!a.relatum?.nomen || !a.relatum?.genus) fehler.push(`${wo}: relatum unvollständig`);
  if (a.relatum && !['m', 'f', 'n'].includes(a.relatum.genus)) fehler.push(`${wo}: relatum genus ungültig`);

  // „in dem Korb“ sagt niemand – es heißt „im Korb“. Damit die App keine
  // unnatürliche Musterlösung zeigt, ist „in“ nur bei weiblichen
  // Behältern erlaubt, wo keine Verschmelzung auftritt.
  if (a.praeposition === 'in' && a.relatum?.genus !== 'f') {
    fehler.push(`${wo}: „in“ nur mit weiblichem Behälter – sonst müsste es „im“ statt „in dem“ heißen`);
  }
  // „zwischen“ braucht zwei gleiche Dinge, sonst ist die Szene mehrdeutig.
  if (a.praeposition === 'zwischen' && !a.relatum?.mehrzahl) {
    fehler.push(`${wo}: „zwischen“ braucht zwei gleiche Dinge`);
  }
  if (a.praeposition !== 'zwischen' && a.relatum?.mehrzahl) {
    fehler.push(`${wo}: mehrere Bezugsdinge nur bei „zwischen“`);
  }
  if (a.relatum?.mehrzahl && !a.relatum?.plural) fehler.push(`${wo}: relatum mehrzahl ohne Pluralform`);
  if (a.relatum && !ortsangabe(a)) fehler.push(`${wo}: Ortsangabe lässt sich nicht bilden`);
  // Ein nah verwandtes Ortswort darf als „gut gedacht“ hinterlegt sein –
  // aber nur ein angebotenes, und nie die Lösung selbst.
  if (a.nachvollziehbar) {
    if (!PRAEPOSITIONEN.includes(a.nachvollziehbar)) fehler.push(`${wo}: „${a.nachvollziehbar}“ steht gar nicht zur Wahl`);
    if (a.nachvollziehbar === a.praeposition) fehler.push(`${wo}: das nah verwandte Wort ist die Lösung selbst`);
    if (!a.nachvollziehbarText) fehler.push(`${wo}: es fehlt der Text, warum die Antwort gut gedacht war`);
  }
}

function pruefePlural(a, wo, fehler) {
  if (!a.singular || !a.plural || !a.artikel || !a.klasse || !a.emoji) fehler.push(`${wo}: unvollständig`);
  if (PLURAL_SPERRLISTE.includes(a.singular)) {
    fehler.push(`${wo}: „${a.singular}“ steht auf der Sperrliste (gleiche Form, zwei Formen oder keine Mehrzahl)`);
  }
  if (a.singular && a.plural === a.singular) {
    fehler.push(`${wo}: Ein- und Mehrzahl sind gleich – das Kind hört keinen Unterschied`);
  }
  const optionen = a.optionen;
  if (!Array.isArray(optionen) || optionen.length !== 3) fehler.push(`${wo}: genau 3 Antworten erwartet`);
  else {
    const richtige = optionen.filter((o) => o.richtig);
    if (richtige.length !== 1) fehler.push(`${wo}: genau EINE richtige Antwort`);
    else if (richtige[0].text !== a.plural) fehler.push(`${wo}: richtige Antwort und Mehrzahl stimmen nicht überein`);
    const texte = optionen.map((o) => o.text);
    if (new Set(texte).size !== texte.length) fehler.push(`${wo}: doppelte Antwort`);
    // Die „fast richtige“ Antwort ist eine regelhafte Übergeneralisierung
    // und muss unter den falschen stehen – sonst zeigt die App den
    // freundlichen Text nie oder am falschen Platz.
    if (!a.fastRichtig) fehler.push(`${wo}: fastRichtig fehlt`);
    else if (!optionen.some((o) => o.text === a.fastRichtig && !o.richtig)) {
      fehler.push(`${wo}: fastRichtig „${a.fastRichtig}“ steht nicht unter den falschen Antworten`);
    }
  }
}

function pruefeKompositum(a, wo, fehler) {
  if (!a.teil1 || !a.teil2 || !a.wort || !a.genus || !a.istEin) fehler.push(`${wo}: unvollständig`);
  if (a.genus && !['der', 'die', 'das'].includes(a.genus)) fehler.push(`${wo}: Artikel „${a.genus}“ ist keiner`);
  if (KOMPOSITUM_SPERRLISTE.includes(a.wort)) {
    fehler.push(`${wo}: „${a.wort}“ bedeutet nicht, was seine Teile sagen`);
  }
  if (typeof a.fuge !== 'string') fehler.push(`${wo}: fuge fehlt (leerer String, wenn keine da ist)`);
  else if (!['', 'n', 's', 'e', 'en', 'er'].includes(a.fuge)) fehler.push(`${wo}: Fugenlaut „${a.fuge}“ ist nicht vorgesehen`);
  // Die Rechenprobe: Teil + Fuge + Teil muss das Wort ergeben. Scheitert
  // sie, ist irgendwo ein Laut getilgt oder umgelautet – dann stimmt
  // „Wort + Wort“ nicht mehr und das Wort gehört nicht in diese Aufgabe.
  if (a.teil1 && a.teil2 && a.wort) {
    const gebaut = `${a.teil1}${a.fuge ?? ''}${a.teil2}`.toLowerCase();
    if (gebaut !== a.wort.toLowerCase()) {
      fehler.push(`${wo}: ${a.teil1} + ${a.fuge || '–'} + ${a.teil2} ergibt „${gebaut}“, nicht „${a.wort}“`);
    }
  }
  // Rechtsköpfigkeit: Eine Zuckerdose ist eine Dose. Der Satz muss das
  // Grundwort wirklich enthalten, sonst behauptet die App die Regel nur.
  if (a.istEin && a.teil2 && !a.istEin.includes(a.teil2)) {
    fehler.push(`${wo}: „${a.istEin}“ nennt das Grundwort ${a.teil2} nicht`);
  }
  // Der Artikel kommt vom letzten Wort – das ist die einzige Stelle, an
  // der ein Kind das Genus ausrechnen kann. Also muss es auch stimmen.
  if (a.genus && a.genusTeil2 && a.genus !== a.genusTeil2) {
    fehler.push(`${wo}: Artikel des ganzen Wortes passt nicht zum letzten Wort`);
  }
  const optionen = a.optionen;
  if (!Array.isArray(optionen) || optionen.length !== 3) fehler.push(`${wo}: genau 3 Antworten erwartet`);
  else {
    const richtige = optionen.filter((o) => o.richtig);
    if (richtige.length !== 1) fehler.push(`${wo}: genau EINE richtige Antwort`);
    else if (a.wort && richtige[0].text !== a.wort) fehler.push(`${wo}: richtige Antwort ist nicht das Wort`);
    const texte = optionen.map((o) => o.text);
    if (new Set(texte).size !== texte.length) fehler.push(`${wo}: doppelte Antwort`);
  }
}
