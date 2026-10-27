# Kurz-GDD: Ombuds-Landkarte 🧭

**Einheit aus Katalog:** docs/09 №38 — «Ombuds-Landkarte». **Engine:**
katalog (foerder-navigator-Muster), Zielgruppe Erwachsene.

## 1. Kernaussage

Eltern lernen, welche Stelle für welches Problem zuständig ist und wie man
sie erreicht – von der Ombudsstelle Jugendhilfe bis zum DSA-Koordinator.

## 2. Zielgruppe

Eltern. Nachbarn: beschwerde-lotse (Kinder-Version), foerder-navigator
(gleiche Engine), kria-check.

## 3. Ablauf

Themen-Filter (Jugendamt, Rechte, Daten, Internet/Plattformen, Kosten,
Notlage) → passende Stellen als Karten (Wofür / So erreichen / Grundlage /
Ebene) + kurzer Wegweiser-Satz je Thema. Kein localStorage; Filter nur im
Speicher.

## 4. Didaktik

Zuständigkeits-Klarheit statt Behörden-Dschungel: Jede Stelle bekommt ein
konkretes „Wofür“ und einen realistischen Zugangsweg. Rechtsgrundlagen
(§9a SGB VIII, DSGVO Art. 77, DSA, JMStV, UN-KRK) machen sichtbar, dass
Beschwerderechte echt und einklagbar sind. Notlage-Thema führt immer
zuerst zur Nummer gegen Kummer.

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter) – die App verlinkt nicht,
sondern nennt Stellen und Suchwege; statische, datierte Daten (ohne
Gewähr-Hinweis), kein localStorage, werbefrei, Impressum.

## 6. Tests

`test/stellen.test.mjs`: ≥7 Stellen, Pflichtfelder, Themen-Abdeckung
(§9a SGB VIII, DSGVO 77, DSA, jugendschutz.net, 116 111, JMStV), jedes
Filter-Thema mit Stelle + Wegweiser-Satz, filtereStellen-Randfälle.

## 7. Erweiterungen (Katalog)

Bundesland-Filter mit konkreten Adressen; Druck-Merkblatt „Wer hilft
wobei“; Verknüpfung mit beschwerde-lotse (Kind → Eltern-Weg).

**Vorlesen:** nicht vorgesehen. Werkzeug für Erwachsene; die Vorlese-Regel gilt für Kinder-Apps (Entscheidung Max 28а, 27.10.2026).
