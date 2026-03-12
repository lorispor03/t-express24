import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllLeagues } from '@/lib/data';
import { LEAGUE_LOGOS } from '@/lib/leagueLogos';

export default function LeaguesPage() {
  const leagues = getAllLeagues();

  return (
    <>
      <Header />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Alle Ligen</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black mb-2">Alle Ligen</h1>
        <p className="text-gray-400 mb-10">Entdecke Trikots aus 10 Ligen weltweit.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(leagues).map(([slug, league]) => (
            <Link
              key={slug}
              href={`/league/${slug}`}
              className="league-card group bg-[#1a1a1a] rounded-xl p-6 border border-white/5 hover:border-[var(--red-main)]/30"
            >
              <div className="flex items-start justify-between mb-4">
                {LEAGUE_LOGOS[slug] ? (
                  <img
                    src={LEAGUE_LOGOS[slug]}
                    alt={league.name}
                    className="h-10 w-auto object-contain"
                  />
                ) : (
                  <span className="text-3xl">&#9917;</span>
                )}
                <span className="text-xs bg-white/5 rounded-full px-3 py-1 text-gray-400">
                  {league.productCount} Trikots
                </span>
              </div>
              <h3 className="font-bold text-lg group-hover:text-[var(--gold)] transition-colors">
                {league.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {league.teamCount} Teams {league.country && `· ${league.country}`}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {league.teams.slice(0, 5).map(team => (
                  <span key={team.id} className="text-[10px] bg-white/5 rounded px-2 py-0.5 text-gray-500">
                    {team.name}
                  </span>
                ))}
                {league.teams.length > 5 && (
                  <span className="text-[10px] bg-white/5 rounded px-2 py-0.5 text-gray-500">
                    +{league.teams.length - 5} mehr
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
