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

const HORROR_TAXONOMY_SCRIPT_URL =
  typeof document !== 'undefined' && document.currentScript?.src
    ? document.currentScript.src
    : '';

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

function extractObjectLiteralBodyFromSource(source, startToken) {
  const startIndex = source.indexOf(startToken);

  if (startIndex === -1) {
    return '';
  }

  const openIndex = source.indexOf('{', startIndex);

  if (openIndex === -1) {
    return '';
  }

  let depth = 0;
  let quote = null;
  let isEscaped = false;

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (isEscaped) {
        isEscaped = false;
        continue;
      }

      if (char === '\\') {
        isEscaped = true;
        continue;
      }

      if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }

    if (char === '{') {
      depth += 1;
      continue;
    }

    if (char === '}') {
      depth -= 1;

      if (depth === 0) {
        return source.slice(openIndex + 1, index);
      }
    }
  }

  return '';
}

function getDuplicateCanonTagMetaKeysFromSource(source) {
  const objectBody = extractObjectLiteralBodyFromSource(source, 'const CANON_TAG_META =');

  if (!objectBody) {
    return [];
  }

  const keyMatches = Array.from(objectBody.matchAll(/^\s{2}([A-Za-z_$][\w$]*)\s*:/gm));
  const firstSeenIndexByKey = new Map();
  const duplicates = [];

  keyMatches.forEach((match, index) => {
    const key = match[1];

    if (firstSeenIndexByKey.has(key)) {
      duplicates.push({
        key,
        firstIndex: firstSeenIndexByKey.get(key),
        duplicateIndex: index
      });
      return;
    }

    firstSeenIndexByKey.set(key, index);
  });

  return duplicates;
}

async function auditCanonTagMetaRegistrySource() {
  if (!HORROR_TAXONOMY_SCRIPT_URL || typeof fetch !== 'function') {
    return {
      ok: true,
      skipped: true,
      reason: 'Не удалось определить URL horror-taxonomy.js для статической проверки.'
    };
  }

  try {
    const response = await fetch(HORROR_TAXONOMY_SCRIPT_URL, {
      cache: 'no-store'
    });
    const source = await response.text();
    const duplicateKeys = getDuplicateCanonTagMetaKeysFromSource(source);
    const report = {
      ok: duplicateKeys.length === 0,
      duplicateKeys
    };

    if (duplicateKeys.length > 0) {
      console.error('CANON_TAG_META: найдены дубли ключей.', duplicateKeys);
    }

    return report;
  } catch (error) {
    console.warn('CANON_TAG_META: не удалось выполнить статическую проверку дублей.', error);

    return {
      ok: false,
      skipped: true,
      error
    };
  }
}

const CANON_TAG_META = {
  abandoned_settlement: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type', 'survival_structure'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Заброшенный город, посёлок, деревня или поселение работает как изолированное пространство угрозы, тайны, выживания или следов прошлого.',
    avoidWhen: 'Локация просто выглядит заброшенной, но не влияет на механику угрозы или расследования.',
    examples: [],
    counterExamples: []
  }),
  abuse_trauma: { tier: "standard", confidence: "stable" },
  ai_generated: { tier: "standard", confidence: "observe" },
  alien_creature: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_origin', 'threat_behavior'],
    lanes: ['creature_lane'],
    useWhen: 'Центральная угроза — инопланетное существо, организм или нечеловеческая форма жизни, действующая как creature-угроза.',
    avoidWhen: 'Инопланетный слой есть только как сеттинг, технология или фон без существа как активной угрозы.',
    examples: ['Монстр'],
    counterExamples: []
  }),
  alien_threat: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_origin', 'threat_behavior'],
    lanes: ['creature_lane', 'survival_containment_lane'],
    useWhen: 'Инопланетная сила, организм, вторжение или нечеловеческая угроза является центральным источником опасности.',
    avoidWhen: 'Есть отдельное alien_creature, но нет более широкой инопланетной угрозы/вторжения/системы.',
    examples: [],
    counterExamples: []
  }),
  alternate_dimension: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['reality_structure', 'space_mechanism'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Фильм использует иное измерение, параллельное пространство, скрытую реальность или переход между слоями мира как рабочую механику угрозы.',
    avoidWhen: 'Есть просто странное место или визуальная условность без подтверждённой альтернативной реальности.',
    examples: ['Монстр', 'Возвращение гремлинов'],
    counterExamples: []
  }),
  amusement_park: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type', 'narrative_function'],
    lanes: [],
    useWhen: 'Парк развлечений, аттракцион, ярмарочная зона или funhouse-пространство является значимой площадкой угрозы, ловушки, убийств или хоррор-переосмысления развлечения.',
    avoidWhen: 'Аттракцион или парк мелькает как фон и не формирует horror-механику.',
    examples: ['Пункт назначения: Новый аттракцион'],
    counterExamples: []
  }),
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
  apartment_space: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type'],
    lanes: [],
    useWhen: 'Квартира или жилой многоквартирный интерьер является значимым пространством угрозы, изоляции, вторжения или бытового ужаса.',
    avoidWhen: 'Квартира просто кратко показана и не влияет на механику ужаса.',
    examples: ['Нечто из унитаза'],
    counterExamples: []
  }),
  aquatic_space: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type'],
    lanes: [],
    useWhen: 'Водная среда, море, озеро, бассейн, подводное пространство или береговая зона существенно формируют угрозу.',
    avoidWhen: 'Вода присутствует как фон, но не влияет на угрозу, изоляцию или survival-механику.',
    examples: ['Кит-убийца', 'Отмель'],
    counterExamples: []
  }),
  assimilation_pressure: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['social_contagion', 'psychological_wound', 'human_dynamics'],
    lanes: ['body_identity_lane'],
    useWhen: 'Персонаж вынужден подстраиваться, менять тело, идентичность, статус или поведение под давление группы, культуры, семьи или социальной нормы.',
    avoidWhen: 'Есть обычное социальное давление, но оно не запускает механику ужаса, трансформации или утраты себя.',
    examples: ['Отклонение'],
    counterExamples: []
  }),
  audio_contact: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['investigation_frame', 'threat_origin'],
    lanes: ['investigation_media_lane', 'supernatural_entity_lane'],
    useWhen: 'Контакт с угрозой, призраком, сущностью или прошлым происходит через звук, голос, запись, радио, звонок, плёнку или аудиосообщение.',
    avoidWhen: 'Звук используется только как атмосфера, скример или обычная улика без отдельной механики контакта.',
    examples: [],
    counterExamples: []
  }),
  barn_space: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type'],
    lanes: [],
    useWhen: 'Сарай, амбар, фермерская постройка или хозяйственное пространство является значимым местом угрозы, тайны или удержания.',
    avoidWhen: 'Сарай мелькает как декорация и не влияет на механику ужаса.',
    examples: ['Кровавый сарай'],
    counterExamples: []
  }),
  bayou_setting: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type'],
    lanes: [],
    useWhen: 'Байу, болото, заболоченная южная местность или влажная изолированная среда формирует угрозу, фольклорный слой, преследование или невозможность быстро выбраться.',
    avoidWhen: 'Болотистая местность есть только как визуальный фон.',
    examples: [],
    counterExamples: []
  }),
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
  body_transfer: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['reality_structure', 'threat_behavior'],
    lanes: ['psychological_reality_lane', 'body_identity_lane'],
    useWhen: 'Сознание, личность, душа или контроль персонажа переносится в другое тело, носитель или форму существования.',
    avoidWhen: 'Есть обычная одержимость сущностью — тогда использовать demonic_possession, ghost_possession или entity_possession.',
    examples: [],
    counterExamples: []
  }),
  body_transformation: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['threat_behavior', 'reality_structure', 'psychological_wound'],
    lanes: ['body_identity_lane', 'psychological_reality_lane'],
    useWhen: 'Тело персонажа физически меняется, мутирует, деформируется, распадается или становится носителем ужаса.',
    avoidWhen: 'Есть раны, gore или обычное насилие, но нет устойчивой механики телесной трансформации.',
    examples: ['Мать мух', 'Отклонение'],
    counterExamples: []
  }),
  boarding_school: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type', 'human_dynamics'],
    lanes: [],
    useWhen: 'Школа-интернат, закрытое учебное учреждение или кампус с проживанием формирует изоляцию, дисциплинарное давление, тайну или систему насилия.',
    avoidWhen: 'Учебное заведение просто место действия без закрытой структуры, давления или угрозы.',
    examples: [],
    counterExamples: []
  }),
  buried_past: createCanonTagMeta({
    tier: "broad",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.investigation_frame,
    families: ['narrative_function', 'investigation_frame', 'psychological_wound'],
    lanes: ['investigation_media_lane', 'psychological_reality_lane'],
    useWhen: 'Скрытое прошлое, старая вина, преступление, семейная тайна или замолчанный факт постепенно раскрываются и объясняют текущую угрозу.',
    avoidWhen: 'Прошлое просто упоминается в биографии, но не является двигателем расследования или механики ужаса.',
    examples: ['Добыча для невесты', 'Шелби Оукс. Город-призрак'],
    counterExamples: []
  }),
  bully_retribution: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['psychological_wound', 'threat_behavior', 'human_dynamics'],
    lanes: ['psychological_reality_lane', 'slasher_lane'],
    useWhen: 'Буллинг, унижение или травля возвращаются как месть, убийства, сверхъестественная расплата или травматическая причина угрозы.',
    avoidWhen: 'Буллинг упомянут как фон, но не запускает угрозу или структуру мести.',
    examples: [],
    counterExamples: []
  }),
  cannibalism: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_behavior,
    families: ['threat_behavior', 'human_dynamics'],
    lanes: [],
    useWhen: 'Каннибализм является центральной угрозой, практикой, мотивацией убийцы, социальной системой или телесной механикой ужаса.',
    avoidWhen: 'Есть единичное упоминание поедания плоти или gore-эпизод, но каннибализм не является рабочей механикой фильма.',
    examples: ['Протеин', 'Горный король'],
    counterExamples: []
  }),
  chemical_outbreak: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['threat_origin', 'social_contagion'],
    lanes: ['infection_outbreak_lane'],
    useWhen: 'Угроза вызвана химическим заражением, токсином, веществом, выбросом, экспериментальным препаратом или промышленной/лабораторной утечкой.',
    avoidWhen: 'Есть болезнь, зомби или заражение, но химическая причина не подтверждена.',
    examples: ['Ночь живых мертвецов 2.0'],
    counterExamples: []
  }),
  christmas_setting: { tier: "standard", confidence: "stable" },
  childhood_trauma: { tier: "standard", confidence: "stable" },
  countdown_structure: { tier: "anchor", confidence: "stable" },
  creature_conflict: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_behavior,
    families: ['threat_behavior', 'survival_structure'],
    lanes: ['creature_lane', 'survival_containment_lane'],
    useWhen: 'Фильм строится на прямом конфликте, схватке или противостоянии между персонажами и существом, а не только на присутствии монстра.',
    avoidWhen: 'Существо есть, но конфликт не является центральной структурой фильма.',
    examples: ['Ящер'],
    counterExamples: []
  }),
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
  deserted_island: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type', 'survival_structure'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Изолированный остров является рабочей ловушкой, средой выживания или причиной невозможности быстро покинуть опасность.',
    avoidWhen: 'Остров просто место действия, но изоляция не влияет на угрозу или структуру выживания.',
    examples: ['Остров хищника'],
    counterExamples: []
  }),
  disabled_child: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['human_dynamics', 'psychological_wound'],
    lanes: [],
    useWhen: 'Ребёнок с инвалидностью, особенностью развития или зависимостью от ухода является важной частью семейной угрозы, травмы, защиты или морального давления.',
    avoidWhen: 'Состояние ребёнка упомянуто биографически и не влияет на horror-механику, конфликт или уязвимость.',
    examples: [],
    counterExamples: []
  }),
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
  dream_stalker: createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['reality_structure', 'threat_behavior'],
    lanes: ['psychological_reality_lane', 'supernatural_entity_lane'],
    useWhen: 'Угроза атакует, преследует или влияет на персонажей через сон, кошмары или пограничное состояние между сном и реальностью.',
    avoidWhen: 'Сны есть только как атмосфера, видения или символика, но не являются рабочим каналом угрозы.',
    examples: ['Песочный человек'],
    counterExamples: []
  }),
  dysfunctional_family: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['human_dynamics', 'psychological_wound'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Семейная дисфункция, насилие, недоверие, контроль или разрушенная семейная связь прямо формируют конфликт, угрозу или восприятие ужаса.',
    avoidWhen: 'Семья просто неблагополучная на фоне, но её динамика не влияет на механику фильма.',
    examples: [],
    counterExamples: []
  }),
  dysfunctional_relationship: { tier: "standard", confidence: "stable" },
  educational_pressure: { tier: "standard", confidence: "observe" },
  egyptian_theme: { tier: "standard", confidence: "observe" },
  elder_threat: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_behavior', 'human_dynamics'],
    lanes: [],
    useWhen: 'Пожилой персонаж, старик/старуха или группа старших людей являются активной угрозой, источником контроля, насилия, тайны или социальной ловушки.',
    avoidWhen: 'Пожилой персонаж просто присутствует в сюжете и не является horror-угрозой.',
    examples: ['Безумная старуха'],
    counterExamples: []
  }),
  elite_predation: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_behavior,
    families: ['threat_behavior', 'human_dynamics', 'social_contagion'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Богатые, влиятельные или привилегированные люди используют жертв как ресурс, добычу, развлечение, ритуальный материал или средство продления власти/жизни.',
    avoidWhen: 'Антагонисты просто богаты или статусны, но элитная система эксплуатации не является механизмом ужаса.',
    examples: ['Они придут за тобой'],
    counterExamples: []
  }),
  enemy_pursuit: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_behavior,
    families: ['threat_behavior', 'pursuit_structure'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Угроза строится на активном преследовании персонажей врагом, убийцей, группой, существом или враждебной силой.',
    avoidWhen: 'Персонажи просто находятся в опасности, но структура погони/преследования не является центральной.',
    examples: ['Добыча для невесты'],
    counterExamples: []
  }),
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
  feigned_death: createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['narrative_function', 'threat_behavior'],
    lanes: [],
    useWhen: 'Персонаж инсценирует смерть, притворяется мёртвым или использует ложную смерть как способ выживания, обмана, ловушки или раскрытия угрозы.',
    avoidWhen: 'Есть обычная смерть, staged_death или неопознанное тело, но нет подтверждённой имитации смерти живым персонажем.',
    examples: ['Игра со смертью'],
    counterExamples: []
  }),
  flooding_disaster: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['survival_structure', 'setting_type'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Наводнение, затопление или водная катастрофа является центральной физической угрозой и задаёт структуру выживания.',
    avoidWhen: 'Вода или потоп присутствуют эпизодически, но не формируют survival-механику.',
    examples: ['Хищный рывок'],
    counterExamples: []
  }),
  folklore_entity: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_origin', 'myth_reframing'],
    lanes: ['folk_myth_lane', 'supernatural_entity_lane'],
    useWhen: 'Угроза основана на фольклорной сущности, духе, легендарной фигуре, народном поверии или локальном мифе.',
    avoidWhen: 'Есть просто сельский/лесной сеттинг или народная атмосфера без конкретной фольклорной сущности.',
    examples: ['Гауа', 'Миля 666'],
    counterExamples: []
  }),
  forest_space: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type'],
    lanes: [],
    useWhen: 'Лес является значимым пространством угрозы, заблуждения, изоляции, фольклорного контакта или survival-механики.',
    avoidWhen: 'Лес присутствует только как фон или короткая локация без влияния на механику ужаса.',
    examples: ['Гауа', 'Миля 666', 'Одиночка'],
    counterExamples: []
  }),
  fractured_memory: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['psychological_wound', 'reality_structure'],
    lanes: ['psychological_reality_lane', 'investigation_media_lane'],
    useWhen: 'Память персонажа повреждена, скрыта, подменена, фрагментирована или становится ключом к раскрытию угрозы.',
    avoidWhen: 'Персонаж просто вспоминает прошлое, но память не является механизмом ужаса или расследования.',
    examples: ['Под светом'],
    counterExamples: []
  }),
  future_intrusion: { tier: "standard", confidence: "observe" },
  fungal_infection: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['threat_origin', 'social_contagion', 'threat_behavior'],
    lanes: ['infection_outbreak_lane'],
    useWhen: 'Грибок, споры, мицелий или грибковая биология являются источником заражения, мутации, агрессии, зомби-подобного состояния или распада контроля.',
    avoidWhen: 'Есть заражение или паразитическая угроза, но грибковая природа не подтверждена.',
    examples: ['Зараза'],
    counterExamples: []
  }),
  gang_war: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['human_dynamics', 'threat_behavior'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Бандитский конфликт, война группировок или криминальное противостояние создают угрозу, давление, преследование или survival-ситуацию.',
    avoidWhen: 'Криминальный фон есть, но gang-конфликт не влияет на horror-механику.',
    examples: [],
    counterExamples: []
  }),
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
  giant_creature: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_origin', 'threat_behavior'],
    lanes: ['creature_lane'],
    useWhen: 'Размер существа является важной частью угрозы: гигантский монстр, огромная животная форма или масштабная creature-опасность.',
    avoidWhen: 'Существо просто опасное или хищное, но размер не является отдельной механикой угрозы.',
    examples: ['Анаконды', 'Ящер'],
    counterExamples: []
  }),
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
  group_survival: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['survival_structure', 'human_dynamics'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Выживание строится вокруг группы персонажей: их совместных решений, конфликтов, разделения ролей или распада группы под угрозой.',
    avoidWhen: 'В фильме есть несколько персонажей, но групповая динамика не влияет на survival-структуру.',
    examples: ['Монстр', 'Возвращение гремлинов'],
    counterExamples: []
  }),
  guilt_manifestation: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['psychological_wound', 'reality_structure'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Вина персонажа проявляется как угроза, видение, преследование, искажение реальности или сверхъестественная расплата.',
    avoidWhen: 'Персонаж просто чувствует вину, но она не материализуется в механике ужаса.',
    examples: [],
    counterExamples: []
  }),
  hallucinated_presence: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['reality_structure', 'psychological_wound'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Персонаж воспринимает присутствие, фигуру, голос, образ или угрозу, чья реальность намеренно нестабильна или галлюцинаторна.',
    avoidWhen: 'Есть обычный призрак или сущность, объективно существующая в мире фильма.',
    examples: [],
    counterExamples: []
  }),
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
  home_confinement: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['survival_structure', 'setting_type'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Дом, квартира, хижина или другое жилище работает как место удержания: персонаж не может свободно выйти или вынужден выживать внутри.',
    avoidWhen: 'Дом просто место действия без механики удержания или невозможности покинуть пространство.',
    examples: ['Игра со смертью', 'Одиночка'],
    counterExamples: []
  }),
  home_infiltration: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_behavior,
    families: ['threat_behavior', 'space_mechanism'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Угроза проникает в дом/жилище или нарушает границу безопасного пространства изнутри или снаружи.',
    avoidWhen: 'Есть просто домашний сеттинг без вторжения, проникновения или нарушения защитной границы.',
    examples: [],
    counterExamples: []
  }),
  home_under_siege: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['survival_structure', 'threat_behavior', 'setting_type'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Дом или жилище становится осаждённым пространством: персонажи защищаются от внешней угрозы, вторжения или давления.',
    avoidWhen: 'Опасность происходит дома, но нет структуры осады/обороны/давления снаружи.',
    examples: [],
    counterExamples: []
  }),
  house_space: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type'],
    lanes: [],
    useWhen: 'Дом, особняк, хижина или жилое пространство является важной площадкой угрозы, тайны, удержания, вторжения или семейного конфликта.',
    avoidWhen: 'Дом просто место действия без отдельной роли в механике ужаса.',
    examples: ['Игра со смертью', 'Добыча для невесты'],
    counterExamples: []
  }),
  human_hunt: createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_behavior,
    families: ['threat_behavior', 'pursuit_structure', 'human_dynamics'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Людей целенаправленно выслеживают, преследуют или используют как добычу в охоте, игре, ритуале или социальной системе насилия.',
    avoidWhen: 'Есть обычное преследование или убийца, но нет структуры охоты на человека как добычу.',
    examples: [],
    counterExamples: []
  }),
  human_monstrosity: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_behavior,
    families: ['threat_behavior', 'human_dynamics', 'psychological_wound'],
    lanes: [],
    useWhen: 'Человеческая жестокость, деградация, садизм, расчеловечивание или моральная монструозность являются основной угрозой.',
    avoidWhen: 'Персонаж просто неприятный, опасный или антагонистичный, но человеческая монструозность не является отдельной механикой ужаса.',
    examples: ['Куколка', 'Протеин'],
    counterExamples: []
  }),
  icon_reframing: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['myth_reframing', 'narrative_function'],
    lanes: ['folk_myth_lane'],
    useWhen: 'Фильм переосмысляет узнаваемую культурную, сказочную, праздничную, детскую или поп-икону как хоррор-угрозу.',
    avoidWhen: 'Есть просто знакомый образ или отсылка, но нет хоррор-переосмысления как основной механики.',
    examples: [],
    counterExamples: []
  }),
  identity_erasure: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['reality_structure', 'psychological_wound', 'threat_behavior'],
    lanes: ['psychological_reality_lane', 'body_identity_lane'],
    useWhen: 'Личность персонажа стирается, подменяется, растворяется или перестаёт быть надёжной частью его существования.',
    avoidWhen: 'Есть обычная амнезия, маскировка или социальная невидимость без механики стирания личности.',
    examples: [],
    counterExamples: []
  }),
  infected_society: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.structure,
    families: ['social_contagion', 'human_dynamics', 'threat_origin'],
    lanes: ['infection_outbreak_lane'],
    useWhen: 'Заражение, мутация, эпидемия или постинфекционный порядок меняют общество, группы людей, правила выживания или социальную структуру мира.',
    avoidWhen: 'Есть отдельные заражённые или монстры, но общество/сообщество не перестроено вокруг заражения.',
    examples: ['28 лет спустя: Часть II. Храм костей'],
    counterExamples: []
  }),
  infrastructure_horror: { tier: "standard", confidence: "observe" },
  intergenerational_trauma: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['psychological_wound', 'human_dynamics'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Травма, вина, проклятие, насилие или семейная тайна передаются между поколениями и формируют текущую угрозу.',
    avoidWhen: 'Прошлое семьи упомянуто, но межпоколенческая передача травмы или последствий не подтверждена.',
    examples: ['Белдхэм. Проклятие ведьмы'],
    counterExamples: []
  }),
  internet_folklore: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.investigation_frame,
    families: ['investigation_frame', 'myth_reframing', 'social_contagion'],
    lanes: ['investigation_media_lane', 'folk_myth_lane'],
    useWhen: 'Угроза, легенда, расследование или заражающая идея распространяется через интернет, форумы, соцсети, видео, цифровые следы или сетевой фольклор.',
    avoidWhen: 'Интернет просто используется персонажами как бытовой инструмент и не формирует легенду/расследование/угрозу.',
    examples: ['Project MKHEXE'],
    counterExamples: []
  }),
  isolated_house: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type', 'survival_structure'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Изолированный дом, хижина или удалённое жилище ограничивает помощь, побег, контакт с внешним миром или усиливает удержание.',
    avoidWhen: 'Дом находится отдельно, но изоляция не влияет на угрозу или структуру выживания.',
    examples: ['Одиночка', 'Подняться на холм'],
    counterExamples: []
  }),
  isolated_lighthouse: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type', 'survival_structure'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Маяк или удалённая прибрежная точка работает как изолированное пространство угрозы, памяти, призрачного контакта или выживания.',
    avoidWhen: 'Маяк только обозначен как место, но изоляция не влияет на horror-механику.',
    examples: ['Под светом'],
    counterExamples: []
  }),
  isolated_protagonist: { tier: "anchor", confidence: "stable" },
  isolated_village: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type', 'human_dynamics'],
    lanes: [],
    useWhen: 'Изолированная деревня, посёлок или замкнутое локальное сообщество влияет на угрозу, тайну, культовую структуру или невозможность получить помощь.',
    avoidWhen: 'Деревня просто место действия без изоляции, коллективного давления или скрытой системы.',
    examples: ['Долина улыбок', 'Дневник Рисы'],
    counterExamples: []
  }),
  kidnapping: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['survival_structure', 'threat_behavior', 'human_dynamics'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Похищение, удержание или насильственное перемещение персонажа запускает основную угрозу или survival-структуру.',
    avoidWhen: 'Персонажа просто заманили или он оказался в опасности без явной механики похищения/удержания.',
    examples: ['Игра со смертью', 'Куколка'],
    counterExamples: []
  }),
  killer_creature: createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_origin', 'threat_behavior'],
    lanes: ['creature_lane'],
    useWhen: 'Существо работает именно как убийца/нападающая creature-угроза, а не просто как фон, животное или мифологический образ.',
    avoidWhen: 'Достаточно более точного тега: predatory_creature, giant_creature, mythic_creature, alien_creature, shark_attack или snake_attack.',
    examples: [],
    counterExamples: []
  }),
  killer_doll: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_origin', 'threat_behavior'],
    lanes: ['supernatural_entity_lane'],
    useWhen: 'Кукла, манекен, игрушка или искусственная фигура является активной убийственной угрозой.',
    avoidWhen: 'Кукла присутствует как символ, реквизит или психологическая проекция без самостоятельной угрозы.',
    examples: ['Морган: Кукла-убийца'],
    counterExamples: []
  }),
  killer_duo: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_behavior', 'human_dynamics'],
    lanes: ['slasher_lane'],
    useWhen: 'Угроза строится вокруг пары убийц, дуэта преследователей или двух согласованно действующих маньяков.',
    avoidWhen: 'В фильме просто несколько убийц или соучастников, но дуэт не является устойчивой структурой угрозы.',
    examples: ['Пункт назначения: Новый аттракцион'],
    counterExamples: []
  }),
  killer_santa: createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_behavior', 'temporal_mechanism'],
    lanes: ['slasher_lane'],
    useWhen: 'Убийца использует образ Санты, рождественского карателя или праздничной маски как центральную механику угрозы.',
    avoidWhen: 'Есть просто рождественский сеттинг без убийцы-Санты или без работы образа как угрозы.',
    examples: ['Тихая ночь, смертельная ночь'],
    counterExamples: []
  }),
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
  maternal_horror: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['psychological_wound', 'human_dynamics'],
    lanes: ['body_identity_lane', 'psychological_reality_lane'],
    useWhen: 'Материнство, беременность, утрата ребёнка, родительская вина или материнская идентичность являются центральной механикой ужаса.',
    avoidWhen: 'Мать или ребёнок есть в сюжете, но материнская тема не формирует угрозу, травму или телесно-психологическую механику.',
    examples: ['Кожа к коже', 'Рождённый из грязи'],
    counterExamples: []
  }),
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
  mental_breakdown: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['psychological_wound', 'reality_structure'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Психический распад персонажа является рабочей частью угрозы, восприятия, расследования или разрушения реальности.',
    avoidWhen: 'Персонаж просто напуган, подавлен или ведёт себя странно без устойчивой механики распада.',
    examples: ['Одиночка'],
    counterExamples: []
  }),
  mental_illness: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['psychological_wound'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Психическое состояние или диагноз персонажа является важной частью конфликта, восприятия угрозы или социальной изоляции.',
    avoidWhen: 'Психическое состояние используется только как поверхностная характеристика или стигматизирующая деталь без механики.',
    examples: [],
    counterExamples: []
  }),
  mind_control_experiment: { tier: "anchor", confidence: "observe" },
  missing_parent: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['human_dynamics', 'psychological_wound', 'investigation_frame'],
    lanes: ['investigation_media_lane', 'psychological_reality_lane'],
    useWhen: 'Отсутствующий, исчезнувший, умерший или недоступный родитель является важной причиной расследования, травмы, семейного конфликта или сверхъестественной связи.',
    avoidWhen: 'Родитель просто не показан в фильме и его отсутствие не влияет на механику ужаса.',
    examples: [],
    counterExamples: []
  }),
  missing_person_investigation: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.investigation_frame,
    families: ['investigation_frame', 'psychological_wound', 'narrative_function'],
    lanes: ['investigation_media_lane'],
    useWhen: 'Поиск пропавшего человека, выяснение обстоятельств исчезновения или следы исчезнувшего персонажа являются двигателем расследования и раскрытия угрозы.',
    avoidWhen: 'Персонаж отсутствует или умер, но расследование исчезновения не является сюжетной рамкой.',
    examples: ['Project MKHEXE', 'Дневник Рисы'],
    counterExamples: []
  }),
  moral_test: { tier: "anchor", confidence: "stable" },
  mountain_wilderness: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type', 'survival_structure'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Горы, дикая местность, удалённая тропа или wilderness-пространство ограничивают помощь, передвижение, спасение или усиливают creature/survival-угрозу.',
    avoidWhen: 'Горный или природный фон не влияет на выживание, изоляцию или угрозу.',
    examples: ['Йети'],
    counterExamples: []
  }),
  mutant_creature: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_origin', 'threat_behavior'],
    lanes: ['creature_lane'],
    useWhen: 'Существо является результатом мутации, загрязнения, эксперимента, биологического сбоя или деформированной природы.',
    avoidWhen: 'Существо просто монструозное, но мутационная природа не подтверждена.',
    examples: [],
    counterExamples: []
  }),
  mutant_society: { tier: "standard", confidence: "observe" },
  myth_reframing: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['myth_reframing', 'narrative_function'],
    lanes: ['folk_myth_lane'],
    useWhen: 'Фильм переосмысляет миф, легенду, сказку, фольклорный сюжет или культурный образ как работающую хоррор-механику.',
    avoidWhen: 'Есть только визуальная или маркетинговая отсылка к мифу без реального переосмысления в механике ужаса.',
    examples: [],
    counterExamples: []
  }),
  mythic_creature: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_origin', 'myth_reframing'],
    lanes: ['creature_lane', 'folk_myth_lane'],
    useWhen: 'Угроза основана на мифическом, легендарном, фольклорном или криптидном существе.',
    avoidWhen: 'Существо просто неизвестное/монструозное, но мифологическая или фольклорная природа не подтверждена.',
    examples: ['Йети', 'Остров хищника'],
    counterExamples: []
  }),
  office_space: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type'],
    lanes: [],
    useWhen: 'Офис, рабочее пространство или корпоративная среда является значимой площадкой угрозы, ловушки, убийств или социальной сатиры.',
    avoidWhen: 'Офис появляется как бытовой фон и не влияет на механику ужаса.',
    examples: ['Канун нового страха'],
    counterExamples: []
  }),
  occult_book: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.investigation_frame,
    families: ['investigation_frame', 'ritual_mechanism'],
    lanes: ['investigation_media_lane', 'ritual_occult_lane'],
    useWhen: 'Книга, дневник, манускрипт, текст, инструкция или архивный источник раскрывает/запускает оккультную механику угрозы.',
    avoidWhen: 'Книга просто реквизит или источник справочной информации без роли в угрозе/ритуале.',
    examples: [],
    counterExamples: []
  }),
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
  one_night_survival: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['survival_structure', 'temporal_mechanism'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Основная угроза и выживание сжаты в одну ночь, смену, праздник или короткий временной отрезок с нарастающим давлением.',
    avoidWhen: 'Действие просто происходит ночью, но временное сжатие не является структурой survival-механики.',
    examples: ['Они придут за тобой', 'Я иду искать 2'],
    counterExamples: []
  }),
  obsessive_compulsive_behavior: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['psychological_wound', 'human_dynamics'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Навязчивое, компульсивное или ритуализированное поведение персонажа влияет на угрозу, восприятие, конфликт или изоляцию.',
    avoidWhen: 'Поведенческая особенность упомянута поверхностно и не влияет на механику ужаса.',
    examples: ['Нечто из унитаза'],
    counterExamples: []
  }),
  paranormal_media: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.investigation_frame,
    families: ['investigation_frame', 'threat_origin'],
    lanes: ['investigation_media_lane', 'supernatural_entity_lane'],
    useWhen: 'Медиа-материал, запись, съёмка, трансляция, плёнка, фото или цифровой след содержит/передаёт паранормальную угрозу или контакт.',
    avoidWhen: 'Медиа используется только как формат фильма или обычный способ документирования без паранормального слоя.',
    examples: ['Дневник Рисы'],
    counterExamples: []
  }),
  parent_child_pair: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['human_dynamics', 'psychological_wound'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Связка родитель–ребёнок является важной механикой угрозы, защиты, вины, утраты, одержимости, контроля или семейной травмы.',
    avoidWhen: 'Родитель и ребёнок просто присутствуют в сюжете, но их связь не влияет на horror-механику.',
    examples: ['Белдхэм. Проклятие ведьмы', 'Рождённый из грязи'],
    counterExamples: []
  }),
  pirate_setting: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type', 'myth_reframing'],
    lanes: ['folk_myth_lane'],
    useWhen: 'Пиратская, морская-разбойничья или проклятая корабельная среда является значимой частью угрозы, мифа, проклятия или survival-структуры.',
    avoidWhen: 'Пиратская эстетика есть только как костюм, декор или фон.',
    examples: ['Капитан Крюк: Проклятые берега'],
    counterExamples: []
  }),
  plumbing_horror: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type', 'space_mechanism'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Сантехника, трубы, канализация, туалет, слив или бытовая инженерная система становятся источником угрозы, вторжения, заражения или аномального пространства.',
    avoidWhen: 'Сантехника используется только как бытовая деталь или gag без horror-механики.',
    examples: ['Нечто из унитаза'],
    counterExamples: []
  }),
  post_apocalyptic_survival: createCanonTagMeta({
    tier: "standard",
    confidence: "provisional",
    status: CANON_TAG_STATUSES.provisional,
    role: CANON_TAG_ROLES.structure,
    families: ['survival_structure', 'social_contagion'],
    lanes: ['survival_containment_lane', 'infection_outbreak_lane'],
    useWhen: 'Выживание происходит после катастрофы, вспышки, распада общества или массового заражения, и новый порядок мира влияет на угрозу.',
    avoidWhen: 'Есть заражение или катастрофа, но мир ещё не перешёл в постапокалиптическую survival-структуру.',
    examples: [],
    counterExamples: []
  }),
  prank_horror: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['narrative_function', 'threat_behavior', 'social_contagion'],
    lanes: [],
    useWhen: 'Розыгрыш, постановочная провокация, prank-культура или записываемая манипуляция запускают угрозу, эскалацию насилия или раскрытие человеческой монструозности.',
    avoidWhen: 'Есть юмор, обман или видеоформат, но prank не является причиной horror-механики.',
    examples: ['Милк и сериал'],
    counterExamples: []
  }),
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
  protagonist_killer: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_behavior', 'protagonist_structure', 'psychological_wound'],
    lanes: ['slasher_lane', 'psychological_reality_lane'],
    useWhen: 'Главный персонаж сам является убийцей, становится центральной угрозой или фильм устроен через его превращение/раскрытие как killer-фигуры.',
    avoidWhen: 'Протагонист просто совершает насилие в самообороне или морально неоднозначен, но не является horror-угрозой.',
    examples: ['Тихая ночь, смертельная ночь'],
    counterExamples: []
  }),
  rabies_infection: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['threat_origin', 'threat_behavior', 'social_contagion'],
    lanes: ['creature_lane', 'infection_outbreak_lane'],
    useWhen: 'Угроза связана с бешенством, животным заражением или инфекционной агрессией, которая меняет поведение существ/людей.',
    avoidWhen: 'Есть обычное нападение животного или creature-угроза без инфекционной механики.',
    examples: [],
    counterExamples: []
  }),
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
  rescue_mission: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['narrative_function', 'survival_structure'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Сюжетная цель персонажей — найти, вытащить, спасти или эвакуировать кого-то из опасного пространства/ситуации.',
    avoidWhen: 'Персонажи просто пытаются выжить сами, без отдельной спасательной задачи.',
    examples: ['Они придут за тобой'],
    counterExamples: []
  }),
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
  revenant_killer: createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_origin', 'threat_behavior', 'narrative_function'],
    lanes: ['slasher_lane', 'supernatural_entity_lane'],
    useWhen: 'Убийца возвращается из смерти, действует как оживший мститель, revenant-фигура или сверхъестественный каратель.',
    avoidWhen: 'Есть обычный serial_killer, revenge_mission или revenge_ghost без физической killer-фигуры revenant-типа.',
    examples: ['Священник: Резня в День благодарения'],
    counterExamples: []
  }),
  road_space: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type', 'space_mechanism'],
    lanes: [],
    useWhen: 'Дорога, маршрут, поездка или невозможность съехать с пути формируют структуру угрозы, петли, преследования или заблуждения.',
    avoidWhen: 'Дорога используется только как проходная локация без влияния на horror-механику.',
    examples: ['Всё заканчивается'],
    counterExamples: []
  }),
  romantic_pair: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['human_dynamics', 'psychological_wound'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Пара, брак, романтическая связь или разрушающиеся отношения являются важной рамкой угрозы, изоляции, зависимости, ревности или выживания.',
    avoidWhen: 'Романтическая линия есть, но не влияет на horror-механику.',
    examples: [],
    counterExamples: []
  }),
  roadside_motel: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type', 'survival_structure'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Придорожный мотель, временное убежище у дороги или изолированная ночлежка становится местом ловушки, нападения, тайны или удержания.',
    avoidWhen: 'Мотель просто короткая остановка без horror-механики.',
    examples: [],
    counterExamples: []
  }),
  ruins_space: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type', 'investigation_frame'],
    lanes: ['investigation_media_lane'],
    useWhen: 'Руины, древнее сооружение, разрушенное место или археологическое пространство являются значимой точкой угрозы, проклятия, расследования или фольклорного контакта.',
    avoidWhen: 'Руины присутствуют только как атмосферный фон.',
    examples: [],
    counterExamples: []
  }),
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
  sadistic_captor: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_behavior', 'human_dynamics', 'survival_structure'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Угроза строится вокруг похитителя/мучителя/надзирателя, который удерживает, ломает, воспитывает, пытает или контролирует жертву.',
    avoidWhen: 'Есть похищение, но личность похитителя не является садистской управляющей угрозой.',
    examples: ['Куколка'],
    counterExamples: []
  }),
  school_space: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type', 'human_dynamics'],
    lanes: [],
    useWhen: 'Школа, учебное пространство или образовательная среда влияет на угрозу, травму, буллинг, социальное давление или сверхъестественный конфликт.',
    avoidWhen: 'Школа просто фоновая локация и не влияет на механику ужаса.',
    examples: ['Астрал. Школа кошмаров', 'Уиджа. Шёпоты мёртвых'],
    counterExamples: []
  }),
  scandinavian_setting: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type'],
    lanes: [],
    useWhen: 'Скандинавская, северная или нордическая среда заметно влияет на фольклорный, природный, изоляционный или социальный слой ужаса.',
    avoidWhen: 'Страна производства скандинавская, но сама среда не имеет значения для horror-механики.',
    examples: [],
    counterExamples: []
  }),
  scientific_creature: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_origin', 'threat_behavior'],
    lanes: ['creature_lane'],
    useWhen: 'Существо создано, изменено или высвобождено научным экспериментом, лабораторией, технологией или исследованием.',
    avoidWhen: 'В фильме есть научный эксперимент, но сама угроза не является существом.',
    examples: [],
    counterExamples: []
  }),
  scientific_experiment: { tier: "standard", confidence: "stable" },
  scuba_killer: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_behavior', 'setting_type'],
    lanes: ['slasher_lane'],
    useWhen: 'Убийца устойчиво связан с водолазным/подводным образом, снаряжением, каналами, водой или специфической aquatic-slasher угрозой.',
    avoidWhen: 'В фильме есть вода или подводная сцена, но killer-фигура не определяется scuba/aquatic-механикой.',
    examples: ['Амстердамский кошмар 2'],
    counterExamples: []
  }),
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
  shark_attack: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_behavior', 'setting_type'],
    lanes: ['creature_lane', 'survival_containment_lane'],
    useWhen: 'Акула является центральной физической угрозой или основной животной угрозой фильма.',
    avoidWhen: 'Акула присутствует только эпизодически, метафорически или как часть более широкой creature-системы без фокуса на нападении акулы.',
    examples: ['Отмель', 'Акула-мумия'],
    counterExamples: []
  }),
  sick_child: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['psychological_wound', 'human_dynamics'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Болезнь ребёнка является важной мотивацией, источником вины, страха, ритуала, сделки, защиты или морального давления.',
    avoidWhen: 'Ребёнок болен только как бытовая деталь и это не влияет на угрозу.',
    examples: [],
    counterExamples: []
  }),
  sick_sibling: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['psychological_wound', 'human_dynamics'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Болезнь брата или сестры влияет на мотивацию, вину, семейный конфликт, ритуал, сделку или готовность персонажа идти на риск.',
    avoidWhen: 'Болезнь родственника упомянута, но не влияет на horror-механику.',
    examples: [],
    counterExamples: []
  }),
  sibling_pair: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['human_dynamics', 'psychological_wound'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Связка брат/сестра является важной механикой защиты, вины, травмы, поиска, жертвы, зависимости или семейного конфликта.',
    avoidWhen: 'У персонажа просто есть брат или сестра, но эта связь не влияет на угрозу.',
    examples: [],
    counterExamples: []
  }),
  ski_resort: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type', 'survival_structure'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Горнолыжный курорт, зимняя база или снежная туристическая зона формирует изоляцию, опасность среды, creature-угрозу или структуру выживания.',
    avoidWhen: 'Курорт просто обозначен как фон без влияния на угрозу.',
    examples: ['Возвращение гремлинов'],
    counterExamples: []
  }),
  small_town_secret: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.investigation_frame,
    families: ['investigation_frame', 'human_dynamics'],
    lanes: ['investigation_media_lane'],
    useWhen: 'Маленький город, деревня или закрытое сообщество скрывает тайну, преступление, культовую практику, исчезновение или источник угрозы.',
    avoidWhen: 'Маленький город просто место действия без тайны, заговора или расследовательского слоя.',
    examples: [],
    counterExamples: []
  }),
  snake_attack: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_behavior', 'setting_type'],
    lanes: ['creature_lane', 'survival_containment_lane'],
    useWhen: 'Змея, змеи или змеиное существо являются центральной физической угрозой фильма.',
    avoidWhen: 'Змея присутствует только как символ, эпизод или часть общего ритуального/мифологического образа.',
    examples: ['Анаконды'],
    counterExamples: []
  }),
  snow_isolation: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type', 'survival_structure'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Снег, холод, горы, метель или зимняя изоляция ограничивают движение, спасение или выживание персонажей.',
    avoidWhen: 'Зимний сеттинг есть только как фон и не влияет на угрозу или survival-структуру.',
    examples: ['Возвращение гремлинов'],
    counterExamples: []
  }),
  social_media_performance: { tier: "anchor", confidence: "stable" },
  social_status_obsession: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['psychological_wound', 'human_dynamics', 'social_contagion'],
    lanes: ['psychological_reality_lane', 'body_identity_lane'],
    useWhen: 'Одержимость статусом, признанием, красотой, нормой или социальной успешностью запускает трансформацию, насилие, утрату себя или психологический распад.',
    avoidWhen: 'Социальный статус просто важен персонажу, но не становится механизмом ужаса.',
    examples: ['Отклонение'],
    counterExamples: []
  }),
  spatial_loop: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['reality_structure', 'space_mechanism'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Пространство зациклено, повторяется, не выпускает персонажа или нарушает обычную географию как самостоятельная механика угрозы.',
    avoidWhen: 'Персонаж просто заблудился, но пространство не работает как петля или аномальная структура.',
    examples: ['Выход 8'],
    counterExamples: []
  }),
  spreading_contamination: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['social_contagion', 'threat_origin', 'threat_behavior'],
    lanes: ['infection_outbreak_lane'],
    useWhen: 'Угроза распространяется через заражение, контакт, среду, вещество, тело, воздух, объект или цепочку передачи.',
    avoidWhen: 'Опасность существует локально и не имеет механики распространения.',
    examples: ['Зараза', 'Кровавый сарай'],
    counterExamples: []
  }),
  staged_death: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['narrative_function', 'threat_behavior'],
    lanes: [],
    useWhen: 'Смерть, убийство или тело инсценируются, подделываются или используются как часть манипуляции, расследования, мести или угрозы.',
    avoidWhen: 'Есть просто смерть персонажа без инсценировки или обмана вокруг неё.',
    examples: ['Морган: Кукла-убийца'],
    counterExamples: []
  }),
  subway_space: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type', 'space_mechanism'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Метро, переход, станция или подземный транспорт работает как лиминальное, повторяющееся, замкнутое или аномальное пространство.',
    avoidWhen: 'Метро просто транспортная локация без пространственной механики ужаса.',
    examples: ['Выход 8'],
    counterExamples: []
  }),
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
  supernatural_killer: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_origin', 'threat_behavior'],
    lanes: ['slasher_lane', 'supernatural_entity_lane'],
    useWhen: 'Убийца действует как сверхъестественная killer-фигура: не просто человек, а сущность, проклятый убийца, магический каратель или неестественно живучая угроза.',
    avoidWhen: 'Есть обычный masked_killer или serial_killer без подтверждённой сверхъестественной природы.',
    examples: ['Джестер 2'],
    counterExamples: []
  }),
  terminal_illness: { tier: "standard", confidence: "stable" },
  theater_space: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type'],
    lanes: [],
    useWhen: 'Театр, сцена, зал, репетиционное или перформативное пространство влияет на угрозу, ловушку, ритуал или убийства.',
    avoidWhen: 'Театр только упоминается или используется как фон без роли в horror-механике.',
    examples: ['Мертвы к рассвету'],
    counterExamples: []
  }),
  thanksgiving_setting: { tier: "standard", confidence: "observe" },
  time_displacement: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.temporal_mechanism,
    families: ['temporal_mechanism', 'reality_structure'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Время смещено, нарушено, перепутано или персонажи оказываются не в своём временном слое.',
    avoidWhen: 'Есть флэшбэки, воспоминания или нелинейный монтаж без реального временного сдвига.',
    examples: ['Diabolisch'],
    counterExamples: []
  }),
  time_loop: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.temporal_mechanism,
    families: ['temporal_mechanism', 'reality_structure'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'События, день, пространство или смертельная ситуация повторяются циклом, и петля является центральной механикой угрозы.',
    avoidWhen: 'Есть повторяющиеся мотивы или монтажные повторы, но не подтверждённая временная петля.',
    examples: [],
    counterExamples: []
  }),
  time_machine_experiment: { tier: "anchor", confidence: "observe" },
  toxic_parent: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['human_dynamics', 'psychological_wound', 'threat_behavior'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Родительский контроль, насилие, манипуляция, пренебрежение или травматическое воспитание прямо формируют угрозу или психологический распад.',
    avoidWhen: 'Родитель просто строгий, неприятный или конфликтный, но его токсичность не является horror-механикой.',
    examples: [],
    counterExamples: []
  }),
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
  trauma_driven_killer: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_behavior', 'psychological_wound'],
    lanes: ['slasher_lane', 'psychological_reality_lane'],
    useWhen: 'Убийца или killer-фигура мотивированы травмой, прошлым насилием, унижением, семейной раной или психическим переломом.',
    avoidWhen: 'У убийцы просто есть бэкстори, но травма не объясняет структуру угрозы или мотив убийств.',
    examples: ['Тихая ночь, смертельная ночь'],
    counterExamples: []
  }),
  trauma_return: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['psychological_wound', 'narrative_function'],
    lanes: ['slasher_lane', 'psychological_reality_lane'],
    useWhen: 'Прошлая травма возвращается как активная угроза: через нового убийцу, повторение нападения, возвращение преследователя или повторное вскрытие старого насилия.',
    avoidWhen: 'Персонаж просто помнит травму, но она не возвращается как работающая структура угрозы.',
    examples: ['Крик 7', 'Незнакомцы: Часть третья'],
    counterExamples: []
  }),
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
  trickster_threat: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_behavior,
    families: ['threat_behavior', 'narrative_function'],
    lanes: ['slasher_lane', 'supernatural_entity_lane'],
    useWhen: 'Угроза действует как трикстер: заманивает, испытывает, издевается, нарушает правила, играет с жертвой или превращает насилие в перформативную игру.',
    avoidWhen: 'Убийца просто жестокий или саркастичный, но trickster-логика не является устойчивой механикой угрозы.',
    examples: ['Джестер 2'],
    counterExamples: []
  }),
  underground_dystopia: createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type', 'social_contagion', 'survival_structure'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Подземное пространство, бункер, тоннели, нижний город или скрытая инфраструктура работают как замкнутая антиутопическая система выживания, контроля или угрозы.',
    avoidWhen: 'Подземная локация есть, но не формирует отдельную социальную или survival-механику.',
    examples: [],
    counterExamples: []
  }),
  uneasy_alliance: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['human_dynamics', 'survival_structure'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Персонажи вынуждены сотрудничать с теми, кому не доверяют, чтобы выжить, расследовать угрозу или временно противостоять большему злу.',
    avoidWhen: 'Персонажи просто спорят или работают вместе без напряжённого вынужденного союза.',
    examples: [],
    counterExamples: []
  }),
  unrequited_obsession: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['psychological_wound', 'human_dynamics'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Неразделённая любовь, фиксация, ревность или навязчивая привязанность становятся причиной угрозы, насилия, преследования или распада персонажа.',
    avoidWhen: 'Романтическая линия есть, но навязчивая одержимость не является механизмом ужаса.',
    examples: ['Морган: Кукла-убийца'],
    counterExamples: []
  }),
  urban_legend_rabbit_hole: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.investigation_frame,
    families: ['investigation_frame', 'myth_reframing'],
    lanes: ['investigation_media_lane', 'folk_myth_lane'],
    useWhen: 'Персонажи погружаются в городскую легенду, слух, крипипасту, сетевую историю или локальный миф, и расследование постепенно раскрывает реальную угрозу.',
    avoidWhen: 'Легенда просто упоминается, но нет структуры расследовательского погружения.',
    examples: ['Project MKHEXE'],
    counterExamples: []
  }),
  vampire: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_origin', 'threat_behavior', 'myth_reframing'],
    lanes: ['supernatural_entity_lane', 'folk_myth_lane'],
    useWhen: 'Вампир, вампирская сущность, кровососущая угроза или вампиризм являются центральной механикой угрозы.',
    avoidWhen: 'Есть только готическая эстетика, кровь, культовый образ или отсылка к вампирам без реальной вампирской угрозы.',
    examples: ['Дракула'],
    counterExamples: []
  }),
  virtual_reality_simulation: createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['reality_structure', 'space_mechanism'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Угроза, пространство или испытание существуют внутри симуляции, виртуальной реальности, цифровой среды или искусственной модели мира.',
    avoidWhen: 'Есть технологии или экраны, но они не создают отдельную симулированную реальность.',
    examples: ['Монстр'],
    counterExamples: []
  }),
  war_survival: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.structure,
    families: ['survival_structure', 'human_dynamics'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Военная обстановка, оккупация, фронт, лагерь или боевой конфликт задают survival-механику и ограничивают действия персонажей.',
    avoidWhen: 'Война присутствует только как исторический фон без survival-структуры.',
    examples: [],
    counterExamples: []
  }),
  waterway_space: createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['setting_type'],
    lanes: [],
    useWhen: 'Каналы, реки, водные пути или городская водная среда являются значимой частью угрозы, убийств, преследования или изоляции.',
    avoidWhen: 'Водный путь просто появляется в кадре и не влияет на механику угрозы.',
    examples: ['Амстердамский кошмар 2'],
    counterExamples: []
  }),
  wedding_frame: createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['narrative_function', 'human_dynamics'],
    lanes: [],
    useWhen: 'Свадьба, брачный ритуал, подготовка к свадьбе или семейное торжество являются важной рамкой угрозы, социального давления, ритуала или ловушки.',
    avoidWhen: 'Свадьба только упомянута или служит фоном без влияния на horror-механику.',
    examples: ['Добыча для невесты'],
    counterExamples: []
  }),
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
  zombie: createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['threat_origin', 'threat_behavior', 'social_contagion'],
    lanes: ['infection_outbreak_lane'],
    useWhen: 'Зомби, ожившие мертвецы, инфицированные зомби-подобные тела или мертвецы как массовая/центральная угроза являются реальной механикой фильма.',
    avoidWhen: 'Зомби есть только как образ, шутка, костюм, сон или единичная отсылка без работающей угрозы.',
    examples: ['Зараза', '28 лет спустя: Часть II. Храм костей'],
    counterExamples: []
  })
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
      'evil_spirit_resurrection',
      'vampire'
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
      'icon_reframing',
      'vampire',
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
    myth_reframing: 0.15,
    vampire: 0.15
  },

  vampire: {
    folklore_entity: 0.15,
    myth_reframing: 0.2,
    supernatural_influence: 0.1
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
  'vampire',
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
    vampire: 'Вампирский хоррор',
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
  vampire: [
    {
      label: 'вампирская угроза',
      tags: ['vampire']
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
    getSimilarMovieCards,
    auditCanonTagMetaRegistrySource
  }
};

if (typeof window !== 'undefined') {
  window.HORROR_TAXONOMY_REGISTRY_AUDIT = auditCanonTagMetaRegistrySource();
}