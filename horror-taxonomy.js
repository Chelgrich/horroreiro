const SIMILARITY_MODEL = {
  MAX_RESULTS: 4,

  SCORE_CAPS: {
    canonExact: 60,
    canonAffinity: 8,
    modifiers: 14,
    broadFamilies: 7,
    formats: 5,
    genres: 4,
    countries: 2
  },

  GATES: {
    minCanonCoreScore: 14,
    minFinalScore: 34,
    minScoreForStrongMatch: 50,
    minScoreForGoodMatch: 42,
    minScoreForWeakMatch: 34,
    minCoreForContextualLayers: 20,
    minCanonOrModifierForFormats: 12,
    minModifierScoreForFormats: 4
  },

  CONFIDENCE_MULTIPLIERS: {
    stable: 1.0,
    observe: 0.88,
    provisional: 0.78
  },

  BASE_SPECIFICITY: {
    anchor: 1.2,
    standard: 1.0,
    broad: 0.82
  }
};

const CANON_TAG_META = {
  abandoned_settlement: { tier: "standard", confidence: "observe" },
  abuse_trauma: { tier: "standard", confidence: "stable" },
  ai_generated: { tier: "standard", confidence: "observe" },
  alien_creature: { tier: "standard", confidence: "observe" },
  alien_threat: { tier: "anchor", confidence: "stable" },
  alternate_dimension: { tier: "anchor", confidence: "stable" },
  amusement_park: { tier: "standard", confidence: "observe" },
  ancient_curse: { tier: "standard", confidence: "stable" },
  anthology_linkage: { tier: "standard", confidence: "stable" },
  apartment_space: { tier: "standard", confidence: "stable" },
  aquatic_space: { tier: "standard", confidence: "stable" },
  assimilation_pressure: { tier: "standard", confidence: "observe" },
  audio_contact: { tier: "anchor", confidence: "stable" },
  barn_space: { tier: "standard", confidence: "stable" },
  bayou_setting: { tier: "standard", confidence: "observe" },
  black_magic: { tier: "standard", confidence: "stable" },
  body_transfer: { tier: "anchor", confidence: "stable" },
  body_transformation: { tier: "anchor", confidence: "stable" },
  boarding_school: { tier: "standard", confidence: "observe" },
  buried_past: { tier: "broad", confidence: "stable" },
  bully_retribution: { tier: "standard", confidence: "observe" },
  cannibalism: { tier: "anchor", confidence: "stable" },
  chemical_outbreak: { tier: "anchor", confidence: "stable" },
  christmas_setting: { tier: "standard", confidence: "stable" },
  countdown_structure: { tier: "anchor", confidence: "stable" },
  creature_conflict: { tier: "standard", confidence: "observe" },
  cult_community: { tier: "anchor", confidence: "stable" },
  cursed_object: { tier: "anchor", confidence: "stable" },
  demonic_entity: { tier: "standard", confidence: "stable" },
  demonic_possession: { tier: "anchor", confidence: "stable" },
  deserted_island: { tier: "standard", confidence: "observe" },
  disabled_child: { tier: "standard", confidence: "observe" },
  distorted_reality: { tier: "anchor", confidence: "stable" },
  dream_stalker: { tier: "anchor", confidence: "observe" },
  dysfunctional_family: { tier: "standard", confidence: "stable" },
  educational_pressure: { tier: "standard", confidence: "observe" },
  egyptian_theme: { tier: "standard", confidence: "observe" },
  elder_threat: { tier: "standard", confidence: "observe" },
  enemy_pursuit: { tier: "anchor", confidence: "stable" },
  entity_possession: { tier: "anchor", confidence: "stable" },
  evil_spirit_resurrection: { tier: "standard", confidence: "observe" },
  family_unit: { tier: "broad", confidence: "stable" },
  feigned_death: { tier: "anchor", confidence: "observe" },
  flooding_disaster: { tier: "anchor", confidence: "stable" },
  folklore_entity: { tier: "anchor", confidence: "stable" },
  forest_space: { tier: "standard", confidence: "stable" },
  fractured_memory: { tier: "standard", confidence: "observe" },
  future_intrusion: { tier: "standard", confidence: "observe" },
  fungal_infection: { tier: "anchor", confidence: "stable" },
  gang_war: { tier: "standard", confidence: "observe" },
  ghost_apparition: { tier: "standard", confidence: "observe" },
  ghost_possession: { tier: "anchor", confidence: "stable" },
  giant_creature: { tier: "anchor", confidence: "stable" },
  grief_trauma: { tier: "standard", confidence: "stable" },
  group_paranoia: { tier: "standard", confidence: "observe" },
  guilt_manifestation: { tier: "standard", confidence: "observe" },
  hallucinated_presence: { tier: "standard", confidence: "observe" },
  halloween_setting: { tier: "standard", confidence: "stable" },
  haunted_animatronics: { tier: "anchor", confidence: "stable" },
  haunted_object: { tier: "standard", confidence: "stable" },
  home_confinement: { tier: "anchor", confidence: "stable" },
  home_infiltration: { tier: "standard", confidence: "stable" },
  home_under_siege: { tier: "anchor", confidence: "stable" },
  house_space: { tier: "standard", confidence: "stable" },
  human_hunt: { tier: "anchor", confidence: "observe" },
  human_monstrosity: { tier: "anchor", confidence: "stable" },
  identity_erasure: { tier: "anchor", confidence: "stable" },
  infected_society: { tier: "standard", confidence: "observe" },
  infrastructure_horror: { tier: "standard", confidence: "observe" },
  intergenerational_trauma: { tier: "standard", confidence: "stable" },
  internet_folklore: { tier: "standard", confidence: "stable" },
  isolated_house: { tier: "standard", confidence: "stable" },
  isolated_lighthouse: { tier: "standard", confidence: "observe" },
  isolated_protagonist: { tier: "anchor", confidence: "stable" },
  isolated_village: { tier: "standard", confidence: "stable" },
  kidnapping: { tier: "anchor", confidence: "stable" },
  killer_creature: { tier: "anchor", confidence: "observe" },
  killer_doll: { tier: "standard", confidence: "observe" },
  killer_duo: { tier: "standard", confidence: "stable" },
  killer_santa: { tier: "anchor", confidence: "observe" },
  liminal_space: { tier: "anchor", confidence: "stable" },
  life_extension: { tier: "standard", confidence: "stable" },
  masked_killer: { tier: "anchor", confidence: "stable" },
  maternal_horror: { tier: "anchor", confidence: "stable" },
  media_based_investigation: { tier: "anchor", confidence: "stable" },
  mental_breakdown: { tier: "anchor", confidence: "stable" },
  mental_illness: { tier: "standard", confidence: "stable" },
  mind_control_experiment: { tier: "anchor", confidence: "observe" },
  missing_parent: { tier: "standard", confidence: "observe" },
  missing_person_investigation: { tier: "anchor", confidence: "stable" },
  moral_test: { tier: "anchor", confidence: "stable" },
  mountain_wilderness: { tier: "standard", confidence: "observe" },
  mutant_creature: { tier: "standard", confidence: "stable" },
  mutant_society: { tier: "standard", confidence: "observe" },
  myth_reframing: { tier: "anchor", confidence: "stable" },
  mythic_creature: { tier: "standard", confidence: "stable" },
  office_space: { tier: "standard", confidence: "stable" },
  occult_ritual: { tier: "anchor", confidence: "stable" },
  occult_trade: { tier: "anchor", confidence: "stable" },
  obsessive_compulsive_behavior: { tier: "standard", confidence: "observe" },
  paranormal_media: { tier: "anchor", confidence: "stable" },
  parent_child_pair: { tier: "standard", confidence: "stable" },
  pirate_setting: { tier: "standard", confidence: "observe" },
  plumbing_horror: { tier: "standard", confidence: "observe" },
  post_apocalyptic_survival: { tier: "standard", confidence: "provisional" },
  prank_horror: { tier: "anchor", confidence: "stable" },
  predatory_creature: { tier: "anchor", confidence: "stable" },
  protagonist_killer: { tier: "anchor", confidence: "stable" },
  rabies_infection: { tier: "standard", confidence: "observe" },
  reality_intrusion: { tier: "standard", confidence: "provisional" },
  religious_fundamentalism: { tier: "standard", confidence: "stable" },
  rescue_mission: { tier: "standard", confidence: "stable" },
  revenge_ghost: { tier: "anchor", confidence: "stable" },
  revenge_mission: { tier: "standard", confidence: "stable" },
  revenant_killer: { tier: "anchor", confidence: "observe" },
  road_space: { tier: "standard", confidence: "stable" },
  roadside_motel: { tier: "standard", confidence: "observe" },
  ruins_space: { tier: "standard", confidence: "observe" },
  sacrificial_killings: { tier: "standard", confidence: "stable" },
  sadistic_captor: { tier: "anchor", confidence: "stable" },
  school_space: { tier: "standard", confidence: "stable" },
  scandinavian_setting: { tier: "standard", confidence: "observe" },
  scientific_creature: { tier: "standard", confidence: "stable" },
  scientific_experiment: { tier: "standard", confidence: "stable" },
  scuba_killer: { tier: "standard", confidence: "observe" },
  serial_killer: { tier: "anchor", confidence: "stable" },
  shark_attack: { tier: "anchor", confidence: "stable" },
  sick_child: { tier: "standard", confidence: "observe" },
  sick_sibling: { tier: "standard", confidence: "observe" },
  sibling_pair: { tier: "provisional", confidence: "provisional" },
  small_town_secret: { tier: "standard", confidence: "observe" },
  snake_attack: { tier: "anchor", confidence: "stable" },
  snow_isolation: { tier: "standard", confidence: "stable" },
  social_media_performance: { tier: "anchor", confidence: "stable" },
  social_status_obsession: { tier: "standard", confidence: "observe" },
  spatial_loop: { tier: "anchor", confidence: "stable" },
  spreading_contamination: { tier: "standard", confidence: "observe" },
  staged_death: { tier: "standard", confidence: "observe" },
  subway_space: { tier: "standard", confidence: "stable" },
  supernatural_influence: { tier: "standard", confidence: "observe" },
  supernatural_killer: { tier: "anchor", confidence: "stable" },
  terminal_illness: { tier: "standard", confidence: "stable" },
  theater_space: { tier: "standard", confidence: "stable" },
  thanksgiving_setting: { tier: "standard", confidence: "observe" },
  time_displacement: { tier: "anchor", confidence: "stable" },
  time_loop: { tier: "anchor", confidence: "stable" },
  time_machine_experiment: { tier: "anchor", confidence: "observe" },
  toxic_parent: { tier: "standard", confidence: "stable" },
  transfer_death: { tier: "provisional", confidence: "provisional" },
  transferable_curse: { tier: "anchor", confidence: "stable" },
  trauma_driven_killer: { tier: "anchor", confidence: "stable" },
  trauma_return: { tier: "anchor", confidence: "stable" },
  trapped_survival: { tier: "anchor", confidence: "stable" },
  trickster_threat: { tier: "anchor", confidence: "stable" },
  underground_dystopia: { tier: "anchor", confidence: "observe" },
  uneasy_alliance: { tier: "standard", confidence: "stable" },
  unrequited_obsession: { tier: "standard", confidence: "observe" },
  urban_legend_rabbit_hole: { tier: "anchor", confidence: "stable" },
  vampire_myth_reframing: { tier: "anchor", confidence: "stable" },
  virtual_reality_simulation: { tier: "anchor", confidence: "observe" },
  war_survival: { tier: "standard", confidence: "observe" },
  waterway_space: { tier: "standard", confidence: "observe" },
  wedding_frame: { tier: "standard", confidence: "stable" },
  wish_with_a_price: { tier: "anchor", confidence: "stable" },
  witchcraft: { tier: "anchor", confidence: "stable" },
  wwii_horror: { tier: "standard", confidence: "observe" },
  zombie: { tier: "anchor", confidence: "stable" }
};

const MODIFIER_WEIGHTS = {
  horror_comedy: 1.2,
  surreal: 1.15,
  satirical: 1.15,
  grotesque: 1.1,
  absurdist: 1.1,
  meta: 1.1,
  paranoid: 1.05,
  gross_out: 1.05,
  claustrophobic: 1.05,
  practical_effects: 1.0,
  sleazy: 1.0,
  psychological: 0.95,
  campy: 0.95,
  dark_humor: 0.95,
  gory: 0.9,
  tense: 0.9,
  slow_burn: 0.85,
  atmospheric: 0.7,
  bleak: 0.7,
  experimental: 1.05
};

const BROAD_FAMILY_WEIGHTS = {
  threat_origin: 0.6,
  human_dynamics: 0.6,
  setting_type: 0.6,

  threat_behavior: 0.8,
  psychological_wound: 0.8,
  narrative_function: 0.8,
  ritual_mechanism: 0.8,
  reality_structure: 0.8,

  investigation_frame: 1.0,
  conspiracy_mechanism: 1.0,
  temporal_mechanism: 1.0,
  survival_structure: 1.0,
  pursuit_structure: 1.0,
  space_mechanism: 1.0,
  myth_reframing: 1.0,
  protagonist_structure: 1.0,
  social_contagion: 1.0
};

const FORMAT_WEIGHTS = {
  found_footage: 1.2,
  mockumentary: 1.15,
  hybrid_narrative: 1.0,
  anthology: 1.1,
  silent_film: 1.15
};

const EXTRA_GENRE_WEIGHTS = {
  "Боевик": 0.6,
  "Детектив": 0.9,
  "Драма": 0.5,
  "Комедия": 0.9,
  "Криминал": 0.9,
  "Мелодрама": 0.7,
  "Мюзикл": 1.1,
  "Приключения": 0.7,
  "Триллер": 0.7,
  "Фантастика": 1.0,
  "Фэнтези": 1.0
};

const CANON_AFFINITY = {
  shark_attack: {
    predatory_creature: 0.35,
    aquatic_space: 0.2
  },

  snake_attack: {
    predatory_creature: 0.35,
    giant_creature: 0.15
  },

  ghost_possession: {
    entity_possession: 0.5,
    ghost_apparition: 0.35
  },

  demonic_possession: {
    entity_possession: 0.45,
    demonic_entity: 0.3
  },

  revenge_ghost: {
    ghost_apparition: 0.45,
    folklore_entity: 0.15
  },

  cursed_object: {
    haunted_object: 0.35,
    paranormal_media: 0.15
  },

  haunted_object: {
    cursed_object: 0.35
  },

  mythic_creature: {
    folklore_entity: 0.35
  },

  folklore_entity: {
    mythic_creature: 0.35,
    myth_reframing: 0.15
  },

  wish_with_a_price: {
    occult_trade: 0.3
  },

  occult_trade: {
    wish_with_a_price: 0.3,
    occult_ritual: 0.15
  },

  isolated_house: {
    house_space: 0.45
  },

  house_space: {
    isolated_house: 0.45,
    barn_space: 0.18
  },

  kidnapping: {
    trapped_survival: 0.25,
    home_confinement: 0.25,
    sadistic_captor: 0.25
  },

  trapped_survival: {
    kidnapping: 0.25,
    home_confinement: 0.2
  },

  body_transfer: {
    distorted_reality: 0.25,
    alternate_dimension: 0.15
  },

  distorted_reality: {
    alternate_dimension: 0.25,
    body_transfer: 0.25,
    hallucinated_presence: 0.2,
    guilt_manifestation: 0.15
  },

  time_loop: {
    spatial_loop: 0.35,
    countdown_structure: 0.15
  },

  spatial_loop: {
    time_loop: 0.35,
    liminal_space: 0.2
  },

  liminal_space: {
    spatial_loop: 0.2,
    subway_space: 0.15
  },

  media_based_investigation: {
    paranormal_media: 0.25,
    audio_contact: 0.2
  },

  paranormal_media: {
    media_based_investigation: 0.25,
    audio_contact: 0.15
  },

  audio_contact: {
    paranormal_media: 0.15,
    media_based_investigation: 0.2
  },

  zombie: {
    fungal_infection: 0.2,
    infected_society: 0.25,
    chemical_outbreak: 0.15,
    spreading_contamination: 0.15
  },

  fungal_infection: {
    zombie: 0.2,
    spreading_contamination: 0.25
  },

  chemical_outbreak: {
    spreading_contamination: 0.3,
    zombie: 0.15
  },

  spreading_contamination: {
    chemical_outbreak: 0.3,
    fungal_infection: 0.25,
    zombie: 0.15
  },

  human_hunt: {
    enemy_pursuit: 0.3
  },

  enemy_pursuit: {
    human_hunt: 0.3
  },

  trauma_return: {
    grief_trauma: 0.2
  },

  grief_trauma: {
    trauma_return: 0.2,
    guilt_manifestation: 0.15
  },

  maternal_horror: {
    parent_child_pair: 0.2,
    grief_trauma: 0.15
  },

  giant_creature: {
    predatory_creature: 0.15
  },

  killer_doll: {
    cursed_object: 0.15,
    haunted_object: 0.15
  }
};

function getBaseSpecificityMultiplier(tier) {
  return SIMILARITY_MODEL.BASE_SPECIFICITY[tier] ?? 1.0;
}

function getConfidenceMultiplier(confidence) {
  return SIMILARITY_MODEL.CONFIDENCE_MULTIPLIERS[confidence] ?? 1.0;
}

function getRarityMultiplier(tag, stats) {
  const N = stats.totalMovies || 1;
  const freq = stats.canonTagFrequency?.[tag] || 0;
  const raw = 1 + 0.35 * Math.log((N + 1) / (freq + 1));
  return Math.max(0.75, Math.min(1.35, raw));
}

function getCanonTagWeight(tag, stats) {
  const meta = CANON_TAG_META[tag] || { tier: "standard", confidence: "stable" };
  return (
    getBaseSpecificityMultiplier(meta.tier) *
    getConfidenceMultiplier(meta.confidence) *
    getRarityMultiplier(tag, stats)
  );
}

function buildCanonWeightMap(stats) {
  const map = {};
  const allTags = new Set([
    ...Object.keys(CANON_TAG_META),
    ...Object.keys(stats.canonTagFrequency || {})
  ]);

  for (const tag of allTags) {
    map[tag] = getCanonTagWeight(tag, stats);
  }

  return map;
}

function weightedJaccard(arrA = [], arrB = [], weightMap = {}) {
  const setA = new Set(arrA || []);
  const setB = new Set(arrB || []);
  const union = new Set([...setA, ...setB]);

  let intersectionWeight = 0;
  let unionWeight = 0;

  for (const item of union) {
    const w = weightMap[item] ?? 1;
    unionWeight += w;
    if (setA.has(item) && setB.has(item)) {
      intersectionWeight += w;
    }
  }

  return unionWeight === 0 ? 0 : intersectionWeight / unionWeight;
}

function calcUnionWeight(arrA = [], arrB = [], weightMap = {}) {
  const union = new Set([...(arrA || []), ...(arrB || [])]);
  let sum = 0;
  for (const item of union) {
    sum += weightMap[item] ?? 1;
  }
  return sum;
}

function calcCanonAffinityWeight(arrA = [], arrB = [], canonWeightMap = {}) {
  const setA = new Set(arrA || []);
  const setB = new Set(arrB || []);

  let affinityWeight = 0;
  const seenPairs = new Set();

  for (const tagA of setA) {
    const links = CANON_AFFINITY[tagA];
    if (!links) continue;

    for (const [tagB, coeff] of Object.entries(links)) {
      const pairKey = [tagA, tagB].sort().join("::");
      if (seenPairs.has(pairKey)) continue;
      if (!setB.has(tagB)) continue;
      if (setA.has(tagB)) continue;

      const weightA = canonWeightMap[tagA] ?? 1;
      const weightB = canonWeightMap[tagB] ?? 1;

      affinityWeight += Math.min(weightA, weightB) * coeff;
      seenPairs.add(pairKey);
    }
  }

  return affinityWeight;
}

function buildCountryWeights(movies) {
  const freq = {};
  const totalMovies = movies.length;

  for (const movie of movies) {
    for (const country of movie.countries || []) {
      freq[country] = (freq[country] || 0) + 1;
    }
  }

  const weights = {};

  for (const [country, count] of Object.entries(freq)) {
    const raw = 0.4 + Math.log((totalMovies + 1) / (count + 1));
    weights[country] = Math.max(0.4, Math.min(1.4, raw));
  }

  return weights;
}

function buildSimilarityStats(movies) {
  const canonTagFrequency = {};

  for (const movie of movies) {
    const uniqueCanon = new Set(movie.canon || []);
    for (const tag of uniqueCanon) {
      canonTagFrequency[tag] = (canonTagFrequency[tag] || 0) + 1;
    }
  }

  return {
    totalMovies: movies.length,
    canonTagFrequency,
    countryWeights: buildCountryWeights(movies)
  };
}

function calcMovieSimilarity(movieA, movieB, stats) {
  const canonWeights = buildCanonWeightMap(stats);

  const canonExactNorm = weightedJaccard(movieA.canon, movieB.canon, canonWeights);
  const canonUnionWeight = calcUnionWeight(movieA.canon, movieB.canon, canonWeights);
  const canonAffinityWeight = calcCanonAffinityWeight(movieA.canon, movieB.canon, canonWeights);

  const canonExactScore =
    SIMILARITY_MODEL.SCORE_CAPS.canonExact * canonExactNorm;

  const canonAffinityScore =
    canonUnionWeight === 0
      ? 0
      : SIMILARITY_MODEL.SCORE_CAPS.canonAffinity *
        Math.min(canonAffinityWeight / canonUnionWeight, 1);

  const modifierNorm = weightedJaccard(
    movieA.modifiers,
    movieB.modifiers,
    MODIFIER_WEIGHTS
  );
  const modifierScore =
    SIMILARITY_MODEL.SCORE_CAPS.modifiers * modifierNorm;

  const canonCore = canonExactScore + canonAffinityScore;
  const canonNormForGates =
    (SIMILARITY_MODEL.SCORE_CAPS.canonExact + SIMILARITY_MODEL.SCORE_CAPS.canonAffinity) === 0
      ? 0
      : canonCore / (
          SIMILARITY_MODEL.SCORE_CAPS.canonExact +
          SIMILARITY_MODEL.SCORE_CAPS.canonAffinity
        );

  const broadNorm = weightedJaccard(
    movieA.broadFamilies,
    movieB.broadFamilies,
    BROAD_FAMILY_WEIGHTS
  );
  const broadGate = 0.4 + 0.6 * canonNormForGates;
  const broadScore =
    SIMILARITY_MODEL.SCORE_CAPS.broadFamilies * broadNorm * broadGate;

  const formatNorm = weightedJaccard(
    movieA.formats,
    movieB.formats,
    FORMAT_WEIGHTS
  );
  const allowFormatBonus =
    canonCore >= SIMILARITY_MODEL.GATES.minCanonOrModifierForFormats ||
    modifierScore >= SIMILARITY_MODEL.GATES.minModifierScoreForFormats;

  const formatScore = allowFormatBonus
    ? SIMILARITY_MODEL.SCORE_CAPS.formats * formatNorm
    : 0;

  const coreBeforeContext =
    canonCore + modifierScore + broadScore + formatScore;

  const allowContextualLayers =
    coreBeforeContext >= SIMILARITY_MODEL.GATES.minCoreForContextualLayers;

  const genreNorm = weightedJaccard(
    movieA.extraGenres,
    movieB.extraGenres,
    EXTRA_GENRE_WEIGHTS
  );
  const genreScore = allowContextualLayers
    ? SIMILARITY_MODEL.SCORE_CAPS.genres * genreNorm
    : 0;

  const countryNorm = weightedJaccard(
    movieA.countries,
    movieB.countries,
    stats.countryWeights || {}
  );
  const countryScore = allowContextualLayers
    ? SIMILARITY_MODEL.SCORE_CAPS.countries * countryNorm
    : 0;

  const finalScore =
    canonExactScore +
    canonAffinityScore +
    modifierScore +
    broadScore +
    formatScore +
    genreScore +
    countryScore;

  const exactCanonOverlapCount = (movieA.canon || []).filter(tag =>
    (movieB.canon || []).includes(tag)
  ).length;

  const passesCoreGate =
    exactCanonOverlapCount >= 1 ||
    canonCore >= SIMILARITY_MODEL.GATES.minCanonCoreScore;

  const passesFinalGate =
    finalScore >= SIMILARITY_MODEL.GATES.minFinalScore;

  return {
    finalScore,
    passesGate: passesCoreGate && passesFinalGate,
    tier:
      finalScore >= SIMILARITY_MODEL.GATES.minScoreForStrongMatch
        ? "strong"
        : finalScore >= SIMILARITY_MODEL.GATES.minScoreForGoodMatch
          ? "good"
          : finalScore >= SIMILARITY_MODEL.GATES.minScoreForWeakMatch
            ? "weak"
            : "none",
    breakdown: {
      canonExactScore,
      canonAffinityScore,
      modifierScore,
      broadScore,
      formatScore,
      genreScore,
      countryScore
    },
    debug: {
      exactCanonOverlapCount,
      passesCoreGate,
      passesFinalGate,
      canonCore,
      coreBeforeContext
    }
  };
}

function getSharedItems(arrA = [], arrB = []) {
  const setB = new Set(arrB || []);
  return (arrA || []).filter(item => setB.has(item));
}

function getSimilarityExplanation(movieA, movieB) {
  return {
    sharedCanon: getSharedItems(movieA.canon, movieB.canon),
    sharedModifiers: getSharedItems(movieA.modifiers, movieB.modifiers),
    sharedBroadFamilies: getSharedItems(movieA.broadFamilies, movieB.broadFamilies),
    sharedFormats: getSharedItems(movieA.formats, movieB.formats),
    sharedGenres: getSharedItems(movieA.extraGenres, movieB.extraGenres),
    sharedCountries: getSharedItems(movieA.countries, movieB.countries)
  };
}

function getSimilarMovies(targetMovie, allMovies) {
  const stats = buildSimilarityStats(allMovies);

  return allMovies
    .filter(movie => movie.id !== targetMovie.id)
    .map(movie => {
      const similarity = calcMovieSimilarity(targetMovie, movie, stats);
      return {
        movie,
        similarity,
        explanation: getSimilarityExplanation(targetMovie, movie)
      };
    })
    .filter(item => item.similarity.passesGate)
    .sort((a, b) => b.similarity.finalScore - a.similarity.finalScore)
    .slice(0, SIMILARITY_MODEL.MAX_RESULTS);
}

function getSimilarMovieCards(targetMovieId, allMovies) {
  const targetMovie = (allMovies || []).find(movie => String(movie.id) === String(targetMovieId));

  if (!targetMovie) {
    return [];
  }

  return getSimilarMovies(targetMovie, allMovies).map(item => ({
    id: item.movie.id,
    title: item.movie.title,
    year: item.movie.year,
    score: Math.round(item.similarity.finalScore),
    tier: item.similarity.tier
  }));
}