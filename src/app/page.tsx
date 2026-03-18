import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';
import { getAllLeagues } from '@/lib/data';
import { LEAGUE_LOGOS } from '@/lib/leagueLogos';

export default function HomePage() {
  const leagues = getAllLeagues();

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[var(--red-dark)] to-[#111]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,34,46,0.3),transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-6 md:py-8 text-center">
          <Image src="/logo.png" alt="T-EXPRESS24" width={500} height={500} className="mx-auto max-w-[250px] sm:max-w-[400px] w-full" priority />
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-[#111]">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 grid grid-cols-4 gap-2 md:gap-4 text-center">
          {[
            ['4800+', 'Trikots'],
            ['250+', 'Teams'],
            ['20+', 'Ligen'],
            ['100%', 'Geprüft'],
          ].map(([num, label]) => (
            <div key={label}>
              <div className="text-base sm:text-2xl md:text-3xl font-black text-[var(--gold)]">{num}</div>
              <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Leagues Grid */}
      <section id="ligen" className="max-w-7xl mx-auto px-4 py-16 scroll-mt-20">
        <h2 className="text-2xl md:text-3xl font-black mb-2">Unsere Ligen</h2>
        <p className="text-gray-400 mb-8">Wähle eine Liga und entdecke alle verfügbaren Trikots.</p>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Object.entries(leagues).map(([slug, league]) => (
            <Link
              key={slug}
              href={`/league/${slug}`}
              className="league-card group bg-[#3a3a3a] rounded-xl p-6 border border-white/15 hover:border-[var(--red-main)]/30 text-left"
            >
              <div className="mb-4 h-14 flex items-end">
                {LEAGUE_LOGOS[slug] ? (
                  <img
                    src={LEAGUE_LOGOS[slug]}
                    alt={league.name}
                    className={`w-auto object-contain ${slug === 'la-liga' ? 'h-14 max-h-10' : slug === 'eredivisie' ? 'h-20' : 'h-14'}`}
                  />
                ) : (
                  <span className="text-3xl">&#9917;</span>
                )}
              </div>
              <h3 className="font-bold text-lg group-hover:text-[var(--gold)] transition-colors">
                {league.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {league.teamCount} {league.teamCount === 1 ? 'Team' : 'Teams'} {league.country && `· ${league.country}`}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="so-funktionierts" className="bg-[#111] border-y border-white/10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-center">So funktioniert&apos;s</h2>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-x-10 gap-y-6 items-start">
            {/* Step 1 */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--red-main)]/15 text-[var(--red-main)]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="font-bold text-lg whitespace-nowrap">Dein Trikot auswählen</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">Stöbere durch über 4800 Trikots aus den grössten Ligen der Welt — von aktuellen Saisons bis hin zu seltenen Retro-Klassikern.</p>
            </div>

            {/* Chevrons 1 */}
            <div className="hidden md:flex items-center justify-center self-center">
              <span className="flex text-[var(--red-main)]">
                <svg className="w-3 h-10 -mr-0.5" viewBox="0 0 12 40" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2 4l8 16-8 16" /></svg>
                <svg className="w-3 h-10 -mr-0.5" viewBox="0 0 12 40" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2 4l8 16-8 16" /></svg>
                <svg className="w-3 h-10" viewBox="0 0 12 40" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2 4l8 16-8 16" /></svg>
              </span>
            </div>
            <div className="flex md:hidden items-center justify-center py-2">
              <span className="flex flex-col -space-y-0.5 text-[var(--red-main)]">
                <svg className="w-10 h-3" viewBox="0 0 40 12" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 2l16 8 16-8" /></svg>
                <svg className="w-10 h-3" viewBox="0 0 40 12" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 2l16 8 16-8" /></svg>
                <svg className="w-10 h-3" viewBox="0 0 40 12" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 2l16 8 16-8" /></svg>
              </span>
            </div>

            {/* Step 2 */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--red-main)]/15 text-[var(--red-main)]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                </div>
                <h3 className="font-bold text-lg whitespace-nowrap">Bestellung aufgeben</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">Wähle Grösse und optionalen Aufdruck direkt im Shop. Dein Trikot wird aus unserem internationalen Lager für dich reserviert und in die Schweiz geliefert.</p>
            </div>

            {/* Chevrons 2 */}
            <div className="hidden md:flex items-center justify-center self-center">
              <span className="flex text-[var(--red-main)]">
                <svg className="w-3 h-10 -mr-0.5" viewBox="0 0 12 40" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2 4l8 16-8 16" /></svg>
                <svg className="w-3 h-10 -mr-0.5" viewBox="0 0 12 40" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2 4l8 16-8 16" /></svg>
                <svg className="w-3 h-10" viewBox="0 0 12 40" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2 4l8 16-8 16" /></svg>
              </span>
            </div>
            <div className="flex md:hidden items-center justify-center py-2">
              <span className="flex flex-col -space-y-0.5 text-[var(--red-main)]">
                <svg className="w-10 h-3" viewBox="0 0 40 12" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 2l16 8 16-8" /></svg>
                <svg className="w-10 h-3" viewBox="0 0 40 12" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 2l16 8 16-8" /></svg>
                <svg className="w-10 h-3" viewBox="0 0 40 12" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 2l16 8 16-8" /></svg>
              </span>
            </div>

            {/* Step 3 */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--red-main)]/15 text-[var(--red-main)]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h3 className="font-bold text-lg whitespace-nowrap">Qualitätscheck & Lieferung</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">Jedes Trikot wird von uns persönlich auf Qualität, Verarbeitung und Druckbild geprüft — erst dann geht es direkt zu dir nach Hause.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20">
        <FAQ />
      </section>

      <Footer />
    </>
  );
}
