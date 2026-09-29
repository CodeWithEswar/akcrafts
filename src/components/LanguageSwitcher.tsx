import CustomSelect from './CustomSelect'
import { useLanguage, type Language } from '../i18n'

const choices: { language: Language; label: string; short: string }[] = [
  { language: 'en', label: 'English', short: 'EN' },
  { language: 'te', label: 'తెలుగు — Telugu', short: 'తె' },
  { language: 'hi', label: 'हिन्दी — Hindi', short: 'हि' },
]

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()
  const selected = choices.find((choice) => choice.language === language)!
  return <div className="language-switcher"><CustomSelect id="site-language" label={t('Language')} value={selected.label} displayValue={selected.short} options={choices.map((choice) => choice.label)} compact onChange={(value) => setLanguage(choices.find((choice) => choice.label === value)?.language ?? 'en')} /></div>
}
