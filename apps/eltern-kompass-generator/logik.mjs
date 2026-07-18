// Eltern-Kompass-Generator: reine Logik (ohne DOM), testbar (docs/09 Nr. 163).
// Formular-zu-Dokument-Engine (geteilt mit Impressum-/Datenschutz-/
// Barrierefreiheits-Generator). Aus strukturierten Angaben entsteht eine
// fertige Eltern-Kompass-Seite (Sektionen + komplettes HTML-Dokument) im
// Stil der info70-„Für Eltern“-Seiten. Alles lokal, kein Request.

export function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const P = (wert, platzhalter) => (wert && String(wert).trim() ? String(wert).trim() : platzhalter);
const liste = (arr) => (arr ?? []).map((s) => String(s).trim()).filter(Boolean);

/** Inhalts-Sektionen (für die Live-Vorschau und zum Einbetten). */
export function baueSektionen(cfg = {}) {
  const name = escapeHtml(P(cfg.appName, '[Name des Angebots]'));
  const alter = escapeHtml(P(cfg.altersgruppe, '[Altersgruppe]'));
  const worum = escapeHtml(P(cfg.worum, '[Kurz erklärt: worum geht es in diesem Angebot?]'));
  const lernziele = liste(cfg.lernziele);
  const daten = liste(cfg.daten);
  const interaktion = escapeHtml(P(cfg.interaktion, 'Keine Interaktion mit Fremden.'));
  const kostenfrei = cfg.kostenfrei !== false;
  const hinweise = escapeHtml(P(cfg.hinweise, ''));

  const lernzieleHtml = lernziele.length
    ? `<ul>${lernziele.map((z) => `<li>${escapeHtml(z)}</li>`).join('')}</ul>`
    : '<p>[Lernziele ergänzen]</p>';
  const datenHtml = daten.length
    ? `<ul>${daten.map((d) => `<li>${escapeHtml(d)}</li>`).join('')}</ul>`
    : '<p>Es werden keine personenbezogenen Daten erhoben.</p>';

  const teile = [
    `<h1 class="k-titel">👪 Eltern-Kompass: ${name}</h1>`,
    '<section class="k-karte">',
    `<h2>Worum geht es? (${alter})</h2>`,
    `<p>${worum}</p>`,
    '</section>',
    '<section class="k-karte">',
    '<h2>Was Ihr Kind lernt</h2>',
    lernzieleHtml,
    '</section>',
    '<section class="k-karte">',
    '<h2>Welche Daten (nicht) anfallen</h2>',
    datenHtml,
    `<p><strong>Interaktion:</strong> ${interaktion}</p>`,
    '</section>',
    '<section class="k-karte">',
    '<h2>Gut zu wissen</h2>',
    '<ul>',
    `<li>Werbefrei, ohne Konten, keine Anfragen an fremde Server.</li>`,
    `<li>${kostenfrei ? 'Kostenfrei nutzbar.' : 'Zur Nutzung siehe Angaben des Anbieters.'}</li>`,
    '<li>Bei Sorgen hilft die Nummer gegen Kummer: 116 111 (kostenlos, anonym).</li>',
    '</ul>',
    hinweise ? `<p>${hinweise}</p>` : '',
    '</section>',
  ];
  return teile.filter(Boolean).join('\n');
}

/** Vollständiges, eigenständiges HTML-Dokument (zum Speichern als eltern.html). */
export function baueSeite(cfg = {}) {
  const name = escapeHtml(P(cfg.appName, '[Name des Angebots]'));
  const inhalt = baueSektionen(cfg);
  return [
    '<!DOCTYPE html>',
    '<html lang="de">',
    '<head>',
    '  <meta charset="utf-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1" />',
    "  <meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'self'; style-src 'self' 'unsafe-inline'\" />",
    `  <title>Für Eltern – ${name}</title>`,
    '  <link rel="stylesheet" href="../../packages/kinder-ui/css/kinder.css" />',
    '</head>',
    '<body>',
    '  <main class="k-app">',
    inhalt.split('\n').map((z) => '    ' + z).join('\n'),
    '    <footer class="k-fuss"><a href="./">Zur App</a> · <a href="../../impressum.html">Impressum &amp; Datenschutz</a></footer>',
    '  </main>',
    '</body>',
    '</html>',
    '',
  ].join('\n');
}
