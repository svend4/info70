import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  AUSGANGSLAGEN, ROLLEN, ORTE, GESPERRTES_VOKABULAR, GESPERRTE_WIRKUNG,
  karteVon, kartenFuer, karteText, fensterSatz, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/kartei.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
// Ohne Kommentare: die Kommentare NENNEN, was nicht vorkommen darf
// („kein localStorage-Schlüssel“) – ein Test auf den Rohtext träfe sich
// selbst. Dieselbe Falle wie der /XMLHttpRequest/-Check in Welle 76.
const code = app.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const paket = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const druck = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
const seite = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('Daten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.karten.length >= 10);
});

test('keine Säuglingsgymnastik – und der Anspruch geht nur so weit', () => {
  // Die erste Fassung versprach „keine Karte beschreibt einen Handgriff am
  // Kind“. Das war zu stark und ist im Review gefallen: Tragen ist eine
  // Handlung am Kind, `auf-dem-arm` ist eine gehaltene Lage, und b04
  // beschreibt flächiges Streichen. Der Anspruch ist auf das Wahre verengt.
  assert.match(daten.hinweis, /keine Säuglingsgymnastik/);
  assert.doesNotMatch(daten.hinweis, /keinen? Handgriff am Kind/);
  assert.match(daten.hinweis, /flächig streichen als Kontakt/);
  assert.ok(daten.karten.some((k) => k.ausgangslage === 'auf-dem-arm'), 'Tragen kommt vor und wird nicht geleugnet');
  const mut = kopie();
  mut.hinweis = 'Diese Kartei beschreibt keinen Handgriff am Kind.';
  assert.ok(pruefeDaten(mut).some((f) => /nur so weit gehen, wie er stimmt/.test(f)));
});

test('der weitere Anspruch wird abgewiesen, nicht nur der engere verlangt', () => {
  // Vorher prüfte der Validator nur, dass „keine Säuglingsgymnastik“
  // DASTEHT. Ein hinweis, der beides enthielt, wäre durchgegangen - und
  // genau das behauptete das GDD als geprüft (Review der Welle 78). Die
  // eigene Gegenprobe fand dann, dass die erste Fassung der neuen Regel die
  // Verneinung direkt vor dem Wort verlangte und den Satz durchliess.
  for (const zusatz of [
    'Und keine Karte beschreibt einen Handgriff am Kind.',
    'Kein Handgriff am Kind.',
    'Es gibt keinerlei Handgriffe am Kind.',
    'Nichts am Körper des Kindes.',
  ]) {
    const mut = kopie();
    mut.hinweis = `${daten.hinweis} ${zusatz}`;
    assert.ok(pruefeDaten(mut).some((f) => /geht zu weit/.test(f)), zusatz);
  }
  // Und der enge Satz muss die eine Karte mit Körperkontakt nennen.
  assert.match(daten.hinweis, /flächig streichen als Kontakt/);
  const ohne = kopie();
  ohne.hinweis = 'Diese Kartei beschreibt keine Säuglingsgymnastik.';
  assert.ok(pruefeDaten(ohne).some((f) => /Karte mit Körperkontakt/.test(f)));
});

test('die Bodenregel nennt ihren Geltungsbereich – sie gilt nicht auf dem Arm', () => {
  // Der Nur-Druck-Block sagte „Gilt für jede Karte“ und dann die
  // Bodenregel. Eine Karte spielt auf dem ARM, und dort gilt sie nicht
  // (Review der Welle 78).
  assert.ok(daten.karten.some((k) => k.ausgangslage === 'auf-dem-arm'));
  assert.match(daten.bodenregel, /bei der dein Kind liegt|auf dem Boden/);
  assert.match(daten.bodenregel, /Ausnahme/);
  assert.match(code, /Gilt für jede Karte auf dem Boden/);
  assert.doesNotMatch(code, /'⚠️ Gilt für jede Karte'/);
  const ohne = kopie();
  ohne.bodenregel = 'Alles auf einer festen Decke auf dem Boden.';
  assert.ok(pruefeDaten(ohne).some((f) => /Ausnahme für den Arm/.test(f)));
  const ohneBereich = kopie();
  ohneBereich.bodenregel = 'Nie auf Wickeltisch oder Sofa. Die Ausnahme steht auf der Karte.';
  assert.ok(pruefeDaten(ohneBereich).some((f) => /Geltungsbereich fehlt/.test(f)));
});

test('gesperrtes Vokabular gilt auch im Sicherheitssatz – aber nur bejahend', () => {
  // GESPERRTES_VOKABULAR lief nur auf den Anweisungsfeldern. Eine
  // Sicherheitszeile hätte „Reflex“ oder „Übung“ einführen können - an der
  // Stelle, die der Erwachsene am aufmerksamsten liest (Review der Welle 78).
  const bejahend = kopie();
  bejahend.karten[0].sicherheit = `${bejahend.karten[0].sicherheit} Danach eine kurze Übung anschließen.`;
  assert.ok(pruefeDaten(bejahend).some((f) => /sicherheit: „Übung“ steht dort nicht verneint/.test(f)));
  // Verneint muss es erlaubt bleiben, sonst könnte eine Sicherheitszeile das
  // Verbotene nicht aussprechen.
  const verneint = kopie();
  verneint.karten[0].sicherheit = `${verneint.karten[0].sicherheit} Keine Übung, kein Reflex.`;
  assert.deepEqual(pruefeDaten(verneint), []);
  // Und die anatomische Wirbelsäule ist keine verbotene Bewegung: der nackte
  // Stamm „wirbel“ traf genau den Begriff, mit dem eine Sicherheitszeile
  // sagt, wo man NICHT hinfasst.
  const netz = GESPERRTES_VOKABULAR.find((g) => g.wort === 'wirbeln').muster;
  assert.doesNotMatch('nichts an Wirbelsäule, Hals oder Kopf', netz);
  assert.match('wirbelt das Kind herum', netz);
  assert.match('herumwirbeln', netz);
});

test('die Verneinung der Öle wird an JEDER Fundstelle geprüft', () => {
  // `indexOf(treffer)` fand immer das erste Vorkommen derselben
  // Zeichenfolge: stand „kein Kampfer“ vor „mit Kampfer einreiben“, galt der
  // zweite, bejahende Gebrauch als verneint (Review der Welle 78).
  const mut = kopie();
  const k = mut.karten.find((x) => /Kampfer/.test(String(x.sicherheit ?? '')));
  assert.ok(k, 'eine Karte nennt Kampfer verneint');
  k.ohneWirkung = 'Kein Kampfer verwenden. Wer mag, kann mit Kampfer einreiben.';
  assert.ok(pruefeDaten(mut).some((f) => /steht nicht verneint/.test(f)));
});

test('die Bodenregel steht auch auf dem Papier', () => {
  // Sie gilt für JEDE Karte und stand nur im Vorwort, das nicht mitgedruckt
  // wird – auf dem Papier fehlte sie damit ganz.
  assert.match(daten.bodenregel, /nie auf Wickeltisch/);
  assert.match(code, /bk-nur-druck/);
  assert.match(code, /daten\.bodenregel/);
  assert.match(druck, /\.bk-nur-druck \{ display: block/);
  const mut = kopie();
  mut.bodenregel = 'Auf einer Decke.';
  assert.ok(pruefeDaten(mut).some((f) => /bodenregel/.test(f)));
});

test('gefährliche Zubereitungen nur verneint, und nie in einer Anweisung', () => {
  // Vorher gab es dazu überhaupt keine Validator-Regel – nur einen Test über
  // drei Felder, dessen Kommentar mehr behauptete, als er prüfte.
  for (const [feld, text] of [['sicherheit', 'Nimm ätherisches Öl zum Streichen.'], ['ohneWirkung', 'Kampfersalbe hilft beim Einschlafen.']]) {
    const mut = kopie();
    mut.karten[3][feld] = text;
    assert.ok(pruefeDaten(mut).some((f) => /nicht verneint/.test(f)), text);
  }
  const anweisung = kopie();
  anweisung.karten[3].wasDuVorbereitest[0] = 'Nimm Eukalyptusöl.';
  assert.ok(pruefeDaten(anweisung).some((f) => /Anweisungsfeld/.test(f)));
  // Der Verweis „welches Öl geht, sagt dir die Hebamme“ bleibt erlaubt: das
  // bloße „Öl“ steht absichtlich nicht im Muster.
  assert.match(karteVon(daten, 'b04').sicherheit, /Welches Öl geht/);
});

test('alle sechzehn Gymnastik-Maßnahmen sind zugeordnet', () => {
  // Die Zahl 16 = 3 + 13 stimmte, war aber in den Daten nicht
  // nachvollziehbar: zwei Maßnahmen (g04, g15) fehlten ganz.
  const uebernommen = new Set(daten.karten.flatMap((k) => k.quellZiel.filter((z) => typeof z === 'string')));
  const ausgeschlossen = new Set(daten.ausgeschlossen.flatMap((a) => String(a.quellNr ?? '').match(/g\d{2}/g) ?? []));
  for (let i = 1; i <= 16; i++) {
    const id = `g${String(i).padStart(2, '0')}`;
    assert.ok(uebernommen.has(id) || ausgeschlossen.has(id), `${id} ist nirgends zugeordnet`);
  }
  assert.equal(uebernommen.size, daten.quelle.zahlen.gymnastikUebernommen);
  assert.equal(ausgeschlossen.size, daten.quelle.zahlen.gymnastikNichtUebernommen);
  const mut = kopie();
  mut.karten.find((k) => k.id === 'b10').quellZiel = [12, 15, 19];
  assert.ok(pruefeDaten(mut).some((f) => /nirgends|weder einer Karte/.test(f)));
});

test('Zahlwörter: Maße sind schreibbar, Wiederholungszahlen nicht', () => {
  // Die erste Fassung ohne Schlussgrenze traf „dreißig“ im Maß; mit einer
  // Liste von -mal-Formen fehlte „Zehnmal“. Jetzt ist `-mal` ein Suffix.
  const mut = (text) => { const k = kopie(); k.karten[0].wasDuVorbereitest[1] = text; return pruefeDaten(k); };
  assert.deepEqual(mut('Etwa zwanzig bis dreißig Zentimeter.'), [], 'ein Maß muss schreibbar sein');
  assert.deepEqual(mut('Leg ein Tuch hin.'), [], 'der Artikel ist keine Zahl');
  for (const text of ['Zehnmal auf jeder Seite.', 'Hüpf dreimal.', 'Fünf Minuten.', '3 Wiederholungen.']) {
    assert.ok(mut(text).some((f) => /Zahl im Anweisungstext/.test(f)), text);
  }
  // Und die Nahdistanz steht statt der Armlänge.
  assert.doesNotMatch(JSON.stringify(daten), /Armlänge/);
  assert.match(karteVon(daten, 'b01').wasDuVorbereitest.join(' '), /Handspanne/);
});

test('die WHO-Beispiele sind die der WHO', () => {
  // Genannt sind Kinderwagen, Hochstuhl und das Tragen am Körper – nicht
  // „Buggy“ als zweites Wort für den Wagen.
  const b09 = karteVon(daten, 'b09');
  assert.match(b09.sicherheit, /als Beispiele nennt sie/);
  assert.match(b09.sicherheit, /Tragen am Körper/);
  assert.match(b09.sicherheit, /eine Stunde am Stück/);
});

test('Altersangaben: Komposita werden mitgefangen', () => {
  // `/\bMonat|\bWoche/` scheiterte an „Lebensmonat“ doppelt: der Stamm steht
  // klein und hinter einem Wortzeichen.
  for (const text of ['Ab dem zweiten Lebensmonat.', 'In der ersten Lebenswoche.', 'Im ersten Lebensjahr.']) {
    const mut = kopie();
    mut.koennen[0].beschreibung = text;
    assert.ok(pruefeDaten(mut).some((f) => /nennt ein Alter/.test(f)), text);
  }
});

test('der Handgriff-Teil: Erwachsenen-Formen gesperrt, kindliche erlaubt', () => {
  // Das ist die tragende Entscheidung. Strukturell abgesichert, nicht
  // redaktionell: `rolle` hat keinen Wert „ueben“, `ausgangslage` keinen
  // für eine gehaltene Haltung, `ort` nur Boden und Arm.
  assert.ok(!ROLLEN.includes('ueben'), 'die Rollenliste darf kein „üben“ enthalten');
  assert.deepEqual([...ORTE], ['boden', 'auf-dem-arm']);
  for (const verboten of ['wickeltisch', 'sofa', 'bett', 'tisch']) {
    assert.ok(!ORTE.includes(verboten), `${verboten} darf kein Ort sein`);
  }
  for (const k of daten.karten) {
    assert.ok(AUSGANGSLAGEN.includes(k.ausgangslage), k.id);
    assert.equal(ORTE.includes(k.ort), true, k.id);
  }
  // Gegenprobe: eine Erwachsenen-Handlung am Kind muss auffallen.
  for (const satz of [
    'Zieh dein Kind an den Händen hoch.',
    'Setz dein Kind hin und stütze den Rücken.',
    'Halte es unter den Achseln und lass es schreiten.',
    'Beuge und strecke die Beine passiv.',
    'Löse das reflektorische Kriechen aus.',
  ]) {
    const mut = kopie();
    mut.karten[0].wasDuVorbereitest[0] = satz;
    assert.ok(pruefeDaten(mut).some((f) => /gehört nicht in eine Karte/.test(f)), satz);
  }
  // Und das Gegenteil: das KIND, das sich selbst hochzieht, ist der Zweck.
  const gut = kopie();
  gut.karten[0].wasDeinKindTut = 'Es zieht sich am Sofa hoch und steht.';
  assert.deepEqual(pruefeDaten(gut), [], 'das Kind darf sich selbst hochziehen');
  assert.ok(daten.karten.some((k) => /zieht sich/.test(JSON.stringify(k))), 'der Fall kommt auch wirklich vor');
});

test('„Übung“ trifft auch in der Zusammensetzung', () => {
  // Gegenfalle zum \b-Problem aus Welle 77: hier muss das Muster den Stamm
  // auch in „Sitzübung“ oder „Reflexkriechen“ finden, also OHNE Grenze.
  const uebung = GESPERRTES_VOKABULAR.find((g) => g.wort === 'Übung');
  assert.ok(uebung.muster.test('Sitzübung'), 'Komposita müssen treffen');
  assert.ok(uebung.muster.test('Übung'));
  const reflex = GESPERRTES_VOKABULAR.find((g) => g.wort === 'Reflex');
  assert.ok(reflex.muster.test('Reflexkriechen'));
  const mut = kopie();
  mut.karten[0].titel = 'Sitzübung am Morgen';
  assert.ok(pruefeDaten(mut).some((f) => /„Übung“/.test(f)));
});

test('Bauchlage ist ohne den Satz zum Schlafen nicht ausdrückbar', () => {
  // Die Bauchlage im Schlaf ist neben dem Rauchen der größte vermeidbare
  // Risikofaktor für den plötzlichen Kindstod. Eine Karte, die zur
  // Bauchlage einlädt, ohne den Schlaf-Satz, ist die gefährlichste Form,
  // die diese App annehmen kann.
  const bauch = daten.karten.filter((k) => k.ausgangslage === 'bauchlage-wach');
  assert.ok(bauch.length >= 2, 'die Bauchlage im Wachzustand ist der Kern der ersten Monate');
  for (const k of bauch) {
    assert.match(k.schlafhinweis, /Rücken/, k.id);
    assert.match(k.schlafhinweis, /[Ss]chlaf/, k.id);
    assert.match(k.sicherheit, /[Ww]ach/, k.id);
  }
  for (const feld of ['schlafhinweis', 'sicherheit']) {
    const mut = kopie();
    const ziel = mut.karten.find((k) => k.ausgangslage === 'bauchlage-wach');
    ziel[feld] = feld === 'sicherheit' ? 'Immer dabeibleiben.' : 'Ganz entspannt.';
    assert.ok(pruefeDaten(mut).length > 0, `${feld} darf nicht beliebig sein`);
  }
});

test('die Kartei ordnet nach Können, nicht nach Monaten', () => {
  // Die Meilensteinliste und die Altersfenster gehören
  // apps/meilenstein-begleiter – zwei Alterskataloge im Korpus wären zwei
  // Wahrheiten über dasselbe Kind.
  for (const c of daten.koennen) {
    assert.doesNotMatch(`${c.name} ${c.beschreibung}`, /Monat|Woche|\d/, c.id);
  }
  for (const k of daten.karten) {
    const text = [k.titel, ...k.wasDuVorbereitest, k.wasDeinKindTut].join(' ');
    assert.doesNotMatch(text, /(^|[^a-zäöüß])(Monat|Woche)/, k.id);
  }
  const mut = kopie();
  mut.koennen[0].beschreibung = 'Ihr Kind ist etwa 3 Monate alt.';
  assert.ok(pruefeDaten(mut).some((f) => /nennt ein Alter/.test(f)));
  assert.ok(kartenFuer(daten, 'k1').length >= 2);
  assert.equal(karteVon(daten, 'gibtsnicht'), null);
});

test('keine Zahl im Anweisungstext – kein Minutenplan, keine Wiederholungen', () => {
  for (const satz of ['Zehnmal auf jeder Seite.', 'Fünf Minuten am Morgen.', '3 Wiederholungen.']) {
    const mut = kopie();
    mut.karten[0].wasDuVorbereitest[0] = satz;
    assert.ok(pruefeDaten(mut).some((f) => /Zahl im Anweisungstext/.test(f)), satz);
  }
  // Die WHO-Zahlen stehen getrennt, mit Spanne und Quelle.
  assert.match(fensterSatz(daten, 'sitzen-frei'), /3,8/);
  assert.match(fensterSatz(daten, 'sitzen-frei'), /Perzentile/);
  assert.match(fensterSatz(daten, 'krabbeln'), /nicht jedes Kind/);
  assert.equal(fensterSatz(daten, 'gibtsnicht'), '');
});

test('kein Wirkversprechen zur Babymassage', () => {
  // Beim gesunden reifen Säugling schwach belegt; die tragfähigen Studien
  // kommen aus der Frühgeborenen-Versorgung und sind nicht übertragbar.
  assert.ok(GESPERRTE_WIRKUNG.test('Bessere Verdauung durch Massage.'));
  assert.ok(GESPERRTE_WIRKUNG.test('Das Baby schläft dann besser.'));
  const mut = kopie();
  mut.karten[3].wasDeinKindTut = 'Es bekommt bessere Verdauung und weniger Koliken.';
  assert.ok(pruefeDaten(mut).some((f) => /Wirkversprechen/.test(f)));
  const massage = daten.karten.find((k) => /[Ss]treichen/.test(k.titel));
  assert.ok(massage, 'die Massage ist als Kontakt-Angebot übernommen');
  assert.match(massage.ohneWirkung, /nicht gut belegt/);
  // Die Öle MÜSSEN im Sicherheitssatz vorkommen – sonst kann er sie nicht
  // ausschließen. Geprüft wird darum, dass sie nur verneint auftreten und
  // in keinem Anweisungsfeld stehen.
  assert.match(massage.sicherheit, /Kein ätherisches Öl, kein Kampfer, kein Menthol/);
  for (const k of daten.karten) {
    const anweisung = [k.titel, ...k.wasDuVorbereitest, k.wasDeinKindTut].join(' ');
    assert.doesNotMatch(anweisung, /Kampfer|Menthol|ätherisch/, `${k.id}: Öl in der Anweisung`);
  }
  assert.doesNotMatch(JSON.stringify(daten), /mit Öl einreiben|Öl auftragen|Erkältungsbad/i);
});

test('die Ausschlussliste ist Teil der Daten und deckt die Quelle ab', () => {
  // Von den 16 Gymnastik-/Massage-Maßnahmen der Quelle (S. 35-36) sind 13
  // nicht übernommen. Diese Liste steht in den Daten, nicht im Vorwort,
  // damit ein Test sie halten kann.
  assert.ok(daten.ausgeschlossen.length >= 10);
  const alles = JSON.stringify(daten.ausgeschlossen);
  for (const thema of ['Reflex', 'assive', 'Chassaignac', 'Lauflernhilfe', 'Bauchlage zum Schlafen', 'Kampfer']) {
    assert.match(alles, new RegExp(thema), `Ausschlussliste nennt ${thema} nicht`);
  }
  const mut = kopie();
  mut.ausgeschlossen = mut.ausgeschlossen.slice(0, 3);
  assert.ok(pruefeDaten(mut).some((f) => /ausgeschlossen: mindestens/.test(f)));
  const ohneGrund = kopie();
  ohneGrund.ausgeschlossen[0].grund = 'kurz';
  assert.ok(pruefeDaten(ohneGrund).some((f) => /grund fehlt oder ist zu kurz/.test(f)));
});

test('die Quellbilanz wird gegen die Karten nachgerechnet', () => {
  // Ein Dokument darf nicht mehr behaupten als die Daten hergeben
  // (docs/02, Welle 77). Die Zahlen der Quelle sind nachgezählt: 26
  // Bewegungsziele, 16 Gymnastik-/Massage-Maßnahmen, 4 Sicherheitsziele.
  const z = daten.quelle.zahlen;
  assert.equal(z.bewegungszieleQuelle, 26);
  assert.equal(z.gymnastikMassnahmenQuelle, 16);
  assert.equal(z.sicherheitszieleQuelle, 4);
  const belegt = new Set(daten.karten.flatMap((k) => k.quellZiel.filter(Number.isInteger)));
  assert.equal(belegt.size, z.bewegungszieleUebernommen);
  assert.equal(z.bewegungszieleUebernommen + z.bewegungszieleNichtUebernommen, 26);
  assert.equal(z.gymnastikUebernommen + z.gymnastikNichtUebernommen, 16);
  // Die fünf nicht übernommenen Ziele sind genau die, in denen der
  // Erwachsene das Kind hält.
  assert.deepEqual([...Array(26).keys()].map((i) => i + 1).filter((n) => !belegt.has(n)), [6, 11, 16, 17, 20]);
  const luege = kopie();
  luege.quelle.zahlen.bewegungszieleUebernommen = 26;
  assert.ok(pruefeDaten(luege).some((f) => /behauptet/.test(f)));
  assert.match(daten.quelle.uebernommen, /Eigenproduktion/);
  assert.match(daten.quelle.abschnitte, /S\. 34–35|S\. 35–36/);
});

test('die App speichert nichts', () => {
  // Ein Fortschrittsmerker wäre hier gleichzeitig ein Protokoll über ein
  // Kind und ein Punktestand. Vorbild bewegungs-schatzkiste.
  assert.doesNotMatch(code, /localStorage|sessionStorage|indexedDB/);
  assert.doesNotMatch(code, /beobachtet|geschafft|erledigt|fortschritt/i);
  assert.doesNotMatch(code, /datenKarte/);
  // Der Kommentar NENNT localStorage, um die Entscheidung zu begründen –
  // deshalb läuft die Prüfung auf dem Code ohne Kommentare.
  assert.match(app, /speichert NICHTS/);
});

test('kein Bildschirm fürs Kind, keine Bewertung, kein Scoring', () => {
  assert.match(daten.geraet, /Hand/);
  assert.doesNotMatch(JSON.stringify(daten), /Punkte|Sterne|Rang|Ampel|Prozent|%/);
  assert.doesNotMatch(code, /punkte|rekord|rang/i);
  // Kein Zähler über erledigte Karten – die Zahl in der Anzeige ist die
  // Zahl der angebotenen Ideen, nicht der gemachten.
  assert.match(code, /liste\.length/);
  assert.doesNotMatch(code, /von \$\{daten\.karten\.length\}/);
});

test('Vorlesen nur mit einer Stimme, die auf dem Gerät liegt', () => {
  // Web-Speech-Stimmen sind nicht garantiert geräteintern, und der
  // NetzwerkWaechter patcht nur fetch, XMLHttpRequest und WebSocket.
  // Die Zusage ist nicht „eine lokale Stimme wird GESUCHT", sondern „sie
  // wird BENUTZT": `lokaleStimme()` liegt jetzt in kinder-ui, und die
  // gefundene Stimme wird an `vorlesen()` uebergeben, das sie auf die
  // Utterance setzt. Vorher steuerte sie nur die Sichtbarkeit des Knopfes,
  // und der Browser nahm die Standardstimme - auf Android typischerweise
  // die netzbasierte. Das war ein echter Defekt (Review der Welle 78).
  assert.match(code, /lokaleStimme\('de'\)/);
  assert.match(code, /vorlesen\(text, 'de-DE', stimme\)/);
  // getVoices() und die Sprachprüfung liegen jetzt in kinder-ui; dort
  // werden sie auch geprüft (packages/kinder-ui/test/vorlesen.test.mjs).
  assert.match(code, /keine deutsche Stimme/);
});

test('Druckblatt: ein Kärtchen je Idee, kein Protokoll', () => {
  assert.match(code, /window\.print\(\)/);
  assert.match(druck, /@media print/);
  assert.match(druck, /\.bk-nur-bildschirm \{ display: none/);
  assert.match(druck, /break-inside: avoid/);
  const druckTeil = druck.slice(druck.indexOf('@media print'));
  for (const verboten of ['Name', 'Woche', 'Stern', 'Haken', 'geschafft']) {
    assert.ok(!druckTeil.includes(verboten), `Druck enthält ${verboten}`);
  }
  // Die Bildschirm-Teile, die nicht aufs Papier gehören, tragen die Klasse.
  assert.ok((code.match(/bk-nur-bildschirm/g) ?? []).length >= 6);
});

test('Abgrenzung: die Nachbar-Apps werden benannt, nicht kopiert', () => {
  assert.match(code, /meilenstein-begleiter/);
  assert.match(code, /bewegungs-schatzkiste/);
  assert.match(paket.description, /meilenstein-begleiter/);
  assert.match(paket.description, /bewegungs-schatzkiste/);
});

test('Sicherheit und Aufhören stehen auf jeder Karte', () => {
  for (const k of daten.karten) {
    assert.ok(k.sicherheit.length >= 20, k.id);
    assert.ok(k.abbruchzeichen, k.id);
  }
  assert.match(daten.abbruch, /Aufhören ist die Regel/);
  assert.match(daten.schuetteln, /0800 111 0 550/);
  assert.match(daten.zustaendigkeit, /Keine der genannten Stellen hat diese Kartei geprüft oder freigegeben/);
  // Keine Hilfe-Insel: das ist ein Erwachsenen-Werkzeug, die Nummer
  // 116 111 adressiert hier niemanden. Das Elterntelefon steht als Text.
  assert.doesNotMatch(code, /hilfeInsel|hilfe-insel/);
  assert.doesNotMatch(code, /116\s?111/);
});

test('Seite und Politik: CSP, Vorlesen, Impressum, offline', () => {
  assert.match(seite, /lang="de"/);
  assert.match(seite, /<title>/);
  assert.match(seite, /width=device-width/);
  assert.match(seite, /default-src 'self'/);
  assert.match(seite, /<main/);
  assert.match(seite, /<noscript>/);
  assert.match(seite, /aria-live/);
  assert.match(code, /installiereNetzwerkWaechter\(\)/);
  assert.match(code, /impressum\.html/);
  assert.doesNotMatch(JSON.stringify(daten), /https?:\/\//);
  assert.doesNotMatch(code, /fetch\('https/);
});

test('karteText liest nur Erwachsenentext und nennt Sicherheit und Aufhören', () => {
  const k = karteVon(daten, 'b05');
  const t = karteText(k);
  assert.match(t, /Sicherheit:/);
  assert.match(t, /Zum Schlafen:/);
  assert.match(t, /Aufhören:/);
  assert.equal(karteText(null), '');
  // Eine Karte ohne Abbruchzeichen-Text („–“) erzeugt keine leere Zeile.
  const ohne = karteVon(daten, 'b11');
  assert.doesNotMatch(karteText(ohne), /Aufhören:/);
});
