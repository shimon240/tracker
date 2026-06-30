interface BarDatum {
  label: string
  value: number
  color?: string
  sublabel?: string
}

interface HorizontalBarChartProps {
  data: BarDatum[]
  maxValue?: number
  emptyMessage?: string
}

export function HorizontalBarChart({ data, maxValue, emptyMessage = 'Нет данных' }: HorizontalBarChartProps) {
  const max = maxValue ?? Math.max(1, ...data.map(d => d.value))
  const total = data.reduce((sum, d) => sum + d.value, 0)

  if (total === 0) {
    return <p className="text-sm text-gray-400 py-6 text-center">{emptyMessage}</p>
  }

  return (
    <div className="space-y-3">
      {data.map(d => (
        <div key={d.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-gray-700">{d.label}</span>
            <span className="text-gray-500 tabular-nums">
              {d.value}
              {d.sublabel && <span className="text-gray-400 ml-1">{d.sublabel}</span>}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${max > 0 ? Math.max(2, (d.value / max) * 100) : 0}%`,
                backgroundColor: d.color ?? '#3b82f6',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
