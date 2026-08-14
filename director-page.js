export function createDirectorPageController(context = {}) {
  const {
    directorPage = null,
    supabaseClient = null,
    directorStorageRenderPath = '/storage/v1/render/image/public/people/',
    directorImagePreset = {
      widths: [320, 480, 640],
      quality: 90,
      heightRatio: 1.5,
      sizes: '(max-width: 480px) calc(100vw - 48px), (max-width: 900px) 320px, 320px'
    },
    posterImageMinQuality = 90,
    movieCatalogSelect = '',
    catalogPriorityPosterCount = 8,
    getAreDirectorsAvailable = () => true,
    setAreDirectorsAvailable = () => {},
    getCurrentDirectorPageData = () => null,
    setCurrentDirectorPageData = () => {},
    getIsAdmin = () => false,
    shouldUseAuthenticatedUi = () => false,
    restoreSession = async () => null,
    trackEmailConfirmedLoginIfNeeded = () => {},
    bindSharedAuthStateListener = () => {},
    escapeHtml = value => String(value ?? ''),
    isDirectorsUnavailableError = () => false,
    normalizeDirectorRow = row => row || null,
    normalizeDirectorAliasValues = value => (Array.isArray(value) ? value : []),
    normalizeDirectorGender = value => String(value || '').trim() === 'Ж' ? 'Ж' : 'М',
    getDirectorDisplayName = director => String(director?.name_ru || director?.name || '').trim() || 'Без имени',
    getDirectorSecondaryName = director => String(director?.name || '').trim(),
    getDirectorLifeLabel = () => '',
    isDirectorDeceased = director => Boolean(director?.death_date),
    getDirectorPlaceholderSvgHtml = () => '',
    extractDirectorStoragePath = () => '',
    fetchMoviesByIdsWithSelect = async () => [],
    ensurePreferredPosterImagesForMovies = async () => {},
    getSortedMoviesCopy = movies => [...(Array.isArray(movies) ? movies : [])],
    cacheCatalogMovies = () => {},
    runMovieSelectWithOptionalColumns = async createQuery => {
      if (typeof createQuery !== 'function') {
        return { data: [], error: null };
      }

      return createQuery(movieCatalogSelect);
    },
    throwIfSupabaseError = error => {
      if (error) {
        throw error;
      }
    },
    parseLineOrCommaSeparatedValues = value => String(value || '').split(/\n|,/).map(item => item.trim()).filter(Boolean),
    slugifyMovieValue = value => String(value || '').trim(),
    normalizeSearchText = value => String(value || '').trim().toLowerCase(),
    buildCatalogPageUrl = () => '/',
    createMovieCardRenderContext = () => ({ searchQuery: '', queryWords: [], highlightText: value => value }),
    getMoviePreferredPosterUrl = movie => String(movie?.preferred_poster_url || movie?.poster_url || '').trim(),
    createMovieCard = movie => {
      const card = document.createElement('article');
      card.textContent = getDirectorDisplayName(movie);
      return card;
    },
    bindMoviePosterLoadStates = () => {},
    bindPosterFallbackImages = () => {},
    handleCatalogCardClick = () => {},
    handleCatalogCardAuxClick = () => {},
    handleCatalogRatingStarMouseOver = () => {},
    handleCatalogRatingStarMouseOut = () => {},
    openDirectorModalById = async () => {},
    fetchMovieRatings = async () => {},
    fetchCurrentUserRatings = async () => {},
    fetchMovieWatchlist = async () => {},
    loadPersonPlaceholderTools = async () => {}
  } = context;

  function setCurrentPageData(data) {
    setCurrentDirectorPageData(data || null);
  }

  function areDirectorsAvailable() {
    return getAreDirectorsAvailable() !== false;
  }

  function markDirectorsUnavailable() {
    setAreDirectorsAvailable(false);
  }

  function isDirectorPagePayloadRpcUnavailableError(error) {
    const code = String(error?.code || '').trim();
    const message = String(error?.message || error?.details || error?.hint || '').toLowerCase();

    return (
      ['42883', 'PGRST202', 'PGRST204'].includes(code) &&
      message.includes('get_person_page_payload')
    ) || (
      message.includes('get_person_page_payload') &&
      (
        message.includes('could not find') ||
        message.includes('schema cache') ||
        message.includes('does not exist')
      )
    );
  }

  function getDirectorPageRouteSlug() {
    const searchParams = new URLSearchParams(window.location.search);
    const pathSlugMatch = window.location.pathname.match(/\/name\/([^/]+)\/?$/);
    const pathSlug = pathSlugMatch ? decodeURIComponent(pathSlugMatch[1] || '').trim() : '';
    const querySlug = String(searchParams.get('slug') || '').trim();

    return pathSlug || querySlug;
  }

  async function fetchDirectorBySlug(slug) {
    const normalizedSlug = String(slug || '').trim();

    if (!normalizedSlug || !areDirectorsAvailable() || !supabaseClient) {
      return null;
    }

    const { data, error } = await supabaseClient
      .from('people')
      .select('*')
      .eq('slug', normalizedSlug)
      .maybeSingle();

    if (error) {
      if (isDirectorsUnavailableError(error)) {
        markDirectorsUnavailable();
        return null;
      }

      throw error;
    }

    if (data) {
      return normalizeDirectorRow(data);
    }

    const { data: fallbackData, error: fallbackError } = await supabaseClient
      .from('people')
      .select('*')
      .order('name_ru', { ascending: true });

    if (fallbackError) {
      if (isDirectorsUnavailableError(fallbackError)) {
        markDirectorsUnavailable();
        return null;
      }

      throw fallbackError;
    }

    return (fallbackData || [])
      .map(normalizeDirectorRow)
      .find(director => slugifyMovieValue(director?.name_ru || director?.name || '') === normalizedSlug) || null;
  }

  async function fetchDirectorMovieRelationRows(directorId) {
    const normalizedDirectorId = String(directorId || '').trim();

    if (!normalizedDirectorId || !areDirectorsAvailable() || !supabaseClient) {
      return [];
    }

    const { data, error } = await supabaseClient
      .from('movie_people')
      .select('movie_id, position')
      .eq('person_id', normalizedDirectorId)
      .eq('role', 'director')
      .order('position', { ascending: true });

    if (error) {
      if (isDirectorsUnavailableError(error)) {
        markDirectorsUnavailable();
        return [];
      }

      throw error;
    }

    return data || [];
  }

  async function fetchDirectorMovies(directorId) {
    const relationRows = await fetchDirectorMovieRelationRows(directorId);
    const movieIds = relationRows
      .map(row => String(row.movie_id || '').trim())
      .filter(Boolean);

    if (movieIds.length === 0) {
      return [];
    }

    const movies = await fetchMoviesByIdsWithSelect(movieIds, movieCatalogSelect);
    const moviesById = new Map(movies.map(movie => [String(movie.id), movie]));
    const orderedMovies = relationRows
      .map(row => moviesById.get(String(row.movie_id || '')))
      .filter(Boolean);

    await ensurePreferredPosterImagesForMovies(orderedMovies);
    return getSortedMoviesCopy(orderedMovies, 'default');
  }

  function getLegacyDirectorNamesForMovie(movie) {
    return parseLineOrCommaSeparatedValues(movie?.director || '');
  }

  function findLegacyDirectorNameMatch(movie, { slug = '', nameRu = '' } = {}) {
    const normalizedSlug = String(slug || '').trim();
    const normalizedNameKey = normalizeSearchText(nameRu);

    if (!normalizedSlug && !normalizedNameKey) {
      return '';
    }

    return getLegacyDirectorNamesForMovie(movie).find(directorName => {
      if (normalizedSlug && slugifyMovieValue(directorName) === normalizedSlug) {
        return true;
      }

      return normalizedNameKey && normalizeSearchText(directorName) === normalizedNameKey;
    }) || '';
  }

  function mergeDirectorMovieLists(primaryMovies = [], fallbackMovies = []) {
    const moviesById = new Map();

    [...primaryMovies, ...fallbackMovies].forEach(movie => {
      if (movie?.id && !moviesById.has(String(movie.id))) {
        moviesById.set(String(movie.id), movie);
      }
    });

    return getSortedMoviesCopy([...moviesById.values()], 'default');
  }

  async function fetchLegacyDirectorMovieMatches({ slug = '', nameRu = '' } = {}) {
    const normalizedSlug = String(slug || '').trim();
    const normalizedNameRu = String(nameRu || '').trim();

    if (!normalizedSlug && !normalizedNameRu) {
      return {
        nameRu: '',
        movies: []
      };
    }

    const { data, error } = await runMovieSelectWithOptionalColumns(
      selectQuery => {
        let query = supabaseClient
          .from('movies')
          .select(selectQuery)
          .not('director', 'is', null);

        if (String(selectQuery || '').includes('movie_genres')) {
          query = query.order('position', { foreignTable: 'movie_genres', ascending: true });
        }

        return query;
      },
      movieCatalogSelect
    );

    throwIfSupabaseError(error);

    let matchedNameRu = '';
    const matchingMovies = (data || []).filter(movie => {
      const matchedName = findLegacyDirectorNameMatch(movie, {
        slug: normalizedSlug,
        nameRu: normalizedNameRu
      });

      if (matchedName && !matchedNameRu) {
        matchedNameRu = matchedName;
      }

      return Boolean(matchedName);
    });

    await ensurePreferredPosterImagesForMovies(matchingMovies);
    cacheCatalogMovies(matchingMovies);

    return {
      nameRu: matchedNameRu || normalizedNameRu,
      movies: getSortedMoviesCopy(matchingMovies, 'default')
    };
  }

  async function fetchLegacyDirectorPageData(slug) {
    const legacyMatches = await fetchLegacyDirectorMovieMatches({ slug });

    if (!legacyMatches.nameRu || legacyMatches.movies.length === 0) {
      return null;
    }

    return {
      director: normalizeDirectorRow({
        id: '',
        slug,
        name_ru: legacyMatches.nameRu,
        name: '',
        aliases: [],
        gender: 'М',
        birth_date: null,
        death_date: null,
        birth_place: '',
        photo_url: '',
        is_legacy_fallback: true
      }),
      movies: legacyMatches.movies
    };
  }

  async function fetchDirectorPagePayloadViaRpc(slug) {
    const normalizedSlug = String(slug || '').trim();

    if (!normalizedSlug || !areDirectorsAvailable() || !supabaseClient) {
      return null;
    }

    const { data, error } = await supabaseClient.rpc('get_person_page_payload', {
      page_slug: normalizedSlug
    });

    if (error) {
      throw error;
    }

    if (!data?.director) {
      return null;
    }

    const director = normalizeDirectorRow(data.director);
    const movies = getSortedMoviesCopy(Array.isArray(data.movies) ? data.movies : [], 'default');

    await ensurePreferredPosterImagesForMovies(movies);
    cacheCatalogMovies(movies);

    return {
      director,
      movies,
      moviesError: null
    };
  }

  async function fetchDirectorPageData(slug) {
    try {
      const payload = await fetchDirectorPagePayloadViaRpc(slug);

      if (payload) {
        return payload;
      }
    } catch (error) {
      if (isDirectorPagePayloadRpcUnavailableError(error)) {
        console.warn('Person page payload RPC is unavailable, falling back to client queries:', error);
      } else {
        throw error;
      }
    }

    const director = await fetchDirectorBySlug(slug);

    if (!director) {
      try {
        return await fetchLegacyDirectorPageData(slug);
      } catch (error) {
        console.error('Ошибка загрузки legacy-страницы режиссёра:', error);
        return null;
      }
    }

    let movies = [];
    let moviesError = null;

    try {
      movies = await fetchDirectorMovies(director.id);

      if (movies.length === 0) {
        const legacyMatches = await fetchLegacyDirectorMovieMatches({
          slug: director.slug,
          nameRu: director.name_ru
        });

        movies = mergeDirectorMovieLists(movies, legacyMatches.movies);
      }
    } catch (error) {
      moviesError = error;
      console.error('Ошибка загрузки фильмографии персоны:', error);
    }

    return {
      director,
      movies,
      moviesError
    };
  }

  function renderDirectorPageLoading() {
    if (!directorPage) {
      return;
    }

    setCurrentPageData(null);
    directorPage.innerHTML = '<div class="director-page-loading-state">Загрузка режиссёра...</div>';
  }

  function renderDirectorPageUnavailable() {
    if (!directorPage) {
      return;
    }

    setCurrentPageData(null);
    document.title = 'Режиссёр — Хоррорейро';
    directorPage.innerHTML = `
      <div class="director-page-empty-state director-page-empty-state-large">
        <p>Страницы режиссёров пока недоступны: серверный контур персон не подключён.</p>
      </div>
    `;
  }

  function renderDirectorPageError() {
    if (!directorPage) {
      return;
    }

    setCurrentPageData(null);
    document.title = 'Режиссёр — Хоррорейро';
    directorPage.innerHTML = `
      <div class="director-page-empty-state director-page-empty-state-large">
        <p>Не удалось загрузить страницу режиссёра. Попробуй обновить страницу.</p>
        <a href="${escapeHtml(buildCatalogPageUrl())}" class="secondary-button director-page-login-button">
          Назад в каталог
        </a>
      </div>
    `;
  }

  function renderDirectorPageNotFound() {
    if (!directorPage) {
      return;
    }

    setCurrentPageData(null);
    document.title = 'Режиссёр не найден — Хоррорейро';
    directorPage.innerHTML = `
      <div class="director-page-empty-state director-page-empty-state-large">
        <p>Режиссёр не найден.</p>
        <a href="${escapeHtml(buildCatalogPageUrl())}" class="secondary-button director-page-login-button">
          Назад в каталог
        </a>
      </div>
    `;
  }

  function getDirectorTransformUrl(publicUrl, { width, height, quality } = {}) {
    const storagePath = extractDirectorStoragePath(publicUrl);

    if (!storagePath || !width) {
      return null;
    }

    let parsedUrl = null;

    try {
      parsedUrl = new URL(publicUrl);
    } catch (error) {
      return null;
    }

    const transformedUrl = new URL(`${parsedUrl.origin}${directorStorageRenderPath}${storagePath}`);
    const normalizedWidth = Math.max(1, Math.min(1800, Number(width) || 0));
    const normalizedHeight = Math.max(
      1,
      Math.min(2700, Number(height) || Math.round(normalizedWidth * directorImagePreset.heightRatio))
    );
    const normalizedQuality = Math.round(
      Math.max(posterImageMinQuality, Math.min(100, Number(quality) || posterImageMinQuality))
    );

    transformedUrl.searchParams.set('width', String(normalizedWidth));
    transformedUrl.searchParams.set('height', String(normalizedHeight));
    transformedUrl.searchParams.set('resize', 'cover');
    transformedUrl.searchParams.set('quality', String(normalizedQuality));

    return transformedUrl.toString();
  }

  function getDirectorImageData(publicUrl) {
    const originalUrl = String(publicUrl || '').trim();

    if (!originalUrl) {
      return {
        src: '',
        srcset: '',
        sizes: '',
        fallbackSrc: ''
      };
    }

    const transformedUrls = directorImagePreset.widths
      .map(width => ({
        width,
        url: getDirectorTransformUrl(originalUrl, {
          width,
          height: Math.round(width * directorImagePreset.heightRatio),
          quality: directorImagePreset.quality
        })
      }))
      .filter(item => item.url);

    if (transformedUrls.length === 0) {
      return {
        src: originalUrl,
        srcset: '',
        sizes: '',
        fallbackSrc: originalUrl
      };
    }

    return {
      src: transformedUrls[0].url,
      srcset: transformedUrls.map(item => `${item.url} ${item.width}w`).join(', '),
      sizes: directorImagePreset.sizes,
      fallbackSrc: originalUrl
    };
  }

  function getDirectorPhotoHtml(director) {
    const photoUrl = String(director?.photo_url || '').trim();
    const displayName = getDirectorDisplayName(director);

    if (photoUrl) {
      const imageData = getDirectorImageData(photoUrl);

      return `
        <img
          class="director-page-photo"
          src="${escapeHtml(imageData.src || photoUrl)}"
          ${imageData.srcset ? `srcset="${escapeHtml(imageData.srcset)}"` : ''}
          ${imageData.sizes ? `sizes="${escapeHtml(imageData.sizes)}"` : ''}
          alt="Фото: ${escapeHtml(displayName)}"
          width="320"
          height="480"
          loading="eager"
          decoding="async"
          fetchpriority="high"
          ${imageData.fallbackSrc ? `data-poster-fallback-src="${escapeHtml(imageData.fallbackSrc)}"` : ''}
        >
      `;
    }

    return `
      <div class="director-page-photo-placeholder" aria-hidden="true">
        ${getDirectorPlaceholderSvgHtml(director)}
      </div>
    `;
  }

  function getDirectorMetaItemsHtml(director) {
    const lifeLabel = getDirectorLifeLabel(director);
    const birthPlace = String(director?.birth_place || '').trim();
    const aliases = normalizeDirectorAliasValues(director?.aliases || []).join(', ');

    return [
      lifeLabel ? `<div class="director-page-meta-item"><span>Дата рождения:</span> ${escapeHtml(lifeLabel)}</div>` : '',
      birthPlace ? `<div class="director-page-meta-item"><span>Место рождения:</span> ${escapeHtml(birthPlace)}</div>` : '',
      aliases ? `<div class="director-page-meta-item"><span>Другие имена:</span> ${escapeHtml(aliases)}</div>` : ''
    ].filter(Boolean).join('');
  }

  function renderDirectorMoviesGrid(movies) {
    try {
      const sourceMovies = Array.isArray(movies) ? movies : [];
      const renderContext = createMovieCardRenderContext('');
      let priorityPosterSlotsRemaining = catalogPriorityPosterCount;
      const getPriorityPosterOptions = movie => {
        const isPriorityPoster = priorityPosterSlotsRemaining > 0 && Boolean(getMoviePreferredPosterUrl(movie));

        if (isPriorityPoster) {
          priorityPosterSlotsRemaining = Math.max(0, priorityPosterSlotsRemaining - 1);
        }

        return { isPriorityPoster };
      };

      return `
        <div class="director-page-movies-grid" data-director-page-movies-grid="true">
          ${sourceMovies.map(movie => createMovieCard(movie, renderContext, getPriorityPosterOptions(movie)).outerHTML).join('')}
        </div>
      `;
    } catch (error) {
      console.error('Ошибка рендера фильмографии персоны:', error);

      return '<div class="director-page-empty-state">Не удалось отобразить фильмы. Попробуй обновить страницу.</div>';
    }
  }

  function bindDirectorMoviesGridEvents(grid) {
    if (!grid || grid.dataset.directorMovieGridBound === 'true') {
      return;
    }

    grid.dataset.directorMovieGridBound = 'true';
    bindMoviePosterLoadStates(grid);
    bindPosterFallbackImages(grid);
    grid.addEventListener('click', handleCatalogCardClick);
    grid.addEventListener('auxclick', handleCatalogCardAuxClick);
    grid.addEventListener('mouseover', handleCatalogRatingStarMouseOver);
    grid.addEventListener('mouseout', handleCatalogRatingStarMouseOut);
  }

  function bindDirectorPageEvents() {
    if (!directorPage) {
      return;
    }

    bindPosterFallbackImages(directorPage);
    bindDirectorMoviesGridEvents(directorPage.querySelector('[data-director-page-movies-grid="true"]'));

    directorPage.querySelectorAll('[data-director-edit]').forEach(button => {
      if (button.dataset.directorEditBound === 'true') {
        return;
      }

      button.dataset.directorEditBound = 'true';
      button.addEventListener('click', () => {
        const currentData = getCurrentDirectorPageData();

        if (getIsAdmin() && currentData?.director?.id) {
          void openDirectorModalById(currentData.director.id);
        }
      });
    });
  }

  function renderDirectorPage(data) {
    if (!directorPage || !data?.director) {
      return;
    }

    const { director, movies = [], moviesError } = data;
    const displayName = getDirectorDisplayName(director);
    const secondaryName = getDirectorSecondaryName(director);
    const metaHtml = getDirectorMetaItemsHtml(director);

    setCurrentPageData(data);
    document.title = `${displayName} — Хоррорейро`;

    directorPage.innerHTML = `
      <div class="director-page-layout">
        <div class="director-page-photo-column">
          <div class="director-page-photo-wrapper${isDirectorDeceased(director) ? ' is-deceased' : ''}">
            ${getDirectorPhotoHtml(director)}
          </div>
        </div>
        <div class="director-page-main-column">
          <div class="director-page-title-block">
            <h1 class="director-page-title">${escapeHtml(displayName)}</h1>
            ${secondaryName ? `<div class="director-page-original-name">${escapeHtml(secondaryName)}</div>` : ''}
            ${metaHtml ? `<div class="director-page-meta-list">${metaHtml}</div>` : ''}
            ${
              getIsAdmin() && director.id && !director.is_legacy_fallback
                ? `
                  <button type="button" class="secondary-button director-page-edit-button" data-director-edit="${escapeHtml(director.id)}">
                    Редактировать
                  </button>
                `
                : ''
            }
          </div>
        </div>
      </div>

      <section class="director-page-movies-section">
        <div class="director-page-section-header">
          <h2>Режиссёр</h2>
          <span>${escapeHtml(String(movies.length))}</span>
        </div>
        ${
          moviesError
            ? '<div class="director-page-empty-state">Не удалось загрузить фильмы. Попробуй обновить страницу.</div>'
            : movies.length
              ? renderDirectorMoviesGrid(movies)
              : '<div class="director-page-empty-state">Фильмы пока не привязаны.</div>'
        }
      </section>
    `;

    bindDirectorPageEvents();
  }

  async function loadDirectorPage() {
    if (!directorPage) {
      return;
    }

    const slug = getDirectorPageRouteSlug();

    if (!slug) {
      renderDirectorPageNotFound();
      return;
    }

    renderDirectorPageLoading();

    try {
      try {
        await Promise.all([
          restoreSession(),
          loadPersonPlaceholderTools()
        ]);
        trackEmailConfirmedLoginIfNeeded();
      } catch (authError) {
        console.error('Ошибка восстановления сессии на странице режиссёра:', authError);
      }

      const data = await fetchDirectorPageData(slug);

      if (!areDirectorsAvailable()) {
        renderDirectorPageUnavailable();
        return;
      }

      if (!data) {
        renderDirectorPageNotFound();
        return;
      }

      const supportResults = await Promise.allSettled([
        fetchMovieRatings(),
        shouldUseAuthenticatedUi() ? fetchCurrentUserRatings() : Promise.resolve(),
        shouldUseAuthenticatedUi() ? fetchMovieWatchlist() : Promise.resolve()
      ]);

      supportResults
        .filter(result => result.status === 'rejected')
        .forEach(result => {
          console.error('Ошибка загрузки вспомогательных данных страницы режиссёра:', result.reason);
        });

      try {
        renderDirectorPage(data);
      } catch (renderError) {
        console.error('Ошибка рендера страницы режиссёра:', renderError);
        renderDirectorPage({
          ...data,
          movies: [],
          moviesError: renderError
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки страницы режиссёра:', error);
      if (isDirectorsUnavailableError(error)) {
        markDirectorsUnavailable();
        renderDirectorPageUnavailable();
        return;
      }

      renderDirectorPageError();
    }
  }

  async function initDirectorPage() {
    await loadDirectorPage();

    bindSharedAuthStateListener({
      onAfterAuthSync: loadDirectorPage
    });
  }

  return {
    initDirectorPage,
    loadDirectorPage,
    renderDirectorPage,
    getCurrentDirectorPageData
  };
}
