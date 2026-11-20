export function getYouTubeTrailerEmbedUrl(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  const url = /^https?:\/\//i.test(text) ? text : `https://${text}`;
  let videoId = '';
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./i, '').toLowerCase();
    const [section, id] = parsed.pathname.split('/').filter(Boolean);
    if (host === 'youtu.be') {
      videoId = section || '';
    } else if (['youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com'].includes(host)) {
      if (parsed.pathname === '/watch') videoId = parsed.searchParams.get('v') || '';
      else if (['embed', 'shorts', 'live'].includes(section)) videoId = id || '';
    }
  } catch {
    videoId = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([A-Za-z0-9_-]+)/i)?.[1] || '';
  }
  videoId = videoId.trim();
  return /^[A-Za-z0-9_-]{6,}$/.test(videoId)
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    : '';
}

export function getMoviePageTrailerButtonHtml({ pending = false } = {}) {
  return `
    <button type="button" class="secondary-button movie-page-rate-trigger movie-page-trailer-button" ${pending ? 'disabled' : 'data-movie-page-trailer-open="true"'}>
      <span class="movie-page-trailer-play-icon" aria-hidden="true"></span>
      <span>Смотреть трейлер</span>
    </button>
  `;
}

export function getMoviePageIntroHtml(movie, escapeHtml) {
  const synopsis = String(movie?.synopsis || '').trim();
  return `
    <div class="movie-page-title-main">
      <h1 class="movie-page-title">${escapeHtml(movie.title)}</h1>
      ${movie.original_title ? `<div class="movie-page-original-title">${escapeHtml(movie.original_title)}</div>` : ''}
      ${synopsis ? `<div class="movie-page-synopsis-block"><div class="movie-page-synopsis-text">${escapeHtml(synopsis)}</div></div>` : ''}
    </div>
  `;
}

function replaceMoviePageContent(root, movieId, html) {
  const earlyLayout = root.querySelector('.movie-page-server-fallback[data-server-rendered] .movie-page-layout');
  if (earlyLayout?.dataset.movieId !== String(movieId)) {
    root.innerHTML = html;
    return;
  }

  const template = root.ownerDocument.createElement('template');
  template.innerHTML = html;
  const intro = earlyLayout.querySelector('.movie-page-title-main');
  const nextIntro = template.content.querySelector('.movie-page-title-main');
  if (intro?.isEqualNode(nextIntro)) nextIntro.replaceWith(intro);

  const poster = earlyLayout.querySelector('img.movie-page-poster');
  const nextPoster = template.content.querySelector('img[data-movie-page-poster-image]');
  if (poster && nextPoster && (!poster.complete || poster.naturalWidth > 0)) {
    if (poster.dataset.originalPosterSrc === nextPoster.dataset.originalPosterSrc) {
      poster.alt = nextPoster.alt;
      poster.dataset.moviePagePosterImage = 'true';
      nextPoster.replaceWith(poster);
    } else if (poster.naturalWidth > 0) {
      // Keep the painted poster in place until a preferred gallery image is ready.
      poster.alt = '';
      poster.setAttribute('aria-hidden', 'true');
      poster.classList.add('movie-page-server-poster-preview');
      nextPoster.after(poster);
      nextPoster.addEventListener('load', () => { void nextPoster.decode().then(() => poster.remove(), () => {}); });
    }
  }

  root.replaceChildren(template.content);
}

export function createMoviePageShellController(context = {}) {
  const {
    escapeHtml,
    formatPublicCommaSeparatedValues,
    formatGenreNamesForPublicDisplay,
    formatTextArrayForDetail,
    formatRuntimeMinutes,
    getMovieAverageRating,
    getMovieVotesCount,
    getCurrentUserRating,
    getCurrentUserMovieState,
    getMoviePageExternalLinksHtml,
    getMoviePageReviewsSectionHtml,
    getMoviePageCommentsSectionHtml,
    getMoviePosterImages,
    getMovieDisplayPosterGalleryImages = null,
    getPosterImageAttributeHtml,
    getVotesLabel,
    getMoviePageDirectorHtml,
    buildCompanyPageUrl,
    normalizeCompanyNameKey,
    getCurrentUser,
    isMovieRatingBusy,
    isMovieWatchlistBusy,
    getStoredPosterGalleryIndex
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

  function getMovieCompanyLinkRows(movie, role) {
    return (Array.isArray(movie?.movie_companies) ? movie.movie_companies : [])
      .filter(row => String(row?.role || '') === role)
      .map(row => {
        const company = Array.isArray(row?.companies) ? row.companies[0] : row?.companies;

        if (!company?.id || !company?.slug) {
          return null;
        }

        return {
          position: Number.isFinite(Number(row?.position)) ? Number(row.position) : Number.MAX_SAFE_INTEGER,
          company,
          href: buildCompanyPageUrl(company)
        };
      })
      .filter(Boolean)
      .sort((firstRow, secondRow) => firstRow.position - secondRow.position);
  }

  function getMoviePageCompanyListHtml(movie, role, values) {
    const displayNames = (Array.isArray(values) ? values : [])
      .map(value => String(value || '').trim())
      .filter(value => value && formatTextArrayForDetail([value]));

    const linkRows = getMovieCompanyLinkRows(movie, role);

    if (displayNames.length === 0 && linkRows.length === 0) {
      return '';
    }

    const usedRowIndexes = new Set();

    const claimRow = index => {
      if (!linkRows[index] || usedRowIndexes.has(index)) {
        return null;
      }

      usedRowIndexes.add(index);
      return linkRows[index];
    };
    const claimRowByName = name => {
      const nameKey = normalizeCompanyNameKey(name);

      if (!nameKey) {
        return null;
      }

      const rowIndex = linkRows.findIndex((row, index) => (
        !usedRowIndexes.has(index) &&
        normalizeCompanyNameKey(row.company?.name) === nameKey
      ));

      return rowIndex >= 0 ? claimRow(rowIndex) : null;
    };
    const renderCompanyItem = (fallbackName, row = null) => {
      const companyName = String(row?.company?.name || '').trim();
      const label = fallbackName || companyName;
      const href = String(row?.href || '').trim();

      if (!label) {
        return '';
      }

      if (!href) {
        return escapeHtml(label);
      }

      const title = companyName && companyName !== label ? ` title="${escapeHtml(companyName)}"` : '';
      return `<a class="movie-page-meta-link" href="${escapeHtml(href)}"${title}>${escapeHtml(label)}</a>`;
    };
    const items = displayNames.map((name, index) =>
      renderCompanyItem(name, claimRowByName(name) || claimRow(index))
    );

    linkRows.forEach((row, index) => {
      if (!usedRowIndexes.has(index)) {
        items.push(renderCompanyItem('', claimRow(index)));
      }
    });

    return items.filter(Boolean).join(', ');
  }

  function getMoviePageCompanyMetaHtml(movie) {
    return [
      ['production', 'Производство'],
      ['distribution', 'Дистрибуция'],
      ['russian_distribution', 'Дистрибуция в России']
    ].map(([role, label]) => {
      const names = getMoviePageCompanyListHtml(movie, role, movie[role]);
      return names ? `<div class="movie-page-meta-item"><span>${label}:</span> ${names}</div>` : '';
    }).join('');
  }

  function renderMoviePageCompanyMeta(root, movie) {
    const mount = root.querySelector('[data-movie-page-companies]');
    if (mount?.closest('.movie-page-layout')?.dataset.movieId !== String(movie.id)) {
      return;
    }

    const next = mount.cloneNode(false);
    next.innerHTML = getMoviePageCompanyMetaHtml(movie);
    if (!mount.isEqualNode(next)) mount.replaceChildren(...next.childNodes);
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
      runtimeLabel: formatRuntimeMinutes(movie?.runtime_minutes),
      averageRating: getMovieAverageRating(movie?.id),
      votesCount: getMovieVotesCount(movie?.id),
      currentUserRating: getCurrentUserRating(movie?.id),
      userMovieState: getCurrentUserMovieState(movie?.id),
      primaryPerceivedTagLabel: getMoviePageSubgenreLabel(movie),
      formatsLabel: getMoviePageFormatsLabel(movie),
      externalLinksHtml: getMoviePageExternalLinksHtml(movie),
      trailerEmbedUrl: getYouTubeTrailerEmbedUrl(movie?.trailer_url),
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
          ${trailerEmbedUrl ? getMoviePageTrailerButtonHtml() : ''}
          </div>
        `;
  }

  function getMoviePageMainColumnHtml(movie, viewModel) {
    const {
      genres,
      countries,
      runtimeLabel,
      averageRating,
      votesCount,
      currentUserRating,
      primaryPerceivedTagLabel,
      formatsLabel,
      externalLinksHtml,
      isRatingBusy
    } = viewModel;

    return `
      <div class="movie-page-main-column">
        <div class="movie-page-title-block">
        <div class="movie-page-title-row">
        ${getMoviePageIntroHtml(movie, escapeHtml)}

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
            <div class="movie-page-company-meta" data-movie-page-companies>${getMoviePageCompanyMetaHtml(movie)}</div>
            ${
              runtimeLabel
                ? `<div class="movie-page-meta-item"><span>Время:</span> ${escapeHtml(runtimeLabel)}</div>`
                : ''
            }
          </div>

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
                  <div class="movie-page-synopsis-block movie-page-skeleton-synopsis">
                    <span class="movie-text-skeleton movie-page-skeleton-synopsis-line movie-page-skeleton-synopsis-line-1"></span>
                    <span class="movie-text-skeleton movie-page-skeleton-synopsis-line movie-page-skeleton-synopsis-line-2"></span>
                    <span class="movie-text-skeleton movie-page-skeleton-synopsis-line movie-page-skeleton-synopsis-line-3"></span>
                  </div>
                </div>

                <div class="movie-page-summary-panel movie-page-skeleton-summary">
                  <span class="movie-text-skeleton movie-page-skeleton-rating"></span>
                  <span class="movie-text-skeleton movie-page-skeleton-rate-button"></span>
                </div>
              </div>

              <div class="movie-page-meta-list movie-page-skeleton-meta-list">
                ${metaLinesHtml}
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
    getYouTubeTrailerEmbedUrl,
    replaceMoviePageContent,
    renderMoviePageCompanyMeta,
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
