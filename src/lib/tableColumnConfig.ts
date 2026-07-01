export type TableColumnKey =
  | 'select'
  | 'company'
  | 'priority'
  | 'date_applied'
  | 'method'
  | 'status'
  | 'actions'

export interface TableColumnConfig {
  key: TableColumnKey
  label: string
  sortable: boolean
  resizable: boolean
  className?: string
  defaultWidth: number
  minWidth: number
}

export const TABLE_COLUMNS: TableColumnConfig[] = [
  { key: 'select', label: '', sortable: false, resizable: true, defaultWidth: 44, minWidth: 36 },
  { key: 'company', label: 'Компания / Вакансия', sortable: true, resizable: true, defaultWidth: 240, minWidth: 120 },
  { key: 'priority', label: 'Приоритет', sortable: true, resizable: true, className: 'hidden sm:table-cell', defaultWidth: 112, minWidth: 80 },
  { key: 'date_applied', label: 'Дата', sortable: true, resizable: true, defaultWidth: 112, minWidth: 80 },
  { key: 'method', label: 'Способ', sortable: false, resizable: true, className: 'hidden md:table-cell', defaultWidth: 128, minWidth: 80 },
  { key: 'status', label: 'Статус', sortable: true, resizable: true, defaultWidth: 176, minWidth: 100 },
  { key: 'actions', label: '', sortable: false, resizable: true, defaultWidth: 44, minWidth: 36 },
]

export const DEFAULT_COLUMN_WIDTHS = Object.fromEntries(
  TABLE_COLUMNS.map(col => [col.key, col.defaultWidth])
) as Record<TableColumnKey, number>

export const COLUMN_MIN_WIDTHS = Object.fromEntries(
  TABLE_COLUMNS.map(col => [col.key, col.minWidth])
) as Record<TableColumnKey, number>

export function getStorageKey(userId: string) {
  return `applytrack:table-column-widths:${userId}`
}

export function loadColumnWidths(userId: string): Record<TableColumnKey, number> {
  try {
    const raw = localStorage.getItem(getStorageKey(userId))
    if (!raw) return { ...DEFAULT_COLUMN_WIDTHS }
    const parsed = JSON.parse(raw) as Partial<Record<TableColumnKey, number>>
    const result = { ...DEFAULT_COLUMN_WIDTHS }
    for (const col of TABLE_COLUMNS) {
      const value = parsed[col.key]
      if (typeof value === 'number' && Number.isFinite(value)) {
        result[col.key] = Math.max(col.minWidth, value)
      }
    }
    return result
  } catch {
    return { ...DEFAULT_COLUMN_WIDTHS }
  }
}

export function saveColumnWidths(userId: string, widths: Record<TableColumnKey, number>) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(widths))
}
