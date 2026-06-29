import type { Application, ApplicationStatus } from '@/types'
import { STATUSES } from '@/hooks/useApplications'
import { STATUS_CONFIG } from '@/lib/statusConfig'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
  Building2,
  Calendar,
  Send,
  ArrowRight,
  StickyNote,
  FileText,
  Pencil,
  Trash2,
  Archive,
  ArchiveRestore,
  Clock,
} from 'lucide-react'

interface ApplicationDetailProps {
  application: Application | null
  open: boolean
  onClose: () => void
  onEdit: (app: Application) => void
  onDelete: (id: string) => void
  onArchive: (id: string) => void
  onUnarchive: (id: string) => void
  onStatusChange: (id: string, status: ApplicationStatus) => void
}

function formatDate(dateStr: string) {
  try {
    return format(parseISO(dateStr), 'd MMMM yyyy', { locale: ru })
  } catch {
    return dateStr
  }
}

function formatDateTime(dateStr: string) {
  try {
    return format(parseISO(dateStr), 'd MMM yyyy, HH:mm', { locale: ru })
  } catch {
    return dateStr
  }
}

export function ApplicationDetail({
  application,
  open,
  onClose,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  onStatusChange,
}: ApplicationDetailProps) {
  if (!application) return null

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pr-6">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-xl font-bold text-gray-900 leading-tight">
                {application.position}
              </DialogTitle>
              <div className="mt-1 flex items-center gap-2 text-gray-600">
                <Building2 className="h-4 w-4 shrink-0" />
                <span className="font-medium">{application.company}</span>
              </div>
            </div>
            {application.archived && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 shrink-0">
                Архив
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {/* Meta info row */}
          <div className="flex flex-wrap gap-4 rounded-lg bg-gray-50 p-3 text-sm">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Дата отклика:</span>
              <span className="font-medium text-gray-900">{formatDate(application.date_applied)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <Send className="h-4 w-4 text-gray-400" />
              <span>Способ:</span>
              <span className="font-medium text-gray-900">{application.submission_method}</span>
            </div>
          </div>

          {/* Status changer */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Статус</p>
            <div className="flex items-center gap-3">
              <StatusBadge status={application.status} />
              <ArrowRight className="h-4 w-4 text-gray-300" />
              <Select
                value={application.status}
                onValueChange={v => onStatusChange(application.id, v as ApplicationStatus)}
              >
                <SelectTrigger className="w-52">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map(s => {
                    const cfg = STATUS_CONFIG[s]
                    return (
                      <SelectItem key={s} value={s}>
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${cfg.dotColor}`} />
                          {s}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Next step */}
          {application.next_step && (
            <div className="space-y-1.5">
              <p className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <ArrowRight className="h-4 w-4 text-blue-500" />
                Следующий шаг
              </p>
              <p className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-900">
                {application.next_step}
              </p>
            </div>
          )}

          {/* Short note */}
          {application.short_note && (
            <div className="space-y-1.5">
              <p className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <StickyNote className="h-4 w-4 text-amber-500" />
                Заметка
              </p>
              <p className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-900 whitespace-pre-wrap">
                {application.short_note}
              </p>
            </div>
          )}

          {/* Job description */}
          {application.job_description && (
            <div className="space-y-1.5">
              <p className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4 text-gray-500" />
                Описание вакансии
              </p>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto scrollbar-thin">
                {application.job_description}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex items-center gap-1 text-xs text-gray-400 pt-1">
            <Clock className="h-3 w-3" />
            <span>Создано: {formatDateTime(application.created_at)}</span>
            <span className="mx-1">·</span>
            <span>Обновлено: {formatDateTime(application.updated_at)}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { onEdit(application); onClose() }}
              className="gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" />
              Редактировать
            </Button>

            {application.archived ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { onUnarchive(application.id); onClose() }}
                className="gap-1.5"
              >
                <ArchiveRestore className="h-3.5 w-3.5" />
                Из архива
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { onArchive(application.id); onClose() }}
                className="gap-1.5 text-gray-600"
              >
                <Archive className="h-3.5 w-3.5" />
                В архив
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 text-red-600 hover:text-red-700 hover:border-red-200 hover:bg-red-50 ml-auto">
                  <Trash2 className="h-3.5 w-3.5" />
                  Удалить
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить отклик?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Отклик на вакансию <strong>{application.position}</strong> в компании{' '}
                    <strong>{application.company}</strong> будет удалён безвозвратно.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => { onDelete(application.id); onClose() }}
                  >
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

