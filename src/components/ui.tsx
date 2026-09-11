import React from 'react';
import { markHeroReady, resetHeroReady } from '../lib/heroReady';
import { shouldUseMobileHeroVideo } from '../lib/device';

export function BrandLogo({
  className = 'h-10',
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      <img
        src="/ge-logo.png"
        alt="GraphixEye"
        className={`h-full w-auto object-contain transition-opacity duration-500 ${onDark ? 'opacity-0' : 'opacity-100'}`}
      />
      <img
        src="/ge-logo-2.png"
        alt=""
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 h-full w-auto object-contain transition-opacity duration-500 ${onDark ? 'opacity-100' : 'opacity-0'}`}
      />
    </span>
  );
}

export function LogoMark({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" fill="currentColor">
      <circle cx="6" cy="6" r="2.15" />
      <circle cx="14" cy="6" r="2.15" />
      <circle cx="6" cy="14" r="2.15" />
      <circle cx="14" cy="14" r="2.15" />
    </svg>
  );
}

export function Pill({
  children,
  href,
  variant = 'solid-cream',
  className = '',
  onClick,
  type,
}: {
  children: React.ReactNode;
  href?: string;
  variant?: 'solid-cream' | 'solid-black' | 'ghost-cream' | 'ghost-black' | 'outline-cream' | 'outline-black';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  const variants: Record<string, string> = {
    'solid-cream': 'bg-ll-white text-black hover:bg-black hover:text-ll-white',
    'solid-black': 'bg-black text-ll-white hover:bg-ll-white hover:text-black border border-black',
    'ghost-cream': 'bg-transparent text-ll-white hover:bg-ll-white hover:text-black',
    'ghost-black': 'bg-transparent text-black hover:bg-black hover:text-ll-white',
    'outline-cream': 'bg-transparent text-ll-white border border-ll-white hover:bg-ll-white hover:text-black',
    'outline-black': 'bg-transparent text-black border border-black hover:bg-black hover:text-ll-white',
  };

  const cls = `pill inline-flex items-center justify-center px-6 h-[44px] text-[14px] font-sans transition-colors duration-300 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type ?? 'button'} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

export function Placeholder({
  src,
  label,
  className = '',
  imgClassName = '',
  eager,
}: {
  src: string;
  label: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  return (
    <div data-slot={label} data-nav-tone="dark" className={`relative overflow-hidden bg-ll-wine ${className}`}>
      <img
        src={src}
        alt={label}
        crossOrigin="anonymous"
        className={`absolute inset-0 w-full h-full object-cover ${imgClassName}`}
        loading={eager ? 'eager' : 'lazy'}
      />
    </div>
  );
}

/**
 * Hero background video.
 * Preloader stays up until a real frame is painted — not metadata alone.
 * Phones get the lighter encode; laptops keep full 1080p.
 * A local factory still sits underneath so Safari never flashes stock photos.
 */
export function HeroVideo({
  src,
  mobileSrc,
  poster,
  className = '',
}: {
  src: string;
  mobileSrc?: string;
  poster?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const activeSrc = React.useMemo(() => {
    if (mobileSrc && shouldUseMobileHeroVideo()) return mobileSrc;
    return src;
  }, [src, mobileSrc]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    resetHeroReady();
    setPlaying(false);

    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.setAttribute('muted', '');
    el.setAttribute('playsinline', '');
    el.setAttribute('webkit-playsinline', '');
    el.setAttribute('x5-playsinline', 'true');
    el.setAttribute('x5-video-player-type', 'h5');

    let settled = false;
    let revealed = false;
    const timers: number[] = [];
    let frameHandle = 0;

    const settle = () => {
      if (settled) return;
      settled = true;
      markHeroReady();
    };

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      setPlaying(true);
      settle();
    };

    /** Safari often fires `playing` before any pixels — wait for a painted frame. */
    const revealWhenFramed = () => {
      if (revealed || !el) return;

      const rVFC = (
        el as HTMLVideoElement & {
          requestVideoFrameCallback?: (cb: () => void) => number;
        }
      ).requestVideoFrameCallback;

      if (typeof rVFC === 'function') {
        try {
          frameHandle = rVFC.call(el, () => reveal());
          return;
        } catch {
          /* fall through */
        }
      }

      if (el.readyState >= 2 && !el.paused && el.currentTime > 0) {
        requestAnimationFrame(() => requestAnimationFrame(reveal));
        return;
      }

      // Soft fallback — keep poster a beat longer than the playing event
      timers.push(window.setTimeout(reveal, 120));
    };

    const tryPlay = () => {
      if (revealed || !el) return;
      el.muted = true;
      const attempt = el.play();
      if (attempt && typeof attempt.then === 'function') {
        attempt.then(revealWhenFramed).catch(() => {
          // Keep waiting — do not lift the preloader until we paint a frame
          // (or the absolute error / MAX failsafe fires).
        });
      }
    };

    const onReady = () => tryPlay();
    const onPlaying = () => revealWhenFramed();

    if (el.readyState >= 2) onReady();
    else {
      el.addEventListener('loadedmetadata', onReady);
      el.addEventListener('canplay', onReady);
      el.addEventListener('loadeddata', onReady);
      el.addEventListener('canplaythrough', onReady);
    }
    el.addEventListener('playing', onPlaying);
    // Hard failure only — missing/corrupt file should not trap the site forever
    el.addEventListener('error', settle);

    try {
      el.load();
    } catch {
      /* ignore */
    }
    tryPlay();

    const unlock = () => tryPlay();
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('touchend', unlock, { passive: true });
    window.addEventListener('scroll', unlock, { passive: true });
    window.addEventListener('click', unlock);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') tryPlay();
    });
    window.addEventListener('pageshow', unlock);

    for (const ms of [300, 800, 1600, 3000, 5000, 8000, 12000]) {
      timers.push(window.setTimeout(tryPlay, ms));
    }

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      el.removeEventListener('loadedmetadata', onReady);
      el.removeEventListener('canplay', onReady);
      el.removeEventListener('loadeddata', onReady);
      el.removeEventListener('canplaythrough', onReady);
      el.removeEventListener('playing', onPlaying);
      el.removeEventListener('error', settle);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('touchend', unlock);
      window.removeEventListener('scroll', unlock);
      window.removeEventListener('click', unlock);
      window.removeEventListener('pageshow', unlock);
      const cancel = (
        el as HTMLVideoElement & {
          cancelVideoFrameCallback?: (h: number) => void;
        }
      ).cancelVideoFrameCallback;
      if (frameHandle && typeof cancel === 'function') {
        try {
          cancel.call(el, frameHandle);
        } catch {
          /* ignore */
        }
      }
    };
  }, [activeSrc]);

  return (
    <div className={`absolute inset-0 bg-ll-ink ${className}`}>
      {poster ? (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            playing ? 'opacity-0' : 'opacity-100'
          }`}
          decoding="async"
          fetchPriority="high"
        />
      ) : null}
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          playing ? 'opacity-100' : 'opacity-0'
        }`}
        src={activeSrc}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        aria-label="GraphixEye factory"
      />
    </div>
  );
}
