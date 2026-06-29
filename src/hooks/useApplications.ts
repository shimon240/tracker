import { useState, useCallback, useMemo, useEffect } from 'react'
import type { Application, ApplicationStatus, FilterState, SortDirection, SortField, SubmissionMethod } from '@/types'
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

const SAMPLE_DATA: Omit<Application, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    company: 'Яндекс',
    position: 'Senior Frontend Developer',
    date_applied: '2026-06-20',
    submission_method: 'hh.ru',
    status: 'Техническое интервью',
    next_step: 'Техническое интервью в пятницу в 15:00',
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
  },
  {
    company: 'Сбер',
    position: 'Lead Frontend Engineer',
    date_applied: '2026-06-18',
    submission_method: 'LinkedIn',
    status: 'HR / Скриннинг',
    next_step: 'Ждём обратной связи от HR после скрининга',
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
  },
  {
    company: 'Авито',
    position: 'Frontend Developer',
    date_applied: '2026-06-15',
    submission_method: 'Сайт компании',
    status: 'Отклонено',
    next_step: '',
    short_note: 'Отказали после технического интервью. Не хватило опыта с WebSockets.',
    job_description: `Frontend Developer — Авито

Команда: Чат и мессенджер
Формат: Гибридный (Москва)

Требования:
- 3+ года frontend-опыта
- React, Redux/MobX
- Опыт с WebSockets`,
    archived: false,
  },
  {
    company: 'VK',
    position: 'Middle Frontend Developer',
    date_applied: '2026-06-25',
    submission_method: 'Рекрутер',
    status: 'Отправлено',
    next_step: 'Ждём ответа (рекрутер написала напомнить через неделю)',
    short_note: 'Контакт: Анна Соколова. Позиция в команде VK Mini Apps.',
    job_description: `Middle Frontend Developer — VK Mini Apps

Команда: VK Mini Apps Platform
Формат: Офис / Удалёнка (на выбор)

Требования:
- 2–4 года в frontend-разработке
- React или Vue.js
- TypeScript — обязательно`,
    archived: false,
  },
  {
    company: 'Tinkoff',
    position: 'Senior React Developer',
    date_applied: '2026-06-10',
    submission_method: 'hh.ru',
    status: 'Оффер',
    next_step: 'Рассмотреть оффер до 5 июля. Зарплата: 420 000 ₽',
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
  },
]

export interface UseApplicationsResult {
  applications: Application[]
  loading: boolean
  error: string | null
  addApplication: (data: Omit<Application, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateApplication: (id: string, data: Partial<Application>) => Promise<void>
  deleteApplication: (id: string) => Promise<void>
  archiveApplication: (id: string) => Promise<void>
  unarchiveApplication: (id: string) => Promise<void>
  updateStatus: (id: string, status: ApplicationStatus) => Promise<void>
  stats: {
    total: number
    sent: number
    inProgress: number
    offers: number
    accepted: number
    rejected: number
    noResponse: number
    archived: number
  }
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
        // Seed sample data on first load
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

  // Subscribe to realtime changes
  useEffect(() => {
    const channel = supabase
      .channel('applications_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'applications' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setApplications(prev => [payload.new as Application, ...prev])
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

  const addApplication = useCallback(async (
    data: Omit<Application, 'id' | 'created_at' | 'updated_at'>
  ) => {
    const { data: inserted, error: err } = await supabase
      .from('applications')
      .insert([data])
      .select()
      .single()
    if (err) throw err
    // Realtime will update, but also update optimistically
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

  const stats = useMemo(() => {
    const active = applications.filter(a => !a.archived)
    return {
      total: active.length,
      sent: active.filter(a => a.status === 'Отправлено').length,
      inProgress: active.filter(a =>
        ['На рассмотрении', 'HR / Скриннинг', 'Техническое интервью', 'Финальное интервью'].includes(a.status)
      ).length,
      offers: active.filter(a => a.status === 'Оффер').length,
      accepted: active.filter(a => a.status === 'Принято').length,
      rejected: active.filter(a => a.status === 'Отклонено').length,
      noResponse: active.filter(a => a.status === 'Нет ответа').length,
      archived: applications.filter(a => a.archived).length,
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
        const searchable = [app.company, app.position, app.short_note, app.next_step]
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
