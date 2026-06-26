const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=UTF-8',
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
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

async function readJsonBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
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
      user: null,
      error: payload?.message || 'Сессия администратора недействительна.'
    };
  }

  return {
    user: payload,
    error: ''
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
      role: '',
      error: payload?.message || 'Не удалось проверить роль администратора.'
    };
  }

  return {
    role: Array.isArray(payload) ? payload[0]?.role || '' : '',
    error: ''
  };
}

async function updateUserPassword(supabaseUrl, serviceRoleKey, userId, password, confirmEmail) {
  const response = await fetch(`${supabaseUrl}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
    method: 'PUT',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      password,
      ...(confirmEmail ? { email_confirm: true } : {})
    })
  });
  const payload = await readSupabaseJson(response);

  if (!response.ok) {
    return {
      ok: false,
      error: payload?.msg || payload?.message || 'Supabase Auth не принял новый пароль.'
    };
  }

  return {
    ok: true,
    error: ''
  };
}

export async function onRequestPost(context) {
  const { env, params, request } = context;
  const supabaseUrl = getSupabaseBaseUrl(env);
  const anonKey = env.SUPABASE_ANON_KEY || '';
  const serviceRoleKey = getServiceRoleKey(env);
  const targetUserId = String(params.userId || '').trim();
  const accessToken = getBearerToken(request);
  const body = await readJsonBody(request);
  const password = String(body?.password || '');
  const confirmEmail = body?.confirmEmail !== false;

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse(500, {
      ok: false,
      message: 'На сервере не настроены переменные Supabase для админских действий.'
    });
  }

  if (!targetUserId) {
    return jsonResponse(400, {
      ok: false,
      message: 'Не указан пользователь.'
    });
  }

  if (!accessToken) {
    return jsonResponse(401, {
      ok: false,
      message: 'Нужна активная сессия администратора.'
    });
  }

  if (password.length < 8) {
    return jsonResponse(400, {
      ok: false,
      message: 'Пароль должен быть не короче 8 символов.'
    });
  }

  const requesterResult = await verifyRequester(supabaseUrl, anonKey, accessToken);

  if (!requesterResult.user) {
    return jsonResponse(401, {
      ok: false,
      message: requesterResult.error
    });
  }

  const roleResult = await fetchRequesterRole(supabaseUrl, serviceRoleKey, requesterResult.user.id);

  if (roleResult.error) {
    return jsonResponse(500, {
      ok: false,
      message: roleResult.error
    });
  }

  if (roleResult.role !== 'admin') {
    return jsonResponse(403, {
      ok: false,
      message: 'Доступно только администратору.'
    });
  }

  const updateResult = await updateUserPassword(
    supabaseUrl,
    serviceRoleKey,
    targetUserId,
    password,
    confirmEmail
  );

  if (!updateResult.ok) {
    return jsonResponse(400, {
      ok: false,
      message: updateResult.error
    });
  }

  return jsonResponse(200, {
    ok: true
  });
}
