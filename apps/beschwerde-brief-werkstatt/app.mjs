// Beschwerde-Brief-Werkstatt (Kinder 8-12 mit Lehrkraft, docs/09 Nr. 144).
// Anliegen strukturiert eingeben → fertiger Brief/Petition an Schulleitung,
// Klassenrat, Petitionsausschuss oder Kinderkommission. Lernziel: Aufbau, Ton
// und Adressat einer wirksamen Eingabe (Art. 12/13 UN-KRK). Vorlesen.
// Datensparsamkeit: der Absender-NAME lebt nur im Speicher der Seite und wird
// NICHT gespeichert – nur der Entwurf-Text (ohne Name) bleibt lokal.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { ADRESSATEN, findeAdressat, fehlendeFelder, baueBrief } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'bbw.entwurf';
const app = document.getElementById('app');

let absender = ''; // nur im Speicher der Seite, NICHT in localStorage (Datensparsamkeit)

const lade = () => ({ adressat: 'schulleitung', betreff: '', anliegen: '', begruendung: '', vorschlag: '', ...JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}') });
const speichere = (c) => localStorage.setItem(SCHLUESSEL, JSON.stringify(c));
const briefText = () => baueBrief({ ...lade(), absender });

const herunterladen = (inhalt, name) => { const url = URL.createObjectURL(new Blob([inhalt], { type: 'text/plain;charset=utf-8' })); const a = el('a', { href: url, download: name }); a.click(); URL.revokeObjectURL(url); };

function aktualisiereBrief() {
  const z = app.querySelector('#bbw-brief');
  if (z) z.value = briefText();
  const fehlt = fehlendeFelder(lade());
  const h = app.querySelector('#bbw-fehlt');
  if (h) h.textContent = fehlt.length ? `Noch offen: ${fehlt.join(', ')}` : '✔️ Alle Teile ausgefüllt – bereit zum Ausdrucken.';
}

function textfeld(label, key, cfg, platz) {
  const feld = el('textarea', { value: cfg[key], style: 'width:100%;min-height:3.5rem;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem;font-size:0.95rem', 'aria-label': label, placeholder: platz });
  feld.value = cfg[key];
  feld.addEventListener('input', () => { const c = lade(); c[key] = feld.value; speichere(c); aktualisiereBrief(); });
  return el('label', { style: 'display:block;margin:0.5rem 0' }, el('span', { style: 'display:block;font-weight:600;font-size:0.9rem;margin-bottom:0.2rem' }, label), feld);
}

function render() {
  const cfg = lade();
  const adressat = findeAdressat(cfg.adressat);

  const nameFeld = el('input', { type: 'text', value: absender, maxlength: 40, style: 'width:100%;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem', 'aria-label': 'Absender (Name/Klasse, nur für den Brief)', placeholder: 'z. B. Klasse 4b' });
  nameFeld.addEventListener('input', () => { absender = nameFeld.value; aktualisiereBrief(); });

  const briefFeld = el('textarea', { id: 'bbw-brief', readonly: true, style: 'width:100%;min-height:15rem;font-family:monospace;font-size:0.82rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem', 'aria-label': 'Fertiger Brief' });
  briefFeld.value = briefText();

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '✉️ Beschwerde-Brief-Werkstatt'),
    el('p', { class: 'k-untertitel' }, 'Schreib einen echten Brief oder eine Petition – und werde gehört!'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Als Kind darfst du deine Meinung sagen und gehört werden (Art. 12/13 der UN-Kinderrechtskonvention) – auch gegenüber Schule und Staat. Hier baust du Schritt für Schritt eine wirksame Eingabe.'),
      el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => vorlesen('Als Kind darfst du deine Meinung sagen und gehört werden. Auch gegenüber Schule und Staat. Hier baust du Schritt für Schritt einen Brief.') }, '🔊 Vorlesen')),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '1) An wen geht der Brief?'),
      el('div', { class: 'k-antworten' }, ...ADRESSATEN.map((a) => el('button', {
        class: `k-knopf k-knopf--klein${a.id === cfg.adressat ? '' : ' k-knopf--neutral'}`, 'aria-pressed': String(a.id === cfg.adressat),
        onclick: () => { const c = lade(); c.adressat = a.id; speichere(c); render(); },
      }, a.name))),
      el('p', { style: 'font-size:0.9rem;color:#4b5563;margin-bottom:0' }, adressat.hinweis)),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '2) Das ist dein Anliegen'),
      textfeld('Betreff (worum geht es kurz?)', 'betreff', cfg, 'z. B. Mehr Pausenspiele'),
      textfeld('Anliegen: „wir wenden uns an Sie, weil …“', 'anliegen', cfg, 'wir uns mehr Spielgeräte wünschen.'),
      textfeld('Begründung: „Das ist wichtig, weil …“', 'begruendung', cfg, 'in der Pause oft Langeweile herrscht.'),
      textfeld('Vorschlag: „Unser Vorschlag: …“', 'vorschlag', cfg, 'ein Ausleih-System für Bälle.'),
      el('label', { style: 'display:block;margin:0.5rem 0' },
        el('span', { style: 'display:block;font-weight:600;font-size:0.9rem;margin-bottom:0.2rem' }, 'Absender (Name/Klasse – nur für den Brief, wird nicht gespeichert)'),
        nameFeld),
      el('p', { id: 'bbw-fehlt', style: 'font-size:0.9rem;color:var(--k-blau-dunkel);margin-bottom:0' }, '')),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📄 Dein Brief'),
      briefFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => herunterladen(briefFeld.value, 'beschwerde-brief.txt') }, '💾 Speichern'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { briefFeld.select(); navigator.clipboard?.writeText(briefFeld.value); ev.target.textContent = '✔️'; } }, '📋 Kopieren'),
        el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => vorlesen(briefFeld.value) }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { absender = ''; localStorage.removeItem(SCHLUESSEL); render(); } }, '🧹 Neu'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0' }, 'Tipp: höflich bleiben, ein konkreter Vorschlag wirkt am besten. Petitionen an den Bundestag sind ohne Mindestalter möglich (Art. 17 GG).')),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'für Schule & Zuhause · werbefrei · läuft offline · Name wird nicht gespeichert · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  aktualisiereBrief();
}

render();
