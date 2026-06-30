import { useMemo } from 'react'
import type { Application } from '@/types'
import { useAllApplicationEvents } from '@/hooks/useAllApplicationEvents'
import { HorizontalBarChart } from '@/components/charts/HorizontalBarChart'
import { WeeklyTrendChart } from '@/components/charts/WeeklyTrendChart'
import {
  computeFunnel,
  computeAvgDaysToFirstResponse,
  computeWeeklyTrend,
  computeMethodBreakdown,
  computeStatusDistribution,
  computeTopCompaniesByVolume,
} from '@/lib/analytics'
import { TrendingUp, Clock, Target, Award, Loader2, BarChart3 } from 'lucide-react'

interface AnalyticsViewProps {
  applications: Application[]
}

interface KpiCardProps {
  label: string
  value: string
  icon: React.ReactNode
  bgColor: string
  iconColor: string
  description?: string
}

function KpiCard({ label, value, icon, bgColor, iconColor, description }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {description && <p className="mt-0.5 text-xs text-gray-400">{description}</p>}
        </div>
        <div className={`rounded-lg p-2 ${bgColor}`}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
    </div>
  )
}

function Card({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  )
}

export function AnalyticsView({ applications }: AnalyticsViewProps) {
  const { events, loading } = useAllApplicationEvents()
  const activeApps = useMemo(() => applications.filter(a => !a.archived), [applications])

  const funnel = useMemo(() => computeFunnel(activeApps, events), [activeApps, events])
  const avgDaysToResponse = useMemo(() => computeAvgDaysToFirstResponse(activeApps, events), [activeApps, events])
  const weeklyTrend = useMemo(() => computeWeeklyTrend(activeApps), [activeApps])
  const methodBreakdown = useMemo(() => computeMethodBreakdown(activeApps), [activeApps])
  const statusDistribution = useMemo(() => computeStatusDistribution(activeApps), [activeApps])
  const topCompanies = useMemo(() => computeTopCompaniesByVolume(activeApps), [activeApps])

  const total = activeApps.length
  const interviewStageCount = funnel.find(f => f.stage === 'Техническое интервью')?.count ?? 0
  const offerCount = funnel.find(f => f.stage === 'Оффер')?.count ?? 0
  const acceptedCount = funnel.find(f => f.stage === 'Принято')?.count ?? 0

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Загрузка аналитики...
      </div>
    )
  }

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
        <BarChart3 className="h-12 w-12 text-gray-300 mb-3" />
        <p className="text-base font-medium text-gray-500">Пока нет данных для аналитики</p>
        <p className="mt-1 text-sm text-gray-400">Добавьте отклики, чтобы увидеть статистику</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="До интервью дошли"
          value={`${total > 0 ? Math.round((interviewStageCount / total) * 100) : 0}%`}
          description={`${interviewStageCount} из ${total}`}
          icon={<Target className="h-5 w-5" />}
          bgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
        <KpiCard
          label="Получили оффер"
          value={`${total > 0 ? Math.round(((offerCount + acceptedCount) / total) * 100) : 0}%`}
          description={`${offerCount + acceptedCount} из ${total}`}
          icon={<Award className="h-5 w-5" />}
          bgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <KpiCard
          label="Среднее время ответа"
          value={avgDaysToResponse !== null ? `${avgDaysToResponse} дн.` : '—'}
          description="от отклика до реакции"
          icon={<Clock className="h-5 w-5" />}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <KpiCard
          label="Откликов всего"
          value={String(total)}
          description="активных откликов"
          icon={<TrendingUp className="h-5 w-5" />}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Funnel + Weekly trend */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Воронка прохождения этапов" icon={<Target className="h-4 w-4 text-gray-400" />}>
          <HorizontalBarChart
            data={funnel.map(f => ({
              label: f.stage,
              value: f.count,
              sublabel: `${f.percentOfTotal}%`,
              color: '#3b82f6',
            }))}
            maxValue={total}
          />
        </Card>

        <Card title="Динамика откликов по неделям" icon={<TrendingUp className="h-4 w-4 text-gray-400" />}>
          <WeeklyTrendChart data={weeklyTrend} />
        </Card>
      </div>

      {/* Status distribution + method breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Текущее распределение по статусам">
          <HorizontalBarChart
            data={statusDistribution.map(s => ({ label: s.label, value: s.value, color: s.color }))}
          />
        </Card>

        <Card title="Способы отклика">
          <HorizontalBarChart
            data={methodBreakdown.map(m => ({ label: m.label, value: m.value, color: '#6366f1' }))}
          />
        </Card>
      </div>

      {topCompanies.length > 0 && (
        <Card title="Топ компаний по количеству откликов">
          <HorizontalBarChart
            data={topCompanies.map(c => ({ label: c.label, value: c.value, color: '#0ea5e9' }))}
          />
        </Card>
      )}
    </div>
  )
}
