import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Arrow from './components/Arrow'
import AppLogo from './components/AppLogo'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import LanguageSwitcher from './components/LanguageSwitcher'
import { generalInquiry, sizeInquiry, useLanguage } from './i18n'
import { alternatePhone, primaryPhone, sizes } from './data'
import { InstagramIcon, PhoneIcon, WhatsAppIcon } from './components/Icons'
import StoryPage from './pages/StoryPage'
import PossibilitiesPage from './pages/PossibilitiesPage'
import SizesPage from './pages/SizesPage'
import ContactPage from './pages/ContactPage'

const FrameScene = lazy(() => import('./FrameScene'))

function App() {
  const { t, language } = useLanguage()
  const { pathname } = useLocation()
  const [selectedSize, setSelectedSize] = useState(4)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const size = sizes[selectedSize]

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' })
    revealItems.forEach((item) => revealObserver.observe(item))

    let ticking = false
    const updateScroll = () => {
      const y = window.scrollY
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      document.documentElement.style.setProperty('--page-progress', `${y / max * 100}%`)
      document.documentElement.style.setProperty('--parallax-y', `${Math.min(y * 0.16, 210)}px`)
      setScrolled(y > 40)
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll)
        ticking = true
      }
    }
    updateScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      revealObserver.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [pathname])

  useEffect(() => {
    window.scrollTo(0, 0)
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': `AK Crafts Tenali — ${t('made tangible.')}`,
      '/story': `${t('Our story')} — AK Crafts Tenali`,
      '/possibilities': `${t('The possibilities')} — AK Crafts Tenali`,
      '/sizes': `${t('Sizes & prices')} — AK Crafts Tenali`,
      '/contact': `${t('Contact')} — AK Crafts Tenali`,
    }
    document.title = titles[pathname] ?? 'AK Crafts Tenali'
  }, [pathname, language])

  const closeMenu = () => setMenuOpen(false)

  return <>
    <div className="progress-line" aria-hidden="true" />
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${pathname !== '/' ? 'is-inner' : ''}`}>
      <div className="header-inner page-gutter">
        <AppLogo light onClick={closeMenu} />
        <nav className={`desktop-nav ${menuOpen ? 'is-open' : ''}`} aria-label={t('Main navigation')}>
          <NavLink to="/story" onClick={closeMenu}>{t("Our story")}</NavLink>
          <NavLink to="/possibilities" onClick={closeMenu}>{t("The possibilities")}</NavLink>
          <NavLink to="/sizes" onClick={closeMenu}>{t("Sizes & prices")}</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>{t("Contact")}</NavLink>
        </nav>
        <LanguageSwitcher />
        <Link className="header-cta" to="/contact" onClick={closeMenu}>{t("Start your frame")} <Arrow diagonal /></Link>
        <button className={`menu-button ${menuOpen ? 'is-open' : ''}`} type="button" aria-label={t(menuOpen ? 'Close menu' : 'Open menu')} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      </div>
    </header>

    <main id="top" key={pathname}>
      {pathname === '/' ? <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-noise" aria-hidden="true" />
        <div className="hero-content page-gutter">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> {t("Personal frames · crafted in Tenali")}</div>
            <h1 id="hero-title">{t("Moments,")}<br /><em>{t("made tangible.")}</em></h1>
            <p className="hero-intro">{t("For the memories that deserve more than a camera roll. Thoughtfully made frames, shaped around your story.")}</p>
            <div className="hero-actions">
              <Link className="button button-cream" to="/contact">{t("Create your frame")} <Arrow diagonal /></Link>
              <a className="text-link text-link-light" href="#story">{t("Explore the craft")} <span>↓</span></a>
            </div>
          </div>
          <div className="hero-visual">
            <Suspense fallback={<div className="frame-scene" aria-label={t('Photo frame arrangement')}><div className="frame-scene-fallback" aria-hidden="true"><div className="fallback-frame fallback-frame-back"><img src="/images/wedding-hands.jpg" alt="" /></div><div className="fallback-frame fallback-frame-front"><img src="/images/family-sunset.jpg" alt="" /></div></div></div>}><FrameScene /></Suspense>
            <div className="hero-visual-caption"><span>{t("01 / A moment, kept close")}</span><span>{t("Move to explore")}</span></div>
          </div>
        </div>
        <div className="hero-bottom page-gutter"><span>AK CRAFTS / TENALI</span><span>{t("SCROLL TO EXPLORE")} <b>↓</b></span><span>{t("YOUR MEMORIES, OUR FRAMES")}</span></div>
      </section>

      <section className="intro-section section-pad" id="story">
        <div className="intro-grid page-gutter">
          <div className="section-index" data-reveal><span>{t("01 / THE STORY")}</span><i /></div>
          <div className="intro-main" data-reveal>
            <p className="intro-statement">{t("A photograph catches a second.")} <em>{t("A frame gives it a place to live.")}</em></p>
            <div className="intro-bottom"><p>{t("We believe the moments closest to you should be part of the spaces you call home. From a single portrait to a collage of everything in between, we make each piece feel personal.")}</p><Link className="round-arrow" to="/story" aria-label={t('Read our story')}><Arrow diagonal /></Link></div>
          </div>
        </div>
      </section>

      <section className="feature-section" aria-labelledby="feature-title">
        <div className="feature-image-wrap"><img className="feature-image" src="/images/wedding-hands.jpg" alt="A couple holding hands at their wedding" loading="lazy" /></div>
        <div className="feature-side page-gutter">
          <div className="feature-kicker" data-reveal><span>{t("THE THINGS WE HOLD ONTO")}</span><span>02 / 05</span></div>
          <div className="feature-text" data-reveal><h2 id="feature-title">{t("Some moments")}<br />{t("ask to be")} <em>{t("kept.")}</em></h2><p>{t("The glance. The gathering. The everyday kind of magic. Made to be seen, felt, and remembered all over again.")}</p><Link className="text-link" to="/possibilities">{t("See the possibilities")} <Arrow diagonal /></Link></div>
        </div>
      </section>

      <section className="possibilities-section section-pad" id="possibilities">
        <div className="section-heading page-gutter" data-reveal><div><span className="eyebrow dark-eyebrow">{t("02 / THE POSSIBILITIES")}</span><h2>{t("For every story")}<br /><em>{t("worth telling.")}</em></h2></div><p>{t("One photo or many, simple or expressive. Find a starting point, then make it entirely yours.")}</p></div>
        <div className="possibilities-grid page-gutter">
          <article className="possibility-card possibility-large" data-reveal><div className="possibility-image"><img src="/images/family-sunset.jpg" alt="Family gathered together by the sea at sunset" loading="lazy" /></div><div className="possibility-meta"><div><span>{t("01 / THE GATHERING")}</span><h3>{t("All of us, in one place.")}</h3></div><Arrow diagonal /></div></article>
          <article className="possibility-card possibility-small" data-reveal><div className="possibility-image"><img src="/images/ak-demo-collage.jpg" alt="AK Crafts Tenali sample collage frame with multiple portraits" loading="lazy" /></div><div className="possibility-meta"><div><span>{t("02 / THE COLLAGE · AK CRAFTS SAMPLE")}</span><h3>{t("Many moments. One story.")}</h3></div><Arrow diagonal /></div></article>
          <article className="possibility-card possibility-wide" data-reveal><div className="possibility-image"><img src="/images/friends.jpg" alt="Friends sitting together with arms around each other" loading="lazy" /></div><div className="possibility-meta"><div><span>{t("03 / THE PEOPLE")}</span><h3>{t("The ones who make it yours.")}</h3></div><Arrow diagonal /></div></article>
        </div>
        <p className="image-disclaimer page-gutter">{t("Lifestyle photographs illustrate framing possibilities. The collage is a sample from AK Crafts Tenali.")}</p>
        <div className="home-deep-link page-gutter"><Link className="text-link" to="/possibilities">{t("Explore more possibilities")} <Arrow diagonal /></Link></div>
      </section>

      <section className="marquee-section" aria-label="Brand statement"><div className="marquee-track" aria-hidden="true"><span>{t("MADE FOR THE MOMENTS THAT MATTER")} <i>✳</i> {t("MADE FOR THE MOMENTS THAT MATTER")} <i>✳</i></span><span>{t("MADE FOR THE MOMENTS THAT MATTER")} <i>✳</i> {t("MADE FOR THE MOMENTS THAT MATTER")} <i>✳</i></span></div></section>

      <section className="detail-section section-pad" id="craft">
        <div className="detail-grid page-gutter">
          <div className="detail-copy" data-reveal><span className="eyebrow dark-eyebrow">{t("03 / THE CRAFT")}</span><h2>{t("Beautifully simple.")}<br /><em>{t("Entirely personal.")}</em></h2><p>{t("Every frame begins with what matters to you. Send the photos you love, choose your size, and tell us how you imagine it. We’ll work with you on the details.")}</p><div className="detail-points"><span><b>01</b> {t("Your photographs")}</span><span><b>02</b> {t("Your preferred size")}</span><span><b>03</b> {t("Your story, framed")}</span></div></div>
          <div className="detail-visual" data-reveal><div className="detail-visual-inner"><div className="detail-picture"><img src="/images/wedding-hands.jpg" alt="Black and white wedding photograph within a minimal frame" loading="lazy" /></div></div><span className="detail-note">{t("THE ART OF KEEPING CLOSE")}</span></div>
        </div>
      </section>

      <section className="sizes-section section-pad" id="sizes">
        <div className="sizes-inner page-gutter">
          <div className="sizes-heading" data-reveal><span className="eyebrow">{t("04 / FIND YOUR FIT")}</span><h2>{t("Room for every")}<br /><em>{t("kind of memory.")}</em></h2><p>{t("Explore our standard frame sizes. Need something different? Ask us about a custom size.")}</p><Link className="text-link text-link-light" to="/sizes">{t("Open the full size guide")} <Arrow diagonal /></Link></div>
          <div className="size-experience" data-reveal>
            <div className="size-preview"><div className="size-preview-frame" style={{ transform: `translate(-50%, -50%) scale(${size.scale})` }}><img src="/images/family-sunset.jpg" alt="Preview of a framed family photograph" /></div><span className="size-preview-caption">{t("Frame preview · proportions illustrative")}</span></div>
            <div className="size-options"><div className="size-options-title"><span>{t("SELECT A SIZE")}</span><span>{t("INCHES")}</span></div><div className="size-button-grid">{sizes.map((option, index) => <button key={option.label} type="button" className={`size-button ${selectedSize === index ? 'is-active' : ''}`} onClick={() => setSelectedSize(index)} aria-pressed={selectedSize === index}>{option.label}</button>)}</div><div className="size-selected"><div><span>{t("STARTING AT")}</span><strong>₹{size.price.toLocaleString('en-IN')}</strong></div><span>{size.label} {t('inches')}</span></div><a className="button button-dark" href={`https://wa.me/917601012179?text=${encodeURIComponent(sizeInquiry(language, size.label))}`} target="_blank" rel="noopener noreferrer">{t("Ask about this size")} <Arrow diagonal /></a><a className="price-sheet-link" href="/images/ak-price-list.jpg" target="_blank" rel="noopener noreferrer">{t("View original price sheet")} <Arrow diagonal /></a></div>
          </div>
        </div>
      </section>

      <section className="contact-section section-pad" id="contact"><div className="contact-inner page-gutter"><div data-reveal><span className="eyebrow">{t("05 / LET'S MAKE SOMETHING")}</span><h2>{t("There’s a story")}<br /><em>{t("only you can tell.")}</em></h2></div><div className="contact-right" data-reveal><p>{t("Send us your photos, your idea, or simply a question. We’ll help you make a piece you’ll love coming home to.")}</p><Link className="contact-big-link" to="/contact"><span>{t("Let’s talk frames")}</span><Arrow diagonal /></Link><div className="contact-details"><a className="contact-detail-link" href={`https://wa.me/${primaryPhone}?text=${encodeURIComponent(generalInquiry(language))}`} target="_blank" rel="noopener noreferrer"><span className="contact-detail-icon"><WhatsAppIcon /></span><span className="contact-detail-text">WhatsApp · 7601012179</span></a><a className="contact-detail-link" href={`https://wa.me/${alternatePhone}?text=${encodeURIComponent(generalInquiry(language, true))}`} target="_blank" rel="noopener noreferrer"><span className="contact-detail-icon"><PhoneIcon /></span><span className="contact-detail-text">{t('Alternate')} · 8790411671</span></a><a className="contact-detail-link" href="https://instagram.com/ak_crafts_tenali" target="_blank" rel="noopener noreferrer"><span className="contact-detail-icon"><InstagramIcon /></span><span className="contact-detail-text">Instagram · @ak_crafts_tenali</span></a></div></div></div></section>
      </> : pathname === '/story' ? <StoryPage /> : pathname === '/possibilities' ? <PossibilitiesPage /> : pathname === '/sizes' ? <SizesPage /> : pathname === '/contact' ? <ContactPage /> : <div className="not-found page-gutter"><span className="eyebrow dark-eyebrow">{t("404 / PAGE NOT FOUND")}</span><h1>{t("That page isn’t here.")}</h1><Link className="button button-dark" to="/">{t("Return home")} <Arrow diagonal /></Link></div>}
    </main>

    <footer className="site-footer page-gutter"><div className="footer-top"><AppLogo light /><span>{t("Made with care in Tenali, Andhra Pradesh.")}</span><a href="#top">{t('Back to top')} ↑</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} AK Crafts Tenali. {t('All rights reserved.')}</span><span>{t("Additional lifestyle photography via")} <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash</a>.</span></div></footer>
    <FloatingWhatsApp />
  </>
}

export default App
