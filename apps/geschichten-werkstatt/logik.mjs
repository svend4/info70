// Geschichten-Werkstatt: reine Logik (ohne DOM), testbar (docs/09 Nr. 242).
// „So denkt die Maschine“: Jede erzeugte Geschichte trägt sichtbar den Stempel
// „Von der Maschine gebaut – mach sie zu deiner!“, plus eine Mini-Erklärung,
// die die Baustein-Generierung kindgerecht offenlegt (KI-Kompetenz, AI Act).

export const HELDEN = Object.freeze(['eine mutige Erfinderin', 'ein schüchterner Drache', 'zwei beste Freunde', 'eine neugierige Katze', 'ein kleiner Roboter']);
export const ORTE = Object.freeze(['auf einer Insel aus Süßigkeiten', 'in einer Stadt unter dem Meer', 'auf dem Dachboden der Schule', 'in einem Wald, der nachts leuchtet', 'auf einem fliegenden Markt']);
export const PROBLEME = Object.freeze(['hat den Schlüssel zur Heimat verloren', 'findet eine geheimnisvolle Landkarte', 'muss ein Gewitter aus Limonade stoppen', 'will den traurigen Mond zum Lachen bringen', 'entdeckt, dass die Farben verschwinden']);

const ANFAENGE = ['Es war einmal', 'An einem ganz gewöhnlichen Dienstag', 'Niemand hätte gedacht, dass'];
const WENDUNGEN = [
  'Zuerst schien alles unmöglich. Doch dann kam eine Idee, so hell wie ein Blitz.',
  'Ein sprechender Koffer bot seine Hilfe an – gegen drei gute Witze.',
  'Da flüsterte der Wind einen Hinweis, den nur genaue Zuhörer verstehen konnten.',
];
const ENDEN = [
  'Und wenn du heute genau hinschaust, findest du vielleicht eine Spur davon.',
  'Seitdem feiern alle diesen Tag mit einem großen Pfannkuchenfest.',
  'Und die Moral? Wer fragt und zuhört, findet immer einen Weg.',
];

/** Sichtbarer Stempel auf jeder erzeugten Geschichte. */
export const STEMPEL = '🤖 Von der Maschine gebaut – mach sie zu deiner!';

/** Kindgerechte Erklärung, wie die „Maschine“ die Geschichte baut. */
export const ERKLAER = 'Diese Geschichte hat kein Mensch geschrieben: Die Werkstatt setzt sie aus fertigen Bausteinen zusammen – deinem Helden, deinem Ort, deinem Ereignis und ein paar Zufalls-Wendungen. So ähnlich (nur viel größer) arbeitet auch eine KI: Sie würfelt aus vielen Beispielen etwas Neues. Merke: Maschinen-Text ist ein Entwurf und dein Mit-Autor – nicht die Wahrheit. Prüfe, ändere und mach die Geschichte zu deiner!';

const zufall = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Erzeugt die Geschichte (reine Funktion Auswahl -> Text). Die einzige Stelle,
 * die später durch einen sicheren KI-Aufruf ersetzt werden könnte.
 * @param {{held:string, ort:string, problem:string}} wahl
 * @param {(arr:string[])=>string} waehle  Auswahlfunktion (für Tests injizierbar)
 */
export function erzeugeGeschichte({ held, ort, problem }, waehle = zufall) {
  const anfang = waehle(ANFAENGE);
  const wendung = waehle(WENDUNGEN);
  const ende = waehle(ENDEN);
  return `${anfang}: ${held}, ${ort}. Eines Tages passierte es: ${held} ${problem}. ${wendung} Gemeinsam mit neuen Freunden wurde gesucht, probiert und gelacht – bis die Lösung gefunden war. ${ende}`;
}
