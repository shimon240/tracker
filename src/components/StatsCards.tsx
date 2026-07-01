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
      accent: 'text-accent-bright',
      iconBg: 'bg-accent/20 text-accent-bright',
    },
    {
      label: 'В процессе',
      value: stats.inProgress,
      icon: <Clock className="h-5 w-5" />,
      accent: 'text-amber-300',
      iconBg: 'bg-amber-500/15 text-amber-300',
    },
    {
      label: 'Офферы',
      value: stats.offers,
      icon: <Star className="h-5 w-5" />,
      accent: 'text-emerald-300',
      iconBg: 'bg-emerald-500/15 text-emerald-300',
    },
    {
      label: 'Принято',
      value: stats.accepted,
      icon: <Trophy className="h-5 w-5" />,
      accent: 'text-purple-300',
      iconBg: 'bg-purple-500/15 text-purple-300',
    },
    {
      label: 'Отклонено',
      value: stats.rejected,
      icon: <XCircle className="h-5 w-5" />,
      accent: 'text-red-300',
      iconBg: 'bg-red-500/15 text-red-300',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
      {cards.map((card) => (
        <SpotlightCard key={card.label} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-foreground-muted">{card.label}</p>
              <p className={cn('mt-1 text-2xl font-semibold tracking-tight', card.accent)}>{card.value}</p>
            </div>
            <div className={cn('rounded-xl p-2 border border-white/5', card.iconBg)}>
              {card.icon}
            </div>
          </div>
        </SpotlightCard>
      ))}

      <SpotlightCard
        interactive
        className={cn('p-4 text-left cursor-pointer', showArchived && 'border-accent/30')}
        onClick={onToggleArchived}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-foreground-muted">Архив</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground-muted">{stats.archived}</p>
          </div>
          <div className={cn('rounded-xl p-2 border border-white/5', showArchived ? 'bg-accent/20 text-accent-bright' : 'bg-white/5 text-foreground-muted')}>
            <Archive className="h-5 w-5" />
          </div>
        </div>
        {showArchived && (
          <p className="mt-1 text-xs text-accent-bright font-medium">Показан архив</p>
        )}
      </SpotlightCard>
    </div>
  )
}
