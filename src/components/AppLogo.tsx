import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'

type Props = { light?: boolean; onClick?: () => void; compact?: boolean }

export default function AppLogo({ light = false, onClick, compact = false }: Props) {
  const { t } = useLanguage()
  return <Link to="/" onClick={onClick} className={`app-logo ${light ? 'app-logo-light' : ''} ${compact ? 'app-logo-compact' : ''}`} aria-label={t('AK Crafts Tenali, home')}>
    <svg className="app-logo-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path className="logo-corner" d="M2.5 17V2.5H17M31 2.5h14.5V17M45.5 31v14.5H31M17 45.5H2.5V31" stroke="currentColor" strokeWidth="1.2" />
      <path d="m8 34 8-20h3l8 20m-16-6h13" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
      <path d="M29 14v20m0-9 11-11m-9 9 10 11" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      <path className="logo-accent" d="M5 39h12" stroke="#ad9871" strokeWidth="1.5" />
    </svg>
    {!compact && <span className="app-logo-type"><strong>AK CRAFTS</strong><small>TENALI <i /> {t("PERSONAL FRAMES")}</small></span>}
  </Link>
}
