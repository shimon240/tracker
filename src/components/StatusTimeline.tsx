import type { ApplicationEvent } from '@/types'
import { formatDateTime } from '@/lib/dateHelpers'
import { History } from 'lucide-react'

interface StatusTimelineProps {
  events: ApplicationEvent[]
  loading?: boolean
}

export function StatusTimeline({ events, loading }: StatusTimelineProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-foreground-muted py-3">
        <History className="h-4 w-4 animate-pulse" />
        Загрузка истории...
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <p className="flex items-center gap-1.5 text-sm font-medium text-foreground-muted py-3">
        <History className="h-4 w-4" />
        История изменений пока пуста
      </p>
    )
  }

  return (
    <div>
      <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-2">
        <History className="h-4 w-4 text-foreground-muted" />
        История статусов
      </p>
      <div className="space-y-0 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 ds-shadow-soft">
        {events.map((event, idx) => (
          <div key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
            <div className="relative mt-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-100" />
              {idx < events.length - 1 && (
                <div className="absolute left-[5px] top-3 bottom-0 w-px bg-slate-200" />
              )}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <p className="text-sm text-foreground">
                {event.from_status ? (
                  <>
                    <span className="text-foreground-muted">{event.from_status}</span>
                    <span className="mx-1.5 text-slate-300">→</span>
                    <span className="font-semibold">{event.to_status}</span>
                  </>
                ) : (
                  <span className="font-semibold">{event.to_status}</span>
                )}
              </p>
              <p className="text-xs text-foreground-muted mt-0.5">{formatDateTime(event.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
