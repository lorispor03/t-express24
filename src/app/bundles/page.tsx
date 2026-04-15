'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import ScrollReveal from '@/components/ScrollReveal';

export default function BundlesPage() {
  const { activeBundle, setActiveBundle } = useCart();
  const router = useRouter();
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [lbZoom, setLbZoom] = useState(false);
  const openLightbox = (src: string) => { setLightbox(src); setLbZoom(false); };
  const [glowOn, setGlowOn] = useState(true);
  const [scrollHint, setScrollHint] = useState(true);
  const [revealedSteps, setRevealedSteps] = useState<Set<number>>(new Set());
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const id = setInterval(() => setGlowOn(v => !v), 800);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 30) setScrollHint(false);
      // Reveal steps when they enter viewport
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 40) {
          setRevealedSteps(prev => {
            if (prev.has(i)) return prev;
            const next = new Set(prev);
            next.add(i);
            return next;
          });
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial check
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleBundle = (type: '3plus' | '6plus' | '10plus') => {
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
        <div className="relative max-w-[1440px] mx-auto px-4 py-5 md:py-8">
          <nav className="flex items-center gap-2 text-base md:text-sm text-gray-400 mb-2 md:mb-4 py-1">
            <Link href="/" className="hover:text-white transition-colors py-1 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>Home</Link>
            <span>/</span>
            <span className="text-white">Bundles</span>
          </nav>
          <div className="flex items-center gap-5 min-h-[128px] sm:min-h-[144px]">
            <div className="w-20 h-20 md:w-32 md:h-32 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-3 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full text-[var(--red-main)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                {/* Vorderes Tag */}
                <path d="M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z" />
                {/* Hinteres Tag */}
                <path d="M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193" />
                {/* Loch */}
                <circle cx="10.5" cy="6.5" r=".5" fill="currentColor" />
                {/* % Zeichen */}
                <circle cx="12.2" cy="10.2" r="0.7" />
                <circle cx="15.2" cy="13.2" r="0.7" />
                <line x1="11.5" y1="14" x2="15.9" y2="9.4" strokeWidth={0.9} />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Trikot Bundles
              </h1>
              <p className="text-gray-300 mt-1 text-sm md:text-base max-w-xl">
                Mehr Trikots, mehr Rabatt. Je mehr du bestellst, desto günstiger wird jedes einzelne Trikot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Graues Feld unter Hero */}
      <div className="border-b border-white/10 bg-[var(--red-main)]/5 lg:bg-[#111] overflow-visible relative z-10">
        <div className="max-w-[1440px] mx-auto px-4 pt-4 pb-0 lg:pt-6 lg:pb-0">
          <div className="flex flex-col items-center">
            <div className="relative w-full lg:bg-[var(--red-main)]/5 lg:backdrop-blur-md lg:rounded-xl lg:px-8 lg:py-5 lg:border lg:border-[var(--red-main)]/10 flex flex-col items-center py-3 lg:py-5 mb-2">
              <div className="flex items-center justify-center gap-6 lg:gap-12 w-full">
                <div className="flex flex-col items-center gap-1.5">
                  <svg className="w-11 h-11 text-white/25" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
                  <span className="text-[10px] text-white/30 uppercase tracking-wider">Sparen</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <svg className="w-11 h-11 text-white/25" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10V5.5a1.5 1.5 0 00-3 0L8 14v6h11.5a2 2 0 002-1.7l1.1-7.3a2 2 0 00-2-2.3h-7.1zM8 14H5v6h3" /></svg>
                  <span className="text-[10px] text-white/30 uppercase tracking-wider">Empfohlen</span>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl lg:text-6xl font-bold uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Jetzt profitieren</h3>
                  <p className="text-white/25 text-xs lg:text-sm mt-1">Profitiere mit Freunden, Familie oder deinem Team — legt eure Trikots zusammen und spart gemeinsam bis zu 30%.</p>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <svg className="w-11 h-11 text-white/25" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><circle cx="8.25" cy="8.25" r="2.25" /><circle cx="15.75" cy="15.75" r="2.25" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5L4.5 19.5" /></svg>
                  <span className="text-[10px] text-white/30 uppercase tracking-wider">Rabatt</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <svg className="w-11 h-11 text-white/25" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                  <span className="text-[10px] text-white/30 uppercase tracking-wider">Geschenk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bundle Cards */}
      <section className="max-w-[1440px] mx-auto px-4 pt-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* 3+ Trikots = 15% */}
            <div className={`relative bg-[#1a1a1a] rounded-2xl border-2 overflow-hidden flex flex-col ${activeBundle === '3plus' ? 'border-green-400/50' : 'border-white/15'}`}>
              {activeBundle === '3plus' ? (
                <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center text-xs font-bold py-1.5 uppercase tracking-widest z-10">
                  Aktiv
                </div>
              ) : (
                <div className="absolute top-0 left-0 right-0 bg-[#2a2d30] text-[#a8b0b8] text-center text-xs font-bold py-1.5 uppercase tracking-widest z-10">
                  Starter Bundle
                </div>
              )}
              <div className="relative bg-gradient-to-br from-[var(--red-dark)]/60 to-transparent px-6 py-5 pt-10">
                <div className="flex items-center gap-4">
                  <span className="text-6xl font-black text-white leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>3+</span>
                  <div>
                    <p className="text-sm font-bold text-white">Ab 3 Trikots</p>
                    <p className="text-xl font-black text-[#a8b0b8]">15% Rabatt</p>
                  </div>
                  <span className="ml-auto bg-[var(--red-main)] text-white text-[11px] font-bold px-3 py-1 rounded-full">-15%</span>
                </div>
              </div>
              <div className="flex p-4 lg:p-5 pt-2 lg:pt-3 flex-1 flex-col">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-5">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#a8b0b8] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">15% auf jedes Trikot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#a8b0b8] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Rabatt automatisch berechnet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#a8b0b8] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Bereits ab 3 Trikots</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg px-3 py-2 text-xs text-gray-400 mb-4">
                  3× à CHF 49.90 = <span className="text-[#a8b0b8] font-bold">CHF 127.25</span> <span className="text-gray-500 line-through ml-1">149.70</span>
                </div>
                <button
                  onClick={() => toggleBundle('3plus')}
                                    style={activeBundle !== '3plus' ? { transition: 'box-shadow 0.4s ease-in-out, opacity 0.4s ease-in-out', boxShadow: glowOn ? '0 0 12px rgba(168,176,184,0.4), 0 0 24px rgba(168,176,184,0.15)' : '0 0 4px rgba(168,176,184,0.1)', opacity: glowOn ? 1 : 0.85 } : {}}
                                    className={`w-full font-bold py-3 rounded-xl text-sm transition-all mt-auto ${activeBundle === '3plus' ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-[#a8b0b8] text-black hover:scale-[1.02]'}`}
                >
                  {activeBundle === '3plus' ? 'Bundle deaktivieren' : 'Bundle aktivieren & Trikots wählen'}
                </button>
              </div>
            </div>

            {/* 6+ Trikots = 20% */}
            <div className={`relative bg-[#1a1a1a] rounded-2xl border-2 overflow-hidden flex flex-col ${activeBundle === '6plus' ? 'border-green-400/50' : 'border-[#b89a50]/40'}`}>
              {activeBundle === '6plus' ? (
                <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center text-xs font-bold py-1.5 uppercase tracking-widest z-10">
                  Aktiv
                </div>
              ) : (
                <div className="absolute top-0 left-0 right-0 bg-[#3a3020] text-[#b89a50] text-center text-xs font-bold py-1.5 uppercase tracking-widest z-10">
                  Bestes Preis-Leistungs-Verhältnis
                </div>
              )}
              <div className="relative bg-gradient-to-br from-[var(--red-dark)]/60 to-transparent px-6 py-5 pt-10">
                <div className="flex items-center gap-4">
                  <span className="text-6xl font-black text-white leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>6+</span>
                  <div>
                    <p className="text-sm font-bold text-white">Ab 6 Trikots</p>
                    <p className="text-xl font-black text-[#b89a50]">20% Rabatt</p>
                  </div>
                  <span className="ml-auto bg-[var(--red-main)] text-white text-[11px] font-bold px-3 py-1 rounded-full">-20%</span>
                </div>
              </div>
              <div className="flex p-4 lg:p-5 pt-2 lg:pt-3 flex-1 flex-col">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-5">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b89a50] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">20% auf jedes Trikot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b89a50] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Ideal für Mannschaften</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b89a50] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Rabatt automatisch berechnet</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg px-3 py-2 text-xs text-gray-400 mb-4">
                  6× à CHF 49.90 = <span className="text-[#b89a50] font-bold">CHF 239.50</span> <span className="text-gray-500 line-through ml-1">299.40</span>
                </div>
                <button
                  onClick={() => toggleBundle('6plus')}
                                    style={activeBundle !== '6plus' ? { transition: 'box-shadow 0.4s ease-in-out, opacity 0.4s ease-in-out', boxShadow: glowOn ? '0 0 12px rgba(240,167,62,0.4), 0 0 24px rgba(240,167,62,0.15)' : '0 0 4px rgba(240,167,62,0.1)', opacity: glowOn ? 1 : 0.85 } : {}}
                                    className={`w-full font-bold py-3 rounded-xl text-sm transition-all mt-auto ${activeBundle === '6plus' ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-[var(--gold)] text-black hover:scale-[1.02]'}`}
                >
                  {activeBundle === '6plus' ? 'Bundle deaktivieren' : 'Bundle aktivieren & Trikots wählen'}
                </button>
              </div>
            </div>
            {/* 10+ Trikots = 25% */}
            <div className={`relative bg-[#1a1a1a] rounded-2xl border-2 overflow-hidden flex flex-col ${activeBundle === '10plus' ? 'border-green-400/50' : 'border-[#b066c4]/30'}`}>
              {activeBundle === '10plus' ? (
                <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center text-xs font-bold py-1.5 uppercase tracking-widest z-10">
                  Aktiv
                </div>
              ) : (
                <div className="absolute top-0 left-0 right-0 bg-[#2a2030] text-[#b066c4] text-center text-xs font-bold py-1.5 uppercase tracking-widest z-10">
                  Team Bundle
                </div>
              )}
              <div className="relative bg-gradient-to-br from-[var(--red-dark)]/60 to-transparent px-6 py-5 pt-10">
                <div className="flex items-center gap-4">
                  <span className="text-6xl font-black text-white leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>10+</span>
                  <div>
                    <p className="text-sm font-bold text-white">Ab 10 Trikots</p>
                    <p className="text-xl font-black text-[#b066c4]">30% Rabatt</p>
                  </div>
                  <span className="ml-auto bg-[var(--red-main)] text-white text-[11px] font-bold px-3 py-1 rounded-full">-30%</span>
                </div>
              </div>
              <div className="flex p-4 lg:p-5 pt-2 lg:pt-3 flex-1 flex-col">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-5">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b066c4] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">30% auf jedes Trikot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b066c4] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Perfekt für Vereine & Teams</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b066c4] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Rabatt automatisch berechnet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b066c4] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Höchste Ersparnis pro Trikot</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg px-3 py-2 text-xs text-gray-400 mb-4">
                  10× à CHF 49.90 = <span className="text-[#b066c4] font-bold">CHF 349.30</span> <span className="text-gray-500 line-through ml-1">499.00</span>
                </div>
                <button
                  onClick={() => toggleBundle('10plus')}
                  style={activeBundle !== '10plus' ? { transition: 'box-shadow 0.4s ease-in-out, opacity 0.4s ease-in-out', boxShadow: glowOn ? '0 0 12px rgba(176,102,196,0.4), 0 0 24px rgba(176,102,196,0.15)' : '0 0 4px rgba(176,102,196,0.1)', opacity: glowOn ? 1 : 0.85 } : {}}
                  className={`w-full font-bold py-3 rounded-xl text-sm transition-all mt-auto ${activeBundle === '10plus' ? 'bg-[var(--red-main)]/15 text-[var(--red-main)] border border-[var(--red-main)]/30' : 'bg-[#b066c4] text-white hover:scale-[1.02]'}`}
                >
                  {activeBundle === '10plus' ? 'Bundle deaktivieren' : 'Bundle aktivieren & Trikots wählen'}
                </button>
              </div>
            </div>
        </div>
      </section>

      {/* Wie funktioniert's */}
      <div className="border-t border-b border-white/10 bg-[var(--red-main)]/5 lg:bg-[#111] overflow-visible relative z-10">
        <div className="max-w-[1440px] mx-auto px-4 pt-4 pb-0 lg:pt-6 lg:pb-0">
          <div className="flex flex-col items-center">
            <div className="relative w-full lg:bg-[var(--red-main)]/5 lg:backdrop-blur-md lg:rounded-xl lg:px-8 lg:py-5 lg:border lg:border-[var(--red-main)]/10 flex flex-col items-center py-3 lg:py-5 mb-2">
              <div className="flex items-center justify-center gap-4 lg:gap-6 w-full">
                <svg className="w-20 h-20 text-white/25 flex-shrink-0" viewBox="0 0 100 100" fill="currentColor">
                  {/* Grosses Zahnrad */}
                  <path d="M40.6 11.2l-2.8 8.4c-2.4.7-4.6 1.8-6.6 3.2l-8.2-3.2-5.8 10 6.4 6c-.4 1.4-.6 2.9-.6 4.4s.2 3 .6 4.4l-6.4 6 5.8 10 8.2-3.2c2 1.4 4.2 2.5 6.6 3.2l2.8 8.4h11.6l2.8-8.4c2.4-.7 4.6-1.8 6.6-3.2l8.2 3.2 5.8-10-6.4-6c.4-1.4.6-2.9.6-4.4s-.2-3-.6-4.4l6.4-6-5.8-10-8.2 3.2c-2-1.4-4.2-2.5-6.6-3.2l-2.8-8.4H40.6zM46.4 30c5.5 0 10 4.5 10 10s-4.5 10-10 10-10-4.5-10-10 4.5-10 10-10z" fillRule="evenodd" />
                  {/* Kleines Zahnrad */}
                  <path d="M72.8 55.6l-1.6 5c-1.4.4-2.8 1.1-4 1.9l-4.9-1.9-3.5 6 3.8 3.6c-.2.8-.4 1.7-.4 2.6s.1 1.8.4 2.6l-3.8 3.6 3.5 6 4.9-1.9c1.2.8 2.6 1.5 4 1.9l1.6 5h7l1.6-5c1.4-.4 2.8-1.1 4-1.9l4.9 1.9 3.5-6-3.8-3.6c.2-.8.4-1.7.4-2.6s-.1-1.8-.4-2.6l3.8-3.6-3.5-6-4.9 1.9c-1.2-.8-2.6-1.5-4-1.9l-1.6-5h-7zM76.3 66.8c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6z" fillRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-4xl lg:text-6xl font-bold uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Wie funktioniert&apos;s?</h3>
                  <p className="text-white/25 text-xs lg:text-sm max-w-sm">Schwierigkeiten? Hier findest du die Anleitung für deine Bundle-Bestellung.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden pb-10 -mb-10">
        {/* Marquee links */}
        <div aria-hidden className="hidden lg:block absolute inset-y-0 left-[calc(50%-40rem)] right-[calc(50%+18rem)] pointer-events-none">
          <div className="absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%, -50%) rotate(-90deg)', transformOrigin: 'center' }}>
            <div className="vmarquee-track text-white/[0.05] select-none" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(7rem, 13vw, 15rem)', letterSpacing: '0.1em', lineHeight: 1, whiteSpace: 'nowrap' }}>
              {Array.from({ length: 2 }).map((_, u) => <span key={u} className="flex items-center shrink-0">{Array.from({ length: 6 }).map((_, i) => <span key={i} className="flex items-center shrink-0"><span>T-EXPRESS24</span><span className="mx-[0.45em] text-white/[0.08]">•</span></span>)}</span>)}
            </div>
          </div>
        </div>
        {/* Marquee rechts */}
        <div aria-hidden className="hidden lg:block absolute inset-y-0 right-[calc(50%-40rem)] left-[calc(50%+18rem)] pointer-events-none">
          <div className="absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%, -50%) rotate(90deg)', transformOrigin: 'center' }}>
            <div className="vmarquee-track text-white/[0.05] select-none" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(7rem, 13vw, 15rem)', letterSpacing: '0.1em', lineHeight: 1, whiteSpace: 'nowrap' }}>
              {Array.from({ length: 2 }).map((_, u) => <span key={u} className="flex items-center shrink-0">{Array.from({ length: 6 }).map((_, i) => <span key={i} className="flex items-center shrink-0"><span>T-EXPRESS24</span><span className="mx-[0.45em] text-white/[0.08]">•</span></span>)}</span>)}
            </div>
          </div>
        </div>
      <section className="relative max-w-[1440px] mx-auto px-4 pt-6 pb-4">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-0 relative z-10">
          {/* Rabatt-Kreise + U-Branch */}
          <div className="flex justify-center gap-20 mb-0">
            <div className="w-14 h-14 rounded-full bg-[#a8b0b8]/15 border-2 border-[#a8b0b8]/40 flex flex-col items-center justify-center z-10">
              <span className="text-[#a8b0b8] font-black text-3xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>3+</span>
              <span className="text-[#a8b0b8]/60 text-[11px] font-bold leading-none">15%</span>
            </div>
            <div className="w-14 h-14 rounded-full bg-[var(--gold)]/25 border-2 border-[var(--gold)] flex flex-col items-center justify-center z-10">
              <span className="text-[var(--gold)] font-black text-3xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>6+</span>
              <span className="text-[var(--gold)]/60 text-[11px] font-bold leading-none">20%</span>
            </div>
            <div className="w-14 h-14 rounded-full bg-[#b066c4]/20 border-2 border-[#b066c4]/60 flex flex-col items-center justify-center z-10">
              <span className="text-[#b066c4] font-black text-3xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>10+</span>
              <span className="text-[#b066c4]/60 text-[11px] font-bold leading-none">30%</span>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative" style={{ width: '17rem', height: '22px', borderBottom: '2px solid rgba(255,255,255,0.1)', borderLeft: '2px solid rgba(255,255,255,0.1)', borderRight: '2px solid rgba(255,255,255,0.1)', borderRadius: '0 0 6px 6px' }}>
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2" />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-0.5 h-4 bg-white/10" />
          </div>
          {/* Step 1 */}
          <div ref={el => { stepRefs.current[0] = el; }} className="w-full relative z-10" style={{ opacity: revealedSteps.has(0) ? 1 : 0, transform: revealedSteps.has(0) ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' }}>
            <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4">
              <h4 className="font-bold text-white mb-1 text-sm">Bundle wählen</h4>
              <p className="text-sm text-gray-400 leading-relaxed">Erhalte 15% ab 3, 20% ab 6 oder 30% ab 10 Trikots.</p>
            </div>
          </div>
          {/* Connector 1 */}
          <div ref={el => { stepRefs.current[1] = el; }} className="flex flex-col items-center" style={{ opacity: revealedSteps.has(1) ? 1 : 0, transition: 'opacity 0.4s ease-out 0.1s' }}>
            <div className="w-0.5 h-3 bg-white/10" />
            <div className="w-8 h-8 rounded-full bg-[var(--red-main)] text-white flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>1</div>
            <div className="w-0.5 h-3 bg-white/10" />
          </div>
          {/* Step 2 */}
          <div ref={el => { stepRefs.current[2] = el; }} className="w-full" style={{ opacity: revealedSteps.has(2) ? 1 : 0, transform: revealedSteps.has(2) ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' }}>
            <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4">
              <h4 className="font-bold text-white mb-1 text-sm">Trikots in den Warenkorb</h4>
              <p className="text-sm text-gray-400 leading-relaxed">Stöbere durch den Shop und lege deine Lieblings-Trikots in den Warenkorb.</p>
              <img src="/bundle-step2.png?v=6" alt="Trikot auswählen & Warenkorb" onClick={() => openLightbox('/bundle-step2.png?v=6')} className="mt-3 rounded-lg border border-white/10 w-full cursor-zoom-in hover:border-white/30 transition-colors" />
            </div>
          </div>
          {/* Connector 2 */}
          <div ref={el => { stepRefs.current[3] = el; }} className="flex flex-col items-center" style={{ opacity: revealedSteps.has(3) ? 1 : 0, transition: 'opacity 0.4s ease-out 0.1s' }}>
            <div className="w-0.5 h-3 bg-white/10" />
            <div className="w-8 h-8 rounded-full bg-[var(--red-main)] text-white flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>2</div>
            <div className="w-0.5 h-3 bg-white/10" />
          </div>
          {/* Step 3 */}
          <div ref={el => { stepRefs.current[4] = el; }} className="w-full" style={{ opacity: revealedSteps.has(4) ? 1 : 0, transform: revealedSteps.has(4) ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' }}>
            <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4">
              <h4 className="font-bold text-white mb-1 text-sm">Rabatt kassieren</h4>
              <p className="text-sm text-gray-400 leading-relaxed">Der Rabatt wird automatisch im Warenkorb angewendet.</p>
              <img src="/bundle-step3.png?v=3" alt="Rabatt im Warenkorb" onClick={() => openLightbox('/bundle-step3.png?v=3')} className="mt-3 rounded-lg border border-white/10 w-full cursor-zoom-in hover:border-white/30 transition-colors" />
            </div>
          </div>
          {/* Connector 3 */}
          <div ref={el => { stepRefs.current[5] = el; }} className="flex flex-col items-center" style={{ opacity: revealedSteps.has(5) ? 1 : 0, transition: 'opacity 0.4s ease-out 0.1s' }}>
            <div className="w-0.5 h-3 bg-white/10" />
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">%</div>
            <div className="w-0.5 h-3 bg-white/10" />
          </div>
          {/* Step 4 */}
          <div ref={el => { stepRefs.current[6] = el; }} className="w-full" style={{ opacity: revealedSteps.has(6) ? 1 : 0, transform: revealedSteps.has(6) ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' }}>
            <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4">
              <h4 className="font-bold text-white mb-1 text-sm">Bestellung absenden</h4>
              <p className="text-sm text-gray-400 leading-relaxed">Gib deinen Namen und Kontakt an und sende die Bestellung ab. Du erhältst in Kürze deine Bestellbestätigung.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Mobile Scroll Hint — rotes Pulsieren am unteren Rand */}
      {scrollHint && (
        <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none lg:hidden">
          <div className="h-20 bg-gradient-to-t from-[var(--red-main)]/40 to-transparent animate-[scroll-pulse_0.6s_ease-in-out_infinite_alternate]" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
            <svg className="w-5 h-5 text-white/70 animate-bounce" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
            </svg>
          </div>
        </div>
      )}

      </div>

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
