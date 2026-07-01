import { useMemo, useState } from 'react'
import type { Application } from '@/types'
import { getDueStatus, formatDate, daysSince } from '@/lib/dateHelpers'
import { StatusBadge } from '@/components/StatusBadge'
import { SpotlightCard } from '@/components/layout/SpotlightCard'
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
    <SpotlightCard interactive={false} className="border-amber-500/20 overflow-hidden">
      <button
        onClick={() => setCollapsed(prev => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-amber-500/5 ds-transition"
      >
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-semibold text-amber-200">Напоминания</span>
          <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-xs font-bold text-amber-200">
            {dueItems.length}
          </span>
          {overdueCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 border border-red-500/25 px-2 py-0.5 text-xs font-medium text-red-300">
              <AlertTriangle className="h-3 w-3" />
              {overdueCount} просрочено
            </span>
          )}
        </div>
        {collapsed ? <ChevronDown className="h-4 w-4 text-amber-400" /> : <ChevronUp className="h-4 w-4 text-amber-400" />}
      </button>

      {!collapsed && (
        <div className="divide-y divide-border border-t border-border">
          {dueItems.map(({ app, due }) => (
            <button
              key={app.id}
              onClick={() => onSelect(app)}
              className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-surface ds-transition"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Building2 className="h-3.5 w-3.5 text-foreground-muted shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {app.company} <span className="text-foreground-muted font-normal">— {app.position}</span>
                  </p>
                  <p className="text-xs text-foreground-muted truncate">{app.next_step || 'Следующий шаг не указан'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={app.status} />
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap border',
                    due === 'overdue' && 'bg-red-500/15 text-red-300 border-red-500/25',
                    due === 'today' && 'bg-orange-500/15 text-orange-300 border-orange-500/25',
                    due === 'soon' && 'bg-amber-500/15 text-amber-300 border-amber-500/25'
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
    </SpotlightCard>
  )
}
