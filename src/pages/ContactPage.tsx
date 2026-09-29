import { useState } from 'react'
import Arrow from '../components/Arrow'
import CustomSelect from '../components/CustomSelect'
import { alternatePhone, instagramUrl, primaryPhone, sizes } from '../data'
import { InstagramIcon, PhoneIcon, WhatsAppIcon } from '../components/Icons'
import { useLanguage } from '../i18n'

export default function ContactPage() {
  const { t, language } = useLanguage()
  const [kind, setKind] = useState('Photo frame')
  const [size, setSize] = useState('Not sure yet')
  const [details, setDetails] = useState('')
  const kinds = ['Photo frame', 'Collage frame', 'Custom design', 'Invitation design']
  const availableSizes = ['Not sure yet', ...sizes.map((item) => `${item.label} inches`), 'Custom size']
  const displaySize = size.endsWith(' inches') ? `${size.slice(0, -7)} ${t('inches')}` : t(size)
  const message = language === 'te'
    ? `నమస్కారం AK Crafts Tenali, నాకు ${t(kind)} గురించి వివరాలు కావాలి.\nకావాల్సిన పరిమాణం: ${displaySize}.\n${details.trim() ? `నా ఆలోచన: ${details.trim()}` : 'వివరాలు మీతో చర్చించాలనుకుంటున్నాను.'}`
    : language === 'hi'
      ? `नमस्ते AK Crafts Tenali, मुझे ${t(kind)} के बारे में जानकारी चाहिए।\nपसंदीदा आकार: ${displaySize}.\n${details.trim() ? `मेरा विचार: ${details.trim()}` : 'मैं आपसे विवरण पर बात करना चाहता/चाहती हूँ।'}`
      : `Hi AK Crafts Tenali, I'd like to enquire about a ${kind.toLowerCase()}.\nPreferred size: ${size}.\n${details.trim() ? `My idea: ${details.trim()}` : 'I would like to discuss the details with you.'}`
  const whatsAppUrl = `https://wa.me/${primaryPhone}?text=${encodeURIComponent(message)}`

  return <div className="inner-page contact-page">
    <section className="page-hero page-hero-editorial page-gutter"><div><span className="eyebrow dark-eyebrow">{t("CONTACT / 04")}</span><h1>{t("Let’s make")}<br /><em>{t("it yours.")}</em></h1></div><p>{t("Tell us about your photographs and the piece you have in mind. We’ll take it from there together.")}</p></section>
    <section className="contact-builder section-pad"><div className="page-gutter"><div className="inner-section-heading light"><span className="eyebrow">{t("START A CONVERSATION")}</span><h2>{t("Your idea starts")} <em>{t("here.")}</em></h2><p>{t("Choose a few details and we’ll prepare a WhatsApp message for you. You can review it before sending.")}</p></div><div className="contact-builder-grid"><div className="builder-form"><CustomSelect id="kind" label={t('WHAT WOULD YOU LIKE TO MAKE?')} value={t(kind)} options={kinds.map(t)} onChange={(chosen) => setKind(kinds.find((item) => t(item) === chosen) ?? kinds[0])} /><CustomSelect id="frame-size" label={t('PREFERRED SIZE')} value={displaySize} options={availableSizes.map((item) => item.endsWith(' inches') ? `${item.slice(0, -7)} ${t('inches')}` : t(item))} onChange={(chosen) => setSize(availableSizes.find((item) => (item.endsWith(' inches') ? `${item.slice(0, -7)} ${t('inches')}` : t(item)) === chosen) ?? availableSizes[0])} /><div className="field-group"><label htmlFor="idea">{t("TELL US A LITTLE ABOUT YOUR IDEA")} <span>{t("OPTIONAL")}</span></label><textarea id="idea" rows={5} maxLength={500} placeholder={t('A special occasion, the photos you have, or where the frame will live...')} value={details} onChange={(event) => setDetails(event.target.value)} /><small>{details.length} / 500</small></div><a className="button button-cream" href={whatsAppUrl} target="_blank" rel="noopener noreferrer">{t("Continue on WhatsApp")} <Arrow diagonal /></a><p className="builder-note">{t("This opens WhatsApp with your message ready to review. Nothing is sent from this website.")}</p></div><div className="builder-preview"><span>{t("YOUR MESSAGE PREVIEW")}</span><div className="message-paper"><div className="message-avatar">AK</div><strong>AK Crafts Tenali</strong><p>{message}</p></div><div className="builder-preview-photo"><img src="/images/wedding-hands.jpg" alt={t('Couple holding hands')} /></div></div></div></div></section>
    <section className="contact-options section-pad page-gutter"><div className="inner-section-heading"><span className="eyebrow dark-eyebrow">{t("OTHER WAYS TO CONNECT")}</span><h2>{t("Meet us where")}<br /><em>{t("you are.")}</em></h2></div><div className="contact-option-list"><a href={`https://wa.me/${primaryPhone}`} target="_blank" rel="noopener noreferrer"><span className="contact-option-label"><WhatsAppIcon size={14} /> 01 / WHATSAPP</span><strong>7601012179</strong><Arrow diagonal /></a><a href={`https://wa.me/${alternatePhone}`} target="_blank" rel="noopener noreferrer"><span className="contact-option-label"><PhoneIcon size={14} /> 02 / {t('ALTERNATE NUMBER')}</span><strong>8790411671</strong><Arrow diagonal /></a><a href={instagramUrl} target="_blank" rel="noopener noreferrer"><span className="contact-option-label"><InstagramIcon size={14} /> 03 / INSTAGRAM</span><strong>@ak_crafts_tenali</strong><Arrow diagonal /></a></div></section>
    <section className="contact-prep section-pad"><div className="page-gutter"><div><span className="eyebrow dark-eyebrow">{t("A LITTLE HEAD START")}</span><h2>{t("What to have")}<br /><em>{t("ready.")}</em></h2></div><div className="prep-grid"><article><span>01</span><h3>{t("Your photographs")}</h3><p>{t("Choose the image or collection of images you’d like to keep close.")}</p></article><article><span>02</span><h3>{t("A place in mind")}</h3><p>{t("A desk, shelf, or wall can help you decide on the size and orientation.")}</p></article><article><span>03</span><h3>{t("Your preferences")}</h3><p>{t("Share any layout, finish, or style references you love. We’ll discuss the details.")}</p></article></div></div></section>
  </div>
}
