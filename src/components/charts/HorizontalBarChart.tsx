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
            <span className="font-medium text-foreground">{d.label}</span>
            <span className="text-foreground-muted tabular-nums">
              {d.value}
              {d.sublabel && <span className="text-foreground-subtle ml-1">{d.sublabel}</span>}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-surface overflow-hidden border border-border">
            <div
              className="h-full rounded-full ds-transition"
              style={{
                width: `${max > 0 ? Math.max(2, (d.value / max) * 100) : 0}%`,
                backgroundColor: d.color ?? '#5E6AD2',
                boxShadow: '0 0 12px rgba(94,106,210,0.4)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
