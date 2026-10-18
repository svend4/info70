// Tischdienst-Trainer – reine Logik (ohne DOM), testbar mit node --test.
// Ko-Nutzungs-App für 4-7, NUR gemeinsam mit einem Erwachsenen.
// Praleska docs/10 (Ko-Nutzung Nr. 17).
//
// Wie die anderen Apps dieses Abschnitts bewusst NICHT auf quiz-kern:
// kein Rekord, keine Punkte, keine Ränge – und ausdrücklich kein
// Sternchen. Die Buchquelle (S. 187) führt den Tischdienst mit einem
// „Sternchen-Ziel“; das ist dort eine Differenzierungsmarkierung des
// Programms und wird hier NICHT zu einer Belohnung übersetzt.
//
// Die Geltungsarten heißen wie in apps/design-entdecker – `pruefbar`,
// `ausgemacht`, `geschmack`. Eine zweite Namensfamilie für dieselbe
// Unterscheidung würde die Projekt-Tradition zersplittern.
//
// VIER TRAGENDE ENTSCHEIDUNGEN
//
// 1. `liegtUnter` ist eine ENDZUSTANDS-Relation, keine Reihenfolge-
//    bedingung. Physisch zwingend ist nur, dass die Decke am Ende unten
//    liegt – nicht, dass sie zuerst kommt: man hebt den Teller an und
//    schiebt sie darunter. Genau das tun Fünfjährige am echten Tisch,
//    und es funktioniert. Eine App, die die Decke zuletzt ablehnt,
//    behauptet eine Unwahrheit – an der einzigen Stelle, an der sie
//    überhaupt etwas behaupten darf. Darum wird hier NICHTS abgelehnt;
//    die später gelegte Decke wird sichtbar untergeschoben.
//    Folge: akzeptiert sind ALLE n! Reihenfolgen. `pruefeDaten` prüft
//    das als Strukturgleichheit, nicht über eine Mindestzahl: „mehr als
//    eine Reihenfolge“ wäre wirkungslos, weil 718 von 720 abgelehnten
//    Reihenfolgen diese Schwelle bestehen würden.
//
// 2. Die Szene ist egozentrisch: der Sitzplatz liegt immer UNTEN am
//    Bildschirm, also Bildschirm-links = Figur-links = Kind-links. Sonst
//    müsste das Kind die Perspektive einer Gegenübersitzenden übernehmen,
//    und das ist vor 7-8 nicht verfügbar. Deshalb gibt es keine zweite
//    Sitzrichtung, auch nicht als Schwierigkeitsgrad. Und `links`/`rechts` darf in
//    keinem Text ohne den Anker „von dem Kind, das hier sitzt“ vorkommen
//    – der Validator prüft die Texte, nicht nur die Zonen-Objekte.
//
// 3. `oben` und `über` sind als Raumwörter gesperrt, wie in
//    apps/grammatik-zwerge (GESPERRTE_PRAEPOSITIONEN, dieselbe
//    Altersgruppe). In einer flachen Szene von oben gibt es zwei
//    verteidigbare Antworten: aus Sicht der sitzenden Person ist das Glas
//    nicht „über“ dem Teller, sondern weiter weg. Zwei Apps derselben
//    Reihe dürfen sich hier nicht widersprechen. Erlaubt sind auf,
//    unter, in, neben – und `vor` nur personenbezogen, weil eine Person
//    eine Vorderseite hat und ein Teller nicht.
//
// 4. Zwei Sitzungstypen mit getrennten Budgets, nie gemischt:
//      'austeilen' – 3-5 Plätze, EINE Teilesorte, Eins-zu-eins-Zuordnung
//      'decken'    – genau EIN Platz, mehrere Teile
//    Beides in einer Sitzung wären 15-30 Handlungen. Und beim Austeilen
//    wird NICHT gezählt: „heute fehlt eines, also brauchst du eins
//    weniger“ ist Subtraktion und mit 4-5 nicht verfügbar. Geprüft wird
//    nur „jede Figur hat eins, nichts bleibt übrig“ – Paarbildung ohne
//    Zahlenantwort.
// Zufall kommt NICHT aus dieser Datei: das Mischen wird als Parameter
// übergeben (app.mjs gibt `mischen` aus kinder-ui hinein), damit diese
// Datei ohne Zufallsquelle und ohne Uhr auskommt.

/** Die Geltungsarten – dieselben Namen wie in apps/design-entdecker. */
export const GELTUNGEN = ['pruefbar', 'ausgemacht', 'geschmack'];

/** Die beiden Sitzungstypen. */
export const SITZUNGSTYPEN = ['austeilen', 'decken'];

/** Zonen, die eine Seite benennen – sie brauchen einen Anker. */
export const SEITEN_ZONEN = ['nebenLinks', 'nebenRechts'];

/**
 * Die Reihe direkt am Platz, von links nach rechts. Bildschirm und
 * Druck nehmen genau diese Reihenfolge – sonst druckt die Schablone
 * Teller und Gabel vertauscht.
 */
export const REIHENFOLGE_MITTE = Object.freeze(['nebenLinks', 'mitte', 'nebenRechts', 'neben']);

/** Die Pflichtmarkierung jeder gedruckten Karte (docs/02, Abschnitt 6 des Bauauftrags). */
export const PFLICHTMARKIERUNG = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';

/** Höchstens so viele Handlungen pro Sitzung – je Typ. */
export const MAX_HANDLUNGEN = 6;

/** Der Anker, ohne den links/rechts den Bildschirmrand meint. */
export const ANKER = 'von dem Kind, das hier sitzt';

/**
 * Als Raumwort gesperrt (siehe Entscheidung 3). `über`/`oben` haben in
 * einer flachen Draufsicht zwei verteidigbare Antworten; `hinter` steht
 * aus demselben Grund in apps/grammatik-zwerge auf der Sperrliste.
 *
 * Jedes Wort steht hier mit eigenem Muster, weil `\b` an einem Umlaut
 * NICHT greift: `\w` ist in JavaScript nur [A-Za-z0-9_], also ist „ü“
 * ein Nicht-Wortzeichen. `/\büber\b/` trifft „über“ am Satzanfang nie –
 * und schlägt in „darüber“ falsch an, weil zwischen „r“ und „ü“ sehr wohl
 * eine Grenze liegt. Darum wird vorne über Nicht-Buchstaben abgegrenzt.
 */
export const GESPERRTE_RAUMWOERTER = Object.freeze([
  { wort: 'oben', muster: /(^|[^a-zäöüß])oben($|[^a-zäöüß])/i },
  { wort: 'über', muster: /(^|[^a-zäöüß])über($|[^a-zäöüß])/i },
  { wort: 'drüber', muster: /(^|[^a-zäöüß])drüber($|[^a-zäöüß])/i },
  { wort: 'hinter', muster: /(^|[^a-zäöüß])hinter($|[^a-zäöüß])/i },
]);

/**
 * `vor` ist erlaubt – aber nur personenbezogen: eine Person hat eine
 * Vorderseite, ein Teller nicht. Genau darauf stützt sich die Sperre in
 * apps/grammatik-zwerge.
 */
const VOR_PERSONENBEZOGEN = /vor (das|dem) Kind/i;
const VOR_IRGENDWO = /(^|[^a-zäöüß])vor($|[^a-zäöüß])/i;

/** Bewertungsvokabular, das in einem Kindertext nichts zu suchen hat. */
const BEWERTUNG = /\b(richtig|falsch|schön|schöner|schlecht|besser|gut gemacht)\b/i;

/** Eine Variante holen. */
export function varianteVon(daten, id) {
  return (daten?.varianten ?? []).find((v) => v.id === id) ?? null;
}

/** Ein Schritt innerhalb einer Variante. */
export function schrittVon(variante, id) {
  return (variante?.schritte ?? []).find((s) => s.id === id) ?? null;
}

/** Die Unterlage einer Variante – der einzige prüfbare Schritt. */
export function unterlageVon(variante) {
  return (variante?.schritte ?? []).find((s) => s.geltung === 'pruefbar') ?? null;
}

/**
 * Welche Zonen braucht diese Variante? Nur sie werden gezeichnet – die
 * 4-5-Schiene soll keine Seitenzonen sehen.
 */
export function zonenVon(daten, variante) {
  const gebraucht = new Set((variante?.schritte ?? []).map((s) => s.zone).filter(Boolean));
  return (daten?.zonen ?? []).filter((z) => gebraucht.has(z.id));
}

/** Benutzt die Variante Seitenzonen (links/rechts)? */
export function brauchtSeiten(variante) {
  return (variante?.schritte ?? []).some((s) => SEITEN_ZONEN.includes(s.zone));
}

/**
 * Darf `schrittId` jetzt gelegt werden? IMMER ja, solange es nicht schon
 * liegt – siehe Entscheidung 1. Die Funktion existiert, damit die
 * Reihenfolgen-Prüfung dieselbe Regel benutzt wie die App.
 */
export function darfJetzt(variante, schrittId, gelegt) {
  return Boolean(schrittVon(variante, schrittId)) && !(gelegt ?? []).includes(schrittId);
}

/**
 * Muss die Unterlage noch untergeschoben werden? Das ist die einzige
 * Rückmeldung, die aus der Physik kommt – und sie lehnt nichts ab.
 */
export function unterlageFehlt(variante, gelegt) {
  const u = unterlageVon(variante);
  if (!u) return false;
  const liegen = new Set(gelegt ?? []);
  return !liegen.has(u.id) && (u.liegtUnter ?? []).some((id) => liegen.has(id));
}

/** Zählt alle akzeptierten Reihenfolgen (Bitmask-DP). */
export function anzahlReihenfolgen(variante) {
  const ids = (variante?.schritte ?? []).map((s) => s.id);
  if (!ids.length || ids.length > 16) return 0;
  const memo = new Map();
  const zaehle = (maske) => {
    if (maske === (1 << ids.length) - 1) return 1;
    if (memo.has(maske)) return memo.get(maske);
    const gelegt = ids.filter((_, i) => maske & (1 << i));
    let summe = 0;
    for (let i = 0; i < ids.length; i++) {
      if (maske & (1 << i)) continue;
      if (darfJetzt(variante, ids[i], gelegt)) summe += zaehle(maske | (1 << i));
    }
    memo.set(maske, summe);
    return summe;
  };
  return zaehle(0);
}

/** n! – die Zahl, die herauskommen MUSS, wenn nichts eingeschränkt wird. */
export function allePermutationen(anzahl) {
  let f = 1;
  for (let i = 2; i <= anzahl; i++) f *= i;
  return f;
}

/**
 * An wie vielen verschiedenen Positionen kann jeder Schritt stehen?
 * Zweite Strukturprüfung: ein Schritt, der nur an einer Position
 * vorkommt, ist faktisch festgenagelt.
 */
export function positionenJeSchritt(variante) {
  const schritte = variante?.schritte ?? [];
  const ids = schritte.map((s) => s.id);
  const positionen = new Map(ids.map((id) => [id, new Set()]));
  const gehe = (maske, tiefe) => {
    if (maske === (1 << ids.length) - 1) return;
    const gelegt = ids.filter((_, i) => maske & (1 << i));
    for (let i = 0; i < ids.length; i++) {
      if (maske & (1 << i)) continue;
      if (!darfJetzt(variante, ids[i], gelegt)) continue;
      positionen.get(ids[i]).add(tiefe);
      gehe(maske | (1 << i), tiefe + 1);
    }
  };
  gehe(0, 0);
  return positionen;
}

/**
 * Sitzt die Sache am ausgemachten Platz? Für Geschmack gibt es nichts zu
 * treffen – dann `null`, nicht `false`. (Dieselbe Linie wie die
 * Geschmacksfragen in apps/design-entdecker.)
 */
export function istAmPlatz(schritt, zoneId) {
  if (!schritt || schritt.geltung === 'geschmack') return null;
  return schritt.zone === zoneId;
}

/** Eine Austeil-Lage je Sitzung: heute sind nicht alle da. `mische` kommt von außen. */
export function waehleLage(daten, mische) {
  return mische(daten?.austeilen?.lagen ?? [])[0] ?? null;
}

/**
 * Der Vorrat: so viele, wie Stühle am Tisch stehen – also für die ganze
 * Gruppe. Dass heute jemand fehlt, zeigt sich daran, dass am Ende etwas
 * ÜBRIG bleibt. Ohne diesen Vorrat könnte „nichts bleibt übrig“ nie
 * eintreten, und die Eins-zu-eins-Zuordnung wäre gar nicht geprüft:
 * wer nur auf Kinder tippen kann, kann sich nicht verzählen.
 */
export function vorratVon(lage) {
  return Number(lage?.figuren ?? 0) + Number(lage?.leer ?? 0);
}

/** Wie viele liegen noch auf dem Stapel? */
export function restVorrat(lage, verteiltAn) {
  return Math.max(0, vorratVon(lage) - new Set(verteiltAn ?? []).size);
}

/** Hat jede Figur genau eins? Ohne Zahlen, nur Paarbildung. */
export function austeilenFertig(lage, verteiltAn) {
  const figuren = Number(lage?.figuren ?? 0);
  const gegeben = new Set(verteiltAn ?? []);
  return figuren > 0 && gegeben.size === figuren;
}

/** Bleibt am Ende wirklich etwas übrig? (Nur zum Validieren.) */
export function bleibtUebrig(lage) {
  return vorratVon(lage) - Number(lage?.figuren ?? 0) > 0;
}

/** Die Schritte einer Variante in zufälliger Anbietungsreihenfolge. `mische` kommt von außen. */
export function angeboteneSchritte(variante, gelegt, mische) {
  return mische((variante?.schritte ?? []).filter((s) => !(gelegt ?? []).includes(s.id)));
}

/**
 * Der Inhalt eines gedruckten Platzsets – nur Text, ohne Zeichen aus
 * docs/02 Z. 79–82 (keine Emojis, keine Häkchen, keine Punkte). Der
 * Bildschirm zeigt dieselbe Raumlage mit Emojis dazu; gedruckt wird
 * ausschließlich das hier.
 */
export function platzsetText(daten, variante) {
  const unterlage = unterlageVon(variante);
  const zonen = zonenVon(daten, variante);
  const feld = (zoneId) => {
    const z = zonen.find((x) => x.id === zoneId);
    if (!z) return null;
    const namen = variante.schritte.filter((s) => s.zone === zoneId).map((s) => s.name);
    return { id: z.id, name: z.name, inhalt: namen.length ? namen.join(' / ') : z.name };
  };
  return {
    kopf: daten.platzset.kopf,
    titel: `Platzset: ${variante.name}`,
    unter: unterlage ? unterlage.name : null,
    weiterWeg: feld('weiterWeg'),
    reihe: REIHENFOLGE_MITTE.map(feld).filter(Boolean),
    ohneFestenPlatz: variante.schritte.filter((s) => !s.zone).map((s) => s.name),
    figur: daten.platzset.figur,
    blickrichtung: daten.blickrichtung,
    pflicht: daten.pflichtmarkierung,
  };
}

/** Nennt der Text eine Seite ohne den Anker? */
/** Auch die flektierten Formen: „die linke Seite“, „rechter Hand“. */
const SEITE = /(^|[^a-zäöüß])(links|rechts|linke[nrms]?|rechte[nrms]?)($|[^a-zäöüß])/i;

export function seiteOhneAnker(text) {
  const satz = String(text ?? '');
  if (!SEITE.test(satz)) return false;
  // Jeder Satz, der eine Seite nennt, muss den Anker selbst tragen.
  return satz.split(/(?<=[.!?])\s+/)
    .some((teil) => SEITE.test(teil) && !teil.includes(ANKER));
}

/** Nennt der Text ein gesperrtes Raumwort? */
export function gesperrtesRaumwort(text) {
  const satz = String(text ?? '');
  const treffer = GESPERRTE_RAUMWOERTER.find((w) => w.muster.test(satz));
  if (treffer) return treffer.wort;
  // `vor` nur personenbezogen.
  if (VOR_IRGENDWO.test(satz) && !VOR_PERSONENBEZOGEN.test(satz)) return 'vor (nicht personenbezogen)';
  return null;
}

/**
 * Validiert die Daten. Siehe Kopfkommentar – alle vier tragenden Regeln
 * stehen hier und nicht in der Redaktion.
 */
export function pruefeDaten(daten) {
  const fehler = [];

  // Jede gedruckte Karte trägt die Pflichtmarkierung und die Seitenangabe.
  if (daten?.pflichtmarkierung !== PFLICHTMARKIERUNG) {
    fehler.push('pflichtmarkierung: muss der Wortlaut aus dem Bauauftrag sein');
  }
  if (!/Eigenentwurf/.test(daten?.platzset?.kopf ?? '') || !/S\. 187/.test(daten?.platzset?.kopf ?? '')) {
    fehler.push('platzset.kopf: Eigenentwurf und Seitenangabe (S. 187) müssen auf der Schablone stehen');
  }
  if (!daten?.platzset?.figur) fehler.push('platzset.figur fehlt');
  if (!/immer unten am Bildschirm/.test(daten?.blickrichtung ?? '')) {
    fehler.push('blickrichtung: der Sitzplatz muss immer unten am Bildschirm liegen – sonst braucht das Kind Perspektivübernahme');
  }
  // Dieser Satz steht auch auf dem Ausdruck und muss sich darum an seine
  // eigene Regel halten. Die erste Fassung tat es nicht („dort sitzt“).
  if (seiteOhneAnker(daten?.blickrichtung)) {
    fehler.push(`blickrichtung: nennt eine Seite ohne den Anker „${ANKER}“ – und steht auch auf dem Platzset`);
  }
  if (gesperrtesRaumwort(daten?.blickrichtung)) {
    fehler.push(`blickrichtung: „${gesperrtesRaumwort(daten.blickrichtung)}“ ist als Raumwort gesperrt`);
  }
  for (const feld of ['rahmenSatz', 'ehrlichkeit', 'fuerAndere']) {
    if (seiteOhneAnker(daten?.[feld])) fehler.push(`${feld}: nennt eine Seite ohne den Anker`);
  }
  for (const satz of daten?.ohneRichtig ?? []) {
    if (seiteOhneAnker(satz)) fehler.push(`ohneRichtig: nennt eine Seite ohne den Anker – „${satz}“`);
  }
  if (!/nicht üben|kann ein Bildschirm nicht/.test(daten?.ehrlichkeit ?? '')) {
    fehler.push('ehrlichkeit: die App muss sagen, was ein Bildschirm hier NICHT üben kann');
  }
  if (!/für die anderen|für jemand anderen/.test(daten?.fuerAndere ?? '')) {
    fehler.push('fuerAndere: der Tischdienst deckt für andere – das muss dastehen');
  }
  // Ohne Erwachsenen wird aus „bei uns ausgemacht“ doch wieder „so ist
  // es richtig“ – es gibt niemanden, der die Einschränkung einlöst.
  if (!/nur zum gemeinsamen/.test(daten?.nurGemeinsam ?? '')) {
    fehler.push('nurGemeinsam: diese App behauptet Abmachungen und darf deshalb nicht allein gelassen werden');
  }
  // Der Geltungssatz steht EINMAL im Kinderbildschirm – nicht als
  // Floskel in jedem Schritt und nicht nur auf der Elternseite.
  const rahmen = daten?.rahmenSatz ?? '';
  if (!/bei uns/i.test(rahmen) || !/anders sein/i.test(rahmen)) {
    fehler.push('rahmenSatz: muss „bei uns“ sagen und dass es zu Hause anders sein kann');
  }

  const zonen = daten?.zonen;
  if (!Array.isArray(zonen) || zonen.length < 4) fehler.push('zonen: mindestens 4 erwartet');
  const zonenIds = new Set();
  for (const z of zonen ?? []) {
    const wo = `Zone ${z.id || '?'}`;
    if (!z.id || zonenIds.has(z.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
    zonenIds.add(z.id);
    if (!z.name || !z.frage) fehler.push(`${wo}: name/frage fehlt`);
    if (SEITEN_ZONEN.includes(z.id) && !String(z.anker ?? '').includes(ANKER)) {
      fehler.push(`${wo}: anker fehlt – links und rechts gehören zu dem Kind, das dort sitzt, nicht zum Bildschirm`);
    }
    for (const feld of ['name', 'frage', 'anker']) {
      if (seiteOhneAnker(z[feld])) fehler.push(`${wo}.${feld}: nennt eine Seite ohne den Anker „${ANKER}“`);
      const wort = gesperrtesRaumwort(z[feld]);
      if (wort) fehler.push(`${wo}.${feld}: „${wort}“ ist als Raumwort gesperrt (wie in grammatik-zwerge)`);
    }
  }

  const varianten = daten?.varianten;
  if (!Array.isArray(varianten) || varianten.length < 2) {
    fehler.push('varianten: mindestens 2 erwartet – das Kita-Frühstück ist kein kleineres Gedeck');
  }
  const arten = new Set();
  for (const v of varianten ?? []) {
    const wo = `Variante ${v.id || '?'}`;
    if (!v.id || !v.name || !v.emoji || !v.hinweis) fehler.push(`${wo}: id/name/emoji/hinweis fehlt`);
    if (!['4-5', '5-7'].includes(v.ab)) fehler.push(`${wo}: ab muss 4-5 oder 5-7 sein`);
    const schritte = v.schritte;
    if (!Array.isArray(schritte) || schritte.length < 4) { fehler.push(`${wo}: mindestens 4 Schritte erwartet`); continue; }
    if (schritte.length > MAX_HANDLUNGEN) fehler.push(`${wo}: mehr als ${MAX_HANDLUNGEN} Handlungen – ein Gedeck, kein Tisch für vier`);
    const ids = new Set();
    for (const s of schritte) {
      const so = `${wo}/${s.id || '?'}`;
      if (!s.id || ids.has(s.id)) fehler.push(`${so}: id fehlt oder doppelt`);
      ids.add(s.id);
      if (!GELTUNGEN.includes(s.geltung)) fehler.push(`${so}: geltung muss ${GELTUNGEN.join(' | ')} sein`);
      arten.add(s.geltung);
      if (!s.name || !s.emoji || !s.kindText) fehler.push(`${so}: name/emoji/kindText fehlt`);
      // Jeder Text wird gegen Anker und Sperrliste geprüft – nicht nur
      // die Zonen-Objekte.
      for (const feld of ['name', 'kindText', 'grund', 'spaeterText']) {
        if (seiteOhneAnker(s[feld])) fehler.push(`${so}.${feld}: nennt eine Seite ohne den Anker „${ANKER}“`);
        const wort = gesperrtesRaumwort(s[feld]);
        if (wort) fehler.push(`${so}.${feld}: „${wort}“ ist als Raumwort gesperrt (wie in grammatik-zwerge)`);
      }
      if (s.geltung === 'pruefbar') {
        if (!Array.isArray(s.liegtUnter) || !s.liegtUnter.length) {
          fehler.push(`${so}: pruefbar ohne liegtUnter`);
        }
        if (!s.grund) fehler.push(`${so}: grund fehlt – das Kind soll es nachprüfen können`);
        // Die Decke darf später kommen und wird dann untergeschoben.
        if (!s.spaeterText) fehler.push(`${so}: spaeterText fehlt – eine später gelegte Decke wird nicht abgelehnt, sondern untergeschoben`);
        if (!zonenIds.has(s.zone)) fehler.push(`${so}: zone ${s.zone} unbekannt`);
      } else if (s.liegtUnter) {
        fehler.push(`${so}: liegtUnter nur bei geltung pruefbar – sonst entsteht eine erfundene Zwangsfolge`);
      }
      if (s.geltung === 'ausgemacht') {
        if (!zonenIds.has(s.zone)) fehler.push(`${so}: zone ${s.zone} unbekannt`);
        if (!s.geltungsbereich) fehler.push(`${so}: geltungsbereich fehlt – eine Abmachung gilt nicht überall`);
        // Strukturell statt wortweise: kein Bewertungsvokabular im
        // Kindertext. Die Floskel „bei uns ausgemacht“ steht einmal pro
        // Sitzung als Rahmensatz, nicht sechsmal.
        if (BEWERTUNG.test(s.kindText)) fehler.push(`${so}: der Kindertext bewertet – eine Abmachung wird gesagt, nicht benotet`);
      }
      if (s.geltung === 'geschmack') {
        if ('zone' in s) fehler.push(`${so}: Geschmack darf keine zone haben – es gibt hier nichts zu treffen`);
        if ('richtig' in s || 'korrekt' in s) fehler.push(`${so}: Geschmack darf kein Lösungsfeld tragen`);
        if (!s.geltungsbereich) fehler.push(`${so}: geltungsbereich fehlt`);
      }
      for (const unten of s.liegtUnter ?? []) {
        if (!schritte.some((x) => x.id === unten)) fehler.push(`${so}: liegtUnter nennt ${unten}, das es nicht gibt`);
      }
    }
    // Jede Variante braucht genau einen pruefbaren Schritt: die Anzeige
    // leitet die Unterlage daraus ab, und ohne sie liefe sie auf null.
    const pruefbare = schritte.filter((x) => x.geltung === 'pruefbar');
    if (pruefbare.length !== 1) {
      fehler.push(`${wo}: genau EIN pruefbarer Schritt erwartet (die Unterlage), gefunden ${pruefbare.length}`);
    }
    // Regel 1 als Strukturgleichheit: genau ALLE Reihenfolgen, keine
    // einzige zusätzliche Einschränkung.
    const wege = anzahlReihenfolgen(v);
    const soll = allePermutationen(schritte.length);
    if (wege !== soll) {
      fehler.push(`${wo}: ${wege} von ${soll} Reihenfolgen akzeptiert – liegtUnter ist ein Endzustand, keine Reihenfolgebedingung`);
    }
    for (const [id, stellen] of positionenJeSchritt(v)) {
      if (stellen.size < 2) fehler.push(`${wo}/${id}: steht nur an einer Position – damit ist er festgenagelt`);
    }
  }
  // Abdeckung der Arten über ALLE Varianten – nicht je Variante. Ein
  // Datensatz ohne Deko muss grün sein dürfen.
  for (const art of GELTUNGEN) {
    if (!arten.has(art)) fehler.push(`keine einzige Variante hat einen Schritt der Geltung ${art}`);
  }
  // Mindestens eine Variante muss ohne Seitenzonen lösbar sein: links
  // und rechts sind erst 5-7-Material.
  if (Array.isArray(varianten) && varianten.length && !varianten.some((v) => !brauchtSeiten(v))) {
    fehler.push('keine Variante ohne links/rechts – für 4-5 ist das nicht lösbar');
  }
  for (const v of varianten ?? []) {
    if (v.ab === '4-5' && brauchtSeiten(v)) fehler.push(`Variante ${v.id}: 4-5 darf keine Seitenzone brauchen`);
  }

  const a = daten?.austeilen;
  if (!a) fehler.push('austeilen fehlt');
  else {
    if (!a.titel || !a.aufgabe || !a.erklaerung || !a.gespraech || !a.fertigText) {
      fehler.push('austeilen: titel/aufgabe/erklaerung/gespraech/fertigText fehlt');
    }
    if (!a.gegenstand?.name || !a.gegenstand?.emoji) fehler.push('austeilen.gegenstand fehlt');
    // Ohne Vorrat und Übrig-Text koennte „es bleibt etwas uebrig“ nie
    // eintreten, und die Zuordnung waere nicht pruefbar.
    if (!a.vorratText) fehler.push('austeilen.vorratText fehlt – woher die Brettchen kommen, muss dastehen');
    if (!a.uebrigText) fehler.push('austeilen.uebrigText fehlt – das Übrigbleiben ist der eigentliche Kern');
    // Der mathematische Gehalt ist die WECHSELNDE Anzahl.
    if (!/heute|jeden Tag/.test(a.hinweis ?? '')) fehler.push('austeilen: der Hinweis muss sagen, dass es heute anders ist als gestern');
    // Und es wird NICHT gerechnet: keine Zahlenantwort, kein „eins
    // weniger“. Subtraktion ist mit 4-5 nicht verfügbar.
    if (/eins weniger|einer weniger|wie viele/i.test(JSON.stringify(a))) {
      fehler.push('austeilen: hier wird zugeordnet, nicht gezählt – keine Zahlenfrage und kein „eins weniger“');
    }
    const lagen = a.lagen;
    if (!Array.isArray(lagen) || lagen.length < 3) fehler.push('austeilen.lagen: mindestens 3 erwartet');
    for (const l of lagen ?? []) {
      const wo = `Lage ${l.id || '?'}`;
      if (!Number.isInteger(l.figuren) || l.figuren < 3 || l.figuren > 5) {
        fehler.push(`${wo}: figuren muss 3 bis 5 sein – mehr übersteigt die Aufmerksamkeit mit 4-5`);
      }
      if (!Number.isInteger(l.leer) || l.leer < 1) fehler.push(`${wo}: leer muss mindestens 1 sein`);
      if ('ablenker' in l || 'da' in l) fehler.push(`${wo}: Zahlen-Antwortfelder gehören nicht hierher`);
      if (!bleibtUebrig(l)) fehler.push(`${wo}: hier bleibt nichts übrig – dann ist die Zuordnung nicht geprüft`);
      if (Number(l.figuren) > MAX_HANDLUNGEN) fehler.push(`${wo}: mehr als ${MAX_HANDLUNGEN} Handlungen`);
    }
    if (new Set((lagen ?? []).map((l) => l.figuren)).size < 2) {
      fehler.push('austeilen.lagen: immer dieselbe Anzahl – dann ist die wechselnde Zahl nicht geübt');
    }
  }

  if (!Array.isArray(daten?.ohneRichtig) || daten.ohneRichtig.length < 3) {
    fehler.push('ohneRichtig: mindestens 3 erwartet – es muss benannt sein, was kein Richtig hat');
  }
  if (!Array.isArray(daten?.woerter) || daten.woerter.length < 4) fehler.push('woerter: mindestens 4 erwartet');
  for (const w of daten?.woerter ?? []) {
    if (!w.de || !w.uk || !w.ru) fehler.push(`wort ${w.de || '?'}: de/uk/ru fehlt`);
  }
  if (!Array.isArray(daten?.schlussIdeen) || daten.schlussIdeen.length < 3) {
    fehler.push('schlussIdeen: mindestens 3 erwartet (die Sitzung endet am echten Tisch)');
  }
  if (!(daten?.schlussIdeen ?? []).some((i) => /[Aa]bräumen/.test(i))) {
    fehler.push('schlussIdeen: das Abräumen fehlt – es ist die zweite Hälfte vom Tischdienst');
  }
  if (!Array.isArray(daten?.sicherheit) || daten.sicherheit.length < 6) {
    fehler.push('sicherheit: mindestens 6 Hinweise erwartet (echtes Geschirr, echte Messer)');
  }
  // Keine Rangbehauptung ohne Quelle: „der häufigste Unfall“ ist in
  // dieser Zuspitzung nicht haltbar, und eine falsche Begründung
  // schwächt die richtige Regel.
  const sicher = (daten?.sicherheit ?? []).join(' ');
  if (/häufigst|meisten Unfälle|Unfall Nummer/i.test(sicher)) {
    fehler.push('sicherheit: keine Häufigkeits-Rangbehauptung ohne Quelle');
  }
  return fehler;
}
