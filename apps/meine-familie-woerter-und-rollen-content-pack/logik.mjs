// Meine Familie: Wörter und Rollen. Reine Logik ohne DOM, testbar.
// Die Karten stehen in daten/*.json. Hier wird geladen, geprüft, gewählt und als Text
// zusammengesetzt. Der Zufall kommt als Parameter (zufall liefert Zahlen von 0 bis unter 1);
// diese Datei hat keine eigene Zufallsquelle und keine Uhr. Keine Speicherung, keine Wertung
// von Kindern: die Antwort auf eine Frage hat nur zwei Felder, die Antwort selbst und die Erklärung.

/** Die vier Module in der Reihenfolge des Startbildschirms. */
export const MODUL_REIHENFOLGE = ['rollen', 'haushalt', 'hoeflichkeit', 'budget'];

/** Höchstens so viele Karten oder Fragen am Stück, danach die Pause (Kinder von 3 bis 5, Eigenentwurf). */
export const MAX_PRO_DURCHGANG = 6;
/** Eine Runde Rollenfragen: jede Rolle höchstens einmal. */
export const FRAGEN_PRO_RUNDE = 6;
/** Zwei Antworten je Frage (Bauauftrag, Abschnitt 3). */
export const OPTIONEN_PRO_FRAGE = 2;

/** Felder, die jede Karte hat (Bauauftrag, Abschnitt 5). */
export const PFLICHTFELDER = ['id', 'titel', 'modul', 'erklaerung'];

// Zeichen, die auf dem Blatt nicht stehen: Kästchen, Haken und Sternchen (als Escape, damit diese Datei sie nicht selbst
// enthält) und alle Emojis.
const SPERRZEICHEN = /[\u{2610}\u{2611}\u{2612}\u{2713}\u{2714}\u{2605}\u{2606}]|\p{Extended_Pictographic}/u;
// Eine Seitenangabe der Quelle gehört nicht aufs Blatt (A18).
const SEITENANGABE = /(?<![\p{L}\p{N}])S\.\s?\d+/u;
const SEITE_FORMAT = /^S\. \d+$/;

const nichtLeer = (wert) => typeof wert === 'string' && wert.trim() !== '';

// ---------------------------------------------------------------- Laden und Prüfen

function pruefeKarte(karte, modulId, ids) {
  if (!karte || typeof karte !== 'object') throw new Error(`${modulId}: Eintrag ist kein Objekt`);
  const wo = `Karte ${karte.id ?? '?'}`;
  for (const feld of PFLICHTFELDER) {
    if (!nichtLeer(karte[feld])) throw new Error(`${wo}: Feld ${feld} fehlt`);
  }
  if (karte.modul !== modulId) throw new Error(`${wo}: Modul ${karte.modul} gehört nicht in die Datei ${modulId}`);
  if (ids.has(karte.id)) throw new Error(`${wo}: Kennung doppelt`);
  ids.add(karte.id);
  const seite = karte.quelle?.seite;
  if (seite !== undefined && !SEITE_FORMAT.test(seite)) throw new Error(`${wo}: Seitenangabe ${seite} hat nicht die Form „S. n“`);
  if (!nichtLeer(seite) && karte.eigenentwurf !== true) {
    throw new Error(`${wo}: weder quelle.seite noch eigenentwurf: true`);
  }
  if (modulId === 'rollen' && !nichtLeer(karte.frage)) throw new Error(`${wo}: Feld frage fehlt`);
  return { ...karte };
}

/**
 * Lädt und prüft die vier Moduldateien. Jeder Eintrag braucht id, titel, modul und erklaerung,
 * dazu quelle.seite ODER eigenentwurf: true. Bricht mit einem Fehler ab, wenn ein Eintrag beides nicht hat.
 * @param {object[]} dateien die geparsten Dateien rollen, haushalt, hoeflichkeit, budget (Reihenfolge egal)
 * @returns {Array<{ id: string, titel: string, schluss: object|null, karten: object[] }>} in Reihenfolge des Startbildschirms
 */
export function ladeModule(dateien) {
  if (!Array.isArray(dateien)) throw new TypeError('dateien: eine Liste der Moduldateien erwartet');
  const ids = new Set();
  const module = [];
  for (const datei of dateien) {
    if (!datei || typeof datei !== 'object') throw new Error('Moduldatei ist kein Objekt');
    if (!MODUL_REIHENFOLGE.includes(datei.modul)) throw new Error(`unbekanntes Modul: ${datei.modul}`);
    if (module.some((m) => m.id === datei.modul)) throw new Error(`Modul doppelt: ${datei.modul}`);
    if (!nichtLeer(datei.titel)) throw new Error(`Modul ${datei.modul}: Titel fehlt`);
    if (!Array.isArray(datei.karten) || datei.karten.length === 0) throw new Error(`Modul ${datei.modul}: keine Karten`);
    module.push({
      id: datei.modul,
      titel: datei.titel,
      schluss: datei.schluss ?? null,
      karten: datei.karten.map((k) => pruefeKarte(k, datei.modul, ids)),
    });
  }
  const fehlt = MODUL_REIHENFOLGE.filter((id) => !module.some((m) => m.id === id));
  if (fehlt.length) throw new Error(`Modul fehlt: ${fehlt.join(', ')}`);
  return MODUL_REIHENFOLGE.map((id) => module.find((m) => m.id === id));
}

// ---------------------------------------------------------------- Startbildschirm

/** Anzahl der Karten als Text: „1 Karte“, „6 Karten“. */
export function kartenAnzahlText(anzahl) {
  return anzahl === 1 ? '1 Karte' : `${anzahl} Karten`;
}

/** Anzahl der Fragen als Text: „1 Frage“, „6 Fragen“. */
export function fragenAnzahlText(anzahl) {
  return anzahl === 1 ? '1 Frage' : `${anzahl} Fragen`;
}

/**
 * Zeilen des Startbildschirms: je Modul Titel und Anzahl der Karten.
 * @param {ReturnType<typeof ladeModule>} module
 * @returns {Array<{ id: string, titel: string, anzahl: number, anzahlText: string }>}
 */
export function startZeilen(module) {
  return module.map((m) => ({ id: m.id, titel: m.titel, anzahl: m.karten.length, anzahlText: kartenAnzahlText(m.karten.length) }));
}

/** Das Modul mit dieser Kennung (oder undefined). */
export function findeModul(module, id) {
  return module.find((m) => m.id === id);
}

/** Die Karte mit dieser Kennung aus allen Modulen (oder undefined). */
export function findeKarte(module, id) {
  return module.flatMap((m) => m.karten).find((k) => k.id === id);
}

/** Die Position einer Karte in ihrer Reihe: neutral als „Karte 2 von 6“, kein Stand eines Kindes. */
export function kartenPosition(modul, index) {
  const gesamt = modul.karten.length;
  return { nummer: index + 1, gesamt, erste: index === 0, letzte: index === gesamt - 1 };
}

// ---------------------------------------------------------------- Zufall als Parameter

/**
 * Eine Zahl aus [0, laenge) als Index. Liefert zufall einen Wert außerhalb von [0, 1),
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
 * Mischt eine Liste (Fisher-Yates), ohne das Original zu verändern. Alle Einträge bleiben erhalten.
 * @template T
 * @param {T[]} liste
 * @param {() => number} zufall
 * @returns {T[]}
 */
export function mischen(liste, zufall) {
  const kopie = [...liste];
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = zufallsIndex(i + 1, zufall);
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

// ---------------------------------------------------------------- Rollenfrage

/**
 * Eine Frage zu einer Rolle mit zwei Antworten (Voreinstellung): die richtige Rolle und eine andere,
 * gewählt über zufall. Die Reihenfolge der Antworten wird gemischt.
 * Die Ziehungen haben eine feste Reihenfolge: Rolle, dann die anderen Rollen, dann das Mischen.
 * @param {Array<{ id: string, titel: string, frage: string, erklaerung: string }>} rollen
 * @param {() => number} zufall
 * @param {{ anzahlOptionen?: number, ausgeschlossen?: string[] }} [einstellung]
 *   anzahlOptionen: Antworten je Frage (2; mit 4 entsteht die Fassung des Pseudocodes mit drei anderen Rollen),
 *   ausgeschlossen: Kennungen, die in dieser Runde schon gefragt wurden
 * @returns {{ id: string, titel: string, frage: string, optionen: Array<{ id: string, titel: string }>, richtig: string, erklaerung: string }}
 */
export function erzeugeQuizFrage(rollen, zufall, einstellung = {}) {
  const anzahlOptionen = einstellung.anzahlOptionen ?? OPTIONEN_PRO_FRAGE;
  const ausgeschlossen = einstellung.ausgeschlossen ?? [];
  if (!Number.isInteger(anzahlOptionen) || anzahlOptionen < 2 || anzahlOptionen > rollen.length) {
    throw new RangeError(`anzahlOptionen muss zwischen 2 und ${rollen.length} liegen`);
  }
  const kandidaten = rollen.filter((r) => !ausgeschlossen.includes(r.id));
  if (kandidaten.length === 0) throw new RangeError('keine Rolle mehr übrig, die noch nicht gefragt wurde');
  const rolle = kandidaten[zufallsIndex(kandidaten.length, zufall)];
  const andere = rollen.filter((r) => r.id !== rolle.id);
  const distraktoren = [];
  while (distraktoren.length < anzahlOptionen - 1) {
    distraktoren.push(...andere.splice(zufallsIndex(andere.length, zufall), 1));
  }
  const optionen = mischen([rolle, ...distraktoren], zufall).map((r) => ({ id: r.id, titel: r.titel }));
  return { id: rolle.id, titel: rolle.titel, frage: rolle.frage, optionen, richtig: rolle.id, erklaerung: rolle.erklaerung };
}

/**
 * Eine Runde: jede Rolle höchstens einmal, in zufälliger Reihenfolge.
 * @param {Array<{ id: string }>} rollen
 * @param {() => number} zufall
 * @param {number} [anzahl]
 * @param {number} [anzahlOptionen]
 */
export function erzeugeRunde(rollen, zufall, anzahl = FRAGEN_PRO_RUNDE, anzahlOptionen = OPTIONEN_PRO_FRAGE) {
  if (!Number.isInteger(anzahl) || anzahl < 1 || anzahl > Math.min(rollen.length, MAX_PRO_DURCHGANG)) {
    throw new RangeError(`anzahl muss zwischen 1 und ${Math.min(rollen.length, MAX_PRO_DURCHGANG)} liegen`);
  }
  const runde = [];
  for (let i = 0; i < anzahl; i++) {
    runde.push(erzeugeQuizFrage(rollen, zufall, { anzahlOptionen, ausgeschlossen: runde.map((f) => f.id) }));
  }
  return runde;
}

/**
 * Die Antwort auf eine Frage: ob die gewählte Antwort die Rolle trifft, und die Erklärung der Rolle.
 * Mehr gibt es nicht: kein Zähler, keine Reihung der Kinder, kein Speichern.
 * @param {ReturnType<typeof erzeugeQuizFrage>} frage
 * @param {string} auswahlId
 * @returns {{ richtig: boolean, erklaerung: string }}
 */
export function beantworteQuizFrage(frage, auswahlId) {
  if (!frage.optionen.some((o) => o.id === auswahlId)) throw new Error(`Antwort ${auswahlId} gehört nicht zur Frage ${frage.id}`);
  return { richtig: auswahlId === frage.richtig, erklaerung: frage.erklaerung };
}

// ---------------------------------------------------------------- Texte zum Vorlesen

/** Vorlesetext einer Karte: Titel und Satz. */
export function vorlesetextKarte(karte) {
  return `${karte.titel}. ${karte.erklaerung}`;
}

/** Vorlesetext einer Frage: die Frage und die zwei Antworten mit „oder“. */
export function vorlesetextFrage(frage) {
  return `${frage.frage} ${frage.optionen.map((o) => o.titel).join(' oder ')}?`;
}

/** Rückmeldung nach einer Antwort: ruhig, ohne Urteil über das Kind. */
export function rueckmeldungText(frage, antwort, texte) {
  return antwort.richtig ? texte.rueckmeldung.passt : `${texte.rueckmeldung.hier} ${frage.titel}.`;
}

/** Vorlesetext nach einer Antwort: Rückmeldung und Erklärung. */
export function vorlesetextAntwort(frage, antwort, texte) {
  return `${rueckmeldungText(frage, antwort, texte)} ${antwort.erklaerung}`;
}

/** Vorlesetext des Startbildschirms: die vier Themen und der Eintrag für die Fragen zu den Rollen. */
export function vorlesetextStart(module, texte) {
  const namen = [...module.map((m) => m.titel), texte.start.fragen];
  const liste = `${namen.slice(0, -1).join(', ')} oder ${namen.at(-1)}`;
  return `${texte.titel}. ${texte.start.intro} ${texte.start.wahl} ${liste}.`;
}

/** Vorlesetext der Pause: Überschrift, Satz und die Ideen. */
export function vorlesetextPause(schluss, texte) {
  return `${texte.pause.ueberschrift}. ${texte.pause.satz} ${schluss.ideen.join(' ')}`;
}

// ---------------------------------------------------------------- Quelle

/**
 * Quellenzeile einer Karte für den Bildschirm: das Thema in der Quelle mit Seite und die Marke,
 * dazu der Vermerk zum Text. Wo eine Seite steht, steht auch die Marke.
 * @param {object} karte
 * @param {string} seitenmarke
 * @param {string} [art] „Karte“ oder „Frage“: wessen Text der Vermerk meint
 * @returns {string}
 */
export function quellenText(karte, seitenmarke, art = 'Karte') {
  const teile = [];
  if (karte.quelle?.seite) {
    const begriff = karte.quelle.begriff ? `„${karte.quelle.begriff}“ ` : '';
    teile.push(`Thema aus der Quelle: ${begriff}(Praleska, ${karte.quelle.seite}).`);
    teile.push(seitenmarke);
  }
  teile.push(vermerkZeile(karte, art));
  return teile.join(' ');
}

/** „Text der Karte (Eigenentwurf)“: der Vermerk, dass der Text nicht aus der Quelle stammt. */
export function vermerkZeile(karte, art = 'Karte') {
  return `Text der ${art} ${karte.vermerk ?? '(Eigenentwurf)'}.`;
}

// ---------------------------------------------------------------- Auswahl und Druck

/** Kennungen aller Karten in Anzeige- und Druckreihenfolge. */
export function alleKartenIds(module) {
  return module.flatMap((m) => m.karten.map((k) => k.id));
}

/** Schaltet eine Karte um. Liefert eine neue Menge; das Original bleibt unverändert. */
export function umschalten(auswahl, id) {
  const neu = new Set(auswahl);
  if (neu.has(id)) neu.delete(id);
  else neu.add(id);
  return neu;
}

/** Alle Karten gewählt. */
export function waehleAlle(module) {
  return new Set(alleKartenIds(module));
}

/**
 * Die gewählten Karten in fester Reihenfolge (Module, dann Karten). Unbekannte Kennungen
 * werden übergangen, jede Karte kommt höchstens einmal vor.
 * @returns {Array<{ modul: object, karte: object }>}
 */
export function gewaehlteKarten(module, auswahl) {
  const gewaehlt = new Set(auswahl);
  return module.flatMap((m) => m.karten.filter((k) => gewaehlt.has(k.id)).map((karte) => ({ modul: m, karte })));
}

/** Gedruckt wird, sobald mindestens eine Karte gewählt ist. */
export function kannDrucken(gewaehlte) {
  return gewaehlte.length > 0;
}

/** Der Text eines Blatts, Zeile für Zeile, so wie er auf dem Papier steht. */
export function blattText(blatt) {
  return [blatt.kopf, blatt.titel, blatt.satz, blatt.vermerk].join('\n');
}

/**
 * Das Blatt zu einer Karte: Kopf, Titel, ein Satz und der Vermerk. Ohne Seitenzahl, ohne Namenszeile,
 * ohne Tagesfelder. Bricht ab, wenn der Text ein Zeichen enthält, das nicht aufs Blatt gehört
 * (Kästchen, Haken, Sternchen, Emojis), oder eine Seitenangabe der Quelle.
 * @param {object} karte
 * @param {string} modulTitel
 * @returns {{ kopf: string, titel: string, satz: string, vermerk: string }}
 */
export function druckeKarte(karte, modulTitel) {
  const blatt = {
    kopf: modulTitel ? `Meine Familie: ${modulTitel}` : 'Meine Familie',
    titel: karte.titel,
    satz: karte.erklaerung,
    vermerk: vermerkZeile(karte),
  };
  const text = blattText(blatt);
  if (SPERRZEICHEN.test(text)) throw new Error(`Karte ${karte.id}: Zeichen, das nicht aufs Blatt gehört`);
  if (SEITENANGABE.test(text)) throw new Error(`Karte ${karte.id}: Seitenangabe auf dem Blatt`);
  return blatt;
}
