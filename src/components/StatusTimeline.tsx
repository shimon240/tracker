import type { ApplicationEvent } from '@/types'
import { STATUS_CONFIG } from '@/lib/statusConfig'
import { formatDateTime } from '@/lib/dateHelpers'
import { History, Loader2 } from 'lucide-react'

interface StatusTimelineProps {
  events: ApplicationEvent[]
  loading: boolean
}

export function StatusTimeline({ events, loading }: StatusTimelineProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 py-3">
        <Loader2 className="h-4 w-4 animate-spin" />
        Загрузка истории...
      </div>
    )
  }

  if (events.length === 0) return null

  return (
    <div className="space-y-1.5">
      <p className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        <History className="h-4 w-4 text-gray-500" />
        История изменений
      </p>
      <div className="space-y-0 rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-3">
        {events.map((event, idx) => {
          const cfg = STATUS_CONFIG[event.to_status]
          const isLast = idx === events.length - 1
          return (
            <div key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
              {!isLast && (
                <div className="absolute left-[5px] top-3 bottom-0 w-px bg-gray-200" />
              )}
              <div className={`relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${cfg.dotColor}`} />
              <div className="flex-1 min-w-0 -mt-0.5">
                <p className="text-sm text-gray-800">
                  {event.from_status ? (
                    <>
                      <span className="text-gray-400">{event.from_status}</span>
                      <span className="mx-1.5 text-gray-300">→</span>
                      <span className="font-medium">{event.to_status}</span>
                    </>
                  ) : (
                    <span className="font-medium">{event.note || 'Отклик создан'}</span>
                  )}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(event.created_at)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
