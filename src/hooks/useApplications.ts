import { useState, useCallback, useMemo, useEffect } from 'react'
import type { Application, ApplicationStatus, FilterState, Priority, SortDirection, SortField, SubmissionMethod } from '@/types'
import { supabase } from '@/lib/supabase'

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

export const PRIORITIES: Priority[] = ['Низкий', 'Средний', 'Высокий', 'Мечта']

type NewApplication = Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at'>

const SAMPLE_DATA: NewApplication[] = [
  {
    company: 'Яндекс',
    position: 'Senior Frontend Developer',
    date_applied: '2026-06-20',
    submission_method: 'hh.ru',
    status: 'Техническое интервью',
    next_step: 'Техническое интервью в пятницу в 15:00',
    next_step_date: '2026-07-03',
    short_note: 'Стек: React, TypeScript, Node.js. Команда работает над поиском.',
    job_description: `Senior Frontend Developer — Яндекс Поиск

Команда: Разработка интерфейса поиска
Формат: Гибридный (Москва)

Обязанности:
- Разработка и поддержка высоконагруженного фронтенда поиска
- Участие в проектировании архитектуры новых фич
- Code review, менторство junior-разработчиков

Требования:
- 4+ года опыта в frontend-разработке
- Глубокие знания React, TypeScript
- Опыт с производительностью веб-приложений

Условия:
- Зарплата: 350 000 – 500 000 ₽
- ДМС, питание в офисе`,
    archived: false,
    priority: 'Высокий',
    tags: ['Удалёнка частично', 'Большая компания'],
    location: 'Москва',
    company_url: 'https://yandex.ru',
    contact_name: 'Мария Иванова',
    contact_email: 'm.ivanova@yandex.ru',
    salary_min: 350000,
    salary_max: 500000,
    salary_currency: 'RUB',
  },
  {
    company: 'Сбер',
    position: 'Lead Frontend Engineer',
    date_applied: '2026-06-18',
    submission_method: 'LinkedIn',
    status: 'HR / Скриннинг',
    next_step: 'Ждём обратной связи от HR после скрининга',
    next_step_date: '2026-07-01',
    short_note: 'Зарплатная вилка 400–550к. Нужен опыт с микрофронтендами.',
    job_description: `Lead Frontend Engineer — СберТех

Команда: Digital Banking Platform
Формат: Офис (Москва, Кутузовская)

Обязанности:
- Техническое лидерство команды из 6 разработчиков
- Архитектура микрофронтенд-платформы

Требования:
- 5+ лет в frontend-разработке
- Опыт с микрофронтендами (Module Federation)`,
    archived: false,
    priority: 'Средний',
    tags: ['Финтех', 'Лидерство'],
    location: 'Москва',
    company_url: 'https://www.sber.ru',
    contact_name: '',
    contact_email: '',
    salary_min: 400000,
    salary_max: 550000,
    salary_currency: 'RUB',
  },
  {
    company: 'Авито',
    position: 'Frontend Developer',
    date_applied: '2026-06-15',
    submission_method: 'Сайт компании',
    status: 'Отклонено',
    next_step: '',
    next_step_date: null,
    short_note: 'Отказали после технического интервью. Не хватило опыта с WebSockets.',
    job_description: `Frontend Developer — Авито

Команда: Чат и мессенджер
Формат: Гибридный (Москва)

Требования:
- 3+ года frontend-опыта
- React, Redux/MobX
- Опыт с WebSockets`,
    archived: false,
    priority: 'Низкий',
    tags: [],
    location: 'Москва',
    company_url: 'https://avito.ru',
    contact_name: '',
    contact_email: '',
    salary_min: null,
    salary_max: null,
    salary_currency: 'RUB',
  },
  {
    company: 'VK',
    position: 'Middle Frontend Developer',
    date_applied: '2026-06-25',
    submission_method: 'Рекрутер',
    status: 'Отправлено',
    next_step: 'Ждём ответа (рекрутер написала напомнить через неделю)',
    next_step_date: '2026-07-02',
    short_note: 'Контакт: Анна Соколова. Позиция в команде VK Mini Apps.',
    job_description: `Middle Frontend Developer — VK Mini Apps

Команда: VK Mini Apps Platform
Формат: Офис / Удалёнка (на выбор)

Требования:
- 2–4 года в frontend-разработке
- React или Vue.js
- TypeScript — обязательно`,
    archived: false,
    priority: 'Средний',
    tags: ['Удалёнка'],
    location: 'Санкт-Петербург',
    company_url: 'https://vk.com',
    contact_name: 'Анна Соколова',
    contact_email: 'a.sokolova@vk.team',
    salary_min: null,
    salary_max: null,
    salary_currency: 'RUB',
  },
  {
    company: 'Tinkoff',
    position: 'Senior React Developer',
    date_applied: '2026-06-10',
    submission_method: 'hh.ru',
    status: 'Оффер',
    next_step: 'Рассмотреть оффер до 5 июля',
    next_step_date: '2026-07-05',
    short_note: 'Очень хорошие условия. Команда тёплая, технический стек современный.',
    job_description: `Senior React Developer — Тинькофф

Команда: Инвестиции (Tinkoff Invest)
Формат: Удалённо

Требования:
- 4+ года с React
- TypeScript, тесты (Jest, Cypress)

Условия:
- Зарплата: от 420 000 ₽
- Полностью удалённая работа`,
    archived: false,
    priority: 'Мечта',
    tags: ['Удалёнка', 'Финтех', 'Мечта'],
    location: 'Удалённо',
    company_url: 'https://www.tinkoff.ru',
    contact_name: '',
    contact_email: '',
    salary_min: 420000,
    salary_max: null,
    salary_currency: 'RUB',
  },
]

export interface ApplicationStats {
  total: number
  sent: number
  inProgress: number
  offers: number
  accepted: number
  rejected: number
  noResponse: number
  archived: number
  responseRate: number
  interviewRate: number
  offerRate: number
}

export interface UseApplicationsResult {
  applications: Application[]
  loading: boolean
  error: string | null
  addApplication: (data: NewApplication) => Promise<void>
  updateApplication: (id: string, data: Partial<Application>) => Promise<void>
  deleteApplication: (id: string) => Promise<void>
  archiveApplication: (id: string) => Promise<void>
  unarchiveApplication: (id: string) => Promise<void>
  updateStatus: (id: string, status: ApplicationStatus) => Promise<void>
  bulkArchive: (ids: string[]) => Promise<void>
  bulkUnarchive: (ids: string[]) => Promise<void>
  bulkDelete: (ids: string[]) => Promise<void>
  bulkUpdateStatus: (ids: string[], status: ApplicationStatus) => Promise<void>
  stats: ApplicationStats
}

export function useApplications(): UseApplicationsResult {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err

      if (data.length === 0) {
        const { data: inserted, error: insertErr } = await supabase
          .from('applications')
          .insert(SAMPLE_DATA)
          .select()
        if (insertErr) throw insertErr
        setApplications((inserted ?? []) as Application[])
      } else {
        setApplications(data as Application[])
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchAll()
  }, [fetchAll])

  useEffect(() => {
    const channel = supabase
      .channel('applications_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'applications' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newApp = payload.new as Application
            setApplications(prev =>
              prev.some(a => a.id === newApp.id) ? prev : [newApp, ...prev]
            )
          } else if (payload.eventType === 'UPDATE') {
            setApplications(prev =>
              prev.map(a => a.id === (payload.new as Application).id ? payload.new as Application : a)
            )
          } else if (payload.eventType === 'DELETE') {
            setApplications(prev => prev.filter(a => a.id !== (payload.old as { id: string }).id))
          }
        }
      )
      .subscribe()

    return () => { void supabase.removeChannel(channel) }
  }, [])

  const addApplication = useCallback(async (data: NewApplication) => {
    const { data: inserted, error: err } = await supabase
      .from('applications')
      .insert([data])
      .select()
      .single()
    if (err) throw err
    setApplications(prev => [inserted as Application, ...prev])
  }, [])

  const updateApplication = useCallback(async (id: string, data: Partial<Application>) => {
    const { data: updated, error: err } = await supabase
      .from('applications')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    setApplications(prev => prev.map(a => a.id === id ? updated as Application : a))
  }, [])

  const deleteApplication = useCallback(async (id: string) => {
    const { error: err } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
    if (err) throw err
    setApplications(prev => prev.filter(a => a.id !== id))
  }, [])

  const archiveApplication = useCallback((id: string) =>
    updateApplication(id, { archived: true }), [updateApplication])

  const unarchiveApplication = useCallback((id: string) =>
    updateApplication(id, { archived: false }), [updateApplication])

  const updateStatus = useCallback((id: string, status: ApplicationStatus) =>
    updateApplication(id, { status }), [updateApplication])

  const bulkArchive = useCallback(async (ids: string[]) => {
    const { data, error: err } = await supabase
      .from('applications')
      .update({ archived: true })
      .in('id', ids)
      .select()
    if (err) throw err
    const updatedMap = new Map((data as Application[]).map(a => [a.id, a]))
    setApplications(prev => prev.map(a => updatedMap.get(a.id) ?? a))
  }, [])

  const bulkUnarchive = useCallback(async (ids: string[]) => {
    const { data, error: err } = await supabase
      .from('applications')
      .update({ archived: false })
      .in('id', ids)
      .select()
    if (err) throw err
    const updatedMap = new Map((data as Application[]).map(a => [a.id, a]))
    setApplications(prev => prev.map(a => updatedMap.get(a.id) ?? a))
  }, [])

  const bulkDelete = useCallback(async (ids: string[]) => {
    const { error: err } = await supabase
      .from('applications')
      .delete()
      .in('id', ids)
    if (err) throw err
    setApplications(prev => prev.filter(a => !ids.includes(a.id)))
  }, [])

  const bulkUpdateStatus = useCallback(async (ids: string[], status: ApplicationStatus) => {
    const { data, error: err } = await supabase
      .from('applications')
      .update({ status })
      .in('id', ids)
      .select()
    if (err) throw err
    const updatedMap = new Map((data as Application[]).map(a => [a.id, a]))
    setApplications(prev => prev.map(a => updatedMap.get(a.id) ?? a))
  }, [])

  const stats = useMemo<ApplicationStats>(() => {
    const active = applications.filter(a => !a.archived)
    const total = active.length
    const sent = active.filter(a => a.status === 'Отправлено').length
    const noResponse = active.filter(a => a.status === 'Нет ответа').length
    const inProgress = active.filter(a =>
      ['На рассмотрении', 'HR / Скриннинг', 'Техническое интервью', 'Финальное интервью'].includes(a.status)
    ).length
    const offers = active.filter(a => a.status === 'Оффер').length
    const accepted = active.filter(a => a.status === 'Принято').length
    const rejected = active.filter(a => a.status === 'Отклонено').length

    const responded = total - sent - noResponse
    const interviewed = active.filter(a =>
      ['Техническое интервью', 'Финальное интервью', 'Оффер', 'Принято'].includes(a.status)
    ).length

    return {
      total,
      sent,
      inProgress,
      offers,
      accepted,
      rejected,
      noResponse,
      archived: applications.filter(a => a.archived).length,
      responseRate: total > 0 ? Math.round((responded / total) * 100) : 0,
      interviewRate: total > 0 ? Math.round((interviewed / total) * 100) : 0,
      offerRate: total > 0 ? Math.round(((offers + accepted) / total) * 100) : 0,
    }
  }, [applications])

  return {
    applications,
    loading,
    error,
    addApplication,
    updateApplication,
    deleteApplication,
    archiveApplication,
    unarchiveApplication,
    updateStatus,
    bulkArchive,
    bulkUnarchive,
    bulkDelete,
    bulkUpdateStatus,
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
      if (filters.priority !== 'all' && app.priority !== filters.priority) return false
      if (filters.tag !== 'all' && !app.tags.includes(filters.tag)) return false

      if (filters.search.trim()) {
        const q = filters.search.toLowerCase()
        const searchable = [app.company, app.position, app.short_note, app.next_step, app.location, ...app.tags]
          .join(' ')
          .toLowerCase()
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
      } else if (sortField === 'next_step_date') {
        aVal = a.next_step_date ?? '9999-99-99'
        bVal = b.next_step_date ?? '9999-99-99'
      } else if (sortField === 'company') {
        aVal = a.company.toLowerCase()
        bVal = b.company.toLowerCase()
      } else if (sortField === 'position') {
        aVal = a.position.toLowerCase()
        bVal = b.position.toLowerCase()
      } else if (sortField === 'status') {
        aVal = a.status
        bVal = b.status
      } else if (sortField === 'priority') {
        const order: Record<string, number> = { 'Мечта': 3, 'Высокий': 2, 'Средний': 1, 'Низкий': 0 }
        aVal = String(order[a.priority] ?? 0).padStart(3, '0')
        bVal = String(order[b.priority] ?? 0).padStart(3, '0')
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

export function useAllTags(applications: Application[]): string[] {
  return useMemo(() => {
    const tagSet = new Set<string>()
    applications.forEach(a => a.tags.forEach(t => tagSet.add(t)))
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'ru'))
  }, [applications])
}
