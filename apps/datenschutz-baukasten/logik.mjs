// Datenschutzerklärung-Baukasten: reine Logik (ohne DOM), testbar.
// Baustein-Auswahl (docs/09 Nr. 58) erzeugt ZWEI abgestimmte Texte: eine
// juristische Datenschutzerklärung und eine Kinder-Version in einfacher
// Sprache. Formular-zu-Dokument-Engine (wie Impressum-Generator). Alles lokal.

// Waehlbare Bausteine. Jeder liefert einen juristischen und einen Kinder-Absatz.
export const BAUSTEINE = Object.freeze([
  {
    code: 'localstorage', name: 'Speicherung auf dem Gerät (localStorage)',
    juristisch: 'Diese Website speichert bestimmte Einstellungen und Spielstände ausschließlich lokal im Browser Ihres Geräts (localStorage). Diese Daten verlassen das Gerät nicht und werden nicht an uns übertragen.',
    kinder: 'Manche Sachen (zum Beispiel dein Punktestand) bleiben nur auf deinem Gerät. Wir bekommen das nicht zu sehen. Du kannst es jederzeit löschen.',
  },
  {
    code: 'kontaktformular', name: 'Kontaktformular',
    juristisch: 'Wenn Sie unser Kontaktformular nutzen, verarbeiten wir die von Ihnen eingegebenen Daten (z. B. Name, E-Mail, Nachricht) ausschließlich zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.',
    kinder: 'Wenn du uns schreibst, lesen wir deine Nachricht. Nur um dir zu antworten. Frag vorher deine Eltern.',
  },
  {
    code: 'newsletter', name: 'Newsletter',
    juristisch: 'Für den Newsletter verarbeiten wir Ihre E-Mail-Adresse auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie können den Newsletter jederzeit über den Abmeldelink kündigen.',
    kinder: 'Für den Newsletter brauchen wir eine E-Mail-Adresse. Das machen Erwachsene für dich. Man kann sich jederzeit wieder abmelden.',
  },
  {
    code: 'medien', name: 'Eingebettete Medien (Videos/Karten)',
    juristisch: 'Sofern Inhalte Dritter (z. B. Videos) eingebettet sind, können beim Abruf Daten an die jeweiligen Anbieter übertragen werden. Wir binden solche Inhalte nur datensparsam bzw. nach Ihrer Zustimmung ein.',
    kinder: 'Manche Videos kommen von anderen Firmen. Wenn du sie startest, erfahren die Firmen etwas über dich. Deshalb fragen wir vorher.',
  },
  {
    code: 'analyse', name: 'Reichweiten-Analyse (anonym)',
    juristisch: 'Zur Verbesserung des Angebots setzen wir – sofern aktiviert – eine datensparsame, anonymisierte Reichweitenmessung ein, die keine Wiedererkennung einzelner Personen ermöglicht.',
    kinder: 'Wir zählen, wie viele Kinder unsere Seite besuchen. Aber wir erkennen dich dabei nicht. Wir wissen nur: viele oder wenige.',
  },
]);

const JUR_KOPF = 'Datenschutzerklärung\n\nDer Schutz deiner bzw. Ihrer Daten ist uns wichtig. Wir erheben so wenige personenbezogene Daten wie möglich (Grundsatz der Datenminimierung, Art. 5 DSGVO). Ohne die unten genannten Funktionen ist keine Anmeldung und keine Angabe personenbezogener Daten nötig.';
const JUR_FUSS = 'Deine Rechte: Du hast das Recht auf Auskunft, Berichtigung und Löschung deiner Daten (Art. 15, 16, 17 DSGVO) sowie ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde (Art. 77 DSGVO). Verantwortlich ist der im Impressum genannte Anbieter.';

const KIND_KOPF = 'Was wir über dich wissen – und was nicht\n\nDeine Daten gehören dir. Wir sammeln so wenig wie möglich. Ohne die Sachen hier unten musst du gar nichts von dir verraten.';
const KIND_FUSS = 'Deine Rechte: Du darfst immer fragen, was gespeichert ist – und du darfst es löschen lassen. Wenn dir etwas komisch vorkommt, sag es einem Erwachsenen. Bei Sorgen hilft die Nummer gegen Kummer 116 111.';

/** Baut beide Texte aus der Baustein-Auswahl (Menge/Array von Codes). */
export function baueDatenschutz(auswahl = []) {
  const gewaehlt = BAUSTEINE.filter((b) => auswahl.includes(b.code));
  const jur = [JUR_KOPF, '', ...gewaehlt.flatMap((b) => [`${b.name}:`, b.juristisch, '']), JUR_FUSS];
  const kind = [KIND_KOPF, '', ...gewaehlt.flatMap((b) => [`${b.name}:`, b.kinder, '']), KIND_FUSS];
  return {
    juristisch: jur.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n',
    kinder: kind.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n',
  };
}
