// Nahrungsnetz-Werkstatt: reine Logik (ohne DOM), testbar. Ein stark
// vereinfachtes Ökosystem-Modell: verändere EINE Art, das Modell rechnet EINEN
// Schritt weiter (Räuber und Beute passen sich an). Kein echtes Gleichgewichts-
// modell – eine kindgerechte Veranschaulichung. Praleska docs/10 (Top-30 Nr. 21).

export const MIN = 0;

/** Prüft ein Netze-Bündel. Liefert Fehlerliste (leer = gültig). */
export function pruefeNetze(daten) {
  const fehler = [];
  if (!Array.isArray(daten?.netze) || daten.netze.length < 2) return ['zu wenige Netze'];
  for (const netz of daten.netze) {
    const artIds = new Set(netz.arten.map((a) => a.id));
    if (netz.arten.length < 4) fehler.push(`${netz.id}: mindestens 4 Arten`);
    if (!netz.arten.some((a) => a.ebene === 'produzent')) fehler.push(`${netz.id}: kein Produzent`);
    for (const k of netz.ketten) {
      if (!artIds.has(k.fresser)) fehler.push(`${netz.id}: Fresser ${k.fresser} unbekannt`);
      if (!artIds.has(k.beute)) fehler.push(`${netz.id}: Beute ${k.beute} unbekannt`);
      if (k.fresser === k.beute) fehler.push(`${netz.id}: ${k.fresser} frisst sich selbst`);
    }
    // jede Nicht-Produzenten-Art hat mindestens eine Nahrungsquelle
    for (const a of netz.arten) {
      if (a.ebene !== 'produzent' && !netz.ketten.some((k) => k.fresser === a.id)) {
        fehler.push(`${netz.id}: ${a.id} hat keine Nahrung`);
      }
    }
  }
  return fehler;
}

/** Start-Bestände: jede Art auf dem Startwert. */
export function startBestand(netz, daten) {
  const b = {};
  for (const a of netz.arten) b[a.id] = daten.startBestand ?? 3;
  return b;
}

const clamp = (x, max) => Math.max(MIN, Math.min(max, x));
const vorzeichen = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);

/**
 * Ein Simulationsschritt: die gewählte Art wird um `delta` verändert; danach
 * passen sich die DIREKT verbundenen Arten um einen Schritt an:
 *  - Räuber der Art folgen ihr (mehr Beute → mehr Räuber; sign(delta)).
 *  - Beute der Art reagiert gegenläufig (mehr Räuber → weniger Beute; -sign).
 * Werte werden auf 0..max begrenzt. Reine Funktion (Original unverändert).
 * @returns {Record<string, number>} neuer Bestand
 */
export function simuliere(netz, bestand, artId, delta, max = 5) {
  const neu = { ...bestand };
  const s = vorzeichen(delta);
  neu[artId] = clamp((bestand[artId] ?? 0) + delta, max);
  if (s === 0) return neu;
  for (const k of netz.ketten) {
    if (k.beute === artId) neu[k.fresser] = clamp((bestand[k.fresser] ?? 0) + s, max);   // Räuber folgt der Beute
    if (k.fresser === artId) neu[k.beute] = clamp((bestand[k.beute] ?? 0) - s, max);      // Beute reagiert gegenläufig
  }
  return neu;
}

/** Namen-Lookup. */
export function artName(netz, artId) {
  const a = netz.arten.find((x) => x.id === artId);
  return a ? `${a.emoji} ${a.name}` : artId;
}

/**
 * Kindgerechte Erklärung der Kettenwirkung eines Schrittes.
 * @returns {{art: string, richtung: string, folgen: string[], warnung: string|null}}
 */
export function erklaere(netz, bestand, artId, delta, max = 5) {
  const nachher = simuliere(netz, bestand, artId, delta, max);
  const s = vorzeichen(delta);
  const richtung = s > 0 ? 'mehr' : 'weniger';
  const folgen = [];
  for (const k of netz.ketten) {
    if (k.beute === artId && nachher[k.fresser] !== bestand[k.fresser]) {
      folgen.push(`${artName(netz, k.fresser)} bekommt ${s > 0 ? 'mehr Futter und wird mehr' : 'weniger Futter und wird weniger'}.`);
    }
    if (k.fresser === artId && nachher[k.beute] !== bestand[k.beute]) {
      folgen.push(`${artName(netz, k.beute)} wird ${s > 0 ? 'mehr gefressen und wird weniger' : 'weniger gefressen und wird mehr'}.`);
    }
  }
  // Warnung, wenn eine Art ganz verschwindet
  const verschwunden = netz.arten.filter((a) => (bestand[a.id] ?? 0) > 0 && nachher[a.id] === 0);
  let warnung = null;
  if (verschwunden.length) {
    warnung = `Achtung: ${verschwunden.map((a) => artName(netz, a.id)).join(', ')} ${verschwunden.length === 1 ? 'ist' : 'sind'} ganz verschwunden! Fehlt ein Glied, gerät das ganze Netz ins Wanken.`;
  }
  return { art: artName(netz, artId), richtung, folgen, warnung };
}
