// quiz-kern Geschwister-Staffel: reine Wertungs-Logik (ohne DOM), testbar.
// Zwei Geschwister lösen abwechselnd Fragen am selben Gerät als EIN Team; nach der Antwort des jüngeren Kindes darf das ältere erklären.
// Kooperativ (kein Gegeneinander), nichts wird gespeichert, es gibt keinen Zähler.

/** Wer ist bei Frage i dran? Gerade Index -> jüngeres, ungerade -> älteres. */
export function amZug(index) {
  return index % 2 === 0 ? 'jung' : 'alt';
}
