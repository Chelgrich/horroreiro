(function () {
  if (window.__ENV_READY__) {
    return;
  }

  window.__ENV_READY__ = new Promise(resolve => {
    const isLocalFile = window.location.protocol === 'file:';
    const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const shouldUseLocalDevEnv = isLocalFile || isLocalHost;
    let hasStartedStylesheetLoad = false;
    let isEnvReadyResolved = false;
    let envFallbackTimer = null;
    let appStartupFallbackTimer = null;
    let stylesheetFallbackTimer = null;

    const localDevEnv = {
      SUPABASE_URL: 'https://uogzcozbnosfguyfbvhe.supabase.co',
      SUPABASE_ANON_KEY: 'sb_publishable_trS_-TlQwFqcM59nELIdsw_ygVI6B0j',
      APP_BUILD_VERSION: 'dev-local-27'
    };
    const CATALOG_DOM_SNAPSHOT_KEY = 'horroreiro_catalog_dom_snapshot';
    const APP_VERSION_STORAGE_KEY = 'horroreiro_app_build_version';
    const STYLESHEET_CACHE_KEY = 'horroreiro_stylesheet_cache_v1';
    const STYLESHEET_CACHE_MAX_ENTRIES = 6;
    const STYLESHEET_CACHE_MAX_AGE_MS = 12 * 60 * 60 * 1000;
    const STYLESHEET_FALLBACK_TIMEOUT_MS = 30000;
    const APP_STARTUP_FALLBACK_TIMEOUT_MS = 60000;

    function getVersionedAssetUrl(src, buildVersion) {
      if (shouldUseLocalDevEnv) {
        return window.location.protocol === 'file:' ? src : `/${src}`;
      }

      return `/app-assets/${encodeURIComponent(buildVersion)}?file=${encodeURIComponent(src)}`;
    }

    function getCurrentAppPage() {
      const bodyPage = document.body?.dataset?.appPage || '';

      if (bodyPage) {
        return bodyPage;
      }

      const pathname = window.location.pathname || '/';
      const normalizedPathname = pathname.replace(/\/+$/, '') || '/';
      const filename = normalizedPathname.split('/').pop() || '';

      if (normalizedPathname === '/' || filename === 'index.html') {
        return 'catalog';
      }

      if (normalizedPathname.startsWith('/movie/') || filename === 'movie.html') {
        return 'movie';
      }

      if (normalizedPathname.startsWith('/name/') || filename === 'name.html') {
        return 'director';
      }

      if (normalizedPathname.startsWith('/company/') || filename === 'company.html') {
        return 'company';
      }

      if (normalizedPathname.startsWith('/user/') || filename === 'user.html') {
        return 'user';
      }

      if (normalizedPathname === '/following' || filename === 'following.html') {
        return 'following';
      }

      if (normalizedPathname === '/notifications' || filename === 'notifications.html') {
        return 'notifications';
      }

      if (normalizedPathname === '/editor' || filename === 'editor.html') {
        return 'editor';
      }

      if (normalizedPathname === '/directors' || filename === 'directors.html') {
        return 'directors';
      }

      if (
        normalizedPathname === '/production' ||
        normalizedPathname === '/distributors' ||
        normalizedPathname === '/russian-distributors' ||
        filename === 'companies.html' ||
        filename === 'production.html' ||
        filename === 'distributors.html' ||
        filename === 'russian-distributors.html'
      ) {
        return 'company-admin';
      }

      return '';
    }

    function markCatalogFastReturnStartupHint() {
      if (getCurrentAppPage() !== 'catalog') {
        return;
      }

      try {
        if (
          window.sessionStorage?.getItem(CATALOG_DOM_SNAPSHOT_KEY)
        ) {
          document.documentElement.classList.add('app-catalog-fast-return-pending');
        }
      } catch (error) {
        // Session storage hints are optional; normal boot still handles the page.
      }
    }

    function getPageStylesheetAssets() {
      const page = getCurrentAppPage();
      const assets = ['styles.css'];
      const secondaryPageStylesheets = {
        following: ['secondary-pages.css', 'following-page.css'],
        notifications: ['secondary-pages.css', 'notifications-page.css'],
        editor: ['secondary-pages.css', 'editor-page.css'],
        director: ['secondary-pages.css', 'director-page.css', 'director-form.css'],
        directors: ['secondary-pages.css', 'directors-admin-page.css', 'director-form.css'],
        company: ['secondary-pages.css', 'company-page.css'],
        'company-admin': ['secondary-pages.css', 'company-page.css']
      };

      if (page === 'catalog') {
        assets.push('catalog-page.css');
      }

      if (page === 'movie') {
        assets.push('movie-page.css');
      }

      if (page === 'user') {
        assets.push('user-page.css');
      }

      if (secondaryPageStylesheets[page]) {
        assets.push(...secondaryPageStylesheets[page]);
      }

      return assets;
    }

    function parseJson(value) {
      try {
        return value ? JSON.parse(value) : null;
      } catch (error) {
        return null;
      }
    }

    function getStorageValue(storage, key) {
      try {
        return storage?.getItem?.(key) ?? '';
      } catch (error) {
        return '';
      }
    }

    function getStylesheetCacheId(buildVersion, assets) {
      return `${String(buildVersion || '')}::${assets.join('|')}`;
    }

    function readStylesheetCacheStore() {
      const store = parseJson(getStorageValue(sessionStorage, STYLESHEET_CACHE_KEY));

      return (
        store &&
        store.version === 1 &&
        store.entries &&
        typeof store.entries === 'object' &&
        !Array.isArray(store.entries)
      )
        ? store
        : { version: 1, entries: {} };
    }

    function writeStylesheetCacheStore(store) {
      try {
        const entries = Object.entries(store.entries || {})
          .sort((first, second) => Number(second[1]?.savedAt || 0) - Number(first[1]?.savedAt || 0))
          .slice(0, STYLESHEET_CACHE_MAX_ENTRIES);

        sessionStorage.setItem(
          STYLESHEET_CACHE_KEY,
          JSON.stringify({
            version: 1,
            entries: Object.fromEntries(entries)
          })
        );
      } catch (error) {
        try {
          sessionStorage.removeItem(STYLESHEET_CACHE_KEY);
        } catch (removeError) {
          // Stylesheet cache is only a warm-start acceleration path.
        }
      }
    }

    function hasCompleteStylesheetCacheEntry(entry, buildVersion, assets) {
      const savedAt = Number(entry?.savedAt || 0);
      const age = Date.now() - savedAt;

      return Boolean(
        entry &&
        String(entry.buildVersion || '') === String(buildVersion || '') &&
        Array.isArray(entry.assets) &&
        entry.assets.join('|') === assets.join('|') &&
        entry.cssTextByAsset &&
        typeof entry.cssTextByAsset === 'object' &&
        !Array.isArray(entry.cssTextByAsset) &&
        Number.isFinite(age) &&
        age >= 0 &&
        age <= STYLESHEET_CACHE_MAX_AGE_MS &&
        assets.every(assetName => typeof entry.cssTextByAsset[assetName] === 'string' && entry.cssTextByAsset[assetName])
      );
    }

    function removeCachedStylesheets() {
      document.querySelectorAll('style[data-horroreiro-style-cache="true"]').forEach(element => {
        element.remove();
      });
    }

    function applyCachedStylesheets() {
      const buildVersion = getStorageValue(localStorage, APP_VERSION_STORAGE_KEY);

      if (!buildVersion) {
        return false;
      }

      const assets = getPageStylesheetAssets();
      const store = readStylesheetCacheStore();
      const cacheId = getStylesheetCacheId(buildVersion, assets);
      const entry = store.entries[cacheId];

      if (!hasCompleteStylesheetCacheEntry(entry, buildVersion, assets)) {
        return false;
      }

      removeCachedStylesheets();
      assets.forEach(assetName => {
        const style = document.createElement('style');

        style.dataset.horroreiroStyleCache = 'true';
        style.dataset.asset = assetName;
        style.textContent = entry.cssTextByAsset[assetName];
        document.head.appendChild(style);
      });
      document.documentElement.classList.add('app-styles-ready');
      return true;
    }

    function cacheLoadedStylesheets(buildVersion, assets, stylesheetLinks) {
      if (!buildVersion || !assets.length || !stylesheetLinks.length) {
        return;
      }

      Promise.all(
        assets.map((assetName, index) => {
          const href = stylesheetLinks[index]?.href;

          if (!href) {
            throw new Error('Missing stylesheet href.');
          }

          return fetch(href, { cache: 'force-cache' })
            .then(response => {
              if (!response.ok) {
                throw new Error(`Stylesheet fetch failed: ${response.status}`);
              }

              return response.text();
            })
            .then(cssText => [assetName, cssText]);
        })
      )
        .then(entries => {
          const store = readStylesheetCacheStore();
          const cacheId = getStylesheetCacheId(buildVersion, assets);

          store.entries[cacheId] = {
            buildVersion,
            assets,
            savedAt: Date.now(),
            cssTextByAsset: Object.fromEntries(entries)
          };
          writeStylesheetCacheStore(store);
        })
        .catch(() => {
          // The live stylesheets already loaded; cache misses only affect later warm starts.
        });
    }

    markCatalogFastReturnStartupHint();
    const hasAppliedCachedStylesheets = applyCachedStylesheets();

    function finishEnvReady() {
      if (isEnvReadyResolved) {
        return;
      }

      isEnvReadyResolved = true;
      window.clearTimeout(stylesheetFallbackTimer);
      document.documentElement.classList.remove('app-load-failed');
      document.documentElement.classList.add('app-styles-ready');
      appStartupFallbackTimer = window.setTimeout(() => {
        if (!document.documentElement.classList.contains('app-ready')) {
          document.documentElement.classList.add('app-load-failed');
        }
      }, APP_STARTUP_FALLBACK_TIMEOUT_MS);
      resolve();
    }

    function markStylesheetFailure() {
      if (isEnvReadyResolved) {
        return;
      }

      if (hasAppliedCachedStylesheets) {
        finishEnvReady();
        return;
      }

      document.documentElement.classList.add('app-load-failed');
    }

    function getRetryStylesheetUrl(href) {
      try {
        const url = new URL(href, window.location.href);

        url.searchParams.set('_retry', Date.now().toString(36));
        return url.href;
      } catch (error) {
        const separator = String(href || '').includes('?') ? '&' : '?';

        return `${href}${separator}_retry=${Date.now().toString(36)}`;
      }
    }

    function applyEnvAndLoadStyles() {
      if (hasStartedStylesheetLoad) {
        return;
      }

      hasStartedStylesheetLoad = true;
      window.clearTimeout(envFallbackTimer);

      const buildVersion = window.__ENV__?.APP_BUILD_VERSION || 'dev';
      const stylesheetAssets = getPageStylesheetAssets();
      const stylesheetLinks = [];
      let pendingStylesheets = stylesheetAssets.length;
      const failedStylesheetAssets = new Set();
      const settledStylesheets = new WeakSet();

      const settleStylesheet = (stylesheet, { failed = false } = {}) => {
        if (settledStylesheets.has(stylesheet)) {
          return;
        }

        settledStylesheets.add(stylesheet);

        if (failed) {
          failedStylesheetAssets.add(stylesheet?.dataset?.asset || stylesheet?.href || 'stylesheet');
        }

        pendingStylesheets -= 1;

        if (pendingStylesheets > 0) {
          return;
        }

        if (failedStylesheetAssets.size === 0) {
          cacheLoadedStylesheets(buildVersion, stylesheetAssets, stylesheetLinks);
          removeCachedStylesheets();
          finishEnvReady();
          return;
        }

        if (hasAppliedCachedStylesheets) {
          finishEnvReady();
          return;
        }

        markStylesheetFailure();
      };

      const handleStylesheetLoad = event => {
        settleStylesheet(event?.currentTarget || event?.target);
      };

      const handleStylesheetError = event => {
        const stylesheet = event?.currentTarget || event?.target;
        const retryCount = Number(stylesheet?.dataset?.retryCount || 0);

        if (stylesheet && retryCount < 1) {
          stylesheet.dataset.retryCount = '1';
          stylesheet.href = getRetryStylesheetUrl(stylesheet.href);
          return;
        }

        settleStylesheet(stylesheet, { failed: true });
      };

      stylesheetAssets.forEach(assetName => {
        const stylesheet = document.createElement('link');

        stylesheet.rel = 'stylesheet';
        stylesheet.dataset.asset = assetName;
        stylesheet.href = getVersionedAssetUrl(assetName, buildVersion);
        stylesheet.onload = handleStylesheetLoad;
        stylesheet.onerror = handleStylesheetError;
        stylesheetLinks.push(stylesheet);
        document.head.appendChild(stylesheet);
      });

      stylesheetFallbackTimer = window.setTimeout(markStylesheetFailure, STYLESHEET_FALLBACK_TIMEOUT_MS);
    }

    function applyFallbackEnvAndLoadStyles() {
      if (!window.__ENV__) {
        window.__ENV__ = localDevEnv;
      }

      applyEnvAndLoadStyles();
    }

    if (shouldUseLocalDevEnv) {
      window.__ENV__ = localDevEnv;
      applyEnvAndLoadStyles();
      return;
    }

    const envScript = document.createElement('script');
    envScript.src = '/env';
    envScript.onload = applyEnvAndLoadStyles;
    envScript.onerror = applyFallbackEnvAndLoadStyles;
    envFallbackTimer = window.setTimeout(applyFallbackEnvAndLoadStyles, 2500);

    document.head.appendChild(envScript);
  });
})();
