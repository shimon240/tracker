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
    return <p className="text-sm text-gray-400 py-6 text-center">Нет данных за этот период</p>
  }

  return (
    <div className="flex items-end gap-1.5 sm:gap-2 h-40">
      {data.map((d, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
          <span className="text-[11px] font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
            {d.value}
          </span>
          <div className="w-full flex-1 flex items-end">
            <div
              className="w-full rounded-t-md bg-blue-500 group-hover:bg-blue-600 transition-all duration-300 min-h-[3px]"
              style={{ height: `${Math.max(2, (d.value / max) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-400 whitespace-nowrap">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
