import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Application } from '@/types'
import { daysSince, formatDateTime } from '@/lib/dateHelpers'
import { cn } from '@/lib/utils'

interface KanbanCardProps {
  application: Application
  onClick: () => void
  dragging?: boolean
}

function formatLastUpdate(dateStr: string): string {
  const days = daysSince(dateStr)
  if (days === 0) return 'Сегодня'
  if (days === 1) return 'Вчера'
  if (days <= 7) return `${days} дн. назад`
  return formatDateTime(dateStr)
}

export function KanbanCard({ application, onClick, dragging = false }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: application.id,
    data: { application },
  })

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => !isDragging && onClick()}
      className={cn(
        'group w-full rounded-lg border border-border bg-gradient-to-b from-white/[0.08] to-white/[0.02] px-2 py-1.5 ds-shadow-card ds-transition hover:border-border-hover hover:ds-shadow-card-hover cursor-grab active:cursor-grabbing active:scale-[0.98] select-none',
        (isDragging || dragging) && 'opacity-50 ring-2 ring-accent/50'
      )}
    >
      <p className="text-xs font-semibold text-foreground truncate leading-tight">
        {application.company}
      </p>
      <p className="text-[10px] text-foreground-muted mt-0.5 truncate leading-tight">
        {formatLastUpdate(application.updated_at)}
      </p>
    </div>
  )
}
