'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getAllLeagues } from '@/lib/data';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const leagues = getAllLeagues();
  const mainLeagues = ['premier-league', 'la-liga', 'bundesliga', 'serie-a', 'ligue-1'];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[var(--red-main)] text-white text-xs py-1.5 overflow-hidden whitespace-nowrap">
        <div className="announcement-scroll inline-flex gap-16">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="inline-flex gap-16">
              <span>🚚 Lieferzeit: 2-3 Wochen</span>
              <span>✅ Qualitätsgeprüft in der Schweiz</span>
              <span>💰 Preise in CHF</span>
              <span>📦 Jedes Trikot einzeln geprüft</span>
              <span>⚽ Über 6500 Trikots verfügbar</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-[#111]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--red-main)] rounded-lg flex items-center justify-center font-black text-white text-lg">T</div>
            <span className="font-extrabold text-xl tracking-tight">T-EXPRESS<span className="text-[var(--gold)]">24</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-[var(--gold)] transition-colors">Home</Link>
            {mainLeagues.map(slug => {
              const league = leagues[slug];
              if (!league) return null;
              return (
                <Link key={slug} href={`/league/${slug}`} className="hover:text-[var(--gold)] transition-colors">
                  {league.name}
                </Link>
              );
            })}
            <Link href="/leagues" className="hover:text-[var(--gold)] transition-colors">Alle Ligen</Link>
          </nav>

          {/* Mobile burger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2" aria-label="Menu">
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#111] border-t border-white/10 px-4 py-4 space-y-3">
            <Link href="/" onClick={() => setMenuOpen(false)} className="block text-sm font-medium hover:text-[var(--gold)]">Home</Link>
            {Object.entries(leagues).map(([slug, league]) => (
              <Link key={slug} href={`/league/${slug}`} onClick={() => setMenuOpen(false)} className="block text-sm font-medium hover:text-[var(--gold)]">
                {league.name}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
