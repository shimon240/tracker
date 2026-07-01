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
    color: 'text-slate-700',
    bgColor: 'bg-slate-100 border border-slate-200',
    dotColor: 'bg-slate-400',
  },
  'На рассмотрении': {
    label: 'На рассмотрении',
    variant: 'info',
    color: 'text-sky-700',
    bgColor: 'bg-sky-50 border border-sky-200',
    dotColor: 'bg-sky-500',
  },
  'HR / Скриннинг': {
    label: 'HR / Скрининг',
    variant: 'info',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50 border border-indigo-200',
    dotColor: 'bg-indigo-500',
  },
  'Техническое интервью': {
    label: 'Тех. интервью',
    variant: 'warning',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border border-amber-200',
    dotColor: 'bg-amber-500',
  },
  'Финальное интервью': {
    label: 'Финальное инт.',
    variant: 'warning',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border border-orange-200',
    dotColor: 'bg-orange-500',
  },
  'Оффер': {
    label: 'Оффер',
    variant: 'success',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 border border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
  'Отклонено': {
    label: 'Отклонено',
    variant: 'destructive',
    color: 'text-red-700',
    bgColor: 'bg-red-50 border border-red-200',
    dotColor: 'bg-red-500',
  },
  'Нет ответа': {
    label: 'Нет ответа',
    variant: 'secondary',
    color: 'text-slate-500',
    bgColor: 'bg-slate-50 border border-slate-200',
    dotColor: 'bg-slate-300',
  },
  'Принято': {
    label: 'Принято',
    variant: 'purple',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50 border border-violet-200',
    dotColor: 'bg-violet-500',
  },
}

export const METHOD_CONFIG: Record<SubmissionMethod, { icon: string; color: string }> = {
  'LinkedIn': { icon: 'in', color: 'text-indigo-600' },
  'Сайт компании': { icon: 'www', color: 'text-slate-600' },
  'Email': { icon: '@', color: 'text-slate-600' },
  'Рекрутер': { icon: '👤', color: 'text-violet-600' },
  'hh.ru': { icon: 'hh', color: 'text-red-600' },
  'Реферал': { icon: '🤝', color: 'text-emerald-600' },
  'Другое': { icon: '•', color: 'text-slate-600' },
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
    color: 'text-slate-500',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
  },
  'Средний': {
    label: 'Средний',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
  'Высокий': {
    label: 'Высокий',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  'Мечта': {
    label: 'Мечта',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
  },
}
