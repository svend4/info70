// Foto-Ampel: reine Logik (ohne DOM), testbar (docs/09 Nr. 220). Vor dem
// Teilen eines Fotos geht die Familie eine Ampel-Entscheidungsstrecke durch
// (Wer ist drauf? Haben alle Ja gesagt? Was verrät der Hintergrund? Etwas
// Peinliches?) und erhält Grün/Gelb/Rot mit kindgerechter Begründung.
// Lernziel: Einwilligung als eigenes Recht – auch bei Eltern-Fotos zählt dein Nein.

export const FRAGEN = Object.freeze([
  { id: 'personen', text: 'Sind außer dir noch andere Menschen auf dem Foto?' },
  { id: 'einverstanden', text: 'Haben ALLE auf dem Foto „Ja“ zum Teilen gesagt?', nurWenn: ['personen', true] },
  { id: 'hintergrund', text: 'Verrät der Hintergrund, wo du wohnst oder zur Schule gehst? (Adresse, Schulname, Hausnummer)' },
  { id: 'peinlich', text: 'Ist etwas Peinliches drauf – oder jemand ohne Kleidung bzw. nur in Badekleidung?' },
]);

/** Welche Fragen sind angesichts der bisherigen Antworten relevant? */
export function relevanteFragen(antworten = {}) {
  return FRAGEN.filter((f) => {
    if (!f.nurWenn) return true;
    const [key, wert] = f.nurWenn;
    return antworten[key] === wert;
  });
}

/** Sind alle relevanten Fragen beantwortet? */
export function fertig(antworten = {}) {
  return relevanteFragen(antworten).every((f) => typeof antworten[f.id] === 'boolean');
}

/**
 * Bewertet die Antworten zu einer Ampel.
 * @param {Record<string, boolean>} antworten
 * @returns {{ampel:'gruen'|'gelb'|'rot', gruende:string[], tipp:string}}
 */
export function bewerte(antworten = {}) {
  const gruende = [];
  let rot = false;
  let gelb = false;

  if (antworten.peinlich === true) {
    rot = true;
    gruende.push('Peinliches oder Fotos in/ohne Badekleidung gehören nicht ins Netz – das kann dir später schaden und ist kaum wieder wegzubekommen.');
  }
  if (antworten.personen === true && antworten.einverstanden === false) {
    rot = true;
    gruende.push('Andere entscheiden mit: Wer abgebildet ist, hat ein Recht am eigenen Bild. Ohne ein klares „Ja“ von allen wird nicht geteilt.');
  }
  if (antworten.hintergrund === true) {
    gelb = true;
    gruende.push('Der Hintergrund verrät zu viel (Adresse, Schule). Schneide ihn weg oder nimm ein anderes Foto.');
  }

  let ampel;
  if (rot) ampel = 'rot';
  else if (gelb) ampel = 'gelb';
  else {
    ampel = 'gruen';
    gruende.push('Nur du drauf (oder alle einverstanden), kein verräterischer Hintergrund, nichts Peinliches – das sieht gut aus.');
  }

  const tipp = ampel === 'gruen'
    ? 'Grünes Licht – aber teile lieber privat als ganz öffentlich. Einmal im Netz, sind Kopien möglich.'
    : ampel === 'gelb'
      ? 'Gelb heißt: erst ändern, dann teilen. Frag im Zweifel eine erwachsene Person.'
      : 'Rot heißt: so nicht teilen. Auch bei einem Foto, das deine Eltern posten wollen, darfst du „Rot“ sagen – dein Nein zählt.';

  return { ampel, gruende, tipp };
}
