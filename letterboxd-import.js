const LETTERBOXD_IMPORT_FIELD_ALIASES = Object.freeze({
  name: ['name', 'title'],
  year: ['year', 'releaseyear', 'releasedate'],
  rating: ['rating', 'yourrating', 'stars'],
  uri: ['letterboxduri', 'letterboxdurl', 'letterboxdlink', 'url', 'uri']
});

function parseCsvRows(csvText) {
  const text = String(csvText || '').replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let field = '';
  let isInsideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (char === '"') {
      if (isInsideQuotes && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        isInsideQuotes = !isInsideQuotes;
      }

      continue;
    }

    if (char === ',' && !isInsideQuotes) {
      row.push(field);
      field = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !isInsideQuotes) {
      if (char === '\r' && text[index + 1] === '\n') {
        index += 1;
      }

      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      continue;
    }

    field += char;
  }

  row.push(field);

  if (row.some(cell => String(cell || '').trim())) {
    rows.push(row);
  }

  return rows.filter(csvRow => csvRow.some(cell => String(cell || '').trim()));
}

function normalizeCsvHeader(value) {
  return String(value || '')
    .replace(/^\uFEFF/, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0401\u0451\u0410-\u044F]+/gi, '');
}

function parseCsvObjects(csvText) {
  const rows = parseCsvRows(csvText);
  const [headerRow = [], ...dataRows] = rows;
  const headers = headerRow.map(normalizeCsvHeader);

  return {
    headers,
    rows: dataRows.map((cells, index) => {
      const fields = {};

      headers.forEach((header, headerIndex) => {
        if (header) {
          fields[header] = cells[headerIndex] ?? '';
        }
      });

      return {
        rowNumber: index + 2,
        fields
      };
    })
  };
}

function getCsvField(row, aliases) {
  const fields = row?.fields || {};

  for (const alias of aliases) {
    const normalizedAlias = normalizeCsvHeader(alias);

    if (Object.prototype.hasOwnProperty.call(fields, normalizedAlias)) {
      return String(fields[normalizedAlias] || '').trim();
    }
  }

  return '';
}

function hasCsvColumn(parsedCsv, aliases) {
  const headerSet = new Set(parsedCsv.headers || []);

  return aliases.some(alias => headerSet.has(normalizeCsvHeader(alias)));
}

function normalizeImportedRatingScore(score) {
  const numericScore = Number(score);

  if (!Number.isFinite(numericScore) || numericScore <= 0) {
    return null;
  }

  return Math.min(10, Math.max(1, Math.round(numericScore)));
}

function parseLetterboxdRatingValue(value) {
  const rawValue = String(value || '').trim();

  if (!rawValue) {
    return null;
  }

  const starCount = (rawValue.match(/[\u2605\u2B50]/g) || []).length;
  const hasHalfStar = rawValue.includes('\u00BD') || /(^|\D)1\/2($|\D)/.test(rawValue);

  if (starCount > 0 || hasHalfStar) {
    return normalizeImportedRatingScore((starCount * 2) + (hasHalfStar ? 1 : 0));
  }

  const normalizedValue = rawValue.replace(',', '.');
  const fractionMatch = normalizedValue.match(/(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)/);

  if (fractionMatch) {
    const numerator = Number(fractionMatch[1]);
    const denominator = Number(fractionMatch[2]);

    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) {
      return null;
    }

    return normalizeImportedRatingScore((numerator / denominator) * 10);
  }

  const numericMatch = normalizedValue.match(/-?\d+(?:\.\d+)?/);

  if (!numericMatch) {
    return null;
  }

  const numericRating = Number(numericMatch[0]);
  const ratingScore = numericRating <= 5
    ? numericRating * 2
    : numericRating;

  return normalizeImportedRatingScore(ratingScore);
}

function normalizeLetterboxdImportUri(value) {
  const rawValue = String(value || '').trim();

  if (!rawValue) {
    return '';
  }

  try {
    const url = new URL(/^https?:\/\//i.test(rawValue) ? rawValue : `https://${rawValue}`);
    const host = url.hostname.replace(/^www\./i, '').toLowerCase();
    const path = url.pathname.replace(/\/+$/g, '').toLowerCase();

    return `${host}${path}`;
  } catch (error) {
    return rawValue
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/[?#].*$/, '')
      .replace(/\/+$/g, '');
  }
}

function addMovieToLetterboxdImportIndex(indexMap, key, movie) {
  if (!key || !movie?.id) {
    return;
  }

  const bucket = indexMap.get(key) || [];

  if (!bucket.some(item => String(item.id) === String(movie.id))) {
    bucket.push(movie);
  }

  indexMap.set(key, bucket);
}

function getMovieLetterboxdImportUris(movie) {
  return [
    movie?.letterboxd_short_url,
    movie?.letterboxd_url
  ].filter(Boolean);
}

function buildLetterboxdImportMovieIndex(movies) {
  const index = {
    uri: new Map()
  };

  (Array.isArray(movies) ? movies : []).forEach(movie => {
    getMovieLetterboxdImportUris(movie).forEach(uri => {
      addMovieToLetterboxdImportIndex(index.uri, normalizeLetterboxdImportUri(uri), movie);
    });
  });

  return index;
}

function getUniqueLetterboxdImportIndexMatch(indexMap, key) {
  const matches = indexMap.get(key) || [];

  return matches.length === 1
    ? matches[0]
    : null;
}

function matchLetterboxdImportRowToMovie(row, movieIndex) {
  const uri = normalizeLetterboxdImportUri(getCsvField(row, LETTERBOXD_IMPORT_FIELD_ALIASES.uri));

  if (!uri) {
    return null;
  }

  const uriMatch = getUniqueLetterboxdImportIndexMatch(movieIndex.uri, uri);

  if (uriMatch) {
    return {
      movie: uriMatch,
      matchType: 'letterboxd_uri'
    };
  }

  return null;
}

export {
  LETTERBOXD_IMPORT_FIELD_ALIASES,
  buildLetterboxdImportMovieIndex,
  getCsvField,
  hasCsvColumn,
  matchLetterboxdImportRowToMovie,
  parseCsvObjects,
  parseLetterboxdRatingValue
};
