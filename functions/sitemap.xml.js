import { createSitemapXml } from './_seo-utils.js';

let cachedSitemap;

function getSitemapXml(env) {
  const key = JSON.stringify([env.SUPABASE_URL, env.SUPABASE_ANON_KEY]);
  if (cachedSitemap?.key === key && cachedSitemap.expiresAt > Date.now()) return cachedSitemap.xml;
  const entry = { key, expiresAt: Date.now() + 5 * 60 * 1000, xml: createSitemapXml(env) };
  cachedSitemap = entry;
  entry.xml.catch(() => {
    if (cachedSitemap === entry) cachedSitemap = null;
  });
  return entry.xml;
}

export async function onRequestGet(context) {
  try {
    return new Response(await getSitemapXml(context.env), {
      headers: {
        'Content-Type': 'application/xml; charset=UTF-8',
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Sitemap generation failed:', error);
    return new Response('Sitemap temporarily unavailable', {
      status: 503,
      headers: { 'Cache-Control': 'no-store', 'Retry-After': '60' }
    });
  }
}
