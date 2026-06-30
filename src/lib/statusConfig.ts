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
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    dotColor: 'bg-gray-400',
  },
  'На рассмотрении': {
    label: 'На рассмотрении',
    variant: 'info',
    color: 'text-sky-700',
    bgColor: 'bg-sky-100',
    dotColor: 'bg-sky-500',
  },
  'HR / Скриннинг': {
    label: 'HR / Скрининг',
    variant: 'info',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    dotColor: 'bg-blue-500',
  },
  'Техническое интервью': {
    label: 'Тех. интервью',
    variant: 'warning',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    dotColor: 'bg-amber-500',
  },
  'Финальное интервью': {
    label: 'Финальное инт.',
    variant: 'warning',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    dotColor: 'bg-orange-500',
  },
  'Оффер': {
    label: 'Оффер',
    variant: 'success',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    dotColor: 'bg-emerald-500',
  },
  'Отклонено': {
    label: 'Отклонено',
    variant: 'destructive',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    dotColor: 'bg-red-500',
  },
  'Нет ответа': {
    label: 'Нет ответа',
    variant: 'secondary',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    dotColor: 'bg-gray-300',
  },
  'Принято': {
    label: 'Принято',
    variant: 'purple',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    dotColor: 'bg-purple-500',
  },
}

export const METHOD_CONFIG: Record<SubmissionMethod, { icon: string; color: string }> = {
  'LinkedIn': { icon: 'in', color: 'text-blue-600' },
  'Сайт компании': { icon: 'www', color: 'text-gray-600' },
  'Email': { icon: '@', color: 'text-gray-600' },
  'Рекрутер': { icon: '👤', color: 'text-purple-600' },
  'hh.ru': { icon: 'hh', color: 'text-red-600' },
  'Реферал': { icon: '🤝', color: 'text-green-600' },
  'Другое': { icon: '•', color: 'text-gray-600' },
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
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
  'Средний': {
    label: 'Средний',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
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
