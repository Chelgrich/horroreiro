function getSearchParams(value) {
  if (value instanceof URLSearchParams) {
    return new URLSearchParams(value);
  }

  return new URLSearchParams(String(value || ''));
}

function createCatalogUrlValueAliasLookups(valueAliases = {}) {
  return Object.fromEntries(
    Object.entries(valueAliases || {}).map(([paramName, valueMap]) => [
      paramName,
      Object.fromEntries(
        Object.entries(valueMap || {}).map(([label, alias]) => [alias, label])
      )
    ])
  );
}

function hasCatalogUrlStateParams(searchParams, urlStateParams = []) {
  const params = getSearchParams(searchParams);

  return Array.from(urlStateParams || []).some(paramName => params.has(paramName));
}

function getCatalogUrlValueAlias(paramName, value, {
  valueAliases = {},
  slugifyValue = null
} = {}) {
  const normalizedValue = String(value || '').trim();

  if (!normalizedValue) {
    return '';
  }

  if (!valueAliases[paramName]) {
    return normalizedValue;
  }

  return valueAliases[paramName][normalizedValue]
    || slugifyValue?.(normalizedValue)
    || normalizedValue;
}

function getSelectOptions(selectElement) {
  return Array.from(selectElement?.options || []);
}

function getSelectOptionValue(selectElement, value, fallbackValue = '') {
  const normalizedValue = String(value || '').trim();

  if (!normalizedValue || !selectElement) {
    return fallbackValue;
  }

  return getSelectOptions(selectElement).some(option => option.value === normalizedValue)
    ? normalizedValue
    : fallbackValue;
}

function getCatalogUrlValueByAlias(paramName, value, {
  selectElement = null,
  valueAliases = {},
  valueAliasLookups = createCatalogUrlValueAliasLookups(valueAliases),
  slugifyValue = null
} = {}) {
  const normalizedValue = String(value || '').trim();

  if (!normalizedValue) {
    return '';
  }

  if (
    selectElement &&
    getSelectOptions(selectElement).some(option => option.value === normalizedValue)
  ) {
    return normalizedValue;
  }

  const aliasedValue = valueAliasLookups[paramName]?.[normalizedValue];

  if (aliasedValue) {
    return aliasedValue;
  }

  if (selectElement) {
    const matchingOption = getSelectOptions(selectElement)
      .find(option => getCatalogUrlValueAlias(paramName, option.value, {
        valueAliases,
        slugifyValue
      }) === normalizedValue);

    if (matchingOption) {
      return matchingOption.value;
    }
  }

  return normalizedValue;
}

function getCatalogUrlBooleanValue(value, trueValues = new Set(['1', 'true', 'yes', 'on'])) {
  return trueValues.has(String(value || '').trim().toLowerCase());
}

function getDefaultState(defaultState) {
  return typeof defaultState === 'function'
    ? defaultState()
    : { ...(defaultState || {}) };
}

function normalizeRangeParam(value, rangeKey, {
  normalizeRangeValue = valueToNormalize => String(valueToNormalize || '').trim(),
  getRangeOptions = () => ({})
} = {}) {
  return normalizeRangeValue(value, getRangeOptions(rangeKey));
}

function readCatalogUrlState({
  search = '',
  defaultState,
  urlStateParams,
  presetQueryParam = 'preset',
  profileQueryParam = 'profile',
  profileActivityQueryParam = 'activity',
  routePresetKeys = new Set(),
  valueAliases = {},
  valueAliasLookups = createCatalogUrlValueAliasLookups(valueAliases),
  trueValues = new Set(['1', 'true', 'yes', 'on']),
  selectElements = {},
  normalizeRangeValue,
  getRangeOptions,
  normalizeProfileActivityKey = value => String(value || '').trim(),
  slugifyValue = null
} = {}) {
  const searchParams = getSearchParams(search);

  if (!hasCatalogUrlStateParams(searchParams, urlStateParams)) {
    return null;
  }

  const catalogState = getDefaultState(defaultState);
  const presetKey = String(searchParams.get(presetQueryParam) || '').trim();
  const hasValidPreset = routePresetKeys.has(presetKey);
  const searchQuery = searchParams.has('q')
    ? searchParams.get('q')
    : searchParams.get('search');

  if (!hasValidPreset) {
    catalogState.searchQuery = String(searchQuery || '').trim();
    catalogState.genre = getCatalogUrlValueByAlias('genre', searchParams.get('genre'), {
      selectElement: selectElements.genre,
      valueAliases,
      valueAliasLookups,
      slugifyValue
    });
    catalogState.subgenre = getCatalogUrlValueByAlias('subgenre', searchParams.get('subgenre'), {
      selectElement: selectElements.subgenre,
      valueAliases,
      valueAliasLookups,
      slugifyValue
    });
    catalogState.format = getCatalogUrlValueByAlias('format', searchParams.get('format'), {
      selectElement: selectElements.format,
      valueAliases,
      valueAliasLookups,
      slugifyValue
    });
    catalogState.country = getCatalogUrlValueByAlias('country', searchParams.get('country'), {
      selectElement: selectElements.country,
      valueAliases,
      valueAliasLookups,
      slugifyValue
    });
    catalogState.ratingFrom = normalizeRangeParam(
      searchParams.get('rating_from') || searchParams.get('rating'),
      'rating',
      { normalizeRangeValue, getRangeOptions }
    );
    catalogState.ratingTo = normalizeRangeParam(
      searchParams.get('rating_to'),
      'rating',
      { normalizeRangeValue, getRangeOptions }
    );
    catalogState.yearFrom = normalizeRangeParam(
      searchParams.get('year_from') || searchParams.get('year'),
      'year',
      { normalizeRangeValue, getRangeOptions }
    );
    catalogState.yearTo = normalizeRangeParam(
      searchParams.get('year_to') || searchParams.get('year'),
      'year',
      { normalizeRangeValue, getRangeOptions }
    );
    catalogState.runtimeFrom = normalizeRangeParam(
      searchParams.get('runtime_from'),
      'runtime',
      { normalizeRangeValue, getRangeOptions }
    );
    catalogState.runtimeTo = normalizeRangeParam(
      searchParams.get('runtime_to'),
      'runtime',
      { normalizeRangeValue, getRangeOptions }
    );
    catalogState.withReviews = getCatalogUrlBooleanValue(searchParams.get('reviews'), trueValues);
    catalogState.watchlist = getSelectOptionValue(selectElements.watchlist, searchParams.get('watchlist'), '');
    catalogState.watched = getSelectOptionValue(selectElements.watched, searchParams.get('watched'), '');
  }

  catalogState.viewMode = getSelectOptionValue(selectElements.viewMode, searchParams.get('view'), 'list');
  catalogState.sortMode = getSelectOptionValue(selectElements.sortMode, searchParams.get('sort'), 'default');
  catalogState.page = Math.max(1, Number(searchParams.get('page')) || 1);
  catalogState.profileHandle = String(searchParams.get(profileQueryParam) || '').trim();
  catalogState.profileActivity = normalizeProfileActivityKey(
    searchParams.get(profileActivityQueryParam)
  );

  return catalogState;
}

function setCatalogUrlParam(searchParams, paramName, value, options = {}) {
  const normalizedValue = getCatalogUrlValueAlias(paramName, value, options);

  if (normalizedValue) {
    searchParams.set(paramName, normalizedValue);
  }
}

function getCatalogUrlSearchParamsFromState({
  currentSearch = '',
  state,
  activePresetKey = '',
  urlStateParams,
  presetQueryParam = 'preset',
  profileQueryParam = 'profile',
  profileActivityQueryParam = 'activity',
  hasCurrentUser = false,
  profileHandle = '',
  profileActivityKey = '',
  valueAliases = {},
  slugifyValue = null
} = {}) {
  const searchParams = getSearchParams(currentSearch);
  const catalogState = state || {};
  const aliasOptions = {
    valueAliases,
    slugifyValue
  };

  Array.from(urlStateParams || []).forEach(paramName => {
    searchParams.delete(paramName);
  });

  if (activePresetKey) {
    searchParams.set(presetQueryParam, activePresetKey);
  } else {
    setCatalogUrlParam(searchParams, 'q', catalogState.searchQuery, aliasOptions);
    setCatalogUrlParam(searchParams, 'genre', catalogState.genre, aliasOptions);
    setCatalogUrlParam(searchParams, 'subgenre', catalogState.subgenre, aliasOptions);
    setCatalogUrlParam(searchParams, 'format', catalogState.format, aliasOptions);
    setCatalogUrlParam(searchParams, 'country', catalogState.country, aliasOptions);
    setCatalogUrlParam(searchParams, 'year_from', catalogState.yearFrom, aliasOptions);
    setCatalogUrlParam(searchParams, 'year_to', catalogState.yearTo, aliasOptions);
    setCatalogUrlParam(searchParams, 'rating_from', catalogState.ratingFrom, aliasOptions);
    setCatalogUrlParam(searchParams, 'rating_to', catalogState.ratingTo, aliasOptions);
    setCatalogUrlParam(searchParams, 'runtime_from', catalogState.runtimeFrom, aliasOptions);
    setCatalogUrlParam(searchParams, 'runtime_to', catalogState.runtimeTo, aliasOptions);

    if (catalogState.withReviews) {
      searchParams.set('reviews', '1');
    }

    if (hasCurrentUser) {
      setCatalogUrlParam(searchParams, 'watchlist', catalogState.watchlist, aliasOptions);
      setCatalogUrlParam(searchParams, 'watched', catalogState.watched, aliasOptions);
    }
  }

  if (catalogState.sortMode && catalogState.sortMode !== 'default') {
    searchParams.set('sort', catalogState.sortMode);
  }

  if (catalogState.viewMode && catalogState.viewMode !== 'list') {
    searchParams.set('view', catalogState.viewMode);
  }

  if (Number(catalogState.page) > 1) {
    searchParams.set('page', String(Math.max(1, Number(catalogState.page) || 1)));
  }

  if (profileHandle && profileActivityKey) {
    searchParams.set(profileQueryParam, profileHandle);
    searchParams.set(profileActivityQueryParam, profileActivityKey);
  }

  return searchParams;
}

export {
  createCatalogUrlValueAliasLookups,
  getCatalogUrlSearchParamsFromState,
  getCatalogUrlValueAlias,
  getCatalogUrlValueByAlias,
  hasCatalogUrlStateParams,
  readCatalogUrlState
};
