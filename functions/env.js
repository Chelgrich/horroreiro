export async function onRequest(context) {
  const { env } = context;

  const payload = {
    SUPABASE_URL: env.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY || ''
  };

  return new Response(
    `window.__ENV__ = ${JSON.stringify(payload)};`,
    {
      headers: {
        'Content-Type': 'application/javascript; charset=UTF-8',
        'Cache-Control': 'no-store'
      }
    }
  );
}