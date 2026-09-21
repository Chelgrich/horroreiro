# Portable Deployment Inventory

This inventory is the provider-neutral checklist for moving Horroreiro from the current Cloudflare Pages setup to any Docker/container-capable host.

It is not a Yandex, VPS, or Cloud.ru manifest. Provider-specific files should be added only after the portable runtime, Docker image, route inventory, DNS, and smoke checks are understood here.

## Deployment Rules

- Keep `server/runtime.js` as the server routing source of truth.
- Keep `Dockerfile` generic and provider-independent.
- Host adapters should wrap the portable Node runtime instead of duplicating route logic.
- Do not expose service-role secrets to client code or `/env`.
- Keep the current Cloudflare production deployment alive until staging parity is confirmed and DNS has fully settled.
- Keep `/app-assets/<APP_BUILD_VERSION>?file=<asset>` as the public asset URL contract for app JS/CSS.

## Runtime Artifact

The portable runtime is a normal Node HTTP server:

- entrypoint: `server/server.mjs`;
- request router: `server/runtime.js`;
- Docker wrapper: `Dockerfile`;
- default container port: `8080`;
- runtime command: `node server/server.mjs`;
- production host binding: `HOST=0.0.0.0`.

Required environment variables:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `APP_BUILD_VERSION`
- `PORT`
- `HOST`
- `NODE_ENV=production`

Server-only environment variables:

- `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SERVICE_KEY`

The public `/env` response may expose only public browser configuration:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `APP_BUILD_VERSION`

It must never expose service-role keys.

## Static Assets

The host must preserve these cache and route expectations:

- HTML app shells: `no-store`.
- `/env`: `no-store`.
- `/app-assets/<APP_BUILD_VERSION>?file=<asset>`: `no-store`.
- Root app JS/CSS fallback paths: `public, max-age=0, must-revalidate`.
- Immutable public media: `/icons/*`, `/favicon.ico`, `/insidious.webp`, `/og-preview.jpg`.

Large app assets may be served by an object storage route in a future host, but browser-facing URLs should stay stable through the gateway/router.

Movie posters, person photos, and user avatars are Supabase Storage or remote URLs. They are not part of the host static bundle.

## Public Route Inventory

Runtime/public configuration:

- `/env`
- `/app-assets/:version?file=<asset>`

Server-generated routes:

- `/movie/:slug`
- `/movie.html?slug=...`
- `/movie.html?id=...`
- `/sitemap.xml`
- `/profile-activity-ranks/:userId`
- `/admin/users/:userId/password`

HTML shell routes:

- `/`, `/index.html`
- `/user/:handle`, `/user.html`
- `/following`, `/following.html`
- `/notifications`, `/notifications.html`
- `/editor`, `/editor.html`
- `/directors`, `/directors.html`
- `/name/:slug`, `/name.html`
- `/production`, `/production.html`
- `/distributors`, `/distributors.html`
- `/russian-distributors`, `/russian-distributors.html`
- `/company/:slug`, `/company.html`

Static fallback:

- any existing root file for `GET`/`HEAD`;
- otherwise a normal 404 response.

## External Dependencies

The target host must be able to reach:

- Supabase REST/Auth/Storage;
- Google Fonts hosts used by HTML shells;
- external image/aggregator URLs referenced by catalog and detail pages.

If a target audience has trouble reaching Google Fonts or any other public dependency, solve that as a separate asset-hosting task, not as part of the server runtime adapter.

## DNS And TLS

Use staging before production cutover:

- recommended staging host: `staging.horroreiro.ru`;
- keep Cloudflare production active during staging;
- issue TLS certificates for staging, apex, and `www` before final DNS switch;
- verify redirects and canonical URLs before moving the apex domain.

Before changing DNS authority, copy all records, not only the website record:

- A/AAAA/CNAME/ANAME/ALIAS;
- MX;
- SPF;
- DKIM;
- DMARC;
- TXT verification records;
- any service-specific records.

Cutover guardrails:

- lower TTL before the switch;
- keep the old Cloudflare production deployment running for several days;
- rollback path should be DNS-only whenever possible;
- keep a git tag or branch for the pre-migration Cloudflare state.

## Observability Checklist

The target host should expose enough logs/metrics to inspect:

- request access logs;
- 404 and 5xx rates;
- container cold starts/restarts;
- latency;
- memory and CPU;
- `/env` and `/app-assets/*` failures;
- Supabase request failures;
- admin endpoint failures;
- auth/reset-password failures.

## Staging Parity Checklist

Before production DNS cutover, verify on staging:

- catalog opens directly and through browser Back/Forward;
- movie detail clean URLs open directly with SEO fallback HTML;
- profile, notifications, following, editor, person, directors, company, and company-role pages open directly;
- `/sitemap.xml` returns XML;
- `/env` returns the intended build version;
- app assets load through `/app-assets/<APP_BUILD_VERSION>?file=...`;
- auth login, magic link redirect, password reset, and profile settings work;
- admin movie create/edit/delete works;
- admin password set endpoint works only for admins;
- warm-start snapshots do not reveal raw HTML or unstyled controls;
- cache headers match `docs/SERVER_RUNTIME.md`;
- anonymous public movie, person, and company pages work.

## Preflight Commands

Run these before host-specific staging:

```powershell
npm run smoke:portable
npm run smoke:docker
node tools/smoke-check.mjs
git diff --check
```

On a Docker-enabled deployment machine or CI runner, use the strict Docker check:

```powershell
npm run smoke:docker:required
```

## Future Host Adapter Boundary

Allowed future host-specific files:

- gateway/router config;
- container registry/build config;
- object-storage sync config;
- DNS/certificate documentation;
- provider-specific smoke script that calls the deployed staging URL.

Not allowed in host-specific adapters:

- a second route map that drifts from `server/runtime.js`;
- duplicated Supabase business logic;
- client-visible service-role secrets;
- permanent rewrite of app URLs for one provider.
