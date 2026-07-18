// Poster „Drei starke Züge“ (docs/09 Ось H): reine Logik ohne DOM, testbar.
// Verdichtet pro Themenfeld die beste Handlungsfolge der Szenario-Trainer auf
// drei Züge – für die Klassenzimmerwand (A3). Reine Datenaufbereitung.

/** Fehlerliste eines Posters (leer = gültig). */
export function pruefePoster(p) {
  const fehler = [];
  if (!p || typeof p !== 'object') return ['kein Poster-Objekt'];
  if (!p.id || !p.titel || !p.emoji) fehler.push('Kopf (id/titel/emoji) fehlt');
  if (!p.merksatz || p.merksatz.length < 10) fehler.push('Merksatz fehlt/zu kurz');
  if (!Array.isArray(p.schritte) || p.schritte.length !== 3) {
    fehler.push('genau drei Züge nötig');
  } else {
    p.schritte.forEach((s, i) => {
      if (!s.zug || !s.text) fehler.push(`Zug ${i + 1} unvollständig`);
      if (s.text && s.text.length < 15) fehler.push(`Zug ${i + 1} Text zu dünn`);
    });
  }
  return fehler;
}

/** Vorlese-Text eines Posters (Titel, drei Züge, Merksatz). */
export function posterText(p) {
  const zuege = p.schritte.map((s, i) => `${i + 1}. ${s.zug}. ${s.text}`).join(' ');
  return `${p.titel}. Drei starke Züge: ${zuege} Merksatz: ${p.merksatz}`;
}
