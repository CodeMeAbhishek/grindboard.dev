import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://grindboard.dev';

  // Core static routes
  const routes = [
    '',
    '/login',
    '/signup',
    '/dashboard',
    '/leaderboard',
    '/events',
    '/interviews',
    '/pro',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
