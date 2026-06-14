# 🎬 Хоррорейро

Веб-приложение-каталог фильмов на чистом HTML, CSS и JavaScript.

## Стек

- Frontend: HTML, CSS, Vanilla JS
- Backend: Supabase
  - PostgreSQL
  - Auth
  - Storage
  - RLS
- Деплой: Cloudflare Pages
- Репозиторий: GitHub

## Архитектура

Проект разбит на 4 основных файла:

- `index.html`
- `styles.css`
- `app.js`
- `custom-select.js`

Дополнительно используется Cloudflare Pages Function:

- `functions/env.js` — отдаёт клиентские переменные окружения в `window.__ENV__`


## Функционал

### Каталог
- Сетка карточек фильмов
- Постеры в пропорции 2:3
- Метаданные фильма
- Средний рейтинг
- Количество голосов
- Пользовательская оценка от 1 до 10
- Режим общего списка
- Режим релизов с разбивкой по годам и месяцам
- Пресеты фильтрации
- Watchlist и просмотренные фильмы

### Поиск
- Живой поиск
- По полям:
  - `title`
  - `original_title`
  - `director`
- Поддержка нескольких слов

### Фильтры
- Доп. жанр
- Страна
- Рейтинг
- Год
- Смотреть позже
- Просмотренные

### Сортировка
- Сначала новые
- Сначала старые

### CRUD
- Добавление фильмов
- Редактирование фильмов
- Удаление фильмов
- Загрузка постеров в Supabase Storage

### Авторизация
- Supabase Auth
- RLS включён
- Публичный доступ на чтение
- Изменение данных — только для владельца / администратора по текущей логике проекта

## Переменные окружения

На клиенте используются:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Они не хранятся в репозитории и отдаются через Cloudflare Pages Function `/env`.

Только на сервере Cloudflare Pages Functions используются:

- `SUPABASE_SERVICE_ROLE_KEY` — service role ключ Supabase, не отдаётся клиенту.
- `IMPERSONATION_ADMIN_USER_IDS` — ID администраторов через запятую или пробел, которым разрешён вход под пользователями.
- `IMPERSONATION_REDIRECT_URL` — необязательный URL возврата после impersonation magic link. Если не задан, используется origin текущего запроса.

`IMPERSONATION_REDIRECT_URL` или домен текущего запроса должны быть разрешены в Supabase Auth URL Configuration.

## Настройка Cloudflare Pages

В проекте Cloudflare Pages нужно добавить переменные окружения:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `IMPERSONATION_ADMIN_USER_IDS`

## Локальная структура проекта

```text
/
├─ index.html
├─ styles.css
├─ app.js
├─ custom-select.js
├─ functions/
│  └─ env.js
├─ README.md
└─ .gitignore
