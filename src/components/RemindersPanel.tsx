import { useMemo, useState } from 'react'
import type { Application } from '@/types'
import { getDueStatus, formatDate, daysSince } from '@/lib/dateHelpers'
import { StatusBadge } from '@/components/StatusBadge'
import { Bell, AlertTriangle, ChevronDown, ChevronUp, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RemindersPanelProps {
  applications: Application[]
  onSelect: (app: Application) => void
}

export function RemindersPanel({ applications, onSelect }: RemindersPanelProps) {
  const [collapsed, setCollapsed] = useState(false)

  const dueItems = useMemo(() => {
    return applications
      .filter(a => !a.archived)
      .map(a => ({ app: a, due: getDueStatus(a.next_step_date, a.status) }))
      .filter(({ due }) => due === 'overdue' || due === 'today' || due === 'soon')
      .sort((a, b) => (a.app.next_step_date ?? '').localeCompare(b.app.next_step_date ?? ''))
  }, [applications])

  if (dueItems.length === 0) return null

  const overdueCount = dueItems.filter(d => d.due === 'overdue').length

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/50 overflow-hidden">
      <button
        onClick={() => setCollapsed(prev => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-amber-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-semibold text-amber-900">
            Напоминания
          </span>
          <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-800">
            {dueItems.length}
          </span>
          {overdueCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              <AlertTriangle className="h-3 w-3" />
              {overdueCount} просрочено
            </span>
          )}
        </div>
        {collapsed ? <ChevronDown className="h-4 w-4 text-amber-600" /> : <ChevronUp className="h-4 w-4 text-amber-600" />}
      </button>

      {!collapsed && (
        <div className="divide-y divide-amber-100 border-t border-amber-100">
          {dueItems.map(({ app, due }) => (
            <button
              key={app.id}
              onClick={() => onSelect(app)}
              className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-amber-50/80 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Building2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {app.company} <span className="text-gray-400 font-normal">— {app.position}</span>
                  </p>
                  <p className="text-xs text-gray-500 truncate">{app.next_step || 'Следующий шаг не указан'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={app.status} />
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap',
                    due === 'overdue' && 'bg-red-100 text-red-700',
                    due === 'today' && 'bg-orange-100 text-orange-700',
                    due === 'soon' && 'bg-amber-100 text-amber-700'
                  )}
                >
                  {due === 'overdue'
                    ? `Просрочено на ${daysSince(app.next_step_date!)} дн.`
                    : due === 'today'
                      ? 'Сегодня'
                      : formatDate(app.next_step_date, 'd MMM')}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
