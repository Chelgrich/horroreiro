(function () {
  const SECONDARY_PAGE_DOM_SNAPSHOTS_KEY = 'horroreiro_page_dom_snapshots_v1';
  const APP_VERSION_STORAGE_KEY = 'horroreiro_app_build_version';
  const DATA_MUTATION_STAMP_KEY = 'horroreiro_data_mutation_stamp';
  const DATA_DEPENDENCY_STAMPS_KEY = 'horroreiro_data_dependency_stamps';
  const SECONDARY_PAGE_DOM_SNAPSHOT_VERSION = 1;
  const SECONDARY_PAGE_DOM_SNAPSHOT_MAX_AGE_MS = 30 * 60 * 1000;
  const WINDOW_SCROLL_INTENT_VERSION_KEY = '__HORROREIRO_SCROLL_INTENT_VERSION__';
  const WINDOW_LAST_USER_SCROLL_Y_KEY = '__HORROREIRO_LAST_USER_SCROLL_Y__';
  const WINDOW_SCROLL_INTENT_TRACKER_BOUND_KEY = '__HORROREIRO_SCROLL_INTENT_TRACKER_BOUND__';
  const WINDOW_WARM_START_SCROLL_INTENT_BASELINE_KEY = '__HORROREIRO_WARM_START_SCROLL_INTENT_BASELINE__';
  const WINDOW_SCROLL_KEYS = new Set([' ', 'Spacebar', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End']);
  const SECONDARY_PAGE_TYPES = new Set([
    'user',
    'following',
    'notifications',
    'editor',
    'director',
    'directors'
  ]);

  function getStorageValue(storage, key) {
    try {
      return storage?.getItem?.(key) ?? '';
    } catch (error) {
      return '';
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

  function hasWindowScrollIntentAfter(version) {
    return getWindowScrollIntentVersion() > Number(version || 0);
  }

  function getCurrentPage() {
    return String(document.body?.dataset?.appPage || '').trim();
  }

  function getCurrentRouteKey() {
    const page = getCurrentPage();
    const pathname = window.location.pathname || '/';
    const search = window.location.search || '';

    return `${page}:${pathname}${search}`;
  }

  function getCurrentBuildVersion() {
    return String(
      window.__ENV__?.APP_BUILD_VERSION ||
      getStorageValue(localStorage, APP_VERSION_STORAGE_KEY) ||
      ''
    );
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

  function hasMatchingKnownUser(snapshot) {
    const snapshotUserId = String(snapshot?.userId || '');
    const storedUserId = getStoredSupabaseUserId();

    return snapshotUserId === storedUserId;
  }

  function hasFreshLocalDataStamp(snapshot) {
    return String(snapshot?.dataMutationStamp || '') === String(
      getStorageValue(localStorage, DATA_MUTATION_STAMP_KEY) || ''
    );
  }

  function hasFreshLocalDependencySnapshot(snapshot) {
    return String(snapshot?.dataDependencyStamps || '') === String(
      getStorageValue(localStorage, DATA_DEPENDENCY_STAMPS_KEY) || ''
    );
  }

  function isUsableSnapshot(snapshot) {
    const currentBuildVersion = getCurrentBuildVersion();
    const savedAt = Number(snapshot?.savedAt || 0);
    const age = Date.now() - savedAt;

    return Boolean(
      snapshot &&
      snapshot.version === SECONDARY_PAGE_DOM_SNAPSHOT_VERSION &&
      SECONDARY_PAGE_TYPES.has(String(snapshot.page || '')) &&
      String(snapshot.page || '') === getCurrentPage() &&
      String(snapshot.routeKey || '') === getCurrentRouteKey() &&
      (!currentBuildVersion || String(snapshot.buildVersion || '') === currentBuildVersion) &&
      typeof snapshot.pageHtml === 'string' &&
      snapshot.pageHtml.trim() &&
      Number.isFinite(age) &&
      age >= 0 &&
      age <= SECONDARY_PAGE_DOM_SNAPSHOT_MAX_AGE_MS &&
      hasMatchingKnownUser(snapshot) &&
      hasFreshLocalDataStamp(snapshot) &&
      hasFreshLocalDependencySnapshot(snapshot)
    );
  }

  function findUsableSnapshot() {
    const page = getCurrentPage();

    if (!SECONDARY_PAGE_TYPES.has(page)) {
      return null;
    }

    const snapshotsMap = parseJson(getStorageValue(sessionStorage, SECONDARY_PAGE_DOM_SNAPSHOTS_KEY));

    if (!snapshotsMap || typeof snapshotsMap !== 'object' || Array.isArray(snapshotsMap)) {
      return null;
    }

    const snapshot = snapshotsMap[getCurrentRouteKey()];

    return isUsableSnapshot(snapshot)
      ? snapshot
      : null;
  }

  function warmStartPage() {
    const snapshot = findUsableSnapshot();

    if (!snapshot) {
      return;
    }

    const pageElement = document.querySelector('.page');

    if (!pageElement) {
      return;
    }

    pageElement.outerHTML = snapshot.pageHtml;
    document.documentElement.classList.add('app-page-warm-started');
    bindWarmStartScrollIntentTracker();
    const scrollIntentBaseline = getWindowScrollIntentVersion();
    window[WINDOW_WARM_START_SCROLL_INTENT_BASELINE_KEY] = scrollIntentBaseline;
    window.__HORROREIRO_PAGE_WARM_START__ = {
      didStart: true,
      page: snapshot.page,
      routeKey: snapshot.routeKey,
      savedAt: snapshot.savedAt
    };

    const scrollY = Number(snapshot.scrollY || 0);

    if (Number.isFinite(scrollY) && scrollY > 0) {
      requestAnimationFrame(() => {
        if (hasWindowScrollIntentAfter(scrollIntentBaseline)) {
          return;
        }

        window.scrollTo(0, scrollY);
      });
    }
  }

  warmStartPage();
})();
