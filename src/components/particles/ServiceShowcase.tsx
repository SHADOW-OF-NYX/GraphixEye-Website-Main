import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { immersiveServices } from '../../lib/particles/services'

gsap.registerPlugin(ScrollTrigger)

/**
 * Fixed overlays that fade in/out with scroll, synced to morph segments
 * (eye → dna → arc → bonsai).
 */
export default function ServiceShowcase() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const panels = Array.from(root.querySelectorAll<HTMLElement>('.service-panel'))
    const ctx = gsap.context(() => {
      const n = panels.length
      panels.forEach((panel) => {
        gsap.set(panel, { opacity: 0, y: 18, pointerEvents: 'none' })
      })

      const smoothstep = (t: number) => {
        const x = Math.max(0, Math.min(1, t))
        return x * x * x * (x * (x * 6 - 15) + 10)
      }

      ScrollTrigger.create({
        trigger: '#morph-track',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.6,
        onUpdate: (self) => {
          const p = self.progress
          panels.forEach((panel, i) => {
            const start = i / n
            const end = (i + 1) / n
            const span = end - start
            // Wider fade ramps so labels ease in/out with the morph
            const fullIn = start + span * 0.32
            const fullOut = end - span * 0.32
            let o = 0
            if (p >= start && p < fullIn) o = smoothstep((p - start) / (fullIn - start))
            else if (p >= fullIn && p <= fullOut) o = 1
            else if (p > fullOut && p <= end) o = smoothstep((end - p) / (end - fullOut))

            // Let hero clear before AI label lands
            if (i === 0) o *= smoothstep(Math.min(1, Math.max(0, (p - 0.04) / 0.12)))

            gsap.set(panel, {
              opacity: o,
              y: 22 * (1 - o),
              pointerEvents: o > 0.35 ? 'auto' : 'none',
            })
          })
        },
      })
    }, root)

    return () => ctx.revert()
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
