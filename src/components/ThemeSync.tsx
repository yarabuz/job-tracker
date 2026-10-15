import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import i18n from '../i18n'

function applyTheme(theme: 'light' | 'dark' | 'system') {
  const prefersDark =
    theme === 'system' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.toggle('dark', theme === 'dark' || prefersDark)
}

export default function ThemeSync() {
  const theme = useStore((s) => s.theme)
  const lang = useStore((s) => s.lang)

  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  useEffect(() => {
    void i18n.changeLanguage(lang)
    document.documentElement.lang = lang
  }, [lang])

  return null
}
