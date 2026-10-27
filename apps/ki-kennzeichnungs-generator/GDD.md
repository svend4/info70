# Kurz-GDD: KI-Kennzeichnungs-Generator 🏷️

**Einheit aus Katalog:** docs/09 №172 — «KI-Kennzeichnungs-Generator».
**Engine:** Formular-zu-Text-Generator (kinder-ui + mini-i18n). Zielgruppe:
Betreiber.

## 1. Kernaussage

Typ + Alter + Sprache wählen → fertiger, kindgerechter KI-Hinweis und ein
einbindbares HTML/CSS-Badge zum Kopieren. Setzt die Transparenzpflicht aus
Art. 50 AI Act praktisch um: „Hier antwortet eine Maschine“, „Dieses Bild
hat eine KI gemacht“.

## 2. Zielgruppe

Betreiber, Redaktionen, Schulen. Direkter Nachbar: KI-Transparenz-Check
(№68, prüft die Pflichten – dieser Generator liefert die Kennzeichnung).
Kinder-Pendants: bot-oder-buddy, deepfake-spuernase.

## 3. Ablauf

1) Typ wählen (Chatbot/Bild/Text/Medien) – mit Art.-50-Hinweis.
2) Altersstufe wählen (6-8/8-12/13-15) – Text wird einfacher für Jüngere.
3) Sprache wählen (de/uk/ru).
4) Vorschau ansehen; Text und/oder HTML-Badge kopieren oder als `.html`
speichern.

## 4. Didaktik / Nutzen

Nimmt Betreibern die schwierigste Stelle ab: die richtige, altersgerechte
Formulierung in mehreren Sprachen. Das Badge ist selbsttragend (Inline-
Styles), sodass es ohne fremde CSS/JS überall einzubinden ist – passend zur
Null-externe-Requests-Politik des Baukastens.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), Auswahl nur in localStorage
(kkg.wahl), werbefrei. Das erzeugte Snippet enthält kein Script, keine
externen Links und keine src/href-Ressourcen (Test). Sprache ist kein
personenbezogenes Datum.

## 6. Tests

`test/logik.test.mjs`: Typen/Stufen vollständig (6-8/8-12/13-15) mit
Art.-50-Hinweis, i18n-Vollständigkeit (de/uk/ru je genau 12 Texte),
jede Kombination liefert Text, kindgerechte Abstufung (klein < groß),
Badge trägt Text/Emoji/Sprach-Attribut und ist frei von Script/externen
Bezügen, escapeHtml neutralisiert Sonderzeichen.

## 7. Erweiterungen (Katalog)

Barrierefreiheitserklärungs-Generator (№169), Eltern-Kompass-Generator
(№163) auf derselben Engine; weitere Sprachen; Badge-Varianten (dezent/
auffällig).

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
