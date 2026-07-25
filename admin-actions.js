function getDateStamp() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}

function downloadJsonFile(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}

function appendAuditSection(lines, title, items, formatItem) {
  lines.push('', title);

  if (!items.length) {
    lines.push('  Нет.');
    return;
  }

  items.forEach((item, index) => {
    lines.push(`  ${index + 1}. ${formatItem(item)}`);
  });
}

function getManualSimilarAuditDirectedKey(movieId, similarMovieId) {
  return `${movieId}->${similarMovieId}`;
}

function getManualSimilarAuditCountLabel(count) {
  if (count === 0) {
    return '0 похожих';
  }

  if (count === 1) {
    return '1 похожий';
  }

  return `${count} похожих`;
}

function isNotificationTestFunctionMissingError(error) {
  const code = String(error?.code || '').trim();
  const message = String(error?.message || error?.details || error?.hint || '').toLowerCase();

  return (
    code === '42883' ||
    code === 'PGRST202' ||
    message.includes('create_notification_test_suite') ||
    message.includes('could not find the function') ||
    message.includes('schema cache')
  );
}

export function createAdminActionTools(context = {}) {
  const compareMovies = context.compareManualSimilarAuditMovies;
  const groupRowsByMovieId = context.groupRowsByMovieId;
  const isEmptyTextArrayLikeField = context.isEmptyTextArrayLikeField;
  const getUniqueMoviePosterUrlCount = context.getUniqueMoviePosterUrlCount;
  const normalizeTextArrayField = context.normalizeTextArrayField;
  const parseLineOrCommaSeparatedValues = context.parseLineOrCommaSeparatedValues;
  const normalizeSearchText = context.normalizeSearchText;
  const normalizeDirectorRow = context.normalizeDirectorRow;
  const getManualSimilarMovieLabel = context.getManualSimilarMovieLabel;
  const buildMovieCanonicalPath = context.buildMovieCanonicalPath;
  const getManualSimilarMovieIds = context.getManualSimilarMovieIds;
  const getAllMovies = context.getAllMovies || (() => []);
  const getManualSimilarRows = context.getManualSimilarRows || (() => []);

  function getManualSimilarAuditMovieLabel(movie) {
    const title = getManualSimilarMovieLabel(movie);
    const path = movie?.id ? ` — ${buildMovieCanonicalPath(movie)}` : '';

    return `${title}${path}`;
  }

  function getMovieCompletenessAuditLabel(movie) {
    const title = String(movie?.title || 'Без названия').trim();
    const year = movie?.year ? ` (${movie.year})` : '';
    const slug = String(movie?.slug || '').trim();
    const path = slug
      ? `/movie/${slug}`
      : `/movie.html?id=${movie?.id || ''}`;

    return `${title}${year} — ${path}`;
  }

  function buildCompletenessAuditReport(movies, posterRows) {
    const sortedMovies = [...movies].sort(compareMovies);
    const posterRowsByMovieId = groupRowsByMovieId(posterRows);
    const emptyProductionMovies = [];
    const emptyDistributionMovies = [];
    const emptyRussianDistributionMovies = [];
    const primaryPosterOnlyMovies = [];
    const emptyKinopoiskMovies = [];
    const emptyTrailerMovies = [];

    sortedMovies.forEach(movie => {
      const movieId = String(movie?.id || '');
      const moviePosterRows = posterRowsByMovieId.get(movieId) || [];

      if (isEmptyTextArrayLikeField(movie?.production)) {
        emptyProductionMovies.push(movie);
      }

      if (isEmptyTextArrayLikeField(movie?.distribution)) {
        emptyDistributionMovies.push(movie);
      }

      if (isEmptyTextArrayLikeField(movie?.russian_distribution)) {
        emptyRussianDistributionMovies.push(movie);
      }

      if (String(movie?.poster_url || '').trim() && getUniqueMoviePosterUrlCount(movie, moviePosterRows) === 1) {
        primaryPosterOnlyMovies.push(movie);
      }

      if (!String(movie?.kinopoisk_url || '').trim()) {
        emptyKinopoiskMovies.push(movie);
      }

      if (!String(movie?.trailer_url || '').trim()) {
        emptyTrailerMovies.push(movie);
      }
    });

    const lines = [
      'Аудит заполненности карточек Хоррорейро',
      `Дата: ${getDateStamp()}`,
      '',
      'Сводка:',
      `  Фильмов в каталоге: ${movies.length}`,
      `  Пустое поле "Производство": ${emptyProductionMovies.length}`,
      `  Пустое поле "Дистрибуция": ${emptyDistributionMovies.length}`,
      `  Пустое поле "Дистрибуция в РФ": ${emptyRussianDistributionMovies.length}`,
      `  Только основной poster_url: ${primaryPosterOnlyMovies.length}`,
      `  Пустое поле "Кинопоиск": ${emptyKinopoiskMovies.length}`,
      `  Пустое поле "Трейлер": ${emptyTrailerMovies.length}`
    ];

    appendAuditSection(lines, '1. Пустое поле "Производство":', emptyProductionMovies, getMovieCompletenessAuditLabel);
    appendAuditSection(lines, '2. Пустое поле "Дистрибуция":', emptyDistributionMovies, getMovieCompletenessAuditLabel);
    appendAuditSection(lines, '3. Пустое поле "Дистрибуция в РФ":', emptyRussianDistributionMovies, getMovieCompletenessAuditLabel);
    appendAuditSection(lines, '4. Только основной poster_url:', primaryPosterOnlyMovies, getMovieCompletenessAuditLabel);
    appendAuditSection(lines, '5. Пустое поле "Кинопоиск":', emptyKinopoiskMovies, getMovieCompletenessAuditLabel);
    appendAuditSection(lines, '6. Пустое поле "Трейлер":', emptyTrailerMovies, getMovieCompletenessAuditLabel);

    return {
      text: `${lines.join('\n')}\n`,
      summary: {
        emptyProduction: emptyProductionMovies.length,
        emptyDistribution: emptyDistributionMovies.length,
        emptyRussianDistribution: emptyRussianDistributionMovies.length,
        primaryPosterOnly: primaryPosterOnlyMovies.length,
        emptyKinopoisk: emptyKinopoiskMovies.length,
        emptyTrailer: emptyTrailerMovies.length
      }
    };
  }

  function getCompletenessAuditSummaryMessage(summary) {
    const totalProblems = (
      summary.emptyProduction +
      summary.emptyDistribution +
      summary.emptyRussianDistribution +
      summary.primaryPosterOnly +
      summary.emptyKinopoisk +
      summary.emptyTrailer
    );

    if (totalProblems === 0) {
      return 'Аудит заполненности готов: недозаполненных контуров нет.';
    }

    return [
      'Аудит заполненности готов:',
      `производство ${summary.emptyProduction}`,
      `дистрибуция ${summary.emptyDistribution}`,
      `дистрибуция РФ ${summary.emptyRussianDistribution}`,
      `один постер ${summary.primaryPosterOnly}`,
      `Кинопоиск ${summary.emptyKinopoisk}`,
      `трейлер ${summary.emptyTrailer}`
    ].join(' ');
  }

  function getRowsForExportGroup(groupedRows, movieId) {
    return groupedRows.get(String(movieId || '')) || [];
  }

  function getExportRowPosition(row, fallbackIndex) {
    const position = Number(row?.position);

    return Number.isFinite(position) ? position : fallbackIndex;
  }

  function sortExportRowsByPosition(rows = []) {
    return [...rows].sort((firstRow, secondRow) => (
      getExportRowPosition(firstRow, 0) - getExportRowPosition(secondRow, 0)
    ));
  }

  function getExportGenreNames(rows = [], { includeBaseHorror = true } = {}) {
    return sortExportRowsByPosition(rows)
      .map(row => String(row?.genres?.name || row?.genre_name || row?.name || '').trim())
      .filter(name => includeBaseHorror || normalizeSearchText(name) !== context.BASE_HORROR_GENRE_NORMALIZED)
      .filter(Boolean);
  }

  function getExportCountryNames(rows = []) {
    return rows
      .map(row => String(row?.countries?.name || row?.country_name || row?.name || '').trim())
      .filter(Boolean)
      .sort((firstName, secondName) => firstName.localeCompare(secondName, 'ru'));
  }

  function getExportPosterImages(movie, rows = []) {
    const usedUrls = new Set();
    const images = [];
    const primaryPosterUrl = String(movie?.poster_url || '').trim();

    if (primaryPosterUrl) {
      usedUrls.add(primaryPosterUrl);
      images.push({
        role: 'primary',
        image_url: primaryPosterUrl,
        position: 0
      });
    }

    sortExportRowsByPosition(rows).forEach((row, index) => {
      const imageUrl = String(row?.image_url || '').trim();

      if (!imageUrl || usedUrls.has(imageUrl)) {
        return;
      }

      usedUrls.add(imageUrl);
      images.push({
        ...row,
        role: 'additional',
        position: getExportRowPosition(row, index + 1)
      });
    });

    return images;
  }

  function getExportManualSimilarItems(rows = []) {
    return sortExportRowsByPosition(rows).map((row, index) => ({
      ...row,
      position: getExportRowPosition(row, index),
      similar_movie_id: row?.similar_movie_id || null
    }));
  }

  function buildEditableMovieExport(movie, {
    movieGenres = [],
    movieCountries = [],
    posterImages = [],
    manualSimilarRows = [],
    moviePeople = []
  } = {}) {
    return {
      id: movie?.id || null,
      slug: movie?.slug || '',
      title: movie?.title || '',
      original_title: movie?.original_title || '',
      year: movie?.year ?? null,
      runtime_minutes: movie?.runtime_minutes ?? null,
      release_year: movie?.release_year ?? null,
      release_month: movie?.release_month ?? null,
      sort_order: movie?.sort_order ?? null,
      director: parseLineOrCommaSeparatedValues(movie?.director || ''),
      genres: getExportGenreNames(movieGenres, { includeBaseHorror: false }),
      countries: getExportCountryNames(movieCountries),
      production: normalizeTextArrayField(movie?.production),
      distribution: normalizeTextArrayField(movie?.distribution),
      russian_distribution: normalizeTextArrayField(movie?.russian_distribution),
      synopsis: movie?.synopsis || '',
      formats: normalizeTextArrayField(movie?.formats),
      tags_perceived: normalizeTextArrayField(movie?.tags_perceived),
      search_aliases: normalizeTextArrayField(movie?.search_aliases),
      kinopoisk_url: movie?.kinopoisk_url || '',
      imdb_url: movie?.imdb_url || '',
      letterboxd_url: movie?.letterboxd_url || '',
      letterboxd_short_url: movie?.letterboxd_short_url || '',
      rottentomatoes_url: movie?.rottentomatoes_url || '',
      tmdb_url: movie?.tmdb_url || '',
      trailer_url: movie?.trailer_url || '',
      poster_url: movie?.poster_url || '',
      poster_images: getExportPosterImages(movie, posterImages),
      manual_similar: getExportManualSimilarItems(manualSimilarRows),
      linked_people: moviePeople
        .slice()
        .sort((firstRow, secondRow) => Number(firstRow?.position ?? 0) - Number(secondRow?.position ?? 0))
        .map(row => ({
          person_id: row?.person_id || null,
          role: row?.role || '',
          position: Number(row?.position ?? 0)
        }))
    };
  }

  function buildDatabaseExportPayload({
    movies,
    movieGenres,
    movieCountries,
    posterImages,
    manualSimilarRows,
    people = [],
    moviePeople = []
  }) {
    const movieGenresByMovieId = groupRowsByMovieId(movieGenres);
    const movieCountriesByMovieId = groupRowsByMovieId(movieCountries);
    const posterImagesByMovieId = groupRowsByMovieId(posterImages);
    const manualSimilarRowsByMovieId = groupRowsByMovieId(manualSimilarRows);
    const moviePeopleByMovieId = groupRowsByMovieId(moviePeople);

    return {
      exported_at: new Date().toISOString(),
      app_build_version: context.APP_BUILD_VERSION,
      source_origin: window.location.origin,
      format: 'horroreiro-database-export-v1',
      counts: {
        movies: movies.length,
        movie_genres: movieGenres.length,
        movie_countries: movieCountries.length,
        movie_poster_images: posterImages.length,
        movie_manual_similar: manualSimilarRows.length,
        people: people.length,
        movie_people: moviePeople.length
      },
      people: people.map(normalizeDirectorRow).filter(Boolean),
      movies: movies.map(movie => {
        const movieId = String(movie?.id || '');
        const relatedMovieGenres = getRowsForExportGroup(movieGenresByMovieId, movieId);
        const relatedMovieCountries = getRowsForExportGroup(movieCountriesByMovieId, movieId);
        const relatedPosterImages = getRowsForExportGroup(posterImagesByMovieId, movieId);
        const relatedManualSimilarRows = getRowsForExportGroup(manualSimilarRowsByMovieId, movieId);
        const relatedMoviePeople = getRowsForExportGroup(moviePeopleByMovieId, movieId);

        return {
          editable_fields: buildEditableMovieExport(movie, {
            movieGenres: relatedMovieGenres,
            movieCountries: relatedMovieCountries,
            posterImages: relatedPosterImages,
            manualSimilarRows: relatedManualSimilarRows,
            moviePeople: relatedMoviePeople
          }),
          raw: {
            movies: movie,
            movie_genres: relatedMovieGenres,
            movie_countries: relatedMovieCountries,
            movie_poster_images: relatedPosterImages,
            movie_manual_similar: relatedManualSimilarRows,
            movie_people: relatedMoviePeople
          }
        };
      })
    };
  }

  function buildManualSimilarAuditReport() {
    const movies = Array.isArray(getAllMovies()) ? getAllMovies() : [];
    const rows = Array.isArray(getManualSimilarRows()) ? getManualSimilarRows() : [];
    const moviesById = new Map();
    const invalidRows = [];
    const selfLinks = [];
    const duplicateLinks = [];
    const directedRowsByKey = new Map();
    const validDirectedKeys = new Set();

    movies.forEach(movie => {
      if (movie?.id) {
        moviesById.set(String(movie.id), movie);
      }
    });

    rows.forEach((row, index) => {
      const rowNumber = index + 1;
      const movieId = String(row?.movie_id || '').trim();
      const similarMovieId = String(row?.similar_movie_id || '').trim();
      const hasMovie = moviesById.has(movieId);
      const hasSimilarMovie = moviesById.has(similarMovieId);

      if (!movieId || !similarMovieId || !hasMovie || !hasSimilarMovie) {
        invalidRows.push({
          rowNumber,
          movieId,
          similarMovieId,
          reason: !movieId || !similarMovieId
            ? 'пустой movie_id или similar_movie_id'
            : !hasMovie
              ? 'movie_id не найден в каталоге'
              : 'similar_movie_id не найден в каталоге'
        });
        return;
      }

      if (movieId === similarMovieId) {
        selfLinks.push({ rowNumber, movieId });
        return;
      }

      const key = getManualSimilarAuditDirectedKey(movieId, similarMovieId);

      if (!directedRowsByKey.has(key)) {
        directedRowsByKey.set(key, []);
      }

      directedRowsByKey.get(key).push({
        rowNumber,
        movieId,
        similarMovieId,
        position: Number(row?.position ?? 0)
      });
      validDirectedKeys.add(key);
    });

    directedRowsByKey.forEach((directedRows, key) => {
      if (directedRows.length > 1) {
        duplicateLinks.push({
          key,
          rows: directedRows
        });
      }
    });

    const oneWayLinks = [];

    directedRowsByKey.forEach((directedRows, key) => {
      const firstRow = directedRows[0];
      const reverseKey = getManualSimilarAuditDirectedKey(firstRow.similarMovieId, firstRow.movieId);

      if (!validDirectedKeys.has(reverseKey)) {
        oneWayLinks.push({
          key,
          row: firstRow
        });
      }
    });

    const similarCountByMovieId = new Map();

    movies.forEach(movie => {
      const movieId = String(movie.id);
      const validSimilarIds = getManualSimilarMovieIds(movieId)
        .filter(similarMovieId => moviesById.has(String(similarMovieId)));

      similarCountByMovieId.set(movieId, validSimilarIds.length);
    });

    const moviesWithoutSimilar = movies
      .filter(movie => (similarCountByMovieId.get(String(movie.id)) || 0) === 0)
      .slice()
      .sort(compareMovies);

    const similarCountDistribution = Array.from(similarCountByMovieId.values())
      .reduce((distribution, count) => {
        distribution.set(count, (distribution.get(count) || 0) + 1);
        return distribution;
      }, new Map());

    const sortedDistribution = Array.from(similarCountDistribution.entries())
      .sort((firstEntry, secondEntry) => firstEntry[0] - secondEntry[0]);

    const lines = [
      'Аудит ручных похожих фильмов Хоррорейро',
      `Дата: ${getDateStamp()}`,
      '',
      'Сводка:',
      `  Фильмов в каталоге: ${movies.length}`,
      `  Строк в movie_manual_similar: ${rows.length}`,
      `  Фильмов без валидных похожих: ${moviesWithoutSimilar.length}`,
      `  Битых строк: ${invalidRows.length}`,
      `  Самоссылок: ${selfLinks.length}`,
      `  Дублей направленных связей: ${duplicateLinks.length}`,
      `  Односторонних связей: ${oneWayLinks.length}`,
      '',
      'Распределение по количеству похожих:',
      ...sortedDistribution.map(([count, moviesCount]) => (
        `  ${getManualSimilarAuditCountLabel(count)}: ${moviesCount}`
      ))
    ];

    appendAuditSection(lines, 'Фильмы без валидных похожих:', moviesWithoutSimilar, movie => getManualSimilarAuditMovieLabel(movie));
    appendAuditSection(lines, 'Битые строки:', invalidRows, item => `строка ${item.rowNumber}: ${item.movieId || '—'} -> ${item.similarMovieId || '—'} (${item.reason})`);
    appendAuditSection(lines, 'Самоссылки:', selfLinks, item => {
      const movie = moviesById.get(item.movieId);
      return `строка ${item.rowNumber}: ${getManualSimilarAuditMovieLabel(movie)}`;
    });
    appendAuditSection(lines, 'Дубли направленных связей:', duplicateLinks, item => {
      const firstRow = item.rows[0];
      const movie = moviesById.get(firstRow.movieId);
      const similarMovie = moviesById.get(firstRow.similarMovieId);
      const rowNumbers = item.rows.map(row => row.rowNumber).join(', ');

      return `${getManualSimilarAuditMovieLabel(movie)} -> ${getManualSimilarAuditMovieLabel(similarMovie)} (строки: ${rowNumbers})`;
    });
    appendAuditSection(lines, 'Односторонние связи:', oneWayLinks, item => {
      const movie = moviesById.get(item.row.movieId);
      const similarMovie = moviesById.get(item.row.similarMovieId);

      return `${getManualSimilarAuditMovieLabel(movie)} -> ${getManualSimilarAuditMovieLabel(similarMovie)} (нет обратной связи)`;
    });

    return {
      text: `${lines.join('\n')}\n`,
      summary: {
        moviesWithoutSimilar: moviesWithoutSimilar.length,
        invalidRows: invalidRows.length,
        selfLinks: selfLinks.length,
        duplicateLinks: duplicateLinks.length,
        oneWayLinks: oneWayLinks.length
      }
    };
  }

  function getManualSimilarAuditSummaryMessage(summary) {
    const problemCount = (
      summary.moviesWithoutSimilar +
      summary.invalidRows +
      summary.selfLinks +
      summary.duplicateLinks +
      summary.oneWayLinks
    );

    if (problemCount === 0) {
      return 'Аудит похожих готов: проблем не найдено.';
    }

    return [
      'Аудит похожих готов:',
      `без похожих ${summary.moviesWithoutSimilar}`,
      `битых строк ${summary.invalidRows}`,
      `самоссылок ${summary.selfLinks}`,
      `дублей ${summary.duplicateLinks}`,
      `односторонних ${summary.oneWayLinks}`
    ].join(' ');
  }

  return {
    buildCompletenessAuditReport,
    buildDatabaseExportPayload,
    buildManualSimilarAuditReport,
    downloadJsonFile,
    downloadTextFile,
    getCompletenessAuditSummaryMessage,
    getDateStamp,
    getManualSimilarAuditSummaryMessage,
    isNotificationTestFunctionMissingError
  };
}
