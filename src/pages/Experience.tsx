import React, { Suspense, lazy } from 'react';
import type { SceneVariant } from '../components/careers/CareerParticles';
import { journey, sessionSteps, site, standAlone } from '../data/site';
import Seo from '../components/Seo';
import { getPageSeo } from '../data/seo';

const CareerParticles = lazy(() => import('../components/careers/CareerParticles'));

function FloorIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ce-badge-icon" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 19h16M6 19V9l6-4 6 4v10" strokeLinejoin="round" />
      <path d="M10 19v-5h4v5" strokeLinejoin="round" />
    </svg>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="ce-badge">
      <FloorIcon />
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

/* Press rollers → stock sheet → die cut → production path; seal for the visit CTA */
const MORPH_VARIANTS: SceneVariant[] = ['press', 'sheet', 'die', 'path'];
const CTA_VARIANT: SceneVariant[] = ['seal'];

const FLOOR_STOPS = [
  {
    title: 'Press & print',
    body: 'Offset, digital, silk screen, and UV, colour checked on the machine, not only on a screen.',
  },
  {
    title: 'Finishing bays',
    body: 'Lamination, die cutting, hot stamping, and bindery written on the same job sheet as the print.',
  },
  {
    title: 'Sample room',
    body: 'Materials, proofs, and finished pieces you can hold before anything goes to volume.',
  },
  {
    title: 'Dispatch & install',
    body: 'The same team that runs the floor can deliver and fit across the Kingdom.',
  },
];

export default function Experience() {
  return (
    <div className="ce-page ce-page--experience" data-nav-tone="dark">
      <Seo page={getPageSeo('/experience')!} />
      <div className="ce-morph-track">
        <div className="ce-morph-canvas">
          <Suspense fallback={null}>
            <CareerParticles
              variants={MORPH_VARIANTS}
              palette="experience"
              scrollTrack=".ce-morph-track"
              className="ce-scene"
            />
          </Suspense>
        </div>

        <div className="ce-morph-content">
          <section className="ce-section ce-hero">
            <div className="ce-inner ce-center">
              <Badge>Factory visit</Badge>
              <h1 className="ce-h1 ce-shimmer">
                Walk the Dammam
                <br />
                floor with us
              </h1>
              <p className="ce-lead">
                Identity, signage, print, and finishing under one roof in the 2nd Industrial City -
                a working factory we are proud to show, not a showroom built for photographs.
              </p>
              <div className="ce-actions">
                <PrimaryButton href={`mailto:${site.email}?subject=${encodeURIComponent('Factory visit request')}`}>
                  Book a visit
                </PrimaryButton>
                <GhostButton href="#journey">How a job runs</GhostButton>
              </div>
            </div>
          </section>

          <section className="ce-section ce-wave-section" id="floor">
            <div className="ce-inner ce-split">
              <div className="ce-split-left">
                <Badge>On the floor</Badge>
                <h2 className="ce-h2 ce-shimmer">
                  Presses first.
                  <br />
                  Then finishing.
                  <br />
                  Then the site.
                </h2>
              </div>
              <div className="ce-split-right">
                <p className="ce-body">
                  A visit is a walkthrough of live work, not a slide deck. You see how colour is
                  locked, how finishes are written into the job, and how install is planned while
                  the piece is still on the floor.
                </p>
                <div className="ce-actions">
                  <PrimaryButton href={`mailto:${site.email}?subject=${encodeURIComponent('Factory visit request')}`}>
                    Request a walkthrough
                  </PrimaryButton>
                  <GhostButton href="/contact">Talk to the team</GhostButton>
                </div>
              </div>
            </div>
          </section>

          <section className="ce-section ce-galaxy-section">
            <div className="ce-inner ce-center ce-galaxy-inner">
              <Badge>What you will see</Badge>
              <h2 className="ce-h2 ce-shimmer">
                Design beside the
                <br />
                machines that run it
              </h2>
              <p className="ce-body ce-body--center ce-galaxy-body">
                Designers, press operators, and finishers share one building. That is why a proof
                here means something, the people who approved it are the people who will print it.
              </p>
              <div className="ce-actions ce-actions--center">
                <PrimaryButton href="#stops">Floor stops</PrimaryButton>
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
                <p className="ce-stat-label">Under one roof</p>
                <p className="ce-stat-value ce-stat-value--brass">1</p>
                <p className="ce-stat-note">
                  Design through finishing, no handoff to an outside vendor mid-job.
                </p>
              </div>

              <div className="ce-stat-card ce-stat-card--bottom">
                <p className="ce-stat-label">Visit length</p>
                <p className="ce-stat-value ce-stat-value--cream">~90m</p>
                <p className="ce-stat-note">
                  Enough time for the floor, the sample room, and a clear next step.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="ce-section ce-roles-section" id="stops">
        <div className="ce-inner">
          <div className="ce-center ce-roles-head">
            <Badge>Floor stops</Badge>
            <h2 className="ce-h2 ce-shimmer">Where the walk goes</h2>
            <p className="ce-body ce-body--center">
              Four stations on a typical visit. We adjust for press schedules and live jobs on the day.
            </p>
          </div>

          <div className="ce-jobs">
            {FLOOR_STOPS.map((stop, i) => (
              <div key={stop.title} className="ce-job">
                <div className="ce-job-head" style={{ cursor: 'default' }}>
                  <div className="ce-job-headline">
                    <h3 className="ce-job-title">
                      0{i + 1} · {stop.title}
                    </h3>
                    <p className="ce-job-summary">{stop.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="ce-vendor-benefits">
            {standAlone.map((item) => (
              <div key={item.title} className="ce-vendor-benefit">
                <p className="ce-job-subhead">{item.title}</p>
                <p className="ce-vendor-benefit-body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ce-section ce-roles-section ce-experience-journey" id="journey">
        <div className="ce-inner">
          <div className="ce-center ce-roles-head">
            <Badge>From first call</Badge>
            <h2 className="ce-h2 ce-shimmer">How a job runs</h2>
            <p className="ce-body ce-body--center">
              The same path whether you visit the floor or brief us remotely, consultation through
              reprints, with specs that stay on file.
            </p>
          </div>

          <div className="ce-experience-steps">
            {journey.map((step, i) => (
              <article key={step.title} className="ce-experience-step">
                <p className="ce-stat-label">0{i + 1}</p>
                <h3 className="ce-experience-step-title">{step.title}</h3>
                <p className="ce-vendor-benefit-body">{step.body}</p>
              </article>
            ))}
          </div>

          <div className="ce-experience-session">
            <p className="ce-job-subhead">A visit session, in order</p>
            <ol className="ce-experience-session-list">
              {sessionSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="ce-section ce-cta-section">
        <Suspense fallback={null}>
          <CareerParticles variants={CTA_VARIANT} palette="experience" className="ce-scene" />
        </Suspense>
        <div className="ce-inner ce-center">
          <Badge>Ready when you are</Badge>
          <h2 className="ce-h2 ce-shimmer">
            Come see the work
            <br />
            being made
          </h2>
          <p className="ce-lead">
            Tell us when you can be in Dammam. We will hold a slot around live press time so the
            floor is actually running when you arrive.
          </p>
          <div className="ce-actions ce-actions--center">
            <PrimaryButton href={`mailto:${site.email}?subject=${encodeURIComponent('Factory visit request')}`}>
              Book a factory visit
            </PrimaryButton>
            <GhostButton href="/contact">Contact us</GhostButton>
          </div>
        </div>
      </section>
    </div>
  );
}
