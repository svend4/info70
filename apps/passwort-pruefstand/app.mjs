// Passwort-Prüfstand: Knack-Simulator + Drei-Wörter-Werkstatt (8-12 Jahre).
// Station 1 (Prüfstand): Ein QUATSCH-Passwort wird lokal bewertet -
// anschauliche Knackzeit (Schildkröte … Universum) + Ampel.
// Station 2 (Werkstatt): Farbe + Tier + Zahl + Ding = starker, merkbarer Passsatz.
// Politik: keine externen Anfragen; diese App speichert GAR NICHTS -
// jede Eingabe lebt nur im Arbeitsspeicher und ist beim Schließen weg.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { entropieBits, knackzeitText, kombiniere, VERSUCHE_PRO_SEKUNDE } from './logik.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/woerter.json').then((r) => r.json());
const app = document.getElementById('app');

const MILLIARDEN = VERSUCHE_PRO_SEKUNDE / 1_000_000_000;
const STUFEN_WORT = { rot: 'Schwach!', gelb: 'Geht so …', gruen: 'Stark!' };
const STUFEN_KLASSE = { rot: 'k-hinweis--falsch', gelb: '', gruen: 'k-hinweis--richtig' };
const FELD_STIL = 'width:100%;min-height:3rem;font:inherit;font-size:1.05rem;padding:0.5rem 0.8rem;border:2px solid var(--k-blau);border-radius:0.6rem;background:#fff;color:var(--k-tinte)';

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🔐 Passwort-Prüfstand'),
    el('p', { class: 'k-untertitel' }, 'Wie schnell fällt ein Passwort? Teste es – und bau eins, das ewig hält.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

// Die eine große Regel - steht auf jedem Bildschirm mit Eingabe.
function warnHinweis() {
  return el('div', { class: 'k-hinweis k-hinweis--falsch', role: 'alert' },
    el('p', { style: 'margin:0;font-weight:800' }, '🚨 Tippe hier NIE dein echtes Passwort ein!'),
    el('p', { style: 'margin:0.3rem 0 0' }, 'Nimm ein Quatsch-Passwort zum Testen. Diese App sendet nichts und speichert nichts – aber die Regel gilt überall: Dein echtes Passwort tippst du nur beim echten Anmelden ein.'));
}

function tipps(wert, stufe, inWerkstatt) {
  if (stufe === 'gruen') {
    return [inWerkstatt
      ? 'Mal dir das Bild im Kopf aus – dann kannst du diesen starken Satz nie vergessen.'
      : 'Stark! Und merken? Drei Wörter + Zahl als Bild im Kopf – genau das übt die Werkstatt.'];
  }
  const liste = [];
  if (/^[0-9]+$/.test(wert)) liste.push('Nur Zahlen? Solche Passwörter raten Knack-Programme zuallererst.');
  if (wert.length < 12) liste.push('Mach es LÄNGER! Jedes Zeichen mehr macht das Raten viele Male schwerer – Länge schlägt alles.');
  if (!/[A-Z]/.test(wert)) liste.push('Mische große Buchstaben hinein.');
  else if (!/[0-9]/.test(wert)) liste.push('Eine Zahl mittendrin macht es zusätzlich stärker.');
  return liste.slice(0, 2);
}

// Ampel + anschauliche Knackzeit für eine Eingabe (alles lokal gerechnet).
function bewertungsKarte(wert, inWerkstatt = false) {
  if (!wert) {
    return el('div', { class: 'k-hinweis' },
      el('p', { style: 'margin:0' }, '⬆️ Tippe oben ein Quatsch-Passwort – die Ampel zeigt sofort, wie stark es ist.'));
  }
  const bits = entropieBits(wert);
  const urteil = knackzeitText(bits);
  const karte = el('div', { class: `k-hinweis ${STUFEN_KLASSE[urteil.stufe]}`, style: 'margin-top:0.75rem' },
    el('p', { style: 'margin:0;font-size:1.3rem;font-weight:800;text-align:center' }, `${urteil.ampel} ${STUFEN_WORT[urteil.stufe]}`),
    el('p', { style: 'margin:0.4rem 0 0;font-weight:600' }, `⏱️ Knackzeit: ${urteil.text}`),
    el('p', { style: 'margin:0.4rem 0 0;font-size:0.85rem' }, `🔎 ${wert.length} Zeichen · Stärke ≈ ${Math.round(bits)} Bits · unser Knack-Computer schafft ${MILLIARDEN} Milliarden Versuche pro Sekunde`));
  for (const tipp of tipps(wert, urteil.stufe, inWerkstatt)) {
    karte.append(el('p', { style: 'margin:0.4rem 0 0' }, `💡 ${tipp}`));
  }
  return karte;
}

function startBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Wie lange braucht ein Knack-Computer für „1234“? Und wie lange für einen Drei-Wörter-Satz? Am Prüfstand findest du es heraus – und in der Werkstatt baust du ein Passwort, das länger hält, als das Universum alt ist.'),
      warnHinweis(),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: pruefstandBildschirm }, '🔬 Zum Prüfstand: Wie stark ist ein Passwort?'),
        el('button', { class: 'k-knopf', onclick: werkstattBildschirm }, '🛠️ Zur Werkstatt: Bau einen starken Passsatz'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Willkommen am Passwort-Prüfstand! Ganz wichtig: Tippe hier nie dein echtes Passwort ein, nimm ein Quatsch-Passwort. Diese App sendet nichts und speichert nichts. Am Prüfstand siehst du, wie schnell ein Computer ein Passwort knackt. In der Werkstatt baust du aus drei Wörtern und einer Zahl einen starken Passsatz.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '💡 Gut zu wissen: Alles wird nur auf deinem Gerät ausgerechnet. Diese App speichert nichts – beim Schließen ist jede Eingabe weg.')),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: startBildschirm })))));
}

function pruefstandBildschirm() {
  const ergebnis = el('div', {}, bewertungsKarte(''));
  // Sichtbarer Hinweis direkt am Feld: das Feld ist nur für ein erfundenes Beispiel.
  const feldHinweis = el('p', {
    id: 'test-eingabe-hinweis',
    class: 'k-hinweis k-hinweis--falsch',
    style: 'margin:0.4rem 0 0.5rem;font-weight:800',
  }, 'Kein echtes Passwort eingeben, nur ein erfundenes Beispiel.');
  const eingabe = el('input', {
    id: 'test-eingabe',
    type: 'text',
    autocomplete: 'off',
    autocapitalize: 'off',
    spellcheck: 'false',
    maxlength: '40',
    placeholder: 'Quatsch-Passwort zum Testen …',
    'aria-label': 'Test-Passwort eingeben – niemals dein echtes',
    'aria-describedby': 'test-eingabe-hinweis',
    style: FELD_STIL,
    oninput: () => ergebnis.replaceChildren(bewertungsKarte(eingabe.value)),
  });
  const probier = (wert) => el('button', {
    class: 'k-knopf k-knopf--neutral k-knopf--klein',
    onclick: () => {
      eingabe.value = wert;
      ergebnis.replaceChildren(bewertungsKarte(wert));
    },
  }, `Probier: ${wert}`);
  zeige(
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;text-align:center' }, '🔬 Der Prüfstand'),
      warnHinweis(),
      el('label', { for: 'test-eingabe', style: 'display:block;font-weight:700;margin:0.75rem 0 0.3rem' }, 'Dein TEST-Passwort:'),
      feldHinweis,
      eingabe,
      ergebnis,
      el('div', { style: 'display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.75rem' },
        probier('1234'), probier('Schatz123'), probier('LilaIgel7Roller')),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: werkstattBildschirm }, '🛠️ Zur Drei-Wörter-Werkstatt'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'),
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein',
          onclick: () => {
            const wert = eingabe.value;
            const stand = wert
              ? `Deine Eingabe hat ${wert.length} Zeichen. Knackzeit: ${knackzeitText(entropieBits(wert)).text}`
              : 'Tippe ein Quatsch-Passwort ein, dann zeigt die Ampel sofort, wie stark es ist.';
            vorlesen(`Tippe hier nie dein echtes Passwort ein. ${stand}`);
          },
        }, '🔊 Vorlesen'))));
}

function werkstattBildschirm() {
  const ergebnis = el('div', {});
  const felder = daten.listen.map((liste) => el('select', {
    'aria-label': `${liste.titel} wählen`,
    style: FELD_STIL,
    onchange: aktualisiere,
  }, ...liste.woerter.map((wort) => el('option', { value: wort }, wort))));
  const zahlFeld = el('input', {
    type: 'number', min: '0', max: '99', value: '42',
    'aria-label': 'Zahl von 0 bis 99',
    style: FELD_STIL,
    oninput: aktualisiere,
  });

  function aktuelleTeile() {
    const [farbe, tier, ding] = felder.map((feld) => feld.value);
    const zahl = String(zahlFeld.value).replace(/\D/g, '').slice(0, 2);
    return { farbe, tier, ding, zahl };
  }

  function aktualisiere() {
    const { farbe, tier, ding, zahl } = aktuelleTeile();
    const satz = kombiniere([farbe, tier, zahl, ding]);
    ergebnis.replaceChildren(
      el('p', { style: 'margin:0.75rem 0 0;text-align:center;font-size:1.3rem;font-weight:800;word-break:break-all' }, `🔑 ${satz}`),
      bewertungsKarte(satz, true),
      el('p', { style: 'margin:0.5rem 0 0' }, `🧠 Merk-Bild: ${farbe.toLowerCase()} ${tier}, die Zahl ${zahl || '…'} und dazu: ${ding}. Einmal im Kopf ausgemalt – nie mehr vergessen!`));
  }

  function wuerfeln() {
    daten.listen.forEach((liste, i) => {
      felder[i].value = liste.woerter[Math.floor(Math.random() * liste.woerter.length)];
    });
    zahlFeld.value = String(Math.floor(Math.random() * 90) + 10);
    aktualisiere();
  }

  wuerfeln();
  zeige(
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;text-align:center' }, '🛠️ Die Drei-Wörter-Werkstatt'),
      el('p', { style: 'margin:0 0 0.75rem' }, 'Wähle je ein Wort und eine Zahl – zusammen ergeben sie einen Passsatz, der leicht zu merken und irre schwer zu knacken ist.'),
      el('div', { style: 'display:grid;gap:0.6rem' },
        ...daten.listen.map((liste, i) => el('label', { style: 'display:block;font-weight:700' },
          `${liste.emoji} ${liste.titel}:`, felder[i])),
        el('label', { style: 'display:block;font-weight:700' }, '🔢 Zahl (0–99):', zahlFeld)),
      ergebnis,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: wuerfeln }, '🎲 Neu würfeln'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: pruefstandBildschirm }, '🔬 Zurück zum Prüfstand'),
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein',
          onclick: () => {
            const { farbe, tier, ding, zahl } = aktuelleTeile();
            const satz = kombiniere([farbe, tier, zahl, ding]);
            vorlesen(`Dein Passsatz: ${satz}. Knackzeit: ${knackzeitText(entropieBits(satz)).text} Merk dir das Bild: ${farbe.toLowerCase()} ${tier}, die Zahl ${zahl}, und dazu: ${ding}.`);
          },
        }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0' }, '🤔 Warum schlägt LANG das Komplizierte?'),
      el('p', {}, '🤯 „X$3!“ sieht schwierig aus – hat aber nur 4 Zeichen. Der Knack-Computer probiert einfach ALLES durch und ist in Sekunden fertig.'),
      el('p', {}, '📏 Dein Drei-Wörter-Satz hat 15 und mehr Zeichen. Jedes Zeichen mehr macht das Durchprobieren zig-mal schwerer – die Knackzeit explodiert bis über das Alter des Universums.'),
      el('p', {}, '🧠 Und das Beste: Drei Wörter als Bild kannst du dir merken – Krickel-Zeichen nicht.'),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'margin:0;font-weight:700' }, 'Deine starken Regeln:'),
        el('p', { style: 'margin:0.3rem 0 0' }, '🤫 Verrate dein Passwort niemandem – außer deinen Eltern.'),
        el('p', { style: 'margin:0.3rem 0 0' }, '1️⃣ Für jedes Konto ein eigenes Passwort – sonst öffnet ein geknacktes alle Türen.'),
        el('p', { style: 'margin:0.3rem 0 0' }, '🚨 Echte Passwörter tippst du NUR beim echten Anmelden ein – nie in Chats, nie in Test-Seiten, auch nicht hier. Bau dir dein echtes Passwort im Kopf: neue Wörter, neue Zahl!')),
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        style: 'margin-top:0.75rem',
        onclick: () => vorlesen('Warum schlägt lang das Komplizierte? Ein kurzes Zeichen-Gewirr ist in Sekunden durchprobiert. Ein Drei-Wörter-Satz mit 15 und mehr Zeichen hält länger, als das Universum alt ist. Und merken kannst du ihn als Bild im Kopf. Deine Regeln: Verrate dein Passwort niemandem außer deinen Eltern. Für jedes Konto ein eigenes Passwort. Und dein echtes Passwort tippst du nur beim echten Anmelden ein. Bau es dir im Kopf: neue Wörter, neue Zahl.'),
      }, '🔊 Vorlesen')));
}

startBildschirm();
