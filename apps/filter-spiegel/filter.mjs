// Filter-Spiegel: reine Logik (ohne DOM), testbar.
// Jeder "Beauty-Filter" traegt einen Realitaets-Abstand und zwei Texte:
// was er vorgibt zu tun - und was er wirklich tut.

export const FILTER = Object.freeze([
  { code: 'haut', name: 'Porzellan-Haut', emoji: '🧴', abstand: 20, verspricht: 'Glättet „Unreinheiten“ weg.', wahrheit: 'Echte Haut hat Poren, Sommersprossen und Schatten. Der Filter löscht, was JEDES Gesicht hat - und macht Normales zur „Unreinheit“.' },
  { code: 'augen', name: 'Riesen-Augen', emoji: '👁️', abstand: 20, verspricht: 'Macht die Augen „strahlender“.', wahrheit: 'Vergrößerte Augen imitieren Kindchenschema - ein Reiz-Trick. Kein erwachsenes Gesicht hat diese Proportionen.' },
  { code: 'schmal', name: 'Schmal-Former', emoji: '📐', abstand: 25, verspricht: 'Formt das Gesicht „feiner“.', wahrheit: 'Der Filter presst dein Gesicht in EIN Schönheitsideal von vielen. Gesichtsformen sind Vielfalt, kein Fehler.' },
  { code: 'glow', name: 'Golden-Glow', emoji: '🌅', abstand: 15, verspricht: 'Zaubert „perfektes Licht“.', wahrheit: 'Studio-Licht statt Realität: Im echten Leben leuchtet niemand von innen. Glow versteckt, dass alle anderen auch nur Tageslicht haben.' },
  { code: 'zaehne', name: 'Blitz-Lächeln', emoji: '😁', abstand: 20, verspricht: 'Weißt die Zähne strahlend.', wahrheit: 'Gesunde Zähne sind natur-elfenbein, nicht papierweiß. Das Blitz-Weiß existiert nur in Werbung und Filtern.' },
]);

/** Summierter Realitaets-Abstand der aktiven Filter (0..100). */
export function abstandGesamt(aktiveCodes) {
  const summe = FILTER.filter((f) => aktiveCodes.includes(f.code)).reduce((s, f) => s + f.abstand, 0);
  return Math.min(100, summe);
}

/** Einordnung des Abstands fuer die Anzeige. */
export function einordnung(abstand) {
  if (abstand === 0) return { stufe: 'echt', satz: '✅ Das bist du - ein echtes Gesicht mit echten Details.' };
  if (abstand < 40) return { stufe: 'bearbeitet', satz: '🟡 Bearbeitet: Schon jetzt zeigt der Spiegel etwas, das der Badezimmerspiegel nie zeigen wird.' };
  if (abstand < 80) return { stufe: 'konstruiert', satz: '🟠 Konstruiert: Dieses Gesicht ist eine Bau-Leistung der Software, keine Person.' };
  return { stufe: 'fiktiv', satz: '🔴 Fiktiv: Dieses Gesicht EXISTIERT NICHT. Und genau mit solchen Gesichtern vergleichst du dich im Feed.' };
}

export const LEKTIONEN = Object.freeze([
  '🪞 Der Feed ist ein Zerrspiegel: Viele Gesichter dort sind gefiltert - du vergleichst dein echtes Gesicht mit konstruierten. Dieser Vergleich ist unfair und macht nachweislich unzufrieden.',
  '🏷️ Manche Länder handeln schon: In Frankreich und Norwegen müssen Influencer*innen bearbeitete Körper-Fotos kennzeichnen. Bis das überall gilt, hilft dein Wissen: Rechne bei Perfektion mit Filter.',
  '💰 Filter sind nicht neutral: Sie definieren „schön“ so, wie es Kosmetik- und App-Industrie nützt - und machen dein normales Gesicht zum „Vorher-Bild“.',
  '💛 Dein Gegen-Trick: Entfolge Accounts, nach denen du dich schlechter fühlst. Und wenn der Spiegel-Frust bleibt: Sprich darüber - Nummer gegen Kummer 116 111.',
]);
