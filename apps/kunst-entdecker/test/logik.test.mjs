import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  TAFEL, ratbareWerke, werkeMitGenre, gattungVon, genreVon,
  baueFrage, istRichtig, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/werke.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const erster = (liste) => liste[0];
const ohneMischen = (liste) => [...liste];

test('Werkdaten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.werke.length >= 9);
});

test('jedes Bild ist eingebettet – die App darf nichts nachladen', () => {
  for (const w of daten.werke) {
    assert.match(w.bild, /^data:image\/jpeg;base64,/, `${w.id}: kein eingebettetes JPEG`);
    assert.ok(w.bild.length > 4000, `${w.id}: Bild verdächtig klein`);
    assert.ok(Number.isInteger(w.breite) && w.breite > 0);
  }
  // und nirgends steht eine externe Adresse, über die nachgeladen werden könnte
  const ohneBilder = JSON.stringify({ ...daten, werke: daten.werke.map(({ bild, ...r }) => r) });
  const treffer = ohneBilder.match(/https?:\/\/[^"]+/g) || [];
  for (const u of treffer) {
    assert.match(u, /^https:\/\/www\.metmuseum\.org\//, `unerwartete Adresse in den Daten: ${u}`);
  }
});

test('Herkunft ist bei jedem Werk vollständig belegt und CC0', () => {
  for (const w of daten.werke) {
    const q = w.quelle;
    assert.ok(q.einrichtung && q.objektnummer && q.seite, `${w.id}: Herkunft unvollständig`);
    assert.match(q.lizenz, /CC0/, `${w.id}: Lizenz ist nicht CC0`);
    assert.ok(w.kuenstler && w.jahr, `${w.id}: Künstler oder Jahr fehlt`);
  }
  // Der Grund für die CC0-Regel steht in den Daten, nicht nur in der Doku –
  // und zwar mit der geltenden Fundstelle. § 68 UrhG (seit 2021) nimmt
  // originalgetreue Reproduktionen gemeinfreier Werke vom Schutz aus und hat
  // die Reiss-Engelhorn-Rechtsprechung zu § 72 UrhG überholt; wer hier wieder
  // § 72 als geltendes Recht hinschreibt, behauptet Falsches.
  assert.match(daten.hinweis, /§ 68 UrhG/);
  assert.match(daten.hinweis, /CC0/);
  assert.ok(
    !/nach § 72 UrhG (selbst )?geschützt/.test(daten.hinweis),
    'überholte Rechtslage: § 72 UrhG gilt für solche Reproduktionen nicht mehr',
  );
  // Eine nicht-CC0-Lizenz muss der Validator zurückweisen
  const fremd = kopie();
  fremd.werke[0].quelle.lizenz = 'CC BY-SA 4.0';
  assert.ok(pruefeDaten(fremd).some((f) => /nicht CC0/.test(f)));
  const ohneBeleg = kopie();
  delete ohneBeleg.werke[1].quelle.objektnummer;
  assert.ok(pruefeDaten(ohneBeleg).some((f) => /Herkunft unvollständig/.test(f)));
});

test('die Architektur-Tafel wird nie abgefragt – sie hätte zwei richtige Antworten', () => {
  const tafeln = daten.werke.filter((w) => w.gattung === TAFEL);
  assert.equal(tafeln.length, 1, 'genau eine Erklärtafel erwartet');
  assert.equal(tafeln[0].genre, null);
  assert.ok(!ratbareWerke(daten).some((w) => w.gattung === TAFEL));
  assert.ok(!werkeMitGenre(daten).some((w) => w.gattung === TAFEL));
  // Der Grund steht in den Daten
  assert.match(daten.architektur.hinweis, /zwei richtige Antworten/);
  // Und ein Genre an der Tafel wäre ein Fehler
  const mitGenre = kopie();
  mitGenre.werke.find((w) => w.gattung === TAFEL).genre = 'portraet';
  assert.ok(pruefeDaten(mitGenre).some((f) => /Erklärtafel darf kein Genre/.test(f)));
});

test('jede Gattung und jedes Genre hat genug Werke zum Üben', () => {
  for (const g of daten.gattungen) {
    assert.ok(ratbareWerke(daten).some((w) => w.gattung === g.id), `Gattung ${g.id}: kein Werk`);
  }
  for (const g of daten.genres) {
    const n = ratbareWerke(daten).filter((w) => w.genre === g.id).length;
    assert.ok(n >= 2, `Genre ${g.id}: nur ${n} Werk`);
  }
  // ein Werk ohne Genre ist erlaubt und kommt vor (nicht alles passt in drei Schubladen)
  assert.ok(ratbareWerke(daten).some((w) => !w.genre), 'kein Werk ohne Genre – zu glatt');
  const zuWenig = kopie();
  zuWenig.werke = zuWenig.werke.filter((w) => w.id !== 'fantin-blumen');
  assert.ok(pruefeDaten(zuWenig).some((f) => /Genre stillleben: nur 1 Werk/.test(f)));
});

test('baueFrage zeigt immer alle drei Möglichkeiten und trifft die Lösung', () => {
  for (const art of ['gattung', 'genre']) {
    let vorher = null;
    for (let i = 0; i < 300; i++) {
      const f = baueFrage(daten, art, (l) => l[Math.floor(Math.random() * l.length)], (l) => [...l].reverse(), vorher);
      assert.equal(f.optionen.length, 3, `${art}: nicht drei Optionen`);
      assert.equal(new Set(f.optionen.map((s) => s.id)).size, 3, `${art}: doppelte Option`);
      assert.ok(f.optionen.some((s) => s.id === f.loesung), `${art}: Lösung fehlt unter den Optionen`);
      assert.notEqual(f.werk.gattung, TAFEL, 'die Erklärtafel darf nie drankommen');
      if (art === 'genre') assert.ok(f.werk.genre, 'Werk ohne Genre in der Genre-Frage');
      assert.equal(f.loesung, art === 'gattung' ? f.werk.gattung : f.werk.genre);
      assert.equal(istRichtig(f, f.loesung), true);
      assert.equal(istRichtig(f, 'quatsch'), false);
      if (vorher) assert.notEqual(vorher.werk.id, f.werk.id, `${art}: zweimal dasselbe Werk`);
      vorher = f;
    }
  }
});

test('die Antwortmöglichkeiten verraten nichts: es sind immer alle drei Sorten', () => {
  // Würde die App nur die zutreffenden Sorten anbieten, wäre die Auswahl
  // selbst schon ein Hinweis. Sie bietet deshalb stets die volle Liste.
  const f = baueFrage(daten, 'gattung', erster, ohneMischen);
  assert.deepEqual(f.optionen.map((s) => s.id).sort(), daten.gattungen.map((s) => s.id).sort());
  const g = baueFrage(daten, 'genre', erster, ohneMischen);
  assert.deepEqual(g.optionen.map((s) => s.id).sort(), daten.genres.map((s) => s.id).sort());
});

test('Nachschlagen: gattungVon und genreVon', () => {
  assert.equal(gattungVon(daten, 'malerei').name, 'Malerei');
  assert.equal(genreVon(daten, 'stillleben').name, 'Stillleben');
  assert.equal(gattungVon(daten, TAFEL), null);
  assert.equal(genreVon(daten, null), null);
});

test('Bildtexte laden zum Hinsehen ein und der Dürer-Irrtum steht drin', () => {
  for (const w of daten.werke) {
    assert.ok(w.hinsehen.length >= 80, `${w.id}: hinsehen zu knapp`);
    assert.match(w.hinsehen, /[.!?]$/, `${w.id}: hinsehen endet ohne Satzzeichen`);
  }
  // Dürer hat nie ein Nashorn gesehen – das ist der beste Aufhänger der Sammlung
  const rhino = daten.werke.find((w) => w.id === 'duerer-rhinozeros');
  assert.match(rhino.hinsehen, /nie ein Nashorn gesehen/);
  assert.match(rhino.hinsehen, /gar nicht gibt/);
});
