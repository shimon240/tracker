import type { FilterState, ApplicationStatus, SubmissionMethod, Priority } from '@/types'
import { STATUSES, SUBMISSION_METHODS, PRIORITIES } from '@/hooks/useApplications'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, X, SlidersHorizontal, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { pluralize } from '@/lib/dateHelpers'

interface FiltersBarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  totalShown: number
  totalAll: number
  availableTags: string[]
}

export function FiltersBar({ filters, onFiltersChange, totalShown, totalAll, availableTags }: FiltersBarProps) {
  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.status !== 'all' ||
    filters.method !== 'all' ||
    filters.priority !== 'all' ||
    filters.tag !== 'all'

  function reset() {
    onFiltersChange({
      ...filters,
      search: '',
      status: 'all',
      method: 'all',
      priority: 'all',
      tag: 'all',
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted pointer-events-none" />
          <Input
            placeholder="Поиск по компании, должности, заметкам..."
            value={filters.search}
            onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9 pr-9"
          />
          {filters.search && (
            <button
              onClick={() => onFiltersChange({ ...filters, search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground ds-transition"
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
          <SelectTrigger className={cn('w-44', filters.status !== 'all' && 'border-indigo-300 bg-indigo-50')}>
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-foreground-muted shrink-0" />
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
          <SelectTrigger className={cn('w-40', filters.method !== 'all' && 'border-indigo-300 bg-indigo-50')}>
            <SelectValue placeholder="Все способы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все способы</SelectItem>
            {SUBMISSION_METHODS.map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority filter */}
        <Select
          value={filters.priority}
          onValueChange={v => onFiltersChange({ ...filters, priority: v as Priority | 'all' })}
        >
          <SelectTrigger className={cn('w-36', filters.priority !== 'all' && 'border-indigo-300 bg-indigo-50')}>
            <SelectValue placeholder="Приоритет" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Любой приоритет</SelectItem>
            {PRIORITIES.map(p => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tag filter */}
        {availableTags.length > 0 && (
          <Select
            value={filters.tag}
            onValueChange={v => onFiltersChange({ ...filters, tag: v })}
          >
            <SelectTrigger className={cn('w-36', filters.tag !== 'all' && 'border-indigo-300 bg-indigo-50')}>
              <div className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-foreground-muted shrink-0" />
                <SelectValue placeholder="Теги" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все теги</SelectItem>
              {availableTags.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Reset */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5 text-foreground-muted shrink-0">
            <X className="h-3.5 w-3.5" />
            Сбросить
          </Button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-foreground-muted font-medium">
        {totalShown === totalAll
          ? `${totalAll} ${pluralize(totalAll, 'отклик', 'отклика', 'откликов')}`
          : `Показано ${totalShown} из ${totalAll}`}
        {filters.showArchived && ' (архив)'}
      </p>
    </div>
  )
}
