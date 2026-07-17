// Feed-Forscher Profi: reine Logik (ohne DOM), testbar.
// Modell der Empfehlungs-Radikalisierung, bewusst ABSTRAKT (docs/09 Nr. 7):
// keine echten Inhalte, Gruppen oder Plattformen - nur die Mechanik.
// Jeder Inhalt hat eine Intensitaets-Stufe 1-5. Der Algorithmus merkt sich
// ein Profil und zielt IMMER etwas schaerfer als der letzte Klick - das ist
// der dokumentierte Kern der Radikalisierungs-Spirale: schaerfer haelt laenger.

export const STUFEN = Object.freeze([
  { stufe: 1, name: 'Alltag & Tipps', farbe: '#15803d' },
  { stufe: 2, name: 'Zugespitzt', farbe: '#ca8a04' },
  { stufe: 3, name: 'Empörung', farbe: '#ea580c' },
  { stufe: 4, name: 'Feindbild', farbe: '#dc2626' },
  { stufe: 5, name: '„Geheimes Wissen“', farbe: '#7f1d1d' },
]);

// Abstrakte Themenwelten. Die Schlagzeilen sind erfundene MUSTER je Stufe -
// der Test prueft, dass keine echten Gruppen/Parteien/Plattformen vorkommen.
export const THEMEN = Object.freeze({
  fitness: {
    name: 'Fitness', emoji: '💪',
    schlagzeilen: {
      1: '10-Minuten-Programm für den Morgen – so bleibst du dran',
      2: 'Warum dein Training WENIGER bringt, als du denkst',
      3: 'Diese Trainings-Lüge macht alle Fortschritte kaputt!',
      4: 'Trainer wollen NICHT, dass du Ergebnisse siehst – so halten sie dich klein',
      5: 'Die EINZIGE Methode, die „die da oben“ vor dir verstecken',
    },
  },
  essen: {
    name: 'Ernährung', emoji: '🥦',
    schlagzeilen: {
      1: 'Fünf schnelle Pausenbrote, die wirklich satt machen',
      2: 'Dieses „gesunde“ Essen ist ungesünder als gedacht',
      3: 'SKANDAL: Was wirklich in deinem Lieblingssnack steckt!',
      4: 'DIE Industrie vergiftet euch absichtlich – und alle schweigen',
      5: 'Nur diese geheime Ernährung heilt ALLES – Ärzte hassen sie',
    },
  },
  nachrichten: {
    name: 'Nachrichten', emoji: '📰',
    schlagzeilen: {
      1: 'So entsteht eine Nachricht: Ein Tag in der Redaktion',
      2: 'Was die Schlagzeilen heute wieder übertreiben',
      3: 'Warum DIESE Meldung dich wütend machen SOLL!',
      4: 'DIE Medien lügen im Auftrag – wer zahlt, bestimmt',
      5: 'Was WIRKLICH passiert: die Wahrheit, die keiner senden darf',
    },
  },
  gaming: {
    name: 'Gaming', emoji: '🎮',
    schlagzeilen: {
      1: 'Fünf Einsteiger-Tricks, die sofort besser machen',
      2: 'Warum dein Lieblingsspiel dich absichtlich verlieren lässt',
      3: 'Dieser Patch ZERSTÖRT das Spiel – alle sind wütend!',
      4: 'Die Entwickler verachten ihre Spieler – hier ist der Beweis',
      5: 'Insider packt aus: das geheime System hinter JEDEM Match',
    },
  },
});

export const START_PROFIL = 1;

const klemm = (p) => Math.max(1, Math.min(5, p));

/** Wohin der Algorithmus nach einem Klick zielt: IMMER schaerfer als der Klick. */
export function algorithmusZiel(klickStufe) {
  return Math.min(5, klickStufe + 0.8);
}

/** Neues Profil nach einem Klick auf Stufe klickStufe. */
export function neuesProfil(profil, klickStufe) {
  return klemm(profil + 0.5 * (algorithmusZiel(klickStufe) - profil));
}

/** Gegensteuern: die zwei Hebel, die Nutzer*innen wirklich haben. */
export function gegensteuern(profil, aktion) {
  if (aktion === 'nicht-interessiert') return klemm(profil - 0.9);
  if (aktion === 'mix') return klemm(profil - 1.6);
  return profil;
}

/**
 * Vier Feed-Karten-Stufen fuer das aktuelle Profil.
 * Zwei nahe am Profil, eine etwas darunter - und IMMER ein Koeder,
 * der eine Stufe schaerfer ist als das Profil (solange moeglich).
 */
export function feedStufen(profil, zufall = Math.random) {
  const basis = Math.round(klemm(profil));
  const s = (n) => Math.max(1, Math.min(5, n));
  return [
    s(basis),
    s(basis + (zufall() < 0.5 ? 0 : -1)),
    s(basis - 1),
    s(basis + 1), // der Koeder
  ];
}

/** Lage der Blase fuer die Anzeige. */
export function blasenLage(profil) {
  if (profil < 2) return { code: 'offen', text: '🟢 Dein Feed ist offen: Alltag, Tipps, verschiedene Töne.' };
  if (profil < 3) return { code: 'einseitig', text: '🟡 Dein Feed wird einseitig: Zuspitzung zieht – und der Algorithmus merkt es sich.' };
  if (profil < 4) return { code: 'heiss', text: '🟠 Dein Feed läuft heiß: Empörung ist jetzt die Normaltemperatur.' };
  return { code: 'geschlossen', text: '🔴 Deine Blase ist geschlossen: Feindbilder und „geheimes Wissen“ – eine andere Welt kommt kaum noch durch.' };
}

export const LEKTIONEN = Object.freeze([
  '🌀 Der Kern der Spirale: Der Algorithmus zeigt dir nicht, was WAHR ist, sondern was dich HÄLT – und Schärferes hält länger. Deshalb zielt jede Empfehlung ein Stück über deinen letzten Klick hinaus.',
  '🪜 Radikalisierung ist eine Treppe, kein Sprung: Von „zugespitzt“ über Dauer-Empörung zum Feindbild und zuletzt zu „nur wir kennen die Wahrheit“. Jede Stufe fühlte sich nur ein bisschen schärfer an als die davor.',
  '⚖️ Deine Rechte seit dem Digital Services Act: Plattformen müssen erklären, WARUM du etwas empfohlen bekommst (Art. 27), und dir eine Feed-Variante OHNE Profiling anbieten (Art. 38 – oft „chronologisch“ genannt). Große Plattformen müssen Radikalisierungs-Risiken ihrer Systeme prüfen und senken (Art. 34/35).',
  '🧭 Deine Hebel: bewusst Mildes anklicken, „Nicht interessiert“ nutzen, Themen mischen, den Nicht-Profiling-Feed einschalten – und die stärkste Frage stellen: „Wer verdient daran, dass ich DAS fühle?“',
]);
