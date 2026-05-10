import {
  createSitemapXml,
  fetchMoviesForSitemap
} from './_seo-utils.js';

export async function onRequestGet(context) {
  let movies = [];

  try {
    movies = await fetchMoviesForSitemap(context.env);
  } catch (error) {
    console.error('Sitemap generation failed:', error);
  }

  const xml = createSitemapXml(movies);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
