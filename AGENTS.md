# Codex Project Context

Read this file before architecture or implementation work in this repository.

## Fast Start

1. Read `docs/CODEX_CONTEXT.md` for the architecture map.
2. Read the latest entries in `docs/RECENT_CHANGES.md` for recent decisions and traps.
3. Read `docs/DATA_MODEL.md` before changing Supabase queries, auth, profile, movie, people, social, or notification flows.
4. Read `docs/MOVIE_DATA_ENRICHMENT_GUIDE.md` before verifying, enriching, or overwriting movie year, additional genres, countries, production, distribution, or Russian distribution values.
5. Inspect the code around the exact feature before editing. These docs are a map, not a substitute for the source.

## Update Rule

After any file change that affects behavior, architecture, data flow, deploy behavior, dependencies, routing, or important UI structure:

- update `docs/RECENT_CHANGES.md`;
- update `docs/CODEX_CONTEXT.md` if architecture or ownership changed;
- update `docs/DATA_MODEL.md` if tables, fields, RPCs, storage buckets, or RLS assumptions changed.

`node tools/smoke-check.mjs` checks that key source changes are accompanied by a `docs/RECENT_CHANGES.md` update while the working tree is dirty.

## Practical Defaults

- Main app logic is still mostly in `app.js`; do not assume a framework boundary except where explicitly documented.
- `/directors` admin UI is the first Preact/Vite island: source in `src/directors-admin-app.jsx`, built artifact in `assets/directors-admin-app.js`.
- Production `horroreiro.ru` follows `main`; `dev` is the active working branch. When a change must fix production, push the relevant commit to `main` too.
- Supabase schema SQL files are usually one-time operational artifacts. If SQL was already applied manually, do not keep stale setup files around unless they are reusable documentation.
- Client code must not use service-role secrets. Server-only operations live under `functions/`.
