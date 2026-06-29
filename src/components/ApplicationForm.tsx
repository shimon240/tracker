import { useState, useEffect } from 'react'
import type { Application, ApplicationStatus, SubmissionMethod } from '@/types'
import { STATUSES, SUBMISSION_METHODS } from '@/hooks/useApplications'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Building2, Briefcase, Calendar, Send, ListChecks, StickyNote, FileText, Loader2 } from 'lucide-react'

interface ApplicationFormProps {
  open: boolean
  onClose: () => void
  onSave: (data: Omit<Application, 'id' | 'created_at' | 'updated_at'>) => void
  editData?: Application | null
}

const DEFAULT_FORM: Omit<Application, 'id' | 'created_at' | 'updated_at'> = {
  company: '',
  position: '',
  date_applied: new Date().toISOString().split('T')[0],
  submission_method: 'hh.ru',
  status: 'Отправлено',
  next_step: '',
  short_note: '',
  job_description: '',
  archived: false,
}

export function ApplicationForm({ open, onClose, onSave, editData }: ApplicationFormProps) {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      if (editData) {
        const { id: _id, created_at: _c, updated_at: _u, ...rest } = editData
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
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      onSave(form)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <Briefcase className="h-5 w-5 text-blue-600" />
            {editData ? 'Редактировать отклик' : 'Новый отклик'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Company + Position */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="company" className="flex items-center gap-1.5 text-gray-700">
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
              <Label htmlFor="position" className="flex items-center gap-1.5 text-gray-700">
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

          {/* Date + Method */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="date" className="flex items-center gap-1.5 text-gray-700">
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
              <Label className="flex items-center gap-1.5 text-gray-700">
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
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-gray-700">
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

          {/* Next Step */}
          <div className="space-y-1.5">
            <Label htmlFor="next_step" className="flex items-center gap-1.5 text-gray-700">
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

          {/* Short Note */}
          <div className="space-y-1.5">
            <Label htmlFor="note" className="flex items-center gap-1.5 text-gray-700">
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

          {/* Job Description */}
          <div className="space-y-1.5">
            <Label htmlFor="jd" className="flex items-center gap-1.5 text-gray-700">
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

        <DialogFooter className="gap-2 pt-2">
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
