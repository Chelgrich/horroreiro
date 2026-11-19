export function createProfileUtils(context = {}) {
  const {
    escapeHtml
  } = context;

  function normalizeDisplayNameValue(value) {
    return String(value || '')
      .trim()
      .toLowerCase();
  }

  function isValidDisplayNameValue(value) {
    return /^[A-Za-zА-Яа-яЁё0-9_]{3,24}$/.test(String(value || '').trim());
  }

  function getCurrentDisplayName(currentUser, currentUserProfile) {
    return String(
      currentUser?.user_metadata?.display_name ||
      currentUserProfile?.display_name ||
      currentUserProfile?.default_display_name ||
      ''
    ).trim();
  }

  function getCurrentUserPublicHandle(currentUser, currentUserProfile) {
    return String(
      currentUserProfile?.default_display_name ||
      currentUser?.id ||
      ''
    ).trim();
  }

  function doesProfilePreferRussianPosters(profile) {
    return Boolean(profile?.prefer_russian_posters);
  }

  function getPublicProfileAvatarUrl(profile) {
    const rawUrl = String(profile?.avatar_url || '').trim();

    if (!rawUrl) {
      return '';
    }

    try {
      const parsedUrl = new URL(rawUrl);

      if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
        return parsedUrl.toString();
      }
    } catch (error) {
      return '';
    }

    return '';
  }

  function getUserPageAvatarLetter(displayName) {
    return String(displayName || 'H').trim().slice(0, 1).toUpperCase() || 'H';
  }

  function getUserPageAvatarMediaHtml(profile, displayName) {
    const avatarUrl = getPublicProfileAvatarUrl(profile);

    if (avatarUrl) {
      return `
        <img
          class="user-page-avatar user-page-avatar-image"
          data-user-page-avatar="true"
          src="${escapeHtml(avatarUrl)}"
          decoding="async"
          alt="Аватар пользователя ${escapeHtml(displayName)}"
        >
      `;
    }

    return `
      <div class="user-page-avatar" data-user-page-avatar="true" aria-hidden="true">
        ${escapeHtml(getUserPageAvatarLetter(displayName))}
      </div>
    `;
  }

  function getUserPageAvatarHtml(profile, displayName) {
    return `
      <div class="user-page-avatar-shell" data-user-page-avatar-shell="true" data-profile-avatar-media-slot="true">
        ${getUserPageAvatarMediaHtml(profile, displayName)}
      </div>
    `;
  }

  function getPublicProfileDisplayName(profile) {
    return String(
      profile?.display_name ||
      profile?.default_display_name ||
      'Пользователь'
    ).trim();
  }

  function getPublicProfileHandle(profile) {
    return String(profile?.default_display_name || '').trim();
  }

  return {
    doesProfilePreferRussianPosters,
    getCurrentDisplayName,
    getCurrentUserPublicHandle,
    getPublicProfileAvatarUrl,
    getPublicProfileDisplayName,
    getPublicProfileHandle,
    getUserPageAvatarHtml,
    getUserPageAvatarLetter,
    getUserPageAvatarMediaHtml,
    isValidDisplayNameValue,
    normalizeDisplayNameValue
  };
}
