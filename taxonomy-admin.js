(function () {
  let dependencies = {};
  let taxonomyDiagnosticsButton = null;
  let taxonomySimilarityAuditButton = null;
  let taxonomyCanonCoverageAuditButton = null;
  let taxonomyTagsExportButton = null;
  let taxonomyJsonExportButton = null;
  let taxonomyImportButton = null;
  let taxonomyImportFileInput = null;
  let isTaxonomyImportInProgress = false;

  function getAllMovies() {
    const movies = dependencies.getAllMovies?.();
    return Array.isArray(movies) ? movies : [];
  }

  function showAuthMessage(message, type = 'info', shouldKeepVisible = false) {
    dependencies.showAuthMessage?.(message, type, shouldKeepVisible);
  }

  function normalizeSearchText(value) {
    if (typeof dependencies.normalizeSearchText === 'function') {
      return dependencies.normalizeSearchText(value);
    }

    return String(value || '')
      .toLowerCase()
      .replaceAll('ё', 'е')
      .trim()
      .replace(/\s+/g, ' ');
  }

  function areStringArraysEqual(firstArray, secondArray) {
    if (typeof dependencies.areStringArraysEqual === 'function') {
      return dependencies.areStringArraysEqual(firstArray, secondArray);
    }

    if (!Array.isArray(firstArray) || !Array.isArray(secondArray)) {
      return false;
    }

    if (firstArray.length !== secondArray.length) {
      return false;
    }

    return firstArray.every((item, index) => item === secondArray[index]);
  }

  function normalizeTaxonomyExportValues(values) {
    if (!Array.isArray(values) || values.length === 0) {
      return '—';
    }

    return values
      .map(value => String(value || '').trim())
      .filter(Boolean)
      .join('\n');
  }

  function normalizeTaxonomyJsonArray(values) {
    if (!Array.isArray(values)) {
      return [];
    }

    const uniqueValues = new Map();

    values
      .map(value => String(value || '').trim())
      .filter(Boolean)
      .forEach(value => {
        const normalizedValue = normalizeSearchText(value);

        if (!uniqueValues.has(normalizedValue)) {
          uniqueValues.set(normalizedValue, value);
        }
      });

    return Array.from(uniqueValues.values());
  }

  function normalizeTaxonomyImportBoolean(value) {
    if (typeof value === 'boolean') {
      return value;
    }

    return String(value || '').trim().toLowerCase() === 'true';
  }

  function getTaxonomyImportMovies(payload) {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (Array.isArray(payload?.movies)) {
      return payload.movies;
    }

    return [];
  }

  function resolveTaxonomyBroadFamiliesFromCanon(tagsCanon, fallbackFamilies = []) {
    if (typeof dependencies.resolveTaxonomyBroadFamiliesFromCanon === 'function') {
      return dependencies.resolveTaxonomyBroadFamiliesFromCanon(tagsCanon, fallbackFamilies);
    }

    const taxonomyHelpers = window.HORROR_TAXONOMY?.helpers;
    const derivedBroadFamilies = taxonomyHelpers?.deriveBroadFamiliesFromCanon
      ? taxonomyHelpers.deriveBroadFamiliesFromCanon(tagsCanon)
      : [];

    if (Array.isArray(derivedBroadFamilies) && derivedBroadFamilies.length > 0) {
      return normalizeTaxonomyJsonArray(derivedBroadFamilies);
    }

    return normalizeTaxonomyJsonArray(fallbackFamilies);
  }

  async function ensureTaxonomyReady(errorMessage) {
    const isTaxonomyLoaded = typeof dependencies.ensureHorrorTaxonomyLoaded === 'function'
      ? await dependencies.ensureHorrorTaxonomyLoaded()
      : Boolean(window.HORROR_TAXONOMY?.helpers);

    if (!isTaxonomyLoaded && errorMessage) {
      showAuthMessage(errorMessage, 'error', true);
    }

    return isTaxonomyLoaded;
  }

  function getCatalogMovieById(movieId) {
    if (typeof dependencies.getCatalogMovieById === 'function') {
      return dependencies.getCatalogMovieById(movieId);
    }

    return getAllMovies().find(movie => String(movie?.id) === String(movieId)) || null;
  }

  function getTaxonomyImportChangedFields(importMovie, existingMovie) {
    const tagsPerceived = normalizeTaxonomyJsonArray(importMovie.tags_perceived);
    const tagsCanon = normalizeTaxonomyJsonArray(importMovie.tags_canon);
    const formats = normalizeTaxonomyJsonArray(importMovie.tags_formats);
    const modifiers = normalizeTaxonomyJsonArray(importMovie.tags_modifiers);
    const manualBroadFamilies = normalizeTaxonomyJsonArray(importMovie.tags_broad_families);
    const broadFamilies = resolveTaxonomyBroadFamiliesFromCanon(tagsCanon, manualBroadFamilies);
    const maskConflict = normalizeTaxonomyImportBoolean(importMovie.mask_conflict);

    const taxonomyHelpers = window.HORROR_TAXONOMY?.helpers;
    const resolvedSubgenres = taxonomyHelpers?.resolveMovieSubgenres
      ? taxonomyHelpers.resolveMovieSubgenres({ tags_perceived: tagsPerceived })
      : {
          primary_subgenre: null,
          secondary_subgenres: []
        };

    const changedFields = {};

    if (!areStringArraysEqual(tagsPerceived, existingMovie.tags_perceived || [])) {
      changedFields.tags_perceived = tagsPerceived;
    }

    if (!areStringArraysEqual(tagsCanon, existingMovie.tags_canon || [])) {
      changedFields.tags_canon = tagsCanon;
    }

    if (!areStringArraysEqual(formats, existingMovie.formats || [])) {
      changedFields.formats = formats;
    }

    if (!areStringArraysEqual(modifiers, existingMovie.modifiers || [])) {
      changedFields.modifiers = modifiers;
    }

    if (!areStringArraysEqual(broadFamilies, existingMovie.broad_families || [])) {
      changedFields.broad_families = broadFamilies;
    }

    if ((resolvedSubgenres.primary_subgenre || null) !== (existingMovie.primary_subgenre ?? null)) {
      changedFields.primary_subgenre = resolvedSubgenres.primary_subgenre || null;
    }

    if (!areStringArraysEqual(resolvedSubgenres.secondary_subgenres || [], existingMovie.secondary_subgenres || [])) {
      changedFields.secondary_subgenres = resolvedSubgenres.secondary_subgenres || [];
    }

    if (maskConflict !== Boolean(existingMovie.mask_conflict)) {
      changedFields.mask_conflict = maskConflict;
    }

    return changedFields;
  }

  function buildTaxonomyImportPreview(importItems) {
    const updates = [];
    const missingItems = [];
    const invalidItems = [];

    importItems.forEach((importMovie, index) => {
      const movieId = String(importMovie?.id || '').trim();

      if (!movieId) {
        invalidItems.push(index + 1);
        return;
      }

      const existingMovie = getCatalogMovieById(movieId);

      if (!existingMovie) {
        missingItems.push(importMovie);
        return;
      }

      const changedFields = getTaxonomyImportChangedFields(importMovie, existingMovie);

      if (Object.keys(changedFields).length === 0) {
        return;
      }

      updates.push({
        movie: existingMovie,
        changedFields
      });
    });

    return {
      updates,
      missingItems,
      invalidItems
    };
  }

  function formatTaxonomyImportPreviewMessage(preview) {
    const changedMovieLines = preview.updates
      .slice(0, 12)
      .map(item => {
        const fieldNames = Object.keys(item.changedFields).join(', ');
        return `• ${item.movie.title || 'Без названия'} — ${fieldNames}`;
      });

    const moreUpdatesCount = Math.max(0, preview.updates.length - changedMovieLines.length);
    const messageLines = [
      'Импорт тегов из JSON',
      '',
      `Будет обновлено фильмов: ${preview.updates.length}`,
      `Не найдено по id: ${preview.missingItems.length}`,
      `Записей без id: ${preview.invalidItems.length}`
    ];

    if (changedMovieLines.length > 0) {
      messageLines.push('', 'Первые изменения:', ...changedMovieLines);
    }

    if (moreUpdatesCount > 0) {
      messageLines.push(`…и ещё ${moreUpdatesCount}`);
    }

    messageLines.push('', 'Применить импорт?');

    return messageLines.join('\n');
  }

  function readTextFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(String(reader.result || ''));
      };

      reader.onerror = () => {
        reject(new Error('Не удалось прочитать файл импорта.'));
      };

      reader.readAsText(file);
    });
  }

  function setTaxonomyImportControlsDisabled(isDisabled) {
    isTaxonomyImportInProgress = isDisabled;

    [
      taxonomyImportButton,
      taxonomyImportFileInput,
      taxonomyJsonExportButton,
      taxonomyDiagnosticsButton,
      taxonomySimilarityAuditButton,
      taxonomyCanonCoverageAuditButton,
      taxonomyTagsExportButton
    ].forEach(control => {
      if (control) {
        control.disabled = isDisabled;
      }
    });
  }

  async function applyTaxonomyImportUpdates(updates) {
    const supabaseClient = dependencies.supabaseClient;

    if (!supabaseClient) {
      throw new Error('Supabase client не инициализирован.');
    }

    for (const item of updates) {
      const { error } = await supabaseClient
        .from('movies')
        .update(item.changedFields)
        .eq('id', item.movie.id);

      dependencies.throwIfSupabaseError?.(error);
    }
  }

  async function importMovieTaxonomyJsonFile(file) {
    if (isTaxonomyImportInProgress) {
      return;
    }

    setTaxonomyImportControlsDisabled(true);

    try {
      dependencies.ensureActiveSessionForWrite?.();
      showAuthMessage('Читаю JSON-импорт тегов...');

      const isTaxonomyLoaded = await ensureTaxonomyReady(
        'Импорт тегов недоступен: не удалось загрузить таксономию.'
      );

      if (!isTaxonomyLoaded) {
        return;
      }

      if (getAllMovies().length === 0) {
        await dependencies.fetchMovies?.();
      }

      const fileText = await readTextFile(file);
      const payload = JSON.parse(fileText);
      const importItems = getTaxonomyImportMovies(payload);

      if (importItems.length === 0) {
        showAuthMessage('В JSON не найден массив movies для импорта.', 'error', true);
        return;
      }

      const preview = buildTaxonomyImportPreview(importItems);

      if (preview.updates.length === 0) {
        showAuthMessage('В импортируемом JSON нет изменений для текущих фильмов.', 'success', true);
        return;
      }

      const isConfirmed = confirm(formatTaxonomyImportPreviewMessage(preview));

      if (!isConfirmed) {
        showAuthMessage('Импорт отменён.', 'info', true);
        return;
      }

      showAuthMessage(`Обновляю теги: ${preview.updates.length} фильмов...`);

      await applyTaxonomyImportUpdates(preview.updates);
      await dependencies.reloadCatalogData?.({ showSkeleton: dependencies.isCatalogPage?.() });

      if (dependencies.isCatalogPage?.()) {
        const preserveScrollOnlyPreset = dependencies.fullCatalogRerenderPresets?.preserveScrollOnly || {
          preserveScroll: true,
          restoreAnchor: false
        };

        dependencies.rerenderCatalogAfterDataReload?.(null, preserveScrollOnlyPreset);
      }

      if (dependencies.isMoviePage?.() && dependencies.getCurrentMoviePageMovieId?.()) {
        const updatedMovie = await dependencies.reloadMoviePageData?.(
          dependencies.getCurrentMoviePageMovieId()
        );

        if (updatedMovie) {
          dependencies.renderMoviePage?.(updatedMovie);
          dependencies.loadMoviePageSimilarMovies?.(updatedMovie);
        }
      }

      showAuthMessage(`Импорт тегов применён: ${preview.updates.length} фильмов.`, 'success', true);
    } catch (error) {
      console.error('Ошибка импорта тегов:', error);
      showAuthMessage(`Ошибка импорта тегов: ${error.message || 'смотри консоль F12.'}`, 'error', true);
    } finally {
      setTaxonomyImportControlsDisabled(false);
    }
  }

  function handleTaxonomyImportFileChange(event) {
    const file = event.target.files?.[0] || null;

    event.target.value = '';

    if (!file) {
      return;
    }

    importMovieTaxonomyJsonFile(file);
  }

  function buildMovieTaxonomyExportBlock(movie) {
    const title = String(movie?.title || 'Без названия').trim();
    const year = movie?.year ? ` (${movie.year})` : '';
    const originalTitle = movie?.original_title
      ? `Оригинальное название: ${movie.original_title}\n`
      : '';

    return [
      `Название: ${title}${year}`,
      originalTitle.trim(),
      `ID: ${movie.id}`,
      movie.slug ? `Slug: ${movie.slug}` : '',
      movie.letterboxd_url ? `Letterboxd: ${movie.letterboxd_url}` : '',
      '',
      'Perceived:',
      normalizeTaxonomyExportValues(movie.tags_perceived),
      '',
      'Canon:',
      normalizeTaxonomyExportValues(movie.tags_canon),
      '',
      'Formats:',
      normalizeTaxonomyExportValues(movie.formats),
      '',
      'Modifiers:',
      normalizeTaxonomyExportValues(movie.modifiers),
      '',
      'Broad families:',
      normalizeTaxonomyExportValues(resolveTaxonomyBroadFamiliesFromCanon(movie.tags_canon, movie.broad_families)),
      '',
      'Mask conflict:',
      movie.mask_conflict ? 'true' : 'false'
    ]
      .filter((line, index, lines) => {
        const previousLine = lines[index - 1];
        return line !== '' || previousLine !== '';
      })
      .join('\n');
  }

  function buildMovieTaxonomyJsonExportItem(movie) {
    const tagsCanon = normalizeTaxonomyJsonArray(movie.tags_canon);

    return {
      id: movie.id,
      slug: movie.slug || '',
      title: movie.title || '',
      original_title: movie.original_title || '',
      year: movie.year ?? null,
      letterboxd_url: movie.letterboxd_url || '',
      tags_perceived: normalizeTaxonomyJsonArray(movie.tags_perceived),
      tags_canon: tagsCanon,
      tags_formats: normalizeTaxonomyJsonArray(movie.formats),
      tags_modifiers: normalizeTaxonomyJsonArray(movie.modifiers),
      tags_broad_families: resolveTaxonomyBroadFamiliesFromCanon(tagsCanon, movie.broad_families),
      mask_conflict: Boolean(movie.mask_conflict)
    };
  }

  function downloadTextFile(filename, content, mimeType = 'text/plain;charset=utf-8') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function sortMoviesForTaxonomyExport(movies) {
    return [...movies].sort((firstMovie, secondMovie) => {
      const firstYear = Number(firstMovie.year || 0);
      const secondYear = Number(secondMovie.year || 0);

      if (secondYear !== firstYear) {
        return secondYear - firstYear;
      }

      return String(firstMovie.title || '').localeCompare(String(secondMovie.title || ''), 'ru');
    });
  }

  async function ensureMoviesForTaxonomyExport() {
    if (getAllMovies().length === 0) {
      await dependencies.fetchMovies?.();
    }

    const movies = getAllMovies();

    if (movies.length === 0) {
      showAuthMessage('Нет фильмов для выгрузки.', 'error', true);
      return [];
    }

    return sortMoviesForTaxonomyExport(movies);
  }

  async function exportMovieTaxonomyJsonData() {
    try {
      const isTaxonomyLoaded = await ensureTaxonomyReady(
        'JSON-выгрузка тегов недоступна: не удалось загрузить таксономию.'
      );

      if (!isTaxonomyLoaded) {
        return;
      }

      const sortedMovies = await ensureMoviesForTaxonomyExport();

      if (sortedMovies.length === 0) {
        return;
      }

      const exportedAt = new Date().toISOString();
      const content = JSON.stringify({
        schema: 'horroreiro_taxonomy_tags',
        version: 1,
        exported_at: exportedAt,
        movies_count: sortedMovies.length,
        movies: sortedMovies.map(buildMovieTaxonomyJsonExportItem)
      }, null, 2);

      const datePart = exportedAt.slice(0, 10);
      downloadTextFile(
        `horroreiro-taxonomy-export-${datePart}.json`,
        content,
        'application/json;charset=utf-8'
      );

      showAuthMessage(`JSON-выгрузка тегов готова: ${sortedMovies.length} фильмов.`, 'success', true);
    } catch (error) {
      console.error('Ошибка JSON-выгрузки тегов:', error);
      showAuthMessage(`Ошибка JSON-выгрузки тегов: ${error.message || 'смотри консоль F12.'}`, 'error', true);
    }
  }

  function formatTaxonomyTagExportItemDetails(item) {
    const details = [];

    if (Array.isArray(item.families) && item.families.length > 1) {
      details.push(`семейства: ${item.families.join(', ')}`);
    }

    if (Number.isFinite(Number(item.weight))) {
      details.push(`вес: ${item.weight}`);
    }

    return details.length > 0 ? ` (${details.join('; ')})` : '';
  }

  function formatTaxonomyTagsMarkdownExport(exportData, exportedAt) {
    const sections = Array.isArray(exportData?.sections) ? exportData.sections : [];
    const reportLines = [
      '# Реестр тегов Хоррорейро',
      '',
      `Экспортировано: ${exportedAt}`,
      `Всего тегов: ${exportData?.total_tags || 0}`,
      ''
    ];

    sections.forEach(section => {
      const groups = Array.isArray(section.groups) ? section.groups : [];

      reportLines.push(`## ${section.title} (${section.count || 0})`, '');

      groups.forEach(group => {
        const tags = Array.isArray(group.tags) ? group.tags : [];

        reportLines.push(`### ${group.title} (${group.count || tags.length})`);

        tags.forEach(item => {
          reportLines.push(`- ${item.value}${formatTaxonomyTagExportItemDetails(item)}`);
        });

        reportLines.push('');
      });
    });

    return reportLines.join('\n').trimEnd() + '\n';
  }

  async function exportTaxonomyTagsRegistry() {
    try {
      const isTaxonomyLoaded = await ensureTaxonomyReady(
        'Экспорт тегов недоступен: не удалось загрузить таксономию.'
      );

      if (!isTaxonomyLoaded) {
        return;
      }

      const getTaxonomyTagExportData = window.HORROR_TAXONOMY?.helpers?.getTaxonomyTagExportData;

      if (typeof getTaxonomyTagExportData !== 'function') {
        showAuthMessage('Экспорт тегов недоступен: не найден реестр таксономии.', 'error', true);
        return;
      }

      const exportedAt = new Date().toISOString();
      const exportData = getTaxonomyTagExportData();
      const report = formatTaxonomyTagsMarkdownExport(exportData, exportedAt);
      const datePart = exportedAt.slice(0, 10);

      downloadTextFile(
        `horroreiro-taxonomy-tags-${datePart}.md`,
        report,
        'text/markdown;charset=utf-8'
      );

      showAuthMessage(`Экспорт тегов готов: ${exportData.total_tags || 0} значений.`, 'success', true);
    } catch (error) {
      console.error('Ошибка экспорта тегов:', error);
      showAuthMessage(`Ошибка экспорта тегов: ${error.message || 'смотри консоль F12.'}`, 'error', true);
    }
  }

  function countTaxonomyDiagnosticsWarnings(diagnostics) {
    return diagnostics.reduce((sum, item) => sum + item.warnings.length, 0);
  }

  function formatTaxonomyDiagnosticsReport(diagnostics, totalMoviesCount) {
    const warningsCount = countTaxonomyDiagnosticsWarnings(diagnostics);
    const reportLines = [
      'Диагностика тегов Хоррорейро',
      '',
      `Проверено фильмов: ${totalMoviesCount}`,
      `Проблемных фильмов: ${diagnostics.length}`,
      `Предупреждений: ${warningsCount}`,
      ''
    ];

    if (diagnostics.length === 0) {
      reportLines.push('Проблем не найдено.');
      return reportLines.join('\n');
    }

    diagnostics.forEach((item, index) => {
      reportLines.push(`${index + 1}. ${item.title || 'Без названия'}`);

      item.warnings.forEach(warning => {
        reportLines.push(`   — ${warning.message}`);

        if (Array.isArray(warning.expectedTags) && warning.expectedTags.length > 0) {
          reportLines.push(`     Ожидаемые теги: ${warning.expectedTags.join(', ')}`);
        }
      });

      reportLines.push('');
    });

    return reportLines.join('\n').trim();
  }

  async function runTaxonomyDiagnostics() {
    try {
      const isTaxonomyLoaded = await ensureTaxonomyReady(
        'Диагностика тегов недоступна: не удалось загрузить таксономию.'
      );

      if (!isTaxonomyLoaded) {
        return;
      }

      const validateTaxonomyMovies = window.HORROR_TAXONOMY?.helpers?.validateTaxonomyMovies;

      if (typeof validateTaxonomyMovies !== 'function') {
        showAuthMessage('Диагностика тегов недоступна: не найден validateTaxonomyMovies.', 'error', true);
        return;
      }

      const sortedMovies = await ensureMoviesForTaxonomyExport();

      if (sortedMovies.length === 0) {
        return;
      }

      const diagnostics = validateTaxonomyMovies(sortedMovies);
      const warningsCount = countTaxonomyDiagnosticsWarnings(diagnostics);
      const report = formatTaxonomyDiagnosticsReport(diagnostics, sortedMovies.length);

      console.groupCollapsed(`Диагностика тегов: ${diagnostics.length} фильмов, ${warningsCount} предупреждений`);
      console.log(report);
      console.log(diagnostics);
      console.groupEnd();

      if (diagnostics.length === 0) {
        showAuthMessage(`Диагностика тегов завершена: ${sortedMovies.length} фильмов, проблем не найдено.`, 'success', true);
        return;
      }

      const datePart = new Date().toISOString().slice(0, 10);

      downloadTextFile(
        `horroreiro-taxonomy-diagnostics-${datePart}.txt`,
        report,
        'text/plain;charset=utf-8'
      );

      showAuthMessage(`Диагностика тегов: ${diagnostics.length} фильмов, ${warningsCount} предупреждений. Отчёт скачан.`, 'error', true);
    } catch (error) {
      console.error('Ошибка диагностики тегов:', error);
      showAuthMessage(`Ошибка диагностики тегов: ${error.message || 'смотри консоль F12.'}`, 'error', true);
    }
  }

  function formatSimilarityAuditPair(pair, index) {
    const lines = [
      `${index + 1}. ${pair.movieA.title} ↔ ${pair.movieB.title}`,
      `   Score: ${pair.score}; tier: ${pair.tier}`,
      `   Lanes: ${pair.sharedLanes.length ? pair.sharedLanes.join(', ') : '—'}`,
      `   Canon: ${pair.sharedCanon.length ? pair.sharedCanon.join(', ') : '—'}`,
      `   Modifiers: ${pair.sharedModifiers.length ? pair.sharedModifiers.join(', ') : '—'}`,
      `   Broad families: ${pair.sharedBroadFamilies.length ? pair.sharedBroadFamilies.join(', ') : '—'}`
    ];

    if (pair.debug) {
      lines.push(
        `   Debug: canonCore=${Math.round(pair.debug.canonCore || 0)}, laneMultiplier=${pair.debug.laneMultiplier || 1}`
      );
    }

    return lines.join('\n');
  }

  function formatTaxonomySimilarityAuditReport(audit) {
    const lines = [
      'Аудит похожести Хоррорейро',
      '',
      `Проверено фильмов: ${audit.totalMovies}`,
      `Пар, прошедших gate: ${audit.passedPairsCount}`,
      `Фильмов без похожих: ${audit.moviesWithoutSimilar.length}`,
      `Подозрительных пар: ${audit.suspiciousPairs.length}`,
      '',
      'ТОП СИЛЬНЕЙШИХ ПАР',
      ''
    ];

    if (audit.topPairs.length === 0) {
      lines.push('—');
    } else {
      audit.topPairs.forEach((pair, index) => {
        lines.push(formatSimilarityAuditPair(pair, index));
        lines.push('');
      });
    }

    lines.push('');
    lines.push('ПОДОЗРИТЕЛЬНЫЕ ПАРЫ');
    lines.push('');

    if (audit.suspiciousPairs.length === 0) {
      lines.push('—');
    } else {
      audit.suspiciousPairs.forEach((pair, index) => {
        lines.push(formatSimilarityAuditPair(pair, index));
        lines.push('');
      });
    }

    lines.push('');
    lines.push('ФИЛЬМЫ БЕЗ ПОХОЖИХ');
    lines.push('');

    if (audit.moviesWithoutSimilar.length === 0) {
      lines.push('—');
    } else {
      audit.moviesWithoutSimilar.forEach(movie => {
        lines.push(`— ${movie.title}${movie.year ? ` (${movie.year})` : ''}`);
      });
    }

    lines.push('');
    lines.push('САМЫЕ ЧАСТЫЕ CANON-ТЕГИ');
    lines.push('');

    if (!audit.canonTags?.mostFrequent?.length) {
      lines.push('—');
    } else {
      audit.canonTags.mostFrequent.forEach(item => {
        lines.push(`— ${item.tag}: ${item.count}`);
      });
    }

    lines.push('');
    lines.push('CANON-ТЕГИ, КОТОРЫЕ ВСТРЕЧАЮТСЯ ОДИН РАЗ');
    lines.push('');

    if (!audit.canonTags?.singleUse?.length) {
      lines.push('—');
    } else {
      audit.canonTags.singleUse.forEach(item => {
        const movieTitle = item.movies?.[0]?.title || 'Без названия';
        lines.push(`— ${item.tag}: ${movieTitle}`);
      });
    }

    return lines.join('\n').trim();
  }

  async function runTaxonomySimilarityAudit() {
    try {
      const isTaxonomyLoaded = await ensureTaxonomyReady(
        'Аудит похожести недоступен: не удалось загрузить таксономию.'
      );

      if (!isTaxonomyLoaded) {
        return;
      }

      const getSimilarityAuditReport = window.HORROR_TAXONOMY?.helpers?.getSimilarityAuditReport;

      if (typeof getSimilarityAuditReport !== 'function') {
        showAuthMessage('Аудит похожести недоступен: не найден getSimilarityAuditReport.', 'error', true);
        return;
      }

      const sortedMovies = await ensureMoviesForTaxonomyExport();

      if (sortedMovies.length === 0) {
        return;
      }

      const similarityMovies = sortedMovies.map(movie => dependencies.getCatalogMovieSimilaritySource?.(movie));
      const audit = getSimilarityAuditReport(similarityMovies, {
        topPairsLimit: 20,
        suspiciousPairsLimit: 20,
        canonTagsLimit: 25
      });
      const report = formatTaxonomySimilarityAuditReport(audit);
      const datePart = new Date().toISOString().slice(0, 10);

      console.groupCollapsed(`Аудит похожести: ${audit.totalMovies} фильмов, ${audit.passedPairsCount} пар`);
      console.log(report);
      console.log(audit);
      console.groupEnd();

      downloadTextFile(
        `horroreiro-similarity-audit-${datePart}.txt`,
        report,
        'text/plain;charset=utf-8'
      );

      showAuthMessage(`Аудит похожести готов: ${audit.passedPairsCount} пар, ${audit.moviesWithoutSimilar.length} фильмов без похожих.`, 'success', true);
    } catch (error) {
      console.error('Ошибка аудита похожести:', error);
      showAuthMessage(`Ошибка аудита похожести: ${error.message || 'смотри консоль F12.'}`, 'error', true);
    }
  }

  function formatCanonCoverageCandidate(candidate) {
    return [
      `   — [${candidate.priorityLabel || candidate.priority || '—'}] ${candidate.label}`,
      `     Причина: ${candidate.reason}`,
      `     Триггеры: ${candidate.triggerTags.length ? candidate.triggerTags.join(', ') : '—'}`,
      `     Проверить теги: ${candidate.suggestedTags.join(', ')}`
    ].join('\n');
  }

  function formatCanonCoverageAuditSection(lines, title, items, priority) {
    const sectionItems = items
      .map(item => ({
        movie: item.movie,
        candidates: item.candidates.filter(candidate => candidate.priority === priority)
      }))
      .filter(item => item.candidates.length > 0);

    lines.push('');
    lines.push(title);
    lines.push('');

    if (sectionItems.length === 0) {
      lines.push('—');
      return;
    }

    sectionItems.forEach((item, index) => {
      const movieYear = item.movie.year ? ` (${item.movie.year})` : '';
      lines.push(`${index + 1}. ${item.movie.title}${movieYear}`);

      item.candidates.forEach(candidate => {
        lines.push(formatCanonCoverageCandidate(candidate));
      });

      lines.push('');
    });
  }

  function formatCanonCoverageAuditReport(audit) {
    const lines = [
      'Аудит canon-покрытия Хоррорейро',
      '',
      `Проверено фильмов: ${audit.totalMovies}`,
      `Фильмов с кандидатами: ${audit.moviesWithCandidates}`,
      `Групп кандидатов: ${audit.candidatesCount}`,
      `Высокий приоритет: ${audit.priorityCounts?.high || 0}`,
      `Средний приоритет: ${audit.priorityCounts?.medium || 0}`,
      `Низкий приоритет: ${audit.priorityCounts?.low || 0}`
    ];

    formatCanonCoverageAuditSection(
      lines,
      'ВЫСОКИЙ ПРИОРИТЕТ',
      audit.items,
      'high'
    );

    formatCanonCoverageAuditSection(
      lines,
      'СРЕДНИЙ ПРИОРИТЕТ',
      audit.items,
      'medium'
    );

    formatCanonCoverageAuditSection(
      lines,
      'НИЗКИЙ ПРИОРИТЕТ / СЛАБЫЕ НАПОМИНАНИЯ',
      audit.items,
      'low'
    );

    lines.push('');
    lines.push('ЧАСТО ПРЕДЛАГАЕМЫЕ CANON-ТЕГИ');
    lines.push('');

    if (!audit.suggestedTagsFrequency.length) {
      lines.push('—');
    } else {
      audit.suggestedTagsFrequency.forEach(item => {
        lines.push(`— ${item.tag}: ${item.count}`);
      });
    }

    return lines.join('\n').trim();
  }

  async function runTaxonomyCanonCoverageAudit() {
    try {
      const isTaxonomyLoaded = await ensureTaxonomyReady(
        'Аудит canon-покрытия недоступен: не удалось загрузить таксономию.'
      );

      if (!isTaxonomyLoaded) {
        return;
      }

      const getCanonCoverageAuditReport = window.HORROR_TAXONOMY?.helpers?.getCanonCoverageAuditReport;

      if (typeof getCanonCoverageAuditReport !== 'function') {
        showAuthMessage('Аудит canon-покрытия недоступен: не найден getCanonCoverageAuditReport.', 'error', true);
        return;
      }

      const sortedMovies = await ensureMoviesForTaxonomyExport();

      if (sortedMovies.length === 0) {
        return;
      }

      const audit = getCanonCoverageAuditReport(sortedMovies);
      const report = formatCanonCoverageAuditReport(audit);
      const datePart = new Date().toISOString().slice(0, 10);

      console.groupCollapsed(`Аудит canon-покрытия: ${audit.moviesWithCandidates} фильмов, ${audit.candidatesCount} групп кандидатов`);
      console.log(report);
      console.log(audit);
      console.groupEnd();

      downloadTextFile(
        `horroreiro-canon-coverage-audit-${datePart}.txt`,
        report,
        'text/plain;charset=utf-8'
      );

      showAuthMessage(`Аудит canon-покрытия готов: ${audit.moviesWithCandidates} фильмов с кандидатами.`, 'success', true);
    } catch (error) {
      console.error('Ошибка аудита canon-покрытия:', error);
      showAuthMessage(`Ошибка аудита canon-покрытия: ${error.message || 'смотри консоль F12.'}`, 'error', true);
    }
  }

  function syncTaxonomyPopoverControlsVisibility(options = {}) {
    const shouldShowTaxonomyControls = typeof options.shouldShow === 'boolean'
      ? options.shouldShow
      : Boolean(dependencies.shouldUseAuthenticatedUi?.() && dependencies.getIsAdmin?.());

    [
      taxonomyDiagnosticsButton,
      taxonomySimilarityAuditButton,
      taxonomyCanonCoverageAuditButton,
      taxonomyTagsExportButton,
      taxonomyJsonExportButton,
      taxonomyImportButton
    ].forEach(button => {
      if (button) {
        button.hidden = !shouldShowTaxonomyControls;
      }
    });
  }

  function appendTaxonomyPopoverControl(control) {
    const authPopoverMenu = dependencies.authPopoverMenu;

    if (!authPopoverMenu || !control) {
      return;
    }

    const logoutMenuButton = dependencies.logoutMenuButton;
    const insertBeforeNode = logoutMenuButton?.parentNode === authPopoverMenu
      ? logoutMenuButton
      : null;

    authPopoverMenu.insertBefore(control, insertBeforeNode);
  }

  function init(nextDependencies = {}) {
    dependencies = {
      ...dependencies,
      ...nextDependencies
    };

    const authPopoverMenu = dependencies.authPopoverMenu;

    if (!authPopoverMenu) {
      return false;
    }

    if (!taxonomyDiagnosticsButton) {
      taxonomyDiagnosticsButton = document.createElement('button');
      taxonomyDiagnosticsButton.type = 'button';
      taxonomyDiagnosticsButton.id = 'taxonomyDiagnosticsButton';
      taxonomyDiagnosticsButton.className = 'auth-popover-item taxonomy-popover-item';
      taxonomyDiagnosticsButton.textContent = 'Диагностика тегов';
      taxonomyDiagnosticsButton.title = 'Проверить теги всех фильмов и скачать отчёт с предупреждениями';

      taxonomyDiagnosticsButton.addEventListener('click', runTaxonomyDiagnostics);
    }

    if (!taxonomySimilarityAuditButton) {
      taxonomySimilarityAuditButton = document.createElement('button');
      taxonomySimilarityAuditButton.type = 'button';
      taxonomySimilarityAuditButton.id = 'taxonomySimilarityAuditButton';
      taxonomySimilarityAuditButton.className = 'auth-popover-item taxonomy-popover-item';
      taxonomySimilarityAuditButton.textContent = 'Аудит похожести';
      taxonomySimilarityAuditButton.title = 'Скачать отчёт по сильным, слабым и подозрительным похожим фильмам';

      taxonomySimilarityAuditButton.addEventListener('click', runTaxonomySimilarityAudit);
    }

    if (!taxonomyCanonCoverageAuditButton) {
      taxonomyCanonCoverageAuditButton = document.createElement('button');
      taxonomyCanonCoverageAuditButton.type = 'button';
      taxonomyCanonCoverageAuditButton.id = 'taxonomyCanonCoverageAuditButton';
      taxonomyCanonCoverageAuditButton.className = 'auth-popover-item taxonomy-popover-item';
      taxonomyCanonCoverageAuditButton.textContent = 'Аудит canon';
      taxonomyCanonCoverageAuditButton.title = 'Найти фильмы, где могут отсутствовать уже существующие canon-теги';

      taxonomyCanonCoverageAuditButton.addEventListener('click', runTaxonomyCanonCoverageAudit);
    }

    if (!taxonomyTagsExportButton) {
      taxonomyTagsExportButton = document.createElement('button');
      taxonomyTagsExportButton.type = 'button';
      taxonomyTagsExportButton.id = 'exportTaxonomyTagsButton';
      taxonomyTagsExportButton.className = 'auth-popover-item taxonomy-popover-item';
      taxonomyTagsExportButton.textContent = 'Экспорт тегов';
      taxonomyTagsExportButton.title = 'Скачать реестр всех заведённых тегов с группировкой по типам и семействам';

      taxonomyTagsExportButton.addEventListener('click', exportTaxonomyTagsRegistry);
    }

    if (!taxonomyJsonExportButton) {
      taxonomyJsonExportButton = document.createElement('button');
      taxonomyJsonExportButton.type = 'button';
      taxonomyJsonExportButton.id = 'exportTaxonomyJsonButton';
      taxonomyJsonExportButton.className = 'auth-popover-item taxonomy-popover-item';
      taxonomyJsonExportButton.textContent = 'Экспорт JSON';
      taxonomyJsonExportButton.title = 'Скачать JSON-выгрузку тегов для последующего импорта';

      taxonomyJsonExportButton.addEventListener('click', exportMovieTaxonomyJsonData);
    }

    if (!taxonomyImportFileInput) {
      taxonomyImportFileInput = document.createElement('input');
      taxonomyImportFileInput.type = 'file';
      taxonomyImportFileInput.accept = 'application/json,.json';
      taxonomyImportFileInput.className = 'taxonomy-import-file-input';

      taxonomyImportFileInput.addEventListener('change', handleTaxonomyImportFileChange);
    }

    if (!taxonomyImportButton) {
      taxonomyImportButton = document.createElement('button');
      taxonomyImportButton.type = 'button';
      taxonomyImportButton.id = 'importTaxonomyJsonButton';
      taxonomyImportButton.className = 'auth-popover-item taxonomy-popover-item taxonomy-import-button';
      taxonomyImportButton.textContent = 'Импорт JSON';
      taxonomyImportButton.title = 'Импортировать JSON-выгрузку тегов и массово обновить только теговые поля';

      taxonomyImportButton.addEventListener('click', () => {
        taxonomyImportFileInput.click();
      });
    }

    if (!taxonomyImportFileInput.parentNode) {
      authPopoverMenu.appendChild(taxonomyImportFileInput);
    }

    appendTaxonomyPopoverControl(taxonomyDiagnosticsButton);
    appendTaxonomyPopoverControl(taxonomySimilarityAuditButton);
    appendTaxonomyPopoverControl(taxonomyCanonCoverageAuditButton);
    appendTaxonomyPopoverControl(taxonomyTagsExportButton);
    appendTaxonomyPopoverControl(taxonomyJsonExportButton);
    appendTaxonomyPopoverControl(taxonomyImportButton);
    syncTaxonomyPopoverControlsVisibility();

    return true;
  }

  window.HORROREIRO_TAXONOMY_ADMIN = {
    init,
    syncVisibility: syncTaxonomyPopoverControlsVisibility,
    buildMovieTaxonomyExportBlock
  };
})();
