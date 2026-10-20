// Änderungsumfang einer App gegen einen Stand (Standard HEAD): welche entfernten Zeilen über die erlaubte
// Liste hinausgehen. Erlaubt sind nur Entfernungen der Ergebnis-Wertung eines Kindes (Rekord, Rang, Rangliste,
// Punkte, Ampel, Prozent, Pokal). Alles andere wird gemeldet, nicht entschieden. Gemeldet werden auch
// Löschungen von Karte, Knopf und Speicherung (Entscheidungen Max offen), gelöschte Dateien und Tests, die
// ohne Ersatz entfernt wurden. Reine Funktion über den Text eines unified diff mit -U0 (Tests in test/).

// Entfernungen, die zur erlaubten Liste gehören (Ergebnis-Wertung eines Kindes).
export const ERLAUBT = /rekord|\brang|ränge|raenge|\bpunkt|ampel|\d\s?%|prozent|pokal|bestwert|bestenliste|🏆|🥇|🥈|🥉|⭐|🎖|🏅|🌟/i;
// Entfernungen, deren Entscheidung bei Max liegt: Karte „Meine Daten löschen“, Knopf, Speicherung.
export const OFFEN = /Meine Daten löschen|datenKarte|loescheDaten|Löschknopf|removeItem|localStorage\.clear|clear\(\)/;
// Zeilen nur aus Klammern und Satzzeichen zählen als Struktur, nicht als Inhalt.
const STRUKTUR = /^[\s{}()[\];,]*$/;

/** Prüft einen unified diff (-U0). Liefert je Datei die Zahlen und die Befunde. */
export function pruefeDiff(diff) {
  const dateien = [];
  let aktuell = null;
  for (const zeile of diff.split('\n')) {
    const kopf = /^diff --git a\/(\S+) b\/(\S+)/.exec(zeile);
    if (kopf) {
      aktuell = { datei: kopf[2], entfernt: 0, hinzu: 0, strukturell: 0, testsEntfernt: 0, testsHinzu: 0, geloescht: false, befunde: [] };
      dateien.push(aktuell);
      continue;
    }
    if (!aktuell) continue;
    if (zeile.startsWith('deleted file mode')) { aktuell.geloescht = true; continue; }
    if (zeile.startsWith('+++') || zeile.startsWith('---')) continue;
    if (zeile.startsWith('-')) {
      const t = zeile.slice(1);
      aktuell.entfernt++;
      // Ein entfernter Test wird über die Ersatz-Zählung geprüft, nicht über die Wortliste.
      if (/^\s*test\(/.test(t)) aktuell.testsEntfernt++;
      else if (STRUKTUR.test(t)) aktuell.strukturell++;
      else if (OFFEN.test(t)) aktuell.befunde.push({ art: 'offen (Entscheidung Max)', zeile: t.trim() });
      else if (!ERLAUBT.test(t)) aktuell.befunde.push({ art: 'Entfernung außerhalb der erlaubten Liste', zeile: t.trim() });
    } else if (zeile.startsWith('+')) {
      aktuell.hinzu++;
      if (/^\s*test\(/.test(zeile.slice(1))) aktuell.testsHinzu++;
    }
  }
  for (const d of dateien) {
    if (d.geloescht) d.befunde.push({ art: 'Datei gelöscht', zeile: d.datei });
    if (d.testsEntfernt > d.testsHinzu) {
      d.befunde.push({ art: 'Test ohne Ersatz entfernt', zeile: `${d.testsEntfernt - d.testsHinzu} mehr entfernt als neu` });
    }
  }
  return dateien;
}

/** Zusammenfassung über alle Dateien: Zahl der Befunde und die Zeilen. */
export function zusammenfassung(dateien) {
  return {
    dateien: dateien.length,
    entfernt: dateien.reduce((s, d) => s + d.entfernt, 0),
    hinzu: dateien.reduce((s, d) => s + d.hinzu, 0),
    befunde: dateien.reduce((s, d) => s + d.befunde.length, 0),
  };
}
