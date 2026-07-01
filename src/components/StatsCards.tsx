import { Briefcase, Clock, Star, Trophy, XCircle, Archive } from 'lucide-react'
import { SpotlightCard } from '@/components/layout/SpotlightCard'
import { cn } from '@/lib/utils'

interface StatsCardsProps {
  stats: {
    total: number
    sent: number
    inProgress: number
    offers: number
    accepted: number
    rejected: number
    noResponse: number
    archived: number
  }
  showArchived: boolean
  onToggleArchived: () => void
}

interface StatCard {
  label: string
  value: number
  icon: React.ReactNode
  accent: string
  iconBg: string
}

export function StatsCards({ stats, showArchived, onToggleArchived }: StatsCardsProps) {
  const cards: StatCard[] = [
    {
      label: 'Всего активных',
      value: stats.total,
      icon: <Briefcase className="h-5 w-5" />,
      accent: 'text-indigo-600',
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: 'В процессе',
      value: stats.inProgress,
      icon: <Clock className="h-5 w-5" />,
      accent: 'text-amber-600',
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Офферы',
      value: stats.offers,
      icon: <Star className="h-5 w-5" />,
      accent: 'text-emerald-600',
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Принято',
      value: stats.accepted,
      icon: <Trophy className="h-5 w-5" />,
      accent: 'text-violet-600',
      iconBg: 'bg-violet-50 text-violet-600',
    },
    {
      label: 'Отклонено',
      value: stats.rejected,
      icon: <XCircle className="h-5 w-5" />,
      accent: 'text-red-600',
      iconBg: 'bg-red-50 text-red-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
      {cards.map((card) => (
        <SpotlightCard key={card.label} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-foreground-muted">{card.label}</p>
              <p className={cn('mt-1 text-2xl font-bold tracking-tight', card.accent)}>{card.value}</p>
            </div>
            <div className={cn('rounded-xl p-2', card.iconBg)}>
              {card.icon}
            </div>
          </div>
        </SpotlightCard>
      ))}

      <SpotlightCard
        interactive
        className={cn('p-4 text-left cursor-pointer', showArchived && 'ring-2 ring-indigo-200')}
        onClick={onToggleArchived}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-foreground-muted">Архив</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-600">{stats.archived}</p>
          </div>
          <div className={cn('rounded-xl p-2', showArchived ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500')}>
            <Archive className="h-5 w-5" />
          </div>
        </div>
        {showArchived && (
          <p className="mt-1 text-xs text-indigo-600 font-semibold">Показан архив</p>
        )}
      </SpotlightCard>
    </div>
  )
}
