// Sprich mit mir – Sprachanbahnung im ersten Jahr (für Eltern).
// Praleska docs/10 (Eltern-Werkzeuge Nr. 48), Quelle S. 37-39.
//
// Das Gerät ist in der Hand des Erwachsenen; das Baby sieht keinen
// Bildschirm. Der Katalog ist nach dem Signal des Kindes geordnet, das der
// Erwachsene gerade sieht – nicht nach Lebenswoche (siehe logik.mjs).
//
// Gespeichert wird genau eine Sache: die Merkliste EIGENER Vorhaben des
// Erwachsenen. Nichts über das Kind, kein Geburtsdatum, kein Alter, kein
// Eingabefeld. Politik docs/02: keine externen Anfragen.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  MERK_STATUS, periodeVon, impulseFuer, signaleIn, naechsterImpuls, impulsText, pruefeDaten,
} from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'smm.merkliste';
const app = document.getElementById('app');
const daten = await fetch('daten/impulse.json').then((r) => r.json());

let periode = null;
let signal = null;
let impuls = null;

const lade = () => { try { return JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}'); } catch { return {}; } };
const speichere = (m) => { try { localStorage.setItem(SCHLUESSEL, JSON.stringify(m)); } catch { /* privater Modus */ } };

/** Nur eine Stimme, die auf dem Gerät liegt – siehe Kommentar in Nr. 49. */
function lokaleStimme() {
  if (!('speechSynthesis' in globalThis)) return null;
  const stimmen = speechSynthesis.getVoices?.() ?? [];
  if (!stimmen.length) return undefined;
  return stimmen.find((s) => s.localService && String(s.lang ?? '').toLowerCase().startsWith('de')) ?? null;
}

function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  if (lokaleStimme() === null) {
    return el('p', { class: 'k-hinweis', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(text) }, beschriftung);
}

/**
 * Der Warnzeichen-Block. Steht in JEDER Ansicht, ist nicht ausblendbar und
 * wird nie mit Streuungssprache gemischt: die ganze Mechanik dieser App
 * („auf den Laut antworten“) setzt voraus, dass das Kind hört.
 */
function warnBlock() {
  const w = daten.warnzeichen;
  return el('section', { class: 'k-karte', style: 'border:2px solid var(--k-rot)' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, `🩺 ${w.titel}`),
    el('p', { style: 'margin:0 0 0.4rem' }, w.vorspann),
    el('ul', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' },
      ...w.punkte.map((p) => el('li', { style: 'margin-bottom:0.3rem' }, p))),
    el('p', { style: 'margin:0;font-weight:600' }, w.wasTun));
}

const block = (b, zeichen) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, `${zeichen} ${b.titel}`),
  el('p', { style: 'margin:0' }, b.text),
  b.sicherung ? el('p', { style: 'margin:0.4rem 0 0;font-weight:600' }, b.sicherung) : null,
  b.quelle ? el('p', { style: 'margin:0.4rem 0 0;font-size:0.85rem;color:#4b5563' }, b.quelle) : null);

function impulsKarte() {
  const anker = daten.anker.find((a) => a.id === impuls.anker);
  const liste = impulseFuer(daten, periode, signal);
  return el('section', { class: 'k-karte' },
    el('p', { style: 'margin:0 0 0.2rem;font-size:0.9rem;color:#4b5563' },
      `${(daten.signale.find((s) => s.id === impuls.signal) ?? {}).name ?? ''} · ${anker ? anker.name : ''}`),
    el('h2', { style: 'margin:0 0 0.4rem;font-size:1.15rem' }, impuls.titel),
    el('p', { style: 'margin:0 0 0.5rem' }, impuls.erwachsenenText),
    impuls.eigeneWorte
      ? el('div', { class: 'k-hinweis', style: 'margin:0 0 0.5rem' },
        el('p', { style: 'margin:0' }, `✍️ ${daten.bloecke.eigeneWorte.text}`))
      : null,
    vorleseKnopf(impulsText(daten, impuls), '🔊 Idee vorlesen'),
    el('div', { class: 'k-antworten' },
      liste.length > 1
        ? el('button', {
          class: 'k-knopf k-knopf--neutral',
          onclick: () => { impuls = naechsterImpuls(liste, impuls.id); render(); },
        }, '🔄 Noch eine Idee')
        : null,
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { signal = null; impuls = null; render(); } },
        '↩️ Anderes Signal')),
    el('p', { style: 'margin:0.5rem 0 0;font-size:0.9rem' }, daten.einImpuls));
}

function merkKarte() {
  const merk = lade();
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📝 Was ich mir vornehme'),
    el('p', { style: 'margin:0 0 0.4rem;font-size:0.95rem' },
      'Hier steht nichts über dein Kind. Jeder Satz ist ein Vorhaben von dir – und du kannst ihn jederzeit wieder abwählen.'),
    ...daten.merkliste.map((m) => {
      const stand = merk[m.id];
      const naechster = stand === undefined ? MERK_STATUS[0]
        : stand === MERK_STATUS[0] ? MERK_STATUS[1] : undefined;
      const zeichen = stand === MERK_STATUS[0] ? '🔖' : stand === MERK_STATUS[1] ? '✔️' : '☐';
      // Der zugängliche Name nennt den Stand auf DEUTSCH. Vorher stand hier
      // der rohe Enum-Wert, und eine Sprachausgabe las „moechte-ich“ vor.
      const wort = stand === MERK_STATUS[0] ? 'möchte ich' : stand === MERK_STATUS[1] ? 'schon probiert' : 'nicht gewählt';
      return el('div', { style: 'padding:0.4rem 0;border-top:1px solid var(--k-rand)' },
        el('button', {
          class: `k-knopf k-knopf--klein ${stand ? '' : 'k-knopf--neutral'}`,
          style: 'text-align:start;width:100%;min-height:3rem',
          // Drei Zustände, darum `aria-pressed` und kein `role="checkbox"`:
          // eine Checkbox kennt nur an und aus, und der Stand steht dazu im
          // Namen. Nächster Schritt wird mitgesagt, damit klar ist, was ein
          // Antippen tut.
          'aria-pressed': String(Boolean(stand)),
          'aria-label': `${m.satz} – ${wort}. Antippen: `
            + `${naechster === MERK_STATUS[0] ? 'möchte ich' : naechster === MERK_STATUS[1] ? 'schon probiert' : 'abwählen'}`,
          onclick: () => {
            const n = lade();
            if (naechster === undefined) delete n[m.id]; else n[m.id] = naechster;
            speichere(n); render();
          },
        }, `${zeichen} ${m.satz}`),
        stand ? el('small', { style: 'color:#4b5563' }, wort) : null);
    }),
    el('div', { class: 'k-antworten' },
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        onclick: () => {
          if (globalThis.confirm?.('Alle eigenen Vorhaben auf diesem Gerät löschen?')) {
            try { localStorage.removeItem(SCHLUESSEL); } catch { /* egal */ }
            render();
          }
        },
      }, '🧹 Meine Vorhaben löschen')));
}

function render() {
  const p = periode ? periodeVon(daten, periode) : null;

  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🗣️ Sprich mit mir'),
    el('p', { class: 'k-untertitel' }, 'Verständigung im ersten Jahr – für dich, nicht fürs Baby'),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
      block(daten.bloecke.dialog, '💬'),
      block(daten.bloecke.mehrsprachig, '🌍'),
      block(daten.bloecke.bildschirm, '📵'),
      block(daten.bloecke.hoeren, '👂'),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'margin:0' }, `🧑‍🍼 ${daten.geraet}`),
        el('p', { style: 'margin:0.3rem 0 0' }, `🛟 ${daten.erwachsener}`)),
      vorleseKnopf(`${daten.hinweis} ${daten.bloecke.dialog.text} ${daten.bloecke.mehrsprachig.text} ${daten.bloecke.mehrsprachig.sicherung}`,
        '🔊 Das Wichtigste vorlesen')),
    warnBlock(),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🗓️ Wo ist dein Kind gerade?'),
      el('p', { style: 'margin:0 0 0.4rem;font-size:0.95rem' },
        'Die drei Abschnitte überlappen absichtlich – such den, dessen Beschreibung passt. Es gibt kein Alter einzugeben.'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Abschnitt wählen' },
        ...daten.perioden.map((x) => el('button', {
          class: `k-knopf ${x.id === periode ? '' : 'k-knopf--neutral'}`,
          style: 'min-height:3.6rem;text-align:start',
          'aria-pressed': String(x.id === periode),
          onclick: () => { periode = x.id; signal = null; impuls = null; render(); },
        }, `${x.name} — ${x.passtWenn}`))),
      p ? el('p', { style: 'margin:0.4rem 0 0;font-size:0.85rem;color:#4b5563' }, p.ueberlappung) : null),
    periode && !impuls
      ? el('section', { class: 'k-karte' },
        el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '👀 Was macht dein Kind gerade?'),
        el('p', { style: 'margin:0 0 0.4rem;font-size:0.95rem' },
          'Die Idee gehört in die Sekunde NACH dem Signal. Wähl das, was du gerade siehst.'),
        el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Signal wählen' },
          ...signaleIn(daten, periode).map((s) => el('button', {
            class: 'k-knopf k-knopf--neutral', style: 'min-height:3.4rem;text-align:start',
            onclick: () => {
              signal = s.id;
              impuls = mischen(impulseFuer(daten, periode, s.id))[0] ?? null;
              render();
            },
          }, `${s.zeichen} ${s.name}`))))
      : null,
    impuls ? impulsKarte() : null,
    merkKarte(),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, `📚 ${daten.bloecke.praleska.titel}`),
      el('p', { style: 'margin:0 0 0.3rem;font-size:0.9rem' }, daten.bloecke.praleska.text),
      el('p', { style: 'margin:0;font-size:0.85rem;color:#4b5563' }, daten.quelle.abschnitt),
      el('p', { style: 'margin:0.3rem 0 0;font-size:0.85rem;color:#4b5563' }, daten.quelle.nichtVonHier)),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Eltern · kein Bildschirm fürs Kind · keine Daten über dein Kind · '),
      el('a', { href: '../vorlese-kompass/' }, 'Vorlesen ab 1 Jahr'), el('span', {}, ' · '),
      el('a', { href: '../meilenstein-begleiter/' }, 'Meilensteine beobachten'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
    el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
