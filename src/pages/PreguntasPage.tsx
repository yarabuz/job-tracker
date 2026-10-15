import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'

export default function PreguntasPage() {
  const { t } = useTranslation()
  return (
    <div>
      <PageHeader
        title={t('pages.preguntas.title')}
        subtitle={t('pages.preguntas.subtitle')}
      />
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {t('common.comingSoon')}
      </p>
    </div>
  )
}
