import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getLeague, getAllLeagueSlugs } from '@/lib/data';
import { LEAGUE_LOGOS } from '@/lib/leagueLogos';
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
            <span className="text-white">{league.name}</span>
          </div>
          <div className="flex items-center gap-5">
            {logo && (
              <img src={logo} alt={league.name} className="h-16 w-auto object-contain" />
            )}
            <div>
              <h1 className="text-3xl md:text-5xl font-black">{league.name}</h1>
              {league.country && (
                <p className="text-gray-400 mt-1">{league.country}</p>
              )}
              <div className="flex gap-6 mt-2 text-sm">
                <span className="text-[var(--gold)] font-bold">{league.teamCount} Teams</span>
                <span className="text-gray-400">{league.productCount} Trikots</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teams Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {league.teams.map(team => (
            <Link
              key={team.id}
              href={`/team/${team.id}`}
              className="team-card bg-[#1a1a1a] rounded-xl p-5 border border-white/5 hover:border-[var(--red-main)]/30 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-3 bg-[#222] rounded-full flex items-center justify-center text-2xl font-black text-[var(--red-main)]">
                {team.name.charAt(0)}
              </div>
              <h3 className="font-bold text-sm line-clamp-2 mb-1">{team.name}</h3>
              <p className="text-xs text-gray-500">{team.count} Trikots</p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
