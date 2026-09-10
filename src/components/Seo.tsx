import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  GEO,
  OG_IMAGE,
  SITE_URL,
  absoluteUrl,
  localBusinessJsonLd,
  webSiteJsonLd,
  type PageSeo,
} from '../data/seo';

type SeoProps = {
  page: PageSeo;
  /** Extra JSON-LD objects (e.g. Service schema on hubs). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Homepage only: include LocalBusiness schema. */
  includeLocalBusiness?: boolean;
  image?: string;
  noindex?: boolean;
};

export default function Seo({
  page,
  jsonLd,
  includeLocalBusiness = false,
  image = OG_IMAGE,
  noindex = false,
}: SeoProps) {
  const url = absoluteUrl(page.path);
  const ogTitle = page.ogTitle ?? page.title;
  const ogDescription = page.ogDescription ?? page.description;
  const schemas: Record<string, unknown>[] = [];

  if (includeLocalBusiness) {
    schemas.push(localBusinessJsonLd);
    schemas.push(webSiteJsonLd);
  }
  if (jsonLd) schemas.push(...(Array.isArray(jsonLd) ? jsonLd : [jsonLd]));

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      {page.keywords ? <meta name="keywords" content={page.keywords} /> : null}
      {noindex ? <meta name="robots" content="noindex,follow" /> : <meta name="robots" content="index,follow" />}

      <link rel="canonical" href={url} />

      <meta name="geo.region" content={GEO.region} />
      <meta name="geo.placename" content={GEO.placename} />
      <meta name="geo.position" content={GEO.position} />
      <meta name="ICBM" content={GEO.icbm} />
      <meta name="language" content="en, ar" />

      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_SA" />
      <meta property="og:site_name" content="GraphixEye" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@GraphixEyeSA" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={image} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

export function DefaultSiteSeo() {
  return (
    <Helmet>
      <link rel="icon" type="image/png" href="/logo.png" />
      <meta property="og:image" content={OG_IMAGE} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <link rel="home" href={SITE_URL} />
    </Helmet>
  );
}
