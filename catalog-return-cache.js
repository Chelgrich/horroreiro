function getStorageValue(storage, key) {
  return storage?.getItem?.(key) ?? null;
}

function setStorageValue(storage, key, value) {
  storage?.setItem?.(key, value);
}

function removeStorageValue(storage, key) {
  storage?.removeItem?.(key);
}

function getStableStringHash(value) {
  const text = String(value || '');
  let hash = 2166136261;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

function notifyError(onError, error) {
  if (typeof onError === 'function') {
    onError(error);
  }
}

export function markCatalogFastReturnPending({
  storage = globalThis.sessionStorage,
  key,
  onError = null
} = {}) {
  try {
    setStorageValue(storage, key, '1');
    return true;
  } catch (error) {
    notifyError(onError, error);
    return false;
  }
}

export function consumeCatalogFastReturnPending({
  storage = globalThis.sessionStorage,
  key,
  onError = null
} = {}) {
  try {
    const hasPendingFastReturn = getStorageValue(storage, key) === '1';

    removeStorageValue(storage, key);

    return hasPendingFastReturn;
  } catch (error) {
    notifyError(onError, error);
    return false;
  }
}

export function canUseCatalogSnapshotForPosterPreference(snapshot, preferRussianPosters) {
  return Boolean(snapshot?.preferRussianPosters) === Boolean(preferRussianPosters);
}

export function getCatalogSessionSnapshotSignature(snapshot) {
  if (!snapshot) {
    return '';
  }

  const sortByMovieAndUser = (firstItem, secondItem) => {
    const movieCompare = String(firstItem?.movie_id || '').localeCompare(String(secondItem?.movie_id || ''));

    if (movieCompare !== 0) {
      return movieCompare;
    }

    return String(firstItem?.user_id || '').localeCompare(String(secondItem?.user_id || ''));
  };

  return JSON.stringify({
    version: snapshot.version,
    buildVersion: snapshot.buildVersion,
    dataMutationStamp: snapshot.dataMutationStamp || '',
    userId: snapshot.userId || null,
    movies: snapshot.movies || [],
    movieRatings: [...(snapshot.movieRatings || [])].sort(sortByMovieAndUser),
    movieRatingStats: [...(snapshot.movieRatingStats || [])].sort((firstItem, secondItem) =>
      String(firstItem?.movie_id || '').localeCompare(String(secondItem?.movie_id || ''))
    ),
    movieWatchlist: [...(snapshot.movieWatchlist || [])].sort(sortByMovieAndUser),
    reviewedMovieIds: [...(snapshot.reviewedMovieIds || [])].sort()
  });
}

export function getCatalogDataSignatureHash(snapshot, {
  forceRefresh = false,
  cache = null
} = {}) {
  if (!snapshot) {
    return '';
  }

  if (!forceRefresh && typeof snapshot.dataSignatureHash === 'string' && snapshot.dataSignatureHash) {
    return snapshot.dataSignatureHash;
  }

  if (!forceRefresh && cache?.get) {
    const cachedHash = cache.get(snapshot);

    if (cachedHash) {
      return cachedHash;
    }
  }

  const signature = getCatalogSessionSnapshotSignature(snapshot);
  const nextHash = `${signature.length}:${getStableStringHash(signature)}`;

  cache?.set?.(snapshot, nextHash);

  if (typeof snapshot === 'object') {
    snapshot.dataSignatureHash = nextHash;
  }

  return nextHash;
}

export function readCatalogSnapshot({
  storage = globalThis.sessionStorage,
  key,
  allowStale = false,
  maxAgeMs = 0,
  isValid = null,
  now = Date.now,
  onError = null
} = {}) {
  try {
    const rawSnapshot = getStorageValue(storage, key);

    if (!rawSnapshot) {
      return null;
    }

    const snapshot = JSON.parse(rawSnapshot);
    const snapshotAge = Number(now()) - Number(snapshot?.savedAt || 0);
    const isExpired = !allowStale && Number.isFinite(maxAgeMs) && maxAgeMs > 0 && snapshotAge > maxAgeMs;
    const isSnapshotValid = typeof isValid === 'function' ? isValid(snapshot) : true;

    if (isExpired || !isSnapshotValid) {
      removeStorageValue(storage, key);
      return null;
    }

    return snapshot;
  } catch (error) {
    notifyError(onError, error);
    removeStorageValue(storage, key);
    return null;
  }
}

export function writeCatalogSnapshot(snapshot, {
  storage = globalThis.sessionStorage,
  key,
  removeWhenEmpty = false,
  removeOnError = false,
  decorateSnapshot = null,
  onError = null
} = {}) {
  try {
    if (!snapshot) {
      if (removeWhenEmpty) {
        removeStorageValue(storage, key);
      }

      return false;
    }

    const nextSnapshot = typeof decorateSnapshot === 'function'
      ? decorateSnapshot(snapshot)
      : snapshot;

    setStorageValue(storage, key, JSON.stringify(nextSnapshot));
    return true;
  } catch (error) {
    notifyError(onError, error);

    if (removeOnError) {
      removeStorageValue(storage, key);
    }

    return false;
  }
}

export function createCatalogDomSnapshotPayload({
  version,
  buildVersion,
  userId = null,
  preferRussianPosters = false,
  renderStateSignature = '',
  dataSignatureHash = '',
  moviesResultCountText = '',
  containerHtml = '',
  savedAt = Date.now()
} = {}) {
  return {
    version,
    buildVersion,
    savedAt,
    userId,
    preferRussianPosters: Boolean(preferRussianPosters),
    viewMode: 'list',
    renderStateSignature,
    dataSignatureHash,
    moviesResultCountText,
    containerHtml
  };
}
