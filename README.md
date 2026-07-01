# ApplyTrack — Трекер откликов на вакансии

Профессиональное веб-приложение для отслеживания откликов на вакансии: канбан-доска, аналитика, напоминания, история статусов и многое другое.

## Стек технологий

- **React 19** + **TypeScript**
- **Vite 8** — сборка
- **Tailwind CSS v4** — стили
- **Radix UI** — доступные примитивы компонентов
- **Supabase** — база данных (PostgreSQL), аутентификация (Google OAuth), realtime-синхронизация
- **@dnd-kit** — drag-and-drop для канбан-доски
- **date-fns** — форматирование дат
- **lucide-react** — иконки

## Возможности

### Учёт откликов
- Полная карточка отклика: компания, вакансия, дата, способ отклика, статус, приоритет
- Зарплатная вилка, локация, контактное лицо, ссылка на вакансию
- Теги для произвольной категоризации (Удалёнка, Мечта, Финтех...)
- Следующий шаг с датой напоминания
- Короткая заметка и полное описание вакансии

### Статусы откликов
Отправлено → На рассмотрении → HR / Скрининг → Техническое интервью → Финальное интервью → Оффер → Принято (либо Отклонено / Нет ответа)

### Три режима просмотра
- **Таблица** — сортировка, поиск, фильтры, массовые действия
- **Канбан** — визуальная доска с drag-and-drop для смены статуса
- **Аналитика** — воронка прохождения этапов, динамика по неделям, конверсия в интервью/оффер, среднее время ответа, топ компаний

### Напоминания
Виджет с просроченными и приближающимися дедлайнами по следующим шагам

### История изменений
Каждое изменение статуса автоматически фиксируется и отображается в виде таймлайна в карточке отклика

### Массовые операции
Выбор нескольких откликов для пакетного изменения статуса, архивирования или удаления

### Экспорт
Выгрузка текущего списка откликов в CSV

### Аутентификация
Вход через Google (Supabase Auth), данные каждого пользователя изолированы через Row Level Security

## Запуск

```bash
npm install
npm run dev
```

Если сервер не стартует (порт занят или белый экран):

```bash
npm run dev:restart
```

Создайте файл `.env.local` в корне проекта:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=http://localhost:5173
```

Откройте [http://localhost:5173](http://localhost:5173) в браузере.

### Если не открывается

1. Убедитесь, что сервер запущен — в терминале должно быть `VITE ... ready` и адрес `http://localhost:5173/` (или другой порт, если 5173 занят).
2. **Не запускается / Port is already in use** — одна команда:
   ```bash
   npm run dev:restart
   ```
3. **Белый экран** — очистите кэш Vite:
   ```bash
   npm run dev:clean
   ```
   Затем обновите страницу (Ctrl+Shift+R / Cmd+Shift+R).
4. Создайте `.env.local` (скопируйте из `.env.example`) — без него приложение покажет страницу с инструкцией.
5. В Supabase Dashboard → Authentication → URL Configuration добавьте:
   - Site URL: `http://localhost:5173`
   - Redirect URLs: `http://localhost:5173/**` и `http://localhost:5174/**`

## Сборка для продакшена

```bash
npm run build
npm run preview
```

## Деплой на Vercel

Проект — Vite SPA; в репозитории уже есть `vercel.json` (rewrite на `index.html`).

### Вариант 1: через Vercel Dashboard (самый простой)

1. Откройте [vercel.com/new](https://vercel.com/new) и импортируйте репозиторий `shimon240/tracker`.
2. Выберите ветку `cursor/applytrack-pro-features-dd31` (или `main` после мержа).
3. Framework Preset: **Vite** (определится автоматически).
4. Добавьте переменные окружения:

   | Переменная | Значение |
   |------------|----------|
   | `VITE_SUPABASE_URL` | `https://ufcnppoazxfcnmnozpyk.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | anon key из Supabase Dashboard |
   | `VITE_APP_URL` | `https://<ваш-домен>.vercel.app` |

5. Нажмите **Deploy**.

### Вариант 2: через Cursor (Vercel MCP)

1. Cursor → Settings → MCP → **Vercel** → подключите аккаунт.
2. Попросите агента задеплоить снова — он сможет использовать MCP или CLI с токеном.

### Вариант 3: GitHub Actions (CI)

В настройках репозитория GitHub → Secrets добавьте:

- `VERCEL_TOKEN` — [vercel.com/account/tokens](https://vercel.com/account/tokens)
- `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — из `.vercel/project.json` после `vercel link`
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_APP_URL`

Workflow: `.github/workflows/vercel-deploy.yml` (деплой при push).

### После деплоя — Supabase Auth

В [Supabase Dashboard](https://supabase.com/dashboard) → Authentication → URL Configuration:

- **Site URL:** `https://<ваш-домен>.vercel.app`
- **Redirect URLs:** `https://<ваш-домен>.vercel.app/**`

В Google Cloud Console (OAuth) добавьте production redirect URI, если используете Google OAuth напрямую.
