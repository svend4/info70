// Wer wohnt wo? – reine Logik (ohne DOM), testbar mit node --test.
// Vier Lebensräume als Häuser (Wald mit Stockwerken, Wiese, Teich,
// Garten/Feld): Bewohner zuordnen, Stockwerk finden, Gast-Regeln.
// Praleska docs/10 (Kinder-Apps Nr. 3), alle Texte Eigenproduktion.

export const JAHRESZEITEN = [
  { id: 'fruehling', name: 'Frühling', emoji: '🌷' },
  { id: 'sommer', name: 'Sommer', emoji: '☀️' },
  { id: 'herbst', name: 'Herbst', emoji: '🍂' },
  { id: 'winter', name: 'Winter', emoji: '❄️' },
];

/** Bestimmter Artikel eines Bewohners („der“/„die“/„das“), sonst „das“. */
export function artikelVon(name, artikel) {
  return artikel?.[name] || 'das';
}

/** Erstes Zeichen groß – für Sätze, die mit dem Artikel beginnen. */
export function gross(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Bewohner eines Lebensraums (für die Chips im Erkunden-Modus). */
export function bewohnerFuer(lebensraumId, bewohner) {
  return bewohner.filter((b) => b.lebensraum === lebensraumId);
}

/** Wald-Stockwerk, in dem ein Bewohner wohnt (Name), sonst null. */
export function stockwerkVon(name, wald) {
  for (const s of wald.stockwerke) if (s.bewohner.includes(name)) return s;
  return null;
}

/**
 * Wohn-Frage: Bewohner + die 4 Lebensräume als Antwortoptionen.
 * waehle: (liste) => Element – injizierbar für deterministische Tests.
 */
export function wohnFrage(bewohner, waehle) {
  const b = waehle(bewohner);
  return { bewohner: b, richtig: b.lebensraum };
}

/**
 * Stockwerk-Frage: ein Stockwerk-Bewohner des Waldes, Antwort = Stockwerk-Id.
 */
export function stockwerkFrage(wald, waehle) {
  const alle = wald.stockwerke.flatMap((s) => s.bewohner.map((name) => ({ name, stockwerk: s.id })));
  const wahl = waehle(alle);
  return { name: wahl.name, richtig: wahl.stockwerk };
}

/** Validiert den Datenbestand; gibt eine Liste von Fehlertexten zurück. */
export function pruefeDaten(daten) {
  const fehler = [];
  const raeume = daten?.lebensraeume;
  if (!Array.isArray(raeume) || raeume.length !== 4) {
    fehler.push('lebensraeume: genau 4 Häuser erwartet');
    return fehler;
  }
  const raumIds = new Set(raeume.map((r) => r.id));
  for (const r of raeume) {
    if (!r.name || !r.emoji || !r.beschreibung) fehler.push(`Lebensraum ${r.id}: name/emoji/beschreibung fehlt`);
    if (!r.wo) fehler.push(`Lebensraum ${r.id}: wo fehlt (Ortsangabe für ganze Sätze)`);
    for (const j of JAHRESZEITEN) {
      if (!r.jahreszeiten?.[j.id]) fehler.push(`Lebensraum ${r.id}: Jahreszeit ${j.id} fehlt`);
    }
  }
  const wald = raeume.find((r) => r.id === 'wald');
  if (!wald || !Array.isArray(wald.stockwerke) || wald.stockwerke.length !== 5) {
    fehler.push('wald: 5 Stockwerke erwartet (Baum/Strauch/Kraut/Boden/Wurzel)');
  } else {
    for (const s of wald.stockwerke) {
      if (!Array.isArray(s.bewohner) || s.bewohner.length < 2) fehler.push(`Stockwerk ${s.id}: mindestens 2 Bewohner`);
      if (!s.info) fehler.push(`Stockwerk ${s.id}: info fehlt`);
      if (!s.kurz) fehler.push(`Stockwerk ${s.id}: kurz fehlt (Name ohne Klammer für Knöpfe und Sätze)`);
      if (s.kurz && !/schicht$/.test(s.kurz)) fehler.push(`Stockwerk ${s.id}: kurz muss auf „schicht“ enden (Satz „in der …“)`);
    }
    const alleStock = wald.stockwerke.flatMap((s) => s.bewohner);
    if (new Set(alleStock).size !== alleStock.length) fehler.push('wald: Bewohner darf nur in EINEM Stockwerk wohnen');
  }
  const bewohner = daten?.bewohner || [];
  if (bewohner.length < 12) fehler.push('bewohner: mindestens 12 für das Wohn-Quiz');
  const namen = new Set();
  for (const b of bewohner) {
    if (namen.has(b.name)) fehler.push(`Bewohner ${b.name}: doppelt – Zuordnung wäre mehrdeutig`);
    namen.add(b.name);
    if (!raumIds.has(b.lebensraum)) fehler.push(`Bewohner ${b.name}: unbekannter Lebensraum ${b.lebensraum}`);
    if (!b.tipp || !b.emoji) fehler.push(`Bewohner ${b.name}: tipp/emoji fehlt`);
  }
  // Konsistenz: Wald-Stockwerk-Bewohner, die auch im Wohn-Quiz vorkommen,
  // müssen dort dem Wald zugeordnet sein (sonst widerspricht sich die App).
  if (wald?.stockwerke) {
    for (const s of wald.stockwerke) {
      for (const name of s.bewohner) {
        const b = bewohner.find((x) => x.name === name);
        if (b && b.lebensraum !== 'wald') fehler.push(`${name}: im Wald-Stockwerk, aber Wohn-Quiz sagt ${b.lebensraum}`);
      }
    }
  }
  // Jeder Name, der in einer Frage oder Antwort auftaucht, braucht einen
  // Artikel – sonst entstehen Sätze wie „Wo wohnt Reh?“.
  const artikel = daten?.artikel || {};
  const namenImText = new Set([...bewohner.map((b) => b.name), ...(wald?.stockwerke || []).flatMap((s) => s.bewohner)]);
  for (const name of namenImText) {
    if (!['der', 'die', 'das'].includes(artikel[name])) fehler.push(`Artikel für ${name} fehlt (der/die/das)`);
  }
  const regeln = daten?.gastRegeln || [];
  if (regeln.length < 6) fehler.push('gastRegeln: mindestens 6 erwartet');
  for (const g of regeln) {
    if (typeof g.richtig !== 'boolean') fehler.push(`Gast-Regel ${g.id}: richtig muss true/false sein`);
    if (!g.aussage || !g.erklaerung) fehler.push(`Gast-Regel ${g.id}: aussage/erklaerung fehlt`);
    // Die Erklärung erscheint auch nach einer falschen Antwort – sie darf
    // deshalb nicht mit einem Lob beginnen.
    if (/^(Richtig|Genau|Stimmt|Ja|Super)\b/.test(g.erklaerung || '')) {
      fehler.push(`Gast-Regel ${g.id}: Erklärung beginnt mit einer Bestätigung – sie steht auch bei falscher Antwort`);
    }
  }
  if (regeln.length && !regeln.some((g) => g.richtig) ) fehler.push('gastRegeln: mindestens eine wahre Aussage');
  if (regeln.length && !regeln.some((g) => !g.richtig)) fehler.push('gastRegeln: mindestens eine falsche Aussage');
  return fehler;
}
