import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'

export default function PerfilPage() {
  const { t } = useTranslation()
  return (
    <div>
      <PageHeader
        title={t('pages.perfil.title')}
        subtitle={t('pages.perfil.subtitle')}
      />
      <p className="text-sm text-slate-500">{t('common.comingSoon')}</p>
    </div>
  )
}
