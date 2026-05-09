with taxonomy_value_map(old_value, new_value) as (
  values
    ('supernatural_horror', 'Сверхъестественный хоррор'),
    ('haunted_house', 'Дом с привидениями'),
    ('mystery_horror', 'Мистери-хоррор'),
    ('conspiracy_horror', 'Конспирологический хоррор'),
    ('creature_feature', 'Монстр-муви'),
    ('possession', 'Одержимость'),
    ('survival_horror', 'Хоррор-выживание'),
    ('religious_horror', 'Религиозный хоррор'),
    ('folk_horror', 'Фолк-хоррор'),
    ('psychological_horror', 'Психологический хоррор'),
    ('slasher', 'Слэшер'),
    ('animal_attack', 'Нападение животных'),
    ('infection_outbreak', 'Хоррор-вспышка'),
    ('body_horror', 'Боди-хоррор'),
    ('cannibal_horror', 'Каннибальский хоррор'),
    ('horror_comedy', 'Хоррор-комедия'),
    ('zombie', 'Зомби-хоррор'),
    ('vampire', 'Вампирский хоррор'),
    ('disaster_horror', 'Хоррор-катастрофа'),
    ('found_footage', 'Найденная плёнка'),
    ('mockumentary', 'Псевдодокументальный'),
    ('hybrid_narrative', 'Гибридное повествование'),
    ('anthology', 'Антология'),
    ('silent_film', 'Немой фильм'),
    ('gore', 'Расчленение'),
    ('breathing_distress', 'Удушье'),
    ('mental_instability', 'Психическая нестабильность'),
    ('child_harm', 'Причинение вреда ребёнку'),
    ('reality_distortion', 'Искажение реальности'),
    ('animal_death', 'Смерть животного'),
    ('suicide', 'Суицид'),
    ('sexual_violence', 'Сексуализированное насилие'),
    ('domestic_violence', 'Домашнее насилие'),
    ('pregnancy', 'Беременность'),
    ('animal_abuse', 'Жестокость к животным'),
    ('claustrophobia', 'Клаустрофобия'),
    ('animal_phobia', 'Страх животных'),
    ('body_invasion', 'Проникновение в тело')
)
update public.movies as movie
set
  primary_subgenre = coalesce(
    (
      select new_value
      from taxonomy_value_map
      where old_value = movie.primary_subgenre
    ),
    movie.primary_subgenre
  ),
  secondary_subgenres = case
    when movie.secondary_subgenres is null then null
    else (
      select coalesce(
        array_agg(coalesce(taxonomy_value_map.new_value, item.value) order by item.ordinality),
        array[]::text[]
      )
      from unnest(movie.secondary_subgenres) with ordinality as item(value, ordinality)
      left join taxonomy_value_map on taxonomy_value_map.old_value = item.value
    )
  end,
  tags_perceived = case
    when movie.tags_perceived is null then null
    else (
      select coalesce(
        array_agg(coalesce(taxonomy_value_map.new_value, item.value) order by item.ordinality),
        array[]::text[]
      )
      from unnest(movie.tags_perceived) with ordinality as item(value, ordinality)
      left join taxonomy_value_map on taxonomy_value_map.old_value = item.value
    )
  end,
  formats = case
    when movie.formats is null then null
    else (
      select coalesce(
        array_agg(coalesce(taxonomy_value_map.new_value, item.value) order by item.ordinality),
        array[]::text[]
      )
      from unnest(movie.formats) with ordinality as item(value, ordinality)
      left join taxonomy_value_map on taxonomy_value_map.old_value = item.value
    )
  end,
  triggers = case
    when movie.triggers is null then null
    else (
      select coalesce(
        array_agg(coalesce(taxonomy_value_map.new_value, item.value) order by item.ordinality),
        array[]::text[]
      )
      from unnest(movie.triggers) with ordinality as item(value, ordinality)
      left join taxonomy_value_map on taxonomy_value_map.old_value = item.value
    )
  end
where
  movie.primary_subgenre in (select old_value from taxonomy_value_map)
  or movie.secondary_subgenres && array(select old_value from taxonomy_value_map)
  or movie.tags_perceived && array(select old_value from taxonomy_value_map)
  or movie.formats && array(select old_value from taxonomy_value_map)
  or movie.triggers && array(select old_value from taxonomy_value_map);
