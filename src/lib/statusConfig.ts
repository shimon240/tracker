import type { ApplicationStatus, Priority, SubmissionMethod } from '@/types'

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' | 'purple'

interface StatusConfig {
  label: string
  variant: BadgeVariant
  color: string
  bgColor: string
  dotColor: string
}

export const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  'Отправлено': {
    label: 'Отправлено',
    variant: 'secondary',
    color: 'text-foreground-muted',
    bgColor: 'bg-white/5 border border-white/10',
    dotColor: 'bg-foreground-muted',
  },
  'На рассмотрении': {
    label: 'На рассмотрении',
    variant: 'info',
    color: 'text-sky-300',
    bgColor: 'bg-sky-500/15 border border-sky-500/25',
    dotColor: 'bg-sky-400',
  },
  'HR / Скриннинг': {
    label: 'HR / Скрининг',
    variant: 'info',
    color: 'text-blue-300',
    bgColor: 'bg-blue-500/15 border border-blue-500/25',
    dotColor: 'bg-blue-400',
  },
  'Техническое интервью': {
    label: 'Тех. интервью',
    variant: 'warning',
    color: 'text-amber-300',
    bgColor: 'bg-amber-500/15 border border-amber-500/25',
    dotColor: 'bg-amber-400',
  },
  'Финальное интервью': {
    label: 'Финальное инт.',
    variant: 'warning',
    color: 'text-orange-300',
    bgColor: 'bg-orange-500/15 border border-orange-500/25',
    dotColor: 'bg-orange-400',
  },
  'Оффер': {
    label: 'Оффер',
    variant: 'success',
    color: 'text-emerald-300',
    bgColor: 'bg-emerald-500/15 border border-emerald-500/25',
    dotColor: 'bg-emerald-400',
  },
  'Отклонено': {
    label: 'Отклонено',
    variant: 'destructive',
    color: 'text-red-300',
    bgColor: 'bg-red-500/15 border border-red-500/25',
    dotColor: 'bg-red-400',
  },
  'Нет ответа': {
    label: 'Нет ответа',
    variant: 'secondary',
    color: 'text-foreground-subtle',
    bgColor: 'bg-white/5 border border-white/8',
    dotColor: 'bg-white/30',
  },
  'Принято': {
    label: 'Принято',
    variant: 'purple',
    color: 'text-purple-300',
    bgColor: 'bg-purple-500/15 border border-purple-500/25',
    dotColor: 'bg-purple-400',
  },
}

export const METHOD_CONFIG: Record<SubmissionMethod, { icon: string; color: string }> = {
  'LinkedIn': { icon: 'in', color: 'text-blue-400' },
  'Сайт компании': { icon: 'www', color: 'text-foreground-muted' },
  'Email': { icon: '@', color: 'text-foreground-muted' },
  'Рекрутер': { icon: '👤', color: 'text-purple-400' },
  'hh.ru': { icon: 'hh', color: 'text-red-400' },
  'Реферал': { icon: '🤝', color: 'text-emerald-400' },
  'Другое': { icon: '•', color: 'text-foreground-muted' },
}

interface PriorityConfig {
  label: string
  color: string
  bgColor: string
  borderColor: string
}

export const PRIORITY_CONFIG: Record<Priority, PriorityConfig> = {
  'Низкий': {
    label: 'Низкий',
    color: 'text-foreground-muted',
    bgColor: 'bg-white/5',
    borderColor: 'border-white/10',
  },
  'Средний': {
    label: 'Средний',
    color: 'text-accent-bright',
    bgColor: 'bg-accent/15',
    borderColor: 'border-accent/30',
  },
  'Высокий': {
    label: 'Высокий',
    color: 'text-orange-300',
    bgColor: 'bg-orange-500/15',
    borderColor: 'border-orange-500/30',
  },
  'Мечта': {
    label: 'Мечта',
    color: 'text-pink-300',
    bgColor: 'bg-pink-500/15',
    borderColor: 'border-pink-500/30',
  },
}
