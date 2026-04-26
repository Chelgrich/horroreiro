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
      mountSharedFooter
    };
  })();