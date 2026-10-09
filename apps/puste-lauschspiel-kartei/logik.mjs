// Puste- und Lauschspiel-Kartei (Praleska docs/10, Eltern-Werkzeuge Nr. 53,
// Quelle S. 67-68).
//
// TRAGENDE ENTSCHEIDUNG, und sie dreht das Versprechen der Quelle um.
//
// Die Quelle will mit Artikulationsübungen („die Marmelade von den Lippen
// lecken"), Pusteübungen und Hörspielen die „Grundlagen der Artikulation,
// der Sprechatmung und des phonematischen Hörens" bilden. Für das Deutsche
// gibt es dazu eine Empfehlung in der stärksten Negativform, die das
// Fachsystem kennt: nichtsprachliche mund- und zungenmotorische Übungen
// sind bei Aussprachestörungen nicht wirksam und SOLLEN NICHT ANGEWENDET
// WERDEN - Evidenzlevel 1, Empfehlungsgrad A, Abstimmung ohne eine einzige
// Gegenstimme. Die zugrunde liegende Fachprüfung definiert diese
// Behandlung genau als das, was die Quelle anbietet, und nennt Pusten in
// Hörner und Tuten, Seifenblasen und Lippenmassage beim Namen.
//
// Daraus folgt NICHT, dass man mit seinem Kind keine Seifenblasen pusten
// darf. Es folgt, dass die Kartei das Versprechen nicht tragen kann. Also:
//
//   - drei strukturell getrennte Register. `lautspiel` (mit Sprechlauten:
//     Tierstimmen, Lautmalerei, Rufen) ist Spiel mit SPRACHE und von der
//     Negativempfehlung gar nicht betroffen - sie betrifft ausdrücklich
//     das NICHTsprachliche. `lauschspiel` ist Aufmerksamkeit und Hören.
//     `pustespiel` bleibt, aber als Spiel.
//   - eine Pustekarte ist ohne den Satz, dass sie nichts trainiert,
//     STRUKTURELL nicht ausdrückbar (`keinTraining` ist dort Pflicht) -
//     dieselbe Bauart wie die Bauchlage in Nr. 49.
//   - kein Wirkversprechen in irgendeinem Kartentext.
//   - die Lautfolge steht als BERUHIGUNG da, nie als Ziel: „was in diesem
//     Alter noch gar nicht dran ist". Für die Vokale steht keine
//     Reihenfolge, weil für das Deutsche keine belegt ist.
//   - kein Quiz: „rate mal" ist ein Spiel, und Danebenraten ist der
//     Normalfall, nicht der Fehler.

/** Die drei Register - geschlossene Liste, und die Trennung ist tragend. */
export const REGISTER = Object.freeze(['pustespiel', 'lautspiel', 'lauschspiel']);

/** Register, deren Karten ohne Trainings-Dementi nicht ausdrückbar sind. */
export const REGISTER_MIT_DEMENTI = Object.freeze(['pustespiel']);

/** Register, deren Karten sagen müssen, warum Sprache darin vorkommt. */
export const REGISTER_MIT_SPRACHGRUND = Object.freeze(['lautspiel']);

/** Register, deren Karten das Raten entschärfen müssen. */
export const REGISTER_MIT_RATEN = Object.freeze(['lauschspiel']);

/**
 * Wirkversprechen zur Sprache. Nirgends in einem Kartentext - auch nicht
 * abgeschwächt. Gezielt auf die KONSTRUKTION (Wirkung + Gegenstand), damit
 * die Felder, die das Versprechen ZURÜCKWEISEN, es nennen dürfen.
 */
export const WIRKVERSPRECHEN = /(übt|trainiert|fördert|verbessert|stärkt|kräftigt|schult|bahnt)\s[^.!?]{0,30}(Aussprache|Artikulation|Sprechatmung|Mundmotorik|Zunge|Lippen|Sprache|Sprechen|Laute)|(Grundlage|Vorstufe|Voraussetzung)\s[^.!?]{0,20}(der |für die )?(Artikulation|Aussprache|Sprachförderung)|macht .{0,20}(deutlicher|verständlicher) sprechen/i;

/** Prüf- und Punktevokabular. Kein Quiz, keine Runde, kein Ergebnis. */
export const PRUEFUNG = /(^|[^a-zäöüß])(Punkte?|Punktestand|richtig geraten|falsch geraten|Ergebnis|bestanden|geschafft|gewonnen hat|Runde \d|Aufgabe \d|Hörprüfung|Hörtest|prüf)/i;

/** Übungsvokabular am Mund des Kindes - das Register, das hier fehlt. */
export const UEBUNG_AM_MUND = /(Zungenübung|Lippenübung|Mundübung|Mundmotorik-?Übung|Pusteübung|Artikulationsübung|Zunge .{0,20}(kreisen|spitzen|heben)|Lippen .{0,15}spitzen)/i;

/** Felder, die eine Anweisung tragen - sie gehen durch die scharfen Netze. */
const ANWEISUNGS_FELDER = Object.freeze(['soGehts', 'material']);
/** Felder, die beschreiben oder einschränken. */
const BESCHREIBENDE_FELDER = Object.freeze(['titel', 'sicherheit', 'abbruchzeichen', 'warumSprache', 'keinTraining', 'keinRaten']);

const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;

export function spielVon(daten, id) {
  return (daten?.spiele ?? []).find((s) => s.id === id) ?? null;
}

/** Die Spiele eines Registers, in der Reihenfolge der Daten. */
export function spieleIm(daten, register) {
  if (!REGISTER.includes(register)) return [];
  return (daten?.spiele ?? []).filter((s) => s.register === register);
}

/** Alle Register mit ihren Spielen - leeres Register kommt nicht vor. */
export function registerMitSpielen(daten) {
  return REGISTER.map((r) => ({ register: r, spiele: spieleIm(daten, r) })).filter((x) => x.spiele.length);
}

/** Text eines Spiels für die Vorlesefunktion - nur Erwachsenentext. */
export function spielText(spiel) {
  if (!spiel) return '';
  return [
    spiel.titel,
    spiel.material ? `Dafür brauchst du: ${spiel.material}` : '',
    ...(spiel.soGehts ?? []),
    spiel.keinTraining,
    spiel.warumSprache,
    spiel.keinRaten,
    spiel.sicherheit ? `Sicherheit: ${spiel.sicherheit}` : '',
    spiel.abbruchzeichen ? `Aufhören: ${spiel.abbruchzeichen}` : '',
  ].filter(Boolean).join(' ');
}

function texteAus(objekt, felder) {
  const flach = [];
  for (const feld of felder) {
    const wert = objekt?.[feld];
    if (Array.isArray(wert)) flach.push(...wert.map(String));
    else if (wert) flach.push(String(wert));
  }
  return flach;
}

/**
 * Validiert die Kartei. Alles Tragende steht hier und nicht in der
 * Redaktion. Die Ausschlussliste und die Dementi-Felder sind von den
 * Textnetzen ausgenommen: sie MÜSSEN das Verbotene nennen, um es
 * auszuschließen.
 */
export function pruefeDaten(daten) {
  const fehler = [];
  const spiele = daten?.spiele ?? [];
  const aus = daten?.ausgeschlossen ?? [];
  const phys = daten?.physiologisch ?? [];

  if (!spiele.length) fehler.push('keine Spiele');
  if (!aus.length) fehler.push('keine Ausschlussliste – der nicht übernommene Zweck muss benannt sein');

  const ids = new Set();
  for (const s of spiele) {
    const wo = `Spiel ${s.id ?? '?'}`;
    if (!s.id) fehler.push(`${wo}: id fehlt`);
    if (ids.has(s.id)) fehler.push(`${wo}: id doppelt`);
    ids.add(s.id);
    if (!REGISTER.includes(s.register)) fehler.push(`${wo}: unbekanntes register „${s.register}“`);
    if (!nichtLeer(s.titel)) fehler.push(`${wo}: titel fehlt`);
    if (!Array.isArray(s.soGehts) || s.soGehts.length < 2) fehler.push(`${wo}: soGehts braucht mindestens zwei Schritte`);
    if (!nichtLeer(s.sicherheit)) fehler.push(`${wo}: sicherheit fehlt – auch „keines“ ist eine Angabe`);
    if (!nichtLeer(s.abbruchzeichen)) fehler.push(`${wo}: abbruchzeichen fehlt`);

    // Eine Pustekarte ist ohne das Dementi nicht ausdrückbar.
    if (REGISTER_MIT_DEMENTI.includes(s.register)) {
      if (!nichtLeer(s.keinTraining)) {
        fehler.push(`${wo}: ein Pustespiel braucht den Satz, dass es nichts trainiert`);
      } else if (!/kein[e]? (Übung|Training)|trainiert nicht|übt kein|ist ein Spiel|keine Aussprache|nicht trainiert|nichts daran trainiert/i.test(s.keinTraining)) {
        fehler.push(`${wo}: keinTraining sagt nicht deutlich, dass nichts trainiert wird`);
      }
    } else if (nichtLeer(s.keinTraining)) {
      fehler.push(`${wo}: keinTraining gehört nur zu einem Pustespiel`);
    }

    // Ein Lautspiel muss sagen, warum Sprache darin vorkommt - das ist der
    // Unterschied, auf dem seine Zulässigkeit beruht.
    if (REGISTER_MIT_SPRACHGRUND.includes(s.register) && !nichtLeer(s.warumSprache)) {
      fehler.push(`${wo}: ein Lautspiel muss sagen, warum hier Sprache drin ist`);
    }
    // Ein Lauschspiel muss das Raten entschärfen.
    if (REGISTER_MIT_RATEN.includes(s.register)) {
      if (!nichtLeer(s.keinRaten)) fehler.push(`${wo}: ein Lauschspiel muss das Raten entschärfen`);
      // Die Entschärfung darf verschieden klingen - eine Karte, bei der es
      // gar nichts zu erraten gibt, sagt das anders („nichts zu erkennen,
      // nichts zu schaffen"). Gefordert ist die SACHE, nicht der Wortlaut.
      else if (!/nichts falsch|kein(e)? Punkte|keine Prüfung|kein Ergebnis|wird nicht abgefragt|keine Hörprüfung|noch einmal|nichts zu erkennen|nichts zu schaffen|ist die Antwort/i.test(s.keinRaten)) {
        fehler.push(`${wo}: keinRaten entschärft nicht – Danebenraten muss ausdrücklich in Ordnung sein`);
      }
    }
  }

  // Jedes Register muss belegt sein: ein angebotenes Register ohne Spiel
  // wäre eine Überschrift ohne Inhalt.
  for (const r of REGISTER) {
    if (!spieleIm(daten, r).length) fehler.push(`Register ${r}: kein Spiel`);
  }

  // --- Textnetze, nur auf den Spielen (nicht auf Rahmen und Ausschluss)
  for (const s of spiele) {
    const wo = `${s.id ?? '?'}`;
    // Eine Übung am Mund wird ANGEWIESEN, nicht beschrieben: `warumSprache`
    // und `keinTraining` müssen „Zungenübung" nennen dürfen, denn ihre
    // Aufgabe ist es, sich davon abzugrenzen. Ein Netz auf das Wort traf
    // die eigene Ausnahmeklausel - in diesem Projekt der neunte Fall.
    for (const text of texteAus(s, ANWEISUNGS_FELDER)) {
      if (UEBUNG_AM_MUND.test(text)) {
        fehler.push(`${wo}: Übung am Mund des Kindes in einer Anweisung – genau das ist nicht übernommen: „${text.slice(0, 60)}“`);
      }
    }
    for (const text of texteAus(s, [...ANWEISUNGS_FELDER, ...BESCHREIBENDE_FELDER])) {
      // NUR das Dementi ist ausgenommen: seine Aufgabe ist die Verneinung.
      // `warumSprache` erklaert, warum Sprache drin ist - es darf kein
      // Wirkversprechen abgeben, sonst waere die Ausnahme ein Loch, durch
      // das das zurueckgenommene Versprechen zurueckkommt. (Der eigene Test
      // hat genau das gefunden.)
      if (WIRKVERSPRECHEN.test(text) && s.keinTraining !== text) {
        fehler.push(`${wo}: Wirkversprechen zur Sprache – das trägt diese Kartei nicht: „${text.slice(0, 60)}“`);
      }
      if (PRUEFUNG.test(text) && s.keinRaten !== text) {
        fehler.push(`${wo}: Prüf- oder Punktevokabular: „${text.slice(0, 60)}“`);
      }

    }
  }

  // --- Die physiologischen Prozesse: jede Zeile muss NORMALITÄT sagen
  if (phys.length < 4) fehler.push('physiologisch: zu wenige Zeilen – die Beruhigung trägt die Kartei');
  for (const p of phys) {
    const wo = `physiologisch ${p.id ?? '?'}`;
    if (!nichtLeer(p.was)) fehler.push(`${wo}: was fehlt`);
    if (!nichtLeer(p.beispiel)) fehler.push(`${wo}: beispiel fehlt`);
    if (!nichtLeer(p.normalBis)) fehler.push(`${wo}: normalBis fehlt`);
    if (!/normal/i.test(String(p.satz ?? ''))) fehler.push(`${wo}: der Satz muss die Normalität aussprechen`);
    // Keine Übungsaufforderung in der Beruhigung.
    if (/üben|trainieren|korrigieren|verbessern/i.test(`${p.was} ${p.satz}`)) {
      fehler.push(`${wo}: eine Übungsaufforderung in der Beruhigung`);
    }
  }

  // --- Die Lautfolge: Beruhigung, nie Ziel; und keine Vokalreihenfolge
  const le = daten?.lauterwerb ?? {};
  if (!/nicht als Plan|Orientierung, nicht/i.test(String(le.hinweis ?? ''))) {
    fehler.push('lauterwerb.hinweis: die Reihenfolge muss ausdrücklich kein Plan sein');
  }
  if (!/keine belegte Reihenfolge|erfindet sie/i.test(String(le.hinweis ?? ''))) {
    fehler.push('lauterwerb.hinweis: dass für die Vokale keine Reihenfolge belegt ist, muss dastehen');
  }
  if (!/keine Aufgabe|kein Spiel, das einen bestimmten Laut/i.test(String(le.keinZiel ?? ''))) {
    fehler.push('lauterwerb.keinZiel: ein fehlender Laut darf keine Aufgabe werden');
  }
  // Eine Vokalreihenfolge wäre erfunden.
  for (const [feld, wert] of Object.entries(le)) {
    if (typeof wert !== 'string') continue;
    if (/\b[aeiouäöü]\s*,\s*[aeiouäöü]\s*,\s*[aeiouäöü]/i.test(wert) && feld !== 'hinweis') {
      fehler.push(`lauterwerb.${feld}: sieht nach einer Vokalreihenfolge aus – dafür ist keine belegt`);
    }
  }

  // --- Ausschlussliste: jede Zeile mit Begründung, und die Quellbilanz
  for (const a of aus) {
    if (!nichtLeer(a.quellNr)) fehler.push('ausgeschlossen: quellNr fehlt');
    if (!nichtLeer(a.was)) fehler.push(`ausgeschlossen ${a.quellNr}: was fehlt`);
    if (!nichtLeer(a.warum)) fehler.push(`ausgeschlossen ${a.quellNr}: warum fehlt – ein Ausschluss ohne Grund ist Redaktion`);
  }
  if (!aus.some((a) => /nicht wirksam|sollen nicht angewendet/i.test(a.warum ?? ''))) {
    fehler.push('ausgeschlossen: die fachliche Negativempfehlung muss beim Namen genannt sein');
  }
  if (!aus.some((a) => /Luftballon/i.test(a.was ?? ''))) {
    fehler.push('ausgeschlossen: der Luftballon muss ausdrücklich ausgeschlossen sein');
  }
  if (!aus.some((a) => /Ballongas/i.test(a.was ?? ''))) {
    fehler.push('ausgeschlossen: Ballongas muss ausdrücklich ausgeschlossen sein');
  }
  // Kein erfundenes Verbot: dass Kinder keine Ballons aufpusten DÜRFEN,
  // steht so nirgends - die Vorsicht ist die der Kartei.
  const ballon = aus.find((a) => /Luftballon/i.test(a.was ?? ''));
  if (ballon && !/Verbot .{0,30}gibt es ausdrücklich NICHT|keine Rechtsfolge/i.test(ballon.warum ?? '')) {
    fehler.push('ausgeschlossen: beim Luftballon muss dastehen, dass es kein Verbot gibt – sonst wird eine Rechtsfolge erfunden');
  }

  const z = daten?.quelle?.zahlen ?? {};
  if (z.zieleQuelle !== 3) fehler.push('quelle.zahlen: der Abschnitt trägt 3 Ziele');
  if (z.spieleQuelle !== 6) fehler.push('quelle.zahlen: die Quelle nennt 6 Spiele beim Namen');
  if (z.spieleUebernommen + z.spieleNichtUebernommen !== 6) {
    fehler.push('quelle.zahlen: übernommen plus nicht übernommen muss 6 ergeben');
  }
  if (!/Eigenproduktion/.test(daten?.quelle?.rechte ?? '')) fehler.push('quelle.rechte muss „Eigenproduktion“ aussprechen');
  if (!daten?.quelle?.geprueft) fehler.push('quelle.geprueft fehlt – eine Seitenangabe steht nur mit Prüfvermerk');

  // --- Pflichtsätze
  const pflicht = [
    ['hinweis', /in Ihrer Hand/, 'das Gerät gehört dem Erwachsenen'],
    ['hinweis', /sieht keinen Bildschirm/, 'der Kind-Screen muss ausgeschlossen sein'],
    ['keinTrainingsversprechen', /verspricht keine bessere Aussprache/, 'das fehlende Versprechen muss zuerst dastehen'],
    ['keinTrainingsversprechen', /sollen nicht angewendet werden/, 'die Negativempfehlung muss wörtlich dastehen'],
    ['wasBleibt', /etwas anderes als Zungenübungen/, 'der Unterschied zwischen Sprachspiel und Mundübung muss dastehen'],
    ['keinQuiz', /keine Punkte/, 'das fehlende Punktesystem muss dastehen'],
    ['keineUebersetzung', /nur auf Deutsch/, 'die fehlende Übersetzung muss ausgesprochen sein'],
    ['keineUebersetzung', /bewusste Entscheidung/, 'und als Entscheidung, nicht als Lücke'],
    ['abbruch', /Aufhören ist die Regel/, 'das Aufhören muss ausdrücklich erlaubt sein'],
    ['wennSorge', /Kinderarztpraxis/, 'der Weg bei Sorge muss benannt sein'],
    ['wennSorge', /0800 111 0 550/, 'das Elterntelefon gehört in ein Eltern-Werkzeug'],
    ['mehrsprachig', /gilt die deutsche Lautreihenfolge weiter unten nicht einfach so/, 'die Lautfolge darf nicht auf ein mehrsprachiges Kind angewandt werden'],
    ['lautstaerke', /nie neben dem Kopf/, 'die Lautstärke am Ohr muss benannt sein'],
  ];
  for (const [feld, muster, warum] of pflicht) {
    if (!muster.test(String(daten?.[feld] ?? ''))) fehler.push(`${feld}: ${warum}`);
  }
  if (!/nichtsprachliche/i.test(String(daten?.pusteRegister?.text ?? ''))) {
    fehler.push('pusteRegister.text: die Fachdefinition muss benannt sein');
  }

  // --- Keine Übersetzung behaupten: Kyrillisch nur in der Quellenangabe
  // Die Ausschlussliste MUSS die Quelle zitieren dürfen - sie schließt
  // deren Lautliste samt „ы" ausdrücklich aus.
  const erlaubt = new Set([daten?.quelle?.werk, daten?.quelle?.rechte,
    daten?.quelle?.nachgezaehlt, daten?.quelle?.abweichung,
    ...(daten?.ausgeschlossen ?? []).map((a) => a.warum),
    ...(daten?.ausgeschlossen ?? []).map((a) => a.was),
  ].filter(Boolean));
  const suchen = (wert, pfad) => {
    if (typeof wert === 'string') {
      if (/[Ѐ-ӿ]/.test(wert) && !erlaubt.has(wert)) {
        fehler.push(`${pfad}: kyrillische Schrift außerhalb der Quellenangabe – diese Kartei gibt keine Übersetzungen`);
      }
      return;
    }
    if (Array.isArray(wert)) { wert.forEach((x, i) => suchen(x, `${pfad}[${i}]`)); return; }
    if (wert && typeof wert === 'object') for (const [k, v] of Object.entries(wert)) suchen(v, `${pfad}.${k}`);
  };
  suchen(daten, 'daten');

  return fehler;
}
