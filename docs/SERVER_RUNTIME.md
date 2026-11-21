# Portable Server Runtime

This document describes the provider-independent HTTP runtime used as the migration base away from Cloudflare-specific hosting.

## Goal

The app should not be rewritten for a specific host. The server layer should run as a normal Node HTTP application, then be deployable in Docker on Yandex Cloud, Cloud.ru, a VPS, or another container host.

Provider-specific deployment files should live outside the runtime. The runtime itself must not use Yandex-specific SDKs or Cloudflare-only request APIs.

## Current Runtime Files

- `server/runtime.js` creates a portable request router and Cloudflare-compatible handler context.
- `server/server.mjs` starts the runtime as a plain Node HTTP server on `PORT` for local use and future Docker use.
- `tools/portable-runtime-smoke.mjs` verifies that the portable runtime answers the important public routes without Cloudflare Pages.
- `Dockerfile` wraps the same runtime in a minimal Node image.
- `tools/docker-runtime-smoke.mjs` optionally builds and runs the Docker image when Docker is available.
- `tools/container-release-preflight.mjs` checks a container release candidate before the image is built/pushed.

The runtime currently reuses the existing `functions/*` handlers by providing:

- standard Web `Request` and `Response` objects;
- `env` from process/env overrides;
- `env.ASSETS.fetch`, backed by local files;
- dynamic `params` for routes such as `/movie/:slug` and `/user/:handle`.

## Route Inventory

Runtime/public configuration:

- `/env` -> environment JS payload.
- `/app-assets/:version?file=<asset>` -> allowlisted JS/CSS. Current-build scripts use `private, no-cache` and weak content ETags. CSS and mismatched versions use `no-store`.
- `/supabase/rest/v1/*` and `/supabase/auth/v1/*` -> `functions/supabase/[[path]].js`, fixed configured Supabase upstream for browser API access. Only the configured publishable key and caller bearer token are forwarded; RLS/Auth remain authoritative. Requests with a foreign Origin or a different API key are rejected. Site cookies are stripped, redirects are refused, bodies are bounded to 64 KiB, upstream requests time out after 15 seconds, and all replies are `no-store` without Set-Cookie/CORS headers. Storage/Realtime are outside this route. The official SDK supports this through its [custom fetch option](https://supabase.com/docs/reference/javascript/initializing).
- `/assets/vendor/supabase-2.119.0.js` -> pinned browser SDK, served directly with immutable caching. Provenance/license/checksum are in `assets/vendor/README.md`; the transport smoke verifies the exact distribution and browser export.

Dynamic/server-generated:

- `/movie/:slug` -> movie SEO HTML through Supabase, fallback to `movie.html` shell on server data failure.
- `/movie.html?slug=...|id=...` -> legacy movie SEO/redirect route.
- `/sitemap.xml` -> dynamic sitemap XML.
- `/profile-activity-ranks/:userId` -> server-side profile ranking aggregate.
- `/admin/users/:userId/password` -> admin password operation, POST only.
- `/og/movie/:slug.jpg` -> baseline JPEG 1200x630, or the static fallback image. Poster downloads accept only HTTPS public `posters` object/render paths on `SUPABASE_URL`, without redirects; they stop after 8 MiB or five seconds (including the response body). Decoding is limited to 8 million input pixels. These limits do not alter uploaded files or browser poster display.

HTML shells:

- `/`, `/index.html` -> `index.html`.
- `/user/:handle`, `/user.html` -> `user.html`.
- `/following`, `/following.html` -> `following.html`.
- `/notifications`, `/notifications.html` -> `notifications.html`.
- `/editor`, `/editor.html` -> `editor.html`.
- `/directors`, `/directors.html` -> `directors.html`.
- `/name/:slug`, `/name.html` -> `name.html`.
- `/production`, `/production.html` -> `companies.html`.
- `/distributors`, `/distributors.html` -> `companies.html`.
- `/russian-distributors`, `/russian-distributors.html` -> `companies.html`.
- `/company/:slug`, `/company.html` -> `company.html`.

Static fallback:

- Other `GET`/`HEAD` paths are served only through the explicit allowlist. Client JS/CSS/HTML come from `client-assets.js`; `server/runtime.js` adds media/license paths. Register new client files once in the shared inventory, then run `node tools/sync-client-headers.mjs`; smoke verifies publication, versioned routes, loader references and generated headers. Never add server/private files to the client inventory.
- Files in `deploy`, `server`, `functions`, `node_modules`, docs, and unlisted root paths are private even when present on disk. Symlink/junction aliases into private files and malformed URL encodings return 404.
- The Node HTTP adapter accepts at most 64 KiB for non-GET/HEAD request bodies, checked before routing for both declared and chunked uploads. Oversized requests receive 413 with a closed connection. Current server POSTs are JSON admin operations; browser image uploads go directly to Supabase Storage.
- HTML files are `no-store`.
- app JS/CSS assets are `public, max-age=0, must-revalidate`.
- long-lived immutable headers are kept for `/icons/*`, `/favicon.ico`, `/insidious.webp`, and `/og-preview.jpg`.

## Local Run

```powershell
npm run start:portable
```

Default URL:

```text
http://127.0.0.1:4179
```

Useful smoke:

```powershell
npm run smoke:portable
```

## Docker Run

The Docker image is only a portable wrapper around `server/server.mjs`; it should not contain host-specific logic.

```powershell
npm run docker:build
docker run --rm -p 8080:8080 --env-file .env horroreiro-portable
```

The container listens on `PORT`, defaulting to `8080` in the image.

Optional smoke:

```powershell
npm run smoke:docker
```

`smoke:docker` skips cleanly when Docker is not installed. Use `npm run smoke:docker:required` in an environment where Docker must be present.

## Migration Rule

Before adding any Yandex, VPS, or other host-specific files, keep the route working in `server/runtime.js` first. Host adapters should call or wrap this runtime instead of duplicating business logic.
