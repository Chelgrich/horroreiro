import { addAppBuildHint } from './_response-utils.js';
import { getMoviePageCompanySource, getMoviePageIntroHtml, getMoviePageTrailerButtonHtml, getYouTubeTrailerEmbedUrl } from '../movie-page-shell.js';

const SITE_ORIGIN = 'https://horroreiro.ru';
const DEFAULT_SOCIAL_IMAGE = `${SITE_ORIGIN}/og-preview.jpg`;
const POSTER_STORAGE_PUBLIC_PATH = '/storage/v1/object/public/posters/';
const POSTER_STORAGE_RENDER_PATH = '/storage/v1/render/image/public/posters/';
const POSTER_IMAGE_MIN_QUALITY = 90;
const SOCIAL_PREVIEW_CRAWLER_UA_PATTERNS = [
  'telegrambot',
  'twitterbot',
  'facebookexternalhit',
  'facebot',
  'vkshare',
  'viber',
  'whatsapp',
  'discordbot',
  'slackbot',
  'linkedinbot',
  'skypeuripreview'
];
const INTENTIONAL_EMPTY_FIELD_MARKERS = new Set([
  'не применимо'
]);

const MOVIE_SELECT = `
  id,
  slug,
  title,
  original_title,
  year,
  director,
  production,
  distribution,
  russian_distribution,
  poster_url,
  kinopoisk_url,
  imdb_url,
  letterboxd_url,
  rottentomatoes_url,
  tmdb_url,
  trailer_url,
  synopsis,
  movie_genres (
    position,
    genres (name)
  ),
  movie_countries (
    countries (name)
  )
`;

const MOVIE_COMPANY_LINKS_SELECT = 'movie_companies(role,position,companies(id,slug,name))';
const SEO_ROW_CACHE = new Map();
const SEO_ROW_CACHE_TTL_MS = 60000;
const SEO_ROW_CACHE_LIMIT = 100;

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeSearchText(value) {
  return normalizeText(value)
    .toLowerCase()
    .replaceAll('ё', 'е');
}

function isIntentionalEmptyFieldMarker(value) {
  return INTENTIONAL_EMPTY_FIELD_MARKERS.has(normalizeSearchText(value));
}

function getPublicOptionalValue(value) {
  const trimmedValue = String(value || '').trim();

  return trimmedValue && !isIntentionalEmptyFieldMarker(trimmedValue)
    ? trimmedValue
    : '';
}

function truncateText(value, maxLength = 160) {
  const text = normalizeText(value);

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getSupabaseHeaders(env) {
  const anonKey = env.SUPABASE_ANON_KEY || '';

  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    Accept: 'application/json'
  };
}

function getSupabaseTableUrl(env, tableName, params = {}) {
  const supabaseUrl = String(env.SUPABASE_URL || '').replace(/\/$/, '');

  if (!supabaseUrl || !env.SUPABASE_ANON_KEY) {
    throw new Error('Supabase environment variables are not configured.');
  }

  const url = new URL(`${supabaseUrl}/rest/v1/${tableName}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      const normalizedValue = key === 'select'
        ? String(value).replace(/\s+/g, '')
        : value;

      url.searchParams.set(key, normalizedValue);
    }
  });

  return url;
}

async function fetchSupabaseRows(env, tableName, params = {}, { signal } = {}) {
  const response = await fetch(getSupabaseTableUrl(env, tableName, params), {
    headers: getSupabaseHeaders(env),
    signal
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw Object.assign(new Error(`Supabase request failed: ${response.status}`), { code: detail?.code });
  }

  return response.json();
}

function getMovieGenreNames(movie) {
  return (Array.isArray(movie?.movie_genres) ? movie.movie_genres : [])
    .map(item => item?.genres?.name)
    .filter(Boolean);
}

function getMovieCountryNames(movie) {
  return (Array.isArray(movie?.movie_countries) ? movie.movie_countries : [])
    .map(item => item?.countries?.name)
    .filter(Boolean);
}

function formatMovieTextArray(value) {
  return (Array.isArray(value) ? value : [])
    .map(item => String(item || '').trim())
    .filter(item => item && !isIntentionalEmptyFieldMarker(item))
    .join(', ');
}

function getMoviePagePath(movie) {
  if (movie?.slug) {
    return `/movie/${encodeURIComponent(movie.slug)}`;
  }

  return `/movie.html?id=${encodeURIComponent(movie?.id || '')}`;
}

function getMovieCanonicalUrl(movie) {
  return `${SITE_ORIGIN}${getMoviePagePath(movie)}`;
}

function getMoviePosterSource(movie) {
  return getPublicOptionalValue(movie?.poster_url) || getPublicOptionalValue(movie?.movie_poster_images?.[0]?.image_url);
}

function getMovieSocialImage(movie) {
  return movie?.slug && getMoviePosterSource(movie)
    ? `${SITE_ORIGIN}/og/movie/${encodeURIComponent(movie.slug)}.jpg?v=2`
    : DEFAULT_SOCIAL_IMAGE;
}

function isPublicMoviePosterUrl(url, env) {
  try {
    const posterUrl = new URL(url);
    const storageUrl = new URL(env.SUPABASE_URL);
    const path = decodeURIComponent(posterUrl.pathname);
    return posterUrl.protocol === 'https:' && posterUrl.origin === storageUrl.origin &&
      !posterUrl.username && !posterUrl.password &&
      (path.startsWith(POSTER_STORAGE_PUBLIC_PATH) || path.startsWith(POSTER_STORAGE_RENDER_PATH)) &&
      Boolean(path.split('/').at(-1)) &&
      !path.split('/').some(segment => segment === '..' || segment === '.' || segment.includes('\\'));
  } catch {
    return false;
  }
}

function getPosterStoragePath(publicUrl) {
  if (!publicUrl) {
    return null;
  }

  let parsedUrl = null;

  try {
    parsedUrl = new URL(publicUrl);
  } catch (error) {
    return null;
  }

  const pathname = parsedUrl.pathname;
  const marker = pathname.includes(POSTER_STORAGE_PUBLIC_PATH)
    ? POSTER_STORAGE_PUBLIC_PATH
    : POSTER_STORAGE_RENDER_PATH;

  if (!pathname.includes(marker)) {
    return null;
  }

  return pathname.split(marker)[1] || null;
}

function getPosterTransformUrl(publicUrl, {
  width = 640,
  height = null,
  quality = POSTER_IMAGE_MIN_QUALITY
} = {}) {
  const storagePath = getPosterStoragePath(publicUrl);

  if (!storagePath) {
    return publicUrl;
  }

  const parsedUrl = new URL(publicUrl);
  const transformedUrl = new URL(`${parsedUrl.origin}${POSTER_STORAGE_RENDER_PATH}${storagePath}`);
  const normalizedWidth = Math.max(1, Math.min(2500, Number(width) || 640));
  const normalizedHeight = height
    ? Math.max(1, Math.min(2500, Math.round(Number(height) || 0)))
    : Math.round(normalizedWidth * 1.5);
  const normalizedQuality = Math.round(
    Math.max(POSTER_IMAGE_MIN_QUALITY, Math.min(100, Number(quality) || POSTER_IMAGE_MIN_QUALITY))
  );

  transformedUrl.searchParams.set('width', String(normalizedWidth));
  transformedUrl.searchParams.set('height', String(normalizedHeight));
  transformedUrl.searchParams.set('resize', 'cover');
  transformedUrl.searchParams.set('quality', String(normalizedQuality));

  return transformedUrl.toString();
}

function getMovieTitleWithYear(movie) {
  const yearSuffix = movie?.year ? ` (${movie.year})` : '';
  return `${movie?.title || 'Фильм ужасов'}${yearSuffix}`;
}

function getMovieSeoDescription(movie) {
  const director = getPublicOptionalValue(movie?.director);
  const genres = getMovieGenreNames(movie);
  const details = [getPublicOptionalValue(movie?.original_title), genres.join(', '),
    director ? `Режиссёр: ${director}` : ''].filter(Boolean).join(' · ');
  return truncateText(getPublicOptionalValue(movie?.synopsis) || details || `${getMovieTitleWithYear(movie)} в каталоге Хоррорейро.`, 165);
}

function getMovieSameAs(movie) {
  return [
    getPublicOptionalValue(movie?.kinopoisk_url),
    getPublicOptionalValue(movie?.imdb_url),
    getPublicOptionalValue(movie?.letterboxd_url),
    getPublicOptionalValue(movie?.rottentomatoes_url),
    getPublicOptionalValue(movie?.tmdb_url)
  ].filter(Boolean);
}

function buildMovieJsonLd(movie) {
  const url = getMovieCanonicalUrl(movie);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    '@id': `${url}#movie`,
    name: movie?.title || '',
    url,
    image: getMovieSocialImage(movie),
    description: getPublicOptionalValue(movie?.synopsis) || getMovieSeoDescription(movie)
  };

  if (movie?.original_title) {
    jsonLd.alternateName = movie.original_title;
  }

  if (movie?.director) {
    jsonLd.director = String(movie.director)
      .split(',')
      .map(name => normalizeText(name))
      .filter(Boolean)
      .map(name => ({ '@type': 'Person', name }));
  }

  const genres = getMovieGenreNames(movie);

  if (genres.length > 0) {
    jsonLd.genre = genres;
  }

  const countries = getMovieCountryNames(movie);

  if (countries.length > 0) {
    jsonLd.countryOfOrigin = countries.map(name => ({ '@type': 'Country', name }));
  }

  const sameAs = getMovieSameAs(movie);

  if (sameAs.length > 0) {
    jsonLd.sameAs = sameAs;
  }

  return jsonLd;
}

function isSocialPreviewCrawler(request) {
  const userAgent = String(request?.headers?.get?.('user-agent') || '').toLowerCase();

  return SOCIAL_PREVIEW_CRAWLER_UA_PATTERNS.some(pattern => userAgent.includes(pattern));
}

function createSocialPreviewHtml(movie) {
  const seo = getMoviePageSeo(movie);

  return applyPageSeoToHtml(`<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <h1>${escapeHtml(seo.socialTitle)}</h1>
  <p>${escapeHtml(seo.description)}</p>
  <p><a href="${escapeHtml(seo.canonicalUrl)}">Открыть карточку фильма</a></p>
</body>
</html>`, seo);
}

function upsertHeadElement(html, pattern, elementHtml) {
  if (pattern.test(html)) {
    return html.replace(pattern, () => elementHtml);
  }

  return html.replace('</head>', () => `  ${elementHtml}\n</head>`);
}

function upsertMetaName(html, name, content) {
  return upsertHeadElement(
    html,
    new RegExp(`<meta\\s+name=["']${name}["'][^>]*>`, 'i'),
    `<meta name="${name}" content="${escapeHtml(content)}">`
  );
}

function upsertMetaProperty(html, property, content) {
  return upsertHeadElement(
    html,
    new RegExp(`<meta\\s+property=["']${property}["'][^>]*>`, 'i'),
    `<meta property="${property}" content="${escapeHtml(content)}">`
  );
}

function upsertCanonical(html, canonicalUrl) {
  return upsertHeadElement(
    html,
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">`
  );
}

function applyPageSeoToHtml(html, {
  title,
  socialTitle = title,
  description,
  canonicalUrl,
  type = 'website',
  image = DEFAULT_SOCIAL_IMAGE,
  imageAlt = 'Хоррорейро — каталог фильмов ужасов'
}) {
  let nextHtml = upsertHeadElement(html, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  nextHtml = upsertMetaName(nextHtml, 'description', description);
  nextHtml = upsertCanonical(nextHtml, canonicalUrl);
  nextHtml = upsertMetaName(nextHtml, 'robots', 'index, follow');
  for (const [name, value] of Object.entries({
    type, title: socialTitle, description, url: canonicalUrl, image,
    'image:secure_url': image, 'image:alt': imageAlt, site_name: 'Хоррорейро', locale: 'ru_RU'
  })) {
    nextHtml = upsertMetaProperty(nextHtml, `og:${name}`, value);
  }
  for (const [name, value] of Object.entries({
    card: type === 'video.movie' && image !== DEFAULT_SOCIAL_IMAGE ? 'summary' : 'summary_large_image',
    title: socialTitle, description, image, 'image:alt': imageAlt, url: canonicalUrl
  })) {
    nextHtml = upsertMetaName(nextHtml, `twitter:${name}`, value);
  }

  return nextHtml;
}

function upsertJsonLd(html, scriptId, data) {
  const scriptHtml = `<script id="${scriptId}" type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

  return upsertHeadElement(
    html,
    new RegExp(`<script\\s+id=["']${scriptId}["']\\s+type=["']application/ld\\+json["'][^>]*>[\\s\\S]*?<\\/script>`, 'i'),
    scriptHtml
  );
}

function injectMovieFallback(html, fallbackHtml) {
  return html.replace(
    /<!-- MOVIE_PAGE_FALLBACK_START -->[\s\S]*?<!-- MOVIE_PAGE_FALLBACK_END -->/,
    () => `<!-- MOVIE_PAGE_FALLBACK_START -->\n${fallbackHtml}\n        <!-- MOVIE_PAGE_FALLBACK_END -->`
  );
}

function renderMovieFallbackHtml(movie) {
  const genres = getMovieGenreNames(movie).join(', ');
  const countries = getMovieCountryNames(movie).join(', ');
  const production = formatMovieTextArray(movie?.production);
  const distribution = formatMovieTextArray(movie?.distribution);
  const russianDistribution = formatMovieTextArray(movie?.russian_distribution);
  const basePoster = String(movie.poster_url || '').trim();
  const alternate = String(movie.movie_poster_images?.[0]?.image_url || '').trim();
  const alternatePoster = alternate !== basePoster ? alternate : '';
  const transform = url => getPosterTransformUrl(url, { width: 640, quality: POSTER_IMAGE_MIN_QUALITY });
  const hasGallery = Array.isArray(movie.movie_poster_images);
  const canLoadBase = hasGallery && !alternatePoster;
  const posterHtml = basePoster || alternatePoster
    ? `<div class="movie-poster-skeleton movie-page-initial-poster-skeleton" aria-hidden="true"></div>
       <img class="movie-page-poster"${canLoadBase ? ` src="${escapeHtml(transform(basePoster))}"` : ''}
         data-server-poster-base="${escapeHtml(transform(basePoster))}"
         data-original-poster-src="${escapeHtml(basePoster)}"
         data-poster-fallback-src="${escapeHtml(basePoster)}"
         data-server-poster-alternate="${escapeHtml(transform(alternatePoster))}"
         data-server-poster-alternate-original="${escapeHtml(alternatePoster)}"
         ${hasGallery ? '' : 'data-server-poster-gallery-unknown'}
         alt="Постер фильма ${escapeHtml(movie.title)}" loading="eager" decoding="async" fetchpriority="high">`
    : '<div class="movie-poster-placeholder">Нет постера</div>';

  return `        <div class="movie-page-stack movie-page-server-fallback" data-server-rendered="true">
          <article class="movie-page-layout" data-movie-id="${escapeHtml(movie.id)}">
            <div class="movie-page-poster-column">
              <div class="movie-page-poster-wrapper">${posterHtml}</div>
              ${getYouTubeTrailerEmbedUrl(movie.trailer_url) ? getMoviePageTrailerButtonHtml({ pending: true }) : ''}
            </div>
            <div class="movie-page-main-column">
              <div class="movie-page-title-block">
                <div class="movie-page-title-row">
                  ${getMoviePageIntroHtml(movie, escapeHtml)}
                  <div class="movie-page-summary-panel" aria-hidden="true"></div>
                </div>
                <div class="movie-page-meta-list">
                  <div class="movie-page-meta-item"><span>Год:</span> <strong>${movie.year ?? '-'}</strong></div>
                  <div class="movie-page-meta-item"><span>Режиссёр:</span> ${movie.director ? escapeHtml(movie.director) : '-'}</div>
                  <div class="movie-page-meta-item"><span>Жанры:</span> ${genres ? escapeHtml(genres) : '-'}</div>
                  <div class="movie-page-meta-item"><span>Страны:</span> ${countries ? escapeHtml(countries) : '-'}</div>
                  ${production ? `<div class="movie-page-meta-item"><span>Производство:</span> ${escapeHtml(production)}</div>` : ''}
                  ${distribution ? `<div class="movie-page-meta-item"><span>Дистрибуция:</span> ${escapeHtml(distribution)}</div>` : ''}
                  ${russianDistribution ? `<div class="movie-page-meta-item"><span>Дистрибуция в России:</span> ${escapeHtml(russianDistribution)}</div>` : ''}
                </div>
              </div>
            </div>
          </article>
        </div>`;
}

function renderMovieNotFoundFallbackHtml() {
  return `        <div class="empty-state movie-page-server-fallback">
          <div class="empty-state-icon" aria-hidden="true">◊</div>
          <div class="empty-state-title">Фильм не найден</div>
          <div class="empty-state-text">Возможно, ссылка устарела или фильм был удалён из каталога.</div>
          <div class="empty-state-actions">
            <a href="/" class="secondary-button secondary-button-compact empty-state-reset-btn">Вернуться в каталог</a>
          </div>
        </div>`;
}

function getMoviePageSeo(movie) {
  const socialTitle = getMovieTitleWithYear(movie);
  const image = getMovieSocialImage(movie);
  return {
    title: `${socialTitle} — Хоррорейро`,
    socialTitle,
    description: getMovieSeoDescription(movie),
    canonicalUrl: getMovieCanonicalUrl(movie),
    type: 'video.movie',
    image,
    imageAlt: image === DEFAULT_SOCIAL_IMAGE ? undefined : `Постер фильма «${movie.title}»`
  };
}

function applyMovieSeoToHtml(html, movie) {
  let nextHtml = applyPageSeoToHtml(html, getMoviePageSeo(movie));
  if (Array.isArray(movie.movie_companies)) {
    nextHtml = upsertMetaName(nextHtml, 'movie-company-links', JSON.stringify({
      id: movie.id,
      source: getMoviePageCompanySource(movie),
      rows: movie.movie_companies
    }));
  }
  nextHtml = upsertJsonLd(nextHtml, 'movieStructuredData', buildMovieJsonLd(movie));
  nextHtml = upsertJsonLd(nextHtml, 'movieBreadcrumbs', {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Каталог фильмов ужасов', item: `${SITE_ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: movie.title }
    ]
  });
  nextHtml = injectMovieFallback(nextHtml, renderMovieFallbackHtml(movie));

  return nextHtml;
}

function applyNotFoundSeoToHtml(html, requestUrl) {
  let nextHtml = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>Фильм не найден — Хоррорейро</title>');
  nextHtml = upsertMetaName(nextHtml, 'description', 'Фильм не найден в каталоге Хоррорейро.');
  nextHtml = upsertCanonical(nextHtml, requestUrl);
  nextHtml = upsertMetaName(nextHtml, 'robots', 'noindex, follow');
  nextHtml = injectMovieFallback(nextHtml, renderMovieNotFoundFallbackHtml());

  return nextHtml;
}

async function getMovieHtmlAsset(env, request) {
  const assetUrl = new URL('/movie.html', request.url);
  return env.ASSETS.fetch(assetUrl.toString());
}

function createHtmlResponse(html, assetResponse, { status = 200, cacheControl = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' } = {}) {
  const headers = new Headers(assetResponse.headers);
  headers.set('Content-Type', 'text/html; charset=UTF-8');
  headers.set('Cache-Control', cacheControl);
  headers.append('Vary', 'User-Agent');
  headers.delete('Content-Length');

  return new Response(html, {
    status,
    headers
  });
}

async function createMovieHtmlResponse({ env, request, movie, status = 200 }) {
  const assetResponse = await getMovieHtmlAsset(env, request);
    const html = addAppBuildHint(await assetResponse.text(), env);
  const requestUrl = new URL(request.url).toString();

  if (!movie) {
    return createHtmlResponse(applyNotFoundSeoToHtml(html, requestUrl), assetResponse, {
      status,
      cacheControl: 'no-store'
    });
  }

  if (isSocialPreviewCrawler(request)) {
    return new Response(createSocialPreviewHtml(movie), {
      status,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300, must-revalidate',
        'Vary': 'User-Agent',
        'Content-Type': 'text/html; charset=UTF-8'
      }
    });
  }

  return createHtmlResponse(applyMovieSeoToHtml(html, movie), assetResponse, { status });
}

async function fetchMovieBySlugOrId(env, { slug = '', id = '' } = {}) {
  const normalizedSlug = normalizeText(slug);
  const normalizedId = normalizeText(id);

  if (!normalizedSlug && !normalizedId) {
    return null;
  }

  const params = {
    select: MOVIE_SELECT,
    limit: '1'
  };

  if (normalizedSlug) {
    params.slug = `eq.${normalizedSlug}`;
  } else {
    params.id = `eq.${normalizedId}`;
  }

  const paramsWithCompanies = {
    ...params,
    select: `${MOVIE_SELECT},${MOVIE_COMPANY_LINKS_SELECT}`,
    'movie_companies.order': 'role.asc,position.asc,company_id.asc'
  };
  const paramsWithPoster = {
    ...paramsWithCompanies,
    select: `${paramsWithCompanies.select},movie_poster_images(image_url)`,
    'movie_poster_images.order': 'position.asc',
    'movie_poster_images.limit': '1'
  };
  const isMissingOptionalRelation = error => ['42P01', '42501', 'PGRST200', 'PGRST205'].includes(error.code);
  return fetchCachedSeoRow(env, 'movies', paramsWithPoster, () => fetchSupabaseRows(env, 'movies', paramsWithPoster)
    .catch(error => {
      if (!isMissingOptionalRelation(error)) throw error;
      return fetchSupabaseRows(env, 'movies', paramsWithCompanies);
    })
    .catch(error => {
      if (!isMissingOptionalRelation(error)) throw error;
      return fetchSupabaseRows(env, 'movies', params);
    }));
}

function fetchCachedSeoRow(env, tableName, params, loadRows = () =>
  fetchSupabaseRows(env, tableName, params, { signal: AbortSignal.timeout(6500) })
) {
  const cacheKey = JSON.stringify([getSupabaseTableUrl(env, tableName, params).toString(), env.SUPABASE_ANON_KEY]);
  const cached = SEO_ROW_CACHE.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.promise;

  // Cache only public SEO data; client detail/user state reads stay fresh.
  const entry = { expiresAt: Date.now() + SEO_ROW_CACHE_TTL_MS, promise: null };
  entry.promise = loadRows()
    .then(rows => {
      const row = Array.isArray(rows) ? rows[0] || null : null;
      if (!row && SEO_ROW_CACHE.get(cacheKey) === entry) {
        SEO_ROW_CACHE.delete(cacheKey);
      }
      return row;
    })
    .catch(error => {
      if (SEO_ROW_CACHE.get(cacheKey) === entry) {
        SEO_ROW_CACHE.delete(cacheKey);
      }
      throw error;
    });
  SEO_ROW_CACHE.delete(cacheKey);
  SEO_ROW_CACHE.set(cacheKey, entry);

  while (SEO_ROW_CACHE.size > SEO_ROW_CACHE_LIMIT) {
    SEO_ROW_CACHE.delete(SEO_ROW_CACHE.keys().next().value);
  }

  return entry.promise;
}

async function fetchSitemapRows(env, tableName, params, signal) {
  const pageSize = 500;
  const rows = [];
  for (let offset = 0; ; offset += pageSize) {
    const page = await fetchSupabaseRows(env, tableName, {
      ...params, order: 'id.asc', limit: pageSize, offset
    }, { signal });
    rows.push(...page);
    if (page.length < pageSize) return rows;
  }
}

async function createSitemapXml(env) {
  const signal = AbortSignal.timeout(8000);
  const [movies, directors, companies] = await Promise.all([
    fetchSitemapRows(env, 'movies', { select: 'id,slug' }, signal),
    fetchSitemapRows(env, 'people', {
      select: 'slug,movie_people!inner(person_id)', slug: 'not.is.null',
      'movie_people.role': 'eq.director', 'movie_people.limit': '1'
    }, signal),
    fetchSitemapRows(env, 'companies', {
      select: 'slug,movie_companies!inner(company_id)', slug: 'not.is.null', 'movie_companies.limit': '1'
    }, signal)
  ]);
  const urls = [
    `${SITE_ORIGIN}/`,
    ...movies.filter(movie => movie.slug || movie.id).map(getMovieCanonicalUrl),
    ...directors.filter(row => row.slug).map(row => `${SITE_ORIGIN}/name/${encodeURIComponent(row.slug)}`),
    ...companies.filter(row => row.slug).map(row => `${SITE_ORIGIN}/company/${encodeURIComponent(row.slug)}`)
  ];

  const urlEntries = [...new Set(urls)].map(url => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
}

export {
  SITE_ORIGIN,
  applyPageSeoToHtml,
  createMovieHtmlResponse,
  createSitemapXml,
  escapeHtml,
  fetchCachedSeoRow,
  fetchMovieBySlugOrId,
  getMovieCanonicalUrl,
  getMoviePagePath,
  getMoviePosterSource,
  getMovieTitleWithYear,
  isPublicMoviePosterUrl,
  upsertJsonLd
};
