import type { AppState } from '../types'
import type { Leaderboard, PlayerStats } from './stats'
import { sessionLabel } from './stats'
import { pickVerdict } from './roasts'

export function rankTitle(stats: PlayerStats, leaderboard: Leaderboard): string {
  if (stats.gamesAll === 0) return 'Unproven Rookie'
  if (stats.lossesAll === 0) return 'Clean Sheet Merchant'
  if (leaderboard.chiefId === stats.player.id) return 'Chief Bhabhi'
  if (stats.rank <= 3) return 'Certified Thulla'
  return 'Wall of Shame Regular'
}

export function rankBadge(stats: PlayerStats, leaderboard: Leaderboard): string {
  if (stats.gamesAll === 0) return '🫥'
  if (stats.lossesAll === 0) return '🕊️'
  if (leaderboard.chiefId === stats.player.id) return '👑'
  if (stats.rank <= 3) return '🤡'
  return '💀'
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function buildChallan(stats: PlayerStats, leaderboard: Leaderboard): string {
  const name = stats.player.name
  const title = rankTitle(stats, leaderboard)
  const total = leaderboard.stats.length
  const place = stats.rank === 1 ? 'dead last where it matters' : stats.rank <= 3 ? 'near the bottom' : 'somehow not the worst'
  const lines: string[] = []

  lines.push('🚨 *OFFICIAL BHABHI CHALLAN* 🚨')
  lines.push('━━━━━━━━━━━━━━━')
  lines.push(`👤 Offender: *${name}*`)
  lines.push(`🏅 Sentence: ${title}`)
  lines.push(`📉 Total losses: *${stats.lossesAll}*`)
  lines.push(`   • Bhabhi Thulla: ${stats.bhabhiAll}`)
  lines.push(`   • Chess: ${stats.chessLosses}`)
  if (stats.streak > 1) {
    lines.push(`🔥 Currently on: *${stats.streak} losses in a row*`)
  }
  if (stats.bestStreak > 2) {
    lines.push(`📈 Career worst: ${stats.bestStreak} in a row`)
  }
  lines.push(`♟️ Chess record: ${stats.chessWins}W · ${stats.chessLosses}L · ${stats.chessDraws}D`)
  lines.push(`🎮 Games on record: ${stats.gamesAll}`)
  lines.push(`📊 Rank: #${stats.rank} of ${total} — ${place}`)
  lines.push('━━━━━━━━━━━━━━━')

  if (stats.lossesAll === 0 && stats.gamesAll > 0) {
    lines.push('✅ Zero losses. Either a genius or a coward.')
  } else if (stats.streak >= 3) {
    lines.push(`💰 FINE: ${stats.streak} chai + samosa. Pay up before the next break.`)
  } else if (leaderboard.chiefId === stats.player.id) {
    lines.push('💰 FINE: 2 chai + 1 samosa + one (1) public apology in the group.')
  } else {
    lines.push('💰 FINE: 1 chai. Cheap, but so is the performance.')
  }

  lines.push(`⚖️ ${pickVerdict()}`)
  lines.push(`📅 ${formatDate(Date.now())} · ThullaBoard`)
  return lines.join('\n')
}

export function buildSessionReceipt(state: AppState, leaderboard: Leaderboard): string {
  const lines: string[] = []
  const losers = leaderboard.stats.filter((row) => row.lossesSession > 0)
  const clean = leaderboard.stats.filter((row) => row.gamesSession > 0 && row.lossesSession === 0)

  lines.push('🧾 *THULLA SESSION RECEIPT*')
  lines.push(`📅 ${sessionLabel(state)}`)
  lines.push('━━━━━━━━━━━━━━━')
  lines.push(`🃏 Bhabhi rounds: ${leaderboard.sessionBhabhi}`)
  lines.push(`♟️ Chess matches: ${leaderboard.sessionChess}`)

  if (losers.length > 0) {
    lines.push('')
    lines.push('*Wall of Shame*')
    losers.forEach((row, index) => {
      const crown = leaderboard.chiefId === row.player.id ? '👑 ' : ''
      lines.push(`${index + 1}. ${crown}${row.player.name} — ${row.lossesSession} L`)
    })
  }

  if (clean.length > 0) {
    lines.push('')
    lines.push(`🕊️ Clean sheet: ${clean.map((row) => row.player.name).join(', ')}`)
  }

  const chief = leaderboard.chiefId ? leaderboard.byId[leaderboard.chiefId] : null
  if (chief) {
    lines.push('')
    lines.push(`👑 Chief Bhabhi: *${chief.player.name}*`)
    lines.push('Chai is on you. No excuses, no appeals.')
  } else {
    lines.push('')
    lines.push('😴 Nobody lost anything. Suspicious. Check the deck.')
  }

  lines.push('━━━━━━━━━━━━━━━')
  lines.push('📊 Tracked on ThullaBoard. Screenshot this.')
  return lines.join('\n')
}

export function whatsappLink(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fall through to the legacy path.
  }
  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  } catch {
    return false
  }
}
