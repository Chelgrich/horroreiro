export function createAuthSessionController(context) {
  const {
    supabaseClient, withAuthRequestTimeout, getCurrentUser, setCurrentSessionUser,
    loadCurrentSessionData, reloadUserCollections, hasPendingRecovery, isRecoveryEntryPage,
    clearLocalRecoverySession, onPasswordRecovery, trackEmailConfirmedLoginIfNeeded,
    scheduleTask = task => setTimeout(task, 0)
  } = context;
  let generation = 0;
  let isListenerBound = false;
  let afterSyncHandler = null;
  let sessionReady = Promise.resolve();
  let pendingPageRefresh = null;
  let isPageRefreshScheduled = false;

  function captureSession() {
    const version = generation;
    const userId = getCurrentUser()?.id;
    return { isCurrent: () => generation === version && getCurrentUser()?.id === userId };
  }

  function schedulePageRefresh() {
    if (!afterSyncHandler || pendingPageRefresh === null || isPageRefreshScheduled) return;
    isPageRefreshScheduled = true;
    scheduleTask(async () => {
      isPageRefreshScheduled = false;
      const version = pendingPageRefresh;
      pendingPageRefresh = null;
      if (version !== generation) return;
      try {
        await afterSyncHandler();
      } catch (error) {
        console.error('Auth page refresh failed:', error);
      }
    });
  }

  function scheduleSessionSync(version, { clearRecovery = false } = {}) {
    const isCurrent = () => version === generation;
    let resolveReady;
    sessionReady = new Promise(resolve => { resolveReady = resolve; });
    scheduleTask(async () => {
      let didSync = false;
      try {
        if (!isCurrent()) return;
        await loadCurrentSessionData(isCurrent);
        if (!isCurrent()) return;
        if (clearRecovery) await clearLocalRecoverySession();
        if (!isCurrent()) return;
        trackEmailConfirmedLoginIfNeeded();
        await reloadUserCollections();
        didSync = isCurrent();
      } catch (error) {
        if (isCurrent()) console.error('Auth state synchronization failed:', error);
      } finally {
        // Page handlers may restore the session themselves; readiness excludes that callback.
        resolveReady();
      }
      if (didSync) {
        pendingPageRefresh = version;
        schedulePageRefresh();
      }
    });
  }

  function bindSharedAuthStateListener({ onAfterAuthSync } = {}) {
    if (typeof onAfterAuthSync === 'function') afterSyncHandler = onAfterAuthSync;
    schedulePageRefresh();
    if (isListenerBound) return;
    supabaseClient.auth.onAuthStateChange((event, session) => {
      // Initial state comes from the coordinated getSession read.
      if (event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') return;
      const rejectRecovery = (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN' && hasPendingRecovery()) &&
        !isRecoveryEntryPage();
      if (event === 'PASSWORD_RECOVERY' || rejectRecovery) {
        const version = ++generation;
        setCurrentSessionUser(null);
        if (rejectRecovery) scheduleSessionSync(version, { clearRecovery: true });
        else {
          sessionReady = Promise.resolve();
          onPasswordRecovery();
        }
        return;
      }
      if ((session?.user?.id ?? null) === (getCurrentUser()?.id ?? null) && event !== 'SIGNED_OUT') return;
      const version = ++generation;
      setCurrentSessionUser(session?.user ?? null);
      // Keep API calls outside the SDK's synchronous auth event callback.
      scheduleSessionSync(version);
    });
    isListenerBound = true;
  }

  async function waitForLatestSession() {
    while (true) {
      const pending = sessionReady;
      await pending;
      if (pending === sessionReady) return getCurrentUser();
    }
  }

  async function restoreSession() {
    const version = ++generation;
    const isCurrent = () => version === generation;
    let resolveReady;
    sessionReady = new Promise(resolve => { resolveReady = resolve; });
    try {
      bindSharedAuthStateListener();
      let result;
      try {
        result = await withAuthRequestTimeout(
          supabaseClient.auth.getSession(),
          'Не удалось восстановить сессию. Проверь соединение и обнови страницу.'
        );
        if (!isCurrent()) return waitForLatestSession();
        if (result.error) throw result.error;
      } catch (error) {
        if (!isCurrent()) return waitForLatestSession();
        console.error('Session restoration failed:', error);
        setCurrentSessionUser(null);
        await loadCurrentSessionData(isCurrent);
        return isCurrent() ? null : waitForLatestSession();
      }
      const user = result.data?.session?.user ?? null;
      if (user && hasPendingRecovery() && !isRecoveryEntryPage()) {
        setCurrentSessionUser(null);
        await loadCurrentSessionData(isCurrent);
        if (isCurrent()) await clearLocalRecoverySession();
        return isCurrent() ? null : waitForLatestSession();
      }
      setCurrentSessionUser(user);
      await loadCurrentSessionData(isCurrent);
      return isCurrent() ? user : waitForLatestSession();
    } finally {
      resolveReady();
    }
  }

  return { restoreSession, bindSharedAuthStateListener, captureSession };
}
