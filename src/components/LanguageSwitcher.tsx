import { useLocale } from '../lib/i18n'
import { Button } from './ui/button'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()

  const toggleLanguage = () => {
    setLocale(locale === 'es' ? 'en' : 'es')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="font-medium"
    >
      {locale === 'es' ? 'English' : 'Español'}
    </Button>
  )
}
