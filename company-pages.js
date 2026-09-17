export function createCompanyPagesController(context = {}) {
  const {
    companyAdminPage = null,
    companyPage = null,
    supabaseClient = null,
    companyRoles = {},
    companyPublicSelect = '',
    companyAdminSelect = '',
    getAreCompaniesAvailable = () => true,
    setAreCompaniesAvailable = () => {},
    getCurrentCompanyPageData = () => null,
    setCurrentCompanyPageData = () => {},
    getCurrentUser = () => null,
    getIsAdmin = () => false,
    hasWarmStartedPageDom = () => false,
    shouldUseAuthenticatedUi = () => false,
    restoreSession = async () => null,
    trackEmailConfirmedLoginIfNeeded = () => {},
    bindSharedAuthStateListener = () => {},
    openAuthModal = () => {},
    escapeHtml = value => String(value ?? ''),
    isCompaniesUnavailableError = () => false,
    normalizeCompanyRow = row => row || null,
    normalizeCompanyNameKey = value => String(value || '').trim().toLowerCase(),
    getCompanyDisplayName = company => String(company?.name || '').trim() || 'Без названия',
    getCompanyRoleLabel = role => String(role || '').trim(),
    getCompanyRoleConfig = role => companyRoles[String(role || '').trim()] || null,
    buildCompanyAdminPageUrl = () => '/production',
    buildCompanyPageUrl = () => '/company',
    buildCatalogPageUrl = () => '/',
    buildUniqueCompanySlug = async name => String(name || '').trim().toLowerCase(),
    fetchAdminCompanyRows = async () => [],
    fetchCompanyById = async () => null,
    fetchMovieCompanyRowsForRole = async () => [],
    fetchMovieCompanyRowsForCompany = async () => [],
    fetchMoviesByIdsWithSelect = async () => [],
    ensurePreferredPosterImagesForMovies = async () => {},
    getSortedMoviesCopy = movies => [...(Array.isArray(movies) ? movies : [])],
    cacheCatalogMovies = () => {},
    movieCatalogSelect = '',
    createMovieCardRenderContext = () => ({ searchQuery: '', queryWords: [], highlightText: value => value }),
    createMovieCard = movie => {
      const card = document.createElement('article');
      card.textContent = String(movie?.title || '');
      return card;
    },
    bindMoviePosterLoadStates = () => {},
    bindPosterFallbackImages = () => {},
    handleCatalogCardClick = () => {},
    handleCatalogCardAuxClick = () => {},
    handleCatalogRatingStarMouseOver = () => {},
    handleCatalogRatingStarMouseOut = () => {},
    showAppMessage = () => {},
    markLocalDataMutation = () => {},
    persistCurrentSecondaryPageDomSnapshot = () => {}
  } = context;

  let companyModal = null;
  let companyForm = null;
  let companyIdInput = null;
  let companyNameInput = null;
  let companyCountryInput = null;
  let companyFormMessage = null;
  let companySubmitButton = null;
  let isCompanyFormSubmitting = false;
  let currentAdminRole = '';
  let currentAdminRows = [];

  function areCompaniesAvailable() {
    return getAreCompaniesAvailable() !== false;
  }

  function markCompaniesUnavailable() {
    setAreCompaniesAvailable(false);
  }

  function getAdminRoleFromRoute() {
    const queryRole = String(new URLSearchParams(window.location.search).get('role') || '').trim();
    const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
    const filename = pathname.split('/').pop() || '';

    if (getCompanyRoleConfig(queryRole)) {
      return queryRole;
    }

    return Object.values(companyRoles).find(roleConfig => (
      pathname === roleConfig.path ||
      filename === roleConfig.localPath ||
      filename === `${roleConfig.key}.html`
    ))?.key || 'production';
  }

  function getCompanyPageRouteSlug() {
    const searchParams = new URLSearchParams(window.location.search);
    const pathSlugMatch = window.location.pathname.match(/\/company\/([^/]+)\/?$/);
    const pathSlug = pathSlugMatch ? decodeURIComponent(pathSlugMatch[1] || '').trim() : '';
    const querySlug = String(searchParams.get('slug') || '').trim();

    return pathSlug || querySlug;
  }

  function getMovieIdsFromRows(rows = []) {
    return Array.from(new Set(
      (Array.isArray(rows) ? rows : [])
        .map(row => String(row?.movie_id || '').trim())
        .filter(Boolean)
    ));
  }

  function getCompanyCountLabel(count) {
    const numericCount = Number(count) || 0;
    const mod10 = numericCount % 10;
    const mod100 = numericCount % 100;

    if (mod10 === 1 && mod100 !== 11) {
      return `${numericCount} фильм`;
    }

    if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) {
      return `${numericCount} фильма`;
    }

    return `${numericCount} фильмов`;
  }

  function getCompanyListCountLabel(count) {
    const numericCount = Number(count) || 0;
    const mod10 = numericCount % 10;
    const mod100 = numericCount % 100;

    if (mod10 === 1 && mod100 !== 11) {
      return `${numericCount} компания`;
    }

    if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) {
      return `${numericCount} компании`;
    }

    return `${numericCount} компаний`;
  }

  function setCurrentPageData(data) {
    setCurrentCompanyPageData(data || null);
  }

  function renderCompanyAdminLoading() {
    if (companyAdminPage) {
      companyAdminPage.innerHTML = '<div class="company-page-loading-state">Загрузка компаний...</div>';
    }
  }

  function renderCompanyAdminAuthGate() {
    if (!companyAdminPage) {
      return;
    }

    companyAdminPage.innerHTML = `
      <div class="secondary-page-empty-state">
        <p>Войдите в аккаунт администратора, чтобы открыть список компаний.</p>
        <button type="button" class="secondary-button" data-company-admin-action="login">Войти</button>
      </div>
    `;
  }

  function renderCompanyAdminForbidden() {
    if (companyAdminPage) {
      companyAdminPage.innerHTML = '<div class="secondary-page-empty-state">Эта страница доступна только администратору.</div>';
    }
  }

  function renderCompanyAdminUnavailable() {
    if (companyAdminPage) {
      companyAdminPage.innerHTML = '<div class="secondary-page-empty-state">Страницы компаний пока недоступны. Нужно применить movie-companies-setup.sql в Supabase.</div>';
    }
  }

  function renderCompanyAdminError() {
    if (companyAdminPage) {
      companyAdminPage.innerHTML = '<div class="secondary-page-empty-state">Не удалось загрузить компании. Попробуй обновить страницу.</div>';
    }
  }

  function renderCompanyAdminPage({ role, companies = [] } = {}) {
    if (!companyAdminPage) {
      return;
    }

    const roleConfig = getCompanyRoleConfig(role) || getCompanyRoleConfig('production');
    const rows = Array.isArray(companies) ? companies : [];
    const title = roleConfig?.pageTitle || 'Компании';
    const cardsHtml = rows.length
      ? rows.map(item => {
          const company = item.company;
          const name = getCompanyDisplayName(company);

          return `
            <article class="company-admin-card">
              <a class="company-admin-card-main" href="${escapeHtml(buildCompanyPageUrl(company))}">
                <span class="company-admin-card-name">${escapeHtml(name)}</span>
                <span class="company-admin-card-meta">${escapeHtml(getCompanyCountLabel(item.count))}</span>
              </a>
              <div class="company-admin-card-actions">
                <button
                  type="button"
                  class="icon-button company-admin-edit-button"
                  data-company-admin-action="edit"
                  data-company-id="${escapeHtml(company.id)}"
                  aria-label="Редактировать компанию ${escapeHtml(name)}"
                  title="Редактировать"
                >
                  <span aria-hidden="true">✎</span>
                </button>
              </div>
            </article>
          `;
        }).join('')
      : '<div class="company-page-empty-state">Компаний в этой роли пока нет.</div>';

    companyAdminPage.innerHTML = `
      <section class="company-admin-page-toolbar">
        <div>
          <p class="company-admin-page-kicker">${escapeHtml(getCompanyListCountLabel(rows.length))}</p>
          <p class="company-admin-page-note">Количество в карточке считается только по роли страницы.</p>
        </div>
        <button type="button" class="secondary-button" data-company-admin-action="refresh">Обновить</button>
      </section>
      <h2 class="company-admin-page-subtitle">${escapeHtml(title)}</h2>
      <div class="company-admin-grid">${cardsHtml}</div>
    `;
  }

  async function loadCompanyAdminPage() {
    if (!companyAdminPage) {
      return;
    }

    currentAdminRole = getAdminRoleFromRoute();

    if (!shouldUseAuthenticatedUi() || !getCurrentUser()?.id) {
      renderCompanyAdminAuthGate();
      return;
    }

    if (!getIsAdmin()) {
      renderCompanyAdminForbidden();
      return;
    }

    if (!hasWarmStartedPageDom()) {
      renderCompanyAdminLoading();
    }

    try {
      const rows = await fetchMovieCompanyRowsForRole(currentAdminRole);
      const companiesById = new Map();

      rows.forEach(row => {
        const company = normalizeCompanyRow(row?.companies);
        const companyId = String(row?.company_id || company?.id || '').trim();

        if (!company || !companyId) {
          return;
        }

        const item = companiesById.get(companyId) || {
          company,
          count: 0
        };

        item.count += 1;
        companiesById.set(companyId, item);
      });

      currentAdminRows = [...companiesById.values()]
        .sort((first, second) => (
          getCompanyDisplayName(first.company).localeCompare(getCompanyDisplayName(second.company), 'ru')
        ));

      renderCompanyAdminPage({
        role: currentAdminRole,
        companies: currentAdminRows
      });
      persistCurrentSecondaryPageDomSnapshot();
    } catch (error) {
      if (isCompaniesUnavailableError(error)) {
        markCompaniesUnavailable();
        renderCompanyAdminUnavailable();
        return;
      }

      console.error('Company admin page load failed:', error);
      renderCompanyAdminError();
    }
  }

  async function fetchCompanyBySlug(slug) {
    const normalizedSlug = String(slug || '').trim();

    if (!normalizedSlug || !areCompaniesAvailable() || !supabaseClient) {
      return null;
    }

    const { data, error } = await supabaseClient
      .from('companies')
      .select(companyPublicSelect || '*')
      .eq('slug', normalizedSlug)
      .maybeSingle();

    if (error) {
      if (isCompaniesUnavailableError(error)) {
        markCompaniesUnavailable();
        return null;
      }

      throw error;
    }

    return normalizeCompanyRow(data);
  }

  async function loadCompanyMovies(companyId) {
    const relationRows = await fetchMovieCompanyRowsForCompany(companyId);
    const movieIds = getMovieIdsFromRows(relationRows);

    if (movieIds.length === 0) {
      return {
        relationRows,
        moviesById: new Map()
      };
    }

    const movies = await fetchMoviesByIdsWithSelect(movieIds, movieCatalogSelect);

    await ensurePreferredPosterImagesForMovies(movies);
    cacheCatalogMovies(movies);

    return {
      relationRows,
      moviesById: new Map(movies.map(movie => [String(movie.id), movie]))
    };
  }

  function renderCompanyPageLoading() {
    if (companyPage) {
      companyPage.innerHTML = '<div class="company-page-loading-state">Загрузка компании...</div>';
    }
  }

  function renderCompanyPageUnavailable() {
    if (companyPage) {
      companyPage.innerHTML = '<div class="secondary-page-empty-state">Страницы компаний пока недоступны. Нужно применить movie-companies-setup.sql в Supabase.</div>';
    }
  }

  function renderCompanyPageNotFound() {
    if (!companyPage) {
      return;
    }

    companyPage.innerHTML = `
      <div class="secondary-page-empty-state">
        <p>Компания не найдена.</p>
      </div>
    `;
  }

  function renderCompanyPageError() {
    if (companyPage) {
      companyPage.innerHTML = '<div class="secondary-page-empty-state">Не удалось загрузить карточку компании. Попробуй обновить страницу.</div>';
    }
  }

  function getMoviesForRole(role, relationRows = [], moviesById = new Map()) {
    const roleRows = relationRows.filter(row => row?.role === role);
    const movies = roleRows
      .map(row => moviesById.get(String(row.movie_id || '')))
      .filter(Boolean);

    return getSortedMoviesCopy(movies, 'default');
  }

  function renderCompanyMoviesGrid(movies = []) {
    const renderContext = createMovieCardRenderContext('');
    const fragment = document.createDocumentFragment();

    movies.forEach((movie, index) => {
      const card = createMovieCard(movie, renderContext, {
        priorityPoster: index < 8
      });

      fragment.appendChild(card);
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'company-page-movies-grid';
    wrapper.dataset.companyPageMoviesGrid = 'true';
    wrapper.appendChild(fragment);

    return wrapper.outerHTML;
  }

  function renderCompanyRoleSection(role, relationRows, moviesById) {
    const movies = getMoviesForRole(role, relationRows, moviesById);

    if (movies.length === 0) {
      return '';
    }

    return `
      <section class="company-page-movies-section">
        <div class="company-page-section-header">
          <h2>${escapeHtml(getCompanyRoleLabel(role))}</h2>
          <span>${escapeHtml(getCompanyCountLabel(movies.length))}</span>
        </div>
        ${renderCompanyMoviesGrid(movies)}
      </section>
    `;
  }

  function bindCompanyMovieGridEvents() {
    if (!companyPage) {
      return;
    }

    companyPage.querySelectorAll('[data-company-page-movies-grid="true"]').forEach(grid => {
      grid.addEventListener('click', handleCatalogCardClick);
      grid.addEventListener('auxclick', handleCatalogCardAuxClick);
      grid.addEventListener('mouseover', handleCatalogRatingStarMouseOver);
      grid.addEventListener('mouseout', handleCatalogRatingStarMouseOut);
    });

    bindMoviePosterLoadStates(companyPage);
    bindPosterFallbackImages(companyPage);
  }

  function renderCompanyPage(data = getCurrentCompanyPageData()) {
    if (!companyPage || !data?.company) {
      return;
    }

    const { company, relationRows = [], moviesById = new Map() } = data;
    const country = String(company.country || '').trim();
    const sectionsHtml = Object.values(companyRoles)
      .map(roleConfig => renderCompanyRoleSection(roleConfig.key, relationRows, moviesById))
      .filter(Boolean)
      .join('');

    companyPage.innerHTML = `
      <div class="company-page-layout">
        <div class="company-page-title-block">
          <h1 class="company-page-title">${escapeHtml(getCompanyDisplayName(company))}</h1>
          ${country ? `
            <div class="company-page-meta-list">
              <div class="company-page-meta-item"><span>Страна:</span> ${escapeHtml(country)}</div>
            </div>
          ` : ''}
          ${
            getIsAdmin()
              ? `<button type="button" class="secondary-button company-page-edit-button" data-company-page-action="edit" data-company-id="${escapeHtml(company.id)}">Редактировать</button>`
              : ''
          }
        </div>
      </div>
      ${sectionsHtml || '<div class="company-page-empty-state">Фильмов для этой компании пока нет.</div>'}
    `;

    bindCompanyMovieGridEvents();
  }

  async function loadCompanyPage() {
    if (!companyPage) {
      return;
    }

    const slug = getCompanyPageRouteSlug();

    if (!slug) {
      renderCompanyPageNotFound();
      return;
    }

    if (!hasWarmStartedPageDom()) {
      renderCompanyPageLoading();
    }

    try {
      const company = await fetchCompanyBySlug(slug);

      if (!company) {
        renderCompanyPageNotFound();
        return;
      }

      const moviesData = await loadCompanyMovies(company.id);
      const data = {
        company,
        ...moviesData
      };

      setCurrentPageData(data);
      renderCompanyPage(data);
      persistCurrentSecondaryPageDomSnapshot();
    } catch (error) {
      if (isCompaniesUnavailableError(error)) {
        markCompaniesUnavailable();
        renderCompanyPageUnavailable();
        return;
      }

      console.error('Company page load failed:', error);
      renderCompanyPageError();
    }
  }

  function ensureCompanyModal() {
    if (companyModal) {
      return;
    }

    companyModal = document.createElement('div');
    companyModal.id = 'companyModal';
    companyModal.className = 'modal company-modal';
    companyModal.innerHTML = `
      <div class="modal-backdrop" data-company-modal-close="true"></div>
      <div class="modal-dialog company-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="companyModalTitle">
        <div class="modal-header">
          <h2 id="companyModalTitle">Компания</h2>
          <button type="button" class="modal-close-button" data-company-modal-close="true" aria-label="Закрыть"></button>
        </div>
        <form class="company-form" data-company-form="true">
          <input type="hidden" data-company-id="true">
          <div class="form-field">
            <label for="companyName">Наименование компании:</label>
            <input id="companyName" type="text" data-company-name="true" required>
          </div>
          <div class="form-field">
            <label for="companyCountry">Страна:</label>
            <input id="companyCountry" type="text" data-company-country="true">
          </div>
          <div class="form-actions">
            <button type="submit" data-company-submit="true">Сохранить</button>
            <button type="button" class="secondary-button form-mode-button" data-company-modal-close="true">Отмена</button>
          </div>
          <p class="form-message" data-company-form-message="true"></p>
        </form>
      </div>
    `;

    document.body.appendChild(companyModal);

    companyForm = companyModal.querySelector('[data-company-form="true"]');
    companyIdInput = companyModal.querySelector('[data-company-id="true"]');
    companyNameInput = companyModal.querySelector('[data-company-name="true"]');
    companyCountryInput = companyModal.querySelector('[data-company-country="true"]');
    companyFormMessage = companyModal.querySelector('[data-company-form-message="true"]');
    companySubmitButton = companyModal.querySelector('[data-company-submit="true"]');

    companyModal.querySelectorAll('[data-company-modal-close="true"]').forEach(element => {
      element.addEventListener('click', closeCompanyModal);
    });

    companyForm?.addEventListener('submit', saveCompanyFromModal);
  }

  function setCompanyFormMessage(message = '', type = '') {
    if (!companyFormMessage) {
      return;
    }

    companyFormMessage.textContent = message;
    companyFormMessage.classList.remove('is-error', 'is-success');

    if (type) {
      companyFormMessage.classList.add(`is-${type}`);
    }
  }

  function setCompanyFormSubmitting(isSubmitting) {
    isCompanyFormSubmitting = Boolean(isSubmitting);

    [companyNameInput, companyCountryInput].forEach(input => {
      if (input) {
        input.disabled = isCompanyFormSubmitting;
      }
    });

    if (companySubmitButton) {
      companySubmitButton.disabled = isCompanyFormSubmitting;
      companySubmitButton.textContent = isCompanyFormSubmitting ? 'Сохраняю...' : 'Сохранить';
    }
  }

  function openCompanyModal(company) {
    ensureCompanyModal();

    const normalizedCompany = normalizeCompanyRow(company) || {};

    companyModal.classList.add('is-open');
    document.body.classList.add('modal-open');

    if (companyIdInput) {
      companyIdInput.value = normalizedCompany.id || '';
    }

    if (companyNameInput) {
      companyNameInput.value = normalizedCompany.name || '';
    }

    if (companyCountryInput) {
      companyCountryInput.value = normalizedCompany.country || '';
    }

    setCompanyFormMessage();
    setCompanyFormSubmitting(false);
    companyNameInput?.focus();
  }

  function closeCompanyModal() {
    if (!companyModal || isCompanyFormSubmitting) {
      return;
    }

    companyModal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }

  async function findDuplicateCompanyByName(name, excludeCompanyId = '') {
    const nameKey = normalizeCompanyNameKey(name);

    if (!nameKey || !supabaseClient) {
      return null;
    }

    let query = supabaseClient
      .from('companies')
      .select(companyAdminSelect || '*')
      .eq('name_key', nameKey)
      .limit(1);

    if (excludeCompanyId) {
      query = query.neq('id', excludeCompanyId);
    }

    const { data, error } = await query;

    if (error) {
      if (isCompaniesUnavailableError(error)) {
        markCompaniesUnavailable();
        return null;
      }

      throw error;
    }

    return normalizeCompanyRow(data?.[0]);
  }

  async function saveCompanyFromModal(event) {
    event.preventDefault();

    const companyId = String(companyIdInput?.value || '').trim();
    const name = String(companyNameInput?.value || '').trim();
    const country = String(companyCountryInput?.value || '').trim();

    if (!companyId) {
      setCompanyFormMessage('Компания не найдена. Обнови страницу.', 'error');
      return;
    }

    if (!name) {
      setCompanyFormMessage('Наименование компании обязательно.', 'error');
      companyNameInput?.focus();
      return;
    }

    setCompanyFormSubmitting(true);

    try {
      const duplicateCompany = await findDuplicateCompanyByName(name, companyId);

      if (duplicateCompany) {
        setCompanyFormMessage('Компания с таким названием уже есть.', 'error');
        return;
      }

      const existingCompany = await fetchCompanyById(companyId);
      const shouldRegenerateSlug = !existingCompany?.slug || getCompanyDisplayName(existingCompany) !== name;
      const payload = {
        name,
        name_key: normalizeCompanyNameKey(name),
        country: country || null,
        ...(shouldRegenerateSlug ? { slug: await buildUniqueCompanySlug(name, companyId) } : {})
      };
      const { data, error } = await supabaseClient
        .from('companies')
        .update(payload)
        .eq('id', companyId)
        .select(companyAdminSelect || '*')
        .single();

      if (error) {
        throw error;
      }

      const savedCompany = normalizeCompanyRow(data);

      markLocalDataMutation(`company-update:${companyId}`);
      setCompanyFormMessage('Сохранено.', 'success');
      isCompanyFormSubmitting = false;
      closeCompanyModal();

      if (companyPage && getCurrentCompanyPageData()?.company?.id === savedCompany?.id) {
        const currentSlug = getCompanyPageRouteSlug();

        if (savedCompany?.slug && savedCompany.slug !== currentSlug) {
          window.location.href = buildCompanyPageUrl(savedCompany);
          return;
        }

        await loadCompanyPage();
        return;
      }

      if (companyAdminPage) {
        await loadCompanyAdminPage();
      }
    } catch (error) {
      if (isCompaniesUnavailableError(error)) {
        markCompaniesUnavailable();
      }

      console.error('Company save failed:', error);
      setCompanyFormMessage(error?.message || 'Не удалось сохранить компанию.', 'error');
    } finally {
      setCompanyFormSubmitting(false);
    }
  }

  async function openCompanyModalById(companyId) {
    const normalizedCompanyId = String(companyId || '').trim();

    if (!normalizedCompanyId) {
      return;
    }

    const fallbackCompany = currentAdminRows
      .map(item => item.company)
      .find(company => String(company?.id) === normalizedCompanyId)
      || getCurrentCompanyPageData()?.company;

    try {
      const company = await fetchCompanyById(normalizedCompanyId);

      openCompanyModal(company || fallbackCompany);
    } catch (error) {
      console.error('Company edit load failed:', error);

      if (fallbackCompany) {
        openCompanyModal(fallbackCompany);
        setCompanyFormMessage('Не удалось обновить данные перед редактированием. Проверь изменения перед сохранением.', 'error');
        return;
      }

      showAppMessage('Не удалось открыть карточку компании.', 'error');
    }
  }

  function handleCompanyPagesClick(event) {
    const adminAction = event.target?.closest?.('[data-company-admin-action]');

    if (adminAction && companyAdminPage?.contains(adminAction)) {
      event.preventDefault();

      const action = String(adminAction.dataset.companyAdminAction || '').trim();

      if (action === 'login') {
        openAuthModal();
        return true;
      }

      if (action === 'refresh') {
        void loadCompanyAdminPage();
        return true;
      }

      if (action === 'edit') {
        void openCompanyModalById(adminAction.dataset.companyId);
        return true;
      }
    }

    const pageAction = event.target?.closest?.('[data-company-page-action]');

    if (pageAction && companyPage?.contains(pageAction)) {
      event.preventDefault();

      const action = String(pageAction.dataset.companyPageAction || '').trim();

      if (action === 'edit' && getIsAdmin()) {
        void openCompanyModalById(pageAction.dataset.companyId);
        return true;
      }
    }

    return false;
  }

  function handleCompanyPagesKeydown(event) {
    if (event.key !== 'Escape' || !companyModal?.classList.contains('is-open')) {
      return false;
    }

    closeCompanyModal();
    return true;
  }

  async function initCompanyAdminPage() {
    await restoreSession();
    trackEmailConfirmedLoginIfNeeded();
    await loadCompanyAdminPage();

    bindSharedAuthStateListener({
      onAfterAuthSync: loadCompanyAdminPage
    });
  }

  async function initCompanyPage() {
    await restoreSession();
    trackEmailConfirmedLoginIfNeeded();
    await loadCompanyPage();

    bindSharedAuthStateListener({
      onAfterAuthSync: loadCompanyPage
    });
  }

  return {
    initCompanyAdminPage,
    initCompanyPage,
    loadCompanyAdminPage,
    loadCompanyPage,
    renderCompanyPage,
    handleCompanyPagesClick,
    handleCompanyPagesKeydown
  };
}
