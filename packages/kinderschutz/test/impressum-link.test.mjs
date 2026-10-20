import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';

// Jede App verlinkt Impressum und Datenschutz (docs/02: Pflicht auf jedem veröffentlichten
// Angebot). Die Verknüpfung steht in index.html oder in einer .mjs-Datei der App. Eine App, die den
// Quiz-Kern nutzt, bekommt sie aus packages/quiz-kern/src/quiz.mjs; dort prüft der Test sie ebenfalls.
const WURZEL = new URL('../../../', import.meta.url);
const appsDir = new URL('apps/', WURZEL);
const HREF = '../../impressum.html';
const QUIZ_KERN = /from ['"][^'"]*quiz-kern\/src\/quiz\.mjs['"]/;

const lesen = (url) => readFile(url, 'utf8').catch(() => '');

const quellen = async (slug) => {
  const dir = new URL(`${slug}/`, appsDir);
  const namen = (await readdir(dir)).filter((f) => /\.(html|mjs)$/.test(f));
  return Promise.all(namen.map((f) => lesen(new URL(f, dir))));
};

const apps = (await readdir(appsDir, { withFileTypes: true }))
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();
const quizText = await lesen(new URL('packages/quiz-kern/src/quiz.mjs', WURZEL));

test('jede App verlinkt Impressum und Datenschutz', async () => {
  assert.ok(apps.length > 0, 'keine Apps gefunden');
  const fehlt = [];
  for (const slug of apps) {
    const texte = await quellen(slug);
    if (texte.some((t) => t.includes(HREF))) continue;
    const nutztQuiz = texte.some((t) => QUIZ_KERN.test(t));
    if (nutztQuiz && quizText.includes(HREF)) continue;
    fehlt.push(slug);
  }
  assert.deepEqual(fehlt, [], `ohne Impressum-Link: ${fehlt.join(', ')}`);
});

test('der Impressum-Link zeigt aus jeder App auf eine vorhandene Datei', async () => {
  for (const slug of apps) {
    await access(new URL(HREF, new URL(`${slug}/index.html`, appsDir)));
  }
});
