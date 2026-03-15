export interface PatchOption {
  id: string;
  name: string;
  image: string;
  price: number;
}

// All available patches
const PATCHES: Record<string, PatchOption> = {
  // Top 5 league patches
  'bundesliga': { id: 'bundesliga', name: 'Bundesliga', image: '/leagues/bundesliga.svg', price: 2 },
  'premier-league': { id: 'premier-league', name: 'Premier League', image: '/leagues/premier-league.svg', price: 2 },
  'la-liga': { id: 'la-liga', name: 'La Liga', image: '/leagues/la-liga-new.svg', price: 2 },
  'serie-a': { id: 'serie-a', name: 'Serie A', image: '/leagues/serie-a.png', price: 2 },
  'ligue-1': { id: 'ligue-1', name: 'Ligue 1', image: '/leagues/ligue-1.png', price: 2 },
  'liga-portugal': { id: 'liga-portugal', name: 'Liga Portugal', image: '/leagues/liga-portugal.png', price: 2 },
  'eredivisie': { id: 'eredivisie', name: 'Eredivisie', image: '/leagues/eredivisie.png', price: 2 },

  // Sub-league patches
  'scottish-premiership': { id: 'scottish-premiership', name: 'Scottish Premiership', image: '/leagues/scottish-premiership.png', price: 2 },
  'super-lig': { id: 'super-lig', name: 'Süper Lig', image: '/leagues/super-lig.png', price: 2 },
  'super-league-greece': { id: 'super-league-greece', name: 'Super League', image: '/leagues/super-league-greece.png', price: 2 },
  'austrian-bundesliga': { id: 'austrian-bundesliga', name: 'Öst. Bundesliga', image: '/leagues/austrian-bundesliga.png', price: 2 },
  'hnl': { id: 'hnl', name: 'Hrvatska NL', image: '/leagues/hnl.png', price: 2 },
  'liga-i': { id: 'liga-i', name: 'Liga I', image: '/leagues/liga-1-romania.png', price: 2 },
  'allsvenskan': { id: 'allsvenskan', name: 'Allsvenskan', image: '/leagues/allsvenskan.png', price: 2 },
  'superliga': { id: 'superliga', name: 'Superliga', image: '/leagues/superliga-denmark.png', price: 2 },
  'jupiler-pro-league': { id: 'jupiler-pro-league', name: 'Jupiler Pro League', image: '/leagues/jupiler-pro-league.png', price: 2 },
  'super-league-ch': { id: 'super-league-ch', name: 'Super League', image: '/leagues/super-league-switzerland.png', price: 2 },

  // World club leagues
  'brasileirao': { id: 'brasileirao', name: 'Brasileirão', image: '/leagues/brasileirao.png', price: 2 },
  'liga-argentina': { id: 'liga-argentina', name: 'Liga Profesional', image: '/leagues/liga-argentina.png', price: 2 },
  'mls': { id: 'mls', name: 'MLS', image: '/leagues/mls.png', price: 2 },
  'liga-mx': { id: 'liga-mx', name: 'Liga MX', image: '/leagues/liga-mx.png', price: 2 },
  'saudi-pro-league': { id: 'saudi-pro-league', name: 'Saudi Pro League', image: '/leagues/saudi-pro-league.png', price: 2 },
  'primera-chile': { id: 'primera-chile', name: 'Primera División', image: '/leagues/primera-chile.png', price: 2 },

  // 2. Ligisten patches
  'efl-championship': { id: 'efl-championship', name: 'EFL Championship', image: '/leagues/efl-championship.png', price: 2 },
  'segunda-division': { id: 'segunda-division', name: 'Segunda División', image: '/leagues/segunda-division.png', price: 2 },
  '2-bundesliga': { id: '2-bundesliga', name: '2. Bundesliga', image: '/leagues/2-bundesliga.png', price: 2 },
  'serie-b': { id: 'serie-b', name: 'Serie B', image: '/leagues/serie-b.png', price: 2 },
  'ligue-2': { id: 'ligue-2', name: 'Ligue 2', image: '/leagues/ligue-2.png', price: 2 },

  // European competitions
  'ucl': { id: 'ucl', name: 'Champions League', image: '/patches/ucl.svg', price: 3 },
  'uel': { id: 'uel', name: 'Europa League', image: '/patches/uel.svg', price: 3 },
  'uecl': { id: 'uecl', name: 'Conference League', image: '/patches/uecl.svg', price: 3 },

  // South American competitions
  'libertadores': { id: 'libertadores', name: 'Copa Libertadores', image: '/patches/libertadores.svg', price: 3 },
  'sudamericana': { id: 'sudamericana', name: 'Copa Sudamericana', image: '/patches/sudamericana.svg', price: 3 },

  // National team tournaments
  'fifa-wc': { id: 'fifa-wc', name: 'FIFA World Cup', image: '/patches/fifa-wc.svg', price: 3 },
  'uefa-euro': { id: 'uefa-euro', name: 'UEFA Euro', image: '/leagues/em.png', price: 3 },
  'copa-america': { id: 'copa-america', name: 'Copa América', image: '/leagues/copa-america.png', price: 3 },
  'gold-cup': { id: 'gold-cup', name: 'Gold Cup', image: '/leagues/concacaf-gold-cup.png', price: 3 },
  'africa-cup': { id: 'africa-cup', name: 'Africa Cup', image: '/leagues/africa-cup.png', price: 3 },
  'asian-cup': { id: 'asian-cup', name: 'Asian Cup', image: '/leagues/asian-cup.png', price: 3 },
};

// League slug → patch IDs
const LEAGUE_PATCHES: Record<string, string[]> = {
  'bundesliga': ['bundesliga', 'ucl', 'uel', 'uecl'],
  'premier-league': ['premier-league', 'ucl', 'uel', 'uecl'],
  'la-liga': ['la-liga', 'ucl', 'uel', 'uecl'],
  'serie-a': ['serie-a', 'ucl', 'uel', 'uecl'],
  'ligue-1': ['ligue-1', 'ucl', 'uel', 'uecl'],
  'liga-portugal': ['liga-portugal', 'ucl', 'uel', 'uecl'],
  'eredivisie': ['eredivisie', 'ucl', 'uel', 'uecl'],
};

// Sub-league name → patch IDs
const SUB_LEAGUE_PATCHES: Record<string, string[]> = {
  'Scottish Premiership': ['scottish-premiership', 'ucl', 'uel', 'uecl'],
  'Süper Lig': ['super-lig', 'ucl', 'uel', 'uecl'],
  'Super League Greece': ['super-league-greece', 'ucl', 'uel', 'uecl'],
  'Österreichische Bundesliga': ['austrian-bundesliga', 'ucl', 'uel', 'uecl'],
  'League of Ireland': ['uel', 'uecl'],
  'Hrvatska Nogometna Liga': ['hnl', 'ucl', 'uel', 'uecl'],
  'Liga I': ['liga-i', 'ucl', 'uel', 'uecl'],
  'Allsvenskan': ['allsvenskan', 'ucl', 'uel', 'uecl'],
  'Superliga': ['superliga', 'ucl', 'uel', 'uecl'],
  'Jupiler Pro League': ['jupiler-pro-league', 'ucl', 'uel', 'uecl'],
  'Super League': ['super-league-ch', 'ucl', 'uel', 'uecl'],
  // World clubs
  'Brasileirão': ['brasileirao', 'libertadores', 'sudamericana'],
  'Liga Profesional': ['liga-argentina', 'libertadores', 'sudamericana'],
  'MLS': ['mls'],
  'Liga MX': ['liga-mx', 'libertadores'],
  'Saudi Pro League': ['saudi-pro-league'],
  'Primera División': ['primera-chile', 'libertadores', 'sudamericana'],
  // 2. Ligisten
  'EFL Championship': ['efl-championship'],
  'Segunda División': ['segunda-division'],
  '2. Bundesliga': ['2-bundesliga'],
  'Serie B': ['serie-b'],
  'Ligue 2': ['ligue-2'],
  // National teams
  'Europa': ['uefa-euro', 'fifa-wc'],
  'Südamerika': ['copa-america', 'fifa-wc'],
  'Nordamerika': ['gold-cup', 'fifa-wc'],
  'Afrika': ['africa-cup', 'fifa-wc'],
  'Asien': ['asian-cup', 'fifa-wc'],
};

export function getPatchesForTeam(leagueSlug: string, subLeague?: string): PatchOption[] {
  let patchIds: string[] = [];

  // Sub-league takes priority
  if (subLeague && SUB_LEAGUE_PATCHES[subLeague]) {
    patchIds = SUB_LEAGUE_PATCHES[subLeague];
  }
  // Then main league
  else if (LEAGUE_PATCHES[leagueSlug]) {
    patchIds = LEAGUE_PATCHES[leagueSlug];
  }

  return patchIds.map(id => PATCHES[id]).filter(Boolean);
}
