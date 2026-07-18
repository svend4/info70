# info70 Kinder-Netz prototypes

A dependency-free npm workspace monorepo for four child-safe digital prototypes inspired by Germany's post-`Ein Netz für Kinder` ecosystem.

## Apps

| App | Command | Purpose |
| --- | --- | --- |
| `safe-search` | `npm run start:safe-search` | Curated safe-search and topic-room companion for children and parents. |
| `media-time` | `npm run start:media-time` | Family media-time planner focused on routines, reflection, and printable agreements. |
| `help-bridge` | `npm run start:help-bridge` | Calm triage for cyberbullying, unwanted contact, hate speech, and evidence preservation. |
| `ai-literacy` | `npm run start:ai-literacy` | Teen AI-literacy exercises for source checks, bias reflection, and prompt improvement. |

## Packages

- `packages/shared-data` contains product configs, demand scoring, vetted resources, risk routes, and app-specific domain experiences.
- `packages/app-shell` renders the browser UI from shared data and owns shared shell CSS served at `/shell/styles.css`.
- `packages/static-server` serves app `public/` files plus `/shared/index.js` and `/shell/render.js` with path traversal protection, baseline security/privacy headers, malformed URL handling, and GET/HEAD-only method handling.

## Development

```bash
npm test
npm run validate
npm run start:safe-search
```

The apps are intentionally framework-free so that product flows, German-language copy, and co-design ideas can be changed quickly before choosing a production stack.

## Accessibility baseline

Each prototype includes a skip link, a targetable `main` landmark, explicit button types, polite live-region updates for demo output, visible keyboard focus styles, and reduced-motion CSS. These are smoke-tested with `npm test`.

## Localisation readiness

The shared data model includes short summaries in German, Russian, Ukrainian, and Turkish. Each prototype renders a locale switcher backed by `supportedLocales` and `localizedSummaries`, with smoke tests covering the placeholders and locale coverage.

## Continuous integration

`npm run check` runs the complete local quality gate (`npm test` and `npm run validate`). The GitHub Actions workflow in `.github/workflows/ci.yml` runs the same command on pull requests and on pushes to `main`/`master` with Node.js 18, 20, and 22.

## Privacy-by-default prototypes

The shared data model exports `privacyCommitments` used by every app. The current MVP stance is no child accounts, no analytics/tracking/cookies/local storage, no sensitive personal data collection, and browser-session-only demo decisions.

## Age-aware guidance

The shared data model exports `ageGuidance` for each prototype so the UI can distinguish younger children, teenagers, parents, educators, and trusted adults. This keeps the MVP flows from treating all children as one audience and is covered by `npm test` and `npm run validate`.

## Pilot impact metrics

Each app now has `impactMetrics` in shared data. These metrics define what an early pilot should prove before deeper implementation, such as safe next-step speed, explainability, balanced planning, and account-free classroom reuse.

## Renderer resilience

The shared renderer now uses guarded DOM writes, so optional prototype sections can be omitted during experiments without crashing the whole page. `tests/render-safety.test.mjs` covers sparse placeholder documents and rich-section rendering.

## Static asset MIME types

The local static server serves HTML and CSS with UTF-8 text types and JavaScript modules as `application/javascript; charset=utf-8`. Static-server tests assert these content types alongside the existing security and privacy headers.

## Runtime compatibility

The root package declares Node.js `>=18`, and CI now tests the quality gate on Node.js 18, 20, and 22 so the dependency-free prototypes remain compatible with the declared runtime floor and current LTS releases.
