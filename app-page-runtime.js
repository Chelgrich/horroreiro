(function () {
  const pageModules = {
    catalog: {
      defersShellReady: true,
      run(app, runtimeOptions = {}) {
        app.bindCatalogPageEvents();
        return app.initCatalogPage(runtimeOptions);
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
    editor: {
      run(app) {
        return app.initEditorPage();
      }
    },
    director: {
      run(app) {
        return app.initDirectorPage();
      }
    },
    directors: {
      run(app) {
        return app.initDirectorsAdminPage();
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

  async function run(app, { onShellReady = null } = {}) {
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

    let didSignalShellReady = false;
    const signalShellReady = () => {
      if (didSignalShellReady || typeof onShellReady !== 'function') {
        return;
      }

      didSignalShellReady = true;
      onShellReady();
    };

    const pageRunResult = pageModule.run(app, {
      onShellReady: signalShellReady
    });

    if (!pageModule.defersShellReady) {
      signalShellReady();
    }

    await pageRunResult;
    signalShellReady();
  }

  window.HorroreiroPageRuntime = {
    run
  };
})();
