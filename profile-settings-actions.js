export function createProfileSettingsActions(context = {}) {
  const {
    supabaseClient,
    avatarStorageBucket = 'avatars',
    avatarStoragePublicPath = `/storage/v1/object/public/${avatarStorageBucket}/`,
    avatarOutputType = 'image/jpeg',
    normalizeDisplayNameValue,
    withAuthRequestTimeout,
    withAuthProfileRequestTimeout,
    ensureActiveSessionForWrite,
    throwIfSupabaseError
  } = context;

  function requireSupabaseClient() {
    if (!supabaseClient) {
      throw new Error('Supabase client is not available.');
    }

    return supabaseClient;
  }

  function requireProfileUser(userId) {
    const user = ensureActiveSessionForWrite();
    if (!userId || user?.id !== userId) {
      throw new Error('Аккаунт изменился. Открой настройки профиля заново.');
    }
    return user;
  }

  async function isDisplayNameAvailable(displayName, excludeUserId = null) {
    const client = requireSupabaseClient();
    const normalizedDisplayName = normalizeDisplayNameValue(displayName);

    let query = client
      .from('profiles')
      .select('id')
      .eq('display_name_normalized', normalizedDisplayName);

    if (excludeUserId) {
      query = query.neq('id', excludeUserId);
    }

    const { data, error } = await withAuthProfileRequestTimeout(
      query.limit(1),
      'Не удалось проверить никнейм. Проверь соединение и попробуй снова.'
    );

    if (error) {
      throw error;
    }

    return !data || data.length === 0;
  }

  async function saveDisplayName({ currentUser, nextDisplayName }) {
    const client = requireSupabaseClient();
    const userId = String(currentUser?.id || '').trim();

    if (!userId) {
      throw new Error('Активный пользователь не найден.');
    }

    requireProfileUser(userId);
    const isAvailable = await isDisplayNameAvailable(nextDisplayName, userId);

    if (!isAvailable) {
      return {
        ok: false,
        reason: 'display-name-unavailable'
      };
    }

    requireProfileUser(userId);
    const { error: authError } = await withAuthRequestTimeout(
      client.auth.updateUser({
        data: {
          ...(currentUser?.user_metadata || {}),
          display_name: nextDisplayName
        }
      }),
      'Не удалось обновить никнейм в аккаунте. Проверь соединение и попробуй снова.'
    );

    if (authError) {
      return {
        ok: false,
        reason: 'auth-update-failed',
        error: authError
      };
    }

    requireProfileUser(userId);
    const { error: profileError } = await withAuthProfileRequestTimeout(
      client
        .from('profiles')
        .update({
          display_name: nextDisplayName
        })
        .eq('id', userId),
      'Не удалось сохранить никнейм в профиле. Проверь соединение и попробуй снова.'
    );

    if (profileError) {
      return {
        ok: false,
        reason: 'profile-update-failed',
        error: profileError
      };
    }

    return { ok: true };
  }

  async function savePosterPreference({ currentUserId, nextPreferRussianPosters }) {
    const client = requireSupabaseClient();
    const userId = String(currentUserId || '').trim();

    if (!userId) {
      throw new Error('Активный пользователь не найден.');
    }

    requireProfileUser(userId);

    const { error } = await withAuthProfileRequestTimeout(
      client
        .from('profiles')
        .update({ prefer_russian_posters: Boolean(nextPreferRussianPosters) })
        .eq('id', userId),
      'Не удалось сохранить настройку постеров. Проверь соединение и попробуй снова.'
    );

    return { error };
  }

  async function verifyProfilePassword({ userId, email, currentPassword }) {
    const client = requireSupabaseClient();
    requireProfileUser(userId);

    return withAuthRequestTimeout(
      client.auth.signInWithPassword({
        email,
        password: currentPassword
      }),
      'Не удалось проверить старый пароль. Проверь соединение и попробуй снова.'
    );
  }

  async function updateProfilePassword({ userId, nextPassword }) {
    const client = requireSupabaseClient();
    requireProfileUser(userId);

    return withAuthRequestTimeout(
      client.auth.updateUser({
        password: nextPassword
      }),
      'Не удалось обновить пароль. Проверь соединение и попробуй снова.'
    );
  }

  function extractAvatarStoragePath(publicUrl) {
    if (!publicUrl) {
      return null;
    }

    let parsedUrl = null;

    try {
      parsedUrl = new URL(publicUrl);
    } catch (error) {
      return null;
    }

    const path = parsedUrl.pathname;

    if (!path.includes(avatarStoragePublicPath)) {
      return null;
    }

    return path.split(avatarStoragePublicPath)[1] || null;
  }

  async function uploadAvatarBlob(blob, userId) {
    const client = requireSupabaseClient();
    requireProfileUser(userId);

    const storagePath = `${userId}/avatar-${Date.now()}.jpg`;
    const { error: uploadError } = await client.storage
      .from(avatarStorageBucket)
      .upload(storagePath, blob, {
        cacheControl: '31536000',
        contentType: avatarOutputType,
        upsert: false
      });

    throwIfSupabaseError(uploadError);

    const { data } = client.storage
      .from(avatarStorageBucket)
      .getPublicUrl(storagePath);

    return data?.publicUrl || '';
  }

  async function updateProfileAvatarUrl({ userId, avatarUrl }) {
    const client = requireSupabaseClient();
    requireProfileUser(userId);

    const { error } = await client
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId);

    throwIfSupabaseError(error);
  }

  async function clearProfileAvatarUrl({ userId }) {
    const client = requireSupabaseClient();

    requireProfileUser(userId);

    const { error } = await client
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', userId);

    throwIfSupabaseError(error);
  }

  async function deleteAvatarFileByUrl(publicUrl) {
    const client = requireSupabaseClient();
    const storagePath = extractAvatarStoragePath(publicUrl);

    if (!storagePath) {
      return;
    }

    const { error } = await client.storage
      .from(avatarStorageBucket)
      .remove([storagePath]);

    if (error) {
      console.warn('Не удалось удалить старый аватар:', error);
    }
  }

  return {
    clearProfileAvatarUrl,
    deleteAvatarFileByUrl,
    extractAvatarStoragePath,
    isDisplayNameAvailable,
    saveDisplayName,
    savePosterPreference,
    updateProfileAvatarUrl,
    updateProfilePassword,
    uploadAvatarBlob,
    verifyProfilePassword
  };
}
