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
import { el, vorlesen, mischen, lokaleStimme } from '../../packages/kinder-ui/js/komponenten.mjs';
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

// Der Stand liegt im Arbeitsspeicher, localStorage ist die Kopie. Vorher
// lasen und schrieben alle Wege direkt in den Speicher: war er gesperrt
// (privater Modus, blockierte Website-Daten), tat jedes Antippen sichtbar
// nichts, ohne zu sagen warum.
let merkStand = (() => { try { return JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}') ?? {}; } catch { return {}; } })();
let speicherSperre = false;

const lade = () => merkStand;
function speichere(m) {
  merkStand = m;
  try {
    if (!Object.keys(m).length) localStorage.removeItem(SCHLUESSEL);
    else localStorage.setItem(SCHLUESSEL, JSON.stringify(m));
    speicherSperre = false;
  } catch { speicherSperre = true; }
}

/** Nur eine Stimme, die auf dem Gerät liegt – siehe Kommentar in Nr. 49. */

function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  const stimme = lokaleStimme('de');
  if (stimme === null) {
    return el('p', { class: 'k-hinweis', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(text, 'de-DE', stimme) }, beschriftung);
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
          id: 'smm-noch-eine',
          onclick: () => { impuls = naechsterImpuls(liste, impuls.id); render('smm-noch-eine'); },
        }, '🔄 Noch eine Idee')
        : null,
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { signal = null; impuls = null; render(); } },
        '↩️ Anderes Signal')),
    el('p', { style: 'margin:0.5rem 0 0;font-size:0.9rem' }, daten.einImpuls),
    // `abbruch` war ein Pflichtfeld im Validator und stand auf keinem
    // Bildschirm: eine Zusage, die geprüft wird und die niemand liest.
    el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, daten.abbruch));
}

function merkKarte() {
  const merk = lade();
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📝 Was ich mir vornehme'),
    speicherSperre
      ? el('div', { class: 'k-hinweis k-hinweis--falsch' },
        el('p', { style: 'margin:0' },
          '⚠️ Dieser Browser kann gerade nichts behalten (privater Modus oder blockierte Website-Daten). '
          + 'Deine Auswahl gilt, solange die Seite offen bleibt.'))
      : null,
    el('p', { style: 'margin:0 0 0.4rem;font-size:0.95rem' },
      'Hier steht nichts über dein Kind. Jeder Satz ist ein Vorhaben von dir – und du kannst ihn jederzeit wieder abwählen.'),
    ...daten.merkliste.map((m) => {
      const gewaehlt = merk[m.id];
      const naechster = gewaehlt === undefined ? MERK_STATUS[0]
        : gewaehlt === MERK_STATUS[0] ? MERK_STATUS[1] : undefined;
      const zeichen = gewaehlt === MERK_STATUS[0] ? '🔖' : gewaehlt === MERK_STATUS[1] ? '✔️' : '☐';
      // Der zugängliche Name nennt den Stand auf DEUTSCH. Vorher stand hier
      // der rohe Enum-Wert, und eine Sprachausgabe las „moechte-ich“ vor.
      const wort = gewaehlt === MERK_STATUS[0] ? 'möchte ich' : gewaehlt === MERK_STATUS[1] ? 'schon probiert' : 'nicht gewählt';
      return el('div', { style: 'padding:0.4rem 0;border-top:1px solid var(--k-rand)' },
        el('button', {
          class: `k-knopf k-knopf--klein ${gewaehlt ? '' : 'k-knopf--neutral'}`,
          style: 'text-align:start;width:100%;min-height:3rem',
          // Eigener Namensraum: seit die Abschnitt- und Signalknöpfe Ids
          // tragen, wäre `smm-<id>` nicht mehr eindeutig - ein Selektor auf
          // `smm-` traf den Abschnittsknopf (von der Browser-Probe gefunden).
          id: `smm-merk-${m.id}`,
          // Drei Zustände, darum `aria-pressed` und kein `role="checkbox"`:
          // eine Checkbox kennt nur an und aus, und der Stand steht dazu im
          // Namen. Nächster Schritt wird mitgesagt, damit klar ist, was ein
          // Antippen tut.
          'aria-pressed': String(Boolean(gewaehlt)),
          'aria-label': `${m.satz} – ${wort}. Antippen: `
            + `${naechster === MERK_STATUS[0] ? 'möchte ich' : naechster === MERK_STATUS[1] ? 'schon probiert' : 'abwählen'}`,
          onclick: () => {
            const n = { ...lade() };
            if (naechster === undefined) delete n[m.id]; else n[m.id] = naechster;
            speichere(n);
            // Mit dem Fokus zurück auf die getippte Zeile – sonst landet er
            // nach jedem Antippen auf <body>.
            render(`smm-merk-${m.id}`);
          },
        }, `${zeichen} ${m.satz}`),
        gewaehlt ? el('small', { style: 'color:#4b5563' }, wort) : null);
    }),
    el('div', { class: 'k-antworten' },
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        onclick: () => {
          if (globalThis.confirm?.('Alle eigenen Vorhaben auf diesem Gerät löschen?')) {
            speichere({});
            render();
          }
        },
      }, '🧹 Meine Vorhaben löschen')));
}

function render(fokusId = null) {
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
          id: `smm-periode-${x.id}`,
          'aria-pressed': String(x.id === periode),
          onclick: () => { periode = x.id; signal = null; impuls = null; render(`smm-periode-${x.id}`); },
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
            id: `smm-signal-${s.id}`,
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

  // Fokus zurueck auf das Element, das gerade gedrueckt wurde. Vorher lief
  // das nur fuer die Merkliste (`smm-<id>`), und damit verloren genau die
  // Knoepfe den Fokus an <body>, die man mehrfach hintereinander drueckt:
  // Abschnitt, Signal, „Noch eine Idee". Ein Tastaturnutzer musste nach
  // jedem Druck von vorn durchtabben (Review der Welle 78).
  if (fokusId) document.getElementById(fokusId)?.focus();
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
    el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
