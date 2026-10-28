// Uhr- und Kalender-Kind: reine Logik (ohne DOM), testbar. Analoguhr-Winkel,
// kindgerechte Uhrzeit-Sprache (volle/halbe/Viertelstunde) und Prüfung der
// Fragenbank. Praleska docs/10 (Top-30 Nr. 24).

/** Zeigerwinkel in Grad (0° = 12 Uhr, im Uhrzeigersinn). */
export function zeigerWinkel(stunde, minute) {
  return {
    minute: minute * 6,
    stunde: ((stunde % 12) * 30) + minute * 0.5,
  };
}

/** Kindgerechte Uhrzeit: volle Stunde, halb, Viertel nach, Viertel vor. */
export function uhrText(stunde, minute) {
  const s = ((stunde - 1) % 12) + 1; // 1..12
  const naechste = (s % 12) + 1;
  if (minute === 0) return `${s} Uhr`;
  if (minute === 30) return `halb ${naechste}`;
  if (minute === 15) return `Viertel nach ${s}`;
  if (minute === 45) return `Viertel vor ${naechste}`;
  return `${s} Uhr ${minute}`;
}

/** Optionstexte einer Uhr-Frage: richtige Zeit + Ablenker (Reihenfolge wie geliefert). */
export function uhrOptionen(frage) {
  return [frage.zeit, ...frage.ablenker].map((z) => uhrText(z.stunde, z.minute));
}

/** Prüft die Fragenbank. Liefert Fehlerliste (leer = gültig). */
export function pruefeFragen(daten) {
  const fehler = [];
  if (!Array.isArray(daten?.fragen) || daten.fragen.length < 10) return ['zu wenige Fragen'];
  const ids = new Set();
  const ERLAUBT = [0, 15, 30, 45];
  for (const q of daten.fragen) {
    if (!q.id || ids.has(q.id)) fehler.push(`Id fehlt/doppelt: ${q.id}`);
    ids.add(q.id);
    if (!q.erklaerung || q.erklaerung.length < 20) fehler.push(`${q.id}: Erklärung fehlt`);
    if (q.typ === 'uhr') {
      if (!ERLAUBT.includes(q.zeit?.minute)) fehler.push(`${q.id}: Minute nur 0/15/30/45`);
      if (!Array.isArray(q.ablenker) || q.ablenker.length !== 2) fehler.push(`${q.id}: 2 Ablenker`);
      const texte = uhrOptionen(q);
      if (new Set(texte).size !== texte.length) fehler.push(`${q.id}: Ablenker klingt wie die richtige Zeit`);
    } else if (q.typ === 'kalender') {
      if (!Array.isArray(q.antworten) || q.antworten.length !== 3) fehler.push(`${q.id}: 3 Antworten`);
      if (!Number.isInteger(q.korrekt) || q.korrekt < 0 || q.korrekt > 2) fehler.push(`${q.id}: korrekt 0..2`);
    } else {
      fehler.push(`${q.id}: unbekannter Typ ${q.typ}`);
    }
  }
  const typen = new Set(daten.fragen.map((q) => q.typ));
  if (!typen.has('uhr') || !typen.has('kalender')) fehler.push('beide Typen (uhr/kalender) nötig');
  return fehler;
}

// Zahlwörter in den Antworten: eins bis neunzehn, die Zehner und einige Schreibweisen ohne Umlaut.
// „ein“ ist kein Zahlwort, sondern ein Artikel; nur in Zusammensetzungen („einundzwanzig“, „eineinhalb“) zählt es als eins.
const EINER = { eins: 1, zwei: 2, drei: 3, vier: 4, fünf: 5, fuenf: 5, sechs: 6, sieben: 7, acht: 8, neun: 9 };
const ZEHNER = {
  zwanzig: 20, dreißig: 30, dreissig: 30, vierzig: 40, fünfzig: 50, fuenfzig: 50, funfzig: 50,
  sechzig: 60, siebzig: 70, siebenzig: 70, achtzig: 80, neunzig: 90,
};
const ZAHLWOERTER = {
  ...EINER, ...ZEHNER,
  zehn: 10, elf: 11, zwölf: 12, zwoelf: 12, zwolf: 12, dreizehn: 13, vierzehn: 14, fünfzehn: 15, fuenfzehn: 15,
  sechzehn: 16, siebzehn: 17, achtzehn: 18, neunzehn: 19,
};
// Einer in Zusammensetzungen: „einundzwanzig“, „ein und zwanzig“, „eineinhalb“.
const ZUSAMMENGESETZT = { ein: 1, ...EINER };
// Alle Zahlwörter für halbe Werte („zwölfeinhalb“) und für Einheiten („Vierwochen“).
const WORTWERT = { ...ZUSAMMENGESETZT, ...ZAHLWOERTER };
// Einheiten, die direkt an eine Zahl geschrieben werden: „Vierwochen“, „dreimal“, „Zweitage“.
const EINHEIT = /^(wochen?|wöchig|monat|tag|täg|jahr|mal)/u;
// Die Ziffernblöcke, die nicht ASCII sind (arabisch-indisch, persisch, Devanagari, Bengali); NFKC macht sie nicht zu 0–9.
const ZIFFERNBLOECKE = [0x0660, 0x06f0, 0x0966, 0x09e6];

/**
 * Alle Zahlen einer Antwort, als Ziffern oder Zahlwörter: „5“, „fünf“ und „Fünf Wochen“ ergeben [5],
 * „Drei und Vier“ ergibt [3, 4]. Eine Zusammensetzung („vierundzwanzig“, „vier-und-zwanzig“, „ein und zwanzig“)
 * ist eine einzige Zahl (24, 21). Ein halber Wert („4½“, „viereinhalb“) zählt als die beiden ganzen Zahlen
 * daneben, also [4, 5]; ½, ¼ und ¾ ohne Zahl davor zählen als 0 und 1. Zusammengeschriebene Einheiten
 * („Vierwochen“, „dreimal“, „siebentägig“) zählen. Unsichtbare Zeichen werden entfernt. Ziffern aus arabisch-indischer,
 * persischer, Devanagari- und Bengali-Schrift werden umgesetzt, andere Schriften nicht.
 * Nicht gelesen werden römische Ziffern (IV) und Synonyme (Quartal, Vierteljahr). Bekannte Fehllesungen gehen
 * in die sichere Richtung: „1.000“ ergibt [1, 0], „4 1/2“ ergibt [4, 1, 2].
 * @returns {number[]}
 */
export function zahlen(antwort) {
  const text = String(antwort)
    .replace(/(\d+)\s*½/g, '$1,5')
    .replace(/[½¼¾]/g, ' 0 1 ')
    .normalize('NFKC')
    .replace(/\p{Cf}/gu, '')
    .replace(/\p{Nd}/gu, (z) => {
      const code = z.codePointAt(0);
      const basis = ZIFFERNBLOECKE.find((b) => code >= b && code < b + 10);
      return basis === undefined ? z : String(code - basis);
    })
    .toLowerCase();
  const teile = text.match(/\d+|\p{L}+/gu) ?? [];
  const gefunden = [];
  for (let i = 0; i < teile.length; i++) {
    const teil = teile[i];
    const halb = teil.match(/^(\p{L}+)einhalb$/u);
    const verbunden = teil.match(/^(\p{L}+?)und(\p{L}+)$/u);
    if (/^\d+$/.test(teil)) {
      gefunden.push(Number(teil));
    } else if (teil === 'anderthalb') {
      gefunden.push(1, 2);
    } else if (halb && Object.hasOwn(WORTWERT, halb[1])) {
      gefunden.push(WORTWERT[halb[1]], WORTWERT[halb[1]] + 1);
    } else if (verbunden && Object.hasOwn(ZUSAMMENGESETZT, verbunden[1]) && Object.hasOwn(ZEHNER, verbunden[2])) {
      gefunden.push(ZUSAMMENGESETZT[verbunden[1]] + ZEHNER[verbunden[2]]);
    } else if (Object.hasOwn(ZUSAMMENGESETZT, teil) && teile[i + 1] === 'und' && Object.hasOwn(ZEHNER, teile[i + 2])) {
      gefunden.push(ZUSAMMENGESETZT[teil] + ZEHNER[teile[i + 2]]);
      i += 2;
    } else if (Object.hasOwn(ZAHLWOERTER, teil)) {
      gefunden.push(ZAHLWOERTER[teil]);
    } else {
      const wort = Object.keys(WORTWERT).filter((w) => teil.startsWith(w) && EINHEIT.test(teil.slice(w.length)))
        .sort((a, b) => b.length - a.length)[0];
      if (wort !== undefined) gefunden.push(WORTWERT[wort]);
    }
  }
  return gefunden;
}

/** Ganzzahliger Rest modulo n, auch für negative Werte (Wert zwischen 0 und n-1). */
function mod(wert, n) {
  return ((wert % n) + n) % n;
}

// Die Marke für Seitenangaben (docs/02 Z. 151–152; Entscheidung A18). Sie steht bei jeder Quelle.
export const PFLICHTMARKIERUNG = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';

/**
 * Die Beziehungen des Kalenders (Quelle S. 233): wie viele Einheiten zu welcher größeren gehören.
 * Der Monat hat vier bis fünf Wochen; die Prüfung lässt beide Zahlen zu.
 */
export function kalenderBeziehungen() {
  return [
    { von: 'Tag', nach: 'Woche', anzahl: [7], quelle: 'S. 233', markierung: PFLICHTMARKIERUNG },
    { von: 'Woche', nach: 'Monat', anzahl: [4, 5], quelle: 'S. 233', markierung: PFLICHTMARKIERUNG },
    { von: 'Monat', nach: 'Jahreszeit', anzahl: [3], quelle: 'S. 233', markierung: PFLICHTMARKIERUNG },
    { von: 'Jahreszeit', nach: 'Jahr', anzahl: [4], quelle: 'S. 233', markierung: PFLICHTMARKIERUNG },
  ];
}

// Seitenangabe im Format „S. 233“ oder „S. 233–234“.
const SEITENANGABE = /^S\. \d+(?:[–-]\d+)?$/;

/**
 * Prüft die Kalenderfragen (typ kalender). Eine Frage aus dem Buch braucht eine Seitenangabe im Format
 * „S. 233“ (quelle.seite); eigene Entwürfe (eigenentwurf: true) brauchen keine, weil sie aus keiner Seite
 * stammen. Eine Frage mit Beziehung (Felder beziehung und zahl) muss zur Beziehung passen: die richtige
 * Antwort nennt genau diese Zahl und keine andere, keine falsche Antwort nennt eine Zahl der Beziehung.
 * Liefert Fehlerliste (leer = gültig).
 * @param {object[]} fragen
 * @param {object[]} beziehungen
 * @returns {string[]}
 */
export function pruefeKalenderFragen(fragen, beziehungen) {
  const fehler = [];
  const nachSchluessel = Object.fromEntries(beziehungen.map((b) => [`${b.von}-${b.nach}`.toLowerCase(), b]));
  for (const q of fragen.filter((x) => x.typ === 'kalender')) {
    if (q.eigenentwurf !== true && !SEITENANGABE.test(q.quelle?.seite ?? '')) {
      fehler.push(`${q.id}: Seitenangabe fehlt oder ist nicht im Format „S. n“`);
    }
    if (!q.beziehung) continue;
    const b = nachSchluessel[q.beziehung];
    if (!b) {
      fehler.push(`${q.id}: unbekannte Beziehung ${q.beziehung}`);
      continue;
    }
    if (!b.anzahl.includes(q.zahl)) fehler.push(`${q.id}: ${q.zahl} passt nicht zu ${b.von} und ${b.nach}`);
    const richtig = q.antworten[q.korrekt];
    const zahlenRichtig = zahlen(richtig);
    if (zahlenRichtig.length !== 1 || zahlenRichtig[0] !== q.zahl) {
      fehler.push(`${q.id}: die richtige Antwort „${richtig}“ ist nicht ${q.zahl}`);
    }
    q.antworten.forEach((antwort, i) => {
      if (i !== q.korrekt && zahlen(antwort).some((z) => b.anzahl.includes(z))) {
        fehler.push(`${q.id}: die falsche Antwort „${antwort}“ passt auch zu ${b.von} und ${b.nach}`);
      }
    });
  }
  return fehler;
}

// Mischt eine Liste nach einer Reihe ganzer Zahlen (Fisher-Yates ohne Zufallsquelle).
function mischeMit(liste, reihe) {
  const kopie = [...liste];
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = mod(reihe[kopie.length - 1 - i] ?? 0, i + 1);
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

/**
 * Eine Tageszeit-Frage aus Begriffen. begriffe: [{ name, beschreibung }], mindestens drei, Namen
 * eindeutig, Beschreibung nicht leer. Die Zufallsreihe (mindestens vier ganze Zahlen) entscheidet:
 * Element 0 wählt die richtige Antwort, Element 1 wählt eines der Paare aus den übrigen Begriffen (jedes
 * Paar ist möglich), ab Element 2 wird gemischt. Die Funktion hat selbst keine Zufallsquelle.
 * @returns {{ frage: string, optionen: string[], richtig: string }}
 */
export function tageszeitFrage(begriffe, zufallsReihe) {
  if (!Array.isArray(begriffe) || begriffe.length < 3) throw new RangeError('mindestens drei Begriffe');
  if (new Set(begriffe.map((b) => b.name)).size !== begriffe.length) throw new RangeError('Namen der Begriffe müssen eindeutig sein');
  if (begriffe.some((b) => !b.name || !b.beschreibung)) throw new RangeError('jeder Begriff braucht Name und Beschreibung');
  if (!Array.isArray(zufallsReihe) || zufallsReihe.length < 4) throw new RangeError('mindestens vier Zahlen in der Zufallsreihe');
  if (!zufallsReihe.every(Number.isInteger)) throw new RangeError('die Zufallsreihe braucht ganze Zahlen');
  const richtig = begriffe[mod(zufallsReihe[0], begriffe.length)];
  const andere = begriffe.filter((b) => b !== richtig);
  const paare = [];
  for (let i = 0; i < andere.length; i++) {
    for (let j = i + 1; j < andere.length; j++) paare.push([andere[i], andere[j]]);
  }
  const ablenker = paare[mod(zufallsReihe[1], paare.length)];
  const optionen = mischeMit([richtig, ...ablenker], zufallsReihe.slice(2));
  return {
    frage: `Wie heißt es, wenn ${richtig.beschreibung}?`,
    optionen: optionen.map((b) => b.name),
    richtig: richtig.name,
  };
}
