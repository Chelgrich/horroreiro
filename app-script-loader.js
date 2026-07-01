(function () {
  const envReadyPromise = window.__ENV_READY__ || Promise.resolve();
  const page = document.body?.dataset?.appPage || '';
  const needsCustomSelect = page === 'catalog' || page === 'movie';
  let isAppStarted = false;

  function loadScript(src, buildVersion) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const assetPath = window.location.protocol === 'file:' ? src : `/${src}`;

      script.src = `${assetPath}?v=${encodeURIComponent(buildVersion)}`;
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

  function normalizeRankBadgeText() {
    document.querySelectorAll('.user-page-stat-rank-number').forEach(badge => {
      const normalizedText = badge.textContent.trim().replace(/^#+\s*/, '');

      if (badge.textContent !== normalizedText) {
        badge.textContent = normalizedText;
      }
    });
  }

  function watchUserRankBadgeText() {
    const userPage = document.getElementById('userPage');

    if (page !== 'user') {
      return;
    }

    normalizeRankBadgeText();

    if (!userPage || !window.MutationObserver) {
      return;
    }

    const observer = new MutationObserver(normalizeRankBadgeText);
    observer.observe(userPage, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  function markAppScriptFailure(error) {
    if (isAppStarted) {
      return;
    }

    console.error('Ошибка загрузки приложения:', error);
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
      return window.HorroreiroPageRuntime.run(window.HorroreiroApp);
    }

    if (window.HorroreiroApp?.init) {
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

      return loadScript('shared-layout.js', buildVersion)
        .then(mountSharedLayout)
        .then(() => (needsCustomSelect ? loadScript('custom-select.js', buildVersion) : undefined))
        .then(() => loadScript('app-page-runtime.js', buildVersion))
        .then(() => loadScript('app.js', buildVersion))
        .then(runAppRuntime)
        .then(watchUserRankBadgeText)
        .then(markAppStarted);
    })
    .catch(markAppScriptFailure);
})();
