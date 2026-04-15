window.HORROR_TAXONOMY = {
    subgenres: [
      'slasher',
      'home_invasion',
      'creature_feature',
      'supernatural_horror',
      'possession',
      'cult_ritual',
      'survival_game',
      'trapped_survival',
      'infection_outbreak',
      'disaster_horror',
      'mystery_horror'
    ],
  
    formats: [
      'classic',
      'found_footage',
      'screenlife',
      'anthology'
    ],
  
    tags: [
      'killer',
      'group',
      'creature',
      'ghost',
      'demon',
      'curse',
      'cult',
      'ritual',
      'infection',
      'media',
      'unknown',
      'animal',
      'monster',
      'humanoid',
      'natural_origin',
      'scientific_origin',
      'alien_origin',
      'supernatural_origin',
      'attack',
      'spreading',
      'possession',
      'control',
      'replacement',
      'rules',
      'paranoia_group',
      'survival',
      'trapped',
      'remote',
      'search',
      'game',
      'disaster',
      'transformation',
      'undead',
      'loop',
      'simulation',
      'body_horror',
      'home_space',
      'intrusion',
      'siege'
    ],
  
    triggers: [
      'gore',
      'child_harm',
      'mental_instability',
      'reality_distortion',
      'suicide',
      'animal_death',
      'animal_abuse',
      'domestic_violence',
      'sexual_violence',
      'pregnancy',
      'body_invasion',
      'breathing_distress',
      'claustrophobia',
      'animal_phobia'
    ],
  
    subgenre_scoring: {
      weights: {
        slasher: {
          killer: 3,
          attack: 1
        },
  
        home_invasion: {
          intrusion: 3,
          home_space: 2,
          siege: 2,
          killer: 1,
          group: 1,
          attack: 1,
          trapped: 1,
          survival: 1,
          remote: 1
        },
  
        creature_feature: {
          creature: 3,
          animal: 2,
          monster: 2,
          humanoid: 1,
          natural_origin: 1,
          scientific_origin: 1,
          alien_origin: 2,
          attack: 1,
          replacement: 1,
          survival: 1,
          remote: 1,
          transformation: 1,
          undead: 1
        },
  
        supernatural_horror: {
          ghost: 3,
          demon: 3,
          curse: 3,
          ritual: 1,
          media: 1,
          humanoid: 1,
          supernatural_origin: 2,
          possession: 1,
          transformation: 1,
          undead: 1
        },
  
        possession: {
          possession: 3,
          control: 2
        },
  
        cult_ritual: {
          cult: 3,
          ritual: 3,
          control: 1
        },
  
        survival_game: {
          rules: 3,
          game: 3
        },
  
        trapped_survival: {
          animal: 1,
          attack: 1,
          paranoia_group: 1,
          survival: 2,
          trapped: 3,
          remote: 2
        },
  
        infection_outbreak: {
          infection: 4,
          scientific_origin: 1,
          spreading: 1,
          survival: 1,
          disaster: 1,
          undead: 2
        },
  
        disaster_horror: {
          spreading: 1,
          disaster: 3
        },
  
        mystery_horror: {
          curse: 1,
          media: 1,
          unknown: 2,
          replacement: 2,
          paranoia_group: 2,
          search: 3
        }
      },
  
      modifiers: [
        {
          type: 'bonus_if_all_tags_present',
          subgenre: 'infection_outbreak',
          tags: ['body_horror', 'infection'],
          bonus: 1
        },
        {
          type: 'bonus_if_all_tags_present',
          subgenre: 'creature_feature',
          tags: ['body_horror', 'creature'],
          bonus: 1
        },
        {
          type: 'bonus_if_all_tags_present',
          subgenre: 'supernatural_horror',
          tags: ['body_horror', 'supernatural_origin'],
          bonus: 1
        },
        {
          type: 'bonus_if_all_tags_present',
          subgenre: 'trapped_survival',
          tags: ['loop', 'trapped', 'survival'],
          bonus: 1
        }
      ],
  
      requirements: [
        {
          type: 'requires_tag',
          subgenre: 'infection_outbreak',
          tag: 'infection'
        },
        {
          type: 'requires_tag',
          subgenre: 'survival_game',
          tag: 'rules'
        },
        {
          type: 'requires_tag',
          subgenre: 'home_invasion',
          tag: 'intrusion'
        },
        {
          type: 'requires_any_tag',
          subgenre: 'home_invasion',
          tags: ['home_space', 'siege']
        },
        {
          type: 'requires_all_tags',
          subgenre: 'creature_feature',
          tags: ['creature']
        },
        {
          type: 'requires_any_tag',
          subgenre: 'creature_feature',
          tags: ['attack']
        }
      ],
  
      restrictions: [
        {
          type: 'zero_score_if_missing_tag',
          subgenre: 'infection_outbreak',
          tag: 'infection'
        },
        {
          type: 'zero_score_if_missing_tag',
          subgenre: 'survival_game',
          tag: 'rules'
        },
        {
          type: 'zero_score_if_missing_tag',
          subgenre: 'home_invasion',
          tag: 'intrusion'
        },
        {
          type: 'zero_score_if_not_any_conditions_met',
          subgenre: 'home_invasion',
          any_tags: ['home_space', 'siege']
        },
        {
          type: 'zero_score_if_not_all_conditions_met',
          subgenre: 'creature_feature',
          all_tags: ['creature'],
          any_tags: ['attack']
        }
      ],
  
      priority_rules: [
        {
          type: 'prefer_subgenre_if_any_tags_present',
          preferred_subgenre: 'supernatural_horror',
          over_subgenre: 'creature_feature',
          tags: ['supernatural_origin', 'ghost', 'demon', 'curse']
        },
        {
          type: 'prefer_subgenre_if_tag_present',
          preferred_subgenre: 'possession',
          over_subgenre: 'supernatural_horror',
          tag: 'possession'
        },
        {
          type: 'prefer_subgenre_if_all_tags_present',
          preferred_subgenre: 'cult_ritual',
          over_subgenre: 'supernatural_horror',
          tags: ['cult', 'ritual']
        },
        {
          type: 'prefer_subgenre_if_tag_present',
          preferred_subgenre: 'infection_outbreak',
          over_subgenre: 'disaster_horror',
          tag: 'infection'
        },
        {
          type: 'prefer_subgenre_if_tag_present',
          preferred_subgenre: 'survival_game',
          over_subgenre: 'trapped_survival',
          tag: 'rules'
        },
        {
          type: 'prefer_subgenre_if_tag_present',
          preferred_subgenre: 'home_invasion',
          over_subgenre: 'trapped_survival',
          tag: 'intrusion'
        },
        {
          type: 'prefer_subgenre_if_all_tags_present',
          preferred_subgenre: 'home_invasion',
          over_subgenre: 'slasher',
          tags: ['intrusion', 'home_space']
        }
      ],
  
      tie_break_order: [
        'survival_game',
        'possession',
        'cult_ritual',
        'infection_outbreak',
        'home_invasion',
        'supernatural_horror',
        'trapped_survival',
        'creature_feature',
        'mystery_horror',
        'disaster_horror',
        'slasher'
      ],
  
      secondary_rules: {
        min_ratio_from_primary: 0.65,
        max_secondary_count: 2
      }
    },
  
    similarity_scoring: {
      formula: {
        canon_tag_score_multiplier: 1.0,
        perceived_tag_score_multiplier: 0.3,
        format_score_multiplier: 1.0,
        trigger_score_multiplier: 1.0,
        subgenre_score_multiplier: 1.0
      },
  
      canon_tag_weights: {
        default: 1,
        rare_or_high_signal: 2,
        body_horror: 1,
        loop: 2,
        simulation: 2,
        replacement: 2,
        paranoia_group: 2
      },
  
      format_weights: {
        same_format: 3,
        same_format_bonus_formats: {
          found_footage: 4,
          screenlife: 4,
          anthology: 4,
          classic: 3
        }
      },
  
      trigger_weights: {
        same_trigger: 0.5
      },
  
      subgenre_weights: {
        same_primary: 1.5,
        primary_secondary_overlap: 1.0,
        same_secondary: 0.75
      }
    },
  
    dual_layer_logic: {
      filtering_uses: 'perceived',
      subgenre_uses: 'canon',
      recommendations_use: 'canon_primary_perceived_secondary'
    },

    tag_validation_rules: {
      warnings: [
        {
          code: 'MISSING_BASE_CREATURE',
          if_tags_present: ['monster'],
          if_tags_absent: ['creature'],
          message: 'monster без creature выглядит неконсистентно.'
        },
        {
          code: 'MISSING_BASE_HUMANOID',
          if_tags_present: ['humanoid'],
          if_tags_absent: ['creature'],
          message: 'humanoid без creature выглядит неконсистентно.'
        },
        {
          code: 'MISSING_BASE_ANIMAL',
          if_tags_present: ['animal'],
          if_tags_absent: ['creature'],
          message: 'animal без creature выглядит неконсистентно.'
        },
        {
          code: 'OVERPACKED_CREATURE_CLUSTER',
          if_tags_present: ['creature', 'monster', 'humanoid', 'animal'],
          message: 'Слишком плотная разметка creature-кластера. Проверь, нужны ли все уточнения.'
        },
        {
          code: 'POSSESSION_CONTROL_AUTO_BUNDLE',
          if_tags_present: ['possession', 'control'],
          message: 'Проверь, control действительно играет отдельную роль, а не добавлен автоматически.'
        },
        {
          code: 'FULL_SURVIVAL_BUNDLE',
          if_tags_present: ['survival', 'trapped', 'remote'],
          message: 'Проверь, все три тега действительно нужны, а не описывают один и тот же контур ситуации.'
        },
        {
          code: 'GAME_WITHOUT_RULES',
          if_tags_present: ['game'],
          if_tags_absent: ['rules'],
          message: 'game без rules подозрителен.'
        },
        {
          code: 'BODY_TRANSFORMATION_AUTO_PAIR',
          if_tags_present: ['transformation', 'body_horror'],
          message: 'Проверь, оба тега действительно нужны, а не поставлены автоматически парой.'
        },
        {
          code: 'UNKNOWN_OVERUSE',
          if_tags_present: ['unknown'],
          message: 'Проверь, unknown отражает структурную неопределённость, а не отсутствие уверенности у разметчика.'
        },
        {
          code: 'LOOP_NOT_GAME',
          if_tags_present: ['loop'],
          message: 'loop сам по себе не должен тянуть survival_game.'
        },
        {
          code: 'SIMULATION_NOT_GAME',
          if_tags_present: ['simulation'],
          message: 'simulation сам по себе не должен тянуть survival_game.'
        }
      ]
    }
  };

  (function attachHorrorTaxonomyHelpers() {
    const taxonomy = window.HORROR_TAXONOMY;
  
    if (!taxonomy) {
      return;
    }
  
    function toStringArray(value) {
      if (!Array.isArray(value)) {
        return [];
      }
  
      return [...new Set(
        value
          .filter(Boolean)
          .map(item => String(item).trim())
          .filter(Boolean)
      )];
    }
  
    function buildTagSet(tags) {
      return new Set(toStringArray(tags));
    }
  
    function hasTag(tagSet, tag) {
      return tagSet.has(tag);
    }
  
    function hasAllTags(tagSet, tags) {
      return (tags || []).every(tag => tagSet.has(tag));
    }
  
    function hasAnyTags(tagSet, tags) {
      return (tags || []).some(tag => tagSet.has(tag));
    }
  
    function getCanonTags(movie) {
      return toStringArray(movie?.tags_canon);
    }
  
    function getPerceivedTags(movie) {
      return toStringArray(movie?.tags_perceived);
    }
  
    function getFormats(movie) {
      return toStringArray(movie?.formats);
    }
  
    function getTriggers(movie) {
      return toStringArray(movie?.triggers);
    }
  
    function validateMovieTags(movie) {
      const tags = getCanonTags(movie);
      const tagSet = buildTagSet(tags);
      const warnings = [];
  
      for (const warning of taxonomy.tag_validation_rules?.warnings || []) {
        const presentOk = hasAllTags(tagSet, warning.if_tags_present || []);
        const absentOk = !hasAnyTags(tagSet, warning.if_tags_absent || []);
  
        if (presentOk && absentOk) {
          warnings.push({
            code: warning.code,
            message: warning.message
          });
          continue;
        }
  
        if (
          warning.if_tags_present &&
          !warning.if_tags_absent &&
          presentOk
        ) {
          warnings.push({
            code: warning.code,
            message: warning.message
          });
        }
      }
  
      return {
        tags,
        warnings,
        isValid: warnings.length === 0
      };
    }
  
    function calculateSubgenreScores(movie) {
      const canonTags = getCanonTags(movie);
      const tagSet = buildTagSet(canonTags);
      const weights = taxonomy.subgenre_scoring?.weights || {};
      const restrictions = taxonomy.subgenre_scoring?.restrictions || [];
      const modifiers = taxonomy.subgenre_scoring?.modifiers || [];
  
      const scores = {};
  
      for (const subgenre of taxonomy.subgenres || []) {
        const subgenreWeights = weights[subgenre] || {};
        let score = 0;
  
        for (const [tag, weight] of Object.entries(subgenreWeights)) {
          if (hasTag(tagSet, tag)) {
            score += Number(weight) || 0;
          }
        }
  
        for (const modifier of modifiers || []) {
          if (modifier.subgenre !== subgenre) {
            continue;
          }
  
          if (
            modifier.type === 'bonus_if_all_tags_present' &&
            hasAllTags(tagSet, modifier.tags || [])
          ) {
            score += Number(modifier.bonus) || 0;
          }
        }
  
        scores[subgenre] = score;
      }
  
      for (const restriction of restrictions) {
        const subgenre = restriction.subgenre;
  
        if (!(subgenre in scores)) {
          continue;
        }
  
        if (
          restriction.type === 'zero_score_if_missing_tag' &&
          !hasTag(tagSet, restriction.tag)
        ) {
          scores[subgenre] = 0;
        }
  
        if (
          restriction.type === 'zero_score_if_not_any_conditions_met' &&
          !hasAnyTags(tagSet, restriction.any_tags || [])
        ) {
          scores[subgenre] = 0;
        }
  
        if (
          restriction.type === 'zero_score_if_not_all_conditions_met' &&
          (
            !hasAllTags(tagSet, restriction.all_tags || []) ||
            !hasAnyTags(tagSet, restriction.any_tags || [])
          )
        ) {
          scores[subgenre] = 0;
        }
      }
  
      return scores;
    }
  
    function applyPriorityRules(scores, movie) {
      const canonTags = getCanonTags(movie);
      const tagSet = buildTagSet(canonTags);
      const nextScores = { ...scores };
  
      for (const rule of taxonomy.subgenre_scoring?.priority_rules || []) {
        const preferred = rule.preferred_subgenre;
        const over = rule.over_subgenre;
  
        if (!(preferred in nextScores) || !(over in nextScores)) {
          continue;
        }
  
        let ruleMatched = false;
  
        if (
          rule.type === 'prefer_subgenre_if_tag_present' &&
          hasTag(tagSet, rule.tag)
        ) {
          ruleMatched = true;
        }
  
        if (
          rule.type === 'prefer_subgenre_if_any_tags_present' &&
          hasAnyTags(tagSet, rule.tags || [])
        ) {
          ruleMatched = true;
        }
  
        if (
          rule.type === 'prefer_subgenre_if_all_tags_present' &&
          hasAllTags(tagSet, rule.tags || [])
        ) {
          ruleMatched = true;
        }
  
        if (ruleMatched && nextScores[over] >= nextScores[preferred]) {
          nextScores[preferred] = nextScores[over] + 0.001;
        }
      }
  
      return nextScores;
    }
  
    function resolveMovieSubgenres(movie) {
      const rawScores = calculateSubgenreScores(movie);
      const scores = applyPriorityRules(rawScores, movie);
      const ranked = Object.entries(scores)
        .filter(([, score]) => score > 0)
        .sort((a, b) => {
          if (b[1] !== a[1]) {
            return b[1] - a[1];
          }
  
          const order = taxonomy.subgenre_scoring?.tie_break_order || [];
          return order.indexOf(a[0]) - order.indexOf(b[0]);
        });
  
      if (ranked.length === 0) {
        return {
          scores,
          primary_subgenre: null,
          secondary_subgenres: []
        };
      }
  
      const primary_subgenre = ranked[0][0];
      const primaryScore = ranked[0][1];
      const minRatio = taxonomy.subgenre_scoring?.secondary_rules?.min_ratio_from_primary ?? 0.65;
      const maxSecondaryCount = taxonomy.subgenre_scoring?.secondary_rules?.max_secondary_count ?? 2;
  
      const secondary_subgenres = ranked
        .slice(1)
        .filter(([, score]) => score >= primaryScore * minRatio)
        .slice(0, maxSecondaryCount)
        .map(([subgenre]) => subgenre);
  
      return {
        scores,
        primary_subgenre,
        secondary_subgenres
      };
    }
  
    taxonomy.helpers = {
      toStringArray,
      getCanonTags,
      getPerceivedTags,
      getFormats,
      getTriggers,
      validateMovieTags,
      calculateSubgenreScores,
      resolveMovieSubgenres
    };
  })();