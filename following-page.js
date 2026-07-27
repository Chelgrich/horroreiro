const FOLLOWING_NOTIFICATION_PREFERENCE_LABELS = {
  notify_ratings: 'Оценки',
  notify_watchlist: 'Смотреть позже',
  notify_reviews: 'Рецензии'
};

export function createFollowingPageController(context = {}) {
  const {
    followingPage,
    supabaseClient,
    getCurrentUser,
    shouldUseAuthenticatedUi,
    restoreSession,
    trackEmailConfirmedLoginIfNeeded,
    bindSharedAuthStateListener,
    openAuthModal,
    showAppMessage,
    escapeHtml,
    buildUserPageUrl,
    getUserPageAvatarLetter,
    getPublicProfileDisplayName,
    getPublicProfileAvatarUrl,
    getPublicProfileHandle,
    fetchPublicProfilesByIds,
    throwIfSupabaseError,
    isNotificationsUnavailableError,
    setNotificationsUnavailable,
    setCurrentUserFollowedProfileIds,
    deleteCurrentUserFollowedProfileId
  } = context;

  const followingPagePreferenceRequestKeys = new Set();
  const followingPageUnfollowRequestProfileIds = new Set();
  let isFollowingPageEventsBound = false;

  function renderFollowingPageLoading() {
    if (!followingPage) {
      return;
    }

    followingPage.innerHTML = '<div class="following-page-loading-state">Загрузка отслеживаний...</div>';
  }

  function renderFollowingPageAuthGate() {
    if (!followingPage) {
      return;
    }

    document.title = 'Отслеживания — Хоррорейро';
    followingPage.innerHTML = `
      <div class="following-page-empty-state following-page-empty-state-large">
        <p>Войди, чтобы управлять отслеживаемыми профилями и уведомлениями от них.</p>
        <button type="button" class="secondary-button following-page-login-button" data-following-page-login="true">
          Войти
        </button>
      </div>
    `;
  }

  function renderFollowingPageError() {
    if (!followingPage) {
      return;
    }

    followingPage.innerHTML = `
      <div class="following-page-empty-state following-page-empty-state-large">
        Не удалось загрузить отслеживания. Попробуй обновить страницу.
      </div>
    `;
  }

  async function fetchFollowingPageFollowRows() {
    if (!shouldUseAuthenticatedUi() || !getCurrentUser()?.id) {
      return [];
    }

    const { data, error } = await supabaseClient
      .from('user_profile_follows')
      .select('following_id, created_at')
      .eq('follower_id', getCurrentUser().id)
      .order('created_at', { ascending: false });

    throwIfSupabaseError(error);

    const rows = data || [];

    setCurrentUserFollowedProfileIds(new Set(
      rows
        .map(row => String(row?.following_id || '').trim())
        .filter(Boolean)
    ));

    return rows;
  }

  async function fetchFollowingPageNotificationPreferences(profileIds = []) {
    const normalizedProfileIds = [...new Set(
      (Array.isArray(profileIds) ? profileIds : [])
        .map(profileId => String(profileId || '').trim())
        .filter(Boolean)
    )];

    if (!shouldUseAuthenticatedUi() || !getCurrentUser()?.id || !normalizedProfileIds.length) {
      return {
        preferencesByProfileId: new Map(),
        arePreferencesAvailable: true
      };
    }

    const { data, error } = await supabaseClient
      .from('user_follow_notification_preferences')
      .select('following_id, notify_ratings, notify_watchlist, notify_reviews')
      .eq('follower_id', getCurrentUser().id)
      .in('following_id', normalizedProfileIds);

    if (error) {
      if (isNotificationsUnavailableError(error)) {
        return {
          preferencesByProfileId: new Map(),
          arePreferencesAvailable: false
        };
      }

      throw error;
    }

    return {
      preferencesByProfileId: new Map(
        (data || []).map(row => [
          String(row.following_id),
          {
            notify_ratings: row.notify_ratings !== false,
            notify_watchlist: row.notify_watchlist !== false,
            notify_reviews: row.notify_reviews !== false
          }
        ])
      ),
      arePreferencesAvailable: true
    };
  }

  function getFollowingNotificationPreference(preferencesByProfileId, profileId) {
    const preference = preferencesByProfileId?.get?.(String(profileId || '').trim());

    return {
      notify_ratings: preference?.notify_ratings !== false,
      notify_watchlist: preference?.notify_watchlist !== false,
      notify_reviews: preference?.notify_reviews !== false
    };
  }

  async function fetchFollowingPageData() {
    if (!shouldUseAuthenticatedUi() || !getCurrentUser()?.id) {
      return null;
    }

    const followRows = await fetchFollowingPageFollowRows();
    const followedProfileIds = followRows
      .map(row => String(row?.following_id || '').trim())
      .filter(Boolean);

    if (!followedProfileIds.length) {
      return {
        followRows,
        profiles: [],
        preferencesByProfileId: new Map(),
        arePreferencesAvailable: true
      };
    }

    const [profiles, preferencesResult] = await Promise.all([
      fetchPublicProfilesByIds(followedProfileIds),
      fetchFollowingPageNotificationPreferences(followedProfileIds)
    ]);
    const profilesById = new Map((profiles || []).map(profile => [String(profile.id), profile]));
    const orderedProfiles = followRows
      .map(row => profilesById.get(String(row.following_id)))
      .filter(Boolean);

    return {
      followRows,
      profiles: orderedProfiles,
      preferencesByProfileId: preferencesResult.preferencesByProfileId,
      arePreferencesAvailable: preferencesResult.arePreferencesAvailable
    };
  }

  function getFollowingPageAvatarHtml(profile, className, size = 'small') {
    const displayName = getPublicProfileDisplayName(profile);
    const avatarUrl = getPublicProfileAvatarUrl(profile);
    const modifierClass = size ? ` ${className}-${size}` : '';

    if (avatarUrl) {
      return `
        <img
          class="${className}${modifierClass}"
          src="${escapeHtml(avatarUrl)}"
          alt="Аватар пользователя ${escapeHtml(displayName)}"
          loading="lazy"
          decoding="async"
        >
      `;
    }

    return `
      <span class="${className}${modifierClass}" aria-hidden="true">
        ${escapeHtml(getUserPageAvatarLetter(displayName))}
      </span>
    `;
  }

  function getFollowingPagePreferenceKey(profileId, key) {
    return `${String(profileId || '').trim()}:${String(key || '').trim()}`;
  }

  function getFollowingPageProfileCardHtml(profile, preferencesByProfileId, arePreferencesAvailable = true) {
    const displayName = getPublicProfileDisplayName(profile);
    const handle = getPublicProfileHandle(profile);
    const profileId = String(profile?.id || '').trim();
    const preference = getFollowingNotificationPreference(preferencesByProfileId, profileId);

    return `
      <article class="following-page-profile-card">
        <a href="${escapeHtml(buildUserPageUrl(handle))}" class="following-page-profile-link">
          ${getFollowingPageAvatarHtml(profile, 'following-page-profile-avatar')}
          <span class="following-page-profile-name">${escapeHtml(displayName)}</span>
          <span class="following-page-profile-handle">${escapeHtml(handle)}</span>
        </a>

        <div class="following-page-profile-controls" aria-label="Уведомления от ${escapeHtml(displayName)}">
          ${Object.entries(FOLLOWING_NOTIFICATION_PREFERENCE_LABELS).map(([key, label]) => {
            const preferenceKey = getFollowingPagePreferenceKey(profileId, key);
            const isBusy = followingPagePreferenceRequestKeys.has(preferenceKey);
            const isChecked = preference[key] !== false;

            return `
              <label class="following-page-profile-toggle">
                <input
                  type="checkbox"
                  data-follow-notification-toggle="true"
                  data-following-id="${escapeHtml(profileId)}"
                  data-follow-notification-key="${escapeHtml(key)}"
                  ${isChecked ? 'checked' : ''}
                  ${isBusy || !arePreferencesAvailable ? 'disabled' : ''}
                >
                <span>${escapeHtml(label)}</span>
              </label>
            `;
          }).join('')}
        </div>

        <button
          type="button"
          class="secondary-button following-page-unfollow-button"
          data-following-page-unfollow-profile-id="${escapeHtml(profileId)}"
          ${followingPageUnfollowRequestProfileIds.has(profileId) ? 'disabled' : ''}
        >
          Не отслеживать
        </button>
      </article>
    `;
  }

  function renderFollowingPage(data) {
    if (!followingPage) {
      return;
    }

    document.title = 'Отслеживания — Хоррорейро';

    if (!data?.profiles?.length) {
      followingPage.innerHTML = `
        <div class="following-page-empty-state following-page-empty-state-large">
          Ты пока никого не отслеживаешь. Открой чужой профиль и нажми «Отслеживать».
        </div>
      `;
      return;
    }

    followingPage.innerHTML = `
      <section class="following-page-block">
        <div class="following-page-section-header">
          <h2>Отслеживаемые профили</h2>
          <span>${data.profiles.length}</span>
        </div>
        ${
          data.arePreferencesAvailable
            ? ''
            : '<div class="following-page-empty-state following-page-warning-state">Настройки уведомлений станут доступны после подключения серверного контура.</div>'
        }
        <div class="following-page-profile-grid">
          ${data.profiles
            .map(profile => getFollowingPageProfileCardHtml(
              profile,
              data.preferencesByProfileId,
              data.arePreferencesAvailable
            ))
            .join('')}
        </div>
      </section>
    `;
  }

  async function updateFollowingNotificationPreference(profileId, key, value) {
    const normalizedProfileId = String(profileId || '').trim();
    const normalizedKey = String(key || '').trim();

    if (
      !normalizedProfileId ||
      !Object.prototype.hasOwnProperty.call(FOLLOWING_NOTIFICATION_PREFERENCE_LABELS, normalizedKey) ||
      !shouldUseAuthenticatedUi() ||
      !getCurrentUser()?.id
    ) {
      return;
    }

    const requestKey = getFollowingPagePreferenceKey(normalizedProfileId, normalizedKey);

    if (followingPagePreferenceRequestKeys.has(requestKey)) {
      return;
    }

    followingPagePreferenceRequestKeys.add(requestKey);

    try {
      const { error } = await supabaseClient
        .from('user_follow_notification_preferences')
        .upsert({
          follower_id: getCurrentUser().id,
          following_id: normalizedProfileId,
          [normalizedKey]: Boolean(value)
        }, {
          onConflict: 'follower_id,following_id'
        });

      if (error) {
        if (isNotificationsUnavailableError(error)) {
          setNotificationsUnavailable(true);
        }

        throw error;
      }
    } catch (error) {
      console.error('Ошибка обновления настройки отслеживания:', error);
      showAppMessage('Не удалось обновить настройку отслеживания.', 'error', true);
    } finally {
      followingPagePreferenceRequestKeys.delete(requestKey);
      await loadFollowingPage();
    }
  }

  function handleFollowingPagePreferenceChange(event) {
    const input = event.target?.closest?.('[data-follow-notification-toggle="true"]');

    if (!input) {
      return false;
    }

    void updateFollowingNotificationPreference(
      input.dataset.followingId,
      input.dataset.followNotificationKey,
      input.checked
    );
    return true;
  }

  async function unfollowProfileFromFollowingPage(profileId) {
    const normalizedProfileId = String(profileId || '').trim();

    if (!normalizedProfileId || !shouldUseAuthenticatedUi() || !getCurrentUser()?.id) {
      return;
    }

    if (followingPageUnfollowRequestProfileIds.has(normalizedProfileId)) {
      return;
    }

    followingPageUnfollowRequestProfileIds.add(normalizedProfileId);

    try {
      const { error } = await supabaseClient
        .from('user_profile_follows')
        .delete()
        .eq('follower_id', getCurrentUser().id)
        .eq('following_id', normalizedProfileId);

      throwIfSupabaseError(error);
      deleteCurrentUserFollowedProfileId(normalizedProfileId);
      showAppMessage('Профиль больше не отслеживается.', 'success', true);
    } catch (error) {
      console.error('Ошибка удаления отслеживания:', error);
      showAppMessage('Не удалось удалить отслеживание.', 'error', true);
    } finally {
      followingPageUnfollowRequestProfileIds.delete(normalizedProfileId);
      await loadFollowingPage();
    }
  }

  function handleFollowingPageUnfollowClick(event) {
    const button = event.target?.closest?.('[data-following-page-unfollow-profile-id]');

    if (!button) {
      return false;
    }

    event.preventDefault();
    void unfollowProfileFromFollowingPage(button.dataset.followingPageUnfollowProfileId);
    return true;
  }

  function handleFollowingPageLoginClick(event) {
    const button = event.target?.closest?.('[data-following-page-login="true"]');

    if (!button) {
      return false;
    }

    event.preventDefault();
    openAuthModal();
    return true;
  }

  async function loadFollowingPage() {
    if (!followingPage) {
      return;
    }

    if (!shouldUseAuthenticatedUi() || !getCurrentUser()?.id) {
      renderFollowingPageAuthGate();
      return;
    }

    renderFollowingPageLoading();

    try {
      const data = await fetchFollowingPageData();
      renderFollowingPage(data);
    } catch (error) {
      console.error('Ошибка загрузки страницы отслеживаемых профилей:', error);
      renderFollowingPageError();
    }
  }

  function bindFollowingPageEvents() {
    if (!followingPage || isFollowingPageEventsBound) {
      return;
    }

    followingPage.addEventListener('click', event => {
      if (handleFollowingPageLoginClick(event)) {
        return;
      }

      handleFollowingPageUnfollowClick(event);
    });

    followingPage.addEventListener('change', event => {
      handleFollowingPagePreferenceChange(event);
    });

    isFollowingPageEventsBound = true;
  }

  async function initFollowingPage() {
    bindFollowingPageEvents();
    renderFollowingPageLoading();
    await restoreSession();
    trackEmailConfirmedLoginIfNeeded();
    await loadFollowingPage();

    bindSharedAuthStateListener({
      onAfterAuthSync: loadFollowingPage
    });
  }

  return {
    initFollowingPage,
    loadFollowingPage
  };
}
