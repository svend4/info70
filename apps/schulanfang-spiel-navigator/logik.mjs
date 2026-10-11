// Schulanfang und Spiel (Praleska docs/10, Eltern-Werkzeuge Nr. 64, Quelle
// S. 242: «МИР ИГРЫ», allgemeine Ziele, Gruppe «ФАНТАЗЕРЫ» = fünf bis
// sechs/sieben Jahre).
//
// TRAGENDE ENTSCHEIDUNG 1: DER TITEL DES KATALOGEINTRAGS IST NICHT UEBERNOMMEN.
//
// Der Eintrag heisst „Spielend schulreif". „Schulreife" unterstellte bis in
// die 1960er-Jahre einen biologisch bedingten Reifungsvorgang und wurde durch
// „Schulfaehigkeit" und spaeter „Schulbereitschaft" abgeloest. Nordrhein-
// Westfalen hat auch die Schulfaehigkeit als Einschulungsvoraussetzung
// ausdruecklich aufgegeben - an ihre Stelle ist eine bedarfsgerechte
// individuelle Foerderung getreten. Als URTEIL ueber ein Kind kommt das Wort
// hier nicht vor; `SCHULREIF_ALS_URTEIL` weist es ab, und der Glossarabsatz
// muss es nennen duerfen (Falle A, fuenfundzwanzigstes Mal).
//
// TRAGENDE ENTSCHEIDUNG 2: EIN QUELLZIEL IST ZURUECKGEWIESEN.
//
// Die Quelle will „die reichen Moeglichkeiten des Spiels zu diagnostischen
// und, falls noetig, zu korrektiven Zwecken nutzen". Ein Kind, das spielt,
// gibt sich preis; es dabei zu beobachten, um es einzuschaetzen, macht aus
// dem Spiel eine Pruefung, von der das Kind nichts weiss. Dieselbe Form wie
// in Nr. 60 (die „innere Welt") - und derselbe Mechanismus: `pruefeDaten`
// verlangt, dass genau ein Ziel als `zurueckgewiesen` eingeordnet ist und
// dass sein Text die Diagnose BENENNT.
//
// TRAGENDE ENTSCHEIDUNG 3: KEINE VORHERSAGE, KEINE CHECKLISTE.
//
// Nicht aus Vorsicht, sondern als Konsequenz: das eigens dafuer entwickelte,
// normierte Screening fuer Leseschwierigkeiten erkannte in unabhaengiger
// Pruefung meist weniger als die Haelfte der spaeter betroffenen Kinder. Was
// ein geprueftes Verfahren nicht sicher kann, kann ein Elternfragebogen in
// einer App erst recht nicht. Die Kultusministerkonferenz hat ausserdem
// bereits 1997 festgehalten, dass rein kognitiv ausgerichtete
// Schulfaehigkeitstests als alleinige Entscheidungsgrundlage nicht ausreichen.
//
// TRAGENDE ENTSCHEIDUNG 4: KEIN BUNDESWEITER SATZ.
//
// Stichtag, Zurueckstellung und Untersuchung sind Landesrecht. Jede Aussage
// in `wasGilt` traegt darum ihre Quelle, und `pruefeDaten` verlangt, dass die
// Laenderantwort mindestens zwei Bundeslaender nennt - sonst klingt ein
// Beispiel wie eine Regel.

/** Die Einordnungen der fuenf Quellziele. */
export const EINORDNUNGEN = Object.freeze(['gebaut', 'einrichtung', 'zurueckgewiesen']);

/** Wie viele allgemeine Ziele das Kapitel traegt (nachgezaehlt S. 242). */
export const ZIELE = 5;

/**
 * „Schulreif" als Urteil ueber ein Kind. Getroffen wird die Konstruktion,
 * nicht das Wort: der Glossarabsatz und die Ausschlussliste muessen es
 * nennen duerfen, um es abzulehnen.
 */
export const SCHULREIF_ALS_URTEIL = /\b(?:ist|wäre|scheint|wirkt|noch\s+nicht)\s+schul(?:reif|fähig|bereit)\b|\bschul(?:reif|fähig)e[rsn]?\s+Kind\b|\bIhr\s+Kind\s+ist\s+schul/i;

/** Eine Vorhersage ueber das einzelne Kind. */
export const VORHERSAGE = /\bdaran\s+erkennen\s+Sie,\s+ob\b|\bwird\s+(?:später|in\s+der\s+Schule)\b[^.!?]{0,30}\b(?:Schwierigkeiten|Probleme)\b|\bRisiko\s+für\s+(?:Lese|Rechen|Schul)\w*|\bprognos\w+/i;

/** Eine Bewertung: Punkte, Ampel, Vergleich mit anderen Kindern. */
export const BEWERTUNG = /\bAmpel\w*|\b\d+\s*(?:von|\/)\s*\d+\s*(?:Punkt|Merkmal)|\bProzent\b|\d\s*%|\bPerzentil\w*|\bim\s+Vergleich\s+zu\s+(?:anderen\s+Kindern|Gleichaltrigen)|\babhaken\b/i;

/** Ein Wirkversprechen zum Spiel. Genau das, was eine App ueber Spiel am
 *  liebsten saegte - und wofuer beim Bau keine Zahl zu finden war. */
export const WIRKVERSPRECHEN = /\b(?:fördert|verbessert|steigert|trainiert|stärkt|bereitet)\b[^.!?]{0,40}\b(?:Schulleistung|Schulerfolg|Lernen|Konzentration|Intelligenz|Schulfähigkeit)\b|\bmacht\b[^.!?]{0,20}\bfit\s+für\s+die\s+Schule\b/i;

/** Eine Altersangabe, ab der ein Kind etwas koennen soll. */
export const KOENNENSALTER = /\bmit\s+\d+\s+Jahren\s+(?:sollte|muss|kann\s+ein\s+Kind)\b|\bab\s+\d+\s+Jahren\s+(?:sollte|muss)\b|\bbis\s+zur\s+Einschulung\s+(?:sollte|muss)\b/i;

const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;
const ZEICHEN = /\p{Extended_Pictographic}/u;
const KYRILLISCH = /[Ѐ-ӿ]/;

export const bereichVon = (daten, id) => (daten?.bereiche ?? []).find((b) => b.id === id) ?? null;
export const spielartVon = (daten, id) => (daten?.spielarten ?? []).find((s) => s.id === id) ?? null;

/** Ausnahmen von den Textnetzen, jede mit Grund. Gleiche Umkehrung wie in
 *  Nr. 60 bis Nr. 63: geprueft wird der REST. */
export const NICHT_GEPRUEFT = Object.freeze({
  warumNichtSchulreif: 'erklärt den Begriff „schulreif“ und muss ihn dafür nennen',
  keineBeurteilung: 'muss Checkliste, Punkte und Vorhersage nennen, um sie auszuschließen',
  quellZielAbgelehnt: 'zitiert das zurückgewiesene Quellziel samt „diagnostisch“',
  bereicheHinweis: 'sagt, dass die drei Bereiche keine Prüfpunkte sind – und muss das Abhaken dafür nennen',
  ziele: 'die fünf Quellziele im Wortlaut, darunter das zurückgewiesene',
  ausgeschlossen: 'die Ausschlussliste benennt, was sie ausschließt',
  quelle: 'Werk, Rechte und Zählung – russisch',
  elterntelefon: 'enthält die Telefonnummer',
  art: 'die Kennung der App, kein Text für Eltern',
  version: 'eine Zahl, kein Text',
});

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
  const gilt = daten?.wasGilt ?? [];
  const bereiche = daten?.bereiche ?? [];
  const spielarten = daten?.spielarten ?? [];
  const ziele = daten?.ziele ?? [];
  const aus = daten?.ausgeschlossen ?? [];

  // --- Was gilt: jede Antwort mit Quelle, keine bundesweite Behauptung ----
  if (gilt.length < 5) fehler.push('zu wenige Fragen unter „Was gilt“');
  for (const g of gilt) {
    const wo = `Frage ${g.id ?? '?'}`;
    if (!ZEICHEN.test(g.zeichen ?? '')) fehler.push(`${wo}: zeichen fehlt`);
    for (const feld of ['frage', 'antwort', 'quelle']) {
      if (!nichtLeer(g[feld])) fehler.push(`${wo}: ${feld} fehlt – eine Rechtsauskunft ohne Quelle ist keine`);
    }
    if (nichtLeer(g.frage) && !g.frage.trim().endsWith('?')) fehler.push(`${wo}: frage ist keine Frage`);
  }
  // Die Länderantwort muss mindestens zwei Länder nennen - sonst klingt ein
  // Beispiel wie eine bundesweite Regel.
  const laender = gilt.find((g) => g.id === 'g-laender');
  if (!laender) fehler.push('die Frage nach den Länderunterschieden fehlt');
  else {
    const genannt = ['Nordrhein-Westfalen', 'Bayern', 'Berlin', 'Hamburg', 'Sachsen', 'Hessen', 'Brandenburg']
      .filter((l) => laender.antwort.includes(l));
    if (genannt.length < 2) fehler.push(`die Länderantwort nennt nur ${genannt.length} Bundesland/Bundesländer – mit einem klingt es wie eine bundesweite Regel`);
  }

  // --- Die drei Kompetenzbereiche -----------------------------------------
  if (bereiche.length !== 3) fehler.push(`${bereiche.length} Bereiche, die Empfehlung nennt drei`);
  for (const b of bereiche) {
    const wo = `Bereich ${b.id ?? '?'}`;
    for (const feld of ['name', 'wasGemeintIst', 'wasBekanntIst', 'sicherheit', 'quelle']) {
      if (!nichtLeer(b[feld])) fehler.push(`${wo}: ${feld} fehlt`);
    }
  }
  if (!nichtLeer(daten?.bereicheHinweis)) fehler.push('bereicheHinweis fehlt');
  else if (!/nicht\s+abschließende|keine\s+abschließende/.test(daten.bereicheHinweis)) {
    fehler.push('bereicheHinweis sagt nicht, dass die drei Bereiche keine abschließende Liste sind – das sagt die Empfehlung ausdrücklich');
  }

  // --- Die Spielarten ------------------------------------------------------
  if (spielarten.length < 3) fehler.push('zu wenige Spielarten');
  for (const s of spielarten) {
    const wo = `Spielart ${s.id ?? '?'}`;
    if (!ZEICHEN.test(s.zeichen ?? '')) fehler.push(`${wo}: zeichen fehlt`);
    for (const feld of ['name', 'wasEsIst', 'wasSieTun', 'wasEsNichtIst', 'quellBezug']) {
      if (!nichtLeer(s[feld])) fehler.push(`${wo}: ${feld} fehlt`);
    }
    // Jede Spielart muss sagen, was sie NICHT ist - sonst wird aus jeder
    // Spielidee eine Übung.
    if (nichtLeer(s.wasEsNichtIst) && !/[Kk]ein/.test(s.wasEsNichtIst)) {
      fehler.push(`${wo}: wasEsNichtIst grenzt nichts ab`);
    }
  }
  if (!nichtLeer(daten?.spielHinweis)) fehler.push('spielHinweis fehlt');
  else if (!/nicht\s+als\s+Zahl|keine\s+Zahl|nicht\s+gefunden/.test(daten.spielHinweis)) {
    fehler.push('spielHinweis sagt nicht, dass es zur Wirkung des Spielens keine Zahl gibt');
  }

  // --- Die fünf Quellziele ------------------------------------------------
  if (ziele.length !== ZIELE) fehler.push(`${ziele.length} Ziele, nachgezählt sind ${ZIELE}`);
  const nummern = new Set();
  let zurueckgewiesen = 0;
  for (const z of ziele) {
    const wo = `Ziel ${z.nr ?? '?'}`;
    if (!Number.isInteger(z.nr) || z.nr < 1 || z.nr > ZIELE) fehler.push(`${wo}: nr fehlt oder liegt außerhalb`);
    else { if (nummern.has(z.nr)) fehler.push(`${wo}: doppelt`); nummern.add(z.nr); }
    if (!nichtLeer(z.kurz)) fehler.push(`${wo}: kurz fehlt`);
    if (!EINORDNUNGEN.includes(z.einordnung)) { fehler.push(`${wo}: einordnung „${z.einordnung}" ist keine der drei`); continue; }
    if (!nichtLeer(z.warum)) fehler.push(`${wo}: warum fehlt`);
    if (z.einordnung === 'zurueckgewiesen') {
      zurueckgewiesen += 1;
      // Die Zurueckweisung muss das Zurueckgewiesene benennen.
      if (!/diagnostisch|korrektiv/i.test(z.kurz)) fehler.push(`${wo}: der Zieltext benennt die Diagnose nicht, die er zurückweist`);
    }
  }
  for (let n = 1; n <= ZIELE; n += 1) if (!nummern.has(n)) fehler.push(`Quellziel ${n} fehlt`);
  if (zurueckgewiesen !== 1) fehler.push(`${zurueckgewiesen} zurückgewiesene Ziele – genau eines wird zurückgewiesen (das diagnostische)`);
  if (!/diagnostisch/i.test(daten?.quellZielAbgelehnt ?? '')) {
    fehler.push('quellZielAbgelehnt benennt das zurückgewiesene Ziel nicht');
  }

  // --- Die Absaetze --------------------------------------------------------
  for (const feld of ['hinweis', 'wasEsIst', 'warumNichtSchulreif', 'keineBeurteilung', 'quellZielAbgelehnt',
    'wohinMitFragen', 'elterntelefon']) {
    if (!nichtLeer(daten?.[feld])) fehler.push(`${feld} fehlt`);
  }
  if (!/[Ss]chulreif/.test(daten?.warumNichtSchulreif ?? '')) fehler.push('warumNichtSchulreif nennt den Begriff nicht, den es erklärt');
  if (!BEWERTUNG.test(daten?.keineBeurteilung ?? '')) fehler.push('keineBeurteilung benennt die Bewertung nicht, die es ausschließt');
  // Wohin mit Fragen: die drei Stellen müssen dastehen.
  for (const stelle of ['Schulleitung', 'Gesundheitsamt', 'Kinderarzt']) {
    if (!new RegExp(stelle, 'i').test(daten?.wohinMitFragen ?? '')) fehler.push(`wohinMitFragen nennt ${stelle} nicht`);
  }
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

  // --- Die Textnetze -------------------------------------------------------
  for (const [wo, text] of angebotsTexte(daten)) {
    if (SCHULREIF_ALS_URTEIL.test(text)) fehler.push(`${wo}: „schulreif“ als Urteil über ein Kind`);
    if (VORHERSAGE.test(text)) fehler.push(`${wo}: eine Vorhersage über das einzelne Kind`);
    if (BEWERTUNG.test(text)) fehler.push(`${wo}: eine Bewertung`);
    if (WIRKVERSPRECHEN.test(text)) fehler.push(`${wo}: Wirkversprechen`);
    if (KOENNENSALTER.test(text)) fehler.push(`${wo}: eine Altersangabe, ab der ein Kind etwas können soll`);
    if (KYRILLISCH.test(text)) fehler.push(`${wo}: kyrillisch – die Quelle gehört in das Quellfeld`);
  }
  return fehler;
}
