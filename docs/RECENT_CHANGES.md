# Recent Changes

## 2026-11-26 — Retry timed-out catalog revision checks

- Catalog revision reads retry once on the 1.2-second client timeout and keep the same previous revision for the change journal. A successful retry can reuse matching catalog data or refresh changed films. Two timeouts or an immediate RPC error still fall back to the full index read.

## 2026-11-26 — Build catalog card HTML only when used

- Catalog metadata still indexes every movie for search and filters. Card formatting and HTML are computed on their first use by the renderer and reused until the corresponding movie metadata is rebuilt.

## 2026-11-26 — Keep unchanged catalog cards mounted when the index finishes

- The first page skips rebuilding and reconciling its card DOM when the complete index supplies the same rows in the same order with the same card controls. The catalog still updates counts, pagination, links and its snapshot. Changed rows, view or viewer state follow the existing render path.

## 2026-11-26 — Download the SDK and app scripts in parallel

- Preload the pinned Supabase SDK and the current build of `app.js` as soon as startup selects its configuration. Both downloads overlap the shared startup scripts. The loader still mounts the shared layout, waits for the page scripts and SDK, then executes `app.js` using its preload URL.

## 2026-11-26 — Render the first catalog page while the index loads

- A cold catalog in the default list view reads the newest 40 films first and mounts their posters. The rest of the index starts in the background from row 40. The toolbar and pagination use the complete index so searches, counts and filters include every film. Catalog URLs with filters or a saved view use the normal startup path.
- The split read only becomes a complete snapshot if the movie revision still matches after both reads. Missing revisions, interrupted reads and concurrent edits fall back to the normal index query.

## 2026-11-22 — Serve a compact social preview for the catalog

- The catalog and its `/index.html` alias use the same script-free response builder as movie previews for social crawlers. The preview uses the existing catalog image and canonical homepage URL. Browser requests still receive the catalog shell.

## 2026-11-22 — Animate catalog placeholders without repainting their backgrounds

- Catalog poster, text and link placeholders sweep a translated highlight across a static fill during both early and interactive loading. The highlight starts inside the card on first paint. It stops once a poster is hidden and is omitted when the visitor prefers reduced motion.

## 2026-11-22 — Match secondary skeletons to the page layouts

- Profile, notifications, following, editor, directors, and company shells render styled placeholders in their real grids before app startup. The same static skeleton stays visible through the initial loading state, including the layout breakpoints and reduced-motion behavior.
- The existing SEO lookups tell the public director and company shells which optional details are present. Filmography placeholders fill the first row on mobile.
- Warm-start snapshots omit the decorative skeleton markup. When restoring a page, the startup script keeps its skeleton from the current document for future loading states. Deferred editor diagnostics show the six-card grid while their data loads.

## 2026-11-22 — Preserve poster proportions in previews and index public filmographies

- First-party movie previews serve the poster at its original aspect ratio, with a 1200 px long-edge cap, a new image URL version and a short synopsis-first snippet. Browser and crawler HTML expose the same Open Graph values. Movie JSON-LD uses the actual synopsis and the catalog breadcrumb without inferring a release day or a spoken language.
- Public director, company and profile routes add canonical URLs, distinct titles and structured data to the initial HTML. The same minute-long row cache used by movie metadata shares repeat and concurrent lookups, with a timeout that allows for cold Supabase reads. Director and company pages include a short linked filmography for visitors without JavaScript. Legacy query URLs redirect to the clean routes. Missing companies and profiles return `404`; unsupported or legacy-only director URLs retain the client fallback with `noindex`.
- The sitemap paginates movies and adds directors and companies linked to films. A five-minute process cache shares the reads. An upstream failure returns `503` and keeps incomplete XML out of caches. Admin and personal app screens keep their existing indexing directives.

## 2026-11-22 — Skip identical catalog snapshot writes

- Catalog data and DOM snapshots skip storage writes while the saved payload is still fresh and every field except its timestamp matches. Changed and expired snapshots are saved normally.

## 2026-11-22 — Continue startup when the build changes

- The new runtime records its build and initializes the current document. Build-tagged snapshots validate themselves, and a release does not clear shared storage, preferences, or the CSS bundle already downloaded for the current build.
- When `/env` and the early HTML hint disagree during a rollout, startup switches to the stylesheet bundle for the runtime version. Late responses from the previous stylesheet request cannot replace the new styles.

## 2026-11-22 — Revalidate versioned scripts with ETags

- Current-build JavaScript responses use a weak SHA-256 content ETag and browser-only revalidation. Matching conditional requests return a bodyless `304`. CSS, errors, and fallback responses under old build URLs keep `no-store`.
- The portable HTTP writer omits its inferred body length on `304` responses. Smoke checks cover matching and outdated validators, a new build with changed bytes, and the deployed conditional response.

## 2026-11-21 — Calculate profile medal places in PostgreSQL

- The profile rank endpoint reads all three places and counts from one SQL request. Ranking still includes users with no activity, uses equal places for ties, and omits rated films from the active watchlist.
- Profile movie rails and taste data load independently of medals. Successful medal responses update only the statistics cards, and the profile cache can retain cards while medals are pending or unavailable.

## 2026-11-21 — Keep confirmed rating aggregates when a refresh fails

- Catalog and detail rating aggregates keep the last confirmed values on failure. Transient failures get at most one retry per load, with SDK retries disabled for these requests.
- Cold rating filters and month rating sorting wait for confirmed aggregates. After a terminal failure, the filter shows an unavailable state and rating sorting stays disabled. Personal ratings still use the existing user-scoped reads and writes.

## 2026-11-21 — Refresh edited catalog cards by movie ID

- The version check returns the IDs changed since the saved movie index revision when recent single-movie changes cover that revision. Fetch those rows with their catalog links in one batch and keep other rows and visible list cards mounted.
- The journal holds up to 32 single-movie statements. Movie creation, deletion, bulk edits and shared genre or country edits clear it. Unknown revisions and incomplete targeted responses use a full refresh.

## 2026-11-21 — Reuse resolved catalog card links on return

- Store resolved link rows, including movies with no links, in the same-tab catalog snapshot. A matching movie index revision keeps those rows. Missing pages still load their own visible links in a batch.
- A full index refresh invalidates resolved links. The visible cards retain their existing icons during the fetch, then reconcile updated provider URLs in place.

## 2026-11-21 — Revalidate catalog rating and review summaries on return

- A single Supabase read returns independent revisions for the movie index, rating aggregates and reviewed movie IDs. A same-viewer return reuses each matching snapshot and fetches only the changed datasets. Explicit reload or a failed revision check refreshes all three.
- The ratings revision changes transactionally with rating writes. The reviews revision follows review creation, deletion and movie assignment because the catalog summary contains only reviewed movie IDs. Full reads retain the revision captured before the request.

## 2026-11-21 — Revalidate the catalog movie index by database revision

- On return, read one public revision from Supabase. A matching revision reuses the snapshot. A changed, unavailable or missing revision reads the full index in the background. Explicit reload also reads the full index.
- A browser back/forward cache restore checks the current revision even when the browser keeps the previous catalog document alive.
- Snapshot startup waits for revalidation before requesting external links, using the current visible movie IDs in one batch and retaining links already on screen.
- The revision updates in the same transaction as movie, genre or country changes. The index read captures the revision before fetching rows, so a concurrent edit cannot mark old rows with a new revision.

## 2026-11-21 — Reuse the movie index on quick catalog returns

- A catalog history or film-link return can reuse a complete movie index read less than one minute ago. An explicit reload, expiry, or a changed local data stamp reads the index again. The age comes from the server read, so rewriting a DOM or session snapshot cannot extend it.
- Rating aggregates, review IDs, visible external links and viewer-scoped data keep their existing refresh behavior. Changes from another browser appear on the first return after the freshness window or on manual refresh.

## 2026-11-21 — Keep external link icons mounted in the catalog

- Catalog returns and card refreshes keep the existing link panel visible while link data is checked in the background. Reconcile resolved links by provider, changing only the affected URL or icon. An already loaded panel stays visible if that check fails.

## 2026-11-21 — Keep the movie poster mounted during the interactive handoff

- Movie details update the title, metadata, gallery controls and lower sections around the existing poster. The painted image and its ancestors stay connected during the server-to-interactive transition and subsequent renders. A different image replaces the visible preview after decoding.
- The catalog grid updates existing cards in place on snapshot refreshes. Gallery hydration and single-card refreshes keep the displayed image mounted while its replacement decodes.

## 2026-11-21 — Pick the movie poster before painting the detail page

- Server movie HTML carries the first public gallery image along with the base poster in the existing movie read. The early detail script selects the source using the preference last confirmed for the matching signed-in viewer. With no matching preference it waits for session restoration. Guest and default mode select the base poster.
- Server and interactive detail markup keep the poster skeleton until the image decodes. The matching poster stays mounted through the interactive handoff.

## 2026-11-21 — Keep painted posters visible on return

- A validated, same-viewer catalog DOM snapshot stays visible while the movie data reloads, including when the data snapshot has expired independently. A failed movie read leaves those cards in place.
- Catalog and movie detail renders carry painted posters into the new markup for the same movie. Matching images reuse their DOM node. Changed images replace the preview only after decoding, including when the catalog waits for a preferred gallery poster.
- Movie returns keep the saved gallery selection and skip saving transient poster loading states. A snapshot records no active poster animation.

## 2026-11-21 — Unify interface typography

- Text, headings and native form controls share the system font stack, with Calibri first where installed. The header and footer render one local SVG with Unbounded 600 outlines at their existing responsive sizes.
- Catalog presets and movie detail, review and comment sections inherit the shared text font.
- Removed the Google Fonts stylesheet, both font preconnects and the boot loader's font activation.

## 2026-11-21 — Keep movie comments in place during loading

- Review and comment reads still start in parallel. Comments render after the review section has settled, with review-reply snippets available on the first render. The loading view holds later sections and the footer out of view until the social layout is ready.
- Same-width warm snapshots keep the measured review and comment section heights with loading content. Restoring the cached movie waits for the social renderer so it can mount complete cached sections in one step while the warm snapshot stays visible. A return from an unfinished load fetches the sections again.
- Mobile review and comment sections use system typography so a late webfont cannot rewrap a review during the handoff.

## 2026-11-21 — Include relation-only companies in the first movie render

- Movie HTML carries public company links from the existing server movie read. The interactive page reuses them when the movie ID and company fields match. This includes companies that exist only through a relation, so the first render already has the full labels and links.
- A bare or outdated movie shell reads companies alongside the other initial data and keeps the movie's plain names if that read fails.

## 2026-11-21 — Enable movie actions before company links arrive

- The movie details page renders its controls and company names from the movie payload. Company links load independently and refresh only the company rows. Existing labels keep their width, including when a company page uses a different canonical spelling. Rows available only through relations retain their canonical names.
- A warm return keeps company links already loaded for the same movie and fields while they refresh. A failed refresh leaves the displayed names or links in place.

## 2026-11-21 — Show the movie intro from server HTML

- Canonical movie pages show the server poster, title and synopsis once route CSS is ready. The shared intro puts the synopsis above dynamic metadata and reserves the trailer slot where needed. Interactive startup reuses matching intro and poster nodes and keeps the server poster visible while a different gallery image is decoded.
- Movie detail rating badges reserve their image dimensions before their external responses arrive.

## 2026-11-20 — Measure editor poster transport

- The existing opt-in `Server-Timing` response now also covers GETs for `movie_poster_images`, so the editor's movie and poster reads can be compared at the same points in the proxy.

## 2026-11-20 — Load editor diagnostics in the background

- The editor completeness summary renders as soon as movie and poster rows are ready. Auto-related diagnostics start in parallel and update only their own section after the completeness blocks, so their arrival does not move the summary or issue lists.
- Diagnostics failures stay in their section. Results from superseded loads and departed sessions are ignored.

## 2026-11-19 — Animate page skeletons

- Shared page skeletons gently pulse their placeholder shapes without changing layout. The pulse runs only when the system allows motion.

## 2026-11-19 — Start styles early and bound remaining ID reads

- The document supplies a build hint so the route stylesheet bundle starts in parallel with `/env`. Same-build stylesheet caches can supply the first paint without another transfer. Startup keeps unstyled HTML hidden until the bundle is applied.
- Replaced the fullscreen interface loader with in-page skeletons on film, profile, director, company, activity and admin routes. Bootstrap errors are inline and warm content stays visible. The film SEO fallback retains a separate static skeleton for interactive startup.
- Catalog startup matches the native and enhanced sort control heights and delays below-grid text and footer visibility until the grid has data. A changed document build does not mount an old page snapshot.
- Removed the unused unbounded catalog movie lookup. Capped remaining GET filters at 100 UUIDs in poster galleries, public identities, follow preferences and film social reads. Review and comment likes retain complete results by paging within each ID batch. Catalog link hydration and notification event/snippet reads already stay below the bound.
- Released build `052c2583be755f7e805bf5bec38c150f4dc6e639`, Yandex revision `bbah773ss6r829hdv1u9`. Full smoke, Docker and all three deployed route checks passed.
- Eleven production gateway reads for poster galleries, public profiles, review/comment likes and reviewer ratings returned HTTP 200. The longest request target was 4,035 bytes. A 205-ID gallery lookup used 100, 100 and 5 IDs. Follow preferences with 205 IDs were checked in the controller fixture.
- Production Chrome passed 17 cold startups across 12 routes at 1350 and 390 px. All required stylesheets started before the held `/env` response. The measured content anchors and catalog/movie poster rectangles stayed in place. The mobile movie warm return again kept its description and poster in place while `/env` was held for 15 seconds. Protected routes were checked in guest mode.

## 2026-11-19 — Keep movie details stable on mobile and extend desktop catalog skeletons

- The saved movie summary masks rating text and any existing rating button in their regular layout. Guest snapshots have no button placeholder. The mobile details column uses system typography so a late font cannot rewrap the title and shift the description.
- Desktop catalog startup shows two rows of skeletons and holds the footer below the first screen. Mobile startup shows one row.
- Released build `e412eb08717989cb27d3aa9bf5d5be76e8c95b79`, Yandex revision `bbamhh68ssq24784f8jf`. Full smoke, Docker and all three production route checks passed. The gateway check passed on its third attempt after the new revision propagated.
- Production Chrome held `/env` for 15 seconds on movie history returns at 320 and 390 px. The synopsis, title and poster kept their positions with zero measured shift and one navigation per return. The live catalog showed eight placeholders at 1350 × 1600 px, with the footer at the lower edge of the viewport and all four first-row poster rectangles unchanged after the data arrived.

## 2026-11-19 — Fit profile movie reads through the gateway

- Shared movie and rating ID queries use at most 100 UUIDs per GET. The public profile taste projection with 200 IDs sent an 8,004-byte path and query and received HTTP 431. Rating import writes keep their separate 200-row limit.
- Public profiles show a load-error message when a request fails. A successful lookup with no profile still shows the not-found message.
- A clean production Chrome visit to `/user/profile001` rendered all 262 ratings and the film rail. The taste requests used 100, 100 and 62 IDs, the longest request target was 4,104 bytes, and all four movie reads returned HTTP 200.

## 2026-11-19 — Preserve warm catalog returns when env is delayed

- The boot loader selects one environment for the document. On a hosted `/env` timeout or network failure, the fallback uses the saved build version for stylesheet and script URLs. A late response does not change the selection for an in-progress startup.
- The hosted fallback never updates the saved build marker or clears snapshots. A confirmed change of build still resets caches and reloads once.
- Released build `6fdecaaf4de327a84293f5f80f5dc2001be0bbfa`, Yandex revision `bbaq08knhf3uuakeh10n`. Full smoke, Docker and all three production route checks passed. The gateway served the prior build for its first two checks and passed the third.
- Production Chrome navigated catalog → movie → Back with browser back/forward cache disabled. With `/env` held for about 15 seconds, the four restored posters stayed visible in all 1,781 sampled frames through application startup and the late response. At mobile width, a simulated different build arriving after the fallback and before the main script kept both poster nodes and the original build. A confirmed mismatch at startup still reloaded once.

## 2026-11-19 — Reveal catalog skeletons during startup

- Catalog HTML shows first-row skeletons as soon as the stylesheet bundle is ready. Startup failures surface inline. Saved catalog cards remain visible through the warm handoff.
- The view switch, result count and top pagination reserve their space before data arrives. The catalog controls wait for an interactive snapshot or the first render.
- Released build `cca66fab5a655f5634975a33aa3a25ff39949ed6`, Yandex revision `bba5gh5mdlmfmtfk64el`. Smoke, Docker and all three production route checks passed. Production Chrome recorded identical first-row poster rectangles before the shared layout, while the movie read was pending, and after render at 1350, 390 and 320 px. A one-result search, page two navigation, warm handoff and cold/warm module failure also passed.
- A separate warm-return test that held `/env` for 15 seconds reproduced an extra document navigation. The fallback requests assets under `dev-local-27`, which trips the stored build-version reset. This remains independent of the skeleton-to-poster handoff.

## 2026-11-19 — Keep restored catalog cards visible through startup

- Runtime hydration reuses matching saved catalog markup already restored by the early bootstrap. A render inside the initial fade preserves the fade's visibility class until its own cleanup.
- If a catalog startup module fails after the styled saved catalog is on screen, the failure message appears above the saved view. The full-screen startup notice remains available for a failed cold start.
- Released build `fbdba919887520b9eb0c473342ba38ba5ac0b191`, Yandex revision `bbaq14d7iaqp2fupvos0`. Full smoke, required Docker smoke and production checks on the gateway, apex and `www` passed. Headless Chrome on production verified that the cached poster node survives startup, an interrupted module load leaves the cached catalog visible, and a re-render preserves visibility during the fade.

## 2026-11-19 — Attribute the slow compact catalog request

- The 13:04:33 UTC browser read took 5088 ms. Chrome reused the connection and received headers after 5068 ms. The request ID matched 5062 ms in the Yandex API Gateway log. The Supabase edge log had one matching full catalog read in the time window with 4680 ms in `response.origin_time`. The remaining 382 ms of gateway time includes the proxy, platform and transport. The original request lacked the opt-in timing header, and there was no matching separate container or PostgREST duration.
- Ten sequential instrumented repeats used the same query and returned 472,170 decoded bytes each. Gateway median/max was 538/1808 ms. Node proxy median/max was 419/1585 ms, with 344/1510 ms waiting for upstream headers and 65/76 ms reading and buffering the response body. The remaining Node work was 1/14 ms. Nine probes matched Supabase origin logs with median/max of 256/458 ms. The slowest probe had no matching Supabase edge entry. Another probe spent 1596 ms on the gateway, 431 ms in Node and 167 ms at the origin. Its Node process had started 597 ms before handling the request, consistent with time spent outside the handler during a fresh instance invocation.

## 2026-11-19 — Defer the review filter summary on cold catalog views

- Cold catalog startup requests the review ID summary after the first render when the effective filters do not include reviews. Review filters restored from URL parameters, quick presets or local storage still wait for the summary in the initial data batch.
- Selecting the filter while the summary is pending keeps the current cards visible until the matching IDs are available. Background completion saves a complete snapshot and preserves the existing cards when the filter is off.
- Released build `d3aecd44f25708149ca1f7c440acf1d98cb8c2eb`, Yandex revision `bbah5nnqsd90jc57hifo`. Full smoke, Docker and three production route checks passed. A Chrome test held the reviews response and verified the first poster, unchanged cards, activation during loading, filter reset, and restores from the explicit parameter, quick preset URL and saved preferences.
- Three fresh-profile Lighthouse 13.6.0 desktop runs per production build without emulated throttling. Median first poster request moved from 5.700 to 4.182 s, first successful poster response from 6.045 to 4.485 s, and first poster `PaintImage` from 6.032 to 4.467 s. Individual paints were 6.032, 7.036 and 4.670 s before and 4.467, 3.887 and 7.318 s after. The same baseline build returned a 4.288 s median in the prior series. The new slow run spent 5.087 s on the initial movie read.
- In every new trace, the single review summary request began 92–95 ms after the first poster request. The poster was painted 239–1110 ms before the review summary finished.

## 2026-11-19 — Reduce the first catalog movies response

- The first catalog read keeps the complete movie list and the fields used by search, filters, ordering, posters and card metadata. It skips the four external links and the genre position values. The server still orders each movie's embedded genres by position.
- After the cards render, one query fills external links for the current page. Results update only the links inside matching cards and are reused on later page visits. The smaller list payload is also used when populating the admin's movie picker. Detail, editor and secondary movie cards continue to receive their existing link fields.
- Released build `bf3d54a07cff5da0f0a6ba1f48d1adbcc0b9aea6`, Yandex revision `bba336h1g8g4sc28heta`. Full smoke, required Docker smoke and all three production route checks passed. The full and trimmed PostgREST reads returned the same 670 rows and preserved every retained value and the genre order. Production Chrome checks matched the previous build's card order, metadata and links for search, date sorting and combined filters. On mobile, opening the panel during the read preserved the expanded state and the poster, page two made one request, and returning to page one reused cached links.
- Three fresh-profile Lighthouse 13.6.0 desktop runs per production build, with no emulated throttling. The first `movies` response went from 651,462 to 472,170 decoded bytes (-27.5%) and the median transfer from 127,342 to 100,750 bytes (-20.9%). The visible-page links read covered 40 IDs, added 2.6 KiB of transfer, and began 90–93 ms after the first poster request. The two movie reads together used 18.8% less transfer.
- First poster `PaintImage` was 4.390, 5.893 and 2.840 s before and 3.141, 4.288 and 7.164 s after. The medians were 4.390 and 4.288 s. Median browser duration of the first `movies` read varied from 1.360 to 2.200 s in the two series. The transfer reduction was consistent across runs, while poster timing varied substantially.
- Six alternating pairs of the full and trimmed GETs against the same production revision gave medians of 437 and 276 ms end to end, respectively. The Node proxy spent 328 and 185 ms in total, including 21 and 16 ms reading and buffering the body. This comparison isolates the requests from the rest of catalog startup.

## 2026-11-19 — Load catalog rating summaries after the first render

- Cold catalog views sorted by release date can render from movie and review data before requesting rating aggregates. Direct or saved rating ranges and rating presets keep the foreground load. A rating filter selected during the background read waits for aggregates, and month-local rating sort becomes available when the aggregate read settles.
- Pending card summaries use a loading label. The completed read fills the visible rating text in place, preserving poster elements and scroll. Complete catalog snapshots and initial rating edits wait for the corresponding rating data, and a late response or queued edit cannot apply to a replacement session.
- Released build `01ec08ef6f71f118c6b823e5456a6abc15dc541a`, Yandex revision `bba0ccp1q9d9ptmrbb80`. Full smoke, required Docker smoke and production gateway, apex and `www` checks passed. A Chrome check with the ratings request held verified an early poster, in-place text updates, month sort readiness, and both newly selected and restored rating filters.
- Replayed three anonymous fresh-profile Lighthouse 13.6.0 desktop runs per production build with no emulated throttling, using `9c1516b` as the immediate baseline. Median first poster request moved from 5.664 s to 3.578 s, first successful image response from 5.958 s to 3.912 s, and first catalog poster `PaintImage` from 5.923 s to 3.886 s. The paint samples were 6.804, 5.923 and 5.410 s before, and 4.561, 2.412 and 3.886 s after. The earlier cold-start series had a 3.938 s median. The end-to-end difference also includes variation before the data requests, whose median start moved from 3.013 s to 1.288 s.
- In all three new traces, `movie_rating_stats` began 96–103 ms after the first poster request, and the browser painted the first poster 270–2301 ms before the aggregate response ended. The first screen still waited for movies and reviews. Movies finished last among the two in all three new runs.

## 2026-11-19 — Trace catalog proxy latency

- Public catalog GETs for `movies` and `movie_rating_stats` can opt into `Server-Timing` by sending `X-Horroreiro-Perf: 1`. The handler reports its wait for Supabase response headers. The Node adapter adds the time to read and buffer the response body, time from Node request entry until the body is ready, and process age at entry. The header carries only durations and is never sent to Supabase. Timing can be joined to Supabase edge logs using a unique `X-Client-Info` probe tag.
- Released runtime `9c1516b226ee928953805427b83b6f473301aa05`, Yandex revision `bbaj1b9m4ru9eqpcmigl`. The local smoke, required Docker smoke, and three production route checks passed. The `www` check retried after a transient 502 on the oversized-body fixture.
- Replayed the two anonymous GETs from the cold catalog trace, with the same projections and page parameters. There were six concurrent pairs per entry point before instrumentation, then eight concurrent and four sequential pairs per entry point afterward. Entry points were the site, native API Gateway domain, private container with IAM, and direct Supabase REST. All 144 reads returned HTTP 200. Joined every read to the Supabase edge log by `X-Client-Info`, and joined the 72 gateway reads to `duration_seconds` in the Monium `__serverless-apigateway__` log by request ID.
- For the 12 instrumented reads per query on the native gateway domain, median/max in milliseconds for `movies` were 847/2622 at the gateway including its integration, 569/2355 while inside the Node proxy, 79/1688 for reading and buffering the body inside the proxy, 165/840 for gateway time outside the Node handler, and 166/2186 for Supabase `response.origin_time`. For `movie_rating_stats` those values were 216/1405, 138/1215, 2/187, 51/190, and 91/1062 respectively. Gateway time outside Node includes container invocation and the response path. Supabase origin time measures the REST backend path as observed by its edge and falls within the complete request.
- The slowest `movies` before instrumentation was 5477 ms client-side, 5357 ms on the gateway, and 3228 ms at the Supabase origin. One instrumented `movies` took 2084 ms on the gateway, 1996 ms in the proxy (1688 ms reading its body), and 155 ms at the Supabase origin. A different sequential `movies` took 2622 ms at the gateway with 2186 ms at the origin. A concurrent `movie_rating_stats` bypassing API Gateway needed 2437 ms to first headers, with 568 ms inside Node, including 356 ms at the Supabase origin. Its Node start was consistent with waiting for the paired `movies` read to finish on a container with concurrency 1. The logs do not isolate platform scheduling, startup and network time from each other.

## 2026-11-19 — Skip the first-visit build reload

- A missing saved build marker records the current build and continues shared startup on the same navigation. An existing different marker still clears the old app snapshots/settings and reloads once, preserving the query string and hash. If storage access fails, startup continues without issuing a reload that could repeat indefinitely.
- The startup contract fixture reproduced the repeated navigation before the fix and now exercises initial registration, version upgrades, redirect URL preservation, and blocked storage.
- Released runtime `b2df5c60eff7130721e84d1baab1d308692a4298`, Yandex revision `bbahfiema935pfrl2336`. Full smoke, required Docker runtime checks and all three production route checks passed.
- Repeated the same three fresh-profile Lighthouse 13.6.0 desktop runs on the published build, with no emulated throttling. The HTML document, `/env` and `app.js` each loaded once per visit instead of twice. Median time from original navigation to the first poster request changed from 6.011 s to 3.676 s, to the first successful poster response from 6.318 s to 4.016 s, and to the first catalog poster `PaintImage` event from 6.319 s to 3.938 s (2.381 s earlier, 38%). Poster paint times were 9.122, 6.319 and 4.518 s before, and 2.903, 7.728 and 3.938 s after. The repeat confirms removal of an entire navigation, while timings still vary with the network and frontend work; the slow after-run included 2.408 s waiting on rating statistics.

## 2026-11-19 — Cold catalog startup baseline

- Three fresh-profile Lighthouse 13.6.0 desktop runs against production build `a20eeae`, with no emulated throttling. Times are from the original navigation in each run. The first catalog poster request started at 8.81, 6.01 and 4.20 seconds. The first successful poster response finished at 9.15, 6.32 and 4.54 seconds. Lighthouse's LCP candidate was boot-screen text, so its approximately 0.47–0.48 second score does not represent catalog visibility.
- Every run issued a second HTML navigation at 3.72, 2.15 and 1.52 seconds respectively. `applyBuildVersionSoftResetIfNeeded` treats an absent saved build version as a mismatch and `initSharedApp` calls `location.replace`. The repeated document and bootstrap downloads transferred about 156 KiB each time, excluding fonts and analytics. After the final CSS responses, the document loader reached the end of `app.js` download in 240–279 ms. The shared and catalog import waves plus initialization took another 345–359 ms before the first data batch.
- The first-screen data gate waits for three parallel requests. Browser durations across the three runs were 1.68–2.54 s for `movies` (about 124 KiB transferred), 1.08–4.16 s for `movie_rating_stats` and 0.95–1.98 s for `movie_reviews`. The movie read finished last twice, and rating stats once. The first poster request followed the last data response by 60–452 ms. Fonts and analytics are outside this explicit startup gate.
- Two separately timed GETs per path using the captured public REST projections also showed an overhead outside SQL: `movies` took 1.55–3.29 s via the site and 0.52–0.97 s directly. Grouped historical Postgres means were 212.59 ms for the ordered movie query family, 19.64 ms for rating statistics and 19.09 ms for review IDs. These are not per-request traces of the Lighthouse runs and do not isolate the cause of transport variance.
- Prioritize removing the first-visit reset/reload, then remeasure the same startup path. Afterward, attribute the catalog data budget between the proxy/upstream request and Postgres, and check which summary fields must wait before render. No production code or configuration changes were made in this measurement.

## 2026-11-19 — Catalog galleries follow pagination

- Catalog data loading no longer downloads galleries for the complete movie dataset. Russian-poster reads are limited to missing movies from the rendered page, including preference changes. Known empty galleries are cached and use the main poster. The same gallery cache still serves detail/admin and other pages.
- Catalog cards keep their size while uncached poster data loads and update the poster media in place. Warm snapshots retain their displayed posters pending revalidation. Older page/session responses cannot repaint a replacement view, and pending placeholders are excluded from saved DOM.
- A 670-movie fixture measured one 40-ID gallery request on first opening and one 40-ID request on the next page. Returning to a loaded page or browsing with the preference disabled made zero gallery requests. Tests also exercise in-flight deduplication, late responses, fallback and retry, and forced refresh overriding an earlier request.
- The full catalog in a browser used the real Supabase SDK against an isolated HTTP fixture with a Russian-poster profile. The server recorded exactly two gallery GETs for page 1 → page 2 → page 1, each with 40 distinct IDs; the return loaded from memory. Both pages displayed the correct Russian poster sources. Full smoke and required Docker runtime checks passed.
- Released runtime `a20eeae629c45992019fb288beec8705e38a8b8f`, Yandex revision `bbaj7j8arlqv3e6k1qf2`. Gateway, apex and www passed on the first attempt. Production browser verified the exact build and guest pagination with 40 cards per page and no captured warnings/errors. The real Supabase route accepted the gallery projection and ordering in a one-row public read. The signed-in request counts were verified with the isolated fixture.

## 2026-11-19 — Read startup stylesheets once per visit

- Hosted boot fetches each selected CSS file once, validates its response and uses those same bytes for the active styles and same-tab warm-start cache. Fresh styles replace the cached styles in cascade order when the complete bundle is ready. Retry, cached fallback and native links on `file:` are retained.
- The boot fixture measured four stylesheet loads before and two after on catalog startup. The saved bytes are the size of one copy of each selected stylesheet per HTTP visit. Page styles use self-contained CSS or absolute/resource-root URLs, checked in smoke. No route, database or HTTP cache-policy changes.
- Full smoke and required Docker runtime checks passed. Local browser reached app-ready on catalog, movie and catalog return with the expected styles and 40 rendered catalog cards. The unconfigured local legacy SEO handler used its static-shell fallback on the movie route. The browser hydrated that shell.
- Measured the next poster-loading candidate without changing it. Production has 670 movies and 980 gallery rows across 410 movies. With the Russian-poster preference enabled, a cold catalog requests all 670 IDs in four batches of up to 200, although its first page has 40 cards. Current historical poster-query samples reported zero shared-buffer reads, so the immediate opportunity is request count and startup transfer, rather than a demonstrated Disk IO problem.
- Released runtime `7aa43a0d478409e1589638ff2b242d923466fdb4`, Yandex revision `bbajfc44f2htq7sailg6`. Gateway, apex and www smoke checks passed on the first attempt. Production browser verified the exact build, matching styles on catalog and movie pages, and 40 catalog cards after Back with no captured warnings/errors.

## 2026-11-19 — Notification polling and Supabase Disk IO measurement

- Read-only production measurement at 14:02:25–14:06:29 Moscow time. The scheduled baseline is 60 unread-count requests per continuous visible signed-in tab-hour and 60 additional metadata requests on an open notifications page. Returning to a visible notification tab and loading new cards can add requests. No polling runs for a guest or in a hidden tab.
- In that 244-second window, `pg_stat_statements` recorded two PostgREST unread count calls (1.607 ms total, 176 shared buffer hits, zero shared reads, dirtied blocks or temp blocks). No PostgREST metadata-only feed query appeared, so the observed window does not establish real feed polling volume. The main unread-count shape had 9,164 cumulative calls and zero shared reads or temp blocks. Its statistics predate this release. Database-wide temporary writes rose by 48.7 MiB in the window, which also includes diagnostic queries.
- Production `EXPLAIN (ANALYZE, BUFFERS)` of the equivalent reads selected the existing partial unread index and recipient/creation-time index. The 80-row feed subplans used 21–25 shared buffer hits, zero shared reads, and about 1.8 ms. The count subplan for a recipient with 261 unread rows used 50 buffer hits, zero shared reads, and 2.5 ms. This measures the SQL subplans on warm buffers, without PostgREST/RLS overhead. The deliveries table held 5,649 rows across 58 recipients and occupied 1.42 MiB including indexes.
- Infrastructure showed a minimum Disk IO balance of 66% for Nov 12–19. IOPS and throughput charts did not load, so host rates were checked through the Metrics API. Two scrape intervals showed approximately 8.3–8.5% CPU I/O wait, about 411–415 MiB swap in use and active swap-in/out. Counters are host-wide and cannot assign Disk IO budget spend to SQL or to a device's workload. The overlapping SQL sample shows that this I/O was observable with almost no notification reads. The results do not justify changing notification polling, indexes or compute for this feature. Compare statement deltas and the budget again over a representative traffic window.

## 2026-11-19 — Live notifications feed

- The notifications page uses the account header's visible-tab refresh tick. It reads metadata for the latest 80 deliveries and loads event and card details only for new delivery IDs. Preferences, profile snippets and digest posters for existing cards are reused between ticks.
- Background updates patch the existing feed, preserve the active filter, keep existing card nodes and hold the viewport on the same visible card. Transient refresh errors retain the last feed. Account transitions invalidate outstanding feed requests and clear the previous viewer's UI immediately.
- A confirmed local read or bulk mutation invalidates older feed reads. Individual read requests are deduplicated and only decrement the shared badge when the write actually updates a delivery. Stale notification actions cannot publish results into a replacement viewer.
- Full smoke and required Docker runtime checks passed. A local browser fixture with the real header timer and feed controller verified new cards, a metadata-only unchanged tick, preserved filter/focus/scroll, remote and local read receipts, temporary network failure and a late response after logout and return to the same account. It used synthetic notification data.
- Released runtime `d98f022026dfde9616c3868c926f0c19873c43ea`, Yandex revision `bbajju48juv5jffaoq4l`. Gateway, apex and www smoke checks passed on the first attempt. The production browser verified the exact version and the normal guest sign-in gate with no captured warnings/errors. The deployed notifications module matched the release source.

## 2026-11-19 — Account menu and header ownership

- `account-header-controller.js` owns the account button, menu and links, header identity, unread badges, catalog add button, menu action states and event bindings. It loads during shared initialization. `app.js` connects routes, session/profile state, notification counts and the existing admin and import operations. The auth UI controller still performs logout.
- An accepted viewer change closes the old menu and publishes the new header state before profile and follow reads finish. The initial pending state remains until shared auth UI synchronization. Avatar changes preserve the badge element.
- Unread counts and cached requests reset on viewer changes. Only the active count request can publish its result or clear the in-flight reference. Added smoke coverage for guest, admin and regular viewer transitions, menu/link behavior, file picker dispatch, unread count deduplication and a late response after returning to the same user ID.
- The header refreshes unread counts every 60 seconds for signed-in viewers in visible tabs and checks the cache when a hidden tab becomes visible again. Guests and hidden tabs have no active timer. Scheduled reads reuse the existing count endpoint and skip a request already in flight.
- Full smoke and required Docker runtime checks passed. The focused fixture advances the timer, resolves the real client count logic against a fake response and observes the new badge without remounting the header. Local browser verified opening the login form from the guest header with no captured warnings/errors.
- Released runtime `a1907204b8362a22524018bebb01efc273bb7ad3`, Yandex revision `bbatqmksbfveqnhii36m`. Gateway, apex and www smoke checks passed on the first attempt. Production browser verified the exact asset version, the guest badge hidden, opening and closing the login form, and no captured console warnings/errors. The deployed header module matched the release source. Authenticated notification arrivals were exercised with the fixture.

## 2026-11-19 — Auth form and redirect ownership

- `auth-ui-controller.js` owns login, registration and password-recovery DOM/events, modes, messages, busy state, field clearing, SDK submissions and confirmation/recovery URL handling. `app.js` keeps shared account controls, modal/Escape/scroll coordination and current identity/role/profile; callers use operation wrappers and read the controller's live recovery/open state. The new owner loads during shared initialization from the client asset inventory.
- Shared initialization captures the original URL before awaiting imports: the SDK can consume an implicit auth hash while the modules load. Parsing and cleanup stay inside the UI owner. Existing Auth methods, payloads, timeouts, storage keys, validation and non-enumerating feedback are preserved; no schema, RLS or dependency changes.
- Form operations reject obsolete availability results, feedback, focus and delayed closes after close/mode/reopen; invalidation releases busy controls while an old finally cannot unlock a newer request. Recovery reads/update and deferred local signout also check the auth-session scope. The coordinator distinguishes replacement sign-ins from unchanged session reannouncements/token refresh, including same-account replacements, without reloading collections for refocus.
- Added isolated auth UI fixtures for validation, failed/successful/retried submissions, nickname availability cancellation, old/new busy state, recovery session fallback and replacement, own cleanup, redirect variants/errors/initial-URL snapshots, URL cleanup and one-time confirmation tracking. No real email, password or account writes are used by these fixtures.
- Full smoke, required Docker build/runtime smoke and production dependency audit passed (0 vulnerabilities). Inverting the UI operation guard made the focused test fail. Independent review identified the early URL snapshot and unchanged-session reannouncement cases; both are implemented and covered. Local browser verified the catalog at app-ready, login/register switching, empty-email reset validation and Escape/body-scroll restoration with no captured warnings/errors. SDK writes were exercised only in isolated fixtures; no real credentials or email sends.
- Released runtime `1ede7bd191ec01ee2d613d564075900b7bb58a22`, Yandex revision `bbatdar9oe1b5cefsod4`. Release preflight, portable/full/deploy-output checks passed; gateway/apex/www external smokes passed on attempt 1. Production browser verified that exact build, 670 catalog movies, login/register switching, empty-email reset feedback, Escape/scroll restoration and a clean reopen with no captured warnings/errors. The deployed UI module returned 200 and matched the release source (normalized SHA-256 `d0ede9c40714a70d76b81d20427b914dfbc76cf1a055b32373b5e5fb47e86e39`). Screenshot: `C:/Temp/horroreiro-auth-ui-owner.jpg`. No production sign-in, email, password or account writes were performed during verification.

## 2026-11-19 — Auth session coordination ownership

- `auth-session-controller.js` owns the single Supabase auth subscription, request generations, coordinated session restoration, deferred profile/collection refresh and page callbacks. `app.js` supplies synchronous identity/index invalidation and a guarded role/follow/UI load operation; normal login, registration and recovery form/redirect helpers retain their owners. The controller loads beside profile utilities during shared initialization and is declared in the shared asset inventory.
- The previous event callback applied a queued old identity before checking its request ID. A focused reproduction observed an obsolete queued sign-in restoring a departed viewer. Accepted identity changes now invalidate older work immediately; old initial-session success/errors cannot undo a newer event. Concurrent restorations wait for the latest data-read phase, separately from page callbacks, so the director page's nested restore cannot await itself.
- Recovery events invalidate pending normal work and clear normal identity before opening the recovery form or deferring foreign-session cleanup. Superseded cleanup is skipped. Binding a page callback after initial data loading replays a missed current-generation refresh once; unchanged-user sign-in/refocus and token refresh still skip collection reloads.
- Role, ratings aggregate/fallback, personal ratings and watchlist loaders check the captured auth generation at publication. This rejects A-to-other/exit-to-A completions that an ID-only check would accept. Follow membership keeps its existing viewer/read/mutation owner. Role/profile state clears on identity changes, before asynchronous profile reads. No SDK upgrade, auth methods, storage keys, server authorization, schema or RLS changes.
- Added deterministic auth fixtures for queued transitions, old initial success/error, concurrent reads, same-ID return, recovery isolation, superseded cleanup, late page binding and nested restore. Extended complete-collection fixtures across all four rating/watchlist publication paths and adapted role fixtures. Independent review found the publication and nested-restore/late-binding risks; implemented checks cover those cases.
- Full smoke, required Docker build/runtime smoke and production-dependency audit passed (0 vulnerabilities). Inverting the coordinator's generation guard made the focused auth test fail. Local browser verified 670 catalog movies, opening/closing the login form, movie detail and the director page with no captured warnings/errors. SDK calls, sign-in/out and recovery transitions were exercised only with isolated fixtures; no real credentials or user data were changed.
- The ad-hoc local server had no server Supabase environment: its legacy movie SEO handler logged that configuration error and fell back to the static shell, which the browser hydrated successfully. This was not an auth coordinator failure; configured portable/Docker checks passed.
- Released runtime `e76345a3fb2a60941814a16cf7a8659748f32bb7`, Yandex revision `bbauld08k7muhhnt28ro`. Release preflight, portable/full/deploy-output checks passed; gateway/apex external smokes passed on attempt 1 and www passed on attempt 2 after one 502 instead of the expected 413 for an oversized-body diagnostic. The transient cause remains undiagnosed. Production browser confirmed that exact build, 670 catalog movies and the login modal at app-ready with no captured warnings/errors; the deployed auth module returned 200 and matched the release source. Screenshot: `C:/Temp/horroreiro-auth-session-owner.png`. No production sign-in/out, password or content writes were performed.

## 2026-11-19 — Profile settings UI ownership

- Added on-demand `profile-settings-controller.js` as the owner of settings fields, messages, busy flags, name/poster/password submission, avatar selection/crop geometry, object URL lifecycle and event bindings. `app.js` retains the lazy entry, current auth/profile identity and one captured-user patch/cache/rerender bridge; it no longer manages these forms or crop state. The controller is registered in the shared asset inventory, without adding it to initial page loads.
- The controller observes account transitions, closes its dialogs, clears password fields and rejects old async completions before subsequent writes, UI feedback or local patches. Settings actions validate the captured profile user before Storage/Auth/profile writes and again between nickname availability, Auth metadata and profile updates. Existing validation, optional-column feedback, canvas output and server RLS remain in force.
- Ambiguous avatar profile-write failures retain the uploaded file: the database may already reference it. Old avatar deletion remains after a confirmed replacement/clear only. Failure paths release busy controls and keep crop state available for retry; obsolete image metadata loads revoke their object URLs without reopening a cancelled crop.
- Added isolated controller/action coverage for name validation/success/retry, module-local events, shared-modal-only avatar preview, account switches during lazy actions and password verification, crop zoom/drag bounds and 256px JPEG output, and ambiguous avatar failure/retry. The action fixture first reproduced a nickname availability response writing Auth metadata for a replacement account. No schema or production user data changes.
- Full smoke and required Docker build/runtime smoke passed. Inverting the action's captured-user guard made the focused test fail. An isolated browser harness using the real shared layout, profile CSS and controller verified nickname/poster success, empty-password validation, offline feedback and enabled retry, without contacting Supabase. Screenshot: `C:/Temp/horroreiro-profile-settings-check.png`. `app.js` decreased from 583,874 to 550,383 raw bytes (118,117 to 111,808 gzip); the new settings controller loads only on open. No new runtime dependency or initial page request.
- Released runtime `3579a48de353b643a0392e80f2bc3eae2c3c9418`, Yandex revision `bbajbjv7dfank8tse72v`. Release preflight, portable/full/deploy-output checks passed; gateway/apex/www external smokes passed on attempt 1. Production browser verified that exact build and public profile identity/stats/rails at app-ready with no captured warnings/errors. The deployed controller returned 200 and matched the release source (normalized-line-ending SHA-256 `63f9edbde70505d70b783b3688bece874b00c16605f151cb840dcedf7ebbbbe6`). Production passwords, profile settings and avatar files were not changed during verification; writes used isolated fixtures.

## 2026-11-19 — Shared profile cache and follow state ownership

- `profile-data-actions.js` owns the public profile ID/handle indexes, cache merging, cached reads and confirmed settings patches. Removed the app-owned Maps and the cache mutator from pure `profile-utils.js`. Pending public reads merge missing fields without overwriting newer cached identity patches; missing/error results are not cached.
- `profile-follow-actions.js` owns followed-profile membership and the captured-viewer write operation. Reads publish only into the same viewer state and latest request, and cannot undo a newer confirmed follow/unfollow. Account transitions reset the module's state; failed refreshes preserve confirmed membership. Removed app/page Set setters and the public raw follow/unfollow write entry points.
- `/following` captures the actor before lazy action loading, rejects obsolete page loads and previous-viewer feedback, scopes busy guards by viewer, and binds auth refresh before the first pending read. The shared current-role read also rejects departed-viewer success/error completions. Auth's current role/profile, shared settings UI and writes remain app-owned; no schema, RLS or server authorization changes.
- Added focused behavioral coverage in `tools/profile-state-smoke.mjs` and adapted the existing actual app follow bridge fixture to use the module owner. Covers ID/handle cache sharing, settings patches, retries, viewer changes during reads/writes, read-after-write ordering, logout, anonymous page gates and lazy actions.
- Full smoke and required Docker runtime smoke passed. Local browser verified public profile data, anonymous follow login feedback and the `/following` login gate; the local ranks endpoint reported its expected missing server configuration. Inverting the follow actor guard made the focused test fail; restored source passed the full suite. No production user data was changed.
- Released runtime `3962584a37aa66a535c4f2e8bbca6a205be783d4`, Yandex revision `bbak22c58q0vlgkgampb`. Release preflight, portable/full/deploy-output checks passed; gateway/apex/www external smokes passed on attempt 1. Production browser confirmed that exact build, profile identity/stats/rails, anonymous follow login feedback, `/following` login gate, and movie/back navigation with retained profile data through warm restoration and final app-ready. No captured production console warnings/errors. Screenshot: `C:/Temp/horroreiro-profile-shared-state.png`. Real settings/follow/preference writes were checked only in isolated fixtures.
- Local Docker diagnosis found WSL's `msrdc.exe /wslg` client matching the supplied ActiveX/RemoteApp dialogs on Windows 10. Only `docker-desktop` is installed and no containers were running. Created `C:/Users/Grint/.wslconfig` with `[wsl2] guiApplications=false`, restarted Docker/WSL, and closed only orphaned `/wslg` RDP clients. The existing production image ran a Node self-check successfully; WSLg clients did not recur after a second Docker restart and the site's real Docker build/runtime smoke. This disables Linux GUI apps in WSL, not the Windows Docker Desktop UI; undo by removing the setting and restarting WSL. No DLL/registry edits, image/volume removal or production configuration changes.

## 2026-11-17 — Profile page state ownership

- `user-page.js` owns the displayed profile identity, follow request guards, rank tooltip state and events, own-profile title/settings visibility and identity/avatar updates. Removed the corresponding app-level state, render callbacks and global event dispatch. Route parsing now lives in the module: isolated initialization exposed its implicit dependency on the global `app.js` function.
- Shared auth/profile caches and followed-profile membership remain with the shared app owner. A narrow follow write bridge captures the requesting viewer and changes shared membership only while that viewer remains current. Page request guards are keyed by viewer and target; previous-viewer completions do not publish feedback into a new session.
- Profile reads share one load path and reject stale viewer/route/load completions before rendering or caching. Updating own settings can patch only the displayed own profile. Shared avatar preview updates are limited to the settings modal, so they cannot overwrite another profile's avatar.
- Added isolated user-page state smoke coverage for module-only initialization, own/other identity/avatar updates, duplicate/failing follows and retry, viewer changes before/after actual bridge writes, viewer changes during lookup/activity reads, out-of-order loads, tooltip keyboard/scroll lifecycle and retained cache state. Auth refresh is registered before the first profile read, so a change during initial loading cannot be missed. No schema, RLS or server authorization behavior changed; shared rails, admin password operations and settings writes keep their existing owners.
- Released runtime `6e3545ff8be5ca74499fd318269234dc3c131238`, Yandex revision `bbajh7b9uord7lmg89qp`. Release preflight, portable/full/deploy-output checks passed; gateway/apex/www external smokes passed on attempt 1. Production browser confirmed the exact build, public profile data, rank tooltip Enter/Escape behavior, the anonymous follow login gate, and movie navigation/back with retained profile data. Screenshot: `C:/Temp/horroreiro-profile-state-owner.png`. The first rank request returned server `fetch failed`; a reload recovered the ranks, and the transient cause remains undiagnosed. No production user data was changed; settings/follow writes and identity races were verified in isolated fixtures.

## 2026-11-16 — Single client asset inventory

- `client-assets.js` is the explicit JS/CSS/HTML publish inventory used by the portable runtime, versioned Cloudflare asset handler, size report, syntax/security/documentation checks and generated cache headers. New feature assets no longer require copying their names between those lists; private/server files remain outside the public allowlist.
- `_headers` keeps a generated client section. Run `node tools/sync-client-headers.mjs` after changing the registry; normal smoke verifies that the generated block is current and fails on drift. No extra client request, bundler or runtime dependency was added.
- Asset registry smoke checks every declared direct/versioned asset through the real runtime, private-path rejection, loader references, and generated headers. Startup profiles in the size report remain explicit measurements of page loading, separate from the publish inventory.
- Released both this inventory change and the explicit-operation change below as runtime `d0e51a53481a2849d3ba8ce3a24a36b8c1eee11a`, Yandex revision `bba5cm04r8qsjiutldue`. Preflight, portable/full/deploy-output checks passed; gateway/apex/www external smokes passed on attempt 1. Production browser verified that exact build, catalog filtering/month view/rating sorting, movie detail with a real review, public profile statistics, and return to the same 133-result month view at app-ready without captured production warnings/errors. Screenshot: `C:/Temp/horroreiro-module-contracts.png`. Production user data was not changed; writes, missing adapters and failures were checked in isolated fixtures.

## 2026-11-16 — Explicit module operations

- Removed fallback implementations for injected domain operations in client controller/action factories. The real app already supplies these callbacks; a missing adapter must raise an integration error instead of inventing empty collections, zero ratings, unescaped HTML, or a successful no-op. Kept platform/configuration defaults and genuinely optional cache diagnostics/column notifications.
- Rating/watchlist writes, duplicate-request sets, snapshot synchronization and rerenders are required operations. Missing write adapters follow the existing error path without success feedback or advancing snapshots; request guards are released. Movie detail initialization and core rendering/session/data adapters no longer silently skip missing bindings. Optional feedback/error hooks and shell-ready notifications remain optional.
- `tools/module-contract-smoke.mjs` first reproduced missing write adapters reporting success and now guards the failure path, required catalog rating/formatting adapters, movie initialization, and session validation before avatar Storage writes. Existing mutation fixtures now provide the actual request-set/rerender contract.
- Startup now requires the already loaded SharedLayout and page runtime; the old optional mount/legacy-init fallback can no longer mark a partially initialized shell ready. Contract smoke covers both missing startup dependencies.
- Final source-wide context scan also removed optional rating/year/user-state/review-index providers from catalog filters and fake empty catalog/relation providers from admin audit tools. Contract smoke guards all four filter paths and the audit provider boundary, with a positive real-rating filter check.
- Movie editor method bindings now also require actual create/update handlers, submit state, session validation, classification/slug/relation providers, and post-commit cache/UI operations. A missing session validator previously reached the movie RPC in the fixture; it now stops before any write. Tests cover missing form-submit adapters and the confirmed post-commit mutation/refresh order while preserving explicit optional status feedback.
- Final follow-up released as runtime `f2005825cd8a720934a6c2bebcfd91ad6a2e2aaf`, revision `bbapd3on5ml2ac054mu7`. Preflight, portable/full/deploy-output checks passed again; gateway/apex/www external smokes passed on attempt 1. Browser confirmed the exact build, retained reviewed-month catalog, and the real 7+ rating filter (30 results), with no captured production warnings/errors. Screenshot updated at `C:/Temp/horroreiro-module-contracts.png`; no production content was edited.

## 2026-11-16 — Nonblocking fonts and catalog access release

- All ten shells load external font CSS with nonmatching media; the shared boot loader activates it after load (including already cached styles). A failed/slow font host no longer blocks the parser before application startup. Tests cover delayed and cached font styles, alongside the same-origin API/SDK checks below.
- Continued the catalog startup/network recovery started on 2026-11-15. The affected reader reports all three desktop browsers failing on Beeline Wi-Fi while Safari on the same Wi-Fi works. This does not establish a provider-wide block. The release removes CDN SDK and direct browser REST/Auth dependencies from the critical path; actual confirmation on that PC is still needed.
- Released runtime `37a15909da23fb20fba9d058dea5919795f86e56`, active Yandex revision `bbaurqr5i41dbi9h2gqt`. Release preflight, portable/full/deploy-output smokes passed; gateway/apex/www checks passed on attempt 1, including the local SDK and real REST/Auth requests with explicit site Origin. The first release attempt stopped before deployment because Docker was off; after starting the installed engine, the normal release completed.
- Production browser verified that exact app build, the same-origin SDK, activated fonts, 670 catalog movies (40 rendered cards), the supplied movie detail URL, and return to the catalog at app-ready with no captured console warnings/errors. Screenshot: `C:/Temp/horroreiro-catalog-recovery.png`. Real user ratings were not changed; the cold catalog write/failure path was verified in isolated smoke fixtures. The affected reader's desktop/VPN behavior remains unverified.

## 2026-11-15 — Catalog startup and rating failure recovery

- Fixed both direct `requestAnimationFrame(syncOpenExternalLinksLayouts)` registrations. The browser timestamp was being treated as a DOM root on warm catalog restore and expanded-card rerender, throwing `rootElement.querySelectorAll is not a function`. Frame wrappers now call the layout function with its intended default root.
- Failed rating/watchlist writes now show an error message rather than only logging to the console. Failed writes retain previous local state and release the request guard for a retry.
- `tools/catalog-return-smoke.mjs` reproduces the original error using numeric browser timestamps in both actual caller functions. It also exercises the actual cold catalog lazy rating entry/write bridge without detail modules, including a failed write and visible error feedback. Focused smoke passes; network access investigation continues separately.
- Removed the blocking third-party Supabase SDK script from all ten HTML shells. The shared loader now loads the unmodified, pinned SDK 2.119.0 from the site's own origin before app startup; it matches the version the old floating CDN URL returned during investigation. The versioned asset is immutable and checksum-verified; the size report now counts this previously external dependency.
- Added a bounded same-origin REST/Auth transport through the existing portable runtime/Cloudflare handler layout. It preserves the SDK's original URL/session key, public API key and caller JWT, forwards no site cookies or service-role key, refuses credentialed redirects, and returns no-store responses without Set-Cookie/CORS. File/localhost previews and Storage/Realtime remain direct. The reported Supabase connection reset supports removing direct browser API dependence, but does not establish the affected user's provider/root network cause.
- Added isolated transport/security/SDK smoke checks and real deployed read-only checks for public movies and Auth settings (with explicit Origin). No user data, schema, RLS, DNS or provider settings were changed. Browser/release verification is recorded in the 2026-11-16 entry above.
- Independent review caught the existing Letterboxd importer sending all ratings in one request, exceeding the new bounded transport at about 600 ratings. Import writes now use existing 200-ID chunks, apply confirmed batches locally and sync UI even if a later batch fails. A partial failure explains how to retry; duplicate-safe inserts preserve existing ratings. The smoke covers all 670 catalog-sized fixtures and a failed second batch followed by a safe retry.

## 2026-11-15 — Social module state ownership

- Moved review/comment row ownership and social table-availability flags fully into `movie-social.js`. Removed app-level duplicates, getter/setter bridges, context synchronization and its export wrappers. Auth, role, current movie and author ratings are read from their owners when needed.
- Detail cache uses scoped social snapshots. A restored entry stays pending only until the lazy social controller accepts it, preserving warm rendering and cache signatures before the module loads. Review mutations report their result through one callback; catalog index/snapshot updates stay with the catalog owner. Notifications keep their own snippet-availability flag.
- Added focused behavioral smoke coverage for snapshot replacement/handoff and unchanged detail-cache signatures, module fetches, live identity/role/ratings, unavailable comment tables, and the real review-delete event through catalog notification/cache persistence. Adapted existing comment-thread and catalog-return fixtures to the new boundary. Full smoke and independent review passed; local browser verified public empty social sections, a real review/author rating, catalog filter return (133 reviewed movies), and repeat movie opening without captured warnings/errors. The social context was reduced from 39 dependencies to 26; no new runtime dependency or asset was added.
- Runtime `5752dd955324c312d893bf072d2fe84a224b788d`, Yandex revision `bbacu6o72nolvpb15629`: release preflight, portable/full/deploy-output smokes and gateway/apex/www external checks passed (all external checks on attempt 1). Production browser verified that exact app build, a real review and author rating, empty comments, and a reload through the warm shell into the same social content without captured warnings/errors. Screenshot: `C:/Temp/horroreiro-social-state-ownership.png`. No production user content was changed during verification; mutation coverage used the isolated smoke fixture.

## 2026-11-15 — Director punctuation on movie detail pages

- Removed whitespace inside/between the linked director templates that HTML collapsed into visible spaces before commas. Separators remain comma + one space; names, escaping, links and stored data are unchanged.
- Checked the actual formatter with two linked directors: visible text changed from `First , Second` to `First, Second`. Release preflight, portable/full/deploy-output smokes and gateway/apex/www checks passed for runtime `9d902d3aa3b45af58777148cf7e855517ca157d3`, Yandex revision `bba709vtf2hgueaj786b`. The www smoke passed on retry after a transport fetch failure. Browser verification of that deployed build on `/movie/svezhee-myaso-2026` confirmed 14 linked directors and no whitespace before commas; screenshot saved at `C:/Temp/horroreiro-director-spacing.png`.

## 2026-11-15 — Align early and full catalog scroll restoration

- Browser verification of `e2cfca2` showed the early snapshot aligning the first card to the viewport top, then the browser restoring a different exact scroll offset after startup (observed 68–80 px jump). Both early and full-app restorers now prefer a saved finite nonnegative offset; the card anchor is a fallback when that offset is missing/invalid. Missing position no longer becomes zero through `Number(null)`. User-intent cancellation remains intact.
- `tools/catalog-return-smoke.mjs` runs both actual restorers, covering exact offset with an anchor, anchor-only fallback, and no stored position.
- `e2cfca22993edf0a41003d1192d8a44bf7253af6` / Yandex revision `bbakjsmqb4m1bg1ne138` passed release preflight, portable/full/deploy-output smokes and gateway/apex/www checks on attempt 1. Browser restored 40 cards on page 2 (41–80 of 670), and search “Астрал” (19 results), through the early warm bootstrap and then app-ready, with no captured warnings/errors.
- Telegram remains unresolved: correct-account console access confirmed Cloud Logging is unavailable, matching the official status board's missing logs for API Gateway/Serverless Containers. See `docs/TELEGRAM_PREVIEW_DIAGNOSTICS.md` for evidence, request IDs, cache caveat and a prepared support request. Nothing was sent to support.
- Final runtime `e2b192c6c6480fa91ebed41028bcce299d8e1939`, revision `bba80gcno0gaijlhhu3m`: preflight, portable/full/deploy-output smokes passed. Gateway smoke passed attempt 3 after two transport fetch failures on different routes; apex/www passed attempt 1. The failures were not diagnosed as rollout or application failures. Browser verified the deployed version: early warm and final app-ready offsets both 3069 px, retained “Астрал” / 19 results, no captured console warnings/errors. Missing, blank, invalid, negative and infinite offsets fall back safely; explicit zero remains valid.
- The owner supplied Telegram bug comment `https://bugs.telegram.org/c/61650/33`; it documents a query-URL workaround for another site, not a confirmed root cause for Horroreiro. Added this distinction to diagnostics. The support form was prepared with exact text saved at `C:/Temp/horroreiro-yandex-support-draft.txt`; the owner explicitly requested leaving it as a draft. No ticket/message was sent.

## 2026-11-15 — Catalog return snapshot correctness and preview diagnosis

- Rating/watchlist and review mutations validate the existing catalog data snapshot before advancing the global mutation stamp, then patch and save it with the new stamp. Expired or previously invalidated snapshots are discarded. Failed writes leave snapshots unchanged.
- Catalog DOM snapshots now carry the mutation stamp required by the early warm bootstrap. Their data hash and control signature (including profile activity selection, matched movie IDs and displayed ratings) must match a recorded completed render, preventing background data and pending filter changes from relabelling old cards. Identical refreshes can retain the existing DOM despite internal data-version invalidation.
- Deferred user-state persistence happens after card updates. When leaving without native bfcache, any remaining pending list render completes before the immediate snapshot; the expanded external-links card is retained. Normal navigation preserves existing filters, pagination and scroll behavior, without extending the 30-minute snapshot limit.
- Movie HTML now declares `Vary: User-Agent` for both browser and crawler representations. Portable tests verify initial Telegram Open Graph HTML without JavaScript and retain baseline JPEG checks. This header fix is not evidence that Telegram previews are resolved.
- `tools/catalog-return-smoke.mjs` (normal smoke) covers successful/failed mutations, invalid/expired snapshots, render provenance, stale idle writes, departure handling, expanded links and actual early warm bootstrap.
- Preview diagnosis: the supplied movie URL returns 200 with initial OG metadata and a 1200x630 baseline JPEG. The user confirmed fresh movie, static diagnostic and gateway links hang in Telegram while telegram.org previews work. Production HEAD Content-Length is zero even on direct authenticated container invocation; local Node returns the correct length, isolating that difference to hosting, without establishing Telegram causality. Logging CLI and REST returned Unavailable/503; console investigation is pending. No hosting-plan or schema changes.

## 2026-11-15 — Complete catalog and profile collections

- Catalog movies, rating aggregates/fallback rows, current-user ratings/watchlist, review summaries, profile-filtered catalog collections, profile activity, and the Letterboxd match index now use complete paged reads with a unique ordering key. The existing 1000-row API cap is unchanged; collections below the cap still take one request.
- Reused `fetchAllSupabaseRows`; `fetchAllSupabaseRowsResult` adapts it to existing `{data,error}` consumers without publishing a partial result. Errors preserve the last complete rating/watchlist/review-summary state. Paged personal reads capture the user ID and discard results after an account change.
- Movie-by-ID lookups for profile taste/rails and notifications split IDs into existing-sized 200-ID batches. Optional-column retries and cache updates apply to the complete batch, preventing truncated data and oversized query URLs.
- Live baseline: 1963 ratings; an anonymous REST read returned `0-999/1963` (1000 rows), with 963 more on the next page. No schema, API cap, hosting-plan, or production data changes.
- `tools/collection-reads-smoke.mjs` (included in normal smoke) covers 0/1000/2000/2501 boundaries, tied sort values, profile counts, large ID lookups/import index, late-page failure, and account switching.
- Verification: full smoke and focused collection smoke passed. The actual shared loader fetched all 1963 public rating rows in two REST pages, matching the server count with no duplicate user/movie pairs. Review also checked the enforced 200-ID bound, optional-column retries, and failure before cache publication. Per-movie social feeds and the local-only ranking fallback remain separate work.
- Production runtime `73447c23ba0fd826e6b6dd60cb0c0249e99cc4e9`, Yandex revision `bbaerc7agplcvmqupn4h`: normal preflight/portable/full/deploy-output checks passed; gateway switched to the expected version on retry 3, apex/www passed on attempt 1. Deployed profile module uses paged reads. Browser catalog showed 40 of 670; public profile counters matched SQL (257 ratings, 6 active watchlist, 47 reviews), with no console errors. Repository dev/main synchronized; database remained read-only throughout this slice.

## 2026-11-15 — Atomic movie editor saves

- Movie creation/updates and manual-similar edits use `horroreiro_save_movie`: fields, director trigger, companies, genres/countries, reciprocal similar links, and gallery rows commit together. No client delete-then-insert fallback remains in these save paths.
- Create retries retain the generated movie ID; repeating a committed create returns the existing movie. Pending uploads are reused per File. Refresh errors after commit report that the movie was saved.
- Storage uploads precede SQL. Old/unattached objects are retained because deleting after an ambiguous response could remove a live poster; cleanup needs a separate reference-aware workflow.
- Hosted migration `atomic_movie_editor_save` adds an admin-guarded SECURITY INVOKER RPC, retains RLS, and removes client TRUNCATE/REFERENCES/TRIGGER on the affected movie/company/gallery/similar tables. The small admin save path is serialized with a transaction advisory lock for reciprocal/shared-name consistency. Only company roles present in the patch are rebuilt; intentional empty markers do not become companies.
- Regression checks: `tools/movie-editor-smoke.mjs` (included in `npm run smoke`) and rollback-only `tools/supabase-movie-save-smoke.sql`.
- Verified hosted SQL rollback smoke and existing access smoke; 670 movie rows and their digest were unchanged, no test fixtures remained, and no new Security Advisor findings appeared. The client smoke covers a lost response, a request still running after timeout, upload reuse, and post-commit refresh failure.
- Production runtime `b904fb7358663f857e7b9d05f4d00907770c6e91` deployed through the normal release script. Preflight, portable/full/deploy-output smokes and gateway/apex/www checks passed. The deployed editor uses the RPC; anonymous REST invocation returns 401/42501. Browser catalog (40 of 670), movie, and company pages reached app-ready without console errors. Admin save behavior was checked by controller tests and authenticated-role SQL rollback tests, without editing real movies through the browser.

Keep this file current. Add a short entry after each behavior, architecture, data, routing, dependency, or important UI change.

Format:

```text
## YYYY-MM-DD - short title
- Files:
- Summary:
- Checks:
- Follow-up:
```

## 2026-11-15 - Verify runtime hardening production release

- Files:
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Released runtime build `a8147e31fa4f83cd048d8624916d1bd5b6f2272d` through the normal production script; active Yandex revision is `bbaoe4q1t6mtkiu55i19`. Includes public-file allowlisting, bounded/allowlisted poster fetching, private deployment output, and HTTP body limits.
  - Preserved 128 MiB memory, concurrency 1, 300s execution timeout, private container invocation, and existing Supabase/hosting plans. No schema/data changes in this release.
- Checks:
  - Release preflight, portable smoke, static smoke, fake-secret deploy-output smoke, and Linux Docker HTTP smoke pass.
  - New deployed smoke passes on the gateway, apex, and www on the first attempt. It checks the expected build, public routes/assets, HEAD 404 for private deployment/server/function/dependency paths, and 413 for a 65,537-byte POST.
  - Retested the original 64 MiB poster-stream failure locally in the current image with networking disabled, read-only filesystem, and a 128 MiB/no-swap cgroup: input cancelled after 10 pulls, fallback returned, process exited successfully (reported cgroup peak 23,511,040 bytes in this isolated sample).
  - A real public movie social image returns a non-fallback 122,632-byte baseline JPEG at 1200x630. Browser catalog renders 670 results / first 40 cards with no captured console warnings/errors.
  - `main` and `dev` contain the runtime commits. This entry is release verification only; its later documentation commit does not change the active runtime build.
- Follow-up:
  - Remaining audit work includes atomic movie saves, paginated collection reads, user-state/cache races, ranks aggregation, eager gallery reads, duplicate CSS fetches, startup size reporting, and dev-toolchain advisories. These changes do not establish sustained-load capacity or resolve the historical Disk IO alert by themselves.

## 2026-11-15 - Bound Node request bodies before routing

- Files:
  - `server/runtime.js`
  - `server/server.mjs`
  - `tools/portable-runtime-smoke.mjs`
  - `tools/docker-runtime-smoke.mjs`
  - `tools/deployed-runtime-smoke.mjs`
  - `docs/SERVER_RUNTIME.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Caps non-GET/HEAD bodies at 64 KiB before route/auth dispatch. Rejects large Content-Length without reading and counts actual streamed bytes independently of headers.
  - Returns 413/Connection: close without destroying the socket before the response is sent. Small JSON admin requests and direct Supabase Storage uploads preserve their existing paths.
  - Docker and deployed smoke now verify private server/dependency file denial and oversized-request rejection, alongside normal public routes/assets.
- Checks:
  - Red/green portable test reproduces unbounded chunk consumption before the fix; checks early streaming rejection, no reads for oversized declared bodies, exact-limit acceptance, and intact small JSON afterward.
  - `npm run smoke:docker:required` passes against the real Node entry point: declared and chunked oversized HTTP requests return 413, private files return 404, and the server answers normally afterward.

## 2026-11-15 - Keep revision environment secrets out of deploy output

- Files:
  - `tools/deploy-production.ps1`
  - `tools/deploy-production-smoke.ps1`
  - `docs/YANDEX_CONTAINER_RELEASE.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Captures every stream from the `yc` revision deployment command, whose response contains the complete environment. Reports generic success or a checked exit-code error, without returning raw output on failure or invocation errors.
  - Adds a fake-secret smoke for the actual deployment step, extracted from its PowerShell AST, and runs it before normal production image builds. No new deployment flags or resource settings.
- Checks:
  - Baseline fake-secret smoke reproduced the success-output leak. After the fix, success, nonzero exit, thrown invocation errors, PowerShell warnings, and native stdout/stderr success/failure cases pass under Windows PowerShell 5.
  - Independent read-only review also verified missing-command handling and serialization of thrown errors; no secret escaped the caller-visible error record. No real credentials are used in the regression test.

## 2026-11-15 - Bound social preview downloads and restrict their origin

- Files:
  - `server/movie-social-image.js`
  - `tools/portable-runtime-smoke.mjs`
  - `docs/SERVER_RUNTIME.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Social preview rendering now fetches only HTTPS public poster object/render URLs on the configured Supabase origin, with redirects disabled. Browser poster display and Storage uploads are unchanged.
  - Enforces an 8 MiB streamed byte limit even without Content-Length, a five-second fetch/body deadline, cancellation on rejection, and an 8-million-pixel decode limit. Oversized, malformed, stalled, and disallowed inputs use the existing fallback image.
  - Read-only inventory found all 670 movie posters on the configured project origin; the largest of 1,686 stored poster files was 651,965 bytes, below the byte cap. Dimensions of every stored file were not enumerated.
- Checks:
  - Red/green portable smoke: the original fetch consumed all 65 pulls of a synthetic 64 MiB source; the bounded reader cancels after crossing 8 MiB. Tests also cover oversized declared lengths, forbidden origins/paths without fetching, rejected redirects, a stalled response body, a 9M-pixel input, and normal WebP-to-baseline-JPEG rendering.
  - Independent read-only review and isolated 128 MiB Docker checks rendered 6M-pixel WebP, exactly 8M-pixel PNG, and 90 sequential previews successfully. This is bounded evidence, not a guarantee against all possible resource exhaustion; the existing image cache remains count-bounded.
  - Decode option verified against the [sharp constructor documentation](https://sharp.pixelplumbing.com/api-constructor/).

## 2026-11-15 - Restrict portable static serving to published assets

- Files:
  - `server/runtime.js`
  - `tools/portable-runtime-smoke.mjs`
  - `docs/SERVER_RUNTIME.md`
  - `docs/DEPLOYMENT_INVENTORY.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Reuses the runtime's explicit app asset inventory as the static access boundary and adds the actual public shells/media. Unknown root files and deployment, server, function, dependency, and documentation paths return 404.
  - Canonical path checks also reject symlink/junction aliases to private files; malformed URL encodings return 404. Existing public URLs and cache policies are preserved.
- Checks:
  - Added fake-secret fixtures outside the checkout: baseline GET of an existing deployment env path returned 200; after the fix GET/HEAD private paths, encoded paths, and a private icon junction return 404. Public shell, bootstrap, app proxy, CSS, icon, and static OG requests pass `npm run smoke:portable`.
  - No real secret file contents were read by the regression test.

## 2026-11-15 - Restrict profile authorization fields and catalog writes

- Files:
  - `tools/supabase-access-smoke.sql`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Security audit found that an authenticated user could update their own `profiles.role`; both database admin checks and privileged server endpoints trusted that field. The existing Auth trigger already creates profiles, so browser INSERT is unnecessary.
  - Hosted migration `restrict_profile_and_catalog_writes` removes broad client profile writes and grants only own-row UPDATE of display name, avatar, and Russian-poster preference. Role and identity fields remain server-managed; privileged SQL/service-role access and public reads are preserved.
  - Replaces authenticated/owner catalog write policies on genres, countries, and their movie links with explicit admin-only INSERT/UPDATE/DELETE. Removes unused client TRUNCATE/REFERENCES/TRIGGER privileges on the five tables.
- Checks:
  - Applied hosted migration `restrict_profile_and_catalog_writes` to production Supabase project `uogzcozbnosfguyfbvhe`; no container deployment or browser asset update is required.
  - Regression SQL fails on the original database grants before any test writes, then passes after the migration. Ordinary users cannot INSERT profiles or update role/system fields; own display/avatar/preference updates still work, and another user's profile cannot be changed.
  - Real RLS checks deny ordinary-user lookup writes and movie-link INSERT/UPDATE/DELETE even when that user temporarily owns the movie. Admin lookup/link INSERT/UPDATE/DELETE and service-role profile management pass. All fixtures, ownership changes, and no-op updates roll back inside the test.
  - Post-test profile role and movie ownership hashes match the pre-migration values. Counts remain 60 profiles, 19 genres, 64 countries, 1,266 movie-genre links, and 835 movie-country links; no test fixtures remain.
  - Live anonymous REST reads of profiles, genres, countries, and movies with embedded genre/country relations return 200. Existing Auth registration trigger remains enabled with its privileged INSERT access; no real registration emails or password changes were performed.
  - Security Advisor has no ERROR findings and no new warning categories; existing function-search-path/definer/password warnings remain separate work. The two no-policy research staging notices are intentional.
  - Independent read-only review found two test gaps around former owner policies and direct link deletes; both were covered before applying the migration. Updated review found no further issue. External model review was skipped per the user's choice.
- Follow-up:
  - This is the first audit repair: profile authorization and catalog RLS. Runtime file exposure, image limits, deployment output, atomic movie saves, and the remaining performance/cache findings are separate increments.

## 2026-11-15 - Update vulnerable social image runtime dependency

- Files:
  - `package.json`
  - `package-lock.json`
  - `tools/portable-runtime-smoke.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Release audit found a reachable high-severity advisory in sharp 0.33.5 / its native image decoders, used by `server/movie-social-image.js`. Upgraded and pinned sharp to 0.35.5 (libvips 8.18.7); no application API changes or new dependency added.
  - Reviewed upstream 0.35 breaking changes: production already uses Node 24; removed legacy sharp options are not used. The package no longer has an install script. Initial install used `--ignore-scripts`.
- Checks:
  - `npm audit --omit=dev`: zero production vulnerabilities.
  - Added a runtime smoke that renders a WebP poster through `/og/movie/*` and decodes the result to verify 1200x630 non-progressive JPEG output.
  - `npm run smoke:portable`, `npm run smoke:docker:required`, and an actual JPEG rendering check inside the Linux container pass.
- Follow-up:
  - Full audit still reports 5 high and 1 moderate findings in dev-only Vite/Browserslist/PostCSS/source-map/nanoid tooling. They are omitted from the production image; this release does not run Vite or rebuild the committed directors island. Review/update the dev toolchain before its next use, by 2026-11-22. Do not use `audit fix --force`.

## 2026-11-15 - Reuse public movie SEO reads to reduce Supabase requests

- Files:
  - `functions/_seo-utils.js`
  - `tools/portable-runtime-smoke.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a 60-second, 100-entry per-process cache to the existing public movie SEO fetcher, shared by GET/HEAD movie HTML, legacy movie routes, and social preview image handlers. Simultaneous misses reuse one in-flight request. Cache keys include project URL, query, and anon key; no caller session or service-role data is used.
  - Missing movies and failed requests are not cached. Client detail, ratings, watchlist, auth, and permissions remain live; SEO and social-preview metadata can lag an admin edit by at most one minute while the process stays warm.
  - Measured baseline: 20 concurrent GET/HEAD requests to one movie triggered 20 Supabase reads. Same runtime smoke after the change: 1 read (95% fewer for this repeated-request scenario, not a claim about total production IO).
  - Live 24-hour API logs contained 217 `/rest/v1/movies` requests out of 1,205 REST calls; lifetime stats showed 22,325 calls of the server SEO movie select. No background polling loop was found to remove.
- Checks:
  - Red/green `npm run smoke:portable`: reproduces duplicate reads before the fix; validates shared GET/HEAD reads, one-minute refresh, project/key isolation, uncached misses/errors, and bounded eviction after the fix.
  - `node tools/smoke-check.mjs` and `git diff --check` pass.
  - Linux image check: 20 repeated movie pages plus a social preview share one Supabase read within the same warm process. Production concurrency remains one request per container; cache reuse across separate containers is not assumed.
  - Released runtime build `2c23f3a3b5afd7ebe21934a007965cced611024b` through the existing production deployment script; gateway, apex, and www deployed smoke checks passed. Server resource settings and Supabase plan were preserved; `main` and `dev` were synchronized.
  - Live post-release check: five sequential public movie GET/HEAD requests all succeeded; the matching anonymous SEO statement count rose from 22,328 to 22,330 during the observation window. This is a short unisolated production sample, not a claim of an exact global reduction.
- Follow-up:
  - Compare API request counts and Disk IO balance under comparable traffic over the next day. Short request-count tests cannot prove a sustained production RAM/swap reduction. The cache is per warm container and can miss again after a cold start or on another instance.

## 2026-11-15 - Restrict internal Supabase research access and investigate Disk IO

- Files:
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Applied hosted migration `restrict_internal_research_access` directly to production Supabase project `uogzcozbnosfguyfbvhe`; no application deployment is required.
  - Enabled RLS on `year_research_staging`; both research staging tables now deny all client table privileges, including TRUNCATE. Preserved server-side service-role access and existing data.
  - Removed public/anonymous/authenticated execution of the two unrestricted SECURITY DEFINER research write RPCs and `get_empty_production_movies`. RLS alone would leave these RPCs accessible.
  - Disk IO investigation: organization is on Free; Metrics API reports 431,304,704 bytes RAM and roughly 407 MiB swap occupied at the end of a 47.5-second sample. Swap counters increased by about 339 pages/s in and 260 pages/s out. Active swapping is a plausible contributor, not proof of the historical alert's cause.
  - Database is only 32 MB. Application statement statistics show no temporary spills and almost all reads hit shared buffers. Cumulative database temp writes (~914 GB since February) are historical, not current disk occupancy; do not delete data or add speculative indexes based on that counter.
- Checks:
  - Before/after role privilege queries: anon/authenticated lose table and research RPC access; service_role retains it.
  - Live anonymous REST assertions: both staging reads and all three research RPCs denied; public movie read still succeeds.
  - Re-ran Security Advisor: no `rls_disabled_in_public` error; no public tables without RLS. The two staging `rls_enabled_no_policy` INFO notices are intentional.
  - Reviewed database logs, cron jobs, active connections, relation sizes, statement stats, and live host metrics.
  - Dashboard access restored through IAB: Infrastructure shows Nano, 8/60 connections, 46.5 MB database, 0.30 GB total disk usage. Weekly Disk IO balance minimum is 66%; the final plotted balance is approximately 100%. The budget was not exhausted in the displayed Nov 8-15 week.
  - Database report over the last 24 hours shows Memory commitment 1.31 GB, flagged Problematic. This is promised virtual allocation, not resident RAM. CPU/IOPS/throughput/connection charts returned "Unable to load data"; Infrastructure summaries and Metrics API remain available.
- Follow-up:
  - The historical alert's exact cause is unproven; currently the IO budget has recovered. Try measured application-side reductions first. Consider Pro + Micro only if sustained memory/IO pressure continues; no paid plan or compute settings changed.
  - Existing security WARNs remain: 20 functions without fixed search_path, intentional/admin-checked SECURITY DEFINER helpers, and leaked-password protection disabled. This was a targeted research-access repair, not a full security audit.

## 2026-10-05 - Restore social preview poster images

- Files:
  - `_routes.json`
  - `assets/og/astral-20261006-a.jpg`
  - `Dockerfile`
  - `app.js`
  - `functions/_seo-utils.js`
  - `functions/movie/[slug].js`
  - `functions/og/movie/[slug].js`
  - `package-lock.json`
  - `package.json`
  - `server/movie-social-image.js`
  - `server/preview-test.js`
  - `server/runtime.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Movie detail SEO now uses a Supabase-rendered 1200x630 JPEG-compatible poster URL for `og:image` and `twitter:image` instead of the raw WebP poster file.
  - Added `og:image:secure_url` for movie pages and kept the client-side meta refresh aligned with the server-rendered SEO HTML.
  - Portable/Yandex runtime now sets the real `Content-Length` on `HEAD` responses while still omitting the body, so social unfurl bots do not see movie pages as empty.
  - Movie detail requests from common social preview crawlers now receive a minimal no-JS HTML document with SEO meta at the start of `<head>`, avoiding full app boot scripts before Open Graph data.
  - Added a first-party `/og/movie/<slug>.jpg` poster proxy and switched movie social image meta to it, avoiding Supabase image headers/cookies/query strings in crawler previews.
  - Added an explicit portable `/robots.txt` response and copied `robots.txt` into the production Docker image.
  - Production Docker images now run `npm ci --omit=dev` so portable runtime dependencies such as `sharp` are available inside the container.
  - Updated the Dockerfile smoke guard to allow production-only dependency installation while still blocking dev dependency installs.
  - Social crawler HTML now uses the more widely supported `og:type=website`, omits JSON-LD scripts, and uses short public cache headers.
  - Portable/Yandex production now generates first-party movie preview images as 1200x630 baseline JPEGs via `sharp`, avoiding Supabase's progressive JPEG output and mismatched image dimensions that Telegram/VK can reject.
  - `HEAD` handling for movie and OG image routes is back to `200`-style metadata responses instead of `405`, because Telegram/VK may not fallback to `GET` after a rejected `HEAD`.
  - Added diagnostic `/preview-test/astral-20261006-a` route with a static pre-generated baseline JPEG under `/assets/og/astral-20261006-a.jpg`, so Telegram/VK preview behavior can be tested without dynamic Supabase/Sharp work during the crawler request.
  - Added temporary structured `social_preview_diagnostic` logs for `/preview-test/*`, `/assets/og/*`, and `/og/movie/*` in the portable runtime to see whether Telegram/VK reach HTML and image routes, with method, path, status, duration, user-agent, IP forwarding headers, content type, and content length.
  - Portable static asset responses now set `Content-Length` directly, so diagnostic static OG images expose the boring 200/JPEG/content-length header set before the Node/Yandex response writer touches them.
- Checks:
  - `node --check app.js`
  - `node --check functions/_seo-utils.js`
  - `node --check functions/og/movie/[slug].js`
  - `node --check functions/movie/[slug].js`
  - `node --check server/movie-social-image.js`
  - `node --check server/preview-test.js`
  - `node --check server/runtime.js`
  - `npm run smoke:portable`
  - `node tools/smoke-check.mjs`
  - Local portable runtime check for `/movie/astral-6-oni-uzhe-zdes-2026` social meta.
  - Local portable runtime TelegramBot check for minimal movie preview HTML.
  - Local portable runtime `/og/movie/astral-6-oni-uzhe-zdes-2026.jpg` check.
  - Local portable runtime `/robots.txt` check.
  - Local portable runtime `HEAD /movie/astral-6-oni-uzhe-zdes-2026` content-length check.
  - Local portable runtime generated JPEG check for `/og/movie/astral-6-oni-uzhe-zdes-2026.jpg`: 1200x630, baseline JPEG, real `Content-Length`.
  - `git diff --check`
- Follow-up:
  - Verify a production movie URL in social preview debuggers after the fix reaches `main`/production.

## 2026-10-04 - Add editor auto-related overrides

- Files:
  - `app.js`
  - `editor-page.js`
  - `editor-page.css`
  - `functions/admin/auto-related/diagnostics.js`
  - `functions/admin/auto-related/overrides.js`
  - `server/runtime.js`
  - `tools/auto-related/scoring.mjs`
  - `tools/auto-related/supabase-adapter.mjs`
  - `tools/auto-related/sync-runner.mjs`
  - `tools/auto-related-smoke.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added admin-only directed auto-related override writes through `POST /admin/auto-related/overrides`.
  - `/editor` weak-pair cards now expose "Исключить" and "Убрать исключение" actions, plus a separate "Исключённые пары" panel so hidden pairs can be restored later.
  - Automatic related scoring/materialization now respects `movie_recommendation_overrides`: `hide` removes directed pairs and `include` is supported as a forced manual automatic recommendation for future UI.
- Checks:
  - `node --check app.js`
  - `node --check editor-page.js`
  - `node --check functions/admin/auto-related/diagnostics.js`
  - `node --check functions/admin/auto-related/overrides.js`
  - `node --check server/runtime.js`
  - `node --check tools/auto-related/scoring.mjs`
  - `node --check tools/auto-related/supabase-adapter.mjs`
  - `node --check tools/auto-related/sync-runner.mjs`
  - `npm run smoke:auto-related`
  - `npm run smoke:portable`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Test excluding a weak pair on the Yandex runtime and confirm it disappears from materialized diagnostics after refresh.

## 2026-10-04 - Improve editor auto-related diagnostics

- Files:
  - `editor-page.js`
  - `editor-page.css`
  - `functions/admin/auto-related/diagnostics.js`
  - `tools/auto-related/supabase-adapter.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - `/editor` auto-related review cards now show per-provider TMDb/Trakt status pills with matched/external candidate counts, last success details, HTTP status, and provider errors from sync state.
  - Added a one-click weak-pair sync action and a batch action for all visible weak-pair movies, alongside the existing low-coverage batch sync.
  - Expanded server diagnostics to return already-stored provider sync counters/errors without changing the Supabase schema.
- Checks:
  - `node --check editor-page.js`
  - `node --check functions/admin/auto-related/diagnostics.js`
  - `node --check tools/auto-related/supabase-adapter.mjs`
  - `npm run smoke:auto-related`
  - `npm run smoke:portable`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Verify active sync buttons on Yandex/Node runtime and read-only disabled controls on Cloudflare preview.

## 2026-10-04 - Harden password recovery sessions

- Files:
  - `app.js`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Password reset emails now redirect with an explicit `auth_action=password-recovery` marker so recovery links are recognized even when opened in a different browser/device from the one that requested the email.
  - Recovery redirects now verify that Supabase actually created a session before showing the new-password form.
  - Saving a new password now retries session recovery through `refreshSession()` before telling the user that the reset link did not create an active session.
- Checks:
  - `node --check app.js`
  - `npm run smoke:portable`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Test a fresh password reset email in an incognito browser and on a second device.

## 2026-10-04 - Add editor auto-related sync controls

- Files:
  - `app.js`
  - `editor-page.js`
  - `editor-page.css`
  - `functions/admin/auto-related/diagnostics.js`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added `/editor` controls to sync one auto-related movie from the low-coverage/weak-pair diagnostics and to sync the currently visible "На проверку" list sequentially.
  - Diagnostics now reports whether the current runtime can run the Node-only provider sync stack, so Cloudflare dev shows read-only diagnostics while Yandex/Node can expose active sync controls.
- Checks:
  - `node --check app.js`
  - `node --check editor-page.js`
  - `node --check functions/admin/auto-related/diagnostics.js`
  - `npm run smoke:auto-related`
  - `npm run smoke:portable`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Verify active sync controls on the Yandex runtime; Cloudflare dev should keep them disabled.

## 2026-10-02 - Bind auto-related Supabase fetch for Cloudflare

- Files:
  - `tools/auto-related/supabase-adapter.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Bound the default `globalThis.fetch` implementation before storing it in the server-only auto-related Supabase adapter.
  - Fixes Cloudflare Pages Functions `Illegal invocation` errors caused by calling the native fetch with an incorrect `this` reference.
- Checks:
  - `node --check tools/auto-related/supabase-adapter.mjs`
  - `npm run smoke:auto-related`
  - `npm run smoke:portable`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Redeploy Cloudflare dev and verify `/editor` auto-related diagnostics now reaches Supabase instead of failing at runtime.

## 2026-10-02 - Clarify auto-related diagnostics env errors

- Files:
  - `functions/admin/auto-related/diagnostics.js`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Made `/admin/auto-related/diagnostics` report which Supabase server variable group is missing instead of returning a generic configuration error.
  - The message exposes only variable names, never secret values, so Cloudflare Preview/Production env mismatches are easier to diagnose.
- Checks:
  - `node --check functions/admin/auto-related/diagnostics.js`
  - `npm run smoke:portable`
- Follow-up:
  - Redeploy dev and use the clearer error to verify whether Cloudflare Preview receives `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SERVICE_KEY`.

## 2026-10-02 - Restore Cloudflare dev auto-related deploy compatibility

- Files:
  - `functions/admin/auto-related/[movieId].js`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Changed the admin post-save auto-related endpoint to lazy-load the Node-only sync runner at request time through a file URL.
  - Moved the file-URL construction behind a Node-runtime guard so Cloudflare Pages does not evaluate it during Function publishing.
  - Kept Yandex/portable Node behavior intact while preventing Cloudflare Pages preview builds from statically bundling `tools/auto-related/http-client.mjs`, which imports `node:https`.
- Checks:
  - `node --check functions/admin/auto-related/[movieId].js`
  - `npm run smoke:portable`
  - `npm run smoke:auto-related`
- Follow-up:
  - Let Cloudflare Pages redeploy `dev`; if preview still fails, inspect the Cloudflare deployment details log.

## 2026-10-02 - Add admin auto-related diagnostics

- Files:
  - `app.js`
  - `editor-page.js`
  - `editor-page.css`
  - `functions/admin/auto-related/diagnostics.js`
  - `server/runtime.js`
  - `tools/auto-related/supabase-adapter.mjs`
  - `tools/smoke-check.mjs`
  - `docs/AUTO_RELATED_MOVIES_PLAN.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added protected `GET /admin/auto-related/diagnostics`, which verifies the current Supabase user as admin server-side before reading recommendation sync/evidence/materialized tables with the service role.
  - Added an `/editor` diagnostics section for automatic related movies: sync coverage, distribution by related count, provider-consensus metrics, low-coverage movies, and weak materialized pairs with evidence summaries.
  - Extended the server-only Supabase adapter related-row select with score, position, and calculated timestamp for diagnostics without exposing service-role data to browser code.
  - Included the new endpoint in portable runtime routing and smoke syntax coverage.
- Checks:
  - `node --check app.js`
  - `node --check editor-page.js`
  - `node --check server/runtime.js`
  - `node --check functions/admin/auto-related/diagnostics.js`
  - `node --check tools/auto-related/supabase-adapter.mjs`
  - `node --check tools/smoke-check.mjs`
  - `npm run smoke:auto-related`
  - `npm run smoke:portable`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
  - `npm run release:container:preflight -- --allow-dirty`
  - `npm run size:compare`
- Follow-up:
  - Use the diagnostics output to review automatic related quality before any public UI switch.

## 2026-10-02 - Add periodic auto-related refresh mode

- Files:
  - `package.json`
  - `tools/auto-related-sync.mjs`
  - `tools/auto-related/sync-runner.mjs`
  - `tools/auto-related-smoke.mjs`
  - `docs/AUTO_RELATED_MOVIES_PLAN.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added `npm run auto-related:refresh` as a dedicated periodic-maintenance wrapper over the existing batch sync runner.
  - The refresh mode defaults to 30 least recently synced movies, a 1000ms provider delay, dry-run mode, and an appended coverage report.
  - Kept write refreshes gated behind explicit `--write --force`, while preserving `--unsynced-only` as the separate one-time backfill mode.
  - Extended smoke coverage so periodic refresh mode remains visible in batch results and summaries.
- Checks:
  - `node --check tools/auto-related-sync.mjs`
  - `node --check tools/auto-related/sync-runner.mjs`
  - `node --check tools/auto-related-smoke.mjs`
  - `npm run auto-related:sync -- --help`
  - `npm run auto-related:refresh -- --help`
  - `npm run smoke:auto-related`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
  - `npm run release:container:preflight -- --allow-dirty`
- Follow-up:
  - Continue with admin diagnostics before any public UI switch to automatic related movies.

## 2026-10-01 - Add admin post-save auto-related sync

- Files:
  - `.dockerignore`
  - `Dockerfile`
  - `app.js`
  - `functions/admin/auto-related/[movieId].js`
  - `server/runtime.js`
  - `tools/container-release-preflight.mjs`
  - `tools/auto-related/scoring.mjs`
  - `tools/auto-related/sync-runner.mjs`
  - `tools/auto-related-smoke.mjs`
  - `docs/AUTO_RELATED_MOVIES_PLAN.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a protected `POST /admin/auto-related/:movieId` endpoint that verifies the caller as an admin and runs a one-movie provider sync/materialization server-side.
  - Triggered the endpoint as a best-effort background action after successful admin movie create/update, without blocking the save flow or exposing provider/service-role secrets to the browser.
  - Extended auto-related write syncs to refresh touched reverse materialized rows, so new/edited movies can appear in older movies' automatic related rows without a full backfill.
  - Fixed stale provider evidence merging when a successful provider refresh returns no fresh rows for the source movie.
  - Included only `tools/auto-related` in the production Docker image and strengthened release preflight so the runtime endpoint can import the server-only sync modules.
- Checks:
  - `node --check app.js`
  - `node --check server/runtime.js`
  - `node --check "functions/admin/auto-related/[movieId].js"`
  - `node --check tools/auto-related/scoring.mjs`
  - `node --check tools/auto-related/sync-runner.mjs`
  - `node --check tools/auto-related-smoke.mjs`
  - `node --check tools/container-release-preflight.mjs`
  - `npm run smoke:auto-related`
  - `npm run smoke:portable`
  - `npm run release:container:preflight -- --allow-dirty`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
- Follow-up:
  - Add periodic refresh/admin diagnostics before considering any public UI switch from manual similar movies to automatic results.

## 2026-10-01 - Add unsynced-only auto-related batch mode

- Files:
  - `tools/auto-related-sync.mjs`
  - `tools/auto-related/sync-runner.mjs`
  - `tools/auto-related-smoke.mjs`
  - `docs/AUTO_RELATED_MOVIES_PLAN.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added `--unsynced-only` to auto-related batch sync so one-time backfills process only movies without recommendation sync state.
  - Documented `--unsynced-only` as the safe cron mode for a full-pass backfill that should not refresh old movies after completion.
  - Extended smoke coverage to ensure unsynced-only batches skip movies with existing sync state.
- Checks:
  - `node --check tools/auto-related/sync-runner.mjs`
  - `node --check tools/auto-related-sync.mjs`
  - `node --check tools/auto-related-smoke.mjs`
  - `npm run smoke:auto-related`
  - `npm run auto-related:sync -- --help`
  - `npm run auto-related:sync -- --limit 1 --delay-ms 0 --unsynced-only --report`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Update the auto-related backfill cron to use `--unsynced-only` with a finite run count.

## 2026-10-01 - Add auto-related scoring materialization

- Files:
  - `movie-auto-related-materialization-rpc-setup.sql`
  - `tools/auto-related/scoring.mjs`
  - `tools/auto-related/supabase-adapter.mjs`
  - `tools/auto-related/sync-runner.mjs`
  - `tools/auto-related-smoke.mjs`
  - `tools/smoke-check.mjs`
  - `docs/AUTO_RELATED_MOVIES_PLAN.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added local RRF scoring for automatic related movies with strict and fallback cutoffs, direct/reverse evidence weights, and confidence labels.
  - Added the materialization RPC SQL for replacing `movie_related` rows for one movie after scoring.
  - Extended the single-movie sync runner so dry-runs print `relatedRows` and gated writes can persist materialized related rows after provider evidence and sync-state updates.
  - Kept the public movie detail related block on the existing manual similar source.
- Checks:
  - `node --check tools/auto-related/scoring.mjs`
  - `node --check tools/auto-related/supabase-adapter.mjs`
  - `node --check tools/auto-related/sync-runner.mjs`
  - `node --check tools/auto-related-smoke.mjs`
  - `node --check tools/smoke-check.mjs`
  - `npm run smoke:auto-related`
  - `npm run auto-related:sync -- --slug zloveschie-mertvetsy-peklo-2026 --full`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Apply `movie-auto-related-materialization-rpc-setup.sql` manually in Supabase before using `--write`, then run one forced write for a known movie and inspect `movie_related`.

## 2026-10-01 - Add auto-related batch sync mode

- Files:
  - `tools/auto-related-sync.mjs`
  - `tools/auto-related/sync-runner.mjs`
  - `tools/auto-related-smoke.mjs`
  - `docs/AUTO_RELATED_MOVIES_PLAN.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added `--limit` batch mode to `npm run auto-related:sync` for controlled slices of least recently synced movies.
  - Batch sync builds the movie match index once per run, supports `--delay-ms`, remains dry-run by default, and uses the same gated write rules as one-movie sync.
  - Extended auto-related smoke coverage for batch candidate order, dry-run safety, materialization calls, and batch summaries.
- Checks:
  - `node --check tools/auto-related/sync-runner.mjs`
  - `node --check tools/auto-related-sync.mjs`
  - `node --check tools/auto-related-smoke.mjs`
  - `npm run smoke:auto-related`
  - `npm run auto-related:sync -- --help`
  - `npm run auto-related:sync -- --limit 3 --delay-ms 0`
  - `npm run auto-related:sync -- --limit 3 --delay-ms 1000 --write --force`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Use small `--limit` batches for gradual `movie_related` backfill; public UI still reads manual similar movies.

## 2026-10-01 - Add auto-related coverage report

- Files:
  - `tools/auto-related-sync.mjs`
  - `tools/auto-related/supabase-adapter.mjs`
  - `tools/auto-related/sync-runner.mjs`
  - `tools/auto-related-smoke.mjs`
  - `docs/AUTO_RELATED_MOVIES_PLAN.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added `--report` to print automatic related coverage totals, provider evidence counts, confidence counts, sync coverage, and related-count distribution.
  - `--report` can run by itself or be appended to batch sync, making it suitable for cron logs after each run.
  - Extended adapter and smoke coverage for global evidence/related reads and report aggregation.
- Checks:
  - `node --check tools/auto-related/supabase-adapter.mjs`
  - `node --check tools/auto-related/sync-runner.mjs`
  - `node --check tools/auto-related-sync.mjs`
  - `node --check tools/auto-related-smoke.mjs`
  - `npm run smoke:auto-related`
  - `npm run auto-related:sync -- --report`
  - `npm run auto-related:sync -- --limit 1 --delay-ms 0 --report`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Put `npm run auto-related:sync -- --limit 20 --delay-ms 1000 --write --force --report` on the chosen scheduler if automatic backfill cadence is desired.

## 2026-10-01 - Fix auto-related materialization RPC return column

- Files:
  - `movie-auto-related-materialization-rpc-setup.sql`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Renamed the materialization RPC output column from `position` to `related_position` to avoid a PostgreSQL syntax conflict in `returns table`.
  - The function still writes to the existing `movie_related.position` column.
- Checks:
  - `git diff --check`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Re-apply `movie-auto-related-materialization-rpc-setup.sql` manually in Supabase.

## 2026-10-01 - Add TMDb DNS fallback for auto-related CLI

- Files:
  - `tools/auto-related/http-client.mjs`
  - `docs/AUTO_RELATED_MOVIES_PLAN.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Diagnosed local Happ/Xray DNS poisoning where `api.themoviedb.org` resolved to `127.0.0.1` even through explicit `1.1.1.1`/`8.8.8.8` DNS queries.
  - Added a targeted DNS-over-HTTPS fallback for TMDb provider requests in the server/CLI auto-related HTTP client.
  - Re-ran the dry-run for `zloveschie-mertvetsy-peklo-2026`; TMDb and Trakt both succeeded without writing to Supabase.
- Checks:
  - `node --check tools/auto-related/http-client.mjs`
  - `npm run auto-related:sync -- --slug zloveschie-mertvetsy-peklo-2026 --full`
  - `npm run smoke:auto-related`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Use the dry-run output to design scoring/materialization cutoffs before enabling writes or public display.

## 2026-10-01 - Auto-load local env for automatic related CLI

- Files:
  - `tools/auto-related-sync.mjs`
  - `docs/AUTO_RELATED_MOVIES_PLAN.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Updated `npm run auto-related:sync` to auto-load ignored local secrets from `deploy/yandex/production.env.local`.
  - Existing shell environment variables still take precedence over file values.
  - Restored `deploy/yandex/production.env.local.example` to an empty committed template after real local keys were accidentally placed there.
- Checks:
  - `node --check tools/auto-related-sync.mjs`
  - `npm run auto-related:sync -- --help`
  - `npm run smoke:auto-related`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Run a real dry-run against one known movie slug and inspect provider matches before enabling writes.

## 2026-10-01 - Add automatic related single movie sync runner

- Files:
  - `tools/auto-related/sync-runner.mjs`
  - `tools/auto-related-sync.mjs`
  - `tools/auto-related-smoke.mjs`
  - `tools/smoke-check.mjs`
  - `package.json`
  - `docs/AUTO_RELATED_MOVIES_PLAN.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a server/CLI-only one-movie automatic related sync runner that combines provider fetches, strict ID matching, atomic evidence replacement, and recommendation sync-state updates.
  - Added `npm run auto-related:sync`, dry-run by default, with real writes gated by `--write` plus `AUTO_RELATED_MOVIES=true` or an explicit one-off `--force`.
  - Extended auto-related smoke coverage for dry-run safety, write gating, Trakt ID resolution, per-provider evidence replacement, and sync-state upsert shape.
- Checks:
  - `node --check tools/auto-related/sync-runner.mjs`
  - `node --check tools/auto-related-sync.mjs`
  - `node --check tools/auto-related-smoke.mjs`
  - `node --check tools/smoke-check.mjs`
  - `npm run smoke:auto-related`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Run the new CLI against one real movie in dry-run mode with production provider keys, then add scoring/materialization into `movie_related`.

## 2026-10-01 - Add automatic related Supabase adapter

- Files:
  - `movie-auto-related-rpc-setup.sql`
  - `tools/auto-related/ids.mjs`
  - `tools/auto-related/matching.mjs`
  - `tools/auto-related/supabase-adapter.mjs`
  - `tools/auto-related-smoke.mjs`
  - `tools/auto-related/config.mjs`
  - `tools/smoke-check.mjs`
  - `docs/AUTO_RELATED_MOVIES_PLAN.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added `movie-auto-related-rpc-setup.sql` with `replace_movie_recommendation_provider_evidence`, an atomic RPC for replacing one provider's evidence rows after a successful fetch.
  - Added strict local candidate matching by TMDb/IMDb/Trakt IDs, treating duplicate external IDs as ambiguous instead of guessing.
  - Added a server-only Supabase REST/RPC adapter for movie match index reads, sync-state upserts, and atomic evidence replacement.
  - Extended the auto-related smoke test to cover IMDb URL extraction, matching, self-match rejection, ambiguous IDs, Supabase pagination, sync-state upsert, and RPC payload shape.
- Checks:
  - `node --check tools/auto-related/config.mjs`
  - `node --check tools/auto-related/http-client.mjs`
  - `node --check tools/auto-related/ids.mjs`
  - `node --check tools/auto-related/matching.mjs`
  - `node --check tools/auto-related/providers.mjs`
  - `node --check tools/auto-related/supabase-adapter.mjs`
  - `node --check tools/auto-related/tmdb-provider.mjs`
  - `node --check tools/auto-related/trakt-provider.mjs`
  - `node --check tools/auto-related-smoke.mjs`
  - `npm run smoke:auto-related`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Apply `movie-auto-related-rpc-setup.sql` manually in Supabase, then build the single-movie sync runner that combines providers, matching, sync-state updates, and evidence persistence.

## 2026-10-01 - Add automatic related provider skeleton

- Files:
  - `tools/auto-related/config.mjs`
  - `tools/auto-related/http-client.mjs`
  - `tools/auto-related/ids.mjs`
  - `tools/auto-related/providers.mjs`
  - `tools/auto-related/tmdb-provider.mjs`
  - `tools/auto-related/trakt-provider.mjs`
  - `tools/auto-related-smoke.mjs`
  - `tools/smoke-check.mjs`
  - `package.json`
  - `deploy/yandex/production.env.local.example`
  - `deploy/yandex/serverless-container.env.example`
  - `docs/AUTO_RELATED_MOVIES_PLAN.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added server/CLI-only automatic related provider skeleton modules for env config, external ID normalization, retry/`429`-aware JSON fetches, provider creation, TMDb Recommendations, and Trakt Related.
  - Added `npm run smoke:auto-related` with mocked provider responses to verify Bearer/app-key headers, retry-after handling, provider isolation, and candidate normalization without leaking overview/title fields.
  - Documented optional server-only `TMDB_READ_ACCESS_TOKEN` and `TRAKT_API_KEY` env values in Yandex env examples without enabling any public UI or Supabase writes.
- Checks:
  - `node --check tools/auto-related/config.mjs`
  - `node --check tools/auto-related/http-client.mjs`
  - `node --check tools/auto-related/ids.mjs`
  - `node --check tools/auto-related/providers.mjs`
  - `node --check tools/auto-related/tmdb-provider.mjs`
  - `node --check tools/auto-related/trakt-provider.mjs`
  - `node --check tools/auto-related-smoke.mjs`
  - `npm run smoke:auto-related`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Build the next layer: Supabase read/write adapter plus ID matching from provider candidates to local movies, still without switching the public related block.

## 2026-10-01 - Add automatic related movies schema plan

- Files:
  - `movie-auto-related-setup.sql`
  - `docs/AUTO_RELATED_MOVIES_PLAN.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added the first manually applied Supabase setup SQL for future automatic related movies.
  - The SQL creates admin-only sync/evidence/override tables plus public-read `movie_related`, with RLS and explicit grants for Supabase Data API compatibility.
  - Documented that the current public related-movie flow still uses `movie_manual_similar` until provider sync/materialization code is implemented.
- Checks:
  - `git diff --check`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - After applying the SQL manually in Supabase, build the server-only provider abstraction skeleton and sync config without touching the public UI.

## 2026-10-01 - Document automatic related movies architecture

- Files:
  - `docs/AUTO_RELATED_MOVIES_PLAN.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a planned architecture document for automatic related movies, keeping the current manual similar system intact.
  - Captured the server-only provider abstraction for TMDb Recommendations and Trakt Related Movies, including Bearer/app-key auth, 429/retry/cache behavior, directed evidence, RRF scoring, materialized local results, feature flagging, and admin diagnostics.
  - Documented that TMDb/Trakt must never be called from the frontend or during movie page opening, and that no synopsis/overview/keyword/ML analysis belongs in v1.
- Checks:
  - `git diff --check`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Start implementation only after approving the first phase: Supabase migration/RLS plan plus provider abstraction skeleton.

## 2026-09-24 - Enable movie card admin actions on people and company pages

- Files:
  - `app.js`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Generalized movie-card click, aux-click, external-links, and rating-hover handlers so reused movie cards are not tied only to the catalog container.
  - Wired person detail and company detail movie grids to the shared movie-card handlers with page-local movie lookup.
  - Admin edit buttons on those cards now open the movie editor with full editor payload, and delete buttons remove the movie then refresh the current person/company page.
  - Movie saves from person/company pages now reload the current secondary page after a successful update, keeping filmography/company sections current.
- Checks:
  - `node --check app.js`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
- Follow-up:
  - Verify as admin on a person page and a company page: edit opens the film modal, delete asks for confirmation and refreshes the same page.

## 2026-09-24 - Invalidate profile cache without ranks

- Files:
  - `user-page.js`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Bumped the profile page data cache version so profile stats cached during the broken production rank endpoint window are discarded.
  - Profile page data is no longer cached or reused when a stat count is nonzero but the corresponding activity rank is missing.
  - This keeps transient `/profile-activity-ranks` failures from persisting as missing medals in `user-page-stats`.
- Checks:
  - `node --check user-page.js`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
- Follow-up:
  - Deploy to production and verify `/user/profile000` and `/user/profile001` show rank medals after the first fresh load.

## 2026-09-23 - Harden production deploy script

- Files:
  - `tools/deploy-production.ps1`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Fixed production revision lookup after Docker image push by normalizing Yandex CLI JSON output before sorting revisions by `created_at`.
  - Made local `deploy/yandex/production.env.local` values take priority over persistent user/machine environment variables, while keeping explicit process env overrides.
  - Added lightweight Supabase URL/key shape validation so a production revision is not deployed with an accidentally corrupted secret value.
  - Documented the PowerShell `ConvertFrom-Json` array sorting trap in the project context.
- Checks:
  - `$tokens = $null; $errors = $null; [System.Management.Automation.Language.Parser]::ParseFile('tools/deploy-production.ps1', [ref]$tokens, [ref]$errors) | Out-Null; if ($errors.Count) { $errors | Format-List; exit 1 }`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
- Follow-up:
  - Rerun `npm run deploy:production` after filling `deploy/yandex/production.env.local`; the previous failed run had already pushed the Docker image but stopped before deploying the new revision.

## 2026-09-23 - Add production deploy script

- Files:
  - `.gitignore`
  - `package.json`
  - `tools/deploy-production.ps1`
  - `deploy/yandex/production.env.local.example`
  - `docs/CODEX_CONTEXT.md`
  - `docs/YANDEX_CONTAINER_RELEASE.md`
  - `docs/YANDEX_PRODUCTION_CUTOVER.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added `npm run deploy:production` as the one-command release path for promoting `dev` to `main`, building/pushing the Yandex Docker image, deploying the production Serverless Container revision, running deployed smoke checks with retries, and merging `main` back into `dev`.
  - Added an ignored local env file path for production Supabase deploy secrets so the keys do not need to be entered every release.
  - Documented that only `production.env.local.example` is committed; the filled `production.env.local` must stay local because it contains the service-role key.
- Checks:
  - `$tokens = $null; $errors = $null; [System.Management.Automation.Language.Parser]::ParseFile('tools/deploy-production.ps1', [ref]$tokens, [ref]$errors) | Out-Null; if ($errors.Count) { $errors | Format-List; exit 1 }`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
- Follow-up:
  - Use `npm run deploy:production` for the next production release and keep Docker Desktop running before starting the command.

## 2026-09-23 - Harden boot CSS and refresh warm catalog snapshots

- Files:
  - `*.html`
  - `boot-loader.js`
  - `app.js`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Made stylesheet boot more resilient: stylesheet links retry once, cached same-build CSS can unblock startup during transient live CSS failures, and fallback timers are less aggressive.
  - Kept catalog warm returns instant from a valid snapshot, but added a background Supabase refresh that re-renders only when the fresh data signature differs.
  - This prevents movies added on another device from staying hidden behind an old same-tab catalog snapshot.
  - Bumped the shared `boot-loader.js` query version in every HTML shell so browsers pick up the safer bootstrap code.
- Checks:
  - `node --check boot-loader.js`
  - `node --check app.js`
  - `node tools/smoke-check.mjs`
  - `npm run smoke:portable`
- Follow-up:
  - Watch production complaints for remaining app-start failures; if any persist, split the boot error text into CSS-load and app-start variants.

## 2026-09-21 - Record Yandex production cutover completion

- Files:
  - `docs/CODEX_CONTEXT.md`
  - `docs/YANDEX_PRODUCTION_CUTOVER.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Updated project context to state that production is now served by Yandex API Gateway and a private Serverless Container.
  - Added production cutover status notes: both apex and `www` passed deployed smoke, while the direct production container URL should remain private.
  - Kept Cloudflare as a temporary rollback path rather than the primary host.
- Checks:
  - `git diff --check`
  - `node tools/smoke-check.mjs`
  - `npm run smoke:deployed -- --base-url "https://horroreiro.ru" --expected-version <main-sha>`
  - `npm run smoke:deployed -- --base-url "https://www.horroreiro.ru" --expected-version <main-sha>`
- Follow-up:
  - Monitor production logs and keep Cloudflare rollback available for several days before removing old routes/resources.

## 2026-09-21 - Add Yandex production cutover runbook

- Files:
  - `docs/YANDEX_PRODUCTION_CUTOVER.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a production cutover runbook for moving `horroreiro.ru` from Cloudflare to Yandex after staging validation.
  - Documented the decision to use separate staging and production Serverless Container/API Gateway resources.
  - Captured the existing `dev` -> `main` -> `dev` promotion flow, Supabase Auth, DNS, smoke-check, and rollback guardrails.
- Checks:
  - `git diff --check`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Before DNS cutover, promote the approved `dev` changes into `main`, build the production image from the resulting `main` commit, and verify a separate Yandex production gateway.

## 2026-09-21 - Record PowerShell placeholder rule

- Files:
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a workflow trap explaining that user-facing PowerShell commands should not include angle-bracket placeholders like `<url>` or `<id>`.
  - Future executable commands should use concrete known values or quoted variables to avoid PowerShell redirection parser errors.
- Checks:
  - `git diff --check`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Use concrete Yandex Gateway/container values in the next migration commands.

## 2026-09-21 - Require API Gateway service account in Yandex template

- Files:
  - `deploy/yandex/api-gateway-openapi.example.yaml`
  - `docs/YANDEX_CONTAINER_RELEASE.md`
  - `docs/YANDEX_STAGING_PLAN.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Updated the initial Yandex API Gateway OpenAPI template to include a top-level `service_account_id`.
  - Documented that Serverless Container integrations require a gateway service account with `serverless-containers.containerInvoker` for the target container.
  - Clarified that `<service-account-id>` is a placeholder and the gateway creator must be allowed to use the chosen service account.
- Checks:
  - `git diff --check`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Create/select a gateway service account, grant it container invoker access, fill `<service-account-id>` in the spec, and retry gateway creation.

## 2026-09-21 - Add Yandex API Gateway staging template

- Files:
  - `deploy/yandex/api-gateway-openapi.example.yaml`
  - `docs/YANDEX_CONTAINER_RELEASE.md`
  - `docs/YANDEX_STAGING_PLAN.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a minimal OpenAPI spec for the first Yandex API Gateway staging proxy.
  - Documented the proven PowerShell `docker buildx` command for Yandex images with `linux/amd64`, no provenance, and no SBOM.
  - Linked the API Gateway staging plan to the reusable root plus greedy proxy spec.
- Checks:
  - `node --check tools/smoke-check.mjs`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Create the first gateway with the template, run deployed smoke against its public gateway URL, and only then move on to domain/TLS.

## 2026-09-21 - Fix Yandex PORT environment guidance

- Files:
  - `deploy/yandex/serverless-container.env.example`
  - `tools/container-release-preflight.mjs`
  - `docs/DEPLOYMENT_INVENTORY.md`
  - `docs/YANDEX_CONTAINER_RELEASE.md`
  - `docs/YANDEX_STAGING_PLAN.md`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Removed `PORT=8080` from the Yandex Serverless Container env example.
  - Updated release preflight so Yandex env examples must not define `PORT`.
  - Clarified that Yandex injects `PORT` automatically in HTTP-server mode and rejects user-defined `PORT` variables.
  - Kept Dockerfile `PORT=8080` as the local/generic-container fallback.
- Checks:
  - `node --check tools/container-release-preflight.mjs`
  - `npm run release:container:preflight -- --expected-version <current-head> --allow-dirty`
  - `node --check tools/smoke-check.mjs`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - In Yandex revision UI, remove the `PORT` environment variable and save the revision again.

## 2026-09-21 - Add Yandex container release preflight

- Files:
  - `tools/container-release-preflight.mjs`
  - `deploy/yandex/serverless-container.env.example`
  - `docs/YANDEX_CONTAINER_RELEASE.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DEPLOYMENT_INVENTORY.md`
  - `docs/SERVER_RUNTIME.md`
  - `docs/YANDEX_STAGING_PLAN.md`
  - `package.json`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a provider-neutral container release preflight script for Docker/Yandex release candidates.
  - Added a safe Yandex Serverless Container env example with placeholders only.
  - Added a manual Yandex container release checklist covering build version, local checks, image tagging, registry push, Serverless Container env, and deployed smoke.
  - Smoke guards now keep the release preflight, env example, checklist, and package command present.
- Checks:
  - `node --check tools/container-release-preflight.mjs`
  - `node --check tools/smoke-check.mjs`
  - `npm run release:container:preflight -- --expected-version <current-head> --allow-dirty`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
  - `npm run smoke:portable`
  - `npm run smoke:docker` (skipped because Docker is not available in this environment)
- Follow-up:
  - Use `docs/YANDEX_CONTAINER_RELEASE.md` for the first manual Yandex image build/push attempt.

## 2026-09-21 - Add deployed runtime smoke

- Files:
  - `tools/deployed-runtime-smoke.mjs`
  - `package.json`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DEPLOYMENT_INVENTORY.md`
  - `docs/YANDEX_STAGING_PLAN.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a provider-neutral deployed smoke script for staging/production URLs.
  - The script checks `/env`, app asset routing, route shells, clean-route fallbacks, sitemap XML, cache headers, build version, and service-key leakage.
  - Heavy `app.js` asset routing is checked by headers/cache without downloading the whole bundle; a smaller versioned asset verifies body content.
  - Added `npm run smoke:deployed -- --base-url <url> --expected-version <APP_BUILD_VERSION>` and documented it in the deployment inventory and Yandex staging plan.
  - Smoke guards now keep the deployed smoke script and package command present.
- Checks:
  - `node --check tools/deployed-runtime-smoke.mjs`
  - `node --check tools/smoke-check.mjs`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
  - `npm run smoke:portable`
  - `npm run smoke:docker` (skipped because Docker is not available in this environment)
  - `npm run smoke:deployed -- --base-url https://dev.horroreiro.ru --allow-dev-version --timeout-ms 20000`
- Follow-up:
  - Run `npm run smoke:deployed -- --base-url https://staging.horroreiro.ru --expected-version <sha>` after the first external staging URL exists.

## 2026-09-21 - Document Yandex staging plan

- Files:
  - `docs/YANDEX_STAGING_PLAN.md`
  - `docs/DEPLOYMENT_INVENTORY.md`
  - `docs/CODEX_CONTEXT.md`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a documentation-only Yandex staging and production cutover plan.
  - The plan starts with a single Serverless Container behind API Gateway to preserve the existing `/app-assets/<APP_BUILD_VERSION>?file=<asset>` contract.
  - Documented when to introduce Object Storage, how to handle Container Registry, Certificate Manager, Cloud DNS, Supabase Auth redirects, parity checks, production cutover, and rollback.
  - Added smoke guards so the Yandex plan remains present and keeps the critical single-container-first, app-assets, DNS/TLS, Supabase Auth, and rollback constraints.
- Checks:
  - `node --check tools/smoke-check.mjs`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
  - `npm run smoke:portable`
  - `npm run smoke:docker` (skipped because Docker is not available in this environment)
  - `node --check server/runtime.js`
  - `node --check server/server.mjs`
- Follow-up:
  - Use the plan for manual staging; do not add Yandex manifests until staging IDs, DNS model, and app-assets compatibility are confirmed.

## 2026-09-21 - Add portable deployment inventory

- Files:
  - `docs/DEPLOYMENT_INVENTORY.md`
  - `docs/CODEX_CONTEXT.md`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a provider-neutral deployment inventory for future Russia-accessible hosting migration work.
  - Documented runtime env vars, server-only secrets, public route inventory, static asset/cache requirements, DNS/TLS guardrails, observability expectations, staging parity checks, and the future host-adapter boundary.
  - Linked the inventory from the architecture context and added smoke guards so the migration checklist remains present and covers the critical runtime/DNS/secret topics.
- Checks:
  - `node --check tools/smoke-check.mjs`
  - `node --check server/runtime.js`
  - `node --check server/server.mjs`
  - `npm run smoke:portable`
  - `npm run smoke:docker` (skipped because Docker is not available in this environment)
  - `node tools/smoke-check.mjs`
  - `git diff --check`
- Follow-up:
  - Use this checklist before adding any Yandex/VPS/provider-specific staging files.

## 2026-09-18 - Add Docker wrapper for portable runtime

- Files:
  - `Dockerfile`
  - `.dockerignore`
  - `tools/docker-runtime-smoke.mjs`
  - `tools/smoke-check.mjs`
  - `docs/SERVER_RUNTIME.md`
  - `docs/CODEX_CONTEXT.md`
  - `README.md`
  - `package.json`
- Summary:
  - Added a provider-independent Docker image wrapper around `server/server.mjs`.
  - The image uses Node 24 Alpine, runs as the `node` user, listens on `PORT=8080`, and avoids installing dev dependencies.
  - Added optional Docker smoke scripts; the smoke skips when Docker is unavailable and has a required mode for Docker-enabled CI or local validation.
  - Documented Docker as a wrapper around the portable runtime, not a host-specific migration layer.
- Checks:
  - `node --check tools/docker-runtime-smoke.mjs`
  - `npm run smoke:docker` (skipped because Docker is not available in this environment)
  - `npm run smoke:portable`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
- Follow-up:
  - Run `npm run smoke:docker:required` on a machine with Docker before using the image for staging.

## 2026-09-18 - Add provider-independent server runtime

- Files:
  - `server/runtime.js`
  - `server/server.mjs`
  - `tools/portable-runtime-smoke.mjs`
  - `tools/smoke-check.mjs`
  - `docs/SERVER_RUNTIME.md`
  - `docs/CODEX_CONTEXT.md`
  - `README.md`
  - `package.json`
- Summary:
  - Added a portable Node HTTP runtime that reuses the existing Cloudflare `functions/*` handlers without depending on Cloudflare or Yandex request APIs.
  - The runtime provides `env.ASSETS.fetch`, route params, static fallback, and the current public route map for local/Docker-compatible serving.
  - Added `npm run start:portable` and `npm run smoke:portable` as the base checks for future Docker/Yandex/VPS hosting work.
  - Documented route inventory and the rule that future host adapters should wrap the portable runtime instead of duplicating business logic.
- Checks:
  - `node --check server/runtime.js`
  - `node --check server/server.mjs`
  - `node --check tools/portable-runtime-smoke.mjs`
  - `node --check tools/smoke-check.mjs`
  - `npm run smoke:portable`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
- Follow-up:
  - Add a Dockerfile only after the portable runtime remains green and route parity is accepted.

## 2026-09-18 - Roll back Netlify deployment adapter

- Files:
  - `netlify.toml`
  - `netlify/functions/*`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `README.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Removed the parallel Netlify deployment adapter because Netlify and Vercel are not acceptable hosting targets for the Russia-accessibility requirement.
  - Restored the deployment documentation and smoke-check contracts to the Cloudflare-only state before the Netlify experiment.
  - Keep future hosting migration work focused on providers that are practically reachable from Russia before adding project adapters.
- Checks:
  - `node --check tools/smoke-check.mjs`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
- Follow-up:
  - Evaluate Russia-accessible static hosting/VPS options before implementing another deployment adapter.

## 2026-09-17 - Remove admin link from public company not-found state

- Files:
  - `company-pages.js`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Public `/company/<slug>` not-found state no longer shows the `К производителям` button because it points to an admin-only role list.
  - Smoke checks now guard against reintroducing that admin-list link into public company detail UI.
- Checks:
  - `node --check company-pages.js`
  - `node --check tools/smoke-check.mjs`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
- Follow-up:
  - If anonymous visitors still see plain company text or `Компания не найдена`, apply the public-read Supabase grants/policies for `companies` and `movie_companies`.

## 2026-09-17 - Make company detail pages public

- Files:
  - `app.js`
  - `company-pages.js`
  - `movie-page-shell.js`
  - `movie-companies-setup.sql`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - `/company/<slug>` detail pages are now public read-only pages.
  - Company role lists (`/production`, `/distributors`, `/russian-distributors`) and company edit actions remain admin-only.
  - Movie detail production/distribution/Russian distribution company links are available to all visitors and still display canonical `companies.name` values.
  - The company SQL baseline now grants and policies public read access to `companies` and `movie_companies`, while writes stay admin-only.
  - Smoke checks now guard against reintroducing an admin-only company detail gate.
- Checks:
  - `node --check app.js`
  - `node --check company-pages.js`
  - `node --check movie-page-shell.js`
  - `node --check tools/smoke-check.mjs`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
- Follow-up:
  - Apply the updated public-read `movie-companies-setup.sql` policy block in existing Supabase environments before relying on public company pages.

## 2026-09-17 - Display canonical company names on movie details

- Files:
  - `movie-page-shell.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Linked production/distribution/Russian distribution values on admin movie detail pages now display the current `companies.name` instead of stale text from the movie array.
  - The original movie array value remains a fallback only when no linked company row exists.
  - Movie detail company rendering can still show linked company rows even if the legacy movie array is missing.
- Checks:
  - `node --check movie-page-shell.js`
  - `node --check tools/smoke-check.mjs`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
- Follow-up:
  - Recheck a movie after changing only the company name casing: the movie detail meta field should show the updated company casing.

## 2026-09-17 - Link movie detail company names

- Files:
  - `app.js`
  - `movie-page-orchestrator.js`
  - `movie-page-shell.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Admin movie detail payload hydration now loads `movie_companies` for the current movie before rendering/cache entry creation.
  - Production, distribution, and Russian distribution values on admin movie detail pages now link to matching `/company/<slug>` detail pages when a synced company row exists.
  - Non-admin movie detail pages and missing company links fall back to escaped plain text because company pages are currently admin-only.
  - Smoke checks now guard the movie detail company-link data path.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-shell.js`
  - `node --check movie-page-orchestrator.js`
  - `node --check tools/smoke-check.mjs`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
- Follow-up:
  - Recheck a movie detail page as admin: company names should open the shared company detail page; regular users should still see plain text.

## 2026-09-17 - Tolerate existing company name keys on movie save

- Files:
  - `app.js`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Company sync now keys the in-memory map by stored `companies.name_key` instead of recalculating only from the display name.
  - If inserting a company hits Postgres unique violation `23505` on `companies_name_key_idx`, the save path rereads the existing company by `name_key` and continues instead of failing movie edit.
  - Smoke checks now guard the duplicate-key fallback in the company sync path.
- Checks:
  - `node --check app.js`
  - `node --check tools/smoke-check.mjs`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
- Follow-up:
  - Recheck editing a movie whose production/distribution values already exist in `companies`.

## 2026-09-17 - Add admin company role pages

- Files:
  - `app.js`
  - `company-pages.js`
  - `company-page.css`
  - `companies.html`
  - `company.html`
  - `movie-editor.js`
  - `shared-layout.js`
  - `boot-loader.js`
  - `page-warm-start.js`
  - `app-page-runtime.js`
  - `functions/production.js`
  - `functions/production.html.js`
  - `functions/distributors.js`
  - `functions/distributors.html.js`
  - `functions/russian-distributors.js`
  - `functions/russian-distributors.html.js`
  - `functions/company.html.js`
  - `functions/company/[slug].js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `_routes.json`
  - `movie-companies-setup.sql`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added admin-only company pages for production, distribution, and Russian distribution values with clean routes `/production`, `/distributors`, and `/russian-distributors`.
  - Added shared company detail pages at `/company/<slug>`; detail pages show company country only when filled and omit empty role sections.
  - Movie create/update now synchronizes multiline production/distribution/Russian distribution fields into `companies`/`movie_companies`, and movie deletion/removal cleanup deletes orphan company rows when safe.
  - Added admin account-menu links for the three company role pages and routed the new shells through warm-start, app-assets, cache headers, and Cloudflare Functions.
  - Added `movie-companies-setup.sql` to create/backfill the company tables with admin-only RLS.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check company-pages.js`
  - `node --check shared-layout.js`
  - `node --check boot-loader.js`
  - `node --check page-warm-start.js`
  - `node --check app-page-runtime.js`
  - `node --check functions/app-assets/[version].js`
  - `node --check functions/production.js`
  - `node --check functions/production.html.js`
  - `node --check functions/distributors.js`
  - `node --check functions/distributors.html.js`
  - `node --check functions/russian-distributors.js`
  - `node --check functions/russian-distributors.html.js`
  - `node --check functions/company.html.js`
  - `node --check functions/company/[slug].js`
  - `node --check tools/smoke-check.mjs`
  - `node tools/smoke-check.mjs`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
  - `git diff --check`
- Follow-up:
  - Apply `movie-companies-setup.sql` in Supabase before opening the new company pages on dev/prod.

## 2026-09-17 - Fix directors admin edit fallback and movie delete orphan cleanup

- Files:
  - `app.js`
  - `src/directors-admin-app.jsx`
  - `assets/directors-admin-app.js`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added stable `data-directors-admin-action`/`data-director-id` attributes to `/directors` admin buttons and taught the delegated app handler to open the person edit modal from restored DOM snapshots.
  - Rebuilt the `/directors` Preact island so the deployed asset includes the edit fallback while still using native Preact handlers after mount.
  - Movie deletion now collects linked `person_id` values before deleting the movie and removes orphan people after cascade, preventing director cards with `0 фильмов` when the deleted movie was their only link.
  - Smoke checks now guard both the `/directors` edit fallback and movie-delete orphan cleanup.
- Checks:
  - `npm run build:directors`
  - `node --check app.js`
  - `node --check assets/directors-admin-app.js`
  - `node --check tools/smoke-check.mjs`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
- Follow-up:
  - Recheck `/directors`: edit should open immediately on a warm-started page and after full Preact load; deleting a movie should remove one-film director cards automatically.

## 2026-09-17 - Preserve live scroll during warm hydration

- Files:
  - `app.js`
  - `catalog-warm-start.js`
  - `movie-warm-start.js`
  - `page-warm-start.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a shared scroll-intent contract for warm-started pages so delayed hydration cannot override a user who already started scrolling after returning to a restored page.
  - `catalog-warm-start.js` now consumes saved catalog scroll/anchor keys after restoring the DOM, preventing a later duplicate scroll restore from `app.js`.
  - Movie detail and secondary page hydration now preserve the live scroll position when a warm-started page has already received user scroll input.
  - Smoke checks now guard that all warm-start scripts include the early scroll tracker and that `app.js` honors it.
- Checks:
  - `node --check app.js`
  - `node --check catalog-warm-start.js`
  - `node --check movie-warm-start.js`
  - `node --check page-warm-start.js`
  - `node --check tools/smoke-check.mjs`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
- Follow-up:
  - Recheck fast Back/Forward returns by scrolling immediately after the restored catalog/movie/profile page appears; full hydration should not jump back to the top or to the old saved position.

## 2026-09-17 - Add secondary page warm-start snapshots

- Files:
  - `page-warm-start.js`
  - `app.js`
  - `app-script-loader.js`
  - `user.html`
  - `following.html`
  - `notifications.html`
  - `editor.html`
  - `name.html`
  - `directors.html`
  - `_headers`
  - `functions/app-assets/[version].js`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added shared `page-warm-start.js` for secondary pages: `/user/*`, `/following`, `/notifications`, `/editor`, `/name/*`, and `/directors`.
  - Secondary pages now save sanitized DOM snapshots after successful page init and on `pagehide`, keyed by route/build/user/global mutation stamp/local dependency stamps.
  - Warm-started secondary pages use the same reveal contract as catalog/movie detail: restored DOM is shown only after page styles are available, with shared-header space reserved until the header mounts.
  - Secondary page controllers skip only their first loading-state render while a warm DOM snapshot is being hydrated, so restored content is not immediately replaced by a loading screen.
  - Smoke checks now enforce that future secondary HTML shells include the shared warm-start script/rules and that app startup clears `app-page-warm-started`.
- Checks:
  - `node --check page-warm-start.js`
  - `node --check app.js`
  - `node --check app-script-loader.js`
  - `node --check user-page.js`
  - `node --check notifications-page.js`
  - `node --check following-page.js`
  - `node --check editor-page.js`
  - `node --check director-page.js`
  - `node --check tools/smoke-check.mjs`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
- Follow-up:
  - Recheck repeated browser Back/Forward on profile, notifications, following, editor, person, and directors pages after one complete load.

## 2026-09-17 - Accelerate warm-start stylesheet readiness

- Files:
  - `boot-loader.js`
  - `index.html`
  - `movie.html`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a same-tab, same-build stylesheet cache in `sessionStorage` so already visited catalog/movie shells can apply cached page CSS before live stylesheet requests finish.
  - Kept live CSS loading as the source of truth and refreshes/removes cached inline styles once the real stylesheets load.
  - Changed catalog/movie warm-start boot-shell hiding so a restored DOM snapshot no longer creates an empty dark screen before styles are ready.
- Checks:
  - `node --check boot-loader.js`
  - `node --check app-script-loader.js`
  - `node --check tools/smoke-check.mjs`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
- Follow-up:
  - Recheck repeated catalog <-> movie browser Back/Forward returns after one full page load; valid warm pages should appear as soon as cached CSS and DOM snapshots are available.

## 2026-09-15 - Make browser history warm-start deterministic

- Files:
  - `index.html`
  - `boot-loader.js`
  - `catalog-warm-start.js`
  - `movie-warm-start.js`
  - `app.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Changed catalog warm-start to depend on a valid same-tab DOM snapshot instead of requiring a separate fast-return or Back/Forward navigation hint.
  - Added route-keyed movie detail DOM snapshot storage so browser Back/Forward can restore more than the single most recently viewed movie detail page.
  - Persisted the current movie detail DOM snapshot on `pagehide` to avoid timing races when leaving a detail page before deferred sections finish.
- Checks:
  - `node --check app.js`
  - `node --check boot-loader.js`
  - `node --check catalog-warm-start.js`
  - `node --check movie-warm-start.js`
  - `node --check tools/smoke-check.mjs`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
- Follow-up:
  - Recheck repeated browser Back/Forward across catalog and multiple movie detail pages; valid previously loaded pages should avoid the boot loader consistently.

## 2026-09-15 - Reserve movie admin action space

- Files:
  - `movie-page.css`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Kept the movie detail admin action block in layout while hidden, using `visibility`/`opacity`/`pointer-events` instead of `display: none`.
  - Added a smoke guard so late auth/admin synchronization cannot reintroduce a topbar layout shift when edit/delete buttons appear.
- Checks:
  - `node --check tools/smoke-check.mjs`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
- Follow-up:
  - Recheck movie detail warm load as an admin; edit/delete buttons should appear without nudging the top content.

## 2026-09-15 - Warm-start browser Back and movie header geometry

- Files:
  - `index.html`
  - `catalog-warm-start.js`
  - `movie-page.css`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Allowed catalog warm-start to run on browser Back/Forward navigations when a valid DOM snapshot exists, even if the in-app fast-return flag was not set by a catalog-return link.
  - Matched the movie detail warm summary skeleton heights to the real rating panel/button heights so the upper detail layout does not shift when hydration replaces the warm snapshot.
  - Added smoke guards for Back/Forward catalog warm-start and stable movie summary skeleton sizing.
- Checks:
  - `node --check catalog-warm-start.js`
  - `node --check tools/smoke-check.mjs`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
- Follow-up:
  - Recheck dev by opening a movie from the catalog, using the browser Back button, and comparing the warmed movie detail top area with the fully hydrated state.

## 2026-09-15 - Stabilize catalog warm section header

- Files:
  - `index.html`
  - `movie.html`
  - `catalog-warm-start.js`
  - `catalog-return-cache.js`
  - `app.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Extended catalog DOM snapshots with the full `.movies-section-header`, including the catalog view toggle, so warm-started catalog returns do not append that control later and shift the section layout.
  - Bumped the catalog snapshot version to invalidate old DOM snapshots that did not contain the section header.
  - Matched catalog/movie warm-start body overflow to the final page scrollbar policy to avoid scrollbar-driven micro shifts.
- Checks:
  - `node --check app.js`
  - `node --check catalog-warm-start.js`
  - `node --check catalog-return-cache.js`
  - `node --check tools/smoke-check.mjs`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
- Follow-up:
  - Recheck dev with overlaid warm-start and fully hydrated catalog screenshots; `.section.movies-section` should now align without the internal header/toggle offset.

## 2026-09-15 - Add stable movie warm-start boot path

- Files:
  - `index.html`
  - `movie.html`
  - `movie-warm-start.js`
  - `app.js`
  - `app-page-runtime.js`
  - `app-script-loader.js`
  - `movie-page-orchestrator.js`
  - `_headers`
  - `functions/app-assets/[version].js`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a pre-CSS catalog fast-return hint so the boot loader animation delay is known before critical CSS runs and cannot visually restart.
  - Added `movie-warm-start.js` for movie detail pages; it restores a valid saved detail DOM snapshot before the full app starts.
  - Movie detail DOM snapshots deliberately replace user/social/similar live zones with loading states, so static movie content can be warm-started without trusting stale ratings, watchlist state, reviews, comments, or similar movies.
  - Movie detail page runtime now defers `app-ready` until the page has selected a warm DOM, skeleton, cache render, or not-found state.
- Checks:
  - `node --check app.js`
  - `node --check app-page-runtime.js`
  - `node --check app-script-loader.js`
  - `node --check movie-page-orchestrator.js`
  - `node --check movie-warm-start.js`
  - `node --check tools/smoke-check.mjs`
  - `node --check tools/asset-size-report.mjs`
  - `node --check "functions/app-assets/[version].js"`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
- Follow-up:
  - Verify dev hard refresh and repeated returns to the same movie detail page: no double boot-loader flash, and dynamic zones hydrate after the warm static content.

## 2026-09-15 - Reveal warm pages after CSS only

- Files:
  - `index.html`
  - `movie.html`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Changed catalog and movie warm-start reveal rules to wait only for `app-styles-ready`, not full `app-shared-ui-ready`.
  - Added a temporary empty-header reserve for warm-started catalog/movie shells so cached content appears quickly while the shared header mounts without causing a layout jump.
- Checks:
  - `node --check tools/smoke-check.mjs`
  - `node tools/smoke-check.mjs`
  - `git diff --check`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
- Follow-up:
  - Recheck warm catalog/movie returns on dev; cached pages should appear almost immediately after CSS applies, without the previous multi-second dark wait.

## 2026-09-15 - Prevent native controls leaking during boot

- Files:
  - `index.html`
  - `movie.html`
  - `user.html`
  - `following.html`
  - `notifications.html`
  - `editor.html`
  - `name.html`
  - `directors.html`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Changed the pre-`app-ready` static shell hiding from `visibility: hidden` to `display: none` across HTML shells.
  - Kept the catalog warm-start exception by explicitly redisplaying the shell only after the warm DOM, styles, and shared UI are ready.
  - Added smoke guards so descendant form-control visibility rules cannot make native selects leak over the boot screen again.
- Checks:
  - `node --check tools/smoke-check.mjs`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
- Follow-up:
  - Recheck dev hard refresh and catalog return for the sort select flash.

## 2026-09-15 - Keep catalog shell hidden until first real render

- Files:
  - `app.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Stopped marking the catalog shell ready immediately after rendering the intermediate skeleton.
  - Catalog `app-ready` now waits for a valid snapshot restore or the first real catalog render, preventing standalone controls such as the sort select from flashing before the movie grid is ready.
- Checks:
  - `node --check app.js`
  - `node --check tools/smoke-check.mjs`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
  - `rg -n "onSkeletonRendered|renderMoviesSkeleton\\(\\);\\s*signalCatalogShellReady|signalCatalogShellReady\\(\\);" app.js`
- Follow-up:
  - Recheck primary catalog load after a cache reset and same-tab returns from movie detail pages.

## 2026-09-15 - Stabilize catalog warm returns

- Files:
  - `index.html`
  - `catalog-warm-start.js`
  - `catalog-return-cache.js`
  - `app.js`
  - `app-page-runtime.js`
  - `app-script-loader.js`
  - `_headers`
  - `functions/app-assets/[version].js`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a catalog-only warm-start script that restores a valid saved catalog DOM snapshot before the full app finishes loading, while keeping the page hidden until styles and shared UI are ready.
  - Extended catalog DOM snapshots with quick preset, active filter, result count, and pagination fragments so fast returns do not reveal partial toolbar/list states.
  - Made same-tab catalog-return links from movie pages use browser history when the movie page was actually opened from the catalog, preserving the previous catalog document when possible.
- Checks:
  - `node --check catalog-warm-start.js`
  - `node --check app-page-runtime.js`
  - `node --check app-script-loader.js`
  - `node --check app.js`
  - `node --check catalog-return-cache.js`
  - `node --check "functions/app-assets/[version].js"`
  - `node --check tools/asset-size-report.mjs`
  - `node --check tools/smoke-check.mjs`
  - `git diff --check`
  - `node tools/smoke-check.mjs`
  - `node tools/asset-size-report.mjs --compare tools/asset-size-baseline.json`
  - Inline Node VM smoke: valid catalog warm-start restored DOM/result/preset state, while a stale local data stamp skipped warm-start.
- Follow-up:
  - Verify same-tab catalog returns on dev after deployment, especially browser Back, the in-page back link, and the shared logo.

## 2026-09-15 - Space review text from header

- Files:
  - `movie-page.css`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Increased the vertical gap between a review card header/meta and the review text.
  - Kept collapsed long reviews on the same spacing so the text no longer sticks to the rating line before expansion.
- Checks:
  - `git diff --check -- movie-page.css docs/RECENT_CHANGES.md`
  - Inline Node smoke: verified base and collapsed review text use `--movie-review-space`.
- Follow-up:
  - Continue the catalog warm-start fix after this visual spacing pass is confirmed.

## 2026-08-26 - Defer catalog shell until warm state

- Files:
  - `app.js`
  - `app-page-runtime.js`
  - `app-script-loader.js`
  - `boot-loader.js`
  - `index.html`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Changed page runtime so the catalog can defer `app-ready` until it has restored a valid snapshot/DOM state or rendered the real catalog skeleton.
  - Added a catalog fast-return startup hint in `boot-loader.js` that delays the visible boot shell when a same-tab return has a saved DOM snapshot.
  - Removed the fast-return hint when the app marks itself ready, preventing stale startup classes after hydration.
- Checks:
  - `node --check app.js`
  - `node --check app-page-runtime.js`
  - `node --check app-script-loader.js`
  - `node --check boot-loader.js`
  - `node tools\smoke-check.mjs`
  - `git diff --check`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - Inline Node smoke: catalog page runtime deferred `app-ready` until `initCatalogPage` called `onShellReady`, while non-catalog pages kept the previous immediate shell-ready behavior.
  - Inline Node smoke: `boot-loader.js` marked `html.app-catalog-fast-return-pending` when a catalog fast-return flag and DOM snapshot existed.
- Follow-up:
  - Verify same-tab catalog returns on dev/local browser after deployment and keep extending page-level cache invalidation only where data actually changes.

## 2026-08-26 - Cache profile page data by dependencies

- Files:
  - `app.js`
  - `user-page.js`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added local per-movie dependency stamps so a movie update can invalidate secondary page caches without bumping the global catalog mutation stamp.
  - Added a `/user/*` session page-data cache keyed by profile handle, viewer id, poster preference, build version, global mutation stamp, and the movie dependencies used by the profile page.
  - Profile display-name and avatar saves now clear the profile page-data cache so cached own-profile pages do not keep stale identity data.
- Checks:
  - `node --check app.js`
  - `node --check user-page.js`
  - `node tools\smoke-check.mjs`
  - `git diff --check`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - Inline Node smoke: `/user/*` data cache reused the sessionStorage entry on a second controller init.
- Follow-up:
  - Extend the same dependency-cache approach to public person pages, then evaluate whether notifications should use a short-lived render cache or stay fully fresh.

## 2026-08-25 - Target movie update cache refresh

- Files:
  - `app.js`
  - `movie-editor.js`
  - `movie-detail-cache.js`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Existing movie updates now try a targeted one-movie refresh instead of globally invalidating the catalog snapshot and reloading the full movie list.
  - Patched the loaded catalog row, catalog session snapshot, poster-gallery cache, Letterboxd match cache, and cached similar-card references for the updated movie.
  - Kept global data mutation/full catalog reload as fallback, and left movie create/delete on the safer full invalidation path because they change catalog membership.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check movie-detail-cache.js`
  - `git diff --check`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
- Follow-up:
  - Verify an authenticated admin edit path on dev and continue with page dependency tracking for profile/person/notification caches.

## 2026-08-25 - Snapshot-first catalog return

- Files:
  - `app.js`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Changed catalog startup to hydrate from a valid session/DOM snapshot before rendering skeletons.
  - Allowed valid same-user catalog snapshots to skip the initial network reload until build version, poster preference, age, or local data mutation invalidates them.
  - Added same-tab catalog-link preparation for secondary pages so movie detail back links and the shared logo can return to the saved catalog state.
- Checks:
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
- Follow-up:
  - Add targeted movie/page dependency invalidation so edits refresh only affected cached pages.

## 2026-08-23 - Fix person movie grid columns

- Files:
  - `director-page.css`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added person-page local movie grid variables and responsive breakpoints so `/name/*` movie cards no longer depend on catalog-only CSS variables.
  - Restored multi-column movie cards on person/director pages after the catalog CSS split.
- Checks:
  - PostCSS parse: `director-page.css`, `styles.css`, `catalog-page.css`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `rg -n "catalog-columns|catalog-grid-gap" director-page.css` returned no matches
  - `git diff --check`
- Follow-up:
  - Continue CSS tightening with remaining global shared controls and card/rail primitives.

## 2026-08-23 - Move profile settings CSS to user page

- Files:
  - `styles.css`
  - `user-page.css`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved profile settings modal, display-name form, and profile avatar primitive styles out of global `styles.css` into page-only `user-page.css`.
  - Kept shared back-link and movie rail/card primitives in `styles.css` because secondary pages, notifications, movie detail rails, and person pages reuse them.
- Checks:
  - PostCSS parse: `styles.css`, `user-page.css`, `catalog-page.css`, `movie-page.css`, `movie-editor.css`, `secondary-pages.css`, `following-page.css`, `notifications-page.css`, `editor-page.css`, `director-page.css`, `directors-admin-page.css`, `director-form.css`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
- Follow-up:
  - Continue CSS tightening with remaining global shared controls and card/rail primitives.

## 2026-08-23 - Split profile page CSS

- Files:
  - `styles.css`
  - `user-page.css`
  - `boot-loader.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved profile page-only layout, stats, taste, section-header, follow-button, settings-button, and admin-password panel styles out of global `styles.css` into page-only `user-page.css`.
  - Updated `boot-loader.js` to load `user-page.css` only for `data-app-page="user"`.
  - Kept shared profile avatar primitives, back links, movie rails, rail arrows, and rail cards in `styles.css` because profile settings, secondary pages, notifications, and movie detail rails reuse them.
  - Registered `user-page.css` in `/app-assets`, cache headers, asset-size reporting, and smoke guards.
- Checks:
  - `node --check boot-loader.js`
  - `node --check "functions/app-assets/[version].js"`
  - `node --check tools\asset-size-report.mjs`
  - `node --check tools\smoke-check.mjs`
  - PostCSS parse: `styles.css`, `user-page.css`, `catalog-page.css`, `movie-page.css`, `movie-editor.css`, `secondary-pages.css`, `following-page.css`, `notifications-page.css`, `editor-page.css`, `director-page.css`, `directors-admin-page.css`, `director-form.css`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - Boot-loader VM route check: `/user/*` loads `styles.css + user-page.css`; catalog and movie routes do not load `user-page.css`.
- Follow-up:
  - Continue CSS tightening with remaining global shared controls and card primitives.

## 2026-08-23 - Document PowerShell colon interpolation trap

- Files:
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Documented that PowerShell variables immediately followed by `:` in strings, such as `$i:`, must be written as `${i}:` to avoid parser errors.
- Checks:
  - `node tools\smoke-check.mjs`
  - `git diff --check`
- Follow-up:
  - Keep adding repeatable local workflow traps to the context map as they appear.

## 2026-08-23 - Lazy-load movie editor CSS

- Files:
  - `styles.css`
  - `movie-editor.css`
  - `app.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Split movie add/edit modal-only CSS out of startup `styles.css` into lazy `movie-editor.css`.
  - Added a shared lazy stylesheet loader in `app.js` and made movie editor entry points load `movie-editor.css` before mounting/opening/filling the modal.
  - Registered `movie-editor.css` in `/app-assets`, cache headers, asset-size reporting, and smoke guards.
- Checks:
  - `node --check app.js`
  - `node --check "functions/app-assets/[version].js"`
  - `node --check tools\asset-size-report.mjs`
  - `node --check tools\smoke-check.mjs`
  - PostCSS parse: `styles.css`, `movie-editor.css`, `catalog-page.css`, `movie-page.css`, `secondary-pages.css`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - Browser smoke: local catalog did not load `movie-editor.css` on startup; clicking the add-movie button lazy-loaded `/movie-editor.css?v=dev-local-27` and mounted/opened the movie form.
  - `git diff --check`
- Follow-up:
  - Continue CSS tightening with remaining global form/control/button rules.

## 2026-08-22 - Move catalog CSS variables

- Files:
  - `styles.css`
  - `catalog-page.css`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved catalog-only CSS custom properties for grid columns, grid gaps, pagination sizing, and month/year title sizing from global `styles.css` into page-only `catalog-page.css`.
  - Kept shared movie-card typography variables in `styles.css`, because catalog cards are reused by profile rails, person/director pages, and similar-film blocks.
- Checks:
  - PostCSS parse: `styles.css`, `catalog-page.css`, `movie-page.css`, `secondary-pages.css`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - Browser smoke: local `index.html` loaded `/catalog-page.css`, exposed catalog CSS variables, and reached `app-ready`; local `user.html` reached `app-ready` without loading `/catalog-page.css`.
  - `git diff --check`
- Follow-up:
  - Continue CSS tightening with remaining global card/form/shared values and only split them when reuse boundaries are clean.

## 2026-08-22 - Split catalog page CSS

- Files:
  - `styles.css`
  - `catalog-page.css`
  - `boot-loader.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Started the CSS optimization backlog contour by moving catalog-only shell/control styles out of global `styles.css` and into page-only `catalog-page.css`.
  - Kept shared movie card primitives in `styles.css` because catalog, profile rails, person/director grids, similar movies, and empty/fallback states reuse them.
  - Updated `boot-loader.js` to load `catalog-page.css` only for `data-app-page="catalog"`.
  - Registered the new stylesheet in `/app-assets`, `_headers`, smoke checks, and asset-size reporting.
  - Documented the local PowerShell compatibility trap around null-conditional `?.` usage after it failed during browser smoke setup.
- Checks:
  - `node --check boot-loader.js`
  - `node --check "functions/app-assets/[version].js"`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - PostCSS parse: `styles.css`, `catalog-page.css`, `movie-page.css`, `secondary-pages.css`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - Browser smoke: local `index.html` loaded `/styles.css` and `/catalog-page.css`, reached `app-ready`, and kept catalog toolbar/grid/presets displays; local `user.html` reached `app-ready` without loading `/catalog-page.css`.
  - `git diff --check`
- Follow-up:
  - Continue CSS tightening with remaining shared/card/form values, then consider page-specific card style splits where reuse boundaries are clean.

## 2026-08-22 - Document PowerShell query-string interpolation trap

- Files:
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a local workflow trap for PowerShell URL strings where `$version?file=...` is parsed as a different variable name and sends a broken `/app-assets/=...` request.
  - Documented the safer `${version}?file=...` interpolation style for direct versioned asset checks.
- Checks:
  - `node tools\smoke-check.mjs`
- Follow-up:
  - Keep using braced variables in PowerShell commands that place punctuation immediately after an interpolated value.

## 2026-08-22 - Document inline JS diagnostic encoding trap

- Files:
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a local workflow trap for inline Node/JS diagnostics piped through PowerShell after a Russian regex literal was mojibaked into `?` characters and broke a dev-route smoke script.
  - Documented the safer pattern: keep diagnostic regex/search literals ASCII-only and assert Russian UI state through DOM selectors/classes or exact UTF-8 file reads.
- Checks:
  - `node tools\smoke-check.mjs`
- Follow-up:
  - Keep adding concrete command/encoding traps here when they recur during project work.

## 2026-08-22 - Restore user page count helper

- Files:
  - `app.js`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Fixed the `/user/*` startup regression caused by `getUserPageControllerContext()` passing `addCount` after the shared profile data refactor while the helper was missing from `app.js`.
  - Restored the shared `addCount` helper used by `user-page.js` for profile taste stats and activity rank count maps.
  - Added a smoke-check guard for the `app.js` to `user-page.js` count-helper bridge so this contract cannot disappear silently in later lazy-module refactors.
- Checks:
  - `node --check app.js`
  - `node --check user-page.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `git diff --check`
- Follow-up:
  - Continue with the current optimization backlog after the profile route fix is verified on `dev`.

## 2026-08-22 - Extract profile data actions

- Files:
  - `app.js`
  - `profile-data-actions.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Completed the shared profile/auth helpers backlog contour for the current optimization stage.
  - Added lazy `profile-data-actions.js` for Supabase profile reads: current-user role/profile payload, public profile lookup by handle, public profile batch lookup by id, and optional-column fallback for `profiles`.
  - Removed profile select orchestration helpers and direct public/current profile `profiles` queries from `app.js`.
  - Kept `app.js` responsible for current profile/role state, public profile caches, UI reactions to missing optional columns, and page rerender bridges.
  - Registered the new lazy asset in `/app-assets`, `_headers`, smoke checks, and size reporting.
- Checks:
  - `node --check app.js`
  - `node --check profile-data-actions.js`
  - `node --check profile-settings-actions.js`
  - `node --check profile-follow-actions.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check "functions/app-assets/[version].js"`
  - `node -e "import('./profile-data-actions.js').then(...)"`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles stay about `10.2 KiB` brotli below the saved baseline; `profile-data-actions.js` stays lazy-loaded outside startup profiles.
- Follow-up:
  - Move to backlog point 6: CSS/global style tightening, or pick a new optimization contour if priorities changed.

## 2026-08-22 - Extract profile follow actions

- Files:
  - `app.js`
  - `following-page.js`
  - `profile-follow-actions.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Continued the shared profile/auth helpers backlog contour.
  - Added lazy `profile-follow-actions.js` for Supabase reads/writes around followed profiles and per-follow notification preferences.
  - Moved user-page follow/unfollow writes and `/following` follow/preference data actions behind the shared lazy action module.
  - Kept `app.js` responsible for current followed-profile state, auth gates, user-page button state, and feedback messages; kept `following-page.js` responsible for page UI/rendering.
  - Registered the new lazy asset in `/app-assets`, `_headers`, smoke checks, and size reporting.
- Checks:
  - `node --check app.js`
  - `node --check following-page.js`
  - `node --check profile-follow-actions.js`
  - `node --check profile-settings-actions.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check "functions/app-assets/[version].js"`
  - `node -e "import('./profile-follow-actions.js').then(...)"`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles stay about `10.0 KiB` brotli below the saved baseline; `profile-follow-actions.js` stays lazy-loaded outside startup profiles.
- Follow-up:
  - Continue this contour with any remaining poster preference UI bridges or broader auth/profile cleanup.

## 2026-08-22 - Extract profile settings actions

- Files:
  - `app.js`
  - `profile-settings-actions.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Continued the shared profile/auth helpers backlog contour.
  - Added lazy `profile-settings-actions.js` for rare profile settings writes: display-name availability/saving, poster preference saving, password verification/update, avatar Storage upload/delete, and `profiles.avatar_url` updates.
  - Kept `app.js` responsible for form validation/focus, user-facing status messages, crop/modal UI, local profile state mutation, and post-save rerender/cache bridges.
  - Registered the new lazy asset in `/app-assets`, `_headers`, smoke checks, and size reporting.
- Checks:
  - `node --check app.js`
  - `node --check profile-settings-actions.js`
  - `node --check profile-utils.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check "functions/app-assets/[version].js"`
  - `node -e "import('./profile-settings-actions.js').then(...)"`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles stay about `10.1 KiB` brotli below the saved baseline; `profile-settings-actions.js` stays lazy-loaded outside startup profiles.
- Follow-up:
  - Continue this contour with follow actions or remaining profile/poster preference UI bridges.

## 2026-08-22 - Extract shared profile utils

- Files:
  - `app.js`
  - `profile-utils.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Started the shared profile/auth helpers backlog contour.
  - Added shared `profile-utils.js` for pure profile display/cache helpers: display-name normalization and validation, public profile display name/handle, current-user display name/handle derivation, safe avatar URL parsing, user-page avatar HTML, public profile cache merging, and `prefer_russian_posters` checks.
  - Kept `app.js` responsible for Supabase profile reads/writes, auth state, avatar upload/delete actions, profile settings UI, follow actions, and poster-preference dependent UI refreshes.
  - Registered the new shared startup asset in `/app-assets`, `_headers`, smoke checks, and size reporting.
- Checks:
  - `node --check app.js`
  - `node --check profile-utils.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check "functions/app-assets/[version].js"`
  - `node -e "import('./profile-utils.js').then(...)"`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `10.1 KiB` brotli below the saved baseline with `profile-utils.js` included in shared startup accounting.
- Follow-up:
  - Continue this contour with avatar/settings actions or follow actions.

## 2026-08-22 - Extract catalog render module

- Files:
  - `app.js`
  - `catalog-render.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Continued the catalog module split backlog item and completed the current catalog split stage.
  - Added lazy `catalog-render.js` for catalog list/month DOM fragment rendering, month section controls, year headings, month-local sorting, and catalog DOM render signatures.
  - Kept `app.js` responsible for catalog data derivation, pagination and active-chip rendering, skeleton/empty states, priority-poster budgeting, structured data, DOM replacement timing, and snapshot persistence.
  - Registered the new lazy asset in `/app-assets`, `_headers`, smoke checks, and size reporting.
- Checks:
  - `node --check app.js`
  - `node --check catalog-render.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check "functions/app-assets/[version].js"`
  - `node -e "import('./catalog-render.js').then(...)"`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `10.9 KiB` brotli below the saved baseline.
- Follow-up:
  - Move to shared profile/auth helpers or CSS tightening.

## 2026-08-22 - Extract catalog cards module

- Files:
  - `app.js`
  - `catalog-cards.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Continued the catalog module split backlog item.
  - Added lazy `catalog-cards.js` for catalog movie card DOM/HTML rendering: rating summary, current-user rating controls, poster/watchlist/watched overlay HTML, highlighted title/meta fields, profile-rating badges, and admin card action buttons.
  - Kept `app.js` responsible for catalog state, skeleton/empty-state rendering, external-link precomputed metadata, poster transform helpers, event handlers, and DOM replacement bridges.
  - Loaded the card controller on catalog pages and person/director pages, because director filmographies reuse catalog cards.
  - Registered the new lazy asset in `/app-assets`, `_headers`, smoke checks, and size reporting.
- Checks:
  - `node --check app.js`
  - `node --check catalog-cards.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check "functions/app-assets/[version].js"`
  - `node -e "import('./catalog-cards.js').then(...)"`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `10.1 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue with smaller catalog render bridges or shared profile/auth helpers.

## 2026-08-22 - Extract catalog return cache module

- Files:
  - `app.js`
  - `catalog-return-cache.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Continued the catalog module split backlog item.
  - Added lazy `catalog-return-cache.js` for catalog fast-return flags, session/DOM snapshot storage reads and writes, snapshot validity envelopes, snapshot signatures, data-signature hashes, and DOM snapshot payload shaping.
  - Kept `app.js` responsible for concrete catalog payload composition, DOM hydration, scroll/anchor restore, and local data mutation bridges.
  - Registered the new lazy asset in `/app-assets`, `_headers`, smoke checks, and size reporting.
- Checks:
  - `node --check app.js`
  - `node --check catalog-return-cache.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check "functions/app-assets/[version].js"`
  - `node -e "import('./catalog-return-cache.js').then(...)"`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `9.0 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue catalog module split with catalog card rendering.

## 2026-08-22 - Extract catalog filters module

- Files:
  - `app.js`
  - `catalog-filters.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Continued the catalog module split backlog item.
  - Added lazy `catalog-filters.js` for filter state shaping, movie filter matching, numeric range matching, dynamic filter option counts, and filter-modal chip scoping.
  - Kept `app.js` responsible for reading filter controls, building user-facing chip labels, refreshing select/range UI, sorting, pagination slicing, and rendering.
  - Registered the new lazy asset in `/app-assets`, `_headers`, smoke checks, and size reporting.
- Checks:
  - `node --check app.js`
  - `node --check catalog-filters.js`
  - `node --check catalog-presets.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check "functions/app-assets/[version].js"`
  - `node tools\smoke-check.mjs`
  - `node -e "import('./catalog-filters.js').then(...)"`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `8.9 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue catalog module split with card rendering or catalog return-state cache.

## 2026-08-22 - Extract catalog presets module

- Files:
  - `app.js`
  - `catalog-presets.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Continued the catalog module split backlog item.
  - Added lazy `catalog-presets.js` for quick preset active-state detection, route-preset validation, auth gating, preset filter patches, and quick preset button state sync.
  - Kept `app.js` responsible for actual filter control mutation, custom-select refresh, render scheduling, and the mobile preset scroll hint.
  - Registered the new lazy asset in `/app-assets`, `_headers`, smoke checks, and size reporting.
- Checks:
  - `node --check app.js`
  - `node --check catalog-presets.js`
  - `node --check catalog-url-state.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check "functions/app-assets/[version].js"`
  - `node tools\smoke-check.mjs`
  - `node -e "import('./catalog-presets.js').then(...)"`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles remain about `8.1 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue catalog module split with filters, card rendering, or catalog return-state cache.

## 2026-08-22 - Extract catalog URL state module

- Files:
  - `app.js`
  - `catalog-url-state.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Continued the catalog module split backlog item.
  - Added lazy `catalog-url-state.js` for catalog query param parsing/building, value aliases, boolean parsing, and search params serialization.
  - Kept `app.js` responsible for catalog controls, current state, profile activity state, and history replace/push.
  - Registered the new lazy asset in `/app-assets`, `_headers`, smoke checks, and size reporting.
- Checks:
  - `node --check app.js`
  - `node --check catalog-url-state.js`
  - `node --check catalog-pagination.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check "functions/app-assets/[version].js"`
  - `node tools\smoke-check.mjs`
  - `node -e "import('./catalog-url-state.js').then(...)"`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `8.1 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue catalog module split with filters, presets, card rendering, or return-state cache.

## 2026-08-22 - Extract catalog pagination module

- Files:
  - `app.js`
  - `catalog-pagination.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Started the catalog module split backlog item.
  - Added lazy `catalog-pagination.js` for pagination math, page-slot/ellipsis calculation, pagination controls HTML, and result-count text.
  - Kept `app.js` responsible for current page state, pagination DOM containers, events, and catalog render scheduling.
  - Registered the new lazy asset in `/app-assets`, `_headers`, smoke checks, and size reporting.
- Checks:
  - `node --check app.js`
  - `node --check catalog-pagination.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check "functions/app-assets/[version].js"`
  - `node tools\smoke-check.mjs`
  - `node -e "import('./catalog-pagination.js').then(...)"`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `7.6 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue catalog module split with filters, presets, URL params, card rendering, or return-state cache.

## 2026-08-22 - Split Letterboxd import match payload

- Files:
  - `app.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Finished the current Supabase payload/select audit contour.
  - Removed import-only `letterboxd_short_url` from `MOVIE_CATALOG_SELECT`.
  - Added `MOVIE_LETTERBOXD_IMPORT_MATCH_SELECT` and a cached compact import index for strict Letterboxd/Boxd URL matching.
  - Letterboxd ratings import no longer loads the full catalog when only URL matching is needed.
  - Added smoke coverage so the catalog payload and import payload stay separated.
- Checks:
  - `node --check app.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
- Follow-up:
  - Move to backlog item 4: catalog module split.

## 2026-08-22 - Trim poster gallery display payloads

- Files:
  - `app.js`
  - `tools/smoke-check.mjs`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Continued the movie detail RPC/fallback payload audit.
  - Kept `MOVIE_DETAIL_SELECT` intact because its fields are used by the public movie header, SEO, external links, and metadata.
  - Added `MOVIE_POSTER_IMAGE_DISPLAY_SELECT` for public poster gallery and Russian-poster preference reads.
  - Removed unused `movie_poster_images.id` from single-movie and batch poster-gallery display fetches.
  - Added smoke coverage so display poster reads do not drift back to the wider row payload.
- Checks:
  - `node --check app.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles remain about `7.1 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue payload/select audit with catalog payload and any remaining movie detail fallback edges.

## 2026-08-22 - Add explicit people select profiles

- Files:
  - `app.js`
  - `director-page.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Continued the Supabase payload/select audit with public person pages, movie detail director links, and the `/directors` admin list.
  - Added `PEOPLE_PUBLIC_SELECT`, `PEOPLE_ADMIN_SELECT`, and `PEOPLE_MOVIE_LINK_SELECT`.
  - Replaced public `/name/*` fallback `people.select('*')` reads with the public select profile.
  - Replaced movie detail `movie_people -> people (*)` link reads with the compact director-link select.
  - Replaced admin people list/modal reads and post-save returned rows with the admin select profile.
  - Added smoke coverage so public/admin people reads do not drift back to wildcard selects.
- Checks:
  - `node --check app.js`
  - `node --check director-page.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles remain about `7.2 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue payload/select audit with movie detail RPC fallback and catalog payload.

## 2026-08-22 - Trim profile activity row payloads

- Files:
  - `user-page.js`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Continued the Supabase payload/select audit with the profile page.
  - Removed unused `updated_at` from profile rating rows; rating rails still sort by `created_at`.
  - Removed unused `id` from profile review rows; review rails still keep `created_at`/`updated_at` for newest-activity sorting.
  - Documented the compact activity row payload expected by the profile page.
- Checks:
  - `node --check user-page.js`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles remain about `7.3 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue payload/select audit with person/director and movie detail payloads.

## 2026-08-22 - Split notification movie payloads

- Files:
  - `app.js`
  - `notifications-page.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Started the Supabase payload/select audit with the notifications page.
  - Added `MOVIE_NOTIFICATION_LINK_SELECT` for non-digest notification movie links (`id`, `slug`, `title`, `year`).
  - Kept `MOVIE_USER_PAGE_CARD_SELECT` for new-movie digest cards where `poster_url` and `original_title` are actually rendered.
  - Split notification movie fetching so poster preference enrichment runs only for digest card movies.
  - Added smoke coverage for the link-vs-digest select boundary.
- Checks:
  - `node --check app.js`
  - `node --check notifications-page.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `7.3 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue payload/select audit with catalog/profile/person/detail payloads.

## 2026-08-22 - Close movie editor optimization contour

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Finished the movie editor contour audit and marked backlog item 2 complete for the current optimization stage.
  - Moved poster-file feedback text handling into lazy `movie-editor.js`.
  - Kept the remaining `app.js` movie-modal code as shell bridge: mount/bind/open/close, custom-select refresh, draft state assignment, Supabase callbacks, and page/cache/render callbacks.
  - Added smoke coverage so poster-file feedback UI does not drift back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `7.3 KiB` brotli below the saved baseline.
- Follow-up:
  - Start backlog item 3: Supabase payload/select audit for catalog, profile rails/taste, notifications, person/director payload, and movie detail RPC fallback.

## 2026-08-22 - Move movie editor status submitting UI state

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie-modal submit disabled-state handling and status-message writes into lazy `movie-editor.js`.
  - Kept `app.js` responsible for the boolean `isMovieFormSubmitting`, the external add button state, poster draft rerender bridge, and a minimal status fallback if the lazy editor itself fails to load.
  - Reused the common form-status helper for the missing-movie update path instead of writing to `formMessage` inline.
  - Added smoke guards so modal button/file/list disabled logic stays outside `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `7.2 KiB` brotli below the saved baseline.
- Follow-up:
  - Audit the remaining movie-modal DOM event bridge and decide whether the movie editor backlog item is complete enough to move to payload/select audit.

## 2026-08-22 - Move movie editor form fill reset helpers

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie-modal create reset and edit fill DOM state into lazy `movie-editor.js`.
  - Expanded the movie editor form element/context bridge so the lazy editor owns title/button/message, format/tag, poster-file, and genre/country field assignment.
  - Kept `app.js` responsible for `editingMovieId`, poster/manual-similar draft state, async gallery/similar loading, custom select refresh, and opening the modal.
  - Added smoke guards so form fill/reset UI state does not drift back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `7.2 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup by auditing the remaining thin modal DOM bridge and deciding whether the second backlog item is complete.

## 2026-08-20 - Move movie editor poster event helpers

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie-modal poster draft click, drag-start, drag-end, drag-over, and drop DOM event mechanics into lazy `movie-editor.js`.
  - Kept `app.js` responsible for applying returned draft/drag state, dirty flags, object URL cleanup, and rerendering.
  - Added smoke guards so poster-specific DOM selector and dataTransfer logic do not drift back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `6.8 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup with the remaining form fill/reset UI state and the thin modal DOM bridge.

## 2026-08-20 - Move movie editor poster draft list renderer

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved the movie-modal poster draft list HTML renderer into lazy `movie-editor.js`.
  - Reduced `app.js` poster draft rendering to a thin DOM assignment that passes current draft/submitting/drag state into the editor controller.
  - Removed the now-unused poster preview wrapper from `app.js` and added a smoke guard for the poster draft renderer boundary.
  - Documented the PowerShell `rg` quoting trap for patterns containing literal quotes or `|` alternatives.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `6.6 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup by moving the remaining poster/manual-similar event bridge or form fill/reset UI state where it can be isolated safely.

## 2026-08-20 - Move movie editor submit event wrapper

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie-modal submit duplicate guard, create/update routing, submitting-state reset, and save error wrapping into lazy `movie-editor.js`.
  - Kept `app.js` responsible for native form submit prevention, loading the lazy editor controller, and passing concrete create/update callbacks.
  - Added a smoke guard so the submit event wrapper stays in the lazy editor module.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles remain about `6.2 KiB` brotli below the saved baseline.
- Follow-up:
  - Finish the movie editor contour by auditing the remaining modal DOM bridge and editor UI state in `app.js`.

## 2026-08-20 - Move movie editor manual similar draft helpers

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie-modal manual-similar draft set/add/remove helpers, selectable/selected movie calculations, and list/options HTML helpers into lazy `movie-editor.js`.
  - Kept `app.js` responsible for modal DOM event bridge, local dirty flag assignment, and Supabase fetch/write callbacks.
  - Added a smoke guard so manual-similar draft/render helpers stay in the lazy editor module.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles remain about `6.1 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup with submit event routing and the remaining thin modal DOM bridge.

## 2026-08-20 - Move movie editor poster draft helpers

- Files:
  - `app.js`
  - `movie-editor.js`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie poster draft entry creation, preview helpers, object URL cleanup, file entry creation, move/remove operations, and movie-row-to-draft conversion into lazy `movie-editor.js`.
  - Reduced `app.js` poster editor handling to state assignment, dirty/submitting flags, DOM rendering, and event bridge callbacks.
  - Made edit-form filling load the movie editor controller before preparing poster draft state.
  - Documented the UTF-8/mojibake patching fallback that avoided retyping garbled Russian strings from PowerShell output.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles remain about `6.2 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup with the remaining manual-similar draft/UI bridge and submit event routing.

## 2026-08-20 - Move movie editor update submit orchestration

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved the movie update submit flow into lazy `movie-editor.js`, including validation, relation/manual-similar/poster diffing, poster upload resolution, movie row update, related writes, old poster cleanup, and post-save handoff.
  - Reduced `app.js` update handling to a thin wrapper that locates the current movie and passes state/render/write callbacks into the editor controller.
  - Tightened smoke guards so update-submit diff/write/post-save helpers do not drift back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `6.0 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup with the remaining modal DOM bridge and editor UI state.

## 2026-08-20 - Move movie editor create submit orchestration

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved the movie creation submit flow into lazy `movie-editor.js`, including draft validation, poster upload resolution, row insert, relation/gallery writes, and post-save handoff.
  - Reduced `app.js` create handling to a thin event wrapper that passes page, cache, relation, and status callbacks into the editor controller.
  - Tightened smoke guards so create-submit insert/post-save calls do not drift back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `5.4 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup with update-submit orchestration.

## 2026-08-20 - Move movie editor post-save orchestration

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie create/update post-save page synchronization decisions into lazy `movie-editor.js`.
  - Kept concrete catalog/detail rerender, cache, redirect, and status callbacks in `app.js`, but removed the post-save branching from submit orchestration.
  - Tightened smoke guards so create/update mutation stamps and detail reload calls do not drift back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `5.3 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup with the remaining modal submit wrapper/DOM bridge and editor UI state.

## 2026-08-20 - Move movie editor related write sequencing

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved create/update sequencing for movie relations, director links, manual similar movies, and poster galleries into lazy `movie-editor.js`.
  - Kept low-level write callbacks in `app.js`, but replaced the long submit-side `replace...` blocks with editor orchestration calls.
  - Tightened smoke guards so related-data write sequencing does not drift back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `5.3 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup with post-save UI/cache synchronization and remaining modal submit orchestration.

## 2026-08-20 - Move movie editor row writes

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved `movies` row insert/update writes from `app.js` submit functions into lazy `movie-editor.js`.
  - Passed Supabase write dependencies through the movie editor controller context, keeping service-role-free client writes only.
  - Kept relation, director, manual-similar, poster-gallery, and post-save page/cache synchronization in `app.js` for later smaller passes.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `5.1 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup with relation/manual-similar/gallery write sequencing and post-save synchronization.

## 2026-08-20 - Move movie editor save-plan helpers

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added lazy editor save-plan helpers for create/update submit decisions.
  - Replaced manual `app.js` checks for saving manual similar movies, poster galleries, no-op updates, movie-field updates, and old poster cleanup with `movie-editor.js` plan results.
  - Tightened smoke guards around the movie editor save-plan boundary.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `5.0 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup with Supabase write sequencing and post-save synchronization in a later pass.

## 2026-08-20 - Move movie editor relation and poster save prep

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie edit relation-change detection for genres, countries, and linked directors into lazy `movie-editor.js`.
  - Added lazy editor helpers for pending poster upload detection and resolved poster save results, so `app.js` no longer manually splits poster entries during add/update submit.
  - Tightened smoke guards for the movie editor boundary and marked the editor backlog item as in progress.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `5.1 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue movie editor cleanup by moving more add/update submit orchestration and Supabase write sequencing out of `app.js`.

## 2026-08-16 - Close movie detail orchestration backlog

- Files:
  - `app.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Removed remaining unused movie-page shell wrapper functions from `app.js`.
  - Switched movie detail skeleton/header/view-model rendering calls to use the lazy shell controller directly while keeping the poster-gallery callback bridge needed by interactions.
  - Tightened smoke guards and marked the movie detail orchestration backlog item as completed/maintenance-only.
- Checks:
  - `node --check app.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `4.6 KiB` brotli below the saved baseline.
- Follow-up:
  - Start backlog item 2: movie editor module/orchestration cleanup.

## 2026-08-16 - Move movie user-state mutation orchestration to lazy module

- Files:
  - `_headers`
  - `app.js`
  - `movie-user-state.js`
  - `functions/app-assets/[version].js`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added lazy `movie-user-state.js` for rating/watchlist mutation orchestration: duplicate-request guards, rating validation, watchlist add/remove branching, local mutation stamp/snapshot sync, rerender callbacks, feedback callbacks, and optional scroll preservation.
  - Kept `app.js` as the shared data bridge for rating/watchlist request sets, Supabase writes, local rating/watchlist arrays, index/stat updates, and catalog/detail rerenders.
  - Registered the module in versioned app assets, cache headers, asset-size reporting, and smoke guards.
- Checks:
  - `node --check app.js`
  - `node --check movie-user-state.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check "functions/app-assets/[version].js"`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `36.3 KiB` raw / `4.5 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue the movie detail orchestration contour with final detail bridge cleanup before moving to the movie editor contour.

## 2026-08-16 - Move movie detail init flow to orchestrator

- Files:
  - `app.js`
  - `movie-page-orchestrator.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie detail init/auth-sync orchestration into lazy `movie-page-orchestrator.js`, including session restore handoff, detail-module warmup, session/catalog cache restore, skeleton display, load-error fallback, and auth-sync reload handling.
  - Kept `app.js` as the bridge for lazy module loading, current movie state, render/status callbacks, cache helpers, and Supabase/data callbacks.
  - Tightened smoke guards so init/startup orchestration stays out of `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-orchestrator.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `35.3 KiB` raw / `4.4 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue the movie detail orchestration contour with rating/watchlist mutations, then final bridge cleanup.

## 2026-08-16 - Move movie detail page-load decision tree to orchestrator

- Files:
  - `app.js`
  - `movie-page-orchestrator.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved the movie detail load decision tree into lazy `movie-page-orchestrator.js`: RPC/fallback selection, auxiliary load task selection, cache-signature skip-render decisions, and deferred-section kickoff.
  - Kept `app.js` as a callback bridge for Supabase fetchers, current movie state, cache read/write, and render/status functions.
  - Tightened smoke guards so the page-load orchestration does not drift back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-orchestrator.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `34.7 KiB` raw / `4.4 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue the movie detail orchestration contour with init/auth fallback handling or rating/watchlist mutations in a later pass.

## 2026-08-16 - Move movie page route and deferred orchestration to lazy module

- Files:
  - `app.js`
  - `movie-page-orchestrator.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added lazy `movie-page-orchestrator.js` for movie detail route-param parsing and deferred section orchestration.
  - Moved similar/review/comment deferred loading coordination out of `app.js` while keeping Supabase fetchers, state, cache persistence, and render/status callbacks there.
  - Registered the module in versioned app assets, cache headers, asset-size reporting, and smoke guards.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-orchestrator.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `34.3 KiB` raw / `4.3 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue the movie detail orchestration contour with the main route/data load bridge or rating/watchlist mutations in a later pass.

## 2026-08-16 - Move movie similar loading to lazy module

- Files:
  - `app.js`
  - `movie-page-similar.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved deferred manual similar loading, stale-request protection, admin/public branching, and section rerender orchestration into lazy `movie-page-similar.js`.
  - Kept `app.js` as a thin bridge for movie-page state, Supabase/data fetch callbacks, and session-cache persistence.
  - Tightened smoke guards so similar loading orchestration does not drift back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-similar.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `34.1 KiB` raw / `4.3 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue the movie detail orchestration contour with route/data rendering or rating/watchlist mutations in a later pass.

## 2026-08-16 - Move movie similar save orchestration to lazy module

- Files:
  - `app.js`
  - `movie-page-similar.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved manual similar optimistic save, status, rollback, and final rerender orchestration into lazy `movie-page-similar.js`.
  - Kept manual similar state storage, the section wrapper, and the Supabase write callback in `app.js`.
  - Tightened smoke guards so manual similar save orchestration stays out of `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-similar.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `33.9 KiB` raw / `4.2 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue the movie detail orchestration contour with the remaining similar load/state bridge or route/data orchestration in a later pass.

## 2026-08-16 - Move movie similar editor events to lazy module

- Files:
  - `app.js`
  - `movie-page-similar.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved manual similar editor input, click, drag, drop, and focus handling into lazy `movie-page-similar.js`.
  - Kept current similar state, section wrapper, and Supabase save path in `app.js` as the remaining bridge.
  - Tightened smoke guards so manual similar event helpers stay out of `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-similar.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `32.7 KiB` raw / `4.1 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue the movie detail orchestration contour with the manual-similar save/state bridge or route/data orchestration in a later pass.

## 2026-08-16 - Move movie similar rendering to lazy module

- Files:
  - `app.js`
  - `movie-page-similar.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved manual similar editor/status/suggestions/list HTML, similar section HTML, and similar card HTML into lazy `movie-page-similar.js`.
  - Left the section wrapper, drag/search/click DOM handlers, and Supabase save path in `app.js` as the next safe orchestration boundary.
  - Tightened smoke guards so similar render helpers stay out of `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-similar.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles are about `28.5 KiB` raw / `3.7 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue the movie detail orchestration contour with manual-similar save/events or route/data orchestration in a later pass.

## 2026-08-16 - Record optimization backlog

- Files:
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added the six open optimization contours to the architecture context as the active backlog.
  - Captured the working rule that future passes should close one contour at a time unless the user changes the order.
- Checks:
  - `node tools\smoke-check.mjs`
  - `git diff --check`
- Follow-up:
  - Start with the first backlog item, movie detail orchestration, on the next implementation pass.

## 2026-08-16 - Move movie similar helpers to lazy module

- Files:
  - `app.js`
  - `movie-page-similar.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added lazy `movie-page-similar.js` for pure manual-similar search suggestions and selected-movie ordering helpers.
  - Kept manual similar editor HTML, DOM events, Supabase writes, and section rendering in `app.js`.
  - Registered the new lazy module in versioned app assets, cache headers, asset-size reporting, and smoke guards.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-similar.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check "functions/app-assets/[version].js"`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: `movie-page-similar.js` stays outside startup profiles; current startup profiles remain about `18.9 KiB` raw / `2.7 KiB` brotli below the saved baseline.
- Follow-up:
  - Continue with the remaining movie detail orchestration after this smaller similar-helper split is verified.

## 2026-08-16 - Split movie detail cache and selects

- Files:
  - `app.js`
  - `movie-detail-cache.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added lazy `movie-detail-cache.js` for movie detail session-cache keys, signatures, entry creation, read/write, expiry, and removal.
  - Kept shared state restoration in `app.js`, where rating/watchlist/review/comment/similar arrays still live.
  - Split the old combined movie detail/admin edit select into `MOVIE_DETAIL_SELECT` for public detail fallback loading and `MOVIE_EDITOR_SELECT` for the admin movie modal.
  - Registered the new lazy module in versioned app assets, cache headers, asset-size reporting, and smoke guards.
- Checks:
  - `node --check app.js`
  - `node --check movie-detail-cache.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check "functions/app-assets/[version].js"`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles decreased by about `18.2 KiB` raw / `2.7 KiB` brotli.
- Follow-up:
  - Continue with the manual-similar editor/orchestration slice after verifying this cache/select split on dev.

## 2026-08-16 - Move poster draft helpers to movie editor

- Files:
  - `app.js`
  - `movie-editor.js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie poster draft ordering, save-entry cloning, pending poster upload resolution, and primary/additional poster split helpers from `app.js` into the lazy movie editor controller.
  - Kept the movie modal DOM bridge, poster draft rendering state, Supabase writes, and post-save cache synchronization in `app.js`.
  - Made movie modal opening await the lazy editor controller so poster drag/drop handlers can rely on the controller being present.
  - Added a smoke guard that prevents these poster draft order/save helpers from drifting back into `app.js`.
- Checks:
  - `node --check app.js`
  - `node --check movie-editor.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Asset report: startup profiles decreased by about `16.1 KiB` raw / `2.5 KiB` brotli.
- Follow-up:
  - Continue moving low-risk movie editor helpers out of `app.js` in small slices.

## 2026-08-15 - Server profile activity ranks

- Files:
  - `_routes.json`
  - `app.js`
  - `docs/CODEX_CONTEXT.md`
  - `user-page.js`
  - `functions/profile-activity-ranks/[userId].js`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a Cloudflare Function that calculates public profile activity medal ranks server-side with the Supabase service role and returns only aggregate counts/ranks for the requested profile.
  - Updated profile pages to use the server rank endpoint first and keep the old client aggregate rank calculation only as a fallback.
  - Documented why profile ranks must not depend on client-readable raw activity aggregates: RLS can make other users invisible and incorrectly show multiple profiles as first place.
  - Added `/profile-activity-ranks/*` to Cloudflare `_routes.json`; without this include, dev/prod returned the catalog shell instead of the endpoint JSON.
  - Limited the old client aggregate fallback to local development so dev/prod do not show potentially false rank medals when the server endpoint is unavailable.
  - Let the rank endpoint fall back from service role to `SUPABASE_ANON_KEY` for dev environments where public activity rows are RLS-readable but no server secret is configured.
  - Documented the local PowerShell `&&` separator trap after hitting it during commit preparation.
- Checks:
  - `node --check app.js`
  - `node --check user-page.js`
  - `node --check "functions/profile-activity-ranks/[userId].js"`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - Mock endpoint rank check: user with 1 action ranks `2`, user with 2 actions ranks `1`.
  - Real Supabase rank check with publishable key: `profile000` ratings `177` => place `2`; `profile001` ratings `212` => place `1`.
  - `git diff --check`
- Follow-up:
  - Verify on dev that `profile001` ranks above `profile000` for watched/rated count after deploy.

## 2026-08-15 - Cache poster image attributes

- Files:
  - `app.js`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added bounded in-memory caches for Supabase poster transform URLs, poster image data, and generated poster image attribute HTML.
  - Reduced repeated URL parsing, `srcset` assembly, and escaping on hot render paths for catalog cards, profile rails, similar movies, and movie detail gallery switches.
  - Kept the existing poster quality floor and fallback behavior unchanged.
- Checks:
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - Poster cache guard: confirmed `POSTER_IMAGE_MIN_QUALITY` still floors transformed poster quality at 90 and the new poster caches are bounded.
  - `git diff --check`
- Follow-up:
  - Continue with the next optimization layer after this hot-path cache is verified and pushed.

## 2026-08-14 - Split secondary page styles

- Files:
  - `boot-loader.js`
  - `secondary-pages.css`
  - `following-page.css`
  - `notifications-page.css`
  - `editor-page.css`
  - `director-page.css`
  - `directors-admin-page.css`
  - `director-form.css`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Split the monolithic `secondary-pages.css` into a shared secondary-page base plus page-only CSS for following, notifications, editor, public person pages, directors admin, and the shared person edit modal.
  - Updated `boot-loader.js` so secondary pages load only the CSS needed by the current shell before app startup.
  - Registered the new CSS files in the Cloudflare app-assets allowlist, cache headers, asset-size report, and smoke guards.
- Checks:
  - `node --check boot-loader.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check functions\app-assets\[version].js`
  - CSS brace-balance check for `secondary-pages.css`, `following-page.css`, `notifications-page.css`, `editor-page.css`, `director-page.css`, `directors-admin-page.css`, and `director-form.css`.
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Browser smoke: local `/following.html`, `/notifications.html`, `/editor.html`, `/name.html?slug=test-director`, and `/directors.html` reached `app-ready`, loaded their expected CSS files, and had no app console errors.
- Follow-up:
  - Continue with the next approved optimization item after this split is verified and pushed.

## 2026-08-14 - Lazy-load movie detail interactions

- Files:
  - `app.js`
  - `movie-page-interactions.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie detail trailer modal rendering/open-close behavior and poster gallery switching/load animation out of startup `app.js` into lazy `movie-page-interactions.js`.
  - Kept `app.js` as the movie-page orchestrator: it now lazy-loads the interactions controller, passes narrow dependencies, and asks it to bind detail header events.
  - Registered the new lazy asset in Cloudflare app-assets, cache headers, asset-size reporting, and smoke guards.
- Checks:
  - `node --check app.js`
  - `node --check movie-page-interactions.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check functions\app-assets\[version].js`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
- Follow-up:
  - Continue the next optimization layer with careful, smaller moves around remaining movie detail helpers.

## 2026-08-14 - Document local workflow traps

- Files:
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a local workflow traps section for recurring Codex/PowerShell issues: mojibake in terminal output, safer handling of long multiline commands, `-LiteralPath` for paths with square brackets, `rg -g "*.js"` instead of bare globs, and browser-console fallback guidance.
- Checks:
  - `git diff --check`
- Follow-up:
  - Add future recurring trap resolutions here as soon as they are discovered.

## 2026-08-14 - Lazy-load public person page

- Files:
  - `app.js`
  - `director-page.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved `/name/*` public person/director page route parsing, Supabase payload loading, legacy director fallback, rendering, photo transforms, and movie-grid binding out of startup `app.js` into lazy `director-page.js`.
  - Left shared people helpers, director add/edit modal, movie-card helpers, and `/directors` admin bridge in `app.js`.
  - Registered the new lazy asset in Cloudflare app-assets, cache headers, asset-size reporting, and smoke checks.
- Checks:
  - `node --check app.js`
  - `node --check director-page.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check functions\app-assets\[version].js`
  - `node tools\smoke-check.mjs`
  - `node tools\asset-size-report.mjs --compare tools\asset-size-baseline.json`
  - `git diff --check`
  - Browser smoke: local `/name.html?slug=test-director` and `/name.html?slug=noy-lyuk` reached `app-ready`, loaded without app console errors, and rendered the expected not-found/real director states.
- Follow-up:
  - None.

## 2026-08-09 - Lazy-load editor center page

- Files:
  - `app.js`
  - `editor-page.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved `/editor` completeness summary rendering, auth states, and toolbar click handling out of startup `app.js` into lazy `editor-page.js`.
  - Kept shared admin data fetchers and export/audit actions in `app.js`, passed to the editor controller through a small context.
  - Registered the new lazy asset in the Cloudflare asset allowlist, cache headers, size report, and smoke checks.
- Checks:
  - `node --check app.js`
  - `node --check editor-page.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check functions\app-assets\[version].js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
  - Browser smoke: local `/editor.html` reached `app-ready`, showed the editor auth gate, and reported no app console errors.
- Follow-up:
  - None.

## 2026-08-09 - Prevent catalog poster preference flash

- Files:
  - `app.js`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Prevented the catalog from hydrating an anonymous DOM/session snapshot before Supabase session restoration when an auth token is present in local storage.
  - Bumped the catalog snapshot version so older snapshots with default posters are discarded after deployment.
  - This keeps the first visible catalog render aligned with the current user's `prefer_russian_posters` setting instead of briefly showing default posters and then swapping them.
- Checks:
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
  - Browser smoke: local catalog reached `app-ready`, rendered 40 cards after data load, and reported no app console errors.
- Follow-up:
  - None.

## 2026-08-09 - Add Russian poster preference

- Files:
  - `app.js`
  - `shared-layout.js`
  - `styles.css`
  - `movie-page-shell.js`
  - `user-page.js`
  - `notifications-page.js`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a profile settings checkbox for "Русские постеры", stored in `profiles.prefer_russian_posters`.
  - Added shared poster selection helpers so catalog cards, detail poster gallery, similar cards, profile rails, notification digest rails, and person film grids use the second uploaded poster as primary when the setting is enabled.
  - Added batch loading of `movie_poster_images` only when the preference is enabled, plus snapshot invalidation by poster preference to avoid restoring stale catalog DOM.
  - Kept the movie editor order unchanged; after editing a movie poster gallery, the updated second poster is picked up from the existing poster-image cache/reload path.
- Checks:
  - `node --check app.js`
  - `node --check shared-layout.js`
  - `node --check user-page.js`
  - `node --check notifications-page.js`
  - `node --check movie-page-shell.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
  - Browser smoke: local catalog, movie detail fallback, and notifications page reached `app-ready`; the profile settings modal included the Russian posters checkbox; no app console errors were reported.
- Follow-up:
  - Apply `alter table public.profiles add column if not exists prefer_russian_posters boolean not null default false;` in Supabase before using the setting.

## 2026-08-09 - Split lazy page and movie detail modules

- Files:
  - `app.js`
  - `notifications-page.js`
  - `user-page.js`
  - `movie-editor.js`
  - `movie-page-shell.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `tools/asset-size-report.mjs`
  - `tools/asset-size-baseline.json`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved `/notifications` rendering, preferences, read/dwell behavior, clear-all, and digest rail logic into lazy `notifications-page.js`.
  - Moved `/user/*` page data composition, stats/taste calculations, and profile page rendering into lazy `user-page.js`.
  - Added lazy `movie-editor.js` for movie form draft reading, validation, insert payload building, and update changed-field diffing while keeping Supabase writes in `app.js`.
  - Added lazy `movie-page-shell.js` for movie detail view-model, header, and skeleton HTML helpers while keeping route loading, poster gallery events, social bridge, and manual similar editor in `app.js`.
  - Added `MOVIE_SIMILAR_CARD_SELECT` so movie detail similar cards no longer fetch the full catalog payload when the catalog cache is cold.
  - Registered new lazy assets in the Cloudflare asset allowlist, `_headers`, size report, and smoke checks.
  - Saved the reduced asset-size baseline after startup JS dropped by about 11.2 KiB brotli across page profiles.
- Checks:
  - `node --check app.js`
  - `node --check notifications-page.js`
  - `node --check user-page.js`
  - `node --check movie-editor.js`
  - `node --check movie-page-shell.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check functions\app-assets\[version].js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `node tools\asset-size-report.mjs --save tools\asset-size-baseline.json`
  - `git diff --check`
  - Browser smoke: local catalog, movie detail, user page, and notifications page reached `app-ready` without console errors.
- Follow-up:
  - None.

## 2026-08-06 - Add notifications clear-all action

- Files:
  - `app.js`
  - `secondary-pages.css`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a "Очистить всё" ghost action next to "Отметить все прочитанными" on the notifications page.
  - Clears the current user's notification deliveries after confirmation and resets the unread badge locally.
  - Kept the new action visually lightweight with a transparent background and inline close icon.
  - Added a smoke guard for the clear-all notification action wiring.
- Checks:
  - `node --check app.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
  - Browser smoke: `/notifications` started without console errors.
- Follow-up:
  - None.

## 2026-08-05 - Show direct comment replies by default

- Files:
  - `movie-social.js`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Changed the movie detail comment tree so direct replies to top-level comments render immediately by default.
  - Kept deeper comment branches behind the existing "Раскрыть ветку" toggle.
  - Added a smoke guard for the direct-reply default visibility rule.
- Checks:
  - `node --check movie-social.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
  - Browser smoke: `/movie/soulm8yt-2026` rendered without console errors.
- Follow-up:
  - None.

## 2026-08-03 - Fix review reply button on movie detail

- Files:
  - `movie-social.js`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved the review reply click handling into the reviews section listener, where the "Ответить" button is actually rendered.
  - Removed the unreachable review-reply branch from the comments section listener.
  - Added a smoke guard so review reply buttons cannot drift back to the wrong listener silently.
- Checks:
  - `node --check movie-social.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
  - Local browser smoke for `/movie/taro-2024`
- Follow-up:
  - None.

## 2026-07-28 - Restore movie detail similar handlers

- Files:
  - `app.js`
  - `movie-social.js`
  - `tools/asset-size-baseline.json`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Restored the manual similar movies detail section renderer and editor event handlers to `app.js` after the social-module extraction accidentally moved them into `movie-social.js`.
  - Kept `movie-social.js` scoped to reviews/comments by removing manual similar movie helpers from it.
  - Added smoke guards so manual similar detail handlers must remain in `app.js` and cannot silently drift into `movie-social.js` again.
  - Restored local reviews/comments section renderers inside `movie-social.js` and switched the exported controller methods to safe arrow properties to avoid recursive API calls.
- Checks:
  - `node --check app.js`
  - `node --check movie-social.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `node tools\asset-size-report.mjs --save tools\asset-size-baseline.json`
  - `git diff --check`
  - Local browser smoke for `/movie/taro-2024`
- Follow-up:
  - None.

## 2026-07-28 - Extract movie detail social block

- Files:
  - `app.js`
  - `movie-social.js`
  - `_headers`
  - `functions/app-assets/[version].js`
  - `tools/asset-size-report.mjs`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved movie detail reviews, comments, likes, reply composers, social anchors, and social section rerenders into lazy-loaded `movie-social.js`.
  - Kept `app.js` as the bridge for shared social arrays, availability flags, session cache, catalog reviewed-state sync, and fallback loading sections.
  - Added `movie-social.js` to versioned app-assets, cache headers, size reporting, and smoke guards.
- Checks:
  - `node --check app.js`
  - `node --check movie-social.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-28 - Resize director admin avatars proportionally

- Files:
  - `src/directors-admin-app.jsx`
  - `assets/directors-admin-app.js`
  - `tools/smoke-check.mjs`
  - `tools/asset-size-baseline.json`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Changed `/directors` admin avatar transforms to request `width` with `resize=contain`, avoiding both server-side square center-crop and Supabase width-only responses that keep the original image height.
  - Kept browser-side top cropping inside the circular avatar after the proportional thumbnail resize.
- Checks:
  - `npm run build:directors`
  - `node --check assets\directors-admin-app.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `git diff --check`
  - `npm run size:compare`
  - `node tools\asset-size-report.mjs --save tools\asset-size-baseline.json`
- Follow-up:
  - None.

## 2026-07-28 - Preserve director admin avatar aspect before crop

- Files:
  - `src/directors-admin-app.jsx`
  - `assets/directors-admin-app.js`
  - `tools/smoke-check.mjs`
  - `tools/asset-size-baseline.json`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Changed `/directors` admin avatar Supabase image transforms to request width-only thumbnails instead of square `height` + `resize=cover` crops, so the browser can crop photos from the top inside the circular avatar.
  - Added a smoke guard to keep director admin avatar transforms aspect-ratio preserving.
- Checks:
  - `npm run build:directors`
  - `node --check assets\directors-admin-app.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `git diff --check`
  - `npm run size:compare`
  - `node tools\asset-size-report.mjs --save tools\asset-size-baseline.json`
- Follow-up:
  - None.

## 2026-07-28 - Top-align director avatar crops

- Files:
  - `secondary-pages.css`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Restored the `/directors` card row alignment and changed circular photo cropping so uploaded person photos anchor to the top inside the avatar circle.
- Checks:
  - `node tools\smoke-check.mjs`
  - `git diff --check`
  - `npm run size:compare`
- Follow-up:
  - None.

## 2026-07-28 - Align directors admin avatars to top

- Files:
  - `secondary-pages.css`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Restored top alignment for circular person photos/placeholders in `/directors` cards so thumbnails line up with the first text row instead of vertically centering against the full text block.
- Checks:
  - `node tools\smoke-check.mjs`
  - `git diff --check`
  - `npm run size:compare`
- Follow-up:
  - None.

## 2026-07-28 - Fix notifications avatar helper after following split

- Files:
  - `app.js`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Restored `/notifications` rendering for authenticated users by replacing the stale `getFollowingPageAvatarHtml` call left after moving `/following` into a lazy module.
  - Added a smoke guard so `app.js` cannot depend on that following-page local helper again.
- Checks:
  - `node --check app.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `node tools\asset-size-report.mjs --save tools\asset-size-baseline.json`
- Follow-up:
  - Verify authenticated `/notifications` in browser after deploy.

## 2026-07-28 - Cache repeated profile and movie lookups

- Files:
  - `app.js`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added an in-memory movie row cache keyed by select payload for repeated `movies by ids` queries used by profile rails, notifications, and related previews.
  - Added a public profile handle cache on top of the existing public profile id cache.
  - Clear movie row caches on local mutations so edited cards do not keep stale payloads.
  - Skip the deferred movie detail social/similar refresh when a fresh session-cached detail page is already rendered.
- Checks:
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `node tools\asset-size-report.mjs --save tools\asset-size-baseline.json`
- Follow-up:
  - Keep larger movie social splitting as a separate high-risk contour.

## 2026-07-28 - Tighten payloads and director thumbnails

- Files:
  - `app.js`
  - `src/directors-admin-app.jsx`
  - `assets/directors-admin-app.js`
  - `tools/asset-size-baseline.json`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Removed detail-only `tmdb_url` from the catalog movie payload and aligned catalog external-link detection with the visible aggregator buttons.
  - Replaced `notification_events (*)` with an explicit notification event select.
  - Added a session-level public profile cache and reused it for movie reviews/comments, notifications, and followed profiles.
  - Switched `/directors` admin avatars from original photos to 48px-oriented Supabase transformed thumbnails with original-image fallback.
  - Added smoke guards for the catalog TMDB payload and notification event wildcard select.
- Checks:
  - `npm run build:directors`
  - `node --check app.js`
  - `node --check assets\directors-admin-app.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
- Follow-up:
  - Continue with larger social/detail splitting only after keeping route-level behavior stable.

## 2026-07-28 - Lazy-load following page

- Files:
  - `app.js`
  - `following-page.js`
  - `_headers`
  - `functions/app-assets/[version].js`
  - `tools/asset-size-report.mjs`
  - `tools/asset-size-baseline.json`
  - `tools/smoke-check.mjs`
  - `README.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved `/following` rendering, data loading, notification preference toggles, unfollow actions, and page-local events into lazy-loaded `following-page.js`.
  - Kept shared auth/profile/Supabase context in `app.js`, reducing startup payload for catalog, movie, profile, notifications, editor, and person pages.
  - Added cache header, app-assets allowlist, size reporting, and smoke-check coverage for the new lazy module.
- Checks:
  - `node --check app.js`
  - `node --check following-page.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check functions\app-assets\[version].js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
- Follow-up:
  - Continue route-by-route JS splitting after this first low-risk slice.

## 2026-07-27 - Combine font stylesheet requests

- Files:
  - `index.html`
  - `movie.html`
  - `user.html`
  - `following.html`
  - `notifications.html`
  - `editor.html`
  - `name.html`
  - `directors.html`
  - `tools/asset-size-baseline.json`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Replaced the two Google Fonts stylesheet requests with one combined request for `PT Sans` and `Unbounded` across all page shells.
  - Added a smoke-check guard to keep future HTML shells on the combined font stylesheet path.
- Checks:
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `rg -n "fonts.googleapis.com/css2" -g "*.html"`
- Follow-up:
  - None.

## 2026-07-26 - Lazy-load movie modal custom selects

- Files:
  - `app.js`
  - `app-script-loader.js`
  - `tools/asset-size-report.mjs`
  - `tools/asset-size-baseline.json`
  - `tools/smoke-check.mjs`
  - `README.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Stopped loading `custom-select.js` upfront on movie detail pages; it remains an upfront dependency for catalog filters.
  - Added on-demand classic-script loading before the movie add/edit modal opens, preserving custom select behavior for admin editing.
  - Updated startup size reporting and smoke-check guards so movie startup stays free of `custom-select.js`.
- Checks:
  - `node --check app.js`
  - `node --check app-script-loader.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
- Follow-up:
  - None.

## 2026-07-26 - Split secondary page styles

- Files:
  - `styles.css`
  - `secondary-pages.css`
  - `boot-loader.js`
  - `_headers`
  - `functions/app-assets/[version].js`
  - `tools/asset-size-report.mjs`
  - `tools/asset-size-baseline.json`
  - `tools/smoke-check.mjs`
  - `README.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved secondary page-only CSS for following, notifications, editor, public person pages, and directors admin into `secondary-pages.css`.
  - Updated the boot loader to load `secondary-pages.css` only on those page types, leaving catalog/profile/movie startup with a smaller global stylesheet.
  - Added asset proxy, cache header, size report, and smoke-check coverage for the new stylesheet.
- Checks:
  - `node --check app.js`
  - `node --check boot-loader.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check functions\app-assets\[version].js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - CSS brace check for `styles.css`, `movie-page.css`, and `secondary-pages.css`.
- Follow-up:
  - None.

## 2026-07-26 - Fix movie detail stylesheet bootstrap

- Files:
  - `boot-loader.js`
  - `app.js`
  - `tools/smoke-check.mjs`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Fixed page detection in `boot-loader.js` so `movie-page.css` is selected from the current URL before `<body data-app-page>` exists.
  - Changed person photo transforms to request explicit 2:3 image dimensions from Supabase render URLs.
  - Added a smoke-check guard for movie-page stylesheet bootstrap.
- Checks:
  - `node --check app.js`
  - `node --check boot-loader.js`
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - Boot-loader route mock: catalog loads only `styles.css`, movie routes load `styles.css` and `movie-page.css`.
- Follow-up:
  - None.

## 2026-07-26 - Split movie styles and defer detail work

- Files:
  - `app.js`
  - `boot-loader.js`
  - `styles.css`
  - `movie-page.css`
  - `person-placeholders.js`
  - `_headers`
  - `functions/app-assets/[version].js`
  - `tools/asset-size-report.mjs`
  - `tools/asset-size-baseline.json`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Split movie detail-only CSS into `movie-page.css` and load it only for movie detail shells before app startup.
  - Moved large person placeholder SVG silhouettes into lazy-loaded `person-placeholders.js`.
  - Changed movie detail loading so the primary movie section can render before reviews, comments, and similar movies finish loading.
  - Added catalog DOM render signatures to skip identical card-grid rebuilds.
  - Switched movie review/comment interactions to delegated section handlers and removed the old per-element binding helpers.
  - Optimized person detail photos through Supabase image render URLs with original-image fallback.
  - Removed an obsolete trigger-filter option from catalog filter state.
- Checks:
  - `node --check app.js`
  - `node --check person-placeholders.js`
  - `node --check boot-loader.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check functions\app-assets\[version].js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-25 - Optimize admin actions and cleanup checks

- Files:
  - `app.js`
  - `admin-actions.js`
  - `styles.css`
  - `_headers`
  - `functions/app-assets/[version].js`
  - `tools/asset-size-report.mjs`
  - `tools/asset-size-baseline.json`
  - `tools/smoke-check.mjs`
  - `docs/CODEX_CONTEXT.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Moved heavy downloadable admin action builders for audits and database export into lazy-loaded `admin-actions.js`.
  - Added the lazy admin module to versioned asset serving, cache headers, syntax checks, and size reporting while keeping it out of startup profiles.
  - Switched editor/completeness audit movie loading to a lean completeness-only Supabase select; full movie rows remain for database export.
  - Consolidated duplicated review/comment like CSS and added a smoke-check guard against dated one-time root artifacts.
  - Removed stale untracked root JSON artifacts from previous enrichment/export runs.
- Checks:
  - `node --check app.js`
  - `node --check admin-actions.js`
  - `node --check shared-layout.js`
  - `node --check tools\smoke-check.mjs`
  - `node --check tools\asset-size-report.mjs`
  - `node --check functions\app-assets\[version].js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-16 - Add intentional empty movie field marker

- Files:
  - `app.js`
  - `functions/_seo-utils.js`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added `Не применимо` as a service marker for movie fields that are intentionally empty.
  - Completeness contours treat the marker as filled, while public movie details, aggregator links, trailer embeds, and SEO fallback output hide it.
  - Movie edit forms preserve the marker so it remains visible to admins.
- Checks:
  - `node --check app.js`
  - `node --check functions\_seo-utils.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-16 - Update editor completeness contours

- Files:
  - `app.js`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added editor completeness contours for empty distribution and empty Russian distribution fields.
  - Removed runtime and missing similar movies from the editor completeness grid and TXT completeness audit.
  - Made editor summary counters and the priority list count every remaining completeness contour.
- Checks:
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-13 - Add movie data enrichment guide

- Files:
  - `AGENTS.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/MOVIE_DATA_ENRICHMENT_GUIDE.md`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Added a dedicated guide for verifying and filling movie year, additional genres, countries, production, distribution, and Russian distribution.
  - Linked the guide from the project context read order and data model notes so future enrichment work uses the stricter source/quality rules.
  - Clarified that `Ужасы` must not be written to additional genres and non-horror candidates should be reported in a separate manual-review list.
- Checks:
  - `node tools\smoke-check.mjs`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-12 - Handle deceased people on person pages

- Files:
  - `app.js`
  - `styles.css`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Person page age calculation now explicitly uses death date as the age reference when `death_date` is filled.
  - Person photos and photo placeholders become grayscale via CSS when a death date is present.
- Checks:
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-12 - Keep editor issue cards natural height

- Files:
  - `styles.css`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Prevented editor center issue cards from stretching to match the tallest card in the same grid row.
  - Empty or short issue blocks now keep their natural height while the grid layout stays intact.
- Checks:
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-12 - Exclude missing similar links from editor summary

- Files:
  - `app.js`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Kept the editor center "Без похожих" issue block visible as a working checklist.
  - Excluded missing manual similar links from the top editor summary counters.
  - Excluded missing manual similar links from the "Приоритет на проверку" list and its ordering.
- Checks:
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-11 - Align rating widget hover states

- Files:
  - `styles.css`
  - `docs/RECENT_CHANGES.md`
- Summary:
  - Made detail-page rating widgets use the same hover, focus-visible, and active motion as external aggregator icon links.
- Checks:
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-11 - Limit TMDB movie link to detail page

- Files:
  - `app.js`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
- Summary:
  - Added build-version cache busting to local aggregator SVG icon URLs so replaced immutable icons update after deploy.
  - Removed TMDB from catalog movie-card aggregator links.
  - Normalized detail-page aggregator order to Kinopoisk, IMDb, Letterboxd, Rotten Tomatoes, TMDB.
- Checks:
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - None.

## 2026-07-11 - Add TMDB movie aggregator link

- Files:
  - `app.js`
  - `shared-layout.js`
  - `functions/_seo-utils.js`
  - `icons/tmdb.svg`
  - `docs/DATA_MODEL.md`
- Summary:
  - Added editable movie `tmdb_url` support as an optional Supabase column.
  - Added TMDB to movie detail external aggregator links and movie SEO `sameAs`.
  - Added TMDB as the third field in the second external-links row; trailer moves to the next row.
- Checks:
  - `node --check app.js`
  - `node --check shared-layout.js`
  - `node --check functions\_seo-utils.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - Apply `alter table public.movies add column if not exists tmdb_url text;` in Supabase before entering TMDB links.

## 2026-07-11 - Add persistent Codex context docs

- Files:
  - `AGENTS.md`
  - `docs/CODEX_CONTEXT.md`
  - `docs/DATA_MODEL.md`
  - `docs/RECENT_CHANGES.md`
  - `tools/smoke-check.mjs`
- Summary:
  - Added a repository-local context system so Codex can quickly recover architecture/project context after conversation compaction.
  - Added a smoke-check guard that requires `docs/RECENT_CHANGES.md` to be updated when key source files are dirty.
- Checks:
  - `node --check tools\smoke-check.mjs`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
- Follow-up:
  - Keep this journal updated after future file edits.

## 2026-07-10 - Serve core app assets through versioned Function

- Files:
  - `boot-loader.js`
  - `app-script-loader.js`
  - `app.js`
  - `functions/app-assets/[version].js`
  - `_headers`
  - `_routes.json`
  - `tools/smoke-check.mjs`
  - `tools/asset-size-baseline.json`
- Summary:
  - Fixed production cache mismatch where `/env` and HTML were fresh but `app.js/styles.css/shared-layout.js` could remain stale behind Cloudflare cache.
  - Production now loads core JS/CSS and lazy feature modules through `/app-assets/<APP_BUILD_VERSION>?file=<asset>`.
  - Core app assets are no-store/revalidate instead of immutable.
  - Pushed to both `dev` and `main` because `horroreiro.ru` follows `main`.
- Checks:
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - `git diff --check`
  - Production checks for `/env`, `/directors`, `/app-assets/...`, account menu visibility, and director links.
- Follow-up:
  - Do not restore immutable caching on core app assets unless filenames become content-hashed.

## 2026-07-10 - Hide admin menu items from regular users

- Files:
  - `shared-layout.js`
  - `styles.css`
- Summary:
  - Marked editor/audit/export/test menu items as admin-only.
  - Added explicit CSS hiding for `.auth-popover-item[hidden]` because the base item style uses `display: flex`.
- Checks:
  - `node --check shared-layout.js`
  - `node --check app.js`
  - `node tools\smoke-check.mjs`
  - `git diff --check`
  - Browser check for non-admin hidden menu state.
- Follow-up:
  - Admin-only visibility should be tested with both `hidden` and computed `display`.

## 2026-07-10 - Render `/directors` admin with Preact island

- Files:
  - `src/directors-admin-app.jsx`
  - `assets/directors-admin-app.js`
  - `vite.config.mjs`
  - `package.json`
  - `package-lock.json`
  - `app.js`
  - `_headers`
  - `tools/smoke-check.mjs`
  - `tools/asset-size-report.mjs`
  - `tools/asset-size-baseline.json`
  - `README.md`
- Summary:
  - Added the first Preact/Vite island for `/directors`.
  - Moved admin directors list rendering/filter UI out of string-heavy `app.js`; legacy app still supplies data, auth state, utilities, and edit actions.
  - Added `npm run build:directors`; generated bundle is committed.
- Checks:
  - `npm run build:directors`
  - `node --check app.js`
  - `node --check assets/directors-admin-app.js`
  - `node tools\smoke-check.mjs`
  - `npm run size:compare`
  - local browser check for `/directors.html` auth state.
- Follow-up:
  - Any edit to `src/directors-admin-app.jsx` requires rebuilding `assets/directors-admin-app.js`.
