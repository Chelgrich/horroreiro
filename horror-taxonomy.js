const SIMILARITY_MODEL = {
  MAX_RESULTS: 4,

  SCORE_CAPS: {
    canonExact: 60,
    canonAffinity: 8,
    modifiers: 16,
    broadFamilies: 7,
    formats: 5,
    genres: 5,
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
  const startPattern = new RegExp(`^\\s*${startToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'm');
  const startMatch = source.match(startPattern);

  if (!startMatch || typeof startMatch.index !== 'number') {
    return '';
  }

  const openIndex = source.indexOf('{', startMatch.index);

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

  const keyMatches = Array.from(objectBody.matchAll(/^\s{2}(?:['"]([^'"]+)['"]|([A-Za-z_$][\w$]*))\s*:/gm));
  const firstSeenIndexByKey = new Map();
  const duplicates = [];

  keyMatches.forEach((match, index) => {
    const key = match[1] || match[2];

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
  'Заброшенное поселение': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Структура выживания'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Заброшенный город, посёлок, деревня или поселение работает как изолированное пространство угрозы, тайны, выживания или следов прошлого.',
    avoidWhen: 'Локация просто выглядит заброшенной, но не влияет на механику угрозы или расследования.',
    examples: [],
    counterExamples: []
  }),
  'Травма насилия': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['Психологическая рана', 'Человеческая динамика', 'Поведение угрозы'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Пережитое насилие, эксплуатация, унижение, абьюз или травматический опыт являются важной причиной угрозы, распада, мести, контроля или восприятия ужаса.',
    avoidWhen: 'Насилие просто есть в прошлом персонажа, но не влияет на horror-механику, мотивацию или структуру фильма.',
    examples: ['Они придут за тобой', 'Куколка'],
    counterExamples: []
  }),
  'AI-генерация': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.format_bridge,
    families: ['Структура реальности', 'Нарративная функция'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'AI-генерация, искусственно созданная образность или машинная природа фильма является заметной частью хоррор-эффекта, формы или концепции.',
    avoidWhen: 'AI использовался только производственно или маркетингово, но не влияет на восприятие, структуру или механику ужаса.',
    examples: ['Дракула'],
    counterExamples: []
  }),
  'Инопланетное существо': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Источник угрозы', 'Поведение угрозы'],
    lanes: ['creature_lane'],
    useWhen: 'Центральная угроза — инопланетное существо, организм или нечеловеческая форма жизни, действующая как creature-угроза.',
    avoidWhen: 'Инопланетный слой есть только как сеттинг, технология или фон без существа как активной угрозы.',
    examples: ['Монстр'],
    counterExamples: []
  }),
  'Инопланетная угроза': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Источник угрозы', 'Поведение угрозы'],
    lanes: ['creature_lane', 'survival_containment_lane'],
    useWhen: 'Инопланетная сила, организм, вторжение или нечеловеческая угроза является центральным источником опасности.',
    avoidWhen: 'Есть отдельное Инопланетное существо, но нет более широкой инопланетной угрозы/вторжения/системы.',
    examples: [],
    counterExamples: []
  }),
  'Космическая среда': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Структура выживания'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Космос, орбита, космический корабль, станция, вакуум или межпланетная среда существенно формируют угрозу, изоляцию, ловушку или survival-механику.',
    avoidWhen: 'Инопланетная угроза есть, но действие не зависит от космической среды; космос упомянут только как происхождение угрозы, пролог или фон.',
    examples: ['Хищник: Миссия «Осирис»'],
    counterExamples: []
  }),
  'Альтернативное измерение': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Структура реальности', 'Пространственный механизм'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Фильм использует иное измерение, параллельное пространство, скрытую реальность или переход между слоями мира как рабочую механику угрозы.',
    avoidWhen: 'Есть просто странное место или визуальная условность без подтверждённой альтернативной реальности.',
    examples: ['Монстр', 'Возвращение гремлинов'],
    counterExamples: []
  }),
  'Парк аттракционов': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Нарративная функция'],
    lanes: [],
    useWhen: 'Парк развлечений, аттракцион, ярмарочная зона или funhouse-пространство является значимой площадкой угрозы, ловушки, убийств или хоррор-переосмысления развлечения.',
    avoidWhen: 'Аттракцион или парк мелькает как фон и не формирует horror-механику.',
    examples: ['Пункт назначения: Новый аттракцион'],
    counterExamples: []
  }),
  'Древнее проклятие': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Ритуальный механизм', 'Источник угрозы'],
    lanes: ['ritual_occult_lane', 'supernatural_entity_lane'],
    useWhen: 'Проклятие имеет древнее, наследуемое или исторически закреплённое происхождение и работает как реальная механика угрозы.',
    avoidWhen: 'Есть просто старая легенда, страшная история или атмосферное упоминание древности без действующего проклятия.',
    examples: ['Астрал. Амулет зла', 'Капитан Крюк: Проклятые берега'],
    counterExamples: []
  }),
  'Антологическая связка': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.format_bridge,
    families: ['Нарративная функция'],
    lanes: [],
    useWhen: 'Отдельные новеллы, истории или сегменты связаны общей рамкой, предметом, местом, персонажем, проклятием или повторяющейся механикой.',
    avoidWhen: 'Фильм просто антология по формату, но между сегментами нет значимой внутренней связки.',
    examples: [],
    counterExamples: []
  }),
  'Квартира как пространство угрозы': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга'],
    lanes: [],
    useWhen: 'Квартира или жилой многоквартирный интерьер является значимым пространством угрозы, изоляции, вторжения или бытового ужаса.',
    avoidWhen: 'Квартира просто кратко показана и не влияет на механику ужаса.',
    examples: ['Нечто из унитаза'],
    counterExamples: []
  }),
  'Больница как пространство угрозы': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Структура выживания'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Больница, клиника, госпиталь, медцентр, палата, операционный блок или заражённое медучреждение является значимым пространством угрозы, изоляции, эксперимента, удержания или невозможности выбраться.',
    avoidWhen: 'Больница появляется только как проходная сцена, место лечения, пролог или эпилог и не влияет на horror-механику.',
    examples: ['Зиам'],
    counterExamples: []
  }),
  'Водная среда': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга'],
    lanes: [],
    useWhen: 'Водная среда, море, озеро, бассейн, подводное пространство или береговая зона существенно формируют угрозу.',
    avoidWhen: 'Вода присутствует как фон, но не влияет на угрозу, изоляцию или survival-механику.',
    examples: ['Кит-убийца', 'Отмель'],
    counterExamples: []
  }),
  'Утрата себя под давлением': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['Социальное заражение', 'Психологическая рана', 'Человеческая динамика'],
    lanes: ['body_identity_lane'],
    useWhen: 'Персонаж вынужден подстраиваться, менять тело, идентичность, статус или поведение под давление группы, культуры, семьи или социальной нормы.',
    avoidWhen: 'Есть обычное социальное давление, но оно не запускает механику ужаса, трансформации или утраты себя.',
    examples: ['Отклонение'],
    counterExamples: []
  }),
  'Аудиоконтакт': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Рамка расследования', 'Источник угрозы'],
    lanes: ['investigation_media_lane', 'supernatural_entity_lane'],
    useWhen: 'Контакт с угрозой, призраком, сущностью или прошлым происходит через звук, голос, запись, радио, звонок, плёнку или аудиосообщение.',
    avoidWhen: 'Звук используется только как атмосфера, скример или обычная улика без отдельной механики контакта.',
    examples: [],
    counterExamples: []
  }),
  'Сарай / амбар': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга'],
    lanes: [],
    useWhen: 'Сарай, амбар, фермерская постройка или хозяйственное пространство является значимым местом угрозы, тайны или удержания.',
    avoidWhen: 'Сарай мелькает как декорация и не влияет на механику ужаса.',
    examples: ['Кровавый сарай'],
    counterExamples: []
  }),
  'Заболоченная среда': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга'],
    lanes: [],
    useWhen: 'Байу, болото, заболоченная южная местность или влажная изолированная среда формирует угрозу, фольклорный слой, преследование или невозможность быстро выбраться.',
    avoidWhen: 'Болотистая местность есть только как визуальный фон.',
    examples: [],
    counterExamples: []
  }),
  'Чёрная магия': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Ритуальный механизм', 'Источник угрозы'],
    lanes: ['ritual_occult_lane'],
    useWhen: 'Ведьмовская, демоническая или оккультная магия является прямой причиной угрозы, проклятия, одержимости или вреда.',
    avoidWhen: 'Есть только общая оккультная атмосфера, символика или ритуал без подтверждённой магической практики.',
    examples: ['Астрал. Заклятие мёртвых', 'Зеркала. Пожиратели душ'],
    counterExamples: []
  }),
  'Перенос сознания': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Структура реальности', 'Поведение угрозы'],
    lanes: ['psychological_reality_lane', 'body_identity_lane'],
    useWhen: 'Сознание, личность, душа или контроль персонажа переносится в другое тело, носитель или форму существования.',
    avoidWhen: 'Есть обычная одержимость сущностью — тогда использовать Демоническая одержимость, Призрачная одержимость или Одержимость сущностью.',
    examples: [],
    counterExamples: []
  }),
  'Телесная трансформация': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Поведение угрозы', 'Структура реальности', 'Психологическая рана'],
    lanes: ['body_identity_lane', 'psychological_reality_lane'],
    useWhen: 'Тело персонажа физически меняется, мутирует, деформируется, распадается или становится носителем ужаса.',
    avoidWhen: 'Есть раны, gore или обычное насилие, но нет устойчивой механики телесной трансформации.',
    examples: ['Мать мух', 'Отклонение'],
    counterExamples: []
  }),
  'Школа-интернат': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Человеческая динамика'],
    lanes: [],
    useWhen: 'Школа-интернат, закрытое учебное учреждение или кампус с проживанием формирует изоляцию, дисциплинарное давление, тайну или систему насилия.',
    avoidWhen: 'Учебное заведение просто место действия без закрытой структуры, давления или угрозы.',
    examples: [],
    counterExamples: []
  }),
  'Тайна прошлого': createCanonTagMeta({
    tier: "broad",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.investigation_frame,
    families: ['Нарративная функция', 'Рамка расследования', 'Психологическая рана'],
    lanes: ['investigation_media_lane', 'psychological_reality_lane'],
    useWhen: 'Скрытое прошлое, старая вина, преступление, семейная тайна или замолчанный факт постепенно раскрываются и объясняют текущую угрозу.',
    avoidWhen: 'Прошлое просто упоминается в биографии, но не является двигателем расследования или механики ужаса.',
    examples: ['Добыча для невесты', 'Шелби Оукс. Город-призрак'],
    counterExamples: []
  }),
  'Месть за травлю': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Психологическая рана', 'Поведение угрозы', 'Человеческая динамика'],
    lanes: ['psychological_reality_lane', 'slasher_lane'],
    useWhen: 'Буллинг, унижение или травля возвращаются как месть, убийства, сверхъестественная расплата или травматическая причина угрозы.',
    avoidWhen: 'Буллинг упомянут как фон, но не запускает угрозу или структуру мести.',
    examples: [],
    counterExamples: []
  }),
  'Каннибализм': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_behavior,
    families: ['Поведение угрозы', 'Человеческая динамика'],
    lanes: [],
    useWhen: 'Каннибализм является центральной угрозой, практикой, мотивацией убийцы, социальной системой или телесной механикой ужаса.',
    avoidWhen: 'Есть единичное упоминание поедания плоти или gore-эпизод, но каннибализм не является рабочей механикой фильма.',
    examples: ['Протеин', 'Горный король'],
    counterExamples: []
  }),
  'Химическое заражение': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Источник угрозы', 'Социальное заражение'],
    lanes: ['infection_outbreak_lane'],
    useWhen: 'Угроза вызвана химическим заражением, токсином, веществом, выбросом, экспериментальным препаратом или промышленной/лабораторной утечкой.',
    avoidWhen: 'Есть болезнь, зомби или заражение, но химическая причина не подтверждена.',
    examples: ['Ночь живых мертвецов 2.0'],
    counterExamples: []
  }),
  'Рождественский сеттинг': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Временной механизм'],
    lanes: [],
    useWhen: 'Рождество, рождественская ночь, праздничная символика или сезонный контекст существенно формируют угрозу, маску, ритуал, иронию или структуру фильма.',
    avoidWhen: 'Рождество присутствует только как календарный фон и не влияет на horror-механику.',
    examples: ['Тихая ночь, смертельная ночь', 'Возвращение гремлинов'],
    counterExamples: []
  }),
  'Детская травма': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['Психологическая рана', 'Человеческая динамика'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Детская травма, событие из прошлого, буллинг, семейное насилие или ранний страх возвращаются как источник угрозы, мотивации, искажения восприятия или расследования.',
    avoidWhen: 'Детство персонажа просто упомянуто, но не влияет на механику ужаса.',
    examples: [],
    counterExamples: []
  }),
  'Обратный отсчёт': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.temporal_mechanism,
    families: ['Временной механизм', 'Нарративная функция'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Угроза строится вокруг отсчёта, дедлайна, ограниченного времени, предсказанной смерти или неизбежного события, к которому движется сюжет.',
    avoidWhen: 'Есть просто напряжённый темп или приближающийся финал, но отсчёт не является рабочей структурой угрозы.',
    examples: [],
    counterExamples: []
  }),
  'Противостояние с существом': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_behavior,
    families: ['Поведение угрозы', 'Структура выживания'],
    lanes: ['creature_lane', 'survival_containment_lane'],
    useWhen: 'Фильм строится на прямом конфликте, схватке или противостоянии между персонажами и существом, а не только на присутствии монстра.',
    avoidWhen: 'Существо есть, но конфликт не является центральной структурой фильма.',
    examples: ['Ящер'],
    counterExamples: []
  }),
  'Опасный культ': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['Человеческая динамика', 'Ритуальный механизм', 'Социальное заражение'],
    lanes: ['ritual_occult_lane'],
    useWhen: 'Культ, секта или замкнутое сообщество является активным носителем угрозы, ритуала, давления или заражающей идеологии.',
    avoidWhen: 'Есть один оккультист, семейный ритуал или абстрактная религиозная тема без общинной/культовой структуры.',
    examples: ['Долина улыбок', 'Спаситель'],
    counterExamples: ['Астрал. Школа кошмаров']
  }),
  'Проклятый предмет': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Ритуальный механизм', 'Источник угрозы'],
    lanes: ['ritual_occult_lane', 'supernatural_entity_lane'],
    useWhen: 'Предмет является носителем проклятия, сущности, передачи угрозы или сверхъестественного эффекта.',
    avoidWhen: 'Предмет просто важен для сюжета, но не является активным источником угрозы.',
    examples: ['Рождённый из грязи', 'Свист'],
    counterExamples: []
  }),
  'Демоническая сущность': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Источник угрозы', 'Ритуальный механизм'],
    lanes: ['supernatural_entity_lane', 'ritual_occult_lane'],
    useWhen: 'Угроза явно имеет демоническую природу, но не обязательно проявляется через одержимость.',
    avoidWhen: 'Есть просто злая сущность, призрак или неопределённая сверхъестественная сила без демонической природы.',
    examples: ['Астрал. Заклятие мёртвых'],
    counterExamples: []
  }),
  'Демоническая одержимость': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Источник угрозы', 'Поведение угрозы', 'Ритуальный механизм'],
    lanes: ['supernatural_entity_lane', 'ritual_occult_lane'],
    useWhen: 'Демон захватывает тело, волю, поведение или восприятие персонажа, и одержимость является центральной механикой угрозы.',
    avoidWhen: 'Одержимость есть, но природа сущности не демоническая или не подтверждена — тогда использовать Одержимость сущностью.',
    examples: ['Она не мать', 'Одержимость Мары'],
    counterExamples: []
  }),
  'Экзорцизм': createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Ритуальный механизм', 'Поведение угрозы'],
    lanes: ['ritual_occult_lane', 'supernatural_entity_lane'],
    useWhen: 'Экзорцизм, изгнание демона, сущности, духа или одержимости является центральной рабочей механикой угрозы, спасения или противостояния.',
    avoidWhen: 'Есть одержимость без обряда изгнания; есть религиозная символика, молитва или общий оккультный ритуал, но экзорцизм не является значимой механикой фильма.',
    examples: ['Экзорцисты', 'Вскрытие демона'],
    counterExamples: []
  }),
  'Необитаемый остров': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Структура выживания'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Изолированный остров является рабочей ловушкой, средой выживания или причиной невозможности быстро покинуть опасность.',
    avoidWhen: 'Остров просто место действия, но изоляция не влияет на угрозу или структуру выживания.',
    examples: ['Остров хищника'],
    counterExamples: []
  }),
  'Ребёнок с инвалидностью': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['Человеческая динамика', 'Психологическая рана'],
    lanes: [],
    useWhen: 'Ребёнок с инвалидностью, особенностью развития или зависимостью от ухода является важной частью семейной угрозы, травмы, защиты или морального давления.',
    avoidWhen: 'Состояние ребёнка упомянуто биографически и не влияет на horror-механику, конфликт или уязвимость.',
    examples: [],
    counterExamples: []
  }),
  'Искажённая реальность': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Структура реальности'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Реальность фильма устойчиво нарушена: персонаж не может надёжно отличить реальное от искажённого, галлюцинаторного, сдвинутого или подменённого.',
    avoidWhen: 'Есть только субъективная тревога, сонная атмосфера или визуальная странность без работающей механики искажения реальности.',
    examples: ['Возвращение в Сайлент Хилл', 'Кожа к коже'],
    counterExamples: []
  }),
  'Угроза через сон': createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Структура реальности', 'Поведение угрозы'],
    lanes: ['psychological_reality_lane', 'supernatural_entity_lane'],
    useWhen: 'Угроза атакует, преследует или влияет на персонажей через сон, кошмары или пограничное состояние между сном и реальностью.',
    avoidWhen: 'Сны есть только как атмосфера, видения или символика, но не являются рабочим каналом угрозы.',
    examples: ['Песочный человек'],
    counterExamples: []
  }),
  'Дисфункциональная семья': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['Человеческая динамика', 'Психологическая рана'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Семейная дисфункция, насилие, недоверие, контроль или разрушенная семейная связь прямо формируют конфликт, угрозу или восприятие ужаса.',
    avoidWhen: 'Семья просто неблагополучная на фоне, но её динамика не влияет на механику фильма.',
    examples: [],
    counterExamples: []
  }),
  'Дисфункциональные отношения': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['Человеческая динамика', 'Психологическая рана'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Токсичные, зависимые, абьюзивные или распадающиеся отношения являются рабочим источником угрозы, изоляции, контроля или психологического распада.',
    avoidWhen: 'Отношения просто конфликтные или драматические, но не становятся horror-механикой.',
    examples: [],
    counterExamples: []
  }),
  'Египетская тема': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Переосмысление мифа', 'Тип сеттинга', 'Источник угрозы'],
    lanes: ['folk_myth_lane', 'supernatural_entity_lane'],
    useWhen: 'Египетская мифология, мумии, проклятия, древние артефакты или египетский ритуально-мифологический слой являются частью механики угрозы.',
    avoidWhen: 'Египетская эстетика есть только как декор, костюм или визуальная отсылка.',
    examples: ['Акула-мумия'],
    counterExamples: []
  }),
  'Угроза старшего поколения': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Поведение угрозы', 'Человеческая динамика'],
    lanes: [],
    useWhen: 'Пожилой персонаж, старик/старуха или группа старших людей являются активной угрозой, источником контроля, насилия, тайны или социальной ловушки.',
    avoidWhen: 'Пожилой персонаж просто присутствует в сюжете и не является horror-угрозой.',
    examples: ['Безумная старуха'],
    counterExamples: []
  }),
  'Жертвы элиты': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_behavior,
    families: ['Поведение угрозы', 'Человеческая динамика', 'Социальное заражение'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Богатые, влиятельные или привилегированные люди используют жертв как ресурс, добычу, развлечение, ритуальный материал или средство продления власти/жизни.',
    avoidWhen: 'Антагонисты просто богаты или статусны, но элитная система эксплуатации не является механизмом ужаса.',
    examples: ['Они придут за тобой'],
    counterExamples: []
  }),
  'Преследование': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_behavior,
    families: ['Поведение угрозы', 'Структура преследования'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Угроза строится на активном преследовании персонажей врагом, убийцей, группой, существом или враждебной силой.',
    avoidWhen: 'Персонажи просто находятся в опасности, но структура погони/преследования не является центральной.',
    examples: ['Добыча для невесты'],
    counterExamples: []
  }),
  'Одержимость сущностью': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Источник угрозы', 'Поведение угрозы'],
    lanes: ['supernatural_entity_lane'],
    useWhen: 'Сверхъестественная сущность захватывает, использует или подменяет тело/волю персонажа, но природа сущности не сводится уверенно к демону или призраку.',
    avoidWhen: 'Тип одержимости явно демонический или призрачный — тогда использовать Демоническая одержимость или Призрачная одержимость.',
    examples: ['Рождённый из грязи', 'Что случилось с Дороти Белл?'],
    counterExamples: []
  }),
  'Пробуждённое зло': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Источник угрозы', 'Ритуальный механизм'],
    lanes: ['supernatural_entity_lane', 'ritual_occult_lane'],
    useWhen: 'Злой дух, ведьма, сущность или сверхъестественная сила возвращается/воскрешается через ритуал, действие, место или нарушение запрета.',
    avoidWhen: 'Есть обычное появление призрака или сущности без механики возвращения/воскрешения.',
    examples: ['Они были ведьмами'],
    counterExamples: []
  }),
  'Семейная динамика': createCanonTagMeta({
    tier: "broad",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['Человеческая динамика'],
    lanes: [],
    useWhen: 'Семейная ячейка является важной рамкой конфликта, травмы, угрозы или мотивации персонажей.',
    avoidWhen: 'Родственники просто присутствуют в сюжете, но семейная связь не влияет на механику ужаса.',
    examples: ['Крик 7', 'Белдхэм. Проклятие ведьмы'],
    counterExamples: []
  }),
  'Наводнение-катастрофа': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['Структура выживания', 'Тип сеттинга'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Наводнение, затопление или водная катастрофа является центральной физической угрозой и задаёт структуру выживания.',
    avoidWhen: 'Вода или потоп присутствуют эпизодически, но не формируют survival-механику.',
    examples: ['Хищный рывок'],
    counterExamples: []
  }),
  'Фольклорная сущность': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Источник угрозы', 'Переосмысление мифа'],
    lanes: ['folk_myth_lane', 'supernatural_entity_lane'],
    useWhen: 'Угроза основана на фольклорной сущности, духе, легендарной фигуре, народном поверии или локальном мифе.',
    avoidWhen: 'Есть просто сельский/лесной сеттинг или народная атмосфера без конкретной фольклорной сущности.',
    examples: ['Гауа', 'Миля 666'],
    counterExamples: []
  }),
  'Лес как пространство угрозы': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга'],
    lanes: [],
    useWhen: 'Лес является значимым пространством угрозы, заблуждения, изоляции, фольклорного контакта или survival-механики.',
    avoidWhen: 'Лес присутствует только как фон или короткая локация без влияния на механику ужаса.',
    examples: ['Гауа', 'Миля 666', 'Одиночка'],
    counterExamples: []
  }),
  'Память как ключ к угрозе': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Психологическая рана', 'Структура реальности'],
    lanes: ['psychological_reality_lane', 'investigation_media_lane'],
    useWhen: 'Память персонажа повреждена, скрыта, подменена, фрагментирована или становится ключом к раскрытию угрозы.',
    avoidWhen: 'Персонаж просто вспоминает прошлое, но память не является механизмом ужаса или расследования.',
    examples: ['Под светом'],
    counterExamples: []
  }),
  'Вторжение из будущего': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.temporal_mechanism,
    families: ['Временной механизм', 'Структура реальности'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Будущее, будущая версия персонажа, будущая угроза или знание о будущем вторгаются в настоящее и меняют механику ужаса.',
    avoidWhen: 'Есть обычное предсказание, тревога о будущем или флэшфорвард без реального вмешательства будущего в события.',
    examples: ['Diabolisch'],
    counterExamples: []
  }),
  'Грибковая инфекция': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Источник угрозы', 'Социальное заражение', 'Поведение угрозы'],
    lanes: ['infection_outbreak_lane'],
    useWhen: 'Грибок, споры, мицелий или грибковая биология являются источником заражения, мутации, агрессии, зомби-подобного состояния или распада контроля.',
    avoidWhen: 'Есть заражение или паразитическая угроза, но грибковая природа не подтверждена.',
    examples: ['Зараза'],
    counterExamples: []
  }),
  'Война банд': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['Человеческая динамика', 'Поведение угрозы'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Бандитский конфликт, война группировок или криминальное противостояние создают угрозу, давление, преследование или survival-ситуацию.',
    avoidWhen: 'Криминальный фон есть, но gang-конфликт не влияет на horror-механику.',
    examples: [],
    counterExamples: []
  }),
  'Проявление призрака': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Источник угрозы'],
    lanes: ['supernatural_entity_lane'],
    useWhen: 'Призрак проявляется как видимое/ощутимое присутствие, но не обязательно захватывает тело или волю персонажа.',
    avoidWhen: 'Призрачная сила именно вселяется или управляет телом — тогда использовать Призрачная одержимость.',
    examples: ['Зеркала. Пожиратели душ', 'Под светом'],
    counterExamples: []
  }),
  'Призрачная одержимость': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Источник угрозы', 'Поведение угрозы', 'Психологическая рана'],
    lanes: ['supernatural_entity_lane', 'psychological_reality_lane'],
    useWhen: 'Призрак или дух умершего захватывает, использует или подменяет тело/волю персонажа.',
    avoidWhen: 'Есть только явление призрака без захвата тела или поведения.',
    examples: ['Полезный призрак', 'Подняться на холм'],
    counterExamples: []
  }),
  'Гигантское существо': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Источник угрозы', 'Поведение угрозы'],
    lanes: ['creature_lane'],
    useWhen: 'Размер существа является важной частью угрозы: гигантский монстр, огромная животная форма или масштабная creature-опасность.',
    avoidWhen: 'Существо просто опасное или хищное, но размер не является отдельной механикой угрозы.',
    examples: ['Анаконды', 'Ящер'],
    counterExamples: []
  }),
  'Травма утраты': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['Психологическая рана'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Утрата, скорбь или незавершённая травма являются рабочим двигателем ужаса, расследования, вины или сверхъестественной связи.',
    avoidWhen: 'Горе упомянуто биографически, но не влияет на механику угрозы или восприятие персонажа.',
    examples: ['Возвращение в Сайлент Хилл', 'Верни меня из мёртвых'],
    counterExamples: []
  }),
  'Групповая паранойя': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['Человеческая динамика', 'Психологическая рана', 'Социальное заражение'],
    lanes: ['psychological_reality_lane', 'survival_containment_lane'],
    useWhen: 'Группа персонажей распадается через недоверие, подозрения, страх заражения, обвинения, скрытую угрозу или невозможность понять, кому верить.',
    avoidWhen: 'Персонажи просто спорят или конфликтуют, но паранойя группы не становится horror-механикой.',
    examples: [],
    counterExamples: []
  }),
  'Групповое выживание': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['Структура выживания', 'Человеческая динамика'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Выживание строится вокруг группы персонажей: их совместных решений, конфликтов, разделения ролей или распада группы под угрозой.',
    avoidWhen: 'В фильме есть несколько персонажей, но групповая динамика не влияет на survival-структуру.',
    examples: ['Монстр', 'Возвращение гремлинов'],
    counterExamples: []
  }),
  'Материализованная вина': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['Психологическая рана', 'Структура реальности'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Вина персонажа проявляется как угроза, видение, преследование, искажение реальности или сверхъестественная расплата.',
    avoidWhen: 'Персонаж просто чувствует вину, но она не материализуется в механике ужаса.',
    examples: [],
    counterExamples: []
  }),
  'Галлюцинации': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Структура реальности', 'Психологическая рана'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Персонаж воспринимает присутствие, фигуру, голос, образ или угрозу, чья реальность намеренно нестабильна или галлюцинаторна.',
    avoidWhen: 'Есть обычный призрак или сущность, объективно существующая в мире фильма.',
    examples: [],
    counterExamples: []
  }),
  'Хэллоуинский сеттинг': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Временной механизм'],
    lanes: [],
    useWhen: 'Хэллоуин, ночь масок, праздничная городская среда или хэллоуинская традиция существенно формируют угрозу, маскировку, охоту или социальный хаос.',
    avoidWhen: 'Хэллоуин упомянут как дата или декор, но не влияет на механику угрозы.',
    examples: [],
    counterExamples: []
  }),
  'Одержимые аниматроники': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Источник угрозы', 'Поведение угрозы'],
    lanes: ['supernatural_entity_lane'],
    useWhen: 'Аниматроники, куклы-механизмы или искусственные фигуры одержимы/населены сверхъестественной силой и являются активной угрозой.',
    avoidWhen: 'Аниматроники просто декорация, роботизированная угроза без сверхъестественного слоя или обычный Кукла-убийца.',
    examples: ['Пять ночей с Фредди 2'],
    counterExamples: []
  }),
  'Одержимый предмет': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Источник угрозы', 'Ритуальный механизм'],
    lanes: ['supernatural_entity_lane', 'ritual_occult_lane'],
    useWhen: 'Предмет населён призраком, сущностью или сверхъестественной силой и сам запускает угрозу/контакт/одержимость.',
    avoidWhen: 'Предмет проклят, но не содержит явного присутствия сущности — тогда чаще подходит Проклятый предмет.',
    examples: ['Верни меня из мёртвых', 'Полезный призрак'],
    counterExamples: []
  }),
  'Домашнее заточение': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['Структура выживания', 'Тип сеттинга'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Дом, квартира, хижина или другое жилище работает как место удержания: персонаж не может свободно выйти или вынужден выживать внутри.',
    avoidWhen: 'Дом просто место действия без механики удержания или невозможности покинуть пространство.',
    examples: ['Игра со смертью', 'Одиночка'],
    counterExamples: []
  }),
  'Вторжение в дом': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_behavior,
    families: ['Поведение угрозы', 'Пространственный механизм'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Угроза проникает в дом/жилище или нарушает границу безопасного пространства изнутри или снаружи.',
    avoidWhen: 'Есть просто домашний сеттинг без вторжения, проникновения или нарушения защитной границы.',
    examples: [],
    counterExamples: []
  }),
  'Дом в осаде': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['Структура выживания', 'Поведение угрозы', 'Тип сеттинга'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Дом или жилище становится осаждённым пространством: персонажи защищаются от внешней угрозы, вторжения или давления.',
    avoidWhen: 'Опасность происходит дома, но нет структуры осады/обороны/давления снаружи.',
    examples: [],
    counterExamples: []
  }),
  'Дом как пространство угрозы': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга'],
    lanes: [],
    useWhen: 'Дом, особняк, хижина или жилое пространство является важной площадкой угрозы, тайны, удержания, вторжения или семейного конфликта.',
    avoidWhen: 'Дом просто место действия без отдельной роли в механике ужаса.',
    examples: ['Игра со смертью', 'Добыча для невесты'],
    counterExamples: []
  }),
  'Охота на людей': createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_behavior,
    families: ['Поведение угрозы', 'Структура преследования', 'Человеческая динамика'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Людей целенаправленно выслеживают, преследуют или используют как добычу в охоте, игре, ритуале или социальной системе насилия.',
    avoidWhen: 'Есть обычное преследование или убийца, но нет структуры охоты на человека как добычу.',
    examples: [],
    counterExamples: []
  }),
  'Человек как монстр': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_behavior,
    families: ['Поведение угрозы', 'Человеческая динамика', 'Психологическая рана'],
    lanes: [],
    useWhen: 'Человеческая жестокость, деградация, садизм, расчеловечивание или моральная монструозность являются основной угрозой.',
    avoidWhen: 'Персонаж просто неприятный, опасный или антагонистичный, но человеческая монструозность не является отдельной механикой ужаса.',
    examples: ['Куколка', 'Протеин'],
    counterExamples: []
  }),
  'Страшная версия знакомого образа': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Переосмысление мифа', 'Нарративная функция'],
    lanes: ['folk_myth_lane'],
    useWhen: 'Фильм переосмысляет узнаваемую культурную, сказочную, праздничную, детскую или поп-икону как хоррор-угрозу.',
    avoidWhen: 'Есть просто знакомый образ или отсылка, но нет хоррор-переосмысления как основной механики.',
    examples: [],
    counterExamples: []
  }),
  'Стирание личности': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Структура реальности', 'Психологическая рана', 'Поведение угрозы'],
    lanes: ['psychological_reality_lane', 'body_identity_lane'],
    useWhen: 'Личность персонажа стирается, подменяется, растворяется или перестаёт быть надёжной частью его существования.',
    avoidWhen: 'Есть обычная амнезия, маскировка или социальная невидимость без механики стирания личности.',
    examples: [],
    counterExamples: []
  }),
  'Инфицированное общество': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.structure,
    families: ['Социальное заражение', 'Человеческая динамика', 'Источник угрозы'],
    lanes: ['infection_outbreak_lane'],
    useWhen: 'Заражение, мутация, эпидемия или постинфекционный порядок меняют общество, группы людей, правила выживания или социальную структуру мира.',
    avoidWhen: 'Есть отдельные заражённые или монстры, но общество/сообщество не перестроено вокруг заражения.',
    examples: ['28 лет спустя: Часть II. Храм костей'],
    counterExamples: []
  }),
  'Инфраструктурный хоррор': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Пространственный механизм', 'Социальное заражение'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Инфраструктура, инженерная система, городская сеть, транспорт, коммуникации или техническая среда становятся рабочей частью угрозы, ловушки, заражения или аномального пространства.',
    avoidWhen: 'Инфраструктура есть только как фон или декорация и не влияет на horror-механику.',
    examples: [],
    counterExamples: []
  }),
  'Самолёт как ловушка': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Структура выживания', 'Пространственный механизм'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Самолёт, авиарейс, кабина или салон в полёте становится замкнутой ловушкой, где невозможность выйти, посадить самолёт или покинуть борт является частью survival-механики.',
    avoidWhen: 'Самолёт используется только как транспорт, короткая завязка, место аварии или фон без устойчивой ловушки во время полёта.',
    examples: ['Паучий рейс'],
    counterExamples: []
  }),
  'Межпоколенческая травма': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['Психологическая рана', 'Человеческая динамика'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Травма, вина, проклятие, насилие или семейная тайна передаются между поколениями и формируют текущую угрозу.',
    avoidWhen: 'Прошлое семьи упомянуто, но межпоколенческая передача травмы или последствий не подтверждена.',
    examples: ['Белдхэм. Проклятие ведьмы'],
    counterExamples: []
  }),
  'Интернет-фольклор': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.investigation_frame,
    families: ['Рамка расследования', 'Переосмысление мифа', 'Социальное заражение'],
    lanes: ['investigation_media_lane', 'folk_myth_lane'],
    useWhen: 'Угроза, легенда, расследование или заражающая идея распространяется через интернет, форумы, соцсети, видео, цифровые следы или сетевой фольклор.',
    avoidWhen: 'Интернет просто используется персонажами как бытовой инструмент и не формирует легенду/расследование/угрозу.',
    examples: ['Project MKHEXE'],
    counterExamples: []
  }),
  'Изолированный дом': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Структура выживания'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Изолированный дом, хижина или удалённое жилище ограничивает помощь, побег, контакт с внешним миром или усиливает удержание.',
    avoidWhen: 'Дом находится отдельно, но изоляция не влияет на угрозу или структуру выживания.',
    examples: ['Одиночка', 'Подняться на холм'],
    counterExamples: []
  }),
  'Изолированный маяк': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Структура выживания'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Маяк или удалённая прибрежная точка работает как изолированное пространство угрозы, памяти, призрачного контакта или выживания.',
    avoidWhen: 'Маяк только обозначен как место, но изоляция не влияет на horror-механику.',
    examples: ['Под светом'],
    counterExamples: []
  }),
  'Изолированный протагонист': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['Структура протагониста', 'Психологическая рана', 'Структура выживания'],
    lanes: ['psychological_reality_lane', 'survival_containment_lane'],
    useWhen: 'Одинокий, отрезанный или социально/пространственно изолированный протагонист несёт основную структуру угрозы, восприятия, расследования или выживания.',
    avoidWhen: 'Персонаж просто главный герой или временно один, но изоляция не влияет на horror-механику.',
    examples: ['Одиночка'],
    counterExamples: []
  }),
  'Изолированная деревня': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Человеческая динамика'],
    lanes: [],
    useWhen: 'Изолированная деревня, посёлок или замкнутое локальное сообщество влияет на угрозу, тайну, культовую структуру или невозможность получить помощь.',
    avoidWhen: 'Деревня просто место действия без изоляции, коллективного давления или скрытой системы.',
    examples: ['Долина улыбок', 'Дневник Рисы'],
    counterExamples: []
  }),
  'Похищение': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['Структура выживания', 'Поведение угрозы', 'Человеческая динамика'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Похищение, удержание или насильственное перемещение персонажа запускает основную угрозу или survival-структуру.',
    avoidWhen: 'Персонажа просто заманили или он оказался в опасности без явной механики похищения/удержания.',
    examples: ['Игра со смертью', 'Куколка'],
    counterExamples: []
  }),
  'Существо-убийца': createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Источник угрозы', 'Поведение угрозы'],
    lanes: ['creature_lane'],
    useWhen: 'Существо работает именно как убийца/нападающая creature-угроза, а не просто как фон, животное или мифологический образ.',
    avoidWhen: 'Достаточно более точного тега: Хищное существо, Гигантское существо, Мифическое существо, Инопланетное существо, Атака акулы, Атака змеи или Атака паука.',
    examples: [],
    counterExamples: []
  }),
  'Кукла-убийца': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Источник угрозы', 'Поведение угрозы'],
    lanes: ['supernatural_entity_lane'],
    useWhen: 'Кукла, манекен, игрушка или искусственная фигура является активной убийственной угрозой.',
    avoidWhen: 'Кукла присутствует как символ, реквизит или психологическая проекция без самостоятельной угрозы.',
    examples: ['Морган: Кукла-убийца'],
    counterExamples: []
  }),
  'Дуэт убийц': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Поведение угрозы', 'Человеческая динамика'],
    lanes: ['slasher_lane'],
    useWhen: 'Угроза строится вокруг пары убийц, дуэта преследователей или двух согласованно действующих маньяков.',
    avoidWhen: 'В фильме просто несколько убийц или соучастников, но дуэт не является устойчивой структурой угрозы.',
    examples: ['Пункт назначения: Новый аттракцион'],
    counterExamples: []
  }),
  'Санта-убийца': createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Поведение угрозы', 'Временной механизм'],
    lanes: ['slasher_lane'],
    useWhen: 'Убийца использует образ Санты, рождественского карателя или праздничной маски как центральную механику угрозы.',
    avoidWhen: 'Есть просто рождественский сеттинг без убийцы-Санты или без работы образа как угрозы.',
    examples: ['Тихая ночь, смертельная ночь'],
    counterExamples: []
  }),
  'Лиминальное пространство': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Пространственный механизм', 'Структура реальности'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Лиминальное, переходное, пустое, повторяющееся или неустойчивое пространство является активной частью тревоги, петли, заблуждения или нарушения реальности.',
    avoidWhen: 'Локация просто выглядит странной или пустой, но не работает как пространственная механика.',
    examples: ['Выход 8'],
    counterExamples: []
  }),
  'Продление жизни': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Ритуальный механизм', 'Нарративная функция', 'Поведение угрозы'],
    lanes: ['ritual_occult_lane'],
    useWhen: 'Продление жизни, омоложение, бессмертие или сохранение тела/сознания является целью угрозы, ритуала, эксперимента или эксплуатации жертв.',
    avoidWhen: 'Персонаж просто стар, болен или боится смерти, но продление жизни не является рабочей механикой.',
    examples: ['Они придут за тобой'],
    counterExamples: []
  }),
  'Убийца в маске': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Поведение угрозы'],
    lanes: ['slasher_lane'],
    useWhen: 'Угроза устойчиво считывается как масочный убийца или масочная фигура преследования.',
    avoidWhen: 'Маска есть только как разовый визуальный элемент и не определяет механику угрозы.',
    examples: ['Крик 7', 'Незнакомцы: Часть третья'],
    counterExamples: []
  }),
  'Материнский хоррор': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['Психологическая рана', 'Человеческая динамика'],
    lanes: ['body_identity_lane', 'psychological_reality_lane'],
    useWhen: 'Материнство, беременность, утрата ребёнка, родительская вина или материнская идентичность являются центральной механикой ужаса.',
    avoidWhen: 'Мать или ребёнок есть в сюжете, но материнская тема не формирует угрозу, травму или телесно-психологическую механику.',
    examples: ['Кожа к коже', 'Рождённый из грязи'],
    counterExamples: []
  }),
  'Медиа-расследование': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.investigation_frame,
    families: ['Рамка расследования'],
    lanes: ['investigation_media_lane'],
    useWhen: 'Расследование строится через медиа-материалы, записи, съёмки, журналистику, онлайн-следы или найденные свидетельства.',
    avoidWhen: 'Персонажи просто смотрят видео/фото, но медиа не являются структурой расследования.',
    examples: ['Не подглядывай', 'Шелби Оукс. Город-призрак'],
    counterExamples: []
  }),
  'Психический срыв': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['Психологическая рана', 'Структура реальности'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Психический распад персонажа является рабочей частью угрозы, восприятия, расследования или разрушения реальности.',
    avoidWhen: 'Персонаж просто напуган, подавлен или ведёт себя странно без устойчивой механики распада.',
    examples: ['Одиночка'],
    counterExamples: []
  }),
  'Психическое заболевание': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['Психологическая рана'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Психическое состояние или диагноз персонажа является важной частью конфликта, восприятия угрозы или социальной изоляции.',
    avoidWhen: 'Психическое состояние используется только как поверхностная характеристика или стигматизирующая деталь без механики.',
    examples: [],
    counterExamples: []
  }),
  'Эксперимент контроля сознания': createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Конспирологический механизм', 'Структура реальности', 'Поведение угрозы'],
    lanes: ['psychological_reality_lane', 'investigation_media_lane'],
    useWhen: 'Контроль сознания, поведенческое программирование, психоэксперимент или вмешательство в волю персонажа является центральной механикой угрозы.',
    avoidWhen: 'Есть обычная манипуляция, внушение или давление без подтверждённой экспериментальной/системной механики контроля сознания.',
    examples: ['Project MKHEXE'],
    counterExamples: []
  }),
  'Утрата родителя': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['Человеческая динамика', 'Психологическая рана', 'Рамка расследования'],
    lanes: ['investigation_media_lane', 'psychological_reality_lane'],
    useWhen: 'Отсутствующий, исчезнувший, умерший или недоступный родитель является важной причиной расследования, травмы, семейного конфликта или сверхъестественной связи.',
    avoidWhen: 'Родитель просто не показан в фильме и его отсутствие не влияет на механику ужаса.',
    examples: [],
    counterExamples: []
  }),
  'Расследование пропажи': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.investigation_frame,
    families: ['Рамка расследования', 'Психологическая рана', 'Нарративная функция'],
    lanes: ['investigation_media_lane'],
    useWhen: 'Поиск пропавшего человека, выяснение обстоятельств исчезновения или следы исчезнувшего персонажа являются двигателем расследования и раскрытия угрозы.',
    avoidWhen: 'Персонаж отсутствует или умер, но расследование исчезновения не является сюжетной рамкой.',
    examples: ['Project MKHEXE', 'Дневник Рисы'],
    counterExamples: []
  }),
  'Моральное испытание': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Нарративная функция', 'Психологическая рана', 'Ритуальный механизм'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Персонажи поставлены перед моральным выбором, испытанием, проверкой вины, жертвой или решением с ценой, и это является структурой ужаса.',
    avoidWhen: 'У персонажа просто есть сложное решение, но оно не формирует horror-механику или систему наказания.',
    examples: [],
    counterExamples: []
  }),
  'Горная глушь': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Структура выживания'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Горы, дикая местность, удалённая тропа или wilderness-пространство ограничивают помощь, передвижение, спасение или усиливают creature/survival-угрозу.',
    avoidWhen: 'Горный или природный фон не влияет на выживание, изоляцию или угрозу.',
    examples: ['Йети'],
    counterExamples: []
  }),
  'Существо-мутант': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Источник угрозы', 'Поведение угрозы'],
    lanes: ['creature_lane'],
    useWhen: 'Существо является результатом мутации, загрязнения, эксперимента, биологического сбоя или деформированной природы.',
    avoidWhen: 'Существо просто монструозное, но мутационная природа не подтверждена.',
    examples: [],
    counterExamples: []
  }),
  'Сообщество мутантов': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.structure,
    families: ['Социальное заражение', 'Источник угрозы', 'Человеческая динамика'],
    lanes: ['infection_outbreak_lane'],
    useWhen: 'Мутанты, изменённые люди или постмутационное сообщество формируют социальную систему, угрозу, новый порядок или структуру выживания.',
    avoidWhen: 'Есть отдельное мутантное существо, но нет общества, группы или изменённой социальной структуры.',
    examples: [],
    counterExamples: []
  }),
  'Переосмысление мифа': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Переосмысление мифа', 'Нарративная функция'],
    lanes: ['folk_myth_lane'],
    useWhen: 'Фильм переосмысляет миф, легенду, сказку, фольклорный сюжет или культурный образ как работающую хоррор-механику.',
    avoidWhen: 'Есть только визуальная или маркетинговая отсылка к мифу без реального переосмысления в механике ужаса.',
    examples: [],
    counterExamples: []
  }),
  'Мифическое существо': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Источник угрозы', 'Переосмысление мифа'],
    lanes: ['creature_lane', 'folk_myth_lane'],
    useWhen: 'Угроза основана на мифическом, легендарном, фольклорном или криптидном существе.',
    avoidWhen: 'Существо просто неизвестное/монструозное, но мифологическая или фольклорная природа не подтверждена.',
    examples: ['Йети', 'Остров хищника'],
    counterExamples: []
  }),
  'Офис как пространство угрозы': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга'],
    lanes: [],
    useWhen: 'Офис, рабочее пространство или корпоративная среда является значимой площадкой угрозы, ловушки, убийств или социальной сатиры.',
    avoidWhen: 'Офис появляется как бытовой фон и не влияет на механику ужаса.',
    examples: ['Канун нового страха'],
    counterExamples: []
  }),
  'Оккультная книга': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.investigation_frame,
    families: ['Рамка расследования', 'Ритуальный механизм'],
    lanes: ['investigation_media_lane', 'ritual_occult_lane'],
    useWhen: 'Книга, дневник, манускрипт, текст, инструкция или архивный источник раскрывает/запускает оккультную механику угрозы.',
    avoidWhen: 'Книга просто реквизит или источник справочной информации без роли в угрозе/ритуале.',
    examples: [],
    counterExamples: []
  }),
  'Оккультный ритуал': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Ритуальный механизм'],
    lanes: ['ritual_occult_lane'],
    useWhen: 'Ритуал является рабочей причиной угрозы, проклятия, призыва, сделки, жертвоприношения или сверхъестественного эффекта.',
    avoidWhen: 'Есть только оккультная эстетика, символы или разговоры о ритуале без подтверждённой механики.',
    examples: ['Они придут за тобой', 'Анаконды'],
    counterExamples: []
  }),
  'Оккультная сделка': createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Ритуальный механизм', 'Нарративная функция'],
    lanes: ['ritual_occult_lane'],
    useWhen: 'Есть явно подтверждённая сделка, обмен, контракт или цена за сверхъестественный результат.',
    avoidWhen: 'Есть просто ритуал, проклятие, ведьмовство или оккультная практика без механики сделки.',
    examples: ['Проклятые'],
    counterExamples: ['Астрал. Школа кошмаров']
  }),
  'Выжить до утра': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['Структура выживания', 'Временной механизм'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Основная угроза и выживание сжаты в одну ночь, смену, праздник или короткий временной отрезок с нарастающим давлением.',
    avoidWhen: 'Действие просто происходит ночью, но временное сжатие не является структурой survival-механики.',
    examples: ['Они придут за тобой', 'Я иду искать 2'],
    counterExamples: []
  }),
  'Обсессивно-компульсивное поведение': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['Психологическая рана', 'Человеческая динамика'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Навязчивое, компульсивное или ритуализированное поведение персонажа влияет на угрозу, восприятие, конфликт или изоляцию.',
    avoidWhen: 'Поведенческая особенность упомянута поверхностно и не влияет на механику ужаса.',
    examples: ['Нечто из унитаза'],
    counterExamples: []
  }),
  'Медиа как канал угрозы': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.investigation_frame,
    families: ['Рамка расследования', 'Источник угрозы'],
    lanes: ['investigation_media_lane', 'supernatural_entity_lane'],
    useWhen: 'Медиа-материал, запись, съёмка, трансляция, плёнка, фото или цифровой след содержит/передаёт паранормальную угрозу или контакт.',
    avoidWhen: 'Медиа используется только как формат фильма или обычный способ документирования без паранормального слоя.',
    examples: ['Дневник Рисы'],
    counterExamples: []
  }),
  'Пара родитель-ребёнок': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['Человеческая динамика', 'Психологическая рана'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Связка родитель–ребёнок является важной механикой угрозы, защиты, вины, утраты, одержимости, контроля или семейной травмы.',
    avoidWhen: 'Родитель и ребёнок просто присутствуют в сюжете, но их связь не влияет на horror-механику.',
    examples: ['Белдхэм. Проклятие ведьмы', 'Рождённый из грязи'],
    counterExamples: []
  }),
  'Пиратский сеттинг': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Переосмысление мифа'],
    lanes: ['folk_myth_lane'],
    useWhen: 'Пиратская, морская-разбойничья или проклятая корабельная среда является значимой частью угрозы, мифа, проклятия или survival-структуры.',
    avoidWhen: 'Пиратская эстетика есть только как костюм, декор или фон.',
    examples: ['Капитан Крюк: Проклятые берега'],
    counterExamples: []
  }),
  'Канализация / трубы как угроза': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Пространственный механизм'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Сантехника, трубы, канализация, туалет, слив или бытовая инженерная система становятся источником угрозы, вторжения, заражения или аномального пространства.',
    avoidWhen: 'Сантехника используется только как бытовая деталь или gag без horror-механики.',
    examples: ['Нечто из унитаза'],
    counterExamples: []
  }),
  'Постапокалиптическое выживание': createCanonTagMeta({
    tier: "standard",
    confidence: "provisional",
    status: CANON_TAG_STATUSES.provisional,
    role: CANON_TAG_ROLES.structure,
    families: ['Структура выживания', 'Социальное заражение'],
    lanes: ['survival_containment_lane', 'infection_outbreak_lane'],
    useWhen: 'Выживание происходит после катастрофы, вспышки, распада общества или массового заражения, и новый порядок мира влияет на угрозу.',
    avoidWhen: 'Есть заражение или катастрофа, но мир ещё не перешёл в постапокалиптическую survival-структуру.',
    examples: [],
    counterExamples: []
  }),
  'Пранк-хоррор': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Нарративная функция', 'Поведение угрозы', 'Социальное заражение'],
    lanes: [],
    useWhen: 'Розыгрыш, постановочная провокация, prank-культура или записываемая манипуляция запускают угрозу, эскалацию насилия или раскрытие человеческой монструозности.',
    avoidWhen: 'Есть юмор, обман или видеоформат, но prank не является причиной horror-механики.',
    examples: ['Милк и сериал'],
    counterExamples: []
  }),
  'Хищное существо': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Источник угрозы', 'Поведение угрозы'],
    lanes: ['creature_lane'],
    useWhen: 'Центральная угроза фильма — хищное существо, монстр или животная угроза, охотящаяся на персонажей.',
    avoidWhen: 'Существо присутствует эпизодически или не является основной механикой угрозы.',
    examples: ['Анаконды', 'Йети', 'Остров хищника'],
    counterExamples: []
  }),
  'Протагонист-убийца': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Поведение угрозы', 'Структура протагониста', 'Психологическая рана'],
    lanes: ['slasher_lane', 'psychological_reality_lane'],
    useWhen: 'Главный персонаж сам является убийцей, становится центральной угрозой или фильм устроен через его превращение/раскрытие как killer-фигуры.',
    avoidWhen: 'Протагонист просто совершает насилие в самообороне или морально неоднозначен, но не является horror-угрозой.',
    examples: ['Тихая ночь, смертельная ночь'],
    counterExamples: []
  }),
  'Заражение бешенством': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Источник угрозы', 'Поведение угрозы', 'Социальное заражение'],
    lanes: ['creature_lane', 'infection_outbreak_lane'],
    useWhen: 'Угроза связана с бешенством, животным заражением или инфекционной агрессией, которая меняет поведение существ/людей.',
    avoidWhen: 'Есть обычное нападение животного или creature-угроза без инфекционной механики.',
    examples: [],
    counterExamples: []
  }),
  'Вторжение иной реальности': createCanonTagMeta({
    tier: "standard",
    confidence: "provisional",
    status: CANON_TAG_STATUSES.provisional,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Структура реальности', 'Источник угрозы'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Иная реальность, вымышленный слой, медиа-образ, сон, симуляция или альтернативный пласт мира вторгается в обычную реальность персонажей.',
    avoidWhen: 'Реальность просто искажена субъективно — тогда чаще подходит Искажённая реальность, Галлюцинации или Альтернативное измерение.',
    examples: [],
    counterExamples: []
  }),
  'Религиозный фундаментализм': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['Человеческая динамика', 'Социальное заражение', 'Ритуальный механизм'],
    lanes: ['ritual_occult_lane'],
    useWhen: 'Религиозная догма, фанатизм или фундаменталистская община прямо формируют угрозу, наказание, давление или ритуальную систему.',
    avoidWhen: 'В фильме есть религиозная символика или священник, но религиозная система не является механизмом ужаса.',
    examples: ['Райский сад', 'Спаситель'],
    counterExamples: []
  }),
  'Спасательная миссия': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['Нарративная функция', 'Структура выживания'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Сюжетная цель персонажей — найти, вытащить, спасти или эвакуировать кого-то из опасного пространства/ситуации.',
    avoidWhen: 'Персонажи просто пытаются выжить сами, без отдельной спасательной задачи.',
    examples: ['Они придут за тобой'],
    counterExamples: []
  }),
  'Правило расплаты': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Ритуальный механизм', 'Нарративная функция', 'Психологическая рана'],
    lanes: ['ritual_occult_lane'],
    useWhen: 'Ужас работает как наказание по правилу, греху, нарушению запрета, сделке или моральному долгу.',
    avoidWhen: 'Есть насилие, жертвоприношение или проклятие, но нет логики наказания/испытания.',
    examples: ['Райский сад'],
    counterExamples: []
  }),
  'Мстительный призрак': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Источник угрозы', 'Нарративная функция', 'Психологическая рана'],
    lanes: ['supernatural_entity_lane', 'psychological_reality_lane'],
    useWhen: 'Призрак или дух умершего возвращается как мстящая сила, связанная с прошлой несправедливостью, преступлением или травмой.',
    avoidWhen: 'Есть обычное проявление призрака или призрачная одержимость без мотива мести.',
    examples: ['Затвор', 'Астрал. Амулет зла'],
    counterExamples: []
  }),
  'Месть как структура угрозы': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['Нарративная функция', 'Поведение угрозы', 'Психологическая рана'],
    lanes: ['slasher_lane'],
    useWhen: 'Месть, возмездие или целенаправленное наказание виновных является движущей структурой угрозы, убийств или преследования.',
    avoidWhen: 'Персонаж просто злится или у антагониста есть обида, но revenge-структура не ведёт сюжет.',
    examples: [],
    counterExamples: []
  }),
  'Восставший убийца': createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Источник угрозы', 'Поведение угрозы', 'Нарративная функция'],
    lanes: ['slasher_lane', 'supernatural_entity_lane'],
    useWhen: 'Убийца возвращается из смерти, действует как оживший мститель, revenant-фигура или сверхъестественный каратель.',
    avoidWhen: 'Есть серийный убийца, месть как структура угрозы или мстительный призрак без физической killer-фигуры revenant-типа.',
    examples: ['Священник: Резня в День благодарения'],
    counterExamples: []
  }),
  'Опасный маршрут': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Пространственный механизм'],
    lanes: [],
    useWhen: 'Дорога, маршрут, поездка или невозможность съехать с пути формируют структуру угрозы, петли, преследования или заблуждения.',
    avoidWhen: 'Дорога используется только как проходная локация без влияния на horror-механику.',
    examples: ['Всё заканчивается'],
    counterExamples: []
  }),
  'Романтическая пара': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['Человеческая динамика', 'Психологическая рана'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Пара, брак, романтическая связь или разрушающиеся отношения являются важной рамкой угрозы, изоляции, зависимости, ревности или выживания.',
    avoidWhen: 'Романтическая линия есть, но не влияет на horror-механику.',
    examples: [],
    counterExamples: []
  }),
  'Придорожный мотель': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Структура выживания'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Придорожный мотель, временное убежище у дороги или изолированная ночлежка становится местом ловушки, нападения, тайны или удержания.',
    avoidWhen: 'Мотель просто короткая остановка без horror-механики.',
    examples: [],
    counterExamples: []
  }),
  'Руины как пространство угрозы': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Рамка расследования'],
    lanes: ['investigation_media_lane'],
    useWhen: 'Руины, древнее сооружение, разрушенное место или археологическое пространство являются значимой точкой угрозы, проклятия, расследования или фольклорного контакта.',
    avoidWhen: 'Руины присутствуют только как атмосферный фон.',
    examples: [],
    counterExamples: []
  }),
  'Жертвенные убийства': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Ритуальный механизм', 'Поведение угрозы'],
    lanes: ['ritual_occult_lane'],
    useWhen: 'Убийства или жертвы совершаются как часть ритуала, призыва, продления жизни, сделки, культа или сверхъестественного механизма.',
    avoidWhen: 'В фильме просто много убийств или gore, но убийства не являются жертвоприношением.',
    examples: ['Они придут за тобой', 'Они были ведьмами'],
    counterExamples: []
  }),
  'Садистское удержание': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Поведение угрозы', 'Человеческая динамика', 'Структура выживания'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Угроза строится вокруг похитителя/мучителя/надзирателя, который удерживает, ломает, воспитывает, пытает или контролирует жертву.',
    avoidWhen: 'Есть похищение, но личность похитителя не является садистской управляющей угрозой.',
    examples: ['Куколка'],
    counterExamples: []
  }),
  'Школа как пространство угрозы': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Человеческая динамика'],
    lanes: [],
    useWhen: 'Школа, учебное пространство или образовательная среда влияет на угрозу, травму, буллинг, социальное давление или сверхъестественный конфликт.',
    avoidWhen: 'Школа просто фоновая локация и не влияет на механику ужаса.',
    examples: ['Астрал. Школа кошмаров', 'Уиджа. Шёпоты мёртвых'],
    counterExamples: []
  }),
  'Скандинавский сеттинг': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга'],
    lanes: [],
    useWhen: 'Скандинавская, северная или нордическая среда заметно влияет на фольклорный, природный, изоляционный или социальный слой ужаса.',
    avoidWhen: 'Страна производства скандинавская, но сама среда не имеет значения для horror-механики.',
    examples: [],
    counterExamples: []
  }),
  'Пугало-убийца': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Поведение угрозы', 'Тип сеттинга', 'Переосмысление мифа'],
    lanes: ['slasher_lane', 'folk_myth_lane'],
    useWhen: 'Пугало, чучело, scarecrow-костюм или ожившая scarecrow-фигура является устойчивой идентичностью убийцы, монстра или центральной угрозы.',
    avoidWhen: 'Пугало присутствует только как декор, постерный образ, разовый scarecrow-jumpscare или хэллоуинский реквизит без роли в механике угрозы.',
    examples: ['Die’ced: Reloaded'],
    counterExamples: []
  }),
  'Научно созданное существо': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Источник угрозы', 'Поведение угрозы'],
    lanes: ['creature_lane'],
    useWhen: 'Существо создано, изменено или высвобождено научным экспериментом, лабораторией, технологией или исследованием.',
    avoidWhen: 'В фильме есть научный эксперимент, но сама угроза не является существом.',
    examples: [],
    counterExamples: []
  }),
  'Научный эксперимент': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Источник угрозы', 'Нарративная функция'],
    lanes: [],
    useWhen: 'Научный эксперимент, лабораторное исследование, технологическое вмешательство или исследовательская ошибка запускают угрозу.',
    avoidWhen: 'Наука, лаборатория или учёные есть в сеттинге, но эксперимент не является причиной horror-механики.',
    examples: ['Diabolisch'],
    counterExamples: []
  }),
  'Дайвер-убийца': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Поведение угрозы', 'Тип сеттинга'],
    lanes: ['slasher_lane'],
    useWhen: 'Убийца устойчиво связан с водолазным/подводным образом, снаряжением, каналами, водой или специфической aquatic-slasher угрозой.',
    avoidWhen: 'В фильме есть вода или подводная сцена, но killer-фигура не определяется scuba/aquatic-механикой.',
    examples: ['Амстердамский кошмар 2'],
    counterExamples: []
  }),
  'Серийный убийца': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Поведение угрозы'],
    lanes: ['slasher_lane'],
    useWhen: 'Угроза строится вокруг повторяющегося убийцы или серии убийств, а не одного случайного нападения.',
    avoidWhen: 'Есть масочный убийца или насильник, но нет серийной структуры убийств.',
    examples: ['Крик 7', 'Незнакомцы: Часть третья'],
    counterExamples: ['Куколка']
  }),
  'Атака акулы': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Поведение угрозы', 'Тип сеттинга'],
    lanes: ['creature_lane', 'survival_containment_lane'],
    useWhen: 'Акула является центральной физической угрозой или основной животной угрозой фильма.',
    avoidWhen: 'Акула присутствует только эпизодически, метафорически или как часть более широкой creature-системы без фокуса на нападении акулы.',
    examples: ['Отмель', 'Акула-мумия'],
    counterExamples: []
  }),
  'Больной ребёнок': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['Психологическая рана', 'Человеческая динамика'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Болезнь ребёнка является важной мотивацией, источником вины, страха, ритуала, сделки, защиты или морального давления.',
    avoidWhen: 'Ребёнок болен только как бытовая деталь и это не влияет на угрозу.',
    examples: [],
    counterExamples: []
  }),
  'Больной брат / сестра': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['Психологическая рана', 'Человеческая динамика'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Болезнь брата или сестры влияет на мотивацию, вину, семейный конфликт, ритуал, сделку или готовность персонажа идти на риск.',
    avoidWhen: 'Болезнь родственника упомянута, но не влияет на horror-механику.',
    examples: [],
    counterExamples: []
  }),
  'Отношения братьев/сестёр': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['Человеческая динамика', 'Психологическая рана'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Связка брат/сестра является важной механикой защиты, вины, травмы, поиска, жертвы, зависимости или семейного конфликта.',
    avoidWhen: 'У персонажа просто есть брат или сестра, но эта связь не влияет на угрозу.',
    examples: [],
    counterExamples: []
  }),
  'Горнолыжный курорт': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Структура выживания'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Горнолыжный курорт, зимняя база или снежная туристическая зона формирует изоляцию, опасность среды, creature-угрозу или структуру выживания.',
    avoidWhen: 'Курорт просто обозначен как фон без влияния на угрозу.',
    examples: ['Возвращение гремлинов'],
    counterExamples: []
  }),
  'Тайна маленького города': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.investigation_frame,
    families: ['Рамка расследования', 'Человеческая динамика'],
    lanes: ['investigation_media_lane'],
    useWhen: 'Маленький город, деревня или закрытое сообщество скрывает тайну, преступление, культовую практику, исчезновение или источник угрозы.',
    avoidWhen: 'Маленький город просто место действия без тайны, заговора или расследовательского слоя.',
    examples: [],
    counterExamples: []
  }),
  'Атака змеи': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Поведение угрозы', 'Тип сеттинга'],
    lanes: ['creature_lane', 'survival_containment_lane'],
    useWhen: 'Змея, змеи или змеиное существо являются центральной физической угрозой фильма.',
    avoidWhen: 'Змея присутствует только как символ, эпизод или часть общего ритуального/мифологического образа.',
    examples: ['Анаконды'],
    counterExamples: []
  }),
  'Атака паука': createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Поведение угрозы', 'Тип сеттинга'],
    lanes: ['creature_lane', 'survival_containment_lane'],
    useWhen: 'Паук, пауки, гигантские пауки, мутировавшие или экспериментальные пауки являются центральной физической угрозой фильма.',
    avoidWhen: 'Паук присутствует только как символ, фобийный эпизод, декор, единичный скример или часть более широкой creature-системы без фокуса на паучьей атаке.',
    examples: ['Паучий рейс'],
    counterExamples: []
  }),
  'Снежная изоляция': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Структура выживания'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Снег, холод, горы, метель или зимняя изоляция ограничивают движение, спасение или выживание персонажей.',
    avoidWhen: 'Зимний сеттинг есть только как фон и не влияет на угрозу или survival-структуру.',
    examples: ['Возвращение гремлинов'],
    counterExamples: []
  }),
  'Перформанс в соцсетях': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Человеческая динамика', 'Рамка расследования', 'Социальное заражение'],
    lanes: ['investigation_media_lane'],
    useWhen: 'Соцсети, стриминг, блогинг, лайвы, публичный образ или онлайн-перформанс запускают угрозу, насилие, манипуляцию или социальное заражение.',
    avoidWhen: 'Персонажи просто пользуются соцсетями, но онлайн-перформанс не является horror-механикой.',
    examples: [],
    counterExamples: []
  }),
  'Одержимость социальным статусом': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['Психологическая рана', 'Человеческая динамика', 'Социальное заражение'],
    lanes: ['psychological_reality_lane', 'body_identity_lane'],
    useWhen: 'Одержимость статусом, признанием, красотой, нормой или социальной успешностью запускает трансформацию, насилие, утрату себя или психологический распад.',
    avoidWhen: 'Социальный статус просто важен персонажу, но не становится механизмом ужаса.',
    examples: ['Отклонение'],
    counterExamples: []
  }),
  'Пространственная петля': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Структура реальности', 'Пространственный механизм'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Пространство зациклено, повторяется, не выпускает персонажа или нарушает обычную географию как самостоятельная механика угрозы.',
    avoidWhen: 'Персонаж просто заблудился, но пространство не работает как петля или аномальная структура.',
    examples: ['Выход 8'],
    counterExamples: []
  }),
  'Распространяющееся заражение': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Социальное заражение', 'Источник угрозы', 'Поведение угрозы'],
    lanes: ['infection_outbreak_lane'],
    useWhen: 'Угроза распространяется через заражение, контакт, среду, вещество, тело, воздух, объект или цепочку передачи.',
    avoidWhen: 'Опасность существует локально и не имеет механики распространения.',
    examples: ['Зараза', 'Кровавый сарай'],
    counterExamples: []
  }),
  'Постановочная смерть': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Нарративная функция', 'Поведение угрозы'],
    lanes: [],
    useWhen: 'Смерть, убийство или тело инсценируются, подделываются или используются как часть манипуляции, расследования, мести или угрозы.',
    avoidWhen: 'Есть просто смерть персонажа без инсценировки или обмана вокруг неё.',
    examples: ['Морган: Кукла-убийца'],
    counterExamples: []
  }),
  'Метро как пространство угрозы': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Пространственный механизм'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Метро, переход, станция или подземный транспорт работает как лиминальное, повторяющееся, замкнутое или аномальное пространство.',
    avoidWhen: 'Метро просто транспортная локация без пространственной механики ужаса.',
    examples: ['Выход 8'],
    counterExamples: []
  }),
  'Сверхъестественное влияние': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Источник угрозы', 'Психологическая рана'],
    lanes: ['supernatural_entity_lane', 'psychological_reality_lane'],
    useWhen: 'Сверхъестественная сила заметно влияет на поведение, восприятие, решения или психику персонажа, но не оформлена как полноценная одержимость.',
    avoidWhen: 'Есть явная одержимость телом/волей — тогда использовать Демоническая одержимость, Призрачная одержимость или Одержимость сущностью.',
    examples: ['Одиночка', 'Тихая ночь, смертельная ночь'],
    counterExamples: []
  }),
  'Сверхъестественный убийца': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Источник угрозы', 'Поведение угрозы'],
    lanes: ['slasher_lane', 'supernatural_entity_lane'],
    useWhen: 'Убийца действует как сверхъестественная killer-фигура: не просто человек, а сущность, проклятый убийца, магический каратель или неестественно живучая угроза.',
    avoidWhen: 'Есть убийца в маске или серийный убийца без подтверждённой сверхъестественной природы.',
    examples: ['Джестер 2'],
    counterExamples: []
  }),
  'Терминальная болезнь': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['Психологическая рана', 'Нарративная функция'],
    lanes: ['psychological_reality_lane', 'ritual_occult_lane'],
    useWhen: 'Смертельная болезнь, неизлечимое состояние или близость смерти мотивируют ритуал, сделку, эксперимент, распад или моральный выбор.',
    avoidWhen: 'Болезнь упомянута биографически, но не влияет на угрозу или мотивацию.',
    examples: ['Проклятые'],
    counterExamples: []
  }),
  'Театр как пространство угрозы': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга'],
    lanes: [],
    useWhen: 'Театр, сцена, зал, репетиционное или перформативное пространство влияет на угрозу, ловушку, ритуал или убийства.',
    avoidWhen: 'Театр только упоминается или используется как фон без роли в horror-механике.',
    examples: ['Мертвы к рассвету'],
    counterExamples: []
  }),
  'День благодарения': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Временной механизм'],
    lanes: [],
    useWhen: 'День благодарения, семейный праздник, праздничный ужин или сезонная традиция существенно формируют угрозу, маску, конфликт, сатиру или структуру убийств.',
    avoidWhen: 'День благодарения только обозначен как дата и не влияет на horror-механику.',
    examples: ['Священник: Резня в День благодарения'],
    counterExamples: []
  }),
  'Временная аномалия': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.temporal_mechanism,
    families: ['Временной механизм', 'Структура реальности'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Время смещено, нарушено, перепутано или персонажи оказываются не в своём временном слое.',
    avoidWhen: 'Есть флэшбэки, воспоминания или нелинейный монтаж без реального временного сдвига.',
    examples: ['Diabolisch'],
    counterExamples: []
  }),
  'Временная петля': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.temporal_mechanism,
    families: ['Временной механизм', 'Структура реальности'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'События, день, пространство или смертельная ситуация повторяются циклом, и петля является центральной механикой угрозы.',
    avoidWhen: 'Есть повторяющиеся мотивы или монтажные повторы, но не подтверждённая временная петля.',
    examples: [],
    counterExamples: []
  }),
  'Эксперимент с машиной времени': createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.temporal_mechanism,
    families: ['Временной механизм', 'Структура реальности'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Машина времени, научный временной эксперимент или технологическое вмешательство во время запускают угрозу, петлю, сдвиг или вторжение будущего/прошлого.',
    avoidWhen: 'Есть временной сдвиг без экспериментальной машины/устройства — тогда использовать Временная аномалия или Временная петля.',
    examples: [],
    counterExamples: []
  }),
  'Токсичный родитель': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['Человеческая динамика', 'Психологическая рана', 'Поведение угрозы'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Родительский контроль, насилие, манипуляция, пренебрежение или травматическое воспитание прямо формируют угрозу или психологический распад.',
    avoidWhen: 'Родитель просто строгий, неприятный или конфликтный, но его токсичность не является horror-механикой.',
    examples: [],
    counterExamples: []
  }),
  'Передача смерти': createCanonTagMeta({
    tier: "standard",
    confidence: "provisional",
    status: CANON_TAG_STATUSES.provisional,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Поведение угрозы', 'Нарративная функция', 'Ритуальный механизм'],
    lanes: ['ritual_occult_lane'],
    useWhen: 'Смерть, проклятие, ущерб или фатальное последствие можно перенести на другого человека, тело, жертву или носителя.',
    avoidWhen: 'Есть обычная передача проклятия без механики переноса именно смерти/фатальной расплаты — тогда использовать Передаваемое проклятие.',
    examples: [],
    counterExamples: []
  }),
  'Передаваемое проклятие': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Ритуальный механизм', 'Источник угрозы'],
    lanes: ['ritual_occult_lane', 'supernatural_entity_lane'],
    useWhen: 'Проклятие передаётся от человека к человеку, через объект, действие, контакт, нарушение правила или цепочку событий.',
    avoidWhen: 'Проклятие просто существует, но не имеет механики передачи.',
    examples: ['Свист'],
    counterExamples: []
  }),
  'Убийца, движимый травмой': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Поведение угрозы', 'Психологическая рана'],
    lanes: ['slasher_lane', 'psychological_reality_lane'],
    useWhen: 'Убийца или killer-фигура мотивированы травмой, прошлым насилием, унижением, семейной раной или психическим переломом.',
    avoidWhen: 'У убийцы просто есть бэкстори, но травма не объясняет структуру угрозы или мотив убийств.',
    examples: ['Тихая ночь, смертельная ночь'],
    counterExamples: []
  }),
  'Возвращение травмы': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['Психологическая рана', 'Нарративная функция'],
    lanes: ['slasher_lane', 'psychological_reality_lane'],
    useWhen: 'Прошлая травма возвращается как активная угроза: через нового убийцу, повторение нападения, возвращение преследователя или повторное вскрытие старого насилия.',
    avoidWhen: 'Персонаж просто помнит травму, но она не возвращается как работающая структура угрозы.',
    examples: ['Крик 7', 'Незнакомцы: Часть третья'],
    counterExamples: []
  }),
  'Выживание в ловушке': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['Структура выживания'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Персонажи физически, пространственно или ситуационно заперты в режиме выживания, и невозможность выйти является частью угрозы.',
    avoidWhen: 'Персонажи просто находятся в опасном месте, но могут свободно уйти или структура ловушки не работает.',
    examples: ['Зараза', 'Монстр'],
    counterExamples: []
  }),
  'Трикстерская угроза': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_behavior,
    families: ['Поведение угрозы', 'Нарративная функция'],
    lanes: ['slasher_lane', 'supernatural_entity_lane'],
    useWhen: 'Угроза действует как трикстер: заманивает, испытывает, издевается, нарушает правила, играет с жертвой или превращает насилие в перформативную игру.',
    avoidWhen: 'Убийца просто жестокий или саркастичный, но trickster-логика не является устойчивой механикой угрозы.',
    examples: ['Джестер 2'],
    counterExamples: []
  }),
  'Подземная антиутопия': createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Социальное заражение', 'Структура выживания'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Подземное пространство, бункер, тоннели, нижний город или скрытая инфраструктура работают как замкнутая антиутопическая система выживания, контроля или угрозы.',
    avoidWhen: 'Подземная локация есть, но не формирует отдельную социальную или survival-механику.',
    examples: [],
    counterExamples: []
  }),
  'Вынужденный союз': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.human_dynamics,
    families: ['Человеческая динамика', 'Структура выживания'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Персонажи вынуждены сотрудничать с теми, кому не доверяют, чтобы выжить, расследовать угрозу или временно противостоять большему злу.',
    avoidWhen: 'Персонажи просто спорят или работают вместе без напряжённого вынужденного союза.',
    examples: [],
    counterExamples: []
  }),
  'Неразделённая одержимость': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.psychological_wound,
    families: ['Психологическая рана', 'Человеческая динамика'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Неразделённая любовь, фиксация, ревность или навязчивая привязанность становятся причиной угрозы, насилия, преследования или распада персонажа.',
    avoidWhen: 'Романтическая линия есть, но навязчивая одержимость не является механизмом ужаса.',
    examples: ['Морган: Кукла-убийца'],
    counterExamples: []
  }),
  'Расследование городской легенды': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.investigation_frame,
    families: ['Рамка расследования', 'Переосмысление мифа'],
    lanes: ['investigation_media_lane', 'folk_myth_lane'],
    useWhen: 'Персонажи погружаются в городскую легенду, слух, крипипасту, сетевую историю или локальный миф, и расследование постепенно раскрывает реальную угрозу.',
    avoidWhen: 'Легенда просто упоминается, но нет структуры расследовательского погружения.',
    examples: ['Project MKHEXE'],
    counterExamples: []
  }),
  'Вампир': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Источник угрозы', 'Поведение угрозы', 'Переосмысление мифа'],
    lanes: ['supernatural_entity_lane', 'folk_myth_lane'],
    useWhen: 'Вампир, вампирская сущность, кровососущая угроза или вампиризм являются центральной механикой угрозы.',
    avoidWhen: 'Есть только готическая эстетика, кровь, культовый образ или отсылка к вампирам без реальной вампирской угрозы.',
    examples: ['Дракула'],
    counterExamples: []
  }),
  'Симуляция виртуальной реальности': createCanonTagMeta({
    tier: "anchor",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Структура реальности', 'Пространственный механизм'],
    lanes: ['psychological_reality_lane'],
    useWhen: 'Угроза, пространство или испытание существуют внутри симуляции, виртуальной реальности, цифровой среды или искусственной модели мира.',
    avoidWhen: 'Есть технологии или экраны, но они не создают отдельную симулированную реальность.',
    examples: ['Монстр'],
    counterExamples: []
  }),
  'Военное выживание': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.structure,
    families: ['Структура выживания', 'Человеческая динамика'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Военная обстановка, оккупация, фронт, лагерь или боевой конфликт задают survival-механику и ограничивают действия персонажей.',
    avoidWhen: 'Война присутствует только как исторический фон без survival-структуры.',
    examples: [],
    counterExamples: []
  }),
  'Водные пути': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга'],
    lanes: [],
    useWhen: 'Каналы, реки, водные пути или городская водная среда являются значимой частью угрозы, убийств, преследования или изоляции.',
    avoidWhen: 'Водные пути просто появляются в кадре и не влияют на механику угрозы.',
    examples: ['Амстердамский кошмар 2'],
    counterExamples: []
  }),
  'Свадьба как рамка угрозы': createCanonTagMeta({
    tier: "standard",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.structure,
    families: ['Нарративная функция', 'Человеческая динамика'],
    lanes: [],
    useWhen: 'Свадьба, брачный ритуал, подготовка к свадьбе или семейное торжество являются важной рамкой угрозы, социального давления, ритуала или ловушки.',
    avoidWhen: 'Свадьба только упомянута или служит фоном без влияния на horror-механику.',
    examples: ['Добыча для невесты'],
    counterExamples: []
  }),
  'Расплата за желание': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Ритуальный механизм', 'Нарративная функция'],
    lanes: ['ritual_occult_lane'],
    useWhen: 'Персонаж получает желаемое через сверхъестественное вмешательство, но результат требует платы, жертвы, наказания или необратимой цены.',
    avoidWhen: 'Есть просто желание, молитва или просьба без подтверждённой цены/обмена.',
    examples: ['Райский сад', 'Спаситель'],
    counterExamples: []
  }),
  'Ведьмовство': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.mechanism,
    families: ['Ритуальный механизм', 'Источник угрозы'],
    lanes: ['ritual_occult_lane', 'folk_myth_lane'],
    useWhen: 'Ведьмовство является реальной механикой угрозы, проклятия, ритуала, воздействия или фольклорной силы.',
    avoidWhen: 'Ведьма или ведьмовская эстетика только заявлены в названии/маркетинге, но в механике фильма не подтверждены.',
    examples: ['Гауа', 'Они были ведьмами'],
    counterExamples: []
  }),
  'Хоррор Второй мировой': createCanonTagMeta({
    tier: "standard",
    confidence: "observe",
    status: CANON_TAG_STATUSES.observe,
    role: CANON_TAG_ROLES.setting,
    families: ['Тип сеттинга', 'Человеческая динамика', 'Структура выживания'],
    lanes: ['survival_containment_lane'],
    useWhen: 'Вторая мировая война, оккупация, нацистская угроза, военный эксперимент или военная травма являются значимой частью horror-механики.',
    avoidWhen: 'Война есть только как исторический фон и не влияет на угрозу или структуру выживания.',
    examples: [],
    counterExamples: []
  }),
  'Зомби': createCanonTagMeta({
    tier: "anchor",
    confidence: "stable",
    status: CANON_TAG_STATUSES.stable,
    role: CANON_TAG_ROLES.threat_type,
    families: ['Источник угрозы', 'Поведение угрозы', 'Социальное заражение'],
    lanes: ['infection_outbreak_lane'],
    useWhen: 'Зомби, ожившие мертвецы, инфицированные зомби-подобные тела или мертвецы как массовая/центральная угроза являются реальной механикой фильма.',
    avoidWhen: 'Зомби есть только как образ, шутка, костюм, сон или единичная отсылка без работающей угрозы.',
    examples: ['Зараза', '28 лет спустя: Часть II. Храм костей'],
    counterExamples: []
  })
};

const MODIFIER_WEIGHTS = {
  'Сюрреалистичный': 1.15,
  'Сатирический': 1.3,
  'Гротескный': 1.1,
  'Абсурдистский': 1.1,
  'Мета': 1.25,
  'Параноидальный': 1.05,
  'Грубый физиологический': 1.05,
  'Нагота': 0.7,
  'Клаустрофобный': 1.05,
  'Практические эффекты': 1.0,
  'Эксплуатационный': 1.0,
  'Психологический': 0.95,
  'Кэмповый': 0.95,
  'Чёрный юмор': 1.25,
  'Кровавый': 0.9,
  'Напряжённый': 0.9,
  'Медленное нагнетание': 0.85,
  'Атмосферный': 0.7,
  'Мрачный': 0.7,
  'Экспериментальный': 1.05
};

const BROAD_FAMILY_WEIGHTS = {
  'Источник угрозы': 0.6,
  'Человеческая динамика': 0.6,
  'Тип сеттинга': 0.6,

  'Поведение угрозы': 0.8,
  'Психологическая рана': 0.8,
  'Нарративная функция': 0.8,
  'Ритуальный механизм': 0.8,
  'Структура реальности': 0.8,

  'Рамка расследования': 1.0,
  'Конспирологический механизм': 1.0,
  'Временной механизм': 1.0,
  'Структура выживания': 1.0,
  'Структура преследования': 1.0,
  'Пространственный механизм': 1.0,
  'Переосмысление мифа': 1.0,
  'Структура протагониста': 1.0,
  'Социальное заражение': 1.0
};

const CANON_BROAD_FAMILY_OVERRIDES = {
  'AI-генерация': ['Структура реальности', 'Нарративная функция'],
  'Антологическая связка': ['Нарративная функция'],
  'Тайна прошлого': ['Нарративная функция', 'Рамка расследования'],
  'Обратный отсчёт': ['Временной механизм', 'Нарративная функция'],
  'Жертвы элиты': ['Поведение угрозы', 'Человеческая динамика'],
  'Опасный культ': ['Человеческая динамика', 'Ритуальный механизм', 'Социальное заражение'],
  'Семейная динамика': ['Человеческая динамика'],
  'Групповое выживание': ['Структура выживания', 'Человеческая динамика'],
  'Человек как монстр': ['Поведение угрозы', 'Человеческая динамика'],
  'Страшная версия знакомого образа': ['Переосмысление мифа', 'Нарративная функция'],
  'Изолированный протагонист': ['Структура протагониста'],
  'Продление жизни': ['Ритуальный механизм', 'Нарративная функция'],
  'Моральное испытание': ['Нарративная функция'],
  'Переосмысление мифа': ['Переосмысление мифа'],
  'Оккультная сделка': ['Ритуальный механизм', 'Нарративная функция'],
  'Выжить до утра': ['Структура выживания', 'Временной механизм'],
  'Пранк-хоррор': ['Нарративная функция', 'Поведение угрозы'],
  'Спасательная миссия': ['Нарративная функция', 'Структура выживания'],
  'Месть как структура угрозы': ['Нарративная функция'],
  'Жертвенные убийства': ['Ритуальный механизм', 'Поведение угрозы'],
  'Перформанс в соцсетях': ['Человеческая динамика', 'Рамка расследования'],
  'Возвращение травмы': ['Психологическая рана', 'Нарративная функция'],
  'Вынужденный союз': ['Человеческая динамика'],
  'Расследование городской легенды': ['Рамка расследования', 'Переосмысление мифа'],
  'Расплата за желание': ['Ритуальный механизм', 'Нарративная функция']
};

const CANON_BROAD_FAMILY_RULES = [
  { pattern: /(ritual|occult|witch|magic|curse|sacrificial|religious|wish|trade|punishment)/, families: ['Ритуальный механизм'] },
  { pattern: /(alien|creature|entity|ghost|demonic|demon|zombie|infection|curse|folklore|mythic|witch|supernatural|mutant|scientific|haunted|cursed|revenant|vampire|animatronics)/, families: ['Источник угрозы'] },
  { pattern: /(killer|predat|attack|hunt|captor|pursuit|stalker|monstrosity|cannibalism|possession|transformation|erasure|contamination|infiltration|resurrection)/, families: ['Поведение угрозы'] },
  { pattern: /(survival|trapped|confinement|siege|rescue|isolation|deserted)/, families: ['Структура выживания'] },
  { pattern: /(space|house|village|school|office|park|island|forest|snow|mountain|lighthouse|motel|settlement|wilderness|subway|theater|apartment|barn|road|ruins|waterway|aquatic|bayou|pirate|scandinavian|thanksgiving|christmas|halloween|wedding|boarding|ski|underground)/, families: ['Тип сеттинга'] },
  { pattern: /(family|parent|child|sibling|romantic|relationship|alliance|community|cult_community|gang|toxic|disabled|sick|bully|social|unrequited)/, families: ['Человеческая динамика'] },
  { pattern: /(trauma|grief|guilt|mental|memory|obsession|pressure|status|abuse|breakdown|illness|maternal|childhood)/, families: ['Психологическая рана'] },
  { pattern: /(reality|dimension|loop|body_transfer|distorted|hallucinated|liminal|simulation|time_machine|time_displacement|future_intrusion|dream|memory|identity)/, families: ['Структура реальности'] },
  { pattern: /(time|countdown|christmas|halloween|thanksgiving|future|loop)/, families: ['Временной механизм'] },
  { pattern: /(investigation|media|audio|internet|urban_legend|buried_past|missing_person|paranormal_media|occult_book|small_town_secret)/, families: ['Рамка расследования'] },
  { pattern: /(pursuit|hunt|stalker|enemy)/, families: ['Структура преследования'] },
  { pattern: /(spatial_loop|liminal|infrastructure|plumbing|home_infiltration|subway|alternate_dimension|road_space)/, families: ['Пространственный механизм'] },
  { pattern: /(myth|folklore|legend|icon_reframing|vampire|egyptian)/, families: ['Переосмысление мифа'] },
  { pattern: /(isolated_protagonist|protagonist_killer)/, families: ['Структура протагониста'] },
  { pattern: /(infected_society|group_paranoia|spreading_contamination|assimilation_pressure|cult_community|religious_fundamentalism|social_media)/, families: ['Социальное заражение'] }
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
  'Источник угрозы',
  'Поведение угрозы',
  'Человеческая динамика',
  'Тип сеттинга'
]);

const BROAD_FAMILY_SCORING_WEIGHTS = {
  ...BROAD_FAMILY_WEIGHTS,
  'Источник угрозы': 0.18,
  'Поведение угрозы': 0.28,
  'Человеческая динамика': 0.22,
  'Тип сеттинга': 0.2
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
    perceived: ['Слэшер'],
    canon: [
      'Убийца в маске',
      'Серийный убийца',
      'Сверхъестественный убийца',
      'Дуэт убийц',
      'Санта-убийца',
      'Восставший убийца',
      'Убийца, движимый травмой',
      'Протагонист-убийца',
      'Дайвер-убийца',
      'Пугало-убийца'
    ]
  },
  creature_lane: {
    perceived: ['Монстр-муви', 'Нападение животных'],
    canon: [
      'Хищное существо',
      'Гигантское существо',
      'Существо-мутант',
      'Мифическое существо',
      'Научно созданное существо',
      'Инопланетное существо',
      'Существо-убийца',
      'Противостояние с существом',
      'Атака акулы',
      'Атака змеи',
      'Атака паука'
    ]
  },
  supernatural_entity_lane: {
    perceived: ['Сверхъестественный хоррор', 'Дом с привидениями', 'Одержимость'],
    canon: [
      'Демоническая сущность',
      'Демоническая одержимость',
      'Одержимость сущностью',
      'Призрачная одержимость',
      'Проявление призрака',
      'Мстительный призрак',
      'Одержимый предмет',
      'Одержимые аниматроники',
      'Сверхъестественный убийца',
      'Сверхъестественное влияние',
      'Пробуждённое зло',
      'Экзорцизм',
      'Вампир'
    ]
  },
  ritual_occult_lane: {
    perceived: ['Религиозный хоррор', 'Фолк-хоррор'],
    canon: [
      'Оккультный ритуал',
      'Экзорцизм',
      'Оккультная сделка',
      'Оккультная книга',
      'Ведьмовство',
      'Чёрная магия',
      'Древнее проклятие',
      'Проклятый предмет',
      'Передаваемое проклятие',
      'Расплата за желание',
      'Правило расплаты',
      'Жертвенные убийства',
      'Религиозный фундаментализм',
      'Опасный культ'
    ]
  },
  psychological_reality_lane: {
    perceived: ['Психологический хоррор', 'Мистери-хоррор'],
    canon: [
      'Искажённая реальность',
      'Галлюцинации',
      'Психический срыв',
      'Психическое заболевание',
      'Память как ключ к угрозе',
      'Стирание личности',
      'Перенос сознания',
      'Альтернативное измерение',
      'Симуляция виртуальной реальности',
      'Угроза через сон',
      'Материализованная вина',
      'Травма утраты'
    ]
  },
  survival_containment_lane: {
    perceived: ['Хоррор-выживание', 'Хоррор-катастрофа'],
    canon: [
      'Выживание в ловушке',
      'Домашнее заточение',
      'Дом в осаде',
      'Вторжение в дом',
      'Похищение',
      'Садистское удержание',
      'Преследование',
      'Охота на людей',
      'Групповое выживание',
      'Выжить до утра',
      'Спасательная миссия',
      'Наводнение-катастрофа',
      'Снежная изоляция',
      'Необитаемый остров',
      'Космическая среда',
      'Самолёт как ловушка',
      'Больница как пространство угрозы',
      'Военное выживание',
      'Постапокалиптическое выживание'
    ]
  },
  infection_outbreak_lane: {
    perceived: ['Инфекционный хоррор', 'Зомби-хоррор'],
    canon: [
      'Зомби',
      'Грибковая инфекция',
      'Химическое заражение',
      'Заражение бешенством',
      'Распространяющееся заражение',
      'Инфицированное общество'
    ]
  },
  investigation_media_lane: {
    perceived: ['Мистери-хоррор', 'Конспирологический хоррор'],
    canon: [
      'Медиа-расследование',
      'Медиа как канал угрозы',
      'Аудиоконтакт',
      'Интернет-фольклор',
      'Расследование городской легенды',
      'Расследование пропажи',
      'Тайна маленького города',
      'Тайна прошлого',
      'Эксперимент контроля сознания'
    ],
    formats: ['Найденная плёнка', 'Псевдодокументальный', 'Гибридное повествование']
  },
  folk_myth_lane: {
    perceived: ['Фолк-хоррор'],
    canon: [
      'Фольклорная сущность',
      'Мифическое существо',
      'Переосмысление мифа',
      'Страшная версия знакомого образа',
      'Вампир',
      'Египетская тема'
    ]
  },
  body_identity_lane: {
    perceived: ['Боди-хоррор'],
    canon: [
      'Телесная трансформация',
      'Перенос сознания',
      'Стирание личности',
      'Материнский хоррор',
      'Утрата себя под давлением'
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
  'Найденная плёнка': 1.2,
  'Псевдодокументальный': 1.15,
  'Гибридное повествование': 1.0,
  'Антология': 1.1,
  'Немой фильм': 1.15
};

const EXTRA_GENRE_WEIGHTS = {
  "Боевик": 0.6,
  "Детектив": 0.9,
  "Драма": 0.5,
  "Комедия": 1.25,
  "Криминал": 0.9,
  "Мелодрама": 0.7,
  "Мюзикл": 1.1,
  "Приключения": 0.7,
  "Триллер": 0.7,
  "Фантастика": 1.0,
  "Фэнтези": 1.0
};

const COMEDY_TONE_MODIFIERS = [
  'Сатирический',
  'Чёрный юмор',
  'Мета'
];

function getMovieComedyToneScore(movie) {
  const genres = Array.isArray(movie?.extraGenres) ? movie.extraGenres : [];
  const modifiers = Array.isArray(movie?.modifiers) ? movie.modifiers : [];

  let score = genres.includes('Комедия') ? 1.25 : 0;

  COMEDY_TONE_MODIFIERS.forEach(modifier => {
    if (modifiers.includes(modifier)) {
      score += MODIFIER_WEIGHTS[modifier] || 1;
    }
  });

  return score;
}

function getComedyToneMultiplier(movieA, movieB) {
  const movieAScore = getMovieComedyToneScore(movieA);
  const movieBScore = getMovieComedyToneScore(movieB);

  if (movieAScore === 0 && movieBScore === 0) {
    return 1;
  }

  if (movieAScore > 0 && movieBScore > 0) {
    return 1.04;
  }

  const strongestToneScore = Math.max(movieAScore, movieBScore);

  if (strongestToneScore >= 2) {
    return 0.88;
  }

  return 0.94;
}

const CANON_AFFINITY = {
  'Атака акулы': {
    'Хищное существо': 0.35,
    'Водная среда': 0.2
  },

  'Атака змеи': {
    'Хищное существо': 0.35,
    'Гигантское существо': 0.15
  },

  'Атака паука': {
    'Хищное существо': 0.35,
    'Гигантское существо': 0.15,
    'Научно созданное существо': 0.15,
    'Существо-мутант': 0.12
  },

  'Призрачная одержимость': {
    'Одержимость сущностью': 0.5,
    'Проявление призрака': 0.35
  },

  'Демоническая одержимость': {
    'Одержимость сущностью': 0.45,
    'Демоническая сущность': 0.3,
    'Экзорцизм': 0.3
  },

  'Экзорцизм': {
    'Демоническая одержимость': 0.3,
    'Одержимость сущностью': 0.25,
    'Оккультный ритуал': 0.25,
    'Демоническая сущность': 0.2
  },

  'Мстительный призрак': {
    'Проявление призрака': 0.45,
    'Фольклорная сущность': 0.15
  },

  'Проклятый предмет': {
    'Одержимый предмет': 0.35,
    'Медиа как канал угрозы': 0.15
  },

  'Одержимый предмет': {
    'Проклятый предмет': 0.35
  },

  'Мифическое существо': {
    'Фольклорная сущность': 0.35
  },

  'Фольклорная сущность': {
    'Мифическое существо': 0.35,
    'Переосмысление мифа': 0.15,
    'Вампир': 0.15
  },

  'Вампир': {
    'Фольклорная сущность': 0.15,
    'Переосмысление мифа': 0.2,
    'Сверхъестественное влияние': 0.1
  },

  'Расплата за желание': {
    'Оккультная сделка': 0.3
  },

  'Оккультная сделка': {
    'Расплата за желание': 0.3,
    'Оккультный ритуал': 0.15
  },

  'Изолированный дом': {
    'Дом как пространство угрозы': 0.45
  },

  'Дом как пространство угрозы': {
    'Изолированный дом': 0.45,
    'Сарай / амбар': 0.18
  },

  'Похищение': {
    'Выживание в ловушке': 0.25,
    'Домашнее заточение': 0.25,
    'Садистское удержание': 0.25
  },

  'Выживание в ловушке': {
    'Похищение': 0.25,
    'Домашнее заточение': 0.2,
    'Космическая среда': 0.18,
    'Самолёт как ловушка': 0.25,
    'Больница как пространство угрозы': 0.22
  },

  'Больница как пространство угрозы': {
    'Выживание в ловушке': 0.22,
    'Инфраструктурный хоррор': 0.18,
    'Научный эксперимент': 0.12,
    'Домашнее заточение': 0.1
  },

  'Космическая среда': {
    'Инопланетная угроза': 0.2,
    'Инопланетное существо': 0.18,
    'Выживание в ловушке': 0.18,
    'Инфраструктурный хоррор': 0.15
  },

  'Самолёт как ловушка': {
    'Выживание в ловушке': 0.25,
    'Инфраструктурный хоррор': 0.25,
    'Групповое выживание': 0.15
  },

  'Перенос сознания': {
    'Искажённая реальность': 0.25,
    'Альтернативное измерение': 0.15
  },

  'Искажённая реальность': {
    'Альтернативное измерение': 0.25,
    'Перенос сознания': 0.25,
    'Галлюцинации': 0.2,
    'Материализованная вина': 0.15
  },

  'Временная петля': {
    'Пространственная петля': 0.35,
    'Обратный отсчёт': 0.15
  },

  'Пространственная петля': {
    'Временная петля': 0.35,
    'Лиминальное пространство': 0.2
  },

  'Лиминальное пространство': {
    'Пространственная петля': 0.2,
    'Метро как пространство угрозы': 0.15
  },

  'Медиа-расследование': {
    'Медиа как канал угрозы': 0.25,
    'Аудиоконтакт': 0.2
  },

  'Медиа как канал угрозы': {
    'Медиа-расследование': 0.25,
    'Аудиоконтакт': 0.15
  },

  'Аудиоконтакт': {
    'Медиа как канал угрозы': 0.15,
    'Медиа-расследование': 0.2
  },

  'Зомби': {
    'Грибковая инфекция': 0.2,
    'Инфицированное общество': 0.25,
    'Химическое заражение': 0.15,
    'Распространяющееся заражение': 0.15
  },

  'Грибковая инфекция': {
    'Зомби': 0.2,
    'Распространяющееся заражение': 0.25
  },

  'Химическое заражение': {
    'Распространяющееся заражение': 0.3,
    'Зомби': 0.15
  },

  'Распространяющееся заражение': {
    'Химическое заражение': 0.3,
    'Грибковая инфекция': 0.25,
    'Зомби': 0.15
  },

  'Охота на людей': {
    'Преследование': 0.3
  },

  'Преследование': {
    'Охота на людей': 0.3
  },

  'Возвращение травмы': {
    'Травма утраты': 0.2
  },

  'Травма утраты': {
    'Возвращение травмы': 0.2,
    'Материализованная вина': 0.15
  },

  'Материнский хоррор': {
    'Пара родитель-ребёнок': 0.2,
    'Травма утраты': 0.15
  },

  'Гигантское существо': {
    'Хищное существо': 0.15
  },

  'Кукла-убийца': {
    'Проклятый предмет': 0.15,
    'Одержимый предмет': 0.15
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
    for (const tagB of setB) {
      if (tagA === tagB) continue;

      const pairKey = [tagA, tagB].sort().join("::");
      if (seenPairs.has(pairKey)) continue;

      const forwardCoeff = CANON_AFFINITY[tagA]?.[tagB] ?? 0;
      const reverseCoeff = CANON_AFFINITY[tagB]?.[tagA] ?? 0;
      const coeff = Math.max(forwardCoeff, reverseCoeff);

      if (coeff <= 0) continue;

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
  const comedyToneMultiplier = getComedyToneMultiplier(movieA, movieB);

  const rawFinalScore =
    canonExactScore +
    canonAffinityScore +
    modifierScore +
    broadScore +
    formatScore +
    genreScore +
    countryScore;

  const finalScore = Math.min(100, rawFinalScore * laneMultiplier * comedyToneMultiplier);

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
      comedyToneMultiplier,
      movieAComedyToneScore: getMovieComedyToneScore(movieA),
      movieBComedyToneScore: getMovieComedyToneScore(movieB),
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
  'Сверхъестественный хоррор',
  'Дом с привидениями',
  'Мистери-хоррор',
  'Конспирологический хоррор',
  'Монстр-муви',
  'Одержимость',
  'Хоррор-выживание',
  'Религиозный хоррор',
  'Фолк-хоррор',
  'Психологический хоррор',
  'Слэшер',
  'Нападение животных',
  'Инфекционный хоррор',
  'Боди-хоррор',
  'Каннибальский хоррор',
  'Зомби-хоррор',
  'Вампирский хоррор',
  'Хоррор-катастрофа'
];

const TAXONOMY_FORMATS = [
  'Найденная плёнка',
  'Псевдодокументальный',
  'Гибридное повествование',
  'Антология',
  'Немой фильм'
];

const TAXONOMY_TRIGGERS = [
  'Расчленение',
  'Удушье',
  'Психическая нестабильность',
  'Причинение вреда ребёнку',
  'Искажение реальности',
  'Смерть животного',
  'Суицид',
  'Сексуализированное насилие',
  'Домашнее насилие',
  'Беременность',
  'Жестокость к животным',
  'Клаустрофобия',
  'Страх животных',
  'Проникновение в тело'
];

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
    allowed: () => TAXONOMY_TRIGGERS
  }
};

const TAXONOMY_REQUIRED_CANON_GROUPS = {
  'Слэшер': [
    {
      label: 'тип убийцы',
      tags: ['Убийца в маске', 'Серийный убийца', 'Сверхъестественный убийца', 'Дуэт убийц', 'Санта-убийца', 'Восставший убийца', 'Убийца, движимый травмой', 'Протагонист-убийца', 'Дайвер-убийца', 'Пугало-убийца', 'Существо-убийца']
    }
  ],
  'Монстр-муви': [
    {
      label: 'тип существа',
      tags: ['Хищное существо', 'Гигантское существо', 'Существо-мутант', 'Мифическое существо', 'Научно созданное существо', 'Инопланетное существо', 'Существо-убийца', 'Атака акулы', 'Атака змеи', 'Атака паука']
    }
  ],
  'Нападение животных': [
    {
      label: 'тип животной угрозы',
      tags: ['Атака акулы', 'Атака змеи', 'Атака паука', 'Хищное существо', 'Гигантское существо', 'Заражение бешенством']
    }
  ],
  'Одержимость': [
    {
      label: 'тип одержимости',
      tags: ['Демоническая одержимость', 'Призрачная одержимость', 'Одержимость сущностью']
    }
  ],
  'Инфекционный хоррор': [
    {
      label: 'механика заражения',
      tags: ['Зомби', 'Грибковая инфекция', 'Химическое заражение', 'Заражение бешенством', 'Распространяющееся заражение', 'Инфицированное общество']
    }
  ],
  'Вампирский хоррор': [
    {
      label: 'вампирская угроза',
      tags: ['Вампир']
    }
  ],
  'Зомби-хоррор': [
    {
      label: 'зомби-угроза',
      tags: ['Зомби']
    }
  ],
  'Каннибальский хоррор': [
    {
      label: 'каннибальская механика',
      tags: ['Каннибализм']
    }
  ],
  'Боди-хоррор': [
    {
      label: 'телесная механика',
      tags: ['Телесная трансформация', 'Перенос сознания', 'Стирание личности']
    }
  ],
  'Фолк-хоррор': [
    {
      label: 'фольклорная или ритуальная основа',
      tags: ['Фольклорная сущность', 'Мифическое существо', 'Ведьмовство', 'Оккультный ритуал', 'Чёрная магия', 'Опасный культ']
    }
  ],
  'Религиозный хоррор': [
    {
      label: 'религиозная или культовая механика',
      tags: ['Религиозный фундаментализм', 'Демоническая сущность', 'Демоническая одержимость', 'Экзорцизм', 'Оккультный ритуал', 'Опасный культ', 'Расплата за желание', 'Правило расплаты']
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
    label: 'Уточнить Оккультный ритуал',
    whenAny: ['Оккультный ритуал'],
    suggestAny: [
      'Жертвенные убийства',
      'Опасный культ',
      'Чёрная магия',
      'Ведьмовство',
      'Экзорцизм',
      'Расплата за желание',
      'Правило расплаты',
      'Продление жизни',
      'Оккультная сделка'
    ],
    reason: 'Есть Оккультный ритуал, но нет уточнения: экзорцизм, жертвоприношение, культ, магия, цена, наказание или сделка.'
  },
  {
    code: 'family_unit_refinement',
    label: 'Уточнить Семейная динамика',
    whenAny: ['Семейная динамика'],
    suggestAny: [
      'Пара родитель-ребёнок',
      'Отношения братьев/сестёр',
      'Токсичный родитель',
      'Дисфункциональная семья',
      'Межпоколенческая травма',
      'Романтическая пара',
      'Ребёнок с инвалидностью',
      'Больной ребёнок',
      'Больной брат / сестра',
      'Утрата родителя'
    ],
    reason: 'Есть Семейная динамика, но не указана конкретная семейная конфигурация или травматическая связь.'
  },
  {
    code: 'grief_trauma_refinement',
    label: 'Уточнить Травма утраты',
    whenAny: ['Травма утраты'],
    suggestAny: [
      'Материализованная вина',
      'Возвращение травмы',
      'Тайна прошлого',
      'Расследование пропажи',
      'Детская травма',
      'Межпоколенческая травма'
    ],
    reason: 'Есть Травма утраты, но не указано, как именно травма работает в механике фильма.'
  },
  {
    code: 'masked_killer_refinement',
    label: 'Уточнить Убийца в маске',
    whenAny: ['Убийца в маске'],
    suggestAny: [
      'Серийный убийца',
      'Убийца, движимый травмой',
      'Сверхъестественный убийца',
      'Восставший убийца',
      'Протагонист-убийца',
      'Преследование',
      'Охота на людей',
      'Дом в осаде',
      'Выжить до утра'
    ],
    reason: 'Есть Убийца в маске, но не уточнён тип убийцы, структура преследования или модель выживания.'
  },
  {
    code: 'predatory_creature_refinement',
    label: 'Уточнить Хищное существо',
    whenAny: ['Хищное существо'],
    suggestAny: [
      'Атака акулы',
      'Атака змеи',
      'Атака паука',
      'Гигантское существо',
      'Существо-мутант',
      'Мифическое существо',
      'Научно созданное существо',
      'Инопланетное существо',
      'Существо-убийца',
      'Противостояние с существом',
      'Заражение бешенством'
    ],
    reason: 'Есть Хищное существо, но не указан более конкретный тип угрозы или природа существа.'
  },
  {
    code: 'investigation_media_refinement',
    label: 'Уточнить расследовательскую рамку',
    whenAny: ['Медиа-расследование', 'Медиа как канал угрозы'],
    suggestAny: [
      'Аудиоконтакт',
      'Тайна прошлого',
      'Расследование пропажи',
      'Расследование городской легенды',
      'Интернет-фольклор',
      'Тайна маленького города',
      'Оккультная книга'
    ],
    reason: 'Есть медиа- или расследовательская рамка, но не уточнён источник расследования или скрытая правда.'
  },
  {
    code: 'trapped_survival_refinement',
    label: 'Уточнить Выживание в ловушке',
    whenAny: ['Выживание в ловушке'],
    suggestAny: [
      'Домашнее заточение',
      'Дом в осаде',
      'Похищение',
      'Садистское удержание',
      'Групповое выживание',
      'Выжить до утра',
      'Преследование',
      'Спасательная миссия',
      'Снежная изоляция',
      'Необитаемый остров',
      'Космическая среда',
      'Самолёт как ловушка',
      'Больница как пространство угрозы'
    ],
    reason: 'Есть Выживание в ловушке, но не указано, чем именно удерживаются персонажи, какая среда ловушки или какая структура выживания работает.'
  },
  {
    code: 'distorted_reality_refinement',
    label: 'Уточнить Искажённая реальность',
    whenAny: ['Искажённая реальность'],
    suggestAny: [
      'Временная петля',
      'Пространственная петля',
      'Альтернативное измерение',
      'Галлюцинации',
      'Память как ключ к угрозе',
      'Симуляция виртуальной реальности',
      'Угроза через сон',
      'Материализованная вина'
    ],
    reason: 'Есть Искажённая реальность, но не уточнён механизм искажения реальности.'
  },
  {
    code: 'possession_refinement',
    label: 'Уточнить одержимость',
    whenPerceivedAny: ['Одержимость'],
    suggestAny: [
      'Демоническая одержимость',
      'Призрачная одержимость',
      'Одержимость сущностью'
    ],
    reason: 'Фильм воспринимается как одержимость, но не указан тип одержимости.'
  },
  {
    code: 'survival_horror_structure',
    label: 'Уточнить хоррор-выживание',
    whenPerceivedAny: ['Хоррор-выживание'],
    suggestAny: [
      'Выживание в ловушке',
      'Групповое выживание',
      'Выжить до утра',
      'Дом в осаде',
      'Преследование',
      'Охота на людей',
      'Спасательная миссия',
      'Постапокалиптическое выживание',
      'Военное выживание'
    ],
    reason: 'Фильм воспринимается как хоррор-выживание, но не указана конкретная структура выживания.'
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
        ['Демоническая одержимость', 'Призрачная одержимость', 'Одержимость сущностью'],
        3
      );

      return {
        priority: 'high',
        reason: 'Perceived указывает на одержимость, но canon не уточняет тип одержимости.',
        suggestedTags
      };
    }

    case 'masked_killer_refinement': {
      const hasKillerTypeOrThreatStructure = hasAnyCanonCoverageValue(canon, [
        'Серийный убийца',
        'Убийца, движимый травмой',
        'Сверхъестественный убийца',
        'Восставший убийца',
        'Протагонист-убийца',
        'Дуэт убийц',
        'Санта-убийца',
        'Дайвер-убийца',
        'Похищение',
        'Садистское удержание',
        'Домашнее заточение',
        'Выживание в ловушке',
        'Преследование',
        'Охота на людей',
        'Выжить до утра'
      ]);

      if (hasKillerTypeOrThreatStructure) {
        return null;
      }

      const suggestedTags = getCanonCoverageMissingTags(
        canonSet,
        perceivedSet.has('Хоррор-выживание')
          ? ['Серийный убийца', 'Преследование', 'Выжить до утра']
          : ['Серийный убийца', 'Убийца, движимый травмой', 'Сверхъестественный убийца'],
        3
      );

      return {
        priority: 'high',
        reason: 'Есть Убийца в маске, но не указан тип убийцы, структура преследования или captivity/survival-механика.',
        suggestedTags
      };
    }

    case 'predatory_creature_refinement': {
      const hasCreatureType = hasAnyCanonCoverageValue(canon, [
        'Атака акулы',
        'Атака змеи',
        'Атака паука',
        'Гигантское существо',
        'Существо-мутант',
        'Мифическое существо',
        'Научно созданное существо',
        'Инопланетное существо',
        'Существо-убийца',
        'Противостояние с существом',
        'Заражение бешенством'
      ]);

      if (hasCreatureType) {
        return null;
      }

      const hasCreatureEnvironment = hasAnyCanonCoverageValue(canon, [
        'Водная среда',
        'Лес как пространство угрозы',
        'Снежная изоляция',
        'Горнолыжный курорт',
        'Необитаемый остров',
        'Горная глушь',
        'Космическая среда',
        'Самолёт как ловушка'
      ]);
      const hasCreatureSurvivalStructure = hasAnyCanonCoverageValue(canon, [
        'Групповое выживание',
        'Выживание в ловушке',
        'Спасательная миссия',
        'Преследование'
      ]);

      if (hasCreatureEnvironment && hasCreatureSurvivalStructure) {
        return null;
      }

      if (canonSet.has('Водная среда')) {
        return null;
      }

      const suggestedTags = getCanonCoverageMissingTags(
        canonSet,
        ['Гигантское существо', 'Существо-мутант', 'Научно созданное существо', 'Существо-убийца'],
        4
      );

      return {
        priority: 'medium',
        reason: 'Есть Хищное существо без более конкретного типа существа; проверить только если природа монстра явно известна и не компенсируется средой/структурой выживания.',
        suggestedTags
      };
    }

    case 'occult_ritual_refinement': {
      const suggestedTags = [];

      if (canonSet.has('Терминальная болезнь')) {
        suggestedTags.push('Расплата за желание', 'Продление жизни');
      }

      if (canonSet.has('Жертвенные убийства')) {
        suggestedTags.push('Опасный культ', 'Правило расплаты');
      }

      if (canonSet.has('Религиозный фундаментализм')) {
        suggestedTags.push('Правило расплаты', 'Опасный культ');
      }

      const missingTags = getCanonCoverageMissingTags(canonSet, suggestedTags, 3);

      if (missingTags.length === 0) {
        return null;
      }

      return {
        priority: 'medium',
        reason: 'Есть Оккультный ритуал и дополнительный контекст, который может требовать точного уточнения механики.',
        suggestedTags: missingTags
      };
    }

    case 'family_unit_refinement': {
      const suggestedTags = [];

      if (canonSet.has('Травма утраты')) {
        suggestedTags.push('Пара родитель-ребёнок', 'Межпоколенческая травма', 'Токсичный родитель');
      }

      if (canonSet.has('Демоническая одержимость') || canonSet.has('Одержимость сущностью')) {
        suggestedTags.push('Пара родитель-ребёнок', 'Токсичный родитель');
      }

      const missingTags = getCanonCoverageMissingTags(canonSet, suggestedTags, 3);

      if (missingTags.length === 0) {
        return null;
      }

      return {
        priority: 'low',
        reason: 'Есть Семейная динамика с травматическим или сверхъестественным контекстом; возможно, семейную связь стоит уточнить.',
        suggestedTags: missingTags
      };
    }

    case 'grief_trauma_refinement': {
      const suggestedTags = [];
      const hasSpecificGriefMechanism = hasAnyCanonCoverageValue(canon, [
        'Материализованная вина',
        'Память как ключ к угрозе',
        'Межпоколенческая травма',
        'Расследование пропажи',
        'Детская травма',
        'Материнский хоррор',
        'Пара родитель-ребёнок',
        'Отношения братьев/сестёр',
        'Эксперимент с машиной времени',
        'Телесная трансформация',
        'Дисфункциональная семья'
      ]);

      if (hasSpecificGriefMechanism) {
        return null;
      }

      if (canonSet.has('Искажённая реальность') || canonSet.has('Галлюцинации')) {
        suggestedTags.push('Материализованная вина', 'Память как ключ к угрозе');
      }

      if (canonSet.has('Тайна прошлого') || canonSet.has('Медиа-расследование')) {
        suggestedTags.push('Расследование пропажи', 'Детская травма');
      }

      if (canonSet.has('Семейная динамика')) {
        suggestedTags.push('Межпоколенческая травма', 'Пара родитель-ребёнок');
      }

      const missingTags = getCanonCoverageMissingTags(canonSet, suggestedTags, 3);

      if (missingTags.length === 0) {
        return null;
      }

      return {
        priority: 'low',
        reason: 'Есть Травма утраты с дополнительным механизмом; возможно, травму стоит уточнить.',
        suggestedTags: missingTags
      };
    }

    case 'investigation_media_refinement': {
      const suggestedTags = [];
      const hasRichInvestigationFrame = hasAnyCanonCoverageValue(canon, [
        'Расследование пропажи',
        'Тайна прошлого',
        'Расследование городской легенды',
        'Интернет-фольклор',
        'Тайна маленького города',
        'Оккультная книга',
        'Изолированная деревня',
        'Призрачная одержимость',
        'Одержимость сущностью'
      ]);

      if (canonSet.has('Медиа-расследование') && canonSet.has('Тайна прошлого')) {
        suggestedTags.push('Расследование пропажи', 'Оккультная книга', 'Расследование городской легенды');
      }

      if (canonSet.has('Медиа как канал угрозы') && !hasRichInvestigationFrame) {
        suggestedTags.push('Аудиоконтакт');
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

      if (canonSet.has('Дом как пространство угрозы') || canonSet.has('Изолированный дом')) {
        suggestedTags.push('Домашнее заточение', 'Дом в осаде');
      }

      if (canonSet.has('Лес как пространство угрозы')) {
        suggestedTags.push('Групповое выживание', 'Преследование', 'Спасательная миссия');
      }

      if (canonSet.has('Снежная изоляция')) {
        suggestedTags.push('Групповое выживание', 'Спасательная миссия');
      }

      const missingTags = getCanonCoverageMissingTags(canonSet, suggestedTags, 3);

      if (missingTags.length === 0) {
        return null;
      }

      return {
        priority: 'medium',
        reason: 'Есть Выживание в ловушке и конкретная среда; возможно, структуру удержания/выживания стоит уточнить.',
        suggestedTags: missingTags
      };
    }

    case 'distorted_reality_refinement': {
      const suggestedTags = [];
      const hasDeathTransferMechanism =
        canonSet.has('Передача смерти') ||
        canonSet.has('Передаваемое проклятие');
      const hasSpecificRealityMechanism = hasAnyCanonCoverageValue(canon, [
        'Временная петля',
        'Пространственная петля',
        'Альтернативное измерение',
        'Галлюцинации',
        'Память как ключ к угрозе',
        'Симуляция виртуальной реальности',
        'Угроза через сон',
        'Перенос сознания',
        'Стирание личности',
        'Эксперимент с машиной времени',
        'Временная аномалия',
        'Вторжение из будущего',
        'Вторжение иной реальности'
      ]);
      const hasSpecificGriefRealityMechanism = hasAnyCanonCoverageValue(canon, [
        'Материализованная вина',
        'Материнский хоррор',
        'Телесная трансформация',
        'Дисфункциональная семья'
      ]);

      if (hasSpecificRealityMechanism || hasSpecificGriefRealityMechanism) {
        return null;
      }

      if (canonSet.has('Обратный отсчёт') && !hasDeathTransferMechanism) {
        suggestedTags.push('Временная петля');
      }

      if (canonSet.has('Травма утраты')) {
        suggestedTags.push('Материализованная вина', 'Память как ключ к угрозе');
      }

      const missingTags = getCanonCoverageMissingTags(canonSet, suggestedTags, 3);

      if (missingTags.length === 0) {
        return null;
      }

      return {
        priority: 'low',
        reason: 'Есть Искажённая реальность с дополнительным контекстом; возможно, механизм искажения стоит уточнить.',
        suggestedTags: missingTags
      };
    }

    case 'survival_horror_structure': {
      const hasSurvivalStructure = hasAnyCanonCoverageValue(canon, [
        'Выживание в ловушке',
        'Групповое выживание',
        'Выжить до утра',
        'Дом в осаде',
        'Преследование',
        'Охота на людей',
        'Спасательная миссия',
        'Постапокалиптическое выживание',
        'Военное выживание'
      ]);

      if (hasSurvivalStructure) {
        return null;
      }

      const suggestedTags = [];
      const hasExplicitGroupSurvivalFrame = hasAnyCanonCoverageValue(canon, [
        'Групповая паранойя',
        'Вынужденный союз',
        'Опасный культ'
      ]);
      const hasExplicitContainmentFrame = hasAnyCanonCoverageValue(canon, [
        'Изолированный дом',
        'Необитаемый остров',
        'Снежная изоляция',
        'Изолированный маяк',
        'Придорожный мотель',
        'Заброшенное поселение',
        'Подземная антиутопия',
        'Домашнее заточение',
        'Похищение',
        'Садистское удержание'
      ]);
      const hasExplicitPursuitFrame = hasAnyCanonCoverageValue(canon, [
        'Убийца в маске',
        'Серийный убийца',
        'Охота на людей',
        'Восставший убийца',
        'Сверхъестественный убийца',
        'Дуэт убийц'
      ]);

      if (
        hasAnyCanonCoverageValue(canon, ['Хищное существо', 'Атака акулы', 'Атака змеи', 'Атака паука', 'Гигантское существо']) &&
        hasExplicitContainmentFrame
      ) {
        suggestedTags.push('Выживание в ловушке');
      }

      if (
        hasAnyCanonCoverageValue(canon, ['Хищное существо', 'Атака акулы', 'Атака змеи', 'Атака паука', 'Гигантское существо']) &&
        hasExplicitGroupSurvivalFrame
      ) {
        suggestedTags.push('Групповое выживание');
      }

      if (hasExplicitPursuitFrame) {
        suggestedTags.push('Преследование');
      }

      const missingTags = getCanonCoverageMissingTags(canonSet, suggestedTags, 3);

      if (missingTags.length === 0) {
        return null;
      }

      return {
        priority: 'low',
        reason: 'Фильм воспринимается как хоррор-выживание; есть контекст, который может указывать на конкретную структуру выживания.',
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

function createTaxonomyTagExportItem(value, details = {}) {
  return {
    value,
    ...details
  };
}

function sortTaxonomyTagExportItems(items = []) {
  return [...items].sort((firstItem, secondItem) =>
    String(firstItem.value || '').localeCompare(String(secondItem.value || ''), 'ru')
  );
}

function createTaxonomyTagExportGroup(title, tags = []) {
  return {
    title,
    count: tags.length,
    tags
  };
}

function createFlatTaxonomyTagExportSection(key, title, groupTitle, values = []) {
  const tags = values.map(value => createTaxonomyTagExportItem(value));

  return {
    key,
    title,
    count: tags.length,
    groups: [
      createTaxonomyTagExportGroup(groupTitle, tags)
    ]
  };
}

function getTaxonomyWeightGroupTitle(weight) {
  const numericWeight = Number(weight);

  if (!Number.isFinite(numericWeight)) {
    return 'Без веса';
  }

  return `Вес ${String(numericWeight).replace(/\.0+$/, '')}`;
}

function createWeightedTaxonomyTagExportSection(key, title, weightsByTag = {}) {
  const groupsByWeight = new Map();

  Object.entries(weightsByTag).forEach(([tag, weight]) => {
    const groupTitle = getTaxonomyWeightGroupTitle(weight);

    if (!groupsByWeight.has(groupTitle)) {
      groupsByWeight.set(groupTitle, {
        title: groupTitle,
        weight: Number(weight),
        tags: []
      });
    }

    groupsByWeight.get(groupTitle).tags.push(createTaxonomyTagExportItem(tag, {
      weight
    }));
  });

  const groups = Array.from(groupsByWeight.values())
    .sort((firstGroup, secondGroup) => {
      const firstWeight = Number.isFinite(firstGroup.weight) ? firstGroup.weight : -Infinity;
      const secondWeight = Number.isFinite(secondGroup.weight) ? secondGroup.weight : -Infinity;

      if (secondWeight !== firstWeight) {
        return secondWeight - firstWeight;
      }

      return firstGroup.title.localeCompare(secondGroup.title, 'ru');
    })
    .map(group => createTaxonomyTagExportGroup(
      group.title,
      sortTaxonomyTagExportItems(group.tags)
    ));

  return {
    key,
    title,
    count: Object.keys(weightsByTag).length,
    groups
  };
}

function createCanonTaxonomyTagExportSection() {
  const fallbackGroupTitle = 'Без семейства';
  const groupsByFamily = new Map();

  Object.keys(BROAD_FAMILY_WEIGHTS).forEach(family => {
    groupsByFamily.set(family, []);
  });

  groupsByFamily.set(fallbackGroupTitle, []);

  Object.keys(CANON_TAG_META).forEach(tag => {
    const meta = getCanonTagMeta(tag);
    const families = normalizeBroadFamilies(meta.families);
    const groupTitle = families[0] || fallbackGroupTitle;

    if (!groupsByFamily.has(groupTitle)) {
      groupsByFamily.set(groupTitle, []);
    }

    groupsByFamily.get(groupTitle).push(createTaxonomyTagExportItem(tag, {
      families,
      role: meta.role,
      tier: meta.tier,
      status: meta.status,
      confidence: meta.confidence,
      lanes: getCanonTagMetaArray(tag, 'lanes')
    }));
  });

  return {
    key: 'canon',
    title: 'Canon-теги',
    count: Object.keys(CANON_TAG_META).length,
    groups: Array.from(groupsByFamily.entries())
      .filter(([, tags]) => tags.length > 0)
      .map(([title, tags]) => createTaxonomyTagExportGroup(
        title,
        sortTaxonomyTagExportItems(tags)
      ))
  };
}

function getTaxonomyTagExportData() {
  const sections = [
    createFlatTaxonomyTagExportSection(
      'perceived',
      'Поджанры / perceived',
      'Все поджанры',
      TAXONOMY_SUBGENRES
    ),
    createCanonTaxonomyTagExportSection(),
    createFlatTaxonomyTagExportSection(
      'formats',
      'Форматы',
      'Все форматы',
      TAXONOMY_FORMATS
    ),
    createWeightedTaxonomyTagExportSection(
      'modifiers',
      'Модификаторы',
      MODIFIER_WEIGHTS
    ),
    createWeightedTaxonomyTagExportSection(
      'broadFamilies',
      'Семейства механик',
      BROAD_FAMILY_WEIGHTS
    ),
    createFlatTaxonomyTagExportSection(
      'triggers',
      'Триггеры',
      'Все триггеры',
      TAXONOMY_TRIGGERS
    )
  ];

  return {
    schema: 'horroreiro_taxonomy_registry',
    version: 1,
    generated_from: 'horror-taxonomy.js',
    total_tags: sections.reduce((sum, section) => sum + section.count, 0),
    sections
  };
}

window.HORROR_TAXONOMY = {
  subgenres: TAXONOMY_SUBGENRES,
  formats: TAXONOMY_FORMATS,
  triggers: TAXONOMY_TRIGGERS,
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
    getTaxonomyTagExportData,
    auditCanonTagMetaRegistrySource
  }
};

if (typeof window !== 'undefined') {
  window.HORROR_TAXONOMY_REGISTRY_AUDIT = auditCanonTagMetaRegistrySource();
}
