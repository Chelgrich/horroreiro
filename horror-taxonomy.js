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

/*
 * РЕГЛАМЕНТ CANON_TAG_META / TAXONOMY 2.0
 *
 * Canon-тег добавляется не ради подробности, а только если он помогает
 * точнее описать реальную механику ужаса и улучшает доверительную похожесть.
 *
 * Новый canon-тег проходит цикл:
 * 1. provisional — идея тега, используется осторожно;
 * 2. observe — тег добавлен, но требует ретро-проверки старых карточек;
 * 3. stable — тег прошёл проверку и реально помогает системе;
 * 4. deprecated — тег больше не использовать, заменить другим.
 *
 * Перед добавлением нового тега нужно зафиксировать:
 * — зачем он нужен;
 * — когда его ставить;
 * — когда его НЕ ставить;
 * — какие теги рядом;
 * — чем он отличается от близких тегов;
 * — какие старые фильмы надо проверить;
 * — примеры и анти-примеры.
 *
 * После добавления нового тега обязательно:
 * — запустить «Диагностика тегов»;
 * — запустить «Аудит canon»;
 * — при необходимости сделать JSON-патч для старых карточек;
 * — запустить «Аудит похожести».
 *
 * Количество похожих фильмов не является целью.
 * Пустой блок похожих допустим; плохая рекомендация хуже пустого блока.
 */

const CANON_TAG_STATUSES = {
  provisional: 'provisional',
  observe: 'observe',
  stable: 'stable',
  deprecated: 'deprecated'
};

const CANON_TAG_ROLES = {
  threat_type: 'threat_type',
  threat_behavior: 'threat_behavior',
  mechanism: 'mechanism',
  structure: 'structure',
  setting: 'setting',
  human_dynamics: 'human_dynamics',
  psychological_wound: 'psychological_wound',
  investigation_frame: 'investigation_frame',
  temporal_mechanism: 'temporal_mechanism',
  format_bridge: 'format_bridge',
  tone_adjacent: 'tone_adjacent'
};

function createCanonTagMeta({
  tier = 'standard',
  confidence = 'stable',
  status = CANON_TAG_STATUSES.stable,
  role = null,
  families = [],
  lanes = [],
  useWhen = '',
  avoidWhen = '',
  examples = [],
  counterExamples = [],
  replaces = [],
  replacedBy = []
} = {}) {
  return {
    tier,
    confidence,
    status,
    role,
    families,
    lanes,
    useWhen,
    avoidWhen,
    examples,
    counterExamples,
    replaces,
    replacedBy
  };
}

function getCanonTagMeta(tag) {
  const meta = CANON_TAG_META[tag];

  if (!meta) {
    return createCanonTagMeta();
  }

  return createCanonTagMeta(meta);
}

function getCanonTagMetaArray(tag, fieldName) {
  const values = getCanonTagMeta(tag)?.[fieldName];

  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map(value => String(value || '').trim())
    .filter(Boolean);
}

const CANON_TAG_META = {
  abandoned_settlement: { tier: "standard", confidence: "observe" },
  abuse_trauma: { tier: "standard", confidence: "stable" },
  ai_generated: { tier: "standard", confidence: "observe" },
  alien_creature: { tier: "standard", confidence: "observe" },
  alien_threat: { tier: "anchor", confidence: "stable" },
  alternate_dimension: { tier: "anchor", confidence: "stable" },
  amusement_park: { tier: "standard", confidence: "observe" },
  ancient_curse: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['ritual_mechanism', 'threat_origin'],
    lanes: ['ritual_occult_lane', 'supernatural_entity_lane'],
    useWhen: 'Проклятие имеет древнее, наследуемое или исторически закреплённое происхождение и работает как реальная механика угрозы.',
    avoidWhen: 'Есть просто старая легенда, страшная история или атмосферное упоминание древности без действующего проклятия.',
    examples: ['Астрал. Амулет зла', 'Капитан Крюк: Проклятые берега'],
    counterExamples: []
  }),
  anthology_linkage: { tier: "standard", confidence: "stable" },
  apartment_space: { tier: "standard", confidence: "stable" },
  aquatic_space: { tier: "standard", confidence: "stable" },
  assimilation_pressure: { tier: "standard", confidence: "observe" },
  audio_contact: { tier: "anchor", confidence: "stable" },
  barn_space: { tier: "standard", confidence: "stable" },
  bayou_setting: { tier: "standard", confidence: "observe" },
  black_magic: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['ritual_mechanism', 'threat_origin'],
    lanes: ['ritual_occult_lane'],
    useWhen: 'Ведьмовская, демоническая или оккультная магия является прямой причиной угрозы, проклятия, одержимости или вреда.',
    avoidWhen: 'Есть только общая оккультная атмосфера, символика или ритуал без подтверждённой магической практики.',
    examples: ['Астрал. Заклятие мёртвых', 'Зеркала. Пожиратели душ'],
    counterExamples: []
  }),
  body_transfer: { tier: "anchor", confidence: "stable" },
  body_transformation: { tier: "anchor", confidence: "stable" },
  boarding_school: { tier: "standard", confidence: "observe" },
  buried_past: { tier: "broad", confidence: "stable" },
  bully_retribution: { tier: "standard", confidence: "observe" },
  cannibalism: { tier: "anchor", confidence: "stable" },
  chemical_outbreak: { tier: "anchor", confidence: "stable" },
  christmas_setting: { tier: "standard", confidence: "stable" },
  childhood_trauma: { tier: "standard", confidence: "stable" },
  countdown_structure: { tier: "anchor", confidence: "stable" },
  creature_conflict: { tier: "standard", confidence: "observe" },
  cult_community: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['human_dynamics', 'ritual_mechanism', 'social_contagion'],
    lanes: ['ritual_occult_lane'],
    useWhen: 'Культ, секта или замкнутое сообщество является активным носителем угрозы, ритуала, давления или заражающей идеологии.',
    avoidWhen: 'Есть один оккультист, семейный ритуал или абстрактная религиозная тема без общинной/культовой структуры.',
    examples: ['Долина улыбок', 'Спаситель'],
    counterExamples: ['Астрал. Школа кошмаров']
  }),
  cursed_object: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['ritual_mechanism', 'threat_origin'],
    lanes: ['ritual_occult_lane', 'supernatural_entity_lane'],
    useWhen: 'Предмет является носителем проклятия, сущности, передачи угрозы или сверхъестественного эффекта.',
    avoidWhen: 'Предмет просто важен для сюжета, но не является активным источником угрозы.',
    examples: ['Рождённый из грязи', 'Свист'],
    counterExamples: []
  }),
  demonic_entity: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_origin', 'ritual_mechanism'],
    lanes: ['supernatural_entity_lane', 'ritual_occult_lane'],
    useWhen: 'Угроза явно имеет демоническую природу, но не обязательно проявляется через одержимость.',
    avoidWhen: 'Есть просто злая сущность, призрак или неопределённая сверхъестественная сила без демонической природы.',
    examples: ['Астрал. Заклятие мёртвых'],
    counterExamples: []
  }),
  demonic_possession: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['threat_origin', 'threat_behavior', 'ritual_mechanism'],
    lanes: ['supernatural_entity_lane', 'ritual_occult_lane'],
    useWhen: 'Демон захватывает тело, волю, поведение или восприятие персонажа, и одержимость является центральной механикой угрозы.',
    avoidWhen: 'Одержимость есть, но природа сущности не демоническая или не подтверждена — тогда использовать entity_possession.',
    examples: ['Она не мать', 'Одержимость Мары'],
    counterExamples: []
  }),
  deserted_island: { tier: "standard", confidence: "observe" },
  disabled_child: { tier: "standard", confidence: "observe" },
  distorted_reality: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['reality_structure'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Реальность фильма устойчиво нарушена: персонаж не может надёжно отличить реальное от искажённого, галлюцинаторного, сдвинутого или подменённого.',
    avoidWhen: 'Есть только субъективная тревога, сонная атмосфера или визуальная странность без работающей механики искажения реальности.',
    examples: ['Возвращение в Сайлент Хилл', 'Кожа к коже'],
    counterExamples: []
  }),
  dream_stalker: { tier: "anchor", confidence: "observe" },
  dysfunctional_family: { tier: "standard", confidence: "stable" },
  dysfunctional_relationship: { tier: "standard", confidence: "stable" },
  educational_pressure: { tier: "standard", confidence: "observe" },
  egyptian_theme: { tier: "standard", confidence: "observe" },
  elder_threat: { tier: "standard", confidence: "observe" },
  elite_predation: { tier: "anchor", confidence: "stable" },
  enemy_pursuit: { tier: "anchor", confidence: "stable" },
  entity_possession: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['threat_origin', 'threat_behavior'],
    lanes: ['supernatural_entity_lane'],
    useWhen: 'Сверхъестественная сущность захватывает, использует или подменяет тело/волю персонажа, но природа сущности не сводится уверенно к демону или призраку.',
    avoidWhen: 'Тип одержимости явно демонический или призрачный — тогда использовать demonic_possession или ghost_possession.',
    examples: ['Рождённый из грязи', 'Что случилось с Дороти Белл?'],
    counterExamples: []
  }),
  evil_spirit_resurrection: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['threat_origin', 'ritual_mechanism'],
    lanes: ['supernatural_entity_lane', 'ritual_occult_lane'],
    useWhen: 'Злой дух, ведьма, сущность или сверхъестественная сила возвращается/воскрешается через ритуал, действие, место или нарушение запрета.',
    avoidWhen: 'Есть обычное появление призрака или сущности без механики возвращения/воскрешения.',
    examples: ['Они были ведьмами'],
    counterExamples: []
  }),
  family_unit: createCanonTagMeta({
    tier: "broad",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['human_dynamics'],
    lanes: [],
    useWhen: 'Семейная ячейка является важной рамкой конфликта, травмы, угрозы или мотивации персонажей.',
    avoidWhen: 'Родственники просто присутствуют в сюжете, но семейная связь не влияет на механику ужаса.',
    examples: ['Крик 7', 'Белдхэм. Проклятие ведьмы'],
    counterExamples: []
  }),
  feigned_death: { tier: "anchor", confidence: "observe" },
  flooding_disaster: { tier: "anchor", confidence: "stable" },
  folklore_entity: { tier: "anchor", confidence: "stable" },
  forest_space: { tier: "standard", confidence: "stable" },
  fractured_memory: { tier: "standard", confidence: "observe" },
  future_intrusion: { tier: "standard", confidence: "observe" },
  fungal_infection: { tier: "anchor", confidence: "stable" },
  gang_war: { tier: "standard", confidence: "observe" },
  ghost_apparition: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_origin'],
    lanes: ['supernatural_entity_lane'],
    useWhen: 'Призрак проявляется как видимое/ощутимое присутствие, но не обязательно захватывает тело или волю персонажа.',
    avoidWhen: 'Призрачная сила именно вселяется или управляет телом — тогда использовать ghost_possession.',
    examples: ['Зеркала. Пожиратели душ', 'Под светом'],
    counterExamples: []
  }),
  ghost_possession: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['threat_origin', 'threat_behavior', 'psychological_wound'],
    lanes: ['supernatural_entity_lane', 'psychological_reality_lane'],
    useWhen: 'Призрак или дух умершего захватывает, использует или подменяет тело/волю персонажа.',
    avoidWhen: 'Есть только явление призрака без захвата тела или поведения.',
    examples: ['Полезный призрак', 'Подняться на холм'],
    counterExamples: []
  }),
  giant_creature: { tier: "anchor", confidence: "stable" },
  grief_trauma: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['psychological_wound'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Утрата, скорбь или незавершённая травма являются рабочим двигателем ужаса, расследования, вины или сверхъестественной связи.',
    avoidWhen: 'Горе упомянуто биографически, но не влияет на механику угрозы или восприятие персонажа.',
    examples: ['Возвращение в Сайлент Хилл', 'Верни меня из мёртвых'],
    counterExamples: []
  }),
  group_paranoia: { tier: "standard", confidence: "observe" },
  group_survival: { tier: "standard", confidence: "stable" },
  guilt_manifestation: { tier: "standard", confidence: "observe" },
  hallucinated_presence: { tier: "standard", confidence: "observe" },
  halloween_setting: { tier: "standard", confidence: "stable" },
  haunted_animatronics: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_origin', 'threat_behavior'],
    lanes: ['supernatural_entity_lane'],
    useWhen: 'Аниматроники, куклы-механизмы или искусственные фигуры одержимы/населены сверхъестественной силой и являются активной угрозой.',
    avoidWhen: 'Аниматроники просто декорация, роботизированная угроза без сверхъестественного слоя или обычный killer_doll.',
    examples: ['Пять ночей с Фредди 2'],
    counterExamples: []
  }),
  haunted_object: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['threat_origin', 'ritual_mechanism'],
    lanes: ['supernatural_entity_lane', 'ritual_occult_lane'],
    useWhen: 'Предмет населён призраком, сущностью или сверхъестественной силой и сам запускает угрозу/контакт/одержимость.',
    avoidWhen: 'Предмет проклят, но не содержит явного присутствия сущности — тогда чаще подходит cursed_object.',
    examples: ['Верни меня из мёртвых', 'Полезный призрак'],
    counterExamples: []
  }),
  home_confinement: { tier: "anchor", confidence: "stable" },
  home_infiltration: { tier: "standard", confidence: "stable" },
  home_under_siege: { tier: "anchor", confidence: "stable" },
  house_space: { tier: "standard", confidence: "stable" },
  human_hunt: { tier: "anchor", confidence: "observe" },
  human_monstrosity: { tier: "anchor", confidence: "stable" },
  icon_reframing: { tier: "standard", confidence: "stable" },
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
  masked_killer: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_behavior'],
    lanes: ['slasher_lane'],
    useWhen: 'Угроза устойчиво считывается как масочный убийца или масочная фигура преследования.',
    avoidWhen: 'Маска есть только как разовый визуальный элемент и не определяет механику угрозы.',
    examples: ['Крик 7', 'Незнакомцы: Часть третья'],
    counterExamples: []
  }),
  maternal_horror: { tier: "anchor", confidence: "stable" },
  media_based_investigation: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.investigation_frame,
    families: ['investigation_frame'],
    lanes: ['investigation_media_lane'],
    useWhen: 'Расследование строится через медиа-материалы, записи, съёмки, журналистику, онлайн-следы или найденные свидетельства.',
    avoidWhen: 'Персонажи просто смотрят видео/фото, но медиа не являются структурой расследования.',
    examples: ['Не подглядывай', 'Шелби Оукс. Город-призрак'],
    counterExamples: []
  }),
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
  occult_book: { tier: "standard", confidence: "stable" },
  occult_ritual: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['ritual_mechanism'],
    lanes: ['ritual_occult_lane'],
    useWhen: 'Ритуал является рабочей причиной угрозы, проклятия, призыва, сделки, жертвоприношения или сверхъестественного эффекта.',
    avoidWhen: 'Есть только оккультная эстетика, символы или разговоры о ритуале без подтверждённой механики.',
    examples: ['Они придут за тобой', 'Анаконды'],
    counterExamples: []
  }),
  occult_trade: createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['ritual_mechanism', 'narrative_function'],
    lanes: ['ritual_occult_lane'],
    useWhen: 'Есть явно подтверждённая сделка, обмен, контракт или цена за сверхъестественный результат.',
    avoidWhen: 'Есть просто ритуал, проклятие, ведьмовство или оккультная практика без механики сделки.',
    examples: ['Проклятые'],
    counterExamples: ['Астрал. Школа кошмаров']
  }),
  one_night_survival: { tier: "anchor", confidence: "stable" },
  obsessive_compulsive_behavior: { tier: "standard", confidence: "observe" },
  paranormal_media: { tier: "anchor", confidence: "stable" },
  parent_child_pair: { tier: "standard", confidence: "stable" },
  pirate_setting: { tier: "standard", confidence: "observe" },
  plumbing_horror: { tier: "standard", confidence: "observe" },
  post_apocalyptic_survival: { tier: "standard", confidence: "provisional" },
  prank_horror: { tier: "anchor", confidence: "stable" },
  predatory_creature: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_origin', 'threat_behavior'],
    lanes: ['creature_lane'],
    useWhen: 'Центральная угроза фильма — хищное существо, монстр или животная угроза, охотящаяся на персонажей.',
    avoidWhen: 'Существо присутствует эпизодически или не является основной механикой угрозы.',
    examples: ['Анаконды', 'Йети', 'Остров хищника'],
    counterExamples: []
  }),
  protagonist_killer: { tier: "anchor", confidence: "stable" },
  rabies_infection: { tier: "standard", confidence: "observe" },
  reality_intrusion: { tier: "standard", confidence: "provisional" },
  religious_fundamentalism: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['human_dynamics', 'social_contagion', 'ritual_mechanism'],
    lanes: ['ritual_occult_lane'],
    useWhen: 'Религиозная догма, фанатизм или фундаменталистская община прямо формируют угрозу, наказание, давление или ритуальную систему.',
    avoidWhen: 'В фильме есть религиозная символика или священник, но религиозная система не является механизмом ужаса.',
    examples: ['Райский сад', 'Спаситель'],
    counterExamples: []
  }),
  rescue_mission: { tier: "standard", confidence: "stable" },
  ritualized_punishment: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['ritual_mechanism', 'narrative_function', 'psychological_wound'],
    lanes: ['ritual_occult_lane'],
    useWhen: 'Ужас работает как наказание по правилу, греху, нарушению запрета, сделке или моральному долгу.',
    avoidWhen: 'Есть насилие, жертвоприношение или проклятие, но нет логики наказания/испытания.',
    examples: ['Райский сад'],
    counterExamples: []
  }),
  revenge_ghost: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_origin', 'narrative_function', 'psychological_wound'],
    lanes: ['supernatural_entity_lane', 'psychological_reality_lane'],
    useWhen: 'Призрак или дух умершего возвращается как мстящая сила, связанная с прошлой несправедливостью, преступлением или травмой.',
    avoidWhen: 'Есть обычный ghost_apparition или ghost_possession без мотива мести.',
    examples: ['Затвор', 'Астрал. Амулет зла'],
    counterExamples: []
  }),
  revenge_mission: { tier: "standard", confidence: "stable" },
  revenant_killer: { tier: "anchor", confidence: "observe" },
  road_space: { tier: "standard", confidence: "stable" },
  romantic_pair: { tier: "standard", confidence: "stable" },
  roadside_motel: { tier: "standard", confidence: "observe" },
  ruins_space: { tier: "standard", confidence: "observe" },
  sacrificial_killings: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['ritual_mechanism', 'threat_behavior'],
    lanes: ['ritual_occult_lane'],
    useWhen: 'Убийства или жертвы совершаются как часть ритуала, призыва, продления жизни, сделки, культа или сверхъестественного механизма.',
    avoidWhen: 'В фильме просто много убийств или gore, но убийства не являются жертвоприношением.',
    examples: ['Они придут за тобой', 'Они были ведьмами'],
    counterExamples: []
  }),
  sadistic_captor: { tier: "anchor", confidence: "stable" },
  school_space: { tier: "standard", confidence: "stable" },
  scandinavian_setting: { tier: "standard", confidence: "observe" },
  scientific_creature: { tier: "standard", confidence: "stable" },
  scientific_experiment: { tier: "standard", confidence: "stable" },
  scuba_killer: { tier: "standard", confidence: "observe" },
  serial_killer: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_behavior'],
    lanes: ['slasher_lane'],
    useWhen: 'Угроза строится вокруг повторяющегося убийцы или серии убийств, а не одного случайного нападения.',
    avoidWhen: 'Есть масочный убийца или насильник, но нет серийной структуры убийств.',
    examples: ['Крик 7', 'Незнакомцы: Часть третья'],
    counterExamples: ['Куколка']
  }),
  shark_attack: { tier: "anchor", confidence: "stable" },
  sick_child: { tier: "standard", confidence: "observe" },
  sick_sibling: { tier: "standard", confidence: "observe" },
  sibling_pair: { tier: "provisional", confidence: "provisional" },
  ski_resort: { tier: "standard", confidence: "stable" },
  small_town_secret: { tier: "standard", confidence: "observe" },
  snake_attack: { tier: "anchor", confidence: "stable" },
  snow_isolation: { tier: "standard", confidence: "stable" },
  social_media_performance: { tier: "anchor", confidence: "stable" },
  social_status_obsession: { tier: "standard", confidence: "observe" },
  spatial_loop: { tier: "anchor", confidence: "stable" },
  spreading_contamination: { tier: "standard", confidence: "observe" },
  staged_death: { tier: "standard", confidence: "observe" },
  subway_space: { tier: "standard", confidence: "stable" },
  supernatural_influence: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['threat_origin', 'psychological_wound'],
    lanes: ['supernatural_entity_lane', 'psychological_reality_lane'],
    useWhen: 'Сверхъестественная сила заметно влияет на поведение, восприятие, решения или психику персонажа, но не оформлена как полноценная одержимость.',
    avoidWhen: 'Есть явная одержимость телом/волей — тогда использовать demonic_possession, ghost_possession или entity_possession.',
    examples: ['Одиночка', 'Тихая ночь, смертельная ночь'],
    counterExamples: []
  }),
  supernatural_killer: { tier: "anchor", confidence: "stable" },
  terminal_illness: { tier: "standard", confidence: "stable" },
  theater_space: { tier: "standard", confidence: "stable" },
  thanksgiving_setting: { tier: "standard", confidence: "observe" },
  time_displacement: { tier: "anchor", confidence: "stable" },
  time_loop: { tier: "anchor", confidence: "stable" },
  time_machine_experiment: { tier: "anchor", confidence: "observe" },
  toxic_parent: { tier: "standard", confidence: "stable" },
  transfer_death: { tier: "provisional", confidence: "provisional" },
  transferable_curse: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['ritual_mechanism', 'threat_origin'],
    lanes: ['ritual_occult_lane', 'supernatural_entity_lane'],
    useWhen: 'Проклятие передаётся от человека к человеку, через объект, действие, контакт, нарушение правила или цепочку событий.',
    avoidWhen: 'Проклятие просто существует, но не имеет механики передачи.',
    examples: ['Свист'],
    counterExamples: []
  }),
  trauma_driven_killer: { tier: "anchor", confidence: "stable" },
  trauma_return: { tier: "anchor", confidence: "stable" },
  trapped_survival: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['survival_structure'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Персонажи физически, пространственно или ситуационно заперты в режиме выживания, и невозможность выйти является частью угрозы.',
    avoidWhen: 'Персонажи просто находятся в опасном месте, но могут свободно уйти или структура ловушки не работает.',
    examples: ['Зараза', 'Монстр'],
    counterExamples: []
  }),
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
  wish_with_a_price: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['ritual_mechanism', 'narrative_function'],
    lanes: ['ritual_occult_lane'],
    useWhen: 'Персонаж получает желаемое через сверхъестественное вмешательство, но результат требует платы, жертвы, наказания или необратимой цены.',
    avoidWhen: 'Есть просто желание, молитва или просьба без подтверждённой цены/обмена.',
    examples: ['Райский сад', 'Спаситель'],
    counterExamples: []
  }),
  witchcraft: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['ritual_mechanism', 'threat_origin'],
    lanes: ['ritual_occult_lane', 'folk_myth_lane'],
    useWhen: 'Ведьмовство является реальной механикой угрозы, проклятия, ритуала, воздействия или фольклорной силы.',
    avoidWhen: 'Ведьма или ведьмовская эстетика только заявлены в названии/маркетинге, но в механике фильма не подтверждены.',
    examples: ['Гауа', 'Они были ведьмами'],
    counterExamples: []
  }),
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
  nudity: 0.7,
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

const CANON_BROAD_FAMILY_OVERRIDES = {
  ai_generated: ['reality_structure', 'narrative_function'],
  anthology_linkage: ['narrative_function'],
  buried_past: ['narrative_function', 'investigation_frame'],
  countdown_structure: ['temporal_mechanism', 'narrative_function'],
  elite_predation: ['threat_behavior', 'human_dynamics'],
  cult_community: ['human_dynamics', 'ritual_mechanism', 'social_contagion'],
  family_unit: ['human_dynamics'],
  group_survival: ['survival_structure', 'human_dynamics'],
  human_monstrosity: ['threat_behavior', 'human_dynamics'],
  icon_reframing: ['myth_reframing', 'narrative_function'],
  isolated_protagonist: ['protagonist_structure'],
  life_extension: ['ritual_mechanism', 'narrative_function'],
  moral_test: ['narrative_function'],
  myth_reframing: ['myth_reframing'],
  occult_trade: ['ritual_mechanism', 'narrative_function'],
  one_night_survival: ['survival_structure', 'temporal_mechanism'],
  prank_horror: ['narrative_function', 'threat_behavior'],
  rescue_mission: ['narrative_function', 'survival_structure'],
  revenge_mission: ['narrative_function'],
  sacrificial_killings: ['ritual_mechanism', 'threat_behavior'],
  social_media_performance: ['human_dynamics', 'investigation_frame'],
  trauma_return: ['psychological_wound', 'narrative_function'],
  uneasy_alliance: ['human_dynamics'],
  urban_legend_rabbit_hole: ['investigation_frame', 'myth_reframing'],
  wish_with_a_price: ['ritual_mechanism', 'narrative_function']
};

const CANON_BROAD_FAMILY_RULES = [
  { pattern: /(ritual|occult|witch|magic|curse|sacrificial|religious|wish|trade|punishment)/, families: ['ritual_mechanism'] },
  { pattern: /(alien|creature|entity|ghost|demonic|demon|zombie|infection|curse|folklore|mythic|witch|supernatural|mutant|scientific|haunted|cursed|revenant|vampire|animatronics)/, families: ['threat_origin'] },
  { pattern: /(killer|predat|attack|hunt|captor|pursuit|stalker|monstrosity|cannibalism|possession|transformation|erasure|contamination|infiltration|resurrection)/, families: ['threat_behavior'] },
  { pattern: /(survival|trapped|confinement|siege|rescue|isolation|deserted)/, families: ['survival_structure'] },
  { pattern: /(space|house|village|school|office|park|island|forest|snow|mountain|lighthouse|motel|settlement|wilderness|subway|theater|apartment|barn|road|ruins|waterway|aquatic|bayou|pirate|scandinavian|thanksgiving|christmas|halloween|wedding|boarding|ski|underground)/, families: ['setting_type'] },
  { pattern: /(family|parent|child|sibling|romantic|relationship|alliance|community|cult_community|gang|toxic|disabled|sick|bully|social|unrequited)/, families: ['human_dynamics'] },
  { pattern: /(trauma|grief|guilt|mental|memory|obsession|pressure|status|abuse|breakdown|illness|maternal|childhood)/, families: ['psychological_wound'] },
  { pattern: /(reality|dimension|loop|body_transfer|distorted|hallucinated|liminal|simulation|time_machine|time_displacement|future_intrusion|dream|memory|identity)/, families: ['reality_structure'] },
  { pattern: /(time|countdown|christmas|halloween|thanksgiving|future|loop)/, families: ['temporal_mechanism'] },
  { pattern: /(investigation|media|audio|internet|urban_legend|buried_past|missing_person|paranormal_media|occult_book|small_town_secret)/, families: ['investigation_frame'] },
  { pattern: /(pursuit|hunt|stalker|enemy)/, families: ['pursuit_structure'] },
  { pattern: /(spatial_loop|liminal|infrastructure|plumbing|home_infiltration|subway|alternate_dimension|road_space)/, families: ['space_mechanism'] },
  { pattern: /(myth|folklore|legend|icon_reframing|vampire|egyptian)/, families: ['myth_reframing'] },
  { pattern: /(isolated_protagonist|protagonist_killer)/, families: ['protagonist_structure'] },
  { pattern: /(infected_society|group_paranoia|spreading_contamination|assimilation_pressure|cult_community|religious_fundamentalism|social_media)/, families: ['social_contagion'] }
];

function normalizeBroadFamilies(families = []) {
  const allowedFamilies = new Set(Object.keys(BROAD_FAMILY_WEIGHTS));
  const uniqueFamilies = new Set();

  (families || []).forEach(family => {
    const normalizedFamily = String(family || '').trim();

    if (allowedFamilies.has(normalizedFamily)) {
      uniqueFamilies.add(normalizedFamily);
    }
  });

  return Array.from(uniqueFamilies);
}

function getCanonTagBroadFamilies(tag) {
  const normalizedTag = String(tag || '').trim();

  if (!normalizedTag) {
    return [];
  }

  const metaFamilies = normalizeBroadFamilies(
    getCanonTagMetaArray(normalizedTag, 'families')
  );

  if (metaFamilies.length > 0) {
    return metaFamilies;
  }

  const families = [
    ...(CANON_BROAD_FAMILY_OVERRIDES[normalizedTag] || [])
  ];

  CANON_BROAD_FAMILY_RULES.forEach(rule => {
    if (rule.pattern.test(normalizedTag)) {
      families.push(...rule.families);
    }
  });

  return normalizeBroadFamilies(families);
}

function deriveBroadFamiliesFromCanon(canonTags = []) {
  const families = [];

  (canonTags || []).forEach(tag => {
    families.push(...getCanonTagBroadFamilies(tag));
  });

  return normalizeBroadFamilies(families);
}

function resolveMovieBroadFamilies(movie) {
  const canonTags = Array.isArray(movie?.canon)
    ? movie.canon
    : Array.isArray(movie?.tags_canon)
      ? movie.tags_canon
      : [];
  const derivedFamilies = deriveBroadFamiliesFromCanon(canonTags);

  if (derivedFamilies.length > 0) {
    return derivedFamilies;
  }

  const manualFamilies = Array.isArray(movie?.broadFamilies)
    ? movie.broadFamilies
    : Array.isArray(movie?.broad_families)
      ? movie.broad_families
      : Array.isArray(movie?.tags_broad_families)
        ? movie.tags_broad_families
        : [];

  return normalizeBroadFamilies(manualFamilies);
}

const BROAD_FAMILY_CONTEXT_ONLY = new Set([
  'threat_origin',
  'threat_behavior',
  'human_dynamics',
  'setting_type'
]);

const BROAD_FAMILY_SCORING_WEIGHTS = {
  ...BROAD_FAMILY_WEIGHTS,
  threat_origin: 0.18,
  threat_behavior: 0.28,
  human_dynamics: 0.22,
  setting_type: 0.2
};

function hasStrongBroadFamily(families = []) {
  return normalizeBroadFamilies(families).some(family => !BROAD_FAMILY_CONTEXT_ONLY.has(family));
}

function getBroadFamiliesForSimilarityScoring(families = []) {
  const normalizedFamilies = normalizeBroadFamilies(families);

  if (!hasStrongBroadFamily(normalizedFamilies)) {
    return [];
  }

  return normalizedFamilies;
}

function weightedBroadFamilySimilarity(familiesA = [], familiesB = []) {
  const scoringFamiliesA = getBroadFamiliesForSimilarityScoring(familiesA);
  const scoringFamiliesB = getBroadFamiliesForSimilarityScoring(familiesB);

  return weightedJaccard(
    scoringFamiliesA,
    scoringFamiliesB,
    BROAD_FAMILY_SCORING_WEIGHTS
  );
}

const SIMILARITY_LANE_CONFIG = {
  slasher_lane: {
    perceived: ['slasher'],
    canon: [
      'masked_killer',
      'serial_killer',
      'supernatural_killer',
      'killer_duo',
      'killer_santa',
      'revenant_killer',
      'trauma_driven_killer',
      'protagonist_killer',
      'scuba_killer'
    ]
  },
  creature_lane: {
    perceived: ['creature_feature', 'animal_attack'],
    canon: [
      'predatory_creature',
      'giant_creature',
      'mutant_creature',
      'mythic_creature',
      'scientific_creature',
      'alien_creature',
      'killer_creature',
      'creature_conflict',
      'shark_attack',
      'snake_attack'
    ]
  },
  supernatural_entity_lane: {
    perceived: ['supernatural_horror', 'haunted_house', 'possession'],
    canon: [
      'demonic_entity',
      'demonic_possession',
      'entity_possession',
      'ghost_possession',
      'ghost_apparition',
      'revenge_ghost',
      'haunted_object',
      'haunted_animatronics',
      'supernatural_killer',
      'supernatural_influence',
      'evil_spirit_resurrection'
    ]
  },
  ritual_occult_lane: {
    perceived: ['religious_horror', 'folk_horror'],
    canon: [
      'occult_ritual',
      'occult_trade',
      'occult_book',
      'witchcraft',
      'black_magic',
      'ancient_curse',
      'cursed_object',
      'transferable_curse',
      'wish_with_a_price',
      'ritualized_punishment',
      'sacrificial_killings',
      'religious_fundamentalism',
      'cult_community'
    ]
  },
  psychological_reality_lane: {
    perceived: ['psychological_horror', 'mystery_horror'],
    canon: [
      'distorted_reality',
      'hallucinated_presence',
      'mental_breakdown',
      'mental_illness',
      'fractured_memory',
      'identity_erasure',
      'body_transfer',
      'alternate_dimension',
      'virtual_reality_simulation',
      'dream_stalker',
      'guilt_manifestation',
      'grief_trauma'
    ]
  },
  survival_containment_lane: {
    perceived: ['survival_horror', 'disaster_horror'],
    canon: [
      'trapped_survival',
      'home_confinement',
      'home_under_siege',
      'home_infiltration',
      'kidnapping',
      'sadistic_captor',
      'enemy_pursuit',
      'human_hunt',
      'group_survival',
      'one_night_survival',
      'rescue_mission',
      'flooding_disaster',
      'snow_isolation',
      'deserted_island',
      'war_survival',
      'post_apocalyptic_survival'
    ]
  },
  infection_outbreak_lane: {
    perceived: ['infection_outbreak', 'zombie'],
    canon: [
      'zombie',
      'fungal_infection',
      'chemical_outbreak',
      'rabies_infection',
      'spreading_contamination',
      'infected_society'
    ]
  },
  investigation_media_lane: {
    perceived: ['mystery_horror', 'conspiracy_horror'],
    canon: [
      'media_based_investigation',
      'paranormal_media',
      'audio_contact',
      'internet_folklore',
      'urban_legend_rabbit_hole',
      'missing_person_investigation',
      'small_town_secret',
      'buried_past',
      'mind_control_experiment'
    ],
    formats: ['found_footage', 'mockumentary', 'hybrid_narrative']
  },
  folk_myth_lane: {
    perceived: ['folk_horror'],
    canon: [
      'folklore_entity',
      'mythic_creature',
      'myth_reframing',
      'vampire_myth_reframing',
      'icon_reframing',
      'egyptian_theme'
    ]
  },
  body_identity_lane: {
    perceived: ['body_horror'],
    canon: [
      'body_transformation',
      'body_transfer',
      'identity_erasure',
      'maternal_horror',
      'assimilation_pressure'
    ]
  }
};

function getMovieLaneValues(movie, fields = []) {
  for (const fieldName of fields) {
    if (Array.isArray(movie?.[fieldName])) {
      return movie[fieldName].map(value => String(value || '').trim()).filter(Boolean);
    }
  }

  return [];
}

function hasMovieLaneMatch(values = [], expectedValues = []) {
  const valueSet = new Set(values || []);
  return (expectedValues || []).some(value => valueSet.has(value));
}

function isMovieMaskConflictEnabled(movie) {
  return movie?.mask_conflict === true || movie?.mask_conflict === 'true';
}

function getCanonTagsSimilarityLanes(canonTags = []) {
  const lanes = [];

  (canonTags || []).forEach(tag => {
    lanes.push(...getCanonTagMetaArray(tag, 'lanes'));
  });

  return Array.from(new Set(lanes));
}

function resolveMovieSimilarityLanes(movie = {}) {
  const laneSet = new Set();
  const canon = getMovieLaneValues(movie, ['canon', 'tags_canon']);
  const formats = getMovieLaneValues(movie, ['formats', 'tags_formats']);
  const perceived = isMovieMaskConflictEnabled(movie)
    ? []
    : getMovieLaneValues(movie, ['tags_perceived', 'perceived']);

  getCanonTagsSimilarityLanes(canon).forEach(laneName => {
    laneSet.add(laneName);
  });

  Object.entries(SIMILARITY_LANE_CONFIG).forEach(([laneName, config]) => {
    const hasPerceivedMatch = hasMovieLaneMatch(perceived, config.perceived);
    const hasCanonMatch = hasMovieLaneMatch(canon, config.canon);
    const hasFormatMatch = hasMovieLaneMatch(formats, config.formats);

    if (hasPerceivedMatch || hasCanonMatch || hasFormatMatch) {
      laneSet.add(laneName);
    }
  });

  return Array.from(laneSet);
}

function getSimilarityLaneMultiplier({ sharedLanes = [], canonCore = 0, exactCanonOverlapCount = 0, modifierScore = 0 }) {
  if (sharedLanes.length >= 2) {
    return 1.06;
  }

  if (sharedLanes.length === 1) {
    return 1;
  }

  if (exactCanonOverlapCount > 0) {
    return 0.92;
  }

  if (canonCore >= SIMILARITY_MODEL.GATES.minCanonCoreScore * 1.5) {
    return 0.88;
  }

  if (modifierScore >= 6) {
    return 0.78;
  }

  return 0.72;
}

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
  const meta = getCanonTagMeta(tag);

  if (meta.status === CANON_TAG_STATUSES.deprecated) {
    return 0;
  }

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

        const movieABroadFamilies = resolveMovieBroadFamilies(movieA);
        const movieBBroadFamilies = resolveMovieBroadFamilies(movieB);
        const broadNorm = weightedBroadFamilySimilarity(
          movieABroadFamilies,
          movieBBroadFamilies
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

  const exactCanonOverlapCount = (movieA.canon || []).filter(tag =>
    (movieB.canon || []).includes(tag)
  ).length;

  const movieALanes = resolveMovieSimilarityLanes(movieA);
  const movieBLanes = resolveMovieSimilarityLanes(movieB);
  const sharedLanes = getSharedItems(movieALanes, movieBLanes);
  const laneMultiplier = getSimilarityLaneMultiplier({
    sharedLanes,
    canonCore,
    exactCanonOverlapCount,
    modifierScore
  });

  const rawFinalScore =
    canonExactScore +
    canonAffinityScore +
    modifierScore +
    broadScore +
    formatScore +
    genreScore +
    countryScore;

  const finalScore = Math.min(100, rawFinalScore * laneMultiplier);

  const passesCoreGate =
    exactCanonOverlapCount >= 1 ||
    canonCore >= SIMILARITY_MODEL.GATES.minCanonCoreScore;

  const passesLaneGate =
    sharedLanes.length > 0 ||
    exactCanonOverlapCount >= 1 ||
    canonCore >= SIMILARITY_MODEL.GATES.minCanonCoreScore * 1.5;

  const passesFinalGate =
    finalScore >= SIMILARITY_MODEL.GATES.minFinalScore;

  return {
    finalScore,
    passesGate: passesCoreGate && passesLaneGate && passesFinalGate,
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
      passesLaneGate,
      passesFinalGate,
      canonCore,
      coreBeforeContext,
      rawFinalScore,
      laneMultiplier,
      movieALanes,
      movieBLanes,
      sharedLanes
    }
  };
}

function getSharedItems(arrA = [], arrB = []) {
  const setB = new Set(arrB || []);
  return (arrA || []).filter(item => setB.has(item));
}

function getSimilarityExplanation(movieA, movieB) {
  return {
    sharedLanes: getSharedItems(resolveMovieSimilarityLanes(movieA), resolveMovieSimilarityLanes(movieB)),
    sharedCanon: getSharedItems(movieA.canon, movieB.canon),
    sharedModifiers: getSharedItems(movieA.modifiers, movieB.modifiers),
    sharedBroadFamilies: getSharedItems(resolveMovieBroadFamilies(movieA), resolveMovieBroadFamilies(movieB)),
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

function roundSimilarityNumber(value) {
  return Math.round((Number(value) || 0) * 10) / 10;
}

function getSimilarityAuditMovieInfo(movie) {
  return {
    id: movie?.id,
    title: movie?.title || movie?.original_title || movie?.slug || 'Без названия',
    year: movie?.year ?? null
  };
}

function getSimilarityAuditPairItem(movieA, movieB, similarity, explanation) {
  return {
    movieA: getSimilarityAuditMovieInfo(movieA),
    movieB: getSimilarityAuditMovieInfo(movieB),
    score: roundSimilarityNumber(similarity.finalScore),
    tier: similarity.tier,
    passesGate: similarity.passesGate,
    sharedLanes: explanation.sharedLanes || [],
    sharedCanon: explanation.sharedCanon || [],
    sharedModifiers: explanation.sharedModifiers || [],
    sharedBroadFamilies: explanation.sharedBroadFamilies || [],
    sharedFormats: explanation.sharedFormats || [],
    sharedGenres: explanation.sharedGenres || [],
    sharedCountries: explanation.sharedCountries || [],
    breakdown: Object.fromEntries(
      Object.entries(similarity.breakdown || {}).map(([key, value]) => [
        key,
        roundSimilarityNumber(value)
      ])
    ),
    debug: {
      ...(similarity.debug || {}),
      rawFinalScore: roundSimilarityNumber(similarity.debug?.rawFinalScore),
      laneMultiplier: roundSimilarityNumber(similarity.debug?.laneMultiplier || 1)
    }
  };
}

function isSimilarityAuditPairSuspicious(pair) {
  if (!pair.passesGate) {
    return false;
  }

  const hasNoSharedCanon = pair.sharedCanon.length === 0;
  const hasNoSharedLanes = pair.sharedLanes.length === 0;
  const hasOnlySoftOverlap =
    hasNoSharedCanon &&
    pair.sharedModifiers.length >= 2 &&
    pair.sharedBroadFamilies.length >= 2;

  return hasNoSharedLanes || hasOnlySoftOverlap;
}

function getCanonTagAuditStats(movies = [], limit = 20) {
  const frequency = {};
  const moviesByTag = {};

  (movies || []).forEach(movie => {
    const uniqueCanonTags = new Set(movie?.canon || []);

    uniqueCanonTags.forEach(tag => {
      frequency[tag] = (frequency[tag] || 0) + 1;

      if (!moviesByTag[tag]) {
        moviesByTag[tag] = [];
      }

      moviesByTag[tag].push(getSimilarityAuditMovieInfo(movie));
    });
  });

  const entries = Object.entries(frequency)
    .map(([tag, count]) => ({
      tag,
      count,
      movies: moviesByTag[tag] || []
    }));

  return {
    mostFrequent: entries
      .slice()
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
      .slice(0, limit),
    singleUse: entries
      .filter(item => item.count === 1)
      .sort((a, b) => a.tag.localeCompare(b.tag))
      .slice(0, limit)
  };
}

function getSimilarityAuditReport(allMovies = [], options = {}) {
  const movies = (allMovies || []).filter(Boolean);
  const topPairsLimit = options.topPairsLimit ?? 20;
  const suspiciousPairsLimit = options.suspiciousPairsLimit ?? 20;
  const canonTagsLimit = options.canonTagsLimit ?? 20;
  const stats = buildSimilarityStats(movies);
  const passedPairs = [];
  const suspiciousPairs = [];
  const similarCountByMovieId = new Map(
    movies.map(movie => [String(movie.id), 0])
  );

  for (let firstIndex = 0; firstIndex < movies.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < movies.length; secondIndex += 1) {
      const movieA = movies[firstIndex];
      const movieB = movies[secondIndex];
      const similarity = calcMovieSimilarity(movieA, movieB, stats);
      const explanation = getSimilarityExplanation(movieA, movieB);
      const pair = getSimilarityAuditPairItem(movieA, movieB, similarity, explanation);

      if (!similarity.passesGate) {
        continue;
      }

      passedPairs.push(pair);

      similarCountByMovieId.set(String(movieA.id), (similarCountByMovieId.get(String(movieA.id)) || 0) + 1);
      similarCountByMovieId.set(String(movieB.id), (similarCountByMovieId.get(String(movieB.id)) || 0) + 1);

      if (isSimilarityAuditPairSuspicious(pair)) {
        suspiciousPairs.push(pair);
      }
    }
  }

  passedPairs.sort((a, b) => b.score - a.score);
  suspiciousPairs.sort((a, b) => b.score - a.score);

  return {
    totalMovies: movies.length,
    passedPairsCount: passedPairs.length,
    topPairs: passedPairs.slice(0, topPairsLimit),
    suspiciousPairs: suspiciousPairs.slice(0, suspiciousPairsLimit),
    moviesWithoutSimilar: movies
      .filter(movie => (similarCountByMovieId.get(String(movie.id)) || 0) === 0)
      .map(getSimilarityAuditMovieInfo),
    canonTags: getCanonTagAuditStats(movies, canonTagsLimit)
  };
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

const TAXONOMY_SUBGENRES = [
  'supernatural_horror',
  'haunted_house',
  'mystery_horror',
  'conspiracy_horror',
  'creature_feature',
  'possession',
  'survival_horror',
  'religious_horror',
  'folk_horror',
  'psychological_horror',
  'slasher',
  'animal_attack',
  'infection_outbreak',
  'body_horror',
  'cannibal_horror',
  'horror_comedy',
  'zombie',
  'disaster_horror'
];

const TAXONOMY_FORMATS = [
  'found_footage',
  'mockumentary',
  'hybrid_narrative',
  'anthology',
  'silent_film'
];

const TAXONOMY_LABELS = {
  subgenres: {
    supernatural_horror: 'Сверхъестественный хоррор',
    haunted_house: 'Дом с привидениями',
    mystery_horror: 'Мистери-хоррор',
    conspiracy_horror: 'Конспирологический хоррор',
    creature_feature: 'Монстр-муви',
    possession: 'Одержимость',
    survival_horror: 'Хоррор-выживание',
    religious_horror: 'Религиозный хоррор',
    folk_horror: 'Фолк-хоррор',
    psychological_horror: 'Психологический хоррор',
    slasher: 'Слэшер',
    animal_attack: 'Нападение животных',
    infection_outbreak: 'Хоррор-вспышка',
    body_horror: 'Боди-хоррор',
    cannibal_horror: 'Каннибальский хоррор',
    horror_comedy: 'Хоррор-комедия',
    zombie: 'Зомби-хоррор',
    disaster_horror: 'Хоррор-катастрофа'
  },

  formats: {
    found_footage: 'Найденная плёнка',
    mockumentary: 'Псевдодокументальный',
    hybrid_narrative: 'Гибридное повествование',
    anthology: 'Антология',
    silent_film: 'Немой фильм'
  },

  triggers: {
    gore: 'Расчленение',
    breathing_distress: 'Удушье',
    mental_instability: 'Психическая нестабильность',
    child_harm: 'Причинение вреда ребёнку',
    reality_distortion: 'Искажение реальности',
    animal_death: 'Смерть животного',
    suicide: 'Суицид',
    sexual_violence: 'Сексуализированное насилие',
    domestic_violence: 'Домашнее насилие',
    pregnancy: 'Беременность',
    animal_abuse: 'Жестокость к животным',
    claustrophobia: 'Клаустрофобия',
    animal_phobia: 'Страх животных',
    body_invasion: 'Проникновение в тело'
  }
};

function resolveMovieSubgenres(movie) {
  const perceived = Array.isArray(movie?.tags_perceived) ? movie.tags_perceived.filter(Boolean) : [];
  const subgenres = perceived.filter(tag => TAXONOMY_SUBGENRES.includes(tag));

  return {
    primary_subgenre: subgenres[0] || null,
    secondary_subgenres: subgenres.slice(1)
  };
}

const TAXONOMY_LAYER_CONFIG = {
  perceived: {
    label: 'Perceived',
    fields: ['tags_perceived', 'perceived'],
    allowed: () => TAXONOMY_SUBGENRES
  },
  canon: {
    label: 'Canon',
    fields: ['tags_canon', 'canon'],
    allowed: () => Object.keys(CANON_TAG_META)
  },
  formats: {
    label: 'Formats',
    fields: ['formats', 'tags_formats'],
    allowed: () => TAXONOMY_FORMATS
  },
  modifiers: {
    label: 'Modifiers',
    fields: ['modifiers', 'tags_modifiers'],
    allowed: () => Object.keys(MODIFIER_WEIGHTS)
  },
  broadFamilies: {
    label: 'Broad families',
    fields: ['broad_families', 'broadFamilies', 'tags_broad_families'],
    allowed: () => Object.keys(BROAD_FAMILY_WEIGHTS)
  },
  triggers: {
    label: 'Triggers',
    fields: ['triggers', 'tags_triggers'],
    allowed: () => Object.keys(TAXONOMY_LABELS.triggers)
  }
};

const TAXONOMY_REQUIRED_CANON_GROUPS = {
  slasher: [
    {
      label: 'тип убийцы',
      tags: ['masked_killer', 'serial_killer', 'supernatural_killer', 'killer_duo', 'killer_santa', 'revenant_killer', 'trauma_driven_killer', 'protagonist_killer', 'killer_creature']
    }
  ],
  creature_feature: [
    {
      label: 'тип существа',
      tags: ['predatory_creature', 'giant_creature', 'mutant_creature', 'mythic_creature', 'scientific_creature', 'alien_creature', 'killer_creature', 'shark_attack', 'snake_attack']
    }
  ],
  animal_attack: [
    {
      label: 'тип животной угрозы',
      tags: ['shark_attack', 'snake_attack', 'predatory_creature', 'giant_creature', 'rabies_infection']
    }
  ],
  possession: [
    {
      label: 'тип одержимости',
      tags: ['demonic_possession', 'ghost_possession', 'entity_possession']
    }
  ],
  infection_outbreak: [
    {
      label: 'механика заражения',
      tags: ['zombie', 'fungal_infection', 'chemical_outbreak', 'rabies_infection', 'spreading_contamination', 'infected_society']
    }
  ],
  body_horror: [
    {
      label: 'телесная механика',
      tags: ['body_transformation', 'body_transfer', 'identity_erasure']
    }
  ],
  folk_horror: [
    {
      label: 'фольклорная или ритуальная основа',
      tags: ['folklore_entity', 'mythic_creature', 'witchcraft', 'occult_ritual', 'black_magic', 'cult_community']
    }
  ],
  religious_horror: [
    {
      label: 'религиозная или культовая механика',
      tags: ['religious_fundamentalism', 'demonic_entity', 'demonic_possession', 'occult_ritual', 'cult_community', 'wish_with_a_price', 'ritualized_punishment']
    }
  ]
};

function getTaxonomyMovieValues(movie, fieldNames = []) {
  for (const fieldName of fieldNames) {
    if (Array.isArray(movie?.[fieldName])) {
      return movie[fieldName].map(tag => String(tag || '').trim()).filter(Boolean);
    }
  }

  return [];
}

function getTaxonomyLayerSets() {
  return Object.fromEntries(
    Object.entries(TAXONOMY_LAYER_CONFIG).map(([layerName, config]) => [
      layerName,
      new Set(config.allowed())
    ])
  );
}

function findTaxonomyTagLayer(tag, currentLayerName, layerSets) {
  for (const [layerName, allowedTags] of Object.entries(layerSets)) {
    if (layerName !== currentLayerName && allowedTags.has(tag)) {
      return TAXONOMY_LAYER_CONFIG[layerName].label;
    }
  }

  return null;
}

function createTaxonomyWarning(code, message, details = {}) {
  return {
    code,
    message,
    ...details
  };
}

function addTaxonomyWarning(warnings, warning, seenWarnings) {
  const key = `${warning.code}:${warning.layer || ''}:${warning.tag || ''}:${warning.subgenre || ''}:${warning.group || ''}`;

  if (seenWarnings.has(key)) {
    return;
  }

  seenWarnings.add(key);
  warnings.push(warning);
}

function validateMovieTags(movie = {}) {
  const warnings = [];
  const seenWarnings = new Set();
  const layerSets = getTaxonomyLayerSets();
  const taxonomyValues = {};

  for (const [layerName, config] of Object.entries(TAXONOMY_LAYER_CONFIG)) {
    const values = getTaxonomyMovieValues(movie, config.fields);
    taxonomyValues[layerName] = values;

    for (const tag of values) {
      if (layerSets[layerName].has(tag)) {
        continue;
      }

      const correctLayerLabel = findTaxonomyTagLayer(tag, layerName, layerSets);

      addTaxonomyWarning(
        warnings,
        createTaxonomyWarning(
          correctLayerLabel ? 'wrong_layer' : 'unknown_tag',
          correctLayerLabel
            ? `${config.label}: тег "${tag}" относится к слою ${correctLayerLabel}.`
            : `${config.label}: неизвестный тег "${tag}".`,
          {
            layer: layerName,
            tag,
            correctLayer: correctLayerLabel
          }
        ),
        seenWarnings
      );
    }
  }

  const canonSet = new Set(taxonomyValues.canon || []);

  for (const subgenre of taxonomyValues.perceived || []) {
    const requiredGroups = TAXONOMY_REQUIRED_CANON_GROUPS[subgenre];

    if (!requiredGroups) {
      continue;
    }

    for (const group of requiredGroups) {
      const hasRequiredTag = group.tags.some(tag => canonSet.has(tag));

      if (hasRequiredTag) {
        continue;
      }

      addTaxonomyWarning(
        warnings,
        createTaxonomyWarning(
          'missing_canon_anchor',
          `Perceived "${subgenre}": не хватает canon-якоря для группы "${group.label}".`,
          {
            layer: 'canon',
            subgenre,
            group: group.label,
            expectedTags: group.tags
          }
        ),
        seenWarnings
      );
    }
  }

  return {
    warnings
  };
}

function validateTaxonomyMovies(movies = []) {
  return (movies || [])
    .map(movie => ({
      id: movie?.id,
      title: movie?.title || movie?.original_title || movie?.slug || 'Без названия',
      warnings: validateMovieTags(movie).warnings
    }))
    .filter(item => item.warnings.length > 0);
}

const CANON_COVERAGE_AUDIT_RULES = [
  {
    code: 'occult_ritual_refinement',
    label: 'Уточнить occult_ritual',
    whenAny: ['occult_ritual'],
    suggestAny: [
      'sacrificial_killings',
      'cult_community',
      'black_magic',
      'witchcraft',
      'wish_with_a_price',
      'ritualized_punishment',
      'life_extension',
      'occult_trade'
    ],
    reason: 'Есть occult_ritual, но нет уточнения: жертвоприношение, культ, магия, цена, наказание или сделка.'
  },
  {
    code: 'family_unit_refinement',
    label: 'Уточнить family_unit',
    whenAny: ['family_unit'],
    suggestAny: [
      'parent_child_pair',
      'sibling_pair',
      'toxic_parent',
      'dysfunctional_family',
      'intergenerational_trauma',
      'romantic_pair',
      'disabled_child',
      'sick_child',
      'sick_sibling',
      'missing_parent'
    ],
    reason: 'Есть family_unit, но не указана конкретная семейная конфигурация или травматическая связь.'
  },
  {
    code: 'grief_trauma_refinement',
    label: 'Уточнить grief_trauma',
    whenAny: ['grief_trauma'],
    suggestAny: [
      'guilt_manifestation',
      'trauma_return',
      'buried_past',
      'missing_person_investigation',
      'childhood_trauma',
      'intergenerational_trauma'
    ],
    reason: 'Есть grief_trauma, но не указано, как именно травма работает в механике фильма.'
  },
  {
    code: 'masked_killer_refinement',
    label: 'Уточнить masked_killer',
    whenAny: ['masked_killer'],
    suggestAny: [
      'serial_killer',
      'trauma_driven_killer',
      'supernatural_killer',
      'revenant_killer',
      'protagonist_killer',
      'enemy_pursuit',
      'human_hunt',
      'home_under_siege',
      'one_night_survival'
    ],
    reason: 'Есть masked_killer, но не уточнён тип убийцы, структура преследования или модель выживания.'
  },
  {
    code: 'predatory_creature_refinement',
    label: 'Уточнить predatory_creature',
    whenAny: ['predatory_creature'],
    suggestAny: [
      'shark_attack',
      'snake_attack',
      'giant_creature',
      'mutant_creature',
      'mythic_creature',
      'scientific_creature',
      'alien_creature',
      'killer_creature',
      'creature_conflict',
      'rabies_infection'
    ],
    reason: 'Есть predatory_creature, но не указан более конкретный тип угрозы или природа существа.'
  },
  {
    code: 'investigation_media_refinement',
    label: 'Уточнить расследовательскую рамку',
    whenAny: ['media_based_investigation', 'paranormal_media'],
    suggestAny: [
      'audio_contact',
      'buried_past',
      'missing_person_investigation',
      'urban_legend_rabbit_hole',
      'internet_folklore',
      'small_town_secret',
      'occult_book'
    ],
    reason: 'Есть медиа- или расследовательская рамка, но не уточнён источник расследования или скрытая правда.'
  },
  {
    code: 'trapped_survival_refinement',
    label: 'Уточнить trapped_survival',
    whenAny: ['trapped_survival'],
    suggestAny: [
      'home_confinement',
      'home_under_siege',
      'kidnapping',
      'sadistic_captor',
      'group_survival',
      'one_night_survival',
      'enemy_pursuit',
      'rescue_mission',
      'snow_isolation',
      'deserted_island'
    ],
    reason: 'Есть trapped_survival, но не указано, чем именно удерживаются персонажи или какая структура выживания работает.'
  },
  {
    code: 'distorted_reality_refinement',
    label: 'Уточнить distorted_reality',
    whenAny: ['distorted_reality'],
    suggestAny: [
      'time_loop',
      'spatial_loop',
      'alternate_dimension',
      'hallucinated_presence',
      'fractured_memory',
      'virtual_reality_simulation',
      'dream_stalker',
      'guilt_manifestation'
    ],
    reason: 'Есть distorted_reality, но не уточнён механизм искажения реальности.'
  },
  {
    code: 'possession_refinement',
    label: 'Уточнить possession',
    whenPerceivedAny: ['possession'],
    suggestAny: [
      'demonic_possession',
      'ghost_possession',
      'entity_possession'
    ],
    reason: 'Фильм воспринимается как possession, но не указан тип одержимости.'
  },
  {
    code: 'survival_horror_structure',
    label: 'Уточнить survival_horror',
    whenPerceivedAny: ['survival_horror'],
    suggestAny: [
      'trapped_survival',
      'group_survival',
      'one_night_survival',
      'home_under_siege',
      'enemy_pursuit',
      'human_hunt',
      'rescue_mission',
      'post_apocalyptic_survival',
      'war_survival'
    ],
    reason: 'Фильм воспринимается как survival_horror, но не указана конкретная структура выживания.'
  }
];

function getCanonCoverageAuditMovieInfo(movie) {
  return {
    id: movie?.id,
    slug: movie?.slug || '',
    title: movie?.title || movie?.original_title || movie?.slug || 'Без названия',
    year: movie?.year ?? null
  };
}

function getCanonCoverageValues(movie, fieldNames = []) {
  for (const fieldName of fieldNames) {
    if (Array.isArray(movie?.[fieldName])) {
      return movie[fieldName].map(value => String(value || '').trim()).filter(Boolean);
    }
  }

  return [];
}

function hasAnyCanonCoverageValue(values = [], expectedValues = []) {
  const valueSet = new Set(values || []);
  return (expectedValues || []).some(value => valueSet.has(value));
}

const CANON_COVERAGE_PRIORITY_LABELS = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий'
};

const CANON_COVERAGE_PRIORITY_ORDER = {
  high: 0,
  medium: 1,
  low: 2
};

function getCanonCoverageMissingTags(canonSet, tags = [], limit = 4) {
  const missingTags = (tags || []).filter(tag => !canonSet.has(tag));
  return typeof limit === 'number' ? missingTags.slice(0, limit) : missingTags;
}

function getCanonCoverageRuleTriggers(rule, canonSet, perceivedSet) {
  return [
    ...(rule.whenAny || []).filter(tag => canonSet.has(tag)),
    ...(rule.whenPerceivedAny || []).filter(tag => perceivedSet.has(tag))
  ];
}

function getCanonCoverageRuleCandidate(rule, canonSet, perceivedSet) {
  const canon = Array.from(canonSet);
  const perceived = Array.from(perceivedSet);
  const hasCanonTrigger = hasAnyCanonCoverageValue(canon, rule.whenAny);
  const hasPerceivedTrigger = hasAnyCanonCoverageValue(perceived, rule.whenPerceivedAny);

  if (!hasCanonTrigger && !hasPerceivedTrigger) {
    return null;
  }

  const alreadyHasRefinement = hasAnyCanonCoverageValue(canon, rule.suggestAny);

  if (alreadyHasRefinement) {
    return null;
  }

  switch (rule.code) {
    case 'possession_refinement': {
      const suggestedTags = getCanonCoverageMissingTags(
        canonSet,
        ['demonic_possession', 'ghost_possession', 'entity_possession'],
        3
      );

      return {
        priority: 'high',
        reason: 'Perceived указывает на possession, но canon не уточняет тип одержимости.',
        suggestedTags
      };
    }

    case 'masked_killer_refinement': {
      const hasKillerTypeOrThreatStructure = hasAnyCanonCoverageValue(canon, [
        'serial_killer',
        'trauma_driven_killer',
        'supernatural_killer',
        'revenant_killer',
        'protagonist_killer',
        'killer_duo',
        'killer_santa',
        'scuba_killer',
        'kidnapping',
        'sadistic_captor',
        'home_confinement',
        'trapped_survival',
        'enemy_pursuit',
        'human_hunt',
        'one_night_survival'
      ]);

      if (hasKillerTypeOrThreatStructure) {
        return null;
      }

      const suggestedTags = getCanonCoverageMissingTags(
        canonSet,
        perceivedSet.has('survival_horror')
          ? ['serial_killer', 'enemy_pursuit', 'one_night_survival']
          : ['serial_killer', 'trauma_driven_killer', 'supernatural_killer'],
        3
      );

      return {
        priority: 'high',
        reason: 'Есть masked_killer, но не указан тип убийцы, структура преследования или captivity/survival-механика.',
        suggestedTags
      };
    }

    case 'predatory_creature_refinement': {
      const hasCreatureType = hasAnyCanonCoverageValue(canon, [
        'shark_attack',
        'snake_attack',
        'giant_creature',
        'mutant_creature',
        'mythic_creature',
        'scientific_creature',
        'alien_creature',
        'killer_creature',
        'creature_conflict',
        'rabies_infection'
      ]);

      if (hasCreatureType) {
        return null;
      }

      const hasCreatureEnvironment = hasAnyCanonCoverageValue(canon, [
        'aquatic_space',
        'forest_space',
        'snow_isolation',
        'ski_resort',
        'deserted_island',
        'mountain_wilderness'
      ]);
      const hasCreatureSurvivalStructure = hasAnyCanonCoverageValue(canon, [
        'group_survival',
        'trapped_survival',
        'rescue_mission',
        'enemy_pursuit'
      ]);

      if (hasCreatureEnvironment && hasCreatureSurvivalStructure) {
        return null;
      }

      if (canonSet.has('aquatic_space')) {
        return null;
      }

      const suggestedTags = getCanonCoverageMissingTags(
        canonSet,
        ['giant_creature', 'mutant_creature', 'scientific_creature', 'killer_creature'],
        4
      );

      return {
        priority: 'medium',
        reason: 'Есть predatory_creature без более конкретного типа существа; проверить только если природа монстра явно известна и не компенсируется средой/структурой выживания.',
        suggestedTags
      };
    }

    case 'occult_ritual_refinement': {
      const suggestedTags = [];

      if (canonSet.has('terminal_illness')) {
        suggestedTags.push('wish_with_a_price', 'life_extension');
      }

      if (canonSet.has('sacrificial_killings')) {
        suggestedTags.push('cult_community', 'ritualized_punishment');
      }

      if (canonSet.has('religious_fundamentalism')) {
        suggestedTags.push('ritualized_punishment', 'cult_community');
      }

      const missingTags = getCanonCoverageMissingTags(canonSet, suggestedTags, 3);

      if (missingTags.length === 0) {
        return null;
      }

      return {
        priority: 'medium',
        reason: 'Есть occult_ritual и дополнительный контекст, который может требовать точного уточнения механики.',
        suggestedTags: missingTags
      };
    }

    case 'family_unit_refinement': {
      const suggestedTags = [];

      if (canonSet.has('grief_trauma')) {
        suggestedTags.push('parent_child_pair', 'intergenerational_trauma', 'toxic_parent');
      }

      if (canonSet.has('demonic_possession') || canonSet.has('entity_possession')) {
        suggestedTags.push('parent_child_pair', 'toxic_parent');
      }

      const missingTags = getCanonCoverageMissingTags(canonSet, suggestedTags, 3);

      if (missingTags.length === 0) {
        return null;
      }

      return {
        priority: 'low',
        reason: 'Есть family_unit с травматическим или сверхъестественным контекстом; возможно, семейную связь стоит уточнить.',
        suggestedTags: missingTags
      };
    }

    case 'grief_trauma_refinement': {
      const suggestedTags = [];

      if (canonSet.has('distorted_reality') || canonSet.has('hallucinated_presence')) {
        suggestedTags.push('guilt_manifestation', 'fractured_memory');
      }

      if (canonSet.has('buried_past') || canonSet.has('media_based_investigation')) {
        suggestedTags.push('missing_person_investigation', 'childhood_trauma');
      }

      if (canonSet.has('family_unit')) {
        suggestedTags.push('intergenerational_trauma', 'parent_child_pair');
      }

      const missingTags = getCanonCoverageMissingTags(canonSet, suggestedTags, 3);

      if (missingTags.length === 0) {
        return null;
      }

      return {
        priority: 'low',
        reason: 'Есть grief_trauma с дополнительным механизмом; возможно, травму стоит уточнить.',
        suggestedTags: missingTags
      };
    }

    case 'investigation_media_refinement': {
      const suggestedTags = [];
      const hasRichInvestigationFrame = hasAnyCanonCoverageValue(canon, [
        'missing_person_investigation',
        'buried_past',
        'urban_legend_rabbit_hole',
        'internet_folklore',
        'small_town_secret',
        'occult_book',
        'isolated_village',
        'ghost_possession',
        'entity_possession'
      ]);

      if (canonSet.has('media_based_investigation') && canonSet.has('buried_past')) {
        suggestedTags.push('missing_person_investigation', 'occult_book', 'urban_legend_rabbit_hole');
      }

      if (canonSet.has('paranormal_media') && !hasRichInvestigationFrame) {
        suggestedTags.push('audio_contact');
      }

      const missingTags = getCanonCoverageMissingTags(canonSet, suggestedTags, 3);

      if (missingTags.length === 0) {
        return null;
      }

      return {
        priority: 'medium',
        reason: 'Есть медиа- или расследовательская рамка с дополнительным контекстом; возможно, нужно уточнить источник расследования.',
        suggestedTags: missingTags
      };
    }

    case 'trapped_survival_refinement': {
      const suggestedTags = [];

      if (canonSet.has('house_space') || canonSet.has('isolated_house')) {
        suggestedTags.push('home_confinement', 'home_under_siege');
      }

      if (canonSet.has('forest_space')) {
        suggestedTags.push('group_survival', 'enemy_pursuit', 'rescue_mission');
      }

      if (canonSet.has('snow_isolation')) {
        suggestedTags.push('group_survival', 'rescue_mission');
      }

      const missingTags = getCanonCoverageMissingTags(canonSet, suggestedTags, 3);

      if (missingTags.length === 0) {
        return null;
      }

      return {
        priority: 'medium',
        reason: 'Есть trapped_survival и конкретная среда; возможно, структуру удержания/выживания стоит уточнить.',
        suggestedTags: missingTags
      };
    }

    case 'distorted_reality_refinement': {
      const suggestedTags = [];

      if (canonSet.has('countdown_structure')) {
        suggestedTags.push('time_loop');
      }

      if (canonSet.has('grief_trauma')) {
        suggestedTags.push('guilt_manifestation', 'fractured_memory');
      }

      const missingTags = getCanonCoverageMissingTags(canonSet, suggestedTags, 3);

      if (missingTags.length === 0) {
        return null;
      }

      return {
        priority: 'low',
        reason: 'Есть distorted_reality с дополнительным контекстом; возможно, механизм искажения стоит уточнить.',
        suggestedTags: missingTags
      };
    }

    case 'survival_horror_structure': {
      const hasSurvivalStructure = hasAnyCanonCoverageValue(canon, [
        'trapped_survival',
        'group_survival',
        'one_night_survival',
        'home_under_siege',
        'enemy_pursuit',
        'human_hunt',
        'rescue_mission',
        'post_apocalyptic_survival',
        'war_survival'
      ]);

      if (hasSurvivalStructure) {
        return null;
      }

      const suggestedTags = [];

      if (hasAnyCanonCoverageValue(canon, ['zombie', 'fungal_infection', 'chemical_outbreak', 'infected_society'])) {
        suggestedTags.push('group_survival', 'post_apocalyptic_survival');
      }

      if (hasAnyCanonCoverageValue(canon, ['predatory_creature', 'shark_attack', 'snake_attack', 'giant_creature'])) {
        suggestedTags.push('trapped_survival', 'group_survival', 'enemy_pursuit');
      }

      if (canonSet.has('isolated_protagonist')) {
        suggestedTags.push('trapped_survival');
      }

      const missingTags = getCanonCoverageMissingTags(canonSet, suggestedTags, 3);

      if (missingTags.length === 0) {
        return null;
      }

      return {
        priority: 'low',
        reason: 'Фильм воспринимается как survival_horror; есть контекст, который может указывать на конкретную структуру выживания.',
        suggestedTags: missingTags
      };
    }

    default:
      return null;
  }
}

function getCanonCoverageAuditItemsForMovie(movie = {}) {
  const canon = getCanonCoverageValues(movie, ['canon', 'tags_canon']);
  const perceived = getCanonCoverageValues(movie, ['tags_perceived', 'perceived']);
  const canonSet = new Set(canon);
  const perceivedSet = new Set(perceived);
  const items = [];

  CANON_COVERAGE_AUDIT_RULES.forEach(rule => {
    const candidate = getCanonCoverageRuleCandidate(rule, canonSet, perceivedSet);

    if (!candidate || candidate.suggestedTags.length === 0) {
      return;
    }

    items.push({
      code: rule.code,
      label: rule.label,
      priority: candidate.priority,
      priorityLabel: CANON_COVERAGE_PRIORITY_LABELS[candidate.priority] || candidate.priority,
      reason: candidate.reason,
      triggerTags: getCanonCoverageRuleTriggers(rule, canonSet, perceivedSet),
      suggestedTags: candidate.suggestedTags
    });
  });

  return items.sort((a, b) => {
    const priorityDiff =
      (CANON_COVERAGE_PRIORITY_ORDER[a.priority] ?? 99) -
      (CANON_COVERAGE_PRIORITY_ORDER[b.priority] ?? 99);

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return a.label.localeCompare(b.label);
  });
}

function getCanonCoverageAuditReport(movies = []) {
  const items = (movies || [])
    .map(movie => ({
      movie: getCanonCoverageAuditMovieInfo(movie),
      candidates: getCanonCoverageAuditItemsForMovie(movie)
    }))
    .filter(item => item.candidates.length > 0);

  const tagFrequency = {};
  const priorityCounts = {
    high: 0,
    medium: 0,
    low: 0
  };

  items.forEach(item => {
    item.candidates.forEach(candidate => {
      priorityCounts[candidate.priority] = (priorityCounts[candidate.priority] || 0) + 1;

      candidate.suggestedTags.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
    });
  });

  return {
    totalMovies: (movies || []).length,
    moviesWithCandidates: items.length,
    candidatesCount: items.reduce((sum, item) => sum + item.candidates.length, 0),
    priorityCounts,
    items,
    suggestedTagsFrequency: Object.entries(tagFrequency)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
  };
}

window.HORROR_TAXONOMY = {
  subgenres: TAXONOMY_SUBGENRES,
  formats: TAXONOMY_FORMATS,
  triggers: [
    'gore',
    'breathing_distress',
    'mental_instability',
    'child_harm',
    'reality_distortion',
    'animal_death',
    'suicide',
    'sexual_violence',
    'domestic_violence',
    'pregnancy',
    'animal_abuse',
    'claustrophobia',
    'animal_phobia',
    'body_invasion'
  ],
  labels: TAXONOMY_LABELS,
  helpers: {
    resolveMovieSubgenres,
    deriveBroadFamiliesFromCanon,
    resolveMovieBroadFamilies,
    resolveMovieSimilarityLanes,
    getCanonTagMeta,
    getCanonTagsSimilarityLanes,
    validateMovieTags,
    validateTaxonomyMovies,
    getCanonCoverageAuditReport,
    getSimilarMovies,
    getSimilarityAuditReport,
    getSimilarMovieCards
  }
};