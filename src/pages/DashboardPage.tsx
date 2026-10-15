import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'

export default function DashboardPage() {
  const { t } = useTranslation()
  return (
    <div>
      <PageHeader
        title={t('pages.dashboard.title')}
        subtitle={t('pages.dashboard.subtitle')}
      />
      <p className="text-sm text-slate-500">{t('common.comingSoon')}</p>
    </div>
  )
}
