// Selbstcheck pädagogisches Ich: anonyme Selbstreflexion für FACHKRÄFTE.
// Konzept aus Katalog Nr. 2 (docs/10, Praleska-Ableitung "Autodiagnostik
// des beruflichen Ich") - alle Aussagen und Texte sind Neuformulierungen.
// Muster: kriterien-check, aber mit 4-stufiger Selbsteinschätzung statt
// Checkbox. Grundprinzip "Nur für dich": kein Arbeitgeber-Zugriff, keine
// Übertragung, kein Punktestand, kein Ranking, kein Vergleich - der private
// Bericht formuliert je Bereich Stärken und genau einen Wachstumsimpuls.
// Politik docs/02: keine externen Anfragen; localStorage nur 'sp.status';
// Sicherung nur als private Datei (koffer.mjs).
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { zaehleBeantwortet, berichtText } from './logik.mjs';
import { packeKoffer, pruefeKoffer, vereinigeKoffer } from './koffer.mjs';

installiereNetzwerkWaechter();

const STATUS_SCHLUESSEL = 'sp.status';
const app = document.getElementById('app');
const daten = await fetch('daten/fragen.json').then((r) => r.json());

const alleAussagen = daten.bereiche.flatMap((b) => b.aussagen);
const aussageIds = alleAussagen.map((a) => a.id);
const stufenIds = daten.stufen.map((s) => s.id);

const ladeStatus = () => {
  const roh = JSON.parse(localStorage.getItem(STATUS_SCHLUESSEL) ?? 'null');
  return roh && typeof roh === 'object' && !Array.isArray(roh) ? roh : {};
};
const speichereStatus = (status) => localStorage.setItem(STATUS_SCHLUESSEL, JSON.stringify(status));

let meldung = null;

function aussageZeile(aussage, status) {
  return el('div', {
    role: 'group',
    'aria-label': aussage.text,
    style: 'padding:0.6rem 0;border-bottom:1px solid var(--k-rand)',
  },
    el('p', { style: 'margin:0 0 0.4rem' }, aussage.text),
    el('div', { style: 'display:flex;gap:0.4rem;flex-wrap:wrap' },
      ...daten.stufen.map((stufe) => {
        const gewaehlt = status[aussage.id] === stufe.id;
        return el('button', {
          class: `k-knopf k-knopf--klein ${gewaehlt ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(gewaehlt),
          onclick: () => {
            const s = ladeStatus();
            if (s[aussage.id] === stufe.id) delete s[aussage.id]; // erneuter Klick nimmt die Antwort zurück
            else s[aussage.id] = stufe.id;
            speichereStatus(s);
            render();
          },
        }, stufe.text);
      })));
}

function bereichKarte(bereich, status) {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `${bereich.emoji} ${bereich.name}`),
    el('p', { style: 'margin:0;font-size:0.85rem;color:#4b5563' }, bereich.fokus),
    ...bereich.aussagen.map((a) => aussageZeile(a, status)));
}

function kopfKarte(status) {
  const beantwortet = zaehleBeantwortet(daten, status);
  const gesamt = alleAussagen.length;
  return el('section', { class: 'k-karte' },
    el('p', { style: 'margin-top:0' },
      el('strong', {}, '🔒 Nur für dich: '),
      'Deine Antworten und dein Bericht bleiben auf diesem Gerät - kein Arbeitgeber-Zugriff, keine Übertragung, kein Konto. ',
      'Das ist Selbstreflexion, keine Diagnose: kein Punktestand, kein Vergleich, kein Richtig oder Falsch.'),
    el('p', { style: 'margin-bottom:0.4rem;font-size:0.9rem' },
      `Beantwortet: ${beantwortet} von ${gesamt} Aussagen - jede Antwort ist freiwillig, Lücken sind erlaubt.`),
    el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': gesamt, 'aria-valuenow': beantwortet, 'aria-label': 'Beantwortete Aussagen' },
      el('div', { style: `width:${Math.round((beantwortet / gesamt) * 100)}%` })),
    el('p', { style: 'margin-bottom:0;font-size:0.85rem;color:#4b5563' },
      'Antworte so ehrlich wie möglich - niemand liest mit. Ein erneuter Klick auf eine gewählte Antwort nimmt sie zurück.'));
}

function berichtKarte(status) {
  const berichtsFeld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:14rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': 'Privater Reflexionsbericht als Text',
  });
  berichtsFeld.value = berichtText(daten, status);
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🪞 Dein privater Bericht'),
    el('p', { style: 'font-size:0.9rem' },
      'Je Bereich: deine Stärken und genau ein Wachstumsimpuls. Der Text gehört dir - du entscheidest, ob du ihn irgendwo hin kopierst (z. B. in dein privates Notizbuch).'),
    berichtsFeld,
    el('div', { class: 'k-antworten' },
      el('button', {
        class: 'k-knopf k-knopf--klein',
        onclick: (ev) => {
          berichtsFeld.select();
          navigator.clipboard?.writeText(berichtsFeld.value);
          ev.target.textContent = '✔️ Kopiert!';
        },
      }, '📋 Bericht kopieren'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => exportiere(status) }, '📤 Privat sichern (Datei)'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: importiere }, '📥 Sicherung einlesen'),
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        onclick: () => {
          localStorage.removeItem(STATUS_SCHLUESSEL);
          meldung = { ok: true, text: 'Alle Daten wurden gelöscht.' };
          render();
        },
      }, '🧹 Alle Daten löschen')),
    el('p', { style: 'margin-bottom:0;font-size:0.85rem;color:#4b5563' },
      'Die Sicherungs-Datei ist dein persönliches Backup (z. B. für einen Gerätewechsel) - sie ist nicht für Arbeitgeber, Leitung oder Team gedacht.'));
}

function exportiere(status) {
  const blob = new Blob([packeKoffer(status)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anker = el('a', { href: url, download: 'selbstcheck-privat.json' });
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
      meldung = { ok: false, text: 'Die Datei ließ sich nicht lesen.' };
      return render();
    }
    const fehler = pruefeKoffer(inhalt, { aussageIds, stufenIds });
    if (fehler.length > 0) {
      meldung = { ok: false, text: `Einlesen nicht möglich: ${fehler[0]}.` };
      return render();
    }
    const vorher = ladeStatus();
    const vereinigt = vereinigeKoffer(vorher, inhalt.status);
    speichereStatus(vereinigt);
    const neu = Object.keys(vereinigt).length - Object.keys(vorher).length;
    meldung = { ok: true, text: `Sicherung eingelesen - ${neu} Antwort${neu === 1 ? '' : 'en'} ergänzt, nichts überschrieben.` };
    render();
  });
  document.body.append(eingabe);
  eingabe.click();
}

function render() {
  const status = ladeStatus();
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🪞 Selbstcheck pädagogisches Ich'),
    el('p', { class: 'k-untertitel' }, 'Anonyme Selbstreflexion für pädagogische Fachkräfte - nur für dich'),
    meldung
      ? el('div', { class: `k-hinweis ${meldung.ok ? 'k-hinweis--richtig' : 'k-hinweis--falsch'}`, role: 'status' },
          el('p', { style: 'margin:0' }, meldung.text))
      : '',
    kopfKarte(status),
    ...daten.bereiche.map((b) => bereichKarte(b, status)),
    berichtKarte(status),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Fachkräfte · werbefrei · nur für dich - Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '🏛️ Info für Träger & Leitung'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  meldung = null;
}

render();
