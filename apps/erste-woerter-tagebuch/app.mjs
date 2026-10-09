// Erste-Wörter-Tagebuch (Praleska docs/10, Eltern-Werkzeuge Nr. 51).
//
// Das Gerät ist in der Hand des Erwachsenen; das Kind sieht keinen
// Bildschirm. Diese App ZÄHLT NICHT - kein Zähler, keine Summe, kein
// Alter, kein Geburtsdatum (siehe logik.mjs für den fachlichen Grund).
//
// Sie dokumentiert, sie bewertet nicht. Ob die Entwicklung im Rahmen
// liegt, gehört zu den Vorsorgeuntersuchungen: die Meilensteinliste ist
// apps/meilenstein-begleiter, die Impulse sind apps/sprich-mit-mir. Hier
// steht, was das Kind gesagt hat.
//
// Vorgelesen werden nur die Rahmentexte, NIE die Einträge: die Wörter des
// Kindes können in jeder Familiensprache sein, und `vorlesen()` setzt nur
// `utterance.lang` - eine deutsche Stimme würde sie falsch lesen.
// Politik docs/02: keine externen Anfragen.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { datenKarte } from '../../packages/kinder-ui/js/daten-karte.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  ARTEN, MAX_LAUT, MAX_GEMEINT, MAX_SPRACHE, MAX_WO,
  artVon, baueEintrag, nachDatum, nachArt, nachSprache,
  exportText, packe, pruefePaket, vereinige, pruefeDaten,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/tagebuch.json').then((r) => r.json());
const SCHLUESSEL = 'ewt.eintraege';

// Zustand im Speicher mit Durchschreiben. Im privaten Fenster wirft schon
// der LESEzugriff, und dann war die App in Welle 78 zweimal funktionslos.
let speicherSperre = false;
let eintraege = lade();
let sicht = 'zeit';
let meldung = '';

function lade() {
  try {
    const roh = localStorage.getItem(SCHLUESSEL);
    if (!roh) return [];
    const x = JSON.parse(roh);
    return Array.isArray(x) ? x : [];
  } catch {
    speicherSperre = true;
    return [];
  }
}

function speichere() {
  try {
    if (eintraege.length) localStorage.setItem(SCHLUESSEL, JSON.stringify(eintraege));
    else localStorage.removeItem(SCHLUESSEL);
    speicherSperre = false;
  } catch {
    speicherSperre = true;
  }
}

function heute() {
  const d = new Date();
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

function lokaleStimme() {
  if (!('speechSynthesis' in globalThis)) return null;
  const stimmen = speechSynthesis.getVoices?.() ?? [];
  if (!stimmen.length) return undefined;
  return stimmen.find((s) => s.localService && String(s.lang ?? '').toLowerCase().startsWith('de')) ?? null;
}

function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  if (lokaleStimme() === null) {
    return el('p', { class: 'k-hinweis ewt-nur-bildschirm', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', { class: 'k-knopf k-knopf--neutral ewt-nur-bildschirm', onclick: () => vorlesen(text) }, beschriftung);
}

const hinweisKarte = (titel, ...absaetze) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, titel),
  ...absaetze.map((t) => el('p', { style: 'margin:0 0 0.3rem' }, t)));

function feld(beschriftung, bauer, hilfe) {
  const id = `ewt-f-${beschriftung.replace(/\W+/g, '-').toLowerCase()}`;
  const eingabe = bauer(id);
  return {
    eingabe,
    knoten: el('div', { style: 'margin:0 0 0.7rem' },
      el('label', { for: id, style: 'display:block;font-weight:600;margin-bottom:0.2rem' }, beschriftung),
      hilfe ? el('p', { id: `${id}-hilfe`, style: 'margin:0 0 0.2rem;font-size:0.85rem;color:#4b5563' }, hilfe) : null,
      eingabe),
  };
}

function eintragsFormular() {
  const stil = 'width:100%;min-height:3rem;font-size:1rem;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem';
  const fLaut = feld('Was hat Ihr Kind gesagt?', (id) => el('input', {
    id, type: 'text', maxlength: String(MAX_LAUT), autocomplete: 'off', spellcheck: 'false',
    style: stil, 'aria-describedby': `${id}-hilfe`,
  }), 'So, wie es geklungen hat – nicht, wie es richtig wäre.');
  const fGemeint = feld('Was hat es gemeint?', (id) => el('input', {
    id, type: 'text', maxlength: String(MAX_GEMEINT), autocomplete: 'off', style: stil,
    'aria-describedby': `${id}-hilfe`,
  }), 'Wenn Sie es wissen. Bei Lauten darf das Feld leer bleiben.');
  const fSprache = feld('Aus welcher Sprache?', (id) => el('input', {
    id, type: 'text', maxlength: String(MAX_SPRACHE), autocomplete: 'off', style: stil,
    'aria-describedby': `${id}-hilfe`,
  }), 'Schreiben Sie die Sprache so, wie sie in Ihrer Familie heißt.');
  const fArt = feld('Was für ein Laut oder Wort war das?', (id) => el('select', { id, style: stil },
    ...ARTEN.map((a) => el('option', { value: a }, artVon(daten, a)?.name ?? a))));
  const fWo = feld('Wobei war das?', (id) => el('input', {
    id, type: 'text', maxlength: String(MAX_WO), autocomplete: 'off', style: stil,
    'aria-describedby': `${id}-hilfe`,
  }), 'Zum Beispiel: beim Wickeln, im Bus. Freiwillig.');
  const fDatum = feld('An welchem Tag?', (id) => el('input', { id, type: 'date', style: stil }));
  fDatum.eingabe.value = heute();
  fArt.eingabe.value = 'wort';

  const speichern = el('button', {
    class: 'k-knopf', style: 'min-height:3.2rem',
    onclick: () => {
      const e = baueEintrag({
        laut: fLaut.eingabe.value, gemeint: fGemeint.eingabe.value,
        sprache: fSprache.eingabe.value, art: fArt.eingabe.value,
        wo: fWo.eingabe.value, datum: fDatum.eingabe.value,
      });
      if (!e) { meldung = '⚠️ Es fehlt noch, was Ihr Kind gesagt hat – oder der Tag.'; render(); return; }
      if (eintraege.some((x) => x.id === e.id)) { meldung = 'ℹ️ Das steht schon so im Heft.'; render(); return; }
      eintraege = [...eintraege, e];
      speichere();
      meldung = `✔️ „${e.laut}“ ist im Heft.`;
      render('ewt-f-was-hat-ihr-kind-gesagt-');
    },
  }, '💾 Eintrag speichern');

  return el('section', { class: 'k-karte ewt-nur-bildschirm' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '✍️ Neuer Eintrag'),
    el('p', { style: 'margin:0 0 0.6rem;font-size:0.95rem' }, daten.speichernAufKnopf),
    fLaut.knoten, fGemeint.knoten, fSprache.knoten, fArt.knoten, fWo.knoten, fDatum.knoten,
    el('div', { class: 'k-antworten' }, speichern),
    meldung ? el('p', { style: 'margin:0.5rem 0 0;font-weight:700', 'aria-live': 'polite' }, meldung) : null);
}

function eintragZeile(e) {
  const art = artVon(daten, e.art);
  return el('div', { style: 'padding:0.5rem 0;border-top:1px solid var(--k-rand)' },
    el('p', { style: 'margin:0;font-weight:700' }, `„${e.laut}“`,
      e.gemeint ? el('span', { style: 'font-weight:400' }, ` = ${e.gemeint}`) : null),
    el('p', { style: 'margin:0.1rem 0 0;font-size:0.9rem;color:#4b5563' },
      [e.datum, e.sprache, art?.name, e.wo].filter(Boolean).join(' · ')),
    // Löschen ohne Papierkorb und ohne Wiederherstellung.
    el('button', {
      class: 'k-knopf k-knopf--neutral k-knopf--klein ewt-nur-bildschirm',
      style: 'margin-top:0.3rem',
      'aria-label': `Eintrag „${e.laut}“ vom ${e.datum} löschen`,
      onclick: () => {
        if (!globalThis.confirm?.(`Eintrag „${e.laut}“ löschen? Das lässt sich nicht zurückholen.`)) return;
        eintraege = eintraege.filter((x) => x.id !== e.id);
        speichere();
        meldung = 'Eintrag gelöscht.';
        render();
      },
    }, '🗑️ Löschen'));
}

function sichtKnoten() {
  if (!eintraege.length) {
    return el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📖 Das Heft'),
      el('p', { style: 'margin:0' }, 'Noch nichts eingetragen. Das erste Wort kommt, wann es kommt.'));
  }
  if (sicht === 'art') {
    return el('div', {},
      el('section', { class: 'k-karte ewt-nur-bildschirm' },
        el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🔊 Nach Art des Lautes'),
        el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0' }, daten.keinStufenmodell))),
      ...nachArt(daten, eintraege).map((g) => el('section', { class: 'k-karte ewt-block' },
        el('h3', { style: 'margin-top:0;font-size:1.05rem' }, g.art.name),
        el('p', { style: 'margin:0 0 0.2rem;font-size:0.9rem;color:#4b5563' }, g.art.erklaerung),
        el('p', { style: 'margin:0 0 0.3rem;font-size:0.9rem;color:#4b5563' }, `Zum Beispiel: ${g.art.beispiel}`),
        ...(g.eintraege.length
          ? g.eintraege.map(eintragZeile)
          : [el('p', { style: 'margin:0;font-size:0.9rem' }, 'Hier steht noch nichts – das heißt nichts.')]))));
  }
  if (sicht === 'sprache') {
    return el('div', {},
      el('section', { class: 'k-karte ewt-nur-bildschirm' },
        el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🗣️ Nach Sprache'),
        el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0' }, daten.keineSumme))),
      ...nachSprache(eintraege).map((g) => el('section', { class: 'k-karte ewt-block' },
        el('h3', { style: 'margin-top:0;font-size:1.05rem' }, g.sprache === '—' ? 'Ohne Sprachangabe' : g.sprache),
        ...g.eintraege.map(eintragZeile))));
  }
  return el('section', { class: 'k-karte ewt-block' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📖 Das Heft, neueste zuerst'),
    ...nachDatum(eintraege).map(eintragZeile));
}

function werkzeuge() {
  const dateiFeld = el('input', {
    type: 'file', accept: '.json,application/json', style: 'display:none',
    onchange: async (ev) => {
      const datei = ev.target.files?.[0];
      if (!datei) return;
      const p = pruefePaket(await datei.text());
      if (!p.ok) { meldung = `⚠️ ${p.grund}`; render(); return; }
      eintraege = vereinige(eintraege, p.eintraege);
      speichere();
      meldung = p.verworfen
        ? '✔️ Datei eingelesen. Einträge, die nicht ins Schema passten, sind nicht übernommen.'
        : '✔️ Datei eingelesen.';
      render();
    },
  });
  return el('section', { class: 'k-karte ewt-nur-bildschirm' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧰 Sichern, drucken, mitnehmen'),
    el('p', { style: 'margin:0 0 0.5rem' }, daten.speicherGrenzen),
    el('div', { class: 'k-antworten' },
      el('button', {
        class: 'k-knopf',
        onclick: () => {
          const blob = new Blob([packe(eintraege)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const anker = el('a', { href: url, download: `${daten.export.dateiname}.json` });
          document.body.append(anker); anker.click(); anker.remove();
          URL.revokeObjectURL(url);
        },
      }, '⬇️ Als Datei sichern'),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => dateiFeld.click() }, '⬆️ Datei einlesen'),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => window.print() }, '🖨️ Liste drucken')),
    dateiFeld);
}

function render(fokusId = null) {
  const alleTexte = `${daten.hinweis} ${daten.wasEsIst} ${daten.keinScreening} ${daten.keineZahl} ${daten.keinAlter}`;
  app.replaceChildren(...[
    el('div', { class: 'ewt-kopf' },
      el('h1', { class: 'k-titel' }, '📖 Erste-Wörter-Tagebuch'),
      el('p', { class: 'k-untertitel' }, 'Was Ihr Kind sagt – aufgeschrieben, nicht bewertet')),

    el('section', { class: 'k-karte ewt-nur-bildschirm' },
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
      hinweisKarte('📝 Ein Heft, kein Test:', daten.wasEsIst),
      hinweisKarte('🔢 Hier wird nicht gezählt:', daten.keineZahl),
      hinweisKarte('📅 Kein Geburtsdatum, kein Alter:', daten.keinAlter, daten.keinStufenmodell),
      hinweisKarte('🩺 Was hierher nicht gehört:', daten.keinScreening, daten.fragebogen),
      hinweisKarte('👪 Für Eltern, nicht für die Tagespflege:', daten.nurEltern),
      hinweisKarte('🗣️ Mehrere Sprachen:', daten.mehrsprachig, daten.mehrsprachigKeinRisiko),
      hinweisKarte('🙈 Nur über Ihr Kind:', daten.ueberDritte),
      hinweisKarte('⌨️ Was diese Seite nicht verhindern kann:', daten.tastaturHinweis),
      vorleseKnopf(alleTexte, '🔊 Das Wichtigste vorlesen')),

    speicherSperre
      ? el('div', { class: 'k-hinweis k-hinweis--falsch ewt-nur-bildschirm' },
        el('p', { style: 'margin:0' },
          '⚠️ Dieser Browser kann gerade nichts behalten (privates Fenster oder blockierte Website-Daten). '
          + 'Die Einträge gelten, solange die Seite offen bleibt – sichern Sie die Datei, bevor Sie sie schließen.'))
      : null,

    eintragsFormular(),

    el('section', { class: 'k-karte ewt-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '👀 Wie wollen Sie schauen?'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Ansicht wählen' },
        ...[['zeit', '📅 Nach Tag'], ['art', '🔊 Nach Art'], ['sprache', '🗣️ Nach Sprache']].map(([id, text]) =>
          el('button', {
            class: `k-knopf k-knopf--klein ${sicht === id ? '' : 'k-knopf--neutral'}`,
            'aria-pressed': String(sicht === id),
            onclick: () => { sicht = id; meldung = ''; render(); },
          }, text)))),

    sichtKnoten(),

    // Auf dem Papier: Kopf, Hinweis und die chronologische Rohliste. Keine
    // Zahl, keine Farbe, keine Auffälligkeitsaussage.
    el('section', { class: 'k-karte ewt-block ewt-nur-druck' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📋 Für das Gespräch'),
      el('p', { style: 'margin:0;font-weight:700' }, daten.export.kopf),
      el('p', { style: 'margin:0.2rem 0 0.5rem' }, daten.export.hinweis),
      ...(eintraege.length
        ? nachDatum(eintraege).map((e) => el('p', { style: 'margin:0 0 0.2rem' },
          `${e.datum} · „${e.laut}“${e.gemeint ? ` = ${e.gemeint}` : ''}`
          + `${e.sprache ? ` (${e.sprache})` : ''} · ${artVon(daten, e.art)?.name ?? ''}${e.wo ? ` · ${e.wo}` : ''}`))
        : [el('p', { style: 'margin:0' }, '(noch kein Eintrag)')])),

    werkzeuge(),

    datenKarte({
      schluessel: SCHLUESSEL,
      was: 'das, was Sie selbst eintragen – die Wörter Ihres Kindes, ohne Namen und ohne Geburtsdatum',
      nachLoeschen: () => { eintraege = []; sicht = 'zeit'; meldung = ''; render(); },
    }),

    el('section', { class: 'k-karte ewt-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧭 Was woanders besser steht'),
      el('ul', { style: 'margin:0;padding-left:1.2rem' },
        el('li', {}, 'Ob die Entwicklung im Rahmen liegt – das gehört zu den Vorsorgeuntersuchungen: ',
          el('a', { href: '../meilenstein-begleiter/' }, 'Meilenstein-Begleiter')),
        el('li', {}, 'Was Sie tun können, damit Verständigung entsteht: ',
          el('a', { href: '../sprich-mit-mir/' }, 'Sprich mit mir')),
        el('li', {}, 'Reime und Lieder als Sprachbad: ',
          el('a', { href: '../familienschatz-reime/' }, 'Familienschatz Reime')),
        el('li', {}, 'Später, für Schulkinder: ',
          el('a', { href: '../herkunftssprachen-bruecke/' }, 'Herkunftssprachen-Brücke')),
        el('li', {}, 'Das Tagebuch für die Jahre danach: ',
          el('a', { href: '../staerken-tagebuch/' }, 'Stärken-Tagebuch')))),

    el('footer', { class: 'k-fuss ewt-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Eltern · kein Bildschirm fürs Kind · keine Bewertung · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));

  // Fokus zurück auf das Feld, in das weitergeschrieben wird: ohne das
  // landet er nach jedem Speichern auf <body>.
  if (fokusId) document.getElementById(fokusId)?.focus();
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
    el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
  if ('speechSynthesis' in globalThis) {
    speechSynthesis.addEventListener?.('voiceschanged', () => render(), { once: true });
  }
}

// Nur für den Export-Text (Datei und Zwischenablage nutzen dieselbe
// Formulierung wie das Druckblatt).
export { exportText };
