import { useState } from 'react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import type { Process, Stage } from '../../store/types'
import { useStore } from '../../store/useStore'
import { STAGES } from './stages'
import KanbanColumn from './KanbanColumn'

export default function KanbanBoard({
  processes,
  onEdit,
}: {
  processes: Process[]
  onEdit: (p: Process) => void
}) {
  const updateProcess = useStore((s) => s.updateProcess)
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return
    const targetStage = over.id as Stage
    if (!STAGES.some((s) => s.key === targetStage)) return
    const proc = processes.find((p) => p.id === active.id)
    if (!proc || proc.stage === targetStage) return
    updateProcess(proc.id, { stage: targetStage })
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveId(String(e.active.id))}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage.key}
            stage={stage.key}
            processes={processes.filter((p) => p.stage === stage.key)}
            onEdit={onEdit}
          />
        ))}
      </div>
      {activeId && <div className="pointer-events-none fixed inset-0 z-0" />}
    </DndContext>
  )
}
