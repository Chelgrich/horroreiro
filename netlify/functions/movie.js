import { onRequestGet as onMovieHtmlRequestGet } from '../../functions/movie.html.js';
import { onRequestGet as onMovieSlugRequestGet } from '../../functions/movie/[slug].js';
import { createCloudflareLikeContext, getQueryParam, methodNotAllowed, toNetlifyResponse } from './_netlify-utils.js';

export async function handler(event) {
  if (event.httpMethod && event.httpMethod !== 'GET') {
    return methodNotAllowed();
  }

  const route = getQueryParam(event, 'route');
  const slug = getQueryParam(event, 'slug');

  if (route === 'detail' && slug) {
    const context = createCloudflareLikeContext(event, {
      params: { slug },
      request: {
        pathname: `/movie/${slug}`,
        search: ''
      }
    });
    const response = await onMovieSlugRequestGet(context);
    return toNetlifyResponse(response);
  }

  const response = await onMovieHtmlRequestGet(createCloudflareLikeContext(event));
  return toNetlifyResponse(response);
}
