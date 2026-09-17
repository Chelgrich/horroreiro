(function () {
  const DOM_SNAPSHOT_KEY = 'horroreiro_movie_page_dom_snapshot';
  const DOM_SNAPSHOTS_KEY = 'horroreiro_movie_page_dom_snapshots';
  const APP_VERSION_STORAGE_KEY = 'horroreiro_app_build_version';
  const DATA_DEPENDENCY_STAMPS_KEY = 'horroreiro_data_dependency_stamps';
  const MOVIE_PAGE_DOM_SNAPSHOT_VERSION = 1;
  const MOVIE_PAGE_DOM_SNAPSHOT_MAX_AGE_MS = 30 * 60 * 1000;
  const WINDOW_SCROLL_INTENT_VERSION_KEY = '__HORROREIRO_SCROLL_INTENT_VERSION__';
  const WINDOW_LAST_USER_SCROLL_Y_KEY = '__HORROREIRO_LAST_USER_SCROLL_Y__';
  const WINDOW_SCROLL_INTENT_TRACKER_BOUND_KEY = '__HORROREIRO_SCROLL_INTENT_TRACKER_BOUND__';
  const WINDOW_WARM_START_SCROLL_INTENT_BASELINE_KEY = '__HORROREIRO_WARM_START_SCROLL_INTENT_BASELINE__';
  const WINDOW_SCROLL_KEYS = new Set([' ', 'Spacebar', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End']);

  function getStorageValue(storage, key) {
    try {
      return storage?.getItem?.(key) ?? null;
    } catch (error) {
      return null;
    }
  }

  function parseJson(value) {
    try {
      return value ? JSON.parse(value) : null;
    } catch (error) {
      return null;
    }
  }

  function getWindowScrollIntentVersion() {
    return Number(window[WINDOW_SCROLL_INTENT_VERSION_KEY] || 0);
  }

  function markWindowScrollIntent() {
    window[WINDOW_SCROLL_INTENT_VERSION_KEY] = getWindowScrollIntentVersion() + 1;
    window[WINDOW_LAST_USER_SCROLL_Y_KEY] = Math.max(0, Math.round(window.scrollY || window.pageYOffset || 0));
  }

  function isEditableScrollIntentTarget(target) {
    return Boolean(target?.closest?.('input, textarea, select, [contenteditable="true"]'));
  }

  function handleWindowScrollIntentKeydown(event) {
    if (!WINDOW_SCROLL_KEYS.has(event.key) || isEditableScrollIntentTarget(event.target)) {
      return;
    }

    markWindowScrollIntent();
  }

  function handleWindowScrollAfterIntent() {
    if (getWindowScrollIntentVersion() <= 0) {
      return;
    }

    window[WINDOW_LAST_USER_SCROLL_Y_KEY] = Math.max(0, Math.round(window.scrollY || window.pageYOffset || 0));
  }

  function bindWarmStartScrollIntentTracker() {
    if (window[WINDOW_SCROLL_INTENT_TRACKER_BOUND_KEY]) {
      return;
    }

    window[WINDOW_SCROLL_INTENT_TRACKER_BOUND_KEY] = true;
    window.addEventListener('wheel', markWindowScrollIntent, { passive: true, capture: true });
    window.addEventListener('touchstart', markWindowScrollIntent, { passive: true, capture: true });
    window.addEventListener('touchmove', markWindowScrollIntent, { passive: true, capture: true });
    window.addEventListener('pointerdown', markWindowScrollIntent, { passive: true, capture: true });
    window.addEventListener('keydown', handleWindowScrollIntentKeydown, { capture: true });
    window.addEventListener('scroll', handleWindowScrollAfterIntent, { passive: true });
  }

  function getCurrentBuildVersion() {
    return String(
      window.__ENV__?.APP_BUILD_VERSION ||
      getStorageValue(localStorage, APP_VERSION_STORAGE_KEY) ||
      ''
    );
  }

  function normalizeRouteKeyValue(value) {
    return decodeURIComponent(String(value || '')).trim();
  }

  function getCurrentMovieRouteKeys() {
    const routeKeys = [];
    const searchParams = new URLSearchParams(window.location.search || '');
    const pathSlugMatch = window.location.pathname.match(/\/movie\/([^/]+)\/?$/);
    const pathSlug = normalizeRouteKeyValue(pathSlugMatch ? pathSlugMatch[1] : '');
    const querySlug = normalizeRouteKeyValue(searchParams.get('slug') || '');
    const queryId = normalizeRouteKeyValue(searchParams.get('id') || '');

    if (pathSlug) {
      routeKeys.push(`slug:${pathSlug}`);
    }

    if (querySlug) {
      routeKeys.push(`slug:${querySlug}`);
    }

    if (queryId) {
      routeKeys.push(`id:${queryId}`);
    }

    return [...new Set(routeKeys)];
  }

  function readDependencyStamps() {
    const parsedValue = parseJson(getStorageValue(localStorage, DATA_DEPENDENCY_STAMPS_KEY));

    return (
      parsedValue &&
      typeof parsedValue === 'object' &&
      !Array.isArray(parsedValue)
    )
      ? parsedValue
      : {};
  }

  function isDependencySnapshotFresh(snapshot) {
    if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
      return true;
    }

    const stamps = readDependencyStamps();

    return Object.entries(snapshot).every(([key, stamp]) => (
      String(stamps[key] || '') === String(stamp || '')
    ));
  }

  function hasMatchingRoute(snapshot) {
    const currentRouteKeys = getCurrentMovieRouteKeys();
    const snapshotRouteKeys = Array.isArray(snapshot?.routeKeys) ? snapshot.routeKeys : [];

    return currentRouteKeys.some(routeKey => snapshotRouteKeys.includes(routeKey));
  }

  function isUsableMovieDomSnapshot(snapshot) {
    const savedAt = Number(snapshot?.savedAt || 0);
    const age = Date.now() - savedAt;
    const currentBuildVersion = getCurrentBuildVersion();

    return Boolean(
      snapshot &&
      snapshot.version === MOVIE_PAGE_DOM_SNAPSHOT_VERSION &&
      (!currentBuildVersion || String(snapshot.buildVersion || '') === currentBuildVersion) &&
      typeof snapshot.moviePageHtml === 'string' &&
      snapshot.moviePageHtml.trim() &&
      Number.isFinite(age) &&
      age <= MOVIE_PAGE_DOM_SNAPSHOT_MAX_AGE_MS &&
      hasMatchingRoute(snapshot) &&
      isDependencySnapshotFresh(snapshot.dataDependencySnapshot)
    );
  }

  function findUsableMovieDomSnapshot() {
    const routeKeys = getCurrentMovieRouteKeys();
    const snapshotsMap = parseJson(getStorageValue(sessionStorage, DOM_SNAPSHOTS_KEY));

    if (snapshotsMap && typeof snapshotsMap === 'object' && !Array.isArray(snapshotsMap)) {
      for (const routeKey of routeKeys) {
        const snapshot = snapshotsMap[routeKey];

        if (isUsableMovieDomSnapshot(snapshot)) {
          return snapshot;
        }
      }
    }

    const fallbackSnapshot = parseJson(getStorageValue(sessionStorage, DOM_SNAPSHOT_KEY));

    return isUsableMovieDomSnapshot(fallbackSnapshot)
      ? fallbackSnapshot
      : null;
  }

  function warmStartMoviePage() {
    if (document.body?.dataset?.appPage !== 'movie') {
      return;
    }

    const snapshot = findUsableMovieDomSnapshot();

    if (!snapshot) {
      return;
    }

    const moviePage = document.getElementById('moviePage');

    if (!moviePage) {
      return;
    }

    moviePage.innerHTML = snapshot.moviePageHtml;
    document.documentElement.classList.add('app-movie-warm-started');
    document.documentElement.classList.add('movie-page-rendered');
    bindWarmStartScrollIntentTracker();
    window[WINDOW_WARM_START_SCROLL_INTENT_BASELINE_KEY] = getWindowScrollIntentVersion();
    window.__HORROREIRO_MOVIE_WARM_START__ = {
      didStart: true,
      movieId: snapshot.movieId || '',
      savedAt: snapshot.savedAt
    };
  }

  warmStartMoviePage();
})();
