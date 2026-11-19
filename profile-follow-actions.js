const FOLLOW_NOTIFICATION_PREFERENCE_KEYS = new Set([
  'notify_ratings',
  'notify_watchlist',
  'notify_reviews'
]);

export function createProfileFollowActions(context = {}) {
  const {
    supabaseClient,
    fetchSupabaseIdBatches,
    getCurrentUser,
    throwIfSupabaseError,
    isNotificationsUnavailableError
  } = context;

  let currentFollows = null;

  function resetCurrentUserFollows() {
    currentFollows = null;
  }

  function getCurrentFollows() {
    const viewerId = normalizeId(getCurrentUser()?.id);
    if (currentFollows?.viewerId !== viewerId) {
      currentFollows = { viewerId, ids: new Set(), readVersion: 0, mutationVersion: 0 };
    }
    return currentFollows;
  }

  function isCurrentUserFollowingProfile(profileId) {
    return getCurrentFollows().ids.has(normalizeId(profileId));
  }

  async function setProfileFollowing({ followerId, followingId, isFollowing }) {
    const state = getCurrentFollows();
    const actorId = normalizeId(followerId);
    const targetId = normalizeId(followingId);
    if (!actorId || !targetId || state.viewerId !== actorId) return false;
    const result = await (isFollowing ? followProfile : unfollowProfile)({
      followerId: actorId, followingId: targetId
    });
    if (!result.ok || getCurrentFollows() !== state) return false;
    state.mutationVersion += 1;
    if (isFollowing) state.ids.add(targetId);
    else state.ids.delete(targetId);
    return true;
  }

  function requireSupabaseClient() {
    if (!supabaseClient) {
      throw new Error('Supabase client is not available.');
    }

    return supabaseClient;
  }

  function normalizeId(value) {
    return String(value || '').trim();
  }

  function normalizeUniqueIds(values = []) {
    return [...new Set(
      (Array.isArray(values) ? values : [])
        .map(normalizeId)
        .filter(Boolean)
    )];
  }

  async function fetchProfileFollowRows({ followerId, includeCreatedAt = false } = {}) {
    const client = requireSupabaseClient();
    const normalizedFollowerId = normalizeId(followerId);

    if (!normalizedFollowerId) {
      return [];
    }

    const state = getCurrentFollows();
    const readVersion = ++state.readVersion;
    const mutationVersion = state.mutationVersion;

    let query = client
      .from('user_profile_follows')
      .select(includeCreatedAt ? 'following_id, created_at' : 'following_id')
      .eq('follower_id', normalizedFollowerId);

    if (includeCreatedAt) {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    throwIfSupabaseError(error);

    if (getCurrentFollows() === state && state.viewerId === normalizedFollowerId &&
        state.readVersion === readVersion && state.mutationVersion === mutationVersion) {
      state.ids = new Set((data || []).map(row => normalizeId(row.following_id)).filter(Boolean));
    }

    return data || [];
  }

  async function followProfile({ followerId, followingId }) {
    const client = requireSupabaseClient();
    const normalizedFollowerId = normalizeId(followerId);
    const normalizedFollowingId = normalizeId(followingId);

    if (!normalizedFollowerId || !normalizedFollowingId) {
      return { ok: false, reason: 'missing-profile-id' };
    }

    const { error } = await client
      .from('user_profile_follows')
      .insert({
        follower_id: normalizedFollowerId,
        following_id: normalizedFollowingId
      });

    if (error && error.code !== '23505') {
      throw error;
    }

    return {
      ok: true,
      alreadyExists: Boolean(error && error.code === '23505')
    };
  }

  async function unfollowProfile({ followerId, followingId }) {
    const client = requireSupabaseClient();
    const normalizedFollowerId = normalizeId(followerId);
    const normalizedFollowingId = normalizeId(followingId);

    if (!normalizedFollowerId || !normalizedFollowingId) {
      return { ok: false, reason: 'missing-profile-id' };
    }

    const { error } = await client
      .from('user_profile_follows')
      .delete()
      .eq('follower_id', normalizedFollowerId)
      .eq('following_id', normalizedFollowingId);

    throwIfSupabaseError(error);

    return { ok: true };
  }

  async function fetchFollowNotificationPreferences({ followerId, profileIds = [] } = {}) {
    const client = requireSupabaseClient();
    const normalizedFollowerId = normalizeId(followerId);
    const normalizedProfileIds = normalizeUniqueIds(profileIds);

    if (!normalizedFollowerId || !normalizedProfileIds.length) {
      return {
        preferencesByProfileId: new Map(),
        arePreferencesAvailable: true
      };
    }

    const { data, error } = await fetchSupabaseIdBatches(normalizedProfileIds, ids => client
      .from('user_follow_notification_preferences')
      .select('following_id, notify_ratings, notify_watchlist, notify_reviews')
      .eq('follower_id', normalizedFollowerId)
      .in('following_id', ids));

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

  async function updateFollowNotificationPreference({ followerId, followingId, key, value }) {
    const client = requireSupabaseClient();
    const normalizedFollowerId = normalizeId(followerId);
    const normalizedFollowingId = normalizeId(followingId);
    const normalizedKey = String(key || '').trim();

    if (!normalizedFollowerId || !normalizedFollowingId || !FOLLOW_NOTIFICATION_PREFERENCE_KEYS.has(normalizedKey)) {
      return { ok: false, reason: 'invalid-preference' };
    }

    const { error } = await client
      .from('user_follow_notification_preferences')
      .upsert({
        follower_id: normalizedFollowerId,
        following_id: normalizedFollowingId,
        [normalizedKey]: Boolean(value)
      }, {
        onConflict: 'follower_id,following_id'
      });

    if (error) {
      if (isNotificationsUnavailableError(error)) {
        return {
          ok: false,
          arePreferencesAvailable: false,
          error
        };
      }

      throw error;
    }

    return {
      ok: true,
      arePreferencesAvailable: true
    };
  }

  return {
    isCurrentUserFollowingProfile,
    resetCurrentUserFollows,
    setProfileFollowing,
    fetchFollowNotificationPreferences,
    fetchProfileFollowRows,
    updateFollowNotificationPreference
  };
}
