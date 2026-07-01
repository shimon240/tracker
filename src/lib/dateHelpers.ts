import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

export function formatDate(dateStr: string | null, pattern = 'd MMMM yyyy'): string {
  if (!dateStr) return ''
  try {
    return format(parseISO(dateStr), pattern, { locale: ru })
  } catch {
    return dateStr
  }
}

export function formatDateShort(dateStr: string | null): string {
  return formatDate(dateStr, 'd MMM')
}

export function formatDateTime(dateStr: string | null): string {
  return formatDate(dateStr, 'd MMM yyyy, HH:mm')
}

export type DueStatus = 'overdue' | 'today' | 'soon' | 'later' | 'none'

const TERMINAL_STATUSES = new Set(['Отклонено', 'Нет ответа', 'Принято'])

export function getDueStatus(nextStepDate: string | null, status: string): DueStatus {
  if (!nextStepDate || TERMINAL_STATUSES.has(status)) return 'none'
  try {
    const days = differenceInCalendarDays(parseISO(nextStepDate), new Date())
    if (days < 0) return 'overdue'
    if (days === 0) return 'today'
    if (days <= 3) return 'soon'
    return 'later'
  } catch {
    return 'none'
  }
}

export function daysSince(dateStr: string): number {
  try {
    return Math.max(0, differenceInCalendarDays(new Date(), parseISO(dateStr)))
  } catch {
    return 0
  }
}

export function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 19) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}
