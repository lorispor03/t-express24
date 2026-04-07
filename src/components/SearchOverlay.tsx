'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { searchProducts, searchTeams } from '@/lib/data';
import { Product } from '@/lib/types';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  'Barcelona', 'Real Madrid', 'Manchester United', 'Bayern München',
  'Liverpool', 'AC Milan', 'Juventus', 'Arsenal',
  'Deutschland', 'Brasilien', 'Retro',
];

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

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [displayQuery, setDisplayQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [teams, setTeams] = useState<Array<{ id: string; name: string; leagueName: string; productCount: number }>>([]);
  const [products, setProducts] = useState<Array<{ teamId: string; teamName: string; product: Product }>>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setDisplayQuery('');
      setTeams([]);
      setProducts([]);
      setRecentSearches(getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // ESC zum Schließen
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const doSearch = useCallback((q: string) => {
    if (q.trim().length < 2) {
      setTeams([]);
      setProducts([]);
      setLoading(false);
      return;
    }
    setTeams(searchTeams(q.trim(), 5));
    setProducts(searchProducts(q.trim(), 12));
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
  };

  const clearSearch = () => {
    setDisplayQuery('');
    setQuery('');
    setTeams([]);
    setProducts([]);
    inputRef.current?.focus();
  };

  const handleResultClick = () => {
    if (displayQuery.trim().length >= 2) {
      saveRecentSearch(displayQuery.trim());
    }
    onClose();
  };

  if (!open) return null;

  const hasResults = teams.length > 0 || products.length > 0;
  const showNoResults = query.trim().length >= 2 && !hasResults && !loading;
  const showSuggestions = displayQuery.trim().length === 0;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="max-w-2xl mx-auto px-4 pt-20" onClick={e => e.stopPropagation()}>
        {/* Search input */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={displayQuery}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Team oder Trikot suchen..."
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-20 py-4 text-base focus:outline-none focus:border-[var(--red-main)] transition-colors"
          />
          {displayQuery ? (
            <button onClick={clearSearch} className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
          <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-wider font-medium">
            ESC
          </button>
        </div>

        {/* Suggestions when empty */}
        {showSuggestions && (
          <div className="mt-4 bg-[#1a1a1a] border border-white/10 rounded-xl p-4">
            {recentSearches.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-2">Letzte Suchen</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(term => (
                    <button
                      key={term}
                      onClick={() => quickSearch(term)}
                      className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-sm text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
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
                    onClick={() => quickSearch(term)}
                    className="bg-white/5 hover:bg-[var(--red-main)]/20 hover:text-[var(--red-main)] text-sm text-gray-400 px-3 py-1.5 rounded-lg transition-colors"
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
          <div className="mt-4 text-center">
            <div className="inline-block w-5 h-5 border-2 border-gray-600 border-t-[var(--red-main)] rounded-full animate-spin" />
          </div>
        )}

        {/* Results */}
        {query.trim().length >= 2 && !loading && (
          <div className="mt-4 bg-[#1a1a1a] border border-white/10 rounded-xl max-h-[60vh] overflow-y-auto">
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
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div>
                      <span className="text-sm font-medium text-white">{team.name}</span>
                      <span className="text-xs text-gray-500 ml-2">{team.leagueName}</span>
                    </div>
                    <span className="text-xs text-gray-500">{team.productCount} Artikel</span>
                  </Link>
                ))}
              </div>
            )}

            {teams.length > 0 && products.length > 0 && (
              <div className="border-t border-white/5" />
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
                      className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors"
                    >
                      <div className="aspect-square overflow-hidden bg-white">
                        <img src={product.i} alt={product.t} className="w-full h-full object-contain p-1" loading="lazy" />
                      </div>
                      <div className="p-2">
                        <p className="text-[10px] text-gray-500">{teamName}</p>
                        <p className="text-[11px] text-gray-300 line-clamp-1">{product.t}</p>
                        <p className="text-xs font-bold text-[var(--gold)] mt-0.5">CHF {product.p}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
