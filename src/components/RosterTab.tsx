import { useState } from 'react'
import type { Store } from '../lib/useStore'
import type { Leaderboard } from '../lib/stats'
import { EMOJIS, QUICK_PLAYERS } from '../lib/storage'
import { sessionLabel } from '../lib/stats'
import { plural } from '../lib/format'
import { Icon } from './Icon'
import { ConfirmDialog } from './Sheet'

export function RosterTab({
  store,
  board,
  onChallan,
  onExport,
  onImport,
  onResetSession,
  onWipe,
}: {
  store: Store
  board: Leaderboard
  onChallan: (playerId: string) => void
  onExport: () => void
  onImport: () => void
  onResetSession: () => void
  onWipe: () => void
}) {
  const { state, addPlayer, renamePlayer, removePlayer, toggleActive } = store
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(EMOJIS[0])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const suggestions = QUICK_PLAYERS.filter(
    (candidate) => !state.players.some((p) => p.name.toLowerCase() === candidate.name.toLowerCase()),
  ).slice(0, 5)

  const submit = () => {
    if (!name.trim()) return
    addPlayer(name, emoji)
    setName('')
    setEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)])
  }

  const commitRename = () => {
    if (editingId) renamePlayer(editingId, draft)
    setEditingId(null)
  }

  const target = confirmId ? state.players.find((p) => p.id === confirmId) : null

  return (
    <div className="tab-panel">
      <div className="page-head">
        <div>
          <h1 className="page-title">The Roster</h1>
          <p className="page-sub">Add friends. Toggle who is at the table.</p>
        </div>
        <span className="pill">{state.players.length} players</span>
      </div>

      <section className="add-card">
        <div className="add-row">
          <button
            type="button"
            className="emoji-pick"
            onClick={() => {
              const index = EMOJIS.indexOf(emoji)
              setEmoji(EMOJIS[(index + 1) % EMOJIS.length])
            }}
            aria-label="Change avatar emoji"
          >
            {emoji}
          </button>
          <input
            className="input"
            placeholder="Friend's name"
            value={name}
            maxLength={24}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submit()
            }}
            enterKeyHint="done"
          />
          <button type="button" className="btn btn--primary btn--icon" onClick={submit} aria-label="Add player">
            <Icon name="plus" size={20} />
          </button>
        </div>
        {suggestions.length > 0 ? (
          <div className="chips chips--tight">
            {suggestions.map((candidate) => (
              <button
                key={candidate.name}
                type="button"
                className="chip chip--ghost"
                onClick={() => addPlayer(candidate.name, candidate.emoji)}
              >
                <span>{candidate.emoji}</span> {candidate.name}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      {state.players.length === 0 ? (
        <div className="empty empty--slim">
          <span className="empty__emoji">👥</span>
          <h3>Roster is empty</h3>
          <p>Type a name above, or tap a suggestion.</p>
        </div>
      ) : (
        <ul className="roster">
          {state.players.map((player) => {
            const row = board.byId[player.id]
            return (
              <li key={player.id} className={`roster-row ${player.active ? '' : 'roster-row--off'}`}>
                <span className="roster-row__emoji">{player.emoji}</span>
                <div className="roster-row__main">
                  {editingId === player.id ? (
                    <input
                      className="input input--inline"
                      value={draft}
                      maxLength={24}
                      autoFocus
                      onChange={(event) => setDraft(event.target.value)}
                      onBlur={commitRename}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') commitRename()
                        if (event.key === 'Escape') setEditingId(null)
                      }}
                    />
                  ) : (
                    <button
                      type="button"
                      className="roster-row__name"
                      onClick={() => {
                        setEditingId(player.id)
                        setDraft(player.name)
                      }}
                      title="Tap to rename"
                    >
                      {player.name}
                    </button>
                  )}
                  <span className="roster-row__meta">
                    {plural(row.lossesAll, 'loss', 'losses')} · {plural(row.gamesAll, 'game')}
                    {row.cleanSheet ? ' · clean sheet' : ''}
                  </span>
                </div>
                <div className="roster-row__actions">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={player.active}
                    aria-label={`${player.name} at the table`}
                    className={`switch ${player.active ? 'switch--on' : ''}`}
                    onClick={() => toggleActive(player.id)}
                  >
                    <span className="switch__knob" />
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--subtle"
                    onClick={() => onChallan(player.id)}
                    aria-label={`Challan for ${player.name}`}
                  >
                    <Icon name="share" size={16} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--subtle icon-btn--danger"
                    onClick={() => setConfirmId(player.id)}
                    aria-label={`Remove ${player.name}`}
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <section className="section">
        <div className="section__head">
          <h2>Session</h2>
          <span className="muted">started {sessionLabel(state)}</span>
        </div>
        <div className="stat-grid">
          <div className="stat">
            <strong>{board.sessionBhabhi}</strong>
            <span>Rounds</span>
          </div>
          <div className="stat">
            <strong>{board.sessionChess}</strong>
            <span>Matches</span>
          </div>
          <div className="stat">
            <strong>{state.sessions.length}</strong>
            <span>Sessions</span>
          </div>
        </div>
        <button type="button" className="btn btn--ghost btn--block" onClick={onResetSession}>
          <Icon name="refresh" size={16} /> Start new session
        </button>
        <p className="hint hint--left">
          Clears today's board only. All-time records and player history stay intact.
        </p>
      </section>

      <section className="section">
        <div className="section__head">
          <h2>Backup &amp; transfer</h2>
        </div>
        <div className="row-gap">
          <button type="button" className="btn btn--ghost" onClick={onExport}>
            <Icon name="download" size={16} /> Export JSON
          </button>
          <button type="button" className="btn btn--ghost" onClick={onImport}>
            <Icon name="upload" size={16} /> Import JSON
          </button>
        </div>
        <button type="button" className="btn btn--danger-ghost btn--block" onClick={onWipe}>
          <Icon name="trash" size={16} /> Erase everything
        </button>
      </section>

      <ConfirmDialog
        open={!!target}
        title={`Remove ${target?.name ?? 'player'}?`}
        body={
          <p>
            {target ? `${target.name}'s` : 'Their'} match history disappears too. This cannot be undone.
          </p>
        }
        confirmLabel="Remove player"
        cancelLabel="Keep"
        danger
        onConfirm={() => {
          if (target) removePlayer(target.id)
          setConfirmId(null)
        }}
        onClose={() => setConfirmId(null)}
      />
    </div>
  )
}
