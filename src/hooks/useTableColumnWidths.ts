import { useCallback, useEffect, useState } from 'react'
import {
  COLUMN_MIN_WIDTHS,
  DEFAULT_COLUMN_WIDTHS,
  loadColumnWidths,
  saveColumnWidths,
  type TableColumnKey,
} from '@/lib/tableColumnConfig'

export function useTableColumnWidths(userId: string) {
  const [widths, setWidths] = useState<Record<TableColumnKey, number>>(() =>
    loadColumnWidths(userId)
  )

  useEffect(() => {
    setWidths(loadColumnWidths(userId))
  }, [userId])

  useEffect(() => {
    saveColumnWidths(userId, widths)
  }, [userId, widths])

  const setColumnWidth = useCallback((key: TableColumnKey, width: number) => {
    setWidths(prev => ({
      ...prev,
      [key]: Math.max(COLUMN_MIN_WIDTHS[key], width),
    }))
  }, [])

  const resetColumnWidths = useCallback(() => {
    setWidths({ ...DEFAULT_COLUMN_WIDTHS })
  }, [])

  return { widths, setColumnWidth, resetColumnWidths }
}
