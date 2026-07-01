import { differenceInCalendarDays, parseISO, startOfWeek, format } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { Application, ApplicationEvent, ApplicationStatus, SubmissionMethod } from '@/types'

const FUNNEL_STAGES: ApplicationStatus[] = [
  'Отправлено',
  'На рассмотрении',
  'HR / Скриннинг',
  'Техническое интервью',
  'Финальное интервью',
  'Оффер',
  'Принято',
]

export interface FunnelStageDatum {
  stage: ApplicationStatus
  count: number
  percentOfTotal: number
}

export function computeFunnel(applications: Application[], events: ApplicationEvent[]): FunnelStageDatum[] {
  const rank = new Map<ApplicationStatus, number>(FUNNEL_STAGES.map((s, i) => [s, i]))
  const maxRankByApp = new Map<string, number>()

  applications.forEach(a => maxRankByApp.set(a.id, 0))

  events.forEach(e => {
    const r = rank.get(e.to_status)
    if (r === undefined) return
    const current = maxRankByApp.get(e.application_id) ?? 0
    if (r > current) maxRankByApp.set(e.application_id, r)
  })

  const total = applications.length

  return FUNNEL_STAGES.map((stage, i) => {
    const count = applications.filter(a => (maxRankByApp.get(a.id) ?? 0) >= i).length
    return {
      stage,
      count,
      percentOfTotal: total > 0 ? Math.round((count / total) * 100) : 0,
    }
  })
}

export function computeAvgDaysToFirstResponse(applications: Application[], events: ApplicationEvent[]): number | null {
  const firstResponseByApp = new Map<string, ApplicationEvent>()

  events.forEach(e => {
    if (e.from_status === null) return
    const existing = firstResponseByApp.get(e.application_id)
    if (!existing || new Date(e.created_at) < new Date(existing.created_at)) {
      firstResponseByApp.set(e.application_id, e)
    }
  })

  const diffs: number[] = []
  applications.forEach(a => {
    const ev = firstResponseByApp.get(a.id)
    if (!ev) return
    try {
      const days = differenceInCalendarDays(parseISO(ev.created_at), parseISO(a.date_applied))
      if (days >= 0) diffs.push(days)
    } catch {
      // skip invalid dates
    }
  })

  if (diffs.length === 0) return null
  return Math.round(diffs.reduce((sum, d) => sum + d, 0) / diffs.length)
}

export interface WeeklyTrendDatum {
  label: string
  value: number
  weekStart: Date
}

export function computeWeeklyTrend(applications: Application[], weeks = 10): WeeklyTrendDatum[] {
  const now = new Date()
  const buckets: WeeklyTrendDatum[] = []

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = startOfWeek(new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000), { weekStartsOn: 1 })
    buckets.push({
      label: format(weekStart, 'd MMM', { locale: ru }),
      value: 0,
      weekStart,
    })
  }

  applications.forEach(a => {
    try {
      const appliedWeekStart = startOfWeek(parseISO(a.date_applied), { weekStartsOn: 1 }).getTime()
      const bucket = buckets.find(b => b.weekStart.getTime() === appliedWeekStart)
      if (bucket) bucket.value += 1
    } catch {
      // skip invalid dates
    }
  })

  return buckets
}

export function computeMethodBreakdown(applications: Application[]): { label: string; value: number }[] {
  const counts = new Map<SubmissionMethod, number>()
  applications.forEach(a => counts.set(a.submission_method, (counts.get(a.submission_method) ?? 0) + 1))
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}

export function computeStatusDistribution(applications: Application[]): { label: string; value: number; color: string }[] {
  const order: ApplicationStatus[] = [
    'Отправлено', 'На рассмотрении', 'HR / Скриннинг', 'Техническое интервью',
    'Финальное интервью', 'Оффер', 'Принято', 'Отклонено', 'Нет ответа',
  ]
  const counts = new Map<ApplicationStatus, number>()
  applications.forEach(a => counts.set(a.status, (counts.get(a.status) ?? 0) + 1))

  const colorMap: Record<ApplicationStatus, string> = {
    'Отправлено': '#9ca3af',
    'На рассмотрении': '#0ea5e9',
    'HR / Скриннинг': '#3b82f6',
    'Техническое интервью': '#f59e0b',
    'Финальное интервью': '#fb923c',
    'Оффер': '#10b981',
    'Принято': '#a855f7',
    'Отклонено': '#ef4444',
    'Нет ответа': '#d1d5db',
  }

  return order
    .map(status => ({ label: status, value: counts.get(status) ?? 0, color: colorMap[status] }))
    .filter(d => d.value > 0)
}

export function computeTopCompaniesByVolume(applications: Application[], limit = 5): { label: string; value: number }[] {
  const counts = new Map<string, number>()
  applications.forEach(a => counts.set(a.company, (counts.get(a.company) ?? 0) + 1))
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
}
