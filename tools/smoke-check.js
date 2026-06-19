const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

const pages = {
  'index.html': 'catalog',
  'movie.html': 'movie',
  'user.html': 'user',
  'following.html': 'following'
};

Object.entries(pages).forEach(([file, page]) => {
  const html = read(file);

  assert(
    html.includes(`body data-app-page="${page}"`),
    `${file}: missing data-app-page="${page}"`
  );
  assert(
    html.includes('<script src="/boot-loader.js'),
    `${file}: missing boot-loader.js`
  );
  assert(
    html.includes('<script src="/app-script-loader.js'),
    `${file}: missing app-script-loader.js`
  );
  assert(
    !html.includes('window.__ENV_READY__ = new Promise'),
    `${file}: duplicated inline env boot loader`
  );
  assert(
    !html.includes('Ошибка загрузки versioned scripts'),
    `${file}: duplicated inline app script loader`
  );
});

const activeTextTargets = [
  '_headers',
  'index.html',
  'movie.html',
  'user.html',
  'following.html',
  'app.js',
  'shared-layout.js',
  'app-script-loader.js',
  'boot-loader.js'
];

activeTextTargets.forEach(file => {
  const text = read(file);

  assert(
    !text.includes('horror-taxonomy.js') && !text.includes('taxonomy-admin.js'),
    `${file}: references archived taxonomy assets`
  );
});

const routes = JSON.parse(read('_routes.json'));

[
  '/',
  '/index.html',
  '/movie/*',
  '/movie.html',
  '/user/*',
  '/user.html',
  '/following',
  '/following.html',
  '/sitemap.xml'
].forEach(route => {
  assert(routes.include.includes(route), `_routes.json: missing ${route}`);
});

assert(!exists('sitemap.xml'), 'static sitemap.xml should not shadow the dynamic function');
assert(exists('functions/sitemap.xml.js'), 'missing dynamic sitemap function');
assert(exists('archive/taxonomy/horror-taxonomy.js'), 'missing archived horror-taxonomy.js');
assert(exists('archive/taxonomy/taxonomy-admin.js'), 'missing archived taxonomy-admin.js');

const movieHtml = read('movie.html');
assert(
  movieHtml.includes('MOVIE_PAGE_FALLBACK_START') && movieHtml.includes('MOVIE_PAGE_FALLBACK_END'),
  'movie.html: missing SEO fallback markers'
);

[
  'app.js',
  'shared-layout.js',
  'app-script-loader.js',
  'boot-loader.js'
].forEach(file => {
  const text = read(file);
  const unsafeAttributeLines = text
    .split(/\r?\n/)
    .filter(line => /(?:\s|<)(href|src|aria-label|title)="\$\{/.test(line))
    .filter(line => (
      !line.includes('escapeHtml(') &&
      !line.includes('${escaped') &&
      !line.includes('.escaped') &&
      !line.includes('userMovieState.isInWatchlist ?') &&
      !line.includes('canReplyToReview ?')
    ));

  assert(
    unsafeAttributeLines.length === 0,
    `${file}: direct template interpolation in an HTML attribute: ${unsafeAttributeLines[0] || ''}`
  );
});

if (failures.length > 0) {
  console.error(`Smoke check failed (${failures.length}):`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Smoke check passed.');
