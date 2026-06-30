import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Application } from '@/types'
import { PriorityBadge } from '@/components/PriorityBadge'
import { formatDateShort, daysSince, getDueStatus } from '@/lib/dateHelpers'
import { formatSalary } from '@/lib/format'
import { Bell, AlertTriangle, MapPin, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KanbanCardProps {
  application: Application
  onClick: () => void
  dragging?: boolean
}

export function KanbanCard({ application, onClick, dragging = false }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: application.id,
    data: { application },
  })

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  const dueStatus = getDueStatus(application.next_step_date, application.status)
  const salary = formatSalary(application.salary_min, application.salary_max, application.salary_currency)
  const days = daysSince(application.date_applied)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => !isDragging && onClick()}
      className={cn(
        'group rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md hover:border-blue-200 cursor-grab active:cursor-grabbing select-none',
        (isDragging || dragging) && 'opacity-50 ring-2 ring-blue-400'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 truncate">{application.company}</p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{application.position}</p>
        </div>
        {application.priority !== 'Средний' && (
          <PriorityBadge priority={application.priority} showLabel={false} className="shrink-0 !p-1" />
        )}
      </div>

      {application.location && (
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{application.location}</span>
        </div>
      )}

      {salary && (
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
          <Wallet className="h-3 w-3" />
          <span className="truncate">{salary}</span>
        </div>
      )}

      {application.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {application.tags.slice(0, 2).map(tag => (
            <span key={tag} className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
              {tag}
            </span>
          ))}
          {application.tags.length > 2 && (
            <span className="rounded-full bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
              +{application.tags.length - 2}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-50">
        <span className="text-[11px] text-gray-400">
          {days === 0 ? 'Сегодня' : `${days} дн. назад`}
        </span>
        {dueStatus !== 'none' && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium',
              dueStatus === 'overdue' && 'bg-red-100 text-red-700',
              dueStatus === 'today' && 'bg-orange-100 text-orange-700',
              dueStatus === 'soon' && 'bg-amber-100 text-amber-700',
              dueStatus === 'later' && 'bg-gray-100 text-gray-500'
            )}
          >
            {dueStatus === 'overdue' ? <AlertTriangle className="h-2.5 w-2.5" /> : <Bell className="h-2.5 w-2.5" />}
            {formatDateShort(application.next_step_date)}
          </span>
        )}
      </div>
    </div>
  )
}
