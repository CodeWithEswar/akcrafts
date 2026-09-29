import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { translations } from './translations'

export type Language = 'en' | 'te' | 'hi'
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (text: string) => string }
const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = window.localStorage.getItem('ak-crafts-language')
      return saved === 'te' || saved === 'hi' ? saved : 'en'
    } catch { return 'en' }
  })
  useEffect(() => {
    document.documentElement.lang = language
    try { window.localStorage.setItem('ak-crafts-language', language) } catch { /* Private browsing can disable storage. */ }
  }, [language])
  useEffect(() => {
    const syncLanguage = (event: StorageEvent) => {
      if (event.key === 'ak-crafts-language' && (event.newValue === 'en' || event.newValue === 'te' || event.newValue === 'hi')) setLanguage(event.newValue)
    }
    window.addEventListener('storage', syncLanguage)
    return () => window.removeEventListener('storage', syncLanguage)
  }, [])
  const t = (text: string) => language === 'en' ? text : translations[text]?.[language] || text
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}

export function sizeInquiry(language: Language, label: string) {
  if (language === 'te') return `నమస్కారం AK Crafts Tenali, ${label} అంగుళాల ఫోటో ఫ్రేమ్ గురించి వివరాలు తెలుసుకోవాలనుకుంటున్నాను.`
  if (language === 'hi') return `नमस्ते AK Crafts Tenali, मैं ${label} इंच के फ़ोटो फ़्रेम के बारे में पूछना चाहता/चाहती हूँ।`
  return `Hi AK Crafts Tenali, I'd like to ask about a ${label} inch photo frame.`
}

export function generalInquiry(language: Language, alternate = false) {
  if (language === 'te') return 'నమస్కారం AK Crafts Tenali, నాకు ప్రత్యేక ఫోటో ఫ్రేమ్ గురించి మాట్లాడాలి.'
  if (language === 'hi') return 'नमस्ते AK Crafts Tenali, मैं एक कस्टम फ़ोटो फ़्रेम के बारे में बात करना चाहता/चाहती हूँ।'
  return alternate ? "Hi AK Crafts Tenali, I'd like to ask about a custom frame." : "Hi AK Crafts Tenali, I'd like to make a custom frame."
}
