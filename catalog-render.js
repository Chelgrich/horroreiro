export function createCatalogRenderController(context = {}) {
  const {
    document: documentRef = globalThis.document,
    createMovieCard = () => documentRef.createElement('article'),
    getMovieAverageRating = () => 0,
    getMovieVotesCount = () => 0,
    getMonthName = value => String(value || '')
  } = context;

  function sortMoviesWithinMonth(movies, monthSortMode, monthSortDirection = 'desc') {
    const sortedMovies = [...(Array.isArray(movies) ? movies : [])];
    const directionMultiplier = monthSortDirection === 'asc' ? 1 : -1;

    if (monthSortMode === 'rating') {
      sortedMovies.sort((a, b) => {
        const ratingA = getMovieAverageRating(a.id);
        const ratingB = getMovieAverageRating(b.id);

        if (ratingA !== ratingB) {
          return (ratingA - ratingB) * directionMultiplier;
        }

        const votesA = getMovieVotesCount(a.id);
        const votesB = getMovieVotesCount(b.id);

        if (votesA !== votesB) {
          return (votesA - votesB) * directionMultiplier;
        }

        const orderA = a.sort_order ?? Infinity;
        const orderB = b.sort_order ?? Infinity;

        return monthSortDirection === 'asc'
          ? orderA - orderB
          : orderB - orderA;
      });

      return sortedMovies;
    }

    sortedMovies.sort((a, b) => {
      const orderA = a.sort_order ?? Infinity;
      const orderB = b.sort_order ?? Infinity;

      return monthSortDirection === 'asc'
        ? orderA - orderB
        : orderB - orderA;
    });

    return sortedMovies;
  }

  function createMonthSection({
    month,
    movies,
    initialReleaseDirection = 'desc',
    renderContext,
    getCardRenderOptions = () => ({})
  } = {}) {
    const monthSection = documentRef.createElement('section');
    const monthHeader = documentRef.createElement('div');
    const monthTitle = documentRef.createElement('h4');
    const monthControls = documentRef.createElement('div');
    const dateSortButton = documentRef.createElement('button');
    const ratingSortButton = documentRef.createElement('button');
    const monthCards = documentRef.createElement('div');

    monthSection.className = 'movies-month-section';
    monthHeader.className = 'movies-month-header';
    monthTitle.className = 'movies-month-title';
    monthControls.className = 'month-sort-controls';
    monthCards.className = 'movies-month-cards';

    monthTitle.textContent = getMonthName(month);

    dateSortButton.type = 'button';
    dateSortButton.className = 'month-sort-btn';

    ratingSortButton.type = 'button';
    ratingSortButton.className = 'month-sort-btn';

    monthControls.appendChild(dateSortButton);
    monthControls.appendChild(ratingSortButton);
    monthHeader.appendChild(monthTitle);
    monthHeader.appendChild(monthControls);
    monthSection.appendChild(monthHeader);
    monthSection.appendChild(monthCards);

    const monthSortState = {
      activeMode: 'release',
      directions: {
        release: initialReleaseDirection,
        rating: 'desc'
      }
    };

    const syncSortButtonsUi = () => {
      const dateDirection = monthSortState.directions.release;
      const ratingDirection = monthSortState.directions.rating;

      dateSortButton.classList.toggle('is-active', monthSortState.activeMode === 'release');
      ratingSortButton.classList.toggle('is-active', monthSortState.activeMode === 'rating');

      dateSortButton.textContent = `По дате ${dateDirection === 'desc' ? '↓' : '↑'}`;
      ratingSortButton.textContent = `По рейтингу ${ratingDirection === 'desc' ? '↓' : '↑'}`;

      dateSortButton.setAttribute(
        'aria-label',
        `Сортировка по дате: ${dateDirection === 'desc' ? 'по убыванию' : 'по возрастанию'}`
      );

      ratingSortButton.setAttribute(
        'aria-label',
        `Сортировка по рейтингу: ${ratingDirection === 'desc' ? 'по убыванию' : 'по возрастанию'}`
      );
    };

    const renderMonthCards = () => {
      const activeSortDirection = monthSortState.directions[monthSortState.activeMode];
      const sortedMonthMovies = sortMoviesWithinMonth(
        movies,
        monthSortState.activeMode,
        activeSortDirection
      );

      monthCards.innerHTML = '';

      sortedMonthMovies.forEach(movie => {
        monthCards.appendChild(createMovieCard(movie, renderContext, getCardRenderOptions(movie)));
      });

      syncSortButtonsUi();
    };

    dateSortButton.addEventListener('click', () => {
      if (monthSortState.activeMode === 'release') {
        monthSortState.directions.release = monthSortState.directions.release === 'desc' ? 'asc' : 'desc';
      } else {
        monthSortState.activeMode = 'release';
      }

      renderMonthCards();
    });

    ratingSortButton.addEventListener('click', () => {
      if (monthSortState.activeMode === 'rating') {
        monthSortState.directions.rating = monthSortState.directions.rating === 'desc' ? 'asc' : 'desc';
      } else {
        monthSortState.activeMode = 'rating';
      }

      renderMonthCards();
    });

    renderMonthCards();

    return monthSection;
  }

  function createMoviesYearTitle(year) {
    const yearTitle = documentRef.createElement('h3');
    yearTitle.className = 'movies-year-title';
    yearTitle.textContent = year;

    return yearTitle;
  }

  function createCatalogMoviesFragment({
    pageMovies = [],
    viewMode = 'list',
    sortMode = 'default',
    renderContext = null,
    getCardRenderOptions = () => ({})
  } = {}) {
    const moviesFragment = documentRef.createDocumentFragment();

    if (viewMode === 'list') {
      pageMovies.forEach(movie => {
        moviesFragment.appendChild(createMovieCard(movie, renderContext, getCardRenderOptions(movie)));
      });

      return moviesFragment;
    }

    let lastYear = null;
    let currentMonth = null;
    let currentMonthMovies = [];
    const defaultMonthReleaseDirection = sortMode === 'oldest' ? 'asc' : 'desc';

    const flushCurrentMonth = () => {
      if (!currentMonth || currentMonthMovies.length === 0) {
        return;
      }

      moviesFragment.appendChild(
        createMonthSection({
          month: currentMonth,
          movies: currentMonthMovies,
          initialReleaseDirection: defaultMonthReleaseDirection,
          renderContext,
          getCardRenderOptions
        })
      );
      currentMonth = null;
      currentMonthMovies = [];
    };

    pageMovies.forEach(movie => {
      const year = movie.release_year;
      const month = movie.release_month;

      if (year !== lastYear) {
        flushCurrentMonth();
        moviesFragment.appendChild(createMoviesYearTitle(year));
        lastYear = year;
      }

      if (month !== currentMonth) {
        flushCurrentMonth();
        currentMonth = month;
      }

      currentMonthMovies.push(movie);
    });

    flushCurrentMonth();
    return moviesFragment;
  }

  function getCatalogDomRenderSignature({
    dataVersion = 0,
    viewMode = 'list',
    sortMode = 'default',
    filteredTotal = 0,
    currentPage = 1,
    paginationState = null,
    pageMovies = [],
    filterState = null
  } = {}) {
    return JSON.stringify({
      dataVersion,
      viewMode,
      sortMode,
      filteredTotal,
      currentPage: paginationState?.currentPage || currentPage,
      startIndex: paginationState?.startIndex || 0,
      endIndex: paginationState?.endIndex || 0,
      pageMovieIds: (Array.isArray(pageMovies) ? pageMovies : []).map(movie => String(movie?.id || '')),
      filterState
    });
  }

  return {
    createCatalogMoviesFragment,
    createMonthSection,
    createMoviesYearTitle,
    getCatalogDomRenderSignature,
    sortMoviesWithinMonth
  };
}
