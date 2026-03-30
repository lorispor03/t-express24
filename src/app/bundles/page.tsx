'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function BundlesPage() {
  const { activeBundle, setActiveBundle } = useCart();
  const router = useRouter();
  const [lightbox, setLightbox] = useState<string | null>(null);

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
            <nav className="flex items-center gap-2 text-[11px] text-gray-600 mb-3">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">Bundles</span>
            </nav>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Trikot Bundles
            </h1>
            <p className="text-gray-300 mt-2 text-sm md:text-base max-w-xl">
              Mehr Trikots, mehr Rabatt. Je mehr du bestellst, desto günstiger wird jedes einzelne Trikot.
            </p>
          </div>
        </div>
      </section>

      {/* Bundles + How it works */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: Bundle Cards (3 cols) */}
          <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-6">
            {/* 3+ Trikots = 15% */}
            <div className={`relative bg-[#1a1a1a] rounded-2xl border overflow-hidden flex flex-col ${activeBundle === '3plus' ? 'border-green-400/50' : 'border-white/15'}`}>
              {activeBundle === '3plus' ? (
                <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center text-[9px] lg:text-xs font-bold py-1 lg:py-1.5 uppercase tracking-widest z-10">
                  Aktiv
                </div>
              ) : (
                <div className="absolute top-0 left-0 right-0 bg-[#3a3020] text-[#b89a50] text-center text-[9px] lg:text-xs font-bold py-1 lg:py-1.5 uppercase tracking-widest z-10">
                  Starter Bundle
                </div>
              )}
              <div className="relative bg-gradient-to-br from-[var(--red-dark)]/60 to-transparent px-3 lg:px-6 py-3 lg:py-5 pt-8 lg:pt-10">
                <div className="flex items-center gap-2 lg:gap-4">
                  <span className="text-4xl lg:text-6xl font-black text-white leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>3+</span>
                  <div>
                    <p className="text-[10px] lg:text-sm font-bold text-white">Ab 3 Trikots</p>
                    <p className="text-base lg:text-xl font-black text-[var(--gold)]">15% Rabatt</p>
                  </div>
                  <span className="ml-auto bg-[var(--red-main)] text-white text-[11px] font-bold px-3 py-1 rounded-full hidden lg:inline">-15%</span>
                </div>
              </div>
              {/* Mobile content */}
              <div className="p-3 pt-2 flex-1 flex flex-col lg:hidden">
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-[var(--gold)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-[11px] text-gray-300">Frei kombinierbar</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-[var(--gold)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-[11px] text-gray-300">Alle Trikot-Typen</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg px-2 py-1.5 text-[10px] text-gray-400 mb-3">
                  <span className="text-[var(--gold)] font-bold">CHF 127.25</span> <span className="text-gray-500 line-through ml-1">149.70</span>
                </div>
                <button
                  onClick={() => activateBundle('3plus')}
                  disabled={activeBundle === '3plus'}
                  className={`w-full font-bold py-2 rounded-xl text-[11px] transition-all mt-auto ${activeBundle === '3plus' ? 'bg-green-500/20 text-green-400 cursor-default' : 'bg-[var(--gold)] text-black hover:scale-[1.02]'}`}
                >
                  {activeBundle === '3plus' ? 'Aktiv' : 'Aktivieren'}
                </button>
              </div>
              {/* Desktop content */}
              <div className="hidden lg:flex p-5 pt-3 flex-1 flex-col">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--gold)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Frei kombinierbar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--gold)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Alle Trikot-Typen</span>
                  </div>
                  <div className="bg-white/5 rounded-lg px-3 py-1.5 text-xs text-gray-400 ml-auto">
                    3× à CHF 49.90 = <span className="text-[var(--gold)] font-bold">CHF 127.25</span> <span className="text-gray-500 line-through ml-1">149.70</span>
                  </div>
                </div>
                <button
                  onClick={() => activateBundle('3plus')}
                  disabled={activeBundle === '3plus'}
                  className={`w-full font-bold py-3 rounded-xl text-sm transition-all mt-auto ${activeBundle === '3plus' ? 'bg-green-500/20 text-green-400 cursor-default' : 'bg-[var(--gold)] text-black hover:scale-[1.02]'}`}
                >
                  {activeBundle === '3plus' ? 'Bundle ist aktiv' : 'Bundle aktivieren & Trikots wählen'}
                </button>
              </div>
            </div>

            {/* 6+ Trikots = 20% */}
            <div className={`relative bg-[#1a1a1a] rounded-2xl border-2 overflow-hidden flex flex-col ${activeBundle === '6plus' ? 'border-green-400/50' : 'border-[var(--gold)]/40 animate-pulse-slow'}`}>
              {activeBundle === '6plus' ? (
                <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center text-[9px] lg:text-xs font-bold py-1 lg:py-1.5 uppercase tracking-widest z-10">
                  Aktiv
                </div>
              ) : (
                <div className="absolute top-0 left-0 right-0 bg-[var(--gold)] text-black text-center text-[9px] lg:text-xs font-bold py-1 lg:py-1.5 uppercase tracking-widest z-10">
                  <span className="lg:hidden">Beste Wahl</span>
                  <span className="hidden lg:inline">Bestes Preis-Leistungs-Verhältnis</span>
                </div>
              )}
              <div className="relative bg-gradient-to-br from-[var(--red-dark)]/60 to-transparent px-3 lg:px-6 py-3 lg:py-5 pt-8 lg:pt-10">
                <div className="flex items-center gap-2 lg:gap-4">
                  <span className="text-4xl lg:text-6xl font-black text-white leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>6+</span>
                  <div>
                    <p className="text-[10px] lg:text-sm font-bold text-white">Ab 6 Trikots</p>
                    <p className="text-base lg:text-xl font-black text-[var(--gold)]">20% Rabatt</p>
                  </div>
                  <span className="ml-auto bg-[var(--red-main)] text-white text-[11px] font-bold px-3 py-1 rounded-full hidden lg:inline">-20%</span>
                </div>
              </div>
              {/* Mobile content */}
              <div className="p-3 pt-2 flex-1 flex flex-col lg:hidden">
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-[var(--gold)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-[11px] text-gray-300">Frei kombinierbar</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-[var(--gold)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-[11px] text-gray-300">Gruppen & Vereine</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg px-2 py-1.5 text-[10px] text-gray-400 mb-3">
                  <span className="text-[var(--gold)] font-bold">CHF 239.50</span> <span className="text-gray-500 line-through ml-1">299.40</span>
                </div>
                <button
                  onClick={() => activateBundle('6plus')}
                  disabled={activeBundle === '6plus'}
                  className={`w-full font-bold py-2 rounded-xl text-[11px] transition-all mt-auto ${activeBundle === '6plus' ? 'bg-green-500/20 text-green-400 cursor-default' : 'bg-[var(--gold)] text-black hover:scale-[1.02]'}`}
                >
                  {activeBundle === '6plus' ? 'Aktiv' : 'Aktivieren'}
                </button>
              </div>
              {/* Desktop content */}
              <div className="hidden lg:flex p-5 pt-3 flex-1 flex-col">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--gold)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Frei kombinierbar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--gold)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Ideal für Gruppen & Vereine</span>
                  </div>
                  <div className="bg-white/5 rounded-lg px-3 py-1.5 text-xs text-gray-400 ml-auto">
                    6× à CHF 49.90 = <span className="text-[var(--gold)] font-bold">CHF 239.50</span> <span className="text-gray-500 line-through ml-1">299.40</span>
                  </div>
                </div>
                <button
                  onClick={() => activateBundle('6plus')}
                  disabled={activeBundle === '6plus'}
                  className={`w-full font-bold py-3 rounded-xl text-sm transition-all mt-auto ${activeBundle === '6plus' ? 'bg-green-500/20 text-green-400 cursor-default' : 'bg-[var(--gold)] text-black hover:scale-[1.02]'}`}
                >
                  {activeBundle === '6plus' ? 'Bundle ist aktiv' : 'Bundle aktivieren & Trikots wählen'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: How it works (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>So funktioniert&apos;s</h3>
            <div className="relative">
              {/* Vertical line connecting the dots */}
              <div className="absolute left-[17px] top-[18px] bottom-[18px] w-0.5 bg-white/10" />

              <div className="space-y-6">
                <div className="flex items-start gap-4 relative">
                  <div className="w-9 h-9 rounded-full bg-[var(--red-main)] text-white flex items-center justify-center font-bold text-base flex-shrink-0 z-10" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>1</div>
                  <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4 flex-1">
                    <h4 className="font-bold text-white mb-1 text-sm">Bundle wählen</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">Erhalte 15% Rabatt ab 3 Trikots oder 20% ab 6 Trikots.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 relative">
                  <div className="w-9 h-9 rounded-full bg-[var(--red-main)] text-white flex items-center justify-center font-bold text-base flex-shrink-0 z-10" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>2</div>
                  <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4 flex-1">
                    <h4 className="font-bold text-white mb-1 text-sm">Trikots in den Warenkorb</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">Stöbere durch den Shop und lege deine Lieblings-Trikots in den Warenkorb.</p>
                    <img src="/bundle-step2.png?v=3" alt="Bundle Fortschritt" onClick={() => setLightbox('/bundle-step2.png')} className="mt-3 rounded-lg border border-white/10 w-full cursor-zoom-in hover:border-white/30 transition-colors" />
                  </div>
                </div>
                <div className="flex items-start gap-4 relative">
                  <div className="w-9 h-9 rounded-full bg-[var(--red-main)] text-white flex items-center justify-center font-bold text-base flex-shrink-0 z-10" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>3</div>
                  <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4 flex-1">
                    <h4 className="font-bold text-white mb-1 text-sm">Rabatt kassieren</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">Der Rabatt wird automatisch im Warenkorb angewendet.</p>
                    <img src="/bundle-step3.png" alt="Rabatt im Warenkorb" onClick={() => setLightbox('/bundle-step3.png')} className="mt-3 rounded-lg border border-white/10 w-full cursor-zoom-in hover:border-white/30 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/70 hover:text-white p-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={lightbox} alt="" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
