// Kleine Forscher ohne Bildschirm: reine Logik ohne DOM, testbar.
// Die Versuchskarten stehen in daten/karten.json. Hier werden Karten ausgewählt, geprüft und
// als Druckblätter zusammengesetzt. Keine Speicherung, kein Zufall, keine Seitenzahl auf dem Blatt.

// Zeichen, die im Druck nicht stehen dürfen: Kästchen, Häkchen, Sternchen-Symbole, Aufzählungszeichen,
// Pfeile und Emojis. Als Unicode-Escapes geschrieben, damit die Datei selbst keine solchen Zeichen trägt.
export const VERBOTENE_ZEICHEN = /[\u2610\u2611\u2612\u2713\u2714\u2717\u2718\u2605\u2606\u2022\u25CF\u25CB\u25E6\u00B7\u2219\u2027\u25AA\u25AB\u25FD\u25FE\u25A0\u25A1\u30FB]|[\u2190-\u2BFF]|\p{Extended_Pictographic}/u;

/**
 * Prüft einen Eintrag aus daten/karten.json. Wirft einen Fehler, wenn ein Pflichtfeld fehlt.
 * @param {object} eintrag
 * @returns {object} derselbe Eintrag
 */
export function pruefeEintrag(eintrag) {
  for (const feld of ['titel', 'material', 'lernziel']) {
    if (!eintrag[feld]?.trim()) throw new Error(`Feld fehlt: ${feld} bei ${eintrag.id ?? '?'}`);
  }
  if ((eintrag.sicherheit ?? '').length < 30) {
    throw new Error(`Sicherheitshinweis zu kurz bei ${eintrag.id}`);
  }
  const seite = eintrag.quelle?.seite ?? '';
  if (!/^S\. \d+$/.test(seite) && eintrag.eigenentwurf !== true) {
    throw new Error(`Quelle fehlt oder falsch bei ${eintrag.id}`);
  }
  return eintrag;
}

/**
 * Eine Versuchskarte aus einem geprüften Eintrag.
 * @param {object} eintrag
 * @returns {{ id: string, titel: string, material: string, lernziel: string, sicherheit: string, quelle: object, begriffe: object[] }}
 */
export function versuchKarteAusDaten(eintrag) {
  const { id, titel, material, lernziel, sicherheit, quelle, begriffe = [] } = pruefeEintrag(eintrag);
  return { id, titel, material, lernziel, sicherheit, quelle, begriffe };
}

/**
 * Die gewählten Karten in der Reihenfolge der Themen.
 * @param {object[]} karten
 * @param {string[]} themen
 * @returns {object[]}
 */
export function kartenFuerThemen(karten, themen) {
  return themen.map((thema) => {
    const karte = karten.find((k) => k.id === thema);
    if (!karte) throw new Error(`Thema fehlt: ${thema}`);
    return karte;
  });
}

/**
 * Begriffe aus der Quelle, je Zeile in Anführungszeichen. Eine Übertragung steht dahinter
 * und ist als Eigenentwurf gekennzeichnet. Die Seite steht nicht auf dem Blatt.
 * @param {{ begriffe: Array<{ quelltext: string, deutsch?: string }> }} karte
 * @returns {string[]}
 */
export function begriffZeilen(karte) {
  return karte.begriffe.map((b) => {
    const basis = `„${b.quelltext}“`;
    return b.deutsch ? `${basis}: ${b.deutsch} (Eigenentwurf)` : basis;
  });
}

/**
 * Alle Angaben eines Druckblatts als Zeilen. Die Pflichtmarkierung steht nur, wenn eine
 * Seitenangabe in den Daten gesetzt ist.
 * @param {object} daten
 * @param {object} karte
 * @returns {{ kopf: string, gestaltungKopf: string, titel: string, quelle: string, begriffe: string[], material: string, lernziel: string, sicherheit: string, pflicht: string | null }}
 */
export function kartenZeilen(daten, karte) {
  return {
    kopf: daten.titel,
    gestaltungKopf: daten.beschriftung.kopf,
    titel: karte.titel,
    quelle: `Quelle: ${daten.quelleKurz}`,
    begriffe: begriffZeilen(karte),
    material: karte.material,
    lernziel: karte.lernziel,
    sicherheit: karte.sicherheit,
    pflicht: karte.quelle?.seite ? daten.pflichtmarkierung : null,
  };
}

/**
 * Gesamttext eines Druckblatts, so wie es gedruckt wird.
 * @param {object} daten
 * @param {object} karte
 * @returns {string}
 */
export function kartenText(daten, karte) {
  const z = kartenZeilen(daten, karte);
  const b = daten.beschriftung;
  return [
    z.kopf,
    z.gestaltungKopf,
    z.titel,
    z.quelle,
    ...(z.begriffe.length ? [b.begriffe, ...z.begriffe] : []),
    b.material,
    z.material,
    b.lernziel,
    z.lernziel,
    b.sicherheit,
    z.sicherheit,
    z.pflicht,
  ].filter(Boolean).join('\n');
}

/**
 * Ein Druckblatt je gewählter Karte, ein Blatt A4 hoch. Wirft einen Fehler, wenn ein
 * verbotenes Zeichen im Text steht.
 * @param {object} daten
 * @param {object[]} karten
 * @returns {Array<{ id: string, zeilen: ReturnType<typeof kartenZeilen> }>}
 */
export function druckBlaetter(daten, karten) {
  return karten.map((karte) => {
    if (VERBOTENE_ZEICHEN.test(kartenText(daten, karte))) {
      throw new Error(`Druckzeichen im Blatt ${karte.id}`);
    }
    return { id: karte.id, zeilen: kartenZeilen(daten, karte) };
  });
}
