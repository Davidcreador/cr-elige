import { I18nProvider as BaseI18nProvider } from '../lib/i18n'
import type { ReactNode } from 'react'

export function I18nProvider({ children }: { children: ReactNode }) {
  return <BaseI18nProvider>{children}</BaseI18nProvider>
}
