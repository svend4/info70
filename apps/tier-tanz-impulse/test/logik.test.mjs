import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  GELTUNGEN, PRO_SESSION, MAX_TONHOEHEN, MAX_LAUTSTAERKE, TOENE,
  tierVon, karteVon, istBelegt, kindTextVon, karten, waehleKarten,
  motivHertz, zeitplan, hatKombination, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/karten.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const kinderCss = await readFile(new URL('../../../packages/kinder-ui/css/kinder.css', import.meta.url), 'utf8');

test('Daten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.karten.length >= 8);
  assert.equal(daten.jahreszeiten.length, 4);
});

test('„Igel schleicht“ ist eine Spielabmachung, keine Beobachtung', () => {
  // Das ist der zentrale Sachfehler, den die Katalogzeile anlegt: Igel
  // schleichen nicht. Sie trippeln mit der Nase am Boden, halten an und
  // schnüffeln – und dabei hört man sie rascheln und schnaufen. Wer
  // wirklich schleicht, ist der Fuchs.
  const igel = karteVon(daten, 'k-igel-schleicht');
  assert.equal(igel.geltung, 'ausgemacht');
  assert.equal(istBelegt(daten, igel), false, '„schleichen“ darf für den Igel nicht belegt sein');
  assert.deepEqual(tierVon(daten, 'igel').belegteBewegungen, ['trippeln', 'schnüffeln', 'einrollen', 'laufen']);
  assert.match(igel.kindText, /im Spiel|machen wir aus/);
  assert.match(igel.wirklich, /trippelt/);
  // Der Fuchs KANN schleichen – das sagt die Igel-Karte, und es ist belegt.
  assert.match(igel.wirklich, /Fuchs/);
  assert.ok(tierVon(daten, 'fuchs').belegteBewegungen.includes('schleichen'));
  // Die Fuchs-Karte im Deck zeigt aber eine ANDERE belegte Bewegung: das
  // Schnüren, den ruhigen Trab mit Tritten in einer Linie. Sie hieß zuerst
  // „Der Fuchs schleicht“, ihr `woran` beschrieb jedoch das Schnüren und
  // sagte selbst „zügig unterwegs, nicht langsam“ – also stand das falsche
  // Merkmal unter „So macht das Tier es wirklich“.
  const fuchs = karteVon(daten, 'k-fuchs-schnuert');
  assert.equal(fuchs.geltung, 'naturgetreu');
  assert.equal(fuchs.verb, 'schnüren');
  assert.match(fuchs.titel, /schnürt/);
  assert.equal(istBelegt(daten, fuchs), true);

  // Gegenprobe in BEIDE Richtungen: „schleichen“ in die Igel-Belege
  // eintragen muss fehlschlagen …
  const belegt = kopie();
  tierVon(belegt, 'igel').belegteBewegungen.push('schleichen');
  assert.ok(pruefeDaten(belegt).some((f) => /IST für igel belegt/.test(f)));
  // … und ein naturgetreues Verb aus den Belegen entfernen auch.
  const entfernt = kopie();
  const t = tierVon(entfernt, 'fuchs');
  t.belegteBewegungen = t.belegteBewegungen.filter((v) => v !== 'schnüren');
  assert.ok(pruefeDaten(entfernt).some((f) => /steht nicht in den belegten Bewegungen/.test(f)));
  // … und das Verb auf eine andere belegte Bewegung umzuhängen, während das
  // `woran` beim Schnüren bleibt, muss auffallen.
  const verdreht = kopie();
  const fv = karteVon(verdreht, 'k-fuchs-schnuert');
  fv.verb = 'schleichen';
  assert.ok(pruefeDaten(verdreht).some((f) => /zwei Bewegungen/.test(f)));
});

test('alle drei Geltungsarten kommen vor – besonders die ausgemachte', () => {
  for (const g of GELTUNGEN) {
    assert.ok(daten.karten.some((k) => k.geltung === g), `keine Karte der Geltung ${g}`);
  }
  const ohne = kopie();
  ohne.karten = ohne.karten.filter((k) => k.geltung !== 'ausgemacht');
  const f = pruefeDaten(ohne);
  assert.ok(f.some((x) => /durchweg Naturtreue/.test(x)), f.join(' | '));
  // Die Geltung steht in der App VOR dem Text der Karte.
  assert.match(app, /So macht das Tier es wirklich/);
  assert.match(app, /Das machen wir im Spiel so aus/);
  assert.match(app, /Das bewegt sich nicht selbst/);
});

test('naturgetreue Karten nennen ein prüfbares Merkmal', () => {
  for (const k of daten.karten.filter((x) => x.geltung === 'naturgetreu')) {
    assert.ok(k.woran, `${k.id}: woran fehlt`);
    assert.ok(k.woran.length >= 50, `${k.id}: woran zu knapp`);
    assert.equal(k.wirklich, undefined, `${k.id}: wirklich gehört zur ausgemachten Karte`);
    assert.ok(istBelegt(daten, k), k.id);
  }
  const ohne = kopie();
  delete ohne.karten.find((k) => k.id === 'k-storch-schreitet').woran;
  assert.ok(pruefeDaten(ohne).some((f) => /naturgetreu braucht ein prüfbares Merkmal/.test(f)));
  // Der Storch klappert, er singt nicht – und er segelt, er flattert nicht.
  assert.match(karteVon(daten, 'k-storch-klappert').woran, /singt nicht/);
  assert.match(karteVon(daten, 'k-storch-klappert').woran, /Schnabel/);
});

test('unbelebte Figuren haben keine Absicht und bekommen den Anstoß von außen', () => {
  // Eine Schneeflocke bewegt sich nicht selbst: sie taumelt, weil ihre
  // Form sie kippen lässt, und driftet, weil Luft sie trägt – im Aufwind
  // auch nach oben. Der Richtungswechsel kommt von AUSSEN.
  const unbelebt = daten.karten.filter((k) => k.geltung === 'unbelebt');
  assert.ok(unbelebt.length >= 2);
  for (const k of unbelebt) {
    assert.ok(['luft', 'wind', 'erwachsener'].includes(k.impulsQuelle), k.id);
    assert.ok(k.figur, `${k.id}: figur fehlt`);
    assert.equal(k.tier, undefined, `${k.id}: unbelebt mit Tier`);
    assert.doesNotMatch(k.kindText, /\b(will|möchte|beschließt|tanzt|sucht)\b/i, k.id);
  }
  assert.match(karteVon(daten, 'k-schneeflocke').kindText, /Luft trägt/);
  assert.match(karteVon(daten, 'k-schneeflocke').kindText, /nach oben/);
  const absicht = kopie();
  absicht.karten.find((k) => k.id === 'k-schneeflocke').kindText = 'Die Flocke tanzt im Kreis.';
  assert.ok(pruefeDaten(absicht).some((f) => /Absichtsverb/.test(f)));
  const selbst = kopie();
  selbst.karten.find((k) => k.id === 'k-schneeflocke').impulsQuelle = 'flocke';
  assert.ok(pruefeDaten(selbst).some((f) => /bewegt sich nicht selbst/.test(f)));
});

test('die Motive sind Rhythmus, nicht Melodie – höchstens zwei Tonhöhen', () => {
  // In Welle 74 war eine selbst komponierte Walzer-Melodie Note für Note
  // der Anfang von „London Bridge Is Falling Down“. Mit zwei Tonhöhen ist
  // eine erkennbare Melodie strukturell unmöglich.
  assert.equal(MAX_TONHOEHEN, 2);
  for (const k of daten.karten) {
    const hoehen = new Set(k.motiv.tonhoehen);
    assert.ok(hoehen.size <= MAX_TONHOEHEN, `${k.id}: ${hoehen.size} Tonhöhen`);
    for (const n of hoehen) assert.ok(n in TOENE, `${k.id}: Ton ${n}`);
    assert.ok(k.motiv.muster.length >= 2, k.id);
    assert.ok(k.motiv.muster.some(Boolean), `${k.id}: stummes Muster`);
    assert.ok(motivHertz(k).every((h) => h > 0), k.id);
  }
  const melodie = kopie();
  melodie.karten[0].motiv.tonhoehen = ['C4', 'D4', 'E4'];
  const f = pruefeDaten(melodie);
  assert.ok(f.some((x) => /wäre eine Melodie und damit ein mögliches Zitat/.test(x)), f.join(' | '));
  // Und die App sagt es selbst.
  assert.match(daten.keineMelodie, /Rhythmus, nicht Melodie/);
});

test('Tempo und Dynamik sind NICHT gekoppelt', () => {
  // Ein naiver Datensatz macht Igel, Storch und Schneeflocke alle
  // „langsam + leise“ – dann lernt das Kind „langsam heißt leise“.
  assert.ok(hatKombination(daten, 'langsam', 'laut'), 'kein langsames lautes Gegenbeispiel');
  assert.ok(hatKombination(daten, 'schnell', 'leise'), 'kein schnelles leises Gegenbeispiel');
  assert.equal(karteVon(daten, 'k-storch-klappert').tempo, 'langsam');
  assert.equal(karteVon(daten, 'k-storch-klappert').dynamik, 'laut');
  assert.equal(karteVon(daten, 'k-eichhoernchen-galoppiert').tempo, 'schnell');
  assert.equal(karteVon(daten, 'k-eichhoernchen-galoppiert').dynamik, 'leise');

  const gekoppelt = kopie();
  for (const k of gekoppelt.karten) k.dynamik = k.tempo === 'schnell' ? 'laut' : 'leise';
  const f = pruefeDaten(gekoppelt);
  assert.ok(f.some((x) => /langsam heißt leise/.test(x)), f.join(' | '));
  assert.ok(f.some((x) => /schnell heißt laut/.test(x)));
});

test('zwei Karten dürfen nicht gleich klingen', () => {
  const schluessel = daten.karten.map((k) =>
    `${k.tempo}/${k.dynamik}/${k.artikulation}/${JSON.stringify(k.motiv.muster)}/${[...new Set(k.motiv.tonhoehen)].sort().join()}`);
  assert.equal(new Set(schluessel).size, schluessel.length, 'zwei Karten mit identischem Klang');
  // Dieselbe Kombination mit nur einem Ganzton Abstand ist nicht
  // unterscheidbar – erst ab einer Quinte.
  const nah = kopie();
  nah.karten.find((k) => k.id === 'k-schneeflocke').motiv.tonhoehen = ['C3'];
  const f = pruefeDaten(nah);
  assert.ok(f.some((x) => /klingt wie eine andere Karte/.test(x)), f.join(' | '));
  // Schnecke und Schneeflocke teilen alles außer der Tonhöhe – und die
  // liegt mehr als zwei Oktaven auseinander.
  const tief = TOENE[karteVon(daten, 'k-schnecke-kriecht').motiv.tonhoehen[0]];
  const hoch = TOENE[karteVon(daten, 'k-schneeflocke').motiv.tonhoehen[0]];
  assert.ok(hoch / tief >= 1.4, `${hoch / tief}`);
});

test('nie Taktgenauigkeit – und keine Bewertung des Kindes', () => {
  // Drei- bis Fünfjährige können sich nicht zuverlässig auf einen äußeren
  // Puls synchronisieren. Eine App, die den Takt verlangt oder anzeigt,
  // misst ein Defizit, das die Entwicklung erklärt.
  const alles = JSON.stringify(daten);
  assert.doesNotMatch(alles, /\btakt\b|auf den Schlag|mitzählen|abzählen/i);
  // Gesucht sind BEWERTUNGEN, nicht das Wort. „nicht richtig oder falsch“
  // ist die Zusage der App selbst, und „richtig laut“ heißt sehr laut –
  // ein stumpfes includes() würde beide fälschlich melden (derselbe
  // Fehlertyp wie „Anhaltspunkte“ in Welle 73).
  for (const wort of ['punkte', 'rekord', 'sternchen', 'belohnung', 'gewonnen', 'verloren', 'besser als']) {
    assert.ok(!alles.toLowerCase().includes(wort), `unerwünschtes Wort: ${wort}`);
  }
  for (const feld of ['"richtig"', '"korrekt"', '"punkte"', '"note"', '"rang"', '"stern"']) {
    assert.ok(!alles.includes(feld), `Bewertungsfeld: ${feld}`);
  }
  assert.doesNotMatch(alles, /das war richtig|hast du richtig|ist richtig gemacht|gut gemacht/i);
  // Und wo „richtig“ vorkommt, ist es die Zusage oder ein Verstärker.
  assert.match(daten.ehrlichkeit, /nicht richtig oder falsch/);
  const takt = kopie();
  takt.karten[0].bewegungsAuftrag = 'Geh im Takt mit.';
  assert.ok(pruefeDaten(takt).some((f) => /Taktgenauigkeit/.test(f)));
  const bewertet = kopie();
  bewertet.karten[0].punkte = 3;
  assert.ok(pruefeDaten(bewertet).some((f) => /wird nicht bewertet/.test(f)));
  assert.match(daten.ehrlichkeit, /bewertet nichts/);
  // Die App zeigt keinen Fortschritt am Kind und speichert nichts.
  assert.doesNotMatch(app, /localStorage/);
});

test('genau EIN Bewegungsauftrag pro Karte', () => {
  // „Schleiche leise, Arme oben, und bleib beim vierten Schlag stehen“
  // sind drei Aufgaben; dieses Alter hält eine.
  for (const k of daten.karten) {
    assert.equal((k.bewegungsAuftrag.match(/[.!?]/g) ?? []).length, 1, `${k.id}: ${k.bewegungsAuftrag}`);
    assert.ok(k.bewegungsAuftrag.length <= 70, `${k.id}: zu lang`);
  }
  const drei = kopie();
  drei.karten[0].bewegungsAuftrag = 'Schleich leise. Arme hoch. Dann halt an.';
  assert.ok(pruefeDaten(drei).some((f) => /genau EIN Satz/.test(f)));
});

test('die App geht vollständig ohne Ton', () => {
  // Schlafendes Geschwisterkind, gehörlose Familie, Rücksicht auf
  // Nachbarn: der stille Weg ist gleichwertig, nicht der Notfall.
  for (const k of daten.karten) {
    assert.ok(k.wortImpuls, `${k.id}: wortImpuls fehlt`);
    assert.ok(k.klatschImpuls, `${k.id}: klatschImpuls fehlt`);
  }
  const ohne = kopie();
  delete ohne.karten[0].klatschImpuls;
  assert.ok(pruefeDaten(ohne).some((f) => /muss ohne Ton gehen/.test(f)));
  assert.match(daten.ohneTon, /ohne Ton/);
  // Der stille Knopf steht gleich groß und zuerst.
  assert.match(app, /Ohne Ton – ich spreche und klatsche/);
  assert.ok(app.indexOf('Ohne Ton') < app.indexOf('🔊 Mit Ton'), 'der stille Weg steht nicht zuerst');
  // Und der sichtbare Puls läuft auch ohne Ton.
  assert.match(app, /Er läuft auch ohne Ton/);
});

test('eine Jahreszeit pro Sitzung – im Winter schläft der Igel', () => {
  const igel = karteVon(daten, 'k-igel-schleicht');
  assert.equal(igel.jahreszeit.includes('winter'), false, 'Igel im Winter-Deck');
  assert.equal(karten(daten, 'winter').some((k) => k.tier === 'igel'), false);
  assert.ok(karten(daten, 'winter').some((k) => k.id === 'k-schneeflocke'));
  assert.equal(karten(daten, 'sommer').some((k) => k.id === 'k-schneeflocke'), false);
  for (const j of daten.jahreszeiten) {
    const deck = karten(daten, j.id);
    assert.ok(deck.length >= 3, `${j.id}: nur ${deck.length} Karten`);
    assert.ok(new Set(deck.map((k) => k.tempo)).size >= 2, `${j.id}: nur ein Tempo`);
    assert.ok(new Set(deck.map((k) => k.dynamik)).size >= 2, `${j.id}: nur eine Dynamik`);
  }
  const duenn = kopie();
  for (const k of duenn.karten) k.jahreszeit = ['sommer'];
  assert.ok(pruefeDaten(duenn).some((f) => /zu wenig für eine Sitzung/.test(f)));
  // Eichhörnchen halten keinen Winterschlaf – die Karte sagt es.
  assert.match(karteVon(daten, 'k-eichhoernchen-galoppiert').erwachsenenHinweis, /keinen Winterschlaf/);
});

test('jede Karte sagt, wo sie geht', () => {
  // Renn-Etüden gehören nach draußen; drinnen führen sie zu
  // Zusammenstößen und Wandkontakt.
  const orte = new Set(daten.orte.map((o) => o.id));
  for (const k of daten.karten) assert.ok(orte.has(k.ort), `${k.id}: ort ${k.ort}`);
  assert.ok(daten.karten.some((k) => k.ort === 'am-platz'), 'keine Karte für das kleinste Zimmer');
  const falsch = kopie();
  falsch.karten[0].ort = 'mondlandschaft';
  assert.ok(pruefeDaten(falsch).some((f) => /ort mondlandschaft unbekannt/.test(f)));
});

test('für den Storch gibt es kein Zeichen – und das steht dabei', () => {
  // 🦩 wäre ein Flamingo, also ein anderes Tier. Dieselbe Linie wie die
  // Bebilderungs-Regel in apps/woerter-sortierer.
  const storch = tierVon(daten, 'storch');
  assert.equal(storch.zeichenArt, 'bewegung');
  assert.match(storch.zeichenGrund, /Flamingo/);
  for (const t of daten.tiere) {
    assert.ok(['tier', 'bewegung'].includes(t.zeichenArt), t.id);
    if (t.zeichenArt === 'bewegung') assert.ok(t.zeichenGrund, t.id);
  }
  const ohne = kopie();
  delete tierVon(ohne, 'storch').zeichenGrund;
  assert.ok(pruefeDaten(ohne).some((f) => /zeichenGrund fehlt/.test(f)));
  assert.match(app, /tier\?\.zeichenArt === 'bewegung'/);
});

test('Lautstärke gedeckelt, Puls über Größe statt Blinken', () => {
  assert.equal(MAX_LAUTSTAERKE, 0.22);
  // Der Deckel wird GENAU EINMAL angewandt. `staerke` in den Daten ist ein
  // Anteil davon (0 < s <= 1), `zeitplan()` multipliziert ihn mit dem
  // Deckel, und der Master-Gain steht auf 1. Stand der Deckel an beiden
  // Stellen, lag die Spitze bei 0,2 * 0,22 = 0,044 – ein Viertel dessen,
  // was apps/musik-detektive mit demselben Deckel ausgibt.
  for (const d of daten.dynamiken) {
    assert.ok(d.staerke > 0 && d.staerke <= 1, `${d.id}: ${d.staerke}`);
  }
  const laut = kopie();
  laut.dynamiken[0].staerke = 1.4;
  assert.ok(pruefeDaten(laut).some((f) => /staerke muss zwischen/.test(f)));
  assert.match(app, /master\.gain\.value = 1;/, 'der Master darf nicht zusaetzlich daempfen');
  // Und der Deckel muss den laut-Wert wirklich erreichen: eine App, die
  // quer durch ein Zimmer hoerbar sein soll, darf nicht bei einem Bruchteil
  // des Erlaubten festhaengen.
  const lauteste = Math.max(...daten.dynamiken.map((d) => d.staerke)) * MAX_LAUTSTAERKE;
  assert.ok(lauteste > 0.1 && lauteste <= MAX_LAUTSTAERKE, `lauteste Spitze: ${lauteste}`);
  // Der Probeton geht denselben Weg wie ein echter Schlag.
  assert.match(app, /schlag\(220, t0, 0\.3, 0\.5 \* MAX_LAUTSTAERKE\)/);
  // Bei 138 bpm läge ein An/Aus-Puls bei 2,3 Hz und damit nahe an der
  // Flackergrenze (WCAG 2.3.1, 3-55 Hz). Darum wird gerampt.
  assert.match(app, /transform = an \? 'scale\(1\.55\)'/);
  assert.match(app, /transition:transform/);
  // Der Puls lief zunaechst gar nicht: `zeige()` setzte `spuren = []`
  // in seinem Rumpf, die Knoten sind aber ARGUMENTE und werden davor
  // gebaut – pulsReihe() hatte die Reihe also schon eingetragen, und
  // zeige() loeschte sie sofort wieder. Dieselbe Falle wie in Welle 74.
  // Darum SETZT pulsReihe() die Reihe, und zeige() raeumt sie nicht ab.
  assert.match(app, /spuren = \[punkte\]/);
  // Ohne Kommentare: der Hinweis NENNT `spuren = []`, um zu erklaeren,
  // warum es dort nicht stehen darf.
  const zeigeRumpf = app.slice(app.indexOf('function zeige('), app.indexOf('const vorlesenKnopf'))
    .replace(/^\s*\/\/.*$/gm, '');
  assert.doesNotMatch(zeigeRumpf, /spuren = \[\]/, 'zeige() loescht die gerade gebaute Puls-Reihe');
  assert.match(app, /Auswertungsreihenfolge/);
  assert.doesNotMatch(app, /display:(none|block)['"`]?\s*;?\s*\/\/ *puls/i);
  // Mindestens 12 ms Ein- und Ausblenden.
  assert.match(app, /t0 \+ 0\.012/);
  assert.match(app, /osc\.type = 'triangle'/);
  // Ein Probeton am Start.
  assert.match(app, /Probeton/);
});

test('Ton und sichtbarer Puls kommen aus derselben Quelle', () => {
  const k = karteVon(daten, 'k-amsel-huepft');
  const plan = zeitplan(daten, k, 2);
  assert.equal(plan.length, 6, 'drei Schläge je Runde, zwei Runden');
  const schlagDauer = 60 / daten.tempi.find((t) => t.id === k.tempo).bpm;
  assert.ok(Math.abs(plan[1].zeit - plan[0].zeit - schlagDauer) < 1e-9);
  for (const n of plan) assert.ok(n.staerke <= MAX_LAUTSTAERKE, 'Deckel verletzt');
  // Gebunden klingt länger als getrennt – das ist die Artikulation.
  const gebunden = zeitplan(daten, karteVon(daten, 'k-schnecke-kriecht'), 1);
  assert.ok(gebunden[0].dauer > plan[0].dauer);
  assert.deepEqual(zeitplan(daten, { tempo: 'x' }, 1), []);
  assert.match(app, /aus DEMSELBEN Zeitplan/);
});

test('Sitzungsgrenze und Rotation', () => {
  assert.ok(PRO_SESSION <= 5);
  const gesehen = new Set();
  for (let i = 0; i < 80; i++) {
    const runde = waehleKarten(daten, 'sommer');
    assert.equal(runde.length, Math.min(PRO_SESSION, karten(daten, 'sommer').length));
    assert.equal(new Set(runde.map((k) => k.id)).size, runde.length);
    for (const k of runde) {
      assert.ok(k.jahreszeit.includes('sommer'), `${k.id} gehört nicht in den Sommer`);
      gesehen.add(k.id);
    }
  }
  assert.ok(gesehen.size > PRO_SESSION, 'keine Rotation');
  // Und jederzeit aufhören können.
  assert.match(app, /Für heute reicht es/);
});

test('Offline wird beobachtet, nicht angefasst', () => {
  // Igel sind besonders geschützt und tragen Flöhe, Zecken und manchmal
  // Salmonellen. Eine App, die zum Suchen und Anfassen motiviert, richtet
  // echten Schaden an.
  assert.ok(daten.schlussIdeen.length >= 3);
  for (const i of daten.schlussIdeen) {
    assert.doesNotMatch(i, /sammel|fütter|aufheben|fangen|streicheln/i, i);
    assert.ok(i.length >= 40, `zu knapp: ${i}`);
  }
  const sammeln = kopie();
  sammeln.schlussIdeen.push('Sammelt draußen Igel ein und bringt sie nach Hause, das ist spannend.');
  assert.ok(pruefeDaten(sammeln).some((f) => /beobachtet, nicht angefasst/.test(f)));
  const sicher = daten.sicherheit.join(' ');
  for (const muss of ['Fläche', 'Barfuß', 'nicht auf den Boden', 'beide Füße', 'Drehen deckeln', 'geschützt', 'Hände waschen', 'kein Sport']) {
    assert.ok(sicher.includes(muss), `Sicherheitshinweis fehlt: ${muss}`);
  }
  assert.match(app, /Bildschirm aus/);
});

test('kindTextVon liefert je Geltung das richtige Feld', () => {
  assert.equal(kindTextVon(karteVon(daten, 'k-fuchs-schnuert')), karteVon(daten, 'k-fuchs-schnuert').woran);
  assert.equal(kindTextVon(karteVon(daten, 'k-igel-schleicht')), karteVon(daten, 'k-igel-schleicht').kindText);
  assert.equal(kindTextVon(karteVon(daten, 'k-schneeflocke')), karteVon(daten, 'k-schneeflocke').kindText);
  assert.equal(kindTextVon(null), '');
  assert.equal(karteVon(daten, 'gibtsnicht'), null);
  assert.equal(tierVon(daten, 'gibtsnicht'), null);
});

test('die Altersgrenzen der Elternseite stehen im Schema, nicht nur im Text', () => {
  // eltern.html und GDD nennen vier Grenzen: kein Takt, kein Abzählen,
  // kein links/rechts, kein Einbeinstand. Im Code stand nur die Taktgrenze.
  // Eine Karte sagte „Hüpf dreimal und bleib dann stehen“ – strukturgleich
  // mit dem Gegenbeispiel „vier Schritte, dann drehen“ der Elternseite – und
  // kam durch jede Prüfung, weil kein Taktwort darin steht, sondern eine
  // Zahl. Den Hinweis gibt der Rhythmus ohnehin: [1,1,1,0].
  const huepft = karteVon(daten, 'k-amsel-huepft');
  assert.doesNotMatch(huepft.bewegungsAuftrag, /dreimal|drei /i);
  assert.match(huepft.bewegungsAuftrag, /bis die Pause kommt/);
  assert.deepEqual(huepft.motiv.muster, [1, 1, 1, 0], 'der Rhythmus trägt die Zahl, nicht der Text');

  for (const k of daten.karten) {
    for (const feld of ['bewegungsAuftrag', 'kindText', 'wortImpuls', 'titel']) {
      const text = String(k[feld] ?? '');
      assert.doesNotMatch(text, /(^|[^a-zäöüß])(\d|zwei|drei|vier|fünf|einmal|zweimal|dreimal)/i,
        `${k.id}.${feld}: ${text}`);
      assert.doesNotMatch(text, /(^|[^a-zäöüß])(links|rechts|auf einem Bein)/i, `${k.id}.${feld}`);
    }
  }
  // Eine Zahl im Erwachsenen-Text ist erlaubt und sogar nötig – das Deckeln
  // der Drehungen ist eine Anweisung an den Erwachsenen.
  assert.match(karteVon(daten, 'k-schneeflocke').erwachsenenHinweis, /drei Drehungen/);

  for (const [feld, text] of [
    ['bewegungsAuftrag', 'Hüpf dreimal und bleib dann stehen.'],
    ['bewegungsAuftrag', 'Setz den linken Fuß vor den rechten.'],
    ['bewegungsAuftrag', 'Steh auf einem Bein still.'],
  ]) {
    const kopf = kopie();
    karteVon(kopf, 'k-amsel-huepft')[feld] = text;
    assert.ok(pruefeDaten(kopf).some((f) => /Abzählen|Seite oder Einbeinstand/.test(f)), text);
  }
});

test('kein Zeigewort ohne Bezug – „dorthin“ gibt es nicht', () => {
  // „Warte, bis die Luft dich schiebt – dann dreh dich dorthin.“ Es gibt
  // kein „dorthin“: weder Karte noch Wort- noch Klatschimpuls nennen eine
  // Richtung, und der Erwachsene soll gerade nichts vormachen. Ein Kind
  // bleibt dann stehen und sucht die fehlende Angabe beim Erwachsenen.
  for (const k of daten.karten) {
    assert.doesNotMatch(String(k.bewegungsAuftrag), /\b(dorthin|dahin|dorthinüber|da hin)\b/i, k.id);
  }
  const flocke = karteVon(daten, 'k-schneeflocke');
  assert.match(flocke.bewegungsAuftrag, /solange die Luft dich schiebt/);
  assert.match(flocke.wortImpuls, /von der Tür her/, 'die Richtung steht beim Erwachsenen-Satz');
});

test('ein Tempo, das der Hinweis behauptet, muss das Tempo der Karte sein', () => {
  // Ein Hinweis sagte „Laut und langsam gehören hier zusammen“ auf einer
  // mittelschnellen Karte – und karteBildschirm zeigt zwei Zeilen darüber
  // „mittelschnell“. Der Erwachsene liest zwei unvereinbare Angaben und
  // bremst das Scharren auf das falsche Tempo. Das echte Gegenbeispiel zu
  // „langsam heißt leise“ ist das Storchenklappern (langsam + laut).
  const scharrt = karteVon(daten, 'k-amsel-scharrt');
  assert.equal(scharrt.tempo, 'mittel');
  assert.match(scharrt.erwachsenenHinweis, /mittelschnell/);
  assert.match(scharrt.erwachsenenHinweis, /Storchenklappern/);
  const storch = karteVon(daten, 'k-storch-klappert');
  assert.equal(storch.tempo, 'langsam');
  assert.equal(storch.dynamik, 'laut');

  const falsch = kopie();
  karteVon(falsch, 'k-amsel-scharrt').erwachsenenHinweis = 'Laut und langsam gehören hier zusammen.';
  assert.ok(pruefeDaten(falsch).some((f) => /der Hinweis nennt/.test(f)));
  const verneint = kopie();
  karteVon(verneint, 'k-storch-schreitet').erwachsenenHinweis = 'Diese Karte ist nicht langsam.';
  assert.ok(pruefeDaten(verneint).some((f) => /der Hinweis verneint/.test(f)));
  // Ein Vergleich OHNE Selbstbezug bleibt erlaubt – sonst wäre der Satz
  // „langsam und kontrolliert ist schwerer als schnell“ nicht sagbar.
  assert.match(karteVon(daten, 'k-storch-schreitet').erwachsenenHinweis, /schwerer als schnell/);
  assert.deepEqual(pruefeDaten(daten), []);
});

test('🐿️ ist ein Streifenhörnchen – dieselbe Lage wie 🦩 beim Storch', () => {
  // U+1F43F heißt in Unicode CHIPMUNK. Ein Eichhörnchen-Emoji gibt es nicht,
  // und ein Streifenhörnchen ist ein anderes Tier – genau der Fall, den die
  // Datei beim Storch selbst ausschließt. Mit zeichenArt 'tier' hätte die
  // App das Zeichen groß gezeigt, mit `aria-label` „Das Eichhörnchen
  // galoppiert“, und den korrigierenden Satz unterdrückt.
  const eich = tierVon(daten, 'eichhoernchen');
  assert.equal(eich.zeichenArt, 'bewegung');
  assert.match(eich.zeichenGrund, /Streifenhörnchen/);
  assert.notEqual(eich.zeichen, '🐿️');
  assert.notEqual(karteVon(daten, 'k-eichhoernchen-galoppiert').zeichen, '🐿️');
  assert.doesNotMatch(JSON.stringify(daten.tiere.map((t) => t.zeichen)), /🐿|🦩/);
  // Der Grund wird angezeigt, sobald zeichenArt 'bewegung' ist.
  assert.match(app, /tier\?\.zeichenArt === 'bewegung'/);
});

test('die Sicherheitshinweise stehen VOR der ersten Bewegung, nicht nur danach', () => {
  // Sie standen nur im Schluss-Bildschirm, unter der Überschrift „Vorher
  // einmal lesen“ – also nach den Karten. Zwei von ihnen sind aber genau
  // die, die vorher gelten müssen: beide Füße am Boden beim Stehenbleiben,
  // und das Deckeln der Drehungen.
  const gate = app.slice(app.indexOf('function gate('), app.indexOf('function tonBildschirm('));
  assert.match(gate, /daten\.sicherheit\.map/, 'das Gate muss die Hinweise zeigen');
  assert.match(gate, /Sicherheit – einmal lesen/);
  assert.ok(daten.sicherheit.some((s) => /beide Füße am Boden/.test(s)));
  assert.ok(daten.sicherheit.some((s) => /Drehen deckeln/.test(s)));
  // Und die Karte, die das Stehenbleiben verlangt, sagt es selbst.
  assert.match(karteVon(daten, 'k-amsel-huepft').erwachsenenHinweis, /beide Füße am Boden/);
  // Kein Superlativ ohne Quelle: es gibt keine Statistik, die Rutschursachen
  // in Wohnungen in eine Rangfolge bringt. Der Rat bleibt, die Begründung
  // behauptet nicht mehr, als sie weiß.
  assert.doesNotMatch(JSON.stringify(daten), /häufigste Rutschursache/);
});

test('„weniger Bewegung“ macht den Puls nicht wieder zum An/Aus-Sprung', () => {
  // Die Rampe ist nur eine CSS-`transition`, und kinder.css schaltet unter
  // `prefers-reduced-motion: reduce` jede Transition mit `!important` ab –
  // eine `!important`-Regel aus dem Stylesheet schlägt den einfachen
  // Inline-Wert. Genau für die Menschen, die „weniger Bewegung“ gewählt
  // haben, wäre der Puls also exakt der An/Aus-Sprung bei 2,3 Hz geworden,
  // den die Begründung ausschließt.
  assert.match(kinderCss, /prefers-reduced-motion: reduce/);
  assert.match(kinderCss, /transition: none !important/);
  assert.match(app, /prefers-reduced-motion: reduce/, 'die App muss die Einstellung lesen');
  const puls = app.slice(app.indexOf('function zeigePuls('), app.indexOf('function zeige('));
  assert.match(puls, /wenigerBewegung\(\)/);
  // Der zweite Weg ist eine fortschreitende Reihe: gefüllt BLEIBEN statt
  // blinken – dann wechselt überhaupt nichts periodisch.
  assert.match(puls, /i <= aktiv/);
  assert.match(puls, /scale\(1\)/);
  // Und das Rücksetzen nach jedem Schlag entfällt dort, sonst blinkt die
  // Reihe trotzdem.
  const spielt = app.slice(app.indexOf('function spiele('), app.indexOf('function karteBildschirm('));
  assert.match(spielt, /if \(!leise\)/);
  assert.match(spielt, /stelle === 0/);
});
