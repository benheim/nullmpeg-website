import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

type NoiseLine = {
  id: number
  text: string
  topVh: number
  durationMs: number
  createdAt: number
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

// lightweight zalgo (readable at low chaos, cursed at high)
const Z_UP = ['\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343', '\u0344', '\u034a', '\u034b', '\u034c', '\u0303', '\u0302', '\u030c', '\u0350', '\u0300', '\u0301', '\u030b', '\u030f', '\u0312', '\u0313', '\u0314', '\u033d', '\u0309']
const Z_MID = ['\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327', '\u0328', '\u0334', '\u0335', '\u0336', '\u034f', '\u035c', '\u035d', '\u035e', '\u035f', '\u0360', '\u0362', '\u0338', '\u0337', '\u0361']
const Z_DOWN = ['\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f', '\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a', '\u032b', '\u032c', '\u032d', '\u032e', '\u032f', '\u0330', '\u0331', '\u0332', '\u0333', '\u0339', '\u033a', '\u033b', '\u033c', '\u0345', '\u0347', '\u0348', '\u0349', '\u034d', '\u034e']

function zalgo(input: string, chaos: number) {
  const t = Math.max(0, Math.min(1, chaos))
  const base = 1
  const maxExtra = 11
  const k = Math.pow(t, 1.7)
  const marks = base + Math.floor(k * maxExtra)

  let out = ''
  for (const ch of input) {
    out += ch
    if (ch === ' ') continue
    const perChar = Math.max(0, Math.floor(marks * (0.35 + Math.random() * 0.75)))
    for (let i = 0; i < perChar; i++) {
      const r = Math.random()
      const pick = r < 0.45 ? Z_UP : r < 0.7 ? Z_DOWN : Z_MID
      out += pick[Math.floor(Math.random() * pick.length)]
    }
  }
  return out
}

function indentPrefix() {
  const arrows = Math.floor(rand(0, 5))
  const spaces = Math.floor(rand(0, 6))
  return `${'>'.repeat(arrows)}${' '.repeat(spaces)}`
}

export default function App() {
  const links = useMemo(
    () => [
      { label: 'instagram', href: 'https://www.instagram.com/null.mpeg/' },
      { label: 'youtube', href: 'https://www.youtube.com/@Null_mpeg/shorts' },
      { label: 'twitch', href: 'https://www.twitch.tv/null_mpeg' },
      {
        label: 'spotify',
        href: 'https://open.spotify.com/artist/4Db2WIEyGGR2DBvYQcewA9?si=AAW1RtmmRkK9QMnCiGDheg',
      },
    ],
    []
  )

  const [noise, setNoise] = useState<NoiseLine[]>([])
  const nextId = useRef(1)

  useEffect(() => {
    // full-line noise phrases
    const phrases = [
      'SIGNAL LOST //',
      'NULLMPEG',
      'ENTER THE RITUAL',
      'NO CARRIER',
      'AUDIOVISUAL ENTITY',
      'REALTIME',
      'DONT LOOK AWAY',
      'YOU ARE HERE',
      '>>>',
    ]

    const tick = () => {
      const now = Date.now()
      setNoise((prev) => prev.filter((n) => now - n.createdAt < n.durationMs + 250))

      // spawn sometimes
      if (Math.random() < 0.32) {
        const phrase = phrases[Math.floor(Math.random() * phrases.length)]
        const tail = phrases[Math.floor(Math.random() * phrases.length)]
        const text = zalgo(`${phrase} ${tail} ${phrase} ${tail} ${phrase}`, rand(0.55, 0.98))

        const line: NoiseLine = {
          id: nextId.current++,
          text,
          topVh: rand(6, 94),
          // half speed again (even longer duration)
          durationMs: Math.floor(rand(28000, 56000)),
          createdAt: now,
        }
        setNoise((prev) => [...prev, line].slice(-10))
      }
    }

    const t = window.setInterval(tick, 1100)
    return () => window.clearInterval(t)
  }, [])

  const [email, setEmail] = useState('')
  const [savedMsg, setSavedMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const saveTimer = useRef<number | null>(null)

  async function saveEmail(e: React.FormEvent) {
    e.preventDefault()
    const v = email.trim()
    if (!v) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch('https://api.buttondown.email/v1/subscribers', {
        method: 'POST',
        headers: {
          'Authorization': 'Token 9d65cb5c-a82f-4718-9baf-9858e145709a',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: v,
          tags: ['website'],
        }),
      })

      if (response.ok) {
        setEmail('')
        setSavedMsg('✓ subscribed')
      } else if (response.status === 400) {
        // Likely already subscribed
        const data = await response.json()
        if (JSON.stringify(data).toLowerCase().includes('already')) {
          setSavedMsg('already subscribed')
        } else {
          setSavedMsg('error - invalid email')
        }
      } else {
        setSavedMsg('error - try again')
      }
    } catch (err) {
      setSavedMsg('error - no connection')
    } finally {
      setIsSubmitting(false)
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
      saveTimer.current = window.setTimeout(() => setSavedMsg(null), 3000)
    }
  }

  const linksTitle = useMemo(() => zalgo('links', 0.22), [])
  const mailTitle = useMemo(() => zalgo('mailing list', 0.18), [])
  const twitchTitle = useMemo(() => zalgo('twitch', 0.2), [])

  // ASCII logo art (zalgoified) - BIG version with large ø - ANIMATED
  const baseAsciiLines = useMemo(() => [
    '          ██████╗                                ██████╗',
    '         ██╔════╝                              ╚════██║',
    '        ██║                                          ██║',
    '       ██║              ████████████╗                ██║',
    '      ██║             ██╔══════════╝╚══╗              ██║',
    '     ██║             ██║       ████╗   ║              ██║',
    '    ██║             ██║      ██╔══██╗  ║               ██║',
    '   ██║              ██║     ██║    ██  ║               ██║',
    '  ██║               ██║     ██║   ███  ║                ██║',
    ' ██║                ██║     ██║  ████  ║                 ██║',
    ' ██║                ██║      ██████╔╝  ║                 ██║',
    '██║                 ██║       ████    ║                  ██║',
    '██║                  ██╗          ╔═══╝                  ██║',
    '██║                   ██████████████                     ██║',
    '██║                                                      ██║',
    '██║                                                      ██║',
    '██║                       N u l l .                      ██║',
    '██║                                                      ██║',
    ' ██║                         ø                          ██║',
    ' ██║                                                    ██║',
    '  ██║                      « . »                       ██║',
    '   ██║                                                ██║',
    '    ██║                     { }                      ██║',
    '     ██║                                            ██║',
    '      ██║                                          ██║',
    '       ╚██████████████████████████████████████████╝',
  ], [])

  const [asciiLogo, setAsciiLogo] = useState('')

  useEffect(() => {
    const regenerate = () => {
      const corrupted = baseAsciiLines.map((line) => zalgo(line, rand(0.22, 0.42))).join('\n')
      setAsciiLogo(corrupted)
    }
    regenerate()
    const t = window.setInterval(regenerate, 3200)
    return () => window.clearInterval(t)
  }, [baseAsciiLines])

  // YouTube embed position: "randomly on the right" on load
  const [ytPos] = useState(() => ({
    topVh: rand(18, 72),
    rightPx: Math.floor(rand(16, 64)),
    rotDeg: rand(-5, 6),
  }))

  const twitchSrc = useMemo(() => {
    const host = window.location.hostname
    const params = new URLSearchParams()
    params.set('channel', 'null_mpeg')

    // Twitch requires explicit parent whitelisting.
    // We include the current host plus likely deploy hostnames.
    const parents = new Set([
      host,
      'nullmpeg.xyz',
      'www.nullmpeg.xyz',
      'localhost',
    ])
    
    // Also add Vercel preview domains if detected
    if (host.endsWith('.vercel.app')) {
      parents.add(host)
    }
    
    for (const p of parents) params.append('parent', p)

    return `https://player.twitch.tv/?${params.toString()}`
  }, [])

  return (
    <div className="y2k">
      {/* noise */}
      <div className="noiseLayer" aria-hidden>
        {noise.map((n) => (
          <div
            key={n.id}
            className="noiseLine"
            style={
              {
                top: `${n.topVh}vh`,
                animationDuration: `${n.durationMs}ms`,
              } as React.CSSProperties
            }
          >
            {n.text}
          </div>
        ))}
      </div>

      {/* random right-side youtube embed */}
      <div
        className="ytFloat"
        style={
          {
            top: `${ytPos.topVh}vh`,
            right: `${ytPos.rightPx}px`,
            transform: `rotate(${ytPos.rotDeg}deg)`,
          } as React.CSSProperties
        }
      >
        <iframe
          title="youtube"
          width="360"
          height="203"
          src="https://www.youtube-nocookie.com/embed/VeJZgY2saqU"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <main className="content">
        <h1 className="title">{zalgo('null.', 0.25)}</h1>
        <p className="sub">audiovisual performance entity</p>

        <div className="block">
          <div className="h2">{linksTitle}</div>
          {links.map((l) => (
            <div className="line" key={l.label}>
              <span className="prefix">{indentPrefix()}</span>
              <a href={l.href} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            </div>
          ))}
        </div>

        <div className="block">
          <div className="h2">{mailTitle}</div>
          <form className="mail" onSubmit={saveEmail}>
            <span className="prefix">{indentPrefix()}</span>
            <label>
              email:{' '}
              <input
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder="email@domain.com"
                type="email"
                autoComplete="email"
                disabled={isSubmitting}
              />
            </label>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'sending...' : 'submit'}
            </button>
            {savedMsg && <span className="saved">{savedMsg}</span>}
          </form>
        </div>

        <div className="block">
          <div className="h2">{twitchTitle}</div>
          <div className="tiny">(embed)</div>
          <div className="embedWrap">
            <iframe title="twitch" src={twitchSrc} height="260" width="100%" allowFullScreen />
          </div>
        </div>

        <footer className="footer">
          <span className="tiny">nullmpeg.xyz</span>
        </footer>
      </main>

      {/* ASCII logo art - bottom center */}
      <div className="asciiLogo" aria-hidden>
        <pre>{asciiLogo}</pre>
      </div>
    </div>
  )
}
