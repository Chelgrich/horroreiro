import { onRequestPost } from '../../functions/admin/users/[userId]/password.js';
import { createCloudflareLikeContext, getQueryParam, toNetlifyResponse } from './_netlify-utils.js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      body: 'Method Not Allowed',
      headers: {
        Allow: 'POST',
        'Cache-Control': 'no-store',
        'Content-Type': 'text/plain; charset=utf-8'
      },
      statusCode: 405
    };
  }

  const response = await onRequestPost(
    createCloudflareLikeContext(event, {
      params: {
        userId: getQueryParam(event, 'userId')
      }
    })
  );

  return toNetlifyResponse(response);
}
