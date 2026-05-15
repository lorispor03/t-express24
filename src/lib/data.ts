import productsData from '@/data/products.json';
import { ProductsData, LeagueData, TeamData, Product, CATEGORIES } from './types';
import { SUB_LEAGUE_SLUGS } from './subLeagueLogos';

const data = productsData as unknown as ProductsData;

// productCount/teamCount immer aus echten Daten berechnen
for (const team of Object.values(data.teams)) {
  team.productCount = team.products.length;
}
for (const league of Object.values(data.leagues)) {
  const teamIds = league.teams.map(t => t.id);
  league.teamCount = teamIds.length;
  league.productCount = teamIds.reduce((sum, id) => sum + (data.teams[id]?.products.length || 0), 0);
  for (const ref of league.teams) {
    ref.count = data.teams[ref.id]?.products.length || 0;
  }
}

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
    const sub = (teamRef as any).subLeague || team?.subLeague || 'Andere';
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

export function getProductByHandle(handle: string, preferredTeamId?: string): { product: Product; teamId: string; teamName: string; leagueName: string; leagueSlug: string; subLeague?: string } | undefined {
  // If a preferred team is specified, try that first
  if (preferredTeamId && data.teams[preferredTeamId]) {
    const team = data.teams[preferredTeamId];
    const product = team.products.find(p => p.h === handle);
    if (product) {
      return { product, teamId: preferredTeamId, teamName: team.name, leagueName: team.leagueName, leagueSlug: team.league, subLeague: team.subLeague };
    }
  }
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
    return (teamRef as any).subLeague === subLeagueName;
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

function normalize(str: string): string {
  return str.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/é|è|ê/g, 'e').replace(/á|à|â/g, 'a').replace(/ó|ò|ô/g, 'o').replace(/ú|ù|û/g, 'u').replace(/í|ì|î/g, 'i')
    .replace(/[^a-z0-9\s]/g, '');
}

// Aliase: Spitznamen → offizielle Namen
const ALIASES: Record<string, string[]> = {
  'barca': ['barcelona'], 'fcb': ['barcelona', 'bayern'], 'manu': ['manchester united'], 'man utd': ['manchester united'],
  'man united': ['manchester united'], 'man city': ['manchester city'], 'city': ['manchester city'],
  'bvb': ['borussia dortmund', 'dortmund'], 'juve': ['juventus'], 'inter': ['inter milan', 'inter mailand'],
  'milan': ['ac milan'], 'psg': ['paris saint germain', 'paris'], 'liverpool': ['liverpool', 'lvp'],
  'pool': ['liverpool'], 'lfc': ['liverpool'], 'gunners': ['arsenal'], 'blues': ['chelsea'],
  'spurs': ['tottenham'], 'wolves': ['wolverhampton'], 'gladbach': ['moenchengladbach', 'borussia monchengladbach'],
  'bayern': ['bayern munich', 'bayern muenchen', 'bayern munchen'], 'real': ['real madrid'],
  'atletico': ['atletico de madrid', 'atletico madrid'], 'roma': ['as roma'],
  'lazio': ['ss lazio', 'lazio'], 'napoli': ['naples', 'napoli', 'neapel', 'ssc napoli'],
  'benfica': ['sl benfica', 'benfica'], 'porto': ['fc porto', 'porto'],
  'ajax': ['ajax amsterdam'], 'galatasaray': ['galatasaray'], 'fener': ['fenerbahce'],
  'besiktas': ['besiktas'], 'celtic': ['celtic glasgow'], 'rangers': ['rangers glasgow'],
  'selecao': ['brazil', 'brasilien'], 'azzurri': ['italy', 'italien'],
  'dfb': ['germany', 'deutschland'], 'les bleus': ['france', 'frankreich'],
  'albiceleste': ['argentina', 'argentinien'], 'la roja': ['spain', 'spanien'],
  'oranje': ['netherlands', 'niederlande', 'holland'],
  'nati': ['switzerland', 'schweiz'],
};

// Deutsche Keywords → englische Begriffe in Titeln/Handles
const KEYWORD_MAP: Record<string, string[]> = {
  'heim': ['home'], 'zuhause': ['home'], 'auswaerts': ['away'], 'auswarts': ['away'],
  'langarm': ['long sleeve', 'longsleeve', 'long sleeves'], 'kinder': ['kids'],
  'damen': ['female', 'women'], 'frauen': ['female', 'women'],
  'spieler': ['player'], 'training': ['training'], 'retro': ['retro'],
  'torwart': ['goalkeeper'], 'sondertrikot': ['special'], 'spezial': ['special'],
  // Farben DE → EN
  'lila': ['purple', 'violet'], 'violett': ['purple', 'violet'], 'purpur': ['purple'],
  'blau': ['blue'], 'dunkelblau': ['navy', 'dark blue'], 'hellblau': ['light blue', 'sky blue'],
  'rot': ['red'], 'dunkelrot': ['maroon', 'dark red'], 'weinrot': ['maroon', 'burgundy'],
  'schwarz': ['black'], 'weiss': ['white'],
  'gelb': ['yellow'], 'gold': ['gold', 'golden'],
  'gruen': ['green'], 'grün': ['green'],
  'rosa': ['pink'], 'pink': ['pink'],
  'orange': ['orange'],
  'grau': ['grey', 'gray'],
  'tuerkis': ['turquoise', 'teal'], 'türkis': ['turquoise', 'teal'],
};

// Flexible Jahreszahl-Erkennung: "2008" → auch "07-08", "08-09" etc.
function expandYearQuery(word: string): string[] {
  const variants = [word];
  // 4-stellige Jahreszahl: 2008 → 07-08, 08-09, 2007-08, 2008
  const yearMatch = word.match(/^(19|20)(\d{2})$/);
  if (yearMatch) {
    const yy = parseInt(yearMatch[2]);
    const prev = String(yy - 1).padStart(2, '0');
    const next = String(yy + 1).padStart(2, '0');
    variants.push(`${prev}${yearMatch[2]}`, `${prev} ${yearMatch[2]}`, `${yearMatch[2]}${next}`);
  }
  // "0708" → "07 08"
  if (/^\d{4}$/.test(word) && !word.startsWith('19') && !word.startsWith('20')) {
    variants.push(word.slice(0, 2) + ' ' + word.slice(2));
  }
  return variants;
}

// Fuzzy: Levenshtein-Distanz für Tippfehler
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + (b[i - 1] === a[j - 1] ? 0 : 1)
      );
    }
  }
  return matrix[b.length][a.length];
}

function fuzzyIncludes(haystack: string, needle: string): boolean {
  if (haystack.includes(needle)) return true;
  if (needle.length < 4) return false; // Fuzzy nur bei längeren Wörtern
  const words = haystack.split(/\s+/);
  const maxDist = needle.length <= 5 ? 1 : 2;
  return words.some(w => levenshtein(w, needle) <= maxDist);
}

// Query expandieren mit Aliases und Keywords
function expandQuery(words: string[]): string[][] {
  return words.map(w => {
    const nw = normalize(w);
    const expanded = [nw];
    // Alias-Check
    if (ALIASES[nw]) expanded.push(...ALIASES[nw].map(normalize));
    // Keyword-Check
    if (KEYWORD_MAP[nw]) expanded.push(...KEYWORD_MAP[nw].map(normalize));
    // Jahreszahl-Varianten
    expanded.push(...expandYearQuery(nw));
    return [...new Set(expanded)];
  });
}

const STOP_WORDS = new Set([
  'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'sie', 'ein', 'eine', 'einen', 'einer', 'einem',
  'der', 'die', 'das', 'den', 'dem', 'des', 'und', 'oder', 'aber', 'von', 'vom', 'fuer', 'fur',
  'mit', 'bei', 'nach', 'aus', 'zu', 'zum', 'zur', 'in', 'im', 'an', 'am', 'auf', 'um',
  'ist', 'sind', 'war', 'hat', 'haben', 'habt', 'wird', 'kann', 'will', 'soll', 'muss',
  'nicht', 'kein', 'keine', 'keinen', 'noch', 'schon', 'auch', 'nur', 'mal', 'mir', 'mich',
  'was', 'wie', 'wo', 'wer', 'welche', 'welches', 'welcher', 'welchem',
  'gibt', 'gibts', 'gibt es', 'hast', 'haette', 'waere', 'moeglich',
  'bitte', 'danke', 'gerne', 'gern', 'ja', 'nein', 'ok', 'okay',
  'suche', 'suchen', 'brauche', 'moechte', 'wuerde', 'will', 'zeig', 'zeige',
  'hallo', 'hey', 'hi', 'moin', 'servus', 'grueezi',
  'trikot', 'trikots', 'jersey', 'shirt', 'kit',
  'so', 'sehr', 'ganz', 'echt', 'eher', 'etwas', 'etwa', 'ungefaehr',
]);

export function searchProducts(query: string, limit = 20) {
  const q = normalize(query);
  const words = q.split(/\s+/).filter(w => w && !STOP_WORDS.has(w));
  if (words.length === 0) return [];
  const expandedWords = expandQuery(words);
  const results: Array<{ teamId: string; teamName: string; product: Product; score: number }> = [];
  for (const [teamId, team] of Object.entries(data.teams)) {
    const teamNorm = normalize(team.name);
    const handleNorm = normalize(team.name); // team level
    for (const product of team.products) {
      const titleNorm = normalize(product.t);
      const prodHandle = product.h.replace(/-/g, ' ').toLowerCase();
      const catNames = (product.c || []).map(c => CATEGORIES[c] || c).join(' ');
      const combined = titleNorm + ' ' + teamNorm + ' ' + prodHandle + ' ' + catNames.toLowerCase();

      // Jedes Wort muss in mindestens einer Variante matchen
      let allMatch = true;
      let score = 0;
      for (const variants of expandedWords) {
        const exactMatch = variants.some(v => combined.includes(v));
        const fuzzyMatch = !exactMatch && variants.some(v => fuzzyIncludes(combined, v));
        if (!exactMatch && !fuzzyMatch) { allMatch = false; break; }
        if (exactMatch) score += 3;
        if (fuzzyMatch) score += 1;
      }
      if (!allMatch) continue;

      // Bonus-Score
      if (teamNorm.includes(q)) score += 10;
      if (titleNorm.startsWith(q)) score += 5;
      if (titleNorm.includes(q)) score += 2;
      results.push({ teamId, teamName: team.name, product, score });
    }
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit).map(({ teamId, teamName, product }) => ({ teamId, teamName, product }));
}

const CURATED_TOP_SELLER: Record<string, string[]> = {
  'premier-league': [
    'retro-camisa-manchester-united-1998-99-home-red', // Man Utd 98/99 Treble
    'retro-manchester-united-1999-final-home-long-sleeves', // Man Utd 99 CL Final
    'retro-2002-04-arsenal-home-s-xxl', // Arsenal 03/04 Invincibles
    'retro-2005-06-arsenal-home-s-xxl', // Arsenal 05/06 CL Final
    'retro-camisa-chelsea-champions-league-2008-09-home', // Chelsea CL 08/09
    'retro-2012-13-chelsea-home-s-2xl', // Chelsea 12/13 CL Titelverteidiger
    'retro-04-05-liverpool-home-final-kit-size-s-xxl', // Liverpool 04/05 Istanbul
    'retro-lvp-2018-19-home', // Liverpool 18/19 CL Gewinn
    'retro-manchester-city-11-12-home', // Man City 11/12 Aguero Moment
    'retro-newcastle-1995-97-home', // Newcastle Entertainers
  ],
  'la-liga': [
    'retro-08-09-barcelona-ucl-final-home-size-s-xxl', // Barca 08/09 Pep Treble
    'retro-14-15-barcelona-home-s-xxl', // Barca 14/15 MSN Treble
    'retro-camisa-real-madrid-13-14-home-white', // Real Madrid 13/14 La Decima
    'retro-camisa-real-madrid-16-17-home-white', // Real Madrid 16/17 CL
    'atletico-de-madrid-1995-96-home-s-xxl', // Atletico 95/96 Liga+Copa
    'retro-atletico-de-madrid-13-14-away-s-xxl', // Atletico 13/14 La Liga
    'retro-real-madrid-11-12-away-s-xxl', // Real Madrid 11/12 La Liga
    'retro-05-06-ucl-barcelona-home-s-xxl', // Barca 05/06 CL
    'retro-v-lenci-2000-01-home-jersey-s-xxl', // Valencia 00/01 La Liga
    'retro-sevilla-fc-15-16-home-jersey-s-xxl', // Sevilla 15/16 Europa League
  ],
  'bundesliga': [
    'retro-bayern-munich-12-13-home-s-xxl', // Bayern 12/13 Treble
    'retro-2000-01-bayern-munich-home-kit-s-xxl', // Bayern 00/01 CL
    'retro-borussia-dortmund-1997-home-shirt-s-xxl', // BVB 96/97 CL
    'retro-borussia-dortmund-1995-96-home-shirt-s-xxl', // BVB 95/96 Bundesliga
    'retro-leverkusen-2001-02-home-jersey-s-xxl', // Leverkusen 01/02 CL Final
    'retro-vfb-stuttgart-06-07-home-s-xxl', // Stuttgart 06/07 Meister
    'retro-werder-bremen-04-05-home-s-xxl', // Bremen 04/05 Double
    'retro-frankfurt-95-96-home-jersey-s-xxl', // Frankfurt 95/96
    'retro-borussia-moenchengladbach-1996-home-jersey-s-xxl', // Gladbach
    'retro-hamburger-1984-home-kit-s-xxl', // HSV 83 Europapokal
  ],
  'serie-a': [
    'retro-camisa-ac-milan-06-07-home', // Milan 06/07 CL
    'retro-camisa-2002-03-ac-milan-home-red-black', // Milan 02/03 CL
    'retro-camisa-inter-milan-09-10-home', // Inter 09/10 Treble
    'retro-camisa-inter-milan-07-08-centennial', // Inter 07/08 Centenario
    'retro-juventus-95-96-jersey-s-xxl', // Juve 95/96 CL
    'retro-camisa-juventus-2014-15-home-kit-s-xxl', // Juve 14/15 CL Final
    'roma-00-01-home-jersey', // Roma 00/01 Scudetto
    'retro-naples-1987-88-home-jersey-s-xxl', // Napoli 87/88 Maradona
    'retro-1999-00-lazio-home-kit-s-xxl', // Lazio 99/00 Scudetto
    'retro-98-99-parma-yellow-jersey-s-xxl', // Parma 98/99 UEFA Cup
  ],
  'nationalmannschaften': [
    'retro-camisa-brazil-2002-world-cup-home-masculina-yellow', // Brasilien 2002 WM
    'retro-brasil-1998-home-kit-s-xxl', // Brasilien 1998 WM
    'retro-germany-2014-home-s-xxl', // Deutschland 2014 WM
    'retro-camisa-1996-germany-home-white', // Deutschland 1996 EM
    'retro-camisa-italy-2006-home-blue', // Italien 2006 WM
    'retro-camisa-france-2006-home-blue', // Frankreich 2006 WM
    'retro-camisa-argentina-2006-home', // Argentinien 2006
    'retro-camisa-spain-2010-home-red', // Spanien 2010 WM
    'retro-camisa-england-1996-home-white', // England 1996 EM
    'retro-camisa-portugal-2006-home-red', // Portugal 2006 CR7
  ],
};

export function getLeagueTopSeller(leagueSlug: string): Array<{ title: string; handle: string; image: string; price: number; team: string }> {
  const curated = CURATED_TOP_SELLER[leagueSlug];
  if (!curated) {
    // Fallback: auto-select for leagues without curated list
    const league = data.leagues[leagueSlug];
    if (!league) return [];
    const jerseyCategories = ['fan', 'player', 'retro', 'longsleeve'];
    const excludeCategories = ['training', 'sweater', 'windbreaker'];
    const results: Array<{ title: string; handle: string; image: string; price: number; team: string }> = [];
    for (const teamRef of league.teams) {
      const team = data.teams[teamRef.id];
      if (!team) continue;
      for (const product of team.products) {
        if (product.c.some(c => jerseyCategories.includes(c)) && !product.c.some(c => excludeCategories.includes(c))) {
          results.push({ title: product.t, handle: product.h, image: product.i, price: parseFloat(product.p), team: team.name });
        }
      }
    }
    for (let i = results.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [results[i], results[j]] = [results[j], results[i]];
    }
    const teamCount: Record<string, number> = {};
    const filtered: typeof results = [];
    for (const item of results) {
      const count = teamCount[item.team] || 0;
      if (count < 2) { filtered.push(item); teamCount[item.team] = count + 1; if (filtered.length >= 10) break; }
    }
    // Durchmischen: keine zwei Trikots derselben Mannschaft hintereinander
    const spread: typeof filtered = [filtered[0]];
    const rem = filtered.slice(1);
    while (rem.length > 0) {
      const idx = rem.findIndex(r => r.team !== spread[spread.length - 1].team);
      if (idx === -1) { spread.push(...rem); break; }
      spread.push(rem.splice(idx, 1)[0]);
    }
    return spread;
  }
  // Curated: find products by handle
  const results: Array<{ title: string; handle: string; image: string; price: number; team: string }> = [];
  for (const handle of curated) {
    const found = getProductByHandle(handle);
    if (found) {
      results.push({ title: found.product.t, handle: found.product.h, image: found.product.i, price: parseFloat(found.product.p), team: found.teamName });
    }
  }
  // Durchmischen: keine zwei Trikots derselben Mannschaft hintereinander
  for (let i = results.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [results[i], results[j]] = [results[j], results[i]];
  }
  const spread: typeof results = [results[0]];
  const remaining = results.slice(1);
  while (remaining.length > 0) {
    const idx = remaining.findIndex(r => r.team !== spread[spread.length - 1].team);
    if (idx === -1) { spread.push(...remaining); break; }
    spread.push(remaining.splice(idx, 1)[0]);
  }
  return spread;
}

export function searchTeams(query: string, limit = 10) {
  const q = normalize(query);
  // Alias-Expansion für Team-Suche
  const aliasTargets = ALIASES[q] ? ALIASES[q].map(normalize) : [];
  const allQueries = [q, ...aliasTargets];

  const results: Array<{ id: string; name: string; league: string; leagueName: string; productCount: number; score: number }> = [];
  for (const [id, team] of Object.entries(data.teams)) {
    const nameNorm = normalize(team.name);
    let score = 0;
    for (const query of allQueries) {
      if (nameNorm === query) score = Math.max(score, 20);
      else if (nameNorm.startsWith(query)) score = Math.max(score, 10);
      else if (nameNorm.includes(query)) score = Math.max(score, 5);
    }
    // Fuzzy fallback
    if (score === 0 && q.length >= 4) {
      if (fuzzyIncludes(nameNorm, q)) score = 1;
    }
    if (score > 0) {
      results.push({ id, name: team.name, league: team.league, leagueName: team.leagueName, productCount: team.productCount, score });
    }
  }
  results.sort((a, b) => b.score - a.score || b.productCount - a.productCount);
  return results.slice(0, limit).map(({ score, ...rest }) => rest);
}
