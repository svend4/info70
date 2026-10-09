// Sicherer-Krabbelraum-Check – reine Logik (ohne DOM), testbar.
// Werkzeug für Eltern, Kindertagespflege und Krippe. Praleska docs/10
// (Eltern-Werkzeuge Nr. 50), Quelle «Обеспечение безопасности», S. 34
// (4 Sicherheits- und Umgebungsziele).
//
// Tragende Entscheidung: dieser Check schaut auf den RAUM. Jedes Kriterium
// hat einen Raum, einen Gegenstand oder eine Handlung daran als Gegenstand –
// keines beschreibt, was das Kind kann, und keines bewertet den Erwachsenen.
// Das DRITTE Quellziel («psychische Geborgenheit») ist deshalb in prüfbare
// Raum-Eigenschaften übersetzt: ruhige Ecke, Blickachse, Abdunkelbarkeit,
// Zugluftfreiheit. Eine Checkbox „mein Kind fühlt sich geborgen“ wäre eine
// Beurteilung von Person und Bindung.
//
// Zweite Entscheidung: es gibt KEINE Gesamtwertung. Dieses Modul exportiert
// absichtlich keine Funktion, die über alle Kriterien summiert – „die
// Wohnung ist zu 82 Prozent sicher“ ist eine falsche Aggregation nicht
// austauschbarer Risiken und eine Einladung, aufzuhören.
//
// Politik docs/02: keine externen Anfragen; ein localStorage-Schlüssel,
// löschbar.

/** Die drei Profile. Kindertagespflege ist eigenständig: Privatwohnung mit
 *  beruflicher Verantwortung und eigenem Unfallversicherungsträger. */
export const PROFILE = Object.freeze(['zuhause', 'tagespflege', 'krippe']);

/** `einmal` ist ein Handgriff am Raum und abhakbar. `immer` ist eine Regel
 *  für jedes Mal – und darum NICHT abhakbar: ein Haken daran würde eine
 *  Dauerregel als erledigt ausgeben. */
export const ARTEN = Object.freeze(['einmal', 'immer']);

/** Kriterium als Beobachtung über das KIND – genau die wahrscheinlichste
 *  Abdrift, weil meilenstein-begleiter dieselbe Zielgruppe hat. */
const KIND_ALS_SUBJEKT = /^(Dein|Ihr|Das|Mein)\s+(Kind|Baby|Säugling)\b|^Es\s+(kann|schläft|robbt|krabbelt|sitzt|zieht|fühlt|ist\s+(schon|bereits))\b|\b(Kind|Baby|Säugling)\s+(kann|schläft durch|robbt schon|krabbelt schon|zieht sich schon|sitzt schon|ist schon)\b|\bfühlt sich .* geborgen\b/i;

/** Erste Hilfe gehört nicht in eine Raum-Checkliste. */
const ERSTE_HILFE = /Heimlich|Erbrechen ausl|Salzwasser|Milch zum Neutralisieren|Reanimation|Mund-zu-Mund|Honig/i;

/** Technik ist kein Sicherheitsmerkmal eines Raums. */
const UEBERWACHUNG = /Babyphone|Sensormatte|Atemmonitor|Wearable|Pulsoximeter|Überwachungskamera/i;

/** Ausnahmeklausel – im Schlaf-Abschnitt lebensgefährlich. */
const AUSNAHME = /\bsobald\b|\bsolange\b|\bab dem\b|ist (okay|in Ordnung), (wenn|sobald)|spätestens wenn/i;

/**
 * Eine Telefonnummer, die nicht 112 ist, wird nicht aus dem Gedächtnis
 * gedruckt. Der Kandidat fasst die GANZE Nummer (mehrere Trenner erlaubt)
 * und wird auf Ziffern normalisiert verglichen – die erste Fassung brach
 * nach der ersten Gruppe ab, traf von „0800 111 0 550“ nur „0800 111“ und
 * machte damit die Ausnahme für das Elterntelefon zu totem Code. Die
 * Längenschranke hält Datums- und Regelnummern (07/2019, 102-602) heraus.
 */
const FREMDE_NUMMER = /(?:\+49|\(0\)|0)[\d\s./()-]{7,}\d/g;
/** Nummern, die hier stehen dürfen. Normalisiert verglichen. */
const ERLAUBTE_NUMMERN = Object.freeze(['112', '08001110550']);
const nurZiffern = (s) => String(s).replace(/\D/g, '');

/** Ein Kriterium holen. */
export function kriteriumVon(daten, id) {
  return (daten?.kriterien ?? []).find((k) => k.id === id) ?? null;
}

/** Gilt das Kriterium für dieses Profil? */
export function giltFuer(kriterium, profil) {
  return (kriterium?.giltFuer ?? []).includes(profil);
}

/**
 * Die Fähigkeiten sind eine LEITER, kein Satz unabhängiger Schalter: wer
 * läuft, erreicht alles, was ein robbendes Kind erreicht.
 *
 * Die erste Fassung filterte mit `an.has(k.ausloeser)`, also auf genaue
 * Übereinstimmung – und damit zeigte die höchste Stufe die WENIGSTEN
 * Zeilen. Gemessen: ein Kind, das an Möbeln läuft, bekam 20 Zeilen ohne
 * Treppenschutzgitter, ohne Knopfzellen und ohne Steckdosen, während ein
 * robbendes 26 bekam. Das ist der schlimmste Fehler, den eine Gefahrenliste
 * machen kann, und er war unsichtbar, weil jede einzelne Zeile stimmte.
 */
export const LEITER = Object.freeze([
  'dreht-sich', 'robbt-kriecht', 'sitzt-frei', 'zieht-sich-hoch', 'laeuft-an-moebeln',
]);

/** Alle Stufen bis zur höchsten gewählten – einschließlich. */
export function stufenBis(ausloeser = []) {
  const hoechste = Math.max(-1, ...ausloeser.map((a) => LEITER.indexOf(a)));
  return ['immer', ...LEITER.slice(0, hoechste + 1)];
}

/**
 * Die Kriterien für ein Profil und die beobachteten Fähigkeiten. Die
 * Auslöser sind beobachtbare Fähigkeiten, keine Monate: ein
 * Treppenschutzgitter ist für ein Neugeborenes irrelevant und für ein
 * robbendes Kind dringend – aber für ein laufendes erst recht.
 */
export function kriterienFuer(daten, profil, ausloeser = ['immer']) {
  const an = new Set([...stufenBis(ausloeser), ...ausloeser]);
  return (daten?.kriterien ?? []).filter((k) => giltFuer(k, profil) && an.has(k.ausloeser));
}

/** Nur `einmal`-Kriterien sind abhakbar. */
export function istAbhakbar(kriterium) {
  return kriterium?.art === 'einmal';
}

/** Die Bereiche in Anzeigereihenfolge – der Schlafplatz steht zuerst. */
export function bereicheInReihenfolge(daten) {
  const b = [...(daten?.bereiche ?? [])];
  return b.sort((x, y) => Number(Boolean(y.zuerst)) - Number(Boolean(x.zuerst)));
}

/**
 * Die offenen Punkte, nach Dringlichkeit geordnet: kritische zuerst, dann
 * die übrigen `einmal`-Punkte. `immer`-Regeln erscheinen NIE als offen –
 * sie sind nicht abhakbar und damit auch nicht erledigbar.
 */
export function offenePunkte(daten, profil, ausloeser, erledigt = {}) {
  const liste = kriterienFuer(daten, profil, ausloeser).filter(istAbhakbar).filter((k) => !erledigt[k.id]);
  return liste.sort((a, b) => Number(Boolean(b.kritisch)) - Number(Boolean(a.kritisch)));
}

/** Die Dauerregeln für dieses Profil – als Erinnerung, nicht als Liste zum Abhaken. */
export function dauerregeln(daten, profil, ausloeser) {
  return kriterienFuer(daten, profil, ausloeser).filter((k) => !istAbhakbar(k));
}

/**
 * Der Bericht. Eine Liste der offenen Punkte und der Dauerregeln – KEIN
 * Gesamtwert, keine Quote, keine Ampel, kein „bestanden“. Dass die Liste
 * leer ist, heißt ausdrücklich nicht, dass der Raum sicher ist.
 */
export function bericht(daten, profil, ausloeser, erledigt = {}) {
  const offen = offenePunkte(daten, profil, ausloeser, erledigt);
  const regeln = dauerregeln(daten, profil, ausloeser);
  const name = (daten.profile.find((p) => p.id === profil) ?? {}).name ?? profil;
  const zeilen = [
    `Sicherer Krabbelraum – ${name}`,
    '',
    daten.hinweis,
    '',
    daten.keinErgebnis,
    '',
  ];
  const kritisch = offen.filter((k) => k.kritisch);
  if (kritisch.length) {
    zeilen.push('## Das zuerst');
    for (const k of kritisch) zeilen.push(`– ${k.was}`, `  Warum: ${k.warum}`);
    zeilen.push('');
  }
  const rest = offen.filter((k) => !k.kritisch);
  if (rest.length) {
    zeilen.push('## Das ist noch offen');
    for (const k of rest) zeilen.push(`– ${k.was}`);
    zeilen.push('');
  }
  if (!offen.length) zeilen.push('## Nichts offen aus dieser Liste', '');
  zeilen.push('## Regeln für jedes Mal (nicht abhakbar)');
  for (const k of regeln) zeilen.push(`– ${k.was}`);
  zeilen.push('', daten.nichtFertig, '', daten.keineErsteHilfe, '', daten.gift, '', daten.quellenHinweis);
  return zeilen.join('\n');
}

/** Validiert die Kriterien. Alle tragenden Regeln stehen hier. */
export function pruefeDaten(daten) {
  const fehler = [];
  const kriterien = daten?.kriterien;
  if (!Array.isArray(kriterien) || kriterien.length < 20) fehler.push('kriterien: mindestens 20 erwartet');

  const bereichIds = new Set((daten?.bereiche ?? []).map((b) => b.id));
  const ausloeserIds = new Set((daten?.ausloeser ?? []).map((a) => a.id));
  const profilIds = new Set((daten?.profile ?? []).map((p) => p.id));
  if (!PROFILE.every((p) => profilIds.has(p))) fehler.push(`profile: ${PROFILE.join(', ')} erwartet – Kindertagespflege ist ein eigenes Profil`);
  const zuerst = (daten?.bereiche ?? []).filter((b) => b.zuerst);
  if (zuerst.length !== 1 || zuerst[0].id !== 'schlafen') fehler.push('bereiche: genau der Schlafplatz muss zuerst stehen');
  if (!/absolut/.test(zuerst[0]?.vorspann ?? '')) fehler.push('schlafen.vorspann muss sagen, dass der Abschnitt absolut gilt');

  const ids = new Set();
  for (const k of kriterien ?? []) {
    const wo = `Kriterium ${k.id || '?'}`;
    if (!k.id || ids.has(k.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
    ids.add(k.id);
    if (!bereichIds.has(k.bereich)) fehler.push(`${wo}: bereich ${k.bereich} unbekannt`);
    if (!ARTEN.includes(k.art)) fehler.push(`${wo}: art „${k.art}“ – es gibt nur einmal und immer`);
    if (!ausloeserIds.has(k.ausloeser)) fehler.push(`${wo}: ausloeser ${k.ausloeser} unbekannt`);
    if (!Array.isArray(k.giltFuer) || !k.giltFuer.length) fehler.push(`${wo}: giltFuer fehlt`);
    for (const p of k.giltFuer ?? []) if (!profilIds.has(p)) fehler.push(`${wo}: giltFuer nennt unbekanntes Profil ${p}`);
    if (!k.was || k.was.length < 20) fehler.push(`${wo}: was fehlt oder ist zu kurz`);
    if (!k.warum || k.warum.length < 30) fehler.push(`${wo}: warum fehlt – ohne Mechanismus kann niemand übertragen`);

    // Der Gegenstand ist der Raum, nicht das Kind.
    if (KIND_ALS_SUBJEKT.test(k.was ?? '')) {
      fehler.push(`${wo}: das Kind ist Subjekt des Kriteriums – dieser Check schaut auf den Raum, die Beobachtung des Kindes gehört apps/meilenstein-begleiter`);
    }

    // Jede Zeile nennt die zuständige Stelle. Eine Fundstelle (Kapitel,
    // Paragraf, Abschnittsnummer) darf nur dastehen, wenn ein Mensch das
    // Dokument wirklich aufgeschlagen hat – eine erfundene Fundstelle sieht
    // genauso aus wie eine geprüfte.
    if (!k.quelle?.gremium) fehler.push(`${wo}: quelle.gremium fehlt`);
    // Die eigene Schreibweise der Quellenangaben dieses Korpus ist „S. 34" -
    // und genau die kannte die Sperre nicht (Review der Welle 78).
    if (/Kap\.|§|Abschnitt \d|Seite \d|\bS\.\s*\d|\bSS?\.\s*\d|\bRn\.\s*\d|\bNr\.\s*\d+\s*Abs/.test(JSON.stringify(k)) && k.quelle?.geprueft !== true) {
      fehler.push(`${wo}: nennt eine Fundstelle, ohne dass die Quelle als geprüft markiert ist`);
    }
  }

  // Drei Regeln, die das GDD behauptet hat, ohne dass sie hier standen
  // (Review der Welle 78 - eine Zusage, die weiter geht als der Code, ist
  // nach docs/02 ein Fehler, und zwar genau an den Stellen, die die App
  // plakatiert).
  //
  // (a) Kein Alter in einem Auslöser. Die App sagt im Einstieg „kein Alter
  //     erwartet"; eine Monatsangabe in der Frage würde das umdrehen.
  for (const a of daten?.ausloeser ?? []) {
    if (/Monat|Woche|Lebensmonat|Lebenswoche|\d/i.test(`${a.name ?? ''} ${a.frage ?? ''}`)) {
      fehler.push(`Auslöser ${a.id}: Altersangabe in der Frage – gefragt wird nach dem, was zu sehen ist`);
    }
  }
  // (b) Der Geborgenheits-Bereich nennt eine prüfbare RAUM-Eigenschaft und
  //     beurteilt keine Beziehung. Das dritte Quellziel ist übersetzt, nicht
  //     übernommen - und das muss der Validator halten, nicht die Redaktion.
  const RAUM_EIGENSCHAFT = /Ecke|Bildschirm|Radio|sehen|hören|abdunkeln|Zugluft|Durchgangsverkehr|Schlafplatz|Fläche|Licht|Lärm/i;
  const BEZIEHUNGSURTEIL = /\bBindung\b|feinfühlig|liebevoll|geborgen fühlt|fühlt sich .* geborgen|verlässliche Beziehung|genug Zuwendung/i;
  for (const k of (daten?.kriterien ?? []).filter((x) => x.bereich === 'geborgenheit')) {
    if (!RAUM_EIGENSCHAFT.test(k.was ?? '')) {
      fehler.push(`Kriterium ${k.id}: im Bereich Geborgenheit ohne prüfbare Raum-Eigenschaft`);
    }
    if (BEZIEHUNGSURTEIL.test(`${k.was ?? ''} ${k.warum ?? ''}`)) {
      fehler.push(`Kriterium ${k.id}: beurteilt die Beziehung statt den Raum`);
    }
  }
  // (c) Der Kernsatz darf nur so weit gehen, wie er stimmt. Mehrere
  //     Dauerregeln beschreiben, was der ERWACHSENE tut (eine Hand am
  //     Wickelplatz, Griffabstand in der Wanne) - der Anspruch „nur Sachen
  //     und Handgriffe daran" war zu stark.
  const kern = String(daten?.hinweis ?? '');
  if (!/auf den RAUM|auf den Raum/.test(kern)) fehler.push('hinweis: der Gegenstand muss der Raum sein');
  if (/keine einzige beschreibt, was dein Kind kann oder wie du bist/.test(kern)) {
    fehler.push('hinweis: der Anspruch geht zu weit – mehrere Zeilen beschreiben, was der Erwachsene tut; er darf nur so weit gehen, wie er stimmt');
  }
  if (!/oder etwas, das du tust|was du tust/.test(kern)) {
    fehler.push('hinweis: dass auch Handlungen des Erwachsenen vorkommen, muss dastehen');
  }

  // Eine Zeile, die ihre eigene Wiederkehr ausspricht, ist eine Dauerregel –
  // egal in welchem Bereich. „bei jedem Schlafen, Tag und Nacht“ als
  // `einmal` zu führen heißt, die wirksamste Einzelmaßnahme gegen den
  // plötzlichen Kindstod abhakbar zu machen und sie danach aus dem Bericht
  // zu nehmen. Das war so gebaut und ist beim Review aufgefallen.
  // „vor jedem", „nach jedem" und die Dativformen („bei jeder Mahlzeit")
  // entgingen der ersten Fassung (Review der Welle 78).
  const WIEDERKEHR = /\b(bei|zu|vor|nach|in|an)\s+jede[rmn]?\b|jedes Mal|jedes? Schlafen|Tag und Nacht|immer wieder|täglich|jeden Abend|jeden Morgen/i;
  for (const k of kriterien ?? []) {
    if (k.art === 'einmal' && WIEDERKEHR.test(k.was ?? '')) {
      fehler.push(`${k.id}: der Text spricht die Wiederkehr aus („bei jedem …“) – das ist eine Dauerregel und darf nicht abhakbar sein`);
    }
  }

  // Jede angebotene Fähigkeit muss mindestens eine Zeile auslösen, sonst
  // ist die Frage eine Attrappe: drei der sechs Schalter taten gar nichts.
  const benutzt = new Set((kriterien ?? []).map((k) => k.ausloeser));
  for (const a of daten?.ausloeser ?? []) {
    if (!benutzt.has(a.id)) fehler.push(`ausloeser ${a.id}: löst kein einziges Kriterium aus – die Frage wäre eine Attrappe`);
  }

  // Und keine kritische Zeile darf erst auf einer späten Stufe erscheinen,
  // wenn ihre Gefahr schon früher besteht: Verschlucken kommt vom Greifen,
  // nicht vom Fortbewegen.
  for (const k of (kriterien ?? []).filter((x) => x.kritisch && x.bereich === 'vergiften')) {
    if (k.ausloeser !== 'immer') {
      fehler.push(`${k.id}: eine kritische Verschluckens-Zeile hinter einer Fähigkeit – Greifen kommt vor dem Krabbeln`);
    }
  }

  // Der Schlaf-Abschnitt steht ohne Ausnahmeklausel.
  for (const k of (kriterien ?? []).filter((x) => x.bereich === 'schlafen')) {
    if (AUSNAHME.test(`${k.was} ${k.warum}`)) {
      fehler.push(`${k.id}: Ausnahmeklausel im Schlaf-Abschnitt – „sobald das Baby den Kopf halten kann“ ist hier lebensgefährlich`);
    }
  }
  for (const pflicht of [/Rücken/, /Schlafsack/, /eigene[sn]? Bett/, /geraucht|rauchfrei/]) {
    if (!(kriterien ?? []).some((k) => k.bereich === 'schlafen' && pflicht.test(k.was))) {
      fehler.push(`schlafen: es fehlt ein Kriterium zu ${pflicht}`);
    }
  }

  // Kritische Kriterien müssen es in jedem Bereich mit Lebensgefahr geben.
  for (const b of ['schlafen', 'stuerzen', 'ersticken', 'verbrennen', 'vergiften', 'ertrinken']) {
    if (!(kriterien ?? []).some((k) => k.bereich === b && k.kritisch)) {
      fehler.push(`${b}: kein als kritisch markiertes Kriterium`);
    }
  }

  // Keine Erste Hilfe, keine Überwachungstechnik, keine erfundene Nummer.
  const alles = JSON.stringify(kriterien ?? []);
  if (ERSTE_HILFE.test(alles)) fehler.push('ein Kriterium enthält Erste-Hilfe-Anweisungen – die gehören in einen Kurs, nicht in eine Raum-Checkliste');
  if (UEBERWACHUNG.test(alles)) fehler.push('ein Kriterium nennt Überwachungstechnik – sie ist kein Sicherheitsmerkmal eines Raums');
  for (const n of JSON.stringify(daten ?? {}).match(FREMDE_NUMMER) ?? []) {
    if (!ERLAUBTE_NUMMERN.includes(nurZiffern(n))) {
      fehler.push(`eine Telefonnummer steht in den Daten („${n.trim()}“) – außer 112 und dem Elterntelefon wird hier keine gedruckt`);
    }
  }
  if (!/112/.test(daten?.keineErsteHilfe ?? '')) fehler.push('keineErsteHilfe muss die 112 nennen');
  if (!/gibt es nicht/.test(daten?.gift ?? '')) fehler.push('gift: es muss dastehen, dass es keine bundesweite Giftnotruf-Nummer gibt');

  // Kein Gesamtwert – auch nicht im Berichtstext.
  for (const [feld, muster, was] of [
    ['keinErgebnis', /keine Note|keinen Prozentwert|keine Ampel/, 'es muss dastehen, dass es keine Gesamtwertung gibt'],
    ['keinErgebnis', /nicht gegeneinander aufrechnen/, 'die Begründung muss dastehen'],
    ['nichtFertig', /nicht, dass der Raum sicher ist/, 'eine leere Liste darf nicht als Freigabe gelesen werden'],
    ['hinweis', /auf den RAUM|auf den Raum/, 'der Kernsatz muss dastehen'],
    ['keineTechnik', /kein Sicherheitsmerkmal/, 'Technik muss ausdrücklich ausgeschlossen sein'],
    ['quellenHinweis', /Keine der genannten Stellen hat diesen Check geprüft oder freigegeben/, 'die App darf keine Freigabe behaupten'],
    ['quellenKorrektur', /102-602/, 'die geltende DGUV-Regel muss benannt sein'],
    ['quellenKorrektur', /zurückgezogen/, 'dass die alte Regel zurückgezogen ist, muss dastehen'],
  ]) {
    if (!muster.test(daten?.[feld] ?? '')) fehler.push(`${feld}: ${was}`);
  }
  return fehler;
}
