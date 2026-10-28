// Himmelsgucker: reine Logik ohne DOM, testbar.
// Die Karten, Fragen und Blattentwürfe stehen in daten/himmel.json. Hier wird geprüft, gefragt,
// gewählt und für den Druck zusammengesetzt: Die Blätter entstehen als HTML-Text, in dem jeder Text maskiert
// ist und nur eigene Elemente stehen. Der Zufall kommt als Parameter (zufall liefert Zahlen von 0 bis unter 1);
// diese Datei hat keine Zufallsquelle und keine Uhr.
// Keine Speicherung und keine Wertung eines Kindes: eine Antwort bekommt eine Erklärung, keine Zahl.

import HIMMEL from './daten/himmel.json' with { type: 'json' };
import { bildSvg, maskiere } from './bilder.mjs';

export const MODUL_HIMMEL = 'himmelskoerper';
export const MODUL_MOND = 'mondphasen';
/** Optionen je Mondbild-Frage (Pseudocode des Bauauftrags: das gesuchte Wort und zwei weitere). */
export const ANZAHL_OPTIONEN = 3;
/** So viele nummerierte Beobachtungsblätter lassen sich höchstens wählen. */
export const MAX_BEOBACHTUNG = 3;

export const SEITE = /^S\. \d+$/;

// Zeichen, die im Druck nicht stehen dürfen: Kästchen, Häkchen, Sternchen-Symbole, Aufzählungszeichen,
// Pfeile und Emojis. Als Unicode-Escapes geschrieben, damit die Datei selbst keine solchen Zeichen trägt.
export const VERBOTENE_ZEICHEN = /[\u2610\u2611\u2612\u2713\u2714\u2717\u2718\u2605\u2606\u2022\u25CF\u25CB\u25E6\u00B7\u2219\u2027\u25AA\u25AB\u25FD\u25FE\u25A0\u25A1\u30FB]|[\u2190-\u2BFF]|\p{Extended_Pictographic}/u;
// Keine Zeile für den Namen eines Kindes, kein Datum, kein Tages- oder Wochentagsfeld, keine Schreiblinien.
export const NAMEN_UND_TAGE = /Name(?!n\b)|Datum|Wochentag|\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b|\bTage?\b|_{3,}|…{2,}/i;
// Auf dem Blatt steht keine Seitenzahl der Quelle (A18-Standard).
export const SEITENZAHL = /\bS\.\s?\d|\bSeiten?\s+\d|(?:стр|с)\.\s?\d/;

/**
 * Eine Zahl aus [0, laenge) als Index. Liefert der Zufall einen Wert außerhalb von [0, 1),
 * wird er auf den gültigen Bereich begrenzt; ein fehlender Wert wird 0.
 * @param {number} laenge positive ganze Zahl
 * @param {() => number} zufall liefert Zahlen von 0 (einschließlich) bis 1 (ausschließlich)
 * @returns {number}
 */
export function zufallsIndex(laenge, zufall) {
  if (!Number.isInteger(laenge) || laenge < 1) {
    throw new RangeError('laenge muss eine positive ganze Zahl sein');
  }
  if (typeof zufall !== 'function') {
    throw new TypeError('zufall fehlt: eine Funktion, die Zahlen von 0 bis 1 liefert');
  }
  const wert = Number(zufall());
  const roh = Number.isFinite(wert) ? Math.floor(wert * laenge) : 0;
  return Math.min(laenge - 1, Math.max(0, roh));
}

/**
 * Die Liste in zufälliger Reihenfolge (Fisher-Yates), das Original bleibt unverändert.
 * @template T
 * @param {T[]} liste
 * @param {() => number} zufall
 * @returns {T[]}
 */
export function mischen(liste, zufall) {
  if (typeof zufall !== 'function') {
    throw new TypeError('zufall fehlt: eine Funktion, die Zahlen von 0 bis 1 liefert');
  }
  const kopie = [...liste];
  for (let i = kopie.length - 1; i > 0; i -= 1) {
    const j = zufallsIndex(i + 1, zufall);
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

/** Ersetzt {name} in einer Vorlage durch die Werte; ein fehlender Wert ist ein Fehler. */
export function fuelle(vorlage, werte = {}) {
  return String(vorlage).replace(/\{(\w+)\}/g, (_, name) => {
    if (!(name in werte)) throw new Error(`Wert fehlt für {${name}} in „${vorlage}“`);
    return String(werte[name]);
  });
}

/**
 * Lädt und prüft die Karten aus daten/himmel.json (die Datei als Objekt oder die Liste selbst).
 * Jede Karte braucht id, titel, modul und erklaerung. Dazu braucht sie entweder eine Seite der Quelle
 * (quelle.seite, "S. n") oder die Kennung eigenentwurf: true. Sonst bricht das Laden ab.
 * @param {{ karten: object[] } | object[]} datei
 * @returns {object[]} die geprüfte Liste der Karten
 */
export function ladeHimmel(datei) {
  const liste = Array.isArray(datei) ? datei : datei?.karten;
  if (!Array.isArray(liste) || liste.length === 0) throw new Error('himmel.json: keine Karten');
  const ids = new Set();
  for (const karte of liste) {
    for (const feld of ['id', 'titel', 'modul', 'erklaerung']) {
      if (typeof karte?.[feld] !== 'string' || !karte[feld].trim()) {
        throw new Error(`Feld fehlt: ${feld} bei ${karte?.id ?? '?'}`);
      }
    }
    if (ids.has(karte.id)) throw new Error(`doppelte Kennung: ${karte.id}`);
    ids.add(karte.id);
    const seite = karte.quelle?.seite;
    const seiteOk = typeof seite === 'string' && SEITE.test(seite);
    if (seite !== undefined && !seiteOk) throw new Error(`Seitenangabe falsch bei ${karte.id}: ${seite}`);
    if (!seiteOk && karte.eigenentwurf !== true) {
      throw new Error(`Quelle fehlt und kein Eigenentwurf: ${karte.id}`);
    }
  }
  return liste;
}

/** Die Karte mit dieser Kennung; unbekannt ist ein Fehler. */
export function karteMitId(karten, id) {
  const karte = karten.find((k) => k.id === id);
  if (!karte) throw new Error(`Karte fehlt: ${id}`);
  return karte;
}

/** Die Karten eines Moduls in der Reihenfolge der Daten. */
export function kartenImModul(karten, modul) {
  return karten.filter((k) => k.modul === modul);
}

function pruefeAnzahl(anzahl, vorhanden) {
  if (!Number.isInteger(anzahl) || anzahl < 2 || anzahl > vorhanden) {
    throw new RangeError(`anzahl muss eine ganze Zahl von 2 bis ${vorhanden} sein`);
  }
}

// Eine Frage zu einer Mondkarte: das gesuchte Wort (Titel) und weitere Titel aus den anderen Mondkarten,
// gemischt. Nur wenn es mehr andere Karten gibt, als Optionen fehlen, wird zufällig ausgewählt.
function frageZu(karte, mondKarten, zufall, anzahl) {
  const andere = mondKarten.filter((k) => k.id !== karte.id);
  const weitere = andere.length > anzahl - 1 ? mischen(andere, zufall).slice(0, anzahl - 1) : andere;
  const gemischt = mischen([karte, ...weitere], zufall);
  return {
    id: karte.id,
    optionen: gemischt.map((k) => k.titel),
    optionenIds: gemischt.map((k) => k.id),
    richtig: karte.titel,
    erklaerung: karte.erklaerung,
    benennung: karte.benennung ?? karte.titel,
  };
}

/**
 * Eine Frage zu einer zufälligen Mondgestalt: Welcher Titel passt zum Bild der Karte?
 * @param {object[]} karten die geprüften Karten
 * @param {() => number} zufall
 * @param {number} [anzahl] Zahl der Optionen (Standard 3)
 * @returns {{ id: string, optionen: string[], optionenIds: string[], richtig: string, erklaerung: string, benennung: string }}
 */
export function mondphasenFrage(karten, zufall, anzahl = ANZAHL_OPTIONEN) {
  if (typeof zufall !== 'function') {
    throw new TypeError('zufall fehlt: eine Funktion, die Zahlen von 0 bis 1 liefert');
  }
  const mondKarten = kartenImModul(karten, MODUL_MOND);
  pruefeAnzahl(anzahl, mondKarten.length);
  const karte = mondKarten[zufallsIndex(mondKarten.length, zufall)];
  return frageZu(karte, mondKarten, zufall, anzahl);
}

/**
 * Eine Runde: jede Mondgestalt kommt genau einmal dran, in zufälliger Reihenfolge.
 * @param {object[]} karten
 * @param {() => number} zufall
 * @param {number} [anzahl]
 * @returns {ReturnType<typeof mondphasenFrage>[]}
 */
export function mondphasenRunde(karten, zufall, anzahl = ANZAHL_OPTIONEN) {
  if (typeof zufall !== 'function') {
    throw new TypeError('zufall fehlt: eine Funktion, die Zahlen von 0 bis 1 liefert');
  }
  const mondKarten = kartenImModul(karten, MODUL_MOND);
  pruefeAnzahl(anzahl, mondKarten.length);
  return mischen(mondKarten, zufall).map((k) => frageZu(k, mondKarten, zufall, anzahl));
}

/**
 * Die Zwei-Antworten-Frage einer Karte (Sonne oder Sternenhimmel): wann ist sie zu sehen? Die Reihenfolge
 * der beiden Antworten kommt vom Zufall.
 * @param {object} karte eine Karte mit dem Feld frage
 * @param {() => number} zufall
 * @returns {{ id: string, frage: string, optionen: string[], richtig: string, antwortTitel: string, erklaerung: string }}
 */
export function tageszeitFrage(karte, zufall) {
  const f = karte?.frage;
  if (!f) throw new Error(`Karte ohne Frage: ${karte?.id ?? '?'}`);
  if (!Array.isArray(f.antworten) || f.antworten.length !== 2 || !f.antworten.includes(f.passend)) {
    throw new Error(`Frage der Karte ${karte.id}: zwei Antworten, eine davon passend`);
  }
  return {
    id: karte.id,
    frage: f.text,
    optionen: mischen(f.antworten, zufall),
    richtig: f.passend,
    antwortTitel: f.antwortTitel,
    erklaerung: f.erklaerung,
  };
}

/**
 * Die Antwort auf eine Frage. Die Rückgabe hat genau zwei Felder: ob die Wahl zum Bild oder zur Sache
 * passt, und die Erklärung. Es gibt keinen Zähler, keine Rangfolge und kein Speichern.
 * @param {{ optionen: string[], richtig: string, erklaerung: string }} frage
 * @param {string} auswahl eine der Optionen
 * @returns {{ richtig: boolean, erklaerung: string }}
 */
export function beantworteMondphase(frage, auswahl) {
  if (!frage.optionen.includes(auswahl)) throw new RangeError(`„${auswahl}“ gehört nicht zur Frage`);
  return { richtig: auswahl === frage.richtig, erklaerung: frage.erklaerung };
}

/** Dieselbe Antwort-Logik für die Zwei-Antworten-Frage (Sonne, Sternenhimmel). */
export const beantworteTageszeit = beantworteMondphase;

/**
 * Der Text, den die Vorlese-Funktion für eine Karte liest: nur die Sätze für das Kind,
 * keine Hinweise für Erwachsene und keine Kennzeichnung als Eigenentwurf.
 * @param {{ titel: string, text: string[] }} karte
 * @returns {string}
 */
export function vorlesetext(karte) {
  return [karte.titel + '.', ...karte.text].join(' ');
}

// ---------------------------------------------------------------------------------------------
// Auswahl für den Druck

/** Anfangsstand: nichts gewählt; ein Beobachtungsblatt, falls es gewählt wird. */
export const STARTAUSWAHL = Object.freeze({ mond: false, beobachtung: false, anzahl: 1 });

export const schalteMond = (auswahl) => ({ ...auswahl, mond: !auswahl.mond });
export const schalteBeobachtung = (auswahl) => ({ ...auswahl, beobachtung: !auswahl.beobachtung });

/** Ändert die Zahl der Beobachtungsblätter um einen Schritt, begrenzt auf 1 bis MAX_BEOBACHTUNG. */
export function aendereAnzahl(auswahl, schritt) {
  const neu = Math.min(MAX_BEOBACHTUNG, Math.max(1, auswahl.anzahl + schritt));
  return { ...auswahl, anzahl: neu };
}

/** So viele Blätter werden gedruckt: das Mondblatt zählt eins, die Beobachtungsblätter nach Zahl. */
export function anzahlBlaetter(auswahl) {
  return (auswahl.mond ? 1 : 0) + (auswahl.beobachtung ? auswahl.anzahl : 0);
}

// ---------------------------------------------------------------------------------------------
// Druckblätter
//
// Aus den Entwürfen in daten/himmel.json entstehen Blatt-Objekte (mondblatt, beobachtungsblaetter) und aus
// ihnen HTML-Text (blattHtml). Geprüft wird der HTML-Text, also das, was auf dem Papier steht.

/** Die maskierten Zeichen in HTML-Text und ihre Rückübersetzung. */
const ENTITAETEN = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };

/**
 * Der sichtbare Text eines HTML-Stücks aus dieser Datei: ohne Elemente und Attribute, eine Zeile je Element,
 * mit den ursprünglichen Zeichen. Bilder tragen kein Wort im Druck.
 * @param {string} html
 * @returns {string}
 */
export function htmlText(html) {
  return String(html)
    .replace(/<[^>]*>/g, '\n')
    .replace(/&(?:amp|lt|gt|quot|#39);/g, (zeichen) => ENTITAETEN[zeichen])
    .replace(/\n+/g, '\n')
    .trim();
}

/**
 * Prüft den Text eines Blatts gegen die Druckregeln (docs/02 Z. 79–82): keine Zeichen aus der Sperrliste,
 * keine Emojis, keine Namenszeile, kein Datum, kein Tagesfeld, keine Seitenzahl der Quelle.
 * @param {string} text
 * @returns {string[]} die Verstöße; leer heißt in Ordnung
 */
export function pruefeBlattText(text) {
  const probleme = [];
  const zeichen = text.match(VERBOTENE_ZEICHEN);
  if (zeichen) probleme.push(`Druckzeichen: ${zeichen[0]}`);
  const name = text.match(NAMEN_UND_TAGE);
  if (name) probleme.push(`Namenszeile oder Tagesfeld: ${name[0]}`);
  const seite = text.match(SEITENZAHL);
  if (seite) probleme.push(`Seitenzahl auf dem Blatt: ${seite[0]}`);
  if (/undefined|null|\[object|UNBEKANNT/.test(text)) probleme.push('Rest im Text');
  return probleme;
}

// Was auf ein Blatt nicht gehört: Skript, Eingabe, Verweis, Bild von außen, Stil in der Zeile, Ereignis.
const FREMDES = /<\s*(?:script|style|input|textarea|select|button|form|label|a|img|iframe|object|embed|link|meta|base|video|audio|canvas|template)\b|\bon[a-z]+\s*=|javascript:|\b(?:href|src|srcset|action|style)\s*=|xlink/i;

/**
 * Prüft das HTML eines Blatts: den Text gegen die Druckregeln (pruefeBlattText), den ganzen Quelltext gegen
 * Zeichen der Sperrliste und die Elemente (nicht den Text) gegen Elemente und Verweise, die auf kein Blatt gehören.
 * @param {string} html
 * @returns {string[]} die Verstöße; leer heißt in Ordnung
 */
export function pruefeBlattHtml(html) {
  const probleme = pruefeBlattText(htmlText(html));
  if (VERBOTENE_ZEICHEN.test(html)) probleme.push('Druckzeichen im Quelltext des Blatts');
  const fremd = (html.match(/<[^>]*>/g) ?? []).join('\n').match(FREMDES);
  if (fremd) probleme.push(`Element oder Verweis, der nicht auf ein Blatt gehört: ${fremd[0]}`);
  return probleme;
}

/**
 * Das Mondblatt: drei Mondbilder links, die drei Wörter rechts in anderer Reihenfolge.
 * Das Kind verbindet und malt aus; es kreuzt nichts an.
 * @param {object} daten der Inhalt von daten/himmel.json
 * @returns {object}
 */
export function mondblatt(daten) {
  const v = daten.blaetter.mondblatt;
  const mond = kartenImModul(daten.karten, MODUL_MOND);
  const titel = new Set(mond.map((k) => k.titel));
  const bilder = mond.map((k) => k.bild);
  const woerter = new Set(v.zeilen.map((z) => z.wort));
  if (v.zeilen.length !== bilder.length || woerter.size !== v.zeilen.length
    || v.zeilen.some((z, i) => z.bild !== bilder[i] || !titel.has(z.wort))) {
    throw new Error('Mondblatt: Bilder und Wörter passen nicht zu den Mondkarten');
  }
  return {
    typ: 'mondblatt',
    id: 'mondblatt',
    kopf: daten.blaetter.kopf,
    kopf2: v.kopf2,
    titel: v.titel,
    anleitung: [...v.anleitung],
    zeilen: v.zeilen.map((z) => ({ ...z })),
    hinweis: v.hinweis,
    quelle: daten.blaetter.quelle,
  };
}

/**
 * Nummerierte Beobachtungsblätter für den Abendhimmel: Felder für Mondgestalt, Himmelsrichtung und
 * Wetter zum Einkreisen und ein Kasten zum Malen. Ohne Datum, ohne Namenszeile, ohne Tagesfelder.
 * Die Blätter tragen eine Nummer, die Reihenfolge ist die Nummer.
 * @param {number} anzahl 0 bis MAX_BEOBACHTUNG
 * @param {object} daten der Inhalt von daten/himmel.json
 * @returns {object[]}
 */
export function beobachtungsblaetter(anzahl, daten) {
  if (!Number.isInteger(anzahl) || anzahl < 0 || anzahl > MAX_BEOBACHTUNG) {
    throw new RangeError(`anzahl muss eine ganze Zahl von 0 bis ${MAX_BEOBACHTUNG} sein`);
  }
  const v = daten.blaetter.beobachtung;
  const felder = v.felder.map((f) => {
    if (f.art !== 'bilder') return { ...f };
    return {
      ...f,
      auswahl: f.auswahl.map((bild) => {
        const karte = daten.karten.find((k) => k.bild === bild);
        if (!karte) throw new Error(`Beobachtungsblatt: kein Mondbild ${bild}`);
        return { bild, wort: karte.titel };
      }),
    };
  });
  return Array.from({ length: anzahl }, (_, i) => ({
    typ: 'beobachtung',
    id: `beobachtung-${i + 1}`,
    nr: i + 1,
    kopf: daten.blaetter.kopf,
    kopf2: v.kopf2,
    titel: fuelle(v.titel, { nr: i + 1 }),
    anleitung: [...v.anleitung],
    felder: felder.map((f) => ({ ...f })),
    hinweis: v.hinweis,
    quelle: daten.blaetter.quelle,
  }));
}

// Der HTML-Text eines Blatts. Jeder Text aus den Daten geht durch maskiere(); die Bilder liefert bilder.mjs
// (im Druck nur die Mondgestalten, ohne Wort). Es gibt weder Eingabefelder noch Verweise noch Stil in der Zeile.
const absatzHtml = (text, klasse) => `<p${klasse ? ` class="${klasse}"` : ''}>${maskiere(text)}</p>`;
const wortHtml = (text) => `<span class="hg-wort">${maskiere(text)}</span>`;
const bildHtml = (id, klasse) => `<span class="hg-bild ${klasse}">${bildSvg(id, { modus: 'druck' })}</span>`;

function feldHtml(feld) {
  const kopf = `<h3 class="hg-feldtitel">${maskiere(feld.titel)}</h3>${absatzHtml(feld.aufgabe, 'hg-aufgabe')}`;
  let inhalt;
  if (feld.art === 'bilder') {
    const wahl = feld.auswahl.map((a) => `<div class="hg-wahl">${bildHtml(a.bild, 'hg-bild--wahl')}${wortHtml(a.wort)}</div>`);
    inhalt = `<div class="hg-wahlreihe hg-wahlreihe--bilder">${wahl.join('')}<div class="hg-wahl">${wortHtml(feld.keine)}</div></div>`;
  } else if (feld.art === 'kreuz') {
    const leer = '<span class="hg-leer"></span>';
    inhalt = `<div class="hg-kreuz">${leer}${wortHtml(feld.oben)}${leer}${wortHtml(feld.links)}`
      + `<span class="hg-mitte">${maskiere(feld.mitte)}</span>${wortHtml(feld.rechts)}${leer}${wortHtml(feld.unten)}${leer}</div>`;
  } else if (feld.art === 'woerter') {
    inhalt = `<div class="hg-wahlreihe">${feld.auswahl.map((text) => `<div class="hg-wahl">${wortHtml(text)}</div>`).join('')}</div>`;
  } else if (feld.art === 'rahmen') {
    inhalt = '<div class="hg-rahmen"></div>';
  } else {
    throw new Error(`Feld ${feld.id}: unbekannte Art ${feld.art}`);
  }
  return `<div class="hg-feld">${kopf}${inhalt}</div>`;
}

function blattInnenHtml(blatt) {
  const mitte = blatt.typ === 'mondblatt'
    ? `<div class="hg-mondzeilen">${blatt.zeilen.map((z) => `<div class="hg-mondzeile">${bildHtml(z.bild, 'hg-bild--blatt')}${wortHtml(z.wort)}</div>`).join('')}</div>`
    : blatt.felder.map(feldHtml).join('');
  return [
    absatzHtml(blatt.kopf, 'hg-kopf'),
    absatzHtml(blatt.kopf2, 'hg-kopf'),
    `<h2 class="hg-blatttitel">${maskiere(blatt.titel)}</h2>`,
    ...blatt.anleitung.map((satz) => absatzHtml(satz, 'hg-anleitung')),
    mitte,
    absatzHtml(blatt.hinweis, 'hg-hinweis'),
    absatzHtml(blatt.quelle, 'hg-quelle'),
  ].join('');
}

/**
 * Ein Blatt als HTML-Text: ein Element section.hg-blatt, aus dem druck.css eine Seite A4 hoch macht. Das Blatt
 * wird gegen die Druckregeln geprüft (pruefeBlattHtml); ein Verstoß bricht ab.
 * @param {object} blatt ein Blatt aus mondblatt() oder beobachtungsblaetter()
 * @returns {string}
 */
export function blattHtml(blatt) {
  const html = `<section class="k-karte hg-blatt">${blattInnenHtml(blatt)}</section>`;
  const probleme = pruefeBlattHtml(html);
  if (probleme.length) throw new Error(`Blatt ${blatt.id}: ${probleme.join('; ')}`);
  return html;
}

/**
 * Die Beobachtungsblätter für den Abendhimmel als HTML-Text, anzahl Blätter hintereinander, jedes eine Seite A4
 * hoch: Felder für Mondgestalt, Himmelsrichtung und Wetter, ohne Datum, ohne Namenszeile, ohne Zeichen aus der
 * Sperrliste und ohne Emojis. Ein Verstoß gegen diese Regeln bricht ab.
 * @param {number} anzahl 0 bis MAX_BEOBACHTUNG
 * @param {object} [daten] der Inhalt von daten/himmel.json (Standard: die mitgelieferte Datei)
 * @returns {string}
 */
export function druckeBeobachtungsblatt(anzahl, daten = HIMMEL) {
  return beobachtungsblaetter(anzahl, daten).map(blattHtml).join('');
}

/**
 * Die Blätter, die zur Auswahl gehören, als HTML-Text: zuerst das Mondblatt, dann die Beobachtungsblätter nach
 * Nummer. Ohne Auswahl ist der Text leer.
 * @param {object} daten
 * @param {{ mond: boolean, beobachtung: boolean, anzahl: number }} auswahl
 * @returns {string}
 */
export function druckBlaetterHtml(daten, auswahl) {
  return (auswahl.mond ? blattHtml(mondblatt(daten)) : '')
    + (auswahl.beobachtung ? druckeBeobachtungsblatt(auswahl.anzahl, daten) : '');
}

/** Die Zeile mit der Zahl der gewählten Blätter, mit Einzahl und Mehrzahl. */
export function gewaehltText(texte, anzahl) {
  if (anzahl === 0) return texte.keins;
  if (anzahl === 1) return texte.einBlatt;
  return fuelle(texte.mehrBlaetter, { n: anzahl });
}
