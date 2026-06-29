import { useState, useCallback, useMemo } from 'react'
import type { Application, ApplicationStatus, FilterState, SortDirection, SortField, SubmissionMethod } from '@/types'

const STORAGE_KEY = 'applytrack_applications'

function generateId(): string {
  return `app_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function loadFromStorage(): Application[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Application[]
  } catch {
    return []
  }
}

function saveToStorage(apps: Application[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps))
  } catch {
    // ignore storage errors
  }
}

const SAMPLE_DATA: Application[] = [
  {
    id: 'app_sample_1',
    company: 'Яндекс',
    position: 'Senior Frontend Developer',
    date_applied: '2026-06-20',
    submission_method: 'hh.ru',
    status: 'Техническое интервью',
    next_step: 'Техническое интервью в пятницу в 15:00',
    short_note: 'Стек: React, TypeScript, Node.js. Команда работает над поиском.',
    job_description: `## Senior Frontend Developer — Яндекс Поиск

**Команда:** Разработка интерфейса поиска
**Формат:** Гибридный (Москва)

### Обязанности:
- Разработка и поддержка высоконагруженного фронтенда поиска
- Участие в проектировании архитектуры новых фич
- Code review, менторство junior-разработчиков
- Взаимодействие с продуктовыми командами

### Требования:
- 4+ года опыта в frontend-разработке
- Глубокие знания React, TypeScript
- Опыт с производительностью веб-приложений
- Понимание принципов доступности (a11y)

### Условия:
- Зарплата: 350 000 – 500 000 ₽
- ДМС, питание в офисе
- Гибкий график`,
    archived: false,
    created_at: new Date('2026-06-20').toISOString(),
    updated_at: new Date('2026-06-20').toISOString(),
  },
  {
    id: 'app_sample_2',
    company: 'Сбер',
    position: 'Lead Frontend Engineer',
    date_applied: '2026-06-18',
    submission_method: 'LinkedIn',
    status: 'HR / Скриннинг',
    next_step: 'Ждём обратной связи от HR после скрининга',
    short_note: 'Зарплатная вилка 400–550к. Нужен опыт с микрофронтендами.',
    job_description: `## Lead Frontend Engineer — СберТех

**Команда:** Digital Banking Platform
**Формат:** Офис (Москва, Кутузовская)

### Обязанности:
- Техническое лидерство команды из 6 разработчиков
- Архитектура микрофронтенд-платформы
- Оценка задач, планирование спринтов
- Взаимодействие со смежными командами

### Требования:
- 5+ лет в frontend-разработке
- Опыт с микрофронтендами (Module Federation)
- Знание Vue.js или React
- Опыт работы в финтех — плюс

### Условия:
- Зарплата: 400 000 – 550 000 ₽
- ДМС премиум, корпоративное обучение`,
    archived: false,
    created_at: new Date('2026-06-18').toISOString(),
    updated_at: new Date('2026-06-19').toISOString(),
  },
  {
    id: 'app_sample_3',
    company: 'Авито',
    position: 'Frontend Developer',
    date_applied: '2026-06-15',
    submission_method: 'Сайт компании',
    status: 'Отклонено',
    next_step: '',
    short_note: 'Отказали после технического интервью. Не хватило опыта с WebSockets.',
    job_description: `## Frontend Developer — Авито

**Команда:** Чат и мессенджер
**Формат:** Гибридный (Москва)

### Обязанности:
- Разработка real-time чата на базе WebSockets
- Поддержка мобильного веб-приложения
- A/B тестирование интерфейсных решений

### Требования:
- 3+ года frontend-опыта
- React, Redux/MobX
- Опыт с WebSockets, Server-Sent Events
- Понимание CSR/SSR`,
    archived: false,
    created_at: new Date('2026-06-15').toISOString(),
    updated_at: new Date('2026-06-22').toISOString(),
  },
  {
    id: 'app_sample_4',
    company: 'VK',
    position: 'Middle Frontend Developer',
    date_applied: '2026-06-25',
    submission_method: 'Рекрутер',
    status: 'Отправлено',
    next_step: 'Ждём ответа (рекрутер написала напомнить через неделю)',
    short_note: 'Контакт: Анна Соколова. Позиция в команде VK Mini Apps.',
    job_description: `## Middle Frontend Developer — VK Mini Apps

**Команда:** VK Mini Apps Platform
**Формат:** Офис / Удалёнка (на выбор)

### Обязанности:
- Разработка платформы мини-приложений ВКонтакте
- Поддержка SDK и документации для сторонних разработчиков

### Требования:
- 2–4 года в frontend-разработке
- React или Vue.js
- TypeScript — обязательно
- Понимание принципов дизайн-систем`,
    archived: false,
    created_at: new Date('2026-06-25').toISOString(),
    updated_at: new Date('2026-06-25').toISOString(),
  },
  {
    id: 'app_sample_5',
    company: 'Tinkoff',
    position: 'Senior React Developer',
    date_applied: '2026-06-10',
    submission_method: 'hh.ru',
    status: 'Оффер',
    next_step: 'Рассмотреть оффер до 5 июля. Зарплата: 420 000 ₽',
    short_note: 'Очень хорошие условия. Команда тёплая, технический стек современный.',
    job_description: `## Senior React Developer — Тинькофф

**Команда:** Инвестиции (Tinkoff Invest)
**Формат:** Удалённо

### Обязанности:
- Разработка торгового терминала
- Работа с high-frequency data, WebSockets
- Оптимизация производительности

### Требования:
- 4+ года с React
- TypeScript, тесты (Jest, Cypress)
- Опыт с финансовыми данными — плюс

### Условия:
- Зарплата: от 420 000 ₽
- Полностью удалённая работа
- ДМС, страхование жизни`,
    archived: false,
    created_at: new Date('2026-06-10').toISOString(),
    updated_at: new Date('2026-06-28').toISOString(),
  },
]

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>(() => {
    const stored = loadFromStorage()
    if (stored.length > 0) return stored
    saveToStorage(SAMPLE_DATA)
    return SAMPLE_DATA
  })

  const updateApplications = useCallback((updater: (prev: Application[]) => Application[]) => {
    setApplications(prev => {
      const next = updater(prev)
      saveToStorage(next)
      return next
    })
  }, [])

  const addApplication = useCallback((data: Omit<Application, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString()
    const newApp: Application = {
      ...data,
      id: generateId(),
      created_at: now,
      updated_at: now,
    }
    updateApplications(prev => [newApp, ...prev])
    return newApp
  }, [updateApplications])

  const updateApplication = useCallback((id: string, data: Partial<Application>) => {
    updateApplications(prev =>
      prev.map(app =>
        app.id === id
          ? { ...app, ...data, updated_at: new Date().toISOString() }
          : app
      )
    )
  }, [updateApplications])

  const deleteApplication = useCallback((id: string) => {
    updateApplications(prev => prev.filter(app => app.id !== id))
  }, [updateApplications])

  const archiveApplication = useCallback((id: string) => {
    updateApplication(id, { archived: true })
  }, [updateApplication])

  const unarchiveApplication = useCallback((id: string) => {
    updateApplication(id, { archived: false })
  }, [updateApplication])

  const updateStatus = useCallback((id: string, status: ApplicationStatus) => {
    updateApplication(id, { status })
  }, [updateApplication])

  const stats = useMemo(() => {
    const active = applications.filter(a => !a.archived)
    return {
      total: active.length,
      sent: active.filter(a => a.status === 'Отправлено').length,
      inProgress: active.filter(a => ['На рассмотрении', 'HR / Скриннинг', 'Техническое интервью', 'Финальное интервью'].includes(a.status)).length,
      offers: active.filter(a => a.status === 'Оффер').length,
      accepted: active.filter(a => a.status === 'Принято').length,
      rejected: active.filter(a => a.status === 'Отклонено').length,
      noResponse: active.filter(a => a.status === 'Нет ответа').length,
      archived: applications.filter(a => a.archived).length,
    }
  }, [applications])

  return {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
    archiveApplication,
    unarchiveApplication,
    updateStatus,
    stats,
  }
}

export function useFilteredApplications(
  applications: Application[],
  filters: FilterState,
  sortField: SortField,
  sortDirection: SortDirection
) {
  return useMemo(() => {
    let result = applications.filter(app => {
      if (!filters.showArchived && app.archived) return false
      if (filters.showArchived && !app.archived) return false

      if (filters.status !== 'all' && app.status !== filters.status) return false
      if (filters.method !== 'all' && app.submission_method !== filters.method) return false

      if (filters.search.trim()) {
        const q = filters.search.toLowerCase()
        const searchable = [app.company, app.position, app.short_note, app.next_step].join(' ').toLowerCase()
        if (!searchable.includes(q)) return false
      }

      return true
    })

    result = [...result].sort((a, b) => {
      let aVal: string
      let bVal: string

      if (sortField === 'date_applied') {
        aVal = a.date_applied
        bVal = b.date_applied
      } else if (sortField === 'company') {
        aVal = a.company.toLowerCase()
        bVal = b.company.toLowerCase()
      } else if (sortField === 'position') {
        aVal = a.position.toLowerCase()
        bVal = b.position.toLowerCase()
      } else if (sortField === 'status') {
        aVal = a.status
        bVal = b.status
      } else {
        aVal = a.created_at
        bVal = b.created_at
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [applications, filters, sortField, sortDirection])
}

export const STATUSES: ApplicationStatus[] = [
  'Отправлено',
  'На рассмотрении',
  'HR / Скриннинг',
  'Техническое интервью',
  'Финальное интервью',
  'Оффер',
  'Отклонено',
  'Нет ответа',
  'Принято',
]

export const SUBMISSION_METHODS: SubmissionMethod[] = [
  'LinkedIn',
  'Сайт компании',
  'Email',
  'Рекрутер',
  'hh.ru',
  'Реферал',
  'Другое',
]
