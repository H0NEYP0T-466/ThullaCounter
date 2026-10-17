import type { AppState, BhabhiEntry, ChessMatch, Player, Session } from '../types'

const STORAGE_KEY = 'thullaboard.v1'

export const EMOJIS = [
  '😎', '🤡', '🐐', '🦁', '🐍', '👑', '🥔', '🦆', '🐸', '👽',
  '🧠', '🍕', '🦍', '🐺', '💀', '🔥', '🎩', '🫠', '🐢', '🦅',
]

export const QUICK_PLAYERS: { name: string; emoji: string }[] = [
  { name: 'Fezan', emoji: '😎' },
  { name: 'Shoaib', emoji: '🤡' },
  { name: 'Hamza', emoji: '🐐' },
  { name: 'Ali', emoji: '🦁' },
  { name: 'Bilal', emoji: '🐍' },
  { name: 'Zain', emoji: '🐺' },
  { name: 'Usman', emoji: '🦍' },
  { name: 'Taha', emoji: '🐢' },
]

export function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

export function newSession(now = Date.now()): Session {
  return { id: uid(), startedAt: now, endedAt: null }
}

export function createEmptyState(now = Date.now()): AppState {
  const session = newSession(now)
  return {
    version: 1,
    players: [],
    sessions: [session],
    currentSessionId: session.id,
    bhabhi: [],
    chess: [],
    settings: { muted: false, volume: 0.9, announcer: true },
  }
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback
}

/** Repairs anything partially written or hand-edited so a bad blob never bricks the app. */
export function sanitize(raw: unknown): AppState {
  const now = Date.now()
  const base = createEmptyState(now)
  if (!raw || typeof raw !== 'object') return base

  const input = raw as Partial<AppState> & Record<string, unknown>
  const seenIds = new Set<string>()

  const players: Player[] = Array.isArray(input.players)
    ? input.players
        .filter((p): p is Player => !!p && typeof p === 'object')
        .map((p) => {
          let id = asString(p.id, uid())
          if (seenIds.has(id)) id = uid()
          seenIds.add(id)
          return {
            id,
            name: asString(p.name, 'Unknown').slice(0, 24),
            emoji: asString(p.emoji, '😎').slice(0, 4),
            active: p.active !== false,
            createdAt: asNumber(p.createdAt, now),
          }
        })
    : []

  const playerIds = new Set(players.map((p) => p.id))

  let sessions: Session[] = Array.isArray(input.sessions)
    ? input.sessions
        .filter((s): s is Session => !!s && typeof s === 'object')
        .map((s) => ({
          id: asString(s.id, uid()),
          startedAt: asNumber(s.startedAt, now),
          endedAt: typeof s.endedAt === 'number' ? s.endedAt : null,
        }))
    : []

  if (sessions.length === 0) sessions = [newSession(now)]
  const sessionIds = new Set(sessions.map((s) => s.id))

  const fallbackSessionId = sessionIds.has(asString(input.currentSessionId, ''))
    ? asString(input.currentSessionId, '')
    : sessions[sessions.length - 1].id

  const bhabhi: BhabhiEntry[] = Array.isArray(input.bhabhi)
    ? input.bhabhi
        .filter((e): e is BhabhiEntry => !!e && typeof e === 'object')
        .filter((e) => playerIds.has(e.playerId) && sessionIds.has(e.sessionId))
        .map((e) => ({
          id: asString(e.id, uid()),
          playerId: e.playerId,
          sessionId: e.sessionId,
          ts: asNumber(e.ts, now),
        }))
    : []

  const chess: ChessMatch[] = Array.isArray(input.chess)
    ? input.chess
        .filter((m): m is ChessMatch => !!m && typeof m === 'object')
        .filter(
          (m) =>
            playerIds.has(m.p1) &&
            playerIds.has(m.p2) &&
            m.p1 !== m.p2 &&
            sessionIds.has(m.sessionId) &&
            (m.result === 'p1' || m.result === 'p2' || m.result === 'draw'),
        )
        .map((m) => ({
          id: asString(m.id, uid()),
          p1: m.p1,
          p2: m.p2,
          result: m.result,
          sessionId: m.sessionId,
          ts: asNumber(m.ts, now),
        }))
    : []

  const settingsInput = (input.settings ?? {}) as AppState['settings']

  return {
    version: 1,
    players,
    sessions,
    currentSessionId: fallbackSessionId,
    bhabhi,
    chess,
    settings: {
      muted: settingsInput.muted === true,
      volume: Math.min(1, Math.max(0, asNumber(settingsInput.volume, 0.9))),
      announcer: settingsInput.announcer !== false,
    },
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createEmptyState()
    return sanitize(JSON.parse(raw))
  } catch {
    return createEmptyState()
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or blocked (private mode). The session keeps working in memory.
  }
}

export function downloadJSON(state: AppState): void {
  const stamp = new Date().toISOString().slice(0, 10)
  const payload = JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)
  const blob = new Blob([payload], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `thullaboard-${stamp}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function readJSONFile(file: File): Promise<AppState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        if (!parsed || typeof parsed !== 'object') throw new Error('Not a ThullaBoard backup')
        const shape = parsed as Record<string, unknown>
        const looksRight =
          Array.isArray(shape.players) &&
          (Array.isArray(shape.bhabhi) || Array.isArray(shape.chess) || Array.isArray(shape.sessions))
        if (!looksRight) throw new Error('Not a ThullaBoard backup')
        resolve(sanitize(parsed))
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Could not read that file'))
      }
    }
    reader.onerror = () => reject(new Error('Could not read that file'))
    reader.readAsText(file)
  })
}
