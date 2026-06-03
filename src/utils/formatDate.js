const MONTHS_LONG = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
const MONTHS_SHORT = ['jan','fév','mars','avr','mai','juin','juil','août','sep','oct','nov','déc']

export function formatLongDate(iso) {
  if (!iso) return '—'
  const [year, month, day] = iso.split('-')
  return `${parseInt(day, 10)} ${MONTHS_LONG[parseInt(month, 10) - 1]} ${year}`
}

export function formatShortDate(iso) {
  if (!iso) return '—'
  const [, month, day] = iso.split('-')
  return `${parseInt(day, 10)} ${MONTHS_SHORT[parseInt(month, 10) - 1]}`
}

export function formatSlashDate(iso) {
  if (!iso) return '—'
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

export function formatDuration(minutes) {
  if (!minutes) return { hours: '—', minutes: '' }
  const h = Math.floor(minutes / 60)
  const min = minutes % 60
  return { hours: `${h}h`, minutes: min > 0 ? `${String(min).padStart(2, '0')}min` : '' }
}
