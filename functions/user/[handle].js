import { getPublicPageResponse } from '../_public-page-seo.js';

export async function onRequestGet(context) {
  return getPublicPageResponse(context, 'profile', context.params.handle);
}
