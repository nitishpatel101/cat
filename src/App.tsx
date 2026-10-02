import React, { useEffect, useRef, useState } from 'react'

// Manifest for Hero Cat frames
interface FrameInfo {
  i: number
  open: boolean
  gx: number
  gy: number
}

interface CatManifest {
  width: number
  height: number
  crop: { x: number; y: number; w: number; h: number }
  eye: { x: number; y: number }
  frames: FrameInfo[]
}

const CAT_MANIFEST: CatManifest = {
  width: 1920,
  height: 1080,
  crop: { x: 560, y: 0, w: 760, h: 1080 },
  eye: { x: 940, y: 382 },
  frames: [
    { i: 1, open: true, gx: 0.215, gy: 0.376 },
    { i: 7, open: true, gx: 0.215, gy: 0.374 },
    { i: 11, open: true, gx: 0.2, gy: 0.343 },
    { i: 13, open: true, gx: 0.165, gy: 0.291 },
    { i: 14, open: true, gx: 0.105, gy: 0.255 },
    { i: 15, open: true, gx: 0, gy: 0.233 },
    { i: 16, open: true, gx: -0.065, gy: 0.157 },
    { i: 17, open: false, gx: -0.144, gy: -0.015 },
    { i: 18, open: false, gx: -0.226, gy: -0.126 },
    { i: 19, open: false, gx: -0.291, gy: -0.21 },
    { i: 20, open: false, gx: -0.377, gy: -0.252 },
    { i: 21, open: false, gx: -0.534, gy: -0.247 },
    { i: 22, open: false, gx: -0.684, gy: -0.189 },
    { i: 23, open: false, gx: -0.78, gy: -0.105 },
    { i: 24, open: true, gx: -0.854, gy: -0.049 },
    { i: 25, open: true, gx: -0.915, gy: -0.018 },
    { i: 26, open: true, gx: -0.955, gy: 0.007 },
    { i: 27, open: true, gx: -0.98, gy: 0.038 },
    { i: 28, open: true, gx: -0.994, gy: 0.066 },
    { i: 30, open: true, gx: -1.004, gy: 0.097 },
    { i: 36, open: true, gx: -1, gy: 0.136 },
    { i: 41, open: true, gx: -0.989, gy: 0.157 },
    { i: 47, open: true, gx: -0.984, gy: 0.164 },
    { i: 51, open: true, gx: -0.978, gy: 0.128 },
    { i: 52, open: true, gx: -0.957, gy: 0.04 },
    { i: 66, open: true, gx: 0.714, gy: 0.05 },
    { i: 67, open: true, gx: 0.818, gy: 0.059 },
    { i: 68, open: true, gx: 0.895, gy: 0.06 },
    { i: 69, open: true, gx: 0.942, gy: 0.066 },
    { i: 71, open: true, gx: 0.992, gy: 0.059 },
    { i: 77, open: true, gx: 1.009, gy: 0.034 },
    { i: 79, open: true, gx: 1.016, gy: 0.102 },
    { i: 80, open: true, gx: 1.007, gy: 0.228 },
    { i: 81, open: true, gx: 0.985, gy: 0.347 },
    { i: 82, open: true, gx: 0.955, gy: 0.455 },
    { i: 83, open: true, gx: 0.923, gy: 0.559 },
    { i: 84, open: true, gx: 0.885, gy: 0.65 },
    { i: 85, open: true, gx: 0.842, gy: 0.731 },
    { i: 86, open: true, gx: 0.804, gy: 0.8 },
    { i: 87, open: true, gx: 0.766, gy: 0.859 },
    { i: 88, open: true, gx: 0.736, gy: 0.903 },
    { i: 89, open: true, gx: 0.712, gy: 0.934 },
    { i: 90, open: true, gx: 0.695, gy: 0.955 },
    { i: 92, open: true, gx: 0.674, gy: 0.983 },
    { i: 98, open: true, gx: 0.666, gy: 0.998 },
    { i: 104, open: true, gx: 0.673, gy: 0.995 },
    { i: 110, open: true, gx: 0.688, gy: 0.974 },
    { i: 112, open: true, gx: 0.715, gy: 0.872 },
    { i: 113, open: true, gx: 0.743, gy: 0.688 },
    { i: 123, open: true, gx: 0.296, gy: -0.971 },
    { i: 124, open: true, gx: 0.214, gy: -1.028 },
    { i: 125, open: true, gx: 0.145, gy: -1.063 },
    { i: 126, open: true, gx: 0.084, gy: -1.08 },
    { i: 127, open: true, gx: 0.031, gy: -1.081 },
    { i: 128, open: true, gx: -0.005, gy: -1.072 },
    { i: 129, open: true, gx: -0.02, gy: -1.06 },
    { i: 130, open: true, gx: -0.029, gy: -1.044 },
    { i: 131, open: true, gx: -0.038, gy: -1.031 },
    { i: 133, open: true, gx: -0.045, gy: -1.011 },
    { i: 139, open: true, gx: -0.047, gy: -0.998 },
    { i: 145, open: true, gx: -0.044, gy: -1.004 },
    { i: 151, open: true, gx: -0.043, gy: -1.005 },
    { i: 154, open: true, gx: -0.041, gy: -1.027 },
    { i: 156, open: true, gx: -0.038, gy: -1.051 },
    { i: 157, open: false, gx: -0.029, gy: -1.044 },
    { i: 158, open: false, gx: -0.026, gy: -1.125 },
    { i: 159, open: false, gx: -0.032, gy: -1.189 },
    { i: 160, open: false, gx: -0.036, gy: -1.14 },
    { i: 161, open: false, gx: -0.037, gy: -1.582 },
    { i: 162, open: false, gx: -0.031, gy: -0.994 },
    { i: 163, open: false, gx: -0.03, gy: -0.869 },
    { i: 164, open: false, gx: -0.009, gy: -0.688 },
    { i: 165, open: false, gx: -0.01, gy: -0.477 },
    { i: 166, open: false, gx: -0.008, gy: -0.318 },
    { i: 167, open: true, gx: -0.007, gy: -0.207 },
    { i: 168, open: true, gx: -0.006, gy: -0.142 },
    { i: 169, open: true, gx: -0.003, gy: -0.098 },
    { i: 170, open: true, gx: -0.001, gy: -0.062 },
    { i: 171, open: true, gx: 0, gy: -0.034 },
    { i: 172, open: true, gx: 0.003, gy: -0.015 },
    { i: 175, open: true, gx: 0.007, gy: 0.016 },
    { i: 181, open: true, gx: 0.012, gy: -0.001 },
    { i: 187, open: true, gx: 0.012, gy: -0.008 }
  ]
}

const PRODUCT_INFO = {
  name: 'Mochi Crunch',
  flavour: 'Salmon & Chicken',
  bagGrams: 1500,
  price: 24.99,
  subscribeDiscount: 0.1,
  kcalPer100g: 390
}

const STATS = [
  { value: '38%', label: 'protein', note: 'from real salmon and chicken' },
  { value: '0', label: 'grains', note: 'no wheat, corn or soy fillers' },
  { value: '1.5', label: 'kg bag', note: 'about a month for one cat' }
]

const INGREDIENTS = [
  { name: 'Fresh salmon', percent: 32 },
  { name: 'Fresh chicken', percent: 28 },
  { name: 'Dehydrated salmon & chicken', percent: 18 },
  { name: 'Sweet potato', percent: 8 },
  { name: 'Peas & lentils', percent: 6 },
  { name: 'Chicken fat (preserved with rosemary)', percent: 4 },
  { name: 'Salmon oil', percent: 2 },
  { name: 'Vitamins & minerals', percent: 2 }
]

const NUTRITION = [
  { label: 'Crude protein', minMax: 'min', val: '38%' },
  { label: 'Crude fat', minMax: 'min', val: '17%' },
  { label: 'Crude fibre', minMax: 'max', val: '3%' },
  { label: 'Moisture', minMax: 'max', val: '9%' }
]

const BASE = (import.meta as any).env?.BASE_URL || '/cat/'

export default function App() {
  const [bagCount, setBagCount] = useState(0)
  const [purchaseType, setPurchaseType] = useState<'sub' | 'once'>('sub')
  const [quantity, setQuantity] = useState(1)
  const [catWeight, setCatWeight] = useState(4.0)
  const [catActivity, setCatActivity] = useState<'calm' | 'busy'>('calm')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const heroStageRef = useRef<HTMLDivElement | null>(null)

  // Feeding calculation:
  // kcal/day = 70 * (kg ^ 0.75) * (1.0 for calm, 1.3 for active)
  // Food has 390 kcal / 100g -> gramsPerDay = (kcal / 3.9)
  // Days per 1500g bag = 1500 / gramsPerDay
  const factor = catActivity === 'calm' ? 1.0 : 1.3
  const dailyKcal = 70 * Math.pow(catWeight, 0.75) * factor
  const dailyGrams = Math.round(dailyKcal / 3.9)
  const bagDays = Math.round(1500 / dailyGrams)

  // Price calculations
  const unitPrice = purchaseType === 'sub'
    ? PRODUCT_INFO.price * (1 - PRODUCT_INFO.subscribeDiscount)
    : PRODUCT_INFO.price
  const totalPrice = (unitPrice * quantity).toFixed(2)
  const originalPrice = (PRODUCT_INFO.price * quantity).toFixed(2)

  // Add to bag function
  const handleAddToBag = (e: React.MouseEvent<HTMLButtonElement>) => {
    setBagCount((prev) => prev + quantity)
    setToastMessage(`Added ${quantity} × Mochi Crunch (1.5 kg) to your bag`)
    setTimeout(() => setToastMessage(null), 3500)

    // Kibble burst animation
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    const kibbleSrcs = [`${BASE}images/kibble-one.webp`, `${BASE}images/kibble-two.webp`, `${BASE}images/kibble-three.webp`]
    for (let i = 0; i < 12; i++) {
      const img = document.createElement('img')
      img.src = kibbleSrcs[i % kibbleSrcs.length]
      img.className = 'kibble-burst'
      const size = 28 + Math.random() * 20
      img.style.width = `${size}px`
      img.style.height = `${size}px`
      img.style.left = `${x}px`
      img.style.top = `${y}px`
      document.body.appendChild(img)

      const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.5
      const dist = 60 + Math.random() * 90
      const tx = Math.cos(angle) * dist
      const ty = Math.sin(angle) * dist - 40

      img.animate(
        [
          { transform: 'translate(0, 0) scale(0.6) rotate(0deg)', opacity: 1 },
          { transform: `translate(${tx}px, ${ty}px) scale(1) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: 0.6 },
          { transform: `translate(${tx}px, ${ty + 80}px) scale(0.8) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ],
        { duration: 800 + Math.random() * 300, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
      ).onfinish = () => img.remove()
    }
  }

  // Hero Cat eye gaze tracking logic
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const images: (HTMLImageElement | null)[] = CAT_MANIFEST.frames.map(() => null)
    let currentFrameIdx = 0

    // Find center frame (gx near 0, gy near 0)
    let bestDist = Infinity
    CAT_MANIFEST.frames.forEach((f, idx) => {
      if (!f.open) return
      const d = f.gx * f.gx + f.gy * f.gy
      if (d < bestDist) {
        bestDist = d
        currentFrameIdx = idx
      }
    })

    const loadFrame = (idx: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        if (images[idx]) {
          resolve(images[idx]!)
          return
        }
        const img = new Image()
        const fNum = String(CAT_MANIFEST.frames[idx].i).padStart(3, '0')
        img.src = `${BASE}cat/f${fNum}.webp`
        img.onload = () => {
          images[idx] = img
          resolve(img)
        }
      })
    }

    // Load initial center frame and draw
    loadFrame(currentFrameIdx).then((img) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    })

    // Preload next key directions
    ;[0, 10, 25, 45, 65].forEach((idx) => {
      if (idx < CAT_MANIFEST.frames.length) loadFrame(idx)
    })

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height * 0.35 // Eye level
      const dx = (e.clientX - centerX) / (rect.width * 0.5)
      const dy = (e.clientY - centerY) / (rect.height * 0.5)

      // Clamp gaze between -1 and 1
      const targetGx = Math.max(-1, Math.min(1, dx))
      const targetGy = Math.max(-1, Math.min(1, dy))

      // Find closest open frame
      let closestIdx = currentFrameIdx
      let minD = Infinity
      CAT_MANIFEST.frames.forEach((f, idx) => {
        if (!f.open) return
        const dist = (f.gx - targetGx) ** 2 + (f.gy - targetGy) ** 2
        if (dist < minD) {
          minD = dist
          closestIdx = idx
        }
      })

      if (closestIdx !== currentFrameIdx) {
        currentFrameIdx = closestIdx
        loadFrame(closestIdx).then((img) => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="relative min-h-screen bg-blush font-sans text-plum selection:bg-pink selection:text-white">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-plum px-6 py-3 text-white shadow-2xl text-[15px] font-semibold flex items-center gap-3 animate-fade-in">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="fixed top-0 inset-x-0 z-30 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-sm bg-white/10">
        <a href="#" className="font-bold text-[32px] lowercase tracking-tight text-white drop-shadow-md">
          mochi
        </a>
        <nav className="hidden md:flex items-center gap-8 text-[17px] font-semibold text-white/90">
          <a href="#product" className="hover:text-white transition-colors">The bag</a>
          <a href="#inside" className="hover:text-white transition-colors">What's inside</a>
          <a href="#feeding" className="hover:text-white transition-colors">Feeding guide</a>
        </nav>
        <button
          onClick={() => {
            const el = document.getElementById('product')
            el?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="rounded-full bg-white px-5 py-2 text-[15px] font-bold text-plum shadow-md hover:bg-blush transition-colors flex items-center gap-2"
        >
          <span>Bag</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pink text-white text-[12px] font-bold">
            {bagCount}
          </span>
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#EC2F69]">
        {/* Full-bleed cat background and tracking canvas */}
        <div ref={heroStageRef} className="hero-stage">
          <img
            src={`${BASE}cat/bg.jpg`}
            alt="Mochi hero cat background"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <canvas
            ref={canvasRef}
            width={760}
            height={1080}
            className="absolute top-0 left-1/2 -translate-x-1/2 h-full object-contain pointer-events-none"
          />
        </div>

        {/* Split headline copy */}
        <div className="hero-copy pointer-events-none">
          <div className="hero-a text-white font-extrabold display">
            Picky eaters,
          </div>
          <div className="hero-b text-white font-extrabold display">
            clean bowls.
          </div>
          <div className="hero-c pointer-events-auto">
            <p className="text-[20px] text-white/90 leading-snug font-medium mb-6">
              Real salmon and chicken in every crunchy heart.
            </p>
            <button
              onClick={() => {
                const el = document.getElementById('product')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="rounded-full bg-white px-8 py-3.5 text-[17px] font-bold text-plum shadow-xl hover:bg-blush hover:scale-105 active:scale-95 transition-all"
            >
              Shop Mochi Crunch
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE BAG */}
      <section id="product" className="relative bg-blush px-4 py-20 sm:px-8 sm:py-28 z-20">
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Kitten hug video / still */}
          <div className="relative">
            {/* Floating kibble background items */}
            <div className="absolute -inset-[12%] pointer-events-none overflow-visible">
              <img src={`${BASE}images/kibble-one.webp`} alt="" className="absolute top-[8%] left-[6%] w-14 animate-pulse opacity-90" />
              <img src={`${BASE}images/kibble-two.webp`} alt="" className="absolute bottom-[10%] right-[8%] w-16 opacity-80" />
              <img src={`${BASE}images/kibble-three.webp`} alt="" className="absolute top-[40%] -left-8 w-12 opacity-85" />
              <img src={`${BASE}images/kibble-one.webp`} alt="" className="absolute top-[75%] left-[20%] w-10 opacity-70" />
            </div>

            <div className="relative z-[5] overflow-hidden rounded-[40px] aspect-[4/5] bg-pink shadow-2xl">
              <video
                src={`${BASE}videos/kitten-hug.mp4`}
                poster={`${BASE}images/kitten-hug.webp`}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Product details & purchasing */}
          <div>
            <h2 className="display text-[56px] sm:text-[84px] leading-tight text-plum">
              {PRODUCT_INFO.name}
            </h2>
            <p className="mt-4 text-[19px] leading-relaxed text-plum-soft max-w-[40ch]">
              {PRODUCT_INFO.flavour} dry food for adult cats. Small, heart-shaped kibble that's easy to crunch, in a 1.5 kg resealable bag.
            </p>

            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-3 text-[17px] font-semibold text-plum">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink text-white text-[14px]">✓</span>
                Real salmon is the first ingredient
              </li>
              <li className="flex items-center gap-3 text-[17px] font-semibold text-plum">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink text-white text-[14px]">✓</span>
                Grain-free, with no artificial colours
              </li>
              <li className="flex items-center gap-3 text-[17px] font-semibold text-plum">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink text-white text-[14px]">✓</span>
                A complete meal for adult cats
              </li>
            </ul>

            {/* Subscribe vs One-Time */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPurchaseType('sub')}
                className={`rounded-[20px] border-2 p-5 text-left transition-all ${
                  purchaseType === 'sub'
                    ? 'border-pink bg-white shadow-md'
                    : 'border-plum/15 bg-white/50 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[17px] font-bold text-plum">Subscribe & save</span>
                  <span className="rounded-full bg-pink/15 px-2 py-0.5 text-[12px] font-bold text-pink">10% off</span>
                </div>
                <p className="mt-1 text-[14px] text-plum-soft">Delivered every 4 weeks. Cancel anytime.</p>
              </button>

              <button
                type="button"
                onClick={() => setPurchaseType('once')}
                className={`rounded-[20px] border-2 p-5 text-left transition-all ${
                  purchaseType === 'once'
                    ? 'border-pink bg-white shadow-md'
                    : 'border-plum/15 bg-white/50 hover:bg-white'
                }`}
              >
                <div className="text-[17px] font-bold text-plum">One-time</div>
                <p className="mt-1 text-[14px] text-plum-soft">Just one bag to try.</p>
              </button>
            </div>

            {/* Price & Quantity & Add to Bag */}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div className="flex items-baseline gap-3">
                <span className="text-[44px] font-extrabold text-plum tabular-nums">
                  ${totalPrice}
                </span>
                {purchaseType === 'sub' && (
                  <span className="text-[20px] text-plum-soft/60 line-through tabular-nums">
                    ${originalPrice}
                  </span>
                )}
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center rounded-full border border-plum/20 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 rounded-full text-[20px] font-bold hover:bg-blush transition-colors"
                >
                  −
                </button>
                <span className="w-10 text-center font-bold tabular-nums text-[18px]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-10 w-10 rounded-full text-[20px] font-bold hover:bg-blush transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to bag button */}
              <button
                type="button"
                onClick={handleAddToBag}
                className="flex-1 rounded-full bg-pink px-8 py-4 text-[18px] font-bold text-white shadow-xl hover:bg-pink-deep hover:scale-105 active:scale-95 transition-all"
              >
                Add to bag
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CROSSING MARQUEE RIBBONS */}
      <div className="relative -my-12 overflow-hidden py-16 pointer-events-none z-20">
        <div className="w-[120%] -translate-x-[10%] rotate-3 bg-[#FFD24A] py-3 shadow-lg">
          <div className="flex gap-8 whitespace-nowrap text-[22px] font-extrabold text-plum lowercase tracking-wide animate-marquee">
            {Array(10).fill('Real salmon  ·  Real chicken  ·  Crunchy hearts  ·  Grain-free  ·  Made for picky eaters  ·  ').join('')}
          </div>
        </div>
        <div className="w-[120%] -translate-x-[10%] -rotate-3 bg-plum py-3 -mt-6 shadow-xl">
          <div className="flex gap-8 whitespace-nowrap text-[22px] font-extrabold text-white lowercase tracking-wide animate-marquee-reverse">
            {Array(10).fill('Real salmon  ·  Real chicken  ·  Crunchy hearts  ·  Grain-free  ·  Made for picky eaters  ·  ').join('')}
          </div>
        </div>
      </div>

      {/* SECTION 2: WHAT'S INSIDE */}
      <section id="inside" className="relative bg-[radial-gradient(120%_90%_at_50%_0%,#EC2F69_0%,#B0145A_45%,#5A0B3A_100%)] px-4 py-24 sm:px-8 sm:py-32 text-white z-10">
        <div className="mx-auto max-w-[1320px]">
          <h2 className="text-center display text-[56px] sm:text-[84px] text-white">
            What's inside the bag
          </h2>

          {/* Interactive display: Stats + floating pouch video */}
          <div className="mt-16 grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,460px)_1fr]">
            {/* Left stats */}
            <div className="space-y-12 lg:text-right">
              <div>
                <div className="display text-[72px] sm:text-[96px] text-white">{STATS[0].value}</div>
                <div className="text-[24px] font-bold text-white/90">{STATS[0].label}</div>
                <div className="text-[16px] text-white/70">{STATS[0].note}</div>
              </div>
              <div>
                <div className="display text-[72px] sm:text-[96px] text-white">{STATS[1].value}</div>
                <div className="text-[24px] font-bold text-white/90">{STATS[1].label}</div>
                <div className="text-[16px] text-white/70">{STATS[1].note}</div>
              </div>
            </div>

            {/* Centre floating bag video */}
            <div className="relative mx-auto w-full max-w-[420px] aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl">
              <video
                src={`${BASE}videos/pouch-float.mp4`}
                poster={`${BASE}images/pouch-float.webp`}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            </div>

            {/* Right yellow badge */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex h-44 w-44 items-center justify-center rounded-full bg-[#FFD24A] text-plum text-center p-4 shadow-xl">
                <div>
                  <div className="display text-[48px] leading-tight font-extrabold">{STATS[2].value}</div>
                  <div className="text-[17px] font-bold">{STATS[2].label}</div>
                  <div className="text-[13px] opacity-80">{STATS[2].note}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients chips */}
          <div className="mt-20">
            <h3 className="text-center text-[22px] font-bold text-white/90 mb-8">
              Ingredients, in order
            </h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-[900px] mx-auto">
              {INGREDIENTS.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-full bg-white/15 px-5 py-2.5 text-[16px] font-medium backdrop-blur-sm border border-white/20"
                >
                  <span className="font-semibold text-white">{item.name}</span>{' '}
                  <span className="text-white/70">({item.percent}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guaranteed Analysis */}
          <div className="mt-16">
            <h3 className="text-center text-[22px] font-bold text-white/90 mb-8">
              Guaranteed analysis
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-[800px] mx-auto">
              {NUTRITION.map((n, idx) => (
                <div key={idx} className="rounded-[20px] bg-white/10 p-5 text-center backdrop-blur-sm border border-white/15">
                  <div className="text-[14px] text-white/70">{n.label}</div>
                  <div className="text-[12px] uppercase tracking-wider text-white/50">{n.minMax}</div>
                  <div className="display text-[36px] font-bold text-white mt-1">{n.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW MUCH TO FEED */}
      <section id="feeding" className="relative bg-blush px-4 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-[1320px]">
          <h2 className="text-center display text-[56px] sm:text-[84px] text-plum mb-16">
            How much to feed
          </h2>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Feeding calculator card */}
            <div className="rounded-[36px] bg-white p-8 sm:p-12 shadow-xl border border-plum/10">
              <label className="block text-[18px] font-bold text-plum">
                Cat weight: <span className="text-pink">{catWeight.toFixed(1)} kg</span>
              </label>
              <input
                type="range"
                min="2.0"
                max="8.0"
                step="0.5"
                value={catWeight}
                onChange={(e) => setCatWeight(parseFloat(e.target.value))}
                className="mt-4 w-full accent-pink h-2 bg-blush rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[13px] text-plum-soft mt-1 font-semibold">
                <span>2 kg (Kitten/Small)</span>
                <span>5 kg (Average)</span>
                <span>8 kg (Large)</span>
              </div>

              {/* Activity toggle */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCatActivity('calm')}
                  className={`rounded-full py-3 px-4 text-[16px] font-bold transition-all ${
                    catActivity === 'calm'
                      ? 'bg-plum text-white shadow-md'
                      : 'bg-blush text-plum hover:bg-plum/10'
                  }`}
                >
                  Calm & indoors
                </button>
                <button
                  type="button"
                  onClick={() => setCatActivity('busy')}
                  className={`rounded-full py-3 px-4 text-[16px] font-bold transition-all ${
                    catActivity === 'busy'
                      ? 'bg-plum text-white shadow-md'
                      : 'bg-blush text-plum hover:bg-plum/10'
                  }`}
                >
                  Busy or outdoors
                </button>
              </div>

              {/* Calculator Output */}
              <div className="mt-8 grid grid-cols-2 gap-4 rounded-[24px] bg-blush p-6 text-center">
                <div>
                  <div className="text-[15px] font-semibold text-plum-soft">Each day:</div>
                  <div className="display text-[44px] text-pink font-extrabold mt-1">{dailyGrams} g</div>
                  <div className="text-[13px] text-plum-soft">approx. 2 small bowls</div>
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-plum-soft">One bag lasts:</div>
                  <div className="display text-[44px] text-plum font-extrabold mt-1">{bagDays} days</div>
                  <div className="text-[13px] text-plum-soft">per 1.5 kg bag</div>
                </div>
              </div>
            </div>

            {/* Cat bowl photograph */}
            <div className="overflow-hidden rounded-[36px] shadow-2xl aspect-[3/2] bg-white">
              <img
                src={`${BASE}images/cat-bowl.webp`}
                alt="Fluffy cat eating Mochi Crunch from a bowl"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Closing pink banner */}
          <div className="relative mt-24 overflow-hidden rounded-[40px] bg-pink p-8 sm:p-14 text-white shadow-2xl">
            <div className="relative z-10 max-w-[620px]">
              <h3 className="display text-[40px] sm:text-[60px] text-white leading-tight">
                Mochi is waiting by the bowl.
              </h3>
              <p className="mt-3 text-[19px] text-white/90">
                Salmon & Chicken Crunch · 1.5 kg resealable bag · Free delivery from $40
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <span className="text-[36px] font-extrabold tabular-nums">${PRODUCT_INFO.price}</span>
                <button
                  type="button"
                  onClick={handleAddToBag}
                  className="rounded-full bg-white px-8 py-4 text-[18px] font-bold text-plum shadow-xl hover:bg-blush hover:scale-105 active:scale-95 transition-all"
                >
                  Add Mochi Crunch to bag
                </button>
              </div>
            </div>

            {/* Overlapping tilted pouch packshot */}
            <img
              src={`${BASE}images/pouch.webp`}
              alt="Mochi Crunch pouch"
              className="absolute -right-10 -bottom-10 h-72 sm:h-96 w-auto rotate-[8deg] drop-shadow-[0_30px_40px_rgba(58,11,34,0.45)] pointer-events-none"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-pink-deep px-4 py-16 sm:px-8 sm:py-24 text-white text-center">
        <div className="mx-auto max-w-[1320px]">
          <p className="text-[16px] text-white/80 max-w-[60ch] mx-auto">
            Always introduce new food gradually over 7–10 days. Ensure fresh water is always available. Formulated to meet the nutritional levels established by the AAFCO Cat Food Nutrient Profiles.
          </p>

          <div className="mt-8 flex justify-center gap-8 text-[16px] font-semibold text-white/90">
            <a href="#product" className="hover:underline">The bag</a>
            <a href="#inside" className="hover:underline">What's inside</a>
            <a href="#feeding" className="hover:underline">Feeding guide</a>
          </div>

          <div className="display text-[30vw] leading-none text-white/20 select-none lowercase mt-12">
            mochi
          </div>

          <div className="mt-6 text-[14px] text-white/60">
            © 2026 Mochi Cat Food. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
