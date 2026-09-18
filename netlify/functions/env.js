import { onRequest } from '../../functions/env.js';
import { createCloudflareLikeContext, toNetlifyResponse } from './_netlify-utils.js';

export async function handler(event) {
  const response = await onRequest(createCloudflareLikeContext(event));
  return toNetlifyResponse(response);
}
