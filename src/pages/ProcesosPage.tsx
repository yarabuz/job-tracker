import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'

export default function ProcesosPage() {
  const { t } = useTranslation()
  return (
    <div>
      <PageHeader
        title={t('pages.procesos.title')}
        subtitle={t('pages.procesos.subtitle')}
      />
      <p className="text-sm text-slate-500">{t('common.comingSoon')}</p>
    </div>
  )
}
