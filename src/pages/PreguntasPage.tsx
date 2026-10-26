import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useStore } from '../store/useStore'
import type { Question, QuestionCategory } from '../store/types'
import CategoryFormModal from '../features/preguntas/CategoryFormModal'
import QuestionFormModal, {
  type QuestionFormValues,
} from '../features/preguntas/QuestionFormModal'
import SortableCategoryItem from '../features/preguntas/SortableCategoryItem'
import SortableQuestionRow from '../features/preguntas/SortableQuestionRow'

type CategoryModal =
  | { mode: 'new' }
  | { mode: 'edit'; category: QuestionCategory }
  | null

type QuestionModal =
  | { mode: 'new' }
  | { mode: 'edit'; question: Question }
  | null

export default function PreguntasPage() {
  const { t } = useTranslation()
  const categories = useStore((s) => s.questionCategories)
  const questions = useStore((s) => s.questions)
  const addQuestionCategory = useStore((s) => s.addQuestionCategory)
  const updateQuestionCategory = useStore((s) => s.updateQuestionCategory)
  const deleteQuestionCategory = useStore((s) => s.deleteQuestionCategory)
  const addQuestion = useStore((s) => s.addQuestion)
  const updateQuestion = useStore((s) => s.updateQuestion)
  const deleteQuestion = useStore((s) => s.deleteQuestion)
  const reorderQuestionCategories = useStore((s) => s.reorderQuestionCategories)
  const reorderQuestions = useStore((s) => s.reorderQuestions)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [categoryModal, setCategoryModal] = useState<CategoryModal>(null)
  const [questionModal, setQuestionModal] = useState<QuestionModal>(null)

  const selected =
    categories.find((c) => c.id === selectedId) ?? categories[0] ?? null

  const categoryQuestions = useMemo(
    () => questions.filter((q) => q.categoryId === selected?.id),
    [questions, selected],
  )

  const countByCategory = useMemo(() => {
    const map = new Map<string, number>()
    questions.forEach((q) => map.set(q.categoryId, (map.get(q.categoryId) ?? 0) + 1))
    return map
  }, [questions])

  const handleCategorySubmit = (name: string) => {
    if (categoryModal?.mode === 'edit') {
      updateQuestionCategory(categoryModal.category.id, name)
    } else {
      const cat = addQuestionCategory({ name })
      setSelectedId(cat.id)
    }
    setCategoryModal(null)
  }

  const handleCategoryDelete = () => {
    if (categoryModal?.mode !== 'edit') return
    const count = countByCategory.get(categoryModal.category.id) ?? 0
    const msg =
      count > 0
        ? t('preguntas.category.confirmDeleteWithQuestions', { count })
        : t('preguntas.category.confirmDelete')
    if (!window.confirm(msg)) return
    deleteQuestionCategory(categoryModal.category.id)
    setCategoryModal(null)
  }

  const handleQuestionSubmit = (values: QuestionFormValues) => {
    if (!selected) return
    if (questionModal?.mode === 'edit') {
      updateQuestion(questionModal.question.id, values)
    } else {
      addQuestion({ ...values, categoryId: selected.id })
    }
    setQuestionModal(null)
  }

  const handleQuestionDelete = () => {
    if (questionModal?.mode !== 'edit') return
    if (!window.confirm(t('preguntas.question.confirmDelete'))) return
    deleteQuestion(questionModal.question.id)
    setQuestionModal(null)
  }

  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    reorderQuestionCategories(String(active.id), String(over.id))
  }

  const handleQuestionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id || !selected) return
    reorderQuestions(selected.id, String(active.id), String(over.id))
  }

  return (
    <div>
      <PageHeader
        title={t('pages.preguntas.title')}
        subtitle={t('pages.preguntas.subtitle')}
      />

      {categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('preguntas.emptyCategories')}
          </p>
          <button
            type="button"
            onClick={() => setCategoryModal({ mode: 'new' })}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            <Plus className="h-4 w-4" />
            {t('preguntas.category.new')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          {/* Categorías */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t('preguntas.categories')}
              </h2>
              <button
                type="button"
                onClick={() => setCategoryModal({ mode: 'new' })}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                aria-label={t('preguntas.category.new')}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleCategoryDragEnd}
            >
              <SortableContext
                items={categories.map((c) => c.id)}
                strategy={verticalListStrategy}
              >
                <ul className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <SortableCategoryItem
                      key={cat.id}
                      category={cat}
                      count={countByCategory.get(cat.id) ?? 0}
                      active={selected?.id === cat.id}
                      onSelect={() => setSelectedId(cat.id)}
                      onEdit={() =>
                        setCategoryModal({ mode: 'edit', category: cat })
                      }
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
            {categories.length > 1 && (
              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                {t('preguntas.categoryDragHint')}
              </p>
            )}
          </div>

          {/* Preguntas */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {selected?.name}
              </h2>
              <button
                type="button"
                onClick={() => setQuestionModal({ mode: 'new' })}
                disabled={!selected}
                className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                {t('preguntas.question.new')}
              </button>
            </div>

            {categoryQuestions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                {t('preguntas.emptyQuestions')}
              </div>
            ) : (
              <>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleQuestionDragEnd}
                >
                  <SortableContext
                    items={categoryQuestions.map((q) => q.id)}
                    strategy={verticalListStrategy}
                  >
                    <div className="flex flex-col gap-2">
                      {categoryQuestions.map((q) => (
                        <SortableQuestionRow
                          key={q.id}
                          question={q}
                          onEdit={() => setQuestionModal({ mode: 'edit', question: q })}
                          onDelete={() => {
                            if (window.confirm(t('preguntas.question.confirmDelete'))) {
                              deleteQuestion(q.id)
                            }
                          }}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                {categoryQuestions.length > 1 && (
                  <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                    {t('preguntas.questionDragHint')}
                  </p>
                )}
              </>
            )}
            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
              {t('preguntas.reviewHint')}
            </p>
          </div>
        </div>
      )}

      {categoryModal && (
        <CategoryFormModal
          initialName={
            categoryModal.mode === 'edit' ? categoryModal.category.name : undefined
          }
          onSubmit={handleCategorySubmit}
          onClose={() => setCategoryModal(null)}
          onDelete={
            categoryModal.mode === 'edit' ? handleCategoryDelete : undefined
          }
        />
      )}

      {questionModal && selected && (
        <QuestionFormModal
          initial={questionModal.mode === 'edit' ? questionModal.question : undefined}
          onSubmit={handleQuestionSubmit}
          onClose={() => setQuestionModal(null)}
          onDelete={questionModal.mode === 'edit' ? handleQuestionDelete : undefined}
        />
      )}
    </div>
  )
}
