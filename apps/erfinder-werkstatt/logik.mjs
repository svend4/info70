// Erfinder-Werkstatt – reine Logik (ohne DOM), testbar mit node --test.
// Zwei Bausteine: ein Auftrags-Generator (Gegenstand × Veränderungskarte)
// und die Natur-Technik-Paare. Praleska docs/10 (Kinder-Apps Nr. 16).
//
// Die Erzeugerfunktion ist absichtlich isoliert und ohne DOM: Sie nimmt
// die Zufallsquelle als Parameter entgegen und ist damit vollständig
// prüfbar (Katalogvorgabe „isolierte Erzeugerfunktion“).

/** Akkusativform des bestimmten Artikels. */
export function akkusativ(artikel) {
  return { der: 'den', die: 'die', das: 'das' }[artikel] ?? null;
}

/** „den Tisch“, „die Lampe“, „das Buch“ – für die Leitfragen. */
export function akkusativPhrase(gegenstand) {
  const art = akkusativ(gegenstand.artikel);
  return art ? `${art} ${gegenstand.name}` : gegenstand.name;
}

/**
 * Baut einen Werkstatt-Auftrag aus Gegenstand × Karte.
 * `zufall` bekommt eine Liste und gibt ein Element zurück – so lässt sich
 * die Funktion im Test vollständig festlegen.
 */
export function baueAuftrag(daten, zufall, vorher = null) {
  let gegenstand = zufall(daten.gegenstaende);
  let karte = zufall(daten.karten);
  // Nie zweimal hintereinander dieselbe Paarung.
  if (vorher && vorher.gegenstand.id === gegenstand.id && vorher.karte.id === karte.id) {
    const andere = daten.karten.filter((k) => k.id !== karte.id);
    if (andere.length) karte = zufall(andere);
    else gegenstand = zufall(daten.gegenstaende.filter((g) => g.id !== gegenstand.id));
  }
  const phrase = akkusativPhrase(gegenstand);
  return {
    gegenstand,
    karte,
    titel: `${karte.name}: ${gegenstand.name}`,
    fragen: daten.fragen.map((f) => f.replaceAll('{akkusativ}', phrase)),
  };
}

/** Wie viele verschiedene Aufträge sind möglich? */
export function auftragsVielfalt(daten) {
  return daten.gegenstaende.length * daten.karten.length;
}

/** Ein Bionik-Paar mit gemischten Antwortmöglichkeiten. */
export function baueBionikFrage(paar, mischen) {
  return {
    paar,
    optionen: mischen([paar.vorbild, ...paar.andere]),
  };
}

/**
 * Validiert die Werkstatt-Daten. Wichtigste Regel: Ein Paar darf nur dann
 * „abgeschaut“ heißen, wenn ein konkreter Beleg danebensteht – und ein
 * „ähnlich“-Paar muss ausdrücklich sagen, dass es NICHT abgeschaut ist.
 * Sonst würde die App aus Ähnlichkeit eine Erfindungsgeschichte machen.
 */
export function pruefeDaten(daten) {
  const fehler = [];
  const { gegenstaende, karten, bionik, fragen } = daten ?? {};

  if (!Array.isArray(gegenstaende) || gegenstaende.length < 10) fehler.push('gegenstaende: mindestens 10 erwartet');
  else {
    const ids = new Set();
    for (const g of gegenstaende) {
      if (!g.id || ids.has(g.id)) fehler.push(`Gegenstand ${g.id || '?'}: id fehlt oder doppelt`);
      ids.add(g.id);
      if (!g.name || !g.emoji || !g.alltag) fehler.push(`Gegenstand ${g.id}: name/emoji/alltag fehlt`);
      if (!akkusativ(g.artikel)) fehler.push(`Gegenstand ${g.id}: artikel muss der/die/das sein`);
    }
  }

  if (!Array.isArray(karten) || karten.length < 6) fehler.push('karten: mindestens 6 erwartet');
  else {
    const ids = new Set();
    for (const k of karten) {
      if (!k.id || ids.has(k.id)) fehler.push(`Karte ${k.id || '?'}: id fehlt oder doppelt`);
      ids.add(k.id);
      if (!k.name || !k.emoji || !k.anweisung || !k.beispiel) fehler.push(`Karte ${k.id}: name/emoji/anweisung/beispiel fehlt`);
    }
  }

  if (!Array.isArray(fragen) || fragen.length < 3) fehler.push('fragen: mindestens 3 Leitfragen erwartet');
  else if (!fragen.some((f) => f.includes('{akkusativ}'))) fehler.push('fragen: keine nutzt den Platzhalter {akkusativ}');

  if (!Array.isArray(bionik) || bionik.length < 8) fehler.push('bionik: mindestens 8 Paare erwartet');
  else {
    const ids = new Set();
    for (const p of bionik) {
      const wo = `Bionik ${p.id || '?'}`;
      if (!p.id || ids.has(p.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
      ids.add(p.id);
      if (!p.erfindung || !p.emoji || !p.vorbild || !p.erklaerung) fehler.push(`${wo}: erfindung/emoji/vorbild/erklaerung fehlt`);
      if (!Array.isArray(p.andere) || p.andere.length !== 2) fehler.push(`${wo}: genau 2 Ablenker erwartet`);
      else if (p.andere.includes(p.vorbild)) fehler.push(`${wo}: Ablenker wiederholt das Vorbild`);
      else if (new Set(p.andere).size !== p.andere.length) fehler.push(`${wo}: doppelte Ablenker`);
      if (!['abgeschaut', 'aehnlich'].includes(p.art)) fehler.push(`${wo}: art muss abgeschaut oder aehnlich sein`);
      if (p.art === 'abgeschaut' && (!p.beleg || p.beleg.length < 80)) {
        fehler.push(`${wo}: „abgeschaut“ braucht einen konkreten Beleg`);
      }
      if (p.art === 'aehnlich') {
        if (p.beleg) fehler.push(`${wo}: „ähnlich“ darf keinen Erfindungs-Beleg tragen`);
        // Die Frage lautet „Wovon ist das abgeschaut?“. Stünde bei einem
        // Ähnlichkeits-Fall ein Lebewesen als richtige Antwort, würde die App
        // genau die Verwechslung belohnen, die sie auflösen soll.
        if (!/^Niemand\b/.test(p.vorbild || '')) {
          fehler.push(`${wo}: „ähnlich“ muss als Vorbild „Niemand …“ tragen, sonst wird Ähnlichkeit als Abschauen gewertet`);
        }
        if (!/nicht abgeschaut|keine Kopie|nicht belegt|kein Vorbild/.test(p.erklaerung)) {
          fehler.push(`${wo}: „ähnlich“ muss in der Erklärung sagen, dass nicht abgeschaut wurde`);
        }
      }
    }
    if (!bionik.some((p) => p.art === 'abgeschaut')) fehler.push('bionik: kein einziges echtes Vorbild');
    if (!bionik.some((p) => p.art === 'aehnlich')) fehler.push('bionik: kein einziger Ähnlichkeits-Fall');
  }

  return fehler;
}
