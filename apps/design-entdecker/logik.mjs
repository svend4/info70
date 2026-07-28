// Design-Entdecker: praktisch und schön – reine Logik (ohne DOM).
// Ko-Nutzungs-App für 3-7. Praleska docs/10 (Ko-Nutzung Nr. 16).
//
// Die tragende Unterscheidung sind drei Geltungsarten. Sie ist keine
// Redaktionsdisziplin, sondern Schemabedingung:
//
//   pruefbar   – man kann es ausprobieren. Hat eine Antwort.
//   ausgemacht – Menschen haben es so vereinbart. Hat eine Antwort,
//                aber nur hier, und der Grund liegt in der Vereinbarung.
//   geschmack  – hat KEINE Antwort. Darf nie bewertet, nie gezählt,
//                nie als Rätsel gerendert werden.
//
// Ohne die mittlere Art fielen Konventionen (Feuerwehr rot, Briefkasten
// gelb) fälschlich in eine der beiden anderen Schubladen: entweder als
// Naturgesetz oder als bloße Meinung. Beides wäre verkehrt.
import { mischen } from '../../packages/kinder-ui/js/komponenten.mjs';

/** Höchstens so viele Fragen pro Sitzung. */
export const PRO_SESSION = 6;

/** Die drei Geltungsarten. */
export const GELTUNGEN = ['pruefbar', 'ausgemacht', 'geschmack'];

/**
 * Woran man ein Gebäude erkennt. Nur `bauform` darf abgefragt werden:
 * Ausstattung (Spielgeräte vor der Kita) und Ortskenntnis (das ist der
 * Bahnhof, weil ich hier immer einsteige) sind kein Formwissen.
 */
export const MERKMALSARTEN = ['bauform', 'ausstattung', 'ortskenntnis'];

/** Probehandlungen dürfen nichts Heißes verlangen. */
export const GEFAHR = /heiß|Herd|Backofen|kochend|Kerze|Messer|scharf/i;

/** Höchste Wassertemperatur für einen Versuch mit Kindern. */
export const MAX_GRAD = 40;

/** Bis zu `limit` Fragen je Sitzung, gemischt und ohne Dubletten. */
export function waehleFragen(bank, limit = PRO_SESSION) {
  return mischen(bank).slice(0, limit);
}

/** Hat diese Frage überhaupt eine richtige Antwort? */
export function hatLoesung(frage) {
  return frage.geltung !== 'geschmack';
}

export function istRichtig(frage, antwort) {
  if (!hatLoesung(frage)) return null; // Geschmack kennt kein richtig
  return Boolean(antwort?.richtig);
}

/** Wie viele Fragen jeder Geltungsart gibt es? */
export function nachGeltung(fragen) {
  return Object.fromEntries(GELTUNGEN.map((g) => [g, fragen.filter((f) => f.geltung === g).length]));
}

/** Die Gebäude, die man wirklich am Haus erkennt. */
export function amHausErkennbar(gebaeude) {
  return gebaeude.filter((g) => g.merkmalsart === 'bauform');
}

/** Und die, bei denen die App ausdrücklich sagt: das sieht man nicht. */
export function nichtAmHaus(gebaeude) {
  return gebaeude.filter((g) => g.merkmalsart !== 'bauform');
}

/** Validiert die Daten. */
export function pruefeDaten(daten) {
  const fehler = [];
  const { fragen, gebaeude, schlussIdeen, geltungTexte } = daten ?? {};

  // Die Sortenanzeige steht vor JEDER Frage und trägt die tragende
  // Unterscheidung. Fehlte ein Eintrag, bliebe der Kasten einfach leer –
  // die App liefe weiter und verschwiege die Sorte.
  for (const g of GELTUNGEN) {
    if (!geltungTexte?.[g]) fehler.push(`geltungTexte: der Text für „${g}“ fehlt`);
  }

  if (!Array.isArray(fragen) || fragen.length < 10) fehler.push('fragen: mindestens 10 erwartet');
  const ids = new Set();
  for (const f of fragen ?? []) {
    const wo = `Frage ${f.id || '?'}`;
    if (!f.id || ids.has(f.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
    ids.add(f.id);
    if (!GELTUNGEN.includes(f.geltung)) { fehler.push(`${wo}: geltung „${f.geltung}“ gibt es nicht`); continue; }
    if (!f.frage || !f.emoji || !f.gespraech) fehler.push(`${wo}: frage/emoji/gespraech fehlt`);
    else if (!f.gespraech.trim().endsWith('?')) fehler.push(`${wo}: Gesprächsimpuls soll eine Frage sein`);
    // Kinder lesen nicht – jeder Text ist ein Vorlesetext. Jahreszahlen
    // und Epochenbegriffe sind dort sinnlos und erzeugen erfundene Genauigkeit.
    for (const text of [f.frage, f.antwortText, ...(f.gruende ?? [])].filter(Boolean)) {
      if (/\b1[0-9]{3}\b|\b20[0-9]{2}\b|Jahrhundert/.test(text)) {
        fehler.push(`${wo}: Jahreszahl oder Epoche im Kindertext`);
      }
    }

    if (f.geltung === 'geschmack') pruefeGeschmack(f, wo, fehler);
    else pruefeMitLoesung(f, wo, fehler);

    if (f.geltung === 'pruefbar') pruefeProbe(f, wo, fehler);
    if (f.geltung === 'ausgemacht') {
      if (!f.geltungsbereich) fehler.push(`${wo}: eine Vereinbarung braucht ihren Geltungsbereich`);
      // Der Kindertext muss den Bereich selbst nennen – sonst lernt das
      // Kind eine örtliche Vereinbarung als Weltwissen.
      const text = `${f.antwortText ?? ''}`;
      if (!/bei uns/.test(text)) fehler.push(`${wo}: der Kindertext sagt nicht, wo das gilt („bei uns“)`);
      if (!/ausgemacht|vereinbart|festgelegt/.test(text)) fehler.push(`${wo}: der Kindertext nennt es nicht eine Vereinbarung`);
    }
    if (f.material && !f.grenze) {
      fehler.push(`${wo}: eine Materialaussage braucht ihre Grenze – Materialien haben Eigenschaften, keine Tugenden`);
    }
    if (f.typologie && !f.gegenbeispiel) {
      fehler.push(`${wo}: eine Allaussage braucht ihr Gegenbeispiel`);
    }
  }

  // Rückfallsicherung: Stünde die Lösung überall an derselben Stelle,
  // würde jede Stelle, die die Daten einmal ungemischt ausgibt, sofort
  // zum Spickzettel.
  const mitLoesung = [...(fragen ?? []), ...(gebaeude ?? [])].filter((x) => Array.isArray(x.optionen) && x.optionen.some((o) => o.richtig));
  const stellen = new Set(mitLoesung.map((x) => x.optionen.findIndex((o) => o.richtig)));
  if (mitLoesung.length && stellen.size === 1) {
    fehler.push('optionen: die richtige Antwort steht überall an derselben Stelle');
  }

  // Alle drei Geltungsarten müssen vorkommen. Fehlte „geschmack“, wäre die
  // App wieder ein Wissensquiz; fehlte „ausgemacht“, würden Vereinbarungen
  // als Naturgesetz durchgehen.
  const zahlen = nachGeltung(fragen ?? []);
  for (const g of GELTUNGEN) {
    if (!zahlen[g]) fehler.push(`geltung ${g}: kommt gar nicht vor`);
  }

  // Das Wort „schön“ darf nur dort stehen, wo es nichts zu treffen gibt.
  for (const f of fragen ?? []) {
    const text = JSON.stringify(f);
    if (/schön|schöner|hässlich/.test(text) && f.geltung !== 'geschmack') {
      fehler.push(`Frage ${f.id}: „schön“ steht in einer Frage, die eine richtige Antwort hat`);
    }
  }

  if (!Array.isArray(gebaeude) || gebaeude.length < 5) fehler.push('gebaeude: mindestens 5 erwartet');
  for (const g of gebaeude ?? []) {
    const wo = `Gebäude ${g.id || '?'}`;
    if (!MERKMALSARTEN.includes(g.merkmalsart)) fehler.push(`${wo}: merkmalsart „${g.merkmalsart}“ gibt es nicht`);
    if (!g.name || !g.emoji || !g.merkmal) fehler.push(`${wo}: name/emoji/merkmal fehlt`);
    if (g.merkmalsart === 'bauform') {
      if (!g.gegenbeispiel) fehler.push(`${wo}: ein Erkennungsmerkmal ist typisch, nicht notwendig – Gegenbeispiel fehlt`);
      if (!Array.isArray(g.optionen) || g.optionen.length < 2) fehler.push(`${wo}: zu wenige Antworten`);
      else if (g.optionen.filter((o) => o.richtig).length !== 1) fehler.push(`${wo}: genau EINE richtige Antwort`);
    } else {
      // Nicht am Haus erkennbar: darf keine Auswahl haben und muss sagen,
      // dass man es dem Haus nicht ansieht.
      if (g.optionen) fehler.push(`${wo}: wird nicht abgefragt – ${g.merkmalsart} ist kein Formwissen`);
      if (!g.warumNicht) fehler.push(`${wo}: es fehlt der Satz, warum man das dem Haus nicht ansieht`);
    }
    if (/\b1[0-9]{3}\b|\b20[0-9]{2}\b|Jahrhundert|Ritter|Mittelalter/.test(JSON.stringify(g))) {
      fehler.push(`${wo}: Datierung oder Ritter-Erzählung im Kindertext`);
    }
  }
  // Die Grenze des Formwissens wird gezeigt, nicht verschwiegen.
  if (Array.isArray(gebaeude) && !nichtAmHaus(gebaeude).length) {
    fehler.push('gebaeude: alles wird am Haus erkannt – das ist zu glatt, um wahr zu sein');
  }
  if (Array.isArray(gebaeude) && amHausErkennbar(gebaeude).length < 3) {
    fehler.push('gebaeude: zu wenige, die man wirklich an der Form erkennt');
  }

  if (!Array.isArray(schlussIdeen) || schlussIdeen.length < 3) {
    fehler.push('schlussIdeen: mindestens 3 erwartet (die Sitzung endet offline)');
  }
  return fehler;
}

function pruefeMitLoesung(f, wo, fehler) {
  const optionen = f.optionen;
  if (!Array.isArray(optionen) || optionen.length < 2) { fehler.push(`${wo}: zu wenige Antworten`); return; }
  if (optionen.filter((o) => o.richtig).length !== 1) fehler.push(`${wo}: genau EINE richtige Antwort`);
  const texte = optionen.map((o) => o.text);
  if (new Set(texte).size !== texte.length) fehler.push(`${wo}: doppelte Antwort`);
  if (!f.antwortText) fehler.push(`${wo}: antwortText fehlt`);
}

function pruefeGeschmack(f, wo, fehler) {
  // Hier liegt der Kern: Eine Geschmacksfrage darf technisch gar nicht als
  // Quiz darstellbar sein. Kein Feld `richtig`, nicht einmal auf false.
  for (const o of f.optionen ?? []) {
    if ('richtig' in o) fehler.push(`${wo}: bei Geschmack darf keine Antwort ein Feld „richtig“ haben`);
  }
  if ('korrekt' in f || 'antwortText' in f) fehler.push(`${wo}: bei Geschmack darf keine Lösung hinterlegt sein`);
  if (!Array.isArray(f.optionen) || f.optionen.length < 2) fehler.push(`${wo}: zu wenige Möglichkeiten`);
  // Bewertet wird das Begründen, nicht die Wahl.
  if (!/Warum|Weshalb|Wieso/.test(f.gespraech ?? '')) {
    fehler.push(`${wo}: der Impuls muss nach dem Warum fragen, nicht nach der Wahl`);
  }
}

function pruefeProbe(f, wo, fehler) {
  if (!f.probe) { fehler.push(`${wo}: prüfbar ohne Probe – dann ist es nicht prüfbar`); return; }
  if (GEFAHR.test(f.probe)) fehler.push(`${wo}: die Probe verlangt etwas Gefährliches`);
  if (f.maxGrad && f.maxGrad > MAX_GRAD) fehler.push(`${wo}: ${f.maxGrad} Grad sind zu heiß für einen Kinderversuch`);
  if (/Wasser/.test(f.probe) && !f.maxGrad) fehler.push(`${wo}: ein Wasserversuch braucht eine Temperaturgrenze`);
  if (!f.erwartet) fehler.push(`${wo}: es fehlt, was man beobachten sollte`);
  // Was, wenn der Versuch etwas anderes zeigt? Ohne diesen Satz korrigiert
  // der Erwachsene die richtige Beobachtung des Kindes als verkehrt.
  if (!f.wennAnders) fehler.push(`${wo}: es fehlt der Satz für den Fall, dass etwas anderes herauskommt`);
  // Design hat fast nie genau einen Grund. „Der Grund ist …“ wäre gelogen.
  if (!Array.isArray(f.gruende) || f.gruende.length < 2) {
    fehler.push(`${wo}: mindestens zwei Gründe erwartet – ein Ding erfüllt mehrere Anforderungen zugleich`);
  } else if (/\bnicht\b|\bkein/.test(f.gruende[0])) {
    // Verneinte Kriterien drehen Vierjährige beim Wiedergeben regelmäßig
    // um. Der erste Grund sagt deshalb, was das Ding KANN.
    fehler.push(`${wo}: der erste Grund ist verneint – er soll sagen, was das Ding kann`);
  }
}
