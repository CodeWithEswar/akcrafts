import { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router-dom'
import Arrow from '../components/Arrow'
import { primaryPhone, sizes } from '../data'
import { sizeInquiry, useLanguage } from '../i18n'

const FramePlacementScene = lazy(() => import('../FramePlacementScene'))

export default function SizesPage() {
  const { t, language } = useLanguage()
  const [selected, setSelected] = useState(4)
  const [view, setView] = useState<'wall' | 'shelf'>('wall')
  const [explore, setExplore] = useState(false)
  const [angle, setAngle] = useState({ yaw: 0, pitch: 0 })
  const size = sizes[selected]
  const message = encodeURIComponent(sizeInquiry(language, size.label))
  const rotate = (horizontal: number, vertical: number) => setAngle((current) => ({ yaw: current.yaw + horizontal, pitch: Math.max(-.38, Math.min(.38, current.pitch + vertical)) }))
  const chooseView = (placement: 'wall' | 'shelf') => { setView(placement); setExplore(false); setAngle({ yaw: 0, pitch: 0 }) }

  return <div className="inner-page sizes-page">
    <section className="page-hero page-hero-editorial page-gutter"><div><span className="eyebrow dark-eyebrow">{t("SIZES & PRICES / 03")}</span><h1>{t("The right size")}<br /><em>{t("for your story.")}</em></h1></div><p>{t("From a small memory for your desk to a statement for your wall, find the proportion that feels right.")}</p></section>
    <section className="size-guide section-pad"><div className="page-gutter">
      <div className="inner-section-heading light"><span className="eyebrow">{t("INTERACTIVE SIZE GUIDE")}</span><h2>{t("Picture it")} <em>{t("at home.")}</em></h2><p>{t("Choose a standard size to see an illustrative preview and its listed starting price.")}</p></div>
      <div className="guide-layout">
        <div className="guide-stage">
          <div className="guide-stage-wall">
            <Suspense fallback={<div className="placement-scene"><div className="placement-fallback"><div className="placement-fallback-frame"><img src="/images/family-sunset.jpg" alt="" /></div><div className="placement-fallback-shelf" /></div></div>}>
              <FramePlacementScene scale={size.scale} placement={view} explore={explore} rotation={angle.yaw} tilt={angle.pitch} onRotate={rotate} />
            </Suspense>
            {explore && <div className="guide-360-badge" aria-hidden="true">{t("360° VIEW")}</div>}
          </div>
          <div className="guide-stage-bottom">
            <span>{t("THREE-DIMENSIONAL PREVIEW · SCALE ILLUSTRATIVE")}</span>
            <div className="guide-view-controls">
              <div className="guide-placement-controls" role="group" aria-label={t('Preview placement')}>
                <button type="button" aria-pressed={view === 'wall' && !explore} className={view === 'wall' && !explore ? 'active' : ''} onClick={() => chooseView('wall')}>{t("On a wall")}</button>
                <button type="button" aria-pressed={view === 'shelf' && !explore} className={view === 'shelf' && !explore ? 'active' : ''} onClick={() => chooseView('shelf')}>{t("On a shelf")}</button>
              </div>
              <button type="button" className={explore ? 'active' : ''} aria-pressed={explore} onClick={() => { setExplore((value) => !value); setAngle({ yaw: 0, pitch: 0 }) }}>{t(explore ? 'Back to room' : 'Explore 360°')}</button>
            </div>
          </div>
          {explore && <div className="guide-rotate-tools"><span>{t("DRAG THE FRAME TO ROTATE")}</span><div role="group" aria-label={t('Frame rotation')}><button type="button" onClick={() => rotate(-Math.PI / 2, 0)} aria-label={t('Rotate frame left 90 degrees')}>↶ <span>{t("LEFT")}</span></button><button type="button" onClick={() => setAngle({ yaw: 0, pitch: 0 })}>{t("RESET VIEW")}</button><button type="button" onClick={() => rotate(Math.PI / 2, 0)} aria-label={t('Rotate frame right 90 degrees')}><span>{t("RIGHT")}</span> ↷</button></div></div>}
        </div>
        <div className="guide-panel"><div className="guide-panel-top"><span>{t("SELECT YOUR SIZE")}</span><span>{t("INCHES")}</span></div><div className="guide-size-list">{sizes.map((item, index) => <button key={item.label} type="button" aria-pressed={selected === index} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><strong>{item.label}</strong><span>₹{item.price.toLocaleString('en-IN')}</span></button>)}</div><div className="guide-selected"><span>{t("YOUR SELECTION")}</span><strong>{size.label} <small>{t("inches")}</small></strong><p>{t("Listed starting price")} <b>₹{size.price.toLocaleString('en-IN')}</b></p></div><a className="button button-cream" href={`https://wa.me/${primaryPhone}?text=${message}`} target="_blank" rel="noopener noreferrer">{t("Ask about this size")} <Arrow diagonal /></a></div>
      </div>
      <p className="guide-footnote">{t("The preview shows relative scale only. Final dimensions and finish are confirmed directly with AK Crafts.")} <a href="/images/ak-price-list.jpg" target="_blank" rel="noopener noreferrer">{t("View the original price sheet")} <Arrow diagonal /></a></p>
    </div></section>
    <section className="size-table-section section-pad page-gutter"><div className="inner-section-heading"><span className="eyebrow dark-eyebrow">{t("AT A GLANCE")}</span><h2>{t("A size for every space.")}</h2><p>{t("All sizes and prices below are taken from the supplied AK Crafts Tenali price list.")}</p></div><div className="size-table" role="table" aria-label={t('Frame sizes and starting prices')}><div className="size-table-head" role="row"><span role="columnheader">{t("SIZE")}</span><span role="columnheader">{t("STARTING PRICE")}</span><span role="columnheader">{t("ENQUIRE")}</span></div>{sizes.map((item) => <div className="size-table-row" role="row" key={item.label}><span role="cell">{item.label} <small>{t("inches")}</small></span><strong role="cell">₹{item.price.toLocaleString('en-IN')}</strong><a role="cell" href={`https://wa.me/${primaryPhone}?text=${encodeURIComponent(sizeInquiry(language, item.label))}`} target="_blank" rel="noopener noreferrer" aria-label={`${t('ENQUIRE')} ${item.label} ${t('inches')}`}><Arrow diagonal /></a></div>)}</div></section>
    <section className="size-faq section-pad"><div className="page-gutter"><div className="inner-section-heading"><span className="eyebrow dark-eyebrow">{t("GOOD TO KNOW")}</span><h2>{t("Questions before")}<br /><em>{t("you frame?")}</em></h2></div><div className="faq-list"><details><summary>{t("Can I ask for a custom size?")}<span>+</span></summary><p>{t("Yes. Tell us the dimensions you have in mind, and we’ll discuss what is possible for your photograph and space.")}</p></details><details><summary>{t("How do I choose the right size?")}<span>+</span></summary><p>{t("Think about where the frame will live and how far away you will view it. You can send us a photo of the wall or surface when you enquire.")}</p></details><details><summary>{t("Are prices final?")}<span>+</span></summary><p>{t("The figures shown are from the supplied price list. We confirm the final cost with you when the size, layout, and other details are agreed.")}</p></details><details><summary>{t("Can I make a collage?")}<span>+</span></summary><p>{t("Yes. Send the photographs you want included and share the kind of arrangement you like. We can discuss a layout that fits your chosen size.")}</p></details></div></div></section>
    <section className="page-end-cta page-gutter"><span className="eyebrow dark-eyebrow">{t("NEED A HAND?")}</span><h2>{t("Let’s find")}<br /><em>{t("your perfect fit.")}</em></h2><Link className="round-arrow" to="/contact" aria-label="Go to contact page"><Arrow diagonal /></Link></section>
  </div>
}
