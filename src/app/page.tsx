import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';
import StatsBar from '@/components/StatsBar';
import DealsSection from '@/components/DealsSection';
import ScrollReveal from '@/components/ScrollReveal';
import { getAllLeagues } from '@/lib/data';
import { LEAGUE_LOGOS } from '@/lib/leagueLogos';

export default function HomePage() {
  const leagues = getAllLeagues();

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[var(--red-dark)] to-[#111] hero-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,34,46,0.3),transparent_70%)] hero-bg" />
        <div className="relative max-w-[1920px] mx-auto px-4 md:px-8 xl:px-12 2xl:px-16 py-2 md:pt-6 md:pb-4 flex justify-center">
          <div className="relative">
            <Image src="/logo.png" alt="T-EXPRESS24" width={500} height={500} className="max-w-[280px] sm:max-w-[380px] md:max-w-[480px] w-full hero-logo" priority />
            <div className="hero-scanline" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatsBar />

      {/* Deals */}
      <DealsSection />

      {/* Bundles */}
      <section className="relative">
        <div className="absolute left-0 right-0 -top-16 -bottom-10 md:-bottom-8" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(122,26,26,0.3) 7rem, rgba(122,26,26,0.3) calc(100% - 4rem), transparent 100%)' }} />
        <div className="relative max-w-[1920px] mx-auto px-4 md:px-8 xl:px-12 2xl:px-16 pt-0 pb-4 md:pb-6">
          <h2 className="text-4xl md:text-5xl uppercase tracking-wide mb-1 text-[var(--red-main)]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Bundles
          </h2>
          <p className="text-gray-400 text-sm mb-3 md:mb-4">Mehr Trikots, weniger zahlen</p>
          <Link href="/bundles" className="block group">
            <div className="relative overflow-hidden rounded-xl border border-[var(--gold)]/30 bg-gradient-to-r from-[#1a1a1a] via-[#1f1510] to-[#1a1a1a] p-5 md:p-6 animate-pulse-slow hover:border-[var(--gold)]/60 transition-all">
              <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-[var(--gold)]/10 to-transparent" />
              <div className="relative flex items-center justify-between gap-2 md:gap-4">
                <div className="flex items-center gap-1.5 md:gap-6">
                  <div className="flex-shrink-0">
                    <span className="text-4xl md:text-5xl font-black text-white leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>3+</span>
                    <sup className="text-[11px] md:text-lg font-black text-[var(--gold)] ml-0.5 md:ml-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>15%</sup>
                  </div>
                  <div className="w-px h-8 md:h-10 bg-white/10" />
                  <div className="flex-shrink-0">
                    <span className="text-4xl md:text-5xl font-black text-white leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>6+</span>
                    <sup className="text-[11px] md:text-lg font-black text-[var(--gold)] ml-0.5 md:ml-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>20%</sup>
                  </div>
                  <div className="w-px h-8 md:h-10 bg-white/10" />
                  <div className="flex-shrink-0">
                    <span className="text-4xl md:text-5xl font-black text-white leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>10+</span>
                    <sup className="text-[11px] md:text-lg font-black text-[var(--gold)] ml-0.5 md:ml-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>30%</sup>
                  </div>
                  <div className="hidden md:block ml-2">
                    <p className="text-sm font-bold text-white">Trikot Bundles</p>
                    <p className="text-xs text-gray-400">Mehr kaufen, mehr sparen</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 bg-[var(--gold)] text-black text-xs font-bold px-4 py-2 rounded-full group-hover:scale-105 transition-transform">
                  Jetzt sparen
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Leagues Grid */}
      <section id="ligen" className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-12 2xl:px-16 pt-0 pb-6 md:pb-10 scroll-mt-[92px] md:scroll-mt-16">
        <h2 className="text-4xl md:text-5xl uppercase tracking-wide mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Unsere Ligen</h2>
        <p className="text-gray-400 mb-3 md:mb-5">Wähle eine Liga und entdecke alle verfügbaren Artikel deiner Lieblings-Clubs.</p>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Object.entries(leagues).map(([slug, league], i) => (
            <ScrollReveal key={slug} delay={i * 80}>
              <Link
                href={`/league/${slug}`}
                className="league-card group bg-[#3a3a3a] rounded-xl p-6 border border-white/15 hover:border-[var(--red-main)]/30 text-left block h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-14 flex items-end">
                    {LEAGUE_LOGOS[slug] ? (
                      <img
                        src={LEAGUE_LOGOS[slug]}
                        alt={league.name}
                        className={`w-auto object-contain ${slug === 'la-liga' ? 'h-8 sm:h-14 sm:max-h-10' : slug === 'eredivisie' ? 'h-24 translate-y-5' : 'h-14'}`}
                      />
                    ) : (
                      <span className="text-3xl">&#9917;</span>
                    )}
                  </div>
                  <span className="hidden lg:inline text-xs bg-white/5 rounded-full px-3 py-1 text-gray-400">
                    {league.productCount} Artikel
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl uppercase tracking-wide group-hover:text-[var(--gold)] transition-colors" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {slug === 'nationalmannschaften' ? <><span className="sm:hidden">National-<br/>mannschaften</span><span className="hidden sm:inline">{league.name}</span></> : league.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {league.teamCount} {league.teamCount === 1 ? 'Team' : 'Teams'} {league.country && <span className="hidden lg:inline">· {league.country}</span>}
                </p>
                {league.country && (
                  <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1 lg:hidden">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    {league.country}
                  </p>
                )}
                <div className="hidden lg:flex mt-4 flex-wrap gap-1.5">
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
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="so-funktionierts" className="bg-[#111] border-y border-white/10 scroll-mt-[92px] md:scroll-mt-16">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-12 2xl:px-16 py-10">
          <h2 className="text-4xl md:text-5xl uppercase tracking-wide mb-8 text-center" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>So funktioniert&apos;s</h2>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-x-10 gap-y-6 items-center">
            {/* Step 1 */}
            <ScrollReveal delay={0} duration={1100} mobileOnly>
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--red-main)]/15 text-[var(--red-main)]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <h3 className="font-bold text-lg whitespace-nowrap">Dein Trikot auswählen</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">Stöbere durch über 4700 Artikel aus den grössten Ligen der Welt — von aktuellen Saisons bis hin zu seltenen Retro-Klassikern.</p>
              </div>
            </ScrollReveal>

            {/* Chevrons 1 */}
            <ScrollReveal delay={250} duration={600} mobileOnly>
              <div className="hidden md:flex items-center justify-center self-center">
                <span className="flex text-[var(--red-main)]">
                  <svg className="w-3 h-10 -mr-0.5 chevron-1" viewBox="0 0 12 40" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2 4l8 16-8 16" /></svg>
                  <svg className="w-3 h-10 -mr-0.5 chevron-2" viewBox="0 0 12 40" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2 4l8 16-8 16" /></svg>
                  <svg className="w-3 h-10 chevron-3" viewBox="0 0 12 40" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2 4l8 16-8 16" /></svg>
                </span>
              </div>
              <div className="flex md:hidden items-center justify-center py-0.5">
                <span className="flex flex-col -space-y-0.5 text-[var(--red-main)]">
                  <svg className="w-10 h-3 chevron-1" viewBox="0 0 40 12" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 2l16 8 16-8" /></svg>
                  <svg className="w-10 h-3 chevron-2" viewBox="0 0 40 12" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 2l16 8 16-8" /></svg>
                  <svg className="w-10 h-3 chevron-3" viewBox="0 0 40 12" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 2l16 8 16-8" /></svg>
                </span>
              </div>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal delay={550} duration={1100} mobileOnly>
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--red-main)]/15 text-[var(--red-main)]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                  </div>
                  <h3 className="font-bold text-lg whitespace-nowrap">Bestellung aufgeben</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">Wähle Grösse und optionalen Aufdruck direkt im Shop. Dein Trikot wird aus unserem internationalen Lager für dich reserviert und in die Schweiz geliefert.</p>
              </div>
            </ScrollReveal>

            {/* Chevrons 2 */}
            <ScrollReveal delay={800} duration={600} mobileOnly>
              <div className="hidden md:flex items-center justify-center self-center">
                <span className="flex text-[var(--red-main)]">
                  <svg className="w-3 h-10 -mr-0.5 chevron-1" viewBox="0 0 12 40" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2 4l8 16-8 16" /></svg>
                  <svg className="w-3 h-10 -mr-0.5 chevron-2" viewBox="0 0 12 40" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2 4l8 16-8 16" /></svg>
                  <svg className="w-3 h-10 chevron-3" viewBox="0 0 12 40" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2 4l8 16-8 16" /></svg>
                </span>
              </div>
              <div className="flex md:hidden items-center justify-center py-0.5">
                <span className="flex flex-col -space-y-0.5 text-[var(--red-main)]">
                  <svg className="w-10 h-3 chevron-1" viewBox="0 0 40 12" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 2l16 8 16-8" /></svg>
                  <svg className="w-10 h-3 chevron-2" viewBox="0 0 40 12" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 2l16 8 16-8" /></svg>
                  <svg className="w-10 h-3 chevron-3" viewBox="0 0 40 12" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 2l16 8 16-8" /></svg>
                </span>
              </div>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal delay={1100} duration={1100} mobileOnly>
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--red-main)]/15 text-[var(--red-main)]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <h3 className="font-bold text-lg whitespace-nowrap">Qualitätscheck & Lieferung</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">Jedes Trikot wird von uns persönlich auf Qualität, Verarbeitung und Druckbild geprüft — erst dann geht es direkt zu dir nach Hause.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-[92px] md:scroll-mt-16">
        <FAQ />
      </section>

      <Footer />
    </>
  );
}
