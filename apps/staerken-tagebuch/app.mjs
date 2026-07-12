// Stärken-Tagebuch: Beobachtungsheft für Eltern (Kinder 3-7).
// Zielgruppe: ERWACHSENE. Eltern markieren beobachtete Momente aus einer
// festen Liste - bewusst KEIN Freitext über das Kind (Datensparsamkeit) -
// und erhalten zu den zwei am häufigsten beobachteten Stärkenfeldern
// Spielideen für zuhause (kostenlos, ohne Bildschirm).
// AI-Act-bewusst: nur Häufigkeit der eigenen Beobachtungen, KEIN Score,
// KEIN Ranking, KEIN Begabungs-Urteil, KEIN Vergleich zwischen Kindern.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { pruefeKatalog, zaehleJeFeld, haeufigsteFelder, aendereMarkierung, gesamtZahl } from './logik.mjs';
import { packeKoffer, pruefeKoffer, vereinigeKoffer } from './koffer.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'st.markierungen';
const app = document.getElementById('app');
const katalog = await fetch('daten/beobachtungen.json').then((r) => r.json());
const MOMENT_IDS = (katalog.felder ?? []).flatMap((f) => f.momente.map((m) => m.id));

const lade = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}');
const speichere = (m) => localStorage.setItem(SCHLUESSEL, JSON.stringify(m));

let kofferMeldung = null;

const beobachtungsWort = (n) => `${n} Beobachtung${n === 1 ? '' : 'en'}`;

function momentZeile(moment, anzahl) {
  return el('div', { style: 'display:flex;flex-wrap:wrap;gap:0.4rem;align-items:center;padding:0.45rem 0;border-top:1px solid var(--k-rand)' },
    el('span', { style: 'font-size:0.95rem;flex:1 1 14rem' }, moment.text),
    el('span', {
      style: 'font-weight:700;min-width:2.4rem;text-align:center',
      'aria-label': `bisher ${beobachtungsWort(anzahl)}`,
    }, anzahl > 0 ? `×${anzahl}` : '–'),
    el('div', { style: 'display:flex;gap:0.35rem' },
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        'aria-label': `Eine Markierung für „${moment.text}“ zurücknehmen`,
        disabled: anzahl === 0,
        onclick: () => { speichere(aendereMarkierung(lade(), moment.id, -1)); render(); },
      }, '−'),
      el('button', {
        class: 'k-knopf k-knopf--klein',
        'aria-label': `„${moment.text}“ als beobachtet markieren`,
        onclick: () => { speichere(aendereMarkierung(lade(), moment.id, +1)); render(); },
      }, '☑️ Beobachtet')));
}

function feldKarte(feld, markierungen, summen) {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `${feld.emoji} ${feld.name}`),
    el('p', { style: 'margin:0 0 0.25rem;font-size:0.85rem;color:#4b5563' }, feld.beschreibung),
    el('p', { style: 'margin:0 0 0.5rem;font-size:0.85rem' },
      summen[feld.id] > 0
        ? `Bisher ${beobachtungsWort(summen[feld.id])} in diesem Feld.`
        : 'Noch keine Beobachtung in diesem Feld - das ist völlig in Ordnung.'),
    ...feld.momente.map((m) => momentZeile(m, markierungen[m.id] ?? 0)));
}

function impulsKarte(markierungen) {
  const top = haeufigsteFelder(katalog.felder, markierungen, 2);
  const inhalt = top.length === 0
    ? [el('p', { style: 'font-size:0.9rem;margin-bottom:0' },
        'Noch keine Momente markiert. Sobald Sie im Alltag Beobachtungen sammeln, erscheinen hier passende Spielideen für zuhause.')]
    : top.map((feldId) => {
        const feld = katalog.felder.find((f) => f.id === feldId);
        return el('div', {},
          el('h3', { style: 'font-size:1rem;margin:0.9rem 0 0.25rem' }, `${feld.emoji} ${feld.name}`),
          el('ul', { style: 'margin:0;padding-left:1.2rem' },
            ...feld.impulse.map((impuls) => el('li', { style: 'font-size:0.9rem;margin:0.35rem 0' }, impuls))),
          el('button', {
            class: 'k-knopf k-knopf--neutral k-knopf--klein',
            style: 'margin-top:0.5rem',
            onclick: () => vorlesen(`Spielideen zum Feld ${feld.name}. ${feld.impulse.join(' ')}`),
          }, '🔊 Vorlesen'));
      });
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🎲 Spielideen für zuhause'),
    el('p', { style: 'font-size:0.9rem;margin:0' },
      'Zu den zwei Feldern, in denen Sie bisher am häufigsten etwas beobachtet haben - alle Ideen sind kostenlos, brauchen nur Alltagsmaterial und kommen ohne Bildschirm aus. Die Häufigkeit ist dabei keine Bewertung, sondern nur ein Wegweiser zu passenden Ideen.'),
    ...inhalt);
}

function kofferKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '📦 Beobachtungs-Koffer'),
    el('p', { style: 'font-size:0.9rem' },
      'Beobachtungen als Datei sichern - zum Beispiel, um die Markierungen beider Elternteile auf einem Gerät zusammenzuführen oder sie beim Gerätewechsel mitzunehmen. Beim Import werden die Anzahlen addiert. Es reist nur die Zählung, nie ein Name.'),
    kofferMeldung
      ? el('div', { class: `k-hinweis ${kofferMeldung.ok ? 'k-hinweis--richtig' : 'k-hinweis--falsch'}` },
          el('p', { style: 'margin:0' }, kofferMeldung.text))
      : '',
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: exportiere }, '📤 Als Datei exportieren'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: importiere }, '📥 Datei importieren')));
}

function datenKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '🧹 Ihre Daten'),
    el('p', { style: 'font-size:0.9rem' },
      'Gespeichert wird nur die Anzahl der Markierungen je Moment („st.markierungen“), ausschließlich auf diesem Gerät. Kein Konto, keine Cloud, keine Übertragung - und bitte nirgendwo Namen notieren, die feste Liste genügt.'),
    el('button', {
      class: 'k-knopf k-knopf--neutral k-knopf--klein',
      onclick: () => { localStorage.removeItem(SCHLUESSEL); kofferMeldung = null; render(); },
    }, '🧹 Alle Daten löschen'));
}

function exportiere() {
  const blob = new Blob([packeKoffer(lade())], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anker = el('a', { href: url, download: 'staerken-tagebuch-beobachtungen.json' });
  document.body.append(anker);
  anker.click();
  anker.remove();
  URL.revokeObjectURL(url);
}

function importiere() {
  const eingabe = el('input', { type: 'file', accept: '.json,application/json', style: 'display:none' });
  eingabe.addEventListener('change', async () => {
    const datei = eingabe.files?.[0];
    eingabe.remove();
    if (!datei) return;
    let inhalt;
    try {
      inhalt = JSON.parse(await datei.text());
    } catch {
      kofferMeldung = { ok: false, text: 'Die Datei ließ sich nicht lesen.' };
      return render();
    }
    const fehler = pruefeKoffer(inhalt, MOMENT_IDS);
    if (fehler.length > 0) {
      kofferMeldung = { ok: false, text: `Import nicht möglich: ${fehler[0]}.` };
      return render();
    }
    speichere(vereinigeKoffer(lade(), inhalt.markierungen));
    kofferMeldung = { ok: true, text: `${beobachtungsWort(gesamtZahl(inhalt.markierungen))} importiert und zusammengezählt.` };
    render();
  });
  document.body.append(eingabe);
  eingabe.click();
}

function render() {
  const markierungen = lade();
  const summen = zaehleJeFeld(katalog.felder, markierungen);
  const gesamt = gesamtZahl(markierungen);

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🌟 Stärken-Tagebuch'),
    el('p', { class: 'k-untertitel' }, 'Was macht Ihr Kind gern und oft? Ein Beobachtungsheft für Eltern (Kinder 3-7).'),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'margin:0;font-weight:600' },
          'Beobachtung ist keine Diagnose - bei Sorgen: Erziehungsberatung oder Frühförderstelle (beides kostenlos).')),
      el('p', { style: 'font-size:0.9rem' },
        'Diese Seite zählt nur, wie oft Sie einen Moment beobachtet haben. Es gibt keine Punkte, keine Rangliste, kein Begabungs-Urteil und keinen Vergleich mit anderen Kindern - jedes Kind hat sein eigenes Tempo.'),
      el('p', { style: 'font-size:0.9rem;margin-bottom:0' },
        `So geht es: Wenn Sie einen Moment im Alltag bemerken, tippen Sie auf „Beobachtet“. Bewusst ohne Freitext und ohne Namen - es entstehen keine persönlichen Daten über Ihr Kind.${gesamt > 0 ? ` Bisher insgesamt ${beobachtungsWort(gesamt)}.` : ''}`)),
    ...katalog.felder.map((feld) => feldKarte(feld, markierungen, summen)),
    impulsKarte(markierungen),
    kofferKarte(),
    datenKarte(),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Eltern · werbefrei · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, 'ℹ️ Konzept & Hintergrund'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

const katalogFehler = pruefeKatalog(katalog);
if (katalogFehler.length > 0) {
  app.replaceChildren(
    el('div', { class: 'k-hinweis k-hinweis--falsch' },
      el('p', { style: 'margin:0' }, `Datenfehler im Beobachtungs-Katalog: ${katalogFehler[0]}`)));
} else {
  render();
}
