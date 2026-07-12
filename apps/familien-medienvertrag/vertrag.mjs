// Familien-Medienvertrag: reine Logik ohne DOM, damit sie testbar bleibt.
// Kernkonzept (docs/09, Idee Nr. 25): aus Regel-Bausteinen bauen Eltern UND
// Kind gemeinsam einen Vertrag, den beide unterschreiben. Pflicht sind darum
// genau drei Kategorien - Regeln fürs Kind, Regeln für die Eltern und
// gemeinsame Regeln (keine einseitigen Verbote).

/** Die drei Kategorien, die ein gültiger Regel-Katalog enthalten muss. */
export const PFLICHT_KATEGORIEN = ['kind', 'eltern', 'gemeinsam'];

/**
 * Prüft den Regel-Katalog und liefert eine Liste von Fehlern (leer = gültig).
 * Bedingungen: alle drei Pflicht-Kategorien vorhanden, je mindestens
 * `mindestProKategorie` Regeln, jede Regel mindestens `mindestZeichen` Zeichen,
 * eindeutige Regel-IDs.
 * @param {unknown} daten geparstes JSON
 * @param {{ mindestProKategorie?: number, mindestZeichen?: number }} [optionen]
 * @returns {string[]}
 */
export function pruefeRegeln(daten, { mindestProKategorie = 6, mindestZeichen = 20 } = {}) {
  const fehler = [];
  const d = /** @type {Record<string, unknown>} */ (daten);
  if (typeof daten !== 'object' || daten === null || !Array.isArray(d.kategorien)) {
    return ['kategorien fehlt oder ist kein Array'];
  }

  const vorhandeneIds = d.kategorien.map((k) => k?.id);
  for (const pflicht of PFLICHT_KATEGORIEN) {
    if (!vorhandeneIds.includes(pflicht)) fehler.push(`Kategorie "${pflicht}" fehlt`);
  }

  const alleRegelIds = [];
  for (const kat of d.kategorien) {
    const wo = kat?.id ?? '<ohne id>';
    if (!kat?.id || !kat?.name) fehler.push(`${wo}: id oder name fehlt`);
    if (!Array.isArray(kat?.regeln)) {
      fehler.push(`${wo}: regeln fehlt oder ist kein Array`);
      continue;
    }
    if (kat.regeln.length < mindestProKategorie) {
      fehler.push(`${wo}: weniger als ${mindestProKategorie} Regeln`);
    }
    for (const r of kat.regeln) {
      const rwo = `${wo}/${r?.id ?? '<ohne id>'}`;
      alleRegelIds.push(r?.id);
      if (!r?.id) fehler.push(`${rwo}: id fehlt`);
      if (!(typeof r?.text === 'string' && r.text.trim().length >= mindestZeichen)) {
        fehler.push(`${rwo}: Text fehlt oder ist kürzer als ${mindestZeichen} Zeichen`);
      }
    }
  }

  if (new Set(alleRegelIds).size !== alleRegelIds.length) fehler.push('doppelte Regel-IDs');
  return fehler;
}

/**
 * Stellt aus Katalog + Auswahl den fertigen Vertrag zusammen (reine Daten).
 * @param {{kategorien: Array<{id:string,name:string,emoji?:string,regeln:Array<{id:string,text:string}>}>}} daten
 * @param {Record<string, boolean>} [ausgewaehlt] Regel-ID -> angehakt?
 * @param {string[]} [eigene] frei formulierte eigene Regeln
 * @returns {{abschnitte: Array<{id:string,name:string,emoji?:string,regeln:string[]}>, eigene: string[], anzahl: number}}
 */
export function sammleVertrag(daten, ausgewaehlt = {}, eigene = []) {
  const abschnitte = daten.kategorien.map((kat) => ({
    id: kat.id,
    name: kat.name,
    emoji: kat.emoji,
    regeln: kat.regeln.filter((r) => ausgewaehlt[r.id]).map((r) => r.text),
  }));
  const eigeneRegeln = eigene.map((t) => String(t).trim()).filter((t) => t.length > 0);
  const anzahl = abschnitte.reduce((s, a) => s + a.regeln.length, 0) + eigeneRegeln.length;
  return { abschnitte, eigene: eigeneRegeln, anzahl };
}
