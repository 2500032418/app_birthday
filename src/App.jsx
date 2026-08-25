import { useState, useMemo, useRef, useEffect } from 'react'
import './App.css'

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

const CONFETTI_COLORS = [
  '#ff5e7e', '#ffd166', '#06d6a0', '#4cc9f0', '#b388eb', '#ff9f1c',
]

function useBirthdaySong() {
  const [playing, setPlaying] = useState(true)
  const ref = useRef(null)

  const postMessage = (cmd) => {
    if (ref.current) ref.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: cmd, args: [] }), '*')
  }

  const toggle = () => {
    if (playing) {
      postMessage('pauseVideo')
      setPlaying(false)
    } else {
      postMessage('playVideo')
      setPlaying(true)
    }
  }

  return { playing, toggle, ref }
}

function Confetti({ count = 120 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${randomBetween(0, 100)}%`,
        delay: `${randomBetween(0, 6)}s`,
        duration: `${randomBetween(4, 10)}s`,
        size: randomBetween(6, 14),
        color: CONFETTI_COLORS[Math.floor(randomBetween(0, CONFETTI_COLORS.length))],
        drift: `${randomBetween(-80, 80)}px`,
        round: Math.random() > 0.5,
      })),
    [count],
  )

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className={p.round ? 'confetti-piece circle' : 'confetti-piece'}
          style={{
            left: p.left,
            width: p.size,
            height: p.round ? p.size : p.size * 0.45,
            background: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
            ['--drift']: p.drift,
          }}
        />
      ))}
    </div>
  )
}

function Balloons() {
  const balloons = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: `${randomBetween(3, 92)}%`,
        delay: `${randomBetween(0, 12)}s`,
        duration: `${randomBetween(14, 24)}s`,
        color: CONFETTI_COLORS[Math.floor(randomBetween(0, CONFETTI_COLORS.length))],
      })),
    [],
  )

  return (
    <div className="balloon-layer" aria-hidden="true">
      {balloons.map((b) => (
        <div
          key={b.id}
          className="balloon"
          style={{
            left: b.left,
            background: b.color,
            animationDelay: b.delay,
            animationDuration: b.duration,
          }}
        >
          <span className="balloon-string" />
        </div>
      ))}
    </div>
  )
}

function Candle({ lit }) {
  return (
    <div className="candle">
      <span className={`flame ${lit ? '' : 'out'}`} />
      <div className="wax" />
    </div>
  )
}

export default function App() {
  const [candlesLit, setCandlesLit] = useState(true)
  const [wishRevealed, setWishRevealed] = useState(false)
  const [openCard, setOpenCard] = useState(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const { playing, toggle, ref } = useBirthdaySong()

  const handleEnter = () => {
    setShowWelcome(false)
  }

  const blowCandles = () => {
    if (!candlesLit) return
    setCandlesLit(false)
    setTimeout(() => setWishRevealed(true), 900)
  }

  const memories = [
    {
      icon: '🗣️',
      title: 'Talkative Champion',
      text: 'Give him one topic and he returns ten. Group call? He IS the group call. Silence genuinely confuses this man.',
    },
    {
      icon: '⏱️',
      title: '"Bas Ek Minute"',
      text: 'Every story starts with "bas ek minute sun na." That minute has never once ended. Science has no explanation.',
    },
    {
      icon: '📵',
      title: 'Seen At 2, Reply At 11',
      text: 'Champion of late replies. But call him once — boom, one hour gone, phone at 1%, and he is still talking.',
    },
    {
      icon: '😂',
      title: 'Certified Joke Supplier',
      text: 'His jokes make zero sense, arrive at the worst possible time, and somehow everyone ends up laughing anyway.',
    },
    {
      icon: '🧠',
      title: 'Free Gyaan Center',
      text: 'Unasked advice, unlimited confidence. Half of it is useless… the other half honestly works.',
    },
    {
      icon: '👑',
      title: "Today's Main Character",
      text: 'One day a year the spotlight is fully his — and he milks every second of it. Enjoy it, hero, you earned today.',
    },
  ]

  return (
    <div className="page">
      <iframe
        ref={ref}
        width="0"
        height="0"
        style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}
        src="https://www.youtube.com/embed/weWr_5FFnVU?autoplay=1&enablejsapi=1"
        allow="autoplay"
        title="Background Music"
      />

      {showWelcome ? (
        <div className="welcome-screen">
          <div className="welcome-card">
            <div className="kid-character">
              <div className="kid-emoji">👶</div>
              <div className="kid-speech">
                <span className="speech-bubble">
                  Happy Birthday Bharat! 🎂
                  <br />
                  Aap sabse acche ho! 🥰
                </span>
              </div>
            </div>
            <button className="btn enter-btn" onClick={handleEnter}>
              Click to Enter 🎉
            </button>
          </div>
        </div>
      ) : (
        <>
          <Confetti />
          <Balloons />

          <button
            className={`music-btn ${playing ? 'playing' : ''}`}
            onClick={toggle}
            title={playing ? 'Pause music' : 'Play birthday song'}
          >
            {playing ? '🎵' : '🔇'}
          </button>

      <header className="hero">
        <p className="eyebrow">🎉 It's a special day today 🎉</p>
        <h1 className="title">
          Happy Birthday<br />
          <span className="name">Bharat</span>
        </h1>
        <p className="subtitle">
          Today the world celebrates the day it got a little louder,
          a lot funnier, and way more fun.
        </p>

        <div className={`cake ${candlesLit ? '' : 'celebrate'}`}>
          <div className="candles">
            {[...Array(3)].map((_, i) => (
              <Candle key={i} lit={candlesLit} />
            ))}
          </div>
          <div className="layer top" />
          <div className="layer bottom" />
          <div className="plate" />
        </div>

        {!wishRevealed ? (
          <button className="btn primary" onClick={blowCandles}>
            {candlesLit ? 'Make a wish & blow the candles 🕯️' : 'Lighting up your surprise…'}
          </button>
        ) : (
          <div className="wish-box">
            <h2>✨ Wish granted ✨</h2>
            <p>
              May this year bring you everything you've been quietly working for —
              the goals, the peace of mind, and the kind of happiness that doesn't
              need a reason. Enjoy your day!
            </p>
          </div>
        )}
      </header>

      <section className="gifts">
        <h2>Your Birthday Gifts 🎁</h2>
        <div className="cards">
          <div className="gift-card gold">
            <span className="gift-icon">🧧</span>
            <span className="gift-name">Gold Coin</span>
            <span className="gift-price">₹10,000</span>
            <span className="gift-from">From: Your Bestie</span>
          </div>
          <div className="gift-card silver">
            <span className="gift-icon">⌚</span>
            <span className="gift-name">Smart Watch</span>
            <span className="gift-price">₹15,000</span>
            <span className="gift-from">From: Friends Group</span>
          </div>
          <div className="gift-card bronze">
            <span className="gift-icon">👟</span>
            <span className="gift-name">Nike Shoes</span>
            <span className="gift-price">₹8,500</span>
            <span className="gift-from">From: Mom & Dad</span>
          </div>
          <div className="gift-card pink">
            <span className="gift-icon">🧥</span>
            <span className="gift-name">Denim Jacket</span>
            <span className="gift-price">₹4,500</span>
            <span className="gift-from">From: Cousin</span>
          </div>
          <div className="gift-card blue">
            <span className="gift-icon">🎧</span>
            <span className="gift-name">AirPods Pro</span>
            <span className="gift-price">₹18,000</span>
            <span className="gift-from">From: Secret Santa</span>
          </div>
          <div className="gift-card green">
            <span className="gift-icon">🎮</span>
            <span className="gift-name">PS5 Controller</span>
            <span className="gift-price">₹6,000</span>
            <span className="gift-from">From: Gaming Buddy</span>
          </div>
        </div>
      </section>

      <section className="memories">
        <h2>The official Bharat report card 😆</h2>
        <div className="cards">
          {memories.map((m) => (
            <button
              key={m.title}
              className={`card ${openCard === m.title ? 'open' : ''}`}
              onClick={() => setOpenCard(openCard === m.title ? null : m.title)}
            >
              <span className="card-icon">{m.icon}</span>
              <span className="card-title">{m.title}</span>
              <span className="card-text">{m.text}</span>
            </button>
          ))}
        </div>
        <p className="hint">(tap a card 😉)</p>
      </section>

      <footer className="footer">
        <p>🎂 Once again — Happiest Birthday, Bharat! 🎂</p>
  
      </footer>
        </>
      )}
    </div>
  )
}
