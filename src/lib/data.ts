import productsData from '@/data/products.json';
import { ProductsData, LeagueData, TeamData, Product } from './types';
import { SUB_LEAGUE_SLUGS } from './subLeagueLogos';

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

export function getSubLeaguesForLeague(leagueSlug: string): Record<string, { id: string; name: string; slug: string; count: number }[]> {
  const league = data.leagues[leagueSlug];
  if (!league) return {};
  const groups: Record<string, { id: string; name: string; slug: string; count: number }[]> = {};
  for (const teamRef of league.teams) {
    const team = data.teams[teamRef.id];
    const sub = team?.subLeague || 'Andere';
    if (!groups[sub]) groups[sub] = [];
    groups[sub].push(teamRef);
  }
  return groups;
}

export function getAllTeamIds(): string[] {
  return Object.keys(data.teams);
}

export function getAllLeagueSlugs(): string[] {
  return Object.keys(data.leagues);
}

export function getProductByHandle(handle: string): { product: Product; teamId: string; teamName: string; leagueName: string; leagueSlug: string; subLeague?: string } | undefined {
  for (const [teamId, team] of Object.entries(data.teams)) {
    for (const product of team.products) {
      if (product.h === handle) {
        return { product, teamId, teamName: team.name, leagueName: team.leagueName, leagueSlug: team.league, subLeague: team.subLeague };
      }
    }
  }
  return undefined;
}

export function getTeamsBySubLeague(leagueSlug: string, subLeagueSlug: string): { subLeagueName: string; teams: { id: string; name: string; slug: string; count: number }[] } | undefined {
    const league = data.leagues[leagueSlug];
  if (!league) return undefined;

  // Find the sub-league name from slug
  let subLeagueName = '';
  for (const [name, slug] of Object.entries(SUB_LEAGUE_SLUGS)) {
    if (slug === subLeagueSlug) {
      subLeagueName = name;
      break;
    }
  }
  if (!subLeagueName) return undefined;

  const teams = league.teams.filter(teamRef => {
    const team = data.teams[teamRef.id];
    return team?.subLeague === subLeagueName;
  });

  if (teams.length === 0) return undefined;
  return { subLeagueName, teams };
}

export function getAllSubLeagueSlugs(leagueSlug: string): string[] {
    const subLeagues = getSubLeaguesForLeague(leagueSlug);
  return Object.keys(subLeagues).map(name => SUB_LEAGUE_SLUGS[name]).filter(Boolean);
}

export function getAllProductHandles(): string[] {
  const handles: string[] = [];
  for (const team of Object.values(data.teams)) {
    for (const product of team.products) {
      handles.push(product.h);
    }
  }
  return handles;
}

export function searchProducts(query: string, limit = 20) {
  const q = query.toLowerCase();
  const results: Array<{ teamId: string; teamName: string; product: Product }> = [];
  for (const [teamId, team] of Object.entries(data.teams)) {
    for (const product of team.products) {
      if (product.t.toLowerCase().includes(q) || team.name.toLowerCase().includes(q)) {
        results.push({ teamId, teamName: team.name, product });
        if (results.length >= limit) return results;
      }
    }
  }
  return results;
}

export function searchTeams(query: string, limit = 10) {
  const q = query.toLowerCase();
  const results: Array<{ id: string; name: string; league: string; leagueName: string; productCount: number }> = [];
  for (const [id, team] of Object.entries(data.teams)) {
    if (team.name.toLowerCase().includes(q)) {
      results.push({ id, name: team.name, league: team.league, leagueName: team.leagueName, productCount: team.productCount });
      if (results.length >= limit) return results;
    }
  }
  return results;
}
