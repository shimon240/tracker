import type { Application } from '@/types'
import { formatSalary } from '@/lib/format'

const HEADERS = [
  'Компания',
  'Вакансия',
  'Дата отклика',
  'Способ отклика',
  'Статус',
  'Приоритет',
  'Следующий шаг',
  'Дата след. шага',
  'Локация',
  'Зарплата',
  'Контакт',
  'Email контакта',
  'Теги',
  'Заметка',
  'Архив',
]

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function applicationToRow(app: Application): string[] {
  return [
    app.company,
    app.position,
    app.date_applied,
    app.submission_method,
    app.status,
    app.priority,
    app.next_step,
    app.next_step_date ?? '',
    app.location,
    formatSalary(app.salary_min, app.salary_max, app.salary_currency),
    app.contact_name,
    app.contact_email,
    app.tags.join('; '),
    app.short_note,
    app.archived ? 'Да' : 'Нет',
  ]
}

export function exportApplicationsToCsv(applications: Application[], filename = 'applytrack-export.csv'): void {
  const rows = [HEADERS, ...applications.map(applicationToRow)]
  const csvContent = rows
    .map(row => row.map(escapeCsvField).join(','))
    .join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
