# Eingewöhnungs-Tagebuch 🌱

Инструмент **для педагогов** — каталог **docs/10 (Пралеска), Топ-30 №3**.
Локальный **светофорный журнал адаптации** (Eingewöhnung) по Berliner/
Münchener модели. **Наблюдение, не диагноз.**

## Что внутри

- Дети — только **кюрцель (макс. 3 знака), без имён**; на каждый ребёнок —
  дни адаптации.
- Каждый день фиксируется **структурно** (без свободного текста): фаза
  (Grundphase / первый Trennungsversuch / Stabilisierung / Schlussphase),
  светофор (🟢 gut / 🟡 wackelig / 🔴 schwer) и Trennung.
- **Отчёт** для Elterngespräch: хронология + тенденция (вспомогательная, не
  оценка) + рекомендация следующего шага (Trennungsabbruch → продлить
  Grundphase). Экспорт/копирование, Vorlesen.
- **Koffer**: экспорт/импорт `.json` (импорт лишь заполняет отсутствующих
  детей, длинные кюрцель отклоняются).
- `logik.mjs` + `koffer.mjs` (чистые): `trend`, `empfehlung`, `verlaufZeilen`,
  `bericht`, `pruefeEintrag`, `packe/pruefe/vereinigeKoffer`.

## Политика (DSGVO / EU AI Act)

Werbefrei, без внешних запросов (NetzwerkWaechter); только `et.daten` в
localStorage + «Alle Daten löschen»; **никакого скоринга/ранга** и свободного
текста с именами. Есть `eltern.html`, приложение в Eltern-Sammelband.

## Адаптация (Пралеска → Германия)

Концепция из каталога Пралеска; фазы/тексты — под принятые в Германии модели
адаптации (Berliner/Münchener).

## Запуск и тесты

```bash
npm run dev   # http://localhost:8070/apps/eingewoehnungs-tagebuch/
node --test apps/eingewoehnungs-tagebuch/test/*.test.mjs
```
