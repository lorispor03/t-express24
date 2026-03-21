import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getLeague, getAllLeagueSlugs, getSubLeaguesForLeague } from '@/lib/data';
import { LEAGUE_LOGOS } from '@/lib/leagueLogos';
import { TEAM_LOGOS } from '@/lib/teamLogos';
import { SUB_LEAGUE_SLUGS, SUB_LEAGUE_LOGOS, SUB_LEAGUE_COUNTRIES } from '@/lib/subLeagueLogos';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return getAllLeagueSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const league = getLeague(slug);
  if (!league) return {};
  return {
    title: `${league.name} Trikots | T-EXPRESS24`,
    description: `${league.name} Trikots kaufen - ${league.productCount} Trikots von ${league.teamCount} Teams verfügbar.`,
  };
}

export default async function LeaguePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const league = getLeague(slug);

  if (!league) {
    notFound();
  }

  const logo = LEAGUE_LOGOS[slug];
  const subLeagues = getSubLeaguesForLeague(slug);
  const subLeagueKeys = Object.keys(subLeagues);
  const hasSubLeagues = subLeagueKeys.length > 1;

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[var(--red-dark)] to-[#111]" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/#ligen" className="hover:text-white transition-colors">Ligen</Link>
            <span>/</span>
            <span className="text-white">{league.name}</span>
          </div>
          <div className="flex items-center gap-5">
            {logo && (
              <img src={logo} alt={league.name} className={`w-auto object-contain ${['la-liga', 'premier-league'].includes(slug) ? 'h-10 sm:h-16' : 'h-32 sm:h-36'}`} />
            )}
            <div>
              <h1 className="text-3xl md:text-5xl font-black">{league.name}</h1>
              {league.country && (
                <p className="text-gray-400 mt-1">{league.country}</p>
              )}
              <div className="flex gap-6 mt-2 text-sm">
                <span className="text-[var(--gold)] font-bold">{league.teamCount} {league.teamCount === 1 ? 'Team' : 'Teams'}</span>
                <span className="text-gray-400">{league.productCount} Artikel</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {hasSubLeagues ? (
          /* Sub-League Cards - same style as homepage league cards */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {subLeagueKeys.map(subName => {
              const subSlug = SUB_LEAGUE_SLUGS[subName];
              const subLogo = subSlug ? SUB_LEAGUE_LOGOS[subSlug] : undefined;
              const subCountry = SUB_LEAGUE_COUNTRIES[subName];
              const teamCount = subLeagues[subName].length;
              return (
                <Link
                  key={subName}
                  href={`/league/${slug}/${subSlug}`}
                  className="league-card group bg-[#3a3a3a] rounded-xl p-6 border border-white/15 hover:border-[var(--red-main)]/30"
                >
                  <div className="mb-4 h-14 flex items-end">
                    {subLogo ? (
                      <img
                        src={subLogo}
                        alt={subName}
                        className="h-14 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-3xl">&#9917;</span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg group-hover:text-[var(--gold)] transition-colors">
                    {subName}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {teamCount} {teamCount === 1 ? 'Team' : 'Teams'}{subCountry && ` · ${subCountry}`}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Normal team grid */
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {league.teams.map(team => (
              <Link
                key={team.id}
                href={`/team/${team.id}`}
                className="team-card bg-[#1a1a1a] rounded-xl p-3 sm:p-5 border border-white/5 hover:border-[var(--red-main)]/30 text-center"
              >
                {(() => {
                  const teamSlug = team.id.split('__')[1];
                  const teamLogo = teamSlug ? TEAM_LOGOS[teamSlug] : undefined;
                  return teamLogo ? (
                    <img src={teamLogo} alt={team.name} className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 object-contain" />
                  ) : (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 bg-[#222] rounded-full flex items-center justify-center text-xl sm:text-2xl font-black text-[var(--red-main)]">
                      {team.name.charAt(0)}
                    </div>
                  );
                })()}
                <h3 className="font-bold text-xs sm:text-sm line-clamp-2 mb-1 min-h-[2lh]">{team.name}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500">{team.count} Artikel</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
