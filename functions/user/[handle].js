export async function onRequestGet(context) {
  const { env, request } = context;

  return env.ASSETS.fetch(new URL('/user.html', request.url).toString());
}
