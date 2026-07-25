# Kurz-GDD: Meine fünf Helfer 🖐️

**Einheit aus Katalog:** docs/10 (Praleska) Ko-Nutzung Nr. 4 — «Meine
fuenf Helfer – Koerper-Entdecker». **Engine:** eigenes Ko-Nutzungs-Muster
mit `kinder-ui`. Zielgruppe: 3–5 **ausschließlich gemeinsam mit einem
Erwachsenen**, für 5–7 als Wiederholung.

## 1. Kernaussage

Fünf Helfer hat jeder Mensch immer dabei: Augen, Nase, Ohren, Zunge,
Haut. Jeder kann etwas, jeder braucht Pflege — und wenn einer anders
arbeitet, gibt es Hilfen. Das gehört in derselben Selbstverständlichkeit
dazu wie die Sinne selbst.

## 2. Aufbau

- **Entdecken:** fünf Karten mit je drei Teilen — was der Helfer kann,
  wie er gesund bleibt, was man zusammen ausprobieren kann.
- **Fragen:** zwölf Zuordnungen, höchstens `PRO_SESSION = 5` je Sitzung.
  Zur Wahl stehen **immer alle fünf Helfer**; eine Vorauswahl wäre schon
  die halbe Antwort. Ein Test prüft das für jede Aufgabe.
- **Hilfen:** eigener Bereich zu Brille, Hörgerät, Gebärdensprache und
  Langstock.

Ein Test verlangt, dass **jeder Helfer mindestens zweimal** als Lösung
vorkommt — sonst bliebe einer ungeübt.

## 3. Der Inklusionsteil und seine drei Regeln

Alle drei sind im Validator bzw. per Test abgesichert:

| Regel | Warum | Absicherung |
| --- | --- | --- |
| kein Hilfsmittel als Mangel | eine Brille steht neben festen Schuhen, nicht neben Krankheit | `pruefeDaten` lehnt *kaputt/krank/arm/behindert/leidet* im Hilfen-Text ab |
| Gebärdensprache ist eine **richtige Sprache** | mit eigenen Wörtern und eigener Grammatik, kein Behelf | Test prüft die Formulierung |
| „nicht anstarren, sondern fragen“ — **und Nein sagen dürfen** | ohne den zweiten Teil wird aus Neugier ein Anspruch | Validator verlangt beide Hälften in `hilfenRegel` |

**Bewusst nicht enthalten:** einzelne Gebärden. Gebärdensprache lässt sich
nicht aus Standbildern lernen, und Halbrichtiges wäre schlechter als
nichts — dieselbe Zurückhaltung wie bei den DGS-Videos im deutschen
Korpus.

## 4. Gesundheit ohne Angst

Die Pflegehinweise bleiben auf dem Niveau allgemein bekannter
Alltagsempfehlungen: Hände waschen vor dem Essen, zweimal täglich Zähne
putzen, nichts in Ohr oder Nase stecken (auch keine Wattestäbchen), nie in
die Sonne schauen, in der Sonne Hut und Creme. Ein Test verbietet
Angstwörter wie *blind wirst* oder *taub wirst* und alles Tadelnde.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, ohne Konten, keine
Namen, **kein localStorage**. Erwachsenen-Gate, harte Sitzungsgrenze,
Schluss mit drei Ideen ohne Bildschirm. Vorlesefunktion auf jedem
Bildschirm (BFSG). eltern.html, im Sammelband.

## 6. Tests

`test/logik.test.mjs` (9): Daten gültig; genau fünf Sinne mit Können,
Pflege und Mitmach-Idee; jeder Helfer ≥2-mal Lösung (Mutation geprüft);
Sitzungsgrenze ≤6 ohne Dubletten mit Rotation; die Auswahl verrät nichts
(immer alle fünf); Hilfsmittel nie als Mangel und alle vier vorhanden,
Gebärdensprache als richtige Sprache; die Regel „fragen statt anstarren“
samt „Nein sagen“ steht in den Daten und der Validator erzwingt sie;
Hygiene und Sicherheit ohne Angstwörter; jede Aufgabe endet mit einer
Frage an die Erwachsenen, die Sitzung endet offline.

## 7. Erweiterungen (Katalog)

Tast-Memory zum Ausdrucken, Geräusche-Modus als Brücke zu
`klang-detektive`, Weiterführung zu `koerper-entdecker` (5–12, was drinnen
steckt), Riech-Karten für die Kita.
