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
    <div className="flex w-28 shrink-0 flex-col rounded-lg bg-gray-50/70 border border-gray-100">
      <div className="flex items-center justify-between gap-1 px-1.5 py-1.5 border-b border-gray-100 min-w-0">
        <div className="flex items-center gap-1 min-w-0">
          <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', cfg.dotColor)} />
          <span className="text-[11px] font-semibold text-gray-700 truncate">{cfg.label}</span>
        </div>
        <span className="shrink-0 text-[10px] font-medium text-gray-400 bg-white rounded-full px-1 py-px border border-gray-100">
          {applications.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 space-y-1 overflow-y-auto p-1 min-h-[80px] max-h-[calc(100vh-280px)] transition-colors rounded-b-lg',
          isOver && 'bg-blue-50/70 ring-2 ring-inset ring-blue-200'
        )}
      >
        {applications.map(app => (
          <KanbanCard key={app.id} application={app} onClick={() => onCardClick(app)} />
        ))}
        {applications.length === 0 && (
          <div className="flex h-12 items-center justify-center rounded border border-dashed border-gray-200 text-[10px] text-gray-300">
            Пусто
          </div>
        )}
      </div>
    </div>
  )
}
