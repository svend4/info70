// Reim-Werkstatt – reine Logik (ohne DOM), testbar mit node --test.
// Reimfamilien, Reimrätsel und ein Quatschreim-Generator.
// Praleska docs/10 (Kinder-Apps Nr. 20).
//
// Der ganze Nutzen hängt daran, dass sich die Wörter wirklich reimen.
// Deshalb ist „Wort gehört zur Familie“ keine Behauptung in der Prosa,
// sondern eine Regel, die der Validator an jedem Datensatz nachrechnet.

/** Letztes Wort einer Zeile, ohne Satzzeichen. */
export function letztesWort(zeile) {
  const geputzt = String(zeile).replace(/[^\wÄÖÜäöüß]+$/u, '');
  const teile = geputzt.split(/\s+/).filter(Boolean);
  return teile.length ? teile[teile.length - 1] : '';
}

/** Reimt sich das Wort auf die Endung der Familie? */
export function reimtSich(wort, endung) {
  return String(wort).toLowerCase().endsWith(String(endung).toLowerCase());
}

export function familieVon(daten, id) {
  return daten.familien.find((f) => f.id === id) ?? null;
}

/** Alle Reimpartner eines Wortes – ohne das Wort selbst. */
export function reimpartner(daten, wort) {
  const familie = daten.familien.find((f) => f.woerter.some((w) => w.toLowerCase() === String(wort).toLowerCase()));
  if (!familie) return null;
  return { familie, partner: familie.woerter.filter((w) => w.toLowerCase() !== String(wort).toLowerCase()) };
}

/** Ein Reimrätsel mit gemischten Antwortmöglichkeiten. */
export function baueRaetsel(daten, zufall, mischen, vorher = null) {
  const auswahl = vorher ? daten.raetsel.filter((r) => r.id !== vorher.raetsel.id) : daten.raetsel;
  const raetsel = zufall(auswahl.length ? auswahl : daten.raetsel);
  return {
    raetsel,
    familie: familieVon(daten, raetsel.familie),
    optionen: mischen([raetsel.loesung, ...raetsel.ablenker]),
  };
}

/** Ein Quatschreim: fester Anfang, gezogene Reimzeile. */
export function baueQuatsch(daten, zufall, vorher = null) {
  const auswahl = vorher ? daten.quatschRahmen.filter((q) => q.id !== vorher.rahmen.id) : daten.quatschRahmen;
  const rahmen = zufall(auswahl.length ? auswahl : daten.quatschRahmen);
  return {
    rahmen,
    familie: familieVon(daten, rahmen.familie),
    endung: zufall(rahmen.endungen),
  };
}

/** Wie viele verschiedene Quatschreime sind möglich? */
export function quatschVielfalt(daten) {
  return daten.quatschRahmen.reduce((summe, q) => summe + q.endungen.length, 0);
}

/**
 * Validiert die Reimdaten. Die tragenden Regeln:
 * - jedes Wort einer Familie endet wirklich auf deren Endung,
 * - die erste Rätselzeile endet auf einen Reimpartner der Lösung,
 * - die Lösung steht nirgends schon im Text (sonst ist nichts zu raten),
 * - kein Ablenker reimt sich (sonst gäbe es zwei richtige Antworten).
 */
export function pruefeDaten(daten) {
  const fehler = [];
  const { familien, raetsel, quatschRahmen } = daten ?? {};

  if (!Array.isArray(familien) || familien.length < 8) fehler.push('familien: mindestens 8 erwartet');
  if (Array.isArray(familien)) {
    const ids = new Set();
    for (const f of familien) {
      const wo = `Familie ${f.id || '?'}`;
      if (!f.id || ids.has(f.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
      ids.add(f.id);
      if (!f.endung || !f.emoji) fehler.push(`${wo}: endung/emoji fehlt`);
      if (!Array.isArray(f.woerter) || f.woerter.length < 4) fehler.push(`${wo}: mindestens 4 Wörter erwartet`);
      else {
        if (new Set(f.woerter.map((w) => w.toLowerCase())).size !== f.woerter.length) fehler.push(`${wo}: doppeltes Wort`);
        for (const w of f.woerter) {
          if (!reimtSich(w, f.endung)) fehler.push(`${wo}: „${w}“ endet nicht auf „${f.endung}“ und reimt sich nicht`);
        }
      }
    }
  }

  const finde = (id) => (Array.isArray(familien) ? familien.find((f) => f.id === id) : null);

  if (!Array.isArray(raetsel) || raetsel.length < 6) fehler.push('raetsel: mindestens 6 erwartet');
  if (Array.isArray(raetsel)) {
    const ids = new Set();
    for (const r of raetsel) {
      const wo = `Rätsel ${r.id || '?'}`;
      if (!r.id || ids.has(r.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
      ids.add(r.id);
      const f = finde(r.familie);
      if (!f) { fehler.push(`${wo}: Familie ${r.familie} gibt es nicht`); continue; }
      if (!r.zeile1 || !r.zeile2Vor || !r.loesung) { fehler.push(`${wo}: zeile1/zeile2Vor/loesung fehlt`); continue; }
      if (!f.woerter.includes(r.loesung)) fehler.push(`${wo}: Lösung „${r.loesung}“ gehört nicht zur Familie`);
      const vorbild = letztesWort(r.zeile1);
      if (!reimtSich(vorbild, f.endung)) fehler.push(`${wo}: erste Zeile endet auf „${vorbild}“ und gibt keinen Reim vor`);
      if (vorbild.toLowerCase() === r.loesung.toLowerCase()) fehler.push(`${wo}: erste Zeile nennt schon die Lösung`);
      if (`${r.zeile1} ${r.zeile2Vor}`.toLowerCase().includes(r.loesung.toLowerCase())) {
        fehler.push(`${wo}: die Lösung steht schon im Text`);
      }
      if (!Array.isArray(r.ablenker) || r.ablenker.length !== 2) fehler.push(`${wo}: genau 2 Ablenker erwartet`);
      else for (const a of r.ablenker) {
        if (reimtSich(a, f.endung)) fehler.push(`${wo}: Ablenker „${a}“ reimt sich ebenfalls – zwei richtige Antworten`);
      }
    }
  }

  if (!Array.isArray(quatschRahmen) || quatschRahmen.length < 4) fehler.push('quatschRahmen: mindestens 4 erwartet');
  if (Array.isArray(quatschRahmen)) {
    for (const q of quatschRahmen) {
      const wo = `Quatschreim ${q.id || '?'}`;
      const f = finde(q.familie);
      if (!f) { fehler.push(`${wo}: Familie ${q.familie} gibt es nicht`); continue; }
      if (!q.zeile1) fehler.push(`${wo}: zeile1 fehlt`);
      if (!Array.isArray(q.endungen) || q.endungen.length < 3) fehler.push(`${wo}: mindestens 3 Reimzeilen erwartet`);
      else for (const e of q.endungen) {
        const wort = letztesWort(e);
        if (!reimtSich(wort, f.endung)) fehler.push(`${wo}: Zeile endet auf „${wort}“ und reimt sich nicht auf „${f.endung}“`);
      }
    }
  }

  return fehler;
}
