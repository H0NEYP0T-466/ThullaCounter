import { useEffect, useMemo, useState } from 'react'
import type { Store } from '../lib/useStore'
import type { Leaderboard } from '../lib/stats'
import { pairKey } from '../lib/stats'
import type { ChessResult } from '../types'
import { timeAgo } from '../lib/format'
import { Icon } from './Icon'

export function ChessTab({
  store,
  board,
  onResult,
  onGoRoster,
}: {
  store: Store
  board: Leaderboard
  onResult: (p1: string, p2: string, result: ChessResult) => void
  onGoRoster: () => void
}) {
  const { state, activePlayers, deleteChess } = store
  const [white, setWhite] = useState<string | null>(null)
  const [black, setBlack] = useState<string | null>(null)

  useEffect(() => {
    if (white && !activePlayers.some((p) => p.id === white)) setWhite(null)
    if (black && !activePlayers.some((p) => p.id === black)) setBlack(null)
  }, [activePlayers, white, black])

  const whitePlayer = state.players.find((p) => p.id === white) ?? null
  const blackPlayer = state.players.find((p) => p.id === black) ?? null
  const ready = !!whitePlayer && !!blackPlayer && whitePlayer.id !== blackPlayer.id

  const pair = useMemo(() => {
    if (!ready) return null
    return board.h2h.find((row) => row.key === pairKey(whitePlayer!.id, blackPlayer!.id)) ?? null
  }, [board.h2h, ready, whitePlayer, blackPlayer])

  const whiteScore = pair && whitePlayer ? (pair.aId === whitePlayer.id ? pair.aWins : pair.bWins) : 0
  const blackScore = pair && blackPlayer ? (pair.aId === blackPlayer.id ? pair.aWins : pair.bWins) : 0
  const draws = pair ? pair.draws : 0

  const recentMatches = state.chess
    .filter((m) => m.sessionId === state.currentSessionId)
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 6)

  const nameOf = (id: string) => state.players.find((p) => p.id === id)?.name ?? 'Unknown'
  const emojiOf = (id: string) => state.players.find((p) => p.id === id)?.emoji ?? '♟️'

  if (state.players.length < 2) {
    return (
      <div className="tab-panel">
        <div className="empty">
          <span className="empty__emoji">♟️</span>
          <h3>Chess needs two victims</h3>
          <p>Add at least two players to start recording matches.</p>
          <button type="button" className="btn btn--primary" onClick={onGoRoster}>
            <Icon name="plus" size={16} /> Add players
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="tab-panel">
      <section className="board-card">
        <div className="board-card__head">
          <span className="pill pill--live">
            <span className="dot" /> Match setup
          </span>
          <span className="pill">{board.sessionChess} today</span>
        </div>

        <div className="versus">
          <button
            type="button"
            className={`slot ${whitePlayer ? 'slot--filled' : ''}`}
            onClick={() => setWhite(null)}
            aria-label="Clear white player"
          >
            <span className="slot__label">White</span>
            <span className="slot__emoji">{whitePlayer ? whitePlayer.emoji : '＋'}</span>
            <span className="slot__name">{whitePlayer ? whitePlayer.name : 'Pick a player'}</span>
            <span className="slot__score">
              {pair ? `${whiteScore}W · ${draws}D` : 'no history'}
            </span>
          </button>
          <span className="versus__vs">VS</span>
          <button
            type="button"
            className={`slot ${blackPlayer ? 'slot--filled' : ''}`}
            onClick={() => setBlack(null)}
            aria-label="Clear black player"
          >
            <span className="slot__label">Black</span>
            <span className="slot__emoji">{blackPlayer ? blackPlayer.emoji : '＋'}</span>
            <span className="slot__name">{blackPlayer ? blackPlayer.name : 'Pick a player'}</span>
            <span className="slot__score">
              {pair ? `${blackScore}W · ${draws}D` : 'no history'}
            </span>
          </button>
        </div>

        <div className="picker">
          <p className="picker__label">Tap a name for white</p>
          <div className="chips">
            {activePlayers.map((player) => (
              <button
                key={`w-${player.id}`}
                type="button"
                className={`chip ${white === player.id ? 'chip--active' : ''}`}
                onClick={() => {
                  setWhite(player.id)
                  if (black === player.id) setBlack(null)
                }}
              >
                <span>{player.emoji}</span>
                {player.name}
              </button>
            ))}
          </div>
          <p className="picker__label">Tap a name for black</p>
          <div className="chips">
            {activePlayers.map((player) => (
              <button
                key={`b-${player.id}`}
                type="button"
                className={`chip chip--dark ${black === player.id ? 'chip--active' : ''}`}
                onClick={() => {
                  setBlack(player.id)
                  if (white === player.id) setWhite(null)
                }}
              >
                <span>{player.emoji}</span>
                {player.name}
              </button>
            ))}
          </div>
        </div>

        <div className="outcomes">
          <button
            type="button"
            className="btn btn--win"
            disabled={!ready}
            onClick={() => onResult(whitePlayer!.id, blackPlayer!.id, 'p1')}
          >
            <span className="btn__big">♔</span>
            {whitePlayer ? `${whitePlayer.name} wins` : 'White wins'}
          </button>
          <button
            type="button"
            className="btn btn--draw"
            disabled={!ready}
            onClick={() => onResult(whitePlayer!.id, blackPlayer!.id, 'draw')}
          >
            <span className="btn__big">½</span>
            Draw
          </button>
          <button
            type="button"
            className="btn btn--win btn--win-dark"
            disabled={!ready}
            onClick={() => onResult(whitePlayer!.id, blackPlayer!.id, 'p2')}
          >
            <span className="btn__big">♚</span>
            {blackPlayer ? `${blackPlayer.name} wins` : 'Black wins'}
          </button>
        </div>
        {!ready ? <p className="hint">Pick two different players to record a result.</p> : null}
      </section>

      {board.h2h.length > 0 ? (
        <section className="section">
          <div className="section__head">
            <h2>Rivalries</h2>
            <span className="muted">{board.h2h.length} pairings</span>
          </div>
          <ul className="rivalry">
            {board.h2h.map((row) => {
              const a = row.aId
              const b = row.bId
              const total = row.played || 1
              return (
                <li key={row.key} className="rivalry__row">
                  <div className="rivalry__names">
                    <span className="rivalry__name">{emojiOf(a)} {nameOf(a)}</span>
                    <span className="rivalry__score">
                      <strong>{row.aWins}</strong>
                      <em>—</em>
                      <strong>{row.bWins}</strong>
                    </span>
                    <span className="rivalry__name rivalry__name--right">
                      {nameOf(b)} {emojiOf(b)}
                    </span>
                  </div>
                  <div className="rivalry__bar">
                    <span style={{ width: `${(row.aWins / total) * 100}%` }} className="rivalry__bar-a" />
                    <span style={{ width: `${(row.draws / total) * 100}%` }} className="rivalry__bar-d" />
                    <span style={{ width: `${(row.bWins / total) * 100}%` }} className="rivalry__bar-b" />
                  </div>
                  <div className="rivalry__meta">
                    <span>{row.played} played</span>
                    <span>{row.draws} draws</span>
                    <span>{timeAgo(row.lastAt)}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      {recentMatches.length > 0 ? (
        <section className="section">
          <div className="section__head">
            <h2>Today's matches</h2>
            <span className="muted">{board.sessionChess} total</span>
          </div>
          <ul className="log">
            {recentMatches.map((match) => {
              const winner =
                match.result === 'draw'
                  ? null
                  : match.result === 'p1'
                    ? nameOf(match.p1)
                    : nameOf(match.p2)
              return (
                <li key={match.id} className="log__row">
                  <span className="log__emoji">♟️</span>
                  <div className="log__main">
                    <strong>
                      {winner ? `${winner} won` : 'Draw'} · {nameOf(match.p1)} vs {nameOf(match.p2)}
                    </strong>
                    <span>{timeAgo(match.ts)}</span>
                  </div>
                  <button
                    type="button"
                    className="icon-btn icon-btn--subtle"
                    onClick={() => deleteChess(match.id)}
                    aria-label="Delete match"
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
