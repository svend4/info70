// Wachstums- und Bewegungsbegleiter (Praleska docs/10, Eltern-Werkzeuge
// Nr. 62, Quelle S. 126-127, Gruppe «ПОЧЕМУЧКИ» = drei bis fünf Jahre; dazu
// S. 222 und S. 224-225, Gruppe «ФАНТАЗЕРЫ» = fünf bis sechs/sieben Jahre).
//
// TRAGENDE ENTSCHEIDUNG: DIE VIER FRAGEN SIND UMGEDREHT.
//
// Die Quelle stellt vier Fragen AN DAS KIND ueber seinen eigenen Koerper:
// «Какая у тебя осанка?» (Wie ist deine Haltung?), «Какие у тебя стопы?»
// (Wie sind deine Fuesse?), «Как быстро ты растешь?» (Wie schnell waechst
// du?), «Сколько ты двигаешься?» (Wie viel bewegst du dich?). Im Kapitel
// fuer die Fuenf- bis Siebenjaehrigen steht es noch deutlicher: das Interesse
// an „mir, meinem Wuchs, Gewicht, meiner Haltung, meinem Fuss, meinem Herz"
// soll geweckt werden.
//
// Ein Vorschulkind, das lernt, seine Haltung mit einer Zeichnung zu
// vergleichen und seinen Fuss auf einem Bild als „platt" zu erkennen, lernt
// vor allem, den eigenen Koerper nach Fehlern abzusuchen. Diese App dreht
// jede der vier Fragen um: aus einer Pruefung am Kind wird eine Frage an die
// Erwachsenen (`wasStattdessen`), und dazu steht, wohin die urspruengliche
// Frage gehoert (`woEsHingehoert`).
//
// WEITERE ENTSCHEIDUNGEN
//
// * KEINE AMPEL, KEINE TAGESSTATISTIK ueber ein Kind. Der Katalogeintrag
//   wollte eine „Bewegungs-Ampel mit Tagesstatistik". Die Orientierungswerte
//   gelten fuer ALTERSGRUPPEN; ein einzelnes Kind daran rot oder gruen zu
//   faerben macht aus einer Empfehlung ein Urteil (docs/02, EU-Verordnung
//   ueber kuenstliche Intelligenz).
// * KEINE KOERPERDATEN. Keine Groesse, kein Gewicht, kein BMI, keine
//   Perzentile - auch nicht lokal. Gemessen wird bei der Vorsorge.
// * KEIN SCHRITTZAEHLER am Kind.
// * JEDE ZAHL MIT QUELLE. Die Handlungsseite der App (Bloecke, Gelegenheiten)
//   traegt UEBERHAUPT KEINE mehrstellige Zahl; jede Zahl steht in
//   `bewegungswerte` oder `werteHinweise`, und dort hat jeder Eintrag seine
//   Quelle und seine Einschraenkung. Das ist pruefbar gemacht, nicht
//   behauptet: `pruefeDaten` weist jede Zahl auf der Handlungsseite ab.
//
// Der Katalogeintrag nennt „WHO/BZgA-Bewegungsempfehlung (180 Min/Tag fuer
// 3-5)". Diese Angabe gibt es so nicht. Die WHO nennt 180 Minuten fuer 1-2
// UND fuer 3-4 Jahre (nur fuer 3-4 mit der Teilmenge von 60 Minuten mittlerer
// bis hoher Intensitaet), die Nationalen Empfehlungen nennen 180 Minuten fuer
// 4-6 Jahre - und ab fuenf gilt bei der WHO eine andere Leitlinie mit 60
// Minuten im Wochendurchschnitt. Die App zeigt die Werte darum GETRENNT,
// jeweils mit Herkunft.
//
// Genauer, nachdem die Gegenprobe den ersten Befund als zu breit zurueckgab:
// einen Altersblock 3-5 gibt es durchaus - das aeltere BZgA-Themenblatt
// fuehrt ihn fuer den Medienkonsum, und die US-Empfehlungen fuehren ihn fuer
// Bewegung mit drei Stunden taeglich. Falsch am Katalogeintrag ist nicht,
// dass es den Block gaebe, sondern die ZUSCHREIBUNG: weder die WHO noch die
// deutschen Empfehlungen verwenden ihn fuer eine Bewegungsempfehlung.

/** Die vier Bloecke in der Reihenfolge der Quelle. */
export const BLOECKE = Object.freeze(['b-haltung', 'b-fuesse', 'b-wachstum', 'b-bewegung']);

/** Die Zielnummern der Quelle: Ziel 1 ist allgemein, 2 bis 5 tragen je eine Frage. */
export const ZIELE = Object.freeze({ gesamt: 5, mitFrage: 4 });

/**
 * Eine Ampel, ein Punktwert, ein Prozentsatz. Laeuft NICHT ueber `keineAmpel`:
 * dieses Feld muss die Ampel benennen, um sie auszuschliessen - Falle A,
 * dreiundzwanzigstes Mal in diesem Projekt.
 */
export const AMPEL = /\bAmpel\w*|\b(?:rot|grün|gelb)(?:e|er|es)?\s+(?:Tag|Woche|Bereich|Stufe)|\b\d+\s*(?:von|\/)\s*\d+\s*Punkt|\bProzent\b|\d\s*%/i;

/** Eine Einstufung des Kindes - auch die freundlich gemeinte. */
export const EINSTUFUNG = /(?:un)?sportlich\w*|(?:un)?begabt\w*|\b(?:Niveau|Stufe\s+\d|auffällig\w*|normal\s+für|zurück\s+für\s+sein\s+Alter)|\b(?:Ihr|das)\s+Kind\s+(?:bewegt\s+sich|ist|wirkt)\s+zu\s+(?:wenig|viel|dick|dünn|klein|groß)/i;

/** Koerpermasse. Gehoeren in das gelbe Heft, nicht in diese App. */
export const KOERPERMASS = /\bBMI\b|\bPerzentil\w*|\bBody-Mass\b|\bGewichtskurve\b|\bWachstumskurve\b|\b\d+\s*(?:cm|kg|Zentimeter|Kilo)\b/i;

/** Ein Wirkversprechen - besonders das zum Wachsen. */
export const WIRKVERSPRECHEN = /\b(?:macht|machen|lässt)\b[^.!?]{0,25}\b(?:größer|wachsen)\b|\b(?:fördert|verbessert|stärkt|trainiert|korrigiert)\b[^.!?]{0,30}\b(?:Wachstum|Haltung|Fußgewölbe|Entwicklung)\b|\bbeugt\b[^.!?]{0,25}\bvor\b/i;

/** Eine mehrstellige Zahl. Auf der Handlungsseite ist jede davon falsch am
 *  Platz: Zahlen gehoeren zu `bewegungswerte`, und dort zu ihrer Quelle. */
export const MEHRSTELLIGE_ZAHL = /\d\s*\d/;

const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;
const ZEICHEN = /\p{Extended_Pictographic}/u;
const KYRILLISCH = /[Ѐ-ӿ]/;

export const blockVon = (daten, id) => (daten?.bloecke ?? []).find((b) => b.id === id) ?? null;
export const wertVon = (daten, id) => (daten?.bewegungswerte ?? []).find((w) => w.id === id) ?? null;

/**
 * Die Stellen, die ausdruecklich NICHT durch die Textnetze laufen - jede mit
 * ihrem Grund. Alles andere wird geprueft. Gleiche Umkehrung wie in Nr. 60
 * und Nr. 61: eine vergessene Luecke sieht sonst aus wie eine gewollte.
 */
export const NICHT_GEPRUEFT = Object.freeze({
  warumUmgedreht: 'zitiert das Ziel der Quelle, samt „Gewicht"',
  keineAmpel: 'muss die Ampel, die Punkte und den Prozentwert nennen, um sie auszuschließen',
  keinSchrittzaehler: 'muss den Schrittzähler und die Schrittzahl nennen, um sie auszuschließen',
  keinWachstumstrick: 'muss die Wachstumsübung nennen, um sie abzulehnen',
  keinKoerperdatum: 'muss BMI und Perzentile nennen, um sie auszuschließen',
  bewegungswerte: 'die Orientierungswerte – jeder mit Quelle und Einschränkung',
  fachliches: 'belegte Sätze mit Leitlinienangabe – die Registernummer ist eine Zahl',
  werteHinweise: 'Herkunft, Stand und Grenzen der Werte, mit Jahreszahlen',
  ausgeschlossen: 'die Ausschlussliste benennt, was sie ausschließt',
  quelle: 'Werk, Rechte und Zählung – russisch und mit Zahlen',
  elterntelefon: 'enthält die Telefonnummer',
  art: 'die Kennung der App, kein Text für Eltern',
  version: 'eine Zahl, kein Text',
});

/** Alle Texte, die die App zeigt und die ein Netz sehen muss - der REST. */
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

/** Die Handlungsseite: was die App als TUN anbietet. Hier ist zusaetzlich
 *  jede mehrstellige Zahl verboten. */
export function handlungsTexte(daten) {
  const t = [];
  for (const b of daten?.bloecke ?? []) {
    for (const feld of ['name', 'quellFrage', 'wasDieQuelleWill', 'nichtUebernommen', 'wasStattdessen', 'woEsHingehoert']) {
      if (nichtLeer(b[feld])) t.push([`Block ${b.id} ${feld}`, b[feld]]);
    }
  }
  for (const g of daten?.gelegenheiten ?? []) if (nichtLeer(g.text)) t.push([`Gelegenheit ${g.id}`, g.text]);
  return t;
}

/** Welche Orientierungswerte zu einem Alter gehoeren. Mehrere sind der
 *  Normalfall und kein Fehler - die Quellen ueberschneiden sich. */
export function werteFuerAlter(daten, jahre) {
  const passt = {
    'w-who34': (a) => a >= 3 && a <= 4,
    'w-nebb46': (a) => a >= 4 && a <= 6,
    'w-who5': (a) => a >= 5,
    'w-nebb611': (a) => a >= 6,
  };
  return (daten?.bewegungswerte ?? []).filter((w) => passt[w.id]?.(jahre));
}

export function pruefeDaten(daten) {
  const fehler = [];
  const bloecke = daten?.bloecke ?? [];
  const werte = daten?.bewegungswerte ?? [];
  const gelegenheiten = daten?.gelegenheiten ?? [];
  const aus = daten?.ausgeschlossen ?? [];

  // --- Die vier umgedrehten Fragen ----------------------------------------
  if (bloecke.length !== BLOECKE.length) fehler.push(`${bloecke.length} Blöcke, erwartet ${BLOECKE.length}`);
  bloecke.forEach((b, i) => {
    const wo = `Block ${b.id ?? '?'}`;
    if (BLOECKE[i] !== b.id) fehler.push(`${wo}: steht an Stelle ${i + 1}, dort gehört ${BLOECKE[i]} hin`);
    if (!ZEICHEN.test(b.zeichen ?? '')) fehler.push(`${wo}: zeichen fehlt`);
    for (const feld of ['name', 'quellFrage', 'wasDieQuelleWill', 'nichtUebernommen', 'wasStattdessen', 'woEsHingehoert']) {
      if (!nichtLeer(b[feld])) fehler.push(`${wo}: ${feld} fehlt`);
    }
    // Die Umdrehung ist die Zusage dieser App: jeder Block muss eine Frage an
    // die ERWACHSENEN stellen, nicht eine Feststellung am Kind.
    if (nichtLeer(b.wasStattdessen) && !/Die Frage an die Erwachsenen lautet/.test(b.wasStattdessen)) {
      fehler.push(`${wo}: wasStattdessen stellt keine Frage an die Erwachsenen – genau das ist die Umdrehung`);
    }
    if (!Number.isInteger(b.quellZiel) || b.quellZiel < 2 || b.quellZiel > ZIELE.gesamt) {
      fehler.push(`${wo}: quellZiel ${b.quellZiel} liegt nicht zwischen 2 und ${ZIELE.gesamt}`);
    }
  });
  const ziele = new Set(bloecke.map((b) => b.quellZiel));
  for (let n = 2; n <= ZIELE.gesamt; n += 1) if (!ziele.has(n)) fehler.push(`Quellziel ${n} hat keinen Block`);

  // --- Die Orientierungswerte: keine Zahl ohne Quelle und ohne Grenze -----
  if (werte.length < 3) fehler.push('zu wenige Orientierungswerte – die Quellen unterscheiden mehrere Altersblöcke');
  for (const w of werte) {
    const wo = `Wert ${w.id ?? '?'}`;
    for (const feld of ['alter', 'wert', 'quelle', 'einschraenkung']) {
      if (!nichtLeer(w[feld])) fehler.push(`${wo}: ${feld} fehlt`);
    }
    // Eine Zahl braucht ihre Herkunft - und die Herkunft braucht ein Jahr.
    if (nichtLeer(w.wert) && /\d/.test(w.wert) && !/\b(?:19|20)\d\d\b/.test(w.quelle ?? '')) {
      fehler.push(`${wo}: nennt eine Zahl, aber die Quelle trägt kein Jahr`);
    }
  }
  // Jedes Alter der Zielgruppe muss mindestens einen Wert finden.
  for (const jahre of [3, 4, 5, 6, 7]) {
    if (!werteFuerAlter(daten, jahre).length) fehler.push(`für ${jahre} Jahre gibt es keinen Orientierungswert`);
  }
  if (!nichtLeer(daten?.werteHinweise?.ueberschneidung)) fehler.push('werteHinweise.ueberschneidung fehlt – die Quellen überschneiden sich bei sechs Jahren');
  for (const feld of ['stand', 'bioeg', 'keinGrenzwert']) {
    if (!nichtLeer(daten?.werteHinweise?.[feld])) fehler.push(`werteHinweise.${feld} fehlt`);
  }
  // Die Behoerde heisst seit Februar 2025 anders - mit dem alten Namen dazu,
  // sonst findet niemand das Material wieder.
  if (!/BIÖG/.test(daten?.werteHinweise?.bioeg ?? '') || !/BZgA|Bundeszentrale/.test(daten?.werteHinweise?.bioeg ?? '')) {
    fehler.push('werteHinweise.bioeg nennt nicht beide Namen der Behörde');
  }

  // --- Belegte Saetze: jeder mit Leitlinie, Jahr und zugehoerigem Block ---
  const fach = daten?.fachliches ?? [];
  if (fach.length < 3) fehler.push('zu wenige belegte Sätze – eine Umdrehung ohne Beleg ist eine Meinung');
  for (const f of fach) {
    const wo = `Beleg ${f.id ?? '?'}`;
    if (!nichtLeer(f.aussage)) fehler.push(`${wo}: aussage fehlt`);
    if (!nichtLeer(f.quelle)) fehler.push(`${wo}: quelle fehlt`);
    else if (!/\b(?:19|20)\d\d\b/.test(f.quelle)) fehler.push(`${wo}: die Quelle trägt kein Jahr`);
    if (!blockVon(daten, f.block)) fehler.push(`${wo}: gehört zu keinem Block (${f.block})`);
  }

  if (gelegenheiten.length < 6) fehler.push('zu wenige Gelegenheiten');
  for (const g of gelegenheiten) {
    if (!ZEICHEN.test(g.zeichen ?? '')) fehler.push(`Gelegenheit ${g.id ?? '?'}: zeichen fehlt`);
    if (!nichtLeer(g.text)) fehler.push(`Gelegenheit ${g.id ?? '?'}: text fehlt`);
  }
  // Eine Gelegenheit muss auch das Nichtstun erlauben, sonst ist die Liste
  // eine Pflichtenliste.
  if (!gelegenheiten.some((g) => /Ruhe|nicht jeder Tag/.test(g.text ?? ''))) {
    fehler.push('keine Gelegenheit lässt Ruhe zu – dann ist die Liste eine Pflichtenliste');
  }

  // --- Die Absaetze, die die App über sich selbst sagt --------------------
  for (const feld of ['hinweis', 'wasEsIst', 'warumUmgedreht', 'keineAmpel', 'keinSchrittzaehler',
    'keinWachstumstrick', 'keinKoerperdatum', 'elterntelefon']) {
    if (!nichtLeer(daten?.[feld])) fehler.push(`${feld} fehlt`);
  }
  // Die Netze in der Gegenrichtung: eine Zurueckweisung, die das
  // Zurueckgewiesene nicht benennt, ist keine.
  if (!AMPEL.test(daten?.keineAmpel ?? '')) fehler.push('keineAmpel benennt die Ampel nicht, die es ausschließt');
  if (!/Schrittzähler/.test(daten?.keinSchrittzaehler ?? '')) fehler.push('keinSchrittzaehler benennt den Schrittzähler nicht');
  if (!KOERPERMASS.test(daten?.keinKoerperdatum ?? '')) fehler.push('keinKoerperdatum benennt die Körpermaße nicht');
  if (!WIRKVERSPRECHEN.test(daten?.keinWachstumstrick ?? '')) fehler.push('keinWachstumstrick benennt das Wachstumsversprechen nicht');

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

  // --- Die Textnetze ------------------------------------------------------
  for (const [wo, text] of angebotsTexte(daten)) {
    if (AMPEL.test(text)) fehler.push(`${wo}: Ampel, Punkte oder Prozent`);
    if (EINSTUFUNG.test(text)) fehler.push(`${wo}: stuft ein Kind ein`);
    if (KOERPERMASS.test(text)) fehler.push(`${wo}: ein Körpermaß`);
    if (WIRKVERSPRECHEN.test(text)) fehler.push(`${wo}: Wirkversprechen`);
    if (KYRILLISCH.test(text)) fehler.push(`${wo}: kyrillisch – die Quelle gehört in das Quellfeld`);
  }
  // Auf der Handlungsseite zusaetzlich: keine mehrstellige Zahl.
  for (const [wo, text] of handlungsTexte(daten)) {
    if (MEHRSTELLIGE_ZAHL.test(text)) fehler.push(`${wo}: eine mehrstellige Zahl – Zahlen gehören zu ihrer Quelle`);
  }
  return fehler;
}
