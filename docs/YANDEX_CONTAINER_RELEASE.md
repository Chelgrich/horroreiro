# Yandex Serverless Container Release Checklist

Use this checklist only after reading:

- `docs/DEPLOYMENT_INVENTORY.md`
- `docs/YANDEX_STAGING_PLAN.md`
- `docs/SERVER_RUNTIME.md`

This is a manual release checklist, not an automated deploy script. Keep Cloudflare production running.
Do not put real cloud ids, registry ids, service-account ids, or secrets into git.

## 1. Pick The Build

Use the exact git commit as the runtime build version:

```powershell
git rev-parse HEAD
npm run release:container:preflight -- --expected-version <full-git-sha>
```

For local iteration before committing, the same check can be run as:

```powershell
npm run release:container:preflight -- --expected-version <full-git-sha> --allow-dirty
```

Do not use `APP_BUILD_VERSION=dev` for Yandex staging.

## 2. Run Local Runtime Checks

```powershell
npm run smoke:portable
npm run smoke:docker:required
node tools/smoke-check.mjs
git diff --check
```

`smoke:docker:required` should be run on a machine with Docker available before an image is pushed.

## 3. Build And Tag The Image

Local generic tag:

```powershell
docker build -t horroreiro-portable:<full-git-sha> .
```

Yandex Container Registry tag:

```powershell
docker tag horroreiro-portable:<full-git-sha> cr.yandex/<registry-id>/horroreiro:<full-git-sha>
```

Optional human-readable staging tag:

```powershell
docker tag horroreiro-portable:<full-git-sha> cr.yandex/<registry-id>/horroreiro:staging-<yyyy-mm-dd>-<short-sha>
```

Tags should be treated as immutable. Do not reuse a staging/prod tag for a different commit.

## 4. Push The Image

Authenticate Docker to Yandex Container Registry using the provider-recommended method for the chosen service account.

Then push:

```powershell
docker push cr.yandex/<registry-id>/horroreiro:<full-git-sha>
```

If the optional staging tag is used:

```powershell
docker push cr.yandex/<registry-id>/horroreiro:staging-<yyyy-mm-dd>-<short-sha>
```

## 5. Create A Serverless Container Revision

Use the pushed image and set runtime environment variables from:

- `deploy/yandex/serverless-container.env.example`

Set:

- `APP_BUILD_VERSION=<full-git-sha>`
- `SUPABASE_URL=<public project url>`
- `SUPABASE_ANON_KEY=<public anon/publishable key>`
- `SUPABASE_SERVICE_ROLE_KEY=<service role key>`

Keep:

- `NODE_ENV=production`
- `HOST=0.0.0.0`

Do not set `PORT` manually in Yandex Serverless Containers. In HTTP-server mode,
Yandex injects `PORT` automatically and rejects user-defined `PORT` variables.
The Dockerfile default `PORT=8080` is only a local/generic-container fallback.

Initial resource settings should be conservative. Measure after the staging smoke passes.

## 6. Check The Direct Container URL

If the container exposes a direct HTTPS URL, run:

```powershell
npm run smoke:deployed -- --base-url <direct-container-url> --expected-version <full-git-sha>
```

Expected result:

- `/env` reports the chosen `APP_BUILD_VERSION`;
- `/app-assets/<APP_BUILD_VERSION>?file=...` works;
- clean routes return the expected shells/fallbacks;
- `SUPABASE_SERVICE_ROLE_KEY` is not exposed.

## 7. Move To API Gateway Only After This Passes

Do not create or debug API Gateway routes until the direct container URL passes the deployed smoke.
When API Gateway is reachable, run the same check:

```powershell
npm run smoke:deployed -- --base-url <gateway-url> --expected-version <full-git-sha>
```

Only after gateway smoke passes should `staging.horroreiro.ru` be connected and tested.
