# Kurz-GDD: OER-Bausteinvorlage „info70-Unterrichtsstunde“ 📐

**Einheit aus Katalog:** docs/09 Ось E — «OER-Bausteinvorlage».
**Engine:** datengetriebene Referenzseite (liest `daten/vorlage.json`).
Zielgruppe: Lehrkräfte (Autor*innen von Stundenentwürfen).

## 1. Kernaussage

Die standardisierte CC-BY-Vorlage, aus der alle Stundenentwürfe entstehen:
Abschnitts-Blueprint, 45-/90-Minuten-Phasenraster, Kompetenz-Mapping auf
Medienkompetenzrahmen NRW und KMK, dokumentiertes JSON-Schema und ein
druckbares Blanko-Formular zum Ausfüllen von Hand.

## 2. Zielgruppe

Lehrkräfte. Nachbarn: alle stundenentwurf-*, projektwoche,
leichte-sprache-werkstatt.

## 3. Aufbau

1) Blueprint der Abschnitte mit Hinweisen.
2) Phasenraster Einstieg→Abschluss (Minuten + Zweck).
3) Kompetenz-Mapping NRW/KMK.
4) Blanko-Vorlage (Druck) + JSON-Schema + Beispiel-Links.

## 4. Didaktik / Nutzen

Sichert Einheitlichkeit und Qualität aller Entwürfe; senkt die Hürde,
eigene OER-Stunden beizusteuern (analog auf Papier, digital via Schema).

## 5. Politik-Konformität (docs/02)

Keine externen Anfragen (NetzwerkWaechter), werbefrei, **speichert nichts**.
Content-Lizenz CC-BY 4.0 (OER). Schulwerkzeug ohne eltern.html.

## 6. Tests

`test/vorlage.test.mjs`: Kern-Abschnitte vorhanden, Phasenraster
Einstieg→Abschluss, NRW/KMK mit je 6 Bereichen, Lizenz CC-BY, Schema
dokumentiert, alle Beispiel-Stundenentwürfe existieren.

## 7. Erweiterungen (Katalog)

Interaktiver Entwurfs-Assistent (Formular → stunde.json-Download),
Kompetenz-Filter, Kopplung mit leichte-sprache-werkstatt und projektwoche.
