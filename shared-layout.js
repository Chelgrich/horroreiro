(function () {
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
      mountSharedFooter
    };
  })();