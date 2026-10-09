// Tier-Tanz-Impulse – reine Logik (ohne DOM), testbar mit node --test.
// Ko-Nutzungs-App für 3-5 und 5-7. Der ERWACHSENE bedient das Gerät,
// das Kind bewegt sich im Raum. Praleska docs/10 (Ko-Nutzung Nr. 20).
//
// Wie die anderen Apps dieses Abschnitts bewusst NICHT auf quiz-kern:
// kein Rekord, keine Punkte, keine Ränge. Hier kommt noch etwas dazu:
// Die Bewegung des Kindes wird überhaupt nicht beurteilt. Wahrheitsfähig
// ist allein die Behauptung der KARTE über das Tier.
//
// VIER TRAGENDE ENTSCHEIDUNGEN
//
// 1. Keine Karte darf eine Bewegung als Tatsache behaupten, die das Tier
//    nicht zeigt. Der Katalog nennt „Igel schleicht“ – und das ist
//    falsch: ein Igel trippelt mit der Nase am Boden, hält an und
//    schnüffelt, und dabei hört man ihn rascheln und schnaufen. Wer
//    wirklich schleicht, ist der Fuchs. Die Karte darf trotzdem gespielt
//    werden, muss aber sagen: so machen WIR es im Spiel. Darum trägt
//    jede Karte ein `geltung`:
//
//      'naturgetreu' → das Verb muss WÖRTLICH in `belegteBewegungen` des
//                      Tiers stehen, und `woran` nennt ein prüfbares
//                      Körper- oder Verhaltensmerkmal.
//      'ausgemacht'  → das Verb darf NICHT in `belegteBewegungen` stehen;
//                      der Kindertext spricht die Abmachung aus, und
//                      `wirklich` nennt die echte Bewegung.
//      'unbelebt'    → kein Absichtsverb im Kartentext (eine Flocke will
//                      nichts), und `impulsQuelle` liegt AUSSERHALB des
//                      Dings (Luft, Wind, Erwachsener): eine Schneeflocke
//                      wechselt ihre Richtung nicht selbst.
//
// 2. Die Motive sind Rhythmus, nicht Melodie: höchstens ZWEI Tonhöhen.
//    In Welle 74 war eine selbst komponierte Walzer-Melodie Note für
//    Note der Anfang von „London Bridge Is Falling Down“ – naheliegende
//    diatonische Figuren treffen bekannte Incipits genau dort, wo man es
//    nicht erwartet. Mit zwei Tonhöhen ist eine erkennbare Melodie
//    strukturell unmöglich, und für Bewegung tragen Rhythmus, Dynamik
//    und Artikulation die Qualität ohnehin vollständig.
//
// 3. Tempo und Dynamik dürfen nicht gekoppelt sein. Ein naiver Datensatz
//    macht Igel, Storch und Schneeflocke alle „langsam + leise“ – dann
//    klingen zwei Karten gleich, und das Kind lernt die falsche Regel
//    „langsam heißt leise“. Es braucht Gegenbeispiele in beide
//    Richtungen: Storchenklappern ist langsam UND deutlich,
//    Eichhörnchen-Galopp ist schnell UND leise.
//
// 4. Nie Taktgenauigkeit. Drei- bis Fünfjährige können sich nicht
//    zuverlässig auf einen äußeren Puls synchronisieren; das gelingt
//    erst allmählich und bleibt bis ins Schulalter ungenau. Eine App,
//    die den Takt verlangt oder gar anzeigt, misst ein Defizit, das die
//    Entwicklung erklärt. Verlangt wird Bewegungs-QUALITÄT.
import { mischen } from '../../packages/kinder-ui/js/komponenten.mjs';

/** Die drei Geltungsarten. */
export const GELTUNGEN = ['naturgetreu', 'ausgemacht', 'unbelebt'];

/** Höchstens so viele Karten pro Sitzung. Eine Etüde dauert 30-90 s. */
export const PRO_SESSION = 5;

/**
 * Mehr als zwei Tonhöhen wären eine Melodie – und damit ein mögliches
 * Zitat. Siehe Entscheidung 2.
 */
export const MAX_TONHOEHEN = 2;

/** Obergrenze für die Lautstärke – Kinder regeln sie nicht selbst. */
export const MAX_LAUTSTAERKE = 0.22;

/** Tonhöhen in Hertz, dieselbe Tabelle wie in apps/musik-detektive. */
export const TOENE = Object.freeze({
  G2: 98.0, C3: 130.81, D3: 146.83, E3: 164.81, G3: 196.0, A3: 220.0,
  C4: 261.63, E4: 329.63, F4: 349.23, A4: 440.0, C5: 523.25,
});

/** Absichtsverben – eine Flocke hat keine Absicht. */
const ABSICHT = /\b(will|wollte|möchte|beschließt|beschloss|entscheidet|denkt|freut sich|tanzt|sucht|versucht)\b/i;

/** Wortfeld Taktgenauigkeit. Siehe Entscheidung 4. */
const TAKT = /\b(takt|taktgenau|auf den schlag|im rhythmus mitgehen|mitzählen|abzählen|zähl mit)\b/i;

/**
 * Abzählen im Kind-Text. Die Elternseite und das GDD führen „kein Abzählen
 * („vier Schritte, dann drehen“)“ als Altersgrenze – `TAKT` konnte das nicht
 * sehen, weil dort kein Taktwort steht, sondern eine Zahl. Eine Karte sagte
 * „Hüpf dreimal und bleib dann stehen“, und das ging durch jede Prüfung.
 * Ein Drei- bis Fünfjähriger kann seine eigenen Sprünge nicht mitzählen,
 * WÄHREND er springt: er zählt, ohne zu springen, oder springt, ohne zu
 * zählen – und der Erwachsene sieht ein Kind, das es „nicht richtig“ macht.
 * `ein-` bleibt erlaubt: „einen Fuß vor den anderen“ ist kein Abzählen.
 */
const ABZAEHLEN = /(^|[^a-zäöüß])(\d|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|einmal|zweimal|dreimal|viermal)/i;

/** Seitigkeit und Einbeinstand – vor der Schule nicht verfügbar. */
const SEITE_BEIN = /(^|[^a-zäöüß])(links|rechts|linke[nrms]?|rechte[nrms]?|auf einem Bein|einbeinig)($|[^a-zäöüß])/i;

/** Nennt ein Text eine Bewegung als „so heißt das“? */
const SO_HEISST_DAS = /\b(?:nennt man|nennen Jäger|heißt|sagt man dazu)\s+([a-zäöüß]+)/gi;

/** Tempo-Wörter, wie sie über eine Karte behauptet werden können. */
const TEMPO_WORT = /(^|[^a-zäöüß])(nicht\s+)?(langsam|mittelschnell|schnell)($|[^a-zäöüß])/gi;
/** Selbstbezug: „hier“, „diese Karte“, „das hier“. */
const SELBSTBEZUG = /\b(hier|diese|dieses|dieser)\b/i;

/** Felder, die eine Bewertung einführen würden. */
const BEWERTUNG = ['richtig', 'korrekt', 'punkte', 'note', 'stern', 'sterne', 'rang', 'bewertung', 'score'];

/** Ein Tier holen. */
export function tierVon(daten, id) {
  return (daten?.tiere ?? []).find((t) => t.id === id) ?? null;
}

/** Eine Karte holen. */
export function karteVon(daten, id) {
  return (daten?.karten ?? []).find((k) => k.id === id) ?? null;
}

/** Ist das Verb der Karte für dieses Tier belegt? */
export function istBelegt(daten, karte) {
  const tier = tierVon(daten, karte?.tier);
  if (!tier) return false;
  return (tier.belegteBewegungen ?? []).includes(karte?.verb);
}

/** Der Kindertext einer Karte – je Geltung ein anderes Feld. */
export function kindTextVon(karte) {
  if (!karte) return '';
  if (karte.geltung === 'naturgetreu') return karte.woran ?? '';
  return karte.kindText ?? '';
}

/** Die Karten einer Jahreszeit. */
export function karten(daten, jahreszeit) {
  return (daten?.karten ?? []).filter((k) => (k.jahreszeit ?? []).includes(jahreszeit));
}

/** Bis zu `limit` Karten der Jahreszeit, gemischt und ohne Dubletten. */
export function waehleKarten(daten, jahreszeit, limit = PRO_SESSION) {
  return mischen(karten(daten, jahreszeit)).slice(0, limit);
}

/** Die Hertz-Folge eines Motivs – Rhythmus auf ein oder zwei Tönen. */
export function motivHertz(karte) {
  return (karte?.motiv?.tonhoehen ?? []).map((n) => TOENE[n] ?? NaN);
}

/**
 * Der Zeitplan eines Motivs: pro Schlag ein Eintrag mit Sekunde,
 * Tonhöhe und Stärke. Ton und sichtbarer Puls kommen aus derselben
 * Quelle – sie können nicht auseinanderlaufen.
 */
export function zeitplan(daten, karte, runden = 2) {
  const tempo = (daten?.tempi ?? []).find((t) => t.id === karte?.tempo);
  const dyn = (daten?.dynamiken ?? []).find((d) => d.id === karte?.dynamik);
  const hertz = motivHertz(karte);
  const muster = karte?.motiv?.muster ?? [];
  if (!tempo || !dyn || !hertz.length || !muster.length) return [];
  const schlag = 60 / tempo.bpm;
  const plan = [];
  for (let r = 0; r < runden; r++) {
    muster.forEach((an, i) => {
      if (!an) return;
      plan.push({
        zeit: (r * muster.length + i) * schlag,
        hertz: hertz[i % hertz.length],
        staerke: Math.min(dyn.staerke, 1) * MAX_LAUTSTAERKE,
        dauer: karte.artikulation === 'gebunden' ? schlag * 0.95 : schlag * 0.45,
      });
    });
  }
  return plan;
}

/** Gibt es eine Karte mit dieser Tempo/Dynamik-Kombination? */
export function hatKombination(daten, tempo, dynamik) {
  return (daten?.karten ?? []).some((k) => k.tempo === tempo && k.dynamik === dynamik);
}

/**
 * Validiert die Daten. Alle vier tragenden Regeln stehen hier und nicht
 * in der Redaktion.
 */
export function pruefeDaten(daten) {
  const fehler = [];

  for (const [feld, muster, was] of [
    ['ehrlichkeit', /bewertet nichts/, 'die App muss sagen, dass sie die Bewegung nicht bewertet'],
    ['ohneTon', /ohne Ton/, 'die App muss sagen, dass sie ohne Ton vollständig geht'],
    ['keineMelodie', /Rhythmus, nicht Melodie/, 'die App muss sagen, warum die Motive keine Melodie sind'],
  ]) {
    if (!muster.test(daten?.[feld] ?? '')) fehler.push(`${feld}: ${was}`);
  }

  const tempoIds = new Set((daten?.tempi ?? []).map((t) => t.id));
  const dynIds = new Set((daten?.dynamiken ?? []).map((d) => d.id));
  const artIds = new Set((daten?.artikulationen ?? []).map((a) => a.id));
  const ortIds = new Set((daten?.orte ?? []).map((o) => o.id));
  const jzIds = new Set((daten?.jahreszeiten ?? []).map((j) => j.id));
  if (tempoIds.size < 3) fehler.push('tempi: mindestens 3 erwartet');
  if (dynIds.size < 3) fehler.push('dynamiken: mindestens 3 erwartet');
  if (artIds.size < 2) fehler.push('artikulationen: mindestens 2 erwartet');
  if (jzIds.size !== 4) fehler.push('jahreszeiten: genau 4 erwartet');
  // `staerke` ist ein ANTEIL des erlaubten Deckels (0 < s <= 1), nicht der
  // Deckel selbst. Der Deckel liegt EINMAL, im Master-Gain der App
  // (MAX_LAUTSTAERKE). Stand hier derselbe Wert als Obergrenze, wurde er
  // zweimal angewandt: 0,2 * 0,22 = 0,044 Spitze, ein Viertel dessen, was
  // apps/musik-detektive mit demselben Deckel ausgibt – fuer eine App, die
  // quer durch ein Zimmer hoerbar sein muss, zu leise.
  for (const d of daten?.dynamiken ?? []) {
    if (!(d.staerke > 0) || d.staerke > 1) {
      fehler.push(`dynamik ${d.id}: staerke muss zwischen 0 und 1 liegen (Anteil des Deckels)`);
    }
  }

  const tierIds = new Set();
  for (const t of daten?.tiere ?? []) {
    const wo = `Tier ${t.id || '?'}`;
    if (!t.id || tierIds.has(t.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
    tierIds.add(t.id);
    if (!t.name || !t.zeichen) fehler.push(`${wo}: name/zeichen fehlt`);
    if (!Array.isArray(t.belegteBewegungen) || t.belegteBewegungen.length < 2) {
      fehler.push(`${wo}: mindestens 2 belegte Bewegungen erwartet`);
    }
    // Für manche Tiere gibt es kein Zeichen – dann zeigt das Zeichen die
    // BEWEGUNG, und das muss dastehen. Ein Flamingo-Zeichen für einen
    // Storch wäre ein anderes Tier.
    if (!['tier', 'bewegung'].includes(t.zeichenArt)) fehler.push(`${wo}: zeichenArt muss tier oder bewegung sein`);
    if (t.zeichenArt === 'bewegung' && !t.zeichenGrund) {
      fehler.push(`${wo}: zeichenGrund fehlt – warum zeigt das Zeichen nicht das Tier?`);
    }
  }

  const karten = daten?.karten;
  if (!Array.isArray(karten) || karten.length < 8) fehler.push('karten: mindestens 8 erwartet');
  const ids = new Set();
  const gesehen = new Map();
  for (const k of karten ?? []) {
    const wo = `Karte ${k.id || '?'}`;
    if (!k.id || ids.has(k.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
    ids.add(k.id);
    if (!GELTUNGEN.includes(k.geltung)) fehler.push(`${wo}: geltung muss ${GELTUNGEN.join(' | ')} sein`);
    if (!k.titel || !k.zeichen || !k.verb) fehler.push(`${wo}: titel/zeichen/verb fehlt`);
    if (!tempoIds.has(k.tempo)) fehler.push(`${wo}: tempo ${k.tempo} unbekannt`);
    if (!dynIds.has(k.dynamik)) fehler.push(`${wo}: dynamik ${k.dynamik} unbekannt`);
    if (!artIds.has(k.artikulation)) fehler.push(`${wo}: artikulation ${k.artikulation} unbekannt`);
    // Renn-Etüden gehören nach draußen – jede Karte sagt, wo sie geht.
    if (!ortIds.has(k.ort)) fehler.push(`${wo}: ort ${k.ort} unbekannt`);
    if (!Array.isArray(k.jahreszeit) || !k.jahreszeit.length) fehler.push(`${wo}: jahreszeit fehlt`);
    for (const j of k.jahreszeit ?? []) if (!jzIds.has(j)) fehler.push(`${wo}: jahreszeit ${j} unbekannt`);
    // Die App muss ohne Ton vollständig gehen.
    if (!k.wortImpuls || !k.klatschImpuls) fehler.push(`${wo}: wortImpuls/klatschImpuls fehlt – die App muss ohne Ton gehen`);
    if (!k.erwachsenenHinweis) fehler.push(`${wo}: erwachsenenHinweis fehlt`);
    // Nur EINE Anweisung pro Karte: Drei- bis Fünfjährige halten eine.
    const auftrag = String(k.bewegungsAuftrag ?? '');
    if (!auftrag) fehler.push(`${wo}: bewegungsAuftrag fehlt`);
    else if ((auftrag.match(/[.!?]/g) ?? []).length !== 1) {
      fehler.push(`${wo}: bewegungsAuftrag muss genau EIN Satz sein – mehr hält dieses Alter nicht`);
    }

    // Regel 1.
    if (k.geltung === 'naturgetreu') {
      if (!tierIds.has(k.tier)) fehler.push(`${wo}: tier ${k.tier} unbekannt`);
      else if (!istBelegt(daten, k)) {
        fehler.push(`${wo}: „${k.verb}“ steht nicht in den belegten Bewegungen von ${k.tier} – dann ist die Karte keine Beobachtung`);
      }
      if (!k.woran) fehler.push(`${wo}: woran fehlt – naturgetreu braucht ein prüfbares Merkmal`);
      if (k.wirklich) fehler.push(`${wo}: wirklich gehört nur zu einer ausgemachten Karte`);
      // Das `woran` muss zu DIESEM Verb gehören. Die Fuchs-Karte hieß „Der
      // Fuchs schleicht“, ihr `woran` beschrieb aber das Schnüren – den
      // ruhigen Trab mit Tritten in einer Linie – und sagte selbst „er ist
      // dabei zügig unterwegs, nicht langsam“. Beide Bewegungen stehen
      // getrennt in `belegteBewegungen`, die bisherige Prüfung sah nur, dass
      // das Verb irgendwo in der Liste steht. Sagt der Text „das nennt man
      // X“ und X ist eine ANDERE belegte Bewegung, zeigt die Karte das
      // falsche Merkmal unter der Überschrift „So macht das Tier es
      // wirklich“.
      const belegte = (tierVon(daten, k.tier)?.belegteBewegungen ?? []).map((b) => String(b));
      for (const m of String(k.woran ?? '').matchAll(SO_HEISST_DAS)) {
        const genannt = m[1].toLowerCase();
        const treffer = belegte.find((b) => b.toLowerCase() === genannt);
        if (treffer && treffer !== k.verb) {
          fehler.push(`${wo}: woran beschreibt „${treffer}“, die Karte heißt aber „${k.verb}“ – das sind zwei Bewegungen`);
        }
      }
    } else if (k.geltung === 'ausgemacht') {
      if (!tierIds.has(k.tier)) fehler.push(`${wo}: tier ${k.tier} unbekannt`);
      else if (istBelegt(daten, k)) {
        fehler.push(`${wo}: „${k.verb}“ IST für ${k.tier} belegt – dann ist es keine Abmachung, sondern naturgetreu`);
      }
      if (!/machen wir aus|im Spiel/i.test(k.kindText ?? '')) {
        fehler.push(`${wo}: der Kindertext muss die Abmachung aussprechen („im Spiel“ / „machen wir aus“)`);
      }
      if (!k.wirklich) fehler.push(`${wo}: wirklich fehlt – die echte Bewegung muss dastehen`);
      if (k.woran) fehler.push(`${wo}: woran gehört nur zu einer naturgetreuen Karte`);
    } else if (k.geltung === 'unbelebt') {
      if (k.tier) fehler.push(`${wo}: eine unbelebte Figur hat kein Tier`);
      if (!k.figur) fehler.push(`${wo}: figur fehlt`);
      if (!['luft', 'wind', 'erwachsener'].includes(k.impulsQuelle)) {
        fehler.push(`${wo}: impulsQuelle muss luft, wind oder erwachsener sein – die Figur bewegt sich nicht selbst`);
      }
      const text = `${k.kindText ?? ''} ${k.titel ?? ''}`;
      if (ABSICHT.test(text)) fehler.push(`${wo}: Absichtsverb im Kindertext – eine Flocke will nichts`);
      if (k.woran || k.wirklich) fehler.push(`${wo}: woran/wirklich gehören nicht zu einer unbelebten Figur`);
    }

    // Regel 2.
    const hoehen = k.motiv?.tonhoehen;
    if (!Array.isArray(hoehen) || !hoehen.length) fehler.push(`${wo}: motiv.tonhoehen fehlt`);
    else {
      if (new Set(hoehen).size > MAX_TONHOEHEN) {
        fehler.push(`${wo}: ${new Set(hoehen).size} Tonhöhen – mehr als ${MAX_TONHOEHEN} wäre eine Melodie und damit ein mögliches Zitat`);
      }
      for (const n of hoehen) if (!(n in TOENE)) fehler.push(`${wo}: Ton ${n} steht nicht in der Tabelle`);
    }
    const muster = k.motiv?.muster;
    if (!Array.isArray(muster) || muster.length < 2) fehler.push(`${wo}: motiv.muster braucht mindestens 2 Schläge`);
    else if (!muster.some(Boolean)) fehler.push(`${wo}: motiv.muster ist stumm`);
    // Zwei Karten dürfen nicht gleich klingen – sonst kann das Kind sie
    // nicht unterscheiden. Die Tonhöhe zählt dabei mit: hoch gegen tief
    // ist für dieses Alter der deutlichste Unterschied überhaupt (darauf
    // baut apps/klang-detektive). Sie muss dann aber WIRKLICH weit
    // auseinanderliegen – ein Ganzton reicht nicht.
    const schluessel = `${k.tempo}/${k.dynamik}/${k.artikulation}/${JSON.stringify(muster)}`;
    const tiefster = Math.min(...motivHertz(k).filter((h) => h > 0));
    const andere = gesehen.get(schluessel);
    if (andere !== undefined) {
      const abstand = Math.max(tiefster, andere) / Math.min(tiefster, andere);
      if (!(abstand >= 1.4)) {
        fehler.push(`${wo}: klingt wie eine andere Karte – gleiches Tempo, gleiche Dynamik, gleiche Artikulation, gleiches Muster und nur ${abstand.toFixed(2)}-fache Tonhöhe. Unterscheidbar wird es erst ab einer Quinte.`);
      }
    } else {
      gesehen.set(schluessel, tiefster);
    }

    // Regel 4 und das Bewertungsverbot.
    const alles = JSON.stringify(k);
    if (TAKT.test(alles)) fehler.push(`${wo}: verlangt Taktgenauigkeit – das kann dieses Alter nicht`);
    for (const feld of BEWERTUNG) if (feld in k) fehler.push(`${wo}: Feld ${feld} – die Bewegung des Kindes wird nicht bewertet`);

    // Die übrigen Altersgrenzen der Elternseite – bisher stand nur die
    // Taktgrenze im Code, die anderen drei standen nur im Text. Geprüft wird
    // auf den Feldern, die dem KIND vorgelesen werden; `klatschImpuls` ist
    // eine Anweisung an den Erwachsenen und darf eine Zahl nennen.
    for (const feld of ['bewegungsAuftrag', 'kindText', 'wortImpuls', 'titel']) {
      const text = String(k[feld] ?? '');
      if (!text) continue;
      if (ABZAEHLEN.test(text)) {
        fehler.push(`${wo}.${feld}: verlangt Abzählen – ein Kind dieses Alters zählt oder bewegt sich, nicht beides`);
      }
      if (SEITE_BEIN.test(text)) {
        fehler.push(`${wo}.${feld}: nennt Seite oder Einbeinstand – vor der Schule nicht verfügbar`);
      }
    }

    // Behauptet der Hinweis ein Tempo ÜBER DIESE KARTE, muss es stimmen.
    // Ein Hinweis sagte „Laut und langsam gehören hier zusammen“ auf einer
    // mittelschnellen Karte, und `karteBildschirm` zeigt zwei Zeilen darüber
    // „mittelschnell“. Zitate in „…“ sind angeführte Redewendungen und keine
    // Aussage über die Karte, darum fallen sie vorher weg. Ohne Selbstbezug
    // bleibt ein Vergleich erlaubt („schwerer als schnell“).
    const hinweis = String(k.erwachsenenHinweis ?? '').replace(/„[^“]*“/g, ' ');
    for (const m of hinweis.matchAll(TEMPO_WORT)) {
      const verneint = Boolean(m[2]);
      const genannt = m[3] === 'mittelschnell' ? 'mittel' : m[3];
      const umfeld = hinweis.slice(Math.max(0, m.index - 40), m.index + 40);
      if (!SELBSTBEZUG.test(umfeld)) continue;
      if (!verneint && genannt !== k.tempo) {
        fehler.push(`${wo}: der Hinweis nennt „${m[3]}“ für diese Karte, sie ist aber ${k.tempo}`);
      }
      if (verneint && genannt === k.tempo) {
        fehler.push(`${wo}: der Hinweis verneint „${m[3]}“, genau das ist aber das Tempo der Karte`);
      }
    }
  }

  // Regel 1, zweite Hälfte: alle drei Geltungsarten müssen vorkommen –
  // insbesondere mindestens eine ausgemachte, sonst behauptet die App
  // eine Naturtreue, die sie nicht hat.
  for (const g of GELTUNGEN) {
    if (!(karten ?? []).some((k) => k.geltung === g)) {
      fehler.push(`keine Karte der Geltung ${g}${g === 'ausgemacht' ? ' – dann behauptet die App durchweg Naturtreue' : ''}`);
    }
  }

  // Regel 3.
  if (!hatKombination(daten, 'langsam', 'laut')) {
    fehler.push('keine Karte ist langsam UND deutlich – dann lernt das Kind „langsam heißt leise“');
  }
  if (!hatKombination(daten, 'schnell', 'leise')) {
    fehler.push('keine Karte ist schnell UND leise – dann lernt das Kind „schnell heißt laut“');
  }

  // Jede Jahreszeit muss ein spielbares Deck haben, und keine darf
  // einförmig sein. (Der Igel fehlt im Winter von sich aus: er hält
  // Winterschlaf, und ein Igel im Schnee ist ein Notfall, kein Winterbild.)
  for (const j of jzIds) {
    const deck = (karten ?? []).filter((k) => (k.jahreszeit ?? []).includes(j));
    if (deck.length < 3) fehler.push(`jahreszeit ${j}: nur ${deck.length} Karten – zu wenig für eine Sitzung`);
    if (new Set(deck.map((k) => k.tempo)).size < 2) fehler.push(`jahreszeit ${j}: nur ein Tempo`);
    if (new Set(deck.map((k) => k.dynamik)).size < 2) fehler.push(`jahreszeit ${j}: nur eine Dynamik`);
  }

  if (!Array.isArray(daten?.schlussIdeen) || daten.schlussIdeen.length < 3) {
    fehler.push('schlussIdeen: mindestens 3 erwartet');
  }
  // Offline heißt beobachten, nicht sammeln: Igel sind besonders
  // geschützt, und eine App, die zum Suchen und Anfassen motiviert,
  // richtet echten Schaden an.
  for (const i of daten?.schlussIdeen ?? []) {
    if (/\b(sammel|fütter|aufheben|fangen|streicheln)/i.test(i)) {
      fehler.push(`schlussidee „${i.slice(0, 40)}…“: Tiere werden beobachtet, nicht angefasst`);
    }
  }
  if (!Array.isArray(daten?.sicherheit) || daten.sicherheit.length < 8) {
    fehler.push('sicherheit: mindestens 8 Hinweise erwartet (Bewegung im Raum, echte Tiere)');
  }
  return fehler;
}
