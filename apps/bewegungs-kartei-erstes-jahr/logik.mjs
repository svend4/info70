// Bewegungs-Kartei Babys erstes Jahr – reine Logik (ohne DOM), testbar.
// Werkzeug für ERWACHSENE. Praleska docs/10 (Eltern-Werkzeuge Nr. 49),
// Quellabschnitte S. 34-36.
//
// Tragende Entscheidung: diese Kartei beschreibt KEINE Säuglingsgymnastik –
// kein passives Durchbewegen, keine Reflexauslösung, kein Hochziehen zum
// Sitzen, kein Führen an den Händen oder unter den Achseln. Was der
// Erwachsene tut, ist die UMGEBUNG vorbereiten, tragen und ablegen, und auf
// genau einer Karte flächig streichen als Kontakt. Die Bewegung macht das
// Kind. (Die erste Fassung sagte „keine Karte beschreibt einen Handgriff am
// Kind“ – das war zu stark: Tragen und Streichen sind Handlungen am Kind,
// und `auf-dem-arm` ist eine gehaltene Lage.) Der Gymnastik-Teil der Quelle besteht aus
// passivem Durchbewegen, Reflexauslösung, Hochziehen an den Händen und
// geführtem Schreiten; davon ist nichts übernommen, und das ist hier nicht
// redaktionell vermieden, sondern strukturell ausgeschlossen:
// `ausgangslage`, `rolle` und `ort` sind geschlossene Listen ohne einen
// Wert für „üben“, und ein Textnetz lehnt das Vokabular ab.
//
// Politik docs/02: keine externen Anfragen, KEIN localStorage (die App
// speichert nichts – kein Haken, kein Zähler, kein Fortschritt).

/** Geschlossene Liste der Ausgangslagen. Kein Wert für eine gehaltene Haltung. */
export const AUSGANGSLAGEN = Object.freeze([
  'rueckenlage', 'seitlage', 'bauchlage-wach', 'boden', 'auf-dem-arm', 'sitzt-aus-eigener-kraft',
]);

/** Was der Erwachsene tut. Es gibt bewusst kein „ueben“. */
export const ROLLEN = Object.freeze(['vorbereiten', 'anbieten', 'begleiten', 'zuschauen']);

/** Nur zwei Orte. „wickeltisch“, „sofa“, „bett“, „tisch“ gibt es nicht. */
export const ORTE = Object.freeze(['boden', 'auf-dem-arm']);

/**
 * Vokabular der passiven Säuglingsgymnastik und der Haltungsabnahme.
 * Umlautsichere Grenze vorn, Stamm hinten offen – ein `\b` würde an „ä“
 * scheitern und „Hochziehen“ in einer Komposition verpassen (Welle 77).
 */
export const GESPERRTES_VOKABULAR = Object.freeze([
  // Der Erwachsene handelt am Körper des Kindes. Entscheidend ist das
  // AGENS, nicht das Wort: „zieht sich hoch“ ist genau das, was die Kartei
  // will – das Kind zieht sich selbst hoch. Ein Stammverbot auf „hochzieh“
  // hätte das mitverboten (der Validator hat das beim Bau gemeldet). Darum
  // sind die Muster auf die Erwachsenen-Formen zugeschnitten.
  { wort: 'das Kind ziehen', muster: /zieh\w*\s+(?:dein|das|ihr|Ihr|es)\w*(\s+Kind)?\s+(hoch|an den|zum)/i },
  { wort: 'das Kind hinsetzen oder hinstellen', muster: /(setz|stell)\w*\s+(?:dein|das|ihr|Ihr|es)\w*(\s+Kind)?\s+(hin|auf|in den Stand)/i },
  { wort: 'an den Händen führen', muster: /an (den|beiden) Händen|an einer Hand (führ|halt|zieh)/i },
  { wort: 'unter den Achseln', muster: /unter d(en|ie) Achseln|Achselgriff/i },
  { wort: 'passiv', muster: /(^|[^a-zäöüß])passiv/i },
  // Diese vier stehen ohne Anfangsgrenze: sie sollen auch in Komposita
  // treffen („Sitzübung“, „Reflexkriechen“) – das ist die Gegenfalle zum
  // `\b`-Problem aus Welle 77, hier bewusst in die andere Richtung.
  { wort: 'Übung', muster: /übung/i },
  // Die Quelle schreibt „рефлекторное“ – auf Deutsch „reflektorisch“, nicht
  // „Reflex…“. Ein Muster nur auf „reflex“ hätte genau den Wortlaut
  // verpasst, um den es geht (beim Bau gemeldet).
  { wort: 'Reflex', muster: /reflex|reflektor/i },
  { wort: 'Gymnastik', muster: /gymnastik/i },
  { wort: 'durchbewegen', muster: /durchbeweg/i },
  { wort: 'schütteln', muster: /schüttel/i },
  { wort: 'schwingen', muster: /(^|[^a-zäöüß])schwing/i },
  { wort: 'hochwerfen', muster: /hochwerf/i },
  // Verboten ist das HERUMWIRBELN des Kindes, nicht das Wort. Der nackte
  // Stamm traf „Wirbelsäule“ - also genau den anatomischen Begriff, mit dem
  // eine Sicherheitszeile sagt, wo man NICHT hinfasst. Darum die
  // Verbformen (Review der Welle 78).
  { wort: 'wirbeln', muster: /(^|[^a-zäöüß])(herum|hoch|umher)?wirbel(n|t|st|e|nd)(\b|[^a-zäöüß])/i },
]);

/** Wirkversprechen der Babymassage – beim gesunden Säugling nicht belegt. */
export const GESPERRTE_WIRKUNG = /(bessere|besserer|mehr|weniger)\s+(Verdauung|Schlaf|Gewichtszunahme|Koliken)|schläft (dann )?besser|hilft gegen Koliken/i;

/** Abzählen im Kindtext – die Zahl trägt die Umgebung, nicht die Anweisung. */
// Hinten MUSS eine Grenze stehen: ohne sie traf der „drei“-Zweig auch
// „dreißig“, und ein Maß wie „zwanzig bis dreißig Zentimeter“ wäre
// unschreibbar geworden. Die -mal-Formen stehen eigens in der Liste.
// `-mal` ist ein SUFFIX am Zahlstamm, keine eigene Liste: eine Liste hätte
// immer die Form vergessen, die jemand schreibt („Zehnmal“ fehlte und kam
// durch). `ein` steht nur mit dem Suffix, sonst träfe das Muster den
// Artikel in „ein Tuch“.
const ABZAEHLEN = /(^|[^a-zäöüß])(\d|einmal|(?:zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn)(?:mal)?)($|[^a-zäöüß])/i;

/** Alter in einer Können-Stufe – Komposita absichtlich mitgemeint. */
const ALTER_IN_STUFE = /(monat|woche|lebensjahr|halbjahr|vierteljahr|quartal|\d)/i;

/**
 * Säuglingsgefährliche Zubereitungen. Nur die verneinte Form ist zulässig –
 * der Sicherheitssatz MUSS sie nennen können, um sie auszuschließen. Bewusst
 * NICHT das bloße „Öl“: der Verweis „welches Öl geht, sagt dir Hebamme,
 * Apotheke oder Kinderärztin“ ist richtig und bleibt erlaubt. Vorher gab es
 * dazu überhaupt keine Validator-Regel – nur einen Test über drei Felder,
 * dessen Kommentar mehr behauptete, als er prüfte.
 */
export const GEFAEHRLICHE_ZUBEREITUNG = /(Kampfer|Menthol|Eukalyptus|ätherisch\w*|Erkältungsbad|Senfwickel|Nussöl)/i;

/** Seitigkeit – vor der Schule nicht verfügbar, und hier ohnehin sinnlos. */
const SEITE = /(^|[^a-zäöüß])(links|rechts|linke[nrms]?|rechte[nrms]?)($|[^a-zäöüß])/i;

/** Felder, die der Erwachsene als Anweisung liest. */
const ANWEISUNGS_FELDER = Object.freeze(['titel', 'wasDuVorbereitest', 'wasDeinKindTut', 'abbruchzeichen']);

/**
 * Felder, die EINSCHRÄNKEN: Sicherheitshinweis und Schlafsatz. Das
 * gesperrte Vokabular lief dort gar nicht, und damit hätte eine
 * Sicherheitszeile „Reflex“ oder „Übung“ einführen können - genau an der
 * Stelle, die der Erwachsene am aufmerksamsten liest (Review der Welle 78).
 *
 * Geprüft wird hier aber nur die BEJAHENDE Form: eine Sicherheitszeile muss
 * „schütteln“ nennen dürfen, um es zu verbieten. Die Verneinung erkennt
 * dasselbe Muster wie bei den Zubereitungen.
 */
const EINSCHRAENKENDE_FELDER = Object.freeze(['sicherheit', 'schlafhinweis', 'ohneWirkung']);

/** Eine Karte holen. */
export function karteVon(daten, id) {
  return (daten?.karten ?? []).find((k) => k.id === id) ?? null;
}

/** Die Karten zu einem beobachtbaren Können. */
export function kartenFuer(daten, koennenId) {
  return (daten?.karten ?? []).filter((k) => k.koennen === koennenId);
}

/** Text einer Karte für die Vorlesefunktion – nur Erwachsenentext. */
export function karteText(karte) {
  if (!karte) return '';
  return [
    karte.titel,
    ...(karte.wasDuVorbereitest ?? []),
    karte.wasDeinKindTut,
    `Sicherheit: ${karte.sicherheit}`,
    karte.schlafhinweis ? `Zum Schlafen: ${karte.schlafhinweis}` : '',
    karte.abbruchzeichen && karte.abbruchzeichen !== '–' ? `Aufhören: ${karte.abbruchzeichen}` : '',
  ].filter(Boolean).join(' ');
}

/** Alle Texte einer Karte, die ein Erwachsener zu lesen bekommt. */
function karteTexte(karte) {
  const flach = [];
  for (const feld of ANWEISUNGS_FELDER) {
    const wert = karte[feld];
    if (Array.isArray(wert)) flach.push(...wert.map(String));
    else if (wert) flach.push(String(wert));
  }
  return flach;
}

/** Spanne eines WHO-Fensters als Satz – nie als Ziel. */
export function fensterSatz(daten, id) {
  const f = (daten?.whoFenster?.schritte ?? []).find((s) => s.id === id);
  if (!f) return '';
  const zahl = (n) => String(n).replace('.', ',');
  return `${f.name}: zwischen etwa ${zahl(f.von)} und ${zahl(f.bis)} Monaten`
    + ` (1. bis 99. Perzentile, WHO)${f.nichtAlle ? ' – und nicht jedes Kind tut es überhaupt' : ''}.`;
}

/**
 * Validiert die Kartei. Alle tragenden Regeln stehen hier und nicht in der
 * Redaktion. Die Ausschlussliste ist von den Textnetzen ausgenommen: sie
 * MUSS das gesperrte Vokabular nennen, um es auszuschließen.
 */
export function pruefeDaten(daten) {
  const fehler = [];
  const karten = daten?.karten;
  if (!Array.isArray(karten) || karten.length < 10) fehler.push('karten: mindestens 10 erwartet');

  const koennenIds = new Set((daten?.koennen ?? []).map((k) => k.id));
  if (koennenIds.size < 5) fehler.push('koennen: mindestens 5 beobachtbare Stufen erwartet');
  for (const k of daten?.koennen ?? []) {
    // Komposita sind hier absichtlich mitgemeint, darum KEINE Anfangsgrenze
    // und das `i`-Flag: „Lebensmonat“ und „Lebenswoche“ tragen den Stamm
    // klein und hinter einem Wortzeichen und entgingen `/\bMonat|\bWoche/`
    // doppelt. apps/sprich-mit-mir macht es richtig, hier war es falsch.
    if (ALTER_IN_STUFE.test(`${k.name} ${k.beschreibung}`)) {
      fehler.push(`koennen ${k.id}: nennt ein Alter – die Kartei ist nach Können geordnet, nicht nach Monaten`);
    }
  }

  const ids = new Set();
  for (const k of karten ?? []) {
    const wo = `Karte ${k.id || '?'}`;
    if (!k.id || ids.has(k.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
    ids.add(k.id);
    if (!koennenIds.has(k.koennen)) fehler.push(`${wo}: koennen ${k.koennen} unbekannt`);
    if (!AUSGANGSLAGEN.includes(k.ausgangslage)) fehler.push(`${wo}: ausgangslage „${k.ausgangslage}“ steht nicht in der geschlossenen Liste`);
    if (!ROLLEN.includes(k.rolle)) fehler.push(`${wo}: rolle „${k.rolle}“ steht nicht in der geschlossenen Liste – „üben“ gibt es nicht`);
    if (!ORTE.includes(k.ort)) fehler.push(`${wo}: ort „${k.ort}“ – es gibt nur den Boden und den Arm`);
    if (!Array.isArray(k.wasDuVorbereitest) || k.wasDuVorbereitest.length < 2) {
      fehler.push(`${wo}: wasDuVorbereitest braucht mindestens zwei Schritte an der Umgebung`);
    }
    if (!k.wasDeinKindTut) fehler.push(`${wo}: wasDeinKindTut fehlt – ohne das wäre die Karte eine Anweisung ans Kind`);
    if (!k.sicherheit || String(k.sicherheit).length < 20) fehler.push(`${wo}: sicherheit fehlt oder ist zu kurz`);
    if (!k.abbruchzeichen) fehler.push(`${wo}: abbruchzeichen fehlt – das Aufhören ist die Regel`);

    // Bauchlage ist ohne den Schlafsatz nicht ausdrückbar.
    if (k.ausgangslage === 'bauchlage-wach') {
      const s = String(k.schlafhinweis ?? '');
      if (!s) fehler.push(`${wo}: bauchlage-wach ohne schlafhinweis`);
      else if (!/Rücken/.test(s) || !/[Ss]chlaf/.test(s)) {
        fehler.push(`${wo}: der schlafhinweis muss „Rücken“ und „Schlaf“ beide nennen`);
      }
      if (!/[Ww]ach/.test(String(k.sicherheit))) {
        fehler.push(`${wo}: bei Bauchlage muss der Sicherheitssatz den Wachzustand nennen`);
      }
    } else if (k.schlafhinweis && !/Rücken/.test(String(k.schlafhinweis))) {
      fehler.push(`${wo}: schlafhinweis ohne „Rücken“`);
    }

    // Textnetze auf dem, was der Erwachsene als Anweisung liest.
    for (const text of karteTexte(k)) {
      for (const g of GESPERRTES_VOKABULAR) {
        if (g.muster.test(text)) fehler.push(`${wo}: „${g.wort}“ gehört nicht in eine Karte – siehe Ausschlussliste`);
      }
      if (ABZAEHLEN.test(text)) fehler.push(`${wo}: Zahl im Anweisungstext – die Kartei kennt keine Wiederholungszahlen`);
      if (SEITE.test(text)) fehler.push(`${wo}: nennt eine Seite`);
    }
    if (GESPERRTE_WIRKUNG.test(JSON.stringify(k))) {
      fehler.push(`${wo}: Wirkversprechen – bei gesunden reifen Säuglingen nicht belegt`);
    }

    // Einschränkende Felder: gesperrtes Vokabular nur VERNEINT.
    for (const feld of EINSCHRAENKENDE_FELDER) {
      const wert = Array.isArray(k[feld]) ? k[feld].join(' ') : String(k[feld] ?? '');
      if (!wert) continue;
      for (const g of GESPERRTES_VOKABULAR) {
        for (const m of wert.matchAll(new RegExp(g.muster.source, 'gi'))) {
          const davor = wert.slice(Math.max(0, m.index - 40), m.index);
          if (!/\bkein\w*\s*$|\bnicht\w*\s*$|\bohne\s*$|\bnie\s*$|\bstatt\s*$/i.test(davor)) {
            fehler.push(`${wo}.${feld}: „${g.wort}“ steht dort nicht verneint – auch ein Sicherheitshinweis führt es nicht ein`);
          }
        }
      }
    }

    // Gefährliche Zubereitungen: in den Anweisungsfeldern gar nicht, in den
    // übrigen nur verneint („kein Kampfer“, „nichts ins Gesicht“).
    for (const feld of ANWEISUNGS_FELDER) {
      const wert = Array.isArray(k[feld]) ? k[feld].join(' ') : String(k[feld] ?? '');
      if (GEFAEHRLICHE_ZUBEREITUNG.test(wert)) {
        fehler.push(`${wo}.${feld}: nennt eine für Säuglinge ungeeignete Zubereitung in einem Anweisungsfeld`);
      }
    }
    for (const feld of Object.keys(k)) {
      if (ANWEISUNGS_FELDER.includes(feld)) continue;
      const wert = Array.isArray(k[feld]) ? k[feld].join(' ') : String(k[feld] ?? '');
      // An JEDER Fundstelle prüfen, nicht an der ersten. `indexOf(treffer)`
      // fand immer das erste Vorkommen derselben Zeichenfolge: stand
      // „kein Kampfer“ vor „mit Kampfer einreiben“, galt der zweite,
      // bejahende Gebrauch als verneint und rutschte durch.
      for (const m of wert.matchAll(new RegExp(GEFAEHRLICHE_ZUBEREITUNG.source, 'gi'))) {
        const davor = wert.slice(Math.max(0, m.index - 40), m.index);
        if (!/\bkein\w*\s*$|\bnicht\w*\s*$|\bohne\s*$/i.test(davor)) {
          fehler.push(`${wo}.${feld}: „${m[0]}“ steht nicht verneint – erlaubt ist nur der Ausschluss`);
        }
      }
    }

    // Jede Karte sagt, aus welchem Quellziel sie kommt.
    if (!Array.isArray(k.quellZiel) || !k.quellZiel.length) fehler.push(`${wo}: quellZiel fehlt`);
    for (const z of k.quellZiel ?? []) {
      const gueltig = (Number.isInteger(z) && z >= 1 && z <= 26) || /^g(0[1-9]|1[0-6])$/.test(String(z));
      if (!gueltig) fehler.push(`${wo}: quellZiel „${z}“ liegt außerhalb der Quelle (26 Ziele, 16 Maßnahmen)`);
    }
  }

  // Die Ausschlussliste ist Teil der Daten, nicht des Vorworts.
  const aus = daten?.ausgeschlossen;
  if (!Array.isArray(aus) || aus.length < 10) fehler.push('ausgeschlossen: mindestens 10 Einträge erwartet');
  for (const a of aus ?? []) {
    if (!a.was || !a.grund || String(a.grund).length < 40) fehler.push(`ausgeschlossen ${a.id || '?'}: was/grund fehlt oder ist zu kurz`);
  }

  // Die Bilanz muss zu den Karten passen – ein Dokument darf nicht mehr
  // behaupten als die Daten hergeben (docs/02).
  const z = daten?.quelle?.zahlen ?? {};
  const belegt = new Set((karten ?? []).flatMap((k) => (k.quellZiel ?? []).filter(Number.isInteger)));
  if (z.bewegungszieleQuelle !== 26) fehler.push('quelle.zahlen: die Quelle nennt 26 Bewegungsziele');
  if (z.gymnastikMassnahmenQuelle !== 16) fehler.push('quelle.zahlen: die Quelle nennt 16 Gymnastik-/Massage-Maßnahmen');
  if (z.sicherheitszieleQuelle !== 4) fehler.push('quelle.zahlen: die Quelle nennt 4 Sicherheitsziele');
  if (belegt.size !== z.bewegungszieleUebernommen) {
    fehler.push(`quelle.zahlen: ${z.bewegungszieleUebernommen} übernommene Ziele behauptet, die Karten belegen ${belegt.size}`);
  }
  if (z.bewegungszieleUebernommen + z.bewegungszieleNichtUebernommen !== 26) {
    fehler.push('quelle.zahlen: übernommen plus nicht übernommen muss 26 ergeben');
  }
  if (z.gymnastikUebernommen + z.gymnastikNichtUebernommen !== 16) {
    fehler.push('quelle.zahlen: übernommen plus nicht übernommen muss 16 ergeben');
  }
  // Der WEITERE Anspruch wird abgewiesen, nicht nur der engere verlangt.
  // Vorher prüfte nur die Anwesenheit von „keine Säuglingsgymnastik"; ein
  // hinweis, der BEIDES enthielt, wäre durchgegangen - und genau das
  // behauptete das GDD als geprüft (Review der Welle 78).
  // Auf die WENDUNG, nicht auf die Verneinung davor: „keine Karte
  // beschreibt einen Handgriff am Kind" setzt zwischen „keine" und
  // „Handgriff" noch ein Wort, und die erste Fassung dieser Regel verlangte
  // sie direkt hintereinander - sie liess den Satz durch, den sie abweisen
  // sollte (von der eigenen Gegenprobe gefunden). Der verengte Kernsatz hat
  // für diese Wendung keinen Grund, also ist sie im `hinweis` ganz gesperrt.
  const ZU_WEIT = /(Handgriff|Handgriffe|Griff|Berührung)\w*\s+am\s+Kind|nichts am Körper des Kindes|keine Karte berührt/i;
  if (ZU_WEIT.test(daten?.hinweis ?? '')) {
    fehler.push('hinweis: der Anspruch geht zu weit – Tragen, Ablegen und flächiges Streichen kommen vor; er darf nur so weit gehen, wie er stimmt');
  }

  // Die Bodenregel gilt nicht fuer jede Karte: eine spielt auf dem Arm. Wer
  // sie als allgemein ausgibt, behauptet mehr als die Daten (Review der
  // Welle 78). Darum muss sie ihren Geltungsbereich und die Ausnahme selbst
  // nennen, sobald es eine Karte mit `ort: 'auf-dem-arm'` gibt.
  const aufDemArm = (karten ?? []).filter((k) => k.ort === 'auf-dem-arm' || k.ausgangslage === 'auf-dem-arm');
  const regel = String(daten?.bodenregel ?? '');
  if (!regel) fehler.push('bodenregel fehlt');
  if (aufDemArm.length) {
    if (!/auf dem Boden|bei der dein Kind liegt/.test(regel)) {
      fehler.push('bodenregel: der Geltungsbereich fehlt – sie gilt nicht für die Karte auf dem Arm');
    }
    if (!/Ausnahme/.test(regel)) {
      fehler.push('bodenregel: die Ausnahme für den Arm muss benannt sein');
    }
  }

  if (!/Eigenproduktion/.test(daten?.quelle?.uebernommen ?? '')) {
    fehler.push('quelle.uebernommen muss „Eigenproduktion“ aussprechen');
  }

  // Die Bilanz 16 = übernommen + nicht übernommen muss in den DATEN
  // nachvollziehbar sein, nicht nur in der Zahl: jede der 16 Maßnahmen ist
  // entweder einer Karte zugeordnet oder in der Ausschlussliste genannt.
  // Vorher fehlten zwei (g04 und g15) ganz, und die Zahl stimmte trotzdem.
  const gUebernommen = new Set((karten ?? []).flatMap((k) => (k.quellZiel ?? []).filter((z) => typeof z === 'string')));
  const gAusgeschlossen = new Set((aus ?? []).flatMap((a) => String(a.quellNr ?? '').match(/g\d{2}/g) ?? []));
  const fehlende = [];
  for (let i = 1; i <= z.gymnastikMassnahmenQuelle; i++) {
    const id = `g${String(i).padStart(2, '0')}`;
    if (!gUebernommen.has(id) && !gAusgeschlossen.has(id)) fehlende.push(id);
  }
  if (fehlende.length) {
    fehler.push(`Gymnastik-Bilanz: ${fehlende.join(', ')} ist weder einer Karte zugeordnet noch in der Ausschlussliste genannt`);
  }
  if (gUebernommen.size !== z.gymnastikUebernommen) {
    fehler.push(`quelle.zahlen: ${z.gymnastikUebernommen} übernommene Maßnahmen behauptet, die Karten belegen ${gUebernommen.size}`);
  }
  if (gAusgeschlossen.size !== z.gymnastikNichtUebernommen) {
    fehler.push(`quelle.zahlen: ${z.gymnastikNichtUebernommen} ausgeschlossene Maßnahmen behauptet, die Liste nennt ${gAusgeschlossen.size}`);
  }

  // WHO-Spannen: Zahlen nur mit Quelle, und nie als Ziel.
  const f = daten?.whoFenster;
  if (!f || !Array.isArray(f.schritte) || f.schritte.length < 5) fehler.push('whoFenster: mindestens 5 Spannen erwartet');
  if (!/WHO/.test(f?.quelle ?? '')) fehler.push('whoFenster.quelle fehlt');
  if (!/keine Ziele|kein Plan/.test(f?.hinweis ?? '')) fehler.push('whoFenster.hinweis muss sagen, dass die Spannen keine Ziele sind');
  for (const s of f?.schritte ?? []) {
    if (!(s.von > 0) || !(s.bis > s.von)) fehler.push(`whoFenster ${s.id}: Spanne unplausibel`);
    if (s.bis - s.von < 3) fehler.push(`whoFenster ${s.id}: eine Spanne unter drei Monaten behauptet eine Präzision, die die Daten nicht haben`);
  }
  const krabbeln = (f?.schritte ?? []).find((s) => s.id === 'krabbeln');
  if (!krabbeln?.nichtAlle) fehler.push('whoFenster: beim Krabbeln muss stehen, dass es nicht alle Kinder tun');

  // Pflichtsätze.
  for (const [feld, muster, was] of [
    ['hinweis', /keine Säuglingsgymnastik/, 'der Kernsatz muss dastehen – und nur so weit gehen, wie er stimmt'],
    ['hinweis', /flächig streichen als Kontakt/, 'die eine Karte mit Körperkontakt muss im Kernsatz genannt sein'],
    ['hinweis', /Boden/, 'der Boden als Ort muss im Vorwort stehen'],
    ['bodenregel', /nie auf Wickeltisch/, 'die Bodenregel braucht eine eigene Fassung für das Druckblatt'],
    ['geraet', /Ihrer Hand|in Ihrer Hand/, 'das Gerät gehört dem Erwachsenen'],
    ['keinPlan', /speichert nichts/, 'es muss dastehen, dass nichts gespeichert wird'],
    ['abbruch', /Aufhören ist die Regel/, 'das Aufhören muss als Regel benannt sein'],
    ['schuetteln', /0800 111 0 550/, 'das Elterntelefon muss dastehen'],
    // KEIN `.*` über Satzgrenzen: in „… eine App nicht. Keine Stelle hat sie
    // geprüft …“ hätte ein `/nicht.*freigegeben/` auch dann gegriffen, wenn
    // der zweite Satz eine Freigabe BEHAUPTET. Darum der Satz selbst.
    ['zustaendigkeit', /Keine der genannten Stellen hat (sie|diese Kartei) geprüft oder freigegeben/,
      'der Satz, dass keine Fachstelle die Kartei geprüft hat, muss wörtlich dastehen'],
    ['wege', /vier von hundert/, 'der Krabbel-Satz muss die Größenordnung nennen'],
  ]) {
    if (!muster.test(daten?.[feld] ?? '')) fehler.push(`${feld}: ${was}`);
  }
  return fehler;
}
