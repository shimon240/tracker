import type { Priority } from '@/types'
import { PRIORITY_CONFIG } from '@/lib/statusConfig'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface PriorityBadgeProps {
  priority: Priority
  className?: string
  showLabel?: boolean
}

export function PriorityBadge({ priority, className, showLabel = true }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority]

  if (priority === 'Мечта') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
          config.bgColor,
          config.color,
          className
        )}
      >
        <Star className="h-3 w-3 fill-current" />
        {showLabel && config.label}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        config.bgColor,
        config.color,
        config.borderColor,
        className
      )}
    >
      {showLabel && config.label}
    </span>
  )
}
