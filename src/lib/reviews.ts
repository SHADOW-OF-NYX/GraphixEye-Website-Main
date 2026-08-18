import { testimonials, type Testimonial } from '../data/site';

const STORAGE_KEY = 'graphixeye-customer-reviews';

export type CustomerReview = Testimonial;

function readStored(): CustomerReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CustomerReview[];
    return Array.isArray(parsed) ? parsed.filter((r) => r.quote && r.name && r.rating >= 1 && r.rating <= 5) : [];
  } catch {
    return [];
  }
}

function writeStored(reviews: CustomerReview[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

export function loadReviews(): CustomerReview[] {
  const stored = readStored();
  const seedIds = new Set(testimonials.map((t) => t.id));
  const uniqueStored = stored.filter((r) => !seedIds.has(r.id));
  return [...testimonials, ...uniqueStored];
}

export function saveReview(input: { name: string; role: string; quote: string; rating: number }): CustomerReview {
  const review: CustomerReview = {
    id: `review-${Date.now()}`,
    name: input.name.trim(),
    role: input.role.trim() || 'Customer',
    quote: input.quote.trim(),
    rating: Math.min(5, Math.max(1, Math.round(input.rating))),
  };

  const stored = readStored();
  writeStored([review, ...stored]);
  return review;
}
