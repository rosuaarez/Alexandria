// Fecha relativa en español: "hace 2 días", "hace 3 h", etc.
export function timeAgo(iso?: string): string {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const diff = Math.max(0, Date.now() - then)
  const sec = Math.floor(diff / 1000)

  if (sec < 60) return 'hace un momento'
  const min = Math.floor(sec / 60)
  if (min < 60) return `hace ${min} min`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `hace ${hr} h`
  const day = Math.floor(hr / 24)
  if (day < 30) return day === 1 ? 'hace 1 día' : `hace ${day} días`
  const month = Math.floor(day / 30)
  if (month < 12) return month === 1 ? 'hace 1 mes' : `hace ${month} meses`
  const year = Math.floor(month / 12)
  return year === 1 ? 'hace 1 año' : `hace ${year} años`
}
