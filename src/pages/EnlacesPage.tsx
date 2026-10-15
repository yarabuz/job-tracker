import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'

export default function EnlacesPage() {
  const { t } = useTranslation()
  return (
    <div>
      <PageHeader
        title={t('pages.enlaces.title')}
        subtitle={t('pages.enlaces.subtitle')}
      />
      <p className="text-sm text-slate-500">{t('common.comingSoon')}</p>
    </div>
  )
}
