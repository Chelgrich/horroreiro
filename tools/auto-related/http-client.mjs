import https from 'node:https';

const DEFAULT_USER_AGENT = 'horroreiro-auto-related-sync/0.1';
const DOH_JSON_ENDPOINT = 'https://cloudflare-dns.com/dns-query';
const DOH_FALLBACK_HOSTS = new Set([
  'api.themoviedb.org'
]);
const dohAddressCache = new Map();

export class AutoRelatedFetchError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'AutoRelatedFetchError';
    this.status = details.status || 0;
    this.provider = details.provider || '';
    this.url = details.url || '';
    this.retryable = Boolean(details.retryable);
  }
}

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, Math.max(0, ms));
  });
}

export function getRetryAfterMs(value) {
  const rawValue = String(value || '').trim();

  if (!rawValue) {
    return 0;
  }

  const seconds = Number(rawValue);

  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds * 1000;
  }

  const dateMs = Date.parse(rawValue);

  if (!Number.isNaN(dateMs)) {
    return Math.max(0, dateMs - Date.now());
  }

  return 0;
}

function getRetryDelayMs({ response, attemptIndex, retryDelaysMs }) {
  const retryAfterMs = getRetryAfterMs(response?.headers?.get?.('retry-after'));

  if (retryAfterMs > 0) {
    return retryAfterMs;
  }

  return retryDelaysMs[Math.min(attemptIndex, retryDelaysMs.length - 1)] || 0;
}

function isRetryableStatus(status) {
  return status === 429 || status >= 500;
}

function normalizeJsonBody(text, url) {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new AutoRelatedFetchError('Provider returned invalid JSON.', {
      url,
      retryable: false
    });
  }
}

function getHeaderValue(headers, name) {
  const normalizedName = String(name || '').toLowerCase();
  const value = headers?.[normalizedName];

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return value || '';
}

function createResponseLike(status, headers, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: {
      get(name) {
        return getHeaderValue(headers, name);
      }
    },
    async text() {
      return body;
    }
  };
}

function isLoopbackAddress(address) {
  return /^127\./.test(String(address || '')) || String(address || '') === '::1';
}

async function resolveHostWithDoh(hostname) {
  const cachedAddress = dohAddressCache.get(hostname);

  if (cachedAddress) {
    return cachedAddress;
  }

  const url = new URL(DOH_JSON_ENDPOINT);
  url.searchParams.set('name', hostname);
  url.searchParams.set('type', 'A');

  const response = await globalThis.fetch(url, {
    headers: {
      Accept: 'application/dns-json',
      'User-Agent': DEFAULT_USER_AGENT
    }
  });

  if (!response.ok) {
    throw new Error(`DNS-over-HTTPS lookup failed with HTTP ${response.status}.`);
  }

  const payload = await response.json();
  const address = (payload.Answer || [])
    .filter(record => Number(record.type) === 1)
    .map(record => String(record.data || '').trim())
    .find(recordAddress => recordAddress && !isLoopbackAddress(recordAddress));

  if (!address) {
    throw new Error(`DNS-over-HTTPS lookup did not return a usable A record for ${hostname}.`);
  }

  dohAddressCache.set(hostname, address);
  return address;
}

function shouldUseDohFallback(url, fetchImpl) {
  if (fetchImpl !== globalThis.fetch) {
    return false;
  }

  const parsedUrl = new URL(url);
  return parsedUrl.protocol === 'https:' && DOH_FALLBACK_HOSTS.has(parsedUrl.hostname);
}

async function fetchWithDohResolvedHost(url, options = {}) {
  const parsedUrl = new URL(url);
  const address = await resolveHostWithDoh(parsedUrl.hostname);

  return new Promise((resolve, reject) => {
    const request = https.request({
      headers: options.headers,
      hostname: parsedUrl.hostname,
      lookup(hostname, lookupOptions, callback) {
        if (lookupOptions?.all) {
          callback(null, [{ address, family: 4 }]);
          return;
        }

        callback(null, address, 4);
      },
      method: 'GET',
      path: `${parsedUrl.pathname}${parsedUrl.search}`,
      port: 443,
      servername: parsedUrl.hostname
    }, response => {
      const chunks = [];

      response.on('data', chunk => {
        chunks.push(chunk);
      });

      response.on('end', () => {
        resolve(createResponseLike(
          response.statusCode || 0,
          response.headers || {},
          Buffer.concat(chunks).toString('utf8')
        ));
      });
    });

    request.on('error', reject);

    if (options.signal) {
      if (options.signal.aborted) {
        request.destroy(new Error('This operation was aborted.'));
      } else {
        options.signal.addEventListener('abort', () => {
          request.destroy(new Error('This operation was aborted.'));
        }, { once: true });
      }
    }

    request.end();
  });
}

export async function fetchJsonWithRetry(url, options = {}) {
  const {
    fetchImpl = globalThis.fetch,
    headers = {},
    maxAttempts = 3,
    provider = '',
    retryDelaysMs = [1000, 3000, 10000],
    sleep = wait,
    timeoutMs = 10000
  } = options;

  if (typeof fetchImpl !== 'function') {
    throw new Error('fetchJsonWithRetry requires a fetch implementation.');
  }

  let lastError = null;

  for (let attemptIndex = 0; attemptIndex < maxAttempts; attemptIndex += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    let response;
    let text = '';
    const requestHeaders = {
      Accept: 'application/json',
      'User-Agent': DEFAULT_USER_AGENT,
      ...headers
    };

    try {
      response = await fetchImpl(url, {
        headers: requestHeaders,
        signal: controller.signal
      });

      text = await response.text();
    } catch (error) {
      if (shouldUseDohFallback(url, fetchImpl)) {
        try {
          response = await fetchWithDohResolvedHost(url, {
            headers: requestHeaders,
            signal: controller.signal
          });
          text = await response.text();
        } catch (fallbackError) {
          lastError = new AutoRelatedFetchError(`Provider request failed: ${fallbackError.message || fallbackError}`, {
            provider,
            url,
            retryable: true
          });
        }
      } else {
        lastError = new AutoRelatedFetchError(`Provider request failed: ${error.message || error}`, {
          provider,
          url,
          retryable: true
        });
      }
    } finally {
      clearTimeout(timeout);
    }

    if (response?.ok) {
      return normalizeJsonBody(text, url);
    }

    if (response && !response.ok) {
      const retryable = isRetryableStatus(response.status);
      lastError = new AutoRelatedFetchError(`Provider responded with HTTP ${response.status}.`, {
        provider,
        retryable,
        status: response.status,
        url
      });

      if (!retryable) {
        throw lastError;
      }
    }

    const hasAttemptsLeft = attemptIndex < maxAttempts - 1;

    if (hasAttemptsLeft) {
      await sleep(getRetryDelayMs({
        attemptIndex,
        response,
        retryDelaysMs
      }));
    }
  }

  throw lastError || new AutoRelatedFetchError('Provider request failed.', {
    provider,
    retryable: true,
    url
  });
}
