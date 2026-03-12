'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="T-EXPRESS24" width={40} height={40} className="rounded-lg" />
            <span className="font-extrabold text-lg tracking-tight hidden sm:inline">T-EXPRESS<span className="text-[var(--gold)]">24</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <a href="#ligen" className="hover:text-[var(--gold)] transition-colors">Ligen</a>
            <a href="#so-funktionierts" className="hover:text-[var(--gold)] transition-colors">So funktioniert&apos;s</a>
            <a href="#faq" className="hover:text-[var(--gold)] transition-colors">FAQ</a>
            <div className="flex items-center gap-4 ml-2 pl-4 border-l border-white/10">
              <a href="https://instagram.com/T_express247" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors" title="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://t.me/BOT_USERNAME" target="_blank" rel="noopener noreferrer" className="hover:text-[#2AABEE] transition-colors" title="Telegram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
            </div>
          </nav>

          {/* Mobile: Social icons + burger */}
          <div className="flex items-center gap-3 md:hidden">
            <a href="https://instagram.com/T_express247" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://t.me/BOT_USERNAME" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#2AABEE]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2" aria-label="Menu">
              <div className="space-y-1.5">
                <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#111] border-t border-white/10 px-4 py-4 space-y-3">
            <a href="#ligen" onClick={() => setMenuOpen(false)} className="block text-sm font-medium hover:text-[var(--gold)]">Ligen</a>
            <a href="#so-funktionierts" onClick={() => setMenuOpen(false)} className="block text-sm font-medium hover:text-[var(--gold)]">So funktioniert&apos;s</a>
            <a href="#faq" onClick={() => setMenuOpen(false)} className="block text-sm font-medium hover:text-[var(--gold)]">FAQ</a>
          </div>
        )}
      </header>
    </>
  );
}
