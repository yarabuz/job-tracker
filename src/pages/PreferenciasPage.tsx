import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle, CheckCircle2, Download, Trash2, Upload } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useStore } from '../store/useStore'
import { downloadJson, parseImportedData } from '../lib/backup'

type Notice =
  | { kind: 'success' | 'error'; message: string }
  | null

function formatDate(iso: string | null, t: (k: string) => string): string {
  if (!iso) return t('pages.preferencias.export.never')
  return new Date(iso).toLocaleString('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function Card({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default function PreferenciasPage() {
  const { t } = useTranslation()
  const lastExportAt = useStore((s) => s.lastExportAt)
  const replaceAll = useStore((s) => s.replaceAll)
  const markExported = useStore((s) => s.markExported)
  const resetAll = useStore((s) => s.resetAll)
  const fileRef = useRef<HTMLInputElement>(null)
  const [notice, setNotice] = useState<Notice>(null)

  const handleExport = () => {
    markExported()
    const state = useStore.getState()
    downloadJson({
      schemaVersion: state.schemaVersion,
      processes: state.processes,
      events: state.events,
      skills: state.skills,
      links: state.links,
      lastExportAt: state.lastExportAt,
    })
    setNotice(null)
  }

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    const text = await file.text()
    const result = parseImportedData(text)
    if (!result.ok) {
      setNotice({
        kind: 'error',
        message: t(`pages.preferencias.import.errors.${result.error}`),
      })
      return
    }
    if (!window.confirm(t('pages.preferencias.import.confirm'))) {
      setNotice(null)
      return
    }
    replaceAll(result.data)
    setNotice({ kind: 'success', message: t('pages.preferencias.import.success') })
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleReset = () => {
    if (!window.confirm(t('pages.preferencias.reset.confirm1'))) return
    if (!window.confirm(t('pages.preferencias.reset.confirm2'))) return
    resetAll()
    setNotice({ kind: 'success', message: t('pages.preferencias.reset.success') })
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={t('pages.preferencias.title')}
        subtitle={t('pages.preferencias.subtitle')}
      />

      {notice && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
            notice.kind === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {notice.kind === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          {notice.message}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <Card
          title={t('pages.preferencias.export.title')}
          description={t('pages.preferencias.export.description')}
        >
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
            >
              <Download className="h-4 w-4" />
              {t('pages.preferencias.export.button')}
            </button>
            <span className="text-xs text-slate-500">
              {t('pages.preferencias.export.lastExport')}:{' '}
              {formatDate(lastExportAt, t)}
            </span>
          </div>
        </Card>

        <Card
          title={t('pages.preferencias.import.title')}
          description={t('pages.preferencias.import.description')}
        >
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Upload className="h-4 w-4" />
            {t('pages.preferencias.import.button')}
          </button>
        </Card>

        <Card
          title={t('pages.preferencias.reset.title')}
          description={t('pages.preferencias.reset.description')}
        >
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            {t('pages.preferencias.reset.button')}
          </button>
        </Card>
      </div>
    </div>
  )
}
