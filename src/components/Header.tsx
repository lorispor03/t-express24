'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { searchProducts, searchTeams } from '@/lib/data';
import { Product } from '@/lib/types';

const POPULAR_SEARCHES = [
  'Barcelona', 'Real Madrid', 'Manchester United', 'Bayern München',
  'Liverpool', 'AC Milan', 'Juventus', 'Arsenal',
  'Deutschland', 'Brasilien', 'Inter Mailand',
];

const JERSEY_CATS = new Set(['fan', 'player', 'retro', 'longsleeve', 'kids', 'kids-retro', 'female']);

function searchResultPriority(p: Product): number {
  const t = p.t.toLowerCase();
  const isJersey = /trikot|jersey/i.test(p.t);
  const isRetro = p.c.includes('retro') || p.c.includes('kids-retro');
  const isCurrent = /25\/26|26\/27|wm 2026/i.test(p.t);
  const isPrevSeason = /24\/25/.test(p.t);

  // Current season jerseys first
  if (isJersey && isCurrent) return 0;
  if (isJersey && isPrevSeason) return 1;
  // Retro jerseys
  if (isJersey && isRetro) return 2;
  // Other current season (longsleeve etc.)
  if (isCurrent) return 3;
  // Other jerseys with season
  if (isJersey) return 4;
  // Retro non-jersey
  if (isRetro) return 5;
  // Everything else (t-shirts etc.)
  return 6;
}

const RECENT_KEY = 'te24_recent_searches';

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').slice(0, 5);
  } catch { return []; }
}

function saveRecentSearch(q: string) {
  try {
    const recent = getRecentSearches().filter(r => r.toLowerCase() !== q.toLowerCase());
    recent.unshift(q);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 5)));
  } catch { /* noop */ }
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [bounce, setBounce] = useState(false);
  const prevItems = useRef(0);
  const pathname = usePathname();
  const isCheckout = pathname.startsWith('/checkout');
  const { totalItems, setCartOpen } = useCart();

  // Search state
  const [displayQuery, setDisplayQuery] = useState('');
  const [query, setQuery] = useState('');
  const [teams, setTeams] = useState<Array<{ id: string; name: string; leagueName: string; productCount: number }>>([]);
  const [products, setProducts] = useState<Array<{ teamId: string; teamName: string; product: Product }>>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (totalItems > prevItems.current) {
      setBounce(true);
      setTimeout(() => setBounce(false), 400);
    }
    prevItems.current = totalItems;
  }, [totalItems]);

  // Close dropdown on click outside
  useEffect(() => {
    if (!searchFocused) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const inDesktop = searchContainerRef.current?.contains(target);
      const inMobile = mobileSearchContainerRef.current?.contains(target);
      if (!inDesktop && !inMobile) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [searchFocused]);

  // Close on route change
  useEffect(() => {
    setSearchFocused(false);
    setDisplayQuery('');
    setQuery('');
    setTeams([]);
    setProducts([]);
  }, [pathname]);

  // ESC to close
  useEffect(() => {
    if (!searchFocused) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchFocused(false);
        inputRef.current?.blur();
        mobileInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [searchFocused]);

  const doSearch = useCallback((q: string) => {
    if (q.trim().length < 2) {
      setTeams([]);
      setProducts([]);
      setLoading(false);
      return;
    }
    setTeams(searchTeams(q.trim(), 5));
    const all = searchProducts(q.trim(), 60);
    const jerseys = all.filter(r => r.product.c.some(c => JERSEY_CATS.has(c)));
    jerseys.sort((a, b) => searchResultPriority(a.product) - searchResultPriority(b.product));
    setProducts(jerseys.slice(0, 12));
    setLoading(false);
  }, []);

  const handleSearch = useCallback((q: string) => {
    setDisplayQuery(q);
    setLoading(q.trim().length >= 2);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(q);
      doSearch(q);
    }, 200);
  }, [doSearch]);

  const quickSearch = (term: string) => {
    setDisplayQuery(term);
    setQuery(term);
    setLoading(true);
    doSearch(term);
    inputRef.current?.focus();
    mobileInputRef.current?.focus();
  };

  const clearSearch = () => {
    setDisplayQuery('');
    setQuery('');
    setTeams([]);
    setProducts([]);
    inputRef.current?.focus();
    mobileInputRef.current?.focus();
  };

  const handleResultClick = () => {
    if (displayQuery.trim().length >= 2) {
      saveRecentSearch(displayQuery.trim());
    }
    setSearchFocused(false);
  };

  const handleFocus = () => {
    setSearchFocused(true);
    setRecentSearches(getRecentSearches());
  };

  const hasResults = teams.length > 0 || products.length > 0;
  const showNoResults = query.trim().length >= 2 && !hasResults && !loading;
  const showSuggestions = displayQuery.trim().length === 0;

  const searchDropdown = (
    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-[70vh] overflow-y-auto z-[60]">
      {/* Suggestions when empty */}
      {showSuggestions && (
        <div className="p-4">
          {recentSearches.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-2">Letzte Suchen</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(term => (
                  <button
                    key={term}
                    onMouseDown={(e) => { e.preventDefault(); e.nativeEvent.stopImmediatePropagation(); quickSearch(term); }}
                    className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-sm text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-2">Beliebt</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map(term => (
                <button
                  key={term}
                  onMouseDown={(e) => { e.preventDefault(); e.nativeEvent.stopImmediatePropagation(); quickSearch(term); }}
                  className="bg-gray-100 hover:bg-[var(--red-main)]/20 hover:text-[var(--red-main)] text-sm text-gray-500 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="p-4 text-center">
          <div className="inline-block w-5 h-5 border-2 border-gray-600 border-t-[var(--red-main)] rounded-full animate-spin" />
        </div>
      )}

      {/* No results */}
      {showNoResults && (
        <div className="p-6 text-center">
          <p className="text-gray-500 text-sm mb-3">Keine Ergebnisse für &quot;{query}&quot;</p>
          <p className="text-gray-600 text-xs">Versuche es mit einem anderen Begriff, z.B. einem Teamnamen oder einer Saison.</p>
        </div>
      )}

      {/* Teams */}
      {teams.length > 0 && (
        <div className="p-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium px-2 mb-2">Teams</p>
          {teams.map(team => (
            <Link
              key={team.id}
              href={`/team/${team.id}`}
              onClick={handleResultClick}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <span className="text-sm font-medium text-gray-900">{team.name}</span>
                <span className="text-xs text-gray-500 ml-2">{team.leagueName}</span>
              </div>
              <span className="text-xs text-gray-500">{team.productCount} Artikel</span>
            </Link>
          ))}
        </div>
      )}

      {teams.length > 0 && products.length > 0 && (
        <div className="border-t border-gray-200" />
      )}

      {/* Products */}
      {products.length > 0 && (
        <div className="p-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium px-2 mb-2">Produkte</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {products.map(({ product, teamName }) => (
              <Link
                key={product.h}
                href={`/product/${product.h}`}
                onClick={handleResultClick}
                className="bg-gray-100 rounded-lg overflow-hidden border border-gray-400 hover:bg-gray-200 transition-colors"
              >
                <div className="aspect-square overflow-hidden bg-white">
                  <img src={product.i} alt={product.t} className="w-full h-full object-contain p-1" loading="lazy" />
                </div>
                <div className="p-2">
                  <p className="text-[10px] text-gray-500">{teamName}</p>
                  <p className="text-[11px] text-gray-600 line-clamp-1">{product.t}</p>
                  <p className="text-xs font-bold text-[var(--gold)] mt-0.5">CHF {product.p}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Checkout: minimaler Header
  if (isCheckout) {
    return (
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-12 2xl:px-16 h-12 md:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="T-EXPRESS24" width={40} height={40} className="rounded-lg" />
            <span className="font-extrabold text-lg tracking-tight text-gray-900">T-EXPRESS<span className="text-[var(--gold)]">24</span></span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Announcement Bar */}
      <div className="relative bg-gradient-to-r from-[#a11b24] via-[var(--red-main)] to-[#a11b24] text-white text-xs py-1 md:py-1.5 overflow-hidden whitespace-nowrap">
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#a11b24] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#a11b24] to-transparent z-10 pointer-events-none" />
        <div className="announcement-scroll inline-flex">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="px-6">Qualitätsgeprüft in der Schweiz</span>
              <span className="text-white/50 text-2xl leading-none">•</span>
              <span className="px-6">Preise in CHF</span>
              <span className="text-white/50 text-2xl leading-none">•</span>
              <span className="px-6">Ständig neue Angebote</span>
              <span className="text-white/50 text-2xl leading-none">•</span>
              <span className="px-6">Jedes Trikot einzeln geprüft</span>
              <span className="text-white/50 text-2xl leading-none">•</span>
              <span className="px-6">Über 4500 Artikel verfügbar</span>
              <span className="text-white/50 text-2xl leading-none">•</span>
            </span>
          ))}
        </div>
        <div className="announcement-shimmer absolute inset-0 pointer-events-none" />
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-12 2xl:px-16 h-12 md:h-16 flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image src="/logo.png" alt="T-EXPRESS24" width={40} height={40} className="rounded-lg" />
            <span className="font-extrabold text-lg tracking-tight text-gray-900">T-EXPRESS<span className="text-[var(--gold)]">24</span></span>
          </Link>

          {/* Search bar - Desktop: inline input with dropdown */}
          <div ref={searchContainerRef} className="hidden md:block absolute left-1/2 -translate-x-1/2 w-full max-w-sm lg:max-w-md">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={displayQuery}
                onChange={e => handleSearch(e.target.value)}
                onFocus={handleFocus}
                placeholder="Team oder Trikot suchen..."
                className="w-full bg-[#d0d0d0] border border-gray-300 rounded-lg pl-10 pr-8 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[var(--red-main)] transition-colors"
              />
              {displayQuery && (
                <button onMouseDown={(e) => { e.preventDefault(); clearSearch(); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {searchFocused && searchDropdown}
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium flex-shrink-0 text-gray-700">
            <Link href="/#ligen" className="hover:text-[var(--gold)] transition-colors">Ligen</Link>
            <Link href="/#so-funktionierts" className="hover:text-[var(--gold)] transition-colors">So funktioniert&apos;s</Link>
            <Link href="/#faq" className="hover:text-[var(--gold)] transition-colors">FAQ</Link>
            {/* Chat Button */}
            <button
              onClick={() => window.dispatchEvent(new Event('open-chat'))}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform animate-chat-pulse"
              style={{ background: 'linear-gradient(135deg, var(--red-main), var(--red-dark))' }}
              title="Kundensupport"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <div className="flex items-center gap-4 ml-1 pl-4 border-l border-gray-200">
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

          {/* Mobile: Chat + Social + Cart + Burger */}
          <div className="flex items-center gap-3 md:hidden ml-auto">
            {/* Chat Button Mobile */}
            <button
              onClick={() => window.dispatchEvent(new Event('open-chat'))}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:scale-110 transition-transform animate-chat-pulse"
              style={{ background: 'linear-gradient(135deg, var(--red-main), var(--red-dark))' }}
              title="Kundensupport"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
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
                <span className={`block w-6 h-0.5 bg-gray-800 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-0.5 bg-gray-800 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile search bar - inline input */}
        <div ref={mobileSearchContainerRef} className="md:hidden px-4 pb-2 relative">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={mobileInputRef}
              type="text"
              value={displayQuery}
              onChange={e => handleSearch(e.target.value)}
              onFocus={handleFocus}
              placeholder="Team oder Trikot suchen..."
              className="w-full bg-[#d0d0d0] border border-gray-300 rounded-lg pl-9 pr-8 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[var(--red-main)] transition-colors"
            />
            {displayQuery && (
              <button onMouseDown={(e) => { e.preventDefault(); clearSearch(); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchFocused && searchDropdown}
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-2 divide-y divide-gray-200">
            <Link href="/#ligen" onClick={() => setMenuOpen(false)} className="block text-base font-medium text-gray-800 hover:text-[var(--gold)] py-4">Ligen</Link>
            <Link href="/#so-funktionierts" onClick={() => setMenuOpen(false)} className="block text-base font-medium text-gray-800 hover:text-[var(--gold)] py-4">So funktioniert&apos;s</Link>
            <Link href="/#faq" onClick={() => setMenuOpen(false)} className="block text-base font-medium text-gray-800 hover:text-[var(--gold)] py-4">FAQ</Link>
          </div>
        )}
      </header>
    </>
  );
}
