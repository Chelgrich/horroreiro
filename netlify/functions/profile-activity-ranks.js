import { onRequestGet } from '../../functions/profile-activity-ranks/[userId].js';
import { createCloudflareLikeContext, getQueryParam, methodNotAllowed, toNetlifyResponse } from './_netlify-utils.js';

export async function handler(event) {
  if (event.httpMethod && event.httpMethod !== 'GET') {
    return methodNotAllowed();
  }

  const response = await onRequestGet(
    createCloudflareLikeContext(event, {
      params: {
        userId: getQueryParam(event, 'userId')
      }
    })
  );

  return toNetlifyResponse(response);
}
