import React, { useMemo, useState } from 'react';
import StarRating from './StarRating';
import { loadReviews, saveReview, type CustomerReview } from '../lib/reviews';

export default function ReviewSection() {
  const [reviews, setReviews] = useState<CustomerReview[]>(() => loadReviews());
  const [slide, setSlide] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const current = reviews[slide];

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !quote.trim()) {
      setError('Please add your name and review.');
      return;
    }

    const review = saveReview({ name, role, quote, rating });
    const next = [review, ...reviews.filter((r) => r.id !== review.id)];
    setReviews(next);
    setSlide(0);
    setSubmitted(true);
    setShowForm(false);
    setName('');
    setRole('');
    setQuote('');
    setRating(5);
  };

  return (
    <section className="px-6 md:px-12 py-24">
      <div className="grid md:grid-cols-[1fr_1fr] gap-12 items-start">
        <div>
          <p className="text-black/40 mb-3">Testimonials</p>
          <h2 className="display-md mb-4">What clients say</h2>
          <div className="flex items-center gap-3 mb-10">
            <StarRating value={Math.round(averageRating)} size="sm" />
            <p className="text-[14px] text-black/50">
              {averageRating.toFixed(1)} average · {reviews.length} review{reviews.length === 1 ? '' : 's'}
            </p>
          </div>

          {current && (
            <div className="max-w-xl min-h-[200px]">
              <StarRating value={current.rating} size="sm" className="mb-5" />
              <p className="font-display text-[28px] md:text-[36px] leading-snug mb-8">“{current.quote}”</p>
              <p className="text-[15px]">{current.name}</p>
              <p className="text-[14px] text-black/45">{current.role}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-10">
            <button
              type="button"
              onClick={() => setSlide((s) => (s === 0 ? reviews.length - 1 : s - 1))}
              className="pill border border-black w-12 h-12 inline-flex items-center justify-center hover:bg-black hover:text-ll-white transition-colors"
              aria-label="Previous review"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setSlide((s) => (s + 1) % reviews.length)}
              className="pill border border-black w-12 h-12 inline-flex items-center justify-center hover:bg-black hover:text-ll-white transition-colors"
              aria-label="Next review"
            >
              ›
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm((open) => !open);
                setSubmitted(false);
              }}
              className="pill bg-black text-ll-white h-12 px-6 inline-flex items-center text-[14px] hover:bg-ll-highlight transition-colors"
            >
              {showForm ? 'Close form' : 'Leave a review'}
            </button>
          </div>
        </div>

        <div className="card-r bg-ll-sand p-8 md:p-10">
          {submitted && !showForm ? (
            <div className="min-h-[320px] flex flex-col justify-center">
              <p className="font-display text-[22px] mb-3">Thank you for your review.</p>
              <p className="text-[14px] text-black/55 leading-relaxed">
                Your feedback has been saved and is now part of the carousel. We appreciate you taking the time to
                share your experience with GraphixEye.
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-8 self-start pill border border-black h-11 px-5 text-[13px] hover:bg-black hover:text-ll-white transition-colors"
              >
                Write another review
              </button>
            </div>
          ) : showForm ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <p className="font-display text-[22px] mb-2">Share your experience</p>
                <p className="text-[14px] text-black/50">Rate your project and leave a short note for other clients.</p>
              </div>

              <div>
                <p className="text-[12px] tracking-widest uppercase text-black/40 mb-3">Your rating</p>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <div>
                <label htmlFor="review-name" className="block text-[12px] tracking-widest uppercase text-black/40 mb-3">
                  Name
                </label>
                <input
                  id="review-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First and last name"
                  className="w-full bg-ll-white text-black px-4 py-3 outline-none pill"
                  required
                />
              </div>

              <div>
                <label htmlFor="review-role" className="block text-[12px] tracking-widest uppercase text-black/40 mb-3">
                  Role or company <span className="normal-case tracking-normal text-black/30">(optional)</span>
                </label>
                <input
                  id="review-role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Brand lead · Acme Co."
                  className="w-full bg-ll-white text-black px-4 py-3 outline-none pill"
                />
              </div>

              <div>
                <label htmlFor="review-quote" className="block text-[12px] tracking-widest uppercase text-black/40 mb-3">
                  Review
                </label>
                <textarea
                  id="review-quote"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="What stood out about working with GraphixEye?"
                  rows={4}
                  className="w-full bg-ll-white text-black px-4 py-3 outline-none card-r resize-none"
                  required
                />
              </div>

              {error && <p className="text-[13px] text-ll-highlight">{error}</p>}

              <button
                type="submit"
                className="self-start pill bg-black text-ll-white h-[52px] px-8 text-[14px] hover:bg-ll-highlight transition-colors"
              >
                Submit review
              </button>
            </form>
          ) : (
            <div className="min-h-[320px] flex flex-col justify-center">
              <p className="font-display text-[22px] mb-3">Worked with us recently?</p>
              <p className="text-[14px] text-black/55 leading-relaxed mb-8">
                Clients can leave a star rating and a short review. Your feedback helps future partners understand what
                it is like to work with GraphixEye from brief to install.
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="self-start pill bg-black text-ll-white h-[52px] px-8 text-[14px] hover:bg-ll-highlight transition-colors"
              >
                Leave a review
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
