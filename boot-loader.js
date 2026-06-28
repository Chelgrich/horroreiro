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
    let stylesheetFallbackTimer = null;

    const localDevEnv = {
      SUPABASE_URL: 'https://uogzcozbnosfguyfbvhe.supabase.co',
      SUPABASE_ANON_KEY: 'sb_publishable_trS_-TlQwFqcM59nELIdsw_ygVI6B0j',
      APP_BUILD_VERSION: 'dev-local-25'
    };

    function getVersionedAssetUrl(src, buildVersion) {
      const assetPath = window.location.protocol === 'file:' ? src : `/${src}`;

      return `${assetPath}?v=${encodeURIComponent(buildVersion)}`;
    }

    function finishEnvReady() {
      if (isEnvReadyResolved) {
        return;
      }

      isEnvReadyResolved = true;
      window.clearTimeout(stylesheetFallbackTimer);
      document.documentElement.classList.remove('app-load-failed');
      document.documentElement.classList.add('app-ready');
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
      const stylesheet = document.createElement('link');

      stylesheet.rel = 'stylesheet';
      stylesheet.href = getVersionedAssetUrl('styles.css', buildVersion);
      stylesheet.onload = finishEnvReady;
      stylesheet.onerror = markStylesheetFailure;
      document.head.appendChild(stylesheet);

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
