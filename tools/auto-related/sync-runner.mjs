import { AUTO_RELATED_PROVIDERS, readAutoRelatedConfig } from './config.mjs';
import { getMovieExternalIds } from './ids.mjs';
import {
  buildEvidenceRowsFromMatches,
  buildMovieMatchIndex,
  getMatchIndexSummary,
  matchRecommendationCandidates
} from './matching.mjs';
import { createRecommendationProviders } from './providers.mjs';
import { mergeEvidenceRowsForScoring, scoreRelatedMovies } from './scoring.mjs';
import { createSupabaseAutoRelatedAdapter } from './supabase-adapter.mjs';

const PROVIDER_SYNC_FIELDS = Object.freeze({
  [AUTO_RELATED_PROVIDERS.tmdbRecommendations]: {
    error: 'tmdb_last_error',
    externalCount: 'tmdb_external_count',
    lastSuccessAt: 'tmdb_last_success_at',
    matchedCount: 'tmdb_matched_count',
    statusCode: 'tmdb_last_status_code'
  },
  [AUTO_RELATED_PROVIDERS.traktRelated]: {
    error: 'trakt_last_error',
    externalCount: 'trakt_external_count',
    lastSuccessAt: 'trakt_last_success_at',
    matchedCount: 'trakt_matched_count',
    statusCode: 'trakt_last_status_code'
  }
});

function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value || {}).filter(([, item]) => item !== null && item !== undefined && item !== '')
  );
}

function getSourceMovie(index, options = {}) {
  const movieId = String(options.movieId || '').trim();
  const slug = String(options.slug || '').trim();

  if (movieId) {
    return index.byMovieId.get(movieId) || null;
  }

  if (!slug) {
    return null;
  }

  return [...index.byMovieId.values()].find(movie => movie.slug === slug) || null;
}

function toProviderMovie(sourceMovie) {
  return compactObject({
    id: sourceMovie.id,
    imdb_id: sourceMovie.imdb,
    imdb_url: sourceMovie.imdb ? `https://www.imdb.com/title/${sourceMovie.imdb}/` : '',
    slug: sourceMovie.slug,
    title: sourceMovie.title,
    tmdb_id: sourceMovie.tmdb,
    tmdb_url: sourceMovie.tmdb ? `https://www.themoviedb.org/movie/${sourceMovie.tmdb}` : '',
    trakt_id: sourceMovie.trakt,
    year: sourceMovie.year
  });
}

function getProviderSyncPatch(providerName, result, nowIso) {
  const fields = PROVIDER_SYNC_FIELDS[providerName];

  if (!fields) {
    return {};
  }

  if (result.status === 'error') {
    return {
      [fields.error]: result.error || 'Provider sync failed.',
      [fields.externalCount]: result.externalCount ?? 0,
      [fields.matchedCount]: result.matchedCount ?? 0,
      [fields.statusCode]: result.statusCode || null
    };
  }

  return {
    [fields.error]: null,
    [fields.externalCount]: result.externalCount ?? 0,
    [fields.lastSuccessAt]: nowIso,
    [fields.matchedCount]: result.matchedCount ?? 0,
    [fields.statusCode]: null
  };
}

function getProviderResultSummary(result) {
  return compactObject({
    error: result.error,
    externalCount: result.externalCount,
    matchedCount: result.matchedCount,
    persistedCount: result.persistedCount,
    provider: result.provider,
    status: result.status,
    statusCode: result.statusCode,
    unmatchedCount: result.unmatchedCount
  });
}

function getSyncStatePatch(sourceMovie, providerMovie, providerResults, nowIso) {
  const externalIds = {
    ...getMovieExternalIds(sourceMovie),
    ...getMovieExternalIds(providerMovie)
  };
  const errors = providerResults
    .filter(result => result.status === 'error')
    .map(result => `${result.provider}: ${result.error || 'Provider sync failed.'}`);
  const hasSuccess = providerResults.some(result => result.status === 'success');

  return {
    imdb_id: externalIds.imdb || null,
    movie_id: sourceMovie.id,
    recommendations_last_error: errors.length ? errors.join('; ') : null,
    recommendations_last_success_at: hasSuccess ? nowIso : null,
    recommendations_last_synced_at: nowIso,
    tmdb_id: externalIds.tmdb || null,
    trakt_id: externalIds.trakt || null,
    ...providerResults.reduce((patch, result) => ({
      ...patch,
      ...getProviderSyncPatch(result.provider, result, nowIso)
    }), {})
  };
}

async function resolveProviderMovieIds(provider, providerMovie) {
  if (
    provider.name === AUTO_RELATED_PROVIDERS.traktRelated &&
    !providerMovie.trakt_id &&
    typeof provider.resolveTraktId === 'function'
  ) {
    const traktId = await provider.resolveTraktId(providerMovie);

    if (traktId) {
      providerMovie.trakt_id = traktId;
    }
  }

  return providerMovie;
}

export async function syncOneAutoRelatedMovie(options = {}) {
  const config = options.config || readAutoRelatedConfig();
  const write = Boolean(options.write);
  const force = Boolean(options.force);

  if (write && !config.enabled && !force) {
    throw new Error('AUTO_RELATED_MOVIES=true is required for writes. Pass --force only for a deliberate one-off sync.');
  }

  const adapter = options.adapter || createSupabaseAutoRelatedAdapter(config);
  const providers = options.providers || createRecommendationProviders(config, options.providerOptions);
  const now = options.now || new Date();
  const nowIso = now.toISOString();
  const [movieRows, syncStateRows] = await Promise.all([
    adapter.fetchMovieMatchRows(),
    adapter.fetchRecommendationSyncStates()
  ]);
  const matchIndex = buildMovieMatchIndex(movieRows, syncStateRows);
  const sourceMovie = getSourceMovie(matchIndex, options);

  if (!sourceMovie) {
    const identity = options.movieId ? `movie_id=${options.movieId}` : `slug=${options.slug || ''}`;
    throw new Error(`Source movie not found in match index (${identity}).`);
  }

  const providerMovie = toProviderMovie(sourceMovie);
  const providerResults = [];
  const evidenceRows = [];
  const successfulProviders = [];

  for (const provider of providers) {
    try {
      await resolveProviderMovieIds(provider, providerMovie);

      const candidates = await provider.getRecommendations(providerMovie);
      const matched = matchRecommendationCandidates(candidates, matchIndex, {
        sourceMovieId: sourceMovie.id
      });
      const providerMatches = matched.matches.filter(match => match.candidate.provider === provider.name);
      const providerEvidenceRows = buildEvidenceRowsFromMatches(sourceMovie.id, providerMatches);

      if (write) {
        await adapter.replaceProviderEvidence(sourceMovie.id, provider.name, providerEvidenceRows);
      }

      evidenceRows.push(...providerEvidenceRows);
      successfulProviders.push(provider.name);
      providerResults.push({
        externalCount: candidates.length,
        matchedCount: providerMatches.length,
        persistedCount: write ? providerEvidenceRows.length : 0,
        provider: provider.name,
        status: 'success',
        unmatchedCount: matched.unmatched.length
      });
    } catch (error) {
      providerResults.push({
        error: error.message || String(error),
        externalCount: 0,
        matchedCount: 0,
        persistedCount: 0,
        provider: provider.name,
        status: 'error',
        statusCode: error.status || 0,
        unmatchedCount: 0
      });
    }
  }

  const syncStatePatch = getSyncStatePatch(sourceMovie, providerMovie, providerResults, nowIso);
  const existingEvidenceRows = typeof adapter.fetchRecommendationEvidenceForMovie === 'function'
    ? await adapter.fetchRecommendationEvidenceForMovie(sourceMovie.id)
    : [];
  const scoringEvidenceRows = mergeEvidenceRowsForScoring(
    existingEvidenceRows,
    evidenceRows,
    successfulProviders
  );
  const relatedRows = scoreRelatedMovies({
    config,
    evidenceRows: scoringEvidenceRows,
    sourceMovieId: sourceMovie.id
  });
  let materializedRows = [];

  if (write) {
    await adapter.upsertRecommendationSyncState(syncStatePatch);
    materializedRows = typeof adapter.replaceRelatedRows === 'function'
      ? await adapter.replaceRelatedRows(sourceMovie.id, relatedRows)
      : [];
  }

  return {
    dryRun: !write,
    evidenceRows,
    matchIndex: getMatchIndexSummary(matchIndex),
    providers: providerResults.map(getProviderResultSummary),
    sourceMovie: {
      id: sourceMovie.id,
      imdb: sourceMovie.imdb || null,
      slug: sourceMovie.slug,
      title: sourceMovie.title,
      tmdb: sourceMovie.tmdb || null,
      trakt: sourceMovie.trakt || null,
      year: sourceMovie.year
    },
    relatedRows,
    relatedWritten: write,
    savedRelatedRows: materializedRows,
    syncStatePatch,
    syncStateWritten: write
  };
}

export function formatAutoRelatedSyncSummary(result) {
  return {
    dryRun: result.dryRun,
    evidenceRows: result.evidenceRows.length,
    matchIndex: result.matchIndex,
    providers: result.providers,
    relatedRows: result.relatedRows.length,
    relatedWritten: result.relatedWritten,
    sourceMovie: result.sourceMovie,
    syncStateWritten: result.syncStateWritten
  };
}
