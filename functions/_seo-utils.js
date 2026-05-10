const SITE_ORIGIN = 'https://horroreiro.ru';
const DEFAULT_SOCIAL_IMAGE = `${SITE_ORIGIN}/og-preview.jpg`;

const MOVIE_SELECT = `
  id,
  slug,
  title,
  original_title,
  year,
  director,
  rating,
  poster_url,
  created_at,
  release_year,
  release_month,
  kinopoisk_url,
  imdb_url,
  letterboxd_url,
  rottentomatoes_url,
  search_aliases,
  synopsis,
  primary_subgenre,
  secondary_subgenres,
  formats,
  movie_genres (
    position,
    genres (name)
  ),
  movie_countries (
    countries (name)
  )
`;

const SITEMAP_MOVIE_SELECT = 'id, slug, created_at';

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
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

async function fetchSupabaseRows(env, tableName, params = {}) {
  const response = await fetch(getSupabaseTableUrl(env, tableName, params), {
    headers: getSupabaseHeaders(env)
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`);
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

function getMoviePagePath(movie) {
  if (movie?.slug) {
    return `/movie/${encodeURIComponent(movie.slug)}`;
  }

  return `/movie.html?id=${encodeURIComponent(movie?.id || '')}`;
}

function getMovieCanonicalUrl(movie) {
  return `${SITE_ORIGIN}${getMoviePagePath(movie)}`;
}

function getMovieSocialImage(movie) {
  return movie?.poster_url || DEFAULT_SOCIAL_IMAGE;
}

function getMovieSeoTitle(movie) {
  const yearSuffix = movie?.year ? ` (${movie.year})` : '';
  return `${movie?.title || 'Фильм ужасов'}${yearSuffix} — Хоррорейро`;
}

function getMovieSeoDescription(movie) {
  const details = [
    movie?.year ? `${movie.year}` : '',
    movie?.director ? `режиссёр: ${movie.director}` : '',
    getMovieGenreNames(movie).length > 0 ? `жанры: ${getMovieGenreNames(movie).join(', ')}` : ''
  ].filter(Boolean).join(' · ');
  const synopsis = normalizeText(movie?.synopsis);
  const text = [
    `${movie?.title || 'Фильм ужасов'} в каталоге Хоррорейро.`,
    details,
    synopsis
  ].filter(Boolean).join(' ');

  return truncateText(text, 165);
}

function getMovieSameAs(movie) {
  return [
    movie?.kinopoisk_url,
    movie?.imdb_url,
    movie?.letterboxd_url,
    movie?.rottentomatoes_url
  ].filter(Boolean);
}

function getMovieDatePublished(movie) {
  const year = movie?.release_year || movie?.year;
  const month = movie?.release_month;

  if (!year) {
    return undefined;
  }

  if (month) {
    return `${year}-${String(month).padStart(2, '0')}-01`;
  }

  return String(year);
}

function buildMovieJsonLd(movie) {
  const votesCount = Number(movie?.votes_count || 0);
  const ratingValue = Number(movie?.average_rating || movie?.rating || 0);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie?.title || '',
    url: getMovieCanonicalUrl(movie),
    image: getMovieSocialImage(movie),
    description: getMovieSeoDescription(movie),
    inLanguage: 'ru-RU'
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

  const datePublished = getMovieDatePublished(movie);

  if (datePublished) {
    jsonLd.datePublished = datePublished;
  }

  const sameAs = getMovieSameAs(movie);

  if (sameAs.length > 0) {
    jsonLd.sameAs = sameAs;
  }

  if (votesCount > 0 && ratingValue > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(ratingValue.toFixed(1)),
      bestRating: 10,
      worstRating: 1,
      ratingCount: votesCount
    };
  }

  return jsonLd;
}

function upsertHeadElement(html, pattern, elementHtml) {
  if (pattern.test(html)) {
    return html.replace(pattern, elementHtml);
  }

  return html.replace('</head>', `  ${elementHtml}\n</head>`);
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
    `<!-- MOVIE_PAGE_FALLBACK_START -->\n${fallbackHtml}\n        <!-- MOVIE_PAGE_FALLBACK_END -->`
  );
}

function renderMovieFallbackHtml(movie) {
  const genres = getMovieGenreNames(movie).join(', ');
  const countries = getMovieCountryNames(movie).join(', ');
  const posterHtml = movie?.poster_url
    ? `
          <div class="movie-page-poster-wrapper">
            <img class="movie-page-poster" src="${escapeHtml(movie.poster_url)}" alt="Постер фильма ${escapeHtml(movie.title)}" loading="eager">
          </div>`
    : '<div class="movie-poster-placeholder">Нет постера</div>';

  return `        <div class="movie-page-stack movie-page-server-fallback" data-server-rendered="true">
          <article class="movie-page-layout" data-movie-id="${escapeHtml(movie.id)}">
            <div class="movie-page-poster-column">
              ${posterHtml}
            </div>
            <div class="movie-page-main-column">
              <div class="movie-page-title-block">
                <div class="movie-page-title-main">
                  <h1 class="movie-page-title">${escapeHtml(movie.title)}</h1>
                  ${movie.original_title ? `<div class="movie-page-original-title">${escapeHtml(movie.original_title)}</div>` : ''}
                </div>
                <div class="movie-page-meta-list">
                  <div class="movie-page-meta-item"><span>Год:</span> <strong>${movie.year ?? '-'}</strong></div>
                  <div class="movie-page-meta-item"><span>Режиссёр:</span> ${movie.director ? escapeHtml(movie.director) : '-'}</div>
                  <div class="movie-page-meta-item"><span>Жанры:</span> ${genres ? escapeHtml(genres) : '-'}</div>
                  <div class="movie-page-meta-item"><span>Страны:</span> ${countries ? escapeHtml(countries) : '-'}</div>
                </div>
                ${movie.synopsis ? `<div class="movie-page-synopsis-block"><div class="movie-page-synopsis-text">${escapeHtml(movie.synopsis)}</div></div>` : ''}
              </div>
            </div>
          </article>
        </div>`;
}

function renderMovieNotFoundFallbackHtml() {
  return `        <div class="empty-state">
          <div class="empty-state-icon" aria-hidden="true">◊</div>
          <div class="empty-state-title">Фильм не найден</div>
          <div class="empty-state-text">Возможно, ссылка устарела или фильм был удалён из каталога.</div>
          <div class="empty-state-actions">
            <a href="/" class="secondary-button secondary-button-compact empty-state-reset-btn">Вернуться в каталог</a>
          </div>
        </div>`;
}

function applyMovieSeoToHtml(html, movie) {
  const canonicalUrl = getMovieCanonicalUrl(movie);
  const title = getMovieSeoTitle(movie);
  const description = getMovieSeoDescription(movie);
  const image = getMovieSocialImage(movie);

  let nextHtml = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  nextHtml = upsertMetaName(nextHtml, 'description', description);
  nextHtml = upsertCanonical(nextHtml, canonicalUrl);
  nextHtml = upsertMetaName(nextHtml, 'robots', 'index, follow');
  nextHtml = upsertMetaProperty(nextHtml, 'og:type', 'video.movie');
  nextHtml = upsertMetaProperty(nextHtml, 'og:title', title);
  nextHtml = upsertMetaProperty(nextHtml, 'og:description', description);
  nextHtml = upsertMetaProperty(nextHtml, 'og:url', canonicalUrl);
  nextHtml = upsertMetaProperty(nextHtml, 'og:image', image);
  nextHtml = upsertMetaProperty(nextHtml, 'og:site_name', 'Хоррорейро');
  nextHtml = upsertMetaName(nextHtml, 'twitter:card', 'summary_large_image');
  nextHtml = upsertMetaName(nextHtml, 'twitter:title', title);
  nextHtml = upsertMetaName(nextHtml, 'twitter:description', description);
  nextHtml = upsertMetaName(nextHtml, 'twitter:image', image);
  nextHtml = upsertMetaName(nextHtml, 'twitter:url', canonicalUrl);
  nextHtml = upsertJsonLd(nextHtml, 'movieStructuredData', buildMovieJsonLd(movie));
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
  return env.ASSETS.fetch(assetUrl);
}

function createHtmlResponse(html, assetResponse, { status = 200, cacheControl = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' } = {}) {
  const headers = new Headers(assetResponse.headers);
  headers.set('Content-Type', 'text/html; charset=UTF-8');
  headers.set('Cache-Control', cacheControl);
  headers.delete('Content-Length');

  return new Response(html, {
    status,
    headers
  });
}

async function createMovieHtmlResponse({ env, request, movie, status = 200 }) {
  const assetResponse = await getMovieHtmlAsset(env, request);
  const html = await assetResponse.text();
  const requestUrl = new URL(request.url).toString();

  if (!movie) {
    return createHtmlResponse(applyNotFoundSeoToHtml(html, requestUrl), assetResponse, {
      status,
      cacheControl: 'no-store'
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

  const rows = await fetchSupabaseRows(env, 'movies', params);
  return Array.isArray(rows) ? rows[0] || null : null;
}

async function fetchMoviesForSitemap(env) {
  return fetchSupabaseRows(env, 'movies', {
    select: SITEMAP_MOVIE_SELECT,
    order: 'created_at.desc',
    limit: '5000'
  });
}

function createSitemapXml(movies) {
  const urls = [
    { loc: `${SITE_ORIGIN}/` },
    ...(Array.isArray(movies) ? movies : [])
      .filter(movie => movie?.slug || movie?.id)
      .map(movie => ({
        loc: getMovieCanonicalUrl(movie),
        lastmod: movie?.created_at ? String(movie.created_at).slice(0, 10) : ''
      }))
  ];

  const urlEntries = urls.map(item => {
    const lastmod = item.lastmod ? `\n    <lastmod>${escapeXml(item.lastmod)}</lastmod>` : '';

    return `  <url>\n    <loc>${escapeXml(item.loc)}</loc>${lastmod}\n  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
}

export {
  SITE_ORIGIN,
  createMovieHtmlResponse,
  createSitemapXml,
  fetchMovieBySlugOrId,
  fetchMoviesForSitemap,
  getMovieCanonicalUrl
};
