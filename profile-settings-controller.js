export function createProfileSettingsController(context) {
  const {
    getCurrentUser, getCurrentProfile, shouldUseAuthenticatedUi, getCurrentDisplayName,
    normalizeDisplayNameValue, isValidDisplayNameValue, doesProfilePreferRussianPosters,
    getPublicProfileAvatarUrl, getUserPageAvatarMediaHtml, isRussianPostersColumnAvailable,
    markMissingProfileOptionalColumn, loadProfileSettingsActions, applyProfileSettingsPatch,
    refreshPosterPreferenceDependentUi, setPageAvatarSubmitting, closeAuthPopoverMenu,
    syncBodyScrollLock, armDeleteMovieButton, getReadableAuthErrorMessage
  } = context;
  const AVATAR_ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
  const AVATAR_ACCEPTED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);
  const AVATAR_SOURCE_MAX_SIZE_BYTES = 10 * 1024 * 1024;
  const AVATAR_OUTPUT_SIZE = 256;
  const AVATAR_OUTPUT_TYPE = 'image/jpeg';
  const AVATAR_OUTPUT_QUALITY = 0.9;
  const AVATAR_MIN_SOURCE_SIDE = 256;
  const displayNameButton = document.getElementById('displayNameButton');
  const displayNameModal = document.getElementById('displayNameModal');
  const displayNameModalBackdrop = document.getElementById('displayNameModalBackdrop');
  const closeDisplayNameModalButton = document.getElementById('closeDisplayNameModalButton');
  const displayNameForm = document.getElementById('displayNameForm');
  const displayNameInput = document.getElementById('displayNameInput');
  const saveDisplayNameButton = document.getElementById('saveDisplayNameButton');
  const cancelDisplayNameButton = document.getElementById('cancelDisplayNameButton');
  const displayNameMessage = document.getElementById('displayNameMessage');
  const profilePasswordForm = document.getElementById('profilePasswordForm');
  const profilePasswordCurrentInput = document.getElementById('profilePasswordCurrent');
  const profilePasswordNewInput = document.getElementById('profilePasswordNew');
  const profilePasswordConfirmInput = document.getElementById('profilePasswordConfirm');
  const saveProfilePasswordButton = document.getElementById('saveProfilePasswordButton');
  const profilePasswordMessage = document.getElementById('profilePasswordMessage');
  const profilePosterPreferenceForm = document.getElementById('profilePosterPreferenceForm');
  const profileRussianPostersInput = document.getElementById('profileRussianPostersInput');
  const saveProfilePosterPreferenceButton = document.getElementById('saveProfilePosterPreferenceButton');
  const profilePosterPreferenceMessage = document.getElementById('profilePosterPreferenceMessage');

  let isDisplayNameModalOpen = false;
  let isDisplayNameSubmitting = false;
  let isProfilePosterPreferenceSubmitting = false;
  let isProfilePasswordSubmitting = false;
  let avatarCropModal = null;
  let avatarCropFrame = null;
  let avatarCropImage = null;
  let avatarCropZoomInput = null;
  let avatarCropStatus = null;
  let avatarCropSaveButton = null;
  let avatarCropSourceUrl = '';
  let avatarCropState = null;
  let isAvatarCropSubmitting = false;
  let isAvatarCropDragging = false;
  let avatarCropDragStart = null;
  let viewerId = getCurrentUser()?.id;
  let sessionVersion = 0;
  let avatarLoadVersion = 0;
  let isAvatarSubmitting = false;

  function captureViewer() {
    return { user: getCurrentUser(), version: sessionVersion };
  }

  function isCurrentViewer(viewer) {
    return Boolean(viewer.user?.id && shouldUseAuthenticatedUi() &&
      getCurrentUser()?.id === viewer.user.id && sessionVersion === viewer.version);
  }

  function syncAuthState() {
    if (viewerId !== getCurrentUser()?.id || !shouldUseAuthenticatedUi()) {
      viewerId = getCurrentUser()?.id;
      sessionVersion += 1;
      closeDisplayNameModal();
      closeAvatarCropModal({ force: true });
      isDisplayNameSubmitting = false;
      [displayNameInput, saveDisplayNameButton, cancelDisplayNameButton].forEach(element => {
        if (element) element.disabled = false;
      });
      setAvatarCropSubmitting(false);
      setUserPageAvatarSubmitting(false);
      setProfilePasswordSubmitting(false);
      setProfilePosterPreferenceSubmitting(false);
      setUserPageAvatarStatus();
    }
    syncProfilePosterPreferenceControls();
    if (isDisplayNameModalOpen) syncProfileSettingsAvatarPreview();
  }

  function close() {
    closeDisplayNameModal();
    closeAvatarCropModal();
  }

  function isOpen() {
    return isDisplayNameModalOpen || Boolean(avatarCropModal?.classList.contains('is-open'));
  }
  function syncProfilePosterPreferenceControls(profile = getCurrentProfile()) {
    if (!profileRussianPostersInput && !saveProfilePosterPreferenceButton) {
      return;
    }

    const shouldDisable = !shouldUseAuthenticatedUi() || !isRussianPostersColumnAvailable() || isProfilePosterPreferenceSubmitting;

    if (profileRussianPostersInput) {
      profileRussianPostersInput.checked = doesProfilePreferRussianPosters(profile);
      profileRussianPostersInput.disabled = shouldDisable;
    }

    if (saveProfilePosterPreferenceButton) {
      saveProfilePosterPreferenceButton.disabled = shouldDisable;
    }

    if (!isRussianPostersColumnAvailable()) {
      setProfilePosterPreferenceMessage('Нужно добавить колонку prefer_russian_posters в profiles и повторить попытку.', 'error');
    }
  }

  function setDisplayNameMessage(message = '', type = '') {
    if (!displayNameMessage) {
      return;
    }

    displayNameMessage.textContent = message;
    displayNameMessage.classList.remove('is-error', 'is-success');

    if (type) {
      displayNameMessage.classList.add(`is-${type}`);
    }
  }

  function setProfilePasswordMessage(message = '', type = '') {
    if (!profilePasswordMessage) {
      return;
    }

    profilePasswordMessage.textContent = message;
    profilePasswordMessage.classList.remove('is-error', 'is-success');

    if (type) {
      profilePasswordMessage.classList.add(`is-${type}`);
    }
  }

  function setProfilePosterPreferenceMessage(message = '', type = '') {
    if (!profilePosterPreferenceMessage) {
      return;
    }

    profilePosterPreferenceMessage.textContent = message;
    profilePosterPreferenceMessage.classList.remove('is-error', 'is-success');

    if (type) {
      profilePosterPreferenceMessage.classList.add(`is-${type}`);
    }
  }

  function clearProfileSettingsPasswordFields() {
    [
      profilePasswordCurrentInput,
      profilePasswordNewInput,
      profilePasswordConfirmInput
    ].forEach(input => {
      if (input) {
        input.value = '';
      }
    });
  }

  function setProfilePasswordSubmitting(isSubmitting) {
    isProfilePasswordSubmitting = isSubmitting;

    [
      profilePasswordCurrentInput,
      profilePasswordNewInput,
      profilePasswordConfirmInput,
      saveProfilePasswordButton
    ].forEach(element => {
      if (element) {
        element.disabled = isSubmitting;
      }
    });

    if (saveProfilePasswordButton) {
      saveProfilePasswordButton.textContent = isSubmitting ? 'Обновляю...' : 'Обновить пароль';
    }
  }

  function closeDisplayNameModal() {
    avatarLoadVersion += 1;
    if (!displayNameModal) {
      return;
    }

    displayNameModal.classList.remove('is-open');
    isDisplayNameModalOpen = false;
    displayNameButton?.setAttribute('aria-expanded', 'false');
    setDisplayNameMessage();
    setProfilePasswordMessage();
    setProfilePosterPreferenceMessage();
    clearProfileSettingsPasswordFields();
    syncBodyScrollLock();
  }

  function openDisplayNameModal() {
    syncAuthState();
    if (!displayNameModal || !displayNameInput || !shouldUseAuthenticatedUi()) {
      return;
    }

    closeAuthPopoverMenu();

    displayNameInput.value = getCurrentDisplayName();
    syncProfileSettingsAvatarPreview(getCurrentProfile());
    syncUserPageAvatarControls(getCurrentProfile());
    syncProfilePosterPreferenceControls(getCurrentProfile());
    setDisplayNameMessage();
    setProfilePasswordMessage();
    if (isRussianPostersColumnAvailable()) {
      setProfilePosterPreferenceMessage();
    }
    clearProfileSettingsPasswordFields();
    displayNameModal.classList.add('is-open');
    isDisplayNameModalOpen = true;
    displayNameButton?.setAttribute('aria-expanded', 'true');
    syncBodyScrollLock();

    requestAnimationFrame(() => {
      if (!isDisplayNameModalOpen) return;
      displayNameInput.focus();
      displayNameInput.select();
    });
  }

  function isMissingProfileOptionalColumnError(error) {
    const message = String(error?.message || '').toLowerCase();

    return (
      error?.code === '42703' ||
      error?.code === 'PGRST204' ||
      message.includes('column') && message.includes('schema cache')
    );
  }

  function getMissingProfileOptionalColumnName(error, optionalColumns = []) {
    const message = String(error?.message || error?.details || error?.hint || '').toLowerCase();
    const normalizedOptionalColumns = optionalColumns
      .map(columnName => String(columnName || '').trim())
      .filter(Boolean);
    const explicitMissingColumn = normalizedOptionalColumns.find(columnName =>
      message.includes(columnName.toLowerCase())
    );

    if (explicitMissingColumn) {
      return explicitMissingColumn;
    }

    if (!isMissingProfileOptionalColumnError(error)) {
      return '';
    }

    if (error?.code === '42703' || error?.code === 'PGRST204') {
      return normalizedOptionalColumns[normalizedOptionalColumns.length - 1] || '';
    }

    return '';
  }

  function isMissingAvatarColumnError(error) {
    return getMissingProfileOptionalColumnName(error, ['avatar_url']) === 'avatar_url';
  }

  function getAvatarFriendlyErrorMessage(error) {
    const message = String(error?.message || '');
    const normalizedMessage = message.toLowerCase();

    if (isMissingAvatarColumnError(error)) {
      return 'Нужно добавить колонку avatar_url в profiles и повторить загрузку.';
    }

    if (normalizedMessage.includes('bucket') || normalizedMessage.includes('avatars')) {
      return 'Нужно создать storage bucket avatars и политики доступа для аватаров.';
    }

    if (normalizedMessage.includes('row-level security') || normalizedMessage.includes('policy')) {
      return 'Supabase отклонил загрузку. Проверь политики Storage для bucket avatars.';
    }

    return message || 'Не удалось сохранить аватар. Попробуй ещё раз.';
  }

  function syncUserPageAvatarControls(profile = getCurrentProfile()) {
    const deleteButtons = document.querySelectorAll('[data-user-page-avatar-delete="true"]');

    const hasAvatar = Boolean(getPublicProfileAvatarUrl(profile));

    deleteButtons.forEach(deleteButton => {
      deleteButton.hidden = !hasAvatar;
      deleteButton.setAttribute('aria-label', 'Удалить аватар');
      deleteButton.setAttribute('title', 'Удалить аватар');
    });
  }

  function syncProfileSettingsAvatarPreview(profile = getCurrentProfile()) {
    const mediaHtml = getUserPageAvatarMediaHtml(profile, getCurrentDisplayName()).trim();
    document.querySelectorAll('.profile-settings-avatar-preview').forEach(slot => {
      slot.innerHTML = mediaHtml;
    });
    syncUserPageAvatarControls(profile);
  }

  function setUserPageAvatarStatus(message = '', type = 'info') {
    document.querySelectorAll('[data-user-page-avatar-status="true"]').forEach(statusElement => {
      statusElement.textContent = message;
      statusElement.hidden = !message;
      statusElement.classList.toggle('is-error', type === 'error');
      statusElement.classList.toggle('is-success', type === 'success');
    });
  }

  function setUserPageAvatarSubmitting(isSubmitting) {
    isAvatarSubmitting = isSubmitting;
    setPageAvatarSubmitting(isSubmitting);
    document.querySelectorAll('.profile-settings-avatar-preview').forEach(avatarShell => {
      avatarShell.classList.toggle('is-uploading', isSubmitting);
    });

    document.querySelectorAll('[data-user-page-avatar-input="true"]').forEach(avatarInput => {
      avatarInput.disabled = isSubmitting;
    });

    document.querySelectorAll('[data-user-page-avatar-delete="true"]').forEach(avatarDeleteButton => {
      avatarDeleteButton.disabled = isSubmitting;
    });
  }

  function getAvatarFileValidationMessage(file) {
    if (!file) {
      return 'Файл не выбран.';
    }

    const fileType = String(file.type || '').toLowerCase();
    const fileExtension = String(file.name || '').split('.').pop()?.toLowerCase() || '';

    if (!AVATAR_ACCEPTED_TYPES.has(fileType) && !AVATAR_ACCEPTED_EXTENSIONS.has(fileExtension)) {
      return 'Поддерживаются только JPG, PNG и WebP.';
    }

    if (file.size > AVATAR_SOURCE_MAX_SIZE_BYTES) {
      return 'Файл слишком большой. Максимум 10 МБ.';
    }

    return '';
  }

  function readAvatarSourceMetadata(file) {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();

      image.onload = () => {
        resolve({
          objectUrl,
          width: image.naturalWidth,
          height: image.naturalHeight
        });
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Не удалось прочитать изображение.'));
      };

      image.src = objectUrl;
    });
  }

  function ensureAvatarCropModal() {
    if (avatarCropModal) {
      return;
    }

    avatarCropModal = document.createElement('div');
    avatarCropModal.id = 'avatarCropModal';
    avatarCropModal.className = 'modal avatar-crop-modal';
    avatarCropModal.innerHTML = `
      <div class="modal-backdrop" data-avatar-crop-close="true"></div>
      <div class="modal-dialog avatar-crop-dialog" role="dialog" aria-modal="true" aria-labelledby="avatarCropTitle">
        <div class="modal-header">
          <h2 id="avatarCropTitle">Настроить аватар</h2>
          <button type="button" class="modal-close-button" data-avatar-crop-close="true" aria-label="Закрыть"></button>
        </div>
        <div class="avatar-crop-frame" data-avatar-crop-frame="true">
          <img class="avatar-crop-image" data-avatar-crop-image="true" alt="">
        </div>
        <div class="avatar-crop-controls">
          <label for="avatarCropZoom">Масштаб</label>
          <input id="avatarCropZoom" type="range" min="1" max="3" step="0.01" value="1" data-avatar-crop-zoom="true">
        </div>
        <p class="avatar-crop-status" data-avatar-crop-status="true" aria-live="polite" hidden></p>
        <div class="avatar-crop-actions">
          <button type="button" data-avatar-crop-save="true">Сохранить аватар</button>
          <button type="button" class="secondary-button secondary-button-compact" data-avatar-crop-close="true">Отмена</button>
        </div>
      </div>
    `;

    document.body.appendChild(avatarCropModal);

    avatarCropFrame = avatarCropModal.querySelector('[data-avatar-crop-frame="true"]');
    avatarCropImage = avatarCropModal.querySelector('[data-avatar-crop-image="true"]');
    avatarCropZoomInput = avatarCropModal.querySelector('[data-avatar-crop-zoom="true"]');
    avatarCropStatus = avatarCropModal.querySelector('[data-avatar-crop-status="true"]');
    avatarCropSaveButton = avatarCropModal.querySelector('[data-avatar-crop-save="true"]');

    avatarCropModal.querySelectorAll('[data-avatar-crop-close="true"]').forEach(element => {
      element.addEventListener('click', closeAvatarCropModal);
    });

    avatarCropSaveButton?.addEventListener('click', saveAvatarCrop);
    avatarCropZoomInput?.addEventListener('input', handleAvatarCropZoomInput);
    avatarCropFrame?.addEventListener('pointerdown', handleAvatarCropPointerDown);
    avatarCropFrame?.addEventListener('pointermove', handleAvatarCropPointerMove);
    avatarCropFrame?.addEventListener('pointerup', handleAvatarCropPointerUp);
    avatarCropFrame?.addEventListener('pointercancel', handleAvatarCropPointerUp);
  }

  function setAvatarCropStatus(message = '', type = 'info') {
    if (!avatarCropStatus) {
      return;
    }

    avatarCropStatus.textContent = message;
    avatarCropStatus.hidden = !message;
    avatarCropStatus.classList.toggle('is-error', type === 'error');
    avatarCropStatus.classList.toggle('is-success', type === 'success');
  }

  function setAvatarCropSubmitting(isSubmitting) {
    isAvatarCropSubmitting = isSubmitting;

    if (avatarCropSaveButton) {
      avatarCropSaveButton.disabled = isSubmitting;
      avatarCropSaveButton.textContent = isSubmitting ? 'Сохраняю...' : 'Сохранить аватар';
    }

    if (avatarCropZoomInput) {
      avatarCropZoomInput.disabled = isSubmitting;
    }
  }

  function getAvatarCropFrameSize() {
    const rect = avatarCropFrame?.getBoundingClientRect();

    return Math.round(rect?.width || 280);
  }

  function getAvatarCropScale() {
    return (avatarCropState?.minScale || 1) * (avatarCropState?.zoom || 1);
  }

  function clampAvatarCropOffset() {
    if (!avatarCropState) {
      return;
    }

    const scale = getAvatarCropScale();
    const frameSize = avatarCropState.frameSize;
    const maxOffsetX = Math.max(0, (avatarCropState.naturalWidth * scale - frameSize) / 2);
    const maxOffsetY = Math.max(0, (avatarCropState.naturalHeight * scale - frameSize) / 2);

    avatarCropState.offsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, avatarCropState.offsetX));
    avatarCropState.offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, avatarCropState.offsetY));
  }

  function applyAvatarCropTransform() {
    if (!avatarCropImage || !avatarCropState) {
      return;
    }

    clampAvatarCropOffset();

    const scale = getAvatarCropScale();

    avatarCropImage.style.width = `${avatarCropState.naturalWidth * scale}px`;
    avatarCropImage.style.height = `${avatarCropState.naturalHeight * scale}px`;
    avatarCropImage.style.transform = `translate(-50%, -50%) translate(${avatarCropState.offsetX}px, ${avatarCropState.offsetY}px)`;
  }

  function resetAvatarCropState() {
    if (!avatarCropImage || !avatarCropState) {
      return;
    }

    const frameSize = getAvatarCropFrameSize();

    avatarCropState.frameSize = frameSize;
    avatarCropState.minScale = Math.max(
      frameSize / avatarCropState.naturalWidth,
      frameSize / avatarCropState.naturalHeight
    );
    avatarCropState.zoom = 1;
    avatarCropState.offsetX = 0;
    avatarCropState.offsetY = 0;

    if (avatarCropZoomInput) {
      avatarCropZoomInput.value = '1';
    }

    applyAvatarCropTransform();
  }

  function handleAvatarCropZoomInput() {
    if (!avatarCropState || !avatarCropZoomInput) {
      return;
    }

    avatarCropState.zoom = Number(avatarCropZoomInput.value) || 1;
    applyAvatarCropTransform();
  }

  function handleAvatarCropPointerDown(event) {
    if (!avatarCropState || isAvatarCropSubmitting) {
      return;
    }

    isAvatarCropDragging = true;
    avatarCropDragStart = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      offsetX: avatarCropState.offsetX,
      offsetY: avatarCropState.offsetY
    };

    avatarCropFrame?.setPointerCapture?.(event.pointerId);
    avatarCropFrame?.classList.add('is-dragging');
  }

  function handleAvatarCropPointerMove(event) {
    if (!isAvatarCropDragging || !avatarCropState || !avatarCropDragStart) {
      return;
    }

    avatarCropState.offsetX = avatarCropDragStart.offsetX + event.clientX - avatarCropDragStart.x;
    avatarCropState.offsetY = avatarCropDragStart.offsetY + event.clientY - avatarCropDragStart.y;
    applyAvatarCropTransform();
  }

  function handleAvatarCropPointerUp(event) {
    if (!isAvatarCropDragging) {
      return;
    }

    isAvatarCropDragging = false;
    avatarCropFrame?.releasePointerCapture?.(event.pointerId);
    avatarCropFrame?.classList.remove('is-dragging');
    avatarCropDragStart = null;
  }

  function closeAvatarCropModal(options = {}) {
    avatarLoadVersion += 1;
    if (!avatarCropModal || (isAvatarCropSubmitting && !options.force)) {
      return;
    }

    avatarCropModal.classList.remove('is-open');
    setAvatarCropStatus();
    avatarCropState = null;
    isAvatarCropDragging = false;
    avatarCropDragStart = null;

    if (avatarCropImage) {
      avatarCropImage.removeAttribute('src');
      avatarCropImage.removeAttribute('style');
    }

    if (avatarCropSourceUrl) {
      URL.revokeObjectURL(avatarCropSourceUrl);
      avatarCropSourceUrl = '';
    }

    syncBodyScrollLock();
  }

  async function openAvatarCropModalFromFile(file) {
    const viewer = captureViewer();
    if (!isCurrentViewer(viewer) || isAvatarSubmitting) return;
    const loadVersion = ++avatarLoadVersion;
    const validationMessage = getAvatarFileValidationMessage(file);

    if (validationMessage) {
      throw new Error(validationMessage);
    }

    let metadata;
    try {
      metadata = await readAvatarSourceMetadata(file);
    } catch (error) {
      if (!isCurrentViewer(viewer) || loadVersion !== avatarLoadVersion) return;
      throw error;
    }
    if (!isCurrentViewer(viewer) || loadVersion !== avatarLoadVersion) {
      URL.revokeObjectURL(metadata.objectUrl);
      return;
    }

    if (metadata.width < AVATAR_MIN_SOURCE_SIDE || metadata.height < AVATAR_MIN_SOURCE_SIDE) {
      URL.revokeObjectURL(metadata.objectUrl);
      throw new Error('Изображение слишком маленькое. Минимум 256×256 пикселей.');
    }

    ensureAvatarCropModal();
    closeAvatarCropModal();

    avatarCropSourceUrl = metadata.objectUrl;
    avatarCropState = {
      naturalWidth: metadata.width,
      naturalHeight: metadata.height,
      frameSize: 280,
      minScale: 1,
      zoom: 1,
      offsetX: 0,
      offsetY: 0
    };

    avatarCropImage.src = avatarCropSourceUrl;
    avatarCropModal.classList.add('is-open');
    syncBodyScrollLock();
    setAvatarCropStatus();
    setAvatarCropSubmitting(false);

    requestAnimationFrame(resetAvatarCropState);
  }

  function renderAvatarCropBlob() {
    return new Promise((resolve, reject) => {
      if (!avatarCropImage || !avatarCropState) {
        reject(new Error('Изображение для аватара не найдено.'));
        return;
      }

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('Браузер не смог подготовить изображение.'));
        return;
      }

      const frameSize = avatarCropState.frameSize || getAvatarCropFrameSize();
      const outputScale = AVATAR_OUTPUT_SIZE / frameSize;
      const imageScale = getAvatarCropScale() * outputScale;

      canvas.width = AVATAR_OUTPUT_SIZE;
      canvas.height = AVATAR_OUTPUT_SIZE;

      context.fillStyle = '#0d1117';
      context.fillRect(0, 0, AVATAR_OUTPUT_SIZE, AVATAR_OUTPUT_SIZE);
      context.translate(
        AVATAR_OUTPUT_SIZE / 2 + avatarCropState.offsetX * outputScale,
        AVATAR_OUTPUT_SIZE / 2 + avatarCropState.offsetY * outputScale
      );
      context.drawImage(
        avatarCropImage,
        -avatarCropState.naturalWidth * imageScale / 2,
        -avatarCropState.naturalHeight * imageScale / 2,
        avatarCropState.naturalWidth * imageScale,
        avatarCropState.naturalHeight * imageScale
      );

      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Не удалось подготовить файл аватара.'));
        }
      }, AVATAR_OUTPUT_TYPE, AVATAR_OUTPUT_QUALITY);
    });
  }

  async function deleteCurrentUserAvatar() {
    const viewer = captureViewer();
    if (!isCurrentViewer(viewer) || isAvatarSubmitting) {
      return;
    }

    const previousAvatarUrl = getPublicProfileAvatarUrl(getCurrentProfile());

    if (!previousAvatarUrl) {
      setUserPageAvatarStatus('Аватар уже удалён.', 'info');
      syncUserPageAvatarControls(getCurrentProfile());
      return;
    }

    try {
      setUserPageAvatarSubmitting(true);
      setUserPageAvatarStatus('Удаляю аватар...');

      const settingsActions = await loadProfileSettingsActions();
      if (!isCurrentViewer(viewer)) return;
      await settingsActions.clearProfileAvatarUrl({ userId: viewer.user.id });
      if (!isCurrentViewer(viewer)) return;
      applyProfileSettingsPatch({ userId: viewer.user.id, patch: { avatar_url: null } });
      syncProfileSettingsAvatarPreview();
      setUserPageAvatarStatus('Аватар удалён.', 'success');
      void settingsActions.deleteAvatarFileByUrl(previousAvatarUrl);
    } catch (error) {
      if (!isCurrentViewer(viewer)) return;
      const message = getAvatarFriendlyErrorMessage(error);

      console.error('Ошибка удаления аватара:', error);
      setUserPageAvatarStatus(message, 'error');
    } finally {
      if (isCurrentViewer(viewer)) setUserPageAvatarSubmitting(false);
    }
  }

  async function saveAvatarCrop() {
    const viewer = captureViewer();
    if (!isCurrentViewer(viewer) || isAvatarSubmitting) {
      return;
    }

    try {
      setAvatarCropSubmitting(true);
      setUserPageAvatarSubmitting(true);
      setAvatarCropStatus('Сохраняю аватар...');
      setUserPageAvatarStatus('Сохраняю аватар...');

      const settingsActions = await loadProfileSettingsActions();
      if (!isCurrentViewer(viewer)) return;

      const previousAvatarUrl = getPublicProfileAvatarUrl(getCurrentProfile());
      const avatarBlob = await renderAvatarCropBlob();
      if (!isCurrentViewer(viewer)) return;
      const avatarUrl = await settingsActions.uploadAvatarBlob(avatarBlob, viewer.user.id);
      if (!isCurrentViewer(viewer)) return;

      if (!avatarUrl) {
        throw new Error('Supabase не вернул публичную ссылку на аватар.');
      }

      await settingsActions.updateProfileAvatarUrl({
        userId: viewer.user.id,
        avatarUrl
      });

      if (!isCurrentViewer(viewer)) return;
      applyProfileSettingsPatch({ userId: viewer.user.id, patch: { avatar_url: avatarUrl } });
      syncProfileSettingsAvatarPreview();
      closeAvatarCropModal({ force: true });
      setUserPageAvatarStatus('Аватар обновлён.', 'success');

      if (previousAvatarUrl && previousAvatarUrl !== avatarUrl) {
        void settingsActions.deleteAvatarFileByUrl(previousAvatarUrl);
      }
    } catch (error) {
      if (!isCurrentViewer(viewer)) return;
      const message = getAvatarFriendlyErrorMessage(error);

      console.error('Ошибка сохранения аватара:', error);

      // A failed response can follow a committed profile update; keep the uploaded file.
      setAvatarCropStatus(message, 'error');
      setUserPageAvatarStatus(message, 'error');
    } finally {
      if (isCurrentViewer(viewer)) {
        setAvatarCropSubmitting(false);
        setUserPageAvatarSubmitting(false);
      }
    }
  }

  function handleUserPageAvatarDeleteClick(event) {
    const deleteButton = event.target?.closest?.('[data-user-page-avatar-delete="true"]');

    if (!deleteButton || deleteButton.hidden) {
      return false;
    }

    event.preventDefault();
    armDeleteMovieButton(deleteButton, deleteCurrentUserAvatar, 'Удалить аватар?');

    return true;
  }

  async function handleUserPageAvatarFileChange(event) {
    const viewer = captureViewer();
    const input = event.target?.closest?.('[data-user-page-avatar-input="true"]');

    if (!input) {
      return;
    }

    const file = input.files?.[0] || null;

    input.value = '';

    if (!file) {
      return;
    }

    try {
      setUserPageAvatarStatus();
      await openAvatarCropModalFromFile(file);
    } catch (error) {
      if (!isCurrentViewer(viewer)) return;
      console.error('Ошибка выбора аватара:', error);
      setUserPageAvatarStatus(error.message || 'Не удалось открыть изображение.', 'error');
    }
  }

  async function saveDisplayName(event) {
    event?.preventDefault();
    const viewer = captureViewer();
    const currentUser = viewer.user;

    if (!isCurrentViewer(viewer) || isDisplayNameSubmitting || !displayNameInput) {
      return;
    }

    const nextDisplayName = displayNameInput.value.trim();
    const normalizedNextDisplayName = normalizeDisplayNameValue(nextDisplayName);
    const currentDisplayName = getCurrentDisplayName();
    const normalizedCurrentDisplayName = normalizeDisplayNameValue(currentDisplayName);

    if (!nextDisplayName) {
      setDisplayNameMessage('Введите никнейм.', 'error');
      displayNameInput.focus();
      return;
    }

    if (!isValidDisplayNameValue(nextDisplayName)) {
      setDisplayNameMessage('Никнейм должен быть длиной от 3 до 24 символов и содержать только буквы, цифры или _.', 'error');
      displayNameInput.focus();
      return;
    }

    if (normalizedNextDisplayName === normalizedCurrentDisplayName) {
      setDisplayNameMessage('Никнейм уже актуален.', 'success');
      return;
    }

    isDisplayNameSubmitting = true;
    setDisplayNameMessage('Сохраняю...');

    if (saveDisplayNameButton) {
      saveDisplayNameButton.disabled = true;
    }

    if (cancelDisplayNameButton) {
      cancelDisplayNameButton.disabled = true;
    }

    if (displayNameInput) {
      displayNameInput.disabled = true;
    }

    try {
      const actions = await loadProfileSettingsActions();
      if (!isCurrentViewer(viewer)) return;
      const result = await actions.saveDisplayName({
        currentUser,
        nextDisplayName
      });
      if (!isCurrentViewer(viewer)) return;

      if (!result.ok && result.reason === 'display-name-unavailable') {
        setDisplayNameMessage('Этот никнейм уже занят. Выберите другой.', 'error');
        return;
      }

      if (!result.ok && result.reason === 'auth-update-failed') {
        console.error('Ошибка обновления user_metadata.display_name:', result.error);
        setDisplayNameMessage('Не удалось обновить никнейм. Попробуйте ещё раз.', 'error');
        return;
      }

      if (!result.ok && result.reason === 'profile-update-failed') {
        console.error('Ошибка обновления profiles.display_name:', result.error);
        setDisplayNameMessage('Не удалось сохранить никнейм в профиле. Попробуйте ещё раз.', 'error');
        return;
      }

      if (!result.ok) {
        setDisplayNameMessage('Не удалось сохранить никнейм. Попробуйте ещё раз.', 'error');
        return;
      }

      applyProfileSettingsPatch({ userId: currentUser.id, patch: { display_name: nextDisplayName } });
      setDisplayNameMessage('Никнейм обновлён.', 'success');
    } catch (error) {
      if (!isCurrentViewer(viewer)) return;
      console.error('Ошибка сохранения никнейма:', error);
      setDisplayNameMessage(error?.message || 'Не удалось сохранить никнейм. Попробуйте ещё раз.', 'error');
    } finally {
      if (isCurrentViewer(viewer)) {
        isDisplayNameSubmitting = false;
        [saveDisplayNameButton, cancelDisplayNameButton, displayNameInput].forEach(element => {
          if (element) element.disabled = false;
        });
      }
    }
  }

  function setProfilePosterPreferenceSubmitting(isSubmitting) {
    isProfilePosterPreferenceSubmitting = isSubmitting;

    if (profileRussianPostersInput) {
      profileRussianPostersInput.disabled = isSubmitting || !isRussianPostersColumnAvailable();
    }

    if (saveProfilePosterPreferenceButton) {
      saveProfilePosterPreferenceButton.disabled = isSubmitting || !isRussianPostersColumnAvailable();
      saveProfilePosterPreferenceButton.textContent = isSubmitting ? 'Сохраняю...' : 'Сохранить';
    }
  }

  async function saveProfilePosterPreference(event) {
    event?.preventDefault();
    const viewer = captureViewer();
    const currentUser = viewer.user;

    if (
      !isCurrentViewer(viewer) ||
      isProfilePosterPreferenceSubmitting ||
      !profileRussianPostersInput ||
      !isRussianPostersColumnAvailable()
    ) {
      return;
    }

    const nextPreferRussianPosters = Boolean(profileRussianPostersInput.checked);
    const previousPreferRussianPosters = doesProfilePreferRussianPosters(getCurrentProfile());

    if (nextPreferRussianPosters === previousPreferRussianPosters) {
      setProfilePosterPreferenceMessage('Настройка уже актуальна.', 'success');
      return;
    }

    setProfilePosterPreferenceSubmitting(true);
    setProfilePosterPreferenceMessage('Сохраняю...');

    try {
      const actions = await loadProfileSettingsActions();
      if (!isCurrentViewer(viewer)) return;
      const { error } = await actions.savePosterPreference({
        currentUserId: currentUser.id,
        nextPreferRussianPosters
      });
      if (!isCurrentViewer(viewer)) return;

      if (error) {
        if (getMissingProfileOptionalColumnName(error, ['prefer_russian_posters']) === 'prefer_russian_posters') {
          markMissingProfileOptionalColumn('prefer_russian_posters');
          syncProfilePosterPreferenceControls(getCurrentProfile());
          return;
        }

        throw error;
      }

      applyProfileSettingsPatch({ userId: currentUser.id, patch: { prefer_russian_posters: nextPreferRussianPosters } });
      syncProfilePosterPreferenceControls(getCurrentProfile());
      setProfilePosterPreferenceMessage('Настройка сохранена.', 'success');

      await refreshPosterPreferenceDependentUi({
        forcePosterImages: nextPreferRussianPosters
      });
    } catch (error) {
      if (!isCurrentViewer(viewer)) return;
      console.error('Ошибка сохранения настройки постеров:', error);
      setProfilePosterPreferenceMessage(error?.message || 'Не удалось сохранить настройку постеров. Попробуйте ещё раз.', 'error');
    } finally {
      if (isCurrentViewer(viewer)) setProfilePosterPreferenceSubmitting(false);
    }
  }

  function getProfilePasswordErrorMessage(error, fallbackMessage) {
    const errorText = String(error?.message || '').toLowerCase();

    if (
      errorText.includes('invalid login credentials') ||
      errorText.includes('invalid credentials')
    ) {
      return 'Старый пароль не подошёл.';
    }

    return getReadableAuthErrorMessage(error, fallbackMessage);
  }

  async function saveProfilePassword(event) {
    event?.preventDefault();
    const viewer = captureViewer();
    const currentUser = viewer.user;

    if (
      !isCurrentViewer(viewer) ||
      isProfilePasswordSubmitting ||
      !profilePasswordCurrentInput ||
      !profilePasswordNewInput ||
      !profilePasswordConfirmInput
    ) {
      return;
    }

    const email = String(currentUser.email || '').trim();
    const currentPassword = profilePasswordCurrentInput.value;
    const nextPassword = profilePasswordNewInput.value;
    const confirmedPassword = profilePasswordConfirmInput.value;

    if (!email) {
      setProfilePasswordMessage('У аккаунта не найден e-mail для проверки пароля.', 'error');
      return;
    }

    if (!currentPassword) {
      setProfilePasswordMessage('Введите старый пароль.', 'error');
      profilePasswordCurrentInput.focus();
      return;
    }

    if (!nextPassword) {
      setProfilePasswordMessage('Введите новый пароль.', 'error');
      profilePasswordNewInput.focus();
      return;
    }

    if (!confirmedPassword) {
      setProfilePasswordMessage('Повторите новый пароль.', 'error');
      profilePasswordConfirmInput.focus();
      return;
    }

    if (nextPassword !== confirmedPassword) {
      setProfilePasswordMessage('Новые пароли не совпадают.', 'error');
      profilePasswordConfirmInput.focus();
      profilePasswordConfirmInput.select();
      return;
    }

    if (currentPassword === nextPassword) {
      setProfilePasswordMessage('Новый пароль должен отличаться от старого.', 'error');
      profilePasswordNewInput.focus();
      profilePasswordNewInput.select();
      return;
    }

    setProfilePasswordSubmitting(true);
    setProfilePasswordMessage('Проверяю старый пароль...');

    try {
      const settingsActions = await loadProfileSettingsActions();
      if (!isCurrentViewer(viewer)) return;
      const { error: signInError } = await settingsActions.verifyProfilePassword({
        userId: currentUser.id,
        email,
        currentPassword
      });
      if (!isCurrentViewer(viewer)) return;

      if (signInError) {
        setProfilePasswordMessage(
          getProfilePasswordErrorMessage(signInError, 'Не удалось проверить старый пароль.'),
          'error'
        );
        return;
      }

      setProfilePasswordMessage('Сохраняю новый пароль...');

      const { error: updateError } = await settingsActions.updateProfilePassword({
        nextPassword,
        userId: currentUser.id
      });
      if (!isCurrentViewer(viewer)) return;

      if (updateError) {
        setProfilePasswordMessage(
          getProfilePasswordErrorMessage(updateError, 'Не удалось обновить пароль. Попробуй ещё раз.'),
          'error'
        );
        return;
      }

      clearProfileSettingsPasswordFields();
      setProfilePasswordMessage('Пароль обновлён.', 'success');
    } catch (error) {
      if (!isCurrentViewer(viewer)) return;
      console.error('Ошибка смены пароля:', error);
      setProfilePasswordMessage(
        getProfilePasswordErrorMessage(error, 'Не удалось обновить пароль. Попробуй ещё раз.'),
        'error'
      );
    } finally {
      if (isCurrentViewer(viewer)) setProfilePasswordSubmitting(false);
    }
  }

  displayNameInput?.addEventListener('input', () => setDisplayNameMessage());
  [profilePasswordCurrentInput, profilePasswordNewInput, profilePasswordConfirmInput].forEach(input => {
    input?.addEventListener('input', () => setProfilePasswordMessage());
  });
  displayNameForm?.addEventListener('submit', saveDisplayName);
  profilePosterPreferenceForm?.addEventListener('submit', saveProfilePosterPreference);
  profileRussianPostersInput?.addEventListener('change', () => {
    if (isRussianPostersColumnAvailable()) setProfilePosterPreferenceMessage();
  });
  profilePasswordForm?.addEventListener('submit', saveProfilePassword);
  [cancelDisplayNameButton, closeDisplayNameModalButton, displayNameModalBackdrop].forEach(button => {
    button?.addEventListener('click', close);
  });
  displayNameModal?.addEventListener('click', handleUserPageAvatarDeleteClick);
  displayNameModal?.addEventListener('change', handleUserPageAvatarFileChange);
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (avatarCropModal?.classList.contains('is-open')) closeAvatarCropModal();
    else closeDisplayNameModal();
  });

  return { open: openDisplayNameModal, close, isOpen, syncAuthState };
}
