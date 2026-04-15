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
    }
  };