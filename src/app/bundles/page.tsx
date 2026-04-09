'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [glowOn, setGlowOn] = useState(true);
  const [scrollHint, setScrollHint] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setGlowOn(v => !v), 800);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 30) setScrollHint(false); };
    window.addEventListener('scroll', onScroll, { passive: true });
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
              Kombiniere deine Lieblings-Trikots und profitiere von exklusiven Mengenrabatten — ab 3 Stück automatisch im Warenkorb.
            </p>
          </div>
        </div>
      </section>

      {/* Graues Feld unter Hero */}
      <div className="border-b border-white/10 bg-[var(--red-main)]/5 lg:bg-[#111]">
        <div className="max-w-7xl mx-auto px-4 py-4 lg:py-6">
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-5 lg:gap-6">
            {/* Container 1: Wähle dein Bundle */}
            <div className="lg:col-span-3 lg:bg-[var(--red-main)]/5 lg:backdrop-blur-md lg:rounded-xl lg:px-5 lg:py-5 lg:border lg:border-[var(--red-main)]/10 flex flex-col items-center py-3">
              <h3 className="text-3xl lg:text-4xl font-bold uppercase tracking-wide text-center mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Wähle dein Bundle</h3>
              <div className="flex items-center gap-5 lg:gap-8">
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-11 h-11 text-white/25" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
                  <span className="text-xs text-white/30 uppercase tracking-wider">Sparen</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-11 h-11 text-white/25" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10V5.5a1.5 1.5 0 00-3 0L8 14v6h11.5a2 2 0 002-1.7l1.1-7.3a2 2 0 00-2-2.3h-7.1zM8 14H5v6h3" /></svg>
                  <span className="text-xs text-white/30 uppercase tracking-wider">Empfohlen</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-11 h-11 text-white/25" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><circle cx="8.25" cy="8.25" r="2.25" /><circle cx="15.75" cy="15.75" r="2.25" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5L4.5 19.5" /></svg>
                  <span className="text-xs text-white/30 uppercase tracking-wider">Rabatt</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-11 h-11 text-white/25" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                  <span className="text-xs text-white/30 uppercase tracking-wider">Geschenk</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-11 h-11 text-white/25" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" /></svg>
                  <span className="text-xs text-white/30 uppercase tracking-wider">Hot Deal</span>
                </div>
              </div>
            </div>

            {/* Container 2: Wie funktioniert's? */}
            <div className="lg:col-span-2 lg:bg-[var(--red-main)]/5 lg:backdrop-blur-md lg:rounded-xl lg:px-5 lg:py-5 lg:border lg:border-[var(--red-main)]/10 flex flex-col items-center py-3 border-t border-white/10 lg:border-t-0">
              <h3 className="text-3xl lg:text-4xl font-bold uppercase tracking-wide text-center mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Wie funktioniert&apos;s?</h3>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-11 h-11 text-white/25" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" /></svg>
                  <span className="text-xs text-white/30 uppercase tracking-wider">Wählen</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-11 h-11 text-white/25" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                  <span className="text-xs text-white/30 uppercase tracking-wider">Sammeln</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-11 h-11 text-white/25" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-xs text-white/30 uppercase tracking-wider">Sparen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bundles + How it works */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        {/* Karten-Bereich */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:items-start lg:relative">

          {/* Left: Bundle Cards — mit rotem Rahmen */}
          <div className="lg:col-span-3 lg:self-start lg:pb-4 relative overflow-hidden">
            <div className="grid grid-cols-1 gap-4 lg:gap-6">
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
                    <span className="text-sm text-gray-300">Alle Ligen frei mischbar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#a8b0b8] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Heim- & Auswärts mixen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#a8b0b8] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Verschiedene Grössen</span>
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
                    <span className="text-sm text-gray-300">Alle Ligen frei mischbar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b89a50] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Heim- & Auswärts mixen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b89a50] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Verschiedene Grössen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b89a50] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Ideal für Mannschaften</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b89a50] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Höchste Ersparnis pro Trikot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b89a50] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Rabatt automatisch berechnet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b89a50] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Einzeln personalisierbar</span>
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
                    <span className="text-sm text-gray-300">Alle Ligen frei mischbar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b066c4] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Heim- & Auswärts mixen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b066c4] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Verschiedene Grössen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b066c4] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Perfekt für Vereine & Teams</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b066c4] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Maximale Ersparnis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b066c4] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Rabatt automatisch berechnet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#b066c4] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-sm text-gray-300">Einzeln personalisierbar</span>
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
          </div>

          {/* Right: How it works */}
          <div className="lg:col-span-2 relative z-10 lg:pb-4">
            {/* === MOBILE: Title + Timeline === */}
            <h3 className="text-3xl md:text-3xl font-bold uppercase tracking-wide mb-6 text-center lg:hidden" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Wie funktioniert&apos;s?</h3>
            <div className="lg:hidden flex flex-col items-center">
              {/* U-Branch – same border approach as desktop */}
              <div className="flex justify-center gap-8 mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[#a8b0b8]/15 border-2 border-[#a8b0b8]/40 flex flex-col items-center justify-center z-10">
                    <span className="text-[#a8b0b8] font-black text-3xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>3+</span>
                    <span className="text-[#a8b0b8]/60 text-[11px] font-bold leading-none">15%</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[var(--gold)]/25 border-2 border-[var(--gold)] flex flex-col items-center justify-center z-10">
                    <span className="text-[var(--gold)] font-black text-3xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>6+</span>
                    <span className="text-[var(--gold)]/60 text-[11px] font-bold leading-none">20%</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[#b066c4]/20 border-2 border-[#b066c4]/60 flex flex-col items-center justify-center z-10">
                    <span className="text-[#b066c4] font-black text-3xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>10+</span>
                    <span className="text-[#b066c4]/60 text-[11px] font-bold leading-none">30%</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative" style={{ width: '11rem', height: '22px', borderBottom: '2px solid rgba(255,255,255,0.1)', borderLeft: '2px solid rgba(255,255,255,0.1)', borderRight: '2px solid rgba(255,255,255,0.1)', borderRadius: '0 0 6px 6px' }}>
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2" />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-3 bg-white/10" />
              </div>
              <div className="w-9 h-9 rounded-full bg-[var(--red-main)] text-white flex items-center justify-center font-bold text-base" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>1</div>
              <div className="w-0.5 h-3 bg-white/10" />

              {/* Step 1 card */}
              <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4 w-full">
                <h4 className="font-bold text-white mb-1 text-sm">Bundle wählen</h4>
                <p className="text-sm text-gray-400 leading-relaxed">Erhalte 15% ab 3, 20% ab 6 oder 30% ab 10 Trikots.</p>
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

            {/* === DESKTOP: Rabatt-Kreise + U-Branch === */}
            <div className="hidden lg:block">
              <div className="flex justify-center gap-20 mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[#a8b0b8]/15 border-2 border-[#a8b0b8]/40 flex flex-col items-center justify-center z-10">
                    <span className="text-[#a8b0b8] font-black text-3xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>3+</span>
                    <span className="text-[#a8b0b8]/60 text-[11px] font-bold leading-none">15%</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[var(--gold)]/25 border-2 border-[var(--gold)] flex flex-col items-center justify-center z-10">
                    <span className="text-[var(--gold)] font-black text-3xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>6+</span>
                    <span className="text-[var(--gold)]/60 text-[11px] font-bold leading-none">20%</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[#b066c4]/20 border-2 border-[#b066c4]/60 flex flex-col items-center justify-center z-10">
                    <span className="text-[#b066c4] font-black text-3xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>10+</span>
                    <span className="text-[#b066c4]/60 text-[11px] font-bold leading-none">30%</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative" style={{ width: '17rem', height: '22px', borderBottom: '2px solid rgba(255,255,255,0.1)', borderLeft: '2px solid rgba(255,255,255,0.1)', borderRight: '2px solid rgba(255,255,255,0.1)', borderRadius: '0 0 6px 6px' }}>
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2" />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-6 bg-white/10" />
              </div>
            </div>

            {/* === DESKTOP Timeline === */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute w-0.5 bg-white/10" style={{ left: '17px', top: '40px', bottom: '40px' }} />
                <div className="flex flex-col gap-6">
                  <div className="relative">
                    <div className="flex items-center gap-4 relative">
                      <div className="w-9 h-9 rounded-full bg-[var(--red-main)] text-white flex items-center justify-center font-bold text-base flex-shrink-0 z-10" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>1</div>
                      <div className="absolute h-0.5 bg-white/10" style={{ left: '19px', width: '33px', top: '50%' }} />
                      <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4 flex-1 z-10">
                        <h4 className="font-bold text-white mb-1 text-sm">Bundle wählen</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">Erhalte 15% ab 3, 20% ab 6 oder 30% ab 10 Trikots.</p>
                      </div>
                    </div>
                  </div>
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
