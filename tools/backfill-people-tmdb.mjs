import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://uogzcozbnosfguyfbvhe.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_trS_-TlQwFqcM59nELIdsw_ygVI6B0j';
const OUTPUT_DIR = process.env.OUTPUT_DIR || path.resolve(process.cwd(), '.tmp');
const FETCH_DELAY_MS = Number(process.env.FETCH_DELAY_MS || 500);
const FETCH_CONCURRENCY = Number(process.env.FETCH_CONCURRENCY || 2);
const FETCH_RETRY_DELAYS_MS = [2500, 7500, 20000];

const TARGET_ROLE = 'director';
const TMDB_ORIGIN = 'https://www.themoviedb.org';
const LETTERBOXD_ORIGIN = 'https://letterboxd.com';

const MONTHS = new Map([
  ['january', '01'],
  ['february', '02'],
  ['march', '03'],
  ['april', '04'],
  ['may', '05'],
  ['june', '06'],
  ['july', '07'],
  ['august', '08'],
  ['september', '09'],
  ['october', '10'],
  ['november', '11'],
  ['december', '12']
]);

const COUNTRY_TRANSLATIONS = new Map([
  ['argentina', 'Аргентина'],
  ['australia', 'Австралия'],
  ['austria', 'Австрия'],
  ['belarus', 'Беларусь'],
  ['belgium', 'Бельгия'],
  ['brazil', 'Бразилия'],
  ['bulgaria', 'Болгария'],
  ['canada', 'Канада'],
  ['chile', 'Чили'],
  ['china', 'Китай'],
  ['colombia', 'Колумбия'],
  ['croatia', 'Хорватия'],
  ['cuba', 'Куба'],
  ['czech republic', 'Чехия'],
  ['czechoslovakia', 'Чехословакия'],
  ['denmark', 'Дания'],
  ['dominican republic', 'Доминиканская Республика'],
  ['egypt', 'Египет'],
  ['england', 'Великобритания'],
  ['estonia', 'Эстония'],
  ['finland', 'Финляндия'],
  ['france', 'Франция'],
  ['georgia', 'Грузия'],
  ['germany', 'Германия'],
  ['greece', 'Греция'],
  ['greenland', 'Гренландия'],
  ['hong kong', 'Гонконг'],
  ['hungary', 'Венгрия'],
  ['iceland', 'Исландия'],
  ['india', 'Индия'],
  ['indonesia', 'Индонезия'],
  ['iran', 'Иран'],
  ['ireland', 'Ирландия'],
  ['israel', 'Израиль'],
  ['italy', 'Италия'],
  ['japan', 'Япония'],
  ['kazakhstan', 'Казахстан'],
  ['kyrgyzstan', 'Кыргызстан'],
  ['latvia', 'Латвия'],
  ['lithuania', 'Литва'],
  ['malaysia', 'Малайзия'],
  ['malta', 'Мальта'],
  ['mexico', 'Мексика'],
  ['morocco', 'Марокко'],
  ['netherlands', 'Нидерланды'],
  ['new zealand', 'Новая Зеландия'],
  ['nigeria', 'Нигерия'],
  ['north macedonia', 'Северная Македония'],
  ['northern ireland', 'Великобритания'],
  ['norway', 'Норвегия'],
  ['peru', 'Перу'],
  ['philippines', 'Филиппины'],
  ['poland', 'Польша'],
  ['portugal', 'Португалия'],
  ['puerto rico', 'Пуэрто-Рико'],
  ['romania', 'Румыния'],
  ['russia', 'Россия'],
  ['scotland', 'Великобритания'],
  ['serbia', 'Сербия'],
  ['singapore', 'Сингапур'],
  ['slovakia', 'Словакия'],
  ['slovenia', 'Словения'],
  ['south africa', 'ЮАР'],
  ['south korea', 'Южная Корея'],
  ['soviet union', 'СССР'],
  ['spain', 'Испания'],
  ['sweden', 'Швеция'],
  ['switzerland', 'Швейцария'],
  ['taiwan', 'Тайвань'],
  ['thailand', 'Таиланд'],
  ['turkey', 'Турция'],
  ['uk', 'Великобритания'],
  ['u.k.', 'Великобритания'],
  ['ukraine', 'Украина'],
  ['united kingdom', 'Великобритания'],
  ['united states', 'США'],
  ['united states of america', 'США'],
  ['uruguay', 'Уругвай'],
  ['usa', 'США'],
  ['u.s.a.', 'США'],
  ['venezuela', 'Венесуэла'],
  ['vietnam', 'Вьетнам'],
  ['wales', 'Великобритания']
]);

const COUNTRY_HINTS = [
  ['США', [/\b(?:usa|u\.s\.a\.|u\.s\.|united states(?: of america)?)\b/i, /\b(?:california|illinois|maryland|new jersey|new york|ohio|pennsylvania)\b/i, /,\s*oh\b/i, /сша/i]],
  ['Австралия', [/\b(?:australia|south australia)\b/i]],
  ['Великобритания', [/\b(?:uk|u\.k\.|united kingdom|england|scotland|wales|northern ireland)\b/i]],
  ['Дания', [/\b(?:denmark|danmark)\b/i]],
  ['Камбоджа', [/\bcambodia\b/i]],
  ['Канада', [/\bcanada\b/i]],
  ['Россия', [/\brussia\b/i, /россия/i]],
  ['Казахстан', [/\bkazakhstan\b/i, /казахстан/i]],
  ['Ирландия', [/\b(?:ireland|irlanda)\b/i]],
  ['Турция', [/\b(?:turkey|turkiye)\b/i]],
  ['Филиппины', [/\b(?:philippines|filippine)\b/i]],
  ['Эстония', [/\b(?:estonia|estonian)\b/i]],
  ['Чехия', [/\bczech republic\b/i]],
  ['Греция', [/\b(?:greece|grecia)\b/i]]
];

const CYRILLIC_TO_LATIN = new Map([
  ['а', 'a'],
  ['б', 'b'],
  ['в', 'v'],
  ['г', 'g'],
  ['д', 'd'],
  ['е', 'e'],
  ['ё', 'e'],
  ['ж', 'zh'],
  ['з', 'z'],
  ['и', 'i'],
  ['й', 'y'],
  ['к', 'k'],
  ['л', 'l'],
  ['м', 'm'],
  ['н', 'n'],
  ['о', 'o'],
  ['п', 'p'],
  ['р', 'r'],
  ['с', 's'],
  ['т', 't'],
  ['у', 'u'],
  ['ф', 'f'],
  ['х', 'h'],
  ['ц', 'ts'],
  ['ч', 'ch'],
  ['ш', 'sh'],
  ['щ', 'shch'],
  ['ъ', ''],
  ['ы', 'y'],
  ['ь', ''],
  ['э', 'e'],
  ['ю', 'yu'],
  ['я', 'ya']
]);

const requestCache = new Map();

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function decodeHtml(value = '') {
  return String(value)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function stripTags(value = '') {
  return decodeHtml(String(value).replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeWhitespace(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function normalizeComparableName(value = '') {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b[a-z]\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function transliterateCyrillic(value = '') {
  return String(value || '')
    .toLowerCase()
    .replace(/[а-яё]/g, letter => CYRILLIC_TO_LATIN.get(letter) ?? letter);
}

function levenshteinDistance(left = '', right = '') {
  const a = String(left);
  const b = String(right);

  if (a === b) {
    return 0;
  }

  if (!a.length) {
    return b.length;
  }

  if (!b.length) {
    return a.length;
  }

  const row = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    let previous = row[0];
    row[0] = i;

    for (let j = 1; j <= b.length; j += 1) {
      const current = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        previous + cost
      );
      previous = current;
    }
  }

  return row[b.length];
}

function similarityRatio(left = '', right = '') {
  const a = normalizeComparableName(left);
  const b = normalizeComparableName(right);
  const maxLength = Math.max(a.length, b.length);

  if (!maxLength) {
    return 0;
  }

  return 1 - (levenshteinDistance(a, b) / maxLength);
}

function getNameTokens(value = '') {
  return normalizeComparableName(value).split(' ').filter(Boolean);
}

function getNameMatchScore(localPerson, tmdbName) {
  const localNames = [
    localPerson.name,
    transliterateCyrillic(localPerson.name_ru)
  ].filter(value => !isBlank(value));
  const normalizedTmdbName = normalizeComparableName(tmdbName);

  if (!normalizedTmdbName || localNames.length === 0) {
    return 0;
  }

  let bestScore = 0;

  for (const localName of localNames) {
    const normalizedLocalName = normalizeComparableName(localName);
    const fullScore = similarityRatio(normalizedLocalName, normalizedTmdbName);
    const localTokens = getNameTokens(normalizedLocalName);
    const tmdbTokens = getNameTokens(normalizedTmdbName);
    const localLastToken = localTokens.at(-1) || '';
    const tmdbLastToken = tmdbTokens.at(-1) || '';
    const lastTokenScore = similarityRatio(localLastToken, tmdbLastToken);
    const exactTokenMatches = localTokens.filter(token => tmdbTokens.includes(token)).length;
    const tokenScore = exactTokenMatches / Math.max(localTokens.length, tmdbTokens.length, 1);
    const firstInitialMatches = Boolean(localTokens[0]?.[0] && tmdbTokens[0]?.[0] && localTokens[0][0] === tmdbTokens[0][0]);
    const strongSurnameScore = lastTokenScore >= 0.84 && firstInitialMatches
      ? Math.min(0.94, 0.72 + (lastTokenScore * 0.22))
      : 0;

    bestScore = Math.max(
      bestScore,
      fullScore,
      tokenScore,
      strongSurnameScore
    );
  }

  return bestScore;
}

function chooseTmdbDirectorForPerson(localPerson, tmdbDirectors) {
  const scoredCandidates = tmdbDirectors
    .map(director => ({
      director,
      score: getNameMatchScore(localPerson, director.name)
    }))
    .sort((left, right) => right.score - left.score);
  const best = scoredCandidates[0];
  const second = scoredCandidates[1];

  if (!best || best.score < 0.68) {
    return null;
  }

  if (second && best.score - second.score < 0.08) {
    return null;
  }

  return {
    ...best.director,
    matchScore: Number(best.score.toFixed(3))
  };
}

function isBlank(value) {
  return !normalizeWhitespace(value || '');
}

function escapeSql(value) {
  return String(value).replace(/'/g, "''");
}

function sqlText(value) {
  return `'${escapeSql(value)}'`;
}

function normalizeTmdbPersonUrl(value = '') {
  const match = String(value).match(/themoviedb\.org\/person\/(\d+)(?:-([^/?#]+))?/i)
    || String(value).match(/^\/person\/(\d+)(?:-([^/?#]+))?/i);

  if (!match) {
    return '';
  }

  const id = match[1];
  const slug = match[2] ? `-${match[2]}` : '';
  return `${TMDB_ORIGIN}/person/${id}${slug}`;
}

function normalizeTmdbMovieUrl(value = '') {
  const match = String(value).match(/themoviedb\.org\/movie\/(\d+)(?:-([^/?#]+))?/i)
    || String(value).match(/^\/movie\/(\d+)(?:-([^/?#]+))?/i);

  if (!match) {
    return '';
  }

  const id = match[1];
  const slug = match[2] ? `-${match[2]}` : '';
  return `${TMDB_ORIGIN}/movie/${id}${slug}`;
}

function normalizeLetterboxdUrl(value = '') {
  const trimmed = String(value || '').trim();

  if (!trimmed) {
    return '';
  }

  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `${LETTERBOXD_ORIGIN}${trimmed}`);

    if (!/letterboxd\.com$/i.test(url.hostname.replace(/^www\./i, ''))) {
      return '';
    }

    const parts = url.pathname.split('/').filter(Boolean);
    const filmIndex = parts.indexOf('film');

    if (filmIndex < 0 || !parts[filmIndex + 1]) {
      return '';
    }

    return `${LETTERBOXD_ORIGIN}/film/${parts[filmIndex + 1]}/`;
  } catch {
    return '';
  }
}

function extractImdbTitleId(value = '') {
  return String(value || '').match(/imdb\.com\/title\/(tt\d+)/i)?.[1] || '';
}

async function fetchText(url) {
  if (requestCache.has(url)) {
    return requestCache.get(url);
  }

  const promise = (async () => {
    await delay(FETCH_DELAY_MS);

    let response = null;

    for (let attempt = 0; attempt <= FETCH_RETRY_DELAYS_MS.length; attempt += 1) {
      response = await fetch(url, {
        headers: {
          'accept-language': 'en-US,en;q=0.9',
          'user-agent': 'Mozilla/5.0 (compatible; HorroreiroDataBackfill/1.0)'
        }
      });

      if (response.status !== 429 || attempt === FETCH_RETRY_DELAYS_MS.length) {
        break;
      }

      const retryAfter = Number(response.headers.get('retry-after'));
      const retryDelay = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : FETCH_RETRY_DELAYS_MS[attempt];

      await delay(retryDelay);
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }

    return response.text();
  })();

  requestCache.set(url, promise);
  return promise;
}

async function restSelect(table, params) {
  const rows = [];
  const pageSize = 1000;
  let from = 0;

  while (true) {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    const response = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        range: `${from}-${from + pageSize - 1}`
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase REST ${table}: HTTP ${response.status} ${await response.text()}`);
    }

    const page = await response.json();
    rows.push(...page);

    if (page.length < pageSize) {
      break;
    }

    from += pageSize;
  }

  return rows;
}

function extractTmdbMovieFromLetterboxd(html) {
  const dataId = html.match(/data-tmdb-type=["']movie["'][^>]*data-tmdb-id=["'](\d+)["']/i)?.[1]
    || html.match(/data-tmdb-id=["'](\d+)["'][^>]*data-tmdb-type=["']movie["']/i)?.[1];

  if (dataId) {
    return `${TMDB_ORIGIN}/movie/${dataId}`;
  }

  return normalizeTmdbMovieUrl(html.match(/href=["'](https?:\/\/www\.themoviedb\.org\/movie\/[^"']+)["'][^>]*>\s*TMDB\s*</i)?.[1] || '');
}

function parseTmdbMovieDirectors(html) {
  const peopleList = html.match(/<ol class=["'][^"']*\bpeople\b[^"']*["'][^>]*>([\s\S]*?)<\/ol>/i)?.[1] || '';
  const directors = [];

  for (const match of peopleList.matchAll(/<li class=["'][^"']*\bprofile\b[^"']*["'][^>]*>([\s\S]*?)<\/li>/gi)) {
    const segment = match[1];
    const role = stripTags(segment.match(/<p class=["']character["'][^>]*>([\s\S]*?)<\/p>/i)?.[1] || '');

    if (!/\bDirector\b/i.test(role)) {
      continue;
    }

    const linkMatch = segment.match(/<a href=["'](\/person\/\d+[^"']*)["'][^>]*>([\s\S]*?)<\/a>/i);

    if (!linkMatch) {
      continue;
    }

    directors.push({
      tmdbUrl: normalizeTmdbPersonUrl(linkMatch[1]),
      name: stripTags(linkMatch[2]),
      role
    });
  }

  return directors.filter(director => director.tmdbUrl);
}

function parseTmdbPersonFact(html, labels) {
  const factsSection = html.match(/<section class=["']facts["'][^>]*>([\s\S]*?)<\/section>/i)?.[1] || html;

  for (const label of labels) {
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`<strong>\\s*<bdi>${escapedLabel}<\\/bdi>\\s*<\\/strong>([\\s\\S]*?)<\\/p>`, 'i');
    const match = factsSection.match(regex);

    if (match) {
      return stripTags(match[1]);
    }
  }

  return '';
}

function parseTmdbPersonData(html, fallbackUrl) {
  const titleName = stripTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
    .replace(/\s+—\s+The Movie Database.*$/i, '')
    .trim();
  const headingName = stripTags(html.match(/<h2 class=["']title["'][^>]*>\s*<a[^>]*>([\s\S]*?)<\/a>/i)?.[1] || '');
  const canonicalUrl = normalizeTmdbPersonUrl(html.match(/<h2 class=["']title["'][^>]*>\s*<a href=["']([^"']+)["']/i)?.[1] || fallbackUrl);
  const birthday = parseTmdbDate(parseTmdbPersonFact(html, ['Birthday']));
  const deathday = parseTmdbDate(parseTmdbPersonFact(html, ['Day of Death', 'Deathday']));
  const rawBirthPlace = parseTmdbPersonFact(html, ['Place of Birth']);
  const country = extractCountryFromPlace(rawBirthPlace);

  return {
    tmdbUrl: canonicalUrl || normalizeTmdbPersonUrl(fallbackUrl),
    name: headingName || titleName,
    birthDate: birthday,
    deathDate: deathday,
    birthPlaceCountry: country.known ? country.value : '',
    rawBirthPlace,
    countryKnown: country.known
  };
}

function parseTmdbDate(value = '') {
  const cleanValue = stripTags(value)
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const match = cleanValue.match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);

  if (!match) {
    return '';
  }

  const month = MONTHS.get(match[1].toLowerCase());

  if (!month) {
    return '';
  }

  return `${match[3]}-${month}-${String(match[2]).padStart(2, '0')}`;
}

function extractCountryFromPlace(value = '') {
  const rawPlace = stripTags(value);

  if (!rawPlace || /^[-—]+$/.test(rawPlace)) {
    return {
      value: '',
      known: true
    };
  }

  const normalizedWholePlace = rawPlace
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/\.$/, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
  const wholePlaceCountry = COUNTRY_HINTS.find(([, hints]) => (
    hints.some(pattern => pattern.test(normalizedWholePlace))
  ));

  if (wholePlaceCountry) {
    return {
      value: wholePlaceCountry[0],
      known: true
    };
  }

  const lastPart = normalizedWholePlace
    .split(',')
    .map(part => part.trim())
    .filter(Boolean)
    .pop()
    ?.replace(/^\(|\)$/g, '')
    ?.replace(/^now\s+/i, '')
    || '';
  const normalized = lastPart
    .replace(/^the\s+/i, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
  const translated = COUNTRY_TRANSLATIONS.get(normalized);

  return {
    value: translated || lastPart,
    known: Boolean(translated)
  };
}

function buildMovieLabel(movie) {
  return `${movie.title || movie.original_title || movie.id}${movie.release_year || movie.year ? ` (${movie.release_year || movie.year})` : ''}`;
}

function buildUpdateSql(update) {
  const setParts = [];

  if (update.values.tmdb_url) {
    setParts.push(`tmdb_url = case when nullif(btrim(coalesce(tmdb_url, '')), '') is null then ${sqlText(update.values.tmdb_url)} else tmdb_url end`);
  }

  if (update.values.name) {
    setParts.push(`name = case when nullif(btrim(coalesce(name, '')), '') is null then ${sqlText(update.values.name)} else name end`);
  }

  if (update.values.birth_date) {
    setParts.push(`birth_date = case when birth_date is null then date ${sqlText(update.values.birth_date)} else birth_date end`);
  }

  if (update.values.death_date) {
    setParts.push(`death_date = case when death_date is null then date ${sqlText(update.values.death_date)} else death_date end`);
  }

  if (update.values.birth_place) {
    setParts.push(`birth_place = case when nullif(btrim(coalesce(birth_place, '')), '') is null then ${sqlText(update.values.birth_place)} else birth_place end`);
  }

  if (setParts.length === 0) {
    return '';
  }

  return [
    `update public.people`,
    `set ${setParts.join(',\n    ')}`,
    `where id = ${sqlText(update.person.id)};`
  ].join('\n');
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(Array.from({ length: Math.max(1, limit) }, () => worker()));
  return results;
}

async function fetchLinkedData() {
  const [people, moviePeople, movies] = await Promise.all([
    restSelect('people', {
      select: 'id,slug,name_ru,name,birth_date,death_date,birth_place,tmdb_url',
      order: 'name_ru.asc'
    }),
    restSelect('movie_people', {
      select: 'movie_id,person_id,role,position',
      role: `eq.${TARGET_ROLE}`,
      order: 'position.asc'
    }),
    restSelect('movies', {
      select: 'id,title,original_title,year,release_year,letterboxd_url,letterboxd_short_url,imdb_url',
      order: 'release_year.desc'
    })
  ]);

  return {
    people,
    moviePeople,
    movies
  };
}

async function fetchMovieTmdbDirectors(movie, report) {
  const letterboxdUrl = normalizeLetterboxdUrl(movie.letterboxd_url);

  if (!letterboxdUrl) {
    report.moviesWithoutLetterboxd.push({
      id: movie.id,
      title: buildMovieLabel(movie),
      imdb: extractImdbTitleId(movie.imdb_url)
    });
    return [];
  }

  try {
    const letterboxdHtml = await fetchText(letterboxdUrl);
    const tmdbMovieUrl = extractTmdbMovieFromLetterboxd(letterboxdHtml);

    if (!tmdbMovieUrl) {
      report.moviesWithoutTmdb.push({
        id: movie.id,
        title: buildMovieLabel(movie),
        letterboxdUrl
      });
      return [];
    }

    const movieHtml = await fetchText(tmdbMovieUrl);
    const directors = parseTmdbMovieDirectors(movieHtml);

    if (!directors.length) {
      report.moviesWithoutTmdbDirectors.push({
        id: movie.id,
        title: buildMovieLabel(movie),
        tmdbMovieUrl
      });
    }

    return directors;
  } catch (error) {
    report.movieFetchErrors.push({
      id: movie.id,
      title: buildMovieLabel(movie),
      letterboxdUrl,
      error: error.message
    });
    return [];
  }
}

async function main() {
  const startedAt = new Date();
  const { people, moviePeople, movies } = await fetchLinkedData();
  const peopleById = new Map(people.map(person => [person.id, person]));
  const moviesById = new Map(movies.map(movie => [movie.id, movie]));
  const localDirectorsByMovieId = new Map();

  moviePeople.forEach(row => {
    const list = localDirectorsByMovieId.get(row.movie_id) || [];
    list.push(row);
    localDirectorsByMovieId.set(row.movie_id, list);
  });

  localDirectorsByMovieId.forEach(list => {
    list.sort((left, right) => Number(left.position || 0) - Number(right.position || 0));
  });

  const targetPeople = people.filter(person => (
    isBlank(person.tmdb_url)
    || isBlank(person.name)
    || !person.birth_date
    || !person.death_date
    || isBlank(person.birth_place)
  ));
  const targetPersonIds = new Set(targetPeople.map(person => person.id));
  const targetMovieIds = new Set(
    moviePeople
      .filter(row => targetPersonIds.has(row.person_id))
      .map(row => row.movie_id)
  );
  const targetMovies = Array.from(targetMovieIds)
    .map(movieId => moviesById.get(movieId))
    .filter(Boolean);

  const report = {
    startedAt: startedAt.toISOString(),
    finishedAt: '',
    totals: {
      people: people.length,
      targetPeople: targetPeople.length,
      movies: movies.length,
      targetMovies: targetMovies.length,
      acceptedUpdates: 0,
      skippedPeople: 0
    },
    moviesWithoutLetterboxd: [],
    moviesWithoutTmdb: [],
    moviesWithoutTmdbDirectors: [],
    movieFetchErrors: [],
    ambiguousPeople: [],
    skippedPeople: [],
    unknownCountries: [],
    lowConfidenceNameMatches: [],
    updates: []
  };

  console.log(`People to inspect: ${targetPeople.length}; linked movies: ${targetMovies.length}`);

  const tmdbDirectorsByMovieId = new Map();
  await mapLimit(targetMovies, FETCH_CONCURRENCY, async (movie, index) => {
    if ((index + 1) % 25 === 0 || index === targetMovies.length - 1) {
      console.log(`Movies inspected: ${index + 1}/${targetMovies.length}`);
    }

    tmdbDirectorsByMovieId.set(movie.id, await fetchMovieTmdbDirectors(movie, report));
  });

  const personCandidates = new Map();

  for (const [movieId, localDirectors] of localDirectorsByMovieId.entries()) {
    if (!targetMovieIds.has(movieId)) {
      continue;
    }

    const tmdbDirectors = tmdbDirectorsByMovieId.get(movieId) || [];

    if (!tmdbDirectors.length) {
      continue;
    }

    localDirectors.forEach(row => {
      if (!targetPersonIds.has(row.person_id)) {
        return;
      }

      const localPerson = peopleById.get(row.person_id);
      const candidate = localPerson
        ? chooseTmdbDirectorForPerson(localPerson, tmdbDirectors)
        : null;

      if (!candidate?.tmdbUrl) {
        report.lowConfidenceNameMatches.push({
          personId: row.person_id,
          nameRu: localPerson?.name_ru || '',
          movie: buildMovieLabel(moviesById.get(movieId) || {}),
          tmdbDirectors: tmdbDirectors.map(director => director.name)
        });
        return;
      }

      const candidates = personCandidates.get(row.person_id) || [];
      candidates.push({
        ...candidate,
        movie: moviesById.get(movieId)
      });
      personCandidates.set(row.person_id, candidates);
    });
  }

  targetPeople.forEach(person => {
    if (!isBlank(person.tmdb_url)) {
      const candidates = personCandidates.get(person.id) || [];
      candidates.push({
        tmdbUrl: normalizeTmdbPersonUrl(person.tmdb_url),
        name: person.name || '',
        role: 'existing_tmdb_url',
        movie: null
      });
      personCandidates.set(person.id, candidates);
    }
  });

  const acceptedPeople = [];
  const personDetailsByUrl = new Map();

  for (const person of targetPeople) {
    const candidates = personCandidates.get(person.id) || [];
    const uniqueCandidateUrls = Array.from(new Set(candidates.map(candidate => candidate.tmdbUrl).filter(Boolean)));

    if (uniqueCandidateUrls.length === 0) {
      report.skippedPeople.push({
        id: person.id,
        nameRu: person.name_ru,
        reason: 'no_tmdb_candidate'
      });
      continue;
    }

    if (uniqueCandidateUrls.length > 1) {
      report.ambiguousPeople.push({
        id: person.id,
        nameRu: person.name_ru,
        candidates: uniqueCandidateUrls,
        evidence: candidates.map(candidate => ({
          tmdbUrl: candidate.tmdbUrl,
          tmdbName: candidate.name,
          movie: candidate.movie ? buildMovieLabel(candidate.movie) : null
        }))
      });
      continue;
    }

    acceptedPeople.push({
      person,
      candidateUrl: uniqueCandidateUrls[0],
      evidence: candidates.map(candidate => ({
        tmdbUrl: candidate.tmdbUrl,
        tmdbName: candidate.name,
        movie: candidate.movie ? buildMovieLabel(candidate.movie) : null
      }))
    });
  }

  await mapLimit(acceptedPeople, FETCH_CONCURRENCY, async (item, index) => {
    if ((index + 1) % 25 === 0 || index === acceptedPeople.length - 1) {
      console.log(`People inspected: ${index + 1}/${acceptedPeople.length}`);
    }

    if (personDetailsByUrl.has(item.candidateUrl)) {
      return;
    }

    try {
      const html = await fetchText(item.candidateUrl);
      personDetailsByUrl.set(item.candidateUrl, parseTmdbPersonData(html, item.candidateUrl));
    } catch (error) {
      personDetailsByUrl.set(item.candidateUrl, {
        error: error.message
      });
    }
  });

  for (const item of acceptedPeople) {
    const { person, candidateUrl, evidence } = item;
    const data = personDetailsByUrl.get(candidateUrl);

    if (!data || data.error) {
      report.skippedPeople.push({
        id: person.id,
        nameRu: person.name_ru,
        candidateUrl,
        reason: 'person_fetch_failed',
        error: data?.error || 'missing person data'
      });
      continue;
    }

    if (data.rawBirthPlace && !data.countryKnown) {
      report.unknownCountries.push({
        id: person.id,
        nameRu: person.name_ru,
        rawBirthPlace: data.rawBirthPlace,
        parsedBirthPlace: data.birthPlaceCountry
      });
    }

    const values = {};

    if (isBlank(person.tmdb_url) && data.tmdbUrl) {
      values.tmdb_url = data.tmdbUrl;
    }

    if (isBlank(person.name) && data.name) {
      values.name = data.name;
    }

    if (!person.birth_date && data.birthDate) {
      values.birth_date = data.birthDate;
    }

    if (!person.death_date && data.deathDate) {
      values.death_date = data.deathDate;
    }

    if (isBlank(person.birth_place) && data.birthPlaceCountry) {
      values.birth_place = data.birthPlaceCountry;
    }

    if (Object.keys(values).length === 0) {
      report.skippedPeople.push({
        id: person.id,
        nameRu: person.name_ru,
        candidateUrl,
        reason: 'nothing_to_update'
      });
      continue;
    }

    report.updates.push({
      person,
      values,
      source: data,
      evidence
    });
  }

  report.totals.acceptedUpdates = report.updates.length;
  report.totals.skippedPeople = report.skippedPeople.length + report.ambiguousPeople.length;
  report.finishedAt = new Date().toISOString();

  const sqlUpdates = report.updates
    .map(buildUpdateSql)
    .filter(Boolean);
  const sql = [
    '-- Generated by tools/backfill-people-tmdb.mjs',
    `-- ${report.finishedAt}`,
    'begin;',
    ...sqlUpdates,
    'commit;'
  ].join('\n\n');

  await mkdir(OUTPUT_DIR, {
    recursive: true
  });

  const stamp = report.finishedAt.replace(/[:.]/g, '-');
  const reportPath = path.join(OUTPUT_DIR, `people-tmdb-backfill-${stamp}.json`);
  const sqlPath = path.join(OUTPUT_DIR, `people-tmdb-backfill-${stamp}.sql`);

  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(sqlPath, `${sql}\n`, 'utf8');

  console.log(JSON.stringify({
    reportPath,
    sqlPath,
    ...report.totals,
    ambiguousPeople: report.ambiguousPeople.length,
    movieFetchErrors: report.movieFetchErrors.length,
    moviesWithoutLetterboxd: report.moviesWithoutLetterboxd.length,
    moviesWithoutTmdb: report.moviesWithoutTmdb.length,
    moviesWithoutTmdbDirectors: report.moviesWithoutTmdbDirectors.length,
    unknownCountries: report.unknownCountries.length,
    lowConfidenceNameMatches: report.lowConfidenceNameMatches.length
  }, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
