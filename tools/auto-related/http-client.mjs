const DEFAULT_USER_AGENT = 'horroreiro-auto-related-sync/0.1';

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

    try {
      response = await fetchImpl(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent': DEFAULT_USER_AGENT,
          ...headers
        },
        signal: controller.signal
      });

      text = await response.text();
    } catch (error) {
      lastError = new AutoRelatedFetchError(`Provider request failed: ${error.message || error}`, {
        provider,
        url,
        retryable: true
      });
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
