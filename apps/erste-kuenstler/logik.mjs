// Erste Künstler 1-3 (Praleska docs/10, Eltern-Werkzeuge Nr. 61, Quelle
// S. 101-102: «ОСНОВНЫЕ ПОКАЗАТЕЛИ РАЗВИТИЯ ДЕТЕЙ (к концу третьего года
// жизни)», Abschnitt «Художественная деятельность», Gruppe «МАЛЫШИ» =
// frühes Alter, von einem Jahr bis drei Jahren).
//
// TRAGENDE ENTSCHEIDUNG: KEINE CHECKLISTE.
//
// Der Katalogeintrag wollte „19 Meilensteine der fruehen kuenstlerischen
// Entwicklung … als Checkliste". Gebaut ist das nicht, und die beiden Gruende
// sind nachpruefbar:
//
// 1. Die Quelle ueberschreibt ihre 19 Merkmale mit „zum Ende des dritten
//    Lebensjahres". Sie beschreibt einen Zustand am ENDE der Spanne, nicht
//    einen Weg dorthin. Ein Kind von vierzehn Monaten, das achtzehn davon
//    nicht zeigt, ist vierzehn Monate alt - eine Checkliste „fuer 1 bis 3"
//    wuerde die Quelle falsch lesen und Sorge herstellen, wo keine ist.
//
// 2. In Deutschland gibt es keine Referenzliste fuer kuenstlerische
//    Entwicklung. Die „Grenzsteine der Entwicklung" kennen keinen solchen
//    Bereich; im Altersband bis drei Jahre stehen dort zum Malen genau zwei
//    Punkte - die Stifthaltung (24. Monat, Hand-Finger-Motorik) und die
//    Frage, ob das Kind auf Nachfrage sagt, wen oder was es gemalt hat
//    (36. Monat, und das unter KOGNITIVER Entwicklung). Zu Singen, Zuhoeren,
//    Kneten und Fingermalen steht dort nichts. Eine Neunzehn-Punkte-Liste zum
//    Abhaken haette den Anschein einer Norm, hinter der nichts steht.
//
// Gebaut ist stattdessen eine Ideenkartei, geordnet nach dem, was der
// Erwachsene SCHON SIEHT (`wennSie`). Die 19 Merkmale stehen vollstaendig da -
// als Anhang mit Einordnung, nicht als Liste zum Abhaken. `pruefeDaten`
// rechnet beides gegeneinander: jedes Merkmal hat genau eine von vier
// Einordnungen, jedes `ideeDa`-Merkmal hat seine Karte und jede Karte ihr
// Merkmal.
//
// WEITERE ENTSCHEIDUNGEN
//
// * KEIN BERICHT, KEIN EXPORT, KEIN SPEICHER. Berichtet wuerde hier ueber ein
//   Kind - genau die Einstufung, die diese App nicht macht. Gedruckt wird eine
//   Ideenkarte, nicht ein Kind.
// * KEINE DEUTUNG. Ein Gekritzel ist kein Befund (siehe Nr. 60).
// * KEIN LIEDTEXT. Bei vielen bekannten Fassungen ist nicht zu klaeren, ob sie
//   frei sind (siehe Nr. 59).
// * SICHERHEIT STEHT AN JEDEM MATERIAL, nicht nur im Vorspann: in diesem Alter
//   kommt alles in den Mund.

/** Die drei Taetigkeitsbereiche der Quelle - geschlossene Liste. */
export const BEREICHE = Object.freeze(['sprache', 'musik', 'kunst']);

/** Wie viele Merkmale die Quelle je Bereich traegt (nachgezaehlt S. 101-102). */
export const MERKMALE_JE_BEREICH = Object.freeze({ sprache: 4, musik: 8, kunst: 7 });

/** Die vier moeglichen Einordnungen eines Quellmerkmals. */
export const EINORDNUNGEN = Object.freeze(['ideeDa', 'anderesWerkzeug', 'nichtUebernommen', 'beschreibend']);

/**
 * Sprache einer Checkliste. Die Modalkonstruktion steht als EIGENER Zweig:
 * „sollte können" kommt im Deutschen fast nie zusammen vor, dazwischen steht
 * das Subjekt („Mit zwei Jahren sollte Ihr Kind das können"). Die Gegenprobe
 * hat das beim Bau gefunden.
 *
 * Laeuft NUR ueber die Ideenkarten und das Material.
 * `keinMeilenstein`, die Merkmalsliste und die Ausschlussliste muessen das
 * Abhaken benennen koennen, um es auszuschliessen - Falle A, neunzehntes Mal
 * in diesem Projekt.
 */
export const CHECKLISTE = /\b(?:abhaken|abgehakt|Checkliste|Meilenstein\w*|Entwicklungsstand|kann\s+Ihr\s+Kind\s+(?:das\s+)?schon|noch\s+nicht\s+so\s+weit|hinter\w*\s+zurück)\b|\b(?:sollte|müsste|muss)\b[^.!?]{0,30}\b(?:können|beherrschen|schaffen)\b/i;

/** Einstufung eines Kindes. Ohne abschliessendes `\b` bei den Adjektiven,
 *  weil `begabt\b` „begabte" nicht treffen kann (Nr. 55, Nr. 59, Nr. 60). */
export const EINSTUFUNG = /(?:un)?begabt\w*|talentiert\w*|\b(?:Begabung|Talent|Niveau|Stufe\s+\d|förderbedürftig\w*|auffällig\w*|normal\s+für|weit\s+voraus|zurückgeblieben\w*|kreativer\s+als)/i;

/**
 * Eine Deutung des Kindes. Getroffen wird die AUSSAGE ueber das Kind, nicht
 * das Wort: eine Karte muss „kein Deuten" sagen duerfen. Dieselbe Trennung wie
 * in Nr. 60, nur eine Stufe schaerfer, weil hier das Kind etwas HERSTELLT und
 * die Versuchung, darin zu lesen, groesser ist.
 *
 * KEIN `\b` vor „über": `\b` ist in JavaScript ueber [A-Za-z0-9_] definiert,
 * und „ü" gehoert nicht dazu - zwischen Leerzeichen und „ü" liegt keine
 * Wortgrenze, `\büber` trifft also nie. Beim Bau hat die Gegenprobe genau das
 * gefunden: das Netz liess „Die Farbwahl verrät viel über das Kind" durch.
 * Am Wortende steht hier ein Lookahead statt `\b`, weil `\b` auch hinter einem
 * Umlaut oder ß nicht greift (etwa bei „weiß"). Dass der Korpus diese Falle
 * nirgends mehr enthaelt, prueft `wortgrenze-umlaut.test.mjs`.
 */
export const DEUTUNG = /\b(?:innere[ns]?\s+Welt|Seelenleben|Psyche|Befund|Rückschlüsse)\b|\b(?:verrät|verraten|zeigt|sagt|erkennen|herausfinden|ablesen|herauslesen)(?![\wäöüß])[^.!?]{0,40}(?:über\s+(?:das|Ihr|sein|ihr)\s+Kind|individuelle[nrs]?\s+Besonderheiten|Persönlichkeit|Charakter)(?![\wäöüß])/i;

/** Ein Wirkversprechen. */
export const WIRKVERSPRECHEN = /\b(?:fördert|trainiert|verbessert|steigert|schult|stärkt|entwickelt)\b[^.!?]{0,40}\b(?:Kreativität|Fantasie|Feinmotorik|Motorik|Sprache|Sprachentwicklung|Entwicklung|Intelligenz|Wortschatz|Konzentration|Begabung)\b/i;

/** Eine Vorgabe in Zeit oder Haeufigkeit. */
export const VORGABE = /\b(?:täglich|jeden\s+Tag|mindestens|wenigstens|mal\s+am\s+Tag)\b|\b\d+\s*(?:Minuten|Sekunden)\b|\b(?:fünf|zehn|fünfzehn|zwanzig|dreißig)\s+Minuten\b/i;

/** Eine Altersangabe an einer einzelnen Karte. Die Spanne 1 bis 3 steht im
 *  Rahmen; „ab 18 Monaten" an einer Idee haette keine Quelle. */
export const ALTERSSTUFUNG = /\bab\s+\d+\s*(?:Monaten|Jahren)\b|\bmit\s+\d+\s*(?:Monaten|Jahren)\b|\bLebensmonat\b|\bLebensjahr\b|\b\d+\.\s*Geburtstag\b/i;

/** Ein Preis. Getroffen wird die Zahl mit Waehrung, nicht das Wort „kostet". */
export const PREIS = /\d+(?:[.,]\d+)?\s*(?:€|EUR\b|Euro\b)|(?:€|EUR)\s*\d/;

/** Marke oder Bezugsquelle. Ein Eigenname ist im Deutschen lexikalisch nicht
 *  erkennbar (Falle A, Nr. 56) - getroffen wird, was eine Marke mitbringt. */
export const MARKE_ODER_QUELLE = /\b(?:GmbH|AG|KGaA|KG|SE|Ltd|Inc)\b|[®™]|\bMarke\s+[„"»]|\bModell\s+[A-Z0-9]|\b(?:bestellen|Onlineshop|Versandkosten|Lieferzeit|im\s+Handel\s+erhältlich)\b/;

/** Ein uebernommener Liedtext oder eine Strophe (Nr. 59). */
export const FREMDTEXT = /\bliedtext\b|\bstrophe\b|\brefrain\b|überliefert\w*\s+(?:text|lied|reim)\b/i;

const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;
const ZEICHEN = /\p{Extended_Pictographic}/u;
const KYRILLISCH = /[Ѐ-ӿ]/;

export const ideeVon = (daten, id) => (daten?.ideen ?? []).find((i) => i.id === id) ?? null;
export const materialVon = (daten, id) => (daten?.material ?? []).find((m) => m.id === id) ?? null;
export const merkmalVon = (daten, id) => (daten?.merkmale ?? []).find((m) => m.id === id) ?? null;

/** Alle Ideenkarten, die ein Quellmerkmal nennen. */
export function ideenFuer(daten, merkmalId) {
  return (daten?.ideen ?? []).filter((i) => (i.quellMerkmale ?? []).includes(merkmalId));
}

/**
 * Eine Karte zum Ausdrucken: die Idee, ihr Material mit den Sicherheitssaetzen
 * und die Regel, die immer gilt. Kein Haken, keine Namenszeile, kein Datum.
 */
export function karte(daten, ideeId) {
  const i = ideeVon(daten, ideeId);
  if (!i) return null;
  return {
    titel: i.name,
    idee: i,
    material: (i.material ?? []).map((id) => materialVon(daten, id)).filter(Boolean),
    sicherheitImmer: daten?.sicherheitImmer ?? '',
  };
}

/**
 * Die Stellen, die ausdruecklich NICHT durch die Textnetze laufen - jede mit
 * ihrem Grund. Alles andere wird geprueft.
 *
 * Diese Richtung ist die wichtige: eine Liste dessen, was geprueft WIRD,
 * vergisst still ein neues Feld, und eine vergessene Luecke sieht aus wie
 * eine gewollte. Gleiche Loesung wie in Nr. 60, nachdem dort das Review sechs
 * ungeprueft gerenderte Elterntexte gefunden hat.
 */
export const NICHT_GEPRUEFT = Object.freeze({
  keinMeilenstein: 'muss Checkliste, Meilenstein und die Monatsangaben der Referenzen nennen, um sie auszuschließen',
  wasStattdessen: 'erklärt, was an die Stelle der Liste tritt, und nennt sie dafür',
  zeitpunkt: 'gibt die Überschrift der Quelle wieder, samt „drittes Lebensjahr"',
  keinDeuten: 'muss die Deutung nennen, um sie auszuschließen',
  keinWirkversprechen: 'muss das Wirkversprechen nennen, um es auszuschließen',
  keinErgebnis: 'nennt das vorzeigbare Ergebnis, um es abzulehnen',
  keinBildschirm: 'nennt Empfehlungen samt Altersangaben und Stundenangabe',
  merkmale: 'die 19 Quellmerkmale im Wortlaut der Quelle, mit ihrer Einordnung',
  ausgeschlossen: 'die Ausschlussliste benennt, was sie ausschließt',
  quelle: 'Werk, Rechte und Zählung – russisch und mit Zahlen',
  art: 'die Kennung der App, kein Text für Eltern',
  version: 'eine Zahl, kein Text',
});

/**
 * Alle Texte, die die App zeigt und die ein Netz sehen muss - gebildet als
 * REST: alle Zeichenketten der Daten minus die benannten Ausnahmen.
 */
export function angebotsTexte(daten) {
  const t = [];
  const sammle = (wert, wo) => {
    if (typeof wert === 'string') { if (nichtLeer(wert)) t.push([wo, wert]); return; }
    if (Array.isArray(wert)) { wert.forEach((x, n) => sammle(x, `${wo}[${n}]`)); return; }
    if (wert && typeof wert === 'object') { for (const [k, v] of Object.entries(wert)) sammle(v, `${wo}.${k}`); }
  };
  for (const [feld, wert] of Object.entries(daten ?? {})) {
    if (feld in NICHT_GEPRUEFT) continue;
    sammle(wert, feld);
  }
  return t;
}

export function pruefeDaten(daten) {
  const fehler = [];
  const ideen = daten?.ideen ?? [];
  const material = daten?.material ?? [];
  const merkmale = daten?.merkmale ?? [];
  const aus = daten?.ausgeschlossen ?? [];

  // --- Ideenkarten ---------------------------------------------------------
  if (ideen.length < 6) fehler.push(`nur ${ideen.length} Ideen`);
  const materialIds = new Set(material.map((m) => m.id));
  const benutzt = new Set();
  const ideeIds = new Set();
  for (const i of ideen) {
    const wo = `Idee ${i.id ?? '?'}`;
    if (!nichtLeer(i.id)) fehler.push(`${wo}: id fehlt`);
    if (ideeIds.has(i.id)) fehler.push(`${wo}: id doppelt`);
    ideeIds.add(i.id);
    if (!nichtLeer(i.name)) fehler.push(`${wo}: name fehlt`);
    if (!ZEICHEN.test(i.zeichen ?? '')) fehler.push(`${wo}: zeichen fehlt – die App rendert es`);
    // Die Kartei ist nach dem geordnet, was der Erwachsene schon sieht.
    if (!nichtLeer(i.wennSie)) fehler.push(`${wo}: wennSie fehlt – die Kartei ist nach der Gelegenheit geordnet, nicht nach Alter`);
    if ((i.wasSieTun ?? []).length < 2) fehler.push(`${wo}: weniger als zwei Schritte`);
    // An die Stelle des Meilensteins gehoert eine beobachtbare Handlung.
    if (!nichtLeer(i.woranSieSehen)) fehler.push(`${wo}: woranSieSehen fehlt – an die Stelle des Meilensteins gehört eine beobachtbare Handlung`);
    if (!nichtLeer(i.aufhoeren)) fehler.push(`${wo}: aufhoeren fehlt – jede Karte muss sagen, wann Schluss ist`);
    if (!nichtLeer(i.grenze)) fehler.push(`${wo}: grenze fehlt`);
    if (!(i.material ?? []).length) fehler.push(`${wo}: kein Material`);
    for (const id of i.material ?? []) {
      if (!materialIds.has(id)) fehler.push(`${wo}: Material ${id} gibt es nicht`);
      else benutzt.add(id);
    }
    for (const id of i.quellMerkmale ?? []) {
      const m = merkmalVon(daten, id);
      if (!m) { fehler.push(`${wo}: Merkmal ${id} gibt es nicht`); continue; }
      if (m.einordnung !== 'ideeDa') fehler.push(`${wo}: nennt Merkmal ${id}, das als ${m.einordnung} eingeordnet ist`);
    }
    if (!(i.quellMerkmale ?? []).length) fehler.push(`${wo}: nennt kein Quellmerkmal`);
  }

  // --- Material ------------------------------------------------------------
  for (const m of material) {
    const wo = `Material ${m.id ?? '?'}`;
    if (!nichtLeer(m.name)) fehler.push(`${wo}: name fehlt`);
    if (!ZEICHEN.test(m.zeichen ?? '')) fehler.push(`${wo}: zeichen fehlt`);
    if (!nichtLeer(m.woGefunden)) fehler.push(`${wo}: woGefunden fehlt – hier wird nichts angeschafft`);
    // In diesem Alter kommt alles in den Mund. Material ohne Sicherheitssatz
    // waere eine Luecke an der gefaehrlichsten Stelle.
    if (!nichtLeer(m.sicherheit) || (m.sicherheit ?? '').length < 30) {
      fehler.push(`${wo}: sicherheit fehlt oder ist zu knapp – jedes Material braucht seinen eigenen Satz`);
    }
    if (!benutzt.has(m.id)) fehler.push(`${wo}: von keiner Idee benutzt`);
  }

  // --- Die 19 Merkmale der Quelle -----------------------------------------
  const gezaehlt = Object.fromEntries(BEREICHE.map((b) => [b, 0]));
  const merkmalIds = new Set();
  for (const m of merkmale) {
    const wo = `Merkmal ${m.id ?? '?'}`;
    if (!BEREICHE.includes(m.bereich)) { fehler.push(`${wo}: unbekannter Bereich`); continue; }
    gezaehlt[m.bereich] += 1;
    if (merkmalIds.has(m.id)) fehler.push(`${wo}: id doppelt`);
    merkmalIds.add(m.id);
    if (!nichtLeer(m.text)) fehler.push(`${wo}: text fehlt`);
    if (!EINORDNUNGEN.includes(m.einordnung)) { fehler.push(`${wo}: einordnung „${m.einordnung}" ist keine der vier`); continue; }
    if (m.einordnung === 'ideeDa') {
      if (!ideenFuer(daten, m.id).length) fehler.push(`${wo}: als ideeDa eingeordnet, aber keine Karte nennt es`);
    } else if (m.einordnung === 'anderesWerkzeug') {
      if (!(m.apps ?? []).length) fehler.push(`${wo}: als anderesWerkzeug eingeordnet, aber keine App genannt`);
    } else if (!nichtLeer(m.warum)) {
      fehler.push(`${wo}: Einordnung ${m.einordnung} braucht ein warum`);
    }
  }
  for (const b of BEREICHE) {
    if (gezaehlt[b] !== MERKMALE_JE_BEREICH[b]) {
      fehler.push(`${gezaehlt[b]} Merkmale im Bereich ${b}, nachgezählt sind ${MERKMALE_JE_BEREICH[b]}`);
    }
  }
  const gesamt = Object.values(MERKMALE_JE_BEREICH).reduce((a, b) => a + b, 0);
  if (merkmale.length !== gesamt) fehler.push(`${merkmale.length} Merkmale, nachgezählt sind ${gesamt}`);
  if (daten?.quelle?.zahlen?.merkmale !== gesamt) fehler.push(`quelle.zahlen.merkmale stimmt nicht mit ${gesamt} überein`);

  // --- Die Absaetze, die die App über sich selbst sagt --------------------
  for (const feld of ['hinweis', 'wasEsIst', 'keinMeilenstein', 'wasStattdessen', 'zeitpunkt', 'keinDeuten',
    'keinWirkversprechen', 'keinErgebnis', 'keinBildschirm', 'sicherheitImmer', 'elterntelefon']) {
    if (!nichtLeer(daten?.[feld])) fehler.push(`${feld} fehlt`);
  }
  // Die beiden Gruende gegen die Checkliste muessen BEIDE dastehen - sonst
  // ist die Entscheidung eine Meinung.
  if (!/Grenzsteine/.test(daten?.keinMeilenstein ?? '')) {
    fehler.push('keinMeilenstein nennt die Grenzsteine nicht – ohne sie ist „es gibt keine Referenzliste" eine Behauptung');
  }
  if (!/dritten\s+Lebensjahr/.test(daten?.keinMeilenstein ?? '')) {
    fehler.push('keinMeilenstein nennt den Zeitpunkt der Quelle nicht');
  }
  if (!/dritten\s+Lebensjahr/.test(daten?.zeitpunkt ?? '')) fehler.push('zeitpunkt nennt den Zeitpunkt der Quelle nicht');
  if (!DEUTUNG.test(daten?.keinDeuten ?? '')) fehler.push('keinDeuten benennt die Deutung nicht, die es ausschließt');
  // Die Regel, die immer gilt, muss das Kleinteil benennen.
  if (!/(?:verschluck|Kleinteil|in\s+den\s+Mund)/i.test(daten?.sicherheitImmer ?? '')) {
    fehler.push('sicherheitImmer benennt die Gefahr nicht, um die es geht');
  }
  // Eine Ausnahme fuer ein Feld, das es nicht mehr gibt, waere eine Luecke,
  // die niemand sieht.
  for (const feld of Object.keys(NICHT_GEPRUEFT)) {
    if (!(feld in (daten ?? {}))) fehler.push(`NICHT_GEPRUEFT nennt ${feld}, das es in den Daten nicht gibt`);
  }
  if (aus.length < 5) fehler.push('die Ausschlussliste ist zu kurz');
  for (const x of aus) {
    if (!nichtLeer(x.quellNr) || !nichtLeer(x.was) || !nichtLeer(x.warum)) fehler.push(`Ausschluss ${x.quellNr ?? '?'}: unvollständig`);
  }
  if (daten?.quelle?.geprueft !== true) fehler.push('quelle.geprueft ist nicht true');
  for (const feld of ['werk', 'rechte', 'nachgezaehlt', 'abweichung']) {
    if (!nichtLeer(daten?.quelle?.[feld])) fehler.push(`quelle.${feld} fehlt`);
  }
  // Die zweite Zahl des Katalogeintrags stimmt nicht - das muss dastehen.
  if (!/Aktivitätsformen/.test(daten?.quelle?.abweichung ?? '')) {
    fehler.push('quelle.abweichung sagt nichts zu den „9 Aktivitätsformen" des Katalogeintrags');
  }

  // --- Die Textnetze, nur über den Angebotstexten -------------------------
  for (const [wo, text] of angebotsTexte(daten)) {
    if (CHECKLISTE.test(text)) fehler.push(`${wo}: Sprache einer Checkliste`);
    if (EINSTUFUNG.test(text)) fehler.push(`${wo}: stuft ein Kind ein`);
    if (DEUTUNG.test(text)) fehler.push(`${wo}: deutet das Kind`);
    if (WIRKVERSPRECHEN.test(text)) fehler.push(`${wo}: Wirkversprechen`);
    if (VORGABE.test(text)) fehler.push(`${wo}: Vorgabe in Zeit oder Häufigkeit`);
    if (ALTERSSTUFUNG.test(text)) fehler.push(`${wo}: Altersangabe an einer einzelnen Karte`);
    if (PREIS.test(text)) fehler.push(`${wo}: ein Preis`);
    if (MARKE_ODER_QUELLE.test(text)) fehler.push(`${wo}: Marke oder Bezugsquelle`);
    if (FREMDTEXT.test(text)) fehler.push(`${wo}: ein übernommener Liedtext`);
    if (KYRILLISCH.test(text)) fehler.push(`${wo}: kyrillisch – die Quelle gehört in das Quellfeld`);
  }
  return fehler;
}
