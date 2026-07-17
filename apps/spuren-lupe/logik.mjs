// Spuren-Lupe: reine Logik (ohne DOM), testbar.
// Idee (docs/09 Nr. 11): Eine Webseite kann viel ueber dich "sehen", ganz
// ohne dass du etwas eintippst - Geraet, Bildschirm, Sprache, Zeitzone, wie
// lange du bleibst, wie oft du klickst. Diese App zeigt das REIN LOKAL: Der
// Netzwerk-Waechter beweist, dass nichts gesendet wird. Diese Datei deutet die
// gesammelten Signale kindgerecht - die App liest die echten Werte aus.

/** Menschliche Dauer-Angabe aus Sekunden. */
export function dauerText(sekunden) {
  const s = Math.max(0, Math.floor(sekunden));
  const min = Math.floor(s / 60);
  const rest = s % 60;
  if (min === 0) return `${rest} Sekunde${rest === 1 ? '' : 'n'}`;
  return `${min} Minute${min === 1 ? '' : 'n'} ${rest} Sekunde${rest === 1 ? '' : 'n'}`;
}

/** Grobe Geraete-Einschaetzung aus dem Zeigegeraet (Touch vs. Maus). */
export function geraeteEinschaetzung(grobZeiger) {
  return grobZeiger
    ? 'eher ein Handy oder Tablet (du tippst mit dem Finger)'
    : 'eher ein Computer (du hast eine Maus oder ein Trackpad)';
}

// Die Signal-Katalog-Definition: was eine Seite ohne Eingabe erkennen kann.
// `beispiel` ist ein Platzhalter fuer die Doku/Tests; die App setzt echte Werte.
export const SIGNALE = Object.freeze([
  { code: 'geraet', name: 'Dein Gerät', emoji: '📱', bedeutung: 'Ob du am Handy, Tablet oder Computer bist – das verrät schon, wie du im Netz unterwegs bist.' },
  { code: 'bildschirm', name: 'Bildschirm-Größe', emoji: '📐', bedeutung: 'Die genaue Größe deines Bildschirms hilft, Geräte auseinanderzuhalten – wie ein kleiner Fingerabdruck.' },
  { code: 'sprache', name: 'Deine Sprache', emoji: '🗣️', bedeutung: 'Aus der eingestellten Sprache lässt sich oft raten, woher du kommst oder welche Sprache du sprichst.' },
  { code: 'zeitzone', name: 'Deine Zeitzone', emoji: '🕐', bedeutung: 'Die Zeitzone verrät grob, in welchem Teil der Welt du gerade bist – ganz ohne Standort-Freigabe.' },
  { code: 'farbschema', name: 'Hell oder Dunkel', emoji: '🌗', bedeutung: 'Sogar ob du den hellen oder dunklen Modus magst, kann eine Seite sehen.' },
  { code: 'dauer', name: 'Wie lange du bleibst', emoji: '⏱️', bedeutung: 'Wie lange du auf einer Seite bleibst, ist selbst eine Information – auch wenn du gar nichts anklickst.' },
  { code: 'klicks', name: 'Wie oft du klickst', emoji: '👆', bedeutung: 'Jeder Klick und jedes Scrollen ist eine Spur. Aus vielen Spuren entsteht ein Muster über dich.' },
]);

export const LEKTIONEN = Object.freeze([
  '👀 Daten entstehen auch ohne Eingabe: Du hast nichts eingetippt – und trotzdem „weiß“ diese Seite schon dein Gerät, deine Sprache, deine Zeitzone und wie lange du bleibst. Das nennt man passives Tracking.',
  '🧩 Aus kleinen Spuren wird ein Fingerabdruck: Einzeln ist jedes Signal harmlos. Zusammen ergeben Bildschirm, Sprache, Zeitzone und Verhalten oft ein Muster, mit dem man dich wiedererkennt – auch ohne Namen.',
  '🛡️ Diese App sendet NICHTS: Der Netzwerk-Wächter blockiert jede Verbindung nach außen – alles bleibt auf deinem Gerät. Aber genau diese Dinge könnten andere Seiten sehen, meist ohne zu fragen.',
  '🧭 Was hilft: Cookie-Fenster ehrlich beantworten (oft „Nur nötige“), Tracking-Schutz im Browser einschalten, keine unnötigen Erlaubnisse geben – und im Zweifel Erwachsene fragen. Deine Daten gehören dir.',
]);
