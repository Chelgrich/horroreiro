const SAFE_USER_PROFILE_LOOKUP_HANDLE_RE = /^[A-Za-z0-9_-]{3,80}$/;
const PUBLIC_PROFILE_REQUIRED_SELECT = 'id, display_name, default_display_name';
const CURRENT_USER_PROFILE_REQUIRED_SELECT = 'role, display_name, default_display_name';
const AVATAR_OPTIONAL_COLUMNS = ['avatar_url'];
const CURRENT_USER_PROFILE_OPTIONAL_COLUMNS = ['avatar_url', 'prefer_russian_posters'];

export function createProfileDataActions(context = {}) {
  const {
    supabaseClient,
    withAuthProfileRequestTimeout,
    throwIfSupabaseError,
    onMissingOptionalColumn = () => {}
  } = context;

  const profilesById = new Map();
  const profileIdsByHandle = new Map();

  function cachePublicProfileRows(rows = []) {
    (Array.isArray(rows) ? rows : [rows]).filter(Boolean).forEach(profile => {
      const id = String(profile.id || '').trim();
      if (!id) return;
      const previous = profilesById.get(id);
      const merged = { ...previous, ...profile, id };
      const handle = String(merged.default_display_name || '').trim();
      if (previous?.default_display_name && previous.default_display_name !== handle) {
        profileIdsByHandle.delete(previous.default_display_name);
      }
      profilesById.set(id, merged);
      if (handle) profileIdsByHandle.set(handle, id);
    });
  }

  function requireSupabaseClient() {
    if (!supabaseClient) {
      throw new Error('Supabase client is not available.');
    }

    return supabaseClient;
  }

  function isSafeUserProfileLookupHandle(handle) {
    return SAFE_USER_PROFILE_LOOKUP_HANDLE_RE.test(String(handle || '').trim());
  }

  function isMissingProfileOptionalColumnError(error) {
    const message = String(error?.message || '').toLowerCase();

    return (
      error?.code === '42703' ||
      error?.code === 'PGRST204' ||
      message.includes('column') && message.includes('schema cache')
    );
  }

  function getMissingProfileOptionalColumnName(error, optionalColumns = []) {
    const message = String(error?.message || error?.details || error?.hint || '').toLowerCase();
    const normalizedOptionalColumns = optionalColumns
      .map(columnName => String(columnName || '').trim())
      .filter(Boolean);
    const explicitMissingColumn = normalizedOptionalColumns.find(columnName =>
      message.includes(columnName.toLowerCase())
    );

    if (explicitMissingColumn) {
      return explicitMissingColumn;
    }

    if (!isMissingProfileOptionalColumnError(error)) {
      return '';
    }

    if (error?.code === '42703' || error?.code === 'PGRST204') {
      return normalizedOptionalColumns[normalizedOptionalColumns.length - 1] || '';
    }

    return '';
  }

  async function runProfileSelectWithOptionalColumns(createQuery, requiredSelectColumns, optionalColumns = []) {
    let activeOptionalColumns = optionalColumns
      .map(columnName => String(columnName || '').trim())
      .filter(Boolean);

    while (true) {
      const selectColumns = [
        String(requiredSelectColumns || '').trim(),
        ...activeOptionalColumns
      ].filter(Boolean).join(', ');
      const { data, error } = await createQuery(selectColumns);

      if (!error) {
        return data || null;
      }

      const missingColumn = getMissingProfileOptionalColumnName(error, activeOptionalColumns);

      if (!missingColumn) {
        throwIfSupabaseError(error);
        return data || null;
      }

      onMissingOptionalColumn(missingColumn);
      activeOptionalColumns = activeOptionalColumns.filter(columnName => columnName !== missingColumn);
    }
  }

  async function runProfileSelectWithOptionalAvatar(createQuery) {
    return runProfileSelectWithOptionalColumns(
      createQuery,
      PUBLIC_PROFILE_REQUIRED_SELECT,
      AVATAR_OPTIONAL_COLUMNS
    );
  }

  async function fetchCurrentUserProfile(userId) {
    const client = requireSupabaseClient();
    const normalizedUserId = String(userId || '').trim();

    if (!normalizedUserId) {
      return null;
    }

    return withAuthProfileRequestTimeout(
      runProfileSelectWithOptionalColumns(
        selectColumns => client
          .from('profiles')
          .select(selectColumns)
          .eq('id', normalizedUserId)
          .single(),
        CURRENT_USER_PROFILE_REQUIRED_SELECT,
        CURRENT_USER_PROFILE_OPTIONAL_COLUMNS
      ),
      'Не удалось загрузить профиль пользователя. Проверь соединение и попробуй обновить страницу.'
    );
  }

  async function fetchPublicProfileByHandle(handle) {
    const client = requireSupabaseClient();
    const normalizedHandle = String(handle || '').trim();

    if (!normalizedHandle || !isSafeUserProfileLookupHandle(normalizedHandle)) {
      return null;
    }

    const cached = profilesById.get(profileIdsByHandle.get(normalizedHandle));
    if (cached) return cached;

    const profile = await runProfileSelectWithOptionalAvatar(
      selectColumns => client
        .from('profiles')
        .select(selectColumns)
        .eq('default_display_name', normalizedHandle)
        .maybeSingle()
    );
    if (!profile) return null;
    cachePublicProfileRows([{ ...profile, ...profilesById.get(String(profile.id)) }]);
    return profilesById.get(String(profile.id));
  }

  async function fetchPublicProfilesByIds(profileIds = []) {
    const client = requireSupabaseClient();
    const normalizedProfileIds = [...new Set(
      (Array.isArray(profileIds) ? profileIds : [])
        .map(profileId => String(profileId || '').trim())
        .filter(Boolean)
    )];

    if (!normalizedProfileIds.length) {
      return [];
    }

    const missingIds = normalizedProfileIds.filter(id => !profilesById.has(id));
    if (missingIds.length) {
      const profiles = await runProfileSelectWithOptionalAvatar(
        selectColumns => client
          .from('profiles')
          .select(selectColumns)
          .in('id', missingIds)
      );
      cachePublicProfileRows((profiles || []).map(profile => ({
        ...profile, ...profilesById.get(String(profile.id))
      })));
    }
    return normalizedProfileIds.map(id => profilesById.get(id)).filter(Boolean);
  }

  return {
    cachePublicProfileRows,
    fetchCurrentUserProfile,
    fetchPublicProfileByHandle,
    fetchPublicProfilesByIds,
    getMissingProfileOptionalColumnName,
    isMissingProfileOptionalColumnError,
    isSafeUserProfileLookupHandle
  };
}
