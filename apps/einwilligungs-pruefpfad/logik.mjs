// Einwilligungs-Prüfpfad Art. 8 DSGVO: reine Logik (ohne DOM), testbar
// (docs/09 Ось D Nr. 219). Geführter Frage-Pfad für Betreiber; am Ende ein
// Prüfbericht mit Lücken-Liste. Kein Rechtsrat.

/** Findet die gewählte Antwort-Option eines Schritts. */
export function antwortVon(schritt, wert) {
  return schritt.antworten.find((a) => a.wert === wert) ?? null;
}

/** Alle Schritte flach (der Pfad hat nur eine Ebene). */
export function alleSchritte(daten) {
  return daten.schritte;
}

/**
 * Sammelt die Lücken aus den gegebenen Antworten.
 * Eine Lücke entsteht, wenn die gewählte Antwort `luecke: true` trägt.
 * @returns {{id:string,titel:string,hinweis:string}[]}
 */
export function sammleLuecken(daten, antworten = {}) {
  const luecken = [];
  for (const s of daten.schritte) {
    const wert = antworten[s.id];
    if (wert == null) continue;
    const a = antwortVon(s, wert);
    if (a && a.luecke) {
      luecken.push({ id: s.id, titel: s.titel, hinweis: a.hinweis ?? 'Bitte prüfen.' });
    }
  }
  return luecken;
}

/** Zählt beantwortete Schritte, Lücken und noch offene Schritte. */
export function zaehle(daten, antworten = {}) {
  const gesamt = daten.schritte.length;
  let beantwortet = 0;
  for (const s of daten.schritte) if (antworten[s.id] != null) beantwortet++;
  const luecken = sammleLuecken(daten, antworten).length;
  return { gesamt, beantwortet, offen: gesamt - beantwortet, luecken };
}

/** true, wenn alle Schritte beantwortet und keine Lücke offen ist. */
export function istVollstaendigOhneLuecken(daten, antworten = {}) {
  const z = zaehle(daten, antworten);
  return z.offen === 0 && z.luecken === 0;
}

const stand = () => {
  try {
    return new Date().toLocaleDateString('de-DE');
  } catch {
    return '';
  }
};

/**
 * Baut den Prüfbericht als Text.
 * @param {object} daten pfad.json
 * @param {Record<string,string>} antworten schritt-id -> gewählter wert
 */
export function pruefbericht(daten, antworten = {}) {
  const z = zaehle(daten, antworten);
  const zeilen = [
    'Einwilligungs-Prüfpfad Art. 8 DSGVO – Prüfbericht',
    `Grundlage: ${daten.quelle}`,
    `Stand: ${stand()}`,
    `Beantwortet: ${z.beantwortet}/${z.gesamt}   Offen: ${z.offen}   Lücken: ${z.luecken}`,
    '',
    '## Antworten',
  ];
  for (const s of daten.schritte) {
    const wert = antworten[s.id];
    if (wert == null) {
      zeilen.push(`◻️ ${s.titel} — (noch nicht beantwortet)`);
      continue;
    }
    const a = antwortVon(s, wert);
    const sym = a && a.luecke ? '⚠️' : '✔️';
    zeilen.push(`${sym} ${s.titel} — ${a ? a.text : wert} [${s.bezug}]`);
  }
  zeilen.push('');
  const luecken = sammleLuecken(daten, antworten);
  if (luecken.length) {
    zeilen.push('## Lücken – als Nächstes klären/umsetzen');
    for (const l of luecken) zeilen.push(`- ${l.titel}: ${l.hinweis}`);
  } else if (z.offen === 0) {
    zeilen.push('## Ergebnis');
    zeilen.push('Keine offenen Lücken gefunden. Prüfpfad vollständig durchlaufen.');
  } else {
    zeilen.push('## Hinweis');
    zeilen.push(`Noch ${z.offen} Schritt(e) offen – bitte vollständig durchlaufen.`);
  }
  zeilen.push('');
  zeilen.push('Hinweis: Selbstprüfung, kein offizielles Konformitätsergebnis und kein Rechtsrat.');
  return zeilen.join('\n');
}
