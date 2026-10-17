/**
 * The abuse layer. Keep it loud, keep it funny, keep it about the game.
 */

const LOSS_ROASTS = [
  '{name} folded like a cheap chair.',
  'Another L for {name}. Collect them, maybe they are worth something.',
  '{name} is the Bhabhi. The group chat has been notified.',
  'Certified thulla behaviour from {name}.',
  '{name} could not escape a paper bag.',
  'Somebody check on {name}. Actually, do not.',
  '{name} has been farming losses all afternoon.',
  'A masterclass in being terrible. Take a bow, {name}.',
  '{name} plays like the cards owe him money.',
  'Sit down, {name}. You are the Bhabhi again.',
  '{name} just donated another round to the cause.',
  'That was not bad luck, {name}. That was you.',
  '{name} is the reason the group chat exists.',
  'Somewhere, {name} is explaining how it was the deck.',
]

const STREAK_ROASTS = [
  '{name} is on {n} in a row. This is a lifestyle now.',
  '{n} straight for {name}. At this point it is a career.',
  '{name} has lost {n} rounds in a row. Seek help.',
  'A {n}-loss streak for {name}. Historic. Pathetic. Beautiful.',
]

const CLEAN_SHEET_LINES = [
  '{name} has not lost once. Suspicious. Probably cheating.',
  '{name} is untouched. Enjoy it, it will not last.',
  '{name} is walking around like he won something.',
]

const CHALLAN_VERDICTS = [
  'Verdict: guilty of crimes against cards.',
  'Verdict: guilty. Sentence: chai duty for the week.',
  'Verdict: no defence offered, none possible.',
  'Verdict: guilty of wasting everyone\'s break.',
  'Verdict: the deck has filed a complaint.',
]

export function pickRoast(name: string, streak = 0): string {
  const pool = streak >= 3 ? STREAK_ROASTS : LOSS_ROASTS
  const line = pool[Math.floor(Math.random() * pool.length)]
  return line.replaceAll('{name}', name).replaceAll('{n}', String(streak))
}

export function pickCleanSheetLine(name: string): string {
  return CLEAN_SHEET_LINES[Math.floor(Math.random() * CLEAN_SHEET_LINES.length)].replaceAll(
    '{name}',
    name,
  )
}

export function pickVerdict(): string {
  return CHALLAN_VERDICTS[Math.floor(Math.random() * CHALLAN_VERDICTS.length)]
}

export const HERO_LINES = [
  'Who got stuck with the last card?',
  'Point at the loser.',
  'Somebody has to be the Bhabhi.',
  'Name the disgrace.',
]

export function pickHeroLine(seed: number): string {
  return HERO_LINES[Math.abs(seed) % HERO_LINES.length]
}

const SPOKEN_LINES = [
  '{name} is the Bhabhi.',
  'Again, {name}. Embarrassing.',
  '{name}, you are a thulla.',
  'Shame on you, {name}.',
  '{name} loses. As expected.',
  'Another one for {name}.',
]

const SPOKEN_CHESS = [
  '{name} got checkmated.',
  'Sit down, {name}.',
  '{name} loses again.',
]

export function spokenBhabhi(name: string): string {
  return SPOKEN_LINES[Math.floor(Math.random() * SPOKEN_LINES.length)].replaceAll('{name}', name)
}

export function spokenChess(name: string): string {
  return SPOKEN_CHESS[Math.floor(Math.random() * SPOKEN_CHESS.length)].replaceAll('{name}', name)
}
