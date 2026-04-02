/* =========================================================
CUSTOM SELECT. ВСПОМОГАТЕЛЬНЫЙ МОДУЛЬ
Создаёт визуальные оболочки над нативными select и
синхронизирует их с логикой страницы.
========================================================== */

function createCustomSelectManager(config) {
    const {
      selectElements,
      normalizeSearchText
    } = config;
  
    let customSelectInstances = [];
  
    function closeCustomSelect(instance) {
      if (!instance) {
        return;
      }
  
      instance.root.classList.remove('is-open', 'open-up');
      instance.dropdown.hidden = true;
      instance.trigger.setAttribute('aria-expanded', 'false');
    }
  
    function closeAllCustomSelects(exceptElement = null) {
      customSelectInstances.forEach(instance => {
        if (instance.root !== exceptElement) {
          closeCustomSelect(instance);
        }
      });
    }
  
    function updateCustomSelectLabel(selectElement, labelElement, rootElement) {
      const selectedOption = selectElement.options[selectElement.selectedIndex];
  
      if (!selectedOption) {
        labelElement.textContent = '';
        rootElement?.classList.add('is-placeholder-selected');
        return;
      }
  
      labelElement.textContent = selectedOption.textContent;
      rootElement?.classList.toggle('is-placeholder-selected', selectedOption.value === '');
    }
  
    function syncCustomSelectOptions(instance) {
      if (!instance) {
        return;
      }
  
      const { select, dropdown, label, root } = instance;
  
      dropdown.innerHTML = '';
  
      Array.from(select.options).forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.type = 'button';
        optionButton.className = 'custom-select-option';
        optionButton.textContent = option.textContent;
        optionButton.dataset.value = option.value;
        optionButton.setAttribute('role', 'option');
        optionButton.setAttribute('aria-selected', String(option.selected));
  
        if (option.value === '') {
          optionButton.classList.add('is-placeholder');
        }
  
        if (option.selected) {
          optionButton.classList.add('is-selected');
        }
  
        optionButton.addEventListener('click', () => {
          select.value = option.value;
          updateCustomSelectLabel(select, label, root);

          dropdown.querySelectorAll('.custom-select-option').forEach(button => {
            const isSelected = button.dataset.value === select.value;
            button.classList.toggle('is-selected', isSelected);
            button.setAttribute('aria-selected', String(isSelected));
          });

          select.dispatchEvent(new Event('change', { bubbles: true }));
          closeCustomSelect(instance);
        });
  
        dropdown.appendChild(optionButton);
      });
  
      updateCustomSelectLabel(select, label, root);
    }
  
    function updateCustomSelectDirection(instance) {
      if (!instance) {
        return;
      }
  
      instance.root.classList.remove('open-up');
  
      const triggerRect = instance.trigger.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const dropdownHeight = Math.min(instance.dropdown.scrollHeight, 260);
      const requiredSpace = dropdownHeight + 12;
  
      if (spaceBelow < requiredSpace && spaceAbove > spaceBelow) {
        instance.root.classList.add('open-up');
      }
    }
  
    function bindCustomSelectChange(selectElement, instance) {
      if (selectElement.dataset.customSelectBound === 'true') {
        return;
      }
  
      selectElement.addEventListener('change', () => {
        updateCustomSelectLabel(selectElement, instance.label, instance.root);
  
        instance.dropdown.querySelectorAll('.custom-select-option').forEach(button => {
          const isSelected = button.dataset.value === selectElement.value;
          button.classList.toggle('is-selected', isSelected);
          button.setAttribute('aria-selected', String(isSelected));
        });
      });
  
      selectElement.dataset.customSelectBound = 'true';
    }
  
    function createCustomSelect(selectElement) {
      const formRow = selectElement.closest('.form-row');
  
      if (!formRow) {
        return null;
      }
  
      formRow.classList.add('has-custom-select');
  
      const existingCustomSelect = formRow.querySelector('.custom-select');
      if (existingCustomSelect) {
        existingCustomSelect.remove();
      }
  
      const root = document.createElement('div');
      root.className = 'custom-select';
  
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'custom-select-trigger';
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');
  
      const label = document.createElement('span');
      label.className = 'custom-select-label';
      trigger.appendChild(label);
  
      const dropdown = document.createElement('div');
      dropdown.className = 'custom-select-dropdown';
      dropdown.hidden = true;
      dropdown.setAttribute('role', 'listbox');
  
      root.appendChild(trigger);
      root.appendChild(dropdown);
      formRow.appendChild(root);
  
      const instance = {
        select: selectElement,
        root,
        trigger,
        label,
        dropdown
      };
  
      let focusedIndex = -1;
      let typeaheadBuffer = '';
      let typeaheadTimer = null;
  
      function getOptions() {
        return Array.from(dropdown.querySelectorAll('.custom-select-option'));
      }
  
      function getSearchableOptions() {
        return getOptions().filter(option => option.dataset.value !== '');
      }
  
      function clearHoveredOptions() {
        getOptions().forEach(option => {
          option.classList.remove('is-hovered');
        });
  
        focusedIndex = -1;
      }
  
      function focusOption(index) {
        const options = getOptions();
  
        if (!options.length) {
          return;
        }
  
        focusedIndex = Math.max(0, Math.min(index, options.length - 1));
  
        options.forEach((opt, i) => {
          opt.classList.toggle('is-hovered', i === focusedIndex);
        });
  
        const activeOption = options[focusedIndex];
  
        activeOption.scrollIntoView({
          block: 'nearest'
        });
      }
  
      function focusSelectedOption() {
        const options = getOptions();
        const selectedIndex = options.findIndex(opt => opt.dataset.value === selectElement.value);
  
        focusOption(selectedIndex >= 0 ? selectedIndex : 0);
      }
  
      function resetTypeaheadBuffer() {
        typeaheadBuffer = '';
  
        if (typeaheadTimer) {
          clearTimeout(typeaheadTimer);
          typeaheadTimer = null;
        }
      }
  
      function scheduleTypeaheadReset() {
        if (typeaheadTimer) {
          clearTimeout(typeaheadTimer);
        }
  
        typeaheadTimer = setTimeout(() => {
          typeaheadBuffer = '';
          typeaheadTimer = null;
        }, 700);
      }
  
      function openCustomSelectWithFocus() {
        dropdown.hidden = false;
        updateCustomSelectDirection(instance);
        root.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        focusSelectedOption();
      }
  
      function openCustomSelectWithoutFocus() {
        dropdown.hidden = false;
        updateCustomSelectDirection(instance);
        root.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
  
      function closeCustomSelectWithReset() {
        resetTypeaheadBuffer();
        clearHoveredOptions();
        closeCustomSelect(instance);
      }
  
      function openCustomSelectForTypeahead() {
        if (dropdown.hidden) {
          openCustomSelectWithoutFocus();
        }
      }
  
      function openCustomSelectForKeyboardNavigation() {
        if (dropdown.hidden) {
          openCustomSelectWithFocus();
        }
      }
  
      function focusOptionBySearch(searchValue) {
        const normalizedSearch = normalizeSearchText(searchValue);
  
        if (!normalizedSearch) {
          return false;
        }
  
        const options = getOptions();
        const searchableOptions = getSearchableOptions();
  
        if (!searchableOptions.length) {
          return false;
        }
  
        const matchedOption = searchableOptions.find(option => (
          normalizeSearchText(option.textContent).startsWith(normalizedSearch)
        )) || searchableOptions.find(option => (
          normalizeSearchText(option.textContent).includes(normalizedSearch)
        ));
  
        if (!matchedOption) {
          return false;
        }
  
        const matchedIndex = options.indexOf(matchedOption);
  
        if (matchedIndex === -1) {
          return false;
        }
  
        focusOption(matchedIndex);
        return true;
      }
  
      syncCustomSelectOptions(instance);
      bindCustomSelectChange(selectElement, instance);
  
      dropdown.addEventListener('mouseleave', () => {
        clearHoveredOptions();
      });
  
      trigger.addEventListener('blur', () => {
        resetTypeaheadBuffer();
      });
  
      trigger.addEventListener('click', () => {
        const willOpen = dropdown.hidden;
  
        closeAllCustomSelects(willOpen ? root : null);
  
        if (willOpen) {
          resetTypeaheadBuffer();
          openCustomSelectWithFocus();
        } else {
          closeCustomSelectWithReset();
        }
      });
  
      trigger.addEventListener('keydown', event => {
        const isOpen = !dropdown.hidden;
        const isCharacterKey = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
  
        if (!isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
          event.preventDefault();
          openCustomSelectForKeyboardNavigation();
          return;
        }
  
        if (isCharacterKey) {
          openCustomSelectForTypeahead();
  
          typeaheadBuffer += event.key;
          scheduleTypeaheadReset();
  
          if (focusOptionBySearch(typeaheadBuffer)) {
            event.preventDefault();
          }
  
          return;
        }
  
        if (!isOpen) {
          return;
        }
  
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          resetTypeaheadBuffer();
          focusOption(focusedIndex + 1);
        }
  
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          resetTypeaheadBuffer();
          focusOption(focusedIndex - 1);
        }
  
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          resetTypeaheadBuffer();
  
          const options = getOptions();
          const selected = options[focusedIndex];
  
          if (selected) {
            selected.click();
          }
        }
  
        if (event.key === 'Escape') {
          event.preventDefault();
          closeCustomSelectWithReset();
          trigger.focus();
        }
  
        if (event.key === 'Tab') {
          closeCustomSelectWithReset();
        }
      });
  
      return instance;
    }
  
    function refreshCustomSelect(selectElement) {
      const instance = customSelectInstances.find(item => item.select === selectElement);
  
      if (!instance) {
        const newInstance = createCustomSelect(selectElement);
  
        if (newInstance) {
          customSelectInstances.push(newInstance);
        }
  
        return;
      }
  
      syncCustomSelectOptions(instance);
      closeCustomSelect(instance);
    }
  
    function initCustomSelects() {
      customSelectInstances.forEach(instance => {
        instance.root.remove();
        instance.select.closest('.form-row')?.classList.remove('has-custom-select');
      });
  
      customSelectInstances = selectElements
        .map(selectElement => createCustomSelect(selectElement))
        .filter(Boolean);
    }
  
    function updateOpenCustomSelectsDirection() {
      customSelectInstances.forEach(instance => {
        if (!instance.dropdown.hidden) {
          updateCustomSelectDirection(instance);
        }
      });
    }
  
    function bindGlobalEvents() {
      document.addEventListener('click', event => {
        const clickedInsideCustomSelect = event.target.closest('.custom-select');
  
        if (!clickedInsideCustomSelect) {
          closeAllCustomSelects();
        }
      });
  
      window.addEventListener('resize', () => {
        updateOpenCustomSelectsDirection();
      });
  
      window.addEventListener('scroll', () => {
        updateOpenCustomSelectsDirection();
      }, true);
    }
  
    return {
      initCustomSelects,
      refreshCustomSelect,
      closeAllCustomSelects,
      bindGlobalEvents
    };
  }