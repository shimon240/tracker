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
    return <p className="text-sm text-foreground-muted py-6 text-center">{emptyMessage}</p>
  }

  return (
    <div className="space-y-3">
      {data.map(d => (
        <div key={d.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">{d.label}</span>
            <span className="text-foreground-muted tabular-nums">
              {d.value}
              {d.sublabel && <span className="text-foreground-subtle ml-1">{d.sublabel}</span>}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-100">
            <div
              className="h-full rounded-full ds-transition"
              style={{
                width: `${max > 0 ? Math.max(2, (d.value / max) * 100) : 0}%`,
                backgroundColor: d.color ?? '#4F46E5',
                boxShadow: '0 0 12px rgba(79,70,229,0.25)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
