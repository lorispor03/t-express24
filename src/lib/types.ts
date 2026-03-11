export interface Product {
  t: string;  // title
  h: string;  // handle/slug
  i: string;  // image
  hi: string; // hover image
  p: string;  // price
  c: string[]; // categories
}

export interface TeamData {
  name: string;
  slug: string;
  league: string;
  leagueName: string;
  products: Product[];
  productCount: number;
}

export interface LeagueTeamRef {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface LeagueData {
  name: string;
  country: string;
  teams: LeagueTeamRef[];
  teamCount: number;
  productCount: number;
}

export interface ProductsData {
  leagues: Record<string, LeagueData>;
  teams: Record<string, TeamData>;
}

export const CATEGORIES: Record<string, string> = {
  fan: 'Fan',
  player: 'Player',
  retro: 'Retro',
  longsleeve: 'Langarm',
  kids: 'Kinder',
  'kids-retro': 'Kinder Retro',
  female: 'Damen',
  hoodie: 'Hoodie',
  sweater: 'Sweater',
  windbreaker: 'Windbreaker',
  training: 'Training',
  shorts: 'Shorts',
  socks: 'Socken',
};
