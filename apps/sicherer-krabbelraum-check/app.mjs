// Sicherer-Krabbelraum-Check (Eltern, Kindertagespflege, Krippe).
// Praleska docs/10 (Eltern-Werkzeuge Nr. 50), Quelle S. 34.
//
// Der Check schaut auf den Raum, nicht auf das Kind und nicht auf den
// Erwachsenen. Es gibt keine Gesamtwertung: kein Prozentwert, keine Ampel,
// kein „bestanden“ (siehe logik.mjs). Politik docs/02: keine externen
// Anfragen; ein localStorage-Schlüssel, löschbar.
import { el, vorlesen, lokaleStimme } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  kriterienFuer, istAbhakbar, bereicheInReihenfolge, offenePunkte, dauerregeln, bericht, pruefeDaten,
} from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'skc.erledigt';
const app = document.getElementById('app');
const daten = await fetch('daten/kriterien.json').then((r) => r.json());

let profil = null;
let koennen = new Set();

// Der Stand liegt im Arbeitsspeicher und localStorage ist nur die Kopie.
// Vorher lasen und schrieben alle Wege direkt in den Speicher: war er
// gesperrt (privater Modus, blockierte Website-Daten), schluckte `speichere`
// den Fehler, `render` las wieder aus dem Speicher – und jedes Antippen tat
// sichtbar nichts, ohne zu sagen warum.
//
// Und die Haken liegen JE PROFIL. Vorher war es eine flache Liste, und 31
// von 32 Zeilen gelten für alle drei Profile: wer zuhause abgehakt hatte,
// sah eine nie besichtigte Krippe als erledigt.
let stand = (() => {
  try {
    const roh = JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}');
    // Altbestand ohne Profil-Ebene: unter „zuhause“ einsortieren.
    return roh && typeof roh === 'object' && Object.values(roh).every((v) => v === true)
      ? { zuhause: roh } : (roh ?? {});
  } catch { return {}; }
})();
let speicherSperre = false;

const lade = () => stand[profil] ?? {};

function speichere() {
  try {
    // Bleibt nach dem Löschen nichts übrig, verschwindet auch der Schlüssel –
    // sonst läge ein leeres Objekt im Speicher und die Zusage „löschbar“
    // wäre nur halb wahr (docs/02).
    const leer = Object.values(stand).every((e) => !e || !Object.keys(e).length);
    if (leer) localStorage.removeItem(SCHLUESSEL);
    else localStorage.setItem(SCHLUESSEL, JSON.stringify(stand));
    speicherSperre = false;
  } catch { speicherSperre = true; }
}

function umschalten(id) {
  const e = { ...lade() };
  if (e[id]) delete e[id]; else e[id] = true;
  stand = { ...stand, [profil]: e };
  speichere();
  // Mit dem Fokus zurück auf die eben getippte Zeile: ohne das landet er
  // nach jedem Haken auf <body>, und eine Liste mit über zwanzig Zeilen
  // müsste per Tastatur jedes Mal neu durchgetabbt werden.
  render(id);
}


function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  const stimme = lokaleStimme('de');
  if (stimme === null) {
    return el('p', { class: 'k-hinweis skc-nur-bildschirm', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', { class: 'k-knopf k-knopf--neutral skc-nur-bildschirm', onclick: () => vorlesen(text, 'de-DE', stimme) }, beschriftung);
}

function kriteriumZeile(k, erledigt) {
  const an = !!erledigt[k.id];
  const abhakbar = istAbhakbar(k);
  return el('div', { style: 'padding:0.5rem 0;border-top:1px solid var(--k-rand)' },
    abhakbar
      ? el('button', {
        class: `k-knopf k-knopf--klein ${an ? '' : 'k-knopf--neutral'}`,
        role: 'checkbox', 'aria-checked': String(an),
        id: `skc-${k.id}`,
        style: 'text-align:start;width:100%;min-height:3rem',
        onclick: () => umschalten(k.id),
        // Das Häkchen-Zeichen gehört nicht aufs Papier (docs/02: kein Haken
        // auf einem Druckblatt) – darum eine eigene Klasse dafür.
      }, el('span', { class: 'skc-marke' }, an ? '☑ ' : '☐ '), `${k.kritisch ? '❗ ' : ''}${k.was}`)
      // Dauerregeln sind nicht abhakbar: ein Haken würde eine Regel für
      // jedes Mal als erledigt ausgeben.
      : el('p', { style: 'margin:0;font-weight:600' }, `🔁 ${k.kritisch ? '❗ ' : ''}${k.was}`),
    el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem;color:#4b5563' }, k.warum),
    el('p', { style: 'margin:0.1rem 0 0;font-size:0.8rem;color:#6b7280' },
      `${abhakbar ? 'Einmal erledigen' : 'Regel für jedes Mal'} · ${k.quelle.gremium}`));
}

function render(fokusId = null) {
  const erledigt = lade();
  const ausloeser = [...koennen];

  if (!profil) {
    app.replaceChildren(
      el('h1', { class: 'k-titel' }, '🧷 Sicherer Krabbelraum'),
      el('p', { class: 'k-untertitel' }, 'Ein Blick auf den Raum – nicht auf dein Kind'),
      el('section', { class: 'k-karte' },
        el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
        el('p', { style: 'margin:0.6rem 0 0' }, daten.keinErgebnis),
        vorleseKnopf(`${daten.hinweis} ${daten.keinErgebnis}`, '🔊 Das Wichtigste vorlesen')),
      el('section', { class: 'k-karte' },
        el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🏠 Wo schaust du?'),
        el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Profil wählen' },
          ...daten.profile.map((p) => el('button', {
            class: 'k-knopf', style: 'min-height:3.6rem;text-align:start',
            onclick: () => { profil = p.id; render(); },
          }, `${p.name} — ${p.beschreibung}`)))),
      el('footer', { class: 'k-fuss' },
        el('span', {}, 'Werkzeug für Erwachsene · '),
        el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
    return;
  }

  const liste = kriterienFuer(daten, profil, ausloeser);
  const offen = offenePunkte(daten, profil, ausloeser, erledigt);
  const regeln = dauerregeln(daten, profil, ausloeser);
  const berichtsFeld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:12rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': 'Liste der offenen Punkte',
  });
  berichtsFeld.value = bericht(daten, profil, ausloeser, erledigt);

  app.replaceChildren(...[
    el('div', { class: 'skc-nur-bildschirm' },
      el('h1', { class: 'k-titel' }, '🧷 Sicherer Krabbelraum'),
      el('p', { class: 'k-untertitel' }, (daten.profile.find((p) => p.id === profil) ?? {}).name ?? '')),
    el('section', { class: 'k-karte skc-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '👀 Was kann dein Kind schon?'),
      el('p', { style: 'margin:0 0 0.4rem;font-size:0.95rem' },
        'Das ist nur ein Filter: welche Zeilen jetzt dran sind. Es wird nichts bewertet und kein Alter erwartet.'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Fähigkeiten wählen' },
        ...daten.ausloeser.filter((a) => a.id !== 'immer').map((a) => el('button', {
          class: `k-knopf k-knopf--klein ${koennen.has(a.id) ? '' : 'k-knopf--neutral'}`,
          style: 'text-align:start;min-height:3rem',
          'aria-pressed': String(koennen.has(a.id)),
          onclick: () => { if (koennen.has(a.id)) koennen.delete(a.id); else koennen.add(a.id); render(); },
        }, `${koennen.has(a.id) ? '☑' : '☐'} ${a.frage}`)))),
    ...bereicheInReihenfolge(daten).map((b) => {
      const drin = liste.filter((k) => k.bereich === b.id);
      if (!drin.length) return null;
      return el('section', { class: `k-karte skc-block ${drin.some((k) => k.kritisch) ? 'skc-kritisch' : ''}` },
        el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `${b.zeichen} ${b.name}`),
        b.vorspann ? el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, b.vorspann)) : null,
        ...drin.map((k) => kriteriumZeile(k, erledigt)),
        vorleseKnopf(drin.map((k) => `${k.was} ${k.warum}`).join(' '), `🔊 ${b.name} vorlesen`));
    }),
    // Auf dem Papier steht die Offen-Liste als Text. Die Klickliste oben
    // trägt Häkchen-Zeichen, und die haben auf einem Druckblatt nichts zu
    // suchen (docs/02) – gedruckt wird darum dieser Block hier.
    el('section', { class: 'k-karte skc-block skc-nur-druck' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📋 Offene Punkte'),
      offen.filter((x) => x.kritisch).length
        ? el('div', {},
          el('p', { style: 'margin:0 0 0.2rem;font-weight:700' }, 'Das zuerst:'),
          el('ul', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' },
            ...offen.filter((x) => x.kritisch).map((x) => el('li', {}, x.was))))
        : null,
      offen.filter((x) => !x.kritisch).length
        ? el('div', {},
          el('p', { style: 'margin:0 0 0.2rem;font-weight:700' }, 'Noch offen:'),
          el('ul', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' },
            ...offen.filter((x) => !x.kritisch).map((x) => el('li', {}, x.was))))
        : null,
      el('p', { style: 'margin:0 0 0.2rem;font-weight:700' }, 'Regeln für jedes Mal (nicht abhakbar):'),
      el('ul', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' },
        ...regeln.map((x) => el('li', {}, x.was))),
      el('p', { style: 'margin:0' }, daten.nichtFertig)),
    el('section', { class: 'k-karte skc-block skc-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📋 Was noch offen ist'),
      speicherSperre
        ? el('div', { class: 'k-hinweis k-hinweis--falsch' },
          el('p', { style: 'margin:0' },
            '⚠️ Dieser Browser kann gerade nichts behalten (privater Modus oder blockierte Website-Daten). '
            + 'Die Haken gelten, solange die Seite offen bleibt – druck die Liste aus, bevor du sie schließt.'))
        : null,
      // Kein Zähler über die Gesamtmenge: die Zahl sagt, wie viele Zeilen
      // noch offen sind, nie „x von y erledigt“.
      el('p', { style: 'margin:0 0 0.4rem' },
        offen.length
          ? `${offen.length} ${offen.length === 1 ? 'Punkt ist' : 'Punkte sind'} noch offen, die wichtigsten zuerst.`
          : 'Aus dieser Liste ist gerade nichts offen.'),
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.nichtFertig)),
      el('p', { style: 'margin:0.5rem 0 0' }, `🚑 ${daten.keineErsteHilfe}`),
      el('p', { style: 'margin:0.3rem 0 0' }, `☎️ ${daten.gift}`),
      el('p', { style: 'margin:0.3rem 0 0;font-size:0.9rem' }, `📡 ${daten.keineTechnik}`),
      el('p', { style: 'margin:0.3rem 0 0;font-size:0.85rem;color:#4b5563' }, `${daten.quellenHinweis} ${daten.quellenKorrektur}`),
      el('div', { class: 'skc-nur-bildschirm' },
        berichtsFeld,
        el('div', { class: 'k-antworten' },
          el('button', {
            class: 'k-knopf k-knopf--klein',
            onclick: (ev) => { berichtsFeld.select(); navigator.clipboard?.writeText(berichtsFeld.value); ev.target.textContent = '✔️ Kopiert!'; },
          }, '📋 Liste kopieren'),
          el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, '🖨️ Liste drucken'),
          el('button', {
            class: 'k-knopf k-knopf--neutral k-knopf--klein',
            onclick: () => {
              if (globalThis.confirm?.(`Alle Haken für „${(daten.profile.find((x) => x.id === profil) ?? {}).name}“ auf diesem Gerät löschen?`)) {
                stand = { ...stand, [profil]: {} };
                speichere();
                render();
              }
            },
          }, '🧹 Haken löschen'),
          el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { profil = null; render(); } }, '↩️ Anderes Profil')))),
    el('section', { class: 'k-karte skc-nur-bildschirm' },
      el('p', { style: 'margin:0;font-size:0.9rem' },
        `🔁 ${regeln.length} dieser Zeilen sind Regeln für jedes Mal und darum nicht abhakbar – `
        + 'eine Dauerregel kann nicht erledigt sein.'),
      el('p', { style: 'margin:0.4rem 0 0;font-size:0.9rem' },
        'Für die Bewegung selbst: ', el('a', { href: '../bewegungs-kartei-erstes-jahr/' }, 'Bewegungs-Kartei erstes Jahr'),
        ' · für die Entwicklung: ', el('a', { href: '../meilenstein-begleiter/' }, 'Meilenstein-Begleiter'))),
    el('footer', { class: 'k-fuss skc-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Erwachsene · keine Gesamtwertung · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));

  if (fokusId) document.getElementById(`skc-${fokusId}`)?.focus();
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
    el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
