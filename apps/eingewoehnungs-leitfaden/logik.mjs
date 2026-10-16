// Eingewöhnungs-Leitfaden: reine Logik ohne DOM, testbar. Vier Phasen der
// Eingewöhnung, je Phase eine Checkliste eigener Handlungen der Fachkraft.
// Keine Kinder, keine Bewertung, keine Summe über Phasen (docs/02, Z. 141–146).

export const PHASEN_IDS = ['grundphase', 'trennungsversuch', 'stabilisierung', 'schlussphase'];

/** Schlüssel einer Handlung im Zustand der Seite, z. B. "grundphase/bezugsperson". */
export function schluessel(phaseId, handlungId) {
  return `${phaseId}/${handlungId}`;
}

/** Prüft die Config. Liefert eine Fehlerliste; leer heißt in Ordnung. */
export function pruefeConfig(config) {
  const fehler = [];
  const phasen = config?.phasen;
  if (!Array.isArray(phasen)) return ['phasen fehlen'];
  if (phasen.length !== PHASEN_IDS.length || !phasen.every((p, i) => p?.id === PHASEN_IDS[i])) {
    fehler.push('vier Phasen in der Reihenfolge Grundphase, erster Trennungsversuch, Stabilisierungsphase, Schlussphase erwartet');
  }
  for (const p of phasen) {
    if (!p || typeof p.name !== 'string' || typeof p.info !== 'string') {
      fehler.push(`Phase ${p?.id ?? '?'}: Name oder Info fehlt`);
      continue;
    }
    if (!Array.isArray(p.handlungen) || p.handlungen.length === 0) {
      fehler.push(`Phase ${p.id}: keine Handlungen`);
      continue;
    }
    const kennungen = new Set();
    for (const h of p.handlungen) {
      if (!h || typeof h.id !== 'string' || !h.id) {
        fehler.push(`Phase ${p.id}: Handlung ohne Kennung`);
        break;
      }
      if (typeof h.frage !== 'string' || !h.frage.endsWith('?')) {
        fehler.push(`Phase ${p.id}: Handlung „${h.id}“ ist keine Frage`);
      }
      if (kennungen.has(h.id)) fehler.push(`Phase ${p.id}: Kennung „${h.id}“ doppelt`);
      kennungen.add(h.id);
    }
  }
  return fehler;
}

/** Zahlen für die Bilanz einer Phase: erledigt und gesamt, nur innerhalb dieser Phase. */
export function bilanzZahlen(phase, erledigt) {
  const gesamt = phase.handlungen.length;
  const anzahl = phase.handlungen.filter((h) => erledigt.has(schluessel(phase.id, h.id))).length;
  return { erledigt: anzahl, gesamt };
}

/** Bilanz-Text einer Phase, z. B. „erledigt: 3 von 6“. Keine Summe über Phasen, kein Prozentwert. */
export function bilanz(phase, erledigt) {
  const { erledigt: anzahl, gesamt } = bilanzZahlen(phase, erledigt);
  return `erledigt: ${anzahl} von ${gesamt}`;
}

/** Inhalt des Druckbogens einer Phase: nur die Haken der laufenden Sitzung, keine Namenszeile. */
export function druckBlatt(config, phaseId, erledigt) {
  const nummer = config.phasen.findIndex((p) => p.id === phaseId) + 1;
  const phase = config.phasen[nummer - 1];
  if (!phase) throw new Error(`Unbekannte Phase: ${phaseId}`);
  return {
    titel: `Eingewöhnung – Phase ${nummer}: ${phase.name}`,
    info: phase.info,
    punkte: phase.handlungen.map((h) => ({
      frage: h.frage,
      erledigt: erledigt.has(schluessel(phase.id, h.id)),
    })),
    bilanz: bilanz(phase, erledigt),
  };
}
