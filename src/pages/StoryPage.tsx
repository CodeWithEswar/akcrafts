import { useState } from 'react'
import { Link } from 'react-router-dom'
import Arrow from '../components/Arrow'
import { useLanguage } from '../i18n'

const chapters = [
  { number: '01', title: 'Choose the moment', image: '/images/family-sunset.jpg', alt: 'Family together by the sea', text: 'Start with the photograph you keep returning to. A portrait, a celebration, or an ordinary day that became unforgettable.' },
  { number: '02', title: 'Shape the piece', image: '/images/ak-demo-collage.jpg', alt: 'AK Crafts sample collage frame', text: 'Choose a size and share how you want the story told. A single image can speak quietly; a collage can bring a whole chapter together.' },
  { number: '03', title: 'Make it yours', image: '/images/wedding-hands.jpg', alt: 'Wedding photograph of two people holding hands', text: 'We discuss the layout and finishing details with you, then prepare a frame that feels at home in your space.' },
]

export default function StoryPage() {
  const { t } = useLanguage()
  const [chapter, setChapter] = useState(0)
  const active = chapters[chapter]
  return <div className="inner-page story-page">
    <section className="page-hero page-hero-split page-gutter">
      <div className="page-hero-copy"><span className="eyebrow">{t("OUR STORY / 01")}</span><h1>{t("Where memories")}<br /><em>{t("find a home.")}</em></h1><p>{t("AK Crafts Tenali began with a simple belief: the photographs that matter most should be lived with, not lost in a camera roll.")}</p><Link className="text-link" to="/possibilities">{t("Explore what’s possible")} <Arrow diagonal /></Link></div>
      <div className="page-hero-image story-hero-image"><img src="/images/family-sunset.jpg" alt="Family gathered together at sunset" /><span>{t("YOUR MEMORIES, OUR FRAMES")}</span></div>
    </section>
    <section className="story-manifesto section-pad page-gutter"><span className="eyebrow dark-eyebrow">{t("THE IDEA BEHIND THE FRAME")}</span><p>{t("We make space for")} <em>{t("what stays with you.")}</em></p><div><span>{t("For the people.")}</span><span>{t("For the places.")}</span><span>{t("For the feeling.")}</span></div></section>
    <section className="story-principles section-pad"><div className="page-gutter"><div className="inner-section-heading"><span className="eyebrow dark-eyebrow">{t("WHAT GUIDES US")}</span><h2>{t("Personal by design.")}</h2><p>{t("Every piece starts with the memory, and the person who wants to keep it close.")}</p></div><div className="principle-grid"><article><b>01 /</b><h3>{t("Your story first.")}</h3><p>{t("Share the photos and the idea behind them. We listen before deciding on the layout.")}</p></article><article><b>02 /</b><h3>{t("Made to fit.")}</h3><p>{t("Choose from our standard frame sizes or ask about a size that works for your wall.")}</p></article><article><b>03 /</b><h3>{t("Care in the details.")}</h3><p>{t("We discuss the arrangement and finish so the final piece feels considered and personal.")}</p></article></div></div></section>
    <section className="story-process section-pad"><div className="page-gutter"><div className="inner-section-heading light"><span className="eyebrow">{t("HOW A MEMORY BECOMES A PIECE")}</span><h2>{t("From a photograph")}<br />{t("to")} <em>{t("forever.")}</em></h2><p>{t("Select a step to see how a frame takes shape.")}</p></div><div className="story-process-grid"><div className="process-tabs" role="tablist" aria-label={t('Framing process')}>{chapters.map((item, index) => <button key={item.number} type="button" role="tab" id={`process-tab-${index}`} aria-selected={chapter === index} aria-controls="process-panel" className={chapter === index ? 'active' : ''} onClick={() => setChapter(index)}><span>{item.number}</span><strong>{t(item.title)}</strong><Arrow diagonal /></button>)}</div><div className="process-panel" id="process-panel" role="tabpanel" aria-labelledby={`process-tab-${chapter}`}><div className="process-image"><img key={active.image} src={active.image} alt={t(active.alt)} /></div><div className="process-panel-copy"><span>{t('STEP')} {active.number} / 03</span><p>{t(active.text)}</p></div></div></div></div></section>
    <section className="page-end-cta page-gutter"><span className="eyebrow dark-eyebrow">{t("MAKE IT PERSONAL")}</span><h2>{t("Ready to frame")}<br /><em>{t("your story?")}</em></h2><Link className="round-arrow" to="/contact" aria-label="Go to contact page"><Arrow diagonal /></Link></section>
  </div>
}
