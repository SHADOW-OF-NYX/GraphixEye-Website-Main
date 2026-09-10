import React, { Suspense, lazy, useMemo, useState, type FormEvent } from 'react';
import type { SceneVariant } from '../components/careers/CareerParticles';
import {
  vendorBenefits,
  vendorCategories,
  vendorCategoryDetails,
  type VendorCategory,
} from '../data/vendors';
import { site } from '../data/site';
import Seo from '../components/Seo';
import { getPageSeo } from '../data/seo';

const CareerParticles = lazy(() => import('../components/careers/CareerParticles'));

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ce-badge-icon" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3 3 8l9 5 9-5-9-5Z" strokeLinejoin="round" />
      <path d="m3 13 9 5 9-5" strokeLinejoin="round" />
    </svg>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="ce-badge">
      <LayersIcon />
      {children}
    </span>
  );
}

function ArrowCircle() {
  return (
    <span className="ce-arrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function PrimaryButton({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a href={href} className="ce-btn ce-btn--primary">
      <span>{children}</span>
      <ArrowCircle />
    </a>
  );
}

function GhostButton({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a href={href} className="ce-btn ce-btn--ghost">
      {children}
    </a>
  );
}

/* Supply-floor shapes and the foundry palette — deliberately not the Careers set */
const MORPH_VARIANTS: SceneVariant[] = ['lattice', 'lanes', 'orbit', 'stack'];
const CTA_VARIANT: SceneVariant[] = ['converge'];

type VendorFormState = {
  company: string;
  contact: string;
  email: string;
  phone: string;
  crNumber: string;
  vatNumber: string;
  city: string;
  category: VendorCategory;
  supply: string;
};

const INITIAL_FORM: VendorFormState = {
  company: '',
  contact: '',
  email: '',
  phone: '',
  crNumber: '',
  vatNumber: '',
  city: '',
  category: 'Materials',
  supply: '',
};

function CategoryCard({
  title,
  summary,
  examples,
  open,
  onToggle,
}: {
  title: string;
  summary: string;
  examples: string[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`ce-job ${open ? 'ce-job--open' : ''}`}>
      <button type="button" className="ce-job-head" onClick={onToggle} aria-expanded={open}>
        <div className="ce-job-headline">
          <h3 className="ce-job-title">{title}</h3>
          <p className="ce-job-summary">{summary}</p>
        </div>
        <div className="ce-job-meta">
          <span className="ce-job-toggle" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </button>

      {open && (
        <div className="ce-job-body">
          <p className="ce-job-subhead">Examples we look for</p>
          <ul className="ce-job-list">
            {examples.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="ce-job-foot">
            <span className="ce-job-loc">Register under this category below</span>
            <a href="#register" className="ce-btn ce-btn--primary ce-btn--sm">
              <span>Start registration</span>
              <ArrowCircle />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Vendors() {
  const [filter, setFilter] = useState<'All' | VendorCategory>('All');
  const [openId, setOpenId] = useState<string | null>(null);
  const [form, setForm] = useState<VendorFormState>(INITIAL_FORM);

  const visible = useMemo(
    () =>
      filter === 'All'
        ? vendorCategoryDetails
        : vendorCategoryDetails.filter((item) => item.id === filter),
    [filter],
  );

  const update =
    (key: keyof VendorFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const body = [
      'Hello GraphixEye procurement team,',
      '',
      'I would like to register as a vendor.',
      '',
      `Company: ${form.company}`,
      `Contact: ${form.contact}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `CR number: ${form.crNumber || '—'}`,
      `VAT number: ${form.vatNumber || '—'}`,
      `City: ${form.city}`,
      `Category: ${form.category}`,
      '',
      'What we supply:',
      form.supply,
      '',
      'Thank you,',
      form.contact || form.company,
    ].join('\n');

    const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
      `Vendor registration — ${form.company || 'New supplier'}`,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  };

  return (
    <div className="ce-page ce-page--vendors" data-nav-tone="dark">
      <Seo page={getPageSeo('/vendors')!} />
      <div className="ce-morph-track">
        <div className="ce-morph-canvas">
          <Suspense fallback={null}>
            <CareerParticles
              variants={MORPH_VARIANTS}
              palette="vendors"
              scrollTrack=".ce-morph-track"
              className="ce-scene"
            />
          </Suspense>
        </div>

        <div className="ce-morph-content">
          <section className="ce-section ce-hero">
            <div className="ce-inner ce-center">
              <Badge>Vendor portal</Badge>
              <h1 className="ce-h1 ce-shimmer">
                Register to supply
                <br />
                the Dammam floor
              </h1>
              <p className="ce-lead">
                We partner with suppliers who can keep pace with design, print, finishing, and
                install — under one roof in the 2nd Industrial City.
              </p>
              <div className="ce-actions">
                <PrimaryButton href="#register">Start registration</PrimaryButton>
                <GhostButton href="#categories">Supply categories</GhostButton>
              </div>
            </div>
          </section>

          <section className="ce-section ce-wave-section" id="partner">
            <div className="ce-inner ce-split">
              <div className="ce-split-left">
                <Badge>Why partner with us</Badge>
                <h2 className="ce-h2 ce-shimmer">
                  Specs locked.
                  <br />
                  Volume real.
                  <br />
                  One factory buyer.
                </h2>
              </div>
              <div className="ce-split-right">
                <p className="ce-body">
                  GraphixEye buys for a working production floor — not a chain of middlemen. If your
                  materials, equipment, or services hold up under industrial load, we want your
                  details on file.
                </p>
                <div className="ce-actions">
                  <PrimaryButton href="#register">Register your company</PrimaryButton>
                  <GhostButton href={`mailto:${site.email}`}>Talk to procurement</GhostButton>
                </div>
              </div>
            </div>
          </section>

          <section className="ce-section ce-galaxy-section">
            <div className="ce-inner ce-center ce-galaxy-inner">
              <Badge>What we buy</Badge>
              <h2 className="ce-h2 ce-shimmer">
                From stock to site —
                <br />
                every input matters
              </h2>
              <p className="ce-body ce-body--center ce-galaxy-body">
                Substrates, finishing consumables, machine parts, freight, and specialist services
                all feed the same jobs that leave Dammam for headquarters, hotels, and industrial
                sites across the Kingdom.
              </p>
              <div className="ce-actions ce-actions--center">
                <PrimaryButton href="#categories">Browse categories</PrimaryButton>
                <GhostButton href="/services">See our work</GhostButton>
              </div>
            </div>
          </section>

          <section className="ce-section ce-helix-section">
            <div className="ce-inner ce-helix-inner">
              <div className="ce-stat-card ce-stat-card--left">
                <p className="ce-stat-label">Factory since</p>
                <p className="ce-stat-value">2009</p>
                <p className="ce-stat-note">
                  Fifteen years of identity, signage, print, and packaging out of Dammam.
                </p>
              </div>

              <div className="ce-stat-card ce-stat-card--right">
                <p className="ce-stat-label">Supply lanes</p>
                <p className="ce-stat-value ce-stat-value--amber">{vendorCategories.length}</p>
                <p className="ce-stat-note">
                  Materials, finishing, equipment, logistics, services, and more.
                </p>
              </div>

              <div className="ce-stat-card ce-stat-card--bottom">
                <p className="ce-stat-label">Why partners stay</p>
                <p className="ce-stat-value ce-stat-value--gold">1</p>
                <p className="ce-stat-note">
                  One buyer for the whole floor — clearer specs, fewer handoffs.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="ce-section ce-roles-section" id="categories">
        <div className="ce-inner">
          <div className="ce-center ce-roles-head">
            <Badge>Supply categories</Badge>
            <h2 className="ce-h2 ce-shimmer">Where you fit</h2>
            <p className="ce-body ce-body--center">
              Choose the lane that matches what you supply, then complete registration below.
            </p>
          </div>

          <div className="ce-filters">
            <button
              type="button"
              onClick={() => setFilter('All')}
              className={`ce-filter ${filter === 'All' ? 'ce-filter--active' : ''}`}
            >
              All categories
            </button>
            {vendorCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`ce-filter ${filter === item ? 'ce-filter--active' : ''}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="ce-jobs">
            {visible.map((item) => (
              <CategoryCard
                key={item.id}
                title={item.title}
                summary={item.summary}
                examples={item.examples}
                open={openId === item.id}
                onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
              />
            ))}
          </div>

          <div className="ce-vendor-benefits">
            {vendorBenefits.map((item) => (
              <div key={item.title} className="ce-vendor-benefit">
                <p className="ce-job-subhead">{item.title}</p>
                <p className="ce-vendor-benefit-body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ce-section ce-roles-section ce-vendor-register" id="register">
        <div className="ce-inner">
          <div className="ce-center ce-roles-head">
            <Badge>Vendor registration</Badge>
            <h2 className="ce-h2 ce-shimmer">Tell us who you are</h2>
            <p className="ce-body ce-body--center">
              Submit your company details. We will open your mail client with a ready-to-send brief
              to {site.email}.
            </p>
          </div>

          <form className="ce-vendor-form" onSubmit={handleSubmit}>
            <div className="ce-vendor-grid">
              <label className="ce-field">
                <span className="ce-field-label">Company name</span>
                <input
                  required
                  type="text"
                  value={form.company}
                  onChange={update('company')}
                  placeholder="Legal company name"
                  className="ce-input"
                />
              </label>

              <label className="ce-field">
                <span className="ce-field-label">Contact person</span>
                <input
                  required
                  type="text"
                  value={form.contact}
                  onChange={update('contact')}
                  placeholder="Full name"
                  className="ce-input"
                />
              </label>

              <label className="ce-field">
                <span className="ce-field-label">Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="vendor@example.com"
                  className="ce-input"
                />
              </label>

              <label className="ce-field">
                <span className="ce-field-label">Phone</span>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder="+966"
                  className="ce-input"
                />
              </label>

              <label className="ce-field">
                <span className="ce-field-label">CR number</span>
                <input
                  type="text"
                  value={form.crNumber}
                  onChange={update('crNumber')}
                  placeholder="Commercial registration"
                  className="ce-input"
                />
              </label>

              <label className="ce-field">
                <span className="ce-field-label">VAT number</span>
                <input
                  type="text"
                  value={form.vatNumber}
                  onChange={update('vatNumber')}
                  placeholder="Optional"
                  className="ce-input"
                />
              </label>

              <label className="ce-field">
                <span className="ce-field-label">City</span>
                <input
                  required
                  type="text"
                  value={form.city}
                  onChange={update('city')}
                  placeholder="Dammam, Riyadh, Jeddah…"
                  className="ce-input"
                />
              </label>

              <label className="ce-field">
                <span className="ce-field-label">Supply category</span>
                <select
                  required
                  value={form.category}
                  onChange={update('category')}
                  className="ce-input ce-select"
                >
                  {vendorCategories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="ce-field ce-field--full">
              <span className="ce-field-label">What you supply</span>
              <textarea
                required
                rows={5}
                value={form.supply}
                onChange={update('supply')}
                placeholder="Products, services, capacity, lead times, and any certifications…"
                className="ce-input ce-textarea"
              />
            </label>

            <div className="ce-vendor-form-foot">
              <p className="ce-vendor-form-note">
                By submitting, your details are prepared as an email to our procurement inbox. No
                account is created on this site.
              </p>
              <button type="submit" className="ce-btn ce-btn--primary">
                <span>Submit registration</span>
                <ArrowCircle />
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="ce-section ce-cta-section">
        <Suspense fallback={null}>
          <CareerParticles variants={CTA_VARIANT} palette="vendors" className="ce-scene" />
        </Suspense>
        <div className="ce-inner ce-center">
          <Badge>Already a supplier?</Badge>
          <h2 className="ce-h2 ce-shimmer">
            Reach procurement
            <br />
            directly
          </h2>
          <p className="ce-lead">
            For active POs, deliveries, or updates to an existing account, write us or call the
            factory.
          </p>
          <div className="ce-actions ce-actions--center">
            <PrimaryButton href={`mailto:${site.email}?subject=${encodeURIComponent('Existing vendor')}`}>
              Email procurement
            </PrimaryButton>
            <GhostButton href="/contact">Contact us</GhostButton>
          </div>
        </div>
      </section>
    </div>
  );
}
