import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-36 text-center">
          <Image src="/logo.png" alt="T-EXPRESS24" width={1040} height={1040} className="mx-auto mb-4" priority />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/leagues" className="bg-[var(--red-main)] hover:bg-[var(--red-dark)] text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-sm">
              Alle Ligen entdecken
            </Link>
            <Link href="/league/premier-league" className="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-sm">
              Premier League
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-[#111]">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            ['5700+', 'Trikots'],
            ['210+', 'Teams'],
            ['10', 'Ligen'],
            ['100%', 'Qualitätsgeprüft'],
          ].map(([num, label]) => (
            <div key={label}>
              <div className="text-2xl md:text-3xl font-black text-[var(--gold)]">{num}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Leagues Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-black mb-2">Unsere Ligen</h2>
        <p className="text-gray-400 mb-8">Wähle eine Liga und entdecke alle verfügbaren Trikots.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#111] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-black mb-10 text-center">So funktioniert&apos;s</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Trikot wählen', desc: 'Durchsuche unsere Kollektion mit über 5700 Trikots aus allen grossen Ligen.' },
              { step: '02', title: 'Per Instagram oder Telegram bestellen', desc: 'Schreib uns einfach per Instagram DM oder Telegram mit deiner gewünschten Grösse.' },
              { step: '03', title: 'Geliefert bekommen', desc: 'Wir prüfen jedes Trikot persönlich und versenden es direkt aus der Schweiz.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center md:text-left">
                <div className="text-4xl font-black text-[var(--red-main)]/30 mb-3">{step}</div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
