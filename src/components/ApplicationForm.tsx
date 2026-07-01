import { useState, useEffect } from 'react'
import type { Application, ApplicationStatus, Priority, SalaryCurrency, SubmissionMethod } from '@/types'
import { PRIORITIES, STATUSES, SUBMISSION_METHODS, useAllTags } from '@/hooks/useApplications'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TagsInput } from '@/components/TagsInput'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Building2,
  Briefcase,
  Calendar,
  Send,
  ListChecks,
  StickyNote,
  FileText,
  Loader2,
  MapPin,
  Link as LinkIcon,
  User,
  Mail,
  Wallet,
  Tag,
  Flag,
  Bell,
} from 'lucide-react'

interface ApplicationFormProps {
  open: boolean
  onClose: () => void
  onSave: (data: Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  editData?: Application | null
  allApplications: Application[]
}

type FormData = Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at'>

const DEFAULT_FORM: FormData = {
  company: '',
  position: '',
  date_applied: new Date().toISOString().split('T')[0],
  submission_method: 'hh.ru',
  status: 'Отправлено',
  next_step: '',
  next_step_date: null,
  short_note: '',
  job_description: '',
  archived: false,
  priority: 'Средний',
  tags: [],
  location: '',
  company_url: '',
  contact_name: '',
  contact_email: '',
  salary_min: null,
  salary_max: null,
  salary_currency: 'RUB',
}

export function ApplicationForm({ open, onClose, onSave, editData, allApplications }: ApplicationFormProps) {
  const [form, setForm] = useState<FormData>(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const allTags = useAllTags(allApplications)

  useEffect(() => {
    if (open) {
      if (editData) {
        const { id: _id, user_id: _uid, created_at: _c, updated_at: _u, ...rest } = editData
        setForm(rest)
      } else {
        setForm({ ...DEFAULT_FORM, date_applied: new Date().toISOString().split('T')[0] })
      }
      setErrors({})
    }
  }, [open, editData])

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!form.company.trim()) errs.company = 'Укажите название компании'
    if (!form.position.trim()) errs.position = 'Укажите название вакансии'
    if (!form.date_applied) errs.date_applied = 'Укажите дату отклика'
    if (form.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)) {
      errs.contact_email = 'Некорректный email'
    }
    if (form.salary_min && form.salary_max && form.salary_min > form.salary_max) {
      errs.salary_max = 'Максимум должен быть больше минимума'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function setNumberOrNull(key: 'salary_min' | 'salary_max', raw: string) {
    set(key, raw === '' ? null : Number(raw))
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Briefcase className="h-5 w-5 text-accent" />
            {editData ? 'Редактировать отклик' : 'Новый отклик'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Section: Basics */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="company" className="flex items-center gap-1.5 text-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  Компания <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company"
                  placeholder="Яндекс, Сбер, VK..."
                  value={form.company}
                  onChange={e => set('company', e.target.value)}
                  className={errors.company ? 'border-red-400 focus-visible:ring-red-400' : ''}
                />
                {errors.company && <p className="text-xs text-red-500">{errors.company}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="position" className="flex items-center gap-1.5 text-foreground">
                  <Briefcase className="h-3.5 w-3.5" />
                  Вакансия <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="position"
                  placeholder="Senior Frontend Developer..."
                  value={form.position}
                  onChange={e => set('position', e.target.value)}
                  className={errors.position ? 'border-red-400 focus-visible:ring-red-400' : ''}
                />
                {errors.position && <p className="text-xs text-red-500">{errors.position}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="date" className="flex items-center gap-1.5 text-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Дата отклика <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date_applied}
                  onChange={e => set('date_applied', e.target.value)}
                  className={errors.date_applied ? 'border-red-400' : ''}
                />
                {errors.date_applied && <p className="text-xs text-red-500">{errors.date_applied}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-foreground">
                  <Send className="h-3.5 w-3.5" />
                  Способ отклика
                </Label>
                <Select
                  value={form.submission_method}
                  onValueChange={v => set('submission_method', v as SubmissionMethod)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBMISSION_METHODS.map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-foreground">
                  <Flag className="h-3.5 w-3.5" />
                  Приоритет
                </Label>
                <Select
                  value={form.priority}
                  onValueChange={v => set('priority', v as Priority)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-foreground">
                <ListChecks className="h-3.5 w-3.5" />
                Статус
              </Label>
              <Select
                value={form.status}
                onValueChange={v => set('status', v as ApplicationStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Section: Next step & reminder */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr]">
              <div className="space-y-1.5">
                <Label htmlFor="next_step" className="flex items-center gap-1.5 text-foreground">
                  <ListChecks className="h-3.5 w-3.5" />
                  Следующий шаг
                </Label>
                <Input
                  id="next_step"
                  placeholder="Техническое интервью в пятницу в 15:00..."
                  value={form.next_step}
                  onChange={e => set('next_step', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="next_step_date" className="flex items-center gap-1.5 text-foreground">
                  <Bell className="h-3.5 w-3.5" />
                  Напоминание
                </Label>
                <Input
                  id="next_step_date"
                  type="date"
                  value={form.next_step_date ?? ''}
                  onChange={e => set('next_step_date', e.target.value || null)}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Section: Company details */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted font-mono tracking-widest">О компании и контактах</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="location" className="flex items-center gap-1.5 text-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  Локация
                </Label>
                <Input
                  id="location"
                  placeholder="Москва, Удалённо..."
                  value={form.location}
                  onChange={e => set('location', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="company_url" className="flex items-center gap-1.5 text-foreground">
                  <LinkIcon className="h-3.5 w-3.5" />
                  Сайт компании / ссылка на вакансию
                </Label>
                <Input
                  id="company_url"
                  placeholder="https://..."
                  value={form.company_url}
                  onChange={e => set('company_url', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact_name" className="flex items-center gap-1.5 text-foreground">
                  <User className="h-3.5 w-3.5" />
                  Контактное лицо
                </Label>
                <Input
                  id="contact_name"
                  placeholder="Имя рекрутера..."
                  value={form.contact_name}
                  onChange={e => set('contact_name', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact_email" className="flex items-center gap-1.5 text-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  Email контакта
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  placeholder="recruiter@company.com"
                  value={form.contact_email}
                  onChange={e => set('contact_email', e.target.value)}
                  className={errors.contact_email ? 'border-red-400' : ''}
                />
                {errors.contact_email && <p className="text-xs text-red-500">{errors.contact_email}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-foreground">
                <Wallet className="h-3.5 w-3.5" />
                Зарплатная вилка
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  type="number"
                  placeholder="От"
                  value={form.salary_min ?? ''}
                  onChange={e => setNumberOrNull('salary_min', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="До"
                  value={form.salary_max ?? ''}
                  onChange={e => setNumberOrNull('salary_max', e.target.value)}
                  className={errors.salary_max ? 'border-red-400' : ''}
                />
                <Select
                  value={form.salary_currency}
                  onValueChange={v => set('salary_currency', v as SalaryCurrency)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RUB">₽ RUB</SelectItem>
                    <SelectItem value="USD">$ USD</SelectItem>
                    <SelectItem value="EUR">€ EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.salary_max && <p className="text-xs text-red-500">{errors.salary_max}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-foreground">
                <Tag className="h-3.5 w-3.5" />
                Теги
              </Label>
              <TagsInput
                tags={form.tags}
                onChange={tags => set('tags', tags)}
                suggestions={allTags}
                placeholder="Удалёнка, Финтех, Мечта..."
              />
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Section: Notes */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="note" className="flex items-center gap-1.5 text-foreground">
                <StickyNote className="h-3.5 w-3.5" />
                Короткая заметка
              </Label>
              <Textarea
                id="note"
                placeholder="Стек: React, TypeScript. Контакт: Иван Иванов..."
                value={form.short_note}
                onChange={e => set('short_note', e.target.value)}
                className="resize-none"
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="jd" className="flex items-center gap-1.5 text-foreground">
                <FileText className="h-3.5 w-3.5" />
                Описание вакансии
              </Label>
              <Textarea
                id="jd"
                placeholder="Вставьте полное описание вакансии..."
                value={form.job_description}
                onChange={e => set('job_description', e.target.value)}
                className="resize-y min-h-[120px]"
                rows={6}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2 border-t border-border">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={saving} className="min-w-[100px]">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : editData ? (
              'Сохранить'
            ) : (
              'Добавить'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
