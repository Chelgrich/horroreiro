import { getPublicPageResponse } from '../_public-page-seo.js';

export async function onRequestGet(context) {
  return getPublicPageResponse(context, 'company', context.params.slug);
}
