// Gesunder-Körper-Ampel – reine Logik (ohne DOM), testbar mit node --test.
// Tägliche Selbstbeobachtung nach den Katalog-Faktoren für einen gesunden
// Körper (Bewegung, Ruhe/Schlaf, Essen und Trinken, frische Luft,
// Sauberkeit). Praleska docs/10 (Kinder-Apps Nr. 14).
//
// Bewusst OHNE Punkte, Summen, Serien und Ränge: Das Kind beschreibt
// seinen Tag, es wird nicht bewertet. Der Validator setzt das durch.

/** So viele Tage zeigt der Rückblick – und so viele werden gespeichert. */
export const TAGE_IM_RUECKBLICK = 7;

/** Die Schlüssel der obersten Ebene, die die Daten haben dürfen. Jeder andere Schlüssel
 *  ist ein Fehler: so kann keine Tabelle, keine Wertung und kein Zähler hineinkommen. */
export const ERLAUBTE_SCHLUESSEL = Object.freeze(['version', 'zielgruppe', 'stufen', 'faktoren']);

/** Die drei Selbstauskunfts-Stufen in fester Reihenfolge. */
export const STUFEN_IDS = ['viel', 'etwas', 'nochNicht'];

/**
 * Die Skala läuft in EINE Richtung: 🟢 „heute viel“ ist das Ende, an dem
 * ein Kind zufrieden sein darf, ⚪ „heute noch nicht“ ist stillschweigend
 * in Ordnung. Jeder Faktor muss deshalb nach etwas fragen, von dem mehr
 * besser ist. Bildschirmzeit ist das Gegenteil davon: würde die App fragen,
 * wie lange heute ein Gerät an war, wäre 🟢 „viel“ plötzlich die schlechte
 * Antwort – die Skala würde ihre Bedeutung umdrehen, und das Kind würde
 * seinen eigenen Medienkonsum benoten. Genau das soll hier nicht passieren.
 * Darum wird die bildschirmfreie Zeit gefragt, nicht die Bildschirmzeit.
 */
const GERAETE = /Bildschirm|Handy|Tablet|Fernseh|Konsole|Computer|Smartphone|Gerät|Display|Laptop|Monitor|Serie|Video|Youtube|TikTok/i;
const OHNE_GERAET = /ohne Bildschirm|ohne Gerät|bildschirmfrei/i;
const MENGENFRAGE = /wie (lange|viel|oft|häufig)/i;

/** Lokales Datum als 'JJJJ-MM-TT' (nicht UTC, sonst kippt der Tag abends). */
export function datumsSchluessel(datum) {
  const j = datum.getFullYear();
  const m = String(datum.getMonth() + 1).padStart(2, '0');
  const t = String(datum.getDate()).padStart(2, '0');
  return `${j}-${m}-${t}`;
}

/** Die letzten `anzahl` Tagesschlüssel, aufsteigend, endend mit `heute`. */
export function letzteTage(anzahl, heute) {
  const tage = [];
  for (let i = anzahl - 1; i >= 0; i--) {
    const d = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate() - i);
    tage.push(datumsSchluessel(d));
  }
  return tage;
}

/**
 * Datensparsamkeit: alles außerhalb des Rückblick-Fensters fällt weg.
 * Gibt ein neues Objekt zurück, verändert `tage` nicht.
 */
export function beschneide(tage, heute, anzahl = TAGE_IM_RUECKBLICK) {
  const erlaubt = new Set(letzteTage(anzahl, heute));
  const gekuerzt = {};
  for (const [schluessel, eintrag] of Object.entries(tage || {})) {
    if (erlaubt.has(schluessel)) gekuerzt[schluessel] = eintrag;
  }
  return gekuerzt;
}

/**
 * Rein beschreibende Auszählung für einen Faktor über das Fenster:
 * wie oft „viel“, „etwas“, „noch nicht“ – und an wie vielen Tagen gar
 * nichts eingetragen wurde. Keine Wertung, keine Reihenfolge, keine Note.
 */
export function zaehleStufen(tage, faktorId, fenster) {
  const zaehler = { viel: 0, etwas: 0, nochNicht: 0, offen: 0 };
  for (const schluessel of fenster) {
    const stufe = tage?.[schluessel]?.[faktorId];
    if (STUFEN_IDS.includes(stufe)) zaehler[stufe] += 1;
    else zaehler.offen += 1;
  }
  return zaehler;
}

/** Sind heute alle Faktoren beantwortet? */
export function alleBeantwortet(eintrag, faktoren) {
  return faktoren.every((f) => STUFEN_IDS.includes(eintrag?.[f.id]));
}

/**
 * Validiert die Faktor-Daten. Prüft neben der Vollständigkeit ausdrücklich
 * die Politik dieser App: genau drei Stufen ohne Zahlenwert, kein Rot,
 * nur die erlaubten Schlüssel oben – damit aus der Selbstbeobachtung kein
 * Bewertungswerkzeug werden kann (EU AI Act: kein Scoring von Kindern).
 */
export function pruefeFaktoren(daten) {
  const fehler = [];
  if (daten && typeof daten === 'object') {
    for (const k of Object.keys(daten)) {
      if (!ERLAUBTE_SCHLUESSEL.includes(k)) fehler.push(`unbekannter Schlüssel: ${k} (diese App bewertet Kinder nicht)`);
    }
  }
  const faktoren = daten?.faktoren;
  if (!Array.isArray(faktoren) || faktoren.length < 4) {
    fehler.push('faktoren: mindestens 4 erwartet');
    return fehler;
  }
  const ids = new Set();
  for (const f of faktoren) {
    const wo = `Faktor ${f.id || '?'}`;
    if (!f.id || ids.has(f.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
    ids.add(f.id);
    if (!f.name || !f.emoji || !f.frage || !f.impuls) fehler.push(`${wo}: name/emoji/frage/impuls fehlt`);
    if (f.frage && !f.frage.includes('?')) fehler.push(`${wo}: frage ist keine Frage`);
    // Siehe GERAETE oben: ein Geräte-Faktor darf nur nach der Zeit OHNE Gerät
    // fragen, sonst kippt die Bedeutung der Ampel.
    // Geprüft werden die Felder, die die AUFGABE tragen: `frage` setzt die
    // Richtung der Ampel, `name` beschriftet die Spalte im
    // Wochenrückblick – ein „Bildschirmzeit“ dort hätte dieselbe
    // Wirkung wie in der Frage. Der `impuls` ist dagegen der erklärende
    // Text und muss benennen dürfen, was die App gerade NICHT tut
    // („sie zählt keine Minuten … nicht, wie lange ein Bildschirm an war“).
    for (const feld of ['frage', 'name']) {
      const text = f[feld];
      if (!text || !GERAETE.test(text)) continue;
      if (!OHNE_GERAET.test(text)) {
        fehler.push(`${wo}.${feld}: nennt das Gerät statt die Zeit ohne Gerät – dann wäre „heute viel“ die schlechte Antwort`);
      }
      if (MENGENFRAGE.test(text)) {
        fehler.push(`${wo}.${feld}: diese App misst keine Bildschirmzeit und fragt nicht nach Dauer`);
      }
    }
  }
  const stufen = daten?.stufen;
  if (!Array.isArray(stufen) || stufen.length !== 3) {
    fehler.push('stufen: genau 3 erwartet');
  } else {
    if (stufen.map((s) => s.id).join(',') !== STUFEN_IDS.join(',')) {
      fehler.push(`stufen: ids müssen ${STUFEN_IDS.join(', ')} sein`);
    }
    for (const s of stufen) {
      if (!s.emoji || !s.text) fehler.push(`Stufe ${s.id}: emoji/text fehlt`);
      if ('punkte' in s || 'wert' in s) fehler.push(`Stufe ${s.id}: diese App vergibt keine Punkte`);
      if (s.emoji === '🔴' || s.emoji === '❌') fehler.push(`Stufe ${s.id}: kein Rot – ein ruhiger Tag ist kein Fehler`);
    }
  }
  return fehler;
}
