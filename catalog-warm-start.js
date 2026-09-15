(function () {
  const FAST_RETURN_KEY = 'horroreiro_catalog_fast_return_pending';
  const DOM_SNAPSHOT_KEY = 'horroreiro_catalog_dom_snapshot';
  const DATA_MUTATION_STAMP_KEY = 'horroreiro_data_mutation_stamp';
  const APP_VERSION_STORAGE_KEY = 'horroreiro_app_build_version';
  const CATALOG_SNAPSHOT_VERSION = 9;
  const CATALOG_SNAPSHOT_MAX_AGE_MS = 30 * 60 * 1000;
  const CATALOG_SCROLL_POSITION_KEY = 'horroreiro_catalog_scroll_position';
  const CATALOG_ANCHOR_MOVIE_ID_KEY = 'horroreiro_catalog_anchor_movie_id';

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

  function getStoredSupabaseUserId() {
    try {
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);

        if (!key || !/^sb-.+-auth-token$/.test(key)) {
          continue;
        }

        const authData = parseJson(localStorage.getItem(key));
        const userId = authData?.user?.id || authData?.currentSession?.user?.id;

        if (userId) {
          return String(userId);
        }
      }
    } catch (error) {
      return '';
    }

    return '';
  }

  function hasFreshLocalDataStamp(snapshot) {
    return String(snapshot?.dataMutationStamp || '') === String(
      getStorageValue(localStorage, DATA_MUTATION_STAMP_KEY) || ''
    );
  }

  function hasMatchingKnownUser(snapshot) {
    const snapshotUserId = String(snapshot?.userId || '');

    if (!snapshotUserId) {
      return true;
    }

    const storedUserId = getStoredSupabaseUserId();

    return Boolean(storedUserId && storedUserId === snapshotUserId);
  }

  function hasMatchingKnownBuild(snapshot) {
    const currentBuildVersion = String(window.__ENV__?.APP_BUILD_VERSION || '');
    const storedBuildVersion = String(getStorageValue(localStorage, APP_VERSION_STORAGE_KEY) || '');
    const knownBuildVersion = currentBuildVersion || storedBuildVersion;

    return !knownBuildVersion || String(snapshot?.buildVersion || '') === knownBuildVersion;
  }

  function isUsableCatalogDomSnapshot(snapshot) {
    const savedAt = Number(snapshot?.savedAt || 0);
    const age = Date.now() - savedAt;

    return Boolean(
      snapshot &&
      snapshot.version === CATALOG_SNAPSHOT_VERSION &&
      snapshot.viewMode === 'list' &&
      typeof snapshot.containerHtml === 'string' &&
      snapshot.containerHtml.trim() &&
      Number.isFinite(age) &&
      age <= CATALOG_SNAPSHOT_MAX_AGE_MS &&
      hasFreshLocalDataStamp(snapshot) &&
      hasMatchingKnownUser(snapshot) &&
      hasMatchingKnownBuild(snapshot)
    );
  }

  function isBackForwardNavigation() {
    try {
      const navigationEntry = performance.getEntriesByType?.('navigation')?.[0];

      return navigationEntry?.type === 'back_forward';
    } catch (error) {
      return false;
    }
  }

  function restoreHtml(id, html, hidden) {
    const element = document.getElementById(id);

    if (!element) {
      return;
    }

    if (typeof html === 'string') {
      element.innerHTML = html;
    }

    if (typeof hidden === 'boolean') {
      element.hidden = hidden;
    }
  }

  function restoreResultCount(snapshot) {
    const resultCount = document.getElementById('moviesResultCount');

    if (!resultCount || !snapshot.moviesResultCountText) {
      return;
    }

    resultCount.textContent = snapshot.moviesResultCountText;
    resultCount.hidden = false;
  }

  function restoreMoviesSectionHeader(snapshot) {
    const moviesSectionHeader = document.querySelector('.movies-section-header');

    if (
      !moviesSectionHeader ||
      typeof snapshot.moviesSectionHeaderHtml !== 'string' ||
      !snapshot.moviesSectionHeaderHtml.trim()
    ) {
      return;
    }

    moviesSectionHeader.innerHTML = snapshot.moviesSectionHeaderHtml;
  }

  function restoreActiveFilters(snapshot) {
    const activeFiltersBar = document.getElementById('activeFiltersBar');

    if (!activeFiltersBar || typeof snapshot.activeFiltersHtml !== 'string') {
      return;
    }

    activeFiltersBar.innerHTML = snapshot.activeFiltersHtml;
    activeFiltersBar.classList.toggle('is-visible', Boolean(snapshot.activeFiltersVisible));
  }

  function restoreQuickPresets(snapshot) {
    const quickPresetsBar = document.getElementById('quickPresetsBar');

    if (!quickPresetsBar || typeof snapshot.quickPresetsHtml !== 'string') {
      return;
    }

    quickPresetsBar.innerHTML = snapshot.quickPresetsHtml;

    const scrollLeft = Number(snapshot.quickPresetsScrollLeft || 0);

    if (!Number.isFinite(scrollLeft) || scrollLeft <= 0) {
      return;
    }

    requestAnimationFrame(() => {
      quickPresetsBar.scrollLeft = scrollLeft;
    });
  }

  function restoreCatalogScroll() {
    const anchorMovieId = getStorageValue(sessionStorage, CATALOG_ANCHOR_MOVIE_ID_KEY);
    const scrollPosition = getStorageValue(sessionStorage, CATALOG_SCROLL_POSITION_KEY);

    const restore = () => {
      if (anchorMovieId) {
        const anchorCard = Array
          .from(document.querySelectorAll('.movie-card[data-movie-id]'))
          .find(card => String(card.dataset.movieId || '') === String(anchorMovieId));

        if (anchorCard) {
          anchorCard.scrollIntoView({ block: 'start' });
        }

        return;
      }

      const scrollY = Number(scrollPosition);

      if (Number.isFinite(scrollY) && scrollY >= 0) {
        window.scrollTo(0, scrollY);
      }
    };

    requestAnimationFrame(() => {
      restore();
      requestAnimationFrame(restore);
    });
  }

  function warmStartCatalog() {
    if (document.body?.dataset?.appPage !== 'catalog') {
      return;
    }

    if (
      getStorageValue(sessionStorage, FAST_RETURN_KEY) !== '1' &&
      !isBackForwardNavigation()
    ) {
      return;
    }

    const snapshot = parseJson(getStorageValue(sessionStorage, DOM_SNAPSHOT_KEY));

    if (!isUsableCatalogDomSnapshot(snapshot)) {
      return;
    }

    const moviesContainer = document.getElementById('movies');

    if (!moviesContainer) {
      return;
    }

    moviesContainer.innerHTML = snapshot.containerHtml;
    moviesContainer.removeAttribute('aria-busy');
    restoreMoviesSectionHeader(snapshot);
    restoreResultCount(snapshot);
    restoreActiveFilters(snapshot);
    restoreQuickPresets(snapshot);
    restoreHtml('catalogPaginationTop', snapshot.paginationTopHtml, snapshot.paginationTopHidden);
    restoreHtml('catalogPaginationBottom', snapshot.paginationBottomHtml, snapshot.paginationBottomHidden);
    document.documentElement.classList.add('app-catalog-warm-started');
    window.__HORROREIRO_CATALOG_WARM_START__ = {
      didStart: true,
      savedAt: snapshot.savedAt
    };
    restoreCatalogScroll();
  }

  warmStartCatalog();
})();
