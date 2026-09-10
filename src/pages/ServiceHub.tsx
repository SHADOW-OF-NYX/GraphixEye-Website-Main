import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { Placeholder } from '../components/ui';
import { getPageSeo, SITE_URL, breadcrumbJsonLd } from '../data/seo';
import { getServiceHub, worksForHub, type ServiceHub } from '../data/serviceHubs';
import { getCategoryForWork } from '../data/works';

function hubJsonLd(hub: ServiceHub) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: hub.h1,
      serviceType: hub.schemaServiceType,
      description: hub.intro,
      provider: {
        '@type': 'LocalBusiness',
        name: 'GraphixEye',
        url: SITE_URL,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dammam',
          addressRegion: 'Eastern Province',
          addressCountry: 'SA',
        },
      },
      areaServed: ['Saudi Arabia', 'Dammam', 'Riyadh', 'Jeddah'],
      url: `${SITE_URL}/services/${hub.slug}`,
    },
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: hub.eyebrow, path: `/services/${hub.slug}` },
    ]),
  ];
}

export default function ServiceHubPage({ hub }: { hub: ServiceHub }) {
  const seo = getPageSeo(`/services/${hub.slug}`)!;
  const childWorks = worksForHub(hub);
  const related = hub.relatedHubs
    .map((slug) => getServiceHub(slug))
    .filter(Boolean) as ServiceHub[];

  return (
    <div className="bg-ll-white min-h-screen pt-28 pb-28">
      <Seo page={seo} jsonLd={hubJsonLd(hub)} image={`${SITE_URL}${hub.image}`} />

      <section className="px-4 md:px-8 mb-14">
        <div className="relative card-r overflow-hidden min-h-[58vh] bg-black" data-nav-tone="dark">
          <Placeholder src={hub.image} label={hub.imageAlt} eager className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14 text-ll-white">
            <Link to="/services" className="mb-8 text-[13px] text-ll-white/70 hover:text-ll-white transition-colors w-fit">
              ← Services
            </Link>
            <p className="text-[12px] tracking-[0.22em] uppercase text-ll-white/65 mb-3">{hub.eyebrow}</p>
            <h1 className="display-xl max-w-5xl">{hub.h1}</h1>
          </div>
        </div>
      </section>

      <section className="max-w-[900px] mx-auto px-6 md:px-8 mb-16">
        <p className="text-[17px] leading-relaxed text-black/65">{hub.intro}</p>
      </section>

      <section className="max-w-[900px] mx-auto px-6 md:px-8 space-y-14 mb-20">
        {hub.sections.map((section) => (
          <div key={section.h2}>
            <h2 className="display-md mb-4">{section.h2}</h2>
            <p className="text-[16px] leading-relaxed text-black/55">{section.body}</p>
          </div>
        ))}
      </section>

      <section className="max-w-[900px] mx-auto px-6 md:px-8 space-y-10 mb-20">
        <p className="text-[13px] tracking-[0.22em] uppercase text-black/40">Service areas</p>
        {hub.cities.map((city) => (
          <div key={city.h2}>
            <h2 className="display-md mb-4">{city.h2}</h2>
            <p className="text-[16px] leading-relaxed text-black/55">{city.body}</p>
          </div>
        ))}
      </section>

      <section className="max-w-[900px] mx-auto px-6 md:px-8 mb-20" lang="ar" dir="rtl">
        <h2 className="display-md mb-4 text-right">{hub.arabicH2}</h2>
        <p className="text-[16px] leading-relaxed text-black/55 text-right">{hub.arabicBody}</p>
      </section>

      {childWorks.length > 0 ? (
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 mb-20">
          <p className="text-[13px] tracking-[0.22em] uppercase text-black/40 mb-4">Capabilities</p>
          <h2 className="display-md mb-10">Explore {hub.eyebrow.toLowerCase()} services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {childWorks.map((work) => {
              const meta = getCategoryForWork(work);
              return (
                <Link
                  key={work.slug}
                  to={`/services/${work.slug}`}
                  className="group block"
                >
                  <div className="relative card-r overflow-hidden aspect-[4/3] bg-black mb-4">
                    <Placeholder
                      src={work.image}
                      label={`${work.title} ${work.location} GraphixEye Dammam`}
                      className="absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
                    {meta ? (
                      <span
                        className={`pointer-events-none absolute bottom-4 left-4 h-2 w-16 rounded-full bg-gradient-to-r ${meta.glow}`}
                      />
                    ) : null}
                  </div>
                  <h3 className="text-[18px] font-display group-hover:text-ll-highlight transition-colors">{work.title}</h3>
                  <p className="text-[13px] text-black/45 mt-1">{work.summary}</p>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="max-w-[900px] mx-auto px-6 md:px-8 mb-16">
        <p className="text-[13px] tracking-[0.22em] uppercase text-black/40 mb-4">Related</p>
        <div className="flex flex-wrap gap-4">
          {related.map((r) => (
            <Link
              key={r.slug}
              to={`/services/${r.slug}`}
              className="text-[15px] underline underline-offset-4 hover:text-ll-highlight transition-colors"
            >
              {r.anchorLabel}
            </Link>
          ))}
          <Link to="/contact" className="text-[15px] underline underline-offset-4 hover:text-ll-highlight transition-colors">
            Get a quote — {hub.primaryKeyword}
          </Link>
        </div>
      </section>

      <section className="max-w-[900px] mx-auto px-6 md:px-8">
        <div className="bg-ll-sand card-r p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="display-md mb-3">Get a Free Quote for {hub.primaryKeyword}</h2>
            <p className="text-[15px] text-black/55 max-w-md">
              Tell us about your {hub.primaryKeyword} brief in Dammam or anywhere in Saudi Arabia. We respond within 24 hours.
            </p>
          </div>
          <Link
            to="/contact"
            className="self-start pill bg-black text-ll-white h-[52px] px-8 text-[14px] inline-flex items-center hover:bg-ll-highlight transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
