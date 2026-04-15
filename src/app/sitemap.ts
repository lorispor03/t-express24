import type { MetadataRoute } from 'next';
import { getAllLeagues, getAllTeamIds, getTeam } from '@/lib/data';

const SITE_URL = 'https://t-express24.shop';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Statische Seiten
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/leagues`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/bundles`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/agb`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/datenschutz`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Alle Ligen
  const leagues = getAllLeagues();
  const leagueRoutes: MetadataRoute.Sitemap = Object.keys(leagues).map((slug) => ({
    url: `${SITE_URL}/league/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Alle Teams + alle Produkte
  const teamRoutes: MetadataRoute.Sitemap = [];
  const productRoutes: MetadataRoute.Sitemap = [];

  for (const teamId of getAllTeamIds()) {
    teamRoutes.push({
      url: `${SITE_URL}/team/${teamId}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    });

    const team = getTeam(teamId);
    if (team) {
      for (const product of team.products) {
        productRoutes.push({
          url: `${SITE_URL}/product/${product.h}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }
  }

  return [...staticRoutes, ...leagueRoutes, ...teamRoutes, ...productRoutes];
}
