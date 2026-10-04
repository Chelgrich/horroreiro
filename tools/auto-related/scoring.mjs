import { AUTO_RELATED_PROVIDERS, DEFAULT_AUTO_RELATED_CONFIG } from './config.mjs';

const PROVIDER_WEIGHTS = Object.freeze({
  [AUTO_RELATED_PROVIDERS.tmdbRecommendations]: 'tmdbWeight',
  [AUTO_RELATED_PROVIDERS.traktRelated]: 'traktWeight'
});

function normalizeEvidenceRow(row = {}) {
  const sourceMovieId = String(row.source_movie_id || '').trim();
  const targetMovieId = String(row.target_movie_id || '').trim();
  const provider = String(row.provider || '').trim();
  const rank = Number(row.provider_rank);

  if (
    !sourceMovieId ||
    !targetMovieId ||
    sourceMovieId === targetMovieId ||
    !provider ||
    !Number.isSafeInteger(rank) ||
    rank <= 0
  ) {
    return null;
  }

  return {
    provider,
    provider_rank: rank,
    source_movie_id: sourceMovieId,
    target_movie_id: targetMovieId
  };
}

function getProviderWeight(config, provider) {
  const configKey = PROVIDER_WEIGHTS[provider];

  if (!configKey) {
    return 0;
  }

  const weight = Number(config[configKey]);
  return Number.isFinite(weight) && weight > 0 ? weight : 0;
}

function getConfidence(candidate) {
  if (candidate.providers.size > 1 || candidate.directions.size > 1) {
    return 'strong';
  }

  if (candidate.hasDirectSignal && candidate.bestDirectRank <= 10) {
    return 'normal';
  }

  return 'fallback';
}

function addCandidateContribution(candidates, candidateMovieId, row, direction, config) {
  const providerWeight = getProviderWeight(config, row.provider);

  if (!providerWeight) {
    return;
  }

  const directionWeight = direction === 'reverse'
    ? Number(config.reverseWeight || DEFAULT_AUTO_RELATED_CONFIG.reverseWeight)
    : 1;
  const rrfK = Number(config.rrfK || DEFAULT_AUTO_RELATED_CONFIG.rrfK);
  const score = providerWeight * directionWeight * (1 / (rrfK + row.provider_rank));
  const candidate = candidates.get(candidateMovieId) || {
    bestDirectRank: Number.POSITIVE_INFINITY,
    bestRank: Number.POSITIVE_INFINITY,
    directions: new Set(),
    hasDirectSignal: false,
    providers: new Set(),
    related_movie_id: candidateMovieId,
    score: 0
  };

  candidate.score += score;
  candidate.bestRank = Math.min(candidate.bestRank, row.provider_rank);
  candidate.providers.add(row.provider);
  candidate.directions.add(direction);

  if (direction === 'direct') {
    candidate.hasDirectSignal = true;
    candidate.bestDirectRank = Math.min(candidate.bestDirectRank, row.provider_rank);
  }

  candidates.set(candidateMovieId, candidate);
}

function buildCandidates(sourceMovieId, evidenceRows, config, cutoffs) {
  const candidates = new Map();

  evidenceRows.forEach(rawRow => {
    const row = normalizeEvidenceRow(rawRow);

    if (!row) {
      return;
    }

    if (row.source_movie_id === sourceMovieId && row.provider_rank <= cutoffs.direct) {
      addCandidateContribution(candidates, row.target_movie_id, row, 'direct', config);
      return;
    }

    if (row.target_movie_id === sourceMovieId && row.provider_rank <= cutoffs.reverse) {
      addCandidateContribution(candidates, row.source_movie_id, row, 'reverse', config);
    }
  });

  return candidates;
}

function sortCandidates(candidates, maxRelated) {
  return [...candidates.values()]
    .map(candidate => ({
      confidence: getConfidence(candidate),
      related_movie_id: candidate.related_movie_id,
      score: Number(candidate.score.toFixed(8))
    }))
    .sort((firstCandidate, secondCandidate) =>
      secondCandidate.score - firstCandidate.score ||
      String(firstCandidate.related_movie_id).localeCompare(String(secondCandidate.related_movie_id))
    )
    .slice(0, maxRelated)
    .map((candidate, index) => ({
      ...candidate,
      position: index
    }));
}

function normalizeOverrideRow(row = {}) {
  const movieId = String(row.movie_id || '').trim();
  const relatedMovieId = String(row.related_movie_id || '').trim();
  const action = String(row.action || '').trim();

  if (!movieId || !relatedMovieId || movieId === relatedMovieId || !action) {
    return null;
  }

  return {
    action,
    movie_id: movieId,
    related_movie_id: relatedMovieId
  };
}

function applyRecommendationOverrides(sourceMovieId, relatedRows = [], overrides = [], maxRelated) {
  const sourceOverrides = (overrides || [])
    .map(normalizeOverrideRow)
    .filter(row => row && row.movie_id === sourceMovieId);
  const hiddenMovieIds = new Set(
    sourceOverrides
      .filter(row => row.action === 'hide')
      .map(row => row.related_movie_id)
  );
  const includedMovieIds = [
    ...new Set(sourceOverrides
      .filter(row => row.action === 'include' && !hiddenMovieIds.has(row.related_movie_id))
      .map(row => row.related_movie_id))
  ];
  const rowsByRelatedMovieId = new Map(
    relatedRows
      .filter(row => !hiddenMovieIds.has(String(row.related_movie_id || '')))
      .map(row => [String(row.related_movie_id), row])
  );
  const maxScore = [...rowsByRelatedMovieId.values()]
    .reduce((score, row) => Math.max(score, Number(row.score || 0)), 0);
  const includedRows = includedMovieIds.map((relatedMovieId, index) => ({
    confidence: 'manual',
    related_movie_id: relatedMovieId,
    score: Number((maxScore + includedMovieIds.length - index + 1).toFixed(8))
  }));
  const nonIncludedRows = [...rowsByRelatedMovieId.values()]
    .filter(row => !includedMovieIds.includes(String(row.related_movie_id || '')));

  return [...includedRows, ...nonIncludedRows]
    .slice(0, maxRelated)
    .map((row, index) => ({
      ...row,
      position: index
    }));
}

export function mergeEvidenceRowsForScoring(
  existingEvidenceRows = [],
  freshEvidenceRows = [],
  replacedProviders = [],
  options = {}
) {
  const replacedProviderSet = new Set(replacedProviders.map(provider => String(provider || '').trim()).filter(Boolean));
  const replacedSourceMovieIds = new Set(
    freshEvidenceRows
      .map(row => String(row?.source_movie_id || '').trim())
      .filter(Boolean)
  );
  const explicitSourceMovieId = String(options.sourceMovieId || '').trim();

  if (explicitSourceMovieId) {
    replacedSourceMovieIds.add(explicitSourceMovieId);
  }

  const rowsByKey = new Map();

  [...existingEvidenceRows, ...freshEvidenceRows].forEach(rawRow => {
    const row = normalizeEvidenceRow(rawRow);

    if (!row) {
      return;
    }

    if (
      replacedProviderSet.has(row.provider) &&
      existingEvidenceRows.includes(rawRow) &&
      replacedSourceMovieIds.has(row.source_movie_id)
    ) {
      return;
    }

    const key = `${row.provider}:${row.source_movie_id}:${row.target_movie_id}`;
    const existingRow = rowsByKey.get(key);

    if (!existingRow || row.provider_rank < existingRow.provider_rank) {
      rowsByKey.set(key, row);
    }
  });

  return [...rowsByKey.values()];
}

export function scoreRelatedMovies(options = {}) {
  const sourceMovieId = String(options.sourceMovieId || '').trim();

  if (!sourceMovieId) {
    throw new Error('sourceMovieId is required to score related movies.');
  }

  const config = {
    ...DEFAULT_AUTO_RELATED_CONFIG,
    ...(options.config || {})
  };
  const maxRelated = Math.max(1, Number(config.maxRelated || DEFAULT_AUTO_RELATED_CONFIG.maxRelated));
  const minRelated = Math.max(0, Number(config.minRelated || DEFAULT_AUTO_RELATED_CONFIG.minRelated));
  const strictCandidates = buildCandidates(sourceMovieId, options.evidenceRows || [], config, {
    direct: Number(config.directRankCutoff || DEFAULT_AUTO_RELATED_CONFIG.directRankCutoff),
    reverse: Number(config.reverseRankCutoff || DEFAULT_AUTO_RELATED_CONFIG.reverseRankCutoff)
  });

  if (strictCandidates.size >= minRelated) {
    return applyRecommendationOverrides(
      sourceMovieId,
      sortCandidates(strictCandidates, maxRelated),
      options.overrides || [],
      maxRelated
    );
  }

  const fallbackCandidates = buildCandidates(sourceMovieId, options.evidenceRows || [], config, {
    direct: Number(config.fallbackDirectRankCutoff || DEFAULT_AUTO_RELATED_CONFIG.fallbackDirectRankCutoff),
    reverse: Number(config.fallbackReverseRankCutoff || DEFAULT_AUTO_RELATED_CONFIG.fallbackReverseRankCutoff)
  });

  return applyRecommendationOverrides(
    sourceMovieId,
    sortCandidates(fallbackCandidates, maxRelated),
    options.overrides || [],
    maxRelated
  );
}
