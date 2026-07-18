# Ombuds-Landkarte 🧭

Справочник **для родителей** — каталог docs/09, №38. Кто помогает при каком
проблеме и как туда обратиться. На движке foerder-navigator (карточки +
фильтр), данные статичны, без внешних запросов.

## Что внутри

9 инстанций с фильтром по теме (Jugendamt, права, данные, интернет/платформы,
Kostenfallen, острая нужда): Ombudsstelle Jugendhilfe (§9a SGB VIII),
Landes-Kinderbeauftragte, Datenschutzbehörde (DSGVO Art. 77), jugendschutz.net,
KJM/Landesmedienanstalt (JMStV), Bundesnetzagentur как DSA-Koordinator,
Nummer gegen Kummer (116 111), Monitoring-Stelle UN-KRK (DIMR),
Verbraucherzentrale. У каждой: «Wofür», «So erreichen Sie die Stelle»,
правовая основа, уровень (Land/Bund/EU).

Тест сверяет полноту полей, ключевые правовые привязки и что у каждой темы
фильтра есть хотя бы одна инстанция и вводный «Wegweiser»-текст.

## Политика

Инструмент для взрослых: **никаких внешних запросов** — только называет, кто
за что отвечает; данные поддерживаются вручную (`stand`), без localStorage,
фильтр — только в памяти страницы. Werbefrei.

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/ombuds-landkarte/
node --test apps/ombuds-landkarte/test/*.test.mjs
```
