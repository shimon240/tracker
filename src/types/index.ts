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

export interface Application {
  id: string
  user_id: string
  company: string
  position: string
  date_applied: string
  submission_method: SubmissionMethod
  status: ApplicationStatus
  next_step: string
  short_note: string
  job_description: string
  archived: boolean
  created_at: string
  updated_at: string
}

export type SortField = 'date_applied' | 'company' | 'position' | 'status' | 'created_at'
export type SortDirection = 'asc' | 'desc'

export interface FilterState {
  search: string
  status: ApplicationStatus | 'all'
  method: SubmissionMethod | 'all'
  showArchived: boolean
}
