// Seiten-Scanner: reine Logik (ohne DOM), testbar.
// Kinder-Version des kriterien-check (docs/09 Nr. 135): eine abhakbare
// Checkliste mit kindgerecht formulierten Fragen, die ein Kind neben einer
// beliebigen Webseite durchgeht. Am Ende eine Ampel-Einschaetzung. Jede Frage
// hat eine "sichere" Antwort (ja/nein) und einen Tipp, falls es anders ist.

export const FRAGEN = Object.freeze([
  { code: 'impressum', frage: 'Steht irgendwo, wer die Seite macht (ein Impressum)?', gut: 'ja',
    erklaerung: 'Eine gute Seite sagt, wer dahintersteckt. Fehlt das ganz, sei vorsichtig.',
    tipp: 'Kein Impressum? Frag Erwachsene, bevor du dort etwas machst.' },
  { code: 'name', frage: 'Will die Seite gleich deinen echten Namen oder deine Adresse wissen?', gut: 'nein',
    erklaerung: 'Eine gute Kinderseite braucht deinen echten Namen und deine Adresse nicht.',
    tipp: 'Gib keinen echten Namen und keine Adresse ein. Ein Spitzname reicht – oder frag Erwachsene.' },
  { code: 'werbung', frage: 'Ist viel Werbung da, die dich zum Kaufen drängt?', gut: 'nein',
    erklaerung: 'Gute Kinderseiten sind werbefrei oder haben klar getrennte, harmlose Hinweise.',
    tipp: 'Viel Kauf-Werbung? Klick nichts an und lass dich nicht drängen.' },
  { code: 'fremdchat', frage: 'Kannst du dort mit Fremden schreiben, ohne dass jemand aufpasst?', gut: 'nein',
    erklaerung: 'Ein offener Chat mit Fremden ohne Aufsicht ist ein Risiko. Gute Seiten moderieren oder haben einen Melde-Knopf.',
    tipp: 'Offener Fremden-Chat? Schreib nichts Privates und erzähl Erwachsenen davon.' },
  { code: 'kosten', frage: 'Willst du für „gratis“ deine Handynummer angeben oder etwas kaufen?', gut: 'nein',
    erklaerung: '„Gratis, aber gib deine Nummer“ ist oft eine Kostenfalle.',
    tipp: 'Nichts eingeben, nichts kaufen ohne Erwachsene. „Gratis“ ist selten wirklich gratis.' },
  { code: 'kindgerecht', frage: 'Ist die Seite für Kinder gemacht – verständlich und freundlich?', gut: 'ja',
    erklaerung: 'Für Kinder gemachte Seiten sind klar, freundlich und altersgerecht.',
    tipp: 'Wirkt die Seite gar nicht für Kinder? Dann ist sie vielleicht nicht die richtige für dich.' },
  { code: 'hilfe', frage: 'Gibt es einen Weg, Probleme zu melden oder Hilfe zu finden?', gut: 'ja',
    erklaerung: 'Ein Melde- oder Hilfe-Weg zeigt, dass die Seite dich schützen will.',
    tipp: 'Kein Melde-Weg? Merk dir: Bei Problemen hilft die Nummer gegen Kummer 116 111.' },
  { code: 'datenschutz', frage: 'Sagt die Seite, was mit deinen Daten passiert (Datenschutz)?', gut: 'ja',
    erklaerung: 'Eine faire Seite erklärt, welche Daten sie sammelt – am besten in einfacher Sprache.',
    tipp: 'Kein Wort zum Datenschutz? Dann lieber keine Daten eingeben.' },
  { code: 'gefuehl', frage: 'Fühlt sich etwas komisch, gruselig oder zu aufdringlich an?', gut: 'nein',
    erklaerung: 'Dein Bauchgefühl ist ein wichtiger Sensor. Es meldet sich oft, bevor du den Grund kennst.',
    tipp: 'Komisches Gefühl? Seite verlassen und einem Erwachsenen davon erzählen.' },
]);

export const MAX = FRAGEN.length;

/** Zaehlt, wie viele Antworten der sicheren Antwort entsprechen. */
export function sicherePunkte(antworten = {}) {
  return FRAGEN.filter((f) => antworten[f.code] === f.gut).length;
}

/** Fragen, deren Antwort NICHT sicher war (fuer die Tipps am Ende). */
export function warnungen(antworten = {}) {
  return FRAGEN.filter((f) => antworten[f.code] && antworten[f.code] !== f.gut);
}

/** Ampel-Einschaetzung aus den sicheren Punkten. */
export function ampel(punkte, max = MAX) {
  const anteil = punkte / max;
  if (anteil >= 0.85) return { stufe: 'gruen', emoji: '🟢', text: 'Diese Seite wirkt sicher für dich. Trotzdem gilt: Bauchgefühl behalten.' };
  if (anteil >= 0.6) return { stufe: 'gelb', emoji: '🟡', text: 'Ein paar Dinge sind unklar. Sei vorsichtig und schau dir die Warnungen an.' };
  return { stufe: 'rot', emoji: '🔴', text: 'Hier gibt es mehrere Warnzeichen. Besser mit Erwachsenen anschauen oder die Seite verlassen.' };
}
