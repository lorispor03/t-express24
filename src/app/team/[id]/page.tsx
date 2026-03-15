import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TeamPageClient from '@/components/TeamPageClient';
import { getTeam, getAllTeamIds } from '@/lib/data';
import { TEAM_LOGOS } from '@/lib/teamLogos';
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
            </div>
          </div>
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
