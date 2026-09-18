import { onRequestGet } from '../../functions/app-assets/[version].js';
import { createCloudflareLikeContext, methodNotAllowed, toNetlifyResponse } from './_netlify-utils.js';

export async function handler(event) {
  if (event.httpMethod && event.httpMethod !== 'GET') {
    return methodNotAllowed();
  }

  const response = await onRequestGet(createCloudflareLikeContext(event));
  return toNetlifyResponse(response);
}
