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

export type CueGroup = 'hits' | 'voices' | 'desi' | 'comedy' | 'crowd'

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
  { id: 'desi', label: 'Desi memes' },
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

  { id: 'thulla', label: 'Thulla!', emoji: '🫵', group: 'desi', weight: 4, file: '/audio/thulla.mp3' },
  { id: 'moye', label: 'Moye Moye', emoji: '🌀', group: 'desi', weight: 4, file: '/audio/moye.mp3' },
  { id: 'goop', label: 'Goop Goop', emoji: '🫠', group: 'desi', weight: 3, file: '/audio/goop.mp3' },
  { id: 'thappad-dialogue', label: 'Thappad!', emoji: '✋', group: 'desi', weight: 4, file: '/audio/thappad-dialogue.mp3' },
  { id: 'aukaat', label: 'Apni Aukaat', emoji: '🫳', group: 'desi', weight: 3, file: '/audio/aukaat.mp3' },
  { id: 'padhai', label: 'Padhai Karo', emoji: '📚', group: 'desi', weight: 3, file: '/audio/padhai.mp3' },
  { id: 'uth-jaa', label: 'Uth Jaa', emoji: '🛌', group: 'desi', weight: 3, file: '/audio/uth-jaa.mp3' },
  { id: 'maza', label: 'Maza Aayega', emoji: '🍿', group: 'desi', weight: 3, file: '/audio/maza.mp3' },
  { id: 'chappal', label: 'Chappal', emoji: '🩴', group: 'desi', weight: 3, file: '/audio/chappal.mp3' },
  { id: 'chappal-kadke', label: 'Chappal Kadke', emoji: '👡', group: 'desi', weight: 2, file: '/audio/chappal-kadke.mp3' },
  { id: 'bruh', label: 'Bruh', emoji: '😐', group: 'desi', weight: 3, file: '/audio/bruh.mp3' },
  { id: 'kya-baat', label: 'Kya Baat Hui', emoji: '🤨', group: 'desi', weight: 2, file: '/audio/kya-baat.mp3' },
  { id: 'mazak', label: 'Kaisa Mazak', emoji: '😏', group: 'desi', weight: 2, file: '/audio/mazak.mp3' },
  { id: 'oye-hoye', label: 'Oye Hoye', emoji: '🕺', group: 'desi', weight: 2, file: '/audio/oye-hoye.mp3' },
  { id: 'haye', label: 'Haye', emoji: '😵', group: 'desi', weight: 2, file: '/audio/haye.mp3' },
  { id: 'uff', label: 'Uff', emoji: '😮‍💨', group: 'desi', weight: 2, file: '/audio/uff.mp3' },
  { id: 'acha-ji', label: 'Acha Ji', emoji: '🙃', group: 'desi', weight: 2, file: '/audio/acha-ji.mp3' },
  { id: 'sudhar', label: 'Sudhar Jao', emoji: '🛐', group: 'desi', weight: 2, file: '/audio/sudhar.mp3' },
  { id: 'chup', label: 'Chup Kar', emoji: '🤫', group: 'desi', weight: 2, file: '/audio/chup.mp3' },
  { id: 'pagal', label: 'Pagal', emoji: '🤪', group: 'desi', weight: 2, file: '/audio/pagal.mp3' },
  { id: 'bhot-maza', label: 'Bhot Maza', emoji: '🎊', group: 'desi', weight: 1, file: '/audio/bhot-maza.mp3' },

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

function softClipCurve(): Float32Array<ArrayBuffer> {
  const samples = 2048
  const curve = new Float32Array(new ArrayBuffer(samples * 4))
  const knee = 0.7
  for (let i = 0; i < samples; i += 1) {
    const x = (i / (samples - 1)) * 2 - 1
    const a = Math.abs(x)
    const y = a <= knee ? a : knee + (1 - knee) * Math.tanh((a - knee) / (1 - knee))
    curve[i] = Math.sign(x) * y
  }
  return curve
}

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

      // Clips are peak-normalised to about -1 dBFS. A soft-knee shaper sits on the
      // master bus so a 15-sound slap storm saturates instead of clipping.
      const shaper = ctx.createWaveShaper()
      shaper.curve = softClipCurve()
      shaper.oversample = '2x'
      master.connect(shaper)
      shaper.connect(ctx.destination)
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
    // The sounds that fire on a tap load first; the rest can wait.
    const eager = CUES.filter((cue) => cue.group === 'hits' || cue.group === 'voices')
    preloadPromise = Promise.all(eager.map((cue) => loadOne(cue)))
      .then(() => undefined)
      .catch(() => undefined)
    void preloadPromise.then(() => {
      window.setTimeout(() => {
        void Promise.all(
          CUES.filter((cue) => cue.group !== 'hits' && cue.group !== 'voices').map((cue) => loadOne(cue)),
        )
      }, 1200)
    })
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

export async function playCue(cue: Cue, gainMultiplier = 1): Promise<void> {
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
  gain.gain.value = gainMultiplier

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

/**
 * The tap response: every slap and every voice clip, staggered by 55 ms, plus a few
 * desi memes. A wall of sound rather than one polite sound effect.
 */
export function playStorm(): void {
  const hits = CUES.filter((cue) => cue.group === 'hits')
  const voices = CUES.filter((cue) => cue.group === 'voices')
  const desi = CUES.filter((cue) => cue.group === 'desi')
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
  const sequence = [...hits, ...voices, ...desi]
  sequence.forEach((cue, index) => {
    window.setTimeout(() => {
      void playCue(cue, 0.55)
    }, index * 42)
  })
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
