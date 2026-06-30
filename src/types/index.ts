export type SubmissionMethod =
  | 'LinkedIn'
  | 'Сайт компании'
  | 'Email'
  | 'Рекрутер'
  | 'hh.ru'
  | 'Реферал'
  | 'Другое'

export type ApplicationStatus =
  | 'Отправлено'
  | 'На рассмотрении'
  | 'HR / Скриннинг'
  | 'Техническое интервью'
  | 'Финальное интервью'
  | 'Оффер'
  | 'Отклонено'
  | 'Нет ответа'
  | 'Принято'

export type Priority = 'Низкий' | 'Средний' | 'Высокий' | 'Мечта'

export type SalaryCurrency = 'RUB' | 'USD' | 'EUR'

export interface Application {
  id: string
  user_id: string
  company: string
  position: string
  date_applied: string
  submission_method: SubmissionMethod
  status: ApplicationStatus
  next_step: string
  next_step_date: string | null
  short_note: string
  job_description: string
  archived: boolean
  priority: Priority
  tags: string[]
  location: string
  company_url: string
  contact_name: string
  contact_email: string
  salary_min: number | null
  salary_max: number | null
  salary_currency: SalaryCurrency
  created_at: string
  updated_at: string
}

export interface ApplicationEvent {
  id: string
  application_id: string
  user_id: string
  from_status: ApplicationStatus | null
  to_status: ApplicationStatus
  note: string
  created_at: string
}

export type SortField = 'date_applied' | 'company' | 'position' | 'status' | 'created_at' | 'priority' | 'next_step_date'
export type SortDirection = 'asc' | 'desc'

export interface FilterState {
  search: string
  status: ApplicationStatus | 'all'
  method: SubmissionMethod | 'all'
  priority: Priority | 'all'
  tag: string | 'all'
  showArchived: boolean
}

export type ViewMode = 'table' | 'kanban' | 'analytics'
