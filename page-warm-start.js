(function () {
  const SECONDARY_PAGE_DOM_SNAPSHOTS_KEY = 'horroreiro_page_dom_snapshots_v1';
  const APP_VERSION_STORAGE_KEY = 'horroreiro_app_build_version';
  const DATA_MUTATION_STAMP_KEY = 'horroreiro_data_mutation_stamp';
  const DATA_DEPENDENCY_STAMPS_KEY = 'horroreiro_data_dependency_stamps';
  const SECONDARY_PAGE_DOM_SNAPSHOT_VERSION = 1;
  const SECONDARY_PAGE_DOM_SNAPSHOT_MAX_AGE_MS = 30 * 60 * 1000;
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
    window.__HORROREIRO_PAGE_WARM_START__ = {
      didStart: true,
      page: snapshot.page,
      routeKey: snapshot.routeKey,
      savedAt: snapshot.savedAt
    };

    const scrollY = Number(snapshot.scrollY || 0);

    if (Number.isFinite(scrollY) && scrollY > 0) {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    }
  }

  warmStartPage();
})();
