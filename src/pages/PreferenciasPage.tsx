import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'

export default function PreferenciasPage() {
  const { t } = useTranslation()
  return (
    <div>
      <PageHeader
        title={t('pages.preferencias.title')}
        subtitle={t('pages.preferencias.subtitle')}
      />
      <p className="text-sm text-slate-500">{t('common.comingSoon')}</p>
    </div>
  )
}
