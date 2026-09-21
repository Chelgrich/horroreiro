# Yandex Staging And Cutover Plan

This is the first provider-specific migration plan for Horroreiro. It is documentation only: do not add Yandex manifests, CLI scripts, or SDK dependencies until this plan has been walked through manually.

Read first:

- `docs/DEPLOYMENT_INVENTORY.md`
- `docs/SERVER_RUNTIME.md`
- `docs/CODEX_CONTEXT.md`
- `docs/YANDEX_CONTAINER_RELEASE.md`

Official service references checked on 2026-09-21:

- Yandex API Gateway: https://yandex.cloud/ru/services/api-gateway
- Yandex Serverless Containers: https://yandex.cloud/ru/services/serverless-containers
- Yandex Container Registry: https://yandex.cloud/ru/services/container-registry
- Yandex Object Storage: https://yandex.cloud/ru/services/storage
- Yandex Cloud DNS: https://yandex.cloud/ru/services/dns
- Yandex Certificate Manager: https://yandex.cloud/ru/services/certificate-manager

Do not copy price/free-tier numbers into repo docs or code. They change more often than architecture. Check the official pricing pages at the moment of migration.

## Architecture Target

Safe staging target:

```text
staging.horroreiro.ru
        |
        v
Yandex API Gateway
        |
        v
Yandex Serverless Container
        |
        v
server/runtime.js + existing functions/*
```

Optional later asset split:

```text
staging.horroreiro.ru
        |
        v
Yandex API Gateway
        |
        +--> selected static asset routes -> Object Storage
        |
        +--> all app/server routes -> Serverless Container
```

Start with the single-container staging path. It preserves the existing `/app-assets/<APP_BUILD_VERSION>?file=<asset>` contract exactly and lowers migration risk.

Object Storage is useful later, but the current app-assets URL contract uses a query parameter (`file=<asset>`). Do not route `/app-assets/*` directly to Object Storage until there is a tested compatibility strategy that preserves this public URL. A stable URL contract is more important than splitting static assets on day one.

## Phase 0 - Freeze The Contract

1. Keep Cloudflare production fully active.
2. Keep `server/runtime.js` as the route source of truth.
3. Do not change public URLs for catalog, movie pages, profiles, people, companies, sitemap, or app assets.
4. Do not move Supabase project/schema.
5. Do not expose `SUPABASE_SERVICE_ROLE_KEY` through `/env`, HTML, JS bundles, logs, or Object Storage.
6. Pick a staging commit SHA and use it as `APP_BUILD_VERSION`.

Preflight:

```powershell
npm run release:container:preflight -- --expected-version <APP_BUILD_VERSION>
npm run smoke:portable
npm run smoke:docker:required
node tools/smoke-check.mjs
git diff --check
```

## Phase 1 - Yandex Cloud Foundation

Create or verify:

1. Cloud/folder for Horroreiro.
2. Billing state and budget alert.
3. Service accounts:
   - deployer account for pushing images and deploying revisions;
   - runtime account for Serverless Container execution;
   - optional static asset account for Object Storage sync, if asset split is tested later.
4. Minimal IAM roles for each account. Avoid broad admin roles after bootstrap.
5. Container Registry for `horroreiro`.
6. Certificate Manager certificate request for `staging.horroreiro.ru`.
7. Cloud DNS public zone only if we decide to delegate DNS to Yandex during staging. Otherwise keep current DNS and add only the staging records needed for validation/routing.

Manual record to keep outside git:

- cloud id;
- folder id;
- registry id;
- service account ids;
- certificate id;
- API Gateway id;
- Serverless Container id;
- where each secret is stored.

Do not commit those ids unless they are intentionally public and non-sensitive.

## Phase 2 - Build And Push Image

Use `docs/YANDEX_CONTAINER_RELEASE.md` as the operational checklist for this phase.

Local or CI build:

```powershell
docker build -t horroreiro-portable .
```

Before pushing:

```powershell
npm run smoke:docker:required
```

Tag convention:

```text
horroreiro:<full-git-sha>
horroreiro:staging-<yyyy-mm-dd>-<short-sha>
```

Push the image to Yandex Container Registry using the provider-recommended Docker auth flow.

Keep image tags immutable in practice: a staging/prod tag should point to one build, not be reused for a different commit.

## Phase 3 - Serverless Container Staging

Create a Serverless Container revision from the pushed image.

Runtime env:

- `NODE_ENV=production`
- `HOST=0.0.0.0`
- `APP_BUILD_VERSION=<full-git-sha>`
- `SUPABASE_URL=<public project url>`
- `SUPABASE_ANON_KEY=<public anon key>`

Do not set `PORT` manually in the Yandex Serverless Container revision.
Yandex injects `PORT` automatically in HTTP-server mode and rejects user-defined
`PORT` variables. The Dockerfile default `PORT=8080` remains only a local/generic-container fallback.

Server-only env:

- `SUPABASE_SERVICE_ROLE_KEY=<service role key>` or `SUPABASE_SERVICE_KEY=<service role key>`

Use `deploy/yandex/serverless-container.env.example` as the safe key list. Fill real values only in Yandex Cloud UI/CLI or a local untracked secret store, never in git.

Initial resource settings should be conservative and then measured. Do not optimize CPU/RAM before the staging smoke passes.

Direct container URL checks before API Gateway:

- `/env`
- `/`
- `/movie/test-movie`
- `/user/profile000`
- `/notifications`
- `/directors`
- `/company/test-company`
- `/sitemap.xml`
- `/app-assets/<APP_BUILD_VERSION>?file=app.js`

Expected result: routes answer through the portable runtime, even if Supabase data returns normal not-found/fallback states for fake slugs.

If the container exposes an external HTTPS URL, run:

```powershell
npm run smoke:deployed -- --base-url <direct-container-url> --expected-version <APP_BUILD_VERSION>
```

## Phase 4 - API Gateway Staging

Create API Gateway only after the direct container URL works.

First gateway spec should be boring:

- route all `GET`, `HEAD`, and relevant mutating requests to the Serverless Container;
- preserve path, query string, headers, and body;
- do not add custom auth at gateway level;
- do not split Object Storage yet;
- add CORS only if a real browser check shows it is needed.

API Gateway requires a service account for Serverless Container integrations. Create
or select a service account for the gateway and grant it
`serverless-containers.containerInvoker` for the target container before creating
the gateway.

Use `deploy/yandex/api-gateway-openapi.example.yaml` as the initial spec. It has
separate root and greedy proxy routes so both `/` and clean app URLs are routed to
the same Serverless Container. Fill both `<container-id>` and
`<service-account-id>`.

Gateway checks:

- `/env` returns a valid JS env payload;
- `/app-assets/<APP_BUILD_VERSION>?file=app.js` returns the expected app bundle;
- `/sitemap.xml` returns XML;
- clean app URLs return HTML shells or SEO HTML as expected;
- POST `/admin/users/:userId/password` remains admin-gated by app/server logic.

Provider-neutral gateway smoke:

```powershell
npm run smoke:deployed -- --base-url <gateway-url> --expected-version <APP_BUILD_VERSION>
```

If a future gateway route sends assets to Object Storage, it must pass these additional checks:

- the existing `/app-assets/<APP_BUILD_VERSION>?file=<asset>` URL still works;
- cache headers still match `docs/DEPLOYMENT_INVENTORY.md`;
- missing/forbidden files do not expose arbitrary bucket contents;
- app startup does not regress.

## Phase 5 - Staging Domain And TLS

1. Issue or import the `staging.horroreiro.ru` certificate in Certificate Manager.
2. Attach the certificate/domain to API Gateway.
3. Add the DNS record required by Yandex for the gateway domain.
4. Keep the current production domain on Cloudflare.
5. Do not change Supabase production auth settings until staging domain is reachable.

After domain works, add staging redirects in Supabase Auth:

- `https://staging.horroreiro.ru/**`

Check auth flows:

- magic link;
- password login;
- password reset;
- profile settings password change;
- admin password-set endpoint.

If Supabase requires a single Site URL that affects email templates, keep production as Site URL and use explicit `redirectTo` where the app supports it. Do not break production login to make staging prettier.

## Phase 6 - Staging Parity

Automated checks from a machine that can reach staging:

```powershell
npm run smoke:portable
npm run smoke:docker:required
npm run release:container:preflight -- --expected-version <APP_BUILD_VERSION>
npm run smoke:deployed -- --base-url https://staging.horroreiro.ru --expected-version <APP_BUILD_VERSION>
node tools/smoke-check.mjs
```

Manual staging checks:

1. Catalog direct open and browser Back/Forward from a movie detail page.
2. Movie detail direct open with SEO fallback visible in page source.
3. Profile, notifications, following, editor, directors, person, company, and company-role pages direct open.
4. Auth state in normal and incognito browser.
5. Admin movie add/edit/delete.
6. Profile settings: nickname, avatar, password, Russian posters.
7. Reviews/comments/likes/notifications.
8. Public anonymous movie/person/company pages.
9. `/sitemap.xml`.
10. Cache headers for `/env`, `/app-assets/*`, HTML shells, root JS/CSS, icons/media.
11. Warm-start: no raw HTML, no lone selects/buttons, no forced scroll reset.
12. Logs: no repeating 404/5xx, no Supabase auth/storage failures, no service-role key leakage.

Staging is not accepted until it can run for several days while Cloudflare production stays untouched.

## Phase 7 - Production Cutover Prep

1. Pick the production commit.
2. Tag the pre-migration state in git.
3. Deploy the same commit to Yandex staging and verify parity one last time.
4. Lower DNS TTL ahead of cutover.
5. Prepare Cloud DNS zone if moving authority to Yandex.
6. Copy all DNS records:
   - website records;
   - MX;
   - SPF;
   - DKIM;
   - DMARC;
   - TXT verification records;
   - any service-specific records.
7. Issue/import certificates for:
   - `horroreiro.ru`;
   - `www.horroreiro.ru`;
   - `staging.horroreiro.ru` if it stays alive.
8. Add production redirect allowlist entries in Supabase Auth if they are missing:
   - `https://horroreiro.ru/**`
   - `https://www.horroreiro.ru/**`
9. Keep Cloudflare deployment active.

## Phase 8 - Production Cutover

Cutover should be DNS-first and reversible:

1. Pause non-essential admin edits during the switch window.
2. Deploy the final production image/revision in Yandex.
3. Confirm `/env` on Yandex reports the expected `APP_BUILD_VERSION`.
4. Switch DNS to Yandex gateway/domain according to the chosen DNS authority model.
5. Monitor:
   - gateway/container 4xx/5xx;
   - `/env`;
   - `/app-assets/*`;
   - `/sitemap.xml`;
   - auth redirects;
   - Supabase errors;
   - user-visible login/profile/movie edit flows.
6. Keep Cloudflare production available for old DNS caches and rollback.

Do not remove Cloudflare routes, secrets, or DNS records until the new production path is stable for several days.

## Rollback

Rollback should not require a rebuild.

Fast rollback:

1. Point DNS back to Cloudflare.
2. Restore Supabase Auth redirect/Site URL settings if they were changed.
3. Keep Yandex staging/container alive for investigation.
4. Compare `/env` and app asset versions on both paths.
5. Write a `docs/RECENT_CHANGES.md` incident entry before attempting another cutover.

Rollback triggers:

- auth broken for real users;
- app assets return wrong commit;
- SEO movie pages fail directly;
- sitemap fails;
- admin edit flow fails;
- service-role key exposure suspicion;
- sustained unexplained 5xx.

## What Not To Do Yet

- Do not add Yandex manifests before manual staging details are known.
- Do not route `/app-assets/*` to Object Storage until the query-string asset contract is tested.
- Do not move Supabase.
- Do not change public URLs.
- Do not delete Cloudflare.
- Do not widen service account roles for convenience after bootstrap.
