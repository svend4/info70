// Einwilligungs-Prüfpfad Art. 8 DSGVO (für Betreiber, docs/09 Ось D Nr. 219).
// Geführter Frage-Pfad; jede Frage hat konkrete Antwort-Optionen, manche
// erzeugen eine Lücke. Am Ende: Prüfbericht mit Lücken-Liste als Datei.
// Politik docs/02: keine externen Anfragen; alles lokal, nur localStorage.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { pruefbericht, zaehle, antwortVon } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'einwilligung.antworten';
const app = document.getElementById('app');
const daten = await fetch('daten/pfad.json').then((r) => r.json());

const lade = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}');
const speichere = (a) => localStorage.setItem(SCHLUESSEL, JSON.stringify(a));

function berichtHerunterladen(text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = el('a', { href: url, download: 'einwilligungs-pruefpfad-bericht.txt' });
  a.click();
  URL.revokeObjectURL(url);
}

function render() {
  const antworten = lade();
  const z = zaehle(daten, antworten);

  const schrittKarten = daten.schritte.map((s) => {
    const gewaehlt = antworten[s.id];
    const aktuelleAntwort = gewaehlt != null ? antwortVon(s, gewaehlt) : null;
    const istLuecke = aktuelleAntwort?.luecke;

    const optionen = el('div', { class: 'k-antworten', role: 'radiogroup', 'aria-label': s.frage, style: 'margin:0.4rem 0 0' },
      ...s.antworten.map((a) => el('button', {
        class: `k-knopf k-knopf--klein${a.wert === gewaehlt ? '' : ' k-knopf--neutral'}`,
        role: 'radio', 'aria-checked': String(a.wert === gewaehlt),
        onclick: () => { const cur = lade(); cur[s.id] = a.wert; speichere(cur); render(); },
      }, a.text)));

    const rueckmeldung = aktuelleAntwort
      ? el('p', {
          style: `margin:0.4rem 0 0;font-size:0.85rem;padding:0.4rem 0.6rem;border-radius:0.5rem;background:${istLuecke ? '#fef3c7' : '#dcfce7'};color:#374151`,
        }, `${istLuecke ? '⚠️ ' : '✔️ '}${aktuelleAntwort.hinweis ?? (istLuecke ? 'Bitte prüfen.' : 'In Ordnung.')}`)
      : null;

    return el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, s.titel),
      el('p', { style: 'margin:0.2rem 0;font-weight:600' }, s.frage),
      el('small', { style: 'color:#4b5563' }, s.bezug),
      el('details', { style: 'margin:0.25rem 0' },
        el('summary', { style: 'cursor:pointer;font-size:0.85rem;color:var(--k-blau-dunkel)' }, '💡 Worum geht es rechtlich?'),
        el('p', { style: 'font-size:0.85rem;margin:0.3rem 0 0;color:#374151' }, s.hilfe)),
      optionen,
      rueckmeldung);
  });

  const berichtsFeld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:12rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': 'Prüfbericht',
  });
  berichtsFeld.value = pruefbericht(daten, antworten);

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧭 Einwilligungs-Prüfpfad Art. 8'),
    el('p', { class: 'k-untertitel' }, 'DSGVO-Einwilligung bei Kinderangeboten Schritt für Schritt prüfen (für Betreiber)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `Beantwortet: ${z.beantwortet}/${z.gesamt}   ⚠️ Lücken: ${z.luecken}   ◻️ offen: ${z.offen}`),
      el('p', { style: 'font-size:0.9rem;margin-bottom:0' }, daten.hinweis)),
    ...schrittKarten,
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, 'Prüfbericht (Lücken zuerst umsetzen)'),
      berichtsFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => berichtHerunterladen(berichtsFeld.value) }, '💾 Als Datei speichern'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { berichtsFeld.select(); navigator.clipboard?.writeText(berichtsFeld.value); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 Kopieren'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); render(); } }, '🧹 Zurücksetzen'))),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · kein Rechtsrat · Daten bleiben auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
