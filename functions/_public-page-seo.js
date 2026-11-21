import { fetchNoStoreAsset } from './_response-utils.js';
import {
  SITE_ORIGIN, applyPageSeoToHtml, escapeHtml, fetchCachedSeoRow,
  getMoviePagePath, getMovieTitleWithYear, upsertJsonLd
} from './_seo-utils.js';

const hasText = value => Boolean(String(value || '').trim());

const pages = {
  director: {
    asset: '/name.html',
    prefix: '/name/',
    table: 'people',
    key: 'slug',
    select: 'slug,name,name_ru,birth_date,death_date,birth_place,aliases,movie_people(movies(id,slug,title,year))',
    relation: 'movie_people',
    filters: { 'movie_people.role': 'eq.director' },
    name: row => row.name_ru || row.name,
    skeletonFields: row => ({
      'original-name': hasText(row.name),
      dates: Boolean(row.birth_date || row.death_date),
      'birth-place': hasText(row.birth_place),
      aliases: Array.isArray(row.aliases) && row.aliases.some(hasText)
    }),
    title: name => `${name} — фильмография режиссёра | Хоррорейро`,
    description: name => `Фильмография режиссёра ${name} в каталоге Хоррорейро. Карточки фильмов, оценки и рецензии зрителей.`,
    schema: (row, name) => ({ '@type': 'Person', name, jobTitle: 'Режиссёр', alternateName: row.name !== name ? row.name : undefined })
  },
  company: {
    asset: '/company.html',
    prefix: '/company/',
    table: 'companies',
    key: 'slug',
    select: 'slug,name,country,movie_companies(movies(id,slug,title,year))',
    relation: 'movie_companies',
    name: row => row.name,
    skeletonFields: row => ({ country: hasText(row.country) }),
    title: name => `${name} — фильмы компании | Хоррорейро`,
    description: (name, row) => `Фильмы компании ${name} в каталоге Хоррорейро. Производство и дистрибуция фильмов ужасов.${row.country ? ` Страна: ${row.country}.` : ''}`,
    schema: (_row, name) => ({ '@type': 'Organization', name })
  },
  profile: {
    asset: '/user.html',
    prefix: '/user/',
    table: 'profiles',
    key: 'default_display_name',
    select: 'display_name,default_display_name',
    name: row => row.display_name || row.default_display_name,
    title: name => `${name} — профиль пользователя Хоррорейро`,
    description: name => `Профиль пользователя ${name}: оценки, список просмотра и рецензии в каталоге Хоррорейро.`,
    schema: (row, name) => ({
      '@type': 'ProfilePage',
      mainEntity: { '@type': 'Person', name, alternateName: row.default_display_name !== name ? row.default_display_name : undefined }
    })
  }
};

function renderPublicPageFallback(name, description, rows) {
  const films = new Map(rows.filter(row => row.movies?.id).map(({ movies }) => [movies.id, movies]));
  const links = Array.from(films.values(), movie =>
    `<li><a href="${escapeHtml(getMoviePagePath(movie))}">${escapeHtml(getMovieTitleWithYear(movie))}</a></li>`
  ).join('');

  return `<noscript><main><p><a href="/">Каталог фильмов ужасов</a></p>
    <h1>${escapeHtml(name)}</h1><p>${escapeHtml(description)}</p>
    ${links ? `<h2>Фильмы в каталоге</h2><ul>${links}</ul>` : ''}</main></noscript>`;
}

export async function getPublicPageResponse({ env, request }, pageType, identifier) {
  const page = pages[pageType];
  const asset = fetchNoStoreAsset(env, request, page.asset);
  const value = String(identifier || '').trim();
  // A director link can also resolve through the client's legacy name fallback.
  const missingStatus = pageType === 'director' ? 200 : 404;
  let row;
  try {
    if (value && (pageType !== 'profile' || /^[A-Za-z0-9_-]{3,80}$/.test(value))) {
      const relationParams = page.relation ? {
        [`${page.relation}.limit`]: '12',
        [`${page.relation}.order`]: 'movie_id.asc'
      } : {};
      row = await fetchCachedSeoRow(env, page.table, {
        select: page.select,
        [page.key]: `eq.${value}`,
        limit: '1',
        ...page.filters,
        ...relationParams
      });
    }
  } catch (error) {
    console.error('Public page SEO lookup failed:', error.message);
    const response = await asset;
    return new Response(response.body, { status: 503, headers: response.headers });
  }

  const response = await asset;
  if (!response.ok) return response;
  if (!row) return new Response(response.body, { status: missingStatus, headers: response.headers });

  const name = page.name(row);
  const canonicalUrl = `${SITE_ORIGIN}${page.prefix}${encodeURIComponent(row[page.key])}`;
  const description = page.description(name, row);
  const seo = {
    title: page.title(name), socialTitle: name, description, canonicalUrl,
    type: pageType === 'profile' ? 'profile' : 'website'
  };
  let html = applyPageSeoToHtml(await response.text(), seo);
  if (page.skeletonFields) {
    const fields = page.skeletonFields(row);
    html = html.replace(/<span data-skeleton-field="([a-z-]+)"[^>]*><\/span>/g,
      (markup, field) => fields[field] ? markup : '');
  }
  html = upsertJsonLd(html, 'publicPageStructuredData', {
    '@context': 'https://schema.org', url: canonicalUrl, ...page.schema(row, name)
  });
  const fallback = renderPublicPageFallback(name, description, row[page.relation] || []);
  html = html.replace('</body>', () => `${fallback}\n</body>`);

  return new Response(request.method === 'HEAD' ? null : html, { headers: response.headers });
}
