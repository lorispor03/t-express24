import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getLeague, getAllLeagueSlugs, getSubLeaguesForLeague, getLeagueTopSeller } from '@/lib/data';
import LeagueTopSeller from '@/components/LeagueTopSeller';
import ScrollReveal from '@/components/ScrollReveal';
import { LEAGUE_LOGOS } from '@/lib/leagueLogos';
import { TEAM_LOGOS } from '@/lib/teamLogos';
import { SUB_LEAGUE_SLUGS, SUB_LEAGUE_LOGOS, SUB_LEAGUE_COUNTRIES } from '@/lib/subLeagueLogos';
import type { Metadata } from 'next';

const LEAGUE_DESCRIPTIONS: Record<string, string> = {
  'premier-league': 'Die Premier League ist die höchste Spielklasse im englischen Fußball und gilt als die umsatzstärkste und meistgesehene Liga der Welt. Mit 20 Mannschaften bietet sie Woche für Woche hochklassigen, intensiven Fußball. Legendäre Vereine wie Manchester United, Liverpool und Arsenal prägen die über 130-jährige Geschichte des englischen Spitzenfußballs.',
  'la-liga': 'La Liga ist die höchste Spielklasse im spanischen Vereinsfußball und Heimat von Weltklubs wie Real Madrid und FC Barcelona. Die Liga ist bekannt für ihr technisch anspruchsvolles, ballbesitzorientiertes Spiel und hat zahlreiche Ballon-d\'Or-Gewinner hervorgebracht. Spanische Vereine zählen zu den erfolgreichsten Teilnehmern in der Geschichte der UEFA Champions League.',
  'bundesliga': 'Die Bundesliga ist die höchste Spielklasse im deutschen Fußball und weltweit bekannt für ihre vollen Stadien und leidenschaftliche Fankultur. Mit dem höchsten Zuschauerschnitt aller Fußballligen weltweit steht sie für emotionale Atmosphäre und attraktiven Offensivfußball. Der FC Bayern München ist mit Abstand der erfolgreichste Verein, doch Klubs wie Borussia Dortmund und Bayer Leverkusen sorgen für spannenden Wettbewerb.',
  'serie-a': 'Die Serie A ist die höchste italienische Fußballliga und war besonders in den 1980er- und 1990er-Jahren die stärkste Liga der Welt. Italienischer Fußball ist traditionell für seine taktische Raffinesse und defensive Stabilität bekannt. Rekordmeister Juventus Turin, AC Mailand und Inter Mailand gehören zu den erfolgreichsten Vereinen Europas.',
  'ligue-1': 'Die Ligue 1 ist die höchste Spielklasse im französischen Profifußball und bekannt als Sprungbrett für junge Talente aus aller Welt. Paris Saint-Germain dominiert das nationale Geschehen seit über einem Jahrzehnt, doch Vereine wie Olympique Marseille und AS Monaco sorgen regelmäßig für Überraschungen. Die Liga hat einige der besten Spieler der Fußballgeschichte hervorgebracht und weiterentwickelt.',
  'liga-portugal': 'Die Liga Portugal ist die höchste Spielklasse im portugiesischen Fußball und wird traditionell von den drei Großen dominiert: Benfica, FC Porto und Sporting Lissabon. Portugal gilt als eines der besten Ausbildungsländer für junge Fußballtalente in Europa. Die Liga hat Weltstars wie Cristiano Ronaldo, Eusébio und Luis Figo hervorgebracht.',
  'eredivisie': 'Die Eredivisie ist die höchste Spielklasse im niederländischen Fußball und weltweit für ihre herausragende Nachwuchsarbeit und offensive Spielphilosophie bekannt. Ajax Amsterdam, PSV Eindhoven und Feyenoord Rotterdam bilden die traditionelle Spitze der Liga. Der niederländische „Totaalvoetbal" hat den modernen Fußball maßgeblich beeinflusst und Generationen von Weltklassespielern hervorgebracht.',
  'nationalmannschaften': 'Nationalmannschaftstrikots stehen für den Stolz eines ganzen Landes und die größten Momente des internationalen Fußballs. Von der Weltmeisterschaft über die Europameisterschaft bis hin zur Copa América vereinen sie Millionen von Fans hinter ihren Teams. Jedes Trikot erzählt die Geschichte einer Nation und ihrer Fußballtradition.',
  'europa-andere': 'Neben den großen europäischen Top-Ligen bieten Wettbewerbe wie die türkische Süper Lig, die belgische Pro League oder die schottische Premiership erstklassigen Fußball mit eigener Identität. Auch Ligen aus Südamerika, Nordamerika und Asien begeistern mit leidenschaftlichen Fans und aufstrebenden Talenten. Hier findest du Trikots von Vereinen und Ligen abseits des Mainstreams.',
  'clubs-world': 'Weltclubs vereinen die spannendsten Vereine aus Südamerika, Nordamerika, Asien und Afrika unter einem Dach. Von Brasiliens Flamengo über Mexikos Club América bis hin zu Japans Vissel Kobe – hier triffst du auf Fußballkultur aus allen Ecken der Welt. Entdecke Trikots von Vereinen, die in ihren Heimatländern Legenden sind.',
  'zweitligisten': 'Die zweiten Ligen Europas sind das Rückgrat des professionellen Fußballs und oft die Heimat von Traditionsklubs mit leidenschaftlicher Fanbase. Von der englischen Championship über die 2. Bundesliga bis hin zur Serie B bieten sie spannende Aufstiegskämpfe und packende Derbys. Hier findest du Trikots von Vereinen mit Geschichte und Charakter.',
};

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
  const subLeagues = getSubLeaguesForLeague(slug);
  const subLeagueKeys = Object.keys(subLeagues);
  const hasSubLeagues = subLeagueKeys.length > 1;
  const topSellerLeagues = ['premier-league', 'la-liga', 'bundesliga', 'serie-a', 'ligue-1', 'liga-portugal', 'eredivisie', 'nationalmannschaften'];
  const topSeller = topSellerLeagues.includes(slug) ? getLeagueTopSeller(slug) : [];

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[var(--red-dark)] to-[#111]" />
        <div className="relative max-w-7xl mx-auto px-4 py-5 md:py-8">
          <div className="flex items-center gap-2 text-base md:text-sm text-gray-400 mb-2 md:mb-4 py-1">
            <Link href="/#ligen" className="hover:text-white transition-colors py-1 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>Ligen</Link>
            <span>/</span>
            <span className="text-white">{league.name}</span>
          </div>
          <div className="flex items-center gap-5 min-h-[128px] sm:min-h-[144px]">
            {logo && (
              <img src={logo} alt={league.name} className={`w-auto object-contain ${slug === 'la-liga' ? 'h-10 sm:h-16' : ['premier-league'].includes(slug) ? 'h-16 sm:h-24' : 'h-32 sm:h-36'}`} />
            )}
            <div>
              <h1 className="text-3xl md:text-5xl uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{league.name}</h1>
              {league.country && (
                <p className="text-gray-400 mt-1">{league.country}</p>
              )}
              <div className="flex gap-6 mt-2 text-sm">
                <span className="text-[var(--gold)] font-bold">{league.teamCount} {league.teamCount === 1 ? 'Team' : 'Teams'}</span>
                <span className="text-gray-400">{league.productCount} Artikel</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* League Description */}
      {LEAGUE_DESCRIPTIONS[slug] && (
        <section className="border-b border-white/10 bg-[var(--red-main)]/5 md:bg-[#111]">
          <div className="max-w-7xl mx-auto px-4 py-3 md:py-6">
            <div className="md:bg-[var(--red-main)]/5 md:backdrop-blur-md md:rounded-xl md:px-5 md:py-4 md:border md:border-[var(--red-main)]/10 min-h-[60px] flex items-center">
              <div className="relative pl-6 border-l-2 border-[var(--gold)]/40">
                <span className="absolute left-0.5 -top-1 text-4xl text-[var(--gold)]/30 font-serif leading-none select-none">&ldquo;</span>
                <p className="text-[13px] sm:text-sm text-gray-300 leading-relaxed italic">
                  {LEAGUE_DESCRIPTIONS[slug]}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {hasSubLeagues ? (
          /* Sub-League Cards - same style as homepage league cards */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {subLeagueKeys.map(subName => {
              const subSlug = SUB_LEAGUE_SLUGS[subName];
              const subLogo = subSlug ? SUB_LEAGUE_LOGOS[subSlug] : undefined;
              const subCountry = SUB_LEAGUE_COUNTRIES[subName];
              const teamCount = subLeagues[subName].length;
              return (
                <Link
                  key={subName}
                  href={`/league/${slug}/${subSlug}`}
                  className="league-card group bg-[#3a3a3a] rounded-xl p-6 border border-white/15 hover:border-[var(--red-main)]/30"
                >
                  <div className="mb-4 h-14 flex items-end">
                    {subLogo ? (
                      <img
                        src={subLogo}
                        alt={subName}
                        className="h-14 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-3xl">&#9917;</span>
                    )}
                  </div>
                  <h3 className="text-xl md:text-2xl uppercase tracking-wide group-hover:text-[var(--gold)] transition-colors" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    {subName}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {teamCount} {teamCount === 1 ? 'Team' : 'Teams'}{subCountry && ` · ${subCountry}`}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Normal team grid */
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {league.teams.map((team, i) => (
              <ScrollReveal key={team.id} delay={i * 30} mobileOnly>
              <Link
                href={`/team/${team.id}`}
                className="team-card group bg-[#1a1a1a] rounded-xl p-3 sm:p-5 border border-white/5 hover:border-[var(--red-main)]/30 text-center block h-full"
              >
                {(() => {
                  const teamSlug = team.id.split('__')[1];
                  const teamLogo = teamSlug ? TEAM_LOGOS[teamSlug] : undefined;
                  return teamLogo ? (
                    <img src={teamLogo} alt={team.name} className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 object-contain" />
                  ) : (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 bg-[#222] rounded-full flex items-center justify-center text-xl sm:text-2xl font-black text-[var(--red-main)]">
                      {team.name.charAt(0)}
                    </div>
                  );
                })()}
                <h3 className="text-xs sm:text-sm uppercase line-clamp-2 mb-1 group-hover:text-[var(--gold)] transition-colors" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{team.name}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500">{team.count} Artikel</p>
              </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
