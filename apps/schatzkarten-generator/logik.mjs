// Schatzkarten-Generator, Logik ohne DOM.
//
// Erzeugt eine Orientierungskarte: ein quadratisches Raster, Start und Ziel
// (Zufall über den Parameter rng), Zeichen auf Feldern und den kürzesten Weg
// dazwischen. Die Wegbeschreibung entsteht aus Richtung und Schritten. Sie
// nennt „geradeaus“, „links“, „rechts“ oder „umdrehen“, jeweils von dem Kind
// aus gesehen, das auf dem Start steht und nach vorn schaut (Pfeil am Start).
//
// Quelle: Programm «Пралеска», S. 246 (Abschnitt „Подвижные игры“), nur für die
// Spielnamen. Raster, Zeichen, Wegkarten, Lösungsblatt und Ablauf sind
// Eigenentwurf der App; die Quelle beschreibt dafür keine Regeln und keine
// Kartenformen.

export const GITTER_MIN = 4;
export const GITTER_MAX = 8;
export const STANDARD_GITTER = 5;
export const STANDARD_ZEICHEN = 3;
export const STANDARD_ORT = 'park';

/** Feste Orte. Der Ort erscheint nur als Überschrift, nie als Adresse oder Name. */
export const ORTE = Object.freeze([
  Object.freeze({ id: 'gruppenraum', name: 'Gruppenraum' }),
  Object.freeze({ id: 'aussengelaende', name: 'Außengelände' }),
  Object.freeze({ id: 'park', name: 'Park' }),
  Object.freeze({ id: 'wohnung', name: 'Wohnung' }),
]);

/**
 * Feste Zeichenliste. `zeichen` ist ein Textzeichen (kein Bild), `kuerzel` der
 * Buchstabe für die Textdatei, `artikel` für den Satz „Dort liegt …“.
 */
export const SYMBOLE = Object.freeze([
  Object.freeze({ id: 'kreis', name: 'Kreis', artikel: 'der Kreis', zeichen: '●', kuerzel: 'K' }),
  Object.freeze({ id: 'dreieck', name: 'Dreieck', artikel: 'das Dreieck', zeichen: '▲', kuerzel: 'D' }),
  Object.freeze({ id: 'raute', name: 'Raute', artikel: 'die Raute', zeichen: '◆', kuerzel: 'R' }),
  Object.freeze({ id: 'quadrat', name: 'Quadrat', artikel: 'das Quadrat', zeichen: '■', kuerzel: 'T' }),
  Object.freeze({ id: 'herz', name: 'Herz', artikel: 'das Herz', zeichen: '♥', kuerzel: 'H' }),
  Object.freeze({ id: 'sonne', name: 'Sonne', artikel: 'die Sonne', zeichen: '☀︎', kuerzel: 'U' }),
]);

const BUCHSTABEN = 'ABCDEFGH';

// Himmelsrichtungen im Uhrzeigersinn. N = vorn (Pfeil am Start), O = rechts,
// S = hinten, W = links. Die Wegkarten sagen nie „oben“ oder „unten“.
const RICHTUNGEN = ['N', 'O', 'S', 'W'];
const VERSCHIEBUNG = { N: [0, -1], O: [1, 0], S: [0, 1], W: [-1, 0] };
// Index = Drehungen im Uhrzeigersinn gegenüber der bisherigen Blickrichtung.
const DREHUNG = ['geradeaus', 'rechts', 'umdrehen', 'links'];

const QUELLE_SPIELE = 'Spielnamen aus der Quelle (Programm «Пралеска», S. 246, eigene Übersetzung): '
  + '„Mit der Karte unterwegs“, „Versteck den Gegenstand und beschreibe den Weg“.';
export const QUELLE_KARTEN = `${QUELLE_SPIELE} Raster, Zeichen, Wegkarten und Ablauf: Eigenentwurf der App.`;
export const QUELLE_LOESUNG = `${QUELLE_SPIELE} Raster, Zeichen, Wegkarten, Lösungsblatt und Ablauf: `
  + 'Eigenentwurf der App. Nur für Erwachsene.';

const gleich = (a, b) => a.s === b.s && a.z === b.z;
const schluessel = (c) => `${c.s},${c.z}`;
const abstand = (a, b) => Math.abs(a.s - b.s) + Math.abs(a.z - b.z);

/** Das Zeichen zu einer Art-Kennung. Unbekannte Kennungen werfen einen Fehler. */
function symbolVon(id) {
  const symbol = SYMBOLE.find((s) => s.id === id);
  if (!symbol) throw new Error(`Unbekanntes Zeichen: ${id}`);
  return symbol;
}

/** Den Namen eines Ortes zur Kennung. */
export function ortName(id) {
  const ort = ORTE.find((o) => o.id === id);
  if (!ort) throw new Error(`Unbekannter Ort: ${id}`);
  return ort.name;
}

/** Koordinate eines Feldes, zum Beispiel „C4“ (Spalte Buchstabe, Zeile Zahl ab 1). */
export function koordinate(c) {
  return `${BUCHSTABEN[c.s]}${c.z + 1}`;
}

/**
 * Prüft die Eingaben aus der Oberfläche. Gibt die Fehlermeldungen zurück,
 * eine leere Liste heißt: gültig.
 */
export function pruefeEingaben({ groesse, ort, anzahlZeichen } = {}) {
  const fehler = [];
  if (!Number.isInteger(groesse) || groesse < GITTER_MIN || groesse > GITTER_MAX) {
    fehler.push(`Die Gittergröße liegt zwischen ${GITTER_MIN} und ${GITTER_MAX} Feldern.`);
  }
  if (!ORTE.some((o) => o.id === ort)) fehler.push('Den Ort gibt es nicht.');
  if (!Number.isInteger(anzahlZeichen) || anzahlZeichen < 0 || anzahlZeichen > SYMBOLE.length) {
    fehler.push(`Die Anzahl der Zeichen liegt zwischen 0 und ${SYMBOLE.length}.`);
  }
  return fehler;
}

/** Alle Felder eines Gitters, zeilenweise von oben links nach unten rechts. */
export function zellenVon(groesse) {
  const felder = [];
  for (let z = 0; z < groesse; z++) {
    for (let s = 0; s < groesse; s++) felder.push({ s, z });
  }
  return felder;
}

/** Eine ganze Zahl von 0 bis anzahl−1 aus dem Zufallsgeber. */
function ganzeZahl(rng, anzahl) {
  const wert = rng();
  if (typeof wert !== 'number' || !(wert >= 0 && wert < 1)) {
    throw new Error('Der Zufallsgeber muss Zahlen von 0 (eingeschlossen) bis 1 (ausgeschlossen) liefern.');
  }
  return Math.min(anzahl - 1, Math.floor(wert * anzahl));
}

/** Mischt eine Kopie der Liste (Fisher-Yates), die Eingabe bleibt unverändert. */
function mischen(rng, liste) {
  const kopie = [...liste];
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = ganzeZahl(rng, i + 1);
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

/**
 * Die Himmelsrichtung von einem Feld zum benachbarten Feld.
 * Wirft einen Fehler, wenn die Felder nicht nebeneinander liegen.
 */
export function richtungZwischen(a, b) {
  for (const r of RICHTUNGEN) {
    const [ds, dz] = VERSCHIEBUNG[r];
    if (a.s + ds === b.s && a.z + dz === b.z) return r;
  }
  throw new Error(`Die Felder ${koordinate(a)} und ${koordinate(b)} liegen nicht nebeneinander.`);
}

/**
 * Wie sich das Kind dreht, wenn es in Blickrichtung `blick` steht und dann
 * in Richtung `richtung` gehen soll. Ergebnis: geradeaus, rechts, links oder
 * umdrehen. Links und rechts gelten vom Kind aus gesehen, nie vom Bildschirm.
 */
export function dreheRelativ(blick, richtung) {
  const n = RICHTUNGEN.length;
  const umdrehungen = (RICHTUNGEN.indexOf(richtung) - RICHTUNGEN.indexOf(blick) + n) % n;
  return DREHUNG[umdrehungen];
}

/**
 * Kürzester Weg von `von` nach `nach` über benachbarte Felder (Breitensuche,
 * feste Reihenfolge der Richtungen, daher immer derselbe Weg). Liefert alle
 * Felder inklusive Start und Ziel.
 */
export function sucheWeg(groesse, von, nach) {
  const vorher = new Map([[schluessel(von), null]]);
  const schlange = [von];
  for (let i = 0; i < schlange.length; i++) {
    const aktuell = schlange[i];
    if (gleich(aktuell, nach)) break;
    for (const r of RICHTUNGEN) {
      const [ds, dz] = VERSCHIEBUNG[r];
      const naechstes = { s: aktuell.s + ds, z: aktuell.z + dz };
      if (naechstes.s < 0 || naechstes.z < 0 || naechstes.s >= groesse || naechstes.z >= groesse) continue;
      const k = schluessel(naechstes);
      if (vorher.has(k)) continue;
      vorher.set(k, aktuell);
      schlange.push(naechstes);
    }
  }
  if (!vorher.has(schluessel(nach))) throw new Error('Es gibt keinen Weg zwischen Start und Ziel.');
  const weg = [];
  for (let c = nach; c; c = vorher.get(schluessel(c))) weg.unshift(c);
  return weg;
}

/**
 * Zerlegt den Weg in Abschnitte. Ein Abschnitt ist eine gerade Strecke in
 * einer Richtung. Er endet, wenn die Richtung wechselt, und auch auf einem
 * Feld mit Zeichen, damit das Zeichen als Wegmarke genannt werden kann.
 *
 * Gibt je Abschnitt zurück: nr, richtung (N/O/S/W), drehung (geradeaus,
 * rechts, links, umdrehen), schritte, zeichenArt (Kennung oder null) und
 * letzter (true beim Abschnitt, der am Ziel endet).
 */
export function beschreibeWeg(weg, zeichen = []) {
  if (weg.length < 2) throw new Error('Der Weg braucht mindestens zwei Felder.');
  const zeichenAuf = new Map(zeichen.map((z) => [schluessel(z), z.art]));
  const abschnitte = [];
  let aktuell = null;
  for (let i = 1; i < weg.length; i++) {
    const richtung = richtungZwischen(weg[i - 1], weg[i]);
    const wegmarkeDavor = zeichenAuf.has(schluessel(weg[i - 1]));
    if (!aktuell || aktuell.richtung !== richtung || wegmarkeDavor) {
      aktuell = { richtung, schritte: 0, ende: i };
      abschnitte.push(aktuell);
    }
    aktuell.schritte += 1;
    aktuell.ende = i;
  }
  let blick = 'N';
  return abschnitte.map((abschnitt, k) => {
    const drehung = dreheRelativ(blick, abschnitt.richtung);
    blick = abschnitt.richtung;
    return {
      nr: k + 1,
      richtung: abschnitt.richtung,
      drehung,
      schritte: abschnitt.schritte,
      zeichenArt: zeichenAuf.get(schluessel(weg[abschnitt.ende])) ?? null,
      letzter: abschnitt.ende === weg.length - 1,
    };
  });
}

/** Der Satz für einen Abschnitt der Wegbeschreibung, zum Beispiel „Geh 2 Felder geradeaus.“ */
export function satzZuSegment(segment) {
  const feld = segment.schritte === 1 ? '1 Feld' : `${segment.schritte} Felder`;
  const gang = {
    geradeaus: `Geh ${feld} geradeaus.`,
    rechts: `Biege rechts ab und geh ${feld}.`,
    links: `Biege links ab und geh ${feld}.`,
    umdrehen: `Dreh dich um und geh ${feld}.`,
  }[segment.drehung];
  const teile = [gang];
  if (segment.zeichenArt) teile.push(`Dort liegt ${symbolVon(segment.zeichenArt).artikel}.`);
  if (segment.letzter) teile.push('Hier endet der Weg.');
  return teile.join(' ');
}

/**
 * Erzeugt eine Karte. `rng` ist ein Zufallsgeber, der Zahlen von 0 bis unter 1
 * liefert (in der Seite: der Zufallsgeber der Oberfläche). Mit einem festen Zufallsgeber entsteht
 * immer dieselbe Karte, das macht die Tests deterministisch.
 *
 * Die Reihenfolge der Zufallsaufrufe ist fest: Start, Ziel, Zeichenfelder,
 * Zeichenarten.
 */
export function erzeugeKarte({
  groesse = STANDARD_GITTER,
  ort = STANDARD_ORT,
  anzahlZeichen = STANDARD_ZEICHEN,
  rng,
} = {}) {
  if (typeof rng !== 'function') throw new Error('erzeugeKarte braucht einen Zufallsgeber (rng).');
  const fehler = pruefeEingaben({ groesse, ort, anzahlZeichen });
  if (fehler.length) throw new Error(fehler.join(' '));

  const felder = zellenVon(groesse);
  const start = felder[ganzeZahl(rng, felder.length)];
  // Das Ziel liegt mindestens so viele Schritte weg, wie das Gitter Seiten hat
  // minus eins. So wird der Weg nie zu kurz für die Karte.
  const ziele = felder.filter((c) => abstand(c, start) >= groesse - 1);
  const ziel = ziele[ganzeZahl(rng, ziele.length)];
  const frei = mischen(rng, felder.filter((c) => !gleich(c, start) && !gleich(c, ziel)));
  const arten = mischen(rng, SYMBOLE).slice(0, anzahlZeichen);
  const zeichen = arten.map((symbol, i) => ({ art: symbol.id, s: frei[i].s, z: frei[i].z }));
  const weg = sucheWeg(groesse, start, ziel);
  const segmente = beschreibeWeg(weg, zeichen);
  return { groesse, ort, start, ziel, zeichen, weg, segmente };
}

/** Die Karten der Wegbeschreibung: zuerst die Startkarte, dann je ein Abschnitt. */
export function wegkarten(karte) {
  const texte = [
    'Stell dich auf das Feld Start. Halte die Karte so, dass der Pfeil am Start nach vorn zeigt.',
    ...karte.segmente.map(satzZuSegment),
  ];
  const gesamt = texte.length;
  return texte.map((text, i) => ({ nr: i + 1, gesamt, titel: `Karte ${i + 1} von ${gesamt}`, text }));
}

/**
 * Die Felder des Gitters für die Anzeige. `modus` ist „karte“ (ohne Ziel und
 * ohne Weg) oder „loesung“ (mit Ziel und Weg). Jede Zelle hat `inhalt`:
 * start, ziel, zeichen, weg oder leer. Bei „weg“ steht in `schritt` die Nummer
 * des Feldes auf dem Weg.
 */
export function rasterZellen(karte, modus = 'karte') {
  const mitLoesung = modus === 'loesung';
  const wegPlatz = new Map(mitLoesung ? karte.weg.map((c, i) => [schluessel(c), i]) : []);
  const zeichenAuf = new Map(karte.zeichen.map((z) => [schluessel(z), z.art]));
  const reihen = [];
  for (let z = 0; z < karte.groesse; z++) {
    const reihe = [];
    for (let s = 0; s < karte.groesse; s++) {
      const feld = { s, z };
      const k = schluessel(feld);
      let inhalt = 'leer';
      let schritt = null;
      let zeichenArt = null;
      if (gleich(feld, karte.start)) {
        inhalt = 'start';
      } else if (mitLoesung && gleich(feld, karte.ziel)) {
        inhalt = 'ziel';
      } else if (zeichenAuf.has(k)) {
        inhalt = 'zeichen';
        zeichenArt = zeichenAuf.get(k);
      } else if (wegPlatz.has(k)) {
        inhalt = 'weg';
        schritt = wegPlatz.get(k);
      }
      reihe.push({ s, z, zeile: z + 1, spalte: BUCHSTABEN[s], koordinate: koordinate(feld), inhalt, schritt, zeichenArt });
    }
    reihen.push(reihe);
  }
  return reihen;
}

/** Die Zeichen, die auf dieser Karte liegen, in fester Reihenfolge. */
export function legende(karte) {
  const vorhanden = new Set(karte.zeichen.map((z) => z.art));
  return SYMBOLE.filter((s) => vorhanden.has(s.id)).map(({ id, name, zeichen, kuerzel }) => ({ id, name, zeichen, kuerzel }));
}

/**
 * Wegstrecke in Himmelsrichtungen, zusammengefasst, zum Beispiel „2× O, 1× S“.
 */
export function wegAlsRichtungen(weg) {
  const teile = [];
  let letzte = null;
  let anzahl = 0;
  for (let i = 1; i < weg.length; i++) {
    const r = richtungZwischen(weg[i - 1], weg[i]);
    if (r === letzte) {
      anzahl += 1;
    } else {
      if (letzte) teile.push(`${anzahl}× ${letzte}`);
      letzte = r;
      anzahl = 1;
    }
  }
  if (letzte) teile.push(`${anzahl}× ${letzte}`);
  return teile.join(', ');
}

/** Die Zeilen des Lösungsblatts (nur für Erwachsene). */
export function loesungZeilen(karte) {
  const zeichenText = karte.zeichen.length
    ? karte.zeichen.map((z) => {
      const symbol = symbolVon(z.art);
      return `${symbol.name} (${symbol.kuerzel}) auf ${koordinate(z)}`;
    }).join(', ')
    : 'keine';
  return [
    `Start: ${koordinate(karte.start)} (Pfeil zeigt nach vorn)`,
    `Ziel: ${koordinate(karte.ziel)} · Vorschlag der App: den Gegenstand hier verstecken`,
    `Zeichen: ${zeichenText}`,
    `Weg in Himmelsrichtungen: ${wegAlsRichtungen(karte.weg)} (N = vorn, O = rechts, S = hinten, W = links)`,
    `Wegkarten: ${karte.segmente.length + 1} (siehe unten)`,
  ];
}

/** Ein Raster als Text: Spalten A bis H, Zeilen von 1 an, pro Feld ein Zeichen. */
function asciiRaster(karte, modus) {
  const zeichenFuer = (zelle) => {
    switch (zelle.inhalt) {
      case 'start': return 'S';
      case 'ziel': return 'Z';
      case 'zeichen': return symbolVon(zelle.zeichenArt).kuerzel;
      case 'weg': return '+';
      default: return '.';
    }
  };
  const zeilen = rasterZellen(karte, modus);
  const kopf = `   ${zeilen[0].map((z) => z.spalte).join(' ')}`;
  const rumpf = zeilen.map((reihe) => `${String(reihe[0].zeile).padStart(2)} ${reihe.map(zeichenFuer).join(' ')}`);
  return [kopf, ...rumpf].join('\n');
}

/**
 * Der Inhalt einer Textdatei. `teil` ist „karten“ (ohne Ziel, ohne Weg, ohne
 * Lösung) oder „loesung“ (mit allem, nur für Erwachsene).
 */
export function alsTextdatei(karte, teil) {
  if (teil !== 'karten' && teil !== 'loesung') throw new Error('teil muss „karten“ oder „loesung“ sein.');
  const kopf = `Gitter ${karte.groesse} × ${karte.groesse} Felder · Ort: ${ortName(karte.ort)}`;
  if (teil === 'karten') {
    return [
      'Schatzkarten-Generator · Karten zum Drucken',
      kopf,
      '',
      'Raster-Karte (vorn = Richtung des Pfeils am Start)',
      asciiRaster(karte, 'karte'),
      '',
      'Zeichen:',
      'S  Start (Pfeil zeigt nach vorn)',
      ...legende(karte).map((s) => `${s.kuerzel}  ${s.name}`),
      '',
      'Wegkarten:',
      ...wegkarten(karte).map((w) => `${w.titel}: ${w.text}`),
      '',
      QUELLE_KARTEN,
    ].join('\n');
  }
  return [
    'Lösungsblatt · nur für Erwachsene · nicht an die Kinder geben',
    kopf,
    '',
    'Raster mit Lösung (S Start, Z Ziel, + Weg, Großbuchstaben = Zeichen):',
    asciiRaster(karte, 'loesung'),
    '',
    ...loesungZeilen(karte),
    '',
    'Wegkarten wie gedruckt:',
    ...wegkarten(karte).map((w) => `${w.titel}: ${w.text}`),
    '',
    QUELLE_LOESUNG,
  ].join('\n');
}
