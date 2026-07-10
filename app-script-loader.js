(function () {
  const envReadyPromise = window.__ENV_READY__ || Promise.resolve();
  const page = document.body?.dataset?.appPage || '';
  const needsCustomSelect = page === 'catalog' || page === 'movie';
  let isAppStarted = false;

  function getVersionedScriptUrl(src, buildVersion) {
    const isLocalFile = window.location.protocol === 'file:';
    const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocalFile || isLocalHost) {
      const assetPath = isLocalFile ? src : `/${src}`;

      return `${assetPath}?v=${encodeURIComponent(buildVersion)}`;
    }

    return `/app-assets/${encodeURIComponent(buildVersion)}?file=${encodeURIComponent(src)}`;
  }

  function loadScript(src, buildVersion) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');

      script.src = getVersionedScriptUrl(src, buildVersion);
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  function mountSharedLayout() {
    window.SharedLayout?.mountSharedHeader();
    window.SharedLayout?.mountSharedAuthModal();
    window.SharedLayout?.mountSharedDisplayNameModal();
    window.SharedLayout?.mountSharedFooter();
  }

  function markAppScriptFailure(error) {
    console.error('Ошибка загрузки приложения:', error);

    if (isAppStarted) {
      return;
    }

    document.documentElement.classList.add('app-load-failed');
    document.documentElement.classList.remove('app-ready');
  }

  function markAppStarted() {
    isAppStarted = true;
    document.documentElement.classList.remove('app-load-failed');
    document.documentElement.classList.add('app-ready');
  }

  function runAppRuntime() {
    if (window.HorroreiroPageRuntime?.run && window.HorroreiroApp) {
      return window.HorroreiroPageRuntime.run(window.HorroreiroApp, {
        onShellReady: markAppStarted
      });
    }

    if (window.HorroreiroApp?.init) {
      markAppStarted();
      return window.HorroreiroApp.init();
    }

    throw new Error('Horroreiro app initializer is unavailable.');
  }

  function isAppStartupScriptUrl(filename) {
    const scriptUrl = String(filename || '');

    if (!scriptUrl) {
      return true;
    }

    if (scriptUrl.startsWith('chrome-extension:') || scriptUrl.startsWith('moz-extension:')) {
      return false;
    }

    return (
      scriptUrl.includes('/shared-layout.js') ||
      scriptUrl.includes('/custom-select.js') ||
      scriptUrl.includes('/app-page-runtime.js') ||
      scriptUrl.includes('/app.js') ||
      scriptUrl.includes(window.location.origin)
    );
  }

  window.addEventListener('error', event => {
    if (!isAppStartupScriptUrl(event.filename)) {
      return;
    }

    markAppScriptFailure(event.error || event.message);
  });

  window.addEventListener('unhandledrejection', event => {
    markAppScriptFailure(event.reason);
  });

  envReadyPromise
    .then(() => {
      const buildVersion = window.__ENV__?.APP_BUILD_VERSION || 'dev';

      const sharedLayoutPromise = loadScript('shared-layout.js', buildVersion);
      const pageRuntimePromise = loadScript('app-page-runtime.js', buildVersion);

      return sharedLayoutPromise
        .then(mountSharedLayout)
        .then(() => (needsCustomSelect ? loadScript('custom-select.js', buildVersion) : undefined))
        .then(() => pageRuntimePromise)
        .then(() => loadScript('app.js', buildVersion))
        .then(runAppRuntime);
    })
    .catch(markAppScriptFailure);
})();
