function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getCatalogPaginationState({ totalItems, currentPage, pageSize }) {
  const normalizedTotalItems = Math.max(0, Number(totalItems) || 0);
  const normalizedPageSize = Math.max(1, Number(pageSize) || 1);
  const totalPages = Math.max(1, Math.ceil(normalizedTotalItems / normalizedPageSize));
  const requestedPage = Math.max(1, Number(currentPage) || 1);
  const clampedPage = Math.min(requestedPage, totalPages);
  const startIndex = normalizedTotalItems > 0
    ? (clampedPage - 1) * normalizedPageSize
    : 0;
  const endIndex = Math.min(startIndex + normalizedPageSize, normalizedTotalItems);

  return {
    totalItems: normalizedTotalItems,
    totalPages,
    requestedPage,
    currentPage: clampedPage,
    startIndex,
    endIndex,
    startItemNumber: normalizedTotalItems > 0 ? startIndex + 1 : 0,
    endItemNumber: endIndex,
    hasMultiplePages: totalPages > 1
  };
}

function getCatalogPaginationSlots({
  matchMedia,
  defaultSlots,
  compactSlots,
  compactMediaQuery = '(max-width: 360px)'
} = {}) {
  return typeof matchMedia === 'function' && matchMedia(compactMediaQuery).matches
    ? compactSlots
    : defaultSlots;
}

function getCatalogPaginationPageItems(currentPage, totalPages, maxSlots) {
  const normalizedMaxSlots = Math.max(1, Number(maxSlots) || 1);
  const normalizedTotalPages = Math.max(1, Number(totalPages) || 1);
  const normalizedCurrentPage = Math.min(
    Math.max(1, Number(currentPage) || 1),
    normalizedTotalPages
  );

  if (normalizedTotalPages <= normalizedMaxSlots) {
    return Array.from({ length: normalizedTotalPages }, (_, index) => index + 1);
  }

  const edgeWindowSize = normalizedMaxSlots <= 4 ? 3 : 4;
  const pages = new Set([1, normalizedTotalPages, normalizedCurrentPage]);
  const neighborStart = Math.max(1, normalizedCurrentPage - 1);
  const neighborEnd = Math.min(normalizedTotalPages, normalizedCurrentPage + 1);

  for (let page = neighborStart; page <= neighborEnd; page += 1) {
    pages.add(page);
  }

  if (normalizedCurrentPage <= edgeWindowSize - 1) {
    for (let page = 1; page <= Math.min(normalizedTotalPages, edgeWindowSize); page += 1) {
      pages.add(page);
    }
  }

  if (normalizedCurrentPage >= normalizedTotalPages - edgeWindowSize + 2) {
    for (
      let page = Math.max(1, normalizedTotalPages - edgeWindowSize + 1);
      page <= normalizedTotalPages;
      page += 1
    ) {
      pages.add(page);
    }
  }

  return Array.from(pages)
    .sort((firstPage, secondPage) => firstPage - secondPage)
    .reduce((items, page, index, sortedPages) => {
      const previousPage = sortedPages[index - 1];

      if (previousPage && page - previousPage > 1) {
        items.push(`ellipsis-${previousPage}-${page}`);
      }

      items.push(page);
      return items;
    }, []);
}

function getCatalogPaginationButtonHtml({
  label,
  targetPage,
  isDisabled = false,
  extraClassName = '',
  ariaLabel = ''
}) {
  const disabledAttribute = isDisabled ? ' disabled aria-disabled="true"' : '';
  const ariaLabelAttribute = ariaLabel ? ` aria-label="${escapeHtml(ariaLabel)}"` : '';

  return `
    <button
      type="button"
      class="catalog-pagination-button ${extraClassName}"
      data-catalog-page="${targetPage}"
      ${ariaLabelAttribute}
      ${disabledAttribute}
    >${escapeHtml(label)}</button>
  `;
}

function getCatalogPaginationHtml(paginationState, { maxSlots } = {}) {
  const {
    currentPage,
    totalPages
  } = paginationState;
  const pageItems = getCatalogPaginationPageItems(currentPage, totalPages, maxSlots);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const pageButtonsHtml = pageItems.map(item => {
    if (typeof item === 'string') {
      return '<span class="catalog-pagination-ellipsis" aria-hidden="true">…</span>';
    }

    const isCurrentPage = item === currentPage;
    const currentAttribute = isCurrentPage ? ' aria-current="page"' : '';
    const activeClassName = isCurrentPage ? ' is-active' : '';

    return `
      <button
        type="button"
        class="catalog-pagination-button catalog-pagination-page${activeClassName}"
        data-catalog-page="${item}"
        aria-label="Страница ${item}"
        ${currentAttribute}
      >${item}</button>
    `;
  }).join('');

  return `
    <div class="catalog-pagination-controls" role="group" aria-label="Навигация по страницам каталога">
      ${getCatalogPaginationButtonHtml({
        label: '<',
        targetPage: Math.max(1, currentPage - 1),
        isDisabled: isFirstPage,
        extraClassName: 'catalog-pagination-arrow',
        ariaLabel: 'Перейти на предыдущую страницу каталога'
      })}
      <div class="catalog-pagination-pages" role="group" aria-label="Страницы каталога">
        ${pageButtonsHtml}
      </div>
      ${getCatalogPaginationButtonHtml({
        label: '>',
        targetPage: Math.min(totalPages, currentPage + 1),
        isDisabled: isLastPage,
        extraClassName: 'catalog-pagination-arrow',
        ariaLabel: 'Перейти на следующую страницу каталога'
      })}
    </div>
  `;
}

function getMoviesResultCountText(totalItems, paginationState) {
  if (!paginationState?.hasMultiplePages) {
    return `Найдено: ${totalItems}`;
  }

  return `Найдено: ${totalItems} · показано ${paginationState.startItemNumber}–${paginationState.endItemNumber}`;
}

export {
  getCatalogPaginationHtml,
  getCatalogPaginationPageItems,
  getCatalogPaginationSlots,
  getCatalogPaginationState,
  getMoviesResultCountText
};
