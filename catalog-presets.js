function hasPresetValue(value) {
  return String(value || '').trim() !== '';
}

function asPresetSet(value) {
  return value instanceof Set ? value : new Set(value || []);
}

function getActiveQuickPresetKey(state = {}) {
  const hasSearchQuery = hasPresetValue(state.searchQuery);
  const hasGenreFilter = hasPresetValue(state.genre);
  const hasSubgenreFilter = hasPresetValue(state.subgenre);
  const hasFormatFilter = hasPresetValue(state.format);
  const hasCountryFilter = hasPresetValue(state.country);
  const hasYearFilter = hasPresetValue(state.yearFrom) || hasPresetValue(state.yearTo);
  const hasRatingFilter = hasPresetValue(state.ratingFrom) || hasPresetValue(state.ratingTo);
  const hasRuntimeFilter = hasPresetValue(state.runtimeFrom) || hasPresetValue(state.runtimeTo);
  const hasAuthPresetFilter = Boolean(state.hasCurrentUser && (state.watchlist || state.watched));
  const normalizedSearchQuery = String(state.normalizedSearchQuery || '').trim();
  const normalizedAstralsSearchQuery = String(state.normalizedAstralsSearchQuery || '').trim();

  if (
    normalizedSearchQuery &&
    normalizedSearchQuery === normalizedAstralsSearchQuery &&
    !state.reviewedOnly &&
    !hasGenreFilter &&
    !hasSubgenreFilter &&
    !hasFormatFilter &&
    !hasCountryFilter &&
    !hasYearFilter &&
    !hasRatingFilter &&
    !hasRuntimeFilter &&
    !hasAuthPresetFilter
  ) {
    return 'astrals';
  }

  if (
    !hasPresetValue(state.runtimeFrom) &&
    String(state.runtimeTo || '') === '90' &&
    !hasSearchQuery &&
    !state.reviewedOnly &&
    !hasGenreFilter &&
    !hasSubgenreFilter &&
    !hasFormatFilter &&
    !hasCountryFilter &&
    !hasYearFilter &&
    !hasRatingFilter &&
    !hasAuthPresetFilter
  ) {
    return 'short-runtime';
  }

  if (
    hasSearchQuery ||
    hasGenreFilter ||
    hasSubgenreFilter ||
    hasFormatFilter ||
    hasCountryFilter ||
    hasYearFilter ||
    hasRuntimeFilter
  ) {
    return null;
  }

  if (
    state.reviewedOnly &&
    !hasRatingFilter &&
    !hasAuthPresetFilter
  ) {
    return 'with-reviews';
  }

  if (
    String(state.ratingFrom || '') === '7' &&
    !hasPresetValue(state.ratingTo) &&
    !hasAuthPresetFilter
  ) {
    return 'top-rated';
  }

  if (
    String(state.ratingFrom || '') === '1' &&
    String(state.ratingTo || '') === '3' &&
    !hasAuthPresetFilter
  ) {
    return 'low-rated';
  }

  if (
    String(state.ratingFrom || '') === '0' &&
    String(state.ratingTo || '') === '0' &&
    !hasAuthPresetFilter
  ) {
    return 'unrated';
  }

  if (
    state.hasCurrentUser &&
    state.watchlist === 'in_watchlist' &&
    !state.watched &&
    !hasRatingFilter
  ) {
    return 'watchlist';
  }

  if (
    state.hasCurrentUser &&
    state.watched === 'watched' &&
    !state.watchlist &&
    !hasRatingFilter
  ) {
    return 'watched';
  }

  if (
    state.hasCurrentUser &&
    state.watched === 'unwatched' &&
    !state.watchlist &&
    !hasRatingFilter
  ) {
    return 'unwatched';
  }

  return null;
}

function getCatalogRoutePresetKey(search, {
  presetQueryParam = 'preset',
  routePresetKeys = new Set()
} = {}) {
  const presetKey = String(
    new URLSearchParams(String(search || '')).get(presetQueryParam) || ''
  ).trim();

  return asPresetSet(routePresetKeys).has(presetKey) ? presetKey : '';
}

function canApplyQuickPreset(presetKey, {
  authRequiredPresetKeys = new Set(),
  hasCurrentUser = false
} = {}) {
  return !asPresetSet(authRequiredPresetKeys).has(presetKey) || Boolean(hasCurrentUser);
}

function getQuickPresetFilterPatch(presetKey, {
  hasCurrentUser = false,
  astralsSearchQuery = ''
} = {}) {
  if (presetKey === 'top-rated') {
    return { ratingFrom: '7', ratingTo: '' };
  }

  if (presetKey === 'low-rated') {
    return { ratingFrom: '1', ratingTo: '3' };
  }

  if (presetKey === 'unrated') {
    return { ratingFrom: '0', ratingTo: '0' };
  }

  if (presetKey === 'short-runtime') {
    return { runtimeFrom: '', runtimeTo: '90' };
  }

  if (presetKey === 'with-reviews') {
    return { reviewedOnly: true };
  }

  if (presetKey === 'astrals') {
    return {
      searchQuery: astralsSearchQuery,
      lastSearchQuery: astralsSearchQuery
    };
  }

  if (presetKey === 'watchlist' && hasCurrentUser) {
    return { watchlist: 'in_watchlist' };
  }

  if (presetKey === 'watched' && hasCurrentUser) {
    return { watched: 'watched' };
  }

  if (presetKey === 'unwatched' && hasCurrentUser) {
    return { watched: 'unwatched' };
  }

  return {};
}

function syncQuickPresetButtons(quickPresetsBar, {
  activePresetKey = null,
  hasCurrentUser = false
} = {}) {
  if (!quickPresetsBar) {
    return;
  }

  quickPresetsBar.querySelectorAll('.quick-preset-button').forEach(button => {
    const presetKey = button.dataset.quickPreset;
    const requiresAuth = button.dataset.requiresAuth === 'true';
    const shouldHide = requiresAuth && !hasCurrentUser;

    button.classList.toggle('is-hidden-by-auth', shouldHide);
    button.classList.toggle('is-active', !shouldHide && presetKey === activePresetKey);
  });
}

export {
  canApplyQuickPreset,
  getActiveQuickPresetKey,
  getCatalogRoutePresetKey,
  getQuickPresetFilterPatch,
  syncQuickPresetButtons
};
