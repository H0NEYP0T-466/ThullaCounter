export function timeAgo(ts: number, now = Date.now()): string {
  const diff = Math.max(0, now - ts)
  const minute = 60_000
  const hour = 60 * minute
  if (diff < 45_000) return 'just now'
  if (diff < hour) return `${Math.round(diff / minute)}m ago`
  if (diff < 24 * hour) return `${Math.round(diff / hour)}h ago`
  const days = Math.round(diff / (24 * hour))
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

export function clock(ts: number): string {
  return new Date(ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export function plural(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`
}
