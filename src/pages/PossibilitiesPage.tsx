import { useState } from 'react'
import { Link } from 'react-router-dom'
import Arrow from '../components/Arrow'
import CustomerGallery from '../components/CustomerGallery'
import { useLanguage } from '../i18n'

const photos = [
  { label: 'The gathering', image: '/images/family-sunset.jpg', alt: 'Family at sunset' },
  { label: 'The promise', image: '/images/wedding-hands.jpg', alt: 'Couple holding hands' },
  { label: 'The people', image: '/images/friends.jpg', alt: 'Friends sitting together' },
]
const finishes = [
  { label: 'Dark walnut', key: 'walnut' },
  { label: 'Gallery black', key: 'black' },
  { label: 'Warm bronze', key: 'bronze' },
]

export default function PossibilitiesPage() {
  const { t } = useLanguage()
  const [photo, setPhoto] = useState(0)
  const [finish, setFinish] = useState('walnut')
  const [mat, setMat] = useState<'warm' | 'white'>('warm')
  return <div className="inner-page possibilities-page">
    <section className="page-hero page-hero-editorial page-gutter"><div><span className="eyebrow dark-eyebrow">{t("THE POSSIBILITIES / 02")}</span><h1>{t("Make room for")}<br /><em>{t("your moments.")}</em></h1></div><p>{t("Different memories ask for different ways of being seen. These are starting points for a piece that belongs to you.")}</p></section>
    <section className="possibility-showcase page-gutter"><article className="showcase-item showcase-first"><img src="/images/family-sunset.jpg" alt="Family gathered by the sea" /><div><span>{t("01 / THE GATHERING")}</span><h2>{t("Everyone, all at once.")}</h2><p>{t("Bring the people you love into a shared space, even when life takes everyone somewhere new.")}</p></div></article><article className="showcase-item showcase-second"><img src="/images/ak-demo-collage.jpg" alt="AK Crafts Tenali sample collage frame" /><div><span>{t("02 / THE COLLAGE · AK CRAFTS SAMPLE")}</span><h2>{t("More than one moment.")}</h2><p>{t("A thoughtful arrangement for the photographs that belong together in one story.")}</p></div></article><article className="showcase-item showcase-third"><img src="/images/wedding-hands.jpg" alt="Couple holding hands at a wedding" /><div><span>{t("03 / THE MILESTONE")}</span><h2>{t("The day that changed everything.")}</h2><p>{t("Keep the feeling of a wedding, a celebration, or a new beginning where you can see it every day.")}</p></div></article><p className="showcase-note">{t("Lifestyle photographs are illustrative. The collage is an AK Crafts Tenali sample.")}</p></section>
    <CustomerGallery />
    <section className="frame-studio section-pad" id="frame-studio"><div className="page-gutter"><div className="inner-section-heading light"><span className="eyebrow">{t("THE FRAME STUDIO")}</span><h2>{t("See it")} <em>{t("your way.")}</em></h2><p>{t("Try a photograph, finish, and mat to explore how the same memory changes in a frame. This is a visual guide for your conversation with us.")}</p></div><div className="studio-grid"><div className="studio-stage"><div className={`studio-frame finish-${finish} mat-${mat}`}><img src={photos[photo].image} alt={`${t('Preview')}: ${t(photos[photo].alt)}`} /></div><span>{t("VISUAL PREVIEW · FINAL FINISHES MAY VARY")}</span></div><div className="studio-controls"><fieldset><legend>01 / {t('CHOOSE A PHOTOGRAPH')}</legend><div className="studio-photo-options">{photos.map((item, index) => <button type="button" key={item.label} className={photo === index ? 'selected' : ''} aria-pressed={photo === index} onClick={() => setPhoto(index)}><img src={item.image} alt="" /><span>{t(item.label)}</span></button>)}</div></fieldset><fieldset><legend>02 / {t('FRAME FINISH')}</legend><div className="studio-finish-options">{finishes.map((item) => <button type="button" key={item.key} className={finish === item.key ? 'selected' : ''} aria-pressed={finish === item.key} onClick={() => setFinish(item.key)}><i className={`finish-swatch ${item.key}`} />{t(item.label)}</button>)}</div></fieldset><fieldset><legend>03 / {t('MAT TONE')}</legend><div className="studio-mat-options"><button type="button" className={mat === 'warm' ? 'selected' : ''} aria-pressed={mat === 'warm'} onClick={() => setMat('warm')}>{t("Warm ivory")}</button><button type="button" className={mat === 'white' ? 'selected' : ''} aria-pressed={mat === 'white'} onClick={() => setMat('white')}>{t("Gallery white")}</button></div></fieldset><Link className="button button-cream" to="/contact">{t("Ask us about a frame")} <Arrow diagonal /></Link></div></div></div></section>
    <section className="page-end-cta page-gutter"><span className="eyebrow dark-eyebrow">{t("THE NEXT STEP")}</span><h2>{t("Find the size")}<br /><em>{t("that fits.")}</em></h2><Link className="round-arrow" to="/sizes" aria-label="Explore frame sizes"><Arrow diagonal /></Link></section>
  </div>
}
