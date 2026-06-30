import { useDroppable } from '@dnd-kit/core'
import type { Application, ApplicationStatus } from '@/types'
import { STATUS_CONFIG } from '@/lib/statusConfig'
import { KanbanCard } from '@/components/kanban/KanbanCard'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  status: ApplicationStatus
  applications: Application[]
  onCardClick: (app: Application) => void
}

export function KanbanColumn({ status, applications, onCardClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const cfg = STATUS_CONFIG[status]

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-xl bg-gray-50/70 border border-gray-100">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className={cn('h-2 w-2 rounded-full', cfg.dotColor)} />
          <span className="text-sm font-semibold text-gray-700">{cfg.label}</span>
        </div>
        <span className="text-xs font-medium text-gray-400 bg-white rounded-full px-1.5 py-0.5 border border-gray-100">
          {applications.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 space-y-2 overflow-y-auto p-2 min-h-[120px] max-h-[calc(100vh-280px)] transition-colors rounded-b-xl',
          isOver && 'bg-blue-50/70 ring-2 ring-inset ring-blue-200'
        )}
      >
        {applications.map(app => (
          <KanbanCard key={app.id} application={app} onClick={() => onCardClick(app)} />
        ))}
        {applications.length === 0 && (
          <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-gray-200 text-xs text-gray-300">
            Пусто
          </div>
        )}
      </div>
    </div>
  )
}
