import type { ApplicationStatus } from '@/types'
import { STATUS_CONFIG } from '@/lib/statusConfig'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: ApplicationStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.bgColor,
        config.color,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', config.dotColor)} />
      {config.label}
    </span>
  )
}
