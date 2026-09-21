# Yandex Production Cutover Runbook

Use this runbook only after Yandex staging has passed deployed smoke and manual
auth checks. Keep the existing Cloudflare production deployment alive until the
Yandex production domain has worked for several days.

Do not commit real Yandex ids, DNS tokens, service-account ids, or secrets.

## Current Status

Production cutover completed on 2026-09-21.

- `horroreiro.ru` smoke passed on the Yandex production gateway.
- `www.horroreiro.ru` smoke passed on the Yandex production gateway.
- The production Serverless Container is private and should return `403` on its
  direct `containers.yandexcloud.net` URL.
- Keep the old Cloudflare deployment alive for several days as a DNS rollback
  target.

## Architecture Choice

Production should use a separate Yandex Serverless Container and API Gateway:

- staging container: used for future release validation;
- staging gateway: attached to `staging.horroreiro.ru`;
- production container: attached to production traffic only;
- production gateway: attached to `horroreiro.ru` and `www.horroreiro.ru`.

This keeps staging updates from changing production behavior and makes rollback
clearer.

## Source Of Truth

Production `horroreiro.ru` follows the `main` branch. Normal release flow is:
changes are accumulated and validated on `dev`, then promoted to `main`, then
`main` is merged back into `dev` so both branches stay aligned.

The user's existing shell flow is:

```bash
git checkout main && git pull origin main && git merge dev && git push origin main && git checkout dev && git pull origin dev && git merge main && git push origin dev
```

In this PowerShell environment, run the same flow as separate commands because
`&&` can be rejected:

```powershell
git checkout main
git pull origin main
git merge dev
git push origin main
git checkout dev
git pull origin dev
git merge main
git push origin dev
```

Before moving production traffic to Yandex:

1. Tag the current pre-Yandex production state.
2. Promote the approved `dev` changes into `main` using the normal release flow.
3. Build the Yandex production image from the exact `main` commit.
4. Use that full git SHA as both the Docker image tag and `APP_BUILD_VERSION`.

Do not point production Yandex to an image built from an unmerged `dev` commit.

## Production Resource Setup

Create production resources separately from staging:

- Serverless Container: `horroreiro-production`;
- API Gateway: `horroreiro-production-gateway`;
- Gateway service account: `horroreiro-production-gateway`;
- Certificate Manager certificate: `horroreiro-production`;
- domains:
  - `horroreiro.ru`;
  - `www.horroreiro.ru`.

The gateway service account must have `serverless-containers.containerInvoker`
for the production container.

## Supabase Auth

Keep production Supabase Auth Site URL on `https://horroreiro.ru/`.

Required Redirect URLs:

- `https://horroreiro.ru/**`
- `https://www.horroreiro.ru/**`
- `https://staging.horroreiro.ru/**`
- `http://localhost:3000/**` if local auth checks are still needed.

Do not remove the current production redirect entries during the migration.

## DNS Cutover Prep

Lower TTL before the switch window, ideally to `300`.

If DNS authority moves from Cloudflare to Yandex Cloud DNS, copy every existing
record before changing name servers:

- website records;
- MX;
- SPF;
- DKIM;
- DMARC;
- TXT verification records;
- Certificate Manager challenge records;
- any third-party service records.

For the apex domain `horroreiro.ru`, use the DNS mechanism supported by the
chosen DNS authority for API Gateway domains. If a third-party DNS provider does
not support an apex CNAME-like record, move the zone to Yandex Cloud DNS and use
the provider-supported apex record there.

## Cutover Checks

Before DNS switch:

- deployed smoke passes on the production gateway URL;
- `/env` reports the intended `APP_BUILD_VERSION`;
- `/sitemap.xml` returns XML;
- clean movie/user/person/company URLs open directly;
- admin-only endpoints remain admin-gated;
- auth login, magic link, password reset, and profile password change work;
- service-role key is not exposed by `/env`.

After DNS switch:

- deployed smoke passes on `https://horroreiro.ru`;
- deployed smoke passes on `https://www.horroreiro.ru` if `www` is active;
- browser manual checks pass for catalog, movie details, profile, notifications,
  editor, directors, people, and companies;
- logs show no repeating gateway/container 4xx or 5xx;
- Cloudflare production remains available for rollback while DNS caches expire.

## Rollback

Prefer DNS-only rollback:

1. Repoint production DNS back to the old Cloudflare target.
2. Keep the Yandex production resources in place for debugging.
3. Do not delete the Yandex image, gateway, container, or certificate until the
   cause is understood.

If the issue is a bad image, create a new Yandex revision from the previous known
good image tag instead of rebuilding from an unknown local state.
