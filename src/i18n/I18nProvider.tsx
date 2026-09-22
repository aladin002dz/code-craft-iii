import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { preferenceStore, useStore, type Locale } from '../state/stores'
import { uiCopy, type UiCopy } from './ui'

type I18nValue = {
  locale: Locale
  copy: UiCopy
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const preferences = useStore(preferenceStore)
  const locale = preferences.locale

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      copy: uiCopy[locale],
      setLocale(next) {
        preferenceStore.set({ ...preferenceStore.get(), locale: next })
      },
    }),
    [locale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside I18nProvider')
  return value
}
