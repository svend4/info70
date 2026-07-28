import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  PRO_SESSION, TYPEN, PRAEPOSITIONEN, GESPERRTE_PRAEPOSITIONEN,
  PLURAL_SPERRLISTE, KOMPOSITUM_SPERRLISTE,
  dativArtikel, ortsangabe, ortsSatz, waehleAufgaben, istRichtig, istFastRichtig,
  pluralKlassen, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/grammatik.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const vom = (typ) => daten.aufgaben.filter((a) => a.typ === typ);
const mitId = (id) => daten.aufgaben.find((a) => a.id === id);

test('Daten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.aufgaben.length >= 15);
  for (const typ of TYPEN) assert.ok(vom(typ).length >= 4, `${typ}: nur ${vom(typ).length}`);
});

test('„vor“ und „hinter“ sind gesperrt – sie hätten in einer flachen Szene zwei richtige Antworten', () => {
  for (const p of ['vor', 'hinter']) {
    assert.ok(GESPERRTE_PRAEPOSITIONEN.includes(p), `${p} müsste gesperrt sein`);
    assert.ok(!PRAEPOSITIONEN.includes(p), `${p} darf nicht zur Auswahl stehen`);
  }
  assert.ok(!vom('praeposition').some((a) => GESPERRTE_PRAEPOSITIONEN.includes(a.praeposition)));
  const verboten = kopie();
  verboten.aufgaben.find((a) => a.id === 'o01').praeposition = 'hinter';
  assert.ok(pruefeDaten(verboten).some((f) => /„hinter“ ist gesperrt/.test(f)));
  // Und der ganze Text der App darf die beiden Wörter nicht als Aufgabe führen
  for (const a of vom('praeposition')) {
    assert.ok(PRAEPOSITIONEN.includes(a.praeposition), `${a.id}: ${a.praeposition}`);
  }
});

test('jedes angebotene Ortswort ist auch mindestens einmal die Lösung', () => {
  const benutzt = new Set(vom('praeposition').map((a) => a.praeposition));
  for (const p of PRAEPOSITIONEN) assert.ok(benutzt.has(p), `„${p}“ ist nie die Lösung`);
  const ohne = kopie();
  ohne.aufgaben = ohne.aufgaben.filter((a) => a.praeposition !== 'zwischen');
  assert.ok(pruefeDaten(ohne).some((f) => /„zwischen“ steht zur Auswahl, ist aber nie die Lösung/.test(f)));
});

test('die Ortsangabe wird gerechnet und steht im Dativ', () => {
  assert.equal(dativArtikel('m'), 'dem');
  assert.equal(dativArtikel('f'), 'der');
  assert.equal(dativArtikel('n'), 'dem');
  assert.equal(dativArtikel('f', true), 'den');
  assert.equal(dativArtikel('x'), null);
  assert.equal(ortsangabe(mitId('o01')), 'auf der Kiste');
  assert.equal(ortsangabe(mitId('o02')), 'unter dem Korb');
  assert.equal(ortsangabe(mitId('o05')), 'zwischen den Kisten');
  assert.equal(ortsSatz(mitId('o02')), 'Der Apfel ist unter dem Korb.');
  // Kein Nominativ, kein Akkusativ: „Wo ist …?“ verlangt den Dativ.
  for (const a of vom('praeposition')) {
    assert.match(ortsangabe(a), /\b(dem|der|den)\b/, `${a.id}: kein Dativartikel`);
  }
});

test('„in“ nur mit weiblichem Behälter, „zwischen“ nur mit zweien', () => {
  // „in dem Korb“ sagt niemand – es hieße „im Korb“. Damit die Musterlösung
  // natürlich klingt, ist „in“ auf weibliche Behälter beschränkt.
  for (const a of vom('praeposition').filter((x) => x.praeposition === 'in')) {
    assert.equal(a.relatum.genus, 'f', `${a.id}: „in dem …“ wäre unnatürlich`);
  }
  const maskulin = kopie();
  const inAufgabe = maskulin.aufgaben.find((a) => a.praeposition === 'in');
  inAufgabe.relatum = { nomen: 'Korb', artikel: 'der', genus: 'm' };
  assert.ok(pruefeDaten(maskulin).some((f) => /„in“ nur mit weiblichem Behälter/.test(f)));

  for (const a of vom('praeposition')) {
    assert.equal(Boolean(a.relatum.mehrzahl), a.praeposition === 'zwischen', `${a.id}`);
  }
  const einzeln = kopie();
  const zw = einzeln.aufgaben.find((a) => a.praeposition === 'zwischen');
  delete zw.relatum.mehrzahl;
  assert.ok(pruefeDaten(einzeln).some((f) => /„zwischen“ braucht zwei gleiche Dinge/.test(f)));
});

test('Mehrzahl: mehrere Arten, nie dieselbe Form wie die Einzahl, nichts von der Sperrliste', () => {
  const klassen = pluralKlassen(daten.aufgaben);
  assert.ok(klassen.length >= 4, `nur ${klassen.length} Arten: ${klassen}`);
  for (const a of vom('plural')) {
    assert.notEqual(a.plural, a.singular, `${a.id}: Ein- und Mehrzahl gleich`);
    assert.ok(!PLURAL_SPERRLISTE.includes(a.singular), `${a.id}: ${a.singular} steht auf der Sperrliste`);
    assert.equal(a.optionen.filter((o) => o.richtig).length, 1, a.id);
    assert.equal(a.optionen.find((o) => o.richtig).text, a.plural, a.id);
  }
  const einseitig = kopie();
  for (const a of einseitig.aufgaben) if (a.typ === 'plural') a.klasse = '-e';
  assert.ok(pruefeDaten(einseitig).some((f) => /nur 1 Mehrzahl-Arten/.test(f)));
  const gesperrt = kopie();
  const m = gesperrt.aufgaben.find((a) => a.id === 'm01');
  m.singular = 'Löffel'; m.plural = 'Löffel';
  const fehler = pruefeDaten(gesperrt);
  assert.ok(fehler.some((f) => /Sperrliste/.test(f)));
  assert.ok(fehler.some((f) => /Ein- und Mehrzahl sind gleich/.test(f)));
});

test('regelhaft gedachte Mehrzahl wird gelobt, nicht als Fehler markiert', () => {
  for (const a of vom('plural')) {
    const fast = a.optionen.find((o) => o.text === a.fastRichtig);
    assert.ok(fast, `${a.id}: fastRichtig nicht unter den Antworten`);
    assert.equal(fast.richtig, false, `${a.id}: fastRichtig darf nicht die Lösung sein`);
    assert.equal(istFastRichtig(a, fast), true, a.id);
    assert.equal(istFastRichtig(a, a.optionen.find((o) => o.richtig)), false, a.id);
  }
  // Ein anderer falscher Weg ist kein „fast“
  const m01 = mitId('m01');
  assert.equal(istFastRichtig(m01, m01.optionen.find((o) => o.text === 'Hunden')), false);
  assert.equal(istFastRichtig(mitId('o01'), { richtig: false }), false, 'nur bei der Mehrzahl');
  const ohne = kopie();
  delete ohne.aufgaben.find((a) => a.id === 'm01').fastRichtig;
  assert.ok(pruefeDaten(ohne).some((f) => /fastRichtig fehlt/.test(f)));
  const daneben = kopie();
  daneben.aufgaben.find((a) => a.id === 'm01').fastRichtig = 'Hunde';
  assert.ok(pruefeDaten(daneben).some((f) => /steht nicht unter den falschen Antworten/.test(f)));
});

test('zusammengesetzte Wörter: die Rechnung Teil + Fuge + Teil muss aufgehen', () => {
  for (const a of vom('kompositum')) {
    assert.equal(`${a.teil1}${a.fuge}${a.teil2}`.toLowerCase(), a.wort.toLowerCase(), a.id);
    assert.ok(a.istEin.includes(a.teil2), `${a.id}: „${a.istEin}“ nennt das Grundwort nicht`);
    assert.equal(a.genus, a.genusTeil2, `${a.id}: Artikel kommt nicht vom letzten Wort`);
    assert.ok(!KOMPOSITUM_SPERRLISTE.includes(a.wort), `${a.id}: ${a.wort} ist nicht durchsichtig`);
  }
  const getilgt = kopie();
  // Schulhof: aus „Schule“ verschwindet ein Laut – „Wort + Wort“ stimmt hier nicht
  Object.assign(getilgt.aufgaben.find((a) => a.id === 'z01'), { teil1: 'Schule', fuge: '', teil2: 'Hof', wort: 'Schulhof' });
  assert.ok(pruefeDaten(getilgt).some((f) => /ergibt „schulehof“, nicht „Schulhof“/.test(f)));
  const undurchsichtig = kopie();
  Object.assign(undurchsichtig.aufgaben.find((a) => a.id === 'z01'), { teil1: 'Löwen', fuge: '', teil2: 'zahn', wort: 'Löwenzahn' });
  assert.ok(pruefeDaten(undurchsichtig).some((f) => /bedeutet nicht, was seine Teile sagen/.test(f)));
});

test('mindestens ein Wort mit Fugenlaut – sonst wirkt „Wort + Wort“ größer, als es ist', () => {
  const mitFuge = vom('kompositum').filter((a) => a.fuge);
  assert.ok(mitFuge.length >= 1, 'kein einziges Gegenbeispiel');
  assert.ok(mitFuge.some((a) => a.wort === 'Sonnenblume'));
  for (const a of mitFuge) {
    // Das Fugen-n ist KEINE Mehrzahl. Wer das behauptet, erzeugt genau die
    // Fehlanalyse, die das Mehrzahl-Modul nebenan verhindern soll.
    assert.ok(!/viele|Mehrzahl/.test(a.erklaerung), `${a.id}: erklärt die Fuge als Mehrzahl`);
  }
  const ohne = kopie();
  ohne.aufgaben = ohne.aufgaben.filter((a) => a.typ !== 'kompositum' || !a.fuge);
  assert.ok(pruefeDaten(ohne).some((f) => /kein einziges Wort mit Fugenlaut/.test(f)));
});

test('die Lösung steht nicht überall an derselben Stelle', () => {
  // Die App mischt vor dem Anzeigen UND liest dieselbe gemischte Liste vor.
  // Diese Regel ist die zweite Sicherung: Gäbe irgendeine Stelle die Daten
  // je ungemischt aus, wäre eine feste Position sofort ein Spickzettel.
  const stellen = new Set(
    daten.aufgaben.filter((a) => Array.isArray(a.optionen))
      .map((a) => a.optionen.findIndex((o) => o.richtig)),
  );
  assert.ok(stellen.size > 1, `alle Lösungen stehen an Stelle ${[...stellen]}`);
  const gleich = kopie();
  for (const a of gleich.aufgaben) {
    if (!Array.isArray(a.optionen)) continue;
    const i = a.optionen.findIndex((o) => o.richtig);
    if (i > 0) [a.optionen[0], a.optionen[i]] = [a.optionen[i], a.optionen[0]];
  }
  assert.ok(pruefeDaten(gleich).some((f) => /überall an derselben Stelle/.test(f)));
});

test('„neben“ bei zwei Kisten ist gut gedacht, nicht verkehrt', () => {
  const zwischen = daten.aufgaben.find((a) => a.praeposition === 'zwischen');
  assert.equal(zwischen.nachvollziehbar, 'neben');
  assert.ok(zwischen.nachvollziehbarText.length > 40);
  assert.equal(istFastRichtig(zwischen, 'neben'), true);
  assert.equal(istFastRichtig(zwischen, 'zwischen'), false, 'die Lösung ist nicht „fast“');
  assert.equal(istFastRichtig(zwischen, 'auf'), false);
  assert.equal(istFastRichtig(mitId('o01'), 'neben'), false, 'ohne Eintrag kein Bonus');
  const loesung = kopie();
  loesung.aufgaben.find((a) => a.praeposition === 'zwischen').nachvollziehbar = 'zwischen';
  assert.ok(pruefeDaten(loesung).some((f) => /ist die Lösung selbst/.test(f)));
  const fremd = kopie();
  fremd.aufgaben.find((a) => a.praeposition === 'zwischen').nachvollziehbar = 'hinter';
  assert.ok(pruefeDaten(fremd).some((f) => /steht gar nicht zur Wahl/.test(f)));
  const ohneText = kopie();
  delete ohneText.aufgaben.find((a) => a.praeposition === 'zwischen').nachvollziehbarText;
  assert.ok(pruefeDaten(ohneText).some((f) => /warum die Antwort gut gedacht war/.test(f)));
});

test('jede Regel bringt ihre Grenze mit', () => {
  assert.ok(daten.regeln.length >= 3);
  for (const r of daten.regeln) {
    assert.ok(r.gilt && r.gilt.length >= 25, `${r.id}: Grenze fehlt oder zu knapp`);
  }
  // Die Mehrzahl-Regel muss den Dativ ausdrücklich ausnehmen: „immer die“
  // stimmt nur, solange man „Da sind die Hunde“ sagt.
  const plural = daten.regeln.find((r) => r.id === 'r-plural');
  assert.match(plural.gilt, /den/);
  const fuge = daten.regeln.find((r) => r.id === 'r-fuge');
  assert.match(fuge.gilt, /merken|nicht ausrechnen/);
  const knapp = kopie();
  knapp.regeln[0].gilt = 'gilt immer';
  assert.ok(pruefeDaten(knapp).some((f) => /Grenze der Regel ist zu knapp/.test(f)));
});

test('die Wortliste ist nicht einseitig – alle drei Artikel kommen vor', () => {
  const dinge = new Set(vom('praeposition').map((a) => a.ding.genus));
  assert.deepEqual([...dinge].sort(), ['f', 'm', 'n']);
  const artikel = new Set(vom('kompositum').map((a) => a.genus));
  assert.deepEqual([...artikel].sort(), ['das', 'der', 'die']);
  const einseitig = kopie();
  for (const a of einseitig.aufgaben) if (a.typ === 'kompositum') { a.genus = 'die'; a.genusTeil2 = 'die'; }
  assert.ok(pruefeDaten(einseitig).some((f) => /Artikel der: kommt bei den zusammengesetzten Wörtern nicht vor/.test(f)));
});

test('Sitzungsgrenze: höchstens sechs Aufgaben, ohne Dubletten, mit Rotation', () => {
  assert.ok(PRO_SESSION <= 6);
  const gesehen = new Set();
  for (let i = 0; i < 60; i++) {
    const runde = waehleAufgaben(daten.aufgaben);
    assert.equal(runde.length, PRO_SESSION);
    assert.equal(new Set(runde.map((a) => a.id)).size, PRO_SESSION);
    for (const a of runde) gesehen.add(a.id);
  }
  assert.ok(gesehen.size > PRO_SESSION, 'keine Rotation');
});

test('istRichtig arbeitet für beide Antwortformen', () => {
  const o = mitId('o01');
  assert.equal(istRichtig(o, 'auf'), true);
  assert.equal(istRichtig(o, 'unter'), false);
  const m = mitId('m01');
  assert.equal(istRichtig(m, m.optionen.find((x) => x.richtig)), true);
  assert.equal(istRichtig(m, m.optionen.find((x) => !x.richtig)), false);
  assert.equal(istRichtig(m, undefined), false);
});

test('Ton und Abschluss: kein Tadel, Frage an die Erwachsenen, Schluss offline', () => {
  const text = JSON.stringify(daten).toLowerCase();
  for (const wort of ['dumm', 'blöd', 'leider', 'punkte', 'gewonnen', 'verloren', 'falsch']) {
    assert.ok(!text.includes(wort), `unerwünschtes Wort: ${wort}`);
  }
  for (const a of daten.aufgaben) {
    assert.ok(a.gespraech.trim().endsWith('?'), `${a.id}: Impuls ist keine Frage`);
    assert.ok(a.erklaerung.length >= 35, `${a.id}: Erklärung zu knapp`);
  }
  assert.ok(daten.schlussIdeen.length >= 3);
  for (const i of daten.schlussIdeen) assert.ok(i.length >= 40, `Schlussidee zu knapp: ${i}`);
  // Die Auslassung ist deklariert, nicht verschwiegen
  assert.match(daten.hinweis, /„vor“ und „hinter“ fehlen mit Absicht/);
});
