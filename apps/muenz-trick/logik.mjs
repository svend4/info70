// Münz-Trick: reine Logik (ohne DOM), testbar.
// Thema (Kostenfallen): Spiele verstecken echtes Geld hinter einer
// Spiel-Währung ("Juwelen"). Zwei Nebelwände: (1) Man kauft Juwelen nur in
// Paketen, die NIE genau passen. (2) Preise stehen in Juwelen, nicht in Euro.
// So verliert man das Gefühl fürs echte Geld - und behält immer einen "Rest",
// der zum nächsten Kauf lockt. Diese Datei rechnet den WAHREN Preis aus.

export const PAKETE = Object.freeze([
  { juwelen: 100, cent: 99, lockung: null },
  { juwelen: 550, cent: 399, lockung: '+10% extra!' },
  { juwelen: 1200, cent: 799, lockung: '+20% extra!' },
  { juwelen: 2500, cent: 1499, lockung: 'Bestseller' },
]);

export const ITEMS = Object.freeze([
  { code: 'emote', name: 'Tanz-Emote', emoji: '💃', juwelen: 350 },
  { code: 'skin', name: 'Drachen-Skin', emoji: '🐉', juwelen: 1350 },
  { code: 'pass', name: 'Battle-Pass', emoji: '🎟️', juwelen: 980 },
  { code: 'waffe', name: 'Glitzer-Waffe', emoji: '✨', juwelen: 700 },
]);

const cent = (v) => `${(v / 100).toFixed(2).replace('.', ',')} €`;

/** Preis pro 100 Juwelen in Cent - zeigt die "Mengenrabatt"-Verlockung. */
export function preisPro100(paket) {
  return (paket.cent / paket.juwelen) * 100;
}

/**
 * Günstigster echter Kauf, um mindestens `zielJuwelen` zu bekommen.
 * DP über "mindestens j Juwelen": jede Überzahlung ist frei (geklemmt auf 0).
 * @returns {{ cent:number, erhalten:number, rest:number, pakete:Record<number,number> }}
 */
export function guenstigsterKauf(zielJuwelen, pakete = PAKETE) {
  const kosten = [0];
  const wahl = [{}];
  for (let j = 1; j <= zielJuwelen; j++) {
    kosten[j] = Infinity;
    wahl[j] = null;
    for (const p of pakete) {
      const von = Math.max(0, j - p.juwelen);
      const c = kosten[von] + p.cent;
      if (c < kosten[j]) {
        kosten[j] = c;
        wahl[j] = { ...wahl[von], [p.juwelen]: (wahl[von][p.juwelen] ?? 0) + 1 };
      }
    }
  }
  const gewaehlt = wahl[zielJuwelen] ?? {};
  const erhalten = Object.entries(gewaehlt).reduce((s, [jw, n]) => s + Number(jw) * n, 0);
  return { cent: kosten[zielJuwelen], erhalten, rest: erhalten - zielJuwelen, pakete: gewaehlt };
}

/** Vollständige Aufschlüsselung eines Items für die Anzeige. */
export function wahrerPreis(item) {
  const kauf = guenstigsterKauf(item.juwelen);
  return {
    item,
    ...kauf,
    centText: cent(kauf.cent),
    scheinPreis: `${item.juwelen} 💎`,
  };
}

export { cent };

export const LEKTIONEN = Object.freeze([
  '💎 Juwelen, Coins, V-Bucks: Das ist kein Spielkram – das ist echtes Geld mit einem Kostüm. Die Spiel-Währung macht nur eins: Sie versteckt, wie viele echte Euro du ausgibst.',
  '🧩 Die Pakete passen NIE genau: Ein Item kostet 350 – aber kaufen kannst du nur 100er- oder 550er-Pakete. Egal wie du rechnest, ein Rest bleibt übrig.',
  '🪝 Der Rest ist Absicht: Die übrigen Juwelen sind zu wenig fürs nächste Item, aber genug, damit du denkst „ein kleines Paket noch …“. So geht der Kreislauf weiter.',
  '🏷️ „+20% extra!“ klingt nach Geschenk, ist aber Lockmittel: Große Pakete sollen dich mehr kaufen lassen, als du brauchst. Rechne den WAHREN Preis in Euro – dann entscheidest du, nicht das Spiel.',
  '💛 Faustregel: Bei jedem „Juwelen kaufen“ zuerst umrechnen: Wie viele echte Euro sind das? Und immer vorher mit deinen Eltern reden – In-App-Käufe kann man am Gerät auch sperren.',
]);
