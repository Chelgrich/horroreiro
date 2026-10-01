import { readAutoRelatedConfig } from './config.mjs';

const DEFAULT_MOVIE_MATCH_SELECT = [
  'id',
  'slug',
  'title',
  'original_title',
  'year',
  'imdb_url',
  'tmdb_url'
].join(',');

const DEFAULT_SYNC_STATE_SELECT = [
  'movie_id',
  'tmdb_id',
  'imdb_id',
  'trakt_id',
  'recommendations_last_synced_at',
  'recommendations_last_success_at',
  'recommendations_last_error',
  'trakt_last_success_at',
  'tmdb_last_success_at'
].join(',');

export class SupabaseAutoRelatedError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'SupabaseAutoRelatedError';
    this.status = details.status || 0;
    this.path = details.path || '';
  }
}

function assertSupabaseConfig(config) {
  if (!config.supabaseUrl) {
    throw new Error('SUPABASE_URL is required for automatic related Supabase adapter.');
  }

  if (!config.supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for automatic related Supabase writes.');
  }
}

function buildRestUrl(config, path, searchParams = {}) {
  const normalizedPath = String(path || '').replace(/^\/+/, '');
  const url = new URL(`/rest/v1/${normalizedPath}`, config.supabaseUrl);

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
}

function getRangeHeader(offset, limit) {
  return `${offset}-${offset + limit - 1}`;
}

export class SupabaseAutoRelatedAdapter {
  constructor(config = readAutoRelatedConfig(), options = {}) {
    assertSupabaseConfig(config);

    this.config = config;
    this.fetchImpl = options.fetchImpl || globalThis.fetch;
    this.pageSize = config.supabaseRestPageSize || 1000;
  }

  getHeaders(extraHeaders = {}) {
    return {
      apikey: this.config.supabaseServiceRoleKey,
      Authorization: `Bearer ${this.config.supabaseServiceRoleKey}`,
      ...extraHeaders
    };
  }

  async request(path, options = {}) {
    const url = buildRestUrl(this.config, path, options.searchParams);
    const response = await this.fetchImpl(url, {
      body: options.body,
      headers: this.getHeaders({
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {})
      }),
      method: options.method || 'GET'
    });

    const text = await response.text();

    if (!response.ok) {
      throw new SupabaseAutoRelatedError(
        `Supabase request failed with HTTP ${response.status}: ${text || response.statusText}`,
        {
          path,
          status: response.status
        }
      );
    }

    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      throw new SupabaseAutoRelatedError('Supabase returned invalid JSON.', {
        path,
        status: response.status
      });
    }
  }

  async fetchAllRows(path, searchParams = {}, options = {}) {
    const rows = [];
    const pageSize = options.pageSize || this.pageSize;

    for (let offset = 0; ; offset += pageSize) {
      const pageRows = await this.request(path, {
        headers: {
          Range: getRangeHeader(offset, pageSize),
          Prefer: 'count=none'
        },
        searchParams
      });

      if (!Array.isArray(pageRows)) {
        throw new SupabaseAutoRelatedError(`Expected an array response for ${path}.`, { path });
      }

      rows.push(...pageRows);

      if (pageRows.length < pageSize) {
        break;
      }
    }

    return rows;
  }

  async fetchMovieMatchRows() {
    return this.fetchAllRows('movies', {
      order: 'title.asc,id.asc',
      select: DEFAULT_MOVIE_MATCH_SELECT
    });
  }

  async fetchRecommendationSyncStates() {
    return this.fetchAllRows('movie_recommendation_sync_state', {
      order: 'movie_id.asc',
      select: DEFAULT_SYNC_STATE_SELECT
    });
  }

  async upsertRecommendationSyncState(row) {
    if (!row?.movie_id) {
      throw new Error('movie_id is required to upsert recommendation sync state.');
    }

    const payload = {
      movie_id: row.movie_id,
      ...(row.tmdb_id !== undefined ? { tmdb_id: row.tmdb_id || null } : {}),
      ...(row.imdb_id !== undefined ? { imdb_id: row.imdb_id || null } : {}),
      ...(row.trakt_id !== undefined ? { trakt_id: row.trakt_id || null } : {}),
      ...(row.recommendations_last_synced_at !== undefined ? { recommendations_last_synced_at: row.recommendations_last_synced_at || null } : {}),
      ...(row.recommendations_last_success_at !== undefined ? { recommendations_last_success_at: row.recommendations_last_success_at || null } : {}),
      ...(row.recommendations_last_error !== undefined ? { recommendations_last_error: row.recommendations_last_error || null } : {}),
      ...(row.trakt_last_success_at !== undefined ? { trakt_last_success_at: row.trakt_last_success_at || null } : {}),
      ...(row.trakt_last_error !== undefined ? { trakt_last_error: row.trakt_last_error || null } : {}),
      ...(row.trakt_last_status_code !== undefined ? { trakt_last_status_code: row.trakt_last_status_code || null } : {}),
      ...(row.trakt_external_count !== undefined ? { trakt_external_count: row.trakt_external_count ?? null } : {}),
      ...(row.trakt_matched_count !== undefined ? { trakt_matched_count: row.trakt_matched_count ?? null } : {}),
      ...(row.tmdb_last_success_at !== undefined ? { tmdb_last_success_at: row.tmdb_last_success_at || null } : {}),
      ...(row.tmdb_last_error !== undefined ? { tmdb_last_error: row.tmdb_last_error || null } : {}),
      ...(row.tmdb_last_status_code !== undefined ? { tmdb_last_status_code: row.tmdb_last_status_code || null } : {}),
      ...(row.tmdb_external_count !== undefined ? { tmdb_external_count: row.tmdb_external_count ?? null } : {}),
      ...(row.tmdb_matched_count !== undefined ? { tmdb_matched_count: row.tmdb_matched_count ?? null } : {})
    };

    return this.request('movie_recommendation_sync_state', {
      body: JSON.stringify(payload),
      headers: {
        Prefer: 'resolution=merge-duplicates,return=representation'
      },
      method: 'POST',
      searchParams: {
        on_conflict: 'movie_id'
      }
    });
  }

  async replaceProviderEvidence(sourceMovieId, provider, evidenceRows = []) {
    const rows = evidenceRows.map(row => ({
      target_movie_id: row.target_movie_id,
      provider_rank: row.provider_rank
    }));

    return this.request('rpc/replace_movie_recommendation_provider_evidence', {
      body: JSON.stringify({
        p_provider: provider,
        p_rows: rows,
        p_source_movie_id: sourceMovieId
      }),
      method: 'POST'
    });
  }
}

export function createSupabaseAutoRelatedAdapter(config, options) {
  return new SupabaseAutoRelatedAdapter(config, options);
}
