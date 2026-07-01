import { type ReactNode, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  interactive?: boolean
}

export function SpotlightCard({
  children,
  className,
  interactive = true,
  ...props
}: SpotlightCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden ds-card ds-transition',
        interactive && 'ds-card-interactive',
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  )
}
