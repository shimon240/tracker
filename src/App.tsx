import { useState, useCallback } from 'react'
import type { Application, FilterState, SortDirection, SortField } from '@/types'
import { useApplications, useFilteredApplications } from '@/hooks/useApplications'
import { StatsCards } from '@/components/StatsCards'
import { FiltersBar } from '@/components/FiltersBar'
import { ApplicationTable } from '@/components/ApplicationTable'
import { ApplicationForm } from '@/components/ApplicationForm'
import { ApplicationDetail } from '@/components/ApplicationDetail'
import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Plus, Briefcase, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import type { ApplicationStatus } from '@/types'

const DEFAULT_FILTERS: FilterState = {
  search: '',
  status: 'all',
  method: 'all',
  showArchived: false,
}

export default function App() {
  const {
    applications,
    loading,
    error,
    addApplication,
    updateApplication,
    deleteApplication,
    archiveApplication,
    unarchiveApplication,
    updateStatus,
    stats,
  } = useApplications()

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sortField, setSortField] = useState<SortField>('date_applied')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const [formOpen, setFormOpen] = useState(false)
  const [editApp, setEditApp] = useState<Application | null>(null)
  const [detailApp, setDetailApp] = useState<Application | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const filteredApps = useFilteredApplications(applications, filters, sortField, sortDirection)
  const totalForView = applications.filter(a => filters.showArchived ? a.archived : !a.archived).length

  const handleSort = useCallback((field: SortField) => {
    setSortField(prev => {
      if (prev === field) {
        setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
        return field
      }
      setSortDirection('desc')
      return field
    })
  }, [])

  const handleAdd = useCallback(() => {
    setEditApp(null)
    setFormOpen(true)
  }, [])

  const handleEdit = useCallback((app: Application) => {
    setEditApp(app)
    setFormOpen(true)
  }, [])

  const handleView = useCallback((app: Application) => {
    setDetailApp(app)
    setDetailOpen(true)
  }, [])

  const handleSave = useCallback(async (data: Omit<Application, 'id' | 'created_at' | 'updated_at'>) => {
    if (editApp) {
      await updateApplication(editApp.id, data)
    } else {
      await addApplication(data)
    }
    setFormOpen(false)
    setEditApp(null)
  }, [editApp, updateApplication, addApplication])

  const handleStatusChange = useCallback((id: string, status: ApplicationStatus) => {
    void updateStatus(id, status)
  }, [updateStatus])

  const handleToggleArchived = useCallback(() => {
    setFilters(prev => ({ ...prev, showArchived: !prev.showArchived }))
  }, [])

  const currentDetailApp = detailApp
    ? (applications.find(a => a.id === detailApp.id) ?? detailApp)
    : null

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 leading-none">ApplyTrack</h1>
                <p className="text-xs text-gray-500 leading-none mt-0.5">Трекер откликов</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {loading && (
                <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
              )}
              <Button onClick={handleAdd} className="gap-1.5 shadow-sm" size="sm" disabled={loading}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Добавить отклик</span>
                <span className="sm:hidden">Добавить</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-800 font-medium"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Обновить
              </button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading ? (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-xl border border-gray-100 bg-white animate-pulse" />
                ))}
              </div>
              <div className="h-64 rounded-xl border border-gray-200 bg-white animate-pulse" />
            </div>
          ) : (
            <>
              {/* Stats */}
              <StatsCards
                stats={stats}
                showArchived={filters.showArchived}
                onToggleArchived={handleToggleArchived}
              />

              {/* Table section */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-800">
                    {filters.showArchived ? 'Архивные отклики' : 'Активные отклики'}
                  </h2>
                </div>

                <FiltersBar
                  filters={filters}
                  onFiltersChange={setFilters}
                  totalShown={filteredApps.length}
                  totalAll={totalForView}
                />

                <ApplicationTable
                  applications={filteredApps}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={id => void deleteApplication(id)}
                  onArchive={id => void archiveApplication(id)}
                  onUnarchive={id => void unarchiveApplication(id)}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </>
          )}
        </main>

        {/* Form modal */}
        <ApplicationForm
          open={formOpen}
          onClose={() => { setFormOpen(false); setEditApp(null) }}
          onSave={handleSave}
          editData={editApp}
        />

        {/* Detail modal */}
        <ApplicationDetail
          application={currentDetailApp}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          onEdit={app => { setDetailOpen(false); handleEdit(app) }}
          onDelete={id => { void deleteApplication(id); setDetailOpen(false) }}
          onArchive={id => void archiveApplication(id)}
          onUnarchive={id => void unarchiveApplication(id)}
          onStatusChange={handleStatusChange}
        />
      </div>
    </TooltipProvider>
  )
}
