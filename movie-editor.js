export function createMovieEditorController(context = {}) {
  const {
    getElements = () => ({}),
    normalizeOptionalUrl = value => String(value || '').trim(),
    normalizeLetterboxdShortUrl = value => String(value || '').trim(),
    parseRuntimeMinutesFormValue = value => {
      const normalizedValue = String(value || '').trim();
      return normalizedValue ? Number(normalizedValue) : null;
    },
    parseLineOrCommaSeparatedValues = value => String(value || '')
      .split(/[\n,]/)
      .map(item => item.trim())
      .filter(Boolean),
    parseMultilineValues = value => String(value || '')
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean),
    normalizeAdditionalGenreNames = value => String(value || '')
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean),
    getOptionalTextArrayPayload = values => (Array.isArray(values) && values.length ? values : null),
    areStringArraysEqual = (firstValues = [], secondValues = []) => (
      JSON.stringify(firstValues || []) === JSON.stringify(secondValues || [])
    ),
    normalizeTextArrayField = value => Array.isArray(value) ? value : [],
    normalizeRuntimeMinutesValue = value => {
      const numericValue = Number(value);
      return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null;
    },
    normalizeManualSimilarMovieIds = (movieIds = [], ownerMovieId = null) => {
      const ownerId = ownerMovieId ? String(ownerMovieId) : '';
      const uniqueMovieIds = new Set();
      const normalizedMovieIds = [];

      (movieIds || []).forEach(movieId => {
        const normalizedMovieId = String(movieId || '').trim();

        if (
          !normalizedMovieId ||
          normalizedMovieId === ownerId ||
          uniqueMovieIds.has(normalizedMovieId)
        ) {
          return;
        }

        uniqueMovieIds.add(normalizedMovieId);
        normalizedMovieIds.push(normalizedMovieId);
      });

      return normalizedMovieIds;
    },
    normalizeMoviePosterImageRows = rows => (Array.isArray(rows) ? rows : [])
      .map(row => ({
        id: row?.id ? String(row.id) : '',
        movie_id: row?.movie_id ? String(row.movie_id) : '',
        image_url: String(row?.image_url || '').trim(),
        position: Number(row?.position ?? 0)
      }))
      .filter(row => row.image_url)
      .sort((firstRow, secondRow) => {
        if (firstRow.position !== secondRow.position) {
          return firstRow.position - secondRow.position;
        }

        return firstRow.image_url.localeCompare(secondRow.image_url);
      }),
    uploadPosterFile = async () => '',
    supabaseClient = null,
    withPendingRequestTimeout = promise => promise,
    throwIfSupabaseError = error => {
      if (error) {
        throw error;
      }
    }
  } = context;

  const getInputValue = inputElement => String(inputElement?.value || '').trim();

  function getManualSimilarFallbackMovieLabel(movie) {
    const title = String(movie?.title || '').trim();
    const year = movie?.year ? ` (${movie.year})` : '';

    return title ? `${title}${year}` : String(movie?.id || '').trim();
  }

  function getManualSimilarDraftAfterSet(movieIds = [], ownerMovieId = null) {
    return normalizeManualSimilarMovieIds(movieIds, ownerMovieId);
  }

  function getManualSimilarDraftAfterAdd(draftMovieIds = [], movieId, ownerMovieId = null) {
    return normalizeManualSimilarMovieIds(
      [...(Array.isArray(draftMovieIds) ? draftMovieIds : []), movieId],
      ownerMovieId
    );
  }

  function getManualSimilarDraftAfterRemove(draftMovieIds = [], movieId, ownerMovieId = null) {
    const removingMovieId = String(movieId || '');

    return normalizeManualSimilarMovieIds(
      (Array.isArray(draftMovieIds) ? draftMovieIds : [])
        .filter(similarMovieId => String(similarMovieId) !== removingMovieId),
      ownerMovieId
    );
  }

  function getManualSimilarSelectableMovies({
    movies = [],
    ownerMovieId = null,
    draftMovieIds = [],
    getMovieLabel = getManualSimilarFallbackMovieLabel
  } = {}) {
    const excludedMovieIds = new Set([
      ownerMovieId ? String(ownerMovieId) : '',
      ...normalizeManualSimilarMovieIds(draftMovieIds).map(movieId => String(movieId))
    ].filter(Boolean));

    return (Array.isArray(movies) ? movies : [])
      .filter(movie => movie?.id && !excludedMovieIds.has(String(movie.id)))
      .slice()
      .sort((firstMovie, secondMovie) =>
        getMovieLabel(firstMovie).localeCompare(getMovieLabel(secondMovie), 'ru')
      );
  }

  function getManualSimilarSelectedMovies({
    movieIds = [],
    ownerMovieId = null,
    getMovieById = () => null
  } = {}) {
    return normalizeManualSimilarMovieIds(movieIds, ownerMovieId)
      .map(movieId => getMovieById(movieId))
      .filter(Boolean);
  }

  function getManualSimilarMovieOptionsHtml({
    selectableMovies = [],
    getMovieLabel = getManualSimilarFallbackMovieLabel,
    escapeHtml = value => String(value ?? ''),
    placeholderLabel = 'Выбрать фильм'
  } = {}) {
    return [
      `<option value="">${escapeHtml(placeholderLabel)}</option>`,
      ...(Array.isArray(selectableMovies) ? selectableMovies : []).map(movie => (
        `<option value="${escapeHtml(movie.id)}">${escapeHtml(getMovieLabel(movie))}</option>`
      ))
    ].join('');
  }

  function getManualSimilarMoviesListHtml({
    selectedMovies = [],
    getMovieLabel = getManualSimilarFallbackMovieLabel,
    escapeHtml = value => String(value ?? ''),
    emptyHtml = '<div class="manual-similar-empty">Похожие фильмы не выбраны.</div>'
  } = {}) {
    const movies = Array.isArray(selectedMovies) ? selectedMovies : [];

    if (movies.length === 0) {
      return emptyHtml;
    }

    return movies.map(movie => {
      const movieLabel = getMovieLabel(movie);

      return `
        <div class="manual-similar-item" data-manual-similar-movie-id="${escapeHtml(movie.id)}">
          <span class="manual-similar-item-title">${escapeHtml(movieLabel)}</span>
          <button
            type="button"
            class="manual-similar-remove-button"
            data-remove-manual-similar="${escapeHtml(movie.id)}"
            aria-label="Убрать фильм ${escapeHtml(movieLabel)} из похожих"
            title="Убрать"
          >
            ×
          </button>
        </div>
      `;
    }).join('');
  }

  function createMoviePosterImageDraftEntryId(prefix = 'poster') {
    if (window.crypto?.randomUUID) {
      return `${prefix}:${window.crypto.randomUUID()}`;
    }

    return `${prefix}:${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }

  function createMoviePosterImageDraftEntryFromRow(row) {
    const normalizedRow = normalizeMoviePosterImageRows([row])[0];

    if (!normalizedRow) {
      return null;
    }

    return {
      entryId: `existing:${normalizedRow.id || normalizedRow.image_url}`,
      type: 'existing',
      id: normalizedRow.id,
      imageUrl: normalizedRow.image_url,
      label: 'Сохранённое изображение'
    };
  }

  function createMoviePosterImageDraftEntryFromPrimaryUrl(imageUrl) {
    const normalizedImageUrl = String(imageUrl || '').trim();

    if (!normalizedImageUrl) {
      return null;
    }

    return {
      entryId: `primary:${normalizedImageUrl}`,
      type: 'existing-primary',
      id: '',
      imageUrl: normalizedImageUrl,
      label: 'Сохранённое изображение'
    };
  }

  function createMoviePosterImageDraftEntryFromFile(file) {
    if (!file) {
      return null;
    }

    return {
      entryId: createMoviePosterImageDraftEntryId('pending'),
      type: 'pending',
      file,
      objectUrl: URL.createObjectURL(file),
      imageUrl: '',
      label: file.name || 'Новое изображение'
    };
  }

  function getMoviePosterImageDraftPreviewUrl(entry) {
    return String(entry?.objectUrl || entry?.imageUrl || '').trim();
  }

  function revokeMoviePosterImageDraftObjectUrl(entry) {
    if (entry?.objectUrl) {
      URL.revokeObjectURL(entry.objectUrl);
    }
  }

  function revokeMoviePosterImageDraftObjectUrls(draftEntries = []) {
    (Array.isArray(draftEntries) ? draftEntries : [])
      .forEach(revokeMoviePosterImageDraftObjectUrl);
  }

  function createMoviePosterImageDraftEntriesFromMovie(movie, rows = []) {
    const usedImageUrls = new Set();
    const draftEntries = [];
    const primaryEntry = createMoviePosterImageDraftEntryFromPrimaryUrl(movie?.poster_url);

    if (primaryEntry) {
      usedImageUrls.add(primaryEntry.imageUrl);
      draftEntries.push(primaryEntry);
    }

    normalizeMoviePosterImageRows(rows)
      .map(createMoviePosterImageDraftEntryFromRow)
      .filter(Boolean)
      .forEach(entry => {
        if (usedImageUrls.has(entry.imageUrl)) {
          return;
        }

        usedImageUrls.add(entry.imageUrl);
        draftEntries.push(entry);
      });

    return draftEntries;
  }

  function createMoviePosterImageDraftEntriesFromFiles(files = []) {
    return Array.from(files || [])
      .map(createMoviePosterImageDraftEntryFromFile)
      .filter(Boolean);
  }

  function getMoviePosterImagesDraftAfterMove(draftEntries = [], entryId, direction) {
    const normalizedEntryId = String(entryId || '');
    const nextEntries = Array.isArray(draftEntries) ? draftEntries.slice() : [];
    const currentIndex = nextEntries.findIndex(entry => entry.entryId === normalizedEntryId);
    const nextIndex = currentIndex + Number(direction || 0);

    if (
      currentIndex < 0 ||
      nextIndex < 0 ||
      nextIndex >= nextEntries.length
    ) {
      return { draftEntries, changed: false };
    }

    const [entry] = nextEntries.splice(currentIndex, 1);
    nextEntries.splice(nextIndex, 0, entry);
    return { draftEntries: nextEntries, changed: true };
  }

  function getMoviePosterImagesDraftAfterRemove(draftEntries = [], entryId) {
    const normalizedEntryId = String(entryId || '');
    const currentEntries = Array.isArray(draftEntries) ? draftEntries : [];
    const removedEntry = currentEntries.find(item => item.entryId === normalizedEntryId);

    if (!removedEntry) {
      return { draftEntries, removedEntry: null, changed: false };
    }

    return {
      draftEntries: currentEntries.filter(item => item.entryId !== normalizedEntryId),
      removedEntry,
      changed: true
    };
  }

  function readMovieFormDraft() {
    const elements = getElements();
    const directorNames = parseLineOrCommaSeparatedValues(elements.directorInput?.value || '');

    return {
      title: getInputValue(elements.titleInput),
      originalTitle: getInputValue(elements.originalTitleInput),
      year: getInputValue(elements.yearInput),
      releaseMonth: getInputValue(elements.releaseMonthInput),
      releaseYear: getInputValue(elements.releaseYearInput),
      sortOrder: getInputValue(elements.sortOrderInput),
      runtimeMinutes: parseRuntimeMinutesFormValue(elements.runtimeMinutesInput?.value || ''),
      directorNames,
      director: directorNames.join(', '),
      production: parseMultilineValues(elements.productionInput?.value || ''),
      distribution: parseMultilineValues(elements.distributionInput?.value || ''),
      russianDistribution: parseMultilineValues(elements.russianDistributionInput?.value || ''),
      synopsis: getInputValue(elements.synopsisInput),
      kinopoiskUrl: normalizeOptionalUrl(elements.kinopoiskUrlInput?.value || '', { preserveIntentionalEmpty: true }),
      imdbUrl: normalizeOptionalUrl(elements.imdbUrlInput?.value || '', { preserveIntentionalEmpty: true }),
      letterboxdUrl: normalizeOptionalUrl(elements.letterboxdUrlInput?.value || '', { preserveIntentionalEmpty: true }),
      letterboxdShortUrl: normalizeLetterboxdShortUrl(elements.letterboxdShortUrlInput?.value || ''),
      rottentomatoesUrl: normalizeOptionalUrl(elements.rottentomatoesUrlInput?.value || '', { preserveIntentionalEmpty: true }),
      tmdbUrl: normalizeOptionalUrl(elements.tmdbUrlInput?.value || '', { preserveIntentionalEmpty: true }),
      trailerUrl: normalizeOptionalUrl(elements.trailerUrlInput?.value || '', { preserveIntentionalEmpty: true }),
      genreNames: normalizeAdditionalGenreNames(elements.genresInput?.value || ''),
      countryNames: parseLineOrCommaSeparatedValues(elements.countriesInput?.value || ''),
      searchAliases: parseMultilineValues(elements.searchAliasesInput?.value || '')
    };
  }

  function validateMovieFormDraft(draft) {
    if (!draft?.title) {
      return 'Название обязательно.';
    }

    if (Number.isNaN(draft.runtimeMinutes)) {
      return 'Время должно быть целым числом минут от 1 до 999.';
    }

    return '';
  }

  function numberOrNull(value) {
    return value ? Number(value) : null;
  }

  function buildMovieInsertPayload({
    draft,
    classificationDraft,
    finalPosterUrl,
    slug,
    ownerId,
    includeRuntimeMinutes = true,
    includeTmdbUrl = true
  }) {
    return {
      title: draft.title,
      slug,
      original_title: draft.originalTitle || null,
      year: numberOrNull(draft.year),
      director: draft.director || null,
      production: getOptionalTextArrayPayload(draft.production),
      distribution: getOptionalTextArrayPayload(draft.distribution),
      russian_distribution: getOptionalTextArrayPayload(draft.russianDistribution),
      synopsis: draft.synopsis || null,
      formats: classificationDraft.formats,
      tags_perceived: classificationDraft.tagsPerceived,
      search_aliases: draft.searchAliases,
      rating: 0,
      poster_url: finalPosterUrl,
      kinopoisk_url: draft.kinopoiskUrl || null,
      imdb_url: draft.imdbUrl || null,
      letterboxd_url: draft.letterboxdUrl || null,
      letterboxd_short_url: draft.letterboxdShortUrl || null,
      rottentomatoes_url: draft.rottentomatoesUrl || null,
      ...(includeTmdbUrl ? { tmdb_url: draft.tmdbUrl || null } : {}),
      ...(draft.trailerUrl ? { trailer_url: draft.trailerUrl } : {}),
      ...(includeRuntimeMinutes ? { runtime_minutes: draft.runtimeMinutes } : {}),
      release_month: numberOrNull(draft.releaseMonth),
      release_year: numberOrNull(draft.releaseYear),
      sort_order: numberOrNull(draft.sortOrder),
      owner_id: ownerId
    };
  }

  async function buildMovieChangedFields({
    draft,
    existingMovie,
    classificationDraft,
    finalPosterUrl,
    editingMovieId,
    buildUniqueMovieSlug,
    includeRuntimeMinutes = true,
    includeTmdbUrl = true
  }) {
    const changedFields = {};

    if (draft.title !== (existingMovie.title ?? '')) {
      changedFields.title = draft.title;
    }

    if ((draft.originalTitle || null) !== (existingMovie.original_title ?? null)) {
      changedFields.original_title = draft.originalTitle || null;
    }

    if (numberOrNull(draft.year) !== (existingMovie.year ?? null)) {
      changedFields.year = numberOrNull(draft.year);
    }

    if ((draft.director || null) !== (existingMovie.director ?? null)) {
      changedFields.director = draft.director || null;
    }

    if (!areStringArraysEqual(draft.production, normalizeTextArrayField(existingMovie.production))) {
      changedFields.production = getOptionalTextArrayPayload(draft.production);
    }

    if (!areStringArraysEqual(draft.distribution, normalizeTextArrayField(existingMovie.distribution))) {
      changedFields.distribution = getOptionalTextArrayPayload(draft.distribution);
    }

    if (!areStringArraysEqual(draft.russianDistribution, normalizeTextArrayField(existingMovie.russian_distribution))) {
      changedFields.russian_distribution = getOptionalTextArrayPayload(draft.russianDistribution);
    }

    if ((draft.synopsis || null) !== (existingMovie.synopsis ?? null)) {
      changedFields.synopsis = draft.synopsis || null;
    }

    if (!areStringArraysEqual(classificationDraft.formats, existingMovie.formats || [])) {
      changedFields.formats = classificationDraft.formats;
    }

    if (!areStringArraysEqual(classificationDraft.tagsPerceived, existingMovie.tags_perceived || [])) {
      changedFields.tags_perceived = classificationDraft.tagsPerceived;
    }

    const currentYearValue = numberOrNull(draft.year);
    const shouldRegenerateSlug = (
      !existingMovie.slug ||
      draft.title !== (existingMovie.title ?? '') ||
      currentYearValue !== (existingMovie.year ?? null)
    );

    if (shouldRegenerateSlug) {
      const nextSlug = await buildUniqueMovieSlug(draft.title, currentYearValue, editingMovieId);

      if (nextSlug !== (existingMovie.slug ?? null)) {
        changedFields.slug = nextSlug;
      }
    }

    if (!areStringArraysEqual(draft.searchAliases, existingMovie.search_aliases || [])) {
      changedFields.search_aliases = draft.searchAliases;
    }

    if (finalPosterUrl !== (existingMovie.poster_url ?? null)) {
      changedFields.poster_url = finalPosterUrl;
    }

    if ((draft.kinopoiskUrl || null) !== (existingMovie.kinopoisk_url ?? null)) {
      changedFields.kinopoisk_url = draft.kinopoiskUrl || null;
    }

    if ((draft.imdbUrl || null) !== (existingMovie.imdb_url ?? null)) {
      changedFields.imdb_url = draft.imdbUrl || null;
    }

    if ((draft.letterboxdUrl || null) !== (existingMovie.letterboxd_url ?? null)) {
      changedFields.letterboxd_url = draft.letterboxdUrl || null;
    }

    if ((draft.letterboxdShortUrl || null) !== (existingMovie.letterboxd_short_url ?? null)) {
      changedFields.letterboxd_short_url = draft.letterboxdShortUrl || null;
    }

    if ((draft.rottentomatoesUrl || null) !== (existingMovie.rottentomatoes_url ?? null)) {
      changedFields.rottentomatoes_url = draft.rottentomatoesUrl || null;
    }

    if (
      includeTmdbUrl &&
      (draft.tmdbUrl || null) !== (existingMovie.tmdb_url ?? null)
    ) {
      changedFields.tmdb_url = draft.tmdbUrl || null;
    }

    if ((draft.trailerUrl || null) !== (existingMovie.trailer_url ?? null)) {
      changedFields.trailer_url = draft.trailerUrl || null;
    }

    if (
      includeRuntimeMinutes &&
      draft.runtimeMinutes !== normalizeRuntimeMinutesValue(existingMovie.runtime_minutes)
    ) {
      changedFields.runtime_minutes = draft.runtimeMinutes;
    }

    if (numberOrNull(draft.releaseMonth) !== (existingMovie.release_month ?? null)) {
      changedFields.release_month = numberOrNull(draft.releaseMonth);
    }

    if (numberOrNull(draft.releaseYear) !== (existingMovie.release_year ?? null)) {
      changedFields.release_year = numberOrNull(draft.releaseYear);
    }

    if (numberOrNull(draft.sortOrder) !== (existingMovie.sort_order ?? null)) {
      changedFields.sort_order = numberOrNull(draft.sortOrder);
    }

    return changedFields;
  }

  const sortRuValues = values => [...values].sort((a, b) => a.localeCompare(b, 'ru'));

  function getMovieUpdateRelationState({
    draft,
    existingMovie,
    getMovieDirectorItems = () => [],
    getDirectorDisplayName = item => String(item || '').trim()
  }) {
    const existingGenreNames = (existingMovie?.movie_genres || [])
      .map(item => item?.genres?.name)
      .filter(Boolean);
    const existingCountryNames = (existingMovie?.movie_countries || [])
      .map(item => item?.countries?.name)
      .filter(Boolean);

    const normalizedExistingGenres = sortRuValues(existingGenreNames);
    const normalizedNewGenres = sortRuValues(draft?.genreNames || []);
    const normalizedExistingCountries = sortRuValues(existingCountryNames);
    const normalizedNewCountries = sortRuValues(draft?.countryNames || []);

    const existingLinkedDirectorNames = getMovieDirectorItems(existingMovie)
      .map(getDirectorDisplayName)
      .filter(Boolean);
    const existingDirectorLinksKnown = (
      Array.isArray(existingMovie?.movie_people) ||
      Array.isArray(existingMovie?.movie_directors)
    );
    const existingDirectorNames = existingLinkedDirectorNames.length
      ? existingLinkedDirectorNames
      : parseLineOrCommaSeparatedValues(existingMovie?.director || '');
    const shouldRefreshDirectorLinks = (
      (draft?.directorNames || []).length > 0 &&
      (!existingDirectorLinksKnown || existingLinkedDirectorNames.length === 0)
    );

    return {
      relationsChanged: (
        !areStringArraysEqual(normalizedExistingGenres, normalizedNewGenres) ||
        !areStringArraysEqual(normalizedExistingCountries, normalizedNewCountries)
      ),
      directorsChanged: (
        !areStringArraysEqual(existingDirectorNames, draft?.directorNames || []) ||
        shouldRefreshDirectorLinks
      )
    };
  }

  function getMoviePosterImagesDraftAfterDrop(
    draftEntries = [],
    sourceEntryId,
    targetEntryId,
    shouldPlaceAfter = false
  ) {
    const sourceId = String(sourceEntryId || '');
    const targetId = String(targetEntryId || '');

    if (!sourceId || !targetId || sourceId === targetId) {
      return draftEntries;
    }

    const sourceEntry = draftEntries.find(entry => entry.entryId === sourceId);
    const nextEntries = draftEntries.filter(entry => entry.entryId !== sourceId);
    const targetIndex = nextEntries.findIndex(entry => entry.entryId === targetId);

    if (!sourceEntry || targetIndex < 0) {
      return draftEntries;
    }

    nextEntries.splice(targetIndex + (shouldPlaceAfter ? 1 : 0), 0, sourceEntry);
    return nextEntries;
  }

  function getMoviePosterImagesDraftEntriesForSave(draftEntries = []) {
    return draftEntries.map(entry => ({ ...entry }));
  }

  function hasPendingMoviePosterDraftUploads(draftEntries = []) {
    return draftEntries.some(entry => entry?.type === 'pending');
  }

  async function resolveMoviePosterImageDraftEntries(draftEntries = []) {
    const resolvedEntries = [];
    const usedImageUrls = new Set();
    const uploadedUrls = [];

    for (const entry of draftEntries) {
      let imageUrl = String(entry?.imageUrl || '').trim();

      if (entry?.type === 'pending' && entry.file) {
        imageUrl = await uploadPosterFile(entry.file);
        uploadedUrls.push(imageUrl);
      }

      if (!imageUrl || usedImageUrls.has(imageUrl)) {
        continue;
      }

      usedImageUrls.add(imageUrl);
      resolvedEntries.push({
        ...entry,
        type: 'resolved',
        imageUrl
      });
    }

    return {
      resolvedEntries,
      uploadedUrls
    };
  }

  function splitMoviePosterImageEntriesForSave(resolvedEntries = []) {
    const primaryUrl = String(resolvedEntries[0]?.imageUrl || '').trim() || null;
    const additionalEntries = resolvedEntries.slice(1);
    const allUrls = new Set(
      resolvedEntries
        .map(entry => String(entry?.imageUrl || '').trim())
        .filter(Boolean)
    );

    return {
      primaryUrl,
      additionalEntries,
      allUrls
    };
  }

  async function resolveMoviePosterImagesForSave(draftEntries = []) {
    const resolvedPosterImages = await resolveMoviePosterImageDraftEntries(draftEntries);
    const posterImagesForSave = splitMoviePosterImageEntriesForSave(
      resolvedPosterImages.resolvedEntries
    );

    return {
      ...resolvedPosterImages,
      finalPosterUrl: posterImagesForSave.primaryUrl,
      additionalPosterEntriesForSave: posterImagesForSave.additionalEntries,
      finalPosterUrls: posterImagesForSave.allUrls
    };
  }

  function getMovieCreateSavePlan({
    manualSimilarMovieIds = [],
    additionalPosterEntriesForSave = []
  } = {}) {
    return {
      shouldSaveManualSimilarMovies: manualSimilarMovieIds.length > 0,
      shouldSavePosterGallery: additionalPosterEntriesForSave.length > 0
    };
  }

  function getMovieUpdateSavePlan({
    changedFields = {},
    relationsChanged = false,
    directorsChanged = false,
    manualSimilarChanged = false,
    posterImagesChanged = false,
    oldPosterUrl = null,
    finalPosterUrls = new Set()
  } = {}) {
    const hasMovieFieldChanges = Object.keys(changedFields || {}).length > 0;
    const hasAnyChanges = Boolean(
      hasMovieFieldChanges ||
      relationsChanged ||
      directorsChanged ||
      manualSimilarChanged ||
      posterImagesChanged
    );
    const hasFinalPosterUrl = (
      finalPosterUrls &&
      typeof finalPosterUrls.has === 'function' &&
      finalPosterUrls.has(oldPosterUrl)
    );

    return {
      hasMovieFieldChanges,
      hasAnyChanges,
      shouldDeleteOldPoster: Boolean(posterImagesChanged && oldPosterUrl && !hasFinalPosterUrl)
    };
  }

  function requireSupabaseClient() {
    if (!supabaseClient) {
      throw new Error('Supabase client is not available for movie editor writes.');
    }

    return supabaseClient;
  }

  async function insertMovieRecord({
    draft,
    classificationDraft,
    finalPosterUrl,
    slug,
    ownerId,
    includeRuntimeMinutes = true,
    includeTmdbUrl = true,
    timeoutMs = 15000,
    timeoutMessage = 'Movie save timed out.'
  }) {
    const client = requireSupabaseClient();
    const { data, error } = await withPendingRequestTimeout(
      client
        .from('movies')
        .insert(buildMovieInsertPayload({
          draft,
          classificationDraft,
          finalPosterUrl,
          slug,
          ownerId,
          includeRuntimeMinutes,
          includeTmdbUrl
        }))
        .select('id, slug')
        .single(),
      timeoutMs,
      timeoutMessage
    );

    throwIfSupabaseError(error);
    return data;
  }

  async function updateMovieRecord({
    movieId,
    changedFields,
    timeoutMs = 15000,
    timeoutMessage = 'Movie update timed out.'
  }) {
    if (!movieId || Object.keys(changedFields || {}).length === 0) {
      return;
    }

    const client = requireSupabaseClient();
    const { error } = await withPendingRequestTimeout(
      client
        .from('movies')
        .update(changedFields)
        .eq('id', movieId),
      timeoutMs,
      timeoutMessage
    );

    throwIfSupabaseError(error);
  }

  async function saveMovieCreateRelatedData({
    movieId,
    draft,
    createSavePlan = null,
    manualSimilarMovieIds = [],
    additionalPosterEntriesForSave = [],
    setStatus = () => {},
    replaceMovieRelations = async () => {},
    replaceMovieDirectors = async () => {},
    replaceManualSimilarMovies = async () => {},
    replaceMoviePosterImages = async () => {}
  } = {}) {
    const savePlan = createSavePlan || getMovieCreateSavePlan({
      manualSimilarMovieIds,
      additionalPosterEntriesForSave
    });

    await withPendingRequestTimeout(
      replaceMovieRelations(movieId, draft.genreNames, draft.countryNames),
      15000,
      'Превышено время ожидания сохранения жанров и стран.'
    );

    if (draft.directorNames.length > 0) {
      setStatus('Сохраняю режиссёров...');
      await withPendingRequestTimeout(
        replaceMovieDirectors(movieId, draft.directorNames),
        15000,
        'Превышено время ожидания сохранения режиссёров.'
      );
    }

    if (savePlan.shouldSaveManualSimilarMovies) {
      setStatus('Сохраняю похожие фильмы...');
      await withPendingRequestTimeout(
        replaceManualSimilarMovies(movieId, manualSimilarMovieIds),
        15000,
        'Превышено время ожидания сохранения похожих фильмов.'
      );
    }

    if (savePlan.shouldSavePosterGallery) {
      setStatus('Сохраняю галерею...');
      await withPendingRequestTimeout(
        replaceMoviePosterImages(movieId, additionalPosterEntriesForSave),
        30000,
        'Превышено время ожидания сохранения галереи.'
      );
    }
  }

  async function saveMovieUpdateRelatedData({
    movieId,
    draft,
    relationsChanged = false,
    directorsChanged = false,
    manualSimilarChanged = false,
    posterImagesChanged = false,
    manualSimilarMovieIds = [],
    additionalPosterEntriesForSave = [],
    finalPosterUrl = null,
    setStatus = () => {},
    replaceMovieRelations = async () => {},
    replaceMovieDirectors = async () => {},
    replaceManualSimilarMovies = async () => {},
    replaceMoviePosterImages = async () => {}
  } = {}) {
    if (relationsChanged) {
      await withPendingRequestTimeout(
        replaceMovieRelations(movieId, draft.genreNames, draft.countryNames),
        15000,
        'Превышено время ожидания обновления жанров и стран.'
      );
    }

    if (directorsChanged) {
      setStatus('Сохраняю режиссёров...');
      await withPendingRequestTimeout(
        replaceMovieDirectors(movieId, draft.directorNames),
        15000,
        'Превышено время ожидания сохранения режиссёров.'
      );
    }

    if (manualSimilarChanged) {
      setStatus('Сохраняю похожие фильмы...');
      await withPendingRequestTimeout(
        replaceManualSimilarMovies(movieId, manualSimilarMovieIds),
        15000,
        'Превышено время ожидания сохранения похожих фильмов.'
      );
    }

    if (posterImagesChanged) {
      setStatus('Сохраняю галерею...');
      await withPendingRequestTimeout(
        replaceMoviePosterImages(movieId, additionalPosterEntriesForSave, {
          preservedUrls: [finalPosterUrl]
        }),
        30000,
        'Превышено время ожидания сохранения галереи.'
      );
    }
  }

  async function handleMovieCreatePostSave({
    insertedMovie,
    isCatalogPage = false,
    isMoviePage = false,
    setStatus = () => {},
    markLocalDataMutation = () => {},
    reloadCatalogData = async () => {},
    rerenderCatalogAfterDataReload = () => {},
    resetFormToCreateMode = () => {},
    closeMovieModal = () => {},
    redirectToMovie = () => {}
  } = {}) {
    markLocalDataMutation(`movie-create:${insertedMovie.id}`);

    if (isCatalogPage) {
      setStatus('Обновляю каталог...');
      await withPendingRequestTimeout(
        reloadCatalogData({ showSkeleton: false }),
        15000,
        'Превышено время ожидания обновления каталога.'
      );

      rerenderCatalogAfterDataReload(insertedMovie.id);
      resetFormToCreateMode();
      closeMovieModal();
      return { shouldExit: false };
    }

    if (isMoviePage) {
      redirectToMovie(insertedMovie);
      return { shouldExit: true };
    }

    return { shouldExit: false };
  }

  async function handleMovieUpdatePostSave({
    movieId,
    updateSavePlan,
    isCatalogPage = false,
    isMoviePage = false,
    shouldReplaceMoviePageUrl = false,
    setStatus = () => {},
    markLocalDataMutation = () => {},
    reloadCatalogData = async () => {},
    rerenderCatalogAfterDataReload = () => {},
    reloadMoviePageData = async () => null,
    buildMoviePageUrl = () => '',
    replaceMoviePageUrl = () => {},
    renderMoviePage = () => {},
    syncCatalogSessionSnapshotMovieState = () => {},
    loadMoviePageSimilarMovies = async () => {},
    persistCurrentMoviePageSessionCache = () => {},
    renderMoviePageNotFound = () => {},
    closeMovieModal = () => {},
    resetFormToCreateMode = () => {}
  } = {}) {
    const savePlan = updateSavePlan || { hasAnyChanges: false };

    if (!savePlan.hasAnyChanges) {
      setStatus('Изменений нет.');
      closeMovieModal();
      resetFormToCreateMode();
      return { shouldExit: true };
    }

    markLocalDataMutation(`movie-update:${movieId}`);

    if (isCatalogPage) {
      setStatus('Обновляю каталог...');
      await withPendingRequestTimeout(
        reloadCatalogData({ showSkeleton: false }),
        15000,
        'Превышено время ожидания обновления каталога.'
      );

      rerenderCatalogAfterDataReload(movieId);
    } else if (isMoviePage) {
      setStatus('Обновляю страницу фильма...');

      const updatedMovie = await withPendingRequestTimeout(
        reloadMoviePageData(movieId),
        15000,
        'Превышено время ожидания обновления страницы фильма.'
      );

      if (updatedMovie) {
        const nextMoviePageUrl = buildMoviePageUrl(updatedMovie);

        if (shouldReplaceMoviePageUrl) {
          replaceMoviePageUrl(nextMoviePageUrl);
        }

        renderMoviePage(updatedMovie);
        syncCatalogSessionSnapshotMovieState(movieId, { syncMovie: updatedMovie });
        await loadMoviePageSimilarMovies(updatedMovie);
        persistCurrentMoviePageSessionCache();
      } else {
        renderMoviePageNotFound();
      }
    }

    closeMovieModal();
    resetFormToCreateMode();
    return { shouldExit: false };
  }

  async function submitMovieFormEvent({
    isEditing = false,
    isSubmitting = false,
    setSubmittingState = () => {},
    setStatus = () => {},
    submitCreate = async () => ({}),
    submitUpdate = async () => ({}),
    errorMessages = {}
  } = {}) {
    if (isSubmitting) {
      return { shouldExit: true, skipped: true };
    }

    const mode = isEditing ? 'update' : 'create';
    const errorMessageConfig = errorMessages[mode] || {};

    setSubmittingState(true);

    try {
      return isEditing ? await submitUpdate() : await submitCreate();
    } catch (error) {
      const logPrefix = errorMessageConfig.logPrefix || 'Movie editor submit failed:';
      const statusPrefix = errorMessageConfig.statusPrefix || 'Movie editor submit failed';
      const fallbackMessage = errorMessageConfig.fallbackMessage || 'See console.';

      console.error(logPrefix, error);
      setStatus(`${statusPrefix}: ${error.message || fallbackMessage}`);

      return {
        shouldExit: true,
        error,
        mode
      };
    } finally {
      setSubmittingState(false);
    }
  }

  async function submitMovieCreate({
    manualSimilarMovieIdsDraft = [],
    moviePosterImagesDraft = [],
    buildClassificationDraft = () => ({}),
    normalizeManualSimilarMovieIds = values => values,
    ensureActiveSessionForWrite = () => ({}),
    buildUniqueMovieSlug = async () => '',
    includeRuntimeMinutes = true,
    includeTmdbUrl = true,
    setStatus = () => {},
    replaceMovieRelations = async () => {},
    replaceMovieDirectors = async () => {},
    replaceManualSimilarMovies = async () => {},
    replaceMoviePosterImages = async () => {},
    postSaveOptions = {}
  } = {}) {
    setStatus('Сохраняю...');

    const draft = readMovieFormDraft();
    const validationMessage = validateMovieFormDraft(draft);

    if (validationMessage) {
      setStatus(validationMessage);
      return { shouldExit: true, validationFailed: true };
    }

    const activeUser = ensureActiveSessionForWrite();
    const classificationDraft = buildClassificationDraft();
    const manualSimilarMovieIds = normalizeManualSimilarMovieIds(manualSimilarMovieIdsDraft);
    const posterDraftEntries = getMoviePosterImagesDraftEntriesForSave(moviePosterImagesDraft);

    if (hasPendingMoviePosterDraftUploads(posterDraftEntries)) {
      setStatus('Загружаю постеры...');
    }

    const resolvedPosterImages = await withPendingRequestTimeout(
      resolveMoviePosterImagesForSave(posterDraftEntries),
      30000,
      'Превышено время ожидания загрузки постеров.'
    );
    const {
      finalPosterUrl,
      additionalPosterEntriesForSave
    } = resolvedPosterImages;
    const createSavePlan = getMovieCreateSavePlan({
      manualSimilarMovieIds,
      additionalPosterEntriesForSave
    });

    setStatus('Сохраняю...');

    const insertedMovie = await insertMovieRecord({
      draft,
      classificationDraft,
      finalPosterUrl,
      slug: await buildUniqueMovieSlug(
        draft.title,
        draft.year ? Number(draft.year) : null
      ),
      ownerId: activeUser.id,
      includeRuntimeMinutes,
      includeTmdbUrl,
      timeoutMessage: 'Превышено время ожидания сохранения фильма.'
    });

    await saveMovieCreateRelatedData({
      movieId: insertedMovie.id,
      draft,
      createSavePlan,
      manualSimilarMovieIds,
      additionalPosterEntriesForSave,
      setStatus,
      replaceMovieRelations,
      replaceMovieDirectors,
      replaceManualSimilarMovies,
      replaceMoviePosterImages
    });

    const postSaveResult = await handleMovieCreatePostSave({
      insertedMovie,
      setStatus,
      ...postSaveOptions
    });

    return {
      ...postSaveResult,
      insertedMovie,
      validationFailed: false
    };
  }

  async function submitMovieUpdate({
    movieId,
    existingMovie,
    manualSimilarMovieIdsDraft = [],
    moviePosterImagesDraft = [],
    posterImagesChanged = false,
    buildClassificationDraft = () => ({}),
    normalizeManualSimilarMovieIds = values => values,
    getManualSimilarMovieIds = () => [],
    getMovieDirectorItems = () => [],
    getDirectorDisplayName = item => String(item || '').trim(),
    ensureActiveSessionForWrite = () => ({}),
    ensureManualSimilarDataLoaded = async () => {},
    buildUniqueMovieSlug = async () => '',
    includeRuntimeMinutes = true,
    includeTmdbUrl = true,
    setStatus = () => {},
    setMissingMovieMessage = () => {},
    replaceMovieRelations = async () => {},
    replaceMovieDirectors = async () => {},
    replaceManualSimilarMovies = async () => {},
    replaceMoviePosterImages = async () => {},
    deletePosterFileByUrl = async () => {},
    onDeletePosterError = error => {
      console.error('Не удалось удалить старый постер:', error);
    },
    postSaveOptions = {}
  } = {}) {
    setStatus('Сохраняю изменения...');

    const draft = readMovieFormDraft();
    const validationMessage = validateMovieFormDraft(draft);

    if (validationMessage) {
      setStatus(validationMessage);
      return { shouldExit: true, validationFailed: true };
    }

    if (!existingMovie) {
      setMissingMovieMessage('Не удалось найти фильм для редактирования.');
      return { shouldExit: true, missingMovie: true };
    }

    const oldPosterUrl = existingMovie.poster_url ?? null;
    const {
      relationsChanged,
      directorsChanged
    } = getMovieUpdateRelationState({
      draft,
      existingMovie,
      getMovieDirectorItems,
      getDirectorDisplayName
    });

    ensureActiveSessionForWrite();
    await ensureManualSimilarDataLoaded();

    const classificationDraft = buildClassificationDraft();
    const manualSimilarMovieIds = normalizeManualSimilarMovieIds(manualSimilarMovieIdsDraft, movieId);
    const manualSimilarChanged = !areStringArraysEqual(
      manualSimilarMovieIds,
      getManualSimilarMovieIds(movieId)
    );
    let additionalPosterEntriesForSave = [];
    let finalPosterUrl = existingMovie.poster_url ?? null;
    let finalPosterUrls = new Set([finalPosterUrl].filter(Boolean));

    if (posterImagesChanged) {
      const posterDraftEntries = getMoviePosterImagesDraftEntriesForSave(moviePosterImagesDraft);

      if (hasPendingMoviePosterDraftUploads(posterDraftEntries)) {
        setStatus('Загружаю постеры...');
      }

      const posterImagesForSave = await withPendingRequestTimeout(
        resolveMoviePosterImagesForSave(posterDraftEntries),
        30000,
        'Превышено время ожидания загрузки постеров.'
      );

      finalPosterUrl = posterImagesForSave.finalPosterUrl;
      additionalPosterEntriesForSave = posterImagesForSave.additionalPosterEntriesForSave;
      finalPosterUrls = posterImagesForSave.finalPosterUrls;
    }

    const changedFields = await buildMovieChangedFields({
      draft,
      existingMovie,
      classificationDraft,
      finalPosterUrl,
      editingMovieId: movieId,
      buildUniqueMovieSlug,
      includeRuntimeMinutes,
      includeTmdbUrl
    });
    const updateSavePlan = getMovieUpdateSavePlan({
      changedFields,
      relationsChanged,
      directorsChanged,
      manualSimilarChanged,
      posterImagesChanged,
      oldPosterUrl,
      finalPosterUrls
    });

    if (updateSavePlan.hasMovieFieldChanges) {
      setStatus('Сохраняю изменения...');

      await updateMovieRecord({
        movieId,
        changedFields,
        timeoutMessage: 'Превышено время ожидания обновления фильма.'
      });
    }

    await saveMovieUpdateRelatedData({
      movieId,
      draft,
      relationsChanged,
      directorsChanged,
      manualSimilarChanged,
      posterImagesChanged,
      manualSimilarMovieIds,
      additionalPosterEntriesForSave,
      finalPosterUrl,
      setStatus,
      replaceMovieRelations,
      replaceMovieDirectors,
      replaceManualSimilarMovies,
      replaceMoviePosterImages
    });

    if (updateSavePlan.shouldDeleteOldPoster) {
      try {
        await deletePosterFileByUrl(oldPosterUrl);
      } catch (deletePosterError) {
        onDeletePosterError(deletePosterError);
      }
    }

    const postSaveResult = await handleMovieUpdatePostSave({
      movieId,
      updateSavePlan,
      setStatus,
      ...postSaveOptions
    });

    return {
      ...postSaveResult,
      updateSavePlan,
      validationFailed: false,
      missingMovie: false
    };
  }

  return {
    readMovieFormDraft,
    validateMovieFormDraft,
    buildMovieInsertPayload,
    buildMovieChangedFields,
    getMovieUpdateRelationState,
    getManualSimilarDraftAfterSet,
    getManualSimilarDraftAfterAdd,
    getManualSimilarDraftAfterRemove,
    getManualSimilarSelectableMovies,
    getManualSimilarSelectedMovies,
    getManualSimilarMovieOptionsHtml,
    getManualSimilarMoviesListHtml,
    createMoviePosterImageDraftEntriesFromMovie,
    createMoviePosterImageDraftEntriesFromFiles,
    getMoviePosterImageDraftPreviewUrl,
    revokeMoviePosterImageDraftObjectUrl,
    revokeMoviePosterImageDraftObjectUrls,
    getMoviePosterImagesDraftAfterMove,
    getMoviePosterImagesDraftAfterRemove,
    getMoviePosterImagesDraftAfterDrop,
    getMoviePosterImagesDraftEntriesForSave,
    hasPendingMoviePosterDraftUploads,
    resolveMoviePosterImageDraftEntries,
    resolveMoviePosterImagesForSave,
    splitMoviePosterImageEntriesForSave,
    getMovieCreateSavePlan,
    getMovieUpdateSavePlan,
    insertMovieRecord,
    updateMovieRecord,
    saveMovieCreateRelatedData,
    saveMovieUpdateRelatedData,
    handleMovieCreatePostSave,
    handleMovieUpdatePostSave,
    submitMovieFormEvent,
    submitMovieCreate,
    submitMovieUpdate
  };
}
