export function createMoviePageShellController(context = {}) {
  const {
    escapeHtml = value => String(value ?? ''),
    formatPublicCommaSeparatedValues = values => (Array.isArray(values) ? values : []).join(', '),
    formatGenreNamesForPublicDisplay = values => (Array.isArray(values) ? values : []).join(', '),
    formatTextArrayForDetail = value => Array.isArray(value) ? value.join(', ') : String(value || ''),
    formatRuntimeMinutes = value => String(value || ''),
    getMovieAverageRating = () => 0,
    getMovieVotesCount = () => 0,
    getCurrentUserRating = () => null,
    getCurrentUserMovieState = () => ({
      isWatched: false,
      isInWatchlist: false
    }),
    getMoviePageExternalLinksHtml = () => '',
    getYouTubeTrailerEmbedUrl = () => '',
    getMoviePageReviewsSectionHtml = () => '',
    getMoviePageCommentsSectionHtml = () => '',
    getMoviePosterImages = () => [],
    getMovieDisplayPosterGalleryImages = null,
    getPosterImageAttributeHtml = (imageUrl) => `src="${escapeHtml(imageUrl)}"`,
    getVotesLabel = () => 'оценок',
    getMoviePageDirectorHtml = () => '-',
    getCurrentUser = () => null,
    isMovieRatingBusy = () => false,
    isMovieWatchlistBusy = () => false,
    getStoredPosterGalleryIndex = () => 0
  } = context;

  function getMoviePageSubgenreLabel(movie) {
    if (!Array.isArray(movie?.tags_perceived) || movie.tags_perceived.length === 0) {
      return '';
    }

    return formatPublicCommaSeparatedValues(movie.tags_perceived.slice(0, 2));
  }

  function getMoviePageFormatsLabel(movie) {
    if (!Array.isArray(movie?.formats) || movie.formats.length === 0) {
      return '';
    }

    return movie.formats
      .map(format => String(format || '').trim())
      .filter(Boolean)
      .join(', ');
  }

  function buildMoviePageViewModel(movie, { includeSocialSections = true } = {}) {
    const genreNames = (Array.isArray(movie?.movie_genres) ? movie.movie_genres : [])
      .map(item => item?.genres?.name)
      .filter(Boolean);
    const countryNames = (Array.isArray(movie?.movie_countries) ? movie.movie_countries : [])
      .map(item => item?.countries?.name)
      .filter(Boolean);

    return {
      genres: formatGenreNamesForPublicDisplay(genreNames),
      countries: countryNames.join(', '),
      production: formatTextArrayForDetail(movie?.production),
      distribution: formatTextArrayForDetail(movie?.distribution),
      russianDistribution: formatTextArrayForDetail(movie?.russian_distribution),
      runtimeLabel: formatRuntimeMinutes(movie?.runtime_minutes),
      averageRating: getMovieAverageRating(movie?.id),
      votesCount: getMovieVotesCount(movie?.id),
      currentUserRating: getCurrentUserRating(movie?.id),
      userMovieState: getCurrentUserMovieState(movie?.id),
      primaryPerceivedTagLabel: getMoviePageSubgenreLabel(movie),
      formatsLabel: getMoviePageFormatsLabel(movie),
      externalLinksHtml: getMoviePageExternalLinksHtml(movie),
      trailerEmbedUrl: getYouTubeTrailerEmbedUrl(movie?.trailer_url),
      synopsis: String(movie?.synopsis || '').trim(),
      isRatingBusy: isMovieRatingBusy(movie?.id),
      isWatchlistBusy: isMovieWatchlistBusy(movie?.id),
      reviewsSectionHtml: includeSocialSections ? getMoviePageReviewsSectionHtml(movie) : '',
      commentsSectionHtml: includeSocialSections ? getMoviePageCommentsSectionHtml(movie) : ''
    };
  }

  function getMoviePagePosterGalleryImages(movie) {
    if (typeof getMovieDisplayPosterGalleryImages === 'function') {
      return getMovieDisplayPosterGalleryImages(movie);
    }

    if (!movie?.id) {
      return [];
    }

    const uniqueImageUrls = new Set();
    const images = [];

    const addImage = (imageUrl, label) => {
      const normalizedImageUrl = String(imageUrl || '').trim();

      if (!normalizedImageUrl || uniqueImageUrls.has(normalizedImageUrl)) {
        return;
      }

      uniqueImageUrls.add(normalizedImageUrl);
      images.push({
        imageUrl: normalizedImageUrl,
        label
      });
    };

    addImage(movie.poster_url, 'Основной постер');
    getMoviePosterImages(movie.id).forEach((row, index) => {
      addImage(row.image_url, `Дополнительное изображение ${index + 1}`);
    });

    return images;
  }

  function getMoviePagePosterGalleryIndex(movieId, imagesCount) {
    const storedIndex = Number(getStoredPosterGalleryIndex(movieId) || 0);

    if (!Number.isFinite(storedIndex) || storedIndex < 0) {
      return 0;
    }

    if (storedIndex >= imagesCount) {
      return Math.max(0, imagesCount - 1);
    }

    return storedIndex;
  }

  function getMoviePagePosterGalleryButtonHtml(direction, { isHidden, title }) {
    const buttonClassName = direction < 0
      ? 'user-page-rail-button-prev movie-page-poster-gallery-button-prev'
      : 'user-page-rail-button-next movie-page-poster-gallery-button-next';

    return `
      <button
        type="button"
        class="user-page-rail-button ${buttonClassName} movie-page-poster-gallery-button"
        data-movie-page-poster-gallery-step="${direction}"
        aria-label="${escapeHtml(title)}"
        title="${escapeHtml(title)}"
        ${isHidden ? 'hidden' : ''}
      >
        <span class="user-page-rail-button-icon" aria-hidden="true"></span>
      </button>
    `;
  }

  function getMoviePagePosterColumnHtml(movie, viewModel) {
    const {
      userMovieState,
      isWatchlistBusy,
      trailerEmbedUrl
    } = viewModel;
    const galleryImages = getMoviePagePosterGalleryImages(movie);
    const currentGalleryIndex = getMoviePagePosterGalleryIndex(movie.id, galleryImages.length);
    const currentGalleryImage = galleryImages[currentGalleryIndex] || null;

    return `
      <div class="movie-page-poster-column">
        <div
          class="movie-page-poster-wrapper"
          data-movie-page-poster-gallery="true"
          data-movie-page-poster-index="${currentGalleryIndex}"
        >
          ${
            currentGalleryImage
              ? `
                <img
                  class="movie-page-poster"
                  data-movie-page-poster-image="true"
                  ${getPosterImageAttributeHtml(currentGalleryImage.imageUrl, 'detail')}
                  alt="${escapeHtml(`${currentGalleryImage.label} фильма ${movie.title}`)}"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                >
              `
              : `<div class="movie-poster-placeholder">Нет постера</div>`
          }

          ${
            galleryImages.length > 1
              ? `
                ${getMoviePagePosterGalleryButtonHtml(-1, {
                  isHidden: currentGalleryIndex === 0,
                  title: 'Предыдущее изображение'
                })}
                ${getMoviePagePosterGalleryButtonHtml(1, {
                  isHidden: currentGalleryIndex >= galleryImages.length - 1,
                  title: 'Следующее изображение'
                })}
                <div class="movie-page-poster-gallery-counter" data-movie-page-poster-counter="true">
                  ${currentGalleryIndex + 1} / ${galleryImages.length}
                </div>
              `
              : ''
          }

          ${
            getCurrentUser() && !userMovieState.isWatched
              ? `
                <button
                  type="button"
                  class="movie-page-watchlist-icon ${userMovieState.isInWatchlist ? 'is-active' : ''}"
                  data-movie-page-watchlist-icon-toggle="true"
                  aria-label="${userMovieState.isInWatchlist ? 'Убрать из списка смотреть позже' : 'Добавить в список смотреть позже'}"
                  title="${userMovieState.isInWatchlist ? 'Убрать из списка смотреть позже' : 'Добавить в список смотреть позже'}"
                  ${isWatchlistBusy ? 'disabled' : ''}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              `
              : ''
          }

          ${
            userMovieState.isWatched
              ? `
                <div class="movie-page-watched-icon" aria-label="Просмотрено" title="Просмотрено">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12.5L9.5 17L19 7.5"></path>
                  </svg>
                </div>
              `
              : ''
          }
          </div>
          ${
            trailerEmbedUrl
              ? `
                <button
                  type="button"
                  class="secondary-button movie-page-rate-trigger movie-page-trailer-button"
                  data-movie-page-trailer-open="true"
                >
                  <span class="movie-page-trailer-play-icon" aria-hidden="true"></span>
                  <span>Смотреть трейлер</span>
                </button>
              `
              : ''
          }
          </div>
        `;
  }

  function getMoviePageMainColumnHtml(movie, viewModel) {
    const {
      genres,
      countries,
      production,
      distribution,
      russianDistribution,
      runtimeLabel,
      averageRating,
      votesCount,
      currentUserRating,
      primaryPerceivedTagLabel,
      formatsLabel,
      externalLinksHtml,
      synopsis,
      isRatingBusy
    } = viewModel;

    return `
      <div class="movie-page-main-column">
        <div class="movie-page-title-block">
        <div class="movie-page-title-row">
        <div class="movie-page-title-main">
          <h1 class="movie-page-title">${escapeHtml(movie.title)}</h1>

          ${
            movie.original_title
              ? `<div class="movie-page-original-title">${escapeHtml(movie.original_title)}</div>`
              : ''
          }
        </div>

            <div class="movie-page-summary-panel">
              <div class="movie-rating-summary movie-page-rating-summary">
                <div class="movie-rating-summary-main movie-page-rating-summary-main">
                  <span class="movie-rating-value">${averageRating.toFixed(1)}</span>
                  <span class="movie-rating-meta">(${votesCount} ${getVotesLabel(votesCount)})</span>
                </div>
              </div>

              ${
                getCurrentUser()
                  ? `
                    <button
                      type="button"
                      class="secondary-button movie-page-rate-trigger"
                      data-open-mobile-rating="true"
                      ${isRatingBusy ? 'disabled' : ''}
                    >
                      ${
                        currentUserRating !== null
                          ? `Изменить <span class="movie-page-rate-value">${currentUserRating}</span><span class="movie-page-rate-trigger-star">★</span>`
                          : 'Оценить'
                      }
                    </button>
                  `
                  : ''
              }
            </div>
          </div>

          <div class="movie-page-meta-list">
            <div class="movie-page-meta-item"><span>Год:</span> <strong>${movie.year ?? '-'}</strong></div>
            <div class="movie-page-meta-item"><span>Режиссёр:</span> ${getMoviePageDirectorHtml(movie)}</div>
            <div class="movie-page-meta-item"><span>Жанры:</span> ${genres ? escapeHtml(genres) : '-'}</div>
            <div class="movie-page-meta-item"><span>Поджанры:</span> ${primaryPerceivedTagLabel ? escapeHtml(primaryPerceivedTagLabel) : '-'}</div>
            ${
              formatsLabel
                ? `<div class="movie-page-meta-item"><span>Формат:</span> ${escapeHtml(formatsLabel)}</div>`
                : ''
            }
            <div class="movie-page-meta-item"><span>Страны:</span> ${countries ? escapeHtml(countries) : '-'}</div>
            ${
              production
                ? `<div class="movie-page-meta-item"><span>Производство:</span> ${escapeHtml(production)}</div>`
                : ''
            }
            ${
              distribution
                ? `<div class="movie-page-meta-item"><span>Дистрибуция:</span> ${escapeHtml(distribution)}</div>`
                : ''
            }
            ${
              russianDistribution
                ? `<div class="movie-page-meta-item"><span>Дистрибуция в России:</span> ${escapeHtml(russianDistribution)}</div>`
                : ''
            }
            ${
              runtimeLabel
                ? `<div class="movie-page-meta-item"><span>Время:</span> ${escapeHtml(runtimeLabel)}</div>`
                : ''
            }
          </div>

          ${
            synopsis
              ? `
                <div class="movie-page-synopsis-block">
                  <div class="movie-page-synopsis-text">${escapeHtml(synopsis)}</div>
                </div>
              `
              : ''
          }

          ${
            externalLinksHtml
              ? `
                <div class="movie-page-external-links-block">
                  ${externalLinksHtml}
                </div>
              `
              : ''
          }
        </div>
      </div>
    `;
  }

  function getMoviePageHeaderHtml(movie, viewModel) {
    return `
      <article class="movie-page-layout" data-movie-id="${escapeHtml(movie.id)}">
        ${getMoviePagePosterColumnHtml(movie, viewModel)}
        ${getMoviePageMainColumnHtml(movie, viewModel)}
      </article>
    `;
  }

  function getMoviePageSkeletonHtml() {
    const metaLinesHtml = Array.from({ length: 10 }, (_, index) => `
      <div class="movie-page-skeleton-meta-line">
        <span class="movie-text-skeleton movie-page-skeleton-label"></span>
        <span class="movie-text-skeleton movie-page-skeleton-value movie-page-skeleton-value-${index + 1}"></span>
      </div>
    `).join('');
    const externalLinksHtml = [
      'movie-page-skeleton-link-wide',
      'movie-page-skeleton-link-wide',
      'movie-page-skeleton-link-icon',
      'movie-page-skeleton-link-icon',
    ].map((className) => `<span class="movie-text-skeleton movie-page-skeleton-link ${className}"></span>`).join('');

    return `
      <div class="movie-page-stack movie-page-stack-skeleton" aria-busy="true" aria-live="polite">
        <span class="movie-page-skeleton-status">Загружаем фильм...</span>
        <article class="movie-page-layout movie-page-layout-skeleton" aria-hidden="true">
          <div class="movie-page-poster-column">
            <div class="movie-page-poster-wrapper movie-poster-wrapper-skeleton">
              <div class="movie-poster-skeleton" aria-hidden="true"></div>
            </div>
            <span class="movie-text-skeleton movie-page-skeleton-action"></span>
          </div>

          <div class="movie-page-main-column">
            <div class="movie-page-title-block">
              <div class="movie-page-title-row">
                <div class="movie-page-title-main">
                  <span class="movie-text-skeleton movie-page-skeleton-title"></span>
                  <span class="movie-text-skeleton movie-page-skeleton-original-title"></span>
                </div>

                <div class="movie-page-summary-panel movie-page-skeleton-summary">
                  <span class="movie-text-skeleton movie-page-skeleton-rating"></span>
                  <span class="movie-text-skeleton movie-page-skeleton-rate-button"></span>
                </div>
              </div>

              <div class="movie-page-meta-list movie-page-skeleton-meta-list">
                ${metaLinesHtml}
              </div>

              <div class="movie-page-synopsis-block movie-page-skeleton-synopsis">
                <span class="movie-text-skeleton movie-page-skeleton-synopsis-line movie-page-skeleton-synopsis-line-1"></span>
                <span class="movie-text-skeleton movie-page-skeleton-synopsis-line movie-page-skeleton-synopsis-line-2"></span>
                <span class="movie-text-skeleton movie-page-skeleton-synopsis-line movie-page-skeleton-synopsis-line-3"></span>
              </div>

              <div class="movie-page-external-links-block movie-page-skeleton-links">
                ${externalLinksHtml}
              </div>
            </div>
          </div>
        </article>

        <section class="movie-page-reviews-block movie-page-skeleton-section" aria-hidden="true">
          <span class="movie-text-skeleton movie-page-skeleton-section-title"></span>
          <div class="movie-page-skeleton-panel"></div>
        </section>

        <section class="movie-page-comments-block movie-page-skeleton-section" aria-hidden="true">
          <span class="movie-text-skeleton movie-page-skeleton-section-title"></span>
          <div class="movie-page-skeleton-panel movie-page-skeleton-panel-short"></div>
        </section>
      </div>
    `;
  }

  return {
    getMoviePageSubgenreLabel,
    getMoviePageFormatsLabel,
    buildMoviePageViewModel,
    getMoviePagePosterGalleryImages,
    getMoviePagePosterGalleryIndex,
    getMoviePagePosterGalleryButtonHtml,
    getMoviePagePosterColumnHtml,
    getMoviePageMainColumnHtml,
    getMoviePageHeaderHtml,
    getMoviePageSkeletonHtml
  };
}
