import { Briefcase, Clock, Star, Trophy, XCircle, Archive } from 'lucide-react'

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
  bgColor: string
  iconColor: string
  textColor: string
}

export function StatsCards({ stats, showArchived, onToggleArchived }: StatsCardsProps) {
  const cards: StatCard[] = [
    {
      label: 'Всего активных',
      value: stats.total,
      icon: <Briefcase className="h-5 w-5" />,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-700',
    },
    {
      label: 'В процессе',
      value: stats.inProgress,
      icon: <Clock className="h-5 w-5" />,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      textColor: 'text-amber-700',
    },
    {
      label: 'Офферы',
      value: stats.offers,
      icon: <Star className="h-5 w-5" />,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-700',
    },
    {
      label: 'Принято',
      value: stats.accepted,
      icon: <Trophy className="h-5 w-5" />,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-700',
    },
    {
      label: 'Отклонено',
      value: stats.rejected,
      icon: <XCircle className="h-5 w-5" />,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      textColor: 'text-red-700',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">{card.label}</p>
              <p className={`mt-1 text-2xl font-bold ${card.textColor}`}>{card.value}</p>
            </div>
            <div className={`rounded-lg p-2 ${card.bgColor}`}>
              <span className={card.iconColor}>{card.icon}</span>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={onToggleArchived}
        className={`rounded-xl border p-4 shadow-sm transition-all hover:shadow-md text-left ${
          showArchived
            ? 'border-gray-400 bg-gray-100'
            : 'border-gray-100 bg-white hover:border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Архив</p>
            <p className="mt-1 text-2xl font-bold text-gray-600">{stats.archived}</p>
          </div>
          <div className={`rounded-lg p-2 ${showArchived ? 'bg-gray-200' : 'bg-gray-50'}`}>
            <Archive className="h-5 w-5 text-gray-500" />
          </div>
        </div>
        {showArchived && (
          <p className="mt-1 text-xs text-gray-500 font-medium">Показан архив</p>
        )}
      </button>
    </div>
  )
}
