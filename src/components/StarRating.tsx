import React from 'react';

type Props = {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md';
  className?: string;
};

export default function StarRating({ value, onChange, size = 'md', className = '' }: Props) {
  const interactive = typeof onChange === 'function';
  const starSize = size === 'sm' ? 'text-[16px]' : 'text-[22px]';

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={interactive ? 'Rating' : `${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        const common = `${starSize} leading-none transition-colors ${filled ? 'text-ll-highlight' : 'text-black/15'}`;

        if (!interactive) {
          return (
            <span key={star} className={common} aria-hidden="true">
              ★
            </span>
          );
        }

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} star${star === 1 ? '' : 's'}`}
            onClick={() => onChange(star)}
            className={`${common} hover:text-ll-highlight focus:outline-none focus-visible:ring-2 focus-visible:ring-ll-highlight/40 rounded-sm`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
