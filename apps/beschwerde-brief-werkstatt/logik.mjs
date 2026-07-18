// Beschwerde-Brief-Werkstatt: reine Logik (ohne DOM), testbar (docs/09
// Nr. 144). Kinder (mit Lehrkraft) formulieren eine echte Beschwerde oder
// Petition und erhalten einen fertig strukturierten Brief. Lernziel: Aufbau,
// Ton und Adressat einer wirksamen Eingabe – Art. 12/13 UN-KRK gelten auch
// gegenüber dem Staat. Reines Text-Bauen, alles lokal.

export const ADRESSATEN = Object.freeze([
  {
    id: 'schulleitung', name: 'Schulleitung', anrede: 'Sehr geehrte Schulleitung,',
    hinweis: 'Für Anliegen in der eigenen Schule – oft der schnellste Weg.',
    schluss: 'Wir bitten Sie, unser Anliegen zu prüfen und uns zu antworten.',
  },
  {
    id: 'klassenrat', name: 'Klassenrat / Klassenleitung', anrede: 'Liebe Klassenleitung, lieber Klassenrat,',
    hinweis: 'Für Themen der Klasse – gut, um gemeinsam zu starten.',
    schluss: 'Wir möchten das im Klassenrat besprechen und gemeinsam entscheiden.',
  },
  {
    id: 'petitionsausschuss', name: 'Petitionsausschuss des Deutschen Bundestags', anrede: 'Sehr geehrte Damen und Herren des Petitionsausschusses,',
    hinweis: 'Petitionen an den Bundestag sind ohne Mindestalter möglich (Art. 17 GG).',
    schluss: 'Wir bitten den Petitionsausschuss, sich mit unserem Anliegen zu befassen.',
  },
  {
    id: 'kinderkommission', name: 'Kinderkommission des Deutschen Bundestags', anrede: 'Sehr geehrte Mitglieder der Kinderkommission,',
    hinweis: 'Die Kinderkommission ist die Anwältin der Kinderinteressen im Bundestag.',
    schluss: 'Wir bitten die Kinderkommission, sich für unser Anliegen einzusetzen.',
  },
]);

const P = (wert, platzhalter) => (wert && String(wert).trim() ? String(wert).trim() : platzhalter);

/** Findet den Adressaten (oder den ersten als Fallback). */
export function findeAdressat(id) {
  return ADRESSATEN.find((a) => a.id === id) ?? ADRESSATEN[0];
}

/** Welche Pflichtfelder fehlen noch? */
export function fehlendeFelder(cfg = {}) {
  const fehlt = [];
  for (const [key, label] of [['betreff', 'Betreff'], ['anliegen', 'Anliegen'], ['begruendung', 'Begründung'], ['vorschlag', 'Vorschlag']]) {
    if (!String(cfg[key] ?? '').trim()) fehlt.push(label);
  }
  return fehlt;
}

/**
 * Baut den Brief/die Petition als Text.
 * @param {{adressat?:string, betreff?:string, anliegen?:string,
 *          begruendung?:string, vorschlag?:string, absender?:string}} cfg
 */
export function baueBrief(cfg = {}) {
  const a = findeAdressat(cfg.adressat);
  const betreff = P(cfg.betreff, '[Worum geht es? – kurzer Betreff]');
  const anliegen = P(cfg.anliegen, '[Was möchtet ihr ändern oder erreichen?]');
  const begruendung = P(cfg.begruendung, '[Warum ist das wichtig? Nennt Beispiele.]');
  const vorschlag = P(cfg.vorschlag, '[Euer konkreter Vorschlag oder eure Bitte.]');
  const absender = P(cfg.absender, '[Euer Name / eure Klasse]');

  return [
    `An: ${a.name}`,
    '',
    `Betreff: ${betreff}`,
    '',
    a.anrede,
    '',
    `wir wenden uns an Sie, weil ${anliegen}`,
    '',
    `Das ist uns wichtig, weil ${begruendung}`,
    '',
    `Unser Vorschlag: ${vorschlag}`,
    '',
    a.schluss,
    '',
    'Als Kinder haben wir das Recht, unsere Meinung zu sagen und gehört zu werden (Art. 12 und 13 UN-Kinderrechtskonvention). Das gilt auch gegenüber Schule und Staat.',
    '',
    'Mit freundlichen Grüßen',
    absender,
    '',
  ].join('\n');
}
