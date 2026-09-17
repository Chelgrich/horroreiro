import { fetchNoStoreAsset } from '../_response-utils.js';

export async function onRequestGet({ env, request }) {
  return fetchNoStoreAsset(env, request, '/company.html');
}
