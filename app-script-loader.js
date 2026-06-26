(function () {
  const envReadyPromise = window.__ENV_READY__ || Promise.resolve();
  const page = document.body?.dataset?.appPage || '';
  const needsCustomSelect = page === 'catalog' || page === 'movie';

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

  envReadyPromise
    .then(() => {
      const buildVersion = window.__ENV__?.APP_BUILD_VERSION || 'dev';

      return loadScript('shared-layout.js', buildVersion)
        .then(mountSharedLayout)
        .then(() => (needsCustomSelect ? loadScript('custom-select.js', buildVersion) : undefined))
        .then(() => loadScript('app.js', buildVersion))
        .then(watchUserRankBadgeText);
    })
    .catch(error => {
      console.error('Ошибка загрузки versioned scripts:', error);
    });
})();
