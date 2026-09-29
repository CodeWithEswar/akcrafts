import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'

type Props = {
  id: string
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  compact?: boolean
  displayValue?: string
}

export default function CustomSelect({ id, label, value, options, onChange, compact = false, displayValue }: Props) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(Math.max(options.indexOf(value), 0))
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false)
    }
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        root.current?.querySelector('button')?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onEscape)
    }
  }, [open])

  const select = (index: number) => {
    onChange(options[index])
    setActive(index)
    setOpen(false)
    root.current?.querySelector('button')?.focus()
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        setActive(Math.max(options.indexOf(value), 0))
        setOpen(true)
      } else {
        setActive((current) => (current + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length)
      }
    } else if (event.key === 'Home' && open) {
      event.preventDefault()
      setActive(0)
    } else if (event.key === 'End' && open) {
      event.preventDefault()
      setActive(options.length - 1)
    } else if ((event.key === 'Enter' || event.key === ' ') && open) {
      event.preventDefault()
      select(active)
    }
  }

  return <div className={`field-group custom-select ${compact ? 'custom-select-compact' : ''} ${open ? 'is-open' : ''}`} ref={root} onKeyDown={onKeyDown} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false) }}>
    <span className="custom-select-label" id={`${id}-label`}>{label}</span>
    <button type="button" className="custom-select-trigger" role="combobox" aria-label={`${label}: ${value}`} aria-expanded={open} aria-controls={open ? `${id}-options` : undefined} aria-activedescendant={open ? `${id}-option-${active}` : undefined} onClick={() => { setActive(Math.max(options.indexOf(value), 0)); setOpen(!open) }}>{compact && <svg className="custom-select-globe" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" /><path d="M3.5 12h17M12 3c-2.4 2.7-3.6 5.7-3.6 9s1.2 6.3 3.6 9c2.4-2.7 3.6-5.7 3.6-9S14.4 5.7 12 3Z" stroke="currentColor" strokeWidth="1.4" /></svg>}<span>{displayValue ?? value}</span><svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="m4 7 5 5 5-5" stroke="currentColor" strokeWidth="1.5" /></svg></button>
    {open && <div className="custom-select-options" id={`${id}-options`} role="listbox" aria-labelledby={`${id}-label`}>{options.map((option, index) => <button id={`${id}-option-${index}`} type="button" tabIndex={-1} role="option" aria-selected={option === value} className={`${option === value ? 'selected' : ''} ${index === active ? 'highlighted' : ''}`} key={option} onMouseEnter={() => setActive(index)} onClick={() => select(index)}><span>{option}</span>{option === value && <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.5" /></svg>}</button>)}</div>}
  </div>
}
