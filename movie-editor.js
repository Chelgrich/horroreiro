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
    uploadPosterFile = async () => ''
  } = context;

  const getInputValue = inputElement => String(inputElement?.value || '').trim();

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

  return {
    readMovieFormDraft,
    validateMovieFormDraft,
    buildMovieInsertPayload,
    buildMovieChangedFields,
    getMoviePosterImagesDraftAfterDrop,
    getMoviePosterImagesDraftEntriesForSave,
    resolveMoviePosterImageDraftEntries,
    splitMoviePosterImageEntriesForSave
  };
}
