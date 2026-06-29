import type { FilterState, ApplicationStatus, SubmissionMethod } from '@/types'
import { STATUSES, SUBMISSION_METHODS } from '@/hooks/useApplications'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FiltersBarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  totalShown: number
  totalAll: number
}

export function FiltersBar({ filters, onFiltersChange, totalShown, totalAll }: FiltersBarProps) {
  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.status !== 'all' ||
    filters.method !== 'all'

  function reset() {
    onFiltersChange({
      ...filters,
      search: '',
      status: 'all',
      method: 'all',
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Поиск по компании, должности, заметкам..."
            value={filters.search}
            onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9 pr-9"
          />
          {filters.search && (
            <button
              onClick={() => onFiltersChange({ ...filters, search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status filter */}
        <Select
          value={filters.status}
          onValueChange={v => onFiltersChange({ ...filters, status: v as ApplicationStatus | 'all' })}
        >
          <SelectTrigger className={cn('w-48', filters.status !== 'all' && 'border-blue-400 bg-blue-50')}>
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <SelectValue placeholder="Все статусы" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            {STATUSES.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Method filter */}
        <Select
          value={filters.method}
          onValueChange={v => onFiltersChange({ ...filters, method: v as SubmissionMethod | 'all' })}
        >
          <SelectTrigger className={cn('w-44', filters.method !== 'all' && 'border-blue-400 bg-blue-50')}>
            <SelectValue placeholder="Все способы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все способы</SelectItem>
            {SUBMISSION_METHODS.map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5 text-gray-500 shrink-0">
            <X className="h-3.5 w-3.5" />
            Сбросить
          </Button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500">
        {totalShown === totalAll
          ? `${totalAll} ${pluralize(totalAll, 'отклик', 'отклика', 'откликов')}`
          : `Показано ${totalShown} из ${totalAll}`}
        {filters.showArchived && ' (архив)'}
      </p>
    </div>
  )
}

function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 19) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}
