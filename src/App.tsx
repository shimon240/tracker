import { useCallback, useMemo, useState } from 'react'
import type { Application, ApplicationStatus, FilterState, SortDirection, SortField, ViewMode } from '@/types'
import { useApplications, useFilteredApplications, useAllTags } from '@/hooks/useApplications'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { AmbientBackground } from '@/components/layout/AmbientBackground'
import { SpotlightCard } from '@/components/layout/SpotlightCard'
import { StatsCards } from '@/components/StatsCards'
import { FiltersBar } from '@/components/FiltersBar'
import { ApplicationTable } from '@/components/ApplicationTable'
import { ApplicationForm } from '@/components/ApplicationForm'
import { ApplicationDetail } from '@/components/ApplicationDetail'
import { LoginPage } from '@/components/LoginPage'
import { UserMenu } from '@/components/UserMenu'
import { RemindersPanel } from '@/components/RemindersPanel'
import { BulkActionsBar } from '@/components/BulkActionsBar'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { AnalyticsView } from '@/components/AnalyticsView'
import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { exportApplicationsToCsv } from '@/lib/csvExport'
import { Plus, Briefcase, Loader2, AlertCircle, RefreshCw, Download, Table2, Columns3, BarChart3 } from 'lucide-react'

const DEFAULT_FILTERS: FilterState = {
  search: '',
  status: 'all',
  method: 'all',
  priority: 'all',
  tag: 'all',
  showArchived: false,
}

export default function App() {
  const { session, user, loading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AmbientBackground />
        <div className="relative z-10 flex flex-col items-center gap-3 text-foreground-muted">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!session || !user) {
    return <LoginPage />
  }

  return <Dashboard user={user} />
}

function Dashboard({ user }: { user: NonNullable<ReturnType<typeof useAuth>['user']> }) {
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
    bulkArchive,
    bulkUnarchive,
    bulkDelete,
    bulkUpdateStatus,
    stats,
  } = useApplications()
  const { toast } = useToast()

  const [view, setView] = useState<ViewMode>('table')
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sortField, setSortField] = useState<SortField>('date_applied')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const [formOpen, setFormOpen] = useState(false)
  const [editApp, setEditApp] = useState<Application | null>(null)
  const [detailApp, setDetailApp] = useState<Application | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const allTags = useAllTags(applications)
  const filteredApps = useFilteredApplications(applications, filters, sortField, sortDirection)
  const kanbanFilters = useMemo(() => ({ ...filters, status: 'all' as const, showArchived: false }), [filters])
  const kanbanApps = useFilteredApplications(applications, kanbanFilters, sortField, sortDirection)
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

  const handleAdd = useCallback(() => { setEditApp(null); setFormOpen(true) }, [])
  const handleEdit = useCallback((app: Application) => { setEditApp(app); setFormOpen(true) }, [])
  const handleView = useCallback((app: Application) => { setDetailApp(app); setDetailOpen(true) }, [])

  const handleSave = useCallback(async (data: Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editApp) {
        await updateApplication(editApp.id, data)
        toast({ title: 'Отклик обновлён', variant: 'success' })
      } else {
        await addApplication(data)
        toast({ title: 'Отклик добавлен', description: `${data.company} — ${data.position}`, variant: 'success' })
      }
      setFormOpen(false)
      setEditApp(null)
    } catch (e) {
      toast({ title: 'Не удалось сохранить', description: e instanceof Error ? e.message : undefined, variant: 'error' })
    }
  }, [editApp, updateApplication, addApplication, toast])

  const handleStatusChange = useCallback((id: string, status: ApplicationStatus) => {
    updateStatus(id, status)
      .then(() => toast({ title: `Статус изменён на «${status}»`, variant: 'success' }))
      .catch(() => toast({ title: 'Не удалось изменить статус', variant: 'error' }))
  }, [updateStatus, toast])

  const handleDelete = useCallback((id: string) => {
    deleteApplication(id)
      .then(() => toast({ title: 'Отклик удалён', variant: 'default' }))
      .catch(() => toast({ title: 'Не удалось удалить', variant: 'error' }))
  }, [deleteApplication, toast])

  const handleArchive = useCallback((id: string) => {
    archiveApplication(id)
      .then(() => toast({ title: 'Перемещено в архив', variant: 'default' }))
      .catch(() => toast({ title: 'Не удалось архивировать', variant: 'error' }))
  }, [archiveApplication, toast])

  const handleUnarchive = useCallback((id: string) => {
    unarchiveApplication(id)
      .then(() => toast({ title: 'Восстановлено из архива', variant: 'default' }))
      .catch(() => toast({ title: 'Не удалось восстановить', variant: 'error' }))
  }, [unarchiveApplication, toast])

  const handleToggleArchived = useCallback(() => {
    setFilters(prev => ({ ...prev, showArchived: !prev.showArchived }))
    setSelectedIds(new Set())
  }, [])

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleToggleSelectAll = useCallback(() => {
    setSelectedIds(prev => {
      const allSelected = filteredApps.length > 0 && filteredApps.every(a => prev.has(a.id))
      if (allSelected) return new Set()
      return new Set(filteredApps.map(a => a.id))
    })
  }, [filteredApps])

  const clearSelection = useCallback(() => setSelectedIds(new Set()), [])

  const handleBulkArchive = useCallback(() => {
    const ids = Array.from(selectedIds)
    bulkArchive(ids)
      .then(() => { toast({ title: `${ids.length} откликов перемещено в архив`, variant: 'default' }); clearSelection() })
      .catch(() => toast({ title: 'Не удалось архивировать выбранные', variant: 'error' }))
  }, [selectedIds, bulkArchive, toast, clearSelection])

  const handleBulkUnarchive = useCallback(() => {
    const ids = Array.from(selectedIds)
    bulkUnarchive(ids)
      .then(() => { toast({ title: `${ids.length} откликов восстановлено`, variant: 'default' }); clearSelection() })
      .catch(() => toast({ title: 'Не удалось восстановить выбранные', variant: 'error' }))
  }, [selectedIds, bulkUnarchive, toast, clearSelection])

  const handleBulkDelete = useCallback(() => {
    const ids = Array.from(selectedIds)
    bulkDelete(ids)
      .then(() => { toast({ title: `${ids.length} откликов удалено`, variant: 'default' }); clearSelection() })
      .catch(() => toast({ title: 'Не удалось удалить выбранные', variant: 'error' }))
  }, [selectedIds, bulkDelete, toast, clearSelection])

  const handleBulkStatusChange = useCallback((status: ApplicationStatus) => {
    const ids = Array.from(selectedIds)
    bulkUpdateStatus(ids, status)
      .then(() => { toast({ title: `Статус изменён у ${ids.length} откликов`, variant: 'success' }); clearSelection() })
      .catch(() => toast({ title: 'Не удалось изменить статус', variant: 'error' }))
  }, [selectedIds, bulkUpdateStatus, toast, clearSelection])

  const handleExportCsv = useCallback(() => {
    exportApplicationsToCsv(filteredApps, `applytrack-${new Date().toISOString().split('T')[0]}.csv`)
    toast({ title: 'Экспорт завершён', description: `${filteredApps.length} откликов сохранено в CSV`, variant: 'success' })
  }, [filteredApps, toast])

  const currentDetailApp = detailApp
    ? (applications.find(a => a.id === detailApp.id) ?? detailApp)
    : null

  return (
    <TooltipProvider>
      <div className="relative min-h-screen">
        <AmbientBackground />

        <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-background-base/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent ds-shadow-accent">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-foreground leading-none tracking-tight">ApplyTrack</h1>
                <p className="text-xs text-foreground-muted leading-none mt-0.5 font-mono tracking-widest uppercase">Трекер</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {loading && <Loader2 className="h-4 w-4 text-foreground-muted animate-spin" />}
              <Button onClick={handleAdd} className="gap-1.5" size="sm" disabled={loading}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Добавить отклик</span>
                <span className="sm:hidden">Добавить</span>
              </Button>
              <UserMenu user={user} />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">
          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-1.5 text-red-200 hover:text-red-100 font-medium ds-transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Обновить
              </button>
            </div>
          )}

          {loading ? (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl border border-border bg-surface animate-pulse" />
                ))}
              </div>
              <div className="h-64 rounded-2xl border border-border bg-surface animate-pulse" />
            </div>
          ) : (
            <>
              <StatsCards
                stats={stats}
                showArchived={filters.showArchived}
                onToggleArchived={handleToggleArchived}
              />

              <RemindersPanel applications={applications} onSelect={handleView} />

              <SpotlightCard className="p-4 space-y-4" interactive={false}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Tabs value={view} onValueChange={v => setView(v as ViewMode)}>
                    <TabsList>
                      <TabsTrigger value="table" className="gap-1.5">
                        <Table2 className="h-3.5 w-3.5" />
                        Таблица
                      </TabsTrigger>
                      <TabsTrigger value="kanban" className="gap-1.5">
                        <Columns3 className="h-3.5 w-3.5" />
                        Канбан
                      </TabsTrigger>
                      <TabsTrigger value="analytics" className="gap-1.5">
                        <BarChart3 className="h-3.5 w-3.5" />
                        Аналитика
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {view !== 'analytics' && (
                    <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-1.5">
                      <Download className="h-3.5 w-3.5" />
                      Экспорт CSV
                    </Button>
                  )}
                </div>

                {view === 'analytics' ? (
                  <AnalyticsView applications={applications} />
                ) : (
                  <>
                    <FiltersBar
                      filters={filters}
                      onFiltersChange={setFilters}
                      totalShown={view === 'table' ? filteredApps.length : kanbanApps.length}
                      totalAll={totalForView}
                      availableTags={allTags}
                    />

                    {view === 'table' && (
                      <>
                        <BulkActionsBar
                          selectedCount={selectedIds.size}
                          onClear={clearSelection}
                          onArchive={handleBulkArchive}
                          onUnarchive={handleBulkUnarchive}
                          onDelete={handleBulkDelete}
                          onStatusChange={handleBulkStatusChange}
                          showUnarchive={filters.showArchived}
                        />

                        <ApplicationTable
                          userId={user.id}
                          applications={filteredApps}
                          sortField={sortField}
                          sortDirection={sortDirection}
                          onSort={handleSort}
                          onView={handleView}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onArchive={handleArchive}
                          onUnarchive={handleUnarchive}
                          onStatusChange={handleStatusChange}
                          selectedIds={selectedIds}
                          onToggleSelect={handleToggleSelect}
                          onToggleSelectAll={handleToggleSelectAll}
                        />
                      </>
                    )}

                    {view === 'kanban' && (
                      <KanbanBoard
                        applications={kanbanApps}
                        onCardClick={handleView}
                        onStatusChange={handleStatusChange}
                      />
                    )}
                  </>
                )}
              </SpotlightCard>
            </>
          )}
        </main>

        <ApplicationForm
          open={formOpen}
          onClose={() => { setFormOpen(false); setEditApp(null) }}
          onSave={handleSave}
          editData={editApp}
          allApplications={applications}
        />

        <ApplicationDetail
          application={currentDetailApp}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          onEdit={app => { setDetailOpen(false); handleEdit(app) }}
          onDelete={id => { handleDelete(id); setDetailOpen(false) }}
          onArchive={handleArchive}
          onUnarchive={handleUnarchive}
          onStatusChange={handleStatusChange}
        />
        </div>
      </div>
    </TooltipProvider>
  )
}
