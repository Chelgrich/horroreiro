export function createMoviePageInteractionsController(context = {}) {
  const {
    moviePage = null,
    getYouTubeTrailerEmbedUrl = () => '',
    getMoviePagePosterGalleryImages = () => [],
    getPosterImageData = publicUrl => ({ src: publicUrl }),
    bindPosterFallbackImages = () => {},
    showAppMessage = () => {},
    syncBodyScrollLock = () => {},
    toggleMovieWatchlist = () => {},
    openMobileRatingModal = () => {}
  } = context;

  let movieTrailerModal = null;
  let movieTrailerFrame = null;
  let movieTrailerModalTitle = null;
  const currentMoviePagePosterIndexByMovieId = new Map();

  function ensureMovieTrailerModal() {
    if (movieTrailerModal) {
      return;
    }

    movieTrailerModal = document.createElement('div');
    movieTrailerModal.id = 'movieTrailerModal';
    movieTrailerModal.className = 'modal movie-trailer-modal';
    movieTrailerModal.innerHTML = `
      <div class="modal-backdrop movie-trailer-modal-backdrop" data-movie-trailer-close="true"></div>
      <div
        class="modal-dialog movie-trailer-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="movieTrailerModalTitle"
      >
        <div class="modal-header movie-trailer-modal-header">
          <h2 id="movieTrailerModalTitle" class="movie-trailer-modal-title">Трейлер</h2>
          <button
            type="button"
            class="modal-close-button movie-trailer-modal-close"
            data-movie-trailer-close="true"
            aria-label="Закрыть"
          ></button>
        </div>

        <div class="movie-trailer-frame-shell">
          <iframe
            class="movie-trailer-frame"
            title="Трейлер фильма"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </div>
    `;

    const pageRoot = document.querySelector('.page') || document.body;
    pageRoot.appendChild(movieTrailerModal);

    movieTrailerFrame = movieTrailerModal.querySelector('.movie-trailer-frame');
    movieTrailerModalTitle = movieTrailerModal.querySelector('#movieTrailerModalTitle');

    movieTrailerModal.querySelectorAll('[data-movie-trailer-close="true"]').forEach(element => {
      element.addEventListener('click', () => {
        closeMovieTrailerModal();
      });
    });
  }

  function isMovieTrailerModalOpen() {
    return Boolean(movieTrailerModal?.classList.contains('is-open'));
  }

  function closeMovieTrailerModal() {
    if (!movieTrailerModal) {
      return;
    }

    movieTrailerModal.classList.remove('is-open');

    if (movieTrailerFrame) {
      movieTrailerFrame.removeAttribute('src');
    }

    syncBodyScrollLock();
  }

  function syncMovieTrailerModalOffset() {
    if (!movieTrailerModal) {
      return;
    }

    const header = document.querySelector('.page-header');
    const headerRect = header?.getBoundingClientRect?.();
    const headerHeight = Math.ceil(headerRect?.height || header?.offsetHeight || 0);
    const topOffset = Math.max(16, headerHeight + 12);

    movieTrailerModal.style.setProperty('--movie-trailer-modal-top-offset', `${topOffset}px`);
  }

  function openMovieTrailerModal(movie) {
    const trailerEmbedUrl = getYouTubeTrailerEmbedUrl(movie?.trailer_url);

    if (!trailerEmbedUrl) {
      showAppMessage('Трейлер недоступен: нужна ссылка YouTube.', 'error', true);
      return;
    }

    ensureMovieTrailerModal();

    const title = String(movie?.title || '').trim();
    const year = Number(movie?.year ?? movie?.release_year);
    const titleWithYear = title && Number.isFinite(year)
      ? `${title} (${year})`
      : title;
    const modalTitle = titleWithYear ? `Трейлер: ${titleWithYear}` : 'Трейлер';

    if (movieTrailerModalTitle) {
      movieTrailerModalTitle.textContent = modalTitle;
    }

    if (movieTrailerFrame) {
      movieTrailerFrame.src = trailerEmbedUrl;
      movieTrailerFrame.title = modalTitle;
    }

    syncMovieTrailerModalOffset();
    movieTrailerModal.classList.add('is-open');
    syncBodyScrollLock();
  }

  function applyPosterImageDataToElement(posterImage, publicUrl, presetName = 'detail') {
    if (!posterImage || !publicUrl) {
      return;
    }

    const imageData = getPosterImageData(publicUrl, presetName);

    posterImage.dataset.posterFallbackApplied = 'false';
    posterImage.src = imageData.src || publicUrl;

    if (imageData.srcset) {
      posterImage.srcset = imageData.srcset;
    } else {
      posterImage.removeAttribute('srcset');
    }

    if (imageData.sizes) {
      posterImage.sizes = imageData.sizes;
    } else {
      posterImage.removeAttribute('sizes');
    }

    if (imageData.fallbackSrc) {
      posterImage.dataset.posterFallbackSrc = imageData.fallbackSrc;
    } else {
      delete posterImage.dataset.posterFallbackSrc;
    }

    if (imageData.originalSrc) {
      posterImage.dataset.originalPosterSrc = imageData.originalSrc;
    } else {
      delete posterImage.dataset.originalPosterSrc;
    }
  }

  function restartMoviePagePosterSwitchAnimation(posterImage) {
    if (
      !posterImage ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    posterImage.classList.remove('is-switching');
    void posterImage.offsetWidth;
    posterImage.classList.add('is-switching');
    posterImage.addEventListener('animationend', () => {
      posterImage.classList.remove('is-switching');
    }, { once: true });
  }

  function prepareMoviePagePosterSwitch(wrapper, posterImage, shouldAnimatePoster) {
    if (!wrapper || !posterImage || !shouldAnimatePoster) {
      return () => {};
    }

    const loadToken = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

    wrapper.dataset.moviePagePosterLoadToken = loadToken;
    wrapper.classList.add('is-loading');
    posterImage.classList.remove('is-switching');

    const finishLoading = () => {
      if (wrapper.dataset.moviePagePosterLoadToken !== loadToken) {
        return;
      }

      wrapper.classList.remove('is-loading');
      delete wrapper.dataset.moviePagePosterLoadToken;
      restartMoviePagePosterSwitchAnimation(posterImage);
    };

    const handleLoadError = () => {
      if (wrapper.dataset.moviePagePosterLoadToken !== loadToken) {
        return;
      }

      if (posterImage.dataset.posterFallbackApplied === 'true') {
        posterImage.addEventListener('error', finishLoading, { once: true });
        return;
      }

      finishLoading();
    };

    posterImage.addEventListener('load', finishLoading, { once: true });
    posterImage.addEventListener('error', handleLoadError, { once: true });

    return () => {
      if (posterImage.complete && posterImage.naturalWidth > 0) {
        finishLoading();
      }
    };
  }

  function updateMoviePagePosterGallery(wrapper, movie, nextIndex) {
    if (!wrapper || !movie?.id) {
      return;
    }

    const images = getMoviePagePosterGalleryImages(movie);

    if (images.length === 0) {
      return;
    }

    const normalizedIndex = Math.max(0, Math.min(images.length - 1, Number(nextIndex) || 0));
    const currentImage = images[normalizedIndex];
    const posterImage = wrapper.querySelector('[data-movie-page-poster-image="true"]');
    const counter = wrapper.querySelector('[data-movie-page-poster-counter="true"]');
    const prevButton = wrapper.querySelector('[data-movie-page-poster-gallery-step="-1"]');
    const nextButton = wrapper.querySelector('[data-movie-page-poster-gallery-step="1"]');
    const previousIndex = Number(wrapper.dataset.moviePagePosterIndex || 0);
    const shouldAnimatePoster = normalizedIndex !== previousIndex;

    currentMoviePagePosterIndexByMovieId.set(String(movie.id), normalizedIndex);
    wrapper.dataset.moviePagePosterIndex = String(normalizedIndex);

    if (posterImage) {
      const finishPosterSwitchIfLoaded = prepareMoviePagePosterSwitch(
        wrapper,
        posterImage,
        shouldAnimatePoster
      );

      applyPosterImageDataToElement(posterImage, currentImage.imageUrl, 'detail');
      posterImage.alt = `${currentImage.label} фильма ${movie.title || ''}`.trim();
      finishPosterSwitchIfLoaded();
    }

    if (counter) {
      counter.textContent = `${normalizedIndex + 1} / ${images.length}`;
    }

    if (prevButton) {
      prevButton.hidden = normalizedIndex === 0;
    }

    if (nextButton) {
      nextButton.hidden = normalizedIndex >= images.length - 1;
    }
  }

  function bindMoviePagePosterGalleryEvents(movie, rootElement = moviePage) {
    const wrapper = rootElement?.querySelector('[data-movie-page-poster-gallery="true"]');

    if (!wrapper || !movie?.id) {
      return;
    }

    if (wrapper.dataset.moviePagePosterGalleryBound === 'true') {
      return;
    }

    wrapper.dataset.moviePagePosterGalleryBound = 'true';
    wrapper.addEventListener('click', event => {
      const button = event.target.closest('[data-movie-page-poster-gallery-step]');

      if (!button) {
        return;
      }

      updateMoviePagePosterGallery(
        wrapper,
        movie,
        Number(wrapper.dataset.moviePagePosterIndex || 0) + Number(button.dataset.moviePagePosterGalleryStep || 0)
      );
    });
  }

  function bindMoviePageHeaderEvents(movie, rootElement = moviePage) {
    if (!rootElement || !movie) {
      return;
    }

    const watchlistIconButton = rootElement.querySelector('[data-movie-page-watchlist-icon-toggle="true"]');
    const mobileRatingButton = rootElement.querySelector('[data-open-mobile-rating="true"]');
    const trailerButton = rootElement.querySelector('[data-movie-page-trailer-open="true"]');

    if (watchlistIconButton && watchlistIconButton.dataset.moviePageWatchlistIconBound !== 'true') {
      watchlistIconButton.dataset.moviePageWatchlistIconBound = 'true';
      watchlistIconButton.addEventListener('click', () => {
        toggleMovieWatchlist(movie.id);
      });
    }

    if (mobileRatingButton && mobileRatingButton.dataset.openMobileRatingBound !== 'true') {
      mobileRatingButton.dataset.openMobileRatingBound = 'true';
      mobileRatingButton.addEventListener('click', () => {
        openMobileRatingModal(movie);
      });
    }

    if (trailerButton && trailerButton.dataset.moviePageTrailerBound !== 'true') {
      trailerButton.dataset.moviePageTrailerBound = 'true';
      trailerButton.addEventListener('click', () => {
        openMovieTrailerModal(movie);
      });
    }

    bindPosterFallbackImages(rootElement);
    bindMoviePagePosterGalleryEvents(movie, rootElement);
  }

  return {
    getStoredPosterGalleryIndex: movieId => currentMoviePagePosterIndexByMovieId.get(String(movieId || '')) || 0,
    isMovieTrailerModalOpen,
    openMovieTrailerModal,
    closeMovieTrailerModal,
    syncMovieTrailerModalOffset,
    bindMoviePageHeaderEvents
  };
}
