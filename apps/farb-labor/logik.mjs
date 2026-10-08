// Farb-Labor – reine Logik (ohne DOM), testbar mit node --test.
// Ko-Nutzungs-App für 5-7: Farben mischen, heller/dunkler machen, warm
// und kalt als Abmachung. Praleska docs/10 (Ko-Nutzung Nr. 21).
//
// Wie die anderen Apps dieses Abschnitts bewusst NICHT auf quiz-kern:
// kein Rekord, keine Punkte, keine Ränge.
//
// ZWEI ORTE, ZWEI ERGEBNISSE – das ist der ganze Aufbau.
//
// Ein Bildschirm LEUCHTET: er mischt Licht und wird dabei heller
// (rotes plus grünes Licht gibt Gelb, alle drei geben Weiß). Ein
// Farbkasten leuchtet nicht: jede Buntfarbe nimmt dem auffallenden Licht
// etwas weg, zwei Buntfarben werden dunkler und stumpfer (rot plus grün
// gibt Braun).
//
// Die gefährlichste Bauweise wäre, EINE Mischregel zu rechnen und für
// beide Welten zu benutzen. Das Kind entdeckte am Bildschirm „Rot und
// Grün macht Gelb“, trüge es an den Maltisch, bekäme Braun – und der
// Erwachsene korrigierte die richtige Beobachtung des Kindes als Fehler.
// Deshalb ist die Asymmetrie hier ins Schema eingebaut:
//
//   traeger === 'licht'    → das Ergebnis DARF gerechnet werden und wird
//                            vom Validator nachgerechnet (geklammerte
//                            Summe im linearen Licht).
//   traeger === 'pigment'  → das Ergebnis darf NICHT gerechnet werden.
//                            Es ist ein Redaktionswert und braucht
//                            `giltFuer`, `mengeAendert` und `wennAnders`.
//
// Und mindestens ein Farbton-Paar muss in BEIDEN Trägern vorkommen und
// dort verschieden ausgehen – sonst behauptet die App stillschweigend
// doch eine einzige Mischregel.
/** Höchstens so viele Pigment-Mischungen pro Sitzung. */
export const PRO_SESSION = 3;

/** Die drei Farben, die im Farbkasten nicht gemischt werden können. */
export const GRUNDFARBEN_ANZAHL = 3;

/** Die beiden Orte. */
export const TRAEGER = ['pigment', 'licht'];

/** Warm/kalt ist eine Abmachung, nie ein Messwert. */
export const WARM_KALT_GELTUNG = 'ausgemacht';

/** Eine Farbe aus der Registry holen. */
export function farbeVon(daten, id) {
  return (daten?.farben ?? []).find((f) => f.id === id) ?? null;
}

/** Eine Mischung aus der Registry holen. */
export function mischungVon(daten, id) {
  return (daten?.mischungen ?? []).find((m) => m.id === id) ?? null;
}

/** '#RRGGBB' → [r, g, b] mit 0..255, oder null. */
export function kanaele(hex) {
  const treffer = /^#([0-9a-f]{6})$/i.exec(String(hex ?? ''));
  if (!treffer) return null;
  const n = parseInt(treffer[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const zuLinear = (k) => {
  const v = k / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const zuSrgb = (v) => {
  const g = v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, g)) * 255);
};
const alsHex = (kanal) => `#${kanal.map((k) => k.toString(16).padStart(2, '0')).join('')}`.toUpperCase();

/**
 * Relative Helligkeit nach WCAG 2.x. Hier nicht für Kontraste, sondern
 * als Messgerät: beim Mischen von PIGMENT wird es dunkler, beim Mischen
 * von LICHT heller.
 */
export function relativeHelligkeit(hex) {
  const roh = kanaele(hex);
  if (!roh) return null;
  const [r, g, b] = roh.map(zuLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Zwei Lichtfarben addieren: Summe im linearen Licht, auf 1 geklammert.
 * Das ist physikalisch richtig und deshalb erlaubt – Lichtmischungen
 * müssen nicht geglaubt werden, sie lassen sich nachrechnen.
 */
export function lichtSumme(hexA, hexB) {
  const a = kanaele(hexA);
  const b = kanaele(hexB);
  if (!a || !b) return null;
  return alsHex(a.map((k, i) => zuSrgb(Math.min(1, zuLinear(k) + zuLinear(b[i])))));
}

/** Pigment: das Ergebnis ist dunkler als die hellere Zutat. */
export function istSubtraktiv(daten, mischung) {
  const zutaten = (mischung?.aus ?? []).map((id) => relativeHelligkeit(farbeVon(daten, id)?.hex));
  const ergebnis = relativeHelligkeit(farbeVon(daten, mischung?.ergebnis)?.hex);
  if (ergebnis == null || !zutaten.length || zutaten.some((h) => h == null)) return false;
  return ergebnis < Math.max(...zutaten);
}

/** Licht: das Ergebnis ist genau die geklammerte Summe – und heller. */
export function istAdditiv(daten, mischung) {
  const hexe = (mischung?.aus ?? []).map((id) => farbeVon(daten, id)?.hex);
  const ergebnis = farbeVon(daten, mischung?.ergebnis)?.hex;
  if (hexe.length !== 2 || hexe.some((h) => !h) || !ergebnis) return false;
  const summe = lichtSumme(hexe[0], hexe[1]);
  if (!summe || summe.toUpperCase() !== ergebnis.toUpperCase()) return false;
  return relativeHelligkeit(ergebnis) > Math.max(...hexe.map(relativeHelligkeit));
}

/** Die Farbton-Signatur eines Paares, trägerunabhängig: 'gruen+rot'. */
export function farbtonPaar(daten, mischung) {
  const toene = (mischung?.aus ?? []).map((id) => farbeVon(daten, id)?.farbton);
  if (toene.some((t) => !t)) return null;
  return [...toene].sort().join('+');
}

/** Alle Mischungen eines Trägers. */
export function vomTraeger(daten, traeger) {
  return (daten?.mischungen ?? []).filter((m) => m.traeger === traeger);
}

/** Die Pigment-Mischung zu zwei gewählten Farben – Reihenfolge egal. */
export function mischungFuer(daten, a, b) {
  return vomTraeger(daten, 'pigment').find((m) => {
    const aus = m.aus ?? [];
    return aus.length === 2 && aus.includes(a) && aus.includes(b) && a !== b;
  }) ?? null;
}

/**
 * Alle Farben, die überhaupt als Zutat vorkommen. Nur sie gehören in den
 * Kasten – Orange und Violett sind Ergebnisse, mit denen in dieser App
 * nicht weitergemischt wird.
 */
export function mischbareFarben(daten) {
  const ids = new Set();
  for (const m of vomTraeger(daten, 'pigment')) for (const id of m.aus ?? []) ids.add(id);
  return [...ids];
}

/**
 * Der Kasten dieser Sitzung: die Grundfarben plus die selbst gemischten
 * Farben, mit denen es weitergeht. Ohne dieses Wachsen wäre „Rot und
 * Grün gibt Braun“ gar nicht erreichbar – Grün liegt nicht im Kasten.
 */
export function offeneFarben(daten, erreicht = []) {
  const mischbar = new Set(mischbareFarben(daten));
  const kasten = new Set(daten?.grundfarben ?? []);
  for (const id of erreicht) if (mischbar.has(id)) kasten.add(id);
  return [...kasten];
}

/**
 * Welche Farben passen zu `a`, sodass es eine geprüfte Mischung gibt?
 * Nur diese werden angeboten – sonst liefe ein Kind in eine Sackgasse,
 * für die die App kein Ergebnis hat.
 */
export function partnerFuer(daten, a, kasten) {
  return (kasten ?? []).filter((b) => b !== a && mischungFuer(daten, a, b));
}

/**
 * Welche Mischungen sind von den Grundfarben aus überhaupt erreichbar?
 * Transitiver Abschluss: eine Mischung, deren Zutaten nie im Kasten
 * liegen können, ist Daten, die kein Kind je sieht.
 */
export function erreichbareMischungen(daten) {
  // Dieselbe Regel wie `offeneFarben`: ein Ergebnis wandert nur dann in
  // den Kasten, wenn es überhaupt als Zutat vorkommt. Sonst würde hier
  // mehr als erreichbar gelten, als die App anbietet.
  const mischbar = new Set(mischbareFarben(daten));
  const kasten = new Set(daten?.grundfarben ?? []);
  const erreicht = new Set();
  let gewachsen = true;
  while (gewachsen) {
    gewachsen = false;
    for (const m of vomTraeger(daten, 'pigment')) {
      if (erreicht.has(m.id)) continue;
      if (!(m.aus ?? []).length || !(m.aus ?? []).every((id) => kasten.has(id))) continue;
      erreicht.add(m.id);
      gewachsen = true;
      if (mischbar.has(m.ergebnis)) kasten.add(m.ergebnis);
    }
  }
  return [...erreicht];
}

/** 'warm' | 'kalt' | 'strittig' | null – nie eine Bewertung. */
export function warmKaltEinordnung(daten, farbId) {
  const wk = daten?.warmKalt;
  if (!wk) return null;
  if ((wk.strittigeFarben ?? []).includes(farbId)) return 'strittig';
  if ((wk.warm ?? []).includes(farbId)) return 'warm';
  if ((wk.kalt ?? []).includes(farbId)) return 'kalt';
  return null;
}

/**
 * Validiert die Daten. Zwei Regeln tragen alles:
 *
 * 1. Jede Mischung muss sich so verhalten, wie ihr Ort es verlangt –
 *    Pigment dunkler, Licht genau die geklammerte Summe und heller.
 * 2. Mindestens ein Farbton-Paar muss in BEIDEN Orten vorkommen und
 *    dort verschieden ausgehen.
 *
 * Fällt Regel 2, dann steht in den Daten nur noch eine Welt, und die App
 * schickt das Kind mit einem Bildschirmergebnis an den Maltisch.
 */
export function pruefeDaten(daten) {
  const fehler = [];

  const farben = daten?.farben;
  if (!Array.isArray(farben) || farben.length < 10) fehler.push('farben: mindestens 10 erwartet');
  const ids = new Set();
  for (const f of farben ?? []) {
    const wo = `Farbe ${f.id || '?'}`;
    if (!f.id || ids.has(f.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
    ids.add(f.id);
    if (!TRAEGER.includes(f.traeger)) fehler.push(`${wo}: traeger muss ${TRAEGER.join(' oder ')} sein`);
    if (!f.farbton) fehler.push(`${wo}: farbton fehlt – ohne ihn sind die beiden Orte nicht vergleichbar`);
    // Der Name steht immer neben dem Fleck: Farbe darf nie der einzige
    // Informationsträger sein (rund jeder zwölfte Junge sieht Rot und
    // Grün anders).
    if (!f.name) fehler.push(`${wo}: name fehlt – Farbe allein trägt die Information nicht`);
    if (!kanaele(f.hex)) fehler.push(`${wo}: hex muss #RRGGBB sein`);
    // Die Farbwörter gehören zum Pigment-Teil; Lichtfarben heißen hier
    // „rotes Licht“ und sind kein Wortschatz-Thema.
    if (f.traeger === 'pigment' && (!f.ukName || !f.ruName)) fehler.push(`${wo}: ukName/ruName fehlt`);
  }

  const grund = daten?.grundfarben;
  if (!Array.isArray(grund) || grund.length !== GRUNDFARBEN_ANZAHL) {
    fehler.push(`grundfarben: genau ${GRUNDFARBEN_ANZAHL} erwartet`);
  } else {
    for (const id of grund) {
      if (!ids.has(id)) fehler.push(`grundfarben: ${id} ist keine bekannte Farbe`);
      else if (farbeVon(daten, id).traeger !== 'pigment') fehler.push(`grundfarben: ${id} ist keine Pigmentfarbe`);
    }
  }

  const mischungen = daten?.mischungen;
  if (!Array.isArray(mischungen) || mischungen.length < 6) fehler.push('mischungen: mindestens 6 erwartet');
  const gesehen = new Set();
  for (const m of mischungen ?? []) {
    const wo = `Mischung ${m.id || '?'}`;
    if (!TRAEGER.includes(m.traeger)) fehler.push(`${wo}: traeger muss ${TRAEGER.join(' oder ')} sein`);
    const aus = m.aus;
    if (!Array.isArray(aus) || aus.length !== 2) { fehler.push(`${wo}: genau 2 Zutaten erwartet`); continue; }
    for (const id of aus) if (!ids.has(id)) fehler.push(`${wo}: Zutat ${id} ist keine bekannte Farbe`);
    if (aus[0] === aus[1]) fehler.push(`${wo}: zweimal dieselbe Zutat mischt nichts`);
    if (aus.some((id) => farbeVon(daten, id)?.traeger !== m.traeger)) {
      fehler.push(`${wo}: Zutat vom falschen Ort – Licht und Pigment werden nicht miteinander gemischt`);
    }
    const schluessel = `${m.traeger}:${[...aus].sort().join('+')}`;
    if (gesehen.has(schluessel)) fehler.push(`${wo}: dieses Paar steht an diesem Ort schon da`);
    gesehen.add(schluessel);
    if (!ids.has(m.ergebnis)) { fehler.push(`${wo}: ergebnis ${m.ergebnis} ist keine bekannte Farbe`); continue; }
    if (farbeVon(daten, m.ergebnis).traeger !== m.traeger) fehler.push(`${wo}: das Ergebnis liegt am anderen Ort`);
    if (aus.includes(m.ergebnis)) fehler.push(`${wo}: das Ergebnis ist eine der Zutaten – dann passiert nichts`);
    if (!m.wasPassiert) fehler.push(`${wo}: wasPassiert fehlt`);

    if (m.traeger === 'pigment') {
      if (!istSubtraktiv(daten, m)) {
        fehler.push(`${wo}: das Ergebnis ist nicht dunkler als die hellere Zutat – so mischt Licht, nicht Farbe`);
      }
      // Ein Mischergebnis ohne Mengenhinweis behauptet, es gäbe genau
      // EIN Grün. Am Tisch stimmt das nie.
      if (!m.mengeAendert) fehler.push(`${wo}: mengeAendert fehlt – „das“ Grün gibt es nicht`);
      // Pigmentwerte sind Redaktion, keine Messung. Beides muss dastehen:
      // wofür der Wert gilt, und was zu sagen ist, wenn es anders aussieht.
      if (!m.giltFuer) fehler.push(`${wo}: giltFuer fehlt – ein Pigmentwert gilt nicht für jeden Kasten`);
      if (!m.wennAnders) fehler.push(`${wo}: wennAnders fehlt – ein anderes Ergebnis am Tisch ist kein Fehler des Kindes`);
      if (!m.gespraech || !m.suchauftrag) fehler.push(`${wo}: gespraech/suchauftrag fehlt`);
      if (m.gespraech && !m.gespraech.trim().endsWith('?')) fehler.push(`${wo}: Gesprächsimpuls soll eine Frage sein`);
    } else if (!istAdditiv(daten, m)) {
      fehler.push(`${wo}: das Ergebnis ist nicht die geklammerte Lichtsumme der Zutaten`);
    }
  }

  // Jede Grundfarbe muss in mindestens einer Pigment-Mischung vorkommen.
  for (const id of grund ?? []) {
    if (!vomTraeger(daten, 'pigment').some((m) => (m.aus ?? []).includes(id))) {
      fehler.push(`grundfarbe ${id}: kommt in keiner Mischung vor`);
    }
  }

  // Und jede Mischung muss von den Grundfarben aus erreichbar sein. Eine
  // Mischung, deren Zutaten nie im Kasten liegen können, ist Datensatz,
  // den kein Kind je sieht – genau das war „Rot und Grün gibt Braun“,
  // bevor der Kasten mitwuchs.
  const erreichbar = new Set(erreichbareMischungen(daten));
  for (const m of vomTraeger(daten, 'pigment')) {
    if (!erreichbar.has(m.id)) {
      fehler.push(`Mischung ${m.id}: von den Grundfarben aus nicht erreichbar – kein Kind kommt je dort an`);
    }
  }

  // Die tragende Regel 2: dasselbe Farbton-Paar an beiden Orten, mit
  // verschiedenem Ergebnis.
  const paarZuErgebnis = { pigment: new Map(), licht: new Map() };
  for (const m of mischungen ?? []) {
    const paar = farbtonPaar(daten, m);
    if (paar && paarZuErgebnis[m.traeger]) {
      paarZuErgebnis[m.traeger].set(paar, farbeVon(daten, m.ergebnis)?.farbton);
    }
  }
  const gemeinsam = [...paarZuErgebnis.pigment.keys()].filter((p) => paarZuErgebnis.licht.has(p));
  if (!gemeinsam.length) {
    fehler.push('es fehlt ein Farbton-Paar, das an BEIDEN Orten vorkommt – sonst behauptet die App eine einzige Mischregel');
  }
  for (const paar of gemeinsam) {
    if (paarZuErgebnis.pigment.get(paar) === paarZuErgebnis.licht.get(paar)) {
      fehler.push(`Paar ${paar}: an beiden Orten dasselbe Ergebnis – dann ist der Unterschied der beiden Orte nicht gezeigt`);
    }
  }

  // Die Zwei-Orte-Karten müssen auf echte Mischungen zeigen.
  const zweiOrte = daten?.zweiOrte;
  if (!Array.isArray(zweiOrte) || !zweiOrte.length) fehler.push('zweiOrte: mindestens 1 Karte erwartet');
  for (const o of zweiOrte ?? []) {
    const wo = `zweiOrte ${o.id || '?'}`;
    const l = mischungVon(daten, o.lichtMischung);
    const p = mischungVon(daten, o.pigmentMischung);
    if (!l || l.traeger !== 'licht') fehler.push(`${wo}: lichtMischung fehlt oder ist keine Lichtmischung`);
    if (!p || p.traeger !== 'pigment') fehler.push(`${wo}: pigmentMischung fehlt oder ist keine Pigmentmischung`);
    if (l && p && farbtonPaar(daten, l) !== farbtonPaar(daten, p)) {
      fehler.push(`${wo}: die beiden Mischungen gehen von verschiedenen Farben aus – dann vergleicht die Karte nichts`);
    }
    if (!o.frage || !o.aufloesung || !o.gespraech) fehler.push(`${wo}: frage/aufloesung/gespraech fehlt`);
  }

  const hd = daten?.hellDunkel;
  if (!Array.isArray(hd) || hd.length < 3) fehler.push('hellDunkel: mindestens 3 erwartet');
  for (const h of hd ?? []) {
    const wo = `hellDunkel ${h.id || '?'}`;
    if (!['heller', 'dunkler'].includes(h.richtung)) fehler.push(`${wo}: richtung muss heller oder dunkler sein`);
    // Wasser hellt nur Wasserfarben auf, Deckweiß nur Deckfarben – und es
    // sind zwei verschiedene Vorgänge. Ohne diese Angabe gibt die App
    // einen Rat, der am Tisch nicht funktioniert.
    if (!h.nurBei) fehler.push(`${wo}: nurBei fehlt – Deckfarben und Wasserfarben hellen verschieden auf`);
    if (!h.titel || !h.wasPassiert || !h.mittel) fehler.push(`${wo}: titel/wasPassiert/mittel fehlt`);
  }
  if (!(hd ?? []).some((h) => h.richtung === 'heller') || !(hd ?? []).some((h) => h.richtung === 'dunkler')) {
    fehler.push('hellDunkel: es braucht beide Richtungen');
  }

  const wk = daten?.warmKalt;
  if (!wk) fehler.push('warmKalt fehlt');
  else {
    // Warm und kalt ist nicht messbar. Stünde hier 'pruefbar', würde die
    // App eine Abmachung als Naturtatsache ausgeben.
    if (wk.geltung !== WARM_KALT_GELTUNG) fehler.push(`warmKalt: geltung muss ${WARM_KALT_GELTUNG} sein – warm und kalt kann man nicht nachmessen`);
    if (!wk.erklaerung || !wk.gespraech) fehler.push('warmKalt: erklaerung/gespraech fehlt');
    // Eine Einteilung ohne Grenzfall sieht klarer aus, als sie ist.
    if (!wk.strittig || !(wk.strittigeFarben ?? []).length) {
      fehler.push('warmKalt: es braucht mindestens eine strittige Farbe samt Erklärung');
    }
    for (const [feld, liste] of [['warm', wk.warm], ['kalt', wk.kalt], ['strittigeFarben', wk.strittigeFarben]]) {
      if (!Array.isArray(liste) || !liste.length) fehler.push(`warmKalt.${feld}: leer`);
      for (const id of liste ?? []) if (!ids.has(id)) fehler.push(`warmKalt.${feld}: ${id} ist keine bekannte Farbe`);
    }
    const doppelt = (wk.warm ?? []).filter((id) => (wk.kalt ?? []).includes(id));
    if (doppelt.length) fehler.push(`warmKalt: ${doppelt.join(', ')} steht in beiden Listen`);
    for (const id of wk.strittigeFarben ?? []) {
      if ((wk.warm ?? []).includes(id) || (wk.kalt ?? []).includes(id)) {
        fehler.push(`warmKalt: ${id} ist strittig und trotzdem einsortiert`);
      }
    }
  }

  // „Aus drei Grundfarben kann man alle Farben mischen“ ist falsch. Die
  // App muss es selbst richtigstellen und Beispiele nennen.
  const nm = daten?.nichtMischbar;
  if (!nm || !/nicht alle/.test(nm.satz ?? '')) {
    fehler.push('nichtMischbar: die App muss sagen, dass sich NICHT alle Farben mischen lassen');
  }
  if (!Array.isArray(nm?.beispiele) || nm.beispiele.length < 3) {
    fehler.push('nichtMischbar: mindestens 3 Beispiele erwartet');
  }

  // Mindestens eine Farbe muss sagen, dass die Sprachen anders schneiden
  // – eine stille 1:1-Liste de/uk/ru wäre sachlich falsch.
  if (!(farben ?? []).some((f) => f.sprachHinweis)) {
    fehler.push('sprachHinweis: keine einzige Farbe sagt, dass uk/ru die Farben anders einteilen');
  }

  if (!daten?.ehrlichkeit || !/Licht/.test(daten.ehrlichkeit)) {
    fehler.push('ehrlichkeit: die App muss selbst sagen, dass ein Bildschirm Licht mischt');
  }
  if (!daten?.herkunftDerWerte || !/Messung/.test(daten.herkunftDerWerte)) {
    fehler.push('herkunftDerWerte: es muss dastehen, dass die Pigmentwerte eine Richtung und keine Messung sind');
  }
  if (!Array.isArray(daten?.malauftraege) || daten.malauftraege.length < 3) {
    fehler.push('malauftraege: mindestens 3 erwartet (die Sitzung endet am Papier)');
  }
  if (!Array.isArray(daten?.sicherheit) || daten.sicherheit.length < 4) {
    fehler.push('sicherheit: mindestens 4 Hinweise erwartet');
  }
  return fehler;
}
