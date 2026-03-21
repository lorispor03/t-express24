'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import SearchOverlay from './SearchOverlay';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bounce, setBounce] = useState(false);
  const prevItems = useRef(0);
  const { totalItems, setCartOpen } = useCart();

  useEffect(() => {
    if (totalItems > prevItems.current) {
      setBounce(true);
      setTimeout(() => setBounce(false), 400);
    }
    prevItems.current = totalItems;
  }, [totalItems]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[var(--red-main)] text-white text-xs py-1.5 overflow-hidden whitespace-nowrap">
        <div className="announcement-scroll inline-flex gap-16">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="inline-flex gap-16">
              <span>Lieferzeit: 2-3 Wochen</span>
              <span>Qualitätsgeprüft in der Schweiz</span>
              <span>Preise in CHF</span>
              <span>Jedes Trikot einzeln geprüft</span>
              <span>Über 5700 Trikots verfügbar</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-[#111]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image src="/logo.png" alt="T-EXPRESS24" width={40} height={40} className="rounded-lg" />
            <span className="font-extrabold text-lg tracking-tight hidden sm:inline">T-EXPRESS<span className="text-[var(--gold)]">24</span></span>
          </Link>

          {/* Search bar - Desktop: visible in center */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-auto bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-400 hover:border-white/20 hover:bg-white/[0.07] transition-colors cursor-text"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Team oder Trikot suchen...
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium flex-shrink-0">
            <Link href="/#ligen" className="hover:text-[var(--gold)] transition-colors">Ligen</Link>
            <Link href="/#so-funktionierts" className="hover:text-[var(--gold)] transition-colors">So funktioniert&apos;s</Link>
            <Link href="/#faq" className="hover:text-[var(--gold)] transition-colors">FAQ</Link>
            <div className="flex items-center gap-4 ml-1 pl-4 border-l border-white/10">
              <a href="https://instagram.com/T_express247" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors" title="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative hover:text-[var(--gold)] transition-colors"
                title="Warenkorb"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {totalItems > 0 && (
                  <span className={`absolute -top-2 -right-2 bg-[var(--red-main)] text-white text-[10px] font-bold min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center transition-transform ${bounce ? 'scale-150' : 'scale-100'}`}>
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </nav>

          {/* Mobile: Search + Social + Cart + Burger */}
          <div className="flex items-center gap-3 md:hidden ml-auto">
            <a href="https://instagram.com/T_express247" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            {/* Cart Button Mobile */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-gray-400 hover:text-[var(--gold)]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--red-main)] text-white text-[10px] font-bold min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2" aria-label="Menu">
              <div className="space-y-1.5">
                <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden px-4 pb-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-400 active:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Team oder Trikot suchen...
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#111] border-t border-white/10 px-4 py-4 space-y-3">
            <Link href="/#ligen" onClick={() => setMenuOpen(false)} className="block text-sm font-medium hover:text-[var(--gold)]">Ligen</Link>
            <Link href="/#so-funktionierts" onClick={() => setMenuOpen(false)} className="block text-sm font-medium hover:text-[var(--gold)]">So funktioniert&apos;s</Link>
            <Link href="/#faq" onClick={() => setMenuOpen(false)} className="block text-sm font-medium hover:text-[var(--gold)]">FAQ</Link>
          </div>
        )}
      </header>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
