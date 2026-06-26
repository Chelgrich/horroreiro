# Хоррорейро

Веб-приложение-каталог хорроров на чистом HTML, CSS и JavaScript.

## Стек

- Frontend: HTML, CSS, Vanilla JS
- Backend: Supabase
  - PostgreSQL
  - Auth
  - Storage
  - RLS
- Деплой: Cloudflare Pages
- Edge-слой: Cloudflare Pages Functions

## Основные страницы

- `index.html` — каталог фильмов
- `movie.html` — детальная страница фильма
- `user.html` — страница профиля
- `following.html` — отслеживаемые профили и лента активности

## Клиентские ассеты

- `boot-loader.js` — ранняя загрузка `/env` и versioned `styles.css`
- `app-script-loader.js` — page-aware загрузка общих и страницезависимых скриптов
- `shared-layout.js` — общая шапка, модалки авторизации, настройки профиля и футер
- `custom-select.js` — кастомные select-контролы для каталога и модалки фильма
- `app.js` — основная логика приложения
- `styles.css` — стили интерфейса

## Cloudflare Pages Functions

- `/env` отдаёт публичные клиентские переменные в `window.__ENV__`
- `/admin/users/:id/password` даёт администратору серверную установку пароля пользователя через Supabase Auth Admin API
- `/`, `/index.html`, `/movie/*`, `/movie.html`, `/user/*`, `/user.html`, `/following`, `/following.html` отдаются с корректной no-store HTML-логикой
- `/sitemap.xml` генерируется динамически из актуальной базы фильмов

## Переменные окружения

На Cloudflare Pages нужны:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — только для Cloudflare Functions, не отдаётся в `/env`

`APP_BUILD_VERSION` обычно берётся из `CF_PAGES_COMMIT_SHA`.

## Архив

`archive/taxonomy/` хранит старую таксономическую систему похожести. Она не загружается активными страницами: текущий продакшен-контур похожих фильмов управляется вручную.

## Проверки

Перед пушем полезно запускать:

```powershell
git diff --check
git ls-files '*.js' | ForEach-Object { node --check $_ }
node tools/smoke-check.js
```
