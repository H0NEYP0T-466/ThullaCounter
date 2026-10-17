# ThullaBoard

The indisputable record of who lost at Bhabhi Thulla and chess during university breaks.
One tap per loss, automatic shame, WhatsApp challans ready to paste.

Runs entirely in the browser. No backend, no accounts, no database — everything lives in `localStorage` on the phone that keeps score.

## What it does

- **Roster** — add friends, rename by tapping a name, toggle who is at the table without deleting anyone.
- **Bhabhi Thulla** — one big tap target per player. Tap the loser, their count and losing streak go up, the round counter moves.
- **Chess** — pick white and black, record a win either way or a draw. Head-to-head scorelines update instantly (`Fezan 4 — 2 Shoaib`).
- **Hall of Shame** — ranked by losses, with a crown on the current Chief Bhabhi, a Clean Sheet badge for anyone untouched, and a Today / All-time switch.
- **Soundboard** — 30 real clips: slaps and punches, pained voices, clown horn, sad trombone, bad-joke drums, vine boom, wrong-answer buzzer, crowd laugh/boo/cheer, shame siren. A weighted random one fires on every recorded loss, with pitch drift so repeats don't sound canned. Global mute and volume live in the header, every clip can be previewed, and an optional **Announcer** reads the verdict out loud using the device's own voice.
- **Challan** — per-player receipt formatted for WhatsApp, plus a full session receipt for the group chat. Copy or open WhatsApp directly.
- **Portability** — auto-saves locally, JSON export/import for backups and phone transfers, and "Start new session" clears today while keeping all-time records.
- **Undo** — every recorded loss gets an Undo button in the toast, because thumbs slip.

## Run it

```bash
npm install
npm run dev
```

```bash
npm run build     # type-check + production bundle in dist/
npm run preview   # serve the built bundle
npm run lint
```

## Deploy to Vercel

Import the repo, keep the detected defaults (framework: Vite, build: `npm run build`, output: `dist`). No environment variables, no rewrites, no server.

Or from the CLI:

```bash
npx vercel --prod
```

## How the data is shaped

One JSON blob under the key `thullaboard.v1`:

```ts
{
  version: 1,
  players: [{ id, name, emoji, active, createdAt }],
  sessions: [{ id, startedAt, endedAt }],
  currentSessionId: string,
  bhabhi: [{ id, playerId, sessionId, ts }],
  chess: [{ id, p1, p2, result: 'p1' | 'p2' | 'draw', sessionId, ts }],
  settings: { muted, volume }
}
```

Nothing is overwritten when a session resets — a new session row is appended, so all-time totals are just "all entries". Imports run through a sanitiser, so a hand-edited or truncated backup cannot brick the board.

## Notes

- Audio is 30 licensed MP3s (~570 KB total) decoded into `AudioBuffer`s once, so taps play instantly. A synthesised slap takes over if a file cannot be fetched. Credits: `public/audio/CREDITS.md`. The first tap unlocks audio (mobile browser rule).
- Losses are recorded optimistically and persist immediately; there is no save button anywhere.
- Layout is built for a phone held over a table: 44px+ tap targets, safe-area padding, sticky header, dark theme.
