import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://uogzcozbnosfguyfbvhe.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_trS_-TlQwFqcM59nELIdsw_ygVI6B0j';
const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN || '';
const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const OUTPUT_DIR = process.env.OUTPUT_DIR || path.resolve(process.cwd(), '.tmp');
const APPLY_SQL_PATH = process.env.APPLY_SQL_PATH || '';
const FETCH_CONCURRENCY = Number(process.env.FETCH_CONCURRENCY || 4);
const FETCH_RETRY_DELAYS_MS = [1200, 3000, 8000];

const TARGET_ROLE = 'director';
const TMDB_API_ORIGIN = 'https://api.themoviedb.org/3';
const TMDB_SITE_ORIGIN = 'https://www.themoviedb.org';

const COUNTRY_TRANSLATIONS = new Map([
  ['argentina', 'Аргентина'],
  ['australia', 'Австралия'],
  ['austria', 'Австрия'],
  ['belarus', 'Беларусь'],
  ['belgium', 'Бельгия'],
  ['brazil', 'Бразилия'],
  ['bulgaria', 'Болгария'],
  ['cambodia', 'Камбоджа'],
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
  ['lebanon', 'Ливан'],
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
  ['u.s.', 'США'],
  ['u.s.a.', 'США'],
  ['venezuela', 'Венесуэла'],
  ['vietnam', 'Вьетнам'],
  ['wales', 'Великобритания']
]);

const COUNTRY_HINTS = [
  ['США', [/\b(?:usa|u\.s\.a\.|u\.s\.|united states(?: of america)?)\b/i, /\b(?:california|florida|illinois|maryland|new jersey|new york|ohio|pennsylvania|tennessee|texas)\b/i, /,\s*oh\b/i, /сша/i]],
  ['Австралия', [/\b(?:australia|south australia)\b/i]],
  ['Великобритания', [/\b(?:uk|u\.k\.|united kingdom|england|scotland|wales|northern ireland)\b/i]],
  ['Дания', [/\b(?:denmark|danmark)\b/i]],
  ['Камбоджа', [/\bcambodia\b/i]],
  ['Канада', [/\bcanada\b/i]],
  ['Китай', [/\bchina\b/i, /中国/i]],
  ['Ливан', [/\blebanon\b/i]],
  ['Россия', [/\brussia\b/i, /россия/i]],
  ['Казахстан', [/\bkazakhstan\b/i, /казахстан/i]],
  ['Ирландия', [/\b(?:ireland|irlanda)\b/i]],
  ['Турция', [/\b(?:turkey|turkiye|türkiye)\b/i]],
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
  ['х', 'kh'],
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

function isBlank(value) {
  return !String(value || '').trim();
}

function normalizeComparable(value = '') {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘]/g, "'")
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-zа-яё0-9]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function transliterateCyrillic(value = '') {
  return String(value || '')
    .toLowerCase()
    .replace(/[а-яё]/g, letter => CYRILLIC_TO_LATIN.get(letter) ?? letter);
}

function normalizeRomanizedName(value = '') {
  return normalizeComparable(value)
    .replace(/\bdzh/g, 'j')
    .replace(/dzh/g, 'j')
    .replace(/zh/g, 'j')
    .replace(/kh/g, 'h')
    .replace(/iy\b/g, 'y')
    .replace(/ii\b/g, 'i')
    .replace(/yi\b/g, 'i')
    .replace(/ph/g, 'f')
    .replace(/ck/g, 'k')
    .replace(/oo/g, 'u')
    .replace(/ou/g, 'u')
    .replace(/w/g, 'v')
    .replace(/\s+/g, ' ')
    .trim();
}

function getNameVariants(value = '') {
  const normalized = normalizeComparable(value);
  const transliterated = normalizeRomanizedName(transliterateCyrillic(value));
  const romanized = normalizeRomanizedName(value);

  return Array.from(new Set([
    normalized,
    romanized,
    transliterated
  ].filter(Boolean)));
}

function tokenizeName(value = '') {
  return normalizeRomanizedName(value)
    .split(' ')
    .map(token => token.trim())
    .filter(Boolean);
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
  const a = normalizeRomanizedName(left);
  const b = normalizeRomanizedName(right);
  const maxLength = Math.max(a.length, b.length);

  if (!maxLength) {
    return 0;
  }

  return 1 - (levenshteinDistance(a, b) / maxLength);
}

function tokenSimilarity(leftToken = '', rightToken = '') {
  const left = normalizeRomanizedName(leftToken);
  const right = normalizeRomanizedName(rightToken);

  if (!left || !right) {
    return 0;
  }

  if (left === right) {
    return 1;
  }

  if (left.length === 1 || right.length === 1) {
    return left[0] === right[0] ? 0.82 : 0;
  }

  if (left.length >= 3 && right.length >= 3 && (left.startsWith(right) || right.startsWith(left))) {
    return 0.86;
  }

  return similarityRatio(left, right);
}

function getNameMatchScore(localPerson, tmdbName) {
  const localVariants = [
    ...getNameVariants(localPerson.name_ru),
    ...getNameVariants(localPerson.name)
  ].filter(Boolean);
  const tmdbVariants = getNameVariants(tmdbName);
  let bestScore = 0;

  for (const localName of localVariants) {
    for (const tmdbVariant of tmdbVariants) {
      bestScore = Math.max(bestScore, similarityRatio(localName, tmdbVariant));

      const localTokens = tokenizeName(localName);
      const tmdbTokens = tokenizeName(tmdbVariant);

      if (!localTokens.length || !tmdbTokens.length) {
        continue;
      }

      const localLast = localTokens.at(-1) || '';
      const tmdbLast = tmdbTokens.at(-1) || '';
      const lastScore = tokenSimilarity(localLast, tmdbLast);
      const firstScore = tokenSimilarity(localTokens[0], tmdbTokens[0]);
      const orderedScores = localTokens.map((token, index) => tokenSimilarity(token, tmdbTokens[index] || ''));
      const orderedAverage = orderedScores.reduce((sum, score) => sum + score, 0) / Math.max(localTokens.length, tmdbTokens.length);
      const coverageScores = localTokens.map(token => Math.max(...tmdbTokens.map(candidate => tokenSimilarity(token, candidate))));
      const coverageAverage = coverageScores.reduce((sum, score) => sum + score, 0) / Math.max(localTokens.length, tmdbTokens.length);

      if (lastScore >= 0.82 && firstScore >= 0.7) {
        bestScore = Math.max(bestScore, 0.9);
      }

      if (localTokens.length === 1 && tmdbTokens.some(token => tokenSimilarity(localTokens[0], token) >= 0.94)) {
        bestScore = Math.max(bestScore, 0.72);
      }

      bestScore = Math.max(bestScore, orderedAverage, coverageAverage);
    }
  }

  return Number(bestScore.toFixed(3));
}

function extractImdbTitleId(value = '') {
  return String(value || '').match(/imdb\.com\/title\/(tt\d+)/i)?.[1] || '';
}

function normalizeTmdbPersonUrl(personId) {
  const id = String(personId || '').trim();

  return id ? `${TMDB_SITE_ORIGIN}/person/${id}` : '';
}

function extractCountryFromPlace(value = '') {
  const rawPlace = String(value || '').trim();

  if (!rawPlace || /^[-—]+$/.test(rawPlace)) {
    return {
      value: '',
      known: true
    };
  }

  const normalizedWhole = rawPlace
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/\.$/, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
  const hintedCountry = COUNTRY_HINTS.find(([, patterns]) => patterns.some(pattern => pattern.test(normalizedWhole)));

  if (hintedCountry) {
    return {
      value: hintedCountry[0],
      known: true
    };
  }

  const lastPart = normalizedWhole
    .split(',')
    .map(part => part.trim())
    .filter(Boolean)
    .pop()
    ?.replace(/^\(|\)$/g, '')
    ?.replace(/^now\s+/i, '')
    || '';
  const translated = COUNTRY_TRANSLATIONS.get(lastPart.replace(/^the\s+/i, ''));

  return {
    value: translated || '',
    known: Boolean(translated)
  };
}

function escapeSql(value) {
  return String(value).replace(/'/g, "''");
}

function sqlValue(value) {
  return value === null || value === undefined || value === ''
    ? 'null'
    : `'${escapeSql(value)}'`;
}

function buildMovieLabel(movie) {
  return `${movie.title || movie.original_title || movie.id}${movie.release_year || movie.year ? ` (${movie.release_year || movie.year})` : ''}`;
}

function buildUpdateSql(updates) {
  const rows = updates.map(update => `(${[
    sqlValue(update.person.id),
    sqlValue(update.values.tmdb_url),
    sqlValue(update.values.name),
    sqlValue(update.values.birth_date),
    sqlValue(update.values.death_date),
    sqlValue(update.values.birth_place)
  ].join(', ')})`);

  if (!rows.length) {
    return '-- No updates generated.\n';
  }

  return `with updates(id, tmdb_url, name, birth_date, death_date, birth_place) as (
  values
  ${rows.join(',\n  ')}
)
update public.people as p
set
  tmdb_url = case when nullif(btrim(coalesce(p.tmdb_url, '')), '') is null and u.tmdb_url is not null then u.tmdb_url else p.tmdb_url end,
  name = case when nullif(btrim(coalesce(p.name, '')), '') is null and u.name is not null then u.name else p.name end,
  birth_date = case when p.birth_date is null and u.birth_date is not null then u.birth_date::date else p.birth_date end,
  death_date = case when p.death_date is null and u.death_date is not null then u.death_date::date else p.death_date end,
  birth_place = case when nullif(btrim(coalesce(p.birth_place, '')), '') is null and u.birth_place is not null then u.birth_place else p.birth_place end
from updates as u
where p.id = u.id::uuid;
`;
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

async function tmdbFetch(pathname, params = {}) {
  const url = new URL(`${TMDB_API_ORIGIN}${pathname}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  if (!TMDB_BEARER_TOKEN && TMDB_API_KEY) {
    url.searchParams.set('api_key', TMDB_API_KEY);
  }

  const cacheKey = url.toString();

  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey);
  }

  const promise = (async () => {
    let response = null;

    for (let attempt = 0; attempt <= FETCH_RETRY_DELAYS_MS.length; attempt += 1) {
      response = await fetch(url, {
        headers: {
          accept: 'application/json',
          ...(TMDB_BEARER_TOKEN ? { authorization: `Bearer ${TMDB_BEARER_TOKEN}` } : {})
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
      throw new Error(`TMDB API ${pathname}: HTTP ${response.status} ${await response.text()}`);
    }

    return response.json();
  })();

  requestCache.set(cacheKey, promise);
  return promise;
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
      select: 'id,title,original_title,year,release_year,imdb_url,letterboxd_url',
      order: 'release_year.desc'
    })
  ]);

  return {
    people,
    moviePeople,
    movies
  };
}

function isTargetPerson(person) {
  return (
    isBlank(person.tmdb_url)
    || isBlank(person.name)
    || !person.birth_date
    || (!person.death_date && false)
    || isBlank(person.birth_place)
  );
}

async function getTmdbMovieByImdb(movie, report) {
  const imdbId = extractImdbTitleId(movie.imdb_url);

  if (!imdbId) {
    report.moviesWithoutImdb.push({
      id: movie.id,
      title: buildMovieLabel(movie)
    });
    return null;
  }

  try {
    const result = await tmdbFetch(`/find/${imdbId}`, {
      external_source: 'imdb_id',
      language: 'en-US'
    });
    const tmdbMovie = Array.isArray(result.movie_results) ? result.movie_results[0] : null;

    if (!tmdbMovie?.id) {
      report.moviesWithoutTmdb.push({
        id: movie.id,
        title: buildMovieLabel(movie),
        imdbId
      });
      return null;
    }

    return tmdbMovie;
  } catch (error) {
    report.movieFetchErrors.push({
      id: movie.id,
      title: buildMovieLabel(movie),
      imdbId,
      error: error.message
    });
    return null;
  }
}

async function getTmdbMovieDirectors(movie, report) {
  const tmdbMovie = await getTmdbMovieByImdb(movie, report);

  if (!tmdbMovie?.id) {
    return [];
  }

  try {
    const credits = await tmdbFetch(`/movie/${tmdbMovie.id}/credits`, {
      language: 'en-US'
    });
    const directorsById = new Map();

    (credits.crew || [])
      .filter(member => member?.job === 'Director' && member?.id)
      .forEach(member => {
        if (!directorsById.has(String(member.id))) {
          directorsById.set(String(member.id), {
            id: member.id,
            name: member.name || member.original_name || '',
            originalName: member.original_name || member.name || '',
            tmdbUrl: normalizeTmdbPersonUrl(member.id)
          });
        }
      });

    const directors = Array.from(directorsById.values());

    if (!directors.length) {
      report.moviesWithoutTmdbDirectors.push({
        id: movie.id,
        title: buildMovieLabel(movie),
        tmdbMovieId: tmdbMovie.id
      });
    }

    return directors;
  } catch (error) {
    report.movieCreditsErrors.push({
      id: movie.id,
      title: buildMovieLabel(movie),
      tmdbMovieId: tmdbMovie.id,
      error: error.message
    });
    return [];
  }
}

function matchLocalDirectorsToTmdb(localRows, tmdbDirectors, peopleById, movie) {
  if (!localRows.length || !tmdbDirectors.length) {
    return [];
  }

  if (localRows.length === 1 && tmdbDirectors.length === 1) {
    return [{
      personId: localRows[0].person_id,
      director: tmdbDirectors[0],
      score: 1,
      reason: 'single_director'
    }];
  }

  const candidates = [];

  localRows.forEach((row, localIndex) => {
    const person = peopleById.get(row.person_id);

    tmdbDirectors.forEach((director, tmdbIndex) => {
      const score = person ? getNameMatchScore(person, director.name) : 0;
      const sameIndexBonus = localRows.length === tmdbDirectors.length && localIndex === tmdbIndex ? 0.04 : 0;

      candidates.push({
        personId: row.person_id,
        director,
        score: Math.min(1, score + sameIndexBonus),
        rawScore: score,
        localIndex,
        tmdbIndex,
        reason: 'name_match'
      });
    });
  });

  candidates.sort((left, right) => right.score - left.score);

  const usedPeople = new Set();
  const usedDirectors = new Set();
  const matches = [];

  for (const candidate of candidates) {
    if (usedPeople.has(candidate.personId) || usedDirectors.has(String(candidate.director.id))) {
      continue;
    }

    const threshold = localRows.length === tmdbDirectors.length ? 0.6 : 0.68;

    if (candidate.score < threshold) {
      continue;
    }

    usedPeople.add(candidate.personId);
    usedDirectors.add(String(candidate.director.id));
    matches.push(candidate);
  }

  return matches.map(match => ({
    ...match,
    score: Number(match.score.toFixed(3)),
    movie: buildMovieLabel(movie)
  }));
}

async function fetchTmdbPersonData(personId, report) {
  try {
    const data = await tmdbFetch(`/person/${personId}`, {
      language: 'en-US'
    });
    const country = extractCountryFromPlace(data.place_of_birth || '');

    if (data.place_of_birth && !country.known) {
      report.unknownCountries.push({
        tmdbPersonId: personId,
        name: data.name || '',
        rawBirthPlace: data.place_of_birth
      });
    }

    return {
      tmdbUrl: normalizeTmdbPersonUrl(personId),
      name: data.name || '',
      birthDate: data.birthday || '',
      deathDate: data.deathday || '',
      birthPlaceCountry: country.known ? country.value : ''
    };
  } catch (error) {
    report.personFetchErrors.push({
      tmdbPersonId: personId,
      error: error.message
    });
    return null;
  }
}

async function main() {
  if (!TMDB_BEARER_TOKEN && !TMDB_API_KEY) {
    throw new Error('Set TMDB_BEARER_TOKEN or TMDB_API_KEY in the environment.');
  }

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

  const targetPeople = people.filter(isTargetPerson);
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
    moviesWithoutImdb: [],
    moviesWithoutTmdb: [],
    moviesWithoutTmdbDirectors: [],
    movieFetchErrors: [],
    movieCreditsErrors: [],
    personFetchErrors: [],
    unknownCountries: [],
    lowConfidencePeople: [],
    updates: []
  };

  console.log(`People to inspect: ${targetPeople.length}; linked movies: ${targetMovies.length}`);

  const tmdbDirectorsByMovieId = new Map();
  await mapLimit(targetMovies, FETCH_CONCURRENCY, async (movie, index) => {
    if ((index + 1) % 25 === 0 || index === targetMovies.length - 1) {
      console.log(`Movies inspected: ${index + 1}/${targetMovies.length}`);
    }

    tmdbDirectorsByMovieId.set(movie.id, await getTmdbMovieDirectors(movie, report));
  });

  const evidenceByPersonId = new Map();

  for (const [movieId, localRows] of localDirectorsByMovieId.entries()) {
    if (!targetMovieIds.has(movieId)) {
      continue;
    }

    const movie = moviesById.get(movieId);
    const matches = matchLocalDirectorsToTmdb(
      localRows.filter(row => targetPersonIds.has(row.person_id)),
      tmdbDirectorsByMovieId.get(movieId) || [],
      peopleById,
      movie
    );

    matches.forEach(match => {
      const personEvidence = evidenceByPersonId.get(match.personId) || [];
      personEvidence.push(match);
      evidenceByPersonId.set(match.personId, personEvidence);
    });
  }

  const acceptedPeople = [];

  for (const person of targetPeople) {
    const evidence = evidenceByPersonId.get(person.id) || [];
    const existingTmdbMatch = String(person.tmdb_url || '').match(/\/person\/(\d+)/);

    if (existingTmdbMatch) {
      acceptedPeople.push({
        person,
        tmdbPersonId: existingTmdbMatch[1],
        evidence: [{
          reason: 'existing_tmdb_url',
          score: 1,
          movie: null
        }]
      });
      continue;
    }

    const uniqueIds = Array.from(new Set(evidence.map(item => String(item.director.id))));

    if (uniqueIds.length !== 1) {
      report.lowConfidencePeople.push({
        id: person.id,
        nameRu: person.name_ru,
        reason: uniqueIds.length > 1 ? 'multiple_tmdb_candidates' : 'no_confident_candidate',
        evidence: evidence.map(item => ({
          tmdbPersonId: item.director.id,
          tmdbName: item.director.name,
          score: item.score,
          rawScore: item.rawScore,
          movie: item.movie,
          reason: item.reason
        }))
      });
      continue;
    }

    acceptedPeople.push({
      person,
      tmdbPersonId: uniqueIds[0],
      evidence
    });
  }

  const personDetailsById = new Map();
  await mapLimit(acceptedPeople, FETCH_CONCURRENCY, async (item, index) => {
    if ((index + 1) % 25 === 0 || index === acceptedPeople.length - 1) {
      console.log(`People inspected: ${index + 1}/${acceptedPeople.length}`);
    }

    if (!personDetailsById.has(item.tmdbPersonId)) {
      personDetailsById.set(item.tmdbPersonId, await fetchTmdbPersonData(item.tmdbPersonId, report));
    }
  });

  for (const item of acceptedPeople) {
    const { person, tmdbPersonId, evidence } = item;
    const data = personDetailsById.get(tmdbPersonId);

    if (!data) {
      continue;
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

    if (!Object.keys(values).length) {
      continue;
    }

    report.updates.push({
      person,
      values,
      source: data,
      evidence: evidence.map(item => ({
        tmdbPersonId: item.director?.id || tmdbPersonId,
        tmdbName: item.director?.name || data.name,
        score: item.score,
        rawScore: item.rawScore,
        movie: item.movie,
        reason: item.reason
      }))
    });
  }

  report.totals.acceptedUpdates = report.updates.length;
  report.totals.skippedPeople = targetPeople.length - report.updates.length;
  report.finishedAt = new Date().toISOString();

  const sql = buildUpdateSql(report.updates);

  await mkdir(OUTPUT_DIR, {
    recursive: true
  });

  const stamp = report.finishedAt.replace(/[:.]/g, '-');
  const reportPath = path.join(OUTPUT_DIR, `people-tmdb-api-backfill-${stamp}.json`);
  const sqlPath = path.join(OUTPUT_DIR, `people-tmdb-api-backfill-${stamp}.sql`);

  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(sqlPath, sql, 'utf8');

  if (APPLY_SQL_PATH) {
    await writeFile(APPLY_SQL_PATH, sql, 'utf8');
  }

  console.log(JSON.stringify({
    reportPath,
    sqlPath,
    people: report.totals.people,
    targetPeople: report.totals.targetPeople,
    targetMovies: report.totals.targetMovies,
    acceptedUpdates: report.totals.acceptedUpdates,
    skippedPeople: report.totals.skippedPeople,
    moviesWithoutImdb: report.moviesWithoutImdb.length,
    moviesWithoutTmdb: report.moviesWithoutTmdb.length,
    moviesWithoutTmdbDirectors: report.moviesWithoutTmdbDirectors.length,
    movieFetchErrors: report.movieFetchErrors.length,
    movieCreditsErrors: report.movieCreditsErrors.length,
    personFetchErrors: report.personFetchErrors.length,
    unknownCountries: report.unknownCountries.length,
    lowConfidencePeople: report.lowConfidencePeople.length
  }, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
