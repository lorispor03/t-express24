import productsData from '@/data/products.json';
import { ProductsData, LeagueData, TeamData } from './types';

const data = productsData as unknown as ProductsData;

export function getAllLeagues(): Record<string, LeagueData> {
  return data.leagues;
}

export function getLeague(slug: string): LeagueData | undefined {
  return data.leagues[slug];
}

export function getTeam(id: string): TeamData | undefined {
  return data.teams[id];
}

export function getTeamsByLeague(leagueSlug: string): TeamData[] {
  const league = data.leagues[leagueSlug];
  if (!league) return [];
  return league.teams.map(t => data.teams[t.id]).filter(Boolean);
}

export function getAllTeamIds(): string[] {
  return Object.keys(data.teams);
}

export function getAllLeagueSlugs(): string[] {
  return Object.keys(data.leagues);
}

export function searchProducts(query: string, limit = 20) {
  const q = query.toLowerCase();
  const results: Array<{ teamId: string; teamName: string; product: any }> = [];
  for (const [teamId, team] of Object.entries(data.teams)) {
    for (const product of team.products) {
      if (product.t.toLowerCase().includes(q)) {
        results.push({ teamId, teamName: team.name, product });
        if (results.length >= limit) return results;
      }
    }
  }
  return results;
}
