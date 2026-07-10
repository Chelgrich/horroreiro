import { render } from 'preact';
import { useMemo, useState } from 'preact/hooks';

const EMPTY_FILTERS = Object.freeze({
  missingBirthDate: false,
  missingBirthPlace: false
});

function normalizeTextKey(value) {
  return String(value || '')
    .toLocaleLowerCase('ru-RU')
    .trim()
    .replace(/\s+/g, ' ');
}

function hasDirectorBirthDate(director) {
  return Boolean(String(director?.birth_date || '').trim());
}

function hasDirectorBirthPlace(director) {
  return Boolean(String(director?.birth_place || '').trim());
}

function getMovieCountsByDirectorId(movieDirectorRows = []) {
  return (Array.isArray(movieDirectorRows) ? movieDirectorRows : []).reduce((counts, row) => {
    const directorId = String(row?.person_id || '').trim();

    if (directorId) {
      counts.set(directorId, (counts.get(directorId) || 0) + 1);
    }

    return counts;
  }, new Map());
}

function getDuplicateDirectorNameKeys(directors = []) {
  const counts = new Map();

  directors.forEach(director => {
    const key = normalizeTextKey(director?.name_ru);

    if (key) {
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  });

  return new Set(
    Array.from(counts.entries())
      .filter(([, count]) => count > 1)
      .map(([key]) => key)
  );
}

function getDirectorsAdminFilterCounts(directors = []) {
  return (Array.isArray(directors) ? directors : []).reduce((counts, director) => {
    if (!hasDirectorBirthDate(director)) {
      counts.missingBirthDate += 1;
    }

    if (!hasDirectorBirthPlace(director)) {
      counts.missingBirthPlace += 1;
    }

    return counts;
  }, {
    missingBirthDate: 0,
    missingBirthPlace: 0
  });
}

function getFilteredDirectors(directors, filters) {
  const sourceDirectors = Array.isArray(directors) ? directors : [];
  const shouldFilterBirthDate = Boolean(filters.missingBirthDate);
  const shouldFilterBirthPlace = Boolean(filters.missingBirthPlace);

  if (!shouldFilterBirthDate && !shouldFilterBirthPlace) {
    return sourceDirectors;
  }

  return sourceDirectors.filter(director => (
    (!shouldFilterBirthDate || !hasDirectorBirthDate(director)) &&
    (!shouldFilterBirthPlace || !hasDirectorBirthPlace(director))
  ));
}

function hasActiveFilters(filters) {
  return Boolean(filters.missingBirthDate || filters.missingBirthPlace);
}

function getMoviesCountLabel(count) {
  const normalizedCount = Math.abs(Number(count) || 0);
  const lastTwoDigits = normalizedCount % 100;
  const lastDigit = normalizedCount % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'фильмов';
  }

  if (lastDigit === 1) {
    return 'фильм';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'фильма';
  }

  return 'фильмов';
}

function getDirectorsCountLabel(count) {
  const normalizedCount = Math.abs(Number(count) || 0);
  const lastTwoDigits = normalizedCount % 100;
  const lastDigit = normalizedCount % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'режиссёров';
  }

  if (lastDigit === 1) {
    return 'режиссёр';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'режиссёра';
  }

  return 'режиссёров';
}

function FilterButton({ filterKey, label, count, active, onToggle }) {
  return (
    <button
      type="button"
      className={`directors-admin-filter-chip${active ? ' is-active' : ''}`}
      aria-pressed={active ? 'true' : 'false'}
      onClick={() => onToggle(filterKey)}
    >
      <span>{label}</span>
      <span className="directors-admin-filter-chip-count">{count}</span>
    </button>
  );
}

function DirectorsAdminFilters({ directors, filters, onToggle, onReset }) {
  const counts = useMemo(() => getDirectorsAdminFilterCounts(directors), [directors]);

  return (
    <div className="directors-admin-page-filters" aria-label="Фильтры заполненности">
      <span className="directors-admin-page-filters-label">Показать:</span>
      <FilterButton
        filterKey="missingBirthDate"
        label="Без даты рождения"
        count={counts.missingBirthDate}
        active={filters.missingBirthDate}
        onToggle={onToggle}
      />
      <FilterButton
        filterKey="missingBirthPlace"
        label="Без места рождения"
        count={counts.missingBirthPlace}
        active={filters.missingBirthPlace}
        onToggle={onToggle}
      />
      {hasActiveFilters(filters) ? (
        <button
          type="button"
          className="directors-admin-filter-reset"
          onClick={onReset}
        >
          Сбросить
        </button>
      ) : null}
    </div>
  );
}

function DirectorAvatar({ director, displayName, getPlaceholderSvgHtml }) {
  if (director.photo_url) {
    return (
      <img
        src={director.photo_url}
        alt=""
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <span
      className="directors-admin-card-avatar-placeholder"
      aria-hidden="true"
      dangerouslySetInnerHTML={{
        __html: getPlaceholderSvgHtml(director, 'directors-admin-card-avatar-placeholder-icon', displayName)
      }}
    />
  );
}

function DirectorCard({ director, movieCount, isDuplicateName, actions, utils }) {
  const displayName = utils.getDirectorDisplayName(director);
  const secondaryName = utils.getDirectorSecondaryName(director);
  const lifeLabel = utils.getDirectorLifeLabel(director);
  const hasTmdbUrl = Boolean(String(director?.tmdb_url || '').trim());

  return (
    <article className={`directors-admin-card${hasTmdbUrl ? '' : ' is-missing-tmdb'}`}>
      <a className="directors-admin-card-main" href={utils.buildDirectorPageUrl(director)}>
        <div className="directors-admin-card-avatar">
          <DirectorAvatar
            director={director}
            displayName={displayName}
            getPlaceholderSvgHtml={utils.getDirectorPlaceholderSvgHtml}
          />
        </div>
        <div className="directors-admin-card-body">
          <div className="directors-admin-card-name">{displayName}</div>
          {secondaryName ? <div className="directors-admin-card-original">{secondaryName}</div> : null}
          {lifeLabel ? <div className="directors-admin-card-meta">{lifeLabel}</div> : null}
          <div className="directors-admin-card-meta">
            {movieCount} {getMoviesCountLabel(movieCount)}
          </div>
        </div>
      </a>
      <div className="directors-admin-card-actions">
        {isDuplicateName ? (
          <span className="directors-admin-duplicate-badge" title="Есть режиссёры с таким же именем">
            Тёзка
          </span>
        ) : null}
        {!hasTmdbUrl ? (
          <span className="directors-admin-missing-tmdb-badge" title="Не заполнена ссылка TMDB">
            Нет TMDB
          </span>
        ) : null}
        <button
          type="button"
          className="secondary-button secondary-button-compact"
          onClick={() => actions.edit(director.id)}
        >
          Редактировать
        </button>
      </div>
    </article>
  );
}

function EmptyState({ children, large = false }) {
  return (
    <div className={`directors-admin-page-empty-state${large ? ' directors-admin-page-empty-state-large' : ''}`}>
      {children}
    </div>
  );
}

function DirectorsAdminReady({ directors, movieDirectorRows, actions, utils }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const sourceDirectors = Array.isArray(directors) ? directors : [];
  const filteredDirectors = useMemo(
    () => getFilteredDirectors(sourceDirectors, filters),
    [sourceDirectors, filters]
  );
  const movieCountsByDirectorId = useMemo(
    () => getMovieCountsByDirectorId(movieDirectorRows),
    [movieDirectorRows]
  );
  const duplicateNameKeys = useMemo(
    () => getDuplicateDirectorNameKeys(sourceDirectors),
    [sourceDirectors]
  );
  const activeFilters = hasActiveFilters(filters);
  const directorsCountText = activeFilters
    ? `${filteredDirectors.length} из ${sourceDirectors.length} ${getDirectorsCountLabel(sourceDirectors.length)}`
    : `${sourceDirectors.length} ${getDirectorsCountLabel(sourceDirectors.length)}`;

  const toggleFilter = filterKey => {
    setFilters(currentFilters => ({
      ...currentFilters,
      [filterKey]: !currentFilters[filterKey]
    }));
  };

  return (
    <>
      <section className="directors-admin-page-toolbar">
        <div>
          <p className="directors-admin-page-kicker">{directorsCountText}</p>
          <p className="directors-admin-page-note">
            Технический список для быстрого редактирования страниц режиссёров.
          </p>
        </div>
        <button type="button" className="secondary-button" onClick={actions.create}>
          Добавить режиссёра
        </button>
      </section>

      {sourceDirectors.length ? (
        <DirectorsAdminFilters
          directors={sourceDirectors}
          filters={filters}
          onToggle={toggleFilter}
          onReset={() => setFilters(EMPTY_FILTERS)}
        />
      ) : null}

      {filteredDirectors.length ? (
        <div className="directors-admin-grid">
          {filteredDirectors.map(director => (
            <DirectorCard
              key={director.id}
              director={director}
              movieCount={movieCountsByDirectorId.get(String(director.id)) || 0}
              isDuplicateName={duplicateNameKeys.has(normalizeTextKey(director?.name_ru))}
              actions={actions}
              utils={utils}
            />
          ))}
        </div>
      ) : (
        <EmptyState>
          {sourceDirectors.length
            ? 'По выбранным фильтрам режиссёров нет.'
            : 'Режиссёры пока не созданы.'}
        </EmptyState>
      )}
    </>
  );
}

function DirectorsAdminApp(props) {
  const {
    status = 'loading',
    directors = [],
    movieDirectorRows = [],
    actions = {},
    utils = {}
  } = props;
  const safeActions = {
    login: actions.login || (() => {}),
    refresh: actions.refresh || (() => {}),
    create: actions.create || (() => {}),
    edit: actions.edit || (() => {})
  };
  const safeUtils = {
    buildDirectorPageUrl: utils.buildDirectorPageUrl || (() => '#'),
    getDirectorDisplayName: utils.getDirectorDisplayName || (director => director?.name_ru || director?.name || 'Без имени'),
    getDirectorSecondaryName: utils.getDirectorSecondaryName || (director => director?.name || ''),
    getDirectorLifeLabel: utils.getDirectorLifeLabel || (() => ''),
    getDirectorPlaceholderSvgHtml: utils.getDirectorPlaceholderSvgHtml || (() => '')
  };

  if (status === 'loading') {
    return <div className="directors-admin-page-loading-state">Загрузка режиссёров...</div>;
  }

  if (status === 'auth') {
    return (
      <EmptyState large>
        <p>Войди под администратором, чтобы открыть список режиссёров.</p>
        <button type="button" className="secondary-button directors-admin-page-login-button" onClick={safeActions.login}>
          Войти
        </button>
      </EmptyState>
    );
  }

  if (status === 'forbidden') {
    return (
      <EmptyState large>
        <p>Список режиссёров доступен только администратору.</p>
      </EmptyState>
    );
  }

  if (status === 'unavailable') {
    return (
      <EmptyState large>
        <p>Таблицы персон пока недоступны: серверный контур персон не подключён.</p>
      </EmptyState>
    );
  }

  if (status === 'error') {
    return (
      <EmptyState large>
        <p>Не удалось загрузить режиссёров. Попробуй обновить страницу.</p>
        <button type="button" className="secondary-button directors-admin-page-login-button" onClick={safeActions.refresh}>
          Повторить
        </button>
      </EmptyState>
    );
  }

  return (
    <DirectorsAdminReady
      directors={directors}
      movieDirectorRows={movieDirectorRows}
      actions={safeActions}
      utils={safeUtils}
    />
  );
}

function mountDirectorsAdminApp(root, initialProps = {}) {
  let currentProps = initialProps;

  const update = nextProps => {
    currentProps = {
      ...currentProps,
      ...nextProps
    };

    render(<DirectorsAdminApp {...currentProps} />, root);
  };

  update(initialProps);

  return {
    update,
    unmount: () => render(null, root)
  };
}

export { mountDirectorsAdminApp };
