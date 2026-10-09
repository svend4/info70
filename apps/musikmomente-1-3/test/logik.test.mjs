import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  BAENDER, FILTER, GATTUNGEN, WERKARTEN, ACHSEN, GATTUNGEN_MIT_TEXT, DB_ALS_VORGABE,
  massgeblicheTodesjahre, textlageGeklaert,
  PRUEFUNG, TAKT, TAKT_FORDERUNG, ABZAEHLEN, BEZUGSQUELLE, WIRKVERSPRECHEN,
  istGemeinfrei, freiAbSatz, werkVon, momentVon, werkZeile, werkeZumMoment,
  momenteFuer, vorleseText, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/musik.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const code = app.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const druck = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
// Die REGELN ohne die Kommentare: der Kopfkommentar von druck.css MUSS
// „kein Haken, kein Name, kein Stern“ sagen, um es zu verbieten – ein Netz
// auf das nackte Wort trifft die eigene Ausnahmeklausel. Geprüft wird
// darum, dass keine REGEL solchen Inhalt erzeugt (etwa über `content:`).
const druckRegeln = druck.replace(/\/\*[\s\S]*?\*\//g, '');
const seite = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('Daten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.werke.length >= 12);
  assert.ok(daten.momente.length >= 6);
});

test('Gemeinfreiheit wird gerechnet und nie behauptet', () => {
  // Eine behauptete Gemeinfreiheit sieht genauso aus wie eine geprüfte.
  // Darum gibt es das Feld nicht, und der Validator weist es ab.
  assert.ok(!JSON.stringify(daten).includes('"gemeinfrei"'), 'kein Werk trägt ein Feld „gemeinfrei“');
  for (const w of daten.werke) assert.ok(istGemeinfrei(w, daten), `${w.id} muss ausrechenbar frei sein`);

  const mitFeld = kopie();
  mitFeld.werke[0].gemeinfrei = true;
  assert.ok(pruefeDaten(mitFeld).some((f) => /das Feld „gemeinfrei“ darf es nicht geben/.test(f)));

  const zuJung = kopie();
  zuJung.werke.find((w) => w.art === 'komposition').todesjahr = 1956;
  assert.ok(pruefeDaten(zuJung).some((f) => /nicht als gemeinfrei ausrechenbar/.test(f)));

  const ohneJahr = kopie();
  delete ohneJahr.werke.find((w) => w.art === 'komposition').todesjahr;
  const f1 = pruefeDaten(ohneJahr);
  assert.ok(f1.some((f) => /ohne Todesjahr/.test(f)));
  assert.ok(f1.some((f) => /nicht als gemeinfrei ausrechenbar/.test(f)));

  // Ein namentlich genannter Satz ist ein eigenes Werk – dann stimmt die
  // Rechnung „Volksgut ist frei“ nicht mehr.
  const mitSatz = kopie();
  const volk = mitSatz.werke.find((w) => w.art === 'volksweise');
  volk.bearbeiter = 'M. Krasew';
  const f2 = pruefeDaten(mitSatz);
  assert.ok(f2.some((f) => /keine Bearbeitungen/.test(f)));
  assert.ok(f2.some((f) => /nicht als gemeinfrei ausrechenbar/.test(f)));
  assert.equal(istGemeinfrei(volk, mitSatz), false);
});

test('die Grenze liegt genau bei 1955 – und der Satz sagt es auch', () => {
  // 70 Jahre ab dem Ende des Todesjahres (§ 64 UrhG): wer 1955 starb, ist
  // seit 1.1.2026 frei; wer 1956 starb, erst ab 1.1.2027. Gretschaninow
  // (1956) steht in der Quellliste und ist am Stand 2026 NICHT frei.
  assert.equal(daten.stand.jahr, 2026);
  assert.equal(daten.stand.schutzdauerJahre, 70);
  const probe = (todesjahr) => istGemeinfrei(
    { art: 'komposition', komponist: 'X', todesjahr, gattung: 'marsch', textlage: 'ohne' }, daten);
  assert.equal(probe(1955), true);
  assert.equal(probe(1956), false);
  assert.equal(probe(1921), true);
  assert.match(freiAbSatz(daten), /1955 oder früher/);
  // Ohne Stand keine Rechnung – und damit keine Freigabe.
  assert.equal(istGemeinfrei({ art: 'komposition', todesjahr: 1800, gattung: 'marsch', textlage: 'ohne' }, {}), false);
  assert.equal(istGemeinfrei(null, daten), false);
  assert.equal(istGemeinfrei({ art: 'erfunden', gattung: 'marsch', textlage: 'ohne' }, daten), false);
  assert.equal(freiAbSatz({}), '');
});

test('bei einem Lied zählt der Längstlebende – auch der Textdichter', () => {
  // § 65 Abs. 3 UrhG: bei einer Musikkomposition mit Text läuft die Frist ab
  // dem Tod des Längstlebenden von Textdichter und Komponist. Beim ersten Bau
  // dieser App war das übersehen – gerechnet wurde nur über den Komponisten.
  // Die MELODIE kann frei sein und das LIED als Ganzes nicht, und eine App,
  // die Wiegenlieder auflistet, listet Musikkompositionen mit Text.
  const brahms = werkVon(daten, 'w-wiegenlied-brahms');
  assert.deepEqual(massgeblicheTodesjahre(brahms), [1897, 1909]);
  assert.equal(Math.max(...massgeblicheTodesjahre(brahms)), 1909, 'der Textdichter ist hier der Spätere');
  assert.ok(istGemeinfrei(brahms, daten));

  // Jedes Werk erklärt seine Textlage, und ein Lied darf nicht „ohne“ sein.
  for (const w of daten.werke) assert.ok(textlageGeklaert(w), `${w.id}: Textlage unklar`);
  for (const w of daten.werke) {
    if (GATTUNGEN_MIT_TEXT.includes(w.gattung)) assert.notEqual(w.textlage, 'ohne', w.id);
  }

  // Gegenprobe: ein Textdichter, der noch nicht lange genug tot ist, macht
  // das Lied unfrei – obwohl der Komponist längst frei ist.
  const spaet = kopie();
  const w = spaet.werke.find((x) => x.id === 'w-mond');
  w.textlage = { dichter: 'Noch Geschützt', todesjahr: 1980 };
  assert.equal(istGemeinfrei(w, spaet), false, 'Melodie von 1800 frei, Text von 1980 nicht');
  assert.ok(pruefeDaten(spaet).some((f) => /nicht als gemeinfrei ausrechenbar/.test(f)));

  // Und eine fehlende Textlage ist keine Freigabe.
  const ohne = kopie();
  delete ohne.werke[0].textlage;
  const f = pruefeDaten(ohne);
  assert.ok(f.some((x) => /Textlage ist nicht geklärt/.test(x)));
  assert.ok(f.some((x) => /nicht als gemeinfrei ausrechenbar/.test(x)));

  // Ein Lied als „ohne Text“ auszugeben wird abgewiesen.
  const falsch = kopie();
  falsch.werke.find((x) => x.gattung === 'wiegenlied').textlage = 'ohne';
  assert.ok(pruefeDaten(falsch).some((x) => /hat notwendig einen Text/.test(x)));

  // § 65 Abs. 1: Miturheber zählen mit.
  assert.deepEqual(massgeblicheTodesjahre({ todesjahr: 1900, weitereUrheberTodesjahre: [1970] }), [1900, 1970]);
  assert.equal(istGemeinfrei({ art: 'komposition', komponist: 'A', todesjahr: 1900, weitereUrheberTodesjahre: [1970], gattung: 'marsch', textlage: 'ohne' }, daten), false);
  assert.deepEqual(massgeblicheTodesjahre(null), []);
  assert.equal(textlageGeklaert({ gattung: 'marsch' }), false);
  assert.equal(textlageGeklaert({ gattung: 'marsch', textlage: 'ohne' }), true);
  assert.equal(textlageGeklaert({ gattung: 'lied', textlage: 'ohne' }), false);
  assert.equal(textlageGeklaert({ gattung: 'lied', textlage: 'volksgut' }), true);
  assert.equal(textlageGeklaert({ gattung: 'lied', textlage: { dichter: 'X' } }), false);

  // Und die Zusage erreicht den Bildschirm: der Textdichter wird angezeigt.
  assert.match(code, /textlage\.dichter/);
  assert.match(code, /massgeblicheTodesjahre/);
  assert.match(daten.keineAufnahme, /Längstlebenden von Textdichter und Komponist/);
});

test('die falsche Zuschreibung wird genannt, nicht übernommen', () => {
  // Die Quelle führt das Wiegenlied „Schlafe, mein Prinzchen“ als Mozart.
  // Das gilt heute als falsche Zuschreibung. Die App nennt darum keinen
  // Komponisten, sondern das Erscheinungsjahr – und erklärt es.
  const w = daten.werke.find((x) => x.id === 'w-prinzchen');
  assert.equal(w.komponist, null);
  assert.equal(w.art, 'unbekannter-urheber');
  assert.match(w.zuschreibung, /falsche Zuschreibung/);
  assert.match(w.zuschreibung, /Anhang/);
  assert.ok(istGemeinfrei(w, daten), 'über das Erscheinungsjahr trotzdem frei');
  assert.match(werkZeile(w), /Urheber nicht gesichert/);
  // Mozart darf nicht als Komponist dieses Stücks auftauchen.
  assert.ok(!daten.werke.some((x) => x.id === 'w-prinzchen' && /Mozart/.test(String(x.komponist))));
});

test('hier wird nichts abgefragt', () => {
  // Genre-Erkennen ist apps/musik-detektive (ab 4), hoch/tief ist
  // apps/klang-detektive (ab 3). Diese App stellt vor und bewegt.
  assert.match(daten.keinQuiz, /Kein richtig, kein falsch/);
  const mut = kopie();
  mut.momente[0].wasDuTust.push('Lass dein Kind erraten, welches Stück der Marsch ist.');
  assert.ok(pruefeDaten(mut).some((f) => /Prüfvokabular/.test(f)));
  // Auch in einer Beschreibung ist Prüfvokabular verboten.
  const mut2 = kopie();
  mut2.werke[0].woran = 'Hier hört man die richtige Lösung.';
  assert.ok(pruefeDaten(mut2).some((f) => /Prüfvokabular/.test(f)));
  assert.match('Lass es erraten', PRUEFUNG);
  assert.doesNotMatch('Ein Kind, das mitwiegt', PRUEFUNG);
});

test('zwei Register: eine Zahl ist in der Anweisung eine Vorgabe und in der Beschreibung eine Tatsache', () => {
  // Das ist die Lehre aus Welle 77 und sie hat beim Bau dieser App zweimal
  // zugeschlagen: „Drei Töne abwärts“ beschreibt eine Melodie und ist
  // erlaubt, „dreimal wiegen“ wäre eine Wiederholungsvorgabe.
  const beschreibend = kopie();
  beschreibend.werke[0].woran = 'Drei Töne abwärts, immer wieder.';
  assert.deepEqual(pruefeDaten(beschreibend), [], 'eine Zahl in der Beschreibung muss erlaubt bleiben');

  const anweisend = kopie();
  anweisend.momente[0].wasDuTust.push('Wiegen Sie dreimal hin und her.');
  assert.ok(pruefeDaten(anweisend).some((f) => /Zahl als Vorgabe/.test(f)));

  const minuten = kopie();
  minuten.momente[0].wasDuTust.push('Drei Minuten hören, dann aufhören.');
  assert.ok(pruefeDaten(minuten).some((f) => /Zahl als Vorgabe/.test(f)));

  // Und die Gegenprobe zur Gegenprobe: eine MENGE von Material muss in der
  // Anweisung erlaubt sein, sonst wäre „zwei Stücke hintereinander“ verboten
  // – also genau die Anweisung, die den Kontrast hörbar macht.
  const menge = kopie();
  menge.kontraste[0].ohneWorte = 'Stellen Sie zwei Stücke hintereinander an.';
  assert.deepEqual(pruefeDaten(menge), []);
  assert.match('Wiegen Sie dreimal', ABZAEHLEN);
  assert.doesNotMatch('zwei Stücke', ABZAEHLEN);
});

test('Takt: verneinen ist erlaubt, verlangen nicht', () => {
  // „Es wird nicht im Takt sein, und das muss es auch nicht“ ist der Satz,
  // für den es die App gibt. Ein Netz auf das Wort hätte ihn verboten.
  assert.ok(daten.momente.some((m) => /nicht im Takt/.test(m.wasDeinKindVielleichtTut)));
  assert.deepEqual(pruefeDaten(daten), []);

  const verlangt = kopie();
  verlangt.momente[0].wasDeinKindVielleichtTut = 'Es soll möglichst im Takt mitgehen, das ist der Sinn.';
  assert.ok(pruefeDaten(verlangt).some((f) => /der Takt wird verlangt/.test(f)));

  const inAnweisung = kopie();
  inAnweisung.momente[0].wasDuTust.push('Gehen Sie im Rhythmus mitgehen und zählen Sie mit.');
  assert.ok(pruefeDaten(inAnweisung).some((f) => /Takt oder Synchronisation/.test(f)));

  assert.match('zähl mit', TAKT);
  assert.match('soll im Takt bleiben', TAKT_FORDERUNG);
  assert.doesNotMatch('wird nicht im Takt sein', TAKT_FORDERUNG);
});

test('ein Kontrastpaar trägt seinen Kontrast in den Daten', () => {
  // In Welle 77 klangen drei Karten gleich, obwohl der Text einen
  // Unterschied behauptete. Darum wird die Achse nachgerechnet.
  for (const k of daten.kontraste) assert.ok(k.eigenschaft in ACHSEN, k.id);
  const mut = kopie();
  const k = mut.kontraste.find((x) => x.eigenschaft === 'hoch und tief');
  const a = mut.werke.find((w) => w.id === k.paar[0]);
  a.eigenschaft = a.eigenschaft.map((e) => (e === 'tief' ? 'hoch' : e));
  assert.ok(pruefeDaten(mut).some((f) => /die Achse „hoch und tief“ steht nicht in den Werken/.test(f)));

  // Die Gattungs-Achse läuft über die Gattung, nicht über die Eigenschaft.
  const mut2 = kopie();
  const k2 = mut2.kontraste.find((x) => x.eigenschaft === 'Marsch und Tanz');
  mut2.werke.find((w) => w.id === k2.paar[1]).gattung = mut2.werke.find((w) => w.id === k2.paar[0]).gattung;
  assert.ok(pruefeDaten(mut2).some((f) => /zwei verschiedene Gattungen/.test(f)));

  const selbst = kopie();
  selbst.kontraste[0].paar = [selbst.kontraste[0].paar[0], selbst.kontraste[0].paar[0]];
  assert.ok(pruefeDaten(selbst).some((f) => /gegen sich selbst/.test(f)));
});

test('der Altersfilter: „alle“ zeigt alles, kein Band zeigt mehr, jedes Band hat eigenen Inhalt', () => {
  // Beim Bau zeigte „Alles zeigen“ vier Momente und „2-3 Jahre“ sechs –
  // der kumulative Fehler aus Welle 78, eine App später. Drei Invarianten
  // halten das jetzt (docs/02).
  assert.deepEqual([...FILTER], ['1-2', '2-3', 'alle']);
  assert.deepEqual([...BAENDER], ['1-2', '2-3', '1-3']);
  const alle = momenteFuer(daten, 'alle').length;
  assert.equal(alle, daten.momente.length);
  for (const f of FILTER) {
    assert.ok(momenteFuer(daten, f).length > 0, f);
    assert.ok(momenteFuer(daten, f).length <= alle, `${f} zeigt mehr als alle`);
  }
  for (const b of BAENDER) assert.ok(daten.momente.some((m) => m.altersband === b), `Band ${b} ohne eigenen Moment`);
  assert.deepEqual(momenteFuer(daten, 'quatsch'), []);

  // „alle“ als Band behandelt wäre der alte Fehler.
  const nurSpanne = { ...daten, momente: daten.momente.filter((m) => m.altersband !== '1-2') };
  assert.ok(pruefeDaten(nurSpanne).some((f) => /Band 1-2: kein Moment/.test(f)));
});

test('keine Bezugsquelle, kein Produkt, kein Wirkversprechen', () => {
  assert.match(daten.keineEmpfehlung, /kein Label/);
  assert.match(daten.keinVersprechen, /Mozart-Effekt/);
  assert.match(daten.keinVersprechen, /nicht belegt/);
  const laden = kopie();
  laden.momente[0].wasDuTust.push('Die CD kaufen Sie am besten im Shop.');
  assert.ok(pruefeDaten(laden).some((f) => /Bezugsquelle oder Produkt/.test(f)));
  const wirkung = kopie();
  wirkung.werke[0].woran = 'Das fördert die Sprachentwicklung Ihres Kindes.';
  assert.ok(pruefeDaten(wirkung).some((f) => /Wirkversprechen/.test(f)));
  assert.match('im Shop bestellen', BEZUGSQUELLE);
  assert.match('macht Kinder klüger', WIRKVERSPRECHEN);
  // Das Feld, das das Versprechen ZURÜCKWEIST, muss es nennen dürfen.
  assert.match(daten.keinVersprechen, WIRKVERSPRECHEN);
  assert.deepEqual(pruefeDaten(daten), []);
});

test('Werk und Aufnahme fallen auseinander – und das steht da', () => {
  // Ein gemeinfreies Werk gibt keine Einspielung frei: an einer Aufnahme
  // haben Tonstudio und Mitwirkende eigene Rechte. Im Korpus stand dazu
  // bisher kein Wort.
  assert.match(daten.keineAufnahme, /Werke – nicht Aufnahmen/);
  assert.match(daten.keineAufnahme, /eigene Rechte/);
  const ohne = kopie();
  ohne.keineAufnahme = 'Alle Stücke sind gemeinfrei und frei verwendbar.';
  const f = pruefeDaten(ohne);
  assert.ok(f.some((x) => /Unterschied Werk\/Aufnahme/.test(x)));
  assert.ok(f.some((x) => /Leistungsschutz/.test(x)));
  // Und die Zusage erreicht das Papier, nicht nur den Bildschirm.
  assert.match(code, /mm-nur-druck/);
  assert.match(code, /daten\.keineAufnahme/);
});

test('kyrillische Schrift nur im Originaltitel und in der Quellenangabe', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.werke.some((w) => /[Ѐ-ӿ]/.test(w.original ?? '')), 'Originaltitel gibt es');
  const mut = kopie();
  mut.momente[0].titel = 'Музыка';
  assert.ok(pruefeDaten(mut).some((f) => /kyrillische Schrift außerhalb/.test(f)));
  // Vorgelesen wird nichts Kyrillisches: `vorlesen()` setzt nur lang, und
  // ohne passende Gerätestimme liest eine deutsche Stimme es vor.
  for (const m of daten.momente) assert.doesNotMatch(vorleseText(daten, m.id), /[Ѐ-ӿ]/, m.id);
  assert.doesNotMatch(code, /vorlesen\([^)]*,\s*'(uk|ru)/);
});

test('die Vertiefung hängt an einer Handlung, nicht am Kind', () => {
  // Die Quelle markiert mit Ё „Aufgaben für Kinder mit relativ hohem Niveau
  // der Musikalität“. Das ist eine Einteilung von Kindern – ausgeschlossen
  // nach docs/02 und nach der KI-Verordnung.
  assert.match(daten.quelleAnmerkung, /Ё/);
  assert.match(daten.quelleAnmerkung, /nicht übernommen/);
  for (const v of daten.vertiefungen) {
    assert.match(v.wennDuSiehst, /^Ihr Kind \w+/, v.id);
    assert.ok(v.nichtAls, v.id);
  }
  const mut = kopie();
  mut.vertiefungen[0].wennDuSiehst = 'Ihr Kind ist musikalisch begabt';
  assert.ok(pruefeDaten(mut).some((f) => /ordnet das Kind ein/.test(f)));
  const ohneGrenze = kopie();
  delete ohneGrenze.vertiefungen[0].nichtAls;
  assert.ok(pruefeDaten(ohneGrenze).some((f) => /nichtAls fehlt/.test(f)));
});

test('die Quellbilanz wird nachgerechnet', () => {
  // 14 Ziele auf S. 78–80 und 70 Hör-Stücke sind nachgezählt. Das Dokument
  // darf nicht mehr behaupten, als die Daten tragen.
  assert.equal(daten.quelle.zahlen.zieleQuelle, 14);
  assert.equal(daten.quelle.zahlen.repertoireQuelle, 70);
  assert.equal(daten.ziele.length, 14);
  assert.equal(daten.ziele.filter((z) => z.uebernommen).length, daten.quelle.zahlen.zieleUebernommen);
  assert.equal(daten.werke.filter((w) => w.ausQuellListe).length, daten.quelle.zahlen.repertoireUebernommen);
  assert.ok(daten.quelle.geprueft, 'die Seitenangabe steht nur mit Prüfvermerk');
  assert.match(daten.quelle.rechte, /Eigenproduktion/);
  for (const z of daten.ziele) if (!z.uebernommen) assert.ok(z.warum, `${z.nr} ohne Begründung`);

  const falsch = kopie();
  falsch.quelle.zahlen.zieleUebernommen += 1;
  assert.ok(pruefeDaten(falsch).some((f) => /übernommene Ziele behauptet/.test(f)));
  const falsch2 = kopie();
  falsch2.werke[0].ausQuellListe = !falsch2.werke[0].ausQuellListe;
  assert.ok(pruefeDaten(falsch2).some((f) => /übernommene Stücke behauptet/.test(f)));
  const ohneGrund = kopie();
  delete ohneGrund.ziele.find((z) => !z.uebernommen).warum;
  assert.ok(pruefeDaten(ohneGrund).some((f) => /ohne Begründung/.test(f)));
});

test('kein totes Angebot: jedes Werk wird gebraucht, jede Gattung der Quelle kommt vor', () => {
  const benutzt = new Set([
    ...daten.momente.flatMap((m) => m.werke),
    ...daten.kontraste.flatMap((k) => k.paar),
  ]);
  for (const w of daten.werke) assert.ok(benutzt.has(w.id), `${w.id} wird nirgends gebraucht`);
  for (const g of ['marsch', 'tanz', 'lied']) {
    assert.ok(daten.werke.some((w) => w.gattung === g), `Gattung ${g} fehlt`);
  }
  const verwaist = kopie();
  verwaist.werke.push({
    id: 'w-verwaist', titel: 'Niemandes Stück', komponist: 'J. S. Bach', art: 'komposition',
    todesjahr: 1750, gattung: 'lied', ausQuellListe: false, woran: 'Steht nur da.', eigenschaft: ['leise'],
  });
  const f = pruefeDaten(verwaist);
  assert.ok(f.some((x) => /steht in keinem Moment/.test(x)));
  // Und ein Moment, dessen Gattung kein Werk trägt, ist ein leeres Versprechen.
  const leer = kopie();
  leer.momente.find((m) => m.id === 'm-schritte').gattung = 'spieluhr';
  assert.ok(pruefeDaten(leer).some((x) => /aber kein Werk dieser Gattung/.test(x)));
});

test('jeder Moment lässt das Kind offen und erlaubt das Aufhören', () => {
  for (const m of daten.momente) {
    assert.ok(m.abbruchzeichen, m.id);
    assert.ok(m.wasDuTust.length >= 2, m.id);
    assert.match(m.wasDeinKindVielleichtTut, /vielleicht|oder|kann|manche|alles davon|nicht|muss es auch nicht|erlaubt|Glück/i, m.id);
  }
  assert.match(daten.abbruch, /Aufhören ist die Regel/);
  const erwartung = kopie();
  erwartung.momente[0].wasDeinKindVielleichtTut = 'Es wiegt sich mit.';
  assert.ok(pruefeDaten(erwartung).some((f) => /liest wie eine Erwartung/.test(f)));
  const ohneAbbruch = kopie();
  delete ohneAbbruch.momente[0].abbruchzeichen;
  assert.ok(pruefeDaten(ohneAbbruch).some((f) => /abbruchzeichen fehlt/.test(f)));
});

test('Lautstärke: die Beleglage wird gesagt, nicht überzogen', () => {
  assert.match(daten.lautstaerke, /Zimmerstimme/);
  assert.match(daten.lautstaerke, /[Kk]eine Kopfhörer/);
  // Es gibt KEINEN belegten Dezibel-Grenzwert für Kleinkinder. Die
  // umlaufende Zahl 85 dB ist ein Arbeitsschutzwert für Erwachsene bei acht
  // Stunden; die einzige internationale Kinderangabe (75 dB) ist ein
  // Wochenmittel für persönliche Audiogeräte mit Dosiszählung. Beides darf
  // nicht als Wohnzimmer-Obergrenze gedruckt werden - also steht keine Zahl
  // als Grenzwert da, und die App sagt, dass es keine gibt.
  assert.match(daten.lautstaerke, /keine Zahl|keinen Grenzwert|kein Grenzwert/);
  assert.match(daten.lautstaerke, /Arbeitsschutzwert/);
  // Der Kopfhörer-Verzicht wird NICHT mit einem belegten Hörschaden
  // begründet - dazu gibt es für unter Dreijährige keine Leitlinie -,
  // sondern mit dem, was belegbar ist: in der Nähe und ansprechbar bleiben.
  assert.match(daten.lautstaerke, /ansprechbar/);
  assert.doesNotMatch(daten.lautstaerke, /Hörschaden ist belegt|schädigt das Gehör/);
  // Eine dB-Zahl darf hier STEHEN, weil sie zurückgewiesen wird; sie darf
  // nur keine Vorgabe sein. Ein Netz auf die nackte Zahl hätte genau den
  // Satz verboten, der die falschen Zahlen entkräftet.
  assert.doesNotMatch(daten.lautstaerke, DB_ALS_VORGABE);
  assert.match(daten.lautstaerke, /85 dB/, 'die umlaufende Zahl wird beim Namen genannt');
  const vorgabe = kopie();
  vorgabe.lautstaerke = `${daten.lautstaerke} Stellen Sie höchstens 70 dB ein.`;
  assert.ok(pruefeDaten(vorgabe).some((x) => /Dezibelzahl als Vorgabe/.test(x)));
  for (const p of daten.instrumentenPaare) {
    assert.ok(p.sicherheit, p.id);
    assert.match(p.sicherheit, /Kleinteil|klein|Stab|Schnur|Mundstück/i, p.id);
  }
  const ohne = kopie();
  ohne.lautstaerke = 'Stellen Sie die Musik so laut, wie es gefällt.';
  const f = pruefeDaten(ohne);
  assert.ok(f.some((x) => /Kopfhörer müssen ausgeschlossen sein/.test(x)));
  assert.ok(f.some((x) => /Regel ohne Messgerät/.test(x)));
  assert.ok(f.some((x) => /keinen belegten Kinder-Grenzwert/.test(x)));
  assert.ok(f.some((x) => /belegbare Grund für offene Lautsprecher/.test(x)));
});

test('Druckblatt und Politik', () => {
  // Druckknopf ⇒ eigenes druck.css, und das Blatt trägt kein Vergleichs-
  // system (docs/02): kein Haken, kein Punkt, kein Stern, keine Namenszeile.
  assert.match(code, /window\.print\(\)/);
  assert.match(druck, /@media print/);
  assert.match(druck, /\.mm-nur-bildschirm \{ display: none !important/);
  assert.match(druck, /\.mm-nur-druck \{ display: block !important/);
  for (const verboten of ['Haken', 'Häkchen', 'Stern', 'Urkunde', 'geschafft', 'Name:', 'Punktestand']) {
    assert.ok(!druckRegeln.includes(verboten), `eine Druckregel erzeugt „${verboten}“`);
  }
  assert.doesNotMatch(druckRegeln, /content:\s*["'][^"']*[☐☑★⭐✔]/, 'keine Marke per content:');
  // Und das Papier selbst: weder die Daten noch der Druckteil des Codes
  // tragen Marke, Stern oder Namenszeile.
  assert.doesNotMatch(JSON.stringify(daten), /Name: ?_+|Erzählt von|Urkunde|[☐☑★⭐]/);
  const druckTeil = code.slice(code.indexOf('mm-nur-druck'), code.indexOf('mm-nur-druck') + 900);
  assert.doesNotMatch(druckTeil, /[☐☑★⭐]|Name:/);
  // Politik
  assert.match(seite, /default-src 'self'; style-src 'self' 'unsafe-inline'/);
  assert.match(seite, /<html lang="de">/);
  assert.match(seite, /<noscript>/);
  assert.match(seite, /aria-live/);
  assert.match(code, /installiereNetzwerkWaechter\(\)/);
  assert.match(code, /impressum\.html/);
  assert.doesNotMatch(JSON.stringify(daten), /https?:\/\//);
  // Speichert nichts.
  assert.doesNotMatch(code, /localStorage/);
  // Nur eine geräteinterne Stimme darf sprechen.
  // Die Zusage ist nicht „eine lokale Stimme wird GESUCHT", sondern „sie
  // wird BENUTZT": `lokaleStimme()` liegt jetzt in kinder-ui, und die
  // gefundene Stimme wird an `vorlesen()` uebergeben, das sie auf die
  // Utterance setzt. Vorher steuerte sie nur die Sichtbarkeit des Knopfes,
  // und der Browser nahm die Standardstimme - auf Android typischerweise
  // die netzbasierte. Das war ein echter Defekt (Review der Welle 78).
  assert.match(code, /lokaleStimme\('de'\)/);
  assert.match(code, /vorlesen\(text, 'de-DE', stimme\)/);
  // Nachbarschaft: die Grenzen werden verlinkt, nicht wiederholt.
  for (const nachbar of ['musik-detektive', 'klang-detektive', 'tonleiter-treppe', 'rhythmus-orchester', 'familienschatz-reime', 'bewegungs-schatzkiste']) {
    assert.match(code, new RegExp(nachbar), `Verweis auf ${nachbar} fehlt`);
  }
});

test('Hilfsfunktionen', () => {
  assert.equal(werkVon(daten, 'w-elefant').titel, 'Der Elefant');
  assert.equal(werkVon(daten, 'gibt-es-nicht'), null);
  assert.equal(momentVon(daten, 'gibt-es-nicht'), null);
  assert.equal(werkZeile(null), '');
  assert.match(werkZeile(werkVon(daten, 'w-elefant')), /Saint-Saëns: „Der Elefant“/);
  assert.match(werkZeile(werkVon(daten, 'w-schlaf-kindlein')), /\(Volksweise\)/);
  assert.match(werkZeile(werkVon(daten, 'w-kolo')), /ukrainische Volksweise/);
  assert.ok(werkeZumMoment(daten, 'm-einschlafen').length >= 3);
  assert.deepEqual(werkeZumMoment(daten, 'gibt-es-nicht'), []);
  assert.equal(vorleseText(daten, 'gibt-es-nicht'), '');
  assert.ok(GATTUNGEN.includes('wiegenlied'));
  assert.ok(WERKARTEN.includes('volksweise'));
});
