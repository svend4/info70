// Musik-Detektive – reine Logik (ohne DOM), testbar mit node --test.
// Ko-Nutzungs-App für 4-6: Lied, Marsch und Tanz heraushören.
// Praleska docs/10 (Ko-Nutzung Nr. 15).
//
// Abgrenzung zu klang-detektive (Nr. 3): dort geht es um einzelne
// Klangeigenschaften (hoch/tief, laut/leise, schnell/langsam), hier um den
// Charakter eines ganzen Musikstücks.
//
// Alle Melodien sind Eigenproduktion und werden im Browser aus Dreiklangs-
// und Skalenfiguren erzeugt. Es gibt keine fremden Aufnahmen, keine fremden
// Melodien und keine externen Anfragen.
//
// Drei eingebaute Ehrlichkeiten, alle im Validator:
//  1. Lied, Marsch und Tanz überschneiden sich. Es MUSS ein Stück geben,
//     das zu zwei Sorten gehört (ein Marschlied), und Rätsel mit genau
//     einer richtigen Antwort dürfen solche Stücke nicht verwenden.
//  2. Stimmungsfragen haben keine richtige Antwort. Der Validator lehnt
//     jedes Stimmungs-Item ab, das eine hinterlegte Lösung mitbringt.
//  3. Ein Vergleichspaar darf sich in GENAU EINEM Merkmal unterscheiden.
//     Sonst behauptet die App eine Ursache, die sie nicht gezeigt hat.

/** Höchstens so viele Aufgaben pro Sitzung. */
export const PRO_SESSION = 5;

/** Die drei Charaktere aus dem Katalog. */
export const KATEGORIEN = ['lied', 'marsch', 'tanz'];

/**
 * Töne in Hertz. Deutsche Namen: H4 ist der Ton h' (493,88 Hz), B4 ist
 * das b' (466,16 Hz). Beide stehen hier, damit die Verwechslung mit der
 * englischen Benennung (B = h) nicht in die Daten rutschen kann.
 */
export const TOENE = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0,
  C4: 261.63, D4: 293.66, Es4: 311.13, E4: 329.63, F4: 349.23,
  G4: 392.0, As4: 415.3, A4: 440.0, B4: 466.16, H4: 493.88, C5: 523.25,
  G2: 98.0,
};

/** Singbarer Bereich für Vier- bis Sechsjährige: c' bis h'. */
export const LIED_TIEFSTER = TOENE.C4;
export const LIED_HOECHSTER = TOENE.H4;

/** Obergrenze für die Lautstärke – Kinder regeln sie nicht selbst. */
export const MAX_LAUTSTAERKE = 0.22;

/** Zwei oder vier Schläge im Takt zählt man in Zweiern, drei in Dreiern. */
export function gruppierungVon(schlaegeProTakt) {
  if (schlaegeProTakt === 3) return 'dreier';
  if (schlaegeProTakt === 2 || schlaegeProTakt === 4) return 'zweier';
  return null;
}

export function stueckVon(daten, id) {
  return daten.stuecke.find((s) => s.id === id) ?? null;
}

/** Gesamtlänge in Schlägen. */
export function schlaegeGesamt(stueck) {
  return (stueck.melodie ?? []).reduce((summe, n) => summe + n.schlaege, 0);
}

/** Sekunden pro Schlag. */
export function schlagDauer(stueck) {
  return 60 / stueck.bpm;
}

/** Alle klingenden Tonhöhen der Melodie in Hertz (Pausen fallen weg). */
export function melodieHertz(stueck) {
  const oktav = 2 ** (stueck.lage ?? 0);
  return (stueck.melodie ?? [])
    .filter((n) => !n.pause)
    .map((n) => (TOENE[n.ton] ?? NaN) * oktav);
}

/**
 * Die Melodie als Zeitplan: wann welcher Ton wie lange klingt. Daraus
 * baut die App den Klang UND die mitlaufenden Puls-Punkte, damit beides
 * gar nicht auseinanderlaufen kann.
 */
export function zeitplan(stueck) {
  const dauer = schlagDauer(stueck);
  const oktav = 2 ** (stueck.lage ?? 0);
  const kurz = stueck.artikulation === 'kurz';
  let schlag = 0;
  const noten = [];
  for (const n of stueck.melodie ?? []) {
    if (!n.pause) {
      noten.push({
        hertz: (TOENE[n.ton] ?? 0) * oktav,
        beginn: schlag * dauer,
        // Kurze Töne klingen nur einen Teil ihres Wertes, gebundene fast
        // bis zum nächsten Ton. Das ist der hörbare Unterschied.
        dauer: n.schlaege * dauer * (kurz ? 0.4 : 0.95),
      });
    }
    schlag += n.schlaege;
  }
  const schlaege = [];
  for (let i = 0; i < schlaegeGesamt(stueck); i++) {
    schlaege.push({
      beginn: i * dauer,
      betont: i % stueck.schlaegeProTakt === 0,
      imTakt: i % stueck.schlaegeProTakt,
    });
  }
  return { noten, schlaege, dauer, gesamt: schlaegeGesamt(stueck) * dauer };
}

/** Passt das Etikett zum Puls? Marsch zählt in Zweiern, Tanz in Dreiern. */
export function etikettPasst(stueck) {
  const g = gruppierungVon(stueck.schlaegeProTakt);
  if (stueck.kategorien?.includes('marsch') && g !== 'zweier') return false;
  if (stueck.kategorien?.includes('tanz') && g !== 'dreier') return false;
  return true;
}

/**
 * Ist das Stück wirklich mitsingbar? Wird gerechnet, nicht behauptet:
 * alle Töne im Bereich c'–h' und spätestens nach zwei Takten eine Pause
 * von mindestens einem Schlag – sonst kann ein Kind nicht atmen.
 */
export function istSingbar(stueck) {
  const hertz = melodieHertz(stueck);
  if (!hertz.length) return false;
  if (hertz.some((h) => !(h >= LIED_TIEFSTER - 0.01 && h <= LIED_HOECHSTER + 0.01))) return false;
  const fenster = stueck.schlaegeProTakt * 2;
  let seitPause = 0;
  for (const n of stueck.melodie) {
    if (n.pause && n.schlaege >= 1) seitPause = 0;
    else seitPause += n.schlaege;
    if (seitPause > fenster) return false;
  }
  return true;
}

/** Die Merkmale, in denen sich zwei Stücke unterscheiden können. */
export const MERKMALE = ['schlaegeProTakt', 'bpm', 'artikulation', 'begleitung', 'tonart', 'lage'];

/** Worin unterscheiden sich zwei Stücke? */
export function unterschiede(a, b) {
  return MERKMALE.filter((m) => (a[m] ?? 0) !== (b[m] ?? 0));
}

/** Rätsel dürfen nur Stücke mit genau einer Sorte verwenden. */
export function eindeutig(stueck) {
  return (stueck.kategorien?.length ?? 0) === 1;
}

/**
 * War die Antwort nicht die gesuchte, aber gut gedacht? Muster C zählt
 * in Zweiern wie ein Marsch – wer danach „marschieren“ sagt, hat die
 * Regel richtig angewendet und nur das zweite Merkmal übersehen. Das
 * darf kein Fehlersignal auslösen.
 */
export function istNachvollziehbar(raetsel, option) {
  if (!option || option.richtig) return false;
  return Boolean(raetsel.nachvollziehbar) && option.wert === raetsel.nachvollziehbar;
}

/** Wie viele Rätsel gehen auch ohne Hören? Wird gerechnet, nicht getextet. */
export function ohneHoeren(raetsel) {
  return raetsel.filter((r) => r.ohneHoerenLoesbar).length;
}

/** Validiert die Daten. */
export function pruefeDaten(daten) {
  const fehler = [];
  const { stuecke, raetsel, paare, stimmung, regeln, schlussIdeen } = daten ?? {};

  if (!Array.isArray(stuecke) || stuecke.length < 6) fehler.push('stuecke: mindestens 6 erwartet');
  const ids = new Set();
  for (const s of stuecke ?? []) {
    const wo = `Stück ${s.id || '?'}`;
    if (!s.id || ids.has(s.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
    ids.add(s.id);
    if (!s.name || !Array.isArray(s.melodie) || !s.melodie.length) fehler.push(`${wo}: name/melodie fehlt`);
    if (!['raetsel', 'stimmung', 'zeigen'].includes(s.zweck)) fehler.push(`${wo}: zweck muss raetsel, stimmung oder zeigen sein`);
    if (!gruppierungVon(s.schlaegeProTakt)) fehler.push(`${wo}: ${s.schlaegeProTakt} Schläge im Takt sind nicht vorgesehen`);
    if (!(s.bpm >= 40 && s.bpm <= 200)) fehler.push(`${wo}: Tempo ${s.bpm} liegt außerhalb des Vernünftigen`);
    if (!['kurz', 'gebunden'].includes(s.artikulation)) fehler.push(`${wo}: artikulation unbekannt`);
    if (!['oompah', 'oompahpah', 'liegend'].includes(s.begleitung)) fehler.push(`${wo}: begleitung unbekannt`);
    if (!['dur', 'moll'].includes(s.tonart)) fehler.push(`${wo}: tonart unbekannt`);
    for (const k of s.kategorien ?? []) {
      if (!KATEGORIEN.includes(k)) fehler.push(`${wo}: Sorte ${k} gibt es nicht`);
    }
    for (const n of s.melodie ?? []) {
      if (!n.pause && !(n.ton in TOENE)) fehler.push(`${wo}: Ton ${n.ton} steht nicht in der Tonliste`);
      if (!(n.schlaege > 0)) fehler.push(`${wo}: Note ohne Länge`);
    }
    if (s.melodie?.length && schlaegeGesamt(s) % s.schlaegeProTakt !== 0) {
      fehler.push(`${wo}: die Melodie füllt die Takte nicht auf`);
    }
    // Das Etikett muss zum Puls passen – oder eine ausgeschriebene
    // Ausnahme haben. Ein „Marsch“ im Dreiertakt kann so nur bewusst
    // und mit sichtbarer Begründung in die App kommen.
    if (!etikettPasst(s) && !s.ausnahme) {
      fehler.push(`${wo}: heißt ${s.kategorien.join('/')}, der Puls passt aber nicht dazu`);
    }
    // „Lied“ wird gerechnet, nicht behauptet.
    if (s.kategorien?.includes('lied') && !istSingbar(s)) {
      fehler.push(`${wo}: heißt Lied, ist aber nicht mitsingbar (Tonhöhe oder fehlende Atempause)`);
    }
    if (s.zweck === 'stimmung' && (s.kategorien?.length ?? 0) > 0) {
      fehler.push(`${wo}: Stimmungs-Beispiele bekommen keine Sorte angeheftet`);
    }
    // Ein Stück zum Zeigen ist genau die Überschneidung – sonst hätte es
    // keinen Grund, aus dem Rätsel herausgehalten zu werden.
    if (s.zweck === 'zeigen' && (s.kategorien?.length ?? 0) < 2) {
      fehler.push(`${wo}: zweck „zeigen“ ist für die Mischform da und braucht mindestens zwei Sorten`);
    }
    if (s.zweck === 'raetsel' && !eindeutig(s)) {
      fehler.push(`${wo}: gehört zu mehreren Sorten und kann kein Rätsel mit einer Lösung sein`);
    }
  }

  // Die Überschneidung ist Pflicht, nicht Zufall.
  if (Array.isArray(stuecke) && !stuecke.some((s) => (s.kategorien?.length ?? 0) >= 2)) {
    fehler.push('stuecke: kein Stück gehört zu zwei Sorten – die Dreiteilung wäre sauberer, als sie ist');
  }

  if (!Array.isArray(raetsel) || raetsel.length < 5) fehler.push('raetsel: mindestens 5 erwartet');
  for (const r of raetsel ?? []) {
    const wo = `Rätsel ${r.id || '?'}`;
    const s = stuecke?.find((x) => x.id === r.stueck);
    if (!s) { fehler.push(`${wo}: Stück ${r.stueck} gibt es nicht`); continue; }
    if (!eindeutig(s)) fehler.push(`${wo}: ${s.id} gehört zu mehreren Sorten und darf kein Rätsel mit einer Lösung sein`);
    if (typeof r.ohneHoerenLoesbar !== 'boolean') fehler.push(`${wo}: ohneHoerenLoesbar fehlt`);
    if (!r.erklaerung || !r.gespraech) fehler.push(`${wo}: erklaerung/gespraech fehlt`);
    else if (!r.gespraech.trim().endsWith('?')) fehler.push(`${wo}: Gesprächsimpuls soll eine Frage sein`);
    const optionen = r.optionen;
    if (!Array.isArray(optionen) || optionen.length < 2) fehler.push(`${wo}: zu wenige Antworten`);
    else if (optionen.filter((o) => o.richtig).length !== 1) fehler.push(`${wo}: genau EINE richtige Antwort`);
    else {
      // Selbstkonsistenz: die hinterlegte Lösung muss aus dem Stück folgen.
      const loesung = optionen.find((o) => o.richtig).wert;
      if (r.typ === 'muster' && loesung !== s.kategorien[0]) {
        fehler.push(`${wo}: Lösung „${loesung}“, das Stück ist aber ${s.kategorien[0]}`);
      }
      if (r.typ === 'gruppierung' && loesung !== gruppierungVon(s.schlaegeProTakt)) {
        fehler.push(`${wo}: Lösung „${loesung}“, gezählt wird aber in ${gruppierungVon(s.schlaegeProTakt)}`);
      }
      if (!['muster', 'gruppierung'].includes(r.typ)) fehler.push(`${wo}: typ ${r.typ} unbekannt`);
      // Eine nah verwandte Antwort darf als „gut gedacht“ hinterlegt
      // sein – aber nur eine angebotene, und nie die Lösung selbst.
      if (r.nachvollziehbar) {
        const treffer = optionen.find((o) => o.wert === r.nachvollziehbar);
        if (!treffer) fehler.push(`${wo}: „${r.nachvollziehbar}“ steht gar nicht zur Wahl`);
        else if (treffer.richtig) fehler.push(`${wo}: die nah verwandte Antwort ist die Lösung selbst`);
        if (!r.nachvollziehbarText) fehler.push(`${wo}: es fehlt der Text, warum die Antwort gut gedacht war`);
      }
    }
  }

  if (!Array.isArray(paare) || paare.length < 3) fehler.push('paare: mindestens 3 Vergleichspaare erwartet');
  for (const p of paare ?? []) {
    const wo = `Paar ${p.id || '?'}`;
    const a = stuecke?.find((x) => x.id === p.a);
    const b = stuecke?.find((x) => x.id === p.b);
    if (!a || !b) { fehler.push(`${wo}: ein Stück fehlt`); continue; }
    const anders = unterschiede(a, b);
    if (anders.length !== 1) {
      fehler.push(`${wo}: unterscheidet sich in ${anders.length} Merkmalen (${anders.join(', ') || 'keinem'}) – erlaubt ist genau eines`);
    } else if (anders[0] !== p.geaendert) {
      fehler.push(`${wo}: geändert wurde ${anders[0]}, angegeben ist ${p.geaendert}`);
    }
    // Nur beim Tongeschlecht darf sich die Melodie selbst ändern – dort
    // IST die Umfärbung der Unterschied. Überall sonst müssen es
    // buchstäblich dieselben Töne sein, sonst hört das Kind zwei Dinge
    // und die App schreibt eines davon der falschen Ursache zu.
    if (p.geaendert !== 'tonart' && JSON.stringify(a.melodie) !== JSON.stringify(b.melodie)) {
      fehler.push(`${wo}: die Melodie ist nicht dieselbe – dann ist es kein Vergleich von einem Merkmal`);
    }
    if (!p.wasAnders || p.wasAnders.length < 25) fehler.push(`${wo}: wasAnders fehlt oder ist zu knapp`);
  }

  if (!Array.isArray(stimmung) || stimmung.length < 3) fehler.push('stimmung: mindestens 3 Fragen erwartet');
  for (const f of stimmung ?? []) {
    const wo = `Stimmungsfrage ${f.id || '?'}`;
    if (!paare?.some((p) => p.id === f.paar)) fehler.push(`${wo}: Paar ${f.paar} gibt es nicht`);
    if (!f.frage || !f.gespraech) fehler.push(`${wo}: frage/gespraech fehlt`);
    else if (!f.gespraech.trim().endsWith('?')) fehler.push(`${wo}: Gesprächsimpuls soll eine Frage sein`);
    // Hier liegt der Kern: Gefühl hat keine richtige Antwort. Eine
    // hinterlegte Lösung wäre Scheinobjektivität – der Validator lässt
    // sie gar nicht erst durch.
    if ('korrekt' in f || (f.antworten ?? []).some((a) => 'richtig' in a)) {
      fehler.push(`${wo}: eine Stimmung ist nicht richtig oder falsch – hier darf keine Lösung stehen`);
    }
    if (!Array.isArray(f.antworten) || f.antworten.length < 2) fehler.push(`${wo}: zu wenige Antwortmöglichkeiten`);
  }

  for (const r of regeln ?? []) {
    const wo = `Regel ${r.id || '?'}`;
    if (!['regel', 'tendenz', 'meinung'].includes(r.typ)) fehler.push(`${wo}: typ muss regel, tendenz oder meinung sein`);
    if (!r.text || !r.gilt) fehler.push(`${wo}: text/gilt fehlt`);
    else if (r.gilt.length < 25) fehler.push(`${wo}: die Grenze der Regel ist zu knapp beschrieben`);
    // Ein Tempo ist nie eine Schwelle. Wer eine Zahl nennt, muss einen
    // Bereich nennen – sonst wird aus einer Neigung eine Regel.
    if (r.bpmVon || r.bpmBis) {
      if (!(r.bpmVon < r.bpmBis)) fehler.push(`${wo}: Tempo muss ein Bereich sein, keine Zahl`);
    }
    if (r.text && /\b\d+\s*(bpm|Schläge)/i.test(r.text) && !r.bpmVon) {
      fehler.push(`${wo}: nennt ein Tempo ohne Bereich`);
    }
  }
  if (!Array.isArray(regeln) || regeln.length < 3) fehler.push('regeln: mindestens 3 erwartet');

  if (!Array.isArray(schlussIdeen) || schlussIdeen.length < 3) {
    fehler.push('schlussIdeen: mindestens 3 erwartet (die Sitzung endet offline)');
  }
  return fehler;
}
