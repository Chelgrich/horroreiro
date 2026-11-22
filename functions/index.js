import { fetchNoStoreAsset } from './_response-utils.js';
import { SITE_ORIGIN, createSocialPreviewResponse, isSocialPreviewCrawler } from './_seo-utils.js';

export async function onRequestGet(context) {
  const { env, request } = context;

  if (isSocialPreviewCrawler(request)) {
    return createSocialPreviewResponse({
      title: 'Хоррорейро — каталог фильмов ужасов',
      description: 'Новые фильмы ужасов и ближайшие релизы. Подборки по жанрам, рейтинги и рецензии зрителей.',
      canonicalUrl: `${SITE_ORIGIN}/`
    }, 'Открыть каталог');
  }

  const response = await fetchNoStoreAsset(env, request, '/index.html');
  response.headers.append('Vary', 'User-Agent');
  return response;
}
