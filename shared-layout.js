(function () {
    function getSharedHeaderHtml({ isMoviePage = false } = {}) {
      const logoHtml = isMoviePage
        ? `<h1><a href="index.html" class="page-logo-link">Хоррорейро</a></h1>`
        : `<h1>Хоррорейро</h1>`;
  
      return `
        <header class="page-header">
          <div class="page-header-top">
            ${logoHtml}
  
            <div id="authControls" class="auth-controls auth-controls-pending">
              <div class="auth-actions">
                <div id="displayNameWrap" class="display-name-wrap auth-ui-block">
                  <button
                    type="button"
                    id="displayNameButton"
                    class="display-name-button"
                    aria-haspopup="dialog"
                    aria-expanded="false"
                    title=""
                  >
                    <span id="displayNameText" class="display-name-text"></span>
                    <span class="display-name-edit-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M4 20h4l9.8-9.8a2.121 2.121 0 1 0-3-3L5 17v3Z"></path>
                        <path d="m13.5 6.5 3 3"></path>
                      </svg>
                    </span>
                  </button>
                </div>
  
                <div class="auth-menu-wrap">
                  <button
                    id="openAuthModalButton"
                    type="button"
                    class="auth-icon-button"
                    aria-label="Вход или регистрация"
                    title="Вход или регистрация"
                    aria-haspopup="menu"
                    aria-expanded="false"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"></path>
                      <path d="M4 21c0-3.866 3.582-7 8-7s8 3.134 8 7"></path>
                    </svg>
                  </button>
  
                  <div id="authPopoverMenu" class="auth-popover-menu" role="menu" aria-label="Меню аккаунта">
                    <button
                      type="button"
                      class="auth-popover-item auth-popover-item-danger"
                      id="logoutMenuButton"
                      role="menuitem"
                    >
                      Выйти
                    </button>
                  </div>
                </div>
  
                <div id="adminPanel" class="admin-panel auth-ui-block">
                  <button
                    id="openAddMovieButton"
                    type="button"
                    class="floating-add-movie-button"
                    aria-label="Добавить фильм"
                    title="Добавить фильм"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 5v14"></path>
                      <path d="M5 12h14"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
      `;
    }
  
    function mountSharedHeader(options = {}) {
      const headerMount = document.getElementById('sharedHeaderMount');
  
      if (!headerMount) {
        return;
      }
  
      headerMount.innerHTML = getSharedHeaderHtml(options);
    }
  
    function getSharedAuthModalHtml() {
      return `
        <div id="authModal" class="modal">
          <div class="modal-backdrop" id="authModalBackdrop"></div>
  
          <div class="modal-dialog auth-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">
            <div class="modal-header">
              <h2 id="authModalTitle">Вход и регистрация</h2>
              <button type="button" id="closeAuthModalButton" class="modal-close-button" aria-label="Закрыть"></button>
            </div>
  
            <form id="loginForm" class="login-form login-form-modal auth-form-shell is-visible">
              <input type="email" id="loginEmail" name="email" class="auth-mode-field is-visible" placeholder="Email" autocomplete="email">
              <input type="password" id="loginPassword" name="password" class="auth-mode-field is-visible" placeholder="Пароль" autocomplete="current-password">
              <input type="text" id="registerNickname" name="registerNickname" class="auth-conditional-field" placeholder="Никнейм" maxlength="24">
              <div id="registerNicknameHint" class="field-hint auth-conditional-field">
                Необязательно. Если оставить пустым, присвоится имя вида profile001.
              </div>
              <input type="password" id="loginPasswordConfirm" name="passwordConfirm" class="auth-conditional-field" placeholder="Повторите новый пароль" autocomplete="new-password">
              <button type="submit">Войти</button>
              <button type="button" id="registerButton" class="secondary-button secondary-button-compact auth-mode-button is-visible">
                Регистрация
              </button>
            </form>
  
            <div id="authFormLinks" class="auth-form-links auth-mode-block is-visible">
              <button type="button" id="forgotPasswordButton" class="auth-link-button">
                Забыли пароль?
              </button>
            </div>
  
            <div id="authToast" class="auth-toast auth-toast-inline is-hidden" aria-live="polite" aria-atomic="true">
              <p id="authMessage" class="auth-message"></p>
            </div>
          </div>
        </div>
      `;
    }
  
    function mountSharedAuthModal() {
        const authModalMount = document.getElementById('sharedAuthModalMount');
    
        if (!authModalMount) {
          return;
        }
    
        authModalMount.innerHTML = getSharedAuthModalHtml();
      }
  
      function getSharedDisplayNameModalHtml() {
        return `
          <div id="displayNameModal" class="modal">
            <div class="modal-backdrop" id="displayNameModalBackdrop"></div>
  
            <div class="modal-dialog display-name-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="displayNameModalTitle">
              <div class="modal-header">
                <h2 id="displayNameModalTitle">Изменение никнейма</h2>
                <button type="button" id="closeDisplayNameModalButton" class="modal-close-button" aria-label="Закрыть"></button>
              </div>
  
              <form id="displayNameForm" class="display-name-form">
                <input type="text" id="displayNameInput" maxlength="24" autocomplete="off" spellcheck="false">
                <div class="display-name-form-actions">
                  <button type="submit" id="saveDisplayNameButton">Сохранить</button>
                  <button type="button" id="cancelDisplayNameButton" class="secondary-button secondary-button-compact">Отмена</button>
                </div>
              </form>
  
              <p id="displayNameMessage" class="display-name-message"></p>
            </div>
          </div>
        `;
      }
  
      function mountSharedDisplayNameModal() {
        const displayNameModalMount = document.getElementById('sharedDisplayNameModalMount');
  
        if (!displayNameModalMount) {
          return;
        }
  
        displayNameModalMount.innerHTML = getSharedDisplayNameModalHtml();
      }

      function getSharedMovieModalHtml() {
        return `
          <div id="movieModal" class="modal">
            <div class="modal-backdrop" id="movieModalBackdrop"></div>

            <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="formTitle">
              <div class="modal-header">
                <h2 id="formTitle">Добавить фильм</h2>
                <button type="button" id="closeMovieModalButton" class="modal-close-button" aria-label="Закрыть"></button>
              </div>

              <form id="movieForm" class="movie-form" novalidate>
                <div class="movie-form-inline-group movie-form-inline-group-titles">
                  <div class="form-row">
                    <label for="title">Название:</label>
                    <input type="text" id="title" name="title" required>
                  </div>

                  <div class="form-row">
                    <label for="originalTitle">Оригинальное название:</label>
                    <input type="text" id="originalTitle" name="originalTitle">
                  </div>

                  <div class="form-row">
                    <label for="year">Год:</label>
                    <input type="number" id="year" name="year" min="1888" max="2100">
                  </div>
                </div>

                <div class="form-row">
                  <label for="searchAliases">Альтернативные названия:</label>
                  <textarea id="searchAliases" name="searchAliases" rows="4"></textarea>
                  <div class="field-hint">
                    Каждое название с новой строки. Используется только для поиска и не показывается в каталоге.
                  </div>
                </div>

                <div class="form-row">
                  <label for="synopsis">Синопсис:</label>
                  <textarea id="synopsis" name="synopsis" rows="6"></textarea>
                </div>

                <div class="movie-form-inline-group movie-form-inline-group-taxonomy">
                  <div class="form-row">
                    <label for="tagsPerceived">Теги perceived:</label>
                    <textarea id="tagsPerceived" name="tagsPerceived" rows="4"></textarea>
                    <div class="field-hint">
                      Без спойлеров. По одному тегу с новой строки.
                    </div>
                  </div>

                  <div class="form-row">
                    <label for="tagsCanon">Теги canon:</label>
                    <textarea id="tagsCanon" name="tagsCanon" rows="4"></textarea>
                    <div class="field-hint">
                      Реальная внутренняя логика фильма. По одному тегу с новой строки.
                    </div>
                  </div>

                  <div class="form-row">
                    <label for="movieFormats">Форматы:</label>
                    <textarea id="movieFormats" name="movieFormats" rows="2"></textarea>
                    <div class="field-hint">
                      По одному значению с новой строки.
                    </div>
                  </div>

                  <div class="form-row">
                    <label for="movieModifiers">Модификаторы:</label>
                    <textarea id="movieModifiers" name="movieModifiers" rows="3"></textarea>
                    <div class="field-hint">
                      Настроенческие и стилистические признаки. По одному значению с новой строки.
                    </div>
                  </div>

                  <div class="form-row">
                    <label for="movieBroadFamilies">Семейства механик:</label>
                    <textarea id="movieBroadFamilies" name="movieBroadFamilies" rows="3"></textarea>
                    <div class="field-hint">
                      Верхнеуровневые семейства механик. По одному значению с новой строки.
                    </div>
                  </div>

                  <div class="form-row">
                    <label for="movieTriggers">Триггеры:</label>
                    <textarea id="movieTriggers" name="movieTriggers" rows="3"></textarea>
                    <div class="field-hint">
                      По одному значению с новой строки.
                    </div>
                  </div>
                </div>

                <div class="form-row movie-taxonomy-preview-row">
                  <label>Результат классификации:</label>

                  <div id="movieTaxonomyPreview" class="movie-taxonomy-preview">
                    <div class="movie-taxonomy-preview-line">
                      <span>Поджанр:</span>
                      <strong id="movieTaxonomyPrimaryPreview">—</strong>
                    </div>

                    <div class="movie-taxonomy-preview-line">
                      <span>Доп. поджанры:</span>
                      <strong id="movieTaxonomySecondaryPreview">—</strong>
                    </div>

                    <div id="movieTaxonomyWarningsPreview" class="movie-taxonomy-preview-warnings"></div>
                  </div>
                </div>

                <div class="movie-form-inline-group movie-form-inline-group-release">
                  <div class="form-row">
                    <label for="releaseYear">Год релиза:</label>
                    <input type="number" id="releaseYear" name="releaseYear" min="1900" max="2100">
                  </div>

                  <div class="form-row">
                    <label for="releaseMonth">Месяц:</label>
                    <select id="releaseMonth" name="releaseMonth">
                      <option value="">Не выбран</option>
                      <option value="1">Январь</option>
                      <option value="2">Февраль</option>
                      <option value="3">Март</option>
                      <option value="4">Апрель</option>
                      <option value="5">Май</option>
                      <option value="6">Июнь</option>
                      <option value="7">Июль</option>
                      <option value="8">Август</option>
                      <option value="9">Сентябрь</option>
                      <option value="10">Октябрь</option>
                      <option value="11">Ноябрь</option>
                      <option value="12">Декабрь</option>
                    </select>
                  </div>

                  <div class="form-row">
                    <label for="sortOrder">Порядок внутри месяца:</label>
                    <input type="number" id="sortOrder" name="sortOrder" min="1" step="1">
                  </div>
                </div>

                <div class="movie-form-inline-group movie-form-inline-group-meta">
                  <div class="form-row">
                    <label for="director">Режиссёр:</label>
                    <input type="text" id="director" name="director">
                  </div>

                  <div class="form-row">
                    <label for="genresInput">Доп. жанры:</label>
                    <input type="text" id="genresInput" name="genresInput">
                  </div>

                  <div class="form-row">
                    <label for="countriesInput">Страны:</label>
                    <input type="text" id="countriesInput" name="countriesInput">
                  </div>
                </div>

                <div class="form-row">
                  <label for="posterFile">Постер (файл):</label>

                  <div class="file-input-wrapper">
                    <input type="file" id="posterFile" name="posterFile" accept="image/*">

                    <label for="posterFile" class="file-input-ui">
                      <span class="file-input-button">Выберите файл</span>
                      <span class="file-input-name" id="posterFileName">Файл не выбран</span>
                    </label>
                  </div>
                </div>

                <div class="movie-form-inline-group movie-form-inline-group-links">
                  <div class="form-row">
                    <label for="kinopoiskUrl">Ссылка на Кинопоиск:</label>
                    <input
                      type="text"
                      id="kinopoiskUrl"
                      name="kinopoiskUrl"
                      inputmode="url"
                      autocomplete="off"
                      spellcheck="false"
                    >
                  </div>

                  <div class="form-row">
                    <label for="imdbUrl">Ссылка на IMDb:</label>
                    <input
                      type="text"
                      id="imdbUrl"
                      name="imdbUrl"
                      inputmode="url"
                      autocomplete="off"
                      spellcheck="false"
                    >
                  </div>

                  <div class="form-row">
                    <label for="letterboxdUrl">Ссылка на Letterboxd:</label>
                    <input
                      type="text"
                      id="letterboxdUrl"
                      name="letterboxdUrl"
                      inputmode="url"
                      autocomplete="off"
                      spellcheck="false"
                    >
                  </div>

                  <div class="form-row">
                    <label for="rottentomatoesUrl">Ссылка на RT:</label>
                    <input
                      type="text"
                      id="rottentomatoesUrl"
                      name="rottentomatoesUrl"
                      inputmode="url"
                      autocomplete="off"
                      spellcheck="false"
                    >
                  </div>
                </div>

                <div class="form-actions">
                  <button type="submit" id="submitButton">Добавить фильм</button>
                  <button type="button" id="cancelEditButton" class="secondary-button form-mode-button">
                    Отмена редактирования
                  </button>
                </div>
              </form>

              <p id="formMessage" class="form-message"></p>
            </div>
          </div>
        `;
      }

      function mountSharedMovieModal() {
        const movieModalMount = document.getElementById('sharedMovieModalMount');

        if (!movieModalMount) {
          return;
        }

        movieModalMount.innerHTML = getSharedMovieModalHtml();
      }
    
      function getSharedFooterHtml() {
        return `
          <footer class="page-footer">
            <div class="page-footer-inner">
              <div class="footer-main">
                <div class="footer-slogan">
                  «ВЫБЕРИ, ЧТО СМОТРЕТЬ СЕГОДНЯ»
                </div>
    
                <div class="footer-brand">Хоррорейро</div>
    
                <div class="footer-author">
                  Хоррор-каталог от Grint_Talks, 2026
                </div>
              </div>
            </div>
          </footer>
        `;
      }
  
    function mountSharedFooter() {
      const footerMount = document.getElementById('sharedFooterMount');
  
      if (!footerMount) {
        return;
      }
  
      footerMount.innerHTML = getSharedFooterHtml();
    }
  
    window.SharedLayout = {
        mountSharedHeader,
        mountSharedAuthModal,
        mountSharedDisplayNameModal,
        mountSharedMovieModal,
        mountSharedFooter
      };
    })();