interface WeekDatum {
  label: string
  value: number
}

interface WeeklyTrendChartProps {
  data: WeekDatum[]
}

export function WeeklyTrendChart({ data }: WeeklyTrendChartProps) {
  const max = Math.max(1, ...data.map(d => d.value))

  if (data.every(d => d.value === 0)) {
    return <p className="text-sm text-foreground-muted py-6 text-center">Нет данных за этот период</p>
  }

  return (
    <div className="flex items-end gap-1.5 sm:gap-2 h-40">
      {data.map((d, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
          <span className="text-[11px] font-medium text-accent-bright opacity-0 group-hover:opacity-100 ds-transition tabular-nums">
            {d.value}
          </span>
          <div className="w-full flex-1 flex items-end">
            <div
              className="w-full rounded-t-md bg-accent group-hover:bg-accent-bright ds-transition min-h-[3px]"
              style={{
                height: `${Math.max(2, (d.value / max) * 100)}%`,
                boxShadow: '0 0 16px rgba(94,106,210,0.35)',
              }}
            />
          </div>
          <span className="text-[10px] text-foreground-muted whitespace-nowrap font-mono">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
