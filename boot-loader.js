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

      return '';
    }

    function getPageStylesheetAssets() {
      const page = getCurrentAppPage();
      const assets = ['styles.css'];
      const secondaryPageStylesheets = {
        following: ['secondary-pages.css', 'following-page.css'],
        notifications: ['secondary-pages.css', 'notifications-page.css'],
        editor: ['secondary-pages.css', 'editor-page.css'],
        director: ['secondary-pages.css', 'director-page.css', 'director-form.css'],
        directors: ['secondary-pages.css', 'directors-admin-page.css', 'director-form.css']
      };

      if (page === 'catalog') {
        assets.push('catalog-page.css');
      }

      if (page === 'movie') {
        assets.push('movie-page.css');
      }

      if (secondaryPageStylesheets[page]) {
        assets.push(...secondaryPageStylesheets[page]);
      }

      return assets;
    }

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
      }, 20000);
      resolve();
    }

    function markStylesheetFailure() {
      if (isEnvReadyResolved) {
        return;
      }

      document.documentElement.classList.add('app-load-failed');
    }

    function applyEnvAndLoadStyles() {
      if (hasStartedStylesheetLoad) {
        return;
      }

      hasStartedStylesheetLoad = true;
      window.clearTimeout(envFallbackTimer);

      const buildVersion = window.__ENV__?.APP_BUILD_VERSION || 'dev';
      const stylesheetAssets = getPageStylesheetAssets();
      let pendingStylesheets = stylesheetAssets.length;
      let hasFailedStylesheetLoad = false;

      const handleStylesheetLoad = () => {
        if (hasFailedStylesheetLoad) {
          return;
        }

        pendingStylesheets -= 1;

        if (pendingStylesheets <= 0) {
          finishEnvReady();
        }
      };

      const handleStylesheetError = () => {
        hasFailedStylesheetLoad = true;
        markStylesheetFailure();
      };

      stylesheetAssets.forEach(assetName => {
        const stylesheet = document.createElement('link');

        stylesheet.rel = 'stylesheet';
        stylesheet.href = getVersionedAssetUrl(assetName, buildVersion);
        stylesheet.onload = handleStylesheetLoad;
        stylesheet.onerror = handleStylesheetError;
        document.head.appendChild(stylesheet);
      });

      stylesheetFallbackTimer = window.setTimeout(markStylesheetFailure, 10000);
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
