'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function BundlesPage() {
  const { activeBundle, setActiveBundle } = useCart();
  const router = useRouter();
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [lbZoom, setLbZoom] = useState(false);
  const openLightbox = (src: string) => { setLightbox(src); setLbZoom(false); };

  const toggleBundle = (type: '3plus' | '6plus') => {
    if (activeBundle === type) {
      setActiveBundle(null);
    } else {
      setActiveBundle(type);
    }
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
            <nav className="flex items-center gap-2 text-base md:text-sm text-gray-400 mb-3 py-1">
              <Link href="/" className="hover:text-white transition-colors py-1 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>Home</Link>
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
      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Desktop: Beide Titel + Bubbles + Step1 Circle über dem Grid */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-12 mb-0">
          <div className="lg:col-span-3 flex items-start justify-center">
            <h3 className="text-4xl font-bold uppercase tracking-wide mb-6 text-center" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Wähle dein Bundle</h3>
          </div>
          <div className="lg:col-span-2 flex flex-col items-center">
            <h3 className="text-4xl font-bold uppercase tracking-wide mb-6 text-center" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Wie funktioniert&apos;s?</h3>
            <div className="w-full">
              <div className="flex justify-center gap-36 mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[var(--gold)]/15 border-2 border-[var(--gold)]/40 flex flex-col items-center justify-center z-10">
                    <span className="text-[var(--gold)] font-black text-3xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>3+</span>
                    <span className="text-[var(--gold)]/60 text-[11px] font-bold leading-none">15%</span>
                  </div>
                  <div className="w-0.5 h-6 bg-white/10 -mt-[1px]" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[var(--gold)]/25 border-2 border-[var(--gold)] flex flex-col items-center justify-center z-10">
                    <span className="text-[var(--gold)] font-black text-3xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>6+</span>
                    <span className="text-[var(--gold)]/60 text-[11px] font-bold leading-none">20%</span>
                  </div>
                  <div className="w-0.5 h-6 bg-white/10 -mt-[1px]" />
                </div>
              </div>
              <div className="flex justify-center -mt-[1px]">
                <div className="h-0.5 bg-white/10" style={{ width: 'calc(9rem + 56px)' }} />
              </div>
              <div className="flex justify-center -mt-[1px]">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-3 bg-white/10" />
                  <div className="w-9 h-9 rounded-full bg-[var(--red-main)] text-white flex items-center justify-center font-bold text-base z-10" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>1</div>
                  <div className="w-0.5 h-3 bg-white/10 -mb-[1px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:items-start">

          {/* Left: Bundle Cards (3 cols) */}
          <div className="lg:col-span-3 grid grid-cols-1 gap-4 lg:gap-6 lg:self-start">
            {/* 3+ Trikots = 15% */}
            <div className={`relative bg-[#1a1a1a] rounded-2xl border overflow-hidden flex flex-col ${activeBundle === '3plus' ? 'border-green-400/50' : 'border-white/15'}`}>
              {activeBundle === '3plus' ? (
                <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center text-xs font-bold py-1.5 uppercase tracking-widest z-10">
                  Aktiv
                </div>
              ) : (
                <div className="absolute top-0 left-0 right-0 bg-[#3a3020] text-[#b89a50] text-center text-xs font-bold py-1.5 uppercase tracking-widest z-10">
                  Starter Bundle
                </div>
              )}
              <div className="relative bg-gradient-to-br from-[var(--red-dark)]/60 to-transparent px-6 py-5 pt-10">
                <div className="flex items-center gap-4">
                  <span className="text-6xl font-black text-white leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>3+</span>
                  <div>
                    <p className="text-sm font-bold text-white">Ab 3 Trikots</p>
                    <p className="text-xl font-black text-[var(--gold)]">15% Rabatt</p>
                  </div>
                  <span className="ml-auto bg-[var(--red-main)] text-white text-[11px] font-bold px-3 py-1 rounded-full">-15%</span>
                </div>
              </div>
              <div className="flex p-4 lg:p-5 pt-2 lg:pt-3 flex-1 flex-col">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-5">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--gold)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">15% auf jedes Trikot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--gold)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Alle Ligen frei mischbar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--gold)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Heim- & Auswärts mixen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--gold)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Verschiedene Grössen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--gold)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Rabatt automatisch berechnet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--gold)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Bereits ab 3 Trikots</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg px-3 py-2 text-xs text-gray-400 mb-4">
                  3× à CHF 49.90 = <span className="text-[var(--gold)] font-bold">CHF 127.25</span> <span className="text-gray-500 line-through ml-1">149.70</span>
                </div>
                <button
                  onClick={() => toggleBundle('3plus')}
                                    className={`w-full font-bold py-3 rounded-xl text-sm transition-all mt-auto ${activeBundle === '3plus' ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-[#3a3020] text-[#b89a50] border border-[#b89a50]/30 hover:scale-[1.02] animate-pulse-slow'}`}
                >
                  {activeBundle === '3plus' ? 'Bundle deaktivieren' : 'Bundle aktivieren & Trikots wählen'}
                </button>
              </div>
            </div>

            {/* 6+ Trikots = 20% */}
            <div className={`relative bg-[#1a1a1a] rounded-2xl border-2 overflow-hidden flex flex-col ${activeBundle === '6plus' ? 'border-green-400/50' : 'border-[var(--gold)]/40'}`}>
              {activeBundle === '6plus' ? (
                <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center text-xs font-bold py-1.5 uppercase tracking-widest z-10">
                  Aktiv
                </div>
              ) : (
                <div className="absolute top-0 left-0 right-0 bg-[var(--gold)] text-black text-center text-xs font-bold py-1.5 uppercase tracking-widest z-10">
                  Bestes Preis-Leistungs-Verhältnis
                </div>
              )}
              <div className="relative bg-gradient-to-br from-[var(--red-dark)]/60 to-transparent px-6 py-5 pt-10">
                <div className="flex items-center gap-4">
                  <span className="text-6xl font-black text-white leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>6+</span>
                  <div>
                    <p className="text-sm font-bold text-white">Ab 6 Trikots</p>
                    <p className="text-xl font-black text-[var(--gold)]">20% Rabatt</p>
                  </div>
                  <span className="ml-auto bg-[var(--red-main)] text-white text-[11px] font-bold px-3 py-1 rounded-full">-20%</span>
                </div>
              </div>
              <div className="flex p-4 lg:p-5 pt-2 lg:pt-3 flex-1 flex-col">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-5">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--gold)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">20% auf jedes Trikot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--gold)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Alle Ligen frei mischbar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--gold)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Heim- & Auswärts mixen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--gold)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Verschiedene Grössen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--gold)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Ideal für Mannschaften</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--gold)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Höchste Ersparnis pro Trikot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--gold)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Rabatt automatisch berechnet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--gold)] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Einzeln personalisierbar</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg px-3 py-2 text-xs text-gray-400 mb-4">
                  6× à CHF 49.90 = <span className="text-[var(--gold)] font-bold">CHF 239.50</span> <span className="text-gray-500 line-through ml-1">299.40</span>
                </div>
                <button
                  onClick={() => toggleBundle('6plus')}
                                    className={`w-full font-bold py-3 rounded-xl text-sm transition-all mt-auto ${activeBundle === '6plus' ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-[var(--gold)] text-black hover:scale-[1.02] animate-pulse-slow'}`}
                >
                  {activeBundle === '6plus' ? 'Bundle deaktivieren' : 'Bundle aktivieren & Trikots wählen'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: How it works (2 cols) */}
          <div className="lg:col-span-2">
            {/* === MOBILE: Title + Timeline === */}
            <h3 className="text-3xl md:text-3xl font-bold uppercase tracking-wide mb-6 text-center lg:hidden" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Wie funktioniert&apos;s?</h3>
            <div className="lg:hidden flex flex-col items-center">
              {/* U-Branch */}
              <div className="flex justify-center gap-16 mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[var(--gold)]/15 border-2 border-[var(--gold)]/40 flex flex-col items-center justify-center">
                    <span className="text-[var(--gold)] font-black text-3xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>3+</span>
                    <span className="text-[var(--gold)]/60 text-[11px] font-bold leading-none">15%</span>
                  </div>
                  <div className="w-0.5 h-5 bg-white/10 -mt-[1px]" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[var(--gold)]/25 border-2 border-[var(--gold)] flex flex-col items-center justify-center">
                    <span className="text-[var(--gold)] font-black text-3xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>6+</span>
                    <span className="text-[var(--gold)]/60 text-[11px] font-bold leading-none">20%</span>
                  </div>
                  <div className="w-0.5 h-5 bg-white/10 -mt-[1px]" />
                </div>
              </div>
              <div className="h-0.5 bg-white/10 -mt-[1px]" style={{ width: 'calc(4rem + 56px)' }} />
              <div className="w-0.5 h-3 bg-white/10 -mt-[1px]" />
              <div className="w-9 h-9 rounded-full bg-[var(--red-main)] text-white flex items-center justify-center font-bold text-base" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>1</div>
              <div className="w-0.5 h-3 bg-white/10" />

              {/* Step 1 card */}
              <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4 w-full">
                <h4 className="font-bold text-white mb-1 text-sm">Bundle wählen</h4>
                <p className="text-sm text-gray-400 leading-relaxed">Erhalte 15% Rabatt ab 3 Trikots oder 20% ab 6 Trikots.</p>
              </div>

              {/* Circle 2 */}
              <div className="w-0.5 h-4 bg-white/10" />
              <div className="w-9 h-9 rounded-full bg-[var(--red-main)] text-white flex items-center justify-center font-bold text-base" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>2</div>
              <div className="w-0.5 h-4 bg-white/10" />

              {/* Step 2 card */}
              <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4 w-full">
                <h4 className="font-bold text-white mb-1 text-sm">Trikots in den Warenkorb</h4>
                <p className="text-sm text-gray-400 leading-relaxed">Stöbere durch den Shop und lege deine Lieblings-Trikots in den Warenkorb.</p>
                <img src="/bundle-step2.png?v=6" alt="Trikot auswählen & Warenkorb" onClick={() => openLightbox('/bundle-step2.png?v=6')} className="mt-3 rounded-lg border border-white/10 w-full cursor-zoom-in hover:border-white/30 transition-colors" />
              </div>

              {/* Circle % */}
              <div className="w-0.5 h-4 bg-white/10" />
              <div className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm">%</div>
              <div className="w-0.5 h-4 bg-white/10" />

              {/* Step 3 card */}
              <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4 w-full">
                <h4 className="font-bold text-white mb-1 text-sm">Rabatt kassieren</h4>
                <p className="text-sm text-gray-400 leading-relaxed">Der Rabatt wird automatisch im Warenkorb angewendet.</p>
                <img src="/bundle-step3.png?v=3" alt="Rabatt im Warenkorb" onClick={() => openLightbox('/bundle-step3.png?v=3')} className="mt-3 rounded-lg border border-white/10 w-full cursor-zoom-in hover:border-white/30 transition-colors" />
              </div>

              {/* Circle 3 */}
              <div className="w-0.5 h-4 bg-white/10" />
              <div className="w-9 h-9 rounded-full bg-[var(--red-main)] text-white flex items-center justify-center font-bold text-base" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>3</div>
              <div className="w-0.5 h-4 bg-white/10" />

              {/* Step 4 card */}
              <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4 w-full">
                <h4 className="font-bold text-white mb-1 text-sm">Bestellung absenden</h4>
                <p className="text-sm text-gray-400 leading-relaxed">Gib deinen Namen und Kontakt an und sende die Bestellung ab. Du erhältst in Kürze deine Bestellbestätigung.</p>
              </div>
            </div>

            {/* === DESKTOP Timeline === */}
            <div className="hidden lg:block">
              {/* Timeline from Step 1 downward — original full-size cards */}
              <div className="relative">
                {/* Vertical line from Step 1 card horizontal connector down to bottom */}
                <div className="absolute w-0.5 bg-white/10" style={{ left: '17px', top: '40px', bottom: '40px' }} />

                <div className="flex flex-col gap-8">
                  {/* Step 1 card: Bundle wählen */}
                  <div className="relative">
                    <div className="flex items-center gap-4 relative">
                      <div className="w-9 flex-shrink-0" /> {/* spacer for circle already above */}
                      <div className="absolute h-0.5 bg-white/10" style={{ left: '19px', width: '33px', top: '50%' }} />
                      <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4 flex-1 z-10">
                        <h4 className="font-bold text-white mb-1 text-sm">Bundle wählen</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">Erhalte 15% Rabatt ab 3 Trikots oder 20% ab 6 Trikots.</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Trikots in den Warenkorb */}
                  <div className="relative">
                    <div className="flex items-center gap-4 relative">
                      <div className="w-9 h-9 rounded-full bg-[var(--red-main)] text-white flex items-center justify-center font-bold text-base flex-shrink-0 z-10" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>2</div>
                      <div className="absolute h-0.5 bg-white/10" style={{ left: '19px', width: '33px', top: '50%' }} />
                      <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4 flex-1 z-10">
                        <h4 className="font-bold text-white mb-1 text-sm">Trikots in den Warenkorb</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">Stöbere durch den Shop und lege deine Lieblings-Trikots in den Warenkorb.</p>
                        <img src="/bundle-step2.png?v=6" alt="Trikot auswählen & Warenkorb" onClick={() => openLightbox('/bundle-step2.png?v=6')} className="mt-3 rounded-lg border border-white/10 w-full cursor-zoom-in hover:border-white/30 transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Rabatt kassieren — with % icon */}
                  <div className="relative">
                    <div className="flex items-center gap-4 relative">
                      <div className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 z-10">%</div>
                      <div className="absolute h-0.5 bg-white/10" style={{ left: '19px', width: '33px', top: '50%' }} />
                      <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4 flex-1 z-10">
                        <h4 className="font-bold text-white mb-1 text-sm">Rabatt kassieren</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">Der Rabatt wird automatisch im Warenkorb angewendet.</p>
                        <img src="/bundle-step3.png?v=3" alt="Rabatt im Warenkorb" onClick={() => openLightbox('/bundle-step3.png?v=3')} className="mt-3 rounded-lg border border-white/10 w-full cursor-zoom-in hover:border-white/30 transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Bestellung absenden */}
                  <div className="relative">
                    <div className="flex items-center gap-4 relative">
                      <div className="w-9 h-9 rounded-full bg-[var(--red-main)] text-white flex items-center justify-center font-bold text-base flex-shrink-0 z-10" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>3</div>
                      <div className="absolute h-0.5 bg-white/10" style={{ left: '19px', width: '33px', top: '50%' }} />
                      <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4 flex-1 z-10">
                        <h4 className="font-bold text-white mb-1 text-sm">Bestellung absenden</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">Gib deinen Namen und Kontakt an und sende die Bestellung ab. Du erhältst in Kürze deine Bestellbestätigung.</p>
                      </div>
                    </div>
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
        <div className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div
            className={`${lbZoom ? 'overflow-scroll overscroll-contain w-full h-full' : 'flex items-center justify-center p-4'}`}
            style={lbZoom ? { WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' } : undefined}
            onClick={e => { e.stopPropagation(); if (lbZoom) setLbZoom(false); }}
          >
            <img
              src={lightbox}
              alt=""
              className={`rounded-lg select-none ${lbZoom ? 'min-w-[200vw] h-auto' : 'max-w-[95vw] max-h-[85vh] object-contain cursor-zoom-in'}`}
              style={lbZoom ? { touchAction: 'pan-x pan-y', pointerEvents: 'none' } : undefined}
              onClick={() => !lbZoom && setLbZoom(true)}
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
}
