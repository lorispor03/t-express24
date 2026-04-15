import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TeamPageClient from '@/components/TeamPageClient';
import { getTeam, getAllTeamIds } from '@/lib/data';
import { TEAM_LOGOS } from '@/lib/teamLogos';
import teamDescriptions from '@/data/team-descriptions.json';
import palmaresData from '@/data/palmares.json';
import type { Metadata } from 'next';

type PalmaresEntry = { trophies: { name: string; count: number; icon: string }[] };
const palmares = palmaresData as Record<string, PalmaresEntry>;

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

  const teamPalmares = palmares[id]?.trophies;
  const hasPalmares = teamPalmares && teamPalmares.length > 0;

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[var(--red-dark)] to-[#111]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,34,46,0.15),transparent_60%)]" />
        <div className="relative max-w-[1440px] mx-auto px-4 py-4 md:py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-base md:text-sm text-gray-400 mb-3 md:mb-3 py-1">
            <Link href="/#ligen" className="hover:text-white transition-colors py-1 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>Ligen</Link>
            <span>/</span>
            <Link href={`/league/${team.league}`} className="hover:text-white transition-colors py-1">{team.leagueName}</Link>
            <span>/</span>
            <span className="text-white">{team.name}</span>
          </div>

          <div className="flex items-end md:items-start justify-between md:min-h-[200px]">
            <div className="flex items-center gap-5">
              {(() => {
                const slug = id.split('__')[1];
                const logo = slug ? TEAM_LOGOS[slug] : undefined;
                return logo ? (
                  <img src={logo} alt={team.name} className="w-20 h-20 md:w-48 md:h-48 object-contain rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-3" />
                ) : (
                  <div className="w-20 h-20 md:w-48 md:h-48 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl md:text-6xl font-black text-[var(--red-main)] border border-white/10">
                    {team.name.charAt(0)}
                  </div>
                );
              })()}
              <div>
                <h1 className="text-2xl md:text-4xl uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{team.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <Link href={`/league/${team.league}`} className="text-sm text-[var(--gold)] hover:underline">
                    {team.leagueName}
                  </Link>
                  <span className="text-sm text-gray-400">{team.productCount} Artikel</span>
                </div>
              </div>
            </div>

            {/* Palmares - Desktop */}
            {hasPalmares && (
              <div className={`hidden md:block bg-white/5 backdrop-blur-md rounded-xl px-5 py-4 border border-white/10 ${teamPalmares.length > 4 ? 'min-w-[320px]' : 'min-w-[260px]'}`}>
                <h4 className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider mb-3">Palmares</h4>
                <div className={`grid ${teamPalmares.length > 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                  {teamPalmares.map((trophy) => (
                    <div key={trophy.name} className="flex items-center gap-2">
                      <img src={`${trophy.icon.split('?')[0]}?v=5`} alt={trophy.name} className="w-6 h-6 object-contain flex-shrink-0" />
                      <div>
                        <span className="text-white font-bold text-sm">{trophy.count}x</span>
                        <p className="text-[10px] text-gray-500 leading-tight">{trophy.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Palmares - Mobile 3x2 Grid */}
          {hasPalmares && (
            <div className="md:hidden bg-white/5 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 mt-3">
              <h4 className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider mb-2">Palmares</h4>
              <div className="grid grid-cols-3 gap-2">
                {teamPalmares.map((trophy) => (
                  <div key={trophy.name} className="flex items-center gap-1.5">
                    <img src={`${trophy.icon.split('?')[0]}?v=5`} alt={trophy.name} className="w-5 h-5 object-contain flex-shrink-0" />
                    <span className="text-white font-bold text-xs">{trophy.count}x</span>
                    <span className="text-[9px] text-gray-500">{trophy.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

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
