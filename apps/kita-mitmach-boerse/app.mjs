// Kita-Mitmach-Börse (Praleska docs/10, Kita-Abschnitt, Nr. 75). Eigenentwurf –
// siehe logik.mjs. Angebote aus dem Familienkapitel der Quelle (S. 24–25).
// Keine Namen, kein Freitext, keine externen Anfragen (docs/02).
// Die Familien-Ansicht merkt sich die eigene Stimme auf dem Gerät (mit Löschknopf).
// Die Team-Ansicht merkt sich nichts: geladene Dateien bleiben nur im Speicher
// der offenen Seite.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { datenKarte } from '../../packages/kinder-ui/js/daten-karte.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { CODE_LAENGE, alleIds, neuerCode, packeKoffer, pruefeDaten, pruefeKoffer, vereinige, zaehle } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
// Ein fehlender Katalog wird gemeldet, statt die Seite still abbrechen zu lassen.
const daten = await fetch('daten/angebote.json')
  .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
  .catch(() => null);

const SCHLUESSEL = 'kita-mitmach-boerse:stimme';
const DATEI_NAME = 'kita-mitmach-boerse-stimme.json';

/** Die eigene Stimme: Zufallscode und Häkchen je Angebot. `null`, solange nichts markiert oder gespeichert ist. */
let eigene = ladeEigene();
/** Team-Ansicht: Stimmen aus den geladenen Dateien, nur im Speicher. */
let teamEintraege = [];
/** Rückmeldung nach dem Laden von Dateien. */
let statusZeile = null;

function ladeEigene() {
  try {
    const roh = globalThis.localStorage?.getItem(SCHLUESSEL);
    if (!roh) return null;
    const inhalt = JSON.parse(roh);
    if (pruefeKoffer(inhalt, daten).length > 0) return null;
    return {
      code: inhalt.code,
      auswahl: Object.fromEntries(inhalt.stimmen.map((s) => [s.id, { interessiert: s.interessiert, mithilfe: s.mithilfe }])),
    };
  } catch {
    // Gesperrter Speicher oder kaputte Angabe: die Stimme beginnt neu.
    return null;
  }
}

/** true, wenn die Stimme auf dem Gerät liegt. false: sie gilt nur bis zum Schließen der Seite. */
function merkeEigene() {
  const speicher = globalThis.localStorage;
  if (!speicher) return false;
  try {
    speicher.setItem(SCHLUESSEL, packeKoffer(koffer()));
    return true;
  } catch {
    // Privates Fenster oder gesperrter Speicher: die Datei lässt sich trotzdem speichern.
    return false;
  }
}

function neuerZufallsCode() {
  return neuerCode(Array.from(crypto.getRandomValues(new Uint8Array(CODE_LAENGE))));
}

/** Die eigene Stimme anlegen. Der Code wird sofort gemerkt, damit eine zweite Datei
 *  dieselbe Familie nicht noch einmal zählt. */
function eigeneStimme() {
  if (!eigene) {
    eigene = { code: neuerZufallsCode(), auswahl: {} };
    merkeEigene();
  }
  return eigene;
}

/** Der Inhalt der Datei: alle Angebote, auch die ohne Häkchen – das macht die Datei eindeutig. */
function koffer() {
  const e = eigeneStimme();
  return { code: e.code, stimmen: alleIds(daten).map((id) => ({ id, ...e.auswahl[id] })) };
}

function setze(id, feld, wert) {
  const e = eigeneStimme();
  e.auswahl[id] = { interessiert: false, mithilfe: false, ...e.auswahl[id], [feld]: wert };
  const gemerkt = merkeEigene();
  if (statusZeile) {
    statusZeile.textContent = gemerkt
      ? 'Auf diesem Gerät gemerkt. Noch nichts gesendet – das passiert nur mit der Datei.'
      : 'Nur bis zum Schließen dieser Seite gemerkt: der Speicher des Geräts ist gesperrt. Bitte die Datei speichern, bevor Sie die Seite schließen.';
  }
}

function exportiere() {
  const blob = new Blob([packeKoffer(koffer())], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anker = el('a', { href: url, download: DATEI_NAME });
  document.body.append(anker);
  anker.click();
  anker.remove();
  // Erst später freigeben: manche Browser brechen den Download sonst ab.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  if (statusZeile) statusZeile.textContent = 'Datei gespeichert. Sie enthält nur einen Zufallscode und deine Häkchen.';
}

const kopf = (text) => el('h1', { class: 'k-titel' }, text);
const quelleZeile = () => el('p', { class: 'mb-quelle' }, `Quelle: ${daten.quelle.werk}`);

const footer = () => el('footer', { class: 'k-fuss' },
  el('span', {}, 'Werkzeug für Fachkräfte und Familien · läuft offline · keine Namen · '),
  el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz'));

const zurueckKnopf = () => el('div', { class: 'k-antworten' },
  el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', id: 'mb-start', onclick: startBildschirm }, '🏠 Zum Start'));

function startBildschirm() {
  statusZeile = null;
  app.replaceChildren(
    kopf('🎨 Kita-Mitmach-Börse'),
    el('p', { class: 'k-untertitel' }, 'Welche Angebote interessieren Sie – und wobei können Sie mithelfen?'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, daten.wasEsIst),
      quelleZeile()),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Wer nutzt die App?'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', id: 'mb-eltern', onclick: elternBildschirm }, '👪 Familie: Angebote markieren'),
        el('button', { class: 'k-knopf k-knopf--neutral', id: 'mb-team', onclick: () => teamBildschirm() }, '🧑‍🏫 Team: Dateien zählen'))),
    footer());
}

function angebotsZeile(a) {
  const wahl = eigene?.auswahl[a.id] ?? {};
  const feld = (name, text) => {
    const box = el('input', {
      type: 'checkbox',
      id: `mb-${a.id}-${name}`,
      onchange: (ev) => setze(a.id, name, ev.target.checked),
    });
    box.checked = !!wahl[name];
    return el('label', { class: 'mb-feld' }, box, text);
  };
  return el('div', { class: 'mb-zeile' },
    el('p', { class: 'mb-name' }, a.deutsch, el('br'), el('span', { class: 'mb-russisch', lang: 'ru' }, a.russisch)),
    el('div', { class: 'mb-felder' },
      feld('interessiert', 'interessiert'),
      feld('mithilfe', 'kann mithelfen')));
}

function elternBildschirm() {
  statusZeile = el('p', { class: 'mb-hinweis', 'aria-live': 'polite' }, '');
  app.replaceChildren(
    kopf('👪 Angebote markieren'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Je Angebot zwei Häkchen: „interessiert“ und „kann mithelfen“. Namen werden nicht abgefragt.'),
      quelleZeile(),
      statusZeile),
    el('section', { class: 'k-karte' },
      el('fieldset', { class: 'mb-gruppe' }, el('legend', {}, 'Formate'), ...daten.formate.map(angebotsZeile)),
      el('fieldset', { class: 'mb-gruppe' }, el('legend', {}, 'Clubs'), ...daten.clubs.map(angebotsZeile))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '📤 Stimme als Datei speichern'),
      el('p', { style: 'margin-top:0' }, 'Die Datei enthält nur einen Zufallscode und deine Häkchen. Sie geht auf dem Weg an das Team, den Sie gewohnt sind.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', id: 'mb-export', onclick: exportiere }, '📤 Datei speichern'))),
    datenKarte({
      schluessel: SCHLUESSEL,
      was: 'deine Häkchen und ein Zufallscode',
      nachLoeschen: () => {
        eigene = null;
        elternBildschirm();
      },
    }),
    zurueckKnopf(),
    footer());
}

async function importiere(ev) {
  const dateien = [...(ev.target.files ?? [])];
  let gezaehlt = 0;
  const abgewiesen = [];
  const neue = [];
  for (const datei of dateien) {
    let inhalt;
    try {
      inhalt = JSON.parse(await datei.text());
    } catch {
      abgewiesen.push('die Datei ließ sich nicht lesen');
      continue;
    }
    const fehler = pruefeKoffer(inhalt, daten);
    if (fehler.length > 0) {
      abgewiesen.push(fehler[0]);
      continue;
    }
    neue.push({ code: inhalt.code, stimmen: inhalt.stimmen });
    gezaehlt += 1;
  }
  teamEintraege = [...teamEintraege, ...neue];
  const text = abgewiesen.length === 0
    ? `${gezaehlt} ${gezaehlt === 1 ? 'Datei' : 'Dateien'} gezählt.`
    : `${gezaehlt} gezählt, ${abgewiesen.length} abgewiesen (Grund der ersten: ${abgewiesen[0]}).`;
  teamBildschirm({ ok: abgewiesen.length === 0, text });
}

function teamBildschirm(meldung) {
  const { familien, summen } = zaehle(vereinige(teamEintraege), daten);
  const alle = [...daten.formate, ...daten.clubs];
  app.replaceChildren(
    kopf('🧑‍🏫 Dateien zählen'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Die Familien-Dateien einlesen. Gezählt werden die Häkchen je Angebot. Die App schreibt keine Namen in die Dateien; eine von Hand gebaute Datei könnte im Code Buchstaben tragen, das prüft die App nicht. Die Summen zeigen keine Codes.'),
      el('label', { for: 'mb-dateien', style: 'font-weight:600;display:block;margin-bottom:0.4rem' }, 'Dateien auswählen (mehrere sind möglich)'),
      el('input', { type: 'file', id: 'mb-dateien', multiple: true, accept: '.json,application/json', onchange: importiere }),
      meldung
        ? el('div', { class: `k-hinweis ${meldung.ok ? 'k-hinweis--richtig' : 'k-hinweis--falsch'}`, style: 'margin-top:0.6rem' },
          el('p', { style: 'margin:0' }, meldung.text))
        : '',
      el('p', { style: 'margin:0.6rem 0 0', 'aria-live': 'polite' }, `Familien gezählt: ${familien}`)),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, 'Häkchen je Angebot'),
      ...alle.map((a) => el('div', { class: 'mb-zeile' },
        el('p', { class: 'mb-name' }, a.deutsch),
        el('p', { class: 'mb-zahlen' }, `interessiert: ${summen[a.id].interessiert} · kann mithelfen: ${summen[a.id].mithilfe}`)))),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
      el('p', { style: 'margin:0.6rem 0 0' }, 'Dateien mit demselben Code zählen einmal; die zuletzt geladene gilt. Die App kann nicht erkennen, ob zwei Dateien von derselben Familie stammen. Eine Datei lässt sich auch von Hand bauen – die Zählung ist deshalb eine Stimmung, keine Erhebung.'),
      el('p', { style: 'margin:0.6rem 0 0' }, 'Bei sehr wenigen Familien lassen sich Summen auf einzelne Familien zurückführen. Das Team entscheidet, ob es die Summen zeigt.'),
      el('details', { style: 'margin-top:0.8rem' },
        el('summary', { style: 'font-weight:600' }, 'Was sagt das Gesetz dazu?'),
        el('p', {}, daten.praxis),
        ...daten.rechtlich.map((r) => el('div', { class: 'mb-zeile' },
          el('p', { class: 'mb-name' }, r.titel),
          el('p', { style: 'margin:0 0 0.2rem' }, r.text),
          el('p', { class: 'mb-quelle', style: 'margin:0' }, r.quelle)))),
      el('div', { class: 'k-antworten', style: 'margin-top:0.8rem' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', id: 'mb-vergessen', onclick: () => {
          teamEintraege = [];
          teamBildschirm();
        } }, '🗑️ Geladene Dateien vergessen'))),
    zurueckKnopf(),
    footer());
}

const fehler = daten ? pruefeDaten(daten) : ['Die Angebote konnten nicht geladen werden.'];
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
    el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  startBildschirm();
}
