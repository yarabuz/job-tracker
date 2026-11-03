import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Trash2, X } from 'lucide-react'
import type { Quote } from '../../store/types'

export interface QuoteFormValues {
  quote: string
  author?: string
}

export default function QuoteFormModal({
  initial,
  onSubmit,
  onClose,
  onDelete,
}: {
  initial?: Quote
  onSubmit: (values: QuoteFormValues) => void
  onClose: () => void
  onDelete?: () => void
}) {
  const { t } = useTranslation()
  const [quote, setQuote] = useState((initial?.quote ?? ''))
  const [author, setAuthor] = useState(initial?.author ?? '')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const valid = quote.trim() !== ''

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({quote, valid})
    if (!valid) return
    onSubmit({
      quote,
      author: author.trim() || undefined,
    })
  }

  const inputCls =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400'
  const labelCls = 'block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 dark:bg-black/60"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {initial ? t('quotes.form.editTitle') : t('quotes.form.newTitle')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            aria-label={t('common.close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className={labelCls} htmlFor="quote-text">
              {t('quotes.form.quote')}
            </label>
            <textarea
              id="quote-text"
              className={inputCls}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="quote-author">
              {t('quotes.form.author')}
            </label>
            <input
              id="quote-author"
              placeholder={t('quotes.form.defaultAuthor')}
              className={inputCls}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            <div>
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('common.delete')}
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={!valid}
                className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
