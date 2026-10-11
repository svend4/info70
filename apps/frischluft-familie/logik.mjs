// Frischluft-Familie (Praleska docs/10, Eltern-Werkzeuge Nr. 63, Quelle
// S. 125: «Закаливание (обязательные мероприятия)», Gruppe «ПОЧЕМУЧКИ» =
// drei bis fünf Jahre).
//
// TRAGENDE ENTSCHEIDUNG: DIE BILANZ IST SCHAERFER ALS DER AUFTRAG.
//
// Der Katalogeintrag wollte die acht Massnahmen „evidenzbasiert gefiltert"
// uebernehmen - mit der Einordnung, was die deutsche Praeventionsempfehlung
// STUETZT und was nicht. Beim Pruefen ist herausgekommen: KEINE der acht ist
// als Infektvorbeugung bei Kindern von drei bis fuenf Jahren belegt. Die
// einzige randomisierte Studie mit Kindern dieses Alters und haeufigen
// Erkaeltungen fand ueber zwoelf Monate keinen Unterschied, und ein
// Uebersichtsartikel zur Kneipp-Therapie haelt ausdruecklich fest,
// wechselwarme Anwendungen truegen „bei Erwachsenen - nicht jedoch bei
// Kindern" zur Abhaertung bei.
//
// Die App sagt das zuerst (`dieEhrlicheBilanz`) und ordnet dann jede der acht
// Massnahmen ein. Drei sind aus ANDEREN Gruenden gut - draussen sein, Haende
// waschen, barfuss laufen -, drei gelten nur mit Einschraenkung, zwei sind
// nicht uebernommen. Der Validator erzwingt, dass jede Einordnung eine
// deutsche Quelle traegt: eine Empfehlung ohne Quelle ist in dieser App keine.
//
// WEITERE ENTSCHEIDUNGEN
//
// * KEINE AUSWERTUNG. Der Eintrag nannte eine „Checkliste". Es gibt hier
//   nichts anzukreuzen: keine Punkte, keine Stufe, keine Ampel, kein
//   Ergebnis - weder ueber ein Kind noch ueber eine Familie (docs/02,
//   EU-Verordnung ueber kuenstliche Intelligenz). Bei Massnahmen ohne Belege
//   waere eine Bewertung doppelt sinnlos.
// * KEINE DOSIERUNG fuer kalte Anwendungen. Es gibt Arbeiten mit kleinen
//   Teilanwendungen bei Kindern (Gesichtwaschen, Armbad, Fussbad,
//   Wassertreten, Sekunden bis wenige Minuten); die juengste ist ein noch
//   nicht begutachteter Vorabdruck, bei dem die Zufallszuteilung aufgegeben
//   werden musste. Eine Sekundenangabe daraus waere eine Genauigkeit, die es
//   nicht gibt.
// * WAS OFT DAZUGEZAEHLT WIRD, steht auch da: kalte Guesse, Sauna und
//   Sonnenbaeder kommen in der Quelle gar nicht vor, aber in den Koepfen -
//   und alle drei sind nicht zu empfehlen.
// * DIE APP SPEICHERT NICHTS. Es gibt nichts zu speichern.

/** Die drei Einordnungen - geschlossene Liste. */
export const EINORDNUNGEN = Object.freeze(['belegtAnders', 'nurEingeschraenkt', 'nichtUebernommen']);

/** Wie viele Punkte die Quelle auffuehrt (nachgezaehlt S. 125). */
export const MASSNAHMEN = 8;

/**
 * Ein Versprechen zur Wirkung. Laeuft NICHT ueber `dieEhrlicheBilanz`,
 * `keinVersaeumnis` und die Ausschlussliste: die muessen den Satz
 * „Abhaertung staerkt das Immunsystem" zitieren koennen, um ihn abzuweisen -
 * Falle A, vierundzwanzigstes Mal in diesem Projekt.
 */
export const WIRKVERSPRECHEN = /\b(?:stärkt|kräftigt|trainiert|verbessert|steigert)\b[^.!?]{0,40}\b(?:Immunsystem|Abwehr\w*|Immunabwehr)\b|\bbeug(?:t|en)\b[^.!?]{0,30}\b(?:Infekt\w*|Erkältung\w*)\b[^.!?]{0,10}\bvor\b|\b(?:seltener|weniger\s+oft)\s+krank\b|\bschützt\s+vor\s+(?:Erkältung|Infekt)/i;

/** Eine Bewertung der Familie oder des Kindes. */
export const BEWERTUNG = /\bAmpel\w*|\b\d+\s*(?:von|\/)\s*\d+\s*Punkt|\bProzent\b|\d\s*%|\bStufe\s+\d|\b(?:gut|schlecht)\s+abgeschnitten|\bErgebnis\s+Ihrer\s+Familie/i;

/**
 * Eine Anwendungsdauer. Getroffen wird die Konstruktion ZAHL + Zeiteinheit,
 * und zwar auch AUSGESCHRIEBEN: „fünf bis zwanzig Minuten" steht so in der
 * Quelle, und eine Regel, die nur Ziffern kennt, haette das durchgelassen -
 * dieselbe Falle wie bei den Altersangaben in Nr. 57 (Review Welle 80).
 *
 * Die Gradangabe der Nacht ist NICHT getroffen: „nicht waermer als achtzehn
 * Grad" ist belegt (BIOeG) und gehoert in den Rat. Draussen bleiben soll die
 * Anwendungsdauer, fuer die es keine belastbare Angabe gibt.
 */
export const DOSIERUNG = /(?:\d+|ein(?:e|en)?|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|fünfzehn|zwanzig|dreißig)\s*(?:bis\s*(?:\d+|zwei|drei|vier|fünf|zehn|fünfzehn|zwanzig|dreißig)\s*)?(?:Sekunden?|Minuten?)\b/i;

/** Ein Gerät oder eine Anschaffung. */
export const ANSCHAFFUNG = /\bkaufen\b|\bbestellen\b|\banschaffen\b|\bRippenbrett\b|\bSaunaofen\b/i;

const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;
const ZEICHEN = /\p{Extended_Pictographic}/u;
const KYRILLISCH = /[Ѐ-ӿ]/;

export const massnahmeVon = (daten, id) => (daten?.massnahmen ?? []).find((m) => m.id === id) ?? null;

/**
 * Die Stellen, die ausdruecklich NICHT durch die Textnetze laufen - jede mit
 * ihrem Grund. Alles andere wird geprueft. Gleiche Umkehrung wie in Nr. 60
 * bis Nr. 62.
 */
export const NICHT_GEPRUEFT = Object.freeze({
  dieEhrlicheBilanz: 'muss das Wirkversprechen nennen, um es abzuweisen',
  keinVersaeumnis: 'nennt, was belegt hilft, und grenzt es gegen die Abhärtung ab',
  keineBewertung: 'muss Punkte, Stufe und Ampel nennen, um sie auszuschließen',
  ausgeschlossen: 'die Ausschlussliste benennt, was sie ausschließt',
  quelle: 'Werk, Rechte und Zählung – russisch und mit Zahlen',
  einordnungen: 'die drei Überschriften der Einordnung',
  elterntelefon: 'enthält die Telefonnummer',
  art: 'die Kennung der App, kein Text für Eltern',
  version: 'eine Zahl, kein Text',
});

/**
 * Einzelne FELDER innerhalb der Listen, die ausgenommen sind - nicht die
 * ganze Liste. Eine ganze Liste auszunehmen, weil EIN Feld darin zitiert,
 * nimmt alle anderen gleich mit: `wasStattdessen` ist ein Rat und muss durch
 * die Netze. Gelernt beim Bau dieser App.
 */
export const NICHT_GEPRUEFT_FELDER = Object.freeze({
  quellText: 'der Wortlaut der Quelle, samt ihrer Zahlen',
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
  return t.filter(([wo]) => !(wo.split('.').at(-1) in NICHT_GEPRUEFT_FELDER));
}

/** Die RATSCHLAEGE der App: was sie Eltern zu tun vorschlaegt. Hier ist
 *  zusaetzlich jede Dosierung verboten - die Zahlen der Quelle stehen im
 *  Zitat, nicht im Rat. */
export function ratschlagTexte(daten) {
  const t = [];
  for (const m of daten?.massnahmen ?? []) {
    if (nichtLeer(m.wasStattdessen)) t.push([`Maßnahme ${m.id} wasStattdessen`, m.wasStattdessen]);
  }
  for (const h of daten?.wasWirklichHilft ?? []) {
    if (nichtLeer(h.was)) t.push([`Hilft ${h.id} was`, h.was]);
    if (nichtLeer(h.warum)) t.push([`Hilft ${h.id} warum`, h.warum]);
  }
  return t;
}

export function pruefeDaten(daten) {
  const fehler = [];
  const massnahmen = daten?.massnahmen ?? [];
  const dazu = daten?.oftDazugezaehlt ?? [];
  const hilft = daten?.wasWirklichHilft ?? [];
  const aus = daten?.ausgeschlossen ?? [];

  // --- Die acht Punkte der Quelle -----------------------------------------
  if (massnahmen.length !== MASSNAHMEN) fehler.push(`${massnahmen.length} Maßnahmen, nachgezählt sind ${MASSNAHMEN}`);
  const nummern = new Set();
  for (const m of massnahmen) {
    const wo = `Maßnahme ${m.id ?? '?'}`;
    if (!ZEICHEN.test(m.zeichen ?? '')) fehler.push(`${wo}: zeichen fehlt`);
    if (!Number.isInteger(m.nr) || m.nr < 1 || m.nr > MASSNAHMEN) fehler.push(`${wo}: nr fehlt oder liegt außerhalb`);
    else {
      if (nummern.has(m.nr)) fehler.push(`${wo}: nr ${m.nr} doppelt`);
      nummern.add(m.nr);
    }
    if (!nichtLeer(m.quellText)) fehler.push(`${wo}: quellText fehlt – die Quelle muss im Wortlaut dastehen`);
    if (!EINORDNUNGEN.includes(m.einordnung)) { fehler.push(`${wo}: einordnung „${m.einordnung}" ist keine der drei`); continue; }
    if (!nichtLeer(m.warum)) fehler.push(`${wo}: warum fehlt`);
    // Das ist die Zusage dieser App: keine Einordnung ohne benennbare Quelle.
    if (!nichtLeer(m.quelle)) fehler.push(`${wo}: quelle fehlt – eine Einordnung ohne Quelle ist eine Meinung`);
    // Wer etwas empfiehlt, muss sagen, was zu tun ist.
    if (m.einordnung !== 'nichtUebernommen' && !nichtLeer(m.wasStattdessen)) {
      fehler.push(`${wo}: wasStattdessen fehlt`);
    }
  }
  for (let n = 1; n <= MASSNAHMEN; n += 1) if (!nummern.has(n)) fehler.push(`Punkt ${n} der Quelle fehlt`);
  if (daten?.quelle?.zahlen?.massnahmen !== MASSNAHMEN) fehler.push('quelle.zahlen.massnahmen stimmt nicht');

  // --- Was oft dazugezaehlt wird ------------------------------------------
  if (dazu.length < 3) fehler.push('zu wenige Einträge unter „oft dazugezählt“ – Sauna, Güsse und Sonnenbäder gehören benannt');
  for (const d of dazu) {
    const wo = `Dazugezählt ${d.id ?? '?'}`;
    for (const feld of ['was', 'urteil', 'warum', 'quelle']) if (!nichtLeer(d[feld])) fehler.push(`${wo}: ${feld} fehlt`);
  }

  // --- Was wirklich hilft: jede Aussage mit ihrer Einschraenkung ----------
  if (hilft.length < 3) fehler.push('zu wenige belegte Maßnahmen');
  for (const h of hilft) {
    const wo = `Hilft ${h.id ?? '?'}`;
    for (const feld of ['was', 'warum', 'einschraenkung', 'quelle']) {
      if (!nichtLeer(h[feld])) fehler.push(`${wo}: ${feld} fehlt – auch das Belegte hat eine Grenze`);
    }
  }

  // --- Die Absaetze, die die App über sich selbst sagt --------------------
  for (const feld of ['hinweis', 'wasEsIst', 'dieEhrlicheBilanz', 'keinVersaeumnis', 'keineBewertung',
    'warumTrotzdem', 'elterntelefon']) {
    if (!nichtLeer(daten?.[feld])) fehler.push(`${feld} fehlt`);
  }
  // Die Netze in der Gegenrichtung.
  if (!WIRKVERSPRECHEN.test(daten?.dieEhrlicheBilanz ?? '') && !WIRKVERSPRECHEN.test(daten?.keinVersaeumnis ?? '')) {
    fehler.push('weder dieEhrlicheBilanz noch keinVersaeumnis benennt das Wirkversprechen, das die App abweist');
  }
  if (!BEWERTUNG.test(daten?.keineBewertung ?? '')) fehler.push('keineBewertung benennt die Bewertung nicht, die es ausschließt');
  // Die Bilanz muss die Richtung sagen, nicht nur Einzelurteile.
  if (!/Keine der acht/i.test(daten?.dieEhrlicheBilanz ?? '')) {
    fehler.push('dieEhrlicheBilanz sagt nicht, dass keine der acht Maßnahmen belegt ist – das ist der Befund');
  }
  for (const feld of Object.keys(NICHT_GEPRUEFT)) {
    if (!(feld in (daten ?? {}))) fehler.push(`NICHT_GEPRUEFT nennt ${feld}, das es in den Daten nicht gibt`);
  }
  // Auch das ausgenommene Einzelfeld muss es geben.
  for (const feld of Object.keys(NICHT_GEPRUEFT_FELDER)) {
    if (!massnahmen.some((m) => feld in m)) fehler.push(`NICHT_GEPRUEFT_FELDER nennt ${feld}, das keine Maßnahme trägt`);
  }
  if (aus.length < 4) fehler.push('die Ausschlussliste ist zu kurz');
  for (const x of aus) {
    if (!nichtLeer(x.quellNr) || !nichtLeer(x.was) || !nichtLeer(x.warum)) fehler.push(`Ausschluss ${x.quellNr ?? '?'}: unvollständig`);
  }
  if (daten?.quelle?.geprueft !== true) fehler.push('quelle.geprueft ist nicht true');
  for (const feld of ['werk', 'rechte', 'nachgezaehlt', 'abweichung']) {
    if (!nichtLeer(daten?.quelle?.[feld])) fehler.push(`quelle.${feld} fehlt`);
  }

  // --- Die Textnetze ------------------------------------------------------
  for (const [wo, text] of angebotsTexte(daten)) {
    if (WIRKVERSPRECHEN.test(text)) fehler.push(`${wo}: Wirkversprechen`);
    if (BEWERTUNG.test(text)) fehler.push(`${wo}: Bewertung`);
    if (KYRILLISCH.test(text)) fehler.push(`${wo}: kyrillisch – die Quelle gehört in das Quellfeld`);
  }
  // Im RAT steht keine Dosierung: die Zahlen der Quelle stehen im Zitat.
  for (const [wo, text] of ratschlagTexte(daten)) {
    if (DOSIERUNG.test(text)) fehler.push(`${wo}: eine Dosierung – für kalte Anwendungen gibt es keine belastbare`);
    if (ANSCHAFFUNG.test(text)) fehler.push(`${wo}: eine Anschaffung`);
  }
  return fehler;
}
