// Erstes-Handy-Kompass: Merker für den Namen auf der Urkunde (nur Initialen oder Spitzname).
// Der Wert liegt ausschließlich im Speicher dieses Tabs. Er überlebt das Neuzeichnen der
// Seite (render in app.mjs), wird aber nirgends abgelegt: nicht im Browser-Speicher, nicht im
// Netz (Datenvermeidung). Ohne DOM, damit test/namen-merker.test.mjs die Logik direkt prüft.

export const MAX_ZEICHEN = 12;
export const PLATZHALTER = '________________';

let gemerkt = '';

/** Merkt die Eingabe im Modul, auf MAX_ZEICHEN gekürzt. Leerzeichen bleiben; getrimmt wird erst auf der Urkunde. */
export function merkeName(eingabe) {
  gemerkt = String(eingabe ?? '').slice(0, MAX_ZEICHEN);
}

/** Der gemerkte Wert wie eingegeben. So wird das Formularfeld beim Neuaufbau gefüllt. */
export function gemerkterName() {
  return gemerkt;
}

/** Was auf der Urkunde steht: der getrimmte Wert oder eine Linie zum Ausfüllen von Hand. */
export function urkundenName() {
  return gemerkt.trim() || PLATZHALTER;
}
