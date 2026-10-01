import { readAutoRelatedConfig } from '../../../tools/auto-related/config.mjs';
import {
  formatAutoRelatedSyncSummary,
  syncOneAutoRelatedMovie
} from '../../../tools/auto-related/sync-runner.mjs';

const JSON_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'Content-Type': 'application/json; charset=UTF-8'
};

function jsonResponse(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS
  });
}

function getSupabaseBaseUrl(env) {
  return String(env.SUPABASE_URL || '').replace(/\/$/, '');
}

function getServiceRoleKey(env) {
  return env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY || '';
}

function getBearerToken(request) {
  const authorization = request.headers.get('Authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  return match ? match[1].trim() : '';
}

async function readSupabaseJson(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function verifyRequester(supabaseUrl, anonKey, accessToken) {
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`
    }
  });
  const payload = await readSupabaseJson(response);

  if (!response.ok || !payload?.id) {
    return {
      error: payload?.message || 'Admin session is invalid.',
      user: null
    };
  }

  return {
    error: '',
    user: payload
  };
}

async function fetchRequesterRole(supabaseUrl, serviceRoleKey, requesterId) {
  const url = new URL(`${supabaseUrl}/rest/v1/profiles`);

  url.searchParams.set('id', `eq.${requesterId}`);
  url.searchParams.set('select', 'role');
  url.searchParams.set('limit', '1');

  const response = await fetch(url.toString(), {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`
    }
  });
  const payload = await readSupabaseJson(response);

  if (!response.ok) {
    return {
      error: payload?.message || 'Could not verify admin role.',
      role: ''
    };
  }

  return {
    error: '',
    role: Array.isArray(payload) ? payload[0]?.role || '' : ''
  };
}

export async function onRequestPost(context) {
  const { env, params, request } = context;
  const supabaseUrl = getSupabaseBaseUrl(env);
  const anonKey = env.SUPABASE_ANON_KEY || '';
  const serviceRoleKey = getServiceRoleKey(env);
  const movieId = String(params.movieId || '').trim();
  const accessToken = getBearerToken(request);

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse(500, {
      message: 'Supabase server variables are not configured for admin auto-related sync.',
      ok: false
    });
  }

  if (!movieId) {
    return jsonResponse(400, {
      message: 'movieId is required.',
      ok: false
    });
  }

  if (!accessToken) {
    return jsonResponse(401, {
      message: 'Active admin session is required.',
      ok: false
    });
  }

  const requesterResult = await verifyRequester(supabaseUrl, anonKey, accessToken);

  if (!requesterResult.user) {
    return jsonResponse(401, {
      message: requesterResult.error,
      ok: false
    });
  }

  const roleResult = await fetchRequesterRole(supabaseUrl, serviceRoleKey, requesterResult.user.id);

  if (roleResult.error) {
    return jsonResponse(500, {
      message: roleResult.error,
      ok: false
    });
  }

  if (roleResult.role !== 'admin') {
    return jsonResponse(403, {
      message: 'Admin access is required.',
      ok: false
    });
  }

  try {
    const config = readAutoRelatedConfig({
      ...env,
      AUTO_RELATED_MOVIES: 'true'
    });
    const result = await syncOneAutoRelatedMovie({
      config,
      force: true,
      movieId,
      write: true
    });

    return jsonResponse(200, {
      ok: true,
      result: formatAutoRelatedSyncSummary(result)
    });
  } catch (error) {
    console.error('Admin auto-related sync failed:', error);

    return jsonResponse(500, {
      message: error.message || 'Auto-related sync failed.',
      ok: false
    });
  }
}
