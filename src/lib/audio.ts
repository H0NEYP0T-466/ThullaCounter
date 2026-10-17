/**
 * Real recordings, not beeps.
 *
 * Every cue is a trimmed, peak-normalised mono MP3 in /public/audio, decoded once
 * into AudioBuffers so playback is instant even on a cold tap.
 * Source: Mixkit free sound effects (see public/audio/CREDITS.md).
 *
 * If a file fails to load (offline, blocked, deleted), a synthesised slap keeps
 * the board from going silent.
 */

export type CueGroup = 'hits' | 'voices' | 'comedy' | 'crowd'

export type Cue = {
  id: string
  label: string
  emoji: string
  group: CueGroup
  weight?: number
  file: string
}

export const CUE_GROUPS: { id: CueGroup; label: string }[] = [
  { id: 'hits', label: 'Slaps & hits' },
  { id: 'voices', label: 'Voices' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'crowd', label: 'Crowd & stingers' },
]

export const CUES: Cue[] = [
  { id: 'thappad', label: 'Thappad', emoji: '👋', group: 'hits', weight: 6, file: '/audio/thappad.mp3' },
  { id: 'jordaar', label: 'Jordaar Thappad', emoji: '🖐️', group: 'hits', weight: 5, file: '/audio/jordaar.mp3' },
  { id: 'chanta', label: 'Chanta', emoji: '💢', group: 'hits', weight: 4, file: '/audio/chanta.mp3' },
  { id: 'hard-hit', label: 'Hard Hit', emoji: '👊', group: 'hits', weight: 4, file: '/audio/hard-hit.mp3' },
  { id: 'combo', label: 'Punch Combo', emoji: '🥊', group: 'hits', weight: 2, file: '/audio/combo.mp3' },
  { id: 'boxer', label: 'Boxer Down', emoji: '🤕', group: 'hits', weight: 2, file: '/audio/boxer.mp3' },
  { id: 'blow', label: 'Direct Blow', emoji: '🥴', group: 'hits', weight: 4, file: '/audio/blow.mp3' },
  { id: 'kungfu', label: 'Kung Fu Strike', emoji: '🥋', group: 'hits', weight: 2, file: '/audio/kungfu.mp3' },

  { id: 'oww', label: 'Oww!', emoji: '😖', group: 'voices', weight: 4, file: '/audio/oww.mp3' },
  { id: 'effort', label: 'Haan!', emoji: '😤', group: 'voices', weight: 2, file: '/audio/effort.mp3' },
  { id: 'arre', label: 'Arre Yaar', emoji: '🗣️', group: 'voices', weight: 3, file: '/audio/arre.mp3' },
  { id: 'donkey', label: 'Donkey Scream', emoji: '🫏', group: 'voices', weight: 3, file: '/audio/donkey.mp3' },
  { id: 'man-pain', label: 'Man in Pain', emoji: '😫', group: 'voices', weight: 3, file: '/audio/man-pain.mp3' },
  { id: 'ah-pain', label: 'Ah!', emoji: '😵', group: 'voices', weight: 2, file: '/audio/ah-pain.mp3' },

  { id: 'clown', label: 'Clown Horn', emoji: '🤡', group: 'comedy', weight: 3, file: '/audio/clown.mp3' },
  { id: 'trombone', label: 'Sad Trombone', emoji: '🎺', group: 'comedy', weight: 3, file: '/audio/trombone.mp3' },
  { id: 'boing', label: 'Boing', emoji: '🪀', group: 'comedy', weight: 2, file: '/audio/boing.mp3' },
  { id: 'bad-joke', label: 'Bad Joke Drums', emoji: '🥁', group: 'comedy', weight: 2, file: '/audio/bad-joke.mp3' },
  { id: 'fail-piano', label: 'Fail Piano', emoji: '🎹', group: 'comedy', weight: 2, file: '/audio/fail-piano.mp3' },
  { id: 'game-over', label: 'Game Over', emoji: '🎮', group: 'comedy', weight: 1, file: '/audio/game-over.mp3' },
  { id: 'bell', label: 'Shame Bell', emoji: '🔔', group: 'comedy', weight: 1, file: '/audio/bell.mp3' },

  { id: 'wrong', label: 'Wrong Answer', emoji: '🚫', group: 'crowd', weight: 4, file: '/audio/wrong.mp3' },
  { id: 'vine-boom', label: 'Vine Boom', emoji: '💥', group: 'crowd', weight: 4, file: '/audio/vine-boom.mp3' },
  { id: 'trailer', label: 'Cinematic Boom', emoji: '🎬', group: 'crowd', weight: 2, file: '/audio/trailer.mp3' },
  { id: 'cartoon-laugh', label: 'Cartoon Laugh', emoji: '😂', group: 'crowd', weight: 3, file: '/audio/cartoon-laugh.mp3' },
  { id: 'evil-laugh', label: 'Evil Laugh', emoji: '😈', group: 'crowd', weight: 2, file: '/audio/evil-laugh.mp3' },
  { id: 'crowd-laugh', label: 'Crowd Laugh', emoji: '🍅', group: 'crowd', weight: 2, file: '/audio/crowd-laugh.mp3' },
  { id: 'cheer', label: 'Crowd Cheer', emoji: '🎉', group: 'crowd', weight: 1, file: '/audio/cheer.mp3' },
  { id: 'boo', label: 'Crowd Boo', emoji: '😩', group: 'crowd', weight: 1, file: '/audio/boo.mp3' },
  { id: 'siren', label: 'Shame Siren', emoji: '🚨', group: 'crowd', weight: 1, file: '/audio/siren.mp3' },
]

type AudioContextCtor = typeof AudioContext

let ctx: AudioContext | null = null
let master: GainNode | null = null
let muted = false
let volume = 0.85
let lastCueId = ''
let announcer = true
const buffers = new Map<string, AudioBuffer>()
let preloadPromise: Promise<void> | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor: AudioContextCtor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext
    if (!Ctor) return null
    try {
      ctx = new Ctor()
      master = ctx.createGain()
      master.gain.value = muted ? 0 : volume * 0.95 * 0.95

      // Clips are already peak-normalised to about -1 dBFS, so the master bus is
      // a plain gain with a little headroom. No compression: it only flattens slaps.
      master.connect(ctx.destination)
    } catch {
      return null
    }
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function configureAudio(next: { muted: boolean; volume: number; announcer: boolean }): void {
  muted = next.muted
  volume = next.volume
  announcer = next.announcer
  if (master && ctx) {
    master.gain.setTargetAtTime(muted ? 0 : volume * 0.95, ctx.currentTime, 0.015)
  }
  if (muted && typeof speechSynthesis !== 'undefined') speechSynthesis.cancel()
}

/**
 * The announcer: the device's own voice reading the verdict out loud.
 * Silent (not broken) on machines with no speech engine installed.
 */
export function speakTaunt(text: string): void {
  if (!announcer || muted || volume <= 0) return
  if (typeof speechSynthesis === 'undefined' || typeof SpeechSynthesisUtterance === 'undefined') return
  try {
    const voices = speechSynthesis.getVoices()
    if (voices.length === 0) return
    const pick =
      voices.find((v) => /en[-_](GB|US)/i.test(v.lang) && /male|daniel|alex|arthur|fred/i.test(v.name)) ??
      voices.find((v) => /^en/i.test(v.lang)) ??
      voices[0]
    const line = new SpeechSynthesisUtterance(text)
    line.voice = pick
    line.rate = 0.94
    line.pitch = 0.7
    line.volume = Math.min(1, volume)
    speechSynthesis.cancel()
    speechSynthesis.speak(line)
  } catch {
    // Speech is a bonus, never a dependency.
  }
}

export function stopSpeech(): void {
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel()
}

/** Must be called from a real user gesture once, or mobile browsers stay silent. */
export function unlockAudio(): void {
  const context = getContext()
  if (!context) return
  if (context.state === 'suspended') void context.resume()
  void preloadAudio()
}

async function loadOne(cue: Cue): Promise<AudioBuffer | null> {
  const context = getContext()
  if (!context) return null
  const cached = buffers.get(cue.id)
  if (cached) return cached
  try {
    const response = await fetch(cue.file)
    if (!response.ok) return null
    const data = await response.arrayBuffer()
    const buffer = await context.decodeAudioData(data)
    buffers.set(cue.id, buffer)
    return buffer
  } catch {
    return null
  }
}

export function preloadAudio(): Promise<void> {
  if (!preloadPromise) {
    preloadPromise = Promise.all(CUES.map((cue) => loadOne(cue)))
      .then(() => undefined)
      .catch(() => undefined)
  }
  return preloadPromise
}

/** Last-resort slap, synthesised, used only when a file cannot be fetched. */
function synthSlap(context: AudioContext, out: AudioNode): void {
  const start = context.currentTime
  const frames = Math.floor(context.sampleRate * 0.09)
  const buffer = context.createBuffer(1, frames, context.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < frames; i += 1) {
    const falloff = 1 - i / frames
    data[i] = (Math.random() * 2 - 1) * falloff * falloff
  }
  const source = context.createBufferSource()
  source.buffer = buffer
  const band = context.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 1400
  band.Q.value = 0.7
  const amp = context.createGain()
  amp.gain.setValueAtTime(0.9, start)
  amp.gain.exponentialRampToValueAtTime(0.0001, start + 0.12)
  source.connect(band)
  band.connect(amp)
  amp.connect(out)
  source.start(start)

  const osc = context.createOscillator()
  const thump = context.createGain()
  osc.frequency.setValueAtTime(170, start)
  osc.frequency.exponentialRampToValueAtTime(55, start + 0.16)
  thump.gain.setValueAtTime(0.8, start)
  thump.gain.exponentialRampToValueAtTime(0.0001, start + 0.18)
  osc.connect(thump)
  thump.connect(out)
  osc.start(start)
  osc.stop(start + 0.2)
}

export async function playCue(cue: Cue): Promise<void> {
  const context = getContext()
  if (!context || !master) return
  if (muted || volume <= 0) return

  const buffer = await loadOne(cue)
  if (!buffer) {
    synthSlap(context, master)
    return
  }

  const source = context.createBufferSource()
  source.buffer = buffer
  // A little pitch drift keeps repeats from sounding like a broken button.
  source.playbackRate.value = 0.96 + Math.random() * 0.08

  const gain = context.createGain()
  gain.gain.value = 1

  if (context.createStereoPanner) {
    const panner = context.createStereoPanner()
    panner.pan.value = (Math.random() - 0.5) * 0.35
    source.connect(gain)
    gain.connect(panner)
    panner.connect(master)
  } else {
    source.connect(gain)
    gain.connect(master)
  }

  source.start()
}

export function playRandomLossCue(): Cue | null {
  if (CUES.length === 0) return null
  const pool = CUES.filter((cue) => cue.id !== lastCueId)
  const total = pool.reduce((sum, cue) => sum + (cue.weight ?? 1), 0)
  let ticket = Math.random() * total
  let cue = pool[pool.length - 1]
  for (const candidate of pool) {
    ticket -= candidate.weight ?? 1
    if (ticket <= 0) {
      cue = candidate
      break
    }
  }
  lastCueId = cue.id
  void playCue(cue)
  return cue
}

export function vibrate(pattern: number | number[] = 30): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern)
    } catch {
      // Not supported on this device.
    }
  }
}
