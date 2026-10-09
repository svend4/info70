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

test('keine Karte beschreibt einen Handgriff am Kind', () => {
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
  // vorlesen() aus kinder-ui wählt keine Stimme aus, und Web-Speech-Stimmen
  // sind nicht garantiert geräteintern. Der NetzwerkWaechter patcht nur
  // fetch, XMLHttpRequest und WebSocket.
  assert.match(code, /localService/);
  assert.match(code, /getVoices/);
  assert.match(code, /startsWith\('de'\)/);
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
