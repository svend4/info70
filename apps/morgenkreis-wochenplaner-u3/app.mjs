// Morgenkreis- und Wochenplaner U3 – Praleska docs/10, Kita-Abschnitt, Nr. 79.
// Werkzeug für Fachkräfte mit Kindern von 1 bis 3 Jahren. Die Richtwerte sind die der Quelle
// (S. 8–9); Wochentage und Ablauf sind eigen. Der Plan wird als Datei gespeichert und
// wieder geladen. Keine Namen, kein Freitext, nichts im Gerät gespeichert (docs/02).
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { abweichungen, bausteinVon, einheitAendern, einheitEntfernen, einheitHinzufuegen, neuerPlan, packePlan, pruefeDaten, pruefePlan, zaehleBereiche } from './logik.mjs';

installiereNetzwerkWaechter();

// Die Seitenangaben der Quelle sind nicht von einem Menschen geprüft (docs/02, Entscheidung Max 22а). Die Marke steht im
// Quellenabsatz der ersten Karte, gleich unter der Zeile „Quelle“. Die Richtwerte, die Bausteine und die Abweichungen weiter
// unten nennen Seiten derselben Quelle. Es gibt kein Druck-CSS: beim Drucken erscheint die Karte wie am Bildschirm.
const MARKE_QUELLE = 'Seitenangaben der Quelle: nicht von einem Menschen geprüft.';

const app = document.getElementById('app');
const daten = await fetch('daten/plan.json').then((r) => r.json());
const DATEI_NAME = 'morgenkreis-wochenplan.json';

// Der Plan lebt im Speicher der Seite; die Datei ist die einzige Kopie, die bleibt.
let plan = neuerPlan(daten);
let meldung = null;

const bereichName = (id) => daten.bereiche.find((b) => b.id === id)?.name ?? id;

function exportiere() {
  const blob = new Blob([packePlan(plan)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anker = el('a', { href: url, download: DATEI_NAME });
  document.body.append(anker);
  anker.click();
  anker.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  meldung = { ok: true, text: 'Plan als Datei gespeichert. Sie enthält nur Tage, Bereiche und Bausteine.' };
  zeichne();
}

async function importiere(ev) {
  const datei = ev.target.files?.[0];
  if (!datei) return;
  let inhalt;
  try {
    inhalt = JSON.parse(await datei.text());
  } catch {
    meldung = { ok: false, text: 'Die Datei ließ sich nicht lesen.' };
    return zeichne();
  }
  const fehler = pruefePlan(inhalt, daten);
  if (fehler.length > 0) {
    meldung = { ok: false, text: `Import nicht möglich: ${fehler[0]}.` };
    return zeichne();
  }
  plan = { art: inhalt.art, version: inhalt.version, woche: inhalt.woche.map((z) => ({ tag: z.tag, einheiten: z.einheiten.map((e) => ({ bereich: e.bereich, baustein: e.baustein ?? null })) })) };
  meldung = { ok: true, text: 'Plan geladen und geprüft.' };
  zeichne();
}

function bausteinAuswahl(eintrag, tag, index) {
  const bereich = daten.bereiche.find((b) => b.id === eintrag.bereich);
  if (!bereich || bereich.bausteine.length === 0) {
    return el('p', { class: 'mw-quelle', style: 'margin:0.3rem 0' }, 'Ohne Titelbaustein: das Angebot bleibt bei der Fachkraft.');
  }
  return el('label', { class: 'mw-feld' },
    el('span', {}, 'Baustein'),
    el('select', {
      id: `mw-baustein-${tag}-${index}`,
      onchange: (ev) => { plan = einheitAendern(plan, tag, index, 'baustein', ev.target.value || null); zeichne(`mw-baustein-${tag}-${index}`); },
    },
    el('option', { value: '', selected: eintrag.baustein === null }, 'kein Baustein'),
    ...bereich.bausteine.map((b) => el('option', { value: b.id, selected: eintrag.baustein === b.id }, `${b.titel} (${b.seite})`))));
}

function einheitZeile(tag, eintrag, index) {
  return el('div', { class: 'mw-zeile' },
    el('p', { class: 'mw-name' }, `Einheit ${index + 1}`),
    el('label', { class: 'mw-feld' },
      el('span', {}, 'Bereich'),
      el('select', {
        id: `mw-bereich-${tag}-${index}`,
        onchange: (ev) => { plan = einheitAendern(plan, tag, index, 'bereich', ev.target.value); zeichne(`mw-bereich-${tag}-${index}`); },
      }, ...daten.bereiche.map((b) => el('option', { value: b.id, selected: eintrag.bereich === b.id }, b.name)))),
    bausteinAuswahl(eintrag, tag, index),
    el('div', { class: 'k-antworten' },
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        id: `mw-entfernen-${tag}-${index}`,
        onclick: () => { plan = einheitEntfernen(plan, tag, index); zeichne(); },
      }, 'Entfernen')));
}

function tagKarte(z) {
  const voll = z.einheiten.length >= daten.hoechstensProTag;
  return el('section', { class: 'k-karte', 'aria-labelledby': `mw-tag-${z.tag}` },
    el('h2', { id: `mw-tag-${z.tag}`, style: 'margin-top:0;font-size:1.15rem' }, z.tag),
    z.einheiten.length === 0
      ? el('p', { class: 'mw-quelle', style: 'margin:0' }, 'Noch keine Einheit.')
      : '',
    ...z.einheiten.map((e, i) => einheitZeile(z.tag, e, i)),
    el('div', { class: 'k-antworten', style: 'margin-top:0.6rem' },
      el('button', {
        class: 'k-knopf k-knopf--klein',
        id: `mw-hinzu-${z.tag}`,
        disabled: voll ? true : null,
        onclick: () => { plan = einheitHinzufuegen(daten, plan, z.tag, daten.bereiche[0].id); zeichne(); },
      }, voll ? `Tag voll (höchstens ${daten.hoechstensProTag})` : 'Einheit hinzufügen')));
}

function statusKarte() {
  const zaehl = zaehleBereiche(plan);
  const abw = abweichungen(daten, plan);
  return el('section', { class: 'k-karte mw-nur-bildschirm' },
    el('p', { style: 'font-weight:600;margin-top:0' }, 'Planung gegen den Richtwert'),
    ...daten.richtwerte.map((r) => el('p', { class: 'mw-zahlen' },
      `${bereichName(r.bereich)}: ${zaehl[r.bereich] ?? 0} von ${r.anzahl}`)),
    abw.length === 0
      ? el('div', { class: 'k-hinweis k-hinweis--richtig' }, el('p', { style: 'margin:0' }, 'Alle Richtwerte getroffen, zusammen zehn Einheiten.'))
      : el('div', { class: 'k-hinweis' },
        el('p', { style: 'margin:0 0 0.3rem;font-weight:600' }, 'Abweichungen (eine Rückmeldung, kein Fehler):'),
        el('ul', { style: 'margin:0;padding-left:1.2rem' }, ...abw.map((t) => el('li', {}, t)))));
}

function zeichne(fokusId = null) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, `🗓️ ${daten.titel}`),
    el('p', { class: 'k-untertitel' }, 'Zehn Einheiten pro Woche nach der Quelle – planen, prüfen, als Datei speichern'),
    el('section', { class: 'k-karte mw-nur-bildschirm' },
      el('p', { style: 'margin-top:0;font-weight:600' }, daten.hinweis),
      el('p', {}, daten.wasEsIst),
      el('p', { class: 'mw-quelle' }, `Quelle: ${daten.quelle.werk}`),
      el('p', { style: 'margin:0.4rem 0 0;font-size:0.9rem;color:#4b5563' }, MARKE_QUELLE),
      el('p', { class: 'mw-quelle' }, daten.monatsregel)),
    el('section', { class: 'k-karte mw-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Richtwerte der Quelle (Einheiten pro Woche)'),
      ...daten.richtwerte.map((r) => el('p', { class: 'mw-zahlen' },
        `${r.name}: ${r.anzahl} (${r.quelle})`))),
    ...plan.woche.map(tagKarte),
    statusKarte(),
    meldung ? el('div', { class: `k-hinweis ${meldung.ok ? 'k-hinweis--richtig' : 'k-hinweis--falsch'}` }, el('p', { style: 'margin:0' }, meldung.text)) : '',
    el('section', { class: 'k-karte mw-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Plan speichern und laden'),
      el('p', { class: 'mw-quelle', style: 'margin-top:0' }, 'Die Datei enthält nur Tage, Bereiche und Bausteine. Sie geht auf dem Weg, den Ihre Einrichtung nutzt.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', id: 'mw-export', onclick: exportiere }, '📤 Plan als Datei speichern'),
        el('button', { class: 'k-knopf k-knopf--neutral', id: 'mw-leeren', onclick: () => { plan = neuerPlan(daten); meldung = null; zeichne(); } }, '🗑️ Plan leeren')),
      el('label', { for: 'mw-datei', class: 'mw-quelle', style: 'display:block;margin-top:0.8rem' }, 'Plan-Datei laden'),
      el('input', { type: 'file', id: 'mw-datei', accept: '.json,application/json', onchange: importiere })),
    el('footer', { class: 'k-fuss mw-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Fachkräfte · läuft offline · nichts wird gespeichert · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  if (fokusId) document.getElementById(fokusId)?.focus();
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
    el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  zeichne();
}
