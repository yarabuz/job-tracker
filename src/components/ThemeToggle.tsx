import { useTranslation } from 'react-i18next'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { ThemeSetting } from '../store/types'

const options: { key: ThemeSetting; icon: typeof Sun }[] = [
  { key: 'light', icon: Sun },
  { key: 'system', icon: Monitor },
  { key: 'dark', icon: Moon },
]

export default function ThemeToggle() {
  const { t } = useTranslation()
  const theme = useStore((s) => s.theme)
  const setTheme = useStore((s) => s.setTheme)

  return (
    <div
      className="flex rounded-lg bg-slate-800 p-0.5"
      role="group"
      aria-label={t('theme.label')}
    >
      {options.map(({ key, icon: Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => setTheme(key)}
          title={t(`theme.${key}`)}
          aria-label={t(`theme.${key}`)}
          className={`rounded-md p-1.5 transition-colors ${
            theme === key
              ? 'bg-slate-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}

export function LanguageToggle({ dark }: { dark?: boolean }) {
  const { t } = useTranslation()
  const lang = useStore((s) => s.lang)
  const setLang = useStore((s) => s.setLang)

  return (
    <div
      className={`flex rounded-lg p-0.5 ${dark ? 'bg-slate-800' : 'bg-slate-200'}`}
      role="group"
      aria-label={t('lang.label')}
    >
      {(['es', 'en'] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-label={t(`lang.${code}`)}
          className={`rounded-md px-2 py-1 text-xs font-semibold uppercase transition-colors ${
            lang === code
              ? dark
                ? 'bg-slate-600 text-white'
                : 'bg-white text-slate-900 shadow-sm'
              : dark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
