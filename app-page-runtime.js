(function () {
  const pageModules = {
    catalog: {
      run(app) {
        app.bindCatalogPageEvents();
        return app.initCatalogPage();
      }
    },
    user: {
      run(app) {
        return app.initUserPage();
      }
    },
    following: {
      run(app) {
        return app.initFollowingPage();
      }
    },
    notifications: {
      run(app) {
        return app.initNotificationsPage();
      }
    },
    movie: {
      run(app) {
        app.bindMoviePageEvents();
        return app.initMoviePage();
      }
    }
  };

  function getCurrentPage() {
    return String(document.body?.dataset?.appPage || '').trim();
  }

  async function run(app) {
    if (!app || typeof app.initSharedApp !== 'function') {
      throw new Error('Horroreiro app runtime is unavailable.');
    }

    const page = getCurrentPage();
    const pageModule = pageModules[page] || {
      run: () => app.initDetectedPage()
    };

    const shouldContinue = await app.initSharedApp();

    if (shouldContinue === false) {
      return;
    }

    await pageModule.run(app);
  }

  window.HorroreiroPageRuntime = {
    run
  };
})();
