import React from 'react';
import { useParams } from 'react-router-dom';
import { getServiceHub } from '../data/serviceHubs';
import ServiceHubPage from './ServiceHub';
import ServiceDetail from './ServiceDetail';

/** Resolves category SEO hubs before individual work detail pages. */
export default function ServicePage() {
  const { slug = '' } = useParams();
  const hub = getServiceHub(slug);
  if (hub) return <ServiceHubPage hub={hub} />;
  return <ServiceDetail />;
}
