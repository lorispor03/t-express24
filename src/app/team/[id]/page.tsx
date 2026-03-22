import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TeamPageClient from '@/components/TeamPageClient';
import { getTeam, getAllTeamIds } from '@/lib/data';
import { TEAM_LOGOS } from '@/lib/teamLogos';
import teamDescriptions from '@/data/team-descriptions.json';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return getAllTeamIds().map(id => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const team = getTeam(id);
  if (!team) return {};
  return {
    title: `${team.name} Trikots | T-EXPRESS24`,
    description: `${team.name} Trikots kaufen - ${team.productCount} Artikel verfügbar. Premium Qualität aus der Schweiz.`,
  };
}

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = getTeam(id);

  if (!team) {
    notFound();
  }

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[var(--red-dark)] to-[#111]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,34,46,0.15),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/#ligen" className="hover:text-white transition-colors">Ligen</Link>
            <span>/</span>
            <Link href={`/league/${team.league}`} className="hover:text-white transition-colors">{team.leagueName}</Link>
            <span>/</span>
            <span className="text-white">{team.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              {(() => {
                const slug = id.split('__')[1];
                const logo = slug ? TEAM_LOGOS[slug] : undefined;
                return logo ? (
                  <img src={logo} alt={team.name} className="w-20 h-20 object-contain rounded-2xl bg-[#222] border border-white/10 p-2" />
                ) : (
                  <div className="w-20 h-20 bg-[#222] rounded-2xl flex items-center justify-center text-3xl font-black text-[var(--red-main)] border border-white/10">
                    {team.name.charAt(0)}
                  </div>
                );
              })()}
              <div>
                <h1 className="text-2xl md:text-4xl font-black">{team.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <Link href={`/league/${team.league}`} className="text-sm text-[var(--gold)] hover:underline">
                    {team.leagueName}
                  </Link>
                  <span className="text-sm text-gray-400">{team.productCount} Artikel</span>
                </div>
                {/* Variante 4: In Hero integriert (Man City) */}
                {id === 'premier-league__mancity' && (teamDescriptions as Record<string, string>)[id] && (
                  <p className="text-sm text-gray-400/80 leading-relaxed mt-3 max-w-xl">
                    {(teamDescriptions as Record<string, string>)[id]}
                  </p>
                )}
              </div>
            </div>

            {/* Palmares - rechts im Hero (nur Inter vorerst) */}
            {id === 'serie-a__inter' && (
              <div className="hidden md:block bg-white/5 backdrop-blur-md rounded-xl px-5 py-4 border border-white/10">
                <h4 className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider mb-3">Palmares</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['league', '20', 'Serie A'],
                    ['cup', '9', 'Coppa Italia'],
                    ['cl', '3', 'Champions League'],
                    ['el', '3', 'Europa League'],
                    ['supercup', '8', 'Supercoppa'],
                    ['world', '2', 'Intercontinentale'],
                  ].map(([type, count, name]) => (
                    <div key={name} className="flex items-center gap-2">
                      <div className="w-6 h-6 flex-shrink-0">
                        {type === 'league' && (
                          <img src="/trophies/serie-a.png" alt="Serie A" className="w-6 h-6 object-contain" />
                        )}
                        {type === 'cup' && (
                          <img src="/trophies/coppa-italia.png" alt="Coppa Italia" className="w-6 h-6 object-contain" />
                        )}
                        {type === 'cl' && (
                          <img src="/trophies/champions-league.png" alt="Champions League" className="w-6 h-6 object-contain" />
                        )}
                        {type === 'el' && (
                          <img src="/trophies/europa-league.png" alt="Europa League" className="w-6 h-6 object-contain" />
                        )}
                        {type === 'supercup' && (
                          <img src="/trophies/supercoppa.png?v=2" alt="Supercoppa" className="w-6 h-6 object-contain" />
                        )}
                        {type === 'world' && (
                          <img src="/trophies/intercontinental.png?v=3" alt="Intercontinentale" className="w-6 h-6 object-contain" />
                        )}
                      </div>
                      <div>
                        <span className="text-white font-bold text-sm">{count}x</span>
                        <p className="text-[10px] text-gray-500 leading-tight">{name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          {/* Palmares - Mobile kompakte Zeile */}
          {id === 'serie-a__inter' && (
            <div className="flex items-center gap-3 mt-4 md:hidden">
              {[
                ['/trophies/serie-a.png', '20'],
                ['/trophies/coppa-italia.png', '9'],
                ['/trophies/champions-league.png', '3'],
                ['/trophies/europa-league.png', '3'],
                ['/trophies/supercoppa.png?v=2', '8'],
                ['/trophies/intercontinental.png?v=3', '2'],
              ].map(([src, count]) => (
                <div key={src} className="flex items-center gap-1">
                  <img src={src} alt="" className="w-4 h-4 object-contain" />
                  <span className="text-xs font-bold text-white">{count}</span>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </section>

      {/* Club Description */}
      {(teamDescriptions as Record<string, string>)[id] && id !== 'premier-league__mancity' && (
        <section className="border-b border-white/10 bg-[#111]">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {id === 'serie-a__inter' ? (
              /* Zitat-Style */
              <div className="max-w-3xl bg-[var(--red-main)]/5 backdrop-blur-md rounded-xl px-5 py-4 border border-[var(--red-main)]/10">
                <div className="relative pl-6 border-l-2 border-[var(--gold)]/40">
                  <span className="absolute left-0.5 -top-1 text-4xl text-[var(--gold)]/30 font-serif leading-none select-none">&ldquo;</span>
                  <p className="text-[13px] sm:text-sm text-gray-300 leading-relaxed italic">
                    {(teamDescriptions as Record<string, string>)[id]}
                  </p>
                </div>
              </div>
            ) : id === 'la-liga__realmadrid' ? (
              /* Variante 2: Mit Icon */
              <div className="flex gap-4 max-w-3xl items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--red-main)]/10 flex items-center justify-center mt-0.5">
                  <svg className="w-5 h-5 text-[var(--red-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {(teamDescriptions as Record<string, string>)[id]}
                </p>
              </div>
            ) : id === 'bundesliga__bayern' ? (
              /* Variante 3: Gradient-Hintergrund */
              <div className="max-w-3xl bg-gradient-to-r from-[var(--red-main)]/10 to-transparent rounded-xl px-5 py-4 border border-[var(--red-main)]/10">
                <p className="text-sm text-gray-300 leading-relaxed">
                  {(teamDescriptions as Record<string, string>)[id]}
                </p>
              </div>
            ) : (
              /* Standard */
              <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
                {(teamDescriptions as Record<string, string>)[id]}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Products with filters */}
      <Suspense>
        <TeamPageClient
          teamName={team.name}
          leagueName={team.leagueName}
          leagueSlug={team.league}
          products={team.products}
        />
      </Suspense>

      <Footer />
    </>
  );
}
