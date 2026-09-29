import { primaryPhone } from '../data'
import { generalInquiry, useLanguage } from '../i18n'

export default function FloatingWhatsApp() {
  const { t, language } = useLanguage()
  return <a className="floating-whatsapp" href={`https://wa.me/${primaryPhone}?text=${encodeURIComponent(generalInquiry(language))}`} target="_blank" rel="noopener noreferrer" aria-label={t('Chat with AK Crafts Tenali on WhatsApp')}><span className="floating-whatsapp-text">{t("Let’s chat")}</span><span className="floating-whatsapp-icon"><svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.02 3.2A12.76 12.76 0 0 0 4.94 22.3L3.2 28.8l6.66-1.7A12.8 12.8 0 1 0 16.02 3.2Zm0 23.3a10.45 10.45 0 0 1-5.33-1.45l-.38-.22-3.95 1.01 1.05-3.84-.25-.4a10.5 10.5 0 1 1 8.86 4.9Zm5.78-7.8c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.18.22-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.6-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.19.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.71-1.7-.97-2.33-.25-.61-.5-.53-.71-.54h-.6c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.64s1.14 3.07 1.3 3.28c.16.21 2.24 3.41 5.43 4.78.76.33 1.36.52 1.82.67.77.25 1.47.21 2.02.13.61-.09 1.88-.77 2.14-1.52.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z" /></svg></span></a>
}
