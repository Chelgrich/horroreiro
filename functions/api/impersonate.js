const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=UTF-8',
  'Cache-Control': 'no-store'
};

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS
  });
}

function getEnvValue(env, key) {
  return String(env?.[key] || '').trim();
}

function getSupabaseUrl(env) {
  return getEnvValue(env, 'SUPABASE_URL').replace(/\/+$/, '');
}

function getBearerToken(request) {
  const authorization = request.headers.get('Authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  return match ? match[1].trim() : '';
}

function getAdminUserIdSet(value) {
  return new Set(
    String(value || '')
      .split(/[,\s]+/)
      .map(item => item.trim())
      .filter(Boolean)
  );
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
}

function getSafeRedirectUrl(request, env) {
  const configuredRedirectUrl = getEnvValue(env, 'IMPERSONATION_REDIRECT_URL');

  if (configuredRedirectUrl) {
    return configuredRedirectUrl;
  }

  return new URL('/', request.url).toString();
}

function maskEmail(email) {
  const normalizedEmail = String(email || '').trim();
  const [name, domain] = normalizedEmail.split('@');

  if (!name || !domain) {
    return '';
  }

  const visibleName = name.length <= 2
    ? `${name.charAt(0)}*`
    : `${name.slice(0, 2)}***`;

  return `${visibleName}@${domain}`;
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

async function fetchSupabaseJson(url, options, fallbackMessage) {
  const response = await fetch(url, options);
  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    const error = new Error(payload?.error_description || payload?.message || payload?.error || fallbackMessage);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload || {};
}

function getSupabaseAdminHeaders(serviceRoleKey) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json'
  };
}

async function getCallerUser({ supabaseUrl, anonKey, accessToken }) {
  const payload = await fetchSupabaseJson(
    `${supabaseUrl}/auth/v1/user`,
    {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`
      }
    },
    'Не удалось проверить сессию администратора.'
  );

  return payload?.user || payload;
}

async function getProfileRole({ supabaseUrl, serviceRoleKey, userId }) {
  const url = new URL(`${supabaseUrl}/rest/v1/profiles`);
  url.searchParams.set('id', `eq.${userId}`);
  url.searchParams.set('select', 'role');
  url.searchParams.set('limit', '1');

  const payload = await fetchSupabaseJson(
    url.toString(),
    {
      headers: getSupabaseAdminHeaders(serviceRoleKey)
    },
    'Не удалось проверить роль администратора.'
  );

  return String(payload?.[0]?.role || '').trim();
}

async function getTargetUser({ supabaseUrl, serviceRoleKey, userId }) {
  const payload = await fetchSupabaseJson(
    `${supabaseUrl}/auth/v1/admin/users/${encodeURIComponent(userId)}`,
    {
      headers: getSupabaseAdminHeaders(serviceRoleKey)
    },
    'Не удалось найти пользователя.'
  );

  return payload?.user || payload;
}

function getGeneratedActionLink(payload) {
  return String(
    payload?.action_link ||
    payload?.actionLink ||
    payload?.properties?.action_link ||
    payload?.properties?.actionLink ||
    ''
  ).trim();
}

async function generateImpersonationLink({ supabaseUrl, serviceRoleKey, email, redirectTo }) {
  const url = new URL(`${supabaseUrl}/auth/v1/admin/generate_link`);
  url.searchParams.set('redirect_to', redirectTo);

  const payload = await fetchSupabaseJson(
    url.toString(),
    {
      method: 'POST',
      headers: getSupabaseAdminHeaders(serviceRoleKey),
      body: JSON.stringify({
        type: 'magiclink',
        email
      })
    },
    'Не удалось создать ссылку входа.'
  );

  return {
    payload,
    actionLink: getGeneratedActionLink(payload)
  };
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const supabaseUrl = getSupabaseUrl(env);
  const anonKey = getEnvValue(env, 'SUPABASE_ANON_KEY');
  const serviceRoleKey = getEnvValue(env, 'SUPABASE_SERVICE_ROLE_KEY');
  const adminUserIds = getAdminUserIdSet(env?.IMPERSONATION_ADMIN_USER_IDS);
  const accessToken = getBearerToken(request);

  if (!supabaseUrl || !anonKey || !serviceRoleKey || !adminUserIds.size) {
    return jsonResponse({ error: 'Impersonation не настроен на сервере.' }, 503);
  }

  if (!accessToken) {
    return jsonResponse({ error: 'Нужна активная сессия администратора.' }, 401);
  }

  const body = await readJson(request);
  const targetUserId = String(body?.userId || '').trim();

  if (!isUuid(targetUserId)) {
    return jsonResponse({ error: 'Некорректный ID пользователя.' }, 400);
  }

  try {
    const callerUser = await getCallerUser({ supabaseUrl, anonKey, accessToken });
    const callerUserId = String(callerUser?.id || '').trim();
    const callerRole = callerUserId
      ? await getProfileRole({ supabaseUrl, serviceRoleKey, userId: callerUserId })
      : '';

    if (!callerUserId || !adminUserIds.has(callerUserId) || callerRole !== 'admin') {
      return jsonResponse({ error: 'Недостаточно прав для входа под пользователем.' }, 403);
    }

    if (callerUserId === targetUserId) {
      return jsonResponse({ error: 'Ты уже находишься в этом профиле.' }, 400);
    }

    const targetUser = await getTargetUser({ supabaseUrl, serviceRoleKey, userId: targetUserId });
    const targetEmail = String(targetUser?.email || '').trim();

    if (!targetEmail) {
      return jsonResponse({ error: 'У пользователя нет email для magic link.' }, 404);
    }

    const redirectTo = getSafeRedirectUrl(request, env);
    const { actionLink } = await generateImpersonationLink({
      supabaseUrl,
      serviceRoleKey,
      email: targetEmail,
      redirectTo
    });

    if (!actionLink) {
      return jsonResponse({ error: 'Supabase не вернул ссылку входа.' }, 502);
    }

    console.log('Admin impersonation link generated', {
      actorId: callerUserId,
      targetId: targetUserId,
      redirectTo,
      createdAt: new Date().toISOString()
    });

    return jsonResponse({
      actionLink,
      target: {
        id: targetUserId,
        email: maskEmail(targetEmail)
      },
      redirectTo
    });
  } catch (error) {
    console.error('Admin impersonation failed', {
      targetId: targetUserId,
      status: error?.status || null,
      message: error?.message || String(error)
    });

    const status = error?.status && error.status >= 400 && error.status < 500 ? error.status : 500;
    const message = status === 500
      ? 'Не удалось создать ссылку входа.'
      : (error?.message || 'Не удалось создать ссылку входа.');

    return jsonResponse({ error: message }, status);
  }
}
