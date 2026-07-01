import { useRef, useState, type ReactNode, type MouseEvent, type HTMLAttributes } from 'react'
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
  const ref = useRef<HTMLDivElement>(null)
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false })

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setSpotlight({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      visible: true,
    })
  }

  function handleMouseLeave() {
    setSpotlight(prev => ({ ...prev, visible: false }))
  }

  return (
    <div
      ref={ref}
      onMouseMove={interactive ? handleMouseMove : undefined}
      onMouseLeave={interactive ? handleMouseLeave : undefined}
      className={cn(
        'relative overflow-hidden ds-card ds-transition',
        interactive && 'ds-card-interactive',
        className
      )}
      {...props}
    >
      {interactive && (
        <div
          className="pointer-events-none absolute inset-0 z-0 ds-transition"
          style={{
            opacity: spotlight.visible ? 1 : 0,
            background: `radial-gradient(300px circle at ${spotlight.x}px ${spotlight.y}px, rgb(94 106 210 / 0.15), transparent 60%)`,
          }}
        />
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
