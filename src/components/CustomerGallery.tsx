import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { customerWork, type CustomerWork } from '../customerWork'
import { primaryPhone } from '../data'
import { sizeInquiry, useLanguage } from '../i18n'
import Arrow from './Arrow'
import '../customer-gallery.css'

const filters = ['All examples', 'Portraits', 'Creative designs'] as const

export default function CustomerGallery({ compact = false }: { compact?: boolean }) {
  const { t, language } = useLanguage()
  const [filter, setFilter] = useState<string>(filters[0])
  const [selected, setSelected] = useState<CustomerWork | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const visible = compact ? [customerWork[0], customerWork[7], customerWork[4]] : customerWork.filter((item) => filter === filters[0] || item.category === filter)
  const index = selected ? visible.findIndex((item) => item.id === selected.id) : -1

  useEffect(() => {
    const modal = dialog.current
    if (!selected || !modal) return
    modal.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      modal.close()
      document.body.style.overflow = previousOverflow
    }
  }, [Boolean(selected)])

  const move = (direction: number) => setSelected(visible[(index + direction + visible.length) % visible.length])

  return <section className={`customer-gallery section-pad ${compact ? 'gallery-compact' : ''}`} id={compact ? 'customer-preview' : 'customer-gallery'} aria-labelledby={compact ? 'customer-preview-title' : 'customer-gallery-title'}>
    <div className="page-gutter">
      <div className="gallery-heading">
        <div><span className="eyebrow dark-eyebrow">{t('THE CUSTOMER COLLECTION')}</span><h2 id={compact ? 'customer-preview-title' : 'customer-gallery-title'}>{t('Your ideas.')}<br /><em>{t('Beautifully framed.')}</em></h2></div>
        <div className="gallery-intro"><p>{t('Explore the frame examples shared with us. From personal portraits to expressive artwork, find an idea to make your own.')}</p>{compact && <Link className="text-link" to="/possibilities#customer-gallery">{t('Explore all eight examples')} <Arrow diagonal /></Link>}</div>
      </div>
      {!compact && <div className="gallery-toolbar"><div className="gallery-filters" role="group" aria-label={t('Filter frame examples')}>{filters.map((name) => <button key={name} type="button" className={filter === name ? 'active' : ''} aria-pressed={filter === name} onClick={() => setFilter(name)}>{t(name)}</button>)}</div><span className="gallery-count" role="status">{visible.length} / 8 {t('examples')}</span></div>}
      <div className="customer-grid">
        {visible.map((item, position) => <article className="customer-card" key={item.id}>
          <button type="button" className="customer-image" onClick={() => setSelected(item)} aria-label={`${t('View image')}: ${t(item.title)}`} aria-haspopup="dialog">
            <img src={`/images/customer/${item.file}-preview.jpg`} alt={`${t(item.title)} · ${item.dimensions} ${t('inches')}`} width={item.width} height={item.height} loading="lazy" decoding="async" />
            <span className="customer-zoom" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5" /></svg></span>
          </button>
          <div className="customer-card-meta"><div><span>{String(customerWork.indexOf(item) + 1).padStart(2, '0')} / {t(item.category)}</span><h3>{t(item.title)}</h3></div><span className="customer-size">{item.dimensions}<small>{t('inches')}</small></span></div>
          {compact && position === 1 && <span className="gallery-card-note">{t('A little inspiration for your next frame.')}</span>}
        </article>)}
      </div>
      <div className="gallery-footnote"><p>{t('Customer-supplied previews. Sizes shown follow the image labels; confirm final dimensions and finish with us.')}</p>{!compact && <Link className="text-link" to="/contact">{t('Make it your own')} <Arrow diagonal /></Link>}</div>
    </div>
    <dialog ref={dialog} className="gallery-dialog" aria-labelledby="gallery-dialog-title" onCancel={() => setSelected(null)} onClose={() => setSelected(null)} onClick={(event) => { if (event.target === event.currentTarget) setSelected(null) }} onKeyDown={(event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) } if (event.key === 'ArrowRight') { event.preventDefault(); move(1) } }}>
      {selected && <div className="gallery-dialog-content">
        <div className="gallery-dialog-bar"><span>{t('THE CUSTOMER COLLECTION')} <b>{index + 1} / {visible.length}</b></span><button type="button" className="gallery-close" onClick={() => setSelected(null)} aria-label={t('Close image')}>×</button></div>
        <div className="gallery-dialog-image"><img key={selected.id} src={`/images/customer/${selected.file}.png`} alt={`${t(selected.title)} · ${selected.dimensions} ${t('inches')}`} width={selected.width} height={selected.height} /><button type="button" className="gallery-prev" onClick={() => move(-1)} aria-label={t('Previous image')}>←</button><button type="button" className="gallery-next" onClick={() => move(1)} aria-label={t('Next image')}>→</button></div>
        <div className="gallery-dialog-footer"><div><span>{selected.dimensions} {t('inches')} · {t(selected.category)}</span><h3 id="gallery-dialog-title">{t(selected.title)}</h3></div><a className="button button-dark" href={`https://wa.me/${primaryPhone}?text=${encodeURIComponent(sizeInquiry(language, selected.sizeLabel))}`} target="_blank" rel="noopener noreferrer">{t('Ask about this size')} <Arrow diagonal /></a></div>
      </div>}
    </dialog>
  </section>
}
