export type Player = {
  id: string
  name: string
  emoji: string
  active: boolean
  createdAt: number
}

export type Session = {
  id: string
  startedAt: number
  endedAt: number | null
}

export type BhabhiEntry = {
  id: string
  playerId: string
  sessionId: string
  ts: number
}

export type ChessResult = 'p1' | 'p2' | 'draw'

export type ChessMatch = {
  id: string
  p1: string
  p2: string
  result: ChessResult
  sessionId: string
  ts: number
}

export type AppState = {
  version: 1
  players: Player[]
  sessions: Session[]
  currentSessionId: string
  bhabhi: BhabhiEntry[]
  chess: ChessMatch[]
  settings: {
    muted: boolean
    volume: number
    announcer: boolean
  }
}

export type Tab = 'thulla' | 'chess' | 'shame' | 'roster'
