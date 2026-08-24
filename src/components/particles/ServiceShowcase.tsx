import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { immersiveServices } from '../../lib/particles/services'
import { titleOpacityForProgress } from '../../lib/particles/morphTiming'

gsap.registerPlugin(ScrollTrigger)

function applyTitleOpacity(panels: HTMLElement[], progress: number) {
  panels.forEach((panel, i) => {
    const o = titleOpacityForProgress(progress, i)
    gsap.set(panel, {
      opacity: o,
      y: 18 * (1 - o),
      pointerEvents: o > 0.4 ? 'auto' : 'none',
    })
  })
}

/**
 * Fixed overlays that fade in/out with scroll, synced to morph hold windows
 * (title only while the paired particle shape is fully formed).
 */
export default function ServiceShowcase() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const panels = Array.from(root.querySelectorAll<HTMLElement>('.service-panel'))
    panels.forEach((panel) => {
      gsap.set(panel, { opacity: 0, y: 18, pointerEvents: 'none' })
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
      {immersiveServices.map((s) => (
        <article
          key={s.id}
          className="service-panel absolute right-8 md:right-16 top-1/2 -translate-y-1/2 max-w-sm md:max-w-md"
          data-service={s.id}
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
            className="text-white/50 leading-relaxed"
            style={{ fontSize: 14, letterSpacing: '0.02em' }}
          >
            {s.body}
          </p>
        </article>
      ))}
    </div>
  )
}
