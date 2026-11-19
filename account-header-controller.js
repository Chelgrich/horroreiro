export function createAccountHeaderController({
  openLogin, logout, restoreCurrentPageLink, isSameCurrentPageUrl, disableCurrentPageLink,
  links, actions, onImportPickerOpen, onImportFileChange, onImportPickerCancel,
  refreshUnread, unreadRefreshInterval
}) {
  const byId = id => document.getElementById(id);
  const controls = byId('authControls');
  const button = byId('openAuthModalButton');
  const menu = byId('authPopoverMenu');
  const nameWrap = byId('displayNameWrap');
  const nameLabel = byId('displayNameButton');
  const nameText = byId('displayNameText');
  const avatarIcon = button?.querySelector('svg');
  const iconBadge = byId('authNotificationBadge');
  const menuBadge = byId('notificationsMenuBadge');
  const adminPanel = byId('adminPanel');
  const importInput = byId('letterboxdRatingsFileInput');
  const menuLinks = Object.entries(links).map(([id, href]) => [byId(id), href]);
  const actionButtons = Object.fromEntries(Object.entries({
    ...actions,
    importLetterboxdRatingsButton: {
      run: pickRatingsFile, label: 'Импорт оценок Letterboxd', busyLabel: 'Импортирую оценки...'
    }
  }).map(([id, action]) => [
    id, { ...action, element: byId(id), busy: false }
  ]));
  let viewerId = null;
  let avatar = null;
  let unreadTimer = null;

  function canRefreshUnread() {
    return viewerId !== null && document.visibilityState === 'visible';
  }

  function syncUnreadTimer() {
    if (canRefreshUnread()) {
      unreadTimer ??= setInterval(() => {
        if (canRefreshUnread()) refreshUnread({ force: true });
      }, unreadRefreshInterval);
    } else if (unreadTimer !== null) {
      clearInterval(unreadTimer);
      unreadTimer = null;
    }
  }

  function close() {
    menu?.classList.remove('is-open');
    button?.setAttribute('aria-expanded', 'false');
  }

  function syncBadge(count) {
    const visible = viewerId !== null && Number.isFinite(count) && count > 0;
    if (iconBadge) {
      iconBadge.hidden = !visible;
      iconBadge.title = visible ? `Непрочитанных уведомлений: ${count}` : '';
    }
    if (menuBadge) {
      menuBadge.hidden = !visible;
      menuBadge.textContent = visible ? (count > 99 ? '99+' : String(count)) : '';
    }
  }

  function syncAvatar(url) {
    if (!button || (avatar?.getAttribute('src') || '') === url) return;
    if (url) {
      if (!avatar) {
        avatar = document.createElement('img');
        avatar.className = 'auth-icon-avatar';
        avatar.alt = '';
        avatar.setAttribute('aria-hidden', 'true');
        button.prepend(avatar);
      }
      avatar.setAttribute('src', url);
    } else {
      avatar.remove();
      avatar = null;
    }
    if (avatarIcon) avatarIcon.style.display = url ? 'none' : '';
    button.classList.toggle('has-avatar', Boolean(url));
  }

  function syncLink(link, href, visible) {
    link.hidden = !visible;
    if (link.dataset.currentPageLink === 'true') restoreCurrentPageLink(link);
    if (!visible || !href) {
      link.removeAttribute('href');
      link.removeAttribute('aria-current');
      return;
    }
    if (isSameCurrentPageUrl(href)) {
      disableCurrentPageLink(link, href);
      return;
    }
    link.setAttribute('href', href);
    link.removeAttribute('aria-current');
  }

  function sync({ userId, isAdmin, showAddMovie, displayName, avatarUrl, unreadCount, settingsOpen, ready }) {
    if (viewerId !== userId || userId === null) close();
    viewerId = userId;
    syncUnreadTimer();
    const signedIn = userId !== null;
    const label = signedIn ? 'Меню аккаунта' : 'Вход или регистрация';
    button?.classList.toggle('is-authenticated', signedIn);
    button?.setAttribute('aria-label', label);
    button?.setAttribute('title', label);
    syncAvatar(signedIn ? avatarUrl : '');
    nameWrap?.classList.toggle('is-visible', signedIn);
    if (nameLabel) {
      nameLabel.title = signedIn ? displayName : '';
      nameLabel.setAttribute('aria-expanded', String(settingsOpen));
    }
    if (nameText) nameText.textContent = signedIn ? displayName : '';
    for (const [link, href] of menuLinks) {
      if (!link) continue;
      const visible = signedIn && (link.dataset.adminOnlyMenuItem !== 'true' || isAdmin);
      syncLink(link, visible ? href() : '', visible);
    }
    for (const { element } of Object.values(actionButtons)) {
      if (element) element.hidden = !signedIn || (element.dataset.adminOnlyMenuItem === 'true' && !isAdmin);
    }
    adminPanel?.classList.toggle('is-visible', showAddMovie);
    syncBadge(unreadCount);
    if (ready) controls?.classList.remove('auth-controls-pending');
  }

  function setActionBusy(id, busy) {
    const action = actionButtons[id];
    action.busy = busy;
    if (action.element) {
      action.element.disabled = busy;
      action.element.textContent = busy ? action.busyLabel : action.label;
    }
  }

  button?.addEventListener('click', () => {
    if (viewerId === null) {
      openLogin();
    } else if (menu) {
      const open = menu.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest?.('.auth-menu-wrap')) close();
  });
  document.addEventListener('visibilitychange', () => {
    syncUnreadTimer();
    if (canRefreshUnread()) refreshUnread();
  });
  for (const [link] of menuLinks) {
    link?.addEventListener('click', event => {
      if (!event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) close();
    });
  }
  for (const { element, run } of Object.values(actionButtons)) {
    element?.addEventListener('click', () => {
      if (viewerId !== null && !element.hidden && !element.disabled) return run();
    });
  }
  byId('logoutMenuButton')?.addEventListener('click', () => {
    if (viewerId === null) return;
    close();
    return logout();
  });
  importInput?.addEventListener('input', onImportFileChange);
  importInput?.addEventListener('change', onImportFileChange);
  importInput?.addEventListener('cancel', () => {
    if (!actionButtons.importLetterboxdRatingsButton.busy) onImportPickerCancel();
  });

  function pickRatingsFile() {
    if (!importInput) return;
    importInput.value = '';
    onImportPickerOpen();
    importInput.click();
  }

  return { sync, syncBadge, close, setActionBusy };
}
