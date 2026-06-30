import type { Application, ApplicationStatus, SortDirection, SortField } from '@/types'
import { StatusBadge } from '@/components/StatusBadge'
import { PriorityBadge } from '@/components/PriorityBadge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { formatDateShort, getDueStatus } from '@/lib/dateHelpers'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  MoreHorizontal,
  Eye,
  Pencil,
  Archive,
  ArchiveRestore,
  Trash2,
  ClipboardList,
  Bell,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface ApplicationTableProps {
  applications: Application[]
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
  onView: (app: Application) => void
  onEdit: (app: Application) => void
  onDelete: (id: string) => void
  onArchive: (id: string) => void
  onUnarchive: (id: string) => void
  onStatusChange: (id: string, status: ApplicationStatus) => void
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
}

interface Column {
  key: SortField | 'actions' | 'method' | 'select' | 'priority'
  label: string
  sortable: boolean
  className?: string
}

const COLUMNS: Column[] = [
  { key: 'select', label: '', sortable: false, className: 'w-10' },
  { key: 'company', label: 'Компания / Вакансия', sortable: true, className: 'min-w-[220px]' },
  { key: 'priority', label: 'Приоритет', sortable: true, className: 'w-28 hidden sm:table-cell' },
  { key: 'date_applied', label: 'Дата', sortable: true, className: 'w-28' },
  { key: 'method', label: 'Способ', sortable: false, className: 'w-32 hidden md:table-cell' },
  { key: 'status', label: 'Статус', sortable: true, className: 'w-44' },
  { key: 'actions', label: '', sortable: false, className: 'w-10' },
]

function SortIcon({ field, sortField, sortDirection }: { field: SortField; sortField: SortField; sortDirection: SortDirection }) {
  if (field !== sortField) return <ChevronsUpDown className="h-3.5 w-3.5 text-gray-300" />
  if (sortDirection === 'asc') return <ChevronUp className="h-3.5 w-3.5 text-blue-500" />
  return <ChevronDown className="h-3.5 w-3.5 text-blue-500" />
}

export function ApplicationTable({
  applications,
  sortField,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: ApplicationTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null)

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
        <ClipboardList className="h-12 w-12 text-gray-300 mb-3" />
        <p className="text-base font-medium text-gray-500">Откликов не найдено</p>
        <p className="mt-1 text-sm text-gray-400">Добавьте первый отклик или измените фильтры</p>
      </div>
    )
  }

  const allSelected = applications.length > 0 && applications.every(a => selectedIds.has(a.id))

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {COLUMNS.map(col => (
                  <th
                    key={col.key}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide',
                      col.className,
                      col.sortable && 'cursor-pointer select-none hover:text-gray-700'
                    )}
                    onClick={() => col.sortable && onSort(col.key as SortField)}
                  >
                    {col.key === 'select' ? (
                      <Checkbox checked={allSelected} onCheckedChange={onToggleSelectAll} />
                    ) : (
                      <div className="flex items-center gap-1">
                        {col.label}
                        {col.sortable && (
                          <SortIcon field={col.key as SortField} sortField={sortField} sortDirection={sortDirection} />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applications.map(app => (
                <ApplicationRow
                  key={app.id}
                  app={app}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={setDeleteTarget}
                  onArchive={onArchive}
                  onUnarchive={onUnarchive}
                  selected={selectedIds.has(app.id)}
                  onToggleSelect={() => onToggleSelect(app.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить отклик?</AlertDialogTitle>
            <AlertDialogDescription>
              Отклик на <strong>{deleteTarget?.position}</strong> в{' '}
              <strong>{deleteTarget?.company}</strong> будет удалён безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (deleteTarget) { onDelete(deleteTarget.id); setDeleteTarget(null) }
              }}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

interface ApplicationRowProps {
  app: Application
  onView: (app: Application) => void
  onEdit: (app: Application) => void
  onDelete: (app: Application) => void
  onArchive: (id: string) => void
  onUnarchive: (id: string) => void
  selected: boolean
  onToggleSelect: () => void
}

function ApplicationRow({ app, onView, onEdit, onDelete, onArchive, onUnarchive, selected, onToggleSelect }: ApplicationRowProps) {
  const dateFormatted = formatDateShort(app.date_applied)
  const dueStatus = getDueStatus(app.next_step_date, app.status)

  return (
    <tr
      className={cn(
        'group hover:bg-blue-50/30 transition-colors cursor-pointer',
        app.archived && 'opacity-60',
        selected && 'bg-blue-50/50'
      )}
      onClick={() => onView(app)}
    >
      {/* Select */}
      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
        <Checkbox checked={selected} onCheckedChange={onToggleSelect} />
      </td>

      {/* Company / Position */}
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors leading-tight">
          {app.company}
        </div>
        <div className="text-gray-500 text-xs mt-0.5 line-clamp-1">{app.position}</div>
        {app.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {app.tags.slice(0, 3).map(tag => (
              <span key={tag} className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                {tag}
              </span>
            ))}
          </div>
        )}
      </td>

      {/* Priority */}
      <td className="px-4 py-3 hidden sm:table-cell">
        <PriorityBadge priority={app.priority} />
      </td>

      {/* Date */}
      <td className="px-4 py-3">
        <div className="text-gray-800 font-medium tabular-nums">{dateFormatted}</div>
        {dueStatus !== 'none' && (
          <div
            className={cn(
              'inline-flex items-center gap-0.5 mt-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium',
              dueStatus === 'overdue' && 'bg-red-100 text-red-700',
              dueStatus === 'today' && 'bg-orange-100 text-orange-700',
              dueStatus === 'soon' && 'bg-amber-100 text-amber-700',
              dueStatus === 'later' && 'bg-gray-100 text-gray-500'
            )}
          >
            {dueStatus === 'overdue' ? <AlertTriangle className="h-2.5 w-2.5" /> : <Bell className="h-2.5 w-2.5" />}
            {formatDateShort(app.next_step_date)}
          </div>
        )}
      </td>

      {/* Method */}
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="text-xs text-gray-600 bg-gray-100 rounded-full px-2 py-0.5">
          {app.submission_method}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={app.status} />
        {app.next_step && (
          <div className="text-xs text-gray-400 mt-1 line-clamp-1">{app.next_step}</div>
        )}
      </td>

      {/* Actions */}
      <td className="px-2 py-3" onClick={e => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onView(app)}>
              <Eye className="h-4 w-4" />
              Просмотр
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(app)}>
              <Pencil className="h-4 w-4" />
              Редактировать
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {app.archived ? (
              <DropdownMenuItem onClick={() => onUnarchive(app.id)}>
                <ArchiveRestore className="h-4 w-4" />
                Из архива
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onArchive(app.id)}>
                <Archive className="h-4 w-4" />
                В архив
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(app)}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}
