import { fetchNoStoreAsset } from '../_response-utils.js';

export async function onRequestGet(context) {
  const { env, request } = context;

  return fetchNoStoreAsset(env, request, '/user.html');
}
