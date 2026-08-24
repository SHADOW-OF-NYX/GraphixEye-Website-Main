import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { immersiveServices } from '../../lib/particles/services'
import { titleOpacityForProgress } from '../../lib/particles/morphTiming'

gsap.registerPlugin(ScrollTrigger)

function applyTitleOpacity(panels: HTMLElement[], progress: number) {
  panels.forEach((panel, i) => {
    const o = titleOpacityForProgress(progress, i)
    const side = immersiveServices[i]?.textSide ?? 'right'
    const fromX = side === 'left' ? -28 : 28
    gsap.set(panel, {
      opacity: o,
      x: fromX * (1 - o),
      y: 14 * (1 - o),
      pointerEvents: o > 0.4 ? 'auto' : 'none',
    })
  })
}

/**
 * Fixed overlays that fade in/out with scroll, synced to morph hold windows.
 * Side flips with the camera ride (e.g. Mixed Reality copy on the left).
 */
export default function ServiceShowcase() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const panels = Array.from(root.querySelectorAll<HTMLElement>('.service-panel'))
    panels.forEach((panel, i) => {
      const side = immersiveServices[i]?.textSide ?? 'right'
      gsap.set(panel, {
        opacity: 0,
        x: side === 'left' ? -28 : 28,
        y: 14,
        pointerEvents: 'none',
      })
    })

    const st = ScrollTrigger.create({
      trigger: '#morph-track',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.6,
      onUpdate: (self) => {
        const damped = (window as unknown as { __morphProgress?: number }).__morphProgress
        applyTitleOpacity(panels, typeof damped === 'number' ? damped : self.progress)
      },
    })

    let raf = 0
    const tickTitles = () => {
      raf = requestAnimationFrame(tickTitles)
      const damped = (window as unknown as { __morphProgress?: number }).__morphProgress
      if (typeof damped === 'number') applyTitleOpacity(panels, damped)
    }
    tickTitles()

    return () => {
      cancelAnimationFrame(raf)
      st.kill()
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[12]"
      aria-live="polite"
    >
      {immersiveServices.map((s) => {
        const onLeft = s.textSide === 'left'
        return (
          <article
            key={s.id}
            className={`service-panel absolute top-1/2 -translate-y-1/2 max-w-sm md:max-w-md ${
              onLeft
                ? 'left-5 md:left-14 text-left'
                : 'right-5 md:right-14 text-right'
            }`}
            data-service={s.id}
            data-side={s.textSide}
          >
            <p
              className="text-white/35 mb-3"
              style={{ fontSize: 11, letterSpacing: '0.18em' }}
            >
              {s.index} — {s.eyebrow.toUpperCase()}
            </p>
            <h2
              className="text-white font-light uppercase leading-tight mb-4 drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)]"
              style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.02em' }}
            >
              {s.title}
            </h2>
            <p
              className={`text-white/50 leading-relaxed ${onLeft ? '' : 'ml-auto'}`}
              style={{ fontSize: 14, letterSpacing: '0.02em', maxWidth: '28rem' }}
            >
              {s.body}
            </p>
          </article>
        )
      })}
    </div>
  )
}
