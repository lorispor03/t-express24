import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getLeague, getAllLeagueSlugs, getTeamsBySubLeague, getAllSubLeagueSlugs } from '@/lib/data';
import { LEAGUE_LOGOS } from '@/lib/leagueLogos';
import { TEAM_LOGOS } from '@/lib/teamLogos';
import { SUB_LEAGUE_LOGOS } from '@/lib/subLeagueLogos';
import type { Metadata } from 'next';

export function generateStaticParams() {
  const params: { slug: string; sub: string }[] = [];
  for (const slug of getAllLeagueSlugs()) {
    const subs = getAllSubLeagueSlugs(slug);
    for (const sub of subs) {
      params.push({ slug, sub });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; sub: string }> }): Promise<Metadata> {
  const { slug, sub } = await params;
  const result = getTeamsBySubLeague(slug, sub);
  if (!result) return {};
  return {
    title: `${result.subLeagueName} Trikots | T-EXPRESS24`,
    description: `${result.subLeagueName} Trikots kaufen - ${result.teams.length} Teams verfügbar.`,
  };
}

export default async function SubLeaguePage({ params }: { params: Promise<{ slug: string; sub: string }> }) {
  const { slug, sub } = await params;
  const league = getLeague(slug);
  const result = getTeamsBySubLeague(slug, sub);

  if (!league || !result) {
    notFound();
  }

  const subLogo = SUB_LEAGUE_LOGOS[sub];
  const leagueLogo = LEAGUE_LOGOS[slug];

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[var(--red-dark)] to-[#111]" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/league/${slug}`} className="hover:text-white transition-colors">{league.name}</Link>
            <span>/</span>
            <span className="text-white">{result.subLeagueName}</span>
          </div>
          <div className="flex items-center gap-5">
            {subLogo ? (
              <img src={subLogo} alt={result.subLeagueName} className="h-16 w-auto object-contain" />
            ) : leagueLogo ? (
              <img src={leagueLogo} alt={league.name} className="h-16 w-auto object-contain" />
            ) : null}
            <div>
              <h1 className="text-3xl md:text-5xl font-black">{result.subLeagueName}</h1>
              <div className="flex gap-6 mt-2 text-sm">
                <span className="text-[var(--gold)] font-bold">{result.teams.length} Teams</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teams Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {result.teams.map(team => (
            <Link
              key={team.id}
              href={`/team/${team.id}`}
              className="team-card bg-[#1a1a1a] rounded-xl p-5 border border-white/5 hover:border-[var(--red-main)]/30 text-center"
            >
              {(() => {
                const teamSlug = team.id.split('__')[1];
                const teamLogo = teamSlug ? TEAM_LOGOS[teamSlug] : undefined;
                return teamLogo ? (
                  <img src={teamLogo} alt={team.name} className="w-16 h-16 mx-auto mb-3 object-contain" />
                ) : (
                  <div className="w-16 h-16 mx-auto mb-3 bg-[#222] rounded-full flex items-center justify-center text-2xl font-black text-[var(--red-main)]">
                    {team.name.charAt(0)}
                  </div>
                );
              })()}
              <h3 className="font-bold text-sm line-clamp-2 mb-1">{team.name}</h3>
              <p className="text-xs text-gray-500">{team.count} Artikel</p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
