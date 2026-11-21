const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=UTF-8',
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
};

function jsonResponse(status, payload) {
  return new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS });
}

export async function onRequestGet({ env, params }) {
  const userId = String(params.userId || '').trim();
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(userId)) {
    return jsonResponse(400, { ok: false, message: 'A valid user id is required.' });
  }

  const supabaseUrl = String(env.SUPABASE_URL || '').replace(/\/$/, '');
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return jsonResponse(503, { ok: false, message: 'Profile activity ranks are not configured.' });
  }

  try {
    const url = new URL(`${supabaseUrl}/rest/v1/rpc/get_profile_activity_ranks`);
    url.searchParams.set('p_user_id', userId);
    const response = await fetch(url, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      signal: AbortSignal.timeout(10000)
    });
    if (response.ok) {
      const payload = await response.json();
      if (payload?.ok && payload.counts && payload.ranks) return jsonResponse(200, payload);
    }
  } catch (error) {
    console.warn('Profile activity ranks request failed:', error.name);
  }

  return jsonResponse(502, { ok: false, message: 'Failed to load profile activity ranks.' });
}
