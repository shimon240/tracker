import { useState } from 'react'
import type { ApplicationStatus } from '@/types'
import { STATUSES } from '@/hooks/useApplications'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Archive, ArchiveRestore, Trash2, X, ListChecks } from 'lucide-react'

interface BulkActionsBarProps {
  selectedCount: number
  onClear: () => void
  onArchive: () => void
  onUnarchive: () => void
  onDelete: () => void
  onStatusChange: (status: ApplicationStatus) => void
  showUnarchive: boolean
}

export function BulkActionsBar({
  selectedCount,
  onClear,
  onArchive,
  onUnarchive,
  onDelete,
  onStatusChange,
  showUnarchive,
}: BulkActionsBarProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (selectedCount === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-2.5">
      <span className="text-sm font-medium text-accent-bright">
        Выбрано: {selectedCount}
      </span>

      <div className="flex items-center gap-1.5 ml-2">
        <ListChecks className="h-3.5 w-3.5 text-accent" />
        <Select onValueChange={v => onStatusChange(v as ApplicationStatus)}>
          <SelectTrigger className="h-8 w-44 text-xs">
            <SelectValue placeholder="Изменить статус..." />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showUnarchive ? (
        <Button variant="outline" size="sm" onClick={onUnarchive} className="h-8 gap-1.5">
          <ArchiveRestore className="h-3.5 w-3.5" />
          Из архива
        </Button>
      ) : (
        <Button variant="outline" size="sm" onClick={onArchive} className="h-8 gap-1.5">
          <Archive className="h-3.5 w-3.5" />
          В архив
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => setConfirmDelete(true)}
        className="h-8 gap-1.5 text-red-300 border-red-500/30 hover:bg-red-500/10 hover:text-red-200"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Удалить
      </Button>

      <Button variant="ghost" size="sm" onClick={onClear} className="h-8 gap-1.5 ml-auto text-accent-bright">
        <X className="h-3.5 w-3.5" />
        Снять выделение
      </Button>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить {selectedCount} откликов?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие невозможно отменить. Выбранные отклики будут удалены безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => { onDelete(); setConfirmDelete(false) }}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
