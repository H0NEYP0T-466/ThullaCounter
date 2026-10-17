import type { Store } from '../lib/useStore'
import type { Leaderboard, Scope } from '../lib/stats'
import { rankBadge, rankTitle } from '../lib/share'
import { Icon } from './Icon'

export function ShameTab({
  store,
  board,
  scope,
  onScope,
  onChallan,
  onShareSession,
}: {
  store: Store
  board: Leaderboard
  scope: Scope
  onScope: (scope: Scope) => void
  onChallan: (playerId: string) => void
  onShareSession: () => void
}) {
  const { state } = store
  const chief = board.chiefId ? board.byId[board.chiefId] : null
  const clean = board.stats.filter((row) => row.cleanSheet)

  if (state.players.length === 0) {
    return (
      <div className="tab-panel">
        <div className="empty">
          <span className="empty__emoji">🏛️</span>
          <h3>The hall is empty</h3>
          <p>No players, no shame. Add the roster first.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="tab-panel">
      <div className="page-head">
        <div>
          <h1 className="page-title">Hall of Shame</h1>
          <p className="page-sub">Ranked by losses. The crown is not a compliment.</p>
        </div>
        <button type="button" className="btn btn--ghost btn--sm" onClick={onShareSession}>
          <Icon name="share" size={15} /> Receipt
        </button>
      </div>

      <div className="segmented" role="tablist" aria-label="Stats scope">
        <button
          type="button"
          role="tab"
          aria-selected={scope === 'session'}
          className={scope === 'session' ? 'is-active' : ''}
          onClick={() => onScope('session')}
        >
          Today
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={scope === 'all'}
          className={scope === 'all' ? 'is-active' : ''}
          onClick={() => onScope('all')}
        >
          All time
        </button>
      </div>

      {chief ? (
        <section className="chief">
          <div className="chief__crown" aria-hidden="true">👑</div>
          <span className="chief__label">Chief Bhabhi · disgrace of the group</span>
          <div className="chief__name">
            <span className="chief__emoji">{chief.player.emoji}</span>
            {chief.player.name}
          </div>
          <div className="chief__stats">
            <div>
              <strong>{scope === 'session' ? chief.lossesSession : chief.lossesAll}</strong>
              <span>losses</span>
            </div>
            <div>
              <strong>{chief.streak}</strong>
              <span>live streak</span>
            </div>
            <div>
              <strong>{chief.bestStreak}</strong>
              <span>worst run</span>
            </div>
          </div>
          <button type="button" className="btn btn--primary btn--block" onClick={() => onChallan(chief.player.id)}>
            <Icon name="share" size={16} /> Generate challan
          </button>
        </section>
      ) : (
        <div className="empty empty--slim">
          <span className="empty__emoji">🕊️</span>
          <h3>Nobody has lost yet</h3>
          <p>{scope === 'session' ? 'Clean slate today. Give it ten minutes.' : 'Suspiciously flawless.'}</p>
        </div>
      )}

      <ul className="shame-list">
        {board.stats.map((row) => {
          const losses = scope === 'session' ? row.lossesSession : row.lossesAll
          const isChief = board.chiefId === row.player.id
          return (
            <li
              key={row.player.id}
              className={`shame-row ${isChief ? 'shame-row--chief' : ''} ${
                losses === 0 ? 'shame-row--clean' : ''
              }`}
            >
              <span className={`shame-row__rank rank-${row.rank}`}>{row.rank}</span>
              <span className="shame-row__emoji">{row.player.emoji}</span>
              <div className="shame-row__main">
                <div className="shame-row__name">
                  {row.player.name}
                  <span className="shame-row__badge">{rankBadge(row, board)}</span>
                </div>
                <div className="shame-row__title">
                  {rankTitle(row, board)}
                  {row.cleanSheet ? <span className="tag tag--mint">Clean sheet</span> : null}
                  {row.streak > 1 ? <span className="tag tag--hot">🔥 {row.streak}</span> : null}
                </div>
                <div className="shame-row__detail">
                  🃏 {row.bhabhiAll} · ♟️ {row.chessLosses}L {row.chessWins}W {row.chessDraws}D
                </div>
              </div>
              <div className="shame-row__right">
                <strong>{losses}</strong>
                <span>loss{losses === 1 ? '' : 'es'}</span>
                <button
                  type="button"
                  className="icon-btn icon-btn--subtle"
                  onClick={() => onChallan(row.player.id)}
                  aria-label={`Challan for ${row.player.name}`}
                >
                  <Icon name="share" size={16} />
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      {clean.length > 0 ? (
        <section className="section">
          <div className="section__head">
            <h2>Clean sheets</h2>
            <span className="muted">{clean.length} untouched</span>
          </div>
          <div className="clean-grid">
            {clean.map((row) => (
              <div key={row.player.id} className="clean-card">
                <span className="clean-card__emoji">{row.player.emoji}</span>
                <strong>{row.player.name}</strong>
                <span>{row.gamesAll} games · 0 losses</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <p className="footnote">
        {scope === 'session'
          ? `Today: ${board.sessionBhabhi} bhabhi rounds · ${board.sessionChess} chess matches`
          : `All time: ${board.totalBhabhi} bhabhi rounds · ${board.totalChess} chess matches`}
      </p>
    </div>
  )
}
