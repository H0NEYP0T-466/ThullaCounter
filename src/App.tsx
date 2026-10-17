import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BhabhiTab } from './components/BhabhiTab'
import { ChessTab } from './components/ChessTab'
import { RosterTab } from './components/RosterTab'
import { ShameTab } from './components/ShameTab'
import { ConfirmDialog, Sheet, Toast } from './components/Sheet'
import { Icon, Logo } from './components/Icon'
import { useStore, type UndoAction } from './lib/useStore'
import { buildLeaderboard, sessionLabel, type Scope } from './lib/stats'
import {
  configureAudio,
  CUE_GROUPS,
  CUES,
  playCue,
  playRandomLossCue,
  preloadAudio,
  speakTaunt,
  stopSpeech,
  unlockAudio,
  vibrate,
} from './lib/audio'
import { buildChallan, buildSessionReceipt, copyText, whatsappLink } from './lib/share'
import { downloadJSON, readJSONFile } from './lib/storage'
import { pickRoast, spokenBhabhi, spokenChess } from './lib/roasts'
import type { AppState, ChessResult, Tab } from './types'

const TABS: { id: Tab; label: string; icon: 'cards' | 'chess' | 'skull' | 'users' }[] = [
  { id: 'thulla', label: 'Thulla', icon: 'cards' },
  { id: 'chess', label: 'Chess', icon: 'chess' },
  { id: 'shame', label: 'Shame', icon: 'skull' },
  { id: 'roster', label: 'Roster', icon: 'users' },
]

type ToastState = { id: number; message: string; undo?: () => void; tone?: 'default' | 'danger' }

export default function App() {
  const store = useStore()
  const { state, setSettings, startNewSession, replaceState, wipePlayers } = store

  const [tab, setTab] = useState<Tab>('thulla')
  const [scope, setScope] = useState<Scope>('session')
  const [toast, setToast] = useState<ToastState | null>(null)
  const [soundOpen, setSoundOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [challanId, setChallanId] = useState<string | null>(null)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [wipeOpen, setWipeOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [pendingImport, setPendingImport] = useState<AppState | null>(null)
  const [slam, setSlam] = useState<{ id: number; name: string; emoji: string; word: string } | null>(
    null,
  )
  const [shake, setShake] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const board = useMemo(() => buildLeaderboard(state, scope), [state, scope])

  useEffect(() => {
    configureAudio(state.settings)
  }, [state.settings])

  useEffect(() => {
    const unlock = () => {
      unlockAudio()
      void preloadAudio()
    }
    window.addEventListener('pointerdown', unlock, { once: true })
    return () => window.removeEventListener('pointerdown', unlock)
  }, [])

  const notify = useCallback((message: string, undo?: () => void, tone?: 'default' | 'danger') => {
    setToast({ id: Date.now(), message, undo, tone })
  }, [])

  const runUndo = useCallback((action: UndoAction) => {
    action.run()
    setToast({ id: Date.now(), message: 'Undone' })
  }, [])

  const handleLoss = useCallback(
    (playerId: string) => {
      const undo = store.markBhabhi(playerId)
      if (!undo) return
      const player = state.players.find((p) => p.id === playerId)
      if (!player) return

      // The streak this loss creates, counted from the log that already exists.
      let streak = 1
      for (let i = state.bhabhi.length - 1; i >= 0; i -= 1) {
        if (state.bhabhi[i].playerId !== playerId) break
        streak += 1
      }

      playRandomLossCue()
      vibrate([28, 45, 28, 45, 60])
      setSlam({ id: Date.now(), name: player.name, emoji: player.emoji, word: 'BHABHI!' })
      setShake(true)
      window.setTimeout(() => setShake(false), 460)
      window.setTimeout(() => setSlam(null), 1050)
      speakTaunt(spokenBhabhi(player.name))
      notify(pickRoast(player.name, streak), () => runUndo(undo))
    },
    [store, state.players, state.bhabhi, notify, runUndo],
  )

  const handleChess = useCallback(
    (p1: string, p2: string, result: ChessResult) => {
      const undo = store.recordChess(p1, p2, result)
      if (!undo) return
      const a = state.players.find((p) => p.id === p1)?.name ?? 'Player 1'
      const b = state.players.find((p) => p.id === p2)?.name ?? 'Player 2'
      if (result === 'draw') {
        vibrate(18)
        notify(`Draw recorded — ${a} vs ${b}`, () => runUndo(undo))
      } else {
        const loser = result === 'p1' ? state.players.find((p) => p.id === p2) : state.players.find((p) => p.id === p1)
        playRandomLossCue()
        vibrate([28, 45, 28, 45, 60])
        setSlam({
          id: Date.now(),
          name: loser?.name ?? 'Loser',
          emoji: loser?.emoji ?? '♟️',
          word: 'CHECKMATE',
        })
        setShake(true)
        window.setTimeout(() => setShake(false), 460)
        window.setTimeout(() => setSlam(null), 1050)
        speakTaunt(spokenChess(loser?.name ?? 'Loser'))
        notify(undo.label, () => runUndo(undo))
      }
    },
    [store, state.players, notify, runUndo],
  )

  const challanPlayer = challanId ? state.players.find((p) => p.id === challanId) : null
  const challanStats = challanId ? board.byId[challanId] : null
  const challanText = useMemo(
    () => (challanStats ? buildChallan(challanStats, board) : ''),
    [challanStats, board],
  )
  const receiptText = useMemo(() => buildSessionReceipt(state, board), [state, board])

  const handleCopy = async (text: string) => {
    const ok = await copyText(text)
    setCopied(ok)
    notify(ok ? 'Copied. Paste it in the group chat.' : 'Copy failed — select the text manually.')
    window.setTimeout(() => setCopied(false), 2200)
  }

  const handleExport = () => {
    downloadJSON(state)
    setMenuOpen(false)
    notify('Backup file downloaded')
  }

  const handleImportFile = async (file: File | undefined) => {
    if (!file) return
    try {
      const next = await readJSONFile(file)
      setPendingImport(next)
    } catch {
      notify('That file is not a valid ThullaBoard backup', undefined, 'danger')
    }
  }

  const chiefName = board.chiefId ? board.byId[board.chiefId].player.name : null

  return (
    <div className={`app ${shake ? 'app--shake' : ''}`}>
      <header className="topbar">
        <div className="brand">
          <Logo size={32} />
          <div className="brand__text">
            <span className="brand__name">ThullaBoard</span>
            <span className="brand__sub">{sessionLabel(state)} · no appeals</span>
          </div>
        </div>
        <div className="topbar__actions">
          <button
            type="button"
            className={`icon-btn ${state.settings.muted ? 'icon-btn--muted' : ''}`}
            onClick={() => {
              unlockAudio()
              setSoundOpen(true)
            }}
            aria-label={state.settings.muted ? 'Sound is muted' : 'Sound settings'}
          >
            <Icon name={state.settings.muted ? 'mute' : 'sound'} size={19} />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Data and session menu"
          >
            <Icon name="menu" size={20} />
          </button>
        </div>
      </header>

      <nav className="tabbar" aria-label="Sections">
        {TABS.map((item) => {
          const badge =
            item.id === 'thulla' ? board.sessionBhabhi : item.id === 'chess' ? board.sessionChess : 0
          return (
            <button
              key={item.id}
              type="button"
              className={`tab ${tab === item.id ? 'tab--active' : ''}`}
              onClick={() => setTab(item.id)}
              aria-current={tab === item.id ? 'page' : undefined}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
              {badge > 0 ? <em className="tab__badge">{badge}</em> : null}
            </button>
          )
        })}
      </nav>

      <main className="main">
        {tab === 'thulla' ? (
          <BhabhiTab store={store} board={board} onLoss={handleLoss} onGoRoster={() => setTab('roster')} />
        ) : null}
        {tab === 'chess' ? (
          <ChessTab store={store} board={board} onResult={handleChess} onGoRoster={() => setTab('roster')} />
        ) : null}
        {tab === 'shame' ? (
          <ShameTab
            store={store}
            board={board}
            scope={scope}
            onScope={setScope}
            onChallan={setChallanId}
            onShareSession={() => setReceiptOpen(true)}
          />
        ) : null}
        {tab === 'roster' ? (
          <RosterTab
            store={store}
            board={board}
            onChallan={setChallanId}
            onExport={handleExport}
            onImport={() => fileRef.current?.click()}
            onResetSession={() => setResetOpen(true)}
            onWipe={() => setWipeOpen(true)}
          />
        ) : null}
      </main>

      <footer className="app-foot">
        <span>{chiefName ? `Chief Bhabhi: ${chiefName}` : 'No chief yet. Somebody has to lose.'}</span>
        <span className="app-foot__dot">·</span>
        <span>{board.totalBhabhi + board.totalChess} games on record</span>
      </footer>

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        onChange={(event) => {
          void handleImportFile(event.target.files?.[0])
          event.target.value = ''
          setMenuOpen(false)
        }}
      />

      {slam ? (
        <div className="slam" aria-hidden="true">
          <span className="slam__emoji">{slam.emoji}</span>
          <span className={`slam__word ${slam.word.length > 6 ? 'slam__word--long' : ''}`}>
            {slam.word}
          </span>
          <span className="slam__name">{slam.name}</span>
        </div>
      ) : null}

      {toast ? (
        <Toast
          key={toast.id}
          message={toast.message}
          tone={toast.tone}
          actionLabel={toast.undo ? 'Undo' : undefined}
          onAction={toast.undo}
          onClose={() => setToast(null)}
        />
      ) : null}

      <Sheet
        open={soundOpen}
        title="Soundboard"
        subtitle={`${CUES.length} real clips. One fires on every recorded loss.`}
        onClose={() => setSoundOpen(false)}
      >
        <div className="sound-head">
          <button
            type="button"
            role="switch"
            aria-checked={!state.settings.muted}
            className={`switch ${!state.settings.muted ? 'switch--on' : ''}`}
            onClick={() => setSettings({ muted: !state.settings.muted })}
            aria-label="Toggle sound"
          >
            <span className="switch__knob" />
          </button>
          <div>
            <strong>{state.settings.muted ? 'Muted' : 'Sound on'}</strong>
            <span className="hint hint--left">Library-safe at one tap.</span>
          </div>
        </div>

        <div className="sound-head sound-head--stack">
          <button
            type="button"
            role="switch"
            aria-checked={state.settings.announcer}
            className={`switch ${state.settings.announcer ? 'switch--on' : ''}`}
            onClick={() => {
              const next = !state.settings.announcer
              setSettings({ announcer: next })
              if (!next) stopSpeech()
            }}
            aria-label="Toggle the announcer voice"
          >
            <span className="switch__knob" />
          </button>
          <div>
            <strong>Announcer</strong>
            <span className="hint hint--left">Your phone's voice reads the verdict out loud.</span>
          </div>
        </div>

        <label className="slider">
          <span>Volume</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(state.settings.volume * 100)}
            onChange={(event) => setSettings({ volume: Number(event.target.value) / 100 })}
          />
          <em>{Math.round(state.settings.volume * 100)}%</em>
        </label>

        {CUE_GROUPS.map((group) => (
          <section key={group.id} className="cue-section">
            <h3>{group.label}</h3>
            <div className="cue-grid">
              {CUES.filter((cue) => cue.group === group.id).map((cue) => (
                <button
                  key={cue.id}
                  type="button"
                  className="cue"
                  onClick={() => {
                    unlockAudio()
                    if (state.settings.muted) setSettings({ muted: false })
                    void playCue(cue)
                  }}
                >
                  <span className="cue__emoji">{cue.emoji}</span>
                  <span className="cue__label">{cue.label}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
        <p className="hint hint--left">Tap any cue to preview. One fires at random on every loss.</p>
      </Sheet>

      <Sheet
        open={menuOpen}
        title="Data & session"
        subtitle={`${state.players.length} players · ${state.sessions.length} sessions`}
        onClose={() => setMenuOpen(false)}
      >
        <div className="menu-list">
          <button type="button" className="menu-item" onClick={handleExport}>
            <span className="menu-item__icon">
              <Icon name="download" size={18} />
            </span>
            <span>
              <strong>Export JSON</strong>
              <em>Backup scores or move them to another phone.</em>
            </span>
          </button>
          <button
            type="button"
            className="menu-item"
            onClick={() => {
              setMenuOpen(false)
              fileRef.current?.click()
            }}
          >
            <span className="menu-item__icon">
              <Icon name="upload" size={18} />
            </span>
            <span>
              <strong>Import JSON</strong>
              <em>Replaces the current board with a backup.</em>
            </span>
          </button>
          <button
            type="button"
            className="menu-item"
            onClick={() => {
              setMenuOpen(false)
              setResetOpen(true)
            }}
          >
            <span className="menu-item__icon">
              <Icon name="refresh" size={18} />
            </span>
            <span>
              <strong>Start new session</strong>
              <em>Clears today, keeps all-time records.</em>
            </span>
          </button>
          <button
            type="button"
            className="menu-item menu-item--danger"
            onClick={() => {
              setMenuOpen(false)
              setWipeOpen(true)
            }}
          >
            <span className="menu-item__icon">
              <Icon name="trash" size={18} />
            </span>
            <span>
              <strong>Erase everything</strong>
              <em>Players, matches, history. Gone.</em>
            </span>
          </button>
        </div>
      </Sheet>

      <Sheet
        open={!!challanPlayer && !!challanStats}
        title={challanPlayer ? `${challanPlayer.name}'s challan` : 'Challan'}
        subtitle="Copy it, then paste in WhatsApp."
        onClose={() => setChallanId(null)}
        footer={
          <div className="row-gap">
            <button type="button" className="btn btn--ghost" onClick={() => void handleCopy(challanText)}>
              <Icon name={copied ? 'check' : 'copy'} size={16} /> {copied ? 'Copied' : 'Copy'}
            </button>
            <a className="btn btn--primary" href={whatsappLink(challanText)} target="_blank" rel="noreferrer">
              <Icon name="share" size={16} /> Send on WhatsApp
            </a>
          </div>
        }
      >
        <pre className="challan">{challanText}</pre>
      </Sheet>

      <Sheet
        open={receiptOpen}
        title="Session receipt"
        subtitle="The whole day, in one message."
        onClose={() => setReceiptOpen(false)}
        footer={
          <div className="row-gap">
            <button type="button" className="btn btn--ghost" onClick={() => void handleCopy(receiptText)}>
              <Icon name={copied ? 'check' : 'copy'} size={16} /> {copied ? 'Copied' : 'Copy'}
            </button>
            <a className="btn btn--primary" href={whatsappLink(receiptText)} target="_blank" rel="noreferrer">
              <Icon name="share" size={16} /> Send on WhatsApp
            </a>
          </div>
        }
      >
        <pre className="challan">{receiptText}</pre>
      </Sheet>

      <ConfirmDialog
        open={!!pendingImport}
        title="Replace this board?"
        body={
          <p>
            The backup holds {pendingImport?.players.length ?? 0} players and{' '}
            {(pendingImport?.bhabhi.length ?? 0) + (pendingImport?.chess.length ?? 0)} recorded games.
            Everything currently on this phone is replaced.
          </p>
        }
        confirmLabel="Import backup"
        onConfirm={() => {
          if (!pendingImport) return
          replaceState(pendingImport)
          notify(`Imported ${pendingImport.players.length} players`)
          setPendingImport(null)
        }}
        onClose={() => setPendingImport(null)}
      />

      <ConfirmDialog
        open={resetOpen}
        title="Start a new session?"
        body={
          <>
            <p>Today's rounds and matches move to history. All-time totals and player records stay.</p>
            <p className="hint hint--left">Nobody's career losses are forgiven.</p>
          </>
        }
        confirmLabel="Start fresh"
        onConfirm={() => {
          startNewSession()
          notify('New session started. Clean slate.')
        }}
        onClose={() => setResetOpen(false)}
      />

      <ConfirmDialog
        open={wipeOpen}
        title="Erase everything?"
        body={
          <p>
            Every player, every round, every chess match and all-time record is deleted. Export a backup
            first if there is any doubt.
          </p>
        }
        confirmLabel="Erase all data"
        danger
        onConfirm={() => {
          wipePlayers()
          notify('Board wiped. Fresh start.', undefined, 'danger')
        }}
        onClose={() => setWipeOpen(false)}
      />
    </div>
  )
}
