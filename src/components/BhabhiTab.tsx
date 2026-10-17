import { useMemo } from 'react'
import type { Store } from '../lib/useStore'
import type { Leaderboard } from '../lib/stats'
import { clock, plural, timeAgo } from '../lib/format'
import { Icon } from './Icon'

export function BhabhiTab({
  store,
  board,
  onLoss,
  onGoRoster,
}: {
  store: Store
  board: Leaderboard
  onLoss: (playerId: string) => void
  onGoRoster: () => void
}) {
  const { state, activePlayers, deleteBhabhi } = store

  const recent = useMemo(
    () =>
      state.bhabhi
        .filter((entry) => entry.sessionId === state.currentSessionId)
        .sort((a, b) => b.ts - a.ts)
        .slice(0, 8),
    [state.bhabhi, state.currentSessionId],
  )

  const chief = board.chiefId ? board.byId[board.chiefId] : null
  const nameFor = (id: string) => state.players.find((p) => p.id === id)?.name ?? 'Unknown'
  const emojiFor = (id: string) => state.players.find((p) => p.id === id)?.emoji ?? '🃏'

  return (
    <div className="tab-panel">
      <section className="hero">
        <div className="hero__glow" aria-hidden="true" />
        <div className="hero__top">
          <span className="pill pill--live">
            <span className="dot" /> Round {board.sessionBhabhi + 1}
          </span>
          <span className="pill">{plural(board.sessionBhabhi, 'round')} played</span>
        </div>
        <h1 className="hero__title">
          Who got stuck
          <br />
          with the last card?
        </h1>
        <p className="hero__sub">Tap the loser. Their tally goes up instantly.</p>
        <div className="hero__stats">
          <div>
            <strong>{board.sessionBhabhi}</strong>
            <span>today</span>
          </div>
          <div>
            <strong>{board.totalBhabhi}</strong>
            <span>all time</span>
          </div>
          <div>
            <strong>{chief ? chief.player.name : '—'}</strong>
            <span>chief bhabhi</span>
          </div>
        </div>
      </section>

      {state.players.length === 0 ? (
        <div className="empty">
          <span className="empty__emoji">🃏</span>
          <h3>No players yet</h3>
          <p>Add the usual suspects once, then just tap their names all day.</p>
          <button type="button" className="btn btn--primary" onClick={onGoRoster}>
            <Icon name="plus" size={16} /> Add players
          </button>
        </div>
      ) : activePlayers.length === 0 ? (
        <div className="empty">
          <span className="empty__emoji">🪑</span>
          <h3>Nobody is at the table</h3>
          <p>Switch a few players back on in the roster.</p>
          <button type="button" className="btn btn--ghost" onClick={onGoRoster}>
            <Icon name="users" size={16} /> Open roster
          </button>
        </div>
      ) : (
        <div className="player-grid">
          {activePlayers.map((player) => {
            const row = board.byId[player.id]
            const isChief = board.chiefId === player.id
            return (
              <button
                key={player.id}
                type="button"
                className={`tap-card ${isChief ? 'tap-card--chief' : ''} ${
                  row && row.streak > 1 ? 'tap-card--streak' : ''
                }`}
                onClick={() => onLoss(player.id)}
                aria-label={`Mark ${player.name} as Bhabhi`}
              >
                <span className="tap-card__emoji">{player.emoji}</span>
                <span className="tap-card__name">{player.name}</span>
                <span className="tap-card__meta">
                  {isChief ? <span className="tag tag--gold">👑 Chief</span> : null}
                  {row && row.streak > 1 ? (
                    <span className="tag tag--hot">🔥 {row.streak}</span>
                  ) : null}
                  <span className="tap-card__count">{row ? row.bhabhiSession : 0} L</span>
                </span>
                <span className="tap-card__hint">tap to accuse</span>
              </button>
            )
          })}
        </div>
      )}

      {recent.length > 0 ? (
        <section className="section">
          <div className="section__head">
            <h2>Today's casualties</h2>
            <span className="muted">{recent.length} shown</span>
          </div>
          <ul className="log">
            {recent.map((entry) => (
              <li key={entry.id} className="log__row">
                <span className="log__emoji">{emojiFor(entry.playerId)}</span>
                <div className="log__main">
                  <strong>{nameFor(entry.playerId)}</strong>
                  <span>
                    Bhabhi · {clock(entry.ts)} · {timeAgo(entry.ts)}
                  </span>
                </div>
                <button
                  type="button"
                  className="icon-btn icon-btn--subtle"
                  onClick={() => deleteBhabhi(entry.id)}
                  aria-label={`Remove last entry for ${nameFor(entry.playerId)}`}
                >
                  <Icon name="trash" size={16} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
