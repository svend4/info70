// Kunst-Gucken (Praleska docs/10, Eltern-Werkzeuge Nr. 60, Quelle S. 88-89:
// «Ознакомление с изобразительным искусством» mit dem Unterabschnitt
// «Восприятие искусства»).
//
// TRAGENDE ENTSCHEIDUNGEN
//
// 1. HIER WIRD NICHTS ABGEFRAGT. „Welche Farbe ist das?" ist eine Pruefung
//    mit bekannter Antwort; ein Kind, das die Antwort nicht hat, hat
//    verloren. Die Impulse sind FESTSTELLUNGEN - der Erwachsene sagt, was er
//    sieht, und laesst Platz. `ABFRAGE` weist jeden Impuls ab, der als
//    Prueffrage gebaut ist, und zwar schon am Fragezeichen.
//
// 2. KEINE DEUTUNG DES KINDES. Die Quelle nennt als allgemeines Ziel Nr. 6
//    ausdruecklich, die Moeglichkeiten der Kunst zu nutzen, „um die innere
//    Welt der Kinder zu erkennen und ihre individuellen Besonderheiten
//    herauszufinden". Das ist NICHT uebernommen: eine Zeichnung ist kein
//    Befund, und wer im Gekritzel liest, liest sich selbst. Ein solches
//    Werkzeug waere ausserdem eine Einstufung von Kindern (docs/02,
//    EU-Verordnung ueber kuenstliche Intelligenz).
//
//    Das `DEUTUNG`-Netz wird darum in ZWEI Richtungen benutzt: es darf in
//    keinem Angebotstext vorkommen - und es MUSS im Text des
//    zurueckgewiesenen Quellziels vorkommen. Eine Zurueckweisung, die das
//    Zurueckgewiesene nicht benennt, ist keine.
//
// 3. DIE 13 ZIELE SIND EINZELN EINGEORDNET. Der Katalogeintrag nennt „13
//    Ziele"; nachgezaehlt sind es 7 allgemeine und 6 zur Kunstwahrnehmung.
//    `ziele` fuehrt jedes einzeln mit einer von vier Einordnungen (`gebaut`,
//    `alsGanzes`, `ausgeschlossen`, `anderesThema`), und `pruefeDaten`
//    rechnet beides gegeneinander: ein `gebaut`-Ziel ohne Stueck, ein Stueck
//    ohne Ziel und ein Ziel, das in keiner Einordnung auftaucht, machen die
//    Daten ungueltig. So kann die Abweichungsnotiz nicht von den Daten
//    abdriften - genau das ist in Welle 80 zweimal passiert.
//
// 4. KEINE BUCHLISTE, KEIN WERK, KEINE MARKE. Beschrieben sind
//    GEGENSTANDSTYPEN und wo man sie ohne Geld findet. Die Quelle nennt
//    lebende oder erst kuerzlich verstorbene Urheber von Illustrationen -
//    keine Abbildung, keine Nachbildung und kein Titel steht hier.
//
// 5. KEIN WIRKVERSPRECHEN. Dass gemeinsames Hinschauen Wahrnehmung,
//    Wortschatz oder Begabung voranbringt, steht hier nicht. Fuer Kinder
//    unter drei Jahren ist zum Betrachten von Kunst nichts belegt, was eine
//    solche Zusage tragen wuerde. Gesagt ist, was man TUN kann und woran man
//    SIEHT, dass es gerade passt.
//
// 6. DIE APP SPEICHERT NICHTS. Kein Schluessel, keine Liste, kein Haken -
//    ein Haken an einer Achse waere der Anfang einer Kindakte. Wer das Blatt
//    behalten will, druckt es.

/** Die fuenf Achsen - geschlossene Liste, in der Reihenfolge der Quelle. */
export const ACHSEN = Object.freeze(['a-farbe', 'a-form', 'a-teile', 'a-material', 'a-klang']);

/** Die vier moeglichen Einordnungen eines Quellziels. */
export const EINORDNUNGEN = Object.freeze(['gebaut', 'alsGanzes', 'ausgeschlossen', 'anderesThema']);

/** Wie viele Ziele die Quelle in den beiden Listen trägt (nachgezaehlt). */
export const ZIELE = Object.freeze({ allgemein: 7, wahrnehmung: 6 });

/**
 * Ein Impuls, der als Pruefung gebaut ist.
 *
 * Das Fragezeichen ist die Grenze, und das ist strenger als noetig: auch eine
 * offene Frage („Was hoerst du?") waere keine Pruefung. Sie ist aber eine
 * Aufforderung, und ein Kind, das gerade schaut, muss nicht antworten. Wer
 * fragen will, fragt ohne Zettel.
 *
 * Laeuft NUR ueber `impulse`. `keinAbfragen` und die `grenze`-Felder muessen
 * „Welche Farbe ist das?" nennen koennen, um es auszuschliessen - Falle A,
 * achtzehntes Mal in diesem Projekt.
 */
export const ABFRAGE = /\?|\bzeig(?:e)?\s+mir\b|\bwie\s+heißt\b|\bwie\s+viele\b|\bweißt\s+du\b|\bsag\s+mal,/i;

/** Ein Urteil ueber die Antwort des Kindes. Auch Lob gehoert dazu: wer gelobt
 *  wird, weil er richtig lag, hat beim naechsten Mal etwas zu verlieren. */
export const PRUEFURTEIL = /\b(?:richtig|falsch|stimmt\s+nicht|fast\s+(?:richtig|geschafft)|genau\s+so|prima|brav|gut\s+gemacht)\b/i;

/**
 * Eine Deutung des Kindes aus dem, was es sagt, zeigt oder malt. Das ist das
 * zurueckgewiesene allgemeine Ziel Nr. 6 der Quelle.
 *
 * `erkennen` steht NICHT allein im Netz: „woran Sie erkennen, dass es gerade
 * passt" ist der Kern dieser App. Getroffen wird die Konstruktion, in der ein
 * Gegenstand oder eine Aeusserung etwas ueber das Kind aussagt.
 *
 * Statt `\b` am Wortende steht ein Lookahead, der Umlaute und ß mitzaehlt:
 * `\b` ist in JavaScript ueber [A-Za-z0-9_] definiert, und hinter einem
 * Umlaut oder ß greift es darum nicht (etwa bei „weiß"). Hier ist kein Wort
 * betroffen - der Lookahead steht vorsorglich, damit ein spaeter ergaenztes
 * Wort nicht stillschweigend tot ist. Die Korpusregel
 * `wortgrenze-umlaut.test.mjs` haelt die Falle aus dem ganzen Korpus heraus.
 */
export const DEUTUNG = /\b(?:innere[ns]?\s+Welt|Seelenleben|Psyche|Befund|Rückschlüsse|Deutung|deuten|verrät|verraten)(?![\wäöüß])|\b(?:erkennen|herausfinden|herauslesen|ablesen|sehen)(?![\wäöüß])[^.!?]{0,40}(?:individuelle[nrs]?\s+Besonderheiten|Persönlichkeit|Charakter|wie\s+es\s+dem\s+Kind\s+geht)(?![\wäöüß])/i;

/** Eine Einstufung des Kindes. Wie in Nr. 55 und Nr. 59: ohne abschliessendes
 *  `\b` bei den Adjektiven, weil `begabt\b` „begabte" nicht treffen kann. */
export const EINSTUFUNG = /(?:un)?begabt\w*|talentiert\w*|\b(?:Begabung|Talent|Niveau|Stufe\s+\d|förderbedürftig\w*|auffällig\w*|normal\s+für|weit\s+voraus|zurückgeblieben\w*|kreativer\s+als)/i;

/** Ein Wirkversprechen. */
export const WIRKVERSPRECHEN = /\b(?:fördert|trainiert|verbessert|steigert|schult|stärkt|voranbringt|bringt)\b[^.!?]{0,40}\b(?:Wahrnehmung|Sprache|Sprachentwicklung|Entwicklung|Intelligenz|Wortschatz|Konzentration|Begabung|Fantasie|Kreativität)\b/i;

/** Eine Vorgabe in Zeit oder Haeufigkeit. */
export const VORGABE = /\b(?:täglich|jeden\s+Tag|mindestens|wenigstens|mal\s+am\s+Tag)\b|\b\d+\s*(?:Minuten|Sekunden|Mal)\b/i;

/** Eine Altersstufung einzelner Stuecke. Die Zielgruppe (1 bis 3) steht im
 *  Rahmen; was es dort NICHT gibt, ist „ab 18 Monaten" an einer Achse - dafuer
 *  fehlt jede Quelle. */
export const ALTERSSTUFUNG = /\bab\s+\d+\s*(?:Monaten|Jahren)\b|\bmit\s+\d+\s*(?:Monaten|Jahren)\b|\bLebensmonat\b|\bLebensjahr\b/i;

/** Ein Preis. Getroffen wird die ZAHL mit Waehrung, nicht das Wort: „Kostet
 *  nichts" und „kostenlos" sind gerade die Zusage dieser App. */
export const PREIS = /\d+(?:[.,]\d+)?\s*(?:€|EUR\b|Euro\b)|(?:€|EUR)\s*\d/;

/**
 * Ein Markenname oder eine Bezugsquelle. Ein Eigenname laesst sich im
 * Deutschen lexikalisch nicht erkennen - jedes Substantiv ist gross
 * geschrieben (Falle A, fuenfzehntes Mal, Nr. 56). Getroffen wird, was eine
 * Marke MITBRINGT: Rechtsform, Schutzzeichen, Anfuehrungszeichen nach
 * „Marke", eine Bestelleinladung.
 */
export const MARKE_ODER_QUELLE = /\b(?:GmbH|AG|KGaA|KG|SE|Ltd|Inc)\b|[®™]|\bMarke\s+[„"»]|\bModell\s+[A-Z0-9]|\b(?:bestellen|Onlineshop|Versandkosten|Lieferzeit|im\s+Handel\s+erhältlich)\b/;

/**
 * Ein namentlich genanntes Werk oder ein Urheber. Dasselbe Problem wie bei der
 * Marke, darum auch hier die Konstruktion: ein Titel in Anfuehrungszeichen mit
 * Urheberangabe, „Illustrationen von …", eine abgekuerzte Vornamensinitiale.
 */
export const WERK_ODER_URHEBER = /[„»"][^„»"“]{2,60}[“«"]\s*(?:von|,)\s*[A-ZÄÖÜ]|\bIllustrationen?\s+von\s+[A-ZÄÖÜ]|\b[A-ZÄÖÜ]\.\s?[A-ZÄÖÜ][a-zäöüß]{2,}/;

const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;
const ZEICHEN = /\p{Extended_Pictographic}/u;
const KYRILLISCH = /[Ѐ-ӿ]/;

export const achseVon = (daten, id) => (daten?.achsen ?? []).find((a) => a.id === id) ?? null;
export const gegenstandVon = (daten, id) => (daten?.gegenstaende ?? []).find((g) => g.id === id) ?? null;

/** Die Ziel-Kennung, wie `belegtDurch` und `quellZiel` sie treffen. */
export const zielSchluessel = (z) => `${z.gruppe}-${z.nr}`;

export function zielVon(daten, schluessel) {
  return (daten?.ziele ?? []).find((z) => zielSchluessel(z) === schluessel) ?? null;
}

/**
 * Alle Textstellen, die die App als ANGEBOT zeigt - also das, was ein
 * Erwachsener als Anleitung liest. Die Textnetze laufen hier und nur hier:
 * die Ausschlussliste, die Zielliste und die `kein…`-Absaetze MUESSEN
 * benennen, was sie ausschliessen.
 */
export function angebotsTexte(daten) {
  const t = [];
  for (const a of daten?.achsen ?? []) {
    t.push([`Achse ${a.id} name`, a.name], [`Achse ${a.id} worauf`, a.worauf], [`Achse ${a.id} grenze`, a.grenze]);
    (a.impulse ?? []).forEach((i, n) => t.push([`Achse ${a.id} Impuls ${n + 1}`, i]));
  }
  for (const g of daten?.gegenstaende ?? []) {
    t.push([`Gegenstand ${g.id} name`, g.name], [`Gegenstand ${g.id} woGefunden`, g.woGefunden],
      [`Gegenstand ${g.id} besonderes`, g.besonderes], [`Gegenstand ${g.id} grenze`, g.grenze],
      [`Gegenstand ${g.id} starkeAchsenWarum`, g.starkeAchsenWarum]);
  }
  for (const r of daten?.regeln ?? []) {
    t.push([`Regel ${r.id} was`, r.was], [`Regel ${r.id} warum`, r.warum]);
  }
  return t.filter(([, s]) => nichtLeer(s));
}

/** Alle Impulse mit ihrer Herkunft - das Netz `ABFRAGE` laeuft nur hier. */
export function alleImpulse(daten) {
  return (daten?.achsen ?? []).flatMap((a) => (a.impulse ?? []).map((i, n) => [`Achse ${a.id} Impuls ${n + 1}`, i]));
}

/**
 * Das Blatt zum Ausdrucken: ein Gegenstand, die fuenf Achsen in der
 * Reihenfolge der Quelle, die drei Regeln. Kein Haken, keine Namenszeile.
 */
export function blatt(daten, gegenstandId) {
  const g = gegenstandVon(daten, gegenstandId);
  if (!g) return null;
  const stark = new Set(g.starkeAchsen ?? []);
  return {
    titel: `Zusammen hinschauen: ${g.name}`,
    gegenstand: g,
    achsen: ACHSEN.map((id) => achseVon(daten, id)).filter(Boolean).map((a) => ({ ...a, stark: stark.has(a.id) })),
    regeln: daten?.regeln ?? [],
    sicherheit: daten?.sicherheit ?? '',
  };
}

/**
 * Pruefung der Daten. Rechnet vor allem die Quellbilanz nach: jedes der 13
 * Ziele hat genau eine Einordnung, jedes `gebaut`-Ziel hat seine Stuecke, und
 * jedes Stueck hat sein Ziel.
 */
export function pruefeDaten(daten) {
  const fehler = [];
  const achsen = daten?.achsen ?? [];
  const gegenstaende = daten?.gegenstaende ?? [];
  const regeln = daten?.regeln ?? [];
  const ziele = daten?.ziele ?? [];
  const aus = daten?.ausgeschlossen ?? [];

  // --- Achsen: geschlossene Liste, Reihenfolge der Quelle ------------------
  if (achsen.length !== ACHSEN.length) fehler.push(`${achsen.length} Achsen, erwartet ${ACHSEN.length}`);
  achsen.forEach((a, i) => {
    const wo = `Achse ${a.id ?? '?'}`;
    if (ACHSEN[i] !== a.id) fehler.push(`${wo}: steht an Stelle ${i + 1}, dort gehört ${ACHSEN[i]} hin – die Reihenfolge ist die der Quelle`);
    if (!nichtLeer(a.name)) fehler.push(`${wo}: name fehlt`);
    if (!ZEICHEN.test(a.zeichen ?? '')) fehler.push(`${wo}: zeichen fehlt – die App rendert es`);
    if (!nichtLeer(a.worauf)) fehler.push(`${wo}: worauf fehlt`);
    if (!nichtLeer(a.grenze)) fehler.push(`${wo}: grenze fehlt – jede Achse muss sagen, wo sie aufhört`);
    if ((a.impulse ?? []).length < 3) fehler.push(`${wo}: weniger als 3 Impulse`);
    if (a.quellZiel !== 5) fehler.push(`${wo}: quellZiel ist ${a.quellZiel}, die Mittel der Ausdruckskraft stehen im 5. Wahrnehmungsziel`);
  });

  // --- Gegenstandstypen ----------------------------------------------------
  if (gegenstaende.length < 4) fehler.push('zu wenige Gegenstandstypen');
  const starkGezaehlt = new Map(ACHSEN.map((id) => [id, 0]));
  for (const g of gegenstaende) {
    const wo = `Gegenstand ${g.id ?? '?'}`;
    if (!nichtLeer(g.name)) fehler.push(`${wo}: name fehlt`);
    if (!ZEICHEN.test(g.zeichen ?? '')) fehler.push(`${wo}: zeichen fehlt`);
    // Ohne diesen Satz waere die App eine Einkaufsliste.
    if (!nichtLeer(g.woGefunden)) fehler.push(`${wo}: woGefunden fehlt – jeder Gegenstand muss sagen, wo er ohne Geld zu finden ist`);
    if (!nichtLeer(g.besonderes)) fehler.push(`${wo}: besonderes fehlt`);
    if (!nichtLeer(g.grenze)) fehler.push(`${wo}: grenze fehlt – für Kinder unter drei Jahren ist alles erst einmal etwas zum In-den-Mund-Nehmen`);
    if (!nichtLeer(g.starkeAchsenWarum)) fehler.push(`${wo}: starkeAchsenWarum fehlt`);
    const stark = g.starkeAchsen ?? [];
    if (stark.length < 2 || stark.length > 4) fehler.push(`${wo}: ${stark.length} starke Achsen, erlaubt sind 2 bis 4`);
    if (new Set(stark).size !== stark.length) fehler.push(`${wo}: eine starke Achse doppelt`);
    for (const id of stark) {
      if (!ACHSEN.includes(id)) fehler.push(`${wo}: starke Achse ${id} gibt es nicht`);
      else starkGezaehlt.set(id, starkGezaehlt.get(id) + 1);
    }
    if (g.quellZiel !== 2) fehler.push(`${wo}: quellZiel ist ${g.quellZiel}, die Kunstarten stehen im 2. Wahrnehmungsziel`);
  }
  // Eine Achse, die bei keinem Gegenstand stark ist, steht im Nichts.
  for (const [id, n] of starkGezaehlt) {
    if (n === 0) fehler.push(`Achse ${id} ist bei keinem Gegenstand eine starke Achse – dann fehlt ihr der Gegenstand`);
  }

  // --- Regeln --------------------------------------------------------------
  if (regeln.length < 3) fehler.push('zu wenige Regeln');
  for (const r of regeln) {
    const wo = `Regel ${r.id ?? '?'}`;
    if (!nichtLeer(r.was)) fehler.push(`${wo}: was fehlt`);
    if (!nichtLeer(r.warum)) fehler.push(`${wo}: warum fehlt`);
    if (!Number.isInteger(r.quellZiel)) fehler.push(`${wo}: quellZiel fehlt`);
  }

  // --- Die Bilanz der 13 Quellziele ---------------------------------------
  const gezaehlt = { allgemein: 0, wahrnehmung: 0 };
  const schluessel = new Set();
  for (const z of ziele) {
    const wo = `Ziel ${z.gruppe ?? '?'}-${z.nr ?? '?'}`;
    if (!(z.gruppe in gezaehlt)) { fehler.push(`${wo}: unbekannte Gruppe`); continue; }
    if (!Number.isInteger(z.nr) || z.nr < 1) { fehler.push(`${wo}: nr fehlt`); continue; }
    gezaehlt[z.gruppe] += 1;
    if (schluessel.has(zielSchluessel(z))) fehler.push(`${wo}: doppelt`);
    schluessel.add(zielSchluessel(z));
    if (!nichtLeer(z.kurz)) fehler.push(`${wo}: kurz fehlt`);
    if (!EINORDNUNGEN.includes(z.einordnung)) { fehler.push(`${wo}: einordnung „${z.einordnung}" ist keine der vier`); continue; }
    if (z.einordnung === 'gebaut') {
      const belegt = z.belegtDurch ?? [];
      if (!belegt.length) fehler.push(`${wo}: als gebaut eingeordnet, aber belegtDurch ist leer`);
      for (const id of belegt) {
        const stueck = achseVon(daten, id) ?? gegenstandVon(daten, id) ?? regeln.find((r) => r.id === id);
        if (!stueck) { fehler.push(`${wo}: belegtDurch nennt ${id}, das es nicht gibt`); continue; }
        // Das Stueck muss auf dasselbe Ziel zeigen - sonst behauptet die
        // Bilanz eine Deckung, die das Stueck nicht kennt.
        if (z.gruppe !== 'wahrnehmung' || stueck.quellZiel !== z.nr) {
          fehler.push(`${wo}: ${id} zeigt auf Ziel ${stueck.quellZiel}, nicht auf ${z.nr}`);
        }
      }
    } else if (z.einordnung === 'ausgeschlossen') {
      const belegt = z.belegtDurch ?? [];
      if (!belegt.length) fehler.push(`${wo}: als ausgeschlossen eingeordnet, aber kein Eintrag der Ausschlussliste genannt`);
      for (const nr of belegt) {
        if (!aus.some((x) => x.quellNr === nr)) fehler.push(`${wo}: Ausschluss ${nr} fehlt in der Liste`);
      }
      // Die Zurueckweisung muss das Zurueckgewiesene BENENNEN - das Netz
      // laeuft hier in der Gegenrichtung.
      if (!DEUTUNG.test(z.kurz)) fehler.push(`${wo}: der Zieltext benennt die Deutung nicht, die er zurückweist`);
    } else if (z.einordnung === 'alsGanzes' && !nichtLeer(z.warum)) {
      fehler.push(`${wo}: als Ganzes eingelöst – dann muss hier stehen, wodurch`);
    }
    // `anderesThema` braucht kein eigenes `warum`: der Grund ist fuer alle
    // fuenf derselbe und steht einmal im Feld `anderesThema`. Fuenfmal
    // dasselbe zu schreiben waere kein Beleg, sondern Fuellung.
  }
  if (gezaehlt.allgemein !== ZIELE.allgemein) fehler.push(`${gezaehlt.allgemein} allgemeine Ziele, nachgezählt sind ${ZIELE.allgemein}`);
  if (gezaehlt.wahrnehmung !== ZIELE.wahrnehmung) fehler.push(`${gezaehlt.wahrnehmung} Wahrnehmungsziele, nachgezählt sind ${ZIELE.wahrnehmung}`);
  for (let n = 1; n <= ZIELE.allgemein; n += 1) if (!schluessel.has(`allgemein-${n}`)) fehler.push(`allgemeines Ziel ${n} fehlt`);
  for (let n = 1; n <= ZIELE.wahrnehmung; n += 1) if (!schluessel.has(`wahrnehmung-${n}`)) fehler.push(`Wahrnehmungsziel ${n} fehlt`);

  // Umgekehrt: kein Stueck ohne Ziel, das es nennt.
  for (const stueck of [...achsen, ...gegenstaende, ...regeln]) {
    if (!Number.isInteger(stueck.quellZiel)) continue;
    const z = zielVon(daten, `wahrnehmung-${stueck.quellZiel}`);
    if (!z) { fehler.push(`${stueck.id}: zeigt auf Wahrnehmungsziel ${stueck.quellZiel}, das es nicht gibt`); continue; }
    if (!(z.belegtDurch ?? []).includes(stueck.id)) {
      fehler.push(`${stueck.id}: zeigt auf Ziel ${stueck.quellZiel}, aber dieses Ziel nennt ${stueck.id} nicht`);
    }
  }
  if (aus.length < 5) fehler.push('die Ausschlussliste ist zu kurz – was nicht übernommen ist, muss benannt sein');
  for (const x of aus) {
    if (!nichtLeer(x.quellNr)) fehler.push('ein Ausschluss ohne quellNr');
    if (!nichtLeer(x.was) || !nichtLeer(x.warum)) fehler.push(`Ausschluss ${x.quellNr}: was oder warum fehlt`);
  }

  // --- Die Textnetze, nur über den Angebotstexten -------------------------
  for (const [wo, text] of alleImpulse(daten)) {
    if (ABFRAGE.test(text)) fehler.push(`${wo}: als Frage gebaut – hier wird festgestellt, nicht geprüft`);
    if (PRUEFURTEIL.test(text)) fehler.push(`${wo}: urteilt über die Antwort des Kindes`);
  }
  for (const [wo, text] of angebotsTexte(daten)) {
    if (DEUTUNG.test(text)) fehler.push(`${wo}: deutet das Kind`);
    if (EINSTUFUNG.test(text)) fehler.push(`${wo}: stuft ein Kind ein`);
    if (WIRKVERSPRECHEN.test(text)) fehler.push(`${wo}: Wirkversprechen`);
    if (VORGABE.test(text)) fehler.push(`${wo}: Vorgabe in Zeit oder Häufigkeit`);
    if (ALTERSSTUFUNG.test(text)) fehler.push(`${wo}: Altersangabe an einem einzelnen Stück`);
    if (PREIS.test(text)) fehler.push(`${wo}: ein Preis`);
    if (MARKE_ODER_QUELLE.test(text)) fehler.push(`${wo}: Marke oder Bezugsquelle`);
    if (WERK_ODER_URHEBER.test(text)) fehler.push(`${wo}: ein namentlich genanntes Werk oder ein Urheber`);
    if (KYRILLISCH.test(text)) fehler.push(`${wo}: kyrillisch – die Quelle gehört in das Quellfeld, nicht in einen Elterntext`);
  }

  // --- Die Absaetze, die die App über sich selbst sagt --------------------
  for (const feld of ['hinweis', 'wasEsIst', 'reihenfolge', 'fuenfteilung', 'keinAbfragen', 'keineBuchliste',
    'keinDeuten', 'keinKauf', 'keinMuseum', 'keinWirkversprechen', 'anderesThema', 'sicherheit', 'elterntelefon']) {
    if (!nichtLeer(daten?.[feld])) fehler.push(`${feld} fehlt`);
  }
  // Die fuenf Ziele des eigenen Tuns haben einen gemeinsamen Grund: sie stehen
  // in der Quelle in eigenen Unterabschnitten. Der Text muss mindestens einen
  // davon nennen, sonst ist „anderes Thema" eine Behauptung.
  if (ziele.some((z) => z.einordnung === 'anderesThema') && !/Рисование|Лепка|Аппликация/.test(daten?.anderesThema ?? '')) {
    fehler.push('anderesThema nennt keinen der Unterabschnitte der Quelle, in denen das eigene Tun steht');
  }
  if (nichtLeer(daten?.keinDeuten) && !DEUTUNG.test(daten.keinDeuten)) {
    fehler.push('keinDeuten benennt die Deutung nicht, die es ausschließt');
  }
  if (nichtLeer(daten?.keinAbfragen) && !ABFRAGE.test(daten.keinAbfragen)) {
    fehler.push('keinAbfragen zeigt keine Prüffrage – ohne Beispiel versteht niemand, was gemeint ist');
  }
  if (daten?.quelle?.geprueft !== true) fehler.push('quelle.geprueft ist nicht true – die Seiten sind nicht gelesen');
  for (const feld of ['werk', 'rechte', 'nachgezaehlt', 'abweichung']) {
    if (!nichtLeer(daten?.quelle?.[feld])) fehler.push(`quelle.${feld} fehlt`);
  }
  // Die Abweichungsnotiz muss die gezaehlte Bilanz nennen, nicht eine andere.
  const bilanz = EINORDNUNGEN.map((e) => [e, ziele.filter((z) => z.einordnung === e).length]);
  const worte = { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13' };
  for (const [e, n] of bilanz) {
    if (n > 0 && !new RegExp(`\\b${worte[n]}\\b`).test(daten?.quelle?.abweichung ?? '')) {
      fehler.push(`quelle.abweichung nennt die Zahl ${n} nicht, es sind aber ${n} Ziele ${e}`);
    }
  }
  if (!new RegExp(`\\b${ZIELE.allgemein + ZIELE.wahrnehmung}\\b`).test(daten?.quelle?.abweichung ?? '')) {
    fehler.push('quelle.abweichung nennt die Gesamtzahl der Ziele nicht');
  }
  return fehler;
}
