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

      <section className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-12 2xl:px-16 py-12">
        <div className="flex items-center gap-2 text-base md:text-sm text-gray-500 mb-6 py-1">
          <Link href="/#ligen" className="hover:text-gray-900 transition-colors py-1 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>Ligen</Link>
          <span>/</span>
          <span className="text-gray-900">Alle Ligen</span>
        </div>

        <h1 className="text-3xl md:text-5xl uppercase tracking-wide mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Alle Ligen</h1>
        <p className="text-gray-500 mb-10">Entdecke Trikots aus 10 Ligen weltweit.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(leagues).map(([slug, league]) => (
            <Link
              key={slug}
              href={`/league/${slug}`}
              className={`league-card group rounded-xl p-6 border ${
                slug === 'wm-2026'
                  ? 'bg-black border-[var(--gold)]/40 hover:border-[var(--gold)] wm-card-glow'
                  : 'bg-[#e8e8e8] border-gray-300 hover:border-[var(--red-main)]/30'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                {LEAGUE_LOGOS[slug] ? (
                  <img
                    src={LEAGUE_LOGOS[slug]}
                    alt={league.name}
                    className="h-10 md:h-14 w-auto object-contain"
                  />
                ) : (
                  <span className="text-3xl">&#9917;</span>
                )}
                <span className={`text-xs rounded-full px-3 py-1 ${
                  slug === 'wm-2026' ? 'bg-[var(--gold)]/20 text-[var(--gold)]' : 'bg-gray-100 text-gray-500'
                }`}>
                  {slug === 'wm-2026' ? 'Special Event' : `${league.productCount} Artikel`}
                </span>
              </div>
              <h3 className={`text-xl md:text-2xl uppercase tracking-wide transition-colors ${
                slug === 'wm-2026' ? 'text-[var(--gold)] group-hover:text-white' : 'text-gray-900 group-hover:text-[var(--gold)]'
              }`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {league.name}
              </h3>
              <p className={`text-sm mt-1 ${slug === 'wm-2026' ? 'text-[var(--gold)]/70' : 'text-gray-700'}`}>
                {league.teamCount} {league.teamCount === 1 ? 'Team' : 'Teams'} {league.country && `· ${league.country}`}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {league.teams.slice(0, 5).map(team => (
                  <span key={team.id} className={`text-[10px] rounded px-2 py-0.5 ${
                    slug === 'wm-2026' ? 'bg-[var(--gold)]/15 text-[var(--gold)]/80' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {team.name}
                  </span>
                ))}
                {league.teams.length > 5 && (
                  <span className={`text-[10px] rounded px-2 py-0.5 ${
                    slug === 'wm-2026' ? 'bg-[var(--gold)]/15 text-[var(--gold)]/80' : 'bg-gray-100 text-gray-500'
                  }`}>
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
