import type { AppState, ChessMatch, Player } from '../types'

export type Scope = 'session' | 'all'

export type PlayerStats = {
  player: Player
  bhabhiSession: number
  bhabhiAll: number
  chessWins: number
  chessLosses: number
  chessDraws: number
  lossesSession: number
  lossesAll: number
  gamesAll: number
  gamesSession: number
  streak: number
  bestStreak: number
  cleanSheet: boolean
  rank: number
}

export type HeadToHead = {
  key: string
  aId: string
  bId: string
  aWins: number
  bWins: number
  draws: number
  played: number
  lastAt: number
}

export type Leaderboard = {
  stats: PlayerStats[]
  byId: Record<string, PlayerStats>
  chiefId: string | null
  totalBhabhi: number
  totalChess: number
  sessionBhabhi: number
  sessionChess: number
  h2h: HeadToHead[]
}

export function pairKey(a: string, b: string): string {
  return a < b ? `${a}::${b}` : `${b}::${a}`
}

function buildHeadToHead(matches: ChessMatch[]): HeadToHead[] {
  const map = new Map<string, HeadToHead>()
  for (const match of matches) {
    const key = pairKey(match.p1, match.p2)
    let row = map.get(key)
    if (!row) {
      const [aId, bId] = key.split('::')
      row = { key, aId, bId, aWins: 0, bWins: 0, draws: 0, played: 0, lastAt: 0 }
      map.set(key, row)
    }
    row.played += 1
    row.lastAt = Math.max(row.lastAt, match.ts)
    if (match.result === 'draw') {
      row.draws += 1
    } else {
      const winnerId = match.result === 'p1' ? match.p1 : match.p2
      if (winnerId === row.aId) row.aWins += 1
      else row.bWins += 1
    }
  }
  return [...map.values()].sort((x, y) => y.lastAt - x.lastAt)
}

export function buildLeaderboard(state: AppState, scope: Scope): Leaderboard {
  const sessionBhabhiLog = state.bhabhi
    .filter((entry) => entry.sessionId === state.currentSessionId)
    .sort((a, b) => a.ts - b.ts)
  const allBhabhiLog = [...state.bhabhi].sort((a, b) => a.ts - b.ts)

  // A live streak can only belong to whoever lost most recently.
  const liveStreak = new Map<string, number>()
  if (allBhabhiLog.length > 0) {
    const lastPlayer = allBhabhiLog[allBhabhiLog.length - 1].playerId
    let run = 0
    for (let i = allBhabhiLog.length - 1; i >= 0; i -= 1) {
      if (allBhabhiLog[i].playerId !== lastPlayer) break
      run += 1
    }
    liveStreak.set(lastPlayer, run)
  }

  // Longest run ever, per player.
  const bestStreak = new Map<string, number>()
  let runPlayer = ''
  let runLength = 0
  for (const entry of allBhabhiLog) {
    if (entry.playerId === runPlayer) {
      runLength += 1
    } else {
      runPlayer = entry.playerId
      runLength = 1
    }
    bestStreak.set(runPlayer, Math.max(bestStreak.get(runPlayer) ?? 0, runLength))
  }

  const stats: PlayerStats[] = state.players.map((player) => {
    const bhabhiAll = allBhabhiLog.filter((entry) => entry.playerId === player.id).length
    const bhabhiSession = sessionBhabhiLog.filter((entry) => entry.playerId === player.id).length

    const matches = state.chess.filter((m) => m.p1 === player.id || m.p2 === player.id)
    const sessionMatches = matches.filter((m) => m.sessionId === state.currentSessionId)
    let chessWins = 0
    let chessLosses = 0
    let chessDraws = 0
    for (const match of matches) {
      if (match.result === 'draw') {
        chessDraws += 1
        continue
      }
      const winnerId = match.result === 'p1' ? match.p1 : match.p2
      if (winnerId === player.id) chessWins += 1
      else chessLosses += 1
    }

    const gamesAll = bhabhiAll + matches.length
    const lossesAll = bhabhiAll + chessLosses

    return {
      player,
      bhabhiSession,
      bhabhiAll,
      chessWins,
      chessLosses,
      chessDraws,
      lossesSession: bhabhiSession + sessionMatches.filter((m) => m.result !== 'draw' && (m.result === 'p1' ? m.p2 : m.p1) === player.id).length,
      lossesAll,
      gamesAll,
      gamesSession: bhabhiSession + sessionMatches.length,
      streak: liveStreak.get(player.id) ?? 0,
      bestStreak: bestStreak.get(player.id) ?? 0,
      cleanSheet: gamesAll > 0 && lossesAll === 0,
      rank: 0,
    }
  })

  const ranked = [...stats].sort((a, b) => {
    const aLoss = scope === 'session' ? a.lossesSession : a.lossesAll
    const bLoss = scope === 'session' ? b.lossesSession : b.lossesAll
    if (bLoss !== aLoss) return bLoss - aLoss
    if (b.chessLosses !== a.chessLosses) return b.chessLosses - a.chessLosses
    return a.player.name.localeCompare(b.player.name)
  })

  ranked.forEach((row, index) => {
    row.rank = index + 1
  })

  const byId: Record<string, PlayerStats> = {}
  for (const row of stats) byId[row.player.id] = row

  const rankedWithLosses = ranked.filter(
    (row) => (scope === 'session' ? row.lossesSession : row.lossesAll) > 0,
  )

  return {
    stats: ranked,
    byId,
    chiefId: rankedWithLosses.length > 0 ? rankedWithLosses[0].player.id : null,
    totalBhabhi: state.bhabhi.length,
    totalChess: state.chess.length,
    sessionBhabhi: sessionBhabhiLog.length,
    sessionChess: state.chess.filter((m) => m.sessionId === state.currentSessionId).length,
    h2h: buildHeadToHead(state.chess),
  }
}

export function playerName(state: AppState, id: string): string {
  return state.players.find((p) => p.id === id)?.name ?? 'Unknown'
}

export function sessionLabel(state: AppState): string {
  const session = state.sessions.find((s) => s.id === state.currentSessionId)
  if (!session) return 'Today'
  return new Date(session.startedAt).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}
