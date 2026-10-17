import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AppState, ChessResult, Player } from '../types'
import { createEmptyState, loadState, newSession, saveState, uid } from './storage'
import { EMOJIS } from './storage'

export type UndoAction = {
  id: string
  label: string
  run: () => void
}

export type Store = {
  state: AppState
  activePlayers: Player[]
  addPlayer: (name: string, emoji?: string) => Player | null
  renamePlayer: (id: string, name: string) => void
  removePlayer: (id: string) => void
  toggleActive: (id: string) => void
  markBhabhi: (playerId: string) => UndoAction | null
  recordChess: (p1: string, p2: string, result: ChessResult) => UndoAction | null
  deleteBhabhi: (entryId: string) => void
  deleteChess: (matchId: string) => void
  startNewSession: () => void
  replaceState: (next: AppState) => void
  setSettings: (next: Partial<AppState['settings']>) => void
  wipePlayers: () => void
}

export function useStore(): Store {
  const [state, setState] = useState<AppState>(() => loadState())
  const firstRun = useRef(true)

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    saveState(state)
  }, [state])

  // Keep tabs in sync — score on one phone, refresh the other.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'thullaboard.v1' && event.newValue) {
        try {
          setState(loadState())
        } catch {
          // Ignore malformed cross-tab writes.
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const activePlayers = useMemo(
    () => state.players.filter((player) => player.active),
    [state.players],
  )

  const addPlayer = useCallback((name: string, emoji?: string): Player | null => {
    const trimmed = name.trim().slice(0, 24)
    if (!trimmed) return null
    const player: Player = {
      id: uid(),
      name: trimmed,
      emoji: emoji ?? EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      active: true,
      createdAt: Date.now(),
    }
    setState((prev) => {
      if (prev.players.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
        return prev
      }
      return { ...prev, players: [...prev.players, player] }
    })
    return player
  }, [])

  const renamePlayer = useCallback((id: string, name: string) => {
    const trimmed = name.trim().slice(0, 24)
    if (!trimmed) return
    setState((prev) => ({
      ...prev,
      players: prev.players.map((p) => (p.id === id ? { ...p, name: trimmed } : p)),
    }))
  }, [])

  const removePlayer = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== id),
      bhabhi: prev.bhabhi.filter((entry) => entry.playerId !== id),
      chess: prev.chess.filter((match) => match.p1 !== id && match.p2 !== id),
    }))
  }, [])

  const toggleActive = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      players: prev.players.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
    }))
  }, [])

  const markBhabhi = useCallback((playerId: string): UndoAction | null => {
    const player = state.players.find((p) => p.id === playerId)
    if (!player) return null
    const entryId = uid()
    setState((prev) => ({
      ...prev,
      bhabhi: [
        ...prev.bhabhi,
        { id: entryId, playerId, sessionId: prev.currentSessionId, ts: Date.now() },
      ],
    }))
    return {
      id: entryId,
      label: `${player.name} marked as Bhabhi`,
      run: () =>
        setState((prev) => ({
          ...prev,
          bhabhi: prev.bhabhi.filter((entry) => entry.id !== entryId),
        })),
    }
  }, [state.players])

  const recordChess = useCallback(
    (p1: string, p2: string, result: ChessResult): UndoAction | null => {
      if (p1 === p2) return null
      const a = state.players.find((p) => p.id === p1)
      const b = state.players.find((p) => p.id === p2)
      if (!a || !b) return null
      const matchId = uid()
      setState((prev) => ({
        ...prev,
        chess: [
          ...prev.chess,
          { id: matchId, p1, p2, result, sessionId: prev.currentSessionId, ts: Date.now() },
        ],
      }))
      const label =
        result === 'draw'
          ? `${a.name} vs ${b.name} — draw`
          : `${result === 'p1' ? a.name : b.name} beat ${result === 'p1' ? b.name : a.name}`
      return {
        id: matchId,
        label,
        run: () =>
          setState((prev) => ({
            ...prev,
            chess: prev.chess.filter((match) => match.id !== matchId),
          })),
      }
    },
    [state.players],
  )

  const deleteBhabhi = useCallback((entryId: string) => {
    setState((prev) => ({
      ...prev,
      bhabhi: prev.bhabhi.filter((entry) => entry.id !== entryId),
    }))
  }, [])

  const deleteChess = useCallback((matchId: string) => {
    setState((prev) => ({
      ...prev,
      chess: prev.chess.filter((match) => match.id !== matchId),
    }))
  }, [])

  const startNewSession = useCallback(() => {
    setState((prev) => {
      const session = newSession()
      return {
        ...prev,
        sessions: [
          ...prev.sessions.map((s) =>
            s.id === prev.currentSessionId ? { ...s, endedAt: Date.now() } : s,
          ),
          session,
        ],
        currentSessionId: session.id,
      }
    })
  }, [])

  const replaceState = useCallback((next: AppState) => {
    setState(next)
  }, [])

  const setSettings = useCallback((next: Partial<AppState['settings']>) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...next } }))
  }, [])

  const wipePlayers = useCallback(() => {
    setState(createEmptyState())
  }, [])

  return {
    state,
    activePlayers,
    addPlayer,
    renamePlayer,
    removePlayer,
    toggleActive,
    markBhabhi,
    recordChess,
    deleteBhabhi,
    deleteChess,
    startNewSession,
    replaceState,
    setSettings,
    wipePlayers,
  }
}
