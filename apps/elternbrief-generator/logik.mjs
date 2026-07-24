// Elternbrief-Generator Krippenjahr: reine Logik (ohne DOM), testbar.
// Formular-zu-Text-Generator: aus Monat, Altersband und gewählten Themen
// entsteht ein fertiger Elternbrief („Was Ihr Kind jetzt lernt“ + bildschirm-
// freie Spielideen). Immer über die GRUPPE, nie über einzelne Kinder.
// Praleska docs/10 (Top-30 Nr. 17).

/** Prüft die Baustein-Bank. Liefert Fehlerliste (leer = gültig). */
export function pruefeBausteine(daten) {
  const fehler = [];
  if (!Array.isArray(daten?.altersbaender) || daten.altersbaender.length < 2) fehler.push('Altersbänder fehlen');
  if (!Array.isArray(daten?.monate) || daten.monate.length !== 12) fehler.push('12 Monate erwartet');
  if (!Array.isArray(daten?.themen) || daten.themen.length < 4) fehler.push('mindestens 4 Themen');
  const baender = (daten?.altersbaender ?? []).map((a) => a.id);
  for (const t of daten?.themen ?? []) {
    for (const band of baender) {
      if (!t.lernt?.[band] || t.lernt[band].length < 40) fehler.push(`${t.id}/${band}: Lern-Text fehlt`);
      if (!t.spielidee?.[band] || t.spielidee[band].length < 40) fehler.push(`${t.id}/${band}: Spielidee fehlt`);
    }
  }
  if (!daten?.schluss || daten.schluss.length < 40) fehler.push('Schluss-Text fehlt');
  return fehler;
}

/** Kürzt/normalisiert den optionalen Einrichtungs-/Gruppennamen (keine Kindernamen!). */
export function normalisiereName(roh) {
  return String(roh ?? '').trim().slice(0, 60);
}

/**
 * Baut den Elternbrief als Text.
 * @param {object} daten bausteine.json
 * @param {{monat: string, altersband: string, themenIds: string[], kitaName?: string, gruppenName?: string}} auswahl
 * @returns {string} '' wenn keine Themen gewählt sind
 */
export function baueBrief(daten, auswahl) {
  const themen = daten.themen.filter((t) => (auswahl.themenIds ?? []).includes(t.id));
  if (themen.length === 0) return '';
  const band = daten.altersbaender.find((a) => a.id === auswahl.altersband) ?? daten.altersbaender[0];
  const kita = normalisiereName(auswahl.kitaName);
  const gruppe = normalisiereName(auswahl.gruppenName);

  const kopf = [kita, gruppe].filter(Boolean).join(' · ');
  const zeilen = [];
  if (kopf) zeilen.push(kopf, '');
  zeilen.push(`Elternbrief ${auswahl.monat} – Altersgruppe ${band.name}`, '', 'Liebe Eltern,', '');
  zeilen.push(`hier ein kleiner Einblick, womit sich die Kinder gerade beschäftigen – und dazu je eine einfache Spielidee für zu Hause, ganz ohne Bildschirm.`, '');
  for (const t of themen) {
    zeilen.push(`${t.emoji} ${t.name}`);
    zeilen.push(`Was Ihr Kind jetzt lernt: ${t.lernt[band.id]}`);
    zeilen.push(`Spielidee für zu Hause (ohne Bildschirm): ${t.spielidee[band.id]}`, '');
  }
  zeilen.push(daten.schluss, '', 'Herzliche Grüße', 'Ihr Team' + (gruppe ? ` der Gruppe ${gruppe}` : ''));
  return zeilen.join('\n');
}
