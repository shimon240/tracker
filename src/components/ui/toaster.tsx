import { useToast } from '@/hooks/useToast'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const ICONS = {
  default: Info,
  success: CheckCircle2,
  error: XCircle,
}

const STYLES = {
  default: 'border-border bg-background-elevated text-foreground',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  error: 'border-red-500/30 bg-red-500/10 text-red-200',
}

const ICON_COLORS = {
  default: 'text-foreground-muted',
  success: 'text-emerald-400',
  error: 'text-red-400',
}

export function Toaster() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map(t => {
        const Icon = ICONS[t.variant]
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              'flex items-start gap-3 rounded-2xl border p-3.5 ds-shadow-card animate-in slide-in-from-bottom-2 fade-in-0',
              STYLES[t.variant]
            )}
          >
            <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', ICON_COLORS[t.variant])} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight">{t.title}</p>
              {t.description && (
                <p className="text-xs mt-0.5 text-foreground-muted leading-snug">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 text-foreground-muted hover:text-foreground ds-transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
