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

    const track = document.getElementById('morph-track')

    let raf = 0
    const tickTitles = () => {
      raf = requestAnimationFrame(tickTitles)

      /*
       * These panels sit in a fixed layer, so they keep painting over whatever
       * scrolls up beneath them once the track is gone. Per-panel opacity does
       * reach zero on its own, but the damped progress lags a fast scroll far
       * enough for the last panel to land on top of the content below.
       */
      if (track) {
        const past = track.getBoundingClientRect().bottom <= window.innerHeight
        root.style.visibility = past ? 'hidden' : 'visible'
        if (past) return
      }

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
            className={`service-panel absolute top-[58%] md:top-1/2 -translate-y-1/2 max-w-[min(20rem,88vw)] md:max-w-md px-1 ${
              onLeft
                ? 'left-4 md:left-14 text-left'
                : 'right-4 md:right-14 text-right'
            }`}
            data-service={s.id}
            data-side={s.textSide}
          >
            {/* Cream fade so dark copy stays legible where a model drifts under it */}
            <span
              aria-hidden
              className="absolute -inset-x-10 -inset-y-12 pointer-events-none"
              style={{
                zIndex: -1,
                background: `radial-gradient(ellipse 68% 58% at ${
                  onLeft ? '28%' : '72%'
                } 50%, rgba(252,248,241,0.94) 0%, rgba(252,248,241,0.72) 45%, rgba(252,248,241,0) 74%)`,
              }}
            />
            <p className="text-[12px] tracking-widest uppercase text-ll-highlight mb-3">
              {s.index} · {s.eyebrow.toUpperCase()}
            </p>
            <h2 className="display-md text-black mb-3 md:mb-4 text-[clamp(1.35rem,4vw,2.25rem)]">{s.title}</h2>
            <p
              className={`text-black/55 leading-relaxed text-[14px] md:text-[15px] max-w-md ${onLeft ? '' : 'ml-auto'}`}
            >
              {s.body}
            </p>
          </article>
        )
      })}
    </div>
  )
}
