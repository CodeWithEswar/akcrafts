export default function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return diagonal ? (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 16 16 4M6 4h10v10" stroke="currentColor" strokeWidth="1.5" /></svg>
  ) : (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2 10h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" /></svg>
  )
}
