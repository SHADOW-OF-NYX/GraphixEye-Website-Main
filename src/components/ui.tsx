import React from 'react';

export function BrandLogo({ className = 'h-10' }: { className?: string }) {
  return <img src="/logo.png" alt="GraphixEye" className={`w-auto object-contain ${className}`} />;
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
  label,
  src,
  className = '',
  eager = false,
}: {
  label: string;
  src: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <div data-slot={label} className={`relative overflow-hidden bg-ll-wine ${className}`}>
      <img
        src={src}
        alt={label}
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover"
        loading={eager ? 'eager' : 'lazy'}
      />
    </div>
  );
}

export function HeroVideo({
  src,
  poster,
  className = '',
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    const play = () => {
      void el.play().catch(() => undefined);
    };
    play();
    el.addEventListener('canplay', play);
    return () => el.removeEventListener('canplay', play);
  }, [src]);

  return (
    <video
      ref={ref}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label="GraphixEye factory"
    />
  );
}
