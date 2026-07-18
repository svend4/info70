# Opportunity analysis: child-safe digital apps for Germany

_Last updated: 2026-07-12._

## Evidence base

- The former federal initiative **Ein Netz für Kinder** was discontinued in 2019, but its whitelist/safe-search idea continues through fragFINN and related child-friendly resources.
- The BzKJ 2026 funding call for **kindgerechte digitale Angebote** emphasises participation, interaction, democratic competence, AI, safe settings, and active involvement of children and teenagers.
- KIM 2024 reports that internet use is now a regular part of life for 6- to 13-year-olds: WhatsApp, videos/streaming, search engines, TikTok, child-specific websites, Wikipedia, and Instagram all appear in weekly use patterns.
- JIM 2025 reports that AI use has become mainstream among 12- to 19-year-olds and that information/news competence is increasingly tied to AI literacy.
- Current German prevention resources repeatedly point families toward safe search, media-time routines, help/reporting pathways, counselling, and media literacy.

## Prioritised app portfolio

| Rank | App | Monorepo path | Demand score | Why now | MVP scope |
| --- | --- | --- | ---: | --- | --- |
| 1 | KinderSafe Search Companion | `apps/safe-search` | 95 | Children use search/video discovery weekly and need a safe route before open platforms. | Curated start page, resource cards, parent-approved topics, child-friendly explanations. |
| 2 | Family Media Time Planner | `apps/media-time` | 89 | Daily online time is increasing; parents and schools need routines rather than only blocking tools. | Family media agreement, age bands, daily rhythm planner, reflection prompts. |
| 3 | Youth Help Bridge | `apps/help-bridge` | 86 | Cyberbullying, hate speech, fake news, unwanted contact, and sexual harassment need fast, calm triage. | Situation chooser, evidence checklist, escalation map to jugend.support and counselling. |
| 4 | AI Literacy Lab for Teens | `apps/ai-literacy` | 84 | Teenagers now use AI broadly; they need verification, bias awareness, and transparent prompt habits. | Micro-lessons, source-check challenge, AI disclosure cards, teacher mode. |

## Product requirements shared across all apps

1. Age-appropriate content and wording.
2. Data minimisation: no unnecessary account, tracking, or permissions in the MVP.
3. No manipulative monetisation, advertising, dark patterns, or app-store pressure.
4. Safe defaults, clear parent/educator guidance, and child-friendly explanations.
5. Participation loop: each app must include a child/teen testing protocol before production.
6. Accessibility and mobile-first design.
7. Localisation-ready copy for German first, then Ukrainian/Russian/Turkish/Arabic support.

## Monorepo architecture started

- `packages/shared-data` contains shared safety principles, trusted resources, and demand scoring.
- Each app under `apps/*` has a dependency-free static prototype with its own local server.
- The root `validate` script checks that all prototypes and analysis assets are present.

## Next development milestones

1. Replace placeholder static screens with task-specific flows.
2. Add German-language copy and co-design interview scripts.
3. Add automated accessibility checks and content-safety linting.
4. Decide whether to keep dependency-free static apps or migrate to a shared UI framework.
5. Prepare a BzKJ-aligned concept note for a future funding window.

## Continuation sprint: prototype depth added

The first continuation sprint moves the repo beyond placeholder landing pages:

- Shared `appConfigs` now define audience, product promise, primary action, feature cards, safety checklist, and next-sprint backlog for every app.
- Shared `riskRoutes` now model early triage needs for cyberbullying, unwanted contact, hate speech, and AI misinformation.
- Every app renders its own German-language product flow from shared data while keeping local styling and a dependency-free server.
- The validation script now imports shared data and verifies that app configs, demand scores, vetted resources, and risk routes exist.

## Detailed MVP flows

### `apps/safe-search`

1. Child chooses a safe topic room.
2. Parent-approved / whitelist-first links are shown before any broad web discovery.
3. The interface explains why some content is hidden instead of silently blocking it.

### `apps/media-time`

1. Family selects an age band and weekday/weekend rhythm.
2. Child chooses learning, creativity, play, movement, and rest slots.
3. The app produces a printable media agreement instead of a surveillance dashboard.

### `apps/help-bridge`

1. Teen chooses the problem type in calm, non-blaming language.
2. The app separates emergency, counselling, reporting, and evidence-preservation paths.
3. The app routes to trusted help resources without storing sensitive case data.

### `apps/ai-literacy`

1. Teen sees a prompt, an AI answer, and a source-check rubric.
2. The app asks for evidence, recency, perspective, and bias checks.
3. Teacher mode turns exercises into classroom discussion cards.

## Continuation sprint 2: engineering quality

The second continuation sprint reduces copy-pasted application code and makes the prototypes easier to extend:

- `packages/app-shell` owns the shared browser renderer for scorecards, feature cards, flow steps, demo chips, checklists, and trusted resources.
- `packages/static-server` owns the local dependency-free server and the module routes for `/shared/index.js` and `/shell/render.js`.
- Individual app `app.js` files are now thin entrypoints that provide only the app slug and shared data.
- `appConfigs` now include `flowSteps` and `demoItems` so each app has an explicit interaction model instead of a static page only.

## Continuation sprint 3: automated checks and server hardening

The third continuation sprint adds real automated tests and hardens the local prototype server:

- `npm test` now runs Node's built-in test runner over shared-data and static-server tests.
- Static-server tests verify app HTML, shared module serving, shell module serving, and path traversal protection.
- Shared-data tests verify that every app has demand scoring, cards, flow steps, demo items, and valid risk-route mappings.
- The static server now resolves paths against the public root and returns `403 Forbidden` for traversal attempts outside the app's `public/` directory.

## Continuation sprint 4: app-specific product substance

The fourth continuation sprint adds product-specific content blocks so the four apps no longer feel like the same shell with different titles:

- `safe-search` now has topic-room examples for homework, child-friendly news, hobbies, and creativity.
- `media-time` now has weekly planning blocks that distinguish learning, creative media work, and offline balance.
- `help-bridge` now has first-aid paths for insults, image pressure, and hate-speech situations.
- `ai-literacy` now has AI-check exercises for evidence, missing perspectives, and prompt improvement.

## Continuation sprint 5: onboarding and safer local serving

The fifth continuation sprint adds repository onboarding and hardens local serving defaults:

- `README.md` now documents the four apps, run commands, shared packages, and development checks.
- The static server now sends baseline security headers including `Content-Security-Policy`, `X-Content-Type-Options`, and `Referrer-Policy`.
- Malformed encoded URLs are handled as `400 Bad request` instead of being allowed to throw through the request handler.
- Static-server tests now cover security headers and malformed URL handling in addition to traversal protection.

## Continuation sprint 6: accessibility baseline

The sixth continuation sprint adds a first accessibility baseline for the prototypes:

- Every app now includes a skip link that targets the main content landmark.
- Demo output uses `aria-live="polite"` so interaction results can be announced without being disruptive.
- Buttons have explicit `type="button"`, focus-visible styles are present, and reduced-motion preferences are respected.
- `tests/accessibility-smoke.test.mjs` checks these baseline HTML/CSS affordances across all four apps.

## Continuation sprint 7: localisation readiness

The seventh continuation sprint adds a small multilingual layer for families who do not use German as their strongest language:

- `localizedSummaries` now provide short app descriptions in German, Russian, Ukrainian, and Turkish.
- `supportedLocales` centralises the language list used by the renderer and validation.
- The app shell renders a locale switcher and polite live summary region for every prototype.
- `tests/localization-smoke.test.mjs` checks that all apps expose locale placeholders and every supported locale has summary copy.

## Continuation sprint 8: shared design shell

The eighth continuation sprint reduces CSS duplication and makes app theming safer:

- `packages/app-shell/src/styles.css` now owns the shared layout, accessibility, locale, domain, card, and responsive CSS.
- Each app stylesheet imports `/shell/styles.css` and only defines a small app theme override.
- The static server now exposes `/shell/styles.css` alongside `/shell/render.js` and `/shared/index.js`.
- Accessibility smoke tests now verify that app stylesheets import the shared shell styles, while the shared CSS retains focus-visible and reduced-motion affordances.

## Continuation sprint 9: HTTP method safety

The ninth continuation sprint tightens the prototype server's HTTP surface:

- The static server now allows only `GET` and `HEAD` requests for static prototype assets.
- Unsupported methods return `405 Method not allowed` with an `Allow: GET, HEAD` header.
- `HEAD` requests return headers without a response body, matching static asset expectations.
- Static-server tests now cover `HEAD` and unsupported-method behaviour.

## Continuation sprint 10: CI quality gate

The tenth continuation sprint adds a repository-level quality gate:

- `npm run check` now runs both automated tests and monorepo validation.
- `.github/workflows/ci.yml` runs the same check on pull requests and pushes to `main`/`master`.
- CI covers Node.js 20 and 22 to keep the dependency-free prototypes portable across current LTS runtimes.
- `tests/ci-config.test.mjs` protects the workflow and package script from accidental removal.

## Continuation sprint 11: HEAD response consistency

The eleventh continuation sprint aligns error responses with HTTP `HEAD` semantics:

- Shared text response handling now suppresses bodies for `HEAD` requests, including `400`, `403`, and `404` responses.
- Static-server tests now verify that missing resources requested with `HEAD` return status headers without a body.

## Continuation sprint 12: privacy-oriented response headers

The twelfth continuation sprint tightens privacy defaults for local prototypes:

- The static server now sends `Cache-Control: no-store` so sensitive prototype flows are not cached by default.
- It also sends a restrictive `Permissions-Policy` disabling camera, microphone, geolocation, and payment APIs.
- Static-server tests now assert the privacy headers alongside the existing CSP, `nosniff`, and referrer policy checks.

## Continuation sprint 13: privacy-by-default product commitments

The thirteenth continuation sprint makes prototype privacy promises explicit in the UI and tests:

- `privacyCommitments` now capture no-account, no-analytics, no-sensitive-data, and browser-session-only prototype defaults.
- Every app renders a `Privacy-by-default MVP` section from the shared data model.
- Validation and shared-data tests now require these privacy commitments so the child-safety posture is not just documentation.

## Continuation sprint 14: age-aware guidance

The four prototypes now include explicit age-aware usage guidance instead of one-size-fits-all advice:

- `ageGuidance` in shared data provides at least three guidance entries per app for relevant age bands and adults.
- The shared shell renders an `Altersgerechte Nutzung` section across all prototype pages.
- Validation, shared-data tests, and accessibility smoke checks now protect this section and its data coverage.
- The guidance supports safer co-design: younger children get more adult mediation, older teens get more autonomy, and adults get concrete facilitation cues.

## Continuation sprint 15: pilot impact metrics

The fifteenth continuation sprint adds measurable pilot targets so product decisions can be tested rather than argued abstractly:

- `impactMetrics` now defines three measurable pilot outcomes for every app.
- The shared shell renders a `Wirkungsmetriken für Pilotierung` section before age guidance.
- Validation and shared-data tests require metric coverage for every prototype.
- Accessibility smoke tests protect the new page placeholder so the measurement layer remains visible in the UI.

## Continuation sprint 16: renderer resilience

The sixteenth continuation sprint hardens the shared app shell for faster experimentation:

- Shared DOM writes now go through guarded helpers, so missing optional placeholders do not crash the prototype.
- Demo and primary-action event listeners are attached only when the corresponding elements exist.
- `tests/render-safety.test.mjs` exercises sparse documents and verifies that rich sections still render when their placeholders are present.
- This makes the monorepo safer for parallel app experiments where not every prototype page has every module enabled yet.

## Continuation sprint 17: static asset MIME clarity

The seventeenth continuation sprint tightens static-server response correctness:

- JavaScript modules now use `application/javascript; charset=utf-8` instead of the legacy `text/javascript` type.
- `.mjs` is explicitly mapped for future module entry points.
- Static-server tests assert HTML, CSS, and JavaScript content types in addition to security/privacy headers.
- This keeps the no-dependency server small while making browser/module responses more explicit.

## Continuation sprint 18: runtime compatibility alignment

The eighteenth continuation sprint aligns CI with the package runtime contract:

- The root package supports Node.js `>=18`, so CI now includes Node.js 18.x alongside 20.x and 22.x.
- The CI config test was updated to protect the 18/20/22 matrix.
- README now documents the runtime compatibility policy explicitly.
- This prevents the repository from accidentally relying on APIs newer than the declared Node.js floor.
