// Nachrichtentypen für den Ausbreitungs-Simulator (docs/09 Ось G).
// Reine Daten (ohne DOM), testbar. Der Simulator (sim.mjs) bleibt gleich;
// nur die Rahmung ändert sich je Typ: Kettenbrief oder Mutprobe/Challenge.
// Der Challenge-Typ hat zusätzlich die Handlungsoption „melden“.

export const NACHRICHTEN_TYPEN = Object.freeze([
  {
    id: 'kettenbrief',
    titel: 'Kettenbrief',
    emoji: '⛓️',
    intro: 'In der Klasse taucht eine Kettennachricht auf:',
    nachricht: '⛓️😱 ACHTUNG! Schick diese Nachricht noch HEUTE an 2 Freunde weiter, sonst hast du 10 Jahre Pech!!! Ein Junge hat nicht weitergeleitet und dann...',
    frage: 'Dein Herz klopft. Was machst du?',
    weiter: '😰 An 2 Freunde weiterleiten – sicher ist sicher',
    stopp: '🛑 STOPP! Löschen und Freund*innen warnen',
    melden: null,
    lernpunkte: [
      '🔍 Kettennachrichten arbeiten mit Angst und Zeitdruck – genau daran erkennst du sie.',
      '🙅 Es passiert NICHTS, wenn du nicht weiterleitest. Pech kann man nicht verschicken.',
      '🛑 Löschen + Bescheid sagen („Das ist ein Kettenbrief, ignorier ihn!“) schützt deine Freund*innen.',
      '💬 Macht dir eine Nachricht Angst? Sprich mit Erwachsenen – oder ruf die Nummer gegen Kummer an: 116 111 (kostenlos).',
    ],
  },
  {
    id: 'mutprobe',
    titel: 'Mutprobe / Challenge',
    emoji: '🔥',
    intro: 'In der Gruppe geht eine Mutprobe herum:',
    nachricht: '🔥😎 CHALLENGE! Trau dich: Mach das Video nach und tagge 3 Leute – sonst bist du ein Feigling und raus aus der Gruppe!',
    frage: 'Alle scheinen mitzumachen. Was machst du?',
    weiter: '😬 Mitmachen und 3 Leute taggen',
    stopp: '🛑 Nicht mitmachen – „Nein danke“ sagen',
    melden: '📣 Einer erwachsenen Person / in der App melden',
    lernpunkte: [
      '🔥 Mutproben und Challenges arbeiten mit Gruppendruck: „Alle machen mit.“ Das stimmt oft gar nicht.',
      '💪 Echt mutig ist, NEIN zu sagen. Manche Challenges sind gefährlich – da ist Aussteigen die starke Entscheidung.',
      '📣 Melden ist kein Petzen: Erzähl es einer erwachsenen Person oder melde es in der App – so schützt du auch andere.',
      '💬 Fühlst du dich unter Druck? Ruf die Nummer gegen Kummer an: 116 111 (kostenlos).',
    ],
  },
]);

/** Findet einen Nachrichtentyp per id (Fallback: der erste). */
export function typNach(id) {
  return NACHRICHTEN_TYPEN.find((t) => t.id === id) ?? NACHRICHTEN_TYPEN[0];
}
