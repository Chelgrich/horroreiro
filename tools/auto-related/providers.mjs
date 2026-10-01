import {
  getAutoRelatedProviderAvailability,
  readAutoRelatedConfig
} from './config.mjs';
import { createTmdbRecommendationProvider } from './tmdb-provider.mjs';
import { createTraktRelatedProvider } from './trakt-provider.mjs';

export function createRecommendationProviders(config = readAutoRelatedConfig(), options = {}) {
  const providers = [];

  if (config.tmdbReadAccessToken) {
    providers.push(createTmdbRecommendationProvider(config, options.tmdb));
  }

  if (config.traktApiKey) {
    providers.push(createTraktRelatedProvider(config, options.trakt));
  }

  return providers;
}

export async function getProviderRecommendations(movie, providers = createRecommendationProviders()) {
  const results = [];
  const errors = [];

  for (const provider of providers) {
    try {
      results.push(...await provider.getRecommendations(movie));
    } catch (error) {
      errors.push({
        provider: provider.name,
        message: error.message || String(error),
        status: error.status || 0
      });
    }
  }

  return {
    candidates: results,
    errors
  };
}

export {
  getAutoRelatedProviderAvailability,
  readAutoRelatedConfig
};
