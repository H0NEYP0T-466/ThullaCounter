/**
 * Every sound is synthesised with the Web Audio API — no audio files, no network,
 * so the board still roasts people on a hostel wifi that has given up.
 */

type AudioContextCtor = typeof AudioContext

let ctx: AudioContext | null = null
let master: GainNode | null = null
let muted = false
let volume = 0.7
let lastCueId = ''

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
      master.gain.value = muted ? 0 : volume
      master.connect(ctx.destination)
    } catch {
      return null
    }
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function configureAudio(next: { muted: boolean; volume: number }): void {
  muted = next.muted
  volume = next.volume
  if (master && ctx) {
    master.gain.setTargetAtTime(muted ? 0 : volume, ctx.currentTime, 0.02)
  }
}

/** Must be called from a real user gesture once, or mobile browsers stay silent. */
export function unlockAudio(): void {
  const context = getContext()
  if (!context) return
  if (context.state === 'suspended') void context.resume()
}

type ToneOptions = {
  freq: number
  endFreq?: number
  type?: OscillatorType
  duration?: number
  gain?: number
  delay?: number
  detune?: number
  filter?: number
}

function tone(context: AudioContext, out: AudioNode, options: ToneOptions): void {
  const {
    freq,
    endFreq,
    type = 'sine',
    duration = 0.25,
    gain = 0.5,
    delay = 0,
    detune = 0,
    filter,
  } = options
  const start = context.currentTime + delay
  const osc = context.createOscillator()
  const amp = context.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  if (endFreq && endFreq !== freq) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), start + duration)
  }
  osc.detune.setValueAtTime(detune, start)

  amp.gain.setValueAtTime(0.0001, start)
  amp.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), start + 0.012)
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration)

  let node: AudioNode = osc
  if (filter) {
    const biquad = context.createBiquadFilter()
    biquad.type = 'lowpass'
    biquad.frequency.setValueAtTime(filter, start)
    osc.connect(biquad)
    node = biquad
  }
  node.connect(amp)
  amp.connect(out)
  osc.start(start)
  osc.stop(start + duration + 0.05)
}

function noise(
  context: AudioContext,
  out: AudioNode,
  options: { duration?: number; gain?: number; delay?: number; freq?: number; q?: number },
): void {
  const { duration = 0.15, gain = 0.4, delay = 0, freq = 1600, q = 0.9 } = options
  const start = context.currentTime + delay
  const frames = Math.max(1, Math.floor(context.sampleRate * duration))
  const buffer = context.createBuffer(1, frames, context.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < frames; i += 1) {
    const falloff = 1 - i / frames
    data[i] = (Math.random() * 2 - 1) * falloff * falloff
  }
  const source = context.createBufferSource()
  source.buffer = buffer
  const biquad = context.createBiquadFilter()
  biquad.type = 'bandpass'
  biquad.frequency.setValueAtTime(freq, start)
  biquad.Q.setValueAtTime(q, start)
  const amp = context.createGain()
  amp.gain.setValueAtTime(gain, start)
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  source.connect(biquad)
  biquad.connect(amp)
  amp.connect(out)
  source.start(start)
}

export type Cue = {
  id: string
  label: string
  emoji: string
  play: (context: AudioContext, out: AudioNode) => void
}

export const CUES: Cue[] = [
  {
    id: 'slap',
    label: 'Thappad',
    emoji: '👋',
    play: (context, out) => {
      noise(context, out, { duration: 0.13, gain: 0.75, freq: 2100, q: 0.7 })
      tone(context, out, { freq: 180, endFreq: 60, type: 'sine', duration: 0.18, gain: 0.5 })
    },
  },
  {
    id: 'clown',
    label: 'Clown Horn',
    emoji: '🤡',
    play: (context, out) => {
      tone(context, out, { freq: 320, endFreq: 560, type: 'sawtooth', duration: 0.18, gain: 0.3, filter: 2200 })
      tone(context, out, { freq: 330, endFreq: 520, type: 'square', duration: 0.18, gain: 0.16, delay: 0.02, filter: 1800 })
      tone(context, out, { freq: 540, endFreq: 300, type: 'sawtooth', duration: 0.3, gain: 0.28, delay: 0.2, filter: 2000 })
    },
  },
  {
    id: 'drama',
    label: 'Soap Opera Sting',
    emoji: '🎭',
    play: (context, out) => {
      const chord = [293.66, 349.23, 440, 587.33]
      chord.forEach((freq, index) => {
        tone(context, out, {
          freq,
          type: 'triangle',
          duration: 1.35,
          gain: 0.16,
          delay: index * 0.015,
          detune: index % 2 === 0 ? -6 : 6,
        })
      })
      tone(context, out, { freq: 110, endFreq: 42, type: 'sine', duration: 1.1, gain: 0.4 })
      noise(context, out, { duration: 0.6, gain: 0.09, freq: 4000, q: 0.4 })
    },
  },
  {
    id: 'trombone',
    label: 'Sad Trombone',
    emoji: '🎺',
    play: (context, out) => {
      const notes = [233.08, 220, 207.65, 185]
      notes.forEach((freq, index) => {
        tone(context, out, {
          freq,
          endFreq: freq * 0.94,
          type: 'sawtooth',
          duration: index === 3 ? 0.65 : 0.24,
          gain: 0.26,
          delay: index * 0.26,
          filter: 1100,
        })
      })
    },
  },
  {
    id: 'airhorn',
    label: 'Airhorn',
    emoji: '📢',
    play: (context, out) => {
      const bursts = [0, 0.16, 0.32]
      bursts.forEach((delay, index) => {
        const hold = index === 2 ? 0.42 : 0.11
        ;[415, 440, 466].forEach((freq) => {
          tone(context, out, {
            freq,
            type: 'sawtooth',
            duration: hold,
            gain: 0.11,
            delay,
            detune: (freq - 440) * 4,
            filter: 2600,
          })
        })
      })
    },
  },
  {
    id: 'boom',
    label: 'Cinematic Boom',
    emoji: '💥',
    play: (context, out) => {
      tone(context, out, { freq: 150, endFreq: 38, type: 'sine', duration: 0.95, gain: 0.6 })
      noise(context, out, { duration: 0.5, gain: 0.28, freq: 320, q: 0.5 })
      tone(context, out, { freq: 78, endFreq: 30, type: 'triangle', duration: 0.7, gain: 0.3, delay: 0.04 })
    },
  },
  {
    id: 'buzzer',
    label: 'Wrong Answer',
    emoji: '🚫',
    play: (context, out) => {
      tone(context, out, { freq: 138, type: 'square', duration: 0.22, gain: 0.24, filter: 900 })
      tone(context, out, { freq: 104, type: 'square', duration: 0.3, gain: 0.24, delay: 0.24, filter: 800 })
    },
  },
  {
    id: 'sparkle',
    label: 'Villain Laugh',
    emoji: '😈',
    play: (context, out) => {
      for (let i = 0; i < 5; i += 1) {
        tone(context, out, {
          freq: 300 - i * 22,
          endFreq: 260 - i * 20,
          type: 'sawtooth',
          duration: 0.1,
          gain: 0.16,
          delay: i * 0.13,
          filter: 1200,
        })
      }
      tone(context, out, { freq: 90, endFreq: 55, type: 'sine', duration: 0.8, gain: 0.2 })
    },
  },
]

export function playCue(cue: Cue): void {
  const context = getContext()
  if (!context || !master) return
  if (muted || volume <= 0) return
  try {
    cue.play(context, master)
  } catch {
    // A blocked audio context must never break scoring.
  }
}

export function playRandomLossCue(): Cue | null {
  if (CUES.length === 0) return null
  const pool = CUES.filter((cue) => cue.id !== lastCueId)
  const cue = pool[Math.floor(Math.random() * pool.length)] ?? CUES[0]
  lastCueId = cue.id
  playCue(cue)
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
