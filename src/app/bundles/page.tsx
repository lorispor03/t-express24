'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function BundlesPage() {
  const { activeBundle, setActiveBundle } = useCart();
  const router = useRouter();

  const activateBundle = (type: '3plus' | '6plus') => {
    setActiveBundle(type);
    router.push('/#ligen');
  };

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[var(--red-dark)] to-[#111]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,34,46,0.3),transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-4 min-h-[180px] sm:min-h-[200px] flex items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Trikot Bundles
            </h1>
            <p className="text-gray-300 mt-2 text-sm md:text-base max-w-xl">
              Mehr Trikots, mehr Rabatt. Je mehr du bestellst, desto günstiger wird jedes einzelne Trikot.
            </p>
          </div>
        </div>
      </section>

      {/* Bundles */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* 3+ Trikots = 15% */}
          <div className={`relative bg-[#1a1a1a] rounded-2xl border overflow-hidden flex flex-col ${activeBundle === '3plus' ? 'border-green-400/50' : 'border-white/10'}`}>
            {activeBundle === '3plus' && (
              <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center text-xs font-bold py-1.5 uppercase tracking-widest z-10">
                Aktiv
              </div>
            )}
            {/* Header */}
            <div className={`relative bg-gradient-to-br from-[var(--red-dark)]/60 to-transparent p-8 pb-6 text-center ${activeBundle === '3plus' ? 'pt-12' : ''}`}>
              <div className="absolute top-4 right-4 bg-[var(--red-main)] text-white text-[11px] font-bold px-3 py-1 rounded-full" style={activeBundle === '3plus' ? { top: '2.5rem' } : {}}>
                -15%
              </div>
              <div className="flex items-end justify-center gap-3 mb-3">
                <span className="text-[90px] md:text-[110px] font-black text-white leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>3+</span>
              </div>
              <p className="text-lg font-bold text-white">Ab 3 Trikots</p>
              <p className="text-2xl font-black text-[var(--gold)] mt-1">15% Rabatt</p>
            </div>

            {/* Details */}
            <div className="p-8 pt-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--gold)]/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--gold)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </div>
                  <p className="text-sm text-gray-300">Alle Trikots frei kombinierbar</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--gold)]/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--gold)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </div>
                  <p className="text-sm text-gray-300">Fan, Player, Retro — alles möglich</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--gold)]/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--gold)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </div>
                  <p className="text-sm text-gray-300">Extras (Aufdruck/Patches) separat wählbar</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Beispiel: 3× Fan à CHF 49.90</span>
                  <span className="text-gray-500 line-through">CHF 149.70</span>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <span className="text-white">Du zahlst</span>
                  <span className="text-[var(--gold)]">CHF 127.25</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Du sparst</span>
                  <span className="text-[var(--red-main)] font-bold">CHF 22.45</span>
                </div>
              </div>

              <button
                onClick={() => activateBundle('3plus')}
                disabled={activeBundle === '3plus'}
                className={`w-full font-bold py-3 rounded-xl text-sm transition-all ${activeBundle === '3plus' ? 'bg-green-500/20 text-green-400 cursor-default' : 'bg-[var(--gold)] text-black hover:scale-[1.02]'}`}
              >
                {activeBundle === '3plus' ? 'Bundle ist aktiv' : 'Bundle aktivieren & Trikots wählen'}
              </button>
            </div>
          </div>

          {/* 6+ Trikots = 20% */}
          <div className={`relative bg-[#1a1a1a] rounded-2xl border-2 overflow-hidden flex flex-col ${activeBundle === '6plus' ? 'border-green-400/50' : 'border-[var(--gold)]/40 animate-pulse-slow'}`}>
            {activeBundle === '6plus' ? (
              <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center text-xs font-bold py-1.5 uppercase tracking-widest z-10">
                Aktiv
              </div>
            ) : (
              <div className="absolute top-0 left-0 right-0 bg-[var(--gold)] text-black text-center text-xs font-bold py-1.5 uppercase tracking-widest z-10">
                Bestes Preis-Leistungs-Verhältnis
              </div>
            )}

            {/* Header */}
            <div className="relative bg-gradient-to-br from-[var(--red-dark)]/60 to-transparent p-8 pb-6 pt-12 text-center">
              <div className="absolute top-10 right-4 bg-[var(--red-main)] text-white text-[11px] font-bold px-3 py-1 rounded-full">
                -20%
              </div>
              <div className="flex items-end justify-center gap-3 mb-3">
                <span className="text-[90px] md:text-[110px] font-black text-white leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>6+</span>
              </div>
              <p className="text-lg font-bold text-white">Ab 6 Trikots</p>
              <p className="text-2xl font-black text-[var(--gold)] mt-1">20% Rabatt</p>
            </div>

            {/* Details */}
            <div className="p-8 pt-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--gold)]/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--gold)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </div>
                  <p className="text-sm text-gray-300">Alle Trikots frei kombinierbar</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--gold)]/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--gold)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </div>
                  <p className="text-sm text-gray-300">Ideal für Gruppen, Vereine oder Geschenke</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--gold)]/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--gold)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </div>
                  <p className="text-sm text-gray-300">Extras (Aufdruck/Patches) separat wählbar</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Beispiel: 6× Fan à CHF 49.90</span>
                  <span className="text-gray-500 line-through">CHF 299.40</span>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <span className="text-white">Du zahlst</span>
                  <span className="text-[var(--gold)]">CHF 239.50</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Du sparst</span>
                  <span className="text-[var(--red-main)] font-bold">CHF 59.90</span>
                </div>
              </div>

              <button
                onClick={() => activateBundle('6plus')}
                disabled={activeBundle === '6plus'}
                className={`w-full font-bold py-3 rounded-xl text-sm transition-all ${activeBundle === '6plus' ? 'bg-green-500/20 text-green-400 cursor-default' : 'bg-[var(--gold)] text-black hover:scale-[1.02]'}`}
              >
                {activeBundle === '6plus' ? 'Bundle ist aktiv' : 'Bundle aktivieren & Trikots wählen'}
              </button>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-14">
          <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-wide mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>So funktioniert&apos;s</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-6">
              <div className="w-10 h-10 rounded-full bg-[var(--red-main)] text-white flex items-center justify-center font-bold text-lg mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>1</div>
              <h4 className="font-bold text-white mb-2">Bundle wählen</h4>
              <p className="text-sm text-gray-400 leading-relaxed">Wähle ein Bundle oben aus — 15% ab 3 Trikots oder 20% ab 6 Trikots.</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-6">
              <div className="w-10 h-10 rounded-full bg-[var(--red-main)] text-white flex items-center justify-center font-bold text-lg mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>2</div>
              <h4 className="font-bold text-white mb-2">Trikots in den Warenkorb</h4>
              <p className="text-sm text-gray-400 leading-relaxed">Stöbere durch den Shop und lege deine Lieblings-Trikots in den Warenkorb. Der Fortschritt wird unten angezeigt.</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-6">
              <div className="w-10 h-10 rounded-full bg-[var(--red-main)] text-white flex items-center justify-center font-bold text-lg mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>3</div>
              <h4 className="font-bold text-white mb-2">Rabatt kassieren</h4>
              <p className="text-sm text-gray-400 leading-relaxed">Sobald du genug Trikots hast, wird der Rabatt automatisch im Warenkorb angewendet.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
