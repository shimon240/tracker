import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import type { Application, ApplicationStatus } from '@/types'
import { STATUSES } from '@/hooks/useApplications'
import { KanbanColumn } from '@/components/kanban/KanbanColumn'
import { KanbanCard } from '@/components/kanban/KanbanCard'

interface KanbanBoardProps {
  applications: Application[]
  onCardClick: (app: Application) => void
  onStatusChange: (id: string, status: ApplicationStatus) => void
}

export function KanbanBoard({ applications, onCardClick, onStatusChange }: KanbanBoardProps) {
  const [activeApp, setActiveApp] = useState<Application | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  )

  function handleDragStart(event: DragStartEvent) {
    const app = event.active.data.current?.application as Application | undefined
    setActiveApp(app ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveApp(null)
    const { active, over } = event
    if (!over) return
    const newStatus = over.id as ApplicationStatus
    const app = active.data.current?.application as Application | undefined
    if (app && app.status !== newStatus) {
      onStatusChange(app.id, newStatus)
    }
  }

  const grouped = STATUSES.reduce<Record<ApplicationStatus, Application[]>>((acc, status) => {
    acc[status] = applications.filter(a => a.status === status)
    return acc
  }, {} as Record<ApplicationStatus, Application[]>)

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {STATUSES.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            applications={grouped[status]}
            onCardClick={onCardClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApp && (
          <div className="w-72 rotate-1">
            <KanbanCard application={activeApp} onClick={() => {}} dragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
