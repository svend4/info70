// Tierkinder – Vorlesen: reine Logik ohne DOM, testbar.
// Die Bausteine stehen in daten/bausteine.json. Hier wird gewählt, jeder Tierart
// ihr Ort zugeordnet und der Vorlesetext aus festen eigenen Bausteinen zusammengesetzt.
// Keine Speicherung, keine Eingabe zu Kindern, keine Bewertung.

/** Pflichtmarkierung auf jedem gedruckten Blatt mit Seitenangabe. */
export const PFLICHTMARKIERUNG = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';

/** Noch nichts gewählt. */
export function startzustand() {
  return { tierart: null, ort: null, jungtier: null };
}

function finde(liste, id) {
  return liste.find((e) => e.id === id) ?? null;
}

/**
 * Die Orte, die zu einer Tierart passen (nach Quelle S. 114). Unbekannte Tierart: leere Liste.
 * @param {object} daten
 * @param {string|null} tierartId
 * @returns {object[]}
 */
export function orteFuer(daten, tierartId) {
  const tierart = finde(daten.tierarten, tierartId);
  if (!tierart) return [];
  return tierart.orte.map((id) => finde(daten.orte, id)).filter(Boolean);
}

/**
 * Tierart wählen. Passt der bisherige Ort nicht, wird der erste passende Ort gesetzt.
 * Liefert einen neuen Zustand; das Original bleibt unverändert.
 */
export function waehleTierart(daten, zustand, id) {
  if (!finde(daten.tierarten, id)) return { ...zustand };
  const erlaubt = orteFuer(daten, id);
  const ort = erlaubt.some((o) => o.id === zustand.ort) ? zustand.ort : (erlaubt[0]?.id ?? null);
  return { tierart: id, ort, jungtier: zustand.jungtier };
}

/** Ort wählen. Ein Ort, der zur Tierart nicht passt, wird abgelehnt. */
export function waehleOrt(daten, zustand, id) {
  const erlaubt = orteFuer(daten, zustand.tierart).some((o) => o.id === id);
  return erlaubt ? { ...zustand, ort: id } : { ...zustand };
}

/** Jungtier-Thema wählen. Unbekannte Kennung wird abgelehnt. */
export function waehleJungtier(daten, zustand, id) {
  return finde(daten.jungtiere, id) ? { ...zustand, jungtier: id } : { ...zustand };
}

/** Vollständig: Tierart, ein zur Tierart passender Ort und ein Jungtier-Thema. */
export function vollstaendig(daten, zustand) {
  return Boolean(zustand.tierart && zustand.ort && zustand.jungtier)
    && orteFuer(daten, zustand.tierart).some((o) => o.id === zustand.ort)
    && Boolean(finde(daten.jungtiere, zustand.jungtier));
}

/** Hinweis, was noch fehlt. */
export function zustandsText(zustand) {
  const offen = [];
  if (!zustand.tierart) offen.push('Tierart');
  if (!zustand.ort) offen.push('Ort');
  if (!zustand.jungtier) offen.push('Jungtier-Thema');
  return offen.length ? `Noch offen: ${offen.join(', ')}.` : 'Alles gewählt.';
}

/** Alle gültigen Kombinationen aus Tierart, passendem Ort und Jungtier-Thema. */
export function alleKombinationen(daten) {
  const out = [];
  for (const t of daten.tierarten) {
    for (const o of orteFuer(daten, t.id)) {
      for (const j of daten.jungtiere) {
        out.push({ tierart: t.id, ort: o.id, jungtier: j.id });
      }
    }
  }
  return out;
}

/** Anzahl der eigenen Bausteine: Einleitungen, Orte, Jungtier-Themen, Schluss, Sachfrage. */
export function anzahlBausteine(daten) {
  return daten.tierarten.length + daten.orte.length + daten.jungtiere.length + 2;
}

/**
 * Ein Absatz des Vorlesetextes. Mit Seite, wenn er einen Sachbezug hat;
 * sonst steht ausdrücklich „ohne Quelle“.
 */
function absatz(schritt, text, seite, kopf = null) {
  const kenn = seite
    ? `Eigenentwurf. Sachbezug: Praleska, ${seite}.`
    : 'Eigenentwurf, ohne Quelle.';
  return { schritt, text, seite, kennzeichnung: kopf ? `${kopf}. ${kenn}` : kenn };
}

/**
 * Der Vorlesetext zur Auswahl, oder null, solange die Auswahl nicht vollständig ist.
 * Fünf Absätze in fester Reihenfolge: Einleitung, Ort, Jungtier, Schluss, Kuschel-Sachfrage.
 * @returns {null|{kopf: string, bezeichnung: string, absaetze: object[], hinweis: string, quelle: string, pflicht: string}}
 */
export function vorlesetext(daten, zustand) {
  if (!vollstaendig(daten, zustand)) return null;
  const tierart = finde(daten.tierarten, zustand.tierart);
  const ort = finde(daten.orte, zustand.ort);
  const jungtier = finde(daten.jungtiere, zustand.jungtier);
  return {
    kopf: daten.titel,
    bezeichnung: `Tierart: ${tierart.name}. Ort: ${ort.name}. Jungtier-Thema: ${jungtier.name}.`,
    absaetze: [
      absatz('Einleitung', tierart.einleitung, tierart.seite),
      absatz('Ort', ort.text, ort.seite),
      absatz('Jungtier', jungtier.text, jungtier.seite),
      absatz('Schluss', daten.schluss.text, null),
      absatz('Sachfrage', daten.sachfrage.text, null, 'Kuschel-Sachfrage'),
    ],
    hinweis: daten.hinweis,
    quelle: daten.quelle,
    pflicht: PFLICHTMARKIERUNG,
  };
}

/** Der ganze Text als Zeilen, so wie er auf dem Blatt steht (für Prüfungen). */
export function vorlesetextAlsText(text) {
  return [
    text.kopf,
    text.bezeichnung,
    ...text.absaetze.flatMap((a) => [a.text, a.kennzeichnung]),
    text.hinweis,
    text.quelle,
    text.pflicht,
  ].join('\n');
}
