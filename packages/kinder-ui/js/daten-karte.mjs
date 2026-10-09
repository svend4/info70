// kinder-ui: Daten-Karte – einheitlicher "Meine Daten löschen"-Baustein.
//
// docs/02 verlangt in der Release-Checkliste ausdrücklich: "Нет персональных
// данных; localStorage очищается кнопкой". `quiz-kern` bringt diesen Knopf
// für die Quiz-Apps mit; alle anderen Apps mussten ihn bisher selbst bauen –
// und zwölf haben ihn deshalb gar nicht gehabt, obwohl impressum.html den
// Kindern zusichert, Spielstände ließen sich "in jeder App mit einem Knopf
// löschen". Dieser Baustein macht die Zusicherung einlösbar.
//
// Bewusst NICHT localStorage.clear(): Eine App darf nur ihre eigenen
// Schlüssel entfernen. clear() würde auf demselben Gerät auch die
// Anzeige-Einstellungen (hoher Kontrast, Schriftgröße) und die Daten der
// Nachbar-Apps wegwerfen – für ein Kind, das Kontrast braucht, wäre das ein
// Rückschritt mitten im Spiel.
import { el } from './komponenten.mjs';

export const DATEN_TEXTE = Object.freeze({
  titel: '🔒 Deine Daten',
  knopf: '🗑️ Meine Daten löschen',
  bestaetigung: 'Gelöscht. Auf diesem Gerät ist jetzt nichts mehr von dir gespeichert.',
  nichts: 'Hier wird nichts über dich gespeichert: keine Werbung, keine Anmeldung, keine Namen.',
});

/** Ein Schlüssel oder viele – immer als Liste, ohne Leeres. */
export function schluesselListe(schluessel) {
  const liste = Array.isArray(schluessel) ? schluessel : [schluessel];
  return liste.filter((s) => typeof s === 'string' && s.length > 0);
}

/**
 * Entfernt genau die eigenen Schlüssel und sagt, wie viele davon wirklich
 * belegt waren. Die Zahl trägt die Rückmeldung an das Kind: "gelöscht" zu
 * melden, wo nie etwas lag, wäre eine kleine Unwahrheit.
 * @returns {number} Anzahl tatsächlich entfernter Einträge
 */
export function loescheDaten(schluessel, speicher = globalThis.localStorage) {
  let entfernt = 0;
  for (const s of schluesselListe(schluessel)) {
    try {
      if (speicher?.getItem(s) !== null && speicher?.getItem(s) !== undefined) entfernt++;
      speicher?.removeItem(s);
    } catch {
      // Privates Fenster oder gesperrter Speicher: nichts zu löschen.
    }
  }
  return entfernt;
}

/** Was steht gerade auf dem Gerät? Für den Hinweistext der Karte. */
export function istBelegt(schluessel, speicher = globalThis.localStorage) {
  return schluesselListe(schluessel).some((s) => {
    try { return speicher?.getItem(s) != null; } catch { return false; }
  });
}

// Die Bestätigung muss das Neuzeichnen überleben: `nachLoeschen` baut den
// Bildschirm komplett neu auf und wirft den Meldungsknoten damit weg. Ein
// Kind, das löscht und nichts gemeldet bekommt, weiß nicht, ob es geklappt
// hat. Deshalb merkt sich das Modul einen Takt lang, dass gelöscht wurde,
// und die neu gebaute Karte zeigt die Meldung dann selbst.
let geradeGeloescht = false;

/** Nur für Tests: den Merker zurücksetzen. */
export function setzeMerkerZurueck() {
  geradeGeloescht = false;
}

/**
 * Die Karte. `was` beschreibt in Kindersprache, was gespeichert ist
 * ("dein Rekord"); `nachLoeschen` zeichnet den Bildschirm neu, damit die
 * Anzeige nicht hinter dem Speicher herläuft.
 *
 * Der Fokus bleibt nach dem Löschen auf dem Knopf: Wer mit der Tastatur
 * arbeitet, soll nicht an den Seitenanfang zurückgeworfen werden.
 *
 * @param {{schluessel: string|string[], was?: string, nachLoeschen?: () => void, speicher?: Storage, knopfId?: string, klasse?: string}} optionen
 */
export function datenKarte({ schluessel, was, nachLoeschen, speicher, knopfId = 'daten-loeschen', klasse = '' } = {}) {
  const t = DATEN_TEXTE;
  const hinweis = was
    ? `Gespeichert wird nur ${was} – und zwar nur hier auf diesem Gerät. Keine Namen, keine Werbung, keine Anmeldung.`
    : t.nichts;
  // Wurde im vorigen Takt gelöscht? Dann meldet die frisch gebaute Karte es.
  const meldungsText = geradeGeloescht ? t.bestaetigung : '';
  geradeGeloescht = false;
  const meldung = el('p', { style: 'margin:0.4rem 0 0;font-weight:700', 'aria-live': 'polite' }, meldungsText);
  // `klasse` haengt eine App-Klasse an - gebraucht wird das fuer die
  // Nur-Bildschirm-Klasse der druckenden Apps: ohne sie landete die Karte
  // samt Loeschknopf auf dem Papier, und ein Druckblatt traegt keinen Knopf
  // (docs/02). Gefunden im Review der Welle 80.
  return el('section', { class: `k-karte${klasse ? ` ${klasse}` : ''}` },
    el('h2', { style: 'margin-top:0' }, t.titel),
    el('p', { style: 'margin-top:0' }, hinweis),
    el('div', { class: 'k-antworten' },
      el('button', {
        id: knopfId,
        class: 'k-knopf k-knopf--neutral',
        onclick: () => {
          loescheDaten(schluessel, speicher ?? globalThis.localStorage);
          if (nachLoeschen) {
            // Neu zeichnen: die neue Karte trägt die Meldung.
            geradeGeloescht = true;
            nachLoeschen();
          } else {
            meldung.textContent = t.bestaetigung;
          }
          document.getElementById(knopfId)?.focus();
        },
      }, t.knopf)),
    meldung);
}
