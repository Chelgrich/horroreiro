export function createAuthUiController(context) {
  const { supabaseClient, withAuthRequestTimeout, getCurrentUser, captureSession,
    isValidDisplayNameValue, isDisplayNameAvailable, getReadableAuthErrorMessage,
    showToastMessage, clearToastMessage, showAppMessage, trackGoal,
    syncBodyScrollLock, closeAuthPopoverMenu, closeProfileSettings, onModeChanged
  } = context;
  const logoutMenuButton = document.getElementById('logoutMenuButton');
  const authModal = document.getElementById('authModal');
  const authModalBackdrop = document.getElementById('authModalBackdrop');
  const closeAuthModalButton = document.getElementById('closeAuthModalButton');
  const authModalTitle = document.getElementById('authModalTitle');
  const loginForm = document.getElementById('loginForm');
  const authFormLinks = document.getElementById('authFormLinks');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const registerNicknameInput = document.getElementById('registerNickname');
  const registerNicknameHint = document.getElementById('registerNicknameHint');
  const loginPasswordConfirm = document.getElementById('loginPasswordConfirm');
  const registerButton = document.getElementById('registerButton');
  const forgotPasswordButton = document.getElementById('forgotPasswordButton');
  const authToast = document.getElementById('authToast');
  const authMessage = document.getElementById('authMessage');
  let didConsumeEmailConfirmationRedirect = false;
  const EMAIL_CONFIRMATION_PENDING_KEY = 'horroreiro_email_confirmation_pending';
  const EMAIL_CONFIRMATION_TRACKED_KEY = 'horroreiro_email_confirmation_tracked';
  const PASSWORD_RECOVERY_PENDING_KEY = 'horroreiro_password_recovery_pending';
  const PASSWORD_RECOVERY_ACTION_PARAM = 'auth_action';
  const PASSWORD_RECOVERY_ACTION_VALUE = 'password-recovery';
  let isAuthModalOpen = false;
  let isAuthRegisterMode = false;
  let isPasswordRecoveryMode = false;
  let isPasswordRecoveryEntryPage = false;
  let authMessageTimer = null;
  let isAuthSubmitting = false;
  let operationVersion = 0;

  function invalidateOperation() {
    operationVersion += 1;
    setAuthSubmittingState(false);
  }

  function beginOperation() {
    const version = ++operationVersion;
    setAuthSubmittingState(true);
    return () => operationVersion === version;
  }

  function getAuthRedirectInfo(href = window.location.href) {
    const url = new URL(href);
    const searchParams = url.searchParams;
    const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));
    const getParam = name => searchParams.get(name) || hashParams.get(name) || '';
    const type = getParam('type');
    const authAction = getParam(PASSWORD_RECOVERY_ACTION_PARAM);
    const code = getParam('code');
    const tokenHash = getParam('token_hash');
    const accessToken = getParam('access_token');
    const refreshToken = getParam('refresh_token');
    const error = getParam('error') || getParam('error_code');
    const errorDescription = getParam('error_description');
    const hasPendingRecovery = Boolean(localStorage.getItem(PASSWORD_RECOVERY_PENDING_KEY));
    const hasPendingEmailConfirmation = Boolean(localStorage.getItem(EMAIL_CONFIRMATION_PENDING_KEY));
    const hasAuthReturnParams = Boolean(
      code ||
      tokenHash ||
      accessToken ||
      refreshToken ||
      error ||
      errorDescription
    );
    const normalizedType = String(type || '').toLowerCase();
    const normalizedAuthAction = String(authAction || '').toLowerCase();
    const isRecovery = (
      normalizedType === 'recovery' ||
      normalizedAuthAction === PASSWORD_RECOVERY_ACTION_VALUE ||
      (hasPendingRecovery && hasAuthReturnParams)
    );
    const isEmailConfirmation = (
      normalizedType === 'signup' ||
      normalizedType === 'email' ||
      normalizedType === 'email_change' ||
      (tokenHash && !isRecovery) ||
      (hasPendingEmailConfirmation && hasAuthReturnParams && !isRecovery)
    );

    return {
      type: normalizedType,
      authAction: normalizedAuthAction,
      code,
      tokenHash,
      accessToken,
      refreshToken,
      error,
      errorDescription,
      hasAuthReturnParams,
      isRecovery,
      isEmailConfirmation
    };
  }

  function isEmailConfirmationRedirect() {
    return getAuthRedirectInfo().isEmailConfirmation || didConsumeEmailConfirmationRedirect;
  }

  function getPasswordRecoveryRedirectUrl() {
    const url = new URL('/', window.location.origin);

    url.searchParams.set(PASSWORD_RECOVERY_ACTION_PARAM, PASSWORD_RECOVERY_ACTION_VALUE);

    return url.toString();
  }

  function clearEmailConfirmationParamsFromUrl() {
    const url = new URL(window.location.href);
    let wasChanged = false;
    const authParamNames = [
      'type',
      'token_hash',
      'code',
      'access_token',
      'refresh_token',
      'expires_at',
      'expires_in',
      'token_type',
      'provider_token',
      'provider_refresh_token',
      'error',
      'error_code',
      'error_description',
      PASSWORD_RECOVERY_ACTION_PARAM
    ];

    authParamNames.forEach(paramName => {
      if (url.searchParams.has(paramName)) {
        url.searchParams.delete(paramName);
        wasChanged = true;
      }
    });

    const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));

    authParamNames.forEach(paramName => {
      if (hashParams.has(paramName)) {
        hashParams.delete(paramName);
        wasChanged = true;
      }
    });

    if (wasChanged) {
      const nextHash = hashParams.toString();
      url.hash = nextHash ? `#${nextHash}` : '';
      window.history.replaceState({}, document.title, url.toString());
    }
  }

  function normalizeAuthRedirectOtpType(type) {
    const normalizedType = String(type || '').toLowerCase();
    const allowedTypes = new Set([
      'email',
      'email_change',
      'invite',
      'magiclink',
      'recovery'
    ]);

    if (normalizedType === 'signup') {
      return 'email';
    }

    if (!allowedTypes.has(normalizedType)) {
      return '';
    }

    return normalizedType;
  }

  async function consumeAuthRedirectFromUrl(authRedirectInfo = getAuthRedirectInfo()) {
    if (!authRedirectInfo.hasAuthReturnParams) {
      return {
        didConsume: false,
        isRecovery: authRedirectInfo.isRecovery,
        error: null
      };
    }

    const authRedirectErrorMessage = authRedirectInfo.errorDescription || authRedirectInfo.error || '';

    try {
      if (authRedirectErrorMessage) {
        throw new Error(authRedirectErrorMessage);
      }

      if (authRedirectInfo.code) {
        const { error } = await withAuthRequestTimeout(
          supabaseClient.auth.exchangeCodeForSession(authRedirectInfo.code),
          'Не удалось обработать ссылку входа. Проверь соединение и попробуй открыть ссылку ещё раз.'
        );

        if (error) {
          throw error;
        }
      } else if (authRedirectInfo.accessToken && authRedirectInfo.refreshToken) {
        const { error } = await withAuthRequestTimeout(
          supabaseClient.auth.setSession({
            access_token: authRedirectInfo.accessToken,
            refresh_token: authRedirectInfo.refreshToken
          }),
          'Не удалось восстановить сессию из ссылки. Проверь соединение и попробуй открыть ссылку ещё раз.'
        );

        if (error) {
          throw error;
        }
      } else if (authRedirectInfo.tokenHash) {
        const otpType = normalizeAuthRedirectOtpType(authRedirectInfo.type);

        if (!otpType) {
          throw new Error('Ссылка входа содержит неизвестный тип подтверждения.');
        }

        const { error } = await withAuthRequestTimeout(
          supabaseClient.auth.verifyOtp({
            token_hash: authRedirectInfo.tokenHash,
            type: otpType
          }),
          'Не удалось подтвердить ссылку входа. Проверь соединение и попробуй открыть ссылку ещё раз.'
        );

        if (error) {
          throw error;
        }
      }

      if (authRedirectInfo.isRecovery) {
        localStorage.setItem(PASSWORD_RECOVERY_PENDING_KEY, '1');
        const recoverySessionResult = await getPasswordRecoverySessionForUpdate();

        if (!recoverySessionResult.session) {
          throw recoverySessionResult.error || new Error('Ссылка для сброса пароля не создала активную recovery-сессию.');
        }
      }

      if (authRedirectInfo.isEmailConfirmation) {
        didConsumeEmailConfirmationRedirect = true;
      }

      return {
        didConsume: true,
        isRecovery: authRedirectInfo.isRecovery,
        error: null
      };
    } catch (error) {
      console.error('Ошибка обработки auth-редиректа:', error);

      return {
        didConsume: true,
        isRecovery: authRedirectInfo.isRecovery,
        error
      };
    } finally {
      clearEmailConfirmationParamsFromUrl();
    }
  }

  function trackEmailConfirmedLoginIfNeeded() {
    if (!getCurrentUser()?.id) {
      return;
    }

    if (!localStorage.getItem(EMAIL_CONFIRMATION_PENDING_KEY)) {
      return;
    }

    if (!isEmailConfirmationRedirect()) {
      return;
    }

    const trackedUserId = localStorage.getItem(EMAIL_CONFIRMATION_TRACKED_KEY);

    if (trackedUserId === getCurrentUser().id) {
      clearEmailConfirmationParamsFromUrl();
      didConsumeEmailConfirmationRedirect = false;
      return;
    }

    trackGoal('email_confirmed_login');
    localStorage.setItem(EMAIL_CONFIRMATION_TRACKED_KEY, getCurrentUser().id);
    localStorage.removeItem(EMAIL_CONFIRMATION_PENDING_KEY);
    clearEmailConfirmationParamsFromUrl();
    didConsumeEmailConfirmationRedirect = false;
  }

  function showAuthMessage(text, type = 'info', autoHide = false) {
    authMessageTimer = showToastMessage(
      authToast,
      authMessage,
      { value: authMessageTimer },
      text,
      type,
      autoHide
    );
  }

  function clearAuthMessage() {
    const timerState = { value: authMessageTimer };
    clearToastMessage(authToast, authMessage, timerState);
    authMessageTimer = timerState.value;
  }

  function resetAuthFormState() {
    invalidateOperation();
    isPasswordRecoveryMode = false;
    isAuthRegisterMode = false;

    if (loginForm) {
      loginForm.reset();
    }

    if (loginPasswordConfirm) {
      loginPasswordConfirm.value = '';
    }

    updateAuthModalMode();
    clearAuthMessage();
  }

  function setAuthRegisterMode(nextMode) {
    if (isPasswordRecoveryMode) {
      return;
    }

    invalidateOperation();
    isAuthRegisterMode = Boolean(nextMode);
    clearAuthMessage();
    updateAuthModalMode();

    const version = operationVersion;
    requestAnimationFrame(() => {
      if (!isAuthModalOpen || version !== operationVersion) return;
      if (isAuthRegisterMode) {
        registerNicknameInput?.focus();
        return;
      }

      loginEmail?.focus();
    });
  }

  async function cancelPasswordRecoveryFlow() {
    localStorage.removeItem(PASSWORD_RECOVERY_PENDING_KEY);
    isPasswordRecoveryEntryPage = false;
    clearEmailConfirmationParamsFromUrl();

    try {
      await withAuthRequestTimeout(
        supabaseClient.auth.signOut({ scope: 'global' }),
        'Не удалось отменить восстановление пароля. Проверь соединение и попробуй снова.'
      );
    } catch (error) {
      console.error('Ошибка отмены recovery-сессии:', error);
    }
  }

  function setAuthSubmittingState(isSubmitting) {
    isAuthSubmitting = isSubmitting;

    if (loginEmail) {
      loginEmail.disabled = isSubmitting || isPasswordRecoveryMode;
    }

    if (loginPassword) {
      loginPassword.disabled = isSubmitting;
    }

    if (registerNicknameInput) {
      registerNicknameInput.disabled = isSubmitting || !isAuthRegisterMode || isPasswordRecoveryMode;
    }

    if (loginPasswordConfirm) {
      loginPasswordConfirm.disabled = isSubmitting || !isPasswordRecoveryMode;
    }

    const loginSubmitButton = loginForm?.querySelector('button[type="submit"]');

    if (loginSubmitButton) {
      loginSubmitButton.disabled = isSubmitting;
    }

    if (registerButton) {
      registerButton.disabled = isSubmitting;
    }
  }

  function openAuthModal() {
    if (!authModal || (getCurrentUser() && !isPasswordRecoveryMode)) {
      return;
    }

    if (isAuthModalOpen) return;
    invalidateOperation();
    if (!isPasswordRecoveryMode) {
      isAuthRegisterMode = false;
      updateAuthModalMode();
    }

    authModal.classList.add('is-open');
    isAuthModalOpen = true;
    syncBodyScrollLock();

    const version = operationVersion;
    requestAnimationFrame(() => {
      if (!isAuthModalOpen || version !== operationVersion) return;
      if (isPasswordRecoveryMode) {
        loginPassword?.focus();
        loginPassword?.select();
        return;
      }

      loginEmail?.focus();
    });
  }

  async function closeAuthModal(options = {}) {
    if (!authModal) {
      return;
    }

    const shouldCancelPasswordRecovery = isPasswordRecoveryMode && !options.skipPasswordRecoveryCancel;

    closeAuthPopoverMenu();
    closeProfileSettings();
    authModal.classList.remove('is-open');
    isAuthModalOpen = false;
    syncBodyScrollLock();
    resetAuthFormState();

    if (shouldCancelPasswordRecovery) {
      await cancelPasswordRecoveryFlow();
    }
  }

  function updateAuthModalMode() {
    const submitButton = loginForm?.querySelector('button[type="submit"]');

    if (!submitButton) {
      return;
    }

    if (isPasswordRecoveryMode) {
      if (loginForm) {
        loginForm.classList.add('is-visible');
      }

      if (authModalTitle) {
        authModalTitle.textContent = 'Сброс пароля';
      }

      if (loginEmail) {
        loginEmail.classList.remove('is-visible');
        loginEmail.disabled = true;
      }

      if (loginPassword) {
        loginPassword.classList.add('is-visible');
        loginPassword.placeholder = 'Новый пароль';
        loginPassword.autocomplete = 'new-password';
      }

      if (registerNicknameInput) {
        registerNicknameInput.classList.remove('is-visible');
        registerNicknameInput.disabled = true;
      }

      if (registerNicknameHint) {
        registerNicknameHint.classList.remove('is-visible');
      }

      if (loginPasswordConfirm) {
        loginPasswordConfirm.classList.add('is-visible');
        loginPasswordConfirm.disabled = isAuthSubmitting;
        loginPasswordConfirm.placeholder = 'Повторите новый пароль';
        loginPasswordConfirm.autocomplete = 'off';
      }

      submitButton.textContent = 'Сохранить новый пароль';

      if (registerButton) {
        registerButton.classList.remove('is-visible');
      }

      if (authFormLinks) {
        authFormLinks.classList.remove('is-visible');
      }

      return;
    }

    if (loginForm) {
      loginForm.classList.toggle('is-visible', !getCurrentUser());
    }

    if (loginEmail) {
      loginEmail.classList.add('is-visible');
      loginEmail.disabled = isAuthSubmitting;
    }

    if (loginPassword) {
      loginPassword.classList.add('is-visible');
      loginPassword.placeholder = 'Пароль';
    }

    if (loginPasswordConfirm) {
      loginPasswordConfirm.classList.remove('is-visible');
      loginPasswordConfirm.disabled = true;
      loginPasswordConfirm.value = '';
      loginPasswordConfirm.autocomplete = 'off';
    }

    if (isAuthRegisterMode) {
      if (authModalTitle) {
        authModalTitle.textContent = 'Регистрация';
      }

      if (loginPassword) {
        loginPassword.autocomplete = 'new-password';
      }

      if (registerNicknameInput) {
        registerNicknameInput.classList.add('is-visible');
        registerNicknameInput.disabled = isAuthSubmitting;
      }

      if (registerNicknameHint) {
        registerNicknameHint.classList.add('is-visible');
      }

      submitButton.textContent = 'Зарегистрироваться';

      if (registerButton) {
        registerButton.classList.add('is-visible');
        registerButton.textContent = 'У меня уже есть аккаунт';
      }

      if (authFormLinks) {
        authFormLinks.classList.remove('is-visible');
      }

      return;
    }

    if (authModalTitle) {
      authModalTitle.textContent = 'Вход';
    }

    if (loginPassword) {
      loginPassword.autocomplete = 'current-password';
    }

    if (registerNicknameInput) {
      registerNicknameInput.classList.remove('is-visible');
      registerNicknameInput.disabled = true;
    }

    if (registerNicknameHint) {
      registerNicknameHint.classList.remove('is-visible');
    }

    submitButton.textContent = 'Войти';

    if (registerButton) {
      registerButton.classList.add('is-visible');
      registerButton.textContent = 'Регистрация';
    }

    if (authFormLinks) {
      authFormLinks.classList.add('is-visible');
    }
  }

  async function sendPasswordResetEmail() {
    if (isAuthSubmitting) {
      return;
    }

    const email = loginEmail.value.trim();

    if (!email) {
      showAuthMessage('Сначала введи e-mail, на который нужно отправить письмо для сброса пароля.', 'error');
      loginEmail.focus();
      return;
    }

    loginPassword.value = '';

    const isCurrent = beginOperation();
    showAuthMessage('Отправляю письмо для сброса пароля...');

    try {
      const { error } = await withAuthRequestTimeout(
        supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: getPasswordRecoveryRedirectUrl()
        }),
        'Не удалось отправить письмо для сброса пароля. Проверь соединение и попробуй снова.'
      );
      if (!isCurrent()) return;

      if (error) {
        console.error('Ошибка отправки письма для сброса пароля:', error);
        showAuthMessage(
          getReadableAuthErrorMessage(error, 'Не удалось отправить письмо для сброса пароля. Попробуй позже.'),
          'error'
        );
        return;
      }

      localStorage.setItem(PASSWORD_RECOVERY_PENDING_KEY, '1');

      showAuthMessage(
        'Если такой e-mail существует, мы отправили письмо со ссылкой для сброса пароля.',
        'success'
      );
    } catch (error) {
      if (!isCurrent()) return;
      console.error('Ошибка отправки письма для сброса пароля:', error);
      showAuthMessage(
        getReadableAuthErrorMessage(error, 'Не удалось отправить письмо для сброса пароля. Попробуй позже.'),
        'error'
      );
    } finally {
      if (isCurrent()) setAuthSubmittingState(false);
    }
  }

  async function getPasswordRecoverySessionForUpdate(isCurrent = () => true) {
    const { data: sessionData, error: sessionError } = await withAuthRequestTimeout(
      supabaseClient.auth.getSession(),
      'Не удалось проверить recovery-сессию. Проверь соединение и попробуй открыть ссылку ещё раз.'
    );

    if (!isCurrent()) return { session: null, error: null };
    if (sessionData?.session?.user) {
      return {
        error: null,
        session: sessionData.session
      };
    }

    const { data: refreshedData, error: refreshError } = await withAuthRequestTimeout(
      supabaseClient.auth.refreshSession(),
      'Не удалось восстановить recovery-сессию. Проверь соединение и попробуй открыть ссылку ещё раз.'
    );

    if (!isCurrent()) return { session: null, error: null };
    if (refreshedData?.session?.user) {
      return {
        error: null,
        session: refreshedData.session
      };
    }

    return {
      error: refreshError || sessionError || null,
      session: null
    };
  }

  async function saveNewPassword() {
    if (isAuthSubmitting) {
      return;
    }

    const nextPassword = loginPassword.value;
    const confirmedPassword = loginPasswordConfirm?.value || '';

    if (!nextPassword) {
      showAuthMessage('Введи новый пароль.', 'error');
      loginPassword.focus();
      return;
    }

    if (!confirmedPassword) {
      showAuthMessage('Повтори новый пароль во втором поле.', 'error');
      loginPasswordConfirm.focus();
      return;
    }

    if (nextPassword !== confirmedPassword) {
      showAuthMessage('Пароли не совпадают. Проверь ввод и попробуй снова.', 'error');
      loginPasswordConfirm.focus();
      loginPasswordConfirm.select();
      return;
    }

    const isCurrentUi = beginOperation();
    const sessionScope = captureSession();
    const isCurrent = () => isCurrentUi() && sessionScope.isCurrent();
    showAuthMessage('Сохраняю новый пароль...');

    try {
      const {
        error: sessionError,
        session
      } = await getPasswordRecoverySessionForUpdate(isCurrent);
      if (!isCurrent()) return;

      if (sessionError || !session?.user) {
        console.error('Recovery-сессия не найдена:', sessionError);
        showAuthMessage(
          'Ссылка для сброса пароля не создала активную сессию. Запроси новое письмо и открой свежую ссылку.',
          'error'
        );
        return;
      }

      const { error } = await withAuthRequestTimeout(
        supabaseClient.auth.updateUser({
          password: nextPassword
        }),
        'Не удалось сохранить новый пароль. Проверь соединение и попробуй снова.'
      );
      if (!isCurrent()) return;

      if (error) {
        console.error('Ошибка сохранения нового пароля:', error);
        showAuthMessage(
          getReadableAuthErrorMessage(error, 'Не удалось сохранить новый пароль. Попробуй ещё раз.'),
          'error'
        );
        return;
      }

      localStorage.removeItem(PASSWORD_RECOVERY_PENDING_KEY);
      isPasswordRecoveryEntryPage = false;
      clearEmailConfirmationParamsFromUrl();

      showAuthMessage('Новый пароль сохранён. Теперь войди с ним заново.', 'success', true);

      setTimeout(async () => {
        if (!isCurrent()) return;
        try {
          await withAuthRequestTimeout(
            supabaseClient.auth.signOut({ scope: 'local' }),
            'Не удалось завершить recovery-сессию. Проверь соединение и попробуй снова.'
          );
        } catch (error) {
          console.error('Ошибка завершения recovery-сессии:', error);
        }

        if (isCurrentUi()) void closeAuthModal({ skipPasswordRecoveryCancel: true });
      }, 900);
    } catch (error) {
      if (!isCurrent()) return;
      console.error('Ошибка сохранения нового пароля:', error);
      showAuthMessage(
        getReadableAuthErrorMessage(error, 'Не удалось сохранить новый пароль. Попробуй ещё раз.'),
        'error'
      );
    } finally {
      if (isCurrentUi()) setAuthSubmittingState(false);
    }
  }

  async function login(event) {
    event.preventDefault();

    if (isPasswordRecoveryMode) {
      await saveNewPassword();
      return;
    }

    if (isAuthRegisterMode) {
      await register();
      return;
    }

    if (isAuthSubmitting) {
      return;
    }

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
      showAuthMessage('Введи e-mail и пароль для входа.', 'error');

      if (!email) {
        loginEmail.focus();
      } else {
        loginPassword.focus();
      }

      return;
    }

    const isCurrent = beginOperation();
    showAuthMessage('Выполняю вход...');

    try {
      const { error } = await withAuthRequestTimeout(
        supabaseClient.auth.signInWithPassword({
          email,
          password
        }),
        'Не удалось выполнить вход. Проверь соединение и попробуй снова.'
      );
      if (!isCurrent()) return;

      if (error) {
        console.error('Ошибка входа:', error);
        showAuthMessage(
          getReadableAuthErrorMessage(error, 'Ошибка входа. Проверь e-mail и пароль.'),
          'error'
        );
        return;
      }

      loginPassword.value = '';

      showAuthMessage('Вход выполнен.', 'success', true);

      setTimeout(() => {
        if (!isCurrent()) return;
        closeAuthModal();
      }, 300);
    } catch (error) {
      if (!isCurrent()) return;
      console.error('Ошибка входа:', error);
      showAuthMessage(
        getReadableAuthErrorMessage(error, 'Ошибка входа. Проверь e-mail и пароль.'),
        'error'
      );
    } finally {
      if (isCurrent()) setAuthSubmittingState(false);
    }
  }

  async function register() {
    if (isAuthSubmitting) {
      return;
    }

    const isCurrent = beginOperation();
    showAuthMessage('Регистрирую аккаунт...');

    try {
      const email = loginEmail.value.trim();
      const password = loginPassword.value;
      const registerNickname = registerNicknameInput?.value.trim() || '';

      if (!email || !password) {
        showAuthMessage('Введи email и пароль для регистрации.', 'error');
        return;
      }

      if (registerNickname) {
        if (!isValidDisplayNameValue(registerNickname)) {
          showAuthMessage('Никнейм должен быть длиной от 3 до 24 символов и содержать только буквы, цифры или _.', 'error');
          registerNicknameInput.focus();
          return;
        }

        const isNicknameAvailable = await isDisplayNameAvailable(registerNickname);
        if (!isCurrent()) return;

        if (!isNicknameAvailable) {
          showAuthMessage('Этот никнейм уже занят. Выбери другой.', 'error');
          registerNicknameInput.focus();
          registerNicknameInput.select();
          return;
        }
      }

      const { error } = await withAuthRequestTimeout(
        supabaseClient.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              display_name: registerNickname || null
            }
          }
        }),
        'Не удалось зарегистрировать аккаунт. Проверь соединение и попробуй снова.'
      );
      if (!isCurrent()) return;

      if (error) {
        console.error('Ошибка регистрации:', error);
        showAuthMessage(
          getReadableAuthErrorMessage(error, 'Ошибка регистрации. Проверь e-mail, пароль и никнейм.'),
          'error'
        );
        return;
      }

      loginPassword.value = '';
      isAuthRegisterMode = false;
      updateAuthModalMode();
      loginEmail.focus();

      showAuthMessage(
        'Если аккаунт можно зарегистрировать, мы отправили письмо для завершения регистрации.',
        'success'
      );

      localStorage.setItem(EMAIL_CONFIRMATION_PENDING_KEY, '1');
      localStorage.removeItem(EMAIL_CONFIRMATION_TRACKED_KEY);
      trackGoal('register');
    } catch (error) {
      if (!isCurrent()) return;
      console.error('Ошибка регистрации:', error);
      showAuthMessage(
        getReadableAuthErrorMessage(error, 'Ошибка регистрации. Проверь e-mail, пароль и никнейм.'),
        'error'
      );
    } finally {
      if (isCurrent()) setAuthSubmittingState(false);
    }
  }

  async function logout() {
    try {
      const { error } = await withAuthRequestTimeout(
        supabaseClient.auth.signOut(),
        'Не удалось выйти. Проверь соединение и попробуй снова.'
      );

      if (error) {
        console.error('Ошибка выхода:', error);
        showAuthMessage('Не удалось выйти.', 'error');
        return;
      }

      window.location.replace(window.location.pathname + window.location.search);
    } catch (error) {
      console.error('Ошибка выхода:', error);
      showAuthMessage(
        getReadableAuthErrorMessage(error, 'Не удалось выйти. Попробуй ещё раз.'),
        'error'
      );
    }
  }

  function handlePasswordRecoveryEntry(hasPasswordRecoveryRedirect) {
    if (!hasPasswordRecoveryRedirect) {
      return;
    }

    invalidateOperation();
    isPasswordRecoveryMode = true;
    onModeChanged();
    updateAuthModalMode();
    openAuthModal();
    showAuthMessage('Введите новый пароль и подтвердите его ниже.');
  }

  loginForm?.addEventListener('submit', login);
  loginEmail?.addEventListener('input', clearAuthMessage);
  loginPassword?.addEventListener('input', clearAuthMessage);
  loginPasswordConfirm?.addEventListener('input', clearAuthMessage);
  registerButton?.addEventListener('click', () => setAuthRegisterMode(!isAuthRegisterMode));
  logoutMenuButton?.addEventListener('click', () => { closeAuthPopoverMenu(); return logout(); });
  closeAuthModalButton?.addEventListener('click', () => closeAuthModal());
  authModalBackdrop?.addEventListener('click', () => closeAuthModal());
  forgotPasswordButton?.addEventListener('click', () => sendPasswordResetEmail());

  function syncAuthState() {
    if (getCurrentUser() && !isPasswordRecoveryMode && isAuthModalOpen) void closeAuthModal();
    updateAuthModalMode();
  }

  async function initializeRedirect(initialUrl) {
    const initialInfo = getAuthRedirectInfo(initialUrl);
    isPasswordRecoveryEntryPage = initialInfo.isRecovery;
    const result = await consumeAuthRedirectFromUrl(initialInfo);
    if (result.error) {
      if (result.isRecovery) {
        localStorage.removeItem(PASSWORD_RECOVERY_PENDING_KEY);
        isPasswordRecoveryEntryPage = false;
        openAuthModal();
        showAuthMessage(getReadableAuthErrorMessage(result.error,
          'Ссылка для сброса пароля недействительна или устарела. Запроси новое письмо.'), 'error');
      } else {
        showAppMessage(getReadableAuthErrorMessage(result.error,
          'Не удалось выполнить вход по ссылке. Попробуй запросить новую ссылку.'), 'error', true);
      }
    } else {
      isPasswordRecoveryEntryPage = result.isRecovery;
      handlePasswordRecoveryEntry(result.isRecovery);
    }
  }

  return { open: openAuthModal, close: closeAuthModal, isOpen: () => isAuthModalOpen,
    isRecoveryMode: () => isPasswordRecoveryMode, isRecoveryEntryPage: () => isPasswordRecoveryEntryPage,
    hasPendingRecovery: () => Boolean(localStorage.getItem(PASSWORD_RECOVERY_PENDING_KEY)),
    enterRecovery: () => { localStorage.setItem(PASSWORD_RECOVERY_PENDING_KEY, '1'); handlePasswordRecoveryEntry(true); },
    syncAuthState, initializeRedirect, showMessage: showAuthMessage, trackEmailConfirmedLoginIfNeeded };
}
