const PREVIEW_TESTS = new Map([
  ['astral-20261006-a', {
    title: 'Астрал 6: Они уже здесь',
    description: 'Диагностическое превью Хоррорейро со статической baseline JPEG-картинкой 1200×630.',
    imagePath: '/assets/og/astral-20261006-a.jpg'
  }]
]);

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createPreviewTestHtml({ origin, slug, title, description, imagePath }) {
  const pageUrl = `${origin}/preview-test/${encodeURIComponent(slug)}`;
  const imageUrl = `${origin}${imagePath}`;

  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="noindex, nofollow">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(pageUrl)}">
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Хоррорейро">
  <meta property="og:locale" content="ru_RU">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(description)}</p>
</body>
</html>`;
}

export function handlePreviewTestRequest(context) {
  const { params, request } = context;
  const slug = String(params.slug || '').trim();
  const test = PREVIEW_TESTS.get(slug);

  if (!test) {
    return new Response('Not found', {
      status: 404,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }

  if (!['GET', 'HEAD'].includes(request.method)) {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: {
        Allow: 'GET, HEAD',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }

  const origin = new URL(request.url).origin;
  const html = createPreviewTestHtml({
    origin,
    slug,
    ...test
  });

  return new Response(request.method === 'HEAD' ? null : html, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=300, must-revalidate',
      'Content-Length': String(Buffer.byteLength(html)),
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
}
