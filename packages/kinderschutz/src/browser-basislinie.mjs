// Basislinie der Browser-Prüfung (tools/browser-pruefung.mjs): je App die Zahl der Verletzungen je Kategorie,
// so wie sie auf dem HEAD-Stand gemessen wurde. Die Datei darf nur kleiner werden; eine Erhöhung braucht
// ausdrücklich --erweitern. Dieses Modul entscheidet nichts über die Ausgabe des Messwerkzeugs, es zählt nur.
// Das Tor (Fehler bei jeder Erhöhung) ist noch nicht eingeschaltet: Entscheidung Max ausstehend (№31).

export const KATEGORIEN = ['nichtGemessen', 'ohneKennung', 'klickFehler', 'ueberlauf', 'beruehrung', 'druck', 'konsole', 'fremdeHosts'];

/** Zählt die Verletzungen eines Messergebnisses (JSON aus tools/browser-pruefung.mjs) je Kategorie. */
export function zaehleKategorien(e) {
  const v = e.verletzungen ?? [];
  return {
    nichtGemessen: e.status === 2 ? 1 : 0,
    ohneKennung: v.filter((x) => /Keine Knöpfe mit data-kennung/.test(x)).length,
    klickFehler: v.filter((x) => /^Klick auf|^Fokus nach Klick/.test(x)).length,
    ueberlauf: v.filter((x) => x.startsWith('Überlauf')).length,
    beruehrung: e.beruehrung?.zuKleine?.length ?? 0,
    druck: e.druck?.zeichen?.length ?? 0,
    konsole: (e.konsole?.fehler?.length ?? 0) + (e.konsole?.seitenfehler?.length ?? 0) + (e.antwortFehler?.length ?? 0),
    fremdeHosts: e.netz?.fremd?.length ?? 0,
  };
}

/** Erhöhungen gegenüber der Basislinie: je App und Kategorie, wo der aktuelle Wert über dem Basiswert liegt. */
export function erhoehungen(basis, aktuell) {
  const liste = [];
  for (const [app, werte] of Object.entries(aktuell)) {
    const alt = basis.apps?.[app] ?? {};
    for (const k of KATEGORIEN) {
      const bisher = alt[k] ?? 0;
      if ((werte[k] ?? 0) > bisher) liste.push({ app, kategorie: k, basis: bisher, aktuell: werte[k] ?? 0 });
    }
  }
  return liste;
}

/** Darf die Basislinie geschrieben werden? Nur Senkungen ohne --erweitern; eine Anlage ohne Vorgänger ist erlaubt. */
export function pruefeSchreiben(basis, neu, { erweitern = false } = {}) {
  if (!basis) return { erlaubt: true, erhoehungen: [] };
  const hoch = erhoehungen(basis, neu);
  return { erlaubt: erweitern || hoch.length === 0, erhoehungen: hoch };
}
