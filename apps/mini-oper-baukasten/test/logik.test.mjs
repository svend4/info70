import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  APP_NAME, SZENEN, ROLLEN, SEITE, TITEL, FIGUREN, REQUISITEN, INSTRUMENTE, KLANG_HINWEIS, ANREGUNG_QUELLE,
  szenenAnzahl, rollenAnzahl, erzeugeSzenen, erzeugeRollen, ziehe, erzeugeRequisiten, erzeugeGeruest, titelGueltig,
} from '../logik.mjs';

const dateiText = (name) => readFile(new URL(`../${name}`, import.meta.url), 'utf8');

/** Eine Zufallsquelle, die feste Werte der Reihe nach liefert und mitzählt, wie oft sie gefragt wird. */
function festerZufall(werte) {
  let i = 0;
  const rng = () => {
    rng.aufrufe += 1;
    const wert = werte[i % werte.length];
    i += 1;
    return wert;
  };
  rng.aufrufe = 0;
  return rng;
}

// Die Dateien, die im Browser laufen, und die Texte, die der Nutzer liest.
const LAUFZEIT = ['index.html', 'app.mjs', 'logik.mjs', 'druck.css', 'package.json'];
const TEXTE = [...LAUFZEIT, 'README.md', 'GDD.md'];

test('der Name der App steht wörtlich fest', () => {
  assert.equal(APP_NAME, 'Mini-Oper-Baukasten (offline, ohne KI)');
});

test('die Szenenzahl liegt zwischen 3 und 5; Ausreißer werden begrenzt, Unsinn fällt auf 3', () => {
  assert.deepEqual([SZENEN.min, SZENEN.max, SZENEN.standard], [3, 5, 3]);
  assert.equal(szenenAnzahl(1), 3);
  assert.equal(szenenAnzahl(9), 5);
  assert.equal(szenenAnzahl('4'), 4);
  assert.equal(szenenAnzahl(3.6), 4);
  assert.equal(szenenAnzahl(NaN), 3);
  assert.equal(szenenAnzahl(undefined), 3);
  assert.equal(szenenAnzahl({}), 3);
});

test('die Rollenzahl liegt zwischen 2 und 6; Unendlich fällt auf den Standardwert 2', () => {
  assert.deepEqual([ROLLEN.min, ROLLEN.max, ROLLEN.standard], [2, 6, 2]);
  assert.equal(rollenAnzahl(0), 2);
  assert.equal(rollenAnzahl(7), 6);
  assert.equal(rollenAnzahl('5'), 5);
  assert.equal(rollenAnzahl(Infinity), 2);
});

test('erzeugeSzenen legt leere Platzhalter an, ohne Stichwort', () => {
  assert.deepEqual(erzeugeSzenen(4), [
    { nummer: 1, bezeichnung: 'Szene 1' },
    { nummer: 2, bezeichnung: 'Szene 2' },
    { nummer: 3, bezeichnung: 'Szene 3' },
    { nummer: 4, bezeichnung: 'Szene 4' },
  ]);
  assert.equal(erzeugeSzenen(99).length, 5);
});

test('erzeugeRollen nennt nur Platzhalter, keine Namen', () => {
  assert.deepEqual(erzeugeRollen(6), ['Rolle 1', 'Rolle 2', 'Rolle 3', 'Rolle 4', 'Rolle 5', 'Rolle 6']);
  assert.equal(erzeugeRollen(2).length, 2);
});

test('ziehe folgt dem übergebenen Zufall, ist wiederholbar und verändert die Liste nicht', () => {
  const liste = ['a', 'b', 'c', 'd', 'e'];
  const erstes = ziehe(liste, 3, festerZufall([0.5, 0.1, 0.9]));
  const zweites = ziehe(liste, 3, festerZufall([0.5, 0.1, 0.9]));
  assert.deepEqual(erstes, zweites);
  assert.equal(erstes.length, 3);
  assert.deepEqual(liste, ['a', 'b', 'c', 'd', 'e']);
});

test('ziehe liefert nur eindeutige Einträge, kappt am Listenende und wehrt schlechte Zufallsquellen ab', () => {
  const liste = ['a', 'b', 'c'];
  const alle = ziehe(liste, 10, festerZufall([0, 0.99]));
  assert.equal(alle.length, 3);
  assert.equal(new Set(alle).size, 3);
  assert.throws(() => ziehe(liste, 2), TypeError);
  assert.throws(() => ziehe(liste, 2, () => 1), RangeError);
  assert.throws(() => ziehe(liste, 2, () => -0.1), RangeError);
});

test('erzeugeRequisiten zieht vier verschiedene Dinge aus der festen Liste', () => {
  const dinge = erzeugeRequisiten(festerZufall([0.3, 0.7, 0.2, 0.9]));
  assert.equal(dinge.length, 4);
  assert.equal(new Set(dinge).size, 4);
  for (const ding of dinge) assert.ok(REQUISITEN.includes(ding), ding);
  assert.ok(REQUISITEN.length >= 12);
});

test('erzeugeGeruest nimmt die übergebenen Requisiten und fragt den Zufall dann nicht ab', () => {
  const rng = festerZufall([0.5]);
  const g = erzeugeGeruest({ szenen: 4, rollen: 3, titel: 'Петя и волк', requisiten: ['Tuch', 'Hut', 'Unbekannt'] }, rng);
  assert.equal(rng.aufrufe, 0);
  assert.deepEqual(g.requisiten, ['Tuch', 'Hut']);
  assert.equal(g.szenen.length, 4);
  assert.deepEqual(g.rollen, ['Rolle 1', 'Rolle 2', 'Rolle 3']);
  assert.equal(g.titel, 'Петя и волк');
  assert.equal(g.klang, KLANG_HINWEIS);
});

test('erzeugeGeruest ohne Zufallsquelle und ohne Requisiten wirft; ein unbekannter Titel fällt weg', () => {
  assert.throws(() => erzeugeGeruest({ szenen: 3 }), TypeError);
  assert.throws(() => erzeugeGeruest({ requisiten: 'Tuch' }, festerZufall([0])), TypeError);
  const g = erzeugeGeruest({ titel: 'Frei erfunden', requisiten: [] }, festerZufall([0]));
  assert.equal(g.titel, null);
  assert.deepEqual(g.requisiten, []);
});

test('die 18 Titel stehen wörtlich und in der Reihenfolge von S. 269', () => {
  assert.equal(SEITE.titel, 269);
  assert.deepEqual([...TITEL], [
    'Рэдзька', 'Муха-цокотуха', 'Аленушка и лиса', 'Колосок', 'Кот, Петух и Лиса', 'Снегурочка',
    'Про волшебника Оха и Дуню-ленивицу', 'Приключения двух глупых лягушат', 'Гадкий утенок',
    'Принцесса на горошине', 'Соловей', 'Пятеро из одного стручка', 'Лягушка-путешественница',
    'Щелкунчик', 'Спящая красавица', 'Петя и волк', 'Красная Шапочка', 'Золушка',
  ]);
  assert.equal(new Set(TITEL).size, 18);
});

test('titelGueltig lässt nur Titel aus der Auswahl zu', () => {
  assert.equal(titelGueltig('Золушка'), 'Золушка');
  assert.equal(titelGueltig(''), null);
  assert.equal(titelGueltig('Frei erfunden'), null);
  assert.equal(titelGueltig(undefined), null);
});

test('die Figurenbeispiele stehen wörtlich auf S. 262; die deutschen Namen sind getrennt gehalten', () => {
  assert.equal(SEITE.figuren, 262);
  assert.deepEqual(FIGUREN.map((f) => f.quelle), [
    'стрекоза', 'муравей', 'бегемот', 'журавль', 'солдат', 'матрос', 'физкультурник', 'снеговик',
  ]);
  for (const f of FIGUREN) assert.ok(f.deutsch.length > 2, f.quelle);
});

test('Klang-Hinweis und Anregung nennen ihre Seiten und ordnen keiner Figur ein Instrument zu', () => {
  assert.equal(SEITE.klang, 270);
  assert.equal(SEITE.anregung, 262);
  assert.ok(KLANG_HINWEIS.includes('S. 270'));
  assert.ok(KLANG_HINWEIS.includes('Charakter der Musik'));
  assert.ok(!KLANG_HINWEIS.includes('Figur'));
  assert.ok(ANREGUNG_QUELLE.includes('S. 262'));
  const figurenwoerter = FIGUREN.flatMap((f) => [f.quelle, f.deutsch]);
  assert.ok(INSTRUMENTE.every((i) => !figurenwoerter.includes(i)));
});

test('kein externer Zugriff: keine fremden Adressen und keine Einbindung von außen', async () => {
  for (const datei of TEXTE) {
    const text = await dateiText(datei);
    assert.ok(!/https?:\/\//i.test(text), `${datei}: fremde Adresse`);
    assert.ok(!/@import|unpkg|jsdelivr/i.test(text), `${datei}: Einbindung von außen`);
  }
});

test('kein KI-Bezug und kein Geschichten-Generator, außer dem Namenszusatz „ohne KI“', async () => {
  for (const datei of TEXTE) {
    const text = (await dateiText(datei)).split('ohne KI').join('');
    assert.ok(!text.includes('KI'), `${datei}: KI`);
    assert.ok(!/Geschichten-?Generator/i.test(text), `${datei}: Generator-Wort`);
  }
});

test('der Druckbogen trägt keine Kästchen, keine Häkchen und keine Zeile für einen Namen', async () => {
  for (const datei of ['index.html', 'app.mjs', 'logik.mjs', 'druck.css']) {
    const text = await dateiText(datei);
    assert.ok(!/[☐☒☑✓✔✗✘]/u.test(text), `${datei}: Kästchen oder Häkchen`);
    assert.ok(!/Name\s*:/.test(text), `${datei}: Namenszeile`);
  }
  const css = await dateiText('druck.css');
  assert.match(css, /@media\s+print/);
  assert.match(css, /display:\s*none/);
});

test('nichts wird gespeichert: kein Speicherzugriff im Code der App', async () => {
  for (const datei of ['app.mjs', 'logik.mjs']) {
    const text = await dateiText(datei);
    for (const wort of ['localStorage', 'sessionStorage', 'indexedDB', 'setItem', 'datenKarte', 'document.cookie']) {
      assert.ok(!text.includes(wort), `${datei}: ${wort}`);
    }
  }
});

test('die App startet die Netzwerk-Wache, druckt nur über den Bogen und lädt ihr Druck-CSS', async () => {
  const app = await dateiText('app.mjs');
  assert.ok(app.includes('installiereNetzwerkWaechter();'));
  assert.ok(app.includes('window.print()'));
  const html = await dateiText('index.html');
  assert.ok(html.includes('href="druck.css"'));
  assert.ok(html.includes('<script type="module" src="app.mjs">'));
  assert.ok(html.includes("default-src 'self'; style-src 'self' 'unsafe-inline'"));
});
