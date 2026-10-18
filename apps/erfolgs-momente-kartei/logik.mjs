// Erfolgs-Momente-Kartei: reine Logik ohne DOM, testbar.
// Druckkarten für Fachkräfte zu gemeinsamen Tätigkeiten der ganzen Gruppe.
// Quelle: Praleska (docs/10, Katalog-Konstruktor №2), S. 15 und S. 16.
// Alles, was nicht als Quelle markiert ist, ist Eigenentwurf.
// Politik docs/02: die Karten fragen nach der Lage, nie nach einzelnen Kindern.
// Was gedruckt wird, entsteht hier als Text; der Bildschirm zeigt nur diesen Text.

export const BEDINGUNGEN = Object.freeze(['Raum', 'Material', 'Zeit', 'Gruppengröße']);
export const SEITE = /^S\. \d+$/;
export const TAETIGKEITEN = 8;
export const ROLLE_LABEL = 'Offene Rolle für alle Kinder';
export const IMPULS_LABEL = 'Impulse für die Fachkraft';
export const ZITAT_LABEL = 'Zitat';
export const UEBERTRAGUNG_LABEL = 'Übertragung';

const QUELLE_SEITEN = ['S. 15', 'S. 16', 'S. 15'];
const ZITAT_MAX_WOERTER = 12;
// Eine Impulsfrage fragt nach der Lage, nicht nach einem bestimmten Kind.
const EINZELKIND = /\b(?:dieses|jenes|welches|einzelne[mnrs]?|bestimmte[mnrs]?)\s+Kind\b|\bbei einem Kind\b|\beinem Kind\b|\bein Kind\b/i;

/** Anzahl der Wörter in einem Text. */
export function wortzahl(text) {
  return String(text).trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Prüft das Kartenset. Eine leere Liste heißt: gültig.
 * @param {object} daten Inhalt von daten/karten.json
 * @returns {string[]} Fehlermeldungen
 */
export function pruefeKarten(daten) {
  const fehler = [];
  const karten = daten?.karten ?? [];
  if (karten.length !== TAETIGKEITEN) {
    fehler.push(`${karten.length} Tätigkeitskarten statt ${TAETIGKEITEN}`);
  }
  const ids = karten.map((k) => k.id);
  if (new Set(ids).size !== ids.length) fehler.push('doppelte Karten-IDs');

  for (const k of karten) {
    const wo = k.id ?? '(ohne id)';
    if (!k.titel) fehler.push(`${wo}: Titel fehlt`);
    if (!/Jedes Kind darf/.test(k.rolle ?? '')) fehler.push(`${wo}: Rolle ist nicht offen für alle Kinder`);
    if (k.einordnung !== 'Eigenentwurf') fehler.push(`${wo}: nicht als Eigenentwurf gekennzeichnet`);
    if (!SEITE.test(k.anregung ?? '')) fehler.push(`${wo}: Anregung ohne Seitenangabe`);
    const impulse = k.impulse ?? [];
    if (impulse.length < 2 || impulse.length > 3) {
      fehler.push(`${wo}: ${impulse.length} Impulse statt 2 bis 3`);
    }
    for (const i of impulse) {
      if (!BEDINGUNGEN.includes(i.bedingung)) fehler.push(`${wo}: unbekannte Bedingung „${i.bedingung}“`);
      if (!SEITE.test(i.seite ?? '')) fehler.push(`${wo}: Impuls ohne Seitenangabe`);
      if (!/\?$/.test(i.frage ?? '')) fehler.push(`${wo}: Impuls ist keine Frage`);
      if (EINZELKIND.test(i.frage ?? '')) fehler.push(`${wo}: Impuls fragt nach einzelnen Kindern`);
    }
  }

  const quelle = daten?.quelle;
  if (!quelle) {
    fehler.push('Quellenkarte fehlt');
  } else {
    const seiten = (quelle.eintraege ?? []).map((e) => e.seite);
    if (JSON.stringify(seiten) !== JSON.stringify(QUELLE_SEITEN)) {
      fehler.push(`Quellenkarte: Seiten ${seiten.join(', ')} statt ${QUELLE_SEITEN.join(', ')}`);
    }
    for (const e of quelle.eintraege ?? []) {
      if (e.uebertragung !== 'Eigenentwurf') fehler.push(`Quellenkarte ${e.seite}: Übertragung nicht als Eigenentwurf markiert`);
      for (const z of e.zitate ?? []) {
        if (wortzahl(z) > ZITAT_MAX_WOERTER) fehler.push(`Quellenkarte ${e.seite}: Zitat über ${ZITAT_MAX_WOERTER} Wörter`);
      }
    }
  }
  return fehler;
}

/** Schaltet eine Karte in der Auswahl um, ohne die Eingabe zu verändern. */
export function auswahlUmschalten(auswahl, id) {
  return auswahl.includes(id) ? auswahl.filter((x) => x !== id) : [...auswahl, id];
}

/**
 * Die gewählten Karten in Druckform, in der Reihenfolge der Daten.
 * Unbekannte IDs fallen weg.
 */
export function druckKarten(daten, auswahl) {
  const alle = [...(daten.karten ?? []), ...(daten.quelle ? [daten.quelle] : [])];
  return alle.filter((k) => auswahl.includes(k.id)).map(druckForm);
}

function druckForm(k) {
  if (k.eintraege) {
    return {
      art: 'quelle',
      titel: k.titel,
      eintraege: k.eintraege.map((e) => ({
        kopf: `${e.seite} – ${e.thema}`,
        text: e.text,
        zitate: e.zitate.map((z) => `${ZITAT_LABEL}: „${z}“`),
        uebertragung: `${UEBERTRAGUNG_LABEL}: ${e.uebertragung}`,
      })),
      fuss: k.fussnote,
    };
  }
  return {
    art: 'taetigkeit',
    titel: k.titel,
    rollenLabel: ROLLE_LABEL,
    rolle: k.rolle,
    impulsLabel: IMPULS_LABEL,
    impulse: k.impulse.map((i) => `${i.bedingung}: ${i.frage} (${i.seite})`),
    fuss: `${k.einordnung} – Anregung: ${k.anregung}`,
  };
}

/** Jeder Text, der auf Papier steht, in einer flachen Liste. */
export function druckTexte(karten) {
  const texte = [];
  for (const k of karten) {
    texte.push(k.titel);
    if (k.art === 'quelle') {
      for (const e of k.eintraege) texte.push(e.kopf, e.text, ...e.zitate, e.uebertragung);
      texte.push(k.fuss);
    } else {
      texte.push(k.rollenLabel, k.rolle, k.impulsLabel, ...k.impulse, k.fuss);
    }
  }
  return texte;
}
