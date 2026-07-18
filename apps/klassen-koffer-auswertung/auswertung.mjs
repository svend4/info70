// Klassen-Koffer-Auswertung (für LEHRKRÄFTE, docs/09 Ось E): Reine Logik ohne
// DOM. Schülergeräte exportieren anonyme Ergebnis-Dateien (nur Antwortmuster,
// frei gewählte Tiernamen statt Klarnamen). Die Lehrkraft importiert sie und
// erhält eine Heatmap „Welche Frage/Welches Szenario fiel der Klasse schwer?“.
// Es werden KEINE personenbezogenen Daten verarbeitet (DSGVO Art. 5).

export const KOFFER_ART = 'info70-ergebnis-koffer';
export const KOFFER_VERSION = 1;

/**
 * Prüft eine eingelesene Ergebnis-Koffer-Datei.
 * @param {unknown} inhalt geparstes JSON
 * @returns {string[]} Fehlerliste (leer = gültig)
 */
export function pruefeKoffer(inhalt) {
  const fehler = [];
  if (typeof inhalt !== 'object' || inhalt === null) return ['Keine gültige Koffer-Datei'];
  const k = inhalt;
  if (k.art !== KOFFER_ART) fehler.push('Das ist keine Ergebnis-Koffer-Datei');
  if (k.version !== KOFFER_VERSION) fehler.push('Unbekannte Datei-Version');
  if (typeof k.quelle !== 'string' || k.quelle.length === 0) fehler.push('Quelle (App) fehlt');
  if (typeof k.tier !== 'string' || k.tier.length === 0) fehler.push('Tiername (statt Klarname) fehlt');
  if (!Array.isArray(k.antworten) || k.antworten.length === 0) {
    fehler.push('Antworten fehlen');
  } else if (!k.antworten.every((a) => a && typeof a.id === 'string' && typeof a.richtig === 'boolean')) {
    fehler.push('Antworten sind ungültig (id/richtig)');
  }
  // Sicherheitsnetz: keine offensichtlich personenbezogenen Felder
  if ('name' in k || 'klarname' in k) fehler.push('Datei enthält verbotene Personendaten');
  return fehler;
}

/**
 * Aggregiert mehrere Koffer zu einer Heatmap.
 * Zusammengeführt wird je Antwort-id; Text vom ersten Auftreten.
 * @param {Array<{quelle:string, tier:string, antworten:Array<{id:string,text?:string,richtig:boolean}>}>} kofferListe
 * @returns {{quelle:string|null, geraete:number, tiere:string[], fragen:Array<{id:string,text:string,gesamt:number,richtig:number,falsch:number,quoteFalsch:number,stufe:string}>}}
 */
export function aggregiere(kofferListe) {
  const tiere = [];
  const fragenMap = new Map(); // id -> {id, text, richtig, falsch}
  let quelle = null;
  for (const koffer of kofferListe) {
    if (quelle === null) quelle = koffer.quelle;
    tiere.push(koffer.tier);
    for (const a of koffer.antworten) {
      if (!fragenMap.has(a.id)) fragenMap.set(a.id, { id: a.id, text: a.text || a.id, richtig: 0, falsch: 0 });
      const eintrag = fragenMap.get(a.id);
      if (a.richtig) eintrag.richtig += 1; else eintrag.falsch += 1;
    }
  }
  const fragen = [...fragenMap.values()].map((f) => {
    const gesamt = f.richtig + f.falsch;
    const quoteFalsch = gesamt === 0 ? 0 : f.falsch / gesamt;
    return { id: f.id, text: f.text, gesamt, richtig: f.richtig, falsch: f.falsch, quoteFalsch, stufe: stufe(quoteFalsch) };
  });
  // Schwerste (höchste Falsch-Quote) zuerst; bei Gleichstand nach id stabil.
  fragen.sort((a, b) => (b.quoteFalsch - a.quoteFalsch) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return { quelle, geraete: kofferListe.length, tiere, fragen };
}

/** Ordnet eine Falsch-Quote einer Heatmap-Stufe zu. */
export function stufe(quoteFalsch) {
  if (quoteFalsch >= 0.6) return 'schwer';
  if (quoteFalsch >= 0.3) return 'mittel';
  return 'leicht';
}

/** Text-Bericht der Auswertung (zum Kopieren/Drucken). */
export function baueBericht(aggregat, { stand = '' } = {}) {
  const zeilen = [
    'Klassen-Koffer-Auswertung',
    aggregat.quelle ? `App: ${aggregat.quelle}` : '',
    stand ? `Stand: ${stand}` : '',
    `Geräte (Tiernamen): ${aggregat.geraete}`,
    '',
    'Schwierigste zuerst (Falsch-Quote):',
  ].filter((z) => z !== '');
  for (const f of aggregat.fragen) {
    const prozent = Math.round(f.quoteFalsch * 100);
    zeilen.push(`[${f.stufe.toUpperCase()}] ${prozent}% falsch (${f.falsch}/${f.gesamt}) – ${f.text}`);
  }
  zeilen.push('');
  zeilen.push('Hinweis: anonyme Auswertung, keine personenbezogenen Daten.');
  return zeilen.join('\n');
}
