import { test } from 'node:test';
import assert from 'node:assert/strict';
import daten from '../daten/tanze.json' with { type: 'json' };
import {
  alleGewaehlt, alleKennungen, ARTEN, auswahlKennung, EIGENENTWURF, filterKennung, gewaehlteTanze,
  kannDrucken, kartenText, melodieText, PFLICHTSATZ, quelleText, satzZahl, sichtbar, sichtbareAbwaehlen,
  sichtbareWaehlen, umschalten, zaehlerText,
} from '../logik.mjs';

// Prüft Daten und Auswahl. Die Regeln der Umgebung (Eingabefelder, Speicherung,
// Netz, Druckzeichen, Fokus, Testzahl) stehen in test/regeln.test.mjs.

const TANZ = daten.tanze.filter((t) => t.art === 'tanz');
const KOMPONIST = daten.tanze.filter((t) => t.art === 'komponist');
const wortZahl = (text) => text.trim().split(/\s+/).length;

// Die 20 Titel mit Volksmelodie-Angabe aus S. 267, in Quellenfolge (Absätze „Танцы“
// und „Белорусские пляски“). Der mexikanische Tanz hat keinen Eigentitel in der Quelle.
const STARTUMFANG = [
  'Полька', 'Травушка-муравушка', 'Калина', 'Чеботуха', 'Сударушка', 'Гопак', 'Казачок', 'Коло',
  'Шастак', 'мексиканский танец',
  'Трасуха', 'Весялуха', 'Крыжачок', 'Лявонiха', 'Бульба', 'Грачанiкi', 'Ойра', 'Перапёлачка',
  'Мiкiта', 'Полька-Янка',
];

// Abschrift von S. 267 der Praleska, die Absätze „Танцы“ und „Белорусские пляски“, mit
// zusammengezogenen Zeilen (Silbentrennung am Zeilenende entfernt). Sie dient nur dem
// Vergleich der Zitate; die App zeigt sie nicht.
const S267 = [
  'Танцы: «Менуэт», муз. Л. Боккерини; «Мазурка», муз. П. Чайковского; «Полонез», муз. М. ',
  'Огиньского; «Итальянская полька», муз. С. Рахманинова; танец с бубнами «Неаполитанская песенка», ',
  'муз. П. Чайковского; испанский танец «Арагонская хота», муз. М. Глинки; «Танец с саблями», муз. ',
  'А. Хачатуряна; «Узбекский танец», муз. Р. Глиера (отрывок из музыкальной драмы «Гульсара»); ',
  'восточный танец — отрывки из балета «Лебединое озеро», «Щелкунчик», муз. П. Чайковского; танец ',
  'дружбы «Веселые тройки», муз. Н. Александровой; «Полька», хорват. нар. мел. (обр. В. Герчик); ',
  'русский танец «Травушка-муравушка» или «Ходила младешенька по борочку», рус. нар. мел.; танец с ',
  'платочками «Калина», рус. нар. мел.; танец мальчиков «Чеботуха», рус. нар. мел. (обр. В. ',
  'Златарева); «Сударушка», рус. нар. мел. (обр. Ю. Слонова); «Гопак», «Казачок», «Коло», укр. нар. ',
  'мел.; танец парами «Шастак», бел. нар. мел. (обр. Д. Камiнскага) или «Кацілася чорна галка» ',
  '(обр. А. Рэмізоўскай); мексиканский танец, мексик. нар. мел.; итальянский танец; испанский ',
  'танец; китайский танец; «Трапятуха», муз. В. Волах (обр. І. Кавалеўскага); «Трасуха», муз. А. ',
  'Пыталева, сл. М. Чарняўскага; танец с куклами «Кукляндия», муз. П. Овсянникова, сл. М. ',
  'Пляцковского и др. Белорусские пляски: «Трасуха», «Весялуха», «Крыжачок», «Лявонiха», «Бульба», ',
  '«Грачанiкi», «Ойра», «Перапёлачка», «Мiкiта», «Шастак», бел. нар. мел.; «Полька-Янка», бел. нар. ',
  'мел. (обр. Д. Ардзянтава) и др.',
].join('');

// Die neun belarussischen Titel: ihr Zitat steht auf S. 267 nicht als zusammenhängender
// Wortlaut, weil Titel und Angabe in einer Liste stehen. Ihre Quellenangabe ist deshalb
// die Listen-Fassung.
const LISTE_S267 = 'Liste S. 267: belarussische Tänze (Umschrift Eigenentwurf)';
const NEUN = ['trasucha', 'wesjaluha', 'kryschatschok', 'ljawonicha', 'bulba', 'gratschaniki', 'ojra',
  'perapjolatschka', 'mikita'];

test('Daten: 22 Tanzkarten, davon 20 mit Volksmelodie-Angabe und 2 mit Komponistenangabe; Kennungen eindeutig; Pflichtfelder gesetzt', () => {
  assert.equal(daten.tanze.length, 22);
  assert.equal(TANZ.length, 20);
  assert.equal(KOMPONIST.length, 2);
  const ids = alleKennungen(daten);
  assert.equal(new Set(ids).size, ids.length, 'doppelte Kennung');
  for (const t of daten.tanze) {
    for (const feld of ['id', 'art', 'name_de', 'absatz', 'quelle_zitat', 'schritte', 'hinweis']) {
      assert.ok(typeof t[feld] === 'string' && t[feld].trim() !== '', `${t.id}: Feld ${feld} fehlt`);
    }
    assert.ok(Number.isInteger(t.seite), `${t.id}: Seite fehlt`);
  }
});

test('Startumfang und Zitatprüfung: die 20 Titel stehen in Quellenfolge wie auf S. 267; jeder Titel steht auf S. 267; jedes Quellenzitat steht wörtlich dort, außer den neun belarussischen Titeln mit der Listen-Fassung', () => {
  assert.deepEqual(TANZ.map((t) => t.quelltitel || 'мексиканский танец'), STARTUMFANG);
  for (const t of TANZ) {
    assert.ok(['Танцы', 'Белорусские пляски'].includes(t.absatz), `${t.id}: Absatz nicht auf S. 267`);
    if (t.quelltitel) assert.ok(S267.includes(`«${t.quelltitel}»`), `${t.id}: Titel steht nicht auf S. 267`);
    if (NEUN.includes(t.id)) {
      assert.equal(t.quelle_zitat, LISTE_S267, `${t.id}: Quellenangabe ist nicht die Listen-Fassung`);
      assert.ok(S267.includes('бел. нар. мел.'), `${t.id}: die Liste S. 267 nennt keine belarussische Angabe`);
    } else {
      assert.ok(S267.includes(t.quelle_zitat), `${t.id}: Quellenzitat steht nicht wörtlich auf S. 267`);
      assert.match(t.quelle_zitat, /нар\. мел\./, `${t.id}: keine Volksmelodie-Angabe`);
    }
  }
  assert.deepEqual(TANZ.filter((t) => t.quelle_zitat === LISTE_S267).map((t) => t.id), NEUN);
});

test('Tanzart mit Komponistenangabe: nur Menuett und Polonaise, mit „муз.“, ohne Volksmelodie-Angabe und ohne Melodie-Zeile', () => {
  assert.deepEqual(KOMPONIST.map((t) => t.name_de), ['Menuett', 'Polonaise']);
  for (const t of KOMPONIST) {
    assert.match(t.quelle_zitat, /муз\. /, `${t.id}: keine Komponistenangabe`);
    assert.ok(!/нар\. мел\./.test(t.quelle_zitat), `${t.id}: Volksmelodie-Angabe bei einem Komponisten-Eintrag`);
    assert.equal(melodieText(t), '', `${t.id}: Melodie-Zeile bei einem Komponisten-Eintrag`);
  }
});

test('Seiten: jede Karte nennt S. 267; die Altersgruppe belegt S. 6; die Bewegungsbegriffe stehen auf S. 265 oder 266', () => {
  for (const t of daten.tanze) {
    assert.equal(t.seite, 267, `${t.id}: nicht S. 267`);
    assert.ok(quelleText(t).includes('S. 267'), `${t.id}: Quellenzeile ohne Seite`);
  }
  assert.match(daten.altersgruppe, /Quelle S\. 6\)/);
  for (const b of daten.bewegungsbegriffe) {
    assert.match(b.seite, /^S\. 265( bis 266)?$|^S\. 266$/, `${b.zitat}: Seite ${b.seite}`);
  }
});

test('Melodie-Herkunft nur aus der Quelle: jede Volksmelodie trägt „(Quelle S. 267)“; keine Tanz-Herkunft in den Daten', () => {
  for (const t of TANZ) {
    assert.match(melodieText(t), /Volksmelodie \(Quelle S\. 267\)$/, `${t.id}: Melodie ohne Quellenangabe`);
  }
  for (const t of daten.tanze) {
    assert.ok(!('herkunft' in t) || t.herkunft === '', `${t.id}: Tanz-Herkunft steht in den Daten`);
  }
});

test('Zitate: Quellenzitat, Titel und Alternative haben höchstens 12 Wörter; Bewegungsbegriffe ebenso', () => {
  for (const t of daten.tanze) {
    assert.ok(wortZahl(t.quelle_zitat) <= 12, `${t.id}: Zitat hat ${wortZahl(t.quelle_zitat)} Wörter`);
    if (t.quelltitel) assert.ok(wortZahl(t.quelltitel) <= 12, `${t.id}: Titel zu lang`);
    if (t.alternativ_zitat) assert.ok(wortZahl(t.alternativ_zitat) <= 12, `${t.id}: Alternative zu lang`);
  }
  for (const b of daten.bewegungsbegriffe) {
    assert.ok(wortZahl(b.zitat) <= 12, `Bewegungsbegriff zu lang: ${b.zitat}`);
  }
});

test('Schrittbeschreibung hat 2 bis 4 Sätze; jede Karte kennzeichnet Schritte und Hinweis als Eigenentwurf', () => {
  for (const t of daten.tanze) {
    const n = satzZahl(t.schritte);
    assert.ok(n >= 2 && n <= 4, `${t.id}: ${n} Sätze in der Schrittbeschreibung`);
    const text = kartenText(t, daten);
    assert.ok(text.includes(`Schrittbeschreibung (${EIGENENTWURF})`), `${t.id}: Schritte ohne Kennzeichnung`);
    assert.ok(text.includes(`Hinweis zur Bewegung (${EIGENENTWURF})`), `${t.id}: Hinweis ohne Kennzeichnung`);
  }
});

test('Filter nach Tanzart: alle 22, Tanz 20, Komponist 2; alle Filter- und Auswahlkennungen sind eindeutig', () => {
  assert.equal(sichtbar(daten, { art: 'alle' }).length, 22);
  assert.equal(sichtbar(daten, { art: 'tanz' }).length, 20);
  assert.equal(sichtbar(daten, { art: 'komponist' }).length, 2);
  assert.equal(sichtbar(daten).length, 22);
  const kennungen = [
    ...ARTEN.map((a) => filterKennung(a.id)),
    ...alleKennungen(daten).map(auswahlKennung),
    'alle-sichtbar-waehlen', 'alle-sichtbar-abwaehlen', 'drucken',
  ];
  assert.equal(new Set(kennungen).size, kennungen.length, 'doppelte data-kennung');
});

test('Auswahl: alle gewählt zum Start; umschalten lässt das Original unverändert; gewählte Karten in Quellenfolge; unbekannte Kennungen werden ignoriert', () => {
  const alle = alleGewaehlt(daten);
  assert.equal(alle.size, 22);
  const weniger = umschalten(alle, 'polka');
  assert.equal(weniger.has('polka'), false);
  assert.equal(alle.has('polka'), true, 'das Original wurde verändert');
  assert.equal(umschalten(weniger, 'polka').has('polka'), true);
  const gewaehlt = gewaehlteTanze(daten, ['kolo', 'unbekannt', 'polka', 'kolo']);
  assert.deepEqual(gewaehlt.map((t) => t.id), ['polka', 'kolo']);
  assert.equal(kannDrucken([]), false);
  assert.equal(kannDrucken(gewaehlt), true);
});

test('sichtbareWaehlen und sichtbareAbwaehlen fassen nur die sichtbaren Karten an; der Zähler nennt die Zahlen', () => {
  const tanzIds = sichtbar(daten, { art: 'tanz' }).map((t) => t.id);
  const gewaehlt = sichtbareWaehlen(new Set(), tanzIds);
  assert.equal(gewaehlt.size, 20);
  assert.equal(gewaehlt.has('menuett'), false);
  const rest = sichtbareAbwaehlen(alleGewaehlt(daten), tanzIds);
  assert.deepEqual([...rest], ['menuett', 'polonaise']);
  assert.ok(zaehlerText(2, 22).startsWith('2 von 22 Tanzkarten gewählt.'));
});

test('Kartentext: Quellenzeile mit Seite, Melodie, Altersgruppe, Sprachhinweis und Pflichtmarkierung stehen auf jeder Karte', () => {
  assert.equal(daten.sprachhinweis, 'uk und ru: nicht vorhanden, offen.');
  assert.equal(PFLICHTSATZ, 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.');
  for (const t of daten.tanze) {
    const text = kartenText(t, daten);
    assert.ok(text.includes(quelleText(t)), `${t.id}: Quellenzeile fehlt`);
    assert.ok(text.includes('S. 267'), `${t.id}: Seite fehlt`);
    if (t.art === 'tanz') assert.ok(text.includes(melodieText(t)), `${t.id}: Melodie fehlt`);
    assert.ok(text.includes(daten.altersgruppe), `${t.id}: Altersgruppe fehlt`);
    assert.ok(text.includes(daten.sprachhinweis), `${t.id}: Sprachhinweis fehlt`);
    assert.ok(text.endsWith(PFLICHTSATZ), `${t.id}: Pflichtmarkierung nicht am Ende`);
  }
});
