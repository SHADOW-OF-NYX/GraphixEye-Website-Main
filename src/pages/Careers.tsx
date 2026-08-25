import React, { Suspense, lazy, useMemo, useState } from 'react';
import type { SceneVariant } from '../components/careers/CareerParticles';
import { jobFilters, jobs, type Job, type JobFilter } from '../data/jobs';
import { site } from '../data/site';

const CareerParticles = lazy(() => import('../components/careers/CareerParticles'));

/* ── Small building blocks that mirror the reference design language ── */

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

/** Shapes morphed across the scroll track, one per section in order. */
const MORPH_VARIANTS: SceneVariant[] = ['ring', 'wave', 'galaxy', 'helix'];
const CTA_VARIANT: SceneVariant[] = ['vortex'];

/* ── Job listing card ── */

function JobCard({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    `Application — ${job.title}`,
  )}&body=${encodeURIComponent(
    `Hello GraphixEye team,\n\nI would like to apply for the ${job.title} position (${job.department}, ${job.location}).\n\nMy CV is attached.\n\nThank you,\n`,
  )}`;

  return (
    <div className={`ce-job ${open ? 'ce-job--open' : ''}`}>
      <button type="button" className="ce-job-head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <div className="ce-job-headline">
          <h3 className="ce-job-title">{job.title}</h3>
          <p className="ce-job-summary">{job.summary}</p>
        </div>

        <div className="ce-job-meta">
          <span className="ce-tag">{job.department}</span>
          <span className="ce-tag">{job.type}</span>
          <span className="ce-tag">{job.experience}</span>
          <span className="ce-job-toggle" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </button>

      {open && (
        <div className="ce-job-body">
          <div className="ce-job-cols">
            <div>
              <p className="ce-job-subhead">What you'll do</p>
              <ul className="ce-job-list">
                {job.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="ce-job-subhead">What you bring</p>
              <ul className="ce-job-list">
                {job.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="ce-job-foot">
            <span className="ce-job-loc">{job.location}</span>
            <a href={mailto} className="ce-btn ce-btn--primary ce-btn--sm">
              <span>Apply for this role</span>
              <ArrowCircle />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Page ── */

export default function Careers() {
  const [filter, setFilter] = useState<JobFilter>('All Roles');

  const visible = useMemo(
    () => (filter === 'All Roles' ? jobs : jobs.filter((j) => j.department === filter)),
    [filter],
  );

  return (
    <div className="ce-page" data-nav-tone="dark">
      {/*
        Morph track: one sticky canvas behind four scrolling sections.
        Particles morph ring → wave → galaxy → helix as the track scrolls.
      */}
      <div className="ce-morph-track">
        <div className="ce-morph-canvas">
          <Suspense fallback={null}>
            <CareerParticles
              variants={MORPH_VARIANTS}
              scrollTrack=".ce-morph-track"
              className="ce-scene"
            />
          </Suspense>
        </div>

        <div className="ce-morph-content">
      {/* ── Hero: glowing ring ── */}
      <section className="ce-section ce-hero">
        <div className="ce-inner ce-center">
          <Badge>Welcome to the team</Badge>
          <h1 className="ce-h1 ce-shimmer">
            Careers that redefine
            <br />
            the nature of craft
          </h1>
          <p className="ce-lead">
            We build brands at the intersection of design, print, and space — where something
            genuinely made comes to life.
          </p>
          <div className="ce-actions">
            <PrimaryButton href="#open-roles">View open roles</PrimaryButton>
            <GhostButton href="#life">Life at GraphixEye</GhostButton>
          </div>
        </div>
      </section>

      {/* ── Growth: wave terrain ── */}
      <section className="ce-section ce-wave-section" id="life">
        <div className="ce-inner ce-split">
          <div className="ce-split-left">
            <Badge>The pull of growth</Badge>
            <h2 className="ce-h2 ce-shimmer">
              Everything revolves
              <br />
              around one thing —
              <br />
              your growth
            </h2>
          </div>
          <div className="ce-split-right">
            <p className="ce-body">
              One factory floor, every discipline. Designers sit beside press operators, and signage
              fabricators work alongside AR developers. You will see your work leave the building and
              land on a wall, a shelf, or a headset.
            </p>
            <div className="ce-actions">
              <PrimaryButton href="#open-roles">Start your application</PrimaryButton>
              <GhostButton href={`mailto:${site.email}`}>Talk to us</GhostButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── Teams: galaxy ── */}
      <section className="ce-section ce-galaxy-section">
        <div className="ce-inner ce-center ce-galaxy-inner">
          <Badge>Our team ecosystem</Badge>
          <h2 className="ce-h2 ce-shimmer">
            A universe of disciplines —
            <br />
            already in motion
          </h2>
          <p className="ce-body ce-body--center ce-galaxy-body">
            We are not a single studio. We are a living ecosystem with production at the core,
            surrounded by design, signage, printing, packaging, and immersive teams orbiting around
            every project.
          </p>
          <div className="ce-actions ce-actions--center">
            <PrimaryButton href="#open-roles">Explore the roles</PrimaryButton>
            <GhostButton href="/services">See our work</GhostButton>
          </div>
        </div>
      </section>

      {/* ── Stats: DNA helix with glass cards ── */}
      <section className="ce-section ce-helix-section">
        <div className="ce-inner ce-helix-inner">
          <div className="ce-stat-card ce-stat-card--left">
            <p className="ce-stat-label">Established</p>
            <p className="ce-stat-value">2009</p>
            <p className="ce-stat-note">
              Fifteen years of identity, signage, print, and packaging out of Dammam.
            </p>
          </div>

          <div className="ce-stat-card ce-stat-card--right">
            <p className="ce-stat-label">Disciplines under one roof</p>
            <p className="ce-stat-value ce-stat-value--blue">8</p>
            <p className="ce-stat-note">
              Design through finishing — no handoffs to outside vendors.
            </p>
          </div>

          <div className="ce-stat-card ce-stat-card--bottom">
            <p className="ce-stat-label">Open positions</p>
            <p className="ce-stat-value ce-stat-value--purple">{jobs.length}</p>
            <p className="ce-stat-note">Across finance, sales, design, production, and immersive.</p>
          </div>
        </div>
      </section>
        </div>
      </div>

      {/* ── Open roles ── */}
      <section className="ce-section ce-roles-section" id="open-roles">
        <div className="ce-inner">
          <div className="ce-center ce-roles-head">
            <Badge>Open positions</Badge>
            <h2 className="ce-h2 ce-shimmer">Find where you fit</h2>
            <p className="ce-body ce-body--center">
              {jobs.length} roles open across our Dammam factory and studio.
            </p>
          </div>

          <div className="ce-filters">
            {jobFilters.map((item) => (
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
            {visible.length ? (
              visible.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <p className="ce-empty">No roles open in this department right now.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA: vortex ── */}
      <section className="ce-section ce-cta-section">
        <Suspense fallback={null}>
          <CareerParticles variants={CTA_VARIANT} className="ce-scene" />
        </Suspense>
        <div className="ce-inner ce-center">
          <Badge>Nothing that fits?</Badge>
          <h2 className="ce-h2 ce-shimmer">
            Send us your work
            <br />
            anyway
          </h2>
          <p className="ce-lead">
            We keep good people on file. Tell us what you do and where you want to take it.
          </p>
          <div className="ce-actions ce-actions--center">
            <PrimaryButton
              href={`mailto:${site.email}?subject=${encodeURIComponent('Open application')}`}
            >
              Send an open application
            </PrimaryButton>
            <GhostButton href="/contact">Contact us</GhostButton>
          </div>
        </div>
      </section>
    </div>
  );
}
