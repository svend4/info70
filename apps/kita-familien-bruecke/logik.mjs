// Kita-Familien-Brücke – reine Logik (ohne DOM), testbar mit node --test.
// Team-Selbstcheck Erziehungspartnerschaft: 12 Kriterien in 4 Bereichen,
// Ampel-Auswertung je Bereich und gesamt, Maßnahmenkatalog für alles, was
// noch nicht „Trifft zu“ ist. Bewertet wird die eigene TEAMPRAXIS – niemals
// einzelne Familien oder Kinder. Praleska docs/10 (Top-30 Nr. 30).

/** Alle Kriterien flach (mit Bereichs-Referenz). */
export function alleKriterien(bereiche) {
  return bereiche.flatMap((b) => b.kriterien.map((k) => ({ ...k, bereichId: b.id, bereichName: b.name, bereichEmoji: b.emoji })));
}

/** Ampel für erreichte Punkte: ≥80 % grün, ≥50 % gelb, sonst rot. */
export function ampel(punkte, max) {
  if (!max) return 'rot';
  const anteil = punkte / max;
  if (anteil >= 0.8) return 'gruen';
  if (anteil >= 0.5) return 'gelb';
  return 'rot';
}

/**
 * Auswertung. antworten: { [kriteriumId]: 0|1|2 }.
 * Liefert Punkte/Ampel je Bereich und gesamt sowie die Zahl offener Fragen.
 */
export function bewerte(antworten, bereiche) {
  const jeBereich = bereiche.map((b) => {
    const werte = b.kriterien.map((k) => antworten[k.id]).filter((w) => Number.isInteger(w));
    const punkte = werte.reduce((s, w) => s + w, 0);
    const max = b.kriterien.length * 2;
    return { id: b.id, name: b.name, emoji: b.emoji, punkte, max, ampel: ampel(punkte, max) };
  });
  const punkte = jeBereich.reduce((s, b) => s + b.punkte, 0);
  const max = jeBereich.reduce((s, b) => s + b.max, 0);
  const beantwortet = alleKriterien(bereiche).filter((k) => Number.isInteger(antworten[k.id])).length;
  return {
    gesamt: { punkte, max, ampel: ampel(punkte, max) },
    jeBereich,
    offen: alleKriterien(bereiche).length - beantwortet,
  };
}

/** Maßnahmenkatalog: alle Kriterien mit Antwort < 2, mit ihren Maßnahmen. */
export function massnahmenKatalog(antworten, bereiche) {
  return alleKriterien(bereiche)
    .filter((k) => Number.isInteger(antworten[k.id]) && antworten[k.id] < 2)
    .map((k) => ({ id: k.id, bereichName: k.bereichName, bereichEmoji: k.bereichEmoji, these: k.these, wert: antworten[k.id], massnahmen: k.massnahmen }));
}

/** Validiert den Kriterien-Katalog; gibt eine Liste von Fehlertexten zurück. */
export function pruefeKriterien(daten) {
  const fehler = [];
  const bereiche = daten?.bereiche;
  if (!Array.isArray(bereiche) || bereiche.length !== 4) {
    fehler.push('bereiche: genau 4 Bereiche erwartet');
    return fehler;
  }
  const ids = new Set();
  for (const b of bereiche) {
    if (!b.id || !b.name || !b.emoji) fehler.push(`Bereich ${b.id || '?'}: id/name/emoji fehlt`);
    if (!Array.isArray(b.kriterien) || b.kriterien.length !== 3) {
      fehler.push(`Bereich ${b.id}: genau 3 Kriterien erwartet (12 Kooperationsziele)`);
      continue;
    }
    for (const k of b.kriterien) {
      const wo = `Kriterium ${k.id || '?'}`;
      if (!k.id || ids.has(k.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
      ids.add(k.id);
      if (!k.these || !k.these.trim()) fehler.push(`${wo}: these fehlt`);
      if (!Array.isArray(k.woran) || k.woran.length < 2) fehler.push(`${wo}: mindestens 2 Woran-Beispiele`);
      if (!Array.isArray(k.massnahmen) || k.massnahmen.length < 2) fehler.push(`${wo}: mindestens 2 Maßnahmen`);
    }
  }
  const skala = daten?.skala;
  if (!Array.isArray(skala) || skala.map((s) => s.wert).join(',') !== '2,1,0') {
    fehler.push('skala: Werte 2/1/0 erwartet');
  }
  // Buchgetreue Reflexionsdimension: Abschied von der Belehrungshaltung –
  // Eltern als Experten für ihr Kind muss als Kriterium vorkommen.
  if (!alleKriterien(bereiche).some((k) => /Expert/.test(k.these))) {
    fehler.push('kriterien: „Eltern als Experten“ (Haltungs-Dimension) fehlt');
  }
  return fehler;
}
